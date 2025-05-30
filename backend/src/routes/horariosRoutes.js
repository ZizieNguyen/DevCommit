import express from 'express';
import {
    listarHorarios,
    obtenerHorario,
    listarDias,
    listarHorasPorDia,
    crearHorario,
    actualizarHorario,
    cambiarDisponibilidad,
    eliminarHorario
} from '../controllers/horariosController.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';
import { horarios } from '../utils/validations.js';

const router = express.Router();

// Rutas públicas
router.get('/', listarHorarios);
router.get('/dias', listarDias);
router.get('/horas/:dia', listarHorasPorDia);
router.get('/:id', obtenerHorario);

// Rutas protegidas (solo admin)
router.use(protegerRuta);
router.use(esAdmin);

router.post('/', [validar(horarios.crear), crearHorario]);
router.put('/:id', [validar(horarios.actualizar), actualizarHorario]);
router.patch('/:id/disponibilidad', cambiarDisponibilidad);
router.delete('/:id', eliminarHorario);

export default router;