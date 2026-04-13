# WebHotel

Sistema de gestión hotelera full-stack con Angular (frontend) y Spring Boot (backend).

## Tecnologías

| Capa       | Tecnología                        |
|------------|-----------------------------------|
| Frontend   | Angular 15.2, Bootstrap 5.3       |
| Backend    | Spring Boot 2.7.8, Java 8         |
| Base de datos | MySQL 8                        |
| Seguridad  | Spring Security + JWT (JJWT 0.11) |
| Build      | Angular CLI, Maven 3              |

---

## Estructura del proyecto

```
webhotel_tpi/
├── webhotel-frontend/   # Aplicación Angular
└── webhotel-backend/    # API REST Spring Boot
```

---

## Requisitos previos

- Node.js 16+ y npm
- Java 8+
- MySQL 8
- Maven 3 (o usar el wrapper `./mvnw`)

---

## Configuración de base de datos

Crear la base de datos y el usuario en MySQL:

```sql
CREATE DATABASE webhotel;
CREATE USER 'webhotel_user'@'localhost' IDENTIFIED BY 'webhotel_pass';
GRANT ALL PRIVILEGES ON webhotel.* TO 'webhotel_user'@'localhost';
FLUSH PRIVILEGES;
```

Las tablas se crean automáticamente al iniciar el backend (`ddl-auto=update`).

---

## Instalación y ejecución

### Backend

```bash
cd webhotel-backend
./mvnw clean package
./mvnw spring-boot:run
```

Queda disponible en `http://localhost:8080`.

### Frontend

```bash
cd webhotel-frontend
npm install
npm run start
```

Queda disponible en `http://localhost:4200`. El proxy redirige `/api` hacia el backend automáticamente.

---

## Funcionalidades

### Usuario registrado
- Ver tipos de habitación con imágenes y precios
- Ver servicios disponibles
- Consultar disponibilidad y crear reservas
- Agregar servicios opcionales a la reserva
- Ver y cancelar sus propias reservas

### Administrador
- Gestionar tipos de habitación (crear, editar, eliminar, subir imágenes)
- Gestionar servicios del hotel
- Ver estadías confirmadas y en curso
- Realizar check-in y check-out

---

## API REST — Endpoints principales

### Autenticación (`/api/auth/`)
| Método | Ruta                        | Descripción         |
|--------|-----------------------------|---------------------|
| POST   | `/api/auth/register`        | Registro de usuario |
| POST   | `/api/auth/authenticate`    | Login → devuelve JWT|

### Estadías (`/api/estadias/`)
| Método | Ruta                               | Auth     | Descripción                |
|--------|------------------------------------|----------|----------------------------|
| GET    | `/api/estadias/disponibilidad`     | Pública  | Consultar disponibilidad   |
| POST   | `/api/estadias`                    | Usuario  | Crear reserva              |
| GET    | `/api/estadias/mis-estadias`       | Usuario  | Mis reservas               |
| PUT    | `/api/estadias/{id}`               | Usuario  | Modificar reserva          |
| PATCH  | `/api/estadias/{id}/cancelar`      | Usuario  | Cancelar reserva           |
| PATCH  | `/api/estadias/{id}/confirmar`     | Admin    | Confirmar reserva          |
| PATCH  | `/api/estadias/{id}/check-in`      | Admin    | Check-in                   |
| PATCH  | `/api/estadias/{id}/check-out`     | Admin    | Check-out                  |
| GET    | `/api/estadias/confirmadas`        | Pública  | Reservas confirmadas       |
| GET    | `/api/estadias/en-curso`           | Admin    | Estadías en curso          |

### Tipos de habitación (`/api/tipohabitaciones/`)
- `GET` público para listado y detalle

### Servicios (`/api/servicios/`)
- `GET` público; creación, edición y eliminación requieren Admin

---

## Seguridad

- **JWT** incluido en el header `Authorization: Bearer <token>` para todas las rutas protegidas.
- **Roles:** `USER` y `ADMIN`.
- **Contraseñas** hasheadas con BCrypt.
- El interceptor de Angular agrega el token automáticamente en cada petición.

---

## Variables de configuración

### Backend (`application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/webhotel
spring.datasource.username=webhotel_user
spring.datasource.password=webhotel_pass
```


### Frontend (`proxy.conf.json`)
El proxy de desarrollo apunta a `http://localhost:8080`. No requiere configuración adicional.

---


