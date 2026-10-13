# Entregable Backend HU AUTH-02: Declaración de Nivel y Evaluación Diagnóstica Inicial

- **ID Historia de Usuario:** AUTH-02
- **Épica:** Épica 3 (Sprint 2) - Autenticación, Perfiles de Usuario y Onboarding
- **Rama:** `feat/backend-auth-02-onboarding-diagnostico`
- **Autor:** Dylan Gamero
- **Fecha:** 20/09/2026
- **Estado:** ✅ Backend Completado · ⚪ Frontend delimitado para desarrollo en `apps/web/` (`apps/web/src/app/onboarding/page.tsx`)
- **Trazabilidad:** `01` §8, `14` §5, `14` §5.4, `ADR-002`, `ADR-008`, `ADR-013`, `ADR-015`

---

## 1. Resumen de la Implementación Backend

En estricto cumplimiento del protocolo de gobernanza `koda-backend-workflow.md` (ADR-015):
1. **Aislamiento de Código:** **0 archivos modificados en `apps/web/`**. Toda la interacción visual de onboarding (stepper de preguntas, temporizador y modal de celebración de Koda 🦊) queda delimitada para la HU de frontend.
2. **Banco Calibrado y Anti-Fugas:** Se estructuró un banco inmutable de 12 preguntas de opción única cubriendo equitativamente el Bloque B1 (M01-M03: Fundamentos, Variables, Operadores) y Bloque B2 (M04-M06: Condicionales, Bucles, Funciones), entregadas mediante `GET /api/v1/learning/diagnostic/questions` sin revelar `correctOptionId` ni `explanation`.
3. **Algoritmo Pedagógico & Clamping (`14 §5.4`):** Se implementó la lógica de evaluación en `EvaluateDiagnosticUseCase`, garantizando:
   - Desbloqueo a Módulo 04 si supera Bloque B1 ($\ge 80\%$).
   - Desbloqueo a Módulo 07 si supera Bloque B1 y Bloque B2 ($\ge 80\%$).
   - Contención estricta de saltos (clamping) según nivel autodeclarado para evitar aprobaciones accidentales por adivinación (`beginner` $\le 3$, `medium` $\in [1..6]$, `semi_professional` $\in [2..9]$, `professional` $\in [3..12]$).
   - Asignación directa a M01 si el usuario selecciona nivel Principiante y omite el test.
4. **Soporte Híbrido:** El endpoint `POST /api/v1/learning/diagnostic/submit` utiliza `OptionalSupabaseAuthGuard` para atender usuarios anónimos en onboarding previo al registro, o usuarios ya autenticados persistiendo los módulos exonerados con 3 estrellas simbólicas ⭐⭐⭐.

---

## 2. Componentes Creados y Modificados (Backend)

### A. Capa de Dominio (Hexagonal)
- **`apps/api/src/domain/entities/diagnostic.entity.ts`:**
  - Definición de tipos: `DiagnosticQuestion`, `DiagnosticOption`, `BlockEvaluationResult`, `DiagnosticEvaluationResult`.
  - Banco oficial calibrado `PYTHON_DIAGNOSTIC_QUESTIONS` con 12 preguntas y explicaciones pedagógicas formativas.

### B. Capa de Aplicación (Casos de Uso y DTOs)
- **DTOs:**
  - `apps/api/src/application/dto/diagnostic/diagnostic-questions-response.dto.ts`: Contrato público sanitizado con Swagger `@ApiProperty`.
  - `apps/api/src/application/dto/diagnostic/submit-diagnostic.dto.ts`: Validación con `class-validator` para nivel autodeclarado y lista de respuestas.
  - `apps/api/src/application/dto/diagnostic/diagnostic-result-response.dto.ts`: Resultado con puntajes por bloques, módulo recomendado, justificación y bandera de clamping.
- **Casos de Uso:**
  - `apps/api/src/application/use-cases/diagnostic/get-diagnostic-questions.use-case.ts`: Entrega las 12 preguntas calibradas.
  - `apps/api/src/application/use-cases/diagnostic/evaluate-diagnostic.use-case.ts`: Ejecuta el algoritmo de calificación, clamping y persistencia.
  - `apps/api/src/application/use-cases/diagnostic/evaluate-diagnostic.use-case.spec.ts`: Cobertura de tests unitarios al 100% incluyendo los 4 casos del DoD.

### C. Capa de Presentación REST
- **`apps/api/src/common/guards/optional-supabase-auth.guard.ts`:**
  - Guard no bloqueante para soporte dual autenticado / anónimo.
- **`apps/api/src/modules/learning/diagnostic.controller.ts`:**
  - `GET /api/v1/learning/diagnostic/questions`: Banco de 12 preguntas sin respuestas correctas.
  - `POST /api/v1/learning/diagnostic/submit`: Evaluación y determinación del punto de entrada en la ruta.
- **`apps/api/src/modules/learning/learning.module.ts`:**
  - Registro de controladores, casos de uso y proveedores de infraestructura.

---

## 3. Endpoints Disponibles y Contratos REST

| Método | Ruta | Guard / Seguridad | Descripción |
|---|---|---|---|
| `GET` | `/api/v1/learning/diagnostic/questions` | Público | Entrega 12 preguntas calibradas estratificadas (B1 y B2) sin respuestas correctas. |
| `POST` | `/api/v1/learning/diagnostic/submit` | `OptionalSupabaseAuthGuard` | Evalúa respuestas, aplica clamping pedagógico y retorna módulo recomendado y desglose por bloques. |

---

## 4. Resultados de Verificación y Pruebas

### Pruebas Unitarias (Jest):
- Comando: `pnpm --filter api test`
- Resultado: **100% Passed (7 Test Suites, 23 Tests aprobados)**
  - `√ Caso 1 (Principiante): Usuario beginner con respuestas deficientes o sin experiencia se ubica en M01`
  - `√ Caso 2 (Intermedio Bloque 1 aprobado): >= 80% en B1 y < 80% en B2 desbloquea y ubica en M04`
  - `√ Caso 3 (Intermedio con acierto total - Clamping): 100% en B1 y B2 pero nivel medium restringe a M06`
  - `√ Caso 4 (Semi-Pro / Profesional): >= 80% en B1 y B2 desbloquea M07 sin contención de clamping`
  - `√ Omitir diagnóstico con nivel Principiante directo`
  - `√ Persistencia en perfil del estudiante`
  - `√ 17 pruebas previas de Auth y Users aprobadas`

### Compilación y Tipado:
- Comando: `pnpm --filter api build`
- Resultado: **Exitoso (Prisma Client generado + NestJS build limpio, 0 errores de TypeScript)**.

---

## 5. Delimitación de Próxima HU (Frontend)

Para el equipo de frontend en `apps/web/`:
- **HU:** `AUTH-02-FRONT — Pantalla de Onboarding Diagnóstico, Stepper y Modal de Resultados`
- **Pantallas y vistas:**
  - `apps/web/src/app/onboarding/page.tsx` con cards interactivas de autodeclaración de nivel.
  - Stepper con temporizador formativo consumiendo `GET /api/v1/learning/diagnostic/questions`.
  - Envío a `POST /api/v1/learning/diagnostic/submit` y animación de Koda 🦊 celebrando el módulo recomendado.
