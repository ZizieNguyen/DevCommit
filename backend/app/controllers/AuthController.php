<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;

class AuthController {
    public static function login() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Obtener datos JSON
            $json = file_get_contents("php://input");
            $datos = json_decode($json, true) ?? $_POST;
            
            $usuario = new Usuario($datos);
            $alertas = $usuario->validarLogin();
            
            if(empty($alertas)) {
                // Verificar que el usuario exista
                $usuario = Usuario::where('email', $usuario->email);

                error_log("Validación de usuario para login - Email: {$datos['email']}, Existe: " . ($usuario ? 'SÍ' : 'NO'));
                if(!$usuario || !$usuario->confirmado) {
                    // CORREGIDO: Invertí la lógica que estaba al revés
                    echo json_encode([
                        'msg' => 'El Usuario No Existe o no está confirmado',
                        'error' => true
                    ]);
                } else {
                    // El Usuario existe
                    if(password_verify($datos['password'], $usuario->password)) {
                        echo json_encode([
                            'msg' => 'Login correcto',
                            'error' => false,
                            'usuario' => [
                                'id' => $usuario->id,
                                'nombre' => $usuario->nombre,
                                'apellido' => $usuario->apellido,
                                'email' => $usuario->email,
                                'admin' => $usuario->admin ?? 0
                            ]
                        ]);
                    } else {
                        echo json_encode([
                            'msg' => 'Password Incorrecto',
                            'error' => true
                        ]);
                    }
                }
            } else {
                echo json_encode([
                    'msg' => $alertas['error'][0] ?? 'Error de validación',
                    'error' => true
                ]);
            }
        }
    }

    public static function registro() {
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json = file_get_contents("php://input");
        $datos = json_decode($json, true) ?? $_POST;
        
        $usuario = new Usuario($datos);
        $alertas = $usuario->validar_cuenta();

        if(empty($alertas)) {
            // NUEVO: Usar el método SQL de ActiveRecord para eliminar usuarios previos
            $query = "DELETE FROM usuarios WHERE email = '" . $datos['email'] . "'";
            Usuario::SQL($query); // Usar el método estático SQL que existe en ActiveRecord
            
            error_log("Eliminando usuario previo con email: " . $datos['email']);
            
            // Continuar con el registro normal
            $usuario->hashPassword();
            unset($usuario->password2);
            $usuario->crearToken();
            
            // Guardar el nuevo usuario
            $resultado = $usuario->guardar();
            
            if($resultado) {
                $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                $enviado = $email->enviarConfirmacion();
                
                if($enviado) {
                    echo json_encode([
                        'msg' => 'Usuario creado correctamente. Revisa tu email para confirmar tu cuenta', 
                        'error' => false
                    ]);
                } else {
                    echo json_encode([
                        'msg' => 'Usuario creado pero hubo un error al enviar el email',
                        'error' => true
                    ]);
                }
            }
        } else {
            echo json_encode([
                'msg' => $alertas['error'][0] ?? 'Error de validación',
                'error' => true
            ]);
        }
    }
}

    public static function olvide() {
        // CORREGIDO: Eliminado el parámetro Router que no se usa en API REST
        $alertas = [];
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $json = file_get_contents("php://input");
            $datos = json_decode($json, true) ?? $_POST;
            
            $usuario = new Usuario($datos);
            $alertas = $usuario->validarEmail();

            if(empty($alertas)) {
                // Buscar el usuario
                $usuario = Usuario::where('email', $usuario->email);

                if($usuario && $usuario->confirmado) {
                    // Generar un nuevo token
                    $usuario->crearToken();
                    
                    unset($usuario->password2);

                    // Actualizar el usuario
                    $usuario->guardar();

                    // Enviar el email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $enviado = $email->enviarInstrucciones();
                    
                    if($enviado) {
                        echo json_encode([
                            'msg' => 'Hemos enviado las instrucciones a tu email',
                            'error' => false
                        ]);
                    } else {
                        echo json_encode([
                            'msg' => 'Error al enviar el email de recuperación',
                            'error' => true
                        ]);
                    }
                } else {
                    echo json_encode([
                        'msg' => 'El Usuario no existe o no está confirmado',
                        'error' => true
                    ]);
                }
            } else {
                echo json_encode([
                    'msg' => $alertas['error'][0] ?? 'Error de validación',
                    'error' => true
                ]);
            }
        }
    }

public static function confirmar($token) {
    if(empty($token)) {
        echo json_encode([
            'msg' => 'Token no válido (vacío)',
            'error' => true
        ]);
        return;
    }
    
    // Limpiar el token de posibles caracteres problemáticos
    $token_limpio = trim($token);
    
    error_log("Token recibido: '{$token}', Token limpio: '{$token_limpio}'");
    
    // VERIFICAR PRIMERO TODOS LOS USUARIOS DISPONIBLES
    $query_all = "SELECT id, email, token FROM usuarios LIMIT 10";
    $resultado_all = Usuario::SQL($query_all);
    if($resultado_all && $resultado_all->num_rows > 0) {
        error_log("Usuarios disponibles en la BD:");
        while($row = $resultado_all->fetch_assoc()) {
            error_log("ID: {$row['id']} | Email: {$row['email']} | Token: '{$row['token']}'");
        }
    }
    
    // Intentar buscar con el token exacto
    $query = "SELECT * FROM usuarios WHERE token = '{$token_limpio}'";
    $resultado = Usuario::SQL($query);
    
    // Si no funciona, intentar con LIKE para casos de formato incorrecto
    if(!$resultado || $resultado->num_rows === 0) {
        $query = "SELECT * FROM usuarios WHERE token LIKE '%{$token_limpio}%'";
        $resultado = Usuario::SQL($query);
        error_log("Búsqueda con LIKE: " . ($resultado && $resultado->num_rows > 0 ? "ENCONTRADO" : "NO ENCONTRADO"));
    }
    
    if($resultado && $resultado->num_rows > 0) {
        $usuarioData = $resultado->fetch_assoc();
        $usuario = new Usuario($usuarioData);
        
        error_log("Usuario encontrado: ID={$usuario->id}, Email={$usuario->email}, Token='{$usuario->token}'");
        
        // Confirmar la cuenta
        $usuario->confirmado = 1;
        $usuario->token = '';
        
        // Guardar cambios con depuración adicional
        $resultadoUpdate = $usuario->guardar();
        error_log("Resultado de actualización: " . ($resultadoUpdate ? "ÉXITO" : "FALLO"));
        
        if($resultadoUpdate) {
            echo json_encode([
                'msg' => 'Cuenta confirmada correctamente, ya puedes iniciar sesión',
                'error' => false
            ]);
        } else {
            echo json_encode([
                'msg' => 'Error al confirmar la cuenta (guardado)',
                'error' => true
            ]);
        }
    } 
}

    public static function verificarToken($token) {
    $usuario = Usuario::where('token', $token);
    
    if($usuario) {
        echo json_encode([
            'msg' => 'Token válido',
            'error' => false
        ]);
    } else {
        echo json_encode([
            'msg' => 'Token no válido',
            'error' => true
        ]);
    }
}

public static function reestablecerPassword($token) {
    // Obtener datos JSON
    $json = file_get_contents("php://input");
    $datos = json_decode($json, true) ?? $_POST;
    
    if(!isset($datos['password'])) {
        echo json_encode([
            'msg' => 'El password es obligatorio',
            'error' => true
        ]);
        return;
    }
    
    $usuario = Usuario::where('token', $token);
    
    if(!$usuario) {
        echo json_encode([
            'msg' => 'Token no válido',
            'error' => true
        ]);
        return;
    }
    
    $usuario->password = $datos['password'];
    $usuario->hashPassword();
    $usuario->token = '';
    
    $resultado = $usuario->guardar();
    
    if($resultado) {
        echo json_encode([
            'msg' => 'Password actualizado correctamente',
            'error' => false
        ]);
    } else {
        echo json_encode([
            'msg' => 'Error al actualizar el password',
            'error' => true
        ]);
    }
}
}