# 📄 Entregable Técnico: Frontend AUTH-06 — Rediseño de Onboarding a Página Completa, Protección de Ruta y Calibración Técnica

> **ID:** `frontend-06-onboarding-full-page-redesign`  
> **Épica:** `EPIC 03 — Autenticación, Perfiles de Usuario y Onboarding` (`AUTH`)  
> **Historia de Usuario:** `AUTH-02` (Declaración de Nivel y Evaluación Diagnóstica Inicial)  
> **Rama:** `feat/frontend-auth-02-onboarding-page`  
> **Autor:** Dylan Gamero (Lead Frontend & Arquitectura)  
> **Fecha:** 20 de Septiembre de 2026  
> **Estado:** 🟢 Aprobado / 100% Completado

---

## 1. 🎯 Objetivos del Entregable

1. **Transformación de Onboarding a Página Completa:**
   - Rediseñar la ruta `/onboarding` (`apps/web/src/app/onboarding/page.tsx`) para erradicar la apariencia de ventana flotante o modal estrecho, dotándola de una arquitectura inmersiva de pantalla completa: Header superior con navegación sutil, Hero amplio con tipografía moderna, Grid de tarjetas técnicas 2x2 y banner de acción con CTA responsive.
2. **Protección Estricta de Ruta (Route Guard):**
   - Garantizar que los usuarios que ya hayan completado el onboarding (`user.onboardingCompleted === true`) no puedan acceder a `/onboarding`, redirigiéndolos de inmediato a la ruta principal (`/`) con pantalla de transición suave (`KodaLoadingScreen`).
3. **Erradicación de Terminología Obsoleta y Lenguaje CEFR ("B1/B2"):**
   - Eliminar por completo el badge "Onboarding Pedagógico".
   - Sustituir la nomenclatura "B1", "B2" (asociada a marcos de idiomas extranjeros) por conceptos canónicos de ingeniería de software y programación: *Sintaxis & Tipos*, *Control & Modularidad*, *Algoritmos & Proyectos*.
4. **Evaluación Diagnóstica In-Page:**
   - Incorporar la experiencia de la evaluación diagnóstica (12 retos de código con temporizador, snippets en monospace de terminal y atajos de teclado `1-4`, `Enter`, `Flechas`) directamente en la página, sin requerir modales superpuestos reducidos.
   - Pantalla de resultados in-page con la mascota Koda 2D, desglose por bloques curriculares y botón CTA para ingresar al Roadmap.
5. **Obligatoriedad del Test para Niveles No Básicos:**
   - Si el estudiante selecciona un nivel diferente a "Principiante Absoluto" (`elementary`, `intermediate` o `advanced`), el test diagnóstico de 12 retos es **estrictamente obligatorio**.
   - Se eliminaron todos los botones de omisión (`Omitir test` y `Saltar al M01`), impidiendo el bypass y obligando a validar el nivel real para exonerar módulos. Si el usuario no desea tomar la evaluación, puede volver a la selección y elegir Principiante.

---

## 2. 🏗️ Arquitectura y Componentes Modificados

### A. Páginas y Vistas (`apps/web/src/app/onboarding/`)
- [`apps/web/src/app/onboarding/page.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/app/onboarding/page.tsx):
  - **Route Guard e Hidratación Resiliente:** Invocación explícita de `initAuth()` en `useEffect` de montaje para hidratar el estado global de `useAuthStore` desde `localStorage`. Hook reactivo que detecta `user.onboardingCompleted === true` y redirige de inmediato a la ruta canónica (`/`) con fallback automático vía `window.location.replace('/')`, eliminando cualquier congelamiento en la pantalla de carga (`KodaLoadingScreen`).
  - **Sincronización en Segundo Plano:** Verificación con el backend (`AuthService.verifySession`) si hay token activo para reconciliar cambios de estado del perfil de forma transparente.
  - **Tres Modos de Vista Integrados:**
    1. `level_select`: Selección de 4 niveles con tags técnicos (`#variables`, `#condicionales`, `#bucles`, `#algoritmos`).
    2. `diagnostic_test`: Banco interactivo de preguntas calibradas con temporizador regresivo de 15 min, atajos ergonómicos de teclado y snippet de terminal.
    3. `diagnostic_result`: Desglose de aciertos, módulo recomendado (`M01`, `M04`, `M07`) y acreditación de 3 estrellas (⭐⭐⭐).

### B. Wizard de Registro y Stepper (`apps/web/src/app/register/` & `controllers/`)
- [`apps/web/src/controllers/register/useRegisterStepperController.ts`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/controllers/register/useRegisterStepperController.ts):
  - Incorporada la opción `RegisterStepperOptions` con `isDiagnosticCompleted?: boolean`.
  - En `canContinue`, si `currentStep === 2` y `selectedExperienceId !== 'beginner'`, se exige estrictamente `options?.isDiagnosticCompleted === true` para habilitar el avance a los siguientes pasos.
  - En `goToStep`, se bloquea cualquier salto a pasos mayores a 2 si no se ha completado el diagnóstico obligatorio para niveles no principiantes.
- [`apps/web/src/views/register/ExperienceStep.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/views/register/ExperienceStep.tsx):
  - Corregida la condición `isNonBeginner` para abarcar tanto `elementary` ("Conozco los fundamentos") como `intermediate` ("Nivel intermedio o avanzado").
  - Modificado el banner informativo a *"⚡ Evaluación Diagnóstica Obligatoria"* con botón directo *"⚡ Iniciar Test"*.
- [`apps/web/src/app/register/page.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/app/register/page.tsx):
  - Integrada la detección reactiva de `hasPendingDiagnostic`.
  - Transformado el CTA inferior en el paso 2 a *"⚡ Iniciar Test Obligatorio"*, el cual abre automáticamente el modal diagnóstico al ser presionado e impide avanzar al paso 3 sin completarlo.
  - Si el usuario culmina el test, el botón conmuta a *"Confirmar mi nivel y continuar"*.
- [`apps/web/src/views/diagnostic/DiagnosticTestModal.tsx`](file:///home/dypok/Projects/DuolingoProgramacion/apps/web/src/views/diagnostic/DiagnosticTestModal.tsx):
  - Soporte de prop `isMandatory`: oculta el botón de omitir test y muestra la badge `⚡ Test Obligatorio`.
  - Soporte resiliente para *"Prefiero repasar y empezar desde el inicio (Módulo 01)"*, preservando la acreditación diagnóstica con `recommendedModuleCode: 'M01'`.

---

## 3. 🧪 Verificación y Pruebas

1. **TypeScript Typecheck:**
   ```bash
   pnpm --filter web exec tsc --noEmit
   # Exit code 0 - 0 errores
   ```

2. **Compilación de Producción (Next.js Turbopack):**
   ```bash
   pnpm --filter web build
   # 15/15 rutas estáticas y dinámicas generadas exitosamente (incluyendo /onboarding)
   ```

3. **Backend Unit Tests:**
   ```bash
   pnpm --filter api test
   # 15 passed, 15 total | 53 passed, 53 total
   ```
