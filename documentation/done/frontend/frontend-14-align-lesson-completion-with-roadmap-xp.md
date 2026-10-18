# Entregable Frontend 14: Alineacion de Recompensa de Experiencia (XP) del Roadmap con Lecciones y Quizzes

## Modulo / Dominio
Workspace de Lecciones (LessonWorkspace) / Gamificacion y Sincronizacion en Tiempo Real

## Descripcion de Cambios
1. **Soporte de targetXp en EvaluationService (`apps/web/src/services/learning/evaluation.service.ts`)**:
   - Se extendio la interfaz de entrada de `completeSection` para incluir `targetXp?: number`, enviandolo en el cuerpo JSON de la solicitud POST.

2. **Calculo de Recompensa y Rastreo de XP en Sesion (`apps/web/src/views/lesson/LessonWorkspace.tsx`)**:
   - Se agrego `currentNode` derivado de `lessonsDataset.nodes` en el store del roadmap para identificar la XP prometida para el nodo actual (ej. 120 XP para Entorno & Sintaxis, 250 XP para Guardian de la Logica).
   - Se implemento `sessionExerciseXpRef` para registrar acumulativamente la experiencia obtenida durante los ejercicios de la sesion actual.
   - En `handleLessonCompleted`, se calcula la recompensa diferencial: `completionReward = Math.max(30, nodeTargetXp - sessionExerciseXpRef.current)`.
   - Se envia `targetXp: completionReward` a la API y se actualiza el perfil en `useAuthStore` en tiempo real con la XP total exacta.
   - En `LessonView`, se conecto `onExerciseCorrect` tanto para la navegacion por atajos de teclado como para el clic en el boton de evaluacion.

3. **Alineacion en Quizzes y Pantalla Final**:
   - En `handleQuizFinish`, se envia `targetXp: currentNode?.xp ?? 250` y se actualiza el perfil local de usuario de manera coherente.
   - En la vista de resumen de quiz aprobado, se reemplazo el texto estatico `+10 XP de maestria` por `+${currentNode?.xp ?? 250} XP de maestria`.

## Verificacion y Pruebas
- Compilacion de frontend (`pnpm --filter web build`) completada con Turbopack exitosamente sin errores de TypeScript ni de empaquetado.
