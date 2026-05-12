<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 🛡️ Help Desk Backend - API RESTful

Este repositorio contiene el código fuente del servidor (Backend) para el sistema de Mesa de Ayuda diseñado para centralizar y optimizar la gestión de incidencias y soporte técnico de equipos de cómputo en el Batallón de Artillería No. 2 La Popa.

El proyecto está diseñado bajo una arquitectura modular y escalable utilizando **NestJS**, garantizando un alto rendimiento y mantenibilidad del código. Esta API actúa como el motor transaccional del sistema, gestionando la lógica de negocio, la seguridad perimetral y la persistencia de datos relacionales.

## ✨ Características Principales
* **Autenticación y Autorización (RBAC):** Sistema seguro de inicio de sesión con JWT y control de acceso basado en roles (Administrador, Técnico, Usuario Final).
* **Gestión de Tickets:** Ciclo de vida completo de solicitudes de soporte (creación, asignación, actualización de estados y resolución) con trazabilidad de fechas para auditoría.
* **Inventario de Activos:** Módulo integrado para el control y asociación de equipos informáticos (hardware) a las incidencias reportadas.
* **Persistencia Relacional:** Mapeo de entidades (ORM) optimizado para bases de datos SQL.

## 🛠️ Stack Tecnológico
* **Framework:** [NestJS](https://nestjs.com/) (Node.js)
* **Lenguaje:** TypeScript
* **ORM:** TypeORM
* **Base de Datos:** MySQL (Preparado para despliegue en Google Cloud SQL)
* **Arquitectura:** Diseño modular, Inyección de Dependencias, Decoradores personalizados.

## 👨‍💻 Sobre el Desarrollo
Este desarrollo backend forma parte de un proyecto de grado aplicado (Universidad Popular del Cesar) que demuestra competencias avanzadas en la creación de APIs robustas. Se aplican buenas prácticas de ingeniería de software para asegurar una fácil integración con aplicaciones cliente y futuros despliegues nativos en la nube (Cloud Run / Docker).