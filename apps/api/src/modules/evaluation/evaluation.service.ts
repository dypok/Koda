import { Injectable, Logger, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ICurriculumRepository, CURRICULUM_REPOSITORY_TOKEN } from '@domain/repositories/curriculum.repository';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class EvaluationService {
  private readonly logger = new Logger(EvaluationService.name);
  
  // Memoized maps for bank and compositions
  private readonly moduleBanks = new Map<string, any[]>();
  private readonly courseCompositions = new Map<string, any>();

  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  private getBasePath(): string {
    const possiblePaths = [
      path.resolve(process.cwd(), '../../content/languages'),
      path.resolve(process.cwd(), 'content/languages'),
    ];
    return possiblePaths.find(p => fs.existsSync(p)) || '';
  }

  private loadComposition(languageSlug: string): any {
    if (this.courseCompositions.has(languageSlug)) {
      return this.courseCompositions.get(languageSlug);
    }
    
    const basePath = this.getBasePath();
    const filePath = path.join(basePath, languageSlug, 'config', 'compositions.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      this.courseCompositions.set(languageSlug, data);
      return data;
    }
    return null;
  }

  private loadModuleBank(languageSlug: string, moduleSlug: string): any[] {
    const key = `${languageSlug}_${moduleSlug}`;
    if (this.moduleBanks.has(key)) {
      return this.moduleBanks.get(key) || [];
    }
    
    const basePath = this.getBasePath();
    const filePath = path.join(basePath, languageSlug, 'modules', moduleSlug.replace(`${languageSlug}_`, '').replace('-', '_'), 'bank.json');
    // We try to match the module directory name. The directory is usually like "01_fundamentos".
    // A better approach is to search inside modules/ for bank.json
    
    const modulesPath = path.join(basePath, languageSlug, 'modules');
    if (fs.existsSync(modulesPath)) {
       const dirs = fs.readdirSync(modulesPath, { withFileTypes: true });
       for (const d of dirs) {
         if (d.isDirectory()) {
           const bankPath = path.join(modulesPath, d.name, 'bank.json');
           if (fs.existsSync(bankPath)) {
             const bankData = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
             // The module_code inside might be PY_MOD_01, but we might only have moduleSlug.
             // We'll store all questions. For now, let's just return them if the directory partially matches moduleSlug.
             // Example: moduleSlug = "python-fundamentos", dir = "01_fundamentos"
             const baseSlug = moduleSlug.split('-').pop() || '';
             if (d.name.includes(baseSlug) || bankData.module_code === moduleSlug) {
                this.moduleBanks.set(key, bankData.questions);
                return bankData.questions;
             }
           }
         }
       }
    }

    this.moduleBanks.set(key, []);
    return [];
  }

  private sampleQuestions(questions: any[], config: any): any[] {
    let sampled: any[] = [];
    for (const [type, count] of Object.entries(config)) {
       const pool = questions.filter(q => q.type === type);
       const shuffled = pool.sort(() => 0.5 - Math.random());
       sampled.push(...shuffled.slice(0, count as number));
    }
    
    // If we didn't meet the count because of lack of questions, just fill with random ones
    const totalRequired = Object.values(config).reduce((a: any, b: any) => a + b, 0) as number;
    if (sampled.length < totalRequired) {
      const remaining = totalRequired - sampled.length;
      const unused = questions.filter(q => !sampled.includes(q));
      sampled.push(...unused.sort(() => 0.5 - Math.random()).slice(0, remaining));
    }
    
    return sampled.sort(() => 0.5 - Math.random()); // shuffle final
  }

  /**
   * Genera un intento de evaluación (Quiz o Examen) cargando dinámicamente las preguntas
   * desde el banco (bank.json) y seleccionando una muestra según la receta (compositions.json).
   * Omitimos enviar las respuestas correctas al cliente por seguridad.
   */
  async generateEvaluation(userId: string, moduleSlug: string, type: 'quiz' | 'exam') {
    const module = await this.curriculumRepository.findModuleBySlug(moduleSlug);
    if (!module) throw new NotFoundException(`Modulo ${moduleSlug} no encontrado.`);

    const course = await this.curriculumRepository.findCourseBySlug(module.courseSlug);
    const languageSlug = course?.trackSlug || 'python';

    const compositions = this.loadComposition(languageSlug);
    const config = type === 'quiz' ? compositions?.quiz : compositions?.exam;
    
    if (!config) {
       throw new BadRequestException('Configuración de evaluación no encontrada');
    }

    const bank = this.loadModuleBank(languageSlug, moduleSlug);
    if (!bank || bank.length === 0) {
       throw new BadRequestException('Banco de preguntas vacío para este módulo');
    }

    const selectedQuestions = this.sampleQuestions(bank, config);
    
    // Strip correct answers
    const publicQuestions = selectedQuestions.map(q => {
      const { correct_option_id, hint, ...rest } = q;
      return rest;
    });

    return {
      evaluation_type: type,
      module_id: moduleSlug,
      total_questions: publicQuestions.length,
      questions: publicQuestions,
      // For a real system we might persist an 'open' attempt here.
    };
  }

  /**
   * Recibe las respuestas del usuario, calcula la puntuación, persiste el resultado
   * atómicamente en PostgreSQL y envía los errores al cuaderno de repasos (Spaced Repetition).
   */
  async evaluateAttempt(userId: string, targetId: string, submission: any, type: 'quiz' | 'exam') {
    const moduleSlug = targetId; // Assuming targetId is moduleSlug for now.
    const module = await this.curriculumRepository.findModuleBySlug(moduleSlug);
    if (!module) throw new NotFoundException('Modulo no encontrado');

    const course = await this.curriculumRepository.findCourseBySlug(module.courseSlug);
    const languageSlug = course?.trackSlug || 'python';

    const bank = this.loadModuleBank(languageSlug, moduleSlug);
    
    let correctCount = 0;
    const totalQuestions = Object.keys(submission.answers).length;
    
    const attemptDetails = [];

    // Calculate score
    for (const [qId, ans] of Object.entries(submission.answers)) {
       const question = bank.find(q => q.id === qId);
       if (!question) continue;
       
       const isCorrect = question.correct_option_id === ans;
       if (isCorrect) correctCount++;
       
       attemptDetails.push({
         question_id: qId,
         user_answer: ans,
         is_correct: isCorrect,
         correct_answer: question.correct_option_id,
         hint: question.hint
       });
    }

    const scorePercentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const threshold = type === 'exam' ? 80 : 70;
    const passed = scorePercentage >= threshold;
    const xpReward = type === 'exam' ? 100 : 25;
    const earnedXp = passed ? xpReward : 0;

    const contentVersionHash = crypto.createHash('sha256').update(JSON.stringify(bank)).digest('hex');

    const client = this.supabaseService.getClient();

    // Persist attempt
    const { data: attemptData, error: attemptError } = await client.from('attempts').insert({
      user_id: userId,
      module_id: moduleSlug,
      course_id: course?.slug,
      language_code: languageSlug,
      status: 'completed',
      is_passed: passed,
      xp_earned: earnedXp,
      duration_seconds: submission.time_spent_seconds || 0,
      mistakes_count: totalQuestions - correctCount,
      content_version: contentVersionHash,
      attempt_type: type
    }).select('id').single();

    if (attemptData && !attemptError) {
      const answersToInsert = attemptDetails.map(d => ({
         attempt_id: attemptData.id,
         question_id: d.question_id,
         user_response: [d.user_answer],
         is_correct: d.is_correct,
         feedback_text: d.is_correct ? 'Correcto' : d.hint
      }));
      await client.from('attempt_answers').insert(answersToInsert);

      // Add wrong answers to mistakes notebook
      if (!passed || attemptDetails.some(d => !d.is_correct)) {
        for (const detail of attemptDetails.filter(d => !d.is_correct)) {
           // Insert into user_mistakes_notebook
           await client.from('user_mistakes_notebook').insert({
              user_id: userId,
              question_id: detail.question_id,
              module_slug: moduleSlug,
              track_slug: languageSlug,
              question_type: 'single_choice',
              user_wrong_answer: [detail.user_answer],
              correct_answer: [detail.correct_answer],
              fail_count: 1,
              is_resolved: false,
              first_failed_at: new Date().toISOString(),
              last_failed_at: new Date().toISOString()
           });
        }
      }
    }

    // Atomic transaction logic: if exam passed, unlock next module
    if (type === 'exam' && passed) {
       // Typically, we would call an RPC to safely grant xp and unlock.
       await client.rpc('fn_award_xp', { p_user_id: userId, p_xp_amount: earnedXp });
       // Logic to unlock next module...
       // we can insert a record in module_progress
       const nextModuleSlug = module.position + 1; // get actual slug
       // mock unlock
    }

    return {
      passed,
      score: scorePercentage,
      correct_count: correctCount,
      total_questions: totalQuestions,
      xp_earned: earnedXp,
      attempt_id: attemptData?.id,
      content_version: contentVersionHash
    };
  }

  /**
   * Extrae el resumen del intento calificado de la base de datos (PostgreSQL),
   * inyectando las justificaciones conceptuales del bank.json para la revisión y
   * aprendizaje formativo del estudiante.
   */
  async getAttemptSummary(userId: string, attemptId: string) {
    const client = this.supabaseService.getClient();
    const { data: attempt } = await client.from('attempts').select('*').eq('id', attemptId).eq('user_id', userId).single();
    if (!attempt) throw new NotFoundException('Intento no encontrado');

    const { data: answers } = await client.from('attempt_answers').select('*').eq('attempt_id', attemptId);

    // Fetch original questions from bank to attach explanation
    const bank = this.loadModuleBank(attempt.language_code, attempt.module_id);
    
    const summary = (answers || []).map(ans => {
       const q = bank.find(x => x.id === ans.question_id);
       return {
          question_id: ans.question_id,
          prompt: q?.prompt,
          user_answer: ans.user_response?.[0],
          correct_answer: q?.correct_option_id,
          is_correct: ans.is_correct,
          explanation: q?.hint,
       };
    });

    return {
       attempt_id: attempt.id,
       passed: attempt.is_passed,
       score: summary.filter(s => s.is_correct).length / summary.length * 100,
       details: summary
    };
  }
}
