<?php

// Archivo de prueba independiente que no modifica archivos originales

// Cargar variables de entorno manualmente
$host = 'localhost';
$user = 'root';
$pass = 'Zizie1234*';
$db_name = 'devcommit';

// Intentar conexión directa
try {
    $mysqli = new mysqli($host, $user, $pass, $db_name);

    if ($mysqli->connect_error) {
        throw new Exception("Error de conexión: " . $mysqli->connect_error);
    }

    echo "¡ÉXITO! Conexión establecida correctamente a la base de datos '$db_name'\n";
    
    // Probar una consulta básica
    $result = $mysqli->query("SHOW TABLES");
    
    echo "\nTablas en la base de datos:\n";
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_row()) {
            echo "- " . $row[0] . "\n";
        }
    } else {
        echo "La base de datos no contiene tablas aún\n";
    }
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}