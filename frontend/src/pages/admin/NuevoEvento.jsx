import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alerta from '../../components/alertas/Alerta';
import FormularioEvento from '../../components/admin/FormularioEvento';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { clienteAxios } from '../../config/axios';
import Submit from '../../components/formulario/Submit';

export default function NuevoEvento() {
  const [alerta, setAlerta] = useState({});
  const navigate = useNavigate();
  const titulo = "Crear Evento";
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Obtener los datos del formulario en formato JSON
  const formData = new FormData(e.target);
  const datos = Object.fromEntries(formData);
  
  try {
    console.log('Datos a enviar:', datos);

    // Enviar como JSON
    const response = await clienteAxios.post('/admin/eventos', datos, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Respuesta completa:', response);

    const { data } = response;
    
    setAlerta({
      msg: data.msg || 'Evento creado correctamente',
      tipo: 'exito'
    });
    
    // Redireccionar después de mostrar mensaje de éxito
    setTimeout(() => {
      navigate('/admin/eventos');
    }, 3000);
    
  } catch (error) {
    console.error('Error al crear evento:', error);
    console.log('Respuesta del servidor:', error.response?.data);
    
    setAlerta({
      msg: error.response?.data?.msg || 'Error al crear el evento',
      tipo: 'error'
    });
  }
};
  
  const { msg, tipo } = alerta;
  
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
          <FormularioEvento />
          
          <Submit 
            value="Registrar Evento" 
            className="formulario__submit--registrar" 
            />
        </form>
      </div>
    </>
  );
}