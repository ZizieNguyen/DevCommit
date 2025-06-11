import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../../components/Alerta';
import { clienteAxios } from '../../config/axios';
import { FaCirclePlus, FaPencil, FaCircleXmark } from 'react-icons/fa6';
import Paginacion from '../../components/Paginacion';

export default function AdminEventos() {
  const [eventos, setEventos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const titulo = "Administrar Eventos";
  
  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        const { data } = await clienteAxios.get(`/admin/eventos?page=${paginaActual}`);
        setEventos(data.eventos);
        setTotalPaginas(data.totalPaginas);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setAlerta({
          msg: 'Error al cargar los eventos',
          tipo: 'error'
        });
      }
    };
    
    obtenerEventos();
  }, [paginaActual]);

  const handleEliminar = async id => {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      try {
        const { data } = await clienteAxios.delete(`/admin/eventos/${id}`);
        setAlerta({
          msg: data.msg || 'Evento eliminado correctamente',
          tipo: 'exito'
        });
        
        // Actualizar la lista de eventos
        const nuevosEventos = eventos.filter(evento => evento.id !== id);
        setEventos(nuevosEventos);
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        setAlerta({
          msg: 'Error al eliminar el evento',
          tipo: 'error'
        });
      }
    }
  };
  
  const { msg, tipo } = alerta;
  
  return (
    <>
      <h2 className="dashboard__heading">{titulo}</h2>
      
      {msg && <Alerta tipo={tipo}>{msg}</Alerta>}

      <div className="dashboard__contenedor-boton">
        <Link to="/admin/eventos/crear" className="dashboard__boton">
          <FaCirclePlus />
          Añadir Evento
        </Link>
      </div>
      
      <div className="dashboard__contenedor">
        {eventos.length > 0 ? (
          <table className="table">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th">Evento</th>
                <th scope="col" className="table__th">Categoría</th>
                <th scope="col" className="table__th">Día y Hora</th>
                <th scope="col" className="table__th">Ponente</th>
                <th scope="col" className="table__th"></th>
              </tr>
            </thead>
            
            <tbody className="table__tbody">
              {eventos.map(evento => (
                <tr className="table__tr" key={evento.id}>
                  <td className="table__td">
                    {evento.nombre}
                  </td>
                  <td className="table__td">
                    {evento.categoria?.nombre}
                  </td>
                  <td className="table__td">
                    {evento.dia?.nombre}, {evento.hora?.hora}
                  </td>
                  <td className="table__td">
                    {evento.ponente?.nombre} {evento.ponente?.apellido}
                  </td>
                  <td className="table__td--acciones">
                    <Link 
                      to={`/admin/eventos/editar/${evento.id}`} 
                      className="table__accion table__accion--editar"
                    >
                      <FaPencil />
                      Editar
                    </Link>
                    
                    <form 
                      className="table__formulario"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEliminar(evento.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="table__accion table__accion--eliminar"
                      >
                        <FaCircleXmark />
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No Hay Eventos Aún</p>
        )}
      </div>
      
      {totalPaginas > 1 && (
        <Paginacion 
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onChange={setPaginaActual}
        />
      )}
    </>
  );
}