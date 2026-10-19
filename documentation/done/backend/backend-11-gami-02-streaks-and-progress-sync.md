# Entregable Backend: Cálculo Atómico de Rachas Diarias y Sincronización de Progreso (GAMI-02)

**HU Asociada:** GAMI-02 — Sistema de Rachas Diarias (Streaks), Ventana de Gracia y Freeze  
**Épica:** EPIC-08 — Gamificación, Economía XP, Rachas y Mascota Koda 🦊  
**Rama:** `feat/gami-02-streaks-floating-dock`  
**Fecha:** 18 de Octubre de 2026  
**Autor:** Dylan Gamero

---

## 1. Resumen Arquitectónico

Se implementó el ciclo de cálculo de rachas diarias y protectores de congelamiento (*streak freeze*) dentro del flujo transaccional de guardado de progreso pedagógico en PostgreSQL (`PrismaProgressRepository.saveSectionCompletion`):

1. **Capa Domain (`domain/repositories/progress.repository.ts`):**
   - Extensión de `SaveSectionCompletionResult` para incluir `currentStreak`, `longestStreak`, `streakFreezeCount` e `isActiveToday`.
2. **Capa Infraestructura (`infra/database/postgres/repositories/prisma-progress.repository.ts`):**
   - Lectura transaccional de los campos de gamificación del usuario (`currentStreak`, `longestStreak`, `streakFreezeCount`, `lastStudyDate`, `timezone`).
   - Algoritmo de racha con zona horaria del estudiante:
     - **Mismo día:** Si `lastStudyDate === hoy`, la racha activa se mantiene sin doble incremento.
     - **Día consecutivo (`diff === 1`):** `currentStreak = currentStreak + 1`. Actualización de récord histórico `longestStreak`. Bonificación de +1 Streak Freeze cada 7 días continuos (tope máx 2).
     - **Rescate por Freeze (`diff === 2` y `freezeCount > 0`):** Se consume 1 freeze (`streakFreezeCount -= 1`), se rescata y suma la racha `currentStreak += 1`.
     - **Primer estudio o racha rota:** Si `diff > 1` sin protectores o `lastStudyDate == null`, se inicializa en `currentStreak = 1`.
   - Actualización atómica en `User` y sincronización con el modelo `Streak`.
3. **Capa Aplicación (`application/dto/learning/section-completion-response.dto.ts` y `complete-section.use-case.ts`):**
   - Mapeo de `currentStreak`, `longestStreak`, `streakFreezeCount` e `isActiveToday` en `SectionCompletionResponseDto`.
4. **Capa Presentación (`presentation/graphql/learning/types/learning.type.ts`):**
   - Declaración de campos correspondientes en `SectionCompletionType` para paridad REST y GraphQL.

---

## 2. Pruebas y Verificación

- **Suite de Pruebas Unitarias:**
  - `pnpm --filter api test` ejecutó las 24 suites de pruebas (82 tests totales) finalizando con **100% de éxito (24 passed)**.
- **Compilación de Producción:**
  - `pnpm --filter api build` ejecutó `prisma generate && nest build` con código de salida 0.
