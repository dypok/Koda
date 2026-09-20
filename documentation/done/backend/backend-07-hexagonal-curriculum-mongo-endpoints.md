# Entregable Backend: Migración Hexagonal y Conexión de Endpoints a MongoDB

- **ID Entregable:** CURRICULUM-02 / LEARN-02 / LEARN-03
- **Épica:** Épica 4 - Currículo, Grafo DAG y Motor de Aprendizaje
- **Rama:** `feat/backend-mongo-curriculum-seed`
- **Autor:** Dylan Gamero
- **Fecha:** 20/09/2026
- **Estado:** ✅ Backend Completado al 100% · ⚪ Frontend delimitado
- **Trazabilidad:** `ADR-007` (Grafo DAG), `ADR-009` (Persistencia Híbrida Supabase + MongoDB), `ADR-010`/`ADR-011` (Monolito Hexagonal y Puertos/Adaptadores), `ADR-015` (Flujo Backend Koda)

---

## 1. Resumen de la Implementación Backend

En estricto apego al estándar arquitectónico (**Monolito Hexagonal basado en Puertos y Adaptadores**) y el principio de persistencia políglota (**ADR-009**):
1. **Aislamiento Estricto de Frontend:** **0 archivos modificados en `apps/web/`**. Los endpoints mantienen 100% de compatibilidad binaria hacia atrás con las rutas consumidas por el cliente (`/api/v1/roadmap/*` y `/api/v1/learning/*`), mientras que se expone la nueva API REST canónica (`/api/v1/content/*`).
2. **Eliminación Total de Datos Mockeados:** Se erradicaron por completo los mocks hardcodeados en memoria en `LearningService` y las consultas legacy a PostgreSQL/Supabase en `RoadmapService`. Todos los datos provienen en tiempo real de **MongoDB** (`koda-mongo`).
3. **Persistencia Híbrida Desacoplada (ADR-009):** MongoDB custodia exclusivamente el árbol curricular, grafo de habilidades, micro-lecciones y bancos de preguntas; Supabase se reserva únicamente para identidad, autenticación, perfiles y ledger de transacciones.
4. **Dominio Puro (DDD):** Entidades TypeScript sin decoradores de persistencia ni ataduras de framework (`TrackEntity`, `CourseEntity`, `ModuleEntity`, `SectionEntity`, `LessonEntity`, `VisualEffectEntity`), encapsulando las reglas de la **Tríada Evaluativa** e invariantes de topología DAG (`tier` y `lane`).

---

## 2. Componentes Implementados (Arquitectura Hexagonal)

### A. Capa de Dominio (`apps/api/src/domain/`)
- **Entidades (`domain/entities/curriculum/`):**
  - `track.entity.ts`: Especializaciones profesionales.
  - `course.entity.ts`: Nodos del grafo DAG con topología relativa (`tier`/`lane`), prerequisitos y aristas con shaders visuales.
  - `module.entity.ts`: Subdivisiones temáticas evaluables.
  - `section.entity.ts`: Módulos seccionales con recompensas XP.
  - `lesson.entity.ts`: Micro-lección atómica con la **Tríada Evaluativa completa** (teoría, reto de consola con starter code y test cases, quiz conceptual de 4 opciones A/B/C/D con feedback, y predicción/bug hunt).
  - `visual-effect.entity.ts`: Presets de animación acelerados por GPU.
- **Puertos Secundarios (`domain/repositories/`):**
  - `curriculum.repository.ts`: Interfaz `ICurriculumRepository` con métodos de consulta desacoplados.

### B. Capa de Infraestructura (`apps/api/src/infra/database/mongo/`)
- **Adaptador Secundario:**
  - `mongo-curriculum.repository.ts`: Implementa `ICurriculumRepository` inyectando los 7 modelos Mongoose de `DatabaseModule` (`Track`, `Course`, `Module`, `Section`, `Lesson`, `VisualEffect`, `QuestionBank`).

### C. Capa de Aplicación (`apps/api/src/application/use-cases/curriculum/`)
- `get-tracks.use-case.ts`: Consulta de pistas de carrera.
- `get-track-courses.use-case.ts`: Consulta de grafo DAG de una pista.
- `get-course-detail.use-case.ts`: Estructura del curso con sus módulos y secciones.
- `get-lesson-detail.use-case.ts`: Micro-lección con su Tríada Evaluativa.
- `get-visual-effects.use-case.ts`: Catálogo de efectos visuales GPU.
- `get-roadmap-graph.use-case.ts`: Orquestador que calcula coordenadas espaciales y curvas SVG a partir de `tier`/`lane` para proveer `GraphDataset` a `apps/web`.

### D. Capa de Presentación REST (`apps/api/src/presentation/rest/content/`)
- `content.controller.ts`: Endpoints oficiales documentados con Swagger bajo tag `Content & Curriculum`.
- `content.module.ts`: Módulo NestJS que enlaza `ICurriculumRepository` con `MongoCurriculumRepository` y exporta los casos de uso.
- **Refactorización de Servicios Clásicos:**
  - `apps/api/src/modules/roadmap/roadmap.service.ts`: Redirigido a `GetRoadmapGraphUseCase` (MongoDB).
  - `apps/api/src/modules/learning/learning.service.ts`: Redirigido a `ICurriculumRepository` (MongoDB).

---

## 3. Matriz de Endpoints Conectados a MongoDB

| Método | Endpoint | Origen de Datos | Descripción |
|---|---|---|---|
| `GET` | `/api/v1/content/tracks` | MongoDB (`tracks`) | Lista las 4 pistas profesionales (Python, Frontend, Backend, DevOps). |
| `GET` | `/api/v1/content/tracks/:slug` | MongoDB (`tracks` + `courses`) | Árbol DAG de cursos con prerequisitos y aristas. |
| `GET` | `/api/v1/content/courses/:slug` | MongoDB (`courses` + `modules` + `sections`) | Estructura temática del curso con sus módulos y secciones. |
| `GET` | `/api/v1/content/lessons/:slug` | MongoDB (`lessons`) | Micro-lección con la **Tríada Evaluativa completa**. |
| `GET` | `/api/v1/content/visual-effects` | MongoDB (`visual_effects`) | Catálogo de shaders y animaciones GPU. |
| `GET` | `/api/v1/roadmap/:lang/courses` | MongoDB (`courses` vía DAG) | **Compatibilidad Frontend:** Grafo de cursos en formato `GraphDataset`. |
| `GET` | `/api/v1/roadmap/courses/:courseId/lessons` | MongoDB (`lessons`) | **Compatibilidad Frontend:** Grafo de lecciones en formato `GraphDataset`. |
| `GET` | `/api/v1/learning/roadmap/:languageSlug` | MongoDB (`modules` + `sections`) | **Compatibilidad Frontend:** Los 12 módulos y secciones canónicas. |
| `GET` | `/api/v1/learning/lessons/:lessonId` | MongoDB (`lessons`) | **Compatibilidad Frontend:** Detalle de lección con Tríada Evaluativa. |
| `POST` | `/api/v1/learning/lessons/:lessonId/answer` | MongoDB (`lessons`) | **Compatibilidad Frontend:** Evaluación real de respuestas con XP y feedback. |

---

## 4. Pruebas y Verificación

### Pruebas Unitarias Jest:
```bash
pnpm --filter api test
# Test Suites: 10 passed, 10 total
# Tests:       39 passed, 39 total
# Time:        13.671 s
```

### Compilación NestJS / TypeScript:
```bash
pnpm --filter api build
# Exit code 0, 0 errores
```

### Verificación en Vivo contra MongoDB (`koda-mongo`):
```
--- 1. ContentController.getTracks() ---
Tracks count: 4 | Slugs: python, frontend, backend, devops
--- 2. ContentController.getTrackBySlug("python") ---
Track: Pista Fundacional: Python | Courses count: 1
--- 3. ContentController.getCourseBySlug("python-core") ---
Course: Fundamentos de Programación con Python 3.12 | Modules count: 12
--- 4. ContentController.getLessonBySlug("py-m01-s01-l01") ---
Lesson: Bienvenido al universo Python | Has Console Challenge: true
Quiz Options: 4 | Prediction Prompt: ¿Qué resultado mostrará en la 
--- 5. RoadmapController.getCoursesGraph("python") ---
Roadmap Sector: SECTOR: PYTHON ROADMAP (DAG) | Nodes: 6 | Connections: 5
--- 6. LearningController.getRoadmap("python") ---
Language: Pista Fundacional: Python | Modules from Mongo: 12
--- 7. LearningController.getLesson("py-m01-s01-l01") ---
Learning Lesson: Bienvenido al universo Python | Triad Present: true
```
