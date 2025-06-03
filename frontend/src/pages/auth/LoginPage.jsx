import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Alerta } from '../../components/ui/Alerta';
import { Spinner } from '../../components/ui/Spinner';

// Función auxiliar para crear retrasos
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState({});
  const [cargandoForm, setCargandoForm] = useState(false);
  
  const { login, auth } = useAuth();
  const navigate = useNavigate();
  
  // Si el usuario ya está autenticado, redirigir según su rol
  useEffect(() => {
    if (auth?.id) {
      navigate(auth?.admin ? '/admin/dashboard' : '/');
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if([email, password].includes('')) {
      setAlerta({
        tipo: 'error',
        mensaje: 'Todos los campos son obligatorios'
      });
      return;
    }
    
    try {
      // Iniciar estado de cargando
      setCargandoForm(true);
      
      // Iniciar sesión - IMPORTANTE: guardar lo que devuelve login
      const usuarioData = await login({ email, password });
      
      if(usuarioData.error) {
        setAlerta({
          tipo: 'error',
          mensaje: usuarioData.mensaje
        });
        return;
      }
      
      // Login exitoso
      setAlerta({
        tipo: 'exito',
        mensaje: '¡Bienvenido! Redireccionando...'
      });
      
      // Usar async/await en lugar de setTimeout
      await esperar(1500);
      
      // Redirección usando los datos devueltos por login, no el estado auth
      navigate(usuarioData.admin ? '/admin/dashboard' : '/');
      
    } catch (error) {
      console.error(error);
      setAlerta({
        tipo: 'error',
        mensaje: 'Ocurrió un error al iniciar sesión'
      });
    } finally {
      setCargandoForm(false);
    }
  }

  return (
    <div className="auth">
      <h1 className="auth__heading">Iniciar Sesión</h1>
      <p className="auth__texto">Inicia sesión en DevCommit</p>

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
              disabled={cargandoForm}
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
              disabled={cargandoForm}
            />
          </div>

          <button 
            type="submit" 
            className={`formulario__submit ${cargandoForm ? 'formulario__submit--deshabilitado' : ''}`}
            disabled={cargandoForm}
          >
            {cargandoForm ? (
              <div className="formulario__spinner">
                <Spinner /> Iniciando sesión...
              </div>
            ) : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="acciones">
          <Link 
            to="/registro"
            className="acciones__enlace"
          >
            ¿Aún no tienes cuenta? Crear una
          </Link>

          <Link 
            to="/olvide-password"
            className="acciones__enlace"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}