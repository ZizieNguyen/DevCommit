const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Configuración por defecto
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Añadir token de autenticación si existe
  const token = localStorage.getItem('DEVCOMMIT_TOKEN');
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  // Configurar la petición
  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  // Si hay datos en el body, convertirlos a JSON
  if (fetchOptions.body && typeof fetchOptions.body === 'object') {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Si la respuesta no es exitosa
    if (!response.ok) {
      // Manejar error de autenticación
      if (response.status === 401) {
        localStorage.removeItem('DEVCOMMIT_TOKEN');
      }
      
      // Intentar obtener mensaje de error del backend
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || 'Error en la petición');
    }
    
    // Para respuestas exitosas sin contenido
    if (response.status === 204) {
      return null;
    }
    
    // Devolver datos como JSON
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Métodos helper para los verbos HTTP
export const api = {
  get: (endpoint) => fetchApi(endpoint),
  
  post: (endpoint, data) => fetchApi(endpoint, { 
    method: 'POST',
    body: data,
  }),
  
  put: (endpoint, data) => fetchApi(endpoint, {
    method: 'PUT',
    body: data,
  }),
  
  delete: (endpoint) => fetchApi(endpoint, {
    method: 'DELETE',
  }),
};