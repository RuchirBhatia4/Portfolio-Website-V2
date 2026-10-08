"""Build web-sized gallery media + media/g/gallery.json from captions.json.

    python3 tools/build_gallery.py <previews-dir>

<previews-dir> holds N.jpg (photos) and N.mp4 (videos) named by number.
Photos -> N-t.webp (480 px thumb) and N.webp (1400 px).
Videos -> N.mp4 (540 px wide, <= 20 s, silent) and N-t.webp (poster).
"""
import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image, ImageOps

CAPTIONS = Path("/Users/ruchirbhatia/Desktop/Portfolio Photos and Videos/captions.json")
OUT = Path(__file__).resolve().parent.parent / "media" / "g"
MAX_VIDEO_S = 20

# Main-page placement: section -> item numbers (order = display order)
MAIN = {
    "hero": [1, 5, 8],
    "work": [2, 22, 126, 27, 15],
    "edu": [4, 9, 40, 135, 95],
    "life": [13, 64, 60, 52, 103, 73, 33, 123, 154, 142, 58],
}


def photo(src: Path, n: int) -> dict:
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    for size, name, q in ((1400, f"{n}.webp", 80), (480, f"{n}-t.webp", 72)):
        c = im.copy()
        c.thumbnail((size, size))
        c.save(OUT / name, "WEBP", quality=q, method=5)
    return {"w": im.width, "h": im.height}


def video(src: Path, n: int) -> dict:
    out = OUT / f"{n}.mp4"
    if not out.exists():
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-t", str(MAX_VIDEO_S), "-map", "0:v:0", "-an",
                        "-vf", "scale='if(gt(iw,ih),960,540)':-2", "-c:v", "libx264", "-preset", "slow", "-crf", "29",
                        "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)], check=True)
    poster = OUT / f"{n}-t.webp"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "0.4", "-i", str(out), "-frames:v", "1", "-vf", "scale=480:-2", str(poster)], check=True)
    w, h = Image.open(poster).size
    return {"w": w, "h": h}


def main(previews: Path) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    caps = json.loads(CAPTIONS.read_text())
    keep = {int(k): v for k, v in caps.items() if not v.get("exclude") and (v.get("caption") or v.get("gallery_only"))}
    placed = {n: s for s, ns in MAIN.items() for n in ns}

    def one(n: int) -> dict:
        v = keep[n]
        is_vid = v["type"] == "video"
        dims = video(previews / f"{n}.mp4", n) if is_vid else photo(previews / f"{n}.jpg", n)
        return {"n": n, "type": v["type"], "caption": v.get("caption", ""), "themes": v.get("themes", []),
                "main": placed.get(n), **dims}

    with ThreadPoolExecutor(6) as ex:
        items = list(ex.map(one, sorted(keep)))
    (OUT / "gallery.json").write_text(json.dumps({"main": MAIN, "items": items}, ensure_ascii=False))
    size = sum(f.stat().st_size for f in OUT.iterdir()) / 1e6
    print(f"{len(items)} items, {size:.1f} MB")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
