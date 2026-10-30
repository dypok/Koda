-- ==============================================================================
-- Koda Academy - Production Pilot Database Optimization Patch
-- Focus: Python Module Pilot, Section Star Ratings, and SM-2 Spaced Repetition
-- Safe & Idempotent: Uses IF NOT EXISTS
-- ==============================================================================

-- 1. Index for section stars query by user and section
CREATE INDEX IF NOT EXISTS idx_user_section_stars_user_section 
  ON "user_section_stars" (user_id, section_slug);

-- 2. Index for SM-2 review queue items due for review
CREATE INDEX IF NOT EXISTS idx_review_queue_user_due 
  ON "review_queue_items" (user_id, next_review_due);

-- 3. Index for user mistakes notebook active unresolved mistakes
CREATE INDEX IF NOT EXISTS idx_user_mistakes_notebook_user_resolved 
  ON "user_mistakes_notebook" (user_id, is_resolved);
