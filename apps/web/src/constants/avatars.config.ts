export interface KodaAvatarItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  avatarUrl: string;
  rarity: 'classic' | 'rare' | 'epic' | 'legendary';
  accentColor: string;
  badgeLabel: string;
}

export const KODA_AVATARS: KodaAvatarItem[] = [
  {
    id: 'koda-classic',
    name: 'Koda Clásico',
    subtitle: 'El zorro insignia de Koda',
    description: 'Compañero leal y entusiasta para iniciar cualquier viaje de código.',
    avatarUrl: '/avatars/koda-classic.svg',
    rarity: 'classic',
    accentColor: '#f59e0b',
    badgeLabel: 'OFICIAL',
  },
  {
    id: 'koda-detective',
    name: 'Koda Detective',
    subtitle: 'Cazador implacable de bugs',
    description: 'Examina cada stack trace y variable con lupa minuciosa.',
    avatarUrl: '/avatars/koda-detective.svg',
    rarity: 'rare',
    accentColor: '#eab308',
    badgeLabel: 'DEBUGGER',
  },
  {
    id: 'koda-astronaut',
    name: 'Koda Astronauta',
    subtitle: 'Explorador estelar de Python',
    description: 'Navega en órbitas de algoritmos y constelaciones de funciones.',
    avatarUrl: '/avatars/koda-astronaut.svg',
    rarity: 'epic',
    accentColor: '#38bdf8',
    badgeLabel: 'CÓSMICO',
  },
  {
    id: 'koda-hacker',
    name: 'Koda Hacker',
    subtitle: 'Maestro de la consola y la matriz',
    description: 'Domina terminales, scripts bash y arquitecturas de red seguras.',
    avatarUrl: '/avatars/koda-hacker.svg',
    rarity: 'legendary',
    accentColor: '#22c55e',
    badgeLabel: 'CYBER',
  },
  {
    id: 'koda-sensei',
    name: 'Koda Sensei',
    subtitle: 'Sabio de la arquitectura y la disciplina',
    description: 'Enseña la elegancia de los principios SOLID y la calma zen al depurar.',
    avatarUrl: '/avatars/koda-sensei.svg',
    rarity: 'epic',
    accentColor: '#f97316',
    badgeLabel: 'MAESTRO',
  },
  {
    id: 'koda-cyberpunk',
    name: 'Koda Cyberpunk',
    subtitle: 'Visor neón y reflejos cuánticos',
    description: 'Equipado con implantes cibernéticos para compilar a la velocidad de la luz.',
    avatarUrl: '/avatars/koda-cyberpunk.svg',
    rarity: 'legendary',
    accentColor: '#a855f7',
    badgeLabel: 'NEÓN',
  },
  {
    id: 'koda-alchemist',
    name: 'Koda Alquimista',
    subtitle: 'Transmutador de datos y pipelines',
    description: 'Transforma datos crudos y matrices en soluciones mágicas.',
    avatarUrl: '/avatars/koda-alchemist.svg',
    rarity: 'rare',
    accentColor: '#ec4899',
    badgeLabel: 'CIENTÍFICO',
  },
  {
    id: 'koda-gamer',
    name: 'Koda Pro Gamer',
    subtitle: 'Cazador de rachas y récords',
    description: 'Siempre concentrado con auriculares y fuego en cada desafío.',
    avatarUrl: '/avatars/koda-gamer.svg',
    rarity: 'rare',
    accentColor: '#ef4444',
    badgeLabel: 'STREAK',
  },
];

export const DEFAULT_AVATAR = KODA_AVATARS[0];
