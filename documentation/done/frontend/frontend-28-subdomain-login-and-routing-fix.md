# Entregable Frontend: Correccion de Flujo de Autenticacion y Enrutamiento Multi-Dominio

## Metadatos
- ID: FRONTEND-28
- Titulo: Correccion del flujo de login en subdominio app, delegacion de raiz client-side y alineacion CORS
- Rama: fix/auth-subdomain-login-flow
- Fecha: 20/10/2026
- Autor: Dylan Gamero & Antigravity AI

---

## Diagnostico del Problema
Tras la introduccion de la arquitectura de subdominios (PR #25), se presentaron los siguientes fallos en el flujo de inicio de sesion:
1. Atrapamiento en Landing Page tras autenticacion:
   En Next.js App Router, las navegaciones del lado del cliente (`router.replace('/')` tras iniciar sesion con correo, OAuth o invitado) montan directamente el componente de ruta `apps/web/src/app/page.tsx` sin pasar por las reescrituras HTTP de middleware/proxy (`NextResponse.rewrite('/app')`). Como `page.tsx` renderizaba incondicionalmente `<LandingPageView />`, el estudiante autenticado era dirigido nuevamente a la landing page en lugar del Roadmap interactivo.
2. Enlaces cross-origin rotos con TransitionLink:
   En `CinematicFinale.tsx`, los botones de "Ya tengo una cuenta" (`/login`) y "Empezar mi racha" (`/register`) utilizaban rutas relativas junto con `TransitionLink`. En el dominio raiz, el router de Next.js interceptaba el click (`e.preventDefault()`), enviando una solicitud RSC que recibia un 307 de redireccion hacia el subdominio `app.localhost:3000`, provocando fallos por navegacion cross-origin.
3. Ausencia de enlace de login en el Navbar principal:
   La barra de navegacion superior de la landing solo ofrecia "Comenzar gratis" (`/register`), obligando al usuario recurrente a buscar enlaces secundarios.
4. Rechazo de cookie de sesion por dominio invalido:
   En `domain.ts`, la configuracion `domain=.localhost` era rechazada por politicas de navegadores modernos (RFC 6265) que consideran `localhost` como sufijo protegido.
5. Filtro CORS restrictivo en el backend NestJS:
   `apps/api/src/main.ts` unicamente admitia `localhost` y `127.0.0.1` sin subdominios, impidiendo resoluciones de preflight OPTIONS procedentes de `http://app.localhost:3000` o subdominios de produccion `*.koda.academy`.

---

## Solucion Implementada

### 1. Delegacion Dinamica en apps/web/src/app/page.tsx
- Se agrego deteccion reactiva del host (`isAppHost`).
- Si la solicitud o transicion ocurre en el subdominio de la aplicacion (`app.localhost`, `app.koda.academy`), `page.tsx` renderiza de forma transparente `<AppPage />` (`StudentRoadmapView`), garantizando que cualquier llamada a `router.replace('/')` muestre inmediatamente el Roadmap sin depender del ciclo de reescritura del servidor.
- En el dominio raiz (`localhost:3000`, `koda.academy`), se preserva el renderizado puro de `<LandingPageView />`.

### 2. Estandarizacion de Enlaces con getAppUrl
- En `apps/web/src/components/landing/CinematicFinale.tsx`:
  - Se sustituyeron las rutas relativas `href="/login"` y `href="/register"` por `href={getAppUrl('/login')}` y `href={getAppUrl('/register')}`.
  - Esto activa la condicion de bypass en `TransitionLink`, permitiendo una navegacion nativa del navegador hacia el subdominio de la app.

### 3. Inclusion de "Iniciar sesion" en Navbar
- En `apps/web/src/components/landing/Navbar.tsx`:
  - Para usuarios no autenticados (`!isLoggedIn`), se desplego el boton "Iniciar sesion" junto a "Comenzar gratis", enlazando directamente con `getAppUrl('/login')`.

### 4. Saneamiento de Cookies en apps/web/src/lib/domain.ts
- Se elimino la directiva `domain=.localhost`, aplicando cookies de host estandar con `SameSite=Lax` para desarrollo local y preservando `domain=.${rootDomain}` unicamente para produccion.

### 5. Soporte CORS para Subdominios en apps/api/src/main.ts
- Se actualizo la expresion regular en desarrollo para permitir cualquier subdominio local: `/^http:\/\/(?:[a-zA-Z0-9-]+\.)?(?:localhost|127\.0\.0\.1)(?::\d+)?$/`.
- Se agrego soporte explicito en produccion para subdominios oficiales de Koda: `/^https:\/\/(?:[a-zA-Z0-9-]+\.)?(?:koda\.academy|koda\.app|koda\.com)$/`.

### 6. Actualizacion de Pruebas Unitarias Backend
- En `apps/api/src/application/use-cases/curriculum/curriculum-use-cases.spec.ts`:
  - Se actualizaron las referencias de prueba del curso legado `python-core` a `python-1` para sincronizarlas con la eliminacion del fallback fantasma realizada previamente.

---

## Pruebas de Verificacion
- Typecheck estricto frontend y backend: `pnpm --filter web exec tsc --noEmit` y `pnpm --filter api exec tsc --noEmit` (0 errores).
- Suite de pruebas unitarias NestJS: `pnpm --filter api test` (28 suites pasadas, 102 tests pasados).
- Compilacion de produccion Next.js: `pnpm --filter web build` (Compilado exitosamente en Turbopack).
