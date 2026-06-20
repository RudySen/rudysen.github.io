#!/usr/bin/env python3
"""
RPS / Rudy Sen portfolio — image optimizer.

For every .png/.jpg/.jpeg under assets/images (that isn't already an output),
writes two WebP siblings next to it:

    1.png  ->  1.webp        (full view, max 2000px,  quality 82)
           ->  1.thumb.webp  (grid/cover, max 800px,  quality 72)

Originals are never modified or deleted. Re-running is safe: outputs are
rebuilt only when missing or older than their source, so adding new images and
re-running only processes the new ones.

Usage:  python optimize-images.py            (optimize)
        python optimize-images.py --force     (rebuild everything)
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
SRC_DIR = ROOT / "assets" / "images"
EXTS = {".png", ".jpg", ".jpeg"}
FULL_MAX, FULL_Q = 2400, 86
THUMB_MAX, THUMB_Q = 1400, 82
FORCE = "--force" in sys.argv


def is_output(p: Path) -> bool:
    # skip our own generated files
    return p.suffix.lower() == ".webp" or p.name.endswith(".thumb.webp")


def newer(src: Path, out: Path) -> bool:
    return not out.exists() or src.stat().st_mtime > out.stat().st_mtime


def fit(im: Image.Image, mx: int) -> Image.Image:
    w, h = im.size
    if max(w, h) <= mx:
        return im
    s = mx / max(w, h)
    return im.resize((round(w * s), round(h * s)), Image.LANCZOS)


def save_webp(im: Image.Image, out: Path, mx: int, q: int):
    im2 = fit(im, mx)
    if im2.mode in ("RGBA", "P", "LA"):
        im2 = im2.convert("RGB")
    im2.save(out, "WEBP", quality=q, method=6)


def main():
    if not SRC_DIR.exists():
        print(f"! {SRC_DIR} not found"); return
    srcs = [p for p in SRC_DIR.rglob("*") if p.suffix.lower() in EXTS and not is_output(p)]
    before = after = 0
    made = skipped = 0
    for src in sorted(srcs):
        before += src.stat().st_size
        full = src.with_suffix(".webp")
        thumb = src.with_name(src.stem + ".thumb.webp")
        todo = FORCE or newer(src, full) or newer(src, thumb)
        if not todo:
            after += full.stat().st_size + thumb.stat().st_size
            skipped += 1
            continue
        try:
            with Image.open(src) as im:
                im.load()
                save_webp(im, full, FULL_MAX, FULL_Q)
                save_webp(im, thumb, THUMB_MAX, THUMB_Q)
            after += full.stat().st_size + thumb.stat().st_size
            made += 1
            print(f"  + {src.relative_to(ROOT)}  ->  webp + thumb")
        except Exception as e:
            print(f"  ! {src.relative_to(ROOT)} : {e}")
    mb = 1024 * 1024
    print("\n--- done ---")
    print(f"sources processed : {made} built, {skipped} up-to-date")
    print(f"originals (png/jpg): {before/mb:7.1f} MB")
    print(f"webp output total  : {after/mb:7.1f} MB  ({after/before*100:.0f}% of originals)")


if __name__ == "__main__":
    main()
