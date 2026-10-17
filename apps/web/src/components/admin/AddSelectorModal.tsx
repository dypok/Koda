'use client';

import React, { useState } from 'react';
import {
  X,
  Compass,
  Cube,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
} from '@phosphor-icons/react';
import { useAdminCurriculumStore } from '@/stores/admin-curriculum.store';

interface AddSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'track' | 'module' | 'section';
  initialTargetIndex?: number;
  onCreated?: (type: 'track' | 'module' | 'section', data: any, targetIndex?: number) => void;
}

type AddType = 'track' | 'module' | 'section' | null;

export const AddSelectorModal: React.FC<AddSelectorModalProps> = ({
  isOpen,
  onClose,
  initialType,
  initialTargetIndex,
  onCreated,
}) => {
  const {
    draftTracks,
    draftModules,
    selectedTrackSlug,
    selectedModuleSlug,
    addTrack,
    addModule,
    addSection,
  } = useAdminCurriculumStore();

  const [selectedType, setSelectedType] = useState<AddType>(initialType || null);

  React.useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialType]);

  // Formulario Ruta
  const [trackName, setTrackName] = useState('');
  const [trackSlug, setTrackSlug] = useState('');
  const [trackDesc, setTrackDesc] = useState('');
  const [trackColor, setTrackColor] = useState('#38BDF8');
  const [trackBadge, setTrackBadge] = useState('Especialidad');

  // Formulario Modulo
  const [moduleCourseSlug, setModuleCourseSlug] = useState(selectedTrackSlug || 'python');
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleSlug, setModuleSlug] = useState('');
  const [moduleObjective, setModuleObjective] = useState('');

  // Formulario Seccion
  const [sectionModuleSlug, setSectionModuleSlug] = useState(selectedModuleSlug || (draftModules[0]?.slug || ''));
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionSlug, setSectionSlug] = useState('');
  const [sectionXp, setSectionXp] = useState(50);

  if (!isOpen) return null;

  const handleReset = () => {
    setSelectedType(null);
    setTrackName('');
    setTrackSlug('');
    setTrackDesc('');
    setModuleTitle('');
    setModuleSlug('');
    setModuleObjective('');
    setSectionTitle('');
    setSectionSlug('');
    onClose();
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackName.trim() || !trackSlug.trim()) return;
    const item = {
      name: trackName.trim(),
      slug: trackSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      description: trackDesc.trim() || 'Ruta formativa integral de programacion.',
      icon: 'Terminal',
      badge: trackBadge.trim() || 'Especialista',
      color: trackColor,
    };
    addTrack(item);
    onCreated?.('track', item, initialTargetIndex);
    handleReset();
  };

  const handleModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !moduleSlug.trim()) return;
    const item = {
      course_slug: moduleCourseSlug,
      title: moduleTitle.trim(),
      slug: moduleSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      objective: moduleObjective.trim() || 'Comprender los principios esenciales de este modulo.',
    };
    addModule(item);
    onCreated?.('module', item, initialTargetIndex);
    handleReset();
  };

  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTitle.trim() || !sectionSlug.trim()) return;
    const item = {
      module_slug: sectionModuleSlug,
      title: sectionTitle.trim(),
      slug: sectionSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      xp_reward: Number(sectionXp) || 50,
    };
    addSection(item);
    onCreated?.('section', item, initialTargetIndex);
    handleReset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white font-mono">
              {selectedType === null && 'Añadir Nuevo Elemento Curricular'}
              {selectedType === 'track' && 'Crear Nueva Ruta Formativa'}
              {selectedType === 'module' && 'Crear Nuevo Modulo'}
              {selectedType === 'section' && 'Crear Nueva Seccion'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6">
          {/* PASO 1: SELECCION ENTRE RUTA, MODULO O SECCION */}
          {selectedType === null && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Selecciona la entidad que deseas incorporar a la plataforma:
              </p>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedType('track')}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Nueva Ruta</span>
                      <span className="text-[10px] font-mono font-normal text-sky-400 px-2 py-0.2 bg-sky-500/10 rounded border border-sky-500/20">
                        Nivel Superior
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Crea un nuevo track de carrera o lenguaje de programacion (ej. Python Specialist, Rust Core).
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('module')}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Cube className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Nuevo Modulo</span>
                      <span className="text-[10px] font-mono font-normal text-amber-400 px-2 py-0.2 bg-amber-500/10 rounded border border-amber-500/20">
                        Nivel Intermedio
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Agrupa secciones y lecciones bajo una tematica conceptual especifica dentro de una ruta.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('section')}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Nueva Seccion</span>
                      <span className="text-[10px] font-mono font-normal text-emerald-400 px-2 py-0.2 bg-emerald-500/10 rounded border border-emerald-500/20">
                        Unidad Didactica
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Crea la unidad de aprendizaje donde se agregan enunciados, desafios y preguntas interactivas.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* PASO 2A: FORMULARIO RUTA */}
          {selectedType === 'track' && (
            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Nombre de la Ruta *</label>
                <input
                  type="text"
                  required
                  value={trackName}
                  onChange={(e) => {
                    setTrackName(e.target.value);
                    if (!trackSlug) {
                      setTrackSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="ej. Go Cloud Services"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Slug Identificador *</label>
                  <input
                    type="text"
                    required
                    value={trackSlug}
                    onChange={(e) => setTrackSlug(e.target.value)}
                    placeholder="go-cloud"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Badge de Especialidad</label>
                  <input
                    type="text"
                    value={trackBadge}
                    onChange={(e) => setTrackBadge(e.target.value)}
                    placeholder="Sistemas"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Descripcion Pedagogica</label>
                <textarea
                  rows={2}
                  value={trackDesc}
                  onChange={(e) => setTrackDesc(e.target.value)}
                  placeholder="Describe el alcance y perfil de salida del estudiante..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Color Tematico Neón</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={trackColor}
                    onChange={(e) => setTrackColor(e.target.value)}
                    className="w-10 h-8 rounded bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-400">{trackColor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedType(null)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Atras</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20"
                >
                  <span>Crear Ruta</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* PASO 2B: FORMULARIO MODULO */}
          {selectedType === 'module' && (
            <form onSubmit={handleModuleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Ruta Formativa Padre *</label>
                <select
                  value={moduleCourseSlug}
                  onChange={(e) => setModuleCourseSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {draftTracks.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name} ({t.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Titulo del Modulo *</label>
                <input
                  type="text"
                  required
                  value={moduleTitle}
                  onChange={(e) => {
                    setModuleTitle(e.target.value);
                    if (!moduleSlug) {
                      setModuleSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="ej. Programacion Asincrona y Corrutinas"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Slug Identificador *</label>
                <input
                  type="text"
                  required
                  value={moduleSlug}
                  onChange={(e) => setModuleSlug(e.target.value)}
                  placeholder="async-corrutinas"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Objetivo de Aprendizaje *</label>
                <textarea
                  rows={2}
                  required
                  value={moduleObjective}
                  onChange={(e) => setModuleObjective(e.target.value)}
                  placeholder="Que sera capaz de resolver el estudiante al completar este modulo..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedType(null)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Atras</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20"
                >
                  <span>Crear Modulo</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* PASO 2C: FORMULARIO SECCION */}
          {selectedType === 'section' && (
            <form onSubmit={handleSectionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Modulo Padre *</label>
                <select
                  value={sectionModuleSlug}
                  onChange={(e) => setSectionModuleSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {draftModules.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.title} [{m.course_slug}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Titulo de la Seccion *</label>
                <input
                  type="text"
                  required
                  value={sectionTitle}
                  onChange={(e) => {
                    setSectionTitle(e.target.value);
                    if (!sectionSlug) {
                      setSectionSlug('sec-' + e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="ej. Manejo de Excepciones con Try Except"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Slug Identificador *</label>
                  <input
                    type="text"
                    required
                    value={sectionSlug}
                    onChange={(e) => setSectionSlug(e.target.value)}
                    placeholder="sec-try-except"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Recompensa XP</label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={sectionXp}
                    onChange={(e) => setSectionXp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="text-amber-400 font-semibold">Generacion de Estructura Canónica:</div>
                <div>Se inicializara automaticamente la primera leccion en el editor Canva siguiendo el orden didactico oficial.</div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedType(null)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Atras</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20"
                >
                  <span>Crear Seccion</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
