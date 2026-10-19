// Runner de Python en el navegador (Pyodide dentro de un Web Worker).
// El worker se reutiliza entre ejecuciones y se reinicia si una se pasa de tiempo.

export interface PythonRunResult {
  output: string;
  error?: string;
  executionTimeMs: number;
}

const DEFAULT_TIMEOUT_MS = 6000;
const WORKER_URL = '/pyodide-worker.js';

interface PendingRun {
  resolve: (result: PythonRunResult) => void;
  timer: ReturnType<typeof setTimeout>;
  startedAt: number;
}

let worker: Worker | null = null;
let sequence = 0;
const pending = new Map<number, PendingRun>();

function resolveAllWithError(message: string): void {
  for (const [id, entry] of pending) {
    clearTimeout(entry.timer);
    entry.resolve({ output: '', error: message, executionTimeMs: 0 });
    pending.delete(id);
  }
}

function getWorker(): Worker | null {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') return null;

  if (!worker) {
    try {
      worker = new Worker(WORKER_URL);
    } catch {
      return null;
    }

    worker.onmessage = (event: MessageEvent) => {
      const { id, output, error } = event.data ?? {};
      const entry = pending.get(id);
      if (!entry) return;
      clearTimeout(entry.timer);
      pending.delete(id);
      entry.resolve({
        output: typeof output === 'string' ? output : '',
        error: error || undefined,
        executionTimeMs: Date.now() - entry.startedAt,
      });
    };

    worker.onerror = () => {
      resolveAllWithError('No se pudo ejecutar Python en el navegador.');
      worker?.terminate();
      worker = null;
    };
  }

  return worker;
}

/** Ejecuta un fragmento de Python y devuelve stdout/stderr. */
export function runPython(code: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<PythonRunResult> {
  return new Promise((resolve) => {
    const current = getWorker();
    if (!current) {
      resolve({ output: '', error: 'Este navegador no permite ejecutar Python.', executionTimeMs: 0 });
      return;
    }

    const id = ++sequence;
    const startedAt = Date.now();
    const timer = setTimeout(() => {
      pending.delete(id);
      // Un bucle infinito bloquea al worker: lo reiniciamos por completo.
      current.terminate();
      worker = null;
      resolve({
        output: '',
        error: 'La ejecución tardó demasiado. Revisa si tu código tiene un bucle infinito.',
        executionTimeMs: Date.now() - startedAt,
      });
    }, timeoutMs);

    pending.set(id, { resolve, timer, startedAt });
    current.postMessage({ id, code });
  });
}

/** Precalienta Pyodide (descarga e inicialización) sin ejecutar código. */
export function preloadPython(): void {
  const current = getWorker();
  if (!current) return;

  const id = ++sequence;
  const startedAt = Date.now();
  const timer = setTimeout(() => {
    pending.delete(id);
  }, 30000);

  pending.set(id, { resolve: () => {}, timer, startedAt });
  current.postMessage({ id, code: '' });
}
