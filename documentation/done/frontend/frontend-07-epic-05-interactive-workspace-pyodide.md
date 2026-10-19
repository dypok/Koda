# 📄 Entregable Técnico: Frontend EPIC-05 — Visores Interactivos de los 11 Tipos de Ejercicio, Sandbox Pyodide WASM y Espacio de Trabajo de Lecciones

> **ID:** `frontend-07-epic-05-interactive-workspace-pyodide`  
> **Épicas:** `EPIC 04 — Motor Curricular y Grafo de Aprendizaje` (`LEARN-04`) y `EPIC 05 — Espacio de Trabajo de Lecciones y Evaluación Interactiva` (`LESS-01..06`)  
> **Historias de Usuario:** `LEARN-04`, `LESS-01`, `LESS-02`, `LESS-03`, `LESS-04`, `LESS-05`, `LESS-06`  
> **Rama:** `feat/frontend-epic-05-interactive-workspace-pyodide`  
> **Autor:** Equipo Frontend & Arquitectura KODA  
> **Fecha:** 16 de Octubre de 2026  
> **Estado:** 🟢 Aprobado / 100% Completado

---

## 1. 🎯 Objetivos del Entregable

1. **Soporte Completo de los 11 Tipos Canónicos de Pregunta (`29_QUESTION_JSON_CONTRACT.md` §4):**
   - Extender el normalizador de contenido ([`apps/web/src/lib/content.ts`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/lib/content.ts)), el motor de evaluación local ([`apps/web/src/views/lesson/useLessonEngine.ts`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/views/lesson/useLessonEngine.ts)) y el renderizador interactivo ([`apps/web/src/views/lesson/QuestionRenderer.tsx`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/views/lesson/QuestionRenderer.tsx)) para soportar:
     1. `single_choice`: Tarjetas de opción única con atajos táctiles `1..N` / `A..F`.
     2. `multiple_choice`: Selección múltiple con checkboxes y validación exacta de conjunto.
     3. `true_false`: Selector binario rápido Verdadero / Falso.
     4. `fill_blank`: Hueco inline resaltado dentro del bloque `prompt_code`, con soporte tanto para chips de código como para entrada de texto directa (`accepted_answers` / `aliases`).
     5. `predict_output`: Terminal simulada con prompt de salida estándar (`stdout`), compatible con opciones o entrada directa de consola.
     6. `find_error`: Inspector de código con numeración de líneas y resaltado visual de la línea señalada (`line_number`).
     7. `order_lines`: Constructor interactivo tipo *Parsons Problem* con bloques disponibles, secuencia ordenada y controles de reordenamiento (`↑`/`↓`/`×`).
     8. `matching`: Tablero de emparejamiento de 2 columnas con badges cromáticos de vínculo (`#1`, `#2`, ...) y barajado determinista de la columna derecha.
     9. `select_code`: Tarjetas de fragmentos de código en fuente monoespaciada con badge de lenguaje.
     10. `write_code`: Editor de código interactivo inicializado con `starter_code` y validación por tokens requeridos (`accepted_tokens`) o respuestas equivalentes (`accepted_answers`).
     11. `small_problem`: Resolución de micro-problemas con soporte de tolerancia numérica (`epsilon`).

2. **Ejecución Interactiva de Código con Pyodide Web Worker (`LESS-06`):**
   - Implementar el hook [`apps/web/src/hooks/usePyodideRunner.ts`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/hooks/usePyodideRunner.ts) que ejecuta código Python en el navegador mediante **Pyodide (WebAssembly)** dentro de un **Web Worker** aislado creado vía Blob URL.
   - Protección estricta contra bucles infinitos (`while True:`): timeout de **3.0 segundos** que termina el Worker bloqueado y lo recrea limpiamente sin congelar la interfaz de usuario.
   - Traducción pedagógica de errores (`SyntaxError`, `IndentationError`, `NameError`, `ZeroDivisionError`, `TypeError`, `TimeoutError`) al español claro, sin exponer stack traces internos.
   - Respaldo determinista local (`local-sandbox`) instantáneo cuando el entorno está sin conexión o cuando se ejecutan ejemplos de otros lenguajes (`lua`, `javascript`, `typescript`).

3. **Consola Interactiva Integrada en el Panel Izquierdo (`LESS-01`, `LESS-06`):**
   - Crear el componente [`apps/web/src/components/lesson/InteractiveCodeConsole.tsx`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/components/lesson/InteractiveCodeConsole.tsx) con editor monoespaciado editable, botones `"▶ EJECUTAR"` y `"↺ RESTAURAR"`, indicador de latencia en milisegundos (`ms`) y salida de terminal en vivo.

4. **Layout Dual-Panel 50/50 en Desktop y Tabs Responsivos en Móvil (`LESS-01`):**
   - En pantallas `lg+`, mantener las dos columnas 50/50 lado a lado (Teoría + Consola a la izquierda, Práctica a la derecha).
   - En pantallas móviles (`< lg`), incorporar una barra de pestañas accesible (`role="tablist"`, `role="tab"`, `role="tabpanel"`) para alternar suavemente entre **Concepto** y **Práctica**.

5. **Ronda de Repaso Final de Sección (`LESS-04`) y Calificación de Estrellas (`LEARN-04`):**
   - Registrar los ejercicios fallados en su primer intento durante las lecciones de la sección y activar el modo `review` antes del Quiz final con el encabezado *"¡Casi listo! Vamos a repasar los conceptos que te desafiaron"*, opciones barajadas y bonificación de `+2 XP` de recuperación.
   - Crear [`apps/web/src/components/lesson/StarRatingDisplay.tsx`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/components/lesson/StarRatingDisplay.tsx) para visualizar de `1⭐` a `3⭐` según precisión (`100% -> 3⭐`, `80–99% -> 2⭐`, `70–79% -> 1⭐`).

---

## 2. 🏗️ Componentes Creados y Actualizados

- [`apps/web/src/lib/content.ts`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/lib/content.ts): Normalización unificada (`normalizeExercise`) para preservar los campos de los 11 tipos de pregunta tanto en `module.json` como en `bank.json`.
- [`apps/web/src/views/lesson/useLessonEngine.ts`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/views/lesson/useLessonEngine.ts): Función `evaluateExercise` para los 11 tipos, método `setCustomAnswer` y seguimiento de `failedExerciseIds`.
- [`apps/web/src/views/lesson/QuestionRenderer.tsx`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/views/lesson/QuestionRenderer.tsx): Visores interactivos especializados para los 11 tipos de ejercicio.
- [`apps/web/src/hooks/usePyodideRunner.ts`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/hooks/usePyodideRunner.ts): Runner Web Worker con Pyodide WASM, timeout de 3 segundos y traductor pedagógico de errores.
- [`apps/web/src/components/lesson/InteractiveCodeConsole.tsx`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/components/lesson/InteractiveCodeConsole.tsx): Consola editable en vivo integrada en cada ejemplo de lección.
- [`apps/web/src/components/lesson/StarRatingDisplay.tsx`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/components/lesson/StarRatingDisplay.tsx): Componente de premiación de 1 a 3 estrellas con cálculo de precisión (`calculateStarsFromAccuracy`).
- [`apps/web/src/views/lesson/LessonWorkspace.tsx`](file:///home/cohorte5/Documentos/brandonr-r/KODA/apps/web/src/views/lesson/LessonWorkspace.tsx): Integración de tabs móviles, `InteractiveCodeConsole`, `ReviewMode` (`LESS-04`) y `StarRatingDisplay` (`LEARN-04`).

---

## 3. 🧪 Verificación Técnica

1. **Verificación de Tipos TypeScript (`tsc --noEmit`):**
   - `0` errores de compilación en `apps/web`.
2. **Pruebas Unitarias Vitest (`apps/web`):**
   - Suite de pruebas de componentes y vistas de lección ejecutada satisfactoriamente.
