import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../ui/Spinner';

export default function AdminRoute({ children }) {
  const { auth, cargando } = useAuth();
  
  if (cargando) {
    return <Spinner />;
  }
  
  // Solo redirigir si el usuario no está autenticado o no es admin
  if (!auth?.id || !auth?.admin) {
    return <Navigate to="/login" replace />;
  }
  
  // Si pasa la validación, mostrar el contenido protegido
  return children;
}