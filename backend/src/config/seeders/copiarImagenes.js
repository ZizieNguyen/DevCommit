import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const copiarImagenesPonentes = () => {
  try {
    console.log('📸 Copiando imágenes de ponentes...');
    
    // Rutas de origen y destino
    const origen = path.join(__dirname, '../../../../frontend/public/speakers');
    const destino = path.join(__dirname, '../../../uploads/ponentes');
    
    // Verificar que el directorio de origen exista
    if (!fs.existsSync(origen)) {
      console.error(`❌ No se encontró el directorio: ${origen}`);
      return false;
    }
    
    // Crear directorio destino si no existe
    if (!fs.existsSync(destino)) {
      fs.mkdirSync(destino, { recursive: true });
      console.log(`✅ Directorio creado: ${destino}`);
    }
    
    // Leer todas las imágenes disponibles
    const archivos = fs.readdirSync(origen);
    console.log(`📋 Archivos disponibles en directorio origen: ${archivos.length}`);
    
    // Filtrar solo imágenes
    const imagenes = archivos.filter(archivo => 
      /\.(png|jpg|jpeg|gif|webp)$/i.test(archivo)
    );
    
    // Copiar cada imagen
    let copiadas = 0;
    for (const imagen of imagenes) {
      const rutaOrigen = path.join(origen, imagen);
      const rutaDestino = path.join(destino, imagen);
      
      if (fs.existsSync(rutaOrigen)) {
        fs.copyFileSync(rutaOrigen, rutaDestino);
        copiadas++;
        console.log(`✅ Imagen copiada: ${imagen}`);
      }
    }
    
    console.log(`✅ Total de ${copiadas} imágenes copiadas`);
    return true;
  } catch (error) {
    console.error('❌ Error al copiar imágenes:', error);
    return false;
  }
};