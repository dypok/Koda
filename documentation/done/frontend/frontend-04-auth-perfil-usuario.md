# Entregable Frontend HU AUTH-03: Gestión de Perfil de Usuario Consolidado, Selector de Avatares y Temas

- **ID Historia de Usuario:** AUTH-03
- **Épica:** Épica 3 (Sprint 2) — Autenticación, Perfiles de Usuario y Onboarding
- **Rama:** `feat/frontend-auth-03-perfil-settings`
- **Autor:** Dylan Gamero / Antigravity
- **Fecha:** 20/09/2026
- **Estado:** ✅ Frontend Completado · Integrado con Backend (`GET /api/v1/users/me` y `PATCH /api/v1/users/me`)
- **Trazabilidad:** `ADR-002`, `ADR-008`, `ADR-010`, `ADR-013`, `ADR-015`, `ADR-016`

---

## 1. Resumen de la Implementación Frontend

En estricto apego al protocolo de gobernanza `koda-frontend-workflow.md` (ADR-015):
1. **Aislamiento de Código:** **0 archivos modificados en `apps/api/` ni en base de datos**. Todo el desarrollo se mantuvo exclusivamente en `apps/web/` y la documentación del proyecto.
2. **Reemplazo del Botón Mockeado en `/app/ruta`:** Se eliminó el botón independiente de "Cerrar sesión" en la esquina superior derecha y se convirtió la píldora de perfil en un botón reactivo con el avatar real del usuario (`user.avatarUrl`), indicador numérico de nivel y menú popover (`ProfileDropdownMenu`).
3. **Menú Desplegable Popover (`ProfileDropdownMenu`):**
   - Tarjeta de identidad del usuario con avatar, nombre, correo, nivel actual y XP acumulado en tipografía limpia y sin badges intrusivas.
   - Accesos directos categorizados a las diferentes secciones del modal de configuración.
   - Botón de cerrar sesión seguro que limpia la sesión en `useAuthStore` y redirige a `/login`.
4. **Modal de Configuración Integral (`ProfileSettingsModal`):**
   - **Tab 1 (Mi Perfil - CRUD Limpio):** Edición de nombre/alias, visualización de correo (solo lectura), biografía, zona horaria y locale. Se eliminó la sección de documento legal por requerimiento de usuario para una experiencia simplificada.
   - **Tab 2 (Selector de Avatares y Subida de Foto Custom):**
     - Catálogo con 8 expresiones oficiales vectoriales SVG de Koda 🦊 (`koda-classic`, `koda-detective`, `koda-astronaut`, `koda-hacker`, `koda-sensei`, `koda-cyberpunk`, `koda-alchemist`, `koda-gamer`) con vista previa en vivo sin badges de rareza.
     - **Opción de subir fotografía personalizada:** Zona interactiva para cargar fotos PNG, JPG, WEBP o SVG (máx. 3MB) con previsualización inmediata y actualización en caliente de la sesión. Se documentó el requerimiento para el backend en `documentation/done/backend/PENDIENTE-backend-avatar-upload.md`.
   - **Tab 3 (Metas de Estudio):** Selección de minutos diarios (5m a 60m), ritmo pedagógico, nivel de experiencia y estilo de aprendizaje preferido.
    - **Tab 4 (Fondo, Temas y Modos de Visualización):**
      - **Selector de Modo de Visualización del Roadmap:** Se trasladó la selección de modos (`Fusión`, `Mapa` y `Lista`) desde el HUD superior hacia la configuración visual, permitiendo conmutar la vista espacial en cualquier momento con persistencia local en `useAppearanceStore`.
      - **Color de Acento:** Conexión completa de la paleta (`Ámbar`, `Cian`, `Púrpura`, `Esmeralda`) con variables CSS `:root` (`--koda-accent`, `--koda-accent-rgb`), aura atmosférica ambiental en el fondo, tintes en sprites Pixi y sincronización en la píldora y menú de perfil.
      - **Densidad de Estrellas y Partículas:** Configuración real de densidad en 3 niveles (Baja: 35 estrellas / 8 partículas; Media: 100 estrellas / 20 partículas; Alta: 240 estrellas / 45 partículas) extendida a todos los presets climáticos.
      - **Efectos Interactivos con el Ratón:** Lienzo dedicado en Canvas 2D a 60fps (`RoadmapInteractiveCursor.tsx`) que emite estelas de chispas estelares y ondas reactivas con el color de acento al mover el ratón o hacer clic, activable/desactivable en tiempo real.
      - Se eliminó el `OrbitFieldBackground` hardcodeado en `RoadmapFusionView` que bloqueaba visualmente el fondo, permitiendo que la personalización reaccione en tiempo real y cambie el ambiente de inmediato.
    - **Tab 5 (Métricas en Vivo):** Telemetría en tiempo real de XP total, nivel actual, racha activa, récord histórico, protectores de racha y horas de estudio, con botón de sincronización directa contra `GET /api/v1/users/me`.
5. **Resolución de Overlap en Vista Fusión:**
   - Se removió el selector de pestañas del HUD superior (`RoadmapTopHud.tsx`), despejando el cuadrante superior derecho.
   - Se elevó la píldora de perfil (`RoadmapProfilePill.tsx`) a `z-40` y el dropdown a `z-50`.
   - Se reajustó la posición vertical del panel lateral de detalle (`aside`) y del botón colapsable en `RoadmapFusionView.tsx` a `top-20` (80px), asegurando separación limpia debajo de los controles del HUD y evitando cualquier superposición con el menú desplegable.
6. **Ruta Dedicada `/app/perfil`:** Implementada en `apps/web/src/app/app/perfil/page.tsx` con soporte de redirección si no hay sesión y retorno fluido a `/app/ruta`.

---

## 2. Archivos Creados y Modificados

### A. Servicios y Tiendas
- **`apps/web/src/services/user/user-profile.service.ts` [NEW]:** Cliente HTTP tipado con métodos `getProfile(token)` y `updateProfile(payload, token)`.
- **`apps/web/src/stores/auth.store.ts` [MODIFY]:** Adición de `updateUserProfile(partial: Partial<AuthUser>)` para sincronizar en caliente el usuario autenticado y su avatar en memoria y `localStorage`.
- **`apps/web/src/stores/appearance.store.ts` [NEW]:** Tienda Zustand para persistir preferencias de fondo, densidad de estrellas, tema, efectos interactivos y `coursesDisplayMode` (`fusion`, `canvas`, `pin-rail`), incorporando `ACCENT_PALETTES` y `applyAccentToDom`.

### B. Componentes UI
- **`apps/web/src/components/profile/ProfileSettingsModal.tsx` [NEW]:** Modal responsive de 5 pestañas limpio, sin badges, con CRUD, selector de avatares oficiales, subida de foto personalizada, metas, modos de visualización del roadmap (Fusión, Mapa, Lista), temas interactivos y métricas.
- **`apps/web/src/components/profile/ProfileDropdownMenu.tsx` [NEW]:** Popover desplegable flotante con header del usuario y atajos sincronizados con el tema de acento.
- **`apps/web/src/components/profile/ProfileToast.tsx` [NEW]:** Notificaciones flotantes animadas para éxito/error/info.
- **`apps/web/src/components/roadmap/RoadmapDynamicBackground.tsx` [NEW]:** Fondo ambiental reactivo a `useAppearanceStore` (Pixi + WebGL) con aura ambiental y densidad dinámica.
- **`apps/web/src/components/roadmap/RoadmapInteractiveCursor.tsx` [NEW]:** Canvas reactivo a 60fps con estelas de chispas y ondas al mover el ratón.
- **`apps/web/src/components/landing/OrbitFieldBackground.tsx` [MODIFY]:** Soporte para `engineKey?: BgKey` con motor de lluvia lenta matrix.
- **`apps/web/src/components/landing/HeroSkyBackground.tsx` [MODIFY]:** Soporte para `accentTheme`, ajuste dinámico de estrellas y gradientes reactivos.
- **`apps/web/src/components/landing/WeatherLayer.tsx` [MODIFY]:** Ampliación del límite de partículas a 50 para reflejar la densidad alta.
- **`apps/web/src/views/roadmap/RoadmapProfilePill.tsx` [MODIFY]:** Renderizado del avatar real del usuario, eliminación del botón mock de logout, elevación a `z-40`, integración del dropdown y adaptación a `accentTheme`.
- **`apps/web/src/views/roadmap/RoadmapTopHud.tsx` [MODIFY]:** Eliminación del selector de pestañas de modo, manteniendo únicamente el indicador central y botón continuar.
- **`apps/web/src/views/roadmap/StudentRoadmapView.tsx` [MODIFY]:** Conexión de `coursesDisplayMode` directo a `useAppearanceStore` y reemplazo de `HeroSkyBackground` por `RoadmapDynamicBackground`.
- **`apps/web/src/views/roadmap/RoadmapFusionView.tsx` [MODIFY]:** Remoción del fondo hardcodeado y ajuste de posición a `top-20` para evitar overlap con controles superiores.

### C. Assets de Avatares Oficiales
- `apps/web/public/avatars/koda-classic.svg`
- `apps/web/public/avatars/koda-detective.svg`
- `apps/web/public/avatars/koda-astronaut.svg`
- `apps/web/public/avatars/koda-hacker.svg`
- `apps/web/public/avatars/koda-sensei.svg`
- `apps/web/public/avatars/koda-cyberpunk.svg`
- `apps/web/public/avatars/koda-alchemist.svg`
- `apps/web/public/avatars/koda-gamer.svg`
- `apps/web/src/constants/avatars.config.ts`

### D. Rutas Next.js y Requerimiento Backend
- `apps/web/src/app/app/perfil/page.tsx` [NEW]
- `documentation/done/backend/PENDIENTE-backend-avatar-upload.md` [NEW]

---

## 3. Verificación y Calidad de Código

- **Tipado TypeScript:** `pnpm --filter web exec tsc --noEmit` $\rightarrow$ **0 errores**.
- **Compilación de Producción:** `pnpm --filter web build` $\rightarrow$ **100% exitoso (12/12 páginas generadas en Turbopack)**.
- **Verificación HTTP:** 
  - `GET /app/ruta` $\rightarrow$ `HTTP 200 OK`.
  - `GET /app/perfil` $\rightarrow$ `HTTP 200 OK`.
