# Changelog - 19 de Octubre de 2026

## [19/10/2026] - Migración de Python a la estructura canónica de Lua

- **Lunes-19/10/2026-08:03** - Brandon Carranza : Migración de los **18 módulos**, **27 lecciones** y **46 preguntas de banco** de `content/languages/python/modules` a la estructura canónica de Lua:
  - Lecciones: `theory_markdown` → `explanation`; `code_example`/`expected_output`/`tip_markdown` → `examples[]`; `exercise` → `exercises[]`; `concept_id` derivado (`py-<módulo>-lNN`) e `is_required`/`status`/`content_version` normalizados.
  - Preguntas: `options`/`correct_option_id`/`hint` → `answers[]`/`correct_answer_ids`/`hints`; se añadieron `difficulty` (default `medium`), `category`, `concept_ids`, `score` y metadatos (`language_id`, `module_id`, `section_id`, `lesson_id` en ejercicios de lección).
  - Bancos: contenedor unificado a la forma v2 del contrato `{ module_code, module_slug, questions }`.
  - Se añadió el script reutilizable `documentation/scripts/migrate-python-to-lua-structure.js` (idempotente; flags `--dry-run`, `--out=<dir>` y `--bank-form=object|array`).
  - Validación con `jsonschema` (draft 2020-12) contra `content/schemas/question.schema.json`: **18/18** módulos y **16/16** bancos sin errores; verificación de no pérdida de contenido (0 prompts, respuestas, explicaciones ni ejemplos perdidos).
  - Pendientes derivados registrados en `TODO.md`: `concept_ids` de bancos sin alinear con lecciones, `12_proyecto_final` sin `bank.json` y `lua/03_operadores` aún en dialecto shorthand.
