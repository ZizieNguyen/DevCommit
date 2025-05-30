/**
 * Controlador para la gestión de catálogos
 */
import catalogoService from '../services/catalogoService.js';
import { generarError } from '../utils/helpers.js'; // Importamos generarError

/**
 * Listar elementos de un catálogo por tipo
 */
const listarCatalogos = async (req, res) => {
    try {
        const { tipo } = req.params;
        
        // Validar que el tipo sea válido usando generarError
        if (!['categoria', 'paquete', 'regalo'].includes(tipo)) {
            throw generarError(400, 'ValidationError', 'Tipo de catálogo inválido');
        }
        
        const catalogos = await catalogoService.listar(tipo);
        
        // Respuesta consistente con formato estándar
        res.json({
            resultado: true,
            catalogos
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            resultado: false,
            msg: error.message || `Error al listar ${req.params.tipo}s`
        });
    }
};

/**
 * Obtener un elemento de catálogo por ID
 */
const obtenerCatalogo = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            throw generarError(400, 'ValidationError', 'El ID del catálogo es requerido');
        }
        
        const catalogo = await catalogoService.buscarPorId(id);
        
        res.json({
            resultado: true,
            catalogo
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            resultado: false,
            msg: error.message || 'Error al obtener elemento del catálogo'
        });
    }
};

/**
 * Crear un nuevo elemento de catálogo
 */
const crearCatalogo = async (req, res) => {
    try {
        const { tipo, nombre, descripcion } = req.body;
        
        // Validaciones
        if (!tipo || !nombre) {
            throw generarError(400, 'ValidationError', 'El tipo y nombre son obligatorios');
        }
        
        if (!['categoria', 'paquete', 'regalo'].includes(tipo)) {
            throw generarError(400, 'ValidationError', 'Tipo de catálogo inválido');
        }
        
        const catalogo = await catalogoService.crear({
            tipo,
            nombre,
            descripcion
        });
        
        res.status(201).json({
            resultado: true,
            msg: `${tipo} creado correctamente`,
            catalogo
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            resultado: false,
            msg: error.message || 'Error al crear elemento del catálogo'
        });
    }
};

/**
 * Actualizar un elemento de catálogo
 */
const actualizarCatalogo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        
        if (!id) {
            throw generarError(400, 'ValidationError', 'El ID del catálogo es requerido');
        }
        
        // Construir objeto de datos a actualizar
        const datos = {};
        if (nombre) datos.nombre = nombre;
        if (descripcion !== undefined) datos.descripcion = descripcion; // Permitir string vacío
        
        // Verificar que haya datos para actualizar
        if (Object.keys(datos).length === 0) {
            throw generarError(400, 'ValidationError', 'Se requiere al menos un campo para actualizar');
        }
        
        const catalogo = await catalogoService.actualizar(id, datos);
        
        res.json({
            resultado: true,
            msg: `${catalogo.tipo} actualizado correctamente`,
            catalogo
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            resultado: false,
            msg: error.message || 'Error al actualizar elemento del catálogo'
        });
    }
};

/**
 * Eliminar un elemento de catálogo
 */
const eliminarCatalogo = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            throw generarError(400, 'ValidationError', 'El ID del catálogo es requerido');
        }
        
        const catalogo = await catalogoService.buscarPorId(id);
        
        await catalogoService.eliminar(id);
        
        res.json({
            resultado: true,
            msg: `${catalogo.tipo} eliminado correctamente`
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            resultado: false,
            msg: error.message || 'Error al eliminar elemento del catálogo'
        });
    }
};

export {
    listarCatalogos,
    obtenerCatalogo,
    crearCatalogo,
    actualizarCatalogo,
    eliminarCatalogo
};