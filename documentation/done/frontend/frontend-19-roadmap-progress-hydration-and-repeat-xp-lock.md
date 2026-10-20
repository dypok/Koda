# Entregable Frontend 19: Hidratacion de Progreso del Roadmap y Bloqueo de XP en Repeticion

## 1. Resumen Ejecutivo
Se implemento la sincronizacion bidireccional completa del progreso del roadmap entre la base de datos PostgreSQL (`user_section_stars`) y la interfaz frontend, resolviendo la perdida de estado al recargar la pagina o reiniciar el servidor. Asimismo, se aplico un bloqueo estricto de experiencia (XP) para secciones y modulos ya completados, impidiendo que el usuario vuelva a sumar XP al repasar contenido ya dominado, y desplegando indicadores visuales explicitos (`+0 XP (Repaso)` y `+0 XP (Modulo ya dominado)`).

## 2. Problemas Diagnosticados
1. **Perdida de progreso en el roadmap al recargar**:
   - `GET /roadmap/courses/:courseId/lessons` se ejecutaba sin autenticacion y retornaba grafos estaticos de inicializacion donde solo el nodo 1 estaba activo y los demas bloqueados.
   - El caso de uso `GetRoadmapGraphUseCase` no inyectaba `IProgressRepository` ni consultaba las estrellas persistidas en PostgreSQL (`user_section_stars`).
   - `RoadmapService.getCourseLessonsGraph` y `getCoursesGraph` no enviaban cabeceras de autorizacion Bearer con el token JWT.
2. **Suma indebida de XP al repetir modulos completados**:
   - En `SectionStarsEntity.recordAttempt`, cuando `!isNewlyPassed`, se mantenia una rama que otorgaba `targetXp` aun en reintentos de secciones previamente aprobadas.
   - En `LearningService.evaluateAnswer`, las preguntas de micro-lecciones otorgaban XP sin verificar si la seccion ya habia sido aprobada con anterioridad.
   - En `LessonWorkspace.tsx`, no se detectaba el estado de modulo completado, calculando recompensas como si se tratara de un intento nuevo.

## 3. Solucion Implementada

### A. Hidratacion y Enriquecimiento del Grafo de Roadmap
- **`apps/api/src/modules/roadmap/roadmap.controller.ts`**:
  - Se configuro el guard `OptionalSupabaseAuthGuard` para inyectar `authUser?: SupabaseAuthUser` de forma no bloqueante tanto en `getCoursesGraph` como en `getLessonsGraph`.
- **`apps/api/src/application/use-cases/curriculum/get-roadmap-graph.use-case.ts`**:
  - Se inyecto `PROGRESS_REPOSITORY_TOKEN` para acceder a `findAllSectionStarsByUser(userId)`.
  - Se creo el metodo `enrichLessonsWithProgress(dataset, userStars)` que mapea estrellas obtenidas por nodo, marca nodos aprobados con `variant: 'completed'`, `stars: N`, `statusText: 'COMPLETADO'`, ilumina conexiones salientes (`isDashed: false`), desbloquea el siguiente nodo activo (`variant: 'active'`) y recalcula el `progressPercent` real.
  - Se enriquecio `getCoursesGraph` para reflejar el progreso acumulado de estrellas en la ruta de Python.

### B. Bloqueo Estricto de XP en Repeticiones (Backend)
- **`apps/api/src/domain/entities/section-stars.entity.ts`**:
  - En `recordAttempt`, se elimino la acreditacion de `targetXp` en la rama `else` (`!isNewlyPassed`). Al reintentar o practicar una seccion ya aprobada, `xpAwarded = 0`.
- **`apps/api/src/modules/learning/learning.service.ts`**:
  - En `evaluateAnswer`, se consulta `findSectionStars(userId, lesson.sectionSlug)`. Si `star.isPassed` es verdadero, `xpEarned = 0`.

### C. Bloqueo de XP e Indicadores Visuales Claros (Frontend)
- **`apps/web/src/services/roadmap/roadmap.service.ts`**:
  - Se implemento la funcion auxiliar `getAuthHeaders()` y `fetchWithFallback()` para enviar `Authorization: Bearer ${token}` y soportar proxies Next.js relativos y conexiones directas.
- **`apps/web/src/stores/roadmap.store.ts`**:
  - Se actualizo `hydrateProgress()` para invocar asincronamente `RoadmapService.getCoursesGraph` y `RoadmapService.getCourseLessonsGraph`, persistiendo el estado en el store Zustand.
- **`apps/web/src/views/lesson/useLessonEngine.ts`**:
  - Se aseguro que cuando `rewardXp <= 0`, la ganancia `gained` sea estrictamente 0 y el mensaje de retroalimentacion indique `¡Correcto! +0 XP (Repaso).`.
- **`apps/web/src/views/lesson/LessonWorkspace.tsx`**:
  - Se anadio la propiedad computada `isAlreadyCompleted` derivada de `currentNode.variant === 'completed' || currentNode.stars > 0`.
  - En modo repaso (`isAlreadyCompleted === true`), `nodeTargetXp = 0`, `questionXp = 0` y `completionReward = 0`.
  - La retroalimentacion de ejercicios muestra `¡Excelente! +0 XP (Repaso)`.
  - La pantalla de cierre de quiz muestra `Quiz: ok/total aciertos · +0 XP (Modulo ya dominado)`.
  - La persistencia y el store de autenticacion preservan el XP del usuario sin sumar puntos redundantes.

## 4. Pruebas y Verificacion
- **Pruebas Unitarias Backend**:
  - `apps/api/src/domain/entities/section-stars.entity.spec.ts`: 3/3 tests aprobados verificando bloqueo de XP en repeticion y preservacion historica de estrellas.
  - `apps/api/src/application/use-cases/curriculum/get-roadmap-graph.use-case.spec.ts`: 2/2 tests aprobados verificando enriquecimiento del grafo y activacion del siguiente nodo.
  - Suite completa de API: 26/26 suites aprobadas (87/87 tests).
- **Compilacion TypeScript**:
  - `pnpm --filter api exec tsc --noEmit`: 0 errores.
  - `pnpm --filter web exec tsc --noEmit`: 0 errores.
- **Compilacion de Produccion**:
  - `pnpm --filter web build`: Compilacion Next.js 16.4.0 exitosa sin fallos.
