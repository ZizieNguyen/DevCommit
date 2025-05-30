import { pool } from '../config/db.js';
import { generarError } from '../utils/helpers.js';

const horarioService = {
    async listar() {
        try {
            const query = `SELECT id, dia, hora, disponible FROM horarios ORDER BY 
                CASE 
                    WHEN dia = 'Viernes' THEN 1
                    WHEN dia = 'Sábado' THEN 2
                    WHEN dia = 'Domingo' THEN 3
                    ELSE 4
                END, hora`;
            const [horarios] = await pool.query(query);
            return horarios;
        } catch (error) {
            console.error('Error en listar horarios:', error);
            throw generarError(500, 'DatabaseError', 'Error al listar horarios');
        }
    },

    async buscarPorId(id) {
        try {
            const query = `SELECT id, dia, hora, disponible FROM horarios WHERE id = ?`;
            const [rows] = await pool.query(query, [id]);
            
            if (rows.length === 0) {
                throw generarError(404, 'NotFoundError', 'Horario no encontrado');
            }
            
            return rows[0];
        } catch (error) {
            if (error.code === 'NotFoundError') throw error;
            console.error('Error en buscarPorId:', error);
            throw generarError(500, 'DatabaseError', 'Error al buscar horario');
        }
    },
    
    async listarDias() {
        try {
            const query = `SELECT DISTINCT dia as nombre FROM horarios ORDER BY 
                CASE 
                    WHEN dia = 'Viernes' THEN 1
                    WHEN dia = 'Sábado' THEN 2
                    WHEN dia = 'Domingo' THEN 3
                    ELSE 4
                END`;
            const [dias] = await pool.query(query);
            
            // Generar IDs virtuales para mantener compatibilidad con el frontend
            return dias.map((dia, index) => ({
                id: `dia_${index + 1}`,
                nombre: dia.nombre
            }));
        } catch (error) {
            console.error('Error en listar días:', error);
            throw generarError(500, 'DatabaseError', 'Error al listar días');
        }
    },
    
    async listarHorasPorDia(dia) {
        try {
            const query = `SELECT id, hora FROM horarios WHERE dia = ? AND disponible = TRUE ORDER BY hora`;
            const [horas] = await pool.query(query, [dia]);
            return horas;
        } catch (error) {
            console.error('Error en listar horas por día:', error);
            throw generarError(500, 'DatabaseError', 'Error al listar horas');
        }
    },
    
    async crear({ dia, hora, disponible = true }) {
        try {
            // Verificar que no exista el mismo horario
            const [existente] = await pool.query(
                'SELECT id FROM horarios WHERE dia = ? AND hora = ?',
                [dia, hora]
            );
            
            if (existente.length > 0) {
                throw generarError(409, 'ConflictError', 'Este horario ya existe');
            }
            
            const query = `INSERT INTO horarios (dia, hora, disponible) VALUES (?, ?, ?)`;
            const [result] = await pool.query(query, [dia, hora, disponible]);
            
            // Obtener el ID generado
            const [rows] = await pool.query(
                'SELECT id FROM horarios ORDER BY createdAt DESC LIMIT 1'
            );
            
            return {
                id: rows[0].id,
                dia,
                hora,
                disponible
            };
        } catch (error) {
            if (error.code === 'ConflictError') throw error;
            console.error('Error en crear horario:', error);
            throw generarError(500, 'DatabaseError', 'Error al crear horario');
        }
    },
    
    async actualizar(id, datos) {
        try {
            // Verificar que exista el horario
            await this.buscarPorId(id);
            
            // Si se cambian dia y hora, verificar que no exista otro igual
            if (datos.dia && datos.hora) {
                const [existente] = await pool.query(
                    'SELECT id FROM horarios WHERE dia = ? AND hora = ? AND id != ?',
                    [datos.dia, datos.hora, id]
                );
                
                if (existente.length > 0) {
                    throw generarError(409, 'ConflictError', 'Ya existe un horario con esa combinación de día y hora');
                }
            }
            
            // Construir la consulta de actualización
            const entries = Object.entries(datos);
            const placeholders = entries.map(([key]) => `${key} = ?`).join(', ');
            const values = entries.map(([_, value]) => value);
            
            const query = `UPDATE horarios SET ${placeholders} WHERE id = ?`;
            await pool.query(query, [...values, id]);
            
            // Devolver el horario actualizado
            return await this.buscarPorId(id);
            
        } catch (error) {
            if (error.code) throw error;
            console.error('Error en actualizar horario:', error);
            throw generarError(500, 'DatabaseError', 'Error al actualizar horario');
        }
    },
    
    async eliminar(id) {
        try {
            // Verificar que exista el horario
            await this.buscarPorId(id);
            
            // Verificar que no esté en uso en eventos
            const [eventosAsociados] = await pool.query(
                'SELECT id FROM eventos WHERE horario_id = ?',
                [id]
            );
            
            if (eventosAsociados.length > 0) {
                throw generarError(409, 'ConflictError', 'No se puede eliminar un horario que está siendo usado por eventos');
            }
            
            const query = `DELETE FROM horarios WHERE id = ?`;
            await pool.query(query, [id]);
            
            return true;
            
        } catch (error) {
            if (error.code) throw error;
            console.error('Error en eliminar horario:', error);
            throw generarError(500, 'DatabaseError', 'Error al eliminar horario');
        }
    },
    
    async cambiarDisponibilidad(id, disponible) {
        return await this.actualizar(id, { disponible });
    },
    
    // Método especial para mantener compatibilidad con el anterior diaService.buscarPorId
    async buscarDiaPorId(diaVirtualId) {
        try {
            // Extraer el número del virtual ID (por ejemplo, "dia_1" -> 1)
            const diaNumero = parseInt(diaVirtualId.replace('dia_', ''));
            
            // Obtener todos los días distintos ordenados
            const dias = await this.listarDias();
            
            // Buscar por el índice
            const dia = dias[diaNumero - 1];
            
            if (!dia) {
                throw generarError(404, 'NotFoundError', 'Día no encontrado');
            }
            
            return dia;
        } catch (error) {
            if (error.code === 'NotFoundError') throw error;
            console.error('Error en buscarDiaPorId:', error);
            throw generarError(500, 'DatabaseError', 'Error al buscar día');
        }
    }
};

export default horarioService;