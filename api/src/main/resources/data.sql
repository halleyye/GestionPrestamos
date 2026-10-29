--POSTGRE
-- 1. Creación de tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL -- 'ADMIN' o 'USER'
);

-- 2. Creación de tabla equipos
-- Reglas: identificador, código patrimonial único, nombre, tipo y estado[cite: 1]
CREATE TABLE equipos (
    id SERIAL PRIMARY KEY,
    codigo_patrimonial VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('DISPONIBLE', 'PRESTADO'))
);

-- 3. Creación de tabla prestamos
-- Reglas: identificador, equipo, nombre del solicitante, fecha prestamo, fecha devolución, estado[cite: 1]
CREATE TABLE prestamos (
    id SERIAL PRIMARY KEY,
    equipo_id INT NOT NULL,
    nombre_solicitante VARCHAR(100) NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion_prevista DATE NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('ACTIVO', 'DEVUELTO')),
    CONSTRAINT fk_equipo FOREIGN KEY (equipo_id) REFERENCES equipos(id)
);

-- ==========================================
-- DATOS MÍNIMOS PARA LA DEMOSTRACIÓN[cite: 3]
-- ==========================================

-- Insertar usuarios (Las contraseñas deben estar hasheadas con BCrypt. Aquí se asume que 'password123' genera el hash mostrado)
INSERT INTO usuarios (username, password, rol) VALUES 
	('admin_test', '$2a$12$R2hy/eOD8OTchUDXetoTa.n46BrViRlPZ9DPtu9da9iCSk4mkoFWO', 'ADMIN'),
('user_test', '$2a$12$C3xFiKTgbGyK6y306Wi85u36DgqAnpP6leM.OQHToT09keET52SNa', 'USER');


--contrasena hola y hola123

-- Insertar equipos iniciales
INSERT INTO equipos (codigo_patrimonial, nombre, tipo, estado) VALUES 
('LAP-001', 'Dell Latitude 5420', 'Computadora Portátil', 'DISPONIBLE'),
('PRO-001', 'Epson PowerLite', 'Proyector', 'DISPONIBLE'),
('TAB-001', 'iPad Air', 'Tableta', 'PRESTADO');

-- Insertar un préstamo activo para probar las reglas de negocio[cite: 1, 2]
INSERT INTO prestamos (equipo_id, nombre_solicitante, fecha_prestamo, fecha_devolucion_prevista, estado) VALUES 
(3, 'Juan Perez', CURRENT_DATE, CURRENT_DATE + INTERVAL '5 days', 'ACTIVO');