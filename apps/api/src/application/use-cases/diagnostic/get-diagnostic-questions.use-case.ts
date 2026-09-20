import { Injectable } from '@nestjs/common';
import { PYTHON_DIAGNOSTIC_QUESTIONS } from '@domain/entities/diagnostic.entity';
import {
  DiagnosticQuestionsResponseDto,
  DiagnosticQuestionItemDto,
} from '../../dto/diagnostic/diagnostic-questions-response.dto';

@Injectable()
export class GetDiagnosticQuestionsUseCase {
  execute(languageSlug = 'python'): DiagnosticQuestionsResponseDto {
    const questions: DiagnosticQuestionItemDto[] = PYTHON_DIAGNOSTIC_QUESTIONS.map((q) => ({
      id: q.id,
      order: q.order,
      blockId: q.blockId,
      blockName: q.blockName,
      moduleCode: q.moduleCode,
      moduleTitle: q.moduleTitle,
      prompt: q.prompt,
      codeSnippet: q.codeSnippet,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
      })),
    }));

    return {
      languageSlug,
      totalQuestions: questions.length,
      suggestedDurationMinutes: 15,
      questions,
    };
  }
}
