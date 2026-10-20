/**
 * Helper canónico para resolución bidireccional de alias y normalización
 * de identificadores de secciones y lecciones a través de todo el frontend.
 *
 * Conecta los identificadores del backend (ej. py-m01, py-boss-logic, py-apex-1),
 * los mocks de lecciones (ej. les-01, les-miniboss, les-boss) y los slugs de contenido
 * (ej. fundamentos-de-python, condicionales, funciones-fundamentales).
 *
 * AISLAMIENTO ESTRICTO: Ningún alias se genera desprovisto de prefijo de curso
 * (ej. nunca '01', '02', 'miniboss', 'apex' desnudas) para evitar colisión
 * cruzada entre cursos (ej. Python 1 vs Python 2).
 */

const SLUG_TO_ALIASES: Record<string, string[]> = {
  // Python 1: Fundamentos
  'fundamentos-de-python': ['py-m01', 'py1-01', 'py-01', 'les-01', 'sec_py1_01_01'],
  'variables-y-tipos-de-datos': ['py-m02', 'py1-02', 'py-02', 'les-02', 'sec_py1_02_01'],
  'operadores-y-expresiones': ['py-m03', 'py1-03', 'py-03', 'les-03', 'sec_py1_03_01'],
  'entrada-salida-y-strings': ['py-m04', 'py1-04', 'py-04', 'les-04', 'sec_py1_04_01'],
  'condicionales': ['py-m04', 'py1-04', 'py-04', 'les-04', 'sec_py1_04_01'],
  'guardian-de-la-logica': ['py-boss-logic', 'py1-miniboss', 'les-miniboss', 'py-miniboss'],
  'bucles-for': ['py-m05', 'py1-05', 'py-05', 'les-05', 'sec_py1_05_01'],
  'bucles-while': ['py-m06', 'py1-06', 'py-06', 'les-06', 'sec_py1_06_01'],
  'listas-y-tuplas': ['py-m07', 'py1-07', 'py-07', 'les-07', 'sec_py1_07_01'],
  'diccionarios-y-sets': ['py-m08', 'py1-08', 'py-08', 'les-08', 'sec_py1_08_01'],
  'funciones-y-errores': ['py-m09', 'py1-09', 'py-09', 'les-09', 'sec_py1_09_01'],
  'funciones-fundamentales': ['py-apex-1', 'py1-apex', 'les-boss', 'py-apex', 'py-boss'],

  // Python 2: Intermedio
  'comprensiones': ['py2-m01', 'py2-01', 'les2-01', 'sec_py2_01_01'],
  'funciones-avanzadas': ['py2-m02', 'py2-02', 'les2-02', 'sec_py2_02_01'],
  'modulos-y-paquetes': ['py2-m03', 'py2-03', 'les2-03', 'sec_py2_03_01'],
  'manejo-de-excepciones': ['py2-m04', 'py2-04', 'les2-04', 'sec_py2_04_01'],
  'centinela-modular': ['py2-miniboss', 'py2-mb'],
  'archivos-txt-csv-json': ['py2-m05', 'py2-05', 'les2-05', 'sec_py2_05_01'],
  'archivos-io': ['py2-m05', 'py2-05', 'les2-05', 'sec_py2_05_01'],
  'poo-clases-y-objetos': ['py2-m06', 'py2-06', 'les2-06', 'sec_py2_06_01'],
  'poo-herencia': ['py2-m07', 'py2-07', 'les2-07', 'sec_py2_07_01'],
  'poo-herencia-y-polimorfismo': ['py2-m07', 'py2-07', 'les2-07', 'sec_py2_07_01'],
  'datetime-y-regex': ['py2-m08', 'py2-08', 'les2-08', 'sec_py2_08_01'],
  'pip-venv-y-git': ['py2-m09', 'py2-09', 'les2-09', 'sec_py2_09_01'],
  'pip-entornos-y-git': ['py2-m09', 'py2-09', 'les2-09', 'sec_py2_09_01'],
  'testing-con-pytest': ['py2-m10', 'py2-10', 'les2-10', 'sec_py2_10_01'],
  'apex-boss-gate-2': ['py2-boss', 'py2-apex', 'py2-apex-gate'],

  // Python 3: Avanzado
  'iteradores-y-generadores': ['py3-m01', 'py3-01', 'les3-01', 'sec_py3_01_01'],
  'decoradores': ['py3-m02', 'py3-02', 'les3-02', 'sec_py3_02_01'],
  'context-managers': ['py3-m03', 'py3-03', 'les3-03', 'sec_py3_03_01'],
  'type-hints-y-dataclasses': ['py3-m04', 'py3-04', 'les3-04', 'sec_py3_04_01'],
  'guardian-del-patron': ['py3-miniboss', 'py3-mb', 'guardian-del-patron'],
  'programacion-funcional': ['py3-m05', 'py3-05', 'les3-05', 'sec_py3_05_01'],
  'concurrencia-y-asyncio': ['py3-m06', 'py3-06', 'les3-06', 'sec_py3_06_01'],
  'pep8-y-ruff': ['py3-m07', 'py3-07', 'les3-07', 'sec_py3_07_01'],
  'logging-y-empaquetado': ['py3-m08', 'py3-08', 'les3-08', 'sec_py3_08_01'],
  'profiling-y-memoria': ['py3-m09', 'py3-09', 'les3-09', 'sec_py3_09_01'],
  'patrones-de-diseno': ['py3-m10', 'py3-10', 'les3-10', 'sec_py3_10_01'],
  'apex-boss-gate-3': ['py3-boss', 'py3-apex', 'py3-apex-gate'],

  // FastAPI
  'fastapi-http-asgi': ['fa-m01', 'fa-01'],
  'pydantic-v2': ['fa-m02', 'fa-02'],
  'sqlalchemy-alembic': ['fa-m03', 'fa-03'],
  'auth-jwt': ['fa-m04', 'fa-04'],
  'fastapi-docker-deploy': ['fa-m05', 'fa-05', 'fa-boss'],

  // Django
  'django-mvt': ['dj-m01', 'dj-01'],
  'django-orm': ['dj-m02', 'dj-02'],
  'django-forms-admin': ['dj-m03', 'dj-03'],
  'drf-apis': ['dj-m04', 'dj-04'],
  'django-auth-security-deploy': ['dj-m05', 'dj-05', 'dj-boss'],

  // Data Analytics
  'numpy-vectorizado': ['da-m01', 'da-01'],
  'pandas-series-df': ['da-m02', 'da-02'],
  'pandas-limpieza': ['da-m03', 'da-03'],
  'pandas-agrupaciones': ['da-m04', 'da-04'],
  'reto-wrangling': ['da-miniboss', 'da-mb'],
  'matplotlib-seaborn': ['da-m05', 'da-05'],
  'plotly-interactivo': ['da-m06', 'da-06'],
  'eda-estadistica': ['da-m07', 'da-07'],
  'sql-python': ['da-m08', 'da-08'],
  'scikit-learn-ml': ['da-m09', 'da-09'],
  'streamlit-dashboards': ['da-10', 'da-boss'],

  // AI & Agents
  'llms-prompts': ['ia-m01', 'ia-01'],
  'apis-modelos': ['ia-m02', 'ia-02'],
  'salidas-estructuradas': ['ia-m03', 'ia-03'],
  'function-calling': ['ia-m04', 'ia-04'],
  'tool-caller-master': ['ia-miniboss', 'ia-mb'],
  'memoria-contexto': ['ia-m05', 'ia-05'],
  'embeddings-vector-dbs': ['ia-m06', 'ia-06'],
  'rag': ['ia-m07', 'ia-07'],
  'agentes-react': ['ia-m08', 'ia-08'],
  'guardrails-eval': ['ia-m09', 'ia-09'],
  'ia-proyecto-agente-completo': ['ia-10', 'ia-boss'],
};

/**
 * Devuelve todos los alias conocidos para un identificador de sección,
 * garantizando que todos los alias tengan prefijo de módulo.
 */
export function getSectionAliases(id: string): string[] {
  if (!id) return [];
  const normalized = id.toLowerCase().trim();
  const aliases = new Set<string>([normalized, id]);

  const clean = normalized.replace(/[^a-z0-9]/g, '');
  // Solo agregar si contiene al menos letras para evitar claves numéricas desnudas como '01'
  if (/[a-z]/.test(clean)) {
    aliases.add(clean);
  }

  const isMiniboss =
    normalized.includes('boss-logic') ||
    normalized.includes('guardi') ||
    normalized.includes('miniboss') ||
    normalized.includes('centinela') ||
    normalized === 'mb' ||
    normalized === 'py-mb' ||
    normalized === 'py2-mb' ||
    normalized === 'py3-mb';

  // Detección numérica sólo para lecciones estándar (no bosses)
  if (!isMiniboss) {
    const explicitCourseMatch = /^(?:py|python|les|sec_py)(\d+)[-_]?(?:m|les|mod|sec)?0?(\d+)$/.exec(normalized);
    const py1Match = /^(?:py|python|les)[-_](?:m|les|mod|sec)?0?(\d+)$/.exec(normalized);

    if (explicitCourseMatch) {
      const courseNum = explicitCourseMatch[1];
      const num = parseInt(explicitCourseMatch[2], 10);
      const numPadded = String(num).padStart(2, '0');

      if (courseNum === '1') {
        aliases.add(`py-m${numPadded}`);
        aliases.add(`py-m${num}`);
        aliases.add(`py-${numPadded}`);
        aliases.add(`py-${num}`);
        aliases.add(`py1-m${numPadded}`);
        aliases.add(`py1-${numPadded}`);
        aliases.add(`les-${numPadded}`);
        aliases.add(`les-${num}`);
        aliases.add(`sec_py1_${numPadded}_01`);
      } else {
        aliases.add(`py${courseNum}-m${numPadded}`);
        aliases.add(`py${courseNum}-m${num}`);
        aliases.add(`py${courseNum}-${numPadded}`);
        aliases.add(`py${courseNum}-${num}`);
        aliases.add(`les${courseNum}-${numPadded}`);
        aliases.add(`sec_py${courseNum}_${numPadded}_01`);
      }
    } else if (py1Match) {
      const num = parseInt(py1Match[1], 10);
      const numPadded = String(num).padStart(2, '0');
      aliases.add(`py-m${numPadded}`);
      aliases.add(`py-m${num}`);
      aliases.add(`py-${numPadded}`);
      aliases.add(`py-${num}`);
      aliases.add(`py1-m${numPadded}`);
      aliases.add(`py1-${numPadded}`);
      aliases.add(`les-${numPadded}`);
      aliases.add(`les-${num}`);
      aliases.add(`sec_py1_${numPadded}_01`);
    }
  }

  // Mini-boss estrictamente particionado por curso / track
  if (isMiniboss) {
    if (normalized.includes('da') || normalized.includes('wrangling')) {
      aliases.add('da-miniboss');
      aliases.add('da-mb');
      aliases.add('reto-wrangling');
    } else if (normalized.includes('ia') || normalized.includes('tool-caller') || normalized.includes('agente')) {
      aliases.add('ia-miniboss');
      aliases.add('ia-mb');
      aliases.add('tool-caller-master');
    } else if (normalized.includes('py2') || normalized.includes('centinela')) {
      aliases.add('py2-miniboss');
      aliases.add('py2-mb');
      aliases.add('centinela-modular');
    } else if (normalized.includes('py3') || normalized.includes('patron')) {
      aliases.add('py3-miniboss');
      aliases.add('py3-mb');
      aliases.add('guardian-del-patron');
    } else if (
      normalized.includes('boss-logic') ||
      normalized.includes('guardi') ||
      normalized.includes('py-miniboss') ||
      normalized.includes('py1') ||
      normalized.startsWith('py-') ||
      normalized === 'mb' ||
      normalized === 'les-miniboss'
    ) {
      aliases.add('py-boss-logic');
      aliases.add('py1-miniboss');
      aliases.add('les-miniboss');
      aliases.add('py-miniboss');
      aliases.add('guardian-de-la-logica');
    }
  }

  // Apex / Boss final estrictamente particionado por curso / track (sólo si no es un mini-boss)
  const isFinalBoss =
    !isMiniboss &&
    (normalized.includes('apex') ||
      normalized.includes('boss') ||
      normalized === 'omega' ||
      normalized === 'ω' ||
      normalized.includes('master-gate'));

  if (isFinalBoss) {
    if (normalized.includes('da') || normalized.includes('analytics') || normalized.includes('streamlit')) {
      aliases.add('da-boss');
      aliases.add('da-10');
      aliases.add('streamlit-dashboards');
    } else if (normalized.includes('ia') || normalized.includes('agente')) {
      aliases.add('ia-boss');
      aliases.add('ia-10');
      aliases.add('ia-proyecto-agente-completo');
    } else if (normalized.includes('fa') || normalized.includes('fastapi')) {
      aliases.add('fa-boss');
      aliases.add('fa-05');
      aliases.add('fa-m05');
      aliases.add('fastapi-docker-deploy');
    } else if (normalized.includes('dj') || normalized.includes('django')) {
      aliases.add('dj-boss');
      aliases.add('dj-05');
      aliases.add('dj-m05');
      aliases.add('django-auth-security-deploy');
    } else if (normalized.includes('py2') || normalized.includes('intermedio') || normalized.includes('pytest')) {
      aliases.add('py2-boss');
      aliases.add('py2-apex');
      aliases.add('py2-apex-gate');
      aliases.add('testing-con-pytest');
    } else if (normalized.includes('py3') || normalized.includes('avanzado') || normalized.includes('patrones')) {
      aliases.add('py3-boss');
      aliases.add('py3-apex');
      aliases.add('py3-apex-gate');
      aliases.add('patrones-de-diseno');
    } else if (
      normalized.includes('apex-1') ||
      normalized.includes('fundamentales') ||
      normalized.includes('py1') ||
      normalized === 'py-apex-1' ||
      normalized === 'les-boss' ||
      normalized === 'py-boss' ||
      normalized === 'py-apex' ||
      normalized === 'omega' ||
      normalized === 'ω'
    ) {
      aliases.add('py-apex-1');
      aliases.add('py1-apex');
      aliases.add('les-boss');
      aliases.add('py-boss');
      aliases.add('py-apex');
      aliases.add('apex-1');
      aliases.add('funciones-fundamentales');
    }
  }

  // Comprobar mapa declarativo de slugs
  for (const [slug, list] of Object.entries(SLUG_TO_ALIASES)) {
    if (aliases.has(slug) || list.some((a) => aliases.has(a))) {
      aliases.add(slug);
      for (const item of list) {
        aliases.add(item);
      }
    }
  }

  return Array.from(aliases);
}

/**
 * Consulta la cantidad máxima de estrellas obtenidas para una sección dada,
 * evaluando todas las posibles variantes de clave en el diccionario provisto.
 */
export function getStoredStarForSection(
  sectionId: string,
  storedMap: Record<string, number>
): number {
  if (!sectionId || !storedMap) return 0;
  const direct = storedMap[sectionId];
  if (typeof direct === 'number' && direct > 0) return direct;

  const aliases = getSectionAliases(sectionId);
  let best = 0;
  for (const a of aliases) {
    const val = storedMap[a];
    if (typeof val === 'number' && val > best) {
      best = val;
    }
  }
  return best;
}

/**
 * Determina si una sección o lección está registrada como completada,
 * contrastando sus alias con el Set de identificadores completados.
 */
export function isSectionCompletedInSet(
  sectionId: string,
  completedSet: Set<string>
): boolean {
  if (!sectionId || !completedSet || completedSet.size === 0) return false;
  if (completedSet.has(sectionId)) return true;

  const aliases = getSectionAliases(sectionId);
  for (const a of aliases) {
    if (completedSet.has(a)) return true;
  }
  return false;
}

/**
 * Sanea el mapa de estrellas almacenadas eliminando cualquier clave desnuda
 * o residual que cause colisiones entre módulos (ej. '01', '02', 'miniboss', 'apex').
 * También descarta bosses huérfanos de ramas avanzadas si no existe progreso
 * inicial registrado en esa rama (ej. reto-wrangling o da-miniboss sin da-01).
 */
export function sanitizeStoredStarsCache(stored: Record<string, number>): Record<string, number> {
  if (!stored || typeof stored !== 'object') return {};
  const clean: Record<string, number> = {};

  const hasDaInitial = Boolean(stored['da-01'] || stored['da-m01'] || stored['da-02']);
  const hasIaInitial = Boolean(stored['ia-01'] || stored['ia-m01'] || stored['ia-02']);
  const hasFaInitial = Boolean(stored['fa-01'] || stored['fa-m01']);
  const hasDjInitial = Boolean(stored['dj-01'] || stored['dj-m01']);

  for (const [key, val] of Object.entries(stored)) {
    const k = key.trim().toLowerCase();
    // 1. Purgar claves numéricas desnudas o genéricas globales
    if (/^\d+$/.test(k) || k === 'miniboss' || k === 'boss' || k === 'apex' || k === 'mb') {
      continue;
    }
    // 2. Purgar leaks fantasma de Data Analytics (Reto Wrangling, etc.)
    if (!hasDaInitial && (k.includes('wrangling') || k.startsWith('da-miniboss') || k === 'da-mb' || k.startsWith('da-boss') || k === 'streamlit-dashboards')) {
      continue;
    }
    // 3. Purgar leaks fantasma de AI & Agents (Tool Caller, etc.)
    if (!hasIaInitial && (k.includes('tool-caller') || k.startsWith('ia-miniboss') || k === 'ia-mb' || k.startsWith('ia-boss') || k.includes('agente-completo'))) {
      continue;
    }
    // 4. Purgar leaks fantasma de FastAPI
    if (!hasFaInitial && (k === 'fa-boss' || k === 'fastapi-docker-deploy')) {
      continue;
    }
    // 5. Purgar leaks fantasma de Django
    if (!hasDjInitial && (k === 'dj-boss' || k === 'django-auth-security-deploy')) {
      continue;
    }

    clean[key] = val;
  }
  return clean;
}
