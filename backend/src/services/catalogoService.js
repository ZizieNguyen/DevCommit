import { pool } from '../config/db.js';
import { generarError } from '../utils/helpers.js';

const catalogoService = {
    async listar(tipo) {
        try {
            const query = `SELECT id, nombre, descripcion FROM catalogos WHERE tipo = ? ORDER BY nombre`;
            const [catalogos] = await pool.query(query, [tipo]);
            return catalogos;
        } catch (error) {
            console.error(`Error en listar catalogos (${tipo}):`, error);
            throw generarError(500, 'DatabaseError', `Error al listar ${tipo}s`);
        }
    },

    async buscarPorId(id) {
        try {
            const query = `SELECT id, tipo, nombre, descripcion FROM catalogos WHERE id = ?`;
            const [rows] = await pool.query(query, [id]);
            
            if (rows.length === 0) {
                throw generarError(404, 'NotFoundError', 'Ítem de catálogo no encontrado');
            }
            
            return rows[0];
        } catch (error) {
            if (error.code === 'NotFoundError') throw error;
            console.error('Error en buscarPorId:', error);
            throw generarError(500, 'DatabaseError', 'Error al buscar ítem de catálogo');
        }
    },
    
    async crear({ tipo, nombre, descripcion = null }) {
        try {
            // Verificar que el tipo sea válido
            const tiposValidos = ['categoria', 'paquete', 'regalo'];
            if (!tiposValidos.includes(tipo)) {
                throw generarError(400, 'ValidationError', 'Tipo de catálogo inválido');
            }
            
            // Verificar que no exista el mismo nombre para ese tipo
            const [existente] = await pool.query(
                'SELECT id FROM catalogos WHERE tipo = ? AND nombre = ?',
                [tipo, nombre]
            );
            
            if (existente.length > 0) {
                throw generarError(409, 'ConflictError', `Ya existe un ${tipo} con ese nombre`);
            }
            
            const query = `INSERT INTO catalogos (tipo, nombre, descripcion) VALUES (?, ?, ?)`;
            const [result] = await pool.query(query, [tipo, nombre, descripcion]);
            
            // Obtener el ID generado
            const [rows] = await pool.query(
                'SELECT id FROM catalogos ORDER BY createdAt DESC LIMIT 1'
            );
            
            return {
                id: rows[0].id,
                tipo,
                nombre,
                descripcion
            };
        } catch (error) {
            if (error.code) throw error;
            console.error('Error en crear catálogo:', error);
            throw generarError(500, 'DatabaseError', 'Error al crear ítem de catálogo');
        }
    },
    
    async actualizar(id, datos) {
        try {
            // Verificar que exista el ítem
            const itemActual = await this.buscarPorId(id);
            
            // No se puede cambiar el tipo
            if (datos.tipo && datos.tipo !== itemActual.tipo) {
                throw generarError(400, 'ValidationError', 'No se puede cambiar el tipo de un ítem de catálogo');
            }
            
            // Si se cambia el nombre, verificar que no exista otro igual del mismo tipo
            if (datos.nombre && datos.nombre !== itemActual.nombre) {
                const [existente] = await pool.query(
                    'SELECT id FROM catalogos WHERE tipo = ? AND nombre = ? AND id != ?',
                    [itemActual.tipo, datos.nombre, id]
                );
                
                if (existente.length > 0) {
                    throw generarError(409, 'ConflictError', `Ya existe un ${itemActual.tipo} con ese nombre`);
                }
            }
            
            // Construir la consulta de actualización
            const entries = Object.entries(datos);
            const placeholders = entries.map(([key]) => `${key} = ?`).join(', ');
            const values = entries.map(([_, value]) => value);
            
            const query = `UPDATE catalogos SET ${placeholders} WHERE id = ?`;
            await pool.query(query, [...values, id]);
            
            // Devolver el ítem actualizado
            return await this.buscarPorId(id);
            
        } catch (error) {
            if (error.code) throw error;
            console.error('Error en actualizar catálogo:', error);
            throw generarError(500, 'DatabaseError', 'Error al actualizar ítem de catálogo');
        }
    },
    
    async eliminar(id) {
        try {
            // Verificar que exista el ítem
            const item = await this.buscarPorId(id);
            
            // Verificar que no esté en uso
            let tablasRelacionadas = [];
            
            if (item.tipo === 'categoria') {
                tablasRelacionadas.push('eventos');
            } else if (item.tipo === 'paquete' || item.tipo === 'regalo') {
                tablasRelacionadas.push('registros');
            }
            
            // Verificar si hay relaciones en todas las tablas correspondientes
            for (const tabla of tablasRelacionadas) {
                const campo = `${item.tipo}_id`;
                const [relacionados] = await pool.query(
                    `SELECT id FROM ${tabla} WHERE ${campo} = ?`,
                    [id]
                );
                
                if (relacionados.length > 0) {
                    throw generarError(409, 'ConflictError', `No se puede eliminar porque hay ${tabla} asociados`);
                }
            }
            
            const query = `DELETE FROM catalogos WHERE id = ?`;
            await pool.query(query, [id]);
            
            return true;
            
        } catch (error) {
            if (error.code) throw error;
            console.error('Error en eliminar catálogo:', error);
            throw generarError(500, 'DatabaseError', 'Error al eliminar ítem de catálogo');
        }
    }
};

export default catalogoService;