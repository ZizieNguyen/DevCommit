import React, { useState, useEffect } from 'react';
import { EventoCard } from '../components/eventos/EventoCard';
import { eventoService } from '../services/eventoService';
import { Button } from '../components/ui/Button';

export const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    categoria: '',
    fecha: '',
    precio: ''
  });
  
  // Cargar eventos y categorías
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Cargar eventos con filtros aplicados
        const queryParams = {};
        if (filtros.categoria) queryParams.categoriaId = filtros.categoria;
        if (filtros.precio === 'gratis') queryParams.gratis = true;
        if (filtros.precio === 'pagados') queryParams.gratis = false;
        if (filtros.fecha) queryParams.fecha = filtros.fecha;
        
        const eventosData = await eventoService.getEventos(queryParams);
        setEventos(eventosData);
        
        // Cargar categorías para los filtros
        const categoriasData = await eventoService.getCategorias();
        setCategorias(categoriasData);
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los eventos. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [filtros]);
  
  // Manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltros({
      categoria: '',
      fecha: '',
      precio: ''
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Próximos Eventos</h1>
      
      {/* Sección de filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold">Filtrar Eventos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
            {/* Filtro de categoría */}
            <select
              name="categoria"
              value={filtros.categoria}
              onChange={handleFiltroChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            
            {/* Filtro de fecha */}
            <select
              name="fecha"
              value={filtros.fecha}
              onChange={handleFiltroChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Cualquier fecha</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>
            
            {/* Filtro de precio */}
            <select
              name="precio"
              value={filtros.precio}
              onChange={handleFiltroChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Cualquier precio</option>
              <option value="gratis">Gratis</option>
              <option value="pagados">Pagados</option>
            </select>
          </div>
          
          <Button variant="outline" size="small" onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        </div>
      </div>
      
      {/* Lista de eventos */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : eventos.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {eventos.map(evento => (
            <div key={evento.id}>
              <EventoCard evento={evento} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-6">No hay eventos disponibles con los filtros seleccionados.</p>
          <Button variant="primary" onClick={limpiarFiltros}>Ver todos los eventos</Button>
        </div>
      )}
    </div>
  );
};