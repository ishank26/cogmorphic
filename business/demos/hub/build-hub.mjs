// Builds hub/index.html: private list of all published demos, grouped by playbook.
import { readFileSync, writeFileSync } from 'node:fs';
import leads from '../src/domain/leads.js';
const urls = Object.fromEntries(readFileSync(new URL('../published.tsv', import.meta.url), 'utf8')
  .trim().split('\n').map(l => l.split('\t')));
const groups = [
  ['property', 'Property management', 'Work orders and tenant replies'],
  ['home-services', 'Home services', 'Booking, dispatch and follow-up'],
  ['insurance', 'Insurance agencies', 'Policy changes and service requests'],
  ['wealth', 'Wealth management', 'Client service paperwork'],
  ['accounting', 'Accounting', 'Document chasing and client replies'],
  ['law', 'Law firms', 'Intake and matter admin'],
  ['construction', 'Construction and engineering', 'Field reports, RFIs and inspections'],
  ['logistics', 'Logistics and trucking', 'Dispatch changes and delivery updates'],
  ['manufacturing', 'Manufacturing', 'Quality paperwork'],
  ['distribution', 'Distribution', 'Order status, backorders and quotes'],
  ['medical-billing', 'Medical billing', 'Claims follow-up'],
];
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const top = 'midlantic-property-management';
let missing = leads.filter(l => !urls[l.slug]).map(l => l.slug);
if (missing.length) throw new Error('No URL for ' + missing.join(', '));
const known = new Set(groups.map(g => g[0]));
const stray = leads.filter(l => !known.has(l.playbook));
if (stray.length) throw new Error('Unknown playbook ' + stray.map(l => l.playbook));
const row = l => `<li><a href="${esc(urls[l.slug])}" target="_blank" rel="noopener"><span class="n">${esc(l.name)}</span><span class="t">${esc(l.town || '')}</span><span class="go" aria-hidden="true">Open &#8599;</span><span class="sr">(opens in new tab)</span></a></li>`;
const tl = leads.find(l => l.slug === top);
const sections = groups.map(([k, name, what]) => {
  const ls = leads.filter(l => l.playbook === k);
  if (!ls.length) return '';
  return `<section><header><h2>${esc(name)}</h2><p>${esc(what)} &middot; <span class="mono">${ls.length}</span></p></header><ul>${ls.map(row).join('')}</ul></section>`;
}).join('');
const html = `<title>Cogmorphic Lead Demos</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap">
<style>
:root{--bg:#0b0b0c;--raised:#111112;--line:#222120;--text:#f3eadb;--dim:#a59c8e;--accent:#ffb000;--accent-ink:#160f00;--edge:#55504a;color-scheme:dark}
@media (prefers-color-scheme: light){:root:not([data-theme="dark"]){--bg:#f6f2ea;--raised:#fffdf8;--line:#e2dacb;--text:#1a1712;--dim:#5b5447;--accent:#8a5a00;--accent-ink:#fffdf8;--edge:#a89d8a;color-scheme:light}}
:root[data-theme="light"]{--bg:#f6f2ea;--raised:#fffdf8;--line:#e2dacb;--text:#1a1712;--dim:#5b5447;--accent:#8a5a00;--accent-ink:#fffdf8;--edge:#a89d8a;color-scheme:light}
body{background:var(--bg);color:var(--text);font:15px/1.5 Inter,system-ui,-apple-system,'Segoe UI',sans-serif;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:32px 56px}
main{max-width:860px;margin:0 auto;display:grid;gap:28px}
.mono,.kick{font-family:'Space Mono',ui-monospace,Menlo,monospace}
.kick{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin:0}
h1{font-size:clamp(28px,5vw,40px);line-height:1.1;margin:6px 0 8px;text-wrap:balance;letter-spacing:-.01em}
.lede{color:var(--dim);margin:0;max-width:60ch}
.stats{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.stats span{border:1px solid var(--line);border-radius:999px;padding:4px 12px;font-size:13px;color:var(--dim)}
.stats b{color:var(--text);font-family:'Space Mono',monospace;font-weight:700}
.first{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;background:var(--raised);border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:10px;padding:16px 18px}
.first p{margin:0}.first .n{font-weight:600;font-size:17px}.first .t{color:var(--dim);font-size:13px}
.btn{background:var(--accent);color:var(--accent-ink);font-weight:600;text-decoration:none;border-radius:8px;padding:10px 16px;white-space:nowrap}
.btn:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
section{display:grid;gap:8px}
section header{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 12px;border-bottom:1px solid var(--line);padding-bottom:6px}
h2{font-size:17px;margin:0}section header p{margin:0;color:var(--dim);font-size:13px}
ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}
li a{display:grid;grid-template-columns:1fr auto;gap:2px 8px;text-decoration:none;color:var(--text);background:var(--raised);border:1px solid var(--edge);border-radius:10px;padding:12px 14px;min-width:0}
li a:hover{border-color:var(--accent)}
li a:visited .go{color:var(--dim)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.n{font-weight:500;min-width:0;overflow-wrap:anywhere}.t{grid-column:1;color:var(--dim);font-size:13px}
.go{grid-column:2;grid-row:1/3;align-self:center;color:var(--accent);font-size:13px;font-family:'Space Mono',monospace}
footer{color:var(--dim);font-size:13px;border-top:1px solid var(--line);padding-top:14px}
</style>
<main>
<div>
<p class="kick">Cogmorphic &middot; demo set</p>
<h1>One working demo per lead</h1>
<p class="lede">Each page offers one quick win: paste a real message, get a draft to approve, and see the hours it saves with your own numbers. Then a two-week pilot.</p>
<div class="stats"><span><b>${leads.length}</b> demos</span><span><b>${new Set(leads.map(l=>l.playbook)).size}</b> industries</span></div>
</div>
${tl ? `<div class="first"><p><span class="n">Start with ${esc(tl.name)}</span><br><span class="t">Strongest lead</span></p><a class="btn" aria-label="Open ${esc(tl.name)} demo (opens in new tab)" href="${esc(urls[tl.slug])}" target="_blank" rel="noopener">Open demo</a></div>` : ''}
${sections}
<footer>Private until you share each page. Each names only its own lead.</footer>
</main>
`;
writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('ok', leads.length, html.length);
