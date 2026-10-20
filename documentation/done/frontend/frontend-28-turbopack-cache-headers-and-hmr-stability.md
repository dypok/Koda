# Entregable Frontend: Estabilización de Runtime Turbopack y Calibración de Cabeceras de Caché

## 📌 Metadatos
- **ID:** `FRONTEND-28`
- **Título:** Solución a error de runtime Turbopack (Module factory is not available / Stale Cache) y calibración de Cache-Control
- **Rama:** `feat/frontend-cache-headers-and-hmr-runtime-fix` (hija directa de `develop`)
- **Fecha:** 20/10/2026
- **Autor:** Dylan Gamero & Antigravity AI

---

## 🎯 Causa Raíz Identificada
El usuario experimentaba dos errores en tiempo de ejecución:
1. `react-jsx-dev-runtime.js [app-ssr] was instantiated because it was required from module StudentRoadmapView.tsx [app-ssr], but the module factory is not available.`
2. `react-jsx-dev-runtime.js [app-ssr] was instantiated because it was required from module koda-loading-screen.tsx [app-ssr], but the module factory is not available.`

### Diagnóstico Técnico:
1. **Desincronización de Versión de Next.js y Proceso Zombie:**
   - En el sistema se encontraba en ejecución desde el 19 de octubre el proceso PID `2524057` bajo `Next.js 16.4.0 (Turbopack)`.
   - Tras actualizarse el repositorio y dependencias a `Next.js 16.4.2`, y tras la fusión de los PRs #25 y #26, los módulos físicos de `16.4.0` en `.pnpm` quedaron desvinculados, provocando que la fábrica de módulos en memoria fallara al resolver los JSX runtimes durante el SSR.
2. **Intercepción Indiscriminada de Cabeceras de Seguridad en `next.config.mjs`:**
   - La regla `source: '/(.*)'` aplicaba cabeceras restrictivas sobre todos los recursos, incluyendo los chunks estáticos de Next.js (`/_next/static/chunks/...`) e interfaces HMR.
   - Esto impedía la revalidación normal de scripts por parte del navegador.

---

## 🛠️ Solución Implementada

### 1. `apps/web/next.config.mjs`
- **Exclusión de recursos internos:** Se restringieron las cabeceras para que no afecten a `_next/static`, `_next/image` ni favicons:
  ```javascript
  source: '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|icon.png).*)'
  ```
- **Cabecera de revalidación explícita para HTML dinámico:**
  ```javascript
  { key: 'Cache-Control', value: 'private, no-cache, no-store, max-age=0, must-revalidate' }
  ```
- **Optimización de paquetes:** Se habilitó `experimental.optimizePackageImports` para `@phosphor-icons/react` y `framer-motion`, reduciendo la carga del grafo de dependencias de Turbopack.

### 2. `apps/web/src/proxy.ts`
- En las respuestas reescritas (`NextResponse.rewrite` hacia `/app` y `/app/perfil`), se inyectó la cabecera `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`.
- Esto garantiza que ningún proxy intermedio ni caché del navegador retenga el HTML reescrito con referencias a chunks de compilaciones anteriores.

### 3. `apps/web/package.json`
- Se incorporaron los scripts de limpieza y reinicio seguro:
  - `"clean": "rm -rf .next .turbo"`
  - `"dev:clean": "rm -rf .next && next dev --turbo -p 3000"`

### 4. Purga del Proceso Zombie y Regeneración de Caché
- Se finalizó el proceso obsoleto `next-server (v16.4.0)`.
- El servidor se relanzó automáticamente bajo la versión activa `Next.js 16.4.2 (Turbopack)` con la caché limpia.

---

## 🧪 Pruebas de Verificación Ejecutadas
- `pnpm --filter web exec tsc --noEmit` $\rightarrow$ **0 errores**.
- `pnpm --filter web build` $\rightarrow$ **Compilado exitosamente en Turbopack (16/16 páginas estáticas y proxy funcional)**.
- Pruebas HTTP con `curl`:
  - `curl -s -I http://localhost:3000/` $\rightarrow$ `HTTP 200 OK`
  - `curl -s -I -H "Host: app.localhost:3000" http://localhost:3000/` $\rightarrow$ `HTTP 200 OK` (rewrite `/app`)
  - `curl -s -I -H "Host: app.localhost:3000" http://localhost:3000/login` $\rightarrow$ `HTTP 200 OK`
  - `curl -s -I -H "Host: app.localhost:3000" http://localhost:3000/curso/python-1/seccion/py-m01` $\rightarrow$ `HTTP 200 OK` con `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`
- El log `.next/dev/logs/next-development.log` confirmó ejecución en `Next.js 16.4.2` sin errores de compilación ni pérdida de module factories.
