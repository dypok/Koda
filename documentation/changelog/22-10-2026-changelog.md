# Changelog: 22-10-2026

- [Thursday]-[22/10/2026]-[06:51]-[Dylan Gamero] : Implement automatic client-side redirection to student roadmap in AdminGuard for non-admin users with branded KodaLoadingScreen transition.
- [Thursday]-[22/10/2026]-[22:45]-[Equipo Koda & Dylan Gamero] : Implementación del Endurecimiento Integral de Ciberseguridad y Defensa en Profundidad (ADR-018):
  - Creación de SecurityExceptionFilter para supresión total de stack traces y errores de base de datos en producción (Zero-Leakage).
  - PiiMaskingLoggerInterceptor para ofuscación y redacción de contraseñas, tokens JWT y números de documento en logs.
  - Blindaje con Rate Limiting estricto (Throttling) anti-fuerza bruta en /auth/* y restricción de payloads a 100 KB contra DoS.
  - Refuerzo de cabeceras Helmet (HSTS preload, X-Frame-Options DENY, noSniff, xssFilter) y bloqueo estricto de CORS para orígenes no autorizados en producción.
  - Desactivación automática de Swagger e Introspección GraphQL en producción.
  - Content Security Policy (CSP) en Next.js y sanitización activa de URLs en renderers Markdown frente a vectores XSS.
  - Soporte de cookies seguras HttpOnly para refresco de sesiones anti-robo de tokens.
  - Blindaje anti-IDOR en NotebookResolver vinculando la identidad únicamente al token JWT verificado.
  - Creación de scripts/security-audit.js para prevención y escaneo de secretos y llaves privadas en el repositorio.
