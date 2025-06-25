<?php

namespace Controllers;

use Model\EventoHorario;
use Model\Evento;

class APIEventos {

    public static function index() {
    header('Content-Type: application/json');
    
    // Obtener parámetros de filtro y paginación (opcionales)
    $dia_id = $_GET['dia_id'] ?? '';
    $categoria_id = $_GET['categoria_id'] ?? '';
    $limite = $_GET['limit'] ?? 9;
    $pagina = $_GET['page'] ?? 1;
    
    // Validar parámetros
    $dia_id = $dia_id ? filter_var($dia_id, FILTER_VALIDATE_INT) : null;
    $categoria_id = $categoria_id ? filter_var($categoria_id, FILTER_VALIDATE_INT) : null;
    $limite = filter_var($limite, FILTER_VALIDATE_INT);
    $pagina = filter_var($pagina, FILTER_VALIDATE_INT);
    
    // Calcular offset para paginación
    $offset = ($pagina - 1) * $limite;
    
    // Construir filtros
    $filtros = [];
    if ($dia_id) {
        $filtros['dia_id'] = $dia_id;
    }
    if ($categoria_id) {
        $filtros['categoria_id'] = $categoria_id;
    }
    
    // Obtener total de eventos para los filtros aplicados
    $totalEventos = $filtros ? Evento::totalArray($filtros) : Evento::total();
    $totalPaginas = ceil($totalEventos / $limite);
    
    // Obtener eventos
    $eventos = [];
    if (!empty($filtros)) {
        // Si hay filtros, usamos whereArray
        $eventos = Evento::whereArray($filtros);
        
        // Aplicar paginación manual
        $eventos = array_slice($eventos, $offset, $limite);
    } else {
        // Si no hay filtros, usamos paginar
        $eventos = Evento::paginar($limite, $offset);
    }
    
    // Enriquecer los datos con las relaciones
    foreach($eventos as $evento) {
        $evento->categoria = \Model\Categoria::find($evento->categoria_id);
        $evento->dia = \Model\Dia::find($evento->dia_id);
        $evento->hora = \Model\Hora::find($evento->hora_id);
        if($evento->ponente_id) {
            $evento->ponente = \Model\Ponente::find($evento->ponente_id);
        }
    }
    
    // Formato de respuesta con paginación
    $respuesta = [
        'eventos' => $eventos,
        'paginacion' => [
            'totalEventos' => $totalEventos,
            'totalPaginas' => $totalPaginas,
            'paginaActual' => $pagina,
            'eventosPerPage' => $limite
        ]
    ];
    
    echo json_encode($respuesta);
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

    public static function porPonente() {
    header('Content-Type: application/json');
    
    $ponente_id = $_GET['ponente_id'] ?? '';
    $ponente_id = filter_var($ponente_id, FILTER_VALIDATE_INT);
    
    if(!$ponente_id) {
        echo json_encode([]);
        return;
    }
    
    // Obtener eventos donde el ponente_id coincida
    $eventos = Evento::whereArray(['ponente_id' => $ponente_id]);
    
    // Enriquecer los datos de cada evento
    $eventos_array = [];
    foreach($eventos as $evento) {
        $evento->categoria = \Model\Categoria::find($evento->categoria_id);
        $evento->dia = \Model\Dia::find($evento->dia_id);
        $evento->hora = \Model\Hora::find($evento->hora_id);
        
        $eventos_array[] = $evento;
    }
    
    echo json_encode($eventos_array);
}

    public static function evento($id = null) {
    header('Content-Type: application/json');
    
    // Validar que el ID sea un número válido
    $id = filter_var($id, FILTER_VALIDATE_INT);
    
    if(!$id) {
        echo json_encode([
            'error' => true,
            'msg' => 'ID no válido'
        ]);
        return;
    }
    
    // Buscar el evento
    $evento = \Model\Evento::find($id);
    
    if(!$evento) {
        echo json_encode([
            'error' => true,
            'msg' => 'Evento no encontrado'
        ]);
        return;
    }
    
    // Cargar relaciones
    $evento->categoria = \Model\Categoria::find($evento->categoria_id);
    $evento->dia = \Model\Dia::find($evento->dia_id);
    $evento->hora = \Model\Hora::find($evento->hora_id);
    
    if($evento->ponente_id) {
        $evento->ponente = \Model\Ponente::find($evento->ponente_id);
    }
    
    echo json_encode($evento);
}
}