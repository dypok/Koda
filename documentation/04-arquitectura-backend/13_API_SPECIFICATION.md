# 13 — Especificación de API (API Specification)

> **Estado:** Aprobado · **Versión del documento:** 2.2.0 · **Fecha:** 2026-09-14  
> **Complementa a:** `documentation/01-producto-negocio/`, `documentation/02-requisitos-ux/`, `11_SYSTEM_ARCHITECTURE.md`, `12_DATABASE_DESIGN.md` (v3.0.0), `ADR-007` (Roadmap DAG), `ADR-008` (NestJS Oficial), `ADR-009` (Persistencia Híbrida), `ADR-010` (Hexagonal + Eventos) y `ADR-012` (Arquitectura Híbrida GraphQL y REST).  
> **Zona horaria de timestamps de API:** `America/Bogota` (UTC-5).

---

## 1. Propósito y alcance

Este documento especifica el **contrato HTTP REST (`/api/v1`)** de la plataforma educativa gamificada en NestJS. Conforme a la arquitectura híbrida aprobada en **ADR-012**, REST se reserva de forma exclusiva para operaciones que requieren estándares HTTP nativos (autenticación y sesiones OAuth, subida de archivos binarios, ejecución de sandbox y webhooks de infraestructura), mientras que las pantallas interactivas de usuario, vistas agregadas (Dashboard, Roadmap DAG) y mutaciones formativas son consumidas a través del endpoint primario **GraphQL (`/graphql`)**.

Define qué expone el sistema vía REST, los modelos de datos de entrada/salida, los códigos de estado, las reglas de negocio en cada operación y la interacción entre el almacenamiento de contenido en MongoDB y la persistencia de usuario en Supabase PostgreSQL (`ADR-009`).

**Sí incluye:**
- Base URL y versionado semántico (`/api/v1`).
- Convenciones transversales de paginación, correlación (`X-Request-Id`) e idempotencia (`Idempotency-Key`).
- Autenticación JWT stateless con rotación de refresh tokens y control de acceso RBAC.
- Endpoints de contenido curricular servidos desde MongoDB: `GET /api/v1/content/tracks/:slug`, `GET /api/v1/content/courses/:slug`, `GET /api/v1/content/lessons/:id`.
- Sistema de Roadmap DAG y Candados Progresivos (`ADR-007`) con prerrequisitos `RQ` validados en PostgreSQL.
- Calificación formativa en estrellas (1–3 ⭐) y cuaderno de errores persistente (`user_mistakes_notebook`).
- Emisión atómica de certificados oficiales `CQ-*` respaldados en Google Drive Storage (`ADR-003`).
- Tabla completa de endpoints REST, schemas JSON canónicos y catálogo de errores RFC 7807.

**No incluye:**
- Implementación física interna de base de datos (`12_DATABASE_DESIGN.md`).
- Algoritmos internos de inferencia del Learning Engine (`14_LEARNING_SYSTEM.md`).
- Reglas de maquetación de componentes visuales (`27_UI_UX_SPECIFICATION.md`).

---

## 2. Convenciones generales

### 2.1 Base URL y versionado

```
Base URL (dev):     https://api.duolingo-programacion.local/api/v1
Base URL (staging): https://staging-api.duolingo-programacion.com/api/v1
Base URL (prod):    https://api.duolingo-programacion.com/api/v1
```

- Toda ruta está prefijada con `/api/v1` (`RNF-032`).
- Todo cambio que rompa compatibilidad hacia atrás (breaking change) exigirá un incremento mayor a `/api/v2`.
- `Content-Type: application/json; charset=utf-8` en peticiones y respuestas. `Accept: application/json` requerido.

### 2.2 Identificadores y formatos

| Elemento | Formato | Ejemplo |
|---|---|---|
| ID de recurso (UUID v4) | `string(uuid)` | `0f8a1e3a-4b2c-4d9e-9f1a-2b3c4d5e6f70` |
| ID de certificado | `KODA-{LANG}-{SEQ}` (`01` §22, `17`) | `KODA-PY-000001`, `KODA-PY-000001` |
| Fecha / Hora | ISO 8601 con offset Bogotá (UTC-5) | `2026-09-02T14:30:00-05:00` |
| Código de Lenguaje | `PY`, `PY`, `JS`, `RUST`… | `PY` |
| Estado de Candado Módulo | `locked`, `unlocked` | `unlocked` |
| Estado de Progreso Módulo | `not_started`, `in_progress`, `completed`, `passed`, `failed` | `in_progress` |
| Estado de Candado Sección | `locked`, `unlocked` | `unlocked` |
| Estrellas de Sección | Entero `1` a `3` (`stars_earned`, `max_stars_earned`) | `3` (⭐⭐⭐) |
| Porcentaje de Maestría | Decimal `0.00` a `100.00` | `85.50` |
| Paginación | `?page=1&per_page=20` (1-indexed) | — |
| Ordenamiento | `?sort=created_at&order=desc` | — |
| Idempotencia | Header `Idempotency-Key: <uuid>` en POST de mutación/evaluación | — |
| Correlación | Response header `X-Request-Id: <uuid>` + campo `request_id` en errores (`RNF-041`, `RNF-045`) | — |

### 2.3 Paginación, filtrado y envoltorios

**Request paginado:**
```http
GET /api/v1/notebook/mistakes?page=1&per_page=20&language_id=python HTTP/1.1
```

**Response lista (envoltorio común):**
```json
{
  "data": [ { } ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_items": 4,
    "total_pages": 1
  }
}
```

Regla `RNF-003`: ninguna lista devuelve >100 ítems sin paginación; payload de lección <200 KB JSON sin assets.

### 2.4 Cabeceras transversales

```http
Authorization: Bearer <access_token>    // Requerido salvo endpoints públicos
Idempotency-Key: <uuid>                // Requerido en POST evaluables y de progreso
X-Request-Id: <uuid>                   // Devuelto por el servidor en todas las respuestas
Cache-Control: no-store                // En respuestas autenticadas
```

---

## 3. Autenticación y Autorización

### 3.1 Autenticación JWT Stateless

Mecanismo **stateless JWT** (`RNF-008`, `RNF-005`):

| Token | Vida | Uso |
|---|---|---|
| `access_token` (JWT, HS256/RS256) | 15 min (configurable `RF-AUTH-002`) | `Authorization: Bearer <token>` |
| `refresh_token` (opaco, rotativo) | 7 días | `POST /auth/refresh` → emite par nuevo; el anterior se invalida |

- Contraseñas hasheadas con función adaptativa (`Argon2id` o `bcrypt` con costo $\ge 12$, `RNF-008`).
- `POST /auth/register` envía email de verificación (token un solo uso, expiración 24 h, `RF-AUTH-005`). Verificación **no bloquea** el aprendizaje, pero es requisito indispensable para emitir certificados (`US-059`).
- `refresh` silencioso durante lección activa (`RF-AUTH-007`, `RNF-023`) sin interrumpir la experiencia de usuario.

### 3.2 Autorización RBAC

| Rol / Flag | Descripción | Alcance |
|---|---|---|
| `user` | Usuario estándar registrado | Acceso a sus rutas, progreso, cuaderno de errores, logros y certificados propios. |
| `admin` | Administrador de contenido y sistema | Acceso a `/admin/*`, CRUD de módulos/preguntas, métricas agregadas y publicación sin deploy. |
| `is_premium` | Flag booleano de suscripción | Desactiva anuncios intersticiales entre secciones (`RF-ADS-001/002`). |

---

## 4. Formato estándar de errores

Todas las respuestas de error ($4xx$ y $5xx$) devuelven un JSON canónico:

```json
{
  "error": {
    "code": "MODULE_LOCKED",
    "message": "El módulo se encuentra bloqueado. Debes completar el 100% de las secciones anteriores, aprobar el examen y acumular al menos el 80% de estrellas.",
    "details": {
      "module_id": "0f8a1e3a-4b2c-4d9e-9f1a-2b3c4d5e6f71",
      "required_stars_percentage": 80.00,
      "current_stars_percentage": 66.67,
      "missing_sections": ["sec-08", "sec-09"],
      "exam_passed": false
    },
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-09-02T14:30:00-05:00"
  }
}
```

---

## 5. Taxonomía de Transporte y Catálogo de Endpoints (ADR-012)

Conforme a la **Arquitectura Híbrida Inteligente** formalizada en `ADR-012`, la plataforma Koda divide sus contratos de integración en dos superficies optimizadas:
1. **Superficie REST (`/api/v1`)**: Documentada en Swagger (`/api/docs`), reservada estrictamente para operaciones que requieren estándares HTTP nativos, flujos OAuth/criptográficos, descargas binarias y endpoints de infraestructura.
2. **Superficie GraphQL (`/graphql`)**: Contrato declarativo primario para la experiencia interactiva del estudiante en Next.js 15, eliminando *under-fetching* y *over-fetching*.

---

### 5.1 Superficie Oficial REST `/api/v1` (OpenAPI / Swagger)

> Estos endpoints constituyen la especificación viva generada en `http://localhost:4000/api/docs`.

| # | Tag / Dominio | Método | Endpoint | Auth | Rol | Descripción | Criterio de Inclusión REST |
|---|---|---|---|---|---|---|---|
| 1 | Auth | POST | `/api/v1/auth/register-otp` | No | — | Registro e inicio de sesión con OTP vía Supabase Auth | Flujo transaccional OTP |
| 2 | Auth | POST | `/api/v1/auth/verify-otp` | No | — | Verificación de código OTP y entrega de sesión | Entrega de JWT stateless |
| 3 | Auth | POST | `/api/v1/auth/verify-session` | Sí (Header/Body) | — | Validación y aprovisionamiento de sesión activa | Sincronización criptográfica |
| 4 | Auth | POST | `/api/v1/auth/refresh-session` | Sí (Refresh) | — | Renovación de access token mediante refresh token | Rotación de tokens RFC 6749 |
| 5 | Auth | POST | `/api/v1/auth/complete-onboarding` | Sí | USER | Finalización de onboarding y sincronización de metadata | Persistencia atómica de usuario |
| 6 | Auth | POST | `/api/v1/auth/forgot-password` | No | — | Despacho de enlace para restablecer clave | Integración SMTP Supabase |
| 7 | Auth | POST | `/api/v1/auth/reset-password` | Sí (Token) | — | Actualización segura de contraseña | Estándar de recuperación HTTP |
| 8 | Users | GET | `/api/v1/users/me` | Sí | USER | Consulta de perfil consolidado con cédula enmascarada | Protección estricta de PII |
| 9 | Users | PATCH | `/api/v1/users/me` | Sí | USER | Modificación de nombre, bio y documento legal | Mutación de identidad legal |
| 10 | Users | PATCH | `/api/v1/users/me/preferences` | Sí | USER | Actualización de meta diaria de estudio y estilo | Sincronización de preferencias |
| 11 | Diagnostic & Onboarding | GET | `/api/v1/learning/diagnostic/questions` | Opcional | — | 12 preguntas estratificadas (B1 y B2) para test de entrada | Evaluación diagnóstica inicial |
| 12 | Diagnostic & Onboarding | POST | `/api/v1/learning/diagnostic/submit` | Opcional | — | Evaluación algorítmica y cálculo de módulo inicial | Inferencia pedagógica de entrada |
| 13 | Certification | GET | `/api/v1/certificates/verify/:code` | No (Público) | — | Verificación pública de certificados oficiales (`KODA-PY-*`) | Validación externa por QR/Código |
| 14 | Certification | GET | `/api/v1/certificates/:id/download-info` | Sí | USER | Metadatos y URL de streaming de certificado PDF | Descarga binaria y storage |
| 15 | Root & Health | GET | `/api/v1` | No | — | Estado de salud, versión y metadatos de la plataforma | Probe de infraestructura |

---

### 5.2 Superficie Oficial GraphQL (`/graphql`)

> Contrato fuertemente tipado consumido por el frontend en `apps/web` para navegación y renderizado interactivo:

| Tipo | Operación | Argumentos | Retorno | Descripción |
|---|---|---|---|---|
| `Query` | `tracks` | — | `[TrackType!]!` | Catálogo de pistas profesionales (MongoDB) |
| `Query` | `track` | `slug: String!` | `TrackCoursesType!` | Cursos en topología DAG de una pista |
| `Query` | `course` | `slug: String!` | `CourseDetailType!` | Estructura modular de un curso (módulos y secciones) |
| `Query` | `lesson` | `slug: String!` | `LessonType!` | Micro-lección con la Tríada Evaluativa |
| `Query` | `visualEffects` | — | `[VisualEffectType!]!` | Presets de aristas aceleradas por GPU |
| `Query` | `roadmapCoursesGraph` | `lang: String!` | `GraphDatasetType!` | Grafo interactivo DAG de cursos para el visualizador |
| `Query` | `roadmapLessonsGraph` | `courseId: String!` | `GraphDatasetType!` | Grafo interactivo DAG de lecciones |
| `Query` | `learningRoadmap` | `languageSlug: String!` | `RoadmapResponseType!` | Árbol de roadmap con candados y estrellas |
| `Query` | `learningLesson` | `lessonId: String!` | `LessonDetailType!` | Detalle de lección interactiva |
| `Query` | `mistakesNotebook` | — | `[MistakesNotebookItemType!]!` | Cuaderno de errores persistente para práctica |
| `Query` | `languages` | — | `[LanguageType!]!` | Catálogo de lenguajes disponibles |
| `Query` | `language` | `slug: String!` | `LanguageType!` | Detalle de un lenguaje por su slug |
| `Mutation` | `seedRoadmapDataset` | `input: SeedRoadmapInput!` | `Boolean!` | Sembrado de dataset de grafo desde frontend/admin |
| `Mutation` | `evaluateLessonAnswer` | `input: LessonAnswerInput!` | `LessonAnswerFeedbackType!` | Evaluación de ejercicio con feedback anti-spoilers |
| `Mutation` | `resolveMistake` | `questionId: String!` | `ResolveMistakeResponseType!` | Remediación de error en cuaderno (+5 XP) |

---

### 5.3 Coexistencia Hexagonal y Adaptadores Excluidos de Swagger

En concordancia con el principio de *Driving Adapters* de la Arquitectura Hexagonal:
- Los controladores REST secundarios de currículo (`/api/v1/content/*`), roadmap (`/api/v1/roadmap/*`), lecciones (`/api/v1/learning/*`), cuaderno (`/api/v1/notebook/*`) y lenguajes (`/api/v1/languages/*`) han sido decorados con `@ApiExcludeController()`.
- **Razón técnica:** Se mantienen temporalmente en el código como adaptadores de retrocompatibilidad, pero **no forman parte de la especificación OpenAPI de producción**, garantizando que Swagger (`/api/docs`) sea un espejo fiel, limpio y sin ambigüedades de la superficie REST oficial.

---

## 6. Schemas comunes (contratos JSON)

### 6.1 User y UserProfile
```json
{
  "id": "0f8a1e3a-4b2c-4d9e-9f1a-2b3c4d5e6f70",
  "name": "Brandon Pérez",
  "email": "brandon@example.com",
  "role": "user",
  "avatar_url": "https://cdn.koda.app/avatars/koda.png",
  "email_verified": true,
  "is_premium": false,
  "level": 3,
  "xp_total": 450,
  "profile": {
    "initial_language_slug": "python",
    "experience_level": "beginner",
    "learning_style": "hands-on",
    "daily_goal_id": "regular",
    "daily_goal_minutes": 10,
    "current_streak": 5,
    "longest_streak": 12,
    "streak_freeze_count": 1,
    "total_study_time_seconds": 3600,
    "last_study_date": "2026-09-12",
    "timezone": "America/Bogota"
  },
  "created_at": "2026-09-01T10:00:00-05:00"
}
```

### 6.2 Language
```json
{
  "id": "python",
  "code": "PY",
  "name": "Python",
  "description": "Aprende Python desde cero con micro-lecciones, Koda y proyectos de videojuegos.",
  "status": "available",
  "order": 1,
  "modules_count": 12,
  "total_sections_count": 113,
  "total_stars_possible": 339
}
```

### 6.3 Module (con Candados y Estrellas)
```json
{
  "id": "mod-py-01",
  "language_id": "python",
  "title": "Fundamentos de Python",
  "objective": "Comprender la sintaxis básica, print, comentarios y ejecución.",
  "position": 1,
  "status": "in_progress",
  "is_unlocked": true,
  "unlocked_at": "2026-09-01T10:00:00-05:00",
  "mastered_at": null,
  "min_stars_percentage": 80,
  "stars_total_possible": 27,
  "stars_earned": 22,
  "stars_percentage": 81.48,
  "sections_count": 9,
  "completed_sections_count": 8,
  "requirements": {
    "requires_module_id": null,
    "min_stars_percentage_required": 80,
    "requires_exam_passed": false
  },
  "evaluations": {
    "quiz_id": "qz-py-01",
    "exam_id": "ex-py-01"
  }
}
```

### 6.4 Section y Calificación en Estrellas (`user_section_stars`)
```json
{
  "id": "sec-py-01-03",
  "module_id": "mod-py-01",
  "language_id": "python",
  "title": "Tu primer print",
  "position": 3,
  "section_type": "example",
  "is_unlocked": true,
  "stars_available": 3,
  "user_stars": {
    "stars_earned": 3,
    "max_stars_earned": 3,
    "first_attempt_errors": 0,
    "remedied_in_review": 0,
    "attempt_count": 1,
    "completed_at": "2026-09-02T14:15:00-05:00"
  },
  "lessons_count": 10
}
```

### 6.5 Question (Polimórfica según tipo `15`)
```json
{
  "id": "q-py-01-03-01",
  "section_id": "sec-py-01-03",
  "type": "multiple_choice",
  "difficulty": "easy",
  "concept_id": "py-print-string",
  "prompt": "¿Qué instrucción muestra un mensaje de texto en la pantalla?",
  "code_snippet": null,
  "options": [
    { "id": "a", "text": "print(\"Hola\")" },
    { "id": "b", "text": "show(\"Hola\")" },
    { "id": "c", "text": "escribir(\"Hola\")" },
    { "id": "d", "text": "display(\"Hola\")" }
  ],
  "points": 5
}
```

### 6.6 LessonAnswerFeedback (Anti-Spoilers)
```json
{
  "is_correct": false,
  "question_id": "q-py-01-03-01",
  "explanation": "En Python utilizamos la función print(...) para enviar texto a la consola.",
  "hint": "Recuerda que print significa 'imprimir' en inglés y es la palabra estándar en Python.",
  "added_to_review_queue": true,
  "added_to_mistakes_notebook": true
}
```

### 6.6A LessonTriadSubmission y Feedback de Estrellas (ADR-011)
**Request Payload (`POST /api/v1/learning/lessons/{id}/submit-triad`):**
```json
{
  "lesson_id": "les-dom-02",
  "item_1_code": "const submitBtn = document.querySelector('#btn-submit');",
  "item_2_selected_option_id": "opt-a",
  "item_3_answer": "Hola"
}
```

**Response Payload (`200 OK`):**
```json
{
  "is_completed": true,
  "stars_earned": 3,
  "items_passed": {
    "console": true,
    "options": true,
    "prediction": true
  },
  "score_percentage": 100.0,
  "xp_earned": 25,
  "feedback_message": "¡Excelente! Dominaste el código, la teoría y la predicción al primer intento.",
  "console_output": "Test 1: Passed ✅ (Found #btn-submit)\nTest 2: Passed ✅ (Correct type HTMLButtonElement)",
  "added_to_review_queue": false
}
```

### 6.7 UserMistakesNotebookItem (Cuaderno de Errores con Algoritmo SM-2)
```json
{
  "id": "mstk-0f8a-001",
  "question_id": "q-py-01-03-01",
  "module_id": "mod-py-01",
  "language_id": "python",
  "concept_id": "py-print-string",
  "prompt": "¿Qué instrucción muestra un mensaje de texto en la pantalla?",
  "type": "multiple_choice",
  "options": [
    { "id": "a", "text": "print(\"Hola\")" },
    { "id": "b", "text": "show(\"Hola\")" },
    { "id": "c", "text": "escribir(\"Hola\")" },
    { "id": "d", "text": "display(\"Hola\")" }
  ],
  "user_last_answer": { "selected_option_id": "b" },
  "error_count": 2,
  "interval_days": 3,
  "ease_factor": 2.50,
  "repetition_count": 1,
  "next_review_at": "2026-09-14T10:00:00-05:00",
  "last_failed_at": "2026-09-02T14:10:00-05:00",
  "is_resolved": false,
  "resolved_at": null
}
```

### 6.8 Grafo DAG de Carrera y Telemetría de Roadmap (ADR-007, ADR-011)
```json
{
  "branch": {
    "id": "frontend",
    "name": "Frontend Developer",
    "description": "HTML, CSS, JS DOM, React, Tailwind",
    "progress_percentage": 18,
    "completed_courses": 1,
    "total_courses": 5,
    "stars_earned": 6
  },
  "nodes": [
    {
      "id": "html-semantic",
      "code": "01",
      "title": "HTML SEMÁNTICO",
      "subtitle": "ACTIVO • EN PROGRESO",
      "variant": "active",
      "icon_type": "brackets",
      "graph_x": 140,
      "graph_y": 300,
      "is_unlocked": true,
      "stars_earned": 6,
      "max_stars": 9,
      "prerequisites": []
    },
    {
      "id": "css-modern",
      "code": "02",
      "title": "CSS MODERNO",
      "subtitle": "RQ HTML",
      "variant": "locked",
      "icon_type": "lock",
      "graph_x": 380,
      "graph_y": 300,
      "is_unlocked": false,
      "stars_earned": 0,
      "max_stars": 12,
      "prerequisites": ["html-semantic"]
    }
  ],
  "connections": [
    {
      "id": "edge-html-css",
      "from_id": "html-semantic",
      "to_id": "css-modern",
      "variant": "direct",
      "is_completed": false
    }
  ]
}
```

### 6.9 Roadmap Completo (Ruta Canónica de Módulos)
```json
{
  "language_id": "python",
  "language_name": "Python",
  "total_stars_earned": 45,
  "total_stars_possible": 339,
  "global_percentage": 13.27,
  "modules": [
    {
      "id": "mod-py-01",
      "position": 1,
      "title": "Fundamentos de Python",
      "status": "passed",
      "is_unlocked": true,
      "stars_earned": 26,
      "stars_total_possible": 27,
      "stars_percentage": 96.30,
      "min_stars_percentage": 80,
      "can_unlock_next": true,
      "sections": [
        { "id": "sec-01", "position": 1, "is_unlocked": true, "stars_earned": 3, "max_stars_earned": 3, "status": "completed" },
        { "id": "sec-02", "position": 2, "is_unlocked": true, "stars_earned": 3, "max_stars_earned": 3, "status": "completed" },
        { "id": "sec-09", "position": 9, "is_unlocked": true, "stars_earned": 2, "max_stars_earned": 2, "status": "completed" }
      ]
    },
    {
      "id": "mod-py-02",
      "position": 2,
      "title": "Variables y tipos de datos",
      "status": "in_progress",
      "is_unlocked": true,
      "stars_earned": 19,
      "stars_total_possible": 30,
      "stars_percentage": 63.33,
      "min_stars_percentage": 80,
      "can_unlock_next": false,
      "sections": [
        { "id": "sec-01", "position": 1, "is_unlocked": true, "stars_earned": 3, "max_stars_earned": 3, "status": "completed" },
        { "id": "sec-07", "position": 7, "is_unlocked": true, "stars_earned": 0, "max_stars_earned": 0, "status": "in_progress" },
        { "id": "sec-08", "position": 8, "is_unlocked": false, "stars_earned": 0, "max_stars_earned": 0, "status": "locked" }
      ]
    },
    {
      "id": "mod-py-03",
      "position": 3,
      "title": "Operadores",
      "status": "not_started",
      "is_unlocked": false,
      "stars_earned": 0,
      "stars_total_possible": 27,
      "stars_percentage": 0.00,
      "min_stars_percentage": 80,
      "can_unlock_next": false,
      "sections": []
    }
  ]
}
```

---

## 7. Detalle de endpoints clave

### 7.1 `POST /auth/register` — Registro

- **Auth:** No · **Idempotencia:** No
- **RF:** RF-AUTH-001, RF-USR-001 · **RNF:** RNF-008 (Argon2id/bcrypt)

**Request (incorporando las opciones del stepper de registro del frontend):**
```json
{
  "fullName": "Brandon Pérez",
  "email": "brandon@example.com",
  "password": "PasswordSeguro!2026",
  "selectedLanguageId": "python",
  "selectedExperienceId": "beginner",
  "selectedStyleId": "hands-on",
  "selectedGoalId": "regular"
}
```

**Response `201 Created`:**
```json
{
  "data": {
    "user": {
      "id": "0f8a1e3a-4b2c-4d9e-9f1a-2b3c4d5e6f70",
      "email": "brandon@example.com",
      "role": "user",
      "email_verified": false
    },
    "profile": {
      "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "user_id": "0f8a1e3a-4b2c-4d9e-9f1a-2b3c4d5e6f70",
      "display_name": "Brandon Pérez",
      "initial_language_slug": "python",
      "experience_level": "beginner",
      "learning_style": "hands-on",
      "daily_goal_id": "regular",
      "daily_goal_minutes": 10,
      "total_xp": 0,
      "level": 1,
      "current_streak": 0,
      "longest_streak": 0,
      "streak_freeze_count": 1,
      "total_study_time_seconds": 0,
      "timezone": "America/Bogota"
    },
    "tokens": {
      "access_token": "eyJhbGciOi...",
      "refresh_token": "7a8b9c...",
      "expires_in": 900,
      "token_type": "Bearer"
    }
  }
}
```

---

### 7.2 `POST /auth/login` — Inicio de sesión

- **Auth:** No · **RF:** RF-AUTH-002, RF-AUTH-006

**Request:**
```json
{
  "email": "brandon@example.com",
  "password": "PasswordSeguro!2026"
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "user": {
      "id": "0f8a1e3a-4b2c-4d9e-9f1a-2b3c4d5e6f70",
      "name": "Brandon Pérez",
      "role": "user",
      "is_premium": false,
      "level": 3,
      "xp_total": 450
    },
    "tokens": {
      "access_token": "eyJhbGciOi...",
      "refresh_token": "7a8b9c...",
      "expires_in": 900
    }
  }
}
```

---

### 7.3 `GET /languages` — Listar lenguajes de programación

- **Auth:** No (público) · **Paginación:** Sí · **RF:** RF-LANG-001

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "python",
      "code": "PY",
      "name": "Python",
      "description": "Ruta interactiva de 12 módulos y micro-lecciones con Koda y proyectos de videojuegos.",
      "status": "available",
      "order": 1,
      "modules_count": 12,
      "total_stars_possible": 339
    },
    {
      "id": "py",
      "code": "PY",
      "name": "Python",
      "description": "Ruta interactiva de fundamentos a POO y proyecto final.",
      "status": "available",
      "order": 2,
      "modules_count": 12,
      "total_stars_possible": 360
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total_items": 2, "total_pages": 1 }
}
```

---

### 7.4 `GET /languages/{id}/roadmap` — Roadmap Interactivo Consolidado

- **Auth:** Sí (`USER`) · **RF:** RF-CANDADO-001–004, RF-ESTRELLA-001–005, RF-RUTA-001/002

**Path params:** `id` = `python` | `py` | UUID

**Response `200 OK`:**
Retorna el schema detallado en §6.8 con todos los módulos, candados, estrellas acumuladas y secciones intra-módulo.

---

### 7.5 `GET /sections/{id}` — Detalle de sección y micro-lecciones

- **Auth:** Sí (`USER`) · **RF:** RF-SEC-002/004, RF-ESTRELLA-004

**Response `200 OK`:**
```json
{
  "data": {
    "id": "sec-py-01-03",
    "module_id": "mod-py-01",
    "language_id": "python",
    "title": "Tu primer print",
    "position": 3,
    "is_unlocked": true,
    "stars_available": 3,
    "user_stars": {
      "stars_earned": 3,
      "max_stars_earned": 3,
      "first_attempt_errors": 0,
      "attempt_count": 1
    },
    "lessons": [
      { "id": "les-python-01-03-01", "position": 1, "title": "¿Qué hace print?", "concept_id": "python-print-intro", "status": "completed" },
      { "id": "les-python-01-03-02", "position": 2, "title": "Imprimir texto entre comillas", "concept_id": "py-print-string", "status": "completed" }
    ]
  }
}
```

---

### 7.6 `POST /lessons/{id}/answer` — Enviar respuesta de ejercicio (Feedback Anti-Spoilers)

- **Auth:** Sí · **Idempotencia:** Recomendada (`Idempotency-Key`)
- **RF:** RF-PREG-004/005, RF-CUADERNO-001 · **RNF:** RNF-010 (<1 s)

**Request:**
```json
{
  "question_id": "q-py-01-03-01",
  "selected_option_id": "b",
  "time_spent_seconds": 12
}
```

**Response `200 OK` (Respuesta Incorrecta):**
```json
{
  "data": {
    "is_correct": false,
    "question_id": "q-py-01-03-01",
    "explanation": "En Python utilizamos la función print(...) para enviar texto a la consola.",
    "hint": "Recuerda que print significa 'imprimir' en inglés y es la palabra estándar en Python.",
    "added_to_review_queue": true,
    "added_to_mistakes_notebook": true,
    "first_attempt_error_registered": true
  }
}
```

**Response `200 OK` (Respuesta Correcta):**
```json
{
  "data": {
    "is_correct": true,
    "question_id": "q-py-01-03-01",
    "explanation": "¡Exacto! print(\"Hola\") muestra el texto en la consola de salida.",
    "hint": null,
    "xp_awarded": 5
  }
}
```

---

### 7.7 `POST /sections/{id}/complete` — Cierre y Calificación en Estrellas (1 a 3 ⭐)

- **Auth:** Sí · **Idempotencia:** Sí (`Idempotency-Key` obligatorio)
- **RF:** RF-SEC-003, RF-ESTRELLA-001–005, RF-CANDADO-002/003, RF-XP-001

**Request:**
```json
{
  "time_spent_seconds": 240,
  "first_attempt_errors": 0,
  "remedied_in_review": 0
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "section_id": "sec-py-01-03",
    "module_id": "mod-py-01",
    "language_id": "python",
    "status": "completed",
    "stars": {
      "stars_earned": 3,
      "max_stars_earned": 3,
      "is_new_high_score": true,
      "first_attempt_errors": 0,
      "remedied_in_review": 0,
      "attempt_count": 1
    },
    "rewards": {
      "xp_awarded": 10,
      "xp_total": 460,
      "level": 3,
      "level_up": false,
      "streak": { "current": 3, "longest": 3 }
    },
    "unlocks": {
      "unlocked_next_section_id": "sec-py-01-04",
      "module_unlocked_next": false,
      "module_stars_percentage": 33.33,
      "module_stars_earned": 9,
      "module_stars_total_possible": 27
    },
    "ads": {
      "show_interstitial": false,
      "reason": "free_user_completed_section"
    }
  }
}
```

---

### 7.8 `GET /notebook/mistakes` — Listar Cuaderno de Errores Persistente

- **Auth:** Sí (`USER`) · **RF:** RF-CUADERNO-001–004

**Query params:**

| Param | Tipo | Default | Descripción |
|---|---|---|---|
| `language_id` | string | `python` | Filtro por lenguaje |
| `module_id` | string | null | Filtro por módulo específico |
| `is_resolved` | boolean | `false` | `false` para errores pendientes, `true` para remediados |
| `page` | int | 1 | Número de página |
| `per_page` | int | 20 | Ítems por página |

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "mstk-01",
      "question_id": "q-py-01-03-01",
      "module_id": "mod-py-01",
      "language_id": "python",
      "concept_id": "py-print-string",
      "prompt": "¿Qué instrucción muestra un mensaje de texto en la pantalla?",
      "type": "multiple_choice",
      "options": [
        { "id": "a", "text": "print(\"Hola\")" },
        { "id": "b", "text": "show(\"Hola\")" },
        { "id": "c", "text": "escribir(\"Hola\")" },
        { "id": "d", "text": "display(\"Hola\")" }
      ],
      "error_count": 2,
      "last_failed_at": "2026-09-02T14:10:00-05:00",
      "is_resolved": false
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total_items": 1, "total_pages": 1 }
}
```

---

### 7.9 `POST /notebook/mistakes/{question_id}/resolve` — Remediar Error en Cuaderno (+5 XP)

- **Auth:** Sí · **Idempotencia:** Sí (`Idempotency-Key` obligatorio)
- **RF:** RF-CUADERNO-005/006, RF-XP-001

**Request:**
```json
{
  "selected_option_id": "a",
  "time_spent_seconds": 15
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "question_id": "q-py-01-03-01",
    "is_correct": true,
    "is_resolved": true,
    "resolved_at": "2026-09-02T14:35:00-05:00",
    "rewards": {
      "xp_awarded": 5,
      "xp_total": 465,
      "reason": "mistake_notebook_resolved"
    },
    "explanation": "¡Excelente remediación! Dominaste el concepto 'py-print-string'."
  }
}
```

---

### 7.10 `POST /quiz/{id}/attempt` — Enviar Intento de Quiz (Umbral 70%)

- **Auth:** Sí · **Idempotencia:** Sí (`Idempotency-Key`) · **RF:** RF-QUIZ-002/003/006, RF-EVAL-001/002

**Request:**
```json
{
  "answers": [
    { "question_id": "q-qz-01", "selected_option_id": "b" },
    { "question_id": "q-qz-02", "selected_option_id": "a" }
  ],
  "time_spent_seconds": 180
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "attempt_id": "att-qz-001",
    "quiz_id": "qz-py-01",
    "score": 90,
    "percentage": 90.00,
    "passed": true,
    "threshold_applied": 70.00,
    "rewards": {
      "xp_awarded": 25,
      "xp_total": 490
    },
    "details": [
      { "question_id": "q-qz-01", "is_correct": true, "points": 10 },
      { "question_id": "q-qz-02", "is_correct": true, "points": 10 }
    ]
  }
}
```

---

### 7.11 `POST /exam/{id}/attempt` — Enviar Intento de Examen (Umbral 80% y Desbloqueo)

- **Auth:** Sí · **Idempotencia:** Sí (`Idempotency-Key`) · **RF:** RF-EXAM-003/004/005, RF-CANDADO-003

**Request:**
```json
{
  "answers": [
    { "question_id": "q-ex-01", "selected_option_id": "c" },
    { "question_id": "q-ex-20", "selected_option_id": "a" }
  ],
  "time_spent_seconds": 600
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "attempt_id": "att-ex-001",
    "exam_id": "ex-py-01",
    "module_id": "mod-py-01",
    "score": 85,
    "percentage": 85.00,
    "passed": true,
    "threshold_applied": 80.00,
    "module_mastered": true,
    "next_module_unlocked": true,
    "unlocked_module_id": "mod-py-02",
    "rewards": {
      "xp_awarded": 100,
      "xp_total": 590
    }
  }
}
```

---

### 7.12 `GET /progress/streak` — Estado de Racha y Tiempo de Estudio Diario

- **Auth:** Sí (Bearer Token) · **Idempotencia:** No · **RF:** RF-RACHA-001–005, RF-PROF-006

**Response `200 OK`:**
```json
{
  "data": {
    "current_streak": 7,
    "longest_streak": 14,
    "last_activity_date": "2026-09-12",
    "is_active_today": true,
    "freeze_count": 2,
    "today_study_time_seconds": 720,
    "daily_goal_minutes": 10,
    "daily_goal_met": true,
    "timezone": "America/Bogota",
    "recent_history": [
      {
        "activity_date": "2026-09-12",
        "study_time_seconds": 720,
        "lessons_completed_count": 3,
        "xp_earned_today": 45,
        "daily_goal_met": true,
        "freeze_used": false
      },
      {
        "activity_date": "2026-09-11",
        "study_time_seconds": 650,
        "lessons_completed_count": 2,
        "xp_earned_today": 30,
        "daily_goal_met": true,
        "freeze_used": false
      }
    ]
  }
}
```

---

### 7.13 `PATCH /users/me/preferences` — Actualizar Preferencias y Metas de Estudio

- **Auth:** Sí (Bearer Token) · **Idempotencia:** No · **RF:** RF-USR-002, RF-RACHA-004

**Request:**
```json
{
  "learning_style": "gamified",
  "daily_goal_id": "focused",
  "daily_goal_minutes": 15,
  "timezone": "America/Bogota"
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "learning_style": "gamified",
    "daily_goal_id": "focused",
    "daily_goal_minutes": 15,
    "timezone": "America/Bogota",
    "updated_at": "2026-09-12T16:35:00-05:00"
  }
}
```

---

## 8. Catálogo de códigos de error por dominio

| Dominio | HTTP | `code` | Mensaje (es) | RF / RNF |
|---|---|---|---|---|
| **Auth** | 400 | `VALIDATION_ERROR` | Campos de registro o credenciales con formato inválido. | RF-AUTH-001 |
| **Auth** | 401 | `INVALID_CREDENTIALS` | Credenciales incorrectas. | RF-AUTH-002, RNF-041 |
| **Auth** | 401 | `INVALID_REFRESH` | Refresh token inválido, reutilizado o expirado. | RF-AUTH-007 |
| **Auth** | 409 | `EMAIL_TAKEN` | El correo electrónico ya se encuentra registrado. | RF-AUTH-001 |
| **Auth** | 429 | `RATE_LIMITED` | Demasiadas solicitudes. Reintenta en {s} segundos. | RF-AUTH-006 |
| **Roadmap** | 422 | `MODULE_LOCKED` | Módulo bloqueado. Requiere 100% de secciones del módulo anterior, examen aprobado y $\ge 80\%$ de estrellas. | RF-CANDADO-003, RF-RUTA-004 |
| **Roadmap** | 422 | `SECTION_LOCKED` | Sección bloqueada. Debes completar la sección inmediatamente anterior. | RF-CANDADO-002, RF-SEC-004 |
| **Roadmap** | 422 | `INSUFFICIENT_STARS` | Estrellas insuficientes en el módulo actual para abrir el siguiente módulo. | RF-ESTRELLA-003, RF-MOD-004 |
| **Notebook** | 404 | `QUESTION_NOT_IN_MISTAKES` | La pregunta indicada no existe en tu cuaderno de errores activos. | RF-CUADERNO-003 |
| **Notebook** | 409 | `ALREADY_RESOLVED` | El error ya fue remediado previamente en el cuaderno. | RF-CUADERNO-005 |
| **Lessons** | 422 | `LESSON_LOCKED` | Micro-lección bloqueada. Completa las anteriores. | RF-LEC-004 |
| **Lessons** | 409 | `ALREADY_COMPLETED` | Lección o sección ya completada (idempotencia garantizada). | RF-XP-005 |
| **Quiz/Exam**| 400 | `INCOMPLETE_ANSWERS` | Faltan respuestas para preguntas obligatorias de la evaluación. | RF-QUIZ-002, RF-EXAM-001 |
| **Quiz/Exam**| 409 | `IDEMPOTENCY_CONFLICT` | Mismo `Idempotency-Key` enviado con payload diferente. | RNF-042 |
| **Certificates**| 403 | `NOT_CERTIFICATE_OWNER` | Solo el titular registrado puede descargar el PDF oficial. | RF-PDF-002 |
| **Certificates**| 404 | `CERTIFICATE_NOT_FOUND` | Certificado no encontrado para el código proporcionado. | RF-CERT-006 |
| **Certificates**| 422 | `CERTIFICATE_NOT_ELIGIBLE` | Debes completar y aprobar los 12 módulos y verificar tu correo. | RF-CERT-001, RF-AUTH-005 |
| **Admin** | 403 | `ADMIN_REQUIRED` | Se requieren privilegios de administrador. | RF-ADM-007 |
| **Admin** | 422 | `CONTENT_VALIDATION_FAILED` | Error de validación semántica o pedagógica en el contenido. | RF-ADM-006 |

---

## 9. Ejemplos de consumo cURL (Flujo Integral de Aprendizaje)

```bash
# 1. Login y obtención de tokens
curl -X POST https://api.duolingo-programacion.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"brandon@example.com","password":"PasswordSeguro!2026"}'

# 2. Consultar Roadmap de Python con Candados y Estrellas
curl https://api.duolingo-programacion.com/api/v1/languages/python/roadmap \
  -H "Authorization: Bearer $ACCESS"

# 3. Enviar respuesta a ejercicio interactivo (Feedback Anti-Spoilers)
curl -X POST https://api.duolingo-programacion.com/api/v1/lessons/les-python-01-03-01/answer \
  -H "Authorization: Bearer $ACCESS" \
  -H "Content-Type: application/json" \
  -d '{"question_id":"q-py-01-03-01","selected_option_id":"b","time_spent_seconds":15}'

# 4. Completar sección y calificar con 3 Estrellas (Idempotente)
curl -X POST https://api.duolingo-programacion.com/api/v1/sections/sec-py-01-03/complete \
  -H "Authorization: Bearer $ACCESS" \
  -H "Idempotency-Key: 550e8400-e29b-41d4-a716-446655440001" \
  -H "Content-Type: application/json" \
  -d '{"time_spent_seconds":240,"first_attempt_errors":0,"remedied_in_review":0}'

# 5. Consultar Cuaderno de Errores pendientes
curl https://api.duolingo-programacion.com/api/v1/notebook/mistakes?language_id=python&is_resolved=false \
  -H "Authorization: Bearer $ACCESS"

# 6. Remediar error en el Cuaderno (+5 XP)
curl -X POST https://api.duolingo-programacion.com/api/v1/notebook/mistakes/q-py-01-03-01/resolve \
  -H "Authorization: Bearer $ACCESS" \
  -H "Idempotency-Key: 550e8400-e29b-41d4-a716-446655440002" \
  -H "Content-Type: application/json" \
  -d '{"selected_option_id":"a","time_spent_seconds":10}'

# 7. Enviar Intento de Examen de Módulo (Compuerta de Maestría >=80%)
curl -X POST https://api.duolingo-programacion.com/api/v1/exam/ex-py-01/attempt \
  -H "Authorization: Bearer $ACCESS" \
  -H "Idempotency-Key: 550e8400-e29b-41d4-a716-446655440003" \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"question_id":"q-ex-01","selected_option_id":"c"}],"time_spent_seconds":550}'

# 8. Verificar Certificado Público (Sin PII)
curl https://api.duolingo-programacion.com/api/v1/certificates/KODA-PY-000001
```

---

## 10. Matriz de Trazabilidad RF → Endpoints

| Código RF | Endpoint(s) REST | Historias de Usuario (US) |
|---|---|---|
| `RF-AUTH-001–007` | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `POST /auth/verify-email` | US-001–US-005 |
| `RF-USR-001–005` | `GET/PATCH/DELETE /users/me` | US-006, US-007 |
| `RF-PROF-001–007` | `GET /users/me`, `GET /users/me/progress`, `GET /users/me/stats` | US-008, US-011 |
| `RF-LANG-001–004` | `GET /languages`, `GET /languages/{id}`, `GET /languages/{id}/modules` | US-013, US-014 |
| `RF-RUTA-001–004` | `GET /languages/{id}/roadmap`, `GET /languages/{id}/modules` | US-015–US-018 |
| `RF-CANDADO-001–004` | `GET /languages/{id}/roadmap`, `GET /modules/{id}`, `GET /sections/{id}` | US-016, US-019 |
| `RF-ESTRELLA-001–005` | `POST /sections/{id}/complete`, `GET /sections/{id}`, `GET /languages/{id}/roadmap` | US-020, US-021 |
| `RF-CUADERNO-001–006` | `GET /notebook/mistakes`, `POST /notebook/mistakes/{question_id}/resolve`, `POST /lessons/{id}/answer` | US-022, US-023 |
| `RF-MOD-001–005` | `GET /modules/{id}`, `GET /modules/{id}/sections` | US-023, US-024 |
| `RF-SEC-001–005` | `GET /sections/{id}`, `POST /sections/{id}/complete` | US-025, US-026 |
| `RF-LEC-001–004` | `GET /lessons/{id}`, `POST /lessons/{id}/complete`, `POST /lessons/{id}/answer` | US-027–US-030 |
| `RF-PREG-001–006` | `POST /lessons/{id}/answer`, `POST /quiz/{id}/attempt`, `POST /exam/{id}/attempt` | US-031, US-032 |
| `RF-QUIZ-001–006` | `GET /quizzes/{id}`, `POST /quiz/{id}/attempt`, `GET /quiz/{id}/attempts` | US-033–US-035 |
| `RF-EXAM-001–007` | `GET /exams/{id}`, `POST /exam/{id}/attempt`, `GET /exam/{id}/attempts` | US-036–US-039 |
| `RF-EVAL-001–006` | Evaluador en servidor en `POST /lessons/{id}/answer`, `POST /quiz/{id}/attempt`, `POST /exam/{id}/attempt` | US-040 |
| `RF-XP-001–005` | Motor de XP en `/sections/{id}/complete`, `/quiz/{id}/attempt`, `/exam/{id}/attempt`, `/notebook/mistakes/{id}/resolve` | US-041–US-043 |
| `RF-RACHA-001–005` | `GET /progress/streak`, `GET /users/me/progress` | US-044, US-045 |
| `RF-LOGRO-001–005` | `GET /users/me/achievements` | US-046–US-048 |
| `RF-REP-001–005` | `GET /review/recommended`, `POST /review/attempt`, `POST /sections/{id}/review-queue/answer` | US-049–US-051 |
| `RF-CERT-001–006` | `GET /users/me/certificates`, `GET /certificates/{id}`, `POST /certificates/verify` | US-054–US-058 |
| `RF-PDF-001–004` | `GET /certificates/{id}/pdf` | US-056, US-060 |
| `RF-ADM-001–009` | `/admin/*` | US-067–US-072 |

---

## 11. Consideraciones no funcionales (RNF)

| Requisito | Garantía en Contrato de API |
|---|---|
| **RNF-001** | Tiempo de respuesta p95: lecturas `<300 ms`, envío de ejercicios `<500 ms`, calificación de quiz/examen `<2 s`. |
| **RNF-003** | Paginación por defecto en todas las colecciones; payload máximo de lección `<200 KB`. |
| **RNF-008 / RNF-009** | Cifrado en tránsito TLS 1.3, hashing adaptativo Argon2id/bcrypt, RBAC y aislamiento multi-inquilino por `user_id`. |
| **RNF-010** | Feedback formativo de ejercicios devuelto en tiempo real ($<1\text{ s}$). |
| **RNF-014** | Degradado elegante: si el servicio de email o generación de PDF se retrasa, el avance y la calificación no se bloquean. |
| **RNF-032** | Versionado explícito en path `/api/v1` y validación estricta de esquemas OpenAPI 3.0.3 en pipeline CI. |
| **RNF-033 / RNF-042** | Idempotencia garantizada en todas las transacciones de XP, intentos de examen y completitud de sección vía `Idempotency-Key`. |
| **RNF-037 / RNF-039** | Privacidad por diseño: enmascaramiento de números de documento en endpoints públicos de verificación (`CC ***678`) y cero PII en logs. |

---

## 12. Checklist de conformidad por endpoint

Cada endpoint REST en backend debe satisfacer el siguiente checklist previo a su pase a producción:

- [ ] Contrato documentado e integrado en `openapi.yaml` (pasa linter `spectral` sin advertencias).
- [ ] Validación de payload con esquema Zod / Joi en servidor (rechaza campos no tipados).
- [ ] Aislamiento estricto de usuario autenticado contra `user_id` del token JWT (prevención IDOR).
- [ ] Implementación de `Idempotency-Key` en operaciones de escritura financiera/gamificada/evaluativa.
- [ ] Registro estructurado de trazas en JSON con `request_id`, método, ruta y código HTTP.
- [ ] Pruebas automatizadas unitarias y de integración en `20_TESTING.md` con cobertura $\ge 70\%$.

---

*Fin de `13_API_SPECIFICATION.md` v2.0.0 — Cualquier modificación a contratos existentes requiere registro en `CHANGELOG.md` y versionado semántico.*
