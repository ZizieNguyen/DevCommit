import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Alerta } from '../../components/ui/Alerta';
import EventoForm from '../../components/admin/EventoForm';

export default function AdminNewEventPage() {
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (evento) => {
  try {
    setCargando(true);
    
    const { mensaje } = await api.post('/admin/eventos', evento);
    
    setAlerta({
      tipo: 'exito',
      mensaje: mensaje || 'Evento creado correctamente'
    });
    

    setTimeout(() => {
      navigate('/admin/eventos');
    }, 3000);
  } catch (error) {
    console.error(error);
    setAlerta({
      tipo: 'error',
      mensaje: error.response?.data?.mensaje || 'Error al crear el evento'
    });
  } finally {
    setCargando(false);
  }
};

  return (
    <>
      <h2 className="dashboard__heading">Añadir Evento</h2>

      {alerta.mensaje && (
        <Alerta 
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}

      <div className="dashboard__formulario">
        <EventoForm 
          onSubmit={handleSubmit}
          cargando={cargando}
        />
      </div>
    </>
  );
}