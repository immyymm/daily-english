from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def load_font(size: int):
    candidates = [
        Path("C:/Windows/Fonts/seguisb.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def make_icon(size: int, name: str):
    image = Image.new("RGB", (size, size), "#F8C4D4")
    pixels = image.load()
    for y in range(size):
        for x in range(size):
            distance = ((x - size * 0.35) ** 2 + (y - size * 0.25) ** 2) ** 0.5
            glow = max(0.0, 1.0 - distance / (size * 0.9))
            pixels[x, y] = (
                int(245 + 10 * glow),
                int(177 + 37 * glow),
                int(201 + 31 * glow),
            )

    draw = ImageDraw.Draw(image, "RGBA")
    center = (size / 2, size / 2 - size * 0.05)
    petal_radius = size * 0.155
    offset = size * 0.155
    petals = [
        (center[0], center[1] - offset),
        (center[0] + offset, center[1]),
        (center[0], center[1] + offset),
        (center[0] - offset, center[1]),
    ]
    for px, py in petals:
        draw.ellipse(
            (px - petal_radius, py - petal_radius, px + petal_radius, py + petal_radius),
            fill=(255, 249, 251, 228),
        )
    draw.ellipse(
        (
            center[0] - size * 0.12,
            center[1] - size * 0.12,
            center[0] + size * 0.12,
            center[1] + size * 0.12,
        ),
        fill=(196, 91, 127, 255),
    )
    label = "DE"
    font = load_font(int(size * 0.13))
    box = draw.textbbox((0, 0), label, font=font)
    text_x = center[0] - (box[2] - box[0]) / 2
    text_y = center[1] - (box[3] - box[1]) / 2 - box[1]
    draw.text((text_x, text_y), label, font=font, fill=(255, 255, 255, 255))
    image.save(PUBLIC / name, optimize=True)


PUBLIC.mkdir(parents=True, exist_ok=True)
make_icon(192, "pwa-192x192.png")
make_icon(512, "pwa-512x512.png")
make_icon(180, "apple-touch-icon.png")
print("Generated PWA icons.")
