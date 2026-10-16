# 📄 Entregable Técnico: Frontend LEARN-07 — Corrección de Orden de Hooks (Rules of Hooks) en LessonWorkspace

> **ID:** `frontend-07-lesson-workspace-hooks-order`  
> **Épica:** `EPIC 04 — Motor de Aprendizaje, Lecciones y Evaluaciones` (`LEARN`)  
> **Historia de Usuario:** `LEARN-01` (Workspace Interactivo de Lecciones y Quizzes)  
> **Rama:** `feat/frontend-lesson-workspace-hooks`  
> **Autor:** Dylan Gamero (Lead Frontend & Arquitectura)  
> **Fecha:** 16 de Octubre de 2026  
> **Estado:** 🟢 Aprobado / 100% Completado

---

## 1. 🎯 Objetivos del Entregable

1. **Resolución de Violación de Rules of Hooks en React 19:**
   - Erradicar el error crítico en consola y tiempo de ejecución:
     ```
     React has detected a change in the order of Hooks called by LessonWorkspace.
     This will lead to bugs and errors if not fixed.
     Previous render: undefined | Next render: useCallback
     Rendered more hooks than during the previous render.
     at LessonWorkspace (src/views/lesson/LessonWorkspace.tsx:280:39)
     ```
2. **Reorganización Estricta de Hooks al Nivel Superior:**
   - Mover todas las llamadas a hooks (`useCallback`, `useMemo`, `useState`, `useEffect`, `useRef`) a la cabecera incondicional del componente `LessonWorkspace`, antes de cualquier sentencia de retorno temprano (`return`).
3. **Consistencia de Renders Condicionales:**
   - Garantizar que las vistas condicionales (`loading`, `!parsed || !module || !section`, `mode === 'quiz'`, `mode === 'done'`) se evalúen únicamente después de que el grafo de hooks se haya ejecutado en un orden predecible y constante de 20 hooks por ciclo de renderizado.
4. **Verificación de Compilación y Calidad:**
   - Validar que `pnpm --filter web build` compile con éxito al 100% (15/15 rutas estáticas y dinámicas generadas con Turbopack y 0 errores de TypeScript).

---

## 2. 🏗️ Causa Raíz y Solución Arquitectónica

### Causa Raíz
En `apps/web/src/views/lesson/LessonWorkspace.tsx`:
- Existían múltiples retornos tempranos (`if (loading) return ...`, `if (!parsed || !module || !section) return ...`, `if (mode === 'quiz') return ...`, `if (mode === 'done' && quizScore) return ...`) intercalados entre declaraciones de hooks.
- Cuando `loading === true` en el render inicial de montaje, el componente retornaba en la línea 253 habiendo ejecutado 14 hooks.
- Al culminar la carga asíncrona (`loading === false`), el siguiente render pasaba de largo el primer `return` y ejecutaba el hook #15 (`useCallback` en `handleQuizFinish`), provocando la discrepancia de Hooks de React (`Previous render: undefined, Next render: useCallback`).
- Del mismo modo, si el usuario entraba a modo quiz (`mode === 'quiz'`), se retornaba antes de los hooks de lección (`handleCompleteCurrent`, `handleNext`, `handlePrev`, `handleJumpTo`), rompiendo nuevamente la secuencia.

### Solución Arquitectónica
- Se reestructuró `LessonWorkspace` moviendo:
  - `handleQuizFinish = useCallback(...)`
  - `handleCompleteCurrent = useCallback(...)`
  - `handleNext = useCallback(...)`
  - `handlePrev = useCallback(...)`
  - `handleJumpTo = useCallback(...)`
  directamente debajo de `const lesson = section?.lessons?.[lessonIdx] ?? null;`.
- Todas las salidas condicionales (`if (loading)`, `if (!parsed || !module || !section)`, `if (mode === 'quiz')`, `if (mode === 'done' && quizScore)`) se ubicaron estrictamente después de todos los hooks.

---

## 3. 🧪 Verificación y Pruebas

- **Compilación Web (Next.js 16.4 Turbopack):**
  - Comando: `pnpm --filter web build`
  - Resultado: Exitoso (15/15 páginas generadas sin errores).
- **Typecheck TypeScript:**
  - `apps/web`: 0 errores de TypeScript (`tsc --noEmit` limpio).
- **Backend Test Suites:**
  - 24/24 test suites pasadas (82/82 tests unitarios en verde).
