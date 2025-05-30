import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventoCard } from '../components/eventos/EventoCard';
import { Button } from '../components/ui/Button';
import { eventoService } from '../services/eventoService';
import { EventoCardSkeleton } from '../components/ui/EsqueletosCarga';

export const HomePage = () => {
  const [eventosDestacados, setEventosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const cargarEventosDestacados = async () => {
      try {
        setLoading(true);
        // Cargar solo eventos destacados o próximos
        const eventos = await eventoService.getEventos({ destacados: true, limite: 4 });
        setEventosDestacados(eventos);
        setError(null);
      } catch (err) {
        console.error('Error al cargar eventos destacados:', err);
        setError('No se pudieron cargar los eventos destacados');
      } finally {
        setLoading(false);
      }
    };
    
    cargarEventosDestacados();
  }, []);
  
  return (
    <>
      {/* Hero section */}
      <section className="bg-gradient-to-br from-gray-dark to-gray-darker text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Descubre los mejores eventos de desarrollo
            </h1>
            <p className="text-xl mb-10 text-gray-200">
              Conecta con expertos, adquiere nuevos conocimientos y mejora tus habilidades 
              asistiendo a nuestros eventos de tecnología y programación.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/eventos">
                <Button variant="primary" size="large">Ver eventos</Button>
              </Link>
              <Link to="/registro">
                <Button variant="outline" size="large">Crear cuenta</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Eventos destacados */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Eventos destacados</h2>
          <Link to="/eventos" className="text-primary font-medium hover:underline">
            Ver todos los eventos
          </Link>
        </div>
        
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <EventoCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : eventosDestacados.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventosDestacados.map(evento => (
              <div key={evento.id}>
                <EventoCard evento={evento} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No hay eventos destacados disponibles en este momento.
          </div>
        )}
      </section>
      
      {/* Sección de características */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué asistir a nuestros eventos?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Característica 1 */}
            <div className="text-center p-6">
              <div className="bg-primary/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Networking de calidad</h3>
              <p className="text-gray-600">Conecta con profesionales y expertos de la industria tecnológica.</p>
            </div>
            
            {/* Característica 2 */}
            <div className="text-center p-6">
              <div className="bg-secondary/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Contenido actualizado</h3>
              <p className="text-gray-600">Mantente al día con las últimas tendencias y tecnologías.</p>
            </div>
            
            {/* Característica 3 */}
            <div className="text-center p-6">
              <div className="bg-accent/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Talleres prácticos</h3>
              <p className="text-gray-600">Aprende con ejercicios prácticos y mejora tus habilidades.</p>
            </div>
            
            {/* Característica 4 */}
            <div className="text-center p-6">
              <div className="bg-categoria-5/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-categoria-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Certificaciones</h3>
              <p className="text-gray-600">Obtén certificados que respalden tus conocimientos adquiridos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de testimonios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros asistentes</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonio 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-bold">Ana García</h4>
                  <p className="text-gray-600 text-sm">Frontend Developer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Los eventos de DevCommit son increíbles. La calidad de los ponentes y el contenido práctico me ha ayudado a mejorar mis habilidades como desarrolladora."
              </p>
            </div>
            
            {/* Testimonio 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-bold">Carlos Mendoza</h4>
                  <p className="text-gray-600 text-sm">Backend Engineer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Gracias a los workshops de DevCommit pude actualizar mis conocimientos en arquitectura de software y mejorar mis proyectos."
              </p>
            </div>
            
            {/* Testimonio 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-bold">Laura Jiménez</h4>
                  <p className="text-gray-600 text-sm">UX/UI Designer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Los eventos están super bien organizados y el networking es de gran valor. He conseguido colaboraciones profesionales gracias a DevCommit."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">¿Eres organizador de eventos?</h2>
            <p className="text-xl mb-8 text-gray-700">
              Publica tus eventos de tecnología y desarrollo en nuestra plataforma
              y llega a miles de profesionales interesados.
            </p>
            <Button variant="primary" size="large" as="a" href="mailto:info@devcommit.com">
              Contáctanos
            </Button>
          </div>
        </div>
      </section>

      {/* Solo mostrar ApiTester en desarrollo */}
      {import.meta.env.DEV && (
        <div className="container mx-auto px-4 py-10">
          <h2 className="text-xl font-bold mb-4">Herramientas de desarrollo</h2>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-4">Tester de conexión API</h3>
            <Button variant="primary" onClick={() => {}}>
              Probar conexión
            </Button>
          </div>
        </div>
      )}
    </>
  );
};