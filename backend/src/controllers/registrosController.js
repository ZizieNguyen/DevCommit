/**
 * Controlador para la gestión de registros de usuarios a eventos
 */
import { pool } from '../config/db.js';
import { generarError } from '../utils/helpers.js';
import registroService from '../services/registroService.js';

/**
 * Listar todos los registros (para administradores)
 */
const listarRegistros = async (req, res) => {
  try {
    const registros = await registroService.listarRegistros();
    
    res.json({
      resultado: true,
      registros
    });
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener registros'
    });
  }
};

/**
 * Obtener un registro específico por ID (para administradores)
 */
const obtenerRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw generarError(400, 'ValidationError', 'El ID del registro es requerido');
    }
    
    const registro = await registroService.buscarPorId(id);
    
    // Obtener información adicional si es necesario
    const registroDetallado = await registroService.obtenerDetalles(registro.id);
    
    res.json({
      resultado: true,
      registro: registroDetallado
    });
  } catch (error) {
    console.error('Error al obtener registro:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener registro'
    });
  }
};

/**
 * Obtener un registro por su token (validación de compra)
 */
const obtenerRegistroPorToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      throw generarError(400, 'ValidationError', 'El token es requerido');
    }
    
    const registro = await registroService.buscarPorToken(token);
    
    res.json({
      resultado: true,
      registro
    });
  } catch (error) {
    console.error('Error al obtener registro por token:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener registro'
    });
  }
};

/**
 * Obtener registros del usuario autenticado
 */
const misRegistros = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    
    const registros = await registroService.listarPorUsuario(usuario_id);
    
    res.json({
      resultado: true,
      registros
    });
  } catch (error) {
    console.error('Error al obtener registros del usuario:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener registros'
    });
  }
};

/**
 * Crear un nuevo registro a un evento
 */
const crearRegistro = async (req, res) => {
  try {
    const { evento_id, paquete_id, regalo_id } = req.body;
    const usuario_id = req.usuario.id; // Obtenido del middleware de autenticación
    
    // Validaciones
    if (!evento_id) {
      throw generarError(400, 'ValidationError', 'El ID del evento es obligatorio');
    }
    
    if (!paquete_id) {
      throw generarError(400, 'ValidationError', 'El ID del paquete es obligatorio');
    }
    
    // Crear registro
    const registro = await registroService.crear({
      usuario_id,
      evento_id,
      paquete_id,
      regalo_id,
      pagado: false // Por defecto, no está pagado
    });
    
    res.status(201).json({
      resultado: true,
      msg: 'Registro creado correctamente, pendiente de pago',
      registro
    });
  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al crear registro'
    });
  }
};

/**
 * Actualizar estado de pago de un registro (solo admin)
 */
const actualizarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { pagado } = req.body;
    
    if (typeof pagado !== 'boolean') {
      throw generarError(400, 'ValidationError', 'El valor de pagado debe ser true o false');
    }
    
    await registroService.actualizarPago(id, pagado);
    
    res.json({
      resultado: true,
      msg: `Registro marcado como ${pagado ? 'pagado' : 'pendiente'} correctamente`
    });
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al actualizar pago'
    });
  }
};

/**
 * Eliminar un registro existente
 */
const eliminarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario;
    
    if (!id) {
      throw generarError(400, 'ValidationError', 'El ID del registro es obligatorio');
    }
    
    // Obtener el registro para verificar propiedad
    const registro = await registroService.buscarPorId(id);
    
    // Solo el propietario o un administrador puede eliminar el registro
    if (registro.usuario_id !== usuario.id && !usuario.admin) {
      throw generarError(403, 'AuthError', 'No tienes permiso para eliminar este registro');
    }
    
    // Eliminar el registro
    await registroService.eliminar(id);
    
    res.json({
      resultado: true,
      msg: 'Registro eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al eliminar registro'
    });
  }
};

/**
 * Obtener estadísticas de registros (solo admin)
 */
const obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await registroService.obtenerEstadisticas();
    
    res.json({
      resultado: true,
      estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener estadísticas'
    });
  }
};

// Exportar todas las funciones que se usan en las rutas
export {
  listarRegistros,
  obtenerRegistro,
  obtenerRegistroPorToken,
  misRegistros,
  crearRegistro,
  actualizarPago,
  eliminarRegistro,
  obtenerEstadisticas
};