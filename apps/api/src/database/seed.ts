/**
 * Script de siembra de contenido curricular en MongoDB.
 *
 * Uso: pnpm --filter api db:seed
 *
 * Se conecta directamente con Mongoose (sin levantar todo Nest ni requerir
 * credenciales de Supabase) e inserta/actualiza de forma idempotente los
 * documentos base definidos en ./seeds/*.seed.ts.
 */
import 'dotenv/config';
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

async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/koda';
  console.log(`🦊 [Koda MongoDB Seeder] Conectando a MongoDB en ${uri}...`);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  const VisualEffectModel = mongoose.model(VisualEffect.name, VisualEffectSchema);
  const TrackModel = mongoose.model(Track.name, TrackSchema);
  const CourseModel = mongoose.model(Course.name, CourseSchema);
  const ModuleModel = mongoose.model(CourseModule.name, ModuleSchema);
  const SectionModel = mongoose.model(Section.name, SectionSchema);
  const LessonModel = mongoose.model(Lesson.name, LessonSchema);
  const QuestionBankModel = mongoose.model(QuestionBank.name, QuestionBankSchema);

  // 1. Efectos visuales de aristas GPU
  console.log(`✨ Sembrando ${INITIAL_VISUAL_EFFECTS.length} efectos visuales...`);
  for (const effect of INITIAL_VISUAL_EFFECTS) {
    await VisualEffectModel.updateOne({ code: effect.code }, { $set: effect }, { upsert: true });
  }

  // 2. Pistas profesionales (Tracks)
  console.log(`🗺️ Sembrando ${INITIAL_TRACKS.length} pistas profesionales (tracks)...`);
  for (const track of INITIAL_TRACKS) {
    await TrackModel.updateOne({ slug: track.slug }, { $set: track }, { upsert: true });
  }

  // 3. Cursos del Grafo DAG
  console.log(`📚 Sembrando ${PYTHON_COURSES.length} cursos en grafo DAG...`);
  for (const course of PYTHON_COURSES) {
    await CourseModel.updateOne({ slug: course.slug }, { $set: course }, { upsert: true });
  }

  // 4. Módulos canónicos
  console.log(`📦 Sembrando ${PYTHON_MODULES.length} módulos de Python 3.12...`);
  for (const mod of PYTHON_MODULES) {
    await ModuleModel.updateOne({ slug: mod.slug }, { $set: mod }, { upsert: true });
  }

  // 5. Secciones secuenciales
  console.log(`📑 Sembrando ${PYTHON_SECTIONS.length} secciones del Módulo 01...`);
  for (const section of PYTHON_SECTIONS) {
    await SectionModel.updateOne({ slug: section.slug }, { $set: section }, { upsert: true });
  }

  // 6. Micro-lecciones con la Tríada Evaluativa
  console.log(`🧩 Sembrando ${PYTHON_LESSONS.length} micro-lecciones con Tríada Evaluativa...`);
  for (const lesson of PYTHON_LESSONS) {
    await LessonModel.updateOne({ slug: lesson.slug }, { $set: lesson }, { upsert: true });
  }

  // 7. Bancos de preguntas diagnósticas y de examen
  console.log(`🧠 Sembrando ${PYTHON_QUESTION_BANKS.length} bancos de reactivos evaluativos...`);
  for (const bank of PYTHON_QUESTION_BANKS) {
    await QuestionBankModel.updateOne(
      { module_slug: bank.module_slug, difficulty: bank.difficulty },
      { $set: bank },
      { upsert: true },
    );
  }

  console.log('🎉 [Koda MongoDB Seeder] ¡Siembra curricular completada exitosamente en MongoDB!');
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Error ejecutando el seed de MongoDB:', error);
  process.exit(1);
});
