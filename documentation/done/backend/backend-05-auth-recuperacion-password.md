# Entregable Backend HU AUTH-04: Recuperación de Contraseña y Verificación de Correo

- **ID Historia de Usuario:** AUTH-04
- **Épica:** Épica 3 (Sprint 2) - Autenticación, Perfiles de Usuario y Onboarding
- **Rama:** `feat/backend-auth-04-recuperacion-password`
- **Autor:** Dylan Gamero
- **Fecha:** 20/09/2026
- **Estado:** ✅ Backend Completado al 100% · ⚪ Frontend delimitado para desarrollo en `apps/web/` (`apps/web/src/app/(auth)/recuperar/page.tsx` y `apps/web/src/app/(auth)/nueva-clave/page.tsx`)
- **Trazabilidad:** `19_SECURITY.md` §6, §10, `05_FUNCTIONAL_REQUIREMENTS.md` RF-AUTH-*, `ADR-002`, `ADR-015`

---

## 1. Resumen de la Implementación Backend

En estricto cumplimiento del protocolo de gobernanza `koda-backend-workflow.md` (ADR-015):
1. **Aislamiento Estricto de Código:** **0 archivos modificados en `apps/web/`**. Las pantallas de solicitud (`/recuperar`) y restablecimiento (`/nueva-clave`) quedan delimitadas para el equipo de frontend.
2. **Mitigación de Enumeración de Cuentas (OWASP):** El endpoint `POST /api/v1/auth/forgot-password` retorna **siempre** una respuesta uniforme idéntica `HTTP 200 OK` con un retardo controlado contra timing attacks si el usuario no existe, impidiendo que un atacante determine qué correos están registrados en la plataforma.
3. **Rate Limiting Estricto:** Aplicación de `@Throttle({ default: { limit: 3, ttl: 3600000 } })` en el endpoint de recuperación, restringiendo a un máximo de 3 solicitudes por IP por hora (`19_SECURITY.md` §10).
4. **Validación de Robustez de Contraseña:** En `ResetPasswordDto`, se exige cumplimiento de la política de seguridad: mínimo 8 caracteres, al menos 1 letra mayúscula, 1 minúscula, 1 número y 1 carácter especial (`@$!%*?&#^()_-`).
5. **Consumo Único e Invalidación Inmediata de Token:** La verificación con `SupabaseService.verifyRecoveryOtp` con tipo `recovery` consume el token de un solo uso; tras actualizar la contraseña, el token queda completamente invalidado en Supabase Auth.

---

## 2. Componentes Creados y Modificados (Backend)

### A. Capa de Infraestructura
- **`apps/api/src/database/supabase.service.ts`:**
  - `resetPasswordForEmail(email: string, redirectTo?: string)`: Despacha correo transaccional de recuperación con enlace firmado y TTL de 15 minutos.
  - `verifyRecoveryOtp(token: string, email?: string)`: Valida el código OTP numérico o token hash de recuperación temporal.
  - `updateUserPassword(userId: string, newPassword: string)`: Actualiza de forma segura la contraseña en Supabase Auth invalidando tokens previos.

### B. Capa de Aplicación (Casos de Uso y DTOs)
- **DTOs:**
  - `apps/api/src/presentation/rest/auth/dto/forgot-password.dto.ts`: Normalización y validación de correo RFC 5322 con `@IsEmail()` y anotaciones OpenAPI.
  - `apps/api/src/presentation/rest/auth/dto/reset-password.dto.ts`: Validación de token, correo opcional y complejidad de contraseña con regex OWASP.
- **Casos de Uso:**
  - `apps/api/src/application/use-cases/auth/forgot-password.use-case.ts`: Orquesta la búsqueda silenciosa en base de datos, simula tiempo de procesamiento en fallos de existencia y emite el correo con Supabase Auth.
  - `apps/api/src/application/use-cases/auth/reset-password.use-case.ts`: Valida el token contra Supabase, actualiza la contraseña e invalida el token.
  - `apps/api/src/application/use-cases/auth/forgot-password.use-case.spec.ts`: Tests unitarios para caso exitoso, correo inexistente (OWASP) y fallo tolerante de proveedor.
  - `apps/api/src/application/use-cases/auth/reset-password.use-case.spec.ts`: Tests unitarios para validación exitosa, token expirado/inválido y manejo de errores.

### C. Capa de Presentación REST
- **`apps/api/src/presentation/rest/auth/auth.controller.ts`:**
  - `POST /api/v1/auth/forgot-password`: Endpoint público con `@Throttle(3 req/hora)` y documentación Swagger bajo tag `Auth`.
  - `POST /api/v1/auth/reset-password`: Endpoint público para confirmación y actualización de credenciales.
- **`apps/api/src/presentation/rest/auth/auth.module.ts`:**
  - Registro e inyección de `ForgotPasswordUseCase` y `ResetPasswordUseCase`.

---

## 3. Endpoints Disponibles y Contratos REST

| Método | Ruta | Rate Limit | Auth Guard | Descripción |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/forgot-password` | 3 req / hora / IP | Ninguno (Público) | Envía enlace de recuperación (TTL 15 min). Respuesta 200 genérica contra enumeración OWASP. |
| `POST` | `/api/v1/auth/reset-password` | Default global (100 req/min) | Ninguno (Público) | Valida token de un solo uso y actualiza la contraseña segura del usuario. |

### Ejemplo Request / Response `POST /api/v1/auth/forgot-password`:
```json
// Request
{
  "email": "estudiante@koda.academy"
}

// Response (HTTP 200 OK - Idéntica exista o no la cuenta)
{
  "message": "Si el correo existe en nuestra plataforma, recibirás un enlace de recuperación con las instrucciones."
}
```

### Ejemplo Request / Response `POST /api/v1/auth/reset-password`:
```json
// Request
{
  "token": "384912",
  "email": "estudiante@koda.academy",
  "newPassword": "KodaPass#2026"
}

// Response (HTTP 200 OK)
{
  "message": "Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.",
  "success": true
}
```

---

## 4. Pruebas y Verificación

### Compilación TypeScript:
```bash
pnpm --filter api build
# Exit code 0, 0 errores de TypeScript
```

### Pruebas Unitarias Jest:
```bash
pnpm --filter api test
```
**Resultado:**
- Test Suites: 9 passed, 9 total (100%)
- Tests: 30 passed, 30 total (100%)
- Casos probados en AUTH-04:
  - Solicitud de reset con correo existente.
  - Mitigación de enumeración (OWASP) para correo inexistente.
  - Tolerancia y logging en fallos de red o SMTP.
  - Validación de token válido y actualización de contraseña.
  - Rechazo de token expirado o inválido con BadRequestException.
  - Rechazo cuando el proveedor Supabase rechaza las credenciales.
