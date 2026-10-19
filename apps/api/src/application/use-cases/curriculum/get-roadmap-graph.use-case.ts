import { Inject, Injectable, NotFoundException, Optional } from '@nestjs/common';
import {
  CURRICULUM_REPOSITORY_TOKEN,
  ICurriculumRepository,
} from '../../../domain/repositories/curriculum.repository';
import {
  PROGRESS_REPOSITORY_TOKEN,
  IProgressRepository,
} from '../../../domain/repositories/progress.repository';
import { SectionStarsEntity } from '../../../domain/entities/section-stars.entity';
import { CourseEntity } from '../../../domain/entities/curriculum';
import {
  GraphConnection,
  GraphDataset,
  GraphNode,
  GraphNodeIconType,
  GraphNodeVariant,
} from '../../../modules/roadmap/roadmap-graph.types';

import * as fs from 'fs';
import * as path from 'path';

function loadLocalCourses(): CourseEntity[] {
  const possiblePaths = [
    path.resolve(process.cwd(), 'content/courses.json'),
    path.resolve(process.cwd(), '../../content/courses.json'),
    path.resolve(__dirname, '../../../../../../../content/courses.json'),
    path.resolve(__dirname, '../../../../../../content/courses.json'),
    path.resolve(__dirname, '../../../../../content/courses.json'),
  ];
  const target = possiblePaths.find((p) => fs.existsSync(p));
  if (!target) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(target, 'utf8'));
    return raw.map((c: any) => new CourseEntity({
      slug: c.slug,
      trackSlug: c.track_slug,
      name: c.name,
      description: c.description,
      color: c.color,
      icon: c.icon,
      topology: {
        tier: c.topology?.tier ?? 0,
        lane: c.topology?.lane ?? 0,
      },
      prerequisites: c.prerequisites ?? [],
      edges: (c.edges ?? []).map((e: any) => ({
        targetCourseSlug: e.target_course_slug,
        connectionType: e.connection_type,
        visualEffectCode: e.visual_effect_code,
        edgeColor: e.edge_color,
      })),
      isActive: c.is_active ?? true,
    }));
  } catch {
    return [];
  }
}

@Injectable()
export class GetRoadmapGraphUseCase {
  constructor(
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
    @Optional()
    @Inject(PROGRESS_REPOSITORY_TOKEN)
    private readonly progressRepository?: IProgressRepository,
  ) {}

  private mapIconType(icon: string): GraphNodeIconType {
    const map: Record<string, GraphNodeIconType> = {
      IconBrandPython: 'brackets',
      IconDeviceDesktop: 'atom',
      IconServer: 'server',
      IconCloudComputing: 'database',
      terminal: 'code',
    };
    return map[icon] ?? 'brackets';
  }

  private generateSvgPath(fromX: number, fromY: number, toX: number, toY: number): string {
    const startX = fromX + 40;
    const startY = fromY + 40;
    const endX = toX + 40;
    const endY = toY + 40;
    const dx = Math.abs(endX - startX) * 0.5;
    return `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
  }

  private buildLinearSectionDataset(
    sectorTitle: string,
    lessons: Array<{
      id: string;
      code: string;
      label: string;
      subtitle: string;
      variant: GraphNodeVariant;
      iconType: GraphNodeIconType;
      stars?: number;
      maxStars?: number;
      xp?: number;
      statusText: string;
    }>,
    edgeColor = '#38BDF8',
  ): GraphDataset {
    const count = lessons.length;
    const startX = 140;
    const endX = 1040;
    const stepX = (endX - startX) / (count - 1 || 1);

    const nodes: GraphNode[] = lessons.map((l, i) => {
      const x = Math.round(startX + i * stepX);
      let y = 290;
      if (i > 0 && i < count - 1) {
        y = i % 2 === 1 ? 230 : 350;
      }
      return {
        id: l.id,
        code: l.code,
        label: l.label,
        subtitle: l.subtitle,
        x,
        y,
        variant: l.variant,
        iconType: l.iconType,
        stars: l.stars ?? 0,
        maxStars: l.maxStars ?? 3,
        xp: l.xp ?? 150,
        statusText: l.statusText,
        isUnlocked: l.variant !== 'locked',
      };
    });

    const connections: GraphConnection[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const n1 = nodes[i];
      const n2 = nodes[i + 1];
      const midX = Math.round((n1.x + n2.x) / 2);
      connections.push({
        id: `c-${n1.id}-to-${n2.id}`,
        fromId: n1.id,
        toId: n2.id,
        color: edgeColor,
        path: `M ${n1.x} ${n1.y} C ${midX} ${n1.y}, ${midX} ${n2.y}, ${n2.x} ${n2.y}`,
        isDashed: !n2.isUnlocked,
      });
    }

    return {
      sectorTitle,
      progressPercent: 0,
      nodes,
      connections,
    };
  }

  async getCoursesGraph(trackOrLangSlug: string, userId?: string): Promise<GraphDataset> {
    const slug = trackOrLangSlug.toLowerCase();
    let allCourses: CourseEntity[] = [];

    try {
      allCourses = await this.curriculumRepository.findAllCourses();
    } catch {
      // MongoDB no disponible
    }

    if (allCourses.length === 0) {
      allCourses = loadLocalCourses();
    }

    if (allCourses.length === 0) {
      throw new NotFoundException(`No hay cursos registrados para '${trackOrLangSlug}'.`);
    }

    // Filtrar por track si se solicita específicamente
    const filteredCourses = slug === 'python'
      ? allCourses.filter((c) => c.trackSlug === 'python')
      : allCourses;

    const displayCourses = filteredCourses.length > 0 ? filteredCourses : allCourses;

    // Coordenadas calculadas según topología DAG
    let nodes: GraphNode[] = displayCourses.map((c: CourseEntity) => {
      const isTrunk = c.topology.tier === 0;
      const x = c.topology.tier * 220 + 140;
      const y = c.topology.lane * 130 + 290;

      return {
        id: c.slug,
        code: c.slug.toUpperCase().slice(0, 4),
        label: c.name,
        subtitle: c.description,
        x,
        y,
        variant: isTrunk ? 'active' : 'locked',
        iconType: this.mapIconType(c.icon),
        stars: 0,
        maxStars: 3,
        xp: 150,
        targetCourseId: c.slug,
        isUnlocked: isTrunk,
        statusText: isTrunk ? 'DISPONIBLE' : 'BLOQUEADO',
      };
    });

    const nodeCoords = new Map<string, { x: number; y: number }>();
    nodes.forEach((n) => nodeCoords.set(n.id, { x: n.x, y: n.y }));

    const connections: GraphConnection[] = [];
    displayCourses.forEach((c) => {
      const fromCoord = nodeCoords.get(c.slug);
      if (!fromCoord) return;

      c.edges.forEach((edge, idx) => {
        const toCoord = nodeCoords.get(edge.targetCourseSlug);
        if (!toCoord) return;

        connections.push({
          id: `edge-${c.slug}-${edge.targetCourseSlug}-${idx}`,
          fromId: c.slug,
          toId: edge.targetCourseSlug,
          color: edge.edgeColor || '#38BDF8',
          path: this.generateSvgPath(fromCoord.x, fromCoord.y, toCoord.x, toCoord.y),
          isDashed: true,
        });
      });
    });

    let progressPercent = 0;
    const completedCourseSlugs = new Set<string>();

    const COURSE_APEX_SECTIONS: Record<string, string[]> = {
      'python-1': ['py-apex-1', 'les-boss', 'funciones-fundamentales'],
      'python-2': ['py2-boss', 'py2-m10', 'py2-m05', 'py2-10', 'testing-con-pytest'],
      'python-3': ['py3-boss', 'py3-m10', 'py3-m05', 'py3-10', 'patrones-de-diseno'],
      'fastapi-async': ['fa-05', 'fa-m05', 'fa-m04', 'fastapi-docker-deploy'],
      'django-enterprise': ['dj-05', 'dj-m05', 'dj-m04', 'django-auth-security-deploy'],
      'data-analytics': ['da-10', 'da-boss', 'streamlit-dashboards'],
      'ai-agents': ['ia-10', 'ia-proyecto-agente-completo'],
      'python-apex': ['apex-03', 'apex-master-gate'],
    };

    if (userId && this.progressRepository) {
      try {
        const userStars = await this.progressRepository.findAllSectionStarsByUser(userId);
        if (userStars && userStars.length > 0) {
          const passedSections = new Set<string>();
          userStars.forEach((s) => {
            if (s.isPassed) {
              passedSections.add(s.sectionId.toLowerCase());
              passedSections.add(s.sectionId.toLowerCase().replace(/[^a-z0-9]/g, ''));
              if (s.moduleId) {
                passedSections.add(s.moduleId.toLowerCase());
                passedSections.add(s.moduleId.toLowerCase().replace(/[^a-z0-9]/g, ''));
              }
            }
          });

          displayCourses.forEach((c) => {
            const apexCandidates = COURSE_APEX_SECTIONS[c.slug] || [];
            const isApexPassed = apexCandidates.some(
              (candidate) =>
                passedSections.has(candidate.toLowerCase()) ||
                passedSections.has(candidate.toLowerCase().replace(/[^a-z0-9]/g, '')),
            );

            const courseStars = userStars
              .filter((s) => {
                const sid = s.sectionId.toLowerCase();
                if (c.slug === 'python-1') return sid.startsWith('py-') || sid.startsWith('les-');
                if (c.slug === 'python-2') return sid.startsWith('py2-');
                if (c.slug === 'python-3') return sid.startsWith('py3-');
                if (c.slug === 'fastapi-async') return sid.startsWith('fa-');
                if (c.slug === 'django-enterprise') return sid.startsWith('dj-');
                if (c.slug === 'data-analytics') return sid.startsWith('da-');
                if (c.slug === 'ai-agents') return sid.startsWith('ia-');
                if (c.slug === 'python-apex') return sid.startsWith('apex-');
                return false;
              })
              .reduce((sum, s) => sum + s.starsEarned, 0);

            if (isApexPassed || (c.slug === 'python-1' && courseStars >= 24)) {
              completedCourseSlugs.add(c.slug);
            }
          });
        }
      } catch {
        // En caso de falla, retornar dataset base
      }
    }

    let hasFoundFirstActive = false;

    nodes = nodes.map((node) => {
      const course = displayCourses.find((c) => c.slug === node.id);
      const isCompleted = completedCourseSlugs.has(node.id);

      if (isCompleted) {
        return {
          ...node,
          stars: node.maxStars ?? 3,
          variant: 'completed' as const,
          isUnlocked: true,
          statusText: 'DOMINADO • 100%',
        };
      }

      const prereqs = course?.prerequisites ?? [];
      const allPrereqsMet = prereqs.length === 0 || prereqs.every((p) => completedCourseSlugs.has(p));

      if (allPrereqsMet) {
        const shouldBeActive = !hasFoundFirstActive;
        if (shouldBeActive) {
          hasFoundFirstActive = true;
        }

        return {
          ...node,
          isUnlocked: true,
          variant: (shouldBeActive ? 'active' : 'unlocked') as GraphNodeVariant,
          statusText: shouldBeActive ? 'DISPONIBLE • EN PROGRESO' : 'DISPONIBLE',
        };
      }

      return {
        ...node,
        isUnlocked: false,
        variant: 'locked' as const,
        statusText: 'BLOQUEADO',
      };
    });

    const updatedConnections = connections.map((conn) => {
      const fromIsCompleted = completedCourseSlugs.has(conn.fromId);
      return {
        ...conn,
        isDashed: !fromIsCompleted,
      };
    });

    progressPercent = Math.round(
      (completedCourseSlugs.size / Math.max(1, displayCourses.length)) * 100,
    );

    return {
      sectorTitle: `SECTOR: ${slug.toUpperCase()} ROADMAP (DAG)`,
      progressPercent,
      nodes,
      connections: updatedConnections,
    };
  }

  async getLessonsGraph(courseSlug: string, userId?: string): Promise<GraphDataset> {
    let normalizedSlug = courseSlug.toLowerCase();
    if (normalizedSlug === 'py-basic' || normalizedSlug === 'python-basico' || normalizedSlug === 'python-core') {
      normalizedSlug = 'python-1';
    } else if (normalizedSlug === 'py-intermediate') {
      normalizedSlug = 'python-2';
    } else if (normalizedSlug === 'py-advanced') {
      normalizedSlug = 'python-3';
    }

    let dataset: GraphDataset;

    // Grafo especializado para Python 1 con Mini-Boss Gate tras Módulo 4
    if (normalizedSlug === 'python-1' || normalizedSlug === 'py-level-1') {
      const nodes: GraphNode[] = [
        {
          id: 'py-m01', code: '01', label: 'ENTORNO & SINTAXIS', subtitle: 'VS CODE, VENV & PRINT',
          x: 130, y: 320, variant: 'active', iconType: 'brackets', stars: 0, maxStars: 3, xp: 120,
          statusText: 'DISPONIBLE • +120 XP', isUnlocked: true,
        },
        {
          id: 'py-m02', code: '02', label: 'VARIABLES & TIPOS', subtitle: 'INT, FLOAT, STR, BOOL & TYPE',
          x: 270, y: 230, variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 150,
          statusText: 'RQ M01', isUnlocked: false,
        },
        {
          id: 'py-m03', code: '03', label: 'OPERADORES & LÓGICA', subtitle: 'ARITMÉTICA & BOOLEANOS',
          x: 410, y: 350, variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 180,
          statusText: 'RQ M02', isUnlocked: false,
        },
        {
          id: 'py-m04', code: '04', label: 'CONDICIONALES', subtitle: 'IF, ELIF, ELSE & DECISIONES',
          x: 550, y: 250, variant: 'locked', iconType: 'lock', stars: 0, maxStars: 3, xp: 200,
          statusText: 'RQ M03', isUnlocked: false,
        },
        {
          id: 'py-boss-logic', code: 'MB', label: 'GUARDIÁN DE LA LÓGICA', subtitle: 'MINI-BOSS: QUIZ MÓDULOS 1-4',
          x: 690, y: 350, variant: 'branch', iconType: 'lock', xp: 250,
          statusText: 'MINI-BOSS • REQUIERE M04', isUnlocked: false,
        },
        {
          id: 'py-m05', code: '05', label: 'BUCLE FOR', subtitle: 'ITERACIÓN CON FOR & RANGE()',
          x: 830, y: 230, variant: 'locked', iconType: 'lock', xp: 220,
          statusText: 'RQ GUARDIÁN', isUnlocked: false,
        },
        {
          id: 'py-m06', code: '06', label: 'BUCLE WHILE', subtitle: 'REPETICIÓN POR CONDICIÓN & FLAGS',
          x: 970, y: 350, variant: 'locked', iconType: 'lock', xp: 220,
          statusText: 'RQ BUCLE FOR', isUnlocked: false,
        },
        {
          id: 'py-apex-1', code: 'Ω', label: 'APEX MASTER GATE 1', subtitle: 'CERTIFICACIÓN FUNDAMENTOS PYTHON',
          x: 1120, y: 290, variant: 'boss', iconType: 'skull', xp: 500,
          statusText: 'DESAFÍO FINAL • 3 FASES', isUnlocked: false,
        },
      ];

      const connections: GraphConnection[] = [
        { id: 'c-01-02', fromId: 'py-m01', toId: 'py-m02', color: '#38BDF8', path: this.generateSvgPath(130, 320, 270, 230), isDashed: true },
        { id: 'c-02-03', fromId: 'py-m02', toId: 'py-m03', color: '#38BDF8', path: this.generateSvgPath(270, 230, 410, 350), isDashed: true },
        { id: 'c-03-04', fromId: 'py-m03', toId: 'py-m04', color: '#38BDF8', path: this.generateSvgPath(410, 350, 550, 250), isDashed: true },
        { id: 'c-04-boss', fromId: 'py-m04', toId: 'py-boss-logic', color: '#F59E0B', path: this.generateSvgPath(550, 250, 690, 350), isDashed: true },
        { id: 'c-boss-05', fromId: 'py-boss-logic', toId: 'py-m05', color: '#10B981', path: this.generateSvgPath(690, 350, 830, 230), isDashed: true },
        { id: 'c-05-06', fromId: 'py-m05', toId: 'py-m06', color: '#10B981', path: this.generateSvgPath(830, 230, 970, 350), isDashed: true },
        { id: 'c-06-apex', fromId: 'py-m06', toId: 'py-apex-1', color: '#F43F5E', path: this.generateSvgPath(970, 350, 1120, 290), isDashed: true },
      ];

      dataset = {
        sectorTitle: 'PYTHON 1: FUNDAMENTOS & SINTAXIS',
        progressPercent: 0,
        nodes,
        connections,
      };
    } else if (normalizedSlug === 'python-2' || normalizedSlug === 'py-level-2') {
      dataset = this.buildLinearSectionDataset(
        'PYTHON 2: INTERMEDIO & PROGRAMACIÓN ORIENTADA A OBJETOS',
        [
          { id: 'py2-m01', code: '01', label: 'COMPRENSIONES', subtitle: 'LIST, DICT & SET COMPREHENSIONS', variant: 'active', iconType: 'brackets', xp: 200, statusText: 'DISPONIBLE • +200 XP' },
          { id: 'py2-m02', code: '02', label: 'FUNCIONES AVANZADAS', subtitle: '*ARGS, **KWARGS & LAMBDAS', variant: 'locked', iconType: 'lock', xp: 220, statusText: 'RQ COMPRENSIONES' },
          { id: 'py2-m03', code: '03', label: 'MÓDULOS & PAQUETES', subtitle: '__INIT__.PY & IMPORTACIONES', variant: 'locked', iconType: 'lock', xp: 220, statusText: 'RQ FUNCIONES AVANZADAS' },
          { id: 'py2-m04', code: '04', label: 'MANEJO DE EXCEPCIONES', subtitle: 'TRY, EXCEPT, RAISE & FINALLY', variant: 'locked', iconType: 'lock', xp: 240, statusText: 'RQ MÓDULOS' },
          { id: 'py2-miniboss', code: 'MB', label: 'CENTINELA MODULAR', subtitle: 'MINI-BOSS: RETO MÓDULOS 1-4', variant: 'branch', iconType: 'lock', xp: 300, statusText: 'RQ EXCEPCIONES' },
          { id: 'py2-m05', code: '05', label: 'ARCHIVOS I/O', subtitle: 'TXT, CSV, JSON & WITH OPEN()', variant: 'locked', iconType: 'lock', xp: 250, statusText: 'RQ CENTINELA' },
          { id: 'py2-m06', code: '06', label: 'POO I: CLASES & OBJETOS', subtitle: 'ATRIBUTOS, MÉTODOS & __INIT__', variant: 'locked', iconType: 'lock', xp: 260, statusText: 'RQ ARCHIVOS I/O' },
          { id: 'py2-m07', code: '07', label: 'POO II: HERENCIA', subtitle: 'SUPER(), POLIMORFISMO & MRO', variant: 'locked', iconType: 'lock', xp: 260, statusText: 'RQ POO I' },
          { id: 'py2-m08', code: '08', label: 'DATETIME & REGEX', subtitle: 'TIEMPO & EXPRESIONES REGULARES', variant: 'locked', iconType: 'lock', xp: 250, statusText: 'RQ HERENCIA' },
          { id: 'py2-m09', code: '09', label: 'PIP, VENV & GIT', subtitle: 'DEPENDENCIAS & CONTROL DE VERSIONES', variant: 'locked', iconType: 'lock', xp: 250, statusText: 'RQ DATETIME' },
          { id: 'py2-m10', code: '10', label: 'TESTING CON PYTEST', subtitle: 'ASSERTS, FIXTURES & TDD BÁSICO', variant: 'locked', iconType: 'lock', xp: 280, statusText: 'RQ PIP & GIT' },
          { id: 'py2-boss', code: 'Ω', label: 'APEX BOSS GATE 2', subtitle: 'PROYECTO INTEGRADOR INTERMEDIO', variant: 'boss', iconType: 'skull', xp: 600, statusText: 'DESAFÍO FINAL INTERMEDIO' },
        ],
        '#06B6D4',
      );
    } else if (normalizedSlug === 'python-3' || normalizedSlug === 'py-level-3') {
      dataset = this.buildLinearSectionDataset(
        'PYTHON 3: AVANZADO, CONCURRENCIA & PATRONES',
        [
          { id: 'py3-m01', code: '01', label: 'ITERADORES & GENERADORES', subtitle: '__ITER__, __NEXT__ & YIELD', variant: 'active', iconType: 'brackets', xp: 250, statusText: 'DISPONIBLE • +250 XP' },
          { id: 'py3-m02', code: '02', label: 'DECORADORES', subtitle: 'CLOSURES, @WRAPS & DECORADORES', variant: 'locked', iconType: 'lock', xp: 260, statusText: 'RQ GENERADORES' },
          { id: 'py3-m03', code: '03', label: 'CONTEXT MANAGERS', subtitle: '__ENTER__, __EXIT__ & CONTEXTLIB', variant: 'locked', iconType: 'lock', xp: 260, statusText: 'RQ DECORADORES' },
          { id: 'py3-m04', code: '04', label: 'TYPE HINTS & DATACLASSES', subtitle: 'TYPING, PROTOCOLS & @DATACLASS', variant: 'locked', iconType: 'lock', xp: 270, statusText: 'RQ CONTEXT MANAGERS' },
          { id: 'py3-miniboss', code: 'MB', label: 'GUARDIÁN DEL PATRÓN', subtitle: 'MINI-BOSS: RETO MÓDULOS 1-4', variant: 'branch', iconType: 'lock', xp: 350, statusText: 'RQ DATACLASSES' },
          { id: 'py3-m05', code: '05', label: 'PROG. FUNCIONAL', subtitle: 'ITERTOOLS, FUNCTOOLS & PARTIAL', variant: 'locked', iconType: 'lock', xp: 280, statusText: 'RQ GUARDIÁN' },
          { id: 'py3-m06', code: '06', label: 'CONCURRENCIA & ASYNCIO', subtitle: 'ASYNC, AWAIT, TASKS & GATHER', variant: 'locked', iconType: 'lock', xp: 320, statusText: 'RQ PROG. FUNCIONAL' },
          { id: 'py3-m07', code: '07', label: 'PEP 8 & RUFF', subtitle: 'LINTERS, FORMATEADORES & DOCSTRINGS', variant: 'locked', iconType: 'lock', xp: 260, statusText: 'RQ ASYNCIO' },
          { id: 'py3-m08', code: '08', label: 'LOGGING & EMPAQUETADO', subtitle: 'LOGGER PROFESIONAL & PYPROJECT', variant: 'locked', iconType: 'lock', xp: 270, statusText: 'RQ PEP 8' },
          { id: 'py3-m09', code: '09', label: 'PROFILING & MEMORIA', subtitle: 'CPROFILE, TIMEIT & OPTIMIZACIÓN', variant: 'locked', iconType: 'lock', xp: 300, statusText: 'RQ LOGGING' },
          { id: 'py3-m10', code: '10', label: 'PATRONES DE DISEÑO', subtitle: 'FACTORY, SINGLETON & OBSERVER', variant: 'locked', iconType: 'lock', xp: 320, statusText: 'RQ PROFILING' },
          { id: 'py3-boss', code: 'Ω', label: 'APEX BOSS GATE 3', subtitle: 'EXAMEN INTEGRAL AVANZADO', variant: 'boss', iconType: 'skull', xp: 700, statusText: 'DESAFÍO FINAL AVANZADO' },
        ],
        '#F59E0B',
      );
    } else if (normalizedSlug === 'fastapi-async' || normalizedSlug === 'py-fastapi') {
      dataset = this.buildLinearSectionDataset(
        'RAMA BACKEND: FASTAPI ASÍNCRONO & MICROSERVICIOS',
        [
          { id: 'fa-m01', code: 'F1', label: 'HTTP & ASGI', subtitle: 'ARQUITECTURA FASTAPI & UVICORN', variant: 'active', iconType: 'server', xp: 250, statusText: 'DISPONIBLE • +250 XP' },
          { id: 'fa-m02', code: 'F2', label: 'PYDANTIC V2', subtitle: 'VALIDACIÓN, SCHEMAS & TIPADO', variant: 'locked', iconType: 'lock', xp: 280, statusText: 'RQ HTTP & ASGI' },
          { id: 'fa-m03', code: 'F3', label: 'SQLALCHEMY & ALEMBIC', subtitle: 'PERSISTENCIA ORM & MIGRACIONES', variant: 'locked', iconType: 'lock', xp: 300, statusText: 'RQ PYDANTIC' },
          { id: 'fa-m04', code: 'F4', label: 'AUTENTICACIÓN JWT', subtitle: 'OAUTH2, PASSWORD HASH & DEPENDS', variant: 'locked', iconType: 'lock', xp: 320, statusText: 'RQ SQLALCHEMY' },
          { id: 'fa-m05', code: 'F5', label: 'DOCKER & DESPLIEGUE', subtitle: 'CONTAINERIZACIÓN & TESTING APIS', variant: 'boss', iconType: 'skull', xp: 400, statusText: 'PROYECTO FINAL FASTAPI' },
        ],
        '#8B5CF6',
      );
    } else if (normalizedSlug === 'django-enterprise' || normalizedSlug === 'py-django') {
      dataset = this.buildLinearSectionDataset(
        'RAMA BACKEND: DJANGO ENTERPRISE & REST FRAMEWORK',
        [
          { id: 'dj-m01', code: 'D1', label: 'ARQUITECTURA MVT', subtitle: 'SETTINGS, URLS & VISTAS', variant: 'active', iconType: 'server', xp: 250, statusText: 'DISPONIBLE • +250 XP' },
          { id: 'dj-m02', code: 'D2', label: 'DJANGO ORM', subtitle: 'MODELOS, RELACIONES & QUERIES', variant: 'locked', iconType: 'lock', xp: 280, statusText: 'RQ ARQUITECTURA MVT' },
          { id: 'dj-m03', code: 'D3', label: 'FORMS & ADMIN', subtitle: 'PANEL ADMINISTRATIVO & FORMULARIOS', variant: 'locked', iconType: 'lock', xp: 300, statusText: 'RQ DJANGO ORM' },
          { id: 'dj-m04', code: 'D4', label: 'DJANGO REST FRAMEWORK', subtitle: 'SERIALIZADORES, VIEWSETS & ROUTERS', variant: 'locked', iconType: 'lock', xp: 320, statusText: 'RQ FORMS & ADMIN' },
          { id: 'dj-m05', code: 'D5', label: 'SEGURIDAD & DEPLOY', subtitle: 'AUTENTICACIÓN, CSRF & PRODUCCIÓN', variant: 'boss', iconType: 'skull', xp: 400, statusText: 'PROYECTO FINAL DJANGO' },
        ],
        '#10B981',
      );
    } else if (normalizedSlug === 'data-analytics' || normalizedSlug === 'py-data') {
      dataset = this.buildLinearSectionDataset(
        'RAMA ANÁLISIS DE DATOS: NUMPY, PANDAS, EDA & STREAMLIT',
        [
          { id: 'da-01', code: '01', label: 'NUMPY VECTORIZADO', subtitle: 'ARRAYS, INDEXING & OPERACIONES', variant: 'active', iconType: 'atom', xp: 250, statusText: 'DISPONIBLE • +250 XP' },
          { id: 'da-02', code: '02', label: 'PANDAS SERIES & DF', subtitle: 'ESTRUCTURAS, CARGA CSV/PARQUET', variant: 'locked', iconType: 'lock', xp: 260, statusText: 'RQ NUMPY' },
          { id: 'da-03', code: '03', label: 'LIMPIEZA DE DATOS', subtitle: 'DATOS NULOS, CASTING & DUPLICADOS', variant: 'locked', iconType: 'lock', xp: 280, statusText: 'RQ PANDAS SERIES' },
          { id: 'da-04', code: '04', label: 'AGRUPACIONES & MERGES', subtitle: 'GROUPBY, AGG, MERGE & CONCAT', variant: 'locked', iconType: 'lock', xp: 290, statusText: 'RQ LIMPIEZA' },
          { id: 'da-miniboss', code: 'MB', label: 'RETO WRANGLING', subtitle: 'MINI-BOSS: LIMPIEZA DE DATASET REAL', variant: 'branch', iconType: 'lock', xp: 350, statusText: 'RQ AGRUPACIONES' },
          { id: 'da-05', code: '05', label: 'MATPLOTLIB & SEABORN', subtitle: 'DISTRIBUCIONES & CORRELACIONES', variant: 'locked', iconType: 'lock', xp: 280, statusText: 'RQ RETO WRANGLING' },
          { id: 'da-06', code: '06', label: 'PLOTLY INTERACTIVO', subtitle: 'GRÁFICOS MODERNOS E INTERACTIVOS', variant: 'locked', iconType: 'lock', xp: 290, statusText: 'RQ MATPLOTLIB' },
          { id: 'da-07', code: '07', label: 'EDA & ESTADÍSTICA', subtitle: 'ANÁLISIS EXPLORATORIO & OUTLIERS', variant: 'locked', iconType: 'lock', xp: 300, statusText: 'RQ PLOTLY' },
          { id: 'da-08', code: '08', label: 'SQL CON PYTHON', subtitle: 'SQLITE3, DUCKDB & READ_SQL', variant: 'locked', iconType: 'lock', xp: 300, statusText: 'RQ EDA' },
          { id: 'da-09', code: '09', label: 'SCIKIT-LEARN INTRO ML', subtitle: 'REGRESIÓN & CLASIFICACIÓN BASE', variant: 'locked', iconType: 'lock', xp: 320, statusText: 'RQ SQL' },
          { id: 'da-10', code: '10', label: 'STREAMLIT DASHBOARDS', subtitle: 'APLICACIONES WEB CON DATOS EN VIVO', variant: 'boss', iconType: 'skull', xp: 450, statusText: 'PROYECTO FINAL DATOS' },
        ],
        '#06B6D4',
      );
    } else if (normalizedSlug === 'ai-agents' || normalizedSlug === 'py-ia') {
      dataset = this.buildLinearSectionDataset(
        'RAMA PYTHON + IA: ARQUITECTURA DE AGENTES AUTÓNOMOS',
        [
          { id: 'ia-01', code: '01', label: 'LLMS & PROMPTING', subtitle: 'ARQUITECTURA, TOKENS & SYSTEM PROMPTS', variant: 'active', iconType: 'matrix', xp: 260, statusText: 'DISPONIBLE • +260 XP' },
          { id: 'ia-02', code: '02', label: 'APIS DE MODELOS', subtitle: 'SDK CLIENTS, STREAMING & TEMPERATURA', variant: 'locked', iconType: 'lock', xp: 280, statusText: 'RQ LLMS' },
          { id: 'ia-03', code: '03', label: 'SALIDAS ESTRUCTURADAS', subtitle: 'JSON MODE & VALIDACIÓN CON PYDANTIC', variant: 'locked', iconType: 'lock', xp: 300, statusText: 'RQ APIS' },
          { id: 'ia-04', code: '04', label: 'FUNCTION CALLING', subtitle: 'HERRAMIENTAS & DECLARACIÓN DE TOOLS', variant: 'locked', iconType: 'lock', xp: 320, statusText: 'RQ SALIDAS' },
          { id: 'ia-miniboss', code: 'MB', label: 'TOOL CALLER MASTER', subtitle: 'MINI-BOSS: AGENTE DE CONSULTA AUTOMATIZADA', variant: 'branch', iconType: 'lock', xp: 380, statusText: 'RQ FUNCTION CALLING' },
          { id: 'ia-05', code: '05', label: 'MEMORIA & CONTEXTO', subtitle: 'WINDOW BUFFERS, SUMMARY & ESTADO', variant: 'locked', iconType: 'lock', xp: 310, statusText: 'RQ TOOL CALLER' },
          { id: 'ia-06', code: '06', label: 'EMBEDDINGS & VECTOR DBS', subtitle: 'CHROMADB, COSINE SIMILARITY & ÍNDICES', variant: 'locked', iconType: 'lock', xp: 330, statusText: 'RQ MEMORIA' },
          { id: 'ia-07', code: '07', label: 'RAG DE PUNTA A PUNTA', subtitle: 'CHUNK, RETRIEVE & CONTEXT INJECTION', variant: 'locked', iconType: 'lock', xp: 350, statusText: 'RQ EMBEDDINGS' },
          { id: 'ia-08', code: '08', label: 'BUCLE REACT AGENT', subtitle: 'THOUGHT, ACTION & OBSERVATION LOOP', variant: 'locked', iconType: 'lock', xp: 380, statusText: 'RQ RAG' },
          { id: 'ia-09', code: '09', label: 'GUARDRAILS & SEGURIDAD', subtitle: 'PROMPT INJECTION & VALIDACIÓN OUTPUT', variant: 'locked', iconType: 'lock', xp: 340, statusText: 'RQ BUCLE REACT' },
          { id: 'ia-10', code: '10', label: 'AGENTE AUTÓNOMO COMPLETO', subtitle: 'MULTI-TOOL AGENT CON INTERFAZ WEB', variant: 'boss', iconType: 'skull', xp: 500, statusText: 'PROYECTO FINAL AGENTE' },
        ],
        '#EC4899',
      );
    } else if (normalizedSlug === 'python-apex' || normalizedSlug === 'py-apex') {
      dataset = this.buildLinearSectionDataset(
        'APEX MASTER GATE: PROYECTO INTEGRADOR DE CERTIFICACIÓN',
        [
          { id: 'apex-01', code: '01', label: 'FASE 1: ARQUITECTURA', subtitle: 'DISEÑO DEL SISTEMA & CONCURRENCIA', variant: 'active', iconType: 'brackets', xp: 400, statusText: 'DISPONIBLE • +400 XP' },
          { id: 'apex-02', code: '02', label: 'FASE 2: SERVICIOS & IA', subtitle: 'BACKEND, RAG & PROCESAMIENTO', variant: 'locked', iconType: 'lock', xp: 500, statusText: 'RQ FASE 1' },
          { id: 'apex-03', code: '03', label: 'FASE 3: AUDITORÍA & DEPLOY', subtitle: 'TESTING INTEGRAL & CERTIFICACIÓN', variant: 'boss', iconType: 'skull', xp: 700, statusText: 'CERTIFICACIÓN PROFESIONAL' },
        ],
        '#F43F5E',
      );
    } else {
      throw new NotFoundException(`Curso '${courseSlug}' no encontrado en la malla curricular.`);
    }

    if (userId && this.progressRepository) {
      try {
        const userStars = await this.progressRepository.findAllSectionStarsByUser(userId);
        if (userStars && userStars.length > 0) {
          dataset = this.enrichLessonsWithProgress(dataset, userStars);
        }
      } catch {
        // En caso de fallo, retornar dataset base
      }
    }

    return dataset;
  }

  private enrichLessonsWithProgress(dataset: GraphDataset, userStars: SectionStarsEntity[]): GraphDataset {
    const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

    const starsMap = new Map<string, number>();
    userStars.forEach((s) => {
      if (s.isPassed) {
        const sec = s.sectionId.toLowerCase();
        starsMap.set(sec, s.starsEarned);
        starsMap.set(normalizeKey(s.sectionId), s.starsEarned);

        if (s.moduleId) {
          starsMap.set(s.moduleId.toLowerCase(), s.starsEarned);
          starsMap.set(normalizeKey(s.moduleId), s.starsEarned);
        }

        // Mapeo bidireccional entre prefijos canónicos pyX-mYY, pyX-YY y les-YY
        const pyMatch = /^py(\d*)-m0?(\d+)$/.exec(sec);
        if (pyMatch) {
          const num = pyMatch[2].padStart(2, '0');
          if (pyMatch[1]) {
            starsMap.set(`py${pyMatch[1]}-${num}`, s.starsEarned);
          } else {
            starsMap.set(`les-${num}`, s.starsEarned);
          }
        }
        const pyShortMatch = /^py(\d*)-0?(\d+)$/.exec(sec);
        if (pyShortMatch && pyShortMatch[1]) {
          const num = pyShortMatch[2].padStart(2, '0');
          starsMap.set(`py${pyShortMatch[1]}-m${num}`, s.starsEarned);
        }
        const lesMatch = /^les-0?(\d+)$/.exec(sec);
        if (lesMatch) {
          const num = lesMatch[1].padStart(2, '0');
          starsMap.set(`py-m${num}`, s.starsEarned);
        }
        if (sec.includes('apex') || sec.includes('boss')) {
          starsMap.set('py-apex-1', s.starsEarned);
          starsMap.set('les-boss', s.starsEarned);
        }
      }
    });

    const connections = dataset.connections.map((c) => ({ ...c }));
    const completedNodeIds = new Set<string>();

    // 1. Identificar nodos completados
    const nodes = dataset.nodes.map((node) => {
      const exactStars = starsMap.get(node.id.toLowerCase());
      const normStars = starsMap.get(normalizeKey(node.id));
      const earnedStars = exactStars ?? normStars;

      if (earnedStars !== undefined && earnedStars > 0) {
        completedNodeIds.add(node.id);
        return {
          ...node,
          stars: earnedStars,
          variant: 'completed' as const,
          isUnlocked: true,
          statusText: 'COMPLETADO',
        };
      }
      return { ...node };
    });

    // 2. Determinar nodos desbloqueados y activos
    let hasFoundFirstActive = false;

    const enrichedNodes: GraphNode[] = nodes.map((node) => {
      if (completedNodeIds.has(node.id)) {
        return node;
      }

      const incoming = connections.filter((c) => c.toId === node.id);
      const isRoot = incoming.length === 0;
      const allPredecessorsCompleted = isRoot || incoming.every((c) => completedNodeIds.has(c.fromId));

      if (allPredecessorsCompleted) {
        const isApex = node.variant === 'boss' || node.id.includes('apex');
        const isBoss = node.variant === 'branch' || node.id.includes('boss');
        const shouldBeActive = !hasFoundFirstActive;
        if (shouldBeActive) {
          hasFoundFirstActive = true;
        }

        const variant: GraphNodeVariant = isApex
          ? 'boss'
          : isBoss
            ? 'branch'
            : shouldBeActive
              ? 'active'
              : 'unlocked';

        const iconType: GraphNodeIconType = isApex
          ? 'skull'
          : node.iconType === 'lock'
            ? 'brackets'
            : node.iconType;

        return {
          ...node,
          isUnlocked: true,
          variant,
          iconType,
          statusText: isApex
            ? 'DESAFÍO FINAL DISPONIBLE'
            : isBoss
              ? 'MINI-BOSS DISPONIBLE'
              : `DISPONIBLE • +${node.xp ?? 120} XP`,
        };
      }

      return node;
    });

    // 3. Conexiones: iluminar haz cuando origen este completado
    const enrichedConnections = connections.map((c) => {
      if (completedNodeIds.has(c.fromId)) {
        return { ...c, isDashed: false };
      }
      return c;
    });

    const completedCount = completedNodeIds.size;
    const progressPercent = Math.round((completedCount / Math.max(1, enrichedNodes.length)) * 100);

    return {
      ...dataset,
      progressPercent,
      nodes: enrichedNodes,
      connections: enrichedConnections,
    };
  }
}
