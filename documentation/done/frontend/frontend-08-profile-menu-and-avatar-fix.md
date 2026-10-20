# Entregable Frontend: Corrección de Menú Desplegable de Usuario, Renderizado de Avatar y Estabilidad de Arrastre

- **ID Tarea / HU:** UX-ROADMAP-PROFILE / AUTH-03 / UX-ROADMAP-PAN
- **Épica:** Épica 3 (Sprint 2) — Autenticación, Perfiles de Usuario y Onboarding & Épica 4 (Motor de Aprendizaje)
- **Rama:** `feat/frontend-fix-profile-menu-dropdown`
- **Autor:** Dylan Gamero / Antigravity
- **Fecha:** 16/10/2026
- **Estado:** ✅ Frontend Completado · Verificado con Build y Typecheck en Next.js 16.4 Turbopack
- **Trazabilidad:** `ADR-015` (`koda-frontend-workflow.md`), `AUTH-03`

---

## 1. Problemas Diagnosticados y Resueltos

### A. Bucle Infinito y Parpadeo al Abrir/Cerrar el Menú de Usuario
- **Causa Raíz:** En `ProfileDropdownMenu.tsx`, existía un listener `mousedown` a nivel de `document` que consideraba cualquier clic fuera de `menuRef` como un clic exterior. Cuando el usuario hacía clic sobre el botón para cerrar el menú, el evento `mousedown` forzaba `dropdownOpen = false`, y de inmediato el evento `click` del propio botón volvía a alternar el estado a `true`, reabriendo el menú infinitamente.
- **Solución Definitiva:**
  - En `RoadmapProfilePill.tsx`, se asignó `containerRef = useRef<HTMLDivElement>(null)` sobre el contenedor raíz que engloba tanto el botón disparador como el popover del menú (`ProfileDropdownMenu`).
  - Se vinculó el listener al evento `click` y `touchstart` a nivel de `document` condicionado a `dropdownOpen`: si `containerRef.current.contains(target)` es verdadero, no se ejecuta ninguna acción exterior.
  - En el `<button>`, se añadió `e.stopPropagation()` al hacer clic para evitar cualquier propagación indeseada al documento.
  - Se eliminó el listener redundante de `mousedown` en `ProfileDropdownMenu.tsx`, delegando toda la gestión al contenedor unificado y manteniendo en el menú únicamente el cierre accesible por tecla `Escape`.

### B. Fallos en el Arrastre del Roadmap (Canvas Panning Atascado / Bugueado)
- **Causa Raíz:** En `RoadmapFusionView.tsx`:
  1. `handlePointerDown` no implementaba captura de puntero (`setPointerCapture`). Cuando el usuario arrastraba y el cursor se movía sobre el panel lateral (`aside`), los controles de zoom (`RoadmapCanvasControls`) o fuera de la ventana del navegador, el evento `pointerup` nunca se disparaba en el contenedor.
  2. Al perderse el `pointerup`, `dragRef.current` quedaba activo permanentemente, haciendo que el mapa se moviera solo con mover el ratón sin presionar ningún botón.
  3. No existía umbral de arrastre (`dragThreshold`): cualquier micro-movimiento de 1px al hacer clic sobre un nodo de Pixi iniciaba un paneo inmediato, desplazando el canvas e invalidando la detección de clic en el nodo.
- **Solución Implementada:**
  - **Umbral de Arrastre (5px):** Se agregó una verificación de distancia mínima (`Math.hypot(dx, dy) >= 5`) antes de activar el paneo, garantizando que los clics en nodos de Pixi se ejecuten limpiamente sin mover el lienzo.
  - **Captura de Puntero:** Se invoca `setPointerCapture(e.pointerId)` al superar el umbral y `releasePointerCapture(e.pointerId)` al soltar o cancelar.
  - **Protección de Botones (`e.buttons === 0`):** En `handlePointerMove`, si el navegador reporta que no hay ningún botón presionado, se aborta y limpia inmediatamente el estado de arrastre.
  - **Fallback Global de Liberación:** Se registraron listeners globales a nivel de `window` para `pointerup`, `pointercancel` y `blur`, garantizando que `dragRef.current = null` se ejecute siempre, incluso si el cursor sale del navegador o se cambia de pestaña.
  - **Aislamiento de Elementos Flotantes:** Se añadió `onPointerDown={(e) => e.stopPropagation()}` y `no-drag` a `<aside>`, botones de toggle y barra inferior de rachas/progreso.

### C. Foto y Avatar Deformes, Recortados o No Visibles
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

1. **`apps/web/src/views/roadmap/RoadmapProfilePill.tsx`:**
   - Unificación de fuera de clic con `containerRef` sobre el contenedor raíz.
   - `e.stopPropagation()` en el botón disparador.
   - Reestructuración del avatar y badge de nivel para evitar recorte de contenido.
   - Manejo de fallback con estado React y soporte para `object-cover`.
2. **`apps/web/src/components/profile/ProfileDropdownMenu.tsx`:**
   - Eliminación del listener duplicado de `mousedown`.
   - Soporte para tecla `Escape` y `stopPropagation` en clics internos.
   - Normalización de avatar con `object-cover` y fallback reactivo de iniciales en el header del menú.
3. **`apps/web/src/views/roadmap/RoadmapFusionView.tsx`:**
   - Implementación de umbral de 5px para arrastre.
   - Captura y liberación segura de puntero (`setPointerCapture`/`releasePointerCapture`).
   - Detección de `e.buttons === 0` en `handlePointerMove`.
   - Listeners de seguridad global en `window` para `pointerup`, `pointercancel` y `blur`.
   - Aislamiento de eventos con `stopPropagation` en panel lateral y barras de estado.
4. **`apps/web/src/stores/auth.store.ts`:**
   - Normalización de fallback de `avatarUrl` a `/avatars/koda-classic.svg` en `rehydrate` y `setUserSession`.
5. **`apps/web/src/components/profile/ProfileSettingsModal.tsx`:**
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
