// Etsy listing mockups (2000x2000) built around the rendered prints.
const fs = require('fs');
const path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const DIR = __dirname;
const OUT = path.join(DIR, 'out');
const FONTS = path.join(DIR, 'fonts');
fs.mkdirSync(OUT, { recursive: true });
const img = n => `file://${OUT}/${n}.png`;

const fonts = `
@font-face{font-family:'Corm';src:url('file://${FONTS}/CormorantGaramond-Italic.ttf');font-style:italic;}
@font-face{font-family:'Vibes';src:url('file://${FONTS}/GreatVibes-Regular.ttf');}`;

const wall = `
background:
  radial-gradient(ellipse 70% 60% at 28% 22%, rgba(255,250,244,.85), rgba(255,250,244,0) 70%),
  radial-gradient(ellipse 90% 80% at 80% 100%, rgba(120,95,80,.10), rgba(0,0,0,0) 70%),
  #ECE4DC;`;
const grain = `<svg style="position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:multiply;opacity:.55" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .45 0 0 0 0 .4 0 0 0 .08 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;

function frame(src, w, { wood = true, rot = 0 } = {}) {
  const h = w * 1.25, border = w * 0.045, mat = w * 0.085;
  return `<div style="position:absolute;width:${w}px;height:${h}px;transform:rotate(${rot}deg);
    box-shadow: 0 ${w * .035}px ${w * .06}px rgba(60,40,30,.22), 0 ${w * .008}px ${w * .012}px rgba(60,40,30,.25);
    background:${wood ? 'linear-gradient(135deg,#D8B98E,#BE9A6B 45%,#CDAE82 70%,#B38D60)' : 'linear-gradient(135deg,#FFFFFF,#F1EEEA)'};
    padding:${border}px;box-sizing:border-box;">
    <div style="width:100%;height:100%;background:#FBF9F6;padding:${mat}px;box-sizing:border-box;
      box-shadow: inset 0 ${border * .25}px ${border * .5}px rgba(0,0,0,.18);position:relative;">
      <div style="width:100%;height:100%;background:url('${src}') center/cover;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06), 0 0 0 1px rgba(0,0,0,.05)"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.22) 0%,rgba(255,255,255,0) 38%,rgba(255,255,255,0) 70%,rgba(255,255,255,.08) 100%)"></div>
    </div></div>`;
}

function eucalyptusVase(x, y, s = 1) {
  let stems = '';
  const leafs = (x0, y0, x1, y1, n, r) => {
    let o = `<path d="M${x0} ${y0} Q${(x0 + x1) / 2 + 20} ${(y0 + y1) / 2} ${x1} ${y1}" stroke="#7E948A" stroke-width="3" fill="none"/>`;
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1), px = x0 + (x1 - x0) * t + 10 * Math.sin(t * 3), py = y0 + (y1 - y0) * t, rr = r * (1.1 - t * 0.5);
      o += `<ellipse cx="${px + (i % 2 ? rr : -rr)}" cy="${py}" rx="${rr}" ry="${rr * .85}" fill="#9DB3A8" fill-opacity=".85" stroke="#6F877C" stroke-opacity=".5"/>`;
    }
    return o;
  };
  stems += leafs(0, 0, -130, -420, 9, 26) + leafs(0, 0, 40, -520, 11, 24) + leafs(0, 0, 150, -360, 8, 22) + leafs(0, 0, -40, -300, 6, 20);
  return `<svg style="position:absolute;left:${x - 300 * s}px;top:${y - 620 * s}px;overflow:visible" width="${600 * s}" height="${900 * s}" viewBox="-300 -620 600 900">
    <g>${stems}</g>
    <path d="M-85 -10 Q-120 120 -70 230 L70 230 Q120 120 85 -10 Q60 -40 0 -40 Q-60 -40 -85 -10Z" fill="#F4EFE8" stroke="#D9CFC3" stroke-width="3"/>
    <path d="M-60 0 Q-85 110 -50 210" stroke="#FFFFFF" stroke-width="10" stroke-opacity=".6" fill="none"/>
    <ellipse cx="0" cy="-22" rx="62" ry="12" fill="#E3D9CD"/>
  </svg>`;
}

const pages = {
  // 1. hero: framed on the nursery wall
  'mock-1-hero': `<div style="position:absolute;inset:0;${wall}"></div>${grain}
    <div style="position:absolute;left:0;right:0;top:1560px;bottom:0;background:linear-gradient(#E9DCCB,#D9C7B1)"></div>
    <div style="position:absolute;left:0;right:0;top:1545px;height:30px;background:linear-gradient(#F3EBE0,#E3D4C1);box-shadow:0 8px 18px rgba(80,60,40,.18)"></div>
    <div style="position:absolute;left:500px;top:150px">${frame(img('M-sep-aster-girl'), 1000)}</div>
`,

  // 2. banner: letters on twine for the shower
  'mock-2-banner': `<div style="position:absolute;inset:0;${wall}"></div>${grain}
    <div style="position:absolute;top:120px;width:100%;text-align:center;font:italic 76px Corm;color:#8E6A78;letter-spacing:2px">Spell her name for the shower</div>
    <div style="position:absolute;top:220px;width:100%;text-align:center;font:italic 48px Corm;color:#A7919A">then frame her letter for the nursery</div>
    <svg style="position:absolute;left:0;top:0" width="2000" height="2000"><path d="M-20 560 Q1000 900 2020 560" stroke="#B89B7E" stroke-width="5" fill="none"/></svg>
    ${['M', 'A', 'I', 'A'].map((l, i) => {
      const x = 170 + i * 430, y = 610 + [45, 95, 95, 45][i], rot = [-3, 1.5, -1.5, 3][i];
      return `<div style="position:absolute;left:${x}px;top:${y}px;width:380px;height:520px;transform:rotate(${rot}deg);transform-origin:50% 0;
        background:url('${img(l + '-sep-aster-girl-nc')}') center 52%/150% auto #FBF8F4;
        box-shadow:0 22px 34px rgba(60,40,30,.2),0 3px 6px rgba(60,40,30,.18)"></div>
        <div style="position:absolute;left:${x + 172}px;top:${y - 38}px;width:36px;height:78px;border-radius:5px;transform:rotate(${rot}deg);
        background:linear-gradient(90deg,#D7B98F,#C7A57A);box-shadow:0 4px 8px rgba(60,40,30,.25)"></div>`;
    }).join('')}
    <div style="position:absolute;bottom:250px;width:100%;text-align:center;font:94px Vibes;color:#B07A8C">Welcome, baby Maia</div>
    <div style="position:absolute;bottom:170px;width:100%;text-align:center;font:italic 44px Corm;color:#A7919A;letter-spacing:3px">print any letters, any name</div>`,

  // 3. what's included
  'mock-3-included': `<div style="position:absolute;inset:0;background:#F6F0EA"></div>${grain}
    <div style="position:absolute;top:150px;width:100%;text-align:center;font:italic 92px Corm;color:#7E5E6B">What you receive</div>
    <div style="position:absolute;top:300px;left:50%;width:120px;margin-left:-60px;border-top:2px solid #D4B7C0"></div>
    ${[['S', -12, 250, 700], ['A', -4, 590, 640], ['M', 4, 950, 630], ['I', 12, 1300, 690]].map(([l, r, x, y]) =>
      `<div style="position:absolute;left:${x}px;top:${y}px;width:420px;height:525px;transform:rotate(${r}deg);
        background:url('${img(l + '-sep-aster-girl')}') center/cover;box-shadow:0 24px 40px rgba(60,40,30,.18),0 2px 5px rgba(60,40,30,.15)"></div>`).join('')}
    <div style="position:absolute;top:1370px;left:0;right:0;display:flex;justify-content:center;gap:90px;font:italic 50px Corm;color:#6F5560;text-align:center">
      <div><div style="font-size:120px;line-height:1">26</div>letters A–Z</div>
      <div><div style="font-size:120px;line-height:1">5</div>print sizes</div>
      <div><div style="font-size:120px;line-height:1">300</div>dpi, print-ready</div>
    </div>
    <div style="position:absolute;top:1720px;width:100%;text-align:center;font:italic 44px Corm;color:#9C8790;letter-spacing:2px">5×7 · 8×10 · 11×14 · A4 · A3 &nbsp;—&nbsp; instant digital download</div>`,
};

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await browser.newPage({ viewport: { width: 2000, height: 2000 } });
  for (const [name, body] of Object.entries(pages)) {
    const html = path.join(OUT, name + '.html');
    fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}html,body{margin:0;width:2000px;height:2000px;overflow:hidden;position:relative}</style></head><body>${body}</body></html>`);
    await pg.goto('file://' + html); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
    await pg.screenshot({ path: path.join(OUT, name + '.png') });
    console.log('wrote', name);
  }
  await browser.close();
})();
