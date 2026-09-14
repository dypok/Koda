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
- **Mutación GraphQL (`Mutation submitLessonAnswer(input: SubmitLessonAnswerInput!)`)** (`ADR-012`):
  - Recibe `{ lesson_id: ID!, selected_option_ids: [ID!]!, time_spent_seconds: Int! }`.
  - Evalúa la respuesta de forma determinista contra el contenido oficial de Python 3.12 y responde en **$p95 < 50\text{ ms}$** (`RNF-010`).
  - Despacha de forma asíncrona no bloqueante el evento de dominio `lesson.completed` hacia el bus persistente en BullMQ (`ADR-010`, `ADR-011`) para procesar rachas y XP sin retrasar la respuesta al estudiante.
  - Si es **Correcta**:
    - Retorna `is_correct: true`, `xp_earned: 5`, mensaje de refuerzo conceptual y explicación del porqué es correcta.
    - Banner verde inferior en la UI con sonido amigable y Koda celebrando 🦊.
  - Si es **Incorrecta**:
    - Retorna `is_correct: false`, `xp_earned: 0`, pista pedagógica inteligente (`hint`) **sin revelar cuál es la correcta**.
    - La pregunta se encola automáticamente en la lista de fallos para la **Ronda de Repaso Final** de la sección (`added_to_review_queue: true`).
    - Banner ámbar/rosa inferior invitando a releer la pista.

**Subtasks:**
- [ ] [BACKEND] Caso de uso `SubmitLessonUseCase` en `application/` y Resolver GraphQL `LearningResolver.submitLessonAnswer()` en `infrastructure/` (`ADR-012`).
- [ ] [BACKEND] Emisión asíncrona del evento de dominio `LessonCompletedEvent` con BullMQ (`ADR-010`, `ADR-011`).
- [ ] [BACKEND] Persistencia atómica del intento mediante el puerto `IProgressRepository` en Supabase PostgreSQL.
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

### LESS-05 — Tipos de Desafío Polimórficos de la Tríada en MongoDB
**Tipo:** Story | **SP:** 5 | **Prioridad:** Alta | **Asignado:** Frontend Developer + Backend Developer  
**Rama sugerida:** `feature/tipos-desafios-interactivos`  
**Trazabilidad:** `ADR-009`, `ADR-011`, `ADR-012`, `23_CONTENT_SPECIFICATION.md`

**Historia de usuario:**
> "Como autor pedagógico y estudiante, quiero que el catálogo de lecciones admita desafíos polimórficos de alta expresividad técnica,
> para aprender con formatos dinámicos (código ejecutable, quizzes de 4 alternativas y deducción en terminal)."

**Criterios de aceptación:**
- Soporte para estructuras polimórficas de la Tríada Evaluativa validadas en MongoDB (`ADR-011`):
  1. `item_1_console`: Reto de código con `prompt`, `initial_code`, `solution_code` y suite de `test_cases`.
  2. `item_2_quiz`: Pregunta conceptual con exactamente 4 opciones ($A, B, C, D$) donde cada opción contiene `id`, `text`, `is_correct` y `feedback`.
  3. `item_3_prediction`: Fragmento de código Python con `target_type: 'predict_output'`, `expected_answer` y `hint` sin spoilers.
- Renderizadores de UI desacoplados y modulares en `apps/web/src/components/lesson/items/`: `ConsoleExercise.tsx`, `MultipleChoiceExercise.tsx`, `PredictionExercise.tsx`.
- Consulta optimizada mediante **GraphQL (`Query lessonContent(id: ID!)`)** que entrega la tríada en una sola llamada sin joins ni over-fetching (`ADR-012`).

**Subtasks:**
- [x] [BACKEND] Esquema Mongoose con sub-documentos tipados para cada ítem de la tríada en MongoDB (`ContentModule`).
- [ ] [BACKEND] Resolver GraphQL `LearningResolver.lessonContent` con DataLoader para lecciones anidadas.
- [ ] [FRONTEND] Implementar componentes visuales individuales para Consola, Quiz de 4 opciones y Predicción de salida.
- [ ] [TEST] Validación con lecciones reales del Módulo 01 de Python 3.12 asegurando que todos los ítems responden correctamente.

---

### LESS-06 — Motor de Ejecución de Código Híbrido (`ICodeRunner`: Pyodide + Docker Sandbox)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/icoderunner-hybrid-nosql`  
**Trazabilidad:** `ADR-006`, `ADR-008`, `ADR-009`, `ADR-012`, `11_SYSTEM_ARCHITECTURE.md`

**Historia de usuario:**
> "Como estudiante, quiero ejecutar código Python 3.12 directamente en mi navegador con retroalimentación en menos de 300 ms y respaldo en servidor,
> para probar soluciones en tiempo real de forma segura y sin instalar software localmente."

**Criterios de aceptación:**
- **Ejecución Híbrida en 2 Niveles (`ADR-006`):**
  - **Nivel 1 (Cliente en WebAssembly con Pyodide):** Ejecución instantánea en el navegador para todos los ejercicios del Ítem 1 de la tríada (latencia < 200 ms, sin llamadas a red).
  - **Nivel 2 (Servidor Sandbox en NestJS):** Fallback seguro hacia endpoint REST `POST /api/v1/sandbox/run` cuando se requiera validar librerías del sistema, scripts que excedan memoria o clientes sin soporte WebAssembly (`ADR-012`).
- Sandboxing estricto en servidor: límites de CPU (0.5 cores), memoria (64 MB), timeout de 3 segundos y bloqueo total de sockets de red (`--network none`).
- Captura formateada de `stdout`, `stderr` y excepciones comunes de Python (`SyntaxError`, `IndentationError`, `TypeError`, `ZeroDivisionError`) con mensajes pedagógicos.

**Subtasks:**
- [ ] [FRONTEND] Integrar Web Worker con Pyodide para ejecución de Python en cliente sin congelar el hilo principal de la UI.
- [ ] [BACKEND] Implementar interfaz `ICodeRunner` en `apps/api` con driver Pyodide y driver Docker/Judge0 en NestJS.
- [ ] [BACKEND] Controlador REST `SandboxController` (`POST /api/v1/sandbox/run`) con soporte para timeout y límites estrictos.
- [ ] [TEST] Pruebas de seguridad verificando que comandos de escape de sandbox (ej. `import os; os.system(...)`) son neutralizados.
