# Entregable Backend 14: Persistencia Atomica de Rachas y Experiencia (XP) en PostgreSQL

## 1. Contexto y Problematica Resuelta
Se detecto un fallo critico en la persistencia del estado de gamificacion del usuario:
1. Al recargar la pagina o entrar al Roadmap, los puntos de experiencia (XP) y el contador de racha se reseteaban a 0.
2. Resolver un ejercicio de micro-leccion individual no activaba la racha diaria ni actualizaba la fecha de estudio del usuario (`last_study_date = null`).
3. La causa raiz residia en una discrepancia de esquema en `PrismaProgressRepository`:
   - El paso 5 de `saveSectionCompletion` ejecutaba `tx.userModuleProgress.upsert({ where: { userId_moduleId } })` y `tx.streak.upsert({ where: { userId } })`, columnas e indices inexistentes en PostgreSQL.
   - En PostgreSQL, la tabla `user_module_progress` usa `course_slug`, `module_slug`, `track_slug`, `stars_percentage` y clave unica compuesta `[userId, courseSlug, moduleSlug]`.
   - La tabla `streaks` posee clave unica compuesta `[userId, activityDate]`.
   - El error de esquema provocaba un rollback silencioso de la transaccion `$transaction`, impidiendo la persistencia en `users.total_xp`, `users.current_streak` y `users.last_study_date`.
4. En `LessonAnsweredListener`, la insercion en `attempts` fallaba por utilizar nombres de columnas incompatibles (`section_id`, `xp_earned`, `duration_seconds`), abortando el proceso antes de incrementar el XP o registrar la actividad diaria.

## 2. Implementaciones Realizadas

### Prisma Schema (`apps/api/prisma/schema.prisma`)
- Se alineo el modelo `UserModuleProgress` con los campos reales de PostgreSQL: `trackSlug`, `courseSlug`, `moduleSlug`, `status`, `isUnlocked`, `unlockedAt`, `completedAt`, `masteredAt`, `sectionsTotal`, `sectionsCompleted`, `starsTotalPossible`, `starsEarned`, `starsPercentage`, y constraint `@@unique([userId, courseSlug, moduleSlug])`.
- Se alineo el modelo `Streak` con `activityDate`, `timezone`, `activityCount`, `studyTimeSeconds`, `lessonsCompletedCount`, `xpEarnedToday`, `dailyGoalMet`, `freezeUsed`, `firstActivityAt`, `lastActivityAt`, y constraint `@@unique([userId, activityDate])`.
- Se alinearon los modelos `Attempt`, `AttemptAnswer` y `UserMistakesNotebook` para reflejar con exactitud la base de datos de produccion.

### Repositorio de Progreso (`PrismaProgressRepository`)
- Se corrigio el paso 5 de `saveSectionCompletion` para ejecutar `userModuleProgress.upsert` utilizando `userId_courseSlug_moduleSlug` con valores `trackSlug: 'python'`, `courseSlug: courseId`, `moduleSlug: moduleId`, `starsPercentage`, `sectionsTotal`, `sectionsCompleted`, `starsEarned`.
- Se implemento el upsert diario en `tx.streak` utilizando `userId_activityDate: { userId, activityDate: todayDateOnly }`.
- Se actualizo el metodo `unlockModule` para usar la clave compuesta `userId_courseSlug_moduleSlug`.

### Telemetria de Lecciones (`LessonAnsweredListener`)
- Se migro el listener a `PrismaService` para garantizar tipado estricto y consistencia en transacciones.
- Se corrigio la insercion en `attempt` y `attemptAnswers`.
- Al responder correctamente una micro-leccion:
  - Se evalua la fecha actual contra `user.lastStudyDate` en la zona horaria del estudiante (`America/Bogota`).
  - Se incrementa o preserva la racha actual (`currentStreak`) y record historico (`longestStreak`).
  - Se actualiza `user.lastStudyDate = new Date()` y se incrementa `user.totalXp`.
  - Se registra el registro diario en la tabla relacional `streaks`.
- Al responder incorrectamente:
  - Se realiza upsert atomico en `userMistakesNotebook` con `failCount: { increment: 1 }`.

### DTO de Perfil de Usuario (`UserProfileResponseDto`)
- Se incorporo la propiedad `@ApiProperty() isActiveToday: boolean` calculada deterministamente en `fromEntity` comparando la fecha de estudio contra la fecha actual en la zona horaria del usuario.
- Se limpio cualquier emoji presente en las descripciones de Swagger.

## 3. Pruebas y Verificacion
- **Pruebas Unitarias Backend:** 24 suites de pruebas pasadas exitosamente (82 tests aprobados con 0 fallos).
- **Compilacion Backend:** `pnpm --filter api build` ejecutado exitosamente con 0 errores TypeScript.
- **Validacion en Base de Datos:** Verificacion end-to-end contra PostgreSQL confirmando la persistencia atomica de `total_xp`, `current_streak`, `last_study_date`, tabla `streaks` y `user_module_progress`.
