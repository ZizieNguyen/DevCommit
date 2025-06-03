/**
 * Genera una notificación temporal
 */
export const mostrarNotificacion = (mensaje, tipo = 'info', duracion = 3000) => {
  // Crear contenedor si no existe
  let contenedor = document.getElementById('notificaciones');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'notificaciones';
    contenedor.style.position = 'fixed';
    contenedor.style.top = '20px';
    contenedor.style.right = '20px';
    contenedor.style.zIndex = '9999';
    document.body.appendChild(contenedor);
  }
  
  // Crear notificación
  const notificacion = document.createElement('div');
  notificacion.textContent = mensaje;
  notificacion.className = `notificacion notificacion--${tipo}`;
  notificacion.style.marginBottom = '10px';
  notificacion.style.padding = '10px 20px';
  notificacion.style.borderRadius = '4px';
  notificacion.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  
  // Estilo según tipo
  if (tipo === 'error') {
    notificacion.style.backgroundColor = '#f8d7da';
    notificacion.style.color = '#721c24';
  } else if (tipo === 'success') {
    notificacion.style.backgroundColor = '#d4edda';
    notificacion.style.color = '#155724';
  } else {
    notificacion.style.backgroundColor = '#d1ecf1';
    notificacion.style.color = '#0c5460';
  }
  
  // Añadir y eliminar después de tiempo
  contenedor.appendChild(notificacion);
  setTimeout(() => {
    notificacion.style.opacity = '0';
    notificacion.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      contenedor.removeChild(notificacion);
    }, 500);
  }, duracion);
};

/**
 * Anima scroll suave a un elemento
 */
export const scrollAElemento = (elementoId, offset = 0) => {
  const elemento = document.getElementById(elementoId);
  if (!elemento) return;
  
  const y = elemento.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
};

/**
 * Alterna clase en elemento
 */
export const toggleClase = (elemento, clase) => {
  if (elemento.classList.contains(clase)) {
    elemento.classList.remove(clase);
    return false;
  } else {
    elemento.classList.add(clase);
    return true;
  }
};