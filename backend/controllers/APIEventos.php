<?php

namespace Controllers;

use Model\EventoHorario;
use Model\Evento;

class APIEventos {

    public static function index() {

        $dia_id = $_GET['dia_id'] ?? '';
        $categoria_id = $_GET['categoria_id'] ?? '';

        $dia_id = filter_var($dia_id, FILTER_VALIDATE_INT);
        $categoria_id = filter_var($categoria_id, FILTER_VALIDATE_INT);

        if(!$dia_id || !$categoria_id) {
           echo json_encode([]);
           return;
        }

        // Consultar la base de datos
        $eventos = EventoHorario::whereArray(['dia_id' => $dia_id, 'categoria_id' => $categoria_id]) ?? [];
        echo json_encode($eventos);
    }


    public static function horario() {
        // Obtener los parámetros de la URL
        $dia_id = $_GET['dia_id'] ?? '';
        $categoria_id = $_GET['categoria_id'] ?? '';
        
        // Verificar que se hayan proporcionado ambos parámetros
        if (!$dia_id || !$categoria_id) {
            echo json_encode([]);
            return;
        }
        
        // Validar los parámetros
        $dia_id = filter_var($dia_id, FILTER_VALIDATE_INT);
        $categoria_id = filter_var($categoria_id, FILTER_VALIDATE_INT);
        
        if(!$dia_id || !$categoria_id) {
            echo json_encode([]);
            return;
        }
        
        // Consulta a la base de datos para obtener los eventos
        $eventos = EventoHorario::whereArray([
            'dia_id' => $dia_id,
            'categoria_id' => $categoria_id
        ]) ?? [];
        
        // Devolver resultado como JSON
        echo json_encode($eventos);
    }

    
}