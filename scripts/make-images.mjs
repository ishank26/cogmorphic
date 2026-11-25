// Regenerates the social preview image and icons from SVG. Run: node scripts/make-images.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

// The Orbit logo, from src/assets/logo/
const inner = (file) => readFileSync(new URL(`../src/assets/logo/${file}`, import.meta.url), 'utf8').match(/<\/title>(.*)<\/svg>/s)[1];
const symbol = inner('orbit-symbol-dark.svg'); // cream arc, amber agent dot (32x32)
const amber = inner('orbit-favicon.svg'); // all amber, tuned for tiny sizes (32x32)
const lockup = inner('orbit-lockup-dark.svg'); // symbol + wordmark (368x64)

// Dither dots for the social image background
let dots = '';
for (let y = 0; y < 630; y += 10) {
  for (let x = 560; x < 1200; x += 10) {
    const d = Math.hypot((x - 980) / 420, (y - 250) / 330);
    const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5][((y / 10) % 4) * 4 + ((x / 10) % 4)] / 16;
    if (1 - d > bayer) dots += `<rect x="${x}" y="${y}" width="6" height="6" />`;
  }
}

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b0b0c"/>
  <g fill="#ffb000" opacity="0.35">${dots}</g>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <defs><linearGradient id="fade" x1="0" x2="1"><stop offset="0.35" stop-color="#0b0b0c" stop-opacity="1"/><stop offset="1" stop-color="#0b0b0c" stop-opacity="0"/></linearGradient></defs>
  <g transform="translate(76 76) scale(0.8)">${lockup}</g>
  <text x="80" y="230" font-family="DejaVu Sans Mono, monospace" font-size="20" fill="#a59c8e" letter-spacing="3">AGENTIC AI SOLUTIONS FOR BUSINESSES AND INDIVIDUALS</text>
  <text font-family="DejaVu Sans, sans-serif" font-weight="500" font-size="62" fill="#f3eadb" letter-spacing="-1.5">
    <tspan x="80" y="322">Hand off the routine.</tspan>
    <tspan x="80" y="398">Build what’s <tspan fill="#ffb000">next</tspan>.</tspan>
  </text>
  <path d="M462 419 C 500 413, 550 423, 592 415" stroke="#ffb000" stroke-width="3" fill="none" stroke-linecap="round"/>
  <text x="80" y="540" font-family="DejaVu Sans, sans-serif" font-size="26" fill="#c9bda9">Book a free AI audit · cogmorphic.com</text>
</svg>`;

await sharp(Buffer.from(og)).png({ compressionLevel: 9, palette: true }).toFile(new URL('../public/og-image.png', import.meta.url).pathname);

const square = (mark, pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${32 + 2 * pad} ${32 + 2 * pad}"><rect x="${-pad}" y="${-pad}" width="${32 + 2 * pad}" height="${32 + 2 * pad}" fill="#0b0b0c"/>${mark}</svg>`;
for (const [name, size, mark, pad] of [
  ['logo.png', 512, symbol, 6],
  ['icon-512.png', 512, symbol, 8],
  ['icon-192.png', 192, symbol, 8],
  ['apple-touch-icon.png', 180, symbol, 8],
  ['favicon-32.png', 32, amber, 2],
]) {
  await sharp(Buffer.from(square(mark, pad)), { density: 1200 }).resize(size, size).png({ compressionLevel: 9 }).toFile(new URL(`../public/${name}`, import.meta.url).pathname);
}
console.log('images written');
