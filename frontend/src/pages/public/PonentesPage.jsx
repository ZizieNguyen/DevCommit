import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Paginacion } from '../../components/ui/Paginacion';

const PonentesPage = () => {
  const [ponentes, setPonentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const LIMITE_POR_PAGINA = 6; // Ajustar según diseño
  
  useEffect(() => {
    const cargarPonentes = async () => {
      try {
        setCargando(true);
        
        const params = new URLSearchParams({
          pagina,
          limite: LIMITE_POR_PAGINA
        });
        
        const respuesta = await api.get(`/ponentes?${params.toString()}`);
        
        setPonentes(respuesta.ponentes);
        setTotalPaginas(respuesta.paginacion.totalPaginas);
        
      } catch (error) {
        console.error('Error al cargar ponentes:', error);
        setError('No se pudieron cargar los ponentes. Intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };
    
    cargarPonentes();
  }, [pagina]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Ponentes</h1>
      
      {/* Mostrar estado de carga o error */}
      {cargando && <p className="text-center">Cargando ponentes...</p>}
      
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {/* Lista de ponentes */}
      {!cargando && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ponentes.map(ponente => (
              <div key={ponente.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img 
                  src={`/img/speakers/${ponente.imagen}`} 
                  alt={`${ponente.nombre} ${ponente.apellido}`}
                  className="w-full h-64 object-cover" 
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{ponente.nombre} {ponente.apellido}</h2>
                  <p className="text-gray-600 mb-2">{ponente.ciudad}, {ponente.pais}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {ponente.tags.split(',').map((tag, i) => (
                      <span 
                        key={i} 
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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

export default PonentesPage;