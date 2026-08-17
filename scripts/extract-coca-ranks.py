from __future__ import annotations

import json
import re
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
LEXICON_PATH = ROOT / "scripts" / "lexicon.mjs"
SOURCE_PATH = ROOT.parent / "COCA词频单词表.xlsx"
OUTPUT_PATH = ROOT / "scripts" / "coca-ranks.json"


def main() -> None:
    lexicon_text = LEXICON_PATH.read_text(encoding="utf-8")
    words = re.findall(r"\{ w: '([^']+)'", lexicon_text)
    table = pd.read_excel(SOURCE_PATH, sheet_name="1 lemmas")
    table["lemma"] = table["lemma"].astype(str).str.lower()

    ranks: dict[str, list[dict[str, int | str]]] = {}
    for word in words:
        matches = table.loc[table["lemma"].eq(word)].sort_values("rank")
        ranks[word] = [
            {
                "rank": int(row["rank"]),
                "pos": str(row["PoS"]),
                "frequency": int(row["Frequency"]),
            }
            for _, row in matches.iterrows()
        ]

    missing = [word for word, entries in ranks.items() if not entries]
    if missing:
        raise ValueError("COCA 词表中缺少这些词：" + ", ".join(missing))

    OUTPUT_PATH.write_text(
        json.dumps(ranks, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        json.dumps(
            {
                "output": str(OUTPUT_PATH),
                "words": len(words),
                "work": ranks.get("work"),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
