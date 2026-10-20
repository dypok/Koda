# Entregable Frontend 21: Calibracion de Avatares Oficiales en Selector y Depuracion de Mocks

## 1. Resumen Ejecutivo
Se realizo la correccion y calibracion integral del selector de avatares en `apps/web`. Se normalizo el avatar insignia `koda-classic.svg` a partir del vector canónico `bases zorrito.svg` con su `viewBox` exacto (`1479.29 318.75 413.14 413.14`), eliminando la version previa que contenia un bitmap rasterizado recortado. Se redujo el catalogo `KODA_AVATARS` a los 6 avatares vectoriales oficiales provistos por el equipo de diseno (`koda-classic`, `koda-detective`, `koda-astronaut`, `koda-hacker`, `koda-cyberpunk`, `koda-gamer`), eliminando los avatares mock ficticios (`koda-sensei` y `koda-alchemist`). Asimismo, se depuraron definitivamente los assets obsoletos de la mascota mock (`koda-mascot-cartoon-2d.svg` y `koda-mascot-cartoon-2d-transparent.png`) y la carpeta temporal `public/koda-svg/`.

## 2. Diagnostico del Problema
1. **Avatar Clasico e Imagenes Corruptas**:
   - `koda-classic.svg` y `koda-alchemist.svg` habian sido asociados con archivos de exportacion bitmap parciales (`Recurso 3.svg` y `Recurso 1.svg`) con imagenes rasterizadas base64 recortadas en la esquina superior izquierda.
   - `bases zorrito.svg` (el vector real del zorro clasico) habia sido asignado erroneamente a un avatar ficticio denominado `koda-sensei`.
2. **Discrepancia en el Catalogo de Avatares**:
   - El archivo `avatars.config.ts` mantenia una lista de 8 avatares originada en mocks de diseno anteriores, mientras que el paquete de diseno oficial incluye 6 avatares vectoriales autenticos.
3. **Persistencia en Modo Invitado**:
   - En `ProfileSettingsModal.tsx`, al seleccionar un avatar con una sesion demo o de invitado (`token === 'koda-guest-session'`), el sistema intentaba enviar una peticion HTTP al endpoint `/users/me`, provocando un fallo 401 que impedia la actualizacion del avatar en pantalla.
4. **Residuos de Assets Mock**:
   - En `public/brand/` continuaban existiendo los archivos `koda-mascot-cartoon-2d.svg` y su render PNG.
   - En `public/` continuaba presente la carpeta temporal `koda-svg/`.

## 3. Implementaciones Realizadas

### A. Calibracion de Avatares Vectoriales (`apps/web/public/avatars/`)
- **`koda-classic.svg`**: Generado a partir de `bases zorrito.svg` con `viewBox="1479.29 318.75 413.14 413.14"`. Medalla circular del zorro insignia centrada y 100% vectorial.
- **`koda-detective.svg`**: Vector con sombrero y lupa de detective (`viewBox="1479.29 318.75 413.14 413.14"`).
- **`koda-astronaut.svg`**: Vector con escafandra y casco estelar (`viewBox="1480.71 318.72 413.14 413.14"`).
- **`koda-hacker.svg`**: Vector con capucha y consola cyber (`viewBox="1479.29 318.75 413.14 413.14"`).
- **`koda-cyberpunk.svg`**: Vector con visor neon y tecnologia futurista (`viewBox="1480.71 318.72 413.14 413.14"`).
- **`koda-gamer.svg`**: Vector con auriculares pro gamer y fuego (`viewBox="1479.29 318.75 413.14 413.14"`).
- **Eliminacion de mocks**: Se eliminaron del sistema de archivos `koda-alchemist.svg` y `koda-sensei.svg`.

### B. Configuracion del Catalogo (`apps/web/src/constants/avatars.config.ts`)
- Se limpio el arreglo `KODA_AVATARS` para exponer de forma estricta los 6 avatares oficiales.
- Se preservaron las descripciones, acentos de color, niveles de rareza y badges tecnicos alineados con la identidad visual.

### C. Experiencia en Modal de Ajustes (`ProfileSettingsModal.tsx`)
- Se optimizo el grid de seleccion a `grid grid-cols-2 sm:grid-cols-3 gap-3`, distribuyendo los 6 avatares de manera simetrica y ergonomica.
- Se actualizo `handleSelectAvatar` para verificar sesiones de invitado (`token === 'koda-guest-session'`), actualizando el store y localStorage inmediatamente sin despachar peticiones no autenticadas.
- Se condiciono `fetchProfile` para omitir llamadas remotas con token de invitado.

### D. Tienda de Autenticacion (`auth.store.ts`)
- Se cambio el avatarUrl de `loginAsGuest` para usar `/avatars/koda-classic.svg` en lugar de la ruta obsoleta `/brand/koda-mascot-cartoon-2d.svg`.

### E. Purga de Archivos Mock y Temporales
- Se eliminaron:
  - `apps/web/public/brand/koda-mascot-cartoon-2d.svg`
  - `apps/web/public/brand/koda-mascot-cartoon-2d-transparent.png`
  - `apps/web/public/koda-svg/` (directorio completo con 13 archivos temporales)

## 4. Pruebas y Verificacion
- **Pruebas de Renderizado Vectorial**: Conversion de los 6 avatares con `rsvg-convert` a 200x200 y 400x400 completada exitosamente sin advertencias ni artefactos.
- **Tipado TypeScript**: `pnpm --filter web exec tsc --noEmit` completado con 0 errores.
- **Compilacion de Produccion**: `pnpm --filter web build` ejecutado exitosamente con Turbopack (15/15 rutas estaticas generadas).
- **Cero Emojis**: Verificacion exhaustiva sin emojis en codigo ni textos.
