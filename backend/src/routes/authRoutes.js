// src/routes/authRoutes.js
import express from 'express';
import { 
  registro, 
  confirmar, 
  login, 
  olvidePassword, 
  comprobarToken, 
  nuevoPassword, 
  perfil 
} from '../controllers/authController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';
import { auth } from '../utils/validations.js';

const router = express.Router();

// Rutas con esquemas de validación agrupados
router.post('/registro', validar(auth.registro), registro);
router.post('/login', validar(auth.login), login);
router.post('/olvide-password', validar(auth.olvidePassword), olvidePassword);
router.post('/olvide-password/:token', validar(auth.nuevoPassword), nuevoPassword);

// Rutas sin validación de cuerpo
router.get('/confirmar/:token', confirmar);
router.get('/olvide-password/:token', comprobarToken);
router.get('/perfil', protegerRuta, perfil);

export default router;