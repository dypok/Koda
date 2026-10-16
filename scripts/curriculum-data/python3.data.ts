import type { RawModule } from './types.ts';

const LANG_ID = 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

export const PYTHON3_MODULES: RawModule[] = [
  // M01
  {
    id: 'py3_mod_01',
    language_id: LANG_ID,
    code: 'PY3_M01',
    slug: 'iteradores-y-generadores',
    title: 'Iteradores, Generadores y el Protocolo de Iteración',
    objective: 'Implementar el protocolo __iter__ y __next__, y crear funciones generadoras con yield para procesar flujos masivos con memoria O(1).',
    description: 'Procesa millones de registros sin saturar la RAM: aprende la evaluación perezosa (lazy evaluation) y la potencia de yield.',
    folder: 'python3/01_iteradores_generadores',
    course_slug: 'python-3',
    position: 1,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 280 },
    sections: [
      {
        id: 'sec_py3_01_01',
        code: 'S01',
        title: 'Generadores con yield y Memoria Constante',
        slug: 'generadores-yield',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_py3_01_01',
            code: 'L01',
            title: 'Funciones Generadoras con yield vs Listas en Memoria',
            slug: 'generadores-yield-base',
            position: 1,
            concept_id: 'py3-generators',
            objective: 'Dominar yield para suspender y reanudar funciones sin calcular toda la colección de antemano.',
            theory_markdown: `Si creas una lista de 10 millones de números con \`[x for x in range(10_000_000)]\`, tu servidor consumirá gigabytes de memoria RAM al instante.\n\nUn **generador** utiliza la palabra clave \`yield\` en lugar de \`return\`. Cuando Python encuentra un \`yield\`, produce el valor actual, **pausa la ejecución de la función congelando sus variables locales**, y espera a que el consumidor pida el siguiente valor con \`next()\` o en un bucle \`for\`.\n\nMemoria consumida: **O(1) (constante)**, sin importar si procesas 10 o 10 billones de elementos.`,
            examples: [
              {
                title: 'Generador infinito de números de Fibonacci',
                code: 'def fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ngen = fibonacci()\nprimeros = [next(gen) for _ in range(7)]\nprint("Primeros 7 de Fibonacci:", primeros)',
                output: 'Primeros 7 de Fibonacci: [0, 1, 1, 2, 3, 5, 8]',
                explanation: 'La función nunca termina gracias al bucle infinito, pero solo calcula el siguiente número cuando se invoca next(gen).'
              }
            ],
            common_errors: 'Intentar acceder por índice numérico a un generador (`gen[0]`). Los generadores no admiten indexación directa; solo avance secuencial con next() o iteración for.',
            mini_exercise: {
              starter_code: '# Crea un generador que produzca el doble de los números del 1 al 3\ndef duplicador():\n    for i in range(1, 4):\n        yield ...\n\nprint(list(duplicador()))  # [2, 4, 6]',
              instructions: 'Usa yield i * 2.',
              solution: 'def duplicador():\n    for i in range(1, 4):\n        yield i * 2\n\nprint(list(duplicador()))'
            },
            key_takeaways: [
              'yield pausa la función y conserva su estado de ejecución.',
              'Los generadores producen valores bajo demanda (evaluación perezosa).',
              'Ahorran gigabytes de memoria en flujos de datos grandes.'
            ],
            exercise: {
              id: 'ex_py3_01_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: '¿Qué devuelve una llamada directa a una función que contiene la palabra yield?',
              prompt_code: 'def mi_gen():\n    yield 1\n\ng = mi_gen()\nprint(type(g))',
              options: [
                { id: 'a', text: "<class 'generator'>" },
                { id: 'b', text: "<class 'int'>" },
                { id: 'c', text: "<class 'list'>" },
                { id: 'd', text: '1' }
              ],
              correct_option_id: 'a',
              explanation: 'Llamar a la función no ejecuta su código de inmediato, sino que retorna un objeto generador iterador.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py3_01_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué excepción lanza un generador cuando agota todos sus elementos disponibles al llamar a next()?',
        options: [
          { id: 'a', text: 'StopIteration' },
          { id: 'b', text: 'IndexError' },
          { id: 'c', text: 'GeneratorExit' },
          { id: 'd', text: 'EndOfStream' }
        ],
        correct_option_id: 'a',
        explanation: 'StopIteration es la señal estándar del protocolo de iteración para indicar que no hay más elementos.'
      }
    ]
  },

  // M02
  {
    id: 'py3_mod_02',
    language_id: LANG_ID,
    code: 'PY3_M02',
    slug: 'decoradores',
    title: 'Decoradores, Closures y functools.wraps',
    objective: 'Interceptar y extender el comportamiento de funciones mediante closures, el azúcar sintáctico @ y preservar metadatos con @functools.wraps.',
    description: 'La herramienta definitiva de metaprogramación en Python: implementa sistemas de autenticación, medición de tiempos y registro de auditoría sin tocar el código original.',
    folder: 'python3/02_decoradores',
    course_slug: 'python-3',
    position: 2,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 300 },
    sections: [
      {
        id: 'sec_py3_02_01',
        code: 'S01',
        title: 'Closures y Creación de Decoradores',
        slug: 'closures-decoradores',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_py3_02_01',
            code: 'L01',
            title: 'Anatomía de un Decorador con @functools.wraps',
            slug: 'anatomia-decorador',
            position: 1,
            concept_id: 'py3-decorators',
            objective: 'Construir decoradores profesionales que admitan cualquier firma (*args, **kwargs) y preserven docstrings.',
            theory_markdown: `Un **decorador** es una función que recibe otra función como argumento, le añade superpoderes antes o después de ejecutarla, y devuelve una función modificada (wrapper).\n\nEl símbolo \`@mi_decorador\` es simplemente un atajo sintáctico de: \`funcion_original = mi_decorador(funcion_original)\`.\n\nPara que la función decorada no pierda su nombre original ni sus docstrings, siempre debemos usar \`@functools.wraps(func)\` en el wrapper interior.`,
            examples: [
              {
                title: 'Decorador medidor de tiempo de ejecución (benchmark)',
                code: 'import time\nfrom functools import wraps\n\ndef cronometrar(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        inicio = time.perf_counter()\n        resultado = func(*args, **kwargs)\n        duracion = time.perf_counter() - inicio\n        print(f"[{func.__name__}] tomó {duracion:.5f}s")\n        return resultado\n    return wrapper\n\n@cronometrar\ndef tarea_pesada():\n    return sum(i * i for i in range(100_000))\n\nres = tarea_pesada()\nprint("Nombre preservado:", tarea_pesada.__name__)',
                output: '[tarea_pesada] tomó 0.00512s\nNombre preservado: tarea_pesada',
                explanation: '@wraps preserva tarea_pesada.__name__ intacto en lugar de mostrar "wrapper".'
              }
            ],
            common_errors: 'Olvidar el return en la función wrapper interior. Si olvidas `return func(*args, **kwargs)`, la función decorada retornará `None`.',
            mini_exercise: {
              starter_code: 'def mayusculas(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n\n@mayusculas\ndef saludo():\n    return "hola koda"\n\nprint(saludo())',
              instructions: 'Observa cómo el decorador transforma la salida en "HOLA KODA".',
              solution: 'def mayusculas(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n\n@mayusculas\ndef saludo():\n    return "hola koda"\n\nprint(saludo())'
            },
            key_takeaways: [
              'Un decorador envuelve una función existente sin alterar su código fuente.',
              '*args y **kwargs en el wrapper garantizan compatibilidad universal.',
              '@wraps de functools conserva la identidad y metadatos de la función original.'
            ],
            exercise: {
              id: 'ex_py3_02_01',
              type: 'single_choice',
              difficulty: 'medium',
              prompt: '¿Por qué es indispensable usar @functools.wraps(func) al crear un decorador?',
              options: [
                { id: 'a', text: 'Para preservar el nombre original (__name__) y la documentación (__doc__) de la función decorada' },
                { id: 'b', text: 'Para que el código se ejecute en múltiples hilos' },
                { id: 'c', text: 'Para compilar la función a lenguaje ensamblador' },
                { id: 'd', text: 'Es puramente estético y no tiene ningún efecto' }
              ],
              correct_option_id: 'a',
              explanation: 'Sin @wraps, las herramientas de introspección, testing y depuración verán el nombre genérico "wrapper" en lugar del nombre real de la función.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py3_02_01',
        type: 'predict_output',
        difficulty: 'medium',
        prompt: '¿Qué sintaxis equivale exactamente a @decorador sobre def funcion(): pass?',
        options: [
          { id: 'a', text: 'funcion = decorador(funcion)' },
          { id: 'b', text: 'decorador = funcion(decorador)' },
          { id: 'c', text: 'decorador(funcion())' },
          { id: 'd', text: 'funcion.decorar(decorador)' }
        ],
        correct_option_id: 'a',
        explanation: 'El azúcar sintáctico @decorador reasigna el identificador de la función al resultado de llamar al decorador pasándole la función original.'
      }
    ]
  },

  // M03
  {
    id: 'py3_mod_03',
    language_id: LANG_ID,
    code: 'PY3_M03',
    slug: 'context-managers',
    title: 'Context Managers: Protocolo __enter__, __exit__ y contextlib',
    objective: 'Gestionar ciclos de vida de recursos críticos (conexiones, bloqueos, transacciones) mediante clases y el decorador @contextmanager.',
    description: 'Aprende a crear tus propios bloques with para adquirir y liberar recursos con seguridad garantizada y manejo de excepciones integrado.',
    folder: 'python3/03_context_managers',
    course_slug: 'python-3',
    position: 3,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 300 },
    sections: [
      {
        id: 'sec_py3_03_01',
        code: 'S01',
        title: 'Creación de Context Managers Personalizados',
        slug: 'creacion-context-managers',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py3_03_01',
            code: 'L01',
            title: 'Protocolo __enter__ / __exit__ y el decorador @contextmanager',
            slug: 'protocolo-enter-exit',
            position: 1,
            concept_id: 'py3-context-managers',
            objective: 'Implementar gestores de contexto con clases y mediante generadores con contextlib.',
            theory_markdown: `Cualquier objeto que implemente los métodos especiales \`__enter__\` y \`__exit__\` puede ser usado con la sentencia \`with\`.\n\n- \`__enter__(self)\`: Se ejecuta al entrar al bloque \`with\`. Lo que retorne se asigna a la variable tras el \`as\`.\n- \`__exit__(self, exc_type, exc_val, exc_tb)\`: Se ejecuta al salir del bloque. Si ocurrió un error, recibe los datos de la excepción. Si retorna \`True\`, la excepción es suprimida y el programa continúa.\n\nAlternativamente, el módulo nativo \`contextlib\` permite crear gestores usando un generador:\n\`\`\`python\nfrom contextlib import contextmanager\n\n@contextmanager\ndef conexion_temporal():\n    print("Conectando...")\n    yield "CONEXION_ACTIVA"\n    print("Desconectando...")\n\`\`\``,
            examples: [
              {
                title: 'Temporizador de bloques con contextmanager',
                code: 'from contextlib import contextmanager\nimport time\n\n@contextmanager\ndef temporizar(etiqueta):\n    t0 = time.perf_counter()\n    try:\n        yield\n    finally:\n        t1 = time.perf_counter()\n        print(f"[{etiqueta}] {t1 - t0:.4f}s")\n\nwith temporizar("Procesamiento intensivo"):\n    total = sum(i for i in range(500_000))',
                output: '[Procesamiento intensivo] 0.0152s',
                explanation: 'El bloque try...finally asegura que el código posterior al yield se ejecute siempre al salir del with.'
              }
            ],
            common_errors: 'No envolver el yield con try...finally en @contextmanager: si ocurre una excepción dentro del with, el código de limpieza posterior al yield nunca se ejecutará.',
            mini_exercise: {
              starter_code: 'from contextlib import contextmanager\n@contextmanager\ndef saludo():\n    print("Hola")\n    yield\n    print("Adiós")\n\nwith saludo():\n    print("En el bloque")',
              instructions: 'Ejecuta el bloque y observa el orden: Hola, En el bloque, Adiós.',
              solution: 'from contextlib import contextmanager\n@contextmanager\ndef saludo():\n    print("Hola")\n    yield\n    print("Adiós")\n\nwith saludo():\n    print("En el bloque")'
            },
            key_takeaways: [
              '__enter__ prepara el recurso; __exit__ lo limpia.',
              '__exit__ recibe la información de la excepción si ocurrió alguna.',
              '@contextmanager de contextlib simplifica la sintaxis usando yield.'
            ],
            exercise: {
              id: 'ex_py3_03_01',
              type: 'single_choice',
              difficulty: 'medium',
              prompt: '¿Cómo puede el método __exit__ suprimir una excepción ocurrida dentro del bloque with para que no se propague?',
              options: [
                { id: 'a', text: 'Retornando True explícitamente' },
                { id: 'b', text: 'Lanzando un nuevo error' },
                { id: 'c', text: 'Retornando None' },
                { id: 'd', text: 'Las excepciones en bloques with nunca se pueden suprimir' }
              ],
              correct_option_id: 'a',
              explanation: 'Si __exit__ retorna True, Python interpreta que la excepción fue manejada y no la re-lanza.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py3_03_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Cuáles son los dos métodos especiales que definen el protocolo de gestor de contexto en Python?',
        options: [
          { id: 'a', text: '__enter__ y __exit__' },
          { id: 'b', text: '__start__ y __stop__' },
          { id: 'c', text: '__open__ y __close__' },
          { id: 'd', text: '__begin__ y __commit__' }
        ],
        correct_option_id: 'a',
        explanation: '__enter__ y __exit__ son los métodos canónicos del protocolo context manager.'
      }
    ]
  },

  // M04
  {
    id: 'py3_mod_04',
    language_id: LANG_ID,
    code: 'PY3_M04',
    slug: 'type-hints-y-dataclasses',
    title: 'Type Hints Estáticos y Data Classes',
    objective: 'Anotar tipos profesionales con typing (Union, Optional, Callable) y modelar estructuras inmutables con @dataclass.',
    description: 'Construye código autoevaluado y robusto: aprovecha la verificación estática con Mypy y simplifica clases con @dataclass.',
    folder: 'python3/04_type_hints',
    course_slug: 'python-3',
    position: 4,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 320 },
    sections: [
      {
        id: 'sec_py3_04_01',
        code: 'S01',
        title: 'Anotaciones de Tipo y @dataclass',
        slug: 'typing-dataclasses',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py3_04_01',
            code: 'L01',
            title: 'Modern Type Hints y @dataclass(frozen=True)',
            slug: 'dataclass-base',
            position: 1,
            concept_id: 'py3-dataclasses',
            objective: 'Eliminar el boilerplate de clases creando objetos inmutables con validación de tipos.',
            theory_markdown: `En Python 3 moderno, los **type hints** permiten que tu editor (VS Code) y analizadores estáticos (como \`mypy\` o \`ruff\`) detecten bugs antes de ejecutar el código:\n\n\`\`\`python\ndef buscar_usuario(id: int) -> str | None:\n    ...\n\`\`\`\n\nEl decorador \`@dataclass\` genera automáticamente \`__init__\`, \`__repr__\`, y comparadores de igualdad \`__eq__\` sin que tengas que escribir código repetitivo. Con \`frozen=True\`, la clase se vuelve inmutable y protegida contra modificaciones accidentales.`,
            examples: [
              {
                title: 'Modelo de datos inmutable con dataclass',
                code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Usuario:\n    id: int\n    username: str\n    email: str\n    activo: bool = True\n\nu1 = Usuario(id=1, username="koda_dev", email="dev@koda.com")\nprint(u1)\n# u1.email = "otro@koda.com"  # Lanza FrozenInstanceError si se intenta mutar',
                output: "Usuario(id=1, username='koda_dev', email='dev@koda.com', activo=True)",
                explanation: '@dataclass genera un constructor con tipos y un __repr__ legible automáticamente.'
              }
            ],
            common_errors: 'Crear valores por defecto mutables en dataclasses: `lista: list = []` causa ValueError. Debe usarse `field(default_factory=list)`.',
            mini_exercise: {
              starter_code: 'from dataclasses import dataclass\n# Crea una dataclass Punto con x: float e y: float\n@dataclass\nclass Punto:\n    x: float\n    y: float\n\np = Punto(1.5, 2.5)\nprint(p.x, p.y)',
              instructions: 'Instancia Punto y verifica sus coordenadas.',
              solution: 'from dataclasses import dataclass\n@dataclass\nclass Punto:\n    x: float\n    y: float\n\np = Punto(1.5, 2.5)\nprint(p.x, p.y)'
            },
            key_takeaways: [
              'Type hints documentan y permiten análisis estático con Mypy.',
              '@dataclass elimina la necesidad de escribir __init__ y __repr__ manualmente.',
              'frozen=True convierte a las instancias en inmutables (hashables).'
            ],
            exercise: {
              id: 'ex_py3_04_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué ocurre en tiempo de ejecución si pasas un string a una función anotada con `def f(x: int):` en Python estándar?',
              options: [
                { id: 'a', text: 'Se ejecuta normalmente, porque los type hints no son validados por el intérprete en tiempo de ejecución' },
                { id: 'b', text: 'Lanza TypeError inmediatamente' },
                { id: 'c', text: 'Se convierte automáticamente a int' },
                { id: 'd', text: 'El programa no compila' }
              ],
              correct_option_id: 'a',
              explanation: 'Python estándar no impone los tipos en runtime; los type hints están diseñados para linters, IDEs y herramientas estáticas.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py3_04_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Cómo se debe definir un atributo de lista con valor por defecto vacío en una @dataclass?',
        options: [
          { id: 'a', text: 'tags: list[str] = field(default_factory=list)' },
          { id: 'b', text: 'tags: list[str] = []' },
          { id: 'c', text: 'tags: list[str] = list()' },
          { id: 'd', text: 'tags: list[str] = None' }
        ],
        correct_option_id: 'a',
        explanation: 'Las listas por defecto en dataclasses requieren field(default_factory=list) para evitar compartir la misma instancia entre objetos.'
      }
    ]
  },

  // M05
  {
    id: 'py3_mod_05',
    language_id: LANG_ID,
    code: 'PY3_M05',
    slug: 'programacion-funcional',
    title: 'Programación Funcional: itertools y functools',
    objective: 'Aplicar patrones funcionales puros, memorización de caché con @lru_cache y herramientas de combinación con itertools.',
    description: 'Acelera funciones matemáticas 100x con caché automático y combina secuencias infinitas con las utilidades de itertools.',
    folder: 'python3/05_funcional',
    course_slug: 'python-3',
    position: 5,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 320 },
    sections: [
      {
        id: 'sec_py3_05_01',
        code: 'S01',
        title: 'Caché con @lru_cache e Itertools',
        slug: 'lru-cache-itertools',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py3_05_01',
            code: 'L01',
            title: 'Memorización Automática con @functools.lru_cache',
            slug: 'lru-cache-base',
            position: 1,
            concept_id: 'py3-functional',
            objective: 'Optimizar algoritmos recursivos de tiempo exponencial O(2^n) a tiempo lineal O(n).',
            theory_markdown: `El decorador \`@functools.lru_cache\` (Least Recently Used Cache) almacena en memoria los resultados de llamadas previas con los mismos argumentos.\n\nSi calculas \`fibonacci(35)\` de forma recursiva ingenua, se realizan más de 20 millones de llamadas repetitivas. Agregando una sola línea con \`@lru_cache(maxsize=128)\`, el cálculo pasa de tardar 5 segundos a tardar **0.00001 segundos**.`,
            examples: [
              {
                title: 'Fibonacci ultra-optimizado con lru_cache',
                code: 'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n: int) -> int:\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint("Fib(50):", fib(50))',
                output: 'Fib(50): 12586269025',
                explanation: 'Calcula el número 50 de Fibonacci en microsegundos gracias al almacenamiento en caché.'
              }
            ],
            common_errors: 'Usar lru_cache en funciones con argumentos mutables (como listas o diccionarios). Como la clave del caché se calcula con hash(args), los argumentos deben ser inmutables.',
            mini_exercise: {
              starter_code: 'from functools import lru_cache\n@lru_cache(maxsize=32)\ndef multiplicar(a, b):\n    return a * b\n\nprint(multiplicar(10, 5))',
              instructions: 'Prueba la función memorizada.',
              solution: 'from functools import lru_cache\n@lru_cache(maxsize=32)\ndef multiplicar(a, b):\n    return a * b\n\nprint(multiplicar(10, 5))'
            },
            key_takeaways: [
              '@lru_cache memoriza resultados previos para evitar recalcular.',
              'Los argumentos deben ser inmutables (hashables).',
              'Reduce la complejidad temporal drásticamente.'
            ],
            exercise: {
              id: 'ex_py3_05_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué significa la sigla LRU en el decorador lru_cache?',
              options: [
                { id: 'a', text: 'Least Recently Used (desalojo del elemento usado hace más tiempo)' },
                { id: 'b', text: 'Linear Recursive Unit' },
                { id: 'c', text: 'Loop Return Unifier' },
                { id: 'd', text: 'Local Resource Utility' }
              ],
              correct_option_id: 'a',
              explanation: 'LRU mantiene en caché los elementos más recientes y descarta los menos consultados cuando se alcanza el límite maxsize.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py3_05_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Cuál función de itertools permite encadenar múltiples listas en un solo iterador continuo?',
        options: [
          { id: 'a', text: 'itertools.chain()' },
          { id: 'b', text: 'itertools.concat()' },
          { id: 'c', text: 'itertools.merge()' },
          { id: 'd', text: 'itertools.join()' }
        ],
        correct_option_id: 'a',
        explanation: 'itertools.chain(lista1, lista2) recorre ambas secuencias consecutivamente sin crear una lista intermedia.'
      }
    ]
  },

  // M06
  {
    id: 'py3_mod_06',
    language_id: LANG_ID,
    code: 'PY3_M06',
    slug: 'concurrencia-asyncio',
    title: 'Concurrencia Moderna y Asyncio',
    objective: 'Diseñar aplicaciones concurrentes no bloqueantes con el bucle de eventos (event loop), async, await y asyncio.gather.',
    description: 'La tecnología detrás de los servidores más veloces: atiende miles de peticiones simultáneas sin consumir hilos del sistema operativo.',
    folder: 'python3/06_concurrencia_asyncio',
    course_slug: 'python-3',
    position: 6,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 350 },
    sections: [
      {
        id: 'sec_py3_06_01',
        code: 'S01',
        title: 'Corrutinas y el Event Loop con asyncio',
        slug: 'asyncio-corrutinas',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_py3_06_01',
            code: 'L01',
            title: 'El Event Loop, async def y await',
            slug: 'asyncio-base',
            position: 1,
            concept_id: 'py3-asyncio',
            objective: 'Ejecutar tareas I/O concurrentes delegando el control con await.',
            theory_markdown: `En operaciones I/O-bound (como consultar una base de datos o llamar a una API web), la CPU pasa el 99% del tiempo ociosa esperando la respuesta de la red.\n\n**asyncio** implementa **multitarea cooperativa mono-hilo** mediante un **Event Loop**:\n- \`async def\`: Declara una **corrutina** (función especial pausible).\n- \`await\`: Cede voluntariamente el control del hilo mientras espera que termine una tarea asíncrona, permitiendo que el Event Loop atienda otras peticiones en ese intervalo.\n- \`asyncio.gather(*tareas)\`: Lanza múltiples corrutinas en paralelo y espera sus resultados.`,
            examples: [
              {
                title: 'Ejecución concurrente con asyncio.gather',
                code: 'import asyncio\n\nasync def descargar_datos(id_sensor: int):\n    # Simula espera de red no bloqueante\n    await asyncio.sleep(0.1)\n    return f"Sensor {id_sensor}: OK"\n\nasync def main():\n    resultados = await asyncio.gather(\n        descargar_datos(1),\n        descargar_datos(2),\n        descargar_datos(3)\n    )\n    for r in resultados:\n        print(r)\n\nasyncio.run(main())',
                output: 'Sensor 1: OK\nSensor 2: OK\nSensor 3: OK',
                explanation: 'Los 3 sensores se descargan concurrentemente en ~0.1s en lugar de tardar 0.3s secuenciales.'
              }
            ],
            common_errors: 'Usar funciones bloqueantes como `time.sleep()` dentro de una corrutina. `time.sleep()` congela todo el Event Loop; debes usar siempre `await asyncio.sleep()`.',
            mini_exercise: {
              starter_code: 'import asyncio\nasync def saludar():\n    await asyncio.sleep(0.01)\n    return "Hola async"\n\n# Ejecuta con asyncio.run(saludar())\nprint(asyncio.run(saludar()))',
              instructions: 'Comprueba el retorno asíncrono.',
              solution: 'import asyncio\nasync def saludar():\n    await asyncio.sleep(0.01)\n    return "Hola async"\n\nprint(asyncio.run(saludar()))'
            },
            key_takeaways: [
              'async def crea una corrutina que debe ejecutarse en un Event Loop.',
              'await pausa la corrutina actual y permite atender otras tareas.',
              'asyncio.gather() ejecuta múltiples corrutinas de manera concurrente.'
            ],
            exercise: {
              id: 'ex_py3_06_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué ocurre si llamas a una función `async def calcular():` sin poner await ni usar asyncio.run()?',
              options: [
                { id: 'a', text: 'Retorna un objeto corrutina sin ejecutar su código interior' },
                { id: 'b', text: 'Se ejecuta en un hilo separado del sistema' },
                { id: 'c', text: 'Lanza SyntaxError' },
                { id: 'd', text: 'Borra la función' }
              ],
              correct_option_id: 'a',
              explanation: 'Invocar una función async def simplemente crea la corrutina; para que se ejecute debe ser planificada en el Event Loop.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py3_06_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Por qué asyncio es ideal para operaciones I/O-bound (APIs, red, bases de datos) pero no para cálculos matemáticos pesados en CPU?',
        options: [
          { id: 'a', text: 'Porque corre en un solo hilo; los cálculos en CPU bloquean el Event Loop e impiden que otras corrutinas avancen' },
          { id: 'b', text: 'Porque asyncio solo acepta números enteros' },
          { id: 'c', text: 'Porque no soporta el operador de suma (+)' },
          { id: 'd', text: 'Porque la CPU no tiene soporte para async' }
        ],
        correct_option_id: 'a',
        explanation: 'Para tareas pesadas de CPU se utiliza multiprocessing (procesos en múltiples núcleos) para evitar acaparar el hilo de asyncio.'
      }
    ]
  },

  // M07
  {
    id: 'py3_mod_07',
    language_id: LANG_ID,
    code: 'PY3_M07',
    slug: 'buenas-practicas-pep8',
    title: 'Buenas Prácticas, PEP 8, Linters y Ruff',
    objective: 'Escribir código de estándar mundial: formateo estricto con Ruff/Black, análisis con Mypy y docstrings profesionales.',
    description: 'Transforma tu código en software legible y mantenible: estándares de la industria, linters ultra veloces y documentación Google Style.',
    folder: 'python3/07_buenas_practicas',
    course_slug: 'python-3',
    position: 7,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 280 },
    sections: [
      {
        id: 'sec_py3_07_01',
        code: 'S01',
        title: 'Estándares PEP 8 y Herramientas Modernas',
        slug: 'pep8-y-ruff',
        position: 1,
        type: 'theory',
        estimated_minutes: 15,
        xp_on_complete: 40,
        lessons: [
          {
            id: 'les_py3_07_01',
            code: 'L01',
            title: 'El Zen de Python, PEP 8 y Linters Modernos (Ruff)',
            slug: 'pep8-ruff-base',
            position: 1,
            concept_id: 'py3-clean-code',
            objective: 'Conocer las reglas de estilo universales y automatizar su verificación con linters.',
            theory_markdown: `El código se lee muchas más veces de las que se escribe.\n\nPrincipios clave de **PEP 8**:\n- 4 espacios para sangría (nunca tabs).\n- Longitud máxima de línea: 88 (estándar Black/Ruff) o 79 caracteres.\n- Variables y funciones en \`snake_case\`, clases en \`PascalCase\`, constantes en \`UPPER_SNAKE_CASE\`.\n- Importaciones ordenadas: estándar, terceros, locales.\n\nHoy en día, **Ruff** (escrito en Rust) es la herramienta estándar que reemplaza a Flake8, Black e isort, ejecutándose 100 veces más rápido.`,
            examples: [
              {
                title: 'Docstring profesional estilo Google',
                code: 'def autenticar(token: str, max_intentos: int = 3) -> bool:\n    """Verifica la validez de un token de acceso criptográfico.\n\n    Args:\n        token: Token JWT recibido en la cabecera HTTP.\n        max_intentos: Límite de reintentos permitidos.\n\n    Returns:\n        True si el token es válido y está vigente, False en caso contrario.\n    """\n    return len(token) > 20 and max_intentos > 0\n\nprint("Docstring:\\n", autenticar.__doc__)',
                output: 'Docstring:\n Verifica la validez de un token de acceso criptográfico.\n\n    Args:\n        token: Token JWT recibido en la cabecera HTTP.\n        max_intentos: Límite de reintentos permitidos.\n\n    Returns:\n        True si el token es válido y está vigente, False en caso contrario.\n    ',
                explanation: 'Los docstrings describen argumentos, tipos y retornos con claridad absoluta.'
              }
            ],
            common_errors: 'Ignorar advertencias de linters y cometer inconsistencias de formato dentro del mismo repositorio de trabajo.',
            mini_exercise: {
              starter_code: '# Corrige el nombre de la constante según PEP 8\nmax_conexiones = 100\n# En PEP 8 debe ser MAX_CONEXIONES = 100',
              instructions: 'Declara la constante en mayúsculas sostenidas.',
              solution: 'MAX_CONEXIONES = 100'
            },
            key_takeaways: [
              'PEP 8 es la guía oficial de estilo de Python.',
              'Docstrings documentan el comportamiento con triple comilla """...""".',
              'Ruff automatiza el formateo y linter a velocidad de Rust.'
            ],
            exercise: {
              id: 'ex_py3_07_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Cómo debe nombrarse una constante global en Python según PEP 8?',
              options: [
                { id: 'a', text: 'En mayúsculas separadas por guiones bajos (ej: DB_TIMEOUT = 30)' },
                { id: 'b', text: 'Con CamelCase (ej: DbTimeout = 30)' },
                { id: 'c', text: 'Con prefijo const_ (ej: const_db_timeout = 30)' },
                { id: 'd', text: 'En minúsculas sin separación' }
              ],
              correct_option_id: 'a',
              explanation: 'Las constantes se escriben en mayúsculas con guiones bajos (UPPER_CASE).'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py3_07_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Qué linter ultrarrápido escrito en Rust se ha convertido en el estándar moderno del ecosistema Python?',
        options: [
          { id: 'a', text: 'Ruff' },
          { id: 'b', text: 'ESLint' },
          { id: 'c', text: 'RuboCop' },
          { id: 'd', text: 'Checkstyle' }
        ],
        correct_option_id: 'a',
        explanation: 'Ruff es el linter y formateador de alto rendimiento que ha reemplazado a Flake8, Black y otras herramientas tradicionales.'
      }
    ]
  },

  // M08
  {
    id: 'py3_mod_08',
    language_id: LANG_ID,
    code: 'PY3_M08',
    slug: 'logging-y-empaquetado',
    title: 'Logging Profesional y Empaquetado PyProject',
    objective: 'Reemplazar print() por el módulo logging con niveles (DEBUG, INFO, ERROR), handlers estructurados y empaquetar librerías con pyproject.toml.',
    description: 'Deja de usar print para depurar en producción: implementa auditoría profesional de logs y empaqueta tus herramientas para compartirlas.',
    folder: 'python3/08_logging_empaquetado',
    course_slug: 'python-3',
    position: 8,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 300 },
    sections: [
      {
        id: 'sec_py3_08_01',
        code: 'S01',
        title: 'Módulo logging y Configuración de Handlers',
        slug: 'logging-handlers',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py3_08_01',
            code: 'L01',
            title: 'Jerarquía de Logs: DEBUG, INFO, WARNING, ERROR, CRITICAL',
            slug: 'logging-niveles',
            position: 1,
            concept_id: 'py3-logging',
            objective: 'Configurar un logger con formato, niveles de severidad y destinos múltiples (consola y archivo).',
            theory_markdown: `En servidores de producción, los \`print()\` se pierden y no registran fecha ni nivel de gravedad. El módulo estándar \`logging\` resuelve esto:\n\n1. \`DEBUG\`: Información detallada para diagnóstico en desarrollo.\n2. \`INFO\`: Confirmación de eventos esperados en el flujo normal.\n3. \`WARNING\`: Alerta de algo imprevisto pero que permite continuar.\n4. \`ERROR\`: Falla en una función o petición concreta.\n5. \`CRITICAL\`: Error fatal que detiene el servicio.`,
            examples: [
              {
                title: 'Logger con formato profesional',
                code: 'import logging\n\nlogger = logging.getLogger("koda_app")\nlogging.basicConfig(\n    level=logging.INFO,\n    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",\n    datefmt="%H:%M:%S"\n)\n\nlogger.info("Servidor iniciado en puerto 8000")\nlogger.warning("Uso de memoria al 82%")\nlogger.error("No se pudo conectar a la base de datos")',
                output: '12:00:00 [INFO] koda_app: Servidor iniciado en puerto 8000\n12:00:00 [WARNING] koda_app: Uso de memoria al 82%\n12:00:00 [ERROR] koda_app: No se pudo conectar a la base de datos',
                explanation: 'El log incluye timestamp, nivel y nombre del módulo emisor automáticamente.'
              }
            ],
            common_errors: 'Llamar a `logging.basicConfig()` múltiples veces; solo la primera invocación tiene efecto.',
            mini_exercise: {
              starter_code: 'import logging\n# Registra un mensaje de advertencia con logging.warning\nlogging.warning("...")',
              instructions: 'Usa logging.warning("Espacio en disco bajo").',
              solution: 'import logging\nlogging.warning("Espacio en disco bajo")'
            },
            key_takeaways: [
              'logging sustituye a print() en aplicaciones reales.',
              'Permite filtrar qué mensajes mostrar cambiando el nivel mínimo.',
              'Los logs pueden enviarse a archivos, consola o servicios en la nube.'
            ],
            exercise: {
              id: 'ex_py3_08_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: 'Si un logger tiene configurado el nivel INFO, ¿cuál de los siguientes mensajes NO se mostrará?',
              options: [
                { id: 'a', text: 'logger.debug("Detalle interno")' },
                { id: 'b', text: 'logger.info("Operación exitosa")' },
                { id: 'c', text: 'logger.warning("Memoria alta")' },
                { id: 'd', text: 'logger.error("Fallo de conexión")' }
              ],
              correct_option_id: 'a',
              explanation: 'DEBUG tiene un nivel de severidad inferior a INFO, por lo que es filtrado y omitido.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py3_08_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Cuál es el archivo de configuración estándar en Python moderno para definir metadatos y empaquetar librerías?',
        options: [
          { id: 'a', text: 'pyproject.toml' },
          { id: 'b', text: 'package.json' },
          { id: 'c', text: 'settings.ini' },
          { id: 'd', text: 'pip.conf' }
        ],
        correct_option_id: 'a',
        explanation: 'pyproject.toml (PEP 518/621) es el estándar contemporáneo universal para empaquetado de proyectos en Python.'
      }
    ]
  },

  // M09
  {
    id: 'py3_mod_09',
    language_id: LANG_ID,
    code: 'PY3_M09',
    slug: 'rendimiento-y-profiling',
    title: 'Rendimiento, Profiling y Optimización de Memoria',
    objective: 'Identificar cuellos de botella con cProfile y timeit, y optimizar estructuras reduciendo el consumo con __slots__.',
    description: 'Aprende a medir científicamente la velocidad de tu código: no adivines dónde está la lentitud; encuéntrala y optimízala con herramientas estadísticas.',
    folder: 'python3/09_profiling',
    course_slug: 'python-3',
    position: 9,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 320 },
    sections: [
      {
        id: 'sec_py3_09_01',
        code: 'S01',
        title: 'Medición con timeit y Optimización con __slots__',
        slug: 'timeit-slots',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_py3_09_01',
            code: 'L01',
            title: 'Medición Precisa con timeit y Reducción de Memoria con __slots__',
            slug: 'timeit-slots-base',
            position: 1,
            concept_id: 'py3-profiling',
            objective: 'Comparar alternativas de rendimiento y ahorrar 60% de memoria en clases con __slots__.',
            theory_markdown: `Por defecto, cada objeto en Python almacena sus atributos en un diccionario dinámico oculto (\`__dict__\`), lo que consume bastante memoria.\n\nSi vas a crear **millones de instancias**, puedes declarar \`__slots__\` en la clase para asignar memoria estática y compacta, ahorrando hasta un 60% de RAM y acelerando el acceso a atributos.\n\nPara comparar la velocidad de dos algoritmos de forma fiable, usamos \`timeit\`, que ejecuta la prueba miles de veces para aislar el ruido del sistema operativo.`,
            examples: [
              {
                title: 'Clase ultra compacta con __slots__',
                code: 'class CoordenadaSlots:\n    __slots__ = ("x", "y")  # Sin __dict__ interno\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = CoordenadaSlots(10.5, 20.5)\nprint(f"Punto: ({p.x}, {p.y})")',
                output: 'Punto: (10.5, 20.5)',
                explanation: '__slots__ prohíbe atributos dinámicos arbitrarios pero reduce drásticamente el espacio de memoria.'
              }
            ],
            common_errors: 'Optimización prematura: "La optimización prematura es la raíz de todos los males" (Donald Knuth). Primero escribe código claro y con tests; luego haz profiling antes de optimizar.',
            mini_exercise: {
              starter_code: '# Declara __slots__ en una clase Nodo con valor y siguiente\nclass Nodo:\n    __slots__ = ("valor", "siguiente")\n    def __init__(self, valor):\n        self.valor = valor\n        self.siguiente = None\n\nn = Nodo(10)\nprint(n.valor)',
              instructions: 'Verifica la instanciación con __slots__.',
              solution: 'class Nodo:\n    __slots__ = ("valor", "siguiente")\n    def __init__(self, valor):\n        self.valor = valor\n        self.siguiente = None\n\nn = Nodo(10)\nprint(n.valor)'
            },
            key_takeaways: [
              'cProfile analiza el tiempo dedicado en cada función.',
              'timeit mide snippets de código con rigor estadístico.',
              '__slots__ optimiza clases creadas millones de veces.'
            ],
            exercise: {
              id: 'ex_py3_09_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Cuál es el beneficio de usar `__slots__` en una clase de Python?',
              options: [
                { id: 'a', text: 'Reduce significativamente el consumo de memoria RAM al eliminar el __dict__ interno por instancia' },
                { id: 'b', text: 'Permite conectar a bases de datos SQL' },
                { id: 'c', text: 'Convierte el código a lenguaje Rust' },
                { id: 'd', text: 'Hace que la clase tenga atributos infinitos' }
              ],
              correct_option_id: 'a',
              explanation: '__slots__ reemplaza el diccionario dinámico __dict__ por una estructura interna fija mucho más ligera.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py3_09_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué módulo nativo de Python se utiliza para realizar profiling determinista detallado de todas las funciones de un programa?',
        options: [
          { id: 'a', text: 'cProfile' },
          { id: 'b', text: 'benchmark' },
          { id: 'c', text: 'valgrind' },
          { id: 'd', text: 'speedup' }
        ],
        correct_option_id: 'a',
        explanation: 'cProfile es el analizador de rendimiento integrado en C estándar de Python.'
      }
    ]
  },

  // M10
  {
    id: 'py3_mod_10',
    language_id: LANG_ID,
    code: 'PY3_M10',
    slug: 'patrones-de-diseno',
    title: 'Patrones de Diseño en Python: Factory, Singleton y Strategy',
    objective: 'Implementar patrones de diseño clásicos aprovechando las características dinámicas y funciones de primer orden de Python.',
    description: 'Arquitectura de software madura: desacopla dependencias con Factory, maneja configuraciones con Singleton y aplica Strategy mediante funciones puras.',
    folder: 'python3/10_patrones_diseno',
    course_slug: 'python-3',
    position: 10,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 400 },
    sections: [
      {
        id: 'sec_py3_09_01',
        code: 'S01',
        title: 'Patrones Idiomáticos en Python',
        slug: 'patrones-idiomaticos',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_py3_10_01',
            code: 'L01',
            title: 'Factory y Strategy de Forma Pythónica',
            slug: 'factory-strategy',
            position: 1,
            concept_id: 'py3-design-patterns',
            objective: 'Implementar patrones de diseño sin la sobreingeniería típica de lenguajes como Java o C++.',
            theory_markdown: `En lenguajes estrictos, implementar el patrón **Strategy** requiere crear interfaces formales y clases envoltorias. En Python, al ser las **funciones ciudadanos de primer orden**, el patrón Strategy se resuelve simplemente pasando una función como argumento.\n\nEl patrón **Factory** desacopla al consumidor de la clase concreta que se instancia, permitiendo crear objetos basados en parámetros o configuraciones.`,
            examples: [
              {
                title: 'Patrón Factory desacoplado',
                code: 'class NotificadorEmail:\n    def enviar(self, msg): return f"Email: {msg}"\n\nclass NotificadorSMS:\n    def enviar(self, msg): return f"SMS: {msg}"\n\ndef obtener_notificador(canal: str):\n    canales = {"email": NotificadorEmail, "sms": NotificadorSMS}\n    clase = canales.get(canal.lower())\n    if not clase:\n        raise ValueError(f"Canal desconocido: {canal}")\n    return clase()\n\nservicio = obtener_notificador("email")\nprint(servicio.enviar("¡Bienvenido al nivel avanzado!"))',
                output: 'Email: ¡Bienvenido al nivel avanzado!',
                explanation: 'La función Factory usa un diccionario de clases para instanciar dinámicamente sin un if/elif gigante.'
              }
            ],
            common_errors: 'Forzar patrones de diseño innecesarios para problemas simples (sobreingeniería). Los patrones resuelven problemas reales de acoplamiento y mantenimiento.',
            mini_exercise: {
              starter_code: '# Agrega soporte para el canal "slack" en el Factory\n# class NotificadorSlack: def enviar(self, m): return f"Slack: {m}"',
              instructions: 'Observa cómo extender el factory solo requiere registrar la nueva clase.',
              solution: 'class NotificadorSlack:\n    def enviar(self, m): return f"Slack: {m}"'
            },
            key_takeaways: [
              'En Python, las funciones como objetos de primer orden simplifican Strategy.',
              'Factory centraliza la creación de objetos desacoplando clientes.',
              'Un módulo de Python es naturalmente un Singleton.'
            ],
            exercise: {
              id: 'ex_py3_10_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Por qué en Python el patrón de diseño Singleton a menudo se resuelve simplemente creando un módulo (.py)?',
              options: [
                { id: 'a', text: 'Porque Python cachea los módulos en sys.modules y nunca los re-ejecuta al volver a importarlos' },
                { id: 'b', text: 'Porque los módulos no pueden contener clases' },
                { id: 'c', text: 'Porque los módulos se ejecutan en memoria GPU' },
                { id: 'd', text: 'Porque el Singleton está prohibido en Python' }
              ],
              correct_option_id: 'a',
              explanation: 'Un módulo importado se carga una sola vez en memoria y se comparte en toda la aplicación, funcionando como un Singleton natural.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_py3_10_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Cuál es el objetivo principal del patrón de diseño Factory?',
        options: [
          { id: 'a', text: 'Encapsular e independizar la lógica de instanciación de objetos de las clases que los consumen' },
          { id: 'b', text: 'Garantizar que solo exista una sola instancia de una clase' },
          { id: 'c', text: 'Convertir código asíncrono en síncrono' },
          { id: 'd', text: 'Validar consultas SQL' }
        ],
        correct_option_id: 'a',
        explanation: 'Factory provee una interfaz para crear objetos permitiendo que las subclases o la configuración determinen qué clase instanciar.'
      }
    ]
  }
];
