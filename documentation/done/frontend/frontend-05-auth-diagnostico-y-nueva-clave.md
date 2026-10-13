# 📄 Entregable Técnico: Frontend AUTH-05 — Evaluación Diagnóstica Inicial, Nueva Contraseña y Culminación de Épica 3

> **ID:** `frontend-05-auth-diagnostico-y-nueva-clave`  
> **Épica:** `EPIC 03 — Autenticación, Perfiles de Usuario y Onboarding` (`AUTH`)  
> **Historias de Usuario Cubiertas:** `AUTH-02` (Evaluación Diagnóstica Inicial) y `AUTH-04` (Recuperación de Contraseña y Nueva Clave)  
> **Autor:** Dylan Gamero (Lead Frontend & Arquitectura)  
> **Fecha:** 20 de Septiembre de 2026  
> **Estado:** 🟢 Aprobado / 100% Completado

---

## 1. 🎯 Objetivos del Entregable

1. **Evaluación Diagnóstica Inicial (`AUTH-02`):**
   - Construir la experiencia interactiva del test diagnóstico con 12 preguntas calibradas y estratificadas (B1: Fundamentos vs. B2: Control/Colecciones) consumiendo `GET /api/v1/learning/diagnostic/questions`.
   - Implementar el modal de resultados con feedback pedagógico personalizado generado por el backend, cálculo de módulo de inicio recomendado (`recommended_module_id`), y acreditación de módulos exonerados con 3 estrellas simbólicas (⭐⭐⭐) consumiendo `POST /api/v1/learning/diagnostic/submit`.
   - Integrar la autodeclaración de nivel en la ruta dedicada `/onboarding` y como disparador contextual en el paso de experiencia del registro (`ExperienceStep.tsx`).
2. **Restablecimiento de Contraseña (`AUTH-04`):**
   - Implementar la página `/nueva-clave` (`apps/web/src/app/nueva-clave/page.tsx`) capaz de resolver tokens temporales tanto desde el hash de URL (`#access_token=...`) como desde parámetros de búsqueda (`?token=...`).
   - Validar requisitos estrictos de complejidad de clave (8+ caracteres, mayúscula, minúscula, número y símbolo especial) con medidor en tiempo real y consumir `POST /api/v1/auth/reset-password` vía `AuthService.resetPassword`.
3. **Cierre de la Épica 3 (`AUTH`):**
   - Concluir y verificar al 100% las 5 Historias de Usuario de la Épica 3 (`AUTH-01`, `AUTH-02`, `AUTH-03`, `AUTH-04`, `AUTH-05`).

---

## 2. 🏗️ Arquitectura y Componentes Desarrollados

### A. Capa de Servicios (`apps/web/src/services/`)
- [`DiagnosticService.ts`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/services/learning/diagnostic.service.ts):
  - `getQuestions(languageSlug?: string)`: Consulta el banco de preguntas calibradas sin respuestas correctas.
  - `submitDiagnostic(payload, token?)`: Envía respuestas del estudiante aplicando el algoritmo pedagógico y clamping estricto.
- [`AuthService.ts`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/services/auth/auth.service.ts):
  - `resetPassword(payload)`: Envía el token temporal y la nueva contraseña a NestJS `POST /api/v1/auth/reset-password`.

### B. Capa de Interfaz y Vistas (`apps/web/src/views/`)
- [`DiagnosticTestModal.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/views/diagnostic/DiagnosticTestModal.tsx):
  - Stepper interactivo de 12 preguntas con badges de bloque (`B1`/`B2`), módulos y temporizador regresivo de 15 minutos formativos.
  - Atajos de teclado ergonómicos (`1-4` para selección de opciones, `Enter`/`ArrowRight` para avanzar, `ArrowLeft` para retroceder).
  - Bloque visual para snippets de código en monoespaciado (`codeSnippet`).
- [`DiagnosticResultModal.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/views/diagnostic/DiagnosticResultModal.tsx):
  - Modal con la mascota Koda 2D animada, puntaje global (%), desglose por bloques pedagógicos, justificación personalizada y selección de inicio recomendado vs. inicio desde el Módulo 01.
- [`ExperienceStep.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/views/register/ExperienceStep.tsx):
  - Badge reactivo de invitación al test diagnóstico cuando el usuario declara un nivel superior a *Principiante*.

### C. Páginas y Enrutamiento (`apps/web/src/app/`)
- [`/nueva-clave`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/app/nueva-clave/page.tsx):
  - Formulario de nueva clave con medidor de fuerza, soporte hash/query, diseño Dark Navy institucional y feedback amigable.
- [`/onboarding`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/app/onboarding/page.tsx):
  - Pantalla dedicada de autodeclaración de nivel con 4 tarjetas interactivas y acceso directo a la evaluación diagnóstica.

---

## 3. 🧪 Verificación y Pruebas

1. **TypeScript Typecheck:**
   ```bash
   pnpm --filter web exec tsc --noEmit
   # Exit code 0 - 0 errores
   pnpm --filter api exec tsc --noEmit
   # Exit code 0 - 0 errores
   ```

2. **Next.js Turbopack Production Build:**
   ```bash
   pnpm --filter web build
   # ✓ 15/15 páginas estáticas y dinámicas compiladas exitosamente
   # Incluyendo /nueva-clave y /onboarding
   ```

3. **Backend Jest Test Suites:**
   ```bash
   pnpm --filter api test
   # Test Suites: 15 passed, 15 total
   # Tests:       53 passed, 53 total (100% aprobados)
   ```

---

## 4. 🏁 Estado de la Épica 3

Con la entrega de estos módulos, todas las historias de usuario de la **Épica 3 (`AUTH`)** han sido completadas:
- [x] **AUTH-01:** Registro, login, JWT rotativo, renovación silenciosa y 401 retry.
- [x] **AUTH-02:** Autodeclaración de nivel y evaluación diagnóstica de 12 preguntas con clamping y recomendación.
- [x] **AUTH-03:** Perfil de usuario, enmascaramiento de documento, 8 avatares oficiales y personalización visual Pixi.
- [x] **AUTH-04:** Recuperación de contraseña, plantillas de email, rate limiting y página `/nueva-clave`.
- [x] **AUTH-05:** Registro dual OTP + Google/GitHub OAuth2 con onboarding e-learning.
