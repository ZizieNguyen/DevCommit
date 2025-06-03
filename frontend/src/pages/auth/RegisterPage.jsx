import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import { Alerta } from '../../components/ui/Alerta';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});
  
  const { registro, auth } = useAuth();
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
    const resultado = await registro({ nombre, email, password });
    
    if (resultado.error) {
      setAlerta({
        tipo: 'error',
        mensaje: resultado.mensaje
      });
      return;
    }
    
    // Mostrar mensaje de éxito
    setAlerta({
      tipo: 'exito',
      mensaje: 'Cuenta creada correctamente. Revisa tu email para confirmar tu cuenta.'
    });
    
    // Limpiar formulario
    setNombre('');
    setEmail('');
    setPassword('');
    setRepetirPassword('');
  };
  
  return (
    <div className="auth">
      <h1 className="auth__heading">Crear Cuenta</h1>
      <p className="auth__texto">Regístrate en DevCommit</p>

      <div className="auth__formulario">
        {alerta.mensaje && (
          <Alerta 
            tipo={alerta.tipo}
            mensaje={alerta.mensaje}
          />
        )}

        <form 
          onSubmit={handleSubmit}
          className="formulario"
        >
          <div className="formulario__campo">
            <label 
              htmlFor="nombre"
              className="formulario__label"
            >
              Nombre
            </label>
            <input 
              id="nombre"
              type="text"
              placeholder="Tu Nombre"
              className="formulario__input"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </div>
          
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
          
          <div className="formulario__campo">
            <label 
              htmlFor="password"
              className="formulario__label"
            >
              Contraseña
            </label>
            <input 
              id="password"
              type="password"
              placeholder="Tu Contraseña"
              className="formulario__input"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <div className="formulario__campo">
            <label 
              htmlFor="repetir-password"
              className="formulario__label"
            >
              Repetir Contraseña
            </label>
            <input 
              id="repetir-password"
              type="password"
              placeholder="Repite tu Contraseña"
              className="formulario__input"
              value={repetirPassword}
              onChange={e => setRepetirPassword(e.target.value)}
            />
          </div>

          <input 
            type="submit" 
            value="Crear Cuenta" 
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
        </div>
      </div>
    </div>
  );
}