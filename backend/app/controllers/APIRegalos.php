<?php

namespace Controllers;

use Model\Regalo;
use Model\Registro;

class APIRegalos {

    public static function index() {
        // Suprimir advertencias para que no contaminen la salida JSON
        error_reporting(0);
        
        header('Content-Type: application/json');
        
        try {
            // Limpiar cualquier salida previa
            if (ob_get_length()) ob_clean();
            
            // Obtener directamente los regalos
            $regalos = Regalo::all('ASC');
            
            if (!$regalos) {
                $regalos = [];
            }
            
            // Devolver el array de regalos
            echo json_encode($regalos);
            
        } catch (\Exception $e) {
            error_log('Error al obtener regalos: ' . $e->getMessage());
            echo json_encode([]);
        }
    }
}