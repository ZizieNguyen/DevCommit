import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import { Alerta } from '../../components/ui/Alerta';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});
  
  const { registrarUsuario, auth } = useAuth();
  const navigate = useNavigate();
  
  // Si el usuario ya está autenticado, redirigir
  useEffect(() => {
    if (auth?.id) {
      navigate('/');
    }
  }, [auth, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos
    if ([nombre, email, password, repetirPassword].includes('')) {
      setAlerta({
        tipo: 'error',
        mensaje: 'Todos los campos son obligatorios'
      });
      return;
    }
    
    if (password !== repetirPassword) {
      setAlerta({
        tipo: 'error',
        mensaje: 'Las contraseñas no coinciden'
      });
      return;
    }
    
    if (password.length < 6) {
      setAlerta({
        tipo: 'error',
        mensaje: 'La contraseña debe tener al menos 6 caracteres'
      });
      return;
    }
    
    setAlerta({});
    
    // Registrar usuario
    const resultado = await registrarUsuario({ nombre, email, password });
    
    if (resultado.error) {
      setAlerta({
        tipo: 'error',
        mensaje: resultado.msg
      });
      return;
    }
    
    // Mostrar mensaje de éxito
    setAlerta({
      tipo: 'success',
      mensaje: 'Cuenta creada correctamente. Revisa tu email para confirmar tu cuenta.'
    });
    
    // Limpiar formulario
    setNombre('');
    setEmail('');
    setPassword('');
    setRepetirPassword('');
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h1>
        
        {alerta.mensaje && (
          <Alerta 
            mensaje={alerta.mensaje}
            tipo={alerta.tipo}
          />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input 
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </div>
          
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
            <label 
              htmlFor="repetir-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Repetir Contraseña
            </label>
            <input 
              id="repetir-password"
              type="password"
              placeholder="Repite tu contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={repetirPassword}
              onChange={e => setRepetirPassword(e.target.value)}
            />
          </div>
          
          <div>
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Crear Cuenta
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Link 
            to="/login"
            className="text-sm text-primary hover:text-primary-dark"
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}