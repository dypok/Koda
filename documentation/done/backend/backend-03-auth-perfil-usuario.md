# Entregable Backend HU AUTH-03: Gestión de Perfil de Usuario y Preferencias

- **ID Historia de Usuario:** AUTH-03
- **Épica:** Épica 3 (Sprint 2) - Autenticación, Perfiles de Usuario y Onboarding
- **Rama:** `feat/backend-auth-03-perfil-usuario`
- **Autor:** Dylan Gamero
- **Fecha:** 20/09/2026
- **Estado:** ✅ Backend Completado · ⚪ Frontend delimitado para desarrollo en `apps/web/`
- **Trazabilidad:** `ADR-002`, `ADR-008`, `ADR-010`, `ADR-013`, `ADR-015`, `ADR-016`

---

## 1. Resumen de la Implementación Backend

En estricto cumplimiento del protocolo de gobernanza `koda-backend-workflow.md` (ADR-015):
1. **Aislamiento de Código:** **0 archivos modificados en `apps/web/`**. La implementación se mantuvo estrictamente en `apps/api/` y la documentación del proyecto.
2. **Seguridad y Enmascaramiento PII:** El número de documento legal de identidad se enmascara desde la capa de dominio (`UserEntity.maskedDocumentNumber` y `UserEntity.formattedMaskedDocument`) asegurando que la API pública nunca devuelva identificaciones completas (`CC ***678`), protegiendo datos sensibles.
3. **Arquitectura Hexagonal:** Se agregaron casos de uso puros en la capa de aplicación, DTOs con validación estricta (`class-validator`), documentación OpenAPI/Swagger interactiva y sincronización transparente de metadatos (`display_name`, `avatar_url`) con Supabase Auth.

---

## 2. Componentes Creados y Modificados (Backend)

### A. Capa de Dominio (Hexagonal)
- **`apps/api/src/domain/entities/user.entity.ts`:**
  - Adición del getter de dominio `formattedMaskedDocument` (`CC ***4567`).
  - Implementación del método de dominio `updateProfile(...)` para mutación segura y tipada de los campos de perfil y preferencias de estudio, actualizando automáticamente `updatedAt`.

### B. Capa de Aplicación (Casos de Uso y DTOs)
- **`apps/api/src/application/dto/users/user-profile-response.dto.ts`:**
  - DTO estructurado con anotaciones OpenAPI `@ApiProperty` que expone los datos de identidad, preferencias pedagógicas, métricas de gamificación y documento enmascarado.
- **`apps/api/src/application/use-cases/users/get-user-profile.use-case.ts`:**
  - Caso de uso que consulta el perfil por `userId` autenticado mediante el repositorio desacoplado `IUserRepository`.
- **`apps/api/src/application/use-cases/users/update-user-profile.use-case.ts`:**
  - Caso de uso que orquesta la actualización de perfil y preferencias, persistiendo cambios en PostgreSQL y sincronizando asíncronamente los metadatos en Supabase Auth (`raw_user_meta_data`).
- **Pruebas Unitarias:**
  - `apps/api/src/application/use-cases/users/get-user-profile.use-case.spec.ts`
  - `apps/api/src/application/use-cases/users/update-user-profile.use-case.spec.ts`

### C. Capa de Presentación REST y Controladores
- **`apps/api/src/presentation/rest/users/dto/update-user-profile.dto.ts`:**
  - DTO de entrada con validadores `class-validator` (`@Length`, `@MaxLength`, `@IsEnum`, `@IsInt`, `@Min`, `@Max`) y documentación Swagger `@ApiPropertyOptional`.
- **`apps/api/src/presentation/rest/users/users.controller.ts`:**
  - Endpoint `GET /api/v1/users/me`: Protegido por `SupabaseAuthGuard` y `@CurrentUser()`.
  - Endpoint `PATCH /api/v1/users/me`: Protegido por `SupabaseAuthGuard`, `@CurrentUser()` y `@Body() UpdateUserProfileDto`.
- **`apps/api/src/presentation/rest/users/users.module.ts`:**
  - Módulo que declara `UsersController`, inyecta `USER_REPOSITORY_TOKEN` con `PrismaUserRepository` y exporta los casos de uso.
- **`apps/api/src/app.module.ts`:**
  - Registro de `UsersModule` en el array de imports principales.

---

## 3. Endpoints Disponibles y Contratos REST

| Método | Ruta | Guard / Seguridad | Descripción |
|---|---|---|---|
| `GET` | `/api/v1/users/me` | `SupabaseAuthGuard` (Bearer) | Obtiene el perfil completo del usuario autenticado, documento enmascarado (`CC ***678`) y métricas de gamificación. |
| `PATCH` | `/api/v1/users/me` | `SupabaseAuthGuard` (Bearer) | Actualización parcial de nombre, avatar, bio, timezone, locale, metas diarias y documento legal. |

---

## 4. Resultados de Verificación y Pruebas

### Pruebas Unitarias (Jest):
- Comando: `pnpm --filter api test`
- Resultado: **100% Passed (6 Test Suites, 17 Tests aprobados)**
  - `√ GetUserProfileUseCase: debe retornar el perfil del usuario con documento enmascarado y métricas`
  - `√ GetUserProfileUseCase: debe lanzar NotFoundException si el usuario no existe en la base de datos`
  - `√ UpdateUserProfileUseCase: debe actualizar campos del perfil, guardar en base de datos y sincronizar metadatos`
  - `√ UpdateUserProfileUseCase: no debe llamar a updateUserMetadata si no se modifica displayName ni avatarUrl`
  - `√ UpdateUserProfileUseCase: debe tolerar fallos en la sincronización con Supabase Auth sin arrojar error fatal`
  - `√ UpdateUserProfileUseCase: debe lanzar NotFoundException si el usuario no existe`
  - `√ VerifyOtpUseCase, RegisterWithOtpUseCase, CompleteOnboardingUseCase, ValidateUserSessionUseCase: 11 tests aprobados`

### Compilación y Tipado:
- Comando: `pnpm --filter api build`
- Resultado: **Exitoso (Prisma Client generado + NestJS build limpio, 0 errores de TypeScript)**.

---

## 5. Delimitación de Próxima HU (Frontend)

Para el equipo de frontend en `apps/web/`:
- **HU:** `AUTH-03-FRONT — Pantalla de Perfil de Usuario, Selector de Avatares Koda y Formulario de Edición`
- **Componentes sugeridos:**
  - Página `apps/web/src/app/perfil/page.tsx`.
  - Selector de avatares con expresiones de Koda 🦊.
  - Formulario de edición reactivo con `react-hook-form` y Zod consumiendo `GET /api/v1/users/me` y `PATCH /api/v1/users/me`.
