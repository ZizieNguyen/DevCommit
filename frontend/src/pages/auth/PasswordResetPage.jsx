import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Alerta } from '../../components/ui/Alerta';

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});
  
  const { solicitarResetPassword } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    
    if(email === '') {
      setAlerta({
        tipo: 'error',
        mensaje: 'El Email es Obligatorio'
      });
      return;
    }
    
    const resultado = await solicitarResetPassword(email);
    
    if(resultado.error) {
      setAlerta({
        tipo: 'error',
        mensaje: resultado.mensaje
      });
      return;
    }
    
    setAlerta({
      tipo: 'exito',
      mensaje: 'Hemos enviado las instrucciones a tu email'
    });
    
    setEmail('');
  }

  return (
    <div className="auth">
      <h1 className="auth__heading">Recuperar Acceso</h1>
      <p className="auth__texto">Recupera tu acceso a DevCommit</p>

      <div className="auth__formulario">
        {alerta.mensaje && (
          <Alerta 
            tipo={alerta.tipo}
            mensaje={alerta.mensaje}
          />
        )}

        <form 
          className="formulario"
          onSubmit={handleSubmit}
        >
          <div className="formulario__campo">
            <label 
              htmlFor="email"
              className="formulario__label"
            >
              Email
            </label>
            <input 
              id="email"
              type="email"
              placeholder="Tu Email"
              className="formulario__input"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <input 
            type="submit" 
            value="Enviar Instrucciones" 
            className="formulario__submit"
          />
        </form>

        <div className="acciones">
          <Link 
            to="/login"
            className="acciones__enlace"
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>

          <Link 
            to="/registro"
            className="acciones__enlace"
          >
            ¿Aún no tienes cuenta? Crear una
          </Link>
        </div>
      </div>
    </div>
  );
}