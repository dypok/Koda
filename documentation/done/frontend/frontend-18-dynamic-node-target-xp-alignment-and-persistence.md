# Deliverable Frontend: Alineación Dinámica y Persistencia Exacta de XP por Nodo de Roadmap

**ID:** frontend-18  
**Nombre:** dynamic-node-target-xp-alignment-and-persistence  
**Fecha:** 19/10/2026  
**Rama:** feat/frontend-align-node-target-xp  
**Estado:** Completado  

---

## 1. Descripción de la Tarea

Alinear de forma dinámica y exacta el valor de XP declarado en cada nodo del roadmap (por ejemplo: Lección 1 = 120 XP, Lección 2 = 150 XP, Lección 3 = 180 XP, Lección 4 = 200 XP, Mini-Boss = 250 XP, etc.) con la recompensa real acreditada tanto en el estado del cliente como en la base de datos PostgreSQL, evitando discrepancias donde se otorgaban valores estáticos inferiores o 0 XP en reintentos.

---

## 2. Archivos Modificados

1. `packages/types/src/index.ts`:
   - Incorporación del campo opcional `xp_earned?: number` en la interfaz `LessonAnswerSubmission`.
2. `apps/api/src/modules/learning/dto/lesson-answer-submission.dto.ts`:
   - Adición del campo `@IsOptional() @IsNumber() xp_earned?: number` con validación y Swagger.
3. `apps/api/src/modules/learning/learning.service.ts`:
   - En `evaluateAnswer` y su fallback, utilización de `submission.xp_earned` si es provisto para emitir el evento `lesson.answered` con el valor exacto de la micro-lección.
4. `apps/api/src/domain/entities/section-stars.entity.ts`:
   - En `recordAttempt`, acreditación del `targetXp` explícito tanto en la primera aprobación como en reintentos/prácticas de la sección.
5. `apps/web/src/services/learning/evaluation.service.ts`:
   - Actualización de `evaluateLessonAnswer` para admitir y enviar `xp_earned?: number`.
6. `apps/web/src/views/lesson/LessonWorkspace.tsx`:
   - Implementación de la función pura `findNodeInDataset` para resolución multifuente resiliente (Zustand store, `getLessonsDatasetForCourse(courseId)` y metadata NoSQL de módulos).
   - Cálculo dinámico de `nodeTargetXp` según el nodo seleccionado.
   - Envío de `xp_earned` en las llamadas a `EvaluationService.evaluateLessonAnswer` (atajos de teclado y botón de interfaz).
   - Blindaje de `awardXp` en `handleQuizFinish` contra caídas a 0.
   - Presentación del valor dinámico de `nodeTargetXp` en la pantalla final de completitud (`mode === 'done'`).

---

## 3. Pruebas y Verificación

1. **Pruebas Unitarias Backend**:
   - `CompleteSectionUseCase`: Aprobadas 5/5 pruebas.
   - `LearningService`: Aprobadas 5/5 pruebas.
2. **Chequeo de Tipos TypeScript**:
   - `apps/api`: `tsc --noEmit` completado con 0 errores.
   - `apps/web`: `tsc --noEmit` completado con 0 errores.
3. **Compilación de Producción Frontend**:
   - `pnpm --filter web build` ejecutado exitosamente con Next.js 16.4.0 (Turbopack).
