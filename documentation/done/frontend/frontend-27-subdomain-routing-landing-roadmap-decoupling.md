# Entregable Frontend: Desacoplamiento de Landing Page (Dominio Raíz) y Roadmap (Subdominio App)

## 📌 Metadatos
- **ID:** `FRONTEND-27`
- **Título:** Desacoplamiento de Landing Page en dominio principal y plataforma de aprendizaje en subdominio app (`app.`)
- **Rama:** `feat/frontend-subdomain-app-routing` (hija directa de `develop` actualizada)
- **Fecha:** 20/10/2026
- **Autor:** Dylan Gamero & Antigravity AI

---

## 🎯 Objetivo y Problema Resuelto
Anteriormente, `apps/web/src/app/page.tsx` combinaba condicionalmente la Landing Page (`LandingPageView`) y el Roadmap (`StudentRoadmapView`) en la misma ruta raíz (`/`). Si el usuario alguna vez iniciaba sesión, la bandera `hasEverLoggedIn` le prohibía volver a ver la Landing Page en la dirección normal (`localhost:3000` o `koda.com`), redirigiéndolo forzosamente a `/login` o al Roadmap.

Con esta implementación:
1. **Dominio Principal / Normal (`localhost:3000` / `koda.com`):** Sirve de forma incondicional, limpia y sin pantallas de carga la **Landing Page**. Nunca secuestra la vista del usuario ni le bloquea el acceso al marketing o precios.
2. **Subdominio de la App (`app.localhost:3000` / `app.koda.com` o `.app`):** Aloja la plataforma de aprendizaje del estudiante, sirviendo el Roadmap interactivo en `/`, cursos en `/curso/*`, perfil en `/perfil` y los flujos de autenticación.
3. **Mismo Despliegue (1 solo Deploy):** Todo funciona sobre una única instancia de Next.js 16 mediante reescrituras internas transparentes en `src/proxy.ts` basadas en el encabezado HTTP `Host`.

---

## 🛠️ Archivos Creados y Modificados

### 1. `apps/web/src/lib/domain.ts` (Nuevo)
- Implementa `isAppHost(host)` para identificar hosts de la aplicación (`app.*`, `*.app`, `app.localhost`).
- Implementa `getAppBaseUrl(currentHost)` y `getRootBaseUrl(currentHost)` preservando dinámicamente puertos locales (`:3000`, `:3005`, etc.) y respetando dominios de producción.
- Implementa `getAppUrl(path, currentHost)` para links cross-domain.
- Implementa `setSessionCookie(active)` y `hasSessionCookie()` para sincronizar el estado de sesión entre el subdominio y el dominio raíz vía cookies de dominio compartido.

### 2. `apps/web/src/proxy.ts` (Modificado)
- En el dominio raíz (`!isApp`):
  - Permite acceso a `/`, previews y marketing.
  - Redirige mediante HTTP 307 al subdominio de la app si el usuario intenta acceder a rutas protegidas o de estudiante (`/app/*`, `/curso/*`, `/perfil`, `/login`, `/register`, `/onboarding`, etc.).
- En el subdominio de la app (`isApp`):
  - Reescritura interna (`NextResponse.rewrite`): `/` y `/ruta` $\rightarrow$ `/app` (sirve `StudentRoadmapView` con URL limpia `app.localhost:3000/`).
  - Reescritura interna: `/perfil` $\rightarrow$ `/app/perfil`.
  - Deja pasar directamente `/login`, `/register`, `/onboarding`, `/evaluaciones` y assets.

### 3. `apps/web/src/app/page.tsx` (Modificado)
- Limpieza total: Eliminada la lógica condicional de `hasEverLoggedIn` e `isAuthenticated`.
- Renderiza de forma pura, instantánea y sin pantallas de carga `<LandingPageView />`.

### 4. `apps/web/src/app/app/page.tsx` (Nuevo)
- Aloja el punto de entrada de la aplicación en el subdominio.
- Verifica autenticación con `useAuthStore`: si no está logueado, redirige a `/login`; si no completó onboarding, redirige a `/register`; si está autenticado, renderiza `<StudentRoadmapView />`.

### 5. `apps/web/src/components/ui/transition-link.tsx` (Modificado)
- Añadido soporte para enlaces cross-origin (`http://`, `https://`, `//`) evitando que `router.push` intercepte navegaciones externas entre subdominios.

### 6. `apps/web/src/components/landing/Navbar.tsx` & `HeroCtaGroup.tsx` (Modificados)
- Actualizados para enlazar con `getAppUrl()`.
- Detección reactiva de sesión con `hasSessionCookie()`: si el estudiante ya tiene sesión activa, el Navbar y el Hero muestran "Ir a mi Roadmap" / "Continuar aprendiendo" en lugar de "Iniciar sesión".

### 7. `apps/web/src/stores/auth.store.ts` (Modificado)
- Sincroniza la cookie de sesión en `initAuth`, `setUserSession`, `loginAsGuest` y `logout`.

---

## 🧪 Pruebas de Verificación Ejecutadas

```bash
# 1. Petición al dominio raíz (debe servir Landing Page con 200 OK)
curl -s -I -H "Host: localhost:3005" http://localhost:3005/
# -> HTTP/1.1 200 OK (Content-Length: ~279KB)

# 2. Petición a /login en dominio raíz (debe redirigir 307 a app.localhost:3005/login)
curl -s -I -H "Host: localhost:3005" http://localhost:3005/login
# -> HTTP/1.1 307 Temporary Redirect (location: http://app.localhost:3005/login)

# 3. Petición al subdominio app (debe reescribir a /app y servir Roadmap con 200 OK)
curl -s -I -H "Host: app.localhost:3005" http://localhost:3005/
# -> HTTP/1.1 200 OK (x-middleware-rewrite: /app)

# 4. Petición a /login en subdominio app (debe servir página de login con 200 OK)
curl -s -I -H "Host: app.localhost:3005" http://localhost:3005/login
# -> HTTP/1.1 200 OK

# 5. Petición a /perfil en subdominio app (debe reescribir a /app/perfil con 200 OK)
curl -s -I -H "Host: app.localhost:3005" http://localhost:3005/perfil
# -> HTTP/1.1 200 OK (x-middleware-rewrite: /app/perfil)

# 6. Petición a curso en dominio raíz vs subdominio app
curl -s -I -H "Host: localhost:3005" http://localhost:3005/curso/python-1/seccion/py-m01
# -> HTTP/1.1 307 Temporary Redirect (location: http://app.localhost:3005/curso/python-1/seccion/py-m01)
curl -s -I -H "Host: app.localhost:3005" http://localhost:3005/curso/python-1/seccion/py-m01
# -> HTTP/1.1 200 OK

# 7. Compilación TypeScript y Turbopack
pnpm --filter web exec tsc --noEmit # -> 0 errores
pnpm --filter web build            # -> Compiled successfully in 3.5s
```
