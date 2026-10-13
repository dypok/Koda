export type DeclaredExperienceLevel =
  | 'beginner'
  | 'medium'
  | 'semi_professional'
  | 'professional'
  | 'elementary'
  | 'intermediate'
  | 'advanced';

export type DiagnosticModuleCode = 'M01' | 'M02' | 'M03' | 'M04' | 'M05' | 'M06';
export type DiagnosticBlockId = 'B1' | 'B2';

export interface DiagnosticOption {
  id: string;
  text: string;
}

export interface DiagnosticQuestion {
  id: string;
  order: number;
  blockId: DiagnosticBlockId;
  blockName: string;
  moduleCode: DiagnosticModuleCode;
  moduleTitle: string;
  prompt: string;
  codeSnippet?: string;
  options: DiagnosticOption[];
  correctOptionId: string;
  explanation: string;
}

export interface DiagnosticAnswerInput {
  questionId: string;
  selectedOptionId: string;
}

export interface BlockEvaluationResult {
  blockId: DiagnosticBlockId;
  name: string;
  modulesCovered: string[];
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  isPassed: boolean; // >= 80%
}

export interface DiagnosticEvaluationResult {
  declaredLevel: string;
  normalizedLevel: 'beginner' | 'medium' | 'semi_professional' | 'professional';
  totalQuestions: number;
  totalCorrect: number;
  overallScore: number;
  passedBlock1: boolean;
  passedBlock2: boolean;
  blockScores: BlockEvaluationResult[];
  candidateModuleCode: string;
  candidateModuleOrder: number;
  recommendedModuleId: string;
  recommendedModuleCode: string;
  recommendedModuleOrder: number;
  recommendedModuleTitle: string;
  clamped: boolean;
  justification: string;
  unlockedModuleCodes: string[];
}

/**
 * Banco oficial calibrado de 12 preguntas diagnósticas de Python para Koda 🦊
 * Cubre Bloque B1 (M01..M03: 6 preguntas) y Bloque B2 (M04..M06: 6 preguntas)
 */
export const PYTHON_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // --- BLOQUE B1: FUNDAMENTOS Y SINTAXIS BÁSICA (M01, M02, M03) ---
  {
    id: 'diag-py-01',
    order: 1,
    blockId: 'B1',
    blockName: 'Fundamentos y Sintaxis',
    moduleCode: 'M01',
    moduleTitle: 'Fundamentos de Python',
    prompt: '¿Cuál es la forma canónica de imprimir "¡Hola Koda!" en la consola y agregar un comentario explicativo en Python?',
    codeSnippet: '# Opción a evaluar en Python 3.12',
    options: [
      { id: 'opt_1a', text: 'print("¡Hola Koda!") # Imprime el saludo' },
      { id: 'opt_1b', text: 'echo "¡Hola Koda!" // Imprime el saludo' },
      { id: 'opt_1c', text: 'Console.WriteLine("¡Hola Koda!"); /* Comentario */' },
      { id: 'opt_1d', text: 'System.out.println("¡Hola Koda!"); -- Comentario' },
    ],
    correctOptionId: 'opt_1a',
    explanation: 'En Python la salida en pantalla se realiza con print() y los comentarios de una sola línea inician con el símbolo #.',
  },
  {
    id: 'diag-py-02',
    order: 2,
    blockId: 'B1',
    blockName: 'Fundamentos y Sintaxis',
    moduleCode: 'M01',
    moduleTitle: 'Fundamentos de Python',
    prompt: '¿Cómo delimita Python los bloques de código dentro de estructuras de control o funciones?',
    options: [
      { id: 'opt_2a', text: 'Mediante llaves abiertas y cerradas { }' },
      { id: 'opt_2b', text: 'Mediante indentación (espacios o tabulaciones consistentes)' },
      { id: 'opt_2c', text: 'Con palabras clave begin y end' },
      { id: 'opt_2d', text: 'Con punto y coma ; al final de cada bloque' },
    ],
    correctOptionId: 'opt_2b',
    explanation: 'A diferencia de lenguajes de la familia C, Python utiliza la sangría o indentación obligatoria para definir la jerarquía de bloques.',
  },
  {
    id: 'diag-py-03',
    order: 3,
    blockId: 'B1',
    blockName: 'Fundamentos y Sintaxis',
    moduleCode: 'M02',
    moduleTitle: 'Variables y Tipos de Datos',
    prompt: '¿Qué tipo de dato devuelve la función type() al evaluar el valor 42.0?',
    codeSnippet: 'resultado = type(42.0)\nprint(resultado)',
    options: [
      { id: 'opt_3a', text: "<class 'int'>" },
      { id: 'opt_3b', text: "<class 'float'>" },
      { id: 'opt_3c', text: "<class 'number'>" },
      { id: 'opt_3d', text: "<class 'decimal'>" },
    ],
    correctOptionId: 'opt_3b',
    explanation: 'En Python cualquier número con punto decimal es de tipo primitivo float.',
  },
  {
    id: 'diag-py-04',
    order: 4,
    blockId: 'B1',
    blockName: 'Fundamentos y Sintaxis',
    moduleCode: 'M02',
    moduleTitle: 'Variables y Tipos de Datos',
    prompt: '¿Qué sucede al ejecutar el siguiente fragmento de código en Python?',
    codeSnippet: 'puntos = 10\npuntos = "nivel_completado"\nprint(type(puntos))',
    options: [
      { id: 'opt_4a', text: 'Ocurre un TypeError porque las variables tienen tipado estático.' },
      { id: 'opt_4b', text: "Se ejecuta exitosamente e imprime <class 'str'> debido al tipado dinámico." },
      { id: 'opt_4c', text: 'Lanza un SyntaxError en la segunda asignación.' },
      { id: 'opt_4d', text: "Imprime <class 'int'> conservando el tipo original." },
    ],
    correctOptionId: 'opt_4b',
    explanation: 'Python posee tipado dinámico: una variable puede almacenar y reasignar valores de distintos tipos durante la ejecución.',
  },
  {
    id: 'diag-py-05',
    order: 5,
    blockId: 'B1',
    blockName: 'Fundamentos y Sintaxis',
    moduleCode: 'M03',
    moduleTitle: 'Operadores y Expresiones',
    prompt: '¿Cuál es el resultado de evaluar la expresión 17 % 5 en Python?',
    codeSnippet: 'residuo = 17 % 5\nprint(residuo)',
    options: [
      { id: 'opt_5a', text: '3.4' },
      { id: 'opt_5b', text: '3' },
      { id: 'opt_5c', text: '2' },
      { id: 'opt_5d', text: '1' },
    ],
    correctOptionId: 'opt_5c',
    explanation: 'El operador % (módulo) calcula el residuo de la división entera: 17 = (5 * 3) + 2, por lo tanto el residuo es 2.',
  },
  {
    id: 'diag-py-06',
    order: 6,
    blockId: 'B1',
    blockName: 'Fundamentos y Sintaxis',
    moduleCode: 'M03',
    moduleTitle: 'Operadores y Expresiones',
    prompt: '¿Cuál es el valor booleano resultante de la siguiente expresión lógica?',
    codeSnippet: 'condicion = (10 > 5) and not (3 == 4)',
    options: [
      { id: 'opt_6a', text: 'True' },
      { id: 'opt_6b', text: 'False' },
      { id: 'opt_6c', text: 'None' },
      { id: 'opt_6d', text: 'Error de sintaxis por uso de not' },
    ],
    correctOptionId: 'opt_6a',
    explanation: '(10 > 5) es True, (3 == 4) es False, por lo que not False es True. Finalmente True and True resulta en True.',
  },

  // --- BLOQUE B2: CONTROL DE FLUJO Y MODULARIDAD (M04, M05, M06) ---
  {
    id: 'diag-py-07',
    order: 7,
    blockId: 'B2',
    blockName: 'Control de Flujo y Modularidad',
    moduleCode: 'M04',
    moduleTitle: 'Condicionales y Decisiones',
    prompt: '¿Qué imprimirá el siguiente bloque condicional?',
    codeSnippet: 'puntaje = 75\nif puntaje >= 90:\n    print("Oro")\nelif puntaje >= 70:\n    print("Plata")\nelse:\n    print("Bronce")',
    options: [
      { id: 'opt_7a', text: 'Oro' },
      { id: 'opt_7b', text: 'Plata' },
      { id: 'opt_7c', text: 'Bronce' },
      { id: 'opt_7d', text: 'Plata y Bronce' },
    ],
    correctOptionId: 'opt_7b',
    explanation: '75 no cumple >= 90, pero sí cumple puntaje >= 70 en la rama elif, imprimiendo "Plata" y saliendo del bloque.',
  },
  {
    id: 'diag-py-08',
    order: 8,
    blockId: 'B2',
    blockName: 'Control de Flujo y Modularidad',
    moduleCode: 'M04',
    moduleTitle: 'Condicionales y Decisiones',
    prompt: '¿Cuál es la forma idiomática en Python de comprobar si una variable x está en el rango cerrado entre 10 y 20?',
    options: [
      { id: 'opt_8a', text: 'if 10 <= x <= 20:' },
      { id: 'opt_8b', text: 'if x between 10 and 20:' },
      { id: 'opt_8c', text: 'if (x >= 10 && x <= 20):' },
      { id: 'opt_8d', text: 'if 10 < x < 20 or x == 10:' },
    ],
    correctOptionId: 'opt_8a',
    explanation: 'Python soporta encadenamiento de comparaciones algebraicas de forma directa y legible: 10 <= x <= 20.',
  },
  {
    id: 'diag-py-09',
    order: 9,
    blockId: 'B2',
    blockName: 'Control de Flujo y Modularidad',
    moduleCode: 'M05',
    moduleTitle: 'Bucles e Iteraciones',
    prompt: '¿Qué valores numéricos iterará la variable i en el siguiente ciclo for?',
    codeSnippet: 'for i in range(2, 6):\n    print(i, end=" ")',
    options: [
      { id: 'opt_9a', text: '2 3 4 5' },
      { id: 'opt_9b', text: '2 3 4 5 6' },
      { id: 'opt_9c', text: '1 2 3 4 5' },
      { id: 'opt_9d', text: '2 4 6' },
    ],
    correctOptionId: 'opt_9a',
    explanation: 'range(start, stop) genera valores comenzando en start inclusive y terminando en stop - 1 exclusive (2, 3, 4, 5).',
  },
  {
    id: 'diag-py-10',
    order: 10,
    blockId: 'B2',
    blockName: 'Control de Flujo y Modularidad',
    moduleCode: 'M05',
    moduleTitle: 'Bucles e Iteraciones',
    prompt: '¿Qué produce la sentencia continue dentro de un bucle while o for?',
    options: [
      { id: 'opt_10a', text: 'Termina el bucle de inmediato y sale de él.' },
      { id: 'opt_10b', text: 'Salta el resto del cuerpo del ciclo actual y avanza a la siguiente iteración.' },
      { id: 'opt_10c', text: 'Reinicia el bucle desde la primera iteración.' },
      { id: 'opt_10d', text: 'Pausa la ejecución por un segundo.' },
    ],
    correctOptionId: 'opt_10b',
    explanation: 'continue descarta las instrucciones restantes de la iteración en curso y evalúa la siguiente iteración del bucle.',
  },
  {
    id: 'diag-py-11',
    order: 11,
    blockId: 'B2',
    blockName: 'Control de Flujo y Modularidad',
    moduleCode: 'M06',
    moduleTitle: 'Funciones y Modularidad',
    prompt: '¿Cuál es la sintaxis correcta para declarar una función que sume dos números y retorne el resultado?',
    options: [
      { id: 'opt_11a', text: 'def sumar(a, b):\n    return a + b' },
      { id: 'opt_11b', text: 'function sumar(a, b) {\n    return a + b;\n}' },
      { id: 'opt_11c', text: 'func sumar(a, b) -> int:\n    return a + b' },
      { id: 'opt_11d', text: 'sumar = def(a, b) => a + b' },
    ],
    correctOptionId: 'opt_11a',
    explanation: 'En Python las funciones se definen con la palabra clave def seguida de identificador, argumentos entre paréntesis y dos puntos (:).',
  },
  {
    id: 'diag-py-12',
    order: 12,
    blockId: 'B2',
    blockName: 'Control de Flujo y Modularidad',
    moduleCode: 'M06',
    moduleTitle: 'Funciones y Modularidad',
    prompt: '¿Qué retorna una función en Python si concluye su ejecución sin ejecutar una sentencia return explícita?',
    codeSnippet: 'def saludar(nombre):\n    mensaje = f"Hola {nombre}"\n\nvalor = saludar("Koda")\nprint(valor)',
    options: [
      { id: 'opt_12a', text: '0' },
      { id: 'opt_12b', text: "'' (cadena vacía)" },
      { id: 'opt_12c', text: 'None' },
      { id: 'opt_12d', text: 'Lanza un UnreturnedError' },
    ],
    correctOptionId: 'opt_12c',
    explanation: 'Toda función de Python sin sentencia return explícita (o con return vacío) retorna por defecto el objeto singleton None.',
  },
];
