import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventoCard } from "../../components/eventos/EventoCard";
import { PonenteCard } from "../../components/ponentes/PonenteCard";
import { eventoService } from "../../services/eventoService";
import { api } from "../../services/api";
import { Spinner } from "../../components/ui/Spinner";

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
        
        // Usando el servicio de eventos para eventos destacados
        const respuestaEventos = await eventoService.getEventosDestacados(3);
        setEventosDestacados(respuestaEventos.eventos || []);
        
        // Obtener ponentes destacados (los primeros 4)
        const respuestaPonentes = await api.get('/ponentes', { limite: 4 });
        setPonentes(respuestaPonentes.ponentes || []);
        
        // Obtener estadísticas
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
      {/* Hero Section - Video */}
      <section className="w-full h-[50rem] relative">
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video/video.mp4" type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>

        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white px-4">
          <h2 className="text-5xl sm:text-6xl font-black mb-4 text-center">
            &#60;Dev<span className="text-primary">Commit</span>&#62; 2023
          </h2>
          <p className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            Octubre 5-6 - Ciudad de México
          </p>
          <Link 
            to="/registro" 
            className="bg-secondary hover:bg-secondary-dark transition-colors text-white text-xl font-bold px-10 py-4 uppercase rounded-md"
          >
            Comprar Pase
          </Link>
        </div>
      </section>

      {/* Sección de características */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-14">
            <span className="text-primary">DevCommit</span> - La Conferencia para Desarrolladores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <img 
                src="/img/icono_talleres.png" 
                alt="Talleres" 
                className="h-28 w-28 mb-5"
              />
              <h3 className="text-2xl font-bold uppercase mb-3">Talleres & Workshops</h3>
              <p className="text-lg">Aprende con talleres prácticos impartidos por expertos en desarrollo que están creando el futuro de la web.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <img 
                src="/img/icono_conferencias.png" 
                alt="Conferencias" 
                className="h-28 w-28 mb-5"
              />
              <h3 className="text-2xl font-bold uppercase mb-3">Conferencias</h3>
              <p className="text-lg">Asiste a las conferencias de nuestros expertos internacionales sobre las últimas tendencias en desarrollo.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <img 
                src="/img/icono_networking.png" 
                alt="Networking" 
                className="h-28 w-28 mb-5"
              />
              <h3 className="text-2xl font-bold uppercase mb-3">Networking</h3>
              <p className="text-lg">Conoce a otros desarrolladores y expande tu red de contactos en los eventos sociales que organizamos.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Estadísticas */}
      <section className="py-14 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <p className="text-5xl sm:text-6xl text-white font-black">{stats.eventos || 0}</p>
              <p className="text-xl text-white uppercase">Eventos</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-5xl sm:text-6xl text-white font-black">{stats.categorias || 0}</p>
              <p className="text-xl text-white uppercase">Categorías</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-5xl sm:text-6xl text-white font-black">{stats.ponentes || 0}</p>
              <p className="text-xl text-white uppercase">Ponentes</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-5xl sm:text-6xl text-white font-black">{stats.asistentes || 0}</p>
              <p className="text-xl text-white uppercase">Asistentes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos destacados */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-4">
            Próximos <span className="text-primary">Eventos</span>
          </h2>
          <p className="text-xl text-center max-w-3xl mx-auto mb-14">
            Descubre los workshops y conferencias impartidos por expertos que están transformando la industria
          </p>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center mb-8">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : eventosDestacados.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventosDestacados.map(evento => (
                <EventoCard 
                  key={evento.id} 
                  evento={evento} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              No hay eventos próximos disponibles en este momento.
            </p>
          )}

          <div className="mt-12 text-center">
            <Link 
              to="/eventos" 
              className="inline-block bg-primary hover:bg-primary-dark transition-colors text-white text-xl font-bold px-10 py-3 uppercase rounded"
            >
              Ver Todos los Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Ponentes destacados */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-4">
            Nuestros <span className="text-primary">Ponentes</span>
          </h2>
          <p className="text-xl text-center max-w-3xl mx-auto mb-14">
            Conoce a los expertos de la industria que compartirán sus conocimientos en DevCommit
          </p>

          {loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : ponentes.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {ponentes.map(ponente => (
                <PonenteCard 
                  key={ponente.id} 
                  ponente={ponente} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              No hay ponentes disponibles en este momento.
            </p>
          )}

          <div className="mt-12 text-center">
            <Link 
              to="/ponentes" 
              className="inline-block bg-primary hover:bg-primary-dark transition-colors text-white text-xl font-bold px-10 py-3 uppercase rounded"
            >
              Ver Todos los Ponentes
            </Link>
          </div>
        </div>
      </section>

      {/* Mapa del evento */}
      <section className="h-[40rem] relative">
        <h2 className="text-4xl font-black text-center py-10 bg-gray-50">
          Ubicación del <span className="text-primary">Evento</span>
        </h2>
        
        <div className="absolute inset-0 z-0" style={{ marginTop: '5rem' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15050.027596382851!2d-99.16869049236784!3d19.427023619959393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5bd1563%3A0x6c366f0e2de02ff7!2sEl%20%C3%81ngel%20de%20la%20Independencia!5e0!3m2!1ses-419!2smx!4v1654547597540!5m2!1ses-419!2smx" 
            className="w-full h-full border-0" 
            allowFullScreen 
            loading="lazy" 
            title="Ubicación del evento"
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </section>

      {/* Llamada a la acción */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-white text-3xl md:text-4xl font-black mb-4">
            Precios especiales por tiempo limitado
          </h2>
          <p className="text-center text-white text-xl max-w-2xl mx-auto mb-10">
            Los precios suben conforme se acerca el evento. ¡No te quedes sin tu boleto para DevCommit 2023!
          </p>
          <div className="text-center">
            <Link 
              to="/paquetes" 
              className="inline-block bg-secondary hover:bg-secondary-dark transition-colors text-white text-xl font-bold px-10 py-3 uppercase rounded"
            >
              Ver Paquetes Disponibles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;