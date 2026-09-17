-- ==============================================================================
-- KODA — TABLAS DEL ROADMAP VISUAL EN GRAFO (courses / lessons / edges)
-- Migración: 20260915000002_add_roadmap_graph_tables.sql
-- Motivo:
--   apps/web (StudentRoadmapView, roadmap.store, roadmap.service) ya consume
--   GET /api/v1/roadmap/:lang/courses, GET /api/v1/roadmap/courses/:id/lessons
--   y POST /api/v1/roadmap/seed con un contrato de grafo (nodos con x/y y
--   curvas SVG) que no tenía tabla propia en ningún lado — ni en Postgres ni
--   en MongoDB. Estas tablas son la fuente de verdad para ese contrato.
--   No reemplazan el contenido pedagógico (tracks/courses/lessons de Mongo);
--   son puramente la capa de presentación visual del árbol de progreso.
-- ==============================================================================

CREATE TABLE roadmap_sectors (
  scope_type VARCHAR(10) NOT NULL CHECK (scope_type IN ('courses', 'lessons')),
  scope_id VARCHAR(80) NOT NULL,
  sector_title VARCHAR(150) NOT NULL,
  progress_percent SMALLINT NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (scope_type, scope_id)
);

CREATE TABLE roadmap_courses (
  id VARCHAR(80) PRIMARY KEY,
  language_slug VARCHAR(50) NOT NULL,
  code VARCHAR(10) NOT NULL,
  label VARCHAR(150) NOT NULL,
  subtitle VARCHAR(200),
  status_text VARCHAR(150),
  x NUMERIC(8,2) NOT NULL,
  y NUMERIC(8,2) NOT NULL,
  variant VARCHAR(20) NOT NULL CHECK (variant IN ('completed', 'active', 'unlocked', 'locked', 'boss', 'bonus', 'branch')),
  icon_type VARCHAR(30) NOT NULL,
  stars SMALLINT DEFAULT 0,
  max_stars SMALLINT DEFAULT 0,
  xp_reward INT NOT NULL DEFAULT 0,
  target_course_id VARCHAR(80),
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  sort_order SMALLINT NOT NULL DEFAULT 100,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_roadmap_courses_lang ON roadmap_courses (language_slug, sort_order) WHERE is_published = true;

CREATE TABLE roadmap_lessons (
  id VARCHAR(80) PRIMARY KEY,
  course_id VARCHAR(80) NOT NULL,
  code VARCHAR(10) NOT NULL,
  label VARCHAR(150) NOT NULL,
  subtitle VARCHAR(200),
  status_text VARCHAR(150),
  x NUMERIC(8,2) NOT NULL,
  y NUMERIC(8,2) NOT NULL,
  variant VARCHAR(20) NOT NULL CHECK (variant IN ('completed', 'active', 'unlocked', 'locked', 'boss', 'bonus', 'branch')),
  icon_type VARCHAR(30) NOT NULL,
  stars SMALLINT DEFAULT 0,
  max_stars SMALLINT DEFAULT 0,
  xp_reward INT NOT NULL DEFAULT 0,
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  sort_order SMALLINT NOT NULL DEFAULT 100,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_roadmap_lessons_course ON roadmap_lessons (course_id, sort_order) WHERE is_published = true;

CREATE TABLE roadmap_graph_edges (
  id VARCHAR(120) PRIMARY KEY,
  scope_type VARCHAR(10) NOT NULL CHECK (scope_type IN ('courses', 'lessons')),
  scope_id VARCHAR(80) NOT NULL,
  from_node_id VARCHAR(80) NOT NULL,
  to_node_id VARCHAR(80) NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#38BDF8',
  path_d TEXT NOT NULL,
  is_dashed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_roadmap_edges_scope ON roadmap_graph_edges (scope_type, scope_id);

CREATE TRIGGER trg_roadmap_courses_updated_at BEFORE UPDATE ON roadmap_courses FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_roadmap_lessons_updated_at BEFORE UPDATE ON roadmap_lessons FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();

-- Lectura pública (contenido de catálogo, no datos de usuario); escritura solo vía backend con service_role.
ALTER TABLE roadmap_sectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for roadmap sectors" ON roadmap_sectors FOR SELECT USING (true);

ALTER TABLE roadmap_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for published roadmap courses" ON roadmap_courses FOR SELECT USING (is_published = true);

ALTER TABLE roadmap_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for published roadmap lessons" ON roadmap_lessons FOR SELECT USING (is_published = true);

ALTER TABLE roadmap_graph_edges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for roadmap graph edges" ON roadmap_graph_edges FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- SEMILLA: dataset canónico que hoy vive hardcodeado en apps/web como mock
-- (python-courses-graph.mock.ts y python-lessons-graph.mock.ts), para que el
-- roadmap real funcione end-to-end sin depender de POST /roadmap/seed.
-- ------------------------------------------------------------------------------

INSERT INTO roadmap_sectors (scope_type, scope_id, sector_title, progress_percent) VALUES
  ('courses', 'python', 'PYTHON TRACK OVERVIEW', 24),
  ('lessons', 'py-basic', 'PYTHON BÁSICO', 62)
ON CONFLICT (scope_type, scope_id) DO UPDATE SET
  sector_title = EXCLUDED.sector_title,
  progress_percent = EXCLUDED.progress_percent,
  updated_at = now();

INSERT INTO roadmap_courses (id, language_slug, code, label, subtitle, status_text, x, y, variant, icon_type, stars, max_stars, xp_reward, target_course_id, is_unlocked, sort_order) VALUES
  ('py-course-basic', 'python', '01', 'PYTHON BÁSICO', 'FUNDAMENTOS & SINTAXIS', 'ACTIVO • EN PROGRESO', 140, 290, 'active', 'brackets', 8, 15, 115, 'py-basic', true, 1),
  ('py-course-intermediate', 'python', '02', 'PYTHON INTERMEDIO', 'POO & ESTRUCTURAS', 'RQ BÁSICO', 370, 290, 'locked', 'lock', 0, 12, 135, 'py-intermediate', false, 2),
  ('py-course-advanced', 'python', '03', 'PYTHON AVANZADO', 'ASYNCIO & CONCURRENCIA', 'RQ INTERMEDIO', 600, 290, 'locked', 'lock', 0, 9, 140, 'py-advanced', false, 3),
  ('py-fw-fastapi', 'python', 'F1', 'FASTAPI ASYNC', 'MICROSERVICIOS REST', 'RQ AVANZADO', 820, 150, 'branch', 'lock', 0, 9, 150, 'py-fw-fastapi', false, 4),
  ('py-fw-django', 'python', 'F2', 'DJANGO & FLASK', 'FULL-STACK & ORM', 'RQ AVANZADO', 820, 430, 'branch', 'lock', 0, 18, 180, 'py-fw-django', false, 5),
  ('py-course-boss', 'python', 'Ω', 'APEX MASTER GATE', 'PROYECTO INTEGRAL PYTHON', 'DESAFÍO FINAL • 3 FASES', 1020, 290, 'boss', 'skull', NULL, NULL, 500, NULL, false, 6)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label, subtitle = EXCLUDED.subtitle, status_text = EXCLUDED.status_text,
  x = EXCLUDED.x, y = EXCLUDED.y, variant = EXCLUDED.variant, icon_type = EXCLUDED.icon_type,
  stars = EXCLUDED.stars, max_stars = EXCLUDED.max_stars, xp_reward = EXCLUDED.xp_reward,
  target_course_id = EXCLUDED.target_course_id, is_unlocked = EXCLUDED.is_unlocked,
  sort_order = EXCLUDED.sort_order, updated_at = now();

INSERT INTO roadmap_graph_edges (id, scope_type, scope_id, from_node_id, to_node_id, color, path_d, is_dashed) VALUES
  ('c-b-to-i', 'courses', 'python', 'py-course-basic', 'py-course-intermediate', '#38BDF8', 'M 140 290 C 220 290, 290 290, 370 290', false),
  ('c-i-to-a', 'courses', 'python', 'py-course-intermediate', 'py-course-advanced', '#64748B', 'M 370 290 C 450 290, 520 290, 600 290', true),
  ('c-a-to-fastapi', 'courses', 'python', 'py-course-advanced', 'py-fw-fastapi', '#A855F7', 'M 600 290 C 670 290, 720 150, 820 150', true),
  ('c-a-to-django', 'courses', 'python', 'py-course-advanced', 'py-fw-django', '#10B981', 'M 600 290 C 670 290, 720 430, 820 430', true),
  ('c-a-to-boss', 'courses', 'python', 'py-course-advanced', 'py-course-boss', '#475569', 'M 600 290 L 1020 290', true),
  ('c-fastapi-to-boss', 'courses', 'python', 'py-fw-fastapi', 'py-course-boss', '#A855F7', 'M 820 150 C 900 150, 950 250, 1020 290', true),
  ('c-django-to-boss', 'courses', 'python', 'py-fw-django', 'py-course-boss', '#10B981', 'M 820 430 C 900 430, 950 330, 1020 290', true)
ON CONFLICT (id) DO UPDATE SET color = EXCLUDED.color, path_d = EXCLUDED.path_d, is_dashed = EXCLUDED.is_dashed;

INSERT INTO roadmap_lessons (id, course_id, code, label, subtitle, status_text, x, y, variant, icon_type, stars, max_stars, xp_reward, is_unlocked, sort_order) VALUES
  ('les-01', 'py-basic', '01', 'SYNTAX GENESIS', 'VARIABLES & TIPOS', 'DOMINADO • +200 XP', 130, 340, 'completed', 'brackets', 3, 3, 200, true, 1),
  ('les-02', 'py-basic', '02', 'SCOPE MATRIX', 'OPERADORES & LOGICA', 'DOMINADO • +250 XP', 270, 240, 'completed', 'flow', 3, 3, 250, true, 2),
  ('les-03', 'py-basic', '03', 'CLOSURE CORE', 'CONDICIONALES IF/ELSE', 'DOMINADO • +300 XP', 410, 370, 'completed', 'atom', 2, 3, 300, true, 3),
  ('les-04', 'py-basic', '04', 'CONTROL FLOW', 'BUCLES FOR & WHILE', 'EN PROGRESO • +250 XP', 570, 300, 'active', 'matrix', 0, 3, 250, true, 4),
  ('les-05a', 'py-basic', '05A', 'MODULAR MATRIX', 'FUNCIONES & PARAMETROS', 'RQ PASO 4', 740, 190, 'locked', 'lock', NULL, NULL, 350, false, 5),
  ('les-05b', 'py-basic', '05B', 'MEMORY & DICTS', 'ESTRUCTURAS BÁSICAS', 'DISPONIBLE • +350 XP', 750, 410, 'unlocked', 'code', NULL, NULL, 350, true, 6),
  ('les-bonus', 'py-basic', '★', 'BONUS LOOT CHEST', 'RETO ALGORÍTMICO', '+150 XP & CYBER THEME', 750, 530, 'bonus', 'chest', NULL, NULL, 150, true, 7),
  ('les-boss', 'py-basic', 'Ω', 'APEX BOSS GATE', 'DESAFÍO FINAL DE SECTOR', 'PRUEBA FINAL • 3 FASES', 960, 260, 'boss', 'skull', NULL, NULL, 450, false, 8)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label, subtitle = EXCLUDED.subtitle, status_text = EXCLUDED.status_text,
  x = EXCLUDED.x, y = EXCLUDED.y, variant = EXCLUDED.variant, icon_type = EXCLUDED.icon_type,
  stars = EXCLUDED.stars, max_stars = EXCLUDED.max_stars, xp_reward = EXCLUDED.xp_reward,
  is_unlocked = EXCLUDED.is_unlocked, sort_order = EXCLUDED.sort_order, updated_at = now();

INSERT INTO roadmap_graph_edges (id, scope_type, scope_id, from_node_id, to_node_id, color, path_d, is_dashed) VALUES
  ('c-01-02', 'lessons', 'py-basic', 'les-01', 'les-02', '#38BDF8', 'M 130 340 C 180 340, 210 240, 270 240', false),
  ('c-02-03', 'lessons', 'py-basic', 'les-02', 'les-03', '#38BDF8', 'M 270 240 C 330 240, 350 370, 410 370', false),
  ('c-03-04', 'lessons', 'py-basic', 'les-03', 'les-04', '#F97316', 'M 410 370 C 470 370, 500 300, 570 300', false),
  ('c-04-05a', 'lessons', 'py-basic', 'les-04', 'les-05a', '#A855F7', 'M 570 300 C 640 300, 680 190, 740 190', false),
  ('c-04-05b', 'lessons', 'py-basic', 'les-04', 'les-05b', '#10B981', 'M 570 300 C 640 300, 680 410, 750 410', false),
  ('c-05b-bonus', 'lessons', 'py-basic', 'les-05b', 'les-bonus', '#F59E0B', 'M 750 410 L 750 530', false),
  ('c-05a-boss', 'lessons', 'py-basic', 'les-05a', 'les-boss', '#A855F7', 'M 740 190 C 820 190, 880 260, 960 260', true),
  ('c-05b-boss', 'lessons', 'py-basic', 'les-05b', 'les-boss', '#10B981', 'M 750 410 C 820 410, 880 260, 960 260', true)
ON CONFLICT (id) DO UPDATE SET color = EXCLUDED.color, path_d = EXCLUDED.path_d, is_dashed = EXCLUDED.is_dashed;
