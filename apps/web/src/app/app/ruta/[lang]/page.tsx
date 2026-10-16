'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';

export default function RutaLangRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <KodaLoadingScreen
      title="Cargando tu ruta..."
      subtitle="Redirigiendo a tu espacio de aprendizaje..."
      terminalHint="> ruta :: redirigiendo a /"
    />
  );
}
