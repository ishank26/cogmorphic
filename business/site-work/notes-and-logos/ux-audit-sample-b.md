# Sample B home page: UI/UX audit

Static review, 2026-11-24 (no browser). Widths reasoned from the CSS: content is 320px at 360, 350 at 390, 387 at 430, 691 at 768, 928 at 1024, 984 at 1280+. Contrast is computed against `--bg`/`--bg-raised`.

**Already good:** one H1, H2 labels, one booking destination. No horizontal page scroll at any width. Stacked panels keep the card height fixed when tabs change. Rotation stops for good once the loop leaves the screen. Reduced motion shows every step lit. Body text passes contrast (dim 6.96:1, faint 4.97:1 on the card).

## Must fix

**M1. The examples rotate too fast and can't be paused** (`AgentLoop.astro` script; WCAG 2.2.2)
Each panel lasts 7.45s, and "Done" lights 3.45s before the switch. That's too short for ~45 words read by a non-technical owner. Hover, touch and screen-reader browsing don't stop it, so the text changes while people read. On phones the chip row is often off-screen, so the industry changes with no visible cue.
Fix: `const HOLD = 6000;` add `root.addEventListener('pointerdown', stopAuto); root.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') stopAuto(); });`. Make `[data-replay]` read "Pause" while `auto` is on and "Play again" otherwise, with no new words. Ideally move it before the tablist in the DOM, which is the APG carousel order.

**M2. You can't see which chip is selected, and chips are 40px tall** (`global.css` `.loop__tabs button`)
Unselected borders are `--line` at 1.22:1, so chips don't look like buttons. Selected and unselected differ only by text colour (2.27:1 apart) and a faint border.
Fix: `min-height: 44px; border-color: var(--line-strong);` (3.58:1) and `[aria-selected='true'] { background: var(--text); color: var(--bg); border-color: var(--text); }` (16.5:1). This stays neutral and keeps amber for the CTA.

**M3. The first two examples are both buildings, so the page looks niche** (`AgentLoop.astro` `examples`)
Most visitors see one or two panels. "Property management" then "Buildings and sensors" says "property software", which works against the owner's main concern.
Fix: reorder, with no copy change: Professional services (a lead at 10 PM is the most universal case), Retail, Accounting, Buildings and sensors, Contractors, Clinics, Insurance, Property management, Your own inbox.

## Should fix

**S1. Unlit step text fails contrast** (`global.css` `.js .loop__steps p { opacity: .35 }`)
It drops to 1.88:1 (detail) and 2.88:1 (label) on load and on every replay.
Fix: animate only the icons. Replace the two opacity rules with `.js .loop__steps strong { color: var(--text-dim); } .js .loop__steps li.is-lit strong { color: var(--text); }` and keep the span at `--text-dim`. Every state then passes AA.

**S2. Problems with the chip row on screens under 1000px** (`.loop__tabs`, script `select()`)
(a) The fixed right-edge mask covers the last chip once it's scrolled to the end, so "Your own inbox" shows faded even when selected. (b) The 2px padding clips the focus ring at the top and on the first chip. (c) `offsetLeft` is measured from `.section`, not the row, so the centred chip sits 20px off at 360 and 38px off at 768.
Fix: `.loop__tabs { position: relative; padding: 6px 6px 14px; margin: 0 -6px; }` and `.loop__tabs.at-end { mask-image: none; -webkit-mask-image: none; }`. Toggle `.at-end` on `scroll` when `scrollLeft + clientWidth >= scrollWidth - 4`.

**S3. The five-column step layout starts too early** (`@media (min-width: 820px)`)
Columns are 120px wide at 820px, so "Checks your tools" (~127px) wraps and labels misalign up to about 900px.
Fix: change it to `@media (min-width: 960px)`. Columns are then 143px or wider.

**S4. Actions are shown in quote marks** (`.loop__msg`)
Three panels show an action in quotes, for example "Sends a photo of a crumpled receipt." That reads as if the client said "Sends a photo".
Fix: add `act: true` to accounting, contractor and services. Render `{e.act ? e.msg : `“${e.msg}”`}`.

**S5. Amber is no longer reserved for the action** (`global.css` line 2 rule)
The gains icons, works icons and compare card all use amber now, so the CTA no longer stands out.
Fix: `.gains__icon { color: var(--text); background: rgba(243,234,219,.04); border-color: var(--line-strong); }` and `.works__list svg { stroke: var(--text-dim); }`. Keep amber in the loop's "You approve" step, which is the brand moment.

**S6. Outcomes are worded three different ways** (`index.astro` lines 48, 53)
The hero says "faster replies, fewer missed follow-ups, quicker payment". The tiles say "Reply in minutes / Nothing slips / Get paid sooner / Grow lean", and the hero leaves out growth. The trust line promises "approve every change" while everywhere else says "what matters".
Fix: start the lede with "Reply in minutes. Nothing slips. Get paid sooner. Grow lean." and change the trust line to "You approve what matters".

## Nice to have

**N1.** The step connectors are invisible (`--line`, 1.17:1), so the five icons don't read as a flow. Add `.loop__steps li.is-lit::after { background: var(--line-strong); transition: background-color .3s; }`.

**N2.** The verdict tags (Routes / Talks / Gets it done) are the smallest text and sit at the bottom of each card. Add `.compare__tag { order: -1; margin-top: 0; }` so the AI-agent card's difference reads at a glance.

**N3.** Tabs: add `Home`/`End` keys. Set `tabindex="0"` on the active panel in `select()` (it has no focusable content), as the APG pattern does.

**N4.** Under reduced motion the replay button does nothing visible. Add `@media (prefers-reduced-motion: reduce) { .loop__replay { display: none; } }`.

**N5.** The fifth pile row's status text is 2.90:1 at `.5` opacity. Use `.pile li:nth-child(n+4) { opacity: .85 } .pile li:nth-child(n+5) { opacity: .7 }`, which gives 4.57:1.

**N6.** Fewer words: under "Sound familiar?", cut "Replies wait, follow-ups slip and invoices go out late." The pile already shows it.

**N7.** Hero display: drop the comma, so it reads "Achieve more with AI agents on your side."
