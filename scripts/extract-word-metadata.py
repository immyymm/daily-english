from __future__ import annotations

import json
import re
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
LEXICON_PATH = ROOT / "scripts" / "lexicon.mjs"
OVERRIDES_PATH = ROOT / "scripts" / "content-overrides.mjs"
OUTPUT_PATH = ROOT / "scripts" / "word-metadata.json"
DEFAULT_SOURCE = ROOT.parent / ".tmp-ecdict-unpacked-20260907" / "ECDICT-master" / "ecdict.csv"

POS_MARKERS = [
    (r"\b(?:vt|vi|v)\.", "v."),
    (r"\bn\.", "n."),
    (r"\b(?:a|adj)\.", "adj."),
    (r"\b(?:ad|adv)\.", "adv."),
    (r"\bprep\.", "prep."),
    (r"\bconj\.", "conj."),
    (r"\bpron\.", "pron."),
    (r"\bnum\.", "num."),
    (r"\binterj\.", "interj."),
]

MANUAL_METADATA = {
    "bad guidance": {"partOfSpeech": "n. phrase", "chinese": "错误或不当的指导"},
    "be independent": {"partOfSpeech": "v. phrase", "chinese": "独立；不依赖他人"},
    "chosen": {"partOfSpeech": "adj.", "chinese": "选定的；精选的"},
    "data": {"partOfSpeech": "n.", "chinese": "数据；资料"},
    "forwarding": {"partOfSpeech": "n.", "chinese": "转发；转寄"},
    "in a complex way": {"partOfSpeech": "adv. phrase", "chinese": "以复杂的方式"},
    "increasing": {"partOfSpeech": "adj.", "chinese": "不断增加的"},
    "lack of direction": {"partOfSpeech": "n. phrase", "chinese": "缺乏方向；没有明确目标"},
    "lack of value": {"partOfSpeech": "n. phrase", "chinese": "缺乏价值"},
    "leave unchanged": {"partOfSpeech": "v. phrase", "chinese": "保持不变；不作修改"},
    "no longer": {"partOfSpeech": "adv. phrase", "chinese": "不再"},
    "not yet": {"partOfSpeech": "adv. phrase", "chinese": "尚未；还没有"},
    "possibly not": {"partOfSpeech": "adv. phrase", "chinese": "可能不会；也许不"},
    "reachable": {"partOfSpeech": "adj.", "chinese": "可到达的；可联系到的"},
    "sharing": {"partOfSpeech": "n.", "chinese": "分享；共享"},
}


def needed_words() -> list[str]:
    lexicon = LEXICON_PATH.read_text(encoding="utf-8")
    overrides = OVERRIDES_PATH.read_text(encoding="utf-8")
    family_block = overrides.split("export const families =", 1)[1].split("export const confusables =", 1)[0]
    families = re.findall(r"'([A-Za-z][A-Za-z -]*)'", family_block)
    relations = re.findall(r"(?:syn|ant): '([^']+)'", lexicon)
    return sorted(set(word.lower() for word in [*families, *relations]))


def normalize_pos(translation: str) -> str:
    translation = translation.replace("\\n", "\n")
    positions: list[str] = []
    for pattern, label in POS_MARKERS:
        if re.search(pattern, translation, flags=re.IGNORECASE) and label not in positions:
            positions.append(label)
    return " / ".join(positions)


def normalize_chinese(translation: str) -> str:
    senses: list[str] = []
    for line in translation.replace("\\n", "\n").splitlines():
        line = line.strip()
        if not line or line.startswith("["):
            continue
        line = re.sub(r"^(?:vt|vi|v|n|a|adj|ad|adv|prep|conj|pron|num|interj)\.\s*", "", line, flags=re.IGNORECASE)
        for sense in re.split(r"[,;，；]", line):
            cleaned = re.sub(r"\([^)]*\)", "", sense).strip()
            if cleaned and cleaned not in senses:
                senses.append(cleaned)
            if len(senses) >= 4:
                return "；".join(senses)
    return "；".join(senses)


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("source", nargs="?", type=Path, default=DEFAULT_SOURCE)
    args = parser.parse_args()

    required = needed_words()
    table = pd.read_csv(args.source, usecols=["word", "translation"], keep_default_na=False)
    table["key"] = table["word"].astype(str).str.lower()
    selected = table.loc[table["key"].isin(required)].drop_duplicates("key", keep="first")

    metadata: dict[str, dict[str, str]] = {}
    for row in selected.itertuples(index=False):
        chinese = normalize_chinese(str(row.translation))
        part_of_speech = normalize_pos(str(row.translation))
        if chinese and part_of_speech:
            metadata[str(row.key)] = {
                "partOfSpeech": part_of_speech,
                "chinese": chinese,
            }

    metadata.update(MANUAL_METADATA)

    missing = [word for word in required if word not in metadata]
    result = {
        "source": "ECDICT (MIT), build-time extraction only",
        "sourceUrl": "https://github.com/skywind3000/ECDICT",
        "generatedAt": "2026-09-07",
        "entries": metadata,
        "missing": missing,
    }
    OUTPUT_PATH.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"required": len(required), "extracted": len(metadata), "missing": len(missing)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
