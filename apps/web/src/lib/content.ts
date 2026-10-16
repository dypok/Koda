// Carga de contenido declarativo (content/languages/*) con code-splitting por módulo.

export interface ContentAnswer {
  id: string;
  label?: string;
  body: string;
  is_correct: boolean;
  language?: string;
  position?: number;
  explanation?: string | null;
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
  accepted_answers?: string[];
  aliases?: string[];
  case_sensitive?: boolean;
  line_number?: number;
  blocks?: Array<{ id: string; body: string; position?: number }>;
  correct_order?: string[];
  pairs?: Array<{ left: { id: string; body: string }; right: { id: string; body: string } }>;
  epsilon?: number;
  starter_code?: string;
  accepted_tokens?: string[];
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
  'python/fundamentos-de-python': () => import('../../../../content/languages/python/modules/python1/01_fundamentos/module.json'),
  'python/variables-y-tipos-de-datos': () => import('../../../../content/languages/python/modules/python1/02_variables/module.json'),
  'python/operadores-y-expresiones': () => import('../../../../content/languages/python/modules/python1/03_operadores/module.json'),
  'python/entrada-salida-y-strings': () => import('../../../../content/languages/python/modules/python1/04_io_strings/module.json'),
  'python/condicionales': () => import('../../../../content/languages/python/modules/python1/05_condicionales/module.json'),
  'python/bucles-for': () => import('../../../../content/languages/python/modules/python1/06_bucles_for/module.json'),
  'python/bucles-while': () => import('../../../../content/languages/python/modules/python1/07_bucles_while/module.json'),
  'python/listas-y-tuplas': () => import('../../../../content/languages/python/modules/python1/08_listas_tuplas/module.json'),
  'python/diccionarios-y-sets': () => import('../../../../content/languages/python/modules/python1/09_diccionarios_sets/module.json'),
  'python/funciones-fundamentales': () => import('../../../../content/languages/python/modules/python1/10_funciones/module.json'),
  'python/comprensiones': () => import('../../../../content/languages/python/modules/python2/01_comprensiones/module.json'),
  'python/funciones-avanzadas': () => import('../../../../content/languages/python/modules/python2/02_funciones_avanzadas/module.json'),
  'python/modulos-y-paquetes': () => import('../../../../content/languages/python/modules/python2/03_modulos_paquetes/module.json'),
  'python/manejo-de-excepciones': () => import('../../../../content/languages/python/modules/python2/04_manejo_excepciones/module.json'),
  'python/archivos-txt-csv-json': () => import('../../../../content/languages/python/modules/python2/05_archivos_io/module.json'),
  'python/poo-clases-y-objetos': () => import('../../../../content/languages/python/modules/python2/06_poo_clases/module.json'),
  'python/poo-herencia-y-polimorfismo': () => import('../../../../content/languages/python/modules/python2/07_poo_herencia/module.json'),
  'python/datetime-y-regex': () => import('../../../../content/languages/python/modules/python2/08_datetime_regex/module.json'),
  'python/pip-entornos-y-git': () => import('../../../../content/languages/python/modules/python2/09_pip_git/module.json'),
  'python/testing-con-pytest': () => import('../../../../content/languages/python/modules/python2/10_testing_pytest/module.json'),
  'python/iteradores-y-generadores': () => import('../../../../content/languages/python/modules/python3/01_iteradores_generadores/module.json'),
  'python/decoradores': () => import('../../../../content/languages/python/modules/python3/02_decoradores/module.json'),
  'python/context-managers': () => import('../../../../content/languages/python/modules/python3/03_context_managers/module.json'),
  'python/type-hints-y-dataclasses': () => import('../../../../content/languages/python/modules/python3/04_type_hints/module.json'),
  'python/programacion-funcional': () => import('../../../../content/languages/python/modules/python3/05_funcional/module.json'),
  'python/concurrencia-asyncio': () => import('../../../../content/languages/python/modules/python3/06_concurrencia_asyncio/module.json'),
  'python/buenas-practicas-pep8': () => import('../../../../content/languages/python/modules/python3/07_buenas_practicas/module.json'),
  'python/logging-y-empaquetado': () => import('../../../../content/languages/python/modules/python3/08_logging_empaquetado/module.json'),
  'python/rendimiento-y-profiling': () => import('../../../../content/languages/python/modules/python3/09_profiling/module.json'),
  'python/patrones-de-diseno': () => import('../../../../content/languages/python/modules/python3/10_patrones_diseno/module.json'),
  'python/fastapi-http-rest': () => import('../../../../content/languages/python/modules/fastapi/01_http_rest/module.json'),
  'python/fastapi-pydantic': () => import('../../../../content/languages/python/modules/fastapi/02_pydantic/module.json'),
  'python/fastapi-sqlalchemy-alembic': () => import('../../../../content/languages/python/modules/fastapi/03_sqlalchemy/module.json'),
  'python/fastapi-auth-jwt': () => import('../../../../content/languages/python/modules/fastapi/04_auth_jwt/module.json'),
  'python/fastapi-docker-deploy': () => import('../../../../content/languages/python/modules/fastapi/05_docker_deploy/module.json'),
  'python/django-mtv-routing': () => import('../../../../content/languages/python/modules/django/01_mtv_routing/module.json'),
  'python/django-orm-models': () => import('../../../../content/languages/python/modules/django/02_orm_modelos/module.json'),
  'python/django-forms-admin': () => import('../../../../content/languages/python/modules/django/03_forms_admin/module.json'),
  'python/django-rest-framework': () => import('../../../../content/languages/python/modules/django/04_drf_apis/module.json'),
  'python/django-auth-security-deploy': () => import('../../../../content/languages/python/modules/django/05_auth_seguridad_deploy/module.json'),
  'python/numpy-fundamentos': () => import('../../../../content/languages/python/modules/data_analytics/01_numpy/module.json'),
  'python/pandas-series-dataframes': () => import('../../../../content/languages/python/modules/data_analytics/02_pandas_series_df/module.json'),
  'python/pandas-limpieza-transformacion': () => import('../../../../content/languages/python/modules/data_analytics/03_pandas_limpieza/module.json'),
  'python/pandas-agrupaciones-merges': () => import('../../../../content/languages/python/modules/data_analytics/04_pandas_agrupaciones/module.json'),
  'python/matplotlib-seaborn': () => import('../../../../content/languages/python/modules/data_analytics/05_matplotlib_seaborn/module.json'),
  'python/plotly-interactivo': () => import('../../../../content/languages/python/modules/data_analytics/06_plotly_interactivo/module.json'),
  'python/analisis-exploratorio-eda': () => import('../../../../content/languages/python/modules/data_analytics/07_eda_estadistica/module.json'),
  'python/sql-con-python': () => import('../../../../content/languages/python/modules/data_analytics/08_sql_python/module.json'),
  'python/scikit-learn-intro-ml': () => import('../../../../content/languages/python/modules/data_analytics/09_scikit_learn_ml/module.json'),
  'python/streamlit-dashboards': () => import('../../../../content/languages/python/modules/data_analytics/10_streamlit_dashboard/module.json'),
  'python/ia-llms-y-prompts': () => import('../../../../content/languages/python/modules/ai_agents/01_llms_prompts/module.json'),
  'python/ia-apis-modelos': () => import('../../../../content/languages/python/modules/ai_agents/02_apis_modelos/module.json'),
  'python/ia-salidas-estructuradas': () => import('../../../../content/languages/python/modules/ai_agents/03_salidas_estructuradas/module.json'),
  'python/ia-function-calling': () => import('../../../../content/languages/python/modules/ai_agents/04_function_calling/module.json'),
  'python/ia-memoria-y-contexto': () => import('../../../../content/languages/python/modules/ai_agents/05_memoria_contexto/module.json'),
  'python/ia-embeddings-vector-dbs': () => import('../../../../content/languages/python/modules/ai_agents/06_embeddings_vector_dbs/module.json'),
  'python/ia-rag-recuperacion': () => import('../../../../content/languages/python/modules/ai_agents/07_rag/module.json'),
  'python/ia-agentes-bucle-react': () => import('../../../../content/languages/python/modules/ai_agents/08_agentes_react/module.json'),
  'python/ia-guardrails-y-evaluacion': () => import('../../../../content/languages/python/modules/ai_agents/09_guardrails_eval/module.json'),
  'python/ia-proyecto-agente-completo': () => import('../../../../content/languages/python/modules/ai_agents/10_proyecto_agente/module.json'),
  'python/apex-master-gate': () => import('../../../../content/languages/python/modules/apex/01_apex_master_gate/module.json'),
};

const BANKS: Record<string, BankImporter> = {
  'python/fundamentos-de-python': () => import('../../../../content/languages/python/modules/python1/01_fundamentos/bank.json'),
  'python/variables-y-tipos-de-datos': () => import('../../../../content/languages/python/modules/python1/02_variables/bank.json'),
  'python/operadores-y-expresiones': () => import('../../../../content/languages/python/modules/python1/03_operadores/bank.json'),
  'python/entrada-salida-y-strings': () => import('../../../../content/languages/python/modules/python1/04_io_strings/bank.json'),
  'python/condicionales': () => import('../../../../content/languages/python/modules/python1/05_condicionales/bank.json'),
  'python/bucles-for': () => import('../../../../content/languages/python/modules/python1/06_bucles_for/bank.json'),
  'python/bucles-while': () => import('../../../../content/languages/python/modules/python1/07_bucles_while/bank.json'),
  'python/listas-y-tuplas': () => import('../../../../content/languages/python/modules/python1/08_listas_tuplas/bank.json'),
  'python/diccionarios-y-sets': () => import('../../../../content/languages/python/modules/python1/09_diccionarios_sets/bank.json'),
  'python/funciones-fundamentales': () => import('../../../../content/languages/python/modules/python1/10_funciones/bank.json'),
  'python/comprensiones': () => import('../../../../content/languages/python/modules/python2/01_comprensiones/bank.json'),
  'python/funciones-avanzadas': () => import('../../../../content/languages/python/modules/python2/02_funciones_avanzadas/bank.json'),
  'python/modulos-y-paquetes': () => import('../../../../content/languages/python/modules/python2/03_modulos_paquetes/bank.json'),
  'python/manejo-de-excepciones': () => import('../../../../content/languages/python/modules/python2/04_manejo_excepciones/bank.json'),
  'python/archivos-txt-csv-json': () => import('../../../../content/languages/python/modules/python2/05_archivos_io/bank.json'),
  'python/poo-clases-y-objetos': () => import('../../../../content/languages/python/modules/python2/06_poo_clases/bank.json'),
  'python/poo-herencia-y-polimorfismo': () => import('../../../../content/languages/python/modules/python2/07_poo_herencia/bank.json'),
  'python/datetime-y-regex': () => import('../../../../content/languages/python/modules/python2/08_datetime_regex/bank.json'),
  'python/pip-entornos-y-git': () => import('../../../../content/languages/python/modules/python2/09_pip_git/bank.json'),
  'python/testing-con-pytest': () => import('../../../../content/languages/python/modules/python2/10_testing_pytest/bank.json'),
  'python/iteradores-y-generadores': () => import('../../../../content/languages/python/modules/python3/01_iteradores_generadores/bank.json'),
  'python/decoradores': () => import('../../../../content/languages/python/modules/python3/02_decoradores/bank.json'),
  'python/context-managers': () => import('../../../../content/languages/python/modules/python3/03_context_managers/bank.json'),
  'python/type-hints-y-dataclasses': () => import('../../../../content/languages/python/modules/python3/04_type_hints/bank.json'),
  'python/programacion-funcional': () => import('../../../../content/languages/python/modules/python3/05_funcional/bank.json'),
  'python/concurrencia-asyncio': () => import('../../../../content/languages/python/modules/python3/06_concurrencia_asyncio/bank.json'),
  'python/buenas-practicas-pep8': () => import('../../../../content/languages/python/modules/python3/07_buenas_practicas/bank.json'),
  'python/logging-y-empaquetado': () => import('../../../../content/languages/python/modules/python3/08_logging_empaquetado/bank.json'),
  'python/rendimiento-y-profiling': () => import('../../../../content/languages/python/modules/python3/09_profiling/bank.json'),
  'python/patrones-de-diseno': () => import('../../../../content/languages/python/modules/python3/10_patrones_diseno/bank.json'),
  'python/fastapi-http-rest': () => import('../../../../content/languages/python/modules/fastapi/01_http_rest/bank.json'),
  'python/fastapi-pydantic': () => import('../../../../content/languages/python/modules/fastapi/02_pydantic/bank.json'),
  'python/fastapi-sqlalchemy-alembic': () => import('../../../../content/languages/python/modules/fastapi/03_sqlalchemy/bank.json'),
  'python/fastapi-auth-jwt': () => import('../../../../content/languages/python/modules/fastapi/04_auth_jwt/bank.json'),
  'python/fastapi-docker-deploy': () => import('../../../../content/languages/python/modules/fastapi/05_docker_deploy/bank.json'),
  'python/django-mtv-routing': () => import('../../../../content/languages/python/modules/django/01_mtv_routing/bank.json'),
  'python/django-orm-models': () => import('../../../../content/languages/python/modules/django/02_orm_modelos/bank.json'),
  'python/django-forms-admin': () => import('../../../../content/languages/python/modules/django/03_forms_admin/bank.json'),
  'python/django-rest-framework': () => import('../../../../content/languages/python/modules/django/04_drf_apis/bank.json'),
  'python/django-auth-security-deploy': () => import('../../../../content/languages/python/modules/django/05_auth_seguridad_deploy/bank.json'),
  'python/numpy-fundamentos': () => import('../../../../content/languages/python/modules/data_analytics/01_numpy/bank.json'),
  'python/pandas-series-dataframes': () => import('../../../../content/languages/python/modules/data_analytics/02_pandas_series_df/bank.json'),
  'python/pandas-limpieza-transformacion': () => import('../../../../content/languages/python/modules/data_analytics/03_pandas_limpieza/bank.json'),
  'python/pandas-agrupaciones-merges': () => import('../../../../content/languages/python/modules/data_analytics/04_pandas_agrupaciones/bank.json'),
  'python/matplotlib-seaborn': () => import('../../../../content/languages/python/modules/data_analytics/05_matplotlib_seaborn/bank.json'),
  'python/plotly-interactivo': () => import('../../../../content/languages/python/modules/data_analytics/06_plotly_interactivo/bank.json'),
  'python/analisis-exploratorio-eda': () => import('../../../../content/languages/python/modules/data_analytics/07_eda_estadistica/bank.json'),
  'python/sql-con-python': () => import('../../../../content/languages/python/modules/data_analytics/08_sql_python/bank.json'),
  'python/scikit-learn-intro-ml': () => import('../../../../content/languages/python/modules/data_analytics/09_scikit_learn_ml/bank.json'),
  'python/streamlit-dashboards': () => import('../../../../content/languages/python/modules/data_analytics/10_streamlit_dashboard/bank.json'),
  'python/ia-llms-y-prompts': () => import('../../../../content/languages/python/modules/ai_agents/01_llms_prompts/bank.json'),
  'python/ia-apis-modelos': () => import('../../../../content/languages/python/modules/ai_agents/02_apis_modelos/bank.json'),
  'python/ia-salidas-estructuradas': () => import('../../../../content/languages/python/modules/ai_agents/03_salidas_estructuradas/bank.json'),
  'python/ia-function-calling': () => import('../../../../content/languages/python/modules/ai_agents/04_function_calling/bank.json'),
  'python/ia-memoria-y-contexto': () => import('../../../../content/languages/python/modules/ai_agents/05_memoria_contexto/bank.json'),
  'python/ia-embeddings-vector-dbs': () => import('../../../../content/languages/python/modules/ai_agents/06_embeddings_vector_dbs/bank.json'),
  'python/ia-rag-recuperacion': () => import('../../../../content/languages/python/modules/ai_agents/07_rag/bank.json'),
  'python/ia-agentes-bucle-react': () => import('../../../../content/languages/python/modules/ai_agents/08_agentes_react/bank.json'),
  'python/ia-guardrails-y-evaluacion': () => import('../../../../content/languages/python/modules/ai_agents/09_guardrails_eval/bank.json'),
  'python/ia-proyecto-agente-completo': () => import('../../../../content/languages/python/modules/ai_agents/10_proyecto_agente/bank.json'),
  'python/apex-master-gate': () => import('../../../../content/languages/python/modules/apex/01_apex_master_gate/bank.json'),
};

function normalizeExercise(rawEx: any, fallbackSuffix: string | number): ContentExercise {
  const answers: ContentAnswer[] = Array.isArray(rawEx.answers)
    ? rawEx.answers.map((a: any, idx: number) => ({
        id: a.id || `ans_${idx + 1}`,
        label: a.label || (typeof a.id === 'string' && a.id.length === 1 ? a.id.toUpperCase() : String.fromCharCode(65 + idx)),
        body: a.body ?? a.text ?? '',
        is_correct: Boolean(a.is_correct) || (rawEx.correct_option_id ? a.id === rawEx.correct_option_id : false),
        language: a.language,
        position: a.position ?? idx + 1,
        explanation: a.explanation ?? null,
      }))
    : Array.isArray(rawEx.options)
    ? rawEx.options.map((opt: any, idx: number) => ({
        id: opt.id || `ans_${idx + 1}`,
        label: opt.label || (typeof opt.id === 'string' && opt.id.length === 1 ? opt.id.toUpperCase() : String.fromCharCode(65 + idx)),
        body: opt.text ?? opt.body ?? '',
        is_correct: opt.id === rawEx.correct_option_id || Boolean(opt.is_correct),
        language: opt.language,
        position: opt.position ?? idx + 1,
        explanation: opt.explanation ?? null,
      }))
    : [];

  const derivedCorrectIds = answers.filter((a) => a.is_correct).map((a) => a.id);
  const correct_answer_ids: string[] =
    Array.isArray(rawEx.correct_answer_ids) && rawEx.correct_answer_ids.length > 0
      ? rawEx.correct_answer_ids
      : rawEx.correct_option_id
      ? [rawEx.correct_option_id]
      : derivedCorrectIds;

  return {
    id: rawEx.id || `ex-${fallbackSuffix}`,
    type: rawEx.type || 'single_choice',
    difficulty: rawEx.difficulty || 'medium',
    prompt: rawEx.prompt || '',
    prompt_code: rawEx.prompt_code ?? null,
    answers,
    correct_answer_ids,
    explanation: rawEx.explanation || '',
    hints: Array.isArray(rawEx.hints) ? rawEx.hints : rawEx.hint ? [rawEx.hint] : [],
    score: typeof rawEx.score === 'number' ? rawEx.score : undefined,
    accepted_answers: Array.isArray(rawEx.accepted_answers) ? rawEx.accepted_answers : undefined,
    aliases: Array.isArray(rawEx.aliases) ? rawEx.aliases : undefined,
    case_sensitive: typeof rawEx.case_sensitive === 'boolean' ? rawEx.case_sensitive : undefined,
    line_number: typeof rawEx.line_number === 'number' ? rawEx.line_number : undefined,
    blocks: Array.isArray(rawEx.blocks) ? rawEx.blocks : undefined,
    correct_order: Array.isArray(rawEx.correct_order) ? rawEx.correct_order : undefined,
    pairs: Array.isArray(rawEx.pairs) ? rawEx.pairs : undefined,
    epsilon: typeof rawEx.epsilon === 'number' ? rawEx.epsilon : undefined,
    starter_code: typeof rawEx.starter_code === 'string' ? rawEx.starter_code : undefined,
    accepted_tokens: Array.isArray(rawEx.accepted_tokens) ? rawEx.accepted_tokens : undefined,
  };
}

function normalizeLesson(raw: any, index: number): ContentLesson {
  const examples: ContentExample[] = Array.isArray(raw.examples)
    ? raw.examples
    : raw.code_example
    ? [{ code: raw.code_example, output: raw.expected_output, explanation: raw.tip_markdown }]
    : [];

  const rawEx = raw.exercises?.[0] || raw.exercise;
  const exercises: ContentExercise[] = Array.isArray(raw.exercises)
    ? raw.exercises.map((ex: any, exIdx: number) => normalizeExercise(ex, `${raw.id || index}-${exIdx}`))
    : rawEx
    ? [normalizeExercise(rawEx, raw.id || index)]
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

    return rawList.map((q: any, idx: number) => normalizeExercise(q, `bank-${idx + 1}`));
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
