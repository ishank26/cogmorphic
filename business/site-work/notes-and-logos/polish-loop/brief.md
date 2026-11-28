# Cogmorphic Sample B polish loop

Site: Astro static marketing site for Cogmorphic, an AI-agent setup consultancy (cogmorphic.com) for small business owners and individuals.
Working copy: /tmp/claude-0/-home-user/cf222578-22d1-5970-b0a9-a397ec11e6e1/scratchpad/cog-polish (git branch sample-b-polish). Build: `npm run build` (output dist/). SEO check: `npm run check:seo` must print "All on-page SEO checks passed". Share image: `npm run images` writes public/og-image.png from scripts/make-images.mjs.
Pages: src/pages/index.astro (home, main focus), ai-agents-for-business.astro, personal-ai-agents.astro, free-ai-audit.astro, privacy.astro. CSS: src/styles/global.css. Demo: src/components/AgentLoop.astro. FAQ: src/data/faq.ts.

## Owner direction (her words, paraphrased only where marked)
- Dark design (near-black, amber #ffb000, Space Mono labels, dithered shader). She liked it; it must not look like Anthropic's design.
- "Make it so the customer knows a hard topic in an easy way. And it speaks to the problem." Reference: rainmaker.com and other deep tech startups (short problem-led hero, plain one-line subline, one familiar analogy, simple steps, frank answers to sceptics).
- Not "a CRM for invoice management": "the agents take you extra mile, unlocks other opportunities".
- She doesn't like the words "helper" and "help": never use help, helps, helper, helpful anywhere visible.
- Visual-first, few words, aesthetic and not intimidating; general across industries; smarter than a phone menu or chatbot; lead with efficiency and growth/money gains; never talk about replacing people; nothing fear-inducing; owners should feel comfortable and that this lets them achieve more. Hardware and sensors shown lightly.

## Rubric (grader scores 1-10 each)
1. Problem-first clarity: a non-technical owner gets the problem and what an AI agent is within two screens.
2. Opportunity framing: reads as "go further / new opportunities", not an admin or invoice tool.
3. Copy craft: few words, plain, calm, no hype, no repetition, forbidden words absent.
4. Visual polish and hierarchy: spacing, rhythm, typography, contrast, distinct (not Anthropic-like) dark look.
5. Mobile at 360 and 390 px: wrapping, overflow, tap targets 44px.
6. Accessibility: headings order, aria, focus, contrast >= 4.5:1 for body text, reduced motion, forced colors.
7. Trust and conversion: clear single call to action, frank FAQ, what happens next.
Target: every score >= 9 and no Must fix.

## Hard limits for everyone
- Work only inside the working copy above. Do not touch other folders or git branches. No network, no installs, no new npm packages.
- Do not push, publish or contact anyone.
- Don't invent stats, client names or testimonials.
- Commit only as the worker, on sample-b-polish, message ending with a blank line then: Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
