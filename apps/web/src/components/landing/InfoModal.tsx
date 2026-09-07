'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconX,
  IconHelp,
  IconSchool,
  IconAward,
  IconUsers,
  IconFileText,
  IconShieldLock,
  IconUserCheck,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconArticle,
  IconExternalLink,
  IconCheck,
  IconCircleCheck,
  IconSparkles,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export type InfoModalTab =
  | 'faqs'
  | 'schools'
  | 'tests'
  | 'guidelines'
  | 'terms'
  | 'privacy'
  | 'data-rights'
  | 'social';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: InfoModalTab;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'faqs',
}) => {
  const [activeTab, setActiveTab] = useState<InfoModalTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    {
      name: 'Ayuda y Soporte',
      items: [
        { id: 'faqs' as InfoModalTab, label: 'Preguntas Frecuentes', icon: IconHelp },
        { id: 'schools' as InfoModalTab, label: 'Koda para Escuelas', icon: IconSchool },
        { id: 'tests' as InfoModalTab, label: 'Certificación & Evaluaciones', icon: IconAward },
      ],
    },
    {
      name: 'Privacidad y Términos',
      items: [
        { id: 'guidelines' as InfoModalTab, label: 'Normas de la Comunidad', icon: IconUsers },
        { id: 'terms' as InfoModalTab, label: 'Términos de Servicio', icon: IconFileText },
        { id: 'privacy' as InfoModalTab, label: 'Política de Privacidad', icon: IconShieldLock },
        { id: 'data-rights' as InfoModalTab, label: 'Gestión de Datos', icon: IconUserCheck },
      ],
    },
    {
      name: 'Comunidad & Social',
      items: [
        { id: 'social' as InfoModalTab, label: 'Redes Sociales & Blog', icon: IconArticle },
      ],
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        {/* Fondo interactivo para cerrar al hacer clic afuera */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Contenedor del Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0d121f] via-slate-950 to-[#0a0d16] shadow-2xl overflow-hidden z-10"
        >
          {/* Resplandor cálido de fondo */}
          <div className="absolute top-0 right-1/4 w-96 h-48 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_70%)] blur-2xl pointer-events-none" />

          {/* Cabecera del Modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#182030] border border-slate-800 overflow-hidden shadow-sm">
                <Image
                  src="/logo.png"
                  alt="KodaAcademy Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>KodaAcademy</span>
                  <span className="text-xs font-normal text-slate-500 font-sans">· Centro de Información</span>
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo con Sidebar + Panel de Contenido */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar de Navegación por Categorías */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/40 p-4 overflow-x-auto md:overflow-y-auto shrink-0 space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="space-y-1.5">
                  <span className="hidden md:block text-[11px] font-display font-bold uppercase tracking-wider text-slate-500 px-2.5">
                    {category.name}
                  </span>
                  <div className="flex md:flex-col gap-1">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all duration-200 cursor-pointer text-left shrink-0 md:w-full',
                            isActive
                              ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                          )}
                        >
                          <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-amber-400' : 'text-slate-500')} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </aside>

            {/* Contenido Principal con Scroll */}
            <main className="flex-1 p-6 sm:p-8 overflow-y-auto font-sans text-slate-300 text-sm leading-relaxed space-y-6">
              {/* TAB: PREGUNTAS FRECUENTES (FAQS) */}
              {activeTab === 'faqs' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2 font-sans">
                      <IconHelp className="w-3.5 h-3.5" />
                      Ayuda y Respuestas
                    </div>
                    <h4 className="font-display text-2xl font-bold text-white tracking-tight">
                      Preguntas Frecuentes
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Todo lo que necesitas saber para aprender con éxito en KodaAcademy.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
                      <h5 className="font-bold text-white text-sm">¿KodaAcademy es verdaderamente 100% gratis?</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Sí, absolutamente. Todo el temario de fundamentos, los retos interactivos, la ejecución en navegador y los certificados son de libre acceso sin costo ni muros de pago.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
                      <h5 className="font-bold text-white text-sm">¿Por qué el track inaugural es Python 3.12?</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Python ofrece una sintaxis limpia y directa sin sobrecarga visual, permitiéndote concentrarte en asimilar la lógica universal de programación (bucles, estructuras de datos, funciones y algoritmos) aplicable luego a cualquier lenguaje.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
                      <h5 className="font-bold text-white text-sm">¿Cómo funcionan las rachas y el hábito diario?</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Diseñamos lecciones de 15 minutos al día. Mantener una racha constante entrena tu memoria muscular y retención cognitiva con mayor efectividad que sesiones maratónicas esporádicas.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
                      <h5 className="font-bold text-white text-sm">¿Necesito instalar algo en mi computadora?</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        No. Nuestro entorno de ejecución web compila y corre el código directamente en tu navegador de forma segura e instantánea.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: KODA PARA ESCUELAS */}
              {activeTab === 'schools' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 mb-2 font-sans">
                      <IconSchool className="w-3.5 h-3.5" />
                      Educación en Aulas
                    </div>
                    <h4 className="font-display text-2xl font-bold text-white tracking-tight">
                      Koda para Escuelas y Docentes
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Potencia tus clases de informática con ejercicios guiados y corrección automática.
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    KodaAcademy está concebido para integrarse en aulas de secundaria, bachillerato y universidades. Los docentes pueden asignar lecciones, seguir las rachas de sus estudiantes y detectar conceptos que requieran refuerzo.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-white font-bold text-xs">
                        <IconCircleCheck className="w-4 h-4 text-emerald-400" />
                        <span>Cero Costo por Estudiante</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Acceso libre ilimitado para colegios públicos y privados.</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-white font-bold text-xs">
                        <IconCircleCheck className="w-4 h-4 text-emerald-400" />
                        <span>Retroalimentación Inmediata</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Corrección automática con pistas sin dar la respuesta.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200">
                    ¿Eres docente o directivo escolar? Escríbenos a <span className="font-bold text-white underline">educacion@kodaacademy.org</span> para activar herramientas de grupo.
                  </div>
                </div>
              )}

              {/* TAB: CERTIFICACIÓN & EVALUACIONES */}
              {activeTab === 'tests' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2 font-sans">
                      <IconAward className="w-3.5 h-3.5" />
                      Acreditación Verificable
                    </div>
                    <h4 className="font-display text-2xl font-bold text-white tracking-tight">
                      Certificación & Evaluaciones Koda
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Demuestra tus habilidades técnicas con credenciales oficiales con código QR.
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Al completar todos los módulos de un track de lenguaje y aprobar el proyecto integrador final, KodaAcademy emite un certificado digital oficial con identificador único y código QR.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/30 text-xs">
                      <IconCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white">Validación Criptográfica:</span> Cualquier reclutador o institución educativa puede escanear el QR o ingresar a <span className="text-amber-400">/verificar</span> para constatar la autenticidad.
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/30 text-xs">
                      <IconCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white">100% Práctico:</span> El certificado acredita la resolución efectiva de problemas en código real, no solo memorización de conceptos.
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {/* TAB: NORMAS DE LA COMUNIDAD */}
              {activeTab === 'guidelines' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 mb-2 font-sans">
                      <IconUsers className="w-3.5 h-3.5" />
                      Convivencia y Aprendizaje
                    </div>
                    <h4 className="font-display text-2xl font-bold text-white tracking-tight">
                      Normas de la Comunidad Koda
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Principios para construir un espacio seguro, solidario y enfocado en el crecimiento mutuo.
                    </p>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-300">
                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-1.5">
                      <h5 className="font-bold text-white text-sm">1. Respeto y Empatía Primero</h5>
                      <p className="text-slate-400">Todos empezamos desde cero. Nunca te burles de una duda o error de sintaxis; la curiosidad es el motor del buen programador.</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-1.5">
                      <h5 className="font-bold text-white text-sm">2. Pistas Sí, Spoilers No</h5>
                      <p className="text-slate-400">Si ayudas a un compañero en los debates, no le pegues la solución completa. Guíalo con preguntas para que experimente el momento de descubrimiento por sí mismo.</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-1.5">
                      <h5 className="font-bold text-white text-sm">3. Código Limpio y Constructivo</h5>
                      <p className="text-slate-400">Fomenta las buenas prácticas de nombrado, indentación y claridad conceptual en las revisiones comunitarias.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: TÉRMINOS DE SERVICIO */}
              {activeTab === 'terms' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2 font-sans">
                      <IconFileText className="w-3.5 h-3.5" />
                      Marco Legal
                    </div>
                    <h4 className="font-display text-2xl font-bold text-white tracking-tight">
                      Términos de Servicio
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Condiciones de uso de la plataforma educativa KodaAcademy.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                    <p>
                      <strong>1. Uso de la Plataforma:</strong> KodaAcademy provee lecciones, editores interactivos y herramientas de certificación con fines pedagógicos y de capacitación personal.
                    </p>
                    <p>
                      <strong>2. Propiedad Intelectual de tu Código:</strong> Todo el código que escribas, crees o diseñes durante las lecciones y proyectos es 100% de tu propiedad. KodaAcademy no reclama derechos sobre tus soluciones.
                    </p>
                    <p>
                      <strong>3. Sandbox Seguro:</strong> Queda prohibido utilizar el entorno de ejecución web para actividades maliciosas, ataques de denegación de servicio o explotación de vulnerabilidades.
                    </p>
                    <p>
                      <strong>4. Gratuidad del Servicio:</strong> El núcleo formativo de KodaAcademy permanece gratuito de por vida para el acceso individual del estudiante.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB: POLÍTICA DE PRIVACIDAD */}
              {activeTab === 'privacy' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-2 font-sans">
                      <IconShieldLock className="w-3.5 h-3.5" />
                      Privacidad y Seguridad
                    </div>
                    <h4 className="font-display text-2xl font-bold text-white tracking-tight">
                      Política de Privacidad
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Transparencia total sobre cómo cuidamos y protegemos tus datos.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-2">
                      <h5 className="font-bold text-white text-sm">Cero Venta de Información</h5>
                      <p className="text-slate-400">Nunca vendemos, alquilamos ni compartimos tus datos de contacto con corredores de datos ni plataformas publicitarias de terceros.</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-2">
                      <h5 className="font-bold text-white text-sm">Datos Mínimos Necesarios</h5>
                      <p className="text-slate-400">Solo almacenamos tu correo de acceso, tu progreso en el roadmap, rachas acumuladas y los certificados emitidos.</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-2">
                      <h5 className="font-bold text-white text-sm">Cifrado de Extremo a Extremo</h5>
                      <p className="text-slate-400">Todas las comunicaciones entre tu navegador y nuestra infraestructura viajan bajo conexiones HTTPS con cifrado TLS 1.3.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: GESTIÓN DE DATOS (DO NOT SELL / SHARE) */}
              {activeTab === 'data-rights' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2 font-sans">
                      <IconUserCheck className="w-3.5 h-3.5" />
                      Control de Tus Datos
                    </div>
                    <h4 className="font-display text-2xl font-bold text-white tracking-tight">
                      No Vender ni Compartir mi Información
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Conformidad con regulaciones de privacidad GDPR, CCPA / CPRA.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-200 font-sans space-y-2">
                    <p className="font-bold text-white text-sm">Declaración de No Comercialización:</p>
                    <p>
                      KodaAcademy no "vende" ni "comparte" tu información personal en los términos definidos por la Ley de Privacidad del Consumidor de California (CCPA) ni por el Reglamento General de Protección de Datos (GDPR) de la Unión Europea.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <h5 className="font-bold text-white text-sm">Tus Derechos Fundamentales:</h5>
                    <ul className="space-y-2 font-sans">
                      <li className="flex items-center gap-2">
                        <IconCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Derecho a descargar una copia completa de tu historial y progreso en formato JSON.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Derecho al olvido y eliminación definitiva de tu cuenta y datos con un solo clic.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Desactivación total de cookies analíticas no esenciales en cualquier momento.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB: REDES SOCIALES & BLOG */}
              {activeTab === 'social' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 mb-2 font-sans">
                      <IconSparkles className="w-3.5 h-3.5" />
                      Comunidad & Novedades
                    </div>
                    <h4 className="font-display text-2xl font-bold text-white tracking-tight">
                      Redes Sociales & Blog Oficial
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Únete a la comunidad de programadores y sigue nuestros lanzamientos.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Blog */}
                    <a
                      href="#blog"
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                          <IconArticle className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-display font-bold text-white text-sm block">Blog Oficial</span>
                          <span className="text-[11px] text-slate-400 font-sans">Artículos, tutoriales y guías</span>
                        </div>
                      </div>
                      <IconExternalLink className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-pink-500/40 hover:bg-slate-900/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                          <IconBrandInstagram className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-display font-bold text-white text-sm block">Instagram</span>
                          <span className="text-[11px] text-slate-400 font-sans">Retos visuales y Koda en acción</span>
                        </div>
                      </div>
                      <IconExternalLink className="w-4 h-4 text-slate-600 group-hover:text-pink-400 transition-colors" />
                    </a>

                    {/* TikTok */}
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                          <IconBrandTiktok className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-display font-bold text-white text-sm block">TikTok</span>
                          <span className="text-[11px] text-slate-400 font-sans">Micro-tips de código en 60s</span>
                        </div>
                      </div>
                      <IconExternalLink className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </a>

                    {/* Twitter / X */}
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-500/40 hover:bg-slate-900/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                          <IconBrandX className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-display font-bold text-white text-sm block">Twitter / X</span>
                          <span className="text-[11px] text-slate-400 font-sans">Actualizaciones y notas de release</span>
                        </div>
                      </div>
                      <IconExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </a>

                    {/* YouTube */}
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-red-500/40 hover:bg-slate-900/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                          <IconBrandYoutube className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-display font-bold text-white text-sm block">YouTube</span>
                          <span className="text-[11px] text-slate-400 font-sans">Explicaciones profundas de lógica</span>
                        </div>
                      </div>
                      <IconExternalLink className="w-4 h-4 text-slate-600 group-hover:text-red-400 transition-colors" />
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                          <IconBrandLinkedin className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-display font-bold text-white text-sm block">LinkedIn</span>
                          <span className="text-[11px] text-slate-400 font-sans">Novedades corporativas y empleo</span>
                        </div>
                      </div>
                      <IconExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                    </a>
                  </div>
                </div>
              )}
            </main>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InfoModal;
