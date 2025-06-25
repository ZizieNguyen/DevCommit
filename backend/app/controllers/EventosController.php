<?php


namespace Controllers;

use Classes\Paginacion;
use Model\Categoria;
use Model\Dia;
use Model\Evento;
use Model\Hora;
use Model\Ponente;
use Model\Usuario;

class EventosController {

    public static function index() {
        // Validar autenticación
        // if(!isset($_SESSION['id'])) {
        //     echo json_encode([
        //         'error' => true,
        //         'msg' => 'Acceso denegado'
        //     ]);
        //     return;
        // }
        
        // // Verificar si es admin
        // $usuario = Usuario::find($_SESSION['id']);
        // if(!$usuario->admin) {
        //     echo json_encode([
        //         'error' => true,
        //         'msg' => 'Acceso denegado'
        //     ]);
        //     return;
        // }
        
        // Parámetros de paginación (desde query params)
        $pagina = $_GET['pagina'] ?? 1;
        $pagina = filter_var($pagina, FILTER_VALIDATE_INT) ?? 1;
        $pagina = max(1, $pagina); // Asegurarse de que sea al menos 1
        
        $por_pagina = 10;
        $total = Evento::total();
        
        // Calcular offset y total de páginas para el frontend
        $offset = ($pagina - 1) * $por_pagina;
        $total_paginas = ceil($total / $por_pagina);
        
        // Obtener eventos
        $eventos = Evento::paginar($por_pagina, $offset);
        
        // Enriquecer los datos para cada evento
        $eventos_array = [];
        foreach($eventos as $evento) {
            $evento->categoria = Categoria::find($evento->categoria_id);
            $evento->dia = Dia::find($evento->dia_id);
            $evento->hora = Hora::find($evento->hora_id);
            $evento->ponente = Ponente::find($evento->ponente_id);
            
            // Convertir a array para manipulación
            $eventos_array[] = [
                'id' => $evento->id,
                'nombre' => $evento->nombre,
                'descripcion' => $evento->descripcion,
                'disponibles' => $evento->disponibles,
                'categoria' => [
                    'id' => $evento->categoria->id,
                    'nombre' => $evento->categoria->nombre
                ],
                'dia' => [
                    'id' => $evento->dia->id,
                    'nombre' => $evento->dia->nombre
                ],
                'hora' => [
                    'id' => $evento->hora->id,
                    'hora' => $evento->hora->hora
                ],
                'ponente' => [
                    'id' => $evento->ponente->id,
                    'nombre' => $evento->ponente->nombre . ' ' . $evento->ponente->apellido,
                    'imagen' => $evento->ponente->imagen
                ]
            ];
        }
        
        // Devolver respuesta JSON con metadatos de paginación
        echo json_encode([
            'error' => false,
            'eventos' => $eventos_array,
            'paginacion' => [
                'pagina_actual' => $pagina,
                'total_paginas' => $total_paginas,
                'registros_por_pagina' => $por_pagina,
                'total_registros' => $total
            ]
        ]);
    }

    public static function crear() {
        // Se quitó la verificación de admin como solicitaste
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Detectar formato de contenido
            $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
            $isJson = strpos($contentType, 'application/json') !== false;
            
            if ($isJson) {
                // Si es JSON, obtener del cuerpo de la petición
                $json = file_get_contents("php://input");
                $datos = json_decode($json, true);
            } else {
                // Si no es JSON, obtener de $_POST
                $datos = $_POST;
            }

            error_log("Datos recibidos en crear evento: " . json_encode($datos));
            
            $evento = new Evento();
            $evento->sincronizar($datos);
            
            $alertas = $evento->validar();
            
            if(empty($alertas)) {
                $resultado = $evento->guardar();

                error_log("Resultado de guardar evento: " . json_encode($resultado));
                
                echo json_encode([
                    'error' => false,
                    'msg' => 'Evento creado correctamente',
                    'id' => $resultado
                ]);
            } else {
                error_log("Alertas de validación: " . json_encode($alertas));
                echo json_encode([
                    'error' => true,
                    'msg' => $alertas
                ]);
            }
        }
    }

    public static function editar($id = null) {
        // Validar autenticación y permisos
        // if(!isset($_SESSION['id'])) {
        //     echo json_encode([
        //         'error' => true,
        //         'msg' => 'Acceso denegado'
        //     ]);
        //     return;
        // }
        
        // $usuario = Usuario::find($_SESSION['id']);
        // if(!$usuario->admin) {
        //     echo json_encode([
        //         'error' => true,
        //         'msg' => 'Acceso denegado'
        //     ]);
        //     return;
        // }
        
        // Validar ID
        $id = filter_var($id, FILTER_VALIDATE_INT);
        if(!$id) {
            echo json_encode([
                'error' => true,
                'msg' => 'ID inválido'
            ]);
            return;
        }
        
        // Buscar evento
        $evento = Evento::find($id);
        if(!$evento) {
            echo json_encode([
                'error' => true,
                'msg' => 'Evento no encontrado'
            ]);
            return;
        }
        
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            // GET: Devolver datos del evento
            $evento->categoria = Categoria::find($evento->categoria_id);
            $evento->dia = Dia::find($evento->dia_id);
            $evento->hora = Hora::find($evento->hora_id);
            $evento->ponente = Ponente::find($evento->ponente_id);
            
            $categorias = Categoria::all('ASC');
            $dias = Dia::all('ASC');
            $horas = Hora::all('ASC');
            
            echo json_encode([
                'error' => false,
                'evento' => $evento,
                'categorias' => $categorias,
                'dias' => $dias,
                'horas' => $horas
            ]);
        } elseif($_SERVER['REQUEST_METHOD'] === 'POST') {
            // POST: Actualizar evento
            
            // Obtener JSON del cuerpo de la petición
            $json = file_get_contents("php://input");
            $datos = json_decode($json, true);
            
            $evento->sincronizar($datos);
            
            $alertas = $evento->validar();
            
            if(empty($alertas)) {
                $resultado = $evento->guardar();
                
                echo json_encode([
                    'error' => false,
                    'msg' => 'Evento actualizado correctamente'
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
        // Validar autenticación y permisos
        // if(!isset($_SESSION['id'])) {
        //     echo json_encode([
        //         'error' => true,
        //         'msg' => 'Acceso denegado'
        //     ]);
        //     return;
        // }
        
        // $usuario = Usuario::find($_SESSION['id']);
        // if(!$usuario->admin) {
        //     echo json_encode([
        //         'error' => true,
        //         'msg' => 'Acceso denegado'
        //     ]);
        //     return;
        // }
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Obtener ID del evento desde JSON
            $json = file_get_contents("php://input");
            $datos = json_decode($json, true);
            
            $id = $datos['id'] ?? $id;
            $id = filter_var($id, FILTER_VALIDATE_INT);
            
            if(!$id) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'ID inválido'
                ]);
                return;
            }

            error_log("Intentando eliminar evento con ID: {$id}");
            
            $evento = Evento::find($id);
            if(!$evento) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'Evento no encontrado'
                ]);
                return;
            }
            
            $resultado = $evento->eliminar();
            
            echo json_encode([
                'error' => !$resultado,
                'msg' => $resultado ? 'Evento eliminado correctamente' : 'Error al eliminar el evento'
            ]);
        }
    }
}