# Entregable Frontend 20: Desacoplamiento de Cursos Quemados y Desbloqueo Inmediato tras Apex

## 1. Resumen Ejecutivo
Se elimino el fallback estatico `PYTHON_COURSES_DATASET` en el cliente web (`apps/web`), permitiendo que el catalogo y estado de los cursos se obtenga dinamicamente desde la API. Asimismo, se configuro la reactividad en el store de Zustand para que al completar exitosamente una evaluacion Apex o Boss, el curso correspondiente se marque como completado en tiempo real, desbloquee el siguiente curso en la ruta formativa, actualice sus aristas a estilo continuo y redirija al estudiante directamente al roadmap principal (`/`) en lugar de intentar rutas inexistentes (`/dashboard`).

## 2. Diagnostico del Problema
1. **Fallback quemado de cursos**:
   - `RoadmapService.getCoursesGraph` y `autoSeedDatabase` utilizaban `PYTHON_COURSES_DATASET` como fallback en caso de error o inicializacion, sobrescribiendo el estado dinamico del usuario.
   - En `track-catalog.ts`, las ramas de especializacion tenian atado el dataset quemado `courses: PYTHON_COURSES_DATASET`.
   - `roadmap.store.ts` inicializaba su estado `coursesDataset` con datos cableados que no reflejaban el progreso real de la base de datos hasta que ocurria una recarga forzada.
2. **Falta de reactividad tras completar un Apex**:
   - Al finalizar un examen Apex (`completeSectionNode`), solo se marcaba el nodo de leccion como completado, pero el curso contenedor en `coursesDataset` no actualizaba su estado a `completed`.
   - El curso dependiente (`python-2`) no se activaba inmediatamente en la interfaz sin un refresco de pantalla.
3. **Redireccion 404 tras examen**:
   - Las paginas de evaluacion (`resumen/[attemptId]`, `quiz/[id]`, `examen/[id]`) redirigian a `/dashboard` al pulsar "Continuar" o "Volver al Dashboard", ruta no existente en la aplicacion que generaba una pantalla de error 404. La ruta correcta del panel de aprendizaje es `/`.

## 3. Solucion Implementada

### A. Eliminacion de Fallbacks Quemados en Frontend
- **`apps/web/src/models/roadmap/tracks/track-catalog.ts`**:
  - Se definio `EMPTY_BRANCH_DATASET` como estructura base neutral sin cursos cableados.
  - Se eliminaron las referencias directas a `PYTHON_COURSES_DATASET` en `CAREER_BRANCHES`.
- **`apps/web/src/services/roadmap/roadmap.service.ts`**:
  - Se desacoplo `PYTHON_COURSES_DATASET` de `getCoursesGraph` y `autoSeedDatabase`.
  - El servicio consume la API autenticada y maneja fallbacks estructurados limpios sin inyectar datos falsos.
- **`apps/web/src/stores/roadmap.store.ts`**:
  - Se inicializo `coursesDataset` con una estructura limpia de inicializacion.
  - En `setBranch`, se consulta dinamicamente la API via `RoadmapService.getCoursesGraph(branchId)` para sincronizar la estructura con el backend.
  - En `hydrateProgress`, se alinea `activeNodeId` con el curso activo o desbloqueado mas reciente.

### B. Desbloqueo Reactivo Inmediato en `completeSectionNode`
- Al completar un nodo cuyo tipo sea `apex` o `boss`:
  - Se identifica el curso activo en `coursesDataset`.
  - Se actualiza su variante a `completed`, su porcentaje al 100% y su texto a `COMPLETADO`.
  - Se buscan las conexiones salientes: la conexion se actualiza a `isDashed: false` y con color activo.
  - El curso destino conectado se actualiza a `isUnlocked: true`, `variant: 'active'` y `statusText: 'EN PROGRESO'`.
  - Se persiste el estado resultante de forma sincronizada.

### C. Correccion de Redirecciones de Evaluacion
- **`apps/web/src/app/evaluaciones/resumen/[attemptId]/page.tsx`**:
  - Redireccion corregida de `/dashboard` a `/`.
- **`apps/web/src/app/evaluaciones/quiz/[id]/page.tsx`**:
  - Redireccion corregida de `/dashboard` a `/`.
- **`apps/web/src/app/evaluaciones/examen/[id]/page.tsx`**:
  - Redireccion corregida de `/dashboard` a `/`.

## 4. Pruebas y Verificacion
- **Tipado TypeScript**:
  - `pnpm --filter web exec tsc --noEmit` completado exitosamente sin errores de compilacion.
- **Flujo de Usuario**:
  - Superar `py-apex-1` actualiza visualmente `python-1` a completado y desbloquea `python-2`.
  - El boton de continuar tras completar un examen redirige transparentemente al roadmap en `/`.
