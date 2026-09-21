-- ==============================================================================
-- KODA Platform - Baseline Migration: Core Learning, Courses & Gamification
-- Migration: V20260921_001__courses_and_learning_core.sql
-- Engine: PostgreSQL >= 15
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users (Identidad y autenticación)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'blocked', 'pending_verification', 'deleted')),
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_users_email_lower CHECK (email = LOWER(email)),
  CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email ON users (email) WHERE deleted_at IS NULL;

-- 2. Programming Languages (Catálogo tecnológico multi-lenguaje)
CREATE TABLE IF NOT EXISTS programming_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL CHECK (code ~ '^[A-Z0-9_]+$'),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  status VARCHAR(20) NOT NULL DEFAULT 'coming_soon'
    CHECK (status IN ('available', 'coming_soon', 'hidden')),
  sort_order SMALLINT NOT NULL DEFAULT 100,
  content_version INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_pl_code ON programming_languages (code);
CREATE UNIQUE INDEX IF NOT EXISTS uq_pl_slug ON programming_languages (slug);

-- 3. Courses (Cursos y tracks pedagógicos por lenguaje)
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_id UUID NOT NULL REFERENCES programming_languages(id) ON DELETE RESTRICT,
  code VARCHAR(50) NOT NULL CHECK (code ~ '^[A-Z0-9_]+$'),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT,
  level VARCHAR(30) NOT NULL DEFAULT 'all_levels'
    CHECK (level IN ('all_levels', 'beginner', 'intermediate', 'advanced')),
  status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'review', 'published', 'archived')),
  sort_order SMALLINT NOT NULL DEFAULT 100,
  total_modules SMALLINT NOT NULL DEFAULT 12 CHECK (total_modules > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_courses_code ON courses (code) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_courses_slug ON courses (slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_courses_lang_status ON courses (language_id, status, sort_order);

-- 4. Modules (Unidades temáticas canónicas)
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  language_id UUID NOT NULL REFERENCES programming_languages(id) ON DELETE RESTRICT,
  code VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  description TEXT,
  objective TEXT,
  position SMALLINT NOT NULL CHECK (position > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'archived')),
  content_version INT NOT NULL DEFAULT 1,
  total_sections SMALLINT NOT NULL DEFAULT 10 CHECK (total_sections > 0),
  total_lessons SMALLINT NOT NULL DEFAULT 100 CHECK (total_lessons > 0),
  min_stars_percentage SMALLINT NOT NULL DEFAULT 80 CHECK (min_stars_percentage BETWEEN 0 AND 100),
  quiz_threshold SMALLINT NOT NULL DEFAULT 70 CHECK (quiz_threshold BETWEEN 0 AND 100),
  exam_threshold SMALLINT NOT NULL DEFAULT 80 CHECK (exam_threshold BETWEEN 0 AND 100),
  xp_on_pass INT NOT NULL DEFAULT 150,
  prerequisite_module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT uq_modules_course_code UNIQUE (course_id, code),
  CONSTRAINT uq_modules_course_position UNIQUE (course_id, position)
);
CREATE INDEX IF NOT EXISTS idx_modules_course_pos ON modules (course_id, position) WHERE deleted_at IS NULL;

-- 5. Sections (Subdivisiones pedagógicas con candados secuenciales)
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  position SMALLINT NOT NULL CHECK (position > 0),
  type VARCHAR(20) NOT NULL DEFAULT 'theory'
    CHECK (type IN ('theory', 'example', 'exercise', 'quiz', 'review')),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  content_version INT NOT NULL DEFAULT 1,
  total_lessons SMALLINT NOT NULL DEFAULT 10 CHECK (total_lessons > 0),
  stars_available SMALLINT NOT NULL DEFAULT 3 CHECK (stars_available BETWEEN 1 AND 3),
  is_first_section BOOLEAN NOT NULL DEFAULT false,
  xp_on_complete INT NOT NULL DEFAULT 10,
  estimated_minutes SMALLINT CHECK (estimated_minutes BETWEEN 1 AND 120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT uq_sections_module_slug UNIQUE (module_id, slug),
  CONSTRAINT uq_sections_module_position UNIQUE (module_id, position)
);
CREATE INDEX IF NOT EXISTS idx_sections_module_pos ON sections (module_id, position);

-- 6. Lessons (Unidades atómicas de micro-aprendizaje)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  position SMALLINT NOT NULL CHECK (position > 0),
  body_mdx TEXT NOT NULL,
  example_code TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  content_version INT NOT NULL DEFAULT 1,
  is_required BOOLEAN NOT NULL DEFAULT true,
  xp_on_complete INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT uq_lessons_section_slug UNIQUE (section_id, slug),
  CONSTRAINT uq_lessons_section_position UNIQUE (section_id, position)
);
CREATE INDEX IF NOT EXISTS idx_lessons_section_pos ON lessons (section_id, position);

-- 7. Questions (Banco tipificado con PK simple y versiones inmutables)
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_uid UUID NOT NULL,
  version INT NOT NULL DEFAULT 1 CHECK (version > 0),
  language_id UUID NOT NULL REFERENCES programming_languages(id) ON DELETE RESTRICT,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  type VARCHAR(30) NOT NULL
    CHECK (type IN ('multiple_choice', 'true_false', 'fill_code', 'predict_output', 'find_error', 'order_lines', 'select_correct_code', 'match_concepts', 'write_code', 'small_problem')),
  difficulty VARCHAR(20) NOT NULL DEFAULT 'medium'
    CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category VARCHAR(50),
  prompt TEXT NOT NULL,
  prompt_code TEXT,
  explanation TEXT NOT NULL,
  score INT NOT NULL DEFAULT 10 CHECK (score > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  is_latest BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT uq_questions_uid_version UNIQUE (question_uid, version)
);
CREATE INDEX IF NOT EXISTS idx_questions_uid_latest ON questions (question_uid) WHERE is_latest = true;
CREATE INDEX IF NOT EXISTS idx_questions_lesson ON questions (lesson_id) WHERE lesson_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_questions_module_type ON questions (module_id, status, type);

-- 8. Answers (Opciones de respuesta)
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  label VARCHAR(10),
  body TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  position SMALLINT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_answers_question_pos UNIQUE (question_id, position)
);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers (question_id);

-- 9. Attempts (Ledger inmutable de ejecuciones e intentos)
CREATE TABLE IF NOT EXISTS attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  kind VARCHAR(20) NOT NULL
    CHECK (kind IN ('lesson_question', 'quiz', 'exam', 'diagnostic', 'review')),
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  content_version INT NOT NULL DEFAULT 1,
  threshold_applied SMALLINT CHECK (threshold_applied BETWEEN 0 AND 100),
  score INT NOT NULL DEFAULT 0 CHECK (score >= 0),
  max_score INT NOT NULL CHECK (max_score > 0),
  percent NUMERIC(5,2) NOT NULL CHECK (percent BETWEEN 0 AND 100),
  is_passed BOOLEAN NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'graded'
    CHECK (status IN ('in_progress', 'submitted', 'graded', 'invalidated')),
  idempotency_key VARCHAR(100) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_attempts_user_idempotency UNIQUE (user_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS idx_attempts_user_module ON attempts (user_id, module_id, kind, created_at DESC);

-- 10. Attempt Answers (Detalle de respuestas por intento)
CREATE TABLE IF NOT EXISTS attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  answer_id UUID REFERENCES answers(id) ON DELETE SET NULL,
  given_answer JSONB NOT NULL,
  is_correct BOOLEAN NOT NULL,
  score_awarded INT NOT NULL DEFAULT 0 CHECK (score_awarded >= 0),
  position SMALLINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_attempt_answers_unique UNIQUE (attempt_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt ON attempt_answers (attempt_id);

-- 11. User Section Stars (Calificación formativa 1–3 estrellas)
CREATE TABLE IF NOT EXISTS user_section_stars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  language_id UUID NOT NULL REFERENCES programming_languages(id) ON DELETE RESTRICT,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE RESTRICT,
  stars_earned SMALLINT NOT NULL CHECK (stars_earned BETWEEN 1 AND 3),
  max_stars_earned SMALLINT NOT NULL DEFAULT 1 CHECK (max_stars_earned BETWEEN 1 AND 3),
  first_attempt_errors INT NOT NULL DEFAULT 0 CHECK (first_attempt_errors >= 0),
  review_round_completed BOOLEAN NOT NULL DEFAULT true,
  attempts_count INT NOT NULL DEFAULT 1 CHECK (attempts_count > 0),
  is_completed BOOLEAN NOT NULL DEFAULT true,
  first_completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_section_stars UNIQUE (user_id, section_id),
  CONSTRAINT chk_max_stars CHECK (max_stars_earned >= stars_earned)
);
CREATE INDEX IF NOT EXISTS idx_user_section_stars_user_mod ON user_section_stars (user_id, module_id, stars_earned);

-- 12. User Module Progress (Candados y Maestría 80%⭐)
CREATE TABLE IF NOT EXISTS user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  language_id UUID NOT NULL REFERENCES programming_languages(id) ON DELETE RESTRICT,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'locked'
    CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed', 'mastered')),
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  sections_total SMALLINT NOT NULL DEFAULT 10 CHECK (sections_total > 0),
  sections_completed SMALLINT NOT NULL DEFAULT 0,
  stars_total_possible SMALLINT NOT NULL DEFAULT 30 CHECK (stars_total_possible > 0),
  stars_earned SMALLINT NOT NULL DEFAULT 0,
  stars_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (stars_percentage BETWEEN 0 AND 100),
  exam_passed BOOLEAN NOT NULL DEFAULT false,
  exam_score SMALLINT CHECK (exam_score BETWEEN 0 AND 100),
  unlocked_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_module_progress UNIQUE (user_id, module_id),
  CONSTRAINT chk_sections_completed CHECK (sections_completed BETWEEN 0 AND sections_total),
  CONSTRAINT chk_stars_earned CHECK (stars_earned BETWEEN 0 AND stars_total_possible)
);
CREATE INDEX IF NOT EXISTS idx_user_mod_progress_user_lang ON user_module_progress (user_id, language_id, status);
CREATE INDEX IF NOT EXISTS idx_user_mod_progress_stars ON user_module_progress (user_id, stars_percentage);

-- 13. User Mistakes Notebook (Cuaderno de Errores)
CREATE TABLE IF NOT EXISTS user_mistakes_notebook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  language_id UUID NOT NULL REFERENCES programming_languages(id) ON DELETE RESTRICT,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  fail_count INT NOT NULL DEFAULT 1 CHECK (fail_count > 0),
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  first_failed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_failed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_in_attempt_id UUID REFERENCES attempts(id) ON DELETE SET NULL,
  xp_recovered INT NOT NULL DEFAULT 0 CHECK (xp_recovered >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_mistakes_user_question UNIQUE (user_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_user_mistakes_unresolved ON user_mistakes_notebook (user_id, module_id, last_failed_at DESC) WHERE is_resolved = false;

-- 14. Review Queue Items (Cola de repaso activa)
CREATE TABLE IF NOT EXISTS review_queue_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE RESTRICT,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'passed', 'failed')),
  review_round SMALLINT NOT NULL DEFAULT 1 CHECK (review_round > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_review_queue_item UNIQUE (attempt_id, question_id, review_round)
);
CREATE INDEX IF NOT EXISTS idx_review_queue_attempt_status ON review_queue_items (attempt_id, status);

-- 15. Trigger Function: Recalcular estrellas de módulo y evaluar desbloqueo secuencial robusto
CREATE OR REPLACE FUNCTION fn_recalculate_module_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_module_id UUID;
  v_user_id UUID;
  v_language_id UUID;
  v_course_id UUID;
  v_total_stars INT;
  v_possible_stars INT;
  v_completed_count INT;
  v_total_sec INT;
  v_pct NUMERIC(5,2);
  v_current_pos INT;
  v_next_module_id UUID;
BEGIN
  v_module_id := NEW.module_id;
  v_user_id := NEW.user_id;
  v_language_id := NEW.language_id;

  SELECT total_sections, course_id, position 
  INTO v_total_sec, v_course_id, v_current_pos 
  FROM modules 
  WHERE id = v_module_id;

  v_possible_stars := COALESCE(v_total_sec * 3, 30);

  SELECT 
    COUNT(*), 
    COALESCE(SUM(max_stars_earned), 0)
  INTO v_completed_count, v_total_stars
  FROM user_section_stars
  WHERE user_id = v_user_id AND module_id = v_module_id;

  v_pct := ROUND((v_total_stars::numeric / NULLIF(v_possible_stars, 0)) * 100, 2);

  UPDATE user_module_progress
  SET 
    sections_completed = v_completed_count,
    stars_earned = v_total_stars,
    stars_percentage = v_pct,
    status = CASE 
      WHEN v_completed_count >= v_total_sec AND v_pct >= 80.00 THEN 'mastered'
      WHEN v_completed_count >= v_total_sec THEN 'completed'
      WHEN v_completed_count > 0 THEN 'in_progress'
      ELSE status
    END,
    completed_at = CASE WHEN v_completed_count >= v_total_sec AND completed_at IS NULL THEN now() ELSE completed_at END,
    mastered_at = CASE WHEN v_completed_count >= v_total_sec AND v_pct >= 80.00 AND mastered_at IS NULL THEN now() ELSE mastered_at END,
    updated_at = now()
  WHERE user_id = v_user_id AND module_id = v_module_id;

  -- Desbloquear el siguiente módulo si cumple 100% secciones y >= 80% de estrellas
  IF v_completed_count >= v_total_sec AND v_pct >= 80.00 THEN
    SELECT id INTO v_next_module_id
    FROM modules
    WHERE course_id = v_course_id
      AND position > v_current_pos
      AND deleted_at IS NULL
    ORDER BY position ASC
    LIMIT 1;

    IF v_next_module_id IS NOT NULL THEN
      UPDATE user_module_progress
      SET 
        is_unlocked = true,
        status = CASE WHEN status = 'locked' THEN 'unlocked' ELSE status END,
        unlocked_at = COALESCE(unlocked_at, now()),
        updated_at = now()
      WHERE user_id = v_user_id AND module_id = v_next_module_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_after_section_stars_upsert ON user_section_stars;
CREATE TRIGGER trg_after_section_stars_upsert
AFTER INSERT OR UPDATE OF max_stars_earned ON user_section_stars
FOR EACH ROW EXECUTE FUNCTION fn_recalculate_module_progress();
