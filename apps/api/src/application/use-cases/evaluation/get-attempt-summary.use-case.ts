import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../../database/supabase.service';
import { ContentBundleService } from '../../../infra/content/content-bundle.service';

export interface AttemptSummaryDetail {
  question_id: string;
  prompt?: string;
  user_answer?: string;
  correct_answer?: string;
  is_correct: boolean;
  explanation?: string;
}

export interface AttemptSummaryResult {
  attempt_id: string;
  passed: boolean;
  score: number;
  details: AttemptSummaryDetail[];
}

@Injectable()
export class GetAttemptSummaryUseCase {
  private readonly logger = new Logger(GetAttemptSummaryUseCase.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly contentBundleService: ContentBundleService,
  ) {}

  async execute(userId: string, attemptId: string): Promise<AttemptSummaryResult> {
    const client = this.supabaseService.getClient();

    const { data: attempt } = await client
      .from('attempts')
      .select('*')
      .eq('id', attemptId)
      .eq('user_id', userId)
      .single();

    if (!attempt) {
      throw new NotFoundException(`Intento con ID '${attemptId}' no encontrado.`);
    }

    const { data: answers } = await client
      .from('attempt_answers')
      .select('*')
      .eq('attempt_id', attemptId);

    const bank = this.contentBundleService.getModuleBank(attempt.language_code, attempt.module_id);

    const summary: AttemptSummaryDetail[] = (answers || []).map((ans: any) => {
      const q = bank.find((x) => x.id === ans.question_id);
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
      score: summary.length > 0 ? (summary.filter((s) => s.is_correct).length / summary.length) * 100 : 0,
      details: summary,
    };
  }
}
