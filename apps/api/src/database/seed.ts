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
  Lesson,
  LessonSchema,
  VisualEffect,
  VisualEffectSchema,
} from './schemas';
import { INITIAL_TRACKS, INITIAL_PYTHON_COURSE, INITIAL_PYTHON_LESSON } from './seeds/initial-curriculum.seed';
import { INITIAL_VISUAL_EFFECTS } from './seeds/visual-effects.seed';

async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/koda';
  console.log(`Conectando a MongoDB en ${uri}...`);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  const TrackModel = mongoose.model(Track.name, TrackSchema);
  const CourseModel = mongoose.model(Course.name, CourseSchema);
  const LessonModel = mongoose.model(Lesson.name, LessonSchema);
  const VisualEffectModel = mongoose.model(VisualEffect.name, VisualEffectSchema);

  console.log(`Sembrando ${INITIAL_VISUAL_EFFECTS.length} efectos visuales...`);
  for (const effect of INITIAL_VISUAL_EFFECTS) {
    await VisualEffectModel.updateOne({ code: effect.code }, { $set: effect }, { upsert: true });
  }

  console.log(`Sembrando ${INITIAL_TRACKS.length} pistas (tracks)...`);
  for (const track of INITIAL_TRACKS) {
    await TrackModel.updateOne({ slug: track.slug }, { $set: track }, { upsert: true });
  }

  console.log('Sembrando curso "python-core"...');
  await CourseModel.updateOne(
    { slug: INITIAL_PYTHON_COURSE.slug },
    { $set: INITIAL_PYTHON_COURSE },
    { upsert: true },
  );

  console.log('Sembrando lección "py-m01-s01-l01"...');
  await LessonModel.updateOne(
    { slug: INITIAL_PYTHON_LESSON.slug },
    { $set: INITIAL_PYTHON_LESSON },
    { upsert: true },
  );

  console.log('Seed completado con éxito.');
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Error ejecutando el seed de MongoDB:', error);
  process.exit(1);
});
