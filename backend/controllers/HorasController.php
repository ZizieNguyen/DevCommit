<?php

namespace Controllers;

use Model\Hora;

class HorasController {
    
    public static function api() {
        header('Content-Type: application/json');
        
        // Obtener todas las horas de la base de datos
        $horas = Hora::all('ASC');
        
        echo json_encode([
            'horas' => $horas
        ]);
    }
}