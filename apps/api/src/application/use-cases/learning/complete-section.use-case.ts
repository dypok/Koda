import { Inject, Injectable, Logger, BadRequestException } from '@nestjs/common';
import { IProgressRepository, PROGRESS_REPOSITORY_TOKEN } from '@domain/repositories/progress.repository';
import { CompleteSectionDto } from '../../dto/learning/complete-section.dto';
import { SectionCompletionResponseDto } from '../../dto/learning/section-completion-response.dto';
import { SectionStarsEntity } from '@domain/entities/section-stars.entity';

@Injectable()
export class CompleteSectionUseCase {
  private readonly logger = new Logger(CompleteSectionUseCase.name);

  constructor(
    @Inject(PROGRESS_REPOSITORY_TOKEN)
    private readonly progressRepository: IProgressRepository,
  ) {}

  async execute(userId: string, dto: CompleteSectionDto): Promise<SectionCompletionResponseDto> {
    if (!userId) {
      throw new BadRequestException('ID de usuario requerido para registrar la completitud de la sección.');
    }

    const { sectionId, moduleId, courseId, accuracyPercentage } = dto;

    if (accuracyPercentage < 0 || accuracyPercentage > 100) {
      throw new BadRequestException('El porcentaje de aciertos debe estar comprendido entre 0 y 100.');
    }

    this.logger.log(
      `Procesando cierre de sección ${sectionId} para usuario ${userId} (Acierto: ${accuracyPercentage}%)`,
    );

    const result = await this.progressRepository.saveSectionCompletion({
      userId,
      sectionId,
      moduleId,
      courseId,
      accuracyPercentage,
    });

    const attemptStars = SectionStarsEntity.calculateStars(accuracyPercentage);

    return SectionCompletionResponseDto.fromResult({
      entity: result.sectionStars,
      attemptStars,
      isNewlyPassed: result.isNewlyPassed,
      isNewBest: result.isNewBest,
      xpAwarded: result.xpAwarded,
      userTotalXp: result.userTotalXp,
    });
  }
}
