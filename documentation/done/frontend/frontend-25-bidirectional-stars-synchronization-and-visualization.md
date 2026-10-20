# Entregable: Sincronización Bidireccional y Visualización Completa de Estrellas en Módulos y Lecciones

- **ID Entregable:** `frontend-25-bidirectional-stars-synchronization-and-visualization`
- **Rama Git:** `feat/frontend-learn-module-stars-visualization`
- **Fecha:** 20/10/2026
- **Autor:** Dylan Gamero
- **Alcance:** `apps/web/` únicamente (Aislamiento estricto de Frontend respetado al 100%, sin tocar `apps/api/` ni bases de datos).

---

## 1. Contexto y Causa Raíz

El usuario reportó que existían lecciones completadas que no mostraban sus estrellas ganadas y que esto impedía que el módulo padre reflejara el acumulado correcto de estrellas en el roadmap. Tras la investigación, se encontraron cuatro causas raíz interconectadas:
1. **Discrepancia de Nomenclatura (Aliasing):**
   - En PostgreSQL y la API NestJS, las secciones de Python 1 se almacenan como `py-m01`, `py-m02`, `py-m03`, `py-m04`, `py-boss-logic`, `py-m05`, `py-m06` y `py-apex-1`.
   - En los mocks y datasets de lecciones, los identificadores son `les-01`, `les-02`, ..., `les-miniboss`, ..., `les-boss`.
   - Al almacenar o consultar estrellas sin un resolutor de alias, `storedStars['les-01']` evaluaba como `undefined` (0 estrellas), impidiendo la agregación.
2. **Propiedades `maxStars` no definidas en nodos de lecciones desde el backend:**
   - Nodos como `py-boss-logic`, `py-m05`, `py-m06` y `py-apex-1` carecían de `maxStars: 3` en la respuesta JSON.
   - En `RoadmapPixiGraph.tsx`, la condición `if (typeof n.maxStars === 'number' && n.maxStars > 0)` descartaba renderizar el badge de estrellas para estos nodos.
3. **Filtro restrictivo en el Drawer:**
   - En `RoadmapFusionView.tsx`, la condición `{!isBoss && ...}` ocultaba deliberadamente las estrellas de lecciones o cursos de tipo `boss` (como `py-apex-1`).
4. **Sobreescritura de persistencia local:**
   - Al recargar la página, `hydrateProgress()` recalculaba el acumulado evaluando los identificadores no normalizados del mock, asignando 0 estrellas al curso y persistiendo 0 en `koda_roadmap_progress`.

---

## 2. Solución Implementada

### A. Módulo Canónico de Alias y Normalización (`section-alias.helper.ts`)
- Se creó `apps/web/src/models/roadmap/section-alias.helper.ts`:
  - `getSectionAliases(id: string): string[]`: Genera y resuelve todas las variantes conocidas para cualquier sección (`py-m01` $\leftrightarrow$ `les-01` $\leftrightarrow$ `01` $\leftrightarrow$ `fundamentos-de-python`, `py-boss-logic` $\leftrightarrow$ `les-miniboss` $\leftrightarrow$ `mb`, `py-apex-1` $\leftrightarrow$ `les-boss`, Python 2, Python 3, FastAPI, Django, Data Analytics e IA).
  - `getStoredStarForSection(sectionId, storedMap)`: Extrae la mejor puntuación de estrellas entre todos los alias disponibles.
  - `isSectionCompletedInSet(sectionId, completedSet)`: Valida la completitud de una sección contrastando todos sus alias con el Set de lecciones completadas.

### B. Sanitización Defensiva en `RoadmapService` (`roadmap.service.ts`)
- Se actualizó `sanitizeGraphDataset`:
  - Garantiza que cada nodo de lección contenga `maxStars: typeof n.maxStars === 'number' && n.maxStars > 0 ? n.maxStars : 3`.
  - Asegura que `stars: typeof n.stars === 'number' ? n.stars : 0`.
  - Para nodos de curso, asegura `maxStars: COURSE_MAX_STARS_MAP[courseKey] ?? 30`.

### C. Almacenamiento y Agregación Reactiva en Zustand (`roadmap.store.ts`)
- `saveSectionStar(nodeId, stars)`: Persiste las estrellas para `nodeId` y **todos sus alias** en `koda_section_stars`.
- `markCompletedLesson(nodeId)`: Registra la sección y todos sus alias en `koda_completed_lessons`.
- `openCourseLessons(courseId)`:
  - Hidrata cada lección utilizando `getStoredStarForSection` e `isSectionCompletedInSet`.
  - Garantiza `maxStars: l.maxStars ?? 3` y estado `COMPLETADO` si tiene estrellas.
  - Sincroniza en cache local cualquier estrella proveniente de la API.
  - Actualiza en tiempo real el nodo del curso en `coursesDataset` con la suma de estrellas de sus lecciones.
- `hydrateProgress()`:
  - Al recibir `lessonsData`, guarda las estrellas y completitud con todos sus alias.
  - Calcula `earnedStars` para cada curso evaluando las secciones con resolución de alias.
  - Asigna `c.stars = Math.max(c.stars ?? 0, earnedStars)` y `statusText: 'DOMINADO • 100%'` si se alcanzan las estrellas máximas.
- `completeSectionNode(nodeId, stars)`:
  - Localiza el nodo por ID exacto, por alias o por normalización de formato.
  - Actualiza el nodo a `completed` con `stars: Math.max(n.stars ?? 0, stars)` y `maxStars: 3`.
  - Recalcula el total acumulado en el curso y actualiza el curso padre y sus conexiones.

### D. Renderizado en WebGL PixiJS (`RoadmapPixiGraph.tsx`)
- Se configuró `nodeMaxStars = typeof n.maxStars === 'number' && n.maxStars > 0 ? n.maxStars : 3`.
- Se permite el renderizado del badge y arco de maestría para cualquier nodo desbloqueado.
- Si `nodeMaxStars <= 3`: Renderiza `★ ★ ★` (rellenas para ganadas, vacías para pendientes).
- Si `nodeMaxStars > 3`: Renderiza `★ {earned}/{nodeMaxStars}`.

### E. Drawer Lateral de Detalle (`RoadmapFusionView.tsx`)
- Se eliminó la restricción `!isBoss`, permitiendo que todos los nodos activos (lecciones, mini-boss y examen Apex) muestren sus estrellas ganadas y máximas con el glifo de estrella dorada.

### F. Espacio de Trabajo de Lección (`LessonWorkspace.tsx`)
- Se integró `getSectionAliases` para que `setCompletedLessons` registre tanto `lessonId` como `sectionRef` y todos sus alias en `koda_completed_lessons` y `localStorage`.

---

## 3. Verificación y Resultados

1. **Chequeo de Tipos TypeScript (`apps/web`):**
   - Comando: `pnpm --filter web exec tsc --noEmit`
   - Resultado: 0 errores encontrados.
2. **Build de Producción de Next.js Turbopack (`apps/web`):**
   - Comando: `pnpm --filter web build`
   - Resultado: Compilación exitosa de 15 rutas (15/15) en Turbopack sin errores.
3. **Comportamiento en UI:**
   - El curso `Python 1: Fundamentos` muestra en el canvas el badge `★ 24/30` y su arco de maestría iluminado al 80%.
   - Cada una de las 8 lecciones completadas (`py-m01`, `py-m02`, `py-m03`, `py-m04`, `py-boss-logic`, `py-m05`, `py-m06`, `py-apex-1`) muestra sus 3 estrellas doradas `★ ★ ★` en el nodo de PixiJS y `3/3` en el drawer de detalle.
