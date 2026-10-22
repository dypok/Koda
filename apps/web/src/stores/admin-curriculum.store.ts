import { create } from 'zustand';

export interface AdminTrack {
  slug: string;
  name: string;
  description: string;
  icon: string;
  badge: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

export interface AdminCourse {
  slug: string;
  track_slug: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  prerequisites: string[];
  is_active: boolean;
}

export interface AdminModule {
  slug: string;
  course_slug: string;
  title: string;
  objective: string;
  position: number;
  total_sections: number;
  min_stars_percentage: number;
  is_active: boolean;
}

export interface AdminSection {
  slug: string;
  module_slug: string;
  title: string;
  position: number;
  total_lessons: number;
  xp_reward: number;
  is_active: boolean;
}

export interface AdminQuizOption {
  id: string;
  text: string;
  is_correct: boolean;
  feedback: string;
}

export interface AdminConsoleTestCase {
  input: string;
  expected_output: string;
  description: string;
}

export interface AdminLesson {
  slug: string;
  section_slug: string;
  title: string;
  position: number;
  theory: {
    step1: string;
    step2: string;
    step3: string;
    code_snippet: string;
  };
  item_1_console: {
    prompt: string;
    initial_code: string;
    solution_code: string;
    test_cases: AdminConsoleTestCase[];
  };
  item_2_quiz: {
    prompt: string;
    options: AdminQuizOption[];
  };
  item_3_prediction: {
    prompt: string;
    code_snippet: string;
    target_type: string;
    expected_answer: string;
    hint: string;
  };
  xp_reward: number;
  is_active: boolean;
}

interface CurriculumState {
  tracks: AdminTrack[];
  modules: AdminModule[];
  sections: AdminSection[];
  lessons: AdminLesson[];
  
  // Borrador y control de guardado (buffer)
  draftTracks: AdminTrack[];
  draftModules: AdminModule[];
  draftSections: AdminSection[];
  draftLessons: AdminLesson[];
  isDirty: boolean;
  pendingChangesCount: number;
  selectedTrackSlug: string;
  selectedModuleSlug: string;
  selectedSectionSlug: string;
  activeInspectorBlock: 'theory' | 'code' | 'console' | 'quiz' | 'prediction' | null;

  // Acciones
  initCurriculum: () => void;
  selectTrack: (slug: string) => void;
  selectModule: (slug: string) => void;
  selectSection: (slug: string) => void;
  setActiveInspectorBlock: (block: 'theory' | 'code' | 'console' | 'quiz' | 'prediction' | null) => void;

  // Añadir
  addTrack: (track: Omit<AdminTrack, 'sort_order' | 'is_active'>) => void;
  addModule: (module: Omit<AdminModule, 'position' | 'total_sections' | 'min_stars_percentage' | 'is_active'>) => void;
  addSection: (section: Omit<AdminSection, 'position' | 'total_lessons' | 'is_active'>) => void;
  addLessonToSection: (sectionSlug: string, lessonTitle?: string) => string;

  // Modificar
  updateTrack: (slug: string, updates: Partial<AdminTrack>) => void;
  updateModule: (slug: string, updates: Partial<AdminModule>) => void;
  updateSection: (slug: string, updates: Partial<AdminSection>) => void;
  updateLesson: (slug: string, updates: Partial<AdminLesson>) => void;

  // Eliminar
  deleteTrack: (slug: string) => void;
  deleteModule: (slug: string) => void;
  deleteSection: (slug: string) => void;
  deleteLesson: (slug: string) => void;

  // Persistencia explícita
  saveChanges: () => { success: boolean; message: string };
  discardChanges: () => void;
}

const LOCAL_STORAGE_KEY = 'koda_admin_curriculum_v1';

const INITIAL_TRACKS: AdminTrack[] = [
  {
    slug: 'python',
    name: 'Python Specialist',
    description: 'Ruta integral: Fundamentos, Programacion Modular, POO, Backend y Computacion Cientifica.',
    icon: 'Terminal',
    badge: 'Especialista',
    color: '#38BDF8',
    sort_order: 1,
    is_active: true,
  },
  {
    slug: 'typescript-web',
    name: 'TypeScript Fullstack Core',
    description: 'Arquitectura frontend reactiva, Next.js 16, APIs asincronas y tipado estricto.',
    icon: 'Code',
    badge: 'Nucleo',
    color: '#3B82F6',
    sort_order: 2,
    is_active: true,
  },
  {
    slug: 'rust-systems',
    name: 'Rust Systems Architecture',
    description: 'Gestion de memoria, concurrencia sin carreras de datos y alto rendimiento.',
    icon: 'Cpu',
    badge: 'Sistemas',
    color: '#F97316',
    sort_order: 3,
    is_active: true,
  },
];

const INITIAL_MODULES: AdminModule[] = [
  {
    slug: 'fundamentos-de-python',
    course_slug: 'python',
    title: 'Fundamentos de Python y Entorno',
    objective: 'Dominar la funcion print(), operadores, tipos primitivos, comentarios y sintaxis base.',
    position: 1,
    total_sections: 4,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'variables-y-tipos-de-datos',
    course_slug: 'python',
    title: 'Variables y Tipos de Datos',
    objective: 'Almacenamiento en memoria, int, float, str, bool y funcion inspectora type().',
    position: 2,
    total_sections: 3,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'condicionales-y-control-flujo',
    course_slug: 'python',
    title: 'Condicionales y Control de Flujo',
    objective: 'Toma de decisiones con bloques if, elif y else sin anidacion excesiva.',
    position: 3,
    total_sections: 4,
    min_stars_percentage: 80,
    is_active: true,
  },
  {
    slug: 'bucles-e-iteracion',
    course_slug: 'python',
    title: 'Bucles e Iteracion Sistemica',
    objective: 'Automatizacion repetitiva con for, while, range, break y continue.',
    position: 4,
    total_sections: 4,
    min_stars_percentage: 80,
    is_active: true,
  },
];

const INITIAL_SECTIONS: AdminSection[] = [
  {
    slug: 'py-m01-s01',
    module_slug: 'fundamentos-de-python',
    title: 'Que es Python y como se ejecuta',
    position: 1,
    total_lessons: 2,
    xp_reward: 50,
    is_active: true,
  },
  {
    slug: 'py-m01-s02',
    module_slug: 'fundamentos-de-python',
    title: 'Tu primer print() y texto en pantalla',
    position: 2,
    total_lessons: 1,
    xp_reward: 50,
    is_active: true,
  },
  {
    slug: 'py-m02-s01',
    module_slug: 'variables-y-tipos-de-datos',
    title: 'Asignacion de memoria y variables',
    position: 1,
    total_lessons: 1,
    xp_reward: 60,
    is_active: true,
  },
];

const INITIAL_LESSONS: AdminLesson[] = [
  {
    slug: 'py-m01-s01-l01',
    section_slug: 'py-m01-s01',
    title: 'Bienvenido al universo Python',
    position: 1,
    theory: {
      step1: 'Python es un lenguaje interpretado y de alto nivel disenado para ser claro y legible.',
      step2: 'Para comunicarnos con la terminal usamos la funcion nativa print(). Todo lo que coloquemos dentro de sus parentesis se muestra en consola.',
      step3: 'Cada cadena de texto literal debe ir delimitada entre comillas dobles o simples dentro de print().',
      code_snippet: 'print("Hola, Koda!")',
    },
    item_1_console: {
      prompt: 'Imprime el mensaje de bienvenida para despertar el entorno usando print("Hola, Koda!").',
      initial_code: '# Escribe tu instruccion print aqui\n',
      solution_code: 'print("Hola, Koda!")',
      test_cases: [
        {
          input: '',
          expected_output: 'Hola, Koda!\n',
          description: 'Debe emitir exactamente Hola, Koda!',
        },
      ],
    },
    item_2_quiz: {
      prompt: 'Cual es el proposito principal de la instruccion print() en Python?',
      options: [
        {
          id: 'a',
          text: 'Mostrar un mensaje o resultado de texto en la pantalla o consola.',
          is_correct: true,
          feedback: 'Correcto. print() envia datos directamente a la salida estandar.',
        },
        {
          id: 'b',
          text: 'Guardar el archivo de codigo en el disco duro.',
          is_correct: false,
          feedback: 'print() no guarda archivos, unicamente muestra texto en la salida.',
        },
        {
          id: 'c',
          text: 'Apagar la computadora al terminar la ejecucion.',
          is_correct: false,
          feedback: 'print() no controla el hardware del equipo.',
        },
        {
          id: 'd',
          text: 'Traducir codigo de Python a otro lenguaje.',
          is_correct: false,
          feedback: 'print() no traduce codigo, solo emite informacion al usuario.',
        },
      ],
    },
    item_3_prediction: {
      prompt: 'Que resultado mostrara en consola la instruccion print("Koda")?',
      code_snippet: 'print("Koda")',
      target_type: 'predict_output',
      expected_answer: 'Koda',
      hint: 'La funcion print muestra el contenido sin las comillas delimitadoras.',
    },
    xp_reward: 25,
    is_active: true,
  },
  {
    slug: 'py-m01-s01-l02',
    section_slug: 'py-m01-s01',
    title: 'Numeros y calculos directos',
    position: 2,
    theory: {
      step1: 'En Python los numeros no llevan comillas. Si escribes comillas, Python lo interpreta como texto literal.',
      step2: 'Puedes ejecutar operaciones matematicas directas dentro de print(), como sumas (+), restas (-), multiplicaciones (*) y divisiones (/).',
      step3: 'Los operadores siguen la jerarquia aritmetica estandar de la matematica clasica.',
      code_snippet: 'print(10 + 5)\nprint(4 * 2)',
    },
    item_1_console: {
      prompt: 'Calcula e imprime el resultado de multiplicar 7 por 6 usando print(7 * 6).',
      initial_code: '# Calcula 7 por 6\n',
      solution_code: 'print(7 * 6)',
      test_cases: [
        {
          input: '',
          expected_output: '42\n',
          description: 'Debe imprimir 42',
        },
      ],
    },
    item_2_quiz: {
      prompt: 'Que diferencia hay entre print("42") y print(42)?',
      options: [
        {
          id: 'a',
          text: 'El primero es una cadena de texto (str) y el segundo es un numero entero (int).',
          is_correct: true,
          feedback: 'Exacto. Las comillas definen tipos de texto mientras los numeros directos son int.',
        },
        {
          id: 'b',
          text: 'El primero produce un error de sintaxis.',
          is_correct: false,
          feedback: 'Ambos son validos en Python, pero tienen tipos de datos diferentes.',
        },
        {
          id: 'c',
          text: 'No hay ninguna diferencia interna en memoria.',
          is_correct: false,
          feedback: 'Si hay diferencia: el tipo de dato afecta que operaciones puedes hacer despues.',
        },
        {
          id: 'd',
          text: 'El segundo imprime siempre cero.',
          is_correct: false,
          feedback: 'El segundo imprime exactamente el valor numerico 42.',
        },
      ],
    },
    item_3_prediction: {
      prompt: 'Que imprimira la operacion print(20 - 5)?',
      code_snippet: 'print(20 - 5)',
      target_type: 'predict_output',
      expected_answer: '15',
      hint: 'Resta 5 de 20.',
    },
    xp_reward: 25,
    is_active: true,
  },
];

export const useAdminCurriculumStore = create<CurriculumState>((set, get) => ({
  tracks: INITIAL_TRACKS,
  modules: INITIAL_MODULES,
  sections: INITIAL_SECTIONS,
  lessons: INITIAL_LESSONS,

  draftTracks: INITIAL_TRACKS,
  draftModules: INITIAL_MODULES,
  draftSections: INITIAL_SECTIONS,
  draftLessons: INITIAL_LESSONS,

  isDirty: false,
  pendingChangesCount: 0,
  selectedTrackSlug: 'python',
  selectedModuleSlug: 'fundamentos-de-python',
  selectedSectionSlug: 'py-m01-s01',
  activeInspectorBlock: null,

  initCurriculum: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          tracks: parsed.tracks || INITIAL_TRACKS,
          modules: parsed.modules || INITIAL_MODULES,
          sections: parsed.sections || INITIAL_SECTIONS,
          lessons: parsed.lessons || INITIAL_LESSONS,
          draftTracks: parsed.tracks || INITIAL_TRACKS,
          draftModules: parsed.modules || INITIAL_MODULES,
          draftSections: parsed.sections || INITIAL_SECTIONS,
          draftLessons: parsed.lessons || INITIAL_LESSONS,
          isDirty: false,
          pendingChangesCount: 0,
        });
      }
    } catch {
      // Ignorar fallo de parseo y mantener estado inicial
    }
  },

  selectTrack: (slug: string) => {
    const modulesOfTrack = get().draftModules.filter((m) => m.course_slug === slug);
    const firstModule = modulesOfTrack[0]?.slug || '';
    const sectionsOfModule = get().draftSections.filter((s) => s.module_slug === firstModule);
    const firstSection = sectionsOfModule[0]?.slug || '';

    set({
      selectedTrackSlug: slug,
      selectedModuleSlug: firstModule,
      selectedSectionSlug: firstSection,
    });
  },

  selectModule: (slug: string) => {
    const sectionsOfModule = get().draftSections.filter((s) => s.module_slug === slug);
    const firstSection = sectionsOfModule[0]?.slug || '';

    set({
      selectedModuleSlug: slug,
      selectedSectionSlug: firstSection,
    });
  },

  selectSection: (slug: string) => {
    set({ selectedSectionSlug: slug });
  },

  setActiveInspectorBlock: (block) => {
    set({ activeInspectorBlock: block });
  },

  addTrack: (trackData) => {
    const newTrack: AdminTrack = {
      ...trackData,
      sort_order: get().draftTracks.length + 1,
      is_active: true,
    };
    set((state) => ({
      draftTracks: [...state.draftTracks, newTrack],
      isDirty: true,
      pendingChangesCount: state.pendingChangesCount + 1,
      selectedTrackSlug: newTrack.slug,
    }));
  },

  addModule: (moduleData) => {
    const newModule: AdminModule = {
      ...moduleData,
      position: get().draftModules.filter((m) => m.course_slug === moduleData.course_slug).length + 1,
      total_sections: 0,
      min_stars_percentage: 80,
      is_active: true,
    };
    set((state) => ({
      draftModules: [...state.draftModules, newModule],
      isDirty: true,
      pendingChangesCount: state.pendingChangesCount + 1,
      selectedModuleSlug: newModule.slug,
    }));
  },

  addSection: (sectionData) => {
    const newSection: AdminSection = {
      ...sectionData,
      position: get().draftSections.filter((s) => s.module_slug === sectionData.module_slug).length + 1,
      total_lessons: 1,
      is_active: true,
    };

    // Crear de inmediato la primera leccion canónica siguiendo el orden pedagogico oficial
    const initialLessonSlug = `${newSection.slug}-l01`;
    const canonicalFirstLesson: AdminLesson = {
      slug: initialLessonSlug,
      section_slug: newSection.slug,
      title: `${newSection.title}: Introduccion`,
      position: 1,
      theory: {
        step1: `En esta sesion aprenderas los fundamentos esenciales sobre ${newSection.title}.`,
        step2: 'Comprende el concepto base analizando la sintaxis requerida y su funcion dentro del lenguaje.',
        step3: 'Aplica el principio escribiendo la estructura limpia respetando las convenciones oficiales.',
        code_snippet: '# Ejemplo base de ' + newSection.title + '\nprint("Listo para programar")',
      },
      item_1_console: {
        prompt: 'Ejecuta tu primer codigo sobre este concepto en la terminal.',
        initial_code: '# Escribe tu solucion aqui\n',
        solution_code: 'print("Listo para programar")',
        test_cases: [
          {
            input: '',
            expected_output: 'Listo para programar\n',
            description: 'Debe emitir la salida correcta',
          },
        ],
      },
      item_2_quiz: {
        prompt: `Cual es el principio central de ${newSection.title}?`,
        options: [
          {
            id: 'a',
            text: 'Permite estructurar instrucciones claras y reproducibles en el sistema.',
            is_correct: true,
            feedback: 'Correcto. Ese es el proposito fundamental.',
          },
          {
            id: 'b',
            text: 'Reemplaza por completo el sistema operativo del equipo.',
            is_correct: false,
            feedback: 'No tiene relacion con el reemplazo del sistema operativo.',
          },
          {
            id: 'c',
            text: 'Genera codigo que no puede ser leido por humanos.',
            is_correct: false,
            feedback: 'Al contrario, el codigo debe ser legible y mantenible.',
          },
          {
            id: 'd',
            text: 'Es una instruccion exclusiva de lenguajes compilados en C.',
            is_correct: false,
            feedback: 'Es un concepto nativo del lenguaje seleccionado.',
          },
        ],
      },
      item_3_prediction: {
        prompt: 'Que valor producira este bloque tras ejecutarse?',
        code_snippet: 'print("Koda")',
        target_type: 'predict_output',
        expected_answer: 'Koda',
        hint: 'Observa la salida exacta sin comillas.',
      },
      xp_reward: 30,
      is_active: true,
    };

    set((state) => ({
      draftSections: [...state.draftSections, newSection],
      draftLessons: [...state.draftLessons, canonicalFirstLesson],
      isDirty: true,
      pendingChangesCount: state.pendingChangesCount + 1,
      selectedSectionSlug: newSection.slug,
    }));
  },

  addLessonToSection: (sectionSlug: string, lessonTitle?: string) => {
    const existingLessons = get().draftLessons.filter((l) => l.section_slug === sectionSlug);
    const nextPos = existingLessons.length + 1;
    const padPos = nextPos < 10 ? `0${nextPos}` : `${nextPos}`;
    const newLessonSlug = `${sectionSlug}-l${padPos}`;

    // Estructura oficial estricta: Teoria (3 pasos) -> Codigo -> Consola -> Quiz (4 opciones A, B, C, D) -> Prediccion
    const newLesson: AdminLesson = {
      slug: newLessonSlug,
      section_slug: sectionSlug,
      title: lessonTitle || `Sesion ${nextPos}: Nuevo Concepto Clave`,
      position: nextPos,
      theory: {
        step1: 'Paso 1 (Anclaje): Que vas a aprender y cual es el objetivo verificable de esta sesion.',
        step2: 'Paso 2 (Mecanica): Como opera la instruccion interna y que efecto produce en memoria o en consola.',
        step3: 'Paso 3 (Regla practica): La regla de sintaxis clave que debes memorizar para evitar errores comunes.',
        code_snippet: '# Bloque de codigo demostrativo\nresultado = "Aprendizaje completado"\nprint(resultado)',
      },
      item_1_console: {
        prompt: 'Escribe el codigo necesario para imprimir "Aprendizaje completado" en consola.',
        initial_code: '# Escribe tu codigo aqui\n',
        solution_code: 'resultado = "Aprendizaje completado"\nprint(resultado)',
        test_cases: [
          {
            input: '',
            expected_output: 'Aprendizaje completado\n',
            description: 'Salida esperada correcta',
          },
        ],
      },
      item_2_quiz: {
        prompt: 'Cual es la forma correcta de aplicar este concepto?',
        options: [
          {
            id: 'a',
            text: 'Definir la instruccion siguiendo la regla y verificar su salida en consola.',
            is_correct: true,
            feedback: 'Correcto. La instruccion cumple con el estandar pedagogico.',
          },
          {
            id: 'b',
            text: 'Omitir las comillas en cadenas de texto literales.',
            is_correct: false,
            feedback: 'Omitir comillas provocara un SyntaxError en Python.',
          },
          {
            id: 'c',
            text: 'Escribir las palabras reservadas con letras mayusculas.',
            is_correct: false,
            feedback: 'Python es sensible a mayusculas; las palabras clave deben ser minusculas.',
          },
          {
            id: 'd',
            text: 'Eliminar toda la indentacion de los bloques de codigo.',
            is_correct: false,
            feedback: 'La indentacion es estructural y obligatoria en Python.',
          },
        ],
      },
      item_3_prediction: {
        prompt: 'Que imprimira la expresion print("Ok")?',
        code_snippet: 'print("Ok")',
        target_type: 'predict_output',
        expected_answer: 'Ok',
        hint: 'Devuelve la cadena literal.',
      },
      xp_reward: 25,
      is_active: true,
    };

    set((state) => ({
      draftLessons: [...state.draftLessons, newLesson],
      draftSections: state.draftSections.map((s) =>
        s.slug === sectionSlug ? { ...s, total_lessons: s.total_lessons + 1 } : s
      ),
      isDirty: true,
      pendingChangesCount: state.pendingChangesCount + 1,
    }));

    return newLessonSlug;
  },

  updateTrack: (slug: string, updates: Partial<AdminTrack>) => {
    set((state) => ({
      draftTracks: state.draftTracks.map((t) => (t.slug === slug ? { ...t, ...updates } : t)),
      isDirty: true,
      pendingChangesCount: state.pendingChangesCount + 1,
    }));
  },

  updateModule: (slug: string, updates: Partial<AdminModule>) => {
    set((state) => ({
      draftModules: state.draftModules.map((m) => (m.slug === slug ? { ...m, ...updates } : m)),
      isDirty: true,
      pendingChangesCount: state.pendingChangesCount + 1,
    }));
  },

  updateSection: (slug: string, updates: Partial<AdminSection>) => {
    set((state) => ({
      draftSections: state.draftSections.map((s) => (s.slug === slug ? { ...s, ...updates } : s)),
      isDirty: true,
      pendingChangesCount: state.pendingChangesCount + 1,
    }));
  },

  updateLesson: (slug: string, updates: Partial<AdminLesson>) => {
    set((state) => ({
      draftLessons: state.draftLessons.map((l) => (l.slug === slug ? { ...l, ...updates } : l)),
      isDirty: true,
      pendingChangesCount: state.pendingChangesCount + 1,
    }));
  },

  deleteTrack: (slug: string) => {
    set((state) => {
      const remainingTracks = state.draftTracks.filter((t) => t.slug !== slug);
      const remainingModules = state.draftModules.filter((m) => m.course_slug !== slug);
      const deletedModuleSlugs = state.draftModules.filter((m) => m.course_slug === slug).map((m) => m.slug);
      const remainingSections = state.draftSections.filter((s) => !deletedModuleSlugs.includes(s.module_slug));
      const deletedSectionSlugs = state.draftSections.filter((s) => deletedModuleSlugs.includes(s.module_slug)).map((s) => s.slug);
      const remainingLessons = state.draftLessons.filter((l) => !deletedSectionSlugs.includes(l.section_slug));

      return {
        draftTracks: remainingTracks,
        draftModules: remainingModules,
        draftSections: remainingSections,
        draftLessons: remainingLessons,
        selectedTrackSlug: remainingTracks[0]?.slug || '',
        selectedModuleSlug: remainingModules[0]?.slug || '',
        selectedSectionSlug: remainingSections[0]?.slug || '',
        isDirty: true,
        pendingChangesCount: state.pendingChangesCount + 1,
      };
    });
  },

  deleteModule: (slug: string) => {
    set((state) => {
      const remainingModules = state.draftModules.filter((m) => m.slug !== slug);
      const remainingSections = state.draftSections.filter((s) => s.module_slug !== slug);
      const deletedSectionSlugs = state.draftSections.filter((s) => s.module_slug === slug).map((s) => s.slug);
      const remainingLessons = state.draftLessons.filter((l) => !deletedSectionSlugs.includes(l.section_slug));

      return {
        draftModules: remainingModules,
        draftSections: remainingSections,
        draftLessons: remainingLessons,
        selectedModuleSlug: remainingModules[0]?.slug || '',
        selectedSectionSlug: remainingSections[0]?.slug || '',
        isDirty: true,
        pendingChangesCount: state.pendingChangesCount + 1,
      };
    });
  },

  deleteSection: (slug: string) => {
    set((state) => {
      const remainingSections = state.draftSections.filter((s) => s.slug !== slug);
      const remainingLessons = state.draftLessons.filter((l) => l.section_slug !== slug);

      return {
        draftSections: remainingSections,
        draftLessons: remainingLessons,
        selectedSectionSlug: remainingSections[0]?.slug || '',
        isDirty: true,
        pendingChangesCount: state.pendingChangesCount + 1,
      };
    });
  },

  deleteLesson: (slug: string) => {
    set((state) => {
      const lessonToDelete = state.draftLessons.find((l) => l.slug === slug);
      const remainingLessons = state.draftLessons.filter((l) => l.slug !== slug);

      return {
        draftLessons: remainingLessons,
        draftSections: state.draftSections.map((s) =>
          lessonToDelete && s.slug === lessonToDelete.section_slug
            ? { ...s, total_lessons: Math.max(0, s.total_lessons - 1) }
            : s
        ),
        isDirty: true,
        pendingChangesCount: state.pendingChangesCount + 1,
      };
    });
  },

  saveChanges: () => {
    const { draftTracks, draftModules, draftSections, draftLessons } = get();

    // Validacion de consistencia antes de persistir
    if (draftTracks.length === 0) {
      return { success: false, message: 'Debe existir al menos una ruta formativa activa.' };
    }

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            tracks: draftTracks,
            modules: draftModules,
            sections: draftSections,
            lessons: draftLessons,
            updatedAt: new Date().toISOString(),
          })
        );
      }

      set({
        tracks: draftTracks,
        modules: draftModules,
        sections: draftSections,
        lessons: draftLessons,
        isDirty: false,
        pendingChangesCount: 0,
      });

      return { success: true, message: 'Todos los cambios fueron guardados y aplicados correctamente.' };
    } catch {
      return { success: false, message: 'Fallo al escribir en almacenamiento persistente.' };
    }
  },

  discardChanges: () => {
    const { tracks, modules, sections, lessons } = get();
    set({
      draftTracks: tracks,
      draftModules: modules,
      draftSections: sections,
      draftLessons: lessons,
      isDirty: false,
      pendingChangesCount: 0,
    });
  },
}));
