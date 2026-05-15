-- ============================================
-- DIGITAL-H - Tablas para diagnósticos
-- Base de datos: acruxdb (Hostinger)
-- ============================================

-- Tabla 1: Resultados de diagnósticos DIGITAL-H
CREATE TABLE IF NOT EXISTS digitalh_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Datos del participante
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    company_size VARCHAR(50),
    
    -- Resultados del diagnóstico
    imd_score INT NOT NULL COMMENT 'Índice de Madurez Digital (0-100)',
    maturity_level VARCHAR(100) NOT NULL COMMENT 'Nivel: Inicial, Emergente, Desarrollo, Avanzado, Excelente, Referente',
    answers_json JSON NOT NULL COMMENT 'Respuestas de las 48 preguntas en formato JSON',
    
    -- Dimensiones individuales (calculadas desde answers_json)
    dimension_strategy DECIMAL(4,2) DEFAULT NULL COMMENT 'Estrategia Digital (1-5)',
    dimension_culture DECIMAL(4,2) DEFAULT NULL COMMENT 'Cultura y Liderazgo (1-5)',
    dimension_talent DECIMAL(4,2) DEFAULT NULL COMMENT 'Talento y Competencias (1-5)',
    dimension_tech DECIMAL(4,2) DEFAULT NULL COMMENT 'Tecnología e Infraestructura (1-5)',
    dimension_process DECIMAL(4,2) DEFAULT NULL COMMENT 'Procesos y Datos (1-5)',
    dimension_wellbeing DECIMAL(4,2) DEFAULT NULL COMMENT 'Experiencia y Bienestar (1-5)',
    
    -- GDPR y consentimiento
    gdpr_consent BOOLEAN DEFAULT FALSE,
    gdpr_timestamp TIMESTAMP NULL,
    
    -- Metadatos
    source VARCHAR(100) DEFAULT 'digital-h' COMMENT 'Origen del lead',
    status ENUM('completed', 'incomplete', 'abandoned') DEFAULT 'completed',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para búsquedas comunes
    INDEX idx_email (email),
    INDEX idx_company (company),
    INDEX idx_maturity_level (maturity_level),
    INDEX idx_imd_score (imd_score),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla 2: Eventos/acciones del usuario (opcional, para analytics)
CREATE TABLE IF NOT EXISTS digitalh_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    diagnostic_id INT,
    event_type VARCHAR(50) NOT NULL COMMENT 'start, progress, complete, download_pdf, share',
    event_data JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (diagnostic_id) REFERENCES digitalh_results(id) ON DELETE CASCADE,
    INDEX idx_diagnostic_id (diagnostic_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VISTA: Leads unificados (opcional)
-- Combina contacts + digitalh_results para CRM
-- ============================================
CREATE OR REPLACE VIEW all_leads AS
SELECT 
    id,
    name,
    email,
    company,
    'contact' as source_type,
    message as details,
    status,
    created_at
FROM contacts

UNION ALL

SELECT 
    id,
    name,
    email,
    company,
    'digital-h' as source_type,
    CONCAT('IMD: ', imd_score, '% - Nivel: ', maturity_level) as details,
    status,
    created_at
FROM digitalh_results;

-- Tabla 3: Reservas de citas (calendario propio)
CREATE TABLE IF NOT EXISTS digitalh_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_email VARCHAR(255) NOT NULL,
    lead_name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_booking_date (booking_date),
    INDEX idx_booking_time (booking_time),
    INDEX idx_lead_email (lead_email),
    INDEX idx_status (status),
    
    -- Evitar doble-booking
    UNIQUE KEY unique_booking_slot (booking_date, booking_time, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS DE EJEMPLO (para testing)
-- ============================================
-- INSERT INTO digitalh_results 
-- (name, email, company, company_size, imd_score, maturity_level, answers_json, gdpr_consent)
-- VALUES 
-- ('Juan Pérez', 'juan@empresa.com', 'Empresa XYZ', '11-50', 65, 'Avanzado', '{}', TRUE);
