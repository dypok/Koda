# Entregable Frontend: Vitrina de Logros, Medallas Desbloqueables y Notificación Toast (GAMI-03)

**HU Asociada:** GAMI-03 — Catálogo de Logros (Achievements) y Medallas Desbloqueables  
**Épica:** EPIC-08 — Gamificación, Economía XP, Rachas y Mascota Koda 🦊  
**Rama:** `feat/gami-03-achievements-catalog`  
**Fecha:** 26 de Octubre de 2026  
**Autor:** Dylan Gamero

---

## 1. Resumen Arquitectónico

Se implementó la experiencia completa de usuario para el sistema de logros y medallas en `apps/web`:

1. **Tipos Compartidos (`packages/types/src/index.ts`):**
   - Definición y exportación de `AchievementCategory` (`streak`, `xp`, `curriculum`, `mastery`, `speed`), `AchievementItem` y `UserAchievementsResponse`.
   - Build verificado y sincronizado con Turborepo.

2. **Capa de Servicios (`apps/web/src/services/gamification/achievement.service.ts`):**
   - Clase `AchievementService` consumiendo los endpoints autenticados:
     - `getAchievements(token?: string)`
     - `checkAchievements(token?: string)`
   - Compatibilidad con `fetchWithFallback` para llamadas mediante proxy Next.js y conexión directa al backend.

3. **Gestión de Estado Reactivo (`apps/web/src/stores/achievement.store.ts`):**
   - Store Zustand `useAchievementStore` gestionando:
     - Lista de logros con progreso porcentual y valores actuales/objetivo.
     - Estadísticas globales (`total`, `unlocked_count`, `total_xp_earned`).
     - Filtros interactivos por categoría y por estado (`all`, `unlocked`, `locked`).
     - Manejo de notificaciones flotantes con `recentUnlockedToast`.
     - Sincronización automática de XP en `useAuthStore` ante desbloqueos.

4. **Componentes Visuales de Gamificación:**
   - **`AchievementCard.tsx` (`apps/web/src/components/gamification/`):**
     - Tarjetas con acabado metálico, resplandores por categoría (Racha: Ámbar, Experiencia: Púrpura, Currículo: Cian, Maestría: Dorado, Velocidad: Esmeralda).
     - Íconos dinámicos vectoriales con `@phosphor-icons/react` (`Sparkle`, `Flame`, `Lightning`, `Trophy`, `Star`, `BookOpen`, `ShieldCheck`, `Crown`, etc.).
     - Indicador de estado (candado / check), badge de bonificación `+N XP`, fecha de desbloqueo y barra de progreso porcentual para ítems bloqueados.
   - **`AchievementToast.tsx` (`apps/web/src/components/gamification/`):**
     - Notificación emergente con animación Framer Motion tipo spring.
     - Ícono de trofeo con rebote y destellos, título, descripción y botón de acceso rápido a la vitrina.
     - Auto-descarte programado a los 6.5 segundos con opción de cierre manual.
     - Montado globalmente en `RootLayout` (`apps/web/src/app/layout.tsx`) para notificar al estudiante en cualquier punto de la app.

5. **Páginas y Vistas:**
   - **`AchievementsView.tsx` (`apps/web/src/views/achievements/`):**
     - Vista completa de la vitrina con fondo estelar `OrbitFieldBackground`, métricas globales (desbloqueados, XP acumulado de medallas), barra de progreso del Salón de la Fama, selector de categorías y pestañas de estado.
     - Botón de conciliación manual *"Actualizar logros"* con animación de giro.
   - **Ruta Oficial `/app/logros` (`apps/web/src/app/app/logros/page.tsx`):**
     - Protección mediante autenticación, redirección y pantalla de carga `KodaLoadingScreen`.
   - **Integración en Perfil y Navegación:**
     - Enrutamiento limpio en `proxy.ts`: adición de `/logros` a `APP_ONLY_PREFIXES` y reescritura hacia `/app/logros`.
     - Acceso directo *"Logros y Medallas"* en `ProfileDropdownMenu.tsx`.
     - Banner informativo con resumen de medallas y botón de acceso en la pestaña de métricas de `ProfileSettingsModal.tsx`.

---

## 2. Pruebas y Verificación

- **Chequeo de Tipos (`pnpm --filter web exec tsc --noEmit`):**
  - **0 errores de TypeScript**.
- **Compilación de Producción (`pnpm --filter web build`):**
  - Generación estática y dinámica de **24/24 rutas** (incluyendo `/app/logros`) en 6.7s con Turbopack.
- **Integridad del Repositorio:**
  - `apps/web/next-env.d.ts` restaurado y verificado.
