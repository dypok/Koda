import { CodeSimple, BracketsCurly, Code, Palette, Gear, Stack, Atom, ArrowRight, Triangle, Shield, LightningA, DeviceMobile, Database, Cube, GitBranch, ShareNetwork, Coffee, Moon } from '@phosphor-icons/react';
import React from 'react';

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
  { name: 'Python', icon: CodeSimple, color: '#3776AB', category: 'lang', progress: 100, status: 'live' },
  { name: 'Lua', icon: Moon, color: '#8FA8FF', category: 'lang', progress: 100, status: 'live' },
  { name: 'HTML', icon: Code, color: '#E34F26', category: 'lang', progress: 70, status: 'soon' },
  { name: 'CSS', icon: Palette, color: '#1572B6', category: 'lang', progress: 70, status: 'soon' },
  { name: 'JavaScript', icon: BracketsCurly, color: '#FACC15', category: 'lang', progress: 60, status: 'soon' },
  { name: 'TypeScript', icon: BracketsCurly, color: '#60A5FA', category: 'lang', progress: 45, status: 'soon' },
  { name: 'React', icon: Atom, color: '#67E8F9', category: 'fw', progress: 40, status: 'soon' },
  { name: 'Next.js', icon: ArrowRight, color: '#E2E8F0', category: 'fw', progress: 30, status: 'soon' },
  { name: 'Vue.js', icon: Triangle, color: '#4ADE80', category: 'fw', progress: 20, status: 'soon' },
  { name: 'Angular', icon: Shield, color: '#F43F5E', category: 'fw', progress: 15, status: 'soon' },
  { name: 'Svelte', icon: LightningA, color: '#FB923C', category: 'fw', progress: 15, status: 'soon' },
  { name: 'Tailwind', icon: Palette, color: '#06B6D4', category: 'fw', progress: 35, status: 'soon' },
  { name: 'Node.js', icon: Stack, color: '#4ADE80', category: 'tool', progress: 40, status: 'soon' },
  { name: 'Django', icon: Database, color: '#4ADE80', category: 'fw', progress: 25, status: 'soon' },
  { name: 'Flutter', icon: DeviceMobile, color: '#02569B', category: 'fw', progress: 20, status: 'soon' },
  { name: 'Rust', icon: Gear, color: '#FB923C', category: 'lang', progress: 25, status: 'soon' },
  { name: 'Java', icon: Coffee, color: '#F97316', category: 'lang', progress: 30, status: 'soon' },
  { name: 'Go', icon: CodeSimple, color: '#22D3EE', category: 'lang', progress: 25, status: 'soon' },
  { name: 'C++', icon: CodeSimple, color: '#818CF8', category: 'lang', progress: 20, status: 'soon' },
  { name: 'C#', icon: CodeSimple, color: '#C084FC', category: 'lang', progress: 20, status: 'soon' },
  { name: 'Swift', icon: CodeSimple, color: '#F97316', category: 'lang', progress: 15, status: 'soon' },
  { name: 'Kotlin', icon: CodeSimple, color: '#A855F7', category: 'lang', progress: 15, status: 'soon' },
  { name: 'PHP', icon: CodeSimple, color: '#818CF8', category: 'lang', progress: 15, status: 'soon' },
  { name: 'SQL', icon: Database, color: '#FBBF24', category: 'lang', progress: 35, status: 'soon' },
  { name: 'Docker', icon: Cube, color: '#2496ED', category: 'tool', progress: 25, status: 'soon' },
  { name: 'Git', icon: GitBranch, color: '#F87171', category: 'tool', progress: 30, status: 'soon' },
  { name: 'GraphQL', icon: ShareNetwork, color: '#E879F9', category: 'tool', progress: 15, status: 'soon' },
  { name: 'MongoDB', icon: Database, color: '#34D399', category: 'tool', progress: 20, status: 'soon' },
];
