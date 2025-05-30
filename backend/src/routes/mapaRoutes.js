// src/routes/mapaRoutes.js
import express from 'express';
import { obtenerDatosSede } from '../controllers/mapasController.js';

const router = express.Router();

// Ruta pública para obtener datos de la sede
router.get('/sede', obtenerDatosSede);

export default router;

