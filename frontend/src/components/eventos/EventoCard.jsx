import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const EventoCard = ({ evento }) => {
  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha por confirmar';
    
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(fecha);
  };
  
  return (
    <Card hover className="h-full flex flex-col">
      {/* Imagen */}
      {evento.imagen ? (
        <img 
          src={evento.imagen}
          alt={evento.nombre}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Sin imagen</span>
        </div>
      )}
      
      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={`categoria-${evento.categoriaId || 1}`}>
            {evento.categoria?.nombre || 'General'}
          </Badge>
          <span className="text-sm text-gray-500">{formatearFecha(evento.fecha)}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{evento.nombre}</h3>
        
        {evento.ponente && (
          <p className="text-gray-600 mb-4">
            Por: <span className="font-medium">{evento.ponente.nombre}</span>
          </p>
        )}
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {evento.descripcion}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className={`font-bold ${evento.precio > 0 ? 'text-gray-800' : 'text-green-600'}`}>
            {evento.precio > 0 ? `$${evento.precio.toFixed(2)}` : 'Gratuito'}
          </span>
          <Link to={`/eventos/${evento.id}`}>
            <Button variant="outline" size="small">Ver detalles</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};