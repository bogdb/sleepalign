# Birth-Month Floral Alphabet

Printable nursery / baby-shower letters. Each letter is built from that month's birth flower,
in a girl palette and a boy palette. The letters are generated in code, so a new letter, colourway
or month is a render, not a repaint.

![September aster, girl](previews/september-aster-girl-A-Z.png)

## Status

| Theme | Letters | Notes |
|---|---|---|
| September · Aster (girl / boy) | A–Z done | first product to list |
| July · Larkspur (girl / boy) | A–Z geometry works, not reviewed letter by letter | |
| Other 10 months | not started | one new flower drawing each |

## Run

Needs Node and Playwright with Chromium (the script points at `/opt/pw-browsers/chromium-1194`;
change `executablePath` in `generate.js` / `mockups.js` for another machine).

```sh
node generate.js sep-aster-girl ABCDEFGHIJKLMNOPQRSTUVWXYZ   # out/<L>-sep-aster-girl.png + out/sheet.png
NOCAP=1 node generate.js sep-aster-girl MAI                   # no "September · Aster" caption, for banners
node mockups.js                                               # listing images (needs M, A, I, S rendered above)
```

Themes: `jul-larkspur-girl`, `jul-larkspur-boy`, `sep-aster-girl`, `sep-aster-boy`.
Output is 2400×3000 px (8×10 in at 300 dpi) and is deterministic: the same command gives the same file.

## How it works

- `LETTERS` in `generate.js` describes each letter as strokes (lines, arcs, beziers) marked thick or thin,
  like a Didone serif face. Thick strokes get dense blooms, thin strokes become leafy vines.
- `makeTheme()` supplies the flower, foliage and palette for a month and gender.
- Watercolour look comes from gradient petals, SVG displacement for soft edges, pigment grain and a paper texture.

## Still to do before listing

- Export 5×7, 11×14, A4 and A3 versions (so far only 8×10).
- Package the download so it fits Etsy's 5 files × 20 MB limit, probably 5×7 in the listing plus a PDF link to the full set.
- Replace the code-drawn wall mockup with real photo mockups.

Fonts: Cormorant Garamond and Great Vibes, both SIL Open Font License.
