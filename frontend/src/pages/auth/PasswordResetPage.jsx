import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Alerta } from '../../components/ui/Alerta';

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [alerta, setAlerta] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setAlerta({
        tipo: 'error',
        mensaje: 'El email es obligatorio'
      });
      return;
    }
    
    try {
      await api.post('/auth/olvide-password', { email });
      
      setAlerta({
        tipo: 'success',
        mensaje: 'Hemos enviado un email con las instrucciones'
      });
      
      setEnviado(true);
    } catch (error) {
      setAlerta({
        tipo: 'error',
        mensaje: error.message
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Recuperar Contraseña
        </h1>
        
        {alerta.mensaje && (
          <Alerta 
            mensaje={alerta.mensaje}
            tipo={alerta.tipo}
          />
        )}
        
        {!enviado ? (
          <>
            <p className="text-gray-600 mb-6 text-center">
              Escribe tu email y te enviaremos instrucciones para restablecer tu contraseña
            </p>
            
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
                  placeholder="Tu email registrado"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition-colors"
                >
                  Enviar Instrucciones
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Revisa tu email y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <p className="text-gray-600">
              No olvides revisar la carpeta de spam.
            </p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link 
            to="/login"
            className="text-sm text-primary hover:text-primary-dark"
          >
            ¿Ya recordaste tu contraseña? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}