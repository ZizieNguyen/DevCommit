/**
 * Servicio para la gestión de eventos
 * Encapsula la lógica de negocio y acceso a datos
 */
import { pool } from '../config/db.js';
import { generarError } from '../utils/helpers.js';

const eventoService = {
  /**
   * Obtener todos los eventos ordenados por fecha
   */
  async listarEventos() {
    try {
      const [eventos] = await pool.query('SELECT * FROM eventos ORDER BY fecha ASC');
      return eventos;
    } catch (error) {
      throw generarError(500, 'DatabaseError', 'Error al obtener los eventos');
    }
  },
  
  /**
   * Buscar un evento por su ID
   */
  async buscarPorId(id) {
    try {
      const [eventos] = await pool.query('SELECT * FROM eventos WHERE id = ?', [id]);
      
      if (!eventos.length) {
        throw generarError(404, 'NotFoundError', 'Evento no encontrado');
      }
      
      return eventos[0];
    } catch (error) {
      if (error.type) throw error; // Si es un error personalizado, lo lanzamos directamente
      throw generarError(500, 'DatabaseError', 'Error al buscar el evento');
    }
  },
  
  /**
   * Crear un nuevo evento
   */
  async crear({ nombre, descripcion, fecha, hora, categoria_id, ponente_id, disponibilidad }) {
    try {
      const [result] = await pool.query(
        `INSERT INTO eventos (nombre, descripcion, fecha, hora, categoria_id, ponente_id, disponibilidad)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nombre, descripcion, fecha, hora, categoria_id, ponente_id, disponibilidad]
      );
      
      const evento = await this.buscarPorId(result.insertId);
      return evento;
    } catch (error) {
      if (error.type) throw error; // Si es un error personalizado, lo lanzamos directamente
      throw generarError(500, 'DatabaseError', 'Error al crear el evento');
    }
  },
  
  /**
   * Actualizar un evento existente
   */
  async actualizar(id, datos) {
    try {
      // Verificar que el evento existe
      await this.buscarPorId(id);
      
      // Construir la consulta dinámicamente
      const campos = [];
      const valores = [];
      
      for (const [campo, valor] of Object.entries(datos)) {
        if (valor !== undefined) {
          campos.push(`${campo} = ?`);
          valores.push(valor);
        }
      }
      
      if (!campos.length) {
        throw generarError(400, 'ValidationError', 'No hay campos para actualizar');
      }
      
      valores.push(id); // Agregar el ID al final para la condición WHERE
      
      const query = `
        UPDATE eventos 
        SET ${campos.join(', ')}
        WHERE id = ?
      `;
      
      await pool.query(query, valores);
      
      // Retornar el evento actualizado
      return await this.buscarPorId(id);
    } catch (error) {
      if (error.type) throw error; // Si es un error personalizado, lo lanzamos directamente
      throw generarError(500, 'DatabaseError', 'Error al actualizar el evento');
    }
  },
  
  /**
   * Eliminar un evento
   */
  async eliminar(id) {
    try {
      // Verificar que el evento existe
      await this.buscarPorId(id);
      
      // Eliminar el evento
      const [result] = await pool.query('DELETE FROM eventos WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw generarError(404, 'NotFoundError', 'Evento no encontrado');
      }
      
      return true;
    } catch (error) {
      if (error.type) throw error; // Si es un error personalizado, lo lanzamos directamente
      throw generarError(500, 'DatabaseError', 'Error al eliminar el evento');
    }
  },


  async filtrar(filtros) {
  try {
    let query = 'SELECT * FROM eventos WHERE 1=1';
    const valores = [];
    
    // Filtrar por categoría
    if (filtros.categoria_id) {
      query += ' AND categoria_id = ?';
      valores.push(filtros.categoria_id);
    }
    
    // Filtrar por día (fecha)
    if (filtros.dia) {
      query += ' AND DATE(fecha) = ?';
      valores.push(filtros.dia);
    }
    
    // Filtrar por búsqueda
    if (filtros.busqueda) {
      query += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
      const termino = `%${filtros.busqueda}%`;
      valores.push(termino, termino);
    }
    
    // Ordenar por fecha y hora
    query += ' ORDER BY fecha ASC, hora ASC';
    
    const [eventos] = await pool.query(query, valores);
    return eventos;
  } catch (error) {
    throw generarError(500, 'DatabaseError', 'Error al filtrar eventos');
  }
}
  
};



export default eventoService;