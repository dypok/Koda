# 23 — Especificación de Contenido (Content Specification)

> **Estado:** Vigente · Alineado con 29 y 30 · **Versión del documento:** 1.1.0 · **Fecha:** 2026-10-16
> **Zona horaria:** America/Bogota (UTC-5)
> Complementa a `01_PROJECT_OVERVIEW.md` §7/§31, `03_OBJECTIVES.md` OT-02/OT-03, `04_SCOPE.md` §10.3, `05_FUNCTIONAL_REQUIREMENTS.md` RF-LANG/RF-MOD/RF-SEC/RF-LEC/RF-PREG/RF-ADM, `06_NON_FUNCTIONAL_REQUIREMENTS.md` RNF-006/RNF-017/RNF-031/RNF-035/RNF-036, `11_SYSTEM_ARCHITECTURE.md` §15 (Content Engine), `12_DATABASE_DESIGN.md` §6.3–§6.11, `14_LEARNING_SYSTEM.md` §2 y `15_QUIZ_EXAM_SYSTEM.md` §3–§5. No duplica; es la **fuente de verdad del formato declarativo**.

> [!NOTE]
> Este documento está **alineado y convergente** con el contrato físico de preguntas en [`29_QUESTION_JSON_CONTRACT.md`](29_QUESTION_JSON_CONTRACT.md), el modelo de orden y coordenadas en [`30_ROADMAP_STRUCTURE_AND_COORDINATES.md`](30_ROADMAP_STRUCTURE_AND_COORDINATES.md) y el JSON Schema normativo [`content/schemas/question.schema.json`](../../content/schemas/question.schema.json).

---

## 1. Propósito y alcance

Este documento define **la estructura canónica del contenido educativo** —qué entidades existen, qué campos tienen, cómo se validan y cómo se versionan— de forma **independiente del código del motor**.

**Objetivo central (`01` §31, `03` OT-02, `06` RNF-031):**

> Agregar, modificar o reordenar contenido (lenguajes, módulos, secciones, lecciones, ejemplos, ejercicios/preguntas) **no debe exigir cambios en el motor** (`src/modules/*`), ni rebuild de la app. Es solo **contenido + configuración + migración de datos de contenido**.

**Sí incluye:** jerarquía `Lenguaje → Módulo → Sección → Lección → Ejemplos → Ejercicios/Preguntas → Respuestas → Explicaciones`, atributos por entidad, niveles de `Dificultad` y `Prerrequisitos`, formato físico (JSON/YAML) con ejemplo conceptual completo `language→module→section→lesson→examples→questions`, esquema JSON Schema con validaciones sintácticas/semánticas/pedagógicas, procedimiento para agregar un lenguaje sin tocar el motor y trazabilidad a `RF/RNF`.

**No incluye:** la tipificación fina renderizable de cada pregunta (detalle en `24_CONTENT_AUTHORING_GUIDE.md`), la lógica de calificación (ver `15`), el modelo relacional DDL (ver `12`) ni la UI (ver `27`).

---

## 2. Principios invariantes

| # | Principio | Regla operativa | Origen |
|---|---|---|---|
| P-01 | **Contenido desacoplado** | Ningún texto de lección, ejemplo o pregunta vive hardcodeado en frontend/motor. Todo viene de `Content Engine` vía API. Un `grep` en CI falla si detecta literales de contenido fuera de `content/` | `01` §31, `06` RNF-031 |
| P-02 | **Declarativo y versionado** | El contenido es un artefacto declarativo (JSON/YAML) con `content_version` (semver o entero incremental). Cada `attempt` congela `content_version` + `threshold_applied` | `06` RNF-035, `05` RF-ADM-005 |
| P-03 | **Validación antes de publicar** | `RF-ADM-006`: IDs únicos, orden sin huecos ni duplicados, prerrequisitos sin ciclos (DAG), referencias íntegras, tipos válidos. Publicación bloqueada si falla | `05` RF-ADM-006 |
| P-04 | **Agregar lenguaje = agregar directorio** | `RNF-006`: `content/languages/{nuevo}/` + `manifest.json` + módulos/secciones/lecciones/preguntas + `config/` → validar → publicar. 0 cambios en `src/modules/*` | `03` OT-03, `11` §18 |
| P-05 | **Configuración sin despliegue** | Umbrales (Quiz 70/Examen 80), XP (+10/+5/+25/+100/+150), orden de módulos y composición de quizzes/exámenes son configurables y versionados, con efecto <5 min | `06` RNF-017, `05` RF-ADM-004 |
| P-06 | **Trazabilidad por versión** | Editar una pregunta publicada crea **nueva versión** (`version+1`), no `UPDATE` destructivo. Intentos históricos conservan `(question_id, question_version)` | `05` RF-PREG-006 |
| P-07 | **Integridad referencial** | Toda pregunta referencia `lenguaje/módulo/sección/lección` válidos; todo `lesson.section_id` existe; sin huérfanos (FK en BD, `RNF-036`) | `06` RNF-036 |

---

## 3. Jerarquía canónica

```
Lenguaje (Language)
 └─ Módulo (Module)                 — unidad temática evaluable con examen final
     ├─ Sección (Section)           — unidad de sesión: teoría + ejemplo + ejercicios
     │   └─ Lección (Lesson)        — micro-bloque: concepto → explicación → ejemplo → ejercicio(s) → feedback → recompensa
     │       ├─ Ejemplo(s) (Example)    — bloque(s) de código con output esperado
     │       └─ Ejercicio(s) / Pregunta(s) (Exercise/Question) — instancia tipificada de 24 y 29
     │           ├─ Respuesta(s) válida(s) (Answer)
     │           └─ Explicación (Explanation) — feedback pedagógico
     ├─ Quiz (≥1 por módulo)
     └─ Examen (1 por módulo)
```

**Cardinalidades MVP (Python / Lua 12 módulos, `01` §34, `28` §3):**

| Nivel | Cardinalidad | Orden | Prerrequisito | Evaluable |
|---|---|---|---|---|
| Lenguaje | N en catálogo; 1 activo por usuario; en MVP `PY` y `LUA` disponibles | `sort_order` global | — | No (se completa vía módulos) |
| Módulo | 12 en Python/Lua; N configurable por lenguaje | `position` 1..N por lenguaje, sin huecos | `prerequisite_module_id` (DAG) | Sí — Examen final |
| Sección | 3–10 por módulo | `position` por módulo | Sección previa completada | Parcial — completitud |
| Lección | 2–10 por sección | `position` por sección | Lección previa del mismo módulo/sección | Sí — ejercicios |
| Ejemplo | 0–3 por lección | `position` dentro de lección | — | No (ilustrativo) |
| Ejercicio/Pregunta | 1–N obligatorios por lección; 10 por Quiz; 20 por Examen | `position` o índice del array dentro de lección o composición de quiz/examen | — | Sí — validación inmediata |

---

## 4. Entidades y atributos

### 4.1 Lenguaje (Language)

Unidad raíz del catálogo. Todo lo específico del lenguaje vive bajo `content/languages/{slug}/`.

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| `id` | `string` | Sí | `^[a-zA-Z0-9_-]{1,100}$`, PK único (slug/code/UUID) | Identificador interno estable |
| `code` | `string` | Sí | `^[A-Z0-9_]{2,10}$`, único; ej. `PY`, `LUA`, `JS` | Usado en `KODA-{LANG}-{SEQ}` (`01` §22) |
| `slug` | `string` | Sí | `^[a-z0-9-]{2,50}$`, único; ej. `python`, `lua` | URL `/languages/python` |
| `name` | `string` | Sí | 2–50 chars, único | Ej. "Python", "Lua" |
| `description` | `string` | No | ≤2000 chars | Visible en biblioteca |
| `status` | `enum` | Sí | `available` \| `coming_soon` \| `hidden` | `05` RF-LANG-001 |
| `sort_order` | `integer` | Sí | 1–999, único entre lenguajes visibles | Orden de catálogo |
| `content_version` | `integer` / `semver` | Sí | `>=1`, incrementa en cada publicación | Cambio significativo puede obsoletar certificados (`05` RF-CERT-005) |
| `is_active` | `boolean` | Sí | — | Soft habilitación |
| `config` | `object` | No | Ver §8 | Umbrales/XP/composición por defecto del lenguaje (heredable por módulo) |
| `modules` | `array<ModuleRef>` | Sí | ≥1 módulo si `available` | Referencias ordenadas a módulos |

**Invariantes:**
- `status=available` ⇒ `is_active=true`.
- `sort_order` sin duplicados entre `available`.
- Cambio de `config` genera nueva `content_version`.

### 4.2 Módulo (Module)

Unidad temática. Orden canónico configurable sin código (`05` RF-MOD-004) y coordenadas declarativas en el grafo (`30` §4).

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| `id` | `string` | Sí | `^[a-zA-Z0-9_-]{1,100}$`, PK; ej. `py_mod_02`, `lua_mod_01` o UUID | Identificador estable del módulo |
| `language_id` | `string` | No (en JSON) / Sí (en BD) | `^[a-zA-Z0-9_-]{1,100}$`, FK → `languages.id` | Pertenece a un lenguaje |
| `code` | `string` | Sí | `^[A-Z0-9_]+$`, único por lenguaje; ej. `PY_MOD_02`, `LUA_MOD_01` | Código canónico |
| `slug` | `string` | Sí | `^[a-z0-9-]{2,100}$`, único por lenguaje | URL |
| `title` | `string` | Sí | 3–150 chars | Ej. "Variables y tipos de datos" |
| `objective` | `string` | No | ≤500 chars | Qué domina al aprobar (`05` RF-MOD-002) |
| `description` | `string` | No | ≤2000 chars | Visible en ruta |
| `position` | `integer` | Sí | 1..N sin huecos por lenguaje | Orden pedagógico (`01` §34, `30` §2.1) |
| `status` | `enum` | Sí | `draft` \| `review` \| `coming_soon` \| `published` \| `archived` | `05` RF-ADM-003 |
| `content_version` | `integer` | No (default `1`) | `>=1` | Incrementa al publicar |
| `prerequisite_module_id` | `string` \| `null` | No | `^[a-zA-Z0-9_-]{1,100}$`, FK → `modules.id`, `!= id`, sin ciclos (DAG) | `null` para primer módulo; validado por `RF-ADM-006` |
| `thresholds` | `object` | No | Ver §8 | `{ quiz: 70, exam: 80 }` por defecto; hereda de lenguaje si no se declara |
| `xp` | `object` | No | `{ on_pass: 150 }` por defecto | Bono al aprobar módulo |
| `graph` | `object` | No | `{ tier?: int>=0, lane?: int, x?: number, y?: number, route?: 'trunk'\|'flow'\|'data' }` | Posición topológica o absoluta en el grafo del roadmap (`30` §4) |
| `sections` | `array<Section>` | Sí | ≥1 sección (≥3 en producción) | Secciones del módulo |
| `quiz_refs` | `array<QuizRef>` | No | ≥1 quiz por módulo si aplica | Referencias de quiz |
| `exam_ref` | `ExamRef` | No | 1 examen por módulo si aplica | Referencia de examen |

**Ruta Python MVP (orden canónico `01` §34):** 1 Fundamentos · 2 Variables y tipos de datos · 3 Operadores · 4 Condicionales · 5 Bucles · 6 Funciones · 7 Listas y colecciones · 8 Diccionarios y estructuras de datos · 9 Manejo de errores · 10 Programación orientada a objetos · 11 Archivos · 12 Proyecto final

### 4.3 Sección (Section)

Subdivisión de módulo (`01` §7.3).

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| `id` | `string` | Sí | `^[a-zA-Z0-9_-]{1,100}$`, PK; ej. `sec_01` o UUID | Identificador estable |
| `module_id` | `string` | No (en JSON) / Sí (en BD) | `^[a-zA-Z0-9_-]{1,100}$`, FK → `modules.id` | Módulo padre |
| `title` | `string` | Sí | 3–150 chars | Ej. "Declaración y asignación" |
| `slug` | `string` | No | `^[a-z0-9-]{2,100}$`, único por módulo | Slug de URL |
| `position` | `integer` | Sí | 1..N sin huecos por módulo | Orden canónico (`30` §2.1) |
| `type` | `enum` | No | `theory` \| `example` \| `exercise` \| `quiz` \| `review` | `05` RF-SEC-001 |
| `status` | `enum` | No (default `published`) | `draft` \| `coming_soon` \| `published` \| `archived` | Estado de publicación |
| `content_version` | `integer` | No (default `1`) | `>=1` | Versión |
| `estimated_minutes` | `integer` \| `null` | No | 1–120 | Solo métrica interna `05` RF-SEC-005 |
| `xp_on_complete` | `integer` | No | `>=0`, por defecto 10 | `01` §17 |
| `graph` | `object` | No | `{ tier?, lane?, x?, y?, route? }` | Coordenadas opcionales de sección (`30` §3.3) |
| `lessons` | `array<Lesson>` | Sí | ≥1 lección | Lecciones de la sección |

**Regla de completitud (`05` RF-SEC-003):** `seccion.completada ⇔ ∀ leccion ∈ seccion: leccion.completada ∧ ∀ ejercicio_obligatorio: respondido`. La publicidad solo se intercala tras `Seccion.completada → Recompensa → Publicidad → Siguiente` (`05` RF-ADS-001).

### 4.4 Lección (Lesson)

Unidad mínima. Sigue `concepto → explicación → ejemplo → ejercicio(s) → feedback → recompensa` (`01` §6).

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| `id` | `string` | Sí | `^[a-zA-Z0-9_-]{1,100}$`, PK; ej. `les_01_01` o UUID | Identificador estable |
| `section_id` | `string` | No (en JSON) / Sí (en BD) | `^[a-zA-Z0-9_-]{1,100}$`, FK → `sections.id` | Sección padre |
| `title` | `string` | Sí | 3–150 chars | Ej. "¿Qué es una variable?" |
| `slug` | `string` | No | `^[a-z0-9-]{2,100}$`, único por sección | — |
| `position` | `integer` | Sí | 1..N sin huecos por sección | Orden canónico |
| `concept_id` | `string` | No (recomendado) | `^[a-z0-9-]{3,80}$`, estable; ej. `py-var-declaracion` | Identificador pedagógico para `Score_repaso` y bajo rendimiento (`05` RF-EVAL-004) |
| `explanation` | `string` (rich/MDX) | Sí | 20–5000 chars, sin jerga no introducida | Explicación breve |
| `examples` | `array<Example>` | No | 0–3 | Ver §4.5 |
| `exercises` / `exercise` | `array<Question>` \| `Question` | Sí | ≥1 obligatorio; tipificados en `24` y `29` | Toda lección tiene al menos 1 ejercicio obligatorio (`03` OED-02) |
| `prerequisite_lesson_id` | `string` \| `null` | No | `^[a-zA-Z0-9_-]{1,100}$`, FK → `lessons.id`, sin ciclos | Por defecto `position-1` |
| `is_required` | `boolean` | No (default `true`) | — | Si `false`, no bloquea `seccion.completada` |
| `status` | `enum` | No (default `published`) | `draft` \| `coming_soon` \| `published` \| `archived` | — |
| `content_version` | `integer` | No (default `1`) | `>=1` | — |
| `xp_on_complete` | `integer` | No | `>=0`, por defecto 0 | XP normalmente va por ejercicio/sección |

### 4.5 Ejemplo (Example)

Bloque ilustrativo dentro de una lección.

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| `id` | `string` | No | `^[a-zA-Z0-9_-]{1,100}$`, PK si se referencia | — |
| `title` | `string` | No | ≤100 chars | Ej. "Declarar y mostrar una variable" |
| `code` | `string` | Sí | 1–2000 chars, sintaxis válida del lenguaje | Código fuente |
| `language` | `string` | No | `python` \| `lua` \| `javascript` \| `typescript` \| `html` \| `css` \| ... | Para resaltado |
| `output` | `string` \| `null` | No | ≤1000 chars | Salida esperada |
| `explanation` | `string` | No | ≤1000 chars | Qué demuestra el ejemplo |
| `position` | `integer` | No | 1..N | Orden dentro de la lección |

**Regla:** el ejemplo nunca es evaluable; solo ilustra. La evaluación vive en `exercises`.

### 4.6 Ejercicio / Pregunta (Question)

Instancia tipificada. Toda pregunta cumple `29_QUESTION_JSON_CONTRACT.md`, `24_CONTENT_AUTHORING_GUIDE.md` y valida contra `content/schemas/question.schema.json`. Campos canónicos (`05` RF-PREG-002, `29` §3):

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| `id` | `string` | Sí | `^[a-zA-Z0-9_-]{1,100}$`, único en su scope; ej. `"q_py_01_01"`, `"q_lua_03_01"` o UUID | Identidad estable de la pregunta |
| `version` | `integer` | No (default `1`) | `>=1`, `PK(id,version)` | Editar publicada ⇒ `version+1` |
| `language_id` | `string` | No (en JSON) / Sí (en BD) | `^[a-zA-Z0-9_-]{1,100}$`, FK → `languages.id` | Anclaje `05` RF-PREG-003 |
| `module_id` | `string` | No (en JSON) / Sí (en BD) | `^[a-zA-Z0-9_-]{1,100}$`, FK → `modules.id` | — |
| `section_id` | `string` \| `null` | No | `^[a-zA-Z0-9_-]{1,100}$`, FK → `sections.id` | `null` si es de quiz/examen global del módulo |
| `lesson_id` | `string` \| `null` | No | `^[a-zA-Z0-9_-]{1,100}$`, FK → `lessons.id` | `null` si es de quiz/examen |
| `type` | `enum` | Sí | Ver catálogo §4.6.1 | Tipo de pregunta |
| `difficulty` | `enum` | Sí (default `'medium'`) | `'easy'` \| `'medium'` \| `'hard'` (en minúsculas) | Peso `1.0/1.5/2.0` (`15` §4) |
| `category` | `string` \| `null` | No | `^[a-z0-9_-]{2,50}$`; ej. `variables`, `operadores` | Para `RF-EVAL-004` y `Score_repaso` |
| `prompt` | `string` | Sí | 10–2000 chars | Enunciado |
| `prompt_code` | `string` \| `null` | Condicional | ≤2000 chars; obligatorio en `predict_output`, `fill_blank`, `find_error`, `small_problem` | Snippet asociado |
| `answers` | `array<Answer>` | Condicional | 1–6 según tipo (ver §4.7); `[]` en `order_lines`, `matching`, `small_problem`, `write_code` | Opciones con `is_correct: boolean` |
| `correct_answer_ids` | `array<string>` | Sí (recomendado) | Referencias a `answers[].id` donde `is_correct === true` (`[]` en tipos sin opciones) | Clave canónica estable por `id` inmune al barajado (`29` §3) |
| `explanation` | `string` | Sí | 20–2000 chars | Feedback tras responder (`05` RF-PREG-004) |
| `score` | `integer` | No (default `10`) | 1–100 | Puntaje base `p_base` |
| `hints` | `array<string>` | No | Cada ≤500 chars | Pistas opcionales (no revelan respuesta) |
| `time_estimated_seconds` | `integer` \| `null` | No | 10–600 | — |
| `concept_ids` | `array<string>` | No | `^[a-z0-9-]{3,80}$`, cada `concept_id` válido | Conceptos evaluados (para repaso) |
| `status` | `enum` | No (default `'published'`) | `'draft'` \| `'published'` \| `'archived'` | — |
| `content_version` | `integer` | No (default `1`) | `>=1`, alias de `version` | Trazabilidad `RNF-035` |
| `is_diagnostic` | `boolean` | No (default `false`) | — | Si `true`, elegible para diagnóstico (`14` §5.2) |

> **Doble respaldo de respuesta correcta (`29` §3):** En el formato canónico se declaran tanto `answers[].is_correct: boolean` en cada opción como `correct_answer_ids: string[]` a nivel de pregunta referenciando los `answers[].id` correctos.

#### 4.6.1 Catálogo de tipos (MVP, `05` RF-PREG-001, `15` §3, `29` §4)

| Código | Tipo | Descripción y reglas de payload |
|---|---|---|
| `single_choice` | Selección múltiple (una correcta) | 2–6 `answers`, exactamente 1 `is_correct: true` y `correct_answer_ids` de longitud 1 |
| `multiple_choice` | Selección múltiple (varias correctas) | 4–5 `answers`, 2–3 `is_correct: true` y `correct_answer_ids` de longitud 2–3; acierto = conjunto exacto |
| `true_false` | Verdadero / Falso | Exactamente 2 `answers` (`Verdadero` / `Falso`), 1 `is_correct: true` |
| `fill_blank` | Completar código / línea | `prompt_code` con `_____`; `accepted_answers`, `aliases`, `case_sensitive` + `answers` de 1 ítem |
| `predict_output` | Predecir output | `prompt_code` obligatorio; 2–4 `answers` (1 correcta) o `accepted_answers: string[]` |
| `find_error` | Identificar errores | `prompt_code` obligatorio, `line_number` (`>=1`), 3–4 `answers` (1 correcta) |
| `order_lines` | Ordenar líneas | `blocks` (3–6 bloques `{ id, body, position }`) + `correct_order: string[]`; `answers: []`, `correct_answer_ids: []` |
| `select_code` | Seleccionar código correcto | 3–4 `answers` con `language` y `body` (snippet de código), 1 `is_correct: true` |
| `matching` | Relacionar conceptos | `pairs` (3–5 pares `{ left: { id, body }, right: { id, body } }`); `answers: []`, `correct_answer_ids: []` |
| `write_code` | Escribir código (MVP restringido) | `starter_code` + `accepted_tokens: string[]` (evaluado sin runner); `answers: []`, `correct_answer_ids: []` |
| `small_problem` | Resolver pequeño problema | `prompt_code` + `accepted_answers: string[]` + `epsilon` (tolerancia numérica) o `answers` |

#### 4.6.2 Campos específicos por tipo (`29` §4.1, `content/schemas/question.schema.json`)

| Campo | Aplica a | Tipo | Validación / Descripción |
|---|---|---|---|
| `accepted_answers` | `predict_output`, `fill_blank`, `small_problem` | `array<string>` | Respuestas de texto exactas aceptadas |
| `aliases` | `fill_blank`, `write_code` | `array<string>` | Variantes normalizables aceptadas |
| `case_sensitive` | `fill_blank`, `write_code` | `boolean` | Sensibilidad a mayúsculas/minúsculas (default `false`; `true` cuando la sintaxis lo exige) |
| `line_number` | `find_error` | `integer` | `>= 1`; número de línea (1-based) donde ocurre el error en `prompt_code` |
| `blocks` | `order_lines` | `array<{ id, body, position }>` | 3–6 bloques de código para ordenar |
| `correct_order` | `order_lines` | `array<string>` | Secuencia única válida de IDs de `blocks` |
| `pairs` | `matching` | `array<{ left: { id, body }, right: { id, body } }>` | 3–5 pares término ↔ definición |
| `epsilon` | `small_problem` | `number` | `>= 0` (ej. `0.0001`); tolerancia para respuestas numéricas en punto flotante |
| `starter_code` | `write_code` | `string` | Plantilla o código inicial entregado al estudiante |
| `accepted_tokens` | `write_code` | `array<string>` | Tokens obligatorios para validar la solución sin runner |

### 4.7 Respuesta (Answer)

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| `id` | `string` | Sí (recomendado) | `^[a-zA-Z0-9_-]{1,100}$`, único por pregunta; ej. `"opt_a"`, `"a"` | Referenciado desde `correct_answer_ids` |
| `question_id` | `string` | No (en JSON) / Sí (en BD) | `^[a-zA-Z0-9_-]{1,100}$`, FK compuesta → `questions(id,version)` | — |
| `question_version` | `integer` | No (en JSON) / Sí (en BD) | `>=1` | Congela versión |
| `label` | `string` \| `null` | No | `^[A-F]$` si se declara; ej. `A`, `B`, `C`, `D` (`null` en `fill_blank`) | Etiqueta visible |
| `body` | `string` | Sí | 1–2000 chars | Texto o snippet de código de la opción |
| `language` | `string` | No | Ej. `"lua"`, `"python"` | Solo en `select_code`: lenguaje del snippet en `body` |
| `is_correct` | `boolean` | Sí | — | Indica si la opción es correcta (1 en `single_choice`/`true_false`, 2–3 en `multiple_choice`) |
| `position` | `integer` | Sí (recomendado) | 1..N único por pregunta | Orden canónico; se aleatoriza en entrega (`05` RF-PREG-007, `29` §6) |
| `explanation` | `string` \| `null` | No | ≤1000 chars | Feedback específico de la opción |

### 4.8 Explicación (Explanation)

Toda pregunta **debe** tener `explanation` a nivel de pregunta (20–2000 chars) y **puede** tener `explanation` por opción. Debe estar en lenguaje del usuario (español), explicar la causa y el siguiente paso, sin tecnicismos ni stack traces (`06` RNF-022). Se muestra en feedback inmediato (<1 s, `06` RNF-010) y en revisión de quiz/examen (`05` RF-QUIZ-004/RF-EXAM-006).

### 4.9 Dificultad (Difficulty)

| Nivel | Código | Peso `w` | Criterio pedagógico | Tiempo estimado | Distribución Quiz (10) | Distribución Examen (20) |
|---|---|---|---|---|---|---|
| Fácil | `easy` | 1.0 | Recuerdo/comprensión directa | 20–40 s | 40% (4) | 30% (6) |
| Medio | `medium` | 1.5 | Aplicación: 2 conceptos o 1 trampa | 40–90 s | 40% (4) | 40% (8) |
| Difícil | `hard` | 2.0 | Análisis: error sutil / ordenar / problema | 60–150 s | 20% (2) | 30% (6) |

- `p_max = 10 × w` (10/15/20). Configurable sin código (`05` RF-ADM-004). Validación anti-fácil: `max_easy_ratio` 40% en examen; si se supera, publicación bloqueada (`15` §15.2).
- Cada pregunta tiene exactamente un nivel; cambiarlo crea nueva versión.

### 4.10 Prerrequisitos (Prerequisites)

Definen el DAG de desbloqueo (`14` §4).

| Nivel | Campo | Regla | Validación |
|---|---|---|---|
| Módulo | `prerequisite_module_id` | Por defecto `position-1`; `null` para `position=1` | Sin auto-ciclo; sin ciclos transitivos (validación por CTE recursivo + `RF-ADM-006`); el motor no permite saltos manuales, solo `OMITIDO_POR_DIAGNOSTICO` |
| Sección | Orden implícito | `S(j)` disponible ⇔ `S(j-1)=COMPLETADA` o `entry point` diagnóstico | Orden sin huecos |
| Lección | `prerequisite_lesson_id` | Por defecto `position-1`; puede apuntar a lección de sección previa del mismo módulo | Sin ciclos dentro del módulo |
| Pregunta | `concept_ids` | No bloquea avance; alimenta `Score_repaso` y `RF-EVAL-004` | Cada `concept_id` debe existir como `lesson.concept_id` |

**Invariante pedagógica:** ningún prerrequisito puede crear ciclo. El grafo de `modules.prerequisite_module_id` debe ser un DAG lineal por lenguaje (validación pre-publicación).

---

## 5. Formato de datos independiente del código

### 5.1 Principio de almacenamiento

El contenido vive como **artefacto declarativo versionado** (JSON y/o YAML), consumido por `Content Engine` (`11` §15) y cacheado en KV tras publicación. El frontend **nunca** hardcodea textos.

```
content/
├── schemas/
│   └── question.schema.json           # JSON Schema normativo (pregunta, banco, módulo, graph)
├── languages/
│   ├── python/
│   │   ├── manifest.json              # Language + modules[]
│   │   ├── config/
│   │   │   ├── thresholds.json        # { quiz: 70, exam: 80 }
│   │   │   ├── xp.json                # { section:10, exercise:5, quiz:25, exam:100, module:50 }
│   │   │   └── compositions.json      # { quiz: {single_choice:3,...}, exam: {single_choice:5,...} }
│   │   └── modules/
│   │       ├── 01_fundamentos/
│   │       │   ├── module.json        # Módulo + graph + sections[] + lessons[] + exercises[]
│   │       │   └── bank.json          # Banco de preguntas del módulo ([] o { module_code, questions })
│   │       └── 02_variables/
│   │           ├── module.json
│   │           └── bank.json
│   └── lua/                           # ← nuevo lenguaje = nuevo directorio (RNF-006)
│       ├── manifest.json
│       ├── config/
│       └── modules/
└── achievements/
    └── catalog.json
```

- Formato preferido: **JSON** para validación por JSON Schema (`content/schemas/question.schema.json`); **YAML** permitido si se convierte a JSON canónico antes de validar.
- Cada módulo contiene su árbol de secciones/lecciones/ejercicios en `module.json` y su banco de evaluación en `bank.json` (array plano o `{ module_code, questions: [...] }`, ver `29` §2).
- `manifest.json` del lenguaje referencia `modules[]` por `slug` ordenado; el orden físico de directorios debe coincidir con `position`.

### 5.2 Contrato de publicación

```
POST /admin/content/validate   → valida sintaxis + semántica + pedagógica (RF-ADM-006)
POST /admin/content/publish    → crea content_version nueva, cachea en KV, sin deploy (RNF-017)
```

La publicación es atómica: si un módulo falla validación, ningún módulo del lenguaje se publica.

---

## 6. Ejemplo conceptual — `language → module → section → lesson → examples → questions`

### 6.1 JSON (canónico, abreviado pero válido contra el esquema)

```json
{
  "language": {
    "id": "lang_py",
    "code": "PY",
    "slug": "python",
    "name": "Python",
    "description": "De fundamentos a POO y proyecto final.",
    "status": "available",
    "sort_order": 1,
    "content_version": 3,
    "is_active": true,
    "config": {
      "thresholds": { "quiz": 70, "exam": 80 },
      "xp": { "section": 10, "exercise_correct": 5, "quiz_pass": 25, "exam_pass": 100, "module_bonus": 50 },
      "compositions": {
        "quiz": { "single_choice": 3, "true_false": 2, "predict_output": 2, "fill_blank": 1, "find_error": 1, "select_code": 1 },
        "exam": { "single_choice": 5, "predict_output": 5, "fill_blank": 3, "find_error": 2, "true_false": 5 }
      }
    },
    "modules": [
      {
        "id": "py_mod_02",
        "language_id": "lang_py",
        "code": "PY_MOD_02",
        "slug": "variables-tipos-de-datos",
        "title": "Variables y tipos de datos",
        "objective": "Comprender qué es una variable, cómo se declara y qué tipos existen.",
        "description": "Variables, asignación, tipado dinámico y reasignación.",
        "position": 2,
        "status": "published",
        "content_version": 3,
        "prerequisite_module_id": "py_mod_01",
        "thresholds": { "quiz": 70, "exam": 80 },
        "xp": { "on_pass": 150 },
        "graph": { "tier": 1, "lane": 0, "x": 360, "y": 290, "route": "trunk" },
        "sections": [
          {
            "id": "py_sec_02_01",
            "title": "¿Qué es una variable?",
            "slug": "que-es-una-variable",
            "position": 1,
            "type": "theory",
            "status": "published",
            "content_version": 3,
            "estimated_minutes": 8,
            "xp_on_complete": 10,
            "lessons": [
              {
                "id": "py_les_02_01_01",
                "title": "Concepto de variable",
                "slug": "concepto-de-variable",
                "position": 1,
                "concept_id": "py-var-concepto",
                "explanation": "Una variable es un nombre que guarda un valor. Ese valor puede cambiar durante el programa.",
                "is_required": true,
                "status": "published",
                "content_version": 3,
                "examples": [
                  {
                    "title": "Declarar y mostrar",
                    "code": "nombre = \"Brandon\"\nprint(nombre)",
                    "language": "python",
                    "output": "Brandon",
                    "explanation": "La variable 'nombre' guarda el texto y print lo muestra.",
                    "position": 1
                  }
                ],
                "exercises": [
                  {
                    "id": "q_py_02_01",
                    "version": 1,
                    "language_id": "lang_py",
                    "module_id": "py_mod_02",
                    "section_id": "py_sec_02_01",
                    "lesson_id": "py_les_02_01_01",
                    "type": "true_false",
                    "difficulty": "easy",
                    "category": "variables",
                    "prompt": "Una variable puede almacenar información que luego puede ser modificada.",
                    "prompt_code": null,
                    "score": 10,
                    "concept_ids": ["py-var-concepto"],
                    "status": "published",
                    "content_version": 1,
                    "is_diagnostic": false,
                    "time_estimated_seconds": 20,
                    "answers": [
                      { "id": "opt_a", "label": "A", "body": "Verdadero", "is_correct": true, "position": 1 },
                      { "id": "opt_b", "label": "B", "body": "Falso", "is_correct": false, "position": 2 }
                    ],
                    "correct_answer_ids": ["opt_a"],
                    "explanation": "Verdadero. Una variable guarda un valor que puede reasignarse más adelante (ej. x = 5; x = 10).",
                    "hints": ["Piensa en una caja cuyo contenido puedes cambiar."]
                  },
                  {
                    "id": "q_py_02_02",
                    "version": 1,
                    "language_id": "lang_py",
                    "module_id": "py_mod_02",
                    "section_id": "py_sec_02_01",
                    "lesson_id": "py_les_02_01_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "category": "variables",
                    "prompt": "¿Qué imprime este programa?",
                    "prompt_code": "x = 5\nprint(x + 5)",
                    "score": 10,
                    "concept_ids": ["py-var-concepto"],
                    "status": "published",
                    "content_version": 1,
                    "is_diagnostic": true,
                    "time_estimated_seconds": 30,
                    "answers": [
                      { "id": "opt_a", "label": "A", "body": "5", "is_correct": false, "position": 1 },
                      { "id": "opt_b", "label": "B", "body": "10", "is_correct": true, "position": 2 },
                      { "id": "opt_c", "label": "C", "body": "55", "is_correct": false, "position": 3 },
                      { "id": "opt_d", "label": "D", "body": "Error", "is_correct": false, "position": 4 }
                    ],
                    "correct_answer_ids": ["opt_b"],
                    "explanation": "x vale 5, entonces x + 5 = 10. No concatena porque ambos operandos son números.",
                    "hints": ["Recuerda que + con números suma, no concatena."]
                  },
                  {
                    "id": "q_py_02_03",
                    "version": 1,
                    "language_id": "lang_py",
                    "module_id": "py_mod_02",
                    "section_id": "py_sec_02_01",
                    "lesson_id": "py_les_02_01_01",
                    "type": "fill_blank",
                    "difficulty": "medium",
                    "category": "variables",
                    "prompt": "Completa para mostrar el contenido de la variable:",
                    "prompt_code": "nombre = \"Brandon\"\nprint(_____)",
                    "accepted_answers": ["nombre"],
                    "aliases": ["nombre", " nombre "],
                    "case_sensitive": true,
                    "score": 10,
                    "concept_ids": ["py-var-concepto"],
                    "status": "published",
                    "content_version": 1,
                    "is_diagnostic": false,
                    "time_estimated_seconds": 25,
                    "answers": [
                      { "id": "ans_nombre", "label": null, "body": "nombre", "is_correct": true, "position": 1, "explanation": "Debe imprimirse la variable, no un literal." }
                    ],
                    "correct_answer_ids": ["ans_nombre"],
                    "explanation": "print(nombre) muestra el valor guardado. print(\"nombre\") mostraría el texto literal.",
                    "hints": ["Escribe el identificador de la variable sin comillas."]
                  }
                ]
              },
              {
                "id": "py_les_02_01_02",
                "title": "Declaración y asignación",
                "slug": "declaracion-y-asignacion",
                "position": 2,
                "concept_id": "py-var-declaracion",
                "explanation": "En Python se declara asignando: nombre = valor. El tipo se infiere.",
                "is_required": true,
                "status": "published",
                "content_version": 3,
                "examples": [
                  {
                    "title": "Reasignación",
                    "code": "x = 5\nx = 10\nprint(x)",
                    "language": "python",
                    "output": "10",
                    "explanation": "x cambia de 5 a 10; se imprime el último valor.",
                    "position": 1
                  }
                ],
                "exercises": [
                  {
                    "id": "q_py_02_04",
                    "version": 1,
                    "language_id": "lang_py",
                    "module_id": "py_mod_02",
                    "section_id": "py_sec_02_01",
                    "lesson_id": "py_les_02_01_02",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "category": "variables",
                    "prompt": "¿Qué imprime este bloque tras calcular b?",
                    "prompt_code": "a = 3\nb = a + 2\nprint(b)",
                    "score": 10,
                    "concept_ids": ["py-var-declaracion"],
                    "status": "published",
                    "content_version": 1,
                    "is_diagnostic": false,
                    "time_estimated_seconds": 35,
                    "answers": [
                      { "id": "opt_a", "label": "A", "body": "3", "is_correct": false, "position": 1 },
                      { "id": "opt_b", "label": "B", "body": "5", "is_correct": true, "position": 2 },
                      { "id": "opt_c", "label": "C", "body": "8", "is_correct": false, "position": 3 }
                    ],
                    "correct_answer_ids": ["opt_b"],
                    "explanation": "a vale 3, por lo que b = 3 + 2 = 5. Finalmente se imprime b.",
                    "hints": ["Sustituye el valor de a en la suma."]
                  }
                ]
              }
            ]
          }
        ],
        "quiz_refs": [
          {
            "id": "quiz_py_02_01",
            "title": "Quiz — Variables",
            "slug": "quiz-variables",
            "position": 1,
            "status": "published",
            "content_version": 3,
            "threshold": 70,
            "composition": { "single_choice": 3, "true_false": 2, "predict_output": 2, "fill_blank": 1, "find_error": 1, "select_code": 1 }
          }
        ],
        "exam_ref": {
          "id": "exam_py_02_01",
          "title": "Examen — Variables",
          "slug": "examen-variables",
          "status": "published",
          "content_version": 3,
          "threshold": 80,
          "distribution": { "single_choice": 5, "predict_output": 5, "fill_blank": 3, "find_error": 2, "true_false": 5 },
          "total_questions": 20
        }
      }
    ]
  }
}
```

### 6.2 YAML (equivalente, fragmento de `lesson.json` como `lesson.yaml`)

```yaml
language:
  id: lang_py
  code: PY
  slug: python
  name: Python
  status: available
  sort_order: 1
  content_version: 3
  modules:
    - id: py_mod_02
      code: PY_MOD_02
      slug: variables-tipos-de-datos
      title: Variables y tipos de datos
      position: 2
      status: published
      prerequisite_module_id: py_mod_01
      graph:
        tier: 1
        lane: 0
        x: 360
        y: 290
        route: trunk
      sections:
        - id: py_sec_02_01
          title: "¿Qué es una variable?"
          slug: que-es-una-variable
          position: 1
          type: theory
          lessons:
            - id: py_les_02_01_01
              title: Concepto de variable
              slug: concepto-de-variable
              position: 1
              concept_id: py-var-concepto
              explanation: "Una variable es un nombre que guarda un valor. Ese valor puede cambiar durante el programa."
              examples:
                - title: Declarar y mostrar
                  code: |
                    nombre = "Brandon"
                    print(nombre)
                  language: python
                  output: "Brandon"
                  position: 1
              exercises:
                - id: q_py_02_02
                  version: 1
                  type: single_choice
                  difficulty: easy
                  category: variables
                  prompt: "¿Qué imprime este programa?"
                  prompt_code: |
                    x = 5
                    print(x + 5)
                  score: 10
                  answers:
                    - { id: opt_a, label: A, body: "5", is_correct: false, position: 1 }
                    - { id: opt_b, label: B, body: "10", is_correct: true, position: 2 }
                    - { id: opt_c, label: C, body: "55", is_correct: false, position: 3 }
                    - { id: opt_d, label: D, body: "Error", is_correct: false, position: 4 }
                  correct_answer_ids: [opt_b]
                  explanation: "x vale 5, entonces x + 5 = 10. No concatena porque ambos operandos son números."
                  hints:
                    - "Recuerda que + con números suma, no concatena."
```

> El validador convierte YAML a JSON canónico y aplica el mismo JSON Schema. Ambos formatos son válidos; JSON es normativo para CI.

---

## 7. Esquema formal (JSON Schema draft 2020-12) — extracto normativo

El esquema normativo de preguntas, bancos, módulos y coordenadas vive en [`content/schemas/question.schema.json`](../../content/schemas/question.schema.json) y se valida en CI con `ajv` (draft 2020-12). Aquí se resume la estructura integrada con validaciones clave.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://koda.dev/schemas/question.schema.json",
  "title": "ContentSpecification",
  "type": "object",
  "required": ["language"],
  "properties": {
    "language": {
      "type": "object",
      "required": ["code", "slug", "name", "status", "sort_order", "content_version", "is_active", "modules"],
      "properties": {
        "id": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "code": { "type": "string", "pattern": "^[A-Z0-9_]{2,10}$" },
        "slug": { "type": "string", "pattern": "^[a-z0-9-]{2,50}$" },
        "name": { "type": "string", "minLength": 2, "maxLength": 50 },
        "description": { "type": "string", "maxLength": 2000 },
        "status": { "enum": ["available", "coming_soon", "hidden"] },
        "sort_order": { "type": "integer", "minimum": 1, "maximum": 999 },
        "content_version": { "type": "integer", "minimum": 1 },
        "is_active": { "type": "boolean" },
        "config": {
          "type": "object",
          "properties": {
            "thresholds": {
              "type": "object",
              "properties": {
                "quiz": { "type": "integer", "minimum": 50, "maximum": 90 },
                "exam": { "type": "integer", "minimum": 60, "maximum": 95 }
              },
              "required": ["quiz", "exam"]
            },
            "xp": {
              "type": "object",
              "properties": {
                "section": { "type": "integer", "minimum": 0 },
                "exercise_correct": { "type": "integer", "minimum": 0 },
                "quiz_pass": { "type": "integer", "minimum": 0 },
                "exam_pass": { "type": "integer", "minimum": 0 },
                "module_bonus": { "type": "integer", "minimum": 0 }
              }
            },
            "compositions": {
              "type": "object",
              "properties": {
                "quiz": { "$ref": "#/$defs/composition" },
                "exam": { "$ref": "#/$defs/composition" }
              }
            }
          }
        },
        "modules": {
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#/$defs/module" },
          "uniqueItems": true
        }
      },
      "allOf": [
        { "if": { "properties": { "status": { "const": "available" } } }, "then": { "properties": { "is_active": { "const": true } } } }
      ]
    }
  },
  "$defs": {
    "graph": {
      "type": "object",
      "properties": {
        "tier": { "type": "integer", "minimum": 0 },
        "lane": { "type": "integer" },
        "x": { "type": "number" },
        "y": { "type": "number" },
        "route": { "enum": ["trunk", "flow", "data"] }
      },
      "anyOf": [
        { "required": ["x", "y"] },
        { "required": ["tier", "lane"] }
      ]
    },
    "module": {
      "type": "object",
      "required": ["id", "code", "slug", "title", "position", "sections"],
      "properties": {
        "id": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "language_id": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "code": { "type": "string", "pattern": "^[A-Z0-9_]+$" },
        "slug": { "type": "string", "pattern": "^[a-z0-9-]{2,100}$" },
        "title": { "type": "string", "minLength": 3, "maxLength": 150 },
        "objective": { "type": "string", "maxLength": 500 },
        "description": { "type": "string", "maxLength": 2000 },
        "position": { "type": "integer", "minimum": 1 },
        "status": { "enum": ["draft", "review", "coming_soon", "published", "archived"] },
        "content_version": { "type": "integer", "minimum": 1 },
        "prerequisite_module_id": { "type": ["string", "null"], "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "thresholds": { "type": "object", "properties": { "quiz": { "type": "integer", "minimum": 50, "maximum": 90 }, "exam": { "type": "integer", "minimum": 60, "maximum": 95 } } },
        "xp": { "type": "object", "properties": { "on_pass": { "type": "integer", "minimum": 0 } } },
        "graph": { "$ref": "#/$defs/graph" },
        "sections": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/section" } },
        "quiz_refs": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/quizRef" } },
        "exam_ref": { "$ref": "#/$defs/examRef" }
      }
    },
    "section": {
      "type": "object",
      "required": ["id", "title", "position", "lessons"],
      "properties": {
        "id": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "title": { "type": "string", "minLength": 3, "maxLength": 150 },
        "slug": { "type": "string", "pattern": "^[a-z0-9-]{2,100}$" },
        "position": { "type": "integer", "minimum": 1 },
        "type": { "enum": ["theory", "example", "exercise", "quiz", "review"] },
        "status": { "enum": ["draft", "coming_soon", "published", "archived"] },
        "content_version": { "type": "integer", "minimum": 1 },
        "estimated_minutes": { "type": ["integer", "null"], "minimum": 1, "maximum": 120 },
        "xp_on_complete": { "type": "integer", "minimum": 0 },
        "graph": { "$ref": "#/$defs/graph" },
        "lessons": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/lesson" } }
      }
    },
    "lesson": {
      "type": "object",
      "required": ["id", "title", "position"],
      "properties": {
        "id": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "title": { "type": "string", "minLength": 3, "maxLength": 150 },
        "slug": { "type": "string", "pattern": "^[a-z0-9-]{2,100}$" },
        "position": { "type": "integer", "minimum": 1 },
        "concept_id": { "type": "string", "pattern": "^[a-z0-9-]{3,80}$" },
        "explanation": { "type": "string", "minLength": 20, "maxLength": 5000 },
        "examples": { "type": "array", "maxItems": 3, "items": { "$ref": "#/$defs/example" } },
        "exercise": { "$ref": "#/$defs/question" },
        "exercises": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/question" } },
        "prerequisite_lesson_id": { "type": ["string", "null"], "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "is_required": { "type": "boolean" },
        "status": { "enum": ["draft", "coming_soon", "published", "archived"] },
        "content_version": { "type": "integer", "minimum": 1 }
      }
    },
    "example": {
      "type": "object",
      "required": ["code"],
      "properties": {
        "id": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "title": { "type": "string", "maxLength": 100 },
        "code": { "type": "string", "minLength": 1, "maxLength": 2000 },
        "language": { "type": "string", "enum": ["python", "lua", "javascript", "typescript", "html", "css", "java", "c", "cpp", "csharp", "go"] },
        "output": { "type": ["string", "null"], "maxLength": 1000 },
        "explanation": { "type": "string", "maxLength": 1000 },
        "position": { "type": "integer", "minimum": 1 }
      }
    },
    "question": {
      "type": "object",
      "required": ["id", "type", "prompt", "explanation"],
      "properties": {
        "id": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "version": { "type": "integer", "minimum": 1, "default": 1 },
        "type": { "enum": ["single_choice", "multiple_choice", "true_false", "fill_blank", "predict_output", "find_error", "order_lines", "select_code", "matching", "write_code", "small_problem"] },
        "difficulty": { "enum": ["easy", "medium", "hard"] },
        "category": { "type": ["string", "null"], "pattern": "^[a-z0-9_-]{2,50}$" },
        "prompt": { "type": "string", "minLength": 10, "maxLength": 2000 },
        "prompt_code": { "type": ["string", "null"], "maxLength": 2000 },
        "score": { "type": "integer", "minimum": 1, "maximum": 100, "default": 10 },
        "concept_ids": { "type": "array", "items": { "type": "string", "pattern": "^[a-z0-9-]{3,80}$" } },
        "status": { "enum": ["draft", "published", "archived"], "default": "published" },
        "content_version": { "type": "integer", "minimum": 1 },
        "is_diagnostic": { "type": "boolean", "default": false },
        "time_estimated_seconds": { "type": ["integer", "null"], "minimum": 10, "maximum": 600 },
        "answers": { "type": "array", "items": { "$ref": "#/$defs/answer" } },
        "correct_answer_ids": { "type": "array", "items": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" } },
        "accepted_answers": { "type": "array", "items": { "type": "string" } },
        "aliases": { "type": "array", "items": { "type": "string" } },
        "case_sensitive": { "type": "boolean", "default": false },
        "line_number": { "type": "integer", "minimum": 1 },
        "blocks": { "type": "array", "minItems": 3, "maxItems": 6, "items": { "$ref": "#/$defs/block" } },
        "correct_order": { "type": "array", "items": { "type": "string" } },
        "pairs": { "type": "array", "minItems": 3, "maxItems": 5, "items": { "$ref": "#/$defs/pair" } },
        "epsilon": { "type": "number", "minimum": 0 },
        "starter_code": { "type": "string" },
        "accepted_tokens": { "type": "array", "items": { "type": "string" } },
        "explanation": { "type": "string", "minLength": 20, "maxLength": 2000 },
        "hints": { "type": "array", "items": { "type": "string", "maxLength": 500 } }
      }
    },
    "answer": {
      "type": "object",
      "required": ["body", "is_correct"],
      "properties": {
        "id": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "body": { "type": "string", "minLength": 1, "maxLength": 2000 },
        "label": { "type": ["string", "null"], "pattern": "^[A-F]$" },
        "language": { "type": "string" },
        "is_correct": { "type": "boolean" },
        "position": { "type": "integer", "minimum": 1 },
        "explanation": { "type": ["string", "null"], "maxLength": 1000 }
      }
    },
    "block": {
      "type": "object",
      "required": ["id", "body"],
      "properties": {
        "id": { "type": "string", "minLength": 1 },
        "body": { "type": "string", "minLength": 1, "maxLength": 2000 },
        "position": { "type": "integer", "minimum": 1 }
      }
    },
    "pair": {
      "type": "object",
      "required": ["left", "right"],
      "properties": {
        "left": { "type": "object", "required": ["id", "body"], "properties": { "id": { "type": "string" }, "body": { "type": "string" } } },
        "right": { "type": "object", "required": ["id", "body"], "properties": { "id": { "type": "string" }, "body": { "type": "string" } } }
      }
    },
    "quizRef": {
      "type": "object",
      "required": ["id", "title", "slug", "position", "status", "content_version", "threshold", "composition"],
      "properties": {
        "id": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "threshold": { "type": "integer", "minimum": 50, "maximum": 90 },
        "composition": { "$ref": "#/$defs/composition" }
      }
    },
    "examRef": {
      "type": "object",
      "required": ["id", "title", "slug", "status", "content_version", "threshold", "distribution", "total_questions"],
      "properties": {
        "id": { "type": "string", "pattern": "^[a-zA-Z0-9_-]{1,100}$" },
        "threshold": { "type": "integer", "minimum": 60, "maximum": 95 },
        "distribution": { "$ref": "#/$defs/composition" },
        "total_questions": { "type": "integer", "minimum": 15, "maximum": 25 }
      }
    },
    "composition": {
      "type": "object",
      "propertyNames": { "enum": ["single_choice", "multiple_choice", "true_false", "fill_blank", "predict_output", "find_error", "order_lines", "select_code", "matching", "write_code", "small_problem"] },
      "additionalProperties": { "type": "integer", "minimum": 0 },
      "minProperties": 1
    }
  }
}
```

---

## 8. Validaciones

### 8.1 Validaciones sintácticas (JSON Schema, CI bloqueante)

| # | Validación | Mensaje si falla |
|---|---|---|
| V-S01 | Campos requeridos presentes | `missing required property 'explanation' at /modules/0/sections/0/lessons/0` |
| V-S02 | Tipos y formatos (UUID, enum, pattern) | `property 'code' does not match pattern ^[A-Z0-9_]{2,10}$` |
| V-S03 | Rangos (score 1–100, thresholds 50–95, position ≥1) | `threshold.exam must be <= 95` |
| V-S04 | `explanation` 20–2000 chars, `prompt` 10–2000 chars | `explanation must be at least 20 characters` |
| V-S05 | `answers` 2–6, `correct_answer_ids` ⊆ `answers[].id`, ≥1 `is_correct=true` | `correct_answer_ids must reference existing answers and at least one is_correct=true` |

### 8.2 Validaciones semánticas (Content Engine, `POST /admin/content/validate`)

| # | Validación | Regla | Severidad |
|---|---|---|---|
| V-M01 | **IDs únicos** | `language.code`, `module.code`, `question.id` únicos en su scope; `(id, version)` único para preguntas | Bloqueante |
| V-M02 | **Orden sin huecos ni duplicados** | `modules[].position` = `1..N` sin huecos ni duplicados por lenguaje; igual para `sections` por módulo y `lessons` por sección | Bloqueante |
| V-M03 | **Prerrequisitos DAG** | `prerequisite_module_id` no crea ciclos (validación por DFS/CTE recursivo); `prerequisite_lesson_id` dentro del mismo módulo | Bloqueante |
| V-M04 | **Referencias íntegras** | Toda `question.lesson_id` referencia `lesson.id` existente; `question.section_id` coherente con `lesson.section_id`; `concept_ids` ⊆ `lessons[].concept_id` | Bloqueante |
| V-M05 | **Slug únicos** | `module.slug` único por lenguaje; `section.slug` único por módulo; `lesson.slug` único por sección | Bloqueante |
| V-M06 | **Contenido mínimo** | ≥3 secciones por módulo, ≥1 ejercicio obligatorio por lección, ≥1 quiz y 1 examen por módulo | Bloqueante |
| V-M07 | **Composición suma = total** | `Σ composition[tipo] == total_questions` (quiz 10, examen 20 por defecto) | Bloqueante |
| V-M08 | **B_MIN banco** | Quiz: banco ≥30 preguntas (3×); Examen: banco ≥80 (4×); por dificultad ≥1.5× cuota; por tipo ≥2× cuota (`15` §5.4) | Bloqueante |
| V-M09 | **max_easy_ratio** | Examen con >40% `easy` rechazado (`15` §15.2) | Bloqueante |
| V-M10 | **Cobertura por concepto** | Cada `concept_id` del módulo aparece al menos en 1 pregunta de examen; ningún concepto >30% del examen (`15` §5.3) | Bloqueante |
| V-M11 | **Versionado** | Editar pregunta `published` sin incrementar `version` rechazado; `content_version` del módulo incrementado si cambia contenido | Bloqueante |
| V-M12 | **Estados coherentes** | `status=available` ⇒ `is_active=true`; no se publica `draft` como `published` sin validar | Bloqueante |

### 8.3 Validaciones pedagógicas (revisor humano + heurística)

| # | Validación | Criterio |
|---|---|---|
| V-P01 | Lección sin jerga no introducida | Toda jerga debe haber sido definida en lección previa del mismo lenguaje o estar glosada |
| V-P02 | Ejemplo ejecutable | `example.code` debe ser sintácticamente válido para `example.language` (lint por lenguaje) |
| V-P03 | Explicación pedagógica | `explanation` en lenguaje del usuario, causa + siguiente paso, sin stack trace (`06` RNF-022) |
| V-P04 | Dificultad calibrada | `easy` no debe tener tasa de fallo >60% histórica; `hard` no debe tener tasa de acierto >85% sostenida sin recalibración (`15` §15.3) |
| V-P05 | Distractores plausibles | Opciones incorrectas no triviales; `order_lines` con única permutación válida |

### 8.4 Validaciones de integridad referencial en BD (`06` RNF-036)

Toda FK existe en BD (`programming_languages` → `modules` → `sections` → `lessons` → `questions` → `answers`), con `ON DELETE RESTRICT` salvo hijos sin sentido sin padre. Intentos guardan `(question_id, question_version)` congelados (`RNF-035`).

---

## 9. Versionado y publicación

| Aspecto | Regla |
|---|---|
| **Granularidad** | `content_version` por `language`, `module`, `section`, `lesson` y `question(version)`. El `content_version` del lenguaje es el máximo de sus módulos. |
| **Incremento** | Cada `POST /admin/content/publish` exitoso incrementa `content_version` del/los módulos afectados. No se permite `UPDATE` destructivo de pregunta `published`; se exige `INSERT` con `version+1`. |
| **Trazabilidad** | Cada `attempt` persiste `content_version` + `threshold_aplicado` vigentes al calificar. Cambiar contenido no re-califica intentos pasados (`06` RNF-035). |
| **Publicación atómica** | Un lenguaje se publica completo o no se publica; fallo en un módulo revierte todo. |
| **Efecto sin deploy** | Tras publicar, KV se invalida y la nueva versión es visible en <5 min (`06` RNF-017). |
| **Auditoría** | `audit_log` con `quién, qué, cuándo, versión anterior/nueva` (`05` RF-ADM-008). |
| **Certificados** | Cambio significativo de `language.content_version` puede marcar certificados `valid` → `obsolete` (`05` RF-CERT-005). |

---

## 10. Cómo agregar un nuevo lenguaje sin modificar el motor

Este es el requisito `03` OT-03, `04` §10.3 y `06` RNF-006. Garantizado por construcción: el motor nunca contiene `if (language === 'python')`.

| Paso | Acción | Artefacto | Toca código del motor |
|---|---|---|---|
| 1 | Crear directorio `content/languages/{slug}/` | `manifest.json` con `{ code, slug, name, status: "coming_soon", sort_order, content_version: 1 }` | No |
| 2 | Definir `config/` | `thresholds.json`, `xp.json`, `compositions.json` (heredan defaults si no se declaran) | No |
| 3 | Crear módulos en orden pedagógico | `modules/01_fundamentos/module.json` ... `12_proyecto_final/module.json` (12 en Python, N configurable) | No |
| 4 | Crear secciones y lecciones | `sections/*/section.json` + `lessons/*/lesson.json` con `explanation`, `examples[]` | No |
| 5 | Cargar banco de preguntas tipificadas | `questions/*.json` con `type, difficulty, answers, explanation, score` + `is_diagnostic` donde aplique | No |
| 6 | Definir quizzes y examen | `quizzes/quiz_01.json` con `composition` + `exams/exam.json` con `distribution` | No |
| 7 | Validar coherencia | `POST /admin/content/validate` → verifica V-S01..V-M12 | No |
| 8 | Publicar en staging | `POST /admin/content/publish` → crea `content_version` nueva, cachea en KV | No |
| 9 | Verificar | Ruta `{slug}` visible, diagnóstico, progreso aislado por lenguaje (`05` RF-LANG-005), `grep` en CI confirma 0 literales hardcodeados | No |
| 10 | Activar en prod | `status: "available"` en `manifest.json` → publicar | No |

**Garantías:**
- Validación automática bloquea huérfanos/ciclos.
- `grep` en CI (`06` RNF-031) falla si el motor contiene literales de contenido.
- Ensayo `RNF-006` con lenguaje de prueba (1 módulo mínimo) verifica 0 cambios en motor.
- Versionado (`RNF-035`) aísla intentos de Python de los del nuevo lenguaje.
- Progreso por lenguaje (`05` RF-LANG-005) aísla datos.

---

## 11. Configuración (herencia y precedencia)

```
defaults globales (content/config.yaml)
  └─ language.config (content/languages/{slug}/config/*)
      └─ module.thresholds / module.xp (module.json)
          └─ question.score / question.difficulty (question.json)
```

- Si un módulo no declara `thresholds`, hereda `language.config.thresholds`.
- Si un lenguaje no declara `config`, hereda `defaults` globales (`quiz:70, exam:80, xp: {section:10, ...}`).
- Toda configuración es versionada y auditable; cambios solo afectan intentos futuros.

---

## 12. Reglas de negocio transversales (heredadas de `14` y `15`)

| # | Regla | Origen |
|---|---|---|
| RN-C01 | Toda lección tiene ≥1 ejercicio obligatorio (`03` OED-02) | `05` RF-LEC-001 |
| RN-C02 | Preguntas ancladas a lección/sección actual, nunca aleatorias globales | `05` RF-PREG-003 |
| RN-C03 | Feedback inmediato <1 s con explicación | `06` RNF-010 |
| RN-C04 | Diagnóstico no otorga aprobación | `05` RF-DIAG-006 |
| RN-C05 | Quiz ≥70% y Examen ≥80% iniciales, configurables y versionados por intento | `01` §15, `05` RF-EVAL-005 |
| RN-C06 | Todo contenido publicado es versionado; intentos conservan versión | `06` RNF-035 |
| RN-C07 | Contenido oculto por admin no aparece en biblioteca/ruta ni por URL directa | `05` RF-ADM-003 |
| RN-C08 | Preguntas `is_diagnostic=true` no deben coincidir con preguntas de quiz/examen del mismo módulo (evita fuga) | `14` §5.2 |

---

## 13. Antipatrones y mitigaciones

| Antipatrón | Consecuencia | Mitigación en este documento |
|---|---|---|
| Texto hardcodeado en UI/motor | Rompe `RNF-006` y `RNF-031`; agregar lenguaje exige deploy | `grep` en CI + Content Engine como única fuente |
| Lección sin ejercicio | Viola `03` OED-02; aprendizaje pasivo | Validación V-M06 bloquea publicación |
| Banco pequeño (<B_MIN) | Repetición y memorización | Validación V-M08 bloquea publicación |
| Examen 80% easy | Aprobación trivial | Validación V-M09 + ponderación por dificultad (`15` §7) |
| Reutilizar mismo set en reintento | Farm de intentos | Nueva semilla + exclusión temporal `15` §15.4 |
| Opciones siempre en mismo orden | Memorización posicional | Barajado por `semilla3` (`15` §15.1) |
| `UPDATE` destructivo de pregunta publicada | Reescribe historial | Versionado obligatorio V-M11 |
| Prerrequisito con ciclo | Ruta bloqueada o infinita | Validación DAG V-M03 |

---

## 14. Validación en CI (referencia)

```yaml
# .github/workflows/content-validate.yml (ilustrativo)
- name: Validate content schemas
  run: ajv validate -s content/schemas/question.schema.json -d "content/languages/**/bank.json" --spec=draft2020
- name: Validate no hardcoded content
  run: |
    ! grep -R "print(x + 5)" src/ --include="*.ts" --include="*.tsx"
    ! grep -R "Una variable puede" src/ --include="*.ts" --include="*.tsx"
- name: Validate content coherence (API)
  run: curl -X POST http://localhost:3000/admin/content/validate -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 15. Trazabilidad

| Elemento de este documento | RF (`05`) | RNF (`06`) | OT/OE (`03`) | PS (`02`) |
|---|---|---|---|---|
| Jerarquía §3–§4 | RF-LANG-001/004, RF-MOD-001/004, RF-SEC-001, RF-LEC-001 | RNF-031, RNF-006 | OT-02, OT-03 | PS-09, causa estructural |
| Lenguaje/Módulo/Sección/Lección §4.1–4.4 | RF-LANG-001/002, RF-MOD-001/002/003/005, RF-SEC-001–003, RF-LEC-001–005 | RNF-035/036 | OT-02 | PS-01/04 |
| Ejemplo §4.5 | RF-LEC-001, RF-SEC-002 | — | OED-01 | PS-01 |
| Pregunta/Respuesta/Explicación §4.6–4.8 | RF-PREG-001–007 | RNF-010/035 | OED-02 | PS-03/05/10 |
| Dificultad §4.9 | RF-PREG-002, RF-EVAL-001, RF-ADM-004 | — | — | — |
| Prerrequisitos §4.10 | RF-RUTA-004, RF-ADM-006 | — | — | PS-04/07 |
| Formato independiente §5 | RF-ADM-001/003/005, RF-LANG-004 | RNF-006/017/031 | OT-02/03 | Causa estructural |
| Esquema + validaciones §7–§8 | RF-ADM-006, RF-PREG-006, RF-EVAL-005 | RNF-036/035 | — | — |
| Versionado §9 | RF-ADM-005, RF-PREG-006, RF-EVAL-005, RF-CERT-005 | RNF-035/017 | — | — |
| Agregar lenguaje §10 | RF-LANG-004, RF-MOD-004, RF-ADM-001 | RNF-006/031 | OT-03 | PS-09 |

---

## 16. Referencias cruzadas

| Documento | Relación |
|---|---|
| `01_PROJECT_OVERVIEW.md` §7/§31/§34 | Jerarquía educativa, principio de contenido independiente y ruta Python de 12 módulos |
| `02_PROBLEM_STATEMENT.md` §3 | Causa estructural (contenido hardcodeado) que este documento elimina |
| `03_OBJECTIVES.md` OT-02/OT-03 | Contenido independiente y agregar lenguaje sin tocar motor |
| `04_SCOPE.md` §10.3 | Criterio anti-scope-creep: agregar lenguaje = solo contenido + config |
| `05_FUNCTIONAL_REQUIREMENTS.md` | 128 RF origen de cada entidad y validación (§4–§8) |
| `06_NON_FUNCTIONAL_REQUIREMENTS.md` | RNF-006 (escalar en contenido), RNF-017 (config sin deploy), RNF-031 (desacoplo), RNF-035/036 |
| `11_SYSTEM_ARCHITECTURE.md` §15/§18 | Content Engine y procedimiento de 10 pasos para nuevo lenguaje |
| `12_DATABASE_DESIGN.md` §6.3–§6.11 | Entidades `programming_languages`/`modules`/`sections`/`lessons`/`questions`/`answers` |
| `13_API_SPECIFICATION.md` §5 | Endpoints `GET /languages`, `/modules`, `/lessons`, `/admin/content/*` |
| `14_LEARNING_SYSTEM.md` §2–§4 | Modelo jerárquico, estados y reglas de desbloqueo que el contenido debe respetar |
| `15_QUIZ_EXAM_SYSTEM.md` §3–§5 | Tipos, dificultades, cantidades, selección, B_MIN y anti-fácil que el banco debe cumplir |
| `24_CONTENT_AUTHORING_GUIDE.md` | Tipificación renderizable y validadores por tipo |
| `25_ADMIN_SYSTEM.md` | Flujos de validación/publicación/ocultamiento y auditoría |
| `28_LUA_CURRICULUM.md` | Ruta educativa completa de Lua (12 módulos) |
| `29_QUESTION_JSON_CONTRACT.md` | Contrato físico canónico de preguntas y bancos (`content/schemas/question.schema.json`) |
| `30_ROADMAP_STRUCTURE_AND_COORDINATES.md` | Orden pedagógico, sistema de coordenadas de 3 capas y bloque declarativo `graph` |

---

*Fin de `23_CONTENT_SPECIFICATION.md` — cualquier adición de entidad, cambio de formato, nueva validación o modificación del procedimiento de agregado de lenguajes requiere actualizar este documento, `05`, `11`, `12`, `15`, `25`, `29`, `30` y `CHANGELOG.md` con fecha `America/Bogota`.*
