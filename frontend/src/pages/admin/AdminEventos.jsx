import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCirclePlus, FaPencil, FaCircleXmark } from 'react-icons/fa6';
import { clienteAxios } from '../../config/axios';
import Alerta from '../../components/alertas/Alerta';
import Paginacion from '../../components/Paginacion';

export default function AdminEventos() {
  const [eventos, setEventos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const titulo = "Eventos";

  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        setCargando(true);
        
        // Intentar obtener los eventos
        const { data } = await clienteAxios.get(`/api/eventos?page=${paginaActual}`);
        
        console.log('Datos recibidos de API eventos:', data);
        
        // Asegurarse de que eventos sea un array
        if (Array.isArray(data)) {
          setEventos(data);
        } else if (data && Array.isArray(data.eventos)) {
          setEventos(data.eventos);
          if (data.paginacion) {
            setTotalPaginas(data.paginacion.totalPaginas);
          }
        } else {
          console.error('Formato de datos inesperado:', data);
          setEventos([]); // Siempre asegurar que sea un array
          setAlerta({
            msg: 'Error en el formato de respuesta del servidor',
            tipo: 'error'
          });
        }
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setEventos([]); // Importante: inicializar como array vacío
        setAlerta({
          msg: error.response?.data?.msg || 'Error al cargar los eventos',
          tipo: 'error'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerEventos();
  }, [paginaActual]);

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    
    try {
      const { data } = await clienteAxios.delete(`/api/eventos/${id}`);
      
      setAlerta({
        msg: data?.msg || 'Evento eliminado correctamente',
        tipo: 'exito'
      });
      
      // Actualizar lista de eventos
      setEventos(eventos.filter(evento => evento.id !== id));
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      setAlerta({
        msg: error.response?.data?.msg || 'Error al eliminar el evento',
        tipo: 'error'
      });
    }
  };

  const handleSubmitEliminar = async (e, id) => {
    e.preventDefault();
    await handleEliminar(id);
  };
  
  if (cargando) return <p className="text-center">Cargando...</p>;
  
  return (
    <>
      <h2 className="dashboard__heading">{titulo}</h2>
      
      <div className="dashboard__contenedor-boton">
        <Link to="/admin/eventos/crear" className="dashboard__boton">
          <FaCirclePlus />
          &nbsp;Añadir Evento
        </Link>
      </div>
      
      {alerta.msg && <Alerta mensaje={alerta.msg} tipo={alerta.tipo} />}
      
      <div className="dashboard__contenedor">
        {Array.isArray(eventos) && eventos.length > 0 ? (
          <>
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
                  <tr key={evento.id} className="table__tr">
                    <td className="table__td">
                      {evento.nombre}
                    </td>
                    <td className="table__td">
                      {evento.categoria?.nombre || 'Sin categoría'}
                    </td>
                    <td className="table__td">
                      {evento.dia?.nombre || 'Sin día'}, {evento.hora?.hora || 'Sin hora'}
                    </td>
                    <td className="table__td">
                      {evento.ponente ? 
                        `${evento.ponente.nombre} ${evento.ponente.apellido}` : 
                        'Sin ponente asignado'}
                    </td>
                    <td className="table__td--acciones">
                      <Link 
                        className="table__accion table__accion--editar" 
                        to={`/admin/eventos/editar/${evento.id}`}
                      >
                        <FaPencil />
                        Editar
                      </Link>

                      <form 
                        className="table__formulario"
                        onSubmit={(e) => handleSubmitEliminar(e, evento.id)}
                      >
                        <input type="hidden" name="id" value={evento.id} />
                        <button 
                          className="table__accion table__accion--eliminar" 
                          type="submit"
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
            
            {totalPaginas > 1 && (
              <Paginacion 
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChange={setPaginaActual}
              />
            )}
          </>
        ) : (
          <p className="text-center">No hay eventos aún</p>
        )}
      </div>
    </>
  );
}