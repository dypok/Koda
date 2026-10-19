# -*- coding: utf-8 -*-
"""
Script to generate all 5 FastAPI modules and bank.json files with 4 lessons and 6 calibrated questions each.
Enforces zero emojis, zero spoilers, and strict schema compliance.
"""

import json
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", "languages", "python", "modules", "fastapi"))

MODULES = [
    {
        "dir": "01_http_rest",
        "module_json": {
            "id": "fa_mod_01",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "FA_M01",
            "slug": "fastapi-http-rest",
            "course_slug": "fastapi-async",
            "title": "Protocolo HTTP, Arquitectura ASGI y Primera API con FastAPI",
            "objective": "Comprender el ciclo Request/Response de HTTP, la arquitectura ASGI y levantar una API con FastAPI y Uvicorn.",
            "description": "El framework web moderno de Python con tipado estricto, documentacion interactiva Swagger y rendimiento ASGI a la par de Node y Go.",
            "position": 31,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_fa_01_01",
                    "code": "S01",
                    "title": "Fundamentos de HTTP, ASGI y Rutas en FastAPI",
                    "slug": "fundamentos-http-asgi",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 45,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_fa_01_01",
                            "code": "L01",
                            "title": "Arquitectura ASGI, Uvicorn y Primer Endpoint",
                            "slug": "asgi-uvicorn-primer-endpoint",
                            "position": 1,
                            "concept_id": "fa-intro-asgi",
                            "objective": "Comprender la diferencia entre WSGI y ASGI, y levantar una aplicacion FastAPI ejecutada por Uvicorn.",
                            "theory_markdown": "Tradicionalmente, los frameworks web de Python como Django y Flask clasicos operaban sobre el estandar **WSGI** (Web Server Gateway Interface), el cual bloqueaba un hilo completo del sistema operativo por cada peticion HTTP entrante.\n\n**FastAPI** adopta **ASGI** (Asynchronous Server Gateway Interface), construido sobre la libreria asincrona **Starlette**. ASGI permite que un unico hilo de ejecucion gestione miles de conexiones concurrentes no bloqueantes a traves del Event Loop de `asyncio`.\n\nPara servir una aplicacion FastAPI se requiere un servidor ASGI como **Uvicorn**:\n```bash\nuvicorn main:app --reload\n```\nLa bandera `--reload` activa el reinicio automatico del proceso al detectar cambios en el codigo fuente durante la fase de desarrollo.",
                            "examples": [
                                {
                                    "title": "Instanciacion de FastAPI y endpoint basico",
                                    "code": "from fastapi import FastAPI\n\napp = FastAPI(title=\"Koda Service\", version=\"1.0.0\")\n\n@app.get(\"/\")\nasync def read_root() -> dict[str, str]:\n    return {\"status\": \"ok\", \"message\": \"API operativa\"}",
                                    "output": "{\"status\": \"ok\", \"message\": \"API operativa\"}",
                                    "explanation": "FastAPI serializa automaticamente los diccionarios retornados a formato JSON con la cabecera Content-Type: application/json."
                                }
                            ],
                            "common_errors": "Definir un endpoint con async def pero ejecutar dentro funciones bloqueantes sincronas intensivas en CPU sin delegarlas a un threadpool, congelando el bucle de eventos.",
                            "mini_exercise": {
                                "instructions": "Crea una instancia de FastAPI llamada app y un endpoint GET en '/ping' que retorne {'ping': 'pong'}.",
                                "starter_code": "from fastapi import FastAPI\n\n# Inicializa app y define la ruta /ping\n",
                                "solution": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/ping\")\nasync def ping() -> dict[str, str]:\n    return {\"ping\": \"pong\"}"
                            },
                            "key_takeaways": [
                                "ASGI permite concurrencia masiva no bloqueante mediante el Event Loop de asyncio.",
                                "Uvicorn es el servidor web ASGI que ejecuta aplicaciones FastAPI.",
                                "FastAPI serializa estructuras nativas de Python a JSON de forma transparente."
                            ],
                            "exercise": {
                                "id": "ex_fa_01_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la principal diferencia arquitectonica entre un servidor WSGI clasico y un servidor ASGI como Uvicorn?",
                                "options": [
                                    {"id": "a", "text": "ASGI soporta concurrencia asincrona no bloqueante sobre el Event Loop, mientras que WSGI es sincronico por peticion."},
                                    {"id": "b", "text": "WSGI solo funciona con Node.js y ASGI solo con Python compilado en C."},
                                    {"id": "c", "text": "ASGI inhabilita el uso de tipos estaticos en las rutas."},
                                    {"id": "d", "text": "WSGI requiere obligatoriamente Docker y ASGI requiere Kubernetes."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "ASGI fue disenado especificamente para permitir operaciones asincronas, WebSockets y concurrencia eficiente sin requerir un hilo por conexion como WSGI."
                            }
                        },
                        {
                            "id": "les_fa_01_02",
                            "code": "L02",
                            "title": "Path Parameters y Tipado Estricto",
                            "slug": "path-parameters-tipado",
                            "position": 2,
                            "concept_id": "fa-path-params",
                            "objective": "Capturar variables dinamicas en la ruta HTTP y aprovechar la conversion y validacion automatica de tipos.",
                            "theory_markdown": "Los **Path Parameters** (parametros de ruta) permiten capturar valores variables dentro de la URL declarandolos con llaves `{param}` en el decorador de ruta.\n\nFastAPI utiliza las anotaciones de tipo de Python para realizar dos acciones esenciales:\n1. **Conversion de tipos (Data Parsing):** Convierte la cadena que viaja en la URL al tipo especificado (por ejemplo, `int`, `float`, `UUID`).\n2. **Validacion automatica:** Si el cliente envia un valor que no puede ser convertido al tipo esperado (por ejemplo `/items/abc` cuando se requiere `int`), FastAPI responde de inmediato con codigo HTTP 422 Unprocessable Entity indicando el error de validacion exacto en formato JSON.",
                            "examples": [
                                {
                                    "title": "Captura de un identificador numerico en la ruta",
                                    "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/usuarios/{user_id}\")\nasync def get_usuario(user_id: int) -> dict[str, int]:\n    return {\"user_id\": user_id}",
                                    "output": "Peticion GET /usuarios/42 -> {\"user_id\": 42}\nPeticion GET /usuarios/hola -> HTTP 422 Unprocessable Entity",
                                    "explanation": "Al declarar user_id: int, FastAPI convierte la cadena '42' al entero 42, y rechaza peticiones con valores no numericos."
                                }
                            ],
                            "common_errors": "Colocar rutas estaticas despues de rutas con path parameters dinamicos coincidentes (ejemplo: '/usuarios/{user_id}' antes de '/usuarios/me'), lo que provocara que 'me' sea interpretado como un parametro user_id.",
                            "mini_exercise": {
                                "instructions": "Define un endpoint GET en '/cursos/{curso_id}' donde curso_id sea un entero estricto y retorne un diccionario con la clave 'id'.",
                                "starter_code": "from fastapi import FastAPI\napp = FastAPI()\n\n# Define el endpoint con tipado int\n",
                                "solution": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/cursos/{curso_id}\")\nasync def obtener_curso(curso_id: int) -> dict[str, int]:\n    return {\"id\": curso_id}"
                            },
                            "key_takeaways": [
                                "Los parametros de ruta se definen con llaves {parametro} en el decorador.",
                                "El tipado estricto permite a FastAPI parsear y validar automaticamente los parametros.",
                                "Errores de tipo en la ruta producen una respuesta estandar HTTP 422 Unprocessable Entity."
                            ],
                            "exercise": {
                                "id": "ex_fa_01_02",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Si un endpoint esta declarado como def read_item(item_id: int) y el cliente solicita GET /items/texto, que respuesta genera FastAPI por defecto?",
                                "options": [
                                    {"id": "a", "text": "HTTP 422 Unprocessable Entity con detalle del error de validacion en JSON."},
                                    {"id": "b", "text": "HTTP 500 Internal Server Error con un volcado de traza no controlado."},
                                    {"id": "c", "text": "HTTP 200 OK asignando None a item_id."},
                                    {"id": "d", "text": "HTTP 404 Not Found."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "FastAPI valida los tipos antes de invocar la funcion; si la conversion falla, responde automaticamente con 422 y un esquema descriptivo del error."
                            }
                        },
                        {
                            "id": "les_fa_01_03",
                            "code": "L03",
                            "title": "Query Parameters y Parametros Opcionales",
                            "slug": "query-parameters-opcionales",
                            "position": 3,
                            "concept_id": "fa-query-params",
                            "objective": "Declarar y procesar parametros de consulta en la URL, estableciendo valores por defecto y tipos opcionales.",
                            "theory_markdown": "Los argumentos de la funcion de ruta que **no** coinciden con nombres declarados en el path del decorador son interpretados automaticamente por FastAPI como **Query Parameters** (parametros de consulta que viajan tras el simbolo `?` en la URL).\n\nPara definir parametros opcionales o con valores predeterminados:\n- Con valor por defecto: `limit: int = 10`\n- Opcional sin valor: `busqueda: str | None = None`\n- Booleans: FastAPI parsea de forma inteligente valores como `1`, `true`, `True`, `on`, `yes` a `True`.",
                            "examples": [
                                {
                                    "title": "Paginacion y filtros mediante Query Parameters",
                                    "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/articulos\")\nasync def listar_articulos(offset: int = 0, limit: int = 10, categoria: str | None = None) -> dict[str, object]:\n    return {\"offset\": offset, \"limit\": limit, \"categoria\": categoria}",
                                    "output": "Peticion GET /articulos?limit=5 -> {\"offset\": 0, \"limit\": 5, \"categoria\": null}",
                                    "explanation": "offset toma su valor por defecto 0, limit es sobreescrito con 5, y categoria permanece como None."
                                }
                            ],
                            "common_errors": "No proveer un valor por defecto ni None para un query parameter opcional, lo cual lo convierte involuntariamente en un parametro requerido.",
                            "mini_exercise": {
                                "instructions": "Escribe un endpoint GET en '/buscar' que reciba 'q: str' (requerido) y 'limite: int = 20' (opcional).",
                                "starter_code": "from fastapi import FastAPI\napp = FastAPI()\n\n# Define el endpoint con q y limite\n",
                                "solution": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/buscar\")\nasync def buscar(q: str, limite: int = 20) -> dict[str, object]:\n    return {\"consulta\": q, \"limite\": limite}"
                            },
                            "key_takeaways": [
                                "Cualquier argumento de funcion que no este en el path se convierte en un Query Parameter.",
                                "Asignar un valor por defecto o None hace que el query parameter sea opcional.",
                                "FastAPI convierte tipos nativos como enteros, flotantes y booleanos automaticamente."
                            ],
                            "exercise": {
                                "id": "ex_fa_01_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Como se define un Query Parameter en FastAPI para que no sea obligatorio y su valor predeterminado sea None?",
                                "options": [
                                    {"id": "a", "text": "parametro: str | None = None"},
                                    {"id": "b", "text": "parametro: str = Required(None)"},
                                    {"id": "c", "text": "@app.optional('parametro')"},
                                    {"id": "d", "text": "parametro: Optional[str] sin valor asignado"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Al declarar 'parametro: str | None = None', FastAPI identifica que el parametro es de tipo string opcional y que si se omite en la URL tendra el valor None."
                            }
                        },
                        {
                            "id": "les_fa_01_04",
                            "code": "L04",
                            "title": "Codigos de Estado HTTP y Documentacion OpenAPI",
                            "slug": "status-codes-openapi",
                            "position": 4,
                            "concept_id": "fa-status-openapi",
                            "objective": "Controlar codigos de respuesta HTTP con HTTPException y personalizar la documentacion interactiva OpenAPI.",
                            "theory_markdown": "Una API REST profesional debe responder con los codigos de estado HTTP adecuados segun el resultado de la operacion:\n- `status.HTTP_200_OK`: Lectura o actualizacion exitosa.\n- `status.HTTP_201_CREATED`: Recurso creado exitosamente.\n- `status.HTTP_404_NOT_FOUND`: Recurso inexistente.\n- `status.HTTP_400_BAD_REQUEST`: Solicitud invalida por logica de negocio.\n\nPara emitir errores controlados se eleva `HTTPException`:\n```python\nfrom fastapi import HTTPException, status\nraise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=\"Elemento no hallado\")\n```\n\nAdemas, FastAPI genera automaticamente la especificacion **OpenAPI** y ofrece dos interfaces web interactivas por defecto:\n- **Swagger UI** en `/docs`: Permite explorar y probar los endpoints interactivamente desde el navegador.\n- **ReDoc** en `/redoc`: Presenta una documentacion estructurada y visualmente limpia.",
                            "examples": [
                                {
                                    "title": "Control de status_code y lanzamiento de HTTPException",
                                    "code": "from fastapi import FastAPI, HTTPException, status\n\napp = FastAPI(title=\"Catalogo API\", version=\"2.0.0\")\n\nITEMS = {1: \"Laptop\", 2: \"Teclado\"}\n\n@app.get(\"/items/{item_id}\", status_code=status.HTTP_200_OK, tags=[\"inventario\"])\nasync def get_item(item_id: int) -> dict[str, str]:\n    if item_id not in ITEMS:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=\"Item inexistente\")\n    return {\"nombre\": ITEMS[item_id]}",
                                    "output": "GET /items/99 -> HTTP 404 con {\"detail\": \"Item inexistente\"}",
                                    "explanation": "status_code en el decorador fija el estado para casos exitosos, mientras que HTTPException interrumpe el flujo retornando el codigo indicado."
                                }
                            ],
                            "common_errors": "Retornar un diccionario como {'error': 'no encontrado'} con codigo 200 OK en lugar de elevar una HTTPException con status 404.",
                            "mini_exercise": {
                                "instructions": "Eleva una HTTPException con codigo 404 y detalle 'No encontrado' si el parametro activo es False.",
                                "starter_code": "from fastapi import FastAPI, HTTPException, status\n\napp = FastAPI()\n\n@app.get(\"/check\")\nasync def check(activo: bool):\n    # Si no esta activo, eleva HTTPException 404\n    pass",
                                "solution": "from fastapi import FastAPI, HTTPException, status\n\napp = FastAPI()\n\n@app.get(\"/check\")\nasync def check(activo: bool):\n    if not activo:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=\"No encontrado\")\n    return {\"estado\": \"activo\"}"
                            },
                            "key_takeaways": [
                                "El decorador de ruta acepta status_code para definir el codigo HTTP de respuesta exitosa.",
                                "HTTPException interrumpe la ejecucion y retorna una respuesta de error con codigo y detalle JSON.",
                                "FastAPI genera documentacion interactiva automatica en /docs (Swagger UI) y /redoc."
                            ],
                            "exercise": {
                                "id": "ex_fa_01_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es la forma correcta de interrumpir una peticion y responder al cliente con un codigo HTTP 404 y un mensaje de error en FastAPI?",
                                "options": [
                                    {"id": "a", "text": "raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=\"Mensaje\")"},
                                    {"id": "b", "text": "return {\"status\": 404, \"error\": \"Mensaje\"}"},
                                    {"id": "c", "text": "sys.exit(404)"},
                                    {"id": "d", "text": "raise ValueError(404)"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Elevar una instancia de HTTPException con el status_code y detail es el mecanismo oficial de FastAPI para enviar respuestas de error HTTP formateadas."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "FA_M01",
            "module_slug": "fastapi-http-rest",
            "course_slug": "fastapi-async",
            "questions": [
                {
                    "id": "q_fa_01_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que funcion cumple Uvicorn en una aplicacion FastAPI?",
                    "options": [
                        {"id": "a", "text": "Es el servidor web ASGI que ejecuta el codigo asincrono sobre el Event Loop."},
                        {"id": "b", "text": "Es un gestor de migraciones de base de datos relacionales."},
                        {"id": "c", "text": "Es un cliente HTTP para realizar solicitudes salientes."},
                        {"id": "d", "text": "Es el motor de plantillas HTML de FastAPI."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Uvicorn es una implementacion de servidor web ASGI para Python de alto rendimiento basado en uvloop y httptools."
                },
                {
                    "id": "q_fa_01_02",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Como interpreta FastAPI una variable declarada con llaves dentro del decorador, por ejemplo @app.get('/usuarios/{id}')?",
                    "options": [
                        {"id": "a", "text": "Como un Path Parameter que se pasa como argumento a la funcion controladora."},
                        {"id": "b", "text": "Como una variable de entorno del sistema operativo."},
                        {"id": "c", "text": "Como una expresion regular obligatoria para validar cabeceras HTTP."},
                        {"id": "d", "text": "Como una clave de sesion encriptada en una cookie."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Los parametros encerrados en llaves dentro de la URL son Path Parameters que FastAPI mapea con los argumentos homonimos de la funcion."
                },
                {
                    "id": "q_fa_01_03",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "Que codigo HTTP responde FastAPI si se declara @app.get('/ordenes/{orden_id}') con orden_id: int y el cliente envia GET /ordenes/abc?",
                    "options": [
                        {"id": "a", "text": "422 Unprocessable Entity"},
                        {"id": "b", "text": "200 OK"},
                        {"id": "c", "text": "500 Internal Server Error"},
                        {"id": "d", "text": "400 Bad Request"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Cuando un path parameter falla la conversion al tipo especificado (en este caso int), FastAPI responde con 422 Unprocessable Entity."
                },
                {
                    "id": "q_fa_01_04",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual es la diferencia en la declaracion de una ruta entre un Path Parameter y un Query Parameter en FastAPI?",
                    "options": [
                        {"id": "a", "text": "El Path Parameter figura en la ruta del decorador '{param}', mientras que el Query Parameter solo figura como argumento de la funcion."},
                        {"id": "b", "text": "Los Path Parameters son opcionales y los Query Parameters siempre obligatorios."},
                        {"id": "c", "text": "Los Query Parameters requieren usar la libreria urllib."},
                        {"id": "d", "text": "No existe diferencia, ambos se colocan en la URL despues del signo de interrogacion."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Si un argumento de la funcion no se encuentra en el path del decorador, FastAPI lo interpreta automaticamente como un Query Parameter."
                },
                {
                    "id": "q_fa_01_05",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "En que rutas expone FastAPI por defecto la documentacion interactiva generada desde la especificacion OpenAPI?",
                    "options": [
                        {"id": "a", "text": "Swagger UI en /docs y ReDoc en /redoc"},
                        {"id": "b", "text": "Swagger UI en /swagger y Postman en /postman"},
                        {"id": "c", "text": "Documentacion estatica exclusivamente en /index.html"},
                        {"id": "d", "text": "Unicamente en la consola de comandos de Uvicorn"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Por defecto, FastAPI habilita Swagger UI en /docs y la documentacion alternativa ReDoc en /redoc."
                },
                {
                    "id": "q_fa_01_06",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Que ocurre si se ejecuta dentro de un endpoint async def una llamada sincrona bloqueante como time.sleep(10)?",
                    "options": [
                        {"id": "a", "text": "Bloquea todo el Event Loop del worker de Uvicorn durante 10 segundos, impidiendo procesar otras peticiones."},
                        {"id": "b", "text": "FastAPI la convierte automaticamente en una tarea no bloqueante en segundo plano."},
                        {"id": "c", "text": "Uvicorn lanza una excepcion de compilacion inmediata."},
                        {"id": "d", "text": "Se crea un nuevo hilo del sistema operativo para cada peticion como en WSGI."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Las funciones async def se ejecutan directamente en el Event Loop. Si se invoca codigo bloqueante sincrono en ellas, se congela el bucle de eventos para todos los clientes conectados a ese worker."
                }
            ]
        }
    },
    {
        "dir": "02_pydantic",
        "module_json": {
            "id": "fa_mod_02",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "FA_M02",
            "slug": "fastapi-pydantic",
            "course_slug": "fastapi-async",
            "title": "Validacion de Datos y Esquemas con Pydantic v2",
            "objective": "Dominar la definicion de esquemas con Pydantic v2, validadores personalizados y serializacion segura de datos.",
            "description": "Modelado de datos tipado en Python: validacion estricta en el Request Body, serializacion y aislamiento de datos sensibles.",
            "position": 32,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_fa_02_01",
                    "code": "S01",
                    "title": "Modelos, Validaciones y Serializacion en Pydantic",
                    "slug": "modelos-pydantic-validacion",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 45,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_fa_02_01",
                            "code": "L01",
                            "title": "Modelos BaseModel y Tipado de Request Body",
                            "slug": "basemodel-request-body",
                            "position": 1,
                            "concept_id": "fa-pydantic-basemodel",
                            "objective": "Definir modelos de datos heredando de BaseModel y utilizarlos para validar el cuerpo de peticiones HTTP en FastAPI.",
                            "theory_markdown": "**Pydantic v2** es la biblioteca de analisis y validacion de datos sobre la que se fundamenta FastAPI. Su motor interno esta implementado en **Rust** (pydantic-core), ofreciendo una velocidad de validacion hasta 20 veces superior a versiones anteriores.\n\nPara definir la estructura esperada de un Request Body (cuerpo JSON en peticiones POST, PUT o PATCH), se crea una clase que hereda de `pydantic.BaseModel` con atributos tipados.\n\nCuando un endpoint declara un parametro con un tipo derivado de `BaseModel`, FastAPI:\n1. Lee el cuerpo de la peticion HTTP como JSON.\n2. Valida los tipos de cada campo y realiza coerción segura cuando es factible.\n3. Si los datos son validos, inyecta la instancia en la funcion; si son invalidos, responde automaticamente con 422 Unprocessable Entity indicando el campo y motivo exacto.",
                            "examples": [
                                {
                                    "title": "Declaracion de esquema y recepcion en endpoint POST",
                                    "code": "from fastapi import FastAPI\nfrom pydantic import BaseModel\n\nclass ProductoCreate(BaseModel):\n    nombre: str\n    precio: float\n    en_oferta: bool = False\n\napp = FastAPI()\n\n@app.post(\"/productos\", status_code=201)\nasync def crear_producto(producto: ProductoCreate) -> dict[str, object]:\n    return {\"id\": 1, \"producto\": producto.model_dump()}",
                                    "output": "POST /productos con {\"nombre\": \"Teclado\", \"precio\": 49.99} -> 201 Created",
                                    "explanation": "en_oferta asume su valor predeterminado False porque no fue enviado en la carga util JSON."
                                }
                            ],
                            "common_errors": "Definir un modelo de Pydantic usando @dataclass en lugar de heredar de BaseModel, perdiendo las capacidades de validacion estricta y conversion de Pydantic v2.",
                            "mini_exercise": {
                                "instructions": "Crea una clase Usuario con los campos 'username: str' y 'edad: int' usando BaseModel.",
                                "starter_code": "from pydantic import BaseModel\n\n# Define la clase Usuario\n",
                                "solution": "from pydantic import BaseModel\n\nclass Usuario(BaseModel):\n    username: str\n    edad: int"
                            },
                            "key_takeaways": [
                                "BaseModel es la clase base para declarar estructuras de datos validadas en Pydantic.",
                                "FastAPI parsea y valida el JSON entrante contra el esquema de BaseModel automaticamente.",
                                "Peticiones con datos ausentes o tipos incompatibles reciben respuesta 422 con detalles JSON."
                            ],
                            "exercise": {
                                "id": "ex_fa_02_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Que ocurre cuando un cliente envia un JSON con 'precio': 'gratis' a un endpoint que espera un modelo con 'precio: float'?",
                                "options": [
                                    {"id": "a", "text": "FastAPI rechaza la solicitud de inmediato con codigo HTTP 422 indicando que 'gratis' no es un float valido."},
                                    {"id": "b", "text": "Convierte la palabra 'gratis' en el numero 0.0 sin alertar."},
                                    {"id": "c", "text": "Guarda el valor como texto ignorando el tipo float."},
                                    {"id": "d", "text": "El servidor se apaga con un error critico de memoria."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Pydantic intenta coercionar el valor; como 'gratis' no representa un numero flotante, falla la validacion y FastAPI retorna 422."
                            }
                        },
                        {
                            "id": "les_fa_02_02",
                            "code": "L02",
                            "title": "Restricciones de Campo con Field",
                            "slug": "restricciones-campo-field",
                            "position": 2,
                            "concept_id": "fa-pydantic-field",
                            "objective": "Aplicar restricciones numericas, de longitud y metadatos a los campos de un modelo mediante Field().",
                            "theory_markdown": "La funcion `Field()` de Pydantic permite anadir restricciones adicionales de validacion y metadatos documentales a los atributos de un modelo:\n\n- **Restricciones numericas:**\n  - `gt` (greater than): estrictamente mayor que.\n  - `ge` (greater or equal): mayor o igual que.\n  - `lt` (less than): estrictamente menor que.\n  - `le` (less or equal): menor o igual que.\n- **Restricciones de cadenas:**\n  - `min_length` y `max_length`: longitud minima y maxima.\n  - `pattern`: expresion regular que debe cumplir el texto.\n- **Metadatos:**\n  - `description`: texto explicativo que aparece en la documentacion Swagger.\n  - `examples`: lista de valores de ejemplo para la documentacion interactiva.",
                            "examples": [
                                {
                                    "title": "Modelo con restricciones numericas y de texto",
                                    "code": "from pydantic import BaseModel, Field\n\nclass Pedido(BaseModel):\n    codigo: str = Field(min_length=3, max_length=10, description=\"Codigo unico del pedido\")\n    cantidad: int = Field(gt=0, le=100, description=\"Cantidad de unidades entre 1 y 100\")\n    descuento: float = Field(default=0.0, ge=0.0, le=1.0)",
                                    "output": "Pedido(codigo='ABC-01', cantidad=5, descuento=0.1)",
                                    "explanation": "Si se envia cantidad=0 o cantidad=101, Pydantic genera un error de validacion automatico."
                                }
                            ],
                            "common_errors": "Confundir gt (mayor estricto) con ge (mayor o igual), permitiendo valores limite no deseados como cantidad 0.",
                            "mini_exercise": {
                                "instructions": "Define un modelo Calificacion con un campo 'nota: float' con valor minimo 0.0 y maximo 10.0 usando Field.",
                                "starter_code": "from pydantic import BaseModel, Field\n\nclass Calificacion(BaseModel):\n    # Define nota entre 0.0 y 10.0\n    pass",
                                "solution": "from pydantic import BaseModel, Field\n\nclass Calificacion(BaseModel):\n    nota: float = Field(ge=0.0, le=10.0)"
                            },
                            "key_takeaways": [
                                "Field() permite configurar limites numericos con gt, ge, lt, le.",
                                "Las cadenas se pueden acotar con min_length, max_length y pattern.",
                                "Las restricciones de Field se integran automaticamente en la documentacion OpenAPI / Swagger."
                            ],
                            "exercise": {
                                "id": "ex_fa_02_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual argumento de Field() se debe utilizar si se desea que un numero sea estrictamente mayor que cero (es decir, no permitiendo el cero)?",
                                "options": [
                                    {"id": "a", "text": "gt=0"},
                                    {"id": "b", "text": "ge=0"},
                                    {"id": "c", "text": "min_value=0"},
                                    {"id": "d", "text": "above=0"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "gt significa 'greater than' (estrictamente mayor que). Para mayor o igual se utiliza ge ('greater or equal')."
                            }
                        },
                        {
                            "id": "les_fa_02_03",
                            "code": "L03",
                            "title": "Validadores Personalizados en Pydantic v2",
                            "slug": "validadores-personalizados-v2",
                            "position": 3,
                            "concept_id": "fa-pydantic-validators",
                            "objective": "Implementar validadores de campo y validadores cruzados de modelo con @field_validator y @model_validator.",
                            "theory_markdown": "En situaciones donde las restricciones basicas de `Field()` no bastan para la logica de negocio, Pydantic v2 ofrece dos decoradores fundamentales:\n\n1. `@field_validator('campo')`:\n   Valida o transforma el valor de un campo individual. Por defecto se ejecuta en modo `'after'` (despues de la coercion basica de tipos).\n   Debe ser un metodo de clase (`@classmethod`).\n\n2. `@model_validator(mode='after')`:\n   Valida relaciones entre multiples campos del modelo (cross-field validation). Recibe la instancia completa (`self`) tras validar los campos individuales.",
                            "examples": [
                                {
                                    "title": "Validacion individual y validacion entre campos",
                                    "code": "from pydantic import BaseModel, field_validator, model_validator\n\nclass RegistroEvento(BaseModel):\n    nombre: str\n    capacidad_minima: int\n    capacidad_maxima: int\n\n    @field_validator(\"nombre\")\n    @classmethod\n    def nombre_no_vacio(cls, v: str) -> str:\n        if not v.strip():\n            raise ValueError(\"El nombre no puede consistir unicamente en espacios en blanco\")\n        return v.strip().title()\n\n    @model_validator(mode=\"after\")\n    def verificar_capacidades(self) -> \"RegistroEvento\":\n        if self.capacidad_minima > self.capacidad_maxima:\n            raise ValueError(\"capacidad_minima no puede ser mayor que capacidad_maxima\")\n        return self",
                                    "output": "RegistroEvento(nombre='  python conf  ', capacidad_minima=10, capacidad_maxima=50)\n-> nombre='Python Conf'",
                                    "explanation": "field_validator limpia y transforma el nombre, y model_validator valida que el rango de capacidad sea consistente."
                                }
                            ],
                            "common_errors": "Olvidar retornar el valor validado en un @field_validator o retornar None, lo cual sobreescribe el atributo con None.",
                            "mini_exercise": {
                                "instructions": "Escribe un @field_validator para 'email' que verifique que contenga un caracter '@' o eleve un ValueError.",
                                "starter_code": "from pydantic import BaseModel, field_validator\n\nclass Contacto(BaseModel):\n    email: str\n    \n    # Implementa el validador\n",
                                "solution": "from pydantic import BaseModel, field_validator\n\nclass Contacto(BaseModel):\n    email: str\n\n    @field_validator(\"email\")\n    @classmethod\n    def validar_arroba(cls, v: str) -> str:\n        if \"@\" not in v:\n            raise ValueError(\"El email debe contener @\")\n        return v"
                            },
                            "key_takeaways": [
                                "@field_validator se utiliza para validar o transformar un campo concreto y debe retornar el valor.",
                                "@model_validator(mode='after') permite validar reglas de negocio que involucran multiples atributos.",
                                "Lanzar un ValueError dentro de un validador produce un error 422 estructurado en FastAPI."
                            ],
                            "exercise": {
                                "id": "ex_fa_02_03",
                                "type": "single_choice",
                                "difficulty": "hard",
                                "prompt": "Que regla fundamental debe cumplir un metodo decorado con @field_validator en Pydantic v2?",
                                "options": [
                                    {"id": "a", "text": "Debe ser un @classmethod y retornar obligatoriamente el valor validado (o transformado)."},
                                    {"id": "b", "text": "Debe ser una funcion asincrona async def obligatoriamente."},
                                    {"id": "c", "text": "Debe retornar un booleano True o False en lugar del valor."},
                                    {"id": "d", "text": "Solo puede recibir tipos primitivos int y str."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "En Pydantic v2, los field_validators son metodos de clase que reciben el valor a inspeccionar y deben retornarlo para que se asigne al atributo."
                            }
                        },
                        {
                            "id": "les_fa_02_04",
                            "code": "L04",
                            "title": "Serializacion y Proteccion con response_model",
                            "slug": "serializacion-response-model",
                            "position": 4,
                            "concept_id": "fa-pydantic-response-model",
                            "objective": "Aislar datos sensibles mediante response_model y dominar los metodos de exportacion model_dump() y model_dump_json().",
                            "theory_markdown": "En Pydantic v2, los metodos de exportacion son:\n- `modelo.model_dump()`: Retorna un diccionario nativo de Python.\n- `modelo.model_dump_json()`: Retorna una cadena serializada en JSON.\n\n### La importancia de response_model\nUn principio critico de seguridad en APIs es **nunca exponer datos sensibles** (tales como hashes de contraseñas, tokens internos o datos privados). \n\nFastAPI ofrece el parametro `response_model` en los decoradores de ruta:\n```python\n@app.post(\"/usuarios\", response_model=UsuarioPublico)\nasync def crear_usuario(usuario: UsuarioInDB):\n    ...\n    return usuario  # FastAPI filtra automaticamente los campos que no esten en UsuarioPublico\n```\nAl aplicar `response_model`, FastAPI:\n1. Filtra y descarta todos los campos que no pertenezcan al modelo de respuesta.\n2. Valida los datos de salida antes de emitirlos.\n3. Documenta en Swagger el esquema exacto que recibira el cliente.",
                            "examples": [
                                {
                                    "title": "Aislamiento de hash de contrasena en la respuesta",
                                    "code": "from fastapi import FastAPI\nfrom pydantic import BaseModel\n\nclass UserCreate(BaseModel):\n    username: str\n    password: str\n\nclass UserResponse(BaseModel):\n    id: int\n    username: str\n\napp = FastAPI()\n\n@app.post(\"/usuarios\", response_model=UserResponse, status_code=201)\nasync def registrar(user: UserCreate) -> dict[str, object]:\n    # Simulamos guardado en BD con hash\n    db_record = {\"id\": 1, \"username\": user.username, \"password_hash\": \"argon2$hashed_secret\"}\n    return db_record",
                                    "output": "Respuesta enviada al cliente: {\"id\": 1, \"username\": \"usuario1\"}",
                                    "explanation": "El campo password_hash fue excluido automaticamente porque UserResponse no lo declara."
                                }
                            ],
                            "common_errors": "Retornar un diccionario que contiene password_hash sin usar response_model, provocando una fuga involuntaria de credenciales sensibles al cliente.",
                            "mini_exercise": {
                                "instructions": "Usa model_dump() para convertir la instancia del producto en un diccionario ordinario.",
                                "starter_code": "from pydantic import BaseModel\n\nclass Item(BaseModel):\n    nombre: str\n\nitem = Item(nombre=\"Mesa\")\n# Convierte item a dict\nresultado = ...",
                                "solution": "from pydantic import BaseModel\n\nclass Item(BaseModel):\n    nombre: str\n\nitem = Item(nombre=\"Mesa\")\nresultado = item.model_dump()"
                            },
                            "key_takeaways": [
                                "model_dump() exporta a diccionario de Python y model_dump_json() a cadena JSON en Pydantic v2.",
                                "response_model filtra de forma segura cualquier dato no declarado en el esquema de salida.",
                                "response_model genera la documentacion exacta del contrato de respuesta en OpenAPI / Swagger."
                            ],
                            "exercise": {
                                "id": "ex_fa_02_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es el metodo estandar en Pydantic v2 para convertir una instancia de BaseModel en un diccionario nativo de Python?",
                                "options": [
                                    {"id": "a", "text": "model.model_dump()"},
                                    {"id": "b", "text": "model.dict()"},
                                    {"id": "c", "text": "model.to_dict()"},
                                    {"id": "d", "text": "model.as_json()"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "En Pydantic v2, .dict() quedo obsoleto y fue reemplazado formalmente por .model_dump() (y .model_dump_json() para cadenas JSON)."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "FA_M02",
            "module_slug": "fastapi-pydantic",
            "course_slug": "fastapi-async",
            "questions": [
                {
                    "id": "q_fa_02_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual es el rol principal de Pydantic v2 dentro de FastAPI?",
                    "options": [
                        {"id": "a", "text": "Parsear, validar y serializar estructuras de datos mediante anotaciones de tipos de Python con alto rendimiento."},
                        {"id": "b", "text": "Administrar las conexiones TCP del servidor Uvicorn."},
                        {"id": "c", "text": "Ejecutar consultas SQL directas contra bases de datos relacionales."},
                        {"id": "d", "text": "Compilar plantillas HTML dinámicas en el servidor."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Pydantic se encarga de la validacion exhaustiva, coercion de tipos y serializacion de datos de entrada y salida en FastAPI."
                },
                {
                    "id": "q_fa_02_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como se define en Pydantic un atributo numerico 'stock' que deba ser mayor o igual a cero y menor o igual a 1000?",
                    "options": [
                        {"id": "a", "text": "stock: int = Field(ge=0, le=1000)"},
                        {"id": "b", "text": "stock: int = Field(gt=0, lt=1000)"},
                        {"id": "c", "text": "stock: int = Range(0, 1000)"},
                        {"id": "d", "text": "stock: int = Check(0 <= x <= 1000)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "ge es 'greater or equal' (mayor o igual) y le es 'less or equal' (menor o igual)."
                },
                {
                    "id": "q_fa_02_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que decorador de Pydantic v2 se debe emplear para validar o normalizar un atributo especifico de forma aislada?",
                    "options": [
                        {"id": "a", "text": "@field_validator('nombre_campo')"},
                        {"id": "b", "text": "@model_validator(mode='field')"},
                        {"id": "c", "text": "@validator_field('nombre_campo')"},
                        {"id": "d", "text": "@check_property('nombre_campo')"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "En Pydantic v2, @field_validator es el decorador oficial para metodos que validan o transforman un campo individual."
                },
                {
                    "id": "q_fa_02_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Cual es la ventaja principal de utilizar el decorador @model_validator(mode='after') frente a @field_validator?",
                    "options": [
                        {"id": "a", "text": "Permite acceder a la instancia completa (self) y comparar o validar reglas de negocio entre multiples campos simultaneamente."},
                        {"id": "b", "text": "Se ejecuta de forma asincrona en un proceso secundario."},
                        {"id": "c", "text": "Impide que el modelo se serialice a formato JSON."},
                        {"id": "d", "text": "Convierte los campos en tipos inmutables de C."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "@model_validator(mode='after') recibe la instancia una vez validados los campos individuales, permitiendo validaciones cruzadas entre ellos."
                },
                {
                    "id": "q_fa_02_05",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Por que es una practica de seguridad esencial utilizar response_model en los endpoints de FastAPI que manejan entidades de usuario?",
                    "options": [
                        {"id": "a", "text": "Porque filtra la respuesta impidiendo que datos internos o sensibles como password_hash lleguen al cliente."},
                        {"id": "b", "text": "Porque encripta toda la conexion HTTP con HTTPS automaticamente."},
                        {"id": "c", "text": "Porque obliga al cliente a reenviar sus credenciales en cada solicitud."},
                        {"id": "d", "text": "Porque deshabilita la cache del navegador del cliente."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "response_model asegura que unicamente los atributos definidos en el modelo de salida sean enviados en el JSON final, filtrando secretos."
                },
                {
                    "id": "q_fa_02_06",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "Dado el modelo Usuario(nombre='Koda', edad=25), que devuelve invocar usuario.model_dump()?",
                    "options": [
                        {"id": "a", "text": "{'nombre': 'Koda', 'edad': 25}"},
                        {"id": "b", "text": "'{\"nombre\": \"Koda\", \"edad\": 25}' (como cadena de texto)"},
                        {"id": "c", "text": "('Koda', 25) (como tupla)"},
                        {"id": "d", "text": "['Koda', 25] (como lista)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "model_dump() exporta la instancia del modelo Pydantic a un diccionario nativo de Python."
                }
            ]
        }
    },
    {
        "dir": "03_sqlalchemy",
        "module_json": {
            "id": "fa_mod_03",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "FA_M03",
            "slug": "fastapi-sqlalchemy",
            "course_slug": "fastapi-async",
            "title": "Bases de Datos con SQLAlchemy 2.0 e Inyeccion de Dependencias",
            "objective": "Integrar SQLAlchemy 2.0 asincrono con FastAPI utilizando inyeccion de dependencias y el patron repositorio.",
            "description": "Acceso a datos persistentes relacionales con AsyncSession, mapeo declarativo Mapped y Depends para gestion del ciclo de vida.",
            "position": 33,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_fa_03_01",
                    "code": "S01",
                    "title": "ORM Asincrono, Dependencias y Operaciones CRUD",
                    "slug": "orm-dependencias-crud",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_fa_03_01",
                            "code": "L01",
                            "title": "Configuracion del Motor Asincrono con SQLAlchemy 2.0",
                            "slug": "motor-asincrono-sqlalchemy-2",
                            "position": 1,
                            "concept_id": "fa-sqlalchemy-engine",
                            "objective": "Configurar un motor y un creador de sesiones asincronas con create_async_engine y async_sessionmaker.",
                            "theory_markdown": "**SQLAlchemy 2.0** introduce soporte de primera clase para arquitecturas asincronas (ASGI) en Python.\n\nPara trabajar de forma asincrona:\n1. Se utiliza un driver compatible con `asyncio` (por ejemplo `sqlite+aiosqlite` para SQLite o `postgresql+asyncpg` para PostgreSQL).\n2. Se crea el motor mediante `create_async_engine`.\n3. Se configura una fabrica de sesiones con `async_sessionmaker(engine, expire_on_commit=False)`.\n\n`expire_on_commit=False` es fundamental en entornos asincronos para que los atributos de las entidades sigan siendo accesibles despues de hacer `commit()` sin provocar cargas diferidas (lazy loading) sincronicas que fallarian en el Event Loop.",
                            "examples": [
                                {
                                    "title": "Inicializacion de motor y fabrica de sesiones asincronas",
                                    "code": "from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession\nfrom sqlalchemy.orm import DeclarativeBase\n\nDATABASE_URL = \"sqlite+aiosqlite:///./test.db\"\n\nengine = create_async_engine(DATABASE_URL, echo=False)\nAsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)\n\nclass Base(DeclarativeBase):\n    pass",
                                    "output": "Motor y fabrica listos para despachar sesiones asincronas sin bloqueos.",
                                    "explanation": "DeclarativeBase es la clase base moderna de SQLAlchemy 2.0 para registrar modelos relacionales."
                                }
                            ],
                            "common_errors": "Usar una URL de conexion estandar como 'sqlite:///./test.db' sin el driver asincrono '+aiosqlite', provocando un error de inicializacion al llamar a create_async_engine.",
                            "mini_exercise": {
                                "instructions": "Escribe la definicion de una clase Base declarativa usando DeclarativeBase de SQLAlchemy 2.0.",
                                "starter_code": "from sqlalchemy.orm import DeclarativeBase\n\n# Define la clase Base\n",
                                "solution": "from sqlalchemy.orm import DeclarativeBase\n\nclass Base(DeclarativeBase):\n    pass"
                            },
                            "key_takeaways": [
                                "SQLAlchemy 2.0 requiere drivers asincronos como aiosqlite o asyncpg.",
                                "create_async_engine y async_sessionmaker crean conexiones no bloqueantes.",
                                "expire_on_commit=False previene errores por lazy loading fuera de la sesion."
                            ],
                            "exercise": {
                                "id": "ex_fa_03_01",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Por que es altamente recomendable configurar expire_on_commit=False en async_sessionmaker al trabajar con FastAPI?",
                                "options": [
                                    {"id": "a", "text": "Porque evita que los objetos de base de datos queden expirados tras un commit, previniendo operaciones I/O sincronas bloqueantes al acceder a sus atributos."},
                                    {"id": "b", "text": "Porque hace que los commits sean un 100% mas rapidos en disco."},
                                    {"id": "c", "text": "Porque impide que otros usuarios lean los datos de la base de datos."},
                                    {"id": "d", "text": "Porque elimina la necesidad de definir claves primarias."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Por defecto SQLAlchemy expira los atributos en commit; acceder a ellos requeriria un lazy load sincrono que rompe en async si no se deshabilita expire_on_commit."
                            }
                        },
                        {
                            "id": "les_fa_03_02",
                            "code": "L02",
                            "title": "Modelos Tipados con Mapped y mapped_column",
                            "slug": "modelos-mapped-column",
                            "position": 2,
                            "concept_id": "fa-sqlalchemy-models",
                            "objective": "Declarar tablas de base de datos utilizando la sintaxis tipada Mapped y mapped_column de SQLAlchemy 2.0.",
                            "theory_markdown": "En versiones previas de SQLAlchemy, las columnas se declaraban con `Column(Integer, primary_key=True)`. SQLAlchemy 2.0 moderniza esta sintaxis aprovechando el sistema de tipos de Python con **`Mapped`** y **`mapped_column`**:\n\n```python\nclass Usuario(Base):\n    __tablename__ = \"usuarios\"\n\n    id: Mapped[int] = mapped_column(primary_key=True, index=True)\n    email: Mapped[str] = mapped_column(unique=True, index=True)\n    activo: Mapped[bool] = mapped_column(default=True)\n    descripcion: Mapped[str | None] = mapped_column(default=None)\n```\n\nVentajas de `Mapped`:\n1. Las herramientas de analisis estatico como Mypy y los editores reconocen inmediatamente el tipo de dato (`int`, `str`, `bool`).\n2. Mapeo transparente de columnas anulables (`str | None` genera columnas `NULL` en SQL; `str` genera columnas `NOT NULL`).",
                            "examples": [
                                {
                                    "title": "Modelo de Articulo con Mapped y mapped_column",
                                    "code": "from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column\n\nclass Base(DeclarativeBase):\n    pass\n\nclass Articulo(Base):\n    __tablename__ = \"articulos\"\n\n    id: Mapped[int] = mapped_column(primary_key=True)\n    titulo: Mapped[str] = mapped_column(index=True)\n    precio: Mapped[float] = mapped_column()\n    publicado: Mapped[bool] = mapped_column(default=False)",
                                    "output": "Articulo(id=1, titulo='Laptop', precio=899.99, publicado=True)",
                                    "explanation": "El modelo define tipos estaticos legibles y genera el esquema SQL con llaves primarias e indices."
                                }
                            ],
                            "common_errors": "Confundir los modelos ORM de SQLAlchemy con los esquemas BaseModel de Pydantic. Los modelos ORM representan tablas de base de datos; los esquemas Pydantic validan y transfieren datos en la API.",
                            "mini_exercise": {
                                "instructions": "Declara una columna id como clave primaria entera usando Mapped e mapped_column.",
                                "starter_code": "from sqlalchemy.orm import Mapped, mapped_column\n\n# Declara id\nid: ... = ...",
                                "solution": "from sqlalchemy.orm import Mapped, mapped_column\n\nid: Mapped[int] = mapped_column(primary_key=True)"
                            },
                            "key_takeaways": [
                                "Mapped[tipo] conecta el tipado estatico de Python con la definicion relacional.",
                                "mapped_column define restricciones como primary_key, unique, index y default.",
                                "str | None genera automaticamente una columna que admite valores nulos en SQL."
                            ],
                            "exercise": {
                                "id": "ex_fa_03_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es la forma estandar en SQLAlchemy 2.0 de definir una columna de texto obligatoria (NOT NULL) llamada 'nombre'?",
                                "options": [
                                    {"id": "a", "text": "nombre: Mapped[str] = mapped_column()"},
                                    {"id": "b", "text": "nombre = Column(String, nullable=True)"},
                                    {"id": "c", "text": "nombre: Mapped[str | None] = mapped_column()"},
                                    {"id": "d", "text": "nombre: str = Field()"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Al usar Mapped[str], SQLAlchemy infiere que la columna no admite valores nulos (NOT NULL). Para permitir nulos se utiliza Mapped[str | None]."
                            }
                        },
                        {
                            "id": "les_fa_03_03",
                            "code": "L03",
                            "title": "Inyeccion de Dependencias con Depends y Sesion",
                            "slug": "inyeccion-dependencias-sesion",
                            "position": 3,
                            "concept_id": "fa-fastapi-depends-db",
                            "objective": "Implementar un generador asincrono con yield para entregar y cerrar automaticamente sesiones de base de datos mediante Depends.",
                            "theory_markdown": "El sistema de **Inyeccion de Dependencias** de FastAPI permite desacoplar componentes y gestionar recursos compartidos de manera limpia y reusable a traves de `fastapi.Depends`.\n\nPara administrar el ciclo de vida de una sesion de base de datos relacional:\n1. Se crea una funcion generadora asincrona `get_db()` que abre la sesion.\n2. La sesion se entrega al endpoint mediante la instruccion `yield`.\n3. El bloque `finally` garantiza que la sesion se cierre siempre (`await session.close()`), incluso si ocurre una excepcion dentro del endpoint.\n\nEn la ruta, se inyecta declarando: `db: AsyncSession = Depends(get_db)`.",
                            "examples": [
                                {
                                    "title": "Generador de sesion e inyeccion con Depends",
                                    "code": "from typing import AsyncGenerator\nfrom fastapi import FastAPI, Depends\nfrom sqlalchemy.ext.asyncio import AsyncSession\n\n# Asumiendo AsyncSessionLocal configurada\nasync def get_db() -> AsyncGenerator[AsyncSession, None]:\n    async with AsyncSessionLocal() as session:\n        try:\n            yield session\n        finally:\n            await session.close()\n\napp = FastAPI()\n\n@app.get(\"/estado-db\")\nasync def check_db(db: AsyncSession = Depends(get_db)):\n    return {\"db_conectada\": True}",
                                    "output": "GET /estado-db -> {\"db_conectada\": true}",
                                    "explanation": "FastAPI abre la sesion antes de invocar check_db y asegura el cierre tras completar la respuesta."
                                }
                            ],
                            "common_errors": "Crear instancias manuales de la sesion dentro de cada funcion sin cerrarlas, provocando un agotamiento rapido del pool de conexiones del servidor de base de datos.",
                            "mini_exercise": {
                                "instructions": "Escribe la firma de una funcion de endpoint que inyecte una sesion de base de datos llamada 'db' usando Depends(get_db).",
                                "starter_code": "from fastapi import Depends\nfrom sqlalchemy.ext.asyncio import AsyncSession\n\n# Completa los parametros de la funcion\nasync def listar_usuarios(db: ...):\n    pass",
                                "solution": "from fastapi import Depends\nfrom sqlalchemy.ext.asyncio import AsyncSession\n\nasync def listar_usuarios(db: AsyncSession = Depends(get_db)):\n    pass"
                            },
                            "key_takeaways": [
                                "Depends permite inyectar dependencias reutilizables en cualquier funcion de ruta.",
                                "El patron yield en get_db asegura la apertura y cierre controlado de la sesion por peticion.",
                                "Aislar la sesion previene fugas de conexion y mezcla de transacciones entre peticiones concurrentes."
                            ],
                            "exercise": {
                                "id": "ex_fa_03_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es la funcion de la instruccion yield dentro de la funcion de dependencia get_db() en FastAPI?",
                                "options": [
                                    {"id": "a", "text": "Pausa la ejecucion de la dependencia para entregar la sesion al endpoint, reanudandose al finalizar la peticion para cerrar la sesion."},
                                    {"id": "b", "text": "Convierte la sesion en un proceso asincrono independiente del sistema operativo."},
                                    {"id": "c", "text": "Realiza un rollback automatico de toda la base de datos."},
                                    {"id": "d", "text": "Elimina todas las tablas creadas por SQLAlchemy."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "yield entrega el recurso a la ruta y retiene el contexto hasta que la peticion concluye, momento en el cual ejecuta el codigo posterior (cierre de sesion)."
                            }
                        },
                        {
                            "id": "les_fa_03_04",
                            "code": "L04",
                            "title": "Operaciones CRUD Asincronas con Select",
                            "slug": "operaciones-crud-select",
                            "position": 4,
                            "concept_id": "fa-sqlalchemy-crud",
                            "objective": "Ejecutar consultas de seleccion, insercion y actualizacion asincronas con select, scalars, db.add y commit.",
                            "theory_markdown": "En SQLAlchemy 2.0, las consultas se construyen utilizando la funcion `select()` de alto nivel y se ejecutan sobre la sesion con `await db.execute()`:\n\n- **Consultar todos los registros:**\n  ```python\n  result = await db.execute(select(Articulo))\n  articulos = result.scalars().all()\n  ```\n- **Consultar un unico registro o nulo:**\n  ```python\n  result = await db.execute(select(Articulo).where(Articulo.id == item_id))\n  articulo = result.scalar_one_or_none()\n  if not articulo:\n      raise HTTPException(status_code=404, detail=\"No encontrado\")\n  ```\n- **Crear un registro:**\n  ```python\n  nuevo = Articulo(titulo=datos.titulo, precio=datos.precio)\n  db.add(nuevo)\n  await db.commit()\n  await db.refresh(nuevo)  # Recupera el id generado por la base de datos\n  ```",
                            "examples": [
                                {
                                    "title": "Endpoint CRUD completo: Creacion y lectura",
                                    "code": "from fastapi import FastAPI, Depends, HTTPException, status\nfrom sqlalchemy import select\nfrom sqlalchemy.ext.asyncio import AsyncSession\n\napp = FastAPI()\n\n@app.get(\"/articulos/{item_id}\")\nasync def obtener_articulo(item_id: int, db: AsyncSession = Depends(get_db)):\n    query = select(Articulo).where(Articulo.id == item_id)\n    result = await db.execute(query)\n    item = result.scalar_one_or_none()\n    if not item:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=\"Articulo no existe\")\n    return item",
                                    "output": "GET /articulos/1 -> {\"id\": 1, \"titulo\": \"Monitor\", \"precio\": 250.0}",
                                    "explanation": "scalar_one_or_none retorna la entidad si coincide con la condicion o None si no existe, permitiendo manejar el error 404 limpiamente."
                                }
                            ],
                            "common_errors": "Olvidar invocar await db.refresh(instancia) despues de await db.commit() cuando se necesita retornar el id autoincremental generado.",
                            "mini_exercise": {
                                "instructions": "Escribe una consulta con select(Usuario) filtrando donde Usuario.email == 'test@koda.com'.",
                                "starter_code": "from sqlalchemy import select\n\n# Construye la consulta query\nquery = ...",
                                "solution": "from sqlalchemy import select\n\nquery = select(Usuario).where(Usuario.email == \"test@koda.com\")"
                            },
                            "key_takeaways": [
                                "select() construye sentencias SQL declarativas tipadas en SQLAlchemy 2.0.",
                                "scalar_one_or_none() devuelve una unica entidad o None de forma segura.",
                                "db.add(), await db.commit() y await db.refresh() forman el ciclo estandar de persistencia."
                            ],
                            "exercise": {
                                "id": "ex_fa_03_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual metodo del resultado de una consulta asincrona se debe utilizar para obtener exactamente una entidad o None si no hubo coincidencias?",
                                "options": [
                                    {"id": "a", "text": "result.scalar_one_or_none()"},
                                    {"id": "b", "text": "result.first_or_fail()"},
                                    {"id": "c", "text": "result.get_one()"},
                                    {"id": "d", "text": "result.fetch_maybe()"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "scalar_one_or_none() es el metodo oficial de SQLAlchemy 2.0 que devuelve el objeto escalar coincidente o None si la consulta no produjo filas."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "FA_M03",
            "module_slug": "fastapi-sqlalchemy",
            "course_slug": "fastapi-async",
            "questions": [
                {
                    "id": "q_fa_03_01",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que funcion de SQLAlchemy 2.0 se utiliza para instanciar un motor de base de datos asincrono?",
                    "options": [
                        {"id": "a", "text": "create_async_engine()"},
                        {"id": "b", "text": "create_engine()"},
                        {"id": "c", "text": "AsyncDatabaseConnector()"},
                        {"id": "d", "text": "init_async_db()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "create_async_engine es la funcion que crea la instancia de motor asincrono basada en AsyncEngine en SQLAlchemy 2.0."
                },
                {
                    "id": "q_fa_03_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "En SQLAlchemy 2.0, cual es la forma moderna y tipada de declarar una columna con clave primaria entera?",
                    "options": [
                        {"id": "a", "text": "id: Mapped[int] = mapped_column(primary_key=True)"},
                        {"id": "b", "text": "id = PrimaryKey(int)"},
                        {"id": "c", "text": "id: int = Column(primary=True)"},
                        {"id": "d", "text": "id: Field(primary_key=True)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Mapped[int] = mapped_column(primary_key=True) aprovecha el sistema de tipos de Python y el ORM declarativo de SQLAlchemy 2.0."
                },
                {
                    "id": "q_fa_03_03",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Como se asegura FastAPI de que cada peticion HTTP obtenga una sesion de base de datos independiente y que esta se cierre al finalizar?",
                    "options": [
                        {"id": "a", "text": "A traves de Depends(get_db), donde get_db() es un generador asincrono que entrega la sesion con yield y la cierra en un bloque finally."},
                        {"id": "b", "text": "Creando una variable global unica compartida por todas las peticiones concurrentes."},
                        {"id": "c", "text": "Reiniciando el servidor Uvicorn en cada peticion HTTP."},
                        {"id": "d", "text": "Ejecutando la base de datos dentro de la memoria RAM del navegador del cliente."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El patron de dependencias con yield garantiza que la sesion se cree al inicio de la peticion y se cierre de forma determinista al concluir."
                },
                {
                    "id": "q_fa_03_04",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como se ejecuta una consulta de seleccion asincrona en SQLAlchemy 2.0?",
                    "options": [
                        {"id": "a", "text": "result = await db.execute(select(Modelo)) y luego result.scalars().all()"},
                        {"id": "b", "text": "result = db.query(Modelo).all()"},
                        {"id": "c", "text": "result = await Modelo.objects.filter()"},
                        {"id": "d", "text": "result = await db.fetch_all('SELECT *')"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "SQLAlchemy 2.0 unifica las consultas mediante la funcion select(Modelo) ejecutada asincronamente con await db.execute(), extrayendo entidades con .scalars()."
                },
                {
                    "id": "q_fa_03_05",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual es el proposito de invocar await db.refresh(instancia) despues de await db.commit() al insertar un nuevo registro?",
                    "options": [
                        {"id": "a", "text": "Actualizar la instancia en memoria con los valores generados por la base de datos, como claves primarias autoincrementales o marcas de tiempo."},
                        {"id": "b", "text": "Borrar la instancia de la base de datos."},
                        {"id": "c", "text": "Cerrar la sesion de inmediato."},
                        {"id": "d", "text": "Convertir la instancia en un modelo de Pydantic."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "db.refresh vuelve a cargar los atributos del objeto desde la base de datos para sincronizar campos generados por el motor SQL (como el ID)."
                },
                {
                    "id": "q_fa_03_06",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "Cual es la diferencia arquitectonica entre un modelo SQLAlchemy (Mapped) y un modelo Pydantic (BaseModel)?",
                    "options": [
                        {"id": "a", "text": "SQLAlchemy mapea y persiste tablas en la base de datos relacional, mientras que Pydantic valida y serializa datos para la comunicacion HTTP."},
                        {"id": "b", "text": "SQLAlchemy solo funciona con MongoDB y Pydantic con PostgreSQL."},
                        {"id": "c", "text": "Pydantic reemplaza a SQLAlchemy para persistir datos en disco."},
                        {"id": "d", "text": "No hay diferencia, son exactamente la misma libreria con nombres distintos."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "SQLAlchemy se enfoca en la capa de persistencia relacional (ORM), mientras que Pydantic gestiona la capa de validacion y transferencia de datos (DTO)."
                }
            ]
        }
    },
    {
        "dir": "04_auth_jwt",
        "module_json": {
            "id": "fa_mod_04",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "FA_M04",
            "slug": "fastapi-auth-jwt",
            "course_slug": "fastapi-async",
            "title": "Autenticacion Segura con JWT y OAuth2",
            "objective": "Implementar un sistema de autenticacion profesional con hashing seguro de contraseñas, emision y verificacion de JSON Web Tokens.",
            "description": "Seguridad en APIs: Hashing unidireccional con passlib/bcrypt, tokens firmados con jose/pyjwt y proteccion de rutas con OAuth2PasswordBearer.",
            "position": 34,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_fa_04_01",
                    "code": "S01",
                    "title": "Criptografia, Tokens JWT y Control de Acceso",
                    "slug": "criptografia-jwt-control-acceso",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_fa_04_01",
                            "code": "L01",
                            "title": "Hashing Seguro de Contraseñas con Passlib",
                            "slug": "hashing-seguro-passlib",
                            "position": 1,
                            "concept_id": "fa-auth-hashing",
                            "objective": "Comprender la diferencia entre encriptacion y hashing, y aplicar algoritmos unidireccionales como bcrypt o argon2.",
                            "theory_markdown": "Nunca se deben almacenar contraseñas en texto plano ni utilizar algoritmos obsoletos como MD5 o SHA-1.\n\nEl **hashing de contraseñas** es una funcion matematica unidireccional irreversible combinada con una 'sal' (salt) aleatoria generada por el algoritmo para protegerse contra ataques de tablas arcoiris (rainbow tables).\n\nEn Python, `passlib.context.CryptContext` proporciona una interfaz estandar:\n```python\nfrom passlib.context import CryptContext\n\npwd_context = CryptContext(schemes=[\"bcrypt\"], deprecated=\"auto\")\n\n# Hashear contrasena en registro:\nhashed_password = pwd_context.hash(\"mi_clave_secreta\")\n\n# Verificar en login:\nes_valido = pwd_context.verify(\"mi_clave_secreta\", hashed_password)\n```",
                            "examples": [
                                {
                                    "title": "Modulo de seguridad de contraseñas",
                                    "code": "from passlib.context import CryptContext\n\npwd_context = CryptContext(schemes=[\"bcrypt\"], deprecated=\"auto\")\n\ndef get_password_hash(password: str) -> str:\n    return pwd_context.hash(password)\n\ndef verify_password(plain_password: str, hashed_password: str) -> bool:\n    return pwd_context.verify(plain_password, hashed_password)\n\nhash_generado = get_password_hash(\"python123\")\nvalido = verify_password(\"python123\", hash_generado)",
                                    "output": "valido -> True\nverify_password('password_incorrecto', hash_generado) -> False",
                                    "explanation": "verify compara de forma segura contra el hash sin revelar la clave original."
                                }
                            ],
                            "common_errors": "Almacenar la contraseña en texto plano en la base de datos o intentar encriptarla con una clave reversible en lugar de usar un algoritmo de hashing salado lento como bcrypt.",
                            "mini_exercise": {
                                "instructions": "Completa la funcion para verificar una clave 'plain' contra 'hashed' usando pwd_context.verify.",
                                "starter_code": "from passlib.context import CryptContext\npwd_context = CryptContext(schemes=[\"bcrypt\"], deprecated=\"auto\")\n\ndef autenticar(plain: str, hashed: str) -> bool:\n    # Retorna la verificacion\n    pass",
                                "solution": "from passlib.context import CryptContext\npwd_context = CryptContext(schemes=[\"bcrypt\"], deprecated=\"auto\")\n\ndef autenticar(plain: str, hashed: str) -> bool:\n    return pwd_context.verify(plain, hashed)"
                            },
                            "key_takeaways": [
                                "Las contraseñas siempre deben almacenarse hasheadas con salt mediante algoritmos como bcrypt.",
                                "CryptContext de passlib administra esquemas de hashing y su verificacion segura.",
                                "verify() realiza una comparacion resistente a ataques de temporizacion (timing attacks)."
                            ],
                            "exercise": {
                                "id": "ex_fa_04_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Por que es fundamental utilizar un algoritmo como bcrypt para almacenar contraseñas en lugar de SHA-256 directo?",
                                "options": [
                                    {"id": "a", "text": "Porque bcrypt incorpora un factor de costo configurable que lo hace deliberadamente lento y resistente a ataques de fuerza bruta en hardware moderno."},
                                    {"id": "b", "text": "Porque SHA-256 no funciona en sistemas operativos de 64 bits."},
                                    {"id": "c", "text": "Porque bcrypt permite recuperar la contraseña original si el usuario la olvida."},
                                    {"id": "d", "text": "Porque bcrypt comprime la contraseña para ahorrar espacio en disco."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "SHA-256 es un algoritmo rapido pensado para integridad de archivos; bcrypt es una funcion de derivacion de claves deliberadamente lenta y con sal para frustrar ataques de fuerza bruta."
                            }
                        },
                        {
                            "id": "les_fa_04_02",
                            "code": "L02",
                            "title": "Estructura y Generacion de Tokens JWT",
                            "slug": "estructura-generacion-jwt",
                            "position": 2,
                            "concept_id": "fa-auth-jwt-structure",
                            "objective": "Comprender la estructura de un JSON Web Token y emitir tokens firmados con fecha de expiracion.",
                            "theory_markdown": "Un **JWT** (JSON Web Token) es un estandar abierto (RFC 7519) para transmitir de forma segura afirmaciones entre partes en formato JSON. Se compone de tres partes separadas por puntos (`header.payload.signature`):\n\n1. **Header:** Especifica el tipo de token (JWT) y el algoritmo de firma (ej. `HS256`).\n2. **Payload:** Contiene las afirmaciones o *claims* (ej. `sub` con el id o username del usuario, `exp` con la fecha y hora de expiracion).\n3. **Signature:** Firma criptografica generada cifrando el header y payload con una clave secreta que solo conoce el servidor.\n\nPara generar un token con `python-jose`:\n```python\nfrom datetime import datetime, timedelta, timezone\nfrom jose import jwt\n\nSECRET_KEY = \"clave_super_secreta_de_produccion\"\nALGORITHM = \"HS256\"\n\ndef create_access_token(data: dict, expires_delta: timedelta) -> str:\n    to_encode = data.copy()\n    expire = datetime.now(timezone.utc) + expires_delta\n    to_encode.update({\"exp\": expire})\n    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)\n```",
                            "examples": [
                                {
                                    "title": "Creacion de un access token firmado",
                                    "code": "from datetime import datetime, timedelta, timezone\nfrom jose import jwt\n\nSECRET_KEY = \"secreto-seguro-1234\"\nALGORITHM = \"HS256\"\n\npayload = {\"sub\": \"usuario_koda\", \"rol\": \"admin\"}\nexpiracion = timedelta(minutes=30)\nexp = datetime.now(timezone.utc) + expiracion\npayload[\"exp\"] = exp\n\ntoken = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)\nprint(token[:20] + \"...\")",
                                    "output": "eyJhbGciOiJIUzI1NiIsIn... (cadena codificada en Base64Url)",
                                    "explanation": "El token contiene la firma criptografica que impide que el cliente modifique el payload sin invalidar el token."
                                }
                            ],
                            "common_errors": "Guardar contraseñas o secretos criticos dentro del payload del JWT. El payload solo esta codificado en Base64, por lo que cualquiera que tenga el token puede leer su contenido.",
                            "mini_exercise": {
                                "instructions": "Anade la clave 'exp' con valor de fecha futura al diccionario to_encode antes de codificar.",
                                "starter_code": "from datetime import datetime, timezone\n\ndata = {\"sub\": \"ana\"}\n# Agrega 'exp' con la fecha utc actual\n",
                                "solution": "from datetime import datetime, timezone\n\ndata = {\"sub\": \"ana\"}\ndata[\"exp\"] = datetime.now(timezone.utc)"
                            },
                            "key_takeaways": [
                                "Un JWT consta de Header, Payload y Signature codificados en Base64Url.",
                                "El claim 'sub' identifica al sujeto (usuario) y 'exp' fija el tiempo limite de validez.",
                                "La firma garantiza que la informacion no ha sido manipulada por terceros."
                            ],
                            "exercise": {
                                "id": "ex_fa_04_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual afirmacion sobre el payload de un token JWT es VERDADERA?",
                                "options": [
                                    {"id": "a", "text": "El payload solo esta codificado en Base64 y firmado, no encriptado; por ende, cualquier persona puede decodificarlo y ver su contenido."},
                                    {"id": "b", "text": "El payload esta encriptado con grado militar y es seguro guardar en el la clave privada del servidor."},
                                    {"id": "c", "text": "El payload solo admite cadenas de texto de hasta 16 caracteres."},
                                    {"id": "d", "text": "El payload no puede contener fechas de expiracion."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Un JWT estandar (JWS) garantiza integridad mediante su firma, pero no confidencialidad; los datos del payload son legibles por cualquiera decodificando el Base64."
                            }
                        },
                        {
                            "id": "les_fa_04_03",
                            "code": "L03",
                            "title": "OAuth2 con Password Flow y OAuth2PasswordBearer",
                            "slug": "oauth2-password-bearer",
                            "position": 3,
                            "concept_id": "fa-auth-oauth2-flow",
                            "objective": "Integrar OAuth2PasswordBearer y OAuth2PasswordRequestForm para autenticacion estandar en FastAPI.",
                            "theory_markdown": "FastAPI incluye utilidades de seguridad que implementan el flujo **OAuth2 Password Bearer**:\n\n1. `OAuth2PasswordRequestForm`:\n   Parsea las credenciales enviadas mediante un formulario `application/x-www-form-urlencoded` con los campos obligatorios `username` y `password`.\n\n2. `OAuth2PasswordBearer(tokenUrl=\"/token\")`:\n   Le indica a FastAPI que busque en las cabeceras HTTP la entrada `Authorization: Bearer <token>`.\n   Ademas, habilita el boton verde interactivo **Authorize** en Swagger UI (`/docs`), permitiendo autenticarse directamente en la documentacion.",
                            "examples": [
                                {
                                    "title": "Endpoint de emision de token /token",
                                    "code": "from fastapi import FastAPI, Depends, HTTPException, status\nfrom fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm\n\napp = FastAPI()\noauth2_scheme = OAuth2PasswordBearer(tokenUrl=\"token\")\n\n@app.post(\"/token\")\nasync def login(form_data: OAuth2PasswordRequestForm = Depends()):\n    # En un caso real se verifica contra BD con verify_password\n    if form_data.username != \"admin\" or form_data.password != \"secreto123\":\n        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=\"Credenciales incorrectas\")\n    # Se emite el token\n    return {\"access_token\": \"token_valido_ejemplo\", \"token_type\": \"bearer\"}",
                                    "output": "POST /token con form-data -> {\"access_token\": \"...\", \"token_type\": \"bearer\"}",
                                    "explanation": "La respuesta estandar OAuth2 requiere retornar un JSON con access_token y token_type fijado en 'bearer'."
                                }
                            ],
                            "common_errors": "Enviar las credenciales en formato JSON en lugar de form-data al endpoint que consume OAuth2PasswordRequestForm, provocando un error 422.",
                            "mini_exercise": {
                                "instructions": "Instancia oauth2_scheme usando OAuth2PasswordBearer apuntando a la ruta 'login'.",
                                "starter_code": "from fastapi.security import OAuth2PasswordBearer\n\n# Crea la instancia oauth2_scheme\n",
                                "solution": "from fastapi.security import OAuth2PasswordBearer\n\noauth2_scheme = OAuth2PasswordBearer(tokenUrl=\"login\")"
                            },
                            "key_takeaways": [
                                "OAuth2PasswordBearer extrae el token de la cabecera 'Authorization: Bearer <token>'.",
                                "OAuth2PasswordRequestForm espera username y password mediante formulario HTTP.",
                                "La respuesta exitosa de login debe incluir access_token y token_type: 'bearer'."
                            ],
                            "exercise": {
                                "id": "ex_fa_04_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "En que cabecera HTTP busca OAuth2PasswordBearer el token JWT enviado por el cliente?",
                                "options": [
                                    {"id": "a", "text": "Authorization: Bearer <token>"},
                                    {"id": "b", "text": "X-API-Key: <token>"},
                                    {"id": "c", "text": "Cookie: session_token=<token>"},
                                    {"id": "d", "text": "Accept: application/token"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El estandar Bearer Token define que el cliente debe transmitir el token en la cabecera 'Authorization' con el prefijo 'Bearer '."
                            }
                        },
                        {
                            "id": "les_fa_04_04",
                            "code": "L04",
                            "title": "Dependencia get_current_user y Proteccion de Rutas",
                            "slug": "dependencia-get-current-user",
                            "position": 4,
                            "concept_id": "fa-auth-protect-routes",
                            "objective": "Decodificar tokens, validar firmas y expiracion, y proteger endpoints con get_current_user.",
                            "theory_markdown": "Para restringir el acceso a un endpoint y exigir un usuario autenticado, creamos una dependencia reutilizable `get_current_user`:\n\n1. Inyecta el token con `token: str = Depends(oauth2_scheme)`.\n2. Decodifica el token con `jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])`.\n3. Si el token expiró o la firma no coincide, `jose` lanza `JWTError`. Se captura la excepcion y se eleva `HTTPException(status_code=401, detail=\"Token invalido o expirado\", headers={\"WWW-Authenticate\": \"Bearer\"})`.\n4. Si el token es valido, se extrae el claim `sub` y se consulta el usuario en la base de datos.\n5. El endpoint protegido simplemente declara `current_user: User = Depends(get_current_user)`.",
                            "examples": [
                                {
                                    "title": "Ruta protegida para consultar el perfil propio",
                                    "code": "from fastapi import FastAPI, Depends, HTTPException, status\nfrom fastapi.security import OAuth2PasswordBearer\nfrom jose import jwt, JWTError\n\napp = FastAPI()\noauth2_scheme = OAuth2PasswordBearer(tokenUrl=\"token\")\nSECRET_KEY = \"clave_secreta\"\nALGORITHM = \"HS256\"\n\nasync def get_current_user(token: str = Depends(oauth2_scheme)) -> dict[str, str]:\n    try:\n        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n        username: str | None = payload.get(\"sub\")\n        if username is None:\n            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=\"Credenciales invalidas\")\n        return {\"username\": username}\n    except JWTError:\n        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=\"Token invalido o expirado\")\n\n@app.get(\"/perfil\")\nasync def leer_perfil(current_user: dict = Depends(get_current_user)):\n    return {\"perfil_de\": current_user[\"username\"]}",
                                    "output": "GET /perfil con cabecera valida -> {\"perfil_de\": \"usuario_koda\"}\nGET /perfil sin cabecera -> 401 Unauthorized",
                                    "explanation": "Cualquier peticion sin un token valido es rechazada de inmediato antes de que el endpoint sea invocado."
                                }
                            ],
                            "common_errors": "Capturar excepciones genericas Exception en lugar de JWTError, ocultando fallas internas no relacionadas con el token.",
                            "mini_exercise": {
                                "instructions": "Escribe un endpoint GET en '/secreto' protegido con Depends(get_current_user) que devuelva {'secreto': 42}.",
                                "starter_code": "from fastapi import FastAPI, Depends\napp = FastAPI()\n\n# Define el endpoint /secreto con Depends(get_current_user)\n",
                                "solution": "from fastapi import FastAPI, Depends\n\napp = FastAPI()\n\n@app.get(\"/secreto\")\nasync def secreto(user = Depends(get_current_user)):\n    return {\"secreto\": 42}"
                            },
                            "key_takeaways": [
                                "get_current_user centraliza la decodificacion, validacion y extraccion del sujeto del token.",
                                "Tokens expirados o alterados lanzan JWTError y deben responder con HTTP 401 Unauthorized.",
                                "Cualquier endpoint puede protegerse declarando Depends(get_current_user)."
                            ],
                            "exercise": {
                                "id": "ex_fa_04_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es el codigo de estado HTTP que una API REST debe retornar cuando un cliente no envia token o este ha expirado?",
                                "options": [
                                    {"id": "a", "text": "401 Unauthorized"},
                                    {"id": "b", "text": "403 Forbidden"},
                                    {"id": "c", "text": "404 Not Found"},
                                    {"id": "d", "text": "400 Bad Request"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "401 Unauthorized indica que la solicitud carece de credenciales de autenticacion validas. 403 Forbidden se usa cuando el usuario esta autenticado pero no tiene permisos suficientes."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "FA_M04",
            "module_slug": "fastapi-auth-jwt",
            "course_slug": "fastapi-async",
            "questions": [
                {
                    "id": "q_fa_04_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual es la funcion de passlib.context.CryptContext en la gestion de contraseñas de usuarios?",
                    "options": [
                        {"id": "a", "text": "Aplicar algoritmos seguros de hashing unidireccional con sal como bcrypt para almacenamiento y verificacion de passwords."},
                        {"id": "b", "text": "Cifrar la base de datos completa con una llave asimetrica."},
                        {"id": "c", "text": "Generar certificados SSL para HTTPS."},
                        {"id": "d", "text": "Comprobar que la contrasena contenga al menos una letra mayuscula."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "CryptContext administra algoritmos seguros de hashing con sal, permitiendo hashear y verificar passwords de forma segura."
                },
                {
                    "id": "q_fa_04_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cuales son las tres partes que componen un token JWT separadas por puntos?",
                    "options": [
                        {"id": "a", "text": "Header, Payload y Signature"},
                        {"id": "b", "text": "Username, Password y Secret"},
                        {"id": "c", "text": "Protocol, Domain y Port"},
                        {"id": "d", "text": "Algorithm, Database y Hash"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "La especificacion RFC 7519 define que un JWT consta de tres componentes: Header, Payload y Signature codificados en Base64Url."
                },
                {
                    "id": "q_fa_04_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que claim estandar de un token JWT define el instante exacto en que el token deja de ser valido?",
                    "options": [
                        {"id": "a", "text": "exp"},
                        {"id": "b", "text": "sub"},
                        {"id": "c", "text": "iat"},
                        {"id": "d", "text": "aud"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "'exp' (Expiration Time) contiene una marca de tiempo Unix que define el momento en que el token expira."
                },
                {
                    "id": "q_fa_04_04",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como asocia FastAPI la documentacion interactiva /docs con el flujo de autenticacion OAuth2?",
                    "options": [
                        {"id": "a", "text": "Mediante OAuth2PasswordBearer(tokenUrl='...'), que anade el boton 'Authorize' en Swagger UI para probar endpoints autenticados."},
                        {"id": "b", "text": "Reescribiendo el codigo HTML de la pagina principal con JavaScript externo."},
                        {"id": "c", "text": "Instalando un plugin adicional en el navegador del usuario."},
                        {"id": "d", "text": "Deshabilitando Swagger UI para usuarios que no sean administradores."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "OAuth2PasswordBearer registra el esquema de seguridad en la especificacion OpenAPI, habilitando el dialogo de autenticacion en Swagger UI."
                },
                {
                    "id": "q_fa_04_05",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Que excepcion de la libreria python-jose se debe capturar al invocar jwt.decode() para detectar tokens invalidos, alterados o con expiracion vencida?",
                    "options": [
                        {"id": "a", "text": "JWTError"},
                        {"id": "b", "text": "KeyError"},
                        {"id": "c", "text": "ValueError"},
                        {"id": "d", "text": "ConnectionResetError"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "JWTError es la clase base para errores de decodificacion, firmas invalidas y tokens expirados en la libreria jose."
                },
                {
                    "id": "q_fa_04_06",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "Que cabecera HTTP estándar debe incluirse en una respuesta 401 Unauthorized segun el flujo OAuth2 Bearer?",
                    "options": [
                        {"id": "a", "text": "WWW-Authenticate: Bearer"},
                        {"id": "b", "text": "X-Auth-Required: True"},
                        {"id": "c", "text": "Retry-After: 60"},
                        {"id": "d", "text": "Content-Encoding: gzip"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "La especificacion HTTP (RFC 6750) exige que al responder con 401 a un fallo de token Bearer se incluya la cabecera WWW-Authenticate: Bearer."
                }
            ]
        }
    },
    {
        "dir": "05_docker_deploy",
        "module_json": {
            "id": "fa_mod_05",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "FA_M05",
            "slug": "fastapi-docker-deploy",
            "course_slug": "fastapi-async",
            "title": "Middlewares, Configuracion con Pydantic Settings y Despliegue con Docker",
            "objective": "Configurar variables de entorno estrictas con pydantic-settings, middlewares de seguridad/CORS y empaquetar FastAPI en Docker multi-stage.",
            "description": "Puesta en produccion: Middlewares asincronos, CORS, variables con BaseSettings y Dockerfiles seguros listos para la nube.",
            "position": 35,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_fa_05_01",
                    "code": "S01",
                    "title": "Configuracion, Middlewares y Contenedores de Produccion",
                    "slug": "config-middlewares-docker",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 55,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_fa_05_01",
                            "code": "L01",
                            "title": "Gestion de Entornos con Pydantic Settings",
                            "slug": "pydantic-settings-entornos",
                            "position": 1,
                            "concept_id": "fa-deploy-settings",
                            "objective": "Centralizar y tipar la configuracion del sistema leyendo variables de entorno y archivos .env con BaseSettings.",
                            "theory_markdown": "El principio III de la metodologia de aplicaciones '12-Factor App' estipula que la configuracion del software debe residir estrictamente en el entorno de ejecucion, nunca grabada en el codigo fuente.\n\nLa libreria `pydantic-settings` proporciona la clase `BaseSettings`, que permite:\n1. Declarar variables requeridas con tipos estrictos (ej. `database_url: str`, `secret_key: str`, `port: int = 8000`).\n2. Leer de forma automatica variables de entorno del sistema operativo o de un archivo `.env`.\n3. Cachear la instancia de configuracion mediante `@lru_cache` para evitar lecturas recurrentes de disco o llamadas al sistema.",
                            "examples": [
                                {
                                    "title": "Definicion y cache de Settings",
                                    "code": "from functools import lru_cache\nfrom pydantic_settings import BaseSettings, SettingsConfigDict\n\nclass Settings(BaseSettings):\n    app_name: str = \"Koda Production API\"\n    debug: bool = False\n    database_url: str\n    secret_key: str\n\n    model_config = SettingsConfigDict(env_file=\".env\", env_file_encoding=\"utf-8\")\n\n@lru_cache\ndef get_settings() -> Settings:\n    return Settings()",
                                    "output": "Si DATABASE_URL no esta definida ni en el entorno ni en .env, Pydantic lanza ValidationError impidiendo que la app arranque sin configuracion.",
                                    "explanation": "BaseSettings garantiza que la aplicacion falle de inmediato al inicio ('fail fast') si falta una variable critica."
                                }
                            ],
                            "common_errors": "Hacer commit de archivos .env que contienen claves de produccion a repositorios publicos de Git.",
                            "mini_exercise": {
                                "instructions": "Crea una clase Settings que herede de BaseSettings con un campo 'api_key: str'.",
                                "starter_code": "from pydantic_settings import BaseSettings\n\n# Define la clase Settings\n",
                                "solution": "from pydantic_settings import BaseSettings\n\nclass Settings(BaseSettings):\n    api_key: str"
                            },
                            "key_takeaways": [
                                "BaseSettings lee variables de entorno y archivos .env con validacion tipada estricta.",
                                "La aplicacion falla al iniciar si falta una variable requerida, previniendo errores en ejecucion.",
                                "@lru_cache optimiza el acceso evitando reinstanciar la configuracion en cada peticion."
                            ],
                            "exercise": {
                                "id": "ex_fa_05_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es el comportamiento de BaseSettings de pydantic-settings si una variable obligatoria sin valor por defecto no existe en el entorno ni en el archivo .env?",
                                "options": [
                                    {"id": "a", "text": "Eleva un ValidationError impidiendo que la aplicacion arranque con una configuracion incompleta o invalida."},
                                    {"id": "b", "text": "Asigna una cadena vacia '' de forma silenciosa."},
                                    {"id": "c", "text": "Descarga un archivo de internet con claves por defecto."},
                                    {"id": "d", "text": "Continua ejecutandose ignorando el campo faltante."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "BaseSettings aplica validacion estricta: si falta un campo requerido, eleva ValidationError deteniendo el inicio del servicio ('fail-fast')."
                            }
                        },
                        {
                            "id": "les_fa_05_02",
                            "code": "L02",
                            "title": "Middlewares y Seguridad CORS",
                            "slug": "middlewares-seguridad-cors",
                            "position": 2,
                            "concept_id": "fa-deploy-cors-middleware",
                            "objective": "Configurar CORSMiddleware para habilitar solicitudes desde clientes web y crear middlewares personalizados.",
                            "theory_markdown": "Un **Middleware** es una funcion que intercepta cada peticion HTTP entrante antes de que llegue a la ruta, y cada respuesta saliente antes de que sea enviada al cliente.\n\n### CORS (Cross-Origin Resource Sharing)\nLos navegadores bloquean por defecto solicitudes JavaScript procedentes de un origen diferente (otro dominio, protocolo o puerto) por la politica del mismo origen (Same-Origin Policy).\n\nPara habilitar la comunicacion segura entre un frontend (ej. `http://localhost:3000`) y FastAPI se registra `CORSMiddleware`:\n```python\nfrom fastapi.middleware.cors import CORSMiddleware\n\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=[\"http://localhost:3000\", \"https://koda.academy\"],\n    allow_credentials=True,\n    allow_methods=[\"*\"],\n    allow_headers=[\"*\"],\n)\n```\n\nTambien se pueden crear middlewares personalizados usando el decorador `@app.middleware(\"http\")` para medir tiempos de respuesta o agregar cabeceras de trazabilidad.",
                            "examples": [
                                {
                                    "title": "Middleware personalizado para calcular el tiempo de procesamiento",
                                    "code": "import time\nfrom fastapi import FastAPI, Request\n\napp = FastAPI()\n\n@app.middleware(\"http\")\nasync def add_process_time_header(request: Request, call_next):\n    start_time = time.perf_counter()\n    response = await call_next(request)\n    process_time = time.perf_counter() - start_time\n    response.headers[\"X-Process-Time\"] = f\"{process_time:.4f}s\"\n    return response",
                                    "output": "Todas las respuestas HTTP incluirán la cabecera 'X-Process-Time: 0.0025s'.",
                                    "explanation": "call_next(request) pasa la solicitud al endpoint correspondiente y captura la respuesta resultante."
                                }
                            ],
                            "common_errors": "Configurar allow_origins=['*'] junto con allow_credentials=True en un entorno de produccion, lo cual es rechazado por las especificaciones de seguridad de los navegadores.",
                            "mini_exercise": {
                                "instructions": "Registra CORSMiddleware en la instancia app permitiendo allow_origins=['https://koda.academy'].",
                                "starter_code": "from fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\n\napp = FastAPI()\n# Agrega el middleware CORS\n",
                                "solution": "from fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\n\napp = FastAPI()\napp.add_middleware(CORSMiddleware, allow_origins=[\"https://koda.academy\"])"
                            },
                            "key_takeaways": [
                                "CORSMiddleware gestiona cabeceras Access-Control-Allow-* para navegadores.",
                                "Middlewares interceptan la peticion antes del endpoint y la respuesta despues del endpoint.",
                                "call_next(request) delega la ejecucion al siguiente eslabon de la cadena de middlewares."
                            ],
                            "exercise": {
                                "id": "ex_fa_05_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Por que un navegador web arroja un error de CORS al intentar realizar una peticion fetch() desde un frontend hacia una API de FastAPI?",
                                "options": [
                                    {"id": "a", "text": "Porque el origen (dominio/puerto) del frontend no coincide con el de la API y el servidor no devolvio cabeceras Access-Control-Allow-Origin autorizandolo."},
                                    {"id": "b", "text": "Porque FastAPI solo puede responder a peticiones enviadas por curl en la terminal."},
                                    {"id": "c", "text": "Porque el servidor Uvicorn no tiene soporte para lenguaje JavaScript."},
                                    {"id": "d", "text": "Porque la base de datos de la API se encuentra temporalmente bloqueada."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El mecanismo de CORS es una politica de seguridad impuesta por el navegador que requiere que el servidor autorice explicitamente origenes externos mediante cabeceras HTTP."
                            }
                        },
                        {
                            "id": "les_fa_05_03",
                            "code": "L03",
                            "title": "Dockerfile Multi-Stage Optimizado para Produccion",
                            "slug": "dockerfile-multistage-produccion",
                            "position": 3,
                            "concept_id": "fa-deploy-dockerfile",
                            "objective": "Escribir un Dockerfile multi-stage con usuario no privilegiado y artefactos minimos para desplegar FastAPI.",
                            "theory_markdown": "Desplegar aplicaciones en contenedores Docker requiere seguir estrictos principios de seguridad y eficiencia:\n\n1. **Construccion multi-etapa (Multi-Stage Builds):**\n   - **Etapa builder:** Instala compiladores (`gcc`), herramientas de empaquetado y compila paquetes 'wheels'.\n   - **Etapa final (runner):** Solo copia los paquetes binarios compilados y el codigo fuente, descartando compiladores y caches de instalacion. Esto reduce drásticamente el tamaño de la imagen y la superficie de ataque.\n\n2. **Ejecucion sin privilegios de root:**\n   Nunca se debe ejecutar el proceso principal del contenedor como usuario `root`. Se crea un usuario dedicado sin privilegios (ej. `appuser`) con la directiva `USER appuser`.",
                            "examples": [
                                {
                                    "title": "Dockerfile multi-stage de produccion para FastAPI",
                                    "code": "FROM python:3.12-slim AS builder\nWORKDIR /app\nRUN apt-get update && apt-get install -y --no-install-recommends build-essential\nCOPY requirements.txt .\nRUN pip install --no-cache-dir --user -r requirements.txt\n\nFROM python:3.12-slim AS runner\nWORKDIR /app\nRUN useradd -m -u 1000 appuser\nCOPY --from=builder /root/.local /home/appuser/.local\nCOPY . .\nENV PATH=/home/appuser/.local/bin:$PATH\nUSER appuser\nEXPOSE 8000\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]",
                                    "output": "Imagen resultante: ~150MB en comparacion con los >800MB de una imagen con dependencias de compilacion.",
                                    "explanation": "El contenedor runner no contiene herramientas de desarrollo ni ejecuta procesos con privilegios administrativos."
                                }
                            ],
                            "common_errors": "Ejecutar uvicorn con --host 127.0.0.1 dentro del Dockerfile, lo que impide que el contenedor reciba trafico proveniente del host o de orquestadores como Kubernetes.",
                            "mini_exercise": {
                                "instructions": "Escribe la directiva CMD para ejecutar Uvicorn en el host 0.0.0.0 y puerto 8000 para el modulo 'app.main:app'.",
                                "starter_code": "# Directiva CMD para uvicorn\nCMD [...]",
                                "solution": "CMD [\"uvicorn\", \"app.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]"
                            },
                            "key_takeaways": [
                                "Multi-stage builds separan la etapa de compilacion de dependencias del entorno de ejecucion final.",
                                "Ejecutar con un usuario no-root mitiga riesgos criticos de escape de contenedores.",
                                "La aplicacion en Docker debe escuchar en --host 0.0.0.0 para ser accesible desde fuera del contenedor."
                            ],
                            "exercise": {
                                "id": "ex_fa_05_03",
                                "type": "single_choice",
                                "difficulty": "hard",
                                "prompt": "Por que es mandatorio enlazar Uvicorn a --host 0.0.0.0 en lugar de 127.0.0.1 dentro de un contenedor Docker?",
                                "options": [
                                    {"id": "a", "text": "Porque 0.0.0.0 escucha en todas las interfaces de red del contenedor, permitiendo recibir trafico enrutado desde el exterior."},
                                    {"id": "b", "text": "Porque 127.0.0.1 deshabilita la compresion gzip en Uvicorn."},
                                    {"id": "c", "text": "Porque 0.0.0.0 es la direccion IP asignada exclusivamente al usuario root."},
                                    {"id": "d", "text": "Porque Docker arroja un error de sintaxis si se escribe 127.0.0.1 en la directiva CMD."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "127.0.0.1 solo acepta conexiones originadas dentro del propio contenedor; 0.0.0.0 enlaza a todas las interfaces, permitiendo el reenvio de puertos desde el exterior."
                            }
                        },
                        {
                            "id": "les_fa_05_04",
                            "code": "L04",
                            "title": "Health Checks, Workers y Arquitectura en Produccion",
                            "slug": "health-checks-workers-produccion",
                            "position": 4,
                            "concept_id": "fa-deploy-health-workers",
                            "objective": "Crear endpoints de Health Check para orquestadores y entender la escala con workers de Uvicorn detras de un proxy inverso.",
                            "theory_markdown": "En entornos de produccion (como Kubernetes, Docker Swarm o AWS ECS), la infraestructura necesita monitorear el estado operativo del contenedor mediante **Health Checks**:\n\n- **Liveness probe (`/healthz` o `/health`):** Comprueba si el proceso esta vivo. Si no responde, el orquestador reinicia el contenedor.\n- **Readiness probe (`/ready`):** Verifica si la aplicacion esta lista para recibir trafico (por ejemplo, validando que la conexion a la base de datos este activa).\n\n### Escala y Proxy Inverso\nEn servidores de produccion:\n1. Un proxy inverso como **Nginx** o **Traefik** gestiona la terminacion SSL/TLS, la compresion estatica y la proteccion DDoS.\n2. Uvicorn se ejecuta con multiples procesos workers para aprovechar todos los nucleos de CPU disponibles:\n   ```bash\n   uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000\n   ```\n   *(o gestionado mediante Gunicorn con clase de worker UvicornWorker)*.",
                            "examples": [
                                {
                                    "title": "Implementacion de Liveness y Readiness probes",
                                    "code": "from fastapi import FastAPI, Response, status\n\napp = FastAPI()\n\n@app.get(\"/healthz\", status_code=status.HTTP_200_OK, tags=[\"operaciones\"])\nasync def liveness():\n    return {\"status\": \"alive\"}\n\n@app.get(\"/ready\", tags=[\"operaciones\"])\nasync def readiness(response: Response):\n    # Simulamos comprobacion de base de datos\n    db_ok = True\n    if not db_ok:\n        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE\n        return {\"status\": \"unhealthy\", \"db\": \"disconnected\"}\n    return {\"status\": \"ready\", \"db\": \"connected\"}",
                                    "output": "GET /healthz -> 200 OK con {\"status\": \"alive\"}\nGET /ready -> 200 OK o 503 Service Unavailable si la BD no responde",
                                    "explanation": "El orquestador no envia trafico a instancias que respondan con codigos de error en el readiness probe."
                                }
                            ],
                            "common_errors": "Ejecutar uvicorn con la bandera --reload en servidores de produccion, lo cual degrada seriamente el rendimiento e introduce sobrecarga innecesaria.",
                            "mini_exercise": {
                                "instructions": "Escribe un endpoint GET en '/health' que retorne {'ok': True} con status_code 200.",
                                "starter_code": "from fastapi import FastAPI\napp = FastAPI()\n\n# Define la ruta de salud\n",
                                "solution": "from fastapi import FastAPI, status\n\napp = FastAPI()\n\n@app.get(\"/health\", status_code=status.HTTP_200_OK)\nasync def health():\n    return {\"ok\": True}"
                            },
                            "key_takeaways": [
                                "Endpoints de salud (/healthz, /ready) permiten a los orquestadores supervisar y recuperar pods caidos.",
                                "En produccion se utilizan multiples workers de Uvicorn para escalar en sistemas multi-core.",
                                "La bandera --reload solo debe usarse en desarrollo local, nunca en produccion."
                            ],
                            "exercise": {
                                "id": "ex_fa_05_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es el rol de un endpoint de Readiness Check (/ready) en un despliegue sobre Kubernetes o contenedores?",
                                "options": [
                                    {"id": "a", "text": "Verificar si el contenedor ha inicializado sus recursos criticos (como la base de datos) para determinar si puede comenzar a recibir trafico de usuarios."},
                                    {"id": "b", "text": "Formatear el disco duro del servidor cada vez que se reinicia."},
                                    {"id": "c", "text": "Compilar el codigo Python a binario C++."},
                                    {"id": "d", "text": "Enviar correos electronicos al equipo de soporte de forma periodica."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El readiness probe le indica al balanceador u orquestador si la instancia ya establecio sus dependencias criticas y esta lista para aceptar peticiones reales."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "FA_M05",
            "module_slug": "fastapi-docker-deploy",
            "course_slug": "fastapi-async",
            "questions": [
                {
                    "id": "q_fa_05_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que beneficio clave ofrece pydantic-settings para la configuracion de aplicaciones FastAPI en produccion?",
                    "options": [
                        {"id": "a", "text": "Permite cargar variables de entorno y archivos .env con tipado estricto y validacion automatica 'fail-fast' al iniciar el servicio."},
                        {"id": "b", "text": "Instala automaticamente librerias faltantes en el sistema operativo."},
                        {"id": "c", "text": "Sustituye la necesidad de utilizar contenedores Docker."},
                        {"id": "d", "text": "Convierte cualquier endpoint asincrono en sincrono."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "pydantic-settings valida al instante las variables de entorno, deteniendo el arranque si faltan claves criticas de configuracion."
                },
                {
                    "id": "q_fa_05_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Como se registra CORSMiddleware en FastAPI para permitir solicitudes desde el frontend 'https://miapp.com'?",
                    "options": [
                        {"id": "a", "text": "app.add_middleware(CORSMiddleware, allow_origins=['https://miapp.com'], allow_methods=['*'], allow_headers=['*'])"},
                        {"id": "b", "text": "app.enable_cors('https://miapp.com')"},
                        {"id": "c", "text": "@app.cors(origin='https://miapp.com')"},
                        {"id": "d", "text": "headers.set('CORS', 'https://miapp.com')"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "add_middleware(CORSMiddleware, allow_origins=...) es el metodo oficial de FastAPI y Starlette para configurar la politica CORS."
                },
                {
                    "id": "q_fa_05_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "En un middleware personalizado de FastAPI @app.middleware('http'), como se pasa el control al siguiente middleware o endpoint de la ruta?",
                    "options": [
                        {"id": "a", "text": "response = await call_next(request)"},
                        {"id": "b", "text": "response = request.forward()"},
                        {"id": "c", "text": "response = next(request)"},
                        {"id": "d", "text": "response = await execute_route()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "call_next(request) es la funcion proporcionada por FastAPI/Starlette para procesar la peticion en el siguiente nivel y retornar la respuesta."
                },
                {
                    "id": "q_fa_05_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Por que es una buena practica de seguridad utilizar la construccion multi-stage en el Dockerfile de una aplicacion FastAPI?",
                    "options": [
                        {"id": "a", "text": "Porque aisla herramientas de compilacion pesadas en una primera etapa y entrega una imagen final ligera con solo los artefactos necesarios y menor superficie de ataque."},
                        {"id": "b", "text": "Porque permite compilar el kernel de Linux dentro de la imagen final."},
                        {"id": "c", "text": "Porque evita la necesidad de exponer puertos de red en el contenedor."},
                        {"id": "d", "text": "Porque multiplica por diez la velocidad de la base de datos."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Multi-stage builds reducen el peso de la imagen y eliminan compiladores y paquetes de desarrollo de la imagen de produccion, minimizando vulnerabilidades."
                },
                {
                    "id": "q_fa_05_05",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que bandera de Uvicorn NUNCA debe usarse al ejecutar FastAPI en un servidor de produccion?",
                    "options": [
                        {"id": "a", "text": "--reload"},
                        {"id": "b", "text": "--host"},
                        {"id": "c", "text": "--port"},
                        {"id": "d", "text": "--workers"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "--reload monitoriza continuamente el sistema de archivos consumiendo recursos significativos e introduciendo inestabilidad en produccion."
                },
                {
                    "id": "q_fa_05_06",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "Cual es el proposito fundamental de un endpoint /healthz en una API que se despliega en Kubernetes?",
                    "options": [
                        {"id": "a", "text": "Permitir que el orquestador compruebe que el proceso de la aplicacion esta vivo y responder con 200 OK."},
                        {"id": "b", "text": "Reiniciar la base de datos cada 5 minutos."},
                        {"id": "c", "text": "Calcular la factura de la nube en tiempo real."},
                        {"id": "d", "text": "Borrar los logs de error del servidor."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El endpoint /healthz (liveness probe) es consultado periodicamente por orquestadores para confirmar que el proceso sigue vivo y responde peticiones."
                }
            ]
        }
    }
]

def main():
    print("Iniciando generacion de 5 modulos de FastAPI...")
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
