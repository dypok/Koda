'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: '¿Necesito saber matemáticas o tener experiencia previa en programación?',
    answer:
      '¡En absoluto! Koda está diseñado desde cero absoluto para personas sin ningún conocimiento previo. No necesitas ser bueno en matemáticas complejas; si sabes sumar y leer, puedes aprender a programar en Python con nuestro método paso a paso.',
  },
  {
    question: '¿Por qué Python 3.12 es el lenguaje de lanzamiento de Koda?',
    answer:
      'Python es actualmente el lenguaje más demandado del mundo en desarrollo de software, ciencia de datos e Inteligencia Artificial. Su sintaxis es limpia y cercana al lenguaje natural (parecido al inglés cotidiano), lo que elimina la frustración de aprender sintaxis engorrosa al comenzar.',
  },
  {
    question: '¿La plataforma es gratuita o tiene costos ocultos?',
    answer:
      'El acceso a todas las lecciones, desafíos prácticos, quizzes, exámenes de módulo y la emisión de tu certificado oficial digital es 100% gratuito. Creemos firmemente que la educación en programación de alta calidad debe ser accesible para todos.',
  },
  {
    question: '¿Cómo funcionan los certificados oficiales con código QR?',
    answer:
      'Al completar los 12 módulos y aprobar el examen del Proyecto Integrador con al menos 80%, el sistema genera un diploma oficial con un código correlativo único (ej. KODA-PY-000001) y un código QR ISO 18004. Cualquier persona o reclutador puede escanear el QR o ingresar a koda.app/verificar para comprobar al instante la validez de tu diploma.',
  },
  {
    question: '¿Cuánto tiempo necesito dedicarle al día para ver resultados?',
    answer:
      'Recomendamos entre 10 y 15 minutos al día (lo que equivale a unas 3 a 5 micro-lecciones). La constancia diaria es infinitamente más efectiva que estudiar 4 horas seguidas una vez al mes. Koda te ayuda a mantener tu racha diaria activa para consolidar el hábito.',
  },
  {
    question: '¿Cómo evitan que simplemente adivine las respuestas de las opciones?',
    answer:
      'Nuestras opciones de respuesta se barajan aleatoriamente en cada intento y cuentan con distractores basados en los errores reales de principiantes. Además, si fallas una pregunta, Koda la envía a tu Cuaderno de Errores y te pedirá remediarla en la ronda de repaso final con opciones mezcladas antes de dar por aprobada la sección.',
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
            Todo lo que necesitas saber sobre el método Koda, Python 3.12 y nuestro lanzamiento.
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
