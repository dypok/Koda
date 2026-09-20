# ADR-010: Arquitectura Backend Hexagonal Modular con Comunicación Basada en Eventos de Dominio y Patrón Cache-Aside

> **Estado:** Aprobado  
> **Fecha:** 2026-09-11  
> **Autores:** Daniel Echeverría & Equipo de Arquitectura Koda (backend-architect)  
> **Trazabilidad:** `11_SYSTEM_ARCHITECTURE.md`, `12_DATABASE_DESIGN.md`, `ADR-008`, `ADR-009`, `RNF-001`, `RNF-007`, `RNF-010`, `RNF-030`  

---

## 1. Contexto y Problema
Tras la adopción oficial de NestJS como motor de backend (`ADR-008`) y la persistencia híbrida políglota con Supabase PostgreSQL y MongoDB (`ADR-009`), se analizó el comportamiento en ejecución del flujo principal de aprendizaje (`POST /intentos`, `POST /lecciones/:id/completar`).

El diseño inicial presentaba una cadena de dependencias síncronas directas:
$$\text{EvaluationService} \longrightarrow \text{ProgressService} \longrightarrow \text{GamificationService} \longrightarrow \text{StreakService}$$

Esta llamada en cascada generaba tres problemas críticos de arquitectura:
1. **Acoplamiento Temporal y Latencia Acumulada:** La respuesta HTTP al usuario quedaba bloqueada hasta que se completaban todas las escrituras y cálculos en PostgreSQL (intento, estrellas, recálculo de nivel, transacciones de XP, estado de racha), elevando el tiempo de respuesta por encima del umbral de $p95 < 200\text{ ms}$ (`RNF-010`).
2. **Riesgo de Dependencias Circulares e Infracción de RNF-030:** Inyectar servicios de gamificación dentro de módulos de progreso crea acoplamiento rígido de clases y dificulta extraer o testear componentes de forma aislada.
3. **Sobrecarga en Consultas de Contenido Curricular:** Las lecturas masivas del árbol curricular y lecciones en MongoDB (con ratio 99.9% lectura / 0.1% escritura) requerían una capa de caché de ultra baja latencia para evitar saturar el pool de conexiones del servidor de base de datos ante picos concurrentes.

## 2. Alternativas Evaluadas

1. **Mantener Inyección Síncrona Directa entre Servicios (Status Quo):**
   - *Ventajas:* Simplicidad conceptual inicial.
   - *Desventajas:* Acoplamiento severo, alta latencia HTTP en el cliente, violaciones frecuentes de `RNF-030` y bloqueos de base de datos en cascada.

2. **Microservicios Independientes con Broker Externo (Kafka / RabbitMQ):**
   - *Ventajas:* Aislamiento de procesos absoluto.
   - *Desventajas:* Complejidad operativa excesiva para el MVP (costo de infraestructura, latencia de red en serialización/deserialización, orquestación con Kubernetes prematura).

3. **Monolito Modular con Hexagonal Ligero, Event Bus Interno en Memoria y Cache-Aside en Redis (Opción Elegida):**
   - *Ventajas:*
     - **Domain Events en Memoria (`@nestjs/event-emitter`):** El servicio educativo resuelve el intento, persiste el estado básico y emite `LessonCompletedEvent`. La respuesta HTTP retorna inmediatamente al estudiante (< 50 ms). Los módulos de Gamificación, Rachas y Logros reaccionan de forma asíncrona en el Event Loop.
     - **Hexagonal Ligero (Ports & Adapters):** Las entidades de dominio interactúan mediante interfaces de repositorio (`ICourseRepository`, `IProgressRepository`), desacoplándose de los drivers de persistencia (Mongoose y Supabase/TypeORM).
     - **Patrón Cache-Aside (Redis L2):** Las consultas de rutas y lecciones consultan primero la memoria caché en $O(1)$ (< 2 ms) con TTL escalonado e invalidación reactiva ante eventos de publicación.
   - *Desventajas:* Exige disciplina en el tipado de los eventos y manejo explícito de errores en los listeners asíncronos.

## 3. Decisión Adoptada
Se adopta formalmente la **Arquitectura Hexagonal Modular con Comunicación Basada en Eventos de Dominio y Patrón Cache-Aside**:

1. **Desacoplamiento por Eventos de Dominio:**
   - La comunicación inter-módulos para efectos secundarios (XP, rachas, estadísticas, notificaciones) se realiza exclusivamente a través del bus de eventos interno de NestJS (`EventEmitter2` / `@nestjs/event-emitter`).
   - Los módulos emisores **no importan ni conocen** a los módulos receptores.
2. **Capa de Dominio Hexagonal con Puertos:**
   - Cada Bounded Context define sus contratos (`Ports`) en su capa de aplicación/dominio.
   - Los adaptadores secundarios en `infrastructure/` implementan la persistencia con Mongoose (MongoDB) o Supabase (PostgreSQL).
3. **Estrategia de Caché L2 (Cache-Aside con Redis):**
   - Contenido de cursos, módulos y lecciones de MongoDB se almacena en Redis con TTL de 24 horas y clave prefijada `koda:content:{slug}`.
   - La publicación o edición de un curso emite `CourseUpdatedEvent`, invalidando la caché de forma determinista sin reinicio del backend.
4. **Patrón Strategy y Factory:**
   - `ICodeRunnerFactory` para conmutar transparentemente entre ejecución en cliente (Pyodide Wasm) y sandbox aislado en backend (Docker / Judge0).
   - `IQuestionEvaluatorFactory` con estrategias dedicadas por tipo de reactivo (`SingleChoice`, `PredictOutput`, `FillBlank`, `TrueFalse`).
5. **Worker Asíncrono para Tareas Pesadas (Outbox/Job Queue):**
   - La generación y subida de diplomas a Google Drive API v3 (`ADR-003`) se encola como trabajo en segundo plano para no demorar la respuesta de finalización de curso.

## 4. Consecuencias
- **Positivas:**
  - Reducción drástica de latencia: el endpoint de lección responde en $p95 < 50\text{ ms}$ al no esperar el recálculo de rachas y gamificación.
  - Cero dependencias circulares en el código de NestJS; cumplimiento riguroso de `RNF-030`.
  - Capacidad de migrar cualquier módulo individual a microservicio independiente en el futuro simplemente reemplazando `EventEmitter2` por RabbitMQ o Kafka sin tocar la lógica de negocio.
  - Testabilidad extrema: el dominio puede probarse al 100% con tests unitarios sin levantar bases de datos ni contenedores.
- **Trade-offs:**
  - La consistencia entre el progreso y el XP pasa a ser eventual (milisegundos) en lugar de una transacción relacional única bloqueante.
  - Se requiere monitorizar y registrar en logs estructurados los posibles fallos en los `EventListeners`.
