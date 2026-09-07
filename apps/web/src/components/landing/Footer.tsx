'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  IconHeart,
  IconBrandGithub,
  IconBook2,
  IconQrcode,
  IconShieldCheck,
} from '@tabler/icons-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs sm:text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#182030] border border-slate-800 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="KodaAcademy Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                KodaAcademy
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Plataforma interactiva de programación estructurada en micro-lecciones prácticas, razonamiento guiado y certificación digital verificable.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="inline-flex items-center gap-1">
                <IconShieldCheck className="w-4 h-4 text-emerald-400" />
                Track Inaugural: Python 3.12
              </span>
              <span>•</span>
              <span>Plataforma Multi-Lenguaje</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explorar</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollTo('propuesta-valor')} className="hover:text-amber-400 transition-colors">
                  Propuesta de Valor
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('metodologia')} className="hover:text-amber-400 transition-colors">
                  ¿Por qué Koda?
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recursos & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/nastex123/DuolingoProgramacion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <IconBrandGithub className="w-3.5 h-3.5" />
                  Repositorio en GitHub
                </a>
              </li>
              <li>
                <Link href="/verificar" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <IconQrcode className="w-3.5 h-3.5" />
                  Verificación de Certificados
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Aviso de Privacidad (GDPR)</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Términos de Servicio</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KodaAcademy. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <IconHeart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para la comunidad de programadores.
          </p>
        </div>
      </div>
    </footer>
  );
};
