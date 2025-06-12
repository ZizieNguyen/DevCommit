<?php

namespace Controllers;

use Model\Ponente;

class APIPonentes {
    public static function index() {
        header('Content-Type: application/json');
        
        // Obtener parámetro de página
        $pagina = $_GET['page'] ?? 1;
        $pagina = filter_var($pagina, FILTER_VALIDATE_INT);
        $pagina = $pagina <= 0 ? 1 : $pagina;
        
        $registros_por_pagina = 10;
        $total = Ponente::total();
        
        $offset = ($pagina - 1) * $registros_por_pagina;
        $ponentes = Ponente::paginar($registros_por_pagina, $offset);
        
        echo json_encode([
            'ponentes' => $ponentes,
            'paginacion' => [
                'pagina_actual' => (int)$pagina,
                'totalPaginas' => ceil($total / $registros_por_pagina),
                'registros_por_pagina' => $registros_por_pagina,
                'total_registros' => $total
            ]
        ]);
    }

    public static function ponente($id) {
        header('Content-Type: application/json');
        $id = filter_var($id, FILTER_VALIDATE_INT);
        
        if(!$id) {
            echo json_encode(['error' => true, 'msg' => 'ID no válido']);
            return;
        }
        
        $ponente = Ponente::find($id);
        
        if(!$ponente) {
            echo json_encode(['error' => true, 'msg' => 'Ponente no encontrado']);
            return;
        }
        
        // Procesar redes si vienen como string
        if(is_string($ponente->redes)) {
            $ponente->redes = json_decode($ponente->redes);
        }
        
        echo json_encode($ponente);
    }

public static function eliminar($id) {
    header('Content-Type: application/json');
    $id = filter_var($id, FILTER_VALIDATE_INT);
    
    if(!$id) {
        echo json_encode(['error' => true, 'msg' => 'ID no válido']);
        return;
    }
    
    $ponente = Ponente::find($id);
    
    if(!$ponente) {
        echo json_encode(['error' => true, 'msg' => 'Ponente no encontrado']);
        return;
    }
    
    $resultado = $ponente->eliminar();
    
    if($resultado) {
        echo json_encode([
            'error' => false,
            'msg' => 'Ponente eliminado correctamente'
        ]);
    } else {
        echo json_encode([
            'error' => true,
            'msg' => 'Error al eliminar el ponente'
        ]);
    }
}
    

    public static function crear() {
    header('Content-Type: application/json');

    
    // TODO: Aquí debería ir la validación del token JWT para obtener el usuario_id
    $usuario_id = 1; 
    
    
    // Verificar si es admin (mantenemos esta parte)
    $usuario = \Model\Usuario::find($usuario_id);
    if(!$usuario || !$usuario->admin) {
        echo json_encode([
            'error' => true,
            'msg' => 'Acceso denegado - Usuario no administrador'
        ]);
        return;
    }
    
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $ponente = new \Model\Ponente();
        
        // Si hay archivo de imagen
        if(isset($_FILES['imagen']) && !empty($_FILES['imagen']['tmp_name'])) {
            $carpeta_imagenes = __DIR__ . '/../../public/img/speakers';
            
            // Crear la carpeta si no existe
            if(!is_dir($carpeta_imagenes)) {
                mkdir($carpeta_imagenes, 0755, true);
            }
            
            // Procesar imagen con Intervention Image
            $imagen_png = \Intervention\Image\ImageManagerStatic::make($_FILES['imagen']['tmp_name'])->fit(800,800)->encode('png', 80);
            $imagen_webp = \Intervention\Image\ImageManagerStatic::make($_FILES['imagen']['tmp_name'])->fit(800,800)->encode('webp', 80);
            
            $nombre_imagen = md5(uniqid(rand(), true));
            
            $_POST['imagen'] = $nombre_imagen;
        }
        
        // Manejar redes sociales
        if(isset($_POST['redes'])) {
            $_POST['redes'] = $_POST['redes']; // Ya viene como JSON
        } 
        
        $ponente->sincronizar($_POST);
        
        // Validar
        $alertas = $ponente->validar();
        
        if(empty($alertas)) {
            // Guardar las imágenes
            if(isset($nombre_imagen)) {
                $imagen_png->save($carpeta_imagenes . '/' . $nombre_imagen . ".png");
                $imagen_webp->save($carpeta_imagenes . '/' . $nombre_imagen . ".webp");
            }
            
            // Guardar en la BD
            $resultado = $ponente->guardar();
            
            echo json_encode([
                'error' => false,
                'msg' => 'Ponente guardado correctamente',
                'id' => $resultado
            ]);
        } else {
            // Formatear correctamente los mensajes de error
            $mensajes = [];
            foreach($alertas['error'] as $mensaje) {
                $mensajes[] = $mensaje;
            }
            
            echo json_encode([
                'error' => true,
                'msg' => implode(', ', $mensajes)
            ]);
        }
    }
}
   
}