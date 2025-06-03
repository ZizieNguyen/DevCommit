import express from 'express';
import { 
  listarEventos, 
  obtenerEvento,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  filtrarEventos,
  listarEventosAdmin 
} from '../controllers/eventosController.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', listarEventos); // Lista paginada para frontend público
router.get('/filtrar', filtrarEventos); // Filtrar con paginación
router.get('/:id', obtenerEvento); // Detalle de un evento

// Rutas protegidas para administradores
router.get('/admin', protegerRuta, esAdmin, listarEventosAdmin); // Nuevo endpoint para admin con paginación
router.post('/', protegerRuta, esAdmin, crearEvento);
router.put('/:id', protegerRuta, esAdmin, actualizarEvento);
router.delete('/:id', protegerRuta, esAdmin, eliminarEvento);

export default router;