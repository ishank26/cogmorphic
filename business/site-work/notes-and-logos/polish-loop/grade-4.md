# Grade, round 4: confirmation (Cogmorphic Sample B, branch sample-b-polish @ 1694355)

Method: I read the round-3 diff and checked each fix in src and dist. `npm run build` OK (6 pages). `npm run check:seo` prints "All on-page SEO checks passed". A whole-word, case-insensitive grep for help/helps/helper/helpful/helping over src, dist and public finds nothing. There is no browser, so screen-reader behaviour is judged from the markup, the CSS and the script order.

**TARGET NOT MET.** Six items score 9. Accessibility stays at 8 because the round-3 fix is undone by the CSS rule that came with it. The cause is my own round-3 suggestion, not the worker's execution. The fix is to delete one line. Once that is done, every item is at 9 and the target is met.

## Round-3 items checked in the code

| Item | Status |
|---|---|
| M1 Form status not announced | Markup done: `<div role="status"><p class="notice" data-form-status hidden></p></div>` (free-ai-audit.astro 82, also in dist). **But not effective**, because of global.css 200 (see M1 below). |
| S1 Demo order | Fixed. AgentLoop.astro 21 reads "Finds a plumber, drafts a note to the tenant", before "You OK the visit". Nothing is booked before approval. |
| S2 Business page | Fixed. The steps are Audit / Set up / Train. The final CTA renders the default "Free call. No obligation.", so step 1 is no longer repeated. |
| S3 Privacy fields | Fixed. It now lists "website and best time to call", and "short note" is gone from dist, so it matches the form. |
| S4 Form error | Fixed in another way, which is acceptable. The error now reads "Sorry, that did not send. Please try again in a moment." It no longer points to an address that doesn't exist. Once the email address is live, the owner can add it back. |

## Must fix

### M1. The status live region is hidden whenever it is empty, so its first message is not announced
`src/styles/global.css` line 200: `.form > [role="status"]:has(> [hidden]) { display: none; }`

Until someone submits, the inner `<p>` has `hidden`, so this rule takes the `role="status"` wrapper out of the accessibility tree. On submit, the script sets `status.hidden = false` and then sets `textContent` in the same tick. The region and its text therefore appear together. Screen readers announce a change only in a live region that already exists, and they don't reliably announce a `role="status"` region that shows up already filled. So the first message isn't announced. That covers the placeholder notice (what users get today), "Sending...", and an error on a first attempt. This is the same WCAG 4.1.3 failure M1 was meant to fix. I suggested this rule in round 3, and it was a mistake.

- Delete global.css line 200 entirely.
- The cost is an empty grid item that adds 18px at the bottom of the form. It isn't visible, and I accept it. Don't swap in `display:none`, `visibility:hidden` or `display:contents` on the wrapper. A negative margin wouldn't work either: grid tracks don't go below 0, so it wouldn't remove the gap.
- No markup or script change is needed.

## Should fix
None.

## Scores

| # | Area | Score | Reason |
|---|------|-------|--------|
| 1 | Problem-first clarity | 9 | Unchanged: hero, then "Sound familiar?", then "Cruise control for your work." with the gauge and the demo, all inside about two screens. |
| 2 | Opportunity framing | 9 | Forward-looking throughout. The demo now always proposes and leaves the decision to the owner. |
| 3 | Copy craft | 9 | The inner-page repeat is gone, the step name matches its text, and no forbidden words remain. |
| 4 | Visual polish and hierarchy | 9 | No visual change this round. The timeline, dial and dark amber look still hold. |
| 5 | Mobile 360/390 | 9 | The new demo line wraps to two lines in the 226px column, the same as the old line, so the height is unchanged. Nothing new overflows. |
| 6 | Accessibility | 8 | Everything else holds: heading order, skip link, focus, contrast of at least 4.72:1, reduced motion, forced colours. The status region doesn't work until M1 is fixed. With that line deleted, this scores 9. |
| 7 | Trust and conversion | 9 | One call to action, a frank FAQ, a privacy note that matches the form, and an honest error message. |

## Owner must confirm herself (unchanged from round 3)
1. **Call length:** `site.callLength` = "20-minute" (still a TODO in src/site.ts). It shows in the trust lines, the audit lede and two FAQs.
2. **Personal coaching:** "One-to-one sessions until it feels easy." (personal-ai-agents.astro step 3) is open-ended. Fallback: "One-to-one coaching on your own tasks."
3. **Audit deliverable:** a one-page report with the top three openings, what each would cost and what she can do herself, free with no obligation.
4. **Standing promises:** "You approve every change" and "we test each workflow with you before it goes live".
5. **Remote delivery:** "Sessions run remotely by video", "wherever they are", and "A free video call".
6. **Contact and services:** hello@cogmorphic.com doesn't exist yet. The Formspree endpoint and Cal.com link are empty, so the form and calendar show placeholders. The founder name and LinkedIn are empty. Once the address exists, she may want it in the form's error message.
7. **Privacy:** that the form and booking services don't use the data for marketing, and that any analytics will be cookie-free (TODO on the page).
8. **OG image:** it is still set in DejaVu. Regenerate it where Inter is installed if the share card matters.

TARGET NOT MET
