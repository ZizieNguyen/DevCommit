import { pool } from '../config/db.js';
import { generarError } from '../utils/helpers.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads/ponentes');

const ponenteService = {
    async crear({ nombre, apellido, ciudad, pais, imagen, tags, redes }) {
        try {
            const tagsStr = Array.isArray(tags) ? tags.join(',') : tags;
            
            // Procesar redes (convertir objeto a JSON)
            const redesJSON = typeof redes === 'object' ? JSON.stringify(redes) : redes;
            
            const query = `
                INSERT INTO ponentes 
                (nombre, apellido, ciudad, pais, imagen, tags, redes)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            const [result] = await pool.query(query, [
                nombre,
                apellido,
                ciudad || null,
                pais || null,
                imagen || null,
                tagsStr || null,
                redesJSON || null
            ]);
            
            // Obtener el ID generado
            const [rows] = await pool.query(
                'SELECT id FROM ponentes ORDER BY createdAt DESC LIMIT 1'
            );
            
            return {
                id: rows[0].id,
                nombre,
                apellido,
                imagen
            };
            
        } catch (error) {
            console.error('Error en crear ponente:', error);
            throw generarError(500, 'DatabaseError', 'Error al crear ponente');
        }
    },
    
    async listar() {
        try {
            const query = `
                SELECT id, nombre, apellido, ciudad, pais, imagen, tags, redes 
                FROM ponentes
                ORDER BY apellido, nombre
            `;
            
            const [ponentes] = await pool.query(query);
            
            // Procesar las redes sociales (de JSON a objeto)
            return ponentes.map(ponente => ({
                ...ponente,
                tags: ponente.tags ? ponente.tags.split(',') : [],
                redes: ponente.redes ? JSON.parse(ponente.redes) : {}
            }));
            
        } catch (error) {
            console.error('Error en listar ponentes:', error);
            throw generarError(500, 'DatabaseError', 'Error al listar ponentes');
        }
    },
    
    async buscarPorId(id) {
        try {
            const query = `
                SELECT id, nombre, apellido, ciudad, pais, imagen, tags, redes 
                FROM ponentes 
                WHERE id = ?
            `;
            
            const [rows] = await pool.query(query, [id]);
            
            if (rows.length === 0) {
                throw generarError(404, 'NotFoundError', 'Ponente no encontrado');
            }
            
            const ponente = rows[0];
            
            return {
                ...ponente,
                tags: ponente.tags ? ponente.tags.split(',') : [],
                redes: ponente.redes ? JSON.parse(ponente.redes) : {}
            };
            
        } catch (error) {
            if (error.code === 'NotFoundError') throw error;
            console.error('Error en buscarPorId:', error);
            throw generarError(500, 'DatabaseError', 'Error al buscar ponente');
        }
    },
    
    async actualizar(id, datos) {
        try {
            // Verificar que el ponente exista
            await this.buscarPorId(id);
            
            // Procesar tags y redes si están presentes
            if (datos.tags && Array.isArray(datos.tags)) {
                datos.tags = datos.tags.join(',');
            }
            
            if (datos.redes && typeof datos.redes === 'object') {
                datos.redes = JSON.stringify(datos.redes);
            }
            
            const entries = Object.entries(datos);
            const placeholders = entries.map(([key]) => `${key} = ?`).join(', ');
            const values = entries.map(([_, value]) => value);
            
            const query = `UPDATE ponentes SET ${placeholders} WHERE id = ?`;
            await pool.query(query, [...values, id]);
            
            return await this.buscarPorId(id);
            
        } catch (error) {
            if (error.code === 'NotFoundError') throw error;
            console.error('Error en actualizar ponente:', error);
            throw generarError(500, 'DatabaseError', 'Error al actualizar ponente');
        }
    },
    
    async eliminar(id) {
        try {
            const ponente = await this.buscarPorId(id);
            
            const query = `DELETE FROM ponentes WHERE id = ?`;
            const [result] = await pool.query(query, [id]);
            
            if (result.affectedRows === 0) {
                throw generarError(404, 'NotFoundError', 'Ponente no encontrado');
            }
            
            if (ponente.imagen) {
                const imagenPath = path.join(uploadsDir, ponente.imagen);
                
                if (fs.existsSync(imagenPath)) {
                    fs.unlinkSync(imagenPath);
                }
            }
            
            return true;
            
        } catch (error) {
            if (error.code === 'NotFoundError') throw error;
            console.error('Error en eliminar ponente:', error);
            throw generarError(500, 'DatabaseError', 'Error al eliminar ponente');
        }
    }
};

export default ponenteService; 