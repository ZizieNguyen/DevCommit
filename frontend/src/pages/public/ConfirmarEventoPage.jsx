import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../../components/ui/Spinner';
import { Alerta } from '../../components/ui/Alerta';
import { formatearFecha } from "../../utils/dateUtils";

export default function ConfirmarEventoPage() {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  const [confirmando, setConfirmando] = useState(false);
  
  useEffect(() => {
    if (!auth) {
      navigate('/login', { state: { from: `/finalizar-registro/${tipo}/${id}` } });
      return;
    }
    
    const obtenerEvento = async () => {
      try {
        setCargando(true);
        const data = await api.get(`/eventos/${id}`);
        
        // Verificar si hay plazas disponibles
        if (data.disponibles === 0) {
          setAlerta({
            tipo: 'error',
            mensaje: 'No hay plazas disponibles para este evento'
          });
          return;
        }
        
        setEvento(data);
        setAlerta({});
      } catch (error) {
        console.error(error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error al cargar el evento'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerEvento();
  }, [id, auth, navigate, tipo]);
  
  const handleConfirmar = async () => {
    if (!auth) {
      navigate('/login', { state: { from: `/finalizar-registro/${tipo}/${id}` } });
      return;
    }
    
    try {
      setConfirmando(true);
      
      // Crear registro
      await api.post('/registros', {
        eventoId: id,
        usuarioId: auth.id
      });
      
      setAlerta({
        tipo: 'success',
        mensaje: 'Registro completado con éxito'
      });
      
      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error(error);
      setAlerta({
        tipo: 'error',
        mensaje: error.message || 'Error al finalizar el registro'
      });
    } finally {
      setConfirmando(false);
    }
  };
  
  if (cargando) return <Spinner />;
  
  if (!evento) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alerta 
          mensaje="Evento no encontrado"
          tipo="error"
        />
        <div className="text-center mt-6">
          <Link
            to="/eventos"
            className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Volver a Eventos
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Confirmar Asistencia</h1>
      
      {alerta.mensaje && (
        <Alerta 
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
        />
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Resumen del evento</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold">Nombre del evento:</h3>
            <p>{evento.nombre}</p>
          </div>
          
          <div>
            <h3 className="font-bold">Fecha y hora:</h3>
            <p>{formatearFecha(evento.dia.fecha)} a las {evento.hora}</p>
          </div>
          
          <div>
            <h3 className="font-bold">Categoría:</h3>
            <p>{evento.categoria.nombre}</p>
          </div>
          
          {evento.ponente && (
            <div>
              <h3 className="font-bold">Ponente:</h3>
              <p>{evento.ponente.nombre} {evento.ponente.apellido}</p>
            </div>
          )}
          
          <div>
            <h3 className="font-bold">Plazas disponibles:</h3>
            <p>{evento.disponibles}</p>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Datos del asistente</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">Nombre:</h3>
              <p>{auth.nombre} {auth.apellido}</p>
            </div>
            
            <div>
              <h3 className="font-bold">Email:</h3>
              <p>{auth.email}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Link 
            to="/eventos"
            className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4"
          >
            Cancelar
          </Link>
          
          <button
            onClick={handleConfirmar}
            className="btn btn-primary py-2 px-6"
            disabled={confirmando}
          >
            {confirmando ? 'Confirmando...' : 'Confirmar Asistencia'}
          </button>
        </div>
      </div>
    </div>
  );
}