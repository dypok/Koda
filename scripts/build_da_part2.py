# -*- coding: utf-8 -*-
"""
Script to generate Data Analytics modules 06 to 10 with 4 lessons and 6 calibrated questions each.
Enforces zero emojis, zero spoilers, and strict schema compliance.
"""

import json
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", "languages", "python", "modules", "data_analytics"))

MODULES = [
    {
        "dir": "06_plotly_interactivo",
        "module_json": {
            "id": "da_mod_06",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DA_M06",
            "slug": "plotly-interactivo",
            "course_slug": "data-analytics",
            "title": "Visualizacion Interactiva Moderna con Plotly Express",
            "objective": "Desarrollar graficos interactivos basados en D3.js/WebGL con zoom, tooltips hover y exportacion HTML/JSON.",
            "description": "Lleva la visualizacion de datos al siguiente nivel: interactividad web fluida, animaciones, facetas y mapas sin escribir JavaScript.",
            "position": 46,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_da_06_01",
                    "code": "S01",
                    "title": "Graficos Interactivos, Layouts y Exportacion con Plotly",
                    "slug": "graficos-interactivos-plotly",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 45,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_da_06_01",
                            "code": "L01",
                            "title": "Filosofia de Plotly y Plotly Express",
                            "slug": "filosofia-plotly-express",
                            "position": 1,
                            "concept_id": "da-plotly-intro",
                            "objective": "Comprender la arquitectura interactiva de Plotly basada en JSON y D3.js y utilizar la interfaz de alto nivel Plotly Express.",
                            "theory_markdown": "A diferencia de Matplotlib o Seaborn que generan imagenes de mapa de bits estaticas (PNG/JPG), **Plotly** genera graficos basados en **JavaScript (D3.js) y WebGL**.\n\n### Caracteristicas interactivas nativas\n- **Zoom y paneo:** Exploracion detallada arrastrando el raton.\n- **Tooltips dinámicos (Hover):** Al pasar el cursor sobre cualquier punto, barra o linea, se despliegan sus valores exactos.\n- **Aislamiento en leyendas:** Al hacer clic en un elemento de la leyenda, esa serie se oculta o aisla interactivamente.\n\n### Plotly Express (`px`)\nEs la interfaz declarativa y concisa de alto nivel para Python:\n```python\nimport plotly.express as px\n\nfig = px.scatter(df, x='ingresos', y='gastos', color='segmento')\nfig.show()\n```",
                            "examples": [
                                {
                                    "title": "Grafico de dispersion interactivo basico",
                                    "code": "import plotly.express as px\nimport pandas as pd\n\ndf = pd.DataFrame({\n    \"x\": [1, 2, 3, 4],\n    \"y\": [10, 11, 12, 13],\n    \"grupo\": [\"A\", \"A\", \"B\", \"B\"]\n})\nfig = px.scatter(df, x=\"x\", y=\"y\", color=\"grupo\", title=\"Dispersion Interactiva\")",
                                    "output": "Figura interactiva lista para renderizarse en navegador o Jupyter Notebook.",
                                    "explanation": "px.scatter infiere automaticamente la leyenda y los tooltips a partir de las columnas de Pandas."
                                }
                            ],
                            "common_errors": "Intentar usar Plotly en terminales sin entorno grafico o sin soporte de navegador, esperando ver una imagen por consola en vez de un servidor o archivo HTML.",
                            "mini_exercise": {
                                "instructions": "Crea una figura interactiva de lineas usando px.line con el DataFrame 'df', x='tiempo' e y='valor'.",
                                "starter_code": "import plotly.express as px\nimport pandas as pd\ndf = pd.DataFrame({\"tiempo\": [1, 2], \"valor\": [10, 20]})\n\n# Crea la figura con px.line\nfig = ...",
                                "solution": "fig = px.line(df, x=\"tiempo\", y=\"valor\")"
                            },
                            "key_takeaways": [
                                "Plotly produce graficos interactivos web en HTML/JavaScript sin escribir codigo JS.",
                                "Permite zoom, paneo, seleccion y filtrado por leyendas de serie.",
                                "Plotly Express (px) ofrece una API compacta y declarativa sobre DataFrames."
                            ],
                            "exercise": {
                                "id": "ex_da_06_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la diferencia principal entre un grafico generado por Seaborn y uno generado por Plotly?",
                                "options": [
                                    {"id": "a", "text": "Seaborn genera graficos estaticos como imagenes; Plotly genera graficos web interactivos con zoom, hover y tooltips en tiempo real."},
                                    {"id": "b", "text": "Plotly solo funciona con archivos de texto plano."},
                                    {"id": "c", "text": "Seaborn requiere internet para funcionar."},
                                    {"id": "d", "text": "Plotly no soporta DataFrames de Pandas."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Plotly se basa en D3.js y WebGL para renderizar elementos SVG interactivos en navegadores web, mientras que Seaborn genera graficos rasterizados o vectoriales estaticos."
                            }
                        },
                        {
                            "id": "les_da_06_02",
                            "code": "L02",
                            "title": "Graficos con Facetas y Dimension Temporal",
                            "slug": "facetas-dimension-temporal",
                            "position": 2,
                            "concept_id": "da-plotly-facets-animation",
                            "objective": "Descomponer visualizaciones complejas mediante subplots de facetas (facet_col) y anadir animaciones temporales.",
                            "theory_markdown": "Plotly Express simplifica la visualizacion multivariada mediante parametros nativos:\n\n### 1. Subplots por Facetas (`facet_col` y `facet_row`)\nPermite dividir una visualizacion en una cuadricula de subgraficos alineados por una variable categorica:\n```python\nfig = px.bar(\n    df, x='producto', y='ventas',\n    color='categoria',\n    facet_col='region',  # Una columna por region\n    category_orders={'region': ['Norte', 'Sur', 'Centro']}\n)\n```\n\n### 2. Animaciones con `animation_frame`\nSi el dataset contiene una dimension temporal (ej. anos o trimestres), Plotly Express anade automaticamente controles de reproduccion interactiva (Play, Pause y Slider de tiempo):\n```python\nfig = px.scatter(\n    df, x='pib_per_capita', y='esperanza_vida',\n    size='poblacion', color='continente',\n    animation_frame='anio',  # Slider interactivo temporal\n    hover_name='pais', log_x=True\n)\n```",
                            "examples": [
                                {
                                    "title": "Subplots interactivos segmentados por facetas",
                                    "code": "import plotly.express as px\nimport pandas as pd\n\ndf = pd.DataFrame({\n    \"dia\": [\"Lunes\", \"Martes\", \"Lunes\", \"Martes\"],\n    \"ventas\": [100, 150, 80, 200],\n    \"turno\": [\"Manana\", \"Manana\", \"Tarde\", \"Tarde\"]\n})\nfig = px.bar(df, x=\"dia\", y=\"ventas\", facet_col=\"turno\")",
                                    "output": "Dos columnas de graficos de barras alineadas con escalas comparables.",
                                    "explanation": "facet_col genera subgraficos consistentes compartiendo los ejes."
                                }
                            ],
                            "common_errors": "Usar animation_frame sobre una columna no ordenada o con tipos de datos mezclados, provocando saltos inconsistentes en la reproduccion temporal.",
                            "mini_exercise": {
                                "instructions": "Usa facet_col='categoria' en px.scatter para dividir la grafica por la variable 'categoria'.",
                                "starter_code": "import plotly.express as px\n# Completa px.scatter con facet_col\n# fig = px.scatter(df, x='x', y='y', ...)",
                                "solution": "fig = px.scatter(df, x=\"x\", y=\"y\", facet_col=\"categoria\")"
                            },
                            "key_takeaways": [
                                "facet_col y facet_row descomponen la visualizacion en subgraficos limpios.",
                                "animation_frame anade botones de reproduccion y controles deslizantes de tiempo.",
                                "Las facetas comparten escalas de forma predeterminada facilitando la comparacion."
                            ],
                            "exercise": {
                                "id": "ex_da_06_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que argumento de Plotly Express se utiliza para anadir un control interactivo de reproduccion (Play/Slider) a lo largo de los anos en un dataset?",
                                "options": [
                                    {"id": "a", "text": "animation_frame='anio'"},
                                    {"id": "b", "text": "time_slider='anio'"},
                                    {"id": "c", "text": "play_by='anio'"},
                                    {"id": "d", "text": "loop_dimension='anio'"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "animation_frame agrupa los datos en cuadros de animacion vinculados a controles de reproduccion en el navegador."
                            }
                        },
                        {
                            "id": "les_da_06_03",
                            "code": "L03",
                            "title": "Personalizacion con update_layout y update_traces",
                            "slug": "personalizacion-layout-traces",
                            "position": 3,
                            "concept_id": "da-plotly-styling",
                            "objective": "Personalizar temas visuales, tipografias, tooltips hover y configuracion de ejes mediante update_layout y update_traces.",
                            "theory_markdown": "Una figura de Plotly (`Figure`) se compone de dos elementos principales en su estructura JSON:\n1. **Traces (Trazas de datos):** Los puntos, lineas o barras individuales.\n2. **Layout (Diseno global):** Titulos, fuentes, fondo, ejes, margenes y leyendas.\n\n### Metodos de Personalizacion\n- **`fig.update_layout()`:**\n  ```python\n  fig.update_layout(\n      title={'text': 'Reporte Ejecutivo Q3', 'x': 0.5}, # Centrar titulo\n      template='plotly_white',  # Temas: plotly_dark, seaborn, simple_white\n      hovermode='x unified',     # Tooltip consolidado vertical\n      legend_title_text='Segmento'\n  )\n  ```\n- **`fig.update_traces()`:**\n  Modifica las propiedades de dibujo:\n  ```python\n  fig.update_traces(marker=dict(size=10, line=dict(width=1, color='DarkSlateGrey')))\n  ```\n- **Tooltips enriquecidos (`hover_data`):**\n  En la creacion con `px`: `hover_data=['id_cliente', 'margen_ganancia']`.",
                            "examples": [
                                {
                                    "title": "Personalizacion visual y tema oscuro",
                                    "code": "import plotly.express as px\nimport pandas as pd\n\ndf = pd.DataFrame({\"mes\": [\"Ene\", \"Feb\", \"Mar\"], \"ingreso\": [1000, 1500, 1300]})\nfig = px.bar(df, x=\"mes\", y=\"ingreso\")\nfig.update_layout(\n    title=\"Ingresos Mensuales\",\n    template=\"plotly_dark\",\n    xaxis_title=\"Mes del Ejercicio\",\n    yaxis_title=\"Monto (USD)\"\n)",
                                    "output": "Grafico estilizado con paleta oscura y titulos de ejes descriptivos.",
                                    "explanation": "update_layout modifica cualquier propiedad del contenedor sin reconstruir la figura."
                                }
                            ],
                            "common_errors": "Intentar modificar el titulo pasando argumentos desconocidos a px.bar en vez de usar title='...' o fig.update_layout(title=...).",
                            "mini_exercise": {
                                "instructions": "Usa fig.update_layout para cambiar el tema a 'plotly_white'.",
                                "starter_code": "import plotly.express as px\nfig = px.scatter(x=[1, 2], y=[3, 4])\n\n# Actualiza el template a 'plotly_white'\n",
                                "solution": "fig.update_layout(template=\"plotly_white\")"
                            },
                            "key_takeaways": [
                                "update_layout controla el diseno global, temas, margenes y leyendas.",
                                "update_traces modifica la apariencia geometrica de puntos, lineas y barras.",
                                "hovermode='x unified' muestra un unico tooltip comparativo al deslizar por el eje X."
                            ],
                            "exercise": {
                                "id": "ex_da_06_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual metodo de una figura de Plotly se utiliza para modificar propiedades globales del grafico como el tema visual (template) y las etiquetas de los ejes?",
                                "options": [
                                    {"id": "a", "text": "fig.update_layout()"},
                                    {"id": "b", "text": "fig.modify_style()"},
                                    {"id": "c", "text": "fig.set_appearance()"},
                                    {"id": "d", "text": "fig.configure_plot()"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "update_layout() es el metodo oficial para alterar la configuracion y estetica general del contenedor de la figura en Plotly."
                            }
                        },
                        {
                            "id": "les_da_06_04",
                            "code": "L04",
                            "title": "Exportacion a HTML, JSON y Embeds",
                            "slug": "exportacion-html-json-embeds",
                            "position": 4,
                            "concept_id": "da-plotly-export",
                            "objective": "Exportar figuras interactivas a archivos HTML autonomos, representaciones JSON para APIs y formatos estaticos.",
                            "theory_markdown": "Dado que las figuras de Plotly son serializables, se pueden distribuir mediante diferentes canales:\n\n1. **Exportar a archivo HTML autonomo (`write_html`):**\n   Genera un archivo `.html` autocontenido que puede enviarse por correo electronico o alojarse en un servidor web sin requerir Python:\n   ```python\n   fig.write_html('dashboard.html', include_plotlyjs='cdn')\n   ```\n   `include_plotlyjs='cdn'` descarga la libreria desde CDN reduciendo el tamano del archivo a pocos kilobytes.\n\n2. **Serializacion a JSON para APIs REST (`to_json`):**\n   Ideal para responder desde un backend FastAPI hacia un frontend React/Vue:\n   ```python\n   json_data = fig.to_json()\n   ```\n\n3. **Exportacion a imagen estatica (`write_image`):**\n   Requiere la libreria `kaleido`:\n   `fig.write_image('grafico.pdf', width=1200, height=800)`.",
                            "examples": [
                                {
                                    "title": "Guardado de reporte interactivo HTML ligero",
                                    "code": "import plotly.express as px\nimport pandas as pd\n\ndf = pd.DataFrame({\"categoria\": [\"A\", \"B\"], \"total\": [10, 20]})\nfig = px.pie(df, names=\"categoria\", values=\"total\", title=\"Distribucion\")\n# Exportar para entrega a cliente:\nfig.write_html(\"distribucion_interactiva.html\", include_plotlyjs=\"cdn\")",
                                    "output": "Archivo HTML interactivo creado con peso inferior a 15 KB.",
                                    "explanation": "Cualquier persona puede abrir el archivo en su navegador y explorar los datos interactivamente."
                                }
                            ],
                            "common_errors": "Usar include_plotlyjs=True por defecto, generando archivos HTML de mas de 3 MB con toda la libreria empaquetada cuando se podria referenciar via CDN.",
                            "mini_exercise": {
                                "instructions": "Guarda la figura 'fig' en un archivo HTML llamado 'grafico.html' usando include_plotlyjs='cdn'.",
                                "starter_code": "import plotly.express as px\nfig = px.bar(x=[1, 2], y=[3, 4])\n\n# Guarda en HTML\n",
                                "solution": "fig.write_html(\"grafico.html\", include_plotlyjs=\"cdn\")"
                            },
                            "key_takeaways": [
                                "fig.write_html() genera aplicaciones web interactivas autocontenidas.",
                                "include_plotlyjs='cdn' optimiza radicalmente el tamano de archivo.",
                                "fig.to_json() permite transmitir figuras directamente en APIs web modernas."
                            ],
                            "exercise": {
                                "id": "ex_da_06_04",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual metodo se utiliza para guardar un grafico de Plotly como un archivo interactivo que cualquier usuario pueda abrir en su navegador web sin tener Python instalado?",
                                "options": [
                                    {"id": "a", "text": "fig.write_html('archivo.html')"},
                                    {"id": "b", "text": "fig.save_web('archivo.html')"},
                                    {"id": "c", "text": "fig.export_browser('archivo.html')"},
                                    {"id": "d", "text": "fig.dump('archivo.html')"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "write_html() crea un documento HTML completo con el bundle JS necesario para mantener toda la interactividad nativa."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DA_M06",
            "module_slug": "plotly-interactivo",
            "course_slug": "data-analytics",
            "questions": [
                {
                    "id": "q_da_06_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual libreria de visualizacion de Python permite generar graficos nativamente interactivos (con zoom, pan y tooltips en navegador)?",
                    "options": [
                        {"id": "a", "text": "Plotly Express"},
                        {"id": "b", "text": "Matplotlib sin backends interactivos"},
                        {"id": "c", "text": "Seaborn clasico"},
                        {"id": "d", "text": "Pillow"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Plotly Express renderiza graficos basados en D3.js y WebGL disenados especificamente para interactividad web."
                },
                {
                    "id": "q_da_06_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "En Plotly Express, como se divide una visualizacion en subgraficos organizados por columnas segun una variable categorica?",
                    "options": [
                        {"id": "a", "text": "facet_col='nombre_columna'"},
                        {"id": "b", "text": "split_by='nombre_columna'"},
                        {"id": "c", "text": "grid_x='nombre_columna'"},
                        {"id": "d", "text": "columns='nombre_columna'"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "facet_col crea subplots en columnas independientes para cada categoria preservando la alineacion de ejes."
                },
                {
                    "id": "q_da_06_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que argumento de px.scatter permite anadir columnas adicionales de informacion al cuadro emergente que se muestra al pasar el cursor (tooltip)?",
                    "options": [
                        {"id": "a", "text": "hover_data=['col1', 'col2']"},
                        {"id": "b", "text": "tooltip_info=['col1', 'col2']"},
                        {"id": "c", "text": "popup_fields=['col1', 'col2']"},
                        {"id": "d", "text": "show_data=['col1', 'col2']"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "hover_data especifica la lista de columnas complementarias que seran inyectadas en la ventana flotante de inspeccion."
                },
                {
                    "id": "q_da_06_04",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que parametro de fig.write_html() reduce drasticamente el peso del archivo resultante cargando la biblioteca JavaScript desde internet?",
                    "options": [
                        {"id": "a", "text": "include_plotlyjs='cdn'"},
                        {"id": "b", "text": "compress=True"},
                        {"id": "c", "text": "minify=True"},
                        {"id": "d", "text": "light_mode=True"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "include_plotlyjs='cdn' evita incrustar los ~3MB del codigo fuente JS de Plotly directamente en el HTML, usando un enlace a CDN."
                },
                {
                    "id": "q_da_06_05",
                    "type": "predict_output",
                    "difficulty": "hard",
                    "prompt": "Como se exporta una figura de Plotly a una cadena de texto en formato JSON para ser consumida por un frontend web?",
                    "options": [
                        {"id": "a", "text": "fig.to_json()"},
                        {"id": "b", "text": "json.dump(fig)"},
                        {"id": "c", "text": "fig.export_json_string()"},
                        {"id": "d", "text": "str(fig)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "to_json() serializa la especificacion declarativa completa de la figura (data + layout) a un string JSON estandar."
                },
                {
                    "id": "q_da_06_06",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que comportamiento interactivo ofrece la leyenda de un grafico de Plotly en un navegador por defecto?",
                    "options": [
                        {"id": "a", "text": "Hacer clic en una serie de la leyenda la oculta o muestra dinamicamente en el grafico."},
                        {"id": "b", "text": "Elimina los datos de la memoria RAM del servidor."},
                        {"id": "c", "text": "Redirige al usuario al sitio web de Plotly."},
                        {"id": "d", "text": "Es una imagen estatica que no responde a clics."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Las leyendas en Plotly son interactivas: un solo clic oculta la serie y un doble clic aisla exclusivamente esa serie en pantalla."
                }
            ]
        }
    },
    {
        "dir": "07_eda_estadistica",
        "module_json": {
            "id": "da_mod_07",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DA_M07",
            "slug": "analisis-exploratorio-eda",
            "course_slug": "data-analytics",
            "title": "Analisis Exploratorio de Datos (EDA) y Estadistica",
            "objective": "Aplicar la metodologia de EDA para auditar calidad del dato, calcular metricas de dispersion, detectar outliers y evaluar correlaciones.",
            "description": "La ciencia detras de los datos: distribuciones parametricas vs robustas, regla de Tukey para outliers y correlacion de Pearson vs Spearman.",
            "position": 47,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_da_07_01",
                    "code": "S01",
                    "title": "Metodologia EDA, Medidas Robustas y Correlaciones",
                    "slug": "metodologia-eda-estadistica",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 55,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_da_07_01",
                            "code": "L01",
                            "title": "Metodologia del Analisis Exploratorio (EDA)",
                            "slug": "metodologia-analisis-exploratorio",
                            "position": 1,
                            "concept_id": "da-eda-methodology",
                            "objective": "Estructurar un flujo sistematico de EDA abarcando calidad de datos, analisis univariado, bivariado y multivariado.",
                            "theory_markdown": "El **Analisis Exploratorio de Datos (EDA)**, introducido por John Tukey, es la disciplina de investigar datasets para resumir sus caracteristicas esenciales a traves de estadistica y visualizaciones antes de modelar algoritmos predictivos.\n\n### Fases de un EDA Profesional\n1. **Entendimiento y Calidad del Dato:**\n   - Dimensiones (`shape`), nombres y tipos de columnas (`dtypes`).\n   - Conteo de nulos (`isna()`) y duplicados (`duplicated()`).\n2. **Analisis Univariado:**\n   - Estudio de cada variable de forma aislada.\n   - Variables categoricas: Frecuencias relativas y cardinalidad (`value_counts()`).\n   - Variables numericas: Distribucion, sesgo, simetria e histogramas.\n3. **Analisis Bivariado y Multivariado:**\n   - Cruces entre variables (categorica vs numerica con boxplots, numerica vs numerica con scatter y correlacion).",
                            "examples": [
                                {
                                    "title": "Auditoria rapida de cardinalidad categorica",
                                    "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"canal\": [\"Web\", \"Tienda\", \"Web\", \"Web\", \"App\"],\n    \"monto\": [100, 250, 80, 120, 300]\n})\nprint(df[\"canal\"].value_counts(normalize=True) * 100)",
                                    "output": "Web       60.0\nTienda    20.0\nApp       20.0\nName: canal, dtype: float64",
                                    "explanation": "El canal Web representa el 60% de todas las transacciones del conjunto."
                                }
                            ],
                            "common_errors": "Comenzar a entrenar modelos de Machine Learning sin haber realizado un EDA previo, resultando en modelos con errores por nulos, tipos corruptos o outliers desapercibidos.",
                            "mini_exercise": {
                                "instructions": "Usa value_counts() para obtener las frecuencias absolutas de la columna 'categoria' en el DataFrame 'df'.",
                                "starter_code": "import pandas as pd\ndf = pd.DataFrame({\"categoria\": [\"A\", \"B\", \"A\"]})\n\n# Frecuencias\nfrecuencias = ...",
                                "solution": "frecuencias = df[\"categoria\"].value_counts()"
                            },
                            "key_takeaways": [
                                "El EDA precede obligatoriamente al modelado estadistico o predictivo.",
                                "El analisis univariado comprende la forma de cada variable aislada.",
                                "El analisis bivariado y multivariado descubre relaciones y patrones cruzados."
                            ],
                            "exercise": {
                                "id": "ex_da_07_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es el objetivo primordial del Analisis Exploratorio de Datos (EDA) en un proyecto de analitica?",
                                "options": [
                                    {"id": "a", "text": "Comprender la estructura, distribuciones, anomalias y relaciones subyacentes en los datos para formular hipotesis y guiar el modelado."},
                                    {"id": "b", "text": "Publicar la base de datos en un servidor de produccion inmediatamente."},
                                    {"id": "c", "text": "Borrar todas las columnas que tengan mas de 10 valores unicos."},
                                    {"id": "d", "text": "Reemplazar el uso de bases de datos relacionales por archivos de texto."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El EDA audita la calidad de la informacion y extrae insights visuales y estadisticos que fundamentan las decisiones analiticas."
                            }
                        },
                        {
                            "id": "les_da_07_02",
                            "code": "L02",
                            "title": "Medidas de Tendencia Central, Dispersion y Sesgo",
                            "slug": "tendencia-central-dispersion-sesgo",
                            "position": 2,
                            "concept_id": "da-eda-descriptive-stats",
                            "objective": "Calcular e interpretar media, mediana, desviacion estandar, rango intercuartilico y comprender el impacto del sesgo.",
                            "theory_markdown": "### Tendencia Central: Parametrica vs Robusta\n- **Media (`mean`):** Promedio aritmetico. Muy sensible a valores extremos.\n- **Mediana (`median`):** Percentil 50. Robusta ante valores atipicos.\n- **Regla del Sesgo (Skewness):**\n  - `Media ≈ Mediana`: Distribucion simetrica (Gaussiana).\n  - `Media > Mediana`: Sesgo a la derecha (asimetria positiva, cola larga a valores altos, ej. salarios).\n  - `Media < Mediana`: Sesgo a la izquierda (asimetria negativa).\n\n### Medidas de Dispersion\n- **Varianza y Desviacion Estandar (`std`):** Dispersion respecto a la media. Sensibles a outliers.\n- **Rango Intercuartilico (`IQR = Q3 - Q1`):** Mide el rango del 50% central de los datos. Metrica de dispersion robusta.",
                            "examples": [
                                {
                                    "title": "Demostracion de distorsion de la media por un outlier",
                                    "code": "import numpy as np\n\nsalarios = np.array([2000, 2200, 2100, 1900, 2300, 2000, 50000]) # 50000 es el CEO\nprint(\"Media distorsionada:\", np.mean(salarios))\nprint(\"Mediana representativa:\", np.median(salarios))",
                                    "output": "Media distorsionada: 8928.57\nMediana representativa: 2100.0",
                                    "explanation": "La media casi cuadruplica el salario del trabajador comun; la mediana describe fielmente el centro de la distribucion."
                                }
                            ],
                            "common_errors": "Reportar unicamente la media en distribuciones fuertemente sesgadas (como ingresos o precios de vivienda) sin comprobar la mediana o el IQR.",
                            "mini_exercise": {
                                "instructions": "Calcula el percentil 75 (Q3) de la serie 'datos' usando el metodo .quantile(0.75).",
                                "starter_code": "import pandas as pd\ndatos = pd.Series([10, 20, 30, 40, 50, 60])\n\n# Calcula q3\nq3 = ...",
                                "solution": "q3 = datos.quantile(0.75)"
                            },
                            "key_takeaways": [
                                "La media es sensible a extremos; la mediana es robusta y resistente.",
                                "Si Media > Mediana la distribucion presenta sesgo positivo hacia la derecha.",
                                "El Rango Intercuartilico (IQR = Q3 - Q1) describe la dispersion del 50% central."
                            ],
                            "exercise": {
                                "id": "ex_da_07_02",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Si en un dataset de precios de venta la media es de 500,000 USD y la mediana es de 220,000 USD, que revela esta relacion sobre la distribucion?",
                                "options": [
                                    {"id": "a", "text": "La distribucion presenta un fuerte sesgo a la derecha (asimetria positiva), provocada por propiedades de valores extremadamente altos."},
                                    {"id": "b", "text": "La distribucion es perfectamente simetrica y sigue una campana de Gauss normal."},
                                    {"id": "c", "text": "Existe un error en el calculo porque la media nunca puede ser mayor que la mediana."},
                                    {"id": "d", "text": "Todos los precios del dataset son exactamente iguales."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Cuando la media supera sustancialmente a la mediana, los valores extremos superiores arrastran la media hacia la derecha."
                            }
                        },
                        {
                            "id": "les_da_07_03",
                            "code": "L03",
                            "title": "Deteccion y Tratamiento de Outliers",
                            "slug": "deteccion-tratamiento-outliers",
                            "position": 3,
                            "concept_id": "da-eda-outliers-detection",
                            "objective": "Identificar valores atipicos usando el metodo del Rango Intercuartilico (Regla de Tukey) y Z-Score.",
                            "theory_markdown": "Un **Outlier** (valor atipico) es una observacion numerica que difiere notablemente del patron general del resto de los datos.\n\n### 1. Metodo del Rango Intercuartilico (Regla de Tukey)\nNo asume que los datos sigan una distribucion normal:\n- Se calcula el primer cuartil ($Q_1$) y el tercer cuartil ($Q_3$).\n- $IQR = Q_3 - Q_1$\n- **Limite Inferior:** $Q_1 - 1.5 \\times IQR$\n- **Limite Superior:** $Q_3 + 1.5 \\times IQR$\nCualquier observacion fuera de este intervalo se clasifica como valor atipico.\n\n### 2. Metodo del Z-Score (Para distribuciones normales)\nMide a cuantas desviaciones estandar se encuentra un punto de la media:\n$$Z = \\frac{X - \\mu}{\\sigma}$$\nFrecuentemente se consideran outliers aquellos puntos con $|Z| > 3$.",
                            "examples": [
                                {
                                    "title": "Identificacion de outliers con la regla de Tukey",
                                    "code": "import pandas as pd\n\ndatos = pd.Series([10, 12, 14, 15, 16, 18, 20, 100]) # 100 es atipico\nq1 = datos.quantile(0.25)\nq3 = datos.quantile(0.75)\niqr = q3 - q1\nlimite_superior = q3 + 1.5 * iqr\noutliers = datos[datos > limite_superior]\nprint(\"Limite superior:\", limite_superior)\nprint(\"Valores atipicos detectados:\", outliers.tolist())",
                                    "output": "Limite superior: 26.5\nValores atipicos detectados: [100]",
                                    "explanation": "El valor 100 supera el umbral de 26.5 y queda marcado como outlier con precision matematica."
                                }
                            ],
                            "common_errors": "Eliminar automaticamente todos los outliers detectados sin investigar su naturaleza; muchos outliers son fraudes reales o descubrimientos criticos de negocio.",
                            "mini_exercise": {
                                "instructions": "Calcula el limite superior de Tukey dado q3=50 e iqr=20 (limite = q3 + 1.5 * iqr).",
                                "starter_code": "q3 = 50\niqr = 20\n# Calcula limite_sup\nlimite_sup = ...",
                                "solution": "limite_sup = q3 + 1.5 * iqr"
                            },
                            "key_takeaways": [
                                "La regla de Tukey clasifica outliers fuera de [Q1 - 1.5*IQR, Q3 + 1.5*IQR].",
                                "Z-Score asume normalidad y detecta anomalias tipicamente cuando |Z| > 3.",
                                "Un outlier no debe borrarse ciegamente sin evaluar el contexto de negocio."
                            ],
                            "exercise": {
                                "id": "ex_da_07_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Segun la regla de Tukey basada en el Rango Intercuartilico (IQR), cual es la formula para determinar el limite inferior mas alla del cual un dato es considerado outlier?",
                                "options": [
                                    {"id": "a", "text": "Q1 - 1.5 * IQR"},
                                    {"id": "b", "text": "Media - 2 * Desviacion Estandar"},
                                    {"id": "c", "text": "Q3 - 3.0 * IQR"},
                                    {"id": "d", "text": "Q1 / 2"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El umbral inferior estandar de Tukey se ubica a 1.5 veces la amplitud del rango intercuartilico por debajo del primer cuartil (Q1)."
                            }
                        },
                        {
                            "id": "les_da_07_04",
                            "code": "L04",
                            "title": "Analisis de Correlacion: Pearson vs Spearman",
                            "slug": "correlacion-pearson-spearman",
                            "position": 4,
                            "concept_id": "da-eda-correlation",
                            "objective": "Distinguir entre relaciones lineales (Pearson) y monotonicas no lineales (Spearman), y comprender que correlacion no implica causalidad.",
                            "theory_markdown": "### Pearson vs Spearman\n1. **Correlacion de Pearson ($r$):**\n   Mide exclusivamente la fuerza de una **asociacion lineal** entre dos variables continuas distribuidas normalmente.\n   - Rango: $[-1, 1]$.\n   - Si la relacion es no lineal (ej. exponencial o cuadratica), Pearson puede ser cercano a cero aunque exista una dependencia estricta.\n\n2. **Correlacion de Spearman ($\\rho$):**\n   Mide **relaciones monotonicas** (si una variable crece, la otra siempre crece, aunque no sea a tasa constante).\n   - Aplica Pearson sobre los **rangos u ordenes de los datos**, haciendola robusta frente a outliers y relaciones no lineales.\n\n### Principio Epistemologico Esencial\n**Correlacion NO implica causalidad.** Que dos variables presenten un coeficiente de 0.95 puede deberse a pura casualidad (correlacion espuria) o a una tercera variable confusora oculta.",
                            "examples": [
                                {
                                    "title": "Comparacion de Pearson vs Spearman en relacion no lineal",
                                    "code": "import pandas as pd\n\nx = [1, 2, 3, 4, 5, 6, 7]\ny = [1, 4, 9, 16, 25, 36, 49]  # y = x^2 (relacion monotonica perfecta no lineal)\n\ndf = pd.DataFrame({\"x\": x, \"y\": y})\nprint(\"Pearson:\", round(df[\"x\"].corr(df[\"y\"], method=\"pearson\"), 4))\nprint(\"Spearman:\", round(df[\"x\"].corr(df[\"y\"], method=\"spearman\"), 4))",
                                    "output": "Pearson: 0.963\nSpearman: 1.0",
                                    "explanation": "Spearman detecta la relacion monotona perfecta (1.0), mientras que Pearson es menor debido a la curvatura."
                                }
                            ],
                            "common_errors": "Asumir que un coeficiente de correlacion de Pearson de 0.0 significa que no hay relacion entre las variables, ignorando posibles patrones cuadraticos o sinusoidales.",
                            "mini_exercise": {
                                "instructions": "Calcula la correlacion de Spearman entre las columnas 'x' e 'y' en df usando method='spearman'.",
                                "starter_code": "import pandas as pd\ndf = pd.DataFrame({\"x\": [1, 2, 3], \"y\": [2, 4, 10]})\n\n# Correlacion de Spearman\ncorr_spearman = ...",
                                "solution": "corr_spearman = df[\"x\"].corr(df[\"y\"], method=\"spearman\")"
                            },
                            "key_takeaways": [
                                "Pearson evalua exclusivamente relaciones lineales entre variables Gaussianas.",
                                "Spearman evalua relaciones monotonicas usando rangos y es robusto a outliers.",
                                "Correlacion alta no demuestra relacion de causa y efecto entre variables."
                            ],
                            "exercise": {
                                "id": "ex_da_07_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "En que escenario es preferible utilizar el coeficiente de correlacion de Spearman en lugar del coeficiente de Pearson?",
                                "options": [
                                    {"id": "a", "text": "Cuando las variables presentan relaciones monotonicas no lineales, escalas ordinales o presencia de valores atipicos significativos."},
                                    {"id": "b", "text": "Cuando los datos siguen una distribucion normal perfecta sin ningun outlier."},
                                    {"id": "c", "text": "Cuando se quiere calcular la varianza de una sola columna."},
                                    {"id": "d", "text": "Cuando el dataset tiene mas de un millon de filas obligatoriamente."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Spearman opera sobre el rango u orden relativo de las observaciones, capturando asociaciones monotonas independientemente de si la tasa de cambio es lineal o no."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DA_M07",
            "module_slug": "analisis-exploratorio-eda",
            "course_slug": "data-analytics",
            "questions": [
                {
                    "id": "q_da_07_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que metodo de una Serie de Pandas se utiliza durante el EDA univariado para contar la distribucion de frecuencias de una columna categorica?",
                    "options": [
                        {"id": "a", "text": "serie.value_counts()"},
                        {"id": "b", "text": "serie.count_all()"},
                        {"id": "c", "text": "serie.frequency()"},
                        {"id": "d", "text": "serie.enumerate()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "value_counts() devuelve el conteo ordenado de ocurrencias de cada valor unico presente en la Serie."
                },
                {
                    "id": "q_da_07_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Si una variable salarial tiene una media de 65,000 USD y una mediana de 35,000 USD, hacia donde apunta el sesgo (skewness) de la distribucion?",
                    "options": [
                        {"id": "a", "text": "Hacia la derecha (sesgo positivo, cola derecha extendida)"},
                        {"id": "b", "text": "Hacia la izquierda (sesgo negativo)"},
                        {"id": "c", "text": "No tiene sesgo, es perfectamente normal"},
                        {"id": "d", "text": "Hacia el centro exclusivamente"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Cuando la media es sustancialmente mayor que la mediana, los valores excepcionalmente elevados generan una cola hacia la derecha (asimetria positiva)."
                },
                {
                    "id": "q_da_07_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "En la regla de Tukey para deteccion de outliers, como se define matematicamente el Rango Intercuartilico (IQR)?",
                    "options": [
                        {"id": "a", "text": "IQR = Q3 - Q1"},
                        {"id": "b", "text": "IQR = Q2 - Q1"},
                        {"id": "c", "text": "IQR = Maximo - Minimo"},
                        {"id": "d", "text": "IQR = Media / Desviacion"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El IQR es la diferencia entre el percentil 75 (tercer cuartil Q3) y el percentil 25 (primer cuartil Q1)."
                },
                {
                    "id": "q_da_07_04",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "Dado Q3 = 60 y Q1 = 40, cual es el limite superior para identificar outliers segun la formula Q3 + 1.5 * IQR?",
                    "options": [
                        {"id": "a", "text": "90.0"},
                        {"id": "b", "text": "75.0"},
                        {"id": "c", "text": "100.0"},
                        {"id": "d", "text": "80.0"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "IQR = 60 - 40 = 20. El limite superior es 60 + (1.5 * 20) = 60 + 30 = 90.0."
                },
                {
                    "id": "q_da_07_05",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Cual coeficiente de correlacion se calcula aplicando la formula de Pearson sobre los rangos u ordenamientos de las observaciones en lugar de sus valores crudos?",
                    "options": [
                        {"id": "a", "text": "Coeficiente de Spearman"},
                        {"id": "b", "text": "Coeficiente de Pearson estandar"},
                        {"id": "c", "text": "Coeficiente R2"},
                        {"id": "d", "text": "Varianza poblacional"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "La correlacion de Spearman convierte los datos a sus rangos ordinales y calcula la asociacion lineal entre dichos rangos."
                },
                {
                    "id": "q_da_07_06",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que concluye la regla fundamental 'correlacion no implica causalidad' en el analisis estadistico?",
                    "options": [
                        {"id": "a", "text": "Que dos variables se muevan juntas estadisticamente no prueba cientificamente que una sea la causa directa de la otra, pues podria mediar una tercera variable confusora."},
                        {"id": "b", "text": "Que las correlaciones siempre son falsas e inútiles."},
                        {"id": "c", "text": "Que solo se deben analizar variables cualitativas."},
                        {"id": "d", "text": "Que la media siempre causa la mediana."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "La correlacion describe asociacion matematica concomitante, pero la causalidad exige experimentacion controlada para descartar variables de confusion o correlaciones espurias."
                }
            ]
        }
    },
    {
        "dir": "08_sql_python",
        "module_json": {
            "id": "da_mod_08",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DA_M08",
            "slug": "sql-con-python",
            "course_slug": "data-analytics",
            "title": "Consultas SQL con Python, SQLite y DuckDB",
            "objective": "Integrar SQL con Pandas usando sqlite3, extraer datos relacionales y ejecutar analitica OLAP ultrarrapida con DuckDB.",
            "description": "El puente entre bases de datos y Python: lectura nativa con read_sql_query, clausulas analiticas complejas y procesamiento columnar con DuckDB.",
            "position": 48,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_da_08_01",
                    "code": "S01",
                    "title": "Bases de Datos, Integracion Pandas y Motores OLAP",
                    "slug": "sql-pandas-duckdb",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_da_08_01",
                            "code": "L01",
                            "title": "Conexion SQL Nativa con sqlite3",
                            "slug": "conexion-nativa-sqlite3",
                            "position": 1,
                            "concept_id": "da-sql-sqlite3-native",
                            "objective": "Gestionar conexiones, cursores y transacciones seguras con parametros en el modulo nativo sqlite3.",
                            "theory_markdown": "Python incluye de fabrica el modulo **`sqlite3`**, un motor relacional embebido sin configuracion de servidor.\n\n### Ciclo de vida estandar\n1. `conn = sqlite3.connect('datos.db')`: Abre o crea el archivo de base de datos.\n2. `cursor = conn.cursor()`: Objeto para enviar instrucciones SQL.\n3. `cursor.execute(sql, parametros)`: Ejecuta sentencias SQL. **Siempre se deben usar tuplas de parametros `?` para prevenir SQL Injection**.\n4. Recuperacion de resultados:\n   - `cursor.fetchall()`: Lista de todas las filas como tuplas.\n   - `cursor.fetchone()`: Siguiente fila individual o `None`.\n5. `conn.commit()`: Confirma transacciones de escritura (INSERT, UPDATE, DELETE).\n6. `conn.close()`: Libera el descriptor de archivo.",
                            "examples": [
                                {
                                    "title": "Consulta parametrizada segura en sqlite3",
                                    "code": "import sqlite3\n\nconn = sqlite3.connect(\":memory:\") # Base de datos en RAM\ncursor = conn.cursor()\ncursor.execute(\"CREATE TABLE usuarios (id INT, nombre TEXT, saldo REAL)\")\ncursor.execute(\"INSERT INTO usuarios VALUES (?, ?, ?)\", (1, \"Ana\", 250.5))\nconn.commit()\n\ncursor.execute(\"SELECT * FROM usuarios WHERE saldo > ?\", (100.0,))\nfilas = cursor.fetchall()\nprint(filas)\nconn.close()",
                                    "output": "[(1, 'Ana', 250.5)]",
                                    "explanation": "El uso del marcador ? parametriza la consulta de forma inmune a inyeccion de codigo."
                                }
                            ],
                            "common_errors": "Concatenar variables directamente en strings SQL con f-strings (f'SELECT * WHERE id={id}'), creando vulnerabilidades criticas de SQL Injection.",
                            "mini_exercise": {
                                "instructions": "Usa sqlite3.connect(':memory:') para abrir una base de datos temporal en memoria RAM.",
                                "starter_code": "import sqlite3\n\n# Abre conexion en memoria\nconn = ...",
                                "solution": "import sqlite3\n\nconn = sqlite3.connect(\":memory:\")"
                            },
                            "key_takeaways": [
                                "sqlite3 viene integrado de forma nativa en la biblioteca estandar de Python.",
                                "Las consultas deben parametrizarse siempre usando el marcador ?.",
                                "conn.commit() consolida las escrituras y conn.close() libera la base de datos."
                            ],
                            "exercise": {
                                "id": "ex_da_08_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la forma correcta de ejecutar una consulta SQL con parametros variables en sqlite3 para evitar SQL Injection?",
                                "options": [
                                    {"id": "a", "text": "cursor.execute('SELECT * FROM clientes WHERE pais = ?', (pais_var,))"},
                                    {"id": "b", "text": "cursor.execute(f'SELECT * FROM clientes WHERE pais = \"{pais_var}\"')"},
                                    {"id": "c", "text": "cursor.execute('SELECT * FROM clientes WHERE pais = ' + pais_var)"},
                                    {"id": "d", "text": "cursor.execute('SELECT * FROM clientes').filter(pais=pais_var)"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El paso de tuplas de parametros mediante el marcador '?' delega el escape y tipado seguro al motor interno de SQLite."
                            }
                        },
                        {
                            "id": "les_da_08_02",
                            "code": "L02",
                            "title": "Integracion de Pandas con Bases de Datos SQL",
                            "slug": "integracion-pandas-sql",
                            "position": 2,
                            "concept_id": "da-sql-pandas-bridge",
                            "objective": "Leer consultas directamente a DataFrames con read_sql_query y persistir tablas con df.to_sql.",
                            "theory_markdown": "Pandas se integra directamente con conexiones SQL eliminando la conversion manual de tuplas:\n\n### 1. Ingestion con `pd.read_sql_query()`\nEjecuta la consulta y transforma el resultset directamente en un DataFrame con nombres de columnas y tipos inferidos:\n```python\nquery = \"SELECT producto, SUM(cantidad) AS total FROM ventas GROUP BY producto\"\ndf = pd.read_sql_query(query, conn)\n```\n\n### 2. Persistencia con `df.to_sql()`\nEscribe un DataFrame completo en una tabla SQL:\n```python\ndf.to_sql(\n    'reporte_ventas',\n    conn,\n    if_exists='replace', # 'fail' (defecto), 'replace' (recrea tabla) o 'append' (agrega filas)\n    index=False          # No guarda el indice de Pandas como columna SQL\n)\n```",
                            "examples": [
                                {
                                    "title": "Flujo bidireccional entre Pandas y SQL",
                                    "code": "import sqlite3\nimport pandas as pd\n\nconn = sqlite3.connect(\":memory:\")\ndf_origen = pd.DataFrame({\"id\": [1, 2], \"item\": [\"A\", \"B\"], \"precio\": [10.0, 20.0]})\n# Guardar a SQL:\ndf_origen.to_sql(\"items\", conn, if_exists=\"replace\", index=False)\n\n# Leer de SQL filtrando:\ndf_leido = pd.read_sql_query(\"SELECT * FROM items WHERE precio > 15\", conn)\nprint(df_leido)\nconn.close()",
                                    "output": "   id item  precio\n0   2    B    20.0",
                                    "explanation": "read_sql_query devuelve un DataFrame listo para analizar sin procesar cursores manualmente."
                                }
                            ],
                            "common_errors": "Olvidar index=False en df.to_sql(), creando una columna no deseada llamada 'index' o 'level_0' en la tabla relacional de destino.",
                            "mini_exercise": {
                                "instructions": "Usa pd.read_sql_query para ejecutar 'SELECT * FROM clientes' usando la conexion 'conn'.",
                                "starter_code": "import pandas as pd\n# Lee la tabla clientes con read_sql_query\n# df = ...",
                                "solution": "df = pd.read_sql_query(\"SELECT * FROM clientes\", conn)"
                            },
                            "key_takeaways": [
                                "pd.read_sql_query convierte resultados de sentencias SQL en DataFrames.",
                                "df.to_sql exporta tablas a motores relacionales con opciones replace o append.",
                                "index=False evita volcar indices numericos artificiales en la tabla de base de datos."
                            ],
                            "exercise": {
                                "id": "ex_da_08_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que opcion de if_exists en df.to_sql('tabla', conn, if_exists=...) se debe utilizar para insertar nuevos registros sin borrar los datos existentes?",
                                "options": [
                                    {"id": "a", "text": "if_exists='append'"},
                                    {"id": "b", "text": "if_exists='replace'"},
                                    {"id": "c", "text": "if_exists='fail'"},
                                    {"id": "d", "text": "if_exists='insert'"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "append agrega las nuevas filas al final de la tabla existente respetando el esquema previo."
                            }
                        },
                        {
                            "id": "les_da_08_03",
                            "code": "L03",
                            "title": "Consultas Analiticas: GROUP BY, HAVING y Funciones Ventana",
                            "slug": "consultas-analiticas-group-by-having",
                            "position": 3,
                            "concept_id": "da-sql-analytic-queries",
                            "objective": "Distinguir el filtrado antes y despues de agregacion (WHERE vs HAVING) y utilizar funciones ventana.",
                            "theory_markdown": "### La regla de oro: WHERE vs HAVING\n- **`WHERE`:** Filtra **filas individuales** antes de que ocurra la agrupacion.\n- **`HAVING`:** Filtra **grupos consolidados** despues de haber aplicado las funciones de agregacion (`COUNT`, `SUM`, `AVG`).\n\n```sql\nSELECT categoria, AVG(precio) AS precio_promedio\nFROM productos\nWHERE en_stock = 1       -- Filtra filas individuales primero\nGROUP BY categoria\nHAVING AVG(precio) > 100 -- Filtra los grupos resultantes\n```\n\n### Funciones Ventana (`OVER (PARTITION BY ...)`)\nCalculan valores agregados conservando las filas individuales (equivalente al `.transform()` de Pandas):\n```sql\nSELECT\n    id, categoria, precio,\n    AVG(precio) OVER(PARTITION BY categoria) AS promedio_cat,\n    ROW_NUMBER() OVER(PARTITION BY categoria ORDER BY precio DESC) AS ranking\nFROM productos;\n```",
                            "examples": [
                                {
                                    "title": "Consulta con HAVING en sqlite3",
                                    "code": "import sqlite3\nimport pandas as pd\n\nconn = sqlite3.connect(\":memory:\")\ndf = pd.DataFrame({\n    \"departamento\": [\"IT\", \"IT\", \"HR\", \"Ventas\", \"Ventas\"],\n    \"gasto\": [500, 700, 200, 800, 300]\n})\ndf.to_sql(\"gastos\", conn, index=False)\n\nsql = \"\"\"\nSELECT departamento, SUM(gasto) as total\nFROM gastos\nGROUP BY departamento\nHAVING SUM(gasto) > 600\n\"\"\"\nprint(pd.read_sql_query(sql, conn))",
                                    "output": "  departamento  total\n0           IT   1200\n1       Ventas   1100",
                                    "explanation": "El departamento HR tuvo un total de 200 y fue filtrado por la clausula HAVING."
                                }
                            ],
                            "common_errors": "Intentar usar una funcion agregadora como SUM o AVG dentro de la clausula WHERE (ej. WHERE SUM(ventas) > 100), arrojando un error de sintaxis SQL.",
                            "mini_exercise": {
                                "instructions": "Escribe una clausula HAVING que conserve unicamente los grupos donde COUNT(*) sea mayor o igual a 5.",
                                "starter_code": "-- Completa el HAVING\n-- HAVING ...",
                                "solution": "HAVING COUNT(*) >= 5"
                            },
                            "key_takeaways": [
                                "WHERE opera a nivel de fila individual; HAVING opera sobre grupos agregados.",
                                "HAVING requiere ir acompanado de una clausula GROUP BY.",
                                "Funciones ventana (OVER PARTITION BY) computan metricas analiticas sin colapsar filas."
                            ],
                            "exercise": {
                                "id": "ex_da_08_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Por que no es posible utilizar la condicion 'WHERE SUM(monto) > 500' en una consulta SQL estandar?",
                                "options": [
                                    {"id": "a", "text": "Porque WHERE se evalua antes de agrupar y desconoce las agregaciones; las condiciones sobre funciones agregadas deben colocarse en la clausula HAVING."},
                                    {"id": "b", "text": "Porque SQL no admite la funcion SUM."},
                                    {"id": "c", "text": "Porque el operador mayor que '>' esta prohibido en sentencias WHERE."},
                                    {"id": "d", "text": "Porque solo se pueden sumar cadenas de texto."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El orden logico de procesamiento de SQL evalua WHERE antes del GROUP BY; por tanto, para filtrar valores calculados por agregaciones se debe utilizar HAVING."
                            }
                        },
                        {
                            "id": "les_da_08_04",
                            "code": "L04",
                            "title": "Analitica OLAP Moderna con DuckDB",
                            "slug": "analitica-olap-duckdb",
                            "position": 4,
                            "concept_id": "da-sql-duckdb-olap",
                            "objective": "Ejecutar consultas SQL sobre DataFrames y archivos Parquet mediante DuckDB sin infraestructura de servidor.",
                            "theory_markdown": "Mientras que SQLite es un motor transaccional **OLTP** (orientado a filas), **DuckDB** es un motor analitico **OLAP** (orientado a columnas) disenado especificamente para ciencia de datos.\n\n### Caracteristicas revolucionarias de DuckDB\n1. **Zero-Copy con Pandas:** Puede consultar variables DataFrame de Python directamente dentro de sentencias SQL sin copiarlas a disco ni importarlas a tablas.\n2. **Ejecucion directa sobre Parquet:** Lee y filtra gigabytes de archivos `.parquet` directamente con ejecucion vectorizada multihilo sin cargarlos previamente en memoria.\n\n```python\nimport duckdb\nimport pandas as pd\n\ndf = pd.DataFrame({'edad': [25, 30, 45], 'salario': [2000, 3500, 5000]})\n\n# DuckDB reconoce 'df' en el entorno local directamente:\nresultado = duckdb.query('SELECT AVG(salario) AS media FROM df WHERE edad >= 30').to_df()\n```",
                            "examples": [
                                {
                                    "title": "Consulta SQL directa sobre DataFrame con DuckDB",
                                    "code": "import duckdb\nimport pandas as pd\n\ntransacciones = pd.DataFrame({\n    \"categoria\": [\"Tech\", \"Tech\", \"Moda\"],\n    \"precio\": [500, 800, 150]\n})\n# Consulta SQL nativa que retorna un nuevo DataFrame:\nres = duckdb.query(\"\"\"\n    SELECT categoria, COUNT(*) as ops, SUM(precio) as total\n    FROM transacciones\n    GROUP BY categoria\n\"\"\").to_df()\nprint(res)",
                                    "output": "  categoria  ops  total\n0      Tech    2   1300\n1      Moda    1    150",
                                    "explanation": "DuckDB procesa el DataFrame en memoria usando ejecucion columnar vectorizada en C++."
                                }
                            ],
                            "common_errors": "Creer que DuckDB requiere un servidor de base de datos escuchando en un puerto de red; DuckDB es un motor embebido que corre dentro del proceso de Python.",
                            "mini_exercise": {
                                "instructions": "Usa duckdb.query para seleccionar todas las filas del DataFrame 'datos' y convertirlas a DataFrame con .to_df().",
                                "starter_code": "import duckdb\nimport pandas as pd\ndatos = pd.DataFrame({\"a\": [1, 2]})\n\n# Consulta con duckdb\nresultado = ...",
                                "solution": "resultado = duckdb.query(\"SELECT * FROM datos\").to_df()"
                            },
                            "key_takeaways": [
                                "DuckDB es un motor analitico columnar embebido ('el SQLite para analitica').",
                                "Permite ejecutar SQL directamente sobre variables DataFrame de Pandas sin copias.",
                                "Consulta archivos Parquet masivos aprovechando vectorizacion y multi-threading nativo."
                            ],
                            "exercise": {
                                "id": "ex_da_08_04",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la ventaja fundamental de DuckDB frente a motores relacionales tradicionales como SQLite para tareas de analitica de datos?",
                                "options": [
                                    {"id": "a", "text": "Su arquitectura de almacenamiento columnar vectorizada optimizada para agregaciones masivas y su capacidad de consultar DataFrames de Pandas y archivos Parquet sin servidor."},
                                    {"id": "b", "text": "Que requiere instalar un cluster de Hadoop para funcionar."},
                                    {"id": "c", "text": "Que solo funciona en navegadores web."},
                                    {"id": "d", "text": "Que no soporta sentencias SQL estandar."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "DuckDB combina almacenamiento columnar OLAP con ejecucion multihilo en memoria y enlace nativo con Pandas y Parquet."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DA_M08",
            "module_slug": "sql-con-python",
            "course_slug": "data-analytics",
            "questions": [
                {
                    "id": "q_da_08_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual modulo de la biblioteca estandar de Python permite crear y operar bases de datos relacionales sin instalar servidores externos?",
                    "options": [
                        {"id": "a", "text": "sqlite3"},
                        {"id": "b", "text": "psycopg2"},
                        {"id": "c", "text": "sqlalchemy_core"},
                        {"id": "d", "text": "mysqldb"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "sqlite3 es el motor SQL embebido y autocontenido provisto de serie por el lenguaje Python."
                },
                {
                    "id": "q_da_08_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que metodo de Pandas lee una sentencia SELECT directamente a una estructura de DataFrame estructurada?",
                    "options": [
                        {"id": "a", "text": "pd.read_sql_query()"},
                        {"id": "b", "text": "pd.sql_to_df()"},
                        {"id": "c", "text": "pd.execute_sql()"},
                        {"id": "d", "text": "pd.load_table()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "pd.read_sql_query(sql, conn) ejecuta la consulta y construye el DataFrame mapeando columnas e infiriendo tipos."
                },
                {
                    "id": "q_da_08_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual clausula SQL se debe emplear para filtrar grupos de datos resultantes de un GROUP BY segun el valor de una funcion agregadora?",
                    "options": [
                        {"id": "a", "text": "HAVING"},
                        {"id": "b", "text": "WHERE"},
                        {"id": "c", "text": "FILTER BY"},
                        {"id": "d", "text": "ORDER GROUP"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "HAVING es la clausula especifica para filtrar grupos en base a condiciones agregadas (ej. HAVING COUNT(*) > 10)."
                },
                {
                    "id": "q_da_08_04",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "En una consulta SQL analitica, que efecto produce la instruccion AVG(precio) OVER(PARTITION BY categoria)?",
                    "options": [
                        {"id": "a", "text": "Calcula el promedio de la categoria y lo anade a cada fila sin colapsar el numero de registros de la tabla."},
                        {"id": "b", "text": "Agrupa la tabla reduciendola a una sola fila por categoria."},
                        {"id": "c", "text": "Elimina las categorias que no tengan precios validos."},
                        {"id": "d", "text": "Ordena alfabeticamente las categorias."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Las funciones ventana (OVER PARTITION BY) computan agregaciones dentro de particiones conservando la granularidad de fila original."
                },
                {
                    "id": "q_da_08_05",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Como permite DuckDB ejecutar consultas SQL sobre un DataFrame de Pandas llamado 'ventas'?",
                    "options": [
                        {"id": "a", "text": "Referenciando directamente el nombre de la variable 'ventas' dentro de la cadena SQL de duckdb.query('SELECT * FROM ventas') sin copias previas."},
                        {"id": "b", "text": "Exportando primero el DataFrame a un servidor PostgreSQL."},
                        {"id": "c", "text": "Convirtiendo el DataFrame a un archivo CSV en disco obligatorio."},
                        {"id": "d", "text": "DuckDB no puede interactuar con DataFrames de Pandas."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "DuckDB inspecciona el ambito local de Python e implementa zero-copy scanning para consultar DataFrames de Pandas directamente."
                },
                {
                    "id": "q_da_08_06",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Por que es peligroso concatenar variables de usuario mediante cadenas de texto f-strings en una consulta SQL?",
                    "options": [
                        {"id": "a", "text": "Porque expone a la aplicacion a ataques criticos de Inyeccion SQL (SQL Injection), permitiendo a terceros alterar o eliminar datos."},
                        {"id": "b", "text": "Porque Python duplica el uso de memoria."},
                        {"id": "c", "text": "Porque las f-strings no soportan variables numericas."},
                        {"id": "d", "text": "Porque SQLite solo admite lenguaje C."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Interpolar texto sin parametrizar permite a un atacante inyectar comandos SQL maliciosos que el motor ejecutara con plenos privilegios."
                }
            ]
        }
    },
    {
        "dir": "09_scikit_learn_ml",
        "module_json": {
            "id": "da_mod_09",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DA_M09",
            "slug": "scikit-learn-intro-ml",
            "course_slug": "data-analytics",
            "title": "Introduccion a Machine Learning con Scikit-Learn",
            "objective": "Comprender el flujo de Machine Learning supervisado: particion de datos, preprocesamiento sin data leakage, entrenamiento y evaluacion.",
            "description": "El framework predilecto de Machine Learning: API unificada fit/predict, escalado StandardScaler, codificacion OneHotEncoder y metricas.",
            "position": 49,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_da_09_01",
                    "code": "S01",
                    "title": "Flujo de Machine Learning y Evaluacion de Modelos",
                    "slug": "flujo-ml-evaluacion",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 55,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_da_09_01",
                            "code": "L01",
                            "title": "Flujo Supervisado y Division Train-Test",
                            "slug": "flujo-supervisado-train-test",
                            "position": 1,
                            "concept_id": "da-sklearn-supervised-split",
                            "objective": "Estructurar la matriz de caracteristicas X y el vector objetivo y, y particionar datos con train_test_split.",
                            "theory_markdown": "En el **Aprendizaje Supervisado**, el objetivo es aprender una funcion que mapea variables predictoras a una variable objetivo conocida a partir de ejemplos etiquetados.\n\n### Convencion de Nomenclatura\n- **`X` (Matriz 2D de Caracteristicas):** Filas con observaciones y columnas con variables predictoras continuas o categoricas.\n- **`y` (Vector 1D Objetivo):** Serie con la variable a predecir (valores continuos en Regresion; etiquetas discretas en Clasificacion).\n\n### Particion con `train_test_split`\nPara medir la capacidad de generalizacion del modelo ante datos nunca antes vistos y prevenir el sobreajuste (overfitting):\n```python\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y,\n    test_size=0.2,       # 20% para evaluacion, 80% para entrenamiento\n    random_state=42,     # Semilla para reproducibilidad estricta\n    stratify=y           # Mantiene la proporcion de clases en clasificacion\n)\n```",
                            "examples": [
                                {
                                    "title": "Separacion de variables y particion de datos",
                                    "code": "from sklearn.model_selection import train_test_split\nimport pandas as pd\n\ndf = pd.DataFrame({\n    \"edad\": [25, 45, 35, 50, 23],\n    \"ingreso\": [3000, 5000, 4000, 6000, 2800],\n    \"compro\": [0, 1, 0, 1, 0]\n})\nX = df[[\"edad\", \"ingreso\"]]\ny = df[\"compro\"]\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=42)\nprint(\"Filas train:\", len(X_train), \"Filas test:\", len(X_test))",
                                    "output": "Filas train: 3 Filas test: 2",
                                    "explanation": "Los conjuntos quedan divididos y listos para entrenar y evaluar de forma aislada."
                                }
                            ],
                            "common_errors": "Evaluar el modelo sobre los mismos datos utilizados durante el entrenamiento, obteniendo metricas optimistas enganosas debido al sobreajuste.",
                            "mini_exercise": {
                                "instructions": "Usa train_test_split para dividir X e y reservando un test_size=0.25 con random_state=42.",
                                "starter_code": "from sklearn.model_selection import train_test_split\n\n# Realiza la particion\n# X_tr, X_te, y_tr, y_te = ...",
                                "solution": "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)"
                            },
                            "key_takeaways": [
                                "X representa la matriz 2D de features e y el vector 1D target.",
                                "train_test_split aisla datos de test para medir generalizacion real.",
                                "random_state fija la semilla garantizando reproducibilidad experimental."
                            ],
                            "exercise": {
                                "id": "ex_da_09_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Por que es mandatorio evaluar un modelo de Machine Learning sobre un conjunto de prueba (test set) independiente?",
                                "options": [
                                    {"id": "a", "text": "Para medir la verdadera capacidad de generalizacion del modelo ante datos no vistos y detectar sobreajuste (overfitting)."},
                                    {"id": "b", "text": "Porque Scikit-Learn arroja un error si no se pasa test_size."},
                                    {"id": "c", "text": "Para duplicar el tamano del dataset."},
                                    {"id": "d", "text": "Para convertir variables numericas en categoricas."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Un modelo puede memorizar los datos de entrenamiento; solo evaluandolo en datos nunca vistos se prueba si aprendio patrones reales extrapolables."
                            }
                        },
                        {
                            "id": "les_da_09_02",
                            "code": "L02",
                            "title": "Preprocesamiento y Prevencion de Data Leakage",
                            "slug": "preprocesamiento-data-leakage",
                            "position": 2,
                            "concept_id": "da-sklearn-preprocessing-leakage",
                            "objective": "Aplicar escalado y codificacion categorica previniendo fugas de informacion mediante el patron fit_transform en train y transform en test.",
                            "theory_markdown": "Los modelos matematicos requieren que las variables numericas compartan escalas comparables y que las categoricas sean vectores numericos:\n\n1. **Escalado con `StandardScaler`:**\n   Estandariza restando la media y dividiendo por la desviacion estandar ($z = \\frac{x - \\mu}{\\sigma}$).\n2. **Codificacion Categorica con `OneHotEncoder`:**\n   Transforma categorias nominales en columnas binarias (dummies) evitando crear relaciones de orden ordinal falsas.\n\n### La Regla contra el Data Leakage (Fuga de Datos)\n**Los transformadores deben aprender (`fit`) exclusivamente sobre el conjunto de entrenamiento (`X_train`)**:\n- En entrenamiento: `X_train_scaled = scaler.fit_transform(X_train)` (calcula $\\mu$ y $\\sigma$ de train y escala).\n- En prueba: `X_test_scaled = scaler.transform(X_test)` (aplica la $\\mu$ y $\\sigma$ aprendidas en train sin ver test).\n\nNunca invoques `fit()` sobre `X_test` o sobre todo el dataset antes de la particion.",
                            "examples": [
                                {
                                    "title": "Escalado correcto sin fuga de informacion",
                                    "code": "from sklearn.preprocessing import StandardScaler\nimport numpy as np\n\nX_train = np.array([[10.0], [20.0], [30.0]])\nX_test = np.array([[15.0], [25.0]])\n\nscaler = StandardScaler()\n# 1. Aprender y transformar entrenamiento:\nX_train_sc = scaler.fit_transform(X_train)\n# 2. Solo transformar prueba (usando estadisticas de train):\nX_test_sc = scaler.transform(X_test)\nprint(\"Media aprendida:\", scaler.mean_[0])",
                                    "output": "Media aprendida: 20.0",
                                    "explanation": "X_test fue escalado usando la media (20.0) de X_train, preservando el aislamiento metodologico."
                                }
                            ],
                            "common_errors": "Invocar scaler.fit_transform(X) sobre todo el dataset antes de llamar a train_test_split, contaminando el conjunto de prueba con informacion global.",
                            "mini_exercise": {
                                "instructions": "Usa solo .transform(X_test) sobre el scaler ya entrenado para evitar fuga de datos.",
                                "starter_code": "from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\nscaler.fit(X_train)\n\n# Escala X_test\nX_test_esc = ...",
                                "solution": "X_test_esc = scaler.transform(X_test)"
                            },
                            "key_takeaways": [
                                "StandardScaler normaliza a media 0 y varianza unitaria.",
                                "OneHotEncoder convierte texto categorico en columnas indicadoras binarias.",
                                "fit_transform se usa exclusivamente en train; en test se usa unicamente transform."
                            ],
                            "exercise": {
                                "id": "ex_da_09_02",
                                "type": "single_choice",
                                "difficulty": "hard",
                                "prompt": "Por que es un error critico invocar scaler.fit(X_test) o scaler.fit_transform(X_test) sobre el conjunto de prueba?",
                                "options": [
                                    {"id": "a", "text": "Porque introduce Data Leakage (fuga de datos), ajustando la escala con estadisticas de prueba en lugar de evaluar el modelo en condiciones reales de datos ciegos."},
                                    {"id": "b", "text": "Porque StandardScaler arroja un SyntaxError al recibir datos de test."},
                                    {"id": "c", "text": "Porque convierte los numeros en cadenas de texto."},
                                    {"id": "d", "text": "Porque borra los coeficientes del modelo entrenado."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El preprocesamiento debe basarse unicamente en la informacion disponible en entrenamiento; aprender parametros de distribucion sobre el test set invalida la objetividad de la evaluacion."
                            }
                        },
                        {
                            "id": "les_da_09_03",
                            "code": "L03",
                            "title": "Entrenamiento de Modelos: La API fit/predict",
                            "slug": "entrenamiento-api-fit-predict",
                            "position": 3,
                            "concept_id": "da-sklearn-fit-predict-api",
                            "objective": "Entrenar modelos de clasificacion y regresion aprovechando la interfaz unificada de Scikit-Learn.",
                            "theory_markdown": "Scikit-Learn es reconocido mundialmente por su **API consistente y unificada** compartida por todos los estimadores:\n\n1. **Instanciacion:** Se crea el modelo configurando sus hiperparametros:\n   - `LinearRegression()` para prediccion continua.\n   - `LogisticRegression()` para clasificacion probabilistica binaria o multiclase.\n   - `DecisionTreeClassifier(max_depth=3)` para arboles interpretables.\n   - `RandomForestClassifier(n_estimators=100)` para ensamble de arboles.\n2. **Entrenamiento (`fit`):** `model.fit(X_train, y_train)` optimiza los parametros internos minimizando la funcion de costo.\n3. **Inferencia (`predict`):** `y_pred = model.predict(X_test)` genera las predicciones sobre datos nuevos.\n4. **Probabilidades (`predict_proba`):** En clasificacion, retorna las probabilidades por clase (`model.predict_proba(X_test)`).",
                            "examples": [
                                {
                                    "title": "Entrenamiento completo con Regresion Logistica",
                                    "code": "from sklearn.linear_model import LogisticRegression\nimport numpy as np\n\nX_train = np.array([[1], [2], [8], [9]])\ny_train = np.array([0, 0, 1, 1])\n\nmodelo = LogisticRegression()\nmodelo.fit(X_train, y_train)\npredicciones = modelo.predict([[1.5], [8.5]])\nprint(\"Predicciones para 1.5 y 8.5:\", predicciones)",
                                    "output": "Predicciones para 1.5 y 8.5: [0 1]",
                                    "explanation": "El estimador aprendio la frontera de decision y clasifico correctamente los dos nuevos puntos."
                                }
                            ],
                            "common_errors": "Pasar una Serie unidimensional a predict() sin remodelarla a matriz 2D con reshape(-1, 1) o como lista de listas [[valor]], provocando un ValueError.",
                            "mini_exercise": {
                                "instructions": "Instancia un modelo DecisionTreeClassifier con max_depth=5 y entrenalo con X_train e y_train.",
                                "starter_code": "from sklearn.tree import DecisionTreeClassifier\n\n# Instancia y entrena\n# modelo = ...\n# modelo.fit(...)",
                                "solution": "modelo = DecisionTreeClassifier(max_depth=5)\nmodelo.fit(X_train, y_train)"
                            },
                            "key_takeaways": [
                                "La API de Scikit-Learn utiliza fit() para aprender y predict() para inferir.",
                                "predict_proba() devuelve probabilidades calibradas en problemas de clasificacion.",
                                "Hiperparametros como max_depth controlan la complejidad y evitan sobreajuste."
                            ],
                            "exercise": {
                                "id": "ex_da_09_03",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual metodo de un estimador de Scikit-Learn ejecuta el algoritmo de optimizacion para ajustar los pesos del modelo a los datos de entrenamiento?",
                                "options": [
                                    {"id": "a", "text": "model.fit(X_train, y_train)"},
                                    {"id": "b", "text": "model.train(X_train, y_train)"},
                                    {"id": "c", "text": "model.learn(X_train)"},
                                    {"id": "d", "text": "model.optimize()"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "fit() es el metodo universal de la API de Scikit-Learn para entrenar cualquier modelo supervisado o no supervisado."
                            }
                        },
                        {
                            "id": "les_da_09_04",
                            "code": "L04",
                            "title": "Evaluacion de Modelos: Metricas de Clasificacion y Regresion",
                            "slug": "evaluacion-metricas-modelos",
                            "position": 4,
                            "concept_id": "da-sklearn-evaluation-metrics",
                            "objective": "Evaluar modelos usando Precision, Recall, F1-Score y Matriz de Confusion en clasificacion, y RMSE y R2 en regresion.",
                            "theory_markdown": "El rendimiento no se mide unicamente por la exactitud (Accuracy), especialmente con datos desbalanceados (ej. deteccion de fraudes con 99% de transacciones legitimas):\n\n### Metricas de Clasificacion\n- **Precision ($\\frac{TP}{TP + FP}$):** De los que el modelo predijo como positivos, cuantos lo eran realmente (minimizacion de falsos positivos).\n- **Recall / Sensibilidad ($\\frac{TP}{TP + FN}$):** De todos los positivos reales que existian, cuantos logro capturar el modelo (minimizacion de falsos negativos).\n- **F1-Score:** Media armonica entre Precision y Recall: $2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$.\n- **Matriz de Confusion (`confusion_matrix`):** Tabla cruzada de aciertos y errores.\n\n### Metricas de Regresion\n- **MAE (Mean Absolute Error):** Error medio absoluto directo.\n- **RMSE (Root Mean Squared Error):** Raiz del error cuadratico medio; penaliza fuertemente desvios grandes.\n- **$R^2$ (Coeficiente de Determinacion):** Porcentaje de la varianza explicada por el modelo ($1.0$ es perfecto).",
                            "examples": [
                                {
                                    "title": "Reporte de clasificacion y metricas de regresion",
                                    "code": "from sklearn.metrics import classification_report, r2_score\n\ny_true_clf = [1, 0, 1, 1, 0]\ny_pred_clf = [1, 0, 1, 0, 0]\nprint(classification_report(y_true_clf, y_pred_clf, zero_division=0))\n\ny_true_reg = [10.0, 20.0, 30.0]\ny_pred_reg = [11.0, 19.0, 29.5]\nprint(\"R2 Score:\", round(r2_score(y_true_reg, y_pred_reg), 4))",
                                    "output": "              precision    recall  f1-score   support\n           0       0.67      1.00      0.80         2\n           1       1.00      0.67      0.80         3\nR2 Score: 0.9888",
                                    "explanation": "classification_report desglosa Precision, Recall y F1 para cada clase por separado."
                                }
                            ],
                            "common_errors": "Confiar ciegamente en el Accuracy en datasets con clases altamente desbalanceadas, donde un modelo que prediga siempre la clase mayoritaria tendra 99% de acierto sin haber aprendido nada util.",
                            "mini_exercise": {
                                "instructions": "Calcula el coeficiente de determinacion r2_score entre y_test e y_pred.",
                                "starter_code": "from sklearn.metrics import r2_score\n\n# Calcula el r2\n# r2 = ...",
                                "solution": "r2 = r2_score(y_test, y_pred)"
                            },
                            "key_takeaways": [
                                "Accuracy es enganoso ante clases desbalanceadas.",
                                "Precision penaliza falsos positivos; Recall penaliza falsos negativos.",
                                "F1-Score sintetiza Precision y Recall; R2 evalua la varianza explicada en regresion."
                            ],
                            "exercise": {
                                "id": "ex_da_09_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "En un sistema de deteccion temprana de una enfermedad critica donde omitir un caso positivo (falso negativo) es fatal, que metrica se debe priorizar maximizar?",
                                "options": [
                                    {"id": "a", "text": "Recall (Sensibilidad)"},
                                    {"id": "b", "text": "Precision exclusivamente"},
                                    {"id": "c", "text": "R2 Score"},
                                    {"id": "d", "text": "Tiempo de ejecucion de la CPU"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Recall mide la capacidad del modelo para capturar todos los casos positivos reales existentes, minimizando los falsos negativos que en medicina representan enfermos no detectados."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DA_M09",
            "module_slug": "scikit-learn-intro-ml",
            "course_slug": "data-analytics",
            "questions": [
                {
                    "id": "q_da_09_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual es la funcion de train_test_split en el flujo estandar de Machine Learning?",
                    "options": [
                        {"id": "a", "text": "Dividir el conjunto de datos en subconjuntos disjuntos para entrenamiento y prueba, permitiendo validar la generalizacion del modelo."},
                        {"id": "b", "text": "Imputar valores nulos en el dataset."},
                        {"id": "c", "text": "Convertir texto a numeros flotantes."},
                        {"id": "d", "text": "Graficar la curva de aprendizaje."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "train_test_split desacopla los datos de entrenamiento de los de prueba para garantizar evaluaciones honestas sin sesgo de memorizacion."
                },
                {
                    "id": "q_da_09_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que transformador de Scikit-Learn escala variables continuas restando la media y dividiendo por la desviacion estandar?",
                    "options": [
                        {"id": "a", "text": "StandardScaler"},
                        {"id": "b", "text": "OneHotEncoder"},
                        {"id": "c", "text": "SimpleImputer"},
                        {"id": "d", "text": "NormalizerPCA"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "StandardScaler implementa la estandarizacion z-score centrando en media 0 y escalando a varianza 1."
                },
                {
                    "id": "q_da_09_03",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Cual es la regla fundamental para evitar Data Leakage al utilizar transformadores de preprocesamiento?",
                    "options": [
                        {"id": "a", "text": "Aprender parametros exclusivamente en X_train usando fit_transform(), y aplicar transform() en X_test sin recalcular estadisticas."},
                        {"id": "b", "text": "Usar fit_transform tanto en X_train como en X_test."},
                        {"id": "c", "text": "Escalar todo el dataset antes de llamar a train_test_split."},
                        {"id": "d", "text": "No utilizar escalado si hay mas de 3 columnas."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Los parametros del transformador (media, desviacion) deben provenir unicamente del conjunto de entrenamiento para no filtrar informacion de prueba al modelo."
                },
                {
                    "id": "q_da_09_04",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual metodo de un modelo entrenado en Scikit-Learn genera predicciones de salida para un nuevo conjunto de caracteristicas?",
                    "options": [
                        {"id": "a", "text": "model.predict(X_nuevos)"},
                        {"id": "b", "text": "model.forecast(X_nuevos)"},
                        {"id": "c", "text": "model.classify(X_nuevos)"},
                        {"id": "d", "text": "model.run(X_nuevos)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "predict() es el metodo universal de inferencia en toda la arquitectura de Scikit-Learn."
                },
                {
                    "id": "q_da_09_05",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "En un problema de clasificacion binaria con clases desbalanceadas (ej. 98% clase 0 y 2% clase 1), que metrica sintetiza el balance entre Precision y Recall?",
                    "options": [
                        {"id": "a", "text": "F1-Score"},
                        {"id": "b", "text": "Accuracy global"},
                        {"id": "c", "text": "R2 Score"},
                        {"id": "d", "text": "Varianza residual"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El F1-Score es la media armonica entre Precision y Recall, evitando las trampas del Accuracy en clases fuertemente desbalanceadas."
                },
                {
                    "id": "q_da_09_06",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que significa que un modelo de regresion lineal obtenga un coeficiente de determinacion R2 = 0.85?",
                    "options": [
                        {"id": "a", "text": "Que el modelo explica el 85% de la variabilidad de la variable objetivo en los datos evaluados."},
                        {"id": "b", "text": "Que el modelo acerto el 85% de las etiquetas discretas."},
                        {"id": "c", "text": "Que el margen de error promedio es del 15% en dolares."},
                        {"id": "d", "text": "Que el modelo tardo 0.85 segundos en entrenar."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "R2 mide la proporcion de varianza de la variable dependiente que es explicada o predicha por las variables independientes del modelo."
                }
            ]
        }
    },
    {
        "dir": "10_streamlit_dashboard",
        "module_json": {
            "id": "da_mod_10",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DA_M10",
            "slug": "streamlit-dashboards",
            "course_slug": "data-analytics",
            "title": "Dashboards con Streamlit y Storytelling con Dataset Real",
            "objective": "Construir aplicaciones analiticas web interactivas en Python puro con Streamlit, cache de datos y visualizaciones reactivas.",
            "description": "De scripts a aplicaciones web de impacto: layouts multipanel, widgets interactivos, cache inteligente con st.cache_data y storytelling con datos.",
            "position": 50,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_da_10_01",
                    "code": "S01",
                    "title": "Desarrollo de Dashboards Reactivos con Streamlit",
                    "slug": "dashboards-reactivos-streamlit",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_da_10_01",
                            "code": "L01",
                            "title": "Filosofia y Modelo de Ejecucion de Streamlit",
                            "slug": "filosofia-modelo-ejecucion",
                            "position": 1,
                            "concept_id": "da-streamlit-architecture",
                            "objective": "Comprender el modelo de ejecucion reactivo de arriba a abajo de Streamlit y levantar una aplicacion local.",
                            "theory_markdown": "**Streamlit** transforma scripts de Python ordinarios en aplicaciones web interactivas sin necesidad de escribir HTML, CSS ni JavaScript.\n\n### El Modelo de Ejecucion Reactivo\nEl paradigma de Streamlit es radicalmente simple:\n**Cada vez que un usuario interactua con cualquier widget (un slider, un boton, un dropdown), Streamlit re-ejecuta todo el archivo Python desde la primera linea hasta la ultima.**\n\nEste modelo elimina el manejo manual de callbacks y sincronizacion de estado complejo propio de otros frameworks web.\n\n### Ejecucion en consola\n```bash\nstreamlit run app.py\n```\nLevanta un servidor local (por defecto en `http://localhost:8501`) con recarga en caliente al guardar cambios en el codigo.",
                            "examples": [
                                {
                                    "title": "Primera aplicacion con Streamlit",
                                    "code": "import streamlit as st\nimport pandas as pd\n\nst.title(\"Dashboard de Analitica Koda\")\nst.write(\"Bienvenido a la plataforma interactiva de inteligencia de negocios.\")\n\ndf = pd.DataFrame({\"categoria\": [\"A\", \"B\", \"C\"], \"ventas\": [100, 250, 180]})\nst.dataframe(df)",
                                    "output": "Aplicacion web interactiva con titulo, texto y tabla con busqueda y ordenamiento nativo.",
                                    "explanation": "st.dataframe renderiza tablas interactivas de Pandas con capacidad de ordenamiento por columnas."
                                }
                            ],
                            "common_errors": "Intentar ejecutar una app de Streamlit con 'python app.py' en lugar de usar el comando de CLI 'streamlit run app.py', lo que impide levantar el servidor web reactivo.",
                            "mini_exercise": {
                                "instructions": "Usa st.title para definir el titulo principal de la aplicacion con el texto 'Reporte Ejecutivo'.",
                                "starter_code": "import streamlit as st\n\n# Define el titulo\n",
                                "solution": "import streamlit as st\n\nst.title(\"Reporte Ejecutivo\")"
                            },
                            "key_takeaways": [
                                "Streamlit convierte scripts de Python en interfaces web reactivas sin frontend.",
                                "El script se re-ejecuta de arriba a abajo ante cada interaccion de usuario.",
                                "Se lanza desde terminal con 'streamlit run app.py'."
                            ],
                            "exercise": {
                                "id": "ex_da_10_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es el modelo de ejecucion fundamental de una aplicacion desarrollada con Streamlit?",
                                "options": [
                                    {"id": "a", "text": "El script Python completo se re-ejecuta secuencialmente de arriba a abajo cada vez que el usuario interactua con un widget."},
                                    {"id": "b", "text": "Compila el codigo Python a bytecode de WebAssembly que corre en el navegador sin servidor."},
                                    {"id": "c", "text": "Requiere registrar listeners y manejadores de eventos manuales para cada boton."},
                                    {"id": "d", "text": "Solo se ejecuta una vez cuando el servidor inicia y nunca se vuelve a evaluar."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El modelo reactivo de Streamlit evalua todo el script de arriba a abajo en cada cambio de widget para mantener la vista sincronizada con el estado."
                            }
                        },
                        {
                            "id": "les_da_10_02",
                            "code": "L02",
                            "title": "Widgets Interactivos y Filtrado Reactivo",
                            "slug": "widgets-interactivos-filtrado",
                            "position": 2,
                            "concept_id": "da-streamlit-widgets",
                            "objective": "Integrar selectores, controles deslizantes y campos de entrada para filtrar DataFrames en tiempo real.",
                            "theory_markdown": "Los widgets de Streamlit retornan directamente el valor seleccionado por el usuario en tiempo real:\n\n- `st.selectbox('Etiqueta', opciones)`: Lista desplegable de seleccion unica.\n- `st.multiselect('Etiqueta', opciones, default=...)`: Seleccion multiple de elementos.\n- `st.slider('Etiqueta', min_val, max_val, valor_inicial)`: Barra deslizante numerica o de rangos.\n- `st.text_input('Buscar...')`: Entrada de texto libre.\n- `st.checkbox('Mostrar detalles')`: Casilla booleana.\n\n### Filtrado reactivo directo\n```python\ncategoria_sel = st.selectbox('Filtrar por Categoria', df['categoria'].unique())\ndf_filtrado = df[df['categoria'] == categoria_sel]\nst.dataframe(df_filtrado)\n```",
                            "examples": [
                                {
                                    "title": "Filtrado interactivo con slider",
                                    "code": "import streamlit as st\nimport pandas as pd\n\ndf = pd.DataFrame({\"producto\": [\"A\", \"B\", \"C\"], \"precio\": [50, 120, 300]})\nprecio_min = st.slider(\"Precio Minimo\", 0, 400, 100)\nfiltrados = df[df[\"precio\"] >= precio_min]\nst.write(f\"Productos con precio >= {precio_min}:\", len(filtrados))\nst.dataframe(filtrados)",
                                    "output": "La tabla se actualiza instantaneamente al deslizar la barra de precio.",
                                    "explanation": "precio_min captura el valor del slider e interactua directamente con la mascara booleana."
                                }
                            ],
                            "common_errors": "Crear bucles infinitos intentando modificar programaticamente el valor de un widget dentro del flujo de ejecucion del mismo widget sin usar session_state.",
                            "mini_exercise": {
                                "instructions": "Crea un slider con etiqueta 'Umbral', rango de 0 a 100 y valor inicial 50 usando st.slider.",
                                "starter_code": "import streamlit as st\n\n# Crea el slider\numbral = ...",
                                "solution": "umbral = st.slider(\"Umbral\", 0, 100, 50)"
                            },
                            "key_takeaways": [
                                "Los widgets devuelven el valor actual seleccionado por el usuario como variable nativa de Python.",
                                "st.multiselect y st.selectbox controlan filtros categoricos limpios.",
                                "El filtrado reactivo de DataFrames se logra combinando widgets con mascaras booleanas."
                            ],
                            "exercise": {
                                "id": "ex_da_10_02",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Que devuelve la llamada opcion = st.selectbox('Elige color', ['Rojo', 'Verde', 'Azul']) cuando el usuario selecciona 'Verde' en la web?",
                                "options": [
                                    {"id": "a", "text": "La cadena de texto 'Verde' directamente asignada a la variable opcion."},
                                    {"id": "b", "text": "Un objeto Promise asincrono que debe esperarse con await."},
                                    {"id": "c", "text": "Un indice entero 1 sin el texto."},
                                    {"id": "d", "text": "None hasta que se presione un boton de envio."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Los widgets en Streamlit retornan directamente el valor Python seleccionado de forma sincronica durante la ejecucion del script."
                            }
                        },
                        {
                            "id": "les_da_10_03",
                            "code": "L03",
                            "title": "Optimizacion de Rendimiento con Caching",
                            "slug": "optimizacion-rendimiento-caching",
                            "position": 3,
                            "concept_id": "da-streamlit-caching",
                            "objective": "Acelerar aplicaciones evitando recargas costosas de datos mediante @st.cache_data y @st.cache_resource.",
                            "theory_markdown": "Dado que Streamlit re-ejecuta todo el script ante cada clic, volver a leer un archivo CSV de 500 MB o reconectarse a una base de datos en cada interaccion destruiria el rendimiento.\n\nPara solucionar esto, Streamlit implementa decoradores de **Cache Inteligente**:\n\n1. **`@st.cache_data` (Para Datos y Computos):**\n   - Ideal para lecturas de archivos (`pd.read_csv`, `read_parquet`), transformaciones, queries SQL y peticiones HTTP.\n   - Guarda en memoria los datos retornados. Si la funcion se llama con los mismos argumentos, retorna el resultado cacheado instantaneamente sin re-ejecutar el cuerpo de la funcion.\n\n2. **`@st.cache_resource` (Para Recursos Globales no serializables):**\n   - Ideal para conexiones de bases de datos (`sqlite3.connect`), clientes de APIs o modelos de Machine Learning pesados cargados en memoria.",
                            "examples": [
                                {
                                    "title": "Carga optimizada de dataset con @st.cache_data",
                                    "code": "import streamlit as st\nimport pandas as pd\nimport time\n\n@st.cache_data\ndef cargar_datos(ruta: str) -> pd.DataFrame:\n    time.sleep(2) # Simula lectura costosa de disco\n    return pd.DataFrame({\"id\": [1, 2], \"monto\": [100, 200]})\n\n# La primera vez tarda 2s; en interacciones subsiguientes tarda 0.0001s:\ndatos = cargar_datos(\"ventas_anuales.parquet\")\nst.dataframe(datos)",
                                    "output": "Carga instantanea en recargas sucesivas de la aplicacion.",
                                    "explanation": "@st.cache_data detecta que la ruta no ha cambiado e inyecta la copia en memoria de inmediato."
                                }
                            ],
                            "common_errors": "Mutar in-place un DataFrame devuelto por una funcion con @st.cache_data (ej. df.drop(..., inplace=True)), lo que puede corromper el objeto en la cache para otras sesiones.",
                            "mini_exercise": {
                                "instructions": "Decora la funcion obtener_dataset con @st.cache_data para evitar recargas lentas.",
                                "starter_code": "import streamlit as st\nimport pandas as pd\n\n# Agrega el decorador\ndef obtener_dataset():\n    return pd.DataFrame({\"a\": [1, 2]})\n",
                                "solution": "import streamlit as st\nimport pandas as pd\n\n@st.cache_data\ndef obtener_dataset():\n    return pd.DataFrame({\"a\": [1, 2]})"
                            },
                            "key_takeaways": [
                                "@st.cache_data memoriza resultados de calculos y lectura de datasets.",
                                "@st.cache_resource persiste conexiones compartidas y modelos de machine learning.",
                                "El cacheo previene tiempos de espera innecesarios en la ejecucion reactiva."
                            ],
                            "exercise": {
                                "id": "ex_da_09_03_st",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual decorador de Streamlit se debe utilizar para memorizar la lectura de un dataset pesado en DataFrame y evitar leerlo de disco en cada interaccion de usuario?",
                                "options": [
                                    {"id": "a", "text": "@st.cache_data"},
                                    {"id": "b", "text": "@st.cache_resource"},
                                    {"id": "c", "text": "@st.memo_fast"},
                                    {"id": "d", "text": "@st.static_load"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "@st.cache_data es el decorador recomendado para almacenar en cache datos serializables como DataFrames de Pandas, arrays y diccionarios."
                            }
                        },
                        {
                            "id": "les_da_10_04",
                            "code": "L04",
                            "title": "Layouts Profesionales, KPIs y Storytelling con Datos",
                            "slug": "layouts-kpis-storytelling",
                            "position": 4,
                            "concept_id": "da-streamlit-layouts-storytelling",
                            "objective": "Disenar dashboards profesionales con st.sidebar, columnas con st.columns, pestanas st.tabs y metricas st.metric.",
                            "theory_markdown": "Para transformar un reporte lineal en un dashboard ejecutivo de alto impacto, Streamlit proporciona herramientas de organizacion espacial:\n\n1. **Barra Lateral (`st.sidebar`):**\n   Ubica filtros y configuraciones globales en un panel retractil a la izquierda:\n   `filtro = st.sidebar.selectbox('Segmento', opciones)`.\n\n2. **Distribucion en Columnas (`st.columns`):**\n   Divide el ancho de la pagina en columnas proporcionales:\n   ```python\n   col1, col2, col3 = st.columns(3)\n   col1.metric('Ingresos Totales', '$1.2M', '+12%')\n   col2.metric('Clientes Activos', '4,520', '-3%')\n   col3.metric('Ticket Promedio', '$265', '+5%')\n   ```\n\n3. **Pestanas (`st.tabs`):**\n   Organiza secciones tematicas sin saturar la pantalla verticalmente:\n   `tab1, tab2 = st.tabs(['Resumen Ejecutivo', 'Analisis Detallado'])`.\n\n4. **Integracion con Plotly (`st.plotly_chart`):**\n   Muestra graficos interactivos ajustados al ancho del contenedor: `st.plotly_chart(fig, use_container_width=True)`.",
                            "examples": [
                                {
                                    "title": "Estructura completa de un dashboard ejecutivo",
                                    "code": "import streamlit as st\nimport plotly.express as px\nimport pandas as pd\n\nst.set_page_config(layout=\"wide\")\nst.sidebar.title(\"Filtros de Control\")\n\ndf = pd.DataFrame({\"mes\": [\"Ene\", \"Feb\", \"Mar\"], \"ventas\": [100, 150, 200]})\n\ncol1, col2 = st.columns([1, 2])\nwith col1:\n    st.metric(\"Crecimiento Trimestral\", \"+25%\", \"5% vs meta\")\nwith col2:\n    fig = px.line(df, x=\"mes\", y=\"ventas\", title=\"Tendencia de Ventas\")\n    st.plotly_chart(fig, use_container_width=True)",
                                    "output": "Dashboard en formato panoramico con tarjeta KPI e integracion de grafico Plotly interactivo.",
                                    "explanation": "use_container_width=True adapta el grafico responsive al ancho disponible de la columna."
                                }
                            ],
                            "common_errors": "No configurar st.set_page_config(layout='wide') como primera instruccion del script, obligando a que el dashboard quede confinado en una columna central estrecha.",
                            "mini_exercise": {
                                "instructions": "Usa st.metric para mostrar una tarjeta KPI con etiqueta 'Usuarios', valor '1,500' y variacion '+10%'.",
                                "starter_code": "import streamlit as st\n\n# Muestra el KPI con st.metric\n",
                                "solution": "st.metric(label=\"Usuarios\", value=\"1,500\", delta=\"+10%\")"
                            },
                            "key_takeaways": [
                                "st.sidebar aloja controles de filtrado liberando el area principal de visualizacion.",
                                "st.columns y st.metric presentan tarjetas de KPIs ejecutivas de forma concisa.",
                                "st.plotly_chart(fig, use_container_width=True) embebe graficos interactivos responsivos."
                            ],
                            "exercise": {
                                "id": "ex_da_10_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual componente de Streamlit se utiliza para mostrar tarjetas de indicadores clave de rendimiento (KPIs) con una etiqueta principal, un valor numérico y una variacion porcentual con flecha de direccion?",
                                "options": [
                                    {"id": "a", "text": "st.metric()"},
                                    {"id": "b", "text": "st.kpi_card()"},
                                    {"id": "c", "text": "st.indicator()"},
                                    {"id": "d", "text": "st.stat_box()"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "st.metric(label=..., value=..., delta=...) renderiza una tarjeta de KPI con formato visual y soporte de delta positivo o negativo."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DA_M10",
            "module_slug": "streamlit-dashboards",
            "course_slug": "data-analytics",
            "questions": [
                {
                    "id": "q_da_10_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que comando de consola se ejecuta para levantar una aplicacion web interactiva desarrollada con Streamlit?",
                    "options": [
                        {"id": "a", "text": "streamlit run app.py"},
                        {"id": "b", "text": "python start app.py"},
                        {"id": "c", "text": "streamlit serve app.py"},
                        {"id": "d", "text": "npm start app.py"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "streamlit run es el comando de linea de comandos que inicializa el servidor Tornado/WebSocket local y abre el navegador."
                },
                {
                    "id": "q_da_10_02",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Como se ubica un widget (por ejemplo un slider) dentro del panel lateral retractil izquierdo en Streamlit?",
                    "options": [
                        {"id": "a", "text": "st.sidebar.slider('Etiqueta', 0, 100)"},
                        {"id": "b", "text": "st.slider('Etiqueta', 0, 100, position='sidebar')"},
                        {"id": "c", "text": "sidebar(st.slider('Etiqueta'))"},
                        {"id": "d", "text": "st.left_panel.slider('Etiqueta')"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "st.sidebar expone los mismos metodos que st, renderizandolos en el contenedor lateral izquierdo."
                },
                {
                    "id": "q_da_10_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que funcion cumple el decorador @st.cache_data en una aplicacion de Streamlit?",
                    "options": [
                        {"id": "a", "text": "Memorizar el valor devuelto por la funcion para evitar re-ejecutar calculos pesados o descargas de datos si los argumentos no han cambiado."},
                        {"id": "b", "text": "Guardar la pagina web en el historial del navegador del usuario."},
                        {"id": "c", "text": "Encriptar los datos con contraseña de acceso."},
                        {"id": "d", "text": "Exportar automaticamente el DataFrame a Google Sheets."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "@st.cache_data implementa memoizacion inteligente para datasets, evitando que las re-ejecuciones reactivas vuelvan a leer disco innecesariamente."
                },
                {
                    "id": "q_da_10_04",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual decorador se utiliza en Streamlit para cachear recursos no serializables globales como conexiones de bases de datos o modelos de Machine Learning cargados en memoria?",
                    "options": [
                        {"id": "a", "text": "@st.cache_resource"},
                        {"id": "b", "text": "@st.cache_data"},
                        {"id": "c", "text": "@st.singleton"},
                        {"id": "d", "text": "@st.memo"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "@st.cache_resource gestiona objetos con estado que no pueden ser serializados en bytes, como conexiones de red y sesiones de base de datos."
                },
                {
                    "id": "q_da_10_05",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como se integran graficos interactivos construidos con Plotly dentro de una aplicacion de Streamlit?",
                    "options": [
                        {"id": "a", "text": "st.plotly_chart(fig, use_container_width=True)"},
                        {"id": "b", "text": "st.plot(fig)"},
                        {"id": "c", "text": "st.render_html(fig.to_html())"},
                        {"id": "d", "text": "st.display_chart(fig)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "st.plotly_chart() es el componente nativo disenado para renderizar figuras de Plotly con interactividad completa y adaptabilidad responsiva."
                },
                {
                    "id": "q_da_10_06",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "Cual metodo de Streamlit se utiliza para dividir horizontalmente el espacio de la pagina en 3 columnas comparativas independientes?",
                    "options": [
                        {"id": "a", "text": "col1, col2, col3 = st.columns(3)"},
                        {"id": "b", "text": "st.split_horizontal(3)"},
                        {"id": "c", "text": "st.grid(rows=1, cols=3)"},
                        {"id": "d", "text": "st.make_columns(3)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "st.columns(3) desempaqueta tres contenedores de columna para renderizar elementos en paralelo horizontal."
                }
            ]
        }
    }
]

def main():
    print("Iniciando generacion de modulos 06 a 10 de Data Analytics...")
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
