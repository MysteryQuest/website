#!/usr/bin/env python3
"""
Refresh mysteries.json from Google Sheets.
Run this whenever the sheet is updated:
    python3 website/refresh-data.py
"""
import csv, json, io, urllib.request, os

SHEET_ID  = "1fJIP4P3Gbm71OKgG_EnIDZ-7nBRoMJOuxvkc2tnC_LQ"
SHEET_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1"
OUT_PATH  = os.path.join(os.path.dirname(__file__), "js", "mysteries.json")

print(f"Downloading from Google Sheets...")
with urllib.request.urlopen(SHEET_URL) as r:
    text = r.read().decode("utf-8")

reader = csv.DictReader(io.StringIO(text))
rows = [row for row in reader]
print(f"  {len(rows)} rows, {len(rows[0])} columns")

with open(OUT_PATH, "w") as f:
    json.dump(rows, f, indent=2)
print(f"Saved to {OUT_PATH}")
