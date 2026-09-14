-- ==============================================================================
-- KODA PLATFORM — CONSOLIDATE PUBLIC.USERS WITH AUTH.USERS (ZERO REDUNDANCY)
-- Migration: 20260914000001_consolidate_users_with_auth_users.sql
-- Conforms to: ADR-009, Supabase Auth Integration
-- ==============================================================================

-- 1. Eliminar la tabla redundante user_profiles si existe
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 2. Eliminar campos obsoletos/redundantes de public.users
ALTER TABLE public.users DROP COLUMN IF EXISTS password_hash;
ALTER TABLE public.users DROP COLUMN IF EXISTS email_verified_at;

-- 3. Vincular clave foránea estricta a auth.users(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_users_auth_id' AND table_name = 'users'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT fk_users_auth_id
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4. Agregar columnas de perfil, preferencias de onboarding, racha y estudio a public.users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS display_name VARCHAR(80) NOT NULL DEFAULT 'Estudiante Koda',
  ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(512) DEFAULT '/brand/koda-mascot-cartoon-2d.svg',
  ADD COLUMN IF NOT EXISTS avatar_object_key VARCHAR(512),
  ADD COLUMN IF NOT EXISTS document_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS document_type VARCHAR(20),
  ADD COLUMN IF NOT EXISTS bio VARCHAR(500),
  ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) NOT NULL DEFAULT 'America/Bogota',
  ADD COLUMN IF NOT EXISTS locale VARCHAR(10) NOT NULL DEFAULT 'es-CO',

  -- Preferencias pedagógicas de onboarding del frontend
  ADD COLUMN IF NOT EXISTS initial_language_slug VARCHAR(50) NOT NULL DEFAULT 'python',
  ADD COLUMN IF NOT EXISTS experience_level VARCHAR(30) NOT NULL DEFAULT 'beginner',
  ADD COLUMN IF NOT EXISTS learning_style VARCHAR(30) NOT NULL DEFAULT 'hands-on',
  ADD COLUMN IF NOT EXISTS daily_goal_id VARCHAR(20) NOT NULL DEFAULT 'regular',
  ADD COLUMN IF NOT EXISTS daily_goal_minutes SMALLINT NOT NULL DEFAULT 10,

  -- Contadores y métricas O(1) de gamificación, racha y estudio
  ADD COLUMN IF NOT EXISTS total_xp INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_level INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_freeze_count SMALLINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS total_study_time_seconds INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_study_date DATE;

-- Constraints de integridad
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_display_name;
ALTER TABLE public.users ADD CONSTRAINT chk_users_display_name CHECK (char_length(display_name) BETWEEN 2 AND 80);

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_document_type;
ALTER TABLE public.users ADD CONSTRAINT chk_users_document_type CHECK (document_type IS NULL OR document_type IN ('CC', 'TI', 'CE', 'PASSPORT'));

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_experience_level;
ALTER TABLE public.users ADD CONSTRAINT chk_users_experience_level CHECK (experience_level IN ('beginner', 'elementary', 'intermediate', 'advanced'));

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_learning_style;
ALTER TABLE public.users ADD CONSTRAINT chk_users_learning_style CHECK (learning_style IN ('hands-on', 'guided', 'projects', 'gamified'));

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_daily_goal_id;
ALTER TABLE public.users ADD CONSTRAINT chk_users_daily_goal_id CHECK (daily_goal_id IN ('casual', 'regular', 'focused', 'intense'));

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_daily_goal_minutes;
ALTER TABLE public.users ADD CONSTRAINT chk_users_daily_goal_minutes CHECK (daily_goal_minutes BETWEEN 5 AND 120);

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_xp;
ALTER TABLE public.users ADD CONSTRAINT chk_users_xp CHECK (total_xp >= 0);

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_level;
ALTER TABLE public.users ADD CONSTRAINT chk_users_level CHECK (current_level >= 1);

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_streak;
ALTER TABLE public.users ADD CONSTRAINT chk_users_streak CHECK (current_streak >= 0 AND longest_streak >= 0);

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_freezes;
ALTER TABLE public.users ADD CONSTRAINT chk_users_freezes CHECK (streak_freeze_count BETWEEN 0 AND 5);

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS chk_users_study_time;
ALTER TABLE public.users ADD CONSTRAINT chk_users_study_time CHECK (total_study_time_seconds >= 0);

-- Índices de alto rendimiento para Leaderboards y búsquedas
CREATE INDEX IF NOT EXISTS idx_users_streak ON public.users (current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_users_xp ON public.users (total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_users_study_time ON public.users (total_study_time_seconds DESC);
CREATE INDEX IF NOT EXISTS idx_users_display_name ON public.users USING gin (display_name gin_trgm_ops);

-- 5. Actualizar la función de rachas y tiempo de estudio para operar directo sobre public.users
CREATE OR REPLACE FUNCTION public.fn_handle_user_study_activity()
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
  FROM public.users
  WHERE id = NEW.user_id;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  v_today := (NEW.completed_at AT TIME ZONE COALESCE(v_tz, 'America/Bogota'))::DATE;
  v_time_spent := COALESCE(NEW.time_spent_seconds, 0);
  v_xp_awarded := COALESCE(NEW.xp_awarded, 0);
  v_is_passed := COALESCE(NEW.is_passed, false);

  -- 1. Upsert en la tabla diaria de streaks
  INSERT INTO public.streaks (
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

  -- 2. Actualizar contadores de racha y progreso en public.users
  IF v_last_date IS NULL THEN
    v_curr_streak := 1;
    v_long_streak := GREATEST(v_long_streak, 1);
  ELSIF v_last_date = v_today THEN
    NULL; -- Mismo día calendario
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
      UPDATE public.streaks SET freeze_used = true WHERE user_id = NEW.user_id AND activity_date = v_today - 1;
    ELSE
      v_curr_streak := 1;
    END IF;
  END IF;

  UPDATE public.users SET
    total_study_time_seconds = total_study_time_seconds + v_time_spent,
    total_xp = total_xp + v_xp_awarded,
    current_streak = v_curr_streak,
    longest_streak = v_long_streak,
    streak_freeze_count = v_freezes,
    last_study_date = v_today,
    updated_at = now()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. Trigger automático de aprovisionamiento al crearse usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    display_name,
    avatar_url,
    initial_language_slug,
    experience_level,
    learning_style,
    daily_goal_id,
    daily_goal_minutes
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '/brand/koda-mascot-cartoon-2d.svg'),
    COALESCE(NEW.raw_user_meta_data->>'initial_language_slug', 'python'),
    COALESCE(NEW.raw_user_meta_data->>'experience_level', 'beginner'),
    COALESCE(NEW.raw_user_meta_data->>'learning_style', 'hands-on'),
    COALESCE(NEW.raw_user_meta_data->>'daily_goal_id', 'regular'),
    COALESCE((NEW.raw_user_meta_data->>'daily_goal_minutes')::smallint, 10)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 7. Políticas de Row Level Security (RLS) en public.users
DROP POLICY IF EXISTS "Users can access own account" ON public.users;
DROP POLICY IF EXISTS "Users can view own account" ON public.users;
DROP POLICY IF EXISTS "Users can update own account" ON public.users;
DROP POLICY IF EXISTS "Public profiles are viewable by active users" ON public.users;

-- Cada usuario puede leer y actualizar su propia cuenta
CREATE POLICY "Users can view own account"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own account"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Perfiles públicos visibles para tabla de clasificación (Leaderboard) y comunidad
CREATE POLICY "Public profiles are viewable by active users"
  ON public.users FOR SELECT
  USING (status = 'active');
