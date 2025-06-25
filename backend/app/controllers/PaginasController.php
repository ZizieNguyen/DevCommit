<?php


namespace Controllers;

use Model\Dia;
use Model\Hora;
use Model\Evento;
use Model\Ponente;
use Model\Categoria;

class PaginasController {
    public static function index() {
        $eventos = Evento::ordenar('hora_id', 'ASC');

        $eventos_formateados = [];
        foreach($eventos as $evento) {
            $evento->categoria = Categoria::find($evento->categoria_id);
            $evento->dia = Dia::find($evento->dia_id);
            $evento->hora = Hora::find($evento->hora_id);
            $evento->ponente = Ponente::find($evento->ponente_id);
            
            if($evento->dia_id === "1" && $evento->categoria_id === "1") {
                $eventos_formateados['conferencias_v'][] = $evento;
            }

            if($evento->dia_id === "2" && $evento->categoria_id === "1") {
                $eventos_formateados['conferencias_s'][] = $evento;
            }

            if($evento->dia_id === "1" && $evento->categoria_id === "2") {
                $eventos_formateados['workshops_v'][] = $evento;
            }

            if($evento->dia_id === "2" && $evento->categoria_id === "2") {
                $eventos_formateados['workshops_s'][] = $evento;
            }
        }

        // Obtener el total de cada bloque
        $ponentes_total = Ponente::total();
        $conferencias_total = Evento::total('categoria_id', 1);
        $workshops_total = Evento::total('categoria_id', 2);

        // Obtener todos los ponentes
        $ponentes = Ponente::all();
        
        // Convertir ponentes a formato adecuado para JSON
        $ponentes_array = [];
        foreach($ponentes as $ponente) {
            $ponentes_array[] = [
                'id' => $ponente->id,
                'nombre' => $ponente->nombre,
                'apellido' => $ponente->apellido,
                'imagen' => $ponente->imagen,
                'tags' => $ponente->tags,
                'redes' => [
                    'facebook' => $ponente->facebook,
                    'twitter' => $ponente->twitter,
                    'youtube' => $ponente->youtube,
                    'instagram' => $ponente->instagram
                ]
            ];
        }

        // Devolver respuesta en formato JSON
        echo json_encode([
            'error' => false,
            'eventos' => $eventos_formateados,
            'ponentes_total' => $ponentes_total,
            'conferencias_total' => $conferencias_total,
            'workshops_total' => $workshops_total,
            'ponentes' => $ponentes_array
        ]);
    }
    
    public static function evento() {
        // Información sobre DevCommit
        $info = [
            'nombre' => 'DevCommit',
            'descripcion' => 'DevCommit es una conferencia para desarrolladores de todos los niveles, enfocada en las últimas tecnologías web y móviles.',
            'fecha' => 'Diciembre 5-6, 2025',
            'ciudad' => 'Barcelona, España'
        ];
        
        echo json_encode([
            'error' => false,
            'evento' => $info
        ]);
    }
    
    public static function paquetes() {
        $paquetes = [
            [
                'id' => 1,
                'nombre' => 'Pase Presencial',
                'descripcion' => 'Acceso presencial a DevCommit, incluye comida y bebida, acceso a talleres y conferencias, camisa y material del evento.',
                'precio' => 189.54
            ],
            [
                'id' => 2,
                'nombre' => 'Pase Virtual',
                'descripcion' => 'Acceso virtual a DevCommit, incluye acceso a conferencias selectas, y material digital del evento.',
                'precio' => 46.41
            ],
            [
                'id' => 3,
                'nombre' => 'Pase Gratuito',
                'descripcion' => 'Acceso virtual limitado a DevCommit, incluye acceso a conferencias gratuitas y contenido promocional.',
                'precio' => 0
            ]
        ];
        
        echo json_encode([
            'error' => false,
            'paquetes' => $paquetes
        ]);
    }

    public static function conferencias() {
        $eventos = Evento::ordenar('hora_id', 'ASC');

        $eventos_formateados = [];
        foreach($eventos as $evento) {
            $evento->categoria = Categoria::find($evento->categoria_id);
            $evento->dia = Dia::find($evento->dia_id);
            $evento->hora = Hora::find($evento->hora_id);
            $evento->ponente = Ponente::find($evento->ponente_id);
            
            // Convertir a formato más adecuado para JSON
            $evento_formateado = [
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
            
            if($evento->dia_id === "1" && $evento->categoria_id === "1") {
                $eventos_formateados['conferencias_v'][] = $evento_formateado;
            }

            if($evento->dia_id === "2" && $evento->categoria_id === "1") {
                $eventos_formateados['conferencias_s'][] = $evento_formateado;
            }

            if($evento->dia_id === "1" && $evento->categoria_id === "2") {
                $eventos_formateados['workshops_v'][] = $evento_formateado;
            }

            if($evento->dia_id === "2" && $evento->categoria_id === "2") {
                $eventos_formateados['workshops_s'][] = $evento_formateado;
            }
        }

        echo json_encode([
            'error' => false,
            'eventos' => $eventos_formateados
        ]);
    }

    public static function error() {
        http_response_code(404);
        echo json_encode([
            'error' => true,
            'msg' => 'Página no encontrada'
        ]);
    }
}