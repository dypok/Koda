import { QuizOption } from '../schemas/lesson.schema';

/**
 * Pistas Profesionales (Tracks) oficiales de Koda.
 */
export const INITIAL_TRACKS = [
  {
    slug: 'python',
    name: 'Pista Fundacional: Python',
    description: 'Algoritmos, sintaxis base y resolución de problemas para programar desde cero.',
    icon: 'IconBrandPython',
    badge: 'Fundacional',
    color: '#38BDF8',
    sort_order: 10,
    is_active: true,
  },
  {
    slug: 'frontend',
    name: 'Frontend Developer',
    description: 'Especialización en interfaces web: HTML5 semántico, CSS moderno, TypeScript, React 19 y Next.js.',
    icon: 'IconDeviceDesktop',
    badge: 'Carrera',
    color: '#10B981',
    sort_order: 20,
    is_active: true,
  },
  {
    slug: 'backend',
    name: 'Backend Developer',
    description: 'Especialización en servidores: APIs REST, NestJS, bases de datos híbridas y microservicios.',
    icon: 'IconServer',
    badge: 'Carrera',
    color: '#8B5CF6',
    sort_order: 30,
    is_active: true,
  },
  {
    slug: 'devops',
    name: 'DevOps & Cloud Engineer',
    description: 'Especialización en infraestructura: Linux CLI, Docker, CI/CD GitHub Actions y Kubernetes.',
    icon: 'IconCloudComputing',
    badge: 'Carrera',
    color: '#F59E0B',
    sort_order: 40,
    is_active: true,
  },
];

/**
 * Cursos en Grafo DAG (ADR-007) con topología de rejilla relativa (tier, lane) y aristas GPU.
 */
export const PYTHON_COURSES = [
  {
    slug: 'python-1',
    track_slug: 'python',
    name: 'Python 1: Fundamentos',
    description: 'Entorno, variables, tipos, operadores, I/O, condicionales, bucles for/while, colecciones y funciones.',
    color: '#38BDF8',
    icon: 'IconBrandPython',
    topology: { tier: 0, lane: 0 },
    prerequisites: [],
    edges: [
      {
        target_course_slug: 'frontend-core',
        connection_type: 'unlocks',
        visual_effect_code: 'energy_beam_solid',
        edge_color: '#10B981',
      },
      {
        target_course_slug: 'backend-core',
        connection_type: 'unlocks',
        visual_effect_code: 'laser_flow_fast',
        edge_color: '#8B5CF6',
      },
      {
        target_course_slug: 'devops-core',
        connection_type: 'unlocks',
        visual_effect_code: 'dotted_amber_pulse',
        edge_color: '#F59E0B',
      },
    ],
    is_active: true,
  },
  {
    slug: 'frontend-core',
    track_slug: 'frontend',
    name: 'Frontend Web con React 19 y Next.js',
    description: 'Desarrollo de interfaces interactivas, componentes atómicos, SSR y Tailwind CSS.',
    color: '#10B981',
    icon: 'IconDeviceDesktop',
    topology: { tier: 1, lane: -1 },
    prerequisites: ['python-1'],
    edges: [],
    is_active: true,
  },
  {
    slug: 'backend-core',
    track_slug: 'backend',
    name: 'Backend Engineering con NestJS',
    description: 'Construcción de arquitecturas modulares y hexagonales, persistencia relacional y APIs robustas.',
    color: '#8B5CF6',
    icon: 'IconServer',
    topology: { tier: 1, lane: 0 },
    prerequisites: ['python-1'],
    edges: [
      {
        target_course_slug: 'fastapi-async',
        connection_type: 'unlocks',
        visual_effect_code: 'laser_flow_fast',
        edge_color: '#8B5CF6',
      },
      {
        target_course_slug: 'django-enterprise',
        connection_type: 'unlocks',
        visual_effect_code: 'dotted_amber_pulse',
        edge_color: '#10B981',
      },
    ],
    is_active: true,
  },
  {
    slug: 'devops-core',
    track_slug: 'devops',
    name: 'DevOps, Docker & Cloud Infrastructure',
    description: 'Automatización de pipelines CI/CD, contenedores Docker y monitoreo en la nube.',
    color: '#F59E0B',
    icon: 'IconCloudComputing',
    topology: { tier: 1, lane: 1 },
    prerequisites: ['python-1'],
    edges: [],
    is_active: true,
  },
  {
    slug: 'fastapi-async',
    track_slug: 'backend',
    name: 'Microservicios Asíncronos con FastAPI',
    description: 'APIs ultra rápidas de alto rendimiento con validación Pydantic y concurrencia asyncio.',
    color: '#8B5CF6',
    icon: 'IconServer',
    topology: { tier: 2, lane: 0 },
    prerequisites: ['backend-core'],
    edges: [],
    is_active: true,
  },
  {
    slug: 'django-enterprise',
    track_slug: 'backend',
    name: 'Desarrollo Web Empresarial con Django',
    description: 'Aplicaciones completas con ORM robusto, sistema de autenticación y panel de administración.',
    color: '#10B981',
    icon: 'IconServer',
    topology: { tier: 2, lane: 1 },
    prerequisites: ['backend-core'],
    edges: [],
    is_active: true,
  },
];

/**
 * 12 Módulos Canónicos de Python 3.12 (manifest.json).
 */
export const PYTHON_MODULES = [
  {
    slug: 'fundamentos-de-python',
    course_slug: 'python-1',
    title: 'Fundamentos de Python',
    objective: 'Dominar la función print(), cadenas de texto, números, indentación y comentarios.',
    position: 1,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'variables-y-tipos-de-datos',
    course_slug: 'python-1',
    title: 'Variables y Tipos de Datos',
    objective: 'Almacenamiento en memoria, int, float, str, bool y función inspectora type().',
    position: 2,
    total_sections: 10,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'operadores-y-expresiones',
    course_slug: 'python-1',
    title: 'Operadores y Expresiones',
    objective: 'Aritmética básica, comparadores y operadores lógicos and, or, not.',
    position: 3,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'condicionales-y-control-flujo',
    course_slug: 'python-1',
    title: 'Condicionales y Control de Flujo',
    objective: 'Toma de decisiones lógicas con bloques if, elif y else sin anidación excesiva.',
    position: 4,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'bucles-e-iteracion',
    course_slug: 'python-1',
    title: 'Bucles e Iteración',
    objective: 'Automatización de tareas repetitivas con for, while, range, break y continue.',
    position: 5,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'funciones-y-modularidad',
    course_slug: 'python-1',
    title: 'Funciones y Modularidad',
    objective: 'Creación de bloques de código reutilizables con def, parámetros y valores de retorno.',
    position: 6,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'listas-y-tuplas',
    course_slug: 'python-1',
    title: 'Estructuras de Datos: Listas y Tuplas',
    objective: 'Colecciones ordenadas, indexación por corchetes, slicing y mutabilidad.',
    position: 7,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'diccionarios-y-conjuntos',
    course_slug: 'python-1',
    title: 'Diccionarios y Conjuntos',
    objective: 'Mapeo asociativo clave-valor, métodos get() y conjuntos únicos set().',
    position: 8,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'manejo-de-errores-excepciones',
    course_slug: 'python-1',
    title: 'Manejo de Errores y Excepciones',
    objective: 'Prevención de caídas con bloques de control try, except, else y finally.',
    position: 9,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'modulos-paquetes-entornos',
    course_slug: 'python-1',
    title: 'Módulos, Paquetes y Entornos',
    objective: 'Organización modular con import, bibliotecas nativas math/random y entornos venv.',
    position: 10,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'programacion-orientada-a-objetos',
    course_slug: 'python-1',
    title: 'Programación Orientada a Objetos',
    objective: 'Modelado con clases, instancias, atributos, métodos y el constructor __init__.',
    position: 11,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'proyecto-final-integrador',
    course_slug: 'python-1',
    title: 'Proyecto Final Integrador',
    objective: 'Aplicación integral de todos los conceptos y preparación para la certificación oficial Koda.',
    position: 12,
    total_sections: 8,
    min_stars_percentage: 80,
    is_active: true,
  },
];

/**
 * Secciones del Módulo 01: Fundamentos de Python.
 */
export const PYTHON_SECTIONS = [
  {
    slug: 'py-m01-s01',
    module_slug: 'fundamentos-de-python',
    title: '¿Qué es Python y cómo se ejecuta?',
    position: 1,
    total_lessons: 4,
    xp_reward: 50,
    is_active: true,
  },
  {
    slug: 'py-m01-s02',
    module_slug: 'fundamentos-de-python',
    title: 'Tu primer print() y texto en pantalla',
    position: 2,
    total_lessons: 4,
    xp_reward: 50,
    is_active: true,
  },
  {
    slug: 'py-m01-s03',
    module_slug: 'fundamentos-de-python',
    title: 'Números enteros y operaciones simples',
    position: 3,
    total_lessons: 4,
    xp_reward: 50,
    is_active: true,
  },
  {
    slug: 'py-m01-s04',
    module_slug: 'fundamentos-de-python',
    title: 'Comentarios: notas para humanos (#)',
    position: 4,
    total_lessons: 4,
    xp_reward: 50,
    is_active: true,
  },
  {
    slug: 'py-m01-s05',
    module_slug: 'fundamentos-de-python',
    title: 'Indentación y estructura visual limpia',
    position: 5,
    total_lessons: 4,
    xp_reward: 50,
    is_active: true,
  },
  {
    slug: 'py-m01-s06',
    module_slug: 'fundamentos-de-python',
    title: 'Combinando texto y números en pantalla',
    position: 6,
    total_lessons: 4,
    xp_reward: 50,
    is_active: true,
  },
  {
    slug: 'py-m01-s07',
    module_slug: 'fundamentos-de-python',
    title: 'Lectura y comprensión de SyntaxError',
    position: 7,
    total_lessons: 4,
    xp_reward: 50,
    is_active: true,
  },
  {
    slug: 'py-m01-s08',
    module_slug: 'fundamentos-de-python',
    title: 'Desafío de consolidación del Módulo 01',
    position: 8,
    total_lessons: 4,
    xp_reward: 100,
    is_active: true,
  },
];

/**
 * Micro-lecciones pedagógicas con la Tríada Evaluativa completa (Consola, Quiz de 4 opciones y Predicción).
 */
export const PYTHON_LESSONS = [
  // --- Sección 1: ¿Qué es Python? ---
  {
    slug: 'py-m01-s01-l01',
    section_slug: 'py-m01-s01',
    title: 'Bienvenido al universo Python',
    position: 1,
    theory: {
      step1: 'Python es un lenguaje de programación diseñado para ser claro, legible y directo.',
      step2: 'A diferencia de otros lenguajes, no necesitas caracteres extraños para empezar.',
      step3: 'Cada instrucción que escribes le indica a la computadora qué acción exacta realizar.',
      code_snippet: 'print("¡Hola, Koda!")',
    },
    item_1_console: {
      prompt: 'Imprime el saludo inicial para despertar a Koda usando print("¡Hola, Koda!").',
      initial_code: '# Escribe tu código aquí\n',
      solution_code: 'print("¡Hola, Koda!")',
      test_cases: [
        {
          input: '',
          expected_output: '¡Hola, Koda!\n',
          description: 'Debe imprimir exactamente ¡Hola, Koda!',
        },
      ],
    },
    item_2_quiz: {
      prompt: '¿Cuál es la principal ventaja de Python para quienes aprenden a programar?',
      options: [
        {
          id: 'a' as const,
          text: 'Su sintaxis limpia se asemeja al lenguaje humano cotidiano',
          is_correct: true,
          feedback: '¡Exacto! Python fue diseñado para que las personas lean y entiendan código fácilmente.',
        },
        {
          id: 'b' as const,
          text: 'Obliga a usar punto y coma al final de cada línea',
          is_correct: false,
          feedback: 'En Python no se utilizan puntos y comas obligatorios.',
        },
        {
          id: 'c' as const,
          text: 'Solo funciona en navegadores web antiguos',
          is_correct: false,
          feedback: 'Python es un lenguaje universal que corre en servidores, computadoras y la nube.',
        },
        {
          id: 'd' as const,
          text: 'No permite manipular números ni textos',
          is_correct: false,
          feedback: 'Python maneja datos de todo tipo con gran versatilidad.',
        },
      ],
    },
    item_3_prediction: {
      prompt: '¿Qué resultado mostrará en la terminal el comando print("Koda")?',
      code_snippet: 'print("Koda")',
      target_type: 'predict_output' as const,
      expected_answer: 'Koda',
      hint: 'La función print() muestra el texto sin las comillas que lo rodean.',
    },
    xp_reward: 15,
    is_active: true,
  },
  {
    slug: 'py-m01-s01-l02',
    section_slug: 'py-m01-s01',
    title: 'Instrucciones en orden secuencial',
    position: 2,
    theory: {
      step1: 'La computadora ejecuta las instrucciones una tras otra, de arriba hacia abajo.',
      step2: 'Cada línea de código representa un paso individual en el programa.',
      step3: 'El orden de las líneas determina el orden exacto en que ocurren los resultados.',
      code_snippet: 'print("Paso 1")\nprint("Paso 2")',
    },
    item_1_console: {
      prompt: 'Escribe dos líneas con print: primero "Inicio" y en la siguiente línea "Fin".',
      initial_code: '# Escribe dos instrucciones print\n',
      solution_code: 'print("Inicio")\nprint("Fin")',
      test_cases: [
        {
          input: '',
          expected_output: 'Inicio\nFin\n',
          description: 'Debe imprimir Inicio y luego Fin en líneas separadas',
        },
      ],
    },
    item_2_quiz: {
      prompt: 'Si ejecutas dos instrucciones print(), ¿en qué orden se mostrarán sus mensajes?',
      options: [
        {
          id: 'a' as const,
          text: 'De arriba hacia abajo, en el orden en que fueron escritas',
          is_correct: true,
          feedback: '¡Correcto! Los programas se ejecutan secuencialmente de arriba a abajo.',
        },
        {
          id: 'b' as const,
          text: 'En orden alfabético automático',
          is_correct: false,
          feedback: 'Python no reorganiza tus líneas por orden alfabético.',
        },
        {
          id: 'c' as const,
          text: 'Al azar cada vez que corre el programa',
          is_correct: false,
          feedback: 'El orden de ejecución es determinista y predecible.',
        },
        {
          id: 'd' as const,
          text: 'De abajo hacia arriba siempre',
          is_correct: false,
          feedback: 'El flujo de control lee de la primera línea hacia la última.',
        },
      ],
    },
    item_3_prediction: {
      prompt: 'Observa este código. ¿Cuál será la segunda palabra que aparecerá en pantalla?',
      code_snippet: 'print("Uno")\nprint("Dos")',
      target_type: 'predict_output' as const,
      expected_answer: 'Dos',
      hint: 'La segunda línea se ejecuta inmediatamente después de la primera.',
    },
    xp_reward: 15,
    is_active: true,
  },

  // --- Sección 2: Tu primer print() y texto ---
  {
    slug: 'py-m01-s02-l01',
    section_slug: 'py-m01-s02',
    title: 'Cadenas de texto y comillas',
    position: 1,
    theory: {
      step1: 'Los textos en programación se conocen formalmente como cadenas (strings).',
      step2: 'Para que Python sepa que es texto, debes envolverlo en comillas dobles "..." o simples \'...\'.',
      step3: 'Si olvidas las comillas, Python pensará que el texto es el nombre de una variable o función.',
      code_snippet: 'print("Aprendiendo Python")',
    },
    item_1_console: {
      prompt: 'Imprime en pantalla la frase: Koda es genial',
      initial_code: '# Usa print() con comillas\n',
      solution_code: 'print("Koda es genial")',
      test_cases: [
        {
          input: '',
          expected_output: 'Koda es genial\n',
          description: 'Debe imprimir Koda es genial',
        },
      ],
    },
    item_2_quiz: {
      prompt: '¿Cuál de las siguientes líneas define correctamente un texto para imprimir en Python?',
      options: [
        {
          id: 'a' as const,
          text: 'print("Hola")',
          is_correct: true,
          feedback: '¡Excelente! Las comillas dobles delimitan el texto correctamente.',
        },
        {
          id: 'b' as const,
          text: 'print(Hola)',
          is_correct: false,
          feedback: 'Sin comillas, Python generará un NameError buscando una variable llamada Hola.',
        },
        {
          id: 'c' as const,
          text: 'print<<Hola>>',
          is_correct: false,
          feedback: 'Esa no es la sintaxis de Python para llamar a funciones.',
        },
        {
          id: 'd' as const,
          text: 'print[Hola]',
          is_correct: false,
          feedback: 'Los corchetes se utilizan para indexar listas, no para invocar print.',
        },
      ],
    },
    item_3_prediction: {
      prompt: '¿Qué error provocará ejecutar print(Python)? (Tip: falta un elemento de sintaxis)',
      code_snippet: 'print(Python)',
      target_type: 'bug_hunt' as const,
      expected_answer: 'NameError',
      hint: 'Al no tener comillas, Python busca un identificador con ese nombre y falla al no encontrarlo.',
    },
    xp_reward: 15,
    is_active: true,
  },
  {
    slug: 'py-m01-s02-l02',
    section_slug: 'py-m01-s02',
    title: 'Comillas dobles vs comillas simples',
    position: 2,
    theory: {
      step1: 'En Python, las comillas dobles ("") y simples (\'\') son totalmente equivalentes.',
      step2: 'Puedes usar la que prefieras, siempre que abras y cierres con el mismo tipo de comilla.',
      step3: 'Si tu texto contiene una comilla simple interna, puedes envolverlo en comillas dobles para evitar conflictos.',
      code_snippet: 'print(\'Texto con comilla simple\')\nprint("It\'s Koda")',
    },
    item_1_console: {
      prompt: 'Imprime la frase: \'Python es divertido\' utilizando comillas dobles alrededor.',
      initial_code: '# Escribe tu instrucción print\n',
      solution_code: 'print("\'Python es divertido\'")',
      test_cases: [
        {
          input: '',
          expected_output: "'Python es divertido'\n",
          description: 'Debe imprimir el texto con las comillas simples internas',
        },
      ],
    },
    item_2_quiz: {
      prompt: '¿Qué sucede si abres una cadena con comilla doble y la cierras con comilla simple?',
      options: [
        {
          id: 'a' as const,
          text: 'Se genera un SyntaxError porque las comillas no coinciden',
          is_correct: true,
          feedback: '¡Exacto! Python exige que el carácter de apertura coincida con el de cierre.',
        },
        {
          id: 'b' as const,
          text: 'Python lo corrige automáticamente sin avisar',
          is_correct: false,
          feedback: 'Los lenguajes de programación son estrictos con la sintaxis de cierre.',
        },
        {
          id: 'c' as const,
          text: 'El programa imprime la mitad del texto',
          is_correct: false,
          feedback: 'El intérprete aborta antes de ejecutar debido a un error de sintaxis.',
        },
        {
          id: 'd' as const,
          text: 'Se crea un número entero',
          is_correct: false,
          feedback: 'Un texto mal cerrado jamás se convierte en un número.',
        },
      ],
    },
    item_3_prediction: {
      prompt: '¿Cuál será la salida de print(\'Hola\' + \' \' + \'Mundo\')?',
      code_snippet: "print('Hola' + ' ' + 'Mundo')",
      target_type: 'predict_output' as const,
      expected_answer: 'Hola Mundo',
      hint: 'El signo + entre cadenas une los textos sin agregar espacios extras por su cuenta.',
    },
    xp_reward: 15,
    is_active: true,
  },

  // --- Sección 3: Números enteros y operaciones ---
  {
    slug: 'py-m01-s03-l01',
    section_slug: 'py-m01-s03',
    title: 'Imprimiendo números en Python',
    position: 1,
    theory: {
      step1: 'Los números en Python no llevan comillas.',
      step2: 'Si escribes un número entre comillas, Python lo tratará como texto y no como valor numérico.',
      step3: 'Puedes pasar números directamente a print() para mostrarlos en pantalla.',
      code_snippet: 'print(42)',
    },
    item_1_console: {
      prompt: 'Imprime el número 2026 sin usar comillas.',
      initial_code: '# Imprime el número directamente\n',
      solution_code: 'print(2026)',
      test_cases: [
        {
          input: '',
          expected_output: '2026\n',
          description: 'Debe imprimir el número 2026',
        },
      ],
    },
    item_2_quiz: {
      prompt: '¿Cuál es la diferencia entre 100 y "100" en Python?',
      options: [
        {
          id: 'a' as const,
          text: '100 es un número entero para operaciones y "100" es una cadena de texto',
          is_correct: true,
          feedback: '¡Perfecto! Los números permiten hacer cálculos matemáticos; los textos solo representan caracteres.',
        },
        {
          id: 'b' as const,
          text: 'No hay ninguna diferencia, Python los trata exactamente igual',
          is_correct: false,
          feedback: 'Tienen tipos de datos completamente distintos (int vs str).',
        },
        {
          id: 'c' as const,
          text: '100 es texto y "100" es un número',
          is_correct: false,
          feedback: 'Las comillas indican texto, no valores numéricos.',
        },
        {
          id: 'd' as const,
          text: '"100" causa un error de compilación',
          is_correct: false,
          feedback: 'Es perfectamente válido escribir "100", es un string de tres caracteres.',
        },
      ],
    },
    item_3_prediction: {
      prompt: '¿Qué valor imprimirá en consola print(10 + 5)?',
      code_snippet: 'print(10 + 5)',
      target_type: 'predict_output' as const,
      expected_answer: '15',
      hint: 'Python realiza la suma aritmética antes de pasar el resultado a print().',
    },
    xp_reward: 15,
    is_active: true,
  },
  {
    slug: 'py-m01-s03-l02',
    section_slug: 'py-m01-s03',
    title: 'Operaciones aritméticas fundamentales',
    position: 2,
    theory: {
      step1: 'Python funciona como una calculadora de alta precisión.',
      step2: 'Los operadores básicos son: suma (+), resta (-), multiplicación (*) y división (/).',
      step3: 'Python respeta las reglas matemáticas de precedencia (multiplicación antes de suma).',
      code_snippet: 'print(5 * 4)\nprint(20 / 4)',
    },
    item_1_console: {
      prompt: 'Calcula e imprime el resultado de multiplicar 7 por 8.',
      initial_code: '# Escribe print con la multiplicación\n',
      solution_code: 'print(7 * 8)',
      test_cases: [
        {
          input: '',
          expected_output: '56\n',
          description: 'Debe imprimir 56',
        },
      ],
    },
    item_2_quiz: {
      prompt: '¿Qué símbolo se usa para multiplicar dos números en Python?',
      options: [
        {
          id: 'a' as const,
          text: 'El asterisco (*)',
          is_correct: true,
          feedback: '¡Exacto! El asterisco * es el operador de multiplicación universal en programación.',
        },
        {
          id: 'b' as const,
          text: 'La letra x',
          is_correct: false,
          feedback: 'La letra x es interpretada como el nombre de una variable, no como multiplicación.',
        },
        {
          id: 'c' as const,
          text: 'El punto (.)',
          is_correct: false,
          feedback: 'El punto se utiliza para números decimales o acceder a propiedades.',
        },
        {
          id: 'd' as const,
          text: 'El signo de porcentaje (%)',
          is_correct: false,
          feedback: 'El signo % se utiliza para obtener el residuo de una división (módulo).',
        },
      ],
    },
    item_3_prediction: {
      prompt: '¿Cuál es el resultado de print(2 + 3 * 4)?',
      code_snippet: 'print(2 + 3 * 4)',
      target_type: 'predict_output' as const,
      expected_answer: '14',
      hint: 'La multiplicación (3 * 4 = 12) se resuelve antes que la suma (+ 2).',
    },
    xp_reward: 15,
    is_active: true,
  },
];

/**
 * Bancos de Preguntas Oficiales para el Módulo 01 (Diagnósticos y Evaluaciones).
 */
export const PYTHON_QUESTION_BANKS = [
  {
    module_slug: 'fundamentos-de-python',
    difficulty: 'easy' as const,
    questions: [
      {
        id: 'bnk_py_01_01',
        prompt: '¿Cuál de las siguientes opciones es la forma correcta de imprimir un mensaje en Python?',
        options: [
          { id: 'a' as const, text: 'print("Hola")', is_correct: true, feedback: '¡Correcto! print() con paréntesis y comillas.' },
          { id: 'b' as const, text: 'echo "Hola"', is_correct: false, feedback: 'echo es un comando de Bash/PHP, no de Python.' },
          { id: 'c' as const, text: 'console.log("Hola")', is_correct: false, feedback: 'console.log() es la función de JavaScript.' },
          { id: 'd' as const, text: 'System.out.println("Hola")', is_correct: false, feedback: 'Esa es la sintaxis verbose de Java.' },
        ],
        explanation: 'En Python 3, print() es una función nativa que recibe los argumentos entre paréntesis.',
      },
      {
        id: 'bnk_py_01_02',
        prompt: '¿Qué carácter se utiliza en Python para escribir un comentario de una sola línea?',
        options: [
          { id: 'a' as const, text: 'El símbolo numeral (#)', is_correct: true, feedback: '¡Exacto! Todo lo que siga al # en esa línea será ignorado por Python.' },
          { id: 'b' as const, text: 'Doble barra (//)', is_correct: false, feedback: 'En Python // es división entera; los comentarios usan #.' },
          { id: 'c' as const, text: 'Signo de exclamación (!)', is_correct: false, feedback: 'El signo ! no se utiliza para comentarios en Python.' },
          { id: 'd' as const, text: 'Guiones dobles (--)', is_correct: false, feedback: '-- es el estándar de comentarios en SQL, no en Python.' },
        ],
        explanation: 'El símbolo numeral (#) le indica al intérprete de Python que ignore el resto de la línea.',
      },
      {
        id: 'bnk_py_01_03',
        prompt: '¿Qué tipo de dato representa un valor como "¡Bienvenido a Koda!"?',
        options: [
          { id: 'a' as const, text: 'Cadena de texto (string o str)', is_correct: true, feedback: '¡Correcto! Todo texto entre comillas es un string.' },
          { id: 'b' as const, text: 'Número entero (int)', is_correct: false, feedback: 'Un número entero no lleva comillas ni letras.' },
          { id: 'c' as const, text: 'Booleano (bool)', is_correct: false, feedback: 'Un booleano solo puede ser True o False.' },
          { id: 'd' as const, text: 'Lista (list)', is_correct: false, feedback: 'Las listas se delimitan con corchetes [].' },
        ],
        explanation: 'Las cadenas de texto en Python pertenecen a la clase str y se definen con comillas.',
      },
    ],
  },
  {
    module_slug: 'fundamentos-de-python',
    difficulty: 'medium' as const,
    questions: [
      {
        id: 'bnk_py_01_04',
        prompt: '¿Cuál será la salida de ejecutar: print("3" + "4")?',
        code_snippet: 'print("3" + "4")',
        options: [
          { id: 'a' as const, text: '"34"', is_correct: true, feedback: '¡Excelente! Al ser cadenas, el operador + las concatena en vez de sumarlas.' },
          { id: 'b' as const, text: '7', is_correct: false, feedback: 'Para obtener 7, los valores deberían ser números sin comillas: 3 + 4.' },
          { id: 'c' as const, text: '12', is_correct: false, feedback: 'No se está realizando una multiplicación.' },
          { id: 'd' as const, text: 'SyntaxError', is_correct: false, feedback: 'Concatenar dos cadenas con + es una operación totalmente válida.' },
        ],
        explanation: 'El operador + entre dos strings realiza una concatenación textual.',
      },
      {
        id: 'bnk_py_01_05',
        prompt: '¿Qué sucede si ejecutas una línea de código con indentación aleatoria al inicio sin estar dentro de una estructura?',
        code_snippet: '  print("Hola")',
        options: [
          { id: 'a' as const, text: 'Lanza un IndentationError', is_correct: true, feedback: '¡Correcto! Python usa la indentación para definir bloques de código.' },
          { id: 'b' as const, text: 'Se ejecuta normalmente ignorando los espacios', is_correct: false, feedback: 'Python es estricto con los espacios al inicio de cada línea.' },
          { id: 'c' as const, text: 'Imprime el texto con sangría en la terminal', is_correct: false, feedback: 'El código fallará antes de imprimir nada debido al error de sintaxis.' },
          { id: 'd' as const, text: 'Se crea una función automática', is_correct: false, feedback: 'Las funciones requieren la palabra clave def.' },
        ],
        explanation: 'En Python la indentación no es estética, sino parte fundamental de la sintaxis.',
      },
    ],
  },
  {
    module_slug: 'fundamentos-de-python',
    difficulty: 'hard' as const,
    questions: [
      {
        id: 'bnk_py_01_06',
        prompt: '¿Cuál de las siguientes expresiones en Python generará un error de tipo (TypeError)?',
        options: [
          { id: 'a' as const, text: 'print("Nivel: " + 5)', is_correct: true, feedback: '¡Exacto! Python no permite concatenar automáticamente texto con un número entero.' },
          { id: 'b' as const, text: 'print("Nivel: " + "5")', is_correct: false, feedback: 'Esto es válido porque ambos elementos son cadenas.' },
          { id: 'c' as const, text: 'print("Nivel: ", 5)', is_correct: false, feedback: 'Esto es válido porque print() acepta múltiples argumentos separados por coma.' },
          { id: 'd' as const, text: 'print("Nivel: " + str(5))', is_correct: false, feedback: 'Esto es válido porque str(5) convierte el número a texto antes de unirlo.' },
        ],
        explanation: 'En Python la coerción implícita de tipos entre string e int no está permitida al usar el operador +.',
      },
    ],
  },
];
