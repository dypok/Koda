# -*- coding: utf-8 -*-
"""
Script to generate Data Analytics modules 01 to 05 with 4 lessons and 6 calibrated questions each.
Enforces zero emojis, zero spoilers, and strict schema compliance.
"""

import json
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", "languages", "python", "modules", "data_analytics"))

MODULES = [
    {
        "dir": "01_numpy",
        "module_json": {
            "id": "da_mod_01",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DA_M01",
            "slug": "numpy-fundamentos",
            "course_slug": "data-analytics",
            "title": "NumPy: Computacion Vectorizada y Arrays N-Dimensionales",
            "objective": "Reemplazar bucles lentos por operaciones vectorizadas en C mediante ndarrays de NumPy y broadcasting.",
            "description": "El pilar matematico de la ciencia de datos y el machine learning en Python: arrays contiguos en memoria y algebra lineal.",
            "position": 41,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_da_01_01",
                    "code": "S01",
                    "title": "Estructuras, Vectorizacion y Agregaciones en NumPy",
                    "slug": "estructuras-vectorizacion-numpy",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 45,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_da_01_01",
                            "code": "L01",
                            "title": "El Objeto ndarray y Memoria Contigua",
                            "slug": "ndarray-memoria-contigua",
                            "position": 1,
                            "concept_id": "da-numpy-ndarray",
                            "objective": "Comprender la arquitectura en memoria del ndarray de NumPy frente a las listas nativas de Python.",
                            "theory_markdown": "Las listas ordinarias de Python almacenan punteros a objetos dispersos en memoria heap, lo cual introduce una gran sobrecarga de indireccion y previene la optimizacion en caches de CPU.\n\n**NumPy** introduce el **`ndarray`** (N-dimensional array):\n- Almacena elementos del **mismo tipo de dato homogeneo** (`dtype`) en un bloque **contiguo de memoria**.\n- Permite operaciones a nivel de hardware (SIMD, Single Instruction Multiple Data) ejecutadas en C o Fortran.\n\n### Atributos clave de un ndarray\n- `arr.ndim`: Numero de dimensiones (ejes).\n- `arr.shape`: Tupla con el tamano de cada dimension (ej. `(3, 4)` para 3 filas y 4 columnas).\n- `arr.dtype`: Tipo de dato atomico (ej. `np.int64`, `np.float32`, `np.bool_`).\n- `arr.size`: Cantidad total de elementos.\n\n### Creacion comun de arrays\n`np.array([1, 2, 3])`, `np.zeros((2, 3))`, `np.ones((3, 3))`, `np.arange(0, 10, 2)`, `np.linspace(0, 1, 5)`.",
                            "examples": [
                                {
                                    "title": "Inspeccion de atributos de un array bidimensional",
                                    "code": "import numpy as np\n\nmatriz = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.int32)\nprint(\"ndim:\", matriz.ndim)\nprint(\"shape:\", matriz.shape)\nprint(\"dtype:\", matriz.dtype)\nprint(\"size:\", matriz.size)",
                                    "output": "ndim: 2\nshape: (2, 3)\ndtype: int32\nsize: 6",
                                    "explanation": "El array posee 2 dimensiones, 2 filas y 3 columnas, tipo entero de 32 bits y 6 elementos en total."
                                }
                            ],
                            "common_errors": "Crear un array con elementos heterogeneos (ej. numeros y texto), lo que obliga a NumPy a degradar el dtype a tipo objeto o cadena generica, perdiendo el beneficio de aceleracion.",
                            "mini_exercise": {
                                "instructions": "Crea un array de 5 ceros con tipo de dato float64 usando np.zeros.",
                                "starter_code": "import numpy as np\n\n# Crea el array ceros\nceros = ...",
                                "solution": "import numpy as np\n\nceros = np.zeros(5, dtype=np.float64)"
                            },
                            "key_takeaways": [
                                "ndarray almacena datos homogeneos en memoria contigua para maxima velocidad.",
                                "shape describe las dimensiones y dtype especifica el tipo atomico exacto.",
                                "np.arange y np.linspace generan secuencias numericas vectorizadas eficientemente."
                            ],
                            "exercise": {
                                "id": "ex_da_01_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Por que un ndarray de NumPy es ordenes de magnitud mas rapido que una lista de Python para calculos numericos?",
                                "options": [
                                    {"id": "a", "text": "Porque almacena datos de tipo homogeneo en bloques contiguos de memoria, eliminando indireccion de punteros y aprovechando vectorizacion SIMD a nivel de CPU."},
                                    {"id": "b", "text": "Porque compila el codigo a JavaScript en el navegador."},
                                    {"id": "c", "text": "Porque no permite tener mas de 10 elementos en memoria."},
                                    {"id": "d", "text": "Porque ejecuta los calculos en la nube de forma remota."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "La memoria contigua y los tipos homogeneos permiten a la CPU ejecutar instrucciones vectorizadas optimizadas directamente sobre la memoria cache sin sobrecarga."
                            }
                        },
                        {
                            "id": "les_da_01_02",
                            "code": "L02",
                            "title": "Indexacion, Slicing y Vistas vs Copias",
                            "slug": "indexacion-slicing-vistas-copias",
                            "position": 2,
                            "concept_id": "da-numpy-slicing-views",
                            "objective": "Dominar el slicing multidimensional y comprender la diferencia critica entre una vista y una copia en memoria.",
                            "theory_markdown": "En arrays multidimensionales, la indexacion se realiza separando los ejes por comas: `arr[fila, columna]`.\n\n### Regla de Oro: Slicing genera Vistas (Views)\nA diferencia de las listas de Python (donde `lista[:]` crea una copia superficial nueva), en NumPy **un slice basico genera una vista referencial** sobre el mismo bloque de memoria original.\n\nSi modificas un slice de un array de NumPy, **el array original tambien se modifica**:\n```python\nsub_array = arr[0:2, 0:2]\nsub_array[0, 0] = 999  # MODIFICA DIRECTAMENTE A arr!\n```\n\nPara aislar los datos e impedir modificaciones accidentales en el array de origen, se debe invocar explicitamente el metodo **`.copy()`**:\n```python\nsub_array_seguro = arr[0:2, 0:2].copy()\n```",
                            "examples": [
                                {
                                    "title": "Demostracion de mutacion por vista",
                                    "code": "import numpy as np\n\noriginal = np.array([10, 20, 30, 40])\nvista = original[1:3]\nvista[0] = 99\nprint(\"Original modificado:\", original)\n\ncopia = original[1:3].copy()\ncopia[0] = 555\nprint(\"Original intacto tras copia:\", original)",
                                    "output": "Original modificado: [10 99 30 40]\nOriginal intacto tras copia: [10 99 30 40]",
                                    "explanation": "La modificacion en la vista altero el array original; la modificacion en la copia quedo completamente aislada."
                                }
                            ],
                            "common_errors": "Modificar una subseccion obtenida por slicing creyendo que es independiente, corrompiendo involuntariamente los datos del array principal.",
                            "mini_exercise": {
                                "instructions": "Obten una copia explicita e independiente de las dos primeras filas del array 'matriz'.",
                                "starter_code": "import numpy as np\nmatriz = np.array([[1, 2], [3, 4], [5, 6]])\n\n# Obten copia de las dos primeras filas\nfilas_copia = ...",
                                "solution": "filas_copia = matriz[:2].copy()"
                            },
                            "key_takeaways": [
                                "El slicing en NumPy produce una vista (view) sobre la misma memoria del array original.",
                                "Modificar una vista altera los datos del array original.",
                                "Usa .copy() siempre que requieras independencia total de datos."
                            ],
                            "exercise": {
                                "id": "ex_da_01_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que sucede con el array original 'arr' si se ejecuta 'sub = arr[:3]' y luego 'sub[0] = 0' en NumPy?",
                                "options": [
                                    {"id": "a", "text": "El primer elemento de 'arr' se modifica a 0, porque el slicing genera una vista (view) que comparte el mismo bloque de memoria."},
                                    {"id": "b", "text": "'arr' permanece inalterado porque el slicing crea una copia independiente automaticamente."},
                                    {"id": "c", "text": "NumPy lanza un error de acceso de solo lectura."},
                                    {"id": "d", "text": "'arr' se reduce a solo 3 elementos."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El slicing basico en NumPy crea vistas referenciales sobre los mismos datos subyacentes para optimizar memoria, por lo que mutar la vista modifica el original."
                            }
                        },
                        {
                            "id": "les_da_01_03",
                            "code": "L03",
                            "title": "Operaciones Vectorizadas y Broadcasting",
                            "slug": "vectorizacion-broadcasting",
                            "position": 3,
                            "concept_id": "da-numpy-broadcasting",
                            "objective": "Aplicar operaciones aritmeticas vectorizadas y entender las reglas de compatibilidad de broadcasting.",
                            "theory_markdown": "La **vectorizacion** permite aplicar operaciones matematicas elemento a elemento de forma instantanea sin escribir bucles `for` explicitos en Python:\n```python\na = np.array([1, 2, 3])\nb = np.array([10, 20, 30])\nc = a * b  # [10, 40, 90]\n```\n\n### El concepto de Broadcasting\nEl **Broadcasting** describe como NumPy gestiona operaciones entre arrays de diferentes formas (`shapes`).\n\nDos dimensiones son compatibles para broadcasting si, comparadas de derecha a izquierda:\n1. Son exactamente iguales, O\n2. Una de ellas tiene tamano **1**.\n\nSi una dimension es 1, NumPy 'estira' virtualmente ese eje (sin duplicar datos en memoria) para que coincida con la dimension mayor.",
                            "examples": [
                                {
                                    "title": "Suma de matriz y vector por broadcasting",
                                    "code": "import numpy as np\n\nmatriz = np.ones((3, 3))       # shape: (3, 3)\nvector = np.array([10, 20, 30]) # shape: (3,)\nresultado = matriz + vector\nprint(resultado)",
                                    "output": "[[11. 21. 31.]\n [11. 21. 31.]\n [11. 21. 31.]]",
                                    "explanation": "El vector (3,) es alineado como (1, 3) y transmitido a lo largo de las 3 filas de la matriz."
                                }
                            ],
                            "common_errors": "Intentar operar arrays cuyas dimensiones no coinciden ni tienen tamano 1 (ej. sumar un array de shape (3, 4) con uno de (3, 3)), lo que arroja un ValueError por incompatibilidad de broadcasting.",
                            "mini_exercise": {
                                "instructions": "Multiplica vectorizadamente el array 'precios' por 1.16 para calcular el precio con impuesto sin usar bucles for.",
                                "starter_code": "import numpy as np\nprecios = np.array([100.0, 200.0, 300.0])\n\n# Calcula precios_con_iva\nprecios_con_iva = ...",
                                "solution": "precios_con_iva = precios * 1.16"
                            },
                            "key_takeaways": [
                                "La vectorizacion ejecuta calculos matematicos elemento a elemento en lenguaje C compilado.",
                                "Broadcasting permite operar arrays de formas distintas si sus dimensiones coinciden o son 1.",
                                "Broadcasting no replica datos en memoria fisica, optimizando el consumo de RAM."
                            ],
                            "exercise": {
                                "id": "ex_da_01_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual de los siguientes pares de shapes es compatible para broadcasting en NumPy?",
                                "options": [
                                    {"id": "a", "text": "Array A con shape (4, 3) y Array B con shape (3,)"},
                                    {"id": "b", "text": "Array A con shape (4, 3) y Array B con shape (4,)"},
                                    {"id": "c", "text": "Array A con shape (5, 2) y Array B con shape (5, 3)"},
                                    {"id": "d", "text": "Array A con shape (2, 7) y Array B con shape (3, 7)"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Comparando desde la derecha: la ultima dimension de ambos es 3 (coinciden). La siguiente dimension de B es implicitamente 1, compatible con el 4 de A."
                            }
                        },
                        {
                            "id": "les_da_01_04",
                            "code": "L04",
                            "title": "Mascaras Booleanas y Funciones de Agregacion",
                            "slug": "mascaras-booleanas-agregacion",
                            "position": 4,
                            "concept_id": "da-numpy-masks-aggregation",
                            "objective": "Filtrar datos usando indexacion booleana y realizar agregaciones estadisticas a lo largo de ejes especificos.",
                            "theory_markdown": "NumPy permite filtrar datos de forma declarativa mediante **mascaras booleanas**:\n```python\narr = np.array([12, 5, 25, 8, 30])\nmascara = arr > 10  # [True, False, True, False, True]\nfiltrados = arr[mascara]  # [12, 25, 30]\n```\n\n### Funciones de Agregacion y el parametro axis\nNumPy incluye funciones matematicas optimizadas (`np.sum`, `np.mean`, `np.std`, `np.min`, `np.max`):\n- Sin especificar `axis`: Agrega todos los elementos del array devolviendo un unico escalar.\n- `axis=0`: Opera verticalmente a lo largo de las filas (reduce las filas, dando un valor por cada **columna**).\n- `axis=1`: Opera horizontalmente a lo largo de las columnas (reduce las columnas, dando un valor por cada **fila**).",
                            "examples": [
                                {
                                    "title": "Calculo de medias por columna y por fila",
                                    "code": "import numpy as np\n\ndatos = np.array([\n    [10, 20, 30],\n    [40, 50, 60]\n])\nprint(\"Media global:\", np.mean(datos))\nprint(\"Media por columna (axis=0):\", np.mean(datos, axis=0))\nprint(\"Media por fila (axis=1):\", np.mean(datos, axis=1))",
                                    "output": "Media global: 35.0\nMedia por columna (axis=0): [25. 35. 45.]\nMedia por fila (axis=1): [20. 50.]",
                                    "explanation": "axis=0 colapsa verticalmente (2 filas en 1); axis=1 colapsa horizontalmente (3 columnas en 1)."
                                }
                            ],
                            "common_errors": "Confundir axis=0 con axis=1 al calcular sumas o promedios en matrices bidimensionales.",
                            "mini_exercise": {
                                "instructions": "Usa una mascara booleana para filtrar solo los numeros positivos (mayores que 0) del array 'valores'.",
                                "starter_code": "import numpy as np\nvalores = np.array([-5, 10, -2, 8, 0, 15])\n\n# Filtra los positivos\npositivos = ...",
                                "solution": "positivos = valores[valores > 0]"
                            },
                            "key_takeaways": [
                                "Las mascaras booleanas permiten filtrar arrays sin usar condicionales if en bucles.",
                                "axis=0 aplica la reduccion colapsando filas (resultado por columna).",
                                "axis=1 aplica la reduccion colapsando columnas (resultado por fila)."
                            ],
                            "exercise": {
                                "id": "ex_da_01_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Dada una matriz de calificaciones de 100 estudiantes (filas) y 5 asignaturas (columnas), que instruccion calcula el promedio de cada estudiante?",
                                "options": [
                                    {"id": "a", "text": "np.mean(calificaciones, axis=1)"},
                                    {"id": "b", "text": "np.mean(calificaciones, axis=0)"},
                                    {"id": "c", "text": "np.mean(calificaciones)"},
                                    {"id": "d", "text": "calificaciones.sum(axis=None)"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Cada estudiante es una fila. Para promediar sus 5 asignaturas (columnas) debemos colapsar a lo largo del eje horizontal (axis=1), obteniendo 100 promedios."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DA_M01",
            "module_slug": "numpy-fundamentos",
            "course_slug": "data-analytics",
            "questions": [
                {
                    "id": "q_da_01_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual es la caracteristica principal de los elementos contenidos en un ndarray de NumPy?",
                    "options": [
                        {"id": "a", "text": "Deben ser del mismo tipo de dato homogeneo (dtype) y se almacenan contiguos en memoria."},
                        {"id": "b", "text": "Pueden ser de tipos arbitrarios mezclados sin penalizacion de rendimiento."},
                        {"id": "c", "text": "Solo pueden ser cadenas de texto de longitud fija."},
                        {"id": "d", "text": "Se guardan en una base de datos relacional externa."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "La homogeneidad de tipos es lo que permite a NumPy optimizar el almacenamiento en bloques contiguos de memoria y acelerar computos con C."
                },
                {
                    "id": "q_da_01_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que devuelve el atributo shape de un ndarray bidimensional?",
                    "options": [
                        {"id": "a", "text": "Una tupla con la cantidad de filas y columnas del array."},
                        {"id": "b", "text": "Un entero con el peso en kilobytes del objeto."},
                        {"id": "c", "text": "Una cadena con el nombre del tipo de dato."},
                        {"id": "d", "text": "El valor del determinante de la matriz."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "arr.shape retorna una tupla donde cada elemento representa la dimension de un eje (ej. (filas, columnas))."
                },
                {
                    "id": "q_da_01_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como se evita que la modificacion de un slice de un array afecte al array original en NumPy?",
                    "options": [
                        {"id": "a", "text": "Creando una copia explicita mediante el metodo .copy(): sub = arr[:5].copy()"},
                        {"id": "b", "text": "Usando la funcion freeze()"},
                        {"id": "c", "text": "Declarando el slice como constante con const"},
                        {"id": "d", "text": "NumPy nunca modifica el array original, no se requiere ninguna accion"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El slicing genera una vista (view); invocar .copy() reserva un nuevo bloque de memoria desvinculado del original."
                },
                {
                    "id": "q_da_01_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Segun las reglas de broadcasting de NumPy, que condicion permite operar dos dimensiones comparadas de derecha a izquierda?",
                    "options": [
                        {"id": "a", "text": "Que las dimensiones sean iguales o que una de ellas sea 1."},
                        {"id": "b", "text": "Que ambas sean numeros pares."},
                        {"id": "c", "text": "Que la suma de ambas sea divisible por 2."},
                        {"id": "d", "text": "Que ambos arrays contengan menos de 1000 elementos."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "La regla formal de broadcasting estipula que dos dimensiones son compatibles si son identicas o si una de ellas es exactamente 1."
                },
                {
                    "id": "q_da_01_05",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "Dado arr = np.array([10, 25, 3, 40, 15]), que produce la expresion arr[arr > 20]?",
                    "options": [
                        {"id": "a", "text": "array([25, 40])"},
                        {"id": "b", "text": "array([True, False, True])"},
                        {"id": "c", "text": "array([10, 3, 15])"},
                        {"id": "d", "text": "array([20, 20])"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "arr > 20 crea una mascara booleana [False, True, False, True, False]; al indexar con ella se extraen solo los valores correspondientes a True (25 y 40)."
                },
                {
                    "id": "q_da_01_06",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Si se ejecuta matriz.sum(axis=0) sobre un array de shape (4, 6), cual sera la forma (shape) del array resultante?",
                    "options": [
                        {"id": "a", "text": "(6,)"},
                        {"id": "b", "text": "(4,)"},
                        {"id": "c", "text": "(1,)"},
                        {"id": "d", "text": "(4, 6)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "axis=0 colapsa las 4 filas sumando a lo largo del eje vertical, produciendo un vector con 6 elementos (uno por columna)."
                }
            ]
        }
    },
    {
        "dir": "02_pandas_series_df",
        "module_json": {
            "id": "da_mod_02",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DA_M02",
            "slug": "pandas-series-dataframes",
            "course_slug": "data-analytics",
            "title": "Pandas: Estructuras Series, DataFrames e Ingestion",
            "objective": "Dominar las estructuras fundamentales Series y DataFrame, metodos de ingestion y seleccion con .loc e .iloc.",
            "description": "La biblioteca esencial de analisis de datos en Python: indexacion, ingestion multiformato y filtrado booleano de alta velocidad.",
            "position": 42,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_da_02_01",
                    "code": "S01",
                    "title": "Estructuras, Ingestion y Seleccion con Pandas",
                    "slug": "estructuras-ingestion-seleccion-pandas",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 45,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_da_02_01",
                            "code": "L01",
                            "title": "Series y DataFrames: Indice y Tipos de Datos",
                            "slug": "series-dataframes-indice",
                            "position": 1,
                            "concept_id": "da-pandas-structures",
                            "objective": "Comprender la anatomia de una Serie unidimensional y un DataFrame bidimensional, y el rol del Indice.",
                            "theory_markdown": "**Pandas** esta construido sobre NumPy pero anade etiquetas explicitas en filas y columnas mediante el concepto de **Indice** (`Index`).\n\n### Las dos estructuras core\n1. **`pd.Series`:** Array unidimensional homogeneo etiquetado.\n   Posee datos (`values`) y un indice (`index`). Cada columna de un DataFrame es una Serie.\n2. **`pd.DataFrame`:** Tabla bidimensional estructurada en filas y columnas, donde cada columna puede tener un tipo de dato (`dtype`) diferente (enteros, flotantes, strings, fechas, booleanos).\n\n### Atributos estructurales\n- `df.shape`: Tupla `(filas, columnas)`.\n- `df.columns`: Lista o Index de nombres de columnas.\n- `df.index`: Rango o etiquetas de las filas.\n- `df.dtypes`: Tipos de datos por columna.",
                            "examples": [
                                {
                                    "title": "Creacion manual de una Serie y un DataFrame",
                                    "code": "import pandas as pd\n\nedades = pd.Series([23, 30, 28], index=[\"Ana\", \"Luis\", \"Sara\"], name=\"edad\")\nprint(edades[\"Luis\"])\n\ndf = pd.DataFrame({\n    \"nombre\": [\"Ana\", \"Luis\", \"Sara\"],\n    \"edad\": [23, 30, 28],\n    \"activo\": [True, False, True]\n})\nprint(df.dtypes)",
                                    "output": "30\nnombre     object\nedad        int64\nactivo       bool\ndtype: object",
                                    "explanation": "El DataFrame asigna tipos de datos especificos a cada columna de forma automatica."
                                }
                            ],
                            "common_errors": "Creer que df['columna'] devuelve una lista ordinaria de Python, cuando en realidad devuelve una instancia de pd.Series con su propio indice y metodos vectorizados.",
                            "mini_exercise": {
                                "instructions": "Crea una Serie llamada 'precios' con valores [10.5, 20.0, 15.0] e indice ['a', 'b', 'c'].",
                                "starter_code": "import pandas as pd\n\n# Crea la Serie precios\nprecios = ...",
                                "solution": "import pandas as pd\n\nprecios = pd.Series([10.5, 20.0, 15.0], index=[\"a\", \"b\", \"c\"])"
                            },
                            "key_takeaways": [
                                "Una Serie es un vector 1D con indice etiquetado; un DataFrame es una tabla 2D.",
                                "Cada columna de un DataFrame es una Serie de Pandas.",
                                "df.dtypes indica el tipo de dato asignado a cada columna."
                            ],
                            "exercise": {
                                "id": "ex_da_02_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la diferencia estructural entre un ndarray 2D de NumPy y un DataFrame de Pandas?",
                                "options": [
                                    {"id": "a", "text": "El DataFrame soporta columnas heterogeneas con distintos dtypes e indices etiquetados para filas y columnas, mientras que el ndarray exige tipo uniforme."},
                                    {"id": "b", "text": "NumPy soporta tablas pero Pandas solo vectores de 1 dimension."},
                                    {"id": "c", "text": "Pandas solo puede almacenar hasta 500 filas en memoria."},
                                    {"id": "d", "text": "No existe diferencia, son clases identicas."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Pandas extiende la velocidad de NumPy permitiendo tabular datos tabulares reales con columnas de diferentes tipos (fechas, texto, numeros) e indices alineados."
                            }
                        },
                        {
                            "id": "les_da_02_02",
                            "code": "L02",
                            "title": "Ingestion de Datos y Diagnostico Inicial",
                            "slug": "ingestion-datos-diagnostico",
                            "position": 2,
                            "concept_id": "da-pandas-ingestion-diagnostics",
                            "objective": "Cargar datos desde CSV, Parquet o Excel aplicando parametros de optimizacion e inspeccionar estructura y estadisticas.",
                            "theory_markdown": "Pandas dispone de lectores de alta velocidad para multiples formatos:\n- `pd.read_csv('archivo.csv', sep=',', usecols=['id', 'valor'], parse_dates=['fecha'])`\n- `pd.read_parquet('archivo.parquet')` (formato columnar binario ultrarrapido recomendado para big data).\n- `pd.read_excel('archivo.xlsx', sheet_name='Ventas')`.\n\n### Metodos de Diagnostico Inmediato\nTras cargar un conjunto de datos, se deben ejecutar tres inspecciones fundamentales:\n1. `df.head(n)` / `df.tail(n)`: Muestra las primeras o ultimas n filas.\n2. `df.info()`: Informa el numero de filas, columnas, nombres, conteo de valores no nulos y uso exacto de memoria RAM.\n3. `df.describe()`: Genera un resumen estadistico instantaneo de las columnas numericas (conteo, media, desviacion estandar, minimo, percentiles 25%, 50%, 75% y maximo).",
                            "examples": [
                                {
                                    "title": "Carga de CSV y resumen estadistico",
                                    "code": "import pandas as pd\n\n# Simulando DataFrame cargado\ndf = pd.DataFrame({\"ventas\": [100, 250, 400, 150], \"clientes\": [10, 25, 30, 15]})\nprint(df.describe())",
                                    "output": "           ventas   clientes\ncount    4.000000   4.000000\nmean   225.000000  20.000000\nstd    132.287566   8.888194\nmin    100.000000  10.000000\n50%    200.000000  20.000000\nmax    400.000000  30.000000",
                                    "explanation": "describe() entrega de inmediato las metricas descriptivas parametricas y de posicion del conjunto."
                                }
                            ],
                            "common_errors": "Cargar archivos CSV con columnas de fechas sin indicar parse_dates, lo que deja las fechas como cadenas ordinarias ('object') impidiendo filtrados temporales posteriores.",
                            "mini_exercise": {
                                "instructions": "Invoca el metodo de df que imprime el tipo de datos de cada columna y el conteo de valores no nulos.",
                                "starter_code": "import pandas as pd\ndf = pd.DataFrame({\"a\": [1, 2], \"b\": [3, 4]})\n\n# Muestra el diagnostico de tipos y no-nulos\n",
                                "solution": "df.info()"
                            },
                            "key_takeaways": [
                                "pd.read_csv y pd.read_parquet ingieren datos optimizando columnas con usecols y parse_dates.",
                                "df.info() audita la integridad, nulos y huella de memoria RAM.",
                                "df.describe() calcula estadisticas parametricas y percentiles automaticamente."
                            ],
                            "exercise": {
                                "id": "ex_da_02_02",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual metodo de un DataFrame de Pandas se debe invocar para obtener un resumen que incluya media, desviacion estandar y percentiles de las columnas numericas?",
                                "options": [
                                    {"id": "a", "text": "df.describe()"},
                                    {"id": "b", "text": "df.info()"},
                                    {"id": "c", "text": "df.summary()"},
                                    {"id": "d", "text": "df.stats()"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "describe() es la funcion analitica estandar para generar la tabla de estadistica descriptiva de variables numericas en Pandas."
                            }
                        },
                        {
                            "id": "les_da_02_03",
                            "code": "L03",
                            "title": "Indexacion Estricta: .loc vs .iloc",
                            "slug": "indexacion-loc-iloc",
                            "position": 3,
                            "concept_id": "da-pandas-loc-iloc",
                            "objective": "Distinguir y utilizar correctamente la seleccion por etiquetas (.loc) y por posicion entera (.iloc).",
                            "theory_markdown": "Una de las fuentes mas comunes de errores en Pandas es la indexacion ambigua. Para eliminar la ambiguedad existen dos accesores obligatorios:\n\n### 1. `.loc[]` (Basado en Etiquetas / Labels)\nSelecciona filas y columnas por sus **nombres o etiquetas de indice**:\n- Sintaxis: `df.loc[etiqueta_filas, etiqueta_columnas]`\n- En slicing con `.loc`, **ambos extremos son inclusivos** (`df.loc['a':'c']` incluye 'c').\n\n### 2. `.iloc[]` (Basado en Posicion Entera / Integer Location)\nSelecciona filas y columnas por sus **posiciones numericas enteras** (0-indexed):\n- Sintaxis: `df.iloc[posicion_filas, posicion_columnas]`\n- En slicing con `.iloc`, se sigue la regla estandar de Python: **el extremo superior es excluyente** (`df.iloc[0:3]` selecciona posiciones 0, 1 y 2).",
                            "examples": [
                                {
                                    "title": "Comparacion practica de seleccion con .loc e .iloc",
                                    "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"producto\": [\"Mouse\", \"Teclado\", \"Monitor\"],\n    \"precio\": [25, 45, 180]\n}, index=[\"p1\", \"p2\", \"p3\"])\n\n# Seleccion con .loc (por etiqueta):\nprint(df.loc[\"p2\", \"precio\"])  # 45\n\n# Seleccion con .iloc (por posicion entera):\nprint(df.iloc[1, 1])           # 45",
                                    "output": "45\n45",
                                    "explanation": ".loc usa las etiquetas 'p2' y 'precio'; .iloc usa los indices enteros 1 (segunda fila) y 1 (segunda columna)."
                                }
                            ],
                            "common_errors": "Intentar usar numeros en .loc cuando el indice contiene etiquetas de texto, o pasar nombres de columnas a .iloc, arrojando TypeError o KeyError.",
                            "mini_exercise": {
                                "instructions": "Usa .iloc para seleccionar las primeras 3 filas y las primeras 2 columnas del DataFrame 'df'.",
                                "starter_code": "import pandas as pd\ndf = pd.DataFrame({\"a\": [1,2,3,4], \"b\": [5,6,7,8], \"c\": [9,10,11,12]})\n\n# Selecciona con .iloc\nsub_df = ...",
                                "solution": "sub_df = df.iloc[:3, :2]"
                            },
                            "key_takeaways": [
                                ".loc indexa por etiquetas de texto y es inclusivo en ambos limites de rango.",
                                ".iloc indexa estrictamente por enteros (0 a N-1) y excluye el limite superior.",
                                "Ambos accesores admiten el formato [filas, columnas]."
                            ],
                            "exercise": {
                                "id": "ex_da_02_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es la diferencia principal entre df.loc[0:3] y df.iloc[0:3] cuando el indice del DataFrame es numerico [0, 1, 2, 3, 4]?",
                                "options": [
                                    {"id": "a", "text": "df.loc[0:3] incluye las etiquetas hasta el 3 (4 filas: 0, 1, 2, 3); df.iloc[0:3] sigue la regla de Python y excluye el limite superior (3 filas: 0, 1, 2)."},
                                    {"id": "b", "text": "df.iloc[0:3] selecciona columnas y df.loc[0:3] selecciona filas."},
                                    {"id": "c", "text": "df.loc arroja un error si el indice es numerico."},
                                    {"id": "d", "text": "No existe ninguna diferencia."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Por definicion, el slicing con .loc incluye el extremo final porque se basa en etiquetas, mientras que .iloc emula los rangos normales de Python excluyendo el extremo derecho."
                            }
                        },
                        {
                            "id": "les_da_02_04",
                            "code": "L04",
                            "title": "Filtrado Booleano y Consultas con .query()",
                            "slug": "filtrado-booleano-query",
                            "position": 4,
                            "concept_id": "da-pandas-boolean-query",
                            "objective": "Filtrar DataFrames utilizando condiciones booleanas compuestas con operadores bit a bit y el metodo .query().",
                            "theory_markdown": "Para filtrar filas que satisfagan criterios de negocio en Pandas se utilizan dos enfoques:\n\n### 1. Mascaras Booleanas Compuestas\nEn Pandas no se pueden usar las palabras reservadas `and`, `or`, `not` de Python para operar Series. Se deben usar obligatoriamente los operadores bit a bit y **encerrar cada condicion entre parentesis**:\n- `&` para Y logico (AND).\n- `|` para O logico (OR).\n- `~` para negacion (NOT).\n- `.isin([val1, val2])` para evaluar membresia en una lista.\n\nEjemplo: `df[(df['edad'] >= 18) & (df['pais'] == 'Colombia')]`\n\n### 2. El Metodo `.query()`\nPermite escribir filtros mediante una cadena de texto limpia y altamente legible:\n```python\nlimite = 50\nresultado = df.query('precio > @limite and categoria == \"Electronica\"')\n```\nEl simbolo `@` permite referenciar variables externas del entorno local de Python.",
                            "examples": [
                                {
                                    "title": "Filtrado con operadores y con .query",
                                    "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"cliente\": [\"A\", \"B\", \"C\", \"D\"],\n    \"gasto\": [120, 45, 300, 80],\n    \"vip\": [True, False, True, False]\n})\n\n# Metodo 1: Mascara con parentesis y &\nfiltro1 = df[(df[\"gasto\"] > 100) & (df[\"vip\"] == True)]\n\n# Metodo 2: .query()\nfiltro2 = df.query(\"gasto > 100 and vip == True\")\nprint(filtro1[\"cliente\"].tolist() == filtro2[\"cliente\"].tolist())",
                                    "output": "True",
                                    "explanation": "Ambos metodos producen exactamente el mismo subconjunto de datos filtrados."
                                }
                            ],
                            "common_errors": "Omitir los parentesis en expresiones como `df[df['edad'] > 18 & df['activo'] == True]`, lo que causa un ValueError por la precedencia de operadores en Python.",
                            "mini_exercise": {
                                "instructions": "Usa df.query para filtrar filas donde 'precio' sea mayor a 100 y 'en_stock' sea True.",
                                "starter_code": "import pandas as pd\ndf = pd.DataFrame({\"precio\": [150, 80, 200], \"en_stock\": [True, True, False]})\n\n# Filtra con .query\nfiltrado = ...",
                                "solution": "filtrado = df.query(\"precio > 100 and en_stock == True\")"
                            },
                            "key_takeaways": [
                                "El filtrado con mascaras booleanas exige operadores &, |, ~ y parentesis obligatorios.",
                                ".isin() evalua pertenencia a una coleccion de forma vectorizada.",
                                ".query() proporciona una sintaxis compacta y permite referenciar variables locales con @."
                            ],
                            "exercise": {
                                "id": "ex_da_02_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Por que es mandatorio encerrar cada condicion entre parentesis al filtrar un DataFrame con multiples condiciones, ej: df[(df['A'] > 0) & (df['B'] < 10)]?",
                                "options": [
                                    {"id": "a", "text": "Porque en Python el operador bit a bit '&' tiene mayor precedencia matematica que los operadores de comparacion '>' y '<'."},
                                    {"id": "b", "text": "Porque Pandas arroja error si el codigo no tiene parentesis redondos."},
                                    {"id": "c", "text": "Para convertir los datos a tuplas de Python."},
                                    {"id": "d", "text": "Para obligar a Pandas a usar la tarjeta grafica GPU."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "En Python '&' se evalua antes que '>' o '<'. Sin parentesis, '0 & df['B']' se evaluaria primero, corrompiendo la logica y arrojando una excepcion."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DA_M02",
            "module_slug": "pandas-series-dataframes",
            "course_slug": "data-analytics",
            "questions": [
                {
                    "id": "q_da_02_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que estructura de Pandas representa una columna individual dentro de un DataFrame?",
                    "options": [
                        {"id": "a", "text": "pd.Series"},
                        {"id": "b", "text": "pd.Index"},
                        {"id": "c", "text": "pd.Matrix"},
                        {"id": "d", "text": "pd.ColumnArray"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Un DataFrame es fundamentalmente una coleccion ordenada de objetos pd.Series alineados bajo un mismo indice."
                },
                {
                    "id": "q_da_02_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que argumento de pd.read_csv() permite indicar explicitamente que columnas deben interpretarse y convertirse a tipos de fecha (datetime)?",
                    "options": [
                        {"id": "a", "text": "parse_dates"},
                        {"id": "b", "text": "convert_dates"},
                        {"id": "c", "text": "datetime_cols"},
                        {"id": "d", "text": "as_date"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "parse_dates=['nombre_columna'] le instruye al lector de CSV que parsee las cadenas a objetos Timestamp de Pandas."
                },
                {
                    "id": "q_da_02_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual es la funcion principal del metodo df.info()?",
                    "options": [
                        {"id": "a", "text": "Mostrar el conteo de valores no nulos, los tipos de datos (dtypes) de cada columna y el consumo de memoria del DataFrame."},
                        {"id": "b", "text": "Calcular la matriz de correlacion entre variables numericas."},
                        {"id": "c", "text": "Graficar histogramas de las columnas."},
                        {"id": "d", "text": "Exportar los datos a formato Parquet."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "df.info() proporciona el resumen tecnico estructural y diagnostico del dataset."
                },
                {
                    "id": "q_da_02_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Cual afirmacion sobre la diferencia entre .loc e .iloc es totalmente CORRECTA?",
                    "options": [
                        {"id": "a", "text": ".loc indexa mediante etiquetas de indice y nombres de columna (inclusivo en extremos); .iloc indexa exclusivamente mediante posiciones enteras 0-indexed (excluyendo el extremo derecho)."},
                        {"id": "b", "text": ".loc es exclusivamente para columnas y .iloc exclusivamente para filas."},
                        {"id": "c", "text": ".iloc soporta filtros booleanos con strings pero .loc no."},
                        {"id": "d", "text": "Ambos metodos son exactamente iguales y deprecados."}
                    ],
                    "correct_option_id": "a",
                    "explanation": ".loc (location by label) usa etiquetas y es inclusivo; .iloc (integer location) usa enteros posicionales y es excluyente en el extremo superior."
                },
                {
                    "id": "q_da_02_05",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "Como se escribe una consulta de filtrado para seleccionar filas donde 'categoria' sea 'Ropa' o 'Calzado' de forma eficiente?",
                    "options": [
                        {"id": "a", "text": "df[df['categoria'].isin(['Ropa', 'Calzado'])]"},
                        {"id": "b", "text": "df[df['categoria'] in ['Ropa', 'Calzado']]"},
                        {"id": "c", "text": "df.filter(categoria=['Ropa', 'Calzado'])"},
                        {"id": "d", "text": "df.where('Ropa', 'Calzado')"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El metodo vectorizado .isin() comprueba membresia en una coleccion para cada elemento de la Serie."
                },
                {
                    "id": "q_da_02_06",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "En el metodo df.query('precio > @limite'), que funcion cumple el prefijo '@' antes de la palabra limite?",
                    "options": [
                        {"id": "a", "text": "Le indica a Pandas que busque una variable llamada 'limite' en el espacio de nombres local de Python."},
                        {"id": "b", "text": "Es un operador que convierte el valor en porcentaje."},
                        {"id": "c", "text": "Indica que la variable es un puntero a memoria en C."},
                        {"id": "d", "text": "Filtra exclusivamente direcciones de correo electronico."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Dentro de la expresion de string de df.query(), el caracter @ sirve para inyectar variables de Python definidas fuera de la consulta."
                }
            ]
        }
    },
    {
        "dir": "03_pandas_limpieza",
        "module_json": {
            "id": "da_mod_03",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DA_M03",
            "slug": "pandas-limpieza-transformacion",
            "course_slug": "data-analytics",
            "title": "Limpieza de Datos (Data Wrangling) y Transformacion",
            "objective": "Tratar valores nulos, corregir dtypes, eliminar duplicados y transformar texto mediante metodos vectorizados.",
            "description": "El 80% del trabajo en analitica: tecnicas profesionales para limpiar datos sucios, imputar missing values y sanear registros.",
            "position": 43,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_da_03_01",
                    "code": "S01",
                    "title": "Tratamiento de Nulos, Tipos y Manipulacion de Cadenas",
                    "slug": "tratamiento-nulos-tipos-cadenas",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_da_03_01",
                            "code": "L01",
                            "title": "Deteccion y Tratamiento de Valores Nulos",
                            "slug": "deteccion-tratamiento-nulos",
                            "position": 1,
                            "concept_id": "da-pandas-missing-values",
                            "objective": "Detectar valores faltantes (NaN) y aplicar estrategias de eliminacion e imputacion estadistica.",
                            "theory_markdown": "En Pandas, los datos ausentes se representan con `np.nan` (Not a Number) para valores flotantes o `pd.NA` para tipos ampliados.\n\n### Diagnostico de Nulos\n```python\ndf.isna().sum()          # Conteo de nulos por columna\ndf.isna().mean() * 100   # Porcentaje de nulos por columna\n```\n\n### Estrategias de Tratamiento\n1. **Eliminacion con `dropna()`:**\n   - `df.dropna(how='any')`: Elimina cualquier fila que tenga al menos un nulo.\n   - `df.dropna(subset=['columna_clave'])`: Elimina filas solo si la columna indicada es nula.\n2. **Imputacion con `fillna()`:**\n   - Imputacion por constante: `df['categoria'].fillna('Sin Especificar')`.\n   - Imputacion estadistica (media o mediana): `df['edad'].fillna(df['edad'].median())`.",
                            "examples": [
                                {
                                    "title": "Deteccion e imputacion con la mediana",
                                    "code": "import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\"ingreso\": [1000, np.nan, 3000, 4000, np.nan]})\nmediana = df[\"ingreso\"].median() # 3000.0\ndf[\"ingreso_limpio\"] = df[\"ingreso\"].fillna(mediana)\nprint(df[\"ingreso_limpio\"].tolist())",
                                    "output": "[1000.0, 3000.0, 3000.0, 4000.0, 3000.0]",
                                    "explanation": "Los dos valores faltantes fueron imputados con la mediana de los valores validos observados."
                                }
                            ],
                            "common_errors": "Ejecutar df.dropna() global sin especificar subset, eliminando involuntariamente el 80% de las filas de un dataset grande por nulos en columnas irrelevantes.",
                            "mini_exercise": {
                                "instructions": "Usa fillna para reemplazar todos los valores nulos en df['ciudad'] por 'Desconocido'.",
                                "starter_code": "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({\"ciudad\": [\"Cali\", np.nan, \"Medellin\"]})\n\n# Imputa con 'Desconocido'\ndf[\"ciudad\"] = ...",
                                "solution": "df[\"ciudad\"] = df[\"ciudad\"].fillna(\"Desconocido\")"
                            },
                            "key_takeaways": [
                                "df.isna().sum() detecta la cantidad de valores nulos por columna.",
                                "dropna(subset=[...]) descarta filas solo cuando faltan campos criticos.",
                                "fillna() permite imputar constantes o metricas estadisticas como media o mediana."
                            ],
                            "exercise": {
                                "id": "ex_da_03_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la ventaja de imputar valores numericos ausentes con la mediana en lugar de la media aritmetica?",
                                "options": [
                                    {"id": "a", "text": "La mediana es robusta frente a valores atipicos (outliers) y distribuciones sesgadas, mientras que la media se ve fuertemente distorsionada por extremos."},
                                    {"id": "b", "text": "La mediana siempre es igual a cero."},
                                    {"id": "c", "text": "Pandas no permite calcular la media de un DataFrame."},
                                    {"id": "d", "text": "La mediana convierte los datos en enteros automaticamente."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "La mediana representa el percentil 50 y no se desvia por valores extremadamente altos o bajos, haciendola ideal para imputar variables como ingresos o precios."
                            }
                        },
                        {
                            "id": "les_da_03_02",
                            "code": "L02",
                            "title": "Conversion y Coercion Segura de Tipos",
                            "slug": "conversion-coercion-tipos",
                            "position": 2,
                            "concept_id": "da-pandas-type-casting",
                            "objective": "Convertir columnas a tipos adecuados usando astype(), pd.to_numeric() con coercion y pd.to_datetime().",
                            "theory_markdown": "Es comun que columnas numericas o de fechas queden cargadas como texto (`object`) debido a caracteres corruptos (ej. `'100'`, `'N/A'`, `'?'`).\n\n### Metodos de Conversion\n1. **`astype()`:** Conversion directa cuando todos los datos son validos (`df['edad'] = df['edad'].astype(int)`). Si encuentra un texto invalido arroja `ValueError`.\n2. **`pd.to_numeric()` con `errors='coerce'`:**\n   Si encuentra un valor que no puede convertirse a numero (ej. `'desconocido'`), **lo transforma de forma segura en `np.nan`** en lugar de romper el programa.\n   ```python\n   df['precio'] = pd.to_numeric(df['precio'], errors='coerce')\n   ```\n3. **`pd.to_datetime()` con `errors='coerce'`:**\n   Parsea fechas en multiples formatos convirtiendo valores corruptos en `pd.NaT` (Not a Time).",
                            "examples": [
                                {
                                    "title": "Coercion de columna sucia con texto no numerico",
                                    "code": "import pandas as pd\n\ncolumna_sucia = pd.Series([\"10.5\", \"20.0\", \"invalido\", \"40.2\"])\ncolumna_limpia = pd.to_numeric(columna_sucia, errors=\"coerce\")\nprint(columna_limpia)",
                                    "output": "0    10.5\n1    20.0\n2     NaN\n3    40.2\ndtype: float64",
                                    "explanation": "El valor 'invalido' fue transformado en NaN permitiendo que la columna sea ahora de tipo float64."
                                }
                            ],
                            "common_errors": "Usar astype(float) sobre una columna que contiene cadenas no numericas, provocando un ValueError que aborta el script de procesamiento.",
                            "mini_exercise": {
                                "instructions": "Convierte la serie 'datos' a tipo numerico forzando errores a NaN con pd.to_numeric(..., errors='coerce').",
                                "starter_code": "import pandas as pd\ndatos = pd.Series([\"1\", \"2\", \"error\", \"4\"])\n\n# Convierte con coercion\nlimpio = ...",
                                "solution": "limpio = pd.to_numeric(datos, errors=\"coerce\")"
                            },
                            "key_takeaways": [
                                "astype() realiza conversiones directas pero falla si hay valores invalidos.",
                                "pd.to_numeric(errors='coerce') reemplaza textos invalidos por NaN de forma segura.",
                                "pd.to_datetime() unifica formatos temporales y genera NaT en datos corruptos."
                            ],
                            "exercise": {
                                "id": "ex_da_03_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que efecto tiene el parametro errors='coerce' en la funcion pd.to_numeric(df['columna'], errors='coerce')?",
                                "options": [
                                    {"id": "a", "text": "Convierte cualquier valor no convertible a numero en un valor nulo NaN sin arrojar excepciones."},
                                    {"id": "b", "text": "Asigna el valor cero a los errores de forma silenciosa."},
                                    {"id": "c", "text": "Elimina la columna completa del DataFrame."},
                                    {"id": "d", "text": "Lanza una alerta por consola pero detiene la ejecucion."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "errors='coerce' es el mecanismo defensivo estandar de Pandas para transformar datos corruptos en NaN e impedir caidas del programa."
                            }
                        },
                        {
                            "id": "les_da_03_03",
                            "code": "L03",
                            "title": "Duplicados y Saneamiento Vectorizado de Texto",
                            "slug": "duplicados-saneamiento-texto",
                            "position": 3,
                            "concept_id": "da-pandas-duplicates-strings",
                            "objective": "Identificar y descartar duplicados y sanear texto sucio mediante el accesor vectorizado .str.",
                            "theory_markdown": "### Gestion de Duplicados\n- `df.duplicated(subset=['id'])`: Retorna una mascara booleana marcando `True` en filas duplicadas.\n- `df.drop_duplicates(subset=['id'], keep='first')`: Conserva la primera aparicion y descarta las repetidas (`keep='last'` conserva la ultima).\n\n### El accesor `.str` para Cadenas de Texto\nPandas incluye el accesor vectorizado `.str` para operar sobre Series de texto sin usar bucles `for`:\n- `df['nombre'].str.strip()`: Elimina espacios en blanco iniciales y finales.\n- `df['nombre'].str.lower()` / `.str.upper()`: Normaliza a minusculas o mayusculas.\n- `df['codigo'].str.replace('-', '_', regex=False)`: Reemplazo de caracteres.\n- `df['email'].str.contains('@')`: Mascara booleana para busquedas de texto.",
                            "examples": [
                                {
                                    "title": "Limpieza de texto y descarte de duplicados",
                                    "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"email\": [\"  ANA@koda.com \", \"ana@koda.com\", \"luis@koda.com\"],\n    \"rol\": [\"admin\", \"admin\", \"user\"]\n})\n# 1. Normalizar texto:\ndf[\"email\"] = df[\"email\"].str.strip().str.lower()\n# 2. Descartar duplicados:\ndf_sin_duplicados = df.drop_duplicates(subset=[\"email\"])\nprint(df_sin_duplicados)",
                                    "output": "            email    rol\n0    ana@koda.com  admin\n2   luis@koda.com   user",
                                    "explanation": "Tras normalizar espacios y mayusculas, el duplicado de Ana fue detectado y eliminado con exito."
                                }
                            ],
                            "common_errors": "Intentar usar metodos de string directos como df['nombre'].strip() sin el accesor .str (debe ser df['nombre'].str.strip()), provocando un AttributeError.",
                            "mini_exercise": {
                                "instructions": "Usa el accesor .str para convertir a mayusculas la columna 'categoria' de un DataFrame.",
                                "starter_code": "import pandas as pd\ndf = pd.DataFrame({\"categoria\": [\"ropa\", \"hogar\"]})\n\n# Convierte a mayusculas\ndf[\"categoria\"] = ...",
                                "solution": "df[\"categoria\"] = df[\"categoria\"].str.upper()"
                            },
                            "key_takeaways": [
                                "drop_duplicates elimina registros redundantes controlando con keep='first' o 'last'.",
                                "El accesor .str expone metodos vectorizados de cadenas de texto (strip, lower, replace).",
                                "Normalizar el texto previo a eliminar duplicados evita inconsistencias por mayusculas y espacios."
                            ],
                            "exercise": {
                                "id": "ex_da_03_03",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la sintaxis correcta en Pandas para eliminar los espacios en blanco iniciales y finales de una columna de texto llamada 'nombres'?",
                                "options": [
                                    {"id": "a", "text": "df['nombres'] = df['nombres'].str.strip()"},
                                    {"id": "b", "text": "df['nombres'] = df['nombres'].strip()"},
                                    {"id": "c", "text": "df['nombres'] = strip(df['nombres'])"},
                                    {"id": "d", "text": "df['nombres'] = df['nombres'].clean_spaces()"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Las operaciones de cadenas sobre Series requieren el accesor vectorizado '.str' seguido del metodo correspondiente (.str.strip())."
                            }
                        },
                        {
                            "id": "les_da_03_04",
                            "code": "L04",
                            "title": "Transformaciones con .apply(), .map() y Vectorizacion",
                            "slug": "transformaciones-apply-map-vectorizacion",
                            "position": 4,
                            "concept_id": "da-pandas-apply-map",
                            "objective": "Aplicar funciones personalizadas con .apply() y .map(), entendiendo las implicaciones de rendimiento frente a la vectorizacion.",
                            "theory_markdown": "Cuando una transformacion compleja no puede realizarse con operadores nativos de Pandas, se recurre a funciones de mapeo:\n\n1. **`Series.map(diccionario | funcion)`:**\n   Ideal para sustituciones de clave a valor:\n   `df['codigo'] = df['pais'].map({'CO': 'Colombia', 'MX': 'Mexico'})`.\n\n2. **`Series.apply(funcion_lambda)`:**\n   Aplica una funcion personalizada elemento a elemento sobre una Serie.\n\n3. **`DataFrame.apply(funcion, axis=1)`:**\n   Aplica una funcion fila por fila (evaluando multiples columnas simultaneamente).\n\n### Regla de Rendimiento\n`apply()` es internamente un bucle de Python. Siempre que sea posible, **prefiere operaciones vectorizadas nativas** (hasta 100 veces mas rapidas que `apply`).",
                            "examples": [
                                {
                                    "title": "Calculo de comision con apply fila a fila",
                                    "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"ventas\": [1000, 5000, 800],\n    \"antiguedad_anos\": [1, 5, 2]\n})\n\ndef calcular_bono(fila):\n    if fila[\"ventas\"] > 2000 and fila[\"antiguedad_anos\"] >= 3:\n        return fila[\"ventas\"] * 0.10\n    return 50.0\n\ndf[\"bono\"] = df.apply(calcular_bono, axis=1)\nprint(df[\"bono\"].tolist())",
                                    "output": "[50.0, 500.0, 50.0]",
                                    "explanation": "axis=1 entrega cada fila completa como una Serie a la funcion calcular_bono."
                                }
                            ],
                            "common_errors": "Usar df.apply(..., axis=1) para operaciones matematicas sencillas como sumas de dos columnas (df['a'] + df['b']), desperdiciando el rendimiento de las operaciones vectorizadas de NumPy.",
                            "mini_exercise": {
                                "instructions": "Usa .map() para transformar la columna 'estado' usando el diccionario {'A': 'Activo', 'I': 'Inactivo'}.",
                                "starter_code": "import pandas as pd\ndf = pd.DataFrame({\"estado\": [\"A\", \"I\", \"A\"]})\nmapeo = {\"A\": \"Activo\", \"I\": \"Inactivo\"}\n\n# Aplica .map\ndf[\"estado_largo\"] = ...",
                                "solution": "df[\"estado_largo\"] = df[\"estado\"].map(mapeo)"
                            },
                            "key_takeaways": [
                                ".map() sustituye valores segun diccionarios de equivalencias eficientemente.",
                                ".apply(axis=1) permite evaluar logica condicional compleja que involucra multiples columnas.",
                                "Las operaciones vectorizadas nativas deben preferirse siempre sobre apply por velocidad."
                            ],
                            "exercise": {
                                "id": "ex_da_03_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Por que se recomienda evitar df.apply() cuando existe una alternativa vectorizada nativa en Pandas o NumPy?",
                                "options": [
                                    {"id": "a", "text": "Porque .apply() itera fila por fila a nivel de interprete de Python, perdiendo la optimizacion en lenguaje C y resultando significativamente mas lento."},
                                    {"id": "b", "text": "Porque .apply() no funciona con numeros flotantes."},
                                    {"id": "c", "text": "Porque .apply() borra el indice del DataFrame."},
                                    {"id": "d", "text": "Porque .apply() solo funciona en entornos Linux."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "apply() recurre a un bucle a nivel de Python sobre cada fila, mientras que los operadores nativos ejecutan bucles en C compilado sobre arrays contiguos."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DA_M03",
            "module_slug": "pandas-limpieza-transformacion",
            "course_slug": "data-analytics",
            "questions": [
                {
                    "id": "q_da_03_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que metodo permite descartar filas de un DataFrame que tengan valores nulos unicamente en la columna 'cliente_id'?",
                    "options": [
                        {"id": "a", "text": "df.dropna(subset=['cliente_id'])"},
                        {"id": "b", "text": "df.dropna(column='cliente_id')"},
                        {"id": "c", "text": "df.remove_nan('cliente_id')"},
                        {"id": "d", "text": "df.filter(cliente_id='not_null')"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El parametro subset=['nombre_columna'] en dropna restringe la evaluacion de nulos exclusivamente a las columnas indicadas."
                },
                {
                    "id": "q_da_03_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como se imputan todos los valores faltantes de una columna 'edad' con el valor medio de esa columna en Pandas?",
                    "options": [
                        {"id": "a", "text": "df['edad'] = df['edad'].fillna(df['edad'].mean())"},
                        {"id": "b", "text": "df['edad'].replace_null(df['edad'].average())"},
                        {"id": "c", "text": "df['edad'] = df['edad'].impute()"},
                        {"id": "d", "text": "df['edad'].fillna('mean')"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "fillna() acepta un escalar numerico resultante de calcular df['columna'].mean() para reemplazar cada celda nula."
                },
                {
                    "id": "q_da_03_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que ocurre al ejecutar pd.to_numeric(df['ventas'], errors='coerce') si la columna 'ventas' contiene la cadena de texto 'sin_dato'?",
                    "options": [
                        {"id": "a", "text": "Pandas reemplaza el valor 'sin_dato' por un valor nulo NaN y convierte la columna a float64."},
                        {"id": "b", "text": "Arroja un error ValueError ininterrumpido."},
                        {"id": "c", "text": "Asigna el valor cero."},
                        {"id": "d", "text": "Ignora la columna y no la modifica."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "errors='coerce' fuerza la transformacion de elementos que no puedan parsearse numericamente a NaN sin fallar."
                },
                {
                    "id": "q_da_03_04",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual metodo elimina filas duplicadas en un DataFrame de Pandas?",
                    "options": [
                        {"id": "a", "text": "df.drop_duplicates()"},
                        {"id": "b", "text": "df.remove_repetidos()"},
                        {"id": "c", "text": "df.unique_rows()"},
                        {"id": "d", "text": "df.distinct()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "drop_duplicates() es el metodo oficial de Pandas para filtrar y remover registros redundantes."
                },
                {
                    "id": "q_da_03_05",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "Dado el DataFrame df con la columna 'codigo'=[' A-01 ', ' B-02 '], que produce df['codigo'].str.strip()?",
                    "options": [
                        {"id": "a", "text": "Una Serie con ['A-01', 'B-02'] sin los espacios en blanco externos."},
                        {"id": "b", "text": "Una lista con ['A01', 'B02'] eliminando los guiones."},
                        {"id": "c", "text": "Un error TypeError."},
                        {"id": "d", "text": "[' a-01 ', ' b-02 '] en minusculas."}
                    ],
                    "correct_option_id": "a",
                    "explanation": ".str.strip() remueve los espacios al inicio y al final de cada cadena de texto de forma vectorizada."
                },
                {
                    "id": "q_da_03_06",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "En la instruccion df.apply(mi_funcion, axis=1), que representa el argumento axis=1?",
                    "options": [
                        {"id": "a", "text": "Que la funcion se ejecutara fila por fila, recibiendo cada fila completa como una Serie de Pandas."},
                        {"id": "b", "text": "Que la funcion operara exclusivamente sobre la primera columna."},
                        {"id": "c", "text": "Que la funcion se aplicara sobre cada columna verticalmente."},
                        {"id": "d", "text": "Que se descartara la primera fila del DataFrame."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "En un DataFrame, axis=1 indica operacion a lo largo de las columnas (horizontalmente), por lo que la funcion recibe la fila completa."
                }
            ]
        }
    },
    {
        "dir": "04_pandas_agrupaciones",
        "module_json": {
            "id": "da_mod_04",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DA_M04",
            "slug": "pandas-agrupaciones-merges",
            "course_slug": "data-analytics",
            "title": "Agrupaciones (groupby), Tablas Dinamicas y Merges",
            "objective": "Aplicar el patron Split-Apply-Combine con groupby, crear tablas dinamicas con pivot_table y combinar fuentes con merge y concat.",
            "description": "El nucleo analitico de Pandas: segmentacion de metricas, agregaciones avanzadas, remodelado de datos y cruce de tablas relacionales.",
            "position": 44,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_da_04_01",
                    "code": "S01",
                    "title": "Agregacion, Pivotado y Cruces de Datos",
                    "slug": "agregacion-pivotado-cruces",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_da_04_01",
                            "code": "L01",
                            "title": "El Patron Split-Apply-Combine con groupby",
                            "slug": "patron-split-apply-combine",
                            "position": 1,
                            "concept_id": "da-pandas-groupby",
                            "objective": "Comprender las tres etapas del patron Split-Apply-Combine y aplicar funciones de agregacion directas.",
                            "theory_markdown": "El analisis de datos por categorias se rige por el patron **Split-Apply-Combine** conceptualizado por Hadley Wickham:\n\n1. **Split (Dividir):** Se separan los datos en grupos basados en los valores de una o mas variables categoricas (ej. dividir transacciones por `sucursal`).\n2. **Apply (Aplicar):** Se computa una funcion analitica sobre cada grupo de forma aislada (`sum()`, `mean()`, `count()`, `max()`).\n3. **Combine (Combinar):** Se unen los resultados individuales en un nuevo DataFrame unificado.\n\n### Sintaxis fundamental\n```python\n# Media de ventas agrupada por region:\ndf.groupby('region')['ventas'].mean()\n\n# Agrupacion por multiples columnas:\ndf.groupby(['region', 'categoria'])['ventas'].sum()\n```\nSi no deseas que las columnas agrupadoras se conviertan en el Indice de filas del resultado, se utiliza `as_index=False`: `df.groupby('region', as_index=False)['ventas'].sum()`.",
                            "examples": [
                                {
                                    "title": "Suma y conteo por categoria",
                                    "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"categoria\": [\"A\", \"B\", \"A\", \"B\", \"A\"],\n    \"monto\": [100, 200, 150, 300, 50]\n})\nresumen = df.groupby(\"categoria\")[\"monto\"].sum()\nprint(resumen)",
                                    "output": "categoria\nA    300\nB    500\nName: monto, dtype: int64",
                                    "explanation": "Los 3 registros de A totalizan 300 y los 2 de B totalizan 500."
                                }
                            ],
                            "common_errors": "Omitir los corchetes de seleccion de columna despues del groupby, intentando aplicar funciones matematicas a todas las columnas del DataFrame incluso si contienen nombres o texto.",
                            "mini_exercise": {
                                "instructions": "Calcula el promedio de 'salario' agrupado por 'departamento' usando groupby.",
                                "starter_code": "import pandas as pd\ndf = pd.DataFrame({\"departamento\": [\"IT\", \"HR\", \"IT\"], \"salario\": [3000, 2500, 3500]})\n\n# Agrupa y promedia\npromedio_salarios = ...",
                                "solution": "promedio_salarios = df.groupby(\"departamento\")[\"salario\"].mean()"
                            },
                            "key_takeaways": [
                                "Split-Apply-Combine divide los datos, ejecuta metricas en cada grupo y une los resultados.",
                                "groupby(['col1', 'col2']) soporta segmentaciones jerarquicas compuestas.",
                                "as_index=False mantiene las columnas agrupadoras como columnas regulares."
                            ],
                            "exercise": {
                                "id": "ex_da_04_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cuales son las tres fases del patron Split-Apply-Combine implementado por el metodo groupby de Pandas?",
                                "options": [
                                    {"id": "a", "text": "Dividir los datos en grupos, aplicar una funcion de calculo a cada subconjunto y combinar los resultados en una nueva estructura."},
                                    {"id": "b", "text": "Separar el texto, compilar el codigo y guardarlo en binario."},
                                    {"id": "c", "text": "Ordenar la tabla, eliminar los duplicados y exportar a CSV."},
                                    {"id": "d", "text": "Crear una base de datos, insertar datos y cerrar la conexion."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El patron consiste en particionar los datos por categorias (Split), computar metricas independientes (Apply) y reagrupar las respuestas (Combine)."
                            }
                        },
                        {
                            "id": "les_da_04_02",
                            "code": "L02",
                            "title": "Agregaciones Multiples con .agg() y Transformaciones",
                            "slug": "agregaciones-multiples-agg-transform",
                            "position": 2,
                            "concept_id": "da-pandas-agg-transform",
                            "objective": "Calcular multiples metricas por grupo mediante .agg() y contrastarlo con .transform() que conserva la dimension original.",
                            "theory_markdown": "### Agregacion avanzada con `.agg()`\nPara computar diferentes metricas estadisticas sobre distintas columnas en una sola linea, se pasa un diccionario a `.agg()`:\n```python\ndf.groupby('categoria').agg({\n    'precio': ['mean', 'min', 'max'],\n    'unidades': 'sum',\n    'cliente_id': 'nunique'  # Clientes unicos\n})\n```\n\n### La diferencia fundamental con `.transform()`\n- `.agg()` **reduce** el numero de filas: devuelve 1 fila por cada grupo unico.\n- `.transform()` computa la metrica pero **mantiene intacto el numero original de filas**, alineando el resultado del grupo con cada fila individual del DataFrame.\n\nEjemplo: Calcular el porcentaje que aporta cada venta individual sobre el total de su respectiva categoria.",
                            "examples": [
                                {
                                    "title": "Uso de .transform() para normalizar por grupo",
                                    "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"tienda\": [\"Norte\", \"Norte\", \"Sur\", \"Sur\"],\n    \"venta\": [100, 300, 200, 200]\n})\n# Total de ventas de la tienda correspondiente a cada fila:\ndf[\"total_tienda\"] = df.groupby(\"tienda\")[\"venta\"].transform(\"sum\")\ndf[\"pct_tienda\"] = df[\"venta\"] / df[\"total_tienda\"]\nprint(df)",
                                    "output": "   tienda  venta  total_tienda  pct_tienda\n0   Norte    100           400        0.25\n1   Norte    300           400        0.75\n2     Sur    200           400        0.50\n3     Sur    200           400        0.50",
                                    "explanation": "transform('sum') no redujo la tabla a 2 filas, sino que devolvio una Serie de 4 elementos para operar fila a fila."
                                }
                            ],
                            "common_errors": "Intentar asignar el resultado de un groupby().agg() directo a una nueva columna del DataFrame original sin usar transform, provocando un ValueError de desajuste de dimensiones.",
                            "mini_exercise": {
                                "instructions": "Usa .agg() para calcular la media ('mean') y el maximo ('max') de la columna 'valor' agrupada por 'tipo'.",
                                "starter_code": "import pandas as pd\ndf = pd.DataFrame({\"tipo\": [\"A\", \"A\", \"B\"], \"valor\": [10, 20, 30]})\n\n# Agrupa con .agg\nmetricas = ...",
                                "solution": "metricas = df.groupby(\"tipo\")[\"valor\"].agg([\"mean\", \"max\"])"
                            },
                            "key_takeaways": [
                                ".agg() permite especificar multiples funciones de reduccion por columna.",
                                ".transform() devuelve una Serie con el mismo tamano del DataFrame original.",
                                ".transform() es ideal para calculos de porcentajes o estandarizacion dentro de grupos."
                            ],
                            "exercise": {
                                "id": "ex_da_04_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es la diferencia en la dimension del resultado entre invocar .agg('mean') y .transform('mean') sobre un groupby?",
                                "options": [
                                    {"id": "a", "text": ".agg('mean') reduce las filas retornando unicamente una por grupo; .transform('mean') retorna una Serie con el mismo numero de filas que el DataFrame original."},
                                    {"id": "b", "text": ".transform('mean') solo funciona con numeros enteros."},
                                    {"id": "c", "text": ".agg('mean') no soporta funciones matematicas de reduccion."},
                                    {"id": "d", "text": "Ambos retornan siempre un escalar unico."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "transform difunde el valor calculado del grupo de regreso a cada fila original, manteniendo la cardinalidad de la tabla intacta."
                            }
                        },
                        {
                            "id": "les_da_04_03",
                            "code": "L03",
                            "title": "Tablas Dinamicas con pivot_table y Des-pivotado con melt",
                            "slug": "tablas-dinamicas-pivot-melt",
                            "position": 3,
                            "concept_id": "da-pandas-pivot-melt",
                            "objective": "Remodelar la forma de un DataFrame pasando de formato largo a ancho con pivot_table y viceversa con melt.",
                            "theory_markdown": "### Tablas Dinamicas con `pivot_table`\n`pivot_table` genera matrices bidimensionales cruzando dos variables categoricas con una funcion agregadora:\n```python\nmatriz = df.pivot_table(\n    index='anio',          # Filas\n    columns='trimestre',   # Columnas\n    values='ventas',       # Celda\n    aggfunc='sum',         # Agregacion (mean por defecto)\n    fill_value=0           # Reemplazo de celdas vacias\n)\n```\n\n### Des-pivotar con `melt` (Formato Ancho a Formato Largo)\nMuchos datasets vienen en formato ancho (ej. columnas `Ene`, `Feb`, `Mar`). Las herramientas de visualizacion y machine learning requieren **formato largo (tidy data)**:\n```python\ndf_largo = df.melt(\n    id_vars=['pais', 'indicador'],  # Columnas que se mantienen fijas\n    value_vars=['2021', '2022'],    # Columnas que se des-pivotan\n    var_name='anio',                # Nombre de la nueva columna de etiquetas\n    value_name='valor'              # Nombre de la nueva columna de datos\n)\n```",
                            "examples": [
                                {
                                    "title": "De formato ancho a formato largo con melt",
                                    "code": "import pandas as pd\n\ndf_ancho = pd.DataFrame({\n    \"pais\": [\"Colombia\", \"Chile\"],\n    \"2020\": [100, 150],\n    \"2021\": [120, 180]\n})\ndf_tidy = df_ancho.melt(id_vars=[\"pais\"], var_name=\"anio\", value_name=\"pib\")\nprint(df_tidy)",
                                    "output": "       pais  anio  pib\n0  Colombia  2020  100\n1     Chile  2020  150\n2  Colombia  2021  120\n3     Chile  2021  180",
                                    "explanation": "Las columnas de anos se convirtieron en filas de una sola variable categorica 'anio'."
                                }
                            ],
                            "common_errors": "Confundir pivot() con pivot_table(). pivot() falla con un ValueError si existen claves duplicadas en la combinacion index/columns; pivot_table() aplica una funcion agregadora resolviendo duplicados.",
                            "mini_exercise": {
                                "instructions": "Crea una tabla dinamica con index='region', columns='mes', values='ventas' y aggfunc='sum'.",
                                "starter_code": "import pandas as pd\ndf = pd.DataFrame({\"region\": [\"Norte\"], \"mes\": [\"Ene\"], \"ventas\": [500]})\n\n# Crea la tabla dinamica\ntabla = ...",
                                "solution": "tabla = df.pivot_table(index=\"region\", columns=\"mes\", values=\"ventas\", aggfunc=\"sum\")"
                            },
                            "key_takeaways": [
                                "pivot_table cruza dos categorias en una matriz 2D agregando los valores numéricos.",
                                "fill_value=0 previene que combinaciones sin datos queden como NaN.",
                                "melt transforma estructuras anchas a formato largo (tidy data), optimo para graficos."
                            ],
                            "exercise": {
                                "id": "ex_da_04_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual metodo de Pandas se utiliza para convertir un DataFrame de formato ancho (con columnas como '2020', '2021', '2022') a formato largo (con una columna 'anio' y otra 'valor')?",
                                "options": [
                                    {"id": "a", "text": "df.melt()"},
                                    {"id": "b", "text": "df.unstack()"},
                                    {"id": "c", "text": "df.pivot()"},
                                    {"id": "d", "text": "df.flatten()"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "melt() des-pivota las columnas de medicion convirtiendolas en tuplas de variables y valores en formato largo (tidy)."
                            }
                        },
                        {
                            "id": "les_da_04_04",
                            "code": "L04",
                            "title": "Uniones y Combinaciones con merge y concat",
                            "slug": "uniones-combinaciones-merge-concat",
                            "position": 4,
                            "concept_id": "da-pandas-merge-concat",
                            "objective": "Unir DataFrames mediante claves compartidas con pd.merge() y concatenar tablas vertical u horizontalmente con pd.concat().",
                            "theory_markdown": "### Uniones relacionales con `pd.merge()`\n`pd.merge()` emula las operaciones `JOIN` de SQL:\n```python\nresultado = pd.merge(df_usuarios, df_pedidos, on='usuario_id', how='inner')\n```\nTipos de join (`how`):\n- `'inner'` (defecto): Solo conserva filas cuyas claves coinciden en ambas tablas.\n- `'left'`: Conserva todas las filas del DataFrame izquierdo, rellenando con `NaN` los datos no coincidentes de la derecha.\n- `'right'`: Conserva todas las filas de la derecha.\n- `'outer'`: Union completa (Full Outer Join) que retiene todas las filas de ambos lados.\n\n### Concatenacion con `pd.concat()`\nApila DataFrames que comparten la misma estructura:\n- `axis=0` (defecto): Apila verticalmente (anadiendo nuevas **filas**).\n- `axis=1`: Apila horizontalmente (anadiendo nuevas **columnas**).",
                            "examples": [
                                {
                                    "title": "Left Join entre clientes y pedidos",
                                    "code": "import pandas as pd\n\nclientes = pd.DataFrame({\"id\": [1, 2, 3], \"nombre\": [\"Ana\", \"Luis\", \"Sara\"]})\npedidos = pd.DataFrame({\"id\": [1, 1], \"monto\": [100, 250]})\n\n# Left Join asegurando que todos los clientes aparezcan\ncruce = pd.merge(clientes, pedidos, on=\"id\", how=\"left\")\nprint(cruce)",
                                    "output": "   id nombre  monto\n0   1    Ana  100.0\n1   1    Ana  250.0\n2   2   Luis    NaN\n3   3   Sara    NaN",
                                    "explanation": "Luis y Sara no tienen pedidos registrados, por lo que su monto se completa con NaN."
                                }
                            ],
                            "common_errors": "Hacer un merge sin especificar el parametro on ni left_on/right_on cuando ambas tablas tienen nombres de columnas diferentes, produciendo un cruce erroneo o vacio.",
                            "mini_exercise": {
                                "instructions": "Usa pd.concat para apilar verticalmente (axis=0) la lista de DataFrames [df1, df2] ignorando el indice previo.",
                                "starter_code": "import pandas as pd\ndf1 = pd.DataFrame({\"a\": [1]})\ndf2 = pd.DataFrame({\"a\": [2]})\n\n# Concatena verticalmente\nunificado = ...",
                                "solution": "unificado = pd.concat([df1, df2], axis=0, ignore_index=True)"
                            },
                            "key_takeaways": [
                                "pd.merge() cruza tablas relacionales mediante claves (inner, left, right, outer).",
                                "pd.concat(axis=0) apila tablas verticalmente agregando filas.",
                                "ignore_index=True en concat regenera un indice secuencial limpio de 0 a N-1."
                            ],
                            "exercise": {
                                "id": "ex_da_04_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que tipo de join en pd.merge() garantiza que no se pierda ningun registro del primer DataFrame (izquierdo), asignando NaN si no hay coincidencia en el segundo?",
                                "options": [
                                    {"id": "a", "text": "how='left'"},
                                    {"id": "b", "text": "how='inner'"},
                                    {"id": "c", "text": "how='cross'"},
                                    {"id": "d", "text": "how='right'"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Un Left Outer Join (how='left') preserva todas las filas del DataFrame izquierdo independientemente de si existen coincidencias en la tabla derecha."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DA_M04",
            "module_slug": "pandas-agrupaciones-merges",
            "course_slug": "data-analytics",
            "questions": [
                {
                    "id": "q_da_04_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que metodo de Pandas se utiliza como punto de partida para aplicar el patron analitico Split-Apply-Combine sobre columnas categoricas?",
                    "options": [
                        {"id": "a", "text": "df.groupby()"},
                        {"id": "b", "text": "df.split()"},
                        {"id": "c", "text": "df.partition()"},
                        {"id": "d", "text": "df.cluster()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "df.groupby() agrupa las filas que comparten valores comunes para procesar calculos de agregacion en cada subconjunto."
                },
                {
                    "id": "q_da_04_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como se calculan multiples estadisticas (ej. promedio y suma) sobre una columna tras un groupby usando Pandas?",
                    "options": [
                        {"id": "a", "text": "df.groupby('categoria')['ventas'].agg(['mean', 'sum'])"},
                        {"id": "b", "text": "df.groupby('categoria')['ventas'].compute('mean', 'sum')"},
                        {"id": "c", "text": "df.groupby('categoria').sum_and_mean()"},
                        {"id": "d", "text": "df.groupby('categoria')['ventas'].all(['mean', 'sum'])"}
                    ],
                    "correct_option_id": "a",
                    "explanation": ".agg() recibe una lista o diccionario de cadenas con los nombres de las funciones de agregacion requeridas."
                },
                {
                    "id": "q_da_04_03",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Por que es util df.groupby('departamento')['sueldo'].transform('mean') para tareas de normalizacion dentro de grupos?",
                    "options": [
                        {"id": "a", "text": "Porque retorna una Serie con la misma longitud que el DataFrame original, permitiendo calcular la diferencia entre el sueldo individual y la media de su departamento de forma directa."},
                        {"id": "b", "text": "Porque transforma los sueldos en numeros enteros redondeados."},
                        {"id": "c", "text": "Porque elimina los departamentos que tengan menos de 5 empleados."},
                        {"id": "d", "text": "Porque reemplaza la necesidad de usar NumPy."}
                    ],
                    "correct_option_id": "a",
                    "explanation": ".transform() difunde el valor calculado a cada posicion original de la fila, facilitando operaciones fila a fila con respecto al agregado del grupo."
                },
                {
                    "id": "q_da_04_04",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual es la diferencia principal entre pivot() y pivot_table() en Pandas?",
                    "options": [
                        {"id": "a", "text": "pivot_table() puede agregar valores repetidos mediante una funcion (como 'mean' o 'sum'); pivot() falla con un error si encuentra valores duplicados para la combinacion de indice y columna."},
                        {"id": "b", "text": "pivot() solo funciona con graficos de Matplotlib."},
                        {"id": "c", "text": "pivot_table() solo funciona con archivos de Excel."},
                        {"id": "d", "text": "Son funciones identicas sin ninguna diferencia tecnica."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "pivot() requiere unicidad estricta en las claves index/columns, mientras que pivot_table() agrega duplicados con aggfunc."
                },
                {
                    "id": "q_da_04_05",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "Si se tienen dos DataFrames df1 (100 filas) y df2 (50 filas), que funcion se utiliza para apilarlos verticalmente obteniendo una tabla de 150 filas?",
                    "options": [
                        {"id": "a", "text": "pd.concat([df1, df2], axis=0)"},
                        {"id": "b", "text": "pd.merge(df1, df2, on='index')"},
                        {"id": "c", "text": "df1.join(df2)"},
                        {"id": "d", "text": "pd.stack(df1, df2)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "pd.concat(..., axis=0) realiza la union vertical agregando filas una debajo de la otra."
                },
                {
                    "id": "q_da_04_06",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que argumento de pd.merge() determina la columna compartida utilizada como clave de union entre ambas tablas?",
                    "options": [
                        {"id": "a", "text": "on='nombre_columna'"},
                        {"id": "b", "text": "key='nombre_columna'"},
                        {"id": "c", "text": "match='nombre_columna'"},
                        {"id": "d", "text": "join_by='nombre_columna'"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El parametro on especifica el nombre del campo comun sobre el cual se ejecutara la alineacion relacional."
                }
            ]
        }
    },
    {
        "dir": "05_matplotlib_seaborn",
        "module_json": {
            "id": "da_mod_05",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DA_M05",
            "slug": "matplotlib-seaborn",
            "course_slug": "data-analytics",
            "title": "Visualizacion Estatica con Matplotlib y Seaborn",
            "objective": "Construir visualizaciones publicables usando la interfaz orientada a objetos de Matplotlib y graficos estadisticos avanzados con Seaborn.",
            "description": "Comunica insights con claridad: control pixel-perfect de figuras, paletas accesibles, distribuciones y matrices de correlacion.",
            "position": 45,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_da_05_01",
                    "code": "S01",
                    "title": "Visualizacion Orientada a Objetos y Estadistica",
                    "slug": "visualizacion-oo-estadistica",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_da_05_01",
                            "code": "L01",
                            "title": "Arquitectura Orientada a Objetos de Matplotlib",
                            "slug": "arquitectura-oo-matplotlib",
                            "position": 1,
                            "concept_id": "da-matplotlib-oo-architecture",
                            "objective": "Construir lienzos y ejes desacoplados con subplots() y dominar la jerarquia Figure y Axes.",
                            "theory_markdown": "Matplotlib posee dos interfaces de programacion:\n1. **Interfaz pyplot de estado (estilo MATLAB):** `plt.plot()`, `plt.title()`. Opera sobre una figura global implicita; propensa a errores cuando se generan multiples graficos.\n2. **Interfaz Orientada a Objetos (OO - Recomendada):**\n   Crea explicitamente los objetos contenedores:\n   ```python\n   import matplotlib.pyplot as plt\n\n   fig, ax = plt.subplots(figsize=(8, 5))\n   ```\n   - **`Figure` (`fig`):** El lienzo o ventana completa que puede contener uno o varios graficos.\n   - **`Axes` (`ax`):** El grafico individual con su propio sistema de coordenadas X/Y, titulo, etiquetas y limites.\n\n### Metodos esenciales sobre ax\n- `ax.set_title(\"Titulo del Grafico\")`\n- `ax.set_xlabel(\"Eje X\")` y `ax.set_ylabel(\"Eje Y\")`\n- `ax.grid(True, linestyle='--', alpha=0.6)`",
                            "examples": [
                                {
                                    "title": "Creacion de grafico con interfaz orientada a objetos",
                                    "code": "import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4]\ny = [10, 25, 20, 35]\n\nfig, ax = plt.subplots(figsize=(6, 4))\nax.plot(x, y, color=\"#2b5c8f\", marker=\"o\", linewidth=2)\nax.set_title(\"Evolucion de Metricas\")\nax.set_xlabel(\"Periodo\")\nax.set_ylabel(\"Valor\")\nax.grid(True, alpha=0.3)\nplt.close(fig)",
                                    "output": "Figura generada con control explicito de propiedades sobre el objeto ax.",
                                    "explanation": "El enfoque orientado a objetos permite componer layouts complejos sin efectos colaterales de estado global."
                                }
                            ],
                            "common_errors": "Mezclar llamadas de estado global como plt.title() con el objeto ax, lo que puede aplicar los titulos a la figura equivocada en layouts con multiples subplots.",
                            "mini_exercise": {
                                "instructions": "Usa plt.subplots para instanciar una figura 'fig' y un eje 'ax' con tamano figsize=(10, 6).",
                                "starter_code": "import matplotlib.pyplot as plt\n\n# Crea fig y ax\nfig, ax = ...",
                                "solution": "fig, ax = plt.subplots(figsize=(10, 6))"
                            },
                            "key_takeaways": [
                                "La interfaz Orientada a Objetos (fig, ax = plt.subplots()) es el estandar profesional.",
                                "Figure representa el lienzo global; Axes representa el grafico individual.",
                                "Personaliza ejes con ax.set_title(), ax.set_xlabel() y ax.grid()."
                            ],
                            "exercise": {
                                "id": "ex_da_05_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la diferencia entre el objeto Figure y el objeto Axes en la arquitectura orientada a objetos de Matplotlib?",
                                "options": [
                                    {"id": "a", "text": "Figure es el lienzo contenedor completo de la imagen; Axes es el grafico individual que contiene los datos, ejes y escalas."},
                                    {"id": "b", "text": "Figure es solo para graficos en 3D y Axes para 2D."},
                                    {"id": "c", "text": "Axes representa el eje X y Figure representa el eje Y."},
                                    {"id": "d", "text": "No hay diferencia, son terminos sinonimos."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Una Figure puede alojar multiples objetos Axes (por ejemplo en una grilla de 2x2 subplots), donde cada Axes es un grafico independiente."
                            }
                        },
                        {
                            "id": "les_da_05_02",
                            "code": "L02",
                            "title": "Graficos Fundamentales en Matplotlib",
                            "slug": "graficos-fundamentales-matplotlib",
                            "position": 2,
                            "concept_id": "da-matplotlib-basic-charts",
                            "objective": "Construir graficos de lineas, barras, dispersion e histogramas, y exportarlos en alta resolucion con savefig().",
                            "theory_markdown": "Matplotlib implementa los tipos graficos basicos mediante metodos directos sobre el objeto `Axes`:\n\n1. **Lineas (`ax.plot(x, y)`):** Para series temporales y tendencias continuas.\n2. **Barras (`ax.bar(categorias, valores)` o `ax.barh()` horizontal):** Para comparar magnitudes entre categorias discretas.\n3. **Dispersion (`ax.scatter(x, y, s=tamano, c=color)`):** Para analizar correlaciones y relaciones entre dos variables continuas.\n4. **Histograma (`ax.hist(datos, bins=20, edgecolor='black')`):** Para estimar la distribucion de probabilidad y frecuencia de una variable numerica.\n\n### Exportacion en alta resolucion\nPara reportes o publicaciones academicas:\n```python\nfig.savefig('reporte.png', dpi=300, bbox_inches='tight')\n```\n`dpi=300` produce calidad de imprenta y `bbox_inches='tight'` elimina margenes blancos sobrantes.",
                            "examples": [
                                {
                                    "title": "Construccion y guardado de un histograma",
                                    "code": "import matplotlib.pyplot as plt\nimport numpy as np\n\ndatos = np.random.normal(loc=100, scale=15, size=500)\nfig, ax = plt.subplots(figsize=(6, 4))\nax.hist(datos, bins=25, color=\"#4a90e2\", edgecolor=\"black\", alpha=0.7)\nax.set_title(\"Distribucion de Puntuaciones\")\nfig.savefig(\"distribucion.png\", dpi=150, bbox_inches=\"tight\")\nplt.close(fig)",
                                    "output": "Archivo distribucion.png guardado con 25 intervalos y bordes limpios.",
                                    "explanation": "bins controla la granularidad de la discretizacion de la variable continua."
                                }
                            ],
                            "common_errors": "Guardar la figura con plt.savefig() despues de haber ejecutado plt.show(), lo que genera una imagen en blanco porque la ventana grafica de estado ya libero la memoria.",
                            "mini_exercise": {
                                "instructions": "Usa ax.bar para crear un grafico de barras con categorias=['A', 'B'] y valores=[10, 25].",
                                "starter_code": "import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\n\n# Dibuja las barras\n",
                                "solution": "ax.bar([\"A\", \"B\"], [10, 25])"
                            },
                            "key_takeaways": [
                                "plot para tendencias, bar para categorias, scatter para relaciones y hist para distribuciones.",
                                "bins en ax.hist define el numero de intervalos de agrupacion de frecuencias.",
                                "fig.savefig con dpi=300 y bbox_inches='tight' garantiza exportaciones profesionales."
                            ],
                            "exercise": {
                                "id": "ex_da_05_02",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual parametro de fig.savefig() se utiliza para recortar los espacios en blanco innecesarios alrededor del grafico?",
                                "options": [
                                    {"id": "a", "text": "bbox_inches='tight'"},
                                    {"id": "b", "text": "crop=True"},
                                    {"id": "c", "text": "trim=True"},
                                    {"id": "d", "text": "fit_screen=True"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "bbox_inches='tight' calcula automaticamente la caja delimitadora de todos los elementos graficos y elimina los margenes vacios exteriores."
                            }
                        },
                        {
                            "id": "les_da_05_03",
                            "code": "L03",
                            "title": "Visualizacion Estadistica con Seaborn",
                            "slug": "visualizacion-estadistica-seaborn",
                            "position": 3,
                            "concept_id": "da-seaborn-statistical-plots",
                            "objective": "Utilizar Seaborn para graficar directamente DataFrames de Pandas aplicando segmentaciones categoricas con hue.",
                            "theory_markdown": "**Seaborn** es una biblioteca construida sobre Matplotlib con integracion nativa con DataFrames de Pandas, paletas de colores esteticas y funciones estadisticas avanzadas.\n\n### Ventajas de Seaborn\n- Recibe directamente el DataFrame mediante `data=df` y los nombres de columnas como cadenas (`x='columna_x'`, `y='columna_y'`).\n- Incorpora calculos automaticos de intervalos de confianza e incertidumbre.\n\n### El superpoder del parametro `hue`\nEl parametro `hue` segmenta el grafico anadiendo una tercera dimension categorica mediante codificacion de color y generando la leyenda automaticamente:\n```python\nimport seaborn as sns\n\nsns.barplot(data=df, x='categoria', y='ventas', hue='region', palette='muted')\n```\n\n### Tipos de graficos estadisticos\n- `sns.histplot(df['col'], kde=True)`: Histograma con curva de densidad de kernel (KDE).\n- `sns.boxplot(data=df, x='grupo', y='valor')`: Diagrama de cajas para visualizar mediana, rango intercuartilico y outliers.",
                            "examples": [
                                {
                                    "title": "Diagrama de caja segmentado por categoria con Seaborn",
                                    "code": "import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\n\ndf = pd.DataFrame({\n    \"nivel\": [\"Junior\", \"Junior\", \"Senior\", \"Senior\"],\n    \"salario\": [3000, 3500, 7000, 8500],\n    \"genero\": [\"F\", \"M\", \"F\", \"M\"]\n})\n\nfig, ax = plt.subplots(figsize=(6, 4))\nsns.boxplot(data=df, x=\"nivel\", y=\"salario\", hue=\"genero\", ax=ax)\nax.set_title(\"Salarios por Nivel y Genero\")\nplt.close(fig)",
                                    "output": "Boxplot con cajas coloreadas segun el genero y separadas por nivel laboral.",
                                    "explanation": "hue divide cada categoria de X en subgrupos coloreados con su propia leyenda."
                                }
                            ],
                            "common_errors": "Intentar pasar listas separadas x=df['a'].tolist() cuando Seaborn acepta directamente data=df, x='a', y='b', aprovechando la metadata de nombres.",
                            "mini_exercise": {
                                "instructions": "Usa sns.histplot para trazar la distribucion de 'edades' en el DataFrame 'df' activando kde=True.",
                                "starter_code": "import seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({\"edades\": [20, 25, 30, 35, 40]})\n\n# Crea el histplot con kde\n",
                                "solution": "sns.histplot(data=df, x=\"edades\", kde=True)"
                            },
                            "key_takeaways": [
                                "Seaborn opera de forma nativa con DataFrames de Pandas pasados a data=df.",
                                "hue codifica por color una dimension categorica adicional y genera la leyenda.",
                                "boxplot e histplot(kde=True) revelan dispersion, sesgo y distribuciones probabilisticas."
                            ],
                            "exercise": {
                                "id": "ex_da_05_03",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Que funcion cumple el argumento hue='...' en las funciones de visualizacion de Seaborn?",
                                "options": [
                                    {"id": "a", "text": "Segmentar los datos por una variable categorica adicional asignando diferentes colores a cada nivel y creando la leyenda automaticamente."},
                                    {"id": "b", "text": "Cambiar el brillo de la pantalla del usuario."},
                                    {"id": "c", "text": "Filtra las filas que contengan valores negativos."},
                                    {"id": "d", "text": "Convierte los datos a una escala logaritmica."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "hue mapea los valores unicos de una columna categorica a una paleta de colores, descomponiendo la grafica en subgrupos comparables."
                            }
                        },
                        {
                            "id": "les_da_05_04",
                            "code": "L04",
                            "title": "Matrices de Correlacion y Graficos Multivariados",
                            "slug": "matrices-correlacion-pairplot",
                            "position": 4,
                            "concept_id": "da-seaborn-heatmap-pairplot",
                            "objective": "Visualizar correlaciones entre multiples variables continuas con mapas de calor (heatmap) y pares con pairplot.",
                            "theory_markdown": "En la etapa exploratoria es critico detectar asociaciones lineales o redundancias entre multiples variables continuas:\n\n### 1. Mapa de Calor de Correlaciones (`sns.heatmap`)\nCalcula primero la matriz de correlacion de Pearson con `df.corr()` y la proyecta en una grilla termica:\n```python\nmatriz_corr = df.corr(numeric_only=True)\nsns.heatmap(\n    matriz_corr,\n    annot=True,        # Escribe los valores numericos en cada celda\n    cmap='coolwarm',   # Paleta divergente (azul=negativa, rojo=positiva)\n    fmt='.2f',         # Formato con 2 decimales\n    vmin=-1, vmax=1    # Escala fija de correlacion\n)\n```\n\n### 2. Matriz de Dispersion por Pares (`sns.pairplot`)\nGenera una cuadricula de subplots donde:\n- Las celdas diagonales muestran la distribucion univariada de cada variable (KDE o histograma).\n- Las celdas fuera de la diagonal muestran graficos de dispersion cruzados entre cada par de variables.",
                            "examples": [
                                {
                                    "title": "Generacion de mapa de calor de correlacion",
                                    "code": "import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\n\ndf = pd.DataFrame({\n    \"horas_estudio\": [2, 5, 8, 10],\n    \"nota\": [50, 70, 85, 95],\n    \"ausencias\": [6, 3, 1, 0]\n})\nfig, ax = plt.subplots(figsize=(5, 4))\nsns.heatmap(df.corr(), annot=True, cmap=\"vlag\", vmin=-1, vmax=1, ax=ax)\nplt.close(fig)",
                                    "output": "Matriz con correlacion positiva entre horas y nota (0.99) y negativa con ausencias (-0.98).",
                                    "explanation": "heatmap permite diagnosticar multicolinealidad y seleccionar variables para modelos predictivos."
                                }
                            ],
                            "common_errors": "No fijar vmin=-1 y vmax=1 en el heatmap de correlacion, provocando que la escala de color se ajuste arbitrariamente y distorsione la percepcion visual de las relaciones.",
                            "mini_exercise": {
                                "instructions": "Genera un heatmap de la matriz 'matriz_corr' activando la anotacion numerica annot=True.",
                                "starter_code": "import seaborn as sns\nimport pandas as pd\nmatriz_corr = pd.DataFrame({\"a\": [1.0, 0.5], \"b\": [0.5, 1.0]})\n\n# Dibuja el heatmap con anotaciones\n",
                                "solution": "sns.heatmap(matriz_corr, annot=True)"
                            },
                            "key_takeaways": [
                                "df.corr() calcula las correlaciones lineales bivariadas entre columnas numericas.",
                                "sns.heatmap con annot=True y cmap divergente destaca relaciones positivas y negativas.",
                                "sns.pairplot visualiza distribuciones y dispersiones de todas las variables continuas en una grilla."
                            ],
                            "exercise": {
                                "id": "ex_da_05_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Por que es importante definir vmin=-1 y vmax=1 al trazar un mapa de calor (heatmap) de una matriz de correlacion de Pearson?",
                                "options": [
                                    {"id": "a", "text": "Porque el coeficiente de correlacion de Pearson esta acotado matematicamente entre -1 y +1, asegurando que el centro neutro (0) coincida con el color medio de la paleta."},
                                    {"id": "b", "text": "Porque Seaborn arroja una excepcion si no se especifican esos valores exactos."},
                                    {"id": "c", "text": "Para redondear los valores a numeros enteros."},
                                    {"id": "d", "text": "Para invertir los ejes vertical y horizontal."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Fijar los limites en -1 y +1 ancla la escala divergente (ej. coolwarm), garantizando que el color neutro represente ausencia de correlacion (0) y no un valor arbitrario."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DA_M05",
            "module_slug": "matplotlib-seaborn",
            "course_slug": "data-analytics",
            "questions": [
                {
                    "id": "q_da_05_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual instruccion de Matplotlib crea de forma desacoplada la figura y el eje en la interfaz orientada a objetos?",
                    "options": [
                        {"id": "a", "text": "fig, ax = plt.subplots()"},
                        {"id": "b", "text": "fig = plt.create_plot()"},
                        {"id": "c", "text": "ax = plt.init()"},
                        {"id": "d", "text": "fig, ax = plt.draw()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "plt.subplots() es la funcion factory oficial para instanciar la pareja Figure (fig) y Axes (ax)."
                },
                {
                    "id": "q_da_05_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que tipo de grafico es el mas indicado para visualizar la frecuencia y forma de la distribucion probabilistica de una variable numerica continua?",
                    "options": [
                        {"id": "a", "text": "Histograma (ax.hist o sns.histplot)"},
                        {"id": "b", "text": "Grafico de sectores circulares (pie chart)"},
                        {"id": "c", "text": "Grafico de barras horizontales"},
                        {"id": "d", "text": "Diagrama de Gantt"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Los histogramas discretizan la variable continua en intervalos (bins) permitiendo observar sesgos, multimodalidad y concentracion de frecuencias."
                },
                {
                    "id": "q_da_05_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como se activa la curva continua de estimacion de densidad de kernel (KDE) sobre un histograma en Seaborn?",
                    "options": [
                        {"id": "a", "text": "sns.histplot(data=df, x='columna', kde=True)"},
                        {"id": "b", "text": "sns.histplot(data=df, x='columna', line='density')"},
                        {"id": "c", "text": "sns.histplot(data=df, x='columna', curve=True)"},
                        {"id": "d", "text": "sns.kde_overlay()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El parametro kde=True superpone la curva de estimacion no parametrica de densidad de kernel sobre las barras del histograma."
                },
                {
                    "id": "q_da_05_04",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que elementos estadisticos representa la linea central y los bordes de la caja en un diagrama de caja (boxplot)?",
                    "options": [
                        {"id": "a", "text": "La linea central es la mediana (percentil 50); los bordes de la caja representan el primer cuartil (Q1) y el tercer cuartil (Q3)."},
                        {"id": "b", "text": "La linea central es el valor maximo y los bordes son los valores minimos."},
                        {"id": "c", "text": "La linea central es la media aritmetica y los bordes la desviacion estandar."},
                        {"id": "d", "text": "La caja delimita exclusivamente los valores atipicos (outliers)."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "La caja de un boxplot delimita el Rango Intercuartilico (IQR = Q3 - Q1) que contiene el 50% central de los datos, con la mediana bisecando la caja."
                },
                {
                    "id": "q_da_05_05",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "En una matriz de correlacion graficada con sns.heatmap, que valor numérico tienen siempre los elementos ubicados en la diagonal principal?",
                    "options": [
                        {"id": "a", "text": "1.0 (porque la correlacion de cualquier variable consigo misma es perfecta)"},
                        {"id": "b", "text": "0.0"},
                        {"id": "c", "text": "-1.0"},
                        {"id": "d", "text": "El promedio de la columna"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "La correlacion entre una variable X y la misma variable X es siempre exactamente 1.0 (correlacion lineal positiva perfecta)."
                },
                {
                    "id": "q_da_05_06",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Cual funcion de Seaborn crea automaticamente una grilla completa comparando todas las combinaciones bivariadas entre columnas numericas de un DataFrame?",
                    "options": [
                        {"id": "a", "text": "sns.pairplot(df)"},
                        {"id": "b", "text": "sns.multigrid(df)"},
                        {"id": "c", "text": "sns.grid_compare(df)"},
                        {"id": "d", "text": "sns.all_plots(df)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "pairplot genera una matriz de subplots cruzando cada par de variables numericas con graficos de dispersion y sus distribuciones en la diagonal."
                }
            ]
        }
    }
]

def main():
    print("Iniciando generacion de modulos 01 a 05 de Data Analytics...")
    for mod in MODULES:
        mod_dir = os.path.join(BASE_DIR, mod["dir"])
        os.makedirs(mod_dir, exist_ok=True)
        
        module_path = os.path.join(mod_dir, "module.json")
        with open(module_path, "w", encoding="utf-8") as f:
            json.dump(mod["module_json"], f, indent=2, ensure_ascii=False)
            f.write("\n")
            
        bank_path = os.path.join(mod_dir, "bank.json")
        with open(bank_path, "w", encoding="utf-8") as f:
            json.dump(mod["bank_json"], f, indent=2, ensure_ascii=False)
            f.write("\n")
            
        print(f"Generado exitosamente: {mod['dir']} (4 lecciones, 6 preguntas en banco)")

if __name__ == "__main__":
    main()
