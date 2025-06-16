<?php
require_once '../includes/app.php';
use Model\Ponente;

// Mostrar todas las imágenes disponibles en la carpeta
echo "<h1>Diagnóstico de Imágenes</h1>";

// Ruta de la carpeta de imágenes
$carpeta = __DIR__ . '/img/speakers/';

// Listar archivos
echo "<h2>Archivos en la carpeta:</h2>";
if(is_dir($carpeta)) {
    $archivos = scandir($carpeta);
    echo "<ul>";
    foreach($archivos as $archivo) {
        if($archivo != '.' && $archivo != '..') {
            echo "<li>{$archivo}</li>";
        }
    }
    echo "</ul>";
} else {
    echo "<p>La carpeta no existe: {$carpeta}</p>";
}

// Verificar ponentes
echo "<h2>Ponentes y sus imágenes:</h2>";
$ponentes = Ponente::all();

echo "<table border='1'>";
echo "<tr><th>ID</th><th>Nombre</th><th>Imagen DB</th><th>Ruta imagen</th><th>Archivo existe</th></tr>";

foreach($ponentes as $ponente) {
    $ruta_imagen = $ponente->getRutaImagen();
    $ruta_completa = __DIR__ . $ruta_imagen;
    $existe = file_exists($ruta_completa) ? "SÍ" : "NO";
    
    echo "<tr>";
    echo "<td>{$ponente->id}</td>";
    echo "<td>{$ponente->nombre} {$ponente->apellido}</td>";
    echo "<td>{$ponente->imagen}</td>";
    echo "<td>{$ruta_imagen}</td>";
    echo "<td>{$existe}</td>";
    echo "</tr>";
}

echo "</table>";

// Mostrar rutas de búsqueda
echo "<h2>Información del servidor:</h2>";
echo "<p>__DIR__: " . __DIR__ . "</p>";
echo "<p>document_root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
?>