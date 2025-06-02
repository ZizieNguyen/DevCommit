import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// La clave está aquí: debemos exportar el contexto como export nombrado (named export)
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem('AUTH_TOKEN');
      
      if (!token) {
        setCargando(false);
        return;
      }

      try {
        // El token ya está configurado en el api
        const respuesta = await api.get('/auth/perfil');
        setAuth(respuesta.usuario || respuesta);
      } catch (error) {
        console.error('Error de autenticación:', error);
        setAuth({});
        localStorage.removeItem('AUTH_TOKEN');
      } finally {
        setCargando(false);
      }
    };

    autenticarUsuario();
  }, []);

  const login = async (datos) => {
    try {
      const respuesta = await api.post('/auth/login', datos);
      
      // Guardar el token en localStorage
      api.setToken(respuesta.token);
      
      // Actualizar el estado de autenticación
      setAuth(respuesta.usuario || respuesta);
      
      return {
        error: false
      };
    } catch (error) {
      return {
        error: true,
        mensaje: error.message || 'Hubo un problema al iniciar sesión'
      };
    }
  };

  const registro = async (datos) => {
    try {
      const respuesta = await api.post('/auth/registro', datos);
      return {
        error: false,
        mensaje: respuesta.mensaje
      };
    } catch (error) {
      return {
        error: true,
        mensaje: error.message || 'Error al registrar usuario'
      };
    }
  };

  const cerrarSesion = () => {
    api.setToken(null); // Esto eliminará el token
    setAuth({});
    navigate('/');
  };

  const actualizarPerfil = async (datos) => {
    try {
      const respuesta = await api.put('/auth/actualizar-perfil', datos);
      setAuth(respuesta.usuario || respuesta);
      return {
        error: false,
        mensaje: 'Perfil actualizado correctamente'
      };
    } catch (error) {
      return {
        error: true,
        mensaje: error.message || 'Error al actualizar perfil'
      };
    }
  };

  const cambiarPassword = async (datos) => {
    try {
      const respuesta = await api.put('/auth/actualizar-password', datos);
      return {
        error: false,
        mensaje: respuesta.mensaje
      };
    } catch (error) {
      return {
        error: true,
        mensaje: error.message || 'Error al actualizar contraseña'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        cargando,
        login,
        registro,
        cerrarSesion,
        actualizarPerfil,
        cambiarPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};