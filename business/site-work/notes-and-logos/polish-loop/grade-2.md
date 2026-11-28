# Grade, round 2 (Cogmorphic Sample B, branch sample-b-polish @ 9dbeffc)

Method: read the whole diff since 16d18db plus the current home, business, personal, audit and FAQ sources. `npm run build` OK (6 pages). `npm run check:seo` prints "All on-page SEO checks passed". I grepped dist for whole-word help/helps/helper/helpful/helping and found none. Text widths were measured with the site's own fonts (Inter static OTFs matching the Fontsource metrics, plus Fontsource Space Mono), letter-spacing included and kerning not applied, so they slightly overestimate. I rendered the dial SVG at its real 56px phone size with sharp. There is no browser, so layout heights, the dial animation and the timeline lines are estimates from the CSS.

**Target met? No.** Three scores are below 9 and there are 3 Must fixes. All of them are small copy or CSS changes, listed below with exact replacements.

## Round-1 items verified in code

| Item | Status |
|---|---|
| M1 FAQ repeats compare | Fixed (faq.ts 4-11) |
| M2 What you get from the call | Fixed, but the line now appears twice (see M2 below) |
| M3 Pile card breaks on phones | Fixed (global.css 243-245, stacks below 480px) |
| M4 Audit page framing | Fixed (meta, lede, "What you get"). SEO check passes |
| S1 Data answer | Fixed. "least access each task needs" is backed by the business FAQ; "no logins" is backed by the audit FAQ |
| S2 Step 3 | Done, but it carries an offer the owner never made (M1 below) |
| S3 Hero min size | Fixed (2.2rem) |
| S4 Demo examples | Owner override accepted. The leak example is now calm ("Small drip…", no 2:14 AM) |
| S5 Demo footer | Fixed. 213px in 278px, `margin-left:auto`, "Pause demo" |
| S6 FAQ "+" | Fixed (`content: '+' / ''`) |
| S7 Trust dot | Fixed (.02em) |
| S8 OG font | Skipped, with a valid reason (no Inter that librsvg can load without an install). Accepted; owner note only |
| S9 Privacy date | Fixed |
| S10 Housekeeping | Fixed (Terminal, .principles, n+5, icon.track removed; comment rewritten) |
| S11 Forced colours | Fixed (global.css 59) |
| P1-P3 | Done. Reviewed below |

## Scores

| # | Area | Score | Reason |
|---|------|-------|--------|
| 1 | Problem-first clarity | 9 | Problem, then "Cruise control for your work." with a dial that reads as a gauge at 56px. The analogy is now visual. |
| 2 | Opportunity framing | 9 | The audit page now sells openings and new revenue; the leak example is calm; gains and hero read as "go further". |
| 3 | Copy craft | 8 | "Your top three openings, in writing." appears twice on home (step 1, final CTA), and step 3 swapped the owner's core comfort line for an invented offer. |
| 4 | Visual polish and hierarchy | 9 | The timeline and the single comparison strip break up the card rhythm well; the progression faint > dim > amber reads clearly. Small issues: the timeline hairline is broken into segments, and the dial carries dead space (S1, S2). |
| 5 | Mobile 360/390 | 8 | No overflow, taps >= 44px, pile/hero/footer fixed. At 360 all three home step lines wrap with a one-word widow (M3). |
| 6 | Accessibility | 9 | Dial is aria-hidden/focusable=false, static under reduced motion and without JS, CanvasText in forced colours. The status dots are decorative (the pile's words carry the meaning; the gains dots add nothing a reader needs). Contrast: lowest body text is the phone-menu cell, --text-faint on raised = 4.72:1, a pass. |
| 7 | Trust and conversion | 8 | "Monthly check-ins" is a service promise the owner never made (home and business page), and "you stay in charge", core to her pitch, left the steps. |

## Must fix

### M1. Invented offer "monthly check-ins", and "stay in charge" lost (trust, copy)
The owner never said she offers monthly check-ins. The phrase came from the business page's "Run" step (there since the first commit, also unsupported). Both instances go. Step 3 should give back the owner's core comfort message and still end on "go further", without repeating "approve" (that word is already in the demo, compare and FAQ).
- `src/pages/index.astro` line 121:
  `<li><h3>You go further</h3><p>Training, then <span class="rough" data-rough="underline">monthly check-ins</span>.</p></li>`
  ->
  `<li><h3>You stay in charge</h3><p>Then <span class="rough" data-rough="underline">take on more</span>, at your pace.</p></li>`
  (Measured: h3 164px, p 266px. It fits on one line at 360 once M3 is done, and on one line at 390 and 1280.)
- `src/pages/ai-agents-for-business.astro` line 59:
  `<li><h3>Run</h3><p>Team training, then monthly check-ins.</p></li>`
  ->
  `<li><h3>Run</h3><p>Hands-on training for your team.</p></li>`
  (This is already on the page: the title says "Setup and Training", and the FAQ "How do you train my team?" says "hands-on practice".)

### M2. "Your top three openings, in writing." appears twice on home (copy)
Keep it in step 1, where its job is "what happens next". The final CTA goes back to the component default, which adds the "No obligation" reassurance instead of repeating step 1.
- `src/pages/index.astro` line 164:
  `<FinalCta heading="See what an agent could do for you." text="Free call. Your top three openings, in writing." />`
  ->
  `<FinalCta heading="See what an agent could do for you." />`
  (Renders "Free call. No obligation.")

### M3. Step lines widow one word at 360 px (mobile)
At 360 the text column is 320 - 56 = 264px. Measured: "Your top three openings, in writing." 282.7px and "In your tools. Nothing new to learn." 281.2px. Both wrap and leave the last word alone ("writing." / "learn."). The "01" numeral is only 29.4px wide, so the 56px column is generous. At 390 (294px) they fit.
- `src/styles/global.css` line 135: `grid-template-columns: 56px minmax(0, 1fr);` -> `grid-template-columns: 44px minmax(0, 1fr);`
- `src/styles/global.css` line 141: `.steps p { color: var(--text-dim); }` -> `.steps p { color: var(--text-dim); text-wrap: balance; }`
  (At 276px the lines still wrap, but balance makes the split even, "Your top three openings, / in writing." It's supported in Chrome, Safari 17.5+ and Firefox 121+. Desktop is unchanged; the business and personal steps benefit too.)

## Should fix

S1. **Dial: dead space and inset at 360 px.** The 64x64 viewBox puts the drawing at x 6.5-57.5, y 10.5-49.5. On phones, where the dial sits above the statement, the arc starts about 8px right of the text's left edge and leaves about 14px of empty box under it on top of the 18px gap. The fix is to crop by moving the coordinates, not by a viewBox offset: browsers put `transform-box: view-box` at user-space 0,0, so an offset viewBox would move the needle's pivot.
`src/pages/index.astro` lines 72-77 ->
```html
<svg class="dial" data-dial viewBox="0 0 52 40" aria-hidden="true" focusable="false">
  <path class="dial__track" d="M5.22 38A24 24 0 1 1 46.78 38"/>
  <path class="dial__set" d="M5.22 38A24 24 0 0 1 38 5.22"/>
  <path class="dial__mark" d="M35.5 9.55 40 1.75"/>
  <g class="dial__needle"><path d="M26 26V9"/><circle cx="26" cy="26" r="3"/></g>
</svg>
```
`src/styles/global.css` line 346: `transform-origin: 32px 36px;` -> `transform-origin: 26px 26px;`. The dasharray of 63 stays (the arc length is unchanged). At the same CSS width the gauge draws 23% larger (arc radius 26px at 56px wide), which makes it read better on phones; I rendered both versions to check. On desktop (row layout, centred) nothing else changes.

S2. **Timeline hairline is broken into segments on desktop.** The li's `padding-right` (36px at 1280) shortens each numeral's underline, so the "timeline" reads as 292 / gap / 292 / gap / 328px dashes, with the last one longer. Move the padding to the text so the line runs straight through.
`src/styles/global.css` lines 144-145 ->
```css
  .steps li, .steps li:last-child { display: block; padding: 0; border: 0; }
  .steps h3, .steps p { padding-right: clamp(20px, 3vw, 36px); }
  .steps li:last-child h3, .steps li:last-child p { padding-right: 0; }
```
(The dots at `left: 0` then sit at the start of one continuous line.)

S3. **Owner to confirm (not invented by the worker, but unsupported by the brief or her notes):** `src/pages/personal-ai-agents.astro` line 56 "One-to-one sessions until it feels easy." is an open-ended coaching commitment. Also `site.callLength` "20-minute" is still a TODO. If she can't confirm the first, use `<li><h3>Coach</h3><p>One-to-one coaching on your own tasks.</p></li>` (this matches the page's own FAQ).

## Claims check (factual statements vs the brief and owner notes)
- Fine and backed by existing site copy: "least access each task needs", "no logins at all", "test each workflow with you before it goes live", "quoted up front", "one-page report… what each would cost". Demo figures such as "3x faster" are example messages inside the demo, not claims about the business.
- Not supported: "monthly check-ins" (M1). "Until it feels easy" needs the owner to confirm (S3). Nothing else found.

## Notes (no change needed)
- Amber now means both "waiting" (the pile dots) and "the agent / where you end up" (compare, step 3, dial). The CSS comment says so and the words carry the meaning, so I'm leaving it.
- Dial with JS on but the module failing to load: the arc stays empty and the needle rests at the start. This is a low risk (the same bundle runs the hand-drawn marks) and only cosmetic.
- OG image: still DejaVu. The worker's reason is valid. Owner note: regenerate on a machine with Inter if the share card matters.
