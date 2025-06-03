const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const fetchApi = async (url, options = {}) => {
  try {
    // Obtener el token de localStorage
    const token = localStorage.getItem('token');
    
    // Configurar headers con el token de autenticación
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    
    console.log(`Realizando ${options.method || 'GET'} a ${url}`, { 
      headers: { ...headers, Authorization: token ? 'Bearer [TOKEN]' : undefined } 
    });
    
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers
    });
    
    // Manejo básico de errores HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || `Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la solicitud API:', error);
    throw error;
  }
};

export const api = {
  get: (url) => fetchApi(url, { method: 'GET' }),
  post: (url, data) => fetchApi(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => fetchApi(url, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (url, data) => fetchApi(url, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (url) => fetchApi(url, { method: 'DELETE' })
};