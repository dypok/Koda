# Entregable Frontend: Transferencia de Hash OAuth a Subdominio App y Flujo de Autenticacion

## Metadatos
- ID: FRONTEND-29
- Titulo: Transferencia automatica de tokens OAuth en hash fragment hacia el subdominio app y aprovisionamiento de sesion
- Rama: feat/frontend-auth-oauth-subdomain-flow
- Fecha: 20/10/2026
- Autor: Dylan Gamero & Antigravity AI

---

## Diagnostico del Problema
Al completar el inicio de sesion con proveedores OAuth (Google o GitHub), el usuario era redirigido por Supabase Auth a la URL configurada como Site URL del proyecto (`http://localhost:3000/#access_token=...&refresh_token=...&token_type=bearer`).

Se presentaron los siguientes inconvenientes tecnicos:
1. Fragmento de hash invisible para el servidor HTTP:
   Los navegadores web no transmiten los fragmentos de hash (`#...`) en los encabezados de solicitudes HTTP. Por lo tanto, el proxy/middleware de Next.js en `localhost:3000` solo recibia `GET /`, sirviendo la Landing Page (`LandingPageView`) en lugar de redirigir al subdominio `app.localhost:3000`.
2. Aislamiento de almacenamiento local (localStorage):
   `localStorage` se encuentra particionado de forma estricta por origen (`protocolo + dominio + puerto`). Como la plataforma de aprendizaje y el Roadmap operan en `http://app.localhost:3000`, los tokens no podian ser consumidos ni guardados desde el origen `http://localhost:3000`.
3. Ausencia de captura del hash en la raiz:
   `apps/web/src/app/page.tsx` no evaluaba `window.location.hash`, dejando al estudiante atrapado en la landing page con sus credenciales expuestas en la barra de direcciones sin procesar.
4. Perdida de fragmentos en navegaciones client-side:
   Al ingresar al subdominio sin sesion activa, `apps/web/src/app/app/page.tsx` ejecutaba `router.replace('/login')`, lo que descartaba el fragmento de hash si la URL ya contenia el token.
5. Botones CTA de la Landing con enlaces relativos:
   Varios componentes de marketing (`AnnouncementBar`, `StickyMobileCta`, `PricingSection`, `CertificateSection`, `MiniLessonPreview`) poseian rutas relativas `href="/register"`, provocando intentos de navegacion client-side que requerian redirecciones 307 cruzadas.

---

## Solucion Implementada

### 1. Deteccion y Transferencia Reactiva en apps/web/src/app/page.tsx
- Se agrego deteccion temprana en el estado inicial del cliente mediante lazy initialization:
  ```tsx
  const [isRedirectingOAuth, setIsRedirectingOAuth] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      return Boolean(hash && (hash.includes('access_token=') || hash.includes('error=')));
    }
    return false;
  });
  ```
- Si se detecta un hash con `access_token` o `error` en el dominio raiz (`localhost:3000` o `koda.academy`), se despliega de inmediato `<KodaLoadingScreen>` con el estado "Transfiriendo credenciales a la plataforma de aprendizaje..." y se ejecuta `window.location.replace(getAppUrl('/login' + hash))`.
- Si la solicitud ya se encuentra en el subdominio `app`, se transfiere limpiamente a `/login` preservando el hash.

### 2. Aprovisionamiento y Limpieza de Hash en apps/web/src/views/login/LoginForm.tsx
- Se activo la captura de `access_token` y `refresh_token` directamente en el subdominio `app.localhost:3000`.
- Se agrego integracion con `koda_pending_onboarding` para completar automaticamente el registro de estudiantes que iniciaron el flujo desde el onboarding antes de autenticarse con OAuth.
- Se invoca `AuthService.verifySession(accessToken)` para aprovisionar y recuperar el perfil completo en PostgreSQL mediante el backend NestJS.
- Se persisten los tokens en el `localStorage` del origen `app.localhost:3000` mediante `setUserSession`.
- Se ejecuta `window.history.replaceState(null, '', window.location.pathname)` para limpiar inmediatamente los tokens sensibles de la barra de direcciones.
- Se agrego gestion de errores de proveedores OAuth (`error_description` y `error`) para mostrar retroalimentacion clara si el usuario cancela la autorizacion.
- Tras la autenticacion exitosa, se navega a `/` (el cual en el subdominio renderiza de forma transparente `AppPage` y `StudentRoadmapView`).

### 3. Preservacion de Fragmento Hash en apps/web/src/app/app/page.tsx
- Al validar la hidratacion de sesion, si `!isAuthenticated` y `window.location.hash` contiene tokens OAuth, se preserva el hash al redirigir: `router.replace('/login' + hash)`.

### 4. Parametrizacion Estandar en AuthService.getOAuthRedirectUrl
- En `apps/web/src/services/auth/auth.service.ts`, se estandarizo el parametro `redirectTo` por defecto utilizando `getAppUrl('/login')`, apuntando explicitamente al subdominio de la aplicacion.
- En `apps/web/src/app/register/page.tsx`, se empleo `getAppUrl('/register')` como destino de retorno para registrar las preferencias del stepper.

### 5. Enlaces Absolutos de Marketing con getAppUrl
- Se actualizaron los botones CTA de registro en la Landing Page para utilizar `getAppUrl('/register')`:
  - `apps/web/src/components/landing/AnnouncementBar.tsx`
  - `apps/web/src/components/landing/StickyMobileCta.tsx`
  - `apps/web/src/views/landing/conversion/PricingSection.tsx` (planes Free y Premium)
  - `apps/web/src/views/landing/conversion/CertificateSection.tsx`
  - `apps/web/src/views/landing/preview/MiniLessonPreview.tsx`

### 6. Eliminacion del Boton de Acceso sin Cuenta
- Se elimino el boton "Entrar sin cuenta" (`handleGuest` / `loginAsGuest`) y su icono `UserCircle` de `apps/web/src/views/login/LoginForm.tsx`, requiriendo autenticacion formal (correo/clave o proveedor social OAuth) para acceder a la plataforma.

---

## Pruebas de Verificacion
- Typecheck estricto frontend: `pnpm --filter web exec tsc --noEmit` (0 errores).
- Compilacion de produccion Next.js Turbopack: `pnpm --filter web build` (Compilado exitosamente en 7.0s, 16 rutas estaticas generadas).
- Suite de pruebas unitarias backend NestJS: `pnpm --filter api test` (28 suites pasadas, 102 tests pasados).
