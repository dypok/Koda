# ADR-018: Endurecimiento Transversal de Ciberseguridad, Protección Anti-Leakage y Defensa en Profundidad

- **Estado:** Aceptado
- **Fecha:** 2026-10-22
- **Autor:** Equipo de Arquitectura & Seguridad Koda
- **Rama:** `feat/security-hardening`
- **Requisitos vinculados:** RF-AUTH-001 a RF-AUTH-008, RNF-008, RNF-009, RNF-037 a RNF-045, `19_SECURITY.md`.

---

## 1. Contexto y Problema

A medida que Koda Academy evolucionó integrando la superficie híbrida REST/GraphQL, el sistema de autenticación dual OTP/OAuth2 y el panel de administración, se identificó la necesidad de robustecer las defensas operativas de la plataforma conforme al estándar OWASP Top 10 y el documento directriz de seguridad (`19_SECURITY.md`).

Existían vectores potenciales de vulnerabilidad que debían mitigarse preventivamente:
1. **Fuga de Información (Information Disclosure)**: Errores no controlados (500) que pudiesen exponer stack traces, consultas Prisma/SQL o esquemas internos hacia el exterior.
2. **Exposición de PII y Credenciales en Observabilidad**: Posible registro en consola o logs de passwords, tokens JWT o documentos legales.
3. **Ataques de Fuerza Bruta y DoS**: Necesidad de límites estrictos de tasa (Rate Limiting) en endpoints críticos de autenticación (`/auth/*`) y restricción de tamaño de payloads.
4. **Vectores XSS y Manipulación de Enlaces**: Ausencia de Content Security Policy (CSP) en Next.js y riesgo de secuestro de sesión mediante robo de `refresh_token` en almacenamiento local frontend.
5. **Riesgo IDOR (Insecure Direct Object References)**: Dependencia de parámetros `userId` enviados por el cliente en consultas de cuaderno de repaso en lugar de resolverlo exclusivamente por el token de sesión verificado.

---

## 2. Decisiones Tomadas y Justificación Técnica

### D-01: Zero-Leakage Exception Filter (`SecurityExceptionFilter`)
- **Decisión**: Se implementa un filtro global de excepciones para NestJS.
- **Razón**: En entorno de producción (`NODE_ENV === 'production'`), cualquier error no controlado responde con un JSON estandarizado `{ statusCode: 500, message: "Internal server error", timestamp, path }`. El stack trace completo, parámetros SQL y contexto técnico solo se emiten al Logger interno protegido.

### D-02: Ofuscación Activa de PII y Credenciales (`PiiMaskingLoggerInterceptor`)
- **Decisión**: Interceptor global que sanitiza recursivamente bodies y query params de todas las peticiones HTTP.
- **Razón**: Previene que claves como `password`, `token`, `refreshToken`, `document_number`, `secret` o `api_key` sean persistidas o impresas en texto plano en la observabilidad.

### D-03: Throttling Severo y Blindaje de Superficie HTTP
- **Decisión**:
  - `POST /auth/register-otp`: 5 req/min.
  - `POST /auth/verify-otp`: 10 req/min.
  - `POST /auth/reset-password`: 5 req/min.
  - `POST /auth/verify-session`: 15 req/min.
  - `POST /auth/refresh-session`: 20 req/min.
  - Payload JSON restringido a 100 KB para evitar agotamiento de memoria.
  - Helmet estricto con HSTS (1 año + preload), `X-Frame-Options: DENY` (anti-clickjacking), `noSniff` y `xssFilter`.
  - En producción, OpenAPI Swagger (`/api/docs`) y GraphQL Playground/Introspección (`__schema`) se apagan automáticamente.

### D-04: Sesiones Seguras con Cookies `HttpOnly`
- **Decisión**: Integrar `cookie-parser` y fijar el `refresh_token` en una cookie con banderas `HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth`.
- **Razón**: Si el frontend llega a ser comprometido por un script malicioso, el atacante no puede extraer el token de renovación desde `localStorage` ni `sessionStorage` porque JavaScript carece de acceso a la cookie.

### D-05: Content Security Policy (CSP) y Sanitización de Enlaces
- **Decisión**:
  - Inyección de cabecera CSP en Next.js (`apps/web/next.config.mjs`) delimitando dominios permitidos (`self`, Supabase, fuentes oficiales de Google Fonts).
  - Sanitización en [`markdown-content.tsx`](file:///C:/Users/Usuario/Documents/GitHub/Koda-academy/apps/web/src/components/ui/markdown-content.tsx) validando protocolos seguros (`http`, `https`, `/`, `#`, `mailto:`) y neutralizando vectores `javascript:` o `data:`.

### D-06: Erradicación de IDOR en Resolvers
- **Decisión**: En [`NotebookResolver`](file:///C:/Users/Usuario/Documents/GitHub/Koda-academy/apps/api/src/presentation/graphql/notebook/notebook.resolver.ts), se removió la posibilidad de inyectar `userId` arbitrario por argumento.
- **Razón**: El `userId` se extrae inmutablemente del token de sesión verificado a través de `@CurrentUser()` respaldado por `SupabaseAuthGuard`.

### D-07: Script de Auditoría Preventiva de Secretos
- **Decisión**: Creación de `scripts/security-audit.js` para escanear archivos en staging antes de cada commit o en pipelines CI, evitando que tokens, claves privadas RSA o archivos `.env` sean agregados al control de versiones.

---

## 3. Consecuencias

### Positivas
- **Inmunidad al mapeo de API**: Atacantes no pueden introspeccionar esquemas ni consultar documentación en producción.
- **Prevención de escalada y suplantación**: Ningún usuario puede inspeccionar ni manipular datos de errores de otros estudiantes.
- **Defensa en profundidad garantizada**: Protección coordinada entre frontend (CSP, sanitización), capas intermedias (Helmet, CORS, Throttler) y backend (Filtros, Interceptores, RBAC).

### Negativas / Compromisos
- En producción, los errores no controlados requieren consultar los logs del servidor para diagnosticar la causa raíz, ya que el cliente exterior no recibe pistas de depuración.
