import React, { useState, useEffect, useRef } from 'react';
import { api } from "../../services/api";
import { Spinner } from "../../components/ui/Spinner";
import { Alerta } from "../../components/ui/Alerta";
import { formatearDinero, formatearFecha } from "../../utils/formato";
import { crearGraficoBarras } from "../../utils/graficos";
import { FaUsers, FaCalendarAlt, FaDollarSign, FaChartLine } from 'react-icons/fa';
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function AdminDashboardPage() {
  // Estado para almacenar datos
  const [stats, setStats] = useState({
    usuarios: 0,
    eventos: 0,
    ponentes: 0,
    registros: 0,
    registrosPagados: 0,
    ingresos: 0,
    eventosMasPopulares: [] // Añadido para el gráfico
  });
  const [ultimosRegistros, setUltimosRegistros] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  // Referencias y hooks
  const graficoRef = useRef(null); // Referencia para el gráfico
  const { usuario } = useAuth(); // Cambiado de 'auth' a 'usuario' para coincidir con el contexto
  
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setAlerta({});
        
        // Llamadas a la API con las rutas correctas
        const [statsResp, registrosResp, eventosResp] = await Promise.all([
          api.get('/admin/estadisticas'),
          api.get('/admin/registros/ultimos'),
          api.get('/admin/eventos/proximos')
        ]);
        
        setStats({
          usuarios: statsResp.stats?.usuarios || 0,
          eventos: statsResp.stats?.eventos || 0,
          ponentes: statsResp.stats?.ponentes || 0,
          registros: statsResp.stats?.registros || 0,
          registrosPagados: statsResp.stats?.registrosPagados || 0,
          ingresos: statsResp.stats?.ingresos || 0,
          eventosMasPopulares: statsResp.stats?.eventosMasPopulares || []
        });
        setUltimosRegistros(registrosResp.registros || []);
        setProximosEventos(eventosResp.eventos || []);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        setAlerta({
          tipo: 'error',
          mensaje: error.message || 'Error al cargar los datos del dashboard'
        });
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
    
    // Limpieza del gráfico cuando el componente se desmonta
    return () => {
      if (graficoRef.current) {
        graficoRef.current.destroy();
      }
    };
  }, []);

  // Efecto para crear el gráfico cuando los datos estén disponibles
  useEffect(() => {
    if (!cargando && stats.eventosMasPopulares?.length > 0) {
      // Limpiar gráfico anterior si existe
      if (graficoRef.current) {
        graficoRef.current.destroy();
      }
      
      // Crear datos para el gráfico
      const datos = {
        labels: stats.eventosMasPopulares.map(evento => evento.nombre || 'Sin nombre'),
        datasets: [{
          label: 'Registros por evento',
          data: stats.eventosMasPopulares.map(evento => evento.registros || 0),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ]
        }]
      };
      
      // Crear el gráfico
      const canvas = document.getElementById('eventos-chart');
      if (canvas) {
        graficoRef.current = crearGraficoBarras('eventos-chart', datos, {
          titulo: 'Eventos más populares',
          ejeY: 'Registros'
        });
      }
    }
  }, [cargando, stats.eventosMasPopulares]);

  // Redirección si el usuario no es admin
  if (!usuario?.admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h2 className="dashboard__heading">Panel de Administración</h2>
      
      {alerta.mensaje && (
        <Alerta 
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}
      
      {cargando ? (
        <div className="dashboard__spinner">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Estadísticas */}
          <div className="dashboard__grid-stats">
            <div className="card">
              <div className="card__content">
                <FaUsers className="card__icon" />
                <p className="card__quantity">{stats.usuarios}</p>
                <p className="card__text">Usuarios</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card__content">
                <FaCalendarAlt className="card__icon" />
                <p className="card__quantity">{stats.eventos}</p>
                <p className="card__text">Eventos</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card__content">
                <FaDollarSign className="card__icon" />
                <p className="card__quantity">{formatearDinero(stats.ingresos)}</p>
                <p className="card__text">Ingresos</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card__content">
                <FaChartLine className="card__icon" />
                <p className="card__quantity">{stats.registros}</p>
                <p className="card__text">Registros</p>
              </div>
            </div>
          </div>
          
          {/* Registros y Eventos */}
          <div className="dashboard__grid">
            {/* Últimos registros */}
            <div className="dashboard__bloque">
              <div className="card">
                <h3 className="card__title">Últimos Registros</h3>
                {ultimosRegistros.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Evento</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimosRegistros.map(registro => (
                        <tr key={registro.id}>
                          <td>{registro.usuario_nombre} {registro.usuario_apellido}</td>
                          <td>{registro.evento_nombre}</td>
                          <td>{formatearFecha(registro.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center">No hay registros recientes</p>
                )}
              </div>
            </div>
            
            <div className="dashboard__bloque">
              {/* Próximos eventos */}
              <div className="card">
                <h3 className="card__title">Próximos Eventos</h3>
                {proximosEventos.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Evento</th>
                        <th>Fecha</th>
                        <th>Categoría</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proximosEventos.map(evento => (
                        <tr key={evento.id}>
                          <td>{evento.nombre}</td>
                          <td>{evento.dia} {evento.hora}</td>
                          <td>{evento.categoria_nombre}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center">No hay eventos próximos</p>
                )}
              </div>
              
              {/* Gráfico de eventos más populares */}
              <div className="card mt-5">
                <h3 className="card__title">Eventos Más Populares</h3>
                <div className="grafico-contenedor">
                  <canvas id="eventos-chart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}