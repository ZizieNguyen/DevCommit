
export const validarEmail = email => {
  const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  return regex.test(email);
};


export const validarURL = url => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


export const validarPassword = password => password.length >= 6;


export const validarCamposObligatorios = campos => {
  return !campos.some(campo => campo.trim() === '');
};


export const validarAlMenosUno = array => array.some(item => item);


export const validarDNI = dni => {
  const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  return regex.test(dni);
};


export const validarTelefono = tel => {
  const regex = /^[679]{1}[0-9]{8}$/;
  return regex.test(tel);
};


export const validarCP = cp => {
  const regex = /^[0-9]{5}$/;
  return regex.test(cp);
};


export const validarTamañoArchivo = (archivo, tamañoMax) => {
  const tamaño = archivo.size / 1024 / 1024; // convertir a MB
  return tamaño <= tamañoMax;
};


export const validarTipoArchivo = (archivo, tiposPermitidos) => {
  return tiposPermitidos.includes(archivo.type);
};