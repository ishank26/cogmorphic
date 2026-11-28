# Grade, round 1 (Cogmorphic Sample B, branch sample-b-polish @ 16d18db)

Method: read every page, component, CSS and FAQ source; `npm run build` OK; `npm run check:seo` prints "All on-page SEO checks passed". Text widths measured with the site's own fonts (Fontsource Inter variable metrics, which match the system Inter static OTFs used for weights 500/600, and Fontsource Space Mono), letter-spacing included, kerning not applied (so widths are slight overestimates). Contrast computed with WCAG formulas. No browser, so layout heights and the dither overlay are estimates. "help/helps/helper/helpful": none found in src or dist.

## Scores

| # | Area | Score | Reason |
|---|------|-------|--------|
| 1 | Problem-first clarity | 8 | Problem ("Big opportunities wait while the day fills up") and the cruise-control analogy both land inside two phone screens, but the hero itself is solution-led. |
| 2 | Opportunity framing | 8 | Hero, pile and gains read as "go further"; but 2 of 5 demo examples are night-time repair / school admin, and the audit page talks of "fixes" and "save time". |
| 3 | Copy craft | 7 | Short, calm, no forbidden words; but the agent-vs-chatbot point is made three times on one page and "you approve" about six times. |
| 4 | Visual polish and hierarchy | 8 | Distinct dark/amber/mono look, nothing Anthropic-like; three near-identical card grids in a row (gains, compare, steps) flatten the rhythm; OG image is set in DejaVu, not Inter. |
| 5 | Mobile 360/390 | 8 | No overflow, all controls >= 44px; but a pile card breaks to two lines, the hero goes to three lines, a dangling "·" at 360, and the demo's Pause button orphans left. |
| 6 | Accessibility | 8 | All text passes 4.5:1 (lowest: --text-faint on raised = 4.72), good reduced-motion and forced-colors work, real tabs with arrow keys; FAQ "+" is announced, "Pause" lacks context. |
| 7 | Trust and conversion | 7 | One consistent CTA, frank cost and mistakes answers; but the home page never says what you get from the call, and "What about my data?" answers a different question. |

## Must fix (ranked by impact)

### M1. FAQ repeats the comparison section (copy, trust)
`src/data/faq.ts` lines 5-11. Q1 restates the "AI agent vs. phone menu vs. chatbot" section word for word, and Q2 ends with the same chatbot line again. That's the same point three times on one page, and it uses up the FAQ slot meant for sceptics.
Replace lines 4-11 with:
```ts
  {
    q: 'What if my business is different?',
    a: 'Every business is. We start from how you work today, use the tools you already have, and test each workflow with you before it goes live.',
  },
  {
    q: 'What is agentic AI?',
    a: 'AI that takes steps toward a goal, not just answers. It can spot a sales trend, draft an offer or book a meeting, while you approve what matters.',
  },
```
(Both answers reuse facts already on the business page FAQ; nothing new is promised.)

### M2. Home never says what you get from the free call (conversion, "what happens next")
The business page promises "a one-page report with your top three openings", but the home page (the main entry) only says "Free call / We find your biggest openings".
- `src/pages/index.astro` line 110: `<li><h3>Free call</h3><p>We find your biggest openings.</p></li>` -> `<li><h3>Free call</h3><p>Your top three openings, in writing.</p></li>`
- `src/pages/index.astro` line 148: `<FinalCta heading="See what an agent could do for you." />` -> `<FinalCta heading="See what an agent could do for you." text="Free call. Your top three openings, in writing." />`

### M3. Pile card breaks at 360 and 390 px (first problem screen, every phone)
`src/styles/global.css` lines 248-253. Measured: "Customers want more" (158.6px) + gap 16 + "No time to offer it" (142.7px, nowrap) = 317px, but an even (indented) card has 268px of content at 360 and 298px at 390. The label wraps to two lines, so one card is taller than the others. "Partnership lead" row is 268.4px in 268px, so it's on the edge too.
Add after line 253:
```css
@media (max-width: 480px) {
  .pile li { flex-direction: column; align-items: flex-start; gap: 2px; padding: 10px 14px; }
}
```
(Stacked: the title is on top and the amber status sits under it. It reads like a ticket and every card is the same height.)

### M4. The audit page drops the opportunity framing (conversion page)
`src/pages/free-ai-audit.astro` reads like a repair job: "what to fix first", "top three fixes", "save you time". The home page sells openings and growth.
- line 9: `'A free video call and a written list of the top three places AI agents could save you time. No obligation.'` -> `'A free video call and a written list of your top three openings for AI agents, from time saved to new revenue. No obligation.'` (128 chars; re-run check:seo)
- line 35: `...could save you or your team time, then a written list of what to fix first.` -> `...could save time and open new revenue, then a written list of your top three openings.`
- line 46: `A one-page report with your top three fixes, what each would cost, and what you can do yourself.` -> `A one-page report with your top three openings, what each would cost, and what you can do yourself.`

## Should fix (ranked)

S1. **"What about my data?" doesn't answer the question** (`src/data/faq.ts` line 26). It's about permissions. Using only facts already on the site: `'Agents only reach the tools and accounts you approve, with the least access each task needs. The free audit needs no logins at all.'` Flag for the owner: if she can truthfully say where data is processed or stored, that sentence belongs here.

S2. **Approval is said too often; step 3 repeats the demo.** "You approve" appears in the loop, step 3, the compare card and FAQ x3. `src/pages/index.astro` line 112 -> `<li><h3>You go further</h3><p>Training, then <span class="rough" data-rough="underline">monthly check-ins</span>.</p></li>` (taken from the business page "Run" step). This gives step 3 a forward-looking ending and a reason to stay.

S3. **Hero is three lines at 360/390.** At 41.6px, "Hand off the routine." measures 372.6px in a 320/350px column, so it wraps to "Hand off the / routine. / Go further." and the parallel couplet is lost. `src/styles/global.css` line 121: `font-size: clamp(2.6rem, 7vw, 5.5rem);` -> `font-size: clamp(2.2rem, 7vw, 5.5rem);` (35.2px gives 315px at 360. Nothing changes from 503px up. Desktop stays at 88px and two lines: 788px inside 15ch = 852px.)

S4. **Demo examples: one is an emergency, one is admin** (`src/components/AgentLoop.astro`).
- line 20-21 (2:14 AM leak, mildly alarming): keep sensors but make it an opening, e.g. `{ id: 'building', tab: 'Shops', from: 'Door counter', msg: 'Busiest hour moved to 5 PM.', s: ['Foot traffic is shifting', 'Sales, staff rota and promos', 'Drafts a 5 PM offer and a rota tweak', 'You approve the change', 'Ready for the new rush'] }` (and change the tab label if "Retail" then reads as a duplicate; e.g. rename that tab to "Online store").
- line 24-25 (school form): optional, an individual's "go further" example: `{ id: 'personal', tab: 'Just you', from: 'Newsletter', msg: 'Call for speakers closes Friday.', s: ['A fit for your expertise', 'Your past talks and calendar', 'Drafts a pitch, holds the date', 'You edit and send', 'Pitch in on time'] }`. Owner's call: the school one is very relatable.

S5. **Demo footer orphans the button and wraps at 360** (`AgentLoop.astro` line 51; `global.css` line 295). The text is 283px in a 278px line. Copy: `Unusual case? It goes straight to a person.` -> `Anything unusual comes to you.` (213px). CSS: add `margin-left: auto;` to `.loop__replay` so that when the button wraps it sits at the right. Rename the button so it makes sense out of context (WCAG 2.4.6): line 51 `>Pause<` -> `>Pause demo<` (lines 101-102 keep "Play again").

S6. **FAQ "+" is announced by screen readers** (`global.css` line 169). Keep the fallback for Firefox: `content: '+'; content: '+' / '';`

S7. **Dangling "·" in the hero trust line at 360.** It measures 323px in 320px. `global.css` line 216: `letter-spacing: .04em` -> `.02em` (313px, fits).

S8. **OG image is set in DejaVu Sans, not Inter**, so the share card doesn't match the site (`scripts/make-images.mjs` lines 28, 33). Inter is installed system-wide here, so set `font-family="Inter, DejaVu Sans, sans-serif"`. The underline then has to move: measured Inter 500 at 62px, "Go " = 95.8px and "further" = 193.1px, so line 32 becomes `M176 419 C 240 413, 305 423, 369 415`. Re-run `npm run images` and look at the PNG (librsvg weight matching is an estimate, so verify).

S9. **Privacy "Last updated" changes on every build** (`src/pages/privacy.astro` line 27), so the date isn't true. Hard-code it: `<p class="muted">Last updated: November 25, 2026</p>`.

S10. **Housekeeping.** `global.css` line 2 comment ("Amber is reserved for the one action") is no longer true; amber is now the accent system. Line 251 `.pile li:nth-child(n+5)` targets nothing (4 items). `index.astro` line 22: `icon.track` is unused. `src/components/Terminal.astro` and its CSS (`global.css` lines 144-161) are unused on every page.

S11. **Forced colors:** the agent card's highlight (`.compare .is-agent`) disappears. Add inside the `@media (forced-colors: active)` block: `.compare .is-agent { border: 2px solid Highlight; }`.

## Polish ideas (no extra words)

P1. **A cruise-control dial beside "Cruise control for your work."** A 64px inline SVG, aria-hidden: a speedometer arc in `--line-strong` with a short amber "set" tick and a needle resting on it. It makes the analogy visual in one glance and gives the "What is an AI agent?" band a focal point on desktop (float right of the statement; above it on mobile).

P2. **Break the three card grids.** Gains (4 cards), compare (3 cards) and steps (3 cards) all use the same raised box, radius and padding. Turn the steps into a card-less horizontal timeline: big Space Mono numerals `01 02 03`, a hairline connector like the loop's, and an amber dot on step 3. Turn compare into one strip with three stops of rising weight: phone menu (faint), chatbot (dim), agent (amber border). Same words, clearer progression, better rhythm.

P3. **Close the loop between problem and payoff.** The pile shows waiting items in amber mono ("On hold for months"). In the gains section, give each card a tiny mono status in `--ok` green under the icon ("MOVING", "LIVE"). That's four short words at most, and the eye reads waiting -> moving. If no words at all, use a small green dot in the corner of each gains card instead of the amber top hairline, so the colour story goes amber = waiting, green = moving.

## Measurements (for the worker)

- Content widths: 360 -> 320px, 390 -> 350px, 1280 -> 984px. Card inner (pad 20): 278px at 360.
- Contrast on bg / raised / soft: text 16.5/15.0/15.7, dim 7.26/6.61/6.91, faint 5.19/4.72/4.94, amber 10.7/9.8/10.2, pile status #d9a23a 8.6/7.8, at .85 opacity 5.93. Button ink on amber 10.4. Tab borders (--line-strong) 3.4:1 (non-text OK). Lede over the hero dither, worst case (estimate): 5.45:1 on mobile, about 6.0:1 on desktop.
- Tap targets: nav, menu, tabs, textlink, footer links and crumbs are all >= 44px. Inline links are exempt.
- Compare label at 360: 315.8px in 320px, fits.
