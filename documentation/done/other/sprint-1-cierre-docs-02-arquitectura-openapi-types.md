# Entregable Cierre de Sprint 1: DOCS-02 — Arquitectura Modular, OpenAPI / Swagger y Contratos de Tipos

- **ID Historia de Usuario:** DOCS-02
- **Épica:** Épica 1 — Montado de Documentación, Arquitectura y Gobernanza Técnica
- **Rama:** `develop`
- **Autor:** Daniel Echeverría
- **Fecha:** 21/09/2026
- **Estado:** ✅ Completado (Sprint 1 Cerrado)

---

## 1. Resumen Ejecutivo
Se completó la formalización, verificación y depuración técnica de la arquitectura de contratos de Koda para el cierre definitivo del **Sprint 1**, garantizando **End-to-End Type Safety** en todo el monorepo y una separación nítida e inteligente entre la superficie **REST (`/api/v1`)** y la superficie **GraphQL (`/graphql`)** conforme a **ADR-012**.

Se eliminó la contaminación de Swagger (`/api/docs`), asegurando que la documentación viva de OpenAPI exponga con estricta fidelidad únicamente los endpoints transaccionales legítimos de carga pesada y estándares HTTP nativos, mientras que el consumo interactivo y modular queda formalizado a través de GraphQL.

---

## 2. Cumplimiento de Criterios de Aceptación (DoD)

| Criterio de Aceptación | Estado | Evidencia / Ubicación |
|---|---|---|
| **Arquitectura en 4 capas y 9 motores (`RNF-006`)** | ✅ Cumplido | `documentation/04-arquitectura-backend/11_SYSTEM_ARCHITECTURE.md` detalla las 4 capas hexagonales y los 9 motores desacoplados con diagramas Mermaid. |
| **Modelo ER con 18 tablas PostgreSQL en Supabase** | ✅ Cumplido | `documentation/04-arquitectura-backend/12_DATABASE_DESIGN.md` y `apps/api/prisma/schema.prisma` mapean las 18 tablas, tipos enums e índices p95 < 100 ms. |
| **Especificación de Contratos y Taxonomía ADR-012** | ✅ Cumplido | `documentation/04-arquitectura-backend/13_API_SPECIFICATION.md` §5 reestructurado con separación estricta: REST v2.0 oficial vs Catálogo GraphQL. |
| **Paquete Compartido `@koda/types` compilado en `dist/`** | ✅ Cumplido | `packages/types/dist/` generado con TypeScript (`index.d.ts`, `index.js`), tipando usuarios, roadmap, lecciones, rachas y certificados. |
| **Consumo vía `workspace:*` en `apps/api` y `apps/web`** | ✅ Cumplido | `apps/api/package.json` y `apps/web/package.json` enlazan `@koda/types: workspace:*` con resolución estricta. |
| **Swagger Operativo en `/api/docs`** | ✅ Cumplido | Configurado en `apps/api/src/main.ts` y decorado en controladores oficiales REST con exclusión de endpoints redundantes. |

---

## 3. Depuración de Swagger y Taxonomía de Transporte

### A. Superficie REST Oficial (`/api/v1` documentada en Swagger)
1. **`Auth` (`/api/v1/auth/*`)**: Registro con OTP, verificación de sesión JWT, refresh tokens, recuperación y cambio de contraseña con Supabase Auth.
2. **`Users` (`/api/v1/users/*`)**: Perfil consolidado, enmascaramiento legal de cédula/pasaporte, actualización de identidad y preferencias.
3. **`Diagnostic & Onboarding` (`/api/v1/learning/diagnostic/*`)**: Banco de 12 preguntas calibradas y algoritmo de evaluación de nivel de entrada.
4. **`Certification` (`/api/v1/certificates/*`)**: Verificación pública por código QR e información de streaming de certificados PDF.
5. **`Root & Health` (`/api/v1`)**: Probes de infraestructura, estado operativo y metadatos de versión.

### B. Superficie GraphQL Oficial (`/graphql` consumida por `apps/web`)
- **Queries:** `tracks`, `track`, `course`, `lesson`, `visualEffects`, `roadmapCoursesGraph`, `roadmapLessonsGraph`, `learningRoadmap`, `learningLesson`, `mistakesNotebook`, `languages`, `language`.
- **Mutations:** `seedRoadmapDataset`, `evaluateLessonAnswer` (con feedback anti-spoilers), `resolveMistake` (+5 XP).

### C. Aislamiento y Exclusión con `@ApiExcludeController()`
Para evitar que endpoints residuales o duplicados de currículo/roadmap contaminaran la especificación OpenAPI, se decoraron con `@ApiExcludeController()`:
- `ContentController` (`src/presentation/rest/content/content.controller.ts`)
- `LearningController` (`src/modules/learning/learning.controller.ts`)
- `NotebookController` (`src/modules/notebook/notebook.controller.ts`)
- `RoadmapController` (`src/modules/roadmap/roadmap.controller.ts`)
- `LanguagesController` (`src/modules/languages/languages.controller.ts`)

---

## 4. Resultados de Verificación y Compilación

- **Compilación `@koda/types`:**
  ```bash
  pnpm --filter @koda/types run build
  # Salida: $ tsc (0 errores, dist/index.d.ts generado exitosamente)
  ```
- **Compilación `@koda/api`:**
  ```bash
  pnpm --filter api run build
  # Salida: prisma generate && nest build (0 errores, dist/ generado exitosamente)
  ```
- **Suite de Pruebas Unitarias:**
  ```bash
  pnpm --filter api run test
  # Salida: Test Suites: 15 passed, 15 total | Tests: 53 passed, 53 total (100% aprobadas)
  ```

---

## 5. Conclusión y Cierre de Sprint
La historia de usuario **DOCS-02** queda formalmente validada y completada, cerrando los compromisos arquitecturales y documentales del **Sprint 1**.
