/* Ejecuta Python en un Web Worker usando Pyodide.
 * Se aísla en un worker para poder cancelar bucles infinitos desde el hilo principal.
 */
const PYODIDE_VERSION = 'v0.26.2';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

let pyodidePromise = null;

function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      importScripts(`${PYODIDE_BASE}pyodide.js`);
      return self.loadPyodide({ indexURL: PYODIDE_BASE });
    })();
  }
  return pyodidePromise;
}

self.onmessage = async (event) => {
  const { id, code } = event.data || {};
  let output = '';
  let error = '';

  try {
    const pyodide = await getPyodide();

    pyodide.setStdout({
      batched: (text) => {
        output += `${text}\n`;
      },
    });
    pyodide.setStderr({
      batched: (text) => {
        error += `${text}\n`;
      },
    });

    // Namespace limpio por ejecución: evita que las variables de un intento
    // anterior se filtren al siguiente.
    const dict = pyodide.globals.get('dict');
    const namespace = dict();
    try {
      await pyodide.runPythonAsync(code, { globals: namespace });
    } finally {
      namespace.destroy();
    }
  } catch (err) {
    error = String((err && err.message) || err);
  }

  self.postMessage({ id, output, error: error || undefined });
};
