// Builds the Etsy download for one theme: 5 zips (one per print size, each under 20 MB)
// with a printing guide PDF inside each. Run after: EXPORT=1 node generate.js <theme>
// Usage: node package.js sep-aster-girl
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require(execFileSync('npm', ['root', '-g']).toString().trim() + '/playwright');

const DIR = __dirname, FONTS = path.join(DIR, 'fonts');
const theme = process.argv[2] || 'sep-aster-girl';
const SRC = path.join(DIR, 'out', 'export', theme), DEST = path.join(DIR, 'out', 'etsy', theme);
const META = {
  'sep-aster-girl': { title: 'September Aster', colour: 'Pink & Lilac', ink: '#8E6A78', soft: '#B4939F' },
  'sep-aster-boy': { title: 'September Aster', colour: 'Dusty Blue', ink: '#5F7A99', soft: '#8FA3BA' },
  'jul-larkspur-girl': { title: 'July Larkspur', colour: 'Pink & Lilac', ink: '#8E6A78', soft: '#B4939F' },
  'jul-larkspur-boy': { title: 'July Larkspur', colour: 'Blue', ink: '#50679A', soft: '#8FA3BA' },
}[theme];
const slug = `${META.title}-${META.colour}`.replace(/[^A-Za-z]+/g, '-');
// Etsy allows 5 files of up to 20 MB each: one zip per size
const ZIPS = [
  ['1of5_5x7-and-banner', ['5x7', '5x7-no-caption']],
  ['2of5_8x10', ['8x10']],
  ['3of5_11x14', ['11x14']],
  ['4of5_A4', ['A4']],
  ['5of5_A3', ['A3']],
];

const guide = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Corm';src:url('file://${FONTS}/CormorantGaramond-Italic.ttf');font-style:italic;}
@font-face{font-family:'Vibes';src:url('file://${FONTS}/GreatVibes-Regular.ttf');}
@page{size:A4;margin:0}
body{margin:0;position:relative;width:210mm;height:297mm;overflow:hidden;background:#FBF7F3;font-family:'Corm',Georgia,serif;font-style:italic;color:${META.ink};}
.wrap{padding:22mm 24mm}
h1{font:400 44pt Vibes;text-align:center;margin:0 0 2mm}
.sub{text-align:center;font-size:15pt;color:${META.soft};letter-spacing:.5pt;margin-bottom:10mm}
h2{font-size:17pt;font-weight:600;margin:8mm 0 2mm;border-bottom:.3mm solid ${META.soft};padding-bottom:1mm}
p,li{font-size:12.5pt;line-height:1.45;margin:0 0 1.5mm}
ul{margin:0;padding-left:5mm}
table{border-collapse:collapse;width:100%;font-size:12pt}
td{padding:1.2mm 2mm;border-bottom:.2mm solid #E6D9DE}
td:first-child{font-weight:600;white-space:nowrap}
.foot{position:absolute;bottom:14mm;left:0;right:0;text-align:center;font-size:11pt;color:${META.soft}}
</style></head><body><div class="wrap">
<h1>Thank you</h1>
<div class="sub">${META.title} &middot; ${META.colour} &middot; Birth Flower Alphabet</div>

<h2>What's in your download</h2>
<p>All 26 letters, A to Z, in five print sizes, 300 dpi, split into five zip files:</p>
<table>
<tr><td>Zip 1</td><td>5&times;7 in: with the month caption, plus a set without it for banners</td></tr>
<tr><td>Zip 2</td><td>8&times;10 in (also 16&times;20 at lower resolution)</td></tr>
<tr><td>Zip 3</td><td>11&times;14 in</td></tr>
<tr><td>Zip 4</td><td>A4 (21 &times; 29.7 cm)</td></tr>
<tr><td>Zip 5</td><td>A3 (29.7 &times; 42 cm)</td></tr>
</table>

<h2>Printing</h2>
<ul>
<li>Print at <b>100% / actual size</b>. Turn off "fit to page" or "scale".</li>
<li>Matte card or fine art paper (200&ndash;300 gsm) looks closest to a watercolour painting.</li>
<li>Home printers work well up to A4. For 11&times;14 and A3 use a local print shop or an online print service.</li>
<li>Colours vary a little between screens and printers. That's normal.</li>
</ul>

<h2>Name banner for the shower</h2>
<ul>
<li>Open Zip 1 and use the <b>5x7-no-caption</b> folder.</li>
<li>Print each letter of the name, trim, and hang them on twine with mini pegs or a hole punch.</li>
<li>After the party, frame the first letter for the nursery.</li>
</ul>

<h2>Please note</h2>
<p>This is a digital download: no physical item is shipped. For personal use only. Please don't resell or share the files.</p>
</div>
<div class="foot">Wishing you and your little one every happiness</div>
</body></html>`;

(async () => {
  if (!fs.existsSync(SRC)) throw new Error(`missing ${SRC}: run EXPORT=1 node generate.js ${theme} first`);
  fs.rmSync(DEST, { recursive: true, force: true });
  fs.mkdirSync(DEST, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  const html = path.join(DEST, 'guide.html');
  fs.writeFileSync(html, guide);
  await pg.goto('file://' + html); await pg.evaluate(() => document.fonts.ready);
  const guidePdf = 'START-HERE_Printing-Guide.pdf';
  await pg.pdf({ path: path.join(SRC, guidePdf), format: 'A4', printBackground: true });
  await pg.screenshot({ path: path.join(DEST, 'guide-preview.png'), fullPage: true });
  await browser.close();
  fs.rmSync(html);

  const LIMIT = 20 * 1024 * 1024;
  for (const [name, folders] of ZIPS) {
    for (const f of folders) {
      const n = fs.readdirSync(path.join(SRC, f)).filter(x => x.endsWith('.jpg')).length;
      if (n !== 26) throw new Error(`${f}: ${n} letters, expected 26`);
    }
    const zip = path.join(DEST, `${slug}_${name}.zip`);
    execFileSync('python3', ['-m', 'zipfile', '-c', zip, guidePdf, ...folders], { cwd: SRC });
    const size = fs.statSync(zip).size;
    console.log(`${path.basename(zip)}  ${(size / 1048576).toFixed(1)} MB${size > LIMIT ? '  OVER ETSY 20 MB LIMIT' : ''}`);
    if (size > LIMIT) process.exitCode = 1;
  }
})();
