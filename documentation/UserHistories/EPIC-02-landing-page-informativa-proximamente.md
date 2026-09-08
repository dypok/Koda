# 🔵 EPIC 2 — Landing Page Informativa y Modo "Próximamente" para Despliegue
`Sprint 1 · v1.0 · Color Jira: Azul Cielo · Código: LAND`

> Esta épica abarca el diseño, desarrollo, interactividad y optimización de la **Landing Page pública de Koda 🦊**, así como el mecanismo de **Modo Próximamente (Coming Soon Gate)** para permitir un despliegue inicial en producción (Vercel / Cloudflare) que capture usuarios tempranos en lista de espera y presente la propuesta de valor antes del acceso libre a la plataforma educativa.

---

### LAND-01 — Construir Hero Section interactivo con Mascota Koda 🦊 en WebGL
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Frontend Lead (Next.js & PixiJS)  
**Rama sugerida:** `feature/landing-hero-koda`

**Historia de usuario:**
> "Como visitante que llega por primera vez a Koda, quiero ver una cabecera atractiva con la propuesta de valor y la mascota interactiva Koda 🦊,
> para entender en menos de 5 segundos de qué trata la plataforma y motivarme a unirme."

**Criterios de aceptación:**
- Propuesta de valor visible: *"Aprende a programar como juegas: micro-lecciones de 2 minutos, práctica inmediata y cero frustración"*.
- Badge de bienvenida: *"Python 3.12 · Plataforma Educativa Gamificada"*.
- Canvas WebGL de PixiJS v7 montado con la mascota 🦊 Koda animada con físicas sutiles de flotación (hover/idle) y reacción al cursor del ratón (`ADR-004`).
- Botón CTA principal: *"Unirme a la Lista de Espera"* (con scroll suave hacia el formulario).
- Botón secundario: *"Ver Plan de Estudios"* (scroll hacia el Roadmap Showcase).
- Totalmente responsive: en móviles, la mascota se ubica elegantemente sobre el título sin desbordar la pantalla.

**Subtasks:**
- [ ] [DISEÑO] Diseñar la distribución del Hero en Figma con la paleta Koda (fondo `#0B0F19`, gradientes violeta/ámbar sutiles).
- [ ] [FRONTEND] Crear el componente `HeroSection.tsx` en `apps/web/src/components/landing/`.
- [ ] [FRONTEND] Integrar el componente `KodaMascot.tsx` en el Hero con contenedor responsive y dimensiones adaptativas.
- [ ] [FRONTEND] Añadir eventos de puntero (pointermove) para que los ojos/orejas de Koda sigan sutilmente la posición del cursor.
- [ ] [FRONTEND] Implementar botones de llamada a la acción (CTA) con micro-animaciones en Tailwind (`hover:scale-105 transition-all`).
- [ ] [TEST] Verificar rendimiento de renderizado a 60 FPS en navegadores Chromium, Safari y Firefox en móvil y escritorio.

**DoD adicional para esta US:**
- El canvas PixiJS se desmonta limpiamente sin fugas de memoria al cambiar de vista.

---

### LAND-02 — Desarrollar sección de Metodología y Diferenciadores Pedagógicos
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Frontend Developer  
**Rama sugerida:** `feature/landing-metodologia-pedagogica`

**Historia de usuario:**
> "Como persona interesada en aprender programación, quiero conocer el método educativo de Koda frente a cursos tradicionales,
> para convencerme de que aquí no sufriré bloqueos cognitivos ni muros de texto aburridos."

**Criterios de aceptación:**
- Sección *"El Método Koda"* con grid de 4 tarjetas destacadas (`24_CONTENT_AUTHORING_GUIDE.md`):
  1. **Micro-Lecciones Atómicas:** Textos concisos de 40 a 70 palabras explicados paso a paso.
  2. **1 Concepto = 1 Desafío Inmediato:** Cero teoría abstracta sin práctica aplicada al instante.
  3. **Feedback Inteligente Sin Spoilers:** Pistas que guían sin regalar la respuesta y repaso formativo de errores.
  4. **Cuaderno de Errores Persistente:** Práctica deliberada de conceptos difíciles con recompensas de XP (+5 XP).
- Cada tarjeta incluye ícono temático, micro-interacción en hover (borde brillante con acento ámbar) y copy persuasivo.
- Comparativa visual rápida: *"Cursos Tradicionales (Muros de texto de 40 min, 90% abandono) vs. Koda (2 min por lección, interactivo a tu ritmo)"*.

**Subtasks:**
- [ ] [FRONTEND] Crear componente `MethodologySection.tsx` en `apps/web/src/components/landing/`.
- [ ] [FRONTEND] Maquetar el grid responsive (1 columna en móvil, 2 en tablet, 4 en desktop).
- [ ] [FRONTEND] Crear tarjetas con fondo translúcido (`bg-slate-900/60 backdrop-blur-sm border border-slate-800`).
- [ ] [FRONTEND] Añadir componente comparativo *"Antes vs. Con Koda"* con badges visuales de frustración vs. éxito.
- [ ] [DOCS] Validar que los textos coincidan exactamente con la filosofía descrita en `01_PROJECT_OVERVIEW.md` §6.

**DoD adicional para esta US:**
- Contrastes de color certificados WCAG AA en modo oscuro.

---

### LAND-03 — Implementar visualizador interactivo del Roadmap de Python 3.12
**Tipo:** Story | **SP:** 5 | **Prioridad:** Alta | **Asignado:** Frontend Lead  
**Rama sugerida:** `feature/landing-roadmap-showcase`

**Historia de usuario:**
> "Como futuro estudiante, quiero explorar la ruta completa de aprendizaje de Python 3.12 antes de registrarme,
> para entender la progresión temática desde principiante hasta la obtención del certificado final."

**Criterios de aceptación:**
- Sección *"Ruta Curricular de Python 3.12"* conectada o hidratada desde `content/languages/python/manifest.json`.
- Visualización de los **12 módulos canónicos** (`PY_MOD_01` a `PY_MOD_12`) en formato timeline/grid interactivo.
- Cada módulo muestra:
  - Número de módulo (`M01` a `M12`) e ícono.
  - Título formativo y resumen de habilidades a dominar.
  - Badge de estado: `Disponible` (M01 Fundamentos y M02 Variables) o `En Roadmap`.
  - Candados secuenciales y cantidad de lecciones/estrellas estimadas.
- Al hacer clic en un módulo, se despliega un modal o panel con el temario resumido (sin revelar respuestas).
- Banner de certificación al final de la ruta: *"Al completar los 12 módulos y el Proyecto Integrador, obtendrás tu Certificado Oficial KODA-PY con código QR verificable"*.

**Subtasks:**
- [ ] [BACKEND/TYPES] Asegurar que el catálogo de módulos esté disponible vía `@koda/types` o importación estática de `manifest.json`.
- [ ] [FRONTEND] Crear componente `CurriculumShowcase.tsx` en `apps/web/src/components/landing/`.
- [ ] [FRONTEND] Implementar tarjetas de módulo con estado visual desbloqueado/bloqueado.
- [ ] [FRONTEND] Crear diálogo modal accesible (con Radix UI o Headless) para inspeccionar el temario de cada módulo.
- [ ] [FRONTEND] Diseñar el nodo final del certificado con previsualización del diploma Koda 🦊.

**DoD adicional para esta US:**
- La visualización es 100% interactiva en cliente sin requerir autenticación de usuario.

---

### LAND-04 — Implementar formulario de Lista de Espera (Waitlist) con Confeti WebGL
**Tipo:** Story | **SP:** 3 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer (Next.js + NestJS/Supabase)  
**Rama sugerida:** `feature/landing-waitlist-form`

**Historia de usuario:**
> "Como visitante entusiasmado con Koda, quiero registrar mi correo en la lista de espera,
> para ser notificado de inmediato cuando la plataforma abra sus puertas y asegurar mi acceso anticipado."

**Criterios de aceptación:**
- Formulario limpio: input de correo electrónico + botón de envío *"Reservar mi Lugar Gratis"*.
- Validación en cliente con feedback inmediato ante emails inválidos o vacíos.
- Endpoint seguro en backend: `POST /api/v1/waitlist` con rate limiting (máximo 3 envíos por IP por minuto para evitar spam).
- Persistencia en tabla `waitlist_leads` (o archivo estructurado en Supabase): almacena `email`, `created_at`, `user_agent` y `referrer`.
- Deduplicación transparente: si el correo ya existe, confirma el registro sin arrojar error agresivo.
- Feedback de celebración: al registrarse con éxito, PixiJS dispara una explosión de confeti en pantalla y muestra tarjeta con número de puesto simbólico y mensaje de bienvenida.

**Subtasks:**
- [ ] [BD] Crear tabla `waitlist_leads` en Supabase con columnas: `id (UUID)`, `email (VARCHAR UNIQUE)`, `created_at (TIMESTAMPTZ)`, `ip_hash (VARCHAR)`.
- [ ] [BACKEND] Crear módulo `WaitlistModule` en `apps/api/src/modules/waitlist/` con controlador, servicio y DTO de validación (`class-validator`).
- [ ] [BACKEND] Proteger endpoint con decorador de Rate Limiting en NestJS.
- [ ] [FRONTEND] Crear componente `WaitlistForm.tsx` con estados: `idle`, `loading`, `success`, `error`.
- [ ] [FRONTEND] Disparar efecto de confeti acelerado de PixiJS (`Mascota Confetti Engine`) en el estado `success`.
- [ ] [FRONTEND] Guardar bandera en `localStorage` (`koda_waitlist_registered=true`) para recordar al usuario su registro previo.

**DoD adicional para esta US:**
- Endpoint probado en `/api/docs` de Swagger y envío verificado de extremo a extremo desde la UI.

---

### LAND-05 — Implementar Modo "Próximamente" (Coming Soon Gate) para Despliegue Inicial
**Tipo:** Story | **SP:** 3 | **Prioridad:** Muy Alta | **Asignado:** DevOps & Frontend Lead  
**Rama sugerida:** `feature/coming-soon-gate`

**Historia de usuario:**
> "Como equipo de producto, queremos habilitar un interruptor de 'Modo Próximamente' para el despliegue en Vercel,
> para poder publicar el dominio web oficial con la landing informativa mientras protegemos las rutas internas del curso en desarrollo."

**Criterios de aceptación:**
- Controlado mediante variable de entorno: `NEXT_PUBLIC_COMING_SOON_MODE=true`.
- Middleware de Next.js (`apps/web/src/middleware.ts`):
  - Permite acceso irrestricto a `/` (Landing Page), `/api/*`, `/icons/*` y recursos estáticos.
  - Si un visitante intenta ingresar directamente a `/app`, `/dashboard`, `/learn/*`, `/login` o `/admin`, es redirigido a `/` con el parámetro `?notice=coming-soon`.
- Banner informativo superior elegante (dismissible): *"🦊 Koda está en fase final de calibración pedagógica. Inscríbete en la lista de espera para el lanzamiento de Python 3.12."*
- Componente Countdown / Contador regresivo o indicador de estado: *"Próximo Lanzamiento Oficial · Q4 2026"*.
- Cuando `NEXT_PUBLIC_COMING_SOON_MODE=false`, el acceso a la plataforma fluye con total normalidad.

**Subtasks:**
- [ ] [FRONTEND] Crear o actualizar `apps/web/src/middleware.ts` para evaluar la bandera `COMING_SOON_MODE`.
- [ ] [FRONTEND] Crear componente `ComingSoonBanner.tsx` en la cabecera de la aplicación.
- [ ] [FRONTEND] Implementar modal/toast informativo si el usuario fue redirigido por intentar ingresar a una ruta protegida.
- [ ] [CONFIG] Añadir `NEXT_PUBLIC_COMING_SOON_MODE=true` en `apps/web/.env.example` y documentar su comportamiento.
- [ ] [TEST] Verificar que con la bandera en `true` no es posible acceder al árbol educativo `/app/` y con `false` el acceso es libre.

**DoD adicional para esta US:**
- Verificado tanto en entorno local (`localhost:3000`) como en preview build de Next.js (`next build && next start`).

---

### LAND-06 — Implementar sección de Preguntas Frecuentes (FAQ) y Footer Institucional
**Tipo:** Story | **SP:** 2 | **Prioridad:** Media | **Asignado:** Frontend Developer  
**Rama sugerida:** `feature/landing-faq-footer`

**Historia de usuario:**
> "Como usuario interesado, quiero leer una sección de preguntas frecuentes y acceder a los enlaces institucionales al final de la página,
> para resolver dudas sobre el costo, los certificados y la validez pedagógica de Koda."

**Criterios de aceptación:**
- Acordeón interactivo accesible con mínimo 6 preguntas clave (`10_INFORMATION_ARCHITECTURE.md`, `18_MONETIZATION.md`):
  1. *¿Necesito saber matemáticas o tener experiencia previa en programación?* (No, Koda inicia desde cero absoluto).
  2. *¿Por qué Python 3.12 es el primer lenguaje de la plataforma?* (Máxima demanda laboral, versatilidad en IA/Web y sintaxis limpia).
  3. *¿La plataforma es gratuita?* (El acceso al MVP y las lecciones es 100% gratuito).
  4. *¿Cómo funcionan los certificados emitidos?* (Diploma digital con código único `KODA-PY-{SEQ}` y QR verificable en tiempo real).
  5. *¿Cuánto tiempo toma cada lección?* (Micro-sesiones de 2 a 3 minutos diseñadas para crear hábito diario).
  6. *¿Cómo garantizan que realmente aprenda y no solo adivine opciones?* (Sistema formativo con opciones barajadas, rondas de repaso y cuaderno de errores).
- Footer completo con:
  - Logotipo de Koda con la mascota 🦊.
  - Enlaces a documentación técnica pública (`docs/README.md`), repositorio GitHub y canal de Discord/Comunidad.
  - Enlace al verificador público de certificados (`/verificar`).
  - Copyright, aviso de privacidad y términos de servicio conformes con la protección de datos personales (`19_SECURITY.md`).

**Subtasks:**
- [ ] [FRONTEND] Crear componente `FaqSection.tsx` utilizando acordeón accesible (animación de apertura fluida en CSS/Tailwind).
- [ ] [FRONTEND] Redactar las 6 respuestas con tono empático y motivador acorde al manual de marca.
- [ ] [FRONTEND] Crear componente `Footer.tsx` con navegación a secciones internas (`#metodologia`, `#roadmap`, `#waitlist`, `#faq`).
- [ ] [FRONTEND] Añadir enlace al portal de verificación de certificados (`/verificar`).
- [ ] [TEST] Verificar accesibilidad del acordeón mediante navegación por teclado (teclas `Tab`, `Enter`, `Espacio`).

**DoD adicional para esta US:**
- Validación HTML5 semántica y libre de errores de contraste.

---

### LAND-07 — Optimizar SEO, OpenGraph, Rendimiento Lighthouse 95+ y Responsive
**Tipo:** Story | **SP:** 2 | **Prioridad:** Alta | **Asignado:** Frontend Lead & DevOps  
**Rama sugerida:** `feature/landing-seo-performance`

**Historia de usuario:**
> "Como estratega de crecimiento de Koda, quiero que la Landing Page tenga metadatos OpenGraph optimizados y cargue en menos de 1 segundo,
> para maximizar la tasa de conversión cuando el enlace sea compartido en redes sociales (Twitter, LinkedIn, Discord)."

**Criterios de aceptación:**
- Metadatos completos configurados vía Next.js Metadata API en `app/layout.tsx` y `app/page.tsx`:
  - `title`: *"Koda 🦊 — Aprende a Programar en Python desde Cero sin Frustración"*.
  - `description`: *"Plataforma interactiva y gamificada para dominar Python 3.12 con micro-lecciones atómicas de 2 minutos, práctica inmediata y certificación verificable."*.
  - Tarjetas de Twitter (`summary_large_image`) y OpenGraph con preview visual de la mascota Koda 🦊.
- Archivos estándar presentes en `public/`: `favicon.ico`, `favicon.svg`, `robots.txt`, `sitemap.xml` y `og-image.png`.
- Puntuación de Google Lighthouse en producción:
  - **Performance:** $\ge 95$
  - **Accessibility:** $\ge 98$
  - **Best Practices:** $100$
  - **SEO:** $100$
- Peso inicial del bundle HTML/CSS transferido inferior a 150 KB gzipped.

**Subtasks:**
- [ ] [SEO] Generar metadatos dinámicos y OpenGraph tags en `apps/web/src/app/layout.tsx`.
- [ ] [DISEÑO/ASSETS] Crear asset gráfico `og-image.png` (1200x630px) con la mascota Koda 🦊 y branding oficial en `apps/web/public/`.
- [ ] [SEO] Crear `apps/web/src/app/robots.ts` y `apps/web/src/app/sitemap.ts` automáticos de Next.js.
- [ ] [PERFORMANCE] Optimizar carga de fuentes tipográficas usando `next/font` con subsets latinos (`Inter` o `Geist`).
- [ ] [PERFORMANCE] Configurar carga diferida (lazy loading / dynamic import con `ssr: false`) para el motor PixiJS WebGL de modo que no bloquee el First Contentful Paint (FCP).
- [ ] [TEST] Ejecutar auditoría Lighthouse en modo incógnito sobre el build de producción y validar métricas Core Web Vitals (LCP < 1.5s, CLS < 0.05).

**DoD adicional para esta US:**
- Reporte Lighthouse adjunto con scores en verde (≥ 95) en todas las categorías evaluadas.
