-- ==============================================================================
-- KODA PLATFORM — OFFICIAL DATABASE SCHEMA MIGRATION (SUPABASE POSTGRESQL 15+)
-- Version: 20260914000000_initial_schema.sql
-- Conforms to: ADR-001..ADR-011, 12_DATABASE_DESIGN.md v3.2.0
-- Architecture: Hybrid Polyglot Persistence (PostgreSQL Transaccional con RLS)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONES DEL SISTEMA
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 2. FUNCIÓN DE UTILIDAD: UPDATED_AT AUTOMÁTICO
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 3. TABLA: USERS (Cuentas de Acceso y Autenticación Central)
-- ------------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'blocked', 'pending_verification', 'deleted')),
  role VARCHAR(20) NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin', 'moderator')),
  is_premium BOOLEAN NOT NULL DEFAULT false,
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_users_email_lower CHECK (email = LOWER(email)),
  CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
CREATE UNIQUE INDEX uq_users_email ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status_role ON users (status, role);

-- ------------------------------------------------------------------------------
-- 4. TABLA: USER_PROFILES (Perfil, Preferencias Pedagógicas de Onboarding, Rachas y Tiempo)
-- ------------------------------------------------------------------------------
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(80) NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 80),
  avatar_url VARCHAR(512) CHECK (avatar_url IS NULL OR avatar_url ~* '^https?://'),
  avatar_object_key VARCHAR(512),
  document_number VARCHAR(50) CHECK (document_number IS NULL OR char_length(document_number) BETWEEN 5 AND 50),
  document_type VARCHAR(20) CHECK (document_type IS NULL OR document_type IN ('CC', 'TI', 'CE', 'PASSPORT')),
  bio VARCHAR(500),
  timezone VARCHAR(50) NOT NULL DEFAULT 'America/Bogota',
  locale VARCHAR(10) NOT NULL DEFAULT 'es-CO',

  -- Preferencias pedagógicas configuradas en el registro del frontend (apps/web)
  initial_language_slug VARCHAR(50) NOT NULL DEFAULT 'python',
  experience_level VARCHAR(30) NOT NULL DEFAULT 'beginner'
    CHECK (experience_level IN ('beginner', 'elementary', 'intermediate', 'advanced')),
  learning_style VARCHAR(30) NOT NULL DEFAULT 'hands-on'
    CHECK (learning_style IN ('hands-on', 'guided', 'projects', 'gamified')),
  daily_goal_id VARCHAR(20) NOT NULL DEFAULT 'regular'
    CHECK (daily_goal_id IN ('casual', 'regular', 'focused', 'intense')),
  daily_goal_minutes SMALLINT NOT NULL DEFAULT 10
    CHECK (daily_goal_minutes BETWEEN 5 AND 120),

  -- Contadores agregados O(1) de gamificación, racha y tiempo de estudio
  total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level >= 1),
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  streak_freeze_count SMALLINT NOT NULL DEFAULT 1 CHECK (streak_freeze_count BETWEEN 0 AND 5),
  total_study_time_seconds INTEGER NOT NULL DEFAULT 0 CHECK (total_study_time_seconds >= 0),
  last_study_date DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_profiles_user_id UNIQUE (user_id)
);
CREATE INDEX idx_user_profiles_streak ON user_profiles (current_streak DESC);
CREATE INDEX idx_user_profiles_xp ON user_profiles (total_xp DESC);
CREATE INDEX idx_user_profiles_study_time ON user_profiles (total_study_time_seconds DESC);
CREATE INDEX idx_user_profiles_display_name ON user_profiles USING gin (display_name gin_trgm_ops);

-- ------------------------------------------------------------------------------
-- 5. TABLA: PROGRAMMING_LANGUAGES (Catálogo Extensible de Tecnologías)
-- ------------------------------------------------------------------------------
CREATE TABLE programming_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL CHECK (code ~ '^[A-Z0-9_]+$'),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  status VARCHAR(20) NOT NULL DEFAULT 'coming_soon'
    CHECK (status IN ('available', 'coming_soon', 'hidden')),
  sort_order SMALLINT NOT NULL DEFAULT 100,
  content_version INT NOT NULL DEFAULT 1,
  icon_url VARCHAR(512),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX uq_pl_code ON programming_languages (code);
CREATE UNIQUE INDEX uq_pl_slug ON programming_languages (slug);

-- ------------------------------------------------------------------------------
-- 6. TABLA: USER_BRANCH_ENROLLMENT (Inscripción en Ramas Profesionales)
-- ------------------------------------------------------------------------------
CREATE TABLE user_branch_enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_slug VARCHAR(80) NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (progress_percentage BETWEEN 0.00 AND 100.00),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_branch_enrollment UNIQUE (user_id, track_slug)
);
CREATE INDEX idx_user_branch_user ON user_branch_enrollment (user_id, is_active);

-- ------------------------------------------------------------------------------
-- 7. TABLA: USER_MODULE_PROGRESS (Estado de Módulos, Candados y Desbloqueos)
-- ------------------------------------------------------------------------------
CREATE TABLE user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_slug VARCHAR(80) NOT NULL,
  course_slug VARCHAR(80) NOT NULL,
  module_slug VARCHAR(80) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'locked'
    CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed', 'mastered')),
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,
  sections_total SMALLINT NOT NULL DEFAULT 10 CHECK (sections_total > 0),
  sections_completed SMALLINT NOT NULL DEFAULT 0,
  stars_total_possible SMALLINT NOT NULL DEFAULT 30 CHECK (stars_total_possible > 0),
  stars_earned SMALLINT NOT NULL DEFAULT 0,
  stars_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (stars_percentage BETWEEN 0.00 AND 100.00),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_module_progress UNIQUE (user_id, course_slug, module_slug),
  CONSTRAINT chk_sections_completed CHECK (sections_completed BETWEEN 0 AND sections_total),
  CONSTRAINT chk_stars_earned CHECK (stars_earned BETWEEN 0 AND stars_total_possible)
);
CREATE INDEX idx_user_module_progress_user_track ON user_module_progress (user_id, track_slug, status);
CREATE INDEX idx_user_module_progress_stars ON user_module_progress (user_id, stars_percentage);

-- ------------------------------------------------------------------------------
-- 8. TABLA: USER_SECTION_STARS (Historial de 1 a 3 Estrellas por Sección)
-- ------------------------------------------------------------------------------
CREATE TABLE user_section_stars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug VARCHAR(80) NOT NULL,
  module_slug VARCHAR(80) NOT NULL,
  section_slug VARCHAR(80) NOT NULL,
  max_stars_earned SMALLINT NOT NULL DEFAULT 0 CHECK (max_stars_earned BETWEEN 1 AND 3),
  first_earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  attempts_count INT NOT NULL DEFAULT 1 CHECK (attempts_count > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_section_stars UNIQUE (user_id, course_slug, module_slug, section_slug)
);
CREATE INDEX idx_user_section_stars_lookup ON user_section_stars (user_id, course_slug, module_slug);

-- ------------------------------------------------------------------------------
-- 9. TABLA: ATTEMPTS (Intentos de Lección, Consola y Quizzes)
-- ------------------------------------------------------------------------------
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section_slug VARCHAR(80) NOT NULL,
  lesson_id VARCHAR(64),
  mode VARCHAR(30) NOT NULL DEFAULT 'standard'
    CHECK (mode IN ('standard', 'review', 'mistakes_notebook', 'exam', 'diagnostic')),
  is_passed BOOLEAN NOT NULL DEFAULT false,
  score NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (score BETWEEN 0.00 AND 100.00),
  stars_awarded SMALLINT NOT NULL DEFAULT 0 CHECK (stars_awarded BETWEEN 0 AND 3),
  xp_awarded INT NOT NULL DEFAULT 0 CHECK (xp_awarded >= 0),
  time_spent_seconds INT NOT NULL DEFAULT 0 CHECK (time_spent_seconds >= 0),
  answers_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
  idempotency_key VARCHAR(128),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_attempts_user_section ON attempts (user_id, section_slug, created_at DESC);
CREATE UNIQUE INDEX uq_attempts_idempotency ON attempts (user_id, idempotency_key) WHERE idempotency_key IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 10. TABLA: ATTEMPT_ANSWERS (Detalle Granular de Respuestas por Reactivo)
-- ------------------------------------------------------------------------------
CREATE TABLE attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id VARCHAR(64) NOT NULL,
  question_version INT NOT NULL DEFAULT 1,
  given_answer JSONB NOT NULL,
  is_correct BOOLEAN NOT NULL,
  execution_time_ms INT CHECK (execution_time_ms >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_attempt_answers_attempt ON attempt_answers (attempt_id);

-- ------------------------------------------------------------------------------
-- 11. TABLA: REVIEW_QUEUE_ITEMS (Cola de Repaso Intra-Sección para Fallos)
-- ------------------------------------------------------------------------------
CREATE TABLE review_queue_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section_slug VARCHAR(80) NOT NULL,
  question_id VARCHAR(64) NOT NULL,
  question_version INT NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'passed', 'failed')),
  review_round SMALLINT NOT NULL DEFAULT 1 CHECK (review_round > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_review_queue_item UNIQUE (attempt_id, question_id, review_round)
);
CREATE INDEX idx_review_queue_attempt_status ON review_queue_items (attempt_id, status);

-- ------------------------------------------------------------------------------
-- 12. TABLA: USER_MISTAKES_NOTEBOOK (Cuaderno de Errores con Algoritmo SM-2)
-- ------------------------------------------------------------------------------
CREATE TABLE user_mistakes_notebook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_slug VARCHAR(80) NOT NULL,
  course_slug VARCHAR(80) NOT NULL,
  module_slug VARCHAR(80) NOT NULL,
  section_slug VARCHAR(80),
  lesson_id VARCHAR(64),
  question_id VARCHAR(64) NOT NULL,
  question_version INT NOT NULL DEFAULT 1,
  fail_count INT NOT NULL DEFAULT 1 CHECK (fail_count > 0),
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  -- Parámetros del Algoritmo SuperMemo SM-2 (ADR-011)
  interval_days INT NOT NULL DEFAULT 1 CHECK (interval_days >= 1),
  ease_factor NUMERIC(4,2) NOT NULL DEFAULT 2.50 CHECK (ease_factor >= 1.30),
  repetition_count INT NOT NULL DEFAULT 0 CHECK (repetition_count >= 0),
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_failed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_failed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_in_attempt_id UUID REFERENCES attempts(id),
  xp_recovered INT NOT NULL DEFAULT 0 CHECK (xp_recovered >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_mistakes_user_question UNIQUE (user_id, question_id)
);
CREATE INDEX idx_user_mistakes_unresolved ON user_mistakes_notebook (user_id, course_slug, last_failed_at DESC) WHERE is_resolved = false;
CREATE INDEX idx_user_mistakes_sm2_review ON user_mistakes_notebook (user_id, next_review_at) WHERE is_resolved = false;

-- ------------------------------------------------------------------------------
-- 13. TABLA: STREAKS (Historial Diario de Actividad, Hábitos y Cumplimiento de Metas)
-- ------------------------------------------------------------------------------
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  timezone VARCHAR(50) NOT NULL DEFAULT 'America/Bogota',
  activity_count INTEGER NOT NULL DEFAULT 1 CHECK (activity_count > 0),
  study_time_seconds INTEGER NOT NULL DEFAULT 0 CHECK (study_time_seconds >= 0),
  lessons_completed_count INTEGER NOT NULL DEFAULT 0 CHECK (lessons_completed_count >= 0),
  xp_earned_today INTEGER NOT NULL DEFAULT 0 CHECK (xp_earned_today >= 0),
  daily_goal_met BOOLEAN NOT NULL DEFAULT false,
  freeze_used BOOLEAN NOT NULL DEFAULT false,
  first_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_streaks_user_date UNIQUE (user_id, activity_date),
  CONSTRAINT chk_streaks_activity_order CHECK (last_activity_at >= first_activity_at)
);
CREATE INDEX idx_streaks_user_date_desc ON streaks (user_id, activity_date DESC);
CREATE INDEX idx_streaks_date ON streaks (activity_date);
CREATE INDEX idx_streaks_goal_met ON streaks (user_id, daily_goal_met) WHERE daily_goal_met = true;

-- ------------------------------------------------------------------------------
-- 14. TABLA: XP_TRANSACTIONS (Ledger Inmutable de Puntos de Experiencia)
-- ------------------------------------------------------------------------------
CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL CHECK (amount > 0),
  balance_after INT NOT NULL CHECK (balance_after >= amount),
  reason VARCHAR(50) NOT NULL
    CHECK (reason IN ('lesson_completed', 'section_star_bonus', 'mistake_remediated', 'exam_passed', 'streak_bonus', 'achievement_unlocked')),
  reference_id VARCHAR(128),
  reference_type VARCHAR(50),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_xp_user_idempotency ON xp_transactions (user_id, idempotency_key);
CREATE INDEX idx_xp_user_created ON xp_transactions (user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 15. TABLA: ACHIEVEMENTS Y USER_ACHIEVEMENTS (Medallas y Logros)
-- ------------------------------------------------------------------------------
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(300) NOT NULL,
  icon_name VARCHAR(100) NOT NULL,
  xp_reward INT NOT NULL DEFAULT 50 CHECK (xp_reward >= 0),
  category VARCHAR(50) NOT NULL DEFAULT 'milestone'
    CHECK (category IN ('streak', 'xp', 'curriculum', 'mastery', 'speed')),
  condition_type VARCHAR(50) NOT NULL,
  condition_value INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_achievement UNIQUE (user_id, achievement_id)
);
CREATE INDEX idx_user_achievements_user ON user_achievements (user_id, unlocked_at DESC);

-- ------------------------------------------------------------------------------
-- 16. TABLA: CERTIFICATES (Diplomas Oficiales Verificables con QR y SHA-256)
-- ------------------------------------------------------------------------------
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_slug VARCHAR(50) NOT NULL,
  track_slug VARCHAR(80) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'valid'
    CHECK (status IN ('valid', 'revoked', 'obsolete')),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  holder_name VARCHAR(120) NOT NULL,
  holder_document_masked VARCHAR(50) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  qr_payload VARCHAR(512) NOT NULL,
  google_drive_file_id VARCHAR(128),
  pdf_sha256 VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_certificates_user ON certificates (user_id, status);
CREATE INDEX idx_certificates_code ON certificates (code);

-- ------------------------------------------------------------------------------
-- 17. TABLA: SUBSCRIPTIONS (Monetización y Estado Premium)
-- ------------------------------------------------------------------------------
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL DEFAULT 'premium_usd_1',
  status VARCHAR(30) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  provider VARCHAR(50) NOT NULL DEFAULT 'stripe',
  provider_subscription_id VARCHAR(128) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_subscriptions_user_status ON subscriptions (user_id, status);

-- ------------------------------------------------------------------------------
-- 18. TRIGGERS AUTOMATIZADOS: UPDATED_AT
-- ------------------------------------------------------------------------------
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_programming_languages_updated_at BEFORE UPDATE ON programming_languages FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_user_branch_enrollment_updated_at BEFORE UPDATE ON user_branch_enrollment FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_user_module_progress_updated_at BEFORE UPDATE ON user_module_progress FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_user_section_stars_updated_at BEFORE UPDATE ON user_section_stars FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_review_queue_items_updated_at BEFORE UPDATE ON review_queue_items FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_user_mistakes_notebook_updated_at BEFORE UPDATE ON user_mistakes_notebook FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();
CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION fn_trigger_set_updated_at();

-- ------------------------------------------------------------------------------
-- 19. TRIGGER: INMUTABILIDAD DEL LEDGER DE XP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_enforce_xp_immutability()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'El ledger xp_transactions es inmutable y no permite modificaciones ni eliminaciones.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_xp_immutability
BEFORE UPDATE OR DELETE ON xp_transactions
FOR EACH ROW EXECUTE FUNCTION fn_enforce_xp_immutability();

-- ------------------------------------------------------------------------------
-- 20. TRIGGER FUNCTION: ACTUALIZAR RACHAS Y TIEMPO DE ESTUDIO (fn_handle_user_study_activity)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_handle_user_study_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_tz VARCHAR(50);
  v_today DATE;
  v_daily_goal_min SMALLINT;
  v_time_spent INT;
  v_xp_awarded INT;
  v_is_passed BOOLEAN;
  v_last_date DATE;
  v_curr_streak INT;
  v_long_streak INT;
  v_freezes SMALLINT;
BEGIN
  SELECT timezone, daily_goal_minutes, last_study_date, current_streak, longest_streak, streak_freeze_count
  INTO v_tz, v_daily_goal_min, v_last_date, v_curr_streak, v_long_streak, v_freezes
  FROM user_profiles
  WHERE user_id = NEW.user_id;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  v_today := (NEW.completed_at AT TIME ZONE COALESCE(v_tz, 'America/Bogota'))::DATE;
  v_time_spent := COALESCE(NEW.time_spent_seconds, 0);
  v_xp_awarded := COALESCE(NEW.xp_awarded, 0);
  v_is_passed := COALESCE(NEW.is_passed, false);

  -- 1. Upsert en la tabla diaria de streaks
  INSERT INTO streaks (
    user_id, activity_date, timezone, activity_count, study_time_seconds,
    lessons_completed_count, xp_earned_today, daily_goal_met, first_activity_at, last_activity_at
  ) VALUES (
    NEW.user_id, v_today, v_tz, 1, v_time_spent,
    CASE WHEN v_is_passed THEN 1 ELSE 0 END,
    v_xp_awarded,
    (v_time_spent >= (v_daily_goal_min * 60)),
    NEW.completed_at, NEW.completed_at
  )
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    activity_count = streaks.activity_count + 1,
    study_time_seconds = streaks.study_time_seconds + v_time_spent,
    lessons_completed_count = streaks.lessons_completed_count + (CASE WHEN v_is_passed THEN 1 ELSE 0 END),
    xp_earned_today = streaks.xp_earned_today + v_xp_awarded,
    daily_goal_met = (streaks.study_time_seconds + v_time_spent >= (v_daily_goal_min * 60)),
    last_activity_at = NEW.completed_at,
    updated_at = now();

  -- 2. Actualizar contadores de racha en user_profiles
  IF v_last_date IS NULL THEN
    v_curr_streak := 1;
    v_long_streak := GREATEST(v_long_streak, 1);
  ELSIF v_last_date = v_today THEN
    NULL; -- Mismo día
  ELSIF v_last_date = v_today - 1 THEN
    v_curr_streak := v_curr_streak + 1;
    v_long_streak := GREATEST(v_long_streak, v_curr_streak);
    IF v_curr_streak % 7 = 0 AND v_freezes < 2 THEN
      v_freezes := v_freezes + 1;
    END IF;
  ELSE
    IF v_freezes > 0 AND v_last_date = v_today - 2 THEN
      v_freezes := v_freezes - 1;
      v_curr_streak := v_curr_streak + 1;
      v_long_streak := GREATEST(v_long_streak, v_curr_streak);
      UPDATE streaks SET freeze_used = true WHERE user_id = NEW.user_id AND activity_date = v_today - 1;
    ELSE
      v_curr_streak := 1;
    END IF;
  END IF;

  UPDATE user_profiles SET
    total_study_time_seconds = total_study_time_seconds + v_time_spent,
    total_xp = total_xp + v_xp_awarded,
    current_streak = v_curr_streak,
    longest_streak = v_long_streak,
    streak_freeze_count = v_freezes,
    last_study_date = v_today,
    updated_at = now()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_attempts_update_streak_and_study_time
AFTER INSERT OR UPDATE OF is_passed ON attempts
FOR EACH ROW
WHEN (NEW.completed_at IS NOT NULL)
EXECUTE FUNCTION fn_handle_user_study_activity();

-- ------------------------------------------------------------------------------
-- 21. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_branch_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_section_stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mistakes_notebook ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de aislamiento por usuario (auth.uid() = user_id)
CREATE POLICY "Users can view and edit own profile"
  ON user_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can access own progress"
  ON user_module_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can access own stars"
  ON user_section_stars FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can access own attempts"
  ON attempts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can access own mistakes notebook"
  ON user_mistakes_notebook FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can access own streaks"
  ON streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own xp transactions"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Catálogos públicos de solo lectura para todos los usuarios autenticados
ALTER TABLE programming_languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for programming languages"
  ON programming_languages FOR SELECT
  USING (is_active = true);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for achievements"
  ON achievements FOR SELECT
  USING (is_active = true);
