<?php

namespace Controllers;

use Model\Dia;

class DiasController {
    
    public static function api() {
        header('Content-Type: application/json');
        
        // Obtener todos los días de la base de datos
        $dias = Dia::all();
        
        echo json_encode([
            'dias' => $dias
        ]);
    }
}