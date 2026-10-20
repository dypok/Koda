# Entregable Backend 15: Evaluacion Dinamica del DAG de Cursos y Desbloqueo tras Apex

## 1. Resumen Ejecutivo
Se elimino por completo el fallback quemado de cursos y las definiciones dummy de lecciones en el backend (`apps/api`). Se implemento la evaluacion dinamica en tiempo de ejecucion del grafo de cursos basado en el DAG de prerrequisitos y el progreso real del estudiante (`user_section_stars`). Al superar el examen Apex de un curso (ej. `py-apex-1`), el sistema marca automaticamente el curso como completado, calcula y desbloquea el siguiente curso dependiente (`python-2`), elimina el estilo discontinuo de las aristas conectadas (`isDashed: false`) y garantiza que cualquier curso inexistente retorne un error HTTP 404 (`NotFoundException`) limpio y controlado en lugar de nodos ficticios.

## 2. Diagnostico del Problema
1. **Fallback quemado de lecciones**:
   - En `GetRoadmapGraphUseCase.getLessonsGraph`, solo existian estructuras lineales para `python-1` (nodos del 1 al 12) y datasets truncados de 5 nodos para `python-2`, `python-3`, `fastapi-async` y `django-enterprise`.
   - Cursos como `python-apex`, `data-analytics` y `ai-agents` caian en un bloque `else` que retornaba un nodo dummy con `label: 'INTRODUCCIÓN'` y `subtitle: 'CONCEPTOS INICIALES'`, provocando la aparicion de un fallback extrano no deseado en la interfaz.
2. **Bloqueo tras culminar el examen Apex**:
   - Al completar el examen Apex (`py-apex-1`), la evaluacion de `user_section_stars` en `getCoursesGraph` no evaluaba el DAG de prerrequisitos para cursos posteriores.
   - Los cursos subsiguientes permanecian con `isUnlocked: false`, `variant: 'locked'` y sus conexiones continuaban como discontinuas (`isDashed: true`), imposibilitando el avance del estudiante hacia el siguiente modulo del roadmap.
3. **Mapeo de identificadores y alias**:
   - Los nodos del grafo usaban slugs como `sec-01` o `py-m01`, mientras que los registros de evaluacion Apex utilizaban `py-apex-1`, generando desalineacion en la resolucion de progreso.

## 3. Solucion Implementada

### A. Evaluacion Dinamica del DAG de Cursos (`GetRoadmapGraphUseCase.getCoursesGraph`)
- Se implemento la deteccion de cursos aprobados analizando si el examen Apex o Boss del curso (`py-apex-1`, `py2-boss`, `py3-boss`, `fa-boss`, `dj-boss`, `da-boss`, `ia-boss`, `apex-cert`) figura como aprobado en `user_section_stars` (`isPassed === true`).
- Para cada curso en el dataset base:
  - Si el curso esta aprobado: `variant = 'completed'`, `isUnlocked = true`, `statusText = 'COMPLETADO'`.
  - Si todos sus prerrequisitos inmediatos estan satisfechos: `variant = 'active'`, `isUnlocked = true`, `statusText = 'EN PROGRESO'`.
  - Si no cumple los prerrequisitos: `variant = 'locked'`, `isUnlocked = false`, `statusText = 'BLOQUEADO'`.
- Se recalculan dinamicamente las conexiones (`connections`): si el nodo origen esta completado, la conexion saliente se activa con `isDashed = false` y `color = '#00E5FF'`.

### B. Generacion Completa de Grafos de Secciones (`GetRoadmapGraphUseCase.getLessonsGraph`)
- Se incorporo el helper `buildLinearSectionDataset` para generar los grafos de lecciones de los 8 cursos del catalogo:
  - `python-1`: 12 nodos (incluyendo el examen final `py-apex-1`).
  - `python-2`: 12 nodos (incluyendo `py2-boss`).
  - `python-3`: 12 nodos (incluyendo `py3-boss`).
  - `fastapi-async`: 12 nodos (incluyendo `fa-boss`).
  - `django-enterprise`: 12 nodos (incluyendo `dj-boss`).
  - `data-analytics`: 12 nodos (incluyendo `da-boss`).
  - `ai-agents`: 12 nodos (incluyendo `ia-boss`).
  - `python-apex`: Grafo especializado de certificacion profesional (Evaluacion Teorica, Desafio Practico, Auditoria de Codigo, Certificacion Oficial).
- Se elimino el fallback dummy (`INTRODUCCIÓN • CONCEPTOS INICIALES`). Si se solicita un `courseSlug` no registrado, se arroja una excepcion `NotFoundException` de NestJS con el mensaje descriptivo `Curso con slug '${courseSlug}' no encontrado en el catalogo.`

### C. Normalizacion de Alias en Enriquecimiento (`enrichLessonsWithProgress`)
- Se agrego soporte para resolucion bidireccional de alias de IDs de secciones (`sec-01` <-> `py-m01`, etc.) garantizando que las estrellas y estados obtenidos de la base de datos se asocien fielmente a cada nodo visual.

## 4. Pruebas y Verificacion
- **Pruebas Unitarias (`apps/api/src/application/use-cases/curriculum/get-roadmap-graph.use-case.spec.ts`)**:
  - Test 1: Verificacion de grafo base para usuario nuevo (solo nodo inicial activo).
  - Test 2: Verificacion de enriquecimiento con progreso de lecciones.
  - Test 3: Verificacion del desbloqueo de `python-2` y aristas solidas tras aprobar el Apex `py-apex-1`.
  - Test 4: Verificacion de la generacion de los 12 nodos reales de `python-2` sin fallbacks dummy.
  - Test 5: Verificacion de fases de certificacion para `python-apex`.
  - Test 6: Verificacion de `NotFoundException` para cursos invalidos.
- **Resultados de Jest**: 26 suites pasadas, 91 tests aprobados con 0 errores.
- **Tipado TypeScript**: Compilacion limpia con `pnpm --filter api exec tsc --noEmit`.
