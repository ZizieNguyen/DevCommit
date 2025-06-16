import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clienteAxios } from '../config/axios';
import Spinner from '../components/Spinner';
import Alerta from '../components/alertas/Alerta';
import '../styles/evento-detail.css';

// Función para formatear fecha
const formatearFecha = fecha => {
  if (!fecha) return '';
  
  const fechaNueva = new Date(fecha);
  const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return fechaNueva.toLocaleDateString('es-ES', opciones);
};

export default function EventoDetail() {
  const { id } = useParams();
  
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  useEffect(() => {
    const obtenerEvento = async () => {
      try {
        setCargando(true);
        setAlerta({});
        
        // Obtener los datos del evento
        const { data } = await clienteAxios.get(`/api/eventos/${id}`);
        
        if (data) {
          console.log('Evento cargado:', data);
          setEvento(data);
        }
      } catch (error) {
        console.error('Error al cargar el evento:', error);
        setAlerta({
          tipo: 'error',
          mensaje: 'No se pudo cargar la información del evento'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerEvento();
  }, [id]);
  
  if (cargando) return <Spinner />;
  
  if (!evento) {
    return (
      <div className="evento-no-encontrado">
        <Alerta 
          tipo="error"
          mensaje={alerta.mensaje || "Evento no encontrado"}
        />
        <div className="evento-no-encontrado__accion">
          <Link
            to="/eventos"
            className="evento-no-encontrado__enlace"
          >
            Volver a Eventos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="evento-detalle">
      {alerta.mensaje && (
        <Alerta 
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}
      
      <div className="evento-detalle__hero">
        <div className={`evento-detalle__categoria evento-detalle__categoria--${evento.categoria?.id || 0}`}></div>
        <h1 className="evento-detalle__nombre">{evento.nombre}</h1>
      </div>
      
      <div className="evento-detalle__grid">
        <div className="evento-detalle__informacion">
          <div className="evento-detalle__datos">
            <p className="evento-detalle__fecha">
              <span className="evento-detalle__label">Día:</span> 
              {evento.dia?.nombre} - {evento.dia?.fecha && formatearFecha(evento.dia.fecha)}
            </p>
            <p className="evento-detalle__hora">
              <span className="evento-detalle__label">Hora:</span> 
              {evento.hora?.hora}
            </p>
            <p className="evento-detalle__categoria-texto">
              <span className="evento-detalle__label">Categoría:</span> 
              {evento.categoria?.nombre}
            </p>
          </div>
          
          <div className="evento-detalle__descripcion">
            <h2 className="evento-detalle__heading">Sobre este evento:</h2>
            <p className="evento-detalle__texto">{evento.descripcion}</p>
          </div>
          
          <div className="evento-detalle__disponibilidad">
            {evento.disponibles > 0 ? (
              <p className="evento-detalle__disponibles evento-detalle__disponibles--positivo">
                ¡Aún quedan <span>{evento.disponibles}</span> lugares disponibles!
              </p>
            ) : (
              <p className="evento-detalle__disponibles evento-detalle__disponibles--negativo">
                No hay lugares disponibles
              </p>
            )}
          </div>
        </div>
        
        <div className="evento-detalle__ponente">
          {evento.ponente && (
            <div className="evento-detalle__ponente-info">
              <h2 className="evento-detalle__heading">Presentado por:</h2>
              
              <div className="evento-detalle__ponente-card">
                <div className="evento-detalle__ponente-imagen">
                  <img 
                    src={`${import.meta.env.VITE_API_URL || ''}/img/speakers/${evento.ponente?.imagen || 'default_speaker.png'}`}
                    alt={`${evento.ponente.nombre} ${evento.ponente.apellido || ''}`}
                    onError={(e) => {
                      e.target.src = `${import.meta.env.VITE_API_URL || ''}/img/speakers/default_speaker.png`;
                    }}
                  />
                </div>
                <div className="evento-detalle__ponente-contenido">
                  <h3 className="evento-detalle__ponente-nombre">
                    {evento.ponente.nombre} {evento.ponente.apellido || ''}
                  </h3>
                  {evento.ponente.ciudad && evento.ponente.pais && (
                    <p className="evento-detalle__ponente-ubicacion">
                      {evento.ponente.ciudad}, {evento.ponente.pais}
                    </p>
                  )}
                  <Link to={`/ponentes/${evento.ponente.id}`} className="evento-detalle__ponente-enlace">
                    Ver perfil completo
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="evento-detalle__acciones">
        <Link to="/eventos" className="evento-detalle__volver">
          &larr; Volver a Eventos
        </Link>
        
        {evento.disponibles > 0 && (
          <button className="evento-detalle__registrar">
            Reservar mi lugar
          </button>
        )}
      </div>
    </main>
  );
}