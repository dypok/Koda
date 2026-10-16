# 🦊 Entregable Frontend 09: Corrección de Rutas de Módulos y Mapeo en LessonWorkspace

> **ID de HU y Épica:** EPIC-04 / US-024 (Consumo de módulos, secciones y lecciones)  
> **Rama:** `feat/frontend-fix-profile-menu-dropdown`  
> **Fecha:** 16-10-2026  
> **Autor:** Dylan Gamero / Frontend Assistant  

---

## 1. Problema Identificado

Al intentar ingresar a los módulos desde el roadmap o mediante URL directa, se presentaban dos fallos:
1. **Error 404 ("Te saliste del roadmap"):** Si el usuario accedía a rutas como `/app/curso/[course]` (sin subsección) o usaba rutas directas como `/curso/...` o `/modulo/...`, Next.js arrojaba la página de 404 porque solo existía la ruta exacta `/app/curso/[course]/seccion/[section]`.
2. **"Sección no disponible todavía - Este módulo se encuentra en sincronización":** Al navegar desde el roadmap a una lección activa (ejemplo: `/app/curso/python-1/seccion/py-m01`), `NODE_TO_SLUG_MAP` en `LessonWorkspace.tsx` solo contenía IDs del mock antiguo (`les-01`, etc.) y carecía de los IDs reales emitidos por la API backend (`py-m01` a `py-m06`, `py-boss-logic`, `py-apex-1`, `py2-m01`, `fa-m01`, etc.). Como `'py-m01'` contiene un guion, se interpretaba como slug directo e intentaba importar `python/py-m01`, lo cual retornaba `null` y mostraba el bloqueo de contenido no sincronizado.
3. **Pérdida de identificadores de nodo:** En `StudentRoadmapView.tsx` y `RoadmapTopHud.tsx`, una expresión regular (`/^s\d+$/`) truncaba sufijos como `s01` en nodos tipo `data-analytics-s01`, perdiendo el contexto del curso.

---

## 2. Solución Implementada

### A. Mapeo Exhaustivo y Fallback Inteligente en `LessonWorkspace.tsx`
- Se actualizaron todos los IDs de nodos del backend y del mock en `NODE_TO_SLUG_MAP`:
  - Python 1: `py-m01` a `py-m06`, `py-boss-logic`, `py-apex-1` mapeados a sus respectivos módulos (`fundamentos-de-python`, `variables-y-tipos-de-datos`, etc.).
  - Python 2: `py2-m01` a `py2-m05`, `py2-01` a `py2-10`.
  - Python 3: `py3-m01` a `py3-m05`, `py3-01` a `py3-10`.
  - FastAPI: `fa-m01` a `fa-m04`, `fa-01` a `fa-05`.
  - Django: `dj-m01` a `dj-m04`, `dj-01` a `dj-05`.
  - Data Analytics: `data-analytics-s01`, `da-01` a `da-10`.
  - AI Agents: `ai-agents-s01`, `ia-01` a `ia-10`.
  - Apex: `python-apex-s01`, `apex-01` a `apex-03`.
- Se reforzó `parseCourse`:
  1. Consulta directa en `NODE_TO_SLUG_MAP[sectionRef]`.
  2. Validación de disponibilidad real del módulo mediante `isModuleAvailable(lang, sectionRef)`.
  3. Fallback inteligente `COURSE_DEFAULT_SLUGS[courseId]` para que ningún parámetro arbitrario devuelva `null`.

### B. Rutas y Redirecciones en Next.js App Router
- Se creó `apps/web/src/app/app/curso/[course]/page.tsx` para redirigir automáticamente peticiones a la primera sección del curso correspondiente.
- Se creó `apps/web/src/app/app/ruta/[lang]/page.tsx` para canalizar `/app/ruta/:lang` a `/` conforme a `10_INFORMATION_ARCHITECTURE.md`.
- Se configuraron rewrites en `apps/web/next.config.mjs` para alias como `/curso/:course/seccion/:section`, `/curso/:course`, `/modulo/:section` y `/modulos/:section`.

### C. Navegación en Roadmap
- En `StudentRoadmapView.tsx` y `RoadmapTopHud.tsx`, se preserva `node.id` íntegro como `sectionRef` para garantizar resolución exacta.

---

## 3. Pruebas y Verificación

- `pnpm --filter web build`: **Exitoso** (código 0). Todas las rutas generadas y middleware proxy configurado.
- `pnpm --filter web exec tsc --noEmit`: **Exitoso** (código 0). Sin errores de tipos.
