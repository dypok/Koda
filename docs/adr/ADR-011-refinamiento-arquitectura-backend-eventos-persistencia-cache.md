# ADR-011: Refinamiento de Arquitectura Backend — Eventos Persistentes con BullMQ, Persistencia Híbrida Desacoplada, Caché L2 Versionada y Contratos DAG

> **Estado:** Aprobado  
> **Fecha:** 2026-09-11  
> **Autores:** Dylan Gamero & Equipo de Arquitectura Koda  
> **Trazabilidad:** `ADR-007`, `ADR-008`, `ADR-009`, `ADR-010`, `11_SYSTEM_ARCHITECTURE.md`, `12_DATABASE_DESIGN.md`, `13_API_SPECIFICATION.md`, `RNF-001`, `RNF-005`, `RNF-010`, `RNF-030`  

---

## 1. Contexto y Problema

Con la adopción de NestJS (`ADR-008`), la persistencia híbrida con MongoDB y Supabase PostgreSQL (`ADR-009`), la arquitectura por eventos de dominio (`ADR-010`) y el Grafo DAG de especializaciones profesionales (`ADR-007`), se identificaron cuatro riesgos técnicos críticos durante la revisión de diseño:

1. **Inconsistencia de Persistencia Híbrida y Claves Foráneas Fantasma:** Mientras que `ADR-009` asignó el currículo a MongoDB, el DDL relacional de PostgreSQL aún definía tablas de preguntas y módulos, con restricciones `FOREIGN KEY` duras desde `user_mistakes_notebook` hacia tablas que en producción viven en MongoDB.
2. **Volatilidad de Eventos en Memoria (`@nestjs/event-emitter`):** El uso exclusivo de un bus en memoria sin persistencia expone al usuario a pérdida definitiva de XP, rachas y logros si el proceso de Node.js se reinicia, colapsa o escala horizontalmente mientras procesa un evento `lesson.completed`.
3. **Invalidación Imprecisa de Caché en Contenido Curricular:** La clave `koda:content:{slug}` con TTL de 24h generaba riesgo de lecturas desactualizadas (*stale reads*) ante ediciones puntuales de preguntas y lecciones.
4. **Desfase de Contratos entre API Spec, `@koda/types` y el Frontend:** El frontend implementó el Grafo DAG de 3 carreras profesionales (Frontend, Backend, DevOps) con compuertas Apex Gate y etiquetas `RQ`, pero los contratos de la API y tipos compartidos continuaban reflejando una ruta lineal monolítica.
5. **Ambigüedad en la Custodia de Autenticación:** Coexistencia no armonizada entre Supabase Auth (RLS) y un sistema JWT propio con Argon2 en NestJS.

---

## 2. Decisiones Técnicas Adoptadas

### A. Persistencia Híbrida Estrictamente Desacoplada
- **MongoDB:** Almacén autoritativo de todo el contenido pedagógico estructurado en árbol/grafo (`tracks`, `courses`, `modules`, `sections`, `lessons`, `question_banks`). Entrega en $O(1)$ sin JOINs.
- **Supabase (PostgreSQL 15+):** Custodia exclusiva de datos transaccionales de usuario (`users`, `user_profiles`, `user_module_progress`, `user_section_stars`, `xp_transactions`, `streaks`, `user_mistakes_notebook`, `certificates`).
- **Enlace Lógico Inmutable:** Las tablas de PostgreSQL referencian el contenido de MongoDB **exclusivamente mediante identificadores textuales inmutables** (`module_slug VARCHAR(80)`, `section_slug VARCHAR(80)`, `lesson_id VARCHAR(64)`, `question_id VARCHAR(64)`), eliminando de raíz cualquier restricción `FOREIGN KEY` inter-base de datos.

### B. Eventos Persistentes y Tareas en Segundo Plano con BullMQ
- Se adopta **BullMQ** (`@nestjs/bullmq`) sobre la instancia existente de Redis para orquestar los efectos secundarios de los eventos de dominio (`lesson.completed`, `course.completed`).
- **Garantías:** Entrega garantizada (*at-least-once*), tolerancia a caídas de contenedores, reintentos exponenciales con jitter, Dead-Letter Queue (DLQ) para auditoría y capacidad nativa de procesamiento distribuido entre múltiples réplicas de NestJS.
- La respuesta HTTP de finalización de lección se emite inmediatamente ($< 50\text{ ms}$) tras encolar el trabajo en BullMQ.

### C. Estrategia de Caché L2 Inmutable y Versionada
- Se adopta el patrón de **Claves Inmutables Versionadas** en Redis:
  $$\text{koda:lesson:}\{\text{slug}\}\text{:v}\{\text{content\_version}\}$$
- Al actualizar una lección o banco de preguntas en MongoDB, se incrementa su `content_version`. Esto genera automáticamente una nueva clave en Redis sin necesidad de purgas masivas destructivas, erradicando lecturas incoherentes.

### D. Formalización de Contratos del Grafo DAG (ADR-007)
- Se incorporan de forma oficial a `13_API_SPECIFICATION.md` y `@koda/types` los 4 endpoints del Roadmap:
  - `GET /api/v1/roadmap/branches`
  - `GET /api/v1/roadmap/branches/:branchId`
  - `GET /api/v1/roadmap/courses/:id/lessons`
  - `GET /api/v1/roadmap/telemetry/milestone`
- Se tipifican los modelos `CareerBranch`, `GraphNode`, `GraphEdge` y `MilestoneTelemetry`.

### E. Unificación de Identidad y Autenticación
- **NestJS actúa como API Gateway y Autoridad de Dominio:** Consume Supabase Auth (GoTrue) como Identity Provider.
- Los tokens JWT emitidos o validados por NestJS utilizan el secreto de Supabase (`SUPABASE_JWT_SECRET`) inyectando los claims canónicos (`sub`, `role: authenticated`, `email`), garantizando interoperabilidad nativa con las políticas de Row-Level Security (RLS) en PostgreSQL.

### F. Repetición Espaciada Adaptativa (Algoritmo SM-2) en Cuaderno de Errores
- Se extiende el Cuaderno de Errores (`user_mistakes_notebook`) incorporando el algoritmo **SuperMemo SM-2**:
  - `interval_days INT DEFAULT 1`
  - `ease_factor NUMERIC(4,2) DEFAULT 2.50`
  - `repetition_count INT DEFAULT 0`
  - `next_review_at TIMESTAMPTZ DEFAULT now()`
- La práctica deliberada de errores programa los repasos en ventanas cognitivas óptimas (1d, 3d, 7d, 16d, 35d).

### G. Verificación Determinista de Código en Servidor
- La evaluación de ejercicios de programación para acreditar XP, estrellas o desbloquear compuertas se ejecuta de forma **determinista y autoritativa en el backend**:
  - WebAssembly (Pyodide) en el frontend solo provee feedback interactivo en tiempo real al estudiante.
  - El backend valida la solución contra suites de pruebas cerradas antes de persistir el progreso.

### H. Topología Relativa de Rejilla (Tier/Lane) y Catálogo NoSQL de Efectos Visuales
- Se erradican las coordenadas fijas de píxeles (`graph_x`, `graph_y`) en los documentos de MongoDB.
- Se adopta la **topología de rejilla relativa**:
  - `tier`: Paso / columna horizontal progresiva hacia la derecha ($1, 2, 3 \dots$).
  - `lane`: Carril vertical (`0` = central, `1` = superior, `-1` = inferior).
- Colección `visual_effects`: Catálogo maestro de animaciones aceleradas 100% por GPU (`laser_flow_fast`, `sonar_radar_pulse`, `boss_threat_pulse`), desacoplando el diseño cosmético del código fuente.

### I. Tríada Evaluativa de Lección (3 Ítems) y Concesión de Estrellas (1–3⭐)
- Cada lección se evalúa mediante una tríada pedagógica integral:
  1. **Ítem 1 (Consola Interactiva):** Desafío de código en editor con ejecución de consola y assertions automáticas.
  2. **Ítem 2 (Comprensión Teórica):** Pregunta conceptual con exactamente **4 opciones de respuesta** (A, B, C, D).
  3. **Ítem 3 (Predicción / Bug Hunt):** Predicción de salida por consola o detección/corrección de error de sintaxis/lógica.
- **Cálculo de Estrellas:**
  - ⭐⭐⭐ (3 Estrellas): Aprueba los 3 ítems al 1er intento.
  - ⭐⭐ (2 Estrellas): Aprueba 2 de los 3 ítems al 1er intento.
  - ⭐ (1 Estrella): Aprueba 1 ítem al 1er intento o completó tras reintentos formativos.

---

## 3. Consecuencias y Beneficios

- **Resiliencia Total:** Ni una caída de servidor ni un reinicio en frío puede corromper las rachas ni el XP de los estudiantes.
- **Cero Deuda Técnica en Base de Datos:** Eliminación de errores de migración por claves foráneas cruzadas entre PostgreSQL y MongoDB.
- **Consistencia de Tipos Monorepo:** Frontend y Backend operan sobre la misma definición exacta de grafo DAG y telemetría de carrera.
- **Rendimiento de Caché:** Cero carreras de concurrencia y entrega en $< 2\text{ ms}$ gracias a claves versionadas.
