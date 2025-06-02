import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Spinner } from '../../components/ui/Spinner';
import { Alerta } from '../../components/ui/Alerta';
import { formatFecha } from '../../utils/formatters';

export default function PonenteDetailPage() {
  const { id } = useParams();
  
  const [ponente, setPonente] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);
        
        // Obtener datos del ponente
        const data = await api.get(`/ponentes/${id}`);
        setPonente(data);
        
        // Obtener eventos relacionados con el ponente
        const eventosData = await api.get(`/eventos`, { ponente: id });
        setEventos(eventosData);
        
        setAlerta({});
      } catch (error) {
        console.error(error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error al cargar la información del ponente'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerDatos();
  }, [id]);
  
  if (cargando) return <Spinner />;
  
  if (!ponente) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alerta 
          mensaje="Ponente no encontrado"
          tipo="error"
        />
        <div className="text-center mt-6">
          <Link
            to="/ponentes"
            className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Volver a Ponentes
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
      
      {/* Perfil del ponente */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img 
              src={ponente.imagen ? `/img/speakers/${ponente.imagen}` : '/img/speakers/speaker_default.jpg'} 
              alt={`${ponente.nombre} ${ponente.apellido}`}
              className="h-64 w-full object-cover md:w-64 md:h-auto"
            />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {ponente.nombre} {ponente.apellido}
                </h1>
                <p className="text-gray-600 mb-4">{ponente.ciudad}, {ponente.pais}</p>
              </div>
              <Link 
                to="/ponentes" 
                className="text-primary hover:underline text-sm"
              >
                &larr; Volver
              </Link>
            </div>
            
            {ponente.tags && (
              <div className="mb-6">
                <h3 className="text-gray-700 font-medium mb-2">Especialidades:</h3>
                <div className="flex flex-wrap gap-2">
                  {ponente.tags.split(',').map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-gray-700 font-medium mb-2">Biografía:</h3>
              <p className="text-gray-600">
                {ponente.biografia || "No hay información biográfica disponible para este ponente."}
              </p>
            </div>
            
            {ponente.redes && Object.values(ponente.redes).some(red => red) && (
              <div className="mt-6">
                <h3 className="text-gray-700 font-medium mb-2">Redes Sociales:</h3>
                <div className="flex gap-4">
                  {ponente.redes.facebook && (
                    <a 
                      href={`https://facebook.com/${ponente.redes.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Facebook
                    </a>
                  )}
                  {ponente.redes.twitter && (
                    <a 
                      href={`https://twitter.com/${ponente.redes.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600"
                    >
                      Twitter
                    </a>
                  )}
                  {ponente.redes.youtube && (
                    <a 
                      href={`https://youtube.com/${ponente.redes.youtube}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-800"
                    >
                      YouTube
                    </a>
                  )}
                  {ponente.redes.instagram && (
                    <a 
                      href={`https://instagram.com/${ponente.redes.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800"
                    >
                      Instagram
                    </a>
                  )}
                  {ponente.redes.tiktok && (
                    <a 
                      href={`https://tiktok.com/@${ponente.redes.tiktok}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-800"
                    >
                      TikTok
                    </a>
                  )}
                  {ponente.redes.github && (
                    <a 
                      href={`https://github.com/${ponente.redes.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-black"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Eventos del ponente */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Eventos con {ponente.nombre}</h2>
        
        {eventos.length === 0 ? (
          <p className="text-gray-600">
            Este ponente no tiene eventos programados actualmente.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map(evento => (
              <div 
                key={evento.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`bg-primary h-2 w-full`}></div>
                <div className="p-6">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3`}>
                    {evento.categoria.nombre}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{evento.nombre}</h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {formatFecha(evento.dia.fecha)} - {evento.hora}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {evento.descripcion}
                  </p>
                  
                  {/* Plazas disponibles */}
                  <div className="mb-4">
                    {evento.disponibles > 0 ? (
                      <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        {evento.disponibles} plazas disponibles
                      </span>
                    ) : (
                      <span className="text-sm text-red-700 bg-red-100 px-2 py-1 rounded-full">
                        Sin plazas disponibles
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/eventos/${evento.id}`}
                    className="text-primary font-bold hover:underline"
                  >
                    Ver detalles &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}