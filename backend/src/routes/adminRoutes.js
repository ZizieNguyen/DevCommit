import express from 'express';
import { eventosController, ponentesController, registrosController, usuariosController } from '../controllers/index.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Proteger todas las rutas de admin
router.use(protegerRuta);
router.use(esAdmin);


router.get('/usuarios', usuariosController.listarUsuarios);

// Otras rutas de administrador
router.get('/eventos', eventosController.listarEventos);
router.get('/ponentes', ponentesController.listarPonentes);
router.get('/registros', registrosController.listarRegistros);

// Actualizar estatus admin de un usuario
router.patch('/usuarios/:id/admin', usuariosController.cambiarRolAdmin);

// Rutas para estadísticas
router.get('/estadisticas', registrosController.obtenerEstadisticas);

export default router;