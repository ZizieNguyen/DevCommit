<?php

namespace Controllers;

use Model\Dia;
use Model\Hora;
use Model\Evento;
use Model\Paquete;
use Model\Ponente;
use Model\Usuario;
use Model\Registro;
use Model\Categoria;
use Model\EventosRegistros;
use Model\Regalo;
use Classes\Email;

class RegistroController {

    public static function simularPago() {
    // Registrar los datos recibidos para diagnóstico
    error_log("==================== INICIO SIMULACIÓN PAGO ====================");
    error_log("METHOD: " . $_SERVER['REQUEST_METHOD']);
    error_log("CONTENT_TYPE: " . $_SERVER['CONTENT_TYPE'] ?? 'No especificado');
    
    // Obtener y registrar los datos crudos
    $rawData = file_get_contents('php://input');
    error_log("RAW DATA: " . $rawData);
    
    // Intentar procesar JSON
    $datos = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("ERROR JSON: " . json_last_error_msg());
        echo json_encode([
            'error' => true,
            'msg' => 'Formato de datos inválido'
        ]);
        return;
    }
    
    error_log("DATOS PARSEADOS: " . print_r($datos, true));
    
    // Verificar el ID del usuario
    $usuario_id = $datos['usuario_id'] ?? null;
    
    if (!$usuario_id) {
        echo json_encode([
            'error' => true,
            'msg' => 'ID de usuario no proporcionado en la petición'
        ]);
        return;
    }
    
    try {
        // Conexión directa a la base de datos sin ORM (como en gratis())
        $conn = new \mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);
        
        if ($conn->connect_error) {
            throw new \Exception("Error de conexión: " . $conn->connect_error);
        }
        
        // Verificar si el usuario ya está registrado
        $usuario_id_escaped = $conn->real_escape_string((string)$usuario_id);
        $consulta = "SELECT * FROM registros WHERE usuario_id = '{$usuario_id_escaped}' LIMIT 1";
        
        $resultado = $conn->query($consulta);
        if (!$resultado) {
            throw new \Exception("Error en consulta: " . $conn->error);
        }
        
        if ($resultado->num_rows > 0) {
            echo json_encode([
                'error' => true,
                'msg' => 'Ya tienes un paquete registrado. Un usuario solo puede tener un tipo de boleto.'
            ]);
            return;
        }
        
        // Verificar que el usuario existe
        $consulta_usuario = "SELECT * FROM usuarios WHERE id = '{$usuario_id_escaped}' LIMIT 1";
        
        $resultado_usuario = $conn->query($consulta_usuario);
        if (!$resultado_usuario) {
            throw new \Exception("Error en consulta usuario: " . $conn->error);
        }
        
        if ($resultado_usuario->num_rows === 0) {
            echo json_encode([
                'error' => true,
                'msg' => 'Usuario no encontrado. Verifica tu sesión.'
            ]);
            return;
        }
        
        // Usuario encontrado, crear registro
        $usuario = $resultado_usuario->fetch_assoc();
        
        // Validar el paquete_id
        if (!isset($datos['paquete_id']) || ($datos['paquete_id'] != 1 && $datos['paquete_id'] != 2)) {
            echo json_encode([
                'error' => true,
                'msg' => 'Tipo de paquete inválido'
            ]);
            return;
        }
        
        // Validar regalo para paquete presencial
        if ($datos['paquete_id'] == 1 && !isset($datos['regalo_id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Debes seleccionar un regalo para el paquete presencial'
            ]);
            return;
        }
        
        // Token único
        $token = substr(md5(uniqid(rand(), true)), 0, 8);
        
        // Iniciar transacción para garantizar consistencia
        $conn->begin_transaction();
        
        try {
            // Insertar registro usando consulta preparada
            $stmt = $conn->prepare("INSERT INTO registros (paquete_id, pago_id, token, usuario_id, regalo_id) VALUES (?, ?, ?, ?, ?)");
            $paquete_id = (int)$datos['paquete_id'];
            $pago_id = $datos['pago_id'] ?? 'sim_' . time();
            $regalo_id = $datos['regalo_id'] ?? null;
            
            if (!$stmt) {
                throw new \Exception("Error preparando consulta: " . $conn->error);
            }
            
            $stmt->bind_param("isssi", $paquete_id, $pago_id, $token, $usuario_id_escaped, $regalo_id);
            $exito = $stmt->execute();
            
            if (!$exito) {
                throw new \Exception("Error insertando registro: " . $stmt->error);
            }
            
            // Verificar que se insertó correctamente
            if ($stmt->affected_rows <= 0) {
                throw new \Exception("No se pudo insertar el registro");
            }
            
            // Si todo está bien, confirmar la transacción
            $conn->commit();
            
            // Determinar mensaje según tipo de paquete
            $asunto = '';
            $mensaje = '';
            
            if ($paquete_id === 1) { // Presencial
                $asunto = 'Confirmación de Pase Presencial DevCommit';
                
                // Si hay regalo, obtenerlo
                $nombre_regalo = '';
                if ($regalo_id) {
                    $consulta_regalo = "SELECT nombre FROM regalos WHERE id = ?";
                    $stmt_regalo = $conn->prepare($consulta_regalo);
                    $stmt_regalo->bind_param("i", $regalo_id);
                    $stmt_regalo->execute();
                    $stmt_regalo->bind_result($nombre_regalo);
                    $stmt_regalo->fetch();
                    $stmt_regalo->close();
                }
                
                $mensaje = '<p>¡Gracias por adquirir tu pase presencial para DevCommit!</p>';
                $mensaje .= '<p><strong>Detalles de tu compra:</strong></p>';
                $mensaje .= '<ul>';
                $mensaje .= '<li>Pase: Presencial ($99)</li>';
                $mensaje .= '<li>Acceso: Completo a todas las conferencias y talleres</li>';
                if ($nombre_regalo) {
                    $mensaje .= '<li>Regalo seleccionado: ' . $nombre_regalo . '</li>';
                }
                $mensaje .= '<li>Token de registro: ' . $token . '</li>';
                $mensaje .= '</ul>';
                $mensaje .= '<p>Recuerda que tu pase incluye kit de bienvenida, comidas y coffee breaks durante el evento.</p>';
                
            } else if ($paquete_id === 2) { // Virtual
                $asunto = 'Confirmación de Pase Virtual DevCommit';
                $mensaje = '<p>¡Gracias por adquirir tu pase virtual para DevCommit!</p>';
                $mensaje .= '<p><strong>Detalles de tu compra:</strong></p>';
                $mensaje .= '<ul>';
                $mensaje .= '<li>Pase: Virtual ($49)</li>';
                $mensaje .= '<li>Acceso: Completo a todas las conferencias virtuales</li>';
                $mensaje .= '<li>Talleres virtuales interactivos</li>';
                $mensaje .= '<li>Token de registro: ' . $token . '</li>';
                $mensaje .= '</ul>';
                $mensaje .= '<p>Tu contenido estará disponible en la plataforma y las grabaciones por 30 días.</p>';
            }
            
            // Enviar correo de confirmación
            $email = new \Classes\Email(
                $usuario['email'],
                $usuario['nombre'] . ' ' . ($usuario['apellido'] ?? ''),
                ''
            );
            $email->enviarConfirmacionCompra($asunto, $mensaje);
            
            // Respuesta exitosa
            echo json_encode([
                'error' => false,
                'resultado' => true,
                'token' => $token,
                'msg' => 'Registro exitoso'
            ]);
            
        } catch (\Throwable $e) {
            // Si hay error, revertir la transacción
            $conn->rollback();
            throw $e; // Re-lanzar para que lo maneje el catch externo
        }
        
    } catch (\Throwable $e) {
        error_log("ERROR COMPLETO EN SIMULAR PAGO: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        echo json_encode([
            'error' => true,
            'msg' => 'Error interno del servidor: ' . $e->getMessage()
        ]);
    }
}

    public static function gratis() {
    // Registrar todos los encabezados y datos recibidos
    error_log("==================== INICIO DEPURACIÓN ====================");
    error_log("METHOD: " . $_SERVER['REQUEST_METHOD']);
    error_log("CONTENT_TYPE: " . $_SERVER['CONTENT_TYPE'] ?? 'No especificado');
    error_log("SESSION ID: " . session_id());
    error_log("SESSION DATA: " . print_r($_SESSION ?? [], true));
    
    // Obtener y registrar los datos crudos
    $rawData = file_get_contents('php://input');
    error_log("RAW DATA: " . $rawData);
    
    // Intentar procesar JSON
    $datos = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("ERROR JSON: " . json_last_error_msg());
    } else {
        error_log("DATOS PARSEADOS: " . print_r($datos, true));
    }
    
    // Registro directo en archivos para garantizar visibilidad
    $logDir = __DIR__ . '/../logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }

    // Escribir en el archivo de log
    file_put_contents($logDir . '/debug.log', 
        date('Y-m-d H:i:s') . " - PETICIÓN RECIBIDA\n" . 
        "RAW: " . $rawData . "\n" .
        "DATOS: " . print_r($datos ?? [], true) . "\n\n", 
        FILE_APPEND);
    
    // SOLUCIÓN: Siempre usar los datos enviados, sin depender de sesiones
    $usuario_id = $datos['usuario_id'] ?? null;
    
    if (!$usuario_id) {
        echo json_encode([
            'error' => true,
            'msg' => 'ID de usuario no proporcionado en la petición'
        ]);
        return;
    }
    
    try {
        // Conexión directa a la base de datos sin ORM
        $conn = new \mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);
        
        if ($conn->connect_error) {
            throw new \Exception("Error de conexión: " . $conn->connect_error);
        }
        
        // Depuración de la conexión
        error_log("CONEXIÓN DB: Exitosa");
        
        // Verificar si el usuario ya está registrado
        $usuario_id_escaped = $conn->real_escape_string((string)$usuario_id);
        $consulta = "SELECT * FROM registros WHERE usuario_id = '{$usuario_id_escaped}' LIMIT 1";
        error_log("SQL BUSCAR REGISTRO: " . $consulta);
        
        $resultado = $conn->query($consulta);
        if (!$resultado) {
            throw new \Exception("Error en consulta: " . $conn->error);
        }
        
        if ($resultado->num_rows > 0) {
            echo json_encode([
                'error' => true,
                'msg' => 'Ya tienes un paquete registrado. Un usuario solo puede tener un tipo de boleto.'
            ]);
            return;
        }
        
        // Verificar que el usuario existe
        $consulta_usuario = "SELECT * FROM usuarios WHERE id = '{$usuario_id_escaped}' LIMIT 1";
        error_log("SQL BUSCAR USUARIO: " . $consulta_usuario);
        
        $resultado_usuario = $conn->query($consulta_usuario);
        if (!$resultado_usuario) {
            throw new \Exception("Error en consulta usuario: " . $conn->error);
        }
        
        if ($resultado_usuario->num_rows === 0) {
            // Usuario no encontrado
            echo json_encode([
                'error' => true,
                'msg' => 'Usuario no encontrado. Verifica tu sesión.'
            ]);
            error_log("USUARIO NO ENCONTRADO CON ID: " . $usuario_id_escaped);
            return;
        }
        
        // Usuario encontrado, crear registro
        $usuario = $resultado_usuario->fetch_assoc();
        error_log("USUARIO ENCONTRADO: " . $usuario['email']);
        
        // Token único
        $token = substr(md5(uniqid(rand(), true)), 0, 8);
        
        // Insertar registro usando consulta preparada
        $stmt = $conn->prepare("INSERT INTO registros (paquete_id, pago_id, token, usuario_id) VALUES (?, ?, ?, ?)");
        $paquete_id = 3;
        $pago_id = 'free_' . time();
        
        if (!$stmt) {
            throw new \Exception("Error preparando consulta: " . $conn->error);
        }
        
        $stmt->bind_param("isss", $paquete_id, $pago_id, $token, $usuario_id_escaped);
        $exito = $stmt->execute();
        
        if (!$exito) {
            throw new \Exception("Error insertando registro: " . $stmt->error);
        }
        
        // PARTE MEJORADA: Enviar correo de confirmación más consistente con otras funciones
        // Crear asunto y mensaje para el plan gratuito
        $asunto = 'Confirmación de Registro Plan Gratuito - DevCommit';
        $mensaje = '<p>¡Gracias por registrarte en el plan gratuito de DevCommit!</p>';
        $mensaje .= '<p><strong>Detalles de tu registro:</strong></p>';
        $mensaje .= '<ul>';
        $mensaje .= '<li>Plan: Gratuito</li>';
        $mensaje .= '<li>Acceso: Conferencias virtuales básicas</li>';
        $mensaje .= '<li>Token de registro: ' . $token . '</li>';
        $mensaje .= '</ul>';
        $mensaje .= '<p>Puedes acceder a los eventos disponibles para tu plan desde tu cuenta.</p>';
        
        // Enviar el correo usando la clase Email
        error_log("Enviando email de confirmación a: " . $usuario['email']);
        $email = new \Classes\Email(
            $usuario['email'], 
            $usuario['nombre'] . ' ' . ($usuario['apellido'] ?? ''), 
            ''
        );
        $email->enviarConfirmacionCompra($asunto, $mensaje);
        
        // Si llegamos aquí, el registro fue exitoso
        echo json_encode([
            'error' => false,
            'msg' => 'Te has registrado correctamente al plan gratuito',
            'token' => $token
        ]);
        
    } catch (\Throwable $e) {
        error_log("ERROR COMPLETO: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        echo json_encode([
            'error' => true,
            'msg' => 'Error interno del servidor: ' . $e->getMessage()
        ]);
    }
}

    public static function gratisConId($usuario_id_url) {
        if (!$usuario_id_url) {
            echo json_encode([
                'error' => true,
                'msg' => 'ID de usuario no proporcionado en la URL'
            ]);
            return;
        }
        
        error_log("Usando método alternativo gratisConId con ID: $usuario_id_url");
        
        try {
            $conn = mysqli_connect($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);
            
            if (!$conn) {
                throw new \Exception("Error de conexión: " . mysqli_connect_error());
            }
            
            // Verificar si el usuario ya está registrado
            $usuario_id_escaped = mysqli_real_escape_string($conn, $usuario_id_url);
            $consulta = "SELECT * FROM registros WHERE usuario_id = '{$usuario_id_escaped}' LIMIT 1";
            
            $resultado = mysqli_query($conn, $consulta);
            
            if (mysqli_num_rows($resultado) > 0) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'Ya tienes un paquete registrado'
                ]);
                return;
            }
            
            // Verificar que el usuario existe
            $consulta_usuario = "SELECT * FROM usuarios WHERE id = '{$usuario_id_escaped}' LIMIT 1";
            $resultado_usuario = mysqli_query($conn, $consulta_usuario);
            
            if (mysqli_num_rows($resultado_usuario) === 0) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'Usuario no encontrado'
                ]);
                return;
            }
            
            // Generar token único
            $token = substr(md5(uniqid(rand(), true)), 0, 8);
            
            // Insertar el registro
            $insertar = "INSERT INTO registros (paquete_id, pago_id, token, usuario_id) 
                        VALUES (3, 'free_" . time() . "', '{$token}', '{$usuario_id_escaped}')";
            
            $resultado_insertar = mysqli_query($conn, $insertar);
            
            if (!$resultado_insertar) {
                throw new \Exception("Error al insertar: " . mysqli_error($conn));
            }
            
            echo json_encode([
                'error' => false,
                'msg' => 'Te has registrado correctamente al plan gratuito',
                'token' => $token
            ]);
            
        } catch (\Throwable $e) {
            echo json_encode([
                'error' => true,
                'msg' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    public static function verificarRegistro() {
        // Obtener ID del usuario de múltiples fuentes
        $json = file_get_contents("php://input");
        $datos = json_decode($json, true);
        
        // Priorizar JSON, luego sesión
        $usuario_id = $datos['usuario_id'] ?? $_SESSION['id'] ?? null;
        
        if(!$usuario_id) {
            echo json_encode([
                'error' => true,
                'msg' => 'Usuario no identificado'
            ]);
            return;
        }
        
        // Usar SQL directo para evitar problemas con el ORM
        $conn = mysqli_connect($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);
        $usuario_id_escaped = mysqli_real_escape_string($conn, (string)$usuario_id);
        
        $consulta = "SELECT * FROM registros WHERE usuario_id = '{$usuario_id_escaped}' LIMIT 1";
        $resultado = mysqli_query($conn, $consulta);
        
        if(!$resultado) {
            echo json_encode([
                'error' => true,
                'msg' => 'Error al verificar registro'
            ]);
            return;
        }
        
        $registro = mysqli_fetch_assoc($resultado);
        
        echo json_encode([
            'error' => false,
            'registrado' => (bool) $registro,
            'paquete_id' => $registro ? $registro['paquete_id'] : null,
            'token' => $registro ? $registro['token'] : null,
            'es_gratuito' => $registro && $registro['paquete_id'] == "3"
        ]);
    }
}