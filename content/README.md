# 📖 Contenido Pedagógico Declarativo Desacoplado — Koda 🦊

> Este directorio alberga todo el material educativo de Koda en formato puramente declarativo (JSON), desacoplado al 100% de la lógica de programación del motor (`RNF-006`).

---

## 📂 Estructura Jerárquica Estandarizada

```
content/
├── tracks.json                          # Catálogo de pistas profesionales (python, frontend, backend, devops)
├── visual-effects.json                  # Catálogo de presets de aristas GPU (laser_flow_fast, etc.)
├── courses.json                         # Nodos del grafo DAG con topología tier/lane
├── schemas/
│   └── question.schema.json             # JSON Schema (draft 2020-12) del contrato de pregunta
├── courses/                             # Estructura modular por curso
│   └── python-core/
│       ├── modules.json                 # 12 módulos de Python 3.12
│       ├── sections.json                # Secciones por módulo
│       ├── lessons.json                 # Micro-lecciones con Tríada Evaluativa completa
│       └── question-banks.json          # Bancos estratificados (easy, medium, hard)
└── languages/
    └── {slug}/                          # ej. python, javascript, typescript, lua
        ├── manifest.json                # Metadatos del lenguaje, versión y lista de módulos
        ├── course.json                  # Descriptor del curso formativo asociado
        ├── config/
        │   ├── thresholds.json          # Umbrales mínimos de aprobación (% quiz y examen)
        │   ├── xp.json                  # Economía de XP por sección, ejercicio y examen
        │   └── compositions.json        # Distribución de tipos de pregunta por evaluación
        └── modules/
            ├── 01_fundamentos/          # Directorio de módulo
            │   ├── module.json          # Secciones x lecciones con teoría, código y ejercicios
            │   └── bank.json            # Banco de preguntas para quizzes y exámenes
            ├── 02_variables/
            │   ├── module.json
            │   └── bank.json
            └── ... (hasta 12 módulos canónicos)
```

> **Autocarga y Siembra Automática (`pnpm --filter api db:seed`):**
> Cualquier nuevo archivo JSON que añadas en `content/` o dentro de `content/courses/<nuevo-curso>/` con cursos, módulos, secciones, lecciones (Tríada Evaluativa) o bancos de preguntas es **auto-detectado e importado de forma idempotente (`upsert: true`)** a MongoDB tanto en local como al iniciar los contenedores de Docker.

---

## 🔍 Cursos Configurados en Plataforma

1. **Python 3.12 (`languages/python/`):**
   - **Curso:** *Python: Fundamentos a Avanzado* (`course.json`, estado: `published`)
   - **Ruta Completa:** 12 módulos canónicos estructurados con objetivos pedagógicos, secciones y lecciones interactivas.
2. **JavaScript Moderno (`languages/javascript/`):**
   - **Curso:** *JavaScript Moderno: Fundamentos a Avanzado* (`course.json`, estado: `coming_soon`)
   - **Módulo 01:** *Fundamentos de JavaScript* (variables let/const, console.log y tipos primitivos).
3. **TypeScript (`languages/typescript/`):**
   - **Curso:** *TypeScript: Tipado Estático y Desarrollo Robusto* (`course.json`, estado: `coming_soon`)
   - **Módulo 01:** *Fundamentos de TypeScript* (anotaciones de tipo, inferencia y compilación).
4. **Lua (`languages/lua/`):**
   - **Módulo 01:** *Fundamentos de Lua* (`modules/01_fundamentos/`) — 9 secciones x 10 lecciones con chunks, print y sintaxis.
   - **Módulo 02:** *Variables y Tipos de Datos* (`modules/02_variables/`) — 10 secciones x 10 lecciones con `local`, tipos y nil.

---

## ✍️ Reglas para Creadores de Contenido

Toda lección y ejercicio añadido a este directorio debe apegarse estrictamente a:

1. [`documentation/03-pedagogia-contenido/23_CONTENT_SPECIFICATION.md`](../documentation/03-pedagogia-contenido/23_CONTENT_SPECIFICATION.md): Estructura técnica de esquemas y validaciones.
2. [`documentation/03-pedagogia-contenido/24_CONTENT_AUTHORING_GUIDE.md`](../documentation/03-pedagogia-contenido/24_CONTENT_AUTHORING_GUIDE.md): Guía pedagógica oficial.
   - **Longitud de lección:** 40 a 70 palabras en segunda persona (*"tú"*).
   - **Un concepto por lección:** Introducido con analogías cotidianas y evaluado inmediatamente.
   - **Feedback sin spoilers:** La pista inteligente orienta, pero jamás revela la respuesta correcta.
3. [`documentation/03-pedagogia-contenido/29_QUESTION_JSON_CONTRACT.md`](../documentation/03-pedagogia-contenido/29_QUESTION_JSON_CONTRACT.md) + [`content/schemas/question.schema.json`](schemas/question.schema.json): **contrato de pregunta** (11 tipos, orden, composición quiz/examen y dialectos).
4. [`documentation/03-pedagogia-contenido/30_ROADMAP_STRUCTURE_AND_COORDINATES.md`](../documentation/03-pedagogia-contenido/30_ROADMAP_STRUCTURE_AND_COORDINATES.md): orden pedagógico y coordenadas del roadmap (bloque `graph`).

