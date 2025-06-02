import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import { Alerta } from "../../components/ui/Alerta";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState({});
  
  const { login, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  
  // Si el usuario ya está autenticado, redirigir
  useEffect(() => {
    if (auth?.id) {
      navigate(from);
    }
  }, [auth, navigate, from]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos
    if ([email, password].includes('')) {
      setAlerta({
        tipo: 'error',
        mensaje: 'Todos los campos son obligatorios'
      });
      return;
    }
    
    setAlerta({});
    
    // Iniciar sesión
    const resultado = await login({ email, password });
    
    if (resultado.error) {
      setAlerta({
        tipo: 'error',
        mensaje: resultado.msg
      });
      return;
    }
    
    // Redireccionar
    navigate(from);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h1>
        
        {alerta.mensaje && (
          <Alerta 
            mensaje={alerta.mensaje}
            tipo={alerta.tipo}
          />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input 
              id="email"
              type="email"
              placeholder="Tu email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label 
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input 
              id="password"
              type="password"
              placeholder="Tu contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <div>
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
        
        <div className="mt-6 flex items-center justify-between">
          <Link 
            to="/recuperar-password"
            className="text-sm text-primary hover:text-primary-dark"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          
          <Link 
            to="/registro"
            className="text-sm text-primary hover:text-primary-dark"
          >
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}