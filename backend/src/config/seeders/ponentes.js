import { pool } from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verificar los nombres reales de las imágenes
const obtenerNombresImagenes = () => {
  try {
    const dirImagenes = path.join(__dirname, '../../../../frontend/public/speakers');
    if (fs.existsSync(dirImagenes)) {
      return fs.readdirSync(dirImagenes);
    }
    return [];
  } catch (error) {
    console.error('Error al leer directorio de imágenes:', error);
    return [];
  }
};

// Lista de ponentes a registrar con nombres de imágenes a verificar
const obtenerPonentes = () => {
  // Obtener todas las imágenes disponibles
  const imagenesDisponibles = obtenerNombresImagenes();
  console.log(`📸 Imágenes disponibles en speakers: ${imagenesDisponibles.join(', ')}`);
  
  // Mapeo para asociar ponentes con imágenes
  const ponentes = [
    {
      nombre: 'Julian',
      apellido: 'Muñoz',
      ciudad: 'Madrid',
      pais: 'España',
      imagen: obtenerImagen(imagenesDisponibles, 1),
      tags: 'React,PHP,Laravel,JavaScript,Flutter',
      redes: {
        facebook: 'https://facebook.com/julian',
        twitter: 'https://twitter.com/julian',
        youtube: 'https://youtube.com/julian',
        instagram: 'https://instagram.com/julian',
        tiktok: '',
        github: 'https://github.com/julian'
      }
    },
    {
      nombre: 'Isabel',
      apellido: 'Acosta',
      ciudad: 'Barcelona',
      pais: 'España',
      imagen: obtenerImagen(imagenesDisponibles, 2),
      tags: 'UX/UI,CSS,TailwindCSS,HTML',
      redes: {
        facebook: 'https://facebook.com/isabel',
        twitter: 'https://twitter.com/isabel',
        youtube: '',
        instagram: 'https://instagram.com/isabel',
        tiktok: 'https://tiktok.com/isabel',
        github: 'https://github.com/isabel'
      }
    },
    {
      nombre: 'Juan',
      apellido: 'De la torre',
      ciudad: 'Mexico DF',
      pais: 'México',
      imagen: obtenerImagen(imagenesDisponibles, 3),
      tags: 'JavaScript,PHP,Laravel,Firebase,Vue.js',
      redes: {
        facebook: 'https://facebook.com/juan',
        twitter: 'https://twitter.com/juan',
        youtube: 'https://youtube.com/juan',
        instagram: '',
        tiktok: '',
        github: 'https://github.com/juan'
      }
    },
    {
      nombre: 'Lucía',
      apellido: 'Velázquez',
      ciudad: 'Buenos Aires',
      pais: 'Argentina',
      imagen: obtenerImagen(imagenesDisponibles, 4),
      tags: 'React Native,Firebase,TypeScript,GitHub',
      redes: {
        facebook: '',
        twitter: 'https://twitter.com/lucia',
        youtube: 'https://youtube.com/lucia',
        instagram: 'https://instagram.com/lucia',
        tiktok: '',
        github: 'https://github.com/lucia'
      }
    },
    {
      nombre: 'Carlos',
      apellido: 'Hernández',
      ciudad: 'Santiago',
      pais: 'Chile',
      imagen: obtenerImagen(imagenesDisponibles, 5),
      tags: 'WordPress,PHP,MySQL,Node.js,AWS',
      redes: {
        facebook: 'https://facebook.com/carlos',
        twitter: 'https://twitter.com/carlos',
        youtube: '',
        instagram: 'https://instagram.com/carlos',
        tiktok: '',
        github: 'https://github.com/carlos'
      }
    },
    {
      nombre: 'María',
      apellido: 'González',
      ciudad: 'Lima',
      pais: 'Perú',
      imagen: obtenerImagen(imagenesDisponibles, 6),
      tags: 'Next.js,Svelte,Python,Django,MongoDB',
      redes: {
        facebook: 'https://facebook.com/maria',
        twitter: 'https://twitter.com/maria',
        youtube: 'https://youtube.com/maria',
        instagram: '',
        tiktok: 'https://tiktok.com/maria',
        github: 'https://github.com/maria'
      }
    }
  ];
  
  return ponentes.filter(ponente => ponente.imagen);
};

// Función para encontrar una imagen adecuada
function obtenerImagen(imagenes, indice) {
  // Patrones para buscar
  const patrones = [
    // Patrones comunes que podrían tener los nombres de archivos
    new RegExp(`^speaker_?${indice}\\.`, 'i'),        
    new RegExp(`^ponente_?${indice}\\.`, 'i'),          
    new RegExp(`^speaker[^0-9]*${indice}\\.`, 'i'),      
    new RegExp(`^ponente[^0-9]*${indice}\\.`, 'i'),     
    new RegExp(`${indice}[^0-9]*speaker\\.`, 'i'),      
    new RegExp(`${indice}[^0-9]*ponente\\.`, 'i')      
  ];
  
  // Buscar la primera imagen que coincida con algún patrón
  for (const patron of patrones) {
    const encontrada = imagenes.find(img => patron.test(img));
    if (encontrada) return encontrada;
  }
  
  // Si no hay coincidencias pero hay suficientes imágenes, usar la imagen correspondiente al índice
  if (imagenes.length >= indice) {
    return imagenes[indice - 1];
  }
  
  // Si no hay imágenes suficientes, devolver imagen genérica
  return null;
}

// Función para registrar ponentes en la BD
export const registrarPonentes = async () => {
  try {
    console.log('🚀 Registrando ponentes...');
    
    // Verificar si existe la tabla ponentes
    const [tablas] = await pool.query("SHOW TABLES LIKE 'ponentes'");
    
    if (tablas.length === 0) {
      console.log('⚠️ Tabla ponentes no existe, creándola...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ponentes (
          id INT(11) NOT NULL AUTO_INCREMENT,
          nombre VARCHAR(40) NOT NULL,
          apellido VARCHAR(40) NOT NULL,
          ciudad VARCHAR(40) DEFAULT NULL,
          pais VARCHAR(40) DEFAULT NULL,
          imagen VARCHAR(32) DEFAULT NULL,
          tags TEXT DEFAULT NULL,
          redes TEXT DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB;
      `);
      console.log('✅ Tabla ponentes creada');
    }
    
    // Obtener lista de ponentes con imágenes verificadas
    const ponentes = obtenerPonentes();
    
    // Registrar cada ponente
    for (const ponente of ponentes) {
      // Verificar si el ponente ya existe
      const [existe] = await pool.query(
        'SELECT id FROM ponentes WHERE nombre = ? AND apellido = ?',
        [ponente.nombre, ponente.apellido]
      );
      
      if (existe.length) {
        console.log(`ℹ️ ${ponente.nombre} ${ponente.apellido} ya existe (ID: ${existe[0].id})`);
        continue;
      }
      
      // Insertar el ponente
      const [resultado] = await pool.query(
        `INSERT INTO ponentes (nombre, apellido, ciudad, pais, imagen, tags, redes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          ponente.nombre,
          ponente.apellido,
          ponente.ciudad,
          ponente.pais,
          ponente.imagen,
          ponente.tags,
          JSON.stringify(ponente.redes)
        ]
      );
      
      console.log(`✅ Ponente ${ponente.nombre} ${ponente.apellido} registrado (ID: ${resultado.insertId}) con imagen ${ponente.imagen}`);
    }
    
    console.log('✅ Todos los ponentes registrados correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al registrar ponentes:', error);
    return false;
  }
};