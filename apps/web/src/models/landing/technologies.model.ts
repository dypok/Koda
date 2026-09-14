import React from 'react';
import {
  IconBrandPython, IconBrandJavascript, IconBrandTypescript, IconBrandHtml5,
  IconBrandCss3, IconBrandRust, IconBrandGolang, IconBrandCpp, IconBrandCSharp,
  IconBrandSwift, IconBrandKotlin, IconBrandPhp, IconBrandNodejs, IconBrandReact,
  IconBrandNextjs, IconBrandVue, IconBrandAngular, IconBrandSvelte, IconBrandTailwind,
  IconBrandFlutter, IconBrandDjango, IconBrandDocker, IconBrandMysql, IconBrandGit,
  IconBrandGraphql, IconBrandMongodb, IconCoffee
} from '@tabler/icons-react';
import { Moon } from 'lucide-react';

export type TechCategory = 'lang' | 'fw' | 'tool';
export type TechStatus = 'soon' | 'alpha' | 'live';

export interface TechItem {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  category: TechCategory;
  /** 0-100, avance visible en el carrusel. */
  progress: number;
  status: TechStatus;
}

export const UPCOMING_TECHS: TechItem[] = [
  { name: 'Python', icon: IconBrandPython, color: '#3776AB', category: 'lang', progress: 100, status: 'live' },
  { name: 'Lua', icon: Moon, color: '#8FA8FF', category: 'lang', progress: 100, status: 'live' },
  { name: 'HTML', icon: IconBrandHtml5, color: '#E34F26', category: 'lang', progress: 70, status: 'soon' },
  { name: 'CSS', icon: IconBrandCss3, color: '#1572B6', category: 'lang', progress: 70, status: 'soon' },
  { name: 'JavaScript', icon: IconBrandJavascript, color: '#FACC15', category: 'lang', progress: 60, status: 'soon' },
  { name: 'TypeScript', icon: IconBrandTypescript, color: '#60A5FA', category: 'lang', progress: 45, status: 'soon' },
  { name: 'React', icon: IconBrandReact, color: '#67E8F9', category: 'fw', progress: 40, status: 'soon' },
  { name: 'Next.js', icon: IconBrandNextjs, color: '#E2E8F0', category: 'fw', progress: 30, status: 'soon' },
  { name: 'Vue.js', icon: IconBrandVue, color: '#4ADE80', category: 'fw', progress: 20, status: 'soon' },
  { name: 'Angular', icon: IconBrandAngular, color: '#F43F5E', category: 'fw', progress: 15, status: 'soon' },
  { name: 'Svelte', icon: IconBrandSvelte, color: '#FB923C', category: 'fw', progress: 15, status: 'soon' },
  { name: 'Tailwind', icon: IconBrandTailwind, color: '#06B6D4', category: 'fw', progress: 35, status: 'soon' },
  { name: 'Node.js', icon: IconBrandNodejs, color: '#4ADE80', category: 'tool', progress: 40, status: 'soon' },
  { name: 'Django', icon: IconBrandDjango, color: '#4ADE80', category: 'fw', progress: 25, status: 'soon' },
  { name: 'Flutter', icon: IconBrandFlutter, color: '#02569B', category: 'fw', progress: 20, status: 'soon' },
  { name: 'Rust', icon: IconBrandRust, color: '#FB923C', category: 'lang', progress: 25, status: 'soon' },
  { name: 'Java', icon: IconCoffee, color: '#F97316', category: 'lang', progress: 30, status: 'soon' },
  { name: 'Go', icon: IconBrandGolang, color: '#22D3EE', category: 'lang', progress: 25, status: 'soon' },
  { name: 'C++', icon: IconBrandCpp, color: '#818CF8', category: 'lang', progress: 20, status: 'soon' },
  { name: 'C#', icon: IconBrandCSharp, color: '#C084FC', category: 'lang', progress: 20, status: 'soon' },
  { name: 'Swift', icon: IconBrandSwift, color: '#F97316', category: 'lang', progress: 15, status: 'soon' },
  { name: 'Kotlin', icon: IconBrandKotlin, color: '#A855F7', category: 'lang', progress: 15, status: 'soon' },
  { name: 'PHP', icon: IconBrandPhp, color: '#818CF8', category: 'lang', progress: 15, status: 'soon' },
  { name: 'SQL', icon: IconBrandMysql, color: '#FBBF24', category: 'lang', progress: 35, status: 'soon' },
  { name: 'Docker', icon: IconBrandDocker, color: '#2496ED', category: 'tool', progress: 25, status: 'soon' },
  { name: 'Git', icon: IconBrandGit, color: '#F87171', category: 'tool', progress: 30, status: 'soon' },
  { name: 'GraphQL', icon: IconBrandGraphql, color: '#E879F9', category: 'tool', progress: 15, status: 'soon' },
  { name: 'MongoDB', icon: IconBrandMongodb, color: '#34D399', category: 'tool', progress: 20, status: 'soon' },
];
