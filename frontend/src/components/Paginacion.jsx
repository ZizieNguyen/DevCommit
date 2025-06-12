export default function Paginacion({ 
  paginaActual = 1, 
  totalPaginas = 1,
  registrosPorPagina = 10, 
  totalRegistros = 0, 
  onChange 
}) {
  // Método equivalente a total_paginas() en PHP
  const calcularTotalPaginas = () => {
    let total = Math.ceil(totalRegistros / registrosPorPagina);
    total = total === 0 ? 1 : total;
    return total;
  };

  
  // Método que equivale a pagina_anterior() en PHP
  const paginaAnterior = () => {
    return paginaActual > 1 ? paginaActual - 1 : false;
  };
  
  // Método que equivale a pagina_siguiente() en PHP
  const paginaSiguiente = () => {
    return paginaActual < totalPaginas ? paginaActual + 1 : false;
  };
  
  // Método que equivale a enlace_anterior() en PHP
  const enlaceAnterior = () => {
    if(paginaAnterior()) {
      return (
        <a 
          className="paginacion__enlace paginacion__enlace--texto" 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onChange(paginaAnterior());
          }}
        >
          &laquo; Anterior
        </a>
      );
    }
    return null;
  };
  
  // Método que equivale a enlace_siguiente() en PHP
  const enlaceSiguiente = () => {
    if(paginaSiguiente()) {
      return (
        <a 
          className="paginacion__enlace paginacion__enlace--texto" 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            onChange(paginaSiguiente());
          }}
        >
          Siguiente &raquo;
        </a>
      );
    }
    return null;
  };
  
  // Método que equivale a numeros_paginas() en PHP
  const numerosPaginas = () => {
    const enlaces = [];
    const totalPaginas = calcularTotalPaginas();
    
    for(let i = 1; i <= totalPaginas; i++) {
      if(i === paginaActual) {
        enlaces.push(
          <span 
            key={i} 
            className="paginacion__enlace paginacion__enlace--actual"
          >
            {i}
          </span>
        );
      } else {
        enlaces.push(
          <a 
            key={i} 
            className="paginacion__enlace paginacion__enlace--numero"
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onChange(i);
            }}
          >
            {i}
          </a>
        );
      }
    }
    return enlaces;
  };

  // Solo renderizar si hay más de un registro (igual que PHP)
  if (totalPaginas <= 1) return null;
  
  return (
    <div className="paginacion">
      {enlaceAnterior()}
      {numerosPaginas()}
      {enlaceSiguiente()}
    </div>
  );
}