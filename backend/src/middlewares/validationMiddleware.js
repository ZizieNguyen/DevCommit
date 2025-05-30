// src/middlewares/validationMiddleware.js
import { generarError } from '../utils/helpers.js';

// Middleware genérico de validación
export const validar = (schema) => async (req, res, next) => {
  try {
    // Validar el request body contra el esquema
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    // Formatear errores de validación
    const errores = error.inner.map(err => ({
      campo: err.path,
      mensaje: err.message
    }));
    
    // Si se subió un archivo, eliminarlo en caso de error de validación
    if (req.file) {
      const fs = require('fs');
      const path = require('path');
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Usar generateError para mantener la consistencia
    const validationError = generarError(400, 'ValidationError', 'Error de validación en los datos');
    validationError.errores = errores;
    
    res.status(validationError.status).json({ 
      msg: validationError.message, 
      errores: validationError.errores 
    });
  }
};