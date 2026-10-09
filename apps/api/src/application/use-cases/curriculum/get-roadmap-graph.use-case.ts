import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CURRICULUM_REPOSITORY_TOKEN,
  ICurriculumRepository,
} from '../../../domain/repositories/curriculum.repository';
import { CourseEntity } from '../../../domain/entities/curriculum';
import {
  GraphConnection,
  GraphDataset,
  GraphNode,
  GraphNodeIconType,
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

  async getCoursesGraph(trackOrLangSlug: string): Promise<GraphDataset> {
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
    const nodes: GraphNode[] = displayCourses.map((c: CourseEntity) => {
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
        stars: isTrunk ? 3 : 0,
        maxStars: 3,
        xp: 150,
        targetCourseId: c.slug,
        isUnlocked: isTrunk,
        statusText: isTrunk ? 'ACTIVO' : 'BLOQUEADO',
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
          isDashed: edge.connectionType === 'recommended',
        });
      });
    });

    return {
      sectorTitle: `SECTOR: ${slug.toUpperCase()} ROADMAP (DAG)`,
      progressPercent: 20,
      nodes,
      connections,
    };
  }

  async getLessonsGraph(courseSlug: string): Promise<GraphDataset> {
    let normalizedSlug = courseSlug.toLowerCase();
    if (normalizedSlug === 'py-basic' || normalizedSlug === 'python-basico' || normalizedSlug === 'python-core') {
      normalizedSlug = 'python-1';
    }

    // Grafo especializado para Python 1 con Mini-Boss Gate tras Módulo 4
    if (normalizedSlug === 'python-1' || normalizedSlug === 'py-level-1') {
      const nodes: GraphNode[] = [
        {
          id: 'py-m01', code: '01', label: 'SINTAXIS & E/S', subtitle: 'PRINT, INPUT & COMENTARIOS',
          x: 130, y: 320, variant: 'completed', iconType: 'brackets', stars: 3, maxStars: 3, xp: 150,
          statusText: 'DOMINADO • +150 XP', isUnlocked: true,
        },
        {
          id: 'py-m02', code: '02', label: 'VARIABLES & TIPOS', subtitle: 'INT, FLOAT, STR, BOOL & TYPE',
          x: 270, y: 230, variant: 'completed', iconType: 'flow', stars: 3, maxStars: 3, xp: 150,
          statusText: 'DOMINADO • +150 XP', isUnlocked: true,
        },
        {
          id: 'py-m03', code: '03', label: 'OPERADORES & LÓGICA', subtitle: 'ARITMÉTICA & BOOLEANOS',
          x: 410, y: 350, variant: 'completed', iconType: 'atom', stars: 3, maxStars: 3, xp: 180,
          statusText: 'DOMINADO • +180 XP', isUnlocked: true,
        },
        {
          id: 'py-m04', code: '04', label: 'CONDICIONALES', subtitle: 'IF, ELIF, ELSE & DECISIONES',
          x: 550, y: 250, variant: 'active', iconType: 'matrix', stars: 1, maxStars: 3, xp: 200,
          statusText: 'EN PROGRESO • +200 XP', isUnlocked: true,
        },
        {
          id: 'py-boss-logic', code: '🛡️', label: 'GUARDIÁN DE LA LÓGICA', subtitle: 'MINI-BOSS: QUIZ MÓDULOS 1-4',
          x: 690, y: 350, variant: 'branch', iconType: 'code', xp: 250,
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
        { id: 'c-01-02', fromId: 'py-m01', toId: 'py-m02', color: '#38BDF8', path: this.generateSvgPath(130, 320, 270, 230) },
        { id: 'c-02-03', fromId: 'py-m02', toId: 'py-m03', color: '#38BDF8', path: this.generateSvgPath(270, 230, 410, 350) },
        { id: 'c-03-04', fromId: 'py-m03', toId: 'py-m04', color: '#38BDF8', path: this.generateSvgPath(410, 350, 550, 250) },
        { id: 'c-04-boss', fromId: 'py-m04', toId: 'py-boss-logic', color: '#F59E0B', path: this.generateSvgPath(550, 250, 690, 350) },
        { id: 'c-boss-05', fromId: 'py-boss-logic', toId: 'py-m05', color: '#10B981', path: this.generateSvgPath(690, 350, 830, 230), isDashed: true },
        { id: 'c-05-06', fromId: 'py-m05', toId: 'py-m06', color: '#10B981', path: this.generateSvgPath(830, 230, 970, 350), isDashed: true },
        { id: 'c-06-apex', fromId: 'py-m06', toId: 'py-apex-1', color: '#F43F5E', path: this.generateSvgPath(970, 350, 1120, 290), isDashed: true },
      ];

      return {
        sectorTitle: 'PYTHON 1: FUNDAMENTOS & SINTAXIS',
        progressPercent: 55,
        nodes,
        connections,
      };
    }

    // Grafo para Python 2
    if (normalizedSlug === 'python-2' || normalizedSlug === 'py-level-2') {
      const nodes: GraphNode[] = [
        { id: 'py2-m01', code: '01', label: 'FUNCIONES', subtitle: 'PARÁMETROS, SCOPE & RETURN', x: 140, y: 290, variant: 'active', iconType: 'brackets', xp: 200, isUnlocked: true, statusText: 'ACTIVO' },
        { id: 'py2-m02', code: '02', label: 'LISTAS & TUPLAS', subtitle: 'MÉTODOS & MUTABILIDAD', x: 340, y: 290, variant: 'locked', iconType: 'lock', xp: 200, isUnlocked: false, statusText: 'RQ FUNCIONES' },
        { id: 'py2-m03', code: '03', label: 'DICTS & SETS', subtitle: 'CLAVE-VALOR & CONJUNTOS', x: 540, y: 290, variant: 'locked', iconType: 'lock', xp: 200, isUnlocked: false, statusText: 'RQ LISTAS' },
        { id: 'py2-m04', code: '04', label: 'EXCEPCIONES & ARCHIVOS', subtitle: 'TRY/EXCEPT & WITH OPEN', x: 740, y: 290, variant: 'locked', iconType: 'lock', xp: 220, isUnlocked: false, statusText: 'RQ DICTS' },
        { id: 'py2-m05', code: '05', label: 'POO: CLASES & OBJETOS', subtitle: 'ATRIBUTOS & CONSTRUCTOR __INIT__', x: 940, y: 290, variant: 'locked', iconType: 'lock', xp: 250, isUnlocked: false, statusText: 'RQ ARCHIVOS' },
      ];
      const connections: GraphConnection[] = [
        { id: 'c-p2-1-2', fromId: 'py2-m01', toId: 'py2-m02', color: '#06B6D4', path: this.generateSvgPath(140, 290, 340, 290), isDashed: true },
        { id: 'c-p2-2-3', fromId: 'py2-m02', toId: 'py2-m03', color: '#06B6D4', path: this.generateSvgPath(340, 290, 540, 290), isDashed: true },
        { id: 'c-p2-3-4', fromId: 'py2-m03', toId: 'py2-m04', color: '#06B6D4', path: this.generateSvgPath(540, 290, 740, 290), isDashed: true },
        { id: 'c-p2-4-5', fromId: 'py2-m04', toId: 'py2-m05', color: '#06B6D4', path: this.generateSvgPath(740, 290, 940, 290), isDashed: true },
      ];
      return { sectorTitle: 'PYTHON 2: ESTRUCTURAS & POO', progressPercent: 10, nodes, connections };
    }

    // Grafo para Python 3
    if (normalizedSlug === 'python-3' || normalizedSlug === 'py-level-3') {
      const nodes: GraphNode[] = [
        { id: 'py3-m01', code: '01', label: 'POO AVANZADA', subtitle: 'HERENCIA & DUNDER METHODS', x: 140, y: 290, variant: 'active', iconType: 'brackets', xp: 250, isUnlocked: true, statusText: 'ACTIVO' },
        { id: 'py3-m02', code: '02', label: 'GENERADORES', subtitle: 'ITERADORES & YIELD', x: 340, y: 290, variant: 'locked', iconType: 'lock', xp: 250, isUnlocked: false, statusText: 'RQ POO AV.' },
        { id: 'py3-m03', code: '03', label: 'DECORADORES', subtitle: 'CLOSURES & WRAPPERS', x: 540, y: 290, variant: 'locked', iconType: 'lock', xp: 250, isUnlocked: false, statusText: 'RQ GENERADORES' },
        { id: 'py3-m04', code: '04', label: 'TIPADO ESTÁTICO', subtitle: 'TYPE HINTS & TYPING MODULE', x: 740, y: 290, variant: 'locked', iconType: 'lock', xp: 250, isUnlocked: false, statusText: 'RQ DECORADORES' },
        { id: 'py3-m05', code: '05', label: 'PAQUETES & VENV', subtitle: 'MODULARIDAD PROFESIONAL', x: 940, y: 290, variant: 'locked', iconType: 'lock', xp: 300, isUnlocked: false, statusText: 'RQ TIPADO' },
      ];
      const connections: GraphConnection[] = [
        { id: 'c-p3-1-2', fromId: 'py3-m01', toId: 'py3-m02', color: '#F59E0B', path: this.generateSvgPath(140, 290, 340, 290), isDashed: true },
        { id: 'c-p3-2-3', fromId: 'py3-m02', toId: 'py3-m03', color: '#F59E0B', path: this.generateSvgPath(340, 290, 540, 290), isDashed: true },
        { id: 'c-p3-3-4', fromId: 'py3-m03', toId: 'py3-m04', color: '#F59E0B', path: this.generateSvgPath(540, 290, 740, 290), isDashed: true },
        { id: 'c-p3-4-5', fromId: 'py3-m04', toId: 'py3-m05', color: '#F59E0B', path: this.generateSvgPath(740, 290, 940, 290), isDashed: true },
      ];
      return { sectorTitle: 'PYTHON 3: AVANZADO & MODULAR', progressPercent: 10, nodes, connections };
    }

    // Grafo para Especialización FastAPI
    if (normalizedSlug === 'fastapi-async' || normalizedSlug === 'py-fastapi') {
      const nodes: GraphNode[] = [
        { id: 'fa-m01', code: 'F1', label: 'ARQUITECTURA ASGI', subtitle: 'PRIMERA API REST CON FASTAPI', x: 140, y: 290, variant: 'active', iconType: 'server', xp: 250, isUnlocked: true, statusText: 'ACTIVO' },
        { id: 'fa-m02', code: 'F2', label: 'PYDANTIC V2', subtitle: 'VALIDACIÓN & SCHEMAS', x: 370, y: 290, variant: 'locked', iconType: 'lock', xp: 250, isUnlocked: false, statusText: 'RQ ASGI' },
        { id: 'fa-m03', code: 'F3', label: 'ROUTING AVANZADO', subtitle: 'PATH, QUERY & BODY PARAMS', x: 600, y: 290, variant: 'locked', iconType: 'lock', xp: 280, isUnlocked: false, statusText: 'RQ PYDANTIC' },
        { id: 'fa-m04', code: 'F4', label: 'ASYNC / AWAIT', subtitle: 'CONCURRENCIA & DEPENDENCY INJECTION', x: 830, y: 290, variant: 'locked', iconType: 'lock', xp: 300, isUnlocked: false, statusText: 'RQ ROUTING' },
      ];
      const connections: GraphConnection[] = [
        { id: 'c-fa-1-2', fromId: 'fa-m01', toId: 'fa-m02', color: '#8B5CF6', path: this.generateSvgPath(140, 290, 370, 290), isDashed: true },
        { id: 'c-fa-2-3', fromId: 'fa-m02', toId: 'fa-m03', color: '#8B5CF6', path: this.generateSvgPath(370, 290, 600, 290), isDashed: true },
        { id: 'c-fa-3-4', fromId: 'fa-m03', toId: 'fa-m04', color: '#8B5CF6', path: this.generateSvgPath(600, 290, 830, 290), isDashed: true },
      ];
      return { sectorTitle: 'ESPECIALIZACIÓN FASTAPI', progressPercent: 10, nodes, connections };
    }

    // Grafo para Especialización Django
    if (normalizedSlug === 'django-enterprise' || normalizedSlug === 'py-django') {
      const nodes: GraphNode[] = [
        { id: 'dj-m01', code: 'D1', label: 'ARQUITECTURA MVT', subtitle: 'ESTRUCTURA DE PROYECTO DJANGO', x: 140, y: 290, variant: 'active', iconType: 'server', xp: 250, isUnlocked: true, statusText: 'ACTIVO' },
        { id: 'dj-m02', code: 'D2', label: 'DJANGO ORM', subtitle: 'MODELOS, MIGRACIONES & QUERIES', x: 370, y: 290, variant: 'locked', iconType: 'lock', xp: 280, isUnlocked: false, statusText: 'RQ MVT' },
        { id: 'dj-m03', code: 'D3', label: 'VISTAS Y TEMPLATES', subtitle: 'CLASS-BASED VIEWS & FORMULARIOS', x: 600, y: 290, variant: 'locked', iconType: 'lock', xp: 280, isUnlocked: false, statusText: 'RQ ORM' },
        { id: 'dj-m04', code: 'D4', label: 'AUTH & DJANGO ADMIN', subtitle: 'SISTEMA DE AUTENTICACIÓN & GESTIÓN', x: 830, y: 290, variant: 'locked', iconType: 'lock', xp: 320, isUnlocked: false, statusText: 'RQ VIEWS' },
      ];
      const connections: GraphConnection[] = [
        { id: 'c-dj-1-2', fromId: 'dj-m01', toId: 'dj-m02', color: '#10B981', path: this.generateSvgPath(140, 290, 370, 290), isDashed: true },
        { id: 'c-dj-2-3', fromId: 'dj-m02', toId: 'dj-m03', color: '#10B981', path: this.generateSvgPath(370, 290, 600, 290), isDashed: true },
        { id: 'c-dj-3-4', fromId: 'dj-m03', toId: 'dj-m04', color: '#10B981', path: this.generateSvgPath(600, 290, 830, 290), isDashed: true },
      ];
      return { sectorTitle: 'ESPECIALIZACIÓN DJANGO', progressPercent: 10, nodes, connections };
    }

    // Fallback general para otros cursos
    return {
      sectorTitle: `CURSO: ${normalizedSlug.toUpperCase()}`,
      progressPercent: 0,
      nodes: [
        { id: `${normalizedSlug}-s01`, code: '01', label: 'INTRODUCCIÓN', subtitle: 'CONCEPTOS INICIALES', x: 200, y: 290, variant: 'active', iconType: 'brackets', xp: 100, isUnlocked: true, statusText: 'DISPONIBLE' },
      ],
      connections: [],
    };
  }
}
