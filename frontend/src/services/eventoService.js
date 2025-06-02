import { api } from './api';

/**
 * Servicio para gestionar las operaciones relacionadas con eventos
 */
export const eventoService = {
  /**
   * Obtiene un listado de eventos con opciones de filtrado
   * @param {Object} params - Parámetros de consulta (limite, pagina, categoria, etc)
   */
  getEventos: async (params = {}) => {
    const respuesta = await api.get('/eventos', params);
    return respuesta;
  },
  
  /**
   * Obtiene un evento específico por su ID
   * @param {number|string} id - ID del evento
   */
  getEventoPorId: async (id) => {
    const respuesta = await api.get(`/eventos/${id}`);
    return respuesta;
  },
  
  /**
   * Obtiene eventos destacados para mostrar en la página principal
   * @param {number} limite - Cantidad máxima de eventos a retornar
   */
  getEventosDestacados: async (limite = 6) => {
    return await eventoService.getEventos({ destacado: true, limite });
  },
  
  /**
   * Obtiene eventos por categoría
   * @param {string|number} categoriaId - ID de la categoría
   * @param {Object} params - Parámetros adicionales
   */
  getEventosPorCategoria: async (categoriaId, params = {}) => {
    return await eventoService.getEventos({ 
      categoria: categoriaId,
      ...params
    });
  },
  
  /**
   * Busca eventos que coincidan con un término de búsqueda
   * @param {string} termino - Término de búsqueda
   */
  buscarEventos: async (termino) => {
    return await eventoService.getEventos({ q: termino });
  },
  
  /**
   * Crea un nuevo evento
   * @param {Object} eventoData - Datos del evento a crear
   */
  crearEvento: async (eventoData) => {
    return await api.post('/eventos', eventoData);
  },
  
  /**
   * Actualiza un evento existente
   * @param {number|string} id - ID del evento a actualizar
   * @param {Object} eventoData - Datos actualizados del evento
   */
  actualizarEvento: async (id, eventoData) => {
    return await api.put(`/eventos/${id}`, eventoData);
  },
  
  /**
   * Elimina un evento
   * @param {number|string} id - ID del evento a eliminar
   */
  eliminarEvento: async (id) => {
    return await api.delete(`/eventos/${id}`);
  },
  
  /**
   * Sube una imagen para un evento
   * @param {number|string} id - ID del evento
   * @param {FormData} formData - Formulario con la imagen a subir
   */
  subirImagenEvento: async (id, formData) => {
    return await api.upload(`/eventos/${id}/imagen`, formData);
  },
  
  /**
   * Obtiene los horarios disponibles para eventos
   */
  getHorarios: async () => {
    const respuesta = await api.get('/eventos/horarios');
    return respuesta;
  }
};