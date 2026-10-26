import { ContentExercise, isModuleAvailable, shuffled } from '@/lib/content';
import type { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';

export const NODE_TO_SLUG_MAP: Record<string, { moduleSlug: string; initialMode?: 'lesson' | 'quiz' }> = {
  // Python 1: Fundamentos (IDs emitidos por Backend / API)
  'py-m01': { moduleSlug: 'fundamentos-de-python' },
  'py-m02': { moduleSlug: 'variables-y-tipos-de-datos' },
  'py-m03': { moduleSlug: 'operadores-y-expresiones' },
  'py-m04': { moduleSlug: 'condicionales' },
  'py-boss-logic': { moduleSlug: 'condicionales', initialMode: 'quiz' },
  'py-m05': { moduleSlug: 'bucles-for' },
  'py-m06': { moduleSlug: 'bucles-while' },
  'py-apex-1': { moduleSlug: 'funciones-fundamentales', initialMode: 'quiz' },

  // Python 1: Fundamentos (IDs canónicos de dataset mock frontend)
  'les-01': { moduleSlug: 'fundamentos-de-python' },
  'les-02': { moduleSlug: 'variables-y-tipos-de-datos' },
  'les-03': { moduleSlug: 'operadores-y-expresiones' },
  'les-04': { moduleSlug: 'entrada-salida-y-strings' },
  'les-05': { moduleSlug: 'condicionales' },
  'les-miniboss': { moduleSlug: 'condicionales', initialMode: 'quiz' },
  'les-06': { moduleSlug: 'bucles-for' },
  'les-07': { moduleSlug: 'bucles-while' },
  'les-08': { moduleSlug: 'listas-y-tuplas' },
  'les-09': { moduleSlug: 'diccionarios-y-sets' },
  'les-10': { moduleSlug: 'funciones-fundamentales' },
  'les-boss': { moduleSlug: 'funciones-fundamentales', initialMode: 'quiz' },

  // Python 2: Intermedio (IDs Backend / API)
  'py2-m01': { moduleSlug: 'comprensiones' },
  'py2-m02': { moduleSlug: 'funciones-avanzadas' },
  'py2-m03': { moduleSlug: 'modulos-y-paquetes' },
  'py2-m04': { moduleSlug: 'manejo-de-excepciones' },
  'py2-m05': { moduleSlug: 'archivos-txt-csv-json' },

  // Python 2: Intermedio (IDs dataset mock frontend)
  'py2-01': { moduleSlug: 'comprensiones' },
  'py2-02': { moduleSlug: 'funciones-avanzadas' },
  'py2-03': { moduleSlug: 'modulos-y-paquetes' },
  'py2-04': { moduleSlug: 'manejo-de-excepciones' },
  'py2-05': { moduleSlug: 'archivos-txt-csv-json' },
  'py2-miniboss': { moduleSlug: 'archivos-txt-csv-json', initialMode: 'quiz' },
  'py2-06': { moduleSlug: 'poo-clases-y-objetos' },
  'py2-07': { moduleSlug: 'poo-herencia-y-polimorfismo' },
  'py2-08': { moduleSlug: 'datetime-y-regex' },
  'py2-09': { moduleSlug: 'pip-entornos-y-git' },
  'py2-10': { moduleSlug: 'testing-con-pytest' },
  'py2-boss': { moduleSlug: 'testing-con-pytest', initialMode: 'quiz' },

  // Python 3: Avanzado (IDs Backend / API)
  'py3-m01': { moduleSlug: 'iteradores-y-generadores' },
  'py3-m02': { moduleSlug: 'decoradores' },
  'py3-m03': { moduleSlug: 'context-managers' },
  'py3-m04': { moduleSlug: 'type-hints-y-dataclasses' },
  'py3-m05': { moduleSlug: 'programacion-funcional' },

  // Python 3: Avanzado (IDs dataset mock frontend)
  'py3-01': { moduleSlug: 'iteradores-y-generadores' },
  'py3-02': { moduleSlug: 'decoradores' },
  'py3-03': { moduleSlug: 'context-managers' },
  'py3-04': { moduleSlug: 'type-hints-y-dataclasses' },
  'py3-05': { moduleSlug: 'programacion-funcional' },
  'py3-miniboss': { moduleSlug: 'programacion-funcional', initialMode: 'quiz' },
  'py3-06': { moduleSlug: 'concurrencia-asyncio' },
  'py3-07': { moduleSlug: 'buenas-practicas-pep8' },
  'py3-08': { moduleSlug: 'logging-y-empaquetado' },
  'py3-09': { moduleSlug: 'rendimiento-y-profiling' },
  'py3-10': { moduleSlug: 'patrones-de-diseno' },
  'py3-boss': { moduleSlug: 'patrones-de-diseno', initialMode: 'quiz' },

  // FastAPI (IDs Backend y Mock)
  'fa-m01': { moduleSlug: 'fastapi-http-rest' },
  'fa-m02': { moduleSlug: 'fastapi-pydantic' },
  'fa-m03': { moduleSlug: 'fastapi-sqlalchemy-alembic' },
  'fa-m04': { moduleSlug: 'fastapi-auth-jwt' },
  'fa-01': { moduleSlug: 'fastapi-http-rest' },
  'fa-02': { moduleSlug: 'fastapi-pydantic' },
  'fa-03': { moduleSlug: 'fastapi-sqlalchemy-alembic' },
  'fa-04': { moduleSlug: 'fastapi-auth-jwt' },
  'fa-05': { moduleSlug: 'fastapi-docker-deploy' },

  // Django (IDs Backend y Mock)
  'dj-m01': { moduleSlug: 'django-mtv-routing' },
  'dj-m02': { moduleSlug: 'django-orm-models' },
  'dj-m03': { moduleSlug: 'django-forms-admin' },
  'dj-m04': { moduleSlug: 'django-rest-framework' },
  'dj-01': { moduleSlug: 'django-mtv-routing' },
  'dj-02': { moduleSlug: 'django-orm-models' },
  'dj-03': { moduleSlug: 'django-forms-admin' },
  'dj-04': { moduleSlug: 'django-rest-framework' },
  'dj-05': { moduleSlug: 'django-auth-security-deploy' },

  // Data Analytics (IDs Backend y Mock)
  'data-analytics-s01': { moduleSlug: 'numpy-fundamentos' },
  'da-01': { moduleSlug: 'numpy-fundamentos' },
  'da-02': { moduleSlug: 'pandas-series-dataframes' },
  'da-03': { moduleSlug: 'pandas-limpieza-transformacion' },
  'da-04': { moduleSlug: 'pandas-agrupaciones-merges' },
  'da-05': { moduleSlug: 'matplotlib-seaborn' },
  'da-miniboss': { moduleSlug: 'matplotlib-seaborn', initialMode: 'quiz' },
  'da-06': { moduleSlug: 'plotly-interactivo' },
  'da-07': { moduleSlug: 'analisis-exploratorio-eda' },
  'da-08': { moduleSlug: 'sql-con-python' },
  'da-09': { moduleSlug: 'scikit-learn-intro-ml' },
  'da-10': { moduleSlug: 'streamlit-dashboards' },
  'da-boss': { moduleSlug: 'streamlit-dashboards', initialMode: 'quiz' },

  // AI Agents (IDs Backend y Mock)
  'ai-agents-s01': { moduleSlug: 'ia-llms-y-prompts' },
  'ia-01': { moduleSlug: 'ia-llms-y-prompts' },
  'ia-02': { moduleSlug: 'ia-apis-modelos' },
  'ia-03': { moduleSlug: 'ia-salidas-estructuradas' },
  'ia-04': { moduleSlug: 'ia-function-calling' },
  'ia-miniboss': { moduleSlug: 'ia-function-calling', initialMode: 'quiz' },
  'ia-05': { moduleSlug: 'ia-memoria-y-contexto' },
  'ia-06': { moduleSlug: 'ia-embeddings-vector-dbs' },
  'ia-07': { moduleSlug: 'ia-rag-recuperacion' },
  'ia-08': { moduleSlug: 'ia-agentes-bucle-react' },
  'ia-09': { moduleSlug: 'ia-guardrails-y-evaluacion' },
  'ia-10': { moduleSlug: 'ia-proyecto-agente-completo' },

  // Apex (IDs Backend y Mock)
  'python-apex-s01': { moduleSlug: 'apex-master-gate' },
  'apex-01': { moduleSlug: 'apex-master-gate' },
  'apex-02': { moduleSlug: 'apex-master-gate' },
  'apex-03': { moduleSlug: 'apex-master-gate', initialMode: 'quiz' },
};

export const COURSE_DEFAULT_SLUGS: Record<string, string> = {
  'python-1': 'fundamentos-de-python',
  'python-2': 'comprensiones',
  'python-3': 'iteradores-y-generadores',
  'fastapi-async': 'fastapi-http-rest',
  'django-enterprise': 'django-mtv-routing',
  'data-analytics': 'numpy-fundamentos',
  'ai-agents': 'ia-llms-y-prompts',
  'python-apex': 'apex-master-gate',
};

export function parseCourse(courseId: string, sectionRef: string): { lang: string; moduleSlug: string; initialMode: 'lesson' | 'quiz' } {
  const lang = 'python';

  // 1. Verificación por mapa directo de IDs de nodos del roadmap
  const mapped = NODE_TO_SLUG_MAP[sectionRef];
  if (mapped) {
    return {
      lang,
      moduleSlug: mapped.moduleSlug,
      initialMode: mapped.initialMode || (sectionRef.includes('boss') ? 'quiz' : 'lesson'),
    };
  }

  // 2. Si sectionRef es directamente un slug de módulo conocido y disponible
  if (isModuleAvailable(lang, sectionRef)) {
    const isQuizMode = sectionRef.includes('boss') || sectionRef.includes('quiz') || sectionRef.includes('exam');
    return {
      lang,
      moduleSlug: sectionRef,
      initialMode: isQuizMode ? 'quiz' : 'lesson',
    };
  }

  // 3. Fallback inteligente según curso para evitar que un ID de sección no mapeado rompa el workspace
  const defaultSlug = COURSE_DEFAULT_SLUGS[courseId] || 'fundamentos-de-python';
  const isQuizMode = sectionRef.includes('boss') || sectionRef.includes('quiz') || sectionRef.includes('exam');

  return {
    lang,
    moduleSlug: defaultSlug,
    initialMode: isQuizMode ? 'quiz' : 'lesson',
  };
}

export const QUIZ_COMPOSITION: Record<string, number> = {
  single_choice: 2,
  multiple_choice: 1,
  true_false: 1,
  predict_output: 1,
  fill_blank: 1,
  find_error: 1,
  select_code: 1,
  order_lines: 1,
  matching: 1,
};

export function sampleQuiz(bank: ContentExercise[], seed: number): ContentExercise[] {
  if (bank.length === 0) return [];
  // Si el banco trae <= 10 preguntas, barajarlas todas
  if (bank.length <= 10) return shuffled(bank, seed);
  const picked: ContentExercise[] = [];
  const pickedIds = new Set<string>();

  Object.entries(QUIZ_COMPOSITION).forEach(([type, n], ti) => {
    const pool = shuffled(
      bank.filter((q) => q.type === type),
      seed + ti
    );
    for (const q of pool.slice(0, n)) {
      if (!pickedIds.has(q.id)) {
        picked.push(q);
        pickedIds.add(q.id);
      }
    }
  });

  if (picked.length < 10) {
    const remaining = shuffled(
      bank.filter((q) => !pickedIds.has(q.id)),
      seed + 55
    );
    picked.push(...remaining.slice(0, 10 - picked.length));
  }

  return shuffled(picked, seed + 99);
}

export function findNodeInDataset(
  dataset: GraphDataset | null | undefined,
  sectionRef: string,
  moduleSlug?: string
): GraphNode | null {
  if (!dataset?.nodes?.length) return null;

  const sRefLower = sectionRef.toLowerCase();

  // 1. Coincidencia directa por ID exacto (ej. 'py-m04', 'les-05', 'py-boss-logic', 'py2-01')
  const direct = dataset.nodes.find((n) => n.id.toLowerCase() === sRefLower);
  if (direct) return direct;

  // 2. Coincidencia por mapeo canónico de slug en NODE_TO_SLUG_MAP
  if (moduleSlug) {
    const targetSlugLower = moduleSlug.toLowerCase();
    const bySlug = dataset.nodes.find((n) => {
      const nodeSlug = NODE_TO_SLUG_MAP[n.id]?.moduleSlug;
      return nodeSlug && nodeSlug.toLowerCase() === targetSlugLower;
    });
    if (bySlug) return bySlug;
  }

  // 3. Coincidencia por código numérico de lección (ej. '04', '4', 'm04', 'les-04')
  const codeMatch = sectionRef.match(/(?:m|les-?)0?(\d+)/i);
  if (codeMatch) {
    const num = codeMatch[1].padStart(2, '0');
    const byCode = dataset.nodes.find((n) => n.code === num);
    if (byCode) return byCode;
  }

  // 4. Coincidencia por similitud de tokens en label
  if (moduleSlug) {
    const slugTokens = moduleSlug.toLowerCase().split('-');
    const byToken = dataset.nodes.find((n) => {
      const labelLower = n.label.toLowerCase();
      return slugTokens.some((t) => t.length > 3 && labelLower.includes(t));
    });
    if (byToken) return byToken;
  }

  return null;
}
