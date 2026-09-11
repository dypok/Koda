/**
 * @koda/types - Contratos y modelos compartidos entre Frontend y Backend
 */

// ==========================================
// 1. AUTENTICACIÓN Y USUARIO
// ==========================================

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  is_premium: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  document_number?: string;
  document_type?: 'CC' | 'TI' | 'CE' | 'PASSPORT';
  bio?: string;
  selected_language_id?: string;
  total_xp: number;
  level: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

// ==========================================
// 2. CURRÍCULO Y APRENDIZAJE
// ==========================================

export interface ProgrammingLanguage {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_url: string;
  color: string;
  total_modules: number;
  is_active: boolean;
}

export interface ModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  is_unlocked: boolean;
  is_completed: boolean;
  mastery_percentage: number;
  unlocked_at?: string;
  completed_at?: string;
}

export interface SectionStars {
  id: string;
  user_id: string;
  section_id: string;
  stars_earned: number; // 1, 2 o 3 estrellas
  max_stars_earned: number;
  first_attempt_mistakes: number;
  completed_at: string;
}

export interface RoadmapModule {
  id: string;
  code: string;
  title: string;
  description: string;
  order_index: number;
  total_sections: number;
  is_unlocked: boolean;
  is_completed: boolean;
  mastery_percentage: number;
  sections: RoadmapSection[];
}

export interface RoadmapSection {
  id: string;
  code: string;
  title: string;
  order_index: number;
  total_lessons: number;
  is_unlocked: boolean;
  is_completed: boolean;
  stars_earned: number;
  max_stars_earned: number;
}

export interface RoadmapResponse {
  language: ProgrammingLanguage;
  overall_progress_percentage: number;
  total_stars_earned: number;
  max_possible_stars: number;
  current_module_id: string;
  modules: RoadmapModule[];
}

// ------------------------------------------
// Modelos de Grafo DAG Multi-Rama (ADR-007, ADR-011)
// ------------------------------------------

export type CareerBranchType = 'frontend' | 'backend' | 'devops' | 'python';

export interface CareerBranch {
  id: CareerBranchType;
  name: string;
  description: string;
  icon: string;
  color: string;
  progress_percentage: number;
  completed_courses: number;
  total_courses: number;
  stars_earned: number;
  is_active: boolean;
}

export type GraphNodeVariant =
  | 'active'
  | 'locked'
  | 'unlocked'
  | 'completed'
  | 'branch'
  | 'boss'
  | 'bonus';

export type GraphNodeIconType =
  | 'brackets'
  | 'code'
  | 'flow'
  | 'matrix'
  | 'atom'
  | 'lock'
  | 'skull'
  | 'chest'
  | 'server'
  | 'database';

export interface NodeTopology {
  tier: number; // Columna horizontal progresiva (1, 2, 3...)
  lane: number; // 0: centro, 1: superior, -1: inferior
  lane_name?: string;
}

export type AnimationPresetKey =
  | 'laser_flow_fast'
  | 'laser_flow_normal'
  | 'laser_standby_dashed'
  | 'sonar_radar_pulse'
  | 'boss_threat_pulse'
  | 'orbital_satellite';

export interface NodeFxConfig {
  preset: AnimationPresetKey;
  color?: string;
  glow_rgba?: string;
  speed_multiplier?: number;
}

export interface EdgeFxConfig {
  preset: AnimationPresetKey;
  laser_color?: string;
  trail_color?: string;
  dash_style?: 'solid' | 'dashed';
}

export interface GraphNode {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  variant: GraphNodeVariant;
  icon_type: GraphNodeIconType;
  topology?: NodeTopology;
  fx?: NodeFxConfig;
  graph_x?: number;
  graph_y?: number;
  is_unlocked: boolean;
  stars_earned: number;
  max_stars: number;
  prerequisites: string[];
  course_slug?: string;
  lesson_id?: string;
}

export type GraphEdgeVariant = 'direct' | 'curved' | 'dashed';

export interface GraphEdge {
  id: string;
  from_id: string;
  to_id: string;
  variant: GraphEdgeVariant;
  fx?: EdgeFxConfig;
  is_completed: boolean;
}

export interface BranchRoadmapResponse {
  branch: CareerBranch;
  nodes: GraphNode[];
  connections: GraphEdge[];
}

export interface MilestoneTelemetry {
  code: string;
  title: string;
  description: string;
  xp_reward: number;
  prerequisite_label: string; // ej. "RQ HTML"
  is_locked: boolean;
}

// ==========================================
// 3. LECCIONES Y PREGUNTAS
// ==========================================

export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'CODE_OUTPUT'
  | 'FILL_BLANK'
  | 'ORDER_BLOCKS'
  | 'MATCH_PAIRS'
  | 'BUG_HUNT'
  | 'CODE_COMPLETION'
  | 'TRUE_FALSE'
  | 'DRAG_DROP';

export interface QuestionOption {
  id: string;
  text: string;
  code_snippet?: string;
}

export interface LessonQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  code_context?: string;
  hint?: string;
  options: QuestionOption[];
}

// ------------------------------------------
// Tríada Evaluativa de Lección (ADR-011)
// ------------------------------------------

export interface ConsoleTestCase {
  input: string;
  expected_output: string;
  is_hidden: boolean;
}

export interface ConsoleChallenge {
  type: 'CONSOLE_CHALLENGE';
  instruction: string;
  starter_code: string;
  solution_code?: string;
  test_cases: ConsoleTestCase[];
  timeout_ms: number;
}

export interface FourOptionsQuestion {
  type: 'SINGLE_CHOICE';
  prompt: string;
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]; // Exactamente 4 opciones A, B, C, D
  correct_option_id?: string;
  explanation?: string;
}

export interface PredictionChallenge {
  type: 'PREDICT_OUTPUT' | 'BUG_HUNT';
  prompt: string;
  code_snippet?: string;
  options?: QuestionOption[];
  expected_output?: string;
  explanation?: string;
}

export interface LessonTriadEvaluation {
  item_1_console: ConsoleChallenge;
  item_2_options: FourOptionsQuestion;
  item_3_prediction: PredictionChallenge;
}

export interface LessonDetail {
  id: string;
  section_id: string;
  title: string;
  order_index: number;
  theory_markdown: string;
  code_example: string;
  expected_output?: string;
  tip_markdown?: string;
  question?: LessonQuestion; // Legacy / compatibilidad
  evaluation_triad?: LessonTriadEvaluation; // Modelo Oficial Tríada (ADR-011)
}

export interface LessonAnswerSubmission {
  lesson_id: string;
  question_id: string;
  selected_option_ids: string[];
  input_text?: string;
  ordered_block_ids?: string[];
}

export interface LessonAnswerFeedback {
  is_correct: boolean;
  xp_earned: number;
  feedback_message: string;
  hint?: string;
  explanation?: string;
  correct_option_ids?: string[]; // Solo presente en revisiones o aciertos
  added_to_review_queue: boolean;
}

export interface LessonTriadSubmission {
  lesson_id: string;
  item_1_code: string;
  item_2_selected_option_id: string;
  item_3_answer: string;
}

export interface LessonTriadFeedback {
  is_completed: boolean;
  stars_earned: 1 | 2 | 3;
  items_passed: {
    console: boolean;
    options: boolean;
    prediction: boolean;
  };
  xp_earned: number;
  feedback_message: string;
  console_output?: string;
  added_to_review_queue: boolean;
}

// ==========================================
// 4. CUADERNO DE ERRORES Y REPASO
// ==========================================

export interface MistakesNotebookItem {
  id: string;
  user_id: string;
  question_id: string;
  track_slug?: string;
  course_slug?: string;
  module_slug?: string;
  section_slug?: string;
  language_id?: string;
  module_id?: string;
  section_id?: string;
  lesson_title: string;
  prompt: string;
  code_context?: string;
  error_count: number;
  is_resolved: boolean;
  // Parámetros del Algoritmo SuperMemo SM-2 (ADR-011)
  interval_days?: number;
  ease_factor?: number;
  repetition_count?: number;
  next_review_at?: string;
  created_at: string;
  last_failed_at: string;
}

// ==========================================
// 5. GAMIFICACIÓN (XP, RACHAS, LOGROS)
// ==========================================

export interface UserStreak {
  current_streak: number;
  max_streak: number;
  last_activity_date: string;
  freeze_count: number;
  is_active_today: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  is_unlocked: boolean;
  unlocked_at?: string;
}

// ==========================================
// 6. CERTIFICACIÓN
// ==========================================

export type CertificateStatus = 'valid' | 'revoked' | 'obsolete';

export interface Certificate {
  id: string;
  code: string; // ej. KODA-PY-000001
  user_id: string;
  language_id: string;
  status: CertificateStatus;
  issued_at: string;
  holder_name: string;
  holder_document_masked: string;
  language_name: string;
  qr_payload: string;
  google_drive_file_id?: string;
  pdf_sha256?: string;
}

export interface CertificateVerificationResponse {
  is_valid: boolean;
  code: string;
  holder_name: string;
  holder_document_masked: string;
  language_name: string;
  issued_at: string;
  status: CertificateStatus;
  verification_url: string;
}
