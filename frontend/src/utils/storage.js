/**
 * Guarda datos en localStorage
 */
export const guardarEnLS = (clave, valor) => {
  localStorage.setItem(clave, JSON.stringify(valor));
};

/**
 * Recupera datos de localStorage
 */
export const obtenerDeLS = (clave, valorDefecto = null) => {
  const valor = localStorage.getItem(clave);
  return valor ? JSON.parse(valor) : valorDefecto;
};

/**
 * Elimina datos de localStorage
 */
export const eliminarDeLS = clave => {
  localStorage.removeItem(clave);
};

/**
 * Guarda datos en sessionStorage
 */
export const guardarEnSS = (clave, valor) => {
  sessionStorage.setItem(clave, JSON.stringify(valor));
};

/**
 * Recupera datos de sessionStorage
 */
export const obtenerDeSS = (clave, valorDefecto = null) => {
  const valor = sessionStorage.getItem(clave);
  return valor ? JSON.parse(valor) : valorDefecto;
};

/**
 * Elimina datos de sessionStorage
 */
export const eliminarDeSS = clave => {
  sessionStorage.removeItem(clave);
};