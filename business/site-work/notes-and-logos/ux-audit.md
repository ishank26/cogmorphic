# Cogmorphic site: final UI/UX audit

Reviewed 2026-11-24. Source: `/mnt/project-files/cogmorphic-site/` (same build as the preview artifact, v2; its `index.html` and shader bundle match this build). Built locally and rendered in headless Chromium at 360, 390, 430 (phones, 2x), 768 (tablet), 1280 and 1440 (desktop), all five pages plus 404.

Note: the current build has no globe. The only visuals are the dither shader (hero and final CTA), the CSS dot still and the sample audit terminal.

Every fix below was injected into the running pages and re-screenshotted, except where marked. The tested CSS is in `ux-audit-assets/tested-overrides.css`; screenshots are in `ux-audit-assets/`. No fix touches headings, keywords, schema, FAQ copy or the booking CTA.

## Summary

| Tier | Count |
| --- | --- |
| Must fix | 7 |
| Should fix | 6 |
| Nice to have | 5 |

Top three:
1. **Phones get an empty black hero.** The dot still is masked to the far right and then covered by a 60%→100% dark shade, so phones see no visual at all, under 120px of dead space.
2. **Spacing is too loose and uneven on phones.** Sections are 176px apart while labels sit 32px above their content, so the home page runs 4,641px at 360 wide and reads as gaps, not rhythm.
3. **Text contrast fails in several places.** `--text-faint` (3.58:1) carries small text, form fields are nearly invisible (1.22:1), and on tablet the lede and trust line sit on bright dither (down to 3.1:1 and 1.5:1).

Measured effect of the tested fixes (home page):

| Width | Page height before → after | CTA bottom before → after | Hero height before → after |
| --- | --- | --- | --- |
| 360 | 4641 → 4180 px | 569 → 477 px | 670 → 532 px |
| 768 | 4021 → 3382 px | 584 → 502 px | 671 → 551 px |
| 1280 | 4718 → 4060 px | 778 → 671 px | 940 → 771 px (now fits a 900px screen) |

What's already good: no horizontal scroll at any width; one H1 per page; total weight ~114 KB on phones and ~139 KB on desktop; the shader stays off on phones and under reduced motion; under reduced motion the terminal shows all its lines; keyboard focus shows a 2px amber ring on links and buttons; amber CTA text is 10.4:1.

---

## Must fix

### M1. Phone hero has no visual and too much top space
- **Where:** home hero, all widths under 768. Inner-page heroes share the top-space problem.
- **What's wrong:** `.fx-still` is masked to `78% 42%`, and at ≤760 `.fx-shade` paints `rgba(11,11,12,.6)` to solid `var(--bg)` over it, so almost nothing shows. `.hero` top padding is `clamp(120px, 18vw, 220px)`, which is 120px on every phone. The label starts ~190px below the top of the page under a blank block. On desktop the same clamp gives 220px, so the hero is 940px tall and overflows a 900px screen.
- **Fix:**
  1. Add `ux-audit-assets/hero-mobile.png` to `public/hero-mobile.png`. It's a 3 KB, 8-colour frame of the real hero shader at 1/3 scale, so it matches desktop. To regenerate it, screenshot the hero canvas, downscale it 3x with nearest neighbour, and quantize to 8 colours.
  2. In `src/styles/global.css`, replace the hero padding and add a phone background:
     ```css
     .hero { padding: clamp(56px, 11vw, 160px) 0 clamp(64px, 10vw, 140px); }
     .page-hero { padding: clamp(56px, 10vw, 136px) 0 clamp(48px, 7vw, 88px); }
     .hero .label { margin-bottom: 20px; }
     .display { margin-bottom: 20px; }          /* was 28px */
     .hero .lede, .page-hero .lede { margin-bottom: 32px; }  /* were 44px / 40px */

     @media (max-width: 767.98px) {
       .fx-still {
         background: url('/hero-mobile.png') right top / auto 100% no-repeat;
         image-rendering: pixelated;
         opacity: .55;
         -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 35%, transparent 85%);
                 mask-image: linear-gradient(180deg, #000 0%, #000 35%, transparent 85%);
       }
       .fx-shade { background: linear-gradient(90deg, rgba(11,11,12,.92) 0%, rgba(11,11,12,.6) 60%, rgba(11,11,12,.2) 100%); }
       .final .fx-still { display: none; }   /* keep the closing section calm on phones */
     }
     ```
     Delete the old `@media (max-width: 760px) { .fx-shade … }` rule, which this replaces. Make the breakpoint 767.98px so it meets the shader's `min-width: 768px` with no gap.
- **Result:** phones now show the amber dither top-right, fading out behind the lede. The CTA moves up 92px and the 1280 hero fits the screen (see `before-after-hero.png`).

### M2. Section rhythm is too loose, worst on phones
- **Where:** every `.section`, all pages. Phones: 88px top + 88px bottom = 176px between sections, against a 32px label gap. Desktop: up to 160+160px around blocks that hold ~100px of content (the two paths section).
- **Fix (global.css):**
  ```css
  .section { padding: clamp(64px, 9vw, 128px) 0; }     /* was clamp(88px, 12vw, 160px) */
  .label   { margin-bottom: clamp(24px, 4vw, 48px); }  /* was clamp(32px, 5vw, 56px) */
  ```
- **Result:** section gaps are 128px on phones and ~230px at 1280 (was 176 / 307), and the ratio of section gap to label gap stays near 5:1 at every width. Home page is 10–14% shorter with no copy removed.

### M3. "SAMPLE" tag overlaps the terminal's first line on phones
- **Where:** `Terminal.astro`, ≤430 wide. `.terminal .sample` is absolutely positioned at `top:10px; right:14px` and collides with `cogmorphic audit --sample`.
- **Fix:** move the tag into the title bar.
  - `src/components/Terminal.astro`: delete `<span class="sample">Sample</span>` from `.terminal__body`. In `.terminal__bar` add `<span class="sample-tag">Sample</span>` after `<span>audit.log</span>`. The bar is `aria-hidden`, and the visually hidden figcaption already says "Sample AI audit readout", so screen readers lose nothing.
  - CSS:
    ```css
    .terminal .sample { display: none; }  /* or delete the rule */
    .terminal__bar .sample-tag { margin-left: auto; letter-spacing: .12em; text-transform: uppercase; font-size: .66rem; }
    .terminal li { grid-template-columns: 6.5ch minmax(0, 1fr); gap: 1ch; }   /* was 4.5em / .4em */
    @media (max-width: 480px) {
      .terminal__body { line-height: 1.65; padding: 16px 16px 20px; }        /* was 1.9 / 20px 20px 24px */
      .terminal li + li { margin-top: 4px; }
    }
    ```
- **Result:** no overlap. Wrapped lines sit tighter and keep their hanging indent.

### M4. `--text-faint` fails contrast on small text
- **Where:** `#6f685e` on `#0b0b0c` is **3.58:1** (AA needs 4.5:1). It carries 12px or smaller text: the hero trust line, step numbers 01/02/03, breadcrumbs, the terminal bar, the form note, the footer copyright and the FAQ "+" icon.
- **Fix:** `:root { --text-faint: #8a8276; }`. That's **5.19:1** on the background and 4.97:1 on `--bg-raised`, and it still reads as a quieter tier than `--text-dim` (7.26:1).
- Link underlines use `--text-faint` as their decoration colour. The new value still looks subtle.

### M5. Form fields are nearly invisible and focus is weak
- **Where:** `/free-ai-audit/#book`, all widths. The field underline is `--line` `#222120` at **1.22:1**. WCAG 1.4.11 needs 3:1 for a field's boundary. People see labels floating over empty space (see the 390 screenshots). On focus the 1px line only changes colour, with `outline: none`.
- **Fix (global.css):**
  ```css
  :root { --line-strong: #6f685e; }   /* the old faint colour, 3.58:1, passes 3:1 for borders */
  .form input, .form select, .form textarea { border-bottom-color: var(--line-strong); }
  .form input:focus-visible, .form select:focus-visible, .form textarea:focus-visible {
    border-bottom-color: var(--amber);
    box-shadow: 0 1px 0 0 var(--amber);  /* 2px total underline */
  }
  .form select { min-height: 44px; }
  ```
  Replace the existing `:focus` rule with this `:focus-visible` one.

### M6. Orphaned third card on tablet
- **Where:** home "How our AI consulting works" and "Why work with Cogmorphic", and the "step by step" lists on the service pages, at about 500–719px and at 768–1023px. `repeat(auto-fit, minmax(220px, 1fr))` gives 2 columns, so the third item sits alone on a row (see `before-home-768.png`).
- **Fix (global.css, `.steps`):**
  ```css
  .steps { grid-template-columns: 1fr; }   /* replaces repeat(auto-fit, minmax(220px, 1fr)) */
  @media (min-width: 720px) { .steps { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  ```
  Both lists always have 3 items, so 3 columns from 720px is safe. The copy fits at 768 (checked).

### M7. Hero copy sits on bright dither at tablet and small desktop
- **Where:** home hero at 768–1280, and the final CTA. The lede (`--text-dim`) drops to about **3.1:1** and the trust line to about **1.5:1** where the shader's amber passes behind them. The current shade only reaches 85% black at 45% of the width, and the copy column runs to about 60–70%.
- **Fix (global.css, replaces the base `.fx-shade` background):**
  ```css
  .fx-shade { background: linear-gradient(90deg, var(--bg) 0%, rgba(11,11,12,.92) 40%, rgba(11,11,12,.55) 70%, rgba(11,11,12,.25) 100%); }
  ```
  With M4 this keeps the lede above 4.5:1 and the trust line readable, and the shader still shows clearly on the right (checked at 768 and 1280).

---

## Should fix

### S1. Phones can't reach the service pages from the header
- **Where:** `Header.astro`, ≤640. `.navlink` is hidden, which leaves only "Free audit". Business and Individuals are reachable only by scrolling to the paths section or the footer.
- **Fix:** add a small no-JavaScript disclosure menu, shown only on phones.
  - `Header.astro`, inside `<nav class="nav">` before the `.navcta` link:
    ```astro
    <details class="menu">
      <summary>Menu</summary>
      <div class="menu__panel">
        {links.map((l) => <a href={l.href} aria-current={path === l.href ? 'page' : undefined}>{l.label}</a>)}
      </div>
    </details>
    ```
  - CSS:
    ```css
    .menu { display: none; position: relative; }
    @media (max-width: 640px) {
      .menu { display: block; }
      .menu summary { list-style: none; cursor: pointer; color: var(--text-dim); min-height: 44px; display: inline-flex; align-items: center; padding: 0 4px; }
      .menu summary::-webkit-details-marker { display: none; }
      .menu[open] summary { color: var(--text); }
      .menu__panel { position: absolute; right: 0; top: calc(100% + 8px); min-width: 200px; background: var(--bg-raised); border: 1px solid var(--line); border-radius: 12px; padding: 8px; display: grid; }
      .menu__panel a { color: var(--text); text-decoration: none; padding: 0 12px; min-height: 44px; display: flex; align-items: center; border-radius: 8px; }
      .menu__panel a:hover { background: var(--line); }
    }
    ```
  Tested at 360: it fits beside the brand and "Free audit" (see `before-after-hero.png`, right panel).

### S2. Tap targets are under 44px
- **Measured:** brand and nav links 24px tall, footer links 22px, breadcrumb "Home" 17px, form select 42px. These pass the WCAG 2.2 AA minimum of 24px only because of spacing, and they are fiddly on phones.
- **Fix:**
  ```css
  .nav a, .brand { display: inline-flex; align-items: center; min-height: 44px; }
  .footer-links a { display: inline-flex; align-items: center; min-height: 32px; }   /* rows are 12px apart */
  .crumbs a { display: inline-block; padding: 10px 0; margin: -10px 0; }
  ```
  The header keeps its 68px height.

### S3. The trust line breaks mid-phrase on phones
- **Where:** home hero, service pages and the audit page at 360–430. "Free 20-minute call · No obligation · You / approve every change".
- **Fix:** wrap each item so lines break only between items, for example in `index.astro` and the other heroes:
  ```astro
  <p class="trust"><span>Free {site.callLength} call</span> · <span>No obligation</span> · <span>You approve every change</span></p>
  ```
  CSS: `.trust span { white-space: nowrap; }`. Tested: it breaks after "No obligation ·".

### S4. Anchor jumps can land under the sticky header
- Once M2 shrinks section padding to 64px, `/free-ai-audit/#book` (the main CTA target) scrolls the "Book your free AI audit" label under the 68px sticky header.
- **Fix:** `[id] { scroll-margin-top: 88px; }`.

### S5. An unused bold mono font is preloaded on every page
- `Base.astro` imports `@fontsource/space-mono/700.css` and preloads `space-mono-latin-700-normal.woff2` (16.7 KB). No style uses Space Mono at weight 700: `.label`, `.brand`, `.trust` and the terminal are all 400. It's downloaded at high priority on every visit and competes with the hero font.
- **Fix (`src/layouts/Base.astro`):** remove `import '@fontsource/space-mono/700.css';`. Change the `monoBold` preload to the 400 file: `import mono400 from '@fontsource/space-mono/files/space-mono-latin-400-normal.woff2?url';`. The hero's H1 label uses it, so preloading it prevents a font swap in the first view.

### S6. Audit form stacks every field on desktop
- **Where:** `/free-ai-audit/` at ≥900. The form column is about 400px, so `.form .row` with `minmax(220px, 1fr)` never makes two columns, and the form runs about 600px next to a 280px booking box. (Not re-screenshotted.)
- **Fix:** `.form .row { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }`. That gives 2 columns at desktop and 1 on phones.

---

## Nice to have

- **N1. Single words left over in the terminal on phones** ("reply", "minutes"): add `.terminal li span:last-child { text-wrap: pretty; }`. Don't shorten the lines, because they are the sample's content.
- **N2. Principles dots float alone** above each heading on phones. Either `margin-bottom: 16px` (tested; still a lone dot), or draw the dot inline: `.principles li::before { display: none; } .principles h3::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--amber); margin-right: 12px; vertical-align: middle; }`.
- **N3. Inline styles** (`style="margin-top:20px"` in `index.astro`; `margin-top:40px` on the service and audit pages; `align-items:start` on the audit split): move them to classes such as `.mt-20 { margin-top: 20px; }` and `.mt-40`, so spacing stays in one stylesheet.
- **N4. `body { overflow-x: hidden; }` → `overflow-x: clip;`**. It clips the same overflow without making a scroll container, which avoids iOS quirks with sticky headers.
- **N5. Footer credit line:** "Effects by Paper Shaders (Apache-2.0)" adds words to every page. If Antoinette wants it gone, keep the notice in `THIRD_PARTY_NOTICES.md` (already there) and drop the visible line. That's a judgment call for her, not a must.

## Checked and fine
- No horizontal scroll at 360, 390, 430, 768, 1280 or 1440 on any page.
- The CTA is above the fold on every page and width (home at 360: bottom edge 569px, 477px after fixes).
- Headings: one H1 per page, with H2s in order. The fixes change none of them.
- Reduced motion: shader off, terminal fully visible, smooth scroll off.
- Load: about 114 KB on phones (HTML with inline CSS, 3 fonts, 3 KB script) and about 139 KB on desktop (plus the 26 KB shader). After S5, about 97 KB and 122 KB.
- Keyboard focus ring on links and buttons: 2px amber, offset 3px.
