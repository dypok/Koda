import {
  IconBrandPython, IconBrandJavascript, IconBrandTypescript, IconBrandHtml5,
  IconBrandCss3, IconBrandRust, IconBrandGolang, IconBrandCpp, IconBrandCSharp,
  IconBrandSwift, IconBrandKotlin, IconBrandPhp, IconBrandNodejs, IconBrandReact,
  IconBrandNextjs, IconBrandVue, IconBrandAngular, IconBrandSvelte, IconBrandTailwind,
  IconBrandFlutter, IconBrandDjango, IconBrandDocker, IconBrandMysql, IconBrandGit,
  IconBrandGraphql, IconBrandMongodb, IconCoffee, IconPlant2, IconBolt, IconRocket
} from '@tabler/icons-react';
import { LanguageOption, ExperienceOption, TechCategory } from './register.model';

export const TECH_CATEGORIES: { id: TechCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'language', label: 'Lenguajes' },
  { id: 'framework', label: 'Frameworks' },
  { id: 'tools', label: 'DevOps & Herramientas' },
];

export const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  { id: 'beginner', title: 'Empezando desde cero', description: 'Nunca he escrito código. Quiero aprender paso a paso desde los fundamentos.', color: '#4ADE80', icon: IconPlant2 },
  { id: 'elementary', title: 'Conozco los fundamentos', description: 'Entiendo variables, bucles y lógica básica; quiero ir directo a la práctica.', color: '#FACC15', icon: IconBolt },
  { id: 'intermediate', title: 'Nivel intermedio o avanzado', description: 'Tengo experiencia técnica previa y busco retos de algoritmos, POO y proyectos.', color: '#FB923C', icon: IconRocket },
];

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { id: 'python', name: 'Python', slug: 'python', color: '#38BDF8', icon: IconBrandPython, isAvailable: true, category: 'language', description: 'Sintaxis limpia y fundamentos desde cero.' },
  { id: 'html', name: 'HTML', slug: 'html', color: '#E34F26', icon: IconBrandHtml5, isAvailable: false, category: 'language', description: 'Estructura semántica de la web desde cero.' },
  { id: 'css', name: 'CSS', slug: 'css', color: '#1572B6', icon: IconBrandCss3, isAvailable: false, category: 'language', description: 'Diseño visual, layouts modernos y estilos.' },
  { id: 'javascript', name: 'JavaScript', slug: 'javascript', color: '#FACC15', icon: IconBrandJavascript, isAvailable: false, category: 'language', description: 'Interactividad y desarrollo en navegadores.' },
  { id: 'typescript', name: 'TypeScript', slug: 'typescript', color: '#60A5FA', icon: IconBrandTypescript, isAvailable: false, category: 'language', description: 'JavaScript tipado a escala profesional.' },
  { id: 'react', name: 'React', slug: 'react', color: '#67E8F9', icon: IconBrandReact, isAvailable: false, category: 'framework', description: 'Librería líder para interfaces de usuario.' },
  { id: 'nextjs', name: 'Next.js', slug: 'nextjs', color: '#E2E8F0', icon: IconBrandNextjs, isAvailable: false, category: 'framework', description: 'Framework React full-stack para la web moderna.' },
  { id: 'vue', name: 'Vue.js', slug: 'vue', color: '#4ADE80', icon: IconBrandVue, isAvailable: false, category: 'framework', description: 'Framework progresivo, accesible y versátil.' },
  { id: 'angular', name: 'Angular', slug: 'angular', color: '#F43F5E', icon: IconBrandAngular, isAvailable: false, category: 'framework', description: 'Plataforma empresarial de componentes de Google.' },
  { id: 'svelte', name: 'Svelte', slug: 'svelte', color: '#FB923C', icon: IconBrandSvelte, isAvailable: false, category: 'framework', description: 'Compilador reactivo sin virtual DOM.' },
  { id: 'tailwind', name: 'Tailwind CSS', slug: 'tailwind', color: '#38BDF8', icon: IconBrandTailwind, isAvailable: false, category: 'framework', description: 'Estilos utilitarios rápidos y diseño responsivo.' },
  { id: 'nodejs', name: 'Node.js', slug: 'nodejs', color: '#4ADE80', icon: IconBrandNodejs, isAvailable: false, category: 'framework', description: 'Entorno de ejecución JavaScript del lado del servidor.' },
  { id: 'django', name: 'Django', slug: 'django', color: '#4ADE80', icon: IconBrandDjango, isAvailable: false, category: 'framework', description: 'Framework web de alto nivel basado en Python.' },
  { id: 'flutter', name: 'Flutter', slug: 'flutter', color: '#38BDF8', icon: IconBrandFlutter, isAvailable: false, category: 'framework', description: 'Apps multiplataforma nativas con Dart.' },
  { id: 'rust', name: 'Rust', slug: 'rust', color: '#FB923C', icon: IconBrandRust, isAvailable: false, category: 'language', description: 'Rendimiento bare-metal y memoria segura.' },
  { id: 'java', name: 'Java', slug: 'java', color: '#F97316', icon: IconCoffee, isAvailable: false, category: 'language', description: 'Orientación a objetos para software empresarial.' },
  { id: 'go', name: 'Go (Golang)', slug: 'go', color: '#22D3EE', icon: IconBrandGolang, isAvailable: false, category: 'language', description: 'Concurrencia nativa y servicios eficientes.' },
  { id: 'cpp', name: 'C++', slug: 'cpp', color: '#818CF8', icon: IconBrandCpp, isAvailable: false, category: 'language', description: 'Control de hardware y alto desempeño.' },
  { id: 'csharp', name: 'C#', slug: 'csharp', color: '#C084FC', icon: IconBrandCSharp, isAvailable: false, category: 'language', description: 'Ecosistema .NET, videojuegos y servicios.' },
  { id: 'swift', name: 'Swift', slug: 'swift', color: '#F97316', icon: IconBrandSwift, isAvailable: false, category: 'language', description: 'Desarrollo nativo para iOS y macOS.' },
  { id: 'kotlin', name: 'Kotlin', slug: 'kotlin', color: '#A855F7', icon: IconBrandKotlin, isAvailable: false, category: 'language', description: 'El estándar moderno para desarrollo Android.' },
  { id: 'php', name: 'PHP', slug: 'php', color: '#818CF8', icon: IconBrandPhp, isAvailable: false, category: 'language', description: 'Desarrollo backend y aplicaciones web.' },
  { id: 'sql', name: 'SQL', slug: 'sql', color: '#FBBF24', icon: IconBrandMysql, isAvailable: false, category: 'language', description: 'Consultas y bases de datos relacionales.' },
  { id: 'docker', name: 'Docker', slug: 'docker', color: '#38BDF8', icon: IconBrandDocker, isAvailable: false, category: 'tools', description: 'Contenedores y despliegues estandarizados.' },
  { id: 'git', name: 'Git', slug: 'git', color: '#F87171', icon: IconBrandGit, isAvailable: false, category: 'tools', description: 'Control de versiones y colaboración en código.' },
  { id: 'graphql', name: 'GraphQL', slug: 'graphql', color: '#E879F9', icon: IconBrandGraphql, isAvailable: false, category: 'tools', description: 'Lenguaje de consulta para APIs modernas.' },
  { id: 'mongodb', name: 'MongoDB', slug: 'mongodb', color: '#34D399', icon: IconBrandMongodb, isAvailable: false, category: 'tools', description: 'Base de datos NoSQL documental flexible.' },
];
