import express from 'express';
import {
    listarEventos,
    obtenerEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    filtrarEventos
} from '../controllers/eventosController.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';
import { eventos } from '../utils/validations.js';

const router = express.Router();

// Rutas públicas
router.get('/', listarEventos);
router.get('/filtrar', filtrarEventos);
router.get('/:id', obtenerEvento);

// Rutas protegidas (solo admin)
router.use(protegerRuta);
router.use(esAdmin);

router.post('/', [validar(eventos.crear), crearEvento]);
router.put('/:id', [validar(eventos.actualizar), actualizarEvento]);
router.delete('/:id', eliminarEvento);

export default router;