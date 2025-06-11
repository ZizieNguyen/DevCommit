<?php

/**
 * Script para crear un usuario administrador por defecto
 * Uso: php install-admin.php
 */

// Incluir configuración y dependencias
require_once __DIR__ . '/includes/app.php';

use Model\Usuario;

echo "==================================\n";
echo "  INSTALACIÓN DE ADMINISTRADOR\n";
echo "==================================\n\n";

// Comprobar si ya existe un administrador
$admin = Usuario::where('admin', 1);

if($admin) {
    echo "⚠️  Ya existe un usuario administrador en el sistema.\n";
    echo "Email: {$admin->email}\n\n";
    echo "Si deseas crear un nuevo administrador, elimina este usuario primero.\n";
    exit;
}

// Datos del administrador
echo "Creando usuario administrador...\n";

$admin = new Usuario([
    'nombre' => 'Admin',
    'apellido' => 'DevCommit',
    'email' => 'admin@yopmail.com',
    'password' => 'admin123',
    'admin' => 1,
    'confirmado' => 1
]);

// Hash del password
$admin->hashPassword();

// Guardar
$resultado = $admin->guardar();

if($resultado) {
    echo "✅ Usuario administrador creado correctamente\n";
    echo "----------------------------------------\n";
    echo "Email: admin@devcommit.com\n";
    echo "Password: admin123\n";
    echo "----------------------------------------\n";
    echo "Utiliza estas credenciales para acceder al panel de administración\n";
    echo "¡IMPORTANTE! Cambia la contraseña después del primer inicio de sesión\n";
} else {
    echo "❌ Error al crear el usuario administrador\n";
    
    if(!empty($admin->alertas)) {
        echo "\nErrores encontrados:\n";
        foreach($admin->alertas as $tipo => $mensajes) {
            foreach($mensajes as $mensaje) {
                echo "- {$mensaje}\n";
            }
        }
    }
}

echo "\n";