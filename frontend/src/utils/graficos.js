import Chart from 'chart.js/auto';

/**
 * Crea gráfico de barras
 */
export const crearGraficoBarras = (canvasId, datos, opciones = {}) => {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  return new Chart(ctx, {
    type: 'bar',
    data: datos,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: opciones.titulo || 'Gráfico de Barras'
        }
      },
      scales: {
        y: { beginAtZero: true }
      },
      ...opciones
    }
  });
};

/**
 * Crea gráfico circular
 */
export const crearGraficoCircular = (canvasId, datos, opciones = {}) => {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  return new Chart(ctx, {
    type: 'pie',
    data: datos,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: opciones.titulo || 'Gráfico Circular'
        }
      },
      ...opciones
    }
  });
};

/**
 * Crea gráfico de línea
 */
export const crearGraficoLinea = (canvasId, datos, opciones = {}) => {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  return new Chart(ctx, {
    type: 'line',
    data: datos,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: opciones.titulo || 'Gráfico de Línea'
        }
      },
      scales: {
        y: { beginAtZero: true }
      },
      ...opciones
    }
  });
};