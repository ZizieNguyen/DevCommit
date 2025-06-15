import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clienteAxios } from '../config/axios';
import Spinner from '../components/Spinner';
import Alerta from '../components/alertas/Alerta';
import Paginacion from '../components/Paginacion';
import '../styles/ponentes.css';

export default function Ponentes() {
  const [ponentes, setPonentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  
  useEffect(() => {
  const obtenerPonentes = async () => {
    try {
      setCargando(true);
      
      // Cambiar 'pagina' por 'page' para que coincida con lo que espera el backend
      const { data } = await clienteAxios(`/api/ponentes`, {
        params: {
          page: paginaActual // Usar 'page' en lugar de 'pagina'
        }
      });
      
      console.log("Datos recibidos de la API:", data);
      
      if (data && data.ponentes && Array.isArray(data.ponentes)) {
        // Limpiar los ponentes anteriores antes de establecer los nuevos
        setPonentes([]);
        setPonentes(data.ponentes);
        
        // Usar la información de paginación que proporciona el backend
        if (data.paginacion) {
          setTotalPaginas(data.paginacion.totalPaginas || 1);
          console.log(`Página actual: ${paginaActual}, Total páginas: ${data.paginacion.totalPaginas}`);
        }
      } else {
        console.error("Formato de datos inesperado:", data);
        setPonentes([]);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error en el formato de datos recibidos'
        });
      }
    } catch (error) {
      console.error("Error completo:", error);
      setPonentes([]);
      setAlerta({
        tipo: 'error',
        mensaje: 'Error al cargar los ponentes'
      });
    } finally {
      setCargando(false);
    }
  };
  
  obtenerPonentes();
}, [paginaActual]);
  
  // Manejar cambio de página
  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo(0, 0);
  };
  
  if (cargando) return <Spinner />;
  
  return (
    <main className="ponentes">
      <h2 className="ponentes__heading">Nuestros Ponentes</h2>
      <p className="ponentes__descripcion">Conoce a los expertos de DevCommit</p>
      
      {alerta.mensaje && (
        <Alerta
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}
      
      <div className="ponentes__grid">
        {ponentes.length === 0 ? (
          <p className="ponentes__no-resultados">No hay ponentes disponibles.</p>
        ) : (
          ponentes.map(ponente => (
            <div className="ponente" key={ponente.id}>
              <div className="ponente__imagen">
                {/* <img 
                  src={`${import.meta.env.VITE_API_URL || ''}/img/speakers/${ponente.imagen}`}
                  alt={`${ponente.nombre} ${ponente.apellido}`}
                  onError={(e) => {
                    console.log(`Error al cargar: ${e.target.src}`);
                    // Cargar la imagen por defecto si falla la carga
                    e.target.src = `${import.meta.env.VITE_API_URL || ''}/img/speakers/default_speaker.jpg`;
                    e.target.onerror = null; // Prevenir bucle infinito
                  }}
                /> */}
              </div>
              
              <div className="ponente__informacion">
                <h3 className="ponente__nombre">
                  {ponente.nombre} {ponente.apellido}
                </h3>
                <p className="ponente__ubicacion">{ponente.ciudad}, {ponente.pais}</p>
                
                <div className="ponente__tags">
                  {ponente.tags && ponente.tags.split(',').map((tag, index) => (
                    <span 
                      key={index}
                      className="ponente__tag"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                
                <div className="ponente__botones">
                  <Link 
                    to={`/ponentes/${ponente.id}`} 
                    className="ponente__enlace"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ponente__icono">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    Ver Perfil
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Componente de paginación */}
      {totalPaginas > 1 && (
        <div className="ponentes__paginacion">
          <Paginacion 
            paginaActual={paginaActual} 
            totalPaginas={totalPaginas}
            onChange={cambiarPagina}
          />
        </div>
      )}
    </main>
  );
}