// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants.js';
import usuarioService from '../services/usuarioService.js';
import { generarError } from '../utils/helpers.js';

export const protegerRuta = async (req, res, next) => {
  try {
    // Verificar que hay token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      throw generarError(401, 'AuthError', 'No hay token en la petición');
    }
    
    try {
      // Verificar el token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Buscar el usuario
      const [usuarios] = await pool.query(
        'SELECT id, nombre, apellido, email, admin FROM usuarios WHERE id = ?',
        [decoded.id]
      );
      
      if (!usuarios.length) {
        throw generarError(401, 'AuthError', 'Token no válido - usuario no existe');
      }
      
      // Añadir el usuario a la request
      req.usuario = {
        ...usuarios[0],
        admin: Boolean(usuarios[0].admin) // Asegurar que sea booleano
      };
      
      next();
    } catch (error) {
      throw generarError(401, 'AuthError', 'Token no válido');
    }
  } catch (error) {
    res.status(error.status || 401).json({
      resultado: false,
      msg: error.message || 'No autorizado'
    });
  }
};

export const esAdmin = (req, res, next) => {
  try {
    if (!req.usuario) {
      throw generarError(500, 'AuthError', 'Se quiere verificar el rol sin validar el token primero');
    }
    
    if (!req.usuario.admin) {
      throw generarError(403, 'ForbiddenError', 'No tienes permisos de administrador');
    }
    
    next();
  } catch (error) {
    console.error('Error en middleware de admin:', error);
    res.status(error.status || 500).json({ msg: error.message || 'Error de servidor' });
  }
};