# 📋 Requerimiento Backend Pendiente: Subida y Almacenamiento de Avatares Personalizados

- **Módulo:** `UsersModule` (`apps/api/src/presentation/rest/users/`)
- **Historia de Usuario Relacionada:** AUTH-03 — Gestión de Perfil de Usuario y Preferencias
- **Solicitado por:** Equipo Frontend (Koda Web)
- **Fecha:** 20/09/2026
- **Estado:** 🟢 IMPLEMENTADO EN BACKEND (Ver `backend-11-auth-03-avatar-upload.md`)

---

## 1. Contexto y Justificación

En la interfaz de usuario de Koda (`apps/web`), en el modal de configuración de perfil (**Selector de Avatares**), los usuarios ahora tienen la opción de:
1. Elegir uno de los 8 avatares vectoriales oficiales de Koda 🦊.
2. **Subir una fotografía personalizada desde su dispositivo** (PNG, JPG, WEBP, SVG).

### Limitación Actual del Backend:
- Actualmente, el endpoint `PATCH /api/v1/users/me` recibe un DTO JSON (`UpdateUserProfileDto`) donde `avatarUrl` tiene un decorador `@MaxLength(512)`.
- Si el frontend envía una imagen codificada en base64 Data URL (que supera fácilmente los 10 KB - 100 KB), la API de NestJS rechaza la petición con un error `400 Bad Request: avatarUrl must be shorter than or equal to 512 characters`.
- No existe en `UsersController` un endpoint con `multipart/form-data` ni servicio de almacenamiento de objetos configurado para avatares (actualmente `SupabaseService` solo gestiona el bucket `certificates`).

---

## 2. Requerimiento Técnico Propuesto para el Backend

### A. Nuevo Endpoint REST
- **Método:** `POST`
- **Ruta:** `/api/v1/users/me/avatar`
- **Guards:** `SupabaseAuthGuard` con `@ApiBearerAuth()` y `@CurrentUser()`
- **Consumes:** `multipart/form-data`
- **Body:** `file` (archivo binario de imagen)

### B. Validaciones Obligatorias
1. **Tamaño máximo:** 3 MB (`3 * 1024 * 1024 bytes`).
2. **Formatos permitidos (MIME Types):**
   - `image/jpeg`
   - `image/png`
   - `image/webp`
   - `image/svg+xml`
3. **Manejo de errores:**
   - 400 Bad Request si el archivo no es una imagen permitida o excede los 3 MB.
   - 401 Unauthorized si no se suministra Bearer JWT válido.

### C. Almacenamiento en Supabase Storage
1. **Bucket:** Crear o configurar bucket público `avatars` en Supabase Storage (o variable de entorno `SUPABASE_STORAGE_AVATARS_BUCKET=avatars`).
2. **Ruta del objeto:**
   $$\text{users/}\{userId\}\text{/avatar-}\{\text{timestamp}\}\text{.}\{\text{ext}\}$$
3. **Persistencia:**
   - Subir el buffer con `upsert: true`.
   - Obtener la URL pública del archivo (`getPublicUrl`).
   - Actualizar en PostgreSQL (`public.users` vía Prisma) los campos:
     - `avatarUrl`: URL pública generada de Supabase Storage.
     - `avatarObjectKey`: Key/path del archivo en el bucket.
   - Sincronizar asíncronamente con Supabase Auth (`raw_user_meta_data.avatar_url`).

### D. Respuesta Esperada (HTTP 200 OK)
Retornar el `UserProfileResponseDto` actualizado:
```json
{
  "id": "uuid-del-usuario",
  "email": "estudiante@koda.academy",
  "displayName": "Dylan Gamero",
  "avatarUrl": "https://sertfbduqivvjrmeblvh.supabase.co/storage/v1/object/public/avatars/users/.../avatar.png",
  "avatarObjectKey": "users/.../avatar.png",
  "totalXp": 250,
  "currentLevel": 2,
  "currentStreak": 3
}
```

---

## 3. Guía Sugerida de Implementación en NestJS

1. **`apps/api/src/database/supabase.service.ts`:**
   - Añadir método `uploadAvatar(fileName: string, fileBuffer: Buffer, contentType: string)` similar a `uploadCertificate()`.
2. **`apps/api/src/application/use-cases/users/upload-user-avatar.use-case.ts`:**
   - Caso de uso que orquesta subida a Storage, actualización en repositorio `IUserRepository` y sincronización con Auth.
3. **`apps/api/src/presentation/rest/users/users.controller.ts`:**
   ```typescript
   @Post('me/avatar')
   @UseGuards(SupabaseAuthGuard)
   @ApiBearerAuth()
   @UseInterceptors(FileInterceptor('file', {
     limits: { fileSize: 3 * 1024 * 1024 },
     fileFilter: imageFileFilter,
   }))
   @ApiConsumes('multipart/form-data')
   async uploadAvatar(
     @CurrentUser() authUser: SupabaseAuthUser,
     @UploadedFile() file: Express.Multer.File,
   ): Promise<UserProfileResponseDto> {
     return this.uploadUserAvatarUseCase.execute(authUser.id, file);
   }
   ```
4. **Pruebas Unitarias:**
   - Crear `upload-user-avatar.use-case.spec.ts` verificando subida exitosa, rechazo por tamaño/formato y resiliencia de red.
