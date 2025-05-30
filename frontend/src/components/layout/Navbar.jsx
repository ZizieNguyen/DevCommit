import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Detectar scroll para cambiar estilo de la barra de navegación
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-dark shadow-md' : 'bg-gray-dark bg-opacity-95'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-white">DevCommit</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({isActive}) => 
              `text-white ${isActive ? 'font-bold text-primary' : 'hover:text-primary transition-colors'}`
            } end>
              Inicio
            </NavLink>
            <NavLink to="/eventos" className={({isActive}) => 
              `text-white ${isActive ? 'font-bold text-primary' : 'hover:text-primary transition-colors'}`
            }>
              Eventos
            </NavLink>
            <NavLink to="/ponentes" className={({isActive}) => 
              `text-white ${isActive ? 'font-bold text-primary' : 'hover:text-primary transition-colors'}`
            }>
              Ponentes
            </NavLink>
            
            <div className="ml-8 flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="text-white">
                    Hola, <span className="font-medium">{user?.nombre?.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="small" as="link" to="/perfil">
                      Mi perfil
                    </Button>
                    <Button variant="primary" size="small" onClick={handleLogout}>
                      Cerrar sesión
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button variant="outline" as="link" to="/login">
                    Iniciar sesión
                  </Button>
                  <Button variant="primary" as="link" to="/registro">
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                `block py-2 text-white ${isActive ? 'font-bold text-primary' : 'hover:text-primary'}`
              }
              onClick={() => setIsMenuOpen(false)}
              end
            >
              Inicio
            </NavLink>
            <NavLink 
              to="/eventos" 
              className={({isActive}) => 
                `block py-2 text-white ${isActive ? 'font-bold text-primary' : 'hover:text-primary'}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </NavLink>
            <NavLink 
              to="/ponentes" 
              className={({isActive}) => 
                `block py-2 text-white ${isActive ? 'font-bold text-primary' : 'hover:text-primary'}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Ponentes
            </NavLink>
            
            {/* Opciones móviles condicionadas por autenticación */}
            <div className="pt-4 flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <p className="text-sm text-gray-300 mb-1">
                    Hola, {user?.nombre?.split(' ')[0]}
                  </p>
                  <Button variant="outline" fullWidth as="link" to="/perfil" onClick={() => setIsMenuOpen(false)}>
                    Mi perfil
                  </Button>
                  <Button variant="primary" fullWidth onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" fullWidth as="link" to="/login" onClick={() => setIsMenuOpen(false)}>
                    Iniciar sesión
                  </Button>
                  <Button variant="primary" fullWidth as="link" to="/registro" onClick={() => setIsMenuOpen(false)}>
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};