/**
 * Servicio para la gestión de eventos
 */
import { pool } from '../config/db.js';
import { generarError } from '../utils/helpers.js';

const eventoService = {

  /**
   * Listar todos los eventos con paginación completa
   */
  async listarEventos(filtros = {}) {
    try {
      console.log('Consultando eventos con filtros:', filtros);
      
      // Parámetros de paginación
      const pagina = parseInt(filtros.pagina) || 1;
      const limite = parseInt(filtros.limite) || 9;
      const offset = (pagina - 1) * limite;
      
      // Construir consulta base
      let queryEventos = `
        SELECT e.*, 
          c.nombre AS categoria_nombre,
          h.dia AS dia, h.hora AS hora,
          CONCAT(p.nombre, ' ', p.apellido) AS ponente_nombre
        FROM eventos e
        LEFT JOIN catalogos c ON e.categoria_id = c.id
        LEFT JOIN horarios h ON e.horario_id = h.id
        LEFT JOIN ponentes p ON e.ponente_id = p.id
      `;
      
      // Consulta para contar total de registros
      let queryTotal = `
        SELECT COUNT(*) AS total
        FROM eventos e
        LEFT JOIN catalogos c ON e.categoria_id = c.id
        LEFT JOIN horarios h ON e.horario_id = h.id
        LEFT JOIN ponentes p ON e.ponente_id = p.id
      `;
      
      const paramsEventos = [];
      const paramsTotal = [];
      
      // Filtros para ambas consultas
      let whereClause = '';
      
      if (filtros.destacado) {
        whereClause = ' WHERE e.destacado = ?';
        paramsEventos.push(filtros.destacado === 'true' ? 1 : 0);
        paramsTotal.push(filtros.destacado === 'true' ? 1 : 0);
      }
      
      if (filtros.categoria_id) {
        whereClause += whereClause ? ' AND e.categoria_id = ?' : ' WHERE e.categoria_id = ?';
        paramsEventos.push(filtros.categoria_id);
        paramsTotal.push(filtros.categoria_id);
      }
      
      if (filtros.dia) {
        whereClause += whereClause ? ' AND h.dia = ?' : ' WHERE h.dia = ?';
        paramsEventos.push(filtros.dia);
        paramsTotal.push(filtros.dia);
      }
      
      if (filtros.busqueda) {
        const terminoBusqueda = `%${filtros.busqueda}%`;
        whereClause += whereClause ? ' AND (e.nombre LIKE ? OR e.descripcion LIKE ?)' : ' WHERE (e.nombre LIKE ? OR e.descripcion LIKE ?)';
        paramsEventos.push(terminoBusqueda, terminoBusqueda);
        paramsTotal.push(terminoBusqueda, terminoBusqueda);
      }
      
      // Aplicar where a ambas consultas
      queryEventos += whereClause;
      queryTotal += whereClause;
      
      // Ordenar eventos
      queryEventos += ' ORDER BY h.dia ASC, h.hora ASC';
      
      // Agregar paginación solo a la consulta de eventos
      queryEventos += ' LIMIT ? OFFSET ?';
      paramsEventos.push(limite, offset);
      
      console.log('Query a ejecutar:', queryEventos);
      console.log('Parámetros:', paramsEventos);
      
      // Ejecutar ambas consultas
      const [eventos] = await pool.query(queryEventos, paramsEventos);
      const [totalResult] = await pool.query(queryTotal, paramsTotal);
      
      const total = totalResult[0].total;
      const totalPaginas = Math.ceil(total / limite);
      
      console.log(`Se encontraron ${eventos.length} eventos de un total de ${total}`);
      
      // Devolver resultados con metadatos de paginación
      return {
        eventos,
        pagina,
        limite,
        total,
        totalPaginas
      };
    } catch (error) {
      console.error('Error detallado al obtener eventos:', error);
      throw generarError('Error al obtener los eventos', 500, 'DatabaseError');
    }
  },
  
  /**
   * Listar eventos para el panel de administración
   */
  async listarEventosAdmin(filtros = {}) {
    try {
      // Parámetros de paginación para panel admin
      const pagina = parseInt(filtros.pagina) || 1;
      const limite = parseInt(filtros.limite) || 10;
      const offset = (pagina - 1) * limite;
      
      // Consulta específica para administradores con más información
      let queryEventos = `
        SELECT e.*, 
          c.nombre AS categoria_nombre,
          h.dia AS dia, h.hora AS hora,
          CONCAT(p.nombre, ' ', p.apellido) AS ponente_nombre,
          (SELECT COUNT(*) FROM registros r WHERE r.evento_id = e.id) AS registros
        FROM eventos e
        LEFT JOIN catalogos c ON e.categoria_id = c.id
        LEFT JOIN horarios h ON e.horario_id = h.id
        LEFT JOIN ponentes p ON e.ponente_id = p.id
      `;
      
      // Consulta para contar total
      let queryTotal = 'SELECT COUNT(*) AS total FROM eventos';
      
      // Aplicar filtros (si hay alguno específico del admin)
      // ...
      
      // Ordenar por ID para panel admin
      queryEventos += ' ORDER BY e.id DESC';
      
      // Paginación
      queryEventos += ' LIMIT ? OFFSET ?';
      const paramsEventos = [limite, offset];
      
      // Ejecutar consultas
      const [eventos] = await pool.query(queryEventos, paramsEventos);
      const [totalResult] = await pool.query(queryTotal);
      
      const total = totalResult[0].total;
      const totalPaginas = Math.ceil(total / limite);
      
      // Devolver resultados con metadatos de paginación
      return {
        eventos,
        pagina,
        limite,
        total,
        totalPaginas
      };
    } catch (error) {
      console.error('Error al obtener eventos para administración:', error);
      throw generarError('Error al obtener los eventos', 500, 'DatabaseError');
    }
  },
  
  // El resto del código se mantiene igual
  async buscarPorId(id) { /* ... */ },
  async crear({ nombre, descripcion, disponibles, categoria_id, horario_id, ponente_id }) { /* ... */ },
  async actualizar(id, datos) { /* ... */ },
  async eliminar(id) { /* ... */ },

  /**
   * Contar total de eventos
   */
  async contarEventos() {
    try {
      const [result] = await pool.query('SELECT COUNT(*) as total FROM eventos');
      return result[0].total;
    } catch (error) {
      console.error('Error al contar eventos:', error);
      throw generarError(500, 'DatabaseError', 'Error al contar eventos');
    }
  },

  /**
   * Obtener próximos eventos ordenados por día y hora
   */
  async obtenerEventosProximos(limite = 5) {
    try {
      const query = `
          SELECT e.*, 
              c.nombre AS categoria_nombre,
              h.dia AS dia, h.hora AS hora,
              CONCAT(p.nombre, ' ', p.apellido) AS ponente_nombre,
              (SELECT COUNT(*) FROM registros r WHERE r.evento_id = e.id) AS total_registros
          FROM eventos e
          LEFT JOIN catalogos c ON e.categoria_id = c.id
          LEFT JOIN horarios h ON e.horario_id = h.id
          LEFT JOIN ponentes p ON e.ponente_id = p.id
          ORDER BY 
              CASE 
                  WHEN h.dia = 'Viernes' THEN 1
                  WHEN h.dia = 'Sábado' THEN 2
                  WHEN h.dia = 'Domingo' THEN 3
                  ELSE 4
              END, h.hora
          LIMIT ?
      `;
      
      const [eventos] = await pool.query(query, [limite]);
      return eventos;
    } catch (error) {
      console.error('Error al obtener eventos próximos:', error);
      throw generarError(500, 'DatabaseError', 'Error al obtener eventos próximos');
    }
  }
};

export default eventoService;