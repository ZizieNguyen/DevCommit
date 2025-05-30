// src/routes/pagosRoutes.js
import express from 'express';
import pagoController from '../controllers/pagosController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';

const router = express.Router();

// === PAGO CON TARJETA (STRIPE) ===
// Proceso directo de pago (cargo directo)
router.post('/tarjeta', protegerRuta, pagoController.procesarPagoTarjeta);

// === REEMBOLSOS Y GESTIÓN ===
router.post('/reembolso/:registro_id', protegerRuta, pagoController.crearReembolso);

// === CONFIGURACIÓN Y UTILIDADES ===
router.get('/configuracion', pagoController.obtenerConfiguracion);

export default router;