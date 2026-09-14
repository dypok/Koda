# 🟣 EPIC 7 — Cuaderno de Errores Persistente y Repaso Adaptativo
`Sprint 3 · v1.0 · Color Jira: Índigo · Código: NOTE`

> Esta épica desarrolla el **Cuaderno de Errores Persistente** y el **Motor de Repaso Adaptativo** de Koda (`01_PROJECT_OVERVIEW.md` §10, `14_LEARNING_SYSTEM.md` §6, `05_FUNCTIONAL_REQUIREMENTS.md` RF-REP-*): almacenamiento de preguntas falladas, sesiones de práctica deliberada, recompensa de +5 XP por remediación y algoritmo de priorización de conceptos débiles.

---

### NOTE-01 — Pantalla y Gestión del Cuaderno de Errores Personal
**Tipo:** Story | **SP:** 5 | **Prioridad:** Alta | **Asignado:** Frontend Developer + Backend Developer  
**Rama sugerida:** `feature/cuaderno-errores-pantalla`

**Historia de usuario:**
> "Como estudiante, quiero tener una sección dedicada a mi 'Cuaderno de Errores' en la barra lateral,
> para consultar en cualquier momento los conceptos de Python donde me equivoqué y planificar mi estudio correctivo."

**Criterios de aceptación:**
- Consulta de errores mediante **GraphQL (`Query mistakeNotebook(status: MistakeStatus)`)** (`ADR-012`): entrega la lista paginada de fallos con soporte para el algoritmo de repetición espaciada SuperMemo SM-2 (`next_review_at`, `ease_factor`, `repetition_count`) (`ADR-011`).
- Pantalla `/app/cuaderno` con diseño tipo libreta de laboratorio con temática oscura:
  - Header motivador: *"Tu Cuaderno de Laboratorio · X conceptos pendientes por dominar"*.
  - Mascota Koda 🦊 con bata de científico o lupa (modo `thinking`).
  - Tarjetas de error detallando: módulo de origen, concepto clave (ej. `py-indentation-blocks`, `py-int-vs-float`), fecha del fallo y fragmento de código relevante.
  - Filtro por estado: *"Pendientes"* y *"Dominados / Resueltos"*.
  - Estado vacío enriquecido: *"¡Tu cuaderno está impecable! No tienes errores pendientes. Sigue así 🚀"*.

**Subtasks:**
- [x] [BD] Tabla `user_notebook_mistakes` en Supabase con columnas de algoritmo SM-2: `interval_days`, `ease_factor`, `repetition_count`, `next_review_at` (`ADR-011`).
- [ ] [BACKEND] Resolver GraphQL `NotebookResolver` con `Query mistakeNotebook` en `infrastructure/` implementando el puerto `INotebookRepository`.
- [ ] [FRONTEND] Pantalla `apps/web/src/app/cuaderno/page.tsx` con grid de tarjetas de errores pendientes.
- [ ] [FRONTEND] Badge numérico de alerta en el ítem de navegación del Sidebar: *"📓 Cuaderno [ 4 ]"*.

**DoD adicional para esta US:**
- Los errores se indexan por usuario garantizando aislamiento estricto de datos entre cuentas.

---

### NOTE-02 — Sesión de Remediación Interactiva y Bono de Maestría (+5 XP)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/remediacion-errores-xp`

**Historia de usuario:**
> "Como estudiante, quiero resolver un desafío de mi cuaderno de errores con opciones barajadas y explicaciones guiadas,
> para superar mi debilidad conceptual, eliminar el error de mi cuaderno y ganar +5 XP de recuperación."

**Criterios de aceptación:**
- Botón *"Practicar este error"* en la tarjeta del cuaderno, o botón global *"Modo Remediación Rápida (5 preguntas)"*.
- Se presenta el ejercicio con **opciones barajadas aleatoriamente** para validar comprensión real en lugar de memoria posicional.
- **Mutación GraphQL (`Mutation resolveMistake(input: ResolveMistakeInput!)`)** (`ADR-012`):
  - Si la respuesta es **Correcta**:
    - Marca el error como resuelto o recalcula el intervalo SM-2 de revisión futura.
    - Otorga **+5 XP** de remediación deliberada (`16` §4).
    - Tarjeta verde animada: *"¡Concepto dominado! Has eliminado este tropiezo de tu cuaderno"*.
  - Si la respuesta es **Incorrecta**:
    - El error permanece en la lista, se incrementa `fail_count` y se muestra una pista reforzada con analogía visual.

**Subtasks:**
- [ ] [BACKEND] Caso de uso `ResolveMistakeUseCase` en `application/` y Resolver GraphQL `NotebookResolver.resolveMistake()`.
- [ ] [FRONTEND] Modal de remediación rápida enfocado en el código con atajos de teclado (`1-4`, `Enter`).
- [ ] [FRONTEND] Animación de tachado o disolución de la tarjeta de error cuando el usuario la resuelve con éxito.
- [ ] [FRONTEND] Actualizar contador del Sidebar en tiempo real vía Zustand.

**DoD adicional para esta US:**
- El estudiante no puede farmear XP infinito con el mismo error: cada pregunta resuelta solo otorga los +5 XP una única vez.

---

### NOTE-03 — Algoritmo de Repaso Adaptativo Espaciado (Score de Repaso)
**Tipo:** Story | **SP:** 3 | **Prioridad:** Media | **Asignado:** Backend Developer  
**Rama sugerida:** `feature/algoritmo-repaso-adaptativo`

**Historia de usuario:**
> "Como estudiante antes de presentar un examen de módulo, quiero que el sistema me sugiera automáticamente los temas que debo repasar,
> para llegar con la máxima preparación sin perder tiempo en conceptos que ya tengo frescos."

**Criterios de aceptación:**
- Implementación de la fórmula matemática de Score de Repaso (`14` §6.2):
  $$\text{Score}(c) = w_1 \cdot \text{TasaError}(c) + w_2 \cdot (1 - \text{Rendimiento}(c)) + w_3 \cdot \text{Antigüedad}(c) + w_4 \cdot \text{Prerrequisito}(c)$$
  con pesos calibrados: $w_1 = 0.35$, $w_2 = 0.25$, $w_3 = 0.25$, $w_4 = 0.15$.
- Endpoint `GET /api/v1/learning/review/recommendations`: retorna el top 3 de conceptos con mayor necesidad de repaso para el usuario.
- Notificación o banner inteligente en el Roadmap antes de entrar a un Examen Final: *"🦊 Koda te sugiere repasar 'Indentación en Python' antes de rendir este examen"*.

**Subtasks:**
- [ ] [BACKEND] Servicio `ReviewEngineService` que ejecute la consulta analítica ponderada sobre `attempt_answers`.
- [ ] [BACKEND] Generar set dinámico de práctica rápida (3 ejercicios) a partir de los conceptos priorizados.
- [ ] [FRONTEND] Widget de sugerencia de repaso en la cabecera del Roadmap.

**DoD adicional para esta US:**
- Fórmula matemática verificada con tests unitarios ante matrices de prueba con diferentes antigüedades y tasas de fallo.
