'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-center text-slate-100">
      <Image
        src="/brand/koda-mascot-cartoon-2d-transparent.png"
        alt="Koda pidiendo disculpas por el error"
        width={160}
        height={160}
        className="object-contain select-none"
      />
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Algo falló</p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
          Koda tropezó con un bug
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
          No es tu culpa. Intenta de nuevo o vuelve a la ruta.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[48px] items-center rounded-xl bg-amber-400 px-6 text-sm font-bold text-slate-950 hover:bg-amber-300"
        >
          Reintentar
        </button>
        <Link
          href="/?landing=true"
          className="inline-flex min-h-[48px] items-center rounded-xl border border-slate-700 px-6 text-sm font-bold text-white hover:border-amber-400/50"
        >
          Volver a la landing
        </Link>
      </div>
    </div>
  );
}
