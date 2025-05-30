import catalogoService from '../services/catalogoService.js';
import { pool } from '../config/db.js';
import { generarError } from '../utils/helpers.js';

// Listar todos los regalos disponibles
const listarRegalos = async (req, res) => {
  try {
    const regalos = await catalogoService.listar('regalo');
    res.json(regalos);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error.message || 'Error al listar regalos' });
  }
};

// Obtener estadísticas de regalos seleccionados (para admin)
const obtenerEstadisticas = async (req, res) => {
  try {
    // Verificar permisos nuevamente por seguridad
    if (!req.usuario?.admin) {
      throw generarError(403, 'AuthError', 'No tienes permisos para acceder a esta información');
    }
    
    try {
      // Consulta SQL para obtener la cuenta de cada regalo
      const [resultados] = await pool.query(`
        SELECT c.id, c.nombre, COUNT(r.regalo_id) as total
        FROM catalogos c
        LEFT JOIN registros r ON c.id = r.regalo_id
        WHERE c.tipo = 'regalo'
        GROUP BY c.id
        ORDER BY total DESC
      `);
      
      // Formatear los resultados
      const estadisticas = resultados.map(row => ({
        id: row.id,
        nombre: row.nombre,
        total: parseInt(row.total || 0)
      }));
      
      res.json(estadisticas);
    } catch (dbError) {
      console.error('Error de base de datos:', dbError);
      throw generarError(500, 'DatabaseError', 'Error al consultar estadísticas de regalos');
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error.message || 'Error al obtener estadísticas de regalos' });
  }
};

export {
  listarRegalos,
  obtenerEstadisticas
};