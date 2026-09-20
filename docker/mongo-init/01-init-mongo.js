/**
 * Script de inicialización automática de MongoDB para Koda 🦊.
 *
 * Este script se ejecuta automáticamente al inicializar el contenedor Docker
 * de MongoDB (mongo:7) gracias al montaje en /docker-entrypoint-initdb.d/.
 *
 * Base de datos: koda
 */

const dbKoda = db.getSiblingDB('koda');

print('🦊 [Docker Init] Inicializando base de datos koda en MongoDB...');

// 1. Índices únicos para garantizar integridad
dbKoda.tracks.createIndex({ slug: 1 }, { unique: true });
dbKoda.courses.createIndex({ slug: 1 }, { unique: true });
dbKoda.modules.createIndex({ slug: 1 }, { unique: true });
dbKoda.sections.createIndex({ slug: 1 }, { unique: true });
dbKoda.lessons.createIndex({ slug: 1 }, { unique: true });
dbKoda.visual_effects.createIndex({ code: 1 }, { unique: true });
dbKoda.question_banks.createIndex({ module_slug: 1, difficulty: 1 }, { unique: true });

// 2. Efectos visuales de aristas GPU
const visualEffects = [
  {
    code: 'laser_flow_fast',
    name: 'Flujo Láser Acelerado',
    description: 'Haz continuo con pulso lumínico rápido y partículas de plasma para rutas prioritarias.',
    preset: 'laser_flow',
    animation_speed: 2.2,
    particle_density: 1.5,
    glow_intensity: 1.0,
    default_color: '#38BDF8',
    dash_style: 'solid',
    is_gpu_accelerated: true,
  },
  {
    code: 'energy_beam_solid',
    name: 'Rayo de Energía Constante',
    description: 'Línea de energía continua de alto brillo para conexiones directas entre módulos.',
    preset: 'energy_beam',
    animation_speed: 1.0,
    particle_density: 0.8,
    glow_intensity: 0.8,
    default_color: '#10B981',
    dash_style: 'solid',
    is_gpu_accelerated: true,
  },
  {
    code: 'sonar_radar_pulse',
    name: 'Pulso de Radar Sonar',
    description: 'Ondas expansivas concéntricas para nodos de examen o hitos importantes.',
    preset: 'radar_sweep',
    animation_speed: 1.2,
    particle_density: 1.0,
    glow_intensity: 0.9,
    default_color: '#A855F7',
    dash_style: 'dashed',
    is_gpu_accelerated: true,
  },
  {
    code: 'dotted_amber_pulse',
    name: 'Línea Punteada Ámbar',
    description: 'Ruta alternativa o desafío opcional con pulsación ámbar.',
    preset: 'dotted_line',
    animation_speed: 0.8,
    particle_density: 0.5,
    glow_intensity: 0.6,
    default_color: '#F59E0B',
    dash_style: 'dotted',
    is_gpu_accelerated: true,
  },
  {
    code: 'boss_threat_pulse',
    name: 'Pulso de Alerta Desafío Final',
    description: 'Efecto de amenaza carmesí para el proyecto integrador o examen de certificación.',
    preset: 'pulse_glow',
    animation_speed: 1.8,
    particle_density: 2.0,
    glow_intensity: 1.2,
    default_color: '#EF4444',
    dash_style: 'solid',
    is_gpu_accelerated: true,
  },
];

for (const effect of visualEffects) {
  dbKoda.visual_effects.updateOne({ code: effect.code }, { $set: effect }, { upsert: true });
}

// 3. Pistas Profesionales (Tracks)
const tracks = [
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

for (const track of tracks) {
  dbKoda.tracks.updateOne({ slug: track.slug }, { $set: track }, { upsert: true });
}

// 4. Cursos en Grafo DAG
const courses = [
  {
    slug: 'python-core',
    track_slug: 'python',
    name: 'Fundamentos de Programación con Python 3.12',
    description: 'Aprende los conceptos fundamentales de la programación con la sintaxis más limpia y amigable.',
    color: '#38BDF8',
    icon: 'IconBrandPython',
    topology: { tier: 0, lane: 0 },
    prerequisites: [],
    edges: [
      { target_course_slug: 'frontend-core', connection_type: 'unlocks', visual_effect_code: 'energy_beam_solid', edge_color: '#10B981' },
      { target_course_slug: 'backend-core', connection_type: 'unlocks', visual_effect_code: 'laser_flow_fast', edge_color: '#8B5CF6' },
      { target_course_slug: 'devops-core', connection_type: 'unlocks', visual_effect_code: 'dotted_amber_pulse', edge_color: '#F59E0B' },
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
    prerequisites: ['python-core'],
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
    prerequisites: ['python-core'],
    edges: [
      { target_course_slug: 'fastapi-async', connection_type: 'unlocks', visual_effect_code: 'laser_flow_fast', edge_color: '#8B5CF6' },
      { target_course_slug: 'django-enterprise', connection_type: 'unlocks', visual_effect_code: 'dotted_amber_pulse', edge_color: '#10B981' },
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
    prerequisites: ['python-core'],
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

for (const course of courses) {
  dbKoda.courses.updateOne({ slug: course.slug }, { $set: course }, { upsert: true });
}

// 5. 12 Módulos Canónicos de Python 3.12
const modules = [
  { slug: 'fundamentos-de-python', course_slug: 'python-core', title: 'Fundamentos de Python', objective: 'Dominar print(), cadenas, números, indentación y comentarios.', position: 1, total_sections: 8, min_stars_percentage: 80, is_active: true },
  { slug: 'variables-y-tipos-de-datos', course_slug: 'python-core', title: 'Variables y Tipos de Datos', objective: 'Almacenamiento en memoria, int, float, str, bool y función inspectora type().', position: 2, total_sections: 10, min_stars_percentage: 80, is_active: true },
  { slug: 'operadores-y-expresiones', course_slug: 'python-core', title: 'Operadores y Expresiones', objective: 'Aritmética básica, comparadores y operadores lógicos and, or, not.', position: 3, total_sections: 8, min_stars_percentage: 80, is_active: true },
  { slug: 'condicionales-y-control-flujo', course_slug: 'python-core', title: 'Condicionales y Control de Flujo', objective: 'Toma de decisiones lógicas con bloques if, elif y else.', position: 4, total_sections: 8, min_stars_percentage: 80, is_active: true },
  { slug: 'bucles-e-iteracion', course_slug: 'python-core', title: 'Bucles e Iteración', objective: 'Automatización de tareas repetitivas con for, while, range, break y continue.', position: 5, total_sections: 8, min_stars_percentage: 80, is_active: true },
  { slug: 'funciones-y-modularidad', course_slug: 'python-core', title: 'Funciones y Modularidad', objective: 'Creación de bloques reutilizables con def, parámetros y return.', position: 6, total_sections: 8, min_stars_percentage: 80, is_active: true },
  { slug: 'listas-y-tuplas', course_slug: 'python-core', title: 'Estructuras de Datos: Listas y Tuplas', objective: 'Colecciones ordenadas, indexación, slicing y mutabilidad.', position: 7, total_sections: 8, min_stars_percentage: 80, is_active: true },
  { slug: 'diccionarios-y-conjuntos', course_slug: 'python-core', title: 'Diccionarios y Conjuntos', objective: 'Mapeo asociativo clave-valor, métodos get() y conjuntos únicos.', position: 8, total_sections: 8, min_stars_percentage: 80, is_active: true },
  { slug: 'manejo-de-errores-excepciones', course_slug: 'python-core', title: 'Manejo de Errores y Excepciones', objective: 'Prevención de caídas con bloques de control try, except, else y finally.', position: 9, total_sections: 8, min_stars_percentage: 80, is_active: true },
  { slug: 'modulos-paquetes-entornos', course_slug: 'python-core', title: 'Módulos, Paquetes y Entornos', objective: 'Organización modular con import, math, random y entornos venv.', position: 10, total_sections: 8, min_stars_percentage: 80, is_active: true },
  { slug: 'programacion-orientada-a-objetos', course_slug: 'python-core', title: 'Programación Orientada a Objetos', objective: 'Modelado con clases, instancias, atributos, métodos y constructor __init__.', position: 11, total_sections: 8, min_stars_percentage: 80, is_active: true },
  { slug: 'proyecto-final-integrador', course_slug: 'python-core', title: 'Proyecto Final Integrador', objective: 'Aplicación integral de todos los conceptos y certificación Koda.', position: 12, total_sections: 8, min_stars_percentage: 80, is_active: true },
];

for (const mod of modules) {
  dbKoda.modules.updateOne({ slug: mod.slug }, { $set: mod }, { upsert: true });
}

// 6. Secciones del Módulo 01
const sections = [
  { slug: 'py-m01-s01', module_slug: 'fundamentos-de-python', title: '¿Qué es Python y cómo se ejecuta?', position: 1, total_lessons: 4, xp_reward: 50, is_active: true },
  { slug: 'py-m01-s02', module_slug: 'fundamentos-de-python', title: 'Tu primer print() y texto en pantalla', position: 2, total_lessons: 4, xp_reward: 50, is_active: true },
  { slug: 'py-m01-s03', module_slug: 'fundamentos-de-python', title: 'Números enteros y operaciones simples', position: 3, total_lessons: 4, xp_reward: 50, is_active: true },
  { slug: 'py-m01-s04', module_slug: 'fundamentos-de-python', title: 'Comentarios: notas para humanos (#)', position: 4, total_lessons: 4, xp_reward: 50, is_active: true },
  { slug: 'py-m01-s05', module_slug: 'fundamentos-de-python', title: 'Indentación y estructura visual limpia', position: 5, total_lessons: 4, xp_reward: 50, is_active: true },
  { slug: 'py-m01-s06', module_slug: 'fundamentos-de-python', title: 'Combinando texto y números en pantalla', position: 6, total_lessons: 4, xp_reward: 50, is_active: true },
  { slug: 'py-m01-s07', module_slug: 'fundamentos-de-python', title: 'Lectura y comprensión de SyntaxError', position: 7, total_lessons: 4, xp_reward: 50, is_active: true },
  { slug: 'py-m01-s08', module_slug: 'fundamentos-de-python', title: 'Desafío de consolidación del Módulo 01', position: 8, total_lessons: 4, xp_reward: 100, is_active: true },
];

for (const section of sections) {
  dbKoda.sections.updateOne({ slug: section.slug }, { $set: section }, { upsert: true });
}

// 7. Micro-lecciones con Tríada Evaluativa
const lessons = [
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
      test_cases: [{ input: '', expected_output: '¡Hola, Koda!\n', description: 'Debe imprimir exactamente ¡Hola, Koda!' }],
    },
    item_2_quiz: {
      prompt: '¿Cuál es la principal ventaja de Python para quienes aprenden a programar?',
      options: [
        { id: 'a', text: 'Su sintaxis limpia se asemeja al lenguaje humano cotidiano', is_correct: true, feedback: '¡Exacto! Python fue diseñado para que las personas lean código fácilmente.' },
        { id: 'b', text: 'Obliga a usar punto y coma al final de cada línea', is_correct: false, feedback: 'En Python no se utilizan puntos y comas obligatorios.' },
        { id: 'c', text: 'Solo funciona en navegadores web antiguos', is_correct: false, feedback: 'Python es un lenguaje universal que corre en servidores y la nube.' },
        { id: 'd', text: 'No permite manipular números ni textos', is_correct: false, feedback: 'Python maneja datos de todo tipo con gran versatilidad.' },
      ],
    },
    item_3_prediction: {
      prompt: '¿Qué resultado mostrará en la terminal el comando print("Koda")?',
      code_snippet: 'print("Koda")',
      target_type: 'predict_output',
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
      test_cases: [{ input: '', expected_output: 'Inicio\nFin\n', description: 'Debe imprimir Inicio y luego Fin en líneas separadas' }],
    },
    item_2_quiz: {
      prompt: 'Si ejecutas dos instrucciones print(), ¿en qué orden se mostrarán sus mensajes?',
      options: [
        { id: 'a', text: 'De arriba hacia abajo, en el orden en que fueron escritas', is_correct: true, feedback: '¡Correcto! Los programas se ejecutan secuencialmente de arriba a abajo.' },
        { id: 'b', text: 'En orden alfabético automático', is_correct: false, feedback: 'Python no reorganiza tus líneas por orden alfabético.' },
        { id: 'c', text: 'Al azar cada vez que corre el programa', is_correct: false, feedback: 'El orden de ejecución es determinista y predecible.' },
        { id: 'd', text: 'De abajo hacia arriba siempre', is_correct: false, feedback: 'El flujo de control lee de la primera línea hacia la última.' },
      ],
    },
    item_3_prediction: {
      prompt: 'Observa este código. ¿Cuál será la segunda palabra que aparecerá en pantalla?',
      code_snippet: 'print("Uno")\nprint("Dos")',
      target_type: 'predict_output',
      expected_answer: 'Dos',
      hint: 'La segunda línea se ejecuta inmediatamente después de la primera.',
    },
    xp_reward: 15,
    is_active: true,
  },
  {
    slug: 'py-m01-s02-l01',
    section_slug: 'py-m01-s02',
    title: 'Cadenas de texto y comillas',
    position: 1,
    theory: {
      step1: 'Los textos en programación se conocen formalmente como cadenas (strings).',
      step2: 'Para que Python sepa que es texto, debes envolverlo en comillas dobles "..." o simples \'...\'.',
      step3: 'Si olvidas las comillas, Python pensará que el texto es una variable o función.',
      code_snippet: 'print("Aprendiendo Python")',
    },
    item_1_console: {
      prompt: 'Imprime en pantalla la frase: Koda es genial',
      initial_code: '# Usa print() con comillas\n',
      solution_code: 'print("Koda es genial")',
      test_cases: [{ input: '', expected_output: 'Koda es genial\n', description: 'Debe imprimir Koda es genial' }],
    },
    item_2_quiz: {
      prompt: '¿Cuál de las siguientes líneas define correctamente un texto para imprimir en Python?',
      options: [
        { id: 'a', text: 'print("Hola")', is_correct: true, feedback: '¡Excelente! Las comillas dobles delimitan el texto correctamente.' },
        { id: 'b', text: 'print(Hola)', is_correct: false, feedback: 'Sin comillas, Python generará un NameError.' },
        { id: 'c', text: 'print<<Hola>>', is_correct: false, feedback: 'Esa no es sintaxis de Python.' },
        { id: 'd', text: 'print[Hola]', is_correct: false, feedback: 'Los corchetes se utilizan para listas.' },
      ],
    },
    item_3_prediction: {
      prompt: '¿Qué error provocará ejecutar print(Python)? (Tip: falta un delimitador de sintaxis)',
      code_snippet: 'print(Python)',
      target_type: 'bug_hunt',
      expected_answer: 'NameError',
      hint: 'Al no tener comillas, Python busca una variable con ese nombre y falla al no encontrarla.',
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
      step2: 'Puedes usar la que prefieras, siempre que abras y cierres con la misma.',
      step3: 'Si tu texto contiene una comilla simple interna, envuélvelo en comillas dobles para evitar conflictos.',
      code_snippet: 'print(\'Texto simple\')\nprint("It\'s Koda")',
    },
    item_1_console: {
      prompt: 'Imprime la frase: \'Python es divertido\' utilizando comillas dobles alrededor.',
      initial_code: '# Escribe tu instrucción print\n',
      solution_code: 'print("\'Python es divertido\'")',
      test_cases: [{ input: '', expected_output: "'Python es divertido'\n", description: 'Debe imprimir el texto con comillas internas' }],
    },
    item_2_quiz: {
      prompt: '¿Qué sucede si abres una cadena con comilla doble y la cierras con comilla simple?',
      options: [
        { id: 'a', text: 'Se genera un SyntaxError porque las comillas no coinciden', is_correct: true, feedback: '¡Exacto! El carácter de apertura debe coincidir con el de cierre.' },
        { id: 'b', text: 'Python lo corrige automáticamente', is_correct: false, feedback: 'Los errores de delimitadores son bloqueantes.' },
        { id: 'c', text: 'El programa imprime la mitad del texto', is_correct: false, feedback: 'El intérprete aborta antes de ejecutar.' },
        { id: 'd', text: 'Se crea un número entero', is_correct: false, feedback: 'Un texto no se convierte en número.' },
      ],
    },
    item_3_prediction: {
      prompt: '¿Cuál será la salida de print(\'Hola\' + \' \' + \'Mundo\')?',
      code_snippet: "print('Hola' + ' ' + 'Mundo')",
      target_type: 'predict_output',
      expected_answer: 'Hola Mundo',
      hint: 'El signo + entre cadenas une los textos sin agregar espacios extras por su cuenta.',
    },
    xp_reward: 15,
    is_active: true,
  },
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
      test_cases: [{ input: '', expected_output: '2026\n', description: 'Debe imprimir el número 2026' }],
    },
    item_2_quiz: {
      prompt: '¿Cuál es la diferencia entre 100 y "100" en Python?',
      options: [
        { id: 'a', text: '100 es un número entero para cálculos y "100" es una cadena de texto', is_correct: true, feedback: '¡Perfecto! Tienen tipos de datos distintos: int vs str.' },
        { id: 'b', text: 'No hay ninguna diferencia', is_correct: false, feedback: 'Tienen tipos de datos completamente distintos.' },
        { id: 'c', text: '100 es texto y "100" es un número', is_correct: false, feedback: 'Las comillas indican texto.' },
        { id: 'd', text: '"100" causa un error de sintaxis', is_correct: false, feedback: 'Es un string perfectamente válido.' },
      ],
    },
    item_3_prediction: {
      prompt: '¿Qué valor imprimirá en consola print(10 + 5)?',
      code_snippet: 'print(10 + 5)',
      target_type: 'predict_output',
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
      test_cases: [{ input: '', expected_output: '56\n', description: 'Debe imprimir 56' }],
    },
    item_2_quiz: {
      prompt: '¿Qué símbolo se usa para multiplicar dos números en Python?',
      options: [
        { id: 'a', text: 'El asterisco (*)', is_correct: true, feedback: '¡Exacto! El asterisco * es el operador de multiplicación.' },
        { id: 'b', text: 'La letra x', is_correct: false, feedback: 'La letra x es interpretada como variable.' },
        { id: 'c', text: 'El punto (.)', is_correct: false, feedback: 'El punto se utiliza para números decimales.' },
        { id: 'd', text: 'El signo de porcentaje (%)', is_correct: false, feedback: 'El signo % calcula el residuo de la división.' },
      ],
    },
    item_3_prediction: {
      prompt: '¿Cuál es el resultado de print(2 + 3 * 4)?',
      code_snippet: 'print(2 + 3 * 4)',
      target_type: 'predict_output',
      expected_answer: '14',
      hint: 'La multiplicación (3 * 4 = 12) se resuelve antes que la suma (+ 2).',
    },
    xp_reward: 15,
    is_active: true,
  },
];

for (const lesson of lessons) {
  dbKoda.lessons.updateOne({ slug: lesson.slug }, { $set: lesson }, { upsert: true });
}

// 8. Bancos de preguntas oficiales
const questionBanks = [
  {
    module_slug: 'fundamentos-de-python',
    difficulty: 'easy',
    questions: [
      {
        id: 'bnk_py_01_01',
        prompt: '¿Cuál de las siguientes opciones es la forma correcta de imprimir un mensaje en Python?',
        options: [
          { id: 'a', text: 'print("Hola")', is_correct: true, feedback: '¡Correcto! print() con paréntesis y comillas.' },
          { id: 'b', text: 'echo "Hola"', is_correct: false, feedback: 'echo es de Bash/PHP, no de Python.' },
          { id: 'c', text: 'console.log("Hola")', is_correct: false, feedback: 'console.log() es de JavaScript.' },
          { id: 'd', text: 'System.out.println("Hola")', is_correct: false, feedback: 'Esa es la sintaxis de Java.' },
        ],
        explanation: 'En Python 3, print() es una función nativa que recibe los argumentos entre paréntesis.',
      },
      {
        id: 'bnk_py_01_02',
        prompt: '¿Qué carácter se utiliza en Python para escribir un comentario de una sola línea?',
        options: [
          { id: 'a', text: 'El símbolo numeral (#)', is_correct: true, feedback: '¡Exacto! Todo lo que siga al # en esa línea será ignorado.' },
          { id: 'b', text: 'Doble barra (//)', is_correct: false, feedback: 'En Python // es división entera.' },
          { id: 'c', text: 'Signo de exclamación (!)', is_correct: false, feedback: 'El signo ! no se utiliza para comentarios.' },
          { id: 'd', text: 'Guiones dobles (--)', is_correct: false, feedback: '-- es de SQL, no de Python.' },
        ],
        explanation: 'El símbolo numeral (#) le indica al intérprete que ignore el resto de la línea.',
      },
    ],
  },
  {
    module_slug: 'fundamentos-de-python',
    difficulty: 'medium',
    questions: [
      {
        id: 'bnk_py_01_04',
        prompt: '¿Cuál será la salida de ejecutar: print("3" + "4")?',
        code_snippet: 'print("3" + "4")',
        options: [
          { id: 'a', text: '"34"', is_correct: true, feedback: '¡Excelente! Al ser cadenas, el operador + las concatena.' },
          { id: 'b', text: '7', is_correct: false, feedback: 'Para obtener 7, deberían ser números sin comillas: 3 + 4.' },
          { id: 'c', text: '12', is_correct: false, feedback: 'No se está multiplicando.' },
          { id: 'd', text: 'SyntaxError', is_correct: false, feedback: 'Concatenar dos cadenas con + es válido.' },
        ],
        explanation: 'El operador + entre dos strings realiza una concatenación textual.',
      },
    ],
  },
];

for (const bank of questionBanks) {
  dbKoda.question_banks.updateOne(
    { module_slug: bank.module_slug, difficulty: bank.difficulty },
    { $set: bank },
    { upsert: true }
  );
}

print('🎉 [Docker Init] ¡Inicialización de datos curriculares completada con éxito en MongoDB!');
