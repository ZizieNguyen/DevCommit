import jwt from 'jsonwebtoken';
import { generarError } from '../utils/helpers.js';
import usuarioService from '../services/usuarioService.js';

// Middleware para proteger rutas que requieren autenticación
export const protegerRuta = async (req, res, next) => {
  try {
    // Verificar que exista el token en los headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No se encontró token o formato incorrecto:', authHeader);
      return res.status(401).json({
        resultado: false,
        msg: 'No autorizado - Token no proporcionado o formato incorrecto'
      });
    }
    
    // Extraer el token y eliminamos espacios adicionales
    const token = authHeader.split(' ')[1].trim();
    
    if (!token) {
      console.log('Token vacío después de procesar');
      return res.status(401).json({
        resultado: false,
        msg: 'No autorizado - Token vacío'
      });
    }
    
    // Verificar el token con la clave secreta correcta
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario
    const usuario = await usuarioService.buscarPorId(decodificado.id);
    
    // Verificar que el usuario existe y está confirmado
    if (!usuario) {
      console.log('Usuario no encontrado:', decodificado.id);
      return res.status(401).json({
        resultado: false,
        msg: 'No autorizado - Usuario no encontrado'
      });
    }
    
    if (!usuario.confirmado) {
      console.log('Usuario no confirmado:', decodificado.id);
      return res.status(401).json({
        resultado: false,
        msg: 'No autorizado - Cuenta no confirmada'
      });
    }
    
    // Agregar el usuario al request para uso posterior
    req.usuario = usuario;
    
    // Continuar con la siguiente función
    next();
  } catch (error) {
    console.error('Error detallado en autenticación:', error);
    
    // Diferentes mensajes según el tipo de error
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        resultado: false,
        msg: 'Token inválido'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        resultado: false,
        msg: 'Sesión expirada'
      });
    }
    
    return res.status(401).json({
      resultado: false,
      msg: 'No autorizado'
    });
  }
};