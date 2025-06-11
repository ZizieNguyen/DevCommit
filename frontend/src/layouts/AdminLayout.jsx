import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import '../styles/admin.css';

export default function AdminLayout() {
  const { auth, cargando } = useAuth();
  
  if(cargando) return 'Cargando...';
  
  // Redireccionar si el usuario no está autenticado o no es admin
  if(!auth || !auth.admin) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="dashboard">
      <AdminHeader />
      
      <div className="dashboard__grid">
        <AdminSidebar />
        
        <main className="dashboard__contenido">
          <Outlet />
        </main>
      </div>
    </div>
  );
}