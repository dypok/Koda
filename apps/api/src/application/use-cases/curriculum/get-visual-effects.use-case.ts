import { Inject, Injectable } from '@nestjs/common';
import {
  CURRICULUM_REPOSITORY_TOKEN,
  ICurriculumRepository,
} from '../../../domain/repositories/curriculum.repository';
import { VisualEffectEntity } from '../../../domain/entities/curriculum';

@Injectable()
export class GetVisualEffectsUseCase {
  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
  ) {}

  async execute(): Promise<VisualEffectEntity[]> {
    return this.curriculumRepository.findVisualEffects();
  }
}
