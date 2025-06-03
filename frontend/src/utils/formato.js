/**
 * Formatea fecha a formato largo en español
 */
export const formatearFecha = fecha => {
  const nuevaFecha = new Date(fecha);
  const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return nuevaFecha.toLocaleDateString('es-ES', opciones);
};

/**
 * Formatea hora (HH:MM:SS → HH:MM)
 */
export const formatearHora = hora => hora ? hora.slice(0, 5) : '';

/**
 * Formatea número como moneda
 */
export const formatearDinero = (cantidad, moneda = 'EUR') => {
  return cantidad.toLocaleString('es-ES', {
    style: 'currency',
    currency: moneda
  });
};

/**
 * Formatea número con separadores de miles
 */
export const formatearNumero = numero => numero.toLocaleString('es-ES');

/**
 * Capitaliza primera letra de un texto
 */
export const capitalizar = texto => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Trunca un texto a una longitud determinada
 */
export const truncarTexto = (texto, longitud = 100) => {
  if (!texto || texto.length <= longitud) return texto;
  return texto.slice(0, longitud) + '...';
};