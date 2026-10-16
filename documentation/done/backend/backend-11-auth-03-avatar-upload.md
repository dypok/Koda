# 🦊 Entregable Backend HU AUTH-03: Subida y Almacenamiento de Avatares Personalizados

- **ID Historia de Usuario:** AUTH-03 (Extensión — Subida de Avatares Personalizados)
- **Épica:** Épica 3 - Autenticación, Perfiles de Usuario y Preferencias
- **Rama:** `feat/backend-auth-03-avatar-upload`
- **Fecha:** 16/10/2026
- **Estado:** ✅ Implementado, Probado y Verificado en Backend
- **Trazabilidad:** `ADR-002`, `ADR-008`, `ADR-010`, `ADR-013`, `ADR-015`, `ADR-016`

---

## 1. Resumen Ejecutivo y Alcance

Se implementó el soporte completo en el backend (`apps/api`) para recibir fotografías personalizadas desde el dispositivo del estudiante mediante `multipart/form-data`, almacenarlas en el bucket público `avatars` de **Supabase Storage**, actualizar los atributos `avatarUrl` y `avatarObjectKey` en **PostgreSQL** (`public.users`) siguiendo la arquitectura hexagonal del proyecto, y sincronizar de forma resiliente el metadato `avatar_url` en **Supabase Auth**.

Además, se consolidó el motor de evaluación y carga declarativa de contenido (`EvaluationService` y `ContentLoaderService`) para soportar bancos de preguntas tanto en formato arreglo plano como objeto `{ module_code, questions }`, calificación multi-dialecto (canónico y legado), inserción masiva en `user_mistakes_notebook` sin bucles N+1, soporte completo para Lua en roadmaps/grafos y recarga en caliente (`fs.watch`).

---

## 2. Componentes Creados y Modificados

### A. Infraestructura de Almacenamiento (`apps/api/src/database/supabase.service.ts`)
- Inicialización de `avatarsBucket` desde `SUPABASE_STORAGE_AVATARS_BUCKET` (con fallback a `'avatars'`).
- Método `uploadAvatar(userId, fileName, fileBuffer, contentType)` que almacena el binario en `users/${userId}/${fileName}` con `{ contentType, upsert: true }` y retorna `{ path, publicUrl }`.

### B. Capa de Aplicación (`apps/api/src/application/use-cases/users/`)
- **`upload-user-avatar.use-case.ts`:**
  - Valida presencia del archivo, tamaño máximo de **3 MB** (`3 * 1024 * 1024` bytes) y MIME types permitidos (`image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`).
  - Verifica existencia del usuario mediante `IUserRepository.findById(userId)`.
  - Sube el archivo a Supabase Storage bajo `users/{userId}/avatar-{timestamp}.{ext}`.
  - Actualiza `avatarUrl` y `avatarObjectKey` en la entidad de dominio `UserEntity` y persiste los cambios en PostgreSQL.
  - Sincroniza `avatar_url` en `raw_user_meta_data` de Supabase Auth con manejo resiliente de errores de red.
- **`upload-user-avatar.use-case.spec.ts`:**
  - Suite de pruebas unitarias cubriendo subida exitosa, archivo faltante, rechazo por tamaño (> 3 MB), rechazo por MIME inválido, usuario inexistente y resiliencia ante caída de Supabase Auth.

### C. Capa de Presentación REST (`apps/api/src/presentation/rest/users/`)
- **`users.controller.ts`:**
  - Nuevo endpoint `POST /api/v1/users/me/avatar` protegido por `SupabaseAuthGuard`, decorado con `@ApiBearerAuth()`, `@ApiConsumes('multipart/form-data')` y `FileInterceptor('file', { limits: { fileSize: 3 * 1024 * 1024 } })`.
- **`users.module.ts`:**
  - Registro y exportación de `UploadUserAvatarUseCase`.

---

## 3. Contrato del Endpoint REST

| Método | Ruta | Seguridad | Content-Type | Límites y Formatos | Respuesta |
|---|---|---|---|---|---|
| `POST` | `/api/v1/users/me/avatar` | `SupabaseAuthGuard` (Bearer JWT) | `multipart/form-data` (campo `file`) | Máx. 3 MB (`image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`) | `200 OK` (`UserProfileResponseDto`) |
