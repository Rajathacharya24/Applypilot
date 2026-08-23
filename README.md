# Applypilot

Applypilot is a microservices-based application built with Java 21, Spring Boot 3.4.1, and Spring Cloud.

## Folder Structure

- **`eureka-server`**: Service Registry (Spring Cloud Netflix Eureka Server)
- **`api-gateway`**: Gateway Service (Spring Cloud Gateway MVC)
- **`auth-service`**: Authentication & Authorization Service (Spring Boot Web, Spring Data JPA, PostgreSQL)
- **`tracker-service`**: Core Service (Spring Boot Web, Spring Data JPA, PostgreSQL, Redis)
- **`docker-compose.yml`**: Docker Compose file with PostgreSQL, Redis, and pgAdmin services for local development.

## Setup

1. Start infrastructural services:
   ```bash
   docker-compose up -d
   ```
2. Build all modules:
   ```bash
   mvn clean install
   ```
3. Run services in the following order:
   - `eureka-server` (Port 8761)
   - `api-gateway` (Port 8080)
   - `auth-service` (Port 8081)
   - `tracker-service` (Port 8082)