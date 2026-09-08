# 🔴 EPIC 6 — Sistema de Evaluación: Quizzes y Exámenes Finales
`Sprint 3 · v1.0 · Color Jira: Rojo · Código: EVAL`

> Esta épica implementa el **Evaluation Engine** de Koda (`15_QUIZ_EXAM_SYSTEM.md`, `05_FUNCTIONAL_REQUIREMENTS.md` RF-EVAL-*): el banco de preguntas calibradas, la generación dinámica de quizzes intermedios (umbral $\ge 70\%$), exámenes finales de módulo (umbral $\ge 80\%$), calificación automática auditable y revisión formativa de errores.

---

### EVAL-01 — Motor de Quizzes Intermedios de Módulo (Umbral $\ge 70\%$)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/quizzes-intermedios`

**Historia de usuario:**
> "Como estudiante que completó la mitad de un módulo, quiero rendir un Quiz intermedio de 10 preguntas con retroalimentación global,
> para comprobar que he consolidado los conceptos clave antes de avanzar a las secciones avanzadas."

**Criterios de aceptación:**
- El Quiz se desbloquea automáticamente al completar el 50% de las secciones del módulo (`RF-QUIZ-001`).
- Muestreo dinámico de 10 preguntas calibradas extraídas de `bank.json` siguiendo la matriz `config/compositions.json` (3 single choice, 2 predict output, 2 true/false, etc.).
- Interfaz de evaluación: barra de progreso, navegación hacia adelante/atrás entre preguntas y confirmación previa al envío final.
- Umbral de aprobación: **70% de aciertos** (mínimo 7/10 preguntas correctas).
- Al aprobar: otorga **+25 XP**, marca el quiz como superado y muestra pantalla de felicitación con Koda 🦊.
- Si no aprueba (< 70%): muestra los conceptos a reforzar e invita a reintentar tras una breve revisión.

**Subtasks:**
- [ ] [BACKEND] Endpoint `GET /api/v1/learning/modules/:id/quiz`: genera un intento de quiz con 10 preguntas barajadas sin respuestas correctas.
- [ ] [BACKEND] Endpoint `POST /api/v1/learning/quiz/:id/attempt`: recibe las respuestas del usuario, calcula la nota porcentual y persiste el intento inmutable en Supabase.
- [ ] [FRONTEND] Pantalla `apps/web/src/app/evaluaciones/quiz/[id]/page.tsx` con navegación entre preguntas y contador de respondidas.
- [ ] [FRONTEND] Modal de confirmación: *"¿Estás seguro de enviar tu quiz? Tienes X preguntas sin responder"*.

**DoD adicional para esta US:**
- Calificación ejecutada y guardada en backend en tiempo interactivo (p95 < 500 ms).

---

### EVAL-02 — Motor de Exámenes Finales de Módulo y Desbloqueo (Umbral $\ge 80\%$)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Lead + Frontend Lead  
**Rama sugerida:** `feature/examenes-finales-desbloqueo`

**Historia de usuario:**
> "Como estudiante que terminó todas las secciones de un módulo, quiero presentar el Examen Final riguroso de 20 preguntas,
> para certificar mi dominio del módulo, ganar +100 XP y desbloquear el siguiente módulo en la ruta de Python."

**Criterios de aceptación:**
- Se desbloquea únicamente al completar el 100% de las secciones del módulo (`RF-EXAM-001`).
- Composición de 20 preguntas ponderadas por dificultad (Fácil: 40%, Media: 40%, Difícil: 20%) extraídas del banco de preguntas.
- Umbral de aprobación estricto: **80% de aciertos** (mínimo 16/20 preguntas correctas).
- Al aprobar con $\ge 80\%$:
  - Otorga **+100 XP** de examen + **+50 XP** de bono de finalización de módulo (`16` §4).
  - Desbloquea de forma atómica el siguiente módulo en la hoja de ruta de Python 3.12.
  - Si es el Módulo 12 (Proyecto Final Integrador), habilita la emisión del Certificado Oficial.
- Si no aprueba (< 80%):
  - Las preguntas falladas se envían automáticamente al **Cuaderno de Errores** del estudiante.
  - Se aplica un enfriamiento blando (*cooldown*) de 5 minutos antes de permitir un nuevo intento para fomentar el estudio y evitar adivinación forzada (`RF-EXAM-004`).

**Subtasks:**
- [ ] [BACKEND] Servicio `EvaluationService.generateExam()` con muestreo estratificado desde `bank.json`.
- [ ] [BACKEND] Transacción atómica en Supabase: evalúa examen $\rightarrow$ otorga XP $\rightarrow$ desbloquea Módulo $N+1$.
- [ ] [FRONTEND] Pantalla `apps/web/src/app/evaluaciones/examen/[id]/page.tsx` con diseño sobrio y temporizador orientativo.
- [ ] [FRONTEND] Pantalla de resultado final con desglose por área temática (Sintaxis, Lógica, Depuración) y Koda en estado triunfal (`proud`).

**DoD adicional para esta US:**
- El examen genera un set de preguntas aleatorio en cada reintento para evitar memorización de respuestas.

---

### EVAL-03 — Pantalla de Revisión Detallada de Respuestas y Aprendizaje del Error
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Frontend Developer  
**Rama sugerida:** `feature/revision-intento-evaluacion`

**Historia de usuario:**
> "Como estudiante tras terminar un quiz o examen, quiero ver un resumen detallado de cada pregunta con mis aciertos y errores,
> para entender exactamente en qué fallé y qué concepto debo repasar antes de volver a intentarlo."

**Criterios de aceptación:**
- Disponible inmediatamente después de enviar el quiz o examen (`05` RF-EVAL-004).
- Muestra la lista de preguntas con dos colores:
  - Verde: respuesta correcta con explicación del fundamento conceptual.
  - Rojo: respuesta del usuario incorrecta + explicación formativa clara (sin ridiculizar el fallo) + enlace al concepto en la lección teórica correspondiente.
- Botón *"Guardar en mi Cuaderno de Errores"* para preguntas desafiantes que el usuario desee practicar después.
- Botón de acción principal: *"Continuar"* (si aprobó) o *"Repasar conceptos clave"* (si reprobó).

**Subtasks:**
- [ ] [BACKEND] Endpoint `GET /api/v1/learning/attempts/:attemptId/summary` que entregue el detalle con explicaciones post-evaluación.
- [ ] [FRONTEND] Componente `AttemptReviewScreen.tsx` con tabs de filtro: *"Todas (20)"*, *"Aciertos (16)"*, *"Por Mejorar (4)"*.
- [ ] [FRONTEND] Tarjeta expandible por pregunta con el bloque de código de Python analizado.

**DoD adicional para esta US:**
- Los detalles de la solución solo se revelan una vez que el intento ha sido calificado y sellado en el servidor.

---

### EVAL-04 — Auditoría de Contenido y Versionado Inmutable de Evaluaciones
**Tipo:** Story | **SP:** 2 | **Prioridad:** Media | **Asignado:** Backend Developer  
**Rama sugerida:** `feature/versionado-evaluaciones`

**Historia de usuario:**
> "Como administrador y auditor educativo, quiero que cada intento quede sellado con el hash y versión exacta del contenido evaluado,
> para garantizar que los cambios futuros en las preguntas no alteren la validez ni las estadísticas históricas de los estudiantes."

**Criterios de aceptación:**
- Todo intento en `user_attempts` registra el campo `content_version` y el checksum SHA-256 de las preguntas evaluadas (`RNF-035`).
- Si un autor actualiza una pregunta en `content/languages/python/`, los intentos completados con anterioridad conservan su registro original inmutable.
- Métricas de calibración: registro del tiempo por pregunta y tasa de descarte para identificar preguntas con redacción confusa.

**Subtasks:**
- [ ] [BD] Constraints de inmutabilidad (evitar `UPDATE` o `DELETE` sobre `user_attempts` cerrados).
- [ ] [BACKEND] Inyectar versión de contenido en el payload de calificación en `EvaluationService`.
- [ ] [TEST] Test de regresión garantizando que la actualización de un JSON no altera intentos previos.

**DoD adicional para esta US:**
- Registros conformes con el estándar de auditoría establecido en `12_DATABASE_DESIGN.md` §11.
