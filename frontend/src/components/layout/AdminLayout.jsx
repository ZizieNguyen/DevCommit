import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaHome, FaCalendarAlt, FaUsers, FaClipboardList, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = () => {
  const { auth, cerrarSesion } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuMobile, setMenuMobile] = useState(false);
  
  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <div className="admin">
      <div className="admin-grid">
        {/* Sidebar con fondo negro */}
        <aside className={`admin-sidebar ${menuMobile ? 'admin-sidebar--visible' : ''}`}>
          <div className="admin-sidebar__header">
            <div className="admin-sidebar__logo">
              <Link to="/admin/dashboard">
                <h2 className="admin-sidebar__heading">
                   &#60;DevCommit<span className="admin-sidebar__heading-bold">Admin</span>/&#62;
                </h2>
              </Link>
            </div>
            
            <button 
              className="admin-sidebar__menu-btn" 
              onClick={() => setMenuMobile(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="admin-sidebar__usuario">
            <p>Hola: <span>{auth.nombre}</span></p>
          </div>

          <nav className="admin-menu">
            <Link 
              to="/admin/dashboard" 
              className={`admin-menu__enlace ${location.pathname === '/admin/dashboard' ? 'admin-menu__enlace--activo' : ''}`}
              onClick={() => setMenuMobile(false)}
            >
              <FaHome className="admin-menu__icono" />
              <span>Dashboard</span>
            </Link>

            <Link 
              to="/admin/eventos" 
              className={`admin-menu__enlace ${location.pathname.includes('/admin/eventos') ? 'admin-menu__enlace--activo' : ''}`}
              onClick={() => setMenuMobile(false)}
            >
              <FaCalendarAlt className="admin-menu__icono" />
              <span>Eventos</span>
            </Link>

            <Link 
              to="/admin/ponentes" 
              className={`admin-menu__enlace ${location.pathname.includes('/admin/ponentes') ? 'admin-menu__enlace--activo' : ''}`}
              onClick={() => setMenuMobile(false)}
            >
              <FaUsers className="admin-menu__icono" />
              <span>Ponentes</span>
            </Link>

            <Link 
              to="/admin/registros" 
              className={`admin-menu__enlace ${location.pathname === '/admin/registros' ? 'admin-menu__enlace--activo' : ''}`}
              onClick={() => setMenuMobile(false)}
            >
              <FaClipboardList className="admin-menu__icono" />
              <span>Registros</span>
            </Link>

            <button 
              className="admin-menu__enlace admin-menu__enlace--logout"
              onClick={handleCerrarSesion}
            >
              <FaSignOutAlt className="admin-menu__icono" />
              <span>Cerrar Sesión</span>
            </button>
          </nav>
        </aside>

        {/* Contenido Principal con botón móvil */}
        <main className="admin-main">
          <div className="admin-main__header">
            <button 
              className="admin-main__menu-btn" 
              onClick={() => setMenuMobile(!menuMobile)}
            >
              <FaBars />
            </button>
          </div>
          
          <div className="admin-main__contenido">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;