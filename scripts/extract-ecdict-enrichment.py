import csv
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else None

if SOURCE is None or not SOURCE.exists():
    raise SystemExit("Usage: extract-ecdict-enrichment.py <ecdict.csv>")

wordnet = json.loads((ROOT / "scripts" / "wordnet-enrichment.json").read_text(encoding="utf-8"))
cards = json.loads((ROOT / "public" / "data" / "all-cards.json").read_text(encoding="utf-8"))["cards"]

wanted = {card["word"].lower() for card in cards}
for entry in wordnet["entries"].values():
    for field in ("synonyms", "antonyms", "derivatives", "related"):
        wanted.update(item["word"].lower() for item in entry[field])

entries = {}
with SOURCE.open("r", encoding="utf-8", newline="") as handle:
    for row in csv.DictReader(handle):
        word = (row.get("word") or "").strip().lower()
        if word not in wanted or word in entries:
            continue
        entries[word] = {
            "phonetic": (row.get("phonetic") or "").strip(),
            "definition": (row.get("definition") or "").strip(),
            "translation": (row.get("translation") or "").strip(),
            "partOfSpeech": (row.get("pos") or "").strip(),
            "exchange": (row.get("exchange") or "").strip(),
            "collins": (row.get("collins") or "").strip(),
            "oxford": (row.get("oxford") or "").strip(),
            "tags": (row.get("tag") or "").strip(),
            "bncRank": (row.get("bnc") or "").strip(),
            "frequencyRank": (row.get("frq") or "").strip(),
        }

output = {
    "source": "ECDICT (skywind3000/ECDICT)",
    "wanted": len(wanted),
    "matched": len(entries),
    "entries": entries,
}
(ROOT / "scripts" / "ecdict-enrichment.json").write_text(
    json.dumps(output, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
print(f"Extracted {len(entries)} of {len(wanted)} requested ECDICT entries.")
