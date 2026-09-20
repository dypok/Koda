'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  User,
  Sparkle,
  Compass,
  Palette,
  Trophy,
  Check,
  Lightning,
  Fire,
  Clock,
  ArrowsClockwise,
  UploadSimple,
  ShieldCheck,
} from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth.store';
import { useAppearanceStore, BackgroundPreset, StarDensity, AccentTheme } from '@/stores/appearance.store';
import {
  UserProfileService,
  UserProfileResponse,
  UpdateUserProfilePayload,
} from '@/services/user/user-profile.service';
import { KODA_AVATARS, KodaAvatarItem } from '@/constants/avatars.config';
import { WipeButton } from '@/components/ui/wipe-button';
import { ProfileToast, ToastMessage } from './ProfileToast';

export type SettingsTab = 'profile' | 'avatars' | 'preferences' | 'appearance' | 'metrics';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SettingsTab;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile',
}) => {
  const { user, token, updateUserProfile } = useAuthStore();
  const {
    backgroundPreset,
    starDensity,
    accentTheme,
    interactiveCursor,
    setBackgroundPreset,
    setStarDensity,
    setAccentTheme,
    setInteractiveCursor,
  } = useAppearanceStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Form State (Datos Generales)
  const [displayName, setDisplayName] = useState(user?.fullName || '');
  const [bio, setBio] = useState('');
  const [timezone, setTimezone] = useState('America/Bogota');
  const [locale, setLocale] = useState('es-CO');

  // Pedagogy State
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 15);
  const [dailyGoalId, setDailyGoalId] = useState<'casual' | 'regular' | 'focused' | 'intense'>('regular');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'elementary' | 'intermediate' | 'advanced'>(
    (user?.experienceLevel as any) || 'beginner'
  );
  const [learningStyle, setLearningStyle] = useState<'hands-on' | 'guided' | 'projects' | 'gamified'>(
    (user?.learningStyle as any) || 'hands-on'
  );

  // Avatar Selection State
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    user?.avatarUrl || '/avatars/koda-classic.svg'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Math.random().toString();
    setToast({ id, type, text });
    setTimeout(() => {
      setToast((cur) => (cur?.id === id ? null : cur));
    }, 4000);
  };

  // Cargar datos reales desde el backend
  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await UserProfileService.getProfile(token);
      setProfileData(data);
      setDisplayName(data.displayName || '');
      setBio(data.bio || '');
      setTimezone(data.timezone || 'America/Bogota');
      setLocale(data.locale || 'es-CO');
      if (data.dailyGoalMinutes) {
        setDailyGoalMinutes(data.dailyGoalMinutes);
      }
      if (data.dailyGoalId) {
        setDailyGoalId(data.dailyGoalId as any);
      }
      if (data.experienceLevel) {
        setExperienceLevel(data.experienceLevel as any);
      }
      if (data.learningStyle) {
        setLearningStyle(data.learningStyle as any);
      }
      if (data.avatarUrl) {
        setSelectedAvatarUrl(data.avatarUrl);
        updateUserProfile({ avatarUrl: data.avatarUrl });
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.warn('No se pudo cargar el perfil del backend:', err?.message);
    } finally {
      setLoading(false);
    }
  }, [token, updateUserProfile]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      void fetchProfile();
    }
  }, [isOpen, initialTab, fetchProfile]);

  // Guardar datos generales de perfil
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (displayName.trim().length < 2) {
      showToast('error', 'El nombre debe contener al menos 2 caracteres.');
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateUserProfilePayload = {
        displayName: displayName.trim(),
        bio: bio.trim(),
        timezone,
        locale,
      };

      const updated = await UserProfileService.updateProfile(payload, token);
      setProfileData(updated);
      updateUserProfile({
        fullName: updated.displayName,
      });
      showToast('success', '¡Perfil actualizado con éxito!');
    } catch (err: any) {
      showToast('error', err?.message || 'Error al actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  // Guardar avatar oficial
  const handleSelectAvatar = async (avatar: KodaAvatarItem) => {
    setSelectedAvatarUrl(avatar.avatarUrl);
    if (!token) {
      updateUserProfile({ avatarUrl: avatar.avatarUrl });
      showToast('success', `Avatar cambiado a ${avatar.name}`);
      return;
    }

    setSaving(true);
    try {
      const updated = await UserProfileService.updateProfile(
        { avatarUrl: avatar.avatarUrl },
        token
      );
      setProfileData(updated);
      updateUserProfile({ avatarUrl: updated.avatarUrl || avatar.avatarUrl });
      showToast('success', `¡Avatar ${avatar.name} activado con éxito!`);
    } catch (err: any) {
      showToast('error', err?.message || 'Error al guardar el nuevo avatar.');
    } finally {
      setSaving(false);
    }
  };

  // Subir foto personalizada
  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Por favor selecciona un archivo de imagen válido.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast('error', 'La imagen no debe superar los 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSelectedAvatarUrl(result);
        updateUserProfile({ avatarUrl: result });
        showToast(
          'info',
          'Foto personalizada cargada en tu perfil local. La sincronización en la nube se activará cuando el backend habilite el almacenamiento de avatares.'
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // Guardar preferencias de estudio
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const payload: UpdateUserProfilePayload = {
        dailyGoalMinutes,
        dailyGoalId,
        experienceLevel,
        learningStyle,
      };
      const updated = await UserProfileService.updateProfile(payload, token);
      setProfileData(updated);
      updateUserProfile({
        dailyGoalMinutes: updated.dailyGoalMinutes,
        experienceLevel: updated.experienceLevel,
        learningStyle: updated.learningStyle,
      });
      showToast('success', 'Preferencias de estudio guardadas.');
    } catch (err: any) {
      showToast('error', err?.message || 'Error al actualizar preferencias.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentAvatar =
    KODA_AVATARS.find((a) => a.avatarUrl === selectedAvatarUrl) || {
      name: 'Foto Personalizada',
      subtitle: 'Imagen subida por el usuario',
      description: 'Tu fotografía personalizada activa en Koda.',
      avatarUrl: selectedAvatarUrl,
    };

  const totalStudyHours = profileData
    ? (profileData.totalStudyTimeSeconds / 3600).toFixed(1)
    : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex h-[85vh] max-h-[720px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/95 shadow-2xl backdrop-blur-2xl md:flex-row"
      >
        {/* Sidebar Tabs */}
        <aside className="flex flex-shrink-0 flex-row border-b border-slate-800 bg-slate-950/50 p-3 md:w-64 md:flex-col md:border-b-0 md:border-r md:p-4">
          {/* Header perfil en sidebar */}
          <div className="hidden items-center gap-3 pb-4 md:flex">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-amber-500/50 bg-slate-800 p-0.5 shadow-md">
              <img
                src={selectedAvatarUrl}
                alt={displayName}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/avatars/koda-classic.svg';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-slate-100 text-sm">{displayName || 'Estudiante'}</h3>
              <p className="truncate font-mono text-xs text-slate-400">
                Nivel {profileData?.currentLevel || user?.level || 1} · {profileData?.totalXp || user?.totalXp || 0} XP
              </p>
            </div>
          </div>

          <div className="hidden h-px w-full bg-slate-800 md:block mb-3" />

          {/* Botones de Pestañas */}
          <nav className="flex flex-1 flex-row gap-1 overflow-x-auto md:flex-col md:overflow-x-visible">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <User className="h-4 w-4" weight={activeTab === 'profile' ? 'fill' : 'regular'} />
              <span>Mi Perfil</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('avatars')}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'avatars'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Sparkle className="h-4 w-4" weight={activeTab === 'avatars' ? 'fill' : 'regular'} />
              <span>Selector de Avatares</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'preferences'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Compass className="h-4 w-4" weight={activeTab === 'preferences' ? 'fill' : 'regular'} />
              <span>Metas y Estudio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'appearance'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Palette className="h-4 w-4" weight={activeTab === 'appearance' ? 'fill' : 'regular'} />
              <span>Fondo y Temas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'metrics'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Trophy className="h-4 w-4" weight={activeTab === 'metrics' ? 'fill' : 'regular'} />
              <span>Métricas en Vivo</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="relative flex-1 flex flex-col min-w-0 overflow-y-auto p-4 sm:p-6">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar configuración"
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/60 bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* TAB 1: MI PERFIL (CRUD) */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Mi Perfil</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Actualiza tu información personal y datos de contacto en la plataforma.
                </p>
              </div>

              <form onSubmit={handleSaveGeneral} className="space-y-4">
                {/* Nombre a mostrar */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                    Nombre o Alias Público *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    placeholder="Ej. Dylan Gamero"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Correo (Read-only) */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-3.5 py-2.5 text-sm text-slate-400">
                    <span>{user?.email || profileData?.email || 'estudiante@koda.academy'}</span>
                    <span className="text-xs text-slate-500 font-mono">Principal</span>
                  </div>
                </div>

                {/* Biografía */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono font-medium text-slate-300">Biografía</label>
                    <span className="text-[11px] font-mono text-slate-500">{bio.length}/500</span>
                  </div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    rows={3}
                    placeholder="Cuéntanos sobre tus proyectos y tecnologías predilectas..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Zona Horaria y Locale */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                      Zona Horaria
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 focus:border-amber-500"
                    >
                      <option value="America/Bogota">Bogotá, Lima, Quito (UTC-5)</option>
                      <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
                      <option value="America/Santiago">Santiago de Chile (UTC-4)</option>
                      <option value="America/Argentina/Buenos_Aires">Buenos Aires (UTC-3)</option>
                      <option value="Europe/Madrid">Madrid, España (UTC+1)</option>
                      <option value="America/New_York">New York (UTC-5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                      Idioma / Región
                    </label>
                    <select
                      value={locale}
                      onChange={(e) => setLocale(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 focus:border-amber-500"
                    >
                      <option value="es-CO">Español (Colombia)</option>
                      <option value="es-MX">Español (México)</option>
                      <option value="es-ES">Español (España)</option>
                      <option value="es-CL">Español (Chile)</option>
                      <option value="es-AR">Español (Argentina)</option>
                    </select>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <WipeButton type="submit" disabled={saving}>
                    {saving ? 'Guardando Cambios…' : 'Guardar Cambios'}
                  </WipeButton>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SELECTOR DE AVATARES Y SUBIR FOTO */}
          {activeTab === 'avatars' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Selector de Avatar</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Elige un avatar oficial de Koda o sube una fotografía personalizada de tu equipo.
                </p>
              </div>

              {/* Preview Avatar Activo */}
              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="relative h-16 w-16 flex-shrink-0 rounded-2xl border border-amber-400 bg-slate-800 p-1 shadow-lg overflow-hidden">
                  <img
                    src={currentAvatar.avatarUrl}
                    alt={currentAvatar.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{currentAvatar.name}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{currentAvatar.subtitle}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{currentAvatar.description}</p>
                </div>
              </div>

              {/* Opción de Subir Foto Personalizada */}
              <div className="rounded-2xl border border-dashed border-slate-700/80 bg-slate-950/40 p-4 transition-colors hover:border-amber-500/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-amber-400">
                      <UploadSimple className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">Subir foto personalizada</h4>
                      <p className="text-[11px] text-slate-400">Formatos PNG, JPG, WEBP o SVG (máx. 3MB)</p>
                    </div>
                  </div>
                  <label className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer">
                    <UploadSimple className="h-3.5 w-3.5" />
                    <span>Seleccionar foto</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleCustomPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Grid de 8 Avatares Oficiales */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-medium text-slate-300 block">
                  Avatares Oficiales de Koda
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {KODA_AVATARS.map((avatar) => {
                    const isSelected = selectedAvatarUrl === avatar.avatarUrl;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => handleSelectAvatar(avatar)}
                        className={`group relative flex flex-col items-center rounded-2xl border p-3 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-sm">
                            <Check className="h-3 w-3" weight="bold" />
                          </span>
                        )}

                        <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-xl bg-slate-900/80 p-1 transition-transform group-hover:scale-105">
                          <img
                            src={avatar.avatarUrl}
                            alt={avatar.name}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <span className="font-semibold text-xs text-slate-100 group-hover:text-amber-300 transition-colors">
                          {avatar.name}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {avatar.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PREFERENCIAS DE ESTUDIO */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Metas y Ritmo Pedagógico</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configura tu compromiso diario para calibrar recordatorios y rachas.
                </p>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-5">
                {/* Minutos diarios */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-2">
                    Meta Diaria de Estudio: <strong className="text-amber-400">{dailyGoalMinutes} minutos</strong>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[5, 10, 15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDailyGoalMinutes(mins)}
                        className={`rounded-xl border py-2 text-xs font-mono font-bold transition-colors cursor-pointer ${
                          dailyGoalMinutes === mins
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                            : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ritmo de estudio */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-2">
                    Ritmo de Aprendizaje
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'casual', label: 'Casual', desc: '5 min/día · Relajado' },
                      { id: 'regular', label: 'Regular', desc: '10-15 min/día · Recomendado' },
                      { id: 'focused', label: 'Enfocado', desc: '30 min/día · Avance ágil' },
                      { id: 'intense', label: 'Intenso', desc: '60 min/día · Modo bootcamp' },
                    ].map((pace) => (
                      <button
                        key={pace.id}
                        type="button"
                        onClick={() => setDailyGoalId(pace.id as any)}
                        className={`rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                          dailyGoalId === pace.id
                            ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                            : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="block font-semibold text-xs text-slate-100">{pace.label}</span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">{pace.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel declarado */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                    Nivel de Experiencia
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-xs text-slate-200 focus:border-amber-500"
                  >
                    <option value="beginner">Principiante (Desde cero)</option>
                    <option value="elementary">Elemental (Conocimientos básicos)</option>
                    <option value="intermediate">Intermedio (Proyectos previos)</option>
                    <option value="advanced">Avanzado (Profesional)</option>
                  </select>
                </div>

                {/* Estilo pedagógico */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                    Estilo de Aprendizaje Preferido
                  </label>
                  <select
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-xs text-slate-200 focus:border-amber-500"
                  >
                    <option value="hands-on">Práctico (Aprender escribiendo código)</option>
                    <option value="guided">Guiado paso a paso</option>
                    <option value="projects">Basado en proyectos reales</option>
                    <option value="gamified">Gamificado (Desafíos y rachas)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <WipeButton type="submit" disabled={saving}>
                    {saving ? 'Guardando...' : 'Actualizar Metas'}
                  </WipeButton>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: FONDO Y TEMAS DISPONIBLES */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Personalización Visual y Fondos</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Elige la atmósfera del roadmap: efectos climáticos, partículas y densidad estelar.
                </p>
              </div>

              {/* Presets de fondo */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-medium text-slate-300">
                  Ambiente de Fondo del Roadmap
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {[
                    { id: 'cosmic-stars', name: 'Cielo Cósmico', desc: 'Estrellas y constelaciones Pixi' },
                    { id: 'fireflies', name: 'Luciérnagas', desc: 'Partículas de luz verde del bosque' },
                    { id: 'embers', name: 'Brasas de Forja', desc: 'Chispas ardientes flotantes naranja' },
                    { id: 'dust', name: 'Polvo Espacial', desc: 'Destellos dorados flotantes' },
                    { id: 'matrix-rain', name: 'Lluvia Matrix', desc: 'Lluvia suave de código terminal' },
                    { id: 'kepler-orbit', name: 'Órbita Kepleriana', desc: 'Espiral kepleriana en ASCII' },
                  ].map((preset) => {
                    const active = backgroundPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setBackgroundPreset(preset.id as BackgroundPreset)}
                        className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          active
                            ? 'border-amber-400 bg-amber-500/20 shadow-md shadow-amber-500/10'
                            : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-slate-100">{preset.name}</span>
                          {active && <Check className="h-4 w-4 text-amber-400" weight="bold" />}
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-1">{preset.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Densidad de estrellas */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-medium text-slate-300">
                  Densidad de Estrellas
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'low', label: 'Baja (30)' },
                    { id: 'medium', label: 'Media (70)' },
                    { id: 'high', label: 'Alta (130)' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setStarDensity(d.id as StarDensity)}
                      className={`flex-1 rounded-xl border py-2 text-xs font-mono font-medium transition-colors cursor-pointer ${
                        starDensity === d.id
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paleta de acento */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-medium text-slate-300">
                  Color de Acento
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'amber', name: 'Ámbar Koda', color: '#f59e0b' },
                    { id: 'cyan', name: 'Cian Neón', color: '#06b6d4' },
                    { id: 'violet', name: 'Púrpura Cuántico', color: '#8b5cf6' },
                    { id: 'emerald', name: 'Esmeralda Hacker', color: '#10b981' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAccentTheme(c.id as AccentTheme)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 transition-colors cursor-pointer ${
                        accentTheme === c.id
                          ? 'border-slate-200 bg-slate-800'
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-xs text-slate-200 font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Efectos de cursor */}
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
                <div>
                  <span className="font-semibold text-xs text-slate-200 block">
                    Efectos interactivos con el ratón
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Ondas y chispas reactivas al mover el cursor por el cielo
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setInteractiveCursor(!interactiveCursor)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    interactiveCursor ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      interactiveCursor ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: MÉTRICAS EN TIEMPO REAL */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Métricas en Tiempo Real</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Telemetría oficial de aprendizaje sincronizada con el backend.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void fetchProfile()}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowsClockwise className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sincronizar</span>
                </button>
              </div>

              {/* Grid de Métricas */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
                    <Lightning className="h-4 w-4" weight="fill" />
                    XP TOTAL
                  </div>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">
                    {profileData?.totalXp ?? user?.totalXp ?? 0}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Puntos acumulados</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-orange-400 text-xs font-mono mb-1">
                    <Trophy className="h-4 w-4" weight="fill" />
                    NIVEL ACTUAL
                  </div>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">
                    Nivel {profileData?.currentLevel ?? user?.level ?? 1}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Rango pedagógico</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-mono mb-1">
                    <Fire className="h-4 w-4" weight="fill" />
                    RACHA ACTIVA
                  </div>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">
                    {profileData?.currentStreak ?? user?.streak ?? 0} días
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Récord: {profileData?.longestStreak ?? 0} días
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
                    <Clock className="h-4 w-4" weight="fill" />
                    TIEMPO DE ESTUDIO
                  </div>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">
                    {totalStudyHours} h
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Horas en lecciones</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1">
                    <ShieldCheck className="h-4 w-4" weight="fill" />
                    PROTECTORES RACHA
                  </div>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">
                    {profileData?.streakFreezeCount ?? 0}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Vidas de reserva</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-violet-400 text-xs font-mono mb-1">
                    <Sparkle className="h-4 w-4" weight="fill" />
                    CURRÍCULO
                  </div>
                  <div className="text-sm font-bold text-emerald-400 font-mono pt-1">
                    ACTIVO
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Ruta sincronizada</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </motion.div>

      {/* Floating toast notification */}
      <ProfileToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default ProfileSettingsModal;
