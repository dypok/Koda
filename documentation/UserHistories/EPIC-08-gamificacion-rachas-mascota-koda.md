# 🟠 EPIC 8 — Gamificación, Economía XP, Rachas y Mascota Koda 🦊
`Sprint 4 · v1.0 · Color Jira: Naranja · Código: GAMI`

> Esta épica materializa el **Gamification Engine** de Koda (`16_GAMIFICATION.md`, `05_FUNCTIONAL_REQUIREMENTS.md` RF-XP/RF-RACHA/RF-LOGRO) y la integración del **Motor Gráfico WebGL PixiJS v7** (`ADR-004`): economía de puntos XP determinista, fórmula de niveles exponencial, rachas diarias con congelamiento (*freeze*), catálogo de 18 logros y reacciones emocionales de la mascota 🦊 en tiempo real.

---

### GAMI-01 — Economía de Experiencia (XP) Determinista y Progresión de Niveles
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Developer + Frontend Developer  
**Rama sugerida:** `feature/economia-xp-niveles`

**Historia de usuario:**
> "Como estudiante, quiero ganar puntos de experiencia (XP) por cada acción de aprendizaje y subir de nivel progresivamente,
> para sentir una sensación tangible de avance y maestría conforme domino Python 3.12."

**Criterios de aceptación:**
- Tabla oficial de 10 acciones XP deterministas (`16` §4):
  - `XP-EJ-CORR`: +5 XP por ejercicio correcto en lección.
  - `XP-SEC`: +10 XP al completar una sección (10 lecciones).
  - `XP-QUIZ`: +25 XP al aprobar un Quiz intermedio ($\ge 70\%$).
  - `XP-EXAM`: +100 XP al aprobar un Examen Final ($\ge 80\%$).
  - `XP-MOD-BONO`: +50 XP al completar un módulo al 100%.
  - `XP-REPASO`: +2 XP en ronda final de sección / +5 XP en remediación de cuaderno.
- Fórmula de nivel exponencial (`16` §6):
  $$\text{XP}(N) = \lfloor 100 \cdot N^{1.65} + 20 \cdot N \rfloor$$
  (Nivel 1: 120 XP, Nivel 2: 350 XP, Nivel 5: 1,520 XP, Nivel 10: 4,700 XP).
- Reglas anti-gaming del servidor: validación estricta de tiempo mínimo por lección (mínimo 15 segundos para evitar bots de auto-click) e idempotencia por acción.
- Modal de celebración de "Level Up!" con animación de fuegos artificiales y Koda 🦊 ascendiendo de rango.

**Subtasks:**
- [ ] [BD] Tabla `xp_transactions` con trigger que actualice `users.total_xp` y `users.level`.
- [ ] [BACKEND] Listener de eventos de dominio `GamificationListener` (`@OnEvent('lesson.completed')` / BullMQ Consumer) que acredita XP y recalcula niveles de forma asíncrona sin bloquear la respuesta de lección (`ADR-010`, `ADR-011`).
- [ ] [BACKEND] Resolver GraphQL `GamificationResolver` con `Query studentDashboard` para agregar nivel, XP, racha y estado de curso en una sola llamada (`ADR-012`).
- [ ] [FRONTEND] Barra de nivel animada en el Header global con porcentaje de avance hacia el siguiente nivel.
- [ ] [FRONTEND] Modal interactivo de subida de nivel con sonido triunfal y tarjeta compartible.

**DoD adicional para esta US:**
- Transacciones de XP auditables con cero inconsistencias numéricas tras reinicios de sesión.

---

### GAMI-02 — Sistema de Rachas Diarias (Streaks), Ventana de Gracia y Freeze
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/rachas-diarias-freeze`

**Historia de usuario:**
> "Como estudiante que busca construir un hábito constante de estudio, quiero mantener una racha de días consecutivos de aprendizaje,
> para no romper mi disciplina y tener protectores de racha en caso de imprevistos."

**Criterios de aceptación:**
- Contador de racha visible en el Header: ícono de fuego activo `🔥 7 días`.
- Ventana diaria configurada según la zona horaria del usuario (`America/Bogota` por defecto, `00:00:00` a `23:59:59`):
  - Al completar al menos 1 micro-lección en el día, la racha del día se marca como activa (`is_active_today = true`).
  - Si el usuario no practica en el día y tiene al menos 1 **Streak Freeze**, se consume automáticamente el protector y la racha se preserva intacta.
  - Ventana de gracia de 2 horas (hasta las `02:00:00` del día siguiente) antes de que la racha se reinicie a cero (`16` §8).
- Obtención de protectores: 1 Streak Freeze otorgado automáticamente por cada 7 días de racha continua (máximo 2 acumulables).
- Estado visual del fuego: encendido (naranja brillante) si ya practicó hoy; apagado/grisáceo si aún no ha completado su lección diaria.

**Subtasks:**
- [ ] [BD] Tabla `user_streaks` con `current_streak`, `max_streak`, `freeze_count`, `last_activity_date`.
- [ ] [BACKEND] Listener `StreakListener` que reacciona asíncronamente a `lesson.completed` para marcar la racha del día sin impacto en la latencia de la lección (`ADR-010`).
- [ ] [BACKEND] Worker BullMQ programado para evaluar consumos de freeze al cierre de la ventana de gracia (`ADR-011`).
- [ ] [FRONTEND] Widget de racha en el Header con tooltip explicativo del estado del día y protectores restantes.
- [ ] [FRONTEND] Modal de rescate de racha si se consumió un Freeze: *"¡Tu protector de racha te ha salvado ayer! Continúa hoy para mantener el fuego encendido 🛡️"*.

**DoD adicional para esta US:**
- Manejo correcto de bordes de zona horaria verificado mediante tests de fecha y hora simulados.

---

### GAMI-03 — Catálogo de Logros (Achievements) y Medallas Desbloqueables
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Frontend Developer + Backend Developer  
**Rama sugerida:** `feature/catalogo-logros-medallas`

**Historia de usuario:**
> "Como estudiante, quiero desbloquear medallas y logros especiales al alcanzar hitos clave,
> para coleccionar reconocimientos en mi perfil y celebrar mis momentos memorables en Python."

**Criterios de aceptación:**
- Catálogo de **18 logros MVP** (`16` §10) distribuidos en 4 categorías:
  1. *Primeros Pasos:* "¡Hola, Mundo!" (completar primera lección), "Primeros 100 XP".
  2. *Constancia:* "Semana de Fuego" (7 días de racha), "Mes Legendario" (30 días).
  3. *Maestría:* "Perfección en Fundamentos" (3⭐ en todo M01), "Cazador de Errores" (10 errores remediados en el cuaderno).
  4. *Excelencia:* "Mente Brillante" (100% en un Examen Final sin errores).
- Endpoint `GET /api/v1/users/me/achievements`: lista completa de logros con fecha de desbloqueo o progreso porcentual hacia la meta.
- Notificación flotante tipo Toast animado en el momento exacto en que se desbloquea un logro: *"🏆 ¡Logro Desbloqueado: Perfección en Fundamentos! (+50 XP)"*.
- Pantalla `/app/logros` con vitrina de medallas doradas, plateadas y de bronce.

**Subtasks:**
- [ ] [BD] Tablas `achievements` y `user_achievements` en Supabase con metadata, icono y XP bono.
- [ ] [BACKEND] Event listener en NestJS (`EventEmitter2`) que escuche eventos de lección/examen y evalúe condiciones de logro.
- [ ] [FRONTEND] Pantalla `apps/web/src/app/logros/page.tsx` con vitrina de medallas y filtros (Obtenidos / Por desbloquear).
- [ ] [FRONTEND] Componente de notificación emergente `AchievementToast.tsx` con sonido de fanfarria suave.

**DoD adicional para esta US:**
- Cada logro solo puede ser otorgado una única vez por usuario.

---

### GAMI-04 — Motor Gráfico WebGL PixiJS v7: Mascota Koda 🦊 y Confeti
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Frontend Lead (PixiJS & Canvas Specialist)  
**Rama sugerida:** `feature/pixijs-mascota-emociones`

**Historia de usuario:**
> "Como estudiante, quiero que la mascota Koda 🦊 reaccione en pantalla con emociones visuales y confeti en tiempo real según mi desempeño,
> para tener un compañero de aprendizaje carismático y empático que celebre mis victorias y me anime en mis fallos."

**Criterios de aceptación:**
- Motor gráfico basado en **PixiJS v7.4+** con aceleración por hardware WebGL y fallback automático a Canvas 2D (`ADR-004`).
- **6 Estados Emocionales de Koda 🦊:**
  1. `idle`: Flotación suave y parpadeo ocasional mientras el usuario lee la lección.
  2. `thinking`: Orejas atentas y ceño curioso cuando el usuario interactúa con el código.
  3. `happy`: Sonrisa brillante y salto de alegría cuando el usuario responde correctamente.
  4. `proud`: Postura de superhéroe con medalla al completar una sección o quiz.
  5. `encouraging`: Expresión cálida y gesto de ánimo *"¡No te rindas!"* cuando comete un error.
  6. `celebrating`: Lluvia de confeti multicolor acelerado y giros al subir de nivel o graduarse del curso.
- Renderizado a 60 FPS estables con consumo de memoria inferior a 40 MB en el navegador.
- Integración perfecta con el estado global de la lección mediante Zustand: `setMascotMood('happy')`.

**Subtasks:**
- [ ] [FRONTEND] Diseñar los spritesheets optimizados de Koda 🦊 en formato WebP con resolución retina.
- [ ] [FRONTEND] Implementar `PixiMascotCanvas.tsx` con contenedor `PIXI.Application` y ciclo de vida React limpio.
- [ ] [FRONTEND] Implementar sistema de partículas para confeti acelerado (`PixiParticlesEmitter`).
- [ ] [FRONTEND] Conectar transiciones de estados anímicos controladas por el resultado de las respuestas en el Workspace.
- [ ] [TEST] Verificar desmonte correcto de WebGL context (`app.destroy(true)`) para prevenir memory leaks al navegar.

**DoD adicional para esta US:**
- La animación no bloquea el hilo principal de JavaScript ni provoca jank en dispositivos móviles de gama media.
