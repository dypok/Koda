# Entregable Frontend 15: Sincronizacion de Racha, XP y Persistencia en Dock Flotante

## 1. Contexto y Problematica Resuelta
En la interfaz de usuario se presentaban tres sintomas indeseados:
1. Al recargar la pagina o entrar al Roadmap, el recuadro flotante inferior mostraba la racha y los puntos de experiencia en 0 antes de reaccionar.
2. Responder una leccion no encendia el fuego de racha del dia y el dock continuaba pidiendo "Meta diaria: 1 leccion" o mostrando estado pendiente.
3. Al realizar nuevamente una leccion, los numeros de racha y experiencia se reiniciaban a 0 temporalmente.

## 2. Implementaciones Realizadas

### Tienda de Autenticacion (`apps/web/src/stores/auth.store.ts`)
- Se expandio la interfaz `AuthUser` y la funcion `setUserSession` para incorporar la propiedad opcional `isActiveToday: boolean`.
- Los datos persisten localmente en `localStorage` inmediatamente tras cada actualizacion via `updateUserProfile`.

### Servicios de Usuario y Sesion
- `apps/web/src/services/auth/auth.service.ts`: Anadido `isActiveToday?: boolean` a `BackendUserSession`.
- `apps/web/src/services/user/user-profile.service.ts`: Anadido `isActiveToday?: boolean` a `UserProfileResponse`.

### Rehidratacion Blindada en Roadmap (`StudentRoadmapView.tsx`)
- Al montar la vista del estudiante, la llamada a `UserProfileService.getProfile()` aplica una salvaguarda `Math.max(profile.totalXp, currentStoreUser.totalXp)` y `Math.max(profile.currentStreak, currentStoreUser.streak)`.
- Esto previene de forma determinista que valores locales en memoria sean sobreescritos por ceros o estados no sincronizados.

### Evaluacion Reactiva de Ejercicios y Secciones (`LessonWorkspace.tsx`)
- Se desvinculo `completeSection` de las micro-lecciones individuales en `handleLessonCompleted`: completar un ejercicio individual registra la leccion en `completedLessons` y activa de inmediato `isActiveToday: true` y la racha en `AuthStore`.
- Al comprobar una respuesta correcta (tanto via atajo Enter como via boton "COMPROBAR"):
  - Se incrementa `totalXp` en +5 XP.
  - Se asegura racha minima de 1 dia y se activa `isActiveToday: true`.
  - Se despacha `EvaluationService.evaluateLessonAnswer`, el cual activa en background el registro en PostgreSQL.
- Al culminar el Quiz de la seccion (`handleQuizFinish`):
  - Se calcula la XP diferencial de finalizacion (`Math.max(30, nodeTargetXp - sessionExerciseXp)`).
  - Se invoca `EvaluationService.completeSection` con `targetXp`.
  - Al recibir respuesta del servidor o en modo fallback offline, se actualiza `AuthStore` aplicando `Math.max` para garantizar que la experiencia y la racha nunca decrezcan ni se reinicien a 0.

### Dock Flotante y Popover de Racha (`RoadmapFusionView.tsx`)
- Se mejoro el calculo de `isActiveToday`:
  - Se prioriza `user.isActiveToday` provisto por el backend.
  - En caso de comparacion de fechas, se utiliza `toLocaleDateString('en-CA')` basada en la hora local del navegador, evitando desfases provocados por la conversion UTC a medianoche.

## 3. Pruebas y Verificacion
- **Compilacion Frontend:** `pnpm --filter web build` ejecutado de manera exitosa con Turbopack y 0 errores.
- **Flujo de Usuario:**
  - Al responder un ejercicio correcto, el dock se enciende con fuego activo (`isActiveToday = true`).
  - Al recargar la pantalla, se mantiene intacto el valor de XP y la racha sin destellos a 0.
