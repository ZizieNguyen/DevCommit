import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth'; 
import { Button } from '../components/ui/Button'; 
import { eventoService } from '../services/eventoService';

export const PerfilPage = () => {
  const { user } = useAuth();
  const [misEventos, setMisEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const cargarMisEventos = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Aquí suponemos que hay un endpoint para obtener los eventos del usuario actual
        const eventos = await eventoService.getEventosUsuario();
        setMisEventos(eventos);
      } catch (err) {
        console.error('Error al cargar eventos del usuario:', err);
        setError('No se pudieron cargar tus eventos');
      } finally {
        setLoading(false);
      }
    };
    
    cargarMisEventos();
  }, [user]);
  
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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      
      {user && (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Columna de información personal */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Información personal</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{user.nombre}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <Button variant="outline" className="mt-4 w-full">
                  Editar perfil
                </Button>
              </div>
            </div>
          </div>
          
          {/* Columna de eventos */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Mis eventos</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-6 text-red-500">{error}</div>
              ) : misEventos.length > 0 ? (
                <div className="space-y-4">
                  {misEventos.map(evento => (
                    <div key={evento.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{evento.nombre}</h3>
                          <p className="text-sm text-gray-600">{formatearFecha(evento.fecha)}</p>
                          {evento.ponente && (
                            <p className="text-sm text-gray-500">
                              Ponente: {evento.ponente.nombre}
                            </p>
                          )}
                        </div>
                        <Button variant="outline" size="small">Ver detalles</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded text-center">
                  <p className="text-gray-500 mb-4">No estás inscrito a ningún evento todavía.</p>
                  <Button variant="primary" className="mt-2" as="a" href="/eventos">
                    Explorar eventos
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};