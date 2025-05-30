/**
 * Middleware para verificar permisos de administrador
 */
import { generarError } from '../utils/helpers.js';

/**
 * Verifica si el usuario tiene permisos de administrador
 */
export const esAdmin = (req, res, next) => {
  try {
    // Verificar que el usuario está autenticado
    if (!req.usuario) {
      throw generarError(401, 'AuthError', 'No autenticado');
    }
    
    // Verificar que el usuario tiene permisos de administrador
    if (!req.usuario.admin) {
      throw generarError(403, 'AuthError', 'Acceso denegado: requiere privilegios de administrador');
    }
    
    // Si tiene permisos, continuar
    next();
  } catch (error) {
    console.error('Error de permisos de administrador:', error);
    res.status(error.status || 403).json({
      resultado: false,
      msg: error.message || 'Acceso denegado'
    });
  }
};