<?php
// Configuración CORS para permitir peticiones desde React
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Incluir configuración
require_once __DIR__ . '/../includes/app.php';

// Obtener la ruta solicitada
$ruta_completa = $_SERVER['REQUEST_URI'] ?? '/';
$ruta = strtok($ruta_completa, '?'); 

// Sistema de rutas manual
switch(true) {
    // AUTH - AUTENTICACIÓN
    case $ruta === '/registro' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../controllers/AuthController.php';
        \Controllers\AuthController::registro();
        break;
        
    case strpos($ruta, '/confirmar/') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/AuthController.php';
        // Extraer token
        $token = substr($ruta, strlen('/confirmar/'));
        \Controllers\AuthController::confirmar($token);
        break;
        
    case $ruta === '/login' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../controllers/AuthController.php';
        \Controllers\AuthController::login();
        break;
        
    // RECUPERACIÓN DE PASSWORD
    case $ruta === '/olvide-password' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../controllers/AuthController.php';
        \Controllers\AuthController::olvide();
        break;
        
    case strpos($ruta, '/olvide-password/') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/AuthController.php';
        $token = substr($ruta, strlen('/olvide-password/'));
        \Controllers\AuthController::verificarToken($token);
        break;
        
    case strpos($ruta, '/olvide-password/') === 0 && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../controllers/AuthController.php';
        $token = substr($ruta, strlen('/olvide-password/'));
        \Controllers\AuthController::reestablecerPassword($token);
        break;
    
    // PERFIL USUARIO    
    case $ruta === '/perfil' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/AuthController.php';
        \Controllers\AuthController::perfil();
        break;
        
    // ACTUALIZAR PERFIL Y PASSWORD
    case $ruta === '/actualizar-perfil' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../controllers/DashboardController.php';
        \Controllers\DashboardController::actualizarPerfil();
        break;
        
    case $ruta === '/cambiar-password' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../controllers/DashboardController.php';
        \Controllers\DashboardController::cambiarPassword();
        break;
    
    // API DE EVENTOS
    case $ruta === '/api/eventos' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/APIEventosController.php';
        \Controllers\APIEventos::index();
        break;
        
    case $ruta === '/api/eventos-horario' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/APIEventosController.php';
        \Controllers\APIEventos::horario();
        break;


    
    // API DE PONENTES    
    case $ruta === '/api/ponentes' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/APIPonentes.php';
        \Controllers\APIPonentes::index();
        break;
        
    case strpos($ruta, '/api/ponente/') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/APIPonentes.php';
        $id = substr($ruta, strlen('/api/ponente/'));
        \Controllers\APIPonentes::ponente($id);
        break;
    
    case strpos($ruta, '/api/ponentes/') === 0 && $_SERVER['REQUEST_METHOD'] === 'DELETE':
        require_once __DIR__ . '/../controllers/APIPonentes.php';
        $id = substr($ruta, strlen('/api/ponentes/'));
        \Controllers\APIPonentes::eliminar($id);
        break;

    case $ruta === '/api/ponentes' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../controllers/APIPonentes.php';
        \Controllers\APIPonentes::crear();
        break;    
        
    // API DE REGALOS    
    case $ruta === '/api/regalos' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/APIRegalos.php';
        \Controllers\APIRegalos::index();
        break;
    
    // EVENTOS (ADMIN)
    case $ruta === '/admin/eventos' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/EventosController.php';
        \Controllers\EventosController::index();
        break;
        
    case $ruta === '/admin/eventos/crear' && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../controllers/EventosController.php';
        \Controllers\EventosController::crear();
        break;
        
    case strpos($ruta, '/admin/eventos/editar/') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/EventosController.php';
        $id = substr($ruta, strlen('/admin/eventos/editar/'));
        \Controllers\EventosController::editar($id);
        break;
        
    case strpos($ruta, '/admin/eventos/editar/') === 0 && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../controllers/EventosController.php';
        $id = substr($ruta, strlen('/admin/eventos/editar/'));
        \Controllers\EventosController::actualizar($id);
        break;
        
    case strpos($ruta, '/admin/eventos/eliminar/') === 0 && $_SERVER['REQUEST_METHOD'] === 'POST':
        require_once __DIR__ . '/../controllers/EventosController.php';
        $id = substr($ruta, strlen('/admin/eventos/eliminar/'));
        \Controllers\EventosController::eliminar($id);
        break;
    
    // DASHBOARD
    case $ruta === '/admin/dashboard' && $_SERVER['REQUEST_METHOD'] === 'GET':
        require_once __DIR__ . '/../controllers/DashboardController.php';
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