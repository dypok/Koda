# Entregable HU AUTH-01: Autenticación con Supabase Auth y Arquitectura Hexagonal

- **ID Historia de Usuario:** AUTH-01
- **Épica:** Épica 3 (Sprint 2) - Autenticación, Perfiles y Onboarding
- **Rama:** `feat/backend-auth-01-supabase-auth`
- **Autor:** Daniel Echeverría
- **Fecha:** 15/09/2026
- **Estado:** ✅ Completado

---

## 1. Resumen de la Implementación
Se implementó el backend para la autenticación y gestión de sesiones de usuario en Koda mediante **Supabase Auth** y **PostgreSQL** con **Prisma ORM**, bajo una estricta **Arquitectura Hexagonal (Puertos y Adaptadores)**.

El backend no maneja contraseñas en texto plano ni tokens propietarios no estándar; delega el ciclo de vida criptográfico en Supabase Auth y provisiona o sincroniza los usuarios en la base de datos relacional de Koda.

---

## 2. Componentes Creados y Modificados

### A. Mapeo Relacional y Base de Datos (Prisma ORM)
- **`apps/api/prisma/schema.prisma`:**
  - Mapeo completo de las 18 tablas del esquema PostgreSQL (`users`, `user_streak_history`, `languages`, `tracks`, `sections`, `modules`, `lessons`, `user_lesson_progress`, `user_module_progress`, `user_section_progress`, `user_track_enrollments`, `user_language_progress`, `achievements`, `user_achievements`, `daily_missions`, `user_daily_mission_progress`, `leaderboard_entries`, `user_code_snippets`).
  - Mapeo exacto de enums (`UserRole`, `UserStatus`, `ExperienceLevel`, `LearningStyle`, `DailyGoalId`, `DocumentType`, `VerificationStatus`, etc.).
  - Configuración del cliente Prisma con generación tipada.

### B. Capa de Dominio (Hexagonal - Pure TypeScript)
- **`apps/api/src/domain/entities/user.entity.ts`:**
  - Entidad de dominio pura `UserEntity`.
  - Encapsulamiento de atributos de usuario, perfiles, metas diarias y gamificación inicial (nivel, racha, congelamientos, tiempo de estudio).
  - Métodos utilitarios de dominio: `maskedDocumentNumber`, `isProfileComplete`.
- **`apps/api/src/domain/repositories/user.repository.ts`:**
  - Puerto abstracto `IUserRepository` y token de inyección de dependencias `USER_REPOSITORY_TOKEN`.

### C. Capa de Infraestructura (Hexagonal - Adaptadores)
- **`apps/api/src/infra/database/postgres/prisma.service.ts`:**
  - Servicio de ciclo de vida para conexión y desconexión con Prisma Client.
- **`apps/api/src/infra/database/postgres/prisma.module.ts`:**
  - Módulo `@Global()` exportando `PrismaService`.
- **`apps/api/src/infra/database/postgres/mappers/user.mapper.ts`:**
  - Mapper bidireccional puro `UserMapper.toDomain(prismaUser)` y `UserMapper.toPersistence(domainEntity)`.
- **`apps/api/src/infra/database/postgres/repositories/prisma-user.repository.ts`:**
  - Adaptador de persistencia que implementa `IUserRepository` sobre Prisma Client.

### D. Capa de Aplicación (Casos de Uso y DTOs)
- **`apps/api/src/application/dto/auth/user-session-response.dto.ts`:**
  - DTO estandarizado para devolver la sesión del usuario autenticado sin exponer campos sensibles.
- **`apps/api/src/application/use-cases/auth/validate-user-session.use-case.ts`:**
  - Caso de uso que valida el token contra Supabase Auth, verifica la existencia del usuario en la base de datos relacional y realiza aprovisionamiento automático transparente si es un usuario recién registrado.
- **`apps/api/src/application/use-cases/auth/validate-user-session.use-case.spec.ts`:**
  - Suite de pruebas unitarias cubriendo validación de tokens, auto-aprovisionamiento y manejo de excepciones no autorizadas.

### E. Capa de Presentación y Seguridad
- **`apps/api/src/common/guards/supabase-auth.guard.ts`:**
  - Guard de NestJS `SupabaseAuthGuard` para proteger rutas validando el header `Authorization: Bearer <token>`.
- **`apps/api/src/common/decorators/current-user.decorator.ts`:**
  - Decorador de parámetro `@CurrentUser()` para inyectar los datos del usuario autenticado en los controladores.
- **`apps/api/src/presentation/rest/auth/dto/verify-token.dto.ts`:**
  - DTO de validación de entrada con `class-validator` para `POST /api/v1/auth/verify-session`.
- **`apps/api/src/presentation/rest/auth/auth.controller.ts`:**
  - Endpoints REST documentados con Swagger:
    - `POST /api/v1/auth/verify-session`: Valida token y devuelve información de la sesión.
    - `GET /api/v1/auth/session`: Obtiene la sesión del usuario autenticado mediante el guard `SupabaseAuthGuard`.
- **`apps/api/src/presentation/rest/auth/auth.module.ts`:**
  - Módulo de autenticación encapsulado que provee `ValidateUserSessionUseCase` y asocia `USER_REPOSITORY_TOKEN` a `PrismaUserRepository`.
- **`apps/api/src/app.module.ts`:**
  - Registro de `PrismaModule` y `AuthModule`.

---

## 3. Endpoints Disponibles

| Método | Ruta | Guard / Seguridad | Descripción |
|---|---|---|---|
| `POST` | `/api/v1/auth/verify-session` | Público (Valida Token en Body/Header) | Valida un token JWT de Supabase Auth y retorna la sesión del usuario. |
| `GET` | `/api/v1/auth/session` | `SupabaseAuthGuard` (Bearer Token) | Retorna la sesión y perfil del usuario autenticado actual. |

---

## 4. Resultados de Verificación y Pruebas

### Pruebas Unitarias:
- Comando: `pnpm --filter api run test`
- Resultado: **100% Passed (4 de 4 pruebas aprobadas)**:
  - `√ debe lanzar UnauthorizedException si no se proporciona token`
  - `√ debe lanzar UnauthorizedException si Supabase no valida el token`
  - `√ debe retornar la sesion si el usuario ya existe en la base de datos`
  - `√ debe aprovisionar automaticamente el usuario si existe en Supabase pero no en PostgreSQL`

### Compilación y Tipado:
- Comando: `pnpm --filter api run build`
- Resultado: **Exitoso (0 errores de TypeScript, build limpio)**.

---

## 5. Criterios de Aislamiento
- Modificaciones en `apps/web/`: **0 archivos tocados** (Aislamiento total del frontend).
- Rama de trabajo: `feat/backend-auth-01-supabase-auth`.
