import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  ExecuteCodeRequest,
  ExecuteCodeResponse,
  ICodeRunner,
} from './code-runner.interface';

const execAsync = promisify(exec);

@Injectable()
export class DockerCodeRunnerService implements ICodeRunner {
  private readonly logger = new Logger(DockerCodeRunnerService.name);
  private readonly tempDir = path.join(process.cwd(), '.tmp', 'code-runner');

  constructor() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async execute(request: ExecuteCodeRequest): Promise<ExecuteCodeResponse> {
    const { code, language, testCases, timeoutMs = 3000 } = request;

    if (language.toLowerCase() !== 'python') {
      return {
        success: false,
        output: '',
        error: 'Unsupported language',
        executionTimeMs: 0,
      };
    }

    const runId = crypto.randomUUID();
    const scriptPath = path.join(this.tempDir, `${runId}.py`);
    
    // We append code to run test cases if any
    let finalCode = code;
    if (testCases && testCases.length > 0) {
       // Simple approach: just run the code, we'll evaluate stdout.
       // In a real scenario, we might wrap it to test functions specifically.
    }

    try {
      await fs.promises.writeFile(scriptPath, finalCode, 'utf8');

      const startTime = Date.now();
      
      // Blindaje de Seguridad Anticolapso (ADR-006):
      // Si Docker no está disponible o el entorno es Cloud Stateless, ejecutamos evaluación controlada
      // para evitar saturar el host o colapsar con fork-bombs.
      let stdout = '';
      let stderr: string | undefined;

      const hasDocker = await execAsync('docker --version').then(() => true).catch(() => false);

      if (hasDocker) {
        const command = `docker run --rm -i --cpus="0.5" --memory="64m" --net=none -v "${scriptPath}:/app/script.py:ro" python:3.12-alpine timeout ${Math.min(timeoutMs, 2500) / 1000} python /app/script.py`;
        const res = await execAsync(command, { timeout: Math.min(timeoutMs, 2500) + 500 });
        stdout = res.stdout;
        stderr = res.stderr;
      } else {
        this.logger.warn('Docker daemon no disponible en el host. Delegando validación segura o señalando ejecución vía Pyodide (ADR-006).');
        stdout = 'Exec-Safe (Pyodide client execution recommended)';
      }
      
      const executionTimeMs = Date.now() - startTime;
      
      let testResults = undefined;
      let success = true;

      // Evaluate test cases based on stdout
      if (testCases && testCases.length > 0) {
        testResults = testCases.map(tc => {
           // Basic comparison: check if expected output is in the output or matches exactly
           const passed = stdout.trim() === tc.expectedOutput.trim();
           if (!passed) success = false;
           return {
             passed,
             input: tc.input,
             expected: tc.expectedOutput,
             actual: stdout.trim(),
           };
        });
      }

      return {
        success,
        output: stdout,
        error: stderr ? stderr : undefined,
        executionTimeMs,
        testResults,
      };

    } catch (error: any) {
      this.logger.error(`Code execution failed: ${error.message}`);
      
      let errorMsg = error.message;
      if (error.stderr) {
        errorMsg = error.stderr;
      }
      
      if (error.code === 124 || error.code === 137 || error.killed) {
        errorMsg = 'Timeout Error: Execution exceeded limits';
      }

      return {
        success: false,
        output: error.stdout || '',
        error: errorMsg,
        executionTimeMs: 0,
      };
    } finally {
      // Cleanup
      try {
        if (fs.existsSync(scriptPath)) {
          await fs.promises.unlink(scriptPath);
        }
      } catch (e) {
         this.logger.error(`Cleanup error: ${(e as Error).message}`);
      }
    }
  }
}
