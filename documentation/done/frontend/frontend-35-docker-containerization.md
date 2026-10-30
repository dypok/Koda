# Entregable Frontend: Docker Containerization y Next.js Standalone Runner

**HU Asociada:** INFRA-02 — Dockerización de Frontend Web con Next.js Standalone  
**Épica:** EPIC-01 — Arquitectura Base, Infraestructura y DevOps  
**Rama:** `feat/docker-backend-frontend-siigo-storage`  
**Fecha:** 30 de Octubre de 2026  
**Autor:** Dylan Gamero  

---

## 1. Resumen de Implementación

Se configuró el contenedor de producción para el frontend web Next.js (`apps/web`):

1. **Configuración de Build Standalone (`apps/web/next.config.mjs`):**
   - Inclusión de `output: 'standalone'` en `next.config.mjs`.
   - Soporte para rewrites de API dinámicos hacia `API_PROXY_TARGET` (por defecto `http://127.0.0.1:4000` en local y `http://api:4000` dentro de la red Docker Compose).
   - Preservación estricta de encabezados de seguridad (CSP, Cache-Control, X-Frame-Options, X-Content-Type-Options) y preservación de `apps/web/next-env.d.ts`.

2. **Multi-Stage Dockerfile de Producción para `apps/web` (`apps/web/Dockerfile`):**
   - **Stage 1 (base):** Node 22 Alpine (`node:22-alpine`) con `libc6-compat`, `corepack enable` y timeouts resilientes (`fetch-timeout: 600000ms`, `fetch-retries: 5`, `network-concurrency: 2`).
   - **Stage 2 (dependencies):** Instalación aislada de dependencias con `pnpm --filter web... install --frozen-lockfile` aprovechando el caché global de BuildKit (`--mount=type=cache,id=pnpm`).
   - **Stage 3 (builder):** Paso de argumentos de entorno público (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), compilación de tipos (`pnpm --filter @koda/types build`) y compilación de Next.js (`pnpm --filter web build`).
   - **Stage 4 (runner):** Imagen de producción que aprovecha el bundle standalone generado por Next.js (`/app/apps/web/.next/standalone`), estáticos (`.next/static`) y carpeta de assets (`public/`).
   - Ejecución bajo usuario sin privilegios `nextjs:nodejs` (UID/GID 1001) en puerto 3000 con `HOSTNAME="0.0.0.0"`.

3. **Orquestación en `docker-compose.yml`:**
   - Servicio `web` configurado con build automático desde `apps/web/Dockerfile`.
   - Inyección de variables públicas y binding en puerto 3000 (`3000:3000`).
   - Conectividad interna con el servicio backend mediante `API_PROXY_TARGET: http://api:4000`.

---

## 2. Pruebas y Verificación

- **Compilación Standalone:**
  - `pnpm --filter @koda/types build && pnpm --filter web build` genera exitosamente `.next/standalone` con todos los bundles de rutas SSR/RSC y estáticos.
- **Tipado TypeScript:**
  - `pnpm --filter web exec tsc --noEmit` completado sin errores.
- **Integridad de Entorno:**
  - `apps/web/next-env.d.ts` preservado intacto.
