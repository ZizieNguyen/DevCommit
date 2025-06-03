import { api } from './api';

/**
 * Servicio para manejar la autenticación y operaciones relacionadas con usuarios
 */
const authService = {
  /**
   * Inicia sesión del usuario
   * @param {Object} datos - Credenciales (email, password)
   */
  login: (datos) => {
    return api.post('/auth/login', datos);
  },

  /**
   * Cierra la sesión del usuario actual
   */
  logout: () => {
    return api.post('/auth/logout');
  },

  /**
   * Registra un nuevo usuario
   * @param {Object} datos - Datos del nuevo usuario
   */
  registro: (datos) => {
    return api.post('/auth/registro', datos);
  },

  /**
   * Confirma el registro de un usuario mediante token
   * @param {string} token - Token de confirmación
   */
  confirmarRegistro: (token) => {
    return api.get(`/auth/confirmar/${token}`);
  },

  /**
   * Solicita un correo para restablecer contraseña
   * @param {Object} datos - Objeto con el email
   */
  solicitarResetPassword: (datos) => {
    return api.post('/auth/olvide-password', datos);
  },

  /**
   * Comprueba si un token de reset es válido
   * @param {string} token - Token de reset
   */
  comprobarToken: (token) => {
    return api.get(`/auth/olvide-password/${token}`);
  },

  /**
   * Establece una nueva contraseña
   * @param {string} token - Token de validación
   * @param {Object} datos - Nueva contraseña
   */
  nuevaPassword: (token, datos) => {
    return api.post(`/auth/olvide-password/${token}`, datos);
  },

  /**
   * Obtiene el perfil del usuario autenticado
   */
  obtenerPerfil: () => {
    return api.get('/auth/perfil');
  }
};

export { authService };