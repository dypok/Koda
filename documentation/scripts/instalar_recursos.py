#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Koda - Instalador de recursos (Windows + Linux)
================================================
Instala y verifica TODO lo necesario para arrancar el programa:

  1. Python >= 3.9 (el propio instalador corre aqui)
  2. Git
  3. Node.js >= 20 (LTS)
  4. pnpm >= 9  (se fija pnpm 9.15.9: el binario Rust de pnpm 12 falla
     en Windows sin VC++ Redist con EXIT:-1073741515)
  5. PowerShell 7+ (solo Windows, lo exige el script oficial de pnpm)
  6. Dependencias del monorepo (`pnpm install`)
  7. Compilacion de `@koda/types` (`packages/types/dist`)
  8. Archivos `.env` generados desde los `.env.example`
  9. Puertos 3000 (web) y 4000 (api) libres

Uso:
    python instalar_recursos.py                 # instalacion completa
    python instalar_recursos.py --solo-verificar # solo diagnostico, no cambia nada
    python instalar_recursos.py --sin-sistema    # no usa winget/apt (solo pnpm/env)
    python instalar_recursos.py --omitir-pnpm    # salta el `pnpm install`

Solo usa la libreria estandar. No necesita nada instalado previamente.
"""

from __future__ import annotations

import argparse
import os
import platform
import re
import shutil
import subprocess
import sys
from pathlib import Path

# ----------------------------------------------------------------------------
# Constantes
# ----------------------------------------------------------------------------

MIN_PYTHON = (3, 9)
MIN_NODE = (20, 0, 0)
MIN_PNPM = (9, 0, 0)
PINNED_PNPM = "9.15.9"  # version JS estable y probada en este repo
PUERTOS = {"web": 3000, "api": 4000}

REPO_ROOT = Path(__file__).resolve().parent.parent
# En Windows, `pnpm` a secas resuelve al shim .ps1 (no ejecutable via
# CreateProcess); hay que llamar a pnpm.cmd / npm.cmd explicitamente.
PNPM_CMD = "pnpm.cmd" if os.name == "nt" else "pnpm"
NPM_CMD = "npm.cmd" if os.name == "nt" else "npm"
ENV_PLANTILLAS = [
    (Path(".env"), Path(".env.example")),
    (Path("apps/api/.env"), Path("apps/api/.env.example")),
    (Path("apps/web/.env.local"), Path("apps/web/.env.example")),
]

OK = "[OK]    "
FALTA = "[FALTA] "
INFO = "[INFO]  "
ERROR = "[ERROR] "
PASO = "\n==>"


def es_windows() -> bool:
    return os.name == "nt" or platform.system() == "Windows"


def ejecutar(cmd: list[str], timeout: int = 60) -> tuple[int, str]:
    """Ejecuta un comando y devuelve (codigo, salida recortada). Nunca lanza."""
    try:
        proc = subprocess.run(
            cmd, capture_output=True, text=True, timeout=timeout
        )
        salida = (proc.stdout or "") + (proc.stderr or "")
        return proc.returncode, salida.strip()[:2000]
    except FileNotFoundError:
        return 127, "comando no encontrado"
    except subprocess.TimeoutExpired:
        return 124, "tiempo de espera agotado"
    except Exception as exc:  # noqa: BLE001
        return 1, str(exc)[:500]


def version_a_tupla(texto: str) -> tuple[int, ...]:
    nums = re.findall(r"\d+", texto or "")
    return tuple(int(n) for n in nums[:3]) or (0,)


def version_ok(actual: tuple[int, ...], minima: tuple[int, ...]) -> bool:
    a = actual + (0,) * (len(minima) - len(actual))
    return a >= minima


def fmt_ver(t: tuple[int, ...]) -> str:
    return ".".join(str(x) for x in t) if t else "desconocida"


# ----------------------------------------------------------------------------
# Verificaciones individuales (devuelven True si esta bien)
# ----------------------------------------------------------------------------

def verificar_python() -> bool:
    v = sys.version_info[:3]
    if version_ok(v, MIN_PYTHON):
        print(f"{OK} Python {fmt_ver(v)} (>= {fmt_ver(MIN_PYTHON)})")
        return True
    print(f"{FALTA} Python {fmt_ver(v)} < {fmt_ver(MIN_PYTHON)}. Actualiza Python.")
    return False


def verificar_git() -> bool:
    code, out = ejecutar(["git", "--version"])
    if code == 0:
        print(f"{OK} Git: {out.splitlines()[0] if out else 'instalado'}")
        return True
    print(f"{FALTA} Git no encontrado.")
    return False


def verificar_node() -> bool:
    code, out = ejecutar(["node", "-v"])
    if code == 0:
        v = version_a_tupla(out)
        if version_ok(v, MIN_NODE):
            print(f"{OK} Node.js {fmt_ver(v)} (>= {fmt_ver(MIN_NODE)})")
            return True
        print(f"{FALTA} Node.js {fmt_ver(v)} < {fmt_ver(MIN_NODE)}. Actualiza a LTS.")
        return False
    print(f"{FALTA} Node.js no encontrado.")
    return False


def verificar_pnpm() -> bool:
    code, out = ejecutar([PNPM_CMD, "--version"])
    if code == 0 and out:
        primera = out.strip().splitlines()[0].strip("v")
        v = version_a_tupla(primera)
        if version_ok(v, MIN_PNPM):
            print(f"{OK} pnpm {fmt_ver(v)} (>= {fmt_ver(MIN_PNPM)})")
            return True
        print(f"{FALTA} pnpm {fmt_ver(v)} < {fmt_ver(MIN_PNPM)}.")
        return False
    print(f"{FALTA} pnpm no responde o no existe.")
    return False


def verificar_pwsh() -> bool:
    """Solo relevante en Windows: pnpm y sus scripts exigen PS 7+."""
    if not es_windows():
        print(f"{OK} PowerShell 7: no aplica en Linux.")
        return True
    for exe in ("pwsh", "powershell"):
        code, out = ejecutar([exe, "-NoProfile", "-Command", "$PSVersionTable.PSVersion.Major"])
        if code == 0 and out.strip().isdigit() and int(out.strip()) >= 7:
            print(f"{OK} PowerShell {out.strip()} ({exe})")
            return True
    print(f"{FALTA} PowerShell 7+ no encontrado (hay 5.1 por defecto).")
    return False


def verificar_repo() -> bool:
    ok = True
    for f in ("pnpm-workspace.yaml", "package.json", "apps/web/package.json",
              "apps/api/package.json", "packages/types/package.json"):
        if (REPO_ROOT / f).exists():
            print(f"{OK} {f}")
        else:
            print(f"{ERROR} Falta {f}. ¿Estás en la raíz del repo?")
            ok = False
    return ok


def verificar_puertos() -> bool:
    import socket
    ok = True
    for nombre, puerto in PUERTOS.items():
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1)
            ocupado = s.connect_ex(("127.0.0.1", puerto)) == 0
        if ocupado:
            print(f"{FALTA} Puerto {puerto} ({nombre}) ocupado.")
            ok = False
        else:
            print(f"{OK} Puerto {puerto} ({nombre}) libre.")
    return ok


# ----------------------------------------------------------------------------
# Instalacion por sistema operativo
# ----------------------------------------------------------------------------

def instalar_windows(solo_verificar: bool) -> None:
    print(f"{PASO} Windows: instalando recursos de sistema")
    if solo_verificar:
        print(f"{INFO} Modo solo-verificar: no se instala nada.")
        return
    if not shutil.which("winget"):
        print(f"{ERROR} winget no disponible. Instala manualmente:")
        print("   Node LTS: https://nodejs.org  |  PS7: https://aka.ms/powershell-release?tag=stable")
        return
    if not shutil.which("node"):
        print(f"{INFO} Instalando Node.js LTS con winget...")
        code, out = ejecutar(["winget", "install", "--id", "OpenJS.NodeJS.LTS",
                              "--source", "winget", "--accept-source-agreements",
                              "--accept-package-agreements"], timeout=600)
        print(f"   -> codigo {code}. {out[-300:] if out else ''}")
    code, out = ejecutar(["pwsh", "-NoProfile", "-Command", "1"])
    if code != 0:
        print(f"{INFO} Instalando PowerShell 7 con winget...")
        code, out = ejecutar(["winget", "install", "--id", "Microsoft.PowerShell",
                              "--source", "winget", "--accept-source-agreements",
                              "--accept-package-agreements"], timeout=600)
        print(f"   -> codigo {code}. Cierra y reabre la terminal tras instalar PS7.")
    else:
        print(f"{OK} PowerShell 7 ya disponible.")


def gestor_linux() -> str | None:
    for g in ("apt", "apt-get", "dnf", "pacman", "zypper"):
        if shutil.which(g):
            return g
    return None


def instalar_linux(solo_verificar: bool) -> None:
    print(f"{PASO} Linux: instalando recursos de sistema")
    if solo_verificar:
        print(f"{INFO} Modo solo-verificar: no se instala nada.")
        return
    gestor = gestor_linux()
    print(f"{INFO} Gestor detectado: {gestor or 'ninguno'}")
    if not shutil.which("node"):
        print(f"{FALTA} Node.js no encontrado. Instalalo segun tu distro:")
        print("   Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs")
        print("   Fedora:        sudo dnf install -y nodejs")
        print("   Arch:          sudo pacman -S --needed nodejs npm")
    else:
        print(f"{OK} Node.js presente.")
    if not shutil.which("git") and gestor in ("apt", "apt-get"):
        print(f"{INFO} Intentando instalar git con {gestor}...")
        ejecutar(["sudo", gestor, "update"], timeout=300)


def instalar_pnpm(solo_verificar: bool) -> bool:
    print(f"{PASO} pnpm: verificando/instalando (version fijada {PINNED_PNPM})")
    if verificar_pnpm():
        return True
    if solo_verificar:
        return False
    print(f"{INFO} Instalando pnpm@{PINNED_PNPM} con npm...")
    code, out = ejecutar([NPM_CMD, "install", "-g", f"pnpm@{PINNED_PNPM}", "--no-fund"], timeout=300)
    print(f"   -> codigo {code}. {out[-300:] if out else ''}")
    if verificar_pnpm():
        return True
    print(f"{INFO} Probando con corepack como alternativa...")
    ejecutar(["corepack", "enable"], timeout=60)
    ejecutar(["corepack", "prepare", f"pnpm@{PINNED_PNPM}", "--activate"], timeout=300)
    return verificar_pnpm()


# ----------------------------------------------------------------------------
# Recursos del proyecto (pnpm install, build, .env)
# ----------------------------------------------------------------------------

def instalar_dependencias(omitir_pnpm: bool) -> bool:
    print(f"{PASO} Dependencias del monorepo")
    if omitir_pnpm:
        print(f"{INFO} Omitido por --omitir-pnpm.")
        return True
    if (REPO_ROOT / "node_modules").exists():
        print(f"{OK} node_modules ya existe (se revalidara).")
    print(f"{INFO} Ejecutando `pnpm install` (puede tardar 1-3 min)...")
    try:
        proc = subprocess.run([PNPM_CMD, "install"], cwd=REPO_ROOT, timeout=900)
        if proc.returncode == 0:
            print(f"{OK} pnpm install completo.")
            return True
        print(f"{ERROR} pnpm install fallo con codigo {proc.returncode}.")
        return False
    except subprocess.TimeoutExpired:
        print(f"{ERROR} pnpm install tardo mas de 15 min.")
        return False


def compilar_types() -> bool:
    print(f"{PASO} Compilando @koda/types")
    dist = REPO_ROOT / "packages/types/dist"
    if dist.exists() and any(dist.iterdir()):
        print(f"{OK} packages/types/dist ya compilado.")
        return True
    code, out = ejecutar([PNPM_CMD, "--filter", "@koda/types", "build"], timeout=300)
    if code == 0 and dist.exists():
        print(f"{OK} @koda/types compilado.")
        return True
    print(f"{ERROR} Fallo la compilacion. Salida:\n{out[-800:]}")
    return False


def generar_env() -> bool:
    print(f"{PASO} Archivos .env")
    ok = True
    for destino_rel, plantilla_rel in ENV_PLANTILLAS:
        destino = REPO_ROOT / destino_rel
        plantilla = REPO_ROOT / plantilla_rel
        if destino.exists():
            print(f"{OK} {destino_rel} ya existe.")
            continue
        if not plantilla.exists():
            print(f"{ERROR} Falta plantilla {plantilla_rel}.")
            ok = False
            continue
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(plantilla.read_text(encoding="utf-8"), encoding="utf-8")
        print(f"{OK} {destino_rel} creado desde {plantilla_rel} (valores de desarrollo).")
    return ok


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser(description="Koda: instala todos los recursos (Windows/Linux).")
    ap.add_argument("--solo-verificar", action="store_true", help="Solo diagnostico, no instala nada.")
    ap.add_argument("--sin-sistema", action="store_true", help="No toca winget/apt, solo pnpm/env.")
    ap.add_argument("--omitir-pnpm", action="store_true", help="Salta el `pnpm install`.")
    args = ap.parse_args()

    print("=" * 64)
    print("Koda - Instalador de recursos")
    print(f"Sistema: {platform.system()} {platform.release()} | Repo: {REPO_ROOT}")
    print("=" * 64)

    fallos = 0
    sistema = platform.system()
    print(f"{PASO} Paso 0/7: Python y repositorio")
    fallos += 0 if verificar_python() else 1
    fallos += 0 if verificar_repo() else 1

    if not args.sin_sistema:
        if es_windows():
            instalar_windows(args.solo_verificar)
        elif sistema == "Linux":
            instalar_linux(args.solo_verificar)
        else:
            print(f"{INFO} SO no contemplado ({sistema}): instala Node>=20 manualmente.")

    print(f"{PASO} Paso 1/7: herramientas base")
    fallos += 0 if verificar_git() else 1
    fallos += 0 if verificar_node() else 1
    fallos += 0 if verificar_pwsh() else (0 if not es_windows() else 1)

    print(f"{PASO} Paso 2/7: pnpm")
    if not instalar_pnpm(args.solo_verificar):
        fallos += 1

    ok_proyecto = True
    if not args.solo_verificar:
        print(f"{PASO} Paso 3/7..6/7: proyecto")
        ok_proyecto = instalar_dependencias(args.omitir_pnpm) and ok_proyecto
        ok_proyecto = compilar_types() and ok_proyecto
        ok_proyecto = generar_env() and ok_proyecto
        if not ok_proyecto:
            fallos += 1
    else:
        print(f"{INFO} Modo solo-verificar: se saltan pnpm install / build / .env.")

    print(f"{PASO} Paso 7/7: puertos")
    verificar_puertos()  # informativo: pueden estar ocupados por una sesion anterior

    print("\n" + "=" * 64)
    if fallos == 0 and (args.solo_verificar or ok_proyecto):
        print("TODO LISTO. Arranca con:  python iniciar_koda.py")
    else:
        print(f"Hay {fallos} punto(s) a corregir (ver [FALTA]/[ERROR] arriba).")
        print("Corrige, reabre la terminal y repite:  python instalar_recursos.py")
    print("=" * 64)
    return 0 if fallos == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
