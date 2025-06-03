/**
 * Genera ID único
 */
export const generarId = () => {
  const random = Math.random().toString(36).substring(2);
  const fecha = Date.now().toString(36);
  return random + fecha;
};

/**
 * Limita ejecución de función (debounce)
 */
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Ordena array por propiedad
 */
export const ordenarPor = (array, propiedad, orden = 'asc') => {
  return [...array].sort((a, b) => {
    const factorOrden = orden === 'asc' ? 1 : -1;
    if (a[propiedad] < b[propiedad]) return -1 * factorOrden;
    if (a[propiedad] > b[propiedad]) return 1 * factorOrden;
    return 0;
  });
};

/**
 * Filtra array por texto en propiedad
 */
export const filtrarPor = (array, propiedad, texto) => {
  const textoLower = texto.toLowerCase();
  return array.filter(item => 
    item[propiedad].toLowerCase().includes(textoLower)
  );
};

/**
 * Agrupa array por propiedad
 */
export const agruparPor = (array, propiedad) => {
  return array.reduce((acc, item) => {
    const key = item[propiedad];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Maneja errores async/await
 */
export const manejarAsync = async promise => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
};

/**
 * Obtiene valor de cookie por nombre
 */
export const obtenerCookie = nombre => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(nombre + '='));
  return cookie ? cookie.split('=')[1] : null;
};