# 📖 Contenido Pedagógico Declarativo Desacoplado — Koda 🦊

> Este directorio alberga todo el material educativo de Koda en formato puramente declarativo (JSON), desacoplado al 100% de la lógica de programación del motor (`RNF-006`).

---

## 📂 Estructura Jerárquica

```
content/
├── tracks.json                          # Catálogo de pistas profesionales (python, frontend, backend, devops)
├── visual-effects.json                  # Catálogo de presets de aristas GPU (laser_flow_fast, etc.)
├── courses.json                         # Nodos del grafo DAG con topología tier/lane
├── courses/                             # Estructura modular por curso
│   └── python-core/
│       ├── modules.json                 # 12 módulos de Python 3.12
│       ├── sections.json                # Secciones por módulo
│       ├── lessons.json                 # Micro-lecciones con Tríada Evaluativa completa
│       └── question-banks.json          # Bancos estratificados (easy, medium, hard)
└── languages/
    └── {slug}/                          # ej. python, lua (especificaciones legacy/adicionales)
        ├── manifest.json
        └── config/
```

> **Autocarga y Siembra Automática (`pnpm --filter api db:seed`):**
> Cualquier nuevo archivo JSON que añadas en `content/` o dentro de `content/courses/<nuevo-curso>/` con cursos, módulos, secciones, lecciones (Tríada Evaluativa) o bancos de preguntas es **auto-detectado e importado de forma idempotente (`upsert: true`)** a MongoDB tanto en local como al iniciar los contenedores de Docker.

---

## ✍️ Reglas para Creadores de Contenido

Toda lección y ejercicio añadido a este directorio debe apegarse estrictamente a:

1. [`documentation/03-pedagogia-contenido/23_CONTENT_SPECIFICATION.md`](../documentation/03-pedagogia-contenido/23_CONTENT_SPECIFICATION.md): Estructura técnica de esquemas y validaciones.
2. [`documentation/03-pedagogia-contenido/24_CONTENT_AUTHORING_GUIDE.md`](../documentation/03-pedagogia-contenido/24_CONTENT_AUTHORING_GUIDE.md): Guía pedagógica oficial.
   - **Longitud de lección:** 40 a 70 palabras en segunda persona (*"tú"*).
   - **Un concepto por lección:** Introducido con analogías cotidianas y evaluado inmediatamente.
   - **Feedback sin spoilers:** La pista inteligente orienta, pero jamás revela la respuesta correcta.

---

## 🔍 Cursos Disponibles

- **Python 3.12 (`languages/python/`):**
  - **Módulo 01:** *Fundamentos de Python* (`modules/01_fundamentos/`) — Lecciones atómicas con print(), textos, números y comentarios.
  - **Ruta Completa:** 12 módulos canónicos declarados en `manifest.json`.
- **Lua (`languages/lua/`):**
  - **Módulo 01:** *Fundamentos de Lua* (`modules/01_fundamentos/`) — 9 secciones x 10 lecciones (90) con chunks, print, comentarios y errores.
  - **Módulo 02:** *Variables y Tipos de Datos* (`modules/02_variables/`) — 10 secciones x 10 lecciones (100) con `local`, los 8 tipos, nil y proyecto RPG.
  - **Ruta Completa:** 12 módulos idiomáticos declarados en `manifest.json` (M03-M12 `coming_soon`). Metodología en `documentation/03-pedagogia-contenido/28_LUA_CURRICULUM.md`.
