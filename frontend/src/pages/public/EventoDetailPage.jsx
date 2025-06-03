import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Spinner } from '../../components/ui/Spinner';
import { Alerta } from '../../components/ui/Alerta';
import { formatearFecha } from '/src/utils/dateUtils.js';

export default function EventoDetailPage() {
  const { id } = useParams();
  
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  const [eventosSimilares, setEventosSimilares] = useState([]);
  
  useEffect(() => {
    const obtenerEvento = async () => {
      try {
        setCargando(true);
        const data = await api.get(`/eventos/${id}`);
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
  }, [id]);
  
  // Obtener eventos similares
  useEffect(() => {
    const obtenerEventosSimilares = async () => {
      if (evento?.categoria?.id) {
        try {
          // Obtener hasta 3 eventos de la misma categoría, excluyendo el actual
          const data = await api.get(`/eventos`, {
            categoria: evento.categoria.id,
            limite: 3,
            excluir: evento.id
          });
          setEventosSimilares(data);
        } catch (error) {
          console.error("Error al cargar eventos similares:", error);
        }
      }
    };
    
    if (evento) {
      obtenerEventosSimilares();
    }
  }, [evento]);
  
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
      {alerta.mensaje && (
        <Alerta 
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
        />
      )}
      
      {/* Encabezado del evento */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4`}>
              {evento.categoria.nombre}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{evento.nombre}</h1>
          </div>
          
          <div>
            {evento.disponibles > 0 ? (
              <Link 
                to={`/finalizar-registro/conferencia/${evento.id}`}
                className="btn btn-primary py-3 px-6"
              >
                Reservar plaza
              </Link>
            ) : (
              <span className="inline-block px-4 py-3 bg-red-100 text-red-800 font-bold rounded-md">
                Sin plazas disponibles
              </span>
            )}
          </div>
        </div>
      </header>
      
      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Información del evento */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatearFecha(evento.dia.fecha)} - {evento.hora}</span>
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Acerca del evento</h2>
              <p className="text-gray-700 mb-6">{evento.descripcion}</p>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3">Detalles importantes</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Horario: {evento.hora}</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Plazas disponibles: {evento.disponibles}</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Ubicación: Salón {evento.categoria.nombre}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Sidebar con información del ponente */}
        <div>
          {evento.ponente ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Ponente</h2>
              <div className="flex flex-col items-center">
                <img 
                  src={evento.ponente.imagen ? `/img/speakers/${evento.ponente.imagen}` : '/img/speakers/speaker_default.jpg'} 
                  alt={`${evento.ponente.nombre} ${evento.ponente.apellido}`}
                  className="w-32 h-32 object-cover rounded-full mb-4"
                />
                <h3 className="font-bold text-lg">{evento.ponente.nombre} {evento.ponente.apellido}</h3>
                <p className="text-gray-600 mb-3">{evento.ponente.ciudad}, {evento.ponente.pais}</p>
                
                {/* Tags */}
                {evento.ponente.tags && (
                  <div className="mb-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {evento.ponente.tags.split(',').slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <Link 
                  to={`/ponentes/${evento.ponente.id}`}
                  className="text-primary hover:underline font-medium mt-2"
                >
                  Ver perfil completo
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">No hay información del ponente disponible</p>
            </div>
          )}
          
          {/* Eventos similares */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold mb-4">Eventos similares</h2>
            {eventosSimilares.length > 0 ? (
              <div className="space-y-4">
                {eventosSimilares.map(ev => (
                  <div key={ev.id} className="border-b pb-4">
                    <h3 className="font-bold">{ev.nombre}</h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatearFecha(ev.dia.fecha)}</span>
                    </div>
                    <Link 
                      to={`/eventos/${ev.id}`}
                      className="text-primary font-bold hover:underline inline-block mt-1"
                    >
                      Ver evento &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mb-3">No hay eventos similares disponibles.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/eventos"
          className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6"
        >
          &larr; Volver a Eventos
        </Link>
        
        {evento.disponibles > 0 && (
          <Link 
            to={`/finalizar-registro/conferencia/${evento.id}`}
            className="btn btn-primary py-3 px-6"
          >
            Reservar plaza
          </Link>
        )}
      </div>
    </div>
  );
}