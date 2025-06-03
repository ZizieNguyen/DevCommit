/**
 * Servicio para gestión de ponentes
 */
import { pool } from '../config/db.js';
import { generarError } from '../utils/helpers.js';

const ponenteService = {
  /**
   * Listar todos los ponentes con opciones de filtrado
   */
  async listarPonentes(filtros = {}) {
    try {
      console.log('Consultando ponentes con filtros:', filtros);
      
      // Parámetros de paginación
      const pagina = parseInt(filtros.pagina) || 1;
      const limite = parseInt(filtros.limite) || 6;
      const offset = (pagina - 1) * limite;
      
      // Consulta base
      let query = 'SELECT * FROM ponentes';
      const params = [];
      
      // Aplicar filtros si existen
      if (filtros.busqueda) {
        query += ' WHERE (nombre LIKE ? OR apellido LIKE ? OR tags LIKE ?)';
        const terminoBusqueda = `%${filtros.busqueda}%`;
        params.push(terminoBusqueda, terminoBusqueda, terminoBusqueda);
      }
      
      // Consulta para contar el total
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
      
      // Aplicar ordenamiento por nombre
      query += ' ORDER BY nombre ASC';
      
      // Aplicar límite y offset para paginación
      query += ' LIMIT ? OFFSET ?';
      params.push(limite, offset);
      
      // Ejecutar ambas consultas
      const [ponentes] = await pool.query(query, params);
      const [totalResult] = await pool.query(countQuery, 
        filtros.busqueda ? [params[0], params[1], params[2]] : []);
      
      const total = totalResult[0].total;
      const totalPaginas = Math.ceil(total / limite);
      
      console.log(`Ponentes encontrados: ${ponentes.length} de un total de ${total}`);
      
      return {
        ponentes,
        pagina,
        limite,
        total,
        totalPaginas
      };
    } catch (error) {
      console.error('Error al obtener ponentes:', error);
      throw generarError(500, 'DatabaseError', 'Error al obtener ponentes');
    }
  },
  
  /**
   * Buscar un ponente por su ID
   */
  async buscarPorId(id) {
    try {
      const [ponentes] = await pool.query('SELECT * FROM ponentes WHERE id = ?', [id]);
      
      if (ponentes.length === 0) {
        throw generarError('Ponente no encontrado', 404, 'NotFoundError');
      }
      
      return ponentes[0];
    } catch (error) {
      console.error('Error al buscar ponente por ID:', error);
      if (error.code) throw error;
      throw generarError('Error al buscar el ponente', 500, 'DatabaseError');
    }
  },
  
  /**
   * Crear un nuevo ponente
   */
  async crear({ nombre, apellido, email = null, imagen = null, tags = null }) {
    try {
      const [result] = await pool.query(
        `INSERT INTO ponentes (nombre, apellido, email, imagen, tags) 
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, apellido, email, imagen, tags]
      );
      
      return await this.buscarPorId(result.insertId);
    } catch (error) {
      console.error('Error al crear ponente:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw generarError('Ya existe un ponente con ese email', 409, 'DuplicateError');
      }
      throw generarError('Error al crear el ponente', 500, 'DatabaseError');
    }
  },
  
  /**
   * Actualizar un ponente existente
   */
  async actualizar(id, datos) {
    try {
      // Verificar que el ponente existe
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
      
      if (campos.length === 0) {
        throw generarError('No hay campos para actualizar', 400, 'ValidationError');
      }
      
      valores.push(id); // Agregar el ID para la condición WHERE
      
      const query = `UPDATE ponentes SET ${campos.join(', ')} WHERE id = ?`;
      await pool.query(query, valores);
      
      return await this.buscarPorId(id);
    } catch (error) {
      console.error('Error al actualizar ponente:', error);
      if (error.code) throw error;
      throw generarError('Error al actualizar el ponente', 500, 'DatabaseError');
    }
  },
  
  /**
   * Eliminar un ponente
   */
  async eliminar(id) {
    try {
      // Verificar que el ponente existe
      await this.buscarPorId(id);
      
      // Verificar si el ponente está asignado a eventos
      const [eventos] = await pool.query('SELECT id FROM eventos WHERE ponente_id = ?', [id]);
      
      if (eventos.length > 0) {
        throw generarError('No se puede eliminar el ponente porque está asignado a eventos', 409, 'ConflictError');
      }
      
      await pool.query('DELETE FROM ponentes WHERE id = ?', [id]);
      
      return true;
    } catch (error) {
      console.error('Error al eliminar ponente:', error);
      if (error.code) throw error;
      throw generarError('Error al eliminar el ponente', 500, 'DatabaseError');
    }
  },

  /**
 * Listar ponentes para el panel de administración
 */
  async listarPonentesAdmin(filtros = {}) {
    try {
      // Parámetros de paginación para panel admin
      const pagina = parseInt(filtros.pagina) || 1;
      const limite = parseInt(filtros.limite) || 10;
      const offset = (pagina - 1) * limite;
      
      // Consulta con información adicional para admins
      let query = `
        SELECT p.*, 
        (SELECT COUNT(*) FROM eventos e WHERE e.ponente_id = p.id) AS eventos_count
        FROM ponentes p
      `;
      const params = [];
      
      // Aplicar filtros si existen
      if (filtros.busqueda) {
        query += ' WHERE (p.nombre LIKE ? OR p.apellido LIKE ? OR p.tags LIKE ?)';
        const terminoBusqueda = `%${filtros.busqueda}%`;
        params.push(terminoBusqueda, terminoBusqueda, terminoBusqueda);
      }
      
      // Consulta para contar el total
      const countQuery = 'SELECT COUNT(*) as total FROM ponentes p';
      const countParams = [];
      
      if (filtros.busqueda) {
        countQuery += ' WHERE (p.nombre LIKE ? OR p.apellido LIKE ? OR p.tags LIKE ?)';
        const terminoBusqueda = `%${filtros.busqueda}%`;
        countParams.push(terminoBusqueda, terminoBusqueda, terminoBusqueda);
      }
      
      // Aplicar ordenamiento
      query += ' ORDER BY p.nombre ASC';
      
      // Aplicar límite y offset
      query += ' LIMIT ? OFFSET ?';
      params.push(limite, offset);
      
      // Ejecutar consultas
      const [ponentes] = await pool.query(query, params);
      const [totalResult] = await pool.query(countQuery, countParams);
      
      const total = totalResult[0].total;
      const totalPaginas = Math.ceil(total / limite);
      
      return {
        ponentes,
        pagina,
        limite,
        total,
        totalPaginas
      };
    } catch (error) {
      console.error('Error al obtener ponentes para administración:', error);
      throw generarError(500, 'DatabaseError', 'Error al obtener ponentes para administración');
    }
  }
};

export default ponenteService;