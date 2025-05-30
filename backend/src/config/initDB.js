import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { DB_HOST, DB_USER, DB_PASS, DB_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } from '../constants.js';

const initDb = async () => {
  let connection = null;
  
  try {
    console.log('Inicializando base de datos...');
    
    // Conexión para administración (sin base de datos)
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      multipleStatements: true
    });
    
    // Leer el archivo schema.sql
    const schemaPath = path.join(process.cwd(), 'src', 'config', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Ejecutar script completo
    await connection.query(schema);
    
    console.log('Base de datos inicializada correctamente');

    await crearAdminInicial(connection);

    return true;
  } catch (error) {
    console.error('Error al inicializar base de datos:', error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const crearAdminInicial = async (connection) => {
  try {
    // Usar la base de datos creada
    await connection.query(`USE ${DB_NAME}`);
    
    // Verificar si ya existe un admin usando la columna 'admin' (booleana)
    const [admins] = await connection.query(
      'SELECT * FROM usuarios WHERE admin = 1 LIMIT 1'
    );
    
    if (admins.length > 0) {
      console.log('Usuario administrador ya existe, omitiendo creación');
      return;
    }
    
    // Datos por defecto si no están en las variables de entorno
    const email = ADMIN_EMAIL || 'admin@devcommit.com';
    const password = ADMIN_PASSWORD || 'Admin123!';
    
    // Hashear la contraseña usando bcrypt (10 rondas)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Ajusta los campos según la estructura real de la tabla
    await connection.query(
      `INSERT INTO usuarios (id, nombre, apellido, email, password, admin, confirmado)
       VALUES (UUID(), 'Admin', 'DevCommit', ?, ?, 1, 1)`,
      [email, hashedPassword]
    );
    
    console.log(`✅ Usuario administrador creado: ${email}`);
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
    throw error;
  }
};

export default initDb;