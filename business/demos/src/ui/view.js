// DOM rendering and event wiring only. All state changes go through the engine.
import { DECIDED, createSession, select, startItem, finishItem, editDraft, approve, reject, summary, MAX_PASTE, buildPrompt, parseDraft, hoursBack } from '../app/engine.js';

const STEP_MS = 450;
// Live drafting: codes that turn it off for this view, and the line shown for the rest.
const OFF = ['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'];
const ERRORS = {
  rate_limited: 'Busy right now. Try again in a minute.',
  session_expired: 'Sign in to Claude again to draft live.',
  refused: 'Claude would not draft this one. Try another message.',
};
const ERROR_OTHER = 'That did not come through. Try again.';
const EXAMPLE_NOTE = 'Example result. Live drafting runs when Cogmorphic presents this page.';
const OFF_NOTE = 'Live drafting is off in this view.';
const USAGE_NOTE = 'This Claude account hit its usage limit. Use the example for now.';
const TRY_LIVE = 'Try it on a real message';
const TRY_EXAMPLE = 'An example message';
const CHANNELS = { email: 'Email', call: 'Call', text: 'Text', form: 'Web form', sensor: 'Sensor', system: 'System' };
const STATUS = { new: 'New', working: 'Working', review: 'Ready for review', approved: 'Approved', edited: 'Approved, edited', rejected: 'Rejected' };

const MARK = '<svg class="brand__mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" focusable="false">'
  + '<path d="M21.53 8.2A10.5 10.5 0 1 0 21.53 23.8" fill="none" stroke="currentColor" stroke-width="2.4"/>'
  + '<g fill="currentColor"><circle cx="21.53" cy="8.2" r="2.9"/><circle cx="4" cy="16" r="2.9"/>'
  + '<circle cx="21.53" cy="23.8" r="2.9"/><circle cx="27" cy="16" r="3.3"/></g></svg>';

// Tiny element helper: h('p.class', { attr }, ...children). Text is always set as text, never HTML.
function h(spec, attrs = {}, ...children) {
  const [tag, ...classes] = spec.split('.');
  const el = document.createElement(tag);
  if (classes.length) el.className = classes.join(' ');
  for (const [k, v] of Object.entries(attrs)) if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
  el.append(...children.flat().filter((c) => c != null));
  return el;
}

function listJoin(words) {
  return words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words.at(-1)}`;
}

function clock() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const upperFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = (s) => s.replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase());
const firstSentence = (s) => s.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? s;

// Element whose text comes from Claude or the lead: set through textContent only.
function textEl(tag, value) {
  const el = document.createElement(tag);
  el.textContent = value;
  return el;
}

// The quick win: hero, try it on a real message, the lead's own numbers and the pilot ask.
// Returns the sections and connect(), which lights live drafting up once the page is rendered.
function quickWin(demo) {
  const q = demo.quickWin;
  const example = { fields: q.fields.map((f) => [f, q.exampleDraft.fields[f]]), reply: q.exampleDraft.reply };
  let sample = null;

  const els = {
    title: h('h2.panel__title', { id: 'try-title' }, TRY_LIVE),
    input: h('textarea.try__input', { id: 'try-input', maxlength: String(MAX_PASTE), rows: '6', 'aria-describedby': q.pasteHint ? 'try-hint' : null }),
    run: h('button.btn.btn--primary.try__run', { type: 'button' }, 'Draft it'),
    example: h('button.btn.btn--ghost.try__example', { type: 'button' }, 'Use an example'),
    status: h('p.try__status', { role: 'status', 'aria-live': 'polite' }),
    fields: h('dl.try__fields'),
    reply: h('p.try__reply'),
  };
  els.actions = h('div.try__actions', {}, els.run, els.example);
  els.result = h('div.try__result', {},
    h('h3.try__kind', {}, q.draftKind), els.fields,
    h('h3.try__replyto', {}, `Reply to the ${q.replyTo}`), els.reply,
    h('p.try__note', {}, `Draft only. The ${demo.approver} reviews it before anything is sent. This page saves nothing.`));
  els.try = h('section.try', { 'aria-labelledby': 'try-title' },
    els.title,
    h('label', { for: 'try-input' }, q.pasteLabel),
    q.pasteHint ? h('p.try__hint', { id: 'try-hint' }, q.pasteHint) : null,
    els.input, els.actions, els.status, els.result);

  function showDraft({ fields, reply }) {
    els.fields.replaceChildren(...fields.flatMap(([k, v]) => [textEl('dt', k), textEl('dd', v)]));
    els.reply.textContent = reply;
    els.result.hidden = false;
  }

  function exampleMode(note) {
    els.try.dataset.mode = 'example';
    els.title.textContent = TRY_EXAMPLE;
    els.input.value = q.example;
    els.input.readOnly = true;
    els.input.removeAttribute('placeholder');
    els.actions.hidden = true;
    showDraft(example);
    els.status.textContent = note;
  }

  function liveMode() {
    els.try.dataset.mode = 'live';
    els.title.textContent = TRY_LIVE;
    els.input.value = '';
    els.input.readOnly = false;
    els.input.placeholder = firstSentence(q.example);
    els.actions.hidden = false;
    els.result.hidden = true;
    els.status.textContent = '';
  }

  // One call per click, never retried and never cached. Off codes and a used-up account drop back to
  // the example for the rest of the view. The time shown runs from Claude's first text, so the
  // consent dialog on the first call is not counted.
  async function draft() {
    if (!sample || els.try.dataset.mode !== 'live') return;
    const text = els.input.value.trim();
    if (!text) {
      els.status.textContent = 'Paste a message first.';
      els.input.focus();
      return;
    }
    els.try.dataset.mode = 'busy';
    els.run.disabled = true;
    els.example.disabled = true;
    els.result.hidden = true;
    els.status.textContent = 'Drafting...';
    const started = performance.now();
    let firstText = null;
    let result = null;
    let code = null;
    let reason = null;
    try {
      const raw = await sample.json(buildPrompt(demo, text), {
        modelTier: 'quick', cache: false,
        onText: () => { firstText ??= performance.now(); },
      });
      result = parseDraft(demo, raw);
      if (!result) code = 'invalid_json';
    } catch (e) {
      code = e?.code;
      reason = e?.reason;
    }
    const seconds = (performance.now() - (firstText ?? started)) / 1000;
    els.run.disabled = false;
    els.example.disabled = false;
    const usedUp = code === 'rate_limited' && reason === 'usage_limit';
    if (OFF.includes(code) || usedUp) {
      sample = null;
      exampleMode(usedUp ? USAGE_NOTE : OFF_NOTE);
    } else {
      els.try.dataset.mode = 'live';
      if (result) {
        showDraft(result);
        els.status.textContent = `Drafted in ${seconds.toFixed(1)} s`;
      } else {
        els.status.textContent = Object.hasOwn(ERRORS, code) ? ERRORS[code] : ERROR_OTHER;
      }
    }
    // The run button lost focus when it was disabled; give it back instead of leaving focus on the body.
    if (document.activeElement === document.body) (els.actions.hidden ? els.input : els.run).focus();
  }

  // Live drafting is for the owner presenting the page. Every other viewer, a lead included, keeps the example.
  async function connect() {
    const claude = window.claude;
    if (!claude || typeof claude.use !== 'function') return;
    let found = null;
    try {
      const user = await claude.use('user');
      if (!((await user?.isOwner()) ?? false)) return;
      found = await claude.use('sample');
    } catch {
      return;
    }
    if (found && typeof found.json === 'function') {
      sample = found;
      liveMode();
    }
  }

  els.run.addEventListener('click', draft);
  els.example.addEventListener('click', () => {
    els.input.value = q.example;
    els.input.focus();
  });
  exampleMode(EXAMPLE_NOTE);

  // The lead's numbers: empty until all three are filled in.
  const inputs = ['num-week', 'num-now', 'num-check'].map((id) => h('input', { id, type: 'number', inputmode: 'decimal', min: '0', step: 'any' }));
  const labels = [`${upperFirst(q.units)} a week`, 'Minutes each today', 'Minutes to check a draft'];
  const outNum = h('span.numbers__num', {}, '–');
  const read = (input) => (input.value === '' ? NaN : Number(input.value));
  const updateNumbers = () => {
    const [perWeek, minutesNow, minutesCheck] = inputs.map(read);
    const hours = hoursBack({ perWeek, minutesNow, minutesCheck });
    outNum.textContent = hours == null ? '–' : hours.toLocaleString('en-US', { maximumFractionDigits: 1 });
  };
  inputs.forEach((input) => input.addEventListener('input', updateNumbers));

  const sections = [
    h('section.win-hero', {},
      h('p.kicker', {}, `Quick win for ${demo.company}`),
      h('h1.win-hero__title', {}, q.job),
      h('p.win-hero__lede', {}, `Paste a message with names taken out. Get a draft in seconds. The ${demo.approver} approves every one.`)),
    els.try,
    h('section.numbers', { 'aria-labelledby': 'numbers-title' },
      h('h2.panel__title', { id: 'numbers-title' }, 'Your numbers'),
      h('div.numbers__grid', {}, labels.map((text, i) => h('label', { for: inputs[i].id }, text, inputs[i]))),
      h('output.numbers__out', { for: inputs.map((i) => i.id).join(' ') }, outNum, h('span.numbers__label', {}, 'hours a month back')),
      h('p.numbers__note', {}, 'Your numbers, not ours. The pilot measures the real figure.')),
    h('section.pilot', { 'aria-labelledby': 'pilot-title' },
      h('h2.panel__title', { id: 'pilot-title' }, 'Start with a two-week pilot'),
      h('ul.pilot__terms', {},
        h('li', {}, `One job: ${lowerFirst(q.job)}.`),
        h('li', {}, `The ${demo.approver} approves every draft.`),
        h('li', {}, `We measure ${q.measure}, before and during.`)),
      h('h3.pilot__next', {}, 'When it works, next:'),
      h('ol.pilot__list', {}, q.next.map((n) => h('li', {}, n)))),
  ];
  return { sections, connect };
}

export function mount(root, demo) {
  const byId = Object.fromEntries(demo.items.map((it) => [it.id, it]));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const systems = [...new Set(demo.items.flatMap((it) => it.steps.map((s) => s.system)))];
  let session = createSession(demo);
  let timer = null;
  let toastTimer = null;
  let shown = null; // item whose card was last scrolled into view

  // Static skeleton, built once. Dynamic parts are filled by render().
  const stat = (key, label) => h('div.stat', {}, h('span.stat__num', { 'data-stat': key }, '0'), h('span.stat__label', {}, label));
  const queueButtons = demo.items.map((it) => {
    const btn = h('button.queue__item', { type: 'button', 'data-id': it.id },
      h('span.chan', { 'data-channel': it.channel }, CHANNELS[it.channel] ?? it.channel),
      h('span.queue__from', {}, it.from),
      h('span.queue__subject', {}, it.subject),
      h('span.queue__time', {}, it.receivedAt),
      h('span.status'));
    btn.addEventListener('click', () => choose(it.id));
    return btn;
  });

  const els = {
    meta: h('p.message__meta'), subject: h('p.message__subject'), body: h('p.message__body'),
    steps: h('ol.steps'),
    run: h('button.btn.btn--primary.work__run', { type: 'button' }, 'Run agent'),
    empty: h('p.empty', {}, 'Run the agent to see the draft it prepares.'),
    kind: h('p.draft__kind'), to: h('p.draft__to'), fields: h('dl.draft__fields'),
    text: h('textarea.draft__body', { id: 'draft-body', rows: '8', readonly: true }),
    risk: h('p.draft__risk'),
    approve: h('button.btn.btn--primary', { type: 'button' }, 'Approve'),
    edit: h('button.btn', { type: 'button' }, 'Edit'),
    reject: h('button.btn.btn--ghost', { type: 'button' }, 'Reject'),
    done: h('p.review__done'),
    log: h('ol.log__list'),
    logEmpty: h('p.empty', {}, 'Decisions appear here with the time they were made.'),
    reset: h('button.btn.btn--ghost.demo__reset', { type: 'button' }, 'Reset demo'),
    toast: h('div.toast', { role: 'status', 'aria-live': 'polite' }),
  };
  els.actions = h('div.review__actions', {}, els.approve, els.edit, els.reject);
  els.draft = h('div.draft', {}, els.kind, els.to, els.fields,
    h('label', { for: 'draft-body' }, 'Draft text'), els.text, els.risk);

  const win = quickWin(demo);
  root.replaceChildren(
    h('header.demo__bar', {},
      h('div.brand', {}, wrapHtml(MARK), h('span', {}, 'Cogmorphic')),
      h('p.demo__for', {}, `Prepared for ${demo.company}, ${demo.town}`),
      h('span.demo__badge', {}, 'Sample data')),
    ...win.sections,
    h('section.morning', { 'aria-labelledby': 'morning-title' },
      h('h2.panel__title', { id: 'morning-title' }, 'A morning with the agent'),
      h('p.demo__promise', {}, demo.promise),
      h('p.demo__focus', {}, demo.focus),
      h('div.demo__stats', {}, stat('handled', 'Handled'), stat('approved', 'Approved'), stat('steps', 'Steps run'), stat('systems', 'Systems used')),
      h('div.demo__grid', {},
        h('section.queue', { 'aria-labelledby': 'queue-title' },
          h('h2.panel__title', { id: 'queue-title' }, 'Incoming'),
          h('ul.queue__list', {}, queueButtons.map((b) => h('li', {}, b)))),
        h('section.work', { 'aria-labelledby': 'work-title' },
          h('h2.panel__title', { id: 'work-title' }, 'Agent at work'),
          h('div.message', {}, els.meta, els.subject, els.body),
          els.steps, els.run),
        h('section.review', { 'aria-labelledby': 'review-title' },
          h('h2.panel__title', { id: 'review-title' }, `Draft for approval by the ${demo.approver}`),
          els.empty, els.draft, els.actions, els.done)),
      h('section.log', { 'aria-labelledby': 'log-title' },
        h('h2.panel__title', { id: 'log-title' }, 'Audit trail'), els.logEmpty, els.log)),
    h('footer.demo__foot', {},
      h('p.guardrail', {}, h('strong', {}, 'Guardrail: '), demo.guardrail),
      h('p.demo__note', {}, `Sample data. Nothing here is sent. Connections to ${listJoin(systems)} are simulated.`),
      els.reset),
    els.toast);

  function wrapHtml(html) {
    const t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
  }

  // Render
  function render() {
    const id = session.selected;
    const item = byId[id];
    const state = session.items[id];

    if (id !== shown) {
      shown = id;
      queueButtons.find((b) => b.dataset.id === id)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    queueButtons.forEach((btn) => {
      const s = session.items[btn.dataset.id].status;
      btn.dataset.status = s;
      btn.toggleAttribute('aria-current', false);
      if (btn.dataset.id === id) btn.setAttribute('aria-current', 'true');
      const badge = btn.querySelector('.status');
      badge.dataset.status = s;
      badge.textContent = STATUS[s];
    });

    els.meta.textContent = `${CHANNELS[item.channel] ?? item.channel} from ${item.from}, ${item.receivedAt}`;
    els.subject.textContent = item.subject;
    els.body.textContent = item.body;
    if (state.status !== 'working') renderSteps(item, state.status === 'new' ? 0 : item.steps.length);
    els.run.hidden = !['new', 'working'].includes(state.status);
    els.run.disabled = state.status === 'working';
    els.run.textContent = state.status === 'working' ? 'Agent running' : 'Run agent';

    const ran = !['new', 'working'].includes(state.status);
    els.empty.hidden = ran;
    els.draft.hidden = !ran;
    els.actions.hidden = state.status !== 'review';
    els.done.hidden = !DECIDED.includes(state.status);
    if (ran) renderDraft(item, state);

    const s = summary(session, demo);
    const nums = { handled: s.handled, approved: s.approved, steps: s.steps, systems: s.systems.length };
    root.querySelectorAll('[data-stat]').forEach((el) => { el.textContent = String(nums[el.dataset.stat]); });

    els.logEmpty.hidden = session.log.length > 0;
    els.log.replaceChildren(...session.log.map((e) => {
      const d = byId[e.itemId].draft;
      return h('li.log__entry', {}, h('time', {}, e.at), h('span', {}, `${e.text}: ${d.kind} to ${d.to}`));
    }));
  }

  // done = number of finished steps; the step at index done is running when animating.
  function renderSteps(item, done, running = false) {
    els.steps.replaceChildren(...item.steps.map((step, i) => {
      const st = i < done ? 'done' : running && i === done ? 'running' : 'pending';
      return h('li.step', { 'data-state': st }, h('span.step__system', {}, step.system), h('span.step__text', {}, step.text));
    }));
  }

  function renderDraft(item, state) {
    const d = item.draft;
    els.kind.textContent = d.kind;
    els.to.textContent = `To: ${d.to}`;
    els.fields.replaceChildren(...d.fields.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, v)]));
    els.fields.hidden = d.fields.length === 0;
    els.text.value = state.body;
    els.text.readOnly = true;
    els.risk.textContent = d.risk ?? '';
    els.risk.hidden = !d.risk;
    els.done.textContent = doneLine(state.status, d);
  }

  function doneLine(status, d) {
    if (status === 'rejected') return `Rejected. Nothing goes to ${d.to}. The item stays with the ${demo.approver}.`;
    const lead = status === 'edited' ? 'Approved with your edits.' : 'Approved.';
    return `${lead} In a live setup this goes to ${d.to} for ${demo.company}. Nothing was sent in this demo.`;
  }

  function toast(message) {
    els.toast.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { els.toast.textContent = ''; }, 5000);
  }

  // Actions
  function stopRun() {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    const id = Object.keys(session.items).find((k) => session.items[k].status === 'working');
    if (id) session = finishItem(session, id);
  }

  function choose(id) {
    stopRun();
    session = select(session, id);
    render();
  }

  function run() {
    const id = session.selected;
    const item = byId[id];
    session = startItem(session, id);
    render();
    const finish = () => {
      timer = null;
      session = finishItem(session, id);
      const hadFocus = document.activeElement === els.run || document.activeElement === document.body;
      render();
      if (hadFocus) els.approve.focus();
    };
    if (reduceMotion) return finish();
    let done = 0;
    const tick = () => {
      if (done === item.steps.length) return finish();
      renderSteps(item, done, true);
      done += 1;
      timer = setTimeout(tick, STEP_MS);
    };
    tick();
  }

  function decide(kind) {
    const id = session.selected;
    const d = byId[id].draft;
    const at = clock();
    session = kind === 'reject' ? reject(session, id, { at }) : approve(session, id, { at });
    const status = session.items[id].status;
    const next = demo.items.find((it) => !DECIDED.includes(session.items[it.id].status));
    if (next) session = select(session, next.id);
    render();
    toast(doneLine(status, d) + (next ? '' : ' Every item is handled.'));
    (next && session.items[next.id].status === 'new' ? els.run : queueButtons.find((b) => b.dataset.id === session.selected)).focus();
  }

  els.run.addEventListener('click', run);
  els.edit.addEventListener('click', () => { els.text.readOnly = false; els.text.focus(); });
  els.text.addEventListener('input', () => { session = editDraft(session, session.selected, els.text.value); });
  els.approve.addEventListener('click', () => decide('approve'));
  els.reject.addEventListener('click', () => decide('reject'));
  els.reset.addEventListener('click', () => {
    stopRun();
    session = createSession(demo);
    render();
    toast('Demo reset. Every item is back in the queue.');
    queueButtons[0]?.focus();
  });

  render();
  win.connect();
}
