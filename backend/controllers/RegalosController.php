<?php


namespace Controllers;

use Model\Regalo;
use Model\Registro;
use Model\Usuario;

class RegalosController {

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
        
        // Obtener todos los regalos con el conteo de cuántos han sido seleccionados
        $regalos = Regalo::all('ASC');
        
        $regalos_array = [];
        foreach($regalos as $regalo) {
            // Contar cuántos usuarios han elegido este regalo
            $total = Registro::total('regalo_id', $regalo->id);
            
            $regalos_array[] = [
                'id' => $regalo->id,
                'nombre' => $regalo->nombre,
                'total' => $total
            ];
        }
        
        echo json_encode([
            'error' => false,
            'regalos' => $regalos_array
        ]);
    }
    
    public static function crear() {
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
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Recibir datos JSON
            $json = file_get_contents("php://input");
            $datos = json_decode($json, true);
            
            // Crear y guardar el regalo
            $regalo = new Regalo;
            $regalo->nombre = $datos['nombre'] ?? '';
            
            // Validar
            $alertas = $regalo->validar();
            
            if(empty($alertas)) {
                $resultado = $regalo->guardar();
                
                echo json_encode([
                    'error' => false,
                    'msg' => 'Regalo guardado correctamente',
                    'id' => $resultado
                ]);
            } else {
                echo json_encode([
                    'error' => true,
                    'msg' => $alertas
                ]);
            }
        }
    }
    
    public static function eliminar($id = null) {
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
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Obtener ID del JSON recibido
            $json = file_get_contents("php://input");
            $datos = json_decode($json, true);
            
            $id = $datos['id'] ?? $id;
            $id = filter_var($id, FILTER_VALIDATE_INT);
            
            if(!$id) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'ID no válido'
                ]);
                return;
            }
            
            // Verificar que no existan registros con este regalo
            $total_registros = Registro::total('regalo_id', $id);
            if($total_registros > 0) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'No se puede eliminar, hay registros que utilizan este regalo'
                ]);
                return;
            }
            
            $regalo = Regalo::find($id);
            
            if(!$regalo) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'Regalo no encontrado'
                ]);
                return;
            }
            
            $resultado = $regalo->eliminar();
            
            echo json_encode([
                'error' => !$resultado,
                'msg' => $resultado ? 'Regalo eliminado correctamente' : 'Error al eliminar el regalo'
            ]);
        }
    }
}