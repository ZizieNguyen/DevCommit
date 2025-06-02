/**
 * Formatea una fecha en formato ISO a formato legible
 * @param {string} fecha - Fecha en formato ISO
 * @param {object} opciones - Opciones de formato
 * @returns {string} Fecha formateada
 */
export const formatFecha = (fecha, opciones = {}) => {
  const opcionesPorDefecto = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opciones
  };
  
  return new Date(fecha).toLocaleDateString('es-ES', opcionesPorDefecto);
};

/**
 * Formatea un precio a moneda local
 * @param {number} precio - Precio a formatear
 * @param {string} moneda - Código de moneda (por defecto EUR)
 * @returns {string} Precio formateado
 */
export const formatPrecio = (precio, moneda = 'EUR') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: moneda
  }).format(precio);
};

/**
 * Trunca un texto si excede cierta longitud
 * @param {string} texto - Texto a truncar
 * @param {number} longitud - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncarTexto = (texto, longitud = 100) => {
  if (!texto) return '';
  return texto.length > longitud ? `${texto.substring(0, longitud)}...` : texto;
};

/**
 * Crea un slug a partir de un texto
 * @param {string} texto - Texto para convertir en slug
 * @returns {string} Slug generado
 */
export const crearSlug = (texto) => {
  return texto
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};