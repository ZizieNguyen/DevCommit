<?php

namespace Controllers;

use Model\Evento;
use Model\Ponente;
use Model\Registro;
use Model\Usuario;

class DashboardController {

    public static function index() {
        // Validar autenticación
        if(!isset($_SESSION['id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }
        
        // Verificar si es admin
        $usuario = Usuario::find($_SESSION['id']);
        if(!$usuario->admin) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }

        // Obtener estadísticas generales
        $total_eventos = Evento::total();
        $total_ponentes = Ponente::total();
        $total_registros = Registro::total();
        
        // Obtener ultimos registros
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
                'fecha' => $registro->fecha_registro
            ];
        }

        // Calcular los ingresos
        $virtuales = Registro::total('paquete_id', 2);
        $presenciales = Registro::total('paquete_id', 1);
        $ingresos = ($virtuales * 46.41) + ($presenciales * 189.54);

        // Obtener eventos con más y menos lugares disponibles
        $menos_disponibles = Evento::ordenarLimite('disponibles', 'ASC', 5);
        $mas_disponibles = Evento::ordenarLimite('disponibles', 'DESC', 5);

        // Responder con JSON para que lo consuma React
        echo json_encode([
            'error' => false,
            'eventos' => $total_eventos,
            'ponentes' => $total_ponentes,
            'registros' => $total_registros,
            'ingresos' => $ingresos,
            'registros_recientes' => $registros_formateados,
            'eventos_menos_disponibles' => $menos_disponibles,
            'eventos_mas_disponibles' => $mas_disponibles
        ]);
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