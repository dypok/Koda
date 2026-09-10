import { GraphDataset, GraphNode, GraphConnection } from '../roadmap-graph.types';

const NODES: GraphNode[] = [
  {
    id: 'dev-linux', code: '01', label: 'LINUX & SHELL SCRIPT', subtitle: 'BASH, PERMISOS & PROCESOS',
    x: 140, y: 290, variant: 'active', iconType: 'code', stars: 3, maxStars: 9, xp: 90,
    statusText: 'ACTIVO • EN PROGRESO', targetCourseId: 'dev-linux', isUnlocked: true,
  },
  {
    id: 'dev-git-ci', code: '02', label: 'GIT & CI/CD PIPELINES', subtitle: 'ACTIONS & AUTOMATIZACIÓN',
    x: 370, y: 290, variant: 'locked', iconType: 'code', stars: 0, maxStars: 12, xp: 120,
    statusText: 'SELLADO • REQ. LINUX', targetCourseId: 'dev-git-ci', isUnlocked: false,
  },
  {
    id: 'dev-docker', code: '03', label: 'DOCKER & CONTENEDORES', subtitle: 'DOCKERFILES & COMPOSE',
    x: 600, y: 290, variant: 'locked', iconType: 'server', stars: 0, maxStars: 15, xp: 150,
    statusText: 'SELLADO • REQ. CI/CD', targetCourseId: 'dev-docker', isUnlocked: false,
  },
  {
    id: 'dev-k8s', code: 'D1', label: 'KUBERNETES & CLUSTERS', subtitle: 'ORQUESTACIÓN & HELM',
    x: 820, y: 150, variant: 'branch', iconType: 'server', stars: 0, maxStars: 12, xp: 170,
    statusText: 'SELLADO • REQ. DOCKER', targetCourseId: 'dev-k8s', isUnlocked: false,
  },
  {
    id: 'dev-terraform', code: 'D2', label: 'CLOUD & TERRAFORM', subtitle: 'INFRAESTRUCTURA IAC',
    x: 820, y: 430, variant: 'branch', iconType: 'database', stars: 0, maxStars: 12, xp: 160,
    statusText: 'SELLADO • REQ. DOCKER', targetCourseId: 'dev-terraform', isUnlocked: false,
  },
  {
    id: 'dev-apex', code: 'Ω', label: 'APEX DEVOPS GATE', subtitle: 'PIPELINE ZERO-DOWNTIME',
    x: 1020, y: 290, variant: 'boss', iconType: 'skull', xp: 500,
    statusText: 'DESAFÍO FINAL • 3 FASES', isUnlocked: false,
  },
];

const CONNECTIONS: GraphConnection[] = [
  { id: 'c-linux-to-git', fromId: 'dev-linux', toId: 'dev-git-ci', color: '#A855F7', path: 'M 140 290 C 220 290, 290 290, 370 290' },
  { id: 'c-git-to-docker', fromId: 'dev-git-ci', toId: 'dev-docker', color: '#64748B', path: 'M 370 290 C 450 290, 520 290, 600 290', isDashed: true },
  { id: 'c-docker-to-k8s', fromId: 'dev-docker', toId: 'dev-k8s', color: '#38BDF8', path: 'M 600 290 C 670 290, 720 150, 820 150', isDashed: true },
  { id: 'c-docker-to-terraform', fromId: 'dev-docker', toId: 'dev-terraform', color: '#F59E0B', path: 'M 600 290 C 670 290, 720 430, 820 430', isDashed: true },
  { id: 'c-docker-to-apex', fromId: 'dev-docker', toId: 'dev-apex', color: '#475569', path: 'M 600 290 L 1020 290', isDashed: true },
  { id: 'c-k8s-to-apex', fromId: 'dev-k8s', toId: 'dev-apex', color: '#38BDF8', path: 'M 820 150 C 900 150, 950 250, 1020 290', isDashed: true },
  { id: 'c-terraform-to-apex', fromId: 'dev-terraform', toId: 'dev-apex', color: '#F59E0B', path: 'M 820 430 C 900 430, 950 330, 1020 290', isDashed: true },
];

export const DEVOPS_COURSES_DATASET: GraphDataset = {
  sectorTitle: 'SECTOR 03: DEVOPS & CLOUD ARCHITECTURE',
  progressPercent: 12,
  nodes: NODES,
  connections: CONNECTIONS,
};
