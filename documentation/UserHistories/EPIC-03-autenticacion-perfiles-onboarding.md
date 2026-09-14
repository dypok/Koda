# 🟣 EPIC 3 — Autenticación, Perfiles de Usuario y Onboarding
`Sprint 2 · v2.0 · Color Jira: Morado · Código: AUTH`

> Esta épica cubre el ciclo de vida de identidad del usuario en Koda 🦊: registro seguro e inicio de sesión mediante **Supabase Auth** (`auth.users`), aprovisionamiento automático sin redundancia hacia la tabla relacional consolidada `public.users` (`ADR-002`, `ADR-009`), Wizard de Onboarding interactivo de 5 pasos en el frontend (`apps/web`), prueba diagnóstica inicial opcional, gestión de perfil unificado y métricas en tiempo real.

---

### AUTH-01 — Registro de usuario y autenticación con Supabase Auth (Sin Redundancia)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Lead + Frontend Developer  
**Rama sugerida:** `feature/auth-jwt-supabase`  
**Trazabilidad:** `ADR-002`, `ADR-009`, `19_SECURITY.md`

**Historia de usuario:**
> "Como nuevo estudiante, quiero crear una cuenta e iniciar sesión mediante Supabase Auth con credenciales seguras,
> para que mi identidad se gestione de forma segura y mi perfil en Koda se aprovisione automáticamente sin duplicar contraseñas."

**Criterios de aceptación:**
- Registro con validación de: nombre completo, correo electrónico válido (RFC 5322) y contraseña segura (mínimo 8 caracteres, al menos 1 número y 1 carácter especial).
- Gestión exclusiva de contraseñas mediante **Supabase Auth** (`auth.users`) con cifrado Argon2id / bcrypt (`RNF-009`). Cero almacenamiento de contraseñas o hashes en `public.users`.
- Clave foránea directa: `public.users.id` referencia a `auth.users.id` con `ON DELETE CASCADE`.
- Trigger automático de Postgres `on_auth_user_created` en Supabase: ante cualquier registro en `auth.users`, inserta automáticamente la fila en `public.users` con la metadata de onboarding (`raw_user_meta_data`).
- Emisión de Access Token JWT (15 minutos) y Refresh Token rotativo almacenado de forma segura con rotación automática.
- Cierre de sesión (`POST /auth/logout` o `supabase.auth.signOut()`): revoca la sesión y limpia el almacenamiento en el cliente.
- Políticas de Row Level Security (RLS) habilitadas en `public.users` con acceso exclusivo para el usuario autenticado (`auth.uid() = id`) y visualización pública de datos de leaderboard (`status = 'active'`).

**Subtasks:**
- [x] [BD] Configurar tabla consolidada `public.users` vinculada a `auth.users(id)` con RLS y trigger `on_auth_user_created`.
- [ ] [BACKEND] Implementar `AuthModule` en `apps/api/src/modules/auth/` con verificación de tokens Supabase y guards de autenticación.
- [ ] [BACKEND] Configurar `JwtAuthGuard` y decorador `@CurrentUser()` para inyección del usuario autenticado en controladores NestJS.
- [ ] [FRONTEND] Configurar cliente de Supabase (`@supabase/ssr` / `@supabase/supabase-js`) en `apps/web` para sesión persistente.
- [x] [FRONTEND] Diseñar formulario de autenticación interactivo en `apps/web/src/app/login/page.tsx` y `apps/web/src/views/login/` con validación Zod y React Hook Form.
- [x] [FRONTEND] Persistir estado de autenticación en Zustand `auth.store.ts`.

**DoD adicional para esta US:**
- Flujo completo probado: registro en Supabase Auth $\rightarrow$ verificación de fila creada en `public.users` $\rightarrow$ sesión activa en el frontend $\rightarrow$ logout exitoso.

---

### AUTH-02 — Wizard de Onboarding Pedagógico de 5 Pasos y Evaluación Diagnóstica
**Tipo:** Story | **SP:** 5 | **Prioridad:** Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/onboarding-diagnostico`  
**Trazabilidad:** `ADR-005`, `docs/01-producto-negocio/01_PROJECT_OVERVIEW.md` §8

**Historia de usuario:**
> "Como estudiante nuevo, quiero completar un asistente interactivo de 5 pasos al registrarme (lenguaje, nivel, motivación, meta diaria y cuenta),
> para personalizar mi experiencia de aprendizaje y recibir una ruta adaptada a mi ritmo diario de estudio."

**Criterios de aceptación:**
- **Wizard de Onboarding Interactivo de 5 Pasos (`apps/web`):**
  1. **Paso 1 (Lenguaje):** Selección de la tecnología base (Python 3.12 como pista fundacional obligatoria).
  2. **Paso 2 (Nivel de experiencia):** Autodeclaración entre *Principiante Absoluto* (`beginner`), *Elemental* (`elementary`), *Intermedio* (`intermediate`) o *Avanzado* (`advanced`).
  3. **Paso 3 (Estilo de aprendizaje):** Selección de enfoque preferido: *Práctico en Consola* (`hands-on`), *Guiado Paso a Paso* (`guided`), *Proyectos Reales* (`projects`) o *Gamificado/Lúdico* (`gamified`).
  4. **Paso 4 (Meta diaria de estudio):** Selección de compromiso diario en minutos:
     - *Casual:* 5 min/día (`casual`).
     - *Regular:* 10 min/día (`regular`, opción recomendada por defecto).
     - *Enfocado:* 15 min/día (`focused`).
     - *Intenso:* 20 min/día (`intense`).
  5. **Paso 5 (Cuenta):** Formulario integrado de registro de credenciales que envía las respuestas acumuladas de los pasos 1 a 4 dentro del payload `raw_user_meta_data` hacia Supabase Auth.
- **Persistencia en Base de Datos:**
  - `public.users` almacena: `initial_language_slug`, `experience_level`, `learning_style`, `daily_goal_id`, `daily_goal_minutes`.
- **Evaluación Diagnóstica Inicial (Opcional):**
  - Si el usuario declara nivel intermedio o superior, se ofrece un test diagnóstico de 12 preguntas de Python (`POST /api/v1/learning/diagnostic/submit`).
  - Al aprobar con $\ge 80\%$, se marcan los módulos básicos como aprobados (`unlocked_by_diagnostic = true`) con opción de saltar directamente al siguiente bloque.

**Subtasks:**
- [x] [FRONTEND] Implementar flujo multi-paso del Wizard de registro en `apps/web/src/app/register/page.tsx` con stepper dinámico y animaciones.
- [x] [FRONTEND] Integrar selector de metas diarias (5, 10, 15, 20 minutos) con micro-animación de Koda 🦊.
- [ ] [BACKEND] Endpoint `POST /api/v1/learning/diagnostic/submit` que evalúa respuestas diagnósticas y calcula el módulo de entrada.
- [ ] [BACKEND] Endpoint `GET /api/v1/learning/diagnostic/questions` con 12 reactivos calibrados de fundamentos de Python.
- [ ] [TEST] Pruebas unitarias para validar la inserción de las preferencias de onboarding en `public.users` al registrarse.

---

### AUTH-03 — Gestión de Perfil de Usuario Consolidado y Métricas en Tiempo Real
**Tipo:** Story | **SP:** 3 | **Prioridad:** Media | **Asignado:** Frontend Developer + Backend Developer  
**Rama sugerida:** `feature/perfil-usuario`  
**Trazabilidad:** `12_DATABASE_DESIGN.md`, `19_SECURITY.md`

**Historia de usuario:**
> "Como usuario de Koda, quiero consultar y editar mi perfil unificado (nombre, avatar de Koda, documento legal para certificados y meta de minutos),
> para mantener mis datos actualizados y asegurar que mis diplomas oficiales se expidan con mi identidad legal correcta."

**Criterios de aceptación:**
- Endpoint `GET /api/v1/users/me` entrega la entidad consolidada de `public.users`:
  - Identidad: `id`, `email`, `display_name`, `avatar_url`, `document_type`, documento enmascarado (`CC ***678`), `bio`, `timezone`, `locale`.
  - Preferencias: `initial_language_slug`, `experience_level`, `learning_style`, `daily_goal_id`, `daily_goal_minutes`.
  - Gamificación y Hábitos: `total_xp`, `current_level`, `current_streak`, `longest_streak`, `streak_freeze_count`, `total_study_time_seconds`, `last_study_date`.
- Endpoint `PATCH /api/v1/users/me` permite actualizar: `display_name`, `avatar_url`, `bio`, `document_number`, `document_type`, `daily_goal_minutes` y `timezone`.
- Cifrado o protección estricta de `document_number` para cumplimiento de privacidad (`RNF-008`).
- Selector de avatares oficiales con las 4 expresiones de la mascota Koda 🦊.
- RLS en Supabase: solo el titular de la sesión (`auth.uid() = id`) puede emitir `UPDATE` sobre su registro.

**Subtasks:**
- [x] [BD] Definir columnas de perfil y preferencias directamente en `public.users` con constraints de formato y longitud.
- [ ] [BACKEND] Controlador `UsersController` con endpoints de lectura y actualización parcial de perfil en NestJS.
- [ ] [FRONTEND] Pantalla de perfil en `apps/web` con panel de estadísticas (tiempo total de estudio, racha actual, XP y nivel).
- [ ] [FRONTEND] Selector de avatares SVG de Koda y formulario de datos personales con validación.

---

### AUTH-04 — Recuperación de Contraseña y Verificación de Correo en Supabase Auth
**Tipo:** Story | **SP:** 3 | **Prioridad:** Media | **Asignado:** Backend Developer  
**Rama sugerida:** `feature/recuperacion-password`  
**Trazabilidad:** `19_SECURITY.md` §10

**Historia de usuario:**
> "Como usuario que olvidó su contraseña, quiero recibir un enlace temporal en mi correo electrónico a través de Supabase Auth,
> para restablecer mi acceso a la plataforma sin perder mi progreso educativo ni mi racha acumulada."

**Criterios de aceptación:**
- Endpoint o flujo frontend con `supabase.auth.resetPasswordForEmail()`: envía email con enlace temporal seguro (TTL 15 minutos).
- Prevención de enumeración de cuentas: la UI responde siempre con el mismo mensaje neutral confirmando el envío.
- Pantalla de restablecimiento de contraseña en `apps/web`: valida la nueva clave (mínimo 8 caracteres, alfanumérica y carácter especial) y la actualiza mediante `supabase.auth.updateUser()`.
- Rate limiting estricto para mitigar ataques de denegación o saturación de emails.

**Subtasks:**
- [ ] [SUPABASE] Configurar plantilla de email de recuperación en Supabase Auth con identidad visual oficial de Koda.
- [ ] [FRONTEND] Pantalla `apps/web/src/app/recuperar-password/page.tsx` con formulario amigable de solicitud.
- [ ] [FRONTEND] Pantalla `apps/web/src/app/actualizar-password/page.tsx` para captura y validación de nueva clave.
- [ ] [TEST] Validación end-to-end del flujo de reseteo y comprobación de expiración del enlace.
