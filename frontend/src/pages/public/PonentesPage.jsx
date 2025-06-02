import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Spinner } from '../../components/ui/Spinner';
import { Alerta } from '../../components/ui/Alerta';
import PonenteCard from "../../components/ponentes/PonenteCard";

export default function PonentesPage() {
  const [ponentes, setPonentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  useEffect(() => {
    const obtenerPonentes = async () => {
      try {
        setCargando(true);
        const data = await api.get('/ponentes');
        setPonentes(data);
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
  
  if (cargando) return <Spinner />;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Ponentes</h1>
      
      {alerta.mensaje && (
        <Alerta 
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
        />
      )}
      
      {ponentes.length === 0 ? (
        <p className="text-center text-gray-600">No hay ponentes registrados</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ponentes.map(ponente => (
            <PonenteCard 
              key={ponente.id}
              ponente={ponente}
            />
          ))}
        </div>
      )}
    </div>
  );
}