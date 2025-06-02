// frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Headers por defecto
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };
  
  // Agregar token si existe
  const token = localStorage.getItem('AUTH_TOKEN');
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  // Configuración completa
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    // Si la respuesta no es exitosa
    if (!response.ok) {
      // Intentar obtener el mensaje de error del servidor
      const errorData = await response.json().catch(() => ({
        mensaje: 'Error en la solicitud'
      }));
      
      throw new Error(errorData.mensaje || `Error: ${response.status} ${response.statusText}`);
    }
    
    // Si la respuesta es exitosa pero no hay contenido
    if (response.status === 204) {
      return { success: true };
    }
    
    // Si hay contenido, devolverlo como JSON
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud API:', error);
    throw error;
  }
};

export const api = {
  get: (endpoint, params = {}) => {
    // Convertir parámetros a string de consulta
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchApi(`${endpoint}${queryString}`, {
      method: 'GET'
    });
  },
  
  post: (endpoint, data) => {
    return fetchApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put: (endpoint, data) => {
    return fetchApi(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: (endpoint) => {
    return fetchApi(endpoint, {
      method: 'DELETE'
    });
  },
  
  // Para subir archivos (no establece Content-Type para que fetch lo haga automáticamente)
  upload: (endpoint, formData) => {
    return fetchApi(endpoint, {
      method: 'POST',
      headers: {
        // Quitar Content-Type para que fetch lo establezca con el boundary correcto
      },
      body: formData
    });
  },
  
  // Método para configurar el token de autenticación
  setToken: (token) => {
    if (token) {
      localStorage.setItem('AUTH_TOKEN', token);
    } else {
      localStorage.removeItem('AUTH_TOKEN');
    }
  }
};