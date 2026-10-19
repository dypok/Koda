# -*- coding: utf-8 -*-
"""
Script to generate AI Agents modules 01 to 05 with 4 lessons and 6 calibrated questions each.
Enforces zero emojis, zero spoilers, and strict schema compliance.
"""

import json
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", "languages", "python", "modules", "ai_agents"))

MODULES = [
    {
        "dir": "01_llms_prompts",
        "module_json": {
            "id": "ia_mod_01",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "IA_M01",
            "slug": "ia-llms-y-prompts",
            "course_slug": "ai-agents",
            "title": "Arquitectura de LLMs, Tokens y Prompt Engineering",
            "objective": "Comprender la generacion autorregresiva de texto, tokenizacion BPE, parametros de muestreo y tecnicas de prompting avanzado.",
            "description": "Los fundamentos cientificos de los Modelos de Lenguaje Grande: atencion, calculo de tokens, muestreo estocastico y prompts estructurados.",
            "position": 51,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_ia_01_01",
                    "code": "S01",
                    "title": "Mecanica de LLMs, Tokens y Prompting",
                    "slug": "mecanica-llms-tokens-prompting",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 45,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_ia_01_01",
                            "code": "L01",
                            "title": "Arquitectura Transformer y Modelos Autorregresivos",
                            "slug": "arquitectura-transformer-autorregresiva",
                            "position": 1,
                            "concept_id": "ia-transformer-autoregressive",
                            "objective": "Comprender el mecanismo de atencion y el proceso de generacion probabilistica token a token de los LLMs modernos.",
                            "theory_markdown": "Los **Modelos de Lenguaje Grande (LLMs)** modernos (como GPT-4, Claude 3.5 o Gemini 1.5) se basan en la arquitectura **Transformer** (Vaswani et al., 2017), concretamente en su variante *Decoder-Only*.\n\n### Generacion Autorregresiva\nUn LLM es un modelo probabilistico autorregresivo: **genera texto prediciendo iterativamente un token a la vez**.\n\nEn cada paso de inferencia:\n1. El modelo recibe la secuencia completa de tokens acumulada hasta el momento.\n2. El mecanismo de **Auto-Atencion (Self-Attention)** calcula la relevancia contextual entre todos los pares de tokens de la secuencia.\n3. La capa de salida produce una distribucion de probabilidad (logits procesados con Softmax) sobre todo el vocabulario disponible.\n4. Se selecciona un token segun la estrategia de muestreo y se anade a la secuencia, repitiendo el ciclo hasta emitir el token de fin de secuencia (`<|endoftext|>`).",
                            "examples": [
                                {
                                    "title": "Ciclo autorregresivo conceptual",
                                    "code": "# Secuencia inicial: \"El lenguaje de programacion es\"\n# Paso 1: P(Python | contexto) = 0.85 -> Emite \"Python\"\n# Paso 2: Nuevo contexto: \"El lenguaje de programacion es Python\"\n# Paso 3: P(versatil | contexto) = 0.72 -> Emite \"versatil\"\n# Continua hasta alcanzar el token final de parada.",
                                    "output": "Generacion token por token condicionada por todo el historial precedente.",
                                    "explanation": "El modelo no planifica el parrafo completo en un solo bloque; evalua probabilidades condicionales en cada paso."
                                }
                            ],
                            "common_errors": "Creer que los LLMs consultan una base de datos estatica de respuestas predefinidas, cuando en realidad calculan distribuciones estadisticas de probabilidad sobre tokens.",
                            "mini_exercise": {
                                "instructions": "Escribe un breve texto explicando que significa que un modelo sea autorregresivo.",
                                "starter_code": "# Que significa autorregresivo?\nconcepto = ...",
                                "solution": "concepto = \"Significa que predice el siguiente token condicionandose en los tokens previamente generados.\""
                            },
                            "key_takeaways": [
                                "Los LLMs modernos son modelos autorregresivos basados en Transformers Decoder-Only.",
                                "El mecanismo de auto-atencion evalua relaciones entre todos los tokens del contexto.",
                                "La generacion opera token a token hasta encontrar un token delimitador de parada."
                            ],
                            "exercise": {
                                "id": "ex_ia_01_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es el principio operativo basico de un modelo de lenguaje autorregresivo como GPT o Gemini?",
                                "options": [
                                    {"id": "a", "text": "Predecir de forma iterativa el siguiente token mas probable condicionado en la secuencia de tokens anteriores."},
                                    {"id": "b", "text": "Consultar tablas SQL de respuestas exactas almacenadas en un servidor."},
                                    {"id": "c", "text": "Compilar codigo Python directamente a codigo ensamblador."},
                                    {"id": "d", "text": "Buscar coincidencias literales de texto en la web en cada milisegundo."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El proceso autorregresivo predice secuencialmente el proximo token calculando probabilidades sobre el vocabulario segun el contexto acumulado."
                            }
                        },
                        {
                            "id": "les_ia_01_02",
                            "code": "L02",
                            "title": "Tokenizacion BPE y la Ventana de Contexto",
                            "slug": "tokenizacion-bpe-context-window",
                            "position": 2,
                            "concept_id": "ia-tokenization-context",
                            "objective": "Analizar la codificacion Byte-Pair Encoding (BPE), estimar el consumo de tokens y comprender los limites del Context Window.",
                            "theory_markdown": "Los modelos de lenguaje no procesan caracteres ni palabras enteras directamente; procesan **tokens** mediante algoritmos como **BPE (Byte-Pair Encoding)**.\n\n### Metricas de Conversion de Tokens\n- En ingles: 1 token equivale aproximadamente a 0.75 palabras (o 4 caracteres).\n- En espanol y otros idiomas con acentos o caracteres especiales, una palabra puede fragmentarse en multiples subtokens, aumentando el costo y la latencia.\n- En Python se usa la libreria `tiktoken` para calcular el conteo exacto de tokens antes de invocar la API.\n\n### La Ventana de Contexto (Context Window)\nEs la cantidad maxima de tokens (entrada + salida) que el modelo puede retener en su memoria de atencion activa simultaneamente (ej. 128k en GPT-4o, 1M+ en Gemini 1.5 Pro). Exceder este limite produce un error de API o truncamiento abrupto.",
                            "examples": [
                                {
                                    "title": "Conteo exacto de tokens con tiktoken",
                                    "code": "import tiktoken\n\nencoder = tiktoken.get_encoding(\"cl100k_base\")\ntexto = \"Python es un lenguaje interpretado y potente.\"\ntokens = encoder.encode(texto)\nprint(\"Conteo de tokens:\", len(tokens))\nprint(\"IDs de tokens:\", tokens[:5])",
                                    "output": "Conteo de tokens: 9\nIDs de tokens: [31318, 374, 513, 21257, 362]",
                                    "explanation": "El texto se descompone en enteros numericos que representan los subtokens en el vocabulario."
                                }
                            ],
                            "common_errors": "Calcular costos o limites de API basandose en el conteo de palabras en lugar del conteo de tokens de BPE.",
                            "mini_exercise": {
                                "instructions": "Usa encoder.encode(texto) para obtener la lista de tokens numericos de la variable 'frase'.",
                                "starter_code": "import tiktoken\nencoder = tiktoken.get_encoding(\"cl100k_base\")\nfrase = \"Hola Koda\"\n\n# Obtiene tokens\ntokens = ...",
                                "solution": "tokens = encoder.encode(frase)"
                            },
                            "key_takeaways": [
                                "Los LLMs procesan subtokens numericos generados por BPE, no palabras directas.",
                                "tiktoken permite auditar y presupuestar el consumo de tokens en Python.",
                                "El Context Window impone un limite estricto a la suma de tokens de entrada y salida."
                            ],
                            "exercise": {
                                "id": "ex_ia_01_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Por que un texto escrito en espanol suele consumir mas tokens que el mismo texto en ingles en un tokenizador estandar como BPE?",
                                "options": [
                                    {"id": "a", "text": "Porque los vocabularios de BPE se entrenaron predominantemente con corpus en ingles, provocando que palabras y acentos en espanol se dividan en multiples subtokens mas pequenos."},
                                    {"id": "b", "text": "Porque el espanol utiliza mas letras por palabra que el ingles."},
                                    {"id": "c", "text": "Porque los modelos de lenguaje no admiten caracteres latinos."},
                                    {"id": "d", "text": "Porque las APIs cobran un recargo geografico automatico."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "La distribucion de frecuencia del vocabulario BPE fragmenta vocablos y signos diacriticos de idiomas con menor representacion en el corpus de entrenamiento en varios fragmentos."
                            }
                        },
                        {
                            "id": "les_ia_01_03",
                            "code": "L03",
                            "title": "Parametros de Muestreo: Temperature, Top-p y Top-k",
                            "slug": "parametros-muestreo-temperature-topp",
                            "position": 3,
                            "concept_id": "ia-sampling-parameters",
                            "objective": "Ajustar Temperature, Top-p y Top-k para calibrar el balance entre determinismo rigido y creatividad controlada.",
                            "theory_markdown": "Al finalizar la pasada hacia adelante, el modelo genera un vector de logits. Los parametros de muestreo determinan como se transforma ese vector en la eleccion del siguiente token:\n\n1. **Temperature ($T$):** Escala los logits antes de aplicar la funcion Softmax.\n   - $T = 0.0$ (o cercano a 0): **Greedy Search**. Siempre elige el token con mayor probabilidad. Maximo determinismo, ideal para extraccion de datos, codigo y analisis logico.\n   - $T = 1.0$: Muestreo estandar segun las probabilidades naturales aprendidas.\n   - $T > 1.2$: Aplana la distribucion, otorgando mayor probabilidad a tokens raros. Mayor creatividad pero alto riesgo de alucinacion y perdida de coherencia.\n\n2. **Top-p (Nucleus Sampling):**\n   Restringe la seleccion al conjunto acumulado de tokens cuya suma de probabilidades alcanza el valor $p$ (ej. $p = 0.90$). Descarta la 'cola larga' de tokens inverosimiles.\n\n3. **Regla de Diseno:** Ajusta Temperature O Top-p, pero no ambos simultaneamente de forma agresiva.",
                            "examples": [
                                {
                                    "title": "Configuracion de parametros segun el caso de uso",
                                    "code": "# Caso 1: Generacion de SQL o parsing de JSON estructurado (Determinista)\nparams_sql = {\"temperature\": 0.0, \"top_p\": 1.0}\n\n# Caso 2: Brainstorming de marketing o generacion narrativa (Creativo)\nparams_creativo = {\"temperature\": 0.8, \"top_p\": 0.9}",
                                    "output": "Configuraciones calibradas segun la tolerancia a varianza de la tarea.",
                                    "explanation": "Tareas estructuradas requieren temperature=0.0 para garantizar que el modelo no invente sintaxis."
                                }
                            ],
                            "common_errors": "Configurar temperature=1.5 para tareas que requieren retornar JSON estricto, provocando llaves rotas, campos faltantes y errores de sintaxis.",
                            "mini_exercise": {
                                "instructions": "Define un diccionario con temperature=0.0 para una tarea que exige maxima precision y reproducibilidad.",
                                "starter_code": "# Define config_determinista\nconfig_determinista = ...",
                                "solution": "config_determinista = {\"temperature\": 0.0}"
                            },
                            "key_takeaways": [
                                "Temperature controla la dispersion probabilistica (0 = determinista, >1 = creativo).",
                                "Top-p limita la seleccion al nucleo acumulado mas probable descartando la cola infrecuente.",
                                "Para extraccion estructurada, codigo y matematicas se debe usar temperature=0.0."
                            ],
                            "exercise": {
                                "id": "ex_ia_01_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que valor de Temperature se debe configurar en una llamada a un LLM si el objetivo es extraer datos en formato JSON de un contrato legal con la maxima consistencia y reproducibilidad?",
                                "options": [
                                    {"id": "a", "text": "0.0"},
                                    {"id": "b", "text": "1.0"},
                                    {"id": "c", "text": "1.8"},
                                    {"id": "d", "text": "-1.0"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Temperature 0.0 activa la seleccion codiciosa (greedy), seleccionando siempre el token con maxima probabilidad y garantizando reproducibilidad en tareas formales."
                            }
                        },
                        {
                            "id": "les_ia_01_04",
                            "code": "L04",
                            "title": "Tecnicas de Prompt Engineering: Few-Shot y Chain-of-Thought",
                            "slug": "few-shot-chain-of-thought",
                            "position": 4,
                            "concept_id": "da-prompt-engineering-cot",
                            "objective": "Disenar prompts profesionales aplicando Zero-shot, Few-shot prompting y Chain-of-Thought (CoT) para tareas complejas.",
                            "theory_markdown": "El **Prompt Engineering** es la disciplina de formular entradas estructuradas para guiar el espacio latente del modelo hacia respuestas optimas:\n\n1. **Zero-Shot Prompting:** Se solicita la tarea directamente sin proporcionar ejemplos previos.\n2. **Few-Shot Prompting (In-Context Learning):** Se proporcionan entre 2 y 5 pares de ejemplos de `Entrada -> Salida` antes de solicitar el caso real. Calibra el formato y estilo exacto esperado sin re-entrenar pesos.\n3. **Chain-of-Thought (CoT) / Razonamiento Paso a Paso:**\n   Obligar al modelo a descomponer el problema ('Piensa paso a paso antes de dar tu veredicto final') aumenta dramaticamente el desempeno en logica y aritmetica, ya que cada paso intermedio generado se convierte en contexto autorregresivo para los pasos subsiguientes.\n4. **Delimitadores Claros:** Uso de etiquetas Markdown (```) o XML (`<contexto>...</contexto>`) para separar instrucciones de datos de entrada.",
                            "examples": [
                                {
                                    "title": "Prompt Few-Shot con delimitadores XML",
                                    "code": "prompt = \"\"\"\nClasifica el sentimiento del texto en Positivo, Negativo o Neutro.\n\nEjemplos:\nEntrada: El servicio fue rapido y eficiente.\nSalida: Positivo\n\nEntrada: El producto llego danado y tarde.\nSalida: Negativo\n\nAnaliza la siguiente entrada:\n<texto>\nLa entrega tardo pero la comida estaba deliciosa.\n</texto>\nRazonamiento: Evalua la queja vs el elogio.\nSalida:\n\"\"\"",
                                    "output": "Salida: Positivo",
                                    "explanation": "Los ejemplos acondicionan al modelo para imitar exactamente la taxonomia solicitada."
                                }
                            ],
                            "common_errors": "Pedirle a un LLM que resuelva un problema matematico o de logica complejo directamente sin permitirle generar pasos de razonamiento intermedios (CoT).",
                            "mini_exercise": {
                                "instructions": "Escribe la instruccion estandar de Chain-of-Thought para obligar al modelo a razonar antes de responder.",
                                "starter_code": "# Instruccion CoT\ninstruccion_cot = ...",
                                "solution": "instruccion_cot = \"Piensa paso a paso y justifica tu respuesta antes de dar el veredicto final.\""
                            },
                            "key_takeaways": [
                                "Few-Shot prompting acondiciona el formato mediante ejemplos representativos.",
                                "Chain-of-Thought (CoT) permite calcular tokens de razonamiento intermedio mejorando la precision logica.",
                                "Los delimitadores XML o Markdown previenen inyecciones y confunden menos al modelo."
                            ],
                            "exercise": {
                                "id": "ex_ia_01_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Por que la tecnica Chain-of-Thought ('Piensa paso a paso') mejora sustancialmente la precision de los LLMs en problemas logicos o matematicos?",
                                "options": [
                                    {"id": "a", "text": "Porque al generar tokens de razonamiento intermedio, cada paso se convierte en parte del contexto previo disponible para calcular los siguientes pasos probabilisticos de la solucion."},
                                    {"id": "b", "text": "Porque reinicia los pesos de la red neuronal durante la peticion."},
                                    {"id": "c", "text": "Porque desactiva la tokenizacion BPE."},
                                    {"id": "d", "text": "Porque conecta al modelo con una calculadora externa automaticamente."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Debido a la naturaleza autorregresiva del modelo, verbalizar los pasos intermedios expande el contexto con la secuencia logica requerida para deducir la conclusion correcta."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "IA_M01",
            "module_slug": "ia-llms-y-prompts",
            "course_slug": "ai-agents",
            "questions": [
                {
                    "id": "q_ia_01_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que significa que la generacion de un LLM sea autorregresiva?",
                    "options": [
                        {"id": "a", "text": "Que predice un token a la vez, utilizando todos los tokens previamente generados como contexto de entrada para el siguiente calculo."},
                        {"id": "b", "text": "Que entrena sus pesos en tiempo real mientras el usuario escribe."},
                        {"id": "c", "text": "Que solo puede responder con palabras de tres letras."},
                        {"id": "d", "text": "Que no utiliza la memoria RAM del servidor."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El proceso autorregresivo alimenta continuamente la salida generada de regreso a la entrada para calcular la distribucion de probabilidad del siguiente token."
                },
                {
                    "id": "q_ia_01_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual es la unidad elemental de procesamiento de texto que consumen y emiten los modelos de lenguaje modernos como GPT o Gemini?",
                    "options": [
                        {"id": "a", "text": "Tokens (fragmentos numericos de palabras codificados mediante algoritmos como BPE)"},
                        {"id": "b", "text": "Lineas de codigo Python completas"},
                        {"id": "c", "text": "Caracteres ASCII individuales exclusivamente"},
                        {"id": "d", "text": "Parrafos completos en formato PDF"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Los LLMs operan sobre tokens numericos discretos definidos en un vocabulario fijo estructurado por tokenizadores como BPE."
                },
                {
                    "id": "q_ia_01_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que efecto produce elevar la Temperature de 0.2 a 1.2 en una llamada a la API de un modelo de lenguaje?",
                    "options": [
                        {"id": "a", "text": "Aumenta la variabilidad y creatividad del texto al aplanar la distribucion de probabilidad, incrementando el riesgo de respuestas inesperadas o alucinaciones."},
                        {"id": "b", "text": "Hace que el modelo responda diez veces mas rapido."},
                        {"id": "c", "text": "Obliga a que el modelo responda exclusivamente en formato JSON."},
                        {"id": "d", "text": "Reduce a cero el costo economico de la llamada."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Temperaturas elevadas suavizan las diferencias de probabilidad entre tokens, permitiendo que opciones menos frecuentes sean seleccionadas."
                },
                {
                    "id": "q_ia_01_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "En que consiste el metodo de muestreo Top-p (Nucleus Sampling)?",
                    "options": [
                        {"id": "a", "text": "En seleccionar unicamente entre el subconjunto de tokens mas probables cuya masa acumulada sume el porcentaje p indicado (ej. 90%), descartando la cola inferior."},
                        {"id": "b", "text": "En evaluar solo los primeros p caracteres del prompt."},
                        {"id": "c", "text": "En reintentar la llamada p veces si falla."},
                        {"id": "d", "text": "En elegir siempre el token numero p del abecedario."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Top-p dynamicamente ajusta el numero de candidatos viables segun la concentracion de probabilidad del contexto, eliminando opciones disparatadas."
                },
                {
                    "id": "q_ia_01_05",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual es la diferencia principal entre un enfoque Zero-Shot y un enfoque Few-Shot en Prompt Engineering?",
                    "options": [
                        {"id": "a", "text": "Zero-Shot pide resolver la tarea directamente sin ejemplos; Few-Shot provee ejemplos demostrativos de entrada y salida previa para calibrar el comportamiento."},
                        {"id": "b", "text": "Zero-Shot no cobra dinero por los tokens y Few-Shot si."},
                        {"id": "c", "text": "Few-Shot requiere re-entrenar la red neuronal en GPUs."},
                        {"id": "d", "text": "Zero-Shot solo funciona con modelos de audio."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Few-Shot se apoya en el aprendizaje en contexto (in-context learning) incorporando ejemplos directamente dentro del prompt."
                },
                {
                    "id": "q_ia_01_06",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "Cual es el termino que describe el limite maximo de tokens totales (prompt + respuesta) que un modelo puede procesar simultaneamente en una llamada?",
                    "options": [
                        {"id": "a", "text": "Ventana de Contexto (Context Window)"},
                        {"id": "b", "text": "Tasa de refresco (Refresh Rate)"},
                        {"id": "c", "text": "Batch Size"},
                        {"id": "d", "text": "Latencia de conexion"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El Context Window define la capacidad maxima de tokens que el mecanismo de atencion del Transformer puede retener en memoria activa."
                }
            ]
        }
    },
    {
        "dir": "02_apis_modelos",
        "module_json": {
            "id": "ia_mod_02",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "IA_M02",
            "slug": "ia-apis-modelos",
            "course_slug": "ai-agents",
            "title": "Consumo de APIs de Modelos en Python y Streaming",
            "objective": "Integrar clientes de inferencia asincronos en Python, gestionar roles de mensajes y consumir respuestas en streaming con control de rate limits.",
            "description": "Desarrollo profesional sobre APIs de frontera: arquitectura asincrona, reduccion de latencia con streaming y reintentos con backoff exponencial.",
            "position": 52,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_ia_02_01",
                    "code": "S01",
                    "title": "Clientes Asincronos, Streaming y Resiliencia de Red",
                    "slug": "clientes-asincronos-streaming-resiliencia",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_ia_02_01",
                            "code": "L01",
                            "title": "Configuracion de SDKs y Clientes Asincronos",
                            "slug": "sdks-clientes-asincronos",
                            "position": 1,
                            "concept_id": "ia-api-async-client",
                            "objective": "Instanciar clientes de inferencia asincronos en Python y proteger API keys mediante variables de entorno.",
                            "theory_markdown": "El consumo de APIs de modelos fundacionales (como OpenAI, Google Gemini o Anthropic) debe realizarse de forma asincrona en entornos de produccion para no bloquear el Event Loop de Python.\n\n### Gestion Segura de Credenciales\nLas API keys **nunca deben hardcodearse en el codigo**. Se leen desde el entorno del sistema operativo (`os.environ`):\n```python\nimport os\nfrom openai import AsyncOpenAI\n\n# El cliente busca automaticamente os.environ['OPENAI_API_KEY']\nclient = AsyncOpenAI()\n```\n\n### Llamadas Asincronas con AsyncClient\nAl usar `await client.chat.completions.create(...)`, la conexion de red se delega al bucle de eventos, permitiendo que el servidor atienda cientos de peticiones concurrentes mientras espera la respuesta del modelo.",
                            "examples": [
                                {
                                    "title": "Invocacion asincrona basica",
                                    "code": "import asyncio\nfrom openai import AsyncOpenAI\n\nasync def consultar_ia():\n    client = AsyncOpenAI()\n    respuesta = await client.chat.completions.create(\n        model=\"gpt-4o-mini\",\n        messages=[{\"role\": \"user\", \"content\": \"Explica recursion en 1 linea\"}],\n        temperature=0.0\n    )\n    return respuesta.choices[0].message.content",
                                    "output": "Funcion que llama a una copia de si misma hasta satisfacer un caso base.",
                                    "explanation": "El uso de await evita congelar el hilo principal mientras viajan los paquetes de red."
                                }
                            ],
                            "common_errors": "Hacer commit de archivos de prueba con claves 'sk-...' reales en repositorios publicos de GitHub, provocando su robo inmediato por bots de escaneo.",
                            "mini_exercise": {
                                "instructions": "Usa os.getenv para obtener la variable 'AI_API_KEY' o elevar ValueError si no existe.",
                                "starter_code": "import os\n\n# Lee la variable de entorno\napi_key = ...",
                                "solution": "api_key = os.getenv(\"AI_API_KEY\")\nif not api_key:\n    raise ValueError(\"Falta AI_API_KEY\")"
                            },
                            "key_takeaways": [
                                "Las API keys deben administrarse exclusivamente por variables de entorno.",
                                "AsyncOpenAI permite llamadas concurrentes sobre el Event Loop de asyncio.",
                                "El modelo y los mensajes se estructuran de forma declarativa."
                            ],
                            "exercise": {
                                "id": "ex_ia_02_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Por que es mandatorio utilizar clientes asincronos (como AsyncOpenAI) al integrar LLMs en servidores web como FastAPI?",
                                "options": [
                                    {"id": "a", "text": "Porque las respuestas de los LLMs toman varios segundos; usar clientes sincronos bloquearia el hilo del servidor impidiendo atender a otros usuarios."},
                                    {"id": "b", "text": "Porque los clientes sincronos estan prohibidos por ley."},
                                    {"id": "c", "text": "Porque el cliente asincrono consume la mitad de tokens."},
                                    {"id": "d", "text": "Porque los clientes asincronos solo funcionan con Python 2.7."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Las llamadas I/O a LLMs son lentas (latencia de red + generacion de tokens). Un cliente sincrono congelaria todo el proceso de peticiones concurrentes."
                            }
                        },
                        {
                            "id": "les_ia_02_02",
                            "code": "L02",
                            "title": "Estructura de Mensajes: System, User y Assistant",
                            "slug": "estructura-mensajes-roles",
                            "position": 2,
                            "concept_id": "ia-api-message-roles",
                            "objective": "Comprender la jerarquia de roles en el Chat Completion API y fijar directivas indelebles con el rol system.",
                            "theory_markdown": "Las APIs de chat estructuran la conversacion como una lista cronologica de diccionarios con tres roles fundamentales:\n\n1. **`system`:**\n   Instrucciones rectoras de maxima prioridad. Define la identidad, restricciones de seguridad, tono y formato de salida del modelo. El usuario final no suele ver este mensaje.\n2. **`user`:**\n   Los mensajes enviados por el usuario humano o la aplicacion solicitante.\n3. **`assistant`:**\n   Las respuestas emitidas previamente por el modelo. Permite inyectar historial conversacional para dar memoria de contexto.",
                            "examples": [
                                {
                                    "title": "Conversacion contextual con los tres roles",
                                    "code": "messages = [\n    {\"role\": \"system\", \"content\": \"Eres un tutor de Python estricto. Responde siempre con codigo ejecutable y explicacion breve.\"},\n    {\"role\": \"user\", \"content\": \"Como ordeno una lista?\"},\n    {\"role\": \"assistant\", \"content\": \"lista.sort() modifica in-place; sorted(lista) retorna una nueva lista.\"},\n    {\"role\": \"user\", \"content\": \"Y si quiero orden descendente?\"}\n]",
                                    "output": "Usa lista.sort(reverse=True) o sorted(lista, reverse=True).",
                                    "explanation": "El rol assistant permite que el modelo entienda que la segunda pregunta se refiere a la lista ordenada previamente."
                                }
                            ],
                            "common_errors": "Colocar instrucciones criticas de seguridad en el rol 'user' en vez del rol 'system', facilitando que el usuario sobreescriba las reglas con ataques de prompt injection.",
                            "mini_exercise": {
                                "instructions": "Escribe un mensaje de rol 'system' que ordene al modelo responder exclusivamente en formato JSON.",
                                "starter_code": "# Mensaje system\nsystem_msg = {\"role\": ..., \"content\": ...}",
                                "solution": "system_msg = {\"role\": \"system\", \"content\": \"Responde exclusivamente en formato JSON valido.\"}"
                            },
                            "key_takeaways": [
                                "El rol system fija directivas de identidad, reglas y formato no negociables.",
                                "El rol user transporta las preguntas del cliente.",
                                "El rol assistant preserva el historial previo para mantener continuidad de contexto."
                            ],
                            "exercise": {
                                "id": "ex_ia_02_02",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual rol dentro de la lista de mensajes de una API de chat se utiliza para definir las reglas globales de comportamiento, personalidad y restricciones del modelo?",
                                "options": [
                                    {"id": "a", "text": "system"},
                                    {"id": "b", "text": "user"},
                                    {"id": "c", "text": "assistant"},
                                    {"id": "d", "text": "admin"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El mensaje con rol 'system' establece las directrices maestras que orientan al modelo durante toda la interaccion."
                            }
                        },
                        {
                            "id": "les_ia_02_03",
                            "code": "L03",
                            "title": "Streaming de Tokens y Reduccion de Latencia",
                            "slug": "streaming-tokens-latencia",
                            "position": 3,
                            "concept_id": "ia-api-streaming-ttft",
                            "objective": "Consumir respuestas en streaming mediante generadores asincronos optimizando el Time-To-First-Token (TTFT).",
                            "theory_markdown": "Esperar a que un LLM genere una respuesta completa de 500 tokens puede tomar entre 3 y 8 segundos. Para el usuario humano, esa espera genera percepcion de lentitud.\n\n### La solucion: Streaming con `stream=True`\nAl habilitar `stream=True`, la API utiliza **Server-Sent Events (SSE)** para transmitir cada token tan pronto como es generado por el motor de inferencia.\n\nEsto reduce el **Time-To-First-Token (TTFT)** a menos de 300 milisegundos, mostrando el texto mecanografiandose en vivo en la pantalla del usuario:\n```python\nresponse = await client.chat.completions.create(\n    model='gpt-4o-mini',\n    messages=messages,\n    stream=True\n)\nasync for chunk in response:\n    delta = chunk.choices[0].delta.content\n    if delta:\n        print(delta, end='', flush=True)\n```",
                            "examples": [
                                {
                                    "title": "Consumo de stream asincrono en consola",
                                    "code": "import asyncio\nfrom openai import AsyncOpenAI\n\nasync def stream_demo():\n    client = AsyncOpenAI()\n    stream = await client.chat.completions.create(\n        model=\"gpt-4o-mini\",\n        messages=[{\"role\": \"user\", \"content\": \"Cuenta del 1 al 5\"}],\n        stream=True\n    )\n    async for chunk in stream:\n        texto = chunk.choices[0].delta.content or \"\"\n        print(texto, end=\"\", flush=True)",
                                    "output": "1, 2, 3, 4, 5 (impreso progresivamente token a token)",
                                    "explanation": "El bucle async for itera sobre cada fragmento (chunk) a medida que viaja por la conexion HTTP."
                                }
                            ],
                            "common_errors": "Intentar acceder a response.choices[0].message.content cuando se activa stream=True, arrojando AttributeError porque la respuesta es un flujo generador, no un objeto estatico.",
                            "mini_exercise": {
                                "instructions": "Escribe la condicion if para comprobar si chunk.choices[0].delta.content no es None antes de procesarlo.",
                                "starter_code": "# Comprueba delta\n# if ...:",
                                "solution": "if chunk.choices[0].delta.content is not None:"
                            },
                            "key_takeaways": [
                                "stream=True transmite tokens en tiempo real mediante Server-Sent Events (SSE).",
                                "Reduce el Time-To-First-Token (TTFT) mejorando radicalmente la UX.",
                                "Se consume iterando de forma asincrona con 'async for chunk in stream'."
                            ],
                            "exercise": {
                                "id": "ex_ia_02_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual metrica de experiencia de usuario mejora criticamente al activar stream=True en el consumo de APIs de LLMs?",
                                "options": [
                                    {"id": "a", "text": "Time-To-First-Token (TTFT), permitiendo al usuario comenzar a leer la respuesta casi de inmediato."},
                                    {"id": "b", "text": "El costo de facturacion por token."},
                                    {"id": "c", "text": "La resolucion de las imagenes generadas."},
                                    {"id": "d", "text": "El tamano del contexto del modelo."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El streaming entrega cada token segun se produce, abatiendo el tiempo de espera inicial percibido por el usuario final (TTFT)."
                            }
                        },
                        {
                            "id": "les_ia_02_04",
                            "code": "L04",
                            "title": "Rate Limits y Reintentos con Backoff Exponencial",
                            "slug": "rate-limits-backoff-exponencial",
                            "position": 4,
                            "concept_id": "da-api-rate-limits-backoff",
                            "objective": "Manejar errores HTTP 429 de saturacion de cuota aplicando backoff exponencial con jitter aleatorio mediante tenacity.",
                            "theory_markdown": "Las APIs de LLMs imponen limites de tasa estrictos:\n- **RPM:** Requests Per Minute (Peticiones por minuto).\n- **TPM:** Tokens Per Minute (Tokens por minuto).\n\nAl superar estos limites, la API responde con **HTTP 429 Too Many Requests**.\n\n### Estrategia de Reintento: Backoff Exponencial con Jitter\nReintentar inmediatamente solo agrava la saturacion del proveedor. La solucion de grado industrial es el **Backoff Exponencial con Jitter**:\n- Espera inicial: 1 segundo.\n- Segundo reintento: 2 segundos + variacion aleatoria (*jitter*).\n- Tercer reintento: 4 segundos + jitter.\n- Cuarto reintento: 8 segundos...\n\nEn Python se utiliza la libreria `tenacity`:\n```python\nfrom tenacity import retry, stop_after_attempt, wait_random_exponential\n\n@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(5))\nasync def llamada_robusta():\n    return await client.chat.completions.create(...)\n```",
                            "examples": [
                                {
                                    "title": "Decorador de reintento resiliente con tenacity",
                                    "code": "from tenacity import retry, stop_after_attempt, wait_exponential\n\n@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))\ndef peticion_segura():\n    # Si lanza RateLimitError o APIConnectionError, reintenta esperando exponencialmente\n    pass",
                                    "output": "La funcion reintenta de forma automatica espaciando los intentos si recibe un error 429.",
                                    "explanation": "El jitter aleatorio previene el efecto 'thundering herd' (avalancha de clientes reintentando al mismo segundo)."
                                }
                            ],
                            "common_errors": "Implementar bucles while de reintento inmediato sin ningun tiempo de espera sleep, provocando que la cuenta sea bloqueada temporalmente por flood.",
                            "mini_exercise": {
                                "instructions": "Usa el decorador @retry con stop=stop_after_attempt(3) de tenacity.",
                                "starter_code": "from tenacity import retry, stop_after_attempt\n\n# Aplica el decorador para 3 intentos\ndef operacion():\n    pass",
                                "solution": "from tenacity import retry, stop_after_attempt\n\n@retry(stop=stop_after_attempt(3))\ndef operacion():\n    pass"
                            },
                            "key_takeaways": [
                                "El error HTTP 429 se produce al superar los limites de RPM o TPM.",
                                "El backoff exponencial duplica el tiempo de espera entre intentos fallidos sucesivos.",
                                "El jitter aleatorio evita que multiples hilos colisionen reintentando simultaneamente."
                            ],
                            "exercise": {
                                "id": "ex_ia_02_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual codigo de estado HTTP devuelve una API de LLM cuando la aplicacion ha superado la cuota de peticiones por minuto (RPM) o tokens por minuto (TPM)?",
                                "options": [
                                    {"id": "a", "text": "429 Too Many Requests"},
                                    {"id": "b", "text": "404 Not Found"},
                                    {"id": "c", "text": "502 Bad Gateway"},
                                    {"id": "d", "text": "401 Unauthorized"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El codigo estandar HTTP 429 indica saturacion de cuota y exige aplicar pausas y reintentos con backoff exponencial."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "IA_M02",
            "module_slug": "ia-apis-modelos",
            "course_slug": "ai-agents",
            "questions": [
                {
                    "id": "q_ia_02_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Donde deben almacenarse de forma segura las API keys de servicios como OpenAI, Anthropic o Gemini?",
                    "options": [
                        {"id": "a", "text": "En variables de entorno del sistema operativo o gestores de secretos, nunca hardcodeadas en el codigo fuente."},
                        {"id": "b", "text": "En el archivo README.md publico del repositorio."},
                        {"id": "c", "text": "Como comentarios dentro de los scripts de Python."},
                        {"id": "d", "text": "En una cookie no segura enviada al navegador del cliente."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Las credenciales son secretos que deben inyectarse en tiempo de ejecucion mediante variables de entorno para evitar filtraciones."
                },
                {
                    "id": "q_ia_02_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "En una conversacion con una API de chat, que rol representa las respuestas previamente devueltas por el modelo para brindar memoria contextual?",
                    "options": [
                        {"id": "a", "text": "assistant"},
                        {"id": "b", "text": "user"},
                        {"id": "c", "text": "system"},
                        {"id": "d", "text": "history"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El rol 'assistant' modela los turnos previos del propio LLM dentro de la lista de mensajes conversacionales."
                },
                {
                    "id": "q_ia_02_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como se activa la transmision de tokens en tiempo real en la llamada chat.completions.create()?",
                    "options": [
                        {"id": "a", "text": "stream=True"},
                        {"id": "b", "text": "live=True"},
                        {"id": "c", "text": "realtime=True"},
                        {"id": "d", "text": "chunk_mode=True"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "stream=True activa la conexion persistente mediante Server-Sent Events transmitiendo cada token a medida que se genera."
                },
                {
                    "id": "q_ia_02_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "En que consiste la estrategia de 'Backoff Exponencial con Jitter' para gestionar respuestas HTTP 429?",
                    "options": [
                        {"id": "a", "text": "Duplicar progresivamente el tiempo de espera tras cada intento fallido (1s, 2s, 4s...) sumando una pequena variacion aleatoria para no saturar al servidor."},
                        {"id": "b", "text": "Reintentar mil veces por segundo de forma continua."},
                        {"id": "c", "text": "Apagar el servidor de inmediato sin registrar errores."},
                        {"id": "d", "text": "Cambiar el modelo de GPT-4 a GPT-3 automaticamente."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El backoff exponencial espacia los intentos de forma creciente y el jitter aleatorio dispersa los reintentos concurrentes."
                },
                {
                    "id": "q_ia_02_05",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "Que devuelve chunk.choices[0].delta.content al iterar sobre un stream asincrono de OpenAI?",
                    "options": [
                        {"id": "a", "text": "El nuevo fragmento de texto o token individual recibido en ese paquete SSE."},
                        {"id": "b", "text": "El documento completo de principio a fin."},
                        {"id": "c", "text": "Unicamente la fecha y hora de la llamada."},
                        {"id": "d", "text": "Un numero entero con el total de palabras."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "delta contiene solo la diferencia o incremento de contenido correspondiente a ese fragmento puntual emitido por el modelo."
                },
                {
                    "id": "q_ia_02_06",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual libreria de Python es popularmente utilizada para decorar funciones con politicas de reintentos robustos y backoff exponencial?",
                    "options": [
                        {"id": "a", "text": "tenacity"},
                        {"id": "b", "text": "matplotlib"},
                        {"id": "c", "text": "numpy"},
                        {"id": "d", "text": "jinja2"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "tenacity es la biblioteca lider en Python para configurar reintentos con diversas estrategias de espera (wait_exponential) y limites de parada."
                }
            ]
        }
    },
    {
        "dir": "03_salidas_estructuradas",
        "module_json": {
            "id": "ia_mod_03",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "IA_M03",
            "slug": "ia-salidas-estructuradas",
            "course_slug": "ai-agents",
            "title": "Salidas Estructuradas con Pydantic (Structured Outputs)",
            "objective": "Forzar a los modelos a emitir esquemas JSON 100% validos basados en modelos de Pydantic v2 garantizando confiabilidad en produccion.",
            "description": "Adios al parseo fragil con regex: esquemas estrictos con Structured Outputs, JSON Schema y validaciones de datos complejas.",
            "position": 53,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_ia_03_01",
                    "code": "S01",
                    "title": "Structured Outputs, Pydantic y Validacion Estricta",
                    "slug": "structured-outputs-pydantic",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_ia_03_01",
                            "code": "L01",
                            "title": "La Fragilidad del Parseo de Texto Libre",
                            "slug": "fragilidad-parseo-texto-libre",
                            "position": 1,
                            "concept_id": "ia-structured-free-text-fragility",
                            "objective": "Comprender los fallos comunes al intentar extraer JSON mediante prompts de texto y la necesidad de garantias sintacticas.",
                            "theory_markdown": "Tradicionalmente, para obtener datos de un LLM se le pedia: *'Responde solo en formato JSON'*. En produccion, este enfoque falla con frecuencia debido a:\n1. **Texto conversacional previo o posterior:** El modelo anade frases de cortesia como *'Por supuesto, aqui esta tu JSON:'* o bloques markdown ```json ... ```.\n2. **Alucinacion de sintaxis:** Comas sobrantes al final de listas (`trailing commas`), comillas simples en vez de dobles o claves sin comillas.\n3. **Claves faltantes o tipos inconsistentes:** Enviar un numero como string o cambiar el nombre del campo de `user_id` a `id_usuario`.\n\nIntentar limpiar estas salidas con expresiones regulares o `json.loads` en un bloque `try/except` es una fuente constante de fallas en arquitecturas empresariales.",
                            "examples": [
                                {
                                    "title": "Fallo tipico de parseo tradicional",
                                    "code": "import json\n\n# Lo que responde el modelo sin garantias:\nrespuesta_modelo = \"\"\"\nAqui tienes el resultado:\n{\n    'nombre': 'Koda',\n    'edad': 25,\n}\n\"\"\"\ntry:\n    datos = json.loads(respuesta_modelo) # FALLA: comillas simples, texto extra, trailing comma\nexcept json.JSONDecodeError as exc:\n    print(\"Error de parseo:\", exc)",
                                    "output": "Error de parseo: Expecting property name enclosed in double quotes",
                                    "explanation": "El parseo ingenuo con json.loads se rompe con cualquier desviacion minima del estandar JSON."
                                }
                            ],
                            "common_errors": "Confiar en que pedirle al modelo 'solo genera JSON' resolvera el 100% de los casos en produccion sin aplicar esquemas estrictos a nivel de API.",
                            "mini_exercise": {
                                "instructions": "Escribe una cadena JSON valida con claves entre comillas dobles y sin trailing comma.",
                                "starter_code": "# JSON valido\njson_str = ...",
                                "solution": "json_str = '{\"status\": \"ok\", \"codigo\": 200}'"
                            },
                            "key_takeaways": [
                                "Pedir JSON en texto plano es vulnerable a alucinaciones de sintaxis y texto extra.",
                                "json.loads falla ante comas finales, comillas simples o bloques markdown.",
                                "Las aplicaciones de produccion requieren garantias de esquema validadas a nivel de token."
                            ],
                            "exercise": {
                                "id": "ex_ia_03_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es el principal problema de pedirle a un LLM que devuelva JSON mediante instrucciones en lenguaje natural en el prompt?",
                                "options": [
                                    {"id": "a", "text": "El modelo no ofrece garantia determinista de sintaxis, pudiendo incluir texto conversacional, comas finales invalidas o claves alteradas que rompen json.loads."},
                                    {"id": "b", "text": "El modelo solo puede responder en lenguaje binario."},
                                    {"id": "c", "text": "La API cobra el triple de dinero si detecta la palabra JSON."},
                                    {"id": "d", "text": "Los navegadores web bloquean peticiones que contengan llaves."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Sin un mecanismo de decodificacion restringida (Constrained Decoding), el modelo genera tokens probabilistas que pueden desviarse de la gramatica JSON valida."
                            }
                        },
                        {
                            "id": "les_ia_03_02",
                            "code": "L02",
                            "title": "Structured Outputs con Pydantic y response_format",
                            "slug": "structured-outputs-pydantic-response-format",
                            "position": 2,
                            "concept_id": "ia-structured-pydantic-response-format",
                            "objective": "Integrar modelos de Pydantic v2 en response_format o el metodo parse() para forzar cumplimiento de esquema garantizado.",
                            "theory_markdown": "Las APIs modernas incorporan **Structured Outputs** con decodificacion guiada por gramatica (Constrained Decoding):\nEl motor de inferencia restringe matematicamente el muestreo de tokens: **unicamente se permite emitir tokens que cumplan con la gramatica del esquema JSON provisto**.\n\nEn Python, el SDK oficial integra **Pydantic v2** de forma transparente mediante el helper `client.beta.chat.completions.parse()`:\n```python\nfrom pydantic import BaseModel, Field\n\nclass Evento(BaseModel):\n    titulo: str = Field(description=\"Nombre del evento\")\n    asistentes: int = Field(ge=1, description=\"Cantidad de asistentes\")\n    es_virtual: bool\n\ncompletion = await client.beta.chat.completions.parse(\n    model=\"gpt-4o-mini\",\n    messages=[{\"role\": \"user\", \"content\": \"Conferencia de Python manana con 200 personas online\"}],\n    response_format=Evento\n)\nevento: Evento = completion.choices[0].message.parsed\n```\n`evento` es una instancia tipada de `Evento` ya validada por Pydantic.",
                            "examples": [
                                {
                                    "title": "Extraccion de entidades tipada garantizada",
                                    "code": "from pydantic import BaseModel\n\nclass PerfilUsuario(BaseModel):\n    nombre: str\n    habilidades: list[str]\n    anos_experiencia: int\n\n# Con parse(..., response_format=PerfilUsuario):\n# La respuesta retornara una instancia exacta de PerfilUsuario sin fallos de esquema.",
                                    "output": "PerfilUsuario(nombre='Sara', habilidades=['Python', 'FastAPI'], anos_experiencia=4)",
                                    "explanation": "El modelo no puede emitir texto previo ni claves no declaradas en el modelo Pydantic."
                                }
                            ],
                            "common_errors": "Usar response_format={\"type\": \"json_object\"} creyendo que valida el esquema de campos; 'json_object' solo garantiza sintaxis JSON general, mientras que Structured Outputs con Pydantic garantiza las claves y tipos exactos.",
                            "mini_exercise": {
                                "instructions": "Declara un modelo Pydantic llamado 'Producto' con 'nombre: str' y 'precio: float'.",
                                "starter_code": "from pydantic import BaseModel\n\n# Define Producto\n",
                                "solution": "from pydantic import BaseModel\n\nclass Producto(BaseModel):\n    nombre: str\n    precio: float"
                            },
                            "key_takeaways": [
                                "Structured Outputs utiliza decodificacion restringida para garantizar 100% de cumplimiento sintactico.",
                                "client.beta.chat.completions.parse() deserializa directamente a instancias de Pydantic.",
                                "Asegura nombres de campos, tipos estrictos y ausencia total de texto conversacional."
                            ],
                            "exercise": {
                                "id": "ex_ia_03_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es la diferencia entre response_format={'type': 'json_object'} y Structured Outputs con un modelo Pydantic?",
                                "options": [
                                    {"id": "a", "text": "json_object solo asegura que la salida sea un JSON sintacticamente valido pero no restringe las claves ni los tipos; Structured Outputs fuerza el cumplimiento exacto del esquema definido por el modelo Pydantic."},
                                    {"id": "b", "text": "json_object es solo para imagenes y Pydantic para textos."},
                                    {"id": "c", "text": "No existe diferencia practica."},
                                    {"id": "d", "text": "Structured Outputs funciona sin modelos de lenguaje."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Structured Outputs garantiza que los campos solicitados esten presentes y coincidan con los tipos especificados en el schema sin omisiones ni invenciones."
                            }
                        },
                        {
                            "id": "les_ia_03_03",
                            "code": "L03",
                            "title": "Manejo de Errores y Validacion de Negocio",
                            "slug": "manejo-errores-validacion-negocio",
                            "position": 3,
                            "concept_id": "ia-structured-validation-errors",
                            "objective": "Capturar rechazos del modelo (refusals) y manejar validaciones complejas de negocio sobre los datos estructurados.",
                            "theory_markdown": "Incluso con Structured Outputs existen dos escenarios que deben gestionarse en el codigo:\n\n1. **Rechazos por Seguridad (`message.refusal`):**\n   Si la solicitud del usuario viola las politicas de seguridad del proveedor, el modelo no emite el esquema sino un mensaje de rechazo textual en `message.refusal`:\n   ```python\n   if completion.choices[0].message.refusal:\n       print(\"Solicitud rechazada:\", completion.choices[0].message.refusal)\n   ```\n\n2. **Validadores de Negocio en Pydantic:**\n   Podemos anadir `@field_validator` en el modelo Pydantic para corroborar reglas de dominio (ej. verificar que un email pertenezca a un dominio empresarial). Si la salida del LLM infringe la regla, Pydantic eleva un `ValidationError` en Python.",
                            "examples": [
                                {
                                    "title": "Comprobacion de rechazo y validacion",
                                    "code": "from pydantic import BaseModel, field_validator\n\nclass OrdenCompra(BaseModel):\n    codigo_item: str\n    cantidad: int\n\n    @field_validator(\"cantidad\")\n    @classmethod\n    def cantidad_positiva(cls, v: int) -> int:\n        if v <= 0:\n            raise ValueError(\"La cantidad debe ser mayor que cero\")\n        return v",
                                    "output": "Si el modelo extrae cantidad=-5, Pydantic lanza ValidationError de inmediato en el backend.",
                                    "explanation": "Los validadores de Pydantic complementan las restricciones sintacticas con logica de negocio real."
                                }
                            ],
                            "common_errors": "Asumir que completion.choices[0].message.parsed siempre estara presente sin verificar previamente si message.refusal contiene un texto de bloqueo de seguridad.",
                            "mini_exercise": {
                                "instructions": "Escribe una condicion que retorne 'Rechazado' si message.refusal no es None.",
                                "starter_code": "# Comprueba refusal\n# if ...:",
                                "solution": "if message.refusal is not None:\n    return \"Rechazado\""
                            },
                            "key_takeaways": [
                                "message.refusal indica que el modelo rechazo responder por politicas de seguridad.",
                                "@field_validator aplica reglas de negocio de Python sobre los datos emitidos por la IA.",
                                "La combinacion de Structured Outputs y Pydantic blinda el sistema contra entradas corruptas."
                            ],
                            "exercise": {
                                "id": "ex_ia_03_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que propiedad de completion.choices[0].message debe inspeccionarse para saber si el modelo se nego a responder por violacion de politicas de contenido en Structured Outputs?",
                                "options": [
                                    {"id": "a", "text": "message.refusal"},
                                    {"id": "b", "text": "message.error_code"},
                                    {"id": "c", "text": "message.is_blocked"},
                                    {"id": "d", "text": "message.status_reject"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Cuando un modelo decide no contestar una peticion sensible bajo Structured Outputs, puebla el atributo message.refusal con el motivo del rechazo."
                            }
                        },
                        {
                            "id": "les_ia_03_04",
                            "code": "L04",
                            "title": "Esquemas Complejos, Enums y Modelos Anidados",
                            "slug": "esquemas-complejos-enums-anidados",
                            "position": 4,
                            "concept_id": "ia-structured-nested-enums",
                            "objective": "Disenar esquemas jerarquicos con listas de objetos y tipos enumerados Enum para clasificaciones discretas.",
                            "theory_markdown": "Structured Outputs soporta estructuras complejas multidimensionales:\n\n### 1. Clasificaciones con `Enum`\nPara obligar al modelo a elegir exactamente una opcion de un catalogo cerrado sin inventar categorias:\n```python\nfrom enum import Enum\nfrom pydantic import BaseModel\n\nclass Prioridad(str, Enum):\n    BAJA = \"baja\"\n    MEDIA = \"media\"\n    ALTA = \"alta\"\n    CRITICA = \"critica\"\n```\n\n### 2. Modelos Anidados y Listas de Entidades\nPermite extraer multiples entidades jerarquicas en una sola pasada:\n```python\nclass Tarea(BaseModel):\n    descripcion: str\n    responsable: str\n    prioridad: Prioridad\n\nclass PlanAccion(BaseModel):\n    proyecto: str\n    tareas: list[Tarea]\n```",
                            "examples": [
                                {
                                    "title": "Extraccion de multiples entidades con Enum",
                                    "code": "from enum import Enum\nfrom pydantic import BaseModel\n\nclass Sentimiento(str, Enum):\n    POSITIVO = \"positivo\"\n    NEGATIVO = \"negativo\"\n    NEUTRO = \"neutro\"\n\nclass ResenaAnalizada(BaseModel):\n    sentimiento: Sentimiento\n    puntos_clave: list[str]\n    calificacion_estimada: int",
                                    "output": "ResenaAnalizada(sentimiento=<Sentimiento.POSITIVO>, puntos_clave=['bateria durable', 'pantalla brillante'], calificacion_estimada=5)",
                                    "explanation": "El modelo esta forzado a seleccionar exclusivamente uno de los tres valores definidos en Sentimiento."
                                }
                            ],
                            "common_errors": "Crear Enums sin heredar de str (usar solo Enum en vez de (str, Enum)), lo que puede generar problemas de serializacion a JSON Schema.",
                            "mini_exercise": {
                                "instructions": "Declara un Enum llamado Categoria que herede de (str, Enum) con los valores TECH = 'tech' y LEGAL = 'legal'.",
                                "starter_code": "from enum import Enum\n\n# Define Categoria\n",
                                "solution": "from enum import Enum\n\nclass Categoria(str, Enum):\n    TECH = \"tech\"\n    LEGAL = \"legal\""
                            },
                            "key_takeaways": [
                                "Enum acota las opciones del modelo a un conjunto estricto de categorias validas.",
                                "Modelos anidados (list[ModeloHijo]) permiten extraer grafos de datos complejos en una pasada.",
                                "Heredar de (str, Enum) garantiza compatibilidad directa con JSON Schema."
                            ],
                            "exercise": {
                                "id": "ex_ia_03_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es el beneficio principal de utilizar un Enum de Python en un modelo Pydantic para Structured Outputs?",
                                "options": [
                                    {"id": "a", "text": "Restringe estrictamente al modelo para que solo pueda seleccionar uno de los valores predefinidos en el catalogo, impidiendo alucinaciones de categorias."},
                                    {"id": "b", "text": "Reduce la velocidad del modelo para ahorrar ancho de banda."},
                                    {"id": "c", "text": "Convierte la respuesta en una imagen SVG."},
                                    {"id": "d", "text": "Obliga a que el modelo responda en idioma latin."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Un Enum define un conjunto cerrado de valores validos en el JSON Schema; la decodificacion restringida hace imposible que el LLM emita una categoria ajena."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "IA_M03",
            "module_slug": "ia-salidas-estructuradas",
            "course_slug": "ai-agents",
            "questions": [
                {
                    "id": "q_ia_03_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Por que el parseo de salidas de LLM usando json.loads() simple es fragil en sistemas de produccion?",
                    "options": [
                        {"id": "a", "text": "Porque los modelos sin decodificacion guiada pueden incluir saludos conversacionales, markdown o comas finales que violan la especificacion JSON."},
                        {"id": "b", "text": "Porque json.loads() no soporta numeros mayores a 100."},
                        {"id": "c", "text": "Porque Python solo permite parsear archivos de texto plano."},
                        {"id": "d", "text": "Porque las APIs de IA no transmiten caracteres ASCII."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "La generacion probabilistica libre no asegura rigidez sintactica; variaciones minimas invalidan el deserializador estandar de JSON."
                },
                {
                    "id": "q_ia_03_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como garantiza tecnicamente Structured Outputs que la respuesta del modelo cumpla al 100% el esquema provisto?",
                    "options": [
                        {"id": "a", "text": "Mediante decodificacion restringida (Constrained Decoding), donde el motor de muestreo de tokens bloquea cualquier token que rompa la gramatica del esquema JSON."},
                        {"id": "b", "text": "Reescribiendo el codigo fuente del LLM durante la noche."},
                        {"id": "c", "text": "Eliminando los tokens que contengan errores gramaticales despues de emitirlos."},
                        {"id": "d", "text": "Enviando la respuesta a un equipo humano de moderacion."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El motor de inferencia calcula una mascara de logits en cada token, permitiendo muestrear unicamente aquellos simbolos validos segun la gramatica del schema."
                },
                {
                    "id": "q_ia_03_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que metodo del SDK moderno de OpenAI permite enviar directamente una clase BaseModel de Pydantic como response_format y recibir el objeto parseado?",
                    "options": [
                        {"id": "a", "text": "client.beta.chat.completions.parse()"},
                        {"id": "b", "text": "client.chat.completions.to_pydantic()"},
                        {"id": "c", "text": "client.chat.validate_model()"},
                        {"id": "d", "text": "client.completions.schema_fit()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El endpoint helper client.beta.chat.completions.parse() gestiona la conversion de Pydantic a JSON Schema y la deserializacion automatica."
                },
                {
                    "id": "q_ia_03_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Que ocurre si un usuario solicita informacion prohibida por las politicas de seguridad cuando se usa client.beta.chat.completions.parse()?",
                    "options": [
                        {"id": "a", "text": "parsed sera None y el atributo completion.choices[0].message.refusal contendra la explicacion del rechazo del modelo."},
                        {"id": "b", "text": "Se lanza una excepcion de sistema operativo no recuperable."},
                        {"id": "c", "text": "El modelo emite un esquema con todos los campos en None."},
                        {"id": "d", "text": "El servidor de Python se reinicia de inmediato."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Structured Outputs gestiona las negativas de seguridad mediante el campo especifico message.refusal, dejando parsed en None."
                },
                {
                    "id": "q_ia_03_05",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "Como se define en Pydantic un campo que obligue al modelo a elegir exclusivamente entre 'baja', 'media' o 'alta'?",
                    "options": [
                        {"id": "a", "text": "Usando un Enum de Python: class Nivel(str, Enum): BAJA = 'baja' ... y asignando nivel: Nivel"},
                        {"id": "b", "text": "Escribiendo en el prompt 'por favor elige solo baja, media o alta' sin tipos"},
                        {"id": "c", "text": "Declarando nivel: str y validandolo con un if manual despues"},
                        {"id": "d", "text": "No es posible restringir opciones en Pydantic"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Los tipos enumerados (Enum) se traducen en arrays 'enum' en el JSON Schema garantizando que no se puedan emitir otras palabras."
                },
                {
                    "id": "q_ia_03_06",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que ventaja proporciona usar modelos anidados (list[ModeloHijo]) en esquemas de Structured Outputs?",
                    "options": [
                        {"id": "a", "text": "Permite extraer colecciones de multiples entidades estructuradas y sus relaciones en una unica invocacion al modelo."},
                        {"id": "b", "text": "Reduce el uso de memoria RAM a cero."},
                        {"id": "c", "text": "Evita tener que pagar por la conexion de red."},
                        {"id": "d", "text": "Hace que el modelo responda en audio."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Los esquemas jerarquicos permiten capturar estructuras relacionales complejas (ej. facturas con lista de articulos) con tipado garantizado."
                }
            ]
        }
    },
    {
        "dir": "04_function_calling",
        "module_json": {
            "id": "ia_mod_04",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "IA_M04",
            "slug": "ia-function-calling",
            "course_slug": "ai-agents",
            "title": "Function Calling y Conexion de Herramientas (Tools)",
            "objective": "Capacitar al modelo para invocar funciones de Python externas, conectar APIs y bases de datos, y orquestar llamadas a herramientas paralelas.",
            "description": "El puente entre el razonamiento de la IA y el mundo real: especificacion de herramientas JSON Schema, bucle de ejecucion y tool calls paralelas.",
            "position": 54,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_ia_04_01",
                    "code": "S01",
                    "title": "Herramientas, Invocacion de Funciones y Ejecucion Paralela",
                    "slug": "herramientas-function-calling",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 55,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_ia_04_01",
                            "code": "L01",
                            "title": "El Concepto de Function Calling y Separacion de Roles",
                            "slug": "concepto-function-calling-roles",
                            "position": 1,
                            "concept_id": "ia-fc-concept-separation",
                            "objective": "Comprender la frontera arquitectonica: el LLM no ejecuta codigo, solo decide que herramienta invocar y emite sus argumentos.",
                            "theory_markdown": "Una de las confusiones mas comunes sobre **Function Calling** es asumir que el modelo de lenguaje ejecuta codigo en tu servidor.\n\n### El Rol Estricto del LLM en Function Calling\n1. El LLM **NO ejecuta codigo** ni tiene acceso directo a tu base de datos o APIs.\n2. El LLM actua como un **analizador de intenciones y generador de llamadas estructuradas**.\n3. Tu aplicacion en Python proporciona una lista de herramientas disponibles con descripciones y parametros.\n4. Si el modelo detecta que para responder la pregunta del usuario necesita consultar el clima o la base de datos, suspende la generacion de texto y responde con un objeto **`tool_calls`**, especificando el nombre de la funcion y los argumentos en JSON.\n5. **Tu codigo Python ejecuta la funcion real**, captura el resultado y se lo devuelve al modelo para que elabore la respuesta final.",
                            "examples": [
                                {
                                    "title": "El ciclo de Function Calling",
                                    "code": "# 1. Usuario: 'Cual es el saldo de la cuenta 456?'\n# 2. LLM emite: tool_calls=[{'name': 'consultar_saldo', 'arguments': '{\"cuenta_id\": 456}'}]\n# 3. Tu backend Python ejecuta: saldo = db.obtener_saldo(456)  # retorna 1500.0\n# 4. Tu backend envia al LLM: {'role': 'tool', 'content': '1500.0', 'tool_call_id': '...'}\n# 5. LLM responde al usuario: 'El saldo actual de la cuenta 456 es de $1,500.00 USD.'",
                                    "output": "Interaccion fluida donde la logica de negocio real se ejecuta de forma segura en Python.",
                                    "explanation": "El LLM actua como orquestador cognitivo, pero el control de ejecucion reside en tu backend."
                                }
                            ],
                            "common_errors": "Creer que la API de OpenAI o Anthropic ejecutara la funcion de Python automaticamente en sus servidores sin intervencion de tu codigo.",
                            "mini_exercise": {
                                "instructions": "Escribe una frase resumiendo quien ejecuta efectivamente la funcion en el patron Function Calling.",
                                "starter_code": "# Quien ejecuta la funcion?\nejecutor = ...",
                                "solution": "ejecutor = \"Tu propio backend en Python ejecuta la funcion real, no el LLM.\""
                            },
                            "key_takeaways": [
                                "El LLM no ejecuta codigo; genera solicitudes de llamada con argumentos estructurados.",
                                "Tu aplicacion en Python ejecuta la funcion real de forma segura y controlada.",
                                "El resultado de la ejecucion se retroalimenta al modelo con el rol 'tool'."
                            ],
                            "exercise": {
                                "id": "ex_ia_04_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la responsabilidad del LLM dentro del patron de Function Calling?",
                                "options": [
                                    {"id": "a", "text": "Determinar si necesita invocar una herramienta y emitir el nombre de la funcion y sus argumentos estructurados en formato JSON."},
                                    {"id": "b", "text": "Ejecutar directamente las sentencias SQL en la base de datos de produccion."},
                                    {"id": "c", "text": "Compilar el script de Python a un binario ejecutable."},
                                    {"id": "d", "text": "Realizar peticiones HTTP directas saltandose el backend del usuario."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El modelo solo planifica y genera los parametros estructurados; la ejecucion del codigo local reside en el backend de la aplicacion."
                            }
                        },
                        {
                            "id": "les_ia_04_02",
                            "code": "L02",
                            "title": "Definicion de Especificaciones de Herramientas (JSON Schema)",
                            "slug": "especificaciones-herramientas-json-schema",
                            "position": 2,
                            "concept_id": "ia-fc-tool-definitions",
                            "objective": "Declarar herramientas estructuradas mediante JSON Schema o funciones de Pydantic con descripciones semanticas claras.",
                            "theory_markdown": "Para que el LLM sepa cuando invocar una herramienta, se le pasa una lista de herramientas (`tools`) en la peticion.\n\n### Anatomia de una Herramienta\n- `type`: Debe ser `'function'`.\n- `function.name`: Identificador unico (ej. `'obtener_clima'`).\n- `function.description`: **Es el elemento mas critico**. El modelo lee esta descripcion para decidir si la herramienta es relevante para resolver la peticion del usuario.\n- `function.parameters`: Objeto JSON Schema que detalla los argumentos esperados, sus tipos y la lista de campos obligatorios (`required`).",
                            "examples": [
                                {
                                    "title": "Especificacion estandar de herramienta",
                                    "code": "tools = [\n    {\n        \"type\": \"function\",\n        \"function\": {\n            \"name\": \"consultar_clima\",\n            \"description\": \"Obtiene la temperatura y condicion meteorologica actual de una ciudad.\",\n            \"parameters\": {\n                \"type\": \"object\",\n                \"properties\": {\n                    \"ciudad\": {\"type\": \"string\", \"description\": \"Nombre de la ciudad, ej. Bogota\"},\n                    \"unidad\": {\"type\": \"string\", \"enum\": [\"celsius\", \"fahrenheit\"]}\n                },\n                \"required\": [\"ciudad\"]\n            }\n        }\n    }\n]",
                                    "output": "Definicion estructurada lista para el parametro tools=[...] en la llamada de API.",
                                    "explanation": "La propiedad description orienta al modelo sobre el contexto exacto en el que debe disparar la llamada."
                                }
                            ],
                            "common_errors": "Dejar la propiedad description vacia o poco clara (ej. 'funcion de datos'), impidiendo que el modelo sepa cuando debe usarla.",
                            "mini_exercise": {
                                "instructions": "Define un diccionario de herramienta con type='function' y function={'name': 'obtener_hora', 'description': 'Retorna la hora actual'}.",
                                "starter_code": "# Herramienta hora\ntool_hora = ...",
                                "solution": "tool_hora = {\"type\": \"function\", \"function\": {\"name\": \"obtener_hora\", \"description\": \"Retorna la hora actual\"}}"
                            },
                            "key_takeaways": [
                                "Las herramientas se describen mediante la especificacion JSON Schema.",
                                "La propiedad 'description' es la guia semantica que el LLM utiliza para elegir la herramienta.",
                                "Los campos 'required' especifican los argumentos indispensables."
                            ],
                            "exercise": {
                                "id": "ex_ia_04_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Por que es fundamental redactar descripciones precisas y detalladas en el campo 'description' de una herramienta en Function Calling?",
                                "options": [
                                    {"id": "a", "text": "Porque el modelo de lenguaje utiliza exclusivamente esa descripcion semantica para razonar y decidir si esa herramienta es pertinente para la solicitud del usuario."},
                                    {"id": "b", "text": "Porque Python lanza un error de compilacion si la descripcion tiene menos de 50 palabras."},
                                    {"id": "c", "text": "Porque esa descripcion se imprime directamente en la consola del cliente."},
                                    {"id": "d", "text": "Porque define el puerto TCP de conexion a internet."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El LLM selecciona herramientas basandose en la similitud semantica y logica entre la intencion del usuario y la descripcion provista en la metadata de la funcion."
                            }
                        },
                        {
                            "id": "les_ia_04_03",
                            "code": "L03",
                            "title": "El Bucle de Ejecucion de Herramientas",
                            "slug": "bucle-ejecucion-herramientas",
                            "position": 3,
                            "concept_id": "ia-fc-execution-loop",
                            "objective": "Implementar el ciclo completo: detectar tool_calls, parsear argumentos con json.loads, ejecutar la funcion y retornar el rol tool.",
                            "theory_markdown": "El flujo completo de integracion se estructura en 5 pasos:\n\n1. Se llama a la API pasando `tools=tools`.\n2. Se comprueba si la respuesta contiene llamadas a herramientas: `message.tool_calls`.\n3. Si existen, **se agrega el mensaje del asistente a la lista de mensajes acumulada** (es obligatorio para mantener la consistencia del protocolo):\n   `messages.append(message)`.\n4. Para cada `tool_call` en `message.tool_calls`:\n   - Se parsean los argumentos JSON: `args = json.loads(tool_call.function.arguments)`.\n   - Se ejecuta la funcion correspondiente en Python: `res = mi_funcion(**args)`.\n   - Se agrega un mensaje con rol `'tool'` que incluye el contenido en string y el `tool_call_id` correspondiente:\n     `messages.append({'role': 'tool', 'tool_call_id': tool_call.id, 'content': str(res)})`.\n5. Se vuelve a invocar a la API con la lista de mensajes completa para que el modelo redacte la respuesta final.",
                            "examples": [
                                {
                                    "title": "Implementacion del bucle de herramienta en Python",
                                    "code": "import json\n\ndef sumar(a: int, b: int) -> int:\n    return a + b\n\nMAPA_FUNCIONES = {\"sumar\": sumar}\n\n# Simulando respuesta con tool_call:\n# for tc in message.tool_calls:\n#     fn = MAPA_FUNCIONES[tc.function.name]\n#     args = json.loads(tc.function.arguments)\n#     resultado = fn(**args)\n#     messages.append({\"role\": \"tool\", \"tool_call_id\": tc.id, \"content\": str(resultado)})",
                                    "output": "El resultado se inyecta con rol 'tool' y el tool_call_id vinculado exactamente.",
                                    "explanation": "El tool_call_id vincula cada respuesta con su solicitud de ejecucion original."
                                }
                            ],
                            "common_errors": "Omitir el tool_call_id al responder con el rol 'tool', provocando un error de API HTTP 400 por violacion del protocolo de emparejamiento de herramientas.",
                            "mini_exercise": {
                                "instructions": "Escribe un diccionario de respuesta de herramienta con rol 'tool', tool_call_id='call_123' y content='{\"temperatura\": 22}'.",
                                "starter_code": "# Mensaje tool\ntool_msg = ...",
                                "solution": "tool_msg = {\"role\": \"tool\", \"tool_call_id\": \"call_123\", \"content\": '{\"temperatura\": 22}'}"
                            },
                            "key_takeaways": [
                                "Es obligatorio adjuntar el mensaje del assistant con tool_calls antes de enviar las respuestas tool.",
                                "Cada respuesta de herramienta debe incluir su respectivo tool_call_id.",
                                "El contenido de la herramienta siempre debe enviarse serializado a string."
                            ],
                            "exercise": {
                                "id": "ex_ia_04_03",
                                "type": "single_choice",
                                "difficulty": "hard",
                                "prompt": "Cual identificador debe incluir obligatoriamente el mensaje con rol 'tool' al retornar el resultado de la ejecucion al LLM?",
                                "options": [
                                    {"id": "a", "text": "tool_call_id correspondiente al id de la peticion emitida por el modelo."},
                                    {"id": "b", "text": "El numero de proceso PID de Python en el sistema operativo."},
                                    {"id": "c", "text": "El token JWT del usuario."},
                                    {"id": "d", "text": "El hash SHA-256 del codigo fuente de la funcion."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "tool_call_id permite a la API emparejar cada resultado con la llamada especifica generada por el modelo, especialmente cuando hay multiples llamadas paralelas."
                            }
                        },
                        {
                            "id": "les_ia_04_04",
                            "code": "L04",
                            "title": "Herramientas Multiples y Ejecucion en Paralelo",
                            "slug": "herramientas-multiples-paralelo",
                            "position": 4,
                            "concept_id": "ia-fc-parallel-calls",
                            "objective": "Gestionar invocaciones simultaneas (Parallel Tool Calling) ejecutando herramientas concurrentemente con asyncio.gather.",
                            "theory_markdown": "Los modelos avanzados son capaces de emitir **Parallel Tool Calling**: si el usuario pregunta *'Cual es el clima en Bogota, Lima y Madrid?'*, el modelo puede emitir 3 llamadas de herramientas dentro de la misma respuesta (`message.tool_calls` contiene 3 elementos).\n\n### Ejecucion Concurrente con `asyncio.gather`\nEjecutarlas de forma secuencial multiplicaria la latencia por 3. En su lugar, se ejecutan de forma concurrente con `asyncio.gather`:\n```python\nasync def ejecutar_herramienta(tool_call):\n    fn = MAPA_FUNCIONES[tool_call.function.name]\n    args = json.loads(tool_call.function.arguments)\n    res = await fn(**args)\n    return {\n        'role': 'tool',\n        'tool_call_id': tool_call.id,\n        'content': str(res)\n    }\n\n# Ejecucion paralela no bloqueante:\nrespuestas_tools = await asyncio.gather(\n    *[ejecutar_herramienta(tc) for tc in message.tool_calls]\n)\nmessages.extend(respuestas_tools)\n```",
                            "examples": [
                                {
                                    "title": "Resolucion paralela de 3 peticiones en 1 solo ciclo",
                                    "code": "# message.tool_calls contiene 3 llamadas independientes\n# asyncio.gather dispara las 3 peticiones HTTP a la API meteorologica en paralelo.\n# El tiempo total es igual al de la llamada individual mas lenta (~300ms en lugar de ~900ms).",
                                    "output": "Todas las herramientas se ejecutan concurrentemente y se anexan a messages.",
                                    "explanation": "Parallel Tool Calling reduce drasticamente la latencia global de asistentes multifuncion."
                                }
                            ],
                            "common_errors": "Ejecutar las tool calls paralelas en un bucle for sincrono bloqueante, perdiendo la ventaja de velocidad de la emision simultanea del modelo.",
                            "mini_exercise": {
                                "instructions": "Usa asyncio.gather con unpack (*) para ejecutar una lista de corutinas 'tareas'.",
                                "starter_code": "import asyncio\n\n# Ejecuta tareas en paralelo\n# resultados = await ...",
                                "solution": "resultados = await asyncio.gather(*tareas)"
                            },
                            "key_takeaways": [
                                "Los LLMs pueden emitir multiples tool_calls en un unico turno de respuesta.",
                                "asyncio.gather permite ejecutar todas las herramientas en paralelo.",
                                "Todas las respuestas tool deben ser agregadas antes de solicitar la conclusion final."
                            ],
                            "exercise": {
                                "id": "ex_ia_04_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que ventaja proporciona la capacidad de Parallel Tool Calling en un modelo de lenguaje?",
                                "options": [
                                    {"id": "a", "text": "Permite que el modelo emita multiples llamadas a herramientas simultaneamente en una sola respuesta, reduciendo los turnos de comunicacion y permitiendo su ejecucion paralela."},
                                    {"id": "b", "text": "Permite usar el modelo sin conexion a internet."},
                                    {"id": "c", "text": "Elimina la necesidad de definir el esquema de parametros."},
                                    {"id": "d", "text": "Obliga a usar Docker en cada herramienta."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El modelo puede solicitar varios datos independientes en un solo turno, permitiendo al backend procesarlos concurrentemente con maxima eficiencia de tiempo."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "IA_M04",
            "module_slug": "ia-function-calling",
            "course_slug": "ai-agents",
            "questions": [
                {
                    "id": "q_ia_04_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Quien es responsable de ejecutar el codigo real de la funcion en el patron de Function Calling?",
                    "options": [
                        {"id": "a", "text": "La aplicacion o backend en Python del desarrollador, nunca los servidores del proveedor del LLM."},
                        {"id": "b", "text": "El servidor del modelo de lenguaje de forma remota en un sandbox."},
                        {"id": "c", "text": "El navegador del usuario final mediante JavaScript."},
                        {"id": "d", "text": "El sistema operativo del router de red."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El LLM solo genera los nombres y argumentos JSON; la ejecucion efectiva reside en el entorno y bajo la seguridad del backend del usuario."
                },
                {
                    "id": "q_ia_04_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual formato estandar se utiliza para describir los parametros y tipos de una herramienta en el argumento tools de la API?",
                    "options": [
                        {"id": "a", "text": "JSON Schema"},
                        {"id": "b", "text": "XML DTD"},
                        {"id": "c", "text": "YAML 1.1"},
                        {"id": "d", "text": "Protocol Buffers binario"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El estandar JSON Schema define los tipos (string, number, object), descripciones y restricciones requeridas para cada argumento de la herramienta."
                },
                {
                    "id": "q_ia_04_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que rol de mensaje debe asignarse al retornar el resultado de la ejecucion de una funcion al modelo?",
                    "options": [
                        {"id": "a", "text": "tool"},
                        {"id": "b", "text": "function_result"},
                        {"id": "c", "text": "system"},
                        {"id": "d", "text": "environment"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "En el protocolo estandar de chat, los resultados de herramientas se inyectan como mensajes con 'role': 'tool'."
                },
                {
                    "id": "q_ia_04_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Por que es obligatorio incluir el mensaje del assistant que origino las tool_calls en el historial antes de agregar las respuestas tool?",
                    "options": [
                        {"id": "a", "text": "Porque la API requiere mantener la coherencia del protocolo; una respuesta tool sin su correspondiente peticion assistant previa es invalida y produce un error HTTP 400."},
                        {"id": "b", "text": "Para duplicar el cobro de tokens."},
                        {"id": "c", "text": "Para reiniciar el bucle de eventos."},
                        {"id": "d", "text": "Porque Pydantic lo exige en sus decoradores."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El protocolo de Chat exige que toda respuesta con rol tool este antecedida de forma inmediata por el mensaje del assistant que solicito dicha llamada."
                },
                {
                    "id": "q_ia_04_05",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "Que funcion de asyncio permite ejecutar de forma concurrente una lista de llamadas a herramientas independientes generadas por Parallel Tool Calling?",
                    "options": [
                        {"id": "a", "text": "asyncio.gather()"},
                        {"id": "b", "text": "asyncio.wait_one()"},
                        {"id": "c", "text": "asyncio.chain()"},
                        {"id": "d", "text": "asyncio.sequence()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "asyncio.gather(*tareas) ejecuta multiples corutinas en paralelo esperando a que todas concluyan sus operaciones de red."
                },
                {
                    "id": "q_ia_04_06",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Como viajan los argumentos dentro del objeto tool_call emitido por el modelo?",
                    "options": [
                        {"id": "a", "text": "Como una cadena serializada en formato JSON en tool_call.function.arguments."},
                        {"id": "b", "text": "Como un objeto compilado en C++."},
                        {"id": "c", "text": "Como una tupla de valores separados por comas sin nombres."},
                        {"id": "d", "text": "Como un archivo comprimido en ZIP."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Los argumentos son transmitidos como una cadena de texto en JSON que debe parsearse con json.loads() en Python."
                }
            ]
        }
    },
    {
        "dir": "05_memoria_contexto",
        "module_json": {
            "id": "ia_mod_05",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "IA_M05",
            "slug": "ia-memoria-y-contexto",
            "course_slug": "ai-agents",
            "title": "Gestion de Memoria y Ventana de Contexto (Context Window)",
            "objective": "Superar la naturaleza sin estado (stateless) de los LLMs gestionando memoria conversacional: ventanas deslizantes, resumen dinamico y persistencia.",
            "description": "Patrones de memoria para asistentes y agentes: tecnicas para retener contexto a largo plazo sin desbordar tokens ni disparar costes.",
            "position": 55,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_ia_05_01",
                    "code": "S01",
                    "title": "Arquitecturas de Memoria y Optimizacion de Contexto",
                    "slug": "arquitecturas-memoria-contexto",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_ia_05_01",
                            "code": "L01",
                            "title": "La Naturaleza Sin Estado (Statelessness) de los LLMs",
                            "slug": "naturaleza-stateless-llms",
                            "position": 1,
                            "concept_id": "ia-memory-statelessness",
                            "objective": "Comprender por que las APIs de modelos de lenguaje no poseen memoria entre peticiones y como se construye la ilusion de continuidad.",
                            "theory_markdown": "Una API de LLM es **completamente stateless (sin estado)**: cada peticion HTTP es una transaccion aislada y atomica. El modelo no guarda memoria de quien eres ni de lo que conversaste hace dos segundos.\n\n### Como se construye la 'memoria'\nLa ilusion de una conversacion continua existe unicamente porque la aplicacion cliente **re-envia todo el historial de mensajes acumulado en cada nueva peticion**:\n\n- Peticion 1: `[User: 'Hola']` -> `Assistant: 'Como te ayudo?'`\n- Peticion 2: `[User: 'Hola', Assistant: 'Como te ayudo?', User: 'Mi nombre es Alex']`\n- Peticion 3: `[User: 'Hola', Assistant: ..., User: 'Mi nombre es Alex', Assistant: ..., User: 'Cual es mi nombre?']`\n\n### El Dilema del Crecimiento Exponencial\nA medida que la conversacion se extiende:\n1. El consumo de tokens de entrada escala exponencialmente en cada turno.\n2. Se incrementa el costo monetario de la API.\n3. Se incrementa la latencia de respuesta.\n4. Se corre el riesgo de desbordar el limite del Context Window.",
                            "examples": [
                                {
                                    "title": "Crecimiento del buffer de memoria",
                                    "code": "buffer_conversacion = []\n\ndef chatear(mensaje_usuario: str):\n    buffer_conversacion.append({\"role\": \"user\", \"content\": mensaje_usuario})\n    # Se reenvia TODO el historial acumulado:\n    # respuesta = client.chat(messages=buffer_conversacion)\n    # buffer_conversacion.append({\"role\": \"assistant\", \"content\": respuesta})",
                                    "output": "El buffer crece con cada turno conversacional acumulando tokens indefinidamente.",
                                    "explanation": "El historial debe gestionarse y podarse con estrategias tecnicas para no desbordar recursos."
                                }
                            ],
                            "common_errors": "Enviar unicamente el ultimo mensaje del usuario esperando que el modelo recuerde datos suministrados en turnos anteriores.",
                            "mini_exercise": {
                                "instructions": "Escribe una frase explicando por que un LLM recuerda tu nombre en un chat.",
                                "starter_code": "# Por que recuerda tu nombre?\nexplicacion = ...",
                                "solution": "explicacion = \"Porque la aplicacion re-envia el historial completo que contiene tu nombre en cada nueva peticion.\""
                            },
                            "key_takeaways": [
                                "Los LLMs son funciones matematicas puras sin estado en el servidor.",
                                "La memoria conversacional es simulada re-enviando el historial de turnos.",
                                "Acumular mensajes indefinidamente incrementa costos, latencia y riesgo de saturacion."
                            ],
                            "exercise": {
                                "id": "ex_ia_05_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Como recuerda un chatbot de IA el nombre del usuario mencionado tres preguntas atras?",
                                "options": [
                                    {"id": "a", "text": "Porque la aplicacion cliente re-envia el historial conversacional acumulado que incluye el turno donde el usuario dijo su nombre en la lista de mensajes."},
                                    {"id": "b", "text": "Porque el modelo guarda un archivo de texto en su disco duro con la sesion del usuario."},
                                    {"id": "c", "text": "Porque los LLMs tienen memoria biologica persistente."},
                                    {"id": "d", "text": "Porque la IP del usuario queda guardada en los pesos del modelo."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Las APIs son stateless; la memoria se implementa reenviando el buffer de contexto historico en cada solicitud HTTP."
                            }
                        },
                        {
                            "id": "les_ia_05_02",
                            "code": "L02",
                            "title": "Ventana Deslizante (Sliding Window Memory)",
                            "slug": "ventana-deslizante-sliding-window",
                            "position": 2,
                            "concept_id": "ia-memory-sliding-window",
                            "objective": "Implementar podas de contexto mediante ventanas deslizantes basadas en conteo de turnos o presupuesto de tokens.",
                            "theory_markdown": "La estrategia mas directa para evitar el crecimiento infinito del historial es la **Ventana Deslizante (Sliding Window)**.\n\n### 1. Ventana por Conteo de Turnos ($K$)\nConserva siempre el mensaje de sistema inicial (`system`) mas los ultimos $K$ intercambios (ej. los ultimos 6 mensajes):\n```python\ndef podar_por_turnos(messages: list, k: int = 6) -> list:\n    if len(messages) <= k + 1:\n        return messages\n    system_message = messages[0]\n    ultimos_mensajes = messages[-k:]\n    return [system_message] + ultimos_mensajes\n```\n\n### 2. Ventana por Presupuesto de Tokens\nSe utiliza `tiktoken` para sumar tokens desde el final hacia el principio, conservando la mayor cantidad de mensajes recientes que no superen un umbral estricto (ej. maximo 3000 tokens de contexto).",
                            "examples": [
                                {
                                    "title": "Poda preservando el system prompt",
                                    "code": "mensajes = [\n    {\"role\": \"system\", \"content\": \"Eres un asistente util\"},\n    {\"role\": \"user\", \"content\": \"Mensaje 1\"},\n    {\"role\": \"assistant\", \"content\": \"Resp 1\"},\n    {\"role\": \"user\", \"content\": \"Mensaje 2\"},\n    {\"role\": \"assistant\", \"content\": \"Resp 2\"},\n    {\"role\": \"user\", \"content\": \"Mensaje 3\"},\n]\n# Ventana de K=2 ultimos mensajes:\npodados = [mensajes[0]] + mensajes[-2:]\nprint(\"Mensajes conservados:\", len(podados))",
                                    "output": "Mensajes conservados: 3",
                                    "explanation": "El system prompt se mantiene intacto y se descartan las conversaciones antiguas intermedias."
                                }
                            ],
                            "common_errors": "Hacer un slice simple como `messages[-k:]` que descarta el mensaje `system`, perdiendo las instrucciones maestras de comportamiento.",
                            "mini_exercise": {
                                "instructions": "Une el mensaje 'system_msg' con los ultimos 4 mensajes de la lista 'historial'.",
                                "starter_code": "system_msg = {\"role\": \"system\", \"content\": \"Instrucciones\"}\nhistorial = [{\"role\": \"user\", \"content\": f\"msg {i}\"} for i in range(10)]\n\n# Obtiene contexto_podado\ncontexto_podado = ...",
                                "solution": "contexto_podado = [system_msg] + historial[-4:]"
                            },
                            "key_takeaways": [
                                "La ventana deslizante limita el historial a los K mensajes mas recientes.",
                                "El mensaje system siempre debe preservarse al inicio de la lista podada.",
                                "Fija un limite maximo predecible de consumo de tokens y costes de API."
                            ],
                            "exercise": {
                                "id": "ex_ia_05_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual elemento NUNCA debe descartarse al aplicar una poda de historial mediante ventana deslizante en un chat con LLM?",
                                "options": [
                                    {"id": "a", "text": "El mensaje inicial con rol 'system' que contiene las directivas y reglas maestras del asistente."},
                                    {"id": "b", "text": "El primer saludo 'Hola' del usuario."},
                                    {"id": "c", "text": "Las marcas de tiempo de las peticiones pasadas."},
                                    {"id": "d", "text": "Los identificadores de proceso de la base de datos."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El system prompt define la personalidad, formato y directivas de seguridad; si se descarta en la poda, el modelo pierde su orientacion de comportamiento."
                            }
                        },
                        {
                            "id": "les_ia_05_03",
                            "code": "L03",
                            "title": "Resumen Dinamico de Conversacion (Summary Memory)",
                            "slug": "resumen-dinamico-summary-memory",
                            "position": 3,
                            "concept_id": "ia-memory-summary",
                            "objective": "Compactar historiales conversacionales largos mediante tecnicas de resumen incremental automatizado.",
                            "theory_markdown": "El problema de la ventana deslizante es la **amnesia**: el modelo olvida por completo hechos ocurridos hace mas de $K$ turnos.\n\n### Conversation Summary Memory\nPara recordar hechos del pasado sin conservar miles de tokens verbatim:\n1. Se monitorea la longitud de la conversacion.\n2. Cuando el buffer supera un umbral de tokens (ej. 2000 tokens), se utiliza un modelo rapido y economico (ej. `gpt-4o-mini`) para generar un **resumen conciso** de los turnos antiguos.\n3. Los turnos antiguos se eliminan de la lista de mensajes y el resumen generado se inyecta en el `system` prompt o como primer turno sintactico:\n   `'Resumen de la conversacion previa: El usuario es cliente premium y solicito cotizacion para 5 laptops.'`\n4. Solo se conservan los ultimos 2 o 3 turnos en crudo mas el resumen.",
                            "examples": [
                                {
                                    "title": "Estructura del prompt con resumen incremental",
                                    "code": "system_prompt = \"\"\"\nEres un asistente de soporte.\n\nContexto historico resumido:\n- El cliente reporto lentitud en su conexion el dia de ayer.\n- Se valido que su router es modelo X-200.\n\nResponde cordialmente atendiendo a este contexto.\n\"\"\"\nmessages = [{\"role\": \"system\", \"content\": system_prompt}]",
                                    "output": "El modelo retiene los datos criticos pasados consumiendo menos de 60 tokens en lugar de 2500.",
                                    "explanation": "El resumen sintetiza la esencia informativa minimizando el espacio consumido en el Context Window."
                                }
                            ],
                            "common_errors": "Re-resumir toda la conversacion en cada turno individual, multiplicando las llamadas de API innecesariamente en vez de esperar a que se alcance un umbral limite.",
                            "mini_exercise": {
                                "instructions": "Escribe una plantilla de f-string para un system prompt que incorpore la variable 'resumen_previo'.",
                                "starter_code": "resumen_previo = \"El usuario busca autos electricos\"\n\n# Crea prompt_con_resumen\nprompt_con_resumen = ...",
                                "solution": "prompt_con_resumen = f\"Eres un asesor. Contexto previo: {resumen_previo}\""
                            },
                            "key_takeaways": [
                                "Summary Memory compacta mensajes antiguos en sintesis semanticas concisas.",
                                "Combina memoria a largo plazo con bajo consumo de tokens en el Context Window.",
                                "Se activa de forma periodica o cuando se supera un umbral definido de tokens."
                            ],
                            "exercise": {
                                "id": "ex_ia_05_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es la ventaja fundamental de Conversation Summary Memory sobre una ventana deslizante pura (Sliding Window)?",
                                "options": [
                                    {"id": "a", "text": "Permite conservar informacion y hechos criticos de turnos conversacionales antiguos sin saturar la ventana de tokens con el texto verbatim."},
                                    {"id": "b", "text": "Elimina la necesidad de usar claves de API."},
                                    {"id": "c", "text": "Convierte todas las respuestas en archivos de audio."},
                                    {"id": "d", "text": "Impide que el usuario haga preguntas de mas de diez palabras."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "La ventana deslizante borra completamente los datos antiguos; el resumen dinámico retiene los hechos esenciales comprimidos semánticamente."
                            }
                        },
                        {
                            "id": "les_ia_05_04",
                            "code": "L04",
                            "title": "Persistencia de Memoria en Bases de Datos (SQLite/Redis)",
                            "slug": "persistencia-memoria-bases-datos",
                            "position": 4,
                            "concept_id": "ia-memory-persistence-db",
                            "objective": "Persistir historiales conversacionales asociados a session_id de usuario en SQLite o Redis y reconstruir el contexto por peticion.",
                            "theory_markdown": "En aplicaciones reales multiusuario, la memoria no puede residir en variables globales en la RAM del proceso de Python, ya que se perderia al reiniciar el servidor y se mezclaria entre usuarios.\n\n### Diseno de Persistencia por Sesion\nCada usuario interactua con un identificador unico de conversacion (`session_id`).\n\nEn cada peticion HTTP:\n1. El backend recibe `session_id` y el nuevo `mensaje`.\n2. **Rehidratacion:** Se consultan los mensajes previos de esa sesion desde la base de datos (SQLite, PostgreSQL o Redis):\n   `SELECT rol, contenido FROM historial WHERE session_id = ? ORDER BY id ASC LIMIT 20`.\n3. Se construye la lista de mensajes y se invoca la API del LLM.\n4. **Persistencia:** Se guardan tanto el nuevo mensaje del usuario como la respuesta del asistente en la base de datos vinculados al `session_id`.",
                            "examples": [
                                {
                                    "title": "Persistencia basica de mensajes en SQLite",
                                    "code": "import sqlite3\n\nconn = sqlite3.connect(\":memory:\")\ncursor = conn.cursor()\ncursor.execute(\"\"\"\nCREATE TABLE chat_history (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    session_id TEXT,\n    role TEXT,\n    content TEXT\n)\n\"\"\")\n\ndef guardar_mensaje(session_id: str, role: str, content: str):\n    cursor.execute(\"INSERT INTO chat_history (session_id, role, content) VALUES (?, ?, ?)\", (session_id, role, content))\n    conn.commit()",
                                    "output": "Mensajes asociados a sesiones independientes listos para recuperarse bajo demanda.",
                                    "explanation": "El session_id aisla los historiales impidiendo colisiones entre clientes concurrentes."
                                }
                            ],
                            "common_errors": "Almacenar historiales en una variable global como buffer = [] en FastAPI, provocando que todos los usuarios compartan la misma conversacion.",
                            "mini_exercise": {
                                "instructions": "Escribe una consulta SQL para recuperar los mensajes de una 'session_123' ordenados por id.",
                                "starter_code": "-- Consulta de historial\n-- SELECT role, content FROM chat_history WHERE ...",
                                "solution": "SELECT role, content FROM chat_history WHERE session_id = 'session_123' ORDER BY id ASC"
                            },
                            "key_takeaways": [
                                "La memoria de chat en produccion debe desacoplarse del proceso en bases de datos externas.",
                                "session_id garantiza aislamiento estricto entre conversaciones y usuarios concurrentes.",
                                "El flujo requiere rehidratacion previa de mensajes y persistencia posterior de respuestas."
                            ],
                            "exercise": {
                                "id": "ex_ia_05_04",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Por que es peligroso almacenar el historial de una conversacion en una lista global en memoria de Python (ej. historial = []) en una API web con multiples usuarios?",
                                "options": [
                                    {"id": "a", "text": "Porque todos los usuarios concurrentes compartiran el mismo historial, mezclando sus datos privados y quebrando el aislamiento de sesiones."},
                                    {"id": "b", "text": "Porque Python solo permite listas de hasta 5 elementos."},
                                    {"id": "c", "text": "Porque la base de datos se borra automaticamente."},
                                    {"id": "d", "text": "Porque el modelo no acepta listas de Python."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Una variable global es compartida por todo el proceso del servidor; se requiere una base de datos indexada por session_id para aislar a cada usuario."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "IA_M05",
            "module_slug": "ia-memoria-y-contexto",
            "course_slug": "ai-agents",
            "questions": [
                {
                    "id": "q_ia_05_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que significa que las APIs de modelos de lenguaje grande (LLMs) sean stateless?",
                    "options": [
                        {"id": "a", "text": "Que el servidor no retiene ningun recuerdo de llamadas anteriores; cada solicitud HTTP es evaluada de forma aislada e independiente."},
                        {"id": "b", "text": "Que no requieren conexion de red para funcionar."},
                        {"id": "c", "text": "Que no cobran dinero por las consultas."},
                        {"id": "d", "text": "Que el modelo solo responde en dias habiles."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "La propiedad stateless implica ausencia de memoria persistente interna en el servidor de inferencia entre conexiones HTTP separadas."
                },
                {
                    "id": "q_ia_05_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como opera una memoria conversacional basada en Ventana Deslizante (Sliding Window) en un chatbot?",
                    "options": [
                        {"id": "a", "text": "Mantiene el mensaje system y unicamente los ultimos K mensajes mas recientes, descartando los mensajes intermedios mas antiguos."},
                        {"id": "b", "text": "Descarga la conversacion a un archivo de audio cada 10 minutos."},
                        {"id": "c", "text": "Borra el modelo de la memoria RAM del servidor."},
                        {"id": "d", "text": "Traduce todos los mensajes al frances."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Sliding window acota el historial reteniendo una ventana fija de los K mensajes mas nuevos mas las directivas del system prompt."
                },
                {
                    "id": "q_ia_05_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que problema resuelve Conversation Summary Memory frente a la simple eliminacion de mensajes antiguos?",
                    "options": [
                        {"id": "a", "text": "Evita la perdida total de contexto antiguo resumiendo periodicamente los turnos previos e inyectando la sintesis en el prompt."},
                        {"id": "b", "text": "Elimina los costos de la API por completo."},
                        {"id": "c", "text": "Evita tener que usar Pydantic."},
                        {"id": "d", "text": "Permite que el modelo funcione sin tokens."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El resumen dinamico condensa miles de tokens pasados en pocos parrafos esenciales, reteniendo los datos criticos con minimo espacio."
                },
                {
                    "id": "q_ia_05_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Que ocurre si una aplicacion continua acumulando turnos en la lista messages sin aplicar ninguna estrategia de poda ni resumen?",
                    "options": [
                        {"id": "a", "text": "La latencia y el coste por token escalan en cada turno hasta que se sobrepasa el Context Window del modelo, momento en el cual la API rechaza la peticion con un error."},
                        {"id": "b", "text": "El modelo se vuelve mas rapido e inteligente de forma indefinida."},
                        {"id": "c", "text": "La API reduce automaticamente el precio a la mitad."},
                        {"id": "d", "text": "Los mensajes se encriptan con grado militar en la memoria cache."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El envio de buffers crecientes dispara la facturacion de tokens de entrada y colapsa el servicio al exceder el limite de contexto maximo."
                },
                {
                    "id": "q_ia_05_05",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "Cual es el identificador clave utilizado en una base de datos relacional o cache para aislar y recuperar el historial de chat de un usuario especifico?",
                    "options": [
                        {"id": "a", "text": "session_id (o conversation_id)"},
                        {"id": "b", "text": "process_pid"},
                        {"id": "c", "text": "model_version"},
                        {"id": "d", "text": "token_cost"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El session_id actua como llave de particion logica para asociar y consultar unicamente los turnos correspondientes a esa conversacion particular."
                },
                {
                    "id": "q_ia_05_06",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "En que orden cronologico deben inyectarse los mensajes previos al reconstruir el contexto de una conversacion para el LLM?",
                    "options": [
                        {"id": "a", "text": "En orden cronologico estricto ascendente (del mas antiguo al mas reciente) precedidos por el system prompt."},
                        {"id": "b", "text": "En orden aleatorio para incentivar la creatividad del modelo."},
                        {"id": "c", "text": "Del mas nuevo al mas antiguo de forma inversa."},
                        {"id": "d", "text": "Unicamente los mensajes del usuario, omitiendo las respuestas del asistente."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Los LLMs dependen del orden temporal natural para comprender la causalidad y el flujo logico de la conversacion."
                }
            ]
        }
    }
]

def main():
    print("Iniciando generacion de modulos 01 a 05 de AI Agents...")
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
