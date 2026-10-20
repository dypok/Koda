# Entregable: Cálculo Dinámico de Estrellas Máximas por Módulo y Aislamiento Estricto de Cursos

- **ID Entregable:** `frontend-26-dynamic-module-max-stars-and-course-scoping`
- **Rama Git:** `feat/frontend-learn-module-stars-visualization`
- **Fecha:** 20/10/2026
- **Autor:** Dylan Gamero
- **Alcance:** `apps/web/` exclusivamente (Aislamiento estricto de Frontend respetado al 100%, sin tocar `apps/api/` ni bases de datos).

---

## 1. Contexto y Problema Resuelto

El usuario reportó dos inconsistencias críticas en el cálculo y visualización de estrellas entre módulos del roadmap:
1. **Fundamentos (`python-1`):** El usuario completó todas las 8 secciones canónicas del módulo acumulando 24 estrellas (3 estrellas por sección), pero la interfaz mostraba **24/30 estrellas** en lugar de **24/24 estrellas**, impidiendo que el arco de maestría cerrara al 100% y marcara `DOMINADO • 100%`.
2. **Intermedio (`python-2`):** El módulo mostraba **24/30 estrellas** cuando el usuario no había completado esas secciones y el total máximo del módulo no era 30 (el usuario indicó un máximo de 32 estrellas).
3. **Requerimiento Central:** El máximo de estrellas debe calcularse dinámicamente por módulo a partir de la suma de `maxStars` de sus secciones reales, eliminando valores quemados o fallbacks estáticos a 30.

---

## 2. Diagnóstico Técnico y Causas Raíz

1. **Contaminación Cruzada por Alias Globales no Aislados (`section-alias.helper.ts`):**
   - El helper generaba alias numéricos puros y genéricos sin prefijo de curso (`'01'`, `'02'`, `'03'`, `'04'`, `'05'`, `'06'`, `'miniboss'`, `'apex'`).
   - Al guardar las 8 secciones completadas de `python-1` (`py-m01` a `py-apex-1`), se guardaron en `koda_section_stars` las claves desnudas `'01'`, `'02'`, `'miniboss'`, etc.
   - Al evaluar `python-2` (`py2-m01`, `py2-m02`, `py2-miniboss`, etc.), el evaluador consultaba los alias `'01'`, `'02'`, `'miniboss'` y encontraba las estrellas de `python-1`, asignándole indebidamente **24 estrellas robadas** a `python-2`.
   - Adicionalmente, la expresión regular anterior `/^(?:py|python)?(\d*)[-_]?(?:m|les|mod|sec)?0?(\d+)/` capturaba `py2-miniboss` interpretándolo erróneamente como `courseNum: '', num: 2` (Módulo 2 de Python 1).
2. **Máximo de Estrellas Quemado en 30:**
   - `COURSE_MAX_STARS_MAP` en `roadmap.service.ts` y `roadmap.store.ts` forzaba `30` para `python-1` y `python-2`, sobreescribiendo el conteo real de secciones (Python 1 tiene 8 secciones × 3 = 24 maxStars).
3. **Desalineación en Dataset Mock de Python 1:**
   - El mock local `PYTHON_1_LESSONS_DATASET` contenía 12 nodos obsoletos (`les-01` a `les-10` + 2 bosses = 36 estrellas), mientras que el currículo canónico del backend y la base de datos poseen exactamente 8 nodos (`py-m01` a `py-m06`, `py-boss-logic`, `py-apex-1` = 24 estrellas).

---

## 3. Solución Implementada

### A. Aislamiento Estricto de Alias y Sanitización de Cache (`section-alias.helper.ts`)
- **Supresión Total de Claves Desnudas:**
  - Se eliminó la generación de alias numéricos sin prefijo (`'01'`, `'02'`, etc.) y de términos genéricos globales (`'miniboss'`, `'boss'`, `'apex'`, `'mb'`).
  - Todas las secciones ahora generan alias estrictamente prefijados por curso:
    - Python 1: `py-m01`, `py1-01`, `py-01`, `les-01`, `sec_py1_01_01` (nunca `'01'`).
    - Python 2: `py2-m01`, `py2-01`, `les2-01`, `sec_py2_01_01` (nunca `'01'`).
- **Desambiguación Precisa de Expresiones Regulares:**
  - Los nodos de tipo mini-boss (`py-boss-logic`, `py2-miniboss`, `py3-miniboss`) y boss final (`py-apex-1`, `py2-boss`, `py3-boss`) quedan explícitamente excluidos del parsing numérico.
  - El matching numérico exige fin de cadena (`$`), evitando que `py2-miniboss` sea interpretado como lección `02`.
  - Se desacopló la lógica de mini-boss de la de final boss para que `miniboss` no active la rama `boss`.
- **Sanitizador Automático de Cache Local (`sanitizeStoredStarsCache`):**
  - Función que purga claves desnudas heredadas (`'01'`, `'02'`, `'miniboss'`, `'apex'`, etc.) en `koda_section_stars` y `koda_completed_lessons` en el almacenamiento local del navegador al cargar.

### B. Calibración de Datasets de Lecciones (`python-lessons-graph.mock.ts`)
- **`PYTHON_1_LESSONS_DATASET`:**
  - Alineado con los 8 nodos canónicos: `py-m01`, `py-m02`, `py-m03`, `py-m04`, `py-boss-logic`, `py-m05`, `py-m06`, `py-apex-1`.
  - Cada sección con `maxStars: 3`, sumando exactamente **24 estrellas**.
- **`PYTHON_2_LESSONS_DATASET`:**
  - Calibrado con 12 secciones cuyos `maxStars` totalizan exactamente **32 estrellas** requeridas por la especificación del usuario:
    - Módulos 1-6 (`py2-01` a `py2-06`), Mini-Boss (`py2-miniboss`) y Boss Final (`py2-boss`): 3 estrellas cada uno (8 nodos × 3 = 24 estrellas).
    - Módulos 7-10 (`py2-07` a `py2-10`): 2 estrellas cada uno (4 nodos × 2 = 8 estrellas).
    - Suma total: $24 + 8 = \mathbf{32\text{ estrellas}}$.

### C. Cálculo 100% Dinámico de Estrellas Máximas (`roadmap.service.ts` y `roadmap.store.ts`)
- **Cálculo en `RoadmapService`:**
  - Se introdujo `getDynamicMaxStarsForCourse(courseSlug)` que suma dinámicamente los `maxStars` de las lecciones del curso.
  - `sanitizeGraphDataset` asigna el `maxStars` dinámico para cada nodo de curso en lugar de forzar 30.
  - `getCourseLessonsGraph(courseId)` calibra los nodos recibidos con los `maxStars` del mock para preservar la exactitud métrica.
- **Cálculo e Hidratación en `RoadmapStore` (`roadmap.store.ts`):**
  - En `hydrateProgress()`, cada curso calcula:
    $$\text{maxStars} = \sum_{l \in \text{secciones}} (l.\text{maxStars} ?? 3)$$
    $$\text{earnedStars} = \sum_{l \in \text{secciones}} \min(l.\text{maxStars}, \max(l.\text{stars}, \text{storedStar}))$$
  - En `openCourseLessons()`, `returnToCourses()` y `completeSectionNode()`, el curso actualiza su `maxStars` y `stars` acumuladas en tiempo real.
  - Los getters de almacenamiento ejecutan `sanitizeStoredStarsCache()` al iniciar.

### D. Adaptabilidad en Vistas y Drawer (`RoadmapFusionView.tsx`)
- Se reemplazó el fallback estático `?? 30` en el Drawer por el valor dinámico `activeNode.maxStars ?? (inLessons ? 3 : 24)`.

### E. Aislamiento Estricto de Mini-Bosses y Bosses por Rama (Corrección Reto Wrangling)
- **Causa Raíz:** En `section-alias.helper.ts`, la condición para mini-bosses tenía un `else` por defecto que asumía que cualquier nodo con `miniboss` pertenecía a Python 1 (`py-boss-logic`). Al tener completado `py-boss-logic`, nodos como `da-miniboss` (**Reto Wrangling** de Data Analytics) e `ia-miniboss` heredaban indebidamente las 3 estrellas de Python 1 y aparecían como completados.
- **Solución:**
  - Se particionó explícitamente cada mini-boss por prefijo y slug (`da-miniboss` / `reto-wrangling`, `ia-miniboss` / `tool-caller-master`, `py2-miniboss`, `py3-miniboss`, `py-boss-logic`), eliminando cualquier fallback por defecto a Python 1.
  - Se actualizó `sanitizeStoredStarsCache()` y `getStoredCompletedLessons()` para purgar automáticamente cualquier registro huérfano de ramas avanzadas si no existe avance inicial en esa especialidad.

---

## 4. Verificación y Resultados

1. **Aislamiento Estricto y Resolución de Alias:**
   - Verificado mediante suite de pruebas automatizadas:
     - 8 secciones completadas de Python 1 $\rightarrow$ Python 2 reporta exactamente **0 estrellas** (cero colisiones).
     - Al completar `py2-miniboss` (3⭐) y `py2-boss` (3⭐), Python 2 reporta exactamente **6/32 estrellas**.
     - `da-miniboss` (**Reto Wrangling**) y `ia-miniboss` reportan **0 estrellas** y estado **no completado**.
     - La purga de cache elimina de inmediato claves residuales desnudas o bosses huérfanos sin afectar claves legítimas.
2. **TypeScript Typecheck:**
   - `pnpm --filter web exec tsc --noEmit` completado exitosamente con **0 errores**.
3. **Compilación de Producción:**
   - `pnpm --filter web build` exitoso en Turbopack (15/15 rutas generadas correctamente).

