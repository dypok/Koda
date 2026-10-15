import type { RawModule } from './types.ts';

const LANG_ID = 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

export const FASTAPI_MODULES: RawModule[] = [
  // M01
  {
    id: 'fa_mod_01',
    language_id: LANG_ID,
    code: 'FA_M01',
    slug: 'fastapi-http-rest',
    title: 'Protocolo HTTP, Arquitectura ASGI y Primera API con FastAPI',
    objective: 'Comprender el ciclo Request/Response de HTTP, la arquitectura ASGI y levantar una API con FastAPI y Uvicorn.',
    description: 'El framework web moderno de Python con tipado estricto, documentación interactiva Swagger y rendimiento ASGI a la par de Node y Go.',
    folder: 'fastapi/01_http_rest',
    course_slug: 'fastapi-async',
    position: 1,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 250 },
    sections: [
      {
        id: 'sec_fa_01_01',
        code: 'S01',
        title: 'Servidores ASGI y Creación de Endpoints',
        slug: 'asgi-endpoints',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_fa_01_01',
            code: 'L01',
            title: '¿Por qué FastAPI? ASGI, Uvicorn y Primer Endpoint',
            slug: 'fastapi-asgi-base',
            position: 1,
            concept_id: 'fa-intro',
            objective: 'Inicializar una aplicación FastAPI y servir endpoints HTTP con el servidor asíncrono Uvicorn.',
            theory_markdown: `Tradicionalmente, Python usaba **WSGI** (como en Django o Flask clásicos), que procesaba una petición por hilo de forma sincrónica.\n\n**FastAPI** está construido sobre **ASGI** (Asynchronous Server Gateway Interface) y la librería **Starlette**, permitiendo manejar miles de conexiones WebSocket y HTTP concurrentes mediante el Event Loop de Python.\n\nPara ejecutar la app en desarrollo usamos **Uvicorn**:\n\`uvicorn main:app --reload\`.`,
            examples: [
              {
                title: 'Tu primera API REST asíncrona',
                code: 'from fastapi import FastAPI\n\napp = FastAPI(title="Koda API", version="1.0.0")\n\n@app.get("/")\nasync def root():\n    return {"status": "online", "mensaje": "Bienvenido a FastAPI"}\n\n@app.get("/salud")\ndef health_check():\n    return {"ok": True, "servicios": "operativos"}',
                output: '{"status": "online", "mensaje": "Bienvenido a FastAPI"}',
                explanation: 'FastAPI serializa automáticamente los diccionarios de Python a JSON con las cabeceras HTTP correctas.'
              }
            ],
            common_errors: 'Olvidar el parámetro `--reload` en uvicorn durante el desarrollo, teniendo que reiniciar el servidor manualmente en cada cambio.',
            mini_exercise: {
              starter_code: 'from fastapi import FastAPI\napp = FastAPI()\n\n# Define un endpoint GET en "/ping" que retorne {"pong": True}\n@app.get("/ping")\ndef ping():\n    return ...',
              instructions: 'Retorna {"pong": True}.',
              solution: 'from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/ping")\ndef ping():\n    return {"pong": True}'
            },
            key_takeaways: [
              'FastAPI genera documentación interactiva automática en /docs (Swagger UI).',
              'ASGI permite concurrencia masiva nativa.',
              'Los endpoints pueden ser def síncronos o async def no bloqueantes.'
            ],
            exercise: {
              id: 'ex_fa_01_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿En qué ruta genera FastAPI automáticamente la documentación interactiva Swagger?',
              options: [
                { id: 'a', text: '/docs' },
                { id: 'b', text: '/swagger.html' },
                { id: 'c', text: '/api/v1/help' },
                { id: 'd', text: '/readme' }
              ],
              correct_option_id: 'a',
              explanation: 'FastAPI expone la interfaz interactiva de Swagger UI en /docs y ReDoc en /redoc por defecto.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_fa_01_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Qué es Uvicorn en el ecosistema de FastAPI?',
        options: [
          { id: 'a', text: 'Un servidor web ASGI de alto rendimiento para ejecutar aplicaciones asíncronas de Python' },
          { id: 'b', text: 'Un motor de base de datos relacional' },
          { id: 'c', text: 'Un formateador de código similar a Black' },
          { id: 'd', text: 'Un plugin de VS Code' }
        ],
        correct_option_id: 'a',
        explanation: 'Uvicorn es el servidor HTTP ASGI basado en uvloop que ejecuta las aplicaciones FastAPI.'
      }
    ]
  },

  // M02
  {
    id: 'fa_mod_02',
    language_id: LANG_ID,
    code: 'FA_M02',
    slug: 'fastapi-pydantic',
    title: 'Modelado, Validación y Serialización con Pydantic v2',
    objective: 'Validar payloads JSON entrantes con BaseModel, Field, tipos de datos estrictos y contratos response_model.',
    description: 'Garantiza que ningún dato corrupto ingrese a tu sistema: validación en tiempo de compilación/ejecución con Pydantic Core.',
    folder: 'fastapi/02_pydantic',
    course_slug: 'fastapi-async',
    position: 2,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 280 },
    sections: [
      {
        id: 'sec_fa_02_01',
        code: 'S01',
        title: 'Esquemas Pydantic y Reglas de Validación',
        slug: 'pydantic-schemas',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_fa_02_01',
            code: 'L01',
            title: 'BaseModel, Field y Validación Automática de Pydantic v2',
            slug: 'pydantic-base',
            position: 1,
            concept_id: 'fa-pydantic',
            objective: 'Declarar contratos de datos que validen tipos, longitudes y rangos numéricos automáticamente.',
            theory_markdown: `En FastAPI, los modelos de datos se definen heredando de \`pydantic.BaseModel\`.\n\nCuando un cliente envía una petición POST:\n1. FastAPI lee el cuerpo JSON.\n2. Lo pasa por el esquema Pydantic.\n3. Si algún campo tiene un tipo incorrecto o falta un campo requerido, FastAPI responde automáticamente con un **HTTP 422 Unprocessable Entity** detallando exactamente qué campo falló, sin que tengas que escribir un solo \`if\` de validación manual.`,
            examples: [
              {
                title: 'Esquema de creación de producto con validaciones',
                code: 'from fastapi import FastAPI\nfrom pydantic import BaseModel, Field, EmailStr\n\nclass UsuarioRegistro(BaseModel):\n    username: str = Field(min_length=3, max_length=20)\n    edad: int = Field(ge=18, le=120, description="Mayor de edad")\n    activo: bool = True\n\napp = FastAPI()\n\n@app.post("/usuarios", status_code=201)\ndef crear_usuario(payload: UsuarioRegistro):\n    # payload es una instancia validada de UsuarioRegistro\n    return {"mensaje": f"Usuario {payload.username} creado", "edad": payload.edad}',
                output: 'HTTP 201 Created\n{"mensaje": "Usuario koda_dev creado", "edad": 25}',
                explanation: 'Si el cliente envía edad: 16, Pydantic rechaza la petición con HTTP 422 automáticamente.'
              }
            ],
            common_errors: 'No tipar los argumentos del endpoint con el esquema BaseModel, lo que hace que FastAPI los interprete como query parameters en lugar de JSON body.',
            mini_exercise: {
              starter_code: 'from pydantic import BaseModel\n# Crea un modelo Item con titulo: str y precio: float\nclass Item(BaseModel):\n    ...\n\ni = Item(titulo="Teclado", precio=89.99)\nprint(i.titulo)',
              instructions: 'Declara Item(BaseModel) con titulo y precio.',
              solution: 'from pydantic import BaseModel\nclass Item(BaseModel):\n    titulo: str\n    precio: float\n\ni = Item(titulo="Teclado", precio=89.99)\nprint(i.titulo)'
            },
            key_takeaways: [
              'Pydantic v2 está escrito en Rust y valida a máxima velocidad.',
              'Field(ge=..., min_length=...) añade restricciones semánticas.',
              'FastAPI genera HTTP 422 con errores detallados ante entradas no válidas.'
            ],
            exercise: {
              id: 'ex_fa_02_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué código de estado HTTP devuelve FastAPI automáticamente si un cliente envía un JSON que no cumple con el esquema Pydantic?',
              options: [
                { id: 'a', text: '422 Unprocessable Entity' },
                { id: 'b', text: '500 Internal Server Error' },
                { id: 'c', text: '404 Not Found' },
                { id: 'd', text: '200 OK con mensaje de error' }
              ],
              correct_option_id: 'a',
              explanation: 'FastAPI sigue los estándares de la Web retornando 422 Unprocessable Entity con la lista exacta de campos erróneos.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_fa_02_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Para qué sirve el parámetro response_model en un decorador de FastAPI (ej: @app.get(..., response_model=UsuarioPublico))?',
        options: [
          { id: 'a', text: 'Filtra y restringe los datos enviados al cliente, protegiendo campos confidenciales como contraseñas' },
          { id: 'b', text: 'Para conectarse a la base de datos' },
          { id: 'c', text: 'Para redirigir la página' },
          { id: 'd', text: 'Es un parámetro decorativo sin efecto' }
        ],
        correct_option_id: 'a',
        explanation: 'response_model garantiza que solo los campos definidos en ese modelo público salgan al cliente, previniendo fugas de contraseñas o datos sensibles.'
      }
    ]
  },

  // M03
  {
    id: 'fa_mod_03',
    language_id: LANG_ID,
    code: 'FA_M03',
    slug: 'fastapi-sqlalchemy-alembic',
    title: 'Bases de Datos con SQLAlchemy 2.0 y Migraciones con Alembic',
    objective: 'Diseñar modelos relacionales con SQLAlchemy 2.0 async, gestionar sesiones con Depends y versionar el esquema con Alembic.',
    description: 'Persistencia profesional en bases de datos PostgreSQL o SQLite mediante el ORM más potente de Python.',
    folder: 'fastapi/03_sqlalchemy',
    course_slug: 'fastapi-async',
    position: 3,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 300 },
    sections: [
      {
        id: 'sec_fa_03_01',
        code: 'S01',
        title: 'Modelos Declarativos y Sesiones Asíncronas',
        slug: 'sqlalchemy-sesiones',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_fa_03_01',
            code: 'L01',
            title: 'SQLAlchemy 2.0 DeclarativeBase y Sesión de Base de Datos',
            slug: 'sqlalchemy-base',
            position: 1,
            concept_id: 'fa-orm',
            objective: 'Crear tablas mapeadas con Mapped y mapped_column, y gestionar el ciclo de vida de la sesión con generadores.',
            theory_markdown: `**SQLAlchemy 2.0** unifica el tipado moderno de Python con consultas SQL declarativas seguras contra inyección SQL.\n\n- \`DeclarativeBase\`: Clase base de la que heredan todos tus modelos.\n- \`Mapped[int]\` y \`mapped_column(primary_key=True)\`: Declaran columnas tipadas.\n- Para versionar cambios en las tablas (agregar columnas, crear índices) sin borrar los datos existentes, usamos **Alembic** (\`alembic revision --autogenerate -m "crear tabla usuarios"\` y \`alembic upgrade head\`).`,
            examples: [
              {
                title: 'Modelo de usuario con SQLAlchemy 2.0',
                code: 'from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column\nfrom sqlalchemy import String\n\nclass Base(DeclarativeBase):\n    pass\n\nclass UsuarioDB(Base):\n    __tablename__ = "usuarios"\n    \n    id: Mapped[int] = mapped_column(primary_key=True, index=True)\n    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)\n    activo: Mapped[bool] = mapped_column(default=True)',
                output: 'Modelo UsuarioDB listo para Alembic',
                explanation: 'Mapped y mapped_column integran el tipado de Python con las restricciones de la base de datos.'
              }
            ],
            common_errors: 'No cerrar las sesiones de base de datos después de procesar una petición HTTP, provocando saturación del pool de conexiones (connection leak).',
            mini_exercise: {
              starter_code: '# Inyección de sesión típica en FastAPI\n# def get_db():\n#     db = SessionLocal()\n#     try:\n#         yield db\n#     finally:\n#         db.close()',
              instructions: 'Observa cómo el bloque try/finally garantiza el cierre de la conexión.',
              solution: '# try/finally garantiza db.close()'
            },
            key_takeaways: [
              'SQLAlchemy 2.0 usa Mapped[...] para tipado estricto.',
              'Alembic rastrea y aplica migraciones de esquema en la base de datos.',
              'Las sesiones deben cerrarse siempre al finalizar la petición.'
            ],
            exercise: {
              id: 'ex_fa_03_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Cuál es la función principal de Alembic en un proyecto FastAPI con SQLAlchemy?',
              options: [
                { id: 'a', text: 'Gestionar migraciones y versionar los cambios estructurales de la base de datos' },
                { id: 'b', text: 'Comprimir imágenes' },
                { id: 'c', text: 'Servir archivos HTML' },
                { id: 'd', text: 'Autenticar usuarios con Google' }
              ],
              correct_option_id: 'a',
              explanation: 'Alembic es la herramienta oficial de migraciones de SQLAlchemy, permitiendo evolucionar esquemas de BD sin pérdida de información.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_fa_03_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué comando de Alembic aplica todas las migraciones pendientes hacia la última versión?',
        options: [
          { id: 'a', text: 'alembic upgrade head' },
          { id: 'b', text: 'alembic run latest' },
          { id: 'c', text: 'alembic migrate --all' },
          { id: 'd', text: 'alembic push' }
        ],
        correct_option_id: 'a',
        explanation: 'alembic upgrade head actualiza la base de datos hasta la revisión más reciente (head).'
      }
    ]
  },

  // M04
  {
    id: 'fa_mod_04',
    language_id: LANG_ID,
    code: 'FA_M04',
    slug: 'fastapi-auth-jwt',
    title: 'Autenticación con JWT, Hashing y Dependencias (Depends)',
    objective: 'Proteger endpoints con JSON Web Tokens (JWT), hashear contraseñas con bcrypt e inyectar usuarios autenticados con Depends.',
    description: 'Seguridad de grado bancario para tu API: autenticación sin estado (stateless), expiración de tokens y control de acceso.',
    folder: 'fastapi/04_auth_jwt',
    course_slug: 'fastapi-async',
    position: 4,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 320 },
    sections: [
      {
        id: 'sec_fa_04_01',
        code: 'S01',
        title: 'Tokens JWT y Rutas Protegidas',
        slug: 'jwt-y-rutas',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_fa_04_01',
            code: 'L01',
            title: 'Flujo OAuth2 con JWT y Dependency Injection',
            slug: 'jwt-depends-base',
            position: 1,
            concept_id: 'fa-auth',
            objective: 'Implementar el login que emite JWT y proteger rutas mediante Depends(obtener_usuario_actual).',
            theory_markdown: `El estándar de la industria para autenticar APIs REST es **JWT (JSON Web Token)**:\n1. El cliente envía usuario y contraseña a \`/login\`.\n2. El servidor valida el hash con \`bcrypt\` y emite un token firmado criptográficamente con una clave secreta (\`SECRET_KEY\`) y fecha de expiración.\n3. El cliente incluye el token en la cabecera \`Authorization: Bearer <token>\` en cada solicitud subsiguiente.\n\nEn FastAPI, el sistema de **inyección de dependencias (\`Depends\`)** intercepta el token, lo valida y entrega el objeto de usuario directamente al endpoint.`,
            examples: [
              {
                title: 'Protección de endpoint con Depends',
                code: 'from fastapi import FastAPI, Depends, HTTPException, status\n\napp = FastAPI()\n\ndef get_usuario_actual(token: str = "token_simulado"):\n    if token != "token_valido_123":\n        raise HTTPException(\n            status_code=status.HTTP_401_UNAUTHORIZED,\n            detail="Token inválido o expirado"\n        )\n    return {"id": 1, "username": "koda_specialist"}\n\n@app.get("/perfil")\ndef ver_perfil(usuario = Depends(get_usuario_actual)):\n    return {"mensaje": "Acceso autorizado", "usuario": usuario}',
                output: 'HTTP 200 OK\n{"mensaje": "Acceso autorizado", "usuario": {"id": 1, "username": "koda_specialist"}}',
                explanation: 'Cualquier endpoint que requiera usuario autenticado solo añade usuario = Depends(...).'
              }
            ],
            common_errors: 'Guardar contraseñas en texto plano en la base de datos (grave vulnerabilidad). Siempre deben almacenarse con un algoritmo de derivación de claves con sal (salt) como bcrypt/argon2.',
            mini_exercise: {
              starter_code: '# Verifica si una contraseña coincide con el hash\n# bcrypt.checkpw(password.encode(), hash_guardado.encode())',
              instructions: 'Recuerda que las contraseñas nunca se desencriptan; se compara el hash de entrada contra el hash almacenado.',
              solution: '# contraseñas siempre con hash'
            },
            key_takeaways: [
              'JWT es stateless: el servidor no necesita guardar sesiones en memoria.',
              'Depends reutiliza la lógica de autenticación en cualquier endpoint.',
              'HTTP 401 Unauthorized es el código estándar ante credenciales inválidas.'
            ],
            exercise: {
              id: 'ex_fa_04_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué cabecera HTTP estándar se utiliza para enviar un token JWT al servidor en cada petición?',
              options: [
                { id: 'a', text: 'Authorization: Bearer <token>' },
                { id: 'b', text: 'X-Token-Password' },
                { id: 'c', text: 'User-Token: True' },
                { id: 'd', text: 'Cookie-Secret' }
              ],
              correct_option_id: 'a',
              explanation: 'El esquema estándar RFC 6750 estipula la cabecera Authorization con el prefijo Bearer.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_fa_04_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué información NUNCA debe incluirse en el payload de un token JWT?',
        options: [
          { id: 'a', text: 'Contraseñas en texto plano o datos confidenciales no encriptados' },
          { id: 'b', text: 'El ID del usuario (sub)' },
          { id: 'c', text: 'La fecha de expiración (exp)' },
          { id: 'd', text: 'El nombre de usuario' }
        ],
        correct_option_id: 'a',
        explanation: 'El payload de un JWT solo está codificado en Base64 (cualquiera puede leerlo decodificándolo), por lo que nunca debe contener secretos.'
      }
    ]
  },

  // M05
  {
    id: 'fa_mod_05',
    language_id: LANG_ID,
    code: 'FA_M05',
    slug: 'fastapi-docker-deploy',
    title: 'Testing con TestClient, Dockerización y Despliegue',
    objective: 'Testear endpoints HTTP con TestClient de pytest, construir imágenes Docker optimizadas multi-stage y desplegar la API en producción.',
    description: 'Empaqueta y distribuye tu microservicio: pruebas automatizadas de integración, contenedores Docker ligeros y variables de entorno.',
    folder: 'fastapi/05_docker_deploy',
    course_slug: 'fastapi-async',
    position: 5,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 400 },
    sections: [
      {
        id: 'sec_fa_05_01',
        code: 'S01',
        title: 'Pruebas de Integración y Docker Multi-Stage',
        slug: 'testing-docker',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_fa_05_01',
            code: 'L01',
            title: 'TestClient de FastAPI y Dockerfile de Producción',
            slug: 'testclient-docker-base',
            position: 1,
            concept_id: 'fa-deploy',
            objective: 'Escribir pruebas end-to-end con TestClient y compilar un Dockerfile seguro y ligero.',
            theory_markdown: `FastAPI incluye un cliente de pruebas de primera clase basado en \`httpx\`: **TestClient**.\n\nPermite simular peticiones HTTP completas a tus endpoints dentro de \`pytest\` sin tener que levantar un servidor en un puerto real.\n\nPara el despliegue en producción, empaquetamos la API en un contenedor **Docker** usando una imagen base ligera como \`python:3.12-slim\`.`,
            examples: [
              {
                title: 'Test unitario de endpoint con TestClient',
                code: 'from fastapi.testclient import TestClient\nfrom fastapi import FastAPI\n\napp = FastAPI()\n@app.get("/items/{item_id}")\ndef leer_item(item_id: int):\n    return {"id": item_id, "nombre": "Widget"}\n\nclient = TestClient(app)\n\ndef test_leer_item():\n    response = client.get("/items/42")\n    assert response.status_code == 200\n    assert response.json() == {"id": 42, "nombre": "Widget"}',
                output: 'PASSED test_leer_item',
                explanation: 'TestClient ejecuta la pila de FastAPI completa de forma síncrona y transparente para pytest.'
              }
            ],
            common_errors: 'Ejecutar el contenedor Docker como usuario root en producción. Es una buena práctica de seguridad crear un usuario sin privilegios en el Dockerfile.',
            mini_exercise: {
              starter_code: '# Dockerfile simplificado\n# FROM python:3.12-slim\n# WORKDIR /app\n# COPY requirements.txt .\n# RUN pip install --no-cache-dir -r requirements.txt\n# COPY . .\n# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]',
              instructions: 'Revisa la estructura de un contenedor FastAPI estándar.',
              solution: '# Dockerfile listo'
            },
            key_takeaways: [
              'TestClient simula peticiones HTTP directamente en memoria.',
              'python:3.12-slim genera imágenes Docker de menos de 150MB.',
              'Gunicorn con workers Uvicorn escala la API a múltiples núcleos.'
            ],
            exercise: {
              id: 'ex_fa_05_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Por qué TestClient de FastAPI es preferible frente a hacer requests reales en las pruebas automatizadas?',
              options: [
                { id: 'a', text: 'Porque no requiere abrir un puerto de red real y se ejecuta de forma inmediata en memoria' },
                { id: 'b', text: 'Porque solo funciona con bases de datos Oracle' },
                { id: 'c', text: 'Porque no requiere tener Python instalado' },
                { id: 'd', text: 'Porque desactiva la seguridad' }
              ],
              correct_option_id: 'a',
              explanation: 'TestClient invoca la aplicación directamente a través de la interfaz ASGI en memoria, haciendo las pruebas ultra veloces y aisladas.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_fa_05_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: 'En un contenedor Docker para producción, ¿por qué es fundamental enlazar Uvicorn a la dirección 0.0.0.0 en lugar de 127.0.0.1 (localhost)?',
        options: [
          { id: 'a', text: 'Para que el servidor acepte tráfico proveniente desde fuera del contenedor (a través del puerto expuesto de Docker)' },
          { id: 'b', text: 'Porque 127.0.0.1 está prohibido en Linux' },
          { id: 'c', text: 'Para encriptar las conexiones' },
          { id: 'd', text: 'No hace ninguna diferencia' }
        ],
        correct_option_id: 'a',
        explanation: '127.0.0.1 solo escucha peticiones dentro del contenedor mismo. 0.0.0.0 permite que el host y balanceadores de carga alcancen el servicio.'
      }
    ]
  }
];
