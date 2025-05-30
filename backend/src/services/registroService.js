/**
 * Servicio para la gestión de registros a eventos
 */
import { pool } from '../config/db.js';
import { generarError } from '../utils/helpers.js';

const registroService = {
  /**
   * Listar todos los registros con información de usuario
   */
  async listarRegistros() {
    try {
      const [registros] = await pool.query(`
        SELECT r.*, u.nombre, u.apellido, u.email,
        e.nombre as evento_nombre, p.nombre as paquete_nombre,
        rg.nombre as regalo_nombre
        FROM registros r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN eventos e ON r.evento_id = e.id
        JOIN paquetes p ON r.paquete_id = p.id
        LEFT JOIN regalos rg ON r.regalo_id = rg.id
        ORDER BY r.createdAt DESC
      `);
      
      return registros;
    } catch (error) {
      throw generarError(500, 'DatabaseError', 'Error al obtener registros');
    }
  },
  
  /**
   * Listar registros de un usuario específico
   */
  async listarPorUsuario(usuario_id) {
    try {
      const [registros] = await pool.query(`
        SELECT r.*, e.nombre as evento_nombre, e.fecha as evento_fecha,
        p.nombre as paquete_nombre, p.precio as paquete_precio,
        rg.nombre as regalo_nombre
        FROM registros r
        JOIN eventos e ON r.evento_id = e.id
        JOIN paquetes p ON r.paquete_id = p.id
        LEFT JOIN regalos rg ON r.regalo_id = rg.id
        WHERE r.usuario_id = ?
        ORDER BY r.createdAt DESC
      `, [usuario_id]);
      
      return registros;
    } catch (error) {
      throw generarError(500, 'DatabaseError', 'Error al obtener registros del usuario');
    }
  },
  
  /**
   * Buscar un registro por su ID
   */
  async buscarPorId(id) {
    try {
      const [registros] = await pool.query('SELECT * FROM registros WHERE id = ?', [id]);
      
      if (!registros.length) {
        throw generarError(404, 'NotFoundError', 'Registro no encontrado');
      }
      
      return registros[0];
    } catch (error) {
      if (error.type) throw error;
      throw generarError(500, 'DatabaseError', 'Error al buscar el registro');
    }
  },

  /**
 * Buscar un registro por su token
 */
async buscarPorToken(token) {
  try {
    const [registros] = await pool.query(`
      SELECT r.*, e.nombre as evento_nombre, e.fecha as evento_fecha,
      p.nombre as paquete_nombre, p.precio as paquete_precio,
      rg.nombre as regalo_nombre, u.nombre as usuario_nombre, u.apellido as usuario_apellido
      FROM registros r
      JOIN eventos e ON r.evento_id = e.id
      JOIN paquetes p ON r.paquete_id = p.id
      LEFT JOIN regalos rg ON r.regalo_id = rg.id
      JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.token = ?
    `, [token]);
    
    if (!registros.length) {
      throw generarError(404, 'NotFoundError', 'Registro no encontrado');
    }
    
    return registros[0];
  } catch (error) {
    if (error.type) throw error;
    throw generarError(500, 'DatabaseError', 'Error al buscar el registro por token');
  }
},

/**
 * Obtener detalles completos de un registro
 */
async obtenerDetalles(id) {
  try {
    const [registros] = await pool.query(`
      SELECT r.*, e.nombre as evento_nombre, e.descripcion as evento_descripcion, 
      e.fecha as evento_fecha, e.hora as evento_hora,
      p.nombre as paquete_nombre, p.precio as paquete_precio,
      rg.nombre as regalo_nombre, rg.imagen as regalo_imagen,
      u.nombre as usuario_nombre, u.apellido as usuario_apellido, u.email as usuario_email
      FROM registros r
      JOIN eventos e ON r.evento_id = e.id
      JOIN paquetes p ON r.paquete_id = p.id
      LEFT JOIN regalos rg ON r.regalo_id = rg.id
      JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.id = ?
    `, [id]);
    
    if (!registros.length) {
      throw generarError(404, 'NotFoundError', 'Registro no encontrado');
    }
    
    return registros[0];
  } catch (error) {
    if (error.type) throw error;
    throw generarError(500, 'DatabaseError', 'Error al obtener detalles del registro');
  }
},
  
  /**
   * Crear un nuevo registro
   */
  async crear({ usuario_id, evento_id, paquete_id, regalo_id, pagado }) {
    try {
      // Verificar disponibilidad del evento
      const [eventos] = await pool.query('SELECT disponibilidad FROM eventos WHERE id = ?', [evento_id]);
      
      if (!eventos.length) {
        throw generarError(404, 'NotFoundError', 'Evento no encontrado');
      }
      
      if (eventos[0].disponibilidad <= 0) {
        throw generarError(400, 'ValidationError', 'El evento ya no tiene cupos disponibles');
      }
      
      // Verificar que el usuario no esté ya registrado en el evento
      const [registrosExistentes] = await pool.query(
        'SELECT id FROM registros WHERE usuario_id = ? AND evento_id = ?',
        [usuario_id, evento_id]
      );
      
      if (registrosExistentes.length) {
        throw generarError(400, 'ValidationError', 'Ya estás registrado en este evento');
      }
      
      // Crear el registro
      const [result] = await pool.query(
        `INSERT INTO registros (usuario_id, evento_id, paquete_id, regalo_id, pagado) 
         VALUES (?, ?, ?, ?, ?)`,
        [usuario_id, evento_id, paquete_id, regalo_id || null, pagado ? 1 : 0]
      );
      
      // Reducir disponibilidad del evento
      await pool.query(
        'UPDATE eventos SET disponibilidad = disponibilidad - 1 WHERE id = ?',
        [evento_id]
      );
      
      return await this.buscarPorId(result.insertId);
    } catch (error) {
      if (error.type) throw error;
      throw generarError(500, 'DatabaseError', 'Error al crear el registro');
    }
  },
  
  /**
   * Actualizar estado de pago
   */
  async actualizarPago(id, pagado) {
    try {
      // Verificar que el registro existe
      await this.buscarPorId(id);
      
      // Actualizar estado de pago
      await pool.query(
        'UPDATE registros SET pagado = ? WHERE id = ?',
        [pagado ? 1 : 0, id]
      );
      
      return await this.buscarPorId(id);
    } catch (error) {
      if (error.type) throw error;
      throw generarError(500, 'DatabaseError', 'Error al actualizar el pago');
    }
  },
  
  /**
   * Obtener estadísticas de registros
   */
  /**
 * Obtener estadísticas de registros
 */
async obtenerEstadisticas() {
  try {
    // Total de registros
    const [totalRegistros] = await pool.query('SELECT COUNT(*) as total FROM registros');
    
    // Registros pagados
    const [registrosPagados] = await pool.query('SELECT COUNT(*) as pagados FROM registros WHERE pagado = true');
    
    // Ingresos totales
    const [ingresos] = await pool.query(`
      SELECT SUM(p.precio) as total 
      FROM registros r 
      JOIN paquetes p ON r.paquete_id = p.id 
      WHERE r.pagado = true
    `);
    
    // Eventos más populares
    const [eventosMasPopulares] = await pool.query(`
      SELECT e.nombre, COUNT(*) as total 
      FROM registros r 
      JOIN eventos e ON r.evento_id = e.id 
      GROUP BY r.evento_id 
      ORDER BY total DESC 
      LIMIT 5
    `);
    
    return {
      total: totalRegistros[0].total,
      pagados: registrosPagados[0].pagados,
      ingresos: ingresos[0].total || 0,
      eventosMasPopulares
    };
  } catch (error) {
    throw generarError(500, 'DatabaseError', 'Error al obtener estadísticas');
  }
},


  async eliminar(id) {
  try {
    // Obtener el registro para obtener el evento_id
    const registro = await this.buscarPorId(id);
    
    // Eliminar el registro
    const [result] = await pool.query('DELETE FROM registros WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      throw generarError(404, 'NotFoundError', 'Registro no encontrado');
    }
    
    // Aumentar disponibilidad del evento
    await pool.query(
      'UPDATE eventos SET disponibilidad = disponibilidad + 1 WHERE id = ?',
      [registro.evento_id]
    );
    
    return true;
  } catch (error) {
    if (error.type) throw error;
    throw generarError(500, 'DatabaseError', 'Error al eliminar el registro');
  }
}
};

export default registroService;