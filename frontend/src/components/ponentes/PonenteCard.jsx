import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';

export const PonenteCard = ({ ponente }) => {
  return (
    <Card hover className="h-full flex flex-col text-center">
      {/* Imagen */}
      {ponente.imagen ? (
        <img 
          src={ponente.imagen}
          alt={ponente.nombre}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
          <span className="text-gray-500">Sin imagen</span>
        </div>
      )}
      
      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{ponente.nombre}</h3>
        
        <p className="text-gray-600 mb-4">
          {ponente.especialidad || 'Especialista en tecnología'}
        </p>
        
        <div className="mt-auto">
          <Link to={`/ponentes/${ponente.id}`} className="text-primary hover:underline">
            Ver perfil completo
          </Link>
        </div>
      </div>
    </Card>
  );
};