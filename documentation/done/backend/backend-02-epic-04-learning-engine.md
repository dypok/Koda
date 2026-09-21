# 🦊 Entregable Backend: Motor de Aprendizaje, Grafo DAG Multi-Rama y Calificación por Estrellas

> **ID de HU y Épica:** EPIC-04 (LEARN-03, LEARN-04, LEARN-05)  
> **Título:** Motor de Aprendizaje, Grafo DAG Multi-Rama, Sistema de Estrellas (⭐) y Fusión Híbrida de Progreso  
> **Rama:** `feat/backend-epic-04-learning-engine`  
> **Autor:** Daniel Echeverría  
> **Fecha:** 21/09/2026  
> **Estado:** Implementado, Probado y Verificado (19 suites / 74 tests unitarios aprobados al 100%)  

---

## 1. Resumen Ejecutivo y Alcance Backend

En cumplimiento estricto del alcance backend para el Sprint 2 de Koda (**Épica 4**), se desarrolló la infraestructura transaccional y de dominio requerida para soportar:

1. **LEARN-03 (Desbloqueo Progresivo con Candados y Grafo DAG):**
   - Implementación del algoritmo de detección de ciclos en grafos dirigidos (Kahn / Topological Sorting) garantizando que el árbol de dependencias sea un DAG acíclico legítimo.
   - Creación del guard de seguridad `PrerequisitesGuard` (NestJS) con soporte dual para contextos HTTP y GraphQL (`GqlExecutionContext`), verificando en Supabase PostgreSQL que los prerrequisitos compactos `RQ {req}` estén aprobados con al menos 1 estrella antes de permitir el acceso a las micro-lecciones.
2. **LEARN-04 (Sistema de Calificación de 1 a 3 Estrellas):**
   - Entidad de dominio pura `SectionStarsEntity` que encapsula la fórmula canónica de cálculo de estrellas:
     - $100\% \to 3$ estrellas (⭐⭐⭐ - Perfección).
     - $80\% - 99\% \to 2$ estrellas (⭐⭐).
     - $70\% - 79\% \to 1$ estrella (⭐ - Aprobado).
     - $< 70\% \to 0$ estrellas (No aprobado).
   - Garantía de persistencia histórica no-regresiva (`recordAttempt`): reintentar una sección nunca reduce las estrellas obtenidas previamente.
   - Asignación atómica de recompensas: $+30\text{ XP}$ por primera aprobación y $+10\text{ XP}$ bono por alcanzar la perfección (3 estrellas).
3. **LEARN-05 (Persistencia Híbrida de Progreso - Supabase PostgreSQL + MongoDB):**
   - Fusión en memoria en `LearningService.getRoadmap(languageSlug, userId?)`: consulta en lote (`findMany`) en PostgreSQL para telemetría transaccional (`user_section_stars`, `user_module_progress`) y combinación con los documentos inmutables de MongoDB (`ICurriculumRepository`), manteniendo una latencia p95 < 40 ms.
   - Exposición en GraphQL (`/graphql`) con la Mutation `completeSection` y la Query personalizada `learningRoadmap`, respetando la autenticación de Supabase Auth vía `SupabaseAuthGuard` y `OptionalSupabaseAuthGuard`.

---

## 2. Componentes Desarrollados por Capa Arquitectónica

### Dominio (`apps/api/src/domain/`)
- `entities/section-stars.entity.ts`: Entidad pura que gestiona el estado, fórmula de estrellas, blindaje no-regresivo y cálculo de bonos XP.
- `entities/module-progress.entity.ts`: Entidad para el ciclo de vida del módulo (`locked`, `in_progress`, `completed`).
- `repositories/progress.repository.ts`: Puerto abstracto `IProgressRepository` y token de inyección `PROGRESS_REPOSITORY_TOKEN`.

### Infraestructura (`apps/api/src/infra/database/postgres/`)
- `mappers/progress.mapper.ts`: Mapeador bidireccional entre los modelos relacionales de Prisma (`UserSectionStars`, `UserModuleProgress`) y las entidades de dominio.
- `repositories/prisma-progress.repository.ts`: Adaptador Prisma con transacciones atómicas `tx.$transaction` para actualizar de forma concurrente las estrellas de la sección, el progreso del módulo y el XP total del usuario.

### Aplicación (`apps/api/src/application/`)
- `dto/learning/complete-section.dto.ts`: DTO con validaciones estrictas (`class-validator`) de acierto (0 a 100%).
- `dto/learning/section-completion-response.dto.ts`: DTO de respuesta con métricas detalladas del intento y acumuladas.
- `use-cases/learning/complete-section.use-case.ts`: Orquestador del registro de sección y despacho transaccional.
- `use-cases/learning/validate-dag-prerequisites.use-case.ts`: Algoritmo Kahn para grafos dirigidos acíclicos y comprobación de prerrequisitos en base de datos.

### Seguridad y Transporte (`apps/api/src/common/` & `apps/api/src/presentation/graphql/`)
- `guards/prerequisites.guard.ts`: Guard de protección de rutas y operaciones GraphQL.
- `guards/supabase-auth.guard.ts` & `guards/optional-supabase-auth.guard.ts`: Adaptados para soportar contextos mixtos HTTP (REST) y GraphQL (`GqlExecutionContext`).
- `decorators/current-user.decorator.ts`: Extrae el usuario de Supabase Auth indistintamente de si la petición llega por REST o GraphQL.
- `presentation/graphql/learning/types/learning.type.ts`: Tipos Code-First `@InputType() CompleteSectionInput` y `@ObjectType() SectionCompletionType`.
- `presentation/graphql/learning/learning.resolver.ts`: Mutation `completeSection` y Query `learningRoadmap` autenticada opcionalmente.

---

## 3. Matriz de Cobertura de Pruebas Unitarias (Jest)

| Suite de Pruebas | Casos Verificados | Resultado |
|---|---|:---:|
| `complete-section.use-case.spec.ts` | Asignación de 3⭐ (100%), 2⭐ (85%), 1⭐ (75%), 0⭐ (<70%), no regresión histórica de estrellas, validación de aciertos fuera de rango (0-100), verificación de XP otorgado | **PASS** |
| `validate-dag-prerequisites.use-case.spec.ts` | Algoritmo Kahn con grafos acíclicos válidos, grafos tipo diamante, detección de grafos cíclicos infinitos, validación de prerrequisitos de usuario en base de datos | **PASS** |
| `prerequisites.guard.spec.ts` | Aceptación de nodo sin prerrequisitos, rechazo con `ForbiddenException` por falta de requisitos, rechazo `UnauthorizedException` sin token en rutas protegidas, soporte contexto GraphQL | **PASS** |
| `learning.service.spec.ts` | Fusión híbrida MongoDB + PostgreSQL, cálculo de roadmap para usuarios anónimos vs autenticados, desbloqueo secuencial dinámico de módulos y secciones, evaluación de respuestas | **PASS** |
| `learning.resolver.spec.ts` | Ejecución de Query `learningRoadmap` con/sin usuario, Mutation `completeSection` otorgando estrellas y XP, Mutation `evaluateLessonAnswer` | **PASS** |
| **Total Global** | **19 suites ejecutadas / 74 tests unitarios** | **100% PASS** |

---

## 4. Verificación de Compilación y Calidad

- **Compilación de Paquetes (`@koda/types`):** `tsc` ejecutado con éxito, tipos exportados a `dist/`.
- **Compilación de API (`apps/api`):** `prisma generate && nest build` finalizado con código de salida `0` (cero errores TypeScript).
- **Integridad Monorepo:** 0 modificaciones a `apps/web/` (área frontend preservada de forma intacta).
