# 🟣 EPIC 3 — Autenticación, Perfiles de Usuario y Onboarding
`Sprint 2 · v2.0 · Color Jira: Morado · Código: AUTH · 5 Stories · 21 SP · ESTADO: 🟢 100% COMPLETADA`

> Esta épica cubre el ciclo de vida de identidad del usuario en Koda 🦊: registro seguro, inicio de sesión mediante JWT stateless con refresh rotativo HttpOnly, prueba diagnóstica inicial, configuración de perfil y persistencia en Supabase Auth (`19_SECURITY.md`, `05_FUNCTIONAL_REQUIREMENTS.md` RF-AUTH-*).

---

### AUTH-01 — Registro de usuario e inicio de sesión con JWT rotativo
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Lead + Frontend Developer  
**Rama sugerida:** `feature/auth-jwt-supabase`

**Historia de usuario:**
> "Como nuevo estudiante, quiero crear una cuenta e iniciar sesión con credenciales seguras,
> para que mi progreso de aprendizaje, estrellas y racha queden guardados de forma permanente."

**Criterios de aceptación:**
- Registro con validación de: nombre completo, correo electrónico válido (RFC 5322) y contraseña segura (mínimo 8 caracteres, al menos 1 número y 1 carácter especial).
- Hash de contraseñas con Argon2id / bcrypt gestionado por Supabase Auth (`RNF-009`).
- Emisión de Access Token JWT (15 minutos de expiración) y Refresh Token rotativo almacenado en cookie `HttpOnly`, `Secure`, `SameSite=Lax` con TTL de 7 días (`19` §6).
- Detección de reuso de Refresh Token: invalida todas las sesiones activas en cascada si un token previamente rotado es reutilizado.
- Cierre de sesión (`POST /auth/logout`): revoca el token en el backend y limpia el almacenamiento en el cliente.
- Manejo de respuestas 401 Unauthorized sin fugas de información.

**Subtasks:**
- [x] [BD] Configurar Supabase Auth con proveedores Email/Password y tabla `auth.users` vinculada a `public.users` (`schema.prisma`).
- [x] [BACKEND] Implementar `AuthModule` en `apps/api/src/presentation/rest/auth/` con endpoints de sesión y validación de tokens (`POST /api/v1/auth/verify-session`, `GET /api/v1/auth/session`).
- [x] [BACKEND] Configurar `SupabaseAuthGuard` y decorador `@CurrentUser()` para inyección de usuario autenticado en controladores.
- [x] [BACKEND] Implementar servicio de autenticación delegada en Supabase Auth con rotación y auto-aprovisionamiento (`ValidateUserSessionUseCase`).
- [x] [FRONTEND] Configurar interceptor en `apiClient` para auto-renovación silenciosa del token al recibir 401 (`AuthService.authFetch` y `scheduleBackgroundRefresh`).
- [x] [FRONTEND] Diseñar formulario de registro interactivo en `apps/web/src/app/(auth)/` con validación Zod, feedback de errores, paleta Dark Navy y React Hook Form (`feat/register-frontend`).
- [x] [FRONTEND] Persistir estado de autenticación en Zustand `authStore` y sincronizar con cookie de sesión y localStorage.

**DoD adicional para esta US:**
- Flujo completo probado: registro $\rightarrow$ login $\rightarrow$ navegación protegida $\rightarrow$ refresh silencioso $\rightarrow$ logout verificado en Swagger `/api/docs`.

---

### AUTH-02 — Declaración de nivel y Evaluación Diagnóstica Inicial
**Tipo:** Story | **SP:** 5 | **Prioridad:** Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/onboarding-diagnostico`

**Historia de usuario:**
> "Como estudiante nuevo, quiero autodeclarar mi nivel y responder un breve test diagnóstico opcional de 12 preguntas,
> para que Koda recomiende mi punto de entrada ideal en la ruta de Python sin obligarme a repetir conceptos que ya domino."

**Criterios de aceptación:**
- Selector de nivel declarado en pantalla de onboarding: *Principiante Absoluto*, *Intermedio*, *Semi-Pro*, *Profesional* (`01` §8, `14` §5).
- Si el usuario declara nivel Principiante, es asignado directamente al Módulo 01 (Fundamentos) sin examen forzado.
- Si declara nivel superior, se activa el test diagnóstico estratificado de 12 preguntas de opción única cubriendo los 4 primeros módulos de Python.
- Algoritmo de cálculo de punto de entrada (`14` §5.4):
  - $\ge 80\%$ en Bloque B1 (M01-M03) $\rightarrow$ desbloquea Módulo 04.
  - $\ge 80\%$ en Bloque B2 (M04-M06) $\rightarrow$ desbloquea Módulo 07.
  - Clamping por nivel declarado para evitar desbloqueos accidentales por adivinación.
- Los módulos aprobados por diagnóstico quedan marcados con bandera `unlocked_by_diagnostic=true` con 3 estrellas simbólicas.
- Opción clara de "Omitir diagnóstico y empezar desde cero".

**Subtasks:**
- [x] [BACKEND] Endpoint `POST /api/v1/learning/diagnostic/submit` que evalúa respuestas del test diagnóstico, aplica clamping y calcula el `recommended_module_id` (Entregable: `documentation/done/backend/backend-04-auth-onboarding-diagnostico.md`).
- [x] [BACKEND] Endpoint `GET /api/v1/learning/diagnostic/questions` que entrega 12 preguntas calibradas sin revelar las respuestas correctas.
- [x] [FRONTEND] Diseñar pantalla de onboarding `apps/web/src/app/onboarding/page.tsx` con cards interactivas de autodeclaración de nivel.
- [x] [FRONTEND] Implementar vista del test diagnóstico con stepper de progreso y temporizador formativo (`DiagnosticTestModal.tsx`).
- [x] [FRONTEND] Modal de resultados con animación de Koda 🦊 celebrando el módulo de entrada recomendado (`DiagnosticResultModal.tsx`).

**DoD adicional para esta US:**
- Cobertura de tests unitarios verificando los 4 casos del algoritmo de clamping y determinación de módulo de inicio.

---

### AUTH-03 — Gestión de Perfil de Usuario y Preferencias
**Tipo:** Story | **SP:** 3 | **Prioridad:** Media | **Asignado:** Frontend Developer  
**Rama sugerida:** `feature/perfil-usuario`

**Historia de usuario:**
> "Como usuario de Koda, quiero ver y editar mi perfil personal (nombre, avatar de Koda, número de documento para certificados),
> para personalizar mi experiencia y asegurar que mis futuros diplomas salgan con mi nombre oficial correcto."

**Criterios de aceptación:**
- Endpoint `GET /api/v1/users/me` entrega: nombre, email, avatar, fecha de registro, XP total, nivel actual, racha y documento enmascarado (`CC ***678`).
- Endpoint `PATCH /api/v1/users/me` permite modificar: `full_name`, `avatar_id`, `theme_preference` y `document_number` (cifrado simétrico en BD `19` §14).
- Selector de avatares oficiales con expresiones de Koda 🦊 (Koda Clásico, Koda Detective, Koda Astronauta, Koda Hacker).
- Visualización de estadísticas del estudiante: lecciones completadas, porcentaje de maestría en Python 3.12, certificados obtenidos.

**Subtasks:**
- [x] [BD] Verificar tabla `public.users` en PostgreSQL (Supabase) con persistencia de campos `document_type`, `document_number`, `avatar_url`, `bio` y metas de estudio.
- [x] [BACKEND] Implementar `UsersController` con endpoints de lectura (`GET /api/v1/users/me`) y actualización parcial (`PATCH /api/v1/users/me`), casos de uso hexagonales y enmascaramiento de cédula (Entregable: `documentation/done/backend/backend-03-auth-perfil-usuario.md`).
- [x] [FRONTEND] Pantalla `apps/web/src/app/perfil/page.tsx` con grid de estadísticas, badge de nivel y selector de avatares.
- [x] [FRONTEND] Formulario de edición con validación de nombre y cédula/pasaporte con enmascaramiento PII.
- [x] [FRONTEND] Toast interactivo de confirmación al actualizar datos (`ProfileToast`).
- [x] [FRONTEND] Menú desplegable en el HUD superior derecho (`ProfileDropdownMenu`) y modal de configuración integral (`ProfileSettingsModal`).

**DoD adicional para esta US:**
- El número de documento se transmite con TLS y se devuelve enmascarado en la API pública.

---

### AUTH-04 — Recuperación de Contraseña y Verificación de Correo
**Tipo:** Story | **SP:** 3 | **Prioridad:** Media | **Asignado:** Backend Developer  
**Rama sugerida:** `feature/recuperacion-password`

**Historia de usuario:**
> "Como usuario que olvidó su contraseña, quiero recibir un enlace temporal en mi correo electrónico,
> para restablecer mi acceso a la plataforma sin perder mi progreso educativo."

**Criterios de aceptación:**
- Endpoint `POST /auth/forgot-password`: recibe email y envía token firmado de restablecimiento con TTL de 15 minutos.
- Endpoint `POST /auth/reset-password`: valida token de un solo uso y actualiza la contraseña en Supabase Auth.
- Prevención de enumeración de cuentas: el endpoint siempre devuelve el mismo mensaje genérico ("Si el correo existe, recibirás un enlace de recuperación").
- Rate limiting estricto: máximo 3 solicitudes de recuperación por IP por hora (`19` §10).

**Subtasks:**
- [x] [BACKEND] Configurar plantilla de email transaccional en Supabase Auth / Resend con diseño institucional Koda y TTL 15 min.
- [x] [BACKEND] Implementar endpoints de solicitud y confirmación de reset con validación de token seguro (`POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`) con rate limiting y prevención OWASP (Entregable: `documentation/done/backend/backend-05-auth-recuperacion-password.md`).
- [x] [FRONTEND] Flujo de recuperación de contraseña integrado en modal de login (`AuthService.requestPasswordReset`).
- [x] [FRONTEND] Pantalla `apps/web/src/app/nueva-clave/page.tsx` para digitar y confirmar nueva contraseña con validación de complejidad de clave.

**DoD adicional para esta US:**
- Token invalidado inmediatamente tras ser consumido una vez.

---

### AUTH-05 — Registro y Autenticación Dual (Email/Password + OTP y Google OAuth2) con Onboarding E-Learning
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feat/backend-auth-05-otp-oauth-onboarding`

**Historia de usuario:**
> "Como nuevo estudiante de Koda,
> quiero poder registrarme usando credenciales tradicionales (con validación de correo vía código OTP) o mediante mi cuenta de Google OAuth2,
> para acceder de forma rápida y segura a la plataforma, asegurando que mis preferencias de aprendizaje (lenguaje, nivel, estilo y metas diarias) queden guardadas en mi perfil de forma obligatoria e independiente del método seleccionado."

**Criterios de aceptación (Gherkin):**
- [x] **Escenario 1 (Registro Tradicional + OTP):**
  - **Dado** que el usuario ingresa su nombre, correo y contraseña segura en el formulario de registro,
  - **Cuando** presiona "Crear cuenta",
  - **Entonces** Supabase Auth crea la cuenta en estado pendiente de verificación y envía un código OTP de 6 dígitos a su correo; el usuario visualiza una pantalla/modal para ingresar el código. Al verificar el OTP exitosamente, se inicia la sesión y se consolidan los datos del onboarding en su perfil interno.
- [x] **Escenario 2 (Registro con Google OAuth2):**
  - **Dado** que el usuario selecciona "Continuar con Google",
  - **Cuando** autoriza sus credenciales en la pantalla de consentimiento de Google,
  - **Entonces** Supabase Auth crea la identidad federada; al retornar a la plataforma, el sistema detecta que es un usuario nuevo (`onboarding_completed = false`) y lo transfiere automáticamente a completar las preguntas del onboarding (tecnología, nivel, metas, estilo) antes de permitir el ingreso al roadmap de cursos.
- [x] **Escenario 3 (Continuidad del Onboarding Previo):**
  - **Dado** que el usuario ya seleccionó tecnología, nivel y metas en los primeros pasos del onboarding y en el último paso elige "Continuar con Google",
  - **Cuando** concluye la autenticación externa,
  - **Entonces** las preferencias previas almacenadas temporalmente se sincronizan automáticamente con el backend sin obligarlo a repetir las selecciones.
- [x] **Escenario 4 (Persistencia y Sincronización Interna en Supabase):**
  - **Dado** un usuario autenticado por cualquiera de los dos métodos,
  - **Cuando** se completan las preferencias de onboarding,
  - **Entonces** el backend actualiza la tabla `public.users` en PostgreSQL (vía Prisma), sincroniza los metadatos en `auth.users.raw_user_meta_data` y marca `onboarding_completed = true`.
- [x] **Escenario 5 (Seguridad y Resiliencia del OTP):**
  - **Dado** que el código OTP expira (TTL 10 min) o se digita incorrectamente,
  - **Cuando** el usuario interactúa con la interfaz,
  - **Entonces** recibe mensaje de error descriptivo con opción de solicitar reenvío (`Resend OTP`), sujeto a rate-limiting (máximo 3 reenvíos por hora).

**Subtasks:**
- [x] [BD] Agregar campo `onboardingCompleted` (Boolean @default(false)) en `schema.prisma` y actualizar `UserEntity`.
- [x] [BACKEND] Implementar métodos en `SupabaseService` para `signUpWithEmail`, `verifyOtp`, `resendOtp` y `updateUserMetadata`.
- [x] [BACKEND] Crear casos de uso `RegisterWithOtpUseCase`, `VerifyOtpUseCase` y `CompleteOnboardingUseCase` con validaciones de dominio.
- [x] [BACKEND] Exponer endpoints en `AuthController`:
  - `POST /api/v1/auth/register-otp`: Inicia registro y envío de código OTP.
  - `POST /api/v1/auth/verify-otp`: Valida código OTP y emite sesión con tokens.
  - `POST /api/v1/auth/onboarding`: Registra y sincroniza las preferencias educativas finales (`onboarding_completed=true`).
  - `GET /api/v1/auth/onboarding-status`: Consulta el estado de onboarding del usuario actual.
- [x] [TESTS] Pruebas unitarias de casos de uso backend (Jest 100% passed: 4 suites, 11 tests).
- [x] [FRONTEND] Implementar cliente en `apps/web` con soporte OAuth Google y GitHub (`AuthService.getOAuthRedirectUrl`).
- [x] [FRONTEND] Diseñar vista/modal de validación de código OTP con temporizador de expiración y botón de reenvío (`RegisterOtpModal.tsx`).
- [x] [FRONTEND] Procesar el retorno de Google OAuth2 en `LoginPage` y `RegisterPage` y enrutar inteligentemente a `/register` (si falta onboarding) o a `/`.

**DoD adicional para esta US:**
- Backend listo y verificado con 100% de tests aprobados; frontend desacoplado conforme a las reglas del `koda-backend-workflow.md` (ADR-015).


