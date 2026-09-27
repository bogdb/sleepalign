// Etsy listing images, 3000x2250 (4:3), built only from the real exported print files.
// Run after: EXPORT=1 node generate.js <theme>   Usage: node listing-images.js sep-aster-girl
// Rules (etsy-listing skill): at most 7 words per image, headline cap height >= 120px.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require(execFileSync('npm', ['root', '-g']).toString().trim() + '/playwright');

const DIR = __dirname, FONTS = path.join(DIR, 'fonts');
const theme = process.argv[2] || 'sep-aster-girl';
const EXP = path.join(DIR, 'out', 'export');
const SRC = path.join(EXP, theme), DEST = path.join(DIR, 'out', 'etsy', theme, 'images');
const W = 3000, H = 2250;
const boy = theme.endsWith('-boy');
const other = boy ? theme.replace(/-boy$/, '-girl') : theme.replace(/-girl$/, '-boy');
const PINK = { ink: '#7E5A69', soft: '#A88D98', bg: '#F2EBE5', glow: 'rgba(255,250,246,.9)', name: 'MAIA' };
const THEME_META = {
  'sep-aster-girl': { ...PINK, month: 'September', flower: 'aster', otherLabel: 'Also in dusty blue' },
  'sep-aster-boy': { ink: '#4F6887', soft: '#8499B2', bg: '#EFEDEA', glow: 'rgba(250,251,253,.9)', name: 'NOAH', month: 'September', flower: 'aster', otherLabel: 'Also in pink & lilac' },
  'nov-chrysanthemum-girl': { ...PINK, month: 'November', flower: 'chrysanthemum', otherLabel: 'Also in rust & cream' },
  'nov-chrysanthemum-boy': { ink: '#7F5238', soft: '#B08A70', bg: '#F1EBE4', glow: 'rgba(255,249,242,.9)', name: 'NOAH', month: 'November', flower: 'chrysanthemum', otherLabel: 'Also in dusty pink' },
};
const C = THEME_META[theme];
if (!C) throw new Error(`no listing-image settings for ${theme}: add it to THEME_META`);
const Flower = C.flower[0].toUpperCase() + C.flower.slice(1);
const src = (size, l, t = theme) => `file://${path.join(EXP, t, size, l + '.jpg')}`;

const base = `
@font-face{font-family:'Corm';src:url('file://${FONTS}/CormorantGaramond-Italic.ttf');font-style:italic;}
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;position:relative;font-family:'Corm';font-style:italic;color:${C.ink}}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 65% 60% at 30% 18%, ${C.glow}, rgba(0,0,0,0) 70%),
  radial-gradient(ellipse 90% 70% at 85% 105%, rgba(110,85,70,.10), rgba(0,0,0,0) 70%), ${C.bg}}
.h{position:absolute;left:0;right:0;text-align:center;font-size:190px;line-height:1;letter-spacing:1px}
.s{position:absolute;left:0;right:0;text-align:center;font-size:84px;color:${C.soft};letter-spacing:4px}
.card{position:absolute;background-color:#FBF8F4;background-repeat:no-repeat;
  box-shadow:0 30px 50px rgba(60,40,30,.20),0 4px 8px rgba(60,40,30,.16)}`;
const grain = `<svg style="position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:multiply;opacity:.5"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .45 0 0 0 0 .4 0 0 0 .07 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
// crop to the letter itself (the art sits in the middle of the print)
const cropped = (url, w, h, x, y, rot = 0) =>
  `<div class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);background-image:url('${url}');background-size:128% auto;background-position:50% 47%"></div>`;
const full = (url, w, h, x, y, rot = 0) =>
  `<div class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);background-image:url('${url}');background-size:cover"></div>`;

const pages = {};

// 1. hero: the name banner
pages['01-hero-banner'] = (() => {
  const L = C.name.split(''), cw = 600, ch = 840, gap = 70, x0 = (W - (L.length * cw + (L.length - 1) * gap)) / 2;
  let s = `<svg style="position:absolute;left:0;top:0" width="${W}" height="${H}"><path d="M-20 300 Q${W / 2} 620 ${W + 20} 300" stroke="#B89B7E" stroke-width="7" fill="none"/></svg>`;
  L.forEach((l, i) => {
    const x = x0 + i * (cw + gap), t = (x + cw / 2) / W, y = 300 + 4 * 320 * t * (1 - t) - 10, rot = [-3, 1.5, -1.5, 3][i] || 0;
    s += `<div class="card" style="left:${x}px;top:${y}px;width:${cw}px;height:${ch}px;transform:rotate(${rot}deg);transform-origin:50% 0;background-image:url('${src('5x7-no-caption', l)}');background-size:cover"></div>
      <div style="position:absolute;left:${x + cw / 2 - 24}px;top:${y - 50}px;width:48px;height:104px;border-radius:7px;transform:rotate(${rot}deg);background:linear-gradient(90deg,#D7B98F,#C4A176);box-shadow:0 5px 10px rgba(60,40,30,.25)"></div>`;
  });
  return s + `<div class="h" style="top:1560px">Spell the name. Frame the letter.</div>
    <div class="s" style="top:1850px">${C.month} &middot; ${Flower}</div>`;
})();

// 2. the print itself, straight on
pages['02-the-print'] = `${full(src('8x10', 'M'), 1360, 1700, 330, 275)}
  <div style="position:absolute;left:1930px;top:0;bottom:0;width:900px;display:flex;flex-direction:column;justify-content:center;font-size:190px;line-height:1.02">
    <div>${C.month}&rsquo;s</div><div>birth flower:</div><div style="margin-top:60px;font-size:${C.flower.length > 8 ? 170 : 230}px">the ${C.flower}</div></div>`;

// 3. every letter
pages['03-a-to-z'] = (() => {
  const cols = 9, tw = 290, th = 362, gx = 24, gy = 28, x0 = (W - (cols * tw + (cols - 1) * gx)) / 2, y0 = 700;
  let s = `<div class="h" style="top:300px">Every letter, A to Z</div>`;
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((l, i) => {
    s += cropped(src('8x10', l), tw, th, x0 + (i % cols) * (tw + gx), y0 + Math.floor(i / cols) * (th + gy));
  });
  return s;
})();

// 4. sizes, drawn to scale (60 px per inch)
pages['04-sizes'] = (() => {
  const ppi = 60, sizes = [['5x7', 5, 7, '5×7 in'], ['8x10', 8, 10, '8×10 in'], ['A4', 8.27, 11.69, 'A4'], ['11x14', 11, 14, '11×14 in'], ['A3', 11.69, 16.54, 'A3']];
  const gap = 55, total = sizes.reduce((a, s) => a + s[1] * ppi, 0) + gap * 4, base = 1980;
  let x = (W - total) / 2, s = `<div class="h" style="top:420px">Five sizes, instant download</div>`;
  for (const [dir, w, h, label] of sizes) {
    const pw = w * ppi, ph = h * ppi;
    s += full(src(dir, 'M'), pw, ph, x, base - ph);
    s += `<div style="position:absolute;left:${x}px;width:${pw}px;top:${base + 50}px;text-align:center;font-size:76px;color:${C.soft}">${label}</div>`;
    x += pw + gap;
  }
  return s;
})();

// 5. close detail from the A3 file
pages['05-detail'] = `<div style="position:absolute;right:0;top:0;width:1950px;height:${H}px;background:url('${src('A3', 'M')}') -540px -1060px / 2800px auto no-repeat"></div>
  <div style="position:absolute;right:1950px;top:0;width:60px;height:${H}px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(60,40,30,.06))"></div>
  <div style="position:absolute;left:120px;top:0;bottom:0;width:820px;display:flex;flex-direction:column;justify-content:center;font-size:190px;line-height:1.05">
    <div>Soft</div><div>watercolour</div><div>detail</div></div>`;

// 6. the other colourway, side by side
pages['06-colours'] = `${full(src('8x10', 'A'), 1040, 1300, 380, 520, -2)}${full(src('8x10', 'A', other), 1040, 1300, 1580, 520, 2)}
  <div class="h" style="top:190px">${C.otherLabel}</div>`;

(async () => {
  for (const t of [theme, other]) if (!fs.existsSync(path.join(EXP, t))) throw new Error(`missing export for ${t}: run EXPORT=1 node generate.js ${t}`);
  fs.mkdirSync(DEST, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await browser.newPage({ viewport: { width: W, height: H } });
  for (const [name, body] of Object.entries(pages)) {
    const html = path.join(DEST, name + '.html');
    fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>${base}</style></head><body><div class="bg"></div>${grain}${body}</body></html>`);
    await pg.goto('file://' + html); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
    await pg.screenshot({ path: path.join(DEST, name + '.jpg'), type: 'jpeg', quality: 90 });
    fs.rmSync(html);
    console.log('wrote', name);
  }
  await browser.close();
})();
