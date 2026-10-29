# Sistema de Préstamo de Equipos Tecnológicos - TecnoUAM

Este proyecto es un prototipo funcional cliente-servidor desarrollado para el Centro de Capacitación TecnoUAM. Permite gestionar el inventario de equipos tecnológicos y llevar un control estricto de los préstamos realizados a instructores.

El proyecto consta de una API RESTful desarrollada en **Spring Boot** y una interfaz de usuario SPA desarrollada con **React** y **Vite**.

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente antes de intentar levantar el proyecto:
*   **Java 17** o superior.
*   **Node.js** (v18 o superior) y **npm**.
*   **PostgreSQL** (versión 12 o superior).
*   **Maven** (opcional, si no utilizas el wrapper incluido o un IDE).

---

## ⚙️ Configuración y Ejecución del Backend (Spring Boot)

El backend utiliza Spring Data JPA para la persistencia y Spring Security con JWT para la autenticación y autorización.

### 1. Base de datos
Crea una base de datos en PostgreSQL llamada `tecnouam_db`. El archivo `src/main/resources/data.sql` contiene las estructuras de las tablas y los datos de prueba mínimos (usuarios encriptados con BCrypt y equipos iniciales) que se ejecutarán automáticamente al iniciar la aplicación.

### 2. Variables de entorno
Para que el proyecto funcione de manera segura y sin secretos en el código, debes configurar las siguientes variables de entorno en tu sistema o en tu IDE antes de ejecutar el proyecto:

```env
DB_URL=jdbc:postgresql://localhost:5432/tecnouam_db
DB_USERNAME=tu_usuario_postgres
DB_PASSWORD=tu_password_postgres
JWT_SECRET=tu_secreto_jwt_de_al_menos_32_caracteres_de_longitud
```
*(Nota: Nunca subas tus contraseñas reales al repositorio).*

### 3. Ejecutar la aplicación
Navega a la carpeta del backend (`api`) y ejecuta:
```bash
./mvnw spring-boot:run
```
La API estará disponible en `http://localhost:8080`.

---

## 💻 Configuración y Ejecución del Frontend (React)

El frontend está desarrollado con React, consumiendo la API de Spring Boot mediante Axios con interceptores para inyectar automáticamente el JWT.

### 1. Instalación de dependencias
Navega a la carpeta del frontend (`front-segundocorte`) e instala las dependencias:
```bash
npm install
```

### 2. Ejecutar la aplicación
Inicia el servidor de desarrollo de Vite:
```bash
npm run dev
```
La interfaz estará disponible en `http://localhost:5173`.

---

## 🔑 Cuentas de Prueba

El script `data.sql` incluye las siguientes cuentas pre-registradas para probar la aplicación. Las contraseñas se encuentran debidamente hasheadas con BCrypt en la base de datos.

| Rol | Usuario | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin_test` | `hola` | Control total (CRUD de equipos, registrar préstamos y devoluciones). |
| **USER** | `user_test` | `hola123` | Solo lectura (vista de catálogo de equipos). |

---

## 📡 Endpoints de la API

La API REST implementa los siguientes endpoints. Todas las rutas (excepto login) requieren un token JWT en el encabezado `Authorization: Bearer <token>`.

### Autenticación
*   `POST /api/auth/login`: Autentica al usuario y devuelve el token JWT (Público).

### Equipos
*   `GET /api/equipos`: Lista todos los equipos (USER, ADMIN).
*   `GET /api/equipos/{id}`: Obtiene el detalle de un equipo (USER, ADMIN).
*   `POST /api/equipos`: Registra un nuevo equipo (Solo ADMIN).
*   `PUT /api/equipos/{id}`: Modifica los datos de un equipo (Solo ADMIN).
*   `DELETE /api/equipos/{id}`: Elimina un equipo si no tiene préstamos activos (Solo ADMIN).

### Préstamos
*   `GET /api/prestamos`: Lista todos los préstamos (USER, ADMIN).
*   `POST /api/prestamos`: Registra un préstamo y cambia el estado del equipo a PRESTADO (Solo ADMIN).
*   `PUT /api/prestamos/{id}/devolver`: Registra la devolución y libera el equipo a DISPONIBLE (Solo ADMIN).