<?php

namespace Controllers;

use Intervention\Image\ImageManagerStatic as Image;

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

        // Extraer el token JWT del encabezado (comentado temporalmente)
        // $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        // if (!$auth_header || !strpos($auth_header, 'Bearer ')) {
        //     echo json_encode([
        //         'error' => true,
        //         'msg' => 'Acceso denegado - Token no proporcionado'
        //     ]);
        //     return;
        // }
        
        // // Extraer el token
        // $token = str_replace('Bearer ', '', $auth_header);
        
        // TODO: En un entorno real, aquí deberías decodificar el token JWT

        // Depuración: Registrar datos de entrada
        error_log("Método crear() llamado - POST recibido: " . json_encode($_POST));
        if(isset($_FILES['imagen'])) {
            error_log("Archivo recibido: " . $_FILES['imagen']['name']);
        }

        $sql = "SELECT * FROM usuarios WHERE admin = 1 LIMIT 1";
        $resultado = \Model\Usuario::SQL($sql);
        
        // Convertir el resultado mysqli a un array de objetos
        $usuarios = [];
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $usuarios[] = (object)$fila;
            }
        }
        
        if(empty($usuarios)) {
            echo json_encode([
                'error' => true,
                'msg' => 'No hay usuarios con permisos de administrador en el sistema'
            ]);
            return;
        }
        
        // Tomar el primer usuario administrador encontrado
        $usuario = $usuarios[0];
        
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
            } else {
                // Si no se subió una imagen, usar la predeterminada
                $_POST['imagen'] = 'default_speaker';
            }
            
            // Manejar redes sociales
            if(isset($_POST['redes'])) {
                $_POST['redes'] = $_POST['redes']; // Ya viene como JSON
            } 
            
            $ponente->sincronizar($_POST);
            
            // Depuración: Verificar el objeto antes de guardar
            error_log("Objeto ponente antes de guardar: " . json_encode(get_object_vars($ponente)));
            
            // Validar
            $alertas = $ponente->validar();
            
            if(empty($alertas)) {
                // Guardar las imágenes
                if(isset($nombre_imagen)) {
                    $imagen_png->save($carpeta_imagenes . '/' . $nombre_imagen . ".png");
                    $imagen_webp->save($carpeta_imagenes . '/' . $nombre_imagen . ".webp");
                }
                
                // Guardar en la BD
                $resultadoGuardar = $ponente->guardar();
                error_log("Resultado de guardar: " . json_encode($resultadoGuardar));
                
                if (is_array($resultadoGuardar) && isset($resultadoGuardar['resultado']) && $resultadoGuardar['resultado']) {
                    // Guardado exitoso
                    echo json_encode([
                        'error' => false,
                        'msg' => 'Ponente guardado correctamente',
                        'id' => $resultadoGuardar['id']
                    ]);
                } else {
                    // Error al guardar
                    echo json_encode([
                        'error' => true,
                        'msg' => 'Error al guardar el ponente en la base de datos'
                    ]);
                }
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
    $carpeta_imagenes = '../public/img/speakers';
    
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
        
        // Como no tienes GD library, usaremos métodos básicos para copiar la imagen
        $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
        $ruta_destino = $carpeta_imagenes . '/' . $imagen . '.' . $extension;
        
        if(move_uploaded_file($_FILES['imagen']['tmp_name'], $ruta_destino)) {
            // Eliminar imágenes previas si no es la default
            if($imagen_actual && $imagen_actual !== 'default_speaker') {
                foreach (glob($carpeta_imagenes . '/' . $imagen_actual . '.*') as $archivo) {
                    unlink($archivo);
                }
            }
            
            // Asignar la nueva imagen
            $ponente->imagen = $imagen;
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