import { api } from './api';

export const ponenteService = {
  getPonentes: async (filtros = {}) => {
    // Construir query params
    const queryParams = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return await api.get(`/ponentes${queryString}`);
  },
  
  getPonentePorId: async (id) => {
    return await api.get(`/ponentes/${id}`);
  }
};