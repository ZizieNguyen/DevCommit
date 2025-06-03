import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../ui/Spinner';

export default function ProtectedRoute({ children }) {
  const { auth, cargando } = useAuth();
  
  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
        <p className="ml-2">Cargando...</p>
      </div>
    );
  }
  
  // Si no hay usuario autenticado, redirigir a login
  if (!auth?.id) {
    return <Navigate to="/login" replace />;
  }
  
  // Si hay usuario autenticado, mostrar los children
  return children;
}