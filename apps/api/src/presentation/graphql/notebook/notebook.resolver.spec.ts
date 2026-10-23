import { Test, TestingModule } from '@nestjs/testing';
import { NotebookResolver } from './notebook.resolver';
import { NotebookService } from '../../../modules/notebook/notebook.service';
import { SupabaseService } from '../../../database/supabase.service';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

describe('NotebookResolver', () => {
  let resolver: NotebookResolver;
  let notebookService: jest.Mocked<NotebookService>;

  const mockUser: SupabaseAuthUser = {
    id: 'user-1',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotebookResolver,
        {
          provide: SupabaseService,
          useValue: {
            validateToken: jest.fn(),
          },
        },
        {
          provide: NotebookService,
          useValue: {
            getMistakes: jest.fn().mockResolvedValue([
              {
                id: 'm-1',
                user_id: 'user-1',
                question_id: 'q-1',
                lesson_title: 'Variables',
                prompt: '¿Qué imprime?',
                error_count: 2,
                is_resolved: false,
                created_at: '2026-09-20',
                last_failed_at: '2026-09-20',
              },
            ]),
            resolveMistake: jest.fn().mockResolvedValue({ success: true, xp_reward: 5 }),
          },
        },
      ],
    }).compile();

    resolver = module.get<NotebookResolver>(NotebookResolver);
    notebookService = module.get(NotebookService);
  });

  it('should get mistakes for user', async () => {
    const res = await resolver.getMistakes(mockUser);
    expect(res).toHaveLength(1);
    expect(notebookService.getMistakes).toHaveBeenCalledWith('user-1');
  });

  it('should resolve mistake with SM-2 reward', async () => {
    const res = await resolver.resolveMistake('q-1', mockUser);
    expect(res.success).toBe(true);
    expect(res.xp_reward).toBe(5);
    expect(notebookService.resolveMistake).toHaveBeenCalledWith('user-1', 'q-1');
  });
});
