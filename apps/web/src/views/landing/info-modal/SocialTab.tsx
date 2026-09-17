import React from 'react';
import { Sparkle, Newspaper, ArrowSquareOut, InstagramLogo, TiktokLogo, XLogo, YoutubeLogo, LinkedinLogo } from '@phosphor-icons/react';

const SOCIAL_ITEMS = [
  { name: 'Blog Oficial', desc: 'Artículos, tutoriales y guías', href: '#blog', icon: Newspaper, color: 'text-orange-400', border: 'border-orange-500/25', bg: 'bg-orange-500/10', hover: 'hover:border-amber-500/40' },
  { name: 'InstagramLogo', desc: 'Retos visuales y Koda en acción', href: 'https://instagram.com', icon: InstagramLogo, color: 'text-pink-400', border: 'border-pink-500/25', bg: 'bg-pink-500/10', hover: 'hover:border-pink-500/40' },
  { name: 'TikTok', desc: 'Micro-tips de código en 60s', href: 'https://tiktok.com', icon: TiktokLogo, color: 'text-cyan-400', border: 'border-cyan-500/25', bg: 'bg-cyan-500/10', hover: 'hover:border-cyan-500/40' },
  { name: 'XLogo / X', desc: 'Actualizaciones y notas de release', href: 'https://twitter.com', icon: XLogo, color: 'text-white', border: 'border-slate-700/40', bg: 'bg-slate-800/40', hover: 'hover:border-slate-500/40' },
  { name: 'YouTube', desc: 'Explicaciones profundas de lógica', href: 'https://youtube.com', icon: YoutubeLogo, color: 'text-red-400', border: 'border-red-500/25', bg: 'bg-red-500/10', hover: 'hover:border-red-500/40' },
  { name: 'LinkedIn', desc: 'Novedades corporativas y empleo', href: 'https://linkedin.com', icon: LinkedinLogo, color: 'text-blue-400', border: 'border-blue-500/25', bg: 'bg-blue-500/10', hover: 'hover:border-blue-500/40' },
];

export const SocialTab: React.FC = () => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 mb-2 font-sans">
        <Sparkle className="w-3.5 h-3.5" />
        Comunidad & Novedades
      </div>
      <h4 className="font-display text-2xl font-bold text-white tracking-tight">Redes Sociales & Blog Oficial</h4>
      <p className="text-xs text-slate-400 mt-1">Únete a la comunidad de programadores y sigue nuestros lanzamientos.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {SOCIAL_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`group flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/40 ${item.hover} hover:bg-slate-900/80 transition-all cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-sm block">{item.name}</span>
                <span className="text-[11px] text-slate-400 font-sans">{item.desc}</span>
              </div>
            </div>
            <ArrowSquareOut className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
          </a>
        );
      })}
    </div>
  </div>
);
