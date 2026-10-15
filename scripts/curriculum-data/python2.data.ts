import type { RawModule } from './types.ts';

const LANG_ID = 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

export const PYTHON2_MODULES: RawModule[] = [
  // M01
  {
    id: 'py2_mod_01',
    language_id: LANG_ID,
    code: 'PY2_M01',
    slug: 'comprensiones',
    title: 'Comprensiones de Listas, Diccionarios y Sets',
    objective: 'Transformar y filtrar colecciones en una sola línea concisa mediante list, dict y set comprehensions.',
    description: 'Escribe código elegante y veloz sustituyendo bucles for acumulativos por comprensiones funcionales legibles.',
    folder: 'python2/01_comprensiones',
    course_slug: 'python-2',
    position: 1,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 220 },
    sections: [
      {
        id: 'sec_py2_01_01',
        code: 'S01',
        title: 'List Comprehensions y Filtrado',
        slug: 'list-comprehensions',
        position: 1,
        type: 'theory',
        estimated_minutes: 15,
        xp_on_complete: 40,
        lessons: [
          {
            id: 'les_py2_01_01',
            code: 'L01',
            title: 'Sintaxis de List Comprehensions',
            slug: 'sintaxis-list-comprehensions',
            position: 1,
            concept_id: 'py2-list-comp',
            objective: 'Dominar la fórmula [expresion for item in iterable if condicion].',
            theory_markdown: `En lugar de crear una lista vacía, iterar con un for y hacer .append(), una **list comprehension** condensa esa transformación en una sola expresión idiomática:\n\n\`[expresion for elemento in secuencia if condicion]\`\n\nNo solo es más limpio de leer; el intérprete de Python lo ejecuta a nivel de bytecode C, haciéndolo sensiblemente más rápido que un bucle for manual.`,
            examples: [
              {
                title: 'Transformación y filtro simultáneo',
                code: 'numeros = [1, 2, 3, 4, 5, 6]\ncuadrados_pares = [n ** 2 for n in numeros if n % 2 == 0]\nprint("Pares al cuadrado:", cuadrados_pares)',
                output: 'Pares al cuadrado: [4, 16, 36]',
                explanation: 'Filtra solo los pares (2, 4, 6) y los eleva al cuadrado (4, 16, 36).'
              }
            ],
            common_errors: 'Hacer comprensiones de 3 o 4 líneas anidadas. Si la comprensión requiere lógica compleja o más de un if, es preferible un bucle for tradicional.',
            mini_exercise: {
              starter_code: 'palabras = ["koda", "python", "ai"]\n# Genera una lista con las palabras en mayúscula\nmayus = ...\nprint(mayus)',
              instructions: 'Usa [p.upper() for p in palabras].',
              solution: 'palabras = ["koda", "python", "ai"]\nmayus = [p.upper() for p in palabras]\nprint(mayus)'
            },
            key_takeaways: [
              '[exp for x in lista] crea una lista transformada.',
              'Se pueden agregar filtros finales con if condicion.',
              'Es más rápido y conciso que for + append.'
            ],
            exercise: {
              id: 'ex_py2_01_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Qué genera [x * 2 for x in [1, 2, 3]]?',
              options: [
                { id: 'a', text: '[2, 4, 6]' },
                { id: 'b', text: '[1, 2, 3, 1, 2, 3]' },
                { id: 'c', text: '[2, 2, 2]' },
                { id: 'd', text: 'Error' }
              ],
              correct_option_id: 'a',
              explanation: 'Multiplica cada elemento x individual por 2, produciendo [2, 4, 6].'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py2_01_01',
        type: 'predict_output',
        difficulty: 'medium',
        prompt: '¿Qué genera {x: x**2 for x in (1, 2, 3)}?',
        options: [
          { id: 'a', text: '{1: 1, 2: 4, 3: 9}' },
          { id: 'b', text: '[1, 4, 9]' },
          { id: 'c', text: '{1, 4, 9}' },
          { id: 'd', text: 'TypeError' }
        ],
        correct_option_id: 'a',
        explanation: 'Es una dict comprehension que crea un diccionario mapeando cada x a su cuadrado.'
      }
    ]
  },

  // M02
  {
    id: 'py2_mod_02',
    language_id: LANG_ID,
    code: 'PY2_M02',
    slug: 'funciones-avanzadas',
    title: 'Funciones Avanzadas: *args, **kwargs y Lambdas',
    objective: 'Escribir funciones flexibles con cantidad variable de argumentos posicionales (*args) y nombrados (**kwargs), junto con funciones anónimas lambda.',
    description: 'Lleva tus funciones al siguiente nivel: parámetros dinámicos, empaquetado/desempaquetado y funciones de primer orden.',
    folder: 'python2/02_funciones_avanzadas',
    course_slug: 'python-2',
    position: 2,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 230 },
    sections: [
      {
        id: 'sec_py2_02_01',
        code: 'S01',
        title: 'Empaquetado *args y **kwargs',
        slug: 'args-kwargs',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py2_02_01',
            code: 'L01',
            title: '*args y **kwargs en Profundidad',
            slug: 'args-y-kwargs-base',
            position: 1,
            concept_id: 'py2-args-kwargs',
            objective: 'Recibir una cantidad arbitraria de argumentos en tus funciones.',
            theory_markdown: `En muchas situaciones no sabes cuántos argumentos pasará el usuario:\n- \`*args\` (arguments): Empaqueta todos los argumentos posicionales adicionales en una **tupla**.\n- \`**kwargs\` (keyword arguments): Empaqueta todos los argumentos nombrados adicionales en un **diccionario**.\n\nEl nombre de la variable no es lo importante; el poder reside en el operador asterisco (\`*\` y \`**\`).`,
            examples: [
              {
                title: 'Función sumadora flexible y logger de metadatos',
                code: 'def sumar_todo(*numeros):\n    return sum(numeros)\n\ndef registrar_evento(evento, **metadata):\n    print(f"Evento: {evento}")\n    for k, v in metadata.items():\n        print(f"  {k}: {v}")\n\nprint("Suma:", sumar_todo(10, 20, 30, 40))\nregistrar_evento("LOGIN", usuario="alex", ip="192.168.1.1", exito=True)',
                output: 'Suma: 100\nEvento: LOGIN\n  usuario: alex\n  ip: 192.168.1.1\n  exito: True',
                explanation: 'sumar_todo acepta cualquier número de argumentos como tupla, y registrar_evento recibe pares clave-valor como dict.'
              }
            ],
            common_errors: 'Colocar *args después de **kwargs. El orden estricto de parámetros en Python es: posicionales, *args, por defecto, **kwargs.',
            mini_exercise: {
              starter_code: '# Crea una función que multiplique todos los números pasados en *args\ndef multiplicar(*nums):\n    res = 1\n    for n in nums:\n        res *= n\n    return res\n\nprint(multiplicar(2, 3, 4))',
              instructions: 'Verifica que la función retorne 24.',
              solution: 'def multiplicar(*nums):\n    res = 1\n    for n in nums:\n        res *= n\n    return res\n\nprint(multiplicar(2, 3, 4))'
            },
            key_takeaways: [
              '*args empaqueta argumentos posicionales en una tupla.',
              '**kwargs empaqueta argumentos nombrados en un diccionario.',
              'El orden estricto es obligatorio en la cabecera def.'
            ],
            exercise: {
              id: 'ex_py2_02_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿De qué tipo es args dentro de una función definida como def f(*args)?',
              options: [
                { id: 'a', text: 'tuple' },
                { id: 'b', text: 'list' },
                { id: 'c', text: 'dict' },
                { id: 'd', text: 'set' }
              ],
              correct_option_id: 'a',
              explanation: '*args empaqueta siempre en una tupla inmutable.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py2_02_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué estructura de datos recibe kwargs en def f(**kwargs)?',
        options: [
          { id: 'a', text: 'dict (diccionario)' },
          { id: 'b', text: 'tuple (tupla)' },
          { id: 'c', text: 'list (lista)' },
          { id: 'd', text: 'str (cadena)' }
        ],
        correct_option_id: 'a',
        explanation: '**kwargs empaqueta los argumentos con nombre (clave=valor) en un diccionario dict.'
      }
    ]
  },

  // M03
  {
    id: 'py2_mod_03',
    language_id: LANG_ID,
    code: 'PY2_M03',
    slug: 'modulos-y-paquetes',
    title: 'Módulos, Paquetes y __init__.py',
    objective: 'Organizar código a gran escala dividiendo en módulos .py, paquetes con __init__.py y el condicional __name__ == "__main__".',
    description: 'Aprende a estructurar proyectos limpios: cómo importar correctamente, namespaces y crear scripts reutilizables como librerías.',
    folder: 'python2/03_modulos_paquetes',
    course_slug: 'python-2',
    position: 3,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 240 },
    sections: [
      {
        id: 'sec_py2_03_01',
        code: 'S01',
        title: 'Módulos y el Bloque __main__',
        slug: 'modulos-y-main',
        position: 1,
        type: 'theory',
        estimated_minutes: 15,
        xp_on_complete: 40,
        lessons: [
          {
            id: 'les_py2_03_01',
            code: 'L01',
            title: 'Módulos, Importaciones y if __name__ == "__main__"',
            slug: 'modulos-main-base',
            position: 1,
            concept_id: 'py2-modules',
            objective: 'Evitar que código de prueba se ejecute al ser importado por otro archivo.',
            theory_markdown: `Todo archivo \`.py\` es un **módulo**. Cuando importas un módulo con \`import matematicas\`, Python ejecuta todo el archivo de arriba a abajo.\n\nPara que un archivo pueda comportarse tanto como **script ejecutable independiente** y como **módulo importable**: usamos la variable especial \`__name__\`:\n- Si ejecutas el archivo directamente: \`__name__ == "__main__"\`.\n- Si otro archivo lo importa: \`__name__ == "nombre_del_modulo"\`.`,
            examples: [
              {
                title: 'Estructura canónica de un módulo',
                code: 'def sumar(a, b):\n    return a + b\n\n# Solo se ejecuta si se corre directamente: python mi_script.py\nif __name__ == "__main__":\n    print("Probando función sumar:", sumar(2, 3))',
                output: 'Probando función sumar: 5',
                explanation: 'Al importarlo desde otro archivo, la prueba no se dispara contaminando la consola.'
              }
            ],
            common_errors: 'Usar `from modulo import *`. Esto contamina el namespace local y dificulta saber de dónde proviene cada función.',
            mini_exercise: {
              starter_code: '# Protege este print para que solo corra como script principal\nif ...:\n    print("Ejecutando como script")',
              instructions: 'Usa if __name__ == "__main__":',
              solution: 'if __name__ == "__main__":\n    print("Ejecutando como script")'
            },
            key_takeaways: [
              'Todo archivo .py es un módulo importable.',
              '__name__ vale "__main__" únicamente cuando el archivo se lanza directamente.',
              '__init__.py marca un directorio como un paquete Python.'
            ],
            exercise: {
              id: 'ex_py2_03_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué valor tiene __name__ cuando un archivo calculadora.py es importado desde main.py?',
              options: [
                { id: 'a', text: '"calculadora"' },
                { id: 'b', text: '"__main__"' },
                { id: 'c', text: 'None' },
                { id: 'd', text: 'True' }
              ],
              correct_option_id: 'a',
              explanation: 'Al ser importado, __name__ adopta el nombre del módulo importado ("calculadora").'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py2_03_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Cuál es el archivo especial que tradicionalmente indica que una carpeta debe tratarse como un paquete de Python?',
        options: [
          { id: 'a', text: '__init__.py' },
          { id: 'b', text: 'package.json' },
          { id: 'c', text: '__main__.py' },
          { id: 'd', text: 'module.config' }
        ],
        correct_option_id: 'a',
        explanation: '__init__.py inicializa el paquete e indica al intérprete que la carpeta es un módulo estructurado.'
      }
    ]
  },

  // M04
  {
    id: 'py2_mod_04',
    language_id: LANG_ID,
    code: 'PY2_M04',
    slug: 'manejo-de-excepciones',
    title: 'Manejo Robusto de Excepciones',
    objective: 'Interceptar y gestionar fallos de forma elegante con try, except específico, else, finally y raise.',
    description: 'Crea software resiliente que no se caiga ante errores imprevistos: manejo defensivo, jerarquía de excepciones y limpieza de recursos.',
    folder: 'python2/04_manejo_excepciones',
    course_slug: 'python-2',
    position: 4,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 250 },
    sections: [
      {
        id: 'sec_py2_04_01',
        code: 'S01',
        title: 'Bloques try-except-else-finally',
        slug: 'try-except-finally',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py2_04_01',
            code: 'L01',
            title: 'Captura Específica de Excepciones',
            slug: 'captura-especifica',
            position: 1,
            concept_id: 'py2-exceptions',
            objective: 'Evitar el antipatrón de captura genérica (except:) y manejar errores específicos.',
            theory_markdown: `En lugar de dejar que tu servidor colapse ante una entrada inválida, usas un bloque \`try-except\`:\n- \`try:\`: Bloque con código propenso a fallar.\n- \`except ValueError as e:\`: Se ejecuta SOLO si ocurre esa excepción específica.\n- \`else:\`: Se ejecuta si NO ocurrió ningún error en el \`try\`.\n- \`finally:\`: Se ejecuta **SIEMPRE**, haya o no error (ideal para cerrar conexiones o archivos).`,
            examples: [
              {
                title: 'Conversión robusta con try-except completo',
                code: 'def dividir_seguro(a, b):\n    try:\n        res = a / b\n    except ZeroDivisionError:\n        return "Error: no puedes dividir entre cero"\n    except TypeError:\n        return "Error: los argumentos deben ser números"\n    else:\n        return f"Éxito: {res}"\n    finally:\n        # Limpieza o log garantizado\n        pass\n\nprint(dividir_seguro(10, 2))\nprint(dividir_seguro(10, 0))',
                output: 'Éxito: 5.0\nError: no puedes dividir entre cero',
                explanation: 'Captura con precisión ZeroDivisionError sin silenciar otros posibles errores no previstos.'
              }
            ],
            common_errors: 'Escribir un simple `except: pass` (captura muda). Oculta errores de sintaxis, variables mal escritas e interrupciones del teclado (KeyboardInterrupt).',
            mini_exercise: {
              starter_code: '# Captura ValueError al convertir texto a entero\ntry:\n    num = int("koda")\nexcept ...:\n    print("Número inválido")',
              instructions: 'Usa except ValueError: para manejar el fallo.',
              solution: 'try:\n    num = int("koda")\nexcept ValueError:\n    print("Número inválido")'
            },
            key_takeaways: [
              'Captura siempre la excepción más específica posible.',
              'else corre solo si el try tuvo éxito.',
              'finally se ejecuta invariablemente al final.'
            ],
            exercise: {
              id: 'ex_py2_04_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿En qué caso se ejecuta el bloque finally de un try-except?',
              options: [
                { id: 'a', text: 'Siempre, sin importar si hubo excepción o no' },
                { id: 'b', text: 'Solo si ocurrió un error' },
                { id: 'c', text: 'Solo si el bloque try tuvo éxito' },
                { id: 'd', text: 'Únicamente si se ejecuta un break' }
              ],
              correct_option_id: 'a',
              explanation: 'El bloque finally está garantizado que se ejecutará siempre, haya o no ocurrido una excepción.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py2_04_01',
        type: 'find_error',
        difficulty: 'medium',
        prompt: '¿Por qué la comunidad de Python desaconseja fuertemente `except: pass`?',
        options: [
          { id: 'a', text: 'Oculta bugs críticos y excepciones del sistema como KeyboardInterrupt o MemoryError' },
          { id: 'b', text: 'Porque hace que el programa consuma 100% de CPU' },
          { id: 'c', text: 'Porque la palabra pass es ilegal dentro de un except' },
          { id: 'd', text: 'No está desaconsejado, es la mejor práctica de PEP 8' }
        ],
        correct_option_id: 'a',
        explanation: 'Un except desnudo silencia cualquier error sin informar, haciendo imposible la depuración.'
      }
    ]
  },

  // M05
  {
    id: 'py2_mod_05',
    language_id: LANG_ID,
    code: 'PY2_M05',
    slug: 'archivos-txt-csv-json',
    title: 'Persistencia: Archivos TXT, CSV y JSON',
    objective: 'Leer y escribir archivos de forma segura con el context manager with open(), serializar datos estructurados con json y procesar tablas con csv.',
    description: 'Guarda información de manera persistente en disco: almacena configuraciones en JSON, procesa hojas de datos en CSV y gestiona recursos con with.',
    folder: 'python2/05_archivos_io',
    course_slug: 'python-2',
    position: 5,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 250 },
    sections: [
      {
        id: 'sec_py2_05_01',
        code: 'S01',
        title: 'Context Manager with open() y JSON',
        slug: 'open-y-json',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py2_05_01',
            code: 'L01',
            title: 'Manejo Seguro con with open() y JSON dumps/loads',
            slug: 'open-json-base',
            position: 1,
            concept_id: 'py2-file-io',
            objective: 'Aprender por qué with open garantiza el cierre automático del descriptor de archivo y cómo persistir JSON.',
            theory_markdown: `Si abres un archivo con \`f = open("datos.txt")\` y ocurre un error antes de \`f.close()\`, el archivo quedará bloqueado en el sistema operativo.\n\nLa sintaxis profesional es el **context manager with**:\n\`\`\`python\nwith open("archivo.txt", "w", encoding="utf-8") as f:\n    f.write("Línea guardada\\n")\n# Al salir de la sangría, Python cierra el archivo automáticamente.\n\`\`\`\n\nPara datos estructurados usamos el módulo nativo \`json\`:\n- \`json.dumps(obj)\`: Convierte un diccionario de Python a string JSON.\n- \`json.loads(str)\`: Parsea un string JSON a diccionario de Python.\n- \`json.dump(obj, f)\` / \`json.load(f)\`: Leen/escriben directamente en el archivo abierto.`,
            examples: [
              {
                title: 'Serialización y recuperación JSON en disco',
                code: 'import json\n\nusuario = {"id": 1, "nombre": "Koda", "activo": True}\n# Guardar como JSON\njson_str = json.dumps(usuario, indent=2)\nprint("JSON resultante:\\n", json_str)\n\n# Recuperar como diccionario\nrecuperado = json.loads(json_str)\nprint("Nombre recuperado:", recuperado["nombre"])',
                output: 'JSON resultante:\n {\n  "id": 1,\n  "nombre": "Koda",\n  "activo": true\n}\nNombre recuperado: Koda',
                explanation: 'True en Python se serializa automáticamente a true en JSON estándar.'
              }
            ],
            common_errors: 'Olvidar el parámetro `encoding="utf-8"`, lo que causa errores UnicodeDecodeError en Windows con caracteres como tildes o la letra ñ.',
            mini_exercise: {
              starter_code: 'import json\ndata = \'{"puntos": 100}\'\n# Parsea data a diccionario usando json.loads\nresultado = ...\nprint(resultado["puntos"])',
              instructions: 'Usa json.loads(data).',
              solution: 'import json\ndata = \'{"puntos": 100}\'\nresultado = json.loads(data)\nprint(resultado["puntos"])'
            },
            key_takeaways: [
              'with open() cierra el archivo automáticamente pase lo que pase.',
              'Siempre especifica encoding="utf-8".',
              'json.loads convierte string a dict; json.dumps convierte dict a string.'
            ],
            exercise: {
              id: 'ex_py2_05_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Cuál es el beneficio de usar la instrucción `with open(...) as f:` sobre `f = open(...)`?',
              options: [
                { id: 'a', text: 'Garantiza el cierre del archivo automáticamente incluso si ocurre una excepción' },
                { id: 'b', text: 'Comprime el archivo en formato zip' },
                { id: 'c', text: 'Aumenta la velocidad de lectura en disco un 500%' },
                { id: 'd', text: 'Evita tener que escribir comillas' }
              ],
              correct_option_id: 'a',
              explanation: 'El context manager with invoca __exit__ al salir del bloque, garantizando la liberación del recurso sin fugas de memoria.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py2_05_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Qué modo de apertura debes usar en open("log.txt", modo) para añadir nuevas líneas al final sin borrar el contenido existente?',
        options: [
          { id: 'a', text: '"a" (append)' },
          { id: 'b', text: '"w" (write)' },
          { id: 'c', text: '"r" (read)' },
          { id: 'd', text: '"x" (exclusive)' }
        ],
        correct_option_id: 'a',
        explanation: 'El modo "a" (append) añade al final del archivo existente; "w" sobrescribe y borra el contenido previo.'
      }
    ]
  },

  // M06
  {
    id: 'py2_mod_06',
    language_id: LANG_ID,
    code: 'PY2_M06',
    slug: 'poo-clases-y-objetos',
    title: 'POO I: Clases, Instancias y Métodos Especiales',
    objective: 'Modelar conceptos del mundo real mediante clases, entender el rol de self, el constructor __init__ y los métodos __str__ y __repr__.',
    description: 'La base de la arquitectura de software moderna: empaqueta estado (atributos) y comportamiento (métodos) en clases reutilizables.',
    folder: 'python2/06_poo_clases',
    course_slug: 'python-2',
    position: 6,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 260 },
    sections: [
      {
        id: 'sec_py2_06_01',
        code: 'S01',
        title: 'Clases, Instancias y self',
        slug: 'clases-y-self',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_py2_06_01',
            code: 'L01',
            title: 'El Molde y la Galleta: Clases y el Constructor __init__',
            slug: 'clases-init-self',
            position: 1,
            concept_id: 'py2-oop-basics',
            objective: 'Comprender que una clase es un plano y self es la referencia a la instancia viva en memoria.',
            theory_markdown: `Piensa en una **clase** como el plano arquitectónico de una casa, y en un **objeto (o instancia)** como la casa física construida con ladrillos en un terreno real.\n\n- \`__init__(self, ...)\`: Es el método inicializador que se ejecuta automáticamente al crear un nuevo objeto (\`u = Usuario("Alex")\`).\n- \`self\`: Es la referencia a la instancia concreta sobre la que se está operando. Cuando llamas a \`u.saludar()\`, Python lo traduce internamente a \`Usuario.saludar(u)\`.\n- \`__str__(self)\`: Define cómo se muestra tu objeto como texto cuando alguien hace \`print(objeto)\`.`,
            examples: [
              {
                title: 'Definición de una clase de cuenta bancaria',
                code: 'class CuentaBancaria:\n    def __init__(self, titular, saldo_inicial=0.0):\n        self.titular = titular\n        self.saldo = saldo_inicial\n\n    def depositar(self, monto):\n        if monto > 0:\n            self.saldo += monto\n\n    def __str__(self):\n        return f"Cuenta({self.titular}, Saldo: ${self.saldo:.2f})"\n\ncuenta = CuentaBancaria("Elena", 100.0)\ncuenta.depositar(50.0)\nprint(cuenta)',
                output: 'Cuenta(Elena, Saldo: $150.00)',
                explanation: 'self.saldo mantiene el estado privado de esa cuenta específica.'
              }
            ],
            common_errors: 'Olvidar poner self como primer parámetro de los métodos de instancia (TypeError: metodo() takes 0 positional arguments but 1 was given).',
            mini_exercise: {
              starter_code: 'class Jugador:\n    def __init__(self, nombre):\n        self.nombre = nombre\n        self.nivel = 1\n\nj = Jugador("Koda")\nprint(j.nombre, j.nivel)',
              instructions: 'Crea una instancia Jugador("Koda") y verifica que su nivel inicial sea 1.',
              solution: 'class Jugador:\n    def __init__(self, nombre):\n        self.nombre = nombre\n        self.nivel = 1\n\nj = Jugador("Koda")\nprint(j.nombre, j.nivel)'
            },
            key_takeaways: [
              'class NombreClase: define un nuevo tipo.',
              '__init__ inicializa los atributos de instancia.',
              'self representa a la instancia viva que llama al método.',
              '__str__ define la representación textual para print().'
            ],
            exercise: {
              id: 'ex_py2_06_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué representa el primer parámetro `self` en los métodos de una clase en Python?',
              options: [
                { id: 'a', text: 'Una referencia explícita a la instancia actual del objeto' },
                { id: 'b', text: 'Una palabra reservada para acceder a la base de datos' },
                { id: 'c', text: 'El número de veces que se ha instanciado la clase' },
                { id: 'd', text: 'El archivo .py donde vive la clase' }
              ],
              correct_option_id: 'a',
              explanation: 'self permite a los métodos de instancia acceder y modificar los atributos de ese objeto en particular.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py2_06_01',
        type: 'predict_output',
        difficulty: 'medium',
        prompt: '¿Qué método mágico de Python se invoca al llamar a str(objeto) o print(objeto)?',
        options: [
          { id: 'a', text: '__str__' },
          { id: 'b', text: '__print__' },
          { id: 'c', text: '__to_string__' },
          { id: 'd', text: '__text__' }
        ],
        correct_option_id: 'a',
        explanation: '__str__ es el método especial que devuelve la representación en string legible para el usuario.'
      }
    ]
  },

  // M07
  {
    id: 'py2_mod_07',
    language_id: LANG_ID,
    code: 'PY2_M07',
    slug: 'poo-herencia-y-polimorfismo',
    title: 'POO II: Herencia, super() y Polimorfismo',
    objective: 'Reutilizar y especializar comportamientos mediante herencia simple, super() y aplicar polimorfismo mediante interfaces conceptuales.',
    description: 'Extiende jerarquías de clases sin duplicar código, invoca constructores padre con super() y diseña sistemas polimórficos.',
    folder: 'python2/07_poo_herencia',
    course_slug: 'python-2',
    position: 7,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 260 },
    sections: [
      {
        id: 'sec_py2_07_01',
        code: 'S01',
        title: 'Herencia y la Función super()',
        slug: 'herencia-super',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py2_07_01',
            code: 'L01',
            title: 'Herencia y Reutilización con super()',
            slug: 'herencia-super-base',
            position: 1,
            concept_id: 'py2-inheritance',
            objective: 'Heredar atributos y métodos de una clase base e invocar el constructor padre.',
            theory_markdown: `La **herencia** permite que una clase hija (\`Empleado\`) herede todos los atributos y métodos de una clase padre (\`Persona\`), evitando reescribir código idéntico.\n\nPara invocar el método de la clase padre (por ejemplo su constructor), usamos \`super()\`:\n\`\`\`python\nclass Persona:\n    def __init__(self, nombre):\n        self.nombre = nombre\n\nclass Empleado(Persona):\n    def __init__(self, nombre, puesto):\n        super().__init__(nombre)  # Delega la inicialización del nombre a Persona\n        self.puesto = puesto\n\`\`\`\n\nEl **polimorfismo** permite tratar a distintas clases hijas de la misma manera si comparten los mismos métodos (ej: \`animal.hablar()\`).`,
            examples: [
              {
                title: 'Polimorfismo con figuras geométricas',
                code: 'class Circulo:\n    def __init__(self, radio):\n        self.radio = radio\n    def area(self):\n        return 3.14159 * (self.radio ** 2)\n\nclass Cuadrado:\n    def __init__(self, lado):\n        self.lado = lado\n    def area(self):\n        return self.lado * self.lado\n\nfiguras = [Circulo(5), Cuadrado(4)]\nfor f in figuras:\n    print(f"Área: {f.area():.2f}")',
                output: 'Área: 78.54\nÁrea: 16.00',
                explanation: 'El bucle no necesita saber la clase exacta; solo llama a .area() gracias al polimorfismo (duck typing).'
              }
            ],
            common_errors: 'Crear jerarquías de herencia profundas de 5 o 6 niveles. En ingeniería de software se prefiere la composición sobre la herencia.',
            mini_exercise: {
              starter_code: 'class Vehiculo:\n    def arrancar(self):\n        return "Motor encendido"\n\nclass Moto(Vehiculo):\n    pass\n\nm = Moto()\nprint(m.arrancar())',
              instructions: 'Observa cómo Moto hereda el método arrancar() sin reescribirlo.',
              solution: 'class Vehiculo:\n    def arrancar(self):\n        return "Motor encendido"\n\nclass Moto(Vehiculo):\n    pass\n\nm = Moto()\nprint(m.arrancar())'
            },
            key_takeaways: [
              'class Hija(Padre): establece la relación de herencia.',
              'super().__init__(...) delega al constructor de la clase base.',
              'Polimorfismo permite llamar al mismo método en clases distintas sin importar el tipo.'
            ],
            exercise: {
              id: 'ex_py2_07_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué hace la instrucción `super().__init__(nombre)` dentro del constructor de una clase hija?',
              options: [
                { id: 'a', text: 'Llama al constructor de la clase padre pasándole el argumento nombre' },
                { id: 'b', text: 'Borra la clase padre de la memoria' },
                { id: 'c', text: 'Crea una supervariable global' },
                { id: 'd', text: 'Duplica el objeto en memoria' }
              ],
              correct_option_id: 'a',
              explanation: 'super() retorna un proxy a la clase padre para delegar la inicialización de atributos compartidos.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py2_07_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿A qué principio de Python corresponde la frase: "Si camina como un pato y grazna como un pato, entonces es un pato"?',
        options: [
          { id: 'a', text: 'Duck Typing (tipado de pato / polimorfismo dinámico)' },
          { id: 'b', text: 'Encapsulamiento estricto' },
          { id: 'c', text: 'Herencia múltiple obligatoria' },
          { id: 'd', text: 'Sobrecarga estática de operadores' }
        ],
        correct_option_id: 'a',
        explanation: 'En Python no importa el tipo exacto del objeto si este implementa los métodos requeridos para operar.'
      }
    ]
  },

  // M08
  {
    id: 'py2_mod_08',
    language_id: LANG_ID,
    code: 'PY2_M08',
    slug: 'datetime-y-regex',
    title: 'Fechas, Tiempos y Expresiones Regulares (regex)',
    objective: 'Gestionar marcas de tiempo, diferencias de fecha con timedelta y validar patrones complejos de texto con el módulo re.',
    description: 'Domina el tiempo y los patrones de texto: zonas horarias, cálculo de plazos y extracción de correos o teléfonos con regex.',
    folder: 'python2/08_datetime_regex',
    course_slug: 'python-2',
    position: 8,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 250 },
    sections: [
      {
        id: 'sec_py2_08_01',
        code: 'S01',
        title: 'Módulo datetime y el Módulo re',
        slug: 'datetime-y-re',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py2_08_01',
            code: 'L01',
            title: 'Fechas con datetime y Patrones con re.search()',
            slug: 'datetime-re-base',
            position: 1,
            concept_id: 'py2-datetime-regex',
            objective: 'Operar con fechas (timedelta) y buscar patrones usando expresiones regulares.',
            theory_markdown: `Dos módulos estándar imprescindibles en Python profesional:\n\n1. \`datetime\`:\n   - \`datetime.now()\`: Fecha y hora actual.\n   - \`timedelta(days=7)\`: Representa una duración o lapso temporal para sumar o restar a fechas.\n   - \`dt.strftime("%Y-%m-%d")\`: Formatea fecha a string.\n\n2. \`re\` (Expresiones Regulares):\n   - \`re.search(patron, texto)\`: Busca la primera coincidencia del patrón.\n   - \`re.findall(patron, texto)\`: Devuelve todas las coincidencias encontradas.\n   - Patrones clave: \`\\d+\` (uno o más dígitos), \`[a-zA-Z]+\` (letras).`,
            examples: [
              {
                title: 'Cálculo de vencimiento y extracción de números con regex',
                code: 'from datetime import datetime, timedelta\nimport re\n\n# Sumar 30 días\nhoy = datetime(2026, 1, 1)\nvencimiento = hoy + timedelta(days=30)\nprint("Vence el:", vencimiento.strftime("%d/%m/%Y"))\n\n# Buscar números en texto\nlog = "Error en puerto 8080 con código 404"\nnumeros = re.findall(r"\\d+", log)\nprint("Números detectados:", numeros)',
                output: "Vence el: 31/01/2026\nNúmeros detectados: ['8080', '404']",
                explanation: 'timedelta suma periodos exactos y r"\\d+" extrae todas las secuencias numéricas.'
              }
            ],
            common_errors: 'Olvidar el prefijo r en strings de regex: `r"\\d+"` evita que Python interprete las barras invertidas como escapes de texto.',
            mini_exercise: {
              starter_code: 'import re\ntexto = "Usuario: koda_fox123"\n# Extrae los dígitos con re.findall(r"\\d+", texto)\ndigitos = ...\nprint(digitos)',
              instructions: 'Usa re.findall(r"\\d+", texto).',
              solution: 'import re\ntexto = "Usuario: koda_fox123"\ndigitos = re.findall(r"\\d+", texto)\nprint(digitos)'
            },
            key_takeaways: [
              'timedelta representa duraciones para cálculos de fechas.',
              'strftime convierte fechas a texto; strptime parsea texto a fechas.',
              'Usa siempre raw strings r"..." para patrones de regex.'
            ],
            exercise: {
              id: 'ex_py2_08_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Qué devolverá re.findall(r"\\d+", "Tengo 2 perros y 10 peces")?',
              options: [
                { id: 'a', text: "['2', '10']" },
                { id: 'b', text: "['2']" },
                { id: 'c', text: '[2, 10]' },
                { id: 'd', text: '12' }
              ],
              correct_option_id: 'a',
              explanation: 're.findall extrae todas las coincidencias como una lista de strings: ["2", "10"].'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py2_08_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Qué clase del módulo datetime se utiliza para representar la diferencia entre dos fechas?',
        options: [
          { id: 'a', text: 'timedelta' },
          { id: 'b', text: 'timespan' },
          { id: 'c', text: 'datediff' },
          { id: 'd', text: 'duration' }
        ],
        correct_option_id: 'a',
        explanation: 'timedelta es la clase estándar para representar duraciones y diferencias temporales.'
      }
    ]
  },

  // M09
  {
    id: 'py2_mod_09',
    language_id: LANG_ID,
    code: 'PY2_M09',
    slug: 'pip-entornos-y-git',
    title: 'Gestión de Paquetes (pip), PyProject y Git Esencial',
    objective: 'Gestionar dependencias con pip y requirements.txt / pyproject.toml, e implementar flujo de control de versiones con Git.',
    description: 'Herramientas esenciales del desarrollador profesional: instalación de librerías de terceros (PyPI), reproducibilidad de entornos y commits en Git.',
    folder: 'python2/09_pip_git',
    course_slug: 'python-2',
    position: 9,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 250 },
    sections: [
      {
        id: 'sec_py2_09_01',
        code: 'S01',
        title: 'pip, requirements.txt y Git',
        slug: 'pip-y-git',
        position: 1,
        type: 'theory',
        estimated_minutes: 15,
        xp_on_complete: 40,
        lessons: [
          {
            id: 'les_py2_09_01',
            code: 'L01',
            title: 'Instalación de Paquetes con pip y Control de Versiones con Git',
            slug: 'pip-git-base',
            position: 1,
            concept_id: 'py2-tooling',
            objective: 'Congelar dependencias con pip freeze y versionar con git init, add y commit.',
            theory_markdown: `El ecosistema de Python cuenta con más de 500,000 paquetes en **PyPI** (Python Package Index).\n\n1. \`pip install requests\`: Descarga e instala una librería en tu entorno virtual.\n2. \`pip freeze > requirements.txt\`: Congela las versiones exactas instaladas para que tus compañeros puedan replicar el entorno con \`pip install -r requirements.txt\`.\n3. **Git básico**:\n   - \`git init\`: Inicia el repositorio.\n   - \`git add .\`: Agrega cambios al área de preparación (stage).\n   - \`git commit -m "feat: nueva funcionalidad"\`: Guarda una instantánea permanente.\n   - **.gitignore**: Archivo imprescindible donde especificas \`.venv/\` o \`__pycache__/\` para no subir archivos basura al repositorio.`,
            examples: [
              {
                title: 'Contenido típico de un archivo requirements.txt',
                code: '# requirements.txt\nfastapi==0.115.0\npydantic>=2.9.0\npytest==8.3.0',
                output: 'fastapi==0.115.0\npydantic>=2.9.0\npytest==8.3.0',
                explanation: 'Define versiones explícitas para garantizar que la aplicación funcione idéntica en cualquier servidor.'
              }
            ],
            common_errors: 'Subir la carpeta `.venv/` a Git. Es pesada y depende del sistema operativo donde se creó; en su lugar se sube el archivo requirements.txt.',
            mini_exercise: {
              starter_code: '# Comando para instalar librerías desde requirements.txt\n# Escribe el comando como comentario\n# pip ...',
              instructions: 'Escribe: # pip install -r requirements.txt',
              solution: '# pip install -r requirements.txt'
            },
            key_takeaways: [
              'pip instala librerías desde el índice PyPI.',
              'requirements.txt asegura la reproducibilidad del entorno.',
              'Nunca subas carpetas .venv/ o __pycache__/ a Git (usa .gitignore).'
            ],
            exercise: {
              id: 'ex_py2_09_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Por qué NUNCA se debe subir la carpeta `.venv` a un repositorio Git?',
              options: [
                { id: 'a', text: 'Porque contiene binarios dependientes del SO local y es fácilmente reproducible con requirements.txt' },
                { id: 'b', text: 'Porque Git no soporta archivos de Python' },
                { id: 'c', text: 'Porque borrará el código de los demás desarrolladores' },
                { id: 'd', text: 'Porque solo los archivos HTML se pueden subir a Git' }
              ],
              correct_option_id: 'a',
              explanation: 'Los entornos virtuales son locales y pesados. El equipo solo necesita el archivo de dependencias para reconstruir el entorno en segundos.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py2_09_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Qué comando de pip genera la lista de paquetes instalados con sus versiones exactas?',
        options: [
          { id: 'a', text: 'pip freeze' },
          { id: 'b', text: 'pip export' },
          { id: 'c', text: 'pip list --save' },
          { id: 'd', text: 'pip lock' }
        ],
        correct_option_id: 'a',
        explanation: 'pip freeze produce la salida en formato paquete==version lista para redirigir a requirements.txt.'
      }
    ]
  },

  // M10
  {
    id: 'py2_mod_10',
    language_id: LANG_ID,
    code: 'PY2_M10',
    slug: 'testing-con-pytest',
    title: 'Testing Automatizado con Pytest y Proyecto Intermedio',
    objective: 'Escribir pruebas unitarias automatizadas con pytest, asserts idiomáticos, fixtures y parametrización de pruebas.',
    description: 'El sello de los desarrolladores profesionales: escribe código verificado con pruebas unitarias que garanticen cero regresiones.',
    folder: 'python2/10_testing_pytest',
    course_slug: 'python-2',
    position: 10,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 350 },
    sections: [
      {
        id: 'sec_py2_10_01',
        code: 'S01',
        title: 'Pruebas Unitarias con pytest y asserts',
        slug: 'pytest-asserts',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_py2_10_01',
            code: 'L01',
            title: 'Filosofía de Pytest y la Sentencia assert',
            slug: 'pytest-base',
            position: 1,
            concept_id: 'py2-pytest',
            objective: 'Escribir funciones de prueba que validen la lógica de tu aplicación sin librerías complejas.',
            theory_markdown: `En Python, el framework estándar de la industria para pruebas es **pytest**.\n\nA diferencia de otros lenguajes con métodos extensos como \`assertEquals()\`, en pytest solo usas la palabra nativa de Python \`assert\`:\n\n\`\`\`python\n# test_calculadora.py\ndef test_suma_basica():\n    assert 2 + 2 == 4\n\`\`\`\n\nReglas clave de pytest:\n1. Los archivos deben llamarse \`test_*.py\` o \`*_test.py\`.\n2. Las funciones de prueba deben iniciar con \`def test_...()\`.`,
            examples: [
              {
                title: 'Suite de pruebas con validación de excepciones',
                code: 'import pytest\n\ndef dividir(a, b):\n    if b == 0:\n        raise ValueError("Divisor no puede ser 0")\n    return a / b\n\ndef test_division_correcta():\n    assert dividir(10, 2) == 5.0\n\ndef test_division_por_cero():\n    with pytest.raises(ValueError):\n        dividir(10, 0)',
                output: 'PASSED test_division_correcta\nPASSED test_division_por_cero',
                explanation: 'pytest.raises verifica que la función lance exactamente la excepción esperada ante datos inválidos.'
              }
            ],
            common_errors: 'Nombrar las funciones sin el prefijo `test_`, lo cual provoca que pytest no las descubra automáticamente al ejecutar `pytest` en la terminal.',
            mini_exercise: {
              starter_code: '# Completa la prueba con assert para validar que len("koda") es 4\ndef test_longitud():\n    assert ...',
              instructions: 'Escribe: assert len("koda") == 4',
              solution: 'def test_longitud():\n    assert len("koda") == 4'
            },
            key_takeaways: [
              'pytest descubre automáticamente archivos test_*.py y funciones test_*().',
              'assert valida condiciones booleanas con mensajes de error ricos.',
              'pytest.raises(Error) comprueba el lanzamiento de excepciones esperadas.'
            ],
            exercise: {
              id: 'ex_py2_10_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Cómo debe llamarse una función para que pytest la ejecute como prueba de forma automática?',
              options: [
                { id: 'a', text: 'Debe iniciar con el prefijo test_ (ej: def test_calcular():)' },
                { id: 'b', text: 'Debe llamarse obligatoriamente main()' },
                { id: 'c', text: 'Debe tener el decorador @run_now' },
                { id: 'd', text: 'No importa el nombre mientras termine en _check' }
              ],
              correct_option_id: 'a',
              explanation: 'Por convención de auto-descubrimiento, pytest busca funciones que comiencen con test_.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py2_10_01',
        type: 'predict_output',
        difficulty: 'medium',
        prompt: '¿Qué ocurre al ejecutar `assert 5 == 10` en Python sin capturar?',
        options: [
          { id: 'a', text: 'Lanza una excepción de tipo AssertionError' },
          { id: 'b', text: 'Retorna False silenciosamente' },
          { id: 'c', text: 'Imprime un mensaje en la terminal' },
          { id: 'd', text: 'Convierte el 5 en 10' }
        ],
        correct_option_id: 'a',
        explanation: 'Si la expresión de un assert evalúa a False, Python lanza inmediatamente un AssertionError.'
      }
    ]
  }
];
