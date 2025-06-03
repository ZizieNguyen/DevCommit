// src/app.js
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import routes from './routes/index.js';
import { PORT, FRONTEND_URL } from './constants.js';
import { testConnection } from './config/db.js';
import initDb from './config/initDB.js';

// Configurar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear app
const app = express();

// Middleware
app.use(cors({
  origin: FRONTEND_URL.replace(/\/$/, ''),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// Rutas
app.use('/api',routes);

// Iniciar servidor
const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    
    if (dbConnected) {
      await initDb();
    }
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor funcionando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();


export default app;