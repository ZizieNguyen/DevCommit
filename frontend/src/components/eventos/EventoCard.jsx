import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';

export const EventoCard = ({ evento }) => {
  const { id, nombre, descripcion, imagen, categoria, fecha, ponente, disponibles } = evento;

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha por confirmar';
    
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(fecha);
  };
  
  // Formatear hora
  const formatearHora = (fechaStr) => {
    if (!fechaStr) return '';
    
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <img 
          src={imagen || '/img/eventos/default.jpg'} 
          alt={nombre}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge categoria={categoria} />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{nombre}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{descripcion}</p>
        
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <p className="text-sm">{ponente?.nombre || 'Ponente por confirmar'}</p>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <p className="text-sm">{formatearFecha(fecha)}</p>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">{formatearHora(fecha)}</p>
        </div>
        
        {disponibles !== undefined && (
          <div className="flex items-center gap-2 text-gray-600 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-sm">{disponibles} Disponibles</p>
          </div>
        )}
        
        <Link 
          to={`/eventos/${id}`} 
          className="block w-full text-center bg-primary hover:bg-primary-dark transition-colors text-white py-2 font-bold rounded mt-6"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};