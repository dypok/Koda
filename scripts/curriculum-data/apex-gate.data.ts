import type { RawModule } from './types.ts';

export const APEX_MODULES: RawModule[] = [
  {
    id: 'py_mod_apex_gate',
    language_id: 'python',
    code: 'PY_APEX_GATE',
    slug: 'apex-master-gate',
    title: 'Apex Master Gate: Proyecto Integrador de Certificación',
    objective: 'Construir, auditar y desplegar una plataforma completa de software en Python que integre arquitectura avanzada, servicios asíncronos y componentes inteligentes.',
    description: 'El desafío cumbre de Python Specialist. Unifica el tronco común avanzado con tu especialidad en una aplicación empresarial lista para producción.',
    folder: 'apex/01_apex_master_gate',
    course_slug: 'python-apex',
    position: 61,
    status: 'published',
    thresholds: { quiz: 85, exam: 90 },
    xp: { on_pass: 1000 },
    sections: [
      {
        id: 'sec-apex-01',
        code: 'APEX-S1',
        title: 'Fase 1: Arquitectura y Modelado del Dominio',
        slug: 'fase-1-arquitectura',
        position: 1,
        type: 'exercise',
        estimated_minutes: 60,
        xp_on_complete: 400,
        lessons: [
          {
            id: 'apex-01',
            code: 'APEX-01',
            title: 'Fase 1: Arquitectura Hexagonal y Contratos de Datos',
            slug: 'fase-1-arquitectura-contratos',
            position: 1,
            concept_id: 'apex-clean-architecture',
            objective: 'Estructurar una solución Python profesional desacoplando la lógica de negocio de la infraestructura mediante arquitectura limpia y tipado estricto.',
            theory_markdown: `El Apex Master Gate simula un encargo del mundo real: diseñar una plataforma de análisis y automatización empresarial.

### 1. El Principio de Inversión de Dependencias (DIP)
Tu núcleo de dominio no debe importar frameworks externos (ni FastAPI, ni Django, ni ChromaDB). Las interfaces y entidades de negocio son código Python puro (\`dataclasses\`, \`Protocol\`, \`AbstractBaseClasses\`).

\`\`\`
  +---------------------------------------------+
  |               Entidades / Dominio            |
  |  (Modelos inmutables, reglas de negocio)     |
  +----------------------+----------------------+
                         ^
  +----------------------+----------------------+
  |           Casos de Uso / Servicios          |
  |  (Orquestación, protocolos de repositorios)  |
  +----------------------+----------------------+
                         ^
  +----------------------+----------------------+
  |          Adaptadores / Infraestructura       |
  |  (FastAPI routers, SQLite/PostgreSQL, LLMs) |
  +---------------------------------------------+
\`\`\`

### 2. Estructura de Paquetes
Organiza el proyecto con un diseño modular:
\`\`\`text
src/
├── domain/
│   ├── models.py
│   └── ports.py
├── application/
│   └── use_cases.py
└── infrastructure/
    ├── api/
    └── storage/
\`\`\``,
            examples: [
              {
                title: 'Definición de Entidad y Protocolo de Repositorio',
                code: `from dataclasses import dataclass
from typing import Protocol, List
from datetime import datetime

@dataclass(frozen=True)
class KnowledgeItem:
    id: str
    title: str
    content: str
    created_at: datetime

class KnowledgeRepository(Protocol):
    async def save(self, item: KnowledgeItem) -> None: ...
    async def get_by_id(self, item_id: str) -> KnowledgeItem | None: ...
    async def search(self, query: str, limit: int = 5) -> List[KnowledgeItem]: ...`,
                explanation: 'El dominio solo depende de tipos estándar de Python y `typing.Protocol`.'
              }
            ],
            common_errors: 'Acoplar la base de datos o el framework web dentro de las clases del modelo de negocio, lo que impide probar o reemplazar componentes.',
            mini_exercise: {
              instructions: 'Declara una dataclass inmutable Document y un Protocol DocumentEngine con un método process(doc: Document) -> bool.',
              starter_code: `from dataclasses import dataclass
from typing import Protocol

# Define Document y DocumentEngine
`,
              solution: `from dataclasses import dataclass
from typing import Protocol

@dataclass(frozen=True)
class Document:
    doc_id: str
    body: str

class DocumentEngine(Protocol):
    def process(self, doc: Document) -> bool:
        ...`
            },
            key_takeaways: [
              'La arquitectura limpia aísla las reglas de negocio de librerías y bases de datos.',
              'Los Protocols permiten tipado estático estructural sin acoplamiento por herencia.'
            ],
            exercise: {
              id: 'ex-apex-01',
              type: 'single_choice',
              difficulty: 'hard',
              prompt: '¿Cuál es el beneficio de definir contratos de infraestructura mediante typing.Protocol en el módulo de dominio?',
              options: [
                { id: 'a', text: 'Permite que el dominio defina la interfaz requerida sin depender de implementaciones concretas.' },
                { id: 'b', text: 'Obliga a que Python compile el código a lenguaje ensamblador.' },
                { id: 'c', text: 'Convierte todas las funciones síncronas en asíncronas automáticamente.' },
                { id: 'd', text: 'Elimina la necesidad de escribir pruebas unitarias.' }
              ],
              correct_option_id: 'a',
              explanation: 'Protocol establece un tipado estructural independiente de cómo y dónde se implemente la infraestructura.'
            }
          }
        ]
      },
      {
        id: 'sec-apex-02',
        code: 'APEX-S2',
        title: 'Fase 2: Motor de Servicios y Capacidades Inteligentes',
        slug: 'fase-2-servicios-ia',
        position: 2,
        type: 'exercise',
        estimated_minutes: 90,
        xp_on_complete: 500,
        lessons: [
          {
            id: 'apex-02',
            code: 'APEX-02',
            title: 'Fase 2: Orquestación Asíncrona y Agentes de Decisión',
            slug: 'fase-2-orquestacion-agentes',
            position: 1,
            concept_id: 'apex-async-orchestration',
            objective: 'Implementar el motor asíncrono central combinando procesamiento concurrente seguro y toma de decisiones guiada por herramientas.',
            theory_markdown: `En la Fase 2, conectamos los adaptadores de infraestructura para dar vida al sistema.

### 1. Concurrencia Robusta con AsyncIO
Asegúrate de manejar excepciones concurrentes y tareas cancelables mediante \`asyncio.TaskGroup\` o \`asyncio.gather\` con \`return_exceptions=True\`.

### 2. Integración de Herramientas y Fallbacks
Si el sistema consulta un modelo de IA o una API externa, debe incluir:
- **Timeouts explícitos:** Nunca dejes una llamada a la red sin límite de tiempo.
- **Circuit Breaker:** Si la API externa falla reiteradamente, responder con un fallback predeterminado.
- **Validación con Pydantic:** Todas las respuestas de modelos de lenguaje deben someterse a esquemas estrictos antes de ser procesadas por el negocio.`,
            examples: [
              {
                title: 'Ejecución Resiliente con Timeout y Manejo de Errores',
                code: `import asyncio
from typing import Any

async def fetch_with_safety(coro: Any, timeout_secs: float = 3.0) -> Any:
    try:
        return await asyncio.wait_for(coro, timeout=timeout_secs)
    except asyncio.TimeoutError:
        return {"status": "error", "reason": "timeout_exceeded"}
    except Exception as exc:
        return {"status": "error", "reason": str(exc)}`,
                explanation: 'Protege las llamadas a servicios externos para que una falla no bloquee todo el ciclo de eventos.'
              }
            ],
            common_errors: 'No poner timeout a llamadas de red, provocando que los workers asíncronos queden colgados indefinidamente.',
            mini_exercise: {
              instructions: 'Escribe una función asíncrona execute_tasks(task_list) que use asyncio.gather con return_exceptions=True.',
              starter_code: `import asyncio

async def execute_tasks(tasks: list):
    # Completa la ejecución concurrente
    pass`,
              solution: `import asyncio

async def execute_tasks(tasks: list):
    return await asyncio.gather(*tasks, return_exceptions=True)`
            },
            key_takeaways: [
              'Las APIs y servicios externos requieren timeouts y esquemas estrictos de validación.',
              'asyncio.gather con return_exceptions=True previene que una excepción individual cancele las demás tareas.'
            ],
            exercise: {
              id: 'ex-apex-02',
              type: 'single_choice',
              difficulty: 'hard',
              prompt: '¿Por qué es fundamental usar return_exceptions=True al invocar asyncio.gather en tareas críticas de recolección de datos?',
              options: [
                { id: 'a', text: 'Porque evita que una excepción en una tarea aborte de inmediato las demás operaciones concurrentes.' },
                { id: 'b', text: 'Porque incrementa el ancho de banda del canal de red.' },
                { id: 'c', text: 'Porque convierte los errores de sintaxis en avisos informativos.' },
                { id: 'd', text: 'Porque reemplaza la necesidad de usar bloques try/except en el código síncrono.' }
              ],
              correct_option_id: 'a',
              explanation: 'Por defecto, gather cancela el grupo si una tarea falla; return_exceptions=True devuelve las excepciones como elementos de la lista de resultados para inspección controlada.'
            }
          }
        ]
      },
      {
        id: 'sec-apex-03',
        code: 'APEX-S3',
        title: 'Fase 3: Auditoría, Testing y Despliegue en Producción',
        slug: 'fase-3-auditoria-deploy',
        position: 3,
        type: 'quiz',
        estimated_minutes: 120,
        xp_on_complete: 700,
        lessons: [
          {
            id: 'apex-03',
            code: 'APEX-03',
            title: 'Fase 3: Pruebas Automatizadas, Dockerfile Multi-Stage y Certificación',
            slug: 'fase-3-pruebas-docker-certificacion',
            position: 1,
            concept_id: 'apex-testing-deployment',
            objective: 'Auditar la calidad del código con cobertura de pruebas, empaquetar la solución en contenedores seguros y obtener la certificación Python Specialist.',
            theory_markdown: `La última fase evalúa la madurez ingenieril de la solución.

### 1. Pirámide de Pruebas con Pytest
- **Unitarias:** Pruebas instantáneas de la capa de dominio sin dependencias de red ni bases de datos.
- **Integración:** Pruebas con bases de datos en memoria o fixtures con \`httpx.AsyncClient\`.
- **Regresión y límites:** Pruebas parametrizadas para validar entradas inválidas, tokens expirados y cargas grandes.

### 2. Dockerfile Multi-Stage de Producción
Un contenedor de producción no debe contener compiladores ni herramientas de testing:
\`\`\`dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir poetry
COPY pyproject.toml .
RUN poetry export -f requirements.txt --output requirements.txt

FROM python:3.12-slim AS runner
WORKDIR /app
RUN useradd -m appuser
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
USER appuser
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

### 3. Criterio de Certificación Apex
- Cobertura de pruebas superior al 85%.
- Cumplimiento de PEP 8 y tipos estáticos validados con Mypy / Ruff.
- Arquitectura desacoplada y lista para escalar vertical u horizontalmente.`,
            examples: [
              {
                title: 'Fixture Asíncrono de Pytest para Pruebas E2E',
                code: `import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

@pytest_asyncio.fixture
async def client():
    # Asume que app es tu aplicación ASGI (ej. FastAPI)
    from src.main import app
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac`,
                explanation: 'Permite probar rutas HTTP asíncronas de extremo a extremo sin levantar un servidor socket real.'
              }
            ],
            common_errors: 'Ejecutar contenedores de producción con el usuario root o dejar secretos y tokens hardcodeados en el Dockerfile.',
            mini_exercise: {
              instructions: 'Escribe una directiva de pytest para marcar un test como asíncrono y definir un caso de prueba para una función async que verifique un resultado.',
              starter_code: `import pytest

# Marca la prueba y define test_async_operation
`,
              solution: `import pytest

@pytest.mark.asyncio
async def test_async_operation():
    result = await asyncio.sleep(0.01, result=42)
    assert result == 42`
            },
            key_takeaways: [
              'Las pruebas automatizadas y el tipado estático garantizan la estabilidad del software en el tiempo.',
              'Los contenedores multi-stage y sin privilegios de root protegen el entorno de producción.'
            ],
            exercise: {
              id: 'ex-apex-03',
              type: 'single_choice',
              difficulty: 'hard',
              prompt: '¿Por qué se utiliza una imagen base "multi-stage" en Docker para desplegar aplicaciones de Python en producción?',
              options: [
                { id: 'a', text: 'Para aislar herramientas de compilación y pruebas del artefacto final, reduciendo el tamaño y la superficie de ataque.' },
                { id: 'b', text: 'Para que el código Python se ejecute en múltiples CPUs simultáneamente.' },
                { id: 'c', text: 'Porque Docker no permite instalar librerías con pip en una sola etapa.' },
                { id: 'd', text: 'Para evitar tener que escribir un archivo requirements.txt.' }
              ],
              correct_option_id: 'a',
              explanation: 'Multi-stage builds permiten descartar compiladores y paquetes dev en la imagen de ejecución final, logrando contenedores mínimos, ligeros y más seguros.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'apex-q01',
        type: 'single_choice',
        difficulty: 'hard',
        prompt: 'En una arquitectura limpia en Python, ¿cuál capa NO debe tener ninguna referencia o import a librerías de infraestructura como bases de datos o frameworks web?',
        options: [
          { id: 'a', text: 'La capa de Dominio / Entidades' },
          { id: 'b', text: 'La capa de Controladores' },
          { id: 'c', text: 'La capa de Repositorios' },
          { id: 'd', text: 'El archivo de configuración de Docker' }
        ],
        correct_option_id: 'a',
        explanation: 'El dominio es el núcleo del negocio y debe permanecer agnóstico de frameworks externos.'
      },
      {
        id: 'apex-q02',
        type: 'predict_output',
        difficulty: 'hard',
        prompt: '¿Cuál es el resultado de ejecutar la siguiente rutina asíncrona?',
        prompt_code: `import asyncio

async def compute():
    await asyncio.sleep(0.01)
    return "APEX_CERTIFIED"

async def main():
    res = await asyncio.gather(compute())
    print(res)

asyncio.run(main())`,
        options: [
          { id: 'a', text: "['APEX_CERTIFIED']" },
          { id: 'b', text: "'APEX_CERTIFIED'" },
          { id: 'c', text: 'None' },
          { id: 'd', text: 'Error: compute() must be called with parentheses' }
        ],
        correct_option_id: 'a',
        explanation: 'asyncio.gather empaqueta los resultados de todas las corutinas recibidas en una lista.'
      },
      {
        id: 'apex-q03',
        type: 'find_error',
        difficulty: 'hard',
        prompt: 'Identifica la vulnerabilidad o mala práctica en la siguiente instrucción de Dockerfile de producción:',
        prompt_code: `FROM python:3.12
WORKDIR /root
COPY . .
ENV API_SECRET_KEY="super_secret_production_key_123"
CMD ["python", "server.py"]`,
        options: [
          { id: 'a', text: 'Hardcodear secretos de producción en variables de entorno del Dockerfile y ejecutar como root en /root.' },
          { id: 'b', text: 'El nombre del archivo CMD no puede ser server.py.' },
          { id: 'c', text: 'La imagen FROM no especifica la versión exacta de Linux.' },
          { id: 'd', text: 'WORKDIR debe ser siempre /home.' }
        ],
        correct_option_id: 'a',
        explanation: 'Los secretos nunca deben quedar grabados en las capas del contenedor y las aplicaciones no deben correr como el usuario root.'
      },
      {
        id: 'apex-q04',
        type: 'fill_blank',
        difficulty: 'hard',
        prompt: 'Completa la línea para definir una fixture de pytest que se ejecute de forma asíncrona:',
        prompt_code: `import pytest_asyncio

___
async def db_connection():
    conn = await connect()
    yield conn
    await conn.close()`,
        options: [
          { id: 'a', text: '@pytest_asyncio.fixture' },
          { id: 'b', text: '@pytest.async' },
          { id: 'c', text: '@fixture.asyncio' },
          { id: 'd', text: '@test.fixture' }
        ],
        correct_option_id: 'a',
        explanation: 'pytest_asyncio.fixture es el decorador oficial para fixtures asíncronas con setup y teardown en pytest.'
      },
      {
        id: 'apex-q05',
        type: 'single_choice',
        difficulty: 'hard',
        prompt: '¿Qué herramienta del ecosistema moderno de Python se encarga de analizar tipos estáticos antes de la ejecución para garantizar que se cumplan los contratos de interfaces y protocols?',
        options: [
          { id: 'a', text: 'Mypy / Pyright' },
          { id: 'b', text: 'PyPI' },
          { id: 'c', text: 'Gunicorn' },
          { id: 'd', text: 'Pipenv' }
        ],
        correct_option_id: 'a',
        explanation: 'Mypy y Pyright son los comprobadores estáticos de tipos estándar en Python.'
      }
    ]
  }
];
