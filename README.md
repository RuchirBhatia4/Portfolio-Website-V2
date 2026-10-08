# Ruchir Bhatia — Portfolio

Live: https://ruchirbhatia.com

A single static page (`index.html`) with no framework or dependencies:
particle hero, Skim/Deep reading modes, a ⌘K command menu, real recordings of
PitWall AI and DriveMind (plus an embedded live PitWall), a résumé quick look,
and 155 captioned photos and videos in scrolling side rails and a filterable gallery.

- `media/` — project recordings (DriveMind footage: BDD100K, non-commercial licence; credit kept on the page)
- `media/g/` — gallery photos (WebP) and silent video loops, plus `gallery.json` (captions, themes); built by `tools/build_gallery.py`
- `resume.pdf` + `media/resume.webp` — résumé and the image shown in the quick look (re-render after editing the PDF:
  `pdftoppm -png -r 220 -singlefile resume.pdf media/resume`, then convert to WebP)
- `photo.jpg` (optional) — add a headshot and it appears as a particle portrait in the hero
- Local preview: `python3 tools/serve.py 5180` (supports range requests, which Safari needs for video)

`npm run build` copies everything into `dist/` (used by Vercel and GitHub Pages).
The previous React/Three.js site is preserved at tag `archive/react-3d-portfolio`.
