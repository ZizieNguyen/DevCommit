// src/services/regaloService.js
import catalogoService from './catalogoService.js';
import { generarError } from '../utils/helpers.js';
import { pool } from '../config/db.js';

const regaloService = {
  async listar() {
    try {
      return await catalogoService.listar('regalo');
    } catch (error) {
      console.error('Error al listar regalos:', error);
      throw error;
    }
  },
  
  async obtenerEstadisticas() {
    try {
      const query = `
        SELECT 
          c.id, 
          c.nombre,
          COUNT(r.regalo_id) as total
        FROM catalogos c
        LEFT JOIN registros r ON c.id = r.regalo_id 
        WHERE c.tipo = 'regalo' 
        GROUP BY c.id
        ORDER BY total DESC
      `;
      
      const [resultados] = await pool.query(query);
      
      return resultados.map(resultado => ({
        id: resultado.id,
        nombre: resultado.nombre,
        total: resultado.total || 0
      }));
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw generarError(500, 'DatabaseError', 'Error al obtener estadísticas de regalos');
    }
  }
};

export default regaloService;
