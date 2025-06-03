import { useState, useEffect } from 'react';

export const Paginacion = ({ pagina, totalPaginas, onChange }) => {
  const [paginasVisibles, setPaginasVisibles] = useState([]);
  
  useEffect(() => {
    // Determinar qué páginas mostrar
    const calcularPaginasVisibles = () => {
      // Para pantallas pequeñas o pocas páginas, mostrar solo algunas
      if (totalPaginas <= 5) {
        return Array.from({ length: totalPaginas }, (_, i) => i + 1);
      }
      
      // Para muchas páginas, mostrar un subconjunto
      if (pagina <= 3) {
        return [1, 2, 3, 4, 5, '...', totalPaginas];
      } else if (pagina >= totalPaginas - 2) {
        return [1, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
      } else {
        return [1, '...', pagina - 1, pagina, pagina + 1, '...', totalPaginas];
      }
    };
    
    setPaginasVisibles(calcularPaginasVisibles());
  }, [pagina, totalPaginas]);
  
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina === '...' || nuevaPagina === pagina) return;
    onChange(nuevaPagina);
  };
  
  if (totalPaginas <= 1) return null;
  
  return (
    <div className="flex justify-center mt-10 gap-2">
      {/* Botón anterior */}
      <button 
        className={`px-3 py-2 rounded-md ${pagina === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        onClick={() => pagina > 1 && cambiarPagina(pagina - 1)}
        disabled={pagina === 1}
      >
        &laquo;
      </button>
      
      {/* Números de página */}
      {paginasVisibles.map((numeroPagina, index) => (
        <button 
          key={index}
          className={`${
            numeroPagina === pagina 
              ? "bg-primary text-white" 
              : numeroPagina === '...' 
                ? "bg-gray-100 cursor-default" 
                : "bg-gray-200 hover:bg-gray-300"
          } px-4 py-2 rounded-md`}
          onClick={() => cambiarPagina(numeroPagina)}
        >
          {numeroPagina}
        </button>
      ))}
      
      {/* Botón siguiente */}
      <button 
        className={`px-3 py-2 rounded-md ${pagina === totalPaginas ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        onClick={() => pagina < totalPaginas && cambiarPagina(pagina + 1)}
        disabled={pagina === totalPaginas}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Paginacion;