// src/routes/ponentesRoutes.js
import express from 'express';
import { 
  listarPonentes, 
  obtenerPonente, 
  crearPonente,
  actualizarPonente,
  eliminarPonente
} from '../controllers/ponentesController.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';
import { handleUploadErrors } from '../middlewares/uploadMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';
import { ponentes } from '../utils/validations.js';

const router = express.Router();

// Rutas públicas
router.get('/', listarPonentes);
router.get('/:id', obtenerPonente);

// Rutas protegidas (solo admin)
// Para crear un ponente
router.post('/', [
  protegerRuta,
  esAdmin,
  handleUploadErrors,  // Procesamos primero la subida de archivos
  validar(ponentes.crear),  // Luego validamos los datos
  crearPonente
]);

// Para actualizar un ponente
router.put('/:id', [
  protegerRuta,
  esAdmin,
  handleUploadErrors,  // Procesamos primero la subida de archivos
  validar(ponentes.actualizar),  // Luego validamos los datos
  actualizarPonente
]);

// Para eliminar un ponente
router.delete('/:id', [
  protegerRuta,
  esAdmin,
  eliminarPonente
]);

export default router;