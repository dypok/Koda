import {
  IconBrandPython, IconBrandJavascript, IconBrandTypescript,
  IconBrandRust, IconCoffee, IconBrandGolang, IconBrandCpp,
  IconBrandCSharp, IconBrandSwift, IconBrandKotlin, IconBrandPhp, IconBrandMysql
} from '@tabler/icons-react';
import { LanguageOption } from './register.model';

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { id: 'python', name: 'Python', slug: 'python', color: '#38BDF8', icon: IconBrandPython, isAvailable: true, badge: 'Disponible ahora', description: 'Sintaxis limpia y fundamentos desde cero.' },
  { id: 'javascript', name: 'JavaScript', slug: 'javascript', color: '#FACC15', icon: IconBrandJavascript, isAvailable: false, badge: 'Próximamente', description: 'Interactividad y desarrollo en navegadores.' },
  { id: 'typescript', name: 'TypeScript', slug: 'typescript', color: '#60A5FA', icon: IconBrandTypescript, isAvailable: false, badge: 'Próximamente', description: 'JavaScript tipado a escala profesional.' },
  { id: 'rust', name: 'Rust', slug: 'rust', color: '#FB923C', icon: IconBrandRust, isAvailable: false, badge: 'Próximamente', description: 'Rendimiento bare-metal y memoria segura.' },
  { id: 'java', name: 'Java', slug: 'java', color: '#F97316', icon: IconCoffee, isAvailable: false, badge: 'Próximamente', description: 'Orientación a objetos para software empresarial.' },
  { id: 'go', name: 'Go (Golang)', slug: 'go', color: '#22D3EE', icon: IconBrandGolang, isAvailable: false, badge: 'Próximamente', description: 'Concurrencia nativa y servicios eficientes.' },
  { id: 'cpp', name: 'C++', slug: 'cpp', color: '#818CF8', icon: IconBrandCpp, isAvailable: false, badge: 'Próximamente', description: 'Control de hardware y alto desempeño.' },
  { id: 'csharp', name: 'C#', slug: 'csharp', color: '#C084FC', icon: IconBrandCSharp, isAvailable: false, badge: 'Próximamente', description: 'Ecosistema .NET, videojuegos y servicios.' },
  { id: 'swift', name: 'Swift', slug: 'swift', color: '#F97316', icon: IconBrandSwift, isAvailable: false, badge: 'Próximamente', description: 'Desarrollo nativo para iOS y macOS.' },
  { id: 'kotlin', name: 'Kotlin', slug: 'kotlin', color: '#A855F7', icon: IconBrandKotlin, isAvailable: false, badge: 'Próximamente', description: 'El estándar moderno para desarrollo Android.' },
  { id: 'php', name: 'PHP', slug: 'php', color: '#818CF8', icon: IconBrandPhp, isAvailable: false, badge: 'Próximamente', description: 'Desarrollo backend y aplicaciones web.' },
  { id: 'sql', name: 'SQL', slug: 'sql', color: '#FBBF24', icon: IconBrandMysql, isAvailable: false, badge: 'Próximamente', description: 'Consultas y bases de datos relacionales.' },
];
