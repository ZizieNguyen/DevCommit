-- src/config/schema.sql
DROP DATABASE IF EXISTS devcommit;
CREATE DATABASE IF NOT EXISTS devcommit;
USE devcommit;

DROP TABLE IF EXISTS eventos_registros, registros, eventos, ponentes, horarios, catalogos, usuarios;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nombre VARCHAR(60) NOT NULL,
  apellido VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  confirmado BOOLEAN DEFAULT FALSE,
  token VARCHAR(255),
  admin BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de catálogos (reemplaza categorías, paquetes y regalos)
CREATE TABLE IF NOT EXISTS catalogos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  tipo ENUM('categoria', 'paquete', 'regalo') NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(tipo, nombre)
);

-- Tabla de horarios (reemplaza días y horas)
CREATE TABLE IF NOT EXISTS horarios (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  dia VARCHAR(15) NOT NULL,
  hora VARCHAR(10) NOT NULL,
  disponible BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(dia, hora)
);

-- Tabla de ponentes
CREATE TABLE IF NOT EXISTS ponentes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nombre VARCHAR(60) NOT NULL,
  apellido VARCHAR(60) NOT NULL,
  ciudad VARCHAR(60),
  pais VARCHAR(60),
  imagen VARCHAR(255),
  tags VARCHAR(255),
  redes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS eventos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  disponibles INT UNSIGNED NOT NULL,
  categoria_id CHAR(36) NOT NULL,
  horario_id CHAR(36) NOT NULL,
  ponente_id CHAR(36) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES catalogos(id) ON DELETE CASCADE,
  FOREIGN KEY (horario_id) REFERENCES horarios(id) ON DELETE CASCADE,
  FOREIGN KEY (ponente_id) REFERENCES ponentes(id) ON DELETE CASCADE
);

-- Tabla de registros
CREATE TABLE IF NOT EXISTS registros (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  paquete_id CHAR(36) NOT NULL,
  pago_id VARCHAR(60),
  token VARCHAR(8),
  usuario_id CHAR(36) NOT NULL,
  regalo_id CHAR(36),
  metodo_pago VARCHAR(10) DEFAULT 'stripe',
  pagado BOOLEAN DEFAULT FALSE,
  reembolsado BOOLEAN DEFAULT FALSE,
  reembolso_id VARCHAR(60),
  monto DECIMAL(10,2),
  moneda VARCHAR(3) DEFAULT 'eur',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paquete_id) REFERENCES catalogos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (regalo_id) REFERENCES catalogos(id) ON DELETE SET NULL
);

-- Tabla pivot para relacionar registros con eventos
CREATE TABLE IF NOT EXISTS eventos_registros (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  evento_id CHAR(36) NOT NULL,
  registro_id CHAR(36) NOT NULL,
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
  FOREIGN KEY (registro_id) REFERENCES registros(id) ON DELETE CASCADE
);