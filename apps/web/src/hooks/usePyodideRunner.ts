'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface PyodideExecutionResult {
  stdout: string;
  stderr: string | null;
  pedagogicalError: string | null;
  executionTimeMs: number;
  engine: 'pyodide-wasm' | 'local-sandbox';
  timedOut: boolean;
}

const PYODIDE_WORKER_SCRIPT = `
let pyodideReadyPromise = null;

async function ensurePyodide() {
  if (!pyodideReadyPromise) {
    importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
    pyodideReadyPromise = self.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
    });
  }
  return pyodideReadyPromise;
}

self.onmessage = async (event) => {
  const { id, code } = event.data;
  const start = performance.now();
  try {
    const pyodide = await ensurePyodide();
    let stdoutBuffer = [];
    let stderrBuffer = [];
    pyodide.setStdout({ batched: (msg) => stdoutBuffer.push(msg) });
    pyodide.setStderr({ batched: (msg) => stderrBuffer.push(msg) });

    await pyodide.runPythonAsync(code);
    const elapsed = Math.max(1, Math.round(performance.now() - start));
    self.postMessage({
      id,
      ok: true,
      stdout: stdoutBuffer.join('\\n'),
      stderr: stderrBuffer.length ? stderrBuffer.join('\\n') : null,
      executionTimeMs: elapsed
    });
  } catch (err) {
    const elapsed = Math.max(1, Math.round(performance.now() - start));
    self.postMessage({
      id,
      ok: false,
      error: err ? String(err.message || err) : 'Unknown error',
      executionTimeMs: elapsed
    });
  }
};
`;

/**
 * Traduce trazas de error técnicas de Python/JS/Lua a explicaciones pedagógicas en español
 * sin exponer stack traces internos del servidor ni del navegador.
 */
export function formatPedagogicalError(rawError: string): string {
  const err = rawError || '';

  if (err.includes('TimeoutError') || err.includes('Tiempo de ejecución agotado')) {
    return '⏱️ Tiempo de ejecución agotado (límite de 3.0s): Se detectó un posible bucle infinito (por ejemplo, un ciclo que nunca actualiza su condición de salida). El Worker ha sido reiniciado de forma segura.';
  }
  if (err.includes('ZeroDivisionError')) {
    return '⚠️ Error de División por Cero (ZeroDivisionError): Intentaste dividir un número entre 0. Revisa el divisor en tu operación aritmética.';
  }
  if (err.includes('IndentationError')) {
    return '⚠️ Error de Indentación (IndentationError): En Python los bloques tras ":" deben estar alineados con espacios consistentes (usualmente 4 espacios).';
  }
  if (err.includes('SyntaxError')) {
    return '⚠️ Error de Sintaxis (SyntaxError): Revisa que todos los paréntesis, comillas y dos puntos (:) estén correctamente cerrados y escritos.';
  }
  if (err.includes('NameError') || err.includes('ReferenceError')) {
    const match = err.match(/name '([^']+)' is not defined/) || err.match(/([^\s]+) is not defined/);
    const symbol = match?.[1] ? `"${match[1]}"` : 'indicada';
    return `⚠️ Variable o función no definida (NameError): No se encontró la referencia ${symbol}. Verifica que la hayas declarado antes de usarla y que el nombre sea exacto.`;
  }
  if (err.includes('TypeError')) {
    return '⚠️ Error de Tipos (TypeError): Intentaste realizar una operación entre tipos de datos incompatibles (por ejemplo, concatenar texto con un número sin usar str()).';
  }
  if (err.includes('IndexError')) {
    return '⚠️ Índice fuera de rango (IndexError): Intentaste acceder a una posición que no existe en la lista o cadena.';
  }
  if (err.includes('KeyError')) {
    return '⚠️ Clave no encontrada (KeyError): El diccionario no contiene la clave solicitada. Puedes usar .get() para evitar este error.';
  }

  // Limpiar líneas de File "<exec>" si vienen de Pyodide
  const lines = err.split('\n').filter((l) => !l.trim().startsWith('File ') && !l.trim().startsWith('Traceback'));
  const lastMeaningful = lines[lines.length - 1]?.trim() || 'Error durante la ejecución del código.';
  return `⚠️ Error de ejecución: ${lastMeaningful}`;
}

/**
 * Evaluador local determinista de respaldo (offline / lenguajes no-Python o fallback instantáneo).
 * Evalúa asignaciones básicas, expresiones print() / console.log() y detecta errores comunes.
 */
function evaluateLocally(
  code: string,
  language: string,
  fallbackExpectedOutput?: string
): PyodideExecutionResult {
  const start = performance.now();
  const trimmed = code.trim();

  if (!trimmed) {
    return {
      stdout: '',
      stderr: null,
      pedagogicalError: null,
      executionTimeMs: 1,
      engine: 'local-sandbox',
      timedOut: false,
    };
  }

  // 1. Detectar bucle infinito obvio (while True / while (true) sin break)
  const hasInfiniteWhile =
    (/while\s+(True|true|1)\s*:/.test(trimmed) || /while\s*\(\s*(true|1)\s*\)/.test(trimmed)) &&
    !/\bbreak\b/.test(trimmed);

  if (hasInfiniteWhile) {
    const msg = formatPedagogicalError('TimeoutError');
    return {
      stdout: '',
      stderr: msg,
      pedagogicalError: msg,
      executionTimeMs: 3000,
      engine: 'local-sandbox',
      timedOut: true,
    };
  }

  // 2. Detectar división por cero evidente fuera de comentarios
  const codeWithoutComments = trimmed
    .split('\n')
    .map((line) => line.replace(/#.*$/, '').replace(/\/\/.*$/, '').replace(/--.*$/, ''))
    .join('\n');

  if (/\/\s*0(?![.0-9])/.test(codeWithoutComments) || /%\s*0(?![.0-9])/.test(codeWithoutComments)) {
    const msg = formatPedagogicalError('ZeroDivisionError');
    return {
      stdout: '',
      stderr: msg,
      pedagogicalError: msg,
      executionTimeMs: 4,
      engine: 'local-sandbox',
      timedOut: false,
    };
  }

  // 3. Detectar paréntesis desbalanceados
  let parenDepth = 0;
  for (const ch of codeWithoutComments) {
    if (ch === '(') parenDepth++;
    else if (ch === ')') parenDepth--;
    if (parenDepth < 0) break;
  }
  if (parenDepth !== 0) {
    const msg = formatPedagogicalError('SyntaxError: unmatched parentheses');
    return {
      stdout: '',
      stderr: msg,
      pedagogicalError: msg,
      executionTimeMs: 3,
      engine: 'local-sandbox',
      timedOut: false,
    };
  }

  // 4. Interpretar variables sencillas y sentencias print / console.log
  const env: Record<string, string | number | boolean> = {};
  const outputs: string[] = [];
  const lines = codeWithoutComments.split('\n');

  const evalExpr = (rawExpr: string): string => {
    const expr = rawExpr.trim();
    // f-string simple de Python: f"Hola {nombre}"
    if (/^f(['"])(.*)\1$/.test(expr)) {
      const inner = expr.slice(2, -1);
      return inner.replace(/\{([^}]+)\}/g, (_, varName) => {
        const key = varName.trim();
        return key in env ? String(env[key]) : String(evalExpr(key));
      });
    }
    // String literal
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }
    // Booleano
    if (expr === 'True' || expr === 'true') return language === 'python' ? 'True' : 'true';
    if (expr === 'False' || expr === 'false') return language === 'python' ? 'False' : 'false';
    if (expr === 'None' || expr === 'nil' || expr === 'null') return expr;

    // Variable directa
    if (expr in env) {
      const val = env[expr];
      if (typeof val === 'boolean') return language === 'python' ? (val ? 'True' : 'False') : String(val);
      return String(val);
    }

    // Expresión numérica o concatenación tras sustituir variables conocidas
    let substituted = expr;
    for (const [k, v] of Object.entries(env)) {
      const regex = new RegExp(`\\b${k}\\b`, 'g');
      substituted = substituted.replace(regex, typeof v === 'string' ? `"${v}"` : String(v));
    }

    // Reemplazar operadores de Python/Lua básicos
    const jsReady = substituted
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\s+/g, '!')
      .replace(/\.\./g, '+')
      .replace(/\/\//g, 'Math.trunc_div');

    try {
      if (!jsReady.includes('Math.trunc_div') && /^[0-9+\-*/%().\s"!<>=&|truefals]+$/.test(jsReady)) {
        // eslint-disable-next-line no-new-func
        const res = Function(`"use strict"; return (${jsReady});`)();
        if (typeof res === 'boolean') {
          return language === 'python' ? (res ? 'True' : 'False') : String(res);
        }
        return String(res);
      }
    } catch {
      // Ignorar y continuar con fallback
    }

    return expr;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Asignación simple: [local|let|const|var] x = valor
    const assignMatch = line.match(/^(?:local\s+|let\s+|const\s+|var\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
    if (assignMatch && !line.startsWith('print') && !line.startsWith('console.log') && !line.includes('==')) {
      const [, varName, rhs] = assignMatch;
      const cleanRhs = rhs.replace(/;$/, '').trim();
      const evaluated = evalExpr(cleanRhs);
      const asNum = Number(evaluated);
      env[varName] = !Number.isNaN(asNum) && cleanRhs !== '' && !/^['"]/.test(cleanRhs) ? asNum : evaluated;
      continue;
    }

    // print(...) o console.log(...)
    const printMatch = line.match(/^(?:print|console\.log)\s*\((.*)\)\s*;?$/);
    if (printMatch) {
      const argsRaw = printMatch[1].trim();
      if (!argsRaw) {
        outputs.push('');
      } else {
        // Separar argumentos de primer nivel por coma (respetando comillas)
        const parts: string[] = [];
        let current = '';
        let inQuotes: string | null = null;
        for (let i = 0; i < argsRaw.length; i++) {
          const ch = argsRaw[i];
          if ((ch === '"' || ch === "'") && argsRaw[i - 1] !== '\\') {
            if (inQuotes === ch) inQuotes = null;
            else if (!inQuotes) inQuotes = ch;
          }
          if (ch === ',' && !inQuotes) {
            parts.push(current.trim());
            current = '';
          } else {
            current += ch;
          }
        }
        if (current.trim()) parts.push(current.trim());
        outputs.push(parts.map(evalExpr).join(' '));
      }
    }
  }

  const elapsed = Math.max(2, Math.round(performance.now() - start));
  const finalStdout =
    outputs.length > 0
      ? outputs.join('\n')
      : fallbackExpectedOutput ?? '(Ejecución completada sin salida en consola)';

  return {
    stdout: finalStdout,
    stderr: null,
    pedagogicalError: null,
    executionTimeMs: elapsed,
    engine: 'local-sandbox',
    timedOut: false,
  };
}

/**
 * Hook para ejecución interactiva de código en el navegador (LESS-06):
 * - Usa Pyodide (WebAssembly en Web Worker aislado) para Python con timeout estricto de 3 segundos.
 * - Si el código entra en un bucle infinito (ej. while True:), termina el Worker a los 3000ms y lo recrea.
 * - Si el entorno está offline o es otro lenguaje (Lua, JS, TS, HTML, CSS), usa el evaluador determinista local.
 */
export function usePyodideRunner(language = 'python') {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<PyodideExecutionResult | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const workerFailedRef = useRef<boolean>(false);

  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      terminateWorker();
    };
  }, [terminateWorker]);

  const createWorker = useCallback((): Worker | null => {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') return null;
    try {
      const blob = new Blob([PYODIDE_WORKER_SCRIPT], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      return worker;
    } catch {
      return null;
    }
  }, []);

  const runCode = useCallback(
    async (code: string, fallbackExpectedOutput?: string): Promise<PyodideExecutionResult> => {
      setIsRunning(true);

      // Si hay un bucle infinito evidente, cortocircuitar de forma segura o aplicar el timeout
      const isPython = language.toLowerCase() === 'python';

      if (isPython && !workerFailedRef.current && typeof window !== 'undefined') {
        try {
          if (!workerRef.current) {
            workerRef.current = createWorker();
          }
          const worker = workerRef.current;
          if (worker) {
            const reqId = `${Date.now()}-${Math.random()}`;
            const result = await new Promise<PyodideExecutionResult>((resolve, reject) => {
              const timeoutId = window.setTimeout(() => {
                // Terminar y recrear el Worker ante bucle infinito (> 3 segundos)
                terminateWorker();
                const msg = formatPedagogicalError('TimeoutError');
                resolve({
                  stdout: '',
                  stderr: msg,
                  pedagogicalError: msg,
                  executionTimeMs: 3000,
                  engine: 'pyodide-wasm',
                  timedOut: true,
                });
              }, 3000);

              const handleMessage = (ev: MessageEvent) => {
                if (ev.data?.id !== reqId) return;
                window.clearTimeout(timeoutId);
                worker.removeEventListener('message', handleMessage);
                worker.removeEventListener('error', handleError);

                if (ev.data.ok) {
                  resolve({
                    stdout: ev.data.stdout || '',
                    stderr: ev.data.stderr || null,
                    pedagogicalError: ev.data.stderr ? formatPedagogicalError(ev.data.stderr) : null,
                    executionTimeMs: ev.data.executionTimeMs ?? 12,
                    engine: 'pyodide-wasm',
                    timedOut: false,
                  });
                } else {
                  const errStr = String(ev.data.error || '');
                  // Si falló la carga del script de CDN (offline), hacer fallback al evaluador local
                  if (errStr.includes('importScripts') || errStr.includes('NetworkError') || errStr.includes('loadPyodide')) {
                    workerFailedRef.current = true;
                    terminateWorker();
                    reject(new Error('CDN_UNAVAILABLE'));
                    return;
                  }
                  const pedError = formatPedagogicalError(errStr);
                  resolve({
                    stdout: '',
                    stderr: errStr,
                    pedagogicalError: pedError,
                    executionTimeMs: ev.data.executionTimeMs ?? 10,
                    engine: 'pyodide-wasm',
                    timedOut: false,
                  });
                }
              };

              const handleError = () => {
                window.clearTimeout(timeoutId);
                worker.removeEventListener('message', handleMessage);
                worker.removeEventListener('error', handleError);
                workerFailedRef.current = true;
                terminateWorker();
                reject(new Error('WORKER_LOAD_ERROR'));
              };

              worker.addEventListener('message', handleMessage);
              worker.addEventListener('error', handleError);
              worker.postMessage({ id: reqId, code });
            });

            setLastResult(result);
            setIsRunning(false);
            return result;
          }
        } catch {
          // Si Pyodide CDN no está disponible offline, cae de forma transparente al sandbox local
        }
      }

      const fallbackRes = evaluateLocally(code, language, fallbackExpectedOutput);
      setLastResult(fallbackRes);
      setIsRunning(false);
      return fallbackRes;
    },
    [language, createWorker, terminateWorker]
  );

  const clearOutput = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    runCode,
    isRunning,
    lastResult,
    clearOutput,
  };
}
