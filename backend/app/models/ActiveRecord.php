<?php
namespace Model;
class ActiveRecord {

    // Base DE DATOS
    protected static $db;
    protected static $tabla = '';
    protected static $columnasDB = [];

    // Alertas y Mensajes
    protected static $alertas = [];
    
    // Definir la conexión a la BD - includes/database.php
    public static function setDB($database) {
        self::$db = $database;
    }

    public static function getDB() {
        return self::$db;
    }

    // Setear un tipo de Alerta
    public static function setAlerta($tipo, $mensaje) {
        static::$alertas[$tipo][] = $mensaje;
    }

    // Obtener las alertas
    public static function getAlertas() {
        return static::$alertas;
    }

    // Validación que se hereda en modelos
    public function validar() {
        static::$alertas = [];
        return static::$alertas;
    }

    // Consulta SQL para crear un objeto en Memoria (Active Record)
    public static function consultarSQL($query) {
        // Consultar la base de datos
        $resultado = self::$db->query($query);

        // Iterar los resultados
        $array = [];
        while($registro = $resultado->fetch_assoc()) {
            $array[] = static::crearObjeto($registro);
        }

        // liberar la memoria
        $resultado->free();

        // retornar los resultados
        return $array;
    }

    // Crea el objeto en memoria que es igual al de la BD
    protected static function crearObjeto($registro) {
        $objeto = new static;

        foreach($registro as $key => $value ) {
            if(property_exists( $objeto, $key  )) {
                $objeto->$key = $value;
            }
        }
        return $objeto;
    }

    // Identificar y unir los atributos de la BD
    public function atributos() {
        $atributos = [];
        foreach(static::$columnasDB as $columna) {
            // Quitar esta línea que excluye el ID
            // if($columna === 'id') continue;
            $atributos[$columna] = $this->$columna;
        }
        return $atributos;
    }

    // Añadir este nuevo método para usar solo en operaciones DB (líneas 72-80)
    public function atributosParaDB() {
        $atributos = $this->atributos();
        if (!is_null($this->id)) {
            unset($atributos['id']); // Solo quitar ID al insertar registros nuevos
        }
        return $atributos;
    }

    // Sanitizar los datos antes de guardarlos en la BD
    public function sanitizarAtributos() {
    // Cambiar a atributosParaDB para operaciones de base de datos
    $atributos = $this->atributosParaDB();
    $sanitizado = [];
    foreach($atributos as $key => $value) {
        $sanitizado[$key] = is_null($value) ? '' : self::$db->escape_string((string)$value);
    }
    return $sanitizado;
}

    // Sincroniza BD con Objetos en memoria
    public function sincronizar($args=[]) { 
        foreach($args as $key => $value) {
          if(property_exists($this, $key) && !is_null($value)) {
            $this->$key = $value;
          }
        }
    }

    // Registros - CRUD
    public function guardar() {
        error_log("ID antes de guardar: " . $this->id . " (tipo: " . gettype($this->id) . ")");
        
        if(!is_null($this->id)) {
            // Actualizar
            return $this->actualizar();
        } else {
            // Crear nuevo
            return $this->crear();
        }
    }

    // Obtener todos los Registros
    public static function all($orden = 'DESC') {
        $query = "SELECT * FROM " . static::$tabla . " ORDER BY id {$orden}";
        $resultado = self::consultarSQL($query);
        return $resultado;
    }

    // Busca un registro por su id
    public static function find($id) {
    $id = self::$db->escape_string($id);
    $query = "SELECT * FROM " . static::$tabla  ." WHERE id = '{$id}'";
    $resultado = self::consultarSQL($query);
    return array_shift($resultado);
}

    // Obtener Registros con cierta cantidad
    public static function get($limite) {
        $query = "SELECT * FROM " . static::$tabla . " ORDER BY id DESC LIMIT {$limite} " ;
        $resultado = self::consultarSQL($query);
        return $resultado;
    }

    // Paginar los registros
    public static function paginar($por_pagina, $offset) {
        $query = "SELECT * FROM " . static::$tabla . " ORDER BY id ASC LIMIT {$por_pagina} OFFSET {$offset} " ;
        $resultado = self::consultarSQL($query);
        return $resultado;
    }

    // Busqueda Where con Columna 
    public static function where($columna, $valor) {
        $query = "SELECT * FROM " . static::$tabla . " WHERE {$columna} = '{$valor}'";
        $resultado = self::consultarSQL($query);

        error_log("Consulta: {$query} - Resultados: " . count($resultado));
    

        if(empty($resultado)) {
            return null;
        }
        return array_shift( $resultado ) ;
    }

    // Retornar los registros por un orden
    public static function ordenar($columna, $orden) {
        $query = "SELECT * FROM " . static::$tabla . " ORDER BY {$columna} {$orden} "; 
        $resultado = self::consultarSQL($query);
        return $resultado;
    }
    // Retornar por orden y con un limite
    public static function ordenarLimite($columna, $orden, $limite) {
        $query = "SELECT * FROM " . static::$tabla . " ORDER BY {$columna} {$orden} LIMIT {$limite} "; 
        $resultado = self::consultarSQL($query);
        return $resultado;
    }

    // Busqueda Where con Múltiples opciones
    public static function whereArray($array = []) {
        $query = "SELECT * FROM " . static::$tabla . " WHERE ";
        foreach($array as $key => $value) {
            if($key == array_key_last($array)) {
                $query .= " {$key} = '{$value}'";
            } else {
                $query .= " {$key} = '{$value}' AND ";
            }
        }
        $resultado = self::consultarSQL($query);
        return $resultado;
    }

    // Traer un total de registros
    public static function total($columna = '', $valor = '') {
        $query = "SELECT COUNT(*) FROM " . static::$tabla;
        if($columna) {
            $query .= " WHERE {$columna} = {$valor}";
        }
        $resultado = self::$db->query($query);
        $total = $resultado->fetch_array();

        return array_shift($total);
    }

    // Total de Registros con un Array Where
    public static function totalArray($array = []) {
        $query = "SELECT COUNT(*) FROM " . static::$tabla . " WHERE ";
        foreach($array as $key => $value) {
            if($key == array_key_last($array)) {
                $query .= " {$key} = '{$value}' ";
            } else {
                $query .= " {$key} = '{$value}' AND ";
            }
        }
        $resultado = self::$db->query($query);
        $total = $resultado->fetch_array();
        return array_shift($total);
    }

    // crea un nuevo registro
    public function crear() {
        // Sanitizar los datos
        $atributos = $this->sanitizarAtributos();

        unset($atributos['id']);

        // Insertar en la base de datos
        $query = " INSERT INTO " . static::$tabla . " ( ";
        $query .= join(', ', array_keys($atributos));
        $query .= " ) VALUES (' "; 
        $query .= join("', '", array_values($atributos));
        $query .= " ') ";

        // debuguear($query); // Descomentar si no te funciona algo

        // Resultado de la consulta
        $resultado = self::$db->query($query);
        if($resultado) {
            $this->id = self::$db->query("SELECT LAST_INSERT_ID()")->fetch_assoc()['LAST_INSERT_ID()'];
        }
        
        return [
        'resultado' => $resultado,
        'id' => $this->id 
        ];
    }

    // Actualizar el registro
    public function actualizar() {
        error_log("Ejecutando actualizar() para ID: {$this->id}");
        // Sanitizar los datos
        $atributos = $this->sanitizarAtributos();

        // Iterar para ir agregando cada campo de la BD
        $valores = [];
        foreach($atributos as $key => $value) {
            $valores[] = "{$key}='{$value}'";
        }

        // Consulta SQL
        $query = "UPDATE " . static::$tabla ." SET ";
        $query .=  join(', ', $valores );
        $query .= " WHERE id = '" . self::$db->escape_string($this->id) . "' ";
        $query .= " LIMIT 1 "; 

        // Actualizar BD
        $resultado = self::$db->query($query);
        return $resultado;
    }

    // Eliminar un Registro por su ID
    public function eliminar() {
        $query = "DELETE FROM "  . static::$tabla . " WHERE id = " . self::$db->escape_string($this->id) . " LIMIT 1";
        $resultado = self::$db->query($query);
        return $resultado;
    }

    protected static function columnExists($columna) {
        $query = "SHOW COLUMNS FROM " . static::$tabla . " LIKE '{$columna}'";
        $resultado = self::$db->query($query);
        return $resultado && $resultado->num_rows > 0;
    }

    public static function SQL($query) {
        $resultado = self::$db->query($query);
        return $resultado;
    }
}