import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaCode, FaUsers, FaMicrophone } from 'react-icons/fa';
import { clienteAxios } from '../config/axios';
import '../styles/inicio.css';

// Componente de Spinner simple
const Spinner = () => (
  <div className="spinner">
    <div className="spinner__contenedor">
      <div className="spinner__circulo"></div>
    </div>
  </div>
);

// Componente EventoCard simple
const EventoCard = ({ evento }) => (
  <div className="evento">
    <div className="evento__contenido">
      <p className="evento__fecha">{evento.dia?.nombre || 'Próximamente'}</p>
      <h3 className="evento__nombre">{evento.nombre}</h3>
      <p className="evento__descripcion">{evento.descripcion}</p>
      <div className="evento__autor">Por: {evento.ponente?.nombre} {evento.ponente?.apellido}</div>
      <p className="evento__categoria">{evento.categoria?.nombre}</p>
      <div className="evento__disponibles">
        <span className="evento__disponibles-cantidad">{evento.disponibles}</span> lugares disponibles
      </div>
      <Link to={`/eventos/${evento.id}`} className="evento__enlace">Ver Detalles</Link>
    </div>
  </div>
);

// Componente PonenteCard simple
const PonenteCard = ({ ponente }) => (
  <div className="ponente">
    <div className="ponente__imagen">
      <picture>
        <source srcSet={`/img/speakers/${ponente.imagen || 'default_speaker'}.webp`} type="image/webp" />
        <source srcSet={`/img/speakers/${ponente.imagen || 'default_speaker'}.png`} type="image/png" />
        <img src={`/img/speakers/${ponente.imagen || 'default_speaker'}.png`} alt={`${ponente.nombre} ${ponente.apellido}`} />
      </picture>
    </div>
    <div className="ponente__contenido">
      <h3 className="ponente__nombre">{ponente.nombre} {ponente.apellido}</h3>
      <p className="ponente__ubicacion">{ponente.ciudad}, {ponente.pais}</p>
      <div className="ponente__tags">{ponente.tags}</div>
      <Link to={`/ponentes/${ponente.id}`} className="ponente__enlace">Ver Perfil</Link>
    </div>
  </div>
);

export default function HomePage() {
  const [eventos, setEventos] = useState([]);
  const [ponentes, setPonentes] = useState([]);
  const [stats, setStats] = useState({
    eventos: 0,
    categorias: 0,
    ponentes: 0,
    asistentes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // 1. Cargar eventos desde la API
        try {
          const { data: eventosData } = await clienteAxios.get('/api/eventos?limite=3');
          
          if (eventosData && Array.isArray(eventosData)) {
            setEventos(eventosData);
          } else {
            console.warn('Formato de respuesta de eventos inesperado:', eventosData);
            setEventos([]);
          }
        } catch (errorEventos) {
          console.error('Error cargando eventos:', errorEventos);
          setEventos([]);
        }
        
        // 2. Cargar ponentes desde la API
        try {
          const { data: ponentesData } = await clienteAxios.get('/api/ponentes?limite=4');
          
          if (ponentesData && Array.isArray(ponentesData)) {
            setPonentes(ponentesData);
          } else {
            console.warn('Formato de respuesta de ponentes inesperado:', ponentesData);
            setPonentes([]);
          }
        } catch (errorPonentes) {
          console.error('Error cargando ponentes:', errorPonentes);
          setPonentes([]);
        }
        
        // 3. Cargar estadísticas
        try {
          const { data: statsData } = await clienteAxios.get('/api/estadisticas');
          
          if (statsData && typeof statsData === 'object') {
            setStats({
              eventos: statsData.total_eventos || 30,
              categorias: statsData.total_categorias || 15,
              ponentes: statsData.total_ponentes || 36,
              asistentes: statsData.total_registros || 500
            });
          } else {
            // Usar valores predeterminados
            setStats({
              eventos: 30,
              categorias: 15,
              ponentes: 36,
              asistentes: 500
            });
          }
        } catch (errorStats) {
          console.error('Error cargando estadísticas:', errorStats);
          setStats({
            eventos: 30,
            categorias: 15,
            ponentes: 36,
            asistentes: 500
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error cargando datos iniciales:', err);
        setError('Hubo un problema al cargar algunos datos. Mostrando información disponible.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  return (
    <>

      {/* Sección Sobre DevCommit */}
      <section className="sobre-devcommit">
        <div className="contenedor">
          <h2 className="titulo">
            &#60;DevCommit&#62; - <span>La Conferencia para Desarrolladores</span>
          </h2>
          
          <div className="sobre-devcommit__grid">
            <div className="sobre-devcommit__imagen">
              <img src="/img/conferencia.jpg" alt="Sobre DevCommit" />
            </div>
            
            <div>
              <p className="sobre-devcommit__texto">
                DevCommit es el evento más importante para desarrolladores web y móvil en España. 
                Reunimos a los mejores expertos del sector para compartir conocimientos, inspirar y crear 
                conexiones valiosas en la comunidad tecnológica europea.
              </p>
              
              <p className="sobre-devcommit__texto">
                Durante dos días intensivos, podrás asistir a conferencias magistrales, talleres prácticos 
                y sesiones de networking que te ayudarán a impulsar tu carrera y mantenerte actualizado con 
                las últimas tendencias del desarrollo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="caracteristicas">
        <div className="contenedor">
          <h2 className="titulo">¿Por qué asistir a <span>DevCommit</span>?</h2>
          
          <div className="caracteristicas__grid">
            <div className="caracteristica">
              <div className="caracteristica__imagen">
                <img src="/img/icono_talleres.png" alt="Icono Talleres" />
              </div>
              <h3 className="caracteristica__titulo">Talleres & Workshops</h3>
              <p>Aprende con talleres prácticos impartidos por expertos en desarrollo que están creando el futuro de la web.</p>
            </div>

            <div className="caracteristica">
              <div className="caracteristica__imagen">
                <img src="/img/icono_conferencias.png" alt="Icono Conferencias" />
              </div>
              <h3 className="caracteristica__titulo">Conferencias</h3>
              <p>Asiste a las conferencias de nuestros expertos internacionales sobre las últimas tendencias en desarrollo.</p>
            </div>

            <div className="caracteristica">
              <div className="caracteristica__imagen">
                <img src="/img/icono_networking.png" alt="Icono Networking" />
              </div>
              <h3 className="caracteristica__titulo">Networking</h3>
              <p>Conoce a otros desarrolladores y expande tu red de contactos en los eventos sociales que organizamos.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Estadísticas */}
      <section className="numeros">
        <div className="contenedor">
          <div className="numeros__grid">
            <div className="numero">
              <FaCalendarAlt className="numero__icono" />
              <p className="numero__cantidad">{stats.eventos}</p>
              <p className="numero__texto">Eventos</p>
            </div>
            <div className="numero">
              <FaCode className="numero__icono" />
              <p className="numero__cantidad">{stats.categorias}</p>
              <p className="numero__texto">Categorías</p>
            </div>
            <div className="numero">
              <FaMicrophone className="numero__icono" />
              <p className="numero__cantidad">{stats.ponentes}</p>
              <p className="numero__texto">Ponentes</p>
            </div>
            <div className="numero">
              <FaUsers className="numero__icono" />
              <p className="numero__cantidad">{stats.asistentes}</p>
              <p className="numero__texto">Asistentes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos destacados */}
      <section id="eventos" className="eventos">
        <div className="contenedor">
          <h2 className="titulo">Próximos <span>Eventos</span></h2>
          <p className="eventos__descripcion">
            Descubre los workshops y conferencias impartidos por expertos que están transformando la industria
          </p>

          {error && (
            <div className="alerta alerta--error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="eventos__spinner">
              <Spinner />
            </div>
          ) : eventos.length > 0 ? (
            <div className="eventos__grid">
              {eventos.map(evento => (
                <EventoCard key={evento.id} evento={evento} />
              ))}
            </div>
          ) : (
            <p className="eventos__no-eventos">
              No hay eventos próximos disponibles en este momento.
            </p>
          )}

          <div className="eventos__enlace">
            <Link to="/eventos" className="boton">
              Ver Todos los Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Ponentes destacados */}
      <section className="ponentes">
        <div className="contenedor">
          <h2 className="titulo">Nuestros <span>Ponentes</span></h2>
          <p className="ponentes__descripcion">
            Conoce a los expertos de la industria que compartirán sus conocimientos en DevCommit
          </p>

          {loading ? (
            <div className="ponentes__spinner">
              <Spinner />
            </div>
          ) : ponentes.length > 0 ? (
            <div className="ponentes__grid">
              {ponentes.map(ponente => (
                <PonenteCard key={ponente.id} ponente={ponente} />
              ))}
            </div>
          ) : (
            <p className="ponentes__no-ponentes">
              No hay ponentes disponibles en este momento.
            </p>
          )}

          <div className="ponentes__enlace">
            <Link to="/ponentes" className="boton">
              Ver Todos los Ponentes
            </Link>
          </div>
        </div>
      </section>

      {/* Boletos */}
      <section className="boletos">
        <div className="contenedor">
          <h2 className="titulo titulo--blanco">
            Boletos & Precios
          </h2>
          <p className="boletos__descripcion texto-blanco">
            Precios para DevCommit - Disponibles por tiempo limitado
          </p>
          
          <div className="boletos__grid">
            <div className="boleto boleto--presencial">
              <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
              <p className="boleto__plan">Presencial</p>
              <p className="boleto__precio">€99</p>
              <div className="boleto__enlace-contenedor">
                <Link to="/registro" className="boleto__enlace">
                  Comprar Pase
                </Link>
              </div>
            </div>

            <div className="boleto boleto--virtual">
              <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
              <p className="boleto__plan">Virtual</p>
              <p className="boleto__precio">€49</p>
              <div className="boleto__enlace-contenedor">
                <Link to="/registro" className="boleto__enlace">
                  Comprar Pase
                </Link>
              </div>
            </div>

            <div className="boleto boleto--gratis">
              <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
              <p className="boleto__plan">Gratis</p>
              <p className="boleto__precio">Gratis - €0</p>
              <div className="boleto__enlace-contenedor">
                <Link to="/registro" className="boleto__enlace">
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa del evento */}
      <section className="mapa">
        <h2 className="mapa__titulo">
          Ubicación del <span>Evento</span>
        </h2>
        
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12159.055672171031!2d-3.7027189887493075!3d40.41679334470141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287d6da3df9f%3A0x5a3c45114b3a75f7!2sPuerta%20del%20Sol%2C%20Madrid!5e0!3m2!1ses!2ses!4v1654547597540!5m2!1ses!2ses" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          title="Ubicación del evento"
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </section>

      
    </>
  );
}