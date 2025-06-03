import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Alerta } from '../../components/ui/Alerta';
import { Spinner } from '../../components/ui/Spinner';
import EventoForm from '../../components/admin/EventoForm';

export default function AdminEditEventPage() {
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [alerta, setAlerta] = useState({});
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const respuesta = await api.get(`/admin/eventos/${id}`);
        setEvento(respuesta.evento || respuesta);
      } catch (error) {
        console.error(error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error al cargar el evento'
        });
      } finally {
        setCargando(false);
      }
    };
    
    cargarEvento();
  }, [id]);

  const handleSubmit = async (eventoActualizado) => {
  try {
    setEnviando(true);
    
    const { mensaje } = await api.put(`/admin/eventos/${id}`, eventoActualizado);
    
    setAlerta({
      tipo: 'exito',
      mensaje: mensaje || 'Evento actualizado correctamente'
    });

    setTimeout(() => {
      navigate('/admin/eventos');
    }, 3000);
  } catch (error) {
    console.error(error);
    setAlerta({
      tipo: 'error',
      mensaje: error.response?.data?.mensaje || 'Error al actualizar el evento'
    });
  } finally {
    setEnviando(false);
  }
};

  if (cargando) {
    return (
      <div className="centrar-spinner">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <h2 className="dashboard__heading">Editar Evento</h2>

      {alerta.mensaje && (
        <Alerta 
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}

      <div className="dashboard__formulario">
        <EventoForm 
          evento={evento}
          onSubmit={handleSubmit}
          cargando={enviando}
        />
      </div>
    </>
  );
}