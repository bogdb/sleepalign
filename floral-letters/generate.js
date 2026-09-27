// Birth-month floral alphabet generator: renders 8x10in @ 300dpi letter prints via headless Chromium.
// Usage: node generate.js [theme-filter] [LETTERS]
//   node generate.js sep-aster-girl ABCDEFGHIJKLMNOPQRSTUVWXYZ   -> out/A-sep-aster-girl.png ... + out/sheet.png
//   NOCAP=1 node generate.js sep-aster-girl MAIA                   -> caption-free versions (for banners)
const fs = require('fs');
const path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');

const W = 2400, H = 3000; // 8x10 in @ 300 dpi
const DIR = __dirname;
const OUT = path.join(DIR, 'out');
const FONTS = path.join(DIR, 'fonts');
fs.mkdirSync(OUT, { recursive: true });

let seed = 20260927;
function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
const R = (a, b) => a + (b - a) * rnd();
const pick = a => a[Math.floor(rnd() * a.length)];
const f = n => n.toFixed(1);

// ---------- palette ----------
const P = {
  blush:    ['#FCE6E8', '#F4BCC6', '#DC8C9C'],
  rose:     ['#F6C6CF', '#E596A7', '#BC5A72'],
  berry:    ['#EEA3B0', '#CC5F77', '#8F2E4A'],
  lilac:    ['#EEE3F3', '#CDB3DE', '#9577B0'],
  plum:     ['#E2C2DA', '#B783AE', '#7A4A78'],
  cream:    ['#FFFFFF', '#FBEFEC', '#E4C4C6'],
};
const LEAF = [['#D3DEC6', '#A2B893', '#6E8A63'], ['#CCDAD2', '#95ADA3', '#627D74'], ['#DDE3CB', '#B1BE98', '#7E8F63']];

let defs = [], gid = 0;
function grad(c, x1 = 0.5, y1 = 1, x2 = 0.5, y2 = 0, stops) {
  const id = 'g' + (gid++);
  stops = stops || [[0, c[2], 0.95], [0.45, c[1], 0.85], [1, c[0], 0.7]];
  defs.push(`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}" stop-opacity="${s[2]}"/>`).join('')}</linearGradient>`);
  return `url(#${id})`;
}
function rgrad(c) {
  const id = 'g' + (gid++);
  defs.push(`<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="${c[2]}" stop-opacity="0.9"/><stop offset="0.5" stop-color="${c[1]}" stop-opacity="0.75"/><stop offset="1" stop-color="${c[0]}" stop-opacity="0.55"/></radialGradient>`);
  return `url(#${id})`;
}

// petal pointing up from origin (0,0) to (0,-L)
function petal(L, Wd, cup = 0.3) {
  const w = Wd, a = R(-0.08, 0.08) * w;
  return `M0 0 C${f(-w * 0.9)} ${f(-L * cup)} ${f(-w * 0.95 + a)} ${f(-L * 1.02)} ${f(a * 0.3)} ${f(-L)} C${f(w * 0.95 + a)} ${f(-L * 1.02)} ${f(w * 0.9)} ${f(-L * cup)} 0 0Z`;
}
function ruffle(L, Wd) { // petal with gently scalloped tip
  const w = Wd;
  return `M0 0 C${f(-w)} ${f(-L * 0.3)} ${f(-w * 1.05)} ${f(-L * 0.85)} ${f(-w * 0.55)} ${f(-L * 0.97)} Q${f(-w * 0.25)} ${f(-L * 0.9)} 0 ${f(-L * 1.02)} Q${f(w * 0.25)} ${f(-L * 0.9)} ${f(w * 0.55)} ${f(-L * 0.97)} C${f(w * 1.05)} ${f(-L * 0.85)} ${f(w)} ${f(-L * 0.3)} 0 0Z`;
}

// ---------- flowers ----------
function rose(r, c) {
  let s = '';
  const layers = 4;
  for (let k = 0; k < layers; k++) {
    const n = [6, 5, 5, 4][k], L = r * (1 - k * 0.2), off = R(0, 360);
    const g = grad(k < 2 ? c : [c[1], c[2], c[2]], 0.5, 1, 0.5, 0, k < 2 ? null : [[0, c[2], 0.9], [1, c[1], 0.75]]);
    for (let i = 0; i < n; i++) {
      const rot = off + i * 360 / n + R(-10, 10);
      s += `<path d="${ruffle(L * R(0.9, 1.05), L * R(0.55, 0.7))}" transform="rotate(${f(rot)})" fill="${g}" stroke="${c[2]}" stroke-opacity="0.35" stroke-width="${f(r * 0.018 + 0.8)}"/>`;
    }
  }
  // cupped centre: crescents + swirl
  const cr = r * 0.34;
  s += `<circle r="${f(cr)}" fill="${c[2]}" fill-opacity="0.55"/>`;
  for (let i = 0; i < 4; i++) {
    const a = i * 90 + R(0, 40), rr = cr * (1 - i * 0.18);
    s += `<path d="M${f(-rr)} 0 A${f(rr)} ${f(rr * 0.8)} 0 0 0 ${f(rr)} 0" transform="rotate(${f(a)}) translate(0 ${f(rr * 0.15)})" fill="none" stroke="${c[2]}" stroke-width="${f(r * 0.05)}" stroke-opacity="0.7" stroke-linecap="round"/>`;
    s += `<path d="M${f(-rr * 0.9)} 0 A${f(rr * 0.9)} ${f(rr * 0.7)} 0 0 0 ${f(rr * 0.9)} 0" transform="rotate(${f(a)}) translate(0 ${f(rr * 0.25)})" fill="none" stroke="${c[0]}" stroke-width="${f(r * 0.03)}" stroke-opacity="0.45" stroke-linecap="round"/>`;
  }
  s += `<path d="M0 0 m${f(-cr * 0.25)} 0 a${f(cr * 0.25)} ${f(cr * 0.25)} 0 1 1 ${f(cr * 0.4)} ${f(cr * 0.1)}" fill="none" stroke="${c[2]}" stroke-width="${f(r * 0.04)}" stroke-linecap="round" stroke-opacity="0.9"/>`;
  return s;
}
function peony(r, c) {
  let s = '';
  for (let k = 0; k < 3; k++) {
    const n = [8, 7, 6][k], L = r * [1, 0.78, 0.55][k], off = R(0, 360);
    const g = grad(c);
    for (let i = 0; i < n; i++) {
      s += `<path d="${ruffle(L * R(0.88, 1.06), L * R(0.42, 0.55))}" transform="rotate(${f(off + i * 360 / n + R(-8, 8))})" fill="${g}" stroke="${c[2]}" stroke-opacity="0.3" stroke-width="${f(r * 0.015 + 0.8)}"/>`;
    }
  }
  // fluffy crumpled centre
  for (let i = 0; i < 14; i++) {
    const a = R(0, 360), d = R(0, r * 0.2), L = R(r * 0.14, r * 0.3);
    s += `<path d="${petal(L, L * 0.6, 0.4)}" transform="rotate(${f(a)}) translate(0 ${f(-d)})" fill="${c[i % 2 ? 1 : 0]}" fill-opacity="0.75" stroke="${c[2]}" stroke-opacity="0.4" stroke-width="1.5"/>`;
  }
  s += `<circle r="${f(r * 0.09)}" fill="${c[2]}" fill-opacity="0.5"/>`;
  return s;
}
function blossom(r, c, stamen = '#C9936A') {
  let s = '';
  const n = 5, off = R(0, 72), g = rgrad([c[0], c[1], c[1]]);
  for (let i = 0; i < n; i++) {
    const rot = off + i * 72 + R(-6, 6);
    s += `<path d="${ruffle(r * R(0.92, 1.05), r * 0.6)}" transform="rotate(${f(rot)})" fill="${grad(c, 0.5, 1, 0.5, 0, [[0, c[2], 0.75], [0.35, c[1], 0.6], [1, c[0], 0.55]])}" stroke="${c[2]}" stroke-opacity="0.4" stroke-width="${f(r * 0.02 + 0.8)}"/>`;
    s += `<path d="M0 0 L0 ${f(-r * 0.55)}" transform="rotate(${f(rot + R(-5, 5))})" stroke="${c[2]}" stroke-opacity="0.35" stroke-width="${f(r * 0.02 + 0.6)}"/>`;
  }
  s += `<circle r="${f(r * 0.2)}" fill="${c[2]}" fill-opacity="0.7"/>`;
  for (let i = 0; i < 12; i++) {
    const a = R(0, Math.PI * 2), d = R(r * 0.18, r * 0.36);
    const x = Math.cos(a) * d, y = Math.sin(a) * d;
    s += `<line x1="0" y1="0" x2="${f(x)}" y2="${f(y)}" stroke="${stamen}" stroke-opacity="0.6" stroke-width="${f(r * 0.018 + 0.5)}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.04 + 0.8)}" fill="${stamen}" fill-opacity="0.85"/>`;
  }
  return s;
}
function bud(r, c, ang) {
  const g = grad(c);
  return `<g transform="rotate(${f(ang)})"><path d="M0 ${f(r * 0.9)} Q${f(r * 0.1)} ${f(r * 0.4)} 0 0" stroke="${LEAF[0][2]}" stroke-width="${f(r * 0.1)}" fill="none"/>`
    + `<path d="${petal(r, r * 0.55, 0.45)}" fill="${g}" stroke="${c[2]}" stroke-opacity="0.45" stroke-width="1.5"/>`
    + `<path d="${petal(r * 0.55, r * 0.45, 0.3)}" transform="rotate(-28)" fill="${LEAF[0][1]}" fill-opacity="0.8"/><path d="${petal(r * 0.55, r * 0.45, 0.3)}" transform="rotate(28)" fill="${LEAF[0][1]}" fill-opacity="0.8"/></g>`;
}
function leaf(L, ang, c = pick(LEAF), wr = R(0.3, 0.42)) {
  const g = grad(c, 0.5, 1, 0.5, 0, [[0, c[2], 0.85], [0.5, c[1], 0.75], [1, c[0], 0.65]]);
  const w = L * wr, bend = R(-0.12, 0.12) * L;
  const d = `M0 0 C${f(-w)} ${f(-L * 0.25)} ${f(-w * 0.7 + bend)} ${f(-L * 0.8)} ${f(bend)} ${f(-L)} C${f(w * 0.6 + bend)} ${f(-L * 0.75)} ${f(w)} ${f(-L * 0.3)} 0 0Z`;
  return `<g transform="rotate(${f(ang)})"><path d="${d}" fill="${g}" stroke="${c[2]}" stroke-opacity="0.35" stroke-width="1.6"/>`
    + `<path d="M0 0 Q${f(bend * 0.3)} ${f(-L * 0.5)} ${f(bend * 0.9)} ${f(-L * 0.92)}" fill="none" stroke="${c[2]}" stroke-opacity="0.5" stroke-width="${f(L * 0.012 + 0.8)}"/></g>`;
}
function eucalyptus(L, ang) {
  const c = LEAF[1];
  let s = `<g transform="rotate(${f(ang)})"><path d="M0 0 Q${f(L * 0.08)} ${f(-L * 0.5)} 0 ${f(-L)}" stroke="${c[2]}" stroke-width="2.4" fill="none" stroke-opacity="0.7"/>`;
  for (let t = 0.15; t < 1; t += 0.17) {
    const rr = L * 0.11 * (1.1 - t * 0.5), side = (Math.round(t * 6) % 2) ? 1 : -1;
    s += `<ellipse cx="${f(side * rr * 0.9)}" cy="${f(-L * t)}" rx="${f(rr)}" ry="${f(rr * 0.85)}" fill="${c[1]}" fill-opacity="0.6" stroke="${c[2]}" stroke-opacity="0.35" stroke-width="1.4"/>`;
  }
  return s + '</g>';
}
function sprig(L, ang, c) { // lavender / heather sprig
  let s = `<g transform="rotate(${f(ang)})"><path d="M0 0 Q${f(L * 0.06)} ${f(-L * 0.5)} 0 ${f(-L)}" stroke="${LEAF[2][2]}" stroke-width="2.2" fill="none" stroke-opacity="0.8"/>`;
  for (let t = 0.35; t <= 1.0; t += 0.07) {
    const rr = L * 0.045 * (1.2 - t * 0.5);
    for (const sd of [-1, 1]) s += `<ellipse cx="${f(sd * rr * 0.8)}" cy="${f(-L * t)}" rx="${f(rr * 0.75)}" ry="${f(rr * 1.15)}" transform="rotate(${sd * 25} ${f(sd * rr * 0.8)} ${f(-L * t)})" fill="${c[t > 0.8 ? 0 : 1]}" fill-opacity="0.8" stroke="${c[2]}" stroke-opacity="0.4" stroke-width="1"/>`;
  }
  return s + '</g>';
}
function breath(L, ang, c) { // baby's breath
  let s = `<g transform="rotate(${f(ang)})">`;
  const tips = [];
  for (let i = 0; i < 7; i++) {
    const tx = R(-L * 0.35, L * 0.35), ty = -R(L * 0.55, L);
    const mx = tx * 0.4, my = ty * 0.5;
    s += `<path d="M0 0 Q${f(mx)} ${f(my)} ${f(tx)} ${f(ty)}" stroke="${LEAF[0][2]}" stroke-width="1.6" fill="none" stroke-opacity="0.7"/>`;
    tips.push([tx, ty]);
  }
  for (const [x, y] of tips) for (let j = 0; j < 3; j++) {
    const px = x + R(-12, 12), py = y + R(-12, 12), rr = R(5, 9);
    s += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(rr)}" fill="${c[0]}" stroke="${c[2]}" stroke-opacity="0.5" stroke-width="1.2"/><circle cx="${f(px)}" cy="${f(py)}" r="${f(rr * 0.35)}" fill="${c[1]}"/>`;
  }
  return s + '</g>';
}
function hydrangea(r, c) { // cluster of tiny four-petal florets
  let s = '';
  for (let i = 0; i < 22; i++) {
    const a = R(0, Math.PI * 2), d = Math.sqrt(rnd()) * r, x = Math.cos(a) * d, y = Math.sin(a) * d, fr = R(r * 0.2, r * 0.28), rot = R(0, 90);
    let fl = '';
    for (let k = 0; k < 4; k++) fl += `<path d="${petal(fr, fr * 0.75, 0.25)}" transform="rotate(${f(rot + k * 90)})" fill="${c[k % 2 ? 0 : 1]}" fill-opacity="0.7" stroke="${c[2]}" stroke-opacity="0.35" stroke-width="1.1"/>`;
    s += `<g transform="translate(${f(x)} ${f(y)})">${fl}<circle r="${f(fr * 0.14)}" fill="${c[2]}"/></g>`;
  }
  return s;
}


// ---------- letter skeleton ----------
const A = [575, 2190], B = [700, 700], C = [1200, 1830], D = [1700, 700], E = [1825, 2190];
// thick strokes (dense blooms): B->C and D->E. thin strokes (vine): A->B and C->D.
const layers = { stem: [], leaf: [], filler: [], flower: [], top: [] };
const at = (x, y, s, rot = 0, sc = 1) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${sc})">${s}</g>`;

// A stroke is a chain of cubic beziers, sampled by arc length so t in [0,1] walks evenly.
function stroke(cubics) {
  const pts = [];
  for (const [p0, p1, p2, p3] of cubics) for (let i = pts.length ? 1 : 0; i <= 120; i++) {
    const u = i / 120, v = 1 - u;
    pts.push([v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
              v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]);
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, len: cum[cum.length - 1], p: pts[0], q: pts[pts.length - 1] };
}
const line = (a, b) => [a, [a[0] + (b[0] - a[0]) / 3, a[1] + (b[1] - a[1]) / 3], [a[0] + 2 * (b[0] - a[0]) / 3, a[1] + 2 * (b[1] - a[1]) / 3], b];
const seg = (a, b) => stroke([line(a, b)]);
function frame(s, t) {
  t = Math.min(1, Math.max(0, t));
  const target = t * s.len;
  let lo = 0, hi = s.cum.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s.cum[m] < target) lo = m; else hi = m; }
  const a = s.pts[lo], b = s.pts[hi], k = (target - s.cum[lo]) / ((s.cum[hi] - s.cum[lo]) || 1);
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  return { x: a[0] + dx * k, y: a[1] + dy * k, ux: dx / l, uy: dy / l, ang: Math.atan2(dy, dx) * 180 / Math.PI };
}
const angAt = (s, t) => frame(s, t).ang;
const pt = (s, t, o = 0) => { const fr = frame(s, t); return [fr.x - fr.uy * o, fr.y + fr.ux * o]; };

// ======================= birth-month themes =======================
const GOLD = ['#F6DE93', '#E5B653', '#B07A2E'];
const PB = { // boy / girl palettes
  dusty:  ['#E6EDF5', '#A9BFD6', '#627FA1'],
  peri:   ['#E8E8F6', '#B3B6DF', '#7477B0'],
  indigo: ['#D3DAEE', '#8494C8', '#43578F'],
  sky:    ['#EEF4F9', '#C3D6E8', '#86A4C3'],
  ivory:  ['#FFFFFF', '#F7F0E6', '#D8C3AE'],
  pinkL:  ['#FBE4EA', '#F0B3C3', '#C9728B'],
};

function aster(r, c) {
  let s = '';
  const n = Math.round(R(24, 30));
  for (const [k, Lf, op] of [[0, 1, 1], [1, 0.8, 1]]) {
    const off = R(0, 360), g = grad(k ? c : [c[1], c[1], c[2]], 0.5, 1, 0.5, 0, [[0, c[2], 0.9], [0.4, c[1], 0.75], [1, c[0], 0.6]]);
    for (let i = 0; i < n; i++) {
      const L = r * Lf * R(0.82, 1.05);
      s += `<path d="${petal(L, L * R(0.1, 0.14), 0.35)}" transform="rotate(${f(off + i * 360 / n + R(-4, 4))})" fill="${g}" stroke="${c[2]}" stroke-opacity="0.3" stroke-width="${f(r * 0.012 + 0.6)}"/>`;
    }
  }
  const cr = r * 0.24;
  s += `<circle r="${f(cr)}" fill="${grad(GOLD, 0.3, 0.2, 0.7, 0.9, [[0, GOLD[0], 0.95], [0.6, GOLD[1], 0.9], [1, GOLD[2], 0.9]])}" stroke="${GOLD[2]}" stroke-opacity="0.5" stroke-width="1.4"/>`;
  for (let i = 0; i < 26; i++) {
    const a = R(0, Math.PI * 2), d = Math.sqrt(rnd()) * cr * 0.85;
    s += `<circle cx="${f(Math.cos(a) * d)}" cy="${f(Math.sin(a) * d)}" r="${f(r * 0.02 + 0.8)}" fill="${i % 3 ? GOLD[2] : GOLD[0]}" fill-opacity="0.75"/>`;
  }
  return s;
}
function asterBud(r, c, ang) {
  let s = `<g transform="rotate(${f(ang)})"><path d="M0 ${f(r * 2.2)} Q${f(r * 0.3)} ${f(r)} 0 0" stroke="${LEAF[0][2]}" stroke-width="2.2" fill="none"/>`;
  for (let i = -3; i <= 3; i++) s += `<path d="${petal(r * 1.1, r * 0.22, 0.3)}" transform="rotate(${i * 11})" fill="${c[1]}" fill-opacity="0.75" stroke="${c[2]}" stroke-opacity="0.4" stroke-width="1"/>`;
  s += `<ellipse cx="0" cy="${f(r * 0.1)}" rx="${f(r * 0.45)}" ry="${f(r * 0.35)}" fill="${LEAF[0][1]}" fill-opacity="0.9"/></g>`;
  return s;
}
function larkspur(L, ang, c) { // flower spike, base at origin, grows toward -y then rotated
  let s = `<g transform="rotate(${f(ang)})"><path d="M0 0 Q${f(L * 0.04)} ${f(-L * 0.5)} 0 ${f(-L)}" stroke="${LEAF[0][2]}" stroke-width="3" fill="none" stroke-opacity="0.8"/>`;
  let side = 1;
  for (let t = 0.08; t <= 1.0; t += 0.075) {
    side = -side;
    const y = -L * t, x = side * L * 0.03, fr = L * 0.11 * (1.15 - t * 0.7);
    if (t > 0.78) { // buds near the tip
      s += `<ellipse cx="${f(x * 1.5)}" cy="${f(y)}" rx="${f(fr * 0.5)}" ry="${f(fr * 0.75)}" fill="${c[1]}" fill-opacity="0.8" stroke="${c[2]}" stroke-opacity="0.45" stroke-width="1.1"/>`;
      continue;
    }
    let fl = `<path d="M0 0 Q${f(side * fr * 0.9)} ${f(fr * 0.2)} ${f(side * fr * 1.4)} ${f(-fr * 0.3)}" stroke="${c[2]}" stroke-opacity="0.5" stroke-width="${f(fr * 0.12)}" fill="none" stroke-linecap="round"/>`; // spur
    const off = R(0, 72), g = grad(c, 0.5, 1, 0.5, 0, [[0, c[2], 0.85], [0.45, c[1], 0.75], [1, c[0], 0.6]]);
    for (let k = 0; k < 5; k++) fl += `<path d="${ruffle(fr * R(0.9, 1.05), fr * 0.62)}" transform="rotate(${f(off + k * 72)})" fill="${g}" stroke="${c[2]}" stroke-opacity="0.35" stroke-width="1.2"/>`;
    fl += `<circle r="${f(fr * 0.26)}" fill="${c[0]}" fill-opacity="0.9"/><circle r="${f(fr * 0.13)}" fill="${c[2]}" fill-opacity="0.85"/>`;
    s += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(R(-20, 20))})">${fl}</g>`;
  }
  return s + '</g>';
}
function fern(L, ang, c = LEAF[0]) { // feathery larkspur foliage
  let s = `<g transform="rotate(${f(ang)})" stroke="${c[2]}" fill="none" stroke-linecap="round" stroke-opacity="0.8"><path d="M0 0 Q${f(L * 0.06)} ${f(-L * 0.5)} 0 ${f(-L)}" stroke-width="2.2"/>`;
  for (let t = 0.2; t < 0.95; t += 0.12) {
    for (const sd of [-1, 1]) {
      const bl = L * 0.32 * (1.1 - t * 0.7), y = -L * t, ex = sd * bl * 0.8, ey = y - bl * 0.6;
      s += `<path d="M0 ${f(y)} Q${f(ex * 0.5)} ${f(y - bl * 0.1)} ${f(ex)} ${f(ey)}" stroke="${c[1]}" stroke-width="2.6"/>`;
      s += `<path d="M${f(ex * 0.55)} ${f(y - bl * 0.2)} l${f(sd * bl * 0.25)} ${f(-bl * 0.45)}" stroke="${c[1]}" stroke-width="2"/>`;
    }
  }
  return s + '</g>';
}


// November: chrysanthemum — dense cupped pompom, petals curl inward, no visible centre
function chrysanthemum(r, c) {
  let s = '';
  const layers = [[22, 1.0], [20, 0.84], [17, 0.68], [14, 0.52], [10, 0.37], [7, 0.23]];
  layers.forEach(([n, Lf], k) => {
    const off = R(0, 360), t = k / (layers.length - 1);
    // outer petals lighter at the tip, inner petals deeper: gives the cupped depth
    const g = grad(c, 0.5, 1, 0.5, 0, [[0, c[2], 0.9], [0.5, t > 0.5 ? c[2] : c[1], 0.8], [1, t > 0.6 ? c[1] : c[0], 0.75]]);
    for (let i = 0; i < n; i++) {
      const L = r * Lf * R(0.86, 1.04);
      s += `<path d="${petal(L, L * R(0.2, 0.26), 0.55)}" transform="rotate(${f(off + i * 360 / n + R(-5, 5))})" fill="${g}" stroke="${c[2]}" stroke-opacity="0.35" stroke-width="${f(r * 0.012 + 0.6)}"/>`;
    }
  });
  s += `<circle r="${f(r * 0.1)}" fill="${c[2]}" fill-opacity="0.55"/>`;
  return s;
}
function chrysBud(r, c, ang) {
  let s = `<g transform="rotate(${f(ang)})"><path d="M0 ${f(r * 2.4)} Q${f(r * 0.3)} ${f(r)} 0 ${f(r * 0.3)}" stroke="${LEAF[0][2]}" stroke-width="2.4" fill="none"/>`;
  s += `<circle r="${f(r * 0.7)}" fill="${grad(c)}" stroke="${c[2]}" stroke-opacity="0.45" stroke-width="1.2"/>`;
  for (const a of [-50, 0, 50]) s += `<path d="${petal(r * 0.75, r * 0.3, 0.3)}" transform="translate(0 ${f(r * 0.55)}) rotate(${180 + a})" fill="${LEAF[0][1]}" fill-opacity="0.85"/>`;
  return s + '</g>';
}
function lobedLeaf(L, ang, c = pick(LEAF)) { // chrysanthemum leaf: three rounded lobes each side
  const g = grad(c, 0.5, 1, 0.5, 0, [[0, c[2], 0.85], [0.5, c[1], 0.75], [1, c[0], 0.65]]);
  const w = L * 0.36;
  let d = 'M0 0';
  for (const [t, ww] of [[0.28, 0.75], [0.58, 1], [0.86, 0.6]]) d += ` Q${f(-w * ww * 1.3)} ${f(-L * (t - 0.12))} ${f(-w * ww * 0.35)} ${f(-L * t)}`;
  d += ` Q${f(-w * 0.2)} ${f(-L * 1.02)} 0 ${f(-L)}`;
  for (const [t, ww] of [[0.86, 0.6], [0.58, 1], [0.28, 0.75]]) d += ` Q${f(w * ww * 0.35)} ${f(-L * t - L * 0.02)} ${f(w * ww * 0.35)} ${f(-L * t)} Q${f(w * ww * 1.3)} ${f(-L * (t - 0.12))} ${f(t === 0.28 ? 0 : w * 0.3)} ${f(-L * Math.max(0, t - 0.2))}`;
  d += ' Z';
  return `<g transform="rotate(${f(ang)})"><path d="${d}" fill="${g}" stroke="${c[2]}" stroke-opacity="0.35" stroke-width="1.6"/>`
    + `<path d="M0 0 L0 ${f(-L * 0.9)}" stroke="${c[2]}" stroke-opacity="0.5" stroke-width="${f(L * 0.012 + 0.8)}"/></g>`;
}

const THEMES = {
  'jul-larkspur': { month: 'July', flower: 'Larkspur' },
  'sep-aster': { month: 'September', flower: 'Aster' },
  'nov-chrysanthemum': { month: 'November', flower: 'Chrysanthemum' },
};
function makeTheme(key, gender) {
  const boy = gender === 'boy';
  if (key === 'sep-aster') {
    const pals = boy ? [PB.dusty, PB.peri, PB.indigo, PB.dusty, PB.sky, PB.ivory] : [P.lilac, P.blush, P.rose, P.lilac, P.plum];
    return {
      ink: boy ? '#5F7A99' : '#A8708A',
      bloom: (x, y) => put('flower', x, y, aster(R(80, 112), pick(pals)), R(0, 360)),
      focal: (x, y, r) => put('top', x, y, aster(r, pick(pals)), R(0, 360)),
      small: (x, y) => put('flower', x, y, aster(R(36, 48), pick(pals)), R(0, 360)),
      bud: (x, y, a) => put('filler', x, y, asterBud(R(22, 30), pick(pals), a)),
      leaf: (x, y, a) => rnd() < (boy ? 0.6 : 0.75) ? put('leaf', x, y, leaf(R(110, 160), a, pick(LEAF), R(0.14, 0.2))) : put('leaf', x, y, eucalyptus(R(150, 200), a)),
      filler: (x, y) => { for (let i = 0; i < 3; i++) put('filler', x + R(-45, 45), y + R(-45, 45), aster(R(22, 32), pick(pals)), R(0, 360)); },
      airy: (x, y, a) => put('filler', x, y, breath(R(110, 140), a, boy ? PB.ivory : P.cream)),
    };
  }
  if (key === 'nov-chrysanthemum') {
    // "boy" here is the neutral colourway: rust, mustard and cream
    const rust = ['#F7E1D0', '#DDA27E', '#A45E3C'], mustard = ['#FAEBC6', '#E4C274', '#A8832F'];
    const dusty = ['#FBE4E5', '#ECB1B8', '#C27381'], mauve = ['#F1DDE7', '#CEA2BC', '#8E5F7C'];
    const pals = boy ? [rust, PB.ivory, mustard, rust, PB.ivory] : [dusty, P.blush, mauve, dusty, PB.ivory];
    return {
      ink: boy ? '#8A5A3E' : '#A8708A',
      bloom: (x, y) => put('flower', x, y, chrysanthemum(R(78, 106), pick(pals)), R(0, 360)),
      focal: (x, y, r) => put('top', x, y, chrysanthemum(r, pick(pals)), R(0, 360)),
      small: (x, y) => put('flower', x, y, chrysanthemum(R(34, 44), pick(pals)), R(0, 360)),
      bud: (x, y, a) => put('filler', x, y, chrysBud(R(20, 28), pick(pals), a)),
      leaf: (x, y, a) => rnd() < 0.7 ? put('leaf', x, y, lobedLeaf(R(110, 150), a)) : put('leaf', x, y, eucalyptus(R(150, 200), a)),
      filler: (x, y) => { for (let i = 0; i < 2; i++) put('filler', x + R(-40, 40), y + R(-40, 40), chrysBud(R(18, 24), pick(pals), R(0, 360))); },
      airy: (x, y, a) => put('filler', x, y, breath(R(110, 140), a, PB.ivory)),
    };
  }
  // larkspur
  const pals = boy ? [PB.indigo, PB.dusty, PB.ivory, PB.indigo, PB.sky] : [PB.pinkL, P.lilac, PB.ivory, P.blush, PB.pinkL];
  return {
    ink: boy ? '#50679A' : '#A8708A',
    alongStroke: true,
    bloom: (x, y, a) => { for (const o of [-1, 1]) put('flower', x + o * R(12, 30), y + o * R(12, 30), larkspur(R(280, 360), a + 90 + (rnd() < 0.5 ? 180 : 0) + R(-15, 15), pick(pals))); },
    focal: (x, y, r) => { for (const a of [-40, 0, 40]) put('flower', x, y, larkspur(r * 1.8, a + R(-10, 10) + (y > 1500 ? 180 : 0), pick(pals))); put('top', x, y, rose(r * 0.7, boy ? PB.ivory : P.blush), R(0, 360)); },
    small: (x, y) => put('flower', x, y, blossom(R(36, 46), boy ? PB.ivory : pick([PB.ivory, P.blush])), R(0, 360)),
    bud: (x, y, a) => put('filler', x, y, larkspur(R(130, 170), a, pick(pals))),
    leaf: (x, y, a) => rnd() < 0.55 ? put('leaf', x, y, fern(R(130, 180), a, pick(LEAF))) : put('leaf', x, y, leaf(R(90, 130), a, pick(LEAF), R(0.2, 0.28))),
    filler: (x, y) => put('filler', x, y, rnd() < 0.5 ? breath(R(110, 140), R(0, 360), PB.ivory) : fern(R(120, 160), R(0, 360), LEAF[1])),
    airy: (x, y, a) => put('filler', x, y, breath(R(110, 140), a, PB.ivory)),
  };
}

// ---------- layout ----------
let L2;
const put = (layer, x, y, svg, rot = 0) => L2[layer].push(at(x, y, svg, rot));
function thin(s, T) {
  wobblyStem2(s, 5, LEAF[0][2]); wobblyStem2(s, 2.5, LEAF[1][2]); wobblyStem2(s, 3, LEAF[2][2]);
  let side = 1;
  for (let t = 40 / s.len; t < 1 - 40 / s.len; t += R(55, 80) / s.len) {
    side = -side;
    const [x, y] = pt(s, t);
    const a = angAt(s, t) + (side > 0 ? 90 : -90) + 90 - side * 55 + R(-15, 15);
    const k = rnd();
    if (k < 0.62) T.leaf(x, y, a);
    else if (k < 0.8) T.bud(x, y, a);
    else T.airy(x, y, a);
  }
  const nb = Math.max(1, Math.round(s.len / 320));
  for (let i = 1; i <= nb; i++) { const [x, y] = pt(s, i / (nb + 1) + R(-0.03, 0.03), R(-15, 15)); T.small(x, y); }
}
function wobblyStem2(s, width, color) {
  let d = `M${f(s.p[0])} ${f(s.p[1])}`;
  const n = Math.max(6, Math.round(s.len / 180));
  for (let i = 1; i <= n; i++) {
    const [x, y] = pt(s, i / n, i < n ? R(-8, 8) : 0), [cx, cy] = pt(s, (i - 0.5) / n, R(-12, 12));
    d += ` Q${f(cx)} ${f(cy)} ${f(x)} ${f(y)}`;
  }
  L2.stem.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-opacity="0.8"/>`);
}
function thick(s, T) {
  for (let t = 20 / s.len; t < 1.0; t += R(50, 75) / s.len) for (const side of [-1, 1]) {
    if (rnd() < 0.25) continue;
    const [x, y] = pt(s, t, side * R(55, 90));
    const a = angAt(s, t) + 90 + (side > 0 ? 180 : 0) + R(-40, 40);
    rnd() < 0.8 ? T.leaf(x, y, a) : T.airy(x, y, a);
  }
  for (let t = 60 / s.len; t < 1 - 40 / s.len; t += R(125, 170) / s.len) { const [x, y] = pt(s, t, R(-70, 70)); T.filler(x, y); }
  let side = 1;
  const step = T.alongStroke ? [75, 93] : [95, 115];
  for (let t = 45 / s.len; t < 1.0; t += R(...step) / s.len) {
    side = -side;
    const [x, y] = pt(s, t, side * R(T.alongStroke ? 10 : 18, T.alongStroke ? 45 : 55));
    T.bloom(x, y, angAt(s, t));
  }
}
const LETTERS = {
  M: {
    thin: [seg(A, B), seg(C, D)], thick: [seg(B, C), seg(D, E)],
    serifs: [[A[0], A[1] + 10], [E[0], E[1] + 10], [B[0] - 30, B[1] - 20], [D[0] + 30, D[1] - 20]],
    focal: [[B[0] + 10, B[1] + 20, 130], [D[0] - 5, D[1] + 30, 125], [C[0], C[1] + 5, 115], [E[0] - 5, E[1] - 30, 120], [A[0], A[1] - 20, 90]],
    small: [[B[0] - 70, B[1] + 110], [C[0] + 95, C[1] + 80], [E[0] + 105, E[1] + 40]],
  },
  A: {
    thin: [seg([1200, 720], [640, 2190]), seg([890, 1640], [1510, 1640])],
    thick: [seg([1200, 720], [1760, 2190])],
    serifs: [[640, 2200], [1760, 2200]],
    focal: [[1200, 740, 125], [1745, 2150, 115], [655, 2160, 95]],
    small: [[890, 1640], [1510, 1640], [1330, 1100]],
  },
  I: {
    thin: [], thick: [seg([1200, 720], [1200, 2180])],
    serifs: [[1200, 710], [1200, 2195]],
    focal: [[1200, 740, 115], [1200, 2160, 120]],
    small: [[1110, 1300], [1290, 1650]],
  },
  S: { // Didone-style S: hairline bowls, heavy spine, ball terminals
    thin: [
      stroke([[[1630, 960], [1580, 790], [1420, 705], [1210, 705]], [[1210, 705], [960, 705], [775, 830], [775, 1040]]]),
      stroke([[[1640, 1880], [1640, 2090], [1440, 2195], [1200, 2195]], [[1200, 2195], [960, 2195], [790, 2100], [755, 1930]]]),
    ],
    thick: [stroke([[[775, 1040], [775, 1260], [1000, 1350], [1200, 1440]], [[1200, 1440], [1420, 1535], [1640, 1650], [1640, 1880]]])],
    serifs: [],
    focal: [[1620, 945, 120], [765, 1935, 115], [1200, 1440, 125], [800, 1070, 105], [1610, 1850, 110]],
    small: [[1210, 705], [1200, 2195], [1690, 1040], [700, 1830]],
  },
};

// ---- alphabet geometry: cap height 720..2190, Didone contrast (verticals/sides thick, hairlines thin) ----
const TOP = 720, BOT = 2190;
const V = (x, y1 = TOP, y2 = BOT) => seg([x, y1], [x, y2]);
const Hz = (x1, x2, y) => seg([x1, y], [x2, y]);
// elliptical arc as a chain of short lines; angles in degrees, 0 = right, 90 = down (may run either direction)
function arc(cx, cy, rx, ry, a0, a1, pre = [], post = []) {
  const n = Math.max(8, Math.round(Math.abs(a1 - a0) / 6)), pts = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  const all = [...pre, ...pts, ...post], cubics = [];
  for (let i = 1; i < all.length; i++) cubics.push(line(all[i - 1], all[i]));
  return stroke(cubics);
}
const cap = (x, y) => [[x, y]]; // serif helper
Object.assign(LETTERS, {
  B: {
    thick: [V(760), arc(1180, 1075, 380, 355, -75, 75), arc(1230, 1815, 430, 375, -75, 75)],
    thin: [Hz(760, 1280, TOP), Hz(760, 1280, 1440), Hz(760, 1340, BOT)],
    serifs: [], small: [],
    focal: [[770, 740, 110], [770, 2170, 115], [1560, 1075, 95], [1650, 1815, 110]],
  },
  C: {
    thin: [arc(1230, 1455, 540, 735, -40, -125), arc(1230, 1455, 540, 735, 125, 40)],
    thick: [arc(1230, 1455, 540, 735, -125, -235)],
    serifs: [], small: [],
    focal: [[1640, 985, 105], [1640, 1925, 110], [695, 1455, 120]],
  },
  D: {
    thick: [V(760), arc(1150, 1455, 530, 735, -55, 55)],
    thin: [arc(1150, 1455, 530, 735, -90, -55, [[760, TOP]]), arc(1150, 1455, 530, 735, 55, 90, [], [[760, BOT]])],
    serifs: [], small: [],
    focal: [[770, 740, 110], [770, 2170, 115], [1680, 1455, 120]],
  },
  E: {
    thick: [V(760)], thin: [Hz(760, 1600, TOP), Hz(760, 1420, 1440), Hz(760, 1640, BOT)],
    serifs: [], small: [],
    focal: [[770, 740, 115], [770, 2170, 115], [1600, 730, 95], [1420, 1440, 80], [1640, 2180, 100]],
  },
  F: {
    thick: [V(760)], thin: [Hz(760, 1600, TOP), Hz(760, 1420, 1440)],
    serifs: [[760, 2200]], small: [],
    focal: [[770, 740, 115], [770, 2160, 105], [1600, 730, 95], [1420, 1440, 80]],
  },
  G: {
    thin: [arc(1230, 1455, 540, 735, -40, -125), arc(1230, 1455, 540, 735, 125, 45), Hz(1330, 1650, 1600)],
    thick: [arc(1230, 1455, 540, 735, -125, -235), V(1650, 1600, 1960)],
    serifs: [], small: [],
    focal: [[1640, 985, 105], [695, 1455, 120], [1650, 1620, 105], [1330, 1600, 70]],
  },
  H: {
    thick: [V(700), V(1700)], thin: [Hz(700, 1700, 1440)],
    serifs: [[700, 710], [700, 2200], [1700, 710], [1700, 2200]], small: [],
    focal: [[700, 740, 105], [1700, 2170, 110], [700, 2170, 95], [1700, 740, 95], [1200, 1440, 80]],
  },
  J: {
    thick: [V(1450, TOP, 1800)],
    thin: [arc(1120, 1800, 330, 390, 0, 160)],
    serifs: [[1450, 710]], small: [],
    focal: [[1450, 740, 110], [810, 1935, 100], [1180, 2185, 80]],
  },
  K: {
    thick: [V(720), seg([1040, 1280], [1690, BOT])], thin: [seg([1640, TOP], [730, 1560])],
    serifs: [[720, 710], [720, 2200]], small: [],
    focal: [[730, 740, 105], [730, 2170, 110], [1640, 735, 95], [1680, 2165, 110], [930, 1380, 95]],
  },
  L: {
    thick: [V(760)], thin: [Hz(760, 1640, BOT)],
    serifs: [[760, 710]], small: [],
    focal: [[770, 740, 110], [770, 2170, 120], [1640, 2175, 100]],
  },
  N: {
    thin: [V(700), V(1700)], thick: [seg([700, TOP], [1700, BOT])],
    serifs: [[700, 2200], [1700, 710]], small: [],
    focal: [[710, 740, 115], [1690, 2170, 115], [700, 2170, 95], [1700, 740, 95]],
  },
  O: {
    thick: [arc(1200, 1455, 520, 735, 140, 220), arc(1200, 1455, 520, 735, -40, 40)],
    thin: [arc(1200, 1455, 520, 735, 220, 320), arc(1200, 1455, 520, 735, 40, 140)],
    serifs: [], small: [],
    focal: [[685, 1455, 120], [1715, 1455, 115], [1200, 725, 85], [1200, 2185, 90]],
  },
  P: {
    thick: [V(760), arc(1150, 1100, 430, 380, -60, 60)],
    thin: [arc(1150, 1100, 430, 380, -90, -60, [[760, TOP]]), arc(1150, 1100, 430, 380, 60, 90, [], [[760, 1480]])],
    serifs: [[760, 2200]], small: [],
    focal: [[770, 740, 110], [770, 2160, 110], [1580, 1100, 110]],
  },
  Q: {
    thick: [arc(1200, 1420, 520, 700, 140, 220), arc(1200, 1420, 520, 700, -40, 40), seg([1300, 1960], [1740, 2330])],
    thin: [arc(1200, 1420, 520, 700, 220, 320), arc(1200, 1420, 520, 700, 40, 140)],
    serifs: [], small: [],
    focal: [[685, 1420, 120], [1715, 1420, 110], [1200, 725, 85], [1730, 2310, 100]],
  },
  R: {
    thick: [V(760), arc(1150, 1100, 430, 380, -60, 60), seg([1150, 1480], [1680, BOT])],
    thin: [arc(1150, 1100, 430, 380, -90, -60, [[760, TOP]]), arc(1150, 1100, 430, 380, 60, 90, [], [[760, 1480]])],
    serifs: [[760, 2200]], small: [],
    focal: [[770, 740, 110], [770, 2160, 105], [1580, 1100, 105], [1680, 2165, 110]],
  },
  T: {
    thin: [Hz(640, 1760, TOP)], thick: [V(1200, TOP + 30)],
    serifs: [[1200, 2200]], small: [],
    focal: [[1200, 760, 110], [645, 735, 95], [1755, 735, 95], [1200, 2165, 115]],
  },
  U: {
    thick: [V(700, TOP, 1700), arc(1200, 1700, 500, 490, 180, 90)],
    thin: [arc(1200, 1700, 500, 490, 90, 0), V(1700, TOP, 1700)],
    serifs: [[700, 710], [1700, 710]], small: [],
    focal: [[710, 740, 110], [1700, 740, 95], [1000, 2140, 105]],
  },
  V: {
    thick: [seg([640, TOP], [1200, BOT])], thin: [seg([1760, TOP], [1200, BOT])],
    serifs: [[640, 710], [1760, 710]], small: [],
    focal: [[650, 740, 110], [1755, 740, 95], [1200, 2160, 120]],
  },
  W: {
    thick: [seg([500, TOP], [860, BOT]), seg([1200, 1000], [1540, BOT])],
    thin: [seg([860, BOT], [1200, 1000]), seg([1540, BOT], [1900, TOP])],
    serifs: [[500, 710], [1900, 710]], small: [],
    focal: [[510, 740, 105], [1895, 740, 95], [860, 2160, 110], [1540, 2160, 110], [1200, 1010, 85]],
  },
  X: {
    thick: [seg([660, TOP], [1740, BOT])], thin: [seg([1740, TOP], [660, BOT])],
    serifs: [[660, 710], [1740, 710], [660, 2200], [1740, 2200]], small: [],
    focal: [[670, 740, 105], [1735, 2170, 110], [1735, 740, 90], [665, 2170, 95], [1200, 1455, 110]],
  },
  Y: {
    thick: [seg([660, TOP], [1200, 1480]), V(1200, 1480, BOT)], thin: [seg([1740, TOP], [1200, 1480])],
    serifs: [[660, 710], [1740, 710], [1200, 2200]], small: [],
    focal: [[670, 740, 105], [1735, 740, 95], [1200, 1480, 110], [1200, 2165, 115]],
  },
  Z: {
    thin: [Hz(700, 1700, TOP), Hz(700, 1720, BOT)], thick: [seg([1700, TOP], [700, BOT])],
    serifs: [], small: [],
    focal: [[1690, 740, 110], [710, 2170, 115], [705, 730, 90], [1715, 2180, 95]],
  },
});
function composeTheme(T, letter = 'M') {
  L2 = { stem: [], leaf: [], filler: [], flower: [], top: [] };
  const Lt = LETTERS[letter];
  Lt.thin.forEach(s => thin(s, T));
  Lt.thick.forEach(s => thick(s, T));
  for (const [x, y] of Lt.serifs)
    for (const sd of [-1, 1]) { T.leaf(x, y, 90 * sd + R(-10, 10)); T.leaf(x, y, 90 * sd + 30 * sd + R(-8, 8)); }
  for (const [x, y, r] of Lt.focal) T.focal(x, y, r);
  for (const [x, y] of Lt.small) T.small(x, y);
  return ['stem', 'leaf', 'filler', 'flower', 'top'].map(k => `<g>${L2[k].join('')}</g>`).join('');
}

// h: page height in layout units (width is always 2400); the 2400x3000 composition is centred vertically.
// px: optional [width, height] in device pixels; the SVG scales to fill it exactly.
function themedPage(T, meta, art, h = H, cap = !process.env.NOCAP, px = [W, h]) {
  const off = (h - H) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px[0]}" height="${Math.round(px[1])}" viewBox="0 0 ${W} ${f(h)}" style="display:block">
<defs>${defs.join('')}
<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0.09 0"/></filter>
<filter id="fibres" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="4" seed="9"/><feColorMatrix type="matrix" values="0 0 0 0 0.93  0 0 0 0 0.86  0 0 0 0 0.82  0 0 0 0.35 -0.08"/></filter>
<filter id="wc" x="-20%" y="-20%" width="140%" height="140%">
  <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="7" result="warp"/>
  <feDisplacementMap in="SourceGraphic" in2="warp" scale="11" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="2" result="gr"/>
  <feColorMatrix in="gr" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.22" result="grain"/>
  <feComposite in="d" in2="grain" operator="in" result="tex"/>
  <feGaussianBlur in="tex" stdDeviation="0.6"/>
</filter></defs>
<rect width="${W}" height="${f(h)}" fill="#FDF9F5"/><rect width="${W}" height="${f(h)}" filter="url(#fibres)"/>
<g transform="translate(0 ${f(off)}) translate(1200 1560) scale(1.15) translate(-1200 -1450)"><g filter="url(#wc)">${art}</g></g>
${!cap ? "" : `<text x="${W / 2}" y="${f(2715 + off)}" text-anchor="middle" font-family="Corm" font-style="italic" font-size="92" letter-spacing="6" fill="${T.ink}" fill-opacity="0.9">${meta.month}  ·  ${meta.flower}</text>`}
<rect width="${W}" height="${f(h)}" filter="url(#paper)"/></svg>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontCSS}html,body{margin:0;background:#FDF9F5}</style></head><body>${svg}</body></html>`;
}
const fontCSS = `@font-face{font-family:'Corm';src:url('file://${FONTS}/CormorantGaramond-Italic.ttf');font-style:italic;}`;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  if (process.env.EXPORT) return exportAll(browser);
  const pg = await browser.newPage({ viewport: { width: W, height: H } });
  const only = process.argv[2];
  const outs = [];
  const letters = (process.argv[3] || 'M').split('');
  for (const letter of letters) for (const key of Object.keys(THEMES)) for (const gender of ['girl', 'boy']) {
    const name = `${letter}-${key}-${gender}${process.env.NOCAP ? '-nc' : ''}`;
    if (only && !name.includes(only)) continue;
    seed = 1000 + key.length * 77 + (gender === 'boy' ? 5 : 0); defs = []; gid = 0;
    const html = path.join(OUT, name + '.html');
    const T = makeTheme(key, gender);
    fs.writeFileSync(html, themedPage(T, THEMES[key], composeTheme(T, letter)));
    await pg.goto('file://' + html); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(OUT, name + '.png') }); outs.push(name); console.log('wrote', name);
  }
  // contact sheet
  const cells = outs.map(n => `<figure><img src="${n}.png"><figcaption>${n.replace(/^(\w)-/, '$1 · ')}</figcaption></figure>`).join('');
  const sheet = path.join(OUT, 'sheet.html');
  fs.writeFileSync(sheet, `<html><body style="margin:0;background:#eee;display:grid;grid-template-columns:repeat(${Math.min(outs.length, 6)},360px);gap:20px;padding:20px;font:24px sans-serif">${cells.replace(/<img/g, '<img style="width:360px;display:block"')}</body></html>`);
  const sp = await browser.newPage({ viewport: { width: 20 + Math.min(outs.length, 6) * 380, height: 830 } });
  await sp.goto('file://' + sheet); await sp.waitForTimeout(500); await sp.screenshot({ path: path.join(OUT, 'sheet.png'), fullPage: true });
  await browser.close();
})();

// ---------- print export: every size, JPEG tagged 300 dpi ----------
// EXPORT=1 node generate.js sep-aster-girl [LETTERS]  ->  out/export/<theme>/<size>[-no-caption]/<L>.jpg
const SIZES = { '5x7': [1500, 2100], '8x10': [2400, 3000], '11x14': [3300, 4200], 'A4': [2480, 3508], 'A3': [3508, 4961] };
const NOCAP_SIZES = ['5x7']; // banner cards: print the name's letters without the month caption
// JPEG quality per size, tuned so each size's full A-Z set stays under Etsy's 20 MB per-file limit
const QUALITY = { '5x7': 92, '8x10': 92, 'A4': 90, '11x14': 86, 'A3': 84 };
function setDpi(buf, dpi = 300) { // JFIF APP0: units byte 13, densities 14-17
  if (buf[2] === 0xFF && buf[3] === 0xE0 && buf.toString('ascii', 6, 10) === 'JFIF') {
    buf[13] = 1; buf.writeUInt16BE(dpi, 14); buf.writeUInt16BE(dpi, 16);
  } else throw new Error('no JFIF header to tag with dpi');
  return buf;
}
const jpegSize = buf => { // read SOF0/SOF2 frame dimensions
  for (let i = 2; i < buf.length;) {
    const m = buf[i + 1], len = buf.readUInt16BE(i + 2);
    if (m === 0xC0 || m === 0xC2) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + len;
  }
};
async function exportAll(browser) {
  const only = process.argv[2] || '', letters = (process.argv[3] || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('');
  const pages = {};
  for (const [size, [pw, ph]] of Object.entries(SIZES)) {
    const ctx = await browser.newContext({ viewport: { width: pw, height: ph } });
    pages[size] = { pg: await ctx.newPage(), h: ph * W / pw, pw, ph };
  }
  for (const key of Object.keys(THEMES)) for (const gender of ['girl', 'boy']) {
    const theme = `${key}-${gender}`;
    if (!theme.includes(only)) continue;
    for (const letter of letters) {
      seed = 1000 + key.length * 77 + (gender === 'boy' ? 5 : 0); defs = []; gid = 0;
      const T = makeTheme(key, gender), art = composeTheme(T, letter);
      for (const [size, P] of Object.entries(pages)) for (const cap of NOCAP_SIZES.includes(size) ? [true, false] : [true]) {
        const dir = path.join(OUT, 'export', theme, size + (cap ? '' : '-no-caption'));
        fs.mkdirSync(dir, { recursive: true });
        const html = path.join(OUT, 'export', '_page.html');
        fs.writeFileSync(html, themedPage(T, THEMES[key], art, P.h, cap, [P.pw, P.ph]));
        await P.pg.goto('file://' + html); await P.pg.evaluate(() => document.fonts.ready); await P.pg.waitForTimeout(150);
        const buf = setDpi(await P.pg.screenshot({ type: 'jpeg', quality: QUALITY[size], clip: { x: 0, y: 0, width: P.pw, height: P.ph } }));
        const [w, hh] = jpegSize(buf);
        if (w !== P.pw || hh !== P.ph) throw new Error(`${theme} ${size} ${letter}: got ${w}x${hh}, want ${P.pw}x${P.ph}`);
        fs.writeFileSync(path.join(dir, `${letter}.jpg`), buf);
      }
      console.log('exported', theme, letter);
    }
  }
  await browser.close();
}
