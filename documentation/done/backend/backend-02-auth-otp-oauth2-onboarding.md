# Entregable Backend HU AUTH-05: Autenticación Dual (OTP + Google OAuth2) y Sincronización de Onboarding

- **ID Historia de Usuario:** AUTH-05
- **Épica:** Épica 3 (Sprint 2) - Autenticación, Perfiles y Onboarding
- **Rama:** `feat/backend-auth-05-otp-oauth-onboarding`
- **Autor:** Daniel Echeverría
- **Fecha:** 17/09/2026
- **Estado:** ✅ Backend Completado · ⚪ Frontend diferido a próxima HU (`feat/frontend-auth-05-otp-oauth-onboarding`)
- **Trazabilidad:** `ADR-002`, `ADR-008`, `ADR-010`, `ADR-013`, `ADR-015`, `ADR-016`

---

## 1. Resumen de la Implementación Backend

En estricto cumplimiento del protocolo de gobernanza `koda-backend-workflow.md` (ADR-015):
1. **Aislamiento de Código:** **0 archivos modificados en `apps/web/`**. Toda la lógica de interfaz de usuario (modal OTP, SDK cliente de Google OAuth2 y callback de redirección) queda formalmente delimitada como la siguiente historia de usuario para el equipo de frontend.
2. **Arquitectura Hexagonal:** Se implementaron los puertos, adaptadores, entidades puras y casos de uso en `apps/api/` para respaldar el flujo de registro tradicional con código OTP de 6 dígitos, la vinculación con Google OAuth2 y la sincronización mandatoria de preferencias de onboarding.

---

## 2. Componentes Creados y Modificados (Backend)

### A. Persistencia Relacional y Prisma ORM
- **`apps/api/prisma/schema.prisma`:**
  - Adición del campo `onboardingCompleted Boolean @default(false) @map("onboarding_completed")` en el modelo `User`.
  - Regeneración tipada con `prisma generate`.

### B. Capa de Dominio (Hexagonal)
- **`apps/api/src/domain/entities/user.entity.ts`:**
  - Adición de `onboardingCompleted` a la interfaz `UserEntityProps`.
  - Implementación del método de dominio `completeOnboarding(...)` para actualizar atómicamente el estado y las preferencias formativas (`initialLanguageSlug`, `experienceLevel`, `learningStyle`, `dailyGoalId`, `dailyGoalMinutes`, `displayName`).
  - Actualización del validador de integridad `isProfileComplete()`.

### C. Capa de Infraestructura
- **`apps/api/src/infra/database/postgres/mappers/user.mapper.ts`:**
  - Mapeo bidireccional de `onboardingCompleted` entre el modelo de persistencia Prisma y la entidad pura de dominio `UserEntity`.
- **`apps/api/src/database/supabase.service.ts`:**
  - `signUpWithEmail(email, password, metadata)`: Registro en Supabase Auth despachando el código OTP por email.
  - `verifyOtp(email, token, type)`: Verificación del código de 6 dígitos y emisión de sesión con tokens.
  - `resendOtp(email, type)`: Reenvío seguro de código OTP sujeto a rate limit.
  - `updateUserMetadata(userId, metadata)`: Sincronización transparente de metadatos en Supabase Auth (`raw_user_meta_data`).

### D. Capa de Aplicación (Casos de Uso y DTOs)
- **DTOs creados:**
  - `apps/api/src/presentation/rest/auth/dto/register-otp.dto.ts`: Validación con `class-validator` para registro con OTP.
  - `apps/api/src/presentation/rest/auth/dto/verify-otp.dto.ts`: Validación de código de 6 dígitos.
  - `apps/api/src/presentation/rest/auth/dto/resend-otp.dto.ts`: Reenvío de código.
  - `apps/api/src/presentation/rest/auth/dto/complete-onboarding.dto.ts`: Validación rigurosa de enums y límites de tiempo para preferencias pedagógicas.
  - `apps/api/src/application/dto/auth/user-session-response.dto.ts`: Exposición del flag `onboardingCompleted`.
- **Casos de uso creados:**
  - `apps/api/src/application/use-cases/auth/register-with-otp.use-case.ts`: Orquesta el inicio de registro con OTP y previene colisiones de cuentas.
  - `apps/api/src/application/use-cases/auth/verify-otp.use-case.ts`: Valida el código, aprovisiona de inmediato en PostgreSQL si es nuevo y entrega la sesión.
  - `apps/api/src/application/use-cases/auth/complete-onboarding.use-case.ts`: Persiste las preferencias, marca `onboardingCompleted = true` y sincroniza Supabase Auth.
  - `apps/api/src/application/use-cases/auth/validate-user-session.use-case.ts`: Actualizado para preservar y reportar `onboardingCompleted` ante inicios de sesión federados con Google OAuth2.

### E. Capa de Presentación REST y Controladores
- **`apps/api/src/presentation/rest/auth/auth.controller.ts`:**
  - `POST /api/v1/auth/register-otp`: Inicia el registro con envío de código OTP.
  - `POST /api/v1/auth/verify-otp`: Valida el código numérico y emite sesión.
  - `POST /api/v1/auth/onboarding`: Guarda preferencias y activa el usuario tras completar onboarding.
  - `GET /api/v1/auth/onboarding-status`: Consulta si el usuario autenticado tiene el onboarding completo.
- **`apps/api/src/presentation/rest/auth/auth.module.ts`:**
  - Registro e inyección de dependencias de todos los casos de uso nuevos.

---

## 3. Endpoints Disponibles y Contratos REST

| Método | Ruta | Guard / Seguridad | Descripción |
|---|---|---|---|
| `POST` | `/api/v1/auth/register-otp` | Público | Registra usuario y envía código OTP de 6 dígitos al correo. |
| `POST` | `/api/v1/auth/verify-otp` | Público | Valida el código OTP, aprovisiona en PostgreSQL y entrega tokens. |
| `POST` | `/api/v1/auth/verify-session` | Público (Token en Header/Body) | Valida token JWT (Google OAuth2 o tradicional) y sincroniza sesión. |
| `GET` | `/api/v1/auth/session` | `SupabaseAuthGuard` (Bearer) | Obtiene la sesión activa y métricas del estudiante. |
| `POST` | `/api/v1/auth/onboarding` | `SupabaseAuthGuard` (Bearer) | Persiste y sincroniza las preferencias educativas finales (`onboarding_completed=true`). |
| `GET` | `/api/v1/auth/onboarding-status` | `SupabaseAuthGuard` (Bearer) | Retorna `{ onboardingCompleted: boolean }` para control de acceso en cliente. |

---

## 4. Resultados de Verificación y Pruebas

### Pruebas Unitarias (Jest):
- Comando: `pnpm --filter api run test`
- Resultado: **100% Passed (4 Test Suites, 11 Tests aprobados)**
  - `√ RegisterWithOtpUseCase: debe iniciar el registro y retornar requiresOtp: true`
  - `√ RegisterWithOtpUseCase: debe lanzar ConflictException si el correo ya existe`
  - `√ VerifyOtpUseCase: debe validar OTP y devolver la sesión con tokens para usuario existente`
  - `√ VerifyOtpUseCase: debe aprovisionar el usuario si no existía en la base de datos`
  - `√ VerifyOtpUseCase: debe lanzar UnauthorizedException si Supabase no retorna sesión`
  - `√ CompleteOnboardingUseCase: debe actualizar preferencias, marcar onboardingCompleted en true y sincronizar Supabase`
  - `√ CompleteOnboardingUseCase: debe lanzar NotFoundException si el usuario no existe`
  - `√ ValidateUserSessionUseCase: 4 pruebas de sesión y aprovisionamiento aprobadas`

### Compilación y Tipado:
- Comando: `pnpm --filter api run build`
- Resultado: **Exitoso (Prisma Client generado + NestJS build limpio, 0 errores de TypeScript)**.

---

## 5. Delimitación de Próxima HU (Frontend)

Conforme a la regla de no tocar frontend en este ciclo, queda formalizada la siguiente historia de usuario para el equipo de frontend:
- **HU:** `AUTH-05-FRONT — Flujo Visual de Verificación OTP, Integración Google OAuth2 y Redirección de Onboarding`
- **Rama asignada:** `feat/frontend-auth-05-otp-oauth-onboarding`
- **Entregables de UI esperados:**
  - Modal accesible para digitar los 6 dígitos del código OTP con countdown de reenvío.
  - Conexión del botón "Continuar con Google" a `supabase.auth.signInWithOAuth({ provider: 'google' })`.
  - Persistencia temporal en `sessionStorage` (`koda_pending_onboarding`) para usuarios que inicien el onboarding antes de presionar Google OAuth2.
  - Ruta `/auth/callback` que verifique `onboardingCompleted` y enrute a `/register` (si falta) o a `/app/ruta`.
