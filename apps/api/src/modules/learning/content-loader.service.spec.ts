import { ContentLoaderService } from './content-loader.service';
import * as fs from 'fs';

describe('ContentLoaderService', () => {
  let service: ContentLoaderService;

  beforeEach(() => {
    service = new ContentLoaderService();
    service.loadAllContent();
  });

  afterEach(() => {
    service.onModuleDestroy();
    jest.restoreAllMocks();
  });

  it('loads Lua and Python languages with proper colors', () => {
    const lua = service.getLanguageBySlug('lua');
    expect(lua).toBeDefined();
    expect(lua?.color).toBe('#8FA8FF');

    const python = service.getLanguageBySlug('python');
    expect(python).toBeDefined();
    expect(python?.color).toBe('#3776AB');
  });

  it('returns Lua modules in getCourseRoadmap("lua") (resolving L-01)', () => {
    const roadmap = service.getCourseRoadmap('lua');
    expect(roadmap).not.toBeNull();
    expect(roadmap?.language.slug).toBe('lua');
    expect(roadmap?.modules.length).toBeGreaterThan(0);
    expect(roadmap?.modules[0].id).toBeTruthy();
    expect(roadmap?.modules[0].code).toMatch(/LUA/i);
    expect(roadmap?.modules[0].sections.length).toBeGreaterThan(0);
  });

  it('indexes and evaluates canonical Lua lessons and exercises', () => {
    const roadmap = service.getCourseRoadmap('lua');
    expect(roadmap).not.toBeNull();

    // Find a valid lesson from Lua's loaded lessons (by code or id)
    const lesson =
      service.getLesson('lua_m01_s01_l01') ||
      service.getLesson('LUA_M01_S01_L01') ||
      service.getLesson('lua-m01-s01-l01') ||
      Array.from((service as any).lessonsMap.values())
        .map((r: any) => r.lesson)
        .find((l: any) => l.section_id === roadmap!.modules[0].sections[0].id);

    expect(lesson).toBeDefined();
    expect(lesson).not.toBeNull();
    expect(lesson?.title).toBeTruthy();
    expect(lesson?.theory_markdown.length).toBeGreaterThan(0);
    expect(lesson?.question).toBeDefined();
    expect(lesson?.question?.options.length).toBeGreaterThan(0);

    // Evaluate with wrong option first
    const wrongFeedback = service.evaluateAnswer({
      lesson_id: lesson!.id,
      question_id: lesson!.question!.id,
      selected_option_ids: ['non_existent_option'],
    });
    expect(wrongFeedback.is_correct).toBe(false);
    expect(wrongFeedback.added_to_review_queue).toBe(true);
  });

  it('sets up debounced fs.watch and reloads on .json changes (resolving L-04)', () => {
    jest.useFakeTimers();
    let watchCallback: ((event: string, filename: string) => void) | undefined;
    const closeMock = jest.fn();

    jest.spyOn(fs, 'watch').mockImplementation(((_path: any, _opts: any, cb: any) => {
      watchCallback = typeof _opts === 'function' ? _opts : cb;
      return { close: closeMock } as any;
    }) as any);

    const loadSpy = jest.spyOn(service, 'loadAllContent').mockImplementation(() => {});

    service.setupContentWatcher('/tmp');
    expect(watchCallback).toBeDefined();

    // Trigger multiple rapid events on a .json file
    watchCallback!('change', 'module.json');
    watchCallback!('change', 'bank.json');
    expect(loadSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(350);
    expect(loadSpy).toHaveBeenCalledTimes(1);

    service.onModuleDestroy();
    expect(closeMock).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
