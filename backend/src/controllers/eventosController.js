/**
 * Controlador de eventos 
 */
import { generarError } from '../utils/helpers.js';
import eventoService from '../services/eventoService.js';

/**
 * Listar todos los eventos
 */
const listarEventos = async (req, res) => {
  try {
    const eventos = await eventoService.listarEventos();
    
    res.json({
      resultado: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener eventos'
    });
  }
};

/**
 * Obtener un evento por su ID
 */
const obtenerEvento = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw generarError(400, 'ValidationError', 'El ID del evento es requerido');
    }
    
    const evento = await eventoService.buscarPorId(id);
    
    res.json({
      resultado: true,
      evento
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener evento'
    });
  }
};

/**
 * Filtrar eventos por categoría, día o búsqueda
 */
const filtrarEventos = async (req, res) => {
  try {
    const { categoria_id, dia, busqueda } = req.query;
    
    // Si no hay filtros, devolver todos los eventos
    if (!categoria_id && !dia && !busqueda) {
      return listarEventos(req, res);
    }
    
    // Preparar filtros para el servicio
    const filtros = {};
    if (categoria_id) filtros.categoria_id = categoria_id;
    if (dia) filtros.dia = dia;
    if (busqueda) filtros.busqueda = busqueda;
    
    // Obtener eventos filtrados
    const eventos = await eventoService.filtrar(filtros);
    
    res.json({
      resultado: true,
      eventos
    });
  } catch (error) {
    console.error('Error al filtrar eventos:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al filtrar eventos'
    });
  }
};

/**
 * Crear un nuevo evento
 */
const crearEvento = async (req, res) => {
  try {
    const { nombre, descripcion, fecha, hora, categoria_id, ponente_id, disponibilidad } = req.body;
    
    // Validaciones
    if (!nombre || !descripcion || !fecha || !hora) {
      throw generarError(400, 'ValidationError', 'Los campos nombre, descripción, fecha y hora son obligatorios');
    }
    
    const evento = await eventoService.crear({
      nombre, 
      descripcion, 
      fecha, 
      hora, 
      categoria_id, 
      ponente_id, 
      disponibilidad: disponibilidad || 0
    });
    
    res.status(201).json({
      resultado: true,
      msg: 'Evento creado correctamente',
      evento
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al crear evento'
    });
  }
};

/**
 * Actualizar un evento
 */
const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, fecha, hora, categoria_id, ponente_id, disponibilidad } = req.body;
    
    if (!id) {
      throw generarError(400, 'ValidationError', 'El ID del evento es obligatorio');
    }
    
    // Verificar que haya al menos un campo para actualizar
    if (!nombre && !descripcion && !fecha && !hora && 
        categoria_id === undefined && ponente_id === undefined && 
        disponibilidad === undefined) {
      throw generarError(400, 'ValidationError', 'Debes proporcionar al menos un campo para actualizar');
    }
    
    await eventoService.actualizar(id, {
      nombre, 
      descripcion, 
      fecha, 
      hora, 
      categoria_id, 
      ponente_id, 
      disponibilidad
    });
    
    res.json({
      resultado: true,
      msg: 'Evento actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al actualizar evento'
    });
  }
};

/**
 * Eliminar un evento
 */
const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw generarError(400, 'ValidationError', 'El ID del evento es obligatorio');
    }
    
    await eventoService.eliminar(id);
    
    res.json({
      resultado: true,
      msg: 'Evento eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al eliminar evento'
    });
  }
};

export {
  listarEventos,
  obtenerEvento,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  filtrarEventos
};