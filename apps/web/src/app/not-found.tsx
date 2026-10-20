import Link from 'next/link';
import { KodaMascot } from '@/components/brand/KodaMascot';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-center text-slate-100">
      <KodaMascot
        state="sad"
        size={160}
        animate="float"
        glow
      />
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Error 404</p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
          Te saliste del roadmap
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
          Koda tampoco encuentra esta página. Vuelve a la ruta y sigue ganando XP.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/?landing=true"
          className="inline-flex min-h-[48px] items-center rounded-xl bg-amber-400 px-6 text-sm font-bold text-slate-950 hover:bg-amber-300"
        >
          Volver a la landing
        </Link>
        <Link
          href="/register"
          className="inline-flex min-h-[48px] items-center rounded-xl border border-slate-700 px-6 text-sm font-bold text-white hover:border-amber-400/50"
        >
          Comenzar gratis
        </Link>
      </div>
    </div>
  );
}
