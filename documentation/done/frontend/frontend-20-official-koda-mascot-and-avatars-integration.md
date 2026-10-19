# Entregable Frontend 20: Integracion de Mascota Oficial Koda y Avatares Vectoriales

## 1. Resumen Ejecutivo
Se integro la mascota oficial de Koda y los 8 avatares vectoriales provistos por el equipo de diseno en `apps/web/public/koda-svg/`, reemplazando de forma definitiva las ilustraciones mock generadas con IA (`/brand/koda-mascot-cartoon-2d.svg` de 769 KB y su PNG asociado). Se normalizaron las coordenadas de mesa de trabajo de 6 avatares con desfase de exportacion y se desarrollo el componente centralizado `<KodaMascot />` con soporte tipado para 5 estados emocionales (`idle`, `sad`, `thinking`, `streak_lost`, `streak_active`), animacion accesible (`useReducedMotion` / `motion-reduce:animate-none`), efecto de brillo adaptativo y cero emojis.

## 2. Diagnostico y Descubrimientos Tecnicos
1. **Desfase de Mesa de Trabajo en Avatares Vectoriales**:
   - 6 de los 8 archivos SVG provistos (`bases zorrito.svg`, `Gamer zorrito.svg`, `recurso 2.svg`, `zorrito detective.svg`, `Zorrito espacial.svg`, `zorrito HACKER.svg`) fueron exportados con una mesa de trabajo panoramica de `2009.28 x 1137.29`, ubicando la medalla circular hacia el extremo derecho (`cx ≈ 1685.86 - 1687.28`, `cy ≈ 525.29 - 525.32`, `r = 206.57`).
   - Al renderizarse sin calibracion, el avatar se mostraba diminuto y descentrado.
   - **Solucion aplicada**: Se recalibro el atributo `viewBox` de cada archivo al bounding box exacto del badge (`1479.29 318.75 413.14 413.14` y `1480.71 318.72 413.14 413.14`), logrando un renderizado circular centrado y sin artefactos en cualquier escala.
2. **5 Estados Emocionales y Funcionales de la Mascota**:
   - `Zorrito original.svg` -> `idle`: Pose base neutral con gafas rojas, pajarita marron y cola llameante.
   - `zorritos 2.svg` -> `sad`: Lagrima azul y mirada triste para errores 404, 500 y evaluaciones desaprobadas.
   - `zorrito 3.svg` -> `thinking`: Brazos cruzados y mirada analitica para evaluacion de codigo, espera y modales.
   - `zorrito 4.svg` -> `streak_lost`: Lagrimas dobles y llama apagada color ceniza para perdida o riesgo de racha.
   - `zorrito 5svg.svg` -> `streak_active`: Ojos de estrella y llama naranja/dorada ardiente para racha activa del dia y aprobacion.

## 3. Estructura y Distribucion de Assets

### A. Estados de la Mascota Oficial (`apps/web/public/brand/mascot/`)
- `koda-idle.svg`
- `koda-sad.svg`
- `koda-thinking.svg`
- `koda-streak-lost.svg`
- `koda-streak-active.svg`
- **Fallback retrocompatible**: `apps/web/public/brand/koda-mascot-cartoon-2d.svg` actualizado con el SVG oficial `koda-idle.svg`, y renderizado PNG transparente `koda-mascot-cartoon-2d-transparent.png` a 800px.

### B. Avatares Oficiales Normalizados (`apps/web/public/avatars/`)
- `koda-classic.svg` (Recurso 3.svg)
- `koda-alchemist.svg` (Recurso 1.svg)
- `koda-detective.svg` (zorrito detective.svg normalizado)
- `koda-astronaut.svg` (Zorrito espacial.svg normalizado)
- `koda-hacker.svg` (zorrito HACKER.svg normalizado)
- `koda-sensei.svg` (bases zorrito.svg normalizado)
- `koda-cyberpunk.svg` (recurso 2.svg normalizado)
- `koda-gamer.svg` (Gamer zorrito.svg normalizado)

## 4. Componente Centralizado `<KodaMascot />`
Ubicado en `apps/web/src/components/brand/KodaMascot.tsx`:
- Props tipadas: `state` (`idle` | `sad` | `thinking` | `streak_lost` | `streak_active`), `size`, `width`, `height`, `animate` (`float` | `bounce` | `pulse` | `none`), `glow` (drop-shadow adaptativo al color del estado), `priority`, `fill`, `className`.
- Clases de animacion respetuosas con accesibilidad (`motion-reduce:animate-none`).

## 5. Componentes y Vistas Actualizadas
- **`HeroMascot.tsx`**: Mascota oficial en estado `idle` con animacion de flotacion y resplandor ambar.
- **`CinematicFinale.tsx`**: Mascota en estado `streak_active` celebrando el inicio de la racha.
- **`ExitIntentModal.tsx`**: Mascota en estado `thinking` y remocion de emojis en textos.
- **`KodaGuide.tsx`**: Mascota en estado `idle` como acompanante de navegacion en scroll de escritorio.
- **`KodaPeek.tsx`**: Mascota en estado `thinking` como easter egg entre secciones.
- **`not-found.tsx` (404)**: Mascota en estado `sad` reflejando el extravio fuera del roadmap.
- **`error.tsx` (500)**: Mascota en estado `sad` disculpandose por el tropiezo con un bug.
- **`koda-loading-screen.tsx`**: Mascota en estado `idle` en transiciones fluidas de autenticacion y ruta.
- **`DiagnosticResultModal.tsx`**: Mascota en estado `streak_active` si exonera modulos o `idle` si parte desde cero. Reemplazo de emojis de estrellas por iconos vectoriales `Star` de Phosphor.
- **`onboarding/page.tsx`**: Mascota en estado dinamico en el cierre del diagnostico interactivo.
- **`StepLayout.tsx` & `LanguageSelectionStep.tsx`**: Mascota oficial en cabeceras de registro y onboarding.
- **`ProfileStep.tsx` & `RegisterOtpModal.tsx`**: Mascota oficial en pasos de formulario y verificacion OTP.
- **`RegisterSuccessModal.tsx`**: Mascota en estado `streak_active` celebrando la creacion exitosa de perfil.
- **`RoadmapStreakPopover.tsx`**: Cabecera enriquecida con `KodaMascot` en estado `streak_active` cuando la racha esta al dia, o `streak_lost` si no se ha practicado.
- **`evaluaciones/resumen/[attemptId]/page.tsx`**: Mascota en estado `streak_active` si la evaluacion fue aprobada, o `sad` si fue reprobada.
- **`PartyMode.tsx` & `StudentDashboardView.tsx`**: Sustitucion de emojis restantes por el componente oficial de la mascota.

## 6. Pruebas y Verificacion
- **Renderizado de Vectores**: Pruebas con `rsvg-convert` en los 8 avatares y los 5 estados de mascota completadas exitosamente con codigo 0.
- **Auditoria de Emojis**: Script de busqueda unicode sobre `apps/web/src` confirmando cero emojis en el codigo fuente.
- **Verificacion de Tipos**: `pnpm --filter web exec tsc --noEmit` completado con 0 errores.
- **Compilacion de Produccion**: `pnpm --filter web build` exitoso con Turbopack y 15/15 rutas estaticas generadas correctamente.
