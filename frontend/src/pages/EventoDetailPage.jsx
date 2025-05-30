import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { eventoService } from '../services/eventoService';

export const EventoDetailPage = () => {
  const { id } = useParams(); // Obtener el id de la URL
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [registrando, setRegistrando] = useState(false);
  const [estaRegistrado, setEstaRegistrado] = useState(false);
  const [mensaje, setMensaje] = useState(null); // Para mostrar mensajes al usuario
  
  // Cargar datos del evento
  useEffect(() => {
    const cargarEvento = async () => {
      try {
        setCargando(true);
        const data = await eventoService.getEventoPorId(id);
        setEvento(data);
        
        // Si el usuario está autenticado, verificar si ya está registrado
        if (isAuthenticated && user) {
          try {
            const registros = await eventoService.getEventosUsuario();
            const yaRegistrado = registros.some(e => e.id === parseInt(id));
            setEstaRegistrado(yaRegistrado);
          } catch (err) {
            console.error('Error al verificar registro:', err);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar el evento:', err);
        setError('No se pudo cargar la información del evento');
      } finally {
        setCargando(false);
      }
    };
    
    if (id) {
      cargarEvento();
    }
  }, [id, isAuthenticated, user]);
  
  // Función para manejar inscripción
  const handleInscripcion = async () => {
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir al login
      navigate('/login', { state: { from: `/eventos/${id}` } });
      return;
    }
    
    try {
      setRegistrando(true);
      await eventoService.registrarAsistencia(id);
      setEstaRegistrado(true);
      
      // Mostrar mensaje de éxito
      setMensaje({
        tipo: 'exito',
        texto: '¡Te has inscrito correctamente al evento!'
      });
      
      // Eliminar el mensaje después de 5 segundos
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      console.error('Error al registrarse al evento:', error);
      
      // Mostrar mensaje de error
      setMensaje({
        tipo: 'error',
        texto: error.message || 'Error al intentar inscribirse al evento'
      });
      
      // Eliminar el mensaje después de 5 segundos
      setTimeout(() => setMensaje(null), 5000);
    } finally {
      setRegistrando(false);
    }
  };
  
  // Función para cancelar inscripción
  const handleCancelarInscripcion = async () => {
    try {
      setRegistrando(true);
      await eventoService.cancelarAsistencia(id);
      setEstaRegistrado(false);
      
      // Mostrar mensaje de éxito
      setMensaje({
        tipo: 'exito',
        texto: 'Has cancelado tu inscripción al evento'
      });
      
      // Eliminar el mensaje después de 5 segundos
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      console.error('Error al cancelar inscripción:', error);
      
      // Mostrar mensaje de error
      setMensaje({
        tipo: 'error',
        texto: error.message || 'Error al intentar cancelar la inscripción'
      });
      
      // Eliminar el mensaje después de 5 segundos
      setTimeout(() => setMensaje(null), 5000);
    } finally {
      setRegistrando(false);
    }
  };
  
  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha por confirmar';
    
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(fecha);
  };
  
  // Formatear hora
  const formatearHora = (fechaStr) => {
    if (!fechaStr) return 'Hora por confirmar';
    
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };
  
  // Mostrar pantalla de carga
  if (cargando) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // Mostrar pantalla de error
  if (error || !evento) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error || 'Evento no encontrado'}</h1>
        <Link to="/eventos">
          <Button variant="primary">Volver a eventos</Button>
        </Link>
      </div>
    );
  }
  
  // Renderizar el detalle del evento
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link to="/eventos" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a eventos
        </Link>
      </div>
      
      {/* Mostrar mensaje de éxito o error */}
      {mensaje && (
        <div className={`mb-6 p-4 rounded-md ${
          mensaje.tipo === 'exito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mensaje.texto}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Imagen de cabecera */}
        {evento.imagen ? (
          <img 
            src={evento.imagen}
            alt={evento.nombre}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}
        
        <div className="p-6">
          {/* Encabezado */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant={`categoria-${evento.categoriaId || 1}`}>
                {evento.categoria?.nombre || 'General'}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatearFecha(evento.fecha)}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{evento.nombre}</h1>
            
            {evento.ponente && (
              <p className="text-gray-600 mb-2">
                Por: <span className="font-semibold">{evento.ponente.nombre}</span>
              </p>
            )}
          </div>
          
          {/* Información principal */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <h2 className="text-xl font-bold mb-3">Descripción</h2>
              <p className="text-gray-700 mb-6 whitespace-pre-line">
                {evento.descripcion}
              </p>
              
              {evento.requisitos && (
                <>
                  <h2 className="text-xl font-bold mb-3">Requisitos</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {evento.requisitos}
                  </p>
                </>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Detalles</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Fecha y hora</h3>
                  <p>{formatearFecha(evento.fecha)}</p>
                  <p>{formatearHora(evento.fecha)}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Ubicación</h3>
                  <p>{evento.ubicacion || 'Por determinar'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Precio</h3>
                  <p className={evento.precio > 0 ? 'font-bold text-xl' : 'text-green-600 font-bold'}>
                    {evento.precio > 0 ? `$${evento.precio.toFixed(2)}` : 'Gratuito'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Disponibilidad</h3>
                  <p>
                    {evento.cupoDisponible !== undefined && evento.cupoMaximo ? (
                      `${evento.cupoDisponible} de ${evento.cupoMaximo} lugares disponibles`
                    ) : 'Cupo ilimitado'}
                  </p>
                </div>
                
                {estaRegistrado ? (
                  <Button 
                    variant="secondary" 
                    fullWidth 
                    className="mt-4"
                    disabled={registrando}
                    onClick={handleCancelarInscripcion}
                  >
                    {registrando ? 'Procesando...' : 'Cancelar inscripción'}
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    fullWidth 
                    className="mt-4"
                    disabled={registrando || evento.cupoDisponible === 0}
                    onClick={handleInscripcion}
                  >
                    {registrando ? 'Procesando...' : 
                      evento.cupoDisponible === 0 ? 'Sin cupo' : 'Inscribirse al evento'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};