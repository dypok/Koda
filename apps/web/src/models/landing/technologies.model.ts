import {
  IconBrandPython,
  IconBrandJavascript,
  IconBrandTypescript,
  IconBrandCpp,
  IconBrandCSharp,
  IconBrandRust,
  IconBrandGolang,
  IconBrandKotlin,
  IconBrandSwift,
  IconBrandPhp,
  IconBrandReact,
  IconBrandNodejs,
  IconBrandVue,
  IconBrandAngular,
  IconBrandSvelte,
  IconBrandDocker,
  IconBrandGit,
  IconBrandGraphql,
  IconBrandMongodb,
  IconDatabase,
  IconCode,
} from '@tabler/icons-react';

export interface TechItem {
  name: string;
  icon: React.ElementType;
  color: string;
  borderHover: string;
}

export const UPCOMING_TECHS: TechItem[] = [
  { name: 'Python', icon: IconBrandPython, color: '#3776AB', borderHover: 'hover:border-[#3776AB]/50' },
  { name: 'JavaScript', icon: IconBrandJavascript, color: '#F7DF1E', borderHover: 'hover:border-[#F7DF1E]/50' },
  { name: 'TypeScript', icon: IconBrandTypescript, color: '#3178C6', borderHover: 'hover:border-[#3178C6]/50' },
  { name: 'Rust', icon: IconBrandRust, color: '#DEA584', borderHover: 'hover:border-[#DEA584]/50' },
  { name: 'Go', icon: IconBrandGolang, color: '#00ADD8', borderHover: 'hover:border-[#00ADD8]/50' },
  { name: 'Java', icon: IconCode, color: '#ED8B00', borderHover: 'hover:border-[#ED8B00]/50' },
  { name: 'C++', icon: IconBrandCpp, color: '#00599C', borderHover: 'hover:border-[#00599C]/50' },
  { name: 'C#', icon: IconBrandCSharp, color: '#512BD4', borderHover: 'hover:border-[#512BD4]/50' },
  { name: 'Kotlin', icon: IconBrandKotlin, color: '#7F52FF', borderHover: 'hover:border-[#7F52FF]/50' },
  { name: 'Swift', icon: IconBrandSwift, color: '#F05138', borderHover: 'hover:border-[#F05138]/50' },
  { name: 'PHP', icon: IconBrandPhp, color: '#777BB4', borderHover: 'hover:border-[#777BB4]/50' },
  { name: 'SQL', icon: IconDatabase, color: '#00758F', borderHover: 'hover:border-[#00758F]/50' },
  { name: 'React', icon: IconBrandReact, color: '#61DAFB', borderHover: 'hover:border-[#61DAFB]/50' },
  { name: 'Node.js', icon: IconBrandNodejs, color: '#339933', borderHover: 'hover:border-[#339933]/50' },
  { name: 'Vue.js', icon: IconBrandVue, color: '#4FC08D', borderHover: 'hover:border-[#4FC08D]/50' },
  { name: 'Angular', icon: IconBrandAngular, color: '#DD0031', borderHover: 'hover:border-[#DD0031]/50' },
  { name: 'Svelte', icon: IconBrandSvelte, color: '#FF3E00', borderHover: 'hover:border-[#FF3E00]/50' },
  { name: 'Docker', icon: IconBrandDocker, color: '#2496ED', borderHover: 'hover:border-[#2496ED]/50' },
  { name: 'Git', icon: IconBrandGit, color: '#F05032', borderHover: 'hover:border-[#F05032]/50' },
  { name: 'GraphQL', icon: IconBrandGraphql, color: '#E10098', borderHover: 'hover:border-[#E10098]/50' },
  { name: 'MongoDB', icon: IconBrandMongodb, color: '#47A248', borderHover: 'hover:border-[#47A248]/50' },
];
