import express from 'express';
import { listarRegalos, obtenerEstadisticas } from '../controllers/regalosController.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', listarRegalos);

// Rutas para admin
router.get('/estadisticas', [protegerRuta, esAdmin], obtenerEstadisticas);

export default router;