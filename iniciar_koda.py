#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Koda - Inicializador (Windows + Linux)
======================================
Arranca el programa completo:

  * Verifica prerrequisitos (node_modules, @koda/types/dist, .env)
  * Compila @koda/types si falta
  * Lanza API (NestJS :4000) y Web (Next.js :3000) como subprocesos
  * Espera a que respondan (health-check por HTTP)
  * Abre el navegador en http://localhost:3000
  * Ctrl+C detiene ambos servicios ordenadamente

Uso:
    python iniciar_koda.py                 # todo (api + web + navegador)
    python iniciar_koda.py --solo-api      # solo backend :4000
    python iniciar_koda.py --solo-web      # solo frontend :3000
    python iniciar_koda.py --sin-navegador # no abre el navegador
    python iniciar_koda.py --forzar        # libera puertos 3000/4000 si estan ocupados
    python iniciar_koda.py --produccion    # `pnpm build` + `pnpm start` en vez de dev

Logs: .koda-logs/api.log y .koda-logs/web.log junto al repo.
Requisito previo: python instalar_recursos.py
"""

from __future__ import annotations

import argparse
import os
import signal
import socket
import subprocess
import sys
import time
import urllib.request
import webbrowser
from pathlib import Path

REPO = Path(__file__).resolve().parent
LOGS = REPO / ".koda-logs"
PNPM_CMD = "pnpm.cmd" if os.name == "nt" else "pnpm"  # ver instalar_recursos.py
API_URL = "http://localhost:4000/api/v1/"
WEB_URL = "http://localhost:3000/"
PUERTOS = {"web": 3000, "api": 4000}


def log(msg: str) -> None:
    print(f"[koda] {msg}", flush=True)


def puerto_ocupado(puerto: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(1)
        return s.connect_ex(("127.0.0.1", puerto)) == 0


def liberar_puerto(puerto: int) -> None:
    """Intenta liberar un puerto. Windows: taskkill por PID. Linux: fuser -k."""
    log(f"Liberando puerto {puerto}...")
    if os.name == "nt":
        try:
            out = subprocess.run(
                ["netstat", "-ano"], capture_output=True, text=True, timeout=20
            ).stdout
            pids = {l.strip().split()[-1] for l in out.splitlines()
                    if f":{puerto}" in l and "LISTENING" in l}
            for pid in pids:
                if pid.isdigit() and int(pid) > 4:
                    subprocess.run(["taskkill", "/F", "/PID", pid],
                                   capture_output=True, timeout=20)
        except Exception as exc:  # noqa: BLE001
            log(f"No se pudo liberar {puerto}: {exc}")
    else:
        for cmd in (["fuser", "-k", f"{puerto}/tcp"],
                    ["lsof", "-ti", f":{puerto}"]):
            try:
                r = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
                if cmd[0] == "lsof" and r.stdout.strip():
                    for pid in r.stdout.split():
                        subprocess.run(["kill", "-9", pid.strip()],
                                       capture_output=True, timeout=10)
            except Exception:  # noqa: BLE001
                pass


def verificar_previos() -> bool:
    """Comprueba node_modules, dist de types y .env. Devuelve True si se puede arrancar."""
    ok = True
    if not (REPO / "node_modules").exists():
        log("ERROR: falta node_modules. Ejecuta: python instalar_recursos.py")
        ok = False
    dist = REPO / "packages/types/dist"
    if not (dist.exists() and any(dist.iterdir())):
        log("AVISO: @koda/types sin compilar; se compilara ahora...")
        r = subprocess.run([PNPM_CMD, "--filter", "@koda/types", "build"], cwd=REPO)
        if r.returncode != 0 or not dist.exists():
            log("ERROR: no se pudo compilar @koda/types.")
            ok = False
    for rel, plantilla in ((".env", ".env.example"),
                           ("apps/api/.env", "apps/api/.env.example"),
                           ("apps/web/.env.local", "apps/web/.env.example")):
        dest, tpl = REPO / rel, REPO / plantilla
        if not dest.exists() and tpl.exists():
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(tpl.read_text(encoding="utf-8"), encoding="utf-8")
            log(f"{rel} creado desde {plantilla}.")
        elif not dest.exists():
            log(f"ERROR: falta {rel} y su plantilla.")
            ok = False
    return ok


def lanzar(nombre: str, args_pnpm: list[str], archivo_log: Path) -> subprocess.Popen:
    LOGS.mkdir(exist_ok=True)
    fh = archivo_log.open("w", encoding="utf-8")
    kwargs: dict = {"cwd": REPO, "stdout": fh, "stderr": subprocess.STDOUT, "text": True}
    if os.name == "nt":  # grupo propio para poder matarlo con Ctrl+C
        kwargs["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP
    proc = subprocess.Popen([PNPM_CMD, *args_pnpm], **kwargs)  # noqa: S603
    proc._log_fh = fh  # type: ignore[attr-defined]  # se cierra al terminar
    log(f"{nombre} lanzado (PID {proc.pid}, log {archivo_log.name}).")
    return proc


def esperar_http(nombre: str, url: str, espera_max: int) -> bool:
    log(f"Esperando {nombre} en {url} (max {espera_max}s)...")
    inicio = time.time()
    while time.time() - inicio < espera_max:
        try:
            with urllib.request.urlopen(url, timeout=5) as r:  # noqa: S310
                if r.status < 500:
                    log(f"{nombre} responde (HTTP {r.status}).")
                    return True
        except Exception:  # noqa: BLE001
            pass
        time.sleep(2)
    log(f"ERROR: {nombre} no respondio en {espera_max}s. Revisa .koda-logs.")
    return False


def detener(procs: list[subprocess.Popen]) -> None:
    for p in procs:
        if p.poll() is None:
            log(f"Deteniendo PID {p.pid}...")
            try:
                if os.name == "nt":
                    p.send_signal(signal.CTRL_BREAK_EVENT)
                    time.sleep(2)
                p.terminate()
            except Exception:  # noqa: BLE001
                pass
    time.sleep(2)
    for p in procs:
        if p.poll() is None:
            p.kill()
        fh = getattr(p, "_log_fh", None)
        if fh:
            fh.close()


def main() -> int:
    ap = argparse.ArgumentParser(description="Koda: arranca API + Web.")
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--solo-api", action="store_true")
    g.add_argument("--solo-web", action="store_true")
    ap.add_argument("--sin-navegador", action="store_true")
    ap.add_argument("--forzar", action="store_true",
                    help="Mata procesos en puertos 3000/4000 antes de arrancar.")
    ap.add_argument("--produccion", action="store_true",
                    help="Usa build+start en vez de dev.")
    ap.add_argument("--espera", type=int, default=120, help="Segundos max. de health-check.")
    args = ap.parse_args()

    con_api = not args.solo_web
    con_web = not args.solo_api
    modo = "produccion" if args.produccion else "desarrollo"
    log(f"Koda ({modo}) | Repo: {REPO}")

    if not verificar_previos():
        return 1

    for nombre, puerto in PUERTOS.items():
        quiere = (nombre == "api" and con_api) or (nombre == "web" and con_web)
        if quiere and puerto_ocupado(puerto):
            if args.forzar:
                liberar_puerto(puerto)
                time.sleep(2)
            if puerto_ocupado(puerto):
                log(f"ERROR: puerto {puerto} ({nombre}) ocupado. "
                    "Cierra la otra sesion o usa --forzar.")
                return 1

    if args.produccion:
        log("Compilando para produccion (`pnpm build`)...")
        if subprocess.run([PNPM_CMD, "build"], cwd=REPO).returncode != 0:
            log("ERROR: fallo pnpm build.")
            return 1

    procs: list[subprocess.Popen] = []
    try:
        if con_api:
            cmd = ["--filter", "api", "start:prod" if args.produccion else "dev"]
            procs.append(lanzar("API :4000", cmd, LOGS / "api.log"))
        if con_web:
            cmd = ["--filter", "web", "start" if args.produccion else "dev"]
            procs.append(lanzar("Web :3000", cmd, LOGS / "web.log"))

        ok = True
        if con_api:
            ok = esperar_http("API", API_URL, args.espera) and ok
        if con_web:
            ok = esperar_http("Web", WEB_URL, args.espera) and ok
        if not ok:
            detener(procs)
            return 1

        print("\n" + "=" * 56)
        if con_web:
            print(f"  Web:    {WEB_URL}")
        if con_api:
            print(f"  API:    {API_URL}")
            print("  Swagger: http://localhost:4000/api/docs")
        print("  Pulsa Ctrl+C para detener todo.")
        print("=" * 56 + "\n")

        if con_web and not args.sin_navegador:
            try:
                webbrowser.open(WEB_URL)
            except Exception:  # noqa: BLE001
                pass

        while True:  # vigilar hijos; si uno muere, avisar y salir
            time.sleep(2)
            for p in procs:
                if p.poll() is not None:
                    log(f"ERROR: un servicio termino (codigo {p.returncode}). Mira .koda-logs.")
                    detener(procs)
                    return 1
    except KeyboardInterrupt:
        print()
        log("Ctrl+C recibido, deteniendo...")
    finally:
        detener(procs)
    log("Detenido. Hasta luego.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
