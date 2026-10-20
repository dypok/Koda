# Entregable Frontend 21: Eliminación Definitiva del Fallback Fantasma "Fundamentos de la Programación Python 3.12"

## 1. Resumen Ejecutivo
Se erradicó de forma definitiva e integral el módulo/curso fantasma `python-core` ("Fundamentos de Programación con Python 3.12") que se renderizaba duplicado detrás del nodo canónico `python-1` ("Python 1: Fundamentos") en las coordenadas `(140, 290)` del lienzo interactivo de PixiJS. La solución abarca:
1. Sanitización estricta en el servicio web (`RoadmapService.sanitizeGraphDataset`).
2. Purga y desinfección reactiva del almacenamiento local y estado de Zustand (`useRoadmapStore`).
3. Normalización del grafo curricular en backend (`GetRoadmapGraphUseCase.getCoursesGraph`).
4. Actualización de las semillas de inicialización (`python-curriculum.data.ts`, `initial-curriculum.seed.ts`, `modules.json`).
5. Limpieza física de registros obsoletos en la base de datos MongoDB `koda.courses`.

## 2. Diagnóstico del Problema Raíz
1. **Doble nodo en las mismas coordenadas DAG**:
   - En MongoDB y en las semillas estáticas persistía el curso `python-core` con título `"Fundamentos de Programación con Python 3.12"` y topología `{ tier: 0, lane: 0 }`.
   - El curso canónico `python-1` ("Python 1: Fundamentos") posee la misma posición `{ tier: 0, lane: 0 }` (`x: 140, y: 290`).
   - El endpoint `GET /api/v1/roadmap/python/courses` retornaba ambos cursos con `track_slug: "python"`, provocando que PixiJS dibujara ambos nodos superpuestos, visualizándose el texto del fallback detrás del módulo real.
2. **Persistencia en LocalStorage**:
   - `restoreProgress` en el store de frontend restauraba IDs de cursos desbloqueados almacenados previamente en `koda_roadmap_progress` que incluían `python-core`.
3. **Semillas desalineadas**:
   - Las semillas de fallback `PYTHON_COURSES` y `INITIAL_PYTHON_COURSE` todavía definían el slug obsoleto `python-core` en lugar del canónico `python-1`, lo que reinyectaba el registro fantasma al ejecutar seeders.

## 3. Solución Implementada

### A. Sanitización y Purga en Frontend (`apps/web`)
- **`RoadmapService.sanitizeGraphDataset` (`apps/web/src/services/roadmap/roadmap.service.ts`)**:
  - Filtro terminante para descartar nodos con `id === 'python-core'`, `targetCourseId === 'python-core'` o etiquetas que incluyan `"Python 3.12"` / `"Fundamentos de Programación con Python 3.12"`.
  - Poda automática de conexiones huérfanas hacia o desde nodos descartados.
- **`useRoadmapStore` (`apps/web/src/stores/roadmap.store.ts`)**:
  - En `restoreProgress`: Limpieza proactiva de `python-core` en `koda_roadmap_progress` de `localStorage` y en la lista de nodos restaurados.
  - En `hydrateProgress`: Filtrado estricto de nodos recibidos y reasignación de `activeNodeId` y `selectedCourseId` si apuntaban al slug obsoleto.

### B. Normalización en Backend y Semillas (`apps/api` y `content`)
- **`GetRoadmapGraphUseCase` (`apps/api/src/application/use-cases/curriculum/get-roadmap-graph.use-case.ts`)**:
  - Filtrado explícito en `getCoursesGraph` para excluir cualquier curso con `slug === 'python-core'` o nombre que contenga `"Python 3.12"`.
- **`python-curriculum.data.ts` & `initial-curriculum.seed.ts`**:
  - Reemplazo de `python-core` por `python-1` con el nombre `"Python 1: Fundamentos"`.
  - Actualización de los 12 módulos canónicos para asociarse a `course_slug: 'python-1'`.
- **`content/courses/python-core/modules.json`**:
  - Actualización de los 12 módulos canónicos con `"course_slug": "python-1"`.
- **Limpieza de Base de Datos MongoDB**:
  - Eliminación del documento `python-core` en la colección `courses`.
  - Migración de `course_slug` a `python-1` en la colección `modules`.

## 4. Pruebas y Verificación
- **Pruebas Unitarias de Backend (`jest get-roadmap-graph.use-case.spec.ts`)**:
  - 7 pruebas ejecutadas exitosamente, incluyendo test que valida la exclusión de `python-core` y títulos legados.
- **Pruebas de Servicio de Aprendizaje (`jest learning.service.spec.ts`)**:
  - 5 pruebas pasadas al 100%.
- **Validación de Tipos TypeScript**:
  - `pnpm --filter api exec tsc --noEmit` completado con 0 errores.
  - `pnpm --filter web exec tsc --noEmit` completado con 0 errores.
- **Compilación de Producción Web**:
  - `pnpm --filter web build` exitoso en 1833ms (15/15 páginas estáticas y dinámicas).
- **Prueba en Vivo del Endpoint REST**:
  - `GET /api/v1/roadmap/python/courses` verificado: `python-core` erradicado, `python-1` lidera el grafo con conexiones válidas hacia `python-2`.
