import { api } from './api';

export const eventoService = {
  getEventos: async (filtros = {}) => {
    // Construir query params
    const queryParams = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return await api.get(`/eventos${queryString}`);
  },
  
  getEventoPorId: async (id) => {
    return await api.get(`/eventos/${id}`);
  },
  
  getCategorias: async () => {
    return await api.get('/categorias');
  },
  
  // Obtener eventos del usuario autenticado
  getEventosUsuario: async () => {
    return await api.get('/usuarios/eventos');
  },
  
  // Registrar un usuario a un evento
  registrarAsistencia: async (eventoId) => {
    try {
      return await api.post(`/eventos/${eventoId}/registros`);
    } catch (error) {
      // Si hay un error específico del backend, muéstralo
      if (error.response && error.response.data && error.response.data.mensaje) {
        throw new Error(error.response.data.mensaje);
      }
      throw new Error('No se pudo registrar al evento');
    }
  },

  // Cancelar registro a un evento
  cancelarAsistencia: async (eventoId) => {
    return await api.delete(`/eventos/${eventoId}/registros`);
  }
};