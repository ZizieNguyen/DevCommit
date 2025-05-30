import { api } from './api';

export const authService = {
  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Guardar token en localStorage
      if (response.token) {
        localStorage.setItem('DEVCOMMIT_TOKEN', response.token);
      } else {
        console.warn('No se recibió token en la respuesta de login');
      }
      
      return response;
    } catch (error) {
      console.error('Error de autenticación:', error);
      
      // Mensajes más específicos según el error
      if (error.message && error.message.includes('401')) {
        throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (error.message && error.message.includes('404')) {
        throw new Error('El usuario no existe. Verifica tu email o regístrate.');
      } else {
        throw new Error('Error al iniciar sesión. Intenta de nuevo más tarde.');
      }
    }
  },
  
  // Registrar nuevo usuario
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Guardar token en localStorage si el registro incluye login automático
      if (response.token) {
        localStorage.setItem('DEVCOMMIT_TOKEN', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Mensajes específicos para errores de registro
      if (error.message && error.message.includes('email')) {
        throw new Error('Este correo electrónico ya está en uso. Intenta con otro o inicia sesión.');
      } else {
        throw new Error('Error al crear tu cuenta. Por favor intenta de nuevo.');
      }
    }
  },
  
  // Obtener datos del usuario actual
  getCurrentUser: async () => {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      throw error;
    }
  },
  
  // Verificar si hay una sesión activa
  isAuthenticated: () => {
    return localStorage.getItem('DEVCOMMIT_TOKEN') !== null;
  },
  
  // Actualizar datos del perfil
  updateProfile: async (userData) => {
    try {
      return await api.put('/auth/perfil', userData);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },
  
  // Cambiar contraseña
  changePassword: async (passwordData) => {
    try {
      return await api.put('/auth/password', passwordData);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  },
  
  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('DEVCOMMIT_TOKEN');
  }
};