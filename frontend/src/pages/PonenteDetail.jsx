import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clienteAxios } from '../config/axios';
import Spinner from '../components/Spinner';
import Alerta from '../components/alertas/Alerta';
import '../styles/ponente-detail.css';

// Función para formatear fecha
const formatearFecha = fecha => {
  const fechaNueva = new Date(fecha);
  const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return fechaNueva.toLocaleDateString('es-ES', opciones);
};

export default function PonenteDetail() {
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
        const { data: ponenteData } = await clienteAxios(`/ponentes/${id}`);
        setPonente(ponenteData);
        
        // Obtener eventos relacionados con el ponente
        const { data: eventosData } = await clienteAxios('/eventos', { 
          params: { ponente: id } 
        });
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
      <div className="ponente-no-encontrado">
        <Alerta 
          tipo="error"
          mensaje="Ponente no encontrado"
        />
        <div className="ponente-no-encontrado__accion">
          <Link
            to="/ponentes"
            className="ponente-no-encontrado__enlace"
          >
            Volver a Ponentes
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <main className="ponente-detalle">
      {alerta.mensaje && (
        <Alerta 
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}
      
      {/* Perfil del ponente */}
      <div className="ponente-card">
        <div className="ponente-card__contenido">
          <div className="ponente-card__imagen">
            <img 
              src={`/img/speakers/default_speaker.jpg`} // Imagen por defecto como primera opción
              alt={`${ponente.nombre} ${ponente.apellido}`}
              onLoad={(e) => {
                // Si la imagen por defecto cargó bien, intentar cargar la imagen real del ponente
                if (ponente.imagen && ponente.imagen !== 'default_speaker') {
                  // Solo cambiar la imagen si existe una específica para este ponente
                  const imgReal = new Image();
                  imgReal.onload = () => {
                    e.target.src = imgReal.src;
                  };
                  // No establecer onError para la imagen real para evitar bucles
                  imgReal.src = `${import.meta.env.VITE_API_URL || ''}/img/speakers/${ponente.imagen}.png`;
                }
              }}
            />
          </div>
          <div className="ponente-card__info">
            <div className="ponente-card__header">
              <div>
                <h1 className="ponente-card__nombre">
                  {ponente.nombre} {ponente.apellido}
                </h1>
                <p className="ponente-card__ubicacion">{ponente.ciudad}, {ponente.pais}</p>
              </div>
              <Link 
                to="/ponentes" 
                className="ponente-card__volver"
              >
                &larr; Volver
              </Link>
            </div>
            
            {ponente.tags && (
              <div className="ponente-card__especialidades">
                <h3 className="ponente-card__subtitulo">Especialidades:</h3>
                <div className="ponente-card__tags">
                  {ponente.tags.split(',').map((tag, index) => (
                    <span 
                      key={index}
                      className="ponente-card__tag"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="ponente-card__biografia">
              <h3 className="ponente-card__subtitulo">Biografía:</h3>
              <p className="ponente-card__texto">
                {ponente.biografia || "No hay información biográfica disponible para este ponente."}
              </p>
            </div>
            
            {ponente.redes && Object.values(ponente.redes).some(red => red) && (
              <div className="ponente-card__redes">
                <h3 className="ponente-card__subtitulo">Redes Sociales:</h3>
                <div className="ponente-card__enlaces">
                  {ponente.redes.facebook && (
                    <a 
                      href={`https://facebook.com/${ponente.redes.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--facebook"
                    >
                      Facebook
                    </a>
                  )}
                  {ponente.redes.twitter && (
                    <a 
                      href={`https://twitter.com/${ponente.redes.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--twitter"
                    >
                      Twitter
                    </a>
                  )}
                  {ponente.redes.youtube && (
                    <a 
                      href={`https://youtube.com/${ponente.redes.youtube}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--youtube"
                    >
                      YouTube
                    </a>
                  )}
                  {ponente.redes.instagram && (
                    <a 
                      href={`https://instagram.com/${ponente.redes.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--instagram"
                    >
                      Instagram
                    </a>
                  )}
                  {ponente.redes.tiktok && (
                    <a 
                      href={`https://tiktok.com/@${ponente.redes.tiktok}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--tiktok"
                    >
                      TikTok
                    </a>
                  )}
                  {ponente.redes.github && (
                    <a 
                      href={`https://github.com/${ponente.redes.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--github"
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
      <div className="eventos-ponente">
        <h2 className="eventos-ponente__heading">Eventos con {ponente.nombre}</h2>
        
        {eventos.length === 0 ? (
          <p className="eventos-ponente__no-eventos">
            Este ponente no tiene eventos programados actualmente.
          </p>
        ) : (
          <div className="eventos-ponente__grid">
            {eventos.map(evento => (
              <div 
                key={evento.id}
                className="evento-card"
              >
                <div className={`evento-card__categoria evento-card__categoria--${evento.categoria_id}`}></div>
                <div className="evento-card__contenido">
                  <span className="evento-card__tipo">
                    {evento.categoria?.nombre}
                  </span>
                  <h3 className="evento-card__nombre">{evento.nombre}</h3>
                  
                  <div className="evento-card__fecha">
                    <span>
                      {evento.dia?.fecha && formatearFecha(evento.dia.fecha)} - {evento.hora?.hora}
                    </span>
                  </div>
                  
                  <p className="evento-card__descripcion">
                    {evento.descripcion}
                  </p>
                  
                  {/* Plazas disponibles */}
                  <div className="evento-card__disponibles">
                    {evento.disponibles > 0 ? (
                      <span className="evento-card__disponibles--positivo">
                        {evento.disponibles} plazas disponibles
                      </span>
                    ) : (
                      <span className="evento-card__disponibles--negativo">
                        Sin plazas disponibles
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/eventos/${evento.id}`}
                    className="evento-card__enlace"
                  >
                    Ver detalles &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}