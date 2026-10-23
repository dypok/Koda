# Entregable Frontend: Aislamiento de Progreso del Roadmap por Usuario y Corrección de Hydration Mismatch en Login

## 📌 Metadatos
- **ID:** `FRONTEND-31`
- **Título:** Aislamiento de progreso de roadmap en localStorage por usuario y resolución de error de hidratación SSR en Login / Registro
- **Rama:** `feat/frontend-user-progress-isolation-and-login-hydration` (hija directa de `develop`)
- **Fecha:** 22/10/2026
- **Autor:** Dylan Gamero & Antigravity AI

---

## 🎯 Causa Raíz y Requerimientos

### 1. Fuga de Progreso en Cuentas Nuevas ("me creé una nueva cuenta y me sale todo fundamentos ya completado")
- **Diagnóstico:**
  - El backend (PostgreSQL) registraba correctamente al nuevo usuario con 0 estrellas (`stars_total: 0`) y 0 módulos completados.
  - Sin embargo, en el frontend (`apps/web/src/stores/roadmap.store.ts` y `apps/web/src/views/lesson/LessonWorkspace.tsx`), el progreso se almacenaba bajo claves estáticas globales no aisladas en `localStorage` (`koda_completed_lessons`, `koda_section_stars`, `koda_roadmap_progress`).
  - Al cerrar sesión (`logout()`) o al registrarse un nuevo usuario en el mismo navegador, `hydrateProgress()` leía las claves globales que contenían las 24 estrellas del usuario previo y las sobreescribía sobre el estado nuevo de la cuenta.

### 2. Error Recuperable de Hidratación en Login (`Hydration failed because the server rendered HTML didn't match the client`)
- **Diagnóstico:**
  - En `apps/web/src/views/login/LoginForm.tsx`, el estado `isSubmitting` se inicializaba con `useState(() => typeof window !== 'undefined' && window.location.hash.includes('access_token='))`.
  - Durante el renderizado en servidor (SSR), `window` no existe, por lo que `isSubmitting = false` y el servidor generaba el formulario de login (`<div className="flex items-center justify-between pb-1">...`).
  - En la fase de hidratación del cliente, Next.js evaluaba `isSubmitting` con la URL del callback que contenía `#access_token=...`, estableciendo `isSubmitting = true` y renderizando `<KodaLoadingScreen>`.
  - La discrepancia estructural entre el HTML del servidor y el DOM inicial del cliente disparaba el error de hidratación en React 19 / Next.js 16.
  - Patrones similares con lectura sincrónica de `window.location.hash` en initializers se encontraban en `apps/web/src/app/page.tsx` (`isRedirectingOAuth`) y `apps/web/src/app/register/page.tsx` (`isOAuthProcessing`).

---

## 🛠️ Solución Implementada

### 1. Aislamiento Estricto de Progreso por Usuario en `roadmap.store.ts`
- **Helper Scoped Keys (`getScopedKey`):**
  - Todas las llaves de persistencia de progreso ahora están prefijadas con el ID del usuario activo:
    - `koda_section_stars_${userId}`
    - `koda_completed_lessons_${userId}`
    - `koda_roadmap_progress_${userId}`
    - Si no hay usuario autenticado, se asume `_guest`.
- **Purga de Claves Legadas (`purgeLegacyUnscopedRoadmapKeys`):**
  - Se eliminan automáticamente las claves no versionadas (`koda_section_stars`, `koda_completed_lessons`, `koda_roadmap_progress`) para prevenir contaminación cruzada de sesiones anteriores.
- **Acción Atómica de Reseteo (`resetProgress`):**
  - Permite reiniciar el estado del grafo a la condición virgen inicial (0 estrellas, solo el primer nodo desbloqueado) inmediatamente al cambiar de usuario o cerrar sesión.
- **Sincronización en `hydrateProgress`:**
  - Lee y escribe exclusivamente en la partición de `localStorage` perteneciente al usuario actual (`currentUserId`).

### 2. Saneamiento de Sesión en `auth.store.ts`
- En `setUserSession`: Si el usuario entrante difiere del usuario anterior, se purgan las claves legadas no versionadas y se dispara un evento `koda:session-change`.
- En `logout`: Se purgan las claves no versionadas de progreso para garantizar que el nuevo usuario inicie con estado limpio.

### 3. Reactividad en `StudentRoadmapView.tsx`
- Se agregó una referencia de control `prevUserIdRef`. Cuando el usuario autenticado cambia de `id` (cambio de cuenta o nuevo registro), se invoca de inmediato `useRoadmapStore.getState().resetProgress()` antes de ejecutar `hydrateProgress()`.
- Se asegura que los nodos comiencen bloqueados y con 0 estrellas según la respuesta de la API.

### 4. Actualización en `LessonWorkspace.tsx`
- Se reemplazó la lectura estática e insegura para SSR de `koda_completed_lessons` dentro de `useState` por inicialización segura con un `Set` vacío y carga en `useEffect` post-hidratación con `getStoredCompletedLessons(currentUserId)`.
- El guardado de lección completada ahora utiliza `markCompletedLesson(lessonId, currentUserId)`.

### 5. Corrección de Hydration Mismatches en Flujos de Autenticación
- **`LoginForm.tsx`:**
  - `isSubmitting` se inicializa estrictamente en `false`.
  - La inspección del hash `#access_token=` se trasladó a un `useEffect` que se ejecuta únicamente tras completar la hidratación del cliente, sincronizando la UI limpiamente sin alterar el árbol SSR.
- **`apps/web/src/app/page.tsx` & `apps/web/src/app/register/page.tsx`:**
  - `isRedirectingOAuth` e `isOAuthProcessing` se inicializan en `false` para que el render inicial coincida bit a bit con el HTML del servidor.

---

## 🧪 Pruebas y Verificación

1. **Chequeo de Tipos estático:**
   ```bash
   pnpm --filter web exec tsc --noEmit
   ```
   $\rightarrow$ **0 errores**.

2. **Compilación de Producción Next.js (Turbopack):**
   ```bash
   pnpm --filter web build
   ```
   $\rightarrow$ **22/22 páginas estáticas y dinámicas compiladas exitosamente (SSR y Static)**.

3. **Verificación de Aislamiento:**
   - La base de datos no fue modificada.
   - Todo el código modificado pertenece exclusivamente a `apps/web/`.
