import React, { useEffect, useState } from 'react';
import { ponenteService } from '../services/ponenteService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const PonentesPage = () => {
  const [ponentes, setPonentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const cargarPonentes = async () => {
      try {
        setLoading(true);
        const data = await ponenteService.getPonentes();
        setPonentes(data);
      } catch (err) {
        console.error('Error al cargar ponentes:', err);
        setError('No se pudieron cargar los ponentes. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarPonentes();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Nuestros Ponentes</h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-4xl mx-auto">
        Conoce a los profesionales que comparten su conocimiento y experiencia en nuestros eventos.
        Expertos en diferentes tecnologías y áreas de desarrollo.
      </p>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : ponentes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {ponentes.map(ponente => (
            <Card key={ponente.id} hover className="overflow-hidden flex flex-col">
              {/* Imagen */}
              {ponente.imagen ? (
                <img 
                  src={ponente.imagen} 
                  alt={ponente.nombre} 
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <svg className="h-24 w-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Info */}
              <div className="p-6 flex flex-col flex-grow text-center">
                <h2 className="text-xl font-bold mb-2">{ponente.nombre}</h2>
                <p className="text-gray-600 mb-4">{ponente.especialidad || 'Desarrollador'}</p>
                <div className="mt-auto">
                  <Button variant="outline" fullWidth>Ver perfil</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay ponentes disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};