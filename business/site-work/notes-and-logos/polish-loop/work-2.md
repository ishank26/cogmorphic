# Work, round 2 (commit 09d2fdc on sample-b-polish)

Checks: `npm run build` OK (6 pages). `npm run check:seo`: "All on-page SEO checks passed". Whole-word, case-insensitive grep for help/helps/helper/helpful over every dist HTML file: no matches. "monthly check" no longer appears anywhere in dist. jsdom loop test (t3.cjs) on dist/index.html: auto-advance, pause ("Pause demo" -> "Play again"), End key and panel tabindex all OK, errors [].

## Must fix
- M1 Invented "monthly check-ins": **done** as given. Home step 3 is now "You stay in charge / Then take on more, at your pace." (underline on "take on more"). Business "Run" step is now "Hands-on training for your team."
- M2 Repeated "top three openings" line: **done** as given. The final CTA uses the component default, which renders "Free call. No obligation." The line stays only in step 1.
- M3 One-word widows at 360px: **done** as given (numeral column 56px -> 44px, `text-wrap: balance` on `.steps p`). This also applies to the business and personal steps.

## Should fix
- S1 Dial dead space: **done** as given (viewBox 0 0 52 40, all coordinates shifted by -6/-10, transform-origin 26px 26px, dasharray 63 unchanged). I checked the geometry by hand: the arc centre is (26,26) with r 24, and the strokes stay inside the box (about 0.5 units of margin). The dial script only toggles `is-set`, so it needed no change.
- S2 Broken timeline hairline: **done** as given. At 720px and up the li padding is 0, and the right padding moved to h3/p (0 on the last step).
- S3 Personal "One-to-one sessions until it feels easy.": **skipped, left as is**. It predates round 1: it is the same in 16d18db and has no diff since then. I didn't invent a replacement. The owner should confirm it. If she can't, the grader's fallback is "One-to-one coaching on your own tasks." `site.callLength` "20-minute" is still a TODO for her.

## Not verified
There's no browser here. The dial crop, the unbroken hairline and the balanced wrapping at 360px are checked from the CSS and SVG, not from screenshots.
