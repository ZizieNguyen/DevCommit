import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Spinner } from '../../components/ui/Spinner';
import { Alerta } from '../../components/ui/Alerta';
import { formatFecha } from '../../utils/formatters';

export default function AdminRegistrationsPage() {
  const [registros, setRegistros] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  // Estado de filtros
  const [filtros, setFiltros] = useState({
    evento: '',
    pagado: '',
    usuario: ''
  });
  
  // Estado para paginación
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    limite: 10
  });
  const [total, setTotal] = useState(0);
  
  // Calcular total de páginas
  const totalPaginas = Math.ceil(total / paginacion.limite);
  
  // Cargar registros al montar el componente y cuando cambian filtros o paginación
  useEffect(() => {
    const cargarRegistros = async () => {
      try {
        setCargando(true);
        
        // Construir parámetros para la API
        const params = {
          pagina: paginacion.pagina,
          limite: paginacion.limite,
          ...filtros
        };
        
        // Filtrar parámetros vacíos
        Object.keys(params).forEach(key => 
          params[key] === '' && delete params[key]
        );
        
        // Obtener datos de la API
        const data = await api.get('/registros', params);
        
        setRegistros(data.registros);
        setTotal(data.total);
      } catch (error) {
        console.error(error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error al cargar los registros'
        });
      } finally {
        setCargando(false);
      }
    };
    
    cargarRegistros();
  }, [filtros, paginacion]);
  
  // Cargar lista de eventos para el filtro
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await api.get('/eventos');
        setEventos(data);
      } catch (error) {
        console.error(error);
      }
    };
    
    cargarEventos();
  }, []);
  
  // Manejar cambio de filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [name]: value
    }));
    
    // Resetear paginación al cambiar filtros
    setPaginacion(prevPaginacion => ({
      ...prevPaginacion,
      pagina: 1
    }));
  };
  
  // Manejar cambio de página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    
    setPaginacion(prevPaginacion => ({
      ...prevPaginacion,
      pagina: nuevaPagina
    }));
  };
  
  // Manejar cambio de estado de pago
  const handleTogglePagado = async (id, estadoActual) => {
    try {
      await api.put(`/registros/${id}`, {
        pagado: !estadoActual
      });
      
      // Actualizar el estado local
      setRegistros(registros.map(registro => 
        registro.id === id 
          ? { ...registro, pagado: !registro.pagado } 
          : registro
      ));
      
      setAlerta({
        tipo: 'success',
        mensaje: `Registro marcado como ${!estadoActual ? 'pagado' : 'no pagado'}`
      });
      
      // Ocultar la alerta después de 3 segundos
      setTimeout(() => {
        setAlerta({});
      }, 3000);
      
    } catch (error) {
      console.error(error);
      setAlerta({
        tipo: 'error',
        mensaje: 'Error al actualizar el estado de pago'
      });
    }
  };
  
  // Función para eliminar registro
  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.')) return;
    
    try {
      await api.delete(`/registros/${id}`);
      
      // Actualizar la lista sin necesidad de recargar
      setRegistros(registros.filter(registro => registro.id !== id));
      
      // Actualizar el total
      setTotal(prev => prev - 1);
      
      setAlerta({
        tipo: 'success',
        mensaje: 'Registro eliminado correctamente'
      });
    } catch (error) {
      console.error(error);
      setAlerta({
        tipo: 'error',
        mensaje: 'Error al eliminar el registro'
      });
    }
  };
  
  // Función para resetear filtros
  const resetFiltros = () => {
    setFiltros({
      evento: '',
      pagado: '',
      usuario: ''
    });
    setPaginacion({
      pagina: 1,
      limite: 10
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Registros</h2>
      </div>
      
      {alerta.mensaje && (
        <Alerta 
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
        />
      )}
      
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-bold mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por evento */}
          <div>
            <label htmlFor="evento" className="block text-sm font-medium text-gray-700 mb-1">
              Evento
            </label>
            <select
              id="evento"
              name="evento"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={filtros.evento}
              onChange={handleFiltroChange}
            >
              <option value="">Todos los eventos</option>
              {eventos.map(evento => (
                <option key={evento.id} value={evento.id}>
                  {evento.nombre}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtro por estado de pago */}
          <div>
            <label htmlFor="pagado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado de pago
            </label>
            <select
              id="pagado"
              name="pagado"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={filtros.pagado}
              onChange={handleFiltroChange}
            >
              <option value="">Todos</option>
              <option value="true">Pagado</option>
              <option value="false">No pagado</option>
            </select>
          </div>
          
          {/* Filtro por usuario (nombre o email) */}
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
              Usuario (nombre o email)
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Buscar por nombre o email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={filtros.usuario}
              onChange={handleFiltroChange}
            />
          </div>
        </div>
        
        {/* Botón para resetear filtros */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={resetFiltros}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
          >
            Resetear filtros
          </button>
        </div>
      </div>
      
      {cargando ? (
        <Spinner />
      ) : registros.length === 0 ? (
        <p className="text-center text-gray-600 py-10">No se encontraron registros</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tabla de registros */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registros.map(registro => (
                  <tr key={registro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registro.usuario.nombre} {registro.usuario.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registro.usuario.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registro.evento.nombre}</div>
                      <div className="text-xs text-gray-500">{registro.evento.categoria.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatFecha(registro.createdAt, { dateStyle: 'medium' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePagado(registro.id, registro.pagado)}
                        className={`px-3 py-1 rounded-md text-white text-sm ${
                          registro.pagado 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {registro.pagado ? 'Pagado' : 'No Pagado'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEliminar(registro.id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Resumen de registros */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{registros.length}</span> de{' '}
              <span className="font-medium">{total}</span> registros
            </p>
          </div>
        </div>
      )}
      
      {/* Paginación */}
      {registros.length > 0 && totalPaginas > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => cambiarPagina(1)}
              disabled={paginacion.pagina === 1}
              className={`px-3 py-1 rounded ${
                paginacion.pagina === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              &laquo;
            </button>
            
            <button
              onClick={() => cambiarPagina(paginacion.pagina - 1)}
              disabled={paginacion.pagina === 1}
              className={`px-3 py-1 rounded ${
                paginacion.pagina === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              &lsaquo;
            </button>
            
            {/* Mostrar números de página */}
            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
              .filter(pagina => {
                // Mostrar la primera página, la última, la actual y una antes/después
                return (
                  pagina === 1 ||
                  pagina === totalPaginas ||
                  Math.abs(pagina - paginacion.pagina) <= 1
                );
              })
              .map((pagina, index, array) => {
                // Si hay saltos en la secuencia, mostrar puntos suspensivos
                const mostrarPuntos = index > 0 && pagina - array[index - 1] > 1;
                
                return (
                  <React.Fragment key={pagina}>
                    {mostrarPuntos && (
                      <span className="px-3 py-1">...</span>
                    )}
                    <button
                      onClick={() => cambiarPagina(pagina)}
                      className={`px-3 py-1 rounded ${
                        paginacion.pagina === pagina 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {pagina}
                    </button>
                  </React.Fragment>
                );
              })}
            
            <button
              onClick={() => cambiarPagina(paginacion.pagina + 1)}
              disabled={paginacion.pagina === totalPaginas}
              className={`px-3 py-1 rounded ${
                paginacion.pagina === totalPaginas 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              &rsaquo;
            </button>
            
            <button
              onClick={() => cambiarPagina(totalPaginas)}
              disabled={paginacion.pagina === totalPaginas}
              className={`px-3 py-1 rounded ${
                paginacion.pagina === totalPaginas 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              &raquo;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}