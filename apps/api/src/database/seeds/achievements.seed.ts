import { PrismaClient } from '@prisma/client';

export const MVP_ACHIEVEMENTS = [
  {
    code: 'first_lesson',
    title: '¡Hola, Mundo!',
    description: 'Completa tu primera lección de programación',
    iconName: 'Sparkle',
    category: 'curriculum',
    xpReward: 50,
    conditionType: 'lessons_completed',
    conditionValue: 1,
  },
  {
    code: 'first_streak',
    title: 'Primera Racha',
    description: 'Completa tu primer día de estudio',
    iconName: 'Flame',
    category: 'streak',
    xpReward: 50,
    conditionType: 'streak_days',
    conditionValue: 1,
  },
  {
    code: 'xp_100',
    title: 'Primeros 100 XP',
    description: 'Acumula tus primeros 100 puntos de experiencia',
    iconName: 'Lightning',
    category: 'xp',
    xpReward: 50,
    conditionType: 'total_xp',
    conditionValue: 100,
  },
  {
    code: 'profile_ready',
    title: 'Identidad Koda',
    description: 'Personaliza tu nombre y avatar oficial de estudiante',
    iconName: 'User',
    category: 'curriculum',
    xpReward: 30,
    conditionType: 'profile_customized',
    conditionValue: 1,
  },
  {
    code: 'streak_3_days',
    title: 'Encendiendo Motores',
    description: 'Mantén una racha de 3 días consecutivos de práctica',
    iconName: 'Flame',
    category: 'streak',
    xpReward: 75,
    conditionType: 'streak_days',
    conditionValue: 3,
  },
  {
    code: 'streak_7_days',
    title: 'Semana de Fuego',
    description: 'Mantén una racha de 7 días continuos de estudio',
    iconName: 'Flame',
    category: 'streak',
    xpReward: 150,
    conditionType: 'streak_days',
    conditionValue: 7,
  },
  {
    code: 'streak_14_days',
    title: 'Hábito de Hierro',
    description: '14 días seguidos forjando tu disciplina con Python',
    iconName: 'Shield',
    category: 'streak',
    xpReward: 250,
    conditionType: 'streak_days',
    conditionValue: 14,
  },
  {
    code: 'streak_30_days',
    title: 'Mes Legendario',
    description: '30 días seguidos de racha activa imparable',
    iconName: 'Trophy',
    category: 'streak',
    xpReward: 500,
    conditionType: 'streak_days',
    conditionValue: 30,
  },
  {
    code: 'first_star_3',
    title: 'Perfección Absoluta',
    description: 'Consigue 3 estrellas en tu primera sección',
    iconName: 'Star',
    category: 'mastery',
    xpReward: 100,
    conditionType: 'stars_3_count',
    conditionValue: 1,
  },
  {
    code: 'stars_15',
    title: 'Coleccionista de Estrellas',
    description: 'Acumula 15 estrellas de maestría en el Roadmap',
    iconName: 'Star',
    category: 'mastery',
    xpReward: 150,
    conditionType: 'total_stars',
    conditionValue: 15,
  },
  {
    code: 'first_module_master',
    title: 'Maestro del Módulo',
    description: 'Domina un módulo completo con más del 80% de estrellas',
    iconName: 'Trophy',
    category: 'mastery',
    xpReward: 300,
    conditionType: 'modules_mastered',
    conditionValue: 1,
  },
  {
    code: 'modules_3_master',
    title: 'Trilogía de Código',
    description: 'Domina 3 módulos completos del currículo',
    iconName: 'Trophy',
    category: 'mastery',
    xpReward: 450,
    conditionType: 'modules_mastered',
    conditionValue: 3,
  },
  {
    code: 'first_remediation',
    title: 'Aprendiendo del Error',
    description: 'Remedia tu primer fallo en el Cuaderno de Errores',
    iconName: 'BookOpen',
    category: 'curriculum',
    xpReward: 75,
    conditionType: 'mistakes_resolved',
    conditionValue: 1,
  },
  {
    code: 'remediation_10',
    title: 'Cazador de Errores',
    description: 'Resuelve 10 fallos en el Cuaderno de Errores con SM-2',
    iconName: 'BookOpen',
    category: 'curriculum',
    xpReward: 200,
    conditionType: 'mistakes_resolved',
    conditionValue: 10,
  },
  {
    code: 'quiz_flawless',
    title: 'Mente Brillante',
    description: 'Obtén 100% de aciertos en un Quiz de sección',
    iconName: 'Sparkle',
    category: 'mastery',
    xpReward: 100,
    conditionType: 'quiz_flawless',
    conditionValue: 1,
  },
  {
    code: 'first_exam_pass',
    title: 'Aprobado con Honores',
    description: 'Supera un Examen de Certificación con calificación sobresaliente',
    iconName: 'ShieldCheck',
    category: 'mastery',
    xpReward: 250,
    conditionType: 'exams_passed',
    conditionValue: 1,
  },
  {
    code: 'apex_gate',
    title: 'Apex Slayer',
    description: 'Desbloquea y supera el desafío final Apex Master Gate',
    iconName: 'Crown',
    category: 'mastery',
    xpReward: 500,
    conditionType: 'apex_cleared',
    conditionValue: 1,
  },
  {
    code: 'speed_demon',
    title: 'Velocidad Pura',
    description: 'Completa un desafío en menos de 60 segundos sin fallos',
    iconName: 'Lightning',
    category: 'speed',
    xpReward: 100,
    conditionType: 'speed_demon',
    conditionValue: 1,
  },
];

export async function seedAchievements(prisma: PrismaClient) {
  let createdCount = 0;
  let updatedCount = 0;

  for (const ach of MVP_ACHIEVEMENTS) {
    const existing = await prisma.achievement.findUnique({
      where: { code: ach.code },
    });

    if (existing) {
      await prisma.achievement.update({
        where: { code: ach.code },
        data: {
          title: ach.title,
          description: ach.description,
          iconName: ach.iconName,
          category: ach.category,
          xpReward: ach.xpReward,
          conditionType: ach.conditionType,
          conditionValue: ach.conditionValue,
          isActive: true,
        },
      });
      updatedCount++;
    } else {
      await prisma.achievement.create({
        data: {
          code: ach.code,
          title: ach.title,
          description: ach.description,
          iconName: ach.iconName,
          category: ach.category,
          xpReward: ach.xpReward,
          conditionType: ach.conditionType,
          conditionValue: ach.conditionValue,
          isActive: true,
        },
      });
      createdCount++;
    }
  }

  return { createdCount, updatedCount, total: MVP_ACHIEVEMENTS.length };
}

if (require.main === module) {
  const prisma = new PrismaClient();
  seedAchievements(prisma)
    .then((res) => {
      console.log(`[Seed Achievements] Éxito: ${res.createdCount} creados, ${res.updatedCount} actualizados (${res.total} en total).`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Achievements] Error:', err);
      process.exit(1);
    });
}
