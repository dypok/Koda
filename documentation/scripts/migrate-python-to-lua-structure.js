#!/usr/bin/env node
/**
 * Migra el contenido de Python a la estructura canónica de Lua.
 *
 * - module.json: theory_markdown -> explanation; code_example -> examples[];
 *   exercise -> exercises[]; preguntas legacy -> sobre canónico.
 * - bank.json: options/correct_option_id/hint -> answers/correct_answer_ids/hints;
 *   contenedor configurable (array estilo Lua u objeto v2 {module_code, questions}).
 *
 * Uso:
 *   node documentation/scripts/migrate-python-to-lua-structure.js --dry-run
 *   node documentation/scripts/migrate-python-to-lua-structure.js --out=/tmp/preview
 *   node documentation/scripts/migrate-python-to-lua-structure.js
 *   node documentation/scripts/migrate-python-to-lua-structure.js --bank-form=array
 *
 * Es idempotente: volver a ejecutarlo no duplica ejercicios ni ejemplos.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PY_MODULES = path.join(ROOT, 'content/languages/python/modules');

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const found = args.find((a) => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : fallback;
};
const BANK_FORM = getArg('bank-form', 'object');
const OUT_DIR = getArg('out', '');
const DRY_RUN = args.includes('--dry-run');

if (!['array', 'object'].includes(BANK_FORM)) {
  console.error(`--bank-form inválido: ${BANK_FORM}. Usa "array" u "object".`);
  process.exit(1);
}

const stats = {
  modules: 0,
  sections: 0,
  lessons: 0,
  moduleQuestions: 0,
  banks: 0,
  bankQuestions: 0,
  examplesCreated: 0,
  synthesizedExplanations: 0,
  derivedConceptIds: 0,
  normalizedConceptIds: 0,
  bankQuestionsWithoutConceptIds: 0,
  modulesWithoutBank: [],
  warnings: [],
};

const DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
const MODULE_ONLY_FIELDS = [
  'version',
  'status',
  'content_version',
  'is_diagnostic',
  'time_estimated_seconds',
  'language_id',
  'module_id',
  'section_id',
  'lesson_id',
];
const LEGACY_FIELDS = ['options', 'correct_option_id', 'hint', 'concept_id'];
const LESSON_LEGACY_FIELDS = [
  'theory_markdown',
  'code_example',
  'expected_output',
  'tip_markdown',
  'exercise',
];

const warn = (message) => stats.warnings.push(message);

const letterFor = (index) => String.fromCharCode(65 + index);

const normalizeConcept = (raw) => {
  let value = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (value.length < 3) value = `concept-${value || 'general'}`;
  return value.slice(0, 80);
};

const derivedConceptId = (module, lesson) =>
  normalizeConcept(`py-${module.slug || module.code}-${lesson.code || `l${lesson.position || 1}`}`);

const topicFromDir = (dir) =>
  dir
    .replace(/^\d+_/, '')
    .replace(/_/g, '-')
    .toLowerCase();

const ensureExplanation = (question, answers, correctIds) => {
  const current = typeof question.explanation === 'string' ? question.explanation.trim() : '';
  if (current.length >= 20) return current;

  const correctBodies = answers
    .filter((a) => correctIds.includes(a.id))
    .map((a) => a.body)
    .filter(Boolean);
  const hint = Array.isArray(question.hints) && question.hints[0] ? question.hints[0] : question.hint;
  const pieces = [];
  if (correctBodies.length > 0) {
    pieces.push(`La respuesta correcta es "${correctBodies.join(' / ')}".`);
  } else {
    pieces.push('Revisa el concepto de la lección antes de responder.');
  }
  if (hint) pieces.push(String(hint).trim());
  if (current) pieces.push(current);
  let text = pieces.join(' ').replace(/\s+/g, ' ').trim();
  if (text.length < 20) text += ' Vuelve a repasar la lección y prueba de nuevo.';
  stats.synthesizedExplanations += 1;
  return text;
};

const normalizeAnswers = (question) => {
  const source = Array.isArray(question.answers)
    ? question.answers
    : Array.isArray(question.options)
      ? question.options
      : [];

  return source.map((answer, index) => {
    const id = answer.id || `opt_${String.fromCharCode(97 + index)}`;
    const body = answer.body !== undefined ? answer.body : answer.text;
    const isCorrect =
      answer.is_correct !== undefined
        ? Boolean(answer.is_correct)
        : question.correct_option_id !== undefined && id === question.correct_option_id;

    const normalized = {
      id,
      label: answer.label || letterFor(index),
      body: body !== undefined ? body : '',
      is_correct: isCorrect,
      position: Number.isInteger(answer.position) ? answer.position : index + 1,
    };
    if (answer.explanation !== undefined) normalized.explanation = answer.explanation;
    return normalized;
  });
};

const canonicalizeQuestion = (question, context) => {
  const out = { ...question };
  const { module, section, lesson, topic, inBank } = context;

  if (!out.id) {
    const scope = inBank ? 'bnk' : `ex_${lesson?.id || 'lesson'}`;
    out.id = `${scope}_${(out.prompt || 'pregunta')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40)}`;
    warn(`Pregunta sin id en ${module.code}: se generó "${out.id}".`);
  }

  // Los ids de ejercicios de lección deben ser únicos incluso entre módulos.
  if (!inBank && !out.id.startsWith(`${module.id}_`)) {
    out.id = `${module.id}_${out.id}`;
  }

  out.type = out.type || 'single_choice';
  out.difficulty = DIFFICULTIES.has(out.difficulty) ? out.difficulty : 'medium';
  if (!DIFFICULTIES.has(question.difficulty)) {
    warn(`${out.id}: difficulty ausente/ inválida, se usó "medium".`);
  }

  if (!out.category || !/^[a-z0-9_-]{2,50}$/.test(out.category)) {
    out.category = topic;
  }

  out.prompt = typeof out.prompt === 'string' ? out.prompt : '';
  if (out.prompt.length < 10) warn(`${out.id}: prompt menor a 10 caracteres.`);
  if (out.prompt_code === undefined) out.prompt_code = null;

  let answers = normalizeAnswers(out);
  let correctIds = Array.isArray(out.correct_answer_ids)
    ? out.correct_answer_ids.filter((id) => typeof id === 'string' && id.length > 0)
    : [];

  if (correctIds.length === 0 && out.correct_option_id) correctIds = [out.correct_option_id];
  if (correctIds.length === 0) {
    correctIds = answers.filter((a) => a.is_correct).map((a) => a.id);
  }

  answers = answers.map((answer) => ({
    ...answer,
    is_correct: correctIds.length > 0 ? correctIds.includes(answer.id) : answer.is_correct,
  }));

  // Validaciones de conteo por tipo (avisos, no bloqueantes).
  const answerRange = {
    single_choice: [2, 6],
    multiple_choice: [4, 5],
    true_false: [2, 2],
    predict_output: [2, 4],
    fill_blank: [1, 1],
    find_error: [3, 4],
    select_code: [3, 4],
  };
  if (answerRange[out.type] && answers.length > 0) {
    const [min, max] = answerRange[out.type];
    if (answers.length < min || answers.length > max) {
      warn(`${out.id}: ${out.type} tiene ${answers.length} respuestas (esperado ${min}..${max}).`);
    }
  }
  const correctCount = answers.filter((a) => a.is_correct).length;
  if (['single_choice', 'true_false', 'predict_output', 'find_error', 'select_code'].includes(out.type)) {
    if (correctCount !== 1) warn(`${out.id}: ${out.type} tiene ${correctCount} correctas (esperado 1).`);
  }
  if (out.type === 'multiple_choice' && (correctCount < 2 || correctCount > 3)) {
    warn(`${out.id}: multiple_choice tiene ${correctCount} correctas (esperado 2..3).`);
  }
  if (['predict_output', 'fill_blank', 'find_error'].includes(out.type) && !out.prompt_code) {
    warn(`${out.id}: ${out.type} requiere prompt_code.`);
  }
  if (out.type === 'order_lines' && (!Array.isArray(out.blocks) || !Array.isArray(out.correct_order))) {
    warn(`${out.id}: order_lines requiere blocks y correct_order.`);
  }
  if (out.type === 'matching' && !Array.isArray(out.pairs)) {
    warn(`${out.id}: matching requiere pairs.`);
  }
  if (out.type === 'write_code' && (!out.starter_code || !Array.isArray(out.accepted_tokens))) {
    warn(`${out.id}: write_code requiere starter_code y accepted_tokens.`);
  }

  out.answers = answers;
  out.correct_answer_ids = correctIds;

  if (!Array.isArray(out.hints) || out.hints.length === 0) {
    if (out.hint) out.hints = [out.hint];
  }

  let conceptIds = Array.isArray(out.concept_ids) ? out.concept_ids.filter(Boolean) : [];
  if (conceptIds.length === 0 && out.concept_id) {
    conceptIds = [normalizeConcept(out.concept_id)];
    stats.normalizedConceptIds += 1;
  } else if (conceptIds.length === 0 && lesson?.concept_id) {
    conceptIds = [normalizeConcept(lesson.concept_id)];
  }
  const normalizedConceptIds = [...new Set(conceptIds.map(normalizeConcept).filter(Boolean))];
  if (normalizedConceptIds.length > 0) {
    out.concept_ids = normalizedConceptIds;
  } else {
    delete out.concept_ids;
    if (inBank) stats.bankQuestionsWithoutConceptIds += 1;
  }

  out.explanation = ensureExplanation(out, answers, correctIds);

  if (!inBank) {
    out.version = Number.isInteger(out.version) && out.version >= 1 ? out.version : 1;
    out.status = ['draft', 'published', 'archived'].includes(out.status) ? out.status : 'published';
    out.content_version = Number.isInteger(out.content_version) && out.content_version >= 1 ? out.content_version : 1;
    out.is_diagnostic = typeof out.is_diagnostic === 'boolean' ? out.is_diagnostic : false;
    out.time_estimated_seconds = Number.isInteger(out.time_estimated_seconds)
      ? out.time_estimated_seconds
      : out.difficulty === 'hard'
        ? 90
        : out.difficulty === 'medium'
          ? 60
          : 30;
    out.language_id = out.language_id || module.language_id;
    out.module_id = out.module_id || module.id;
    out.section_id = out.section_id || section?.id;
    out.lesson_id = out.lesson_id || lesson?.id;
  }

  for (const field of LEGACY_FIELDS) delete out[field];
  return out;
};

const normalizeLesson = (lesson, context) => {
  const { module, section, topic } = context;
  const out = { ...lesson };

  if (!out.explanation && out.theory_markdown) out.explanation = out.theory_markdown;
  if (!out.explanation || out.explanation.length < 20) {
    warn(`${module.code}/${out.slug || out.id}: explanation ausente o menor a 20 caracteres.`);
  }

  if (!out.concept_id) {
    out.concept_id = derivedConceptId(module, out);
    stats.derivedConceptIds += 1;
  } else {
    out.concept_id = normalizeConcept(out.concept_id);
  }

  if (out.is_required === undefined) out.is_required = true;
  if (!out.status) out.status = 'published';
  if (!Number.isInteger(out.content_version) || out.content_version < 1) out.content_version = 1;

  // examples
  if ((!Array.isArray(out.examples) || out.examples.length === 0) && out.code_example) {
    out.examples = [
      {
        title: 'Ejemplo',
        code: out.code_example,
        language: 'python',
        ...(out.expected_output !== undefined ? { output: out.expected_output } : {}),
        ...(out.tip_markdown !== undefined ? { explanation: out.tip_markdown } : {}),
        position: 1,
      },
    ];
    stats.examplesCreated += 1;
  } else if (Array.isArray(out.examples)) {
    out.examples = out.examples.map((example, index) => ({
      ...example,
      language: example.language || 'python',
      position: Number.isInteger(example.position) ? example.position : index + 1,
    }));
  }

  const sourceQuestions = [];
  if (Array.isArray(out.exercises)) sourceQuestions.push(...out.exercises);
  if (out.exercise) sourceQuestions.push(out.exercise);

  const seen = new Set();
  out.exercises = sourceQuestions
    .filter((question) => {
      if (!question || !question.id) return true;
      if (seen.has(question.id)) {
        warn(`${module.code}/${out.slug}: ejercicio duplicado "${question.id}" omitido.`);
        return false;
      }
      seen.add(question.id);
      return true;
    })
    .map((question) =>
      canonicalizeQuestion(question, {
        module,
        section,
        lesson: { ...out, concept_id: out.concept_id },
        topic,
        inBank: false,
      }),
    );

  if (out.exercises.length === 0) {
    warn(`${module.code}/${out.slug || out.id}: lección sin ejercicios.`);
  }
  stats.moduleQuestions += out.exercises.length;

  for (const field of LESSON_LEGACY_FIELDS) delete out[field];
  return out;
};

const normalizeModule = (module, dirName) => {
  const topic = topicFromDir(dirName);
  const out = { ...module };
  out.sections = (module.sections || []).map((section) => ({
    ...section,
    lessons: (section.lessons || []).map((lesson) =>
      normalizeLesson(lesson, { module: out, section, topic }),
    ),
  }));
  stats.sections += out.sections.length;
  stats.lessons += out.sections.reduce((total, section) => total + section.lessons.length, 0);
  return out;
};

const normalizeBank = (rawBank, module, dirName) => {
  const topic = topicFromDir(dirName);
  const isArray = Array.isArray(rawBank);
  const questions = isArray ? rawBank : rawBank.questions || [];
  const converted = questions.map((question) =>
    canonicalizeQuestion(question, { module, topic, inBank: true }),
  );
  stats.bankQuestions += converted.length;

  if (BANK_FORM === 'array') return converted;
  return {
    module_code: (!isArray && rawBank.module_code) || module.code,
    module_slug: (!isArray && rawBank.module_slug) || module.slug,
    questions: converted,
  };
};

const writeJson = (filePath, data) => {
  if (DRY_RUN) return;
  const target = OUT_DIR
    ? path.join(OUT_DIR, path.relative(ROOT, filePath))
    : filePath;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const run = () => {
  if (!fs.existsSync(PY_MODULES)) {
    console.error(`No existe ${PY_MODULES}`);
    process.exit(1);
  }

  const moduleDirs = fs
    .readdirSync(PY_MODULES, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const dirName of moduleDirs) {
    const modulePath = path.join(PY_MODULES, dirName, 'module.json');
    const bankPath = path.join(PY_MODULES, dirName, 'bank.json');
    if (!fs.existsSync(modulePath)) {
      warn(`${dirName}: no tiene module.json.`);
      continue;
    }

    const module = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
    const normalizedModule = normalizeModule(module, dirName);
    stats.modules += 1;
    writeJson(modulePath, normalizedModule);

    if (!fs.existsSync(bankPath)) {
      stats.modulesWithoutBank.push(dirName);
      continue;
    }

    const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
    const normalizedBank = normalizeBank(bank, module, dirName);
    stats.banks += 1;
    writeJson(bankPath, normalizedBank);
  }

  console.log('\n=== Migración Python → estructura Lua ===');
  console.log(`Modo: ${DRY_RUN ? 'dry-run' : OUT_DIR ? `preview -> ${OUT_DIR}` : 'in-place'}`);
  console.log(`Banco: ${BANK_FORM}`);
  console.log(`Módulos: ${stats.modules}`);
  console.log(`Secciones: ${stats.sections}`);
  console.log(`Lecciones: ${stats.lessons}`);
  console.log(`Ejercicios en module.json: ${stats.moduleQuestions}`);
  console.log(`Bancos: ${stats.banks}`);
  console.log(`Preguntas en bank.json: ${stats.bankQuestions}`);
  console.log(`Ejemplos creados desde code_example: ${stats.examplesCreated}`);
  console.log(`Explicaciones sintetizadas: ${stats.synthesizedExplanations}`);
  console.log(`concept_id derivados: ${stats.derivedConceptIds}`);
  console.log(`concept_id normalizados: ${stats.normalizedConceptIds}`);
  console.log(`Preguntas de banco sin concept_ids: ${stats.bankQuestionsWithoutConceptIds}`);
  if (stats.modulesWithoutBank.length > 0) {
    console.log(`Módulos sin bank.json: ${stats.modulesWithoutBank.join(', ')}`);
  }
  if (stats.warnings.length > 0) {
    console.log(`\nAvisos (${stats.warnings.length}):`);
    for (const warning of stats.warnings) console.log(`  - ${warning}`);
  } else {
    console.log('\nSin avisos.');
  }
};

run();
