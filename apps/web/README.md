# 💻 Koda Web Client (`apps/web`) 🦊

> Aplicación web construida con **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, **Zustand**, **Lenis**, **GSAP ScrollTrigger**, **Three.js** y **framer-motion**.

Rutas actuales: `/` (landing con override `?landing=true` / preview `?roadmap=true`), `/login`, `/register` (wizard 5 pasos —o 3 con `?v=express`— con `SelectableCard` + `StepLayout`, terminal de idiomas, persistencia y fondo vivo). Ver mapa completo de pantallas en `docs/02-requisitos-ux/10_INFORMATION_ARCHITECTURE.md`.

---

## 🎨 Estructura del frontend

- **`src/app/`**: `layout.tsx` (fuentes `swap+latin`, metadata OG), `page.tsx` (landing: Navbar → Hero → GiantMarquee → Preview → Metodología → Testimonios → WorldMap → Pricing → Certificado → Finale → Footer), `not-found.tsx`, `error.tsx`.
- **`src/components/landing/`**: Navbar, HeroSection (+ `HeroSkyBackground` canvas 2D, `CosmicBackground` Three.js full-page, `LightBeams`, `LenisProvider`, `ScrollProgress`, `RouteThread`, `ActTheme`, `KodaGuide`, `GlowParallax`, `Preloader`, `AuroraProvider`, `PartyMode`, `AnnouncementBar`, `StickyMobileCta`, `ExitIntentModal`, `GiantMarquee`, `WaveDivider`, `KodaPeek`, `CinematicFinale`, `InfoModal`, `Footer`, `LanguageSelector`).
- **`src/views/landing/`**: `hero/` (CTA, mascota, typewriter), `preview/` (demo `MiniLessonPreview` + `CodeConfetti`), `methodology/` (Hub, `PillarStrip`, 4 pilares), `conversion/` (testimonios, pricing, certificado, racha, mapa), `info-modal/` (tabs + sidebar), `skill-tree/` (SVG vivo).
- **`src/components/ui/`**: `gradient-button`, `magnetic`, `split-text`, `highlight`, `transition-link`, `animated-counter` (odómetro), `glare-hover`, `click-spark`.
- **`src/lib/`**: `utils (cn)`, `scroll` (Lenis + `scrollToId`), `gsap` (registro único), `sound` (WebAudio opt-in), `i18n` (ES/EN hero).
- **`src/stores/`**: `auth.store.ts` (mock con `localStorage`), `roadmap.store.ts` (pan/zoom 50-200 + datasets); `src/services/roadmap/` con fallback a mocks.
- **`src/models|controllers/landing/`**: datos y lógica de la landing (sky, `cosmic-field`, metodología, techs, idiomas, footer, info-modal).

Fondo 3D: `CosmicBackground` (3.500/1.200/700 partículas, twinkle shader, dolly + warp por Lenis, `UnrealBloomPass` lazy, guardián de fps con relevo 2D). Todo el motion respeta `prefers-reduced-motion`.

Iconografía: **lucide-react** (tabler solo en brands/roadmap/auth pendientes de migrar). Mascota Koda: framer-motion (PixiJS diferido, ver `ADR-004`).

---

## 🚀 Comandos de ejecución

Desde la raíz del monorepo o dentro de `apps/web`:

```bash
# Servidor de desarrollo Next.js (Puerto 3000)
pnpm --filter web dev

# Compilación optimizada para producción
pnpm --filter web build

# Iniciar servidor de producción
pnpm --filter web start

# Chequeo de tipos
pnpm --filter web exec tsc --noEmit
```

Arranque recomendado del repo completo: `python scripts/iniciar_koda.py` (libera :3000/:4000 solo, ver `scripts/iniciar_koda.py`).

---

## 🔗 Dependencias Internas

Este paquete consume contratos TypeScript tipados directamente desde el monorepo mediante `@koda/types` (`workspace:*`).
Antes de compilar la web por primera vez, asegúrate de haber compilado los tipos:

```bash
pnpm --filter "@koda/types" build
```

Bitácora de cambios de la landing en `documentation/changelog/12-09-2026-changelog.md` y `13-09-2026-changelog.md`.
