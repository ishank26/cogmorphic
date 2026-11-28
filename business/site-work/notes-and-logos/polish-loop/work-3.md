# Work, round 3 (commit on sample-b-polish, see git log -1)

Checks: `npm run build` OK (6 pages). `npm run check:seo`: "All on-page SEO checks passed". Whole-word, case-insensitive grep for help/helps/helper/helpful over every dist HTML file (including nested pages): no matches. jsdom loop test (t3.cjs) on dist/index.html: auto-advance, pause ("Pause demo" -> "Play again"), End key and panel tabindex 0 all OK, errors []. New jsdom form test (jsd/t4.cjs) on dist/free-ai-audit/index.html: submit shows the placeholder text in the `[data-form-status]` p, whose parent has role="status".

## Must fix
- M1 Form status not announced: **done**. The status `<p>` is wrapped in an always-present `<div role="status">`. The script still finds `[data-form-status]` unchanged. Added `.form > [role="status"]:has(> [hidden]) { display: none; }` so the empty wrapper adds no gap.

## Should fix
- S1 Demo building example: **done** as given ("Finds a plumber, drafts a note to the tenant"). Nothing is booked or sent before "You OK the visit".
- S2 Business page: **done**. "Run" -> "Train"; the final CTA uses the default "Free call. No obligation."
- S3 Privacy: **done** as given; the page now lists name, email, business, phone, website and best time to call, matching the form.
- S4 Form error: **done differently, by instruction**. No email was added (hello@cogmorphic.com is still an owner TODO). The text is now "Sorry, that did not send. Please try again in a moment."

## Not changed
All "Owner to confirm" items left as they were.

## Not verified
No browser here: screen-reader announcement and the `:has()` hide are checked from markup and CSS only.
