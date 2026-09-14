// Carga de contenido declarativo (content/languages/*) con code-splitting por módulo.

export interface ContentAnswer {
  id: string;
  label?: string;
  body: string;
  is_correct: boolean;
}

export interface ContentExercise {
  id: string;
  type: string;
  difficulty: string;
  prompt: string;
  prompt_code?: string | null;
  answers: ContentAnswer[];
  correct_answer_ids: string[];
  explanation?: string;
  hints?: string[];
  score?: number;
}

export interface ContentExample {
  title?: string;
  code: string;
  language?: string;
  output?: string;
  explanation?: string;
}

export interface ContentLesson {
  id: string;
  title: string;
  slug: string;
  position: number;
  concept_id: string;
  explanation: string;
  is_required: boolean;
  examples: ContentExample[];
  exercises: ContentExercise[];
}

export interface ContentSection {
  id: string;
  title: string;
  slug: string;
  position: number;
  type: string;
  estimated_minutes?: number;
  xp_on_complete?: number;
  lessons: ContentLesson[];
}

export interface ContentModule {
  id: string;
  code: string;
  slug: string;
  title: string;
  sections: ContentSection[];
}

type ModuleImporter = () => Promise<{ default: unknown }>;
type BankImporter = () => Promise<{ default: unknown }>;

// Claves: `${lang}/${moduleSlug}`. Chunk separado por módulo (no infla el bundle inicial).
const MODULES: Record<string, ModuleImporter> = {
  'lua/fundamentos-de-lua': () => import('../../../../content/languages/lua/modules/01_fundamentos/module.json'),
  'lua/variables-y-tipos-de-datos': () => import('../../../../content/languages/lua/modules/02_variables/module.json'),
  'python/fundamentos-de-python': () => import('../../../../content/languages/python/modules/01_fundamentos/module.json'),
};

const BANKS: Record<string, BankImporter> = {
  'lua/fundamentos-de-lua': () => import('../../../../content/languages/lua/modules/01_fundamentos/bank.json'),
  'lua/variables-y-tipos-de-datos': () => import('../../../../content/languages/lua/modules/02_variables/bank.json'),
  'python/fundamentos-de-python': () => import('../../../../content/languages/python/modules/01_fundamentos/bank.json'),
};

export function isModuleAvailable(lang: string, moduleSlug: string): boolean {
  return `${lang}/${moduleSlug}` in MODULES;
}

export async function loadModule(lang: string, moduleSlug: string): Promise<ContentModule | null> {
  const importer = MODULES[`${lang}/${moduleSlug}`];
  if (!importer) return null;
  try {
    const mod = await importer();
    return mod.default as unknown as ContentModule;
  } catch {
    return null;
  }
}

export async function loadBank(lang: string, moduleSlug: string): Promise<ContentExercise[]> {
  const importer = BANKS[`${lang}/${moduleSlug}`];
  if (!importer) return [];
  try {
    const mod = await importer();
    const data = mod.default as unknown;
    return Array.isArray(data) ? (data as ContentExercise[]) : [];
  } catch {
    return [];
  }
}

/** Mezcla Fisher-Yates determinista por semilla (quiz barajado pero estable). */
export function shuffled<T>(items: T[], seed = 42): T[] {
  const arr = [...items];
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
