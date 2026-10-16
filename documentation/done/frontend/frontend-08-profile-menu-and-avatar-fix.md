# Entregable Frontend: Corrección de Menú Desplegable de Usuario y Renderizado de Avatar

- **ID Tarea / HU:** UX-ROADMAP-PROFILE / AUTH-03
- **Épica:** Épica 3 (Sprint 2) — Autenticación, Perfiles de Usuario y Onboarding
- **Rama:** `feat/frontend-fix-profile-menu-dropdown`
- **Autor:** Dylan Gamero / Antigravity
- **Fecha:** 16/10/2026
- **Estado:** ✅ Frontend Completado · Verificado con Build y Typecheck en Next.js 16.4 Turbopack
- **Trazabilidad:** `ADR-015` (`koda-frontend-workflow.md`), `AUTH-03`

---

## 1. Problemas Diagnosticados y Resueltos

### A. Bucle Infinito y Parpadeo al Abrir/Cerrar el Menú de Usuario
- **Causa Raíz:** En `ProfileDropdownMenu.tsx`, el listener `handleClickOutside` escuchaba el evento global `mousedown`. Cuando el menú estaba desplegado y el usuario hacía clic sobre la píldora/botón de perfil para cerrarlo, ocurría una colisión de eventos:
  1. El evento `mousedown` en `document` se disparaba antes de que se liberara el botón del ratón.
  2. Al no estar el botón dentro de `menuRef.current`, `handleClickOutside` llamaba a `onClose()`, estableciendo inmediatamente `dropdownOpen = false`.
  3. Al soltar el clic, el navegador disparaba el evento `click` sobre el `<button>` de `RoadmapProfilePill.tsx`, ejecutando `setDropdownOpen(prev => !prev)`. Como `prev` acababa de ser seteado en `false`, se invertía instantáneamente a `true`.
  4. Resultado: El menú se abría y cerraba en un loop constante e infinito, parpadeando y evitando que el usuario pudiera cerrarlo al pulsar el botón de activación.
- **Solución Implementada:**
  - Se añadió la propiedad opcional `triggerRef?: React.RefObject<HTMLElement | null>` a `ProfileDropdownMenuProps`.
  - En `RoadmapProfilePill.tsx` se instanció `triggerRef = useRef<HTMLButtonElement>(null)` vinculado directamente al elemento `<button ref={triggerRef}>`.
  - En `handleClickOutside` de `ProfileDropdownMenu.tsx`, se verifica si `triggerRef?.current && triggerRef.current.contains(e.target as Node)`. Si el clic se originó dentro del botón disparador, se ignora el evento `mousedown` y se permite que el manejador `onClick` del botón controle el toggle naturalmente sin colisión.

### B. Foto y Avatar Deformes, Recortados o No Visibles
- **Causa Raíz:**
  1. En `apps/web/src/stores/auth.store.ts`, el fallback por defecto de `avatarUrl` apuntaba a `/brand/koda-mascot-cartoon-2d.svg`, una ilustración vectorial pesada de cuerpo entero (752 KB) no pensada para contenedores circulares 1:1, causando que se mostrara encogida, deforme o con excesivo relleno transparente.
  2. En `RoadmapProfilePill.tsx`, el avatar estaba envuelto en un `span` con `overflow-hidden rounded-full` que contenía internamente el badge de nivel con posición absoluta `absolute -bottom-1 -right-1`. Al tener el contenedor `overflow-hidden`, el badge de nivel quedaba recortado por la mitad.
  3. En `RoadmapProfilePill.tsx`, el elemento de iniciales de fallback tenía la clase `hidden fallback:block`. Al ser `fallback:` una variante de Tailwind inexistente, el texto de las iniciales nunca se renderizaba si fallaba la imagen.
  4. Se utilizaba `object-contain` en lugar de `object-cover`, provocando letterboxing y distorsión en imágenes no cuadradas.
- **Solución Implementada:**
  - **Normalización de Avatar:** En `auth.store.ts`, tanto en la rehidratación de `storedUser` como en `setUserSession`, cualquier referencia vacía o que apunte a `koda-mascot-cartoon-2d` se normaliza automáticamente al icono oficial `/avatars/koda-classic.svg`.
  - **Estructura Libre de Recortes:** Se desacopló el badge de nivel de la máscara circular. El avatar vive dentro de un contenedor interno con `overflow-hidden rounded-full`, mientras que el badge de nivel se posiciona en el contenedor padre sin `overflow-hidden`, permitiendo que se vea completo, nítido y con borde de acento.
  - **Estado Reactivo de Fallback (`imgError`):** Se reemplazó la manipulación imperativa del DOM por un estado React `const [imgError, setImgError] = useState(false)`. Si la imagen no está disponible o falla su carga, se renderizan limpiamente las iniciales tipográficas del usuario centradas con el color del tema activo.
  - **Ajuste de Relleno:** Se configuró `object-cover` tanto en `RoadmapProfilePill.tsx`, `ProfileDropdownMenu.tsx` y `ProfileSettingsModal.tsx`, asegurando que las imágenes llenen perfectamente el marco circular sin deformaciones.

---

## 2. Archivos Modificados

1. **`apps/web/src/stores/auth.store.ts`:**
   - Normalización de fallback de `avatarUrl` a `/avatars/koda-classic.svg` en `rehydrate` y `setUserSession`.
2. **`apps/web/src/components/profile/ProfileDropdownMenu.tsx`:**
   - Incorporación de `triggerRef` para prevenir el loop de cierre/apertura.
   - Normalización de avatar con `object-cover` y fallback reactivo de iniciales en el header del menú.
3. **`apps/web/src/views/roadmap/RoadmapProfilePill.tsx`:**
   - Creación y paso de `triggerRef` a `ProfileDropdownMenu`.
   - Reestructuración del avatar y badge de nivel para evitar recorte de contenido.
   - Manejo de fallback con estado React y soporte para `object-cover`.
4. **`apps/web/src/components/profile/ProfileSettingsModal.tsx`:**
   - Normalización de `initialAvatarUrl` y avatar cargado desde API.
   - Aplicación de `object-cover` en la barra lateral y previsualización activa de avatar.

---

## 3. Pruebas y Verificación

- **Compilación Web Next.js 16.4 (Turbopack):**
  - Comando: `pnpm --filter web build`
  - Resultado: Exitoso (`exit code 0`, 15/15 páginas estáticas generadas sin advertencias).
- **Typecheck de TypeScript:**
  - Comando: `pnpm --filter web exec tsc --noEmit`
  - Resultado: Exitoso (`exit code 0`, 0 errores en todo el proyecto web).
- **Aislamiento de Flujo (`ADR-015`):**
  - Cero modificaciones en `apps/api/` o migraciones de base de datos.
