# 29 — Contrato JSON de Preguntas (Question JSON Contract)

> **Estado:** Vigente · **Versión del documento:** 1.0.0 · **Fecha:** 2026-10-15
> **Zona horaria:** America/Bogota (UTC-5)
> **Fuente de verdad** del formato de pregunta que consumen el Content Engine, la API de evaluación y el frontend.
> Complementa a `23_CONTENT_SPECIFICATION.md` (formato y almacenamiento), `24_CONTENT_AUTHORING_GUIDE.md` (cómo escribir bien), `15_QUIZ_EXAM_SYSTEM.md` (selección y bancos) y `30_ROADMAP_STRUCTURE_AND_COORDINATES.md` (orden y coordenadas).
> **Norma normativa:** el JSON Schema en [`content/schemas/question.schema.json`](../../content/schemas/question.schema.json). Si este documento y el schema difieren, **manda el schema**.

---

## 1. Propósito y alcance

Este documento define **la anatomía exacta de una pregunta en JSON**, para que cualquier autor pueda:

1. Formular preguntas nuevas sin tocar el motor.
2. Añadir preguntas a lecciones (`module.json`) y a bancos de quiz/examen (`bank.json`).
3. Añadir módulos completos reutilizando el mismo contrato.

**Dentro del alcance:** campos obligatorios/opcionales, payload por tipo de pregunta, reglas de orden de preguntas y respuestas, composición de evaluaciones, banco mínimo (B_min) y normalización del dialecto legacy.

**Fuera del alcance:** la lógica de calificación (`15`), el modelo relacional (`12`), la UI de render (`27`) y las coordenadas del grafo (`30`).

> [!IMPORTANT]
> El esquema descrito en `23` §7 (preguntas con `id`/`version`/`content_version` en UUID y `difficulty` en códigos `EASY/MEDIUM/HARD`) es **aspiracional**. El contrato vigente es **este documento**. Ver §9 para la tabla de normalización.

---

## 2. Fuente de verdad y ubicación de archivos

```
content/languages/{slug}/
├── manifest.json                       # catálogo de módulos + config por defecto
├── config/
│   ├── thresholds.json                 # umbrales quiz/exam
│   ├── xp.json                         # economía de XP
│   └── compositions.json               # cuota por tipo en quiz/exam
└── modules/{NN_slug}/
    ├── module.json                     # teoría + lecciones + ejercicio inline (practica anclada)
    └── bank.json                       # banco de preguntas para quiz/examen
```

| Contenedor | Nivel | Contrato |
|---|---|---|
| `module.json → sections[].lessons[].exercise` | lección (practica anclada) | mismo sobre, un único ejercicio |
| `module.json → sections[].lessons[].exercises[]` | lección (lista) | mismo sobre, uno o más |
| `bank.json → [...]` | banco del módulo | array de preguntas; orden = orden del array |
| `bank.json → { module_code, questions: [...] }` | banco del módulo (v2) | forma recomendada para bancos nuevos; alinea con `evaluation.service.ts` |

> `module.json` y `sections[]` aceptan además `status: "coming_soon"` (usado por JavaScript/TypeScript en el repo real).

---

## 3. Sobre común de la pregunta

Todo tipo de pregunta comparte este sobre:

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| `id` | `string` | Sí | único en su scope; estable entre versiones | Identidad de la pregunta |
| `type` | `enum` | Sí | Ver §4 | Tipo de pregunta |
| `difficulty` | `enum` | No (default `medium`) | `easy` \| `medium` \| `hard` | Peso 1.0 / 1.5 / 2.0 |
| `category` | `string` | No | `^[a-z0-9_-]{2,50}$` | Para `Score_repaso` |
| `concept_ids` | `string[]` | No | cada id debe existir como `lesson.concept_id` | Conceptos evaluados |
| `prompt` | `string` | Sí | 10–2000 chars | Enunciado, 1 verbo / 1 foco |
| `prompt_code` | `string \| null` | Condicional | ≤2000 chars; obligatorio en tipos con snippet | Código asociado |
| `answers` | `Answer[]` | Condicional | 1–6 según tipo (§4); obligatorio salvo `order_lines` / `matching` / `write_code` | Opciones / bloques / pares |
| `correct_answer_ids` | `string[]` | No (recomendado) | ids de `answers[]` | Clave estable por `id`, nunca por índice |
| `explanation` | `string` | Sí | 20–2000 chars | Feedback (causa → correcta → siguiente paso) |
| `hints` | `string[]` | No | cada ≤500 chars; no revela la respuesta | Pistas |
| `score` | `integer` | No (default 10) | 1–100 | Puntaje base `p_base` |
| `time_estimated_seconds` | `integer \| null` | No | 10–600 | Tiempo estimado |
| `is_diagnostic` | `boolean` | No (default `false`) | — | Elegible para diagnóstico |
| `version` | `integer` | No (default 1) | ≥1 | Suma al editar publicado |
| `status` | `enum` | No (default `published`) | `draft` \| `published` \| `archived` | Ciclo de vida |
| `content_version` | `integer` | No | ≥1 | Trazabilidad |

> [!IMPORTANT]
> **Dos formas válidas de marcar la correcta** (el validador acepta ambas):
> 1. **`answers[].is_correct: true`** — la clave vive en la opción. Es la forma en que está hoy el 100 % del contenido real (Lua `02_variables`, Python, etc.).
> 2. **`correct_answer_ids: ["..."]`** — la clave vive aparte, referenciando `answers[].id`. Es la forma **canónica recomendada** porque sobrevive al barajado y a cambios de orden (ver §6).
>
> Regla: cada tipo exige exactamente el número correcto de respuestas (1 en `single_choice`/`true_false`/`find_error`/`select_code`, 2–3 en `multiple_choice`), ya sea vía `is_correct` o vía `correct_answer_ids`.

### 3.1 Respuesta (`Answer`)

| Campo | Tipo | Requerido | Validación | Descripción |
|---|---|---|---|---|
| `id` | `string` | No (recomendado) | único dentro de la pregunta si se declara | Necesario para referenciarla desde `correct_answer_ids` |
| `label` | `string \| null` | No | `^[A-Z]$` (`A`–`F`) | Etiqueta visible |
| `body` | `string` | Sí | 1–2000 chars | Texto o código de la opción |
| `is_correct` | `boolean` | Sí | — | Puede haber varias correctas (`multiple_choice`) |
| `position` | `integer` | No | 1..N sin huecos si se declara | Orden canónico (ver §6) |
| `explanation` | `string \| null` | No | ≤1000 chars | Feedback específico de la opción |

---

## 4. Catálogo de tipos y payload

| `type` | Uso | Payload específico |
|---|---|---|
| `single_choice` | Comprensión directa / predicción simple | `answers` 2–6, exactamente 1 `is_correct` |
| `multiple_choice` | Evaluar conjuntos | `answers` 4–5, 2–3 correctas (acierto = conjunto exacto) |
| `true_false` | Propiedades binarias | `answers` = 2 (`Verdadero` / `Falso`), 1 correcta |
| `predict_output` | Predecir salida | `prompt_code` obligatorio; `answers` 2–4 **o** `accepted_answers: string[]` |
| `fill_blank` | Sintaxis exacta, 1 hueco | `prompt_code` con `_____`; `accepted_answers` + `aliases` + `case_sensitive` (recomendado) |
| `find_error` | Señalar línea/tipo de error | `prompt_code` con el bug; `line_number?`; `answers` 3–4 |
| `select_code` | Comparar implementaciones | `answers[].language` + `answers[].body` (snippet); 3–4 opciones |
| `order_lines` | Ordenar lógica | `blocks: [{id, body, position}]` + `correct_order: string[]` (única permutación válida) |
| `matching` | Relacionar conceptos | `pairs: [{ left: {id, body}, right: {id, body} }]` (3–5 pares, todo-o-nada) |
| `small_problem` | Mini-problema determinista | `answers` o `accepted_answers`; `epsilon?` si es flotante |
| `write_code` | Escribir forma canónica (MVP sin runner) | `starter_code` + `accepted_tokens: string[]` |

> [!NOTE]
> Los tipos `select_code`, `order_lines`, `matching`, `small_problem`, `multiple_choice` y `write_code` **aún no tienen visor interactivo** ni datos en los bancos. Se documentan aquí para autorizar su uso futuro sin renegociar el contrato.

### 4.1 Campos exclusivos por tipo

| Campo | Aplica a | Tipo | Descripción |
|---|---|---|---|
| `accepted_answers` | `predict_output`, `fill_blank`, `small_problem` | `string[]` | Respuestas de texto aceptadas |
| `aliases` | `fill_blank`, `write_code` | `string[]` | Variantes normalizables |
| `case_sensitive` | `fill_blank`, `write_code` | `boolean` | Default `false` salvo exigencia del lenguaje |
| `line_number` | `find_error` | `integer` | Línea del error (1-based) |
| `blocks` | `order_lines` | `object[]` | Bloques desordenados |
| `correct_order` | `order_lines` | `string[]` | Única secuencia válida (ids de `blocks`) |
| `pairs` | `matching` | `object[]` | Pares término↔definición |
| `epsilon` | `small_problem` | `number` | Tolerancia para flotantes |
| `starter_code` | `write_code` | `string` | Código inicial |
| `accepted_tokens` | `write_code` | `string[]` | Tokens válidos (evaluación sin runner) |

---

## 5. Ejemplos por tipo

### 5.1 `single_choice` (formato canónico — de `lua/03_operadores`)

```json
{
  "id": "q_lua_03_01",
  "type": "single_choice",
  "difficulty": "easy",
  "category": "operadores",
  "concept_ids": ["lua-op-concatenacion"],
  "prompt": "¿Cuál es el operador de concatenación de cadenas en Lua?",
  "prompt_code": null,
  "answers": [
    { "id": "opt_a", "label": "A", "body": "..", "is_correct": true,  "position": 1 },
    { "id": "opt_b", "label": "B", "body": "+",  "is_correct": false, "position": 2 },
    { "id": "opt_c", "label": "C", "body": "&",  "is_correct": false, "position": 3 },
    { "id": "opt_d", "label": "D", "body": ".",  "is_correct": false, "position": 4 }
  ],
  "correct_answer_ids": ["opt_a"],
  "explanation": "En Lua el operador `..` une cadenas de texto. `+` intentaría coerción numérica.",
  "hints": ["Son dos puntos continuos."],
  "score": 10,
  "time_estimated_seconds": 30,
  "is_diagnostic": false,
  "version": 1,
  "status": "published",
  "content_version": 1
}
```

### 5.2 `predict_output`

```json
{
  "id": "q_lua_02_07",
  "type": "predict_output",
  "difficulty": "medium",
  "category": "variables",
  "prompt": "¿Qué número mostrará este código al reasignar la variable?",
  "prompt_code": "local x = 10\nx = 25\nprint(x)",
  "answers": [
    { "id": "a", "label": "A", "body": "10",    "is_correct": false, "position": 1 },
    { "id": "b", "label": "B", "body": "25",    "is_correct": true,  "position": 2 },
    { "id": "c", "label": "C", "body": "35",    "is_correct": false, "position": 3 },
    { "id": "d", "label": "D", "body": "Error", "is_correct": false, "position": 4 }
  ],
  "correct_answer_ids": ["b"],
  "explanation": "La reasignación reemplaza el valor anterior: `x` pasa de 10 a 25 y eso se imprime."
}
```

### 5.3 `fill_blank`

```json
{
  "id": "q_lua_01_10",
  "type": "fill_blank",
  "difficulty": "easy",
  "category": "fundamentos",
  "prompt": "Escribe la palabra clave de Lua para mostrar un mensaje en pantalla:",
  "prompt_code": "_____(\"Aprendiendo con éxito\")",
  "accepted_answers": ["print"],
  "aliases": ["print", "print()", " print "],
  "case_sensitive": true,
  "answers": [
    { "id": "ans_print", "label": null, "body": "print", "is_correct": true, "position": 1 }
  ],
  "correct_answer_ids": ["ans_print"],
  "explanation": "`print` es la instrucción elemental de salida en Lua. En mayúsculas (`Print`) ya no existe."
}
```

### 5.4 `find_error`

```json
{
  "id": "q_lua_01_05",
  "type": "find_error",
  "difficulty": "easy",
  "category": "fundamentos",
  "prompt": "Observa este código con atención. ¿Por qué Lua marcará un error de sintaxis?",
  "prompt_code": "print(\"Hola mundo\"",
  "line_number": 1,
  "answers": [
    { "id": "a", "label": "A", "body": "La palabra print está prohibida", "is_correct": false, "position": 1 },
    { "id": "b", "label": "B", "body": "Falta cerrar el paréntesis al final", "is_correct": true, "position": 2 },
    { "id": "c", "label": "C", "body": "No se puede usar la palabra mundo", "is_correct": false, "position": 3 },
    { "id": "d", "label": "D", "body": "Falta una coma al inicio", "is_correct": false, "position": 4 }
  ],
  "correct_answer_ids": ["b"],
  "explanation": "Toda `(` necesita su `)`. Aquí falta cerrar el paréntesis de `print`."
}
```

### 5.5 `true_false`

```json
{
  "id": "q_lua_01_09",
  "type": "true_false",
  "difficulty": "easy",
  "prompt": "¿Es obligatorio poner punto y coma (;) al final de cada línea en Lua?",
  "answers": [
    { "id": "t", "label": "A", "body": "Verdadero", "is_correct": false, "position": 1 },
    { "id": "f", "label": "B", "body": "Falso",    "is_correct": true,  "position": 2 }
  ],
  "correct_answer_ids": ["f"],
  "explanation": "En Lua el `;` es opcional; sirve para separar dos sentencias en la misma línea."
}
```

### 5.6 `order_lines`

```json
{
  "id": "q_lua_03_20",
  "type": "order_lines",
  "difficulty": "hard",
  "prompt": "Ordena las líneas para que el programa compile y muestre el resultado correcto:",
  "blocks": [
    { "id": "b1", "body": "local total = 0", "position": 1 },
    { "id": "b2", "body": "total = total + 5", "position": 2 },
    { "id": "b3", "body": "print(total)", "position": 3 }
  ],
  "correct_order": ["b1", "b2", "b3"],
  "answers": [],
  "correct_answer_ids": [],
  "explanation": "Primero se declara el acumulador, luego se suma y al final se imprime."
}
```

> En `order_lines`, `answers` y `correct_answer_ids` pueden ir vacíos: la clave vive en `correct_order`.

### 5.7 `select_code`

```json
{
  "id": "q_lua_03_21",
  "type": "select_code",
  "difficulty": "medium",
  "prompt": "¿Cuál snippet concatena correctamente el nombre y el puntaje?",
  "answers": [
    { "id": "a", "label": "A", "language": "lua", "body": "print(\"Ana\" + 10)", "is_correct": false, "position": 1 },
    { "id": "b", "label": "B", "language": "lua", "body": "print(\"Ana\" .. 10)", "is_correct": true, "position": 2 },
    { "id": "c", "label": "C", "language": "lua", "body": "print(\"Ana\" & 10)", "is_correct": false, "position": 3 }
  ],
  "correct_answer_ids": ["b"],
  "explanation": "En Lua la concatenación es `..`. `+` solo opera con números."
}
```

### 5.8 `matching`

```json
{
  "id": "q_lua_03_22",
  "type": "matching",
  "difficulty": "medium",
  "prompt": "Relaciona cada operador con lo que hace:",
  "pairs": [
    { "left": { "id": "l1", "body": ".." }, "right": { "id": "r1", "body": "Concatena cadenas" } },
    { "left": { "id": "l2", "body": "#" }, "right": { "id": "r2", "body": "Devuelve la longitud" } },
    { "left": { "id": "l3", "body": "~=" }, "right": { "id": "r3", "body": "Compara desigualdad" } }
  ],
  "answers": [],
  "correct_answer_ids": [],
  "explanation": "`..` concatena, `#` mide y `~=` compara si dos valores son distintos."
}
```

### 5.9 `small_problem`

```json
{
  "id": "q_lua_03_23",
  "type": "small_problem",
  "difficulty": "hard",
  "prompt": "¿Qué valor imprime el programa?",
  "prompt_code": "print((2 + 3) * 4)",
  "accepted_answers": ["20"],
  "epsilon": 0.0001,
  "answers": [],
  "correct_answer_ids": [],
  "explanation": "Los paréntesis primero: `2+3=5` y `5*4=20`."
}
```

### 5.10 `write_code` y `multiple_choice`

```json
{
  "id": "q_lua_03_30",
  "type": "write_code",
  "difficulty": "medium",
  "prompt": "Escribe una línea que declare la variable `vidas` con valor 3 usando `local`:",
  "starter_code": "_____ vidas = 3",
  "accepted_tokens": ["local"],
  "answers": [],
  "correct_answer_ids": [],
  "explanation": "`local` limita el alcance de la variable al bloque actual."
}
```

```json
{
  "id": "q_lua_03_31",
  "type": "multiple_choice",
  "difficulty": "medium",
  "prompt": "Marca TODOS los operadores lógicos nativos de Lua:",
  "answers": [
    { "id": "a", "label": "A", "body": "and", "is_correct": true,  "position": 1 },
    { "id": "b", "label": "B", "body": "or",  "is_correct": true,  "position": 2 },
    { "id": "c", "label": "C", "body": "not", "is_correct": true,  "position": 3 },
    { "id": "d", "label": "D", "body": "xor", "is_correct": false, "position": 4 }
  ],
  "correct_answer_ids": ["a", "b", "c"],
  "explanation": "Lua usa `and`, `or` y `not` como palabras completas. No existe `xor`."
}
```

---

## 6. Orden de preguntas y respuestas

**Regla:** el orden **canónico** es el orden del array. `position` es **opcional** y, si se declara, debe ser `1..N` sin huecos ni duplicados.

| Nivel | Orden declarado | Orden de entrega |
|---|---|---|
| Pregunta en `bank.json` | índice del array | barajado por `compositions.json` + semilla |
| Pregunta en `module.json` (lección) | índice de `exercises[]` | orden de la lección |
| Respuesta | orden de `answers[]` / `position` | barajado por semilla |
| Módulo / Sección / Lección | `position` (obligatorio) | respeta `position` |
| Quiz / Examen | `compositions.json` (cuota por tipo) | selección aleatoria |

**Barajado determinista** (`apps/web/src/lib/content.ts`):

```ts
// Fisher-Yates con semilla → mismo usuario/semilla = mismo orden.
export function shuffled<T>(items: T[], seed = 42): T[]
```

**Consecuencia de diseño:** nunca referenciar la clave por índice. `correct_answer_ids` apunta a `answers[].id`, así el barajado no rompe la corrección.

> [!WARNING]
> En los bancos actuales (`lua/*/bank.json`) las preguntas **no** declaran `position` y las respuestas a veces omiten `label`. Es válido por el default, pero para bancos nuevos se recomienda declarar `position` y `label` explícitos.

---

## 7. Reglas de autoría (resumen operativo de `24`)

| Regla | Criterio |
|---|---|
| Un concepto por pregunta | 1 `concept_ids`, 1 verbo y 1 foco en el enunciado |
| Dificultad calibrada | `easy` 1.0 (20–40 s) · `medium` 1.5 (40–90 s) · `hard` 2.0 (60–150 s) |
| Distractores plausibles | Cada distractor = 1 error real; longitud homogénea (±30%) |
| Prohibido | "todas las anteriores" / "ninguna"; negaciones ocultas sin resaltar |
| Feedback | Causa → respuesta correcta → siguiente paso; 25–60 palabras en error |
| Snippet autocontenido | ≤10 líneas, sin estado previo asumido |
| Sin ambigüedad | Pasa los 4 tests de `24` §10.2 |

---

## 8. Composición de evaluaciones y banco mínimo

De `config/compositions.json` (valores vigentes de Lua):

| Evaluación | Cuota por tipo | Total |
|---|---|---|
| `quiz` | single_choice 3 · true_false 2 · predict_output 2 · fill_blank 1 · find_error 1 · select_code 1 | 10 |
| `exam` | single_choice 5 · predict_output 5 · fill_blank 3 · find_error 2 · true_false 5 | 20 |

**Banco mínimo (B_min, de `24` §12.3 M-02):** quiz ≥30, examen ≥80; por dificultad ≥1.5× cuota; por tipo ≥2× cuota.

### 8.1 Estado actual de los bancos de Lua

| Módulo | Preguntas en banco | ¿Cumple quiz (10)? | ¿Cumple B_min (30)? |
|---|---|---|---|
| `01_fundamentos` | 15 | ✅ | ❌ |
| `02_variables` | 20 | ✅ | ❌ |
| `03_operadores` | 2 | ❌ | ❌ |

> [!WARNING]
> Con los bancos actuales, la composición de `exam` (20 ítems) no es alcanzable en ningún módulo de Lua. La selección rellena con preguntas sobrantes o falla. **Ampliar el banco antes de publicar quiz/examen.**

---

## 9. Normalización del dialecto legacy

Existen **tres dialectos reales** en el repositorio; todos validan contra el schema:

| Dialecto | Dónde vive | Correcta en | Notas |
|---|---|---|---|
| **Canónico** | `01_fundamentos/bank.json` | `answers[].is_correct` + `correct_answer_ids` | Forma recomendada |
| **Simplificado** | `02_variables/bank.json` | `answers[].is_correct` | Sin `correct_answer_ids` ni `difficulty` (ambos opcionales) |
| **Shorthand (legacy)** | `03_operadores/bank.json`, bancos de `python` | `correct_option_id` | `options[]` + `correct_option_id` + `hint` |

Equivalencias del dialecto *shorthand* (el loader web lo traduce al canónico):

| Legacy (shorthand) | Canónico | Nota |
|---|---|---|
| `options[]` | `answers[]` | — |
| `opt.text` | `opt.body` | — |
| `correct_option_id` | `correct_answer_ids: [id]` **o** `answers[].is_correct` | — |
| `hint` | `hints: [hint]` | — |
| `concept_id` | `concept_ids: [concept_id]` | Python usa singular |
| `lesson.theory_markdown` | `lesson.explanation` | — |
| `lesson.code_example` / `expected_output` / `tip_markdown` | `lesson.examples[]` | — |

> El schema acepta el shorthand vía `$defs.legacyQuestion` (banco/lección), así el contenido actual valida sin migración forzada. Migrar a `answers`/`correct_answer_ids` es **deuda técnica declarada**, no un bloqueo.

Referencia de código: `apps/web/src/lib/content.ts` → `normalizeLesson()` y `loadBank()`.

---

## 10. Cómo añadir contenido

### 10.1 Añadir una pregunta a una lección

1. Abre `content/languages/{slug}/modules/{NN}/module.json`.
2. Localiza `sections[].lessons[]`.
3. Añade el objeto al array `exercises[]` (o crea `exercise` si no existe).
4. Usa el sobre de §3 y el payload de §4.
5. Verifica contra `content/schemas/question.schema.json`.

### 10.2 Añadir preguntas al banco

1. Abre `content/languages/{slug}/modules/{NN}/bank.json`.
2. Añade el objeto al array (o dentro de `questions[]` si usas la forma v2).
3. Respeta la cuota de §8 y el B_min.

### 10.3 Añadir un módulo

1. Crea `content/languages/{slug}/modules/{NN_slug}/`.
2. Añade `module.json` (con `graph` — ver `30`) y `bank.json`.
3. Registra el módulo en `manifest.json → modules[]` con `position` sin huecos.
4. Registra el módulo en el loader web (`apps/web/src/lib/content.ts` → `MODULES` y `BANKS`).
5. Publica incrementando `content_version`.

> [!NOTE]
> El paso 4 es una limitación conocida: el frontend importa cada módulo de forma estática. Sin él, el módulo existe en disco pero no se sirve.

---

## 11. Validaciones

| # | Validación | Severidad | En schema |
|---|---|---|---|
| V-Q01 | Campos requeridos del sobre presentes (`id`, `type`, `prompt`, `explanation`) | Bloqueante | Sí |
| V-Q02 | `type` ∈ catálogo §4 | Bloqueante | Sí |
| V-Q03 | Exactamente N respuestas correctas, vía `answers[].is_correct` **o** `correct_answer_ids` | Bloqueante | Sí |
| V-Q04 | `answers` dentro del rango del tipo | Bloqueante | Sí |
| V-Q05 | `prompt` 10–2000, `explanation` 20–2000 | Bloqueante | Sí |
| V-Q06 | `position` (si existe) sin huecos ni duplicados | Bloqueante | Semántica |
| V-Q07 | `fill_blank` recomienda `aliases` y `case_sensitive` | Aviso | No |
| V-Q08 | `order_lines` con permutación única de `correct_order` | Bloqueante | Parcial |
| V-Q09 | Sin "todas/ninguna" en opciones | Bloqueante | No |
| V-Q10 | Banco cumple cuota y B_min | Bloqueante al publicar | No |

### 11.1 Conformidad verificada

Validación ejecutada con `ajv` (draft 2020-12) sobre el repo completo a fecha `2026-10-15`:

| Artefacto | Resultado |
|---|---|
| `content/**/bank.json` | **32/32** válidos (formas array y `{module_code, questions}`) |
| `content/**/module.json` | **34/34** válidos |
| Pruebas negativas (sin `answers`, tipo desconocido, 2 correctas en `single_choice`, 3 opciones en `true_false`, `order_lines` sin `correct_order`) | Rechazadas correctamente |

El schema está en `content/schemas/question.schema.json` (raíz = `#/$defs/question`; contenedores expuestos como `#/$defs/bankArray`, `#/$defs/bank`, `#/$defs/module`, `#/$defs/graph`).

---

## 12. Trazabilidad

| Elemento | `23` | `24` | `15` | `30` |
|---|---|---|---|---|
| Sobre de pregunta §3 | §4.6–4.7 | §7.1 | §3.2 | — |
| Catálogo de tipos §4 | §4.6.1 | §7.2 | §3.1 | — |
| Orden §6 | §4.7 | §7.4 | §13.1 | §2 |
| Composición y B_min §8 | §8 | §12.3 | §5 | — |
| Normalización §9 | §5 | §11.4 | — | — |
| Coordenadas — | — | — | — | §3–4 |

---

*Fin de `29_QUESTION_JSON_CONTRACT.md`. Cambios en el contrato de pregunta requieren actualizar `content/schemas/question.schema.json`, `23`, `24`, `15` y el `CHANGELOG.md` con fecha `America/Bogota`.*
