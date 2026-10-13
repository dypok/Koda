import { CodeSimple, BracketsCurly, Code, Palette, Gear, Stack, Atom, ArrowRight, Triangle, Shield, LightningA, DeviceMobile, Database, Cube, GitBranch, ShareNetwork, Coffee, Plant, Rocket, TerminalWindow, Compass, PuzzlePiece, Flame, Trophy, Moon } from '@phosphor-icons/react';
import {
  LanguageOption, ExperienceOption, StyleOption, GoalOption, TechCategory
} from './register.model';

/** Única fuente de verdad de disponibilidad (el badge se deriva de aquí). */
export const AVAILABLE_IDS = ['python', 'lua'] as const;

export function techAvailability(id: string): { isAvailable: boolean; badge: string } {
  const isAvailable = (AVAILABLE_IDS as readonly string[]).includes(id);
  return { isAvailable, badge: isAvailable ? 'Disponible' : 'Próximamente' };
}

export const TECH_CATEGORIES: { id: TechCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'language', label: 'Lenguajes' },
  { id: 'framework', label: 'Frameworks' },
  { id: 'tools', label: 'DevOps & Herramientas' },
];

export const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  { id: 'beginner', title: 'Empezando desde cero', description: 'Nunca he escrito código. Quiero aprender paso a paso desde los fundamentos.', color: '#4ADE80', icon: Plant },
  { id: 'elementary', title: 'Conozco los fundamentos', description: 'Entiendo variables, bucles y lógica básica; quiero ir directo a la práctica.', color: '#FACC15', icon: LightningA },
  { id: 'intermediate', title: 'Nivel intermedio o avanzado', description: 'Tengo experiencia técnica previa y busco retos de algoritmos, POO y proyectos.', color: '#FB923C', icon: Rocket },
];

export const STYLE_OPTIONS: StyleOption[] = [
  { id: 'hands-on', title: 'Práctica directa en terminal', description: 'Menos teoría extensa y más ejercicios interactivos de código desde el primer minuto.', color: '#38BDF8', icon: TerminalWindow },
  { id: 'guided', title: 'Paso a paso con explicaciones guiadas', description: 'Conceptos claros, analogías y fundamentos detallados antes de escribir cada bloque.', color: '#4ADE80', icon: Compass },
  { id: 'projects', title: 'Basado en proyectos reales', description: 'Aprender creando herramientas útiles, scripts funcionales y mini-aplicaciones prácticas.', color: '#FB923C', icon: Rocket },
  { id: 'gamified', title: 'Desafíos de lógica y gamificación', description: 'Puzzles mentales rápidos, misiones diarias y resolución de problemas algorítmicos.', color: '#A855F7', icon: PuzzlePiece },
];

export const GOAL_OPTIONS: GoalOption[] = [
  { id: 'casual', title: 'Casual', timeText: '5 min / día', minutes: 5, description: 'Ideal para dar los primeros pasos y construir el hábito sin presión.', color: '#38BDF8', icon: Coffee },
  { id: 'regular', title: 'Regular', timeText: '10 min / día', minutes: 10, description: 'El equilibrio óptimo entre avance constante y retención de conceptos.', color: '#F97316', icon: Flame, badge: 'Recomendado' },
  { id: 'focused', title: 'Enfocado', timeText: '15 min / día', minutes: 15, description: 'Para quienes quieren progresar a paso firme y dominar proyectos pronto.', color: '#4ADE80', icon: Rocket },
  { id: 'intense', title: 'Intensivo', timeText: '20+ min / día', minutes: 20, description: 'Inmersión rápida para desarrolladores con alta dedicación.', color: '#A855F7', icon: Trophy },
];

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { id: 'python', name: 'Python', slug: 'python', color: '#38BDF8', icon: CodeSimple, isAvailable: true, badge: 'Disponible', category: 'language', description: 'Sintaxis limpia y fundamentos desde cero.' },
  { id: 'lua', name: 'Lua', slug: 'lua', color: '#8FA8FF', icon: Moon, isAvailable: true, badge: 'Disponible', category: 'language', description: 'Lenguaje ligero y embebido: de fundamentos a metatablas.' },
  { id: 'html', name: 'HTML', slug: 'html', color: '#E34F26', icon: Code, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Estructura semántica de la web desde cero.' },
  { id: 'css', name: 'CSS', slug: 'css', color: '#1572B6', icon: Palette, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Diseño visual, layouts modernos y estilos.' },
  { id: 'javascript', name: 'JavaScript', slug: 'javascript', color: '#FACC15', icon: BracketsCurly, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Interactividad y desarrollo en navegadores.' },
  { id: 'typescript', name: 'TypeScript', slug: 'typescript', color: '#60A5FA', icon: BracketsCurly, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'JavaScript tipado a escala profesional.' },
  { id: 'react', name: 'React', slug: 'react', color: '#67E8F9', icon: Atom, isAvailable: false, badge: 'Próximamente', category: 'framework', description: 'Librería líder para interfaces de usuario.' },
  { id: 'nextjs', name: 'Next.js', slug: 'nextjs', color: '#E2E8F0', icon: ArrowRight, isAvailable: false, badge: 'Próximamente', category: 'framework', description: 'Framework React full-stack para la web moderna.' },
  { id: 'vue', name: 'Vue.js', slug: 'vue', color: '#4ADE80', icon: Triangle, isAvailable: false, badge: 'Próximamente', category: 'framework', description: 'Framework progresivo, accesible y versátil.' },
  { id: 'angular', name: 'Angular', slug: 'angular', color: '#F43F5E', icon: Shield, isAvailable: false, badge: 'Próximamente', category: 'framework', description: 'Plataforma empresarial de componentes de Google.' },
  { id: 'svelte', name: 'Svelte', slug: 'svelte', color: '#FB923C', icon: LightningA, isAvailable: false, badge: 'Próximamente', category: 'framework', description: 'Compilador reactivo sin virtual DOM.' },
  { id: 'tailwind', name: 'Tailwind CSS', slug: 'tailwind', color: '#38BDF8', icon: Palette, isAvailable: false, badge: 'Próximamente', category: 'framework', description: 'Estilos utilitarios rápidos y diseño responsivo.' },
  { id: 'nodejs', name: 'Node.js', slug: 'nodejs', color: '#4ADE80', icon: Stack, isAvailable: false, badge: 'Próximamente', category: 'framework', description: 'Entorno de ejecución JavaScript del lado del servidor.' },
  { id: 'django', name: 'Django', slug: 'django', color: '#4ADE80', icon: Database, isAvailable: false, badge: 'Próximamente', category: 'framework', description: 'Framework web de alto nivel basado en Python.' },
  { id: 'flutter', name: 'Flutter', slug: 'flutter', color: '#38BDF8', icon: DeviceMobile, isAvailable: false, badge: 'Próximamente', category: 'framework', description: 'Apps multiplataforma nativas con Dart.' },
  { id: 'rust', name: 'Rust', slug: 'rust', color: '#FB923C', icon: Gear, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Rendimiento bare-metal y memoria segura.' },
  { id: 'java', name: 'Java', slug: 'java', color: '#F97316', icon: Coffee, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Orientación a objetos para software empresarial.' },
  { id: 'go', name: 'Go (Golang)', slug: 'go', color: '#22D3EE', icon: CodeSimple, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Concurrencia nativa y servicios eficientes.' },
  { id: 'cpp', name: 'C++', slug: 'cpp', color: '#818CF8', icon: CodeSimple, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Control de hardware y alto desempeño.' },
  { id: 'csharp', name: 'C#', slug: 'csharp', color: '#C084FC', icon: CodeSimple, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Ecosistema .NET, videojuegos y servicios.' },
  { id: 'swift', name: 'Swift', slug: 'swift', color: '#F97316', icon: CodeSimple, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Desarrollo nativo para iOS y macOS.' },
  { id: 'kotlin', name: 'Kotlin', slug: 'kotlin', color: '#A855F7', icon: CodeSimple, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'El estándar moderno para desarrollo Android.' },
  { id: 'php', name: 'PHP', slug: 'php', color: '#818CF8', icon: CodeSimple, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Desarrollo backend y aplicaciones web.' },
  { id: 'sql', name: 'SQL', slug: 'sql', color: '#FBBF24', icon: Database, isAvailable: false, badge: 'Próximamente', category: 'language', description: 'Consultas y bases de datos relacionales.' },
  { id: 'docker', name: 'Docker', slug: 'docker', color: '#38BDF8', icon: Cube, isAvailable: false, badge: 'Próximamente', category: 'tools', description: 'Contenedores y despliegues estandarizados.' },
  { id: 'git', name: 'Git', slug: 'git', color: '#F87171', icon: GitBranch, isAvailable: false, badge: 'Próximamente', category: 'tools', description: 'Control de versiones y colaboración en código.' },
  { id: 'graphql', name: 'GraphQL', slug: 'graphql', color: '#E879F9', icon: ShareNetwork, isAvailable: false, badge: 'Próximamente', category: 'tools', description: 'Lenguaje de consulta para APIs modernas.' },
  { id: 'mongodb', name: 'MongoDB', slug: 'mongodb', color: '#34D399', icon: Database, isAvailable: false, badge: 'Próximamente', category: 'tools', description: 'Base de datos NoSQL documental flexible.' },
];
