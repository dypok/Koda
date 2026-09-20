import { Test, TestingModule } from '@nestjs/testing';
import { CurriculumResolver } from './curriculum.resolver';
import {
  GetTracksUseCase,
  GetTrackCoursesUseCase,
  GetCourseDetailUseCase,
  GetLessonDetailUseCase,
  GetVisualEffectsUseCase,
} from '../../../application/use-cases/curriculum';

describe('CurriculumResolver', () => {
  let resolver: CurriculumResolver;
  let getTracksUseCase: jest.Mocked<GetTracksUseCase>;
  let getTrackCoursesUseCase: jest.Mocked<GetTrackCoursesUseCase>;
  let getCourseDetailUseCase: jest.Mocked<GetCourseDetailUseCase>;
  let getLessonDetailUseCase: jest.Mocked<GetLessonDetailUseCase>;
  let getVisualEffectsUseCase: jest.Mocked<GetVisualEffectsUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurriculumResolver,
        {
          provide: GetTracksUseCase,
          useValue: { execute: jest.fn().mockResolvedValue([{ slug: 'python', name: 'Python' }]) },
        },
        {
          provide: GetTrackCoursesUseCase,
          useValue: { execute: jest.fn().mockResolvedValue({ track: { slug: 'python' }, courses: [] }) },
        },
        {
          provide: GetCourseDetailUseCase,
          useValue: { execute: jest.fn().mockResolvedValue({ course: { slug: 'python-core' }, modules: [] }) },
        },
        {
          provide: GetLessonDetailUseCase,
          useValue: { execute: jest.fn().mockResolvedValue({ slug: 'py-01-variables', title: 'Variables' }) },
        },
        {
          provide: GetVisualEffectsUseCase,
          useValue: { execute: jest.fn().mockResolvedValue([{ code: 'glow_cyan', name: 'Glow Cyan' }]) },
        },
      ],
    }).compile();

    resolver = module.get<CurriculumResolver>(CurriculumResolver);
    getTracksUseCase = module.get(GetTracksUseCase);
    getTrackCoursesUseCase = module.get(GetTrackCoursesUseCase);
    getCourseDetailUseCase = module.get(GetCourseDetailUseCase);
    getLessonDetailUseCase = module.get(GetLessonDetailUseCase);
    getVisualEffectsUseCase = module.get(GetVisualEffectsUseCase);
  });

  it('should return tracks via GetTracksUseCase', async () => {
    const result = await resolver.getTracks();
    expect(result).toHaveLength(1);
    expect(getTracksUseCase.execute).toHaveBeenCalled();
  });

  it('should return track courses via GetTrackCoursesUseCase', async () => {
    const result = await resolver.getTrackBySlug('python');
    expect(result.track.slug).toBe('python');
    expect(getTrackCoursesUseCase.execute).toHaveBeenCalledWith('python');
  });

  it('should return course detail via GetCourseDetailUseCase', async () => {
    const result = await resolver.getCourseBySlug('python-core');
    expect(result.course.slug).toBe('python-core');
    expect(getCourseDetailUseCase.execute).toHaveBeenCalledWith('python-core');
  });

  it('should return lesson detail via GetLessonDetailUseCase', async () => {
    const result = await resolver.getLessonBySlug('py-01-variables');
    expect(result.slug).toBe('py-01-variables');
    expect(getLessonDetailUseCase.execute).toHaveBeenCalledWith('py-01-variables');
  });

  it('should return visual effects presets via GetVisualEffectsUseCase', async () => {
    const result = await resolver.getVisualEffects();
    expect(result).toHaveLength(1);
    expect(getVisualEffectsUseCase.execute).toHaveBeenCalled();
  });
});
