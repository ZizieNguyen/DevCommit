import { useState, useEffect } from 'react';
import { clienteAxios } from '../../config/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    eventos: 0,
    ponentes: 0,
    registros: 0,
    ingresos: 0,
    menos_disponibles: [],
    mas_disponibles: [],
    ultimos_registros: []
  });
  
  useEffect(() => {
    const obtenerStats = async () => {
      try {
        const { data } = await clienteAxios('/admin/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      }
    };
    
    obtenerStats();
  }, []);
  
  return (
    <>
      <h2 className="dashboard__heading">Panel de Administración</h2>
      
      <main className="bloques">
        <div className="bloques__grid">
          <div className="bloque">
            <h3 className="bloque__heading">Últimos Registros</h3>
            
            {stats.ultimos_registros?.length ? (
              stats.ultimos_registros.map(registro => (
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
            
            {stats.menos_disponibles?.length ? (
              stats.menos_disponibles.map(evento => (
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
            
            {stats.mas_disponibles?.length ? (
              stats.mas_disponibles.map(evento => (
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