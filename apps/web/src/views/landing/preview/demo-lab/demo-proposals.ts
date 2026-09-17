'use client';

import { DemoId } from '../MiniLessonPreview';

export interface DemoDef {
  id: DemoId;
  num: number;
  label: string;
  blurb: string;
}

export const DEMOS: DemoDef[] = [
  { id: 'p1', num: 1, label: 'Status typewriter', blurb: 'El estado [koda] se escribe letra a letra con cursor ámbar.' },
  { id: 'p2', num: 2, label: 'Header ejecutable', blurb: 'Bloque con barra $ python modulo_01.py y números de línea.' },
  { id: 'p3', num: 3, label: 'Diff opciones', blurb: 'Resalta lo que cambia entre opciones: comillas, coma, espacios.' },
  { id: 'p4', num: 4, label: 'Feedback por letra', blurb: 'La letra elegida muestra [✓] o [✗] con borde de veredicto.' },
  { id: 'p5', num: 5, label: 'Contador intentos', blurb: 'Línea attempt 01/03 · streak 07 bajo el status.' },
  { id: 'p6', num: 6, label: 'Pistas x3 niveles', blurb: 'Pista progresiva 1/3 con botón $ koda hint --next, sin spoilers.' },
  { id: 'p7', num: 7, label: 'Botón comando', blurb: 'Comprobar como comando: $ check --answer B.' },
  { id: 'p8', num: 8, label: 'Success consola', blurb: 'Éxito como output: > PASS +5 XP y $ koda next.' },
  { id: 'p9', num: 9, label: 'Teclado A–D', blurb: 'Letras seleccionan, Enter comprueba. Sin ratón.' },
  { id: 'p10', num: 10, label: 'Why colapsable', blurb: 'La explicación vive en details > why --expand.' },
  { id: 'p11', num: 11, label: 'Confetti ASCII', blurb: 'Celebración con lluvia de caracteres 01>{}; en canvas.' },
  { id: 'p12', num: 12, label: 'Mobile invertido', blurb: 'Código primero y opciones compactas estilo shell.' },
];
