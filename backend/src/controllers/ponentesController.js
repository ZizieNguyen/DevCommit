/**
 * Controlador para la gestión de ponentes
 */
import { generarError } from '../utils/helpers.js';
import ponenteService from '../services/ponenteService.js';

/**
 * Obtener todos los ponentes
 */
const listarPonentes = async (req, res) => {
  try {
    // Extraer parámetros de consulta
    const { limite } = req.query;
    
    // Crear objeto de filtros
    const filtros = {};
    if (limite) filtros.limite = limite;
    
    // Usar el servicio con los filtros
    const ponentes = await ponenteService.listarPonentes(filtros);
    
    res.json({
      resultado: true,
      ponentes
    });
  } catch (error) {
    console.error('Error al obtener ponentes:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener ponentes'
    });
  }
};

/**
 * Obtener un ponente por su ID
 */
const obtenerPonente = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw generarError(400, 'ValidationError', 'El ID del ponente es requerido');
    }
    
    const ponente = await ponenteService.buscarPorId(id);
    
    res.json({
      resultado: true,
      ponente
    });
  } catch (error) {
    console.error('Error al obtener ponente:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener ponente'
    });
  }
};

/**
 * Crear un nuevo ponente
 */
const crearPonente = async (req, res) => {
  try {
    const { nombre, apellido, imagen, tags } = req.body;
    
    // Validaciones usando generarError
    if (!nombre || !apellido) {
      throw generarError(400, 'ValidationError', 'El nombre y apellido son obligatorios');
    }
    
    const ponente = await ponenteService.crear({ 
      nombre, 
      apellido, 
      imagen, 
      tags 
    });
    
    res.status(201).json({
      resultado: true,
      msg: 'Ponente creado correctamente',
      ponente
    });
  } catch (error) {
    console.error('Error al crear ponente:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al crear ponente'
    });
  }
};

/**
 * Actualizar un ponente
 */
const actualizarPonente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, imagen, tags } = req.body;
    
    // Validaciones usando generarError
    if (!id) {
      throw generarError(400, 'ValidationError', 'El ID del ponente es requerido');
    }
    
    if (!nombre && !apellido && !imagen && !tags) {
      throw generarError(400, 'ValidationError', 'Se requiere al menos un campo para actualizar');
    }
    
    await ponenteService.actualizar(id, { 
      nombre, 
      apellido, 
      imagen, 
      tags 
    });
    
    res.json({
      resultado: true,
      msg: 'Ponente actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar ponente:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al actualizar ponente'
    });
  }
};

/**
 * Eliminar un ponente
 */
const eliminarPonente = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw generarError(400, 'ValidationError', 'El ID del ponente es requerido');
    }
    
    await ponenteService.eliminar(id);
    
    res.json({
      resultado: true,
      msg: 'Ponente eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar ponente:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al eliminar ponente'
    });
  }
};

const listarPonentesAdmin = async (req, res) => {
  try {
    // Valores por defecto para administración
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const busqueda = req.query.busqueda || '';
    
    // Incluir información adicional para admins
    const resultado = await ponenteService.listarPonentesAdmin({ 
      pagina, 
      limite,
      busqueda
    });
    
    res.json({
      resultado: true,
      ponentes: resultado.ponentes,
      paginacion: {
        pagina: resultado.pagina,
        limite: resultado.limite,
        total: resultado.total,
        totalPaginas: resultado.totalPaginas
      }
    });
  } catch (error) {
    console.error('Error al obtener ponentes para administración:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener ponentes para administración'
    });
  }
};

export {
  listarPonentes,
  obtenerPonente,
  crearPonente,
  actualizarPonente,
  eliminarPonente,
  listarPonentesAdmin
};