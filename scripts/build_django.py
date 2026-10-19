# -*- coding: utf-8 -*-
"""
Script to generate all 5 Django modules and bank.json files with 4 lessons and 6 calibrated questions each.
Enforces zero emojis, zero spoilers, and strict schema compliance.
"""

import json
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", "languages", "python", "modules", "django"))

MODULES = [
    {
        "dir": "01_mtv_routing",
        "module_json": {
            "id": "dj_mod_01",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DJ_M01",
            "slug": "django-mtv-routing",
            "course_slug": "django-enterprise",
            "title": "Arquitectura MTV, Settings y Routing en Django",
            "objective": "Comprender la filosofia 'baterias incluidas' de Django, la arquitectura Modelo-Template-Vista (MTV) y configurar el enrutamiento.",
            "description": "El framework web empresarial por excelencia: crea proyectos robustos, desacoplados en apps modulares con configuracion segura.",
            "position": 36,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_dj_01_01",
                    "code": "S01",
                    "title": "Arquitectura, Configuracion y Enrutamiento en Django",
                    "slug": "arquitectura-mtv-enrutamiento",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 45,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_dj_01_01",
                            "code": "L01",
                            "title": "Filosofia Batteries Included y Arquitectura MTV",
                            "slug": "filosofia-mtv-apps",
                            "position": 1,
                            "concept_id": "dj-intro-mtv",
                            "objective": "Comprender la filosofia de Django, la diferencia entre Proyecto y Apps modulares, y el ciclo MTV.",
                            "theory_markdown": "Django adopta la filosofia **'batteries included'** (baterias incluidas): proporciona de forma nativa autenticacion de usuarios, panel de administracion, proteccion de seguridad (CSRF, XSS, Clickjacking) y un potente ORM relacional.\n\n### Estructura: Proyecto vs Aplicaciones (Apps)\n- **Proyecto:** Es la instancia global de configuracion (`settings.py`, `urls.py` raiz, `wsgi.py`/`asgi.py`). Se crea con `django-admin startproject mi_proyecto`.\n- **Aplicacion (App):** Es un paquete de Python autocontenido y reutilizable enfocado en un dominio especifico (por ejemplo `usuarios`, `blog`, `pagos`). Se crea con `python manage.py startapp mi_app`.\n\n### Arquitectura MTV (Model - Template - View)\n- **Model (Modelo):** Capa de acceso y reglas de negocio sobre la base de datos a traves del ORM.\n- **Template (Plantilla):** Capa de presentacion que genera la interfaz grafica (HTML con DTL).\n- **View (Vista):** Capa logica intermediaria que recibe el `HttpRequest`, consulta los Modelos y entrega la respuesta mediante un `HttpResponse` o template renderizado.",
                            "examples": [
                                {
                                    "title": "Estructura basica de una vista en Django",
                                    "code": "from django.http import HttpResponse, HttpRequest\n\ndef inicio(request: HttpRequest) -> HttpResponse:\n    return HttpResponse(\"Bienvenido a Koda Academy sobre Django\")",
                                    "output": "Peticion GET / -> HTTP 200 con cuerpo de texto plano.",
                                    "explanation": "Toda vista en Django debe recibir una instancia de HttpRequest como primer argumento y retornar un HttpResponse valido."
                                }
                            ],
                            "common_errors": "Crear una nueva aplicacion con startapp y olvidar agregarla a la lista INSTALLED_APPS en settings.py, impidiendo que Django reconozca sus modelos o rutas.",
                            "mini_exercise": {
                                "instructions": "Escribe una vista en Django llamada 'saludo' que reciba 'request' y retorne un HttpResponse con el texto 'Hola Django'.",
                                "starter_code": "from django.http import HttpResponse\n\n# Define la vista saludo\n",
                                "solution": "from django.http import HttpResponse\n\ndef saludo(request):\n    return HttpResponse(\"Hola Django\")"
                            },
                            "key_takeaways": [
                                "Django incluye herramientas de administracion, autenticacion y ORM integradas.",
                                "Un proyecto coordina configuraciones globales; las apps agrupan logica de dominio reutilizable.",
                                "MTV mapea Modelo (datos), Template (presentacion) y Vista (logica de negocio)."
                            ],
                            "exercise": {
                                "id": "ex_dj_01_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la relacion fundamental entre un Proyecto Django y sus Aplicaciones (Apps)?",
                                "options": [
                                    {"id": "a", "text": "Un proyecto es la configuracion global que coordina una o mas aplicaciones modulares e independientes."},
                                    {"id": "b", "text": "Un proyecto solo puede tener exactamente una unica aplicacion."},
                                    {"id": "c", "text": "Las aplicaciones contienen el servidor web y el proyecto almacena la base de datos SQLite."},
                                    {"id": "d", "text": "Son sinonimos exactos generados con el comando manage.py."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "En Django, el proyecto es el contenedor de configuracion que integra diversas aplicaciones modulares y reutilizables."
                            }
                        },
                        {
                            "id": "les_dj_01_02",
                            "code": "L02",
                            "title": "Configuracion de settings.py y Variables de Entorno",
                            "slug": "settings-variables-entorno",
                            "position": 2,
                            "concept_id": "dj-settings-config",
                            "objective": "Aprender el proposito de las configuraciones criticas en settings.py y gestionar credenciales de forma segura.",
                            "theory_markdown": "El archivo `settings.py` contiene todas las variables de configuracion del proyecto Django:\n\n- `SECRET_KEY`: Cadena criptografica utilizada para firmar cookies de sesion, tokens CSRF y contraseñas. Nunca debe versionarse en Git.\n- `DEBUG`: Booleano que activa paginas de traza detalladas de error en desarrollo. **Debe ser False en produccion** para evitar fugas de informacion.\n- `ALLOWED_HOSTS`: Lista de nombres de dominio o direcciones IP autorizadas para servir la aplicacion cuando `DEBUG = False`.\n- `INSTALLED_APPS`: Lista de aplicaciones habilitadas en el proyecto (tanto modulos integrados de Django como apps propias y de terceros).\n- `DATABASES`: Diccionario de configuracion para conectar motores relacionales (SQLite por defecto, PostgreSQL, MySQL en produccion).",
                            "examples": [
                                {
                                    "title": "Registro de app y configuracion de ALLOWED_HOSTS",
                                    "code": "# settings.py\nDEBUG = False\nALLOWED_HOSTS = [\"koda.academy\", \"www.koda.academy\", \"127.0.0.1\"]\n\nINSTALLED_APPS = [\n    \"django.contrib.admin\",\n    \"django.contrib.auth\",\n    \"django.contrib.contenttypes\",\n    \"django.contrib.sessions\",\n    \"django.contrib.messages\",\n    \"django.contrib.staticfiles\",\n    # Apps locales del proyecto:\n    \"cursos\",\n    \"estudiantes\",\n]",
                                    "output": "Django inicia de forma segura admitiendo solicitudes solo desde los hosts autorizados.",
                                    "explanation": "ALLOWED_HOSTS previene ataques de envenenamiento de cabecera HTTP Host (HTTP Host Header attacks)."
                                }
                            ],
                            "common_errors": "Publicar el archivo settings.py en GitHub con la clave SECRET_KEY hardcodeada y DEBUG = True.",
                            "mini_exercise": {
                                "instructions": "Registra una app llamada 'inventario' en la lista INSTALLED_APPS.",
                                "starter_code": "INSTALLED_APPS = [\n    \"django.contrib.auth\",\n    # Agrega inventario\n]",
                                "solution": "INSTALLED_APPS = [\n    \"django.contrib.auth\",\n    \"inventario\",\n]"
                            },
                            "key_takeaways": [
                                "SECRET_KEY debe mantenerse secreta y cargarse mediante variables de entorno.",
                                "DEBUG = False es obligatorio en produccion para no exponer trazas internas.",
                                "ALLOWED_HOSTS define que dominios pueden acceder a la aplicacion."
                            ],
                            "exercise": {
                                "id": "ex_dj_01_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que consecuencia de seguridad se produce si se deja DEBUG = True en un servidor Django en produccion?",
                                "options": [
                                    {"id": "a", "text": "Cualquier excepcion no controlada expondra al usuario variables de entorno, configuraciones internas, fragmentos de codigo y la SECRET_KEY."},
                                    {"id": "b", "text": "La base de datos se borra automaticamente cada 24 horas."},
                                    {"id": "c", "text": "Django no permitira el inicio de sesion de ningun usuario administrador."},
                                    {"id": "d", "text": "El servidor rechaza todas las conexiones HTTPS entrantes."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Las paginas de error de depuracion de Django muestran la traza de ejecucion, configuraciones y variables locales de las funciones, lo cual es critico en produccion."
                            }
                        },
                        {
                            "id": "les_dj_01_03",
                            "code": "L03",
                            "title": "Enrutamiento URL con path() e include()",
                            "slug": "enrutamiento-url-path-include",
                            "position": 3,
                            "concept_id": "dj-routing-urls",
                            "objective": "Disenar estructuras de URL jerarquicas mediante path(), convertidores de ruta e include().",
                            "theory_markdown": "El archivo `urls.py` mapea rutas solicitadas por el cliente a las funciones o clases de vista correspondientes.\n\n### Sintaxis de path()\n```python\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path(\"articulos/\", views.lista_articulos, name=\"articulos-lista\"),\n    path(\"articulos/<int:pk>/\", views.detalle_articulo, name=\"articulo-detalle\"),\n    path(\"usuarios/<str:username>/\", views.perfil_usuario, name=\"usuario-perfil\"),\n]\n```\nLos **convertidores de ruta** (`<int:pk>`, `<str:slug>`, `<uuid:id>`) validan el patron y pasan el valor con su tipo nativo como argumento a la vista.\n\n### Enrutamiento modular con include()\nPara evitar centralizar cientos de URLs en el archivo raiz del proyecto, se delega el enrutamiento a cada aplicacion:\n```python\n# urls.py raiz del proyecto\nfrom django.urls import path, include\n\nurlpatterns = [\n    path(\"cursos/\", include(\"cursos.urls\")),\n]\n```",
                            "examples": [
                                {
                                    "title": "Resolucion inversa de URLs con reverse",
                                    "code": "from django.urls import reverse\n\n# En codigo Python o pruebas:\nurl = reverse(\"articulo-detalle\", kwargs={\"pk\": 42})\nprint(url)",
                                    "output": "/articulos/42/",
                                    "explanation": "reverse busca la URL usando el parametro 'name', desacoplando el codigo de rutas hardcodeadas."
                                }
                            ],
                            "common_errors": "Omitir la barra diagonal al final de las rutas ('articulos' en vez de 'articulos/'), lo que puede romper el mecanismo de redireccion automatica APPEND_SLASH de Django.",
                            "mini_exercise": {
                                "instructions": "Escribe una entrada path que capture un parametro entero 'id' en la ruta 'detalle/<int:id>/' asignado a views.detalle.",
                                "starter_code": "from django.urls import path\nfrom . import views\n\n# Define la ruta\nurlpatterns = [\n    ...\n]",
                                "solution": "from django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path(\"detalle/<int:id>/\", views.detalle, name=\"detalle\"),\n]"
                            },
                            "key_takeaways": [
                                "path() mapea patrones de URL a funciones o clases de vista.",
                                "Los convertidores como <int:pk> y <str:slug> tipan los parametros capturados.",
                                "include() permite delegar y modularizar las rutas en cada app.",
                                "El parametro 'name' permite la resolucion inversa de URLs mediante reverse()."
                            ],
                            "exercise": {
                                "id": "ex_dj_01_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es la funcion principal del argumento name='...' en una definicion de path() de Django?",
                                "options": [
                                    {"id": "a", "text": "Permite realizar resolucion inversa de URLs (mediante reverse() o {% url %}), desacoplando el codigo de paths hardcodeados."},
                                    {"id": "b", "text": "Fija el titulo de la pestana en el navegador del cliente."},
                                    {"id": "c", "text": "Es el nombre de la tabla SQL donde se guardara la ruta."},
                                    {"id": "d", "text": "Especifica el nombre del metodo HTTP permitido (GET, POST)."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "name le otorga un identificador unico a la ruta para referenciarla dinamicamente en templates y vistas sin depender de strings fijos."
                            }
                        },
                        {
                            "id": "les_dj_01_04",
                            "code": "L04",
                            "title": "Vistas Basadas en Funciones y en Clases (FBV vs CBV)",
                            "slug": "vistas-fbv-cbv-render",
                            "position": 4,
                            "concept_id": "dj-views-fbv-cbv",
                            "objective": "Comparar vistas basadas en funciones con vistas genericas basadas en clases y renderizar respuestas.",
                            "theory_markdown": "Django ofrece dos paradigmas para construir vistas:\n\n1. **Function-Based Views (FBV):**\n   Funciones explicitas que reciben `request` y controlan manualmente el flujo con sentencias condicionales `if request.method == 'POST'`.\n   - Ideales para logica simple o muy personalizada.\n   - Se utiliza la funcion auxiliar `render(request, 'template.html', contexto)` o `JsonResponse(datos)`.\n\n2. **Class-Based Views (CBV):**\n   Clases que heredan de vistas genericas de Django (`View`, `TemplateView`, `ListView`, `DetailView`, `CreateView`).\n   - Promueven la reutilizacion mediante herencia orientada a objetos.\n   - Separan los verbos HTTP en metodos especificos (`def get()`, `def post()`).\n   - Para registrarlas en `urls.py` se invoca el metodo de clase `.as_view()`: `path('lista/', MiVista.as_view())`.",
                            "examples": [
                                {
                                    "title": "Comparacion practica entre FBV y CBV",
                                    "code": "from django.shortcuts import render\nfrom django.views import View\nfrom django.http import HttpResponse\n\n# 1. FBV:\ndef vista_funcion(request):\n    return render(request, \"inicio.html\", {\"titulo\": \"Koda\"})\n\n# 2. CBV:\nclass VistaClase(View):\n    def get(self, request):\n        return HttpResponse(\"Respuesta desde metodo GET de CBV\")",
                                    "output": "Ambas procesan solicitudes HTTP pero organizan el codigo bajo paradigmas distintos.",
                                    "explanation": "as_view() convierte la clase en una funcion de vista ejecutable por el enrutador de Django."
                                }
                            ],
                            "common_errors": "Registrar una Class-Based View en urls.py directamente como `path('ruta/', MiVista)` sin invocar `.as_view()`, provocando un TypeError.",
                            "mini_exercise": {
                                "instructions": "Escribe una vista basada en clase llamada 'AcercaDe' que herede de View e implemente el metodo get retornando HttpResponse('Acerca de').",
                                "starter_code": "from django.views import View\nfrom django.http import HttpResponse\n\n# Define la clase AcercaDe\n",
                                "solution": "from django.views import View\nfrom django.http import HttpResponse\n\nclass AcercaDe(View):\n    def get(self, request):\n        return HttpResponse(\"Acerca de\")"
                            },
                            "key_takeaways": [
                                "render(request, template, context) es el helper estandar para compilar plantillas HTML.",
                                "Las FBV son directas y lineales; las CBV aprovechan la herencia y polimorfismo de POO.",
                                "Toda CBV debe registrarse en urls.py mediante el metodo .as_view()."
                            ],
                            "exercise": {
                                "id": "ex_dj_01_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Como debe registrarse una vista basada en clase llamada 'CatalogoView' en la lista urlpatterns de urls.py?",
                                "options": [
                                    {"id": "a", "text": "path('catalogo/', CatalogoView.as_view(), name='catalogo')"},
                                    {"id": "b", "text": "path('catalogo/', CatalogoView(), name='catalogo')"},
                                    {"id": "c", "text": "path('catalogo/', CatalogoView.render(), name='catalogo')"},
                                    {"id": "d", "text": "path('catalogo/', CatalogoView, name='catalogo')"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El metodo de clase .as_view() instancia la vista por peticion y despacha la solicitud al metodo adecuado (get, post, etc.)."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DJ_M01",
            "module_slug": "django-mtv-routing",
            "course_slug": "django-enterprise",
            "questions": [
                {
                    "id": "q_dj_01_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que significa el patron arquitectonico MTV en el que se basa Django?",
                    "options": [
                        {"id": "a", "text": "Model (capa de datos/ORM), Template (capa de presentacion visual) y View (capa logica de control y respuesta)."},
                        {"id": "b", "text": "Memory, Threading y Virtualization."},
                        {"id": "c", "text": "Multiple Table Verification."},
                        {"id": "d", "text": "Module, Test y Versioning."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Django utiliza MTV como su interpretacion del clasico MVC: el Model gestiona datos, el Template la interfaz y la View orquesta la logica de peticion/respuesta."
                },
                {
                    "id": "q_dj_01_02",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que comando de consola se ejecuta para inicializar una nueva aplicacion modular dentro de un proyecto Django existente?",
                    "options": [
                        {"id": "a", "text": "python manage.py startapp nombre_app"},
                        {"id": "b", "text": "django-admin createproject nombre_app"},
                        {"id": "c", "text": "python manage.py newmodule nombre_app"},
                        {"id": "d", "text": "pip install nombre_app"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "startapp genera la estructura de carpetas estandar (models.py, views.py, admin.py, apps.py) para una aplicacion modular en Django."
                },
                {
                    "id": "q_dj_01_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "En que lista de settings.py debe agregarse obligatoriamente una nueva app creada en el proyecto para que Django cargue sus modelos y configuraciones?",
                    "options": [
                        {"id": "a", "text": "INSTALLED_APPS"},
                        {"id": "b", "text": "MIDDLEWARE"},
                        {"id": "c", "text": "AUTHENTICATION_BACKENDS"},
                        {"id": "d", "text": "ALLOWED_HOSTS"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "INSTALLED_APPS lista las aplicaciones activas del proyecto. Sin registrarla alli, Django ignorara las migraciones y modelos de la aplicacion."
                },
                {
                    "id": "q_dj_01_04",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que funcion cumple include() en el archivo urls.py principal de un proyecto Django?",
                    "options": [
                        {"id": "a", "text": "Permite referenciar y delegar el enrutamiento a un archivo urls.py secundario perteneciente a una aplicacion modular especifica."},
                        {"id": "b", "text": "Descarga archivos estaticos CSS desde un CDN externo."},
                        {"id": "c", "text": "Importa automaticamente todas las librerias instaladas con pip."},
                        {"id": "d", "text": "Crea una copia de seguridad de la base de datos."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "include() posibilita un enrutamiento jerarquico y desacoplado, haciendo que cada aplicacion gestione sus propias rutas."
                },
                {
                    "id": "q_dj_01_05",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Dada la ruta path('articulos/<int:articulo_id>/', views.detalle), que garantiza el convertidor <int:articulo_id>?",
                    "options": [
                        {"id": "a", "text": "Que la ruta solo coincidira si el valor es numerico entero, y lo entregara a la vista como un entero (int) de Python."},
                        {"id": "b", "text": "Que el articulo se creara automaticamente en la base de datos si no existe."},
                        {"id": "c", "text": "Que el parametro se transmitira codificado en Base64."},
                        {"id": "d", "text": "Que el usuario debe ser obligatoriamente administrador para acceder."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Los convertidores de ruta de Django realizan coincidencia de patron regex y conversion de tipo automatica al tipo especificado."
                },
                {
                    "id": "q_dj_01_06",
                    "type": "predict_output",
                    "difficulty": "hard",
                    "prompt": "Que ocurre si se define una vista basada en clase sin heredar de View y se intenta registrar con .as_view() en urls.py?",
                    "options": [
                        {"id": "a", "text": "Se produce un AttributeError porque el metodo .as_view() es provisto por la clase base View de Django."},
                        {"id": "b", "text": "Django compila la vista sin problemas."},
                        {"id": "c", "text": "La vista se convierte en un endpoint GraphQL."},
                        {"id": "d", "text": "El servidor se ejecuta en modo solo lectura."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "as_view() es un metodo de clase implementado en django.views.generic.base.View; una clase arbitraria no dispone de dicho metodo a menos que herede de View."
                }
            ]
        }
    },
    {
        "dir": "02_orm_modelos",
        "module_json": {
            "id": "dj_mod_02",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DJ_M02",
            "slug": "django-orm-models",
            "course_slug": "django-enterprise",
            "title": "Django ORM: Modelos, Relaciones y QuerySets",
            "objective": "Modelar tablas relacionales con models.Model, gestionar migraciones y consultar datos de forma optimizada con QuerySets.",
            "description": "Manipula bases de datos complejas sin escribir SQL manual: relaciones 1-a-N, M-a-N, filtros avanzados y evaluacion perezosa.",
            "position": 37,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_dj_02_01",
                    "code": "S01",
                    "title": "Modelado Relacional, Migraciones y QuerySets",
                    "slug": "modelado-migraciones-querysets",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_dj_02_01",
                            "code": "L01",
                            "title": "Definicion de Modelos y Tipos de Campos",
                            "slug": "definicion-modelos-campos",
                            "position": 1,
                            "concept_id": "dj-orm-models-fields",
                            "objective": "Declarar modelos relacionales heredando de models.Model y configurar restricciones en los campos.",
                            "theory_markdown": "El **ORM de Django** abstrae el motor SQL permitiendo definir tablas de base de datos como clases de Python que heredan de `django.db.models.Model`.\n\n### Campos comunes en Django Models\n- `CharField(max_length=...)`: Texto con limite de caracteres (requiere `max_length`).\n- `TextField()`: Texto largo de longitud ilimitada.\n- `IntegerField()`, `FloatField()`, `DecimalField(max_digits=..., decimal_places=...)`.\n- `BooleanField(default=...)`.\n- `DateTimeField(auto_now_add=True)` (asigna fecha en creacion) y `auto_now=True` (actualiza en cada guardado).\n\n### Opciones esenciales de campo\n- `null=True`: Permite que la base de datos almacene `NULL`.\n- `blank=True`: Permite que el campo quede vacio en validaciones de formularios y panel de administracion.\n- `default=...`: Valor por defecto si no se especifica uno.\n- `unique=True`: Garantiza unicidad del campo a nivel de indice SQL.\n\nTodo modelo debe implementar `__str__(self)` para ofrecer una representacion legible en consola y en el admin.",
                            "examples": [
                                {
                                    "title": "Modelo de Articulo con campos tipados",
                                    "code": "from django.db import models\n\nclass Articulo(models.Model):\n    titulo = models.CharField(max_length=200, unique=True)\n    contenido = models.TextField()\n    publicado = models.BooleanField(default=False)\n    creado_el = models.DateTimeField(auto_now_add=True)\n\n    def __str__(self) -> str:\n        return self.titulo",
                                    "output": "Tabla 'miapp_articulo' lista para sincronizarse con SQL.",
                                    "explanation": "Django anade automaticamente una clave primaria autoincremental entera llamada 'id' a menos que se defina una explicitamente."
                                }
                            ],
                            "common_errors": "Confundir null=True (nivel base de datos SQL) con blank=True (nivel validacion de formularios en Django).",
                            "mini_exercise": {
                                "instructions": "Declara una clase Producto con campo 'nombre' como CharField con max_length 100 y 'precio' como DecimalField.",
                                "starter_code": "from django.db import models\n\nclass Producto(models.Model):\n    # Agrega nombre y precio\n    pass",
                                "solution": "from django.db import models\n\nclass Producto(models.Model):\n    nombre = models.CharField(max_length=100)\n    precio = models.DecimalField(max_digits=10, decimal_places=2)"
                            },
                            "key_takeaways": [
                                "Los modelos heredan de models.Model y cada atributo representa una columna SQL.",
                                "null=True aplica a la columna SQL; blank=True aplica a la validacion de formularios.",
                                "__str__() devuelve la representacion en texto legible del objeto."
                            ],
                            "exercise": {
                                "id": "ex_dj_02_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la diferencia fundamental entre los argumentos null=True y blank=True en un campo de modelo Django?",
                                "options": [
                                    {"id": "a", "text": "null=True determina si la base de datos permite valores NULL; blank=True determina si los formularios permiten dejar el campo vacio."},
                                    {"id": "b", "text": "null=True es para numeros y blank=True es para textos."},
                                    {"id": "c", "text": "Son sinonimos que configuran unicamente la base de datos."},
                                    {"id": "d", "text": "blank=True encripta el campo antes de guardarlo."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "null es una restriccion puramente de base de datos relacional (almacenamiento), mientras que blank es una restriccion de validacion en la capa de aplicacion y formularios."
                            }
                        },
                        {
                            "id": "les_dj_02_02",
                            "code": "L02",
                            "title": "Ciclo de Migraciones: makemigrations y migrate",
                            "slug": "ciclo-migraciones-makemigrations-migrate",
                            "position": 2,
                            "concept_id": "dj-orm-migrations",
                            "objective": "Crear, inspeccionar y aplicar cambios de esquema relacional utilizando el sistema de migraciones de Django.",
                            "theory_markdown": "Las **migraciones** son el mecanismo de Django para propagar los cambios realizados en los modelos (`models.py`) al esquema de la base de datos relacional de manera versionada y segura.\n\n### Comandos del flujo de migraciones\n1. `python manage.py makemigrations`:\n   Inspecciona las diferencias entre los modelos actuales y las migraciones previas, generando un nuevo archivo de migracion (ej. `0001_initial.py`).\n2. `python manage.py migrate`:\n   Ejecuta las migraciones pendientes contra la base de datos, aplicando las sentencias DDL correspondientes (`CREATE TABLE`, `ALTER TABLE`).\n3. `python manage.py showmigrations`:\n   Muestra el listado de todas las migraciones del proyecto indicando con `[X]` las que ya fueron aplicadas.\n4. `python manage.py sqlmigrate app_name 0001`:\n   Muestra en consola el codigo SQL puro que Django ejecutaria para esa migracion sin aplicarlo.",
                            "examples": [
                                {
                                    "title": "Flujo de trabajo al anadir un campo a un modelo",
                                    "code": "# 1. Se modifica models.py agregando 'stock = models.IntegerField(default=0)'\n# 2. En la terminal se genera la migracion:\n# python manage.py makemigrations\n# Migrations for 'tienda':\n#   tienda/migrations/0002_producto_stock.py\n#     - Add field stock to producto\n# 3. Se sincroniza la base de datos:\n# python manage.py migrate",
                                    "output": "Applying tienda.0002_producto_stock... OK",
                                    "explanation": "El proceso es idempotente y garantiza que todos los desarrolladores y entornos apliquen exactamente el mismo esquema SQL."
                                }
                            ],
                            "common_errors": "Modificar directamente las tablas en el motor SQL (ej. ejecutando ALTER TABLE a mano) sin pasar por migraciones de Django, rompiendo la consistencia del estado de migraciones.",
                            "mini_exercise": {
                                "instructions": "Escribe el comando de consola de Django que genera los archivos de migracion a partir de los cambios en los modelos.",
                                "starter_code": "# Comando para generar migraciones\n",
                                "solution": "python manage.py makemigrations"
                            },
                            "key_takeaways": [
                                "makemigrations crea los archivos de migracion analizando models.py.",
                                "migrate aplica los cambios de esquema en el motor de base de datos.",
                                "sqlmigrate permite auditar el SQL puro antes de ejecutarlo en produccion."
                            ],
                            "exercise": {
                                "id": "ex_dj_02_02",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual comando de Django aplica efectivamente las migraciones pendientes ejecutando las sentencias DDL en la base de datos?",
                                "options": [
                                    {"id": "a", "text": "python manage.py migrate"},
                                    {"id": "b", "text": "python manage.py makemigrations"},
                                    {"id": "c", "text": "python manage.py createschema"},
                                    {"id": "d", "text": "python manage.py sync"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "makemigrations solo crea los archivos de especificacion de cambios; migrate es el comando que ejecuta las operaciones DDL en el motor de base de datos."
                            }
                        },
                        {
                            "id": "les_dj_02_03",
                            "code": "L03",
                            "title": "Relaciones entre Modelos: ForeignKey, OneToOne y ManyToMany",
                            "slug": "relaciones-modelos-foreignkey",
                            "position": 3,
                            "concept_id": "dj-orm-relationships",
                            "objective": "Establecer relaciones relacionales 1 a N, 1 a 1 y N a M configurando politicas de borrado con on_delete.",
                            "theory_markdown": "Django modela las relaciones entre tablas relacionales mediante campos especializados:\n\n1. **Uno a Muchos (1 a N) con `ForeignKey`:**\n   Un registro se asocia a otro (ej. muchos Articulos pertenecen a una Categoria).\n   Requiere obligatoriamente el argumento `on_delete`:\n   - `models.CASCADE`: Al eliminar el registro padre, se eliminan en cascada sus hijos.\n   - `models.PROTECT`: Impide la eliminacion del padre si tiene hijos asociados, lanzando `ProtectedError`.\n   - `models.SET_NULL`: Asigna `NULL` a la clave foranea (requiere `null=True`).\n   - `related_name`: Nombre con el cual el modelo padre accede a sus hijos (ej. `categoria.articulos.all()`).\n\n2. **Uno a Uno (1 a 1) con `OneToOneField`:**\n   Ideal para extensiones de perfiles (ej. un `User` tiene exactamente un `Perfil`).\n\n3. **Muchos a Muchos (N a M) con `ManyToManyField`:**\n   Crea de forma transparente una tabla intermedia en la base de datos relacional (ej. Articulos y Etiquetas).",
                            "examples": [
                                {
                                    "title": "Definicion de relaciones 1 a N y N a M",
                                    "code": "from django.db import models\n\nclass Categoria(models.Model):\n    nombre = models.CharField(max_length=50)\n\nclass Etiqueta(models.Model):\n    slug = models.SlugField(unique=True)\n\nclass Publicacion(models.Model):\n    titulo = models.CharField(max_length=150)\n    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name=\"publicaciones\")\n    etiquetas = models.ManyToManyField(Etiqueta, blank=True)",
                                    "output": "categoria.publicaciones.all() accede a todas las publicaciones asociadas.",
                                    "explanation": "related_name='publicaciones' permite la consulta inversa sin recurrir al sufijo predeterminado _set."
                                }
                            ],
                            "common_errors": "Omitir el argumento on_delete en ForeignKey o OneToOneField en versiones modernas de Django, lo que genera un error de definicion inmediato.",
                            "mini_exercise": {
                                "instructions": "Define un ForeignKey hacia la clase 'Autor' con politica de borrado CASCADE y related_name='libros'.",
                                "starter_code": "from django.db import models\n\n# Define el campo autor\n# autor = models.ForeignKey(...)",
                                "solution": "autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name=\"libros\")"
                            },
                            "key_takeaways": [
                                "ForeignKey define relaciones 1 a N y exige definir la politica on_delete.",
                                "models.CASCADE propaga el borrado; models.PROTECT bloquea la eliminacion de registros con dependientes.",
                                "related_name define el descriptor de acceso en la direccion inversa de la relacion.",
                                "ManyToManyField gestiona tablas intermedias automaticamente."
                            ],
                            "exercise": {
                                "id": "ex_dj_02_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que ocurre si se intenta borrar una Categoria asociada a Articulos cuando la relacion fue definida con on_delete=models.PROTECT?",
                                "options": [
                                    {"id": "a", "text": "Django lanza una excepcion ProtectedError impidiendo que la categoria sea eliminada de la base de datos."},
                                    {"id": "b", "text": "Borra la categoria y tambien todos los articulos asociados silenciosamente."},
                                    {"id": "c", "text": "Asigna NULL al campo categoria en todos los articulos."},
                                    {"id": "d", "text": "Duplica la categoria en una tabla de historicos."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "models.PROTECT emula la restriccion de integridad referencial RESTRICT de SQL, bloqueando la eliminacion del registro principal si existen hijos vinculados."
                            }
                        },
                        {
                            "id": "les_dj_02_04",
                            "code": "L04",
                            "title": "Consultas Optimizadas con QuerySets y Evitacion de N+1",
                            "slug": "querysets-optimizacion-n-mas-1",
                            "position": 4,
                            "concept_id": "dj-orm-querysets-n1",
                            "objective": "Aprovechar la evaluacion perezosa de los QuerySets y resolver el problema de rendimiento N+1 con select_related y prefetch_related.",
                            "theory_markdown": "Los **QuerySets** de Django son colecciones de objetos que representan consultas SQL.\n\n### Evaluacion Perezosa (Lazy Evaluation)\nUn QuerySet no consulta la base de datos en el instante en que se declara, sino cuando es evaluado (al iterar sobre el con un bucle `for`, al llamar a `list()`, `len()`, o serializarlo).\n\n### Filtros y Lookups de doble guion bajo\n```python\nArticulo.objects.filter(publicado=True, precio__gte=50.0).exclude(titulo__icontains=\"test\")\n```\n- `__gte`: mayor o igual que.\n- `__icontains`: busqueda textual insensible a mayusculas/minusculas.\n\n### El problema de consultas N+1\nSi se iteran 100 articulos accediendo a `articulo.categoria.nombre`, Django ejecutara 1 consulta para los articulos y 100 consultas individuales para las categorias (101 consultas en total).\n\n**Solucion:**\n- `select_related('categoria')`: Realiza un `SQL JOIN` inmediato (ideal para relaciones 1 a 1 y 1 a N).\n- `prefetch_related('etiquetas')`: Realiza 2 consultas agrupadas con `WHERE IN` en Python (ideal para N a M y relaciones inversas).",
                            "examples": [
                                {
                                    "title": "Optimizacion de consulta con select_related",
                                    "code": "# Ineficiente (1 + N consultas):\narticulos = Articulo.objects.all()\nfor art in articulos:\n    print(art.categoria.nombre)  # Ejecuta 1 consulta SQL por iteracion\n\n# Optimizado (1 consulta con JOIN):\narticulos_opt = Articulo.objects.select_related(\"categoria\").all()\nfor art in articulos_opt:\n    print(art.categoria.nombre)  # Los datos ya estan en memoria",
                                    "output": "De 101 consultas SQL se reduce a exactamente 1 sola consulta SQL con INNER/LEFT JOIN.",
                                    "explanation": "select_related trae los datos de la clave foranea en la misma consulta original."
                                }
                            ],
                            "common_errors": "Usar Articulo.objects.get() esperando encontrar un elemento que puede no existir, sin capturar la excepcion Articulo.DoesNotExist.",
                            "mini_exercise": {
                                "instructions": "Escribe una consulta que filtre productos con 'precio__gt=100' y use select_related('categoria').",
                                "starter_code": "# Consulta con filter y select_related\nproductos = ...",
                                "solution": "productos = Producto.objects.filter(precio__gt=100).select_related(\"categoria\")"
                            },
                            "key_takeaways": [
                                "Los QuerySets son perezosos (lazy) y se ejecutan unicamente al iterar o evaluarlos.",
                                "select_related optimiza relaciones ForeignKey mediante un JOIN en SQL.",
                                "prefetch_related optimiza relaciones ManyToMany mediante consultas separadas combinadas en memoria."
                            ],
                            "exercise": {
                                "id": "ex_dj_02_04",
                                "type": "single_choice",
                                "difficulty": "hard",
                                "prompt": "Cual metodo de QuerySet se debe utilizar en Django para evitar el problema N+1 al consultar una relacion ForeignKey (1 a N)?",
                                "options": [
                                    {"id": "a", "text": "select_related()"},
                                    {"id": "b", "text": "prefetch_cache()"},
                                    {"id": "c", "text": "join_models()"},
                                    {"id": "d", "text": "aggregate_all()"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "select_related() realiza una consulta con JOIN SQL para precargar objetos vinculados por claves foraneas en una unica ejecucion."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DJ_M02",
            "module_slug": "django-orm-models",
            "course_slug": "django-enterprise",
            "questions": [
                {
                    "id": "q_dj_02_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Que clase base deben heredar todos los modelos relacionales de datos en Django?",
                    "options": [
                        {"id": "a", "text": "django.db.models.Model"},
                        {"id": "b", "text": "pydantic.BaseModel"},
                        {"id": "c", "text": "django.views.View"},
                        {"id": "d", "text": "dataclasses.dataclass"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "models.Model es la clase base provista por Django para registrar tablas y conectar el ORM con la base de datos."
                },
                {
                    "id": "q_dj_02_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual es la funcion del comando python manage.py makemigrations?",
                    "options": [
                        {"id": "a", "text": "Inspecciona los modelos en models.py y genera archivos de migracion en Python con la especificacion de cambios en el esquema."},
                        {"id": "b", "text": "Ejecuta las instrucciones SQL en el servidor de base de datos de inmediato."},
                        {"id": "c", "text": "Exporta todos los datos existentes a un archivo CSV."},
                        {"id": "d", "text": "Elimina las tablas que contengan registros nulos."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "makemigrations detecta los cambios en los modelos y escribe los archivos de migracion que posteriormente ejecutara migrate."
                },
                {
                    "id": "q_dj_02_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que valor de on_delete en una ForeignKey elimina en cascada todos los registros hijos cuando se elimina el registro padre referenciado?",
                    "options": [
                        {"id": "a", "text": "models.CASCADE"},
                        {"id": "b", "text": "models.PROTECT"},
                        {"id": "c", "text": "models.SET_NULL"},
                        {"id": "d", "text": "models.DO_NOTHING"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "models.CASCADE propaga el borrado eliminando automaticamente las entidades hijas dependientes."
                },
                {
                    "id": "q_dj_02_04",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que significa que los QuerySets de Django posean evaluacion perezosa (lazy evaluation)?",
                    "options": [
                        {"id": "a", "text": "Que la consulta SQL no se envia a la base de datos hasta que el QuerySet sea efectivamente iterado o evaluado."},
                        {"id": "b", "text": "Que las consultas tardan mas de 5 segundos de forma intencional."},
                        {"id": "c", "text": "Que solo se pueden realizar consultas sobre tablas con menos de 100 registros."},
                        {"id": "d", "text": "Que los datos se guardan en un archivo de texto temporal."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Lazy evaluation permite encadenar filtros sin sobrecarga de red; la sentencia SQL final se genera y envia solo en el momento de acceso real a los registros."
                },
                {
                    "id": "q_dj_02_05",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "Como se escribe en el ORM de Django un filtro para buscar productos cuyo precio sea mayor o igual a 100?",
                    "options": [
                        {"id": "a", "text": "Producto.objects.filter(precio__gte=100)"},
                        {"id": "b", "text": "Producto.objects.filter(precio >= 100)"},
                        {"id": "c", "text": "Producto.objects.where('precio >= 100')"},
                        {"id": "d", "text": "Producto.objects.get(precio_greater=100)"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El doble guion bajo '__gte' (greater than or equal) es la sintaxis de lookup estandar del ORM de Django."
                },
                {
                    "id": "q_dj_02_06",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Cual es la diferencia en la ejecucion SQL entre select_related() y prefetch_related() en Django?",
                    "options": [
                        {"id": "a", "text": "select_related() hace un JOIN en una sola consulta SQL (1 a 1 o 1 a N); prefetch_related() hace consultas independientes agrupadas por lotes y las une en memoria en Python (N a M o relaciones inversas)."},
                        {"id": "b", "text": "select_related() solo funciona con bases de datos NoSQL."},
                        {"id": "c", "text": "prefetch_related() bloquea la base de datos contra escritura."},
                        {"id": "d", "text": "No existe diferencia, son alias intercambiables."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "select_related se apoya en SQL JOIN (apto para relaciones de cardinalidad simple), mientras que prefetch_related usa consultas separadas con 'WHERE IN' para no multiplicar filas en relaciones de muchos a muchos."
                }
            ]
        }
    },
    {
        "dir": "03_forms_admin",
        "module_json": {
            "id": "dj_mod_03",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DJ_M03",
            "slug": "django-forms-admin",
            "course_slug": "django-enterprise",
            "title": "ModelForms, Validacion y el Panel de Administracion",
            "objective": "Construir formularios validados automaticamente con ModelForm y personalizar el panel Django Admin para gestion operativa.",
            "description": "El superpoder mas celebrado de Django: un back-office completo generado automaticamente para administrar datos desde el dia uno.",
            "position": 38,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_dj_03_01",
                    "code": "S01",
                    "title": "Formularios, Validaciones y Django Admin",
                    "slug": "forms-validacion-admin",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 50,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_dj_03_01",
                            "code": "L01",
                            "title": "Formularios HTML y forms.Form con Proteccion CSRF",
                            "slug": "formularios-forms-form-csrf",
                            "position": 1,
                            "concept_id": "dj-forms-csrf",
                            "objective": "Construir formularios desacoplados con forms.Form, validar entradas y aplicar tokens CSRF en plantillas.",
                            "theory_markdown": "Django incluye un subsistema de formularios para automatizar tres tareas criticas:\n1. Generacion segura del marcado HTML de entrada.\n2. Conversion de cadenas recibidas en tipos nativos de Python.\n3. Validacion y saneamiento contra ataques de seguridad.\n\n### Proteccion CSRF (Cross-Site Request Forgery)\nTodo formulario que envie datos mediante peticion POST debe incluir obligatoriamente la etiqueta de plantilla `{% csrf_token %}` dentro del elemento `<form>`.\nDjango valida este token en el middleware; si no esta presente o es invalido, rechaza la peticion con un error HTTP 403 Forbidden para prevenir ataques de falsificacion.\n\n### Validacion con is_valid() y cleaned_data\nAl enviar el formulario, se instancia con `form = FormularioContacto(request.POST)`. Si `form.is_valid()` es `True`, los valores procesados y saneados estan disponibles en el diccionario `form.cleaned_data`.",
                            "examples": [
                                {
                                    "title": "Definicion y procesamiento de un formulario basico",
                                    "code": "from django import forms\nfrom django.shortcuts import render\nfrom django.http import HttpResponse\n\nclass ContactoForm(forms.Form):\n    nombre = forms.CharField(max_length=50)\n    email = forms.EmailField()\n    mensaje = forms.CharField(widget=forms.Textarea)\n\ndef contactar(request):\n    if request.method == \"POST\":\n        form = ContactoForm(request.POST)\n        if form.is_valid():\n            datos = form.cleaned_data\n            return HttpResponse(f\"Gracias {datos['nombre']}\")\n    else:\n        form = ContactoForm()\n    return render(request, \"contacto.html\", {\"form\": form})",
                                    "output": "Formulario renderizado con validacion de correos electronicos y campos obligatorios.",
                                    "explanation": "cleaned_data solo existe si is_valid() retorno True tras superar todas las validaciones."
                                }
                            ],
                            "common_errors": "Intentar acceder a form.cleaned_data antes de haber invocado form.is_valid(), lo que provoca un AttributeError.",
                            "mini_exercise": {
                                "instructions": "Escribe un formulario con forms.Form que contenga un campo 'asunto' de tipo CharField y 'edad' de tipo IntegerField.",
                                "starter_code": "from django import forms\n\nclass EncuestaForm(forms.Form):\n    # Define asunto y edad\n    pass",
                                "solution": "from django import forms\n\nclass EncuestaForm(forms.Form):\n    asunto = forms.CharField(max_length=100)\n    edad = forms.IntegerField()"
                            },
                            "key_takeaways": [
                                "{% csrf_token %} previene ataques CSRF en formularios con metodo POST.",
                                "is_valid() valida tipos, longitudes y reglas de negocio del formulario.",
                                "cleaned_data contiene los datos tipados y limpios listos para operar."
                            ],
                            "exercise": {
                                "id": "ex_dj_03_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Que ocurre si se envia un formulario con metodo POST en Django sin incluir la etiqueta {% csrf_token %}?",
                                "options": [
                                    {"id": "a", "text": "Django rechaza la peticion con un error HTTP 403 Forbidden por falla de verificacion CSRF."},
                                    {"id": "b", "text": "El formulario se procesa con normalidad omitiendo la seguridad."},
                                    {"id": "c", "text": "La base de datos se reinicia de inmediato."},
                                    {"id": "d", "text": "El navegador redirige a la pagina de Google."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "El CsrfViewMiddleware de Django intercepta las solicitudes POST y bloquea con 403 si el token secreto no viaja con el formulario."
                            }
                        },
                        {
                            "id": "les_dj_03_02",
                            "code": "L02",
                            "title": "ModelForm y Persistencia Directa",
                            "slug": "modelform-persistencia-directa",
                            "position": 2,
                            "concept_id": "dj-forms-modelform",
                            "objective": "Vincular formularios a modelos ORM mediante ModelForm y persistir registros con form.save().",
                            "theory_markdown": "Cuando un formulario refleja exactamente los campos de una tabla de base de datos, repetir las definiciones de campos es redundante. Django resuelve esto con **`ModelForm`**.\n\n### Estructura de ModelForm\n```python\nfrom django import forms\nfrom .models import Articulo\n\nclass ArticuloForm(forms.ModelForm):\n    class Meta:\n        model = Articulo\n        fields = [\"titulo\", \"contenido\", \"publicado\"]\n        # o fields = '__all__'\n```\n`ModelForm`:\n1. Infiere automaticamente los widgets y tipos de campo HTML desde el modelo.\n2. Tras validar con `form.is_valid()`, permite invocar directamente `form.save()` para persistir el registro en la base de datos.\n3. Si se pasa `commit=False` (`instancia = form.save(commit=False)`), crea el objeto en memoria sin insertarlo aun en SQL, permitiendo asociarle campos como el usuario creador antes del commit final.",
                            "examples": [
                                {
                                    "title": "Creacion de registro con ModelForm y commit=False",
                                    "code": "def crear_articulo(request):\n    if request.method == \"POST\":\n        form = ArticuloForm(request.POST)\n        if form.is_valid():\n            articulo = form.save(commit=False)\n            articulo.autor = request.user  # Asigna el usuario actual\n            articulo.save()                # Persiste en la base de datos\n            return redirect(\"articulos-lista\")",
                                    "output": "Registro creado en base de datos vinculado al autor autenticado.",
                                    "explanation": "commit=False es la tecnica estandar para poblar campos que no deben ser editables por el usuario en el formulario."
                                }
                            ],
                            "common_errors": "Usar fields = '__all__' en ModelForms de modelos que contienen atributos sensibles como 'es_staff' o 'saldo', permitiendo ataques de asignacion masiva (mass assignment).",
                            "mini_exercise": {
                                "instructions": "Declara una clase TareaForm que herede de forms.ModelForm vinculada al modelo Tarea con fields=['titulo', 'completada'].",
                                "starter_code": "from django import forms\nfrom .models import Tarea\n\n# Define TareaForm con class Meta\n",
                                "solution": "from django import forms\nfrom .models import Tarea\n\nclass TareaForm(forms.ModelForm):\n    class Meta:\n        model = Tarea\n        fields = [\"titulo\", \"completada\"]"
                            },
                            "key_takeaways": [
                                "ModelForm mapea campos del modelo a controles de formulario automaticamente.",
                                "form.save() persiste directamente la instancia validada en la base de datos.",
                                "commit=False permite modificar la instancia antes de insertarla definitivamente en SQL."
                            ],
                            "exercise": {
                                "id": "ex_dj_03_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Para que se utiliza el argumento commit=False al invocar form.save(commit=False) en un ModelForm de Django?",
                                "options": [
                                    {"id": "a", "text": "Para obtener la instancia del modelo en memoria sin persistirla todavia en la base de datos, permitiendo asignarle datos adicionales."},
                                    {"id": "b", "text": "Para revertir una transaccion SQL fallida."},
                                    {"id": "c", "text": "Para evitar que el formulario valide los campos obligatorios."},
                                    {"id": "d", "text": "Para exportar el formulario a un archivo de migracion."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "commit=False retorna el objeto instanciado con los datos del formulario sin guardarlo en el motor SQL de inmediato, ideal para anadir campos automaticos como el autor."
                            }
                        },
                        {
                            "id": "les_dj_03_03",
                            "code": "L03",
                            "title": "Validadores Personalizados y Metodos clean",
                            "slug": "validadores-metodos-clean",
                            "position": 3,
                            "concept_id": "dj-forms-clean-validation",
                            "objective": "Implementar validaciones de campo especificas con clean_<campo>() y validaciones de formulario global con clean().",
                            "theory_markdown": "Django ofrece dos niveles para personalizar la logica de validacion de formularios:\n\n1. **Validacion de un campo individual (`clean_<nombre_campo>()`):**\n   - Se accede al valor mediante `self.cleaned_data.get('nombre_campo')`.\n   - Si el valor infringe una regla, se eleva `forms.ValidationError('Mensaje de error')`.\n   - Debe retornar obligatoriamente el valor validado o transformado.\n\n2. **Validacion cruzada entre multiples campos (`clean()`):**\n   - Se sobreescribe el metodo general `clean(self)`.\n   - Se invoca `super().clean()`.\n   - Permite comparar campos entre si (por ejemplo, verificar que `password` coincida con `password_confirmacion`).",
                            "examples": [
                                {
                                    "title": "Validacion de campo individual y validacion cruzada",
                                    "code": "from django import forms\n\nclass RegistroForm(forms.Form):\n    email = forms.EmailField()\n    clave = forms.CharField(widget=forms.PasswordInput)\n    confirmar_clave = forms.CharField(widget=forms.PasswordInput)\n\n    def clean_email(self):\n        email = self.cleaned_data.get(\"email\")\n        if not email.endswith(\"@koda.academy\"):\n            raise forms.ValidationError(\"El correo debe pertenecer al dominio @koda.academy\")\n        return email.lower()\n\n    def clean(self):\n        cleaned_data = super().clean()\n        clave = cleaned_data.get(\"clave\")\n        confirmacion = cleaned_data.get(\"confirmar_clave\")\n        if clave and confirmacion and clave != confirmacion:\n            raise forms.ValidationError(\"Las contraseñas no coinciden\")\n        return cleaned_data",
                                    "output": "Formulario que aplica reglas corporativas y validacion cruzada de passwords.",
                                    "explanation": "clean_email valida un campo individual y clean() valida la relacion entre dos campos."
                                }
                            ],
                            "common_errors": "Olvidar retornar el valor validado al final del metodo clean_<campo>(), lo que provoca que ese campo quede almacenado como None en cleaned_data.",
                            "mini_exercise": {
                                "instructions": "Escribe un metodo clean_edad en un formulario que eleve forms.ValidationError si edad es menor a 18 y retorne edad en caso contrario.",
                                "starter_code": "from django import forms\n\nclass PerfilForm(forms.Form):\n    edad = forms.IntegerField()\n    \n    # Implementa clean_edad\n",
                                "solution": "from django import forms\n\nclass PerfilForm(forms.Form):\n    edad = forms.IntegerField()\n\n    def clean_edad(self):\n        edad = self.cleaned_data.get(\"edad\")\n        if edad is not None and edad < 18:\n            raise forms.ValidationError(\"Debes ser mayor de edad\")\n        return edad"
                            },
                            "key_takeaways": [
                                "clean_<campo>() valida y normaliza un campo y debe retornar el valor.",
                                "clean() global permite validar relaciones cruzadas entre multiples campos.",
                                "forms.ValidationError es la excepcion que almacena los errores para mostrarlos en el template."
                            ],
                            "exercise": {
                                "id": "ex_dj_03_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual excepcion estandar de Django se debe elevar dentro de clean_<campo>() para indicar que el valor no satisface la regla de negocio?",
                                "options": [
                                    {"id": "a", "text": "django.core.exceptions.ValidationError (o forms.ValidationError)"},
                                    {"id": "b", "text": "ValueError"},
                                    {"id": "c", "text": "django.http.Http404"},
                                    {"id": "d", "text": "TypeError"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "ValidationError es capturada por el sistema de formularios de Django y vinculada al campo para ser renderizada visualmente en la interfaz."
                            }
                        },
                        {
                            "id": "les_dj_03_04",
                            "code": "L04",
                            "title": "Personalizacion Avanzada del Django Admin",
                            "slug": "personalizacion-django-admin",
                            "position": 4,
                            "concept_id": "dj-admin-customization",
                            "objective": "Configurar y personalizar el panel de administracion de Django mediante ModelAdmin y decoradores.",
                            "theory_markdown": "El panel de administracion de Django (`/admin`) es una interfaz web generada dinamicamente para que el personal operativo administre los datos del sistema.\n\n### Creacion de superusuario\nPara acceder se crea una cuenta administrativa mediante:\n```bash\npython manage.py createsuperuser\n```\n\n### Registro y personalizacion con ModelAdmin\nEn `admin.py`, se registra el modelo decorando una clase `admin.ModelAdmin` con `@admin.register(Modelo)`:\n- `list_display`: Tupla de nombres de columnas visibles en la tabla principal.\n- `list_filter`: Filtros laterales dinamicos basados en campos (fechas, booleanos, categorias).\n- `search_fields`: Barra de busqueda que ejecuta sentencias `LIKE` o `ILIKE` en los campos indicados.\n- `readonly_fields`: Campos que se muestran pero no pueden ser alterados (ej. marcas temporales `creado_el`).",
                            "examples": [
                                {
                                    "title": "Configuracion profesional en admin.py",
                                    "code": "from django.contrib import admin\nfrom .models import Articulo\n\n@admin.register(Articulo)\nclass ArticuloAdmin(admin.ModelAdmin):\n    list_display = (\"titulo\", \"categoria\", \"publicado\", \"creado_el\")\n    list_filter = (\"publicado\", \"categoria\", \"creado_el\")\n    search_fields = (\"titulo\", \"contenido\")\n    readonly_fields = (\"creado_el\",)",
                                    "output": "Panel de administracion con tabla interactiva, filtros laterales y buscador full-text.",
                                    "explanation": "ModelAdmin permite crear un back-office completo sin escribir lineas de HTML ni JavaScript."
                                }
                            ],
                            "common_errors": "Agregar campos ManyToManyField directamente a list_display, lo cual provoca un error de configuracion en Django Admin porque list_display espera campos escalares.",
                            "mini_exercise": {
                                "instructions": "Usa el decorador @admin.register(Producto) para registrar la clase ProductoAdmin con list_display=('nombre', 'precio').",
                                "starter_code": "from django.contrib import admin\nfrom .models import Producto\n\n# Registra ProductoAdmin\n",
                                "solution": "from django.contrib import admin\nfrom .models import Producto\n\n@admin.register(Producto)\nclass ProductoAdmin(admin.ModelAdmin):\n    list_display = (\"nombre\", \"precio\")"
                            },
                            "key_takeaways": [
                                "python manage.py createsuperuser habilita el acceso inicial al panel.",
                                "list_display, list_filter y search_fields configuran la experiencia operativa del admin.",
                                "@admin.register(Modelo) es la forma limpia y moderna de registrar ModelAdmin."
                            ],
                            "exercise": {
                                "id": "ex_dj_03_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual atributo de ModelAdmin se utiliza para habilitar una barra de busqueda textual en la vista de lista del panel de Django Admin?",
                                "options": [
                                    {"id": "a", "text": "search_fields"},
                                    {"id": "b", "text": "list_search"},
                                    {"id": "c", "text": "query_inputs"},
                                    {"id": "d", "text": "filter_horizontal"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "search_fields define la lista de campos sobre los que la barra de busqueda del admin aplicara busquedas textuales."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DJ_M03",
            "module_slug": "django-forms-admin",
            "course_slug": "django-enterprise",
            "questions": [
                {
                    "id": "q_dj_03_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual es el proposito de incluir la etiqueta {% csrf_token %} dentro de los formularios POST en templates de Django?",
                    "options": [
                        {"id": "a", "text": "Inyectar un token criptografico para proteger a la aplicacion contra ataques de falsificacion de peticion en sitios cruzados (CSRF)."},
                        {"id": "b", "text": "Convertir los textos a letras mayusculas antes de enviarlos."},
                        {"id": "c", "text": "Habilitar la compresion gzip del formulario."},
                        {"id": "d", "text": "Generar estilos CSS automaticos con Bootstrap."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El token CSRF protege al servidor verificando que la solicitud provenga legitimamente del usuario en la sesion autenticada actual."
                },
                {
                    "id": "q_dj_03_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Donde se almacenan los datos de entrada validados, limpios y tipados en un formulario Django tras ejecutar exitosamente form.is_valid()?",
                    "options": [
                        {"id": "a", "text": "En el diccionario form.cleaned_data"},
                        {"id": "b", "text": "En request.POST directamente"},
                        {"id": "c", "text": "En una variable global del sistema operativo"},
                        {"id": "d", "text": "En form.raw_data"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "cleaned_data es el diccionario oficial donde Django guarda los datos que han superado todas las validaciones de tipo y de negocio."
                },
                {
                    "id": "q_dj_03_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que clase interna se debe definir dentro de un ModelForm para especificar el modelo vinculado y los campos a exponer?",
                    "options": [
                        {"id": "a", "text": "class Meta"},
                        {"id": "b", "text": "class Config"},
                        {"id": "c", "text": "class Settings"},
                        {"id": "d", "text": "class Schema"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "En Django ModelForm, 'class Meta' aloja los metadatos de configuracion como 'model' y 'fields'."
                },
                {
                    "id": "q_dj_03_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Que regla obligatoria debe seguir un metodo clean_<campo>() en un formulario de Django?",
                    "options": [
                        {"id": "a", "text": "Debe obtener el valor desde self.cleaned_data y retornar obligatoriamente el valor validado (o transformado)."},
                        {"id": "b", "text": "Debe ser un metodo asincrono con async def."},
                        {"id": "c", "text": "Debe recibir obligatoriamente el objeto request como argumento."},
                        {"id": "d", "text": "Debe retornar un booleano True o False."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Si clean_<campo>() no retorna el valor (o retorna None involuntariamente), ese campo se guardara como None en cleaned_data."
                },
                {
                    "id": "q_dj_03_05",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual comando de consola permite crear el usuario administrador inicial para acceder al panel de Django Admin?",
                    "options": [
                        {"id": "a", "text": "python manage.py createsuperuser"},
                        {"id": "b", "text": "python manage.py newadmin"},
                        {"id": "c", "text": "django-admin initroot"},
                        {"id": "d", "text": "python manage.py makeuser --admin"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "createsuperuser solicita username, email y password interactiva para crear un usuario con is_superuser=True y is_staff=True."
                },
                {
                    "id": "q_dj_03_06",
                    "type": "predict_output",
                    "difficulty": "medium",
                    "prompt": "En una clase ModelAdmin, que atributo se configura para determinar que campos aparecen como filtros laterales en la lista de registros?",
                    "options": [
                        {"id": "a", "text": "list_filter"},
                        {"id": "b", "text": "search_fields"},
                        {"id": "c", "text": "ordering"},
                        {"id": "d", "text": "fields_panel"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "list_filter genera el menu lateral derecho en el panel de administracion para filtrar por fechas, categorias o estados."
                }
            ]
        }
    },
    {
        "dir": "04_drf_apis",
        "module_json": {
            "id": "dj_mod_04",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DJ_M04",
            "slug": "django-rest-framework",
            "course_slug": "django-enterprise",
            "title": "Django REST Framework (DRF): Serializadores y ViewSets",
            "objective": "Transformar Django en una fabrica de APIs REST de nivel empresarial con ModelSerializer, ViewSets y DefaultRouter.",
            "description": "Construye APIs REST escalables sobre tus modelos de Django con paginacion, filtros y documentacion OpenAPI.",
            "position": 39,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_dj_04_01",
                    "code": "S01",
                    "title": "APIs Empresariales con Django REST Framework",
                    "slug": "apis-drf-viewsets",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 55,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_dj_04_01",
                            "code": "L01",
                            "title": "Introduccion a DRF y ModelSerializer",
                            "slug": "drf-modelserializer",
                            "position": 1,
                            "concept_id": "dj-drf-serializer",
                            "objective": "Comprender el rol de los serializadores y construir ModelSerializer para transformar instancias de modelos a JSON y viceversa.",
                            "theory_markdown": "**Django REST Framework (DRF)** es el estandar de la industria para desarrollar APIs web robustas sobre Django.\n\n### El Rol del Serializer\nLos **Serializers** de DRF cumplen una doble funcion:\n1. **Serializacion:** Convierten estructuras complejas como QuerySets e instancias de modelos en tipos nativos de Python (diccionarios) que pueden renderizarse facilmente en JSON.\n2. **Deserializacion y Validacion:** Convierten datos entrantes JSON en objetos validados de Python para actualizar o crear instancias en la base de datos.\n\n`ModelSerializer` automatiza este proceso inspeccionando los campos del modelo relacional:\n```python\nfrom rest_framework import serializers\nfrom .models import Articulo\n\nclass ArticuloSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Articulo\n        fields = [\"id\", \"titulo\", \"contenido\", \"publicado\", \"creado_el\"]\n        read_only_fields = [\"id\", \"creado_el\"]\n```",
                            "examples": [
                                {
                                    "title": "Serializacion de una instancia a diccionario",
                                    "code": "articulo = Articulo(id=1, titulo=\"Introduccion a DRF\", publicado=True)\nserializer = ArticuloSerializer(articulo)\nprint(serializer.data)",
                                    "output": "{'id': 1, 'titulo': 'Introduccion a DRF', 'publicado': True, 'creado_el': None}",
                                    "explanation": "serializer.data devuelve el diccionario primitivo listo para ser renderizado a JSON."
                                }
                            ],
                            "common_errors": "Intentar guardar un serializador con serializer.save() sin haber ejecutado previamente serializer.is_valid(), lo que provoca un AssertionError.",
                            "mini_exercise": {
                                "instructions": "Declara una clase CursoSerializer que herede de serializers.ModelSerializer para el modelo Curso con fields='__all__'.",
                                "starter_code": "from rest_framework import serializers\nfrom .models import Curso\n\n# Define CursoSerializer\n",
                                "solution": "from rest_framework import serializers\nfrom .models import Curso\n\nclass CursoSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Curso\n        fields = \"__all__\""
                            },
                            "key_takeaways": [
                                "DRF es el ecosistema estandar para crear APIs REST en Django.",
                                "ModelSerializer mapea modelos Django a contratos JSON de entrada y salida.",
                                "is_valid(raise_exception=True) valida y lanza un HTTP 400 automatico si hay errores."
                            ],
                            "exercise": {
                                "id": "ex_dj_04_01",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Cual es la responsabilidad principal de un ModelSerializer en Django REST Framework?",
                                "options": [
                                    {"id": "a", "text": "Convertir instancias de modelos de Django en formatos serializados como JSON y validar datos de peticiones entrantes para su persistencia."},
                                    {"id": "b", "text": "Configurar los servidores proxy de produccion."},
                                    {"id": "c", "text": "Crear copias de seguridad de la base de datos en archivos comprimidos."},
                                    {"id": "d", "text": "Reemplazar al archivo settings.py."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Los serializadores gestionan la conversion bidireccional entre datos JSON de la API y objetos Python/ORM validados."
                            }
                        },
                        {
                            "id": "les_dj_04_02",
                            "code": "L02",
                            "title": "Vistas de API: @api_view y APIView",
                            "slug": "vistas-api-view",
                            "position": 2,
                            "concept_id": "dj-drf-apiview",
                            "objective": "Desarrollar endpoints controlados con el decorador @api_view y la clase base APIView utilizando la clase Response.",
                            "theory_markdown": "DRF sustituye las vistas convencionales de Django por vistas conscientes de APIs REST:\n\n1. **Vistas funcionales con `@api_view`:**\n   Decorador que restringe metodos HTTP (`@api_view(['GET', 'POST'])`), parsea la peticion entrante en `request.data` (independiente de si es JSON o multipart) y retorna un objeto `rest_framework.response.Response`.\n\n2. **Vistas de clase con `APIView`:**\n   Hereda de `django.views.View` pero con superpoderes de DRF:\n   - Implementa metodos homonimos a los verbos HTTP (`get`, `post`, `put`, `delete`).\n   - Maneja automaticamente autenticacion, permisos y negociacion de contenido (permite renderizar JSON o la interfaz web interactiva Browsable API de DRF).",
                            "examples": [
                                {
                                    "title": "Endpoint con APIView y Response",
                                    "code": "from rest_framework.views import APIView\nfrom rest_framework.response import Response\nfrom rest_framework import status\nfrom .models import Articulo\nfrom .serializers import ArticuloSerializer\n\nclass ArticuloListAPIView(APIView):\n    def get(self, request):\n        articulos = Articulo.objects.all()\n        serializer = ArticuloSerializer(articulos, many=True)\n        return Response(serializer.data, status=status.HTTP_200_OK)\n\n    def post(self, request):\n        serializer = ArticuloSerializer(data=request.data)\n        if serializer.is_valid():\n            serializer.save()\n            return Response(serializer.data, status=status.HTTP_201_CREATED)\n        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)",
                                    "output": "API REST completa con navegabilidad interactiva desde el navegador.",
                                    "explanation": "many=True le indica al serializador que debe procesar una lista de instancias en vez de un unico objeto."
                                }
                            ],
                            "common_errors": "Retornar un HttpResponse de Django ordinario en lugar de la clase Response de DRF, perdiendo la negociacion de contenido y la navegacion en Browsable API.",
                            "mini_exercise": {
                                "instructions": "Escribe una vista con @api_view(['GET']) que retorne Response({'status': 'ok'}).",
                                "starter_code": "from rest_framework.decorators import api_view\nfrom rest_framework.response import Response\n\n# Define la vista\n",
                                "solution": "from rest_framework.decorators import api_view\nfrom rest_framework.response import Response\n\n@api_view([\"GET\"])\ndef estado(request):\n    return Response({\"status\": \"ok\"})"
                            },
                            "key_takeaways": [
                                "@api_view habilita la funcionalidad de DRF en vistas funcionales.",
                                "APIView organiza los metodos HTTP en funciones get(), post(), put(), delete().",
                                "request.data unifica el acceso al cuerpo JSON sin importar el Content-Type."
                            ],
                            "exercise": {
                                "id": "ex_dj_04_02",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es la ventaja de usar request.data en DRF en comparacion con request.POST de Django tradicional?",
                                "options": [
                                    {"id": "a", "text": "request.data procesa de forma transparente tanto payloads JSON como formularios codificados, y soporta metodos PUT y PATCH."},
                                    {"id": "b", "text": "request.data guarda la informacion directamente en el disco duro del cliente."},
                                    {"id": "c", "text": "request.data solo funciona cuando no hay conexion a internet."},
                                    {"id": "d", "text": "request.data borra los datos de la peticion una vez leidos."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "request.data analiza de forma polimorfica JSON, multipart y form-urlencoded, soportando todos los verbos HTTP modernos."
                            }
                        },
                        {
                            "id": "les_dj_04_03",
                            "code": "L03",
                            "title": "ModelViewSet y Enrutamiento con DefaultRouter",
                            "slug": "modelviewset-defaultrouter",
                            "position": 3,
                            "concept_id": "dj-drf-viewsets-router",
                            "objective": "Generar APIs CRUD completas combinando ModelViewSet con DefaultRouter en dos lineas de codigo.",
                            "theory_markdown": "Escribir manualmente vistas para list, retrieve, create, update y destroy en cada recurso se vuelve repetitivo. DRF introduce el patron **`ModelViewSet`**.\n\nUn `ModelViewSet` agrupa toda la logica CRUD estandar sobre un modelo:\n```python\nfrom rest_framework import viewsets\nfrom .models import Articulo\nfrom .serializers import ArticuloSerializer\n\nclass ArticuloViewSet(viewsets.ModelViewSet):\n    queryset = Articulo.objects.all()\n    serializer_class = ArticuloSerializer\n```\n\n### Enrutamiento automatico con DefaultRouter\nEl **`DefaultRouter`** analiza las acciones del ViewSet y genera automaticamente el mapa completo de URLs RESTful:\n```python\nfrom django.urls import path, include\nfrom rest_framework.routers import DefaultRouter\n\nrouter = DefaultRouter()\nrouter.register(r'articulos', ArticuloViewSet, basename='articulo')\n\nurlpatterns = [\n    path('api/v1/', include(router.urls)),\n]\n```\nRutas generadas:\n- `GET /api/v1/articulos/` (list)\n- `POST /api/v1/articulos/` (create)\n- `GET /api/v1/articulos/{id}/` (retrieve)\n- `PUT /api/v1/articulos/{id}/` (update)\n- `PATCH /api/v1/articulos/{id}/` (partial_update)\n- `DELETE /api/v1/articulos/{id}/` (destroy)",
                            "examples": [
                                {
                                    "title": "Configuracion completa de un recurso con DefaultRouter",
                                    "code": "# En urls.py:\nfrom rest_framework.routers import DefaultRouter\nfrom .views import ArticuloViewSet\n\nrouter = DefaultRouter()\nrouter.register(r\"articulos\", ArticuloViewSet)\n# router.urls contiene las 6 rutas REST estandar",
                                    "output": "Rutas CRUD generadas de forma consistente con nombres estandarizados.",
                                    "explanation": "DefaultRouter ahorra la escritura manual de patrones de URL para cada verbo HTTP."
                                }
                            ],
                            "common_errors": "Olvidar especificar el argumento queryset en el ModelViewSet o no definir basename cuando el queryset es dinamico.",
                            "mini_exercise": {
                                "instructions": "Crea una instancia de DefaultRouter, registra la ruta 'productos' con ProductoViewSet y asigna sus urls a urlpatterns.",
                                "starter_code": "from rest_framework.routers import DefaultRouter\n\n# Registra productos en el router\nrouter = ...",
                                "solution": "from rest_framework.routers import DefaultRouter\n\nrouter = DefaultRouter()\nrouter.register(r\"productos\", ProductoViewSet)"
                            },
                            "key_takeaways": [
                                "ModelViewSet consolida las 6 operaciones CRUD clasicas en una sola clase.",
                                "DefaultRouter genera y nombra automaticamente las rutas RESTful estandar.",
                                "Permite anadir acciones personalizadas con el decorador @action."
                            ],
                            "exercise": {
                                "id": "ex_dj_04_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cuales metodos HTTP y rutas genera automaticamente DefaultRouter al registrar un ModelViewSet en 'usuarios'?",
                                "options": [
                                    {"id": "a", "text": "GET y POST en /usuarios/, y GET, PUT, PATCH, DELETE en /usuarios/{id}/"},
                                    {"id": "b", "text": "Unicamente peticiones POST en /usuarios/login/"},
                                    {"id": "c", "text": "Solo consultas GET de solo lectura."},
                                    {"id": "d", "text": "Genera unicamente archivos de documentacion estatica."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "ModelViewSet combinado con DefaultRouter genera la arquitectura CRUD completa para listas y elementos individuales."
                            }
                        },
                        {
                            "id": "les_dj_04_04",
                            "code": "L04",
                            "title": "Paginacion, Filtros y Permisos en DRF",
                            "slug": "paginacion-filtros-permisos",
                            "position": 4,
                            "concept_id": "dj-drf-pagination-permissions",
                            "objective": "Proteger endpoints mediante permission_classes y configurar paginacion para optimizar el consumo de red.",
                            "theory_markdown": "Una API de produccion no puede retornar listas ilimitadas de registros ni permitir operaciones no autorizadas.\n\n### Permisos con permission_classes\nDRF incluye clases de permisos listas para usar:\n- `AllowAny`: Acceso publico irrestricto.\n- `IsAuthenticated`: Requiere usuario autenticado (retorna 401 si no hay credenciales).\n- `IsAdminUser`: Requiere que `user.is_staff` sea `True`.\n- `IsAuthenticatedOrReadOnly`: Permite lecturas (GET) a cualquiera, pero restringe escrituras (POST, PUT, DELETE) a usuarios autenticados.\n\nSe pueden configurar a nivel global en `REST_FRAMEWORK` dentro de `settings.py` o directamente en el ViewSet:\n```python\nfrom rest_framework.permissions import IsAuthenticated\n\nclass ArticuloViewSet(viewsets.ModelViewSet):\n    permission_classes = [IsAuthenticated]\n```\n\n### Paginacion con PageNumberPagination\nPermite paginar resultados dividiendolos en paginas controladas (`/api/v1/articulos/?page=2&page_size=20`), retornando metadata con el conteo total y enlaces a la pagina previa y siguiente.",
                            "examples": [
                                {
                                    "title": "ViewSet con permisos restringidos y paginacion",
                                    "code": "from rest_framework import viewsets\nfrom rest_framework.permissions import IsAuthenticatedOrReadOnly\nfrom rest_framework.pagination import PageNumberPagination\n\nclass PaginacionEstandar(PageNumberPagination):\n    page_size = 10\n    page_size_query_param = \"page_size\"\n    max_page_size = 100\n\nclass ArticuloViewSet(viewsets.ModelViewSet):\n    queryset = Articulo.objects.all()\n    serializer_class = ArticuloSerializer\n    permission_classes = [IsAuthenticatedOrReadOnly]\n    pagination_class = PaginacionEstandar",
                                    "output": "{\"count\": 52, \"next\": \".../?page=2\", \"previous\": null, \"results\": [...]}",
                                    "explanation": "Los clientes anonimos pueden consultar los articulos, pero solo los usuarios autenticados pueden crear o modificarlos."
                                }
                            ],
                            "common_errors": "Olvidar configurar paginacion en endpoints con millones de registros, provocando caidas del servidor por saturacion de memoria al responder un GET sin limites.",
                            "mini_exercise": {
                                "instructions": "Configura un ViewSet para que requiera autenticacion obligatoria usando permission_classes = [IsAuthenticated].",
                                "starter_code": "from rest_framework import viewsets\nfrom rest_framework.permissions import IsAuthenticated\n\nclass SeguroViewSet(viewsets.ModelViewSet):\n    # Configura permission_classes\n    pass",
                                "solution": "from rest_framework import viewsets\nfrom rest_framework.permissions import IsAuthenticated\n\nclass SeguroViewSet(viewsets.ModelViewSet):\n    permission_classes = [IsAuthenticated]"
                            },
                            "key_takeaways": [
                                "permission_classes controla el acceso a nivel de endpoint o accion.",
                                "IsAuthenticatedOrReadOnly balancea lectura publica y escritura segura.",
                                "PageNumberPagination fragmenta las colecciones grandes previniendo saturacion de memoria."
                            ],
                            "exercise": {
                                "id": "ex_dj_04_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Que permiso de DRF permite que cualquier persona lea datos (GET) pero exige usuario autenticado para crear o modificar (POST, PUT, DELETE)?",
                                "options": [
                                    {"id": "a", "text": "IsAuthenticatedOrReadOnly"},
                                    {"id": "b", "text": "IsAuthenticated"},
                                    {"id": "c", "text": "AllowAny"},
                                    {"id": "d", "text": "IsStaffUser"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "IsAuthenticatedOrReadOnly evalua el metodo HTTP: para metodos seguros (GET, HEAD, OPTIONS) concede acceso a todos; para metodos de mutacion exige autenticacion."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DJ_M04",
            "module_slug": "django-rest-framework",
            "course_slug": "django-enterprise",
            "questions": [
                {
                    "id": "q_dj_04_01",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Cual es la diferencia principal entre un Form de Django y un Serializer de Django REST Framework?",
                    "options": [
                        {"id": "a", "text": "Los Forms generan y procesan HTML para navegadores web; los Serializers gestionan datos estructurados (como JSON) para APIs REST."},
                        {"id": "b", "text": "Los Serializers solo funcionan con bases de datos MongoDB."},
                        {"id": "c", "text": "Los Forms no admiten validaciones de campos."},
                        {"id": "d", "text": "No existe diferencia, son exactamente iguales."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Los Forms se orientan al ciclo clasico de navegadores con HTML/POST; los Serializers estan disenados para serializar y validar payloads JSON en arquitecturas de APIs."
                },
                {
                    "id": "q_dj_04_02",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que argumento se debe pasar al instanciar un ModelSerializer si se desea serializar una lista de multiples objetos (QuerySet)?",
                    "options": [
                        {"id": "a", "text": "many=True"},
                        {"id": "b", "text": "multiple=True"},
                        {"id": "c", "text": "is_list=True"},
                        {"id": "d", "text": "batch=True"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "many=True le indica al serializador que reciba un iterable de instancias y serialize cada una en una lista JSON."
                },
                {
                    "id": "q_dj_04_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que clase de respuesta debe retornar una vista desarrollada con DRF para admitir negociacion de contenido y Browsable API?",
                    "options": [
                        {"id": "a", "text": "rest_framework.response.Response"},
                        {"id": "b", "text": "django.http.HttpResponse"},
                        {"id": "c", "text": "json.dumps()"},
                        {"id": "d", "text": "sys.stdout.write()"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Response es la clase especializada de DRF que negocia si devuelve JSON o la interfaz grafica navegable segun las cabeceras del cliente."
                },
                {
                    "id": "q_dj_04_04",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Cual componente de DRF genera automaticamente las rutas de URL estandar para todas las acciones de un ModelViewSet?",
                    "options": [
                        {"id": "a", "text": "DefaultRouter"},
                        {"id": "b", "text": "AutoUrlGenerator"},
                        {"id": "c", "text": "PathResolver"},
                        {"id": "d", "text": "UrlMapper"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "DefaultRouter registra ViewSets y produce el conjunto completo de URLs RESTful con soporte para sufijos de formato y vistas raiz de API."
                },
                {
                    "id": "q_dj_04_05",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que codigo de estado HTTP responde DRF cuando un usuario anonimo intenta acceder a un endpoint protegido con permission_classes = [IsAuthenticated]?",
                    "options": [
                        {"id": "a", "text": "401 Unauthorized (o 403 si las credenciales fueron enviadas pero son invalidas)"},
                        {"id": "b", "text": "200 OK"},
                        {"id": "c", "text": "500 Internal Server Error"},
                        {"id": "d", "text": "404 Not Found"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "DRF responde con 401 Unauthorized cuando la peticion no posee credenciales de autenticacion validas."
                },
                {
                    "id": "q_dj_04_06",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "Cual clase de paginacion de DRF divide los resultados por numero de pagina (ej. ?page=2)?",
                    "options": [
                        {"id": "a", "text": "PageNumberPagination"},
                        {"id": "b", "text": "LimitOffsetPagination"},
                        {"id": "c", "text": "CursorPagination"},
                        {"id": "d", "text": "NoPagination"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "PageNumberPagination utiliza el parametro ?page= para fragmentar los resultados con estilo clasico numerado."
                }
            ]
        }
    },
    {
        "dir": "05_auth_seguridad_deploy",
        "module_json": {
            "id": "dj_mod_05",
            "language_id": "a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "code": "DJ_M05",
            "slug": "django-auth-security-deploy",
            "course_slug": "django-enterprise",
            "title": "Seguridad Web, Permisos y Despliegue en Produccion",
            "objective": "Blindar la aplicacion contra CSRF, XSS, SQLi, gestionar grupos/permisos y configurar Gunicorn con WhiteNoise para despliegue.",
            "description": "Pon tu aplicacion Django en produccion: checklist de seguridad, gestion estatica con WhiteNoise y servidores WSGI.",
            "position": 40,
            "status": "published",
            "content_version": 1,
            "total_sections": 1,
            "total_lessons": 4,
            "thresholds": {"quiz": 70, "exam": 80},
            "xp": {"on_pass": 250},
            "sections": [
                {
                    "id": "sec_dj_05_01",
                    "code": "S01",
                    "title": "Seguridad Empresarial, Archivos Estaticos y Despliegue",
                    "slug": "seguridad-estaticos-despliegue",
                    "position": 1,
                    "type": "theory",
                    "estimated_minutes": 55,
                    "xp_on_complete": 100,
                    "lessons": [
                        {
                            "id": "les_dj_05_01",
                            "code": "L01",
                            "title": "Modelo de Usuario Personalizado y Permisos",
                            "slug": "modelo-usuario-personalizado",
                            "position": 1,
                            "concept_id": "dj-auth-custom-user",
                            "objective": "Implementar un modelo de usuario personalizado extendiendo AbstractUser y configurar AUTH_USER_MODEL.",
                            "theory_markdown": "La documentacion oficial de Django estipula como **regla de oro** definir un modelo de usuario personalizado al iniciar cualquier proyecto nuevo, incluso si el modelo predeterminado parece suficiente inicialmente.\n\n### AbstractUser vs AbstractBaseUser\n- **`AbstractUser`:** Mantiene todos los campos estandar (`first_name`, `last_name`, `is_staff`, `groups`) permitiendo anadir campos nuevos (ej. `avatar`, `biografia`, `rol`) o cambiar el login a `email`.\n- **`AbstractBaseUser`:** Solo contiene el campo `password` y `last_login`, exigiendo implementar todo el sistema de autenticacion desde cero.\n\n### Configuracion en settings.py\n```python\n# En usuarios/models.py:\nfrom django.contrib.auth.models import AbstractUser\nfrom django.db import models\n\nclass Usuario(AbstractUser):\n    email = models.EmailField(unique=True)\n    telefono = models.CharField(max_length=20, blank=True)\n\n# En settings.py:\nAUTH_USER_MODEL = 'usuarios.Usuario'\n```\nEsto debe realizarse **antes** de ejecutar la primera migracion en el proyecto.",
                            "examples": [
                                {
                                    "title": "Verificacion de permisos en vistas",
                                    "code": "from django.contrib.auth.decorators import login_required, permission_required\n\n@login_required\n@permission_required(\"cursos.puede_publicar\", raise_exception=True)\ndef publicar_curso(request):\n    return HttpResponse(\"Curso publicado con exito\")",
                                    "output": "Si el usuario no tiene el permiso, Django lanza PermissionDenied (HTTP 403).",
                                    "explanation": "El sistema de permisos integrado permite controlar el acceso declarativamente por accion."
                                }
                            ],
                            "common_errors": "Intentar cambiar AUTH_USER_MODEL a mitad de un proyecto que ya tiene migraciones aplicadas y relaciones de claves foraneas existentes, lo que suele requerir migraciones complejas.",
                            "mini_exercise": {
                                "instructions": "Escribe la linea de configuracion en settings.py para indicar que el modelo de usuario es 'cuentas.Usuario'.",
                                "starter_code": "# Configura AUTH_USER_MODEL\n",
                                "solution": "AUTH_USER_MODEL = \"cuentas.Usuario\""
                            },
                            "key_takeaways": [
                                "Siempre se debe heredar de AbstractUser al iniciar un proyecto nuevo.",
                                "AUTH_USER_MODEL debe configurarse antes de ejecutar la primera migracion.",
                                "login_required y permission_required protegen vistas basadas en funciones."
                            ],
                            "exercise": {
                                "id": "ex_dj_05_01",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Por que la documentacion oficial de Django aconseja configurar un modelo de usuario personalizado con AbstractUser al comenzar un proyecto?",
                                "options": [
                                    {"id": "a", "text": "Porque permite personalizar campos futuros (como usar email en vez de username) sin quebrar migraciones ya aplicadas a lo largo del proyecto."},
                                    {"id": "b", "text": "Porque el modelo por defecto de Django no puede almacenar contraseñas."},
                                    {"id": "c", "text": "Porque es obligatorio para que funcione el motor de plantillas DTL."},
                                    {"id": "d", "text": "Porque duplica la velocidad de las consultas SQL."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "Cambiar el modelo de usuario despues de haber creado tablas y relaciones foraneas es extremadamente complejo; iniciar con AbstractUser previene ese obstaculo."
                            }
                        },
                        {
                            "id": "les_dj_05_02",
                            "code": "L02",
                            "title": "Seguridad Web: Prevencion de SQLi, XSS y CSRF",
                            "slug": "seguridad-sqli-xss-csrf",
                            "position": 2,
                            "concept_id": "dj-security-practices",
                            "objective": "Comprender como Django protege por defecto contra inyeccion SQL, XSS y CSRF, y evitar malas practicas comunes.",
                            "theory_markdown": "Django fue disenado con seguridad defensiva activa:\n\n1. **Inyeccion SQL (SQL Injection):**\n   El ORM de Django parametriza todas las consultas por defecto. El usuario nunca debe concatenar cadenas crudas en sentencias SQL como `Articulo.objects.raw(f'SELECT * WHERE id={id}')`.\n\n2. **Cross-Site Scripting (XSS):**\n   El motor de plantillas DTL escapa automaticamente cualquier variable HTML (`<` se convierte en `&lt;`).\n   Solo se debe usar el filtro `|safe` cuando el contenido provenga de una fuente de absoluta confianza.\n\n3. **Clickjacking:**\n   El middleware `XFrameOptionsMiddleware` incluye la cabecera `X-Frame-Options: DENY` evitando que el sitio sea incrustado dentro de un `<iframe>` malicioso.",
                            "examples": [
                                {
                                    "title": "Parametrizacion segura vs concatenacion insegura",
                                    "code": "# INSEGURO (Vulnerable a SQLi):\n# query = f\"SELECT * FROM articulos WHERE titulo = '{input_usuario}'\"\n\n# SEGURO (El ORM parametriza automaticamente):\narticulos = Articulo.objects.filter(titulo=input_usuario)",
                                    "output": "La consulta se compila como SQL con marcadores de posicion ($1 o ?) inmune a SQLi.",
                                    "explanation": "El ORM separa la estructura SQL de los datos proporcionados por el usuario."
                                }
                            ],
                            "common_errors": "Utilizar el filtro |safe en plantillas sobre texto introducido por usuarios desconocidos, abriendo una vulnerabilidad de XSS.",
                            "mini_exercise": {
                                "instructions": "Usa el metodo filter del ORM para buscar un usuario por email sin usar SQL crudo.",
                                "starter_code": "# Busca usuario de forma segura con filter\n",
                                "solution": "usuario = Usuario.objects.filter(email=email_recibido).first()"
                            },
                            "key_takeaways": [
                                "El ORM parametriza consultas automaticamente protegiendo contra inyeccion SQL.",
                                "DTL escapa variables HTML por defecto para prevenir XSS.",
                                "X-Frame-Options previene ataques de Clickjacking impidiendo iframes no autorizados."
                            ],
                            "exercise": {
                                "id": "ex_dj_05_02",
                                "type": "single_choice",
                                "difficulty": "easy",
                                "prompt": "Como protege el motor de plantillas de Django (DTL) contra ataques de Cross-Site Scripting (XSS) por defecto?",
                                "options": [
                                    {"id": "a", "text": "Escapa automaticamente todos los caracteres HTML peligrosos como <, > y & en las variables renderizadas."},
                                    {"id": "b", "text": "Elimina todos los archivos JavaScript del servidor."},
                                    {"id": "c", "text": "Exige que el usuario escriba su clave antes de ver cada pagina."},
                                    {"id": "d", "text": "Convierte todas las paginas web en imagenes PNG."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "DTL escapa los caracteres especiales HTML a sus entidades correspondientes de forma transparente, neutralizando scripts maliciosos inyectados."
                            }
                        },
                        {
                            "id": "les_dj_05_03",
                            "code": "L03",
                            "title": "Gestion de Archivos Estaticos con WhiteNoise",
                            "slug": "archivos-estaticos-whitenoise",
                            "position": 3,
                            "concept_id": "dj-deploy-whitenoise",
                            "objective": "Configurar STATIC_ROOT, collectstatic y el middleware WhiteNoise para servir CSS/JS en produccion.",
                            "theory_markdown": "En desarrollo local, el servidor de Django sirve archivos estaticos (`CSS`, `JS`, imagenes) de forma automatica. Sin embargo, en produccion (`DEBUG = False`), Django deshabilita esta funcion por rendimiento.\n\nPara servir archivos estaticos de forma eficiente sin requerir configurar Nginx exclusivamente para ello, se utiliza **WhiteNoise**:\n\n1. Instalar `whitenoise` y agregarlo a `MIDDLEWARE` justo despues de `SecurityMiddleware`:\n   ```python\n   MIDDLEWARE = [\n       \"django.middleware.security.SecurityMiddleware\",\n       \"whitenoise.middleware.WhiteNoiseMiddleware\",\n       ...\n   ]\n   ```\n2. Definir rutas en `settings.py`:\n   ```python\n   STATIC_URL = '/static/'\n   STATIC_ROOT = BASE_DIR / 'staticfiles'\n   STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'\n   ```\n3. Recolectar todos los estaticos antes de desplegar:\n   ```bash\n   python manage.py collectstatic --no-input\n   ```\nWhiteNoise comprime (gzip/brotli) y genera hashes unicos para invalidar la cache de navegadores de forma optima.",
                            "examples": [
                                {
                                    "title": "Recoleccion de estaticos en el proceso de construccion",
                                    "code": "# En terminal o Dockerfile:\n# python manage.py collectstatic --no-input\n# 125 static files copied to '/app/staticfiles', 125 post-processed.",
                                    "output": "Archivos listos con nombres versionados (ej. estilo.a1b2c3d4.css) y compresion.",
                                    "explanation": "CompressedManifestStaticFilesStorage garantiza cache infinita y previene que el navegador use archivos CSS desactualizados."
                                }
                            ],
                            "common_errors": "Desplegar a produccion con DEBUG = False sin haber ejecutado collectstatic ni configurado WhiteNoise, haciendo que la aplicacion se muestre sin estilos ni JavaScript.",
                            "mini_exercise": {
                                "instructions": "Escribe el comando de Django para recolectar todos los archivos estaticos sin solicitar confirmacion interactiva.",
                                "starter_code": "# Comando collectstatic\n",
                                "solution": "python manage.py collectstatic --no-input"
                            },
                            "key_takeaways": [
                                "Django no sirve estaticos en produccion con DEBUG = False de forma predeterminada.",
                                "WhiteNoise permite que la aplicacion WSGI sirva sus propios estaticos con alto rendimiento.",
                                "collectstatic reune todos los recursos de las apps en STATIC_ROOT."
                            ],
                            "exercise": {
                                "id": "ex_dj_05_03",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual es el proposito del comando python manage.py collectstatic en Django?",
                                "options": [
                                    {"id": "a", "text": "Reunir todos los archivos estaticos (CSS, JS, imagenes) de todas las aplicaciones instaladas en la carpeta definida por STATIC_ROOT para produccion."},
                                    {"id": "b", "text": "Comprobar que no haya errores de tipado en el codigo Python."},
                                    {"id": "c", "text": "Eliminar las imagenes que tengan mas de un ano de antiguedad."},
                                    {"id": "d", "text": "Descargar las dependencias desde PyPI."}
                                ],
                                "correct_option_id": "a",
                                "explanation": "collectstatic centraliza todos los activos estaticos dispersos en las aplicaciones dentro de un unico directorio unificado (STATIC_ROOT) para ser servidos en produccion."
                            }
                        },
                        {
                            "id": "les_dj_05_04",
                            "code": "L04",
                            "title": "Checklist de Despliegue, Gunicorn y Auditoria de Seguridad",
                            "slug": "checklist-despliegue-gunicorn-auditoria",
                            "position": 4,
                            "concept_id": "dj-deploy-checklist-gunicorn",
                            "objective": "Ejecutar la auditoria de seguridad con manage.py check --deploy y configurar Gunicorn para servir Django en produccion.",
                            "theory_markdown": "Antes de publicar un proyecto Django en un servidor de produccion, se debe verificar el cumplimiento del **Deployment Checklist**:\n\n### 1. Auditoria automatica\nDjango incluye un comando de auditoria integrado que verifica todas las variables de seguridad:\n```bash\npython manage.py check --deploy\n```\n\n### 2. Variables criticas para produccion\n- `DEBUG = False`\n- `ALLOWED_HOSTS = ['midominio.com']`\n- `SECURE_SSL_REDIRECT = True` (redirige todo el trafico HTTP a HTTPS)\n- `SESSION_COOKIE_SECURE = True` (cookies de sesion solo viajan por HTTPS)\n- `CSRF_COOKIE_SECURE = True` (cookies CSRF solo viajan por HTTPS)\n\n### 3. Servidor de aplicaciones WSGI con Gunicorn\nEn produccion no se usa `runserver`. Se utiliza un servidor WSGI de grado industrial como **Gunicorn**:\n```bash\ngunicorn mi_proyecto.wsgi:application --workers 3 --bind 0.0.0.0:8000\n```",
                            "examples": [
                                {
                                    "title": "Ejecucion del chequeo de despliegue",
                                    "code": "# python manage.py check --deploy\n# System check identified no issues (0 silenced).",
                                    "output": "Si falta alguna configuracion de seguridad HTTPS, Django muestra advertencias 'security.W008', 'security.W012'.",
                                    "explanation": "El chequeo garantiza que no existan puertas abiertas de seguridad antes de recibir trafico real."
                                }
                            ],
                            "common_errors": "Ejecutar python manage.py runserver en un servidor de produccion en lugar de usar Gunicorn o uWSGI.",
                            "mini_exercise": {
                                "instructions": "Escribe el comando de Django para ejecutar la comprobacion de seguridad de despliegue.",
                                "starter_code": "# Comando check deploy\n",
                                "solution": "python manage.py check --deploy"
                            },
                            "key_takeaways": [
                                "python manage.py check --deploy audita la configuracion de seguridad de settings.py.",
                                "SECURE_SSL_REDIRECT y cookies seguras garantizan el uso exclusivo de HTTPS.",
                                "Gunicorn ejecuta la aplicacion WSGI con un pool de workers en produccion."
                            ],
                            "exercise": {
                                "id": "ex_dj_05_04",
                                "type": "single_choice",
                                "difficulty": "medium",
                                "prompt": "Cual comando de Django analiza el archivo settings.py y reporta advertencias sobre configuraciones inseguras antes de ir a produccion?",
                                "options": [
                                    {"id": "a", "text": "python manage.py check --deploy"},
                                    {"id": "b", "text": "python manage.py audit --strict"},
                                    {"id": "c", "text": "python manage.py security_scan"},
                                    {"id": "d", "text": "django-admin verify"}
                                ],
                                "correct_option_id": "a",
                                "explanation": "check --deploy inspecciona parametros criticos como SECRET_KEY, DEBUG, SSL y cookies de sesion reportando cualquier vulnerabilidad detectada."
                            }
                        }
                    ]
                }
            ]
        },
        "bank_json": {
            "module_code": "DJ_M05",
            "module_slug": "django-auth-security-deploy",
            "course_slug": "django-enterprise",
            "questions": [
                {
                    "id": "q_dj_05_01",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Cual clase base se recomienda heredar al crear un modelo de usuario personalizado en Django manteniendo todos los campos estandar?",
                    "options": [
                        {"id": "a", "text": "django.contrib.auth.models.AbstractUser"},
                        {"id": "b", "text": "django.contrib.auth.models.AbstractBaseUser"},
                        {"id": "c", "text": "django.db.models.Model"},
                        {"id": "d", "text": "django.views.View"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "AbstractUser conserva la implementacion completa de usuario de Django (nombres, permisos, staff) permitiendo anadir campos personalizados con facilidad."
                },
                {
                    "id": "q_dj_05_02",
                    "type": "single_choice",
                    "difficulty": "easy",
                    "prompt": "Como previene el ORM de Django los ataques de Inyeccion SQL (SQL Injection)?",
                    "options": [
                        {"id": "a", "text": "Parametrizando automaticamente todos los valores pasados a metodos como filter(), get() y exclude()."},
                        {"id": "b", "text": "Eliminando la clausula WHERE de todas las consultas."},
                        {"id": "c", "text": "Encriptando la base de datos con una contrasena maestra."},
                        {"id": "d", "text": "Permitiendo solo conexiones desde localhost."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "El ORM compila sentencias SQL parametrizadas donde los valores nunca se interpolan como cadenas crudas, neutralizando cualquier intento de inyeccion de codigo."
                },
                {
                    "id": "q_dj_05_03",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que libreria permite a una aplicacion Django servir sus propios archivos estaticos en produccion de forma altamente eficiente con compresion y cache?",
                    "options": [
                        {"id": "a", "text": "WhiteNoise"},
                        {"id": "b", "text": "Boto3"},
                        {"id": "c", "text": "Pillow"},
                        {"id": "d", "text": "Requests"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "WhiteNoise se integra como middleware en el stack WSGI permitiendo servir activos estaticos directamente con compresion y hashes de versionado."
                },
                {
                    "id": "q_dj_05_04",
                    "type": "single_choice",
                    "difficulty": "medium",
                    "prompt": "Que servidor WSGI basado en un modelo pre-fork de workers es comunmente utilizado para servir Django en servidores Linux de produccion?",
                    "options": [
                        {"id": "a", "text": "Gunicorn"},
                        {"id": "b", "text": "Apache Tomcat"},
                        {"id": "c", "text": "Node.js"},
                        {"id": "d", "text": "manage.py runserver"}
                    ],
                    "correct_option_id": "a",
                    "explanation": "Gunicorn (Green Unicorn) es el servidor WSGI estandar para Python en sistemas Unix, disenado para gestionar multiples workers concurrentes de forma estable."
                },
                {
                    "id": "q_dj_05_05",
                    "type": "single_choice",
                    "difficulty": "hard",
                    "prompt": "Que efecto tiene configurar SECURE_SSL_REDIRECT = True en settings.py de Django?",
                    "options": [
                        {"id": "a", "text": "Redirige automaticamente todas las peticiones entrantes no seguras HTTP hacia su equivalente seguro HTTPS."},
                        {"id": "b", "text": "Deshabilita el protocolo SSL en el servidor."},
                        {"id": "c", "text": "Exige que el cliente tenga instalado un certificado digital en su navegador."},
                        {"id": "d", "text": "Impide que los usuarios puedan cerrar sesion."}
                    ],
                    "correct_option_id": "a",
                    "explanation": "SecurityMiddleware inspecciona el esquema de la solicitud y responde con una redireccion 301/302 a HTTPS si la conexion fue establecida por HTTP plano."
                },
                {
                    "id": "q_dj_05_06",
                    "type": "predict_output",
                    "difficulty": "easy",
                    "prompt": "Cual es el valor obligatorio que debe tener la variable DEBUG en settings.py en un entorno de produccion real?",
                    "options": [
                        {"id": "a", "text": "False"},
                        {"id": "b", "text": "True"},
                        {"id": "c", "text": "None"},
                        {"id": "d", "text": "\"development\""}
                    ],
                    "correct_option_id": "a",
                    "explanation": "DEBUG debe ser siempre False en produccion para evitar fugas criticas de informacion confidencial a traves de paginas de depuracion detalladas."
                }
            ]
        }
    }
]

def main():
    print("Iniciando generacion de 5 modulos de Django...")
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
