import horarioService from '../services/horarioService.js';

// Listar todos los horarios
const listarHorarios = async (req, res) => {
    try {
        const horarios = await horarioService.listar();
        res.json(horarios);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ msg: error.message || 'Error al listar horarios' });
    }
};

// Obtener un horario específico
const obtenerHorario = async (req, res) => {
    try {
        const { id } = req.params;
        const horario = await horarioService.buscarPorId(id);
        res.json(horario);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ msg: error.message || 'Error al obtener horario' });
    }
};

// Listar días disponibles
const listarDias = async (req, res) => {
    try {
        const dias = await horarioService.listarDias();
        res.json(dias);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ msg: error.message || 'Error al listar días' });
    }
};

// Listar horas por día
const listarHorasPorDia = async (req, res) => {
    try {
        const { dia } = req.params;
        const horas = await horarioService.listarHorasPorDia(dia);
        res.json(horas);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ msg: error.message || 'Error al listar horas' });
    }
};

// Crear un nuevo horario
const crearHorario = async (req, res) => {
    try {
        const { dia, hora, disponible } = req.body;
        
        const horario = await horarioService.crear({
            dia,
            hora,
            disponible
        });
        
        res.status(201).json({
            msg: 'Horario creado correctamente',
            horario
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ msg: error.message || 'Error al crear horario' });
    }
};

// Actualizar un horario
const actualizarHorario = async (req, res) => {
    try {
        const { id } = req.params;
        const { dia, hora, disponible } = req.body;
        
        // Construir objeto de datos a actualizar
        const datos = {};
        if (dia) datos.dia = dia;
        if (hora) datos.hora = hora;
        if (disponible !== undefined) datos.disponible = disponible;
        
        const horario = await horarioService.actualizar(id, datos);
        
        res.json({
            msg: 'Horario actualizado correctamente',
            horario
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ msg: error.message || 'Error al actualizar horario' });
    }
};

// Cambiar disponibilidad de un horario
const cambiarDisponibilidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { disponible } = req.body;
        
        if (disponible === undefined) {
            return res.status(400).json({ msg: 'El campo disponible es obligatorio' });
        }
        
        const horario = await horarioService.cambiarDisponibilidad(id, disponible);
        
        res.json({
            msg: `Horario ${disponible ? 'habilitado' : 'deshabilitado'} correctamente`,
            horario
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ msg: error.message || 'Error al cambiar disponibilidad' });
    }
};

// Eliminar un horario
const eliminarHorario = async (req, res) => {
    try {
        const { id } = req.params;
        await horarioService.eliminar(id);
        
        res.json({
            msg: 'Horario eliminado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ msg: error.message || 'Error al eliminar horario' });
    }
};

export {
    listarHorarios,
    obtenerHorario,
    listarDias,
    listarHorasPorDia,
    crearHorario,
    actualizarHorario,
    cambiarDisponibilidad,
    eliminarHorario
};