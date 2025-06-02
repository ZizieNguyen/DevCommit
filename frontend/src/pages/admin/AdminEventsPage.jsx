import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Spinner } from '../../components/ui/Spinner';
import { Alerta } from '../../components/ui/Alerta';
import { formatFecha } from '../../utils/formatters';
import { CATEGORIAS } from '../../services/config';

export default function AdminEventsPage() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        setCargando(true);
        const data = await api.get('/eventos');
        setEventos(data);
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
    
    obtenerEventos();
  }, []);
  
  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    
    try {
      await api.delete(`/eventos/${id}`);
      
      // Actualizar la lista de eventos
      setEventos(eventos.filter(evento => evento.id !== id));
      
      setAlerta({
        tipo: 'success',
        mensaje: 'Evento eliminado correctamente'
      });
    } catch (error) {
      console.error(error);
      setAlerta({
        tipo: 'error',
        mensaje: 'Error al eliminar el evento'
      });
    }
  };
  
  if (cargando) return <Spinner />;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Administrar Eventos</h2>
        
        <Link 
          to="/admin/eventos/nuevo"
          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md"
        >
          Nuevo Evento
        </Link>
      </div>
      
      {alerta.mensaje && (
        <Alerta 
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
        />
      )}
      
      {eventos.length === 0 ? (
        <p className="text-center text-gray-600">No hay eventos registrados</p>
      ) : (
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disponibles
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eventos.map(evento => (
                  <tr key={evento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{evento.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${CATEGORIAS[evento.categoria.nombre]}/10 text-${CATEGORIAS[evento.categoria.nombre]}`}>
                        {evento.categoria.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFecha(evento.dia.fecha)} - {evento.hora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {evento.disponibles} / {evento.disponibles + evento.registrados}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/admin/eventos/${evento.id}/editar`}
                        className="text-primary hover:text-primary-dark mr-4"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleEliminar(evento.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}