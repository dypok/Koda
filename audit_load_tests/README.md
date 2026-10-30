# 🧪 Suite de Pruebas de Carga y Benchmarking de Producción — Koda Academy

Esta suite permite determinar de forma reproducible y con datos empíricos la capacidad de respuesta (RPS), latencia (P50, P95, P99) y punto de quiebre (Breaking Point) del backend de Koda ante el lanzamiento piloto de la plataforma.

## 1. Alcance de las Pruebas
La simulación modela el viaje real de un estudiante en el Módulo Python:
1. `POST /api/v1/auth/verify-session`: Handshake de autenticación y sesión.
2. `GET /api/v1/learning/roadmap/python`: Carga del árbol curricular DAG y candados.
3. `GET /api/v1/learning/lessons/:lessonId`: Carga de contenido y tríada evaluativa.
4. `POST /api/v1/learning/lessons/:lessonId/answer`: Envío de respuesta con cálculo de XP, racha y telemetría.

## 2. Requisitos Previos
- Python 3.10+ y `uv` instalado.
- Backend NestJS ejecutándose en `http://localhost:4000` (o la URL de staging).

## 3. Ejecución Rápida
Ejecutar el benchmark incremental automatizado (10, 50, 100, 250, 500 VUs):

```bash
python audit_load_tests/run_benchmark.py http://localhost:4000 baseline
```

O lanzar Locust en modo interactivo con interfaz web:

```bash
uv run --with locust locust -f audit_load_tests/locustfile.py --host http://localhost:4000
```
Abrir `http://localhost:8089` en el navegador.

## 4. Estructura de Salida
Los reportes en formato CSV y métricas agregadas se almacenan automáticamente en:
`audit_load_tests/results/`
