// src/services/usuarioService.js
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { generarError } from '../utils/helpers.js'; // Corregido: generateError → generarError

const usuarioService = {
    async crear({ nombre, apellido, email, password, token }) {
        try {
            // Hashear password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // SQL modificado - no enviamos el ID, dejamos que MySQL lo genere
            const query = `
                INSERT INTO usuarios 
                (nombre, apellido, email, password, token)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            const [result] = await pool.query(query, [
                nombre, 
                apellido, 
                email, 
                hashedPassword, 
                token
            ]);

            return {
                id: result.insertId,
                nombre,
                apellido,
                email
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw generarError(400, 'DuplicateError', 'El email ya está registrado');
            }
            
            throw error;
        }
    },

    async actualizar(id, datos) {
        try {
            // Verificar que el usuario existe
            await this.buscarPorId(id);
            
            // Construir la consulta dinámicamente
            const campos = [];
            const valores = [];
            
            for (const [campo, valor] of Object.entries(datos)) {
                if (campo === 'password') {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(valor, salt);
                    campos.push(`${campo} = ?`);
                    valores.push(hashedPassword);
                } else {
                    campos.push(`${campo} = ?`);
                    valores.push(valor);
                }
            }
            
            if (!campos.length) {
                throw generarError(400, 'ValidationError', 'No hay datos para actualizar');
            }
            
            // Añadir el ID al final de los valores
            valores.push(id);
            
            const query = `
                UPDATE usuarios 
                SET ${campos.join(', ')}
                WHERE id = ?
            `;
            
            await pool.query(query, valores);
            
            // Retornar el usuario actualizado
            return await this.buscarPorId(id);
        } catch (error) {
            throw error;
        }
    },

    async eliminar(id) {
        try {
            // Verificar que el usuario existe
            await this.buscarPorId(id);
            
            // Eliminar usuario
            await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
            
            return true;
        } catch (error) {
            throw error;
        }
    },

    async buscarPorEmail(email) {
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        return usuarios[0] || null;
    },

    async buscarPorToken(token) {
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE token = ?', [token]);
        
        return usuarios[0] || null;
    },

    async buscarPorId(id) {
        const [usuarios] = await pool.query(
            'SELECT id, nombre, apellido, email, admin, confirmado, createdAt FROM usuarios WHERE id = ?', 
            [id]
        );
        
        if (!usuarios.length) {
            throw generarError(404, 'NotFoundError', 'Usuario no encontrado');
        }
        
        return usuarios[0];
    },

    async comprobarPassword(usuario, password) {
        return await bcrypt.compare(password, usuario.password);
    },

    async autenticar(email, password) {
        try {
            // Verificar que el usuario exista
            const usuario = await this.buscarPorEmail(email);
            
            if (!usuario) {
                throw generarError(401, 'AuthError', 'Credenciales incorrectas');
            }
            
            // Verificar que el usuario esté confirmado
            if (!usuario.confirmado) {
                throw generarError(401, 'AuthError', 'Tu cuenta no está confirmada');
            }
            
            // Verificar el password
            const passwordCorrecto = await this.comprobarPassword(usuario, password);
            
            if (!passwordCorrecto) {
                throw generarError(401, 'AuthError', 'Credenciales incorrectas');
            }
            
            return usuario;
        } catch (error) {
            throw error;
        }
    },

    async listarUsuarios() {
        try {
            const [usuarios] = await pool.query(
                'SELECT id, nombre, apellido, email, admin, confirmado, createdAt FROM usuarios'
            );
            
            return usuarios;
        } catch (error) {
            throw error;
        }
    },

    async cambiarRolAdmin(id, adminValue) {
        try {
            return await this.actualizar(id, { admin: adminValue });
        } catch (error) {
            throw error;
        }
    },

    async contarUsuarios() {
        try {
            const [result] = await pool.query('SELECT COUNT(*) as total FROM usuarios');
            return result[0].total;
        } catch (error) {
            console.error('Error al contar usuarios:', error);
            throw generarError(500, 'DatabaseError', 'Error al contar usuarios');
        }
    }
};

export default usuarioService;