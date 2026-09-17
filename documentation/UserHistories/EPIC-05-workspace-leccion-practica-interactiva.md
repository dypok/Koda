# 🟢 EPIC 5 — Workspace de Lección Atómica y Práctica Interactiva
`Sprint 3 · v1.0 · Color Jira: Verde · Código: LESS`

> Esta épica define el núcleo interactivo del estudiante: el **Workspace de Lección de Escritorio** dividido 50/50 (`27_UI_UX_SPECIFICATION.md` §15), el stepper de 10 píldoras, los atajos de teclado ergonómicos, la evaluación instantánea sin spoilers y la ronda de repaso final de sección.

---

### LESS-01 — Layout 50/50 Split Desktop y Stepper de 10 Píldoras
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Frontend Lead  
**Rama sugerida:** `feature/workspace-split-stepper`

**Historia de usuario:**
> "Como estudiante en escritorio, quiero una pantalla dividida en dos mitades (teoría a la izquierda y práctica a la derecha) con un indicador de 10 pasos,
> para concentrarme en la lección actual sin hacer scrolls verticales molestos ni perder el contexto de la sección."

**Criterios de aceptación:**
- **Layout de Escritorio 50/50:**
  - Panel Izquierdo (50%): Título de la micro-lección, teoría atómica (40–70 palabras), bloque de código con resaltado sintáctico de Python, consola con salida esperada y tip formativo.
  - Panel Derecho (50%): Enunciado del desafío, opciones interactivas de respuesta y tarjeta de feedback dinámico.
- **Stepper Superior de 10 Píldoras:**
  - Muestra las 10 micro-lecciones de la sección con 3 estados: `✓` Completada (verde), `●` Activa (azul/ámbar), `N` Pendiente (slate).
  - Al completar una lección, la píldora correspondiente cambia a `✓` con una micro-animación de pulso.
- **Modo Responsive Móvil:** en pantallas < 768px, los paneles se apilan verticalmente con pestañas superiores *"Concepto"* y *"Práctica"*.

**Subtasks:**
- [ ] [FRONTEND] Crear layout `LessonWorkspaceLayout.tsx` en `apps/web/src/components/lesson/`.
- [ ] [FRONTEND] Crear componente `SectionStepper.tsx` que reciba el arreglo de 10 lecciones y el índice activo.
- [ ] [FRONTEND] Integrar visor de código con resaltado sintáctico de Python (Shiki / PrismJS en tema oscuro `#0F172A`).
- [ ] [FRONTEND] Diseñar consola de salida de texto simulada con tipografía JetBrains Mono.
- [ ] [TEST] Verificar renderizado sin scrolls horizontales ni verticales en resolución estándar 1366x768 y 1920x1080.

**DoD adicional para esta US:**
- Cumplimiento de accesibilidad: soporte completo para lectores de pantalla mediante roles ARIA `tablist` y `tabpanel`.

---

### LESS-02 — Sistema de Atajos de Teclado Ergonómicos (`1-4`, `A-D`, `Enter`, Flechas)
**Tipo:** Story | **SP:** 2 | **Prioridad:** Alta | **Asignado:** Frontend Developer  
**Rama sugerida:** `feature/atajos-teclado-workspace`

**Historia de usuario:**
> "Como estudiante que valora la agilidad, quiero responder y navegar por las lecciones usando atajos de teclado sin tocar el ratón,
> para mantener un estado de flujo mental (*flow state*) ininterrumpido durante mi sesión de estudio."

**Criterios de aceptación:**
- Atajos estandarizados (`27_UI_UX_SPECIFICATION.md` §17):
  - Teclas `1`, `2`, `3`, `4` o `A`, `B`, `C`, `D`: Seleccionan la opción correspondiente.
  - Tecla `Enter` o `Espacio`: Ejecuta la acción primaria (si no hay opción seleccionada, no hace nada; si está seleccionada, pulsa *"Comprobar"*; si ya se evaluó, pulsa *"Continuar"* hacia la siguiente lección).
  - Flechas `←` y `→`: Navegan entre lecciones ya visitadas para repasar.
- Badges visuales visibles en cada botón de opción indicando su tecla rápida asociada (ej. `[ 1 ]`, `[ 2 ]`).
- Los atajos se deshabilitan automáticamente si el foco está sobre un input de texto para evitar conflictos.

**Subtasks:**
- [ ] [FRONTEND] Implementar hook personalizado `useLessonKeyboardShortcuts.ts` con `useEffect` y listeners de `keydown`.
- [ ] [FRONTEND] Mostrar etiquetas discretas de teclas sobre las tarjetas de opción en escritorio.
- [ ] [FRONTEND] Añadir indicador visual de tecla presionada con feedback táctil sutil.
- [ ] [TEST] Tests unitarios con `@testing-library/react` simulando eventos de teclado y transiciones de estado.

**DoD adicional para esta US:**
- Cero retraso perceptivo (latencia de respuesta de tecla < 16 ms).

---

### LESS-03 — Motor de Evaluación Inmediata y Feedback Formativo sin Spoilers
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/evaluacion-feedback-formativo`

**Historia de usuario:**
> "Como estudiante, cuando selecciono una respuesta, quiero recibir retroalimentación instantánea sin spoilers de la solución,
> para aprender del error mediante una pista que estimule mi razonamiento en lugar de darme la respuesta servida."

**Criterios de aceptación:**
- Endpoint `POST /api/v1/learning/lessons/:id/answer`:
  - Recibe `{ selected_option_ids: string[], time_spent_seconds: number }`.
  - Evalúa la respuesta de forma determinista contra el contenido oficial de Python 3.12.
  - Si es **Correcta**:
    - Retorna `is_correct: true`, `xp_earned: 5`, mensaje de refuerzo conceptual y explicación del porqué es correcta.
    - Banner verde inferior en la UI con sonido amigable y Koda celebrando 🦊.
  - Si es **Incorrecta**:
    - Retorna `is_correct: false`, `xp_earned: 0`, pista pedagógica inteligente (`hint`) **sin revelar cuál es la correcta**.
    - La pregunta se encola automáticamente en la lista de fallos para la **Ronda de Repaso Final** de la sección (`added_to_review_queue: true`).
    - Banner ámbar/rosa inferior invitando a releer la pista.

**Subtasks:**
- [ ] [BACKEND] Servicio `LearningService.evaluateAnswer()` con reglas de puntuación deterministas.
- [ ] [BACKEND] Persistencia inmediata del intento en `user_attempts` y `attempt_answers` en Supabase.
- [ ] [FRONTEND] Componente `FeedbackBanner.tsx` con estados visuales diferenciados (éxito, error, pista).
- [ ] [FRONTEND] Conectar reacción emocional de la mascota Koda (estado `happy` o `encouraging`).
- [ ] [FRONTEND] Actualizar barra de XP en el header global de Zustand al acertar.

**DoD adicional para esta US:**
- La respuesta correcta nunca viaja en el payload de la lección antes de que el usuario envíe su intento.

---

### LESS-04 — Ronda de Repaso Final de Sección con Opciones Barajadas
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Frontend Lead  
**Rama sugerida:** `feature/ronda-repaso-seccion`

**Historia de usuario:**
> "Como estudiante que falló algún ejercicio en la sección, quiero que al llegar al final se active una ronda de repaso con las preguntas falladas barajadas,
> para corregir mis fallos antes de cerrar la sección y ganar XP de recuperación (+2 XP)."

**Criterios de aceptación:**
- Si el estudiante tuvo 1 o más respuestas incorrectas durante las 10 lecciones:
  - Al completar la lección 10, la UI no finaliza inmediatamente; muestra una pantalla de transición: *"¡Casi listo! Vamos a repasar los conceptos que te desafiaron"*.
  - Se presentan las preguntas falladas una a una.
  - **Opciones Barajadas Aleatoriamente:** el orden de las alternativas se mezcla mediante algoritmo Fisher-Yates para evitar que el usuario memorice la posición de la letra (`A`, `B`, `C`, `D`).
  - Al acertar en esta ronda de repaso, se otorgan **+2 XP de remediación** por pregunta (`16` §4).
- Una vez superada la ronda de repaso, se calcula el balance final de estrellas de la sección (⭐ 1 a 3) y se otorga el bono de sección (+10 XP).

**Subtasks:**
- [ ] [FRONTEND] Implementar cola de repaso local en Zustand `reviewQueue: string[]`.
- [ ] [FRONTEND] Algoritmo de barajado aleatorio para preguntas y opciones en la ronda de remediación.
- [ ] [FRONTEND] Transición animada hacia la vista de resumen final de sección con Koda ondeando bandera de meta 🏁.
- [ ] [BACKEND] Endpoint `POST /api/v1/learning/sections/:id/complete` que cierre formalmente la sección y consolide el progreso.

**DoD adicional para esta US:**
- El estudiante no puede cerrar la sección sin haber intentado remediar sus preguntas falladas.

---

### LESS-05 — Soporte de Tipos de Desafío Interactivo (Single Choice, Predict Output, Fill Blank)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Alta | **Asignado:** Frontend Developer  
**Rama sugerida:** `feature/tipos-desafios-interactivos`

**Historia de usuario:**
> "Como estudiante, quiero interactuar con desafíos variados (opción única, predecir salida y completar espacios en blanco),
> para desarrollar agilidad de lectura de código Python sin aburrirme con un único formato monótono."

**Criterios de aceptación:**
- Soporte para los tipos de desafío formativo del MVP (`23_CONTENT_SPECIFICATION.md` §3):
  1. **SINGLE_CHOICE:** Pregunta conceptual o de sintaxis con 4 opciones balanceadas.
  2. **TRUE_FALSE:** Afirmación sobre el comportamiento de Python con 2 tarjetas (Verdadero / Falso).
  3. **PREDICT_OUTPUT:** Fragmento de código Python con 4 opciones de lo que imprimirá la consola.
  4. **FILL_BLANK:** Línea de código incompleta con slots donde el usuario selecciona la ficha correcta para completar la instrucción.
- Renderizadores de componente desacoplados: `SingleChoiceExercise.tsx`, `TrueFalseExercise.tsx`, `PredictOutputExercise.tsx`, `FillBlankExercise.tsx`.
- Todos los tipos comparten la misma interfaz de envío (`SubmitAnswerDto`) hacia el backend.

**Subtasks:**
- [ ] [FRONTEND] Implementar fábrica de componentes de ejercicio basada en la propiedad `question.type`.
- [ ] [FRONTEND] Diseñar fichas interactivas arrastrables o clickeables para `FillBlankExercise`.
- [ ] [FRONTEND] Componente de vista previa de consola con tipografía monoespaciada para `PredictOutputExercise`.
- [ ] [TEST] Pruebas con lecciones reales del Módulo 01 de Python verificando el correcto comportamiento de cada tipo.

**DoD adicional para esta US:**
- Rendimiento impecable sin parpadeos visuales al cambiar entre tipos de ejercicio.

---

### LESS-06 — Motor de Ejecución de Código Híbrido (`ICodeRunner`) y Carga Documental NoSQL
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/icoderunner-hybrid-nosql`  
**Trazabilidad:** `ADR-006`, `ADR-008`, `ADR-009`, `docs/04-arquitectura-backend/11_SYSTEM_ARCHITECTURE.md`

**Historia de usuario:**
> "Como estudiante, quiero ejecutar código Python directamente en mi navegador con retroalimentación instantánea y consultar lecciones sin latencia,
> para comprobar mis hipótesis de programación en menos de 500 ms de forma segura y fluida."

**Criterios de aceptación:**
- **Carga Documental desde MongoDB (`ADR-009`):**
  - Endpoint `GET /api/v1/content/lessons/:id` entrega el documento completo de la micro-lección en una sola consulta $O(1)$ sin joins (teoría Markdown, código inicial, casos de prueba, pistas y metadatos).
- **Ejecución Híbrida (`ADR-006`):**
  - **Cliente (Nivel 1):** Ejecución instantánea en WebAssembly mediante Pyodide para ejercicios estándar sin I/O bloqueante (latencia < 200 ms).
  - **Backend Sandbox (Nivel 2 Fallback):** Para ejecuciones complejas o que superen límites de memoria del navegador, fallback seguro hacia sandbox Docker en NestJS con límites estrictos de CPU (0.5 cores), memoria (64 MB) y timeout de 3 segundos.
- Manejo seguro de errores de sintaxis y excepciones (`SyntaxError`, `NameError`, `ZeroDivisionError`) formateados pedagógicamente sin exponer trazas internas del servidor.

**Subtasks:**
- [ ] [FRONTEND] Integrar Web Worker con Pyodide para ejecución de Python en cliente sin congelar la UI.
- [ ] [BACKEND] Implementar interfaz `ICodeRunner` en NestJS `CodeExecutionService` con driver Docker aislado.
- [ ] [BACKEND] Mapear schema Mongoose de lecciones en MongoDB (`ADR-009`) para entrega atómica en `ContentModule`.
- [ ] [TEST] Verificar aislamiento y timeout del sandbox ante bucles infinitos (`while True:`).
