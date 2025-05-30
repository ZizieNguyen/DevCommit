// src/utils/helpers.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants.js';

// Generar un ID aleatorio para tokens de confirmación o recuperación
const generarId = () => {
  return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

// Generar JWT para autenticación
const generarJWT = (id, admin = false) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }
  
  return jwt.sign({ id, admin }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Generar un token alfanumérico para registros
const generarToken = (longitud = 8) => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  
  for (let i = 0; i < longitud; i++) {
    const indiceRandom = Math.floor(Math.random() * caracteres.length);
    token += caracteres.charAt(indiceRandom);
  }
  
  return token;
};

// Generar error estandarizado
const generarError = (status, code, message) => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};

export {
  generarId,
  generarJWT,
  generarToken,
  generarError
};