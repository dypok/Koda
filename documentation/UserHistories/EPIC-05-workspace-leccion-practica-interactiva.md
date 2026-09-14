# 🟢 EPIC 5 — Workspace de Lección Atómica y Práctica Interactiva
`Sprint 3 · v2.0 · Color Jira: Verde · Código: LESS`

> Esta épica define el núcleo interactivo del estudiante: el **Workspace de Lección de Escritorio** dividido 50/50 (`27_UI_UX_SPECIFICATION.md` §15), el stepper de 10 píldoras, los atajos de teclado ergonómicos, la **Tríada Evaluativa de 3 Ítems por Lección** (Consola interactiva, Quiz de 4 opciones A/B/C/D y Predicción de salida/bug), el motor de ejecución híbrido (`ICodeRunner` con Pyodide + Docker Sandbox) y la ronda de repaso final de sección para la asignación de estrellas formativas (1–3⭐).

---

### LESS-01 — Layout 50/50 Split Desktop y Stepper de 10 Píldoras
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Frontend Lead  
**Rama sugerida:** `feature/workspace-split-stepper`  
**Trazabilidad:** `27_UI_UX_SPECIFICATION.md` §15

**Historia de usuario:**
> "Como estudiante en escritorio, quiero una pantalla dividida en dos mitades (teoría a la izquierda y práctica a la derecha) con un indicador de 10 pasos,
> para concentrarme en la lección actual sin hacer scrolls verticales molestos ni perder el contexto de la sección."

**Criterios de aceptación:**
- **Layout de Escritorio 50/50:**
  - Panel Izquierdo (50%): Título de la micro-lección, teoría atómica (40–70 palabras divididas en pasos progresivos), bloque de código con resaltado sintáctico de Python, tips pedagógicos y estado de avance en la lección actual.
  - Panel Derecho (50%): Área interactiva que presenta de forma secuencial los 3 componentes de la **Tríada Evaluativa**: consola de código con casos de prueba, quiz conceptual de 4 opciones y desafío de predicción de salida.
- **Stepper Superior de 10 Píldoras:**
  - Muestra las 10 micro-lecciones de la sección con 3 estados: `✓` Completada (verde), `●` Activa (azul/ámbar), `N` Pendiente (slate).
  - Al completar los 3 ítems de una lección, la píldora correspondiente cambia a `✓` con una micro-animación de pulso.
- **Modo Responsive Móvil:** en pantallas < 768px, los paneles se apilan verticalmente con pestañas superiores *"Concepto"* y *"Práctica"*.

**Subtasks:**
- [ ] [FRONTEND] Crear layout `LessonWorkspaceLayout.tsx` en `apps/web/src/components/lesson/`.
- [ ] [FRONTEND] Crear componente `SectionStepper.tsx` que reciba el arreglo de 10 lecciones y el índice activo.
- [ ] [FRONTEND] Integrar visor de código con resaltado sintáctico de Python (Shiki / PrismJS en tema oscuro `#0F172A`).
- [ ] [FRONTEND] Diseñar consola de salida de texto interactiva con tipografía JetBrains Mono.
- [ ] [TEST] Verificar renderizado sin scrolls horizontales ni verticales en resolución estándar 1366x768 y 1920x1080.

---

### LESS-02 — Sistema de Atajos de Teclado Ergonómicos (`1-4`, `A-D`, `Enter`, Flechas)
**Tipo:** Story | **SP:** 2 | **Prioridad:** Alta | **Asignado:** Frontend Developer  
**Rama sugerida:** `feature/atajos-teclado-workspace`  
**Trazabilidad:** `27_UI_UX_SPECIFICATION.md` §17

**Historia de usuario:**
> "Como estudiante que valora la agilidad, quiero responder y navegar por las lecciones usando atajos de teclado sin tocar el ratón,
> para mantener un estado de flujo mental (*flow state*) ininterrumpido durante mi sesión de estudio."

**Criterios de aceptación:**
- Atajos estandarizados:
  - Teclas `1`, `2`, `3`, `4` o `A`, `B`, `C`, `D`: Seleccionan la opción correspondiente en el Quiz conceptual.
  - Tecla `Ctrl + Enter` (o `Cmd + Enter`): Ejecuta el código en la consola interactiva.
  - Tecla `Enter` o `Espacio`: Ejecuta la acción primaria (*"Comprobar"* si hay opción seleccionada; *"Continuar"* si ya se evaluó el ítem hacia el siguiente paso de la tríada o siguiente lección).
  - Flechas `←` y `→`: Navegan entre lecciones ya visitadas para repasar.
- Badges visuales visibles en cada botón de opción indicando su tecla rápida asociada (ej. `[ A ]`, `[ B ]`, `[ C ]`, `[ D ]`).
- Los atajos se deshabilitan automáticamente si el foco está sobre un editor de código o input de texto para evitar colisiones.

**Subtasks:**
- [ ] [FRONTEND] Implementar hook personalizado `useLessonKeyboardShortcuts.ts` con `useEffect` y listeners de `keydown`.
- [ ] [FRONTEND] Mostrar etiquetas discretas de teclas sobre las tarjetas de opción en escritorio.
- [ ] [FRONTEND] Añadir indicador visual de tecla presionada con feedback táctil sutil.
- [ ] [TEST] Tests unitarios con `@testing-library/react` simulando eventos de teclado y transiciones de estado.

---

### LESS-03 — Tríada Evaluativa de 3 Ítems por Lección y Puntuación Formativa (1–3⭐)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/triada-evaluativa-leccion`  
**Trazabilidad:** `ADR-009`, `ADR-011`, `12_DATABASE_DESIGN.md`

**Historia de usuario:**
> "Como estudiante, quiero completar una tríada balanceada en cada lección (ejecutar código en consola, responder una pregunta conceptual de 4 opciones y predecir una salida),
> para validar mi aprendizaje de forma integral antes de recibir mis estrellas formativas."

**Criterios de aceptación:**
- Cada micro-lección está estructurada formalmente con **3 ítems obligatorios**:
  1. **Ítem 1 (Consola interactiva - `item_1_console`):** Desafío práctico de programación en Python. Incluye código inicial (`initial_code`), solución canónica (`solution_code`) y casos de prueba automatizados (`test_cases`) con entradas y salidas esperadas.
  2. **Ítem 2 (Quiz conceptual - `item_2_quiz`):** Pregunta teórica de selección múltiple con **exactamente 4 opciones A/B/C/D** (`options`), una única respuesta correcta, distractores plausibles y explicaciones de feedback para cada alternativa.
  3. **Ítem 3 (Predicción de salida o bug - `item_3_prediction`):** Fragmento de código donde el estudiante debe deducir la salida exacta de la terminal o identificar un error de lógica antes de compilar.
- **Flujo y Reglas de Puntuación:**
  - El estudiante debe superar el Ítem 1 para avanzar al Ítem 2, y el Ítem 2 para avanzar al Ítem 3.
  - Al completar los 3 ítems se marca la lección como superada.
  - **Calificación en Estrellas (⭐ 1 a 3):**
    - ⭐⭐⭐ **(3 Estrellas):** Acierto limpio en los 3 ítems en el primer intento sin cometer ningún error en toda la sección.
    - ⭐⭐ **(2 Estrellas):** El estudiante ejecuta bien el código en consola (Ítem 1), pero falla en la pregunta de selección múltiple (Ítem 2) o la predicción (Ítem 3) y lo corrige en la ronda de repaso.
    - ⭐ **(1 Estrella):** El estudiante requiere múltiples intentos en consola o deriva reactivos fallados al Cuaderno de Errores con algoritmo SM-2.
- **Feedback Formativo sin Spoilers:** Si el usuario falla un ítem, el backend devuelve una pista inteligente (`hint`) sin revelar la respuesta correcta ni la solución.

**Subtasks:**
- [x] [BACKEND] Esquema Mongoose `LessonSchema` en `apps/api/src/database/schemas/lesson.schema.ts` formalizando los 3 ítems y semillas de ejemplo.
- [ ] [BACKEND] Servicio `LearningService.evaluateTriad()` en NestJS que valide deterministamente los 3 ítems y registre el intento en `attempts`.
- [ ] [FRONTEND] Orquestador visual del flujo de la tríada en `LessonWorkspaceLayout.tsx`.
- [ ] [FRONTEND] Banner formativo de retroalimentación inmediata sin spoilers con animación emocional de Koda 🦊.

---

### LESS-04 — Ronda de Repaso Final de Sección y Cola de Fallos
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Frontend Lead  
**Rama sugerida:** `feature/ronda-repaso-seccion`  
**Trazabilidad:** `12_DATABASE_DESIGN.md` (`review_queue_items`)

**Historia de usuario:**
> "Como estudiante que cometió algún error durante la sección, quiero que al terminar la lección 10 se active una ronda de repaso con las preguntas falladas barajadas,
> para corregir mis conceptos pendientes antes de cerrar la sección y aspirar a ganar hasta 2 estrellas (⭐⭐)."

**Criterios de aceptación:**
- Si el estudiante tuvo fallos en el Quiz conceptual (Ítem 2) o la Predicción (Ítem 3) durante las 10 lecciones:
  - Al culminar la lección 10, se activa la pantalla de transición: *"¡Casi listo! Vamos a repasar los conceptos que te desafiaron"*.
  - Se presentan los reactivos fallados con sus opciones barajadas aleatoriamente (Fisher-Yates) para evitar la memorización posicional de las letras A/B/C/D.
  - Al acertar en esta ronda, los reactivos se marcan como remediados en `review_queue_items`.
  - El estudiante asegura **2 estrellas (⭐⭐)** en la sección si remedia todos sus fallos en esta instancia.
- Si el estudiante falla repetidamente en la ronda de repaso, el reactivo se deriva de forma persistente a la tabla `user_mistakes_notebook` en Supabase para estudio a largo plazo con el algoritmo **SuperMemo SM-2**.

**Subtasks:**
- [x] [BD] Tabla `review_queue_items` en Supabase con estados `pending`, `passed`, `failed` y rondas de repaso.
- [ ] [FRONTEND] Controlador de la ronda de remediación intra-sección en el frontend.
- [ ] [FRONTEND] Pantalla de resumen final de sección con conteo de estrellas ganadas y botón de continuar.

---

### LESS-05 — Tipos de Desafío Polimórficos en la Capa NoSQL (MongoDB)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Alta | **Asignado:** Frontend Developer + Backend Developer  
**Rama sugerida:** `feature/tipos-desafios-interactivos`  
**Trazabilidad:** `ADR-009`, `23_CONTENT_SPECIFICATION.md`

**Historia de usuario:**
> "Como autor pedagógico y estudiante, quiero que el catálogo de lecciones admita desafíos polimórficos de alta expresividad técnica,
> para aprender con formatos dinámicos (código ejecutable, quizzes de 4 alternativas y deducción en terminal)."

**Criterios de aceptación:**
- Soporte para estructuras polimórficas validadas en MongoDB:
  1. `item_1_console`: Reto de código con `prompt`, `initial_code`, `solution_code` y lista de `test_cases`.
  2. `item_2_quiz`: Pregunta con exactamente 4 opciones A, B, C, D donde cada opción contiene `id`, `text`, `is_correct` y `feedback`.
  3. `item_3_prediction`: Fragmento de código Python con `target_type: 'predict_output'`, `expected_answer` y `hint`.
- Renderizadores de UI desacoplados y modulares en `apps/web/src/components/lesson/items/`: `ConsoleExercise.tsx`, `MultipleChoiceExercise.tsx`, `PredictionExercise.tsx`.
- Entrega $O(1)$ sin joins desde el backend NestJS consumiendo la colección `lessons` de MongoDB.

**Subtasks:**
- [x] [BACKEND] Esquema Mongoose con sub-documentos tipados para cada ítem de la tríada.
- [ ] [FRONTEND] Implementar componentes visuales individuales para Consola, Quiz de 4 opciones y Predicción de salida.
- [ ] [TEST] Validación con lecciones reales del Módulo 01 de Python 3.12 asegurando que todos los ítems responden correctamente.

---

### LESS-06 — Motor de Ejecución de Código Híbrido (`ICodeRunner`: Pyodide + Docker Sandbox)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/icoderunner-hybrid-nosql`  
**Trazabilidad:** `ADR-006`, `ADR-008`, `11_SYSTEM_ARCHITECTURE.md`

**Historia de usuario:**
> "Como estudiante, quiero ejecutar código Python 3.12 directamente en mi navegador con retroalimentación en menos de 300 ms y respaldo en servidor,
> para probar soluciones en tiempo real de forma segura y sin instalar software localmente."

**Criterios de aceptación:**
- **Ejecución Híbrida en 2 Niveles (`ADR-006`):**
  - **Nivel 1 (Cliente en WebAssembly con Pyodide):** Ejecución instantánea en el navegador para todos los ejercicios del Ítem 1 de la tríada (latencia < 200 ms, sin llamadas a red).
  - **Nivel 2 (Servidor Docker Sandbox en NestJS):** Fallback automático cuando se requiera validar librerías del sistema, scripts que excedan memoria o clientes sin soporte WebAssembly.
- Sandboxing estricto en servidor: CPU 0.5 cores, 64 MB RAM, timeout de 3 segundos y bloqueo total de sockets de red (`--network none`).
- Captura formateada de `stdout`, `stderr` y excepciones comunes de Python (`SyntaxError`, `IndentationError`, `TypeError`, `ZeroDivisionError`) con mensajes pedagógicos.

**Subtasks:**
- [ ] [FRONTEND] Integrar Web Worker con Pyodide para ejecución de Python en cliente sin congelar el hilo principal de la UI.
- [ ] [BACKEND] Implementar servicio `CodeExecutionService` con interfaz `ICodeRunner` y driver Docker en NestJS.
- [ ] [TEST] Pruebas de seguridad verificando que comandos de escape de sandbox (ej. `import os; os.system(...)`) son neutralizados.
