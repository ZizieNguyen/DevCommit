import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  // Mostrar un indicador de carga mientras verificamos la autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Si requiere ser admin y el usuario no lo es, redirigir
  if (adminOnly && (!isAuthenticated || !user?.isAdmin)) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Si está autenticado, mostrar el contenido protegido
  return children;
};