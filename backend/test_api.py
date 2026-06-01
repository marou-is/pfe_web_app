"""
test_api.py
-----------
Run this after starting the server to confirm everything works.

Usage
-----
    python test_api.py
    python test_api.py --url http://localhost:8888   # custom host
"""

import argparse
import json
import sys
import urllib.request
import urllib.error

BASE = "http://localhost:8888"


def post(path: str, payload: dict) -> dict:
    data = json.dumps(payload).encode()
    req  = urllib.request.Request(
        BASE + path,
        data    = data,
        headers = {"Content-Type": "application/json"},
        method  = "POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())


def get(path: str) -> dict:
    with urllib.request.urlopen(BASE + path, timeout=10) as resp:
        return json.loads(resp.read())


def hr(title: str):
    print(f"\n{'─'*60}")
    print(f"  {title}")
    print('─'*60)


AI_TEXT = (
    "Large language models have demonstrated remarkable capabilities "
    "across a wide range of natural language processing tasks. "
    "These models leverage transformer architectures to capture "
    "long-range dependencies in text, enabling nuanced understanding "
    "and generation of human-like prose."
)

HUMAN_TEXT = (
    "I honestly had no idea what to cook last night, so I just threw "
    "together whatever was in the fridge. Ended up being surprisingly "
    "good — some leftover chicken, half an onion, and a tin of tomatoes. "
    "Not exactly a recipe, but it worked."
)

ARTICLE_TEXT = AI_TEXT + " " + HUMAN_TEXT * 2


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://localhost:8888")
    args = parser.parse_args()
    global BASE
    BASE = args.url.rstrip("/")

    # ── Health check ──────────────────────────────────────────────────────
    hr("GET /health")
    try:
        h = get("/health")
        print(json.dumps(h, indent=2))
        assert h["model_ready"], "Model is NOT ready!"
    except urllib.error.URLError as e:
        print(f"  ✗  Cannot reach {BASE}  →  {e}")
        print("     Is the server running?  uvicorn main:app --reload")
        sys.exit(1)

    # ── Model info ────────────────────────────────────────────────────────
    hr("GET /model/info")
    print(json.dumps(get("/model/info"), indent=2))

    # ── Paragraph — AI text ───────────────────────────────────────────────
    hr("POST /predict  (paragraph, AI text)")
    r = post("/predict", {"text": AI_TEXT, "mode": "paragraph"})
    print(json.dumps({k: v for k, v in r.items() if k != "sentence_scores"}, indent=2))
    print(f"  → Verdict: {r['label']}  (ai_prob={r['ai_prob']:.2%})")

    # ── Paragraph — human text ────────────────────────────────────────────
    hr("POST /predict  (paragraph, human text)")
    r = post("/predict", {"text": HUMAN_TEXT, "mode": "paragraph"})
    print(json.dumps({k: v for k, v in r.items() if k != "sentence_scores"}, indent=2))
    print(f"  → Verdict: {r['label']}  (ai_prob={r['ai_prob']:.2%})")

    # ── Article mode ──────────────────────────────────────────────────────
    hr("POST /predict  (article mode)")
    r = post("/predict", {"text": ARTICLE_TEXT, "mode": "article"})
    top = {k: v for k, v in r.items() if k != "sentence_scores"}
    print(json.dumps(top, indent=2))
    print(f"\n  Per-sentence breakdown ({len(r['sentence_scores'])} sentences):")
    for i, s in enumerate(r["sentence_scores"], 1):
        bar = "█" * int(s["ai_prob"] * 20)
        print(f"  [{i:02d}] {s['label']:5s}  {s['ai_prob']:.2%}  {bar}")

    # ── Batch ─────────────────────────────────────────────────────────────
    hr("POST /predict/batch  (2 texts)")
    r = post("/predict/batch", {"texts": [AI_TEXT, HUMAN_TEXT], "mode": "paragraph"})
    for i, res in enumerate(r["results"], 1):
        print(f"  [{i}] {res['label']}  ai_prob={res['ai_prob']:.2%}  ({res['latency_ms']:.0f} ms)")
    print(f"\n  Total batch time: {r['total_ms']:.0f} ms")

    print("\n✓  All tests passed.\n")


if __name__ == "__main__":
    main()