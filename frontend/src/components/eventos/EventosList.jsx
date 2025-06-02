import React from 'react';
import EventoCard from './EventoCard';
import { Spinner } from '../ui/Spinner';

export default function EventosList({ eventos, cargando }) {
  if (cargando) return <Spinner />;
  
  if (eventos.length === 0) {
    return (
      <p className="text-center text-gray-600 my-10">
        No hay eventos disponibles en este momento.
      </p>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {eventos.map(evento => (
        <EventoCard 
          key={evento.id}
          evento={evento}
        />
      ))}
    </div>
  );
}