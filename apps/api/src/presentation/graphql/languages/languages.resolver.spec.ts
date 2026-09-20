import { Test, TestingModule } from '@nestjs/testing';
import { LanguagesResolver } from './languages.resolver';
import { LanguagesService } from '../../../modules/languages/languages.service';

describe('LanguagesResolver', () => {
  let resolver: LanguagesResolver;
  let languagesService: jest.Mocked<LanguagesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguagesResolver,
        {
          provide: LanguagesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { id: '1', slug: 'python', name: 'Python', color: '#FFE873', total_modules: 5, is_active: true },
            ]),
            findBySlug: jest.fn().mockResolvedValue({
              id: '1',
              slug: 'python',
              name: 'Python',
              color: '#FFE873',
              total_modules: 5,
              is_active: true,
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<LanguagesResolver>(LanguagesResolver);
    languagesService = module.get(LanguagesService);
  });

  it('should list all languages', async () => {
    const res = await resolver.getLanguages();
    expect(res).toHaveLength(1);
    expect(languagesService.findAll).toHaveBeenCalled();
  });

  it('should get language by slug', async () => {
    const res = await resolver.getLanguageBySlug('python');
    expect(res.slug).toBe('python');
    expect(languagesService.findBySlug).toHaveBeenCalledWith('python');
  });
});
