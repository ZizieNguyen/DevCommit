import eventoService from '../services/eventoService.js';
import registroService from '../services/registroService.js';
import usuarioService from '../services/usuarioService.js';
import ponenteService from '../services/ponenteService.js';
import { generarError } from '../utils/helpers.js';

/**
 * Obtener estadísticas para el dashboard
 */
const obtenerDashboardStats = async (req, res) => {
  try {
    const [
      totalUsuarios, 
      totalEventos, 
      totalPonentes, 
      totalRegistros,
      registrosPagados,
      ingresos
    ] = await Promise.all([
      usuarioService.contarUsuarios(),
      eventoService.contarEventos(),
      ponenteService.contarPonentes(),
      registroService.contarRegistros(),
      registroService.contarRegistrosPorEstado(true),
      registroService.calcularIngresos()
    ]);
    
    res.json({
      resultado: true,
      stats: {
        usuarios: totalUsuarios,
        eventos: totalEventos,
        ponentes: totalPonentes,
        registros: totalRegistros,
        registrosPagados,
        ingresos
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      resultado: false,
      msg: 'Error al obtener estadísticas del dashboard'
    });
  }
};

/**
 * Obtener registros recientes
 */
const obtenerRegistrosRecientes = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 5;
    const registros = await registroService.obtenerRegistrosRecientes(limite);
    
    res.json({
      resultado: true,
      registros
    });
  } catch (error) {
    console.error('Error al obtener registros recientes:', error);
    res.status(500).json({
      resultado: false,
      msg: 'Error al obtener registros recientes'
    });
  }
};

/**
 * Obtener eventos próximos
 */
const obtenerEventosProximos = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 5;
    const eventos = await eventoService.obtenerEventosProximos(limite);
    
    res.json({
      resultado: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    res.status(500).json({
      resultado: false,
      msg: 'Error al obtener eventos próximos'
    });
  }
};

export {
  obtenerDashboardStats,
  obtenerRegistrosRecientes,
  obtenerEventosProximos
};