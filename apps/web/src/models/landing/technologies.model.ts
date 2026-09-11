import React from 'react';
import {
  IconBrandPython, IconBrandJavascript, IconBrandTypescript, IconBrandHtml5,
  IconBrandCss3, IconBrandRust, IconBrandGolang, IconBrandCpp, IconBrandCSharp,
  IconBrandSwift, IconBrandKotlin, IconBrandPhp, IconBrandNodejs, IconBrandReact,
  IconBrandNextjs, IconBrandVue, IconBrandAngular, IconBrandSvelte, IconBrandTailwind,
  IconBrandFlutter, IconBrandDjango, IconBrandDocker, IconBrandMysql, IconBrandGit,
  IconBrandGraphql, IconBrandMongodb, IconCoffee
} from '@tabler/icons-react';

export interface TechItem {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

export const UPCOMING_TECHS: TechItem[] = [
  { name: 'Python', icon: IconBrandPython, color: '#38BDF8' },
  { name: 'HTML', icon: IconBrandHtml5, color: '#E34F26' },
  { name: 'CSS', icon: IconBrandCss3, color: '#1572B6' },
  { name: 'JavaScript', icon: IconBrandJavascript, color: '#FACC15' },
  { name: 'TypeScript', icon: IconBrandTypescript, color: '#60A5FA' },
  { name: 'React', icon: IconBrandReact, color: '#67E8F9' },
  { name: 'Next.js', icon: IconBrandNextjs, color: '#E2E8F0' },
  { name: 'Vue.js', icon: IconBrandVue, color: '#4ADE80' },
  { name: 'Angular', icon: IconBrandAngular, color: '#F43F5E' },
  { name: 'Svelte', icon: IconBrandSvelte, color: '#FB923C' },
  { name: 'Tailwind', icon: IconBrandTailwind, color: '#38BDF8' },
  { name: 'Node.js', icon: IconBrandNodejs, color: '#4ADE80' },
  { name: 'Django', icon: IconBrandDjango, color: '#4ADE80' },
  { name: 'Flutter', icon: IconBrandFlutter, color: '#38BDF8' },
  { name: 'Rust', icon: IconBrandRust, color: '#FB923C' },
  { name: 'Java', icon: IconCoffee, color: '#F97316' },
  { name: 'Go', icon: IconBrandGolang, color: '#22D3EE' },
  { name: 'C++', icon: IconBrandCpp, color: '#818CF8' },
  { name: 'C#', icon: IconBrandCSharp, color: '#C084FC' },
  { name: 'Swift', icon: IconBrandSwift, color: '#F97316' },
  { name: 'Kotlin', icon: IconBrandKotlin, color: '#A855F7' },
  { name: 'PHP', icon: IconBrandPhp, color: '#818CF8' },
  { name: 'SQL', icon: IconBrandMysql, color: '#FBBF24' },
  { name: 'Docker', icon: IconBrandDocker, color: '#38BDF8' },
  { name: 'Git', icon: IconBrandGit, color: '#F87171' },
  { name: 'GraphQL', icon: IconBrandGraphql, color: '#E879F9' },
  { name: 'MongoDB', icon: IconBrandMongodb, color: '#34D399' },
];
