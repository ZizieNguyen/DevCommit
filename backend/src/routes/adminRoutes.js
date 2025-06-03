import express from 'express';
import { 
  listarEventosAdmin 
} from '../controllers/eventosController.js';
import { 
  listarPonentesAdmin 
} from '../controllers/ponentesController.js';
import { 
  obtenerRegistrosAdmin 
} from '../controllers/registrosController.js';
import { 
  listarUsuarios, 
  cambiarRolAdmin 
} from '../controllers/usuariosController.js';
import {
  obtenerDashboardStats,
  obtenerRegistrosRecientes,
  obtenerEventosProximos
} from '../controllers/adminController.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Proteger todas las rutas de admin
router.use(protegerRuta);
router.use(esAdmin);

// Rutas de administración
router.get('/usuarios', listarUsuarios);
router.get('/eventos', listarEventosAdmin);
router.get('/ponentes', listarPonentesAdmin);
router.get('/registros', obtenerRegistrosAdmin);
router.patch('/usuarios/:id/admin', cambiarRolAdmin);

// Rutas específicas del dashboard
router.get('/estadisticas', obtenerDashboardStats);
router.get('/registros/ultimos', obtenerRegistrosRecientes);
router.get('/eventos/proximos', obtenerEventosProximos);

export default router;