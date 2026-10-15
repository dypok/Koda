export interface RawExample {
  title?: string;
  code: string;
  output?: string;
  explanation?: string;
}

export interface RawExerciseOption {
  id: string;
  label?: string;
  text: string;
}

export interface RawExercise {
  id: string;
  type: 'single_choice' | 'predict_output' | 'find_error' | 'fill_blank' | 'true_false' | 'select_code';
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  prompt_code?: string | null;
  options: RawExerciseOption[];
  correct_option_id: string;
  explanation: string;
  hint?: string;
}

export interface RawLesson {
  id: string;
  code: string;
  title: string;
  slug: string;
  position: number;
  concept_id: string;
  objective: string;
  theory_markdown: string;
  examples: RawExample[];
  common_errors?: string;
  mini_exercise?: {
    starter_code: string;
    instructions: string;
    solution: string;
  };
  key_takeaways?: string[];
  exercise?: RawExercise;
}

export interface RawSection {
  id: string;
  code: string;
  title: string;
  slug: string;
  position: number;
  type: string;
  estimated_minutes: number;
  xp_on_complete: number;
  lessons: RawLesson[];
}

export interface RawModule {
  id: string;
  language_id: string;
  code: string;
  slug: string;
  title: string;
  objective: string;
  description: string;
  folder: string;
  course_slug: string;
  position: number;
  status: 'published';
  thresholds: { quiz: number; exam: number };
  xp: { on_pass: number };
  sections: RawSection[];
  bank: RawExercise[];
}
