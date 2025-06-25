<?php 
error_reporting(E_ALL & ~E_DEPRECATED);
ini_set('display_errors', 1);

require_once __DIR__ . '/../app/models/ActiveRecord.php';

use Dotenv\Dotenv;
use Model\ActiveRecord;
require __DIR__ . '/../vendor/autoload.php';

// Añadir Dotenv
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

require 'funciones.php';
require 'database.php';

// Conectarnos a la base de datos
ActiveRecord::setDB($db);