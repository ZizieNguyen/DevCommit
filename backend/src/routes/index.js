// src/routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import ponentesRoutes from './ponentesRoutes.js';
import eventosRoutes from './eventosRoutes.js';
import catalogosRoutes from './catalogosRoutes.js';
import horariosRoutes from './horariosRoutes.js';
import registrosRoutes from './registrosRoutes.js';
import pagosRoutes from './pagosRoutes.js';
import mapaRoutes from './mapaRoutes.js';
import regalosRoutes from './regalosRoutes.js';
import adminRoutes from './adminRoutes.js';
import { pool } from '../config/db.js';

const router = express.Router();

// Ruta de estado para probar la conexión
router.get('/status', async (req, res) => {
  try {
    // Probar conexión a BD con una consulta simple
    const [result] = await pool.query('SELECT 1 as connected');
    
    res.json({
      status: 'online',
      server: true,
      database: result[0].connected === 1,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      server: true,
      database: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


router.use('/auth', authRoutes);


router.use('/admin', adminRoutes);


router.use('/ponentes', ponentesRoutes);


router.use('/eventos', eventosRoutes);


router.use('/catalogos', catalogosRoutes);


router.use('/horarios', horariosRoutes);


router.use('/registros', registrosRoutes);


router.use('/pagos', pagosRoutes);


router.use('/mapa', mapaRoutes);


router.use('/regalos', regalosRoutes);

export default router;