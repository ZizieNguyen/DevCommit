import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Spinner } from '../../components/ui/Spinner';
import { Alerta } from '../../components/ui/Alerta';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';

export default function AdminSpeakersPage() {
  const [ponentes, setPonentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});

  useEffect(() => {
    const obtenerPonentes = async () => {
      try {
        setCargando(true);
        const resultado = await api.get('/ponentes');
        setPonentes(resultado.ponentes || resultado);
        setAlerta({});
      } catch (error) {
        console.error(error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error al cargar los ponentes'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerPonentes();
  }, []);

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este ponente? Esta acción no se puede deshacer.');
    
    if (confirmar) {
      try {
        await api.delete(`/ponentes/${id}`);
        setPonentes(ponentes.filter(ponente => ponente.id !== id));
        
        setAlerta({
          tipo: 'exito',
          mensaje: 'Ponente eliminado correctamente'
        });
      } catch (error) {
        console.error(error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error al eliminar el ponente'
        });
      }
    }
  };

  return (
    <>
      <h2 className="dashboard__heading">Ponentes / Conferencistas</h2>
      
      <div className="dashboard__contenedor-boton">
        <Link to="/admin/ponentes/nuevo" className="dashboard__boton">
          <FaPlus /> Añadir Ponente
        </Link>
      </div>
      
      {alerta.mensaje && (
        <Alerta 
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}
      
      {cargando ? (
        <div className="dashboard__spinner">
          <div className="spinner">
            <div className="spinner__dot"></div>
            <div className="spinner__dot"></div>
            <div className="spinner__dot"></div>
          </div>
        </div>
      ) : (
        <>
          {ponentes.length === 0 ? (
            <p className="text-center">No hay ponentes registrados</p>
          ) : (
            <div className="dashboard__listado">
              <table className="table">
                <thead className="table__thead">
                  <tr>
                    <th scope="col" className="table__th">Imagen</th>
                    <th scope="col" className="table__th">Nombre</th>
                    <th scope="col" className="table__th">Ubicación</th>
                    <th scope="col" className="table__th">Especialidades</th>
                    <th scope="col" className="table__th">Acciones</th>
                  </tr>
                </thead>
                <tbody className="table__tbody">
                  {ponentes.map(ponente => (
                    <tr key={ponente.id} className="table__tr">
                      <td className="table__td">
                        <div className="table__imagen-contenedor">
                          <img 
                            src={ponente.imagen ? `/img/speakers/${ponente.imagen}` : '/img/speakers/default.png'} 
                            alt={`Foto de ${ponente.nombre} ${ponente.apellido}`}
                            className="table__imagen"
                          />
                        </div>
                      </td>
                      <td className="table__td">
                        {ponente.nombre} {ponente.apellido}
                      </td>
                      <td className="table__td">
                        {ponente.ciudad}, {ponente.pais}
                      </td>
                      <td className="table__td">
                        {ponente.tags && ponente.tags.split(',').map((tag, i) => (
                          <span key={i} className="table__tag">{tag.trim()}</span>
                        ))}
                      </td>
                      <td className="table__td--acciones">
                        <Link 
                          to={`/admin/ponentes/editar/${ponente.id}`} 
                          className="table__accion table__accion--editar"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          type="button"
                          className="table__accion table__accion--eliminar"
                          onClick={() => handleEliminar(ponente.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}