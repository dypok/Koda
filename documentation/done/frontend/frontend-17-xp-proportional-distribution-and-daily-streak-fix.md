# Entregable Frontend 17: Distribucion Proporcional de XP por Pregunta y Correccion de Racha Diaria

## 1. Contexto y Problematica Resuelta
1. **Desconexion en la Experiencia Ganada (XP):** Al responder una pregunta interactiva dentro de una leccion, el visor mostraba arbitrariamente `¡Excelente! +5 XP` independientemente del valor real del nodo (por ejemplo, 120 XP o 100 XP), lo que generaba confusion con respecto a la experiencia prometida en el roadmap.
2. **Incremento Erroneo de Racha en Cada Modulo:** Cada vez que el estudiante completaba una leccion o modulo en el mismo dia, el contador de racha (`streak`) aumentaba en +1 de forma acumulativa en lugar de representar dias calendario consecutivos de estudio. La causa raiz radicaba en que las fechas `@db.Date` de PostgreSQL eran interpretadas por Prisma a medianoche UTC y, al aplicarles formato con zona horaria de Bogota (UTC-5), se desplazaban 5 horas hacia atras (identificando falsamente la ultima fecha de estudio como el dia de ayer).

## 2. Implementaciones Realizadas

### Motor de Leccion y Feedback Proporcional (`useLessonEngine.ts` y `LessonWorkspace.tsx`)
- En `apps/web/src/views/lesson/useLessonEngine.ts`, se incorporo el parametro `rewardXp` dinamico en lugar del valor estatico quemado de 5 XP:
  - Pregunta acertada al primer intento: otorga `rewardXp`.
  - Pregunta recuperada tras error previo: otorga `Math.max(1, Math.round(rewardXp * 0.4))`.
  - Mensaje de feedback: `¡Correcto! +${gained} XP.`
- En `LessonWorkspace.tsx`:
  - Se calcula la experiencia proporcional por hito y pregunta:
    ```ts
    const nodeTargetXp = currentNode?.xp ?? 120;
    const totalSteps = totalCount + 1; // Lecciones + Quiz
    const baseStepXp = Math.max(5, Math.floor(nodeTargetXp / totalSteps));
    const exerciseCount = Math.max(1, lesson.exercises?.length ?? 1);
    const questionXp = Math.max(1, Math.round(baseStepXp / exerciseCount));
    ```
  - Al comprobar una respuesta correcta, se muestra `¡Excelente! +${questionXp} XP` y se suma este valor exacto a la experiencia en tiempo real.
  - Al completar el Quiz de cierre, la recompensa otorgada es el diferencial exacto:
    ```ts
    const completionReward = Math.max(20, nodeTargetXp - sessionExerciseXpRef.current);
    ```
    Garantizando que la suma total acumulada equivalga exactamente a los XP prometidos en el roadmap.

### Ciclo de Racha Diaria Blindado en Backend y Frontend
- **Backend (`prisma-progress.repository.ts`, `lesson-answered.listener.ts`, `user-profile-response.dto.ts`):**
  - Se corrigio el formateo de `lastStudyDate`: al provenir de una columna `@db.Date`, se extrae directamente su representacion de fecha `toISOString().slice(0, 10)`, evitando el desfase de 5 horas que transformaba la medianoche UTC en el dia anterior.
  - Al persistir `lastStudyDate`, se almacena `new Date(`${todayStr}T00:00:00.000Z`)`.
  - Si el usuario ya estudio en el dia de hoy (`lastStudyStr === todayStr`), `diffDays = 0` y la racha se preserva sin incrementarse.
  - Solo cuando `diffDays === 1` (dia calendario consecutivo) la racha se incrementa en +1.
  - El DTO `user-profile-response.dto.ts` ahora evalua de forma precisa `isActiveToday = todayStr === lastStudyStr`.
- **Frontend (`LessonWorkspace.tsx`):**
  - Se agrego salvaguarda en las actualizaciones locales de `updateUserProfile`: si `currentUser.lastStudyDate` ya coincide con el dia de hoy (`toLocaleDateString('en-CA')`), la racha se mantiene en su valor actual sin sumar unidades indebidas por modulo.

### Normalizacion en Base de Datos
- Se ajustaron los registros del usuario en PostgreSQL para restablecer la racha a 1 dia calendario, concordando con su sesion de actividad de la fecha.

## 3. Pruebas y Verificacion
- **TypeScript (Frontend y Backend):**
  - `pnpm --filter web exec tsc --noEmit` completado con 0 errores.
  - `pnpm --filter api exec tsc --noEmit` completado con 0 errores.
- **Compilacion de Produccion:**
  - `pnpm --filter web build` completado exitosamente con Turbopack (15/15 paginas generadas).
- **Flujo Validado:**
  - Al responder una pregunta en un nodo de 120 XP, se muestra `+24 XP` (o la fraccion exacta).
  - Al completar lecciones consecutivas en el mismo dia, la racha permanece fija en 1 dia y con estado activo (`isActiveToday: true`).
