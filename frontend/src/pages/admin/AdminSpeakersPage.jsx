import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Spinner } from '../../components/ui/Spinner';
import { Alerta } from '../../components/ui/Alerta';

export default function AdminSpeakersPage() {
  const [ponentes, setPonentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  useEffect(() => {
    const obtenerPonentes = async () => {
      try {
        const data = await api.get('/ponentes');
        setPonentes(data);
      } catch (error) {
        console.error(error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error al obtener los ponentes'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerPonentes();
  }, []);
  
  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este ponente?')) return;
    
    try {
      await api.delete(`/ponentes/${id}`);
      
      // Actualizar la lista
      setPonentes(ponentes.filter(ponente => ponente.id !== id));
      
      setAlerta({
        tipo: 'success',
        mensaje: 'Ponente eliminado correctamente'
      });
    } catch (error) {
      console.error(error);
      setAlerta({
        tipo: 'error',
        mensaje: 'Error al eliminar el ponente'
      });
    }
  };
  
  if (cargando) return <Spinner />;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Administrar Ponentes</h2>
        
        <Link 
          to="/admin/ponentes/nuevo"
          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md"
        >
          Nuevo Ponente
        </Link>
      </div>
      
      {alerta.mensaje && (
        <Alerta 
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
        />
      )}
      
      {ponentes.length === 0 ? (
        <p className="text-center text-gray-600">No hay ponentes registrados</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ponentes.map(ponente => (
            <div 
              key={ponente.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img 
                src={ponente.imagen ? `/img/speakers/${ponente.imagen}` : '/img/speakers/speaker_default.jpg'} 
                alt={`${ponente.nombre} ${ponente.apellido}`}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">{ponente.nombre} {ponente.apellido}</h3>
                <p className="text-gray-500 text-sm mb-2">{ponente.ciudad}, {ponente.pais}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {ponente.tags?.split(',').map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Link 
                    to={`/admin/ponentes/${ponente.id}/editar`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(ponente.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}