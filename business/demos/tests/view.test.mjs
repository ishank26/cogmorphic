// Page test: runs the built page in jsdom with stubbed window.claude.
// jsdom is not a project dependency. It is used when importable, or from JSDOM_PATH (a node_modules
// folder that holds it); otherwise these tests skip.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import playbook from './fixtures/playbook.js';
import { buildDemo } from '../src/app/engine.js';
import { inlineModules, renderPage } from '../build.mjs';

async function loadJsdom() {
  try {
    return await import('jsdom');
  } catch {
    if (!process.env.JSDOM_PATH) return null;
    try {
      return createRequire(join(process.env.JSDOM_PATH, 'noop.js'))('jsdom');
    } catch {
      return null;
    }
  }
}

const jsdom = await loadJsdom();
const skip = jsdom ? false : 'jsdom not available (set JSDOM_PATH to a node_modules folder that has it)';

const lead = { slug: 'acme', name: 'Acme Homes', short: 'Acme', town: 'Edison', playbook: 'fixture', focus: 'Focus.', guardrail: 'Rule.' };
const demo = buildDemo(playbook, lead);
const html = renderPage(demo, { css: '', script: inlineModules() });
const XSS = '<img src=x onerror=alert(1)>';
const settle = () => new Promise((r) => setTimeout(r, 20));

// Opens the page; claude is what window.claude is set to (left unset when undefined).
async function open(claude) {
  const errors = [];
  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.on('jsdomError', (e) => errors.push(e));
  const dom = new jsdom.JSDOM(html, {
    runScripts: 'dangerously',
    virtualConsole,
    beforeParse(window) {
      window.matchMedia = () => ({ matches: true });
      window.HTMLElement.prototype.scrollIntoView = () => {};
      if (claude !== undefined) window.claude = claude;
    },
  });
  const doc = dom.window.document;
  const $ = (sel) => doc.querySelector(sel);
  const page = {
    doc, $, errors,
    mode: () => $('section.try').dataset.mode,
    status: () => $('.try__status').textContent,
    dd: () => [...doc.querySelectorAll('.try__fields dd')].map((d) => d.textContent),
    async draft(text) {
      $('#try-input').value = text;
      $('.try__run').click();
      await settle();
    },
  };
  await settle();
  return page;
}

// A stub claude: use('user') reports whether the viewer owns the page, and the sample's json()
// streams one bit of text, then does what reply(prompt) says. Calls are recorded.
function stubClaude(reply, { owner = true } = {}) {
  const calls = [];
  const used = [];
  const sample = Object.assign(async () => ({ text: '' }), {
    json: async (prompt, options) => {
      calls.push({ prompt, options });
      options?.onText?.({ text: '{', delta: '{' });
      return reply(prompt);
    },
  });
  const user = { isOwner: async () => owner };
  return { calls, used, claude: { use: async (name) => { used.push(name); return { sample, user }[name] ?? null; } } };
}

test('without window.claude the page shows the example', { skip }, async () => {
  const p = await open(undefined);
  assert.deepEqual(p.errors, []);
  assert.equal(p.mode(), 'example');
  assert.equal(p.$('#try-input').value, demo.quickWin.example);
  assert.equal(p.$('#try-input').readOnly, true);
  assert.equal(p.$('.try__actions').hidden, true);
  assert.equal(p.$('.try__result').hidden, false);
  assert.deepEqual(p.dd(), demo.quickWin.fields.map((f) => demo.quickWin.exampleDraft.fields[f]));
  assert.equal(p.$('.try__reply').textContent, demo.quickWin.exampleDraft.reply);
  assert.equal(p.status(), 'Example result. Live drafting runs when Cogmorphic presents this page.');
  assert.equal(p.$('#try-title').textContent, 'An example message');
  assert.equal(p.$('#try-input').getAttribute('aria-describedby'), 'try-hint');
  assert.equal(p.$('#try-hint').textContent, demo.quickWin.pasteHint);
  assert.equal(p.$('.win-hero__lede').textContent, 'Paste a message with names taken out. Get a draft in seconds. The manager approves every one.');
  assert.equal(p.$('.numbers__note').textContent, 'Your numbers, not ours. The pilot measures the real figure.');
});

test('a viewer who is not the owner keeps the example and is never asked for sample', { skip }, async () => {
  const { calls, used, claude } = stubClaude(() => ({ reply: 'Ok' }), { owner: false });
  const p = await open(claude);
  assert.equal(p.mode(), 'example');
  assert.deepEqual(used, ['user']);
  assert.equal(calls.length, 0);
  assert.equal(p.$('.try__actions').hidden, true);
  assert.deepEqual(p.errors, []);
});

test('page has one h1, the sections in order and the stats in the morning section', { skip }, async () => {
  const p = await open(undefined);
  assert.equal(p.doc.querySelectorAll('h1').length, 1);
  assert.equal(p.$('h1').textContent, demo.quickWin.job);
  assert.equal(p.$('.demo__intro'), null);
  const order = [...p.$('#demo').children].map((el) => el.className);
  assert.deepEqual(order, ['demo__bar', 'win-hero', 'try', 'numbers', 'pilot', 'morning', 'demo__foot', 'toast']);
  assert.ok(p.$('section.morning .demo__stats') && p.$('section.morning .demo__grid') && p.$('section.morning section.log'));
  assert.deepEqual([...p.doc.querySelectorAll('.pilot__terms li')].map((li) => li.textContent), [
    'One job: maintenance requests into work orders for Acme Homes.',
    'The manager approves every draft.',
    'We measure hours spent turning requests into work orders, before and during.',
  ]);
});

test('numbers start empty and fill in once all three are set', { skip }, async () => {
  const p = await open(undefined);
  const inputs = [...p.doc.querySelectorAll('.numbers__grid input')];
  assert.deepEqual(inputs.map((i) => i.value), ['', '', '']);
  assert.equal(p.$('.numbers__grid label').textContent, 'Requests a week');
  const set = (i, v) => { inputs[i].value = v; inputs[i].dispatchEvent(new p.doc.defaultView.Event('input')); };
  set(0, '20');
  set(1, '15');
  assert.equal(p.$('.numbers__num').textContent, '–');
  set(2, '3');
  assert.equal(p.$('.numbers__num').textContent, '17.3');
});

test('the workbench still runs and approves', { skip }, async () => {
  const p = await open(undefined);
  p.$('.work__run').click();
  assert.equal(p.$('.queue__item[aria-current] .status').dataset.status, 'review');
  p.$('.review__actions .btn--primary').click();
  assert.equal(p.$('[data-stat="handled"]').textContent, '1');
});

test('live drafting renders Claude values as text only', { skip }, async () => {
  const { calls, claude } = stubClaude(() => ({ fields: { Priority: XSS, Unit: '4B' }, reply: `Thanks. ${XSS}` }));
  const p = await open(claude);
  assert.equal(calls.length, 0, 'no call at load');
  assert.equal(p.mode(), 'live');
  assert.equal(p.$('#try-title').textContent, 'Try it on a real message');
  assert.equal(p.$('#try-input').value, '');
  assert.equal(p.$('#try-input').placeholder, 'Hi, this is Dana in 4B.');
  assert.equal(p.$('.try__result').hidden, true);
  await p.draft('Sink leaks in 4B.');
  assert.equal(calls.length, 1);
  const { onText, ...options } = calls[0].options;
  assert.deepEqual({ ...options }, { modelTier: 'quick', cache: false }); // spread: the page's object is from another realm
  assert.equal(typeof onText, 'function');
  assert.ok(calls[0].prompt.includes('<<<MESSAGE\nSink leaks in 4B.\nMESSAGE>>>'));
  assert.deepEqual(p.dd(), [XSS, '4B', 'Not stated', 'Not stated']);
  assert.equal(p.$('.try__reply').textContent, `Thanks. ${XSS}`);
  assert.equal(p.doc.querySelector('.try__result img'), null);
  assert.equal(p.doc.querySelectorAll('img').length, 0);
  assert.match(p.status(), /^Drafted in \d+\.\d s$/);
  assert.equal(p.mode(), 'live');
  assert.equal(p.doc.activeElement, p.$('.try__run'), 'focus returns to Draft it');
  assert.deepEqual(p.errors, []);
});

test('Use an example fills the box; Draft it needs text', { skip }, async () => {
  const { calls, claude } = stubClaude(() => ({ reply: 'Ok' }));
  const p = await open(claude);
  await p.draft('   ');
  assert.equal(calls.length, 0);
  assert.equal(p.status(), 'Paste a message first.');
  p.$('.try__example').click();
  assert.equal(p.$('#try-input').value, demo.quickWin.example);
});

test('rate_limited shows the busy copy and keeps live mode', { skip }, async () => {
  const { claude } = stubClaude(() => Promise.reject({ code: 'rate_limited', message: 'slow down' }));
  const p = await open(claude);
  await p.draft('Hello');
  assert.equal(p.status(), 'Busy right now. Try again in a minute.');
  assert.equal(p.mode(), 'live');
  assert.equal(p.$('.try__run').disabled, false);
  assert.equal(p.$('.try__result').hidden, true);
});

test('other failures and unusable JSON show the generic copy', { skip }, async () => {
  const replies = [() => Promise.reject({ code: 'upstream_error' }), () => ['not', 'a', 'draft'], () => ({ reply: '  ' }), () => Promise.reject(new Error('x'))];
  for (const reply of replies) {
    const p = await open(stubClaude(reply).claude);
    await p.draft('Hello');
    assert.equal(p.status(), 'That did not come through. Try again.');
  }
  const p = await open(stubClaude(() => Promise.reject({ code: 'session_expired' })).claude);
  await p.draft('Hello');
  assert.equal(p.status(), 'Sign in to Claude again to draft live.');
});

test('not_granted returns to example mode', { skip }, async () => {
  const { calls, claude } = stubClaude(() => Promise.reject({ code: 'not_granted', message: 'declined' }));
  const p = await open(claude);
  await p.draft('Hello');
  assert.equal(calls.length, 1);
  assert.equal(p.mode(), 'example');
  assert.equal(p.status(), 'Live drafting is off in this view.');
  assert.equal(p.$('#try-input').value, demo.quickWin.example);
  assert.equal(p.$('.try__actions').hidden, true);
  assert.deepEqual(p.dd(), demo.quickWin.fields.map((f) => demo.quickWin.exampleDraft.fields[f]));
});

test('rate_limited on the account usage limit returns to example mode', { skip }, async () => {
  const { claude } = stubClaude(() => Promise.reject({ code: 'rate_limited', reason: 'usage_limit', message: 'limit' }));
  const p = await open(claude);
  await p.draft('Hello');
  assert.equal(p.mode(), 'example');
  assert.equal(p.status(), 'This Claude account hit its usage limit. Use the example for now.');
  assert.equal(p.$('#try-input').value, demo.quickWin.example);
});

test('use() resolving null keeps example mode', { skip }, async () => {
  const p = await open({ use: async () => null });
  assert.equal(p.mode(), 'example');
  assert.deepEqual(p.errors, []);
});
