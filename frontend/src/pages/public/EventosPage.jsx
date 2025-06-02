import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Spinner } from '../../components/ui/Spinner';
import { Alerta } from '../../components/ui/Alerta';

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);
        
        // Obtener categorías
        const categoriasData = await api.get('/categorias');
        setCategorias(categoriasData);
        
        // Obtener eventos
        const eventosData = await api.get('/eventos', {
          ...(categoriaSeleccionada && { categoria: categoriaSeleccionada })
        });
        
        setEventos(eventosData);
        setAlerta({});
      } catch (error) {
        console.error(error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error al cargar los eventos'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerDatos();
  }, [categoriaSeleccionada]);
  
  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };
  
  if (cargando) return <Spinner />;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Eventos</h1>
      
      {alerta.mensaje && (
        <Alerta 
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
        />
      )}
      
      {/* Filtro por categorías */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por categoría
          </label>
          <select
            id="categoria"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={categoriaSeleccionada}
            onChange={handleCategoriaChange}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Listado de eventos */}
      {eventos.length === 0 ? (
        <p className="text-center text-gray-600">
          No se encontraron eventos{categoriaSeleccionada ? ' para esta categoría' : ''}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map(evento => (
            <div 
              key={evento.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`bg-primary h-2 w-full`}></div>
              <div className="p-6">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3`}>
                  {evento.categoria.nombre}
                </span>
                <h3 className="text-xl font-bold mb-2">{evento.nombre}</h3>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {new Date(evento.dia.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric'
                    })} - {evento.hora}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {evento.descripcion}
                </p>
                
                {/* Plazas disponibles */}
                <div className="mb-4">
                  {evento.disponibles > 0 ? (
                    <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      {evento.disponibles} plazas disponibles
                    </span>
                  ) : (
                    <span className="text-sm text-red-700 bg-red-100 px-2 py-1 rounded-full">
                      Sin plazas disponibles
                    </span>
                  )}
                </div>
                
                <a href={`/eventos/${evento.id}`} className="text-primary font-bold hover:underline">
                  Ver detalles &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}