'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: '¿Necesito conocimientos previos o matemáticas avanzadas para comenzar?',
    answer:
      'No. KodaAcademy está estructurada para quienes inician desde cero. Solo necesitas razonamiento lógico básico y lectura; cada lección introduce los conceptos paso a paso con ejemplos interactivos.',
  },
  {
    question: '¿Por qué Python 3.12 es el track piloto y qué otros lenguajes se incluirán?',
    answer:
      'Python 3.12 fue seleccionado como track inaugural por su sintaxis clara y alta relevancia en la industria. KodaAcademy es una plataforma concebida para múltiples lenguajes: nuestro roadmap incluye tracks de JavaScript / TypeScript, Go y Rust, manteniendo la misma metodología interactiva.',
  },
  {
    question: '¿Debo instalar programas o configuraciones en mi computadora?',
    answer:
      'No. Todo el código se ejecuta directamente en la plataforma a través de tu navegador web. No requieres instalar compiladores, terminales locales ni paquetes adicionales.',
  },
  {
    question: '¿Cómo funciona la certificación oficial con código QR?',
    answer:
      'Al completar los 12 módulos y aprobar el Proyecto Integrador de un track, se emite un diploma digital con identificador correlativo único y código QR ISO 18004 verificable en línea por reclutadores o instituciones.',
  },
  {
    question: '¿Cuánto tiempo se recomienda dedicar al día?',
    answer:
      'Entre 10 y 15 minutos diarios son suficientes para completar de 3 a 5 micro-lecciones. La metodología prioriza la constancia diaria y la retención activa por encima de sesiones extensas y esporádicas.',
  },
  {
    question: '¿Cómo garantiza la plataforma la asimilación real de los temas?',
    answer:
      'A través de retos prácticos inmediatos, opciones estructuradas para evitar el acierto por descarte, y el Cuaderno de Errores, que recopila los conceptos donde tuviste dudas para reforzarlos antes de certificar el track.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-900/30 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-400">
            <HelpCircle className="w-3.5 h-3.5" />
            Resolvemos tus Dudas
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Aspectos clave sobre la metodología de KodaAcademy, el track inaugural y el ecosistema formativo.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-white text-sm sm:text-base gap-4"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <div
                    className={`p-1.5 rounded-full bg-slate-800 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400 bg-amber-400/10' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
