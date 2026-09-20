import { Inject, Injectable } from '@nestjs/common';
import {
  CURRICULUM_REPOSITORY_TOKEN,
  ICurriculumRepository,
} from '../../../domain/repositories/curriculum.repository';
import { TrackEntity } from '../../../domain/entities/curriculum';

@Injectable()
export class GetTracksUseCase {
  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
  ) {}

  async execute(): Promise<TrackEntity[]> {
    return this.curriculumRepository.findTracks();
  }
}
