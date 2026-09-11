# 🟣 EPIC 3 — Autenticación, Perfiles de Usuario y Onboarding
`Sprint 2 · v1.0 · Color Jira: Morado · Código: AUTH`

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
- [ ] [BD] Configurar Supabase Auth con proveedores Email/Password y tabla `auth.users` vinculada a `public.profiles`.
- [ ] [BACKEND] Implementar `AuthModule` en `apps/api/src/modules/auth/` con endpoints `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`.
- [ ] [BACKEND] Configurar `JwtAuthGuard` y decorador `@CurrentUser()` para inyección de usuario autenticado en controladores.
- [ ] [BACKEND] Implementar servicio de rotación de Refresh Tokens con almacenamiento de hash en tabla de sesiones.
- [ ] [FRONTEND] Configurar interceptor en `apiClient` para auto-renovación silenciosa del token al recibir 401.
- [x] [FRONTEND] Diseñar formulario de registro interactivo en `apps/web/src/app/(auth)/` con validación Zod, feedback de errores, paleta Dark Navy y React Hook Form (`feat/register-frontend`).
- [ ] [FRONTEND] Persistir estado de autenticación en Zustand `authStore` y sincronizar con cookie de sesión.

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
- [ ] [BACKEND] Endpoint `POST /api/v1/learning/diagnostic/submit` que evalúa respuestas del test diagnóstico y calcula el `recommended_module_id`.
- [ ] [BACKEND] Endpoint `GET /api/v1/learning/diagnostic/questions` que entrega 12 preguntas calibradas sin revelar las respuestas correctas.
- [ ] [FRONTEND] Diseñar pantalla de onboarding `apps/web/src/app/onboarding/page.tsx` con cards interactivas de autodeclaración de nivel.
- [ ] [FRONTEND] Implementar vista del test diagnóstico con stepper de progreso y temporizador formativo.
- [ ] [FRONTEND] Modal de resultados con animación de Koda 🦊 celebrando el módulo de entrada recomendado.

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
- [ ] [BD] Verificar tabla `user_profiles` en Supabase con función `pgp_sym_encrypt` para número de identificación legal.
- [ ] [BACKEND] Controlador `UsersController` con endpoints de lectura y actualización parcial de perfil.
- [ ] [FRONTEND] Pantalla `apps/web/src/app/perfil/page.tsx` con grid de estadísticas, badge de nivel y selector de avatares.
- [ ] [FRONTEND] Formulario de edición con validación de nombre y cédula/pasaporte.
- [ ] [FRONTEND] Toast interactivo de confirmación al actualizar datos.

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
- [ ] [BACKEND] Configurar plantilla de email transaccional en Supabase Auth / Resend con diseño institucional Koda.
- [ ] [BACKEND] Implementar endpoints de solicitud y confirmación de reset con validación de token seguro.
- [ ] [FRONTEND] Pantalla `apps/web/src/app/(auth)/recuperar/page.tsx` con input de email y feedback amigable.
- [ ] [FRONTEND] Pantalla `apps/web/src/app/(auth)/nueva-clave/page.tsx` para digitar y confirmar nueva contraseña.

**DoD adicional para esta US:**
- Token invalidado inmediatamente tras ser consumido una vez.
