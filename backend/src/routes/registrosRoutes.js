import express from 'express';
import { 
  crearRegistro, 
  obtenerMisRegistros,
  obtenerRegistrosAdmin, // Función con paginación
  obtenerRegistroPorId,
  actualizarRegistro,
  eliminarRegistro 
} from '../controllers/registrosController.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas para usuarios autenticados
router.get('/mis-registros', protegerRuta, obtenerMisRegistros);
router.post('/', protegerRuta, crearRegistro);

// Rutas para administradores
router.get('/admin', protegerRuta, esAdmin, obtenerRegistrosAdmin); // Endpoint admin con paginación
router.get('/:id', protegerRuta, esAdmin, obtenerRegistroPorId);
router.put('/:id', protegerRuta, esAdmin, actualizarRegistro);
router.delete('/:id', protegerRuta, esAdmin, eliminarRegistro);

export default router;