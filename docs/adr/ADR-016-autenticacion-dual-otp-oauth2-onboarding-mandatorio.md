# ADR-016: Estrategia de Autenticación Dual (Email con OTP y Google OAuth2) con Sincronización Mandatoria de Onboarding E-Learning (AUTH-05)

> **Estado:** Aprobado  
> **Fecha:** 2026-09-17  
> **Autores:** Daniel Echeverría & Equipo de Arquitectura Koda  
> **Trazabilidad:** `ADR-002`, `ADR-008`, `ADR-010`, `ADR-013`, `ADR-015`, `EPIC-03-autenticacion-perfiles-onboarding.md` (AUTH-05), `11_SYSTEM_ARCHITECTURE.md`, `19_SECURITY.md`  

---

## 1. Contexto y Problema

En la plataforma de aprendizaje Koda 🦊, el acceso de nuevos estudiantes requiere un equilibrio riguroso entre:
1. **Fricción mínima en la conversión de usuarios:** Ofrecer opciones modernas tanto tradicionales (registro con correo y contraseña) como federadas (inicio rápido con cuenta de Google OAuth2).
2. **Seguridad y verificación de identidad:** Prevenir el registro masivo con correos inexistentes o fraudulentos mediante validación por código numérico de un solo uso (OTP).
3. **Calibración pedagógica obligatoria (Onboarding):** Independientemente de la vía de acceso, cada estudiante debe registrar sus preferencias de aprendizaje (lenguaje tecnológico inicial, nivel autodeclarado de programación, metas diarias de estudio y estilo pedagógico) antes de ingresar al roadmap interactivo, garantizando una experiencia personalizada.
4. **Gobernanza de desarrollo desacoplado (Autoskills):** Conforme al `koda-backend-workflow.md` (ADR-015), el equipo de backend debe proveer los contratos, casos de uso y persistencia relacional sin modificar `apps/web/`, delegando la experiencia de interfaz a la respectiva historia de usuario del equipo frontend.

---

## 2. Decisión Adoptada

### 2.1 Proveedor Criptográfico y Gestión de Identidad (Supabase Auth)
- Se delega la custodia de credenciales, el cifrado y la emisión de tokens JWT en **Supabase Auth**.
- **Registro Tradicional:** Inicia con `POST /api/v1/auth/register-otp`, enviando un código OTP de 6 dígitos al correo del usuario.
- **Verificación OTP:** El endpoint `POST /api/v1/auth/verify-otp` valida el código mediante `supabase.auth.verifyOtp()`, aprovisiona la cuenta en `public.users` (PostgreSQL) si aún no existe y emite los tokens de sesión.
- **Acceso con Google OAuth2:** Supabase Auth gestiona el flujo OIDC/OAuth2 con Google. Al verificar la sesión vía `POST /api/v1/auth/verify-session`, el backend aprovisiona al usuario en PostgreSQL y lee el estado de su onboarding.

### 2.2 Control de Estado de Onboarding en Dominio y Persistencia
- Se incorpora la columna `onboarding_completed` (Boolean, `@default(false)`) en la tabla `User` de Prisma (`schema.prisma`) y en `UserEntity` (`apps/api/src/domain/entities/user.entity.ts`).
- Se expone el caso de uso `CompleteOnboardingUseCase` y el endpoint `POST /api/v1/auth/onboarding` (protegido por `SupabaseAuthGuard`) para persistir de manera atómica las preferencias pedagógicas (`initialLanguageSlug`, `experienceLevel`, `learningStyle`, `dailyGoalId`, `dailyGoalMinutes`) tanto en PostgreSQL como en los metadatos de Supabase Auth (`raw_user_meta_data`).
- Se provee el endpoint `GET /api/v1/auth/onboarding-status` para que los guards y middlewares del cliente verifiquen si el usuario debe ser redirigido obligatoriamente al onboarding antes de interactuar con el roadmap.

### 2.3 Desacoplamiento de Responsabilidades (Backend vs. Frontend)
- **Alcance Backend (`feat/backend-auth-05-otp-oauth-onboarding`):**
  - Entidad de dominio, mappers, esquemas Prisma y migraciones.
  - Servicios de infraestructura `SupabaseService` (signUp, verifyOtp, resendOtp, updateUserMetadata).
  - Casos de uso (`RegisterWithOtpUseCase`, `VerifyOtpUseCase`, `CompleteOnboardingUseCase`).
  - DTOs tipados y documentados en OpenAPI / Swagger en `AuthController`.
  - Pruebas unitarias completas con 100% de aprobación.
- **Alcance Frontend (Próxima HU para el equipo frontend):**
  - El diseño visual del modal de OTP, los botones de Google OAuth2 y el enrutador `/auth/callback` en `apps/web/` quedan formalmente programados para la historia de usuario del equipo de frontend, manteniendo el aislamiento estricto de repositorios.

---

## 3. Consecuencias

### Positivas:
- **Seguridad Robusta:** Cuentas validadas con OTP numérico sin necesidad de links temporales vulnerables.
- **Experiencia de Usuario:** Flexibilidad de registro con correo tradicional o Google en un clic.
- **Integridad Curricular:** Ningún estudiante puede eludir la calibración de su nivel y objetivos antes de entrar al grafo DAG de aprendizaje.
- **Cumplimiento de Gobernanza:** Aislamiento 100% garantizado entre backend y frontend siguiendo `koda-backend-workflow.md`.

### Negativas / Mitigaciones:
- Requiere configuración de credenciales del proveedor Google en la consola de Supabase (Client ID y Secret de Google Cloud Console).
