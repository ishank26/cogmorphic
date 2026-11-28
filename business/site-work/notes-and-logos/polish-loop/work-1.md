# Work, round 1 (commit 9dbeffc on sample-b-polish)

Checks: `npm run build` OK (6 pages). `npm run check:seo`: "All on-page SEO checks passed". Whole-word, case-insensitive grep for help/helps/helper/helpful over all 6 dist HTML files and src: no matches. jsdom loop test (t3.cjs) ran against dist/index.html: auto-advance, pause ("Pause demo" -> "Play again"), End key and panel tabindex all OK, no errors.

## Must fix
- M1 FAQ repeats the comparison: **done** as given (new Q1 "What if my business is different?", new agentic AI answer).
- M2 What you get from the call: **done** as given (step 1 and FinalCta text). Note: the same line now appears twice on the page (step 1, final CTA), as the grader asked; easy to trim one if the next grade flags it.
- M3 Pile card breaks on phones: **done** as given (stack below 480px).
- M4 Audit page framing: **done** as given (meta description, lede, "What you get"). SEO check passes.

## Should fix
- S1 Data answer: **done** as given. Owner flag stands: add where data is processed or stored if she can say it truthfully.
- S2 Step 3: **done** ("You go further / Training, then monthly check-ins", underline moved to "monthly check-ins").
- S3 Hero min size: **done** (clamp min 2.2rem).
- S4 Demo examples: **changed**. Per the owner, all five examples stay, including the leak sensor and "Your own inbox". The leak example was made calm instead of swapped: "Small drip under the sink in unit 2B." (no 2:14 AM), steps "Slow leak, worth a plumber / Floor plan, valves and vendors / Books the plumber, tells the tenant / You OK the visit / Fixed early, no big repair". School example kept as is (relatable; owner's call). No tab renamed.
- S5 Demo footer: **done** ("Anything unusual comes to you.", `margin-left: auto` on the button, "Pause demo").
- S6 FAQ "+" announced: **done** (`content: '+'; content: '+' / '';`).
- S7 Trust line dot: **done** (letter-spacing .02em).
- S8 OG image font: **skipped**. Tested loading Inter from node_modules via a fontconfig file pointing only at @fontsource-variable/inter: sharp's bundled librsvg renders tofu (it can't use the WOFF2 files), so the pipeline can't load Inter from node_modules without installing something. Using the system-wide Inter would make the image depend on this machine. Font left as DejaVu; image not regenerated.
- S9 Privacy date: **done** (hard-coded November 25, 2026).
- S10 Housekeeping: **done**. Top comment rewritten (amber = action and waiting, green = moving), `.pile li:nth-child(n+5)` removed, `icon.track` removed, Terminal.astro deleted and its CSS removed, unused `.principles` CSS removed too.
- S11 Forced colours: **done** (`.compare .is-agent { border: 2px solid Highlight; }`).

## Polish
- P1 Cruise-control dial: **done**. Inline SVG (aria-hidden, focusable=false) beside "Cruise control for your work." (left of the statement from 640px, above it on phones): grey arc, amber filled arc up to an amber set mark, needle with amber hub. With motion allowed, the needle sweeps up and the amber arc fills once when it scrolls into view; with reduced motion or no JS it simply sits on the set mark. Forced colours: strokes use CanvasText. Rendered a preview to check the geometry.
- P2 Break the card grids: **done**. Steps are now a card-less timeline (mono numerals 01 02 03 on a hairline, small dot per stop, step 3 in amber with a lit dot; stacked rows with hairlines on phones). This also applies to the steps on the business and personal pages, consistent across the site. Comparison is one strip with three cells: phone menu faint, chatbot dim, AI agent in full text with an amber border. Gains keep their cards, so only one card grid remains.
- P3 Status colours: **done**, no new words. Pile statuses get a small amber dot (waiting); gains cards get a small green (--ok) dot in the corner in place of the amber top hairline (moving).

## Not verified
No browser here, so the timeline, strip and dial were checked by build output and reasoning, not screenshots. Worth a look at 360, 390 and 1280 px in the next grade.
