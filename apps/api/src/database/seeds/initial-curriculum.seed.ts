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

export const INITIAL_PYTHON_COURSE = {
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
      target_course_slug: 'python-2',
      connection_type: 'unlocks',
      visual_effect_code: 'energy_beam_solid',
      edge_color: '#38BDF8',
    },
  ],
  is_active: true,
};

export const INITIAL_PYTHON_LESSON = {
  slug: 'py-m01-s01-l01',
  section_slug: 'py-m01-s01',
  title: 'Tu primer print()',
  position: 1,
  theory: {
    step1: 'La función print() muestra mensajes en la pantalla o consola.',
    step2: 'El texto que deseas mostrar debe ir encerrado entre comillas dobles o simples.',
    step3: 'Escribe print("Hola Koda") y observa cómo la consola cobra vida.',
    code_snippet: 'print("Hola Koda")',
  },
  // Ítem 1: Consola interactiva con pruebas automáticas
  item_1_console: {
    prompt: 'Usa la función print() para mostrar en pantalla exactamente la frase: ¡Hola Mundo!',
    initial_code: '# Escribe tu código aquí\n',
    solution_code: 'print("¡Hola Mundo!")',
    test_cases: [
      {
        input: '',
        expected_output: '¡Hola Mundo!\n',
        description: 'Debe imprimir ¡Hola Mundo! en la consola interactiva',
      },
    ],
  },
  // Ítem 2: Quiz conceptual de exactamente 4 opciones A/B/C/D
  item_2_quiz: {
    prompt: '¿Qué símbolo se utiliza para delimitar una cadena de texto en Python?',
    options: [
      {
        id: 'a',
        text: 'Comillas (" o \')',
        is_correct: true,
        feedback: '¡Exacto! En Python puedes usar comillas dobles o simples para crear texto.',
      },
      {
        id: 'b',
        text: 'Paréntesis ( )',
        is_correct: false,
        feedback: 'Los paréntesis se usan para llamar a funciones, no para delimitar texto.',
      },
      {
        id: 'c',
        text: 'Corchetes [ ]',
        is_correct: false,
        feedback: 'Los corchetes se utilizan para definir listas en Python.',
      },
      {
        id: 'd',
        text: 'Puntos y comas ;',
        is_correct: false,
        feedback: 'Python no utiliza punto y coma para delimitar cadenas.',
      },
    ],
  },
  // Ítem 3: Predicción de salida en terminal o detección de bug
  item_3_prediction: {
    prompt: '¿Cuál será la salida en consola al ejecutar este código: print(2 + 3)?',
    code_snippet: 'print(2 + 3)',
    target_type: 'predict_output',
    expected_answer: '5',
    hint: 'Los números sin comillas se suman matemáticamente antes de imprimirse.',
  },
  xp_reward: 15,
  is_active: true,
};
