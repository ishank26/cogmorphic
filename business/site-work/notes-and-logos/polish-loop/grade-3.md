# Grade, round 3 (Cogmorphic Sample B, branch sample-b-polish @ 09d2fdc)

Method: I read the round-2 diff and then every page, component, the CSS and the FAQ data again. `npm run build` OK (6 pages). `npm run check:seo` prints "All on-page SEO checks passed". A whole-word grep for help/helps/helper/helpful/helping over src, dist and public found nothing, and "monthly check" is gone from dist. I measured text widths with the site's fonts (Inter static OTFs matching the Fontsource metrics, plus Fontsource Space Mono), with letter-spacing and without kerning, so the widths run slightly high. Contrast uses the WCAG formula. I rendered the shipped dial geometry with sharp at its real 56px size. There is no browser, so line wrapping, heights and animation are estimates from the CSS.

**TARGET NOT MET.** Six items now score 9. Accessibility scores 8 because of one new Must fix: the booking form's status message is never announced to screen readers. It is a two-line change. Once it is applied, every item is at 9 or above and the target is met.

## Round-2 items checked in the code

| Item | Status |
|---|---|
| M1 Invented "monthly check-ins" | Fixed. index.astro 121 now reads "You stay in charge / Then take on more, at your pace." Business page line 59 reads "Hands-on training for your team." Neither string is left in dist. |
| M2 Repeated "top three openings" on home | Fixed. index.astro 164 uses the default, which renders "Free call. No obligation." |
| M3 One-word widows at 360px | Fixed. global.css 135 sets the numeral column to 44px and line 141 adds `text-wrap: balance`. At 360 the text column is 276px. "Your top three openings, in writing." (282.7) and "In your tools. Nothing new to learn." (281.2) still take two lines, but they now split evenly. "Then take on more, at your pace." (266.3) fits on one line. At 390 (306px) all three lines fit. |
| S1 Dial crop | Fixed exactly as specified. The viewBox is 0 0 52 40, the arc centre is (26,26) with r 24 (checked: the endpoints are 24.0 from the centre), and the strokes keep about 0.5 units of margin. transform-origin is 26px 26px. The set arc is 150 degrees, 62.8 units long, so the dasharray of 63 is right. With `height:auto` the box is 56x43 on phones and has no letterbox. The render matches the approved crop. |
| S2 Unbroken timeline | Fixed. The li padding is 0 at 720px and up, and the right padding now sits on h3/p. The grid has no column gap, so the numeral underline runs continuously. The dot sits dead centre on the line: with border-box sizing, its centre at 46 + 4.5 = 50.5px matches the line at 50-51px. |
| S3 Personal "until it feels easy" | Left for the owner, which is valid (it predates round 1). Still listed below. |

## Scores

| # | Area | Score | Reason |
|---|------|-------|--------|
| 1 | Problem-first clarity | 9 | The page runs hero, then "Sound familiar?", then "Cruise control for your work." with a gauge and a live demo, all inside about two screens. A non-technical owner gets both the problem and the idea. |
| 2 | Opportunity framing | 9 | The hero, "What opens up for you", step 3 "take on more" and the audit page's "new revenue" all point forward. Nothing reads as an admin tool. |
| 3 | Copy craft | 9 | Home has no repeats now and no forbidden words. The remaining issues are small and sit on the inner pages and the demo (S1-S3). |
| 4 | Visual polish and hierarchy | 9 | The timeline now reads as one line with the last stop lit. The dial is tighter and larger on phones. The faint > dim > amber progression holds. The look stays distinct: near-black, amber, mono labels and the dither. |
| 5 | Mobile 360/390 | 9 | No overflow found. Tap targets are at least 44px. "Hand off the routine." measures 315/320px at 360 (fits, with kerning margin), and the trust line is 313/320. The step lines wrap evenly. |
| 6 | Accessibility | 8 | Headings are in order on all 5 pages. The skip link, focus ring, reduced-motion and forced-colours handling are good, and all body text is at least 4.72:1. The form's status text is not a live region, which fails WCAG 4.1.3 (M1). |
| 7 | Trust and conversion | 9 | There is one call to action. The FAQ is frank ("It can, like any tool."), the next step is clear, and the invented offer is gone. The owner-confirm items are listed below. |

## Must fix

### M1. Form status is never announced (WCAG 4.1.3 Status Messages)
`src/pages/free-ai-audit.astro` line 82, `<p class="notice" data-form-status hidden></p>`, has no live region. Its text ("Sending...", "Thanks, got it...", the error, and today the placeholder notice) appears silently for screen-reader users. The wrapper must always be in the DOM, because a live region that is itself un-hidden while its text changes is announced unreliably.
- line 82:
  `          <p class="notice" data-form-status hidden></p>`
  ->
  `          <div role="status"><p class="notice" data-form-status hidden></p></div>`
- No script change is needed: `querySelector('[data-form-status]')` still finds the `<p>`.
- Side effect: the empty div is one more grid item in `.form` (gap 18px), so the form ends 18px lower. That is at the bottom of the form and not visible as a defect. If it matters, add `.form > [role="status"]:has(> [hidden]) { display: none; }` and do not use `display:none` on the wrapper any other way.

## Should fix

S1. **Demo: the building example acts before you approve it.** `src/components/AgentLoop.astro` line 21, step 3 "Books the plumber, tells the tenant" comes before step 4 "You OK the visit". This contradicts "checks with you before anything important" (home FAQ) and the loop's own order. Every other tab drafts or proposes before the approval step.
`'Books the plumber, tells the tenant'` -> `'Finds a plumber, drafts a note to the tenant'`
(310px at 15.2px. Like the current line, it wraps to 2 lines at 360, where the column is 226px, and in the 5-column desktop layout, so the height doesn't change.)

S2. **Business page: the step name doesn't match its text, and the final CTA repeats step 1.**
- `src/pages/ai-agents-for-business.astro` line 59: `<li><h3>Run</h3>` -> `<li><h3>Train</h3>`. The text is about training, and this gives Audit / Set up / Train, which matches the page title "Setup and Training".
- Same file, line 72: `<FinalCta heading="Find where AI agents fit in your business." text="Free AI audit. Your top three openings, in writing." />` -> `<FinalCta heading="Find where AI agents fit in your business." />`. Step 1 already says "your top three openings". The default text "Free call. No obligation." matches home.

S3. **The privacy note describes a field the form doesn't have.** `src/pages/privacy.astro`, "What the form collects", says "best time to call and a short note", but the form has no note field.
`your business, phone, website, best time to call and a short note.` -> `your business, phone, website and best time to call.`
(If the owner wants a note field later, add it to the form and put the words back then.)

S4. **The form error points nowhere specific.** `src/pages/free-ai-audit.astro` line 125: "Sorry, that did not send. Please email us instead." gives no address, and the footer is the only place one appears.
- line 56: add `data-email={site.email}` to the `<form …>` tag.
- line 125 -> ``status.textContent = `Sorry, that did not send. Please email ${form.dataset.email || 'us'} instead.`;``

## Checked and fine (no change)
- Contrast: dim 7.26 / 6.91 / 6.61 and faint 5.19 / 4.94 / 4.72 on bg / soft / raised. Pile status 7.83. Button 10.40. The selected tab is 16.49. Input underlines (--line-strong) are 3.58:1, which passes the 3:1 non-text minimum.
- Desktop at 1280: the step text column is 292px (328px for the last step), and all three lines fit on one line. "You stay in charge" at 23.2px measures 198px.
- The home `h1` is the mono label and the big line is a `<p>`. This was accepted earlier for SEO and the headings stay in order.
- "Tools you already use" appears in the hero lede, the "Works with" label and step 2. It is the core promise, said three ways, so I'm leaving it.

## Owner must confirm (claims about her offer and contact details)
1. **Call length:** `site.callLength` = "20-minute" (still a TODO in src/site.ts). It shows in the hero trust line, two inner-page trust lines, the audit lede and two FAQs.
2. **Personal coaching:** "One-to-one sessions until it feels easy." (personal-ai-agents.astro step 3) is an open-ended commitment. Fallback: "One-to-one coaching on your own tasks."
3. **Audit deliverable:** "a one-page report with your top three openings, what each would cost, and what you can do yourself", and that it is free with no obligation.
4. **"You approve every change"** (business and personal trust lines) and "we test each workflow with you before it goes live" (home FAQ) as standing promises.
5. **"Sessions run remotely by video"** and "wherever they are" (personal FAQ), and "A free video call" (audit).
6. **Contact:** hello@cogmorphic.com doesn't exist yet (TODO). The Formspree endpoint and the Cal.com link are empty, so the form and calendar show placeholders. The founder name and LinkedIn are empty.
7. **Privacy:** that the form and booking services don't use the data for marketing, and that analytics, if any are added, are cookie-free (the page carries its own TODO).
8. **OG image** is still set in DejaVu (carried over). Regenerate it on a machine where Inter is available if the share card matters.
