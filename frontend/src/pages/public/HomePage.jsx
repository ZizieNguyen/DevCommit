import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventoCard } from "../../components/eventos/EventoCard";
import { PonenteCard } from "../../components/ponentes/PonenteCard";
import { eventoService } from "../../services/eventoService";
import { api } from "../../services/api";
import { Spinner } from "../../components/ui/Spinner";
import { FaCalendarAlt, FaCode, FaUsers, FaMicrophone, FaLaptopCode, FaUserFriends } from 'react-icons/fa';

export const HomePage = () => {
  const [eventosDestacados, setEventosDestacados] = useState([]);
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
        
        const respuestaEventos = await eventoService.getEventosDestacados(3);
        setEventosDestacados(respuestaEventos.eventos || []);
        
        const respuestaPonentes = await api.get('/ponentes', { limite: 4 });
        setPonentes(respuestaPonentes.ponentes || []);
        
        const respuestaStats = await api.get('/registros/estadisticas');
        setStats(respuestaStats.estadisticas || {
          eventos: 54,
          categorias: 15,
          ponentes: 36,
          asistentes: 500
        });
        
        setError(null);
      } catch (err) {
        console.error('Error cargando datos iniciales:', err);
        setError('Hubo un problema al cargar los datos. Por favor, intenta más tarde.');
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
          <h2 className="titulo titulo--light">
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
                {/* Opción 1: Imagen */}
                <img src="/img/icono_talleres.png" alt="Icono Talleres" />
                
                {/* Opción 2: Icono de React Icons */}
                {/* <FaLaptopCode size={80} className="text-primary" /> */}
              </div>
              <h3 className="caracteristica__titulo">Talleres & Workshops</h3>
              <p>Aprende con talleres prácticos impartidos por expertos en desarrollo que están creando el futuro de la web.</p>
            </div>

            <div className="caracteristica">
              <div className="caracteristica__imagen">
                {/* Opción 1: Imagen */}
                <img src="/img/icono_conferencias.png" alt="Icono Conferencias" />
                
                {/* Opción 2: Icono de React Icons */}
                {/* <FaMicrophone size={80} className="text-primary" /> */}
              </div>
              <h3 className="caracteristica__titulo">Conferencias</h3>
              <p>Asiste a las conferencias de nuestros expertos internacionales sobre las últimas tendencias en desarrollo.</p>
            </div>

            <div className="caracteristica">
              <div className="caracteristica__imagen">
                {/* Opción 1: Imagen */}
                <img src="/img/icono_networking.png" alt="Icono Networking" />
                
                {/* Opción 2: Icono de React Icons */}
                {/* <FaUserFriends size={80} className="text-primary" /> */}
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
      <section className="eventos">
        <div className="contenedor">
          <h2 className="titulo">Próximos <span>Eventos</span></h2>
          <p className="descripcion-pagina">
            Descubre los workshops y conferencias impartidos por expertos que están transformando la industria
          </p>

          {error && (
            <div className="alerta alerta--error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="texto-center mb-5">
              <Spinner />
            </div>
          ) : eventosDestacados.length > 0 ? (
            <div className="eventos__grid">
              {eventosDestacados.map(evento => (
                <div key={evento.id} className="evento-card">
                  <EventoCard evento={evento} />
                </div>
              ))}
            </div>
          ) : (
            <p className="texto-center">
              No hay eventos próximos disponibles en este momento.
            </p>
          )}

          <div className="texto-center mt-5">
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
          <p className="descripcion-pagina">
            Conoce a los expertos de la industria que compartirán sus conocimientos en DevCommit
          </p>

          {loading ? (
            <div className="texto-center mb-5">
              <Spinner />
            </div>
          ) : ponentes.length > 0 ? (
            <div className="ponentes__grid">
              {ponentes.map(ponente => (
                <div key={ponente.id} className="ponente-card">
                  <PonenteCard ponente={ponente} />
                </div>
              ))}
            </div>
          ) : (
            <p className="texto-center">
              No hay ponentes disponibles en este momento.
            </p>
          )}

          <div className="texto-center mt-5">
            <Link to="/ponentes" className="boton">
              Ver Todos los Ponentes
            </Link>
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

      {/* Boletos */}
      <section className="boletos">
        <div className="contenedor">
          <h2 className="titulo titulo--blanco">
            Boletos & Precios
          </h2>
          <p className="descripcion-pagina texto-white">
            Precios para DevCommit - Disponibles por tiempo limitado
          </p>
          
          <div className="boletos__grid">
            <div className="boleto boleto--presencial">
              <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
              <p className="boleto__plan">Presencial</p>
              <p className="boleto__precio">€199</p>
              <div className="texto-center">
                <Link to="/paquetes" className="boton">
                  Comprar Pase
                </Link>
              </div>
            </div>

            <div className="boleto boleto--virtual">
              <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
              <p className="boleto__plan">Virtual</p>
              <p className="boleto__precio">€49</p>
              <div className="texto-center">
                <Link to="/paquetes" className="boton">
                  Comprar Pase
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;