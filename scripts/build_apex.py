# -*- coding: utf-8 -*-
"""
Script de calibracion y generacion para Apex Master Gate (01_apex_master_gate).
Estandariza a 1 seccion con 4 microlecciones y 6 preguntas en el banco de evaluacion,
garantizando cero spoilers, calibracion pedagogica y cero emojis.
"""

import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APEX_DIR = os.path.join(BASE_DIR, "content", "languages", "python", "modules", "apex", "01_apex_master_gate")

def build_apex():
    module_data = {
        "id": "py_mod_apex_gate",
        "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
        "code": "PY_APEX_GATE",
        "slug": "apex-master-gate",
        "course_slug": "python-apex",
        "title": "Apex Master Gate: Proyecto Integrador de Certificacion",
        "objective": "Construir, auditar y desplegar una plataforma completa de software en Python que integre arquitectura avanzada, servicios asincronos y componentes inteligentes.",
        "description": "El desafio cumbre de Python Specialist. Unifica el tronco comun avanzado con tu especialidad en una aplicacion empresarial lista para produccion.",
        "position": 61,
        "status": "published",
        "content_version": 1,
        "total_sections": 1,
        "total_lessons": 4,
        "thresholds": {
            "quiz": 85,
            "exam": 90
        },
        "xp": {
            "on_pass": 1000
        },
        "sections": [
            {
                "id": "sec-apex-01",
                "code": "APEX-S1",
                "title": "Fases del Proyecto Integrador Apex",
                "slug": "fases-proyecto-apex",
                "position": 1,
                "type": "project",
                "estimated_minutes": 270,
                "xp_on_complete": 1000,
                "lessons": [
                    {
                        "id": "apex-01",
                        "code": "APEX-01",
                        "title": "Fase 1: Arquitectura Limpia y Contratos de Dominio",
                        "slug": "fase-1-arquitectura-contratos",
                        "position": 1,
                        "concept_id": "apex_clean_architecture",
                        "objective": "Estructurar una solucion desacoplando la logica de negocio de la infraestructura mediante arquitectura limpia y tipado estricto con Protocol.",
                        "theory_markdown": "El Apex Master Gate simula un encargo del mundo real: disenar una plataforma empresarial escalable, mantenible y lista para produccion.\n\n### 1. Principio de Inversion de Dependencias (DIP)\nEl nucleo de dominio no debe importar frameworks externos (ni FastAPI, ni Django, ni drivers SQL, ni ChromaDB). Las interfaces y entidades de negocio se definen en Python puro utilizando `dataclasses` inmutables y `typing.Protocol`.\n\n```text\n+---------------------------------------------+\n|               Entidades / Dominio           |\n|  (Modelos inmutables, reglas de negocio)    |\n+----------------------+----------------------+\n                       ^\n+----------------------+----------------------+\n|           Casos de Uso / Servicios         |\n|  (Orquestacion, protocolos de repositorios) |\n+----------------------+----------------------+\n                       ^\n+----------------------+----------------------+\n|          Adaptadores / Infraestructura      |\n|  (FastAPI routers, SQLite/Postgres, LLMs)   |\n+---------------------------------------------+\n```\n\n### 2. Estructura de Paquetes\nOrganiza el proyecto con separacion de responsabilidades:\n```text\nsrc/\n├── domain/\n│   ├── models.py\n│   └── ports.py\n├── application/\n│   └── use_cases.py\n└── infrastructure/\n    ├── api/\n    └── storage/\n```",
                        "examples": [
                            {
                                "title": "Definicion de Entidad y Protocolo de Repositorio",
                                "code": "from dataclasses import dataclass\nfrom typing import Protocol, List, Optional\nfrom datetime import datetime\n\n@dataclass(frozen=True)\nclass KnowledgeItem:\n    id: str\n    title: str\n    content: str\n    created_at: datetime\n\nclass KnowledgeRepository(Protocol):\n    async def save(self, item: KnowledgeItem) -> None: ...\n    async def get_by_id(self, item_id: str) -> Optional[KnowledgeItem]: ...\n    async def search(self, query: str, limit: int = 5) -> List[KnowledgeItem]: ...",
                                "explanation": "El dominio solo depende de tipos nativos de Python y de typing.Protocol, garantizando independencia total de librerias externas."
                            }
                        ],
                        "common_errors": "Acoplar modelos ORM o clientes de red dentro de la capa de dominio, impidiendo sustituir la base de datos o ejecutar pruebas unitarias puras.",
                        "mini_exercise": {
                            "instructions": "Declara una dataclass inmutable Document con campos doc_id y body, y un Protocol DocumentEngine con un metodo process(doc: Document) -> bool.",
                            "starter_code": "from dataclasses import dataclass\nfrom typing import Protocol\n\n# Define Document y DocumentEngine\n",
                            "solution": "from dataclasses import dataclass\nfrom typing import Protocol\n\n@dataclass(frozen=True)\nclass Document:\n    doc_id: str\n    body: str\n\nclass DocumentEngine(Protocol):\n    def process(self, doc: Document) -> bool:\n        ..."
                        },
                        "key_takeaways": [
                            "La arquitectura limpia aisla las reglas de negocio de frameworks y bases de datos.",
                            "Los Protocols permiten tipado estatico estructural sin acoplamiento rigido por herencia."
                        ],
                        "exercise": {
                            "id": "ex-apex-01",
                            "type": "single_choice",
                            "difficulty": "hard",
                            "prompt": "Cual es el beneficio primordial de definir contratos de infraestructura mediante typing.Protocol en la capa de dominio?",
                            "options": [
                                {
                                    "id": "a",
                                    "text": "Permite que el dominio declare la interfaz requerida sin depender de implementaciones concretas ni bibliotecas externas."
                                },
                                {
                                    "id": "b",
                                    "text": "Obliga a Python a compilar las funciones a codigo C de forma estatica."
                                },
                                {
                                    "id": "c",
                                    "text": "Convierte llamadas sincronas en asincronas de manera transparente."
                                },
                                {
                                    "id": "d",
                                    "text": "Elimina la necesidad de escribir pruebas automatizadas."
                                }
                            ],
                            "correct_option_id": "a",
                            "explanation": "Protocol establece un contrato estructural agnostico de la implementacion concreta (DIP)."
                        }
                    },
                    {
                        "id": "apex-02",
                        "code": "APEX-02",
                        "title": "Fase 2: Orquestacion Asincrona, Resiliencia y Fallbacks",
                        "slug": "fase-2-orquestacion-resiliencia",
                        "position": 2,
                        "concept_id": "apex_async_orchestration",
                        "objective": "Implementar el motor asincrono combinando concurrencia no bloqueante con manejo de timeouts, circuit breakers y recoleccion segura de excepciones.",
                        "theory_markdown": "En la Fase 2, se conectan los adaptadores asincronos para garantizar alto rendimiento y tolerancia a fallos.\n\n### 1. Concurrencia Robusta con AsyncIO\nAl invocar multiples servicios concurrentemente con `asyncio.gather`, se debe utilizar `return_exceptions=True` para que una falla puntual en una fuente de datos no cancele abruptamente la ejecucion de las demas tareas.\n\n### 2. Timeouts y Proteccion de Red\nNinguna llamada I/O de red debe ejecutarse sin limite de tiempo:\n```python\nawait asyncio.wait_for(client.get(url), timeout=3.0)\n```\nSi se supera el tiempo maximo, se captura `asyncio.TimeoutError` y se activa una estrategia de fallback (degradacion elegante).",
                        "examples": [
                            {
                                "title": "Ejecucion Segura con Timeout y Manejo de Errores",
                                "code": "import asyncio\nfrom typing import Any, Dict\n\nasync def fetch_with_safety(coro, timeout_secs: float = 3.0) -> Dict[str, Any]:\n    try:\n        res = await asyncio.wait_for(coro, timeout=timeout_secs)\n        return {\"status\": \"ok\", \"data\": res}\n    except asyncio.TimeoutError:\n        return {\"status\": \"error\", \"reason\": \"timeout_exceeded\"}\n    except Exception as exc:\n        return {\"status\": \"error\", \"reason\": str(exc)}",
                                "explanation": "Encapsula llamadas asincronas criticas evitando que la aplicacion quede bloqueada indefinidamente ante fallas de red."
                            }
                        ],
                        "common_errors": "No configurar timeouts en operaciones asincronas externas, provocando el agotamiento del pool de conexiones del servidor.",
                        "mini_exercise": {
                            "instructions": "Escribe una funcion asincrona execute_tasks(tasks) que ejecute la lista de corutinas concurrentemente con asyncio.gather y retorne las excepciones sin abortar.",
                            "starter_code": "import asyncio\n\nasync def execute_tasks(tasks: list):\n    # Ejecuta concurrentemente\n    pass",
                            "solution": "import asyncio\n\nasync def execute_tasks(tasks: list):\n    return await asyncio.gather(*tasks, return_exceptions=True)"
                        },
                        "key_takeaways": [
                            "asyncio.gather con return_exceptions=True preserva las respuestas exitosas aun si otras tareas fallan.",
                            "Toda llamada asincrona externa debe contener un timeout estricto para evitar bloqueos."
                        ],
                        "exercise": {
                            "id": "ex-apex-02",
                            "type": "single_choice",
                            "difficulty": "hard",
                            "prompt": "Por que es fundamental utilizar return_exceptions=True al invocar asyncio.gather en tareas de agregacion de datos concurrentes?",
                            "options": [
                                {
                                    "id": "a",
                                    "text": "Porque evita que una excepcion en una tarea individual cancele inmediatamente las demas operaciones en curso."
                                },
                                {
                                    "id": "b",
                                    "text": "Porque reduce el consumo de memoria a la mitad."
                                },
                                {
                                    "id": "c",
                                    "text": "Porque transforma excepciones en advertencias del compilador."
                                },
                                {
                                    "id": "d",
                                    "text": "Porque delega la ejecucion a multiples procesos del sistema operativo."
                                }
                            ],
                            "correct_option_id": "a",
                            "explanation": "Sin return_exceptions=True, el primer fallo interrumpe y cancela todo el conjunto; con este parametro, las excepciones se devuelven como valores en la lista de resultados."
                        }
                    },
                    {
                        "id": "apex-03",
                        "code": "APEX-03",
                        "title": "Fase 3: Pruebas Automatizadas y Fixtures Asincronas con Pytest",
                        "slug": "fase-3-testing-pytest-asyncio",
                        "position": 3,
                        "concept_id": "apex_testing_asyncio",
                        "objective": "Disenar una suite integral de pruebas unitarias y de integracion usando Pytest, fixtures asincronas y simulacion de contratos HTTP con AsyncClient.",
                        "theory_markdown": "Una aplicacion empresarial en Python requiere validacion rigurosa en su piramide de pruebas.\n\n### 1. Fixtures Asincronas con pytest-asyncio\nPara probar componentes que operan sobre el event loop o clientes HTTP asincronos, se decora la fixture con `@pytest_asyncio.fixture`:\n```python\nimport pytest_asyncio\nfrom httpx import AsyncClient, ASGITransport\n\n@pytest_asyncio.fixture\nasync def async_client():\n    transport = ASGITransport(app=app)\n    async with AsyncClient(transport=transport, base_url=\"http://test\") as client:\n        yield client\n```\n\n### 2. Pruebas de Limites y Mocks\n- **Unitarias:** Verifican los casos de uso inyectando falsos repositorios (fakes basados en diccionarios en memoria).\n- **Integracion:** Validan los endpoints ASGI con `AsyncClient`, comprobando codigos de estado HTTP y esquemas de respuesta.",
                        "examples": [
                            {
                                "title": "Test Asincrono con Marcador de Pytest",
                                "code": "import pytest\n\n@pytest.mark.asyncio\nasync def test_health_check(async_client):\n    response = await async_client.get(\"/health\")\n    assert response.status_code == 200\n    assert response.json() == {\"status\": \"healthy\"}",
                                "explanation": "@pytest.mark.asyncio le indica al ejecutor de pruebas que ejecute la corutina dentro de un bucle de eventos."
                            }
                        ],
                        "common_errors": "Intentar probar funciones asincronas con funciones normales def sin decorador @pytest.mark.asyncio, lo que genera corutinas que nunca se esperan (unawaited coroutine warning).",
                        "mini_exercise": {
                            "instructions": "Escribe un test asincrono con pytest que compruebe que await calculate_score(10) es igual a 100.",
                            "starter_code": "import pytest\n\n# Define el test asincrono\n",
                            "solution": "import pytest\n\n@pytest.mark.asyncio\nasync def test_score():\n    result = await calculate_score(10)\n    assert result == 100"
                        },
                        "key_takeaways": [
                            "pytest-asyncio proporciona el decorador @pytest.mark.asyncio para ejecutar tests en corutinas.",
                            "ASGITransport permite evaluar routers FastAPI o Starlette sin necesidad de sockets de red reales."
                        ],
                        "exercise": {
                            "id": "ex-apex-03",
                            "type": "single_choice",
                            "difficulty": "hard",
                            "prompt": "Cual es el decorador estandar que provee pytest-asyncio para definir fixtures generadoras asincronas con ciclo setup y teardown?",
                            "options": [
                                {
                                    "id": "a",
                                    "text": "@pytest_asyncio.fixture"
                                },
                                {
                                    "id": "b",
                                    "text": "@pytest.fixture_async"
                                },
                                {
                                    "id": "c",
                                    "text": "@asyncio.fixture"
                                },
                                {
                                    "id": "d",
                                    "text": "@test.fixture(coroutine=True)"
                                }
                            ],
                            "correct_option_id": "a",
                            "explanation": "@pytest_asyncio.fixture es la sintaxis oficial para declarar fixtures asincronas en Pytest."
                        }
                    },
                    {
                        "id": "apex-04",
                        "code": "APEX-04",
                        "title": "Fase 4: Dockerfile Multi-Stage, Seguridad y Despliegue en Produccion",
                        "slug": "fase-4-docker-seguridad-produccion",
                        "position": 4,
                        "concept_id": "apex_docker_deployment",
                        "objective": "Empaquetar la plataforma completa mediante un Dockerfile multi-stage, usuario sin privilegios y verificacion de salud (healthcheck).",
                        "theory_markdown": "La certificacion Apex exige que la solucion este preparada para entornos productivos reales.\n\n### 1. Construccion Multi-Stage\nEl patron multi-stage compila dependencias y ruedas en una primera etapa (builder) y copia unicamente los binarios requeridos a la imagen final (runner). Esto reduce el peso de la imagen de gigabytes a apenas megabytes y elimina compiladores como `gcc` de produccion.\n\n```dockerfile\n# Etapa 1: Compilacion y resolucion de dependencias\nFROM python:3.12-slim AS builder\nWORKDIR /app\nRUN pip install --no-cache-dir poetry\nCOPY pyproject.toml poetry.lock ./\nRUN poetry export -f requirements.txt --output requirements.txt --without-hashes\n\n# Etapa 2: Imagen final para ejecucion\nFROM python:3.12-slim AS runner\nWORKDIR /app\nRUN useradd -u 1001 -m appuser\nCOPY --from=builder /app/requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY src/ ./src/\nUSER appuser\nEXPOSE 8000\nHEALTHCHECK --interval=30s --timeout=5s CMD python -c \"import urllib.request; urllib.request.urlopen('http://localhost:8000/health')\" || exit 1\nCMD [\"uvicorn\", \"src.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n```\n\n### 2. Principios de Hardening y Seguridad\n- **No root:** El contenedor jamas debe ejecutarse como usuario root (`USER appuser`).\n- **Zero secrets in build:** Secretos de API y llaves criptograficas deben inyectarse en runtime via variables de entorno o gestores de secretos, jamas quemados en la imagen Docker.",
                        "examples": [
                            {
                                "title": "Creacion de usuario no privilegiado en Dockerfile",
                                "code": "RUN useradd -u 1001 -m appuser\nUSER appuser",
                                "explanation": "Establece que el proceso de la aplicacion se ejecute con privilegios minimos, impidiendo modificaciones al sistema de archivos del contenedor."
                            }
                        ],
                        "common_errors": "Dejar credenciales o tokens quemados en directivas ENV del Dockerfile, las cuales quedan expuestas en el historial de capas de la imagen.",
                        "mini_exercise": {
                            "instructions": "Escribe la directiva de Dockerfile para cambiar el usuario de ejecucion al usuario no privilegiado llamado kodauser.",
                            "starter_code": "# Cambia el usuario\n",
                            "solution": "USER kodauser"
                        },
                        "key_takeaways": [
                            "Las imagenes multi-stage minimizan el tamano y la superficie de ataque al descartar herramientas de build.",
                            "Ejecutar contenedores con un usuario no root es un requisito obligatorio de seguridad industrial."
                        ],
                        "exercise": {
                            "id": "ex-apex-04",
                            "type": "single_choice",
                            "difficulty": "hard",
                            "prompt": "Cual es la razon fundamental para emplear un esquema de construccion multi-stage en el Dockerfile de una aplicacion Python para produccion?",
                            "options": [
                                {
                                    "id": "a",
                                    "text": "Aislar herramientas de compilacion y dependencias de build de la imagen final, reduciendo el tamano y la superficie de ataque."
                                },
                                {
                                    "id": "b",
                                    "text": "Permitir que la aplicacion utilice multiples procesadores de hardware sin soporte del sistema operativo."
                                },
                                {
                                    "id": "c",
                                    "text": "Eliminar la necesidad de utilizar variables de entorno para la configuracion."
                                },
                                {
                                    "id": "d",
                                    "text": "Garantizar que todo el codigo se reescriba en formato binario C."
                                }
                            ],
                            "correct_option_id": "a",
                            "explanation": "Multi-stage permite descartar compiladores pesados y paquetes temporales, produciendo una imagen ligera y segura para produccion."
                        }
                    }
                ]
            }
        ]
    }

    bank_data = {
        "module_code": "PY_APEX_GATE",
        "module_slug": "apex-master-gate",
        "course_slug": "python-apex",
        "questions": [
            {
                "id": "apex-q01",
                "type": "single_choice",
                "difficulty": "hard",
                "prompt": "En una arquitectura limpia en Python, cual capa NO debe contener ninguna referencia ni importacion de librerias de infraestructura como bases de datos, ORMs o frameworks web?",
                "options": [
                    {
                        "id": "a",
                        "text": "La capa de Dominio / Entidades"
                    },
                    {
                        "id": "b",
                        "text": "La capa de Controladores / Routers"
                    },
                    {
                        "id": "c",
                        "text": "La capa de Repositorios de Infraestructura"
                    },
                    {
                        "id": "d",
                        "text": "El archivo de configuracion del servidor web"
                    }
                ],
                "correct_option_id": "a",
                "explanation": "El dominio es el nucleo del negocio y debe mantenerse desacoplado y agnostico de frameworks o librerias externas."
            },
            {
                "id": "apex-q02",
                "type": "predict_output",
                "difficulty": "hard",
                "prompt": "Cual es la salida exacta de la siguiente rutina asincrona al ejecutarse?",
                "prompt_code": "import asyncio\n\nasync def compute():\n    await asyncio.sleep(0.01)\n    return \"APEX_CERTIFIED\"\n\nasync def main():\n    res = await asyncio.gather(compute())\n    print(res)\n\nasyncio.run(main())",
                "options": [
                    {
                        "id": "a",
                        "text": "['APEX_CERTIFIED']"
                    },
                    {
                        "id": "b",
                        "text": "'APEX_CERTIFIED'"
                    },
                    {
                        "id": "c",
                        "text": "None"
                    },
                    {
                        "id": "d",
                        "text": "Error de ejecucion: gather requiere una lista obligatoria"
                    }
                ],
                "correct_option_id": "a",
                "explanation": "asyncio.gather empaqueta los resultados de todas las corutinas recibidas en una lista ordenada."
            },
            {
                "id": "apex-q03",
                "type": "fill_blank",
                "difficulty": "hard",
                "prompt": "Completa el decorador estandar de pytest-asyncio para definir una fixture asincrona que ejecute operaciones con context manager:",
                "prompt_code": "import pytest_asyncio\n\n___\nasync def db_connection():\n    conn = await connect()\n    yield conn\n    await conn.close()",
                "options": [
                    {
                        "id": "a",
                        "text": "@pytest_asyncio.fixture"
                    },
                    {
                        "id": "b",
                        "text": "@pytest.async_fixture"
                    },
                    {
                        "id": "c",
                        "text": "@asyncio.fixture"
                    },
                    {
                        "id": "d",
                        "text": "@test.coroutine_fixture"
                    }
                ],
                "correct_option_id": "a",
                "explanation": "pytest_asyncio.fixture es el decorador oficial de la biblioteca pytest-asyncio para fixtures asincronas con setup y teardown."
            },
            {
                "id": "apex-q04",
                "type": "single_choice",
                "difficulty": "hard",
                "prompt": "Que comportamiento exhibe asyncio.gather(*tareas, return_exceptions=True) si una de las corutinas lanza una excepcion durante su ejecucion?",
                "options": [
                    {
                        "id": "a",
                        "text": "Captura la excepcion y la incluye como un elemento en la lista de resultados devueltos, permitiendo que las demas tareas continuen su ejecucion normal."
                    },
                    {
                        "id": "b",
                        "text": "Cancela inmediatamente todas las demas corutinas activas y propaga el error."
                    },
                    {
                        "id": "c",
                        "text": "Omite la tarea fallida y devuelve una lista reducida que contiene unicamente los valores validos."
                    },
                    {
                        "id": "d",
                        "text": "Reinicia el Event Loop desde el inicio de la aplicacion."
                    }
                ],
                "correct_option_id": "a",
                "explanation": "Con return_exceptions=True, los errores no interrumpen el lote; se retornan como objetos de excepcion dentro de la lista para inspeccion controlada."
            },
            {
                "id": "apex-q05",
                "type": "find_error",
                "difficulty": "hard",
                "prompt": "Identifica la falla critica de seguridad en el siguiente Dockerfile destinado a despliegue en produccion:",
                "prompt_code": "FROM python:3.12-slim\nWORKDIR /root\nCOPY . .\nENV DATABASE_PASSWORD=\"prod_super_secret_master_password\"\nCMD [\"python\", \"server.py\"]",
                "options": [
                    {
                        "id": "a",
                        "text": "Hardcodear contrasenas de produccion en directivas ENV de la imagen y ejecutar en el directorio de root sin usuario sin privilegios."
                    },
                    {
                        "id": "b",
                        "text": "La instruccion CMD debe usar obligatoriamente comillas simples."
                    },
                    {
                        "id": "c",
                        "text": "WORKDIR nunca puede apuntar a directorios del sistema."
                    },
                    {
                        "id": "d",
                        "text": "python:3.12-slim no permite ejecutar archivos llamados server.py."
                    }
                ],
                "correct_option_id": "a",
                "explanation": "Los secretos quedan grabados de forma permanente en las capas de la imagen y ejecutar como root expone el host si el contenedor es comprometido."
            },
            {
                "id": "apex-q06",
                "type": "single_choice",
                "difficulty": "hard",
                "prompt": "Cual de las siguientes herramientas de la cadena de integracion continua de Python se encarga de auditar contratos de tipado y adherencia a interfaces estaticas sin ejecutar el codigo?",
                "options": [
                    {
                        "id": "a",
                        "text": "Mypy / Pyright"
                    },
                    {
                        "id": "b",
                        "text": "Uvicorn"
                    },
                    {
                        "id": "c",
                        "text": "Celery"
                    },
                    {
                        "id": "d",
                        "text": "Gunicorn"
                    }
                ],
                "correct_option_id": "a",
                "explanation": "Mypy y Pyright son comprobadores estaticos de tipos (type checkers) que garantizan el cumplimiento de los contratos definidos con Protocol y Type Hints."
            }
        ]
    }

    mod_file = os.path.join(APEX_DIR, "module.json")
    bank_file = os.path.join(APEX_DIR, "bank.json")

    with open(mod_file, "w", encoding="utf-8") as f:
        json.dump(module_data, f, ensure_ascii=False, indent=2)

    with open(bank_file, "w", encoding="utf-8") as f:
        json.dump(bank_data, f, ensure_ascii=False, indent=2)

    print("Apex Master Gate actualizado exitosamente con 4 microlecciones y 6 preguntas.")

if __name__ == "__main__":
    build_apex()
