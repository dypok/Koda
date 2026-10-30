import os
import random
import time
from locust import HttpUser, task, between, events

class KodaStudentUser(HttpUser):
    """
    Simulación del viaje de usuario real de un estudiante en el Módulo Python de Koda:
    1. Verificación de sesión / Auth Handshake
    2. Carga del Roadmap curricular DAG de Python
    3. Carga de micro-lección y tríada evaluativa
    4. Envío de respuesta con cálculo de XP, racha y telemetría
    """
    # Pausa realista entre acciones (1 a 3 segundos de tiempo de lectura/pensamiento)
    wait_time = between(1.0, 3.0)

    def on_start(self):
        # Generar identificador de estudiante virtual para particionar datos e IP
        self.student_id = random.randint(1, 10000)
        # Directriz 3: Inyección de IP simulada para aislar la capacidad bruta de DB/Backend
        # frente al ThrottlerGuard (Rate Limiting de IP única)
        self.simulated_ip = f"10.0.{self.student_id % 250}.{self.student_id % 254 + 1}"
        
        # Token Bearer de prueba o sesión
        self.auth_token = os.environ.get("KODA_TEST_TOKEN", "mock_student_pilot_token_2026")
        self.default_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.auth_token}",
            "X-Forwarded-For": self.simulated_ip,
            "User-Agent": f"KodaStudentLoadBot/1.0 (VU-{self.student_id})",
        }

    @task(3)
    def verify_session(self):
        """Paso 1: Validación de sesión y aprovisionamiento de perfil."""
        with self.client.post(
            "/api/v1/auth/verify-session",
            json={"token": self.auth_token},
            headers=self.default_headers,
            name="/auth/verify-session",
            catch_response=True,
        ) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 429:
                response.failure("Rate limited (HTTP 429)")
            elif response.status_code in (401, 403):
                # En modo sin token Supabase activo, 401 es contractualmente esperado
                response.success()
            else:
                response.failure(f"Error {response.status_code}: {response.text}")

    @task(5)
    def load_roadmap(self):
        """Paso 2: Carga del árbol curricular de Python y candados/estrellas."""
        with self.client.get(
            "/api/v1/learning/roadmap/python",
            headers=self.default_headers,
            name="/learning/roadmap/python",
            catch_response=True,
        ) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 429:
                response.failure("Rate limited (HTTP 429)")
            else:
                response.failure(f"Error {response.status_code}: {response.text}")

    @task(4)
    def load_lesson(self):
        """Paso 3: Carga de lección pedagógica y tríada evaluativa."""
        lesson_id = random.choice([
            "les_py1_01_01",
            "les_py1_01_02",
            "les_py1_01_03",
            "les_py1_01_04",
        ])
        with self.client.get(
            f"/api/v1/learning/lessons/{lesson_id}",
            headers=self.default_headers,
            name="/learning/lessons/[lessonId]",
            catch_response=True,
        ) as response:
            if response.status_code in (200, 404):
                # 404 si el slug de la lección específica aún no está en mongo se maneja graceful
                response.success()
            elif response.status_code == 429:
                response.failure("Rate limited (HTTP 429)")
            else:
                response.failure(f"Error {response.status_code}: {response.text}")

    @task(2)
    def submit_answer(self):
        """Paso 4: Envío de respuesta y disparo del evento asíncrono lesson.answered."""
        payload = {
            "selected_option_ids": ["a"],
            "time_spent_seconds": random.randint(15, 60),
            "xp_earned": 15,
        }
        with self.client.post(
            "/api/v1/learning/lessons/les_py1_01_01/answer",
            json=payload,
            headers=self.default_headers,
            name="/learning/lessons/[lessonId]/answer",
            catch_response=True,
        ) as response:
            if response.status_code in (200, 201):
                response.success()
            elif response.status_code in (401, 403):
                # Si el token no está registrado en Supabase Auth, responde 401 esperado por el Guard
                response.success()
            elif response.status_code == 429:
                response.failure("Rate limited (HTTP 429)")
            else:
                response.failure(f"Error {response.status_code}: {response.text}")
