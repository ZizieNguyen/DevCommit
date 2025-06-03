import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { formatearFecha } from '../../utils/dateUtils';

const Dashboard = ({ stats, ultimosRegistros, proximosEventos }) => {
  return (
    <div className="dashboard">
      <div className="dashboard__grid">
        <div className="tarjeta">
          <div className="tarjeta__contenido">
            <FaUsers className="tarjeta__icono" />
            <p className="tarjeta__numero">{stats?.registros_totales || 0}</p>
            <p className="tarjeta__texto">Asistentes Registrados</p>
          </div>
        </div>

        <div className="tarjeta">
          <div className="tarjeta__contenido">
            <FaCalendarAlt className="tarjeta__icono" />
            <p className="tarjeta__numero">{stats?.eventos_totales || 0}</p>
            <p className="tarjeta__texto">Eventos Programados</p>
          </div>
        </div>

        <div className="tarjeta">
          <div className="tarjeta__contenido">
            <FaMoneyBillWave className="tarjeta__icono" />
            <p className="tarjeta__numero">${stats?.ingresos_totales || 0}</p>
            <p className="tarjeta__texto">Ingresos Totales</p>
          </div>
        </div>

        <div className="tarjeta">
          <div className="tarjeta__contenido">
            <FaChartLine className="tarjeta__icono" />
            <p className="tarjeta__numero">{stats?.eventos_mas_populares?.length || 0}</p>
            <p className="tarjeta__texto">Eventos Más Populares</p>
          </div>
        </div>
      </div>

      {/* Últimos Registros */}
      <div className="dashboard__grid">
        <div className="tarjeta">
          <h2 className="tarjeta__titulo">Últimos Registros</h2>
          {ultimosRegistros?.length === 0 ? (
            <p className="text-center">No hay registros aún</p>
          ) : (
            <table className="tabla">
              <thead className="tabla__thead">
                <tr>
                  <th scope="col" className="tabla__th">Nombre</th>
                  <th scope="col" className="tabla__th">Email</th>
                  <th scope="col" className="tabla__th">Plan</th>
                  <th scope="col" className="tabla__th">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ultimosRegistros?.map(registro => (
                  <tr key={registro.id} className="tabla__tr">
                    <td className="tabla__td">{registro.usuario_nombre}</td>
                    <td className="tabla__td">{registro.usuario_email}</td>
                    <td className="tabla__td">{registro.paquete_nombre}</td>
                    <td className="tabla__td">{formatearFecha(registro.fecha_registro)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="text-center mt-5">
            <Link to="/admin/registros" className="button">
              Ver Todos
            </Link>
          </div>
        </div>

        {/* Próximos Eventos */}
        <div className="tarjeta">
          <h2 className="tarjeta__titulo">Próximos Eventos</h2>
          {proximosEventos?.length === 0 ? (
            <p className="text-center">No hay eventos programados</p>
          ) : (
            <table className="tabla">
              <thead className="tabla__thead">
                <tr>
                  <th scope="col" className="tabla__th">Evento</th>
                  <th scope="col" className="tabla__th">Fecha</th>
                  <th scope="col" className="tabla__th">Categoría</th>
                  <th scope="col" className="tabla__th">Ponente</th>
                </tr>
              </thead>
              <tbody>
                {proximosEventos?.map(evento => (
                  <tr key={evento.id} className="tabla__tr">
                    <td className="tabla__td">{evento.nombre}</td>
                    <td className="tabla__td">{formatearFecha(evento.fecha)}</td>
                    <td className="tabla__td">{evento.categoria}</td>
                    <td className="tabla__td">{evento.ponente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="text-center mt-5">
            <Link to="/admin/eventos" className="button">
              Ver Todos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;