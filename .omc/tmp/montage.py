"""Build montage grids of the 123 detail images with index badges for vision OCR."""
import glob
import os

from PIL import Image, ImageDraw, ImageFont

WORK = os.path.join(os.path.dirname(__file__), "yundar_imgs")
OUTDIR = os.path.join(os.path.dirname(__file__), "montage")
os.makedirs(OUTDIR, exist_ok=True)

CELL_W = 360          # thumbnail width
COLS, ROWS = 3, 4     # 12 per montage
PAD = 8
BADGE_H = 30

try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except Exception:  # noqa: BLE001
    font = ImageFont.load_default()

files = sorted(glob.glob(os.path.join(WORK, "*.jpg")))


def thumb(path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    nh = int(h * CELL_W / w)
    nh = min(nh, 520)  # cap tall images
    return im.resize((CELL_W, nh))


per = COLS * ROWS
for page in range((len(files) + per - 1) // per):
    batch = files[page * per:(page + 1) * per]
    thumbs = []
    for f in batch:
        idx = os.path.splitext(os.path.basename(f))[0]
        t = thumb(f)
        cell = Image.new("RGB", (CELL_W, t.size[1] + BADGE_H), (255, 255, 255))
        d = ImageDraw.Draw(cell)
        d.rectangle([0, 0, CELL_W, BADGE_H], fill=(200, 20, 20))
        d.text((6, 3), f"#{int(idx)}", fill=(255, 255, 255), font=font)
        cell.paste(t, (0, BADGE_H))
        thumbs.append(cell)
    col_h = max(t.size[1] for t in thumbs)
    grid_w = COLS * CELL_W + (COLS + 1) * PAD
    grid_h = ROWS * col_h + (ROWS + 1) * PAD
    grid = Image.new("RGB", (grid_w, grid_h), (30, 30, 40))
    for i, t in enumerate(thumbs):
        r, c = divmod(i, COLS)
        x = PAD + c * (CELL_W + PAD)
        y = PAD + r * (col_h + PAD)
        grid.paste(t, (x, y))
    out = os.path.join(OUTDIR, f"montage_{page + 1:02d}.jpg")
    grid.save(out, quality=85)
    print(f"{out}  ({batch[0]} .. {batch[-1]})".replace(WORK + "/", ""))

print("DONE")
