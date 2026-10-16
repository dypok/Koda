/**
 * Script de siembra de contenido curricular en MongoDB para Koda.
 *
 * Uso: pnpm --filter api db:seed
 *
 * Lee dinámicamente todos los archivos JSON de la carpeta `content/`
 * (tracks, courses, modules, sections, lessons, question-banks, visual-effects)
 * e inserta/actualiza de forma idempotente los documentos en MongoDB.
 *
 * Soporta:
 * - Detección automática por estructura o nombre de archivo.
 * - Adición de nuevos cursos en subcarpetas de content/ (ej. content/courses/nuevo-curso/lessons.json).
 * - Fallback a seeds estáticos si no se detecta el directorio content/.
 */
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import {
  Track,
  TrackSchema,
  Course,
  CourseSchema,
  Module as CourseModule,
  ModuleSchema,
  Section,
  SectionSchema,
  Lesson,
  LessonSchema,
  VisualEffect,
  VisualEffectSchema,
  QuestionBank,
  QuestionBankSchema,
} from './schemas';
import {
  INITIAL_TRACKS,
  PYTHON_COURSES,
  PYTHON_MODULES,
  PYTHON_SECTIONS,
  PYTHON_LESSONS,
  PYTHON_QUESTION_BANKS,
} from './seeds/python-curriculum.data';
import { INITIAL_VISUAL_EFFECTS } from './seeds/visual-effects.seed';

/**
 * Localiza la raíz de `content/` en el proyecto.
 */
function resolveContentDir(): string | null {
  const candidates = [
    path.resolve(process.cwd(), 'content'),
    path.resolve(process.cwd(), '../../content'),
    path.resolve(__dirname, '../../../../content'),
    path.resolve(__dirname, '../../../content'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
  }
  return null;
}

/**
 * Escanea recursivamente todos los archivos .json dentro de un directorio.
 */
function scanJsonFiles(dir: string): string[] {
  let results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Omitir node_modules o .git si existieran
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        results = results.concat(scanJsonFiles(fullPath));
      }
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      // Omitir package.json, manifest.json o configs antiguas que no sean documentos Mongoose
      const ignoredFiles = ['package.json', 'package-lock.json', 'tsconfig.json', 'manifest.json', 'thresholds.json', 'xp.json', 'compositions.json'];
      if (!ignoredFiles.includes(entry.name)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

interface SeedCatalog {
  tracks: Map<string, any>;
  courses: Map<string, any>;
  visual_effects: Map<string, any>;
  modules: Map<string, any>;
  sections: Map<string, any>;
  lessons: Map<string, any>;
  question_banks: Map<string, any>;
}

function classifyAndCollect(item: any, filename: string, catalog: SeedCatalog): void {
  if (!item || typeof item !== 'object') return;

  const base = path.basename(filename).toLowerCase();

  // 1. Visual Effect
  if (item.code && (item.preset || item.animation_speed !== undefined || base.includes('visual-effect'))) {
    catalog.visual_effects.set(item.code, item);
    return;
  }

  // 2. Question Bank
  if (item.module_slug && item.difficulty && Array.isArray(item.questions)) {
    catalog.question_banks.set(`${item.module_slug}__${item.difficulty}`, item);
    return;
  }

  // 3. Lesson (5 Fases de Evaluación / Tríada Evaluativa)
  if (item.section_slug && (item.theory || item.item_1_console || item.item_2_quiz || item.item_3_theory || item.item_4_prediction || item.item_3_prediction || base.includes('lesson'))) {
    if (item.slug) {
      catalog.lessons.set(item.slug, item);
      return;
    }
  }

  // 4. Section
  if (item.module_slug && (item.total_lessons !== undefined || base.includes('section'))) {
    if (item.slug) {
      catalog.sections.set(item.slug, item);
      return;
    }
  }

  // 5. Course (Grafo DAG)
  if (item.track_slug && (item.topology !== undefined || item.edges !== undefined || base.includes('course'))) {
    if (item.slug) {
      catalog.courses.set(item.slug, item);
      return;
    }
  }

  // 6. Module
  if (item.course_slug && (item.total_sections !== undefined || base.includes('module'))) {
    if (item.slug) {
      catalog.modules.set(item.slug, item);
      return;
    }
  }

  // 7. Track (Pista profesional)
  if (item.slug && item.name && (item.badge || item.sort_order !== undefined || base.includes('track')) && !item.topology && !item.course_slug && !item.track_slug) {
    catalog.tracks.set(item.slug, item);
    return;
  }
}

function processJsonFile(filePath: string, catalog: SeedCatalog): void {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        classifyAndCollect(item, filePath, catalog);
      }
    } else if (parsed && typeof parsed === 'object') {
      // Podría ser un contenedor con arrays (ej: { tracks: [...], courses: [...] })
      let matchedContainer = false;
      const keys = ['tracks', 'courses', 'visual_effects', 'modules', 'sections', 'lessons', 'question_banks'];
      for (const key of keys) {
        if (Array.isArray(parsed[key])) {
          matchedContainer = true;
          for (const subItem of parsed[key]) {
            classifyAndCollect(subItem, filePath, catalog);
          }
        }
      }
      if (!matchedContainer) {
        classifyAndCollect(parsed, filePath, catalog);
      }
    }
  } catch (err: any) {
    console.warn(`[Koda Seeder] No se pudo parsear el archivo ${filePath}: ${err.message}`);
  }
}

async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/koda';
  console.log(`[Koda MongoDB Seeder] Conectando a MongoDB en ${uri}...`);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  const VisualEffectModel = mongoose.model(VisualEffect.name, VisualEffectSchema);
  const TrackModel = mongoose.model(Track.name, TrackSchema);
  const CourseModel = mongoose.model(Course.name, CourseSchema);
  const ModuleModel = mongoose.model(CourseModule.name, ModuleSchema);
  const SectionModel = mongoose.model(Section.name, SectionSchema);
  const LessonModel = mongoose.model(Lesson.name, LessonSchema);
  const QuestionBankModel = mongoose.model(QuestionBank.name, QuestionBankSchema);

  const catalog: SeedCatalog = {
    tracks: new Map(),
    courses: new Map(),
    visual_effects: new Map(),
    modules: new Map(),
    sections: new Map(),
    lessons: new Map(),
    question_banks: new Map(),
  };

  const contentDir = resolveContentDir();

  if (contentDir) {
    console.log(`[Koda Seeder] Escaneando directorio de contenido: ${contentDir}`);
    const files = scanJsonFiles(contentDir);
    console.log(`[Koda Seeder] Se encontraron ${files.length} archivos JSON para procesar.`);

    for (const file of files) {
      processJsonFile(file, catalog);
    }
  } else {
    console.warn('[Koda Seeder] No se localizo la carpeta content/. Usando semillas estaticas integradas.');
  }

  // Fallback si alguna colección quedó vacía
  if (catalog.visual_effects.size === 0) {
    INITIAL_VISUAL_EFFECTS.forEach((fx) => catalog.visual_effects.set(fx.code, fx));
  }
  if (catalog.tracks.size === 0) {
    INITIAL_TRACKS.forEach((t) => catalog.tracks.set(t.slug, t));
  }
  if (catalog.courses.size === 0) {
    PYTHON_COURSES.forEach((c) => catalog.courses.set(c.slug, c));
  }
  if (catalog.modules.size === 0) {
    PYTHON_MODULES.forEach((m) => catalog.modules.set(m.slug, m));
  }
  if (catalog.sections.size === 0) {
    PYTHON_SECTIONS.forEach((s) => catalog.sections.set(s.slug, s));
  }
  if (catalog.lessons.size === 0) {
    PYTHON_LESSONS.forEach((l) => catalog.lessons.set(l.slug, l));
  }
  if (catalog.question_banks.size === 0) {
    PYTHON_QUESTION_BANKS.forEach((qb) => catalog.question_banks.set(`${qb.module_slug}__${qb.difficulty}`, qb));
  }

  // 1. Efectos visuales de aristas GPU
  console.log(`[Koda Seeder] Sembrando ${catalog.visual_effects.size} efectos visuales...`);
  for (const effect of catalog.visual_effects.values()) {
    await VisualEffectModel.updateOne({ code: effect.code }, { $set: effect }, { upsert: true });
  }

  // 2. Pistas profesionales (Tracks)
  console.log(`[Koda Seeder] Sembrando ${catalog.tracks.size} pistas profesionales (tracks)...`);
  for (const track of catalog.tracks.values()) {
    await TrackModel.updateOne({ slug: track.slug }, { $set: track }, { upsert: true });
  }

  // 3. Cursos del Grafo DAG
  console.log(`[Koda Seeder] Sembrando ${catalog.courses.size} cursos en grafo DAG...`);
  for (const course of catalog.courses.values()) {
    await CourseModel.updateOne({ slug: course.slug }, { $set: course }, { upsert: true });
  }

  // 4. Módulos canónicos
  console.log(`[Koda Seeder] Sembrando ${catalog.modules.size} modulos...`);
  for (const mod of catalog.modules.values()) {
    await ModuleModel.updateOne({ slug: mod.slug }, { $set: mod }, { upsert: true });
  }

  // 5. Secciones secuenciales
  console.log(`[Koda Seeder] Sembrando ${catalog.sections.size} secciones...`);
  for (const section of catalog.sections.values()) {
    await SectionModel.updateOne({ slug: section.slug }, { $set: section }, { upsert: true });
  }

  // 6. Micro-lecciones con la Tríada Evaluativa
  console.log(`[Koda Seeder] Sembrando ${catalog.lessons.size} micro-lecciones con Triada Evaluativa...`);
  for (const lesson of catalog.lessons.values()) {
    await LessonModel.updateOne({ slug: lesson.slug }, { $set: lesson }, { upsert: true });
  }

  // 7. Bancos de preguntas diagnósticas y de examen
  console.log(`[Koda Seeder] Sembrando ${catalog.question_banks.size} bancos de reactivos evaluativos...`);
  for (const bank of catalog.question_banks.values()) {
    await QuestionBankModel.updateOne(
      { module_slug: bank.module_slug, difficulty: bank.difficulty },
      { $set: bank },
      { upsert: true },
    );
  }

  console.log('[Koda MongoDB Seeder] Siembra curricular completada exitosamente desde content/ hacia MongoDB.');
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Error ejecutando el seed de MongoDB:', error);
  process.exit(1);
});
