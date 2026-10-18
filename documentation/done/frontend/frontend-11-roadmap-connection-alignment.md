# 🦊 Entregable Frontend 11: Corrección de Alineación y Anclaje de Conexiones del Roadmap

> **ID de HU y Épica:** EPIC-04 / US-022 (Grafo interactivo de cursos y lecciones)  
> **Rama:** `feat/frontend-roadmap-connection-alignment`  
> **Fecha:** 18-10-2026  
> **Autor:** Dylan Gamero / Frontend Assistant  

---

## 1. Problema Identificado

Al visualizar el roadmap (tanto en la vista general de cursos como al abrir los módulos/lecciones de un curso como Python 1), las líneas conectoras se mostraban desalineadas ("desfasadas") y no conectaban a los medallones de los módulos:
1. **Desfase de +40px en paths provenientes de la API:** El backend calculaba las curvas SVG sumando `+40px` en $X$ y $Y$ a las coordenadas de origen y destino (`startX = fromX + 40`, `startY = fromY + 40`, `endX = toX + 40`, `endY = toY + 40`).
2. **Muestreo desacoplado en el motor PixiJS:** En `RoadmapPixiGraph.tsx`, los contenedores de los nodos se posicionan en `(node.x, node.y)` con su geometría centrada en `(0, 0)`. Sin embargo, `sampleCurve` y `drawConnections` leían los puntos absolutos del string SVG `c.path` sin anclarlos a las posiciones reales de los nodos. Como resultado, las líneas, filamentos gemelos (`twin`) y mangas de plasma cilíndrico (`cylindrical`) flotaban 40px hacia la derecha y hacia abajo del centro de cada hexágono.

---

## 2. Solución Implementada

En estricto cumplimiento del principio de aislamiento de `koda-frontend-workflow` (**sin tocar `apps/api/` ni bases de datos**), la solución se implementó de forma resiliente y matemática en el frontend:

### A. Anclaje Matemático Dinámico en `RoadmapPixiGraph.tsx`
- Se implementó la función pura `resolveCurve(path, a, b)`:
  - **Anclaje rígido:** Garantiza que el inicio de la curva coincida exactamente con `(a.x, a.y)` y el final con `(b.x, b.y)`.
  - **Preservación tangencial:** Si el path incluye puntos de control de una curva Bézier, calcula los vectores tangenciales relativos `(x1 - x0, y1 - y0)` y `(x2 - x3, y2 - y3)` y los ancla a los centros reales, preservando la curvatura estética del diseño.
  - **Fallback Bézier horizontal:** Si el path no existe o es inválido, autogenera una curva Bézier cúbica suave horizontal con puntos de control calculados en $\Delta x \cdot 0.5$.
- Se reforzó la expresión regular de `parsePath` para admitir números negativos y variaciones de espaciado.
- Se conectó `resolveCurve` en:
  - `sampleCurve`: muestrea los 60 puntos garantizando que inicien en `(a.x, a.y)` y finalicen en `(b.x, b.y)`.
  - `drawConnections`: tanto para rutas desbloqueadas (`lit` con glow ambiental y doble filamento) como rutas bloqueadas/en reposo (filamento titanio y llamadas directas a `bezierCurveTo`).
  - `buildEdgeOverlay`: garantiza que las mangas térmicas cilíndricas de plasma y los pulsos de partículas recorran la trayectoria alineada con precisión milimétrica.

### B. Normalización en `RoadmapService` (`roadmap.service.ts`)
- Se implementó `sanitizeGraphDataset(dataset)` para interceptar los datos devueltos por la API (`getCoursesGraph` y `getCourseLessonsGraph`).
- Si los endpoints entregan conexiones con desfases o formatos obsoletos, la sanitización genera el path SVG canónico anclado a las coordenadas de los nodos de forma transparente.

---

## 3. Pruebas y Verificación

1. **TypeScript Typecheck:**
   - `pnpm --filter web exec tsc --noEmit`: **Exitoso** (código 0).
2. **Next.js Production Build:**
   - `pnpm --filter web build`: **Exitoso** (código 0, compilación Turbopack limpia en 7.2s).
3. **Verificación Visual:**
   - En `/app/roadmap` y vistas con `view=lessons`, las líneas y conductos de energía coinciden con el centro geométrico de cada medallón/hexágono sin importar la procedencia de los datos.
