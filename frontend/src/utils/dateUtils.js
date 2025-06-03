export const formatearFecha = fecha => {
  if (!fecha) return '';
  
  let fechaObj;
  if (typeof fecha === 'string') {
    fechaObj = new Date(fecha);
  } else {
    fechaObj = fecha;
  }
  
  const opciones = {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  };
  
  return fechaObj.toLocaleDateString('es-ES', opciones);
};

export const formatearHora = fecha => {
  if (!fecha) return '';
  
  let fechaObj;
  if (typeof fecha === 'string') {
    fechaObj = new Date(fecha);
  } else {
    fechaObj = fecha;
  }
  
  const opciones = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return fechaObj.toLocaleTimeString('es-ES', opciones);
};