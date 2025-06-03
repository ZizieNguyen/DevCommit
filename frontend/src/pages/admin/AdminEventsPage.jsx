import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Paginacion } from '../../components/ui/Paginacion';

const AdminEventsPage = () => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const LIMITE_POR_PAGINA = 10; // Típico en paneles admin
  
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        setCargando(true);
        
        const params = new URLSearchParams({
          pagina,
          limite: LIMITE_POR_PAGINA
        });
        
        const respuesta = await api.get(`/eventos/admin?${params.toString()}`);
        
        setEventos(respuesta.eventos);
        setTotalPaginas(respuesta.paginacion.totalPaginas);
        
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setError('No se pudieron cargar los eventos. Intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };
    
    cargarEventos();
  }, [pagina]);
  
  const eliminarEvento = async (id) => {
    if (!window.confirm('¿Estás seguro que deseas eliminar este evento?')) {
      return;
    }
    
    try {
      await api.delete(`/eventos/${id}`);
      // Recargar eventos con la misma página
      const params = new URLSearchParams({
        pagina,
        limite: LIMITE_POR_PAGINA
      });
      
      const respuesta = await api.get(`/eventos/admin?${params.toString()}`);
      
      setEventos(respuesta.eventos);
      setTotalPaginas(respuesta.paginacion.totalPaginas);
      
      // Si eliminamos el último evento de la página actual y hay páginas anteriores, retroceder
      if (respuesta.eventos.length === 0 && pagina > 1) {
        setPagina(pagina - 1);
      }
      
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      alert('No se pudo eliminar el evento. Inténtalo de nuevo.');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Administrar Eventos</h1>
        <Link 
          to="/admin/eventos/nuevo" 
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Nuevo Evento
        </Link>
      </div>
      
      {/* Mostrar estado de carga o error */}
      {cargando && <p className="text-center">Cargando eventos...</p>}
      
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {/* Tabla de eventos */}
      {!cargando && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Categoría</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-left">Hora</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.length > 0 ? (
                  eventos.map(evento => (
                    <tr key={evento.id} className="border-t border-gray-200">
                      <td className="px-4 py-3">{evento.id}</td>
                      <td className="px-4 py-3">{evento.nombre}</td>
                      <td className="px-4 py-3">{evento.categoria}</td>
                      <td className="px-4 py-3">{new Date(evento.fecha).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{evento.hora}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link 
                            to={`/admin/eventos/editar/${evento.id}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => eliminarEvento(evento.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-3 text-center">
                      No hay eventos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

export default AdminEventsPage;