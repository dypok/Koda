-- ==============================================================================
-- KODA — AGREGAR CAMPOS DE PRESENTACIÓN A PROGRAMMING_LANGUAGES Y SEMBRAR PYTHON
-- Migración: 20260915000000_add_display_fields_and_seed_languages.sql
-- Motivo:
--   El contrato compartido @koda/types (ProgrammingLanguage) exige `description`,
--   `color` y `total_modules`, pero la migración inicial (20260914000000) no los
--   define. Sin esto, LanguagesService no puede leer datos reales desde Supabase.
-- ==============================================================================

ALTER TABLE programming_languages
  ADD COLUMN IF NOT EXISTS description TEXT CHECK (description IS NULL OR char_length(description) <= 2000),
  ADD COLUMN IF NOT EXISTS color VARCHAR(7) NOT NULL DEFAULT '#38BDF8' CHECK (color ~* '^#[0-9A-Fa-f]{6}$'),
  ADD COLUMN IF NOT EXISTS total_modules SMALLINT NOT NULL DEFAULT 12 CHECK (total_modules > 0);

-- Semilla del lenguaje oficial de lanzamiento del MVP (ADR-005), alineada con
-- content/languages/python/manifest.json
INSERT INTO programming_languages (code, name, slug, description, status, sort_order, icon_url, color, total_modules, is_active)
VALUES (
  'PY',
  'Python 3.12',
  'python',
  'El lenguaje más popular del mundo para principiantes, desarrollo web, análisis de datos e inteligencia artificial.',
  'available',
  10,
  '/icons/python.svg',
  '#3776AB',
  12,
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  icon_url = EXCLUDED.icon_url,
  color = EXCLUDED.color,
  total_modules = EXCLUDED.total_modules,
  updated_at = now();
