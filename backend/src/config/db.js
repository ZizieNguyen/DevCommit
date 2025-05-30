// src/config/db.js
import mysql from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASS, DB_NAME } from '../constants.js';

// Crear pool de conexiones
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Probar conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a BD establecida');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a BD:', error.message);
    return false;
  }
};


export { pool, testConnection };
