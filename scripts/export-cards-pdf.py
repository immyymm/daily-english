from __future__ import annotations

import html
import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "data" / "all-cards.json"
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT = OUTPUT_DIR / "每日英语-完整词卡合集.pdf"

PINK = colors.HexColor("#D987A5")
DEEP_PINK = colors.HexColor("#A85575")
LIGHT_PINK = colors.HexColor("#FFF0F5")
PALE_PINK = colors.HexColor("#FFF8FA")
INK = colors.HexColor("#3F3440")
MUTED = colors.HexColor("#776A73")
LINE = colors.HexColor("#F1CFDB")
WHITE = colors.white


def register_fonts() -> tuple[str, str, str]:
    candidates = [
        (Path("C:/Windows/Fonts/msyh.ttc"), Path("C:/Windows/Fonts/msyhbd.ttc")),
        (Path("C:/Windows/Fonts/simhei.ttf"), Path("C:/Windows/Fonts/simhei.ttf")),
        (Path("C:/Windows/Fonts/simsun.ttc"), Path("C:/Windows/Fonts/simhei.ttf")),
    ]
    for regular, bold in candidates:
        if regular.exists() and bold.exists():
            pdfmetrics.registerFont(TTFont("CardRegular", str(regular)))
            pdfmetrics.registerFont(TTFont("CardBold", str(bold)))
            latin_candidates = [
                Path("C:/Windows/Fonts/arial.ttf"),
                Path("C:/Windows/Fonts/calibri.ttf"),
            ]
            for latin in latin_candidates:
                if latin.exists():
                    pdfmetrics.registerFont(TTFont("Phonetic", str(latin)))
                    return "CardRegular", "CardBold", "Phonetic"
            raise FileNotFoundError("未找到支持国际音标的英文字体（Arial 或 Calibri）。")
    raise FileNotFoundError("未找到可用的中文字体（微软雅黑、宋体或黑体）。")


FONT, FONT_BOLD, FONT_PHONETIC = register_fonts()


def esc(value: object) -> str:
    return html.escape(str(value or "")).replace("\n", "<br/>")


def join_items(values: list[str] | None, empty: str = "暂无") -> str:
    cleaned = [str(item).strip() for item in (values or []) if str(item).strip()]
    return " · ".join(cleaned) if cleaned else empty


def ipa(value: object) -> str:
    return f"<font name='{FONT_PHONETIC}'>{esc(value)}</font>"


class CardDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str, **kwargs):
        super().__init__(filename, **kwargs)
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            id="normal",
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
        )
        self.addPageTemplates(PageTemplate(id="cards", frames=[frame], onPage=draw_page))

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph) and flowable.style.name == "WordTitle":
            text = flowable.getPlainText()
            key = f"word-{self.seq.nextf('word')}"
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(text, key, level=0, closed=False)
            self.notify("TOCEntry", (0, text, self.page, key))


def draw_page(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(PALE_PINK)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.roundRect(12 * mm, 12 * mm, width - 24 * mm, height - 24 * mm, 6 * mm, fill=1, stroke=0)
    canvas.setFillColor(PINK)
    canvas.roundRect(12 * mm, height - 20 * mm, width - 24 * mm, 8 * mm, 4 * mm, fill=1, stroke=0)
    canvas.setFont(FONT_BOLD, 8.5)
    canvas.setFillColor(WHITE)
    canvas.drawString(18 * mm, height - 17.2 * mm, "每日英语 · 完整词卡合集")
    canvas.setFont(FONT, 8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - 18 * mm, 16 * mm, f"第 {doc.page} 页")
    canvas.restoreState()


styles = getSampleStyleSheet()
base = ParagraphStyle(
    "CardBody",
    parent=styles["BodyText"],
    fontName=FONT,
    fontSize=9.2,
    leading=14.2,
    textColor=INK,
    spaceAfter=3 * mm,
    wordWrap="CJK",
)
small = ParagraphStyle(
    "CardSmall",
    parent=base,
    fontSize=8.2,
    leading=12.2,
    textColor=MUTED,
    spaceAfter=1.4 * mm,
)
cover_title = ParagraphStyle(
    "CoverTitle",
    parent=base,
    fontName=FONT_BOLD,
    fontSize=28,
    leading=38,
    alignment=TA_CENTER,
    textColor=DEEP_PINK,
    spaceAfter=8 * mm,
)
cover_subtitle = ParagraphStyle(
    "CoverSubtitle",
    parent=base,
    fontSize=12,
    leading=20,
    alignment=TA_CENTER,
    textColor=MUTED,
)
word_title = ParagraphStyle(
    "WordTitle",
    parent=base,
    fontName=FONT_BOLD,
    fontSize=25,
    leading=31,
    textColor=DEEP_PINK,
    spaceBefore=2 * mm,
    spaceAfter=1.5 * mm,
)
word_meta = ParagraphStyle(
    "WordMeta",
    parent=base,
    fontSize=10,
    leading=15,
    textColor=MUTED,
    spaceAfter=5 * mm,
)
section_title = ParagraphStyle(
    "SectionTitle",
    parent=base,
    fontName=FONT_BOLD,
    fontSize=12.5,
    leading=17,
    textColor=DEEP_PINK,
    spaceBefore=4 * mm,
    spaceAfter=2 * mm,
    keepWithNext=True,
)
item_title = ParagraphStyle(
    "ItemTitle",
    parent=base,
    fontName=FONT_BOLD,
    fontSize=9.5,
    leading=14,
    textColor=INK,
    spaceAfter=0.5 * mm,
)
toc_title = ParagraphStyle(
    "TOCTitle",
    parent=cover_title,
    fontSize=22,
    leading=30,
    alignment=TA_LEFT,
)


def P(value: object, style=base) -> Paragraph:
    return Paragraph(esc(value), style)


def rich(value: str, style=base) -> Paragraph:
    return Paragraph(value, style)


def info_table(rows: list[tuple[str, object]]) -> Table:
    data = []
    for label, value in rows:
        data.append([
            Paragraph(f"<b>{esc(label)}</b>", small),
            P(value, base),
        ])
    table = Table(data, colWidths=[34 * mm, 132 * mm], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), LIGHT_PINK),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return table


def section(number: int, title: str) -> Paragraph:
    return rich(f"<font color='#D987A5'>{number:02d}</font>　{esc(title)}", section_title)


def list_block(title: str, items: list[str], empty: str = "暂无需要强记的内容。") -> list:
    flow = [rich(f"<b>{esc(title)}</b>", item_title)]
    if not items:
        flow.append(P(empty, small))
        return flow
    for item in items:
        flow.append(rich(f"<font color='#D987A5'>●</font>　{item}", base))
    return flow


def card_story(card: dict, index: int, total: int) -> list:
    core = card.get("coreMemory", {})
    focus = card.get("studyFocus", {})
    story: list = [
        PageBreak(),
        Paragraph(f"{index:03d} · {esc(card.get('word'))}", word_title),
        rich(
            f"{ipa(card.get('phonetic'))}　·　{esc(card.get('syllables'))}　·　"
            f"{esc(card.get('partOfSpeech'))}　·　{esc(card.get('frequencyBand'))}　·　"
            f"难度：{esc(card.get('difficulty'))}　·　{esc(join_items(card.get('tags')))}",
            word_meta,
        ),
        section(1, "核心记忆表"),
        info_table([
            ("中文核心义", core.get("chinese")),
            ("Simple English", core.get("english")),
            ("核心结构", core.get("structure")),
            ("最直接近义词", core.get("directSynonym")),
            ("最直接反义词", core.get("directAntonym")),
            ("常用派生词", core.get("derivatives")),
            ("核心例句", f"{core.get('example', '')}\n{core.get('exampleChinese', '')}"),
            ("常见错误", core.get("commonError")),
        ]),
        Spacer(1, 3 * mm),
    ]

    story.extend(list_block("学完这张卡，请带走这四点", [
        esc(focus.get("coreMeaning")),
        esc(focus.get("keyCollocation")),
        esc(focus.get("commonMistake")),
        esc(focus.get("mustUseExample")),
    ]))

    story.append(section(2, "词性与常用义项"))
    for meaning in card.get("meanings", []):
        story.append(KeepTogether([
            rich(
                f"<b>{esc(meaning.get('partOfSpeech'))}　{esc(meaning.get('chinese'))}</b><br/>"
                f"{esc(meaning.get('english'))}<br/>"
                f"<font color='#776A73'>{esc(meaning.get('example'))}<br/>{esc(meaning.get('translation'))}</font>",
                base,
            )
        ]))

    story.append(section(3, "语境词组"))
    for group in card.get("contextPhrases", []):
        items = [
            f"<b>{esc(item.get('phrase'))}</b>　{ipa(item.get('phonetic'))}　-　{esc(item.get('chinese'))}"
            for item in group.get("items", [])
        ]
        story.extend(list_block(group.get("category", "语境词组"), items))

    story.append(section(4, "固定搭配与短语"))
    fixed = card.get("fixedPhrases", [])
    if not fixed:
        story.append(P("暂无需要强记的固定搭配。", small))
    for item in fixed:
        story.append(KeepTogether([
            rich(
                f"<b>{esc(item.get('phrase'))}</b>　{ipa(item.get('phonetic'))}　-　{esc(item.get('chinese'))}<br/>"
                f"<font color='#776A73'>{esc(item.get('example'))}<br/>{esc(item.get('translation'))}</font>",
                base,
            )
        ]))

    story.append(section(5, "近义词辨析"))
    synonym_items = [
        f"<b>{esc(item.get('word'))}</b>　{ipa(item.get('phonetic'))}　{esc(item.get('partOfSpeech'))}　"
        f"{esc(item.get('chinese'))}<br/><font color='#776A73'>{esc(item.get('difference'))}</font>"
        for item in card.get("synonyms", [])
    ]
    story.extend(list_block("近义词", synonym_items))

    story.append(section(6, "反义词"))
    antonym_items = [
        f"<b>{esc(item.get('word'))}</b>　{ipa(item.get('phonetic'))}　{esc(item.get('partOfSpeech'))}　"
        f"{esc(item.get('chinese'))}<br/><font color='#776A73'>{esc(item.get('usage'))}</font>"
        for item in card.get("antonyms", [])
    ]
    story.extend(list_block("反义词", antonym_items))

    story.append(section(7, "常用派生词"))
    derivative_items = [
        f"<b>{esc(item.get('word'))}</b>　{ipa(item.get('phonetic'))}　{esc(item.get('partOfSpeech'))}　"
        f"{esc(item.get('chinese'))}<br/><font color='#776A73'>{esc(item.get('note'))}</font>"
        for item in card.get("derivatives", [])
    ]
    story.extend(list_block("派生词", derivative_items, "本词没有需要强记的高频派生词。"))

    story.append(section(8, "易混淆词"))
    confusable_items = [
        f"<b>{esc(item.get('word'))}</b>　{ipa(item.get('phonetic'))}　{esc(item.get('partOfSpeech'))}　"
        f"{esc(item.get('chinese'))}<br/><font color='#776A73'>{esc(item.get('difference'))}</font>"
        for item in card.get("confusables", [])
    ]
    story.extend(list_block("易混淆词", confusable_items, "暂无高频且真正容易混淆的词。"))

    story.append(section(9, "相关词汇组"))
    for group in card.get("relatedVocabulary", []):
        items = [
            f"<b>{esc(item.get('word'))}</b>　{ipa(item.get('phonetic'))}　"
            f"{esc(item.get('partOfSpeech'))}　-　{esc(item.get('chinese'))}"
            for item in group.get("items", [])
        ]
        story.extend(list_block(group.get("category", "相关词汇"), items))

    story.append(section(10, "高频场景例句"))
    for example_index, example in enumerate(card.get("examples", []), start=1):
        story.append(KeepTogether([
            rich(
                f"<b>{example_index:02d} · {esc(example.get('scene'))}</b><br/>"
                f"{esc(example.get('english'))}<br/>"
                f"<font color='#776A73'>{esc(example.get('chinese'))}</font>",
                base,
            )
        ]))

    story.append(section(11, "主动回忆与间隔复习题"))
    questions = card.get("questions", [])
    for q_index, question in enumerate(questions, start=1):
        options = question.get("options") or []
        option_text = ""
        if options:
            option_text = "<br/>" + "　".join(
                f"{chr(64 + i)}. {esc(option)}" for i, option in enumerate(options, start=1)
            )
        story.append(KeepTogether([
            rich(
                f"<b>{q_index}. [{esc(question.get('stage'))}] {esc(question.get('prompt'))}</b>"
                f"{option_text}<br/><font color='#A85575'>参考答案：{esc(question.get('answer'))}</font>"
                f"　<font color='#776A73'>{'AI 点评' if question.get('ai') else '自动评分'}</font>",
                base,
            )
        ]))

    stages = card.get("reviewStages", {})
    stage_rows = [(stage, join_items(types)) for stage, types in stages.items()]
    story.append(section(12, "内容与复习信息"))
    story.append(info_table([
        ("内容版本", card.get("contentVersion")),
        ("内容审校", "已审校" if card.get("reviewed") else "待审校"),
        ("来源说明", card.get("sourceNote")),
        *[(f"复习阶段 {stage}", value) for stage, value in stage_rows],
        ("本册位置", f"第 {index} 张 / 共 {total} 张"),
    ]))
    return story


def build_pdf() -> None:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    cards = data.get("cards", [])
    if not cards:
        raise ValueError("词卡汇总文件中没有 cards 数据。")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = CardDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=22 * mm,
        rightMargin=22 * mm,
        topMargin=25 * mm,
        bottomMargin=24 * mm,
        title="每日英语 - 完整词卡合集",
        author="每日英语",
        subject="150 张英语单词完整学习词卡",
    )

    story: list = [
        Spacer(1, 50 * mm),
        P("DAILY ENGLISH", cover_subtitle),
        Paragraph("每日英语", cover_title),
        P("完整词卡合集", cover_subtitle),
        Spacer(1, 12 * mm),
        rich(
            f"共 {len(cards)} 张完整词卡 · {esc(data.get('contentVersion', ''))}<br/>"
            "按手机端词卡模板整理，适合顺序阅读、搜索和打印复习。",
            cover_subtitle,
        ),
        Spacer(1, 45 * mm),
        P("淡粉阅读版", cover_subtitle),
        PageBreak(),
        Paragraph("目录", toc_title),
        P("点击目录条目可跳转到对应单词。", small),
    ]

    toc = TableOfContents()
    toc.levelStyles = [ParagraphStyle(
        "TOCWord",
        fontName=FONT,
        fontSize=9,
        leading=13,
        leftIndent=4 * mm,
        firstLineIndent=0,
        textColor=INK,
        spaceBefore=1 * mm,
    )]
    story.append(toc)

    for index, card in enumerate(cards, start=1):
        story.extend(card_story(card, index, len(cards)))

    doc.multiBuild(story)
    print(json.dumps({
        "output": str(OUTPUT),
        "cards": len(cards),
        "contentVersion": data.get("contentVersion"),
    }, ensure_ascii=False))


if __name__ == "__main__":
    build_pdf()
