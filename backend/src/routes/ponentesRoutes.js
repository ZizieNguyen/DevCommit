import express from 'express';
import { 
  listarPonentes, 
  obtenerPonente,
  crearPonente,
  actualizarPonente,
  eliminarPonente,
  listarPonentesAdmin 
} from '../controllers/ponentesController.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', listarPonentes); // Lista paginada para frontend público
router.get('/:id', obtenerPonente); 

// Rutas protegidas para administradores
router.get('/admin', protegerRuta, esAdmin, listarPonentesAdmin); // Endpoint admin con paginación
router.post('/', protegerRuta, esAdmin, crearPonente);
router.put('/:id', protegerRuta, esAdmin, actualizarPonente);
router.delete('/:id', protegerRuta, esAdmin, eliminarPonente);

export default router;