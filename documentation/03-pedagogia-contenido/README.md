# 🧠 Dominio 3 — Pedagogía & Contenido

> **Modelos educativos, motor de aprendizaje, sistema de evaluación formativa, economía de gamificación y guías de autoría declarativa de Koda 🦊.**

---

## 📑 Documentos del Dominio

| Documento | Título | Propósito Principal |
|---|---|---|
| [**14_LEARNING_SYSTEM.md**](14_LEARNING_SYSTEM.md) | Sistema de Aprendizaje | Jerarquía Lenguaje $\to$ Módulo $\to$ Sección $\to$ Lección $\to$ Ejercicio, desbloqueo canónico y evaluación diagnóstica. |
| [**15_QUIZ_EXAM_SYSTEM.md**](15_QUIZ_EXAM_SYSTEM.md) | Sistema de Quizzes y Exámenes | Reglas de aprobación ($\ge 80\%$), bancos de preguntas, generación aleatoria sin repetición y reintentos. |
| [**16_GAMIFICATION.md**](16_GAMIFICATION.md) | Sistema de Gamificación | Economía determinista de XP, fórmula exponencial de niveles, rachas diarias, escudo freeze y catálogo de 18 logros. |
| [**23_CONTENT_SPECIFICATION.md**](23_CONTENT_SPECIFICATION.md) | Especificación Técnica de Contenido | Estructura declarativa de cursos en JSON/NoSQL, validaciones sintácticas/semánticas y JSON Schema. |
| [**24_CONTENT_AUTHORING_GUIDE.md**](24_CONTENT_AUTHORING_GUIDE.md) | Guía de Autoría de Contenido | Manual editorial para creadores: redacción atómica (40–70 palabras), taxonomía de distractores y feedback formativo. |
| [**29_QUESTION_JSON_CONTRACT.md**](29_QUESTION_JSON_CONTRACT.md) | Contrato JSON de Preguntas | Anatomía exacta de una pregunta (sobre + 11 tipos + payload), reglas de orden, composición quiz/examen y normalización de dialectos. Fuente de verdad: `content/schemas/question.schema.json`. |
| [**30_ROADMAP_STRUCTURE_AND_COORDINATES.md**](30_ROADMAP_STRUCTURE_AND_COORDINATES.md) | Estructura del Roadmap y Coordenadas | Orden pedagógico, barajado determinista, las 3 capas de coordenadas (`topology` → fórmula → curada) y la propuesta del bloque `graph` en `module.json`. |

---

## 🔗 Relación con Almacenamiento NoSQL (MongoDB)
De acuerdo con el [**ADR-009**](../adr/ADR-009-persistencia-hibrida-poliglota-mongodb-supabase.md), todo el contenido estructurado en este dominio (ramas, cursos, módulos, lecciones y bancos de preguntas) se almacena y consulta en **MongoDB** como documentos enriquecidos para garantizar entrega atómica $O(1)$ sin sobrecargar la base de datos relacional.
