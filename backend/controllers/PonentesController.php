<?php


namespace Controllers;

use Classes\Paginacion;
use Model\Ponente;
use Intervention\Image\ImageManagerStatic as Image;

class PonentesController {

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
        $usuario = \Model\Usuario::find($_SESSION['id']);
        if(!$usuario->admin) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }
        
        // Manejar paginación
        $pagina = $_GET['pagina'] ?? 1;
        $pagina = filter_var($pagina, FILTER_VALIDATE_INT) ?? 1;
        $pagina = max(1, $pagina); // Asegurarse que sea al menos 1
        
        $registros_por_pagina = 10;
        $total = Ponente::total();
        
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

        $ponentes = Ponente::paginar($registros_por_pagina, $offset);
        
        // Formatear ponentes para la respuesta JSON
        $ponentes_array = [];
        foreach($ponentes as $ponente) {
            $ponentes_array[] = [
                'id' => $ponente->id,
                'nombre' => $ponente->nombre,
                'apellido' => $ponente->apellido,
                'ciudad' => $ponente->ciudad,
                'pais' => $ponente->pais,
                'imagen' => $ponente->imagen,
                'tags' => $ponente->tags,
                'redes' => json_decode($ponente->redes)
            ];
        }

        // Devolver respuesta JSON
        echo json_encode([
            'error' => false,
            'ponentes' => $ponentes_array,
            'paginacion' => [
                'pagina_actual' => $pagina,
                'total_paginas' => $total_paginas,
                'registros_por_pagina' => $registros_por_pagina,
                'total_registros' => $total
            ]
        ]);
    }

    public static function crear() {
        // Validar autenticación
        if(!isset($_SESSION['id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }
        
        // Verificar si es admin
        $usuario = \Model\Usuario::find($_SESSION['id']);
        if(!$usuario->admin) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }

        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Para solicitudes GET, devolvemos un formulario vacío o datos iniciales
            echo json_encode([
                'error' => false,
                'ponente' => [],
                'redes' => (object) [
                    'facebook' => '',
                    'twitter' => '',
                    'youtube' => '',
                    'instagram' => '',
                    'tiktok' => '',
                    'github' => ''
                ]
            ]);
            return;
        }
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Procesamos los datos del formulario enviados como FormData desde React
            
            $ponente = new Ponente();
            
            // Si hay archivo de imagen
            if(isset($_FILES['imagen']) && !empty($_FILES['imagen']['tmp_name'])) {
                $carpeta_imagenes = __DIR__ . '/../../public/img/speakers';
                
                // Crear la carpeta si no existe
                if(!is_dir($carpeta_imagenes)) {
                    mkdir($carpeta_imagenes, 0755, true);
                }
                
                // Procesar imagen con Intervention Image
                $imagen_png = Image::make($_FILES['imagen']['tmp_name'])->fit(800,800)->encode('png', 80);
                $imagen_webp = Image::make($_FILES['imagen']['tmp_name'])->fit(800,800)->encode('webp', 80);
                
                $nombre_imagen = md5(uniqid(rand(), true));
                
                $_POST['imagen'] = $nombre_imagen;
            }
            
            // Manejar redes sociales
            if(isset($_POST['redes'])) {
                $_POST['redes'] = json_encode($_POST['redes'], JSON_UNESCAPED_SLASHES);
            } else {
                $redes = [
                    'facebook' => $_POST['facebook'] ?? '',
                    'twitter' => $_POST['twitter'] ?? '',
                    'youtube' => $_POST['youtube'] ?? '',
                    'instagram' => $_POST['instagram'] ?? '',
                    'tiktok' => $_POST['tiktok'] ?? '',
                    'github' => $_POST['github'] ?? ''
                ];
                $_POST['redes'] = json_encode($redes, JSON_UNESCAPED_SLASHES);
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
                
                if($resultado) {
                    echo json_encode([
                        'error' => false,
                        'msg' => 'Ponente guardado correctamente',
                        'id' => $resultado
                    ]);
                } else {
                    echo json_encode([
                        'error' => true,
                        'msg' => 'Error al guardar el ponente'
                    ]);
                }
            } else {
                echo json_encode([
                    'error' => true,
                    'msg' => $alertas
                ]);
            }
        }
    }

    public static function editar($id = null) {
        // Validar autenticación
        if(!isset($_SESSION['id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }
        
        // Verificar si es admin
        $usuario = \Model\Usuario::find($_SESSION['id']);
        if(!$usuario->admin) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }
        
        // Validar el ID
        $id = filter_var($id, FILTER_VALIDATE_INT);
        
        if(!$id) {
            echo json_encode([
                'error' => true,
                'msg' => 'ID no válido'
            ]);
            return;
        }
        
        // Obtener ponente a editar
        $ponente = Ponente::find($id);
        
        if(!$ponente) {
            echo json_encode([
                'error' => true,
                'msg' => 'Ponente no encontrado'
            ]);
            return;
        }
        
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Para solicitudes GET, devolvemos los datos del ponente
            echo json_encode([
                'error' => false,
                'ponente' => $ponente,
                'redes' => json_decode($ponente->redes)
            ]);
            return;
        }
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $ponente->imagen_actual = $ponente->imagen;
            
            // Si hay archivo de imagen
            if(isset($_FILES['imagen']) && !empty($_FILES['imagen']['tmp_name'])) {
                $carpeta_imagenes = __DIR__ . '/../../public/img/speakers';
                
                // Crear la carpeta si no existe
                if(!is_dir($carpeta_imagenes)) {
                    mkdir($carpeta_imagenes, 0755, true);
                }
                
                // Procesar imagen con Intervention Image
                $imagen_png = Image::make($_FILES['imagen']['tmp_name'])->fit(800,800)->encode('png', 80);
                $imagen_webp = Image::make($_FILES['imagen']['tmp_name'])->fit(800,800)->encode('webp', 80);
                
                $nombre_imagen = md5(uniqid(rand(), true));
                
                $_POST['imagen'] = $nombre_imagen;
            } else {
                $_POST['imagen'] = $ponente->imagen_actual;
            }
            
            // Manejar redes sociales
            if(isset($_POST['redes'])) {
                $_POST['redes'] = json_encode($_POST['redes'], JSON_UNESCAPED_SLASHES);
            } else {
                $redes = [
                    'facebook' => $_POST['facebook'] ?? '',
                    'twitter' => $_POST['twitter'] ?? '',
                    'youtube' => $_POST['youtube'] ?? '',
                    'instagram' => $_POST['instagram'] ?? '',
                    'tiktok' => $_POST['tiktok'] ?? '',
                    'github' => $_POST['github'] ?? ''
                ];
                $_POST['redes'] = json_encode($redes, JSON_UNESCAPED_SLASHES);
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
            } else {
                echo json_encode([
                    'error' => true,
                    'msg' => $alertas
                ]);
            }
        }
    }

    public static function eliminar($id = null) {
        // Validar autenticación
        if(!isset($_SESSION['id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }
        
        // Verificar si es admin
        $usuario = \Model\Usuario::find($_SESSION['id']);
        if(!$usuario->admin) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Obtener ID del JSON recibido
            $json = file_get_contents("php://input");
            $datos = json_decode($json, true);
            
            $id = $datos['id'] ?? $id;
            $id = filter_var($id, FILTER_VALIDATE_INT);
            
            if(!$id) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'ID no válido'
                ]);
                return;
            }
            
            $ponente = Ponente::find($id);
            
            if(!$ponente) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'Ponente no encontrado'
                ]);
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
    }
}