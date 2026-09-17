# 📖 Contenido Pedagógico Declarativo Desacoplado — Koda 🦊

> Este directorio alberga todo el material educativo de Koda en formato puramente declarativo (JSON), desacoplado al 100% de la lógica de programación del motor (`RNF-006`).

---

## 📂 Estructura Jerárquica

```
content/
└── languages/
    └── {slug}/                          # ej. python, javascript, typescript
        ├── manifest.json                # Metadatos del curso, versión y lista de módulos
        ├── config/
        │   ├── thresholds.json          # Umbrales mínimos de aprobación (% quiz y examen)
        │   ├── xp.json                  # Economía de XP por sección, ejercicio y examen
        │   └── compositions.json        # Distribución de tipos de pregunta por evaluación
        └── modules/
            ├── 01_fundamentos/          # Directorio de módulo
            │   ├── module.json          # 10 secciones x 10 lecciones con teoría y código
            │   └── bank.json            # Banco de preguntas para quizzes y exámenes
            └── 02_variables/
                ├── module.json
                └── bank.json
```

---

## ✍️ Reglas para Creadores de Contenido

Toda lección y ejercicio añadido a este directorio debe apegarse estrictamente a:

1. [`docs/03-pedagogia-contenido/23_CONTENT_SPECIFICATION.md`](../docs/03-pedagogia-contenido/23_CONTENT_SPECIFICATION.md): Estructura técnica de esquemas y validaciones.
2. [`docs/03-pedagogia-contenido/24_CONTENT_AUTHORING_GUIDE.md`](../docs/03-pedagogia-contenido/24_CONTENT_AUTHORING_GUIDE.md): Guía pedagógica oficial.
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
  - **Ruta Completa:** 12 módulos idiomáticos declarados en `manifest.json` (M03-M12 `coming_soon`). Metodología en `docs/03-pedagogia-contenido/28_LUA_CURRICULUM.md`.
