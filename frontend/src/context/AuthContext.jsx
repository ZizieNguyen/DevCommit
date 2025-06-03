import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // Comprobar autenticación existente al cargar
  const verificarAutenticacion = async () => {
    try {
      // Verificar si hay un token guardado
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCargando(false);
        return null;
      }
      
      // Verificar validez del token con el backend
      const respuesta = await api.get('/auth/perfil');
      
      if (respuesta.resultado && respuesta.usuario) {
        setUsuario(respuesta.usuario);
        return respuesta.usuario;
      } else {
        // Token inválido o expirado
        localStorage.removeItem('token');
        setUsuario(null);
        return null;
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // Error de autenticación, limpiamos token
      localStorage.removeItem('token');
      setUsuario(null);
      return null;
    } finally {
      setCargando(false);
    }
  };
  
  useEffect(() => {
    verificarAutenticacion();
  }, []);
  
  // Manejar login
  const login = async (email, password) => {
    try {
      const respuesta = await api.post('/auth/login', {
        email,
        password
      });
      
      if (respuesta.resultado && respuesta.token) {
        localStorage.setItem('token', respuesta.token);
        setUsuario(respuesta.usuario);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error de login:', error);
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{
      usuario,
      cargando,
      login,
      logout: () => {
        localStorage.removeItem('token');
        setUsuario(null);
      },
      verificarAutenticacion
    }}>
      {children}
    </AuthContext.Provider>
  );
};