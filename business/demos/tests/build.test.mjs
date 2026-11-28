import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadPlaybooks, demosFor, inlineModules, renderPage, pageTitle } from '../build.mjs';
import leads from '../src/domain/leads.js';

const CHANNELS = ['email', 'call', 'text', 'form', 'sensor', 'system'];
const playbooks = await loadPlaybooks();

const PLACEHOLDERS = /\{([^{}\s]+)\}/g;
const SENTENCE_KEYS = ['company', 'town', 'approver', 'trade'];

// Yields [path, string] for every string inside value.
function* strings(value, path = '') {
  if (typeof value === 'string') yield [path, value];
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) yield* strings(v, `${path}.${k}`);
}

test('every playbook is used by a lead and every lead has a playbook', () => {
  const used = new Set(leads.map((l) => l.playbook));
  assert.deepEqual(Object.keys(playbooks).filter((id) => !used.has(id)), [], 'unused playbooks');
  assert.deepEqual(leads.filter((l) => !playbooks[l.playbook]).map((l) => l.slug), [], 'leads without a playbook');
});

test('lead systems keys exist in the playbook defaults', () => {
  for (const l of leads) {
    const known = Object.keys(playbooks[l.playbook]?.defaults.systems ?? {});
    for (const key of Object.keys(l.systems ?? {})) assert.ok(known.includes(key), `${l.slug}: systems.${key} not in ${l.playbook} defaults`);
  }
});

test('system placeholders appear only in step.system', () => {
  const sources = [
    ...Object.values(playbooks).map((pb) => [pb.id, { promise: pb.promise, agent: pb.agent, items: pb.items }]),
    ...leads.map((l) => [l.slug, { focus: l.focus, guardrail: l.guardrail }]),
  ];
  for (const [name, value] of sources) {
    for (const [path, text] of strings(value)) {
      if (/\.steps\.\d+\.system$/.test(path)) continue;
      for (const [, key] of text.matchAll(PLACEHOLDERS)) assert.ok(SENTENCE_KEYS.includes(key), `${name}${path}: {${key}} in a sentence`);
    }
  }
});

test('playbooks follow the schema', () => {
  for (const pb of Object.values(playbooks)) {
    assert.equal(new Set(pb.items.map((i) => i.id)).size, pb.items.length, `${pb.id}: unique item ids`);
    for (const it of pb.items) {
      const at = `${pb.id}/${it.id}`;
      assert.ok(CHANNELS.includes(it.channel), `${at}: channel ${it.channel}`);
      assert.ok(it.steps.length >= 3 && it.steps.length <= 6, `${at}: 3-6 steps`);
      assert.ok(it.draft.fields.length <= 5, `${at}: 0-5 fields`);
      for (const key of ['from', 'receivedAt', 'subject', 'body']) assert.equal(typeof it[key], 'string', `${at}: ${key}`);
      for (const key of ['kind', 'to', 'body']) assert.equal(typeof it.draft[key], 'string', `${at}: draft.${key}`);
    }
  }
});

test('leads have unique kebab-case slugs and known features', () => {
  assert.equal(new Set(leads.map((l) => l.slug)).size, leads.length);
  for (const l of leads) {
    assert.match(l.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, l.slug);
    for (const f of l.features ?? []) assert.ok(['sensor', 'spanish', 'hvac', 'exterior', 'contractor', 'engineering', 'forwarder', 'estate', 'litigation', 'service'].includes(f), `${l.slug}: feature ${f}`);
    for (const key of ['name', 'town', 'focus', 'guardrail']) assert.equal(typeof l[key], 'string', `${l.slug}: ${key}`);
  }
});

test('every lead resolves with no leftover placeholders and at least 3 items', () => {
  for (const demo of demosFor(leads, playbooks)) {
    const text = JSON.stringify(demo);
    assert.doesNotMatch(text, /\{[^{}\s"]+\}/, `${demo.slug}: leftover placeholder`);
    assert.ok(demo.items.length >= 4 && demo.items.length <= 5, `${demo.slug}: ${demo.items.length} items`);
  }
});

test('no heading or sentence starts lowercase', () => {
  for (const d of demosFor(leads, playbooks)) {
    const texts = [['agent', d.agent], ['promise', d.promise], ['focus', d.focus], ['guardrail', d.guardrail]];
    for (const it of d.items) {
      texts.push([`${it.id}.subject`, it.subject], [`${it.id}.body`, it.body], [`${it.id}.draft.kind`, it.draft.kind],
        [`${it.id}.draft.body`, it.draft.body], [`${it.id}.risk`, it.risk ?? 'X'], ...it.steps.map((st, i) => [`${it.id}.step ${i}`, st.text]));
    }
    for (const [where, text] of texts) assert.doesNotMatch(text, /^[a-z]/, `${d.slug} ${where}: ${text.slice(0, 40)}`);
  }
});

test('built pages are page content only, with no em dash and the right company', () => {
  const css = readFileSync(new URL('../src/ui/styles.css', import.meta.url), 'utf8');
  const script = inlineModules();
  for (const demo of demosFor(leads, playbooks)) {
    const html = renderPage(demo, { css, script });
    assert.doesNotMatch(html, /<!doctype|<html|<head|<body/i, demo.slug);
    assert.ok(!html.includes('—'), `${demo.slug}: em dash`);
    assert.ok(html.startsWith(`<title>`), demo.slug);
    assert.ok(html.includes(JSON.stringify(demo.company).slice(1, -1).replace(/</g, '\\u003c')), `${demo.slug}: company`);
    assert.equal(html.match(/<script>/g).length, 1);
  }
});

test('page title is short company + agent kind + demo', () => {
  assert.equal(pageTitle({ short: 'Midlantic', agent: 'Work-order agent' }), 'Midlantic work-order demo');
  assert.equal(pageTitle({ short: 'First Choice', agent: 'Dispatch agent' }), 'First Choice dispatch demo');
  for (const l of leads) assert.equal(typeof l.short, 'string', `${l.slug}: short`);
});

test('inlined script parses as a classic script', () => {
  assert.doesNotThrow(() => new Function(inlineModules()));
});

test('every lead resolves a quick win', () => {
  const missing = demosFor(leads, playbooks).filter((d) => !d.quickWin).map((d) => d.slug);
  assert.deepEqual(missing, [], `${missing.length} lead(s) without a quick win`);
});

test('quick wins follow the schema', () => {
  const str = (v) => typeof v === 'string' && v.length > 0;
  for (const d of demosFor(leads, playbooks)) {
    const q = d.quickWin;
    const at = (k) => `${d.slug} quickWin.${k}`;
    for (const k of ['job', 'unit', 'units', 'pasteLabel', 'task', 'draftKind', 'replyTo', 'example', 'measure']) assert.ok(str(q[k]), at(k));
    assert.ok(q.job.length <= 70 && !q.job.endsWith('.'), at('job'));
    for (const k of ['job', 'task', 'example']) assert.match(q[k], /^[A-Z0-9]/, at(k));
    assert.ok(str(q.pasteHint), at('pasteHint'));
    assert.ok(Array.isArray(q.rules) && q.rules.length <= 4 && q.rules.every(str), at('rules'));
    assert.ok(q.fields.length >= 3 && q.fields.length <= 5 && q.fields.every(str), at('fields'));
    assert.deepEqual(Object.keys(q.exampleDraft.fields).sort(), [...q.fields].sort(), at('exampleDraft.fields'));
    assert.ok(Object.values(q.exampleDraft.fields).every(str) && str(q.exampleDraft.reply), at('exampleDraft'));
    // The example must pass the same limits a live draft gets: 160-char fields, replies of at most 90 words.
    assert.ok(Object.values(q.exampleDraft.fields).every((v) => v.length <= 160), at('exampleDraft.fields length'));
    assert.ok(q.exampleDraft.reply.split(/\s+/).filter(Boolean).length <= 90, at('exampleDraft.reply words'));
    assert.ok(q.next.length >= 2 && q.next.length <= 3 && q.next.every((n) => str(n) && n.length <= 60), at('next'));
    if (leads.find((l) => l.slug === d.slug).playbook === 'medical-billing') assert.match(q.pasteHint ?? '', /patient/i, at('pasteHint'));
  }
});
