import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Alerta } from '../../components/ui/Alerta';
import { Spinner } from '../../components/ui/Spinner';

export default function ConfirmarRegistroPage() {
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  const { token } = useParams();
  const { confirmarCuenta } = useAuth();
  
  useEffect(() => {
    const confirmar = async () => {
      if(!token) {
        setAlerta({
          tipo: 'error',
          mensaje: 'Token no válido'
        });
        setCargando(false);
        return;
      }
      
      try {
        // En WebDevCamp, se usa el resultado para el mensaje
        const { mensaje } = await confirmarCuenta(token);
        
        setAlerta({
          tipo: 'exito',
          mensaje: mensaje || 'Cuenta confirmada correctamente. Ya puedes iniciar sesión.'
        });
      } catch (error) {
        // Extraer el mensaje de error del objeto
        const mensaje = error.response?.data?.mensaje || 
                       'El token no es válido o ya ha expirado';
        
        setAlerta({
          tipo: 'error',
          mensaje
        });
      } finally {
        setCargando(false);
      }
    };
    
    confirmar();
  }, [token, confirmarCuenta]);
  
  return (
    <div className="auth">
      <h1 className="auth__heading">Confirma tu cuenta</h1>
      <p className="auth__texto">Confirma tu cuenta en DevCommit</p>

      <div className="auth__formulario">
        {cargando ? (
          <div className="formulario__spinner-center">
            <Spinner />
            <p>Comprobando token...</p>
          </div>
        ) : (
          <Alerta 
            tipo={alerta.tipo}
            mensaje={alerta.mensaje}
          />
        )}

        {!cargando && alerta.tipo === 'exito' && (
          <div className="acciones acciones--centrar">
            <Link 
              to="/login"
              className="acciones__enlace"
            >
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}