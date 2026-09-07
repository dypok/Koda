import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',
    './src/models/**/*.{js,ts,jsx,tsx,mdx}',
    './src/controllers/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0B0F19',
          900: '#0F172A',
          850: '#151D2E',
          800: '#1E293B',
          700: '#334155',
        },
        koda: {
          orange: '#F97316',
          amber: '#F59E0B',
          emerald: '#10B981',
          indigo: '#6366F1',
          coral: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-code)', 'monospace'],
        code: ['var(--font-code)', 'monospace'],
        jetbrains: ['var(--font-jetbrains)', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        emberRise: {
          '0%': { transform: 'translateY(0) translateX(0) scale(0.7)', opacity: '0' },
          '15%': { opacity: '0.85' },
          '75%': { opacity: '0.5' },
          '100%': { transform: 'translateY(-140px) translateX(20px) scale(0.25)', opacity: '0' },
        },
        codeStream: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        marquee: 'marquee 48s linear infinite',
        fadeIn: 'fadeIn 0.25s ease-out forwards',
        'code-stream': 'codeStream 30s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
