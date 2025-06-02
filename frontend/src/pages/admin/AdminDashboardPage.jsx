import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Dashboard from '../../components/admin/Dashboard';
import { Spinner } from '../../components/ui/Spinner';
import { Alerta } from '../../components/ui/Alerta';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [ultimosRegistros, setUltimosRegistros] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        
        // Obtener estadísticas para el dashboard
        const estadisticas = await api.get('/admin/dashboard');
        setStats(estadisticas);
        
        // Obtener los últimos registros
        const registros = await api.get('/admin/registros?limit=5');
        setUltimosRegistros(registros);
        
        // Obtener los próximos eventos
        const eventos = await api.get('/admin/eventos/proximos?limit=5');
        setProximosEventos(eventos);
        
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Hubo un error al cargar el dashboard'
        });
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, []);

  if (cargando) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {alerta.mensaje && (
        <Alerta 
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
        />
      )}
      
      {/* Tarjetas con estadísticas */}
      <Dashboard stats={stats} />
      
      {/* Secciones con datos recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos registros */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Últimos Registros</h2>
          
          {ultimosRegistros.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ultimosRegistros.map(registro => (
                    <tr key={registro.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{registro.usuario.nombre}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{registro.evento.nombre}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {new Date(registro.createdAt).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No hay registros recientes</p>
          )}
        </div>
        
        {/* Próximos eventos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Próximos Eventos</h2>
          
          {proximosEventos.length > 0 ? (
            <div className="space-y-4">
              {proximosEventos.map(evento => (
                <div key={evento.id} className="flex justify-between border-b pb-2">
                  <div>
                    <h3 className="font-medium">{evento.nombre}</h3>
                    <p className="text-sm text-gray-500">{evento.dia.fecha} - {evento.hora}</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {evento.disponibles} disponibles
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay próximos eventos</p>
          )}
        </div>
      </div>
    </div>
  );
}