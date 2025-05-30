import React, { useState, useEffect } from 'react';
import { AuthContext } from './authContext';
import { authService } from '../services/authService';

// Este archivo solo exporta el componente Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Verificar autenticación al cargar
  useEffect(() => {
    const verificarAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Error al verificar autenticación:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    
    verificarAuth();
  }, []);
  
  // Función de login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Función de registro
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Función de logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  // Valor del contexto
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};