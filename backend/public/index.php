<?php

error_log("REQUEST_URI: " . $_SERVER['REQUEST_URI']);
error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);

// Configuración CORS para permitir peticiones desde React en desarrollo
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS');
header('Access-Control-Allow-Credentials: true');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Incluir configuración
require_once __DIR__ . '/../config/app.php';

// Obtener la ruta solicitada
$ruta_completa = $_SERVER['REQUEST_URI'] ?? '/';
$ruta = strtok($ruta_completa, '?'); 

if (strpos($ruta, '/backend/public') === 0) {
    $ruta = substr($ruta, strlen('/backend/public'));
}

error_log("Ruta original: " . $_SERVER['REQUEST_URI'] . " | Ruta procesada: " . $ruta);

// Sistema de rutas manual
switch(true) {
    // AUTH - AUTENTICACIÓN
    case $ruta === '/registro' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/AuthController.php';
        \Controllers\AuthController::registro();
        break;
        
    case strpos($ruta, '/confirmar/') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/AuthController.php';
        // Extraer token
        $token = substr($ruta, strlen('/confirmar/'));
        \Controllers\AuthController::confirmar($token);
        break;
        
    case $ruta === '/login' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/AuthController.php';
        \Controllers\AuthController::login();
        break;
        
    // RECUPERACIÓN DE PASSWORD
    case $ruta === '/olvide-password' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/AuthController.php';
        \Controllers\AuthController::olvide();
        break;
        
    case strpos($ruta, '/olvide-password/') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/AuthController.php';
        $token = substr($ruta, strlen('/olvide-password/'));
        \Controllers\AuthController::verificarToken($token);
        break;
        
    case strpos($ruta, '/olvide-password/') === 0 && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/AuthController.php';
        $token = substr($ruta, strlen('/olvide-password/'));
        \Controllers\AuthController::reestablecerPassword($token);
        break;
    
    // PERFIL USUARIO    
    case $ruta === '/perfil' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/AuthController.php';
        \Controllers\AuthController::perfil();
        break;
        
    // ACTUALIZAR PERFIL Y PASSWORD
    case $ruta === '/actualizar-perfil' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/DashboardController.php';
        \Controllers\DashboardController::actualizarPerfil();
        break;
        
    case $ruta === '/cambiar-password' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/DashboardController.php';
        \Controllers\DashboardController::cambiarPassword();
        break;
    
    // API DE EVENTOS
    case $ruta === '/api/eventos' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/APIEventos.php';
        \Controllers\APIEventos::index();
        break;
        
    case $ruta === '/api/eventos-horario' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/APIEventos.php';
        \Controllers\APIEventos::horario();
        break;

    case $ruta === '/admin/eventos/crear' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/EventosController.php';
        \Controllers\EventosController::crear();
        break; 
        
    case $ruta === '/api/eventos-ponente' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/APIEventos.php';
        \Controllers\APIEventos::porPonente();
        break;
        
    case strpos($ruta, '/api/eventos/') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET':
        $id = substr($ruta, strlen('/api/eventos/'));
        require_once __DIR__ . '/../app/controllers/APIEventos.php';
        \Controllers\APIEventos::evento($id);
        break;
        
    case $ruta ==='/api/registro/simular-pago' && $_SERVER['REQUEST_METHOD'] === 'POST':
    require_once __DIR__ . '/../app/controllers/RegistroController.php';
    \Controllers\RegistroController::simularPago();
    break;  
    
    case $ruta === '/api/registro/gratis' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/RegistroController.php';
        \Controllers\RegistroController::gratis();
        break;

    case strpos($ruta, '/api/registro/gratis/') === 0 && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/RegistroController.php';
        $usuario_id = substr($ruta, strlen('/api/registro/gratis/'));
        \Controllers\RegistroController::gratisConId($usuario_id);
        break;    

    case $ruta === '/api/registro/verificar' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/RegistroController.php';
        \Controllers\RegistroController::verificarRegistro();
        break;    

    // Ruta para reservar un evento específico
    case $ruta === '/api/eventos/reservar' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/RegistroController.php';
        \Controllers\RegistroController::reservarEvento();
        break;

    // API DE PONENTES
    case $ruta === '/api/ponentes' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/APIPonentes.php';
        \Controllers\APIPonentes::index();
        break;

    case $ruta === '/api/ponentes' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/APIPonentes.php';
        \Controllers\APIPonentes::crear();
        break;  
        
    case $ruta === '/api/ponentes/editar' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/APIPonentes.php';
        \Controllers\APIPonentes::actualizar();
        break;    
        
    case strpos($ruta, '/api/ponente/') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/APIPonentes.php';
        $id = substr($ruta, strlen('/api/ponente/'));
        \Controllers\APIPonentes::ponente($id);
        break;

        
    
    case strpos($ruta, '/api/ponentes/') === 0 && $_SERVER['REQUEST_METHOD'] === 'DELETE':
        require_once __DIR__ . '/../app/controllers/APIPonentes.php';
        $id = substr($ruta, strlen('/api/ponentes/'));
        \Controllers\APIPonentes::eliminar($id);
        break;



    // API para obtener categorías
    case $ruta === '/api/categorias' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/CategoriasController.php';
        \Controllers\CategoriasController::api();
        break;

    // API para obtener días
    case $ruta === '/api/dias' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/DiasController.php';
        \Controllers\DiasController::api();
        break;

    // API para obtener horas
    case $ruta === '/api/horas' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/HorasController.php';
        \Controllers\HorasController::api();
        break;    

// API DE REGALOS
case $ruta === '/api/regalos' && $_SERVER['REQUEST_METHOD'] === 'GET':
    require_once __DIR__ . '/../app/controllers/APIRegalos.php';
    \Controllers\APIRegalos::index();
    break;

// EVENTOS (ADMIN)
    case $ruta === '/admin/eventos' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/EventosController.php';
        \Controllers\EventosController::index();
        break;
        
    case $ruta === '/admin/eventos/crear' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/EventosController.php';
        \Controllers\EventosController::crear();
        break;
        
    case strpos($ruta, '/admin/eventos/editar/') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/EventosController.php';
        $id = substr($ruta, strlen('/admin/eventos/editar/'));
        \Controllers\EventosController::editar($id);
        break;
        
    case strpos($ruta, '/admin/eventos/editar/') === 0 && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/EventosController.php';
        $id = substr($ruta, strlen('/admin/eventos/editar/'));
        \Controllers\EventosController::editar($id);
        break;
        
    case strpos($ruta, '/admin/eventos/eliminar/') === 0 && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../app/controllers/EventosController.php';
        $id = substr($ruta, strlen('/admin/eventos/eliminar/'));
        \Controllers\EventosController::eliminar($id);
        break;
    
    // DASHBOARD
    case $ruta === '/admin/dashboard' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../app/controllers/DashboardController.php';
        \Controllers\DashboardController::index();
        break;

    // Manejo de ruta no encontrada
    default:
        echo json_encode([
            'error' => true,
            'msg' => 'Endpoint no encontrado'
        ]);
        break;
}