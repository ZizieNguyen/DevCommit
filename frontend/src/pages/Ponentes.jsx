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
  
  // NUEVO: Guardar la página actual para que PonenteDetail pueda acceder a ella
  useEffect(() => {
    localStorage.setItem('paginaActual', paginaActual);
  }, [paginaActual]);
  
  useEffect(() => {
    const obtenerPonentes = async () => {
      try {
        setCargando(true);
        
        const { data } = await clienteAxios(`/api/ponentes`, {
          params: {
            page: paginaActual
          }
        });
        
        console.log("Datos recibidos de la API:", data);
        console.log("Tipo de data.ponentes:", Array.isArray(data.ponentes) ? "Array" : typeof data.ponentes);
        
        // Si la respuesta es un string HTML con errores, es un problema del backend
        if (typeof data === 'string' && data.includes('<b>')) {
          console.error("Error en el backend:", data);
          setAlerta({
            tipo: 'error',
            mensaje: 'Error en el servidor. Contacte al administrador.'
          });
          setPonentes([]);
          return;
        }
        
        if (data && data.ponentes) {
          // Asegurar que ponentes sea un array
          const ponentesArray = Array.isArray(data.ponentes) ? data.ponentes : 
                             (typeof data.ponentes === 'object' ? [data.ponentes] : []);
          
          console.log("Ponentes para procesar:", ponentesArray.length);
          
          if (ponentesArray.length > 0) {
            console.log("Muestra del primer ponente:", ponentesArray[0]);
          }
          
          // Procesar todos los ponentes sin filtrar por ID
          const ponentesProcesados = ponentesArray.map((ponente, index) => {
            // Mantener el ID original sin modificaciones
            const id = ponente.id;
            
            // Generar una key para React (obligatoria y debe ser única)
            const reactKey = id !== undefined && id !== null ? 
              String(id) : `pos-${index}`;
                   
            // Generar ruta de imagen correcta
            let rutaImagen = null;
            
            // Si ya tiene ruta_imagen definida, usarla
            if (ponente.ruta_imagen) {
              rutaImagen = ponente.ruta_imagen;
            } 
            // Si tiene imagen pero no ruta_imagen
            else if (ponente.imagen) {
              // Caso especial para default_speaker
              if (ponente.imagen === 'default_speaker') {
                rutaImagen = '/img/speakers/default_speaker.png';
              } 
              // Caso especial para cdf2451e80e0243bb3a78d389e301efa
              else if (ponente.imagen === 'cdf2451e80e0243bb3a78d389e301efa') {
                rutaImagen = '/img/speakers/cdf2451e80e0243bb3a78d389e301efa.jpg';
              } 
              // Caso normal - usar el nombre de la imagen 
              else {
                rutaImagen = `/img/speakers/${ponente.imagen}`;
              }
            } 
            // Si no tiene ni imagen ni ruta_imagen
            else {
              rutaImagen = '/img/speakers/default_speaker.png';
            }
            
            return {
              ...ponente,
              id,                // ID original sin modificar
              reactKey,          // Key para React
              posicionEnLista: index + 1,  // NUEVO: Posición en la lista (1-based)
              ruta_imagen: rutaImagen
            };
          });
          
          // Log de depuración
          console.log("Ponentes procesados:", ponentesProcesados.map(p => ({
            nombre: p.nombre,
            id: p.id, 
            reactKey: p.reactKey,
            posicionEnLista: p.posicionEnLista
          })));
          
          setPonentes(ponentesProcesados);
          
          // Configurar paginación
          if (data.paginacion) {
            setTotalPaginas(data.paginacion.totalPaginas || 1);
          }
        } else {
          console.error("Formato de datos inesperado:", data);
          setAlerta({
            tipo: 'error',
            mensaje: 'Error en el formato de datos recibidos'
          });
          setPonentes([]);
        }
      } catch (error) {
        console.error("Error al cargar ponentes:", error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error al cargar los ponentes'
        });
        setPonentes([]);
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
          ponentes.map((ponente, index) => (
            <div className="ponente" key={`ponente-${ponente.reactKey || index}`}>
              <div className="ponente__imagen">
                <img 
                  src={
                    ponente.ruta_imagen ? 
                    `${import.meta.env.VITE_API_URL || ''}${ponente.ruta_imagen}` : 
                    `${import.meta.env.VITE_API_URL || ''}/img/speakers/default_speaker.png`
                  }
                  alt={`${ponente.nombre} ${ponente.apellido}`}
                  onError={(e) => {
                    console.log(`Error cargando imagen: ${e.target.src}`);
                    
                    // Verificar si es default_speaker sin extensión
                    if (e.target.src.includes('default_speaker') && !e.target.src.includes('.png')) {
                      e.target.src = `${import.meta.env.VITE_API_URL || ''}/img/speakers/default_speaker.png`;
                      return;
                    }
                    
                    // Si la URL ya incluye default_speaker.png, no intentar de nuevo
                    if (e.target.src.includes('default_speaker.png')) {
                      return;
                    }
                    
                    // Para el caso específico de cdf2451e80e0243bb3a78d389e301efa
                    if (ponente.imagen === 'cdf2451e80e0243bb3a78d389e301efa') {
                      e.target.src = `${import.meta.env.VITE_API_URL || ''}/img/speakers/cdf2451e80e0243bb3a78d389e301efa.jpg`;
                      return;
                    }
                    
                    // Para default_speaker (sin extensión)
                    if (ponente.imagen === 'default_speaker') {
                      e.target.src = `${import.meta.env.VITE_API_URL || ''}/img/speakers/default_speaker.png`;
                      return;
                    }
                    
                    // Si la ruta no tiene extensión pero el archivo sí
                    if (ponente.ruta_imagen && !ponente.ruta_imagen.includes('.') && ponente.imagen) {
                      e.target.src = `${import.meta.env.VITE_API_URL || ''}/img/speakers/${ponente.imagen}.jpg`;
                      return;
                    }
                    
                    // Última opción: usar default con extensión explícita
                    e.target.src = `${import.meta.env.VITE_API_URL || ''}/img/speakers/default_speaker.png`;
                  }}
                  className="ponente__img"
                />
              </div>
              
              <div className="ponente__informacion">
                <h3 className="ponente__nombre">
                  {ponente.nombre} {ponente.apellido}
                </h3>
                <p className="ponente__ubicacion">{ponente.ciudad}, {ponente.pais}</p>
                
                <div className="ponente__tags">
                  {ponente.tags && ponente.tags.split(',').map((tag, tagIndex) => (
                    <span 
                      key={`tag-${ponente.reactKey || index}-${tagIndex}`} 
                      className="ponente__tag"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                
                <div className="ponente__botones">
                  {/* MODIFICADO: Usar la posición en la lista en lugar del ID */}
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