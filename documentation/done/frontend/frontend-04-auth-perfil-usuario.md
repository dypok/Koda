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
   - **Tab 4 (Fondo & Temas Pixi WebGL):**
     - Selector de atmósfera ambiental (Cielo Cósmico, Luciérnagas, Brasas, Polvo estelar, Lluvia matrix, Órbita kepleriana), densidad de estrellas y paleta de acento.
     - Se eliminó el `OrbitFieldBackground` hardcodeado en `RoadmapFusionView` que bloqueaba visualmente el fondo, permitiendo que la personalización reaccione en tiempo real y cambie el ambiente de inmediato.
   - **Tab 5 (Métricas en Vivo):** Telemetría en tiempo real de XP total, nivel actual, racha activa, récord histórico, protectores de racha y horas de estudio, con botón de sincronización directa contra `GET /api/v1/users/me`.
5. **Ruta Dedicada `/app/perfil`:** Implementada en `apps/web/src/app/app/perfil/page.tsx` con soporte de redirección si no hay sesión y retorno fluido a `/app/ruta`.

---

## 2. Archivos Creados y Modificados

### A. Servicios y Tiendas
- **`apps/web/src/services/user/user-profile.service.ts` [NEW]:** Cliente HTTP tipado con métodos `getProfile(token)` y `updateProfile(payload, token)`.
- **`apps/web/src/stores/auth.store.ts` [MODIFY]:** Adición de `updateUserProfile(partial: Partial<AuthUser>)` para sincronizar en caliente el usuario autenticado y su avatar en memoria y `localStorage`.
- **`apps/web/src/stores/appearance.store.ts` [NEW]:** Tienda Zustand para persistir preferencias de fondo, densidad de estrellas, tema y efectos interactivos.

### B. Componentes UI
- **`apps/web/src/components/profile/ProfileSettingsModal.tsx` [NEW]:** Modal responsive de 5 pestañas limpio, sin badges, con CRUD, selector de avatares oficiales, subida de foto personalizada, metas, apariencia y métricas.
- **`apps/web/src/components/profile/ProfileDropdownMenu.tsx` [NEW]:** Popover desplegable flotante con header del usuario y atajos.
- **`apps/web/src/components/profile/ProfileToast.tsx` [NEW]:** Notificaciones flotantes animadas para éxito/error/info.
- **`apps/web/src/components/roadmap/RoadmapDynamicBackground.tsx` [NEW]:** Fondo ambiental reactivo a `useAppearanceStore` (Pixi + WebGL).
- **`apps/web/src/components/landing/OrbitFieldBackground.tsx` [MODIFY]:** Soporte para `engineKey?: BgKey` con motor de lluvia lenta matrix.
- **`apps/web/src/components/landing/HeroSkyBackground.tsx` [MODIFY]:** Ajuste de clamp mínimo a 20 estrellas.
- **`apps/web/src/views/roadmap/RoadmapProfilePill.tsx` [MODIFY]:** Renderizado del avatar real del usuario, eliminación del botón mock de logout e integración del dropdown.
- **`apps/web/src/views/roadmap/StudentRoadmapView.tsx` [MODIFY]:** Reemplazo de `HeroSkyBackground` estático por `RoadmapDynamicBackground`.
- **`apps/web/src/views/roadmap/RoadmapFusionView.tsx` [MODIFY]:** Remoción del fondo hardcodeado para permitir transparencia sobre `RoadmapDynamicBackground`.

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
- **Compilación de Producción:** `pnpm --filter web build` $\rightarrow$ **100% exitoso (12/12 páginas generadas en 3.7s)**.
- **Verificación HTTP:** 
  - `GET /app/ruta` $\rightarrow$ `HTTP 200 OK`.
  - `GET /app/perfil` $\rightarrow$ `HTTP 200 OK`.
