import type { RawModule } from './types.ts';

const LANG_ID = 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

export const DATA_ANALYTICS_MODULES: RawModule[] = [
  // M01
  {
    id: 'da_mod_01',
    language_id: LANG_ID,
    code: 'DA_M01',
    slug: 'numpy-fundamentos',
    title: 'NumPy: Computación Vectorizada y Arrays N-Dimensionales',
    objective: 'Reemplazar bucles lentos por operaciones vectorizadas en C mediante ndarrays de NumPy y broadcasting.',
    description: 'El pilar matemático de la ciencia de datos y el machine learning en Python: arrays contiguos en memoria y álgebra lineal.',
    folder: 'data_analytics/01_numpy',
    course_slug: 'data-analytics',
    position: 1,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 250 },
    sections: [
      {
        id: 'sec_da_01_01',
        code: 'S01',
        title: 'Arrays ndarray y Vectorización',
        slug: 'ndarray-vectorizacion',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_da_01_01',
            code: 'L01',
            title: 'NumPy ndarray vs Listas de Python',
            slug: 'numpy-ndarray-base',
            position: 1,
            concept_id: 'da-numpy',
            objective: 'Comprender por qué los arrays de NumPy son hasta 50x más veloces y consumen menos memoria que las listas estándar.',
            theory_markdown: `Las listas de Python almacenan punteros a objetos dispersos en la memoria. Un **array de NumPy (\`ndarray\`)** almacena datos del mismo tipo en un bloque de memoria contiguo en C.\n\nEsto habilita la **vectorización**: aplicar una operación matemática a millones de elementos simultáneamente sin escribir un solo bucle \`for\`.\n\n\`\`\`python\nimport numpy as np\narr = np.array([1, 2, 3, 4, 5])\nresultado = arr * 2  # Multiplica cada elemento instantáneamente en C\n\`\`\``,
            examples: [
              {
                title: 'Operaciones vectorizadas y funciones estadísticas',
                code: 'import numpy as np\n\nprecios = np.array([19.99, 45.50, 120.00, 89.90])\ncon_iva = precios * 1.16\nprint("Con IVA:", np.round(con_iva, 2))\nprint("Promedio:", np.mean(precios))\nprint("Máximo:", np.max(precios))',
                output: 'Con IVA: [ 23.19  52.78 139.2  104.28]\nPromedio: 68.8475\nMáximo: 120.0',
                explanation: 'np.mean y np.round operan en C sobre todo el bloque de datos a velocidad nativa.'
              }
            ],
            common_errors: 'Intentar mezclar tipos distintos en un array (ej: strings y números). NumPy forzará a que todos los elementos se conviertan al tipo más general (upcasting a string).',
            mini_exercise: {
              starter_code: 'import numpy as np\n# Crea un array con los números del 0 al 9 usando np.arange(10)\narr = ...\nprint(arr)',
              instructions: 'Usa np.arange(10).',
              solution: 'import numpy as np\narr = np.arange(10)\nprint(arr)'
            },
            key_takeaways: [
              'ndarray almacena tipos homogéneos contiguos en memoria.',
              'La vectorización elimina bucles for lentos en Python.',
              'np.arange, np.zeros, np.ones facilitan la creación de tensores.'
            ],
            exercise: {
              id: 'ex_da_01_01',
              type: 'predict_output',
              difficulty: 'easy',
              prompt: 'Si arr = np.array([10, 20, 30]), ¿cuál es el resultado de arr + 5?',
              options: [
                { id: 'a', text: 'array([15, 25, 35])' },
                { id: 'b', text: '[10, 20, 30, 5]' },
                { id: 'c', text: 'TypeError' },
                { id: 'd', text: 'array([10, 20, 30, 5])' }
              ],
              correct_option_id: 'a',
              explanation: 'Por la regla de broadcasting de NumPy, el escalar 5 se suma a cada elemento del array: [15, 25, 35].'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_da_01_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Cómo se le llama en NumPy a la capacidad de operar aritméticamente entre arrays de diferentes dimensiones compatibles sin copiar datos?',
        options: [
          { id: 'a', text: 'Broadcasting' },
          { id: 'b', text: 'Sharding' },
          { id: 'c', text: 'Pipelining' },
          { id: 'd', text: 'Overfitting' }
        ],
        correct_option_id: 'a',
        explanation: 'Broadcasting describe cómo NumPy trata matrices de diferentes formas durante operaciones aritméticas.'
      }
    ]
  },

  // M02
  {
    id: 'da_mod_02',
    language_id: LANG_ID,
    code: 'DA_M02',
    slug: 'pandas-series-dataframes',
    title: 'Pandas: Estructuras Series, DataFrames e Ingestión',
    objective: 'Cargar datasets masivos desde CSV, Excel y Parquet en DataFrames de Pandas, e inspeccionar con .head(), .info() y .describe().',
    description: 'La navaja suiza del analista de datos: tablas bidimensionales con índices etiquetados, selección por loc/iloc y profiling estadístico.',
    folder: 'data_analytics/02_pandas_series_df',
    course_slug: 'data-analytics',
    position: 2,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 280 },
    sections: [
      {
        id: 'sec_da_02_01',
        code: 'S01',
        title: 'DataFrames e Inspección Inicial',
        slug: 'dataframes-inspeccion',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_da_02_01',
            code: 'L01',
            title: 'Estructura de un DataFrame y Carga con read_csv',
            slug: 'dataframe-base',
            position: 1,
            concept_id: 'da-pandas',
            objective: 'Dominar la anatomía de un DataFrame: índice, columnas y tipos de datos (dtypes).',
            theory_markdown: `En **Pandas**, una columna individual es una **Series**, y una tabla completa es un **DataFrame**.\n\nTres métodos para entender cualquier dataset en 5 segundos:\n1. \`df.head(5)\`: Muestra las primeras 5 filas.\n2. \`df.info()\`: Revela tipos de datos (int64, float64, object), columnas y recuento de valores no nulos.\n3. \`df.describe()\`: Genera un resumen estadístico instantáneo (media, desviación estándar, percentiles 25%, 50%, 75%, mínimo y máximo).`,
            examples: [
              {
                title: 'Creación y análisis descriptivo de un DataFrame',
                code: 'import pandas as pd\n\ndata = {\n    "estudiante": ["Ana", "Carlos", "Elena", "Marcos"],\n    "calificacion": [95, 82, 90, 78],\n    "aprobado": [True, True, True, True]\n}\ndf = pd.DataFrame(data)\nprint(df.head(2))\nprint("\\nPromedio:", df["calificacion"].mean())',
                output: '  estudiante  calificacion  aprobado\n0        Ana            95      True\n1     Carlos            82      True\n\nPromedio: 86.25',
                explanation: 'Pandas combina etiquetas de filas y columnas con operaciones agregadas automáticas.'
              }
            ],
            common_errors: 'Confundir `.loc[]` (selección por nombre de etiqueta o condición booleana) con `.iloc[]` (selección por posición entera numérica).',
            mini_exercise: {
              starter_code: 'import pandas as pd\ndf = pd.DataFrame({"ventas": [100, 250, 400]})\n# Calcula el total de ventas con df["ventas"].sum()\ntotal = ...\nprint(total)',
              instructions: 'Usa df["ventas"].sum() para obtener 750.',
              solution: 'import pandas as pd\ndf = pd.DataFrame({"ventas": [100, 250, 400]})\ntotal = df["ventas"].sum()\nprint(total)'
            },
            key_takeaways: [
              'Un DataFrame es una tabla 2D compuesta por Series.',
              'pd.read_csv() y pd.read_parquet() ingieren datos a alta velocidad.',
              '.describe() calcula estadísticas de todas las columnas numéricas.'
            ],
            exercise: {
              id: 'ex_da_02_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué método de un DataFrame de Pandas debes usar para ver el tipo de dato de cada columna y si existen valores nulos?',
              options: [
                { id: 'a', text: 'df.info()' },
                { id: 'b', text: 'df.check()' },
                { id: 'c', text: 'df.summary()' },
                { id: 'd', text: 'df.types()' }
              ],
              correct_option_id: 'a',
              explanation: 'df.info() muestra el recuento de no nulos, los dtypes de cada columna y el uso de memoria RAM total.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_da_02_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Cuál es la diferencia entre df.loc[0] y df.iloc[0]?',
        options: [
          { id: 'a', text: 'loc busca por el nombre de la etiqueta del índice; iloc busca por la posición numérica entera de la fila' },
          { id: 'b', text: 'loc es solo para columnas e iloc para filas' },
          { id: 'c', text: 'iloc está obsoleto' },
          { id: 'd', text: 'Son exactamente idénticos en todos los casos' }
        ],
        correct_option_id: 'a',
        explanation: 'loc es label-based (basado en etiquetas) e iloc es integer-position based (basado en posiciones enteras 0-indexed).'
      }
    ]
  },

  // M03
  {
    id: 'da_mod_03',
    language_id: LANG_ID,
    code: 'DA_M03',
    slug: 'pandas-limpieza-transformacion',
    title: 'Limpieza de Datos (Data Wrangling) y Transformación',
    objective: 'Tratar valores nulos (isnull, dropna, fillna), corregir tipos de datos con astype/to_datetime y sanear cadenas de texto.',
    description: 'El 80% del tiempo de un científico de datos: convierte datasets desordenados y corruptos en fuentes analíticas confiables.',
    folder: 'data_analytics/03_pandas_limpieza',
    course_slug: 'data-analytics',
    position: 3,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 300 },
    sections: [
      {
        id: 'sec_da_03_01',
        code: 'S01',
        title: 'Manejo de Nulos y Transformación de Tipos',
        slug: 'nulos-y-tipos',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_da_03_01',
            code: 'L01',
            title: 'Detección e Imputación de NaN y Tipado con astype',
            slug: 'nulos-fillna-base',
            position: 1,
            concept_id: 'da-wrangling',
            objective: 'Detectar valores faltantes (NaN) e imputarlos con la media/mediana o eliminarlos con dropna.',
            theory_markdown: `En el mundo real, los datos vienen incompletos (\`NaN\` = Not a Number):\n- \`df.isnull().sum()\`: Cuenta cuántos nulos tiene cada columna.\n- \`df.dropna()\`: Descarta filas que contengan algún nulo (usar con precaución para no perder datos valiosos).\n- \`df["edad"].fillna(df["edad"].median(), inplace=True)\`: Imputa los nulos con la mediana para no distorsionar la distribución.\n- \`pd.to_datetime(df["fecha"])\`: Convierte cadenas de texto de fechas a objetos Timestamp de Pandas.`,
            examples: [
              {
                title: 'Limpieza de dataset con imputación estratégica',
                code: 'import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    "usuario": ["A", "B", "C"],\n    "edad": [25, np.nan, 35],\n    "sueldo": ["1000", "1500", "2000"]\n})\n# 1. Imputar edad con la media\ndf["edad"] = df["edad"].fillna(df["edad"].mean())\n# 2. Convertir sueldo a entero numérico\ndf["sueldo"] = df["sueldo"].astype(int)\nprint(df)',
                output: '  usuario  edad  sueldo\n0       A  25.0    1000\n1       B  30.0    1500\n2       C  35.0    2000',
                explanation: 'La edad faltante de B se reemplazó por 30.0 (media de 25 y 35) y sueldo se convirtió de string a int.'
              }
            ],
            common_errors: 'Hacer operaciones matemáticas en columnas numéricas que se leyeron como tipo `object` (string) porque contenían símbolos como "$" o comas. Debes limpiar el string antes de hacer `.astype(float)`.',
            mini_exercise: {
              starter_code: 'import pandas as pd\ns = pd.Series([10, None, 30])\n# Reemplaza el nulo con 0 usando fillna\ns_limpia = ...\nprint(s_limpia.tolist())',
              instructions: 'Usa s.fillna(0).',
              solution: 'import pandas as pd\ns = pd.Series([10, None, 30])\ns_limpia = s.fillna(0)\nprint(s_limpia.tolist())'
            },
            key_takeaways: [
              '.isnull().sum() revela la calidad de los datos.',
              'fillna(valor) reemplaza nulos; dropna() los elimina.',
              'astype() y pd.to_datetime() garantizan los tipos correctos para el análisis.'
            ],
            exercise: {
              id: 'ex_da_03_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué método de Pandas se utiliza para convertir una columna de texto con fechas (ej: "2026-03-15") a formato fecha nativo?',
              options: [
                { id: 'a', text: 'pd.to_datetime(df["columna"])' },
                { id: 'b', text: 'df["columna"].as_date()' },
                { id: 'c', text: 'df["columna"].format_time()' },
                { id: 'd', text: 'pd.cast_calendar()' }
              ],
              correct_option_id: 'a',
              explanation: 'pd.to_datetime es la función vectorizada de Pandas que parsea inteligentemente múltiples formatos de fecha a Timestamp.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_da_03_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Por qué al imputar datos faltantes a menudo se prefiere la mediana (median) sobre la media (mean)?',
        options: [
          { id: 'a', text: 'Porque la mediana es robusta frente a valores atípicos extremos (outliers)' },
          { id: 'b', text: 'Porque la media solo funciona con números negativos' },
          { id: 'c', text: 'Porque la mediana siempre es un número entero' },
          { id: 'd', text: 'Porque Pandas no soporta el cálculo de la media' }
        ],
        correct_option_id: 'a',
        explanation: 'En distribuciones con outliers extremos (ej: salarios de multimillonarios), la media se distorsiona; la mediana representa mucho mejor el centro real.'
      }
    ]
  },

  // M04
  {
    id: 'da_mod_04',
    language_id: LANG_ID,
    code: 'DA_M04',
    slug: 'pandas-agrupaciones-merges',
    title: 'Agrupaciones (groupby), Tablas Dinámicas y Merges',
    objective: 'Realizar análisis agregado con groupby y agg, crear tablas dinámicas con pivot_table y combinar fuentes de datos con merge y concat.',
    description: 'Une y agrega información como en SQL: cruces relacionales (inner, left, right), agregaciones por categoría y transformaciones cruzadas.',
    folder: 'data_analytics/04_pandas_agrupaciones',
    course_slug: 'data-analytics',
    position: 4,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 320 },
    sections: [
      {
        id: 'sec_da_04_01',
        code: 'S01',
        title: 'groupby y Cruces con merge',
        slug: 'groupby-y-merge',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_da_04_01',
            code: 'L01',
            title: 'El Paradigma Split-Apply-Combine y Relaciones SQL con merge',
            slug: 'groupby-merge-base',
            position: 1,
            concept_id: 'da-groupby',
            objective: 'Agrupar registros por categorías y combinar DataFrames mediante claves foráneas.',
            theory_markdown: `El patrón **Split-Apply-Combine** de \`groupby\`:\n1. **Split**: Divide los datos en grupos basados en los valores de una o más columnas (ej: por \`pais\` o \`departamento\`).\n2. **Apply**: Aplica una función a cada grupo (ej: \`mean()\`, \`sum()\`, \`count()\`).\n3. **Combine**: Une los resultados en un nuevo DataFrame.\n\nPara unir dos DataFrames como un \`JOIN\` de SQL usamos \`pd.merge(df1, df2, on="id_clave", how="inner")\` (\`how\` puede ser \`"inner"\`, \`"left"\`, \`"right"\` o \`"outer"\`).`,
            examples: [
              {
                title: 'Métricas agregadas por departamento',
                code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "depto": ["Ventas", "Ventas", "IT", "IT"],\n    "empleado": ["Ana", "Carlos", "Elena", "Marcos"],\n    "sueldo": [3000, 3500, 4200, 4800]\n})\nresumen = df.groupby("depto")["sueldo"].agg(["count", "mean", "max"])\nprint(resumen)',
                output: '        count    mean   max\ndepto                      \nIT          2  4500.0  4800\nVentas      2  3250.0  3500',
                explanation: 'agg(["count", "mean", "max"]) calcula múltiples métricas en una sola pasada.'
              }
            ],
            common_errors: 'Olvidar el parámetro `how="left"` al hacer merge, provocando que por defecto se use `inner` y se descarten filas que no tengan correspondencia en la tabla secundaria.',
            mini_exercise: {
              starter_code: 'import pandas as pd\ndf = pd.DataFrame({"ciudad": ["CDMX", "CDMX", "MVD"], "temp": [22, 24, 18]})\n# Agrupa por ciudad y calcula el promedio de temp\nprom = df.groupby("ciudad")["temp"].mean()\nprint(prom["CDMX"])',
              instructions: 'Calcula el promedio y verifica que en CDMX sea 23.0.',
              solution: 'import pandas as pd\ndf = pd.DataFrame({"ciudad": ["CDMX", "CDMX", "MVD"], "temp": [22, 24, 18]})\nprom = df.groupby("ciudad")["temp"].mean()\nprint(prom["CDMX"])'
            },
            key_takeaways: [
              'groupby divide el dataset por categorías para calcular métricas.',
              '.agg() permite calcular sum, mean, std simultáneamente.',
              'pd.merge() equivale a un JOIN relacional de SQL.'
            ],
            exercise: {
              id: 'ex_da_04_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué tipo de unión (how) en pd.merge conserva todas las filas del DataFrame izquierdo, rellenando con NaN si no hay coincidencia en el derecho?',
              options: [
                { id: 'a', text: 'how="left"' },
                { id: 'b', text: 'how="inner"' },
                { id: 'c', text: 'how="right"' },
                { id: 'd', text: 'how="cross"' }
              ],
              correct_option_id: 'a',
              explanation: 'Un LEFT JOIN (how="left") preserva la totalidad de los registros de la tabla izquierda sin pérdidas.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_da_04_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Cuál método de Pandas genera tablas dinámicas cruzadas equivalentes a las Pivot Tables de Excel o consultas multidimensionales?',
        options: [
          { id: 'a', text: 'df.pivot_table()' },
          { id: 'b', text: 'df.transpose()' },
          { id: 'c', text: 'df.cross_tabulate()' },
          { id: 'd', text: 'df.reshape()' }
        ],
        correct_option_id: 'a',
        explanation: 'pivot_table permite especificar values, index, columns y aggfunc para crear resúmenes multidimensionales.'
      }
    ]
  },

  // M05
  {
    id: 'da_mod_05',
    language_id: LANG_ID,
    code: 'DA_M05',
    slug: 'matplotlib-seaborn',
    title: 'Visualización Estática con Matplotlib y Seaborn',
    objective: 'Graficar distribuciones, correlaciones y tendencias con Matplotlib (fig, ax) y gráficos estadísticos de alto nivel con Seaborn.',
    description: 'Transforma tablas de números en revelaciones visuales impactantes: heatmaps, histogramas con KDE, boxplots y personalización estética.',
    folder: 'data_analytics/05_matplotlib_seaborn',
    course_slug: 'data-analytics',
    position: 5,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 320 },
    sections: [
      {
        id: 'sec_da_05_01',
        code: 'S01',
        title: 'La Interfaz Orientada a Objetos de Matplotlib y Seaborn',
        slug: 'matplotlib-y-seaborn',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_da_05_01',
            code: 'L01',
            title: 'Interfaz fig, ax en Matplotlib y Gráficos Estadísticos con Seaborn',
            slug: 'fig-ax-seaborn-base',
            position: 1,
            concept_id: 'da-visualization',
            objective: 'Dominar la creación de figuras profesionales con la arquitectura de subplots y paletas de Seaborn.',
            theory_markdown: `En lugar de usar el estilo procedural antiguo de pyplot (\`plt.plot()\`), los profesionales usan la **interfaz orientada a objetos**:\n\`\`\`python\nfig, ax = plt.subplots(figsize=(8, 5))\nax.plot(x, y, label="Tendencia")\nax.set_title("Ventas Trimestrales")\n\`\`\`\n\n**Seaborn** se construye encima de Matplotlib pero automatiza agregaciones estadísticas:\n- \`sns.histplot(df["edad"], kde=True)\`: Histograma con curva de densidad.\n- \`sns.boxplot(x="categoria", y="precio", data=df)\`: Detección visual de cuartiles y outliers.\n- \`sns.heatmap(df.corr(), annot=True, cmap="coolwarm")\`: Matriz de correlación visual.`,
            examples: [
              {
                title: 'Matriz de correlación con Seaborn',
                code: 'import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\n\ndf = pd.DataFrame({\n    "horas_estudio": [2, 4, 6, 8, 10],\n    "calificacion": [60, 70, 80, 92, 98]\n})\ncorrelacion = df.corr()\nprint(correlacion)',
                output: '               horas_estudio  calificacion\nhoras_estudio       1.000000      0.993414\ncalificacion        0.993414      1.000000',
                explanation: 'Una correlación de ~0.99 indica una relación lineal fuertemente positiva entre horas y nota.'
              }
            ],
            common_errors: 'No cerrar las figuras con `plt.close()` en scripts por lotes o servidores web, provocando consumo acumulativo de memoria RAM.',
            mini_exercise: {
              starter_code: '# Comando para mostrar la gráfica en pantalla\n# plt.show()',
              instructions: 'Recuerda que plt.show() abre la ventana interactiva.',
              solution: '# plt.show()'
            },
            key_takeaways: [
              'fig, ax = plt.subplots() es la arquitectura recomendada de Matplotlib.',
              'Seaborn agrega estética y soporte estadístico nativo a DataFrames.',
              'Los boxplots y heatmaps son herramientas fundamentales de diagnóstico.'
            ],
            exercise: {
              id: 'ex_da_05_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué tipo de gráfica de Seaborn es la más adecuada para visualizar la matriz de correlación entre múltiples variables numéricas?',
              options: [
                { id: 'a', text: 'sns.heatmap()' },
                { id: 'b', text: 'sns.lineplot()' },
                { id: 'c', text: 'sns.barplot()' },
                { id: 'd', text: 'sns.piechart()' }
              ],
              correct_option_id: 'a',
              explanation: 'Un mapa de calor (heatmap) codifica los coeficientes de correlación en una cuadrícula con gradiente de color.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_da_05_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué información revela visualmente un diagrama de caja y bigotes (boxplot)?',
        options: [
          { id: 'a', text: 'La mediana, los cuartiles Q1 y Q3, el rango intercuartílico y posibles valores atípicos (outliers)' },
          { id: 'b', text: 'La velocidad de la red' },
          { id: 'c', text: 'El porcentaje de memoria libre en la GPU' },
          { id: 'd', text: 'Únicamente el valor máximo del dataset' }
        ],
        correct_option_id: 'a',
        explanation: 'El boxplot sintetiza la distribución estadística de 5 números y señala los puntos fuera de 1.5 * IQR como outliers.'
      }
    ]
  },

  // M06
  {
    id: 'da_mod_06',
    language_id: LANG_ID,
    code: 'DA_M06',
    slug: 'plotly-interactivo',
    title: 'Visualización Interactiva Moderna con Plotly Express',
    objective: 'Construir gráficos web interactivos con zoom, pan, hover tooltips y mapas coropléticos usando Plotly Express.',
    description: 'Lleva tus datos al navegador: gráficos reactivos que permiten a directores y usuarios explorar cada punto con el cursor.',
    folder: 'data_analytics/06_plotly_interactivo',
    course_slug: 'data-analytics',
    position: 6,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 340 },
    sections: [
      {
        id: 'sec_da_06_01',
        code: 'S01',
        title: 'Plotly Express y Gráficos Reactivos',
        slug: 'plotly-express',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_da_06_01',
            code: 'L01',
            title: 'Gráficos Interactivos en Una Línea con px',
            slug: 'plotly-base',
            position: 1,
            concept_id: 'da-plotly',
            objective: 'Crear gráficos de dispersión multidimensionales con tooltips dinámicos.',
            theory_markdown: `A diferencia de Matplotlib (que produce imágenes estáticas PNG), **Plotly** genera gráficos basados en **D3.js y WebGL** renderizados directamente en el navegador.\n\nCon **Plotly Express (\`px\`)**, creas visualizaciones interactivas con hover, zoom y selección en una sola línea:\n\`\`\`python\nimport plotly.express as px\nfig = px.scatter(df, x="gdp", y="esperanza_vida", color="continente", hover_name="pais")\nfig.show()\n\`\`\``,
            examples: [
              {
                title: 'Exportación de gráfico interactivo a HTML',
                code: 'import plotly.express as px\nimport pandas as pd\n\ndf = pd.DataFrame({\n    "mes": ["Ene", "Feb", "Mar", "Abr"],\n    "ingresos": [12000, 15000, 18500, 22000]\n})\nfig = px.line(df, x="mes", y="ingresos", title="Crecimiento MRR", markers=True)\n# fig.write_html("reporte.html")\nprint("Gráfico Plotly configurado con título:", fig.layout.title.text)',
                output: 'Gráfico Plotly configurado con título: Crecimiento MRR',
                explanation: 'fig.write_html() genera un archivo HTML autónomo con todo el motor interactivo incluido.'
              }
            ],
            common_errors: 'Intentar renderizar gráficos de Plotly en terminales de texto sin un entorno gráfico o navegador compatible.',
            mini_exercise: {
              starter_code: '# Crea un gráfico de barras con px.bar(df, x="categoria", y="total")\n# fig.show()',
              instructions: 'Revisa la sintaxis de px.bar.',
              solution: '# px.bar listo'
            },
            key_takeaways: [
              'Plotly genera gráficos HTML interactivos basados en JavaScript.',
              'px.scatter, px.bar, px.line simplifican la API.',
              'Los gráficos pueden exportarse a HTML interactivo o integrarse en Streamlit.'
            ],
            exercise: {
              id: 'ex_da_06_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Cuál es la principal ventaja de Plotly frente a Matplotlib para reportes corporativos?',
              options: [
                { id: 'a', text: 'Permite interactividad en el navegador (zoom, hover sobre datos, filtrado dinámico)' },
                { id: 'b', text: 'Es un lenguaje de programación diferente' },
                { id: 'c', text: 'Solo funciona en servidores Linux' },
                { id: 'd', text: 'No permite exportar gráficos' }
              ],
              correct_option_id: 'a',
              explanation: 'Plotly genera visualizaciones interactivas donde el usuario puede pasar el cursor para ver detalles, aislar series y hacer zoom.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_da_06_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué método de un objeto Figure de Plotly permite guardar la gráfica como un archivo HTML interactivo completo?',
        options: [
          { id: 'a', text: 'fig.write_html("nombre.html")' },
          { id: 'b', text: 'fig.save_web()' },
          { id: 'c', text: 'fig.export_dom()' },
          { id: 'd', text: 'fig.to_browser()' }
        ],
        correct_option_id: 'a',
        explanation: 'write_html exporta la visualización lista para abrirse en cualquier navegador sin dependencias de Python.'
      }
    ]
  },

  // M07
  {
    id: 'da_mod_07',
    language_id: LANG_ID,
    code: 'DA_M07',
    slug: 'analisis-exploratorio-eda',
    title: 'Análisis Exploratorio de Datos (EDA) y Estadística',
    objective: 'Ejecutar una metodología científica de EDA: hipótesis de negocio, detección de outliers con IQR/Z-Score y pruebas de correlación.',
    description: 'Descubre la historia oculta detrás de los datos: distribuciones sesgadas, correlaciones espurias y preparación para modelado.',
    folder: 'data_analytics/07_eda_estadistica',
    course_slug: 'data-analytics',
    position: 7,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 350 },
    sections: [
      {
        id: 'sec_da_07_01',
        code: 'S01',
        title: 'Metodología EDA y Detección de Outliers',
        slug: 'metodologia-eda',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_da_07_01',
            code: 'L01',
            title: 'Detección de Valores Atípicos con Rango Intercuartílico (IQR)',
            slug: 'eda-iqr-outliers',
            position: 1,
            concept_id: 'da-eda',
            objective: 'Identificar y tratar outliers usando la regla matemática 1.5 * IQR.',
            theory_markdown: `Un **outlier** es un valor tan alejado del resto que puede distorsionar modelos estadísticos.\n\nLa técnica no paramétrica estándar es la regla del **Rango Intercuartílico (IQR)**:\n1. Calcula el percentil 25 (\`Q1\`) y el percentil 75 (\`Q3\`).\n2. \`IQR = Q3 - Q1\`.\n3. Límite inferior: \`Q1 - 1.5 * IQR\`.\n4. Límite superior: \`Q3 + 1.5 * IQR\`.\nCualquier observación fuera de estos límites se clasifica formalmente como outlier.`,
            examples: [
              {
                title: 'Cálculo de outliers con Pandas',
                code: 'import pandas as pd\n\ns = pd.Series([10, 12, 14, 15, 16, 18, 19, 100])  # 100 es un outlier claro\nq1 = s.quantile(0.25)\nq3 = s.quantile(0.75)\niqr = q3 - q1\nlimite_superior = q3 + 1.5 * iqr\noutliers = s[s > limite_superior]\nprint(f"Límite superior: {limite_superior}")\nprint(f"Outliers detectados: {outliers.tolist()}")',
                output: 'Límite superior: 25.5\nOutliers detectados: [100]',
                explanation: '100 supera el umbral de 25.5, siendo detectado inequívocamente como atípico.'
              }
            ],
            common_errors: 'Eliminar los outliers automáticamente sin investigar su origen. A menudo un outlier es el dato más valioso (por ejemplo, una transacción fraudulenta).',
            mini_exercise: {
              starter_code: '# Calcula el IQR de una serie con s.quantile(0.75) - s.quantile(0.25)\n# iqr = ...',
              instructions: 'Recuerda que IQR = Q3 - Q1.',
              solution: '# iqr = q3 - q1'
            },
            key_takeaways: [
              'EDA valida hipótesis antes de aplicar algoritmos complejos.',
              'IQR = Q3 - Q1 detecta anomalías de forma robusta.',
              'Los outliers deben analizarse antes de decidir si imputar o descartar.'
            ],
            exercise: {
              id: 'ex_da_07_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: 'En la detección de outliers con el método de Tukey, ¿cuál es el factor estándar que se multiplica por el IQR?',
              options: [
                { id: 'a', text: '1.5' },
                { id: 'b', text: '3.0' },
                { id: 'c', text: '0.5' },
                { id: 'd', text: '2.0' }
              ],
              correct_option_id: 'a',
              explanation: 'El factor 1.5 * IQR es la convención matemática estándar establecida por John Tukey.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_da_07_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué significa que dos variables tengan un coeficiente de correlación de Pearson de -0.92?',
        options: [
          { id: 'a', text: 'Existe una relación lineal inversa muy fuerte (cuando una variable sube, la otra baja)' },
          { id: 'b', text: 'No existe ninguna relación entre ellas' },
          { id: 'c', text: 'Hubo un error de cálculo porque la correlación no puede ser negativa' },
          { id: 'd', text: 'Que una variable causa directamente a la otra' }
        ],
        correct_option_id: 'a',
        explanation: 'Un valor cercano a -1.0 indica correlación lineal inversa muy marcada.'
      }
    ]
  },

  // M08
  {
    id: 'da_mod_08',
    language_id: LANG_ID,
    code: 'DA_M08',
    slug: 'sql-con-python',
    title: 'Consultas SQL con Python, SQLite y DuckDB',
    objective: 'Integrar consultas SQL en scripts de análisis con sqlite3, pandas.read_sql y acelerar consultas analíticas con DuckDB.',
    description: 'El puente entre analistas y bases de datos relacionales: ejecuta queries complejas directamente en memoria con DuckDB.',
    folder: 'data_analytics/08_sql_python',
    course_slug: 'data-analytics',
    position: 8,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 350 },
    sections: [
      {
        id: 'sec_da_08_01',
        code: 'S01',
        title: 'pandas.read_sql y DuckDB Analítico',
        slug: 'sql-y-duckdb',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_da_08_01',
            code: 'L01',
            title: 'Ejecución de SQL desde Python y DuckDB en Memoria',
            slug: 'sql-duckdb-base',
            position: 1,
            concept_id: 'da-sql',
            objective: 'Combinar la expresividad de SQL con el poder de transformación de Python.',
            theory_markdown: `Con \`pd.read_sql(query, conexion)\`, ejecutas una sentencia SQL en cualquier base de datos relacional y recibes el resultado inmediatamente como un DataFrame de Pandas.\n\nPara análisis de big data local, **DuckDB** es el "SQLite para analítica": un motor SQL columnar vectorial embebido en Python que procesa archivos Parquet y CSV de gigabytes en milisegundos usando todos los núcleos de tu procesador.`,
            examples: [
              {
                title: 'Consulta SQL analítica con SQLite y Pandas',
                code: 'import sqlite3\nimport pandas as pd\n\n# Base de datos en memoria\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE ventas (pais TEXT, monto REAL)")\nconn.execute("INSERT INTO ventas VALUES (\'México\', 1500), (\'México\', 2300), (\'Chile\', 1800)")\n\n# Query analítica directo a DataFrame\ndf = pd.read_sql("""\n    SELECT pais, COUNT(*) AS num_ventas, SUM(monto) AS total\n    FROM ventas\n    GROUP BY pais\n""", conn)\nprint(df)',
                output: '     pais  num_ventas   total\n0   Chile           1  1800.0\n1  México           2  3800.0',
                explanation: 'pd.read_sql transfiere los tipos y resultados de la consulta relacional a Pandas de forma transparente.'
              }
            ],
            common_errors: 'Concatenar variables de usuario directamente en strings de consulta SQL (vulnerabilidad SQL Injection). Siempre usa parámetros con tuplas: `cursor.execute("SELECT ... WHERE id = ?", (id_usuario,))`.',
            mini_exercise: {
              starter_code: '# Consulta básica con read_sql\n# df = pd.read_sql("SELECT * FROM tabla", conn)',
              instructions: 'Observa la sintaxis limpia de integración con read_sql.',
              solution: '# read_sql listo'
            },
            key_takeaways: [
              'pd.read_sql() ejecuta queries y entrega DataFrames.',
              'DuckDB procesa consultas analíticas columnares a velocidad extrema.',
              'Siempre parametriza las consultas para evitar inyección SQL.'
            ],
            exercise: {
              id: 'ex_da_08_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Por qué DuckDB es especialmente rápido para tareas de analítica frente a motores transaccionales tradicionales?',
              options: [
                { id: 'a', text: 'Porque es un motor orientado a columnas (column-oriented) y vectorizado' },
                { id: 'b', text: 'Porque no utiliza SQL' },
                { id: 'c', text: 'Porque no requiere memoria RAM' },
                { id: 'd', text: 'Porque solo corre en supercomputadoras' }
              ],
              correct_option_id: 'a',
              explanation: 'El almacenamiento columnar lee solo las columnas necesarias para la agregación sin cargar filas completas a memoria.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_da_08_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Cuál es la forma segura de prevenir SQL Injection al ejecutar consultas con el módulo sqlite3 en Python?',
        options: [
          { id: 'a', text: 'Pasar los parámetros como tupla separada en cursor.execute("SELECT ... WHERE id = ?", (id,))' },
          { id: 'b', text: 'Usar f-strings f"SELECT ... WHERE id = {id}"' },
          { id: 'c', text: 'Convertir todo el SQL a mayúsculas' },
          { id: 'd', text: 'Eliminar los espacios en blanco' }
        ],
        correct_option_id: 'a',
        explanation: 'Los placeholders (?) con parámetros vinculados separan la sintaxis SQL de los datos proporcionados por el usuario.'
      }
    ]
  },

  // M09
  {
    id: 'da_mod_09',
    language_id: LANG_ID,
    code: 'DA_M09',
    slug: 'scikit-learn-intro-ml',
    title: 'Introducción a Machine Learning con Scikit-Learn',
    objective: 'Construir el pipeline clásico de ML: división train/test, preprocesamiento con StandardScaler, Regresión Lineal y Clasificación con Random Forest.',
    description: 'Da el salto al aprendizaje automático: entrena tus primeros modelos predictivos y evalúa con precisión métricas reales (R2, MSE, Accuracy, F1).',
    folder: 'data_analytics/09_scikit_learn_ml',
    course_slug: 'data-analytics',
    position: 9,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 380 },
    sections: [
      {
        id: 'sec_da_09_01',
        code: 'S01',
        title: 'El Ciclo de Vida de Machine Learning en Scikit-Learn',
        slug: 'scikit-learn-pipeline',
        position: 1,
        type: 'theory',
        estimated_minutes: 22,
        xp_on_complete: 55,
        lessons: [
          {
            id: 'les_da_09_01',
            code: 'L01',
            title: 'Features, Target, train_test_split y fit/predict',
            slug: 'scikit-pipeline-base',
            position: 1,
            concept_id: 'da-ml',
            objective: 'Separar variables independientes (X) y dependiente (y), entrenar con .fit() y predecir con .predict().',
            theory_markdown: `En **Machine Learning Supervisado**:\n- **X (Features)**: Matriz con las variables predictoras (ej: metros cuadrados, habitaciones).\n- **y (Target)**: Vector con el valor que queremos predecir (ej: precio de la casa).\n\nPara no memorizar los datos (sobreajuste o **overfitting**), siempre dividimos el dataset con \`train_test_split\` (habitualmente 80% entrenamiento, 20% prueba).\n\nTodos los modelos de Scikit-Learn siguen la misma API universal y limpia:\n1. \`modelo.fit(X_train, y_train)\`: Entrena el modelo.\n2. \`predicciones = modelo.predict(X_test)\`: Realiza predicciones sobre datos nunca vistos.\n3. Evaluamos métricas (\`r2_score\` para regresión, \`accuracy_score\` para clasificación).`,
            examples: [
              {
                title: 'Modelo de regresión lineal simple',
                code: 'from sklearn.linear_model import LinearRegression\nimport numpy as np\n\n# Horas de estudio vs Calificación\nX = np.array([[1], [2], [3], [4], [5]])\ny = np.array([55, 65, 75, 85, 95])\n\nmodelo = LinearRegression()\nmodelo.fit(X, y)\n\n# Predecir para un estudiante que estudió 6 horas\nprediccion = modelo.predict([[6]])\nprint(f"Predicción para 6 horas: {prediccion[0]:.1f} pts")',
                output: 'Predicción para 6 horas: 105.0 pts',
                explanation: 'El modelo aprendió la pendiente de 10 puntos por hora adicional.'
              }
            ],
            common_errors: 'Fuga de datos (Data Leakage): ajustar un escalador (`StandardScaler.fit()`) con todo el dataset en lugar de usar solo el conjunto de entrenamiento (`X_train`).',
            mini_exercise: {
              starter_code: '# from sklearn.model_selection import train_test_split\n# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)',
              instructions: 'Revisa la división canónica 80/20.',
              solution: '# train_test_split listo'
            },
            key_takeaways: [
              'X es la matriz de features 2D; y es el vector objetivo 1D.',
              'train_test_split previene el sobreajuste evaluando datos no vistos.',
              '.fit() entrena y .predict() realiza inferencias.'
            ],
            exercise: {
              id: 'ex_da_09_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Por qué es indispensable separar el dataset en subconjuntos de entrenamiento (train) y prueba (test)?',
              options: [
                { id: 'a', text: 'Para evaluar la capacidad de generalización del modelo sobre datos nuevos y evitar overfitting' },
                { id: 'b', text: 'Porque Scikit-Learn no acepta datasets de más de 100 filas' },
                { id: 'c', text: 'Para reducir el tamaño del disco duro' },
                { id: 'd', text: 'Es un paso opcional sin impacto' }
              ],
              correct_option_id: 'a',
              explanation: 'Si evaluamos con los mismos datos con los que entrenamos, no sabemos si el modelo aprendió patrones o si solo memorizó el dataset.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_da_09_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Cuál métrica de evaluación se utiliza para medir el porcentaje de varianza explicada en un problema de regresión (varía típicamente entre 0 y 1)?',
        options: [
          { id: 'a', text: 'R² (Coeficiente de determinación)' },
          { id: 'b', text: 'Accuracy' },
          { id: 'c', text: 'F1-Score' },
          { id: 'd', text: 'Matriz de confusión' }
        ],
        correct_option_id: 'a',
        explanation: 'R² cuantifica qué proporción de la variabilidad del target es explicada por las features del modelo.'
      }
    ]
  },

  // M10
  {
    id: 'da_mod_10',
    language_id: LANG_ID,
    code: 'DA_M10',
    slug: 'streamlit-dashboards',
    title: 'Dashboards con Streamlit y Storytelling con Dataset Real',
    objective: 'Construir una aplicación web interactiva completa en Python con Streamlit, sliders reactivos, filtros en tiempo real y storytelling con datos.',
    description: 'El proyecto final de Análisis de Datos: convierte tus notebooks en una aplicación web interactiva lista para presentar a clientes y directivos.',
    folder: 'data_analytics/10_streamlit_dashboard',
    course_slug: 'data-analytics',
    position: 10,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 450 },
    sections: [
      {
        id: 'sec_da_10_01',
        code: 'S01',
        title: 'Construcción de Dashboards con Streamlit',
        slug: 'streamlit-app',
        position: 1,
        type: 'theory',
        estimated_minutes: 22,
        xp_on_complete: 55,
        lessons: [
          {
            id: 'les_da_10_01',
            code: 'L01',
            title: 'Widgets Reactivos en Streamlit: st.sidebar, st.dataframe y st.plotly_chart',
            slug: 'streamlit-base',
            position: 1,
            concept_id: 'da-streamlit',
            objective: 'Construir una aplicación analítica completa en un solo archivo Python sin tocar HTML ni JavaScript.',
            theory_markdown: `**Streamlit** es el estándar de oro para crear aplicaciones web de datos en minutos:\n- Cada vez que un usuario mueve un control deslizante (\`slider\`) o cambia un menú (\`selectbox\`), Streamlit re-ejecuta el script de arriba a abajo reactivamente.\n- \`st.title("Mi Dashboard")\`: Título principal.\n- \`st.sidebar.selectbox(...)\`: Controles de filtrado en la barra lateral.\n- \`st.plotly_chart(fig, use_container_width=True)\`: Renderiza visualizaciones interactivas de Plotly adaptadas al ancho de pantalla.`,
            examples: [
              {
                title: 'Estructura canónica de un dashboard Streamlit',
                code: 'import streamlit as st\nimport pandas as pd\nimport plotly.express as px\n\nst.title("Koda Analytics Hub")\nst.sidebar.header("Filtros")\n\ndf = pd.DataFrame({\n    "categoria": ["AI", "Web", "Cloud", "AI"],\n    "ventas": [120, 90, 80, 150]\n})\n\ncat = st.sidebar.selectbox("Filtrar por categoría", ["Todas"] + list(df["categoria"].unique()))\nif cat != "Todas":\n    df = df[df["categoria"] == cat]\n\nst.metric(label="Total Ventas", value=f"${df[\'ventas\'].sum():,}")\nst.dataframe(df)',
                output: 'Dashboard interactivo servido en http://localhost:8501',
                explanation: 'Streamlit convierte código de análisis Python en una interfaz web elegante y reactiva.'
              }
            ],
            common_errors: 'No cachear la carga de datasets pesados con `@st.cache_data`. Sin caché, mover un slider volverá a leer el archivo de disco cada vez.',
            mini_exercise: {
              starter_code: '# Comando para ejecutar una app Streamlit en la terminal\n# streamlit run app.py',
              instructions: 'Recuerda el comando de arranque de Streamlit.',
              solution: '# streamlit run app.py'
            },
            key_takeaways: [
              'Streamlit no requiere conocimientos de frontend (HTML/CSS/JS).',
              '@st.cache_data optimiza la carga de datos en memoria.',
              'Se integra nativamente con DataFrames de Pandas y figuras de Plotly.'
            ],
            exercise: {
              id: 'ex_da_10_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué decorador de Streamlit se utiliza para almacenar en caché los resultados de carga de un dataset pesado y evitar recargas lentas?',
              options: [
                { id: 'a', text: '@st.cache_data' },
                { id: 'b', text: '@st.memo' },
                { id: 'c', text: '@st.freeze' },
                { id: 'd', text: '@st.keep' }
              ],
              correct_option_id: 'a',
              explanation: '@st.cache_data es el decorador oficial y recomendado de Streamlit para cachear datos y cálculos puros.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_da_10_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Cómo reacciona Streamlit cuando un usuario interactúa con un widget (como mover un slider o elegir una opción)?',
        options: [
          { id: 'a', text: 'Re-ejecuta todo el script de Python de arriba hacia abajo con el nuevo valor del widget' },
          { id: 'b', text: 'Recarga la página completa del navegador con F5' },
          { id: 'c', text: 'Envía un correo al administrador' },
          { id: 'd', text: 'Detiene el servidor' }
        ],
        correct_option_id: 'a',
        explanation: 'El modelo de ejecución reactivo de Streamlit re-ejecuta el script completo aplicando el nuevo estado del widget de forma transparente.'
      }
    ]
  }
];
