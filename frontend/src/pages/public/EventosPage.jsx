import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Paginacion } from '../../components/ui/Paginacion';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const LIMITE_POR_PAGINA = 9; // Ajusta según necesites
  
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        
        // Cargar categorías (sin paginación)
        const resCategorias = await api.get('/categorias');
        setCategorias(resCategorias);
        
        // Cargar eventos con paginación
        const params = new URLSearchParams({
          pagina,
          limite: LIMITE_POR_PAGINA
        });
        
        if (categoriaSeleccionada) {
          params.append('categoria', categoriaSeleccionada);
        }
        
        const resEventos = await api.get(`/eventos?${params.toString()}`);
        
        setEventos(resEventos.eventos);
        setTotalPaginas(resEventos.paginacion.totalPaginas);
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('No se pudieron cargar los eventos. Intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, [pagina, categoriaSeleccionada]);
  
  const cambiarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setPagina(1); // Reset a primera página al cambiar filtro
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Eventos</h1>
      
      {/* Filtros de categoría */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            className={`px-4 py-2 rounded ${!categoriaSeleccionada ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => cambiarCategoria('')}
          >
            Todos
          </button>
          
          {categorias.map(categoria => (
            <button
              key={categoria.id}
              className={`px-4 py-2 rounded ${categoriaSeleccionada === categoria.nombre ? 'bg-primary text-white' : 'bg-gray-200'}`}
              onClick={() => cambiarCategoria(categoria.nombre)}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </div>
      
      {/* Mostrar estado de carga o error */}
      {cargando && <p className="text-center">Cargando eventos...</p>}
      
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {/* Lista de eventos */}
      {!cargando && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map(evento => (
              <div key={evento.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{evento.nombre}</h2>
                  <p className="text-gray-700 mb-2">{evento.descripcion}</p>
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    {evento.categoria}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Componente de paginación */}
          <Paginacion 
            pagina={pagina} 
            totalPaginas={totalPaginas} 
            onChange={setPagina} 
          />
        </>
      )}
    </div>
  );
};

export default EventosPage;