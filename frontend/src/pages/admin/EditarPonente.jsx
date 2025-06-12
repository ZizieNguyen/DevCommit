import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import FormularioPonente from '../../components/admin/FormularioPonente';
import { clienteAxios } from '../../config/axios';
import Alerta from '../../components/alertas/Alerta';

export default function EditarPonente() {
  const [ponente, setPonente] = useState({});
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(true);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const titulo = "Editar Ponente";

  useEffect(() => {
    const obtenerPonente = async () => {
      try {
        const { data } = await clienteAxios.get(`/ponentes/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Convertir string de tags a array si es necesario
        if(typeof data.tags === 'string') {
          data.tags = data.tags.split(',');
        }
        
        // Asegurarse que redes sea un objeto
        if(typeof data.redes === 'string') {
          data.redes = JSON.parse(data.redes);
        } else if(!data.redes) {
          data.redes = {};
        }
        
        setPonente(data);
      } catch (error) {
        console.error(error);
        setAlerta({
          msg: error.response?.data?.msg || 'Error al cargar el ponente',
          tipo: 'error'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerPonente();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    // Crear FormData del formulario directamente
    const formElement = e.target;
    const formData = new FormData(formElement);
    
    // Procesar redes sociales
    const redes = {};
    for (let [key, value] of formData.entries()) {
      if (key.includes('redes[')) {
        const redSocial = key.split('[')[1].split(']')[0];
        redes[redSocial] = value;
        formData.delete(key); // Eliminar la entrada original
      }
    }
    
    // Añadir redes como JSON
    formData.append('redes', JSON.stringify(redes));
    
    try {
      await clienteAxios.put(`/ponentes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setAlerta({
        msg: 'Ponente actualizado correctamente',
        tipo: 'exito'
      });
      
      // Redireccionar después de un tiempo
      setTimeout(() => {
        navigate('/admin/ponentes');
      }, 3000);
      
    } catch (error) {
      console.error(error);
      setAlerta({
        msg: error.response?.data?.msg || 'Hubo un error al actualizar el ponente',
        tipo: 'error'
      });
    } finally {
      setCargando(false);
    }
  };
  
  if(cargando && !ponente.id) return <p className="text-center">Cargando...</p>;
  
  return (
    <>
      <h2 className="dashboard__heading">{titulo}</h2>
      
      <div className="dashboard__contenedor-boton">
        <Link to="/admin/ponentes" className="dashboard__boton">
          <FaCircleArrowLeft />
          Volver
        </Link>
      </div>
      
      <div className="dashboard__formulario">
        {alerta.msg && <Alerta {...alerta} />}
        
        <form 
          className="formulario"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <FormularioPonente 
            ponente={ponente}
            alerta={alerta}
            setAlerta={setAlerta}
          />
          
          <input
            type="submit"
            className="formulario__submit formulario__submit--registrar"
            value={cargando ? "Procesando..." : "Actualizar Ponente"}
            disabled={cargando}
          />
        </form>
      </div>
    </>
  );
}