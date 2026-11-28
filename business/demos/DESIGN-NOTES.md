# Design notes (demo UI)

Fonts, load in the page head before <style>:
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap">

Tokens (bare :root is dark, light under prefers-color-scheme and [data-theme="light"]):
- Surfaces: --bg, --raised (panels), --sunk (selected row, read-only draft), --line, --line-strong
- Text: --text, --dim, --faint
- Accent: --accent / --accent-ink for .btn--primary only; --focus for focus rings and the editable draft
- State: --neutral (new), --info (working), --review, --ok (approved, edited, done steps), --bad (rejected, risk)
- Type: --sans Inter, --mono Space Mono (labels, chips, times). Radius --r 10px on panels only.

State encoding: every .status shows a CSS glyph (ring, spinning ring, diamond, check, dashed-check, cross).
The builder must put the status word inside .status and the channel word inside .chan; CSS adds only the mark.
Steps: pending dim ring, running spinning ring, done filled check. Reduced motion stops all animation.

Layout:
- Desktop (>=1120px): stats in 4 columns; panels Incoming | Agent at work | Draft in 3 columns; queue scrolls inside its panel.
- Tablet (720-1119px): Incoming | Agent at work, Draft spans the full row below.
- Phone (<720px): one column; Incoming is a compact horizontal strip (scrolls inside itself) so Run agent
  shows early; stats stay one row of four small numbers; review buttons stretch. No page scroll sideways at 400px.
- Audit trail and footer run full width below the grid.

Builder notes: queue selection is button[aria-current="true"]. styles.css owns [hidden]{display:none!important}; drop it from the view. Textarea uses the
readonly attribute; removing it switches to the editable look. .toast hides itself when empty.
Log entries: <li class="log__entry"><time>9:14 AM</time><span>text</span></li>.

## Revision 4: quick win with proof
Order: win-hero, try, numbers + pilot (side by side from 960px, stacked below), morning (workbench), footer.
- win-hero: the only h1, 2.1-4.25rem, max 18ch. Kicker and lede in --dim so the job line dominates.
- try: a "desk" (--sunk, strong border, shadow) holding the field and a "document" (.try__result on --raised).
  From 960px: input column left, document right. Document = mono kind with a heavy rule, ruled key/value grid, reply, dashed-rule note.
  example: dashed input and document plus an "Example" tag (CSS ::before). busy: pulsing --info dot before .try__status and a soft
  --info ring on the document; text never fades. Reduced motion: dot and ring stay, static.
- numbers: 3 inputs in 3 columns (16px+ mono, 48px tall), big Space Mono figure below. Markup can be label>input or label+input siblings.
- pilot: check-marked terms, then .pilot__list as a rising staircase (02 rises over 01). Under 560px it becomes an indented vertical ladder.
- morning: wraps the workbench under a strong top rule; .demo__intro/.demo__title rules removed.
- Inputs and the textarea use a --faint border (3:1 or better as a UI boundary). Focus: 2px --focus outline plus --focus border.

Contrast of the new pairs (WCAG AA, 4.5:1 text, 3:1 UI):
| Pair (where) | Dark | Light |
|---|---|---|
| --text on --bg (h1, number inputs) | 16.49 | 16.00 |
| --dim on --bg (kicker, lede) | 7.26 | 6.71 |
| --text on --sunk (try label, ladder steps) | 16.77 | 14.79 |
| --dim on --sunk (hint, status, example input, Example tag, ladder counters) | 7.38 | 6.20 |
| --text on --raised (input text, fields, reply, terms, figure) | 15.82 | 17.58 |
| --dim on --raised (field labels, reply-to, note, numbers label, pilot next) | 6.96 | 7.37 |
| --faint on --raised (placeholder) | 4.97 | 5.49 |
| --accent-ink on --accent (Draft it) | 10.40 | 10.40 |
| --ok on --raised (pilot check marks) | 15.35 | 6.88 |
| UI: --faint border on --raised / --bg (textarea / number inputs) | 4.97 / 5.19 | 5.49 / 5.00 |
| UI: --focus ring on --sunk / --raised | 10.92 / 10.30 | 4.91 / 5.83 |
Lowest text pair: dark 4.97 (placeholder on --raised), light 5.49 (placeholder on --raised); excluding placeholders 6.96 dark, 6.20 light.
