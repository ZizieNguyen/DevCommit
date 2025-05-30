// src/services/mapaService.js
const mapaService = {
  async inicializarMapa(elementoId, lat, lng, zoom = 16) {
    // Inicializa un mapa en el elemento DOM especificado
    const map = L.map(elementoId).setView([lat, lng], zoom);
    
    // Añadir capa base de OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    // Añadir marcador
    L.marker([lat, lng]).addTo(map)
      .bindPopup(`
        <h2 class="mapa__heading">DevCommit</h2>
        <p class="mapa__texto">Centro de Convenciones de Madrid</p>
      `)
      .openPopup();
    
    return map;
  }
};

export default mapaService;