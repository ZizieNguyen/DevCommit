<?php

namespace Controllers;

use Model\Evento;
use Model\Ponente;
use Model\Registro;
use Model\Usuario;

class DashboardController {

    public static function index() {

        try {
            // Obtener estadísticas de eventos y ponentes
            $total_eventos = Evento::total();
            $total_ponentes = Ponente::total();

            // Obtener registros recientes
            $registros_recientes = Registro::get(5);
            $registros_formateados = [];
            foreach($registros_recientes as $registro) {
                $usuario = Usuario::find($registro->usuario_id);
                $registros_formateados[] = [
                    'id' => $registro->id,
                    'usuario' => [
                        'nombre' => $usuario->nombre,
                        'apellido' => $usuario->apellido,
                        'email' => $usuario->email
                    ],
                ];
            }

            // Obtener conteos exactos por tipo de paquete usando SQL directo
            $db = new \mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);
            if ($db->connect_error) {
                throw new \Exception("Error de conexión a la base de datos");
            }

            $query = "SELECT paquete_id, COUNT(*) as total FROM registros GROUP BY paquete_id";
            $result = $db->query($query);

            // Inicializar contadores
            $virtuales = 0;
            $presenciales = 0;
            $gratuitos = 0;

            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    switch ((int)$row['paquete_id']) {
                        case 1:
                            $presenciales = (int)$row['total'];
                            break;
                        case 2:
                            $virtuales = (int)$row['total'];
                            break;
                        case 3:
                            $gratuitos = (int)$row['total'];
                            break;
                    }
                }
            }

            $db->close();

            // Precios fijos para mostrar en el dashboard
            $precio_virtual = 49;
            $precio_presencial = 99;

            // Calcular ingresos totales
            $ingresos = ($virtuales * $precio_virtual) + ($presenciales * $precio_presencial);

            // Total de registros
            $total_registros = $virtuales + $presenciales + $gratuitos;

            echo json_encode([
                'error' => false,
                'eventos' => $total_eventos,
                'ponentes' => $total_ponentes,
                'registros' => $total_registros,
                'ingresos' => $ingresos,
                'registros_recientes' => $registros_formateados,
                'eventos_menos_disponibles' => $menos_disponibles ?? [],
                'eventos_mas_disponibles' => $mas_disponibles ?? [],
                'registros_gratuitos' => $gratuitos,
                'registros_virtuales' => $virtuales,
                'registros_presenciales' => $presenciales,
                'precio_virtual' => $precio_virtual,
                'precio_presencial' => $precio_presencial
            ]);

        } catch (\Exception $e) {
            // Manejar cualquier error general
            error_log("Error en Dashboard: " . $e->getMessage());

            echo json_encode([
                'error' => true,
                'msg' => 'Error al cargar el dashboard: ' . $e->getMessage(),
                'eventos' => 0,
                'ponentes' => 0,
                'registros' => 0,
                'ingresos' => 0,
                'registros_recientes' => [],
                'eventos_menos_disponibles' => [],
                'eventos_mas_disponibles' => [],
                'registros_gratuitos' => 0,
                'registros_virtuales' => 0,
                'registros_presenciales' => 0,
                'precio_virtual' => 49,
                'precio_presencial' => 99
            ]);
        }
    }

    public static function actualizarPerfil() {
        // Recibir datos JSON
        $json = file_get_contents("php://input");
        $datos = json_decode($json, true);

        // Validar autenticación
        if(!isset($_SESSION['id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }

        $usuario = Usuario::find($_SESSION['id']);

        // Actualizar campos permitidos
        $usuario->nombre = $datos['nombre'] ?? $usuario->nombre;
        $usuario->apellido = $datos['apellido'] ?? $usuario->apellido;
        $usuario->email = $datos['email'] ?? $usuario->email;

        // Validaciones adicionales
        if($usuario->email !== $_SESSION['email']) {
            // Si cambia el email, validar que no exista
            $usuario_existente = Usuario::where('email', $usuario->email);
            if($usuario_existente && $usuario_existente->id !== $usuario->id) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'El correo ya está registrado por otro usuario'
                ]);
                return;
            }
        }

        // Guardar cambios
        $resultado = $usuario->guardar();

        if($resultado) {
            $_SESSION['nombre'] = $usuario->nombre;
            $_SESSION['apellido'] = $usuario->apellido;
            $_SESSION['email'] = $usuario->email;

            echo json_encode([
                'error' => false,
                'msg' => 'Perfil actualizado correctamente'
            ]);
        } else {
            echo json_encode([
                'error' => true,
                'msg' => 'Error al actualizar perfil'
            ]);
        }
    }

    public static function cambiarPassword() {
        // Recibir datos JSON
        $json = file_get_contents("php://input");
        $datos = json_decode($json, true);

        // Validar autenticación
        if(!isset($_SESSION['id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }

        $usuario = Usuario::find($_SESSION['id']);

        // Validar password actual
        $password_actual = $datos['password_actual'] ?? '';
        if(!password_verify($password_actual, $usuario->password)) {
            echo json_encode([
                'error' => true,
                'msg' => 'El password actual es incorrecto'
            ]);
            return;
        }

        // Actualizar password
        $usuario->password = $datos['password_nuevo'] ?? '';
        $usuario->hashPassword();

        $resultado = $usuario->guardar();

        if($resultado) {
            echo json_encode([
                'error' => false,
                'msg' => 'Password actualizado correctamente'
            ]);
        } else {
            echo json_encode([
                'error' => true,
                'msg' => 'Error al actualizar password'
            ]);
        }
    }
}