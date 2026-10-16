#!/usr/bin/env node
/**
 * Koda Content Validator (CI & Pre-commit)
 *
 * Valida declarativa y semánticamente el contenido en `content/languages/**`:
 *   1. Todo `bank.json` contra `https://koda.dev/schemas/question.schema.json#/$defs/bank`
 *      (aceptando el sobre `{ module_code, questions }` o `bankArray` legacy si no se pasa `--strict-bank-envelope`).
 *   2. Todo `module.json` contra `https://koda.dev/schemas/question.schema.json#/$defs/module`.
 *   3. Regla semántica V-Q06 (`29_QUESTION_JSON_CONTRACT.md` / `30_ROADMAP_STRUCTURE_AND_COORDINATES.md`):
 *      - `position` (en `manifest.json -> modules[]`, `sections[]`, `lessons[]`, `examples[]`, `answers[]`, `blocks[]`, `questions[]`)
 *        es `1..N` continuo sin huecos ni duplicados cuando se declara.
 *      - `id` de pregunta único dentro de cada `bank.json` y dentro de cada `module.json`.
 *      - `correct_answer_ids` referencia `answers[].id` existentes cuando ambos están presentes.
 *   4. Si se pasa `--check-bmin`, reporta el estado de cobertura `B_min` de los bancos de Lua
 *      frente a `manifest.json -> config.compositions` (`quiz` y `exam`).
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(ROOT_DIR, 'content', 'schemas', 'question.schema.json');
const LANGUAGES_DIR = path.join(ROOT_DIR, 'content', 'languages');

function loadAjv2020() {
  const candidates = [
    'ajv/dist/2020',
    path.join(ROOT_DIR, 'node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/2020'),
  ];
  for (const modPath of candidates) {
    try {
      const mod = require(modPath);
      return mod.default || mod;
    } catch (_) {
      // try next candidate
    }
  }
  throw new Error('No se pudo cargar Ajv2020 (ajv/dist/2020). Ejecuta pnpm install.');
}

function loadAjvFormats() {
  const candidates = [
    'ajv-formats',
    path.join(
      ROOT_DIR,
      'node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats',
    ),
  ];
  for (const modPath of candidates) {
    try {
      const mod = require(modPath);
      return mod.default || mod;
    } catch (_) {
      // try next candidate
    }
  }
  return null;
}

function walkFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkFiles(full));
    } else {
      results.push(full);
    }
  }
  return results.sort();
}

/**
 * Regla semántica V-Q06: si `position` se declara en los elementos de un array,
 * debe cubrir exactamente `1..N` sin huecos ni duplicados.
 */
function checkContiguousPositions(items, contextLabel) {
  const errors = [];
  if (!Array.isArray(items) || items.length === 0) return errors;

  const itemsWithPos = items.filter(
    (item) => item && typeof item.position === 'number',
  );
  if (itemsWithPos.length === 0) return errors;

  if (itemsWithPos.length !== items.length) {
    errors.push(
      `[V-Q06] ${contextLabel}: declaración parcial de 'position' (${itemsWithPos.length}/${items.length} elementos tienen 'position').`,
    );
    return errors;
  }

  const sorted = itemsWithPos.map((item) => item.position).sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    const expected = i + 1;
    if (sorted[i] !== expected) {
      errors.push(
        `[V-Q06] ${contextLabel}: secuencia 'position' inválida (esperado 1..${items.length} sin huecos ni duplicados, encontrado [${sorted.join(', ')}]).`,
      );
      break;
    }
  }
  return errors;
}

function validateQuestionSemantics(q, contextLabel) {
  const errors = [];
  if (!q || typeof q !== 'object') return errors;

  errors.push(...checkContiguousPositions(q.answers, `${contextLabel}.answers`));
  errors.push(...checkContiguousPositions(q.blocks, `${contextLabel}.blocks`));

  if (
    Array.isArray(q.answers) &&
    q.answers.length > 0 &&
    Array.isArray(q.correct_answer_ids) &&
    q.correct_answer_ids.length > 0
  ) {
    const answerIds = new Set(q.answers.map((a) => a.id).filter(Boolean));
    if (answerIds.size > 0) {
      for (const cid of q.correct_answer_ids) {
        if (!answerIds.has(cid)) {
          errors.push(
            `[V-Q03] ${contextLabel}: correct_answer_ids contiene '${cid}' que no existe en answers[].id.`,
          );
        }
      }
    }
  }

  return errors;
}

function formatAjvErrors(ajvErrors, relPath) {
  return (ajvErrors || []).slice(0, 10).map((err) => {
    const loc = err.instancePath || '/';
    return `[Schema] ${relPath} (${loc}): ${err.message}`;
  });
}

function checkLuaBmin(strictBmin) {
  const luaManifestPath = path.join(LANGUAGES_DIR, 'lua', 'manifest.json');
  if (!fs.existsSync(luaManifestPath)) return { warnings: [], errors: [] };

  const manifest = JSON.parse(fs.readFileSync(luaManifestPath, 'utf8'));
  const quizComp = (manifest.config && manifest.config.compositions && manifest.config.compositions.quiz) || {};
  const examComp = (manifest.config && manifest.config.compositions && manifest.config.compositions.exam) || {};
  const allTypes = Array.from(
    new Set([...Object.keys(quizComp), ...Object.keys(examComp)]),
  );

  const requiredPerType = {};
  const bMinPerType = {};
  let totalBminTarget = 0;

  for (const t of allTypes) {
    const qCount = Number(quizComp[t] || 0);
    const eCount = Number(examComp[t] || 0);
    requiredPerType[t] = Math.max(qCount, eCount);
    bMinPerType[t] = 2 * (qCount + eCount);
    totalBminTarget += bMinPerType[t];
  }

  console.log('\n📐 --- REPORTE B_min DE BANCOS LUA (--check-bmin) ---');
  console.log(
    `Meta B_min por módulo: ${totalBminTarget} preguntas (${allTypes
      .map((t) => `${t}:${bMinPerType[t]}`)
      .join(', ')})`,
  );

  const warnings = [];
  const errors = [];

  for (const mod of manifest.modules || []) {
    if (!mod.path) continue;
    const bankPath = path.join(LANGUAGES_DIR, 'lua', mod.path, 'bank.json');
    if (!fs.existsSync(bankPath)) continue;

    const raw = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
    const questions = Array.isArray(raw) ? raw : raw.questions || [];
    const countsByType = {};
    for (const q of questions) {
      countsByType[q.type] = (countsByType[q.type] || 0) + 1;
    }

    const deficitsEval = [];
    const deficitsBmin = [];
    for (const t of allTypes) {
      const have = countsByType[t] || 0;
      if (have < requiredPerType[t]) {
        deficitsEval.push(`${t}: ${have}/${requiredPerType[t]} (eval min)`);
      }
      if (have < bMinPerType[t]) {
        deficitsBmin.push(`${t}: ${have}/${bMinPerType[t]}`);
      }
    }

    const statusIcon =
      deficitsBmin.length === 0 ? '✅' : deficitsEval.length === 0 ? '⚠️' : '❌';
    console.log(
      `  ${statusIcon} ${mod.code} (${mod.slug}): ${questions.length}/${totalBminTarget} preguntas` +
        (deficitsBmin.length > 0 ? ` — Faltantes B_min: [${deficitsBmin.join(', ')}]` : ' — Cumple B_min completo'),
    );

    if (deficitsBmin.length > 0) {
      const msg = `[B_min] ${mod.code} (${path.relative(ROOT_DIR, bankPath)}): ${questions.length}/${totalBminTarget} preguntas (${deficitsBmin.join(', ')}).`;
      if (strictBmin) {
        errors.push(msg);
      } else {
        warnings.push(msg);
      }
    }
  }

  return { warnings, errors };
}

function main() {
  const args = new Set(process.argv.slice(2));
  const checkBmin = args.has('--check-bmin') || args.has('--strict-bmin');
  const strictBmin = args.has('--strict-bmin');
  const strictBankEnvelope = args.has('--strict-bank-envelope');

  console.log('🔍 [Koda Content Validator] Validando contratos JSON Schema y reglas V-Q06...');

  const Ajv2020 = loadAjv2020();
  const addFormats = loadAjvFormats();
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  if (addFormats) addFormats(ajv);
  ajv.addSchema(schema);

  const validateBank = ajv.getSchema(
    'https://koda.dev/schemas/question.schema.json#/$defs/bank',
  );
  const validateModule = ajv.getSchema(
    'https://koda.dev/schemas/question.schema.json#/$defs/module',
  );

  if (!validateBank || !validateModule) {
    console.error('❌ No se encontraron las definiciones #/$defs/bank o #/$defs/module en question.schema.json');
    process.exit(1);
  }

  const allFiles = walkFiles(LANGUAGES_DIR);
  const manifestFiles = allFiles.filter((f) => path.basename(f) === 'manifest.json');
  const moduleFiles = allFiles.filter((f) => path.basename(f) === 'module.json');
  const bankFiles = allFiles.filter((f) => path.basename(f) === 'bank.json');

  const errors = [];
  const warnings = [];
  let totalQuestionsInBanks = 0;
  let totalLessonsInModules = 0;
  let totalExercisesInModules = 0;

  // 1. Validar manifest.json (V-Q06 en modules[])
  for (const file of manifestFiles) {
    const relPath = path.relative(ROOT_DIR, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      errors.push(`[JSON] ${relPath}: JSON inválido (${e.message})`);
      continue;
    }

    if (Array.isArray(data.modules)) {
      errors.push(...checkContiguousPositions(data.modules, `${relPath}#modules`));
    }
  }

  // 2. Validar module.json (#/$defs/module + V-Q06)
  for (const file of moduleFiles) {
    const relPath = path.relative(ROOT_DIR, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      errors.push(`[JSON] ${relPath}: JSON inválido (${e.message})`);
      continue;
    }

    const valid = validateModule(data);
    if (!valid) {
      errors.push(...formatAjvErrors(validateModule.errors, relPath));
    }

    errors.push(...checkContiguousPositions(data.sections, `${relPath}#sections`));

    const exerciseIds = new Set();
    for (const sec of data.sections || []) {
      const secLabel = `${relPath}#section(${sec.position || sec.id})`;
      errors.push(...checkContiguousPositions(sec.lessons, `${secLabel}.lessons`));

      for (const les of sec.lessons || []) {
        totalLessonsInModules++;
        const lesLabel = `${secLabel}.lesson(${les.position || les.id})`;
        errors.push(...checkContiguousPositions(les.examples, `${lesLabel}.examples`));

        const exercises = Array.isArray(les.exercises)
          ? les.exercises
          : les.exercise
            ? [les.exercise]
            : [];
        for (const ex of exercises) {
          totalExercisesInModules++;
          if (ex && ex.id) {
            if (exerciseIds.has(ex.id)) {
              errors.push(`[V-Q06] ${lesLabel}: id de ejercicio duplicado '${ex.id}' en el módulo.`);
            }
            exerciseIds.add(ex.id);
          }
          errors.push(
            ...validateQuestionSemantics(ex, `${lesLabel}.exercise(${(ex && ex.id) || '?'})`),
          );
        }
      }
    }
  }

  // 3. Validar bank.json (#/$defs/bank + V-Q06 + unicidad de IDs)
  for (const file of bankFiles) {
    const relPath = path.relative(ROOT_DIR, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      errors.push(`[JSON] ${relPath}: JSON inválido (${e.message})`);
      continue;
    }

    const isArray = Array.isArray(data);
    if (isArray && strictBankEnvelope) {
      errors.push(
        `[Schema] ${relPath}: bank.json debe usar el sobre { module_code, questions[] } (#/$defs/bank).`,
      );
    }

    const bankEnvelope = isArray ? { questions: data } : data;
    const valid = validateBank(bankEnvelope);
    if (!valid) {
      errors.push(...formatAjvErrors(validateBank.errors, relPath));
    }

    const questions = Array.isArray(bankEnvelope.questions)
      ? bankEnvelope.questions
      : [];
    totalQuestionsInBanks += questions.length;

    errors.push(...checkContiguousPositions(questions, `${relPath}#questions`));

    const questionIds = new Set();
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qLabel = `${relPath}#question[${i}](${(q && q.id) || '?'})`;
      if (q && q.id) {
        if (questionIds.has(q.id)) {
          errors.push(`[V-Q06] ${relPath}: id de pregunta duplicado '${q.id}' en el banco.`);
        }
        questionIds.add(q.id);
      }
      errors.push(...validateQuestionSemantics(q, qLabel));
    }
  }

  // 4. Opcional: chequeo de B_min en Lua
  if (checkBmin) {
    const bminResult = checkLuaBmin(strictBmin);
    warnings.push(...bminResult.warnings);
    errors.push(...bminResult.errors);
  }

  console.log('\n📊 --- RESUMEN DE VALIDACIÓN DE CONTENIDO ---');
  console.log(`- Manifests verificados (V-Q06): ${manifestFiles.length}`);
  console.log(`- Módulos validados (#/$defs/module): ${moduleFiles.length} (${totalLessonsInModules} lecciones, ${totalExercisesInModules} ejercicios)`);
  console.log(`- Bancos validados (#/$defs/bank): ${bankFiles.length} (${totalQuestionsInBanks} preguntas)`);

  if (warnings.length > 0) {
    console.warn(`\n⚠️  Advertencias (${warnings.length}):`);
    warnings.forEach((w) => console.warn(`  - ${w}`));
  }

  if (errors.length > 0) {
    console.error(`\n❌ Se encontraron ${errors.length} errores de validación:`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log('\n✅ ¡Todo el contenido declarativo cumple el JSON Schema y las reglas semánticas V-Q06!');
  process.exit(0);
}

if (require.main === module) {
  main();
}
