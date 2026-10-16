import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface EvaluationCompositionConfig {
  quiz: Record<string, number>;
  exam: Record<string, number>;
  exam_variant?: Record<string, number>;
}

export interface BankQuestion {
  id: string;
  concept_id?: string;
  type: string;
  difficulty?: string;
  prompt: string;
  options?: Array<{ id: string; text: string }>;
  correct_option_id?: string;
  hint?: string;
  code_snippet?: string;
  [key: string]: any;
}

export interface ModuleQuestionBank {
  module_code: string;
  questions: BankQuestion[];
}

// Fallback estático en memoria para Python y Lua (garantiza cero fallo en Cloud Stateless/Docker sin volúmenes)
const FALLBACK_COMPOSITIONS: Record<string, EvaluationCompositionConfig> = {
  python: {
    quiz: {
      single_choice: 3,
      true_false: 2,
      predict_output: 2,
      fill_blank: 1,
      find_error: 1,
      select_code: 1,
    },
    exam: {
      single_choice: 5,
      predict_output: 5,
      fill_blank: 3,
      find_error: 2,
      true_false: 5,
    },
  },
  lua: {
    quiz: {
      single_choice: 3,
      true_false: 2,
      predict_output: 2,
      fill_blank: 1,
      find_error: 1,
      select_code: 1,
    },
    exam: {
      single_choice: 5,
      predict_output: 5,
      fill_blank: 3,
      find_error: 2,
      true_false: 5,
    },
  },
};

const FALLBACK_PYTHON_M01_QUESTIONS: BankQuestion[] = [
  {
    id: 'bnk_py_01_01',
    concept_id: 'print_function',
    type: 'single_choice',
    difficulty: 'easy',
    prompt: '¿Qué función de Python se utiliza para mostrar datos en la consola?',
    options: [
      { id: 'opt_a', text: 'print()' },
      { id: 'opt_b', text: 'echo()' },
      { id: 'opt_c', text: 'display()' },
      { id: 'opt_d', text: 'write()' },
    ],
    correct_option_id: 'opt_a',
    hint: 'Comienza por la letra p.',
  },
  {
    id: 'bnk_py_01_02',
    concept_id: 'variable_assignment',
    type: 'single_choice',
    difficulty: 'easy',
    prompt: '¿Qué operador se utiliza en Python para asignar un valor a una variable?',
    options: [
      { id: 'opt_a', text: '=' },
      { id: 'opt_b', text: '==' },
      { id: 'opt_c', text: '->' },
      { id: 'opt_d', text: ':' },
    ],
    correct_option_id: 'opt_a',
    hint: 'Es un solo signo igual.',
  },
];

@Injectable()
export class ContentBundleService {
  private readonly logger = new Logger(ContentBundleService.name);

  // Caché en memoria pre-calentada
  private readonly compositionsCache = new Map<string, EvaluationCompositionConfig>();
  private readonly banksCache = new Map<string, BankQuestion[]>();

  constructor() {
    this.warmUpCaches();
  }

  /**
   * Pre-carga los contenidos al arrancar el servicio para evitar lecturas de disco
   * sincrónicas durante las peticiones HTTP del usuario.
   */
  private warmUpCaches(): void {
    try {
      const basePath = this.resolveContentPath();
      if (basePath && fs.existsSync(basePath)) {
        this.loadCompositionsFromDisk(basePath);
        this.loadBanksFromDisk(basePath);
        this.logger.log(`ContentBundleService inicializado: ${this.banksCache.size} bancos en memoria.`);
      } else {
        this.logger.warn(
          'Directorio de contenido no encontrado en disco local. Utilizando bundles estáticos en memoria (Modo Cloud Stateless).',
        );
      }
    } catch (err: any) {
      this.logger.error(`Error al precalentar caché de contenidos: ${err.message}. Empleando fallbacks.`);
    }
  }

  private resolveContentPath(): string | null {
    const candidates = [
      path.resolve(process.cwd(), '../../content/languages'),
      path.resolve(process.cwd(), 'content/languages'),
      path.resolve(__dirname, '../../../../content/languages'),
    ];
    return candidates.find((p) => fs.existsSync(p)) || null;
  }

  private loadCompositionsFromDisk(basePath: string): void {
    const languages = ['python', 'lua'];
    for (const lang of languages) {
      const compPath = path.join(basePath, lang, 'config', 'compositions.json');
      if (fs.existsSync(compPath)) {
        try {
          const raw = fs.readFileSync(compPath, 'utf8');
          this.compositionsCache.set(lang, JSON.parse(raw));
        } catch (e) {
          this.logger.warn(`No se pudo leer composiciones para ${lang}: ${(e as Error).message}`);
        }
      }
    }
  }

  private loadBanksFromDisk(basePath: string): void {
    const languages = ['python', 'lua'];
    for (const lang of languages) {
      const modulesDir = path.join(basePath, lang, 'modules');
      if (fs.existsSync(modulesDir)) {
        const dirs = fs.readdirSync(modulesDir, { withFileTypes: true });
        for (const d of dirs) {
          if (d.isDirectory()) {
            const bankPath = path.join(modulesDir, d.name, 'bank.json');
            if (fs.existsSync(bankPath)) {
              try {
                const bankData: ModuleQuestionBank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
                // Indexar por module_code y por slug
                if (bankData.module_code) {
                  this.banksCache.set(`${lang}_${bankData.module_code.toLowerCase()}`, bankData.questions);
                }
                this.banksCache.set(`${lang}_${d.name}`, bankData.questions);
              } catch (e) {
                this.logger.warn(`Error leyendo banco ${bankPath}: ${(e as Error).message}`);
              }
            }
          }
        }
      }
    }
  }

  /**
   * Obtiene la receta de composición para un lenguaje específico.
   * Cero lectura de disco en runtime.
   */
  getComposition(languageSlug: string): EvaluationCompositionConfig {
    const normalized = languageSlug.toLowerCase();
    if (this.compositionsCache.has(normalized)) {
      return this.compositionsCache.get(normalized)!;
    }
    return FALLBACK_COMPOSITIONS[normalized] || FALLBACK_COMPOSITIONS['python'];
  }

  /**
   * Obtiene las preguntas del banco del módulo.
   * Búsqueda por clave normalizada o fallback seguro.
   */
  getModuleBank(languageSlug: string, moduleSlug: string): BankQuestion[] {
    const lang = languageSlug.toLowerCase();
    const mod = moduleSlug.toLowerCase();

    // 1. Búsqueda exacta
    const exactKey = `${lang}_${mod}`;
    if (this.banksCache.has(exactKey) && this.banksCache.get(exactKey)!.length > 0) {
      return this.banksCache.get(exactKey)!;
    }

    // 2. Búsqueda por coincidencia parcial (ej. "01_fundamentos" dentro de "python-fundamentos")
    const baseSlug = mod.split('-').pop() || '';
    for (const [key, questions] of this.banksCache.entries()) {
      if (key.startsWith(lang) && (key.includes(baseSlug) || key.includes(mod))) {
        if (questions && questions.length > 0) {
          return questions;
        }
      }
    }

    // 3. Fallback en memoria si no se encontró en disco
    if (lang === 'python') {
      return FALLBACK_PYTHON_M01_QUESTIONS;
    }

    return [];
  }
}
