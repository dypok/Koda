# Entregable Frontend: Desvío OAuth sin Onboarding a /register y Adaptación del Perfil

> **Historia / Tarea:** Desvío inteligente de usuarios OAuth sin onboarding previo hacia `/register` y adaptación del Paso 5 (`HU AUTH-01`, `HU AUTH-05`)  
> **Épica:** `EPIC-01: Authentication & User Profile Management`  
> **Rama de Trabajo:** `feat/frontend-auth-05-otp-oauth-onboarding`  
> **Fecha:** 20/09/2026  
> **Autor:** Dylan Gamero  

---

## 1. Objetivo y Resumen

Se completó la lógica de desvío y experiencia de usuario cuando un estudiante inicia sesión con **Google OAuth** o **GitHub OAuth** desde `/login` pero no cuenta con un registro previo o tiene su onboarding incompleto (`onboardingCompleted: false`).

### Reglas de Negocio Implementadas:
1. **Detección Automática en Login:** Cuando un usuario autentica con Google desde `/login`, tras validar su sesión con `POST /api/v1/auth/verify-session`, si `session.onboardingCompleted === false`, es redirigido inmediatamente a `/register` en lugar de `/app/ruta`.
2. **Blindaje de la Ruta Principal (`/app/ruta`):** Si un usuario autenticado intenta navegar directamente a `/app/ruta` sin haber completado su onboarding, el guardia de ruta lo redirige a `/register`.
3. **Paso 5 de Registro para Usuarios OAuth:**
   - Detecta si el usuario ya está autenticado (`isOAuthUser = Boolean(token && user && user.onboardingCompleted === false)`).
   - Pre-carga el nombre completo o alias y correo electrónico provenientes de la cuenta de Google.
   - Oculta los botones de registro social (Google/GitHub) y muestra en su lugar un badge visual de verificación: *“Cuenta vinculada con éxito”*.
   - Oculta los campos de contraseña y medidor de complejidad, puesto que la autenticación es gestionada por el proveedor OAuth externo.
   - Valida el formulario únicamente con nombre/alias y correo, permitiendo finalizar sin contraseña.
   - Al enviar el paso 5, despacha los datos de preferencias acumuladas en los pasos 1-4 a `POST /api/v1/auth/onboarding`, sincronizando `onboardingCompleted: true` en PostgreSQL y en el estado global `useAuthStore`.
   - Muestra el modal de éxito (`RegisterSuccessModal`) y conduce al usuario a su ruta de aprendizaje desbloqueada.
4. **Protección de `/register` para Usuarios Completados:** Si un usuario ya completó el onboarding e ingresa a `/register`, el guardia lo redirige automáticamente a `/app/ruta`.

---

## 2. Archivos Modificados

### Vistas y Páginas
- **[`apps/web/src/views/login/LoginForm.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/views/login/LoginForm.tsx):** Redirección condicional según `session.onboardingCompleted` tanto en el callback de OAuth como en el submit por contraseña.
- **[`apps/web/src/app/login/page.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/app/login/page.tsx):** Guardia de hidratación que envía a `/register` si el usuario autenticado tiene `onboardingCompleted === false`.
- **[`apps/web/src/app/app/ruta/page.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/app/app/ruta/page.tsx):** Guardia de ruta que expulsa a `/register` si el onboarding no ha sido completado.
- **[`apps/web/src/app/register/page.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/app/register/page.tsx):** Hidratación de sesión con `initAuth()`, guardia de ruta hacia `/app/ruta` si `onboardingCompleted === true`, y textos dinámicos de CTA para usuarios OAuth.
- **[`apps/web/src/views/register/ProfileStep.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/views/register/ProfileStep.tsx):** Renderizado condicional del badge de cuenta vinculada en lugar de botones sociales y textos de encabezado contextuales.
- **[`apps/web/src/views/register/ProfileFormFields.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/views/register/ProfileFormFields.tsx):** Campo de contraseña oculto para usuarios OAuth y correo electrónico en modo solo lectura con nota informativa.

### Controladores
- **[`apps/web/src/controllers/register/useRegisterProfileController.ts`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/controllers/register/useRegisterProfileController.ts):** Detección de `isOAuthUser`, inicialización reactiva de nombre y correo, validación sin contraseña y llamada a `AuthService.completeOnboarding(..., token)` en vez del flujo OTP.

---

## 3. Verificación de Compilación y Calidad

- **Build de Next.js (Turbopack):** `pnpm --filter web build` ejecutado exitosamente con código `0`.
- **TypeScript:** 0 errores de tipado en 6.7s.
- **Rutas Generadas:** 11/11 rutas estáticas optimizadas.
- **Aislamiento de Código:** Cumplimiento estricto de `koda-frontend-workflow` sin alterar el backend de `apps/api/` ni migraciones de base de datos.

---

## 4. Estabilización de Animaciones y Pantalla de Carga Koda (`KodaLoadingScreen`)

- **Pantalla de Carga Branded (`KodaLoadingScreen`):** Componente a pantalla completa con la mascota Koda 2D animada (`/brand/koda-mascot-cartoon-2d.svg`), halo ámbar pulsante y status bar. Erradica cualquier parpadeo de pantallas intermedias (Paso 1, Paso 5) o pantallas negras al autenticar vía OAuth o completar el onboarding.
- **Fix de `WipeButton`:** Se conservó intacta la animación diagonal de 3 bandas, unificando el texto en un único span con transición de color fluida a blanco, eliminando el texto duplicado y el salto de alineación/orientación.
- **Fix de `LanguageCard`:** Se estabilizó `useScramble` con un sizer invisible que mantiene invariable el ancho del texto en hover, y se migró la onda expansiva a `scale` por GPU con `pointer-events-none`.
- **Fix de `StepLayout` y Grid:** Se aplicó `layout="position"` en Framer Motion evitando que las tarjetas cambien de tamaño o se hinchen en hover.

