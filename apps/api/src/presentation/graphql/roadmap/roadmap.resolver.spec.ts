import { Test, TestingModule } from '@nestjs/testing';
import { RoadmapResolver } from './roadmap.resolver';
import { RoadmapService } from '../../../modules/roadmap/roadmap.service';

describe('RoadmapResolver', () => {
  let resolver: RoadmapResolver;
  let roadmapService: jest.Mocked<RoadmapService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoadmapResolver,
        {
          provide: RoadmapService,
          useValue: {
            getCoursesGraph: jest.fn().mockResolvedValue({ sectorTitle: 'Python', nodes: [], connections: [] }),
            getLessonsGraph: jest.fn().mockResolvedValue({ sectorTitle: 'Variables', nodes: [], connections: [] }),
            seedDataset: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    resolver = module.get<RoadmapResolver>(RoadmapResolver);
    roadmapService = module.get(RoadmapService);
  });

  it('should return courses graph from RoadmapService', async () => {
    const res = await resolver.getCoursesGraph('python');
    expect(res.sectorTitle).toBe('Python');
    expect(roadmapService.getCoursesGraph).toHaveBeenCalledWith('python');
  });

  it('should return lessons graph from RoadmapService', async () => {
    const res = await resolver.getLessonsGraph('course-1');
    expect(res.sectorTitle).toBe('Variables');
    expect(roadmapService.getLessonsGraph).toHaveBeenCalledWith('course-1');
  });

  it('should seed dataset via RoadmapService', async () => {
    const res = await resolver.seedRoadmapDataset({
      language: 'python',
      courseId: 'course-1',
      coursesDataset: { sectorTitle: 'C', progressPercent: 0, nodes: [], connections: [] },
      lessonsDataset: { sectorTitle: 'L', progressPercent: 0, nodes: [], connections: [] },
    });
    expect(res).toBe(true);
    expect(roadmapService.seedDataset).toHaveBeenCalled();
  });
});
