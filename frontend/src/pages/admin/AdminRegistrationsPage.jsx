import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Paginacion } from '../../components/ui/Paginacion';

const AdminRegistrationsPage = () => {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const LIMITE_POR_PAGINA = 15;
  
  useEffect(() => {
    const cargarRegistros = async () => {
      try {
        setCargando(true);
        
        const params = new URLSearchParams({
          pagina,
          limite: LIMITE_POR_PAGINA
        });
        
        const respuesta = await api.get(`/registros/admin?${params.toString()}`);
        
        setRegistros(respuesta.registros);
        setTotalPaginas(respuesta.paginacion.totalPaginas);
        
      } catch (error) {
        console.error('Error al cargar registros:', error);
        setError('No se pudieron cargar los registros. Intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };
    
    cargarRegistros();
  }, [pagina]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Registros de Asistentes</h1>
      
      {/* Mostrar estado de carga o error */}
      {cargando && <p className="text-center">Cargando registros...</p>}
      
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {/* Tabla de registros */}
      {!cargando && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Evento</th>
                  <th className="px-4 py-2 text-left">Plan</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {registros.length > 0 ? (
                  registros.map(registro => (
                    <tr key={registro.id} className="border-t border-gray-200">
                      <td className="px-4 py-3">{registro.id}</td>
                      <td className="px-4 py-3">{registro.nombre}</td>
                      <td className="px-4 py-3">{registro.email}</td>
                      <td className="px-4 py-3">{registro.evento}</td>
                      <td className="px-4 py-3">
                        {registro.paquete === 'presencial' ? 'Presencial' : 'Virtual'}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(registro.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-3 text-center">
                      No hay registros disponibles
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

export default AdminRegistrationsPage;