"""OCR all downloaded yundar detail images to read baked-in flavor labels."""
import json
import glob
import os
import sys

import easyocr

WORK = os.path.join(os.path.dirname(__file__), "yundar_imgs")
OUT = os.path.join(os.path.dirname(__file__), "ocr_results.json")

reader = easyocr.Reader(["ko", "en"], gpu=False, verbose=False)

files = sorted(glob.glob(os.path.join(WORK, "*.jpg")))
results = {}
for i, f in enumerate(files, 1):
    idx = os.path.splitext(os.path.basename(f))[0]
    try:
        lines = reader.readtext(f, detail=0, paragraph=True)
    except Exception as exc:  # noqa: BLE001
        lines = []
        print(f"[{idx}] ERROR {exc}", flush=True)
    text = " ".join(lines)
    results[idx] = {"file": os.path.basename(f), "text": text, "lines": lines}
    print(f"[{idx}] {text[:70]}", flush=True)

json.dump(results, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nSAVED {len(results)} -> {OUT}", flush=True)
