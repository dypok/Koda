import fs from 'fs';
import path from 'path';

// Import all 8 curriculum data modules
import { PYTHON1_MODULES } from './curriculum-data/python1.data.ts';
import { PYTHON2_MODULES } from './curriculum-data/python2.data.ts';
import { PYTHON3_MODULES } from './curriculum-data/python3.data.ts';
import { FASTAPI_MODULES } from './curriculum-data/fastapi.data.ts';
import { DJANGO_MODULES } from './curriculum-data/django.data.ts';
import { DATA_ANALYTICS_MODULES } from './curriculum-data/data-analytics.data.ts';
import { AI_AGENTS_MODULES } from './curriculum-data/ai-agents.data.ts';
import { APEX_MODULES } from './curriculum-data/apex-gate.data.ts';

const ALL_MODULES = [
  ...PYTHON1_MODULES,
  ...PYTHON2_MODULES,
  ...PYTHON3_MODULES,
  ...FASTAPI_MODULES,
  ...DJANGO_MODULES,
  ...DATA_ANALYTICS_MODULES,
  ...AI_AGENTS_MODULES,
  ...APEX_MODULES
];

console.log(`[BUILD] Loaded ${ALL_MODULES.length} curriculum modules.`);
if (ALL_MODULES.length !== 61) {
  console.warn(`[WARN] Expected 61 modules, found ${ALL_MODULES.length}`);
}

const ROOT_DIR = process.cwd();
const PYTHON_MODULES_DIR = path.join(ROOT_DIR, 'content', 'languages', 'python', 'modules');
const MANIFEST_PATH = path.join(ROOT_DIR, 'content', 'languages', 'python', 'manifest.json');
const CONTENT_TS_PATH = path.join(ROOT_DIR, 'apps', 'web', 'src', 'lib', 'content.ts');

if (!fs.existsSync(PYTHON_MODULES_DIR)) {
  fs.mkdirSync(PYTHON_MODULES_DIR, { recursive: true });
}

// 1. Clean up legacy or obsolete folders
const validTopFolders = new Set(ALL_MODULES.map(m => m.folder.split('/')[0]));
const existingEntries = fs.readdirSync(PYTHON_MODULES_DIR, { withFileTypes: true });

for (const entry of existingEntries) {
  if (entry.isDirectory() && !validTopFolders.has(entry.name)) {
    const fullLegacyPath = path.join(PYTHON_MODULES_DIR, entry.name);
    console.log(`[CLEANUP] Removing obsolete legacy folder: ${entry.name}`);
    fs.rmSync(fullLegacyPath, { recursive: true, force: true });
  }
}

// 2. Write module.json and bank.json for each module
const manifestModules = [];

ALL_MODULES.forEach((mod, index) => {
  const folderPath = path.join(PYTHON_MODULES_DIR, mod.folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const totalLessons = mod.sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);

  const moduleDoc = {
    id: mod.id,
    language_id: 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    code: mod.code,
    slug: mod.slug,
    course_slug: mod.course_slug,
    title: mod.title,
    objective: mod.objective,
    description: mod.description,
    position: index + 1,
    status: 'published',
    content_version: 1,
    total_sections: mod.sections.length,
    total_lessons: totalLessons,
    thresholds: mod.thresholds,
    xp: mod.xp,
    sections: mod.sections
  };

  const bankDoc = {
    module_code: mod.code,
    module_slug: mod.slug,
    course_slug: mod.course_slug,
    questions: mod.bank || []
  };

  fs.writeFileSync(
    path.join(folderPath, 'module.json'),
    JSON.stringify(moduleDoc, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(folderPath, 'bank.json'),
    JSON.stringify(bankDoc, null, 2),
    'utf-8'
  );

  manifestModules.push({
    id: mod.id,
    code: mod.code,
    slug: mod.slug,
    course_slug: mod.course_slug,
    title: mod.title,
    description: mod.description,
    position: index + 1,
    total_sections: mod.sections.length,
    total_lessons: totalLessons,
    status: 'published',
    path: `modules/${mod.folder}`
  });
});

console.log(`[BUILD] Wrote 61 module.json and bank.json files.`);

// 3. Update manifest.json
let manifestData = {};
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifestData = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch {}
}

manifestData = {
  ...manifestData,
  id: manifestData.id || 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  code: 'PYTHON',
  slug: 'python',
  name: 'Python Specialist',
  description: 'La ruta definitiva para dominar Python: desde fundamentos y POO avanzada hasta Backend (FastAPI, Django), Análisis de Datos e Inteligencia Artificial con Agentes Autónomos.',
  status: 'available',
  sort_order: 1,
  content_version: 1,
  is_active: true,
  modules: manifestModules
};

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifestData, null, 2), 'utf-8');
console.log(`[BUILD] Updated ${MANIFEST_PATH} with 61 modules.`);

// 4. Update apps/web/src/lib/content.ts
const moduleImports = ALL_MODULES.map(m =>
  `  'python/${m.slug}': () => import('../../../../content/languages/python/modules/${m.folder}/module.json'),`
).join('\n');

const bankImports = ALL_MODULES.map(m =>
  `  'python/${m.slug}': () => import('../../../../content/languages/python/modules/${m.folder}/bank.json'),`
).join('\n');

const newContentTs = `// Carga de contenido declarativo (content/languages/*) con code-splitting por módulo.

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

// Claves: \`\${lang}/\${moduleSlug}\`. Chunk separado por módulo (no infla el bundle inicial).
const MODULES: Record<string, ModuleImporter> = {
${moduleImports}
};

const BANKS: Record<string, BankImporter> = {
${bankImports}
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
        id: rawEx.id || \`ex-\${raw.id || index}\`,
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
    id: raw.id || raw.slug || \`les-\${index + 1}\`,
    title: raw.title || \`Lección \${index + 1}\`,
    slug: raw.slug || raw.id || \`les-\${index + 1}\`,
    position: raw.position || index + 1,
    concept_id: raw.concept_id || '',
    explanation: raw.explanation || raw.theory_markdown || '',
    is_required: raw.is_required ?? true,
    examples,
    exercises,
  };
}

export function isModuleAvailable(lang: string, moduleSlug: string): boolean {
  return \`\${lang}/\${moduleSlug}\` in MODULES;
}

export async function loadModule(lang: string, moduleSlug: string): Promise<ContentModule | null> {
  const importer = MODULES[\`\${lang}/\${moduleSlug}\`];
  if (!importer) return null;
  try {
    const mod = await importer();
    const rawModule = mod.default as any;
    if (!rawModule) return null;

    const sections: ContentSection[] = (rawModule.sections || []).map((sec: any, secIdx: number) => ({
      id: sec.id || \`sec-\${secIdx + 1}\`,
      title: sec.title || '',
      slug: sec.slug || \`sec-\${secIdx + 1}\`,
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
  const importer = BANKS[\`\${lang}/\${moduleSlug}\`];
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
`;

fs.writeFileSync(CONTENT_TS_PATH, newContentTs, 'utf-8');
console.log(`[BUILD] Updated ${CONTENT_TS_PATH} with 61 modules and banks dynamic imports.`);
console.log('[BUILD] All 61 modules curriculum built successfully!');
