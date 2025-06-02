import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard({ stats }) {
  const { eventos, ponentes, usuarios } = stats || {
    eventos: 0,
    ponentes: 0,
    usuarios: 0
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Card de Eventos */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Eventos</p>
            <p className="text-3xl font-bold">{eventos}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <Link to="/admin/eventos" className="block mt-4 text-primary font-medium">
          Ver todos los eventos →
        </Link>
      </div>
      
      {/* Card de Ponentes */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Ponentes</p>
            <p className="text-3xl font-bold">{ponentes}</p>
          </div>
          <div className="p-3 bg-secondary/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <Link to="/admin/ponentes" className="block mt-4 text-secondary font-medium">
          Ver todos los ponentes →
        </Link>
      </div>
      
      {/* Card de Usuarios */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Registros</p>
            <p className="text-3xl font-bold">{usuarios}</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <Link to="/admin/registros" className="block mt-4 text-accent font-medium">
          Ver todos los registros →
        </Link>
      </div>
    </div>
  );
}