<?php

namespace Controllers;

use Model\Dia;
use Model\Hora;
use Model\Evento;
use Model\Paquete;
use Model\Ponente;
use Model\Usuario;
use Model\Registro;
use Model\Categoria;
use Model\EventosRegistros;
use Model\Regalo;

class RegistroController {

    public static function crear() {
        // Validar autenticación
        if(!isset($_SESSION['id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }

        // Verificar si el usuario ya está registrado
        $registro = Registro::where('usuario_id', $_SESSION['id']);

        if(isset($registro)) {
            // Indicar que ya existe un registro
            echo json_encode([
                'error' => false,
                'registrado' => true,
                'paquete_id' => $registro->paquete_id,
                'token' => $registro->token
            ]);
            return;
        }

        // Obtener los paquetes disponibles
        $paquetes = Paquete::all('ASC');
        
        echo json_encode([
            'error' => false,
            'registrado' => false,
            'paquetes' => $paquetes
        ]);
    }

    public static function gratis() {
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                'error' => true,
                'msg' => 'Método no válido'
            ]);
            return;
        }
        
        // Validar autenticación
        if(!isset($_SESSION['id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }

        // Verificar si el usuario ya está registrado
        $registro = Registro::where('usuario_id', $_SESSION['id']);
        if(isset($registro) && $registro->paquete_id === "3") {
            echo json_encode([
                'error' => false,
                'registrado' => true,
                'token' => $registro->token
            ]);
            return;
        }

        $token = substr(md5(uniqid(rand(), true)), 0, 8);
        
        // Crear registro
        $datos = [
            'paquete_id' => 3,
            'pago_id' => '',
            'token' => $token,
            'usuario_id' => $_SESSION['id']
        ];

        $registro = new Registro($datos);
        $resultado = $registro->guardar();

        if($resultado) {
            echo json_encode([
                'error' => false,
                'token' => $token,
                'msg' => 'Registro exitoso'
            ]);
        } else {
            echo json_encode([
                'error' => true,
                'msg' => 'Error al registrar'
            ]);
        }
    }

    public static function boleto() {
        // Obtener token desde query params
        $token = $_GET['token'] ?? null;

        if(!$token || strlen($token) !== 8) {
            echo json_encode([
                'error' => true,
                'msg' => 'Token no válido'
            ]);
            return;
        }

        // Buscar en la BD
        $registro = Registro::where('token', $token);
        if(!$registro) {
            echo json_encode([
                'error' => true,
                'msg' => 'No existe registro con ese token'
            ]);
            return;
        }
        
        // Obtener información relacionada
        $usuario = Usuario::find($registro->usuario_id);
        $paquete = Paquete::find($registro->paquete_id);
        
        // Obtener eventos registrados si es un paquete presencial
        $eventos_registrados = [];
        if($registro->paquete_id === "1") {
            $eventos = EventosRegistros::whereArray(['registro_id' => $registro->id]);
            foreach($eventos as $evento_registro) {
                $evento = Evento::find($evento_registro->evento_id);
                $evento->categoria = Categoria::find($evento->categoria_id);
                $evento->dia = Dia::find($evento->dia_id);
                $evento->hora = Hora::find($evento->hora_id);
                $evento->ponente = Ponente::find($evento->ponente_id);
                
                $eventos_registrados[] = [
                    'id' => $evento->id,
                    'nombre' => $evento->nombre,
                    'descripcion' => $evento->descripcion,
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
        }

        echo json_encode([
            'error' => false,
            'registro' => [
                'token' => $registro->token,
                'paquete' => [
                    'id' => $paquete->id,
                    'nombre' => $paquete->nombre
                ],
                'usuario' => [
                    'nombre' => $usuario->nombre,
                    'apellido' => $usuario->apellido,
                    'email' => $usuario->email
                ],
                'eventos' => $eventos_registrados
            ]
        ]);
    }

    public static function pagar() {
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                'error' => true,
                'msg' => 'Método no válido'
            ]);
            return;
        }

        // Validar autenticación
        if(!isset($_SESSION['id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }

        // Recibir los datos JSON
        $json = file_get_contents("php://input");
        $datos = json_decode($json, true);
        
        if(empty($datos)) {
            echo json_encode([
                'error' => true,
                'msg' => 'Datos inválidos'
            ]);
            return;
        }

        // Crear el registro
        $datos['token'] = substr(md5(uniqid(rand(), true)), 0, 8);
        $datos['usuario_id'] = $_SESSION['id'];
        
        try {
            $registro = new Registro($datos);
            $resultado = $registro->guardar();
            
            echo json_encode([
                'error' => false,
                'resultado' => $resultado ? true : false,
                'token' => $datos['token']
            ]);
        } catch (\Throwable $th) {
            echo json_encode([
                'error' => true,
                'msg' => 'Error al procesar el pago',
                'detalle' => $th->getMessage()
            ]);
        }
    }

    public static function conferencias() {
        // Validar autenticación
        if(!isset($_SESSION['id'])) {
            echo json_encode([
                'error' => true,
                'msg' => 'Acceso denegado'
            ]);
            return;
        }

        // Validar que el usuario tenga el plan presencial
        $usuario_id = $_SESSION['id'];
        $registro = Registro::where('usuario_id', $usuario_id);

        if(!isset($registro)) {
            echo json_encode([
                'error' => true,
                'msg' => 'Usuario no registrado'
            ]);
            return;
        }
        
        if($registro->paquete_id !== "1") {
            echo json_encode([
                'error' => true,
                'msg' => 'El usuario no tiene un paquete presencial'
            ]);
            return;
        }

        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Obtener eventos disponibles
            $eventos = Evento::ordenar('hora_id', 'ASC');

            $eventos_formateados = [];
            foreach($eventos as $evento) {
                $evento->categoria = Categoria::find($evento->categoria_id);
                $evento->dia = Dia::find($evento->dia_id);
                $evento->hora = Hora::find($evento->hora_id);
                $evento->ponente = Ponente::find($evento->ponente_id);
                
                // Convertir a formato JSON adecuado
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
            
            $regalos = Regalo::all('ASC');

            echo json_encode([
                'error' => false,
                'eventos' => $eventos_formateados,
                'regalos' => $regalos
            ]);
            return;
        }

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Recibir datos JSON
            $json = file_get_contents("php://input");
            $datos = json_decode($json, true);
            
            $eventos = $datos['eventos'] ?? [];
            $regalo_id = $datos['regalo_id'] ?? null;
            
            if(empty($eventos)) {
                echo json_encode([
                    'error' => true,
                    'msg' => 'Selecciona al menos un evento'
                ]);
                return;
            }

            // Validar disponibilidad de eventos
            $eventos_array = [];
            foreach($eventos as $evento_id) {
                $evento = Evento::find($evento_id);
                if(!isset($evento) || $evento->disponibles === "0") {
                    echo json_encode([
                        'error' => true,
                        'msg' => 'El evento seleccionado no está disponible'
                    ]);
                    return;
                }
                $eventos_array[] = $evento;
            }

            foreach($eventos_array as $evento) {
                $evento->disponibles -= 1;
                $evento->guardar();

                // Almacenar el registro de evento
                $datos_registro = [
                    'evento_id' => (int) $evento->id,
                    'registro_id' => (int) $registro->id
                ];

                $registro_usuario = new EventosRegistros($datos_registro);
                $registro_usuario->guardar();
            }

            // Almacenar el regalo
            $registro->sincronizar(['regalo_id' => $regalo_id]);
            $resultado = $registro->guardar();

            echo json_encode([
                'error' => !$resultado,
                'msg' => $resultado ? 'Eventos registrados correctamente' : 'Error al registrar eventos',
                'token' => $registro->token
            ]);
        }
    }
}