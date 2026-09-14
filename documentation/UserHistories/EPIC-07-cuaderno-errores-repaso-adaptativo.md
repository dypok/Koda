# 🟣 EPIC 7 — Cuaderno de Errores Persistente y Repaso Adaptativo (SM-2)
`Sprint 3 · v2.0 · Color Jira: Índigo · Código: NOTE`

> Esta épica desarrolla el **Cuaderno de Errores Persistente** y el **Motor de Repaso Adaptativo con Algoritmo SuperMemo SM-2** de Koda (`01_PROJECT_OVERVIEW.md` §10, `14_LEARNING_SYSTEM.md` §6, `ADR-011`, `12_DATABASE_DESIGN.md`, `05_FUNCTIONAL_REQUIREMENTS.md` RF-REP-*): almacenamiento de preguntas falladas en Supabase (`user_mistakes_notebook`), sesiones de práctica deliberada, recompensa de +5 XP por remediación y algoritmo de repetición espaciada.

---

### NOTE-01 — Pantalla y Gestión del Cuaderno de Errores Personal
**Tipo:** Story | **SP:** 5 | **Prioridad:** Alta | **Asignado:** Frontend Developer + Backend Developer  
**Rama sugerida:** `feature/cuaderno-errores-pantalla`  
**Trazabilidad:** `12_DATABASE_DESIGN.md` (`user_mistakes_notebook`), `27_UI_UX_SPECIFICATION.md`

**Historia de usuario:**
> "Como estudiante, quiero tener una sección dedicada a mi 'Cuaderno de Errores' en la barra lateral,
> para consultar en cualquier momento los conceptos de Python donde me equivoqué y planificar mi estudio correctivo."

- Consulta de errores mediante **GraphQL (`Query mistakeNotebook(status: MistakeStatus)`)** (`ADR-012`) y endpoint REST `GET /api/v1/notebook/mistakes`: entrega la lista paginada de errores no resueltos (`is_resolved = false`) desde la tabla `user_mistakes_notebook` en Supabase (filtrable por `course_slug` y `module_slug`), con soporte para el algoritmo de repetición espaciada SuperMemo SM-2 (`next_review_at`, `ease_factor`, `repetition_count`, `fail_count`) (`ADR-011`).
- Pantalla `/app/cuaderno` con diseño tipo libreta de laboratorio con temática oscura:
  - Header motivador: *"Tu Cuaderno de Laboratorio · X conceptos pendientes por dominar"*.
  - Mascota Koda 🦊 con bata de científico o lupa (modo `thinking`).
  - Tarjetas de error detallando: módulo de origen, reactivo de la tríada fallado, fecha del último fallo, conteo de errores acumulados (`fail_count`) y fecha de próximo repaso (`next_review_at`).
  - Filtro por estado: *"Pendientes"* y *"Dominados / Resueltos"*.
  - Estado vacío enriquecido: *"¡Tu cuaderno está impecable! No tienes errores pendientes. Sigue así 🚀"*.

**Subtasks:**
- [x] [BD] Tabla `user_mistakes_notebook` desplegada en Supabase con campos `fail_count`, `interval_days`, `ease_factor`, `repetition_count`, `next_review_at` y RLS habilitado (`ADR-011`).
- [ ] [BACKEND] Resolver GraphQL `NotebookResolver` con `Query mistakeNotebook` en `infrastructure/` implementando el puerto `INotebookRepository` (`ADR-010`, `ADR-012`).
- [ ] [BACKEND] Controlador REST `NotebookController` en `apps/api/src/modules/notebook/` con endpoint de listado paginado y conteo de fallos pendientes.
- [ ] [FRONTEND] Pantalla `apps/web/src/app/cuaderno/page.tsx` con grid de tarjetas de errores pendientes.
- [ ] [FRONTEND] Badge numérico de alerta en el ítem de navegación del Sidebar: *"📓 Cuaderno [ 4 ]"*.

---

### NOTE-02 — Sesión de Remediación Interactiva y Bono de Maestría (+5 XP)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/remediacion-errores-xp`  
**Trazabilidad:** `16_GAMIFICATION.md` §4, `ADR-011`

**Historia de usuario:**
> "Como estudiante, quiero resolver un desafío de mi cuaderno de errores con opciones barajadas y explicaciones guiadas,
> para superar mi debilidad conceptual, eliminar el error de mi cuaderno y ganar +5 XP de recuperación."

**Criterios de aceptación:**
- Botón *"Practicar este error"* en la tarjeta del cuaderno, o botón global *"Modo Remediación Rápida (5 preguntas)"*.
- Se presenta el reactivo con **opciones barajadas aleatoriamente (Fisher-Yates)** para validar comprensión real en lugar de memoria posicional.
- **Mutación GraphQL (`Mutation resolveMistake(input: ResolveMistakeInput!)`)** (`ADR-012`) y endpoint REST `POST /api/v1/notebook/mistakes/:questionId/resolve`:
  - Si la respuesta es **Correcta**:
    - Actualiza el registro en `user_mistakes_notebook`: `is_resolved = true`, `resolved_at = now()`, `xp_recovered = 5`.
    - Ajusta los parámetros del algoritmo SM-2 incrementando `repetition_count` y recalculando `interval_days` y `ease_factor`.
    - Otorga **+5 XP** de remediación deliberada mediante registro inmutable en `xp_transactions` (`16` §4).
    - Tarjeta verde animada: *"¡Concepto dominado! Has eliminado este tropiezo de tu cuaderno"*.
  - Si la respuesta es **Incorrecta**:
    - El error permanece no resuelto, se incrementa `fail_count`, se reinicia el intervalo SM-2 (`interval_days = 1`) y se muestra una pista pedagógica reforzada.

**Subtasks:**
- [ ] [BACKEND] Caso de uso `ResolveMistakeUseCase` en `application/` y Resolver GraphQL `NotebookResolver.resolveMistake()` (`ADR-012`).
- [ ] [BACKEND] Endpoint de resolución en `NotebookController` / `NotebookService` con validación de solución y acreditación transaccional de XP en Supabase.
- [ ] [FRONTEND] Modal de remediación rápida enfocado en el código con atajos de teclado (`1-4`, `Enter`).
- [ ] [FRONTEND] Animación de tachado o disolución de la tarjeta de error cuando el usuario la resuelve con éxito.
- [ ] [FRONTEND] Actualizar contador del Sidebar en tiempo real vía Zustand.

---

### NOTE-03 — Algoritmo SuperMemo SM-2 de Repetición Espaciada
**Tipo:** Story | **SP:** 3 | **Prioridad:** Media | **Asignado:** Backend Developer  
**Rama sugerida:** `feature/algoritmo-sm2-repaso`  
**Trazabilidad:** `ADR-011`, `12_DATABASE_DESIGN.md` §6.21

**Historia de usuario:**
> "Como estudiante antes de presentar un examen de módulo, quiero que el sistema calcule los intervalos óptimos de repaso mediante repetición espaciada SM-2,
> para reforzar conceptos justo antes de que mi memoria los olvide según la curva del olvido de Ebbinghaus."

**Criterios de aceptación:**
- **Implementación del Algoritmo SuperMemo SM-2 (`ADR-011`):**
  - Calificación de calidad de respuesta $q \in [0..5]$:
    - Si $q \ge 3$: acierto; el factor de facilidad se ajusta:
      $$EF' = \max(1.30, EF + (0.1 - (5 - q) \cdot (0.08 + (5 - q) \cdot 0.02)))$$
      Intervalos: $I(1) = 1\text{ día}$, $I(2) = 6\text{ días}$, $I(n) = \lceil I(n-1) \cdot EF \rceil$.
    - Si $q < 3$: fallo; se reinicia $n = 0$ e $I = 1\text{ día}$.
- Cálculo de próxima fecha de repaso: `next_review_at = now() + (interval_days || ' days')::interval`.
- Endpoint `GET /api/v1/notebook/queue`: retorna los reactivos cuya fecha `next_review_at <= now()`, ordenados por prioridad de olvido.
- Notificación inteligente en el Roadmap: *"🦊 Tienes 3 conceptos listos para repaso espaciado hoy. Refuérzalos para no olvidarlos"*.

**Subtasks:**
- [x] [BD] Campos `ease_factor`, `interval_days`, `repetition_count`, `next_review_at` e índices correspondientes en Supabase.
- [ ] [BACKEND] Servicio `SpacedRepetitionService` implementando las fórmulas canónicas de SM-2 en NestJS.
- [ ] [FRONTEND] Widget de recordatorio de repaso espaciado en la cabecera del Roadmap.
