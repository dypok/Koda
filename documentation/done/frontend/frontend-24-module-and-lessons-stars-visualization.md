# Entregable: Visualización y Sincronización de Estrellas en Módulos y Lecciones

- **ID Entregable:** `frontend-24-module-and-lessons-stars-visualization`
- **Rama Git:** `feat/frontend-learn-module-stars-visualization`
- **Fecha:** 19/10/2026
- **Autor:** Dylan Gamero
- **Alcance:** `apps/web/` únicamente (Aislamiento estricto de Frontend respetado al 100%, sin tocar `apps/api/` ni bases de datos).

---

## 1. Contexto y Problema Detectado

Aunque las propiedades `stars` y `maxStars` estaban definidas en varios modelos y tipos del frontend, en pantalla no se estaban reflejando las estrellas en los módulos del roadmap:
1. **Ausencia de Badge en PixiJS:** El renderizador gráfico activo de la plataforma (`RoadmapPixiGraph.tsx`) únicamente dibujaba el código (`01 · ACTV`) y el título del curso, sin incluir ningún indicador tipográfico o glifo de estrellas.
2. **Arco de Maestría Inactivo:** El arco circular exterior (`frac = stars / maxStars`) evaluaba `0 / 30 = 0`, permaneciendo invisible y con longitud angular cero.
3. **Falta de Acumulación en Zustand Store:** Al completar lecciones en `LessonWorkspace.tsx`, la función `completeSectionNode` actualizaba las estrellas de la lección individual en `lessonsDataset`, pero nunca sumaba ni transfería las estrellas al curso padre en `coursesDataset`.
4. **Fallback Arbitrario en Drawer:** En `RoadmapFusionView.tsx`, si el nodo no traía `maxStars` explícito desde la API, recurría a un fallback arbitrario `?? 9` en lugar del valor canónico del curso (ej. 30 estrellas para 10 lecciones).

---

## 2. Solución Implementada

### A. Renderizado Tipográfico y Cinemático en PixiJS (`RoadmapPixiGraph.tsx`)
- Se implementó el badge tipográfico de estrellas debajo de la etiqueta de cada nodo (`bottomOffset + 15`):
  - **Módulos / Cursos (`maxStars > 3`):** Renderiza `★ {earned}/{maxStars}` (ej. `★ 0/30`, `★ 15/30`, `★ 30/30`) en color ámbar `#fbbf24` si tiene estrellas ganadas, o slate `#64748b` si está en cero.
  - **Lecciones / Secciones (`maxStars <= 3`):** Renderiza la trilogía de estrellas `★ ★ ★` (estrellas rellenas doradas para las ganadas y vacías para las pendientes).
- Se expandió el área de interacción táctil (`hitArea`) a un radio de 48px para facilitar la selección directa del nodo incluyendo su etiqueta y badge.
- Al contar con estrellas reales acumuladas (`stars > 0`), el arco circular de maestría se dibuja proporcionalmente (`frac * Math.PI * 2`) en los estilos `hex`, `donut` y `medallion`.

### B. Calibración Canónica de Cursos (`roadmap.service.ts`)
- Se incorporó `COURSE_MAX_STARS_MAP` con los valores oficiales de cada curso:
  - Cursos de 10 secciones (`python-1`, `python-2`, `python-3`, `data-analytics`, `ai-agents`): `30 maxStars`.
  - Cursos de 5 secciones (`fastapi-async`, `django-enterprise`): `15 maxStars`.
  - Examen integrador (`python-apex`): `3 maxStars`.
- En `RoadmapService.getCoursesGraph`, se asegura que cada nodo recibido preserve su `maxStars` calibrado.

### C. Acumulación y Persistencia Reactiva (`roadmap.store.ts`)
- **Persistencia en LocalStorage:**
  - `saveSectionStar(nodeId, stars)` almacena atómicamente el mapa de estrellas por lección en `koda_section_stars`.
  - `persistProgress` guarda el mapa de estrellas de los nodos para restaurarlo instantáneamente al recargar la página.
- **Acumulación Atómica:**
  - Al invocar `completeSectionNode(sectionRef, stars)`, se calcula en tiempo real `totalEarnedInCourse = nodes.reduce((sum, n) => sum + (n.stars ?? 0), 0)` y se actualiza el curso correspondiente en `coursesDataset`.
- **Hidratación Bidireccional:**
  - En `hydrateProgress`, cada curso en `coursesDataset` inspecciona sus lecciones y calcula la suma exacta de estrellas ganadas (`earnedStars`), asignándolo a `course.stars`.
  - En `returnToCourses`, al volver del mapa de lecciones al mapa de cursos, el curso seleccionado actualiza inmediatamente su contador de estrellas y arco visual.

### D. Drawer de Detalle (`RoadmapFusionView.tsx`)
- Se calibró el contador del drawer para utilizar `activeNode.maxStars ?? (inLessons ? 3 : 30)`, eliminando el valor arbitrario de 9 y mostrando la proporción correcta en cursos y lecciones.

---

## 3. Verificación y Resultados

1. **Chequeo de Tipos TypeScript (`apps/web`):**
   - Comando: `pnpm --filter web exec tsc --noEmit`
   - Resultado: 0 errores encontrados.
2. **Build de Producción de Next.js Turbopack (`apps/web`):**
   - Comando: `pnpm --filter web build`
   - Resultado: Compilación exitosa en 8.4s, 15 rutas generadas sin advertencias.
3. **Experiencia de Usuario:**
   - En la vista general de la ruta, cada módulo de Python muestra claramente su avance en estrellas (ej. `★ 0/30`).
   - Al completar actividades en una lección, las estrellas se suman al curso y encienden el arco circular exterior dorado en tiempo real.
