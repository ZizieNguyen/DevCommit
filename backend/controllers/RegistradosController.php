<?php

namespace Controllers;

use Model\Registro;
use Classes\Paginacion;
use Model\Paquete;
use Model\Usuario;
use Model\Regalo;

class RegistradosController {

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
        
        // Parámetros de paginación
        $pagina = $_GET['pagina'] ?? 1;
        $pagina = filter_var($pagina, FILTER_VALIDATE_INT) ?? 1;
        $pagina = max(1, $pagina); // Asegurarse que sea al menos 1
        
        $registros_por_pagina = 10;
        $total = Registro::total();
        
        // Calcular offset y total de páginas para el frontend
        $offset = ($pagina - 1) * $registros_por_pagina;
        $total_paginas = ceil($total / $registros_por_pagina);
        
        if($pagina > $total_paginas && $total_paginas > 0) {
            echo json_encode([
                'error' => true,
                'msg' => 'Página no válida'
            ]);
            return;
        }

        $registros = Registro::paginar($registros_por_pagina, $offset);
        
        // Formatear registros para JSON
        $registros_array = [];
        foreach($registros as $registro) {
            $usuario = Usuario::find($registro->usuario_id);
            $paquete = Paquete::find($registro->paquete_id);
            $regalo = Regalo::find($registro->regalo_id);
            
            $registros_array[] = [
                'id' => $registro->id,
                'usuario' => [
                    'id' => $usuario->id,
                    'nombre' => $usuario->nombre,
                    'apellido' => $usuario->apellido,
                    'email' => $usuario->email
                ],
                'paquete' => [
                    'id' => $paquete->id,
                    'nombre' => $paquete->nombre,
                    'precio' => $paquete->precio
                ],
                'regalo' => $regalo ? [
                    'id' => $regalo->id,
                    'nombre' => $regalo->nombre
                ] : null,
                'fecha_registro' => $registro->fecha_registro,
                'token' => $registro->token,
                'pagado' => $registro->pagado ? true : false
            ];
        }

        // Devolver respuesta JSON con metadatos de paginación
        echo json_encode([
            'error' => false,
            'registros' => $registros_array,
            'paginacion' => [
                'pagina_actual' => $pagina,
                'total_paginas' => $total_paginas,
                'registros_por_pagina' => $registros_por_pagina,
                'total_registros' => $total
            ]
        ]);
    }
    
    public static function detalleRegistro($id = null) {
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
        
        // Validar ID
        $id = filter_var($id, FILTER_VALIDATE_INT);
        
        if(!$id) {
            echo json_encode([
                'error' => true,
                'msg' => 'ID no válido'
            ]);
            return;
        }
        
        // Obtener registro
        $registro = Registro::find($id);
        
        if(!$registro) {
            echo json_encode([
                'error' => true,
                'msg' => 'Registro no encontrado'
            ]);
            return;
        }
        
        // Obtener relaciones
        $usuario = Usuario::find($registro->usuario_id);
        $paquete = Paquete::find($registro->paquete_id);
        $regalo = Regalo::find($registro->regalo_id);
        
        // Obtener eventos asociados a este registro (si hay una relación)
        $eventos_registro = [];
        // Aquí iría el código para obtener los eventos relacionados
        // Por ejemplo: $eventos_registro = EventoRegistro::whereArray(['registro_id' => $registro->id]);
        
        // Formatear para JSON
        $detalle = [
            'id' => $registro->id,
            'usuario' => [
                'id' => $usuario->id,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'email' => $usuario->email
            ],
            'paquete' => [
                'id' => $paquete->id,
                'nombre' => $paquete->nombre,
                'precio' => $paquete->precio
            ],
            'regalo' => $regalo ? [
                'id' => $regalo->id,
                'nombre' => $regalo->nombre
            ] : null,
            'fecha_registro' => $registro->fecha_registro,
            'token' => $registro->token,
            'pagado' => $registro->pagado ? true : false,
            'eventos' => $eventos_registro
        ];
        
        echo json_encode([
            'error' => false,
            'registro' => $detalle
        ]);
    }
}