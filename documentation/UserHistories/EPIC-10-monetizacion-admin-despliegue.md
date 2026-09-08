# 🔴 EPIC 10 — Monetización, Consola de Administración y Despliegue Cloud
`Sprint 5 · v1.0 · Color Jira: Rojo Oscuro · Código: MONA`

> Esta épica consolida la viabilidad operativa y comercial de Koda 🦊: el modelo de monetización ético (Plan Gratuito vs. Premium USD $1, `18_MONETIZATION.md`), la **Consola de Administración** para publicación de contenidos sin re-despliegue (`25_ADMIN_SYSTEM.md`), el pipeline de **CI/CD con GitHub Actions** y el despliegue en producción en la nube (`21_DEPLOYMENT.md`).

---

### MONA-01 — Modelo de Monetización Ético: Plan Gratuito vs. Premium (USD $1)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/monetizacion-free-premium`

**Historia de usuario:**
> "Como equipo de producto, queremos ofrecer un modelo de monetización no agresivo y accesible (gratuito con banners discretos vs. suscripción de $1 USD),
> para financiar la infraestructura sin bloquear el acceso al conocimiento ni molestar al estudiante durante el estudio."

**Criterios de aceptación:**
- **Invariantes Éticos de Monetización (`18` §2):**
  - El 100% de las lecciones, quizes, exámenes y certificados son accesibles en el plan gratuito. Cero muros de pago pedagógicos (*paywalls*).
  - En el plan gratuito: se muestran banners discretos de patrocinio **únicamente entre secciones terminadas**, jamás en medio de una lección activa ni durante un examen.
- **Suscripción Premium (USD $1 / mes):**
  - Cero publicidad en toda la plataforma.
  - Insignia dorada de perfil *"Koda Pro"*.
  - 1 protector de racha (*Streak Freeze*) extra mensual.
  - Soporte para webhook de pasarela de pago (Stripe / LemonSqueezy) que activa el flag `is_premium = true` en `users`.

**Subtasks:**
- [ ] [BD] Columna `is_premium (BOOLEAN DEFAULT false)` y tabla `subscriptions` en Supabase.
- [ ] [BACKEND] Endpoint webhook `POST /api/v1/payments/webhook` para procesar altas y cancelaciones de suscripción.
- [ ] [FRONTEND] Componente `SponsoredBanner.tsx` renderizado condicionalmente en la pantalla de transición entre secciones si `!user.is_premium`.
- [ ] [FRONTEND] Modal informativo *"Koda Premium"* con desglose de beneficios y botón de pago integrado.

**DoD adicional para esta US:**
- Los usuarios Premium navegan sin ninguna petición ni renderizado de componentes de anuncios.

---

### MONA-02 — Consola de Administración y Publicación de Contenidos sin Despliegue
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Lead + Frontend Lead  
**Rama sugerida:** `feature/consola-administracion-contenido`

**Historia de usuario:**
> "Como administrador pedagógico de Koda, quiero acceder a una consola interna protegida para auditar contenidos y publicar nuevos módulos,
> para actualizar cursos en vivo sin requerir nuevos despliegues de software ni downtime (`RNF-006`, `25_ADMIN_SYSTEM.md`)."

**Criterios de aceptación:**
- Acceso restringido por rol RBAC: únicamente usuarios con `role = 'ADMIN'` pueden ingresar a `/admin/*` (`13` §6, `25` §2).
- Módulo de Sincronización de Contenidos:
  - Endpoint `POST /api/v1/admin/content/sync`: lee los archivos de `content/languages/` y actualiza las tablas relacionales en Supabase.
  - Validación de esquemas JSON con reporte de errores sintácticos antes de aplicar cambios en base de datos.
- Registro inmutable en `content_audit_log`: almacena qué admin publicó, qué versión de módulo se actualizó y la fecha exacta.
- Dashboard de métricas clave (`26_ANALYTICS.md`): total de usuarios registrados, usuarios activos diarios (DAU), lecciones completadas hoy y certificados emitidos.

**Subtasks:**
- [ ] [BACKEND] Guard de autorización `RolesGuard` verificando `role === 'ADMIN'` en rutas `/api/v1/admin/*`.
- [ ] [BACKEND] Servicio `ContentSyncService` que parsea los manifests declarativos de Python 3.12 y ejecuta transacciones de upsert en PostgreSQL.
- [ ] [FRONTEND] Layout administrativo `apps/web/src/app/admin/layout.tsx` con navegación propia e indicadores de salud del sistema.
- [ ] [FRONTEND] Vista de sincronización de contenidos con botón *"Sincronizar Cursos en Vivo"* y log de salida.

**DoD adicional para esta US:**
- Intentos de acceso por usuarios con rol `USER` arrojan `403 Forbidden` inmediato tanto en API como en UI.

---

### MONA-03 — Pipeline de Integración Continua (CI/CD) con GitHub Actions
**Tipo:** Story | **SP:** 3 | **Prioridad:** Muy Alta | **Asignado:** DevOps Engineer  
**Rama sugerida:** `feature/pipeline-ci-cd`

**Historia de usuario:**
> "Como equipo de ingeniería, queremos un pipeline de CI/CD automatizado en GitHub Actions,
> para asegurar que ningún código con errores de compilación, fallos de tipado o tests rotos llegue a la rama principal."

**Criterios de aceptación:**
- Workflow de GitHub Actions (`.github/workflows/ci.yml`) que se ejecuta en cada Push y Pull Request hacia `main` y `develop`:
  1. **Linting & Formato:** ejecuta `pnpm lint` en todas las aplicaciones del monorepo.
  2. **Type Check:** compila `@koda/types` con `tsc` y valida tipos en `api` y `web`.
  3. **Builds:** valida `nest build` en `apps/api` y `next build` en `apps/web`.
  4. **Tests:** ejecuta la suite de tests unitarios e integración con Jest / Vitest.
- Bloqueo de merges si alguna de las etapas del workflow falla.
- Tiempo total de ejecución del pipeline inferior a 4 minutos mediante caché de dependencias de `pnpm`.

**Subtasks:**
- [ ] [DEVOPS] Crear archivo de workflow `.github/workflows/ci.yml` configurando Node.js 20 y pnpm 9+.
- [ ] [DEVOPS] Configurar caché de `pnpm store` y `.next/cache` en las acciones de GitHub.
- [ ] [DEVOPS] Proteger rama `main` en los ajustes del repositorio requiriendo status check de CI en verde.
- [ ] [TEST] Abrir PR de prueba y verificar ejecución exitosa de todas las fases del pipeline.

**DoD adicional para esta US:**
- Pipeline reporta status verde de forma determinista y consistente.

---

### MONA-04 — Despliegue Cloud en Producción y Monitoreo de Salud (`/api/v1`)
**Tipo:** Story | **SP:** 3 | **Prioridad:** Muy Alta | **Asignado:** DevOps & Backend Lead  
**Rama sugerida:** `feature/despliegue-cloud-produccion`

**Historia de usuario:**
> "Como equipo técnico, queremos tener el frontend y backend desplegados en la nube con dominios oficiales y monitoreo de salud,
> para poner la plataforma a disposición de usuarios reales con alta disponibilidad y bajo costo operativo."

**Criterios de aceptación:**
- **Frontend ([`apps/web`](apps/web)):** desplegado en Vercel / Cloudflare con conexión a dominio oficial, variables de entorno inyectadas y optimización de Edge Network.
- **Backend ([`apps/api`](apps/api)):** desplegado en Render / Railway / Fly.io con Node.js 20, certificado TLS/SSL automático y puerto dinámico.
- **Health Check Operativo:** endpoint `GET /api/v1` responde con estado `200 OK` y metadatos del servicio en vivo:
  ```json
  {
    "name": "Koda Backend API 🦊",
    "version": "2.0.0",
    "status": "online",
    "docs": "/api/docs"
  }
  ```
- **CORS Configurado:** el backend solo acepta peticiones autorizadas desde el dominio oficial del frontend de Vercel y `localhost` en desarrollo (`19` §11).
- **Documentación OpenAPI en Producción:** Swagger UI accesible de forma segura en `/api/docs`.

**Subtasks:**
- [ ] [DEVOPS] Configurar proyecto en Vercel apuntando al directorio `apps/web` con comando de build monorepo.
- [ ] [DEVOPS] Configurar servicio en Render / Railway para `apps/api` con script `pnpm --filter api build && pnpm --filter api start:prod`.
- [ ] [BACKEND] Configurar orígenes permitidos en CORS dinámicamente según variable `FRONTEND_URL`.
- [ ] [DEVOPS] Inyectar variables de producción: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_SERVICE_ACCOUNT_BASE64`, `JWT_SECRET`.
- [ ] [TEST] Verificar comunicación end-to-end entre la URL de producción del frontend y la API cloud.

**DoD adicional para esta US:**
- Endpoints públicos respondiendo con HTTPS y latencia de primer byte (TTFB) < 300 ms.
