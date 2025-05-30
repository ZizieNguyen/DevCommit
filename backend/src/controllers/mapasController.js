import { generarError } from '../utils/helpers.js';

const obtenerDatosSede = (req, res) => {
  try {
    // En un caso real estos datos podrían venir de la base de datos
    const datosSede = {
      lat: 40.4167, // Madrid
      lng: -3.7033,
      zoom: 16,
      titulo: 'DevCommit 2024',
      direccion: 'Centro de Convenciones, Madrid'
    };
    
    // Validar que los datos son correctos
    if (!datosSede.lat || !datosSede.lng) {
      throw generarError(500, 'DataError', 'Datos de ubicación incorrectos');
    }
    
    res.json(datosSede);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error.message || 'Error al obtener datos de la sede' });
  }
};

export {
  obtenerDatosSede
};