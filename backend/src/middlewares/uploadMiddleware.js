import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { generarError } from '../utils/helpers.js';

// Obtener directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar almacenamiento para imágenes de ponentes
const ponentesStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(__dirname, '../../uploads/ponentes');
    
    // Crear el directorio si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    // Generar nombre único basado en timestamp + nombre original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Función para validar tipos de archivos
const fileFilter = (req, file, cb) => {
  const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  
  if (tiposValidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(generarError(400, 'ValidationError', 'Formato de imagen no válido'));
  }
};

// Configurar multer para ponentes
export const uploadPonente = multer({
  storage: ponentesStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).single('imagen');

// Middleware para manejar errores de multer
export const handleUploadErrors = (req, res, next) => {
  uploadPonente(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'El archivo es demasiado grande (máximo 5MB)' });
      }
      return res.status(400).json({ msg: `Error al subir archivo: ${err.message}` });

    } else if (err) {
      return res.status(err.status || 400).json({ msg: err.message || 'Error al subir archivo' });
    }
    
    next();
  });
};