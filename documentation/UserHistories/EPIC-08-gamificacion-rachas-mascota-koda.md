# 🟠 EPIC 8 — Gamificación, Economía XP, Rachas y Mascota Koda 🦊
`Sprint 4 · v2.0 · Color Jira: Naranja · Código: GAMI`

> Esta épica materializa el **Gamification Engine** de Koda (`16_GAMIFICATION.md`, `12_DATABASE_DESIGN.md`, `05_FUNCTIONAL_REQUIREMENTS.md` RF-XP/RF-RACHA/RF-LOGRO) y la integración del **Motor Gráfico WebGL PixiJS v7** (`ADR-004`): economía de puntos XP determinista con libro mayor inmutable, fórmula de niveles exponencial, rachas diarias con protectores de congelamiento (*freeze*), control automatizado de tiempo de estudio mediante triggers en Supabase, catálogo de 18 logros y reacciones emocionales de la mascota 🦊 en tiempo real.

---

### GAMI-01 — Economía de Experiencia (XP) Determinista y Progresión de Niveles
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Developer + Frontend Developer  
**Rama sugerida:** `feature/economia-xp-niveles`  
**Trazabilidad:** `16_GAMIFICATION.md` §4, `12_DATABASE_DESIGN.md`

**Historia de usuario:**
> "Como estudiante, quiero ganar puntos de experiencia (XP) por cada acción de aprendizaje y subir de nivel progresivamente,
> para sentir una sensación tangible de avance y maestría conforme domino Python 3.12."

**Criterios de aceptación:**
- Tabla oficial de acciones XP deterministas (`16` §4):
  - `XP-EJ-CORR`: +5 XP por ítem correcto en la tríada de lección.
  - `XP-SEC`: +10 XP al completar una sección (10 lecciones).
  - `XP-QUIZ`: +25 XP al aprobar un Quiz intermedio ($\ge 70\%$).
  - `XP-EXAM`: +100 XP al aprobar un Examen Final ($\ge 80\%$).
  - `XP-MOD-BONO`: +50 XP al completar un módulo al 100%.
  - `XP-REPASO`: +2 XP en ronda final de sección / +5 XP en remediación de cuaderno de errores.
- Fórmula de nivel exponencial:
  $$\text{XP}(N) = \lfloor 100 \cdot N^{1.65} + 20 \cdot N \rfloor$$
  (Nivel 1: 120 XP, Nivel 2: 350 XP, Nivel 5: 1,520 XP, Nivel 10: 4,700 XP).
- **Inmutabilidad estricta del Ledger de XP (`xp_transactions`):**
  - Cada otorgamiento de XP genera una fila inmutable con `amount`, `balance_after`, `reason`, `reference_id` e `idempotency_key`.
  - Trigger PL/pgSQL `trg_xp_immutability` en Supabase que bloquea cualquier operación de `UPDATE` o `DELETE` sobre el libro mayor.
- Modal de celebración de "Level Up!" con animación de fuegos artificiales y Koda 🦊 ascendiendo de rango.

**Subtasks:**
- [x] [BD] Tabla `xp_transactions` en Supabase con RLS y trigger de inmutabilidad `fn_enforce_xp_immutability()`.
- [ ] [BACKEND] Servicio `GamificationService.awardXp()` con validación anti-farming e idempotencia por request.
- [ ] [BACKEND] Listener de eventos de dominio `GamificationListener` (`@OnEvent('lesson.completed')` / BullMQ Consumer) que acredita XP y recalcula niveles de forma asíncrona sin bloquear la respuesta de lección (`ADR-010`, `ADR-011`).
- [ ] [BACKEND] Resolver GraphQL `GamificationResolver` con `Query studentDashboard` para agregar nivel, XP, racha y estado de curso en una sola llamada (`ADR-012`).
- [ ] [FRONTEND] Barra de nivel animada en el Header global con porcentaje de avance hacia el siguiente nivel.
- [ ] [FRONTEND] Modal interactivo de subida de nivel con sonido triunfal y tarjeta compartible.

---

### GAMI-02 — Sistema de Rachas Diarias, Tiempo de Estudio y Freeze Automatizado por Triggers
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/rachas-diarias-freeze`  
**Trazabilidad:** `16_GAMIFICATION.md` §8, `12_DATABASE_DESIGN.md`

**Historia de usuario:**
> "Como estudiante que busca construir un hábito diario de estudio, quiero acumular días consecutivos de racha y registrar mi tiempo real de práctica según mi meta de onboarding,
> para mantener mi disciplina de aprendizaje y contar con protectores automáticos de racha en caso de imprevistos."

**Criterios de aceptación:**
- **Persistencia Diaria en Supabase (`streaks`):**
  - Registro diario por usuario (`user_id`, `activity_date`, `timezone`, `activity_count`, `study_time_seconds`, `lessons_completed_count`, `xp_earned_today`, `daily_goal_met`, `freeze_used`).
  - Cumplimiento de meta diaria: `daily_goal_met = true` cuando el tiempo acumulado de estudio en el día alcanza o supera los minutos configurados en el onboarding (`daily_goal_minutes * 60` segundos).
- **Métricas Agregadas $O(1)$ en `public.users`:**
  - `current_streak`: Racha activa continua en días.
  - `longest_streak`: Récord histórico personal de racha.
  - `streak_freeze_count`: Protectores acumulados (máximo 2).
  - `total_study_time_seconds`: Segundos totales de estudio acumulados en la plataforma.
  - `last_study_date`: Fecha de la última sesión completada.
- **Motor Automatizado en PostgreSQL (`fn_handle_user_study_activity`):**
  - Disparado tras cada inserción o actualización de lección en `attempts` (`completed_at IS NOT NULL`).
  - Si el usuario practicó ayer: incrementa `current_streak` en 1 y, si la racha es múltiplo de 7 (`current_streak % 7 == 0`), otorga automáticamente +1 protector (si tiene menos de 2).
  - Si el usuario faltó ayer pero tiene protectores (`streak_freeze_count > 0`): consume 1 protector, marca `freeze_used = true` en `streaks` y preserva la racha intacta.
  - Si el usuario faltó más de un día sin protectores: la racha se reinicia a 1.
- Contador de racha visible en el Header: ícono de fuego activo `🔥 7 días`. Encendido en naranja si ya completó su lección de hoy; grisáceo si aún tiene la meta pendiente.

**Subtasks:**
- [x] [BD] Tabla `streaks` en Supabase y trigger automático `trg_attempts_update_streak_and_study_time` ejecutando `fn_handle_user_study_activity()`.
- [x] [BD] Columnas agregadas `total_study_time_seconds`, `current_streak`, `longest_streak`, `streak_freeze_count` en `public.users`.
- [ ] [BACKEND] Listener `StreakListener` que reacciona asíncronamente a `lesson.completed` en BullMQ para auditar la racha del día sin impacto en la latencia de la lección (`ADR-010`, `ADR-011`).
- [ ] [BACKEND] Worker BullMQ programado para evaluar consumos de freeze al cierre de la ventana de gracia (`ADR-011`).
- [ ] [FRONTEND] Widget de racha en el Header con tooltip explicativo del estado del día, tiempo invertido y protectores restantes.
- [ ] [FRONTEND] Modal de rescate o notificación cuando se consumió un Freeze para salvar la racha: *"¡Tu protector de racha te ha salvado ayer! Continúa hoy para mantener el fuego encendido 🛡️"*.

**DoD adicional para esta US:**
- Manejo correcto de bordes de zona horaria verificado mediante tests de fecha y hora simulados.

---

### GAMI-03 — Catálogo de Logros (Achievements) y Medallas Desbloqueables
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Frontend Developer + Backend Developer  
**Rama sugerida:** `feature/catalogo-logros-medallas`  
**Trazabilidad:** `16_GAMIFICATION.md` §10, `12_DATABASE_DESIGN.md`

**Historia de usuario:**
> "Como estudiante, quiero desbloquear medallas y logros especiales al alcanzar hitos clave (racha, maestría 3⭐, remediación de errores),
> para coleccionar reconocimientos en mi perfil y celebrar mis momentos memorables en Python 3.12."

- Catálogo oficial poblado en Supabase (`achievements`) con 18 logros MVP (`16` §10):
  - *Primera Racha (`first_streak`):* Completar el primer día de estudio (+50 XP).
  - *Fuego Imparable (`streak_7_days`):* Mantener 7 días de racha continua (+150 XP).
  - *Perfección Absoluta (`first_star_3`):* Conseguir 3 estrellas en una sección (+100 XP).
  - *Maestro del Módulo (`first_module_master`):* Dominar un módulo con más del 80% de estrellas (+300 XP).
  - *Aprendiendo del Error (`first_remediation`):* Remediar el primer fallo en el Cuaderno de Errores (+75 XP).
- Consulta de logros mediante **GraphQL (`Query myAchievements`)** (`ADR-012`) y soporte REST `GET /api/v1/users/me/achievements`: lista completa de logros con fecha de desbloqueo en `user_achievements` sin over-fetching.
- Notificación flotante tipo Toast animado en el momento exacto en que se desbloquea un logro: *"🏆 ¡Logro Desbloqueado: Perfección Absoluta! (+100 XP)"*.
- Pantalla `/app/logros` con vitrina de medallas doradas, plateadas y de bronce y filtros (Obtenidos / Por desbloquear).

**Subtasks:**
- [x] [BD] Tablas `achievements` y `user_achievements` en Supabase con RLS y semillas iniciales desplegadas.
- [ ] [BACKEND] Event listener en NestJS (`EventEmitter2` / BullMQ) que escuche eventos de lección/examen y evalúe condiciones de logro de forma asíncrona (`ADR-010`, `ADR-011`).
- [ ] [BACKEND] Resolver GraphQL `GamificationResolver` con `Query myAchievements` (`ADR-012`).
- [ ] [FRONTEND] Pantalla `apps/web/src/app/logros/page.tsx` con vitrina de medallas.
- [ ] [FRONTEND] Componente de notificación emergente `AchievementToast.tsx` con sonido de fanfarria suave.

---

### GAMI-04 — Motor Gráfico WebGL PixiJS v7: Mascota Koda 🦊 y Confeti
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Frontend Lead (PixiJS & Canvas Specialist)  
**Rama sugerida:** `feature/pixijs-mascota-emociones`  
**Trazabilidad:** `ADR-004`, `27_UI_UX_SPECIFICATION.md`

**Historia de usuario:**
> "Como estudiante, quiero ver a la mascota Koda 🦊 reaccionar con animaciones fluidas a 120 FPS según mis resultados (festejo, ánimo, concentración),
> para conectar emocionalmente con la plataforma y recibir motivación visual instantánea."

**Criterios de aceptación:**
- Renderizado mediante PixiJS v7 sobre canvas HTML5 con fallback transparente a CSS animations en navegadores sin WebGL.
- Máquina de estados visuales de Koda 🦊:
  - `IDLE`: Parpadeo suave, respiración y movimiento sutil de cola.
  - `HAPPY`: Salto con orejas erguidas y ojos brillantes al acertar un ítem o lección.
  - `ENCOURAGING`: Mano al mentón con expresión comprensiva y gesto de ánimo al cometer un error.
  - `CELEBRATING`: Baile de victoria con explosión de partículas de confeti dorado al completar una sección o desbloquear 3 estrellas.
- Rendimiento impecable: tasa de cuadros sostenida en 60–120 FPS sin picos de *garbage collection* ni fugas de memoria en cambios de ruta.

**Subtasks:**
- [ ] [FRONTEND] Configurar contenedor PixiJS v7 desacoplado en `apps/web/src/components/mascot/KodaMascotCanvas.tsx`.
- [ ] [FRONTEND] Crear máquina de estados de animaciones conectada a eventos del Workspace de Lección.
- [ ] [FRONTEND] Sistema de partículas de confeti acelerado por hardware para hitos de 3 estrellas y exámenes aprobados.
- [ ] [TEST] Verificar desmonte limpio del contexto WebGL en `useEffect` cleanup para evitar fugas de memoria.
