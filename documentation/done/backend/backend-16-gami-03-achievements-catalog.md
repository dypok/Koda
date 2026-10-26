# Entregable Backend: Catálogo de Logros, Evaluación de Reglas y Acreditación Transaccional de XP (GAMI-03)

**HU Asociada:** GAMI-03 — Catálogo de Logros (Achievements) y Medallas Desbloqueables  
**Épica:** EPIC-08 — Gamificación, Economía XP, Rachas y Mascota Koda 🦊  
**Rama:** `feat/gami-03-achievements-catalog`  
**Fecha:** 26 de Octubre de 2026  
**Autor:** Dylan Gamero

---

## 1. Resumen Arquitectónico

Se implementó el motor de evaluación de logros y otorgamiento transaccional de medallas y puntos XP en el backend NestJS con PostgreSQL / Prisma:

1. **Alineación de Modelos de Base de Datos (`apps/api/prisma/schema.prisma`):**
   - Actualización de los modelos `Achievement` y `UserAchievement` con soporte para `iconName` (`icon_name`), `conditionType` (`condition_type`), `conditionValue` (`condition_value`), `metadata` (JSONB) y timestamps acordes al schema oficial de PostgreSQL.
   - Sincronización y compilación limpia del cliente Prisma mediante `prisma generate`.

2. **Seeding del Catálogo Oficial de 18 Logros MVP (`apps/api/src/database/seeds/achievements.seed.ts`):**
   - Sembrado e idempotencia de 18 logros distribuidos según las restricciones CHECK de PostgreSQL (`streak`, `xp`, `curriculum`, `mastery`, `speed`).
   - Cobertura de condiciones: `lessons_completed`, `streak_days`, `total_xp`, `profile_customized`, `stars_3_count`, `total_stars`, `modules_mastered`, `mistakes_resolved`, `quiz_flawless`, `exams_passed`, `apex_cleared`, `speed_demon`.

3. **Servicio Central `AchievementsService` (`apps/api/src/modules/achievements/achievements.service.ts`):**
   - Consulta consolidada de telemetría de usuario en paralelo (`User`, `UserSectionStars`, `UserModuleProgress`, `UserMistakesNotebook`, `Attempt`).
   - Algoritmo de conciliación en tiempo real: compara métricas contra las metas del catálogo.
   - Desbloqueo transaccional (`$transaction`):
     - Inserción en `user_achievements` con metadata del logro.
     - Incremento atómico de `users.total_xp`.
     - Creación de registro de auditoría en `xp_transactions` con idempotency key (`achievement:${userId}:${code}`).
   - Retorno estructurado con `progress_percentage`, valores actuales/objetivo y lista de `newly_unlocked`.

4. **Controlador REST `AchievementsController` (`apps/api/src/modules/achievements/achievements.controller.ts`):**
   - Endpoints autenticados vía `SupabaseAuthGuard`:
     - `GET /api/v1/users/me/achievements` y `GET /api/v1/achievements`
     - `POST /api/v1/users/me/achievements/check` y `POST /api/v1/achievements/check`
   - Documentación Swagger/OpenAPI con esquemas y respuestas HTTP 200 y 401.

5. **Registro Modular (`apps/api/src/app.module.ts`):**
   - Inclusión de `AchievementsModule` en las dependencias primarias de la aplicación.

---

## 2. Pruebas y Verificación

- **Suite de Pruebas Unitarias:**
  - Archivo `apps/api/src/modules/achievements/achievements.service.spec.ts` cubriendo:
    - Lanzamiento de `NotFoundException` para usuarios inexistentes.
    - Evaluación y desbloqueo automático de logros elegibles.
    - Idempotencia y prevención de doble acreditación de XP.
    - Cálculo de métricas y porcentajes de progreso.
  - Ejecución de `pnpm --filter api test`: **30/30 suites aprobadas, 109 tests aprobados**.
- **Chequeo de Tipos y Compilación:**
  - `pnpm --filter api exec tsc --noEmit` completado con 0 errores.
  - `pnpm --filter api build` ejecutó `prisma generate && nest build` exitosamente.
- **Verificación en Base de Datos Real:**
  - Validación con usuario real: detección y desbloqueo exitoso de 5 logros iniciales ganados (+280 XP acreditados), seguido de prueba de idempotencia con 0 duplicados y estado consistente.
