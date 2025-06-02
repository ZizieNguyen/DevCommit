import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';

const ConfirmarRegistroPage = () => {
  const { token } = useParams();
  const [estado, setEstado] = useState({
    cargando: true,
    error: null,
    confirmado: false
  });

  useEffect(() => {
    const confirmarToken = async () => {
      if (!token) {
        setEstado({
          cargando: false,
          error: 'No se proporcionó un token de confirmación',
          confirmado: false
        });
        return;
      }

      try {
        // Llamada al API para confirmar el registro
        await authService.confirmarRegistro(token);
        
        setEstado({
          cargando: false,
          error: null,
          confirmado: true
        });
      } catch (error) {
        setEstado({
          cargando: false,
          error: error.message || 'Error al confirmar el registro',
          confirmado: false
        });
      }
    };

    confirmarToken();
  }, [token]);

  if (estado.cargando) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Verificando tu cuenta...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      {estado.confirmado ? (
        <div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">¡Registro confirmado!</h1>
          <p className="text-xl mb-8">Tu cuenta ha sido verificada correctamente.</p>
          <Link to="/login">
            <Button variant="primary">Iniciar sesión</Button>
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error de confirmación</h1>
          <p className="text-xl mb-8">{estado.error || 'No se pudo confirmar el registro'}</p>
          <div className="flex flex-col gap-4 items-center">
            <Link to="/registro">
              <Button variant="outline">Volver al registro</Button>
            </Link>
            <Link to="/">
              <Button variant="primary">Ir al inicio</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmarRegistroPage;