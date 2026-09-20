# Entregable Frontend: Migración de Registro con OTP y Onboarding

> **Historia / Tarea:** Migración del Registro Tradicional con Validación OTP y Metas de Onboarding (`HU AUTH-01`, `HU AUTH-05`)  
> **Épica:** `EPIC-01: Authentication & User Profile Management`  
> **Rama de Trabajo:** `feat/frontend-auth-05-otp-oauth-onboarding`  
> **Fecha:** 20/09/2026  
> **Autor:** Dylan Gamero  

---

## 1. Objetivo y Resumen

Se completó la migración del flujo de registro de estudiantes en `/register` (`apps/web`), eliminando los retardos y simulaciones de mocks y conectando directamente con los endpoints reales del backend NestJS (`apps/api`) y **Supabase Auth**.

El nuevo flujo transaccional:
1. Recopila las elecciones del stepper de onboarding (tecnología, nivel de experiencia, estilo de aprendizaje y meta diaria en minutos).
2. Despacha la solicitud de creación de usuario a `POST /api/v1/auth/register-otp`.
3. Supabase Auth genera un token numérico de 6 dígitos y despacha la plantilla de correo `supabase/templates/confirmation.html` con `{{ .Token }}`.
4. Despliega un modal interactivo de 6 casillas (`RegisterOtpModal.tsx`) con auto-avance, soporte de pegado rápido (paste de 6 dígitos), temporizador regresivo de 10 minutos y opción de reenvío de código.
5. Valida el código contra `POST /api/v1/auth/verify-otp`, aprovisionando al estudiante en PostgreSQL (`public.users`), emitiendo el token JWT y sincronizando el estado global del usuario en `useAuthStore`.
6. Presenta el modal de éxito (`RegisterSuccessModal`) y permite la navegación directa a la ruta de aprendizaje.

---

## 2. Archivos Creados y Modificados

### Servicios y Adaptadores
- **[NEW]** [`apps/web/src/services/auth/auth.service.ts`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/services/auth/auth.service.ts): Cliente tipado para consumo de la API de autenticación (`registerWithOtp`, `verifyOtp`, `verifySession`).

### Vistas y Componentes
- **[NEW]** [`apps/web/src/views/register/RegisterOtpModal.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/views/register/RegisterOtpModal.tsx): Componente modal de verificación OTP con 6 casillas independientes, accesibilidad por teclado, temporizador de 10 minutos (600s), botón de reenvío con cooldown de 60s y banner de errores.
- **[MODIFY]** [`apps/web/src/views/register/ProfileStep.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/views/register/ProfileStep.tsx): Integración de la carga útil de onboarding en el evento `onSubmit` del formulario.
- **[MODIFY]** [`apps/web/src/app/register/page.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/app/register/page.tsx): Integración del modal OTP y vinculación de las opciones del stepper con el controlador.

### Controladores y Estado Global
- **[MODIFY]** [`apps/web/src/controllers/register/useRegisterProfileController.ts`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/controllers/register/useRegisterProfileController.ts): Control de estados asíncronos de registro, apertura de modal OTP, validación de 6 dígitos, reenvío y manejo de errores de backend.
- **[MODIFY]** [`apps/web/src/stores/auth.store.ts`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/stores/auth.store.ts): Almacenamiento persistente del JWT `token`, `refreshToken` y sincronización del usuario real devuelto por la sesión del backend (`setUserSession`).

---

## 3. Endpoints Conectados

| Endpoint | Método | Capa Backend | Descripción del Flujo |
| :--- | :---: | :---: | :--- |
| `/api/v1/auth/register-otp` | `POST` | NestJS + Supabase Auth | Crea usuario pendiente con metadata de onboarding y envía el correo transaccional con OTP. |
| `/api/v1/auth/verify-otp` | `POST` | NestJS + PostgreSQL | Valida el código numérico de 6 dígitos, confirma el usuario en Supabase, provisiona `public.users` y emite JWT. |
| `/api/v1/auth/verify-session` | `POST` | NestJS + Supabase Guard | Verifica la validez del token JWT y recupera el perfil completo del estudiante. |

---

## 4. Verificación de Calidad y Compilación

- **Build de Next.js (Turbopack):** `pnpm --filter web build` ejecutado exitosamente con código `0`.
- **Rutas Generadas:** 11/11 rutas estáticas generadas sin advertencias.
- **TypeScript:** 0 errores de compilación (`Finished TypeScript in 10.5s`).
- **Aislamiento de Código:** No se realizaron modificaciones en `apps/api/` ni migraciones de base de datos, cumpliendo estrictamente `koda-frontend-workflow`.
