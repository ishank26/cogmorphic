// node build.mjs -> dist/<slug>.html (one self-contained page per lead) and dist/index.json.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildDemo } from './src/app/engine.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap';
// Modules inlined into each page, in dependency order.
const MODULES = ['src/app/engine.js', 'src/ui/view.js'];

export async function loadPlaybooks(dir = join(ROOT, 'src/domain/playbooks')) {
  const playbooks = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.js')).sort()) {
    const pb = (await import(pathToFileURL(join(dir, file)).href)).default;
    if (`${pb.id}.js` !== file) throw new Error(`Playbook file ${file} has id "${pb.id}"`);
    playbooks[pb.id] = pb;
  }
  return playbooks;
}

export function demosFor(leads, playbooks) {
  return leads.map((lead) => {
    const pb = playbooks[lead.playbook];
    if (!pb) throw new Error(`Lead ${lead.slug}: no playbook "${lead.playbook}"`);
    return buildDemo(pb, lead);
  });
}

// Turns ESM files into one classic script. Each module becomes a function scope that returns its
// exports; `import { a } from './x.js'` becomes `const { a } = <x's exports>`. Any other import or
// export form is rejected so nothing is silently dropped.
export function inlineModules(files = MODULES, root = ROOT) {
  const ids = new Map(files.map((f, i) => [resolve(root, f), `__m${i}`]));
  const parts = files.map((file) => {
    const abs = resolve(root, file);
    const exported = [];
    const lines = readFileSync(abs, 'utf8').split('\n').map((line, n) => {
      const where = `${file}:${n + 1}`;
      const imp = line.match(/^import\s*\{([^}]*)\}\s*from\s*'(\.{1,2}\/[^']+)';?\s*$/);
      if (imp) {
        const id = ids.get(resolve(dirname(abs), imp[2]));
        if (!id) throw new Error(`${where}: import of a module not inlined: ${imp[2]}`);
        return `const {${imp[1]}} = ${id};`;
      }
      const exp = line.match(/^export\s+((?:async\s+)?function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/);
      if (exp) {
        exported.push(exp[2]);
        return line.replace(/^export\s+/, '');
      }
      if (/^\s*(import|export)\b|\bimport\s*\(/.test(line)) throw new Error(`${where}: unsupported module syntax: ${line.trim()}`);
      return line;
    });
    return `const ${ids.get(abs)} = (() => {\n${lines.join('\n')}\nreturn { ${exported.join(', ')} };\n})();`;
  });
  const script = `(() => {\n'use strict';\n${parts.join('\n')}\n`
    + `${ids.get(resolve(root, MODULES.at(-1)))}.mount(document.getElementById('demo'), JSON.parse(document.getElementById('demo-data').textContent));\n})();`;
  if (/<\/script/i.test(script)) throw new Error('Inlined script contains </script');
  return script;
}

export function pageTitle(demo) {
  const kind = demo.agent.replace(/\s+agent$/i, '').replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase());
  return `${demo.short} ${kind} demo`;
}

const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function renderPage(demo, { css, script }) {
  const data = JSON.stringify(demo).replace(/</g, '\\u003c');
  return [
    `<title>${escapeHtml(pageTitle(demo))}</title>`,
    '<meta name="claude:viewport-fit-sides" content="cover">',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${FONTS.replace(/&/g, '&amp;')}">`,
    `<style>\n${css}\n</style>`,
    '<main class="demo" id="demo"></main>',
    `<script type="application/json" id="demo-data">${data}</script>`,
    `<script>\n${script}\n</script>`,
    '',
  ].join('\n');
}

async function main() {
  const leads = (await import(pathToFileURL(join(ROOT, 'src/domain/leads.js')).href)).default;
  const demos = demosFor(leads, await loadPlaybooks());
  const cssPath = join(ROOT, 'src/ui/styles.css');
  if (!existsSync(cssPath)) throw new Error('src/ui/styles.css is missing');
  const css = readFileSync(cssPath, 'utf8');
  const script = inlineModules();
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  for (const demo of demos) writeFileSync(join(ROOT, 'dist', `${demo.slug}.html`), renderPage(demo, { css, script }));
  const index = demos.map((d, i) => ({ slug: d.slug, company: d.company, playbook: leads[i].playbook, title: pageTitle(d) }));
  writeFileSync(join(ROOT, 'dist/index.json'), `${JSON.stringify(index, null, 2)}\n`);
  console.log(`Built ${demos.length} pages in dist/`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
