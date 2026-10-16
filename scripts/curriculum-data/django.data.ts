import type { RawModule } from './types.ts';

const LANG_ID = 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

export const DJANGO_MODULES: RawModule[] = [
  // M01
  {
    id: 'dj_mod_01',
    language_id: LANG_ID,
    code: 'DJ_M01',
    slug: 'django-mtv-routing',
    title: 'Arquitectura MTV, Settings y Routing en Django',
    objective: 'Comprender la filosofía "baterías incluidas" de Django, la arquitectura Modelo-Template-Vista (MTV) y configurar el enrutamiento.',
    description: 'El framework web empresarial por excelencia: crea proyectos robustos, desacoplados en apps modulares con configuración segura.',
    folder: 'django/01_mtv_routing',
    course_slug: 'django-enterprise',
    position: 1,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 250 },
    sections: [
      {
        id: 'sec_dj_01_01',
        code: 'S01',
        title: 'Estructura de un Proyecto Django',
        slug: 'estructura-django',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_dj_01_01',
            code: 'L01',
            title: 'Filosofía Batteries Included y el Patrón MTV',
            slug: 'filosofia-mtv',
            position: 1,
            concept_id: 'dj-intro',
            objective: 'Diferenciar entre Proyecto Django y Aplicaciones (apps) individuales.',
            theory_markdown: `Django promueve la filosofía de **"baterías incluidas"**: incluye de serie autenticación, panel administrativo, ORM y protección CSRF sin configurar librerías externas.\n\nSu arquitectura se basa en **MTV (Model - Template - View)**:\n- **Model**: Capa de datos y reglas de negocio (ORM).\n- **Template**: Capa de presentación (HTML con motor de plantillas de Django DTL).\n- **View**: Capa de control que recibe la petición HTTP, consulta los modelos y renderiza el template o respuesta JSON.`,
            examples: [
              {
                title: 'Vista básica basada en función',
                code: 'from django.http import JsonResponse\n\ndef estado_sistema(request):\n    datos = {"plataforma": "Koda Academy", "version": "5.1", "online": True}\n    return JsonResponse(datos)',
                output: 'HTTP 200 OK\n{"plataforma": "Koda Academy", "version": "5.1", "online": true}',
                explanation: 'JsonResponse serializa diccionarios con la cabecera application/json automáticamente.'
              }
            ],
            common_errors: 'Olvidar registrar una nueva app creada con `django-admin startapp` dentro de la lista `INSTALLED_APPS` en `settings.py`.',
            mini_exercise: {
              starter_code: '# settings.py\n# INSTALLED_APPS = [\n#     ...\n#     "mi_app",\n# ]',
              instructions: 'Recuerda que toda app modular debe añadirse a INSTALLED_APPS.',
              solution: '# app registrada en INSTALLED_APPS'
            },
            key_takeaways: [
              'Django es batteries-included: trae seguridad, auth y admin integrados.',
              'Un proyecto contiene una o varias apps modulares reutilizables.',
              'MTV mapea datos (Model), lógica (View) y visualización (Template).'
            ],
            exercise: {
              id: 'ex_dj_01_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: 'En la arquitectura MTV de Django, ¿cuál capa es la encargada de procesar la lógica de la petición y devolver una respuesta?',
              options: [
                { id: 'a', text: 'View (Vista)' },
                { id: 'b', text: 'Template (Plantilla)' },
                { id: 'c', text: 'Model (Modelo)' },
                { id: 'd', text: 'Settings' }
              ],
              correct_option_id: 'a',
              explanation: 'La View (en views.py) recibe el request, ejecuta la lógica y devuelve la HttpResponse correspondiente.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_dj_01_01',
        type: 'single_choice',
        difficulty: 'easy',
        prompt: '¿Cuál es el comando de la CLI de Django para crear una nueva aplicación modular dentro del proyecto?',
        options: [
          { id: 'a', text: 'python manage.py startapp <nombre>' },
          { id: 'b', text: 'django-admin new-project <nombre>' },
          { id: 'c', text: 'pip install app <nombre>' },
          { id: 'd', text: 'django create-service' }
        ],
        correct_option_id: 'a',
        explanation: 'manage.py startapp genera la estructura de carpetas (models.py, views.py, etc.) para una nueva app.'
      }
    ]
  },

  // M02
  {
    id: 'dj_mod_02',
    language_id: LANG_ID,
    code: 'DJ_M02',
    slug: 'django-orm-models',
    title: 'Django ORM: Modelos, Relaciones y QuerySets',
    objective: 'Modelar tablas relacionales con models.Model, gestionar migraciones y consultar datos de forma optimizada con QuerySets.',
    description: 'Manipula bases de datos complejas sin escribir SQL manual: relaciones 1-a-N, M-a-N, filtros avanzados y evaluación perezosa.',
    folder: 'django/02_orm_modelos',
    course_slug: 'django-enterprise',
    position: 2,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 280 },
    sections: [
      {
        id: 'sec_dj_02_01',
        code: 'S01',
        title: 'Modelos Declarativos y QuerySets',
        slug: 'modelos-querysets',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_dj_02_01',
            code: 'L01',
            title: 'Modelos con models.Model y el Ciclo makemigrations / migrate',
            slug: 'modelos-migraciones-base',
            position: 1,
            concept_id: 'dj-orm',
            objective: 'Declarar modelos relacionales y aplicar cambios de esquema a la base de datos.',
            theory_markdown: `El ORM de Django mapea clases de Python a tablas SQL:\n\`\`\`python\nfrom django.db import models\n\nclass Curso(models.Model):\n    titulo = models.CharField(max_length=100)\n    precio = models.DecimalField(max_digits=6, decimal_places=2)\n    activo = models.BooleanField(default=True)\n\`\`\`\n\nCiclo de vida de cambios:\n1. Modificas o creas tu clase en \`models.py\`.\n2. \`python manage.py makemigrations\`: Genera el archivo de migración en Python describiendo los cambios.\n3. \`python manage.py migrate\`: Traduce y ejecuta las sentencias DDL correspondientes en el motor SQL.`,
            examples: [
              {
                title: 'Consultas idiomáticas con QuerySets',
                code: '# Consultas perezosas (lazy)\ncursos_activos = Curso.objects.filter(activo=True).order_by("-precio")\n# Búsqueda exacta de un solo objeto\ncurso_python = Curso.objects.get(titulo="Python Specialist")',
                output: '<QuerySet [<Curso: Python Specialist>, <Curso: FastAPI Pro>]>',
                explanation: 'filter() devuelve un QuerySet que solo consulta la base de datos cuando los datos son realmente leídos.'
              }
            ],
            common_errors: 'Usar `.get()` cuando pueden existir múltiples resultados o ninguno: lanza `MultipleObjectsReturned` o `DoesNotExist`. Para búsquedas seguras usa `.filter(...).first()`.',
            mini_exercise: {
              starter_code: '# Filtra cursos con precio menor a 50 usando el lookup __lt (less than)\n# Curso.objects.filter(precio__lt=50)',
              instructions: 'Comprende el uso del doble guión bajo para lookups en Django ORM.',
              solution: '# precio__lt=50'
            },
            key_takeaways: [
              'makemigrations prepara el plano; migrate aplica los cambios en SQL.',
              'Los QuerySets son perezosos (lazy evaluation).',
              'Los field lookups usan doble guión bajo (campo__gte, campo__icontains).'
            ],
            exercise: {
              id: 'ex_dj_02_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué comando de Django genera los archivos de migración tras modificar models.py?',
              options: [
                { id: 'a', text: 'python manage.py makemigrations' },
                { id: 'b', text: 'python manage.py migrate' },
                { id: 'c', text: 'python manage.py sqlcreate' },
                { id: 'd', text: 'python manage.py syncdb' }
              ],
              correct_option_id: 'a',
              explanation: 'makemigrations inspecciona tus modelos y crea los archivos de migración; migrate es quien los ejecuta en la BD.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_dj_02_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué tipo de campo de Django ORM se utiliza para modelar una relación 1 a N (por ejemplo: Un Autor tiene muchos Libros)?',
        options: [
          { id: 'a', text: 'models.ForeignKey(..., on_delete=models.CASCADE)' },
          { id: 'b', text: 'models.ManyToManyField()' },
          { id: 'c', text: 'models.OneToOneField()' },
          { id: 'd', text: 'models.ArrayField()' }
        ],
        correct_option_id: 'a',
        explanation: 'ForeignKey crea una clave foránea en la tabla, estableciendo una relación 1 a muchos.'
      }
    ]
  },

  // M03
  {
    id: 'dj_mod_03',
    language_id: LANG_ID,
    code: 'DJ_M03',
    slug: 'django-forms-admin',
    title: 'ModelForms, Validación y el Panel de Administración',
    objective: 'Construir formularios validados automáticamente con ModelForm y personalizar el panel Django Admin para gestión operativa.',
    description: 'El superpoder más celebrado de Django: un back-office completo generado automáticamente para administrar datos desde el día uno.',
    folder: 'django/03_forms_admin',
    course_slug: 'django-enterprise',
    position: 3,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 300 },
    sections: [
      {
        id: 'sec_dj_03_01',
        code: 'S01',
        title: 'ModelForms y Registro en Django Admin',
        slug: 'forms-y-admin',
        position: 1,
        type: 'theory',
        estimated_minutes: 18,
        xp_on_complete: 45,
        lessons: [
          {
            id: 'les_dj_03_01',
            code: 'L01',
            title: 'Registro de Modelos en admin.py y ModelForms',
            slug: 'admin-modelforms-base',
            position: 1,
            concept_id: 'dj-admin',
            objective: 'Personalizar el panel administrativo con list_display, search_fields y filtros.',
            theory_markdown: `Con solo 3 líneas de código en \`admin.py\`, Django genera una interfaz visual con login seguro, búsqueda y edición para tus tablas de base de datos:\n\`\`\`python\nfrom django.contrib import admin\nfrom .models import Curso\n\n@admin.register(Curso)\nclass CursoAdmin(admin.ModelAdmin):\n    list_display = ("titulo", "precio", "activo")\n    search_fields = ("titulo",)\n    list_filter = ("activo",)\n\`\`\`\n\nPara validar datos de entrada de usuarios, \`ModelForm\` extrae los tipos y restricciones directamente del modelo para validar automáticamente con \`form.is_valid()\`.`,
            examples: [
              {
                title: 'Definición de un ModelForm',
                code: 'from django import forms\nfrom .models import Curso\n\nclass CursoForm(forms.ModelForm):\n    class Meta:\n        model = Curso\n        fields = ["titulo", "precio", "activo"]\n\n# En la vista:\n# form = CursoForm(request.POST)\n# if form.is_valid():\n#     form.save()',
                output: 'Formulario validado y guardado en base de datos',
                explanation: 'form.save() persiste directamente la instancia en base de datos si las validaciones pasan.'
              }
            ],
            common_errors: 'Olvidar el tag `{% csrf_token %}` dentro de formularios HTML en Django, lo que provoca un error 403 Forbidden por protección contra CSRF.',
            mini_exercise: {
              starter_code: '# Registra el modelo Estudiante en admin.py\n# admin.site.register(Estudiante)',
              instructions: 'Observa la sintaxis básica de registro en el panel de control.',
              solution: '# admin.site.register(Estudiante)'
            },
            key_takeaways: [
              'Django Admin provee un panel CRUD completo sin desarrollo frontend adicional.',
              'ModelForm vincula formularios con modelos reduciendo código repetitivo.',
              'La protección CSRF es obligatoria en todos los formularios de Django.'
            ],
            exercise: {
              id: 'ex_dj_03_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Cuál es el comando para crear el usuario administrador inicial para ingresar a /admin en Django?',
              options: [
                { id: 'a', text: 'python manage.py createsuperuser' },
                { id: 'b', text: 'python manage.py new-admin' },
                { id: 'c', text: 'python manage.py root' },
                { id: 'd', text: 'django admin create' }
              ],
              correct_option_id: 'a',
              explanation: 'createsuperuser solicita nombre, email y contraseña para crear el usuario con permisos totales en Django.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_dj_03_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué método se debe llamar en un formulario de Django para ejecutar todas las validaciones antes de acceder a cleaned_data?',
        options: [
          { id: 'a', text: 'form.is_valid()' },
          { id: 'b', text: 'form.check()' },
          { id: 'c', text: 'form.validate()' },
          { id: 'd', text: 'form.verify()' }
        ],
        correct_option_id: 'a',
        explanation: 'is_valid() ejecuta las reglas de validación y retorna True si no se produjeron errores.'
      }
    ]
  },

  // M04
  {
    id: 'dj_mod_04',
    language_id: LANG_ID,
    code: 'DJ_M04',
    slug: 'django-rest-framework',
    title: 'Django REST Framework (DRF): Serializadores y ViewSets',
    objective: 'Transformar Django en una fábrica de APIs REST de nivel empresarial con ModelSerializer, ViewSets y DefaultRouter.',
    description: 'Construye APIs REST escalables sobre tus modelos de Django con paginación, filtros y documentación OpenAPI.',
    folder: 'django/04_drf_apis',
    course_slug: 'django-enterprise',
    position: 4,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 350 },
    sections: [
      {
        id: 'sec_dj_04_01',
        code: 'S01',
        title: 'ModelSerializers y ViewSets en DRF',
        slug: 'drf-viewsets',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_dj_04_01',
            code: 'L01',
            title: 'Arquitectura de DRF: Serializers, ViewSets y Routers',
            slug: 'drf-base',
            position: 1,
            concept_id: 'dj-drf',
            objective: 'Generar endpoints CRUD completos en menos de 20 líneas de código.',
            theory_markdown: `**Django REST Framework (DRF)** es la librería estándar para crear APIs con Django:\n1. \`ModelSerializer\`: Convierte instancias complejas de modelos ORM en diccionarios serializables a JSON y viceversa.\n2. \`ModelViewSet\`: Implementa automáticamente las acciones \`list\`, \`create\`, \`retrieve\`, \`update\` y \`destroy\`.\n3. \`DefaultRouter\`: Genera todas las rutas URL REST automáticamente (\`GET /api/cursos/\`, \`POST /api/cursos/\`, \`GET /api/cursos/1/\`, etc.).`,
            examples: [
              {
                title: 'API CRUD completa con DRF',
                code: 'from rest_framework import serializers, viewsets, routers\nfrom .models import Curso\n\nclass CursoSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Curso\n        fields = "__all__"\n\nclass CursoViewSet(viewsets.ModelViewSet):\n    queryset = Curso.objects.all()\n    serializer_class = CursoSerializer\n\n# En urls.py:\nrouter = routers.DefaultRouter()\nrouter.register(r"cursos", CursoViewSet)',
                output: 'Endpoints REST generados: GET, POST, PUT, PATCH, DELETE en /api/cursos/',
                explanation: 'DRF resuelve toda la infraestructura CRUD estándar con máxima consistencia.'
              }
            ],
            common_errors: 'Olvidar agregar `"rest_framework"` en la lista `INSTALLED_APPS` de `settings.py`.',
            mini_exercise: {
              starter_code: '# Crea un ModelSerializer para el modelo Perfil\n# class PerfilSerializer(serializers.ModelSerializer):\n#     class Meta:\n#         model = Perfil\n#         fields = ["id", "bio"]',
              instructions: 'Revisa la sintaxis canónica de un ModelSerializer.',
              solution: '# Serializer listo'
            },
            key_takeaways: [
              'ModelSerializer traduce modelos ORM a JSON bidireccionalmente.',
              'ModelViewSet genera las 5 operaciones CRUD en una sola clase.',
              'DefaultRouter mapea las URLs estándar automáticamente.'
            ],
            exercise: {
              id: 'ex_dj_04_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Qué componente de DRF genera automáticamente el mapa de URLs para un ViewSet?',
              options: [
                { id: 'a', text: 'DefaultRouter' },
                { id: 'b', text: 'UrlDispatcher' },
                { id: 'c', text: 'ModelBuilder' },
                { id: 'd', text: 'ApiGateway' }
              ],
              correct_option_id: 'a',
              explanation: 'DefaultRouter registra ViewSets y crea las rutas REST correspondientes con soporte de formato extensible.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_dj_04_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Cuál es el rol principal de un Serializer en Django REST Framework?',
        options: [
          { id: 'a', text: 'Convertir tipos de datos complejos como QuerySets y modelos a JSON nativo y validar datos entrantes' },
          { id: 'b', text: 'Encriptar el disco duro del servidor' },
          { id: 'c', text: 'Generar archivos CSS' },
          { id: 'd', text: 'Ejecutar pruebas unitarias' }
        ],
        correct_option_id: 'a',
        explanation: 'Los serializers permiten que los datos de modelos de Django se rendericen a JSON y deserializan datos JSON entrantes validándolos antes de guardar.'
      }
    ]
  },

  // M05
  {
    id: 'dj_mod_05',
    language_id: LANG_ID,
    code: 'DJ_M05',
    slug: 'django-auth-security-deploy',
    title: 'Seguridad Web, Permisos y Despliegue en Producción',
    objective: 'Blindar la aplicación contra CSRF, XSS, SQLi, gestionar grupos/permisos y configurar Gunicorn con WhiteNoise para despliegue.',
    description: 'Pon tu aplicación Django en producción: checklist de seguridad, gestión estática con WhiteNoise y servidores WSGI.',
    folder: 'django/05_auth_seguridad_deploy',
    course_slug: 'django-enterprise',
    position: 5,
    status: 'published',
    thresholds: { quiz: 70, exam: 80 },
    xp: { on_pass: 400 },
    sections: [
      {
        id: 'sec_dj_05_01',
        code: 'S01',
        title: 'Checklist de Producción y Gunicorn',
        slug: 'seguridad-y-produccion',
        position: 1,
        type: 'theory',
        estimated_minutes: 20,
        xp_on_complete: 50,
        lessons: [
          {
            id: 'les_dj_05_01',
            code: 'L01',
            title: 'Checklist de Seguridad (DEBUG=False) y Servidor Gunicorn',
            slug: 'produccion-gunicorn-base',
            position: 1,
            concept_id: 'dj-deploy',
            objective: 'Configurar settings para producción y servir archivos estáticos con WhiteNoise.',
            theory_markdown: `Antes de poner un proyecto Django en Internet, la regla número 1 absoluta es:\n\`\`\`python\nDEBUG = False\nALLOWED_HOSTS = ["midominio.com", "api.midominio.com"]\nSECRET_KEY = os.environ["DJANGO_SECRET_KEY"]\n\`\`\`\n\nSi dejas \`DEBUG = True\` en producción, cualquier fallo revelará tu código fuente, variables de entorno y contraseñas de base de datos a los usuarios.\n\nPara servir la app usamos **Gunicorn** como servidor WSGI detrás de un reverse proxy (como Nginx o Cloudflare), y **WhiteNoise** para servir archivos estáticos eficientemente sin necesidad de un servidor web separado.`,
            examples: [
              {
                title: 'Comando de ejecución de producción',
                code: '# Comando típico en Procfile o Docker\n# gunicorn mi_proyecto.wsgi:application --workers 4 --bind 0.0.0.0:8000',
                output: '[INFO] Starting gunicorn 22.0.0\n[INFO] Listening at: http://0.0.0.0:8000 (4 workers)',
                explanation: 'Gunicorn distribuye la carga en 4 procesos trabajadores paralelos para alta disponibilidad.'
              }
            ],
            common_errors: 'Subir la `SECRET_KEY` quemada en el código a GitHub. Debe cargarse obligatoriamente desde variables de entorno.',
            mini_exercise: {
              starter_code: '# Verifica la configuración del proyecto antes de desplegar con:\n# python manage.py check --deploy',
              instructions: 'Recuerda usar check --deploy para auditoría de seguridad automática.',
              solution: '# python manage.py check --deploy'
            },
            key_takeaways: [
              'DEBUG=False es obligatorio en producción.',
              'ALLOWED_HOSTS previene ataques de envenenamiento de cabecera Host.',
              'python manage.py check --deploy audita la configuración de seguridad.'
            ],
            exercise: {
              id: 'ex_dj_05_01',
              type: 'single_choice',
              difficulty: 'easy',
              prompt: '¿Por qué es extremadamente peligroso dejar `DEBUG = True` en un entorno de producción accesible en Internet?',
              options: [
                { id: 'a', text: 'Porque ante cualquier error expone trazas de código, configuraciones y credenciales sensibles a los usuarios' },
                { id: 'b', text: 'Porque hace que el servidor no acepte más de 2 visitas' },
                { id: 'c', text: 'Porque borra la base de datos automáticamente cada 24 horas' },
                { id: 'd', text: 'Porque bloquea el puerto 80' }
              ],
              correct_option_id: 'a',
              explanation: 'La pantalla de depuración interactiva de Django revela variables de entorno, consultas SQL y secretos si DEBUG está habilitado.'
            }
          }
        ]
      }
    ],
    bank: [
      {
        id: 'q_dj_05_01',
        type: 'single_choice',
        difficulty: 'medium',
        prompt: '¿Qué comando de Django recolecta todos los archivos estáticos (CSS, JS, imágenes) de todas las apps en una sola carpeta central (STATIC_ROOT) para producción?',
        options: [
          { id: 'a', text: 'python manage.py collectstatic' },
          { id: 'b', text: 'python manage.py buildstatic' },
          { id: 'c', text: 'python manage.py export_assets' },
          { id: 'd', text: 'python manage.py sync_media' }
        ],
        correct_option_id: 'a',
        explanation: 'collectstatic unifica todos los recursos estáticos en STATIC_ROOT para que WhiteNoise o Nginx puedan servirlos con alto rendimiento.'
      }
    ]
  }
];
