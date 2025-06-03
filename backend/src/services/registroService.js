/**
 * Servicio para la gestión de registros a eventos
 */
import { pool } from '../config/db.js';
import { generarError } from '../utils/helpers.js';

const registroService = {
  /**
   * Listar todos los registros con información de usuario
   */
  async listarRegistros(filtros = {}) {
    try {
      // Parámetros de paginación
      const pagina = parseInt(filtros.pagina) || 1;
      const limite = parseInt(filtros.limite) || 15;
      const offset = (pagina - 1) * limite;
      
      // Consulta base
      let query = `
        SELECT r.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido, u.email,
        e.nombre as evento_nombre, p.nombre as paquete_nombre,
        rg.nombre as regalo_nombre
        FROM registros r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN eventos e ON r.evento_id = e.id
        JOIN paquetes p ON r.paquete_id = p.id
        LEFT JOIN regalos rg ON r.regalo_id = rg.id
      `;
      
      const params = [];
      
      // Aplicar filtros si existen
      if (filtros.pagado !== undefined) {
        query += ' WHERE r.pagado = ?';
        params.push(filtros.pagado ? 1 : 0);
      }
      
      // Consulta para contar total
      let countQuery = `
        SELECT COUNT(*) as total FROM registros r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN eventos e ON r.evento_id = e.id
        JOIN paquetes p ON r.paquete_id = p.id
        LEFT JOIN regalos rg ON r.regalo_id = rg.id
      `;
      
      const countParams = [];
      
      if (filtros.pagado !== undefined) {
        countQuery += ' WHERE r.pagado = ?';
        countParams.push(filtros.pagado ? 1 : 0);
      }
      
      // Ordenar por fecha de creación (lo más reciente primero)
      query += ' ORDER BY r.created_at DESC';
      
      // Aplicar límite y offset para paginación
      query += ' LIMIT ? OFFSET ?';
      params.push(limite, offset);
      
      // Ejecutar ambas consultas
      const [registros] = await pool.query(query, params);
      const [totalResult] = await pool.query(countQuery, countParams);
      
      const total = totalResult[0].total;
      const totalPaginas = Math.ceil(total / limite);
      
      return {
        registros,
        pagina,
        limite,
        total,
        totalPaginas
      };
    } catch (error) {
      console.error('Error al obtener registros:', error);
      throw generarError(500, 'DatabaseError', 'Error al obtener registros');
    }
  },

  /**
   * Buscar un registro por su ID
   */
  async buscarPorId(id) {
  try {
    const query = `
      SELECT r.*, 
        u.nombre as usuario_nombre, 
        u.apellido as usuario_apellido,
        u.email as usuario_email,
        e.nombre as evento_nombre, 
        p.nombre as paquete_nombre,
        p.precio as paquete_precio,
        rg.nombre as regalo_nombre
      FROM registros r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN eventos e ON r.evento_id = e.id
      JOIN paquetes p ON r.paquete_id = p.id
      LEFT JOIN regalos rg ON r.regalo_id = rg.id
      WHERE r.id = ?
    `;
    
    const [registros] = await pool.query(query, [id]);
    
    if (registros.length === 0) {
      return null;
    }
    
    return registros[0];
  } catch (error) {
    console.error('Error al buscar registro por ID:', error);
    throw generarError('Error al buscar el registro', 500, 'DatabaseError');
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
 * Actualizar un registro por ID
 */
async actualizar(id, datos) {
  try {
    // Validar que solo se actualicen campos permitidos
    const camposPermitidos = ['pagado', 'paquete_id', 'regalo_id'];
    const datosActualizacion = {};
    
    Object.keys(datos).forEach(campo => {
      if (camposPermitidos.includes(campo)) {
        datosActualizacion[campo] = datos[campo];
      }
    });
    
    if (Object.keys(datosActualizacion).length === 0) {
      throw generarError('No hay campos válidos para actualizar', 400);
    }
    
    const [resultado] = await pool.query(
      'UPDATE registros SET ? WHERE id = ?',
      [datosActualizacion, id]
    );
    
    if (resultado.affectedRows === 0) {
      throw generarError('No se encontró el registro', 404);
    }
    
    // Obtener el registro actualizado
    return await this.buscarPorId(id);
  } catch (error) {
    console.error('Error al actualizar registro:', error);
    throw error;
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
  },

  async contarRegistros() {
    try {
        const [result] = await pool.query('SELECT COUNT(*) as total FROM registros');
        return result[0].total;
    } catch (error) {
        console.error('Error al contar registros:', error);
        throw generarError(500, 'DatabaseError', 'Error al contar registros');
    }
},

  async contarRegistrosPorEstado(pagado) {
    try {
        const [result] = await pool.query(
            'SELECT COUNT(*) as total FROM registros WHERE pagado = ?', 
            [pagado ? 1 : 0]
        );
        return result[0].total;
    } catch (error) {
        console.error('Error al contar registros por estado:', error);
        throw generarError(500, 'DatabaseError', 'Error al contar registros por estado');
    }
  },

  async calcularIngresos() {
    try {
        const [result] = await pool.query(`
            SELECT SUM(p.precio) as total 
            FROM registros r 
            JOIN paquetes p ON r.paquete_id = p.id 
            WHERE r.pagado = 1
        `);
        return result[0].total || 0;
    } catch (error) {
        console.error('Error al calcular ingresos:', error);
        throw generarError(500, 'DatabaseError', 'Error al calcular ingresos');
    }
  },

  async obtenerRegistrosRecientes(limite = 5) {
    try {
        const query = `
            SELECT r.id, r.created_at, r.pagado,
                u.nombre as usuario_nombre, u.apellido as usuario_apellido, 
                e.nombre as evento_nombre,
                p.nombre as paquete_nombre, p.precio as paquete_precio
            FROM registros r
            JOIN usuarios u ON r.usuario_id = u.id
            JOIN eventos e ON r.evento_id = e.id
            JOIN paquetes p ON r.paquete_id = p.id
            ORDER BY r.created_at DESC
            LIMIT ?
        `;
        
        const [registros] = await pool.query(query, [limite]);
        return registros;
    } catch (error) {
        console.error('Error al obtener registros recientes:', error);
        throw generarError(500, 'DatabaseError', 'Error al obtener registros recientes');
    }
  }


};



export default registroService;