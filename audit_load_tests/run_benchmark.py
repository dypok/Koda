import subprocess
import os
import sys
import time
import glob
import csv

RESULTS_DIR = os.path.join(os.path.dirname(__file__), "results")
os.makedirs(RESULTS_DIR, exist_ok=True)

STAGES = [
    {"users": 10, "spawn_rate": 2, "run_time": "15s", "label": "Baseline (10 VUs)"},
    {"users": 50, "spawn_rate": 10, "run_time": "20s", "label": "Normal Pilot (50 VUs)"},
    {"users": 100, "spawn_rate": 20, "run_time": "25s", "label": "Peak Expected (100 VUs)"},
    {"users": 250, "spawn_rate": 50, "run_time": "30s", "label": "Stress High (250 VUs)"},
    {"users": 500, "spawn_rate": 100, "run_time": "30s", "label": "Breaking Point (500 VUs)"},
]

def run_stage(host: str, users: int, spawn_rate: int, run_time: str, prefix: str):
    csv_prefix = os.path.join(RESULTS_DIR, f"{prefix}_u{users}")
    locustfile = os.path.join(os.path.dirname(__file__), "locustfile.py")
    
    cmd = [
        "uv", "run", "--with", "locust", "locust",
        "-f", locustfile,
        "--headless",
        "--host", host,
        "-u", str(users),
        "-r", str(spawn_rate),
        "--run-time", run_time,
        "--csv", csv_prefix,
        "--only-summary",
    ]
    
    print(f"\n=======================================================")
    print(f"[LOAD TEST] Ejecutando Benchmark: {users} VUs (Spawn: {spawn_rate}/s, Duración: {run_time})")
    print(f"=======================================================")
    
    start = time.time()
    res = subprocess.run(cmd, capture_output=True, text=True)
    elapsed = time.time() - start
    print(res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
        
    # Leer CSV de resultados generados
    stats_file = f"{csv_prefix}_stats.csv"
    if os.path.exists(stats_file):
        with open(stats_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("Name") == "Aggregated":
                    return {
                        "users": users,
                        "requests": int(row.get("Request Count", 0)),
                        "failures": int(row.get("Failure Count", 0)),
                        "rps": float(row.get("Requests/s", 0.0)),
                        "p50": float(row.get("50%", 0.0)),
                        "p95": float(row.get("95%", 0.0)),
                        "p99": float(row.get("99%", 0.0)),
                        "avg_latency": float(row.get("Average Response Time", 0.0)),
                    }
    return None

def main():
    host = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4000"
    prefix = sys.argv[2] if len(sys.argv) > 2 else "baseline"
    
    summary = []
    for stage in STAGES:
        res = run_stage(host, stage["users"], stage["spawn_rate"], stage["run_time"], prefix)
        if res:
            res["label"] = stage["label"]
            summary.append(res)
        time.sleep(2)
        
    print("\n\n" + "=" * 80)
    print(f"[SUMMARY] RESUMEN EMPÍRICO DE CAPACIDAD ({prefix.upper()})")
    print("=" * 80)
    print(f"{'Escenario':<25} | {'VUs':<5} | {'RPS':<8} | {'P50 (ms)':<9} | {'P95 (ms)':<9} | {'P99 (ms)':<9} | {'Error %':<8}")
    print("-" * 80)
    for s in summary:
        err_pct = (s['failures'] / s['requests'] * 100) if s['requests'] > 0 else 0
        print(f"{s['label']:<25} | {s['users']:<5} | {s['rps']:<8.1f} | {s['p50']:<9.1f} | {s['p95']:<9.1f} | {s['p99']:<9.1f} | {err_pct:<8.2f}%")
    print("=" * 80)

if __name__ == "__main__":
    main()
