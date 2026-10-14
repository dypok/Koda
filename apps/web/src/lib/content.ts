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
  // Lua
  'lua/fundamentos-de-lua': () => import('../../../../content/languages/lua/modules/01_fundamentos/module.json'),
  'lua/variables-y-tipos-de-datos': () => import('../../../../content/languages/lua/modules/02_variables/module.json'),
  'lua/operadores': () => import('../../../../content/languages/lua/modules/03_operadores/module.json'),
  // Python Nivel 1
  'python/fundamentos-de-python': () => import('../../../../content/languages/python/modules/01_fundamentos/module.json'),
  'python/variables-y-tipos-de-datos': () => import('../../../../content/languages/python/modules/02_variables/module.json'),
  'python/operadores-y-expresiones': () => import('../../../../content/languages/python/modules/03_operadores/module.json'),
  'python/condicionales': () => import('../../../../content/languages/python/modules/04_condicionales/module.json'),
  'python/bucles-for': () => import('../../../../content/languages/python/modules/05_bucles_for/module.json'),
  'python/bucles-while': () => import('../../../../content/languages/python/modules/06_bucles_while/module.json'),
  // Python Nivel 2 & 3
  'python/funciones-y-modularidad': () => import('../../../../content/languages/python/modules/06_funciones/module.json'),
  'python/colecciones': () => import('../../../../content/languages/python/modules/07_colecciones/module.json'),
  'python/strings-avanzados': () => import('../../../../content/languages/python/modules/08_strings_avanzados/module.json'),
  'python/manejo-de-errores': () => import('../../../../content/languages/python/modules/09_manejo_errores/module.json'),
  'python/archivos-y-modulos': () => import('../../../../content/languages/python/modules/10_archivos_modulos/module.json'),
  'python/programacion-orientada-a-objetos': () => import('../../../../content/languages/python/modules/11_poo/module.json'),
  'python/fastapi-asgi': () => import('../../../../content/languages/python/modules/13_fastapi_asgi/module.json'),
  'python/fastapi-pydantic': () => import('../../../../content/languages/python/modules/14_fastapi_pydantic/module.json'),
  'python/django-mvt': () => import('../../../../content/languages/python/modules/15_django_mvt/module.json'),
  'python/django-orm': () => import('../../../../content/languages/python/modules/16_django_orm/module.json'),
  // JavaScript
  'javascript/fundamentos-de-javascript': () => import('../../../../content/languages/javascript/modules/01_fundamentos/module.json'),
  'javascript/variables-y-tipos-de-datos': () => import('../../../../content/languages/javascript/modules/02_variables/module.json'),
  'javascript/funciones-y-arrow-functions': () => import('../../../../content/languages/javascript/modules/03_funciones/module.json'),
  'javascript/arrays-y-objetos': () => import('../../../../content/languages/javascript/modules/04_arrays_objetos/module.json'),
  'javascript/asincronia-y-fetch': () => import('../../../../content/languages/javascript/modules/05_asincronia/module.json'),
  // TypeScript
  'typescript/fundamentos-de-typescript': () => import('../../../../content/languages/typescript/modules/01_fundamentos/module.json'),
  'typescript/interfaces-y-type-aliases': () => import('../../../../content/languages/typescript/modules/02_interfaces/module.json'),
  'typescript/genericos-y-union-types': () => import('../../../../content/languages/typescript/modules/03_genericos/module.json'),
  'typescript/clases-y-poo': () => import('../../../../content/languages/typescript/modules/04_clases/module.json'),
  // HTML
  'html/fundamentos-de-html': () => import('../../../../content/languages/html/modules/01_fundamentos_html/module.json'),
  'html/html-semantico-y-a11y': () => import('../../../../content/languages/html/modules/02_semantica_a11y/module.json'),
  // CSS
  'css/selectores-y-box-model': () => import('../../../../content/languages/css/modules/01_selectores_boxmodel/module.json'),
  'css/flexbox-layout': () => import('../../../../content/languages/css/modules/02_flexbox/module.json'),
};

const BANKS: Record<string, BankImporter> = {
  // Lua
  'lua/fundamentos-de-lua': () => import('../../../../content/languages/lua/modules/01_fundamentos/bank.json'),
  'lua/variables-y-tipos-de-datos': () => import('../../../../content/languages/lua/modules/02_variables/bank.json'),
  'lua/operadores': () => import('../../../../content/languages/lua/modules/03_operadores/bank.json'),
  // Python Nivel 1
  'python/fundamentos-de-python': () => import('../../../../content/languages/python/modules/01_fundamentos/bank.json'),
  'python/variables-y-tipos-de-datos': () => import('../../../../content/languages/python/modules/02_variables/bank.json'),
  'python/operadores-y-expresiones': () => import('../../../../content/languages/python/modules/03_operadores/bank.json'),
  'python/condicionales': () => import('../../../../content/languages/python/modules/04_condicionales/bank.json'),
  'python/bucles-for': () => import('../../../../content/languages/python/modules/05_bucles_for/bank.json'),
  'python/bucles-while': () => import('../../../../content/languages/python/modules/06_bucles_while/bank.json'),
  // Python Nivel 2 & 3
  'python/funciones-y-modularidad': () => import('../../../../content/languages/python/modules/06_funciones/bank.json'),
  'python/colecciones': () => import('../../../../content/languages/python/modules/07_colecciones/bank.json'),
  'python/strings-avanzados': () => import('../../../../content/languages/python/modules/08_strings_avanzados/bank.json'),
  'python/manejo-de-errores': () => import('../../../../content/languages/python/modules/09_manejo_errores/bank.json'),
  'python/archivos-y-modulos': () => import('../../../../content/languages/python/modules/10_archivos_modulos/bank.json'),
  'python/programacion-orientada-a-objetos': () => import('../../../../content/languages/python/modules/11_poo/bank.json'),
  'python/fastapi-asgi': () => import('../../../../content/languages/python/modules/13_fastapi_asgi/bank.json'),
  'python/fastapi-pydantic': () => import('../../../../content/languages/python/modules/14_fastapi_pydantic/bank.json'),
  'python/django-mvt': () => import('../../../../content/languages/python/modules/15_django_mvt/bank.json'),
  'python/django-orm': () => import('../../../../content/languages/python/modules/16_django_orm/bank.json'),
  // JavaScript
  'javascript/fundamentos-de-javascript': () => import('../../../../content/languages/javascript/modules/01_fundamentos/bank.json'),
  'javascript/variables-y-tipos-de-datos': () => import('../../../../content/languages/javascript/modules/02_variables/bank.json'),
  'javascript/funciones-y-arrow-functions': () => import('../../../../content/languages/javascript/modules/03_funciones/bank.json'),
  'javascript/arrays-y-objetos': () => import('../../../../content/languages/javascript/modules/04_arrays_objetos/bank.json'),
  'javascript/asincronia-y-fetch': () => import('../../../../content/languages/javascript/modules/05_asincronia/bank.json'),
  // TypeScript
  'typescript/fundamentos-de-typescript': () => import('../../../../content/languages/typescript/modules/01_fundamentos/bank.json'),
  'typescript/interfaces-y-type-aliases': () => import('../../../../content/languages/typescript/modules/02_interfaces/bank.json'),
  'typescript/genericos-y-union-types': () => import('../../../../content/languages/typescript/modules/03_genericos/bank.json'),
  'typescript/clases-y-poo': () => import('../../../../content/languages/typescript/modules/04_clases/bank.json'),
  // HTML
  'html/fundamentos-de-html': () => import('../../../../content/languages/html/modules/01_fundamentos_html/bank.json'),
  'html/html-semantico-y-a11y': () => import('../../../../content/languages/html/modules/02_semantica_a11y/bank.json'),
  // CSS
  'css/selectores-y-box-model': () => import('../../../../content/languages/css/modules/01_selectores_boxmodel/bank.json'),
  'css/flexbox-layout': () => import('../../../../content/languages/css/modules/02_flexbox/bank.json'),
};

function normalizeLesson(raw: any, index: number): ContentLesson {
  const examples: ContentExample[] = Array.isArray(raw.examples)
    ? raw.examples
    : raw.code_example
    ? [{ code: raw.code_example, output: raw.expected_output, explanation: raw.tip_markdown }]
    : [];

  const rawEx = raw.exercises?.[0] || raw.exercise;
  const exercises: ContentExercise[] = Array.isArray(raw.exercises)
    ? raw.exercises
    : rawEx
    ? [{
        id: rawEx.id || `ex-${raw.id || index}`,
        type: rawEx.type || 'single_choice',
        difficulty: rawEx.difficulty || 'medium',
        prompt: rawEx.prompt || '',
        prompt_code: rawEx.prompt_code || null,
        answers: Array.isArray(rawEx.answers)
          ? rawEx.answers
          : Array.isArray(rawEx.options)
          ? rawEx.options.map((opt: any) => ({
              id: opt.id,
              label: opt.label || opt.id?.toUpperCase(),
              body: opt.text || opt.body || '',
              is_correct: opt.id === rawEx.correct_option_id || Boolean(opt.is_correct),
            }))
          : [],
        correct_answer_ids: rawEx.correct_answer_ids || (rawEx.correct_option_id ? [rawEx.correct_option_id] : []),
        explanation: rawEx.explanation || '',
        hints: rawEx.hints || (rawEx.hint ? [rawEx.hint] : []),
      }]
    : [];

  return {
    id: raw.id || raw.slug || `les-${index + 1}`,
    title: raw.title || `Lección ${index + 1}`,
    slug: raw.slug || raw.id || `les-${index + 1}`,
    position: raw.position || index + 1,
    concept_id: raw.concept_id || '',
    explanation: raw.explanation || raw.theory_markdown || '',
    is_required: raw.is_required ?? true,
    examples,
    exercises,
  };
}

export function isModuleAvailable(lang: string, moduleSlug: string): boolean {
  return `${lang}/${moduleSlug}` in MODULES;
}

export async function loadModule(lang: string, moduleSlug: string): Promise<ContentModule | null> {
  const importer = MODULES[`${lang}/${moduleSlug}`];
  if (!importer) return null;
  try {
    const mod = await importer();
    const rawModule = mod.default as any;
    if (!rawModule) return null;

    // Normalizar secciones y lecciones para garantizar compatibilidad total
    const sections: ContentSection[] = (rawModule.sections || []).map((sec: any, secIdx: number) => ({
      id: sec.id || `sec-${secIdx + 1}`,
      title: sec.title || '',
      slug: sec.slug || `sec-${secIdx + 1}`,
      position: sec.position || secIdx + 1,
      type: sec.type || 'theory',
      estimated_minutes: sec.estimated_minutes,
      xp_on_complete: sec.xp_on_complete,
      lessons: (sec.lessons || []).map((les: any, lesIdx: number) => normalizeLesson(les, lesIdx)),
    }));

    return {
      id: rawModule.id || moduleSlug,
      code: rawModule.code || '',
      slug: rawModule.slug || moduleSlug,
      title: rawModule.title || '',
      sections,
    };
  } catch {
    return null;
  }
}

export async function loadBank(lang: string, moduleSlug: string): Promise<ContentExercise[]> {
  const importer = BANKS[`${lang}/${moduleSlug}`];
  if (!importer) return [];
  try {
    const mod = await importer();
    const data = mod.default as any;
    const rawList = Array.isArray(data) ? data : Array.isArray(data?.questions) ? data.questions : [];

    return rawList.map((q: any) => {
      if (q.answers && q.correct_answer_ids) return q as ContentExercise;
      return {
        id: q.id,
        type: q.type || 'single_choice',
        difficulty: q.difficulty || 'medium',
        prompt: q.prompt || '',
        prompt_code: q.prompt_code || null,
        answers: Array.isArray(q.options)
          ? q.options.map((o: any) => ({
              id: o.id,
              label: o.label || o.id?.toUpperCase(),
              body: o.text || o.body || '',
              is_correct: o.id === q.correct_option_id || Boolean(o.is_correct),
            }))
          : [],
        correct_answer_ids: q.correct_option_id ? [q.correct_option_id] : (q.correct_answer_ids || []),
        explanation: q.explanation || '',
        hints: q.hint ? [q.hint] : (q.hints || []),
      };
    });
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
