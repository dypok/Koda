import React from 'react';
import { CircleHelp } from 'lucide-react';

const FAQS_DATA = [
  {
    q: '¿KodaAcademy es verdaderamente 100% gratis?',
    a: 'Sí, absolutamente. Todo el temario de fundamentos, los retos interactivos, la ejecución en navegador y los certificados son de libre acceso sin costo ni muros de pago.',
  },
  {
    q: '¿Qué tecnologías y lenguajes puedo aprender?',
    a: 'KodaAcademy enseña los fundamentos lógicos universales de la programación (estructuras de control, algoritmos, funciones y resolución de problemas) preparándote para dominar con soltura cualquier lenguaje y tecnología del mundo real.',
  },
  {
    q: '¿Cómo funcionan las rachas y el hábito diario?',
    a: 'Diseñamos lecciones de 15 minutos al día. Mantener una racha constante entrena tu memoria muscular y retención cognitiva con mayor efectividad que sesiones maratónicas esporádicas.',
  },
  {
    q: '¿Necesito instalar algo en mi computadora?',
    a: 'No. Nuestro entorno de ejecución web compila y corre el código directamente en tu navegador de forma segura e instantánea.',
  },
];

export const FaqsTab: React.FC = () => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2 font-sans">
        <CircleHelp className="w-3.5 h-3.5" />
        Ayuda y Respuestas
      </div>
      <h4 className="font-display text-2xl font-bold text-white tracking-tight">Preguntas Frecuentes</h4>
      <p className="text-xs text-slate-400 mt-1">Todo lo que necesitas saber para aprender con éxito en KodaAcademy.</p>
    </div>

    <div className="space-y-3">
      {FAQS_DATA.map((faq, i) => (
        <details
          key={i}
          open={i === 0}
          className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 open:border-amber-500/30 transition-colors"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-bold text-white text-sm [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded-2xl">
            {faq.q}
            <span aria-hidden="true" className="shrink-0 rounded-full border border-slate-700 w-6 h-6 flex items-center justify-center text-amber-400 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="px-4 pb-4 text-xs text-slate-400 leading-relaxed">{faq.a}</p>
        </details>
      ))}
    </div>
  </div>
);
