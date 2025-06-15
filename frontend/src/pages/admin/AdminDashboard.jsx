import { useState, useEffect } from 'react';
import { clienteAxios } from '../../config/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    eventos: 0,
    ponentes: 0,
    registros: 0,
    ingresos: 0,
    eventos_menos_disponibles: [],
    eventos_mas_disponibles: [],
    registros_recientes: []
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const obtenerStats = async () => {
      try {
        setCargando(true);
        setError(null);
        
        const { data } = await clienteAxios('/admin/dashboard');
        console.log('Datos recibidos del dashboard:', data);
        
        if (data.error) {
          setError(data.msg || 'Error al cargar los datos');
          return;
        }
        
        setStats(data);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setError('No se pudo conectar con el servidor');
      } finally {
        setCargando(false);
      }
    };
    
    obtenerStats();
  }, []);

  if (cargando) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-error">{error}</p>;
  
  return (
    <>
      <h2 className="dashboard__heading">Panel de Administración</h2>
      
      <main className="bloques">
        <div className="bloques__grid">
          <div className="bloque">
            <h3 className="bloque__heading">Últimos Registros</h3>
            
            {stats.registros_recientes?.length ? (
              stats.registros_recientes.map(registro => (
                <div className="bloque__contenido" key={registro.id}>
                  <p className="bloque__texto">
                    {registro.usuario.nombre} {registro.usuario.apellido}
                  </p>
                </div>
              ))
            ) : (
              <p className="bloque__texto">No hay registros recientes</p>
            )}
          </div>
          
          <div className="bloque">
            <h3 className="bloque__heading">Ingresos</h3>
            <p className="bloque__texto--cantidad">€ {stats.ingresos}</p>
          </div>
          
          <div className="bloque">
            <h3 className="bloque__heading">Eventos Con Menos Lugares Disponibles</h3>
            
            {stats.eventos_menos_disponibles?.length ? (
              stats.eventos_menos_disponibles.map(evento => (
                <div className="bloque__contenido" key={evento.id}>
                  <p className="bloque__texto">
                    {evento.nombre} - {evento.disponibles} Disponibles
                  </p>
                </div>
              ))
            ) : (
              <p className="bloque__texto">No hay eventos con pocos lugares</p>
            )}
          </div>
          
          <div className="bloque">
            <h3 className="bloque__heading">Eventos Con Más Lugares Disponibles</h3>
            
            {stats.eventos_mas_disponibles?.length ? (
              stats.eventos_mas_disponibles.map(evento => (
                <div className="bloque__contenido" key={evento.id}>
                  <p className="bloque__texto">
                    {evento.nombre} - {evento.disponibles} Disponibles
                  </p>
                </div>
              ))
            ) : (
              <p className="bloque__texto">No hay eventos con muchos lugares</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}