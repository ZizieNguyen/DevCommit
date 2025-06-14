<?php

namespace Controllers;

use Model\Categoria;

class CategoriasController {
    
    public static function api() {
        header('Content-Type: application/json');
        
        // Obtener todas las categorías de la base de datos
        $categorias = Categoria::all();
        
        echo json_encode([
            'categorias' => $categorias
        ]);
    }
}