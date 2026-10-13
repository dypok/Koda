# 🦊 Entregable Backend: Arquitectura Híbrida GraphQL y REST

> **ID de HU y Épica:** EPIC-04 (LEARN-02 / LEARN-05) & Arquitectura Transversal  
> **Título:** Adopción Formal de Arquitectura Híbrida GraphQL y REST (ADR-012)  
> **Rama:** `feat/backend-hybrid-graphql-rest`  
> **Fecha:** 2026-09-20  
> **Estado:** Implementado y Verificado (15 suites / 53 pruebas unitarias aprobadas al 100%)  

---

## 1. Resumen Arquitectónico (Hexagonal Layered Architecture)

Se formalizó la taxonomía de transporte de entrada en el backend de Koda de acuerdo con las especificaciones de **ADR-012** y **13_API_SPECIFICATION.md**:

- **Criterio de Selección de Transporte:**
  - **GraphQL (`/graphql`)**: Asignado a todas las vistas interactivas del estudiante, grafos DAG no planos (Roadmap), micro-lecciones formativas (Tríada evaluativa), remediación en el cuaderno de errores (SM-2) y **todos los dominios previamente clasificados como indiferentes** (catálogo de tracks, presets de efectos visuales GPU, catálogo de lenguajes y preferencias de usuario).
  - **REST (`/api/v1`)**: Reservado de forma estricta y exclusiva para operaciones con estándares HTTP nativos: autenticación y sesiones con cookies `httpOnly`, streaming de binarios y certificados PDF, integración de webhooks externos y telemetría de infraestructura (`/health`).

- **Capas Hexagonales Tocadas:**
  - **Dominio (`src/domain/`):** Modelos puros y puertos `ICurriculumRepository` agnósticos del transporte de red.
  - **Aplicación (`src/application/use-cases/`):** Casos de uso de currículo (`GetTracksUseCase`, `GetTrackCoursesUseCase`, `GetCourseDetailUseCase`, `GetLessonDetailUseCase`, `GetVisualEffectsUseCase`) inyectados idénticamente en GraphQL y REST.
  - **Infraestructura (`src/infra/database/mongo/`):** `MongoCurriculumRepository` sirviendo datos desde la base de datos `koda-mongo`.
  - **Presentación GraphQL (`src/presentation/graphql/`):** 5 módulos con resolvers y tipos Code-First (`CurriculumResolver`, `RoadmapResolver`, `LearningResolver`, `NotebookResolver`, `LanguagesResolver`).
  - **Presentación REST (`src/presentation/rest/`):** Mantenimiento de controladores REST para Auth (`AuthController`), Certificados (`CertificationController`) y coexistencia de compatibilidad.
  - **Transversal (`src/common/guards/app-throttler.guard.ts`):** Guard híbrido con soporte para contexto HTTP y `GqlExecutionContext` garantizando rate limiting uniforme.

---

## 2. Contratos y Operaciones GraphQL (`/graphql`)

| Tipo | Operación | Resolver | Caso de Uso / Servicio Invocado |
|---|---|---|---|
| `Query` | `tracks` | `CurriculumResolver` | `GetTracksUseCase` |
| `Query` | `track(slug)` | `CurriculumResolver` | `GetTrackCoursesUseCase` |
| `Query` | `course(slug)` | `CurriculumResolver` | `GetCourseDetailUseCase` |
| `Query` | `lesson(slug)` | `CurriculumResolver` | `GetLessonDetailUseCase` |
| `Query` | `visualEffects` | `CurriculumResolver` | `GetVisualEffectsUseCase` |
| `Query` | `roadmapCoursesGraph(lang)` | `RoadmapResolver` | `RoadmapService.getCoursesGraph` |
| `Query` | `roadmapLessonsGraph(courseId)` | `RoadmapResolver` | `RoadmapService.getLessonsGraph` |
| `Mutation` | `seedRoadmapDataset(input)` | `RoadmapResolver` | `RoadmapService.seedDataset` |
| `Query` | `learningRoadmap(languageSlug)` | `LearningResolver` | `LearningService.getRoadmap` |
| `Mutation` | `evaluateLessonAnswer(input)` | `LearningResolver` | `LearningService.evaluateAnswer` |
| `Query` | `mistakesNotebook(userId)` | `NotebookResolver` | `NotebookService.getMistakes` |
| `Mutation` | `resolveMistake(questionId, userId)` | `NotebookResolver` | `NotebookService.resolveMistake` |
| `Query` | `languages` | `LanguagesResolver` | `LanguagesService.findAll` |
| `Query` | `language(slug)` | `LanguagesResolver` | `LanguagesService.findBySlug` |

---

## 3. Contratos REST Preservados (`/api/v1`)

- `POST /api/v1/auth/verify-session`
- `GET /api/v1/auth/session`
- `POST /api/v1/auth/register-otp`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/resend-otp`
- `POST /api/v1/auth/complete-onboarding`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/certificates/verify/:code`
- `GET /api/v1/certificates/:id/download-info`
- `GET /health`

---

## 4. Pruebas y Verificación

- **Dependencias:**
  `@nestjs/graphql@^12.2.2`, `@nestjs/apollo@^12.2.2`, `@apollo/server@^4.13.0`, `graphql@^16.14.2`.
- **Suites de Pruebas Unitarias:**
  15 suites ejecutadas exitosamente con Jest:
  - `CurriculumResolver`: 5 pruebas (100% passed).
  - `RoadmapResolver`: 3 pruebas (100% passed).
  - `LearningResolver`: 2 pruebas (100% passed).
  - `NotebookResolver`: 2 pruebas (100% passed).
  - `LanguagesResolver`: 2 pruebas (100% passed).
  - Casos de uso de autenticación, diagnóstico y currículo: 39 pruebas (100% passed).
  - **Total:** 53 pruebas aprobadas.
- **Compilación de Producción:**
  `pnpm --filter api build` ejecutado con éxito sin errores de tipado TypeScript ni de esquemas.
