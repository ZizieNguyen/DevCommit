<?php

namespace Controllers;

use Intervention\Image\ImageManagerStatic as Image;

use Model\Ponente;

class APIPonentes {

    public static function inicializar() {
        // Verificar que existe la imagen por defecto
        $carpeta_imagenes = __DIR__ . '/../public/img/speakers';
        $imagen_default = $carpeta_imagenes . '/default_speaker.png';
        
        // Si no existe la imagen default, crear una básica
        if (!file_exists($imagen_default)) {
            $antigua_default = __DIR__ . '/../public/img/speakers/default_speaker.png';
            if(file_exists($antigua_default)) {
                copy($antigua_default, $imagen_default);
            }
        }
    }

    public static function index() {
        self::inicializar();
    header('Content-Type: application/json');
    
    $pagina = $_GET['page'] ?? 1;
    $pagina = filter_var($pagina, FILTER_VALIDATE_INT);
    $pagina = $pagina <= 0 ? 1 : $pagina;
    
    $registros_por_pagina = 10;
    $total = Ponente::total();
    
    $offset = ($pagina - 1) * $registros_por_pagina;
    $ponentes = Ponente::paginar($registros_por_pagina, $offset);
    
    // Convertir cada ponente a array para incluir ruta_imagen
    $ponentes_array = [];
    foreach($ponentes as $ponente) {
        $ponentes_array[] = $ponente->toArray();
    }
    
    echo json_encode([
        'ponentes' => $ponentes_array,
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
    
    // Usar toArray() para incluir la ruta_imagen
    echo json_encode($ponente->toArray());
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
    
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $ponente = new \Model\Ponente();
        
        // Si hay archivo de imagen
        if(!empty($_FILES['imagen']['tmp_name'])) {
            $carpeta_imagenes = __DIR__ . '/../../frontend/public/speakers';
            
            // Crear la carpeta si no existe
            if(!is_dir($carpeta_imagenes)) {
                mkdir($carpeta_imagenes, 0755, true);
            }
            
            // Generar un nombre único para la imagen
            $nombre_imagen = md5(uniqid(rand(), true));
            
            // Obtener la extensión original
            $extension_original = strtolower(pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION));
            
            // Guardar ambas versiones - PNG y JPG - independientemente del formato original
            try {
                // Versión PNG
                $imagen_png = Image::make($_FILES['imagen']['tmp_name']);
                $imagen_png->fit(800, 800);
                $imagen_png->save($carpeta_imagenes . '/' . $nombre_imagen . '.png', 80);
                
                // Versión JPG
                $imagen_jpg = Image::make($_FILES['imagen']['tmp_name']);
                $imagen_jpg->fit(800, 800);
                $imagen_jpg->encode('jpg', 80);
                $imagen_jpg->save($carpeta_imagenes . '/' . $nombre_imagen . '.jpg', 80);
                
                // También versión WebP si se desea
                $imagen_webp = Image::make($_FILES['imagen']['tmp_name']);
                $imagen_webp->fit(800, 800);
                $imagen_webp->encode('webp', 80);
                $imagen_webp->save($carpeta_imagenes . '/' . $nombre_imagen . '.webp');
                
                // Asignar la imagen al ponente
                $ponente->imagen = $nombre_imagen;
                
            } catch (\Exception $e) {
                error_log("Error al procesar imagen: " . $e->getMessage());
                $ponente->imagen = 'default_speaker';
            }
        } else {
            $ponente->imagen = 'default_speaker';
        }
        
        // Procesar redes sociales
        if(!empty($_POST['redes'])) {
            $redes = json_decode($_POST['redes'], true);
            $ponente->redes = json_encode($redes);
        }
        
        // Sincronizar con los datos del POST
        $ponente->sincronizar($_POST);
        
        // Validaciones
        $alertas = $ponente->validar();
        
        if(empty($alertas)) {
            // Guardar el ponente en la base de datos
            $resultado = $ponente->guardar();
            
            if($resultado) {
                echo json_encode([
                    'error' => false,
                    'id' => $resultado['id'],
                    'msg' => 'Ponente creado correctamente'
                ]);
            } else {
                echo json_encode([
                    'error' => true,
                    'msg' => 'Error al guardar el ponente en la base de datos'
                ]);
            }
        } else {
            echo json_encode([
                'error' => true,
                'msg' => 'Error en los datos del formulario',
                'alertas' => $alertas
            ]);
        }
    } else {
        echo json_encode([
            'error' => true,
            'msg' => 'Método no válido. Se requiere POST'
        ]);
    }
}


    public static function actualizar() { 
    header('Content-Type: application/json');
    
    // Obtener el ID desde POST
    $id = filter_var($_POST['id'] ?? 0, FILTER_VALIDATE_INT);
    
    error_log("ID recibido en actualizar(): {$id}");
    
    if(!$id) {
        echo json_encode([
            'error' => true,
            'msg' => 'ID no válido o no especificado'
        ]);
        return;
    }
    
    // Verificar si existe el ponente
    $ponente = \Model\Ponente::find($id);
    if(!$ponente) {
        echo json_encode([
            'error' => true,
            'msg' => 'Ponente no encontrado'
        ]);
        return;
    }
    
    // Procesar imagen
    $carpeta_imagenes = __DIR__ . '/../../frontend/public/speakers';
    
    // Mantener imagen actual si no se sube una nueva
    $imagen_actual = $ponente->imagen;
    $ponente->imagen = $imagen_actual;
    
    // Si hay una imagen nueva
    if(!empty($_FILES['imagen']['tmp_name'])) {
        $imagen = md5(uniqid(rand(), true));
        
        // Crear directorio si no existe
        if(!is_dir($carpeta_imagenes)) {
            mkdir($carpeta_imagenes, 0755, true);
        }
        
        try {
            // Guardar el archivo original primero
            $extension_original = strtolower(pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION));
            $ruta_original = $carpeta_imagenes . '/' . $imagen . '.' . $extension_original;
            
            // Mover el archivo subido
            move_uploaded_file($_FILES['imagen']['tmp_name'], $ruta_original);
            
            // Crear versión en PNG usando Intervention Image
            $imagen_png = Image::make($ruta_original);
            $imagen_png->fit(800, 800);
            $imagen_png->save($carpeta_imagenes . '/' . $imagen . '.png', 80);
            
            // Crear versión en WebP
            $imagen_webp = Image::make($ruta_original);
            $imagen_webp->fit(800, 800);
            $imagen_webp->encode('webp', 80);
            $imagen_webp->save($carpeta_imagenes . '/' . $imagen . '.webp');
            
            // Si el formato original no es JPG/JPEG, crear también una versión JPG
            if($extension_original !== 'jpg' && $extension_original !== 'jpeg') {
                $imagen_jpg = Image::make($ruta_original);
                $imagen_jpg->fit(800, 800);
                $imagen_jpg->encode('jpg', 80);
                $imagen_jpg->save($carpeta_imagenes . '/' . $imagen . '.jpg');
            }
            
            // Eliminar imágenes previas si no es la default
            if($imagen_actual && $imagen_actual !== 'default_speaker') {
                foreach (glob($carpeta_imagenes . '/' . $imagen_actual . '.*') as $archivo) {
                    @unlink($archivo);
                }
            }
            
            // Asignar la nueva imagen
            $ponente->imagen = $imagen;
            
        } catch (\Exception $e) {
            error_log("Error al procesar imagen: " . $e->getMessage());
            echo json_encode([
                'error' => true,
                'msg' => 'Error al procesar la imagen: ' . $e->getMessage()
            ]);
            return;
        }
    }
    
    // Procesar redes sociales
    if(isset($_POST['redes'])) {
        $redes = $_POST['redes'];
        if(!is_array($redes)) {
            $redes = json_decode($redes, true);
        }
        $ponente->redes = json_encode($redes);
    }
    
    // Sincronizar con los datos del POST
    $ponente->sincronizar($_POST);
    
    // IMPORTANTE: Forzar el ID como entero después de sincronizar
    $ponente->id = (int)$id;
    
    // Hack adicional: Ejecutar directamente una consulta SQL para actualizar
    $query = "UPDATE ponentes SET 
              nombre = '{$ponente->nombre}',
              apellido = '{$ponente->apellido}', 
              ciudad = '{$ponente->ciudad}',
              pais = '{$ponente->pais}',
              imagen = '{$ponente->imagen}',
              tags = '{$ponente->tags}',
              redes = '{$ponente->redes}'
              WHERE id = {$id} LIMIT 1";
              
    $resultado = \Model\ActiveRecord::SQL($query);
    
    if($resultado) {
        echo json_encode([
            'error' => false,
            'msg' => 'Ponente actualizado correctamente'
        ]);
    } else {
        echo json_encode([
            'error' => true,
            'msg' => 'Error al actualizar el ponente'
        ]);
    }
}
   
}