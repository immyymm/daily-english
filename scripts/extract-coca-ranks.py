from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
LEXICON_PATH = ROOT / "scripts" / "lexicon.mjs"
PRIORITY_DATA_PATH = ROOT / "scripts" / "verb-priority-data.json"
SOURCE_PATH = ROOT.parent / "COCA词频单词表.xlsx"
OUTPUT_PATH = ROOT / "scripts" / "coca-ranks.json"
AUDIT_PATH = ROOT / "content" / "coca-audit.json"

PRIMARY_GROUPS = {
    "v": ("verb", "动词", "v"),
    "n": ("noun", "名词", "n"),
    "adj": ("adjective", "形容词", "j"),
    "adv": ("adverb", "副词", "r"),
}
GROUP_ORDER = ["verb", "noun", "adjective", "adverb", "other"]


def primary_group(part_of_speech: str) -> tuple[str, str, str | None, str]:
    primary = part_of_speech.split("/")[0].strip().replace(".", "").lower()
    group, label, coca_pos = PRIMARY_GROUPS.get(primary, ("other", "其他词性", None))
    return group, label, coca_pos, primary


def main() -> None:
    lexicon_text = LEXICON_PATH.read_text(encoding="utf-8")
    legacy_entries = re.findall(r"\{ w: '([^']+)', p: '([^']+)'", lexicon_text)
    preserved_verbs = [entry for entry in legacy_entries if primary_group(entry[1])[0] == "verb"]
    priority_data = json.loads(PRIORITY_DATA_PATH.read_text(encoding="utf-8"))["entries"]
    priority_verbs = [(word, "v.") for word in priority_data]
    entries = [*preserved_verbs, *priority_verbs]
    if len(preserved_verbs) != 54 or len(priority_verbs) != 96 or len({word for word, _ in entries}) != 150:
        raise ValueError("动词优先目录必须由 54 张既有动词卡和 96 张替换动词卡组成，且共 150 个唯一单词。")
    words = [word for word, _ in entries]
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

    ordered: list[dict[str, int | str]] = []
    for word, part_of_speech in entries:
        group, label, coca_pos, primary = primary_group(part_of_speech)
        matching_primary = [entry for entry in ranks[word] if entry["pos"] == coca_pos]
        primary_rank = int(
            matching_primary[0]["rank"] if matching_primary
            else min(entry["rank"] for entry in ranks[word])
        )
        ordered.append({
            "word": word,
            "cardId": re.sub(r"[^a-z0-9]+", "-", f"{word}-{primary}").strip("-"),
            "partOfSpeech": part_of_speech,
            "primaryGroup": group,
            "primaryGroupLabel": label,
            "primaryCocaRank": primary_rank,
        })
    ordered.sort(key=lambda entry: (
        GROUP_ORDER.index(str(entry["primaryGroup"])),
        int(entry["primaryCocaRank"]),
        str(entry["word"]),
    ))
    for sequence, entry in enumerate(ordered, start=1):
        entry["sequence"] = sequence

    audit = {
        "auditVersion": "2026.09.07.2",
        "auditedAt": "2026-09-07",
        "source": "COCA词频单词表.xlsx",
        "sheet": "1 lemmas",
        "workbook": {
            "rows": int(len(table)),
            "uniqueLemmas": int(table["lemma"].nunique()),
            "rankMinimum": int(table["rank"].min()),
            "rankMaximum": int(table["rank"].max()),
            "partOfSpeechRows": {
                str(key): int(value)
                for key, value in sorted(Counter(table["PoS"].astype(str)).items())
            },
        },
        "selection": {
            "selectedCards": len(entries),
            "selectedUniqueWords": len(set(words)),
            "missingWords": missing,
            "allSelectedWordsFound": not missing,
            "stableCardIds": True,
            "preservedExistingVerbCards": len(preserved_verbs),
            "replacedNonVerbCards": len(priority_verbs),
            "primaryPartOfSpeechPolicy": "preserve existing primary-verb cards, replace every non-verb slot with the highest-ranked remaining COCA verb, then order all cards by COCA verb rank",
            "learningOrder": ["动词（按 COCA 动词词频升序）"],
            "primaryGroupCounts": dict(Counter(str(entry["primaryGroup"]) for entry in ordered)),
        },
        "orderedCards": ordered,
    }
    AUDIT_PATH.write_text(
        json.dumps(audit, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        json.dumps(
            {
                "output": str(OUTPUT_PATH),
                "audit": str(AUDIT_PATH),
                "words": len(words),
                "work": ranks.get("work"),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
