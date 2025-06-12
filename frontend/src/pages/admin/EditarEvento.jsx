import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alerta from '../../components/alertas/Alerta';
import FormularioEvento from '../../components/admin/FormularioEvento';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { clienteAxios } from '../../config/axios';
import Submit from '../../components/formulario/Submit';

export default function EditarEvento() {
  const [evento, setEvento] = useState({});
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const titulo = "Editar Evento";
  
  useEffect(() => {
    const obtenerEvento = async () => {
      try {
        const { data } = await clienteAxios(`/admin/eventos/${id}`);
        setEvento(data.evento);
        setCargando(false);
      } catch (error) {
        console.error('Error al obtener el evento:', error);
        setAlerta({
          msg: error.response?.data?.msg || 'Error al cargar el evento',
          tipo: 'error'
        });
      }
    };
    
    obtenerEvento();
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Obtener los datos del formulario
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData);
    
    try {
      const { data } = await clienteAxios.put(`/admin/eventos/${id}`, datos);
      
      setAlerta({
        msg: data.msg || 'Cambios guardados correctamente',
        tipo: 'exito'
      });
      
      // Redireccionar después de mostrar mensaje de éxito
      setTimeout(() => {
        navigate('/admin/eventos');
      }, 3000);
      
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      
      setAlerta({
        msg: error.response?.data?.msg || 'Error al guardar los cambios',
        tipo: 'error'
      });
    }
  };
  
  const { msg, tipo } = alerta;
  
  if (cargando) return <p>Cargando...</p>;
  
  return (
    <>
      <h2 className="dashboard__heading">{titulo}</h2>
      
      <div className="dashboard__contenedor-boton">
        <Link to="/admin/eventos" className="dashboard__boton">
          <FaCircleArrowLeft />
          Volver
        </Link>
      </div>
      
      <div className="dashboard__formulario">
        {msg && <Alerta tipo={tipo}>{msg}</Alerta>}
        
        <form 
          className="formulario"
          onSubmit={handleSubmit}
        >
          <FormularioEvento 
            evento={evento}
          />
          
          <Submit 
            value="Guardar Cambios" 
            className="formulario__submit--registrar" 
            />
        </form>
      </div>
    </>
  );
}