import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../ui/Spinner';

export default function ProtectedRoute({ children, adminOnly = true }) {
  const { auth, cargando } = useAuth();
  
  if (cargando) return <Spinner />;
  
  // Si no está autenticado, redirigir a login
  if (!auth?.id) {
    return <Navigate to="/login" />;
  }
  
  // Si se requiere ser admin y no lo es, redirigir a home
  if (adminOnly && !auth.admin) {
    return <Navigate to="/" />;
  }
  
  // Si está autenticado y cumple los requisitos, mostrar los hijos
  return children;
}