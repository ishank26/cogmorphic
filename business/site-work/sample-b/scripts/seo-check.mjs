// Quick on-page SEO check of the built site. Run after `npm run build`: npm run check:seo
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = 'https://cogmorphic.com';
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(DIST);

const sitemap = existsSync(join(DIST, 'sitemap-0.xml')) ? readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8') : '';
const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
let problems = 0;
const rows = [];
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
const get = (html, re) => (html.match(re) || [])[1];

for (const file of files.sort()) {
  const html = readFileSync(file, 'utf8');
  const rel = '/' + relative(DIST, file).replace(/index\.html$/, '');
  const issues = [];
  const title = strip(get(html, /<title>(.*?)<\/title>/s) || '');
  const desc = get(html, /<meta name="description" content="([^"]*)"/) || '';
  const canonical = get(html, /<link rel="canonical" href="([^"]*)"/);
  const noindex = /noindex/.test(get(html, /<meta name="robots" content="([^"]*)"/) || '');
  const h1s = html.match(/<h1[\s>]/g) || [];
  const h2s = html.match(/<h2[\s>]/g) || [];
  if (!title) issues.push('missing <title>');
  else if (title.length > 60) issues.push(`title ${title.length} chars (>60)`);
  if (!desc) issues.push('missing meta description');
  else if (desc.length > 155) issues.push(`description ${desc.length} chars (>155)`);
  if (!/<html lang="/.test(html)) issues.push('missing <html lang>');
  if (h1s.length !== 1) issues.push(`${h1s.length} H1s`);
  if (!noindex) {
    if (!canonical) issues.push('missing canonical');
    else if (!sitemap.includes(`<loc>${canonical}</loc>`)) issues.push('canonical not in sitemap');
    if (!/property="og:image"/.test(html)) issues.push('missing og:image');
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) issues.push('img without alt');
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try { JSON.parse(m[1]); } catch { issues.push('invalid JSON-LD'); }
  }
  const types = [...html.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]);
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = m[1];
    if (href.startsWith('/_astro/')) continue;
    const target = join(DIST, href.endsWith('/') ? href + 'index.html' : href);
    if (!existsSync(target)) issues.push(`broken link ${href}`);
  }
  if (!noindex && !/href="\/free-ai-audit\/#book"|href="#book"/.test(html)) issues.push('no link to the free audit');
  const words = strip(html.replace(/<script.*?<\/script>/gs, '').replace(/<style.*?<\/style>/gs, '')).split(/\s+/).length;
  problems += issues.length;
  rows.push({ page: rel, title: `${title.length}c`, desc: `${desc.length}c`, h1: h1s.length, h2: h2s.length, words, schema: [...new Set(types)].filter((t) => !['ImageObject', 'Place', 'ServiceChannel', 'Offer', 'ListItem', 'Question', 'Answer', 'Audience'].includes(t)).join(' '), issues: issues.join('; ') || 'ok' });
}
if (!/Sitemap: https:\/\/cogmorphic\.com\/sitemap-index\.xml/.test(robots)) { problems++; console.log('robots.txt does not point to the sitemap'); }
console.table(rows);
console.log(problems ? `${problems} problem(s) found` : 'All on-page SEO checks passed');
process.exitCode = problems ? 1 : 0;
