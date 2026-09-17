# Changelog: 12-09-2026

- [Saturday]-[12/09/2026]-[16:04]-[Brandon Carranza] : Instalador y lanzador Python multiplataforma (`instalar_recursos.py`, `iniciar_koda.py`): verifica prerrequisitos, compila `@koda/types`, lanza API :4000 + Web :3000 con health-check, abre el navegador y detiene todo con Ctrl+C.
- [Saturday]-[12/09/2026]-[20:56]-[Brandon Carranza] : L1 Hero de la landing (rama `feat/frontend-visual-experience`): eyebrow Python 3.12, subcopy en segunda persona, acento ámbar sólido, grid sutil, `focus-visible`, `reduced-motion`, CTAs lucide con `aria-labels` y mascota `order-first` en móvil con chips XP/racha.
- [Saturday]-[12/09/2026]-[21:02]-[Brandon Carranza] : `iniciar_koda.py` libera puertos 3000/4000 automáticamente (match exacto, reintentos, log de PID); `--forzar` queda como alias y `--no-liberar` conserva el fallo.
- [Saturday]-[12/09/2026]-[21:05]-[Brandon Carranza] : L2 Navbar (links Metodología/Vista previa + CTA Comenzar gratis 44px) y estrella cósmica decorativa con título en español; anchor `#vista-previa`.
- [Saturday]-[12/09/2026]-[21:13]-[Brandon Carranza] : El logo del sidebar del roadmap vuelve a la landing (`/?landing=true` respetado por `page.tsx` con y sin sesión).
- [Saturday]-[12/09/2026]-[21:15]-[Brandon Carranza] : L3 Preview como mini-lección real (`MiniLessonPreview`: pregunta `print()`, radiogroup, Comprobar, pista sin spoiler, éxito +5XP con CTA); comparativa compacta y FreeTier con acento sólido.
- [Saturday]-[12/09/2026]-[21:17]-[Brandon Carranza] : L4 Metodología con ritmo (pilares Pilar 1-4, LiveCode con lado alterno, acentos sólidos, iconos lucide, `once:true`, fuera tintes purple/blue).
- [Saturday]-[12/09/2026]-[21:18]-[Brandon Carranza] : L5 CTA/Footer/InfoModal/SEO (lucide, `role=dialog`, cierre 44px, OG a `icon.png` existente con TODO para `og-image` 1200x630).
- [Saturday]-[12/09/2026]-[21:20]-[Brandon Carranza] : Migración restante de iconos landing a lucide (info-modal, selector/Dropdown de idioma, categorías); tabler queda solo en brands, roadmap y auth.
- [Saturday]-[12/09/2026]-[21:35]-[Brandon Carranza] : S1 Lenis smooth scroll solo en landing (`LenisProvider`, anchors `#` con offset -80, helper `scrollToId`, respeta `reduced-motion`); lockfile regenerado.
