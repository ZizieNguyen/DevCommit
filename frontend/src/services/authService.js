import { api } from './api';

/**
 * Servicio para manejar la autenticación y operaciones relacionadas con usuarios
 */
export const authService = {
  /**
   * Inicia sesión del usuario
   * @param {Object} credentials - Credenciales (email, password)
   */
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  /**
   * Cierra la sesión del usuario actual
   */
  logout: async () => {
    return await api.post('/auth/logout');
  },

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   */
  register: async (userData) => {
    return await api.post('/auth/registro', userData);
  },

  /**
   * Confirma el registro de un usuario mediante token
   * @param {string} token - Token de confirmación
   */
  confirmarRegistro: async (token) => {
    return await api.get(`/auth/confirmar/${token}`);
  },

  /**
   * Solicita un correo para restablecer contraseña
   * @param {Object} data - Objeto con el email
   */
  solicitarResetPassword: async (data) => {
    return await api.post('/auth/olvide-password', data);
  },

  /**
   * Comprueba si un token de reset es válido
   * @param {string} token - Token de reset
   */
  comprobarToken: async (token) => {
    return await api.get(`/auth/olvide-password/${token}`);
  },

  /**
   * Establece una nueva contraseña
   * @param {string} token - Token de validación
   * @param {Object} data - Nueva contraseña
   */
  nuevaPassword: async (token, data) => {
    return await api.post(`/auth/olvide-password/${token}`, data);
  },

  /**
   * Obtiene el perfil del usuario autenticado
   */
  getPerfil: async () => {
    return await api.get('/auth/perfil');
  }
};