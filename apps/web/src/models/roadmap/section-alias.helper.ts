/**
 * Helper canónico para resolución bidireccional de alias y normalización
 * de identificadores de secciones y lecciones a través de todo el frontend.
 *
 * Conecta los identificadores del backend (ej. py-m01, py-boss-logic, py-apex-1),
 * los mocks de lecciones (ej. les-01, les-miniboss, les-boss) y los slugs de contenido
 * (ej. fundamentos-de-python, condicionales, funciones-fundamentales).
 */

const SLUG_TO_ALIASES: Record<string, string[]> = {
  // Python 1
  'fundamentos-de-python': ['py-m01', 'les-01', '01', 'interprete-y-print', 'sec_py1_01_01', 'les_py1_01_01'],
  'variables-y-tipos-de-datos': ['py-m02', 'les-02', '02', 'variables-y-tipos', 'sec_py1_02_01'],
  'operadores-y-expresiones': ['py-m03', 'les-03', '03', 'operadores-y-logica', 'sec_py1_03_01'],
  'entrada-salida-y-strings': ['py-m04', 'les-04', '04', 'io-strings', 'sec_py1_04_01'],
  'condicionales': ['py-m04', 'les-04', '04', 'sec_py1_04_01', 'sec_py1_05_01'],
  'guardian-de-la-logica': ['py-boss-logic', 'les-miniboss', 'miniboss', 'mb', 'py-miniboss'],
  'bucles-for': ['py-m05', 'les-05', 'les-06', '05', 'sec_py1_06_01'],
  'bucles-while': ['py-m06', 'les-06', 'les-07', '06', 'sec_py1_07_01'],
  'listas-y-tuplas': ['py-m07', 'les-08', '07', 'sec_py1_08_01'],
  'diccionarios-y-sets': ['py-m08', 'les-09', '08', 'sec_py1_09_01'],
  'funciones-y-errores': ['py-m09', 'py-m10', 'les-10', '09', '10', 'sec_py1_10_01'],
  'funciones-fundamentales': ['py-apex-1', 'les-boss', 'apex', 'py-apex', 'py-boss', 'apex-1'],

  // Python 2
  'comprensiones': ['py2-m01', 'py2-01', '01'],
  'funciones-avanzadas': ['py2-m02', 'py2-02', '02'],
  'modulos-y-paquetes': ['py2-m03', 'py2-03', '03'],
  'manejo-de-excepciones': ['py2-m04', 'py2-04', '04'],
  'centinela-modular': ['py2-miniboss', 'py2-mb', 'miniboss'],
  'archivos-txt-csv-json': ['py2-m05', 'py2-05', '05'],
  'archivos-io': ['py2-m05', 'py2-05', '05'],
  'poo-clases-y-objetos': ['py2-m06', 'py2-06', '06'],
  'poo-herencia': ['py2-m07', 'py2-07', '07'],
  'datetime-y-regex': ['py2-m08', 'py2-08', '08'],
  'pip-venv-y-git': ['py2-m09', 'py2-09', '09'],
  'testing-con-pytest': ['py2-boss', 'py2-m10', 'py2-10', '10', 'py2-apex'],

  // Python 3
  'iteradores-y-generadores': ['py3-m01', 'py3-01', '01'],
  'decoradores': ['py3-m02', 'py3-02', '02'],
  'context-managers': ['py3-m03', 'py3-03', '03'],
  'type-hints-y-dataclasses': ['py3-m04', 'py3-04', '04'],
  'guardian-del-patron': ['py3-miniboss', 'py3-mb', 'miniboss'],
  'programacion-funcional': ['py3-m05', 'py3-05', '05'],
  'concurrencia-y-asyncio': ['py3-m06', 'py3-06', '06'],
  'pep8-y-ruff': ['py3-m07', 'py3-07', '07'],
  'logging-y-empaquetado': ['py3-m08', 'py3-08', '08'],
  'profiling-y-memoria': ['py3-m09', 'py3-09', '09'],
  'patrones-de-diseno': ['py3-boss', 'py3-m10', 'py3-10', '10', 'py3-apex'],

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
 * Devuelve todos los alias conocidos para un identificador de sección.
 */
export function getSectionAliases(id: string): string[] {
  if (!id) return [];
  const normalized = id.toLowerCase().trim();
  const aliases = new Set<string>([normalized, id]);

  const clean = normalized.replace(/[^a-z0-9]/g, '');
  aliases.add(clean);

  // Mapeo por expresiones regulares
  const pyMatch = /^(?:py|python)?(\d*)[-_]?(?:m|les|mod|sec)?0?(\d+)/.exec(normalized);
  if (pyMatch) {
    const courseNum = pyMatch[1] || '1';
    const num = parseInt(pyMatch[2], 10);
    const numPadded = String(num).padStart(2, '0');

    if (courseNum === '1' || courseNum === '') {
      aliases.add(`py-m${numPadded}`);
      aliases.add(`py-m${num}`);
      aliases.add(`py-${numPadded}`);
      aliases.add(`py-${num}`);
      aliases.add(`les-${numPadded}`);
      aliases.add(`les-${num}`);
      aliases.add(numPadded);
      aliases.add(String(num));
    } else {
      aliases.add(`py${courseNum}-m${numPadded}`);
      aliases.add(`py${courseNum}-m${num}`);
      aliases.add(`py${courseNum}-${numPadded}`);
      aliases.add(`py${courseNum}-${num}`);
      aliases.add(`les${courseNum}-${numPadded}`);
    }
  }

  // Mini-boss
  if (
    normalized.includes('boss-logic') ||
    normalized.includes('guardi') ||
    normalized.includes('miniboss') ||
    normalized === 'mb' ||
    normalized.includes('centinela')
  ) {
    aliases.add('py-boss-logic');
    aliases.add('les-miniboss');
    aliases.add('miniboss');
    aliases.add('mb');
    aliases.add('py-miniboss');
    aliases.add('guardian-de-la-logica');
    if (normalized.includes('2') || normalized.includes('centinela')) {
      aliases.add('py2-miniboss');
      aliases.add('centinela-modular');
    }
    if (normalized.includes('3') || normalized.includes('patron')) {
      aliases.add('py3-miniboss');
      aliases.add('guardian-del-patron');
    }
  }

  // Apex / Boss final
  if (
    normalized.includes('apex') ||
    normalized.includes('boss') ||
    normalized === 'omega' ||
    normalized === 'ω' ||
    normalized.includes('master-gate')
  ) {
    if (normalized.includes('2') || normalized.includes('intermedio')) {
      aliases.add('py2-boss');
      aliases.add('py2-apex');
      aliases.add('testing-con-pytest');
    } else if (normalized.includes('3') || normalized.includes('avanzado')) {
      aliases.add('py3-boss');
      aliases.add('py3-apex');
      aliases.add('patrones-de-diseno');
    } else {
      aliases.add('py-apex-1');
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
