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
        return '/img/speakers/default_speaker.png';
    }
    
    // Caso especial para default_speaker (siempre usar .png)
    if($this->imagen === 'default_speaker') {
        return '/img/speakers/default_speaker.png';
    }
    
    // Verificar si el nombre ya incluye extensión
    $extension = pathinfo($this->imagen, PATHINFO_EXTENSION);
    
    if($extension) {
        // Ya tiene extensión, usar el nombre completo
        return '/img/speakers/' . $this->imagen;
    } else {
        // No tiene extensión, intentar con varias extensiones
        $directorio_base = __DIR__ . '/../../public';
        
        $extensiones = ['.jpg', '.png', '.webp'];
        foreach($extensiones as $ext) {
            $ruta_con_ext = '/img/speakers/' . $this->imagen . $ext;
            if(file_exists($directorio_base . $ruta_con_ext)) {
                return $ruta_con_ext;
            }
        }
        
        // Si ninguna extensión funciona, devolver con .jpg (la más común)
        return '/img/speakers/' . $this->imagen . '.jpg';
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