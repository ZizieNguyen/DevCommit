/**
 * Controlador de eventos 
 */
import eventoService from '../services/eventoService.js';

/**
 * Listar todos los eventos con paginación
 */
const listarEventos = async (req, res) => {
  try {
    // Obtener parámetros de paginación
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 9;
    
    // Obtener eventos paginados
    const resultado = await eventoService.listarEventos({ pagina, limite });
    
    res.json({
      resultado: true,
      eventos: resultado.eventos,
      paginacion: {
        pagina: resultado.pagina,
        limite: resultado.limite,
        total: resultado.total,
        totalPaginas: resultado.totalPaginas
      }
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
 * Obtener un evento específico por su ID
 */
const obtenerEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await eventoService.buscarPorId(id);
    
    if (!evento) {
      return res.status(404).json({
        resultado: false,
        msg: 'Evento no encontrado'
      });
    }
    
    res.json({
      resultado: true,
      evento
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener el evento'
    });
  }
};

/**
 * Crear un nuevo evento
 */
const crearEvento = async (req, res) => {
  try {
    const { nombre, descripcion, disponibles, categoria_id, horario_id, ponente_id } = req.body;
    
    // Validar datos
    if (!nombre || !descripcion || !categoria_id || !horario_id || !ponente_id) {
      return res.status(400).json({
        resultado: false,
        msg: 'Todos los campos son obligatorios'
      });
    }
    
    const nuevoEvento = await eventoService.crear({
      nombre,
      descripcion,
      disponibles: disponibles || 0,
      categoria_id,
      horario_id,
      ponente_id
    });
    
    res.status(201).json({
      resultado: true,
      msg: 'Evento creado correctamente',
      evento: nuevoEvento
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al crear el evento'
    });
  }
};

/**
 * Actualizar un evento existente
 */
const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    
    // Verificar que existe el evento
    const eventoExistente = await eventoService.buscarPorId(id);
    if (!eventoExistente) {
      return res.status(404).json({
        resultado: false,
        msg: 'Evento no encontrado'
      });
    }
    
    // Actualizar evento
    const eventoActualizado = await eventoService.actualizar(id, datos);
    
    res.json({
      resultado: true,
      msg: 'Evento actualizado correctamente',
      evento: eventoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al actualizar el evento'
    });
  }
};

/**
 * Eliminar un evento
 */
const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que existe el evento
    const eventoExistente = await eventoService.buscarPorId(id);
    if (!eventoExistente) {
      return res.status(404).json({
        resultado: false,
        msg: 'Evento no encontrado'
      });
    }
    
    // Eliminar evento
    await eventoService.eliminar(id);
    
    res.json({
      resultado: true,
      msg: 'Evento eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al eliminar el evento'
    });
  }
};

/**
 * Filtrar eventos por categoría, día o búsqueda con paginación
 */
const filtrarEventos = async (req, res) => {
  try {
    const { categoria_id, dia, busqueda } = req.query;
    
    // Parámetros de paginación
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 9;
    
    // Si no hay filtros, devolver todos los eventos paginados
    if (!categoria_id && !dia && !busqueda) {
      return listarEventos(req, res);
    }
    
    // Preparar filtros para el servicio
    const filtros = { pagina, limite };
    if (categoria_id) filtros.categoria_id = categoria_id;
    if (dia) filtros.dia = dia;
    if (busqueda) filtros.busqueda = busqueda;
    
    // Obtener eventos filtrados y paginados
    const resultado = await eventoService.filtrar(filtros);
    
    res.json({
      resultado: true,
      eventos: resultado.eventos,
      paginacion: {
        pagina: resultado.pagina,
        limite: resultado.limite,
        total: resultado.total,
        totalPaginas: resultado.totalPaginas
      }
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
 * Listar eventos para el panel de administración con paginación
 */
const listarEventosAdmin = async (req, res) => {
  try {
    // Obtener parámetros de paginación (valores diferentes para admin)
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10; // Más eventos por página en admin
    
    // Obtener eventos con información adicional para administradores
    const resultado = await eventoService.listarEventosAdmin({ pagina, limite });
    
    res.json({
      resultado: true,
      eventos: resultado.eventos,
      paginacion: {
        pagina: resultado.pagina,
        limite: resultado.limite,
        total: resultado.total,
        totalPaginas: resultado.totalPaginas
      }
    });
  } catch (error) {
    console.error('Error al obtener eventos para administración:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener eventos para administración'
    });
  }
};

export {
  listarEventos,
  obtenerEvento,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  filtrarEventos,
  listarEventosAdmin
};