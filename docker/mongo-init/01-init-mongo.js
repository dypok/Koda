/**
 * Script de inicialización automática de MongoDB para Koda 🦊.
 *
 * Este script se ejecuta automáticamente al inicializar el contenedor Docker
 * de MongoDB (mongo:7) gracias al montaje en /docker-entrypoint-initdb.d/.
 *
 * Lee dinámicamente los archivos JSON montados en /content (si están disponibles)
 * o utiliza las semillas predefinidas como fallback.
 *
 * Base de datos: koda
 */

const fs = require('fs');
const path = require('path');

const dbKoda = db.getSiblingDB('koda');

print('🦊 [Docker Init] Inicializando base de datos koda en MongoDB...');

// 1. Índices únicos para garantizar integridad
dbKoda.tracks.createIndex({ slug: 1 }, { unique: true });
dbKoda.courses.createIndex({ slug: 1 }, { unique: true });
dbKoda.modules.createIndex({ slug: 1 }, { unique: true });
dbKoda.sections.createIndex({ slug: 1 }, { unique: true });
dbKoda.lessons.createIndex({ slug: 1 }, { unique: true });
dbKoda.visual_effects.createIndex({ code: 1 }, { unique: true });
dbKoda.question_banks.createIndex({ module_slug: 1, difficulty: 1 }, { unique: true });

function scanJsonFiles(dir) {
  let results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git') {
          results = results.concat(scanJsonFiles(fullPath));
        }
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        const ignoredFiles = ['package.json', 'package-lock.json', 'tsconfig.json', 'manifest.json', 'thresholds.json', 'xp.json', 'compositions.json'];
        if (!ignoredFiles.includes(entry.name)) {
          results.push(fullPath);
        }
      }
    }
  } catch (e) {
    print('⚠️ [Docker Init] Error escaneando ' + dir + ': ' + e.message);
  }
  return results;
}

const contentPath = '/content';
let loadedFromContent = false;

if (fs.existsSync(contentPath)) {
  print('📂 [Docker Init] Directorio /content detectado. Cargando datos curriculares dinámicos...');
  const files = scanJsonFiles(contentPath);
  print('📄 [Docker Init] Se encontraron ' + files.length + ' archivos JSON en /content.');

  const catalog = {
    tracks: new Map(),
    courses: new Map(),
    visual_effects: new Map(),
    modules: new Map(),
    sections: new Map(),
    lessons: new Map(),
    question_banks: new Map(),
  };

  function classifyAndCollect(item, filename) {
    if (!item || typeof item !== 'object') return;
    const base = path.basename(filename).toLowerCase();

    // Visual Effect
    if (item.code && (item.preset || item.animation_speed !== undefined || base.includes('visual-effect'))) {
      catalog.visual_effects.set(item.code, item);
      return;
    }
    // Question Bank
    if (item.module_slug && item.difficulty && Array.isArray(item.questions)) {
      catalog.question_banks.set(item.module_slug + '__' + item.difficulty, item);
      return;
    }
    // Lesson (5 Fases de Evaluación / Tríada)
    if (item.section_slug && (item.theory || item.item_1_console || item.item_2_quiz || item.item_3_theory || item.item_4_prediction || item.item_3_prediction || base.includes('lesson'))) {
      if (item.slug) {
        catalog.lessons.set(item.slug, item);
        return;
      }
    }
    // Section
    if (item.module_slug && (item.total_lessons !== undefined || base.includes('section'))) {
      if (item.slug) {
        catalog.sections.set(item.slug, item);
        return;
      }
    }
    // Course
    if (item.track_slug && (item.topology !== undefined || item.edges !== undefined || base.includes('course'))) {
      if (item.slug) {
        catalog.courses.set(item.slug, item);
        return;
      }
    }
    // Module
    if (item.course_slug && (item.total_sections !== undefined || base.includes('module'))) {
      if (item.slug) {
        catalog.modules.set(item.slug, item);
        return;
      }
    }
    // Track
    if (item.slug && item.name && (item.badge || item.sort_order !== undefined || base.includes('track')) && !item.topology && !item.course_slug && !item.track_slug) {
      catalog.tracks.set(item.slug, item);
      return;
    }
  }

  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const it of parsed) classifyAndCollect(it, file);
      } else if (parsed && typeof parsed === 'object') {
        const keys = ['tracks', 'courses', 'visual_effects', 'modules', 'sections', 'lessons', 'question_banks'];
        let matched = false;
        for (const k of keys) {
          if (Array.isArray(parsed[k])) {
            matched = true;
            for (const sub of parsed[k]) classifyAndCollect(sub, file);
          }
        }
        if (!matched) classifyAndCollect(parsed, file);
      }
    } catch (err) {
      print('⚠️ [Docker Init] Error al procesar ' + file + ': ' + err.message);
    }
  }

  // Insertar en MongoDB
  print('✨ [Docker Init] Insertando ' + catalog.visual_effects.size + ' efectos visuales...');
  catalog.visual_effects.forEach((v) => {
    dbKoda.visual_effects.updateOne({ code: v.code }, { $set: v }, { upsert: true });
  });

  print('🗺️ [Docker Init] Insertando ' + catalog.tracks.size + ' pistas profesionales (tracks)...');
  catalog.tracks.forEach((t) => {
    dbKoda.tracks.updateOne({ slug: t.slug }, { $set: t }, { upsert: true });
  });

  print('📚 [Docker Init] Insertando ' + catalog.courses.size + ' cursos...');
  catalog.courses.forEach((c) => {
    dbKoda.courses.updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
  });

  print('📦 [Docker Init] Insertando ' + catalog.modules.size + ' módulos...');
  catalog.modules.forEach((m) => {
    dbKoda.modules.updateOne({ slug: m.slug }, { $set: m }, { upsert: true });
  });

  print('📑 [Docker Init] Insertando ' + catalog.sections.size + ' secciones...');
  catalog.sections.forEach((s) => {
    dbKoda.sections.updateOne({ slug: s.slug }, { $set: s }, { upsert: true });
  });

  print('🧩 [Docker Init] Insertando ' + catalog.lessons.size + ' micro-lecciones...');
  catalog.lessons.forEach((l) => {
    dbKoda.lessons.updateOne({ slug: l.slug }, { $set: l }, { upsert: true });
  });

  print('🧠 [Docker Init] Insertando ' + catalog.question_banks.size + ' bancos de reactivos...');
  catalog.question_banks.forEach((qb) => {
    dbKoda.question_banks.updateOne(
      { module_slug: qb.module_slug, difficulty: qb.difficulty },
      { $set: qb },
      { upsert: true },
    );
  });

  loadedFromContent = true;
}

if (!loadedFromContent) {
  print('ℹ️ [Docker Init] /content no está montado; usando inicialización estática básica.');
}

print('🎉 [Docker Init] Base de datos koda inicializada exitosamente.');
