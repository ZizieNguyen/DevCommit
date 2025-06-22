<?php 

namespace Model;

class Ponente extends ActiveRecord {
    public $id;
    public $nombre;
    public $apellido;
    public $ciudad;
    public $pais;
    public $imagen;
    public $tags;
    public $redes;
    
    protected static $tabla = 'ponentes';
    protected static $columnasDB = ['id', 'nombre', 'apellido', 'ciudad', 'pais', 'imagen', 'tags', 'redes'];


    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->apellido = $args['apellido'] ?? '';
        $this->ciudad = $args['ciudad'] ?? '';
        $this->pais = $args['pais'] ?? '';
        $this->imagen = $args['imagen'] ?? '';
        $this->tags = $args['tags'] ?? '';
        $this->redes = $args['redes'] ?? '';
    }

    public function validar() {
        if(!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre es Obligatorio';
        }
        if(!$this->apellido) {
            self::$alertas['error'][] = 'El Apellido es Obligatorio';
        }
        if(!$this->ciudad) {
            self::$alertas['error'][] = 'El Campo Ciudad es Obligatorio';
        }
        if(!$this->pais) {
            self::$alertas['error'][] = 'El Campo País es Obligatorio';
        }
        // if(!$this->imagen) {
        //     self::$alertas['error'][] = 'La imagen es obligatoria';
        // }
        // if(!$this->tags) {
        //     self::$alertas['error'][] = 'El Campo áreas es obligatorio';
        // }
    
        return self::$alertas;
    }

    public function getRutaImagen() {
    // Si no hay imagen definida, retornar directamente la default
    if(!$this->imagen || $this->imagen === '') {
        return '/speakers/default_speaker.png';
    }
    
    // Caso especial para default_speaker
    if($this->imagen === 'default_speaker') {
        return '/speakers/default_speaker.png';
    }
    
    // Verificar si el nombre ya incluye extensión
    $extension = pathinfo($this->imagen, PATHINFO_EXTENSION);
    
    if($extension) {
        // Ya tiene extensión, usar el nombre completo
        return '/speakers/' . $this->imagen;
    } else {
        // Intentar con varias extensiones - apuntando a la nueva ubicación
        return '/speakers/' . $this->imagen;
    }
}


// Modificar el método toArray() para incluir la ruta de la imagen
public function toArray() {
    $array = [];
    
    foreach($this->atributos() as $key => $value) {
        if($key === 'redes') {
            $array[$key] = json_decode($value);
        } else {
            $array[$key] = $value;
        }
    }
    
    // Añadir la ruta completa de la imagen
    $array['ruta_imagen'] = $this->getRutaImagen();
    
    return $array;
}


}