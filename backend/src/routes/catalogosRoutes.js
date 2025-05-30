import express from 'express';
import {
    listarCatalogos,
    obtenerCatalogo,
    crearCatalogo,
    actualizarCatalogo,
    eliminarCatalogo
} from '../controllers/catalogosController.js';
import { protegerRuta, esAdmin } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';
import { catalogos } from '../utils/validations.js';

const router = express.Router();

// Rutas públicas
router.get('/:tipo', listarCatalogos);
router.get('/detalle/:id', obtenerCatalogo);

// Rutas protegidas (solo admin)
router.use(protegerRuta);
router.use(esAdmin);

router.post('/', [validar(catalogos.crear), crearCatalogo]);
router.put('/:id', [validar(catalogos.actualizar), actualizarCatalogo]);
router.delete('/:id', eliminarCatalogo);

export default router;