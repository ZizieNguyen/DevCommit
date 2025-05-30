import express from 'express';
import {
    listarRegistros,
    obtenerRegistro,
    obtenerRegistroPorToken,
    misRegistros,
    crearRegistro,
    actualizarPago,
    eliminarRegistro
} from '../controllers/registrosController.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';
import { registros } from '../utils/validations.js';

const router = express.Router();

// Rutas que requieren autenticación
router.use(protegerRuta);

// Rutas para usuarios autenticados
router.get('/mis-registros', misRegistros);
router.post('/', [validar(registros.crear), crearRegistro]);
router.get('/token/:token', obtenerRegistroPorToken);

// Rutas solo para administradores
router.use(esAdmin);
router.get('/', listarRegistros);
router.get('/:id', obtenerRegistro);
router.patch('/:id/pago', [validar(registros.actualizarPago), actualizarPago]);
router.delete('/:id', eliminarRegistro);

export default router;