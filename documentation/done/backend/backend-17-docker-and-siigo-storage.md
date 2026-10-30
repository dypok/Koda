# Entregable Backend: Docker Containerization y Unificación de Object Storage con Siigo (S3-Compatible)

**HU Asociada:** INFRA-01 — Dockerización de Backend y Storage Unificado  
**Épica:** EPIC-01 — Arquitectura Base, Infraestructura y DevOps  
**Rama:** `feat/docker-backend-frontend-siigo-storage`  
**Fecha:** 30 de Octubre de 2026  
**Autor:** Dylan Gamero  

---

## 1. Resumen Arquitectónico

Se completó la dockerización de grado de producción para el backend NestJS (`apps/api`) y la unificación completa del servicio de almacenamiento de objetos bajo un único proveedor S3-compatible denominado **Siigo Storage**:

1. **Unificación y Eliminación de Redundancia de Storage:**
   - **Eliminación Total de Supabase Storage:** Se eliminó la dependencia innecesaria y redundante de Supabase Storage en el backend (`supabase-storage.service.ts` y métodos en `supabase.service.ts`), unificando toda la persistencia de archivos en un único motor de almacenamiento.
   - **Deprecación de MinIO a Siigo:** Se eliminó `minio-storage.service.ts` y se creó `apps/api/src/infrastructure/storage/siigo-storage.service.ts`, implementando `IObjectStorageService` y `OnModuleInit`.
   - **Gestión Multi-bucket:** Auto-inicialización idempotente de buckets requeridos (`certificates` y `avatars`) con directivas de lectura pública para assets y certificados con hash criptográfico SHA-256.
   - **Desacoplamiento de Casos de Uso:** Se refactorizó `UploadUserAvatarUseCase` (`apps/api/src/application/use-cases/users/upload-user-avatar.use-case.ts`) para inyectar `OBJECT_STORAGE_SERVICE_TOKEN`, persistiendo avatares de usuario directamente en el bucket `avatars` de Siigo Storage.
   - **Módulo de Storage:** `StorageModule` provee y exporta de forma canónica `SiigoStorageService` asociado al token `OBJECT_STORAGE_SERVICE_TOKEN`.

2. **Multi-Stage Dockerfile de Producción para `apps/api` (`apps/api/Dockerfile`):**
   - **Stage 1 (base):** Node 22 Alpine (`node:22-alpine`) con utilidades de sistema (`libc6-compat`, `openssl`), activación de `corepack` y configuración de timeouts resilientes de red (`fetch-timeout: 600000ms`, `fetch-retries: 5`, `network-concurrency: 2`).
   - **Stage 2 (dependencies):** Resolución e instalación atómica de dependencias filtradas con `pnpm --filter api... install --frozen-lockfile` y caché montado de BuildKit (`--mount=type=cache,id=pnpm`).
   - **Stage 3 (builder):** Compilación de la librería compartida de tipos del monorepo (`pnpm --filter @koda/types build`), generación del cliente Prisma en Alpine y compilación de NestJS (`pnpm --filter api build`).
   - **Stage 4 (runner):** Imagen de producción minimalista y segura (~193MB) ejecutando bajo usuario no privilegiado `nestjs:nodejs` (UID/GID 1001), exponiendo el puerto 4000.

3. **Orquestación con Docker Compose (`docker-compose.yml`):**
   - Eliminación del servicio legacy `minio` y reemplazo formal por `siigo` (`koda-siigo`) con volumen dedicado `koda_siigo_data` en puertos `9000:9000` y `9001:9001`.
   - Healthcheck nativo optimizado con `mc ready local`.
   - Servicio `api` (`koda-api`) con compilación automatizada y dependencias saludables (`mongo`, `redis`, `siigo`).
   - Variables de entorno unificadas: `STORAGE_DRIVER=siigo`, `SIIGO_ENDPOINT`, `SIIGO_ACCESS_KEY`, `SIIGO_SECRET_KEY`, `SIIGO_REGION`, `SIIGO_BUCKET_CERTIFICATES`, `SIIGO_BUCKET_AVATARS`.

---

## 2. Pruebas y Verificación

- **Pruebas Unitarias de Backend:**
  - `pnpm --filter api test`: **30/30 suites aprobadas, 109/109 tests aprobados** (incluyendo la suite actualizada `upload-user-avatar.use-case.spec.ts` con Siigo Storage).
- **Verificación de Tipos TypeScript:**
  - `pnpm --filter api exec tsc --noEmit`: 0 errores.
- **Compilación de Imagen Docker Backend:**
  - `docker build -f apps/api/Dockerfile -t koda-api:test .`: Ejecución exitosa de 29 pasos, empaquetado en 193MB.
  - Verificación de ejecución: `docker run --rm koda-api:test node -e "console.log('Koda API container runs cleanly on Node:', process.version)"` retornó `v22.23.4`.
- **Configuración de Docker Compose:**
  - `docker compose config`: Sintaxis validada y normalizada exitosamente.
