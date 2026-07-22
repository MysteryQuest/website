#!/usr/bin/env python3
"""Create an offline JSON snapshot from the public D1-backed API."""
import json, urllib.request, os

EVENTS_URL = "https://unverified-file-privacy-api.nullrecords.workers.dev/api/v1/events"
OUT_PATH  = os.path.join(os.path.dirname(__file__), "js", "mysteries.json")

print("Downloading from the public events API...")
request = urllib.request.Request(EVENTS_URL, headers={"Accept": "application/json"})
with urllib.request.urlopen(request) as response:
    payload = json.load(response)
rows = payload["events"]
print(f"  {len(rows)} rows")

with open(OUT_PATH, "w") as f:
    json.dump(rows, f, indent=2)
print(f"Saved to {OUT_PATH}")
