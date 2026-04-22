-- Tabla para almacenar diagnósticos DIGITAL-H
CREATE TABLE IF NOT EXISTS digitalh_diagnosticos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  empresa VARCHAR(255) NOT NULL,
  tamano_empresa VARCHAR(50) NOT NULL,
  imd INT NOT NULL,
  nivel VARCHAR(100) NOT NULL,
  respuestas JSON NOT NULL,
  gdpr_consent BOOLEAN DEFAULT FALSE,
  gdpr_timestamp DATETIME,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
