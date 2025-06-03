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
    const usuario_id = req.usuario.id;
    
    // Validar datos requeridos
    if (!evento_id || !paquete_id) {
      return res.status(400).json({
        resultado: false,
        msg: 'El evento y el paquete son obligatorios'
      });
    }
    
    // Crear registro
    const registro = await registroService.crear({
      usuario_id,
      evento_id,
      paquete_id,
      regalo_id: regalo_id || null,
      pagado: false
    });
    
    res.status(201).json({
      resultado: true,
      msg: 'Registro creado correctamente',
      registro
    });
  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al crear el registro'
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

const obtenerRegistrosAdmin = async (req, res) => {
  try {
    // Obtener parámetros de paginación
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 15;
    
    // Preparar filtros
    const filtros = { 
      pagina, 
      limite,
      pagado: req.query.pagado === 'true' ? true : 
              req.query.pagado === 'false' ? false : undefined
    };
    
    // Obtener registros paginados
    const resultado = await registroService.listarRegistros(filtros);
    
    res.json({
      resultado: true,
      registros: resultado.registros,
      paginacion: {
        pagina: resultado.pagina,
        limite: resultado.limite,
        total: resultado.total,
        totalPaginas: resultado.totalPaginas
      }
    });
  } catch (error) {
    console.error('Error al obtener registros para administración:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener registros'
    });
  }
};


/**
 * Actualizar un registro existente
 */
const actualizarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    
    // Verificar que existe el registro
    const registroExistente = await registroService.buscarPorId(id);
    if (!registroExistente) {
      return res.status(404).json({
        resultado: false,
        msg: 'Registro no encontrado'
      });
    }
    
    // Actualizar registro
    const registroActualizado = await registroService.actualizar(id, datos);
    
    res.json({
      resultado: true,
      msg: 'Registro actualizado correctamente',
      registro: registroActualizado
    });
  } catch (error) {
    console.error('Error al actualizar registro:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al actualizar el registro'
    });
  }
};


/**
 * Obtener los registros del usuario autenticado
 */
const obtenerMisRegistros = async (req, res) => {
  try {
    // El ID del usuario viene del token de autenticación
    const usuarioId = req.usuario.id;
    
    // Obtener los registros del usuario
    const registros = await registroService.obtenerRegistrosPorUsuario(usuarioId);
    
    res.json({
      resultado: true,
      registros
    });
  } catch (error) {
    console.error('Error al obtener mis registros:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener tus registros'
    });
  }
};

/**
 * Obtener un registro específico por su ID
 */
const obtenerRegistroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el registro por su ID
    const registro = await registroService.buscarPorId(id);
    
    if (!registro) {
      return res.status(404).json({
        resultado: false,
        msg: 'Registro no encontrado'
      });
    }
    
    res.json({
      resultado: true,
      registro
    });
  } catch (error) {
    console.error('Error al obtener registro por ID:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener el registro'
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
  obtenerRegistroPorId,
  obtenerMisRegistros,
  actualizarRegistro,
  obtenerRegistrosAdmin
};