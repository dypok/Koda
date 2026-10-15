import type { RawModule } from './types.ts';

const LANG_ID = 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

export const PYTHON1_MODULES: RawModule[] = [
  // M01
  {
    id: 'py1_mod_01',
    language_id: LANG_ID,
    code: 'PY1_M01',
    slug: 'fundamentos-de-python',
    title: 'Entorno de Desarrollo y Primeros Pasos',
    objective: 'Configurar un entorno profesional con VS Code y venv, dominar la función print() y la sintaxis base.',
    description: 'Aprende qué es Python, cómo se ejecuta tu código, cómo configurar un entorno virtual y cómo comunicarte con la consola.',
    folder: 'python1/01_fundamentos',
    course_slug: 'python-1',
    position: 1,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 150 },
    sections: [
      {
        id: 'sec_py1_01_01',
        code: 'S01',
        title: 'El Intérprete y la Función print()',
        slug: 'interprete-y-print',
        position: 1,
        type: 'theory',
        estimated_minutes: 15,
        xp_on_complete: 30,
        lessons: [
          {
            id: 'les_py1_01_01',
            code: 'L01',
            title: '¿Cómo Piensa Python y Cómo se Ejecuta?',
            slug: 'como-piensa-python',
            position: 1,
            concept_id: 'py-runtime',
            objective: 'Comprender el ciclo de ejecución interpretado de Python frente a lenguajes compilados.',
            theory_markdown: `Python es un lenguaje **interpretado y de alto nivel**. Imagina al intérprete de Python como un traductor simultáneo en las Naciones Unidas: en lugar de exigir que compiles todo un libro de una sola vez antes de leerlo (como C++ o Rust), Python lee tu archivo línea por línea de arriba hacia abajo y lo ejecuta en tiempo real.\n\nPara comunicarnos con el mundo exterior desde nuestro script, utilizamos la función nativa \`print()\`. Todo lo que pongas dentro de sus paréntesis será enviado a la salida estándar (la consola).\n\n> **Analogía del mundo real:** Un script de Python es como una receta de cocina paso a paso. El chef (el intérprete) lee la instrucción 1, la ejecuta en su estación de trabajo, luego pasa a la instrucción 2. Si la instrucción 2 tiene un error ortográfico, se detiene exactamente en esa línea.`,
            examples: [
              {
                title: 'Primer script ejecutable',
                code: '# Línea 1: Mensaje de bienvenida\nprint("¡Hola, programador!")\n\n# Línea 2: Impresión de números y cálculos directos\nprint(42)\nprint(10 + 5)',
                output: '¡Hola, programador!\n42\n15',
                explanation: 'print() puede recibir texto entre comillas o expresiones numéricas directamente.'
              }
            ],
            common_errors: 'Olvidar cerrar comillas (SyntaxError: unterminated string literal) o escribir Print con mayúscula inicial (NameError: name "Print" is not defined; Python es sensible a mayúsculas).',
            mini_exercise: {
              starter_code: '# Imprime tu nombre y tu lenguaje favorito en dos líneas\nprint("...")',
              instructions: 'Usa print() para mostrar tu nombre en la primera línea y Python 3 en la segunda.',
              solution: 'print("Dev")\nprint("Python 3")'
            },
            key_takeaways: [
              'Python se ejecuta línea por línea de forma interpretada.',
              'print() envía datos a la terminal.',
              'Python distingue estrictamente entre mayúsculas y minúsculas.'
            ],
            exercise: {
              id: 'ex_py1_01_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Qué mostrará la consola tras ejecutar este código?',
              prompt_code: 'print("3" + "3")\nprint(3 + 3)',
              options: [
                { id: 'a', text: '33 en la primera línea y 6 en la segunda' },
                { id: 'b', text: '6 en ambas líneas' },
                { id: 'c', text: 'Error de tipo' },
                { id: 'd', text: '"3+3"' }
              ],
              correct_option_id: 'a',
              explanation: 'Entre comillas ("3" + "3"), el operador + concatena texto generando "33". Sin comillas (3 + 3), suma aritméticamente generando 6.'
            }
          },
          {
            id: 'les_py1_01_02',
            code: 'L02',
            title: 'Entornos Virtuales (venv) y Comentarios Limpios',
            slug: 'entornos-virtuales-y-comentarios',
            position: 2,
            concept_id: 'py-venv',
            objective: 'Aprender la importancia de aislar dependencias con venv y documentar con comentarios PEP 8.',
            theory_markdown: `En proyectos reales, cada aplicación puede requerir versiones distintas de librerías. Un **entorno virtual (venv)** es una burbuja aislada en tu disco que contiene su propia copia del ejecutable de Python y sus paquetes, evitando que un proyecto rompa a otro.\n\nPara documentar código en Python, usamos el símbolo numeral (\`#\`). El intérprete ignora por completo cualquier texto que comience con \`#\`, permitiéndote dejar notas para tu equipo o tu "yo" del futuro.\n\n\`\`\`bash\n# Crear un entorno virtual en terminal\npython -m venv .venv\n# Activar en Windows\n.venv\\Scripts\\activate\n\`\`\``,
            examples: [
              {
                title: 'Comentarios efectivos y auto-explicativos',
                code: '# Calcula el precio con impuesto del 16%\nprecio_base = 100\nimpuesto = precio_base * 0.16\ntotal = precio_base + impuesto\nprint(total)  # Muestra 116.0',
                output: '116.0',
                explanation: 'Los comentarios explican el "por qué", no lo que el código ya dice a simple vista.'
              }
            ],
            common_errors: 'No activar el entorno virtual antes de instalar paquetes, o abusar de comentarios obvios como `# suma 1` en vez de dar nombres claros a las variables.',
            mini_exercise: {
              starter_code: '# Escribe un comentario explicando tu meta de aprendizaje\nprint("Koda Specialist")',
              instructions: 'Agrega un comentario de una línea antes del print.',
              solution: '# Mi objetivo es dominar Python Specialist\nprint("Koda Specialist")'
            },
            key_takeaways: [
              'venv previene conflictos de versiones entre proyectos.',
              'Los comentarios inician con # y son ignorados por el intérprete.',
              'El código limpio reduce la necesidad de comentarios excesivos.'
            ],
            exercise: {
              id: 'ex_py1_01_02',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Cuál es el propósito principal de crear un entorno virtual con `python -m venv .venv`?',
              options: [
                { id: 'a', text: 'Aislar las librerías y dependencias específicas del proyecto' },
                { id: 'b', text: 'Hacer que Python se ejecute 10 veces más rápido' },
                { id: 'c', text: 'Compilar el código a lenguaje máquina' },
                { id: 'd', text: 'Instalar Windows en una máquina virtual' }
              ],
              correct_option_id: 'a',
              explanation: 'Un entorno virtual aísla las librerías del proyecto para evitar colisiones con paquetes globales u otros proyectos del sistema.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py1_01_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Cuál de las siguientes afirmaciones sobre Python es CORRECTA?',
        options: [
          { id: 'a', text: 'Es un lenguaje interpretado que prioriza la legibilidad del código' },
          { id: 'b', text: 'Requiere obligatoriamente punto y coma (;) al final de cada línea' },
          { id: 'c', text: 'No distingue entre mayúsculas y minúsculas en nombres de funciones' },
          { id: 'd', text: 'Solo puede ejecutarse dentro de un navegador web' }
        ],
        correct_option_id: 'a',
        explanation: 'Python es interpretado, altamente legible y no exige puntos y coma al final de las sentencias.'
      },
      {
        id: 'q_py1_01_02',
        type: 'predict_output',
        difficulty: 'easy',
        prompt: '¿Qué salida produce la ejecución del siguiente código?',
        prompt_code: 'print("Hola", "Mundo", sep="-")',
        options: [
          { id: 'a', text: 'Hola-Mundo' },
          { id: 'b', text: 'Hola Mundo' },
          { id: 'c', text: 'Hola, Mundo' },
          { id: 'd', text: 'HolaMundo-' }
        ],
        correct_option_id: 'a',
        explanation: 'El parámetro nombrado sep="-" en print() define el separador entre los argumentos impresos.'
      },
      {
        id: 'q_py1_01_03',
        type: 'find_error',
        difficulty: 'medium',
        prompt: '¿Por qué la siguiente línea de código fallará al ejecutarse?',
        prompt_code: 'print("Aprender Python es genial)',
        options: [
          { id: 'a', text: 'Falta la comilla de cierre de la cadena de texto (SyntaxError)' },
          { id: 'b', text: 'La palabra print debe ir con mayúscula inicial' },
          { id: 'c', text: 'Los textos deben escribirse con comillas triples únicamente' },
          { id: 'd', text: 'No se puede imprimir texto en español con tildes' }
        ],
        correct_option_id: 'a',
        explanation: 'Toda cadena iniciada con comillas dobles debe cerrarse con comillas dobles antes de cerrar el paréntesis.'
      },
      {
        id: 'q_py1_01_04',
        type: 'fill_blank',
        difficulty: 'easy',
        prompt: 'Para escribir un comentario de una sola línea en Python se utiliza el carácter: _____',
        options: [
          { id: 'a', text: '#' },
          { id: 'b', text: '//' },
          { id: 'c', text: '/*' },
          { id: 'd', text: '--' }
        ],
        correct_option_id: 'a',
        explanation: 'En Python, el carácter # se utiliza para comentarios de una línea.'
      },
      {
        id: 'q_py1_01_05',
        type: 'true_false',
        difficulty: 'easy',
        prompt: 'En Python, las instrucciones PRINT("hola") y print("hola") son idénticas para el intérprete.',
        options: [
          { id: 'a', text: 'Falso, Python es sensible a mayúsculas y PRINT generará un NameError' },
          { id: 'b', text: 'Verdadero, Python ignora las mayúsculas en funciones nativas' }
        ],
        correct_option_id: 'a',
        explanation: 'Python es estricto con las mayúsculas y minúsculas (case-sensitive). La función nativa se llama print en minúsculas.'
      }
    ]
  },

  // M02
  {
    id: 'py1_mod_02',
    language_id: LANG_ID,
    code: 'PY1_M02',
    slug: 'variables-y-tipos-de-datos',
    title: 'Variables, Memoria y Tipos Primitivos',
    objective: 'Comprender el modelo de memoria por referencias de Python y dominar los tipos int, float, str, bool y la función type().',
    description: 'Aprende a almacenar información en memoria, cómo funciona el tipado dinámico y cómo transformar datos con conversiones explícitas (casting).',
    folder: 'python1/02_variables',
    course_slug: 'python-1',
    position: 2,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 160 },
    sections: [
      {
        id: 'sec_py1_02_01',
        code: 'S01',
        title: 'Variables y Tipos Fundamentales',
        slug: 'variables-y-tipos-fundamentales',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 35,
        lessons: [
          {
            id: 'les_py1_02_01',
            code: 'L01',
            title: 'Nombres, Referencias y Tipado Dinámico',
            slug: 'nombres-y-referencias',
            position: 1,
            concept_id: 'py-variables-memory',
            objective: 'Entender que las variables en Python son etiquetas que apuntan a objetos en memoria.',
            theory_markdown: `En otros lenguajes (como C o Java), una variable es una caja rígida donde solo cabe un tipo de dato. En Python, **una variable es una etiqueta adhesiva con nombre** que se pega a un objeto que vive en la memoria.\n\nCuando escribes \`edad = 25\`, Python crea un objeto entero \`25\` en memoria y le pega la etiqueta \`edad\`. Si luego haces \`edad = "veinticinco"\`, despega la etiqueta y se la pega al texto. Esto se llama **tipado dinámico**.\n\nLos 4 tipos primitivos esenciales son:\n- **int**: Enteros sin decimales (\`10\`, \`-3\`, \`1_000_000\`).\n- **float**: Números reales con coma flotante (\`3.14159\`, \`-0.5\`).\n- **str**: Cadenas de caracteres alfanuméricos (\`"Koda"\`, \`'Backend'\`).\n- **bool**: Valores de verdad lógica (\`True\` o \`False\`, con mayúscula inicial).`,
            examples: [
              {
                title: 'Inspección de tipos con type()',
                code: 'puntos = 100\nratio = 4.5\njugador = "Alex"\nactivo = True\n\nprint(type(puntos))   # <class "int">\nprint(type(ratio))    # <class "float">\nprint(type(jugador))  # <class "str">\nprint(type(activo))   # <class "bool">',
                output: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>",
                explanation: 'type() revela la clase del objeto al que apunta la variable en ese instante.'
              }
            ],
            common_errors: 'Escribir booleanos en minúscula (`true` o `false`), lo que genera un NameError porque Python busca una variable con ese nombre.',
            mini_exercise: {
              starter_code: '# Declara tu edad como int y tu altura en metros como float\nedad = ...\naltura = ...',
              instructions: 'Asigna valores válidos y muestra sus tipos con print(type(...)).',
              solution: 'edad = 25\naltura = 1.75\nprint(type(edad))\nprint(type(altura))'
            },
            key_takeaways: [
              'Las variables son etiquetas que apuntan a objetos en memoria.',
              'Python infiere el tipo automáticamente en tiempo de ejecución.',
              'Los tipos básicos son int, float, str y bool (True/False con mayúscula).'
            ],
            exercise: {
              id: 'ex_py1_02_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Cuál es el tipo de dato resultante de la variable x?',
              prompt_code: 'x = "100.5"\nprint(type(x))',
              options: [
                { id: 'a', text: "<class 'str'>" },
                { id: 'b', text: "<class 'float'>" },
                { id: 'c', text: "<class 'int'>" },
                { id: 'd', text: "<class 'number'>" }
              ],
              correct_option_id: 'a',
              explanation: 'Al estar envuelto entre comillas ("100.5"), Python lo interpreta como una cadena de texto (str), sin importar que contenga dígitos y punto.'
            }
          },
          {
            id: 'les_py1_02_02',
            code: 'L02',
            title: 'Conversión de Tipos (Casting Explícito)',
            slug: 'casting-explicito',
            position: 2,
            concept_id: 'py-casting',
            objective: 'Transformar datos de un tipo a otro de manera segura mediante funciones constructoras.',
            theory_markdown: `Muy a menudo recibes datos como texto (por ejemplo, desde un formulario o la terminal) y necesitas convertirlos a números para operar matemáticamente con ellos. A este proceso se le llama **casting** o conversión de tipos.\n\nPython provee funciones con el mismo nombre del tipo:\n- \`int("42")\` -> Devuelve el entero \`42\`.\n- \`float("3.14")\` -> Devuelve el flotante \`3.14\`.\n- \`str(100)\` -> Devuelve la cadena \`"100"\`.\n- \`bool(1)\` -> Devuelve \`True\` (\`0\`, \`""\`, \`None\` se evalúan como \`False\`).`,
            examples: [
              {
                title: 'Conversión segura de entrada a cálculo numérico',
                code: 'entrada_usuario = "15"\nprecio = int(entrada_usuario)\ntotal = precio * 2\nprint("El total es:", total)',
                output: 'El total es: 30',
                explanation: 'int(entrada_usuario) transforma el texto "15" en el número 15 antes de multiplicarlo.'
              }
            ],
            common_errors: 'Intentar hacer int("15.5") directamente (ValueError: invalid literal for int() with base 10: "15.5"). Si el texto contiene decimales, primero debes convertir a float: int(float("15.5")).',
            mini_exercise: {
              starter_code: 'valor_texto = "50"\n# Conviértelo a entero y súmale 10\nresultado = ...\nprint(resultado)',
              instructions: 'Convierte valor_texto a int y suma 10 para obtener 60.',
              solution: 'valor_texto = "50"\nresultado = int(valor_texto) + 10\nprint(resultado)'
            },
            key_takeaways: [
              'El casting convierte datos explícitamente usando int(), float(), str(), bool().',
              'Convertir un texto con formato no numérico a int lanza ValueError.',
              'En Python el tipado es fuerte: no puedes sumar "5" + 5 sin convertir previamente.'
            ],
            exercise: {
              id: 'ex_py1_02_02',
              type: 'single_choice',
              difficulty: 'medium',
              prompt: '¿Qué ocurre al ejecutar: `print("Nivel " + str(1))`?',
              options: [
                { id: 'a', text: 'Imprime "Nivel 1" sin errores' },
                { id: 'b', text: 'Lanza TypeError porque no se pueden sumar números y cadenas' },
                { id: 'c', text: 'Imprime "Nivel + 1"' },
                { id: 'd', text: 'Lanza ValueError' }
              ],
              correct_option_id: 'a',
              explanation: 'Al usar str(1), el número 1 se transforma en la cadena "1", permitiendo concatenar perfectamente ambas cadenas con el operador +.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py1_02_01',
        type: 'predict_output',
        difficulty: 'easy',
        prompt: '¿Cuál es la salida de print(type(True))?',
        options: [
          { id: 'a', text: "<class 'bool'>" },
          { id: 'b', text: "<class 'boolean'>" },
          { id: 'c', text: 'True' },
          { id: 'd', text: '1' }
        ],
        correct_option_id: 'a',
        explanation: 'En Python, el tipo de datos booleano se representa formalmente con la clase bool.'
      },
      {
        id: 'q_py1_02_02',
        type: 'find_error',
        difficulty: 'medium',
        prompt: '¿Qué error producirá la siguiente línea de código?',
        prompt_code: 'resultado = int("koda_fox")',
        options: [
          { id: 'a', text: 'ValueError: no se puede convertir un texto no numérico a entero' },
          { id: 'b', text: 'TypeError: la función int solo acepta flotantes' },
          { id: 'c', text: 'NameError: koda_fox no está definida' },
          { id: 'd', text: 'Ninguno, devuelve 0' }
        ],
        correct_option_id: 'a',
        explanation: 'int() solo puede convertir cadenas que contengan dígitos numéricos válidos en base 10. De lo contrario lanza ValueError.'
      },
      {
        id: 'q_py1_02_03',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: 'Según las convenciones de estilo oficiales de Python (PEP 8), ¿cómo se deben nombrar las variables?',
        options: [
          { id: 'a', text: 'En minúsculas con palabras separadas por guiones bajos (snake_case)' },
          { id: 'b', text: 'En mayúsculas compactas sin separación (UPPERCASE)' },
          { id: 'c', text: 'Iniciando cada palabra con mayúscula sin espacios (CamelCase)' },
          { id: 'd', text: 'Con el prefijo obligatorio var_ al inicio' }
        ],
        correct_option_id: 'a',
        explanation: 'PEP 8 estipula snake_case (por ejemplo: saldo_cuenta, total_puntos) para variables y funciones en Python.'
      },
      {
        id: 'q_py1_02_04',
        type: 'true_false',
        difficulty: 'easy',
        prompt: 'En Python, la instrucción "10" + 5 funciona automáticamente convirtiendo el número 5 a texto.',
        options: [
          { id: 'a', text: 'Falso, Python tiene tipado fuerte y lanza TypeError si no se convierte explícitamente' },
          { id: 'b', text: 'Verdadero, Python convierte tipos de forma implícita como JavaScript' }
        ],
        correct_option_id: 'a',
        explanation: 'Python es de tipado fuerte (strong typing); no realiza conversiones automáticas entre tipos incompatibles como str e int.'
      }
    ]
  },

  // M03
  {
    id: 'py1_mod_03',
    language_id: LANG_ID,
    code: 'PY1_M03',
    slug: 'operadores-y-expresiones',
    title: 'Operadores Aritméticos, Comparativos y Lógicos',
    objective: 'Dominar la matemática de Python (+, -, *, /, //, %, **), las comparaciones relacionales y los operadores booleanos and, or, not con reglas de precedencia.',
    description: 'Aprende a realizar cálculos exactos, división entera, potencias, residuos modulares y evaluar condiciones compuestas con lógica booleana estricta.',
    folder: 'python1/03_operadores',
    course_slug: 'python-1',
    position: 3,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 170 },
    sections: [
      {
        id: 'sec_py1_03_01',
        code: 'S01',
        title: 'Operadores Aritméticos y Precedencia PEMDAS',
        slug: 'aritmetica-y-precedencia',
        position: 1,
        type: 'theory',
        estimated_minutes: 15,
        xp_on_complete: 35,
        lessons: [
          {
            id: 'les_py1_03_01',
            code: 'L01',
            title: 'División Clásica (/), División Entera (//) y Módulo (%)',
            slug: 'division-y-modulo',
            position: 1,
            concept_id: 'py-arithmetic-operators',
            objective: 'Distinguir entre división flotante, cociente entero truncado y resto de la división.',
            theory_markdown: `Python incluye dos operadores de división cruciales que debes conocer:\n- \`/\` **División flotante**: Siempre devuelve un \`float\`, incluso si la división es exacta (\`4 / 2\` devuelve \`2.0\`).\n- \`//\` **División entera (floor division)**: Descarta los decimales y devuelve únicamente el cociente entero hacia abajo (\`7 // 2\` devuelve \`3\`).\n- \`%\` **Operador módulo**: Devuelve el **residuo** o resto de la división. Es el truco por excelencia para saber si un número es par (\`n % 2 == 0\`).\n- \`**\` **Potenciación**: Eleva la base al exponente (\`2 ** 3\` es 8).`,
            examples: [
              {
                title: 'Cálculo de cocientes y residuos',
                code: 'galletas = 17\nninos = 4\n\npor_nino = galletas // ninos\nsobrantes = galletas % ninos\n\nprint("Galletas por niño:", por_nino)  # 4\nprint("Galletas sobrantes:", sobrantes) # 1',
                output: 'Galletas por niño: 4\nGalletas sobrantes: 1',
                explanation: '17 dividido entre 4 es 4 con residuo 1 (4*4 + 1 = 17).'
              }
            ],
            common_errors: 'Confundir el operador de potencia (**) con el acento circunflejo (^). En Python, ^ es una operación bit a bit (XOR), no una potencia.',
            mini_exercise: {
              starter_code: '# Calcula 2 elevado a la 8va potencia usando **\npotencia = ...\nprint(potencia)',
              instructions: 'Calcula 2 elevado a la 8 (debe dar 256).',
              solution: 'potencia = 2 ** 8\nprint(potencia)'
            },
            key_takeaways: [
              '/ siempre produce un float.',
              '// trunca hacia abajo el cociente entero.',
              '% devuelve el residuo de la división.',
              '** es el operador de potencia (no ^).'
            ],
            exercise: {
              id: 'ex_py1_03_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Qué valor imprimirá la siguiente expresión?',
              prompt_code: 'print(10 // 3 + 10 % 3)',
              options: [
                { id: 'a', text: '4' },
                { id: 'b', text: '3.33' },
                { id: 'c', text: '3' },
                { id: 'd', text: '1' }
              ],
              correct_option_id: 'a',
              explanation: '10 // 3 es 3 (cociente entero) y 10 % 3 es 1 (residuo). 3 + 1 = 4.'
            }
          },
          {
            id: 'les_py1_03_02',
            code: 'L02',
            title: 'Operadores Relacionales y Lógica Booleana (and, or, not)',
            slug: 'relacionales-y-logica',
            position: 2,
            concept_id: 'py-logical-operators',
            objective: 'Construir condiciones lógicas complejas combinando comparaciones con and, or y not.',
            theory_markdown: `Para tomar decisiones en tu programa, comparas valores usando operadores relacionales:\n- \`==\` (igual a), \`!=\` (diferente de)\n- \`>\`, \`<\`, \`>=\`, \`<=\`\n\nPara combinar múltiples condiciones, Python usa palabras en inglés en lugar de símbolos crípticos:\n- \`and\`: Verdadero **solo si ambas** condiciones son verdaderas.\n- \`or\`: Verdadero **si al menos una** condición es verdadera.\n- \`not\`: Invierte el valor de verdad (\`not True\` es \`False\`).\n\n> **Tip Pro:** Python permite encadenar comparaciones matemáticas como en álgebra: \`18 <= edad < 65\`.`,
            examples: [
              {
                title: 'Evaluación lógica de acceso',
                code: 'edad = 20\ntiene_pase = True\n\npuede_entrar = (edad >= 18) and tiene_pase\nprint("Acceso permitido:", puede_entrar)  # True',
                output: 'Acceso permitido: True',
                explanation: 'Ambas condiciones son True, por lo que and devuelve True.'
              }
            ],
            common_errors: 'Usar un solo signo igual (=) para comparar. = es asignación; la comparación de igualdad requiere doble igual (==).',
            mini_exercise: {
              starter_code: 'nivel = 5\nes_vip = False\n# Verifica si nivel >= 5 o es_vip\npuede_acceder = ...\nprint(puede_acceder)',
              instructions: 'Usa el operador or para verificar si cumple al menos una de las dos condiciones.',
              solution: 'nivel = 5\nes_vip = False\npuede_acceder = (nivel >= 5) or es_vip\nprint(puede_acceder)'
            },
            key_takeaways: [
              '== compara igualdad; = asigna valor a una variable.',
              'and exige que todas las partes sean True.',
              'or exige que al menos una parte sea True.',
              'not invierte el valor booleano.'
            ],
            exercise: {
              id: 'ex_py1_03_02',
              type: 'predict_output',
              difficulty: 'medium',
              prompt: '¿Cuál es el resultado de la siguiente expresión booleana?',
              prompt_code: 'print(not (5 > 2) or (10 == 10 and 3 < 1))',
              options: [
                { id: 'a', text: 'False' },
                { id: 'b', text: 'True' },
                { id: 'c', text: 'None' },
                { id: 'd', text: 'Error de sintaxis' }
              ],
              correct_option_id: 'a',
              explanation: '5 > 2 es True, por lo que not (5 > 2) es False. En la segunda parte, 3 < 1 es False, por lo que el and es False. False or False resulta en False.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py1_03_01',
        type: 'predict_output',
        difficulty: 'easy',
        prompt: '¿Qué devuelve print(2 ** 3 ** 2)? (Nota: la potencia en Python asocia de derecha a izquierda)',
        options: [
          { id: 'a', text: '512' },
          { id: 'b', text: '64' },
          { id: 'c', text: '36' },
          { id: 'd', text: '18' }
        ],
        correct_option_id: 'a',
        explanation: 'Las potencias se evalúan de derecha a izquierda: 3 ** 2 = 9, y luego 2 ** 9 = 512.'
      },
      {
        id: 'q_py1_03_02',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Cuál es la forma correcta y pythónica de verificar si una variable num está entre 10 y 20 (inclusive)?',
        options: [
          { id: 'a', text: '10 <= num <= 20' },
          { id: 'b', text: 'num >= 10 && num <= 20' },
          { id: 'c', text: '10 <= num AND num <= 20' },
          { id: 'd', text: 'between(num, 10, 20)' }
        ],
        correct_option_id: 'a',
        explanation: 'Python soporta comparación encadenada 10 <= num <= 20, siendo la sintaxis más limpia y pythónica.'
      },
      {
        id: 'q_py1_03_03',
        type: 'find_error',
        difficulty: 'medium',
        prompt: '¿Qué error hay en: `if x = 10:`?',
        options: [
          { id: 'a', text: 'Se usó el operador de asignación (=) en vez del de comparación (==)' },
          { id: 'b', text: 'Falta un punto y coma al final' },
          { id: 'c', text: 'El número 10 debe ir entre comillas' },
          { id: 'd', text: 'No se puede usar la palabra if en Python' }
        ],
        correct_option_id: 'a',
        explanation: '= asigna un valor a una variable. Para verificar si x es igual a 10 se debe usar el comparador de igualdad ==.'
      },
      {
        id: 'q_py1_03_04',
        type: 'predict_output',
        difficulty: 'easy',
        prompt: '¿Qué valor produce 16 % 5?',
        options: [
          { id: 'a', text: '1' },
          { id: 'b', text: '3' },
          { id: 'c', text: '3.2' },
          { id: 'd', text: '0' }
        ],
        correct_option_id: 'a',
        explanation: '16 dividido entre 5 cabe a 3 con residuo 1 (5 * 3 = 15; 16 - 15 = 1).'
      }
    ]
  },

  // M04
  {
    id: 'py1_mod_04',
    language_id: LANG_ID,
    code: 'PY1_M04',
    slug: 'entrada-salida-y-strings',
    title: 'Entrada/Salida y Manipulación de Strings',
    objective: 'Capturar datos del usuario con input(), formatear cadenas con f-strings modernas y manipular texto con len(), strip(), lower() y upper().',
    description: 'Haz que tus programas interactúen con personas reales: lee datos del teclado, sanea entradas de texto y muestra reportes visualmente atractivos.',
    folder: 'python1/04_io_strings',
    course_slug: 'python-1',
    position: 4,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 180 },
    sections: [
      {
        id: 'sec_py1_04_01',
        code: 'S01',
        title: 'Interacción con input() y F-Strings',
        slug: 'input-y-fstrings',
        position: 1,
        type: 'theory',
        estimated_minutes: 15,
        xp_on_complete: 35,
        lessons: [
          {
            id: 'les_py1_04_01',
            code: 'L01',
            title: 'Lectura Dinámica con input() y f-strings',
            slug: 'input-y-fstrings-base',
            position: 1,
            concept_id: 'py-input-fstrings',
            objective: 'Capturar texto desde la consola y embeber variables de forma limpia usando f-strings (formatted string literals).',
            theory_markdown: `La función \`input("Mensaje: ")\` pausa la ejecución del programa y espera a que el usuario escriba algo en el teclado y presione Enter.\n\n> **¡Regla de oro de input()!** Todo lo que devuelve \`input()\` es SIEMPRE un string (\`str\`). Si el usuario escribe \`25\`, recibirás \`"25"\`. Si necesitas operar matemáticamente, debes envolverlo con \`int()\` o \`float()\`: \`edad = int(input("Edad: "))\`.\n\nPara mostrar variables dentro de textos sin concatenaciones engorrosas con signos \`+\`, Python 3 introdujo las **f-strings**:\n\`\`\`python\nnombre = "Koda"\nxp = 1500\nprint(f"Agente {nombre} acumula {xp} XP.")\n\`\`\``,
            examples: [
              {
                title: 'Formateo elegante con f-strings',
                code: 'usuario = "Elena"\nhoras = 3\ntasa = 25.50\ntotal = horas * tasa\nprint(f"Factura para {usuario}: total de ${total:.2f}")',
                output: 'Factura para Elena: total de $76.50',
                explanation: 'El modificador :.2f redondea el flotante a 2 decimales automáticamente.'
              }
            ],
            common_errors: 'Olvidar la letra f al inicio de la cadena: `"Hola {nombre}"` se imprimirá literalmente como texto sin reemplazar la variable.',
            mini_exercise: {
              starter_code: 'lenguaje = "Python"\nversion = 3.12\n# Genera un f-string que diga "Aprendiendo Python 3.12"\nmensaje = ...\nprint(mensaje)',
              instructions: 'Usa f-strings para interpolar lenguaje y version.',
              solution: 'lenguaje = "Python"\nversion = 3.12\nmensaje = f"Aprendiendo {lenguaje} {version}"\nprint(mensaje)'
            },
            key_takeaways: [
              'input() siempre retorna un string; requiere casting para operaciones numéricas.',
              'Las f-strings inician con f antes de las comillas: f"Hola {variable}".',
              'Permiten formatear números con modificadores como :.2f.'
            ],
            exercise: {
              id: 'ex_py1_04_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: 'Si el usuario introduce el número 10 cuando se ejecuta este código, ¿qué se imprimirá?',
              prompt_code: '# Supón que el usuario teclea 10\n# n = input("Ingresa número: ")\nn = "10"\nprint(n * 2)',
              options: [
                { id: 'a', text: '1010' },
                { id: 'b', text: '20' },
                { id: 'c', text: 'TypeError' },
                { id: 'd', text: '10' }
              ],
              correct_option_id: 'a',
              explanation: 'input() retorna el string "10". En Python, multiplicar un string por un entero ("10" * 2) repite el texto dos veces produciendo "1010".'
            }
          },
          {
            id: 'les_py1_04_02',
            code: 'L02',
            title: 'Métodos Esenciales de Strings: strip, lower, upper y len',
            slug: 'metodos-de-strings',
            position: 2,
            concept_id: 'py-string-methods',
            objective: 'Limpiar y transformar textos usando los métodos nativos más frecuentes.',
            theory_markdown: `En programación real, los usuarios suelen escribir espacios accidentales o mayúsculas desordenadas (por ejemplo: \`"  admin@koda.com  "\`).\n\nLos strings en Python son **inmutables** (no cambian en memoria; sus métodos retornan una nueva cadena con el cambio aplicado):\n- \`.strip()\`: Elimina espacios en blanco al inicio y al final.\n- \`.lower()\`: Convierte todo el texto a minúsculas.\n- \`.upper()\`: Convierte todo el texto a mayúsculas.\n- \`.replace("antiguo", "nuevo")\`: Reemplaza ocurrencias.\n- \`len(texto)\`: Función que devuelve la cantidad de caracteres de la cadena.`,
            examples: [
              {
                title: 'Normalización de correo de usuario',
                code: 'correo_sucio = "   USUARIO@KodaAcademy.COM  \\n"\ncorreo_limpio = correo_sucio.strip().lower()\nprint(correo_limpio)\nprint("Caracteres:", len(correo_limpio))',
                output: 'usuario@kodaacademy.com\nCaracteres: 23',
                explanation: 'Encadenamos .strip() y .lower() para sanitizar la entrada de datos en una sola línea limpia.'
              }
            ],
            common_errors: 'Pensar que `texto.upper()` modifica la variable original. Al ser inmutables, debes reasignar: `texto = texto.upper()`.',
            mini_exercise: {
              starter_code: 'codigo = "  py-level-1  "\n# Límpialo con strip() y conviértelo a mayúsculas\ncodigo_final = ...\nprint(codigo_final)',
              instructions: 'Aplica .strip() y .upper() para obtener "PY-LEVEL-1".',
              solution: 'codigo = "  py-level-1  "\ncodigo_final = codigo.strip().upper()\nprint(codigo_final)'
            },
            key_takeaways: [
              'Los strings son inmutables en Python.',
              '.strip() remueve espacios y saltos de línea sobrantes en los extremos.',
              '.lower() y .upper() normalizan el texto para comparaciones seguras.',
              'len(s) retorna la longitud total de la cadena.'
            ],
            exercise: {
              id: 'ex_py1_04_02',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Cuál es la salida de print(len("Python".lower()))?',
              options: [
                { id: 'a', text: '6' },
                { id: 'b', text: '5' },
                { id: 'c', text: "'python'" },
                { id: 'd', text: 'Error' }
              ],
              correct_option_id: 'a',
              explanation: '"Python".lower() produce "python", y len("python") cuenta exactamente 6 caracteres.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py1_04_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Qué tipo de dato devuelve SIEMPRE la función input()?',
        options: [
          { id: 'a', text: 'str' },
          { id: 'b', text: 'Depende de lo que el usuario escriba' },
          { id: 'c', text: 'int si escribe solo dígitos' },
          { id: 'd', text: 'bool' }
        ],
        correct_option_id: 'a',
        explanation: 'En Python 3, input() retorna invariablemente un objeto de tipo str (cadena de texto).'
      },
      {
        id: 'q_py1_04_02',
        type: 'predict_output',
        difficulty: 'medium',
        prompt: '¿Qué imprime el siguiente fragmento?',
        prompt_code: 'precio = 19.999\nprint(f"Total: ${precio:.2f}")',
        options: [
          { id: 'a', text: 'Total: $20.00' },
          { id: 'b', text: 'Total: $19.99' },
          { id: 'c', text: 'Total: $19.999' },
          { id: 'd', text: 'Total: 20' }
        ],
        correct_option_id: 'a',
        explanation: 'El especificador :.2f redondea al número de decimales más cercano (19.999 se redondea a 20.00).'
      },
      {
        id: 'q_py1_04_03',
        type: 'true_false',
        difficulty: 'easy',
        prompt: 'Los strings en Python son mutables, por lo que texto.replace("a", "b") modifica el valor original de la variable texto.',
        options: [
          { id: 'a', text: 'Falso, los strings son inmutables y los métodos devuelven una nueva copia modificada' },
          { id: 'b', text: 'Verdadero, modifica el objeto directamente en memoria' }
        ],
        correct_option_id: 'a',
        explanation: 'Los strings en Python son inmutables. Todo método devuelve una nueva cadena y nunca modifica la original in-situ.'
      }
    ]
  },

  // M05
  {
    id: 'py1_mod_05',
    language_id: LANG_ID,
    code: 'PY1_M05',
    slug: 'condicionales',
    title: 'Estructuras de Control: Condicionales',
    objective: 'Bifurcar la ejecución de programas mediante if, elif, else, operadores ternarios y anidamientos limpios.',
    description: 'Aprende a dotar a tus programas de inteligencia lógica: toma decisiones condicionales según el estado de las variables y evita anidamientos profundos.',
    folder: 'python1/05_condicionales',
    course_slug: 'python-1',
    position: 5,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 190 },
    sections: [
      {
        id: 'sec_py1_05_01',
        code: 'S01',
        title: 'Toma de Decisiones con if, elif y else',
        slug: 'if-elif-else',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 40,
        lessons: [
          {
            id: 'les_py1_05_01',
            code: 'L01',
            title: 'La Estructura if-elif-else y la Sangría (Indentación)',
            slug: 'estructura-if-elif-else',
            position: 1,
            concept_id: 'py-conditionals',
            objective: 'Dominar la sintaxis de bifurcación y la regla de indentación de 4 espacios de Python.',
            theory_markdown: `En la mayoría de los lenguajes se usan llaves \`{ }\` para agrupar bloques de código. En Python, **la sangría (indentación) es obligatoria y define la estructura** del programa (estándar PEP 8: 4 espacios).\n\nEl flujo de decisión condicional opera así:\n1. \`if condicion:\`: Se evalúa primero. Si es \`True\`, ejecuta su bloque indentado y salta el resto.\n2. \`elif otra_condicion:\` (else if): Si el \`if\` anterior fue \`False\`, evalúa esta alternativa.\n3. \`else:\`: Si ninguna condición previa fue verdadera, se ejecuta este bloque por defecto.`,
            examples: [
              {
                title: 'Clasificador de notas de estudiantes',
                code: 'nota = 85\n\nif nota >= 90:\n    print("Calificación: A (Excelente)")\nelif nota >= 80:\n    print("Calificación: B (Notable)")\nelif nota >= 70:\n    print("Calificación: C (Aprobado)")\nelse:\n    print("Calificación: F (Reprobado)")',
                output: 'Calificación: B (Notable)',
                explanation: 'Como 85 no es >= 90, salta el primer if. Luego 85 >= 80 es True, ejecuta ese bloque y finaliza la estructura.'
              }
            ],
            common_errors: 'Mezclar tabulaciones y espacios (TabError), olvidar los dos puntos (:) al final de la línea del if/elif/else, o no indentar el bloque interior (IndentationError).',
            mini_exercise: {
              starter_code: 'temperatura = 32\n# Si temperatura > 30 imprime "Calor", sino "Agradable"\nif ...:\n    ...\nelse:\n    ...',
              instructions: 'Completa la condición if-else respetando los 4 espacios de sangría.',
              solution: 'temperatura = 32\nif temperatura > 30:\n    print("Calor")\nelse:\n    print("Agradable")'
            },
            key_takeaways: [
              'La indentación de 4 espacios es obligatoria y define qué pertenece al bloque.',
              'Toda sentencia condicional finaliza con dos puntos (:).',
              'Tan pronto una condición es True, las siguientes ramas elif/else son ignoradas.'
            ],
            exercise: {
              id: 'ex_py1_05_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Qué imprimirá el siguiente código?',
              prompt_code: 'x = 10\nif x > 20:\n    print("Mayor a 20")\nelif x == 10:\n    print("Es diez")\nelse:\n    print("Otro")',
              options: [
                { id: 'a', text: 'Es diez' },
                { id: 'b', text: 'Mayor a 20' },
                { id: 'c', text: 'Otro' },
                { id: 'd', text: 'Es diez\nOtro' }
              ],
              correct_option_id: 'a',
              explanation: 'x > 20 es False. elif x == 10 es True, por lo que imprime "Es diez" y el else no se evalúa.'
            }
          },
          {
            id: 'les_py1_05_02',
            code: 'L02',
            title: 'Operador Ternario y Condiciones Concensadas',
            slug: 'operador-ternario',
            position: 2,
            concept_id: 'py-ternary-operator',
            objective: 'Asignar valores basados en condiciones en una sola línea elegante.',
            theory_markdown: `Cuando necesitas asignar una variable dependiendo de una condición simple, escribir 4 líneas de \`if-else\` puede resultar repetitivo. Python ofrece la **expresión condicional (operador ternario)**:\n\n\`valor_si_verdadero if condicion else valor_si_falso\`\n\n> **Ejemplo cotidiano:** \`estado = "Adulto" if edad >= 18 else "Menor"\`. Lee casi como lenguaje natural en inglés.`,
            examples: [
              {
                title: 'Asignación compacta y pythónica',
                code: 'puntos = 120\nresultado = "Aprobado" if puntos >= 100 else "Reintentar"\nprint(resultado)',
                output: 'Aprobado',
                explanation: 'Como puntos (120) es >= 100, la variable resultado recibe "Aprobado" en una sola línea.'
              }
            ],
            common_errors: 'Abusar del operador ternario anidando varios ternarios en una línea, lo cual destruye la legibilidad del código (regla del Zen de Python: "Legible es mejor que complejo").',
            mini_exercise: {
              starter_code: 'stock = 0\n# Usa ternario: "Disponible" si stock > 0 sino "Agotado"\nestado = ...\nprint(estado)',
              instructions: 'Escribe la expresión ternaria en una sola línea.',
              solution: 'stock = 0\nestado = "Disponible" if stock > 0 else "Agotado"\nprint(estado)'
            },
            key_takeaways: [
              'El operador ternario asigna en formato: A if condicion else B.',
              'Debe reservarse para decisiones directas y legibles.',
              'Siempre requiere una cláusula else obligatoria.'
            ],
            exercise: {
              id: 'ex_py1_05_02',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Cuál es el valor final de etiqueta?',
              prompt_code: 'es_admin = False\netiqueta = "Root" if es_admin else "Guest"\nprint(etiqueta)',
              options: [
                { id: 'a', text: 'Guest' },
                { id: 'b', text: 'Root' },
                { id: 'c', text: 'False' },
                { id: 'd', text: 'Error' }
              ],
              correct_option_id: 'a',
              explanation: 'Como es_admin es False, el operador ternario toma la rama del else ("Guest").'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py1_05_01',
        type: 'find_error',
        difficulty: 'easy',
        prompt: '¿Cuál es el error de sintaxis en el siguiente bloque?',
        prompt_code: 'if edad >= 18\n    print("Mayor de edad")',
        options: [
          { id: 'a', text: 'Faltan los dos puntos (:) al final de la línea del if' },
          { id: 'b', text: 'La palabra print debe ir sin sangría' },
          { id: 'c', text: 'La condición debe ir entre paréntesis obligatoriamente' },
          { id: 'd', text: 'El número 18 debe ser un flotante' }
        ],
        correct_option_id: 'a',
        explanation: 'En Python toda cabecera de control de flujo (if, elif, else, for, while, def) debe finalizar con dos puntos (:).'
      },
      {
        id: 'q_py1_05_02',
        type: 'predict_output',
        difficulty: 'medium',
        prompt: '¿Qué se imprimirá?',
        prompt_code: 'x = 0\nif x:\n    print("Verdadero")\nelse:\n    print("Falso")',
        options: [
          { id: 'a', text: 'Falso' },
          { id: 'b', text: 'Verdadero' },
          { id: 'c', text: '0' },
          { id: 'd', text: 'TypeError' }
        ],
        correct_option_id: 'a',
        explanation: 'En Python, el número 0 es considerado "falsy" (evalúa a False en un contexto booleano), por lo que se ejecuta el else.'
      },
      {
        id: 'q_py1_05_03',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Cuál es la convención oficial de sangría en Python según PEP 8?',
        options: [
          { id: 'a', text: '4 espacios por nivel de indentación' },
          { id: 'b', text: '1 tabulación obligatoria' },
          { id: 'c', text: '2 espacios como en JavaScript' },
          { id: 'd', text: 'No importa la cantidad mientras se use punto y coma' }
        ],
      }
    ]
  },

  // M06
  {
    id: 'py1_mod_06',
    language_id: LANG_ID,
    code: 'PY1_M06',
    slug: 'bucles-for',
    title: 'Bucle for e Iteración Estructurada',
    objective: 'Dominar la iteración sobre secuencias, la función range(start, stop, step) y el control de flujo con break y continue.',
    description: 'Automatiza tareas repetitivas de forma limpia y elegante usando bucles for sobre rangos numéricos y colecciones.',
    folder: 'python1/06_bucles_for',
    course_slug: 'python-1',
    position: 6,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 200 },
    sections: [
      {
        id: 'sec_py1_06_01',
        code: 'S01',
        title: 'Iteración con for y la Función range()',
        slug: 'for-y-range',
        position: 1,
        type: 'theory',
        estimated_minutes: 15,
        xp_on_complete: 40,
        lessons: [
          {
            id: 'les_py1_06_01',
            code: 'L01',
            title: 'Recorriendo Rangos Numéricos con range()',
            slug: 'recorriendo-rangos',
            position: 1,
            concept_id: 'py-for-range',
            objective: 'Utilizar range(stop), range(start, stop) y range(start, stop, step) para repeticiones controladas.',
            theory_markdown: `El bucle \`for\` en Python es un bucle de **iteración**: en cada paso, toma el siguiente elemento de una secuencia y lo asigna a una variable temporal.\n\nPara generar secuencias numéricas sin llenar la memoria, usamos \`range()\`:\n- \`range(5)\`: Genera \`0, 1, 2, 3, 4\` (el límite superior NUNCA se incluye).\n- \`range(2, 6)\`: Inicia en 2 y termina en 5.\n- \`range(0, 10, 2)\`: Paso de 2 en 2: \`0, 2, 4, 6, 8\`.\n- \`range(10, 0, -1)\`: Cuenta regresiva decreciente.`,
            examples: [
              {
                title: 'Cuenta progresiva y acumulador de suma',
                code: 'total = 0\nfor i in range(1, 6):\n    total += i\n    print(f"Paso {i}: total acumulado = {total}")\nprint(f"Suma final: {total}")',
                output: 'Paso 1: total acumulado = 1\nPaso 2: total acumulado = 3\nPaso 3: total acumulado = 6\nPaso 4: total acumulado = 10\nPaso 5: total acumulado = 15\nSuma final: 15',
                explanation: 'La variable i recorre los valores del 1 al 5 y acumula la suma progresiva.'
              }
            ],
            common_errors: 'Esperar que range(1, 5) incluya el número 5. En Python los rangos son semi-abiertos [inicio, fin): incluyen el inicio pero excluyen el fin.',
            mini_exercise: {
              starter_code: '# Imprime los números pares del 2 al 10 inclusive usando range\nfor n in range(...):\n    print(n)',
              instructions: 'Usa range(2, 11, 2) para mostrar 2, 4, 6, 8, 10.',
              solution: 'for n in range(2, 11, 2):\n    print(n)'
            },
            key_takeaways: [
              'for recorre elementos de una secuencia de principio a fin.',
              'range(stop) genera números desde 0 hasta stop - 1.',
              'range(start, stop, step) permite saltos e iteraciones inversas.'
            ],
            exercise: {
              id: 'ex_py1_06_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Cuántas veces se imprimirá la palabra "Koda"?',
              prompt_code: 'for _ in range(4):\n    print("Koda")',
              options: [
                { id: 'a', text: '4 veces' },
                { id: 'b', text: '5 veces' },
                { id: 'c', text: '3 veces' },
                { id: 'd', text: 'Ninguna' }
              ],
              correct_option_id: 'a',
              explanation: 'range(4) produce los índices 0, 1, 2, 3 (exactamente 4 iteraciones).'
            }
          },
          {
            id: 'les_py1_06_02',
            code: 'L02',
            title: 'Control de Flujo: break y continue',
            slug: 'break-y-continue',
            position: 2,
            concept_id: 'py-break-continue',
            objective: 'Interrumpir o saltar iteraciones de forma controlada según condiciones.',
            theory_markdown: `Dentro de cualquier bucle, tienes dos comandos especiales para alterar su ritmo natural:\n- \`break\`: **Detiene el bucle por completo** inmediatamente y salta a la primera línea fuera del bucle.\n- \`continue\`: **Salta el resto de la iteración actual** y pasa de inmediato a la siguiente repetición.`,
            examples: [
              {
                title: 'Búsqueda con salida anticipada',
                code: 'for num in range(1, 10):\n    if num == 3:\n        continue  # Salta el 3\n    if num == 6:\n        break     # Frena al llegar al 6\n    print(num, end=" ")',
                output: '1 2 4 5 ',
                explanation: 'El 3 es omitido por continue, y al llegar al 6 el break detiene el bucle antes de imprimirlo.'
              }
            ],
            common_errors: 'Colocar código después de un break en el mismo bloque; ese código nunca se ejecutará (código inalcanzable).',
            mini_exercise: {
              starter_code: '# Imprime números del 1 al 10 pero salte los impares usando continue\nfor i in range(1, 11):\n    if i % 2 != 0:\n        ...\n    print(i)',
              instructions: 'Usa continue para omitir los números impares.',
              solution: 'for i in range(1, 11):\n    if i % 2 != 0:\n        continue\n    print(i)'
            },
            key_takeaways: [
              'break cancela el bucle por completo.',
              'continue omite la iteración actual y avanza a la siguiente.',
              'Se utilizan comúnmente con condicionales if.'
            ],
            exercise: {
              id: 'ex_py1_06_02',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Cuál es la última salida que muestra este bucle?',
              prompt_code: 'for i in range(10):\n    if i == 3:\n        break\n    print(i)',
              options: [
                { id: 'a', text: '2' },
                { id: 'b', text: '3' },
                { id: 'c', text: '9' },
                { id: 'd', text: '0' }
              ],
              correct_option_id: 'a',
              explanation: 'Imprime 0, luego 1, luego 2. Cuando i es 3, se activa el break inmediatamente antes de imprimir el 3.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py1_06_01',
        type: 'predict_output',
        difficulty: 'easy',
        prompt: '¿Qué genera list(range(3, 7))?',
        options: [
          { id: 'a', text: '[3, 4, 5, 6]' },
          { id: 'b', text: '[3, 4, 5, 6, 7]' },
          { id: 'c', text: '[4, 5, 6, 7]' },
          { id: 'd', text: '[3, 7]' }
        ],
        correct_option_id: 'a',
        explanation: 'Inicia en 3 y termina antes del 7, produciendo los números 3, 4, 5 y 6.'
      },
      {
        id: 'q_py1_06_02',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué hace la instrucción continue dentro de un bucle for?',
        options: [
          { id: 'a', text: 'Salta el código restante de la iteración actual y pasa a la siguiente' },
          { id: 'b', text: 'Termina y rompe el bucle por completo' },
          { id: 'c', text: 'Reinicia el bucle desde el primer elemento' },
          { id: 'd', text: 'Pausa el programa durante 1 segundo' }
        ],
        correct_option_id: 'a',
        explanation: 'continue descarta el resto del bloque para el elemento actual y procede con el siguiente elemento.'
      }
    ]
  },

  // M07
  {
    id: 'py1_mod_07',
    language_id: LANG_ID,
    code: 'PY1_M07',
    slug: 'bucles-while',
    title: 'Bucle while, Centinelas y Banderas',
    objective: 'Controlar repeticiones basadas en condiciones dinámicas con while, variables centinela y evitar bucles infinitos.',
    description: 'Aprende a ejecutar código mientras una condición permanezca verdadera: ideal para menús interactivos, juegos y validaciones de entrada.',
    folder: 'python1/07_bucles_while',
    course_slug: 'python-1',
    position: 7,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 200 },
    sections: [
      {
        id: 'sec_py1_07_01',
        code: 'S01',
        title: 'Condición while y Prevención de Bucles Infinitos',
        slug: 'condicion-while',
        position: 1,
        type: 'theory',
        estimated_minutes: 15,
        xp_on_complete: 40,
        lessons: [
          {
            id: 'les_py1_07_01',
            code: 'L01',
            title: 'El Bucle while y Modificación de la Condición',
            slug: 'bucle-while-base',
            position: 1,
            concept_id: 'py-while-loops',
            objective: 'Construir bucles while con variables de control que garanticen una terminación segura.',
            theory_markdown: `A diferencia del \`for\` (que recorre una cantidad conocida de elementos), el bucle \`while\` se ejecuta **mientras una condición booleana sea True**.\n\n> **¡Alerta de bucle infinito!** Para que un \`while\` no se ejecute para siempre y congele tu computadora, dentro del bucle **debe ocurrir algo que eventualmente cambie la condición a False** (por ejemplo, incrementar un contador o recibir una entrada específica).`,
            examples: [
              {
                title: 'Contador regresivo con terminación garantizada',
                code: 'cuenta = 3\nwhile cuenta > 0:\n    print(f"Lanzamiento en {cuenta}...")\n    cuenta -= 1  # Crucial: acerca la condición a False\nprint("¡Despegue exitoso!")',
                output: 'Lanzamiento en 3...\nLanzamiento en 2...\nLanzamiento en 1...\n¡Despegue exitoso!',
                explanation: 'cuenta -= 1 reduce el valor hasta que cuenta es 0, haciendo que cuenta > 0 sea False.'
              }
            ],
            common_errors: 'Olvidar actualizar la variable de control dentro del cuerpo del while (por ejemplo, olvidar cuenta -= 1), provocando un bucle infinito.',
            mini_exercise: {
              starter_code: 'vidas = 3\n# Mientras vidas > 0, imprime "Jugando" y resta 1 vida\nwhile ...:\n    ...\nprint("Game Over")',
              instructions: 'Completa el bucle while para que se ejecute exactamente 3 veces.',
              solution: 'vidas = 3\nwhile vidas > 0:\n    print("Jugando")\n    vidas -= 1\nprint("Game Over")'
            },
            key_takeaways: [
              'while evalúa la condición antes de cada iteración.',
              'Siempre debe modificarse la variable de control hacia la condición de salida.',
              'Ctrl + C en la terminal interrumpe un bucle infinito accidental.'
            ],
            exercise: {
              id: 'ex_py1_07_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Cuántas líneas imprimirá este código?',
              prompt_code: 'i = 0\nwhile i < 3:\n    print("Koda")\n    i += 1',
              options: [
                { id: 'a', text: '3 líneas con "Koda"' },
                { id: 'b', text: '4 líneas con "Koda"' },
                { id: 'c', text: 'Infinitas líneas' },
                { id: 'd', text: 'Ninguna' }
              ],
              correct_option_id: 'a',
              explanation: 'i toma los valores 0, 1, 2 (3 iteraciones). Cuando i llega a 3, i < 3 es False y el bucle termina.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py1_07_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Cuándo es preferible utilizar un bucle while en lugar de un bucle for?',
        options: [
          { id: 'a', text: 'Cuando no sabemos de antemano cuántas veces se debe repetir el bucle' },
          { id: 'b', text: 'Cuando queremos iterar sobre una lista fija de 10 elementos' },
          { id: 'c', text: 'Cuando el código solo se debe ejecutar una única vez' },
          { id: 'd', text: 'Nunca, while está obsoleto en Python 3' }
        ],
        correct_option_id: 'a',
        explanation: 'while es ideal cuando la cantidad de repeticiones depende de un evento dinámico (como la respuesta del usuario).'
      }
    ]
  },

  // M08
  {
    id: 'py1_mod_08',
    language_id: LANG_ID,
    code: 'PY1_M08',
    slug: 'listas-y-tuplas',
    title: 'Colecciones Fundamentales: Listas y Tuplas',
    objective: 'Dominar la mutabilidad, indexación 0-based, slicing y métodos de listas (append, pop, sort), junto con tuplas inmutables.',
    description: 'Organiza múltiples datos en una sola estructura: colecciones ordenadas, mutabilidad vs inmutabilidad y desempaquetado de tuplas.',
    folder: 'python1/08_listas_tuplas',
    course_slug: 'python-1',
    position: 8,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 220 },
    sections: [
      {
        id: 'sec_py1_08_01',
        code: 'S01',
        title: 'Listas Mutables y Slicing',
        slug: 'listas-y-slicing',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py1_08_01',
            code: 'L01',
            title: 'Listas: Creación, Indexación y Métodos Mutables',
            slug: 'listas-metodos',
            position: 1,
            concept_id: 'py-lists',
            objective: 'Manipular listas ordenadas usando índices positivos, negativos y métodos nativos.',
            theory_markdown: `Una **lista** es una secuencia ordenada y **mutable** (modificable) de elementos entre corchetes \`[ ]\`.\n\n- **Indexación base 0**: El primer elemento es \`lista[0]\`.\n- **Índices negativos**: El último elemento es \`lista[-1]\`, el penúltimo es \`lista[-2]\`.\n- Métodos comunes:\n  - \`.append(x)\`: Agrega \`x\` al final.\n  - \`.insert(i, x)\`: Inserta \`x\` en el índice \`i\`.\n  - \`.pop()\`: Remueve y devuelve el último elemento.\n  - \`.remove(x)\`: Elimina la primera aparición del valor \`x\`.\n  - \`.sort()\`: Ordena la lista in-situ.`,
            examples: [
              {
                title: 'Operaciones con listas',
                code: 'lenguajes = ["Python", "Rust", "Go"]\nlenguajes.append("TypeScript")\nprint(lenguajes)          # ["Python", "Rust", "Go", "TypeScript"]\nprint("Primero:", lenguajes[0])\nprint("Último:", lenguajes[-1])\nultimo = lenguajes.pop()\nprint("Removido:", ultimo)',
                output: "['Python', 'Rust', 'Go', 'TypeScript']\nPrimero: Python\nÚltimo: TypeScript\nRemovido: TypeScript",
                explanation: 'Las listas pueden crecer o reducirse dinámicamente en tiempo de ejecución.'
              }
            ],
            common_errors: 'Acceder a un índice que no existe (IndexError: list index out of range). Recuerda que una lista de 3 elementos tiene índices 0, 1 y 2.',
            mini_exercise: {
              starter_code: 'nums = [10, 20, 30]\n# Agrega 40 al final y luego muestra el último elemento con índice negativo\nnums.append(...)\nprint(nums[...])',
              instructions: 'Agrega 40 y accede con [-1] para imprimir 40.',
              solution: 'nums = [10, 20, 30]\nnums.append(40)\nprint(nums[-1])'
            },
            key_takeaways: [
              'Las listas se declaran con corchetes []. Son mutables.',
              'Los índices inician en 0; los índices negativos cuentan desde el final (-1).',
              '.append() agrega al final; .pop() retira el último elemento.'
            ],
            exercise: {
              id: 'ex_py1_08_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Qué devolverá lista[-1] si lista = [5, 10, 15, 20]?',
              options: [
                { id: 'a', text: '20' },
                { id: 'b', text: '5' },
                { id: 'c', text: '-1' },
                { id: 'd', text: 'IndexError' }
              ],
              correct_option_id: 'a',
              explanation: 'El índice -1 siempre apunta al último elemento de la colección, en este caso 20.'
            }
          },
          {
            id: 'les_py1_08_02',
            code: 'L02',
            title: 'Tuplas Inmutables y Desempaquetado (Unpacking)',
            slug: 'tuplas-y-desempaquetado',
            position: 2,
            concept_id: 'py-tuples',
            objective: 'Diferenciar tuplas de listas y utilizar el desempaquetado simultáneo de variables.',
            theory_markdown: `Una **tupla** es una secuencia ordenada entre paréntesis \`( )\` pero **INMUTABLE**: una vez creada, no puedes agregar, borrar ni modificar sus elementos.\n\n¿Por qué existen las tuplas si las listas son más flexibles?\n1. **Seguridad e integridad**: Garantizan que datos fijos (como coordenadas \`(lat, lon)\` o colores RGB) no sean alterados por error.\n2. **Rendimiento**: Ocupan menos memoria y son más rápidas que las listas.\n\nEl **desempaquetado** permite extraer valores a variables individuales en una sola línea:\n\`x, y = (10, 20)\`.`,
            examples: [
              {
                title: 'Tupla de coordenadas y desempaquetado',
                code: 'punto = (19.4326, -99.1332)\nlatitud, longitud = punto\nprint(f"Lat: {latitud}, Lon: {longitud}")',
                output: 'Lat: 19.4326, Lon: -99.1332',
                explanation: 'Cada variable recibe su valor posicional correspondiente de la tupla.'
              }
            ],
            common_errors: 'Intentar modificar una tupla: `punto[0] = 20` lanza `TypeError: "tuple" object does not support item assignment`.',
            mini_exercise: {
              starter_code: 'datos = ("Alex", 28)\n# Desempaqueta en nombre y edad\nnombre, edad = ...\nprint(f"{nombre} tiene {edad} años")',
              instructions: 'Desempaqueta datos en nombre y edad.',
              solution: 'datos = ("Alex", 28)\nnombre, edad = datos\nprint(f"{nombre} tiene {edad} años")'
            },
            key_takeaways: [
              'Las tuplas usan paréntesis () y son inmutables.',
              'No permiten append, pop ni reasignación de índices.',
              'El desempaquetado asigna múltiples variables a la vez: a, b = tupla.'
            ],
            exercise: {
              id: 'ex_py1_08_02',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Cuál es la principal diferencia entre una lista y una tupla en Python?',
              options: [
                { id: 'a', text: 'Las listas son mutables (modificables) y las tuplas son inmutables' },
                { id: 'b', text: 'Las listas solo aceptan números y las tuplas solo textos' },
                { id: 'c', text: 'Las tuplas no permiten acceder a elementos por índice' },
                { id: 'd', text: 'Las listas no se pueden iterar con bucles for' }
              ],
              correct_option_id: 'a',
              explanation: 'La mutabilidad es la diferencia fundamental: las listas pueden modificarse tras crearse; las tuplas permanecen congeladas.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py1_08_01',
        type: 'predict_output',
        difficulty: 'medium',
        prompt: '¿Qué produce el slicing lista[1:3] sobre lista = ["a", "b", "c", "d"]?',
        options: [
          { id: 'a', text: "['b', 'c']" },
          { id: 'b', text: "['a', 'b', 'c']" },
          { id: 'c', text: "['b', 'c', 'd']" },
          { id: 'd', text: "['c', 'd']" }
        ],
        correct_option_id: 'a',
        explanation: 'El slicing [1:3] toma desde el índice 1 ("b") hasta antes del índice 3 ("c"), produciendo ["b", "c"].'
      },
      {
        id: 'q_py1_08_02',
        type: 'find_error',
        difficulty: 'medium',
        prompt: '¿Por qué fallará este código?',
        prompt_code: 't = (1, 2, 3)\nt[0] = 99',
        options: [
          { id: 'a', text: 'TypeError: las tuplas son inmutables y no admiten asignación de elementos' },
          { id: 'b', text: 'IndexError: el índice 0 no existe en tuplas' },
          { id: 'c', text: 'SyntaxError: falta punto y coma' },
          { id: 'd', text: 'Las tuplas solo pueden contener texto' }
        ],
        correct_option_id: 'a',
        explanation: 'Las tuplas son inmutables en Python. Intentar mutar un elemento lanza TypeError.'
      }
    ]
  },

  // M09
  {
    id: 'py1_mod_09',
    language_id: LANG_ID,
    code: 'PY1_M09',
    slug: 'diccionarios-y-sets',
    title: 'Estructuras Clave-Valor y Conjuntos: Diccionarios y Sets',
    objective: 'Almacenar datos asociativos con diccionarios (dict), dominar .get(), .keys(), .items() y operar con conjuntos (set) para garantizar unicidad.',
    description: 'Modela entidades del mundo real usando pares clave-valor y realiza búsquedas ultrarrápidas con tablas hash nativas.',
    folder: 'python1/09_diccionarios_sets',
    course_slug: 'python-1',
    position: 9,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 240 },
    sections: [
      {
        id: 'sec_py1_09_01',
        code: 'S01',
        title: 'Diccionarios y el Método Seguro .get()',
        slug: 'diccionarios-get',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py1_09_01',
            code: 'L01',
            title: 'Diccionarios: Mapeos Clave-Valor y .get()',
            slug: 'diccionarios-mapeos',
            position: 1,
            concept_id: 'py-dictionaries',
            objective: 'Declarar diccionarios, acceder a claves y evitar KeyError usando .get(clave, default).',
            theory_markdown: `Un **diccionario (\`dict\`)** almacena pares de \`clave: valor\` entre llaves \`{ }\`. En lugar de buscar por índice numérico (como en listas), accedes por el nombre de la clave (un string, número o tupla inmutable).\n\n\`\`\`python\nusuario = {"nombre": "Koda", "rol": "Specialist", "nivel": 1}\nprint(usuario["nombre"])  # "Koda"\n\`\`\`\n\n> **¡Evita el temido KeyError!** Si buscas una clave que no existe con \`usuario["email"]\`, el programa se detiene con error. Usa siempre \`.get("email", "No registrado")\`: si la clave no existe, devuelve el valor por defecto sin quebrar el programa.`,
            examples: [
              {
                title: 'Lectura segura e iteración con .items()',
                code: 'producto = {"id": 101, "titulo": "Monitor 4K", "precio": 350.0}\n\n# Acceso seguro con get\ncategoria = producto.get("categoria", "Sin categoría")\nprint("Categoría:", categoria)\n\n# Iteración de claves y valores\nfor clave, valor in producto.items():\n    print(f"- {clave}: {valor}")',
                output: 'Categoría: Sin categoría\n- id: 101\n- titulo: Monitor 4K\n- precio: 350.0',
                explanation: 'producto.items() devuelve tuplas (clave, valor) listas para desempaquetar en el bucle.'
              }
            ],
            common_errors: 'Usar corchetes en claves inexistentes (KeyError). Usa siempre .get() cuando no tengas la certeza absoluta de que la clave exista.',
            mini_exercise: {
              starter_code: 'perfil = {"nombre": "Alex", "puntos": 500}\n# Obtén "rango" con .get(), si no existe devuelve "Novato"\nrango = perfil.get(...)\nprint(rango)',
              instructions: 'Usa .get("rango", "Novato") para evitar errores.',
              solution: 'perfil = {"nombre": "Alex", "puntos": 500}\nrango = perfil.get("rango", "Novato")\nprint(rango)'
            },
            key_takeaways: [
              'Los diccionarios usan pares {clave: valor}.',
              'Las claves deben ser inmutables (comúnmente strings).',
              '.get(k, default) previene excepciones KeyError.',
              '.items() permite iterar simultáneamente sobre claves y valores.'
            ],
            exercise: {
              id: 'ex_py1_09_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Qué devolverá config.get("timeout", 30) si config = {"puerto": 8080}?',
              options: [
                { id: 'a', text: '30' },
                { id: 'b', text: 'None' },
                { id: 'c', text: 'KeyError' },
                { id: 'd', text: '8080' }
              ],
              correct_option_id: 'a',
              explanation: 'Como la clave "timeout" no está en el diccionario, .get() retorna el valor por defecto especificado: 30.'
            }
          },
          {
            id: 'les_py1_09_02',
            code: 'L02',
            title: 'Conjuntos (Sets): Unicidad y Operaciones Matemáticas',
            slug: 'sets-conjuntos',
            position: 2,
            concept_id: 'py-sets',
            objective: 'Eliminar duplicados al instante y realizar uniones e intersecciones de conjuntos.',
            theory_markdown: `Un **set** es una colección desordenada de elementos **únicos** entre llaves \`{ }\` (o creada con \`set()\`).\n\n1. **Cero duplicados**: Si agregas el mismo valor dos veces, el set lo conserva solo una vez. Es la técnica más rápida de Python para eliminar duplicados de una lista: \`lista_sin_duplicados = list(set(lista_original))\`.\n2. **Búsqueda instantánea O(1)**: Verificar si un elemento está en un set (\`x in mi_set\`) toma tiempo constante, mucho más rápido que recorrer una lista.\n3. **Operaciones de conjuntos**: \`A | B\` (unión), \`A & B\` (intersección), \`A - B\` (diferencia).`,
            examples: [
              {
                title: 'Eliminación de duplicados e intersección',
                code: 'usuarios_web = {"ana", "carlos", "elena", "ana"}\nprint("Usuarios únicos:", usuarios_web)  # {"ana", "carlos", "elena"}\n\nadmin = {"carlos", "marcos"}\ncomunes = usuarios_web & admin\nprint("Admins en web:", comunes)         # {"carlos"}',
                output: "Usuarios únicos: {'ana', 'carlos', 'elena'}\nAdmins en web: {'carlos'}",
                explanation: 'El set descarta automáticamente el segundo "ana" y & halla la intersección de ambos grupos.'
              }
            ],
            common_errors: 'Intentar crear un set vacío con `{}`. En Python `{}` crea un diccionario vacío. Para un set vacío usa `set()`.',
            mini_exercise: {
              starter_code: 'tags = ["python", "ia", "python", "backend"]\n# Convierte a set para eliminar duplicados\ntags_unicos = ...\nprint(tags_unicos)',
              instructions: 'Usa set(tags) para eliminar los repetidos.',
              solution: 'tags = ["python", "ia", "python", "backend"]\ntags_unicos = set(tags)\nprint(tags_unicos)'
            },
            key_takeaways: [
              'Los sets no permiten elementos duplicados.',
              'set() crea un conjunto vacío ({} es un dict vacío).',
              'Permite operaciones matemáticas: unión (|), intersección (&), diferencia (-).'
            ],
            exercise: {
              id: 'ex_py1_09_02',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Cuántos elementos contendrá len(set([1, 1, 2, 2, 3, 3]))?',
              options: [
                { id: 'a', text: '3' },
                { id: 'b', text: '6' },
                { id: 'c', text: '1' },
                { id: 'd', text: 'TypeError' }
              ],
              correct_option_id: 'a',
              explanation: 'El set descarta los duplicados dejando únicamente los valores {1, 2, 3}, por lo que su longitud es 3.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py1_09_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Cómo se crea un conjunto (set) vacío en Python?',
        options: [
          { id: 'a', text: 'set()' },
          { id: 'b', text: '{}' },
          { id: 'c', text: '[]' },
          { id: 'd', text: 'set([])' }
        ],
        correct_option_id: 'a',
        explanation: '{} crea un diccionario vacío. Para instanciar un set vacío se utiliza la función constructora set().'
      },
      {
        id: 'q_py1_09_02',
        type: 'predict_output',
        difficulty: 'medium',
        prompt: '¿Qué imprime el operador de intersección & entre {1, 2, 3} y {2, 3, 4}?',
        options: [
          { id: 'a', text: '{2, 3}' },
          { id: 'b', text: '{1, 2, 3, 4}' },
          { id: 'c', text: '{1, 4}' },
          { id: 'd', text: '5' }
        ],
        correct_option_id: 'a',
        explanation: 'La intersección (&) extrae los elementos presentes en ambos conjuntos simultáneamente (2 y 3).'
      }
    ]
  },

  // M10
  {
    id: 'py1_mod_10',
    language_id: LANG_ID,
    code: 'PY1_M10',
    slug: 'funciones-fundamentales',
    title: 'Funciones Fundamentales, Debugging y Mini-Proyecto',
    objective: 'Estructurar lógica modular reutilizable con def, return, parámetros por defecto, entender scope local/global y leer tracebacks de error.',
    description: 'El clímax de Fundamentos: crea tus propias herramientas con funciones puras, aprende a interpretar mensajes de error y construye el proyecto integrador del nivel 1.',
    folder: 'python1/10_funciones',
    course_slug: 'python-1',
    position: 10,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 300 },
    sections: [
      {
        id: 'sec_py1_10_01',
        code: 'S01',
        title: 'Definición de Funciones y la Instrucción return',
        slug: 'definicion-funciones-return',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_py1_10_01',
            code: 'L01',
            title: 'Funciones con def, Parámetros y return',
            slug: 'funciones-def-return',
            position: 1,
            concept_id: 'py-functions-basic',
            objective: 'Diferenciar entre imprimir en consola con print() y retornar un valor utilizable con return.',
            theory_markdown: `Una **función** es un bloque de código empaquetado con nombre que realiza una tarea específica y puede ser invocado tantas veces como sea necesario (principio DRY: Don't Repeat Yourself).\n\n\`\`\`python\ndef calcular_area_rectangulo(base, altura):\n    area = base * altura\n    return area  # Devuelve el resultado al invocador\n\`\`\`\n\n> **La diferencia vital entre print y return:** \`print()\` simplemente muestra un texto en la pantalla para ojos humanos y se pierde en la nada. \`return\` entrega el valor de vuelta al programa para que puedas guardarlo en una variable, sumarlo o pasarlo a otra función. Si una función no tiene \`return\`, devuelve \`None\` por defecto.`,
            examples: [
              {
                title: 'Función con parámetros por defecto y retorno',
                code: 'def saludar(nombre, prefijo="Bienvenido"):\n    return f"¡{prefijo}, {nombre}!"\n\nmsj1 = saludar("Koda")\nmsj2 = saludar("Alex", prefijo="Hola")\nprint(msj1)\nprint(msj2)',
                output: '¡Bienvenido, Koda!\n¡Hola, Alex!',
                explanation: 'Si no envías el argumento prefijo, toma el valor por defecto "Bienvenido".'
              }
            ],
            common_errors: 'Olvidar el return y luego intentar usar el resultado: `resultado = mi_funcion()` tendrá el valor `None`.',
            mini_exercise: {
              starter_code: '# Crea una función que reciba n y retorne su cuadrado (n ** 2)\ndef cuadrado(n):\n    ...\n\nprint(cuadrado(5))  # Debe mostrar 25',
              instructions: 'Usa return n ** 2 dentro de la función.',
              solution: 'def cuadrado(n):\n    return n ** 2\n\nprint(cuadrado(5))'
            },
            key_takeaways: [
              'def declara una función reutilizable.',
              'return entrega el resultado y finaliza la ejecución de la función.',
              'Los parámetros por defecto van al final de la lista de parámetros.',
              'Una función sin return devuelve None.'
            ],
            exercise: {
              id: 'ex_py1_10_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Qué valor se almacenará en res?',
              prompt_code: 'def sumar(a, b):\n    print(a + b)\n\nres = sumar(2, 3)\nprint(res)',
              options: [
                { id: 'a', text: '5 en la primera línea y None en la segunda' },
                { id: 'b', text: '5 en ambas líneas' },
                { id: 'c', text: 'None' },
                { id: 'd', text: 'Error' }
              ],
              correct_option_id: 'a',
              explanation: 'sumar imprime 5 durante su ejecución, pero como carece de return, res recibe el valor None por defecto.'
            }
          },
          {
            id: 'les_py1_10_02',
            code: 'L02',
            title: 'Lectura de Tracebacks y Diagnóstico de Errores',
            slug: 'lectura-tracebacks',
            position: 2,
            concept_id: 'py-tracebacks',
            objective: 'Interpretar los mensajes de error de Python de abajo hacia arriba sin pánico.',
            theory_markdown: `Cuando Python encuentra un problema que no sabe cómo resolver, se detiene y genera un **Traceback** (el registro de la pila de llamadas).\n\nPara leer un traceback como un programador senior:\n1. **Mira la última línea primero**: Indica el tipo exacto de error (\`NameError\`, \`TypeError\`, \`IndexError\`, \`ZeroDivisionError\`) y una breve explicación en inglés.\n2. **Sube a la línea anterior**: Te indica exactamente el nombre del archivo y el número de línea donde ocurrió el fallo.\n3. **Causa común**: Un error en la línea 12 a menudo se debe a una variable mal definida en la línea 10.`,
            examples: [
              {
                title: 'Ejemplo de traceback y su traducción',
                code: '# ZeroDivisionError: division by zero\ndef calcular_promedio(total, cantidad):\n    if cantidad == 0:\n        return 0\n    return total / cantidad\n\nprint("Promedio:", calcular_promedio(100, 0))',
                output: 'Promedio: 0',
                explanation: 'Validamos cantidad == 0 antes de dividir para prevenir la excepción ZeroDivisionError.'
              }
            ],
            common_errors: 'Asustarse con el texto rojo en la consola en lugar de leer calmadamente la última línea del Traceback.',
            mini_exercise: {
              starter_code: '# Corrige la función para que no falle si la lista viene vacía\ndef primer_elemento(lista):\n    if len(lista) == 0:\n        return None\n    return lista[0]',
              instructions: 'Observa cómo la guardia if len(lista) == 0 previene un IndexError.',
              solution: 'def primer_elemento(lista):\n    if len(lista) == 0:\n        return None\n    return lista[0]'
            },
            key_takeaways: [
              'La última línea del traceback describe el error exacto.',
              'Los tipos frecuentes son TypeError, NameError, IndexError y ValueError.',
              'Las comprobaciones de guardia previenen fallos en tiempo de ejecución.'
            ],
            exercise: {
              id: 'ex_py1_10_02',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: 'Al depurar un fallo en Python, ¿cuál es la mejor estrategia para leer el Traceback?',
              options: [
                { id: 'a', text: 'Leer la última línea para identificar el tipo de excepción y el mensaje de error' },
                { id: 'b', text: 'Borrar todo el archivo y empezar de nuevo' },
                { id: 'c', text: 'Ignorar el mensaje y cambiar nombres al azar' },
                { id: 'd', text: 'Los tracebacks solo son informativos y no indican la línea del error' }
              ],
              correct_option_id: 'a',
              explanation: 'La última línea contiene el nombre del error y la causa específica, siendo el punto de partida fundamental para solucionarlo.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py1_10_01',
        type: 'predict_output',
        difficulty: 'medium',
        prompt: '¿Qué salida produce este código?',
        prompt_code: 'def operar(x, factor=2):\n    return x * factor\n\nprint(operar(5) + operar(3, 4))',
        options: [
          { id: 'a', text: '22' },
          { id: 'b', text: '16' },
          { id: 'c', text: '20' },
          { id: 'd', text: 'TypeError' }
        ],
        correct_option_id: 'a',
        explanation: 'operar(5) usa el factor por defecto (5 * 2 = 10). operar(3, 4) usa factor=4 (3 * 4 = 12). 10 + 12 = 22.'
      },
      {
        id: 'q_py1_10_02',
        type: 'find_error',
        difficulty: 'medium',
        prompt: '¿Qué error de sintaxis tiene la siguiente cabecera de función?',
        prompt_code: 'def configurar(tema="oscuro", usuario):\n    pass',
        options: [
          { id: 'a', text: 'SyntaxError: los parámetros sin valor por defecto no pueden ir después de los que sí tienen' },
          { id: 'b', text: 'Falta especificar el tipo de retorno' },
          { id: 'c', text: 'La palabra pass es inválida' },
          { id: 'd', text: 'No se pueden tener parámetros con comillas' }
        ],
        correct_option_id: 'a',
        explanation: 'En Python, todos los parámetros posicionales obligatorios deben colocarse antes de cualquier parámetro con valor por defecto.'
      }
    ]
  }
];

