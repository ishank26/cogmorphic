# Cogmorphic website plan

Nov 24, 2026 · @Antoinette

Build one scrolling home page plus a free-audit page, in a dark terminal look with three effects from the catalogue, and send every visitor to one button: **Book a free AI audit.**

- **Audience:** businesses and individuals, anywhere. Cogmorphic improves how they work with agentic AI, then reshapes (morphs) their processes so AI agents can run them. Everything runs remotely by video.
- **Shape:** Home, two service pages (business and personal), Free AI audit, and a short Privacy page. Case studies come later.
- **Assets:** Paper Shaders for the hero, crt-terminal for a sample audit readout, dithercn for a "wherever you are" globe. All three are MIT or Apache licensed, so fine on a business site.
- **Hosting:** free on Cloudflare Pages, with step-by-step setup at the end of this doc. Running cost is about $48 a year with a $36 Porkbun inbox.
- **First step:** fill in the bracketed facts in the copy below (your name, prices, turnaround), then build.

## The assets: what they are and what you can use

The page is Uncommon Web, a catalogue of 425 open-source web effects (dither shaders, ASCII art, retro terminals), not a template kit of its own. Each library has its own licence, so pick ones that allow commercial use.

| Library | What it does | Licence (as listed) | Use it for | Pick? |
| --- | --- | --- | --- | --- |
| Paper Shaders | Light WebGL gradients, dithering and glows for React or plain JS | Apache-2.0 | Hero background | Yes |
| dithercn | Dithered globe and chart components, added with the shadcn command | MIT | "Wherever you are" globe, or a results chart | Yes |
| crt-terminal | A retro terminal window component for React | MIT | Sample audit readout on the home page | Yes |
| ascii-magic-art | 634 animated ASCII pieces and loaders | MIT | Small accent, form "sending" loader | Optional |
| textmode.js | Live ASCII graphics on a WebGL grid | MIT | Skip at launch; heavier than needed | Later |
| glyphcast | Plays video as coloured glyphs | MPL-2.0 | Not needed; no video at launch | No |

MIT and Apache-2.0 both allow use on a paid business site. Keep each library's licence notice in your code or a credits line in the footer. The licences above are as the catalogue lists them; confirm each on its own npm or GitHub page before you ship, since the catalogue's links didn't load for me.

One caution: your buyers are busy owners and managers, often opening the site on a phone between meetings. Use one moving effect per screen, give each a still image fallback, and keep the words plain. The look says "techy"; the copy says "we save your team hours every week."

Source: [Uncommon Web field guide](https://webdev.teknium.io/), read Nov 24, 2026.

## Site map

Start with one long home page, two short service pages for search, the audit page and a privacy note. A solo founder can write, launch and keep this current in a weekend.

1. **Home** (cogmorphic.com): the whole pitch on one scrolling page, ending in the booking button.
2. **AI agents for business** (cogmorphic.com/ai-agents-for-business): the business path in more depth. Added for search.
3. **Personal AI agents** (cogmorphic.com/personal-ai-agents): the individual path in more depth. Added for search.
4. **Free AI audit** (cogmorphic.com/free-ai-audit): what the free check covers, what they get back, and the booking form.
5. **Privacy** (cogmorphic.com/privacy): a short note on what the contact form collects. Needed once the form is live.

Add later, once there is something real to show: a Work page with two or three case studies, and a Notes page for short posts on practical AI for small teams.

## Page sections and copy

The home page tells one story: most work, at a company or for one person, is still built for humans doing every step. Cogmorphic redesigns it with agentic AI so agents handle the repetitive parts. That's the "morph" in the name. Copy below is a first draft for you to put in your own voice. Brackets mark facts only you can fill in.

### Home page, top to bottom

| Section | Headline | Short copy | Asset |
| --- | --- | --- | --- |
| 1. Hero | H1, set as the small label: Agentic AI consulting for businesses and individuals. Big display line: Morph how you work for the agentic AI era. | Cogmorphic helps businesses and individuals improve their processes with AI agents, and reshapes your tools and workflows so agents can run them safely. Start with a free audit. Under the button: Free \[20-minute\] call · No obligation · You approve every change. | Paper Shaders dithered gradient behind the text, still image on phones |
| 2. The problem | Your work wasn't built for AI agents. Yet. | Leads wait for a reply. Details get retyped between tools. Inboxes and calendars eat the day. Most processes need a person at every step, so agents can't help. | Three plain cards, small ASCII icons from ascii-magic-art (optional) |
| 3. What we do | Two ways to work with us. | For businesses: map your processes, set up AI agents for intake, follow-up, scheduling and reporting, and train your team to run them. For individuals: set up personal AI agents for email, research, planning and admin, and coach you on using them well. Both start with a free AI audit. | Two side-by-side cards |
| 4. See an audit | This is what we look for.  | A sample readout: repeated steps, handoffs between tools, response times, and which tasks an agent could take, with a pass or fix next to each. Label it clearly as a sample. | crt-terminal window typing the sample readout |
| 5. How it works | Audit, morph, run. | 1. Audit: a \[20-minute\] video call to map how you work. 2. Morph: we reshape the process and set up the agents you pick. 3. Run: a monthly check-in keeps them working and improving. | Three numbered steps, no effect |
| 6. Who we help | For teams and for individuals. | Small and mid-sized businesses in any industry, plus founders, freelancers and professionals who want their own AI agents. Remote, wherever you are. | dithercn globe, slowly turning |
| 7. About | Hi, I'm \[first name\]. | Two or three lines on why you started Cogmorphic. Your training background is a strength: you help people actually adopt new tools. Leave the day job's name out. | A real photo of you |
| 8. Questions | Before you book. | What is agentic AI? AI that can take steps on its own, like replying, booking or filing, with you approving what matters. Do I need to be good with tech? No. Do you work with individuals? Yes. What does it cost? The audit is free; work is quoted up front \[add your prices\]. What about my data? Say how you handle it. | Simple open and close list |
| 9. Final ask | See what agents could take off your plate. | One free call, a written list of fixes, no obligation. Button: Book a free AI audit. | Repeat the hero shader, dimmed |

Footer: hello@cogmorphic.com, Privacy link, and a one-line credit for the open-source libraries.

### Free AI audit page

- **Headline:** Your free AI audit.
- **What we check:** the steps you or your team repeat, the tools you use and the handoffs between them, response times, and which tasks an AI agent could take on.
- **What you get:** a one-page report with your top three fixes, what each would cost, and what you can do yourself.
- **The form:** name, business, phone, website, and best time to call, then a booking calendar to pick the slot.

### Calls to action

One action everywhere: **Book a free AI audit.** It sits in the top bar, the hero, after the sample audit and at the end. A phone number in the top bar is worth adding too, since many owners would rather call than fill in a form.

### Search, marketing and trust

The hero splits the job in two: a label and headline with the search words (agentic AI, AI consulting), and a sub-line that says plainly who it's for and what changes.

- **Search:** use the phrases buyers type, such as "agentic AI consulting", "AI agents for business" and "personal AI agent setup", in the headline, the page title and the first paragraph. "Morph" is your brand word, so pair it with those, not instead of them.
- **Page title (the blue link on Google):** see the SEO plan below for every page's title
- **Meta description (the grey text under it):** Cogmorphic helps businesses and individuals improve their processes with AI agents, set up safely and explained simply. Book a free AI audit.
- **Marketing:** lead with the outcome (agents take the repetitive work), and keep the two paths, business and individual, clearly separate so each reader finds theirs fast.
- **Trust:** a real photo and your name in the About section, the trust line under the button, the plain "What is agentic AI?" answer, a note on how you handle data, and two or three results with numbers once you have them. Skip claims you can't prove yet.

Other headlines that keep the same search words:

1. Agentic AI for your business and your day-to-day work.
2. Reshape how you work with agentic AI.

## SEO plan

Give each page one main search phrase, get the technical basics right on launch day, then grow traffic with one or two short articles a month. The biggest single fix: make "Agentic AI consulting for businesses and individuals" the page's H1 and show "Morph how you work" as the big display line, so Google reads the search words and visitors see the brand line.

### Search phrases by page

| Page | Main phrase | Supporting phrases | What the searcher wants |
| --- | --- | --- | --- |
| Home | agentic AI consulting | AI agents for business, AI automation consultant, AI consulting for small business | Find a helper |
| AI agents for business | AI agents for business | AI agent setup, business process automation with AI, AI workflow automation | Compare options |
| Personal AI agents | personal AI agent setup | AI assistant setup, AI productivity coaching, AI agent for email | Get set up |
| Free AI audit | free AI audit | AI readiness assessment, AI opportunity assessment | Ready to book |

I haven't checked search volumes. Before you finalize, check these in Google Keyword Planner (free with a Google Ads account), then watch which phrases bring visitors in Search Console after launch.

### Titles and descriptions

| Page | Page title (under 60 characters) | Meta description (under 155 characters) |
| --- | --- | --- |
| Home | Cogmorphic: Agentic AI Consulting for Business and You | Cogmorphic helps businesses and individuals improve their processes with AI agents, set up safely and explained simply. Book a free AI audit. |
| AI agents for business | AI Agents for Business: Setup and Training, Cogmorphic | Find which processes AI agents can run, get them set up safely, and train your team to use them. Start with a free AI audit. |
| Personal AI agents | Personal AI Agent Setup and Coaching, Cogmorphic | Get your own AI agents for email, research, planning and admin, set up for how you work. Book a free call. |
| Free AI audit | Free AI Audit: Find Where AI Agents Fit, Cogmorphic | A free video call and a written list of the top three places AI agents could save you time. No obligation. |

### On every page

- **Headings:** one H1 with the main phrase. H2s use supporting phrases in plain questions, like "What is agentic AI?" and "How AI agents help your business".
- **Web addresses:** short, lowercase, hyphens, as in the site map above.
- **Links between pages:** every section links to the matching service page; every page links to the free audit; every article links to one service page and the audit.
- **Real text, not pictures of text:** the sample audit in the terminal effect must also exist as normal page text. Google can't read words drawn inside an animation.
- **Image alt text:** describe real photos ("\[Name\], founder of Cogmorphic, agentic AI consultant"). Leave alt empty on decorative backgrounds like the shader.

### Structured data

Add a small block of schema code (JSON-LD) so Google understands who you are:

- **Organization:** name, logo, cogmorphic.com, and your LinkedIn page.
- **ProfessionalService:** service type "AI consulting", served remotely, with the free audit as an offer.
- **Person:** you as founder, linked to your LinkedIn.
- **FAQPage:** the Questions section. Google rarely shows FAQ boxes for business sites now, but it still helps Google read the answers.

### Speed (Core Web Vitals)

Google's targets: main content shows within 2.5 seconds, taps respond within 200 milliseconds, and nothing jumps around as the page loads.

- Show a still image of the shader first and start the animation after the page has loaded. The headline, not the animation, should be the first big thing on screen.
- Load the terminal and globe only when scrolled into view, and pause them when off screen.
- Turn animations off for visitors whose phones are set to reduce motion.
- Reserve each effect's space in the layout so text doesn't jump.
- Host the two fonts yourself and use no more than two font families.

### Launch-day setup

- [ ] Sitemap and robots.txt (Astro's sitemap add-on makes the sitemap)
- [ ] One preferred address: redirect www.cogmorphic.com to cogmorphic.com
- [ ] A link preview image for LinkedIn and texts (Open Graph)
- [ ] Google Search Console: verify the domain with a DNS record in Cloudflare, then submit the sitemap
- [ ] Bing Webmaster Tools: import from Search Console in a few clicks
- [ ] Cloudflare Web Analytics, free and cookie-free
- [ ] Google Business Profile only if you meet clients in person; Google doesn't list online-only businesses

### Trust signals that also help search

A LinkedIn company page linked from the site, your name and photo on About, two or three case studies with real numbers, and client reviews on LinkedIn once you have them. Search engines weigh who is behind advice, so a real, named founder matters.

### Starter articles

1. What is agentic AI? A plain guide for small businesses
2. AI chatbot or AI agent: what's the difference?
3. Seven tasks AI agents can take off a small team's plate
4. How to get your business processes ready for AI agents
5. Personal AI agents: what to automate first in your workday
6. Setting up AI agents safely: a data checklist

Each one answers a question people ask, runs 800 to 1,200 words, and ends with a link to the free audit.

## Color and type

Go dark and warm: a near-black terminal screen with amber text accents, borrowed from the CRT and dither demos in the catalogue. It reads "tech" without feeling cold.

| Role | Color | Hex |
| --- | --- | --- |
| Background | Near black | #0b0b0c |
| Main text | Warm off-white | #fff1dc |
| Accent, buttons | CRT amber | #ffb000 |
| Links, "pass" marks | Signal mint | #7dffcf |
| Warnings, "fix" marks | Signal orange | #ff5a1f |

The hex values appear in the catalogue's demo code. Check amber buttons have dark text on them so they stay readable.

- **Headlines and labels:** Space Mono or JetBrains Mono, both free Google Fonts. Mono type gives the terminal feel.
- **Body text:** a plain sans serif such as Inter, so paragraphs stay easy to read for owners skimming on a phone.

## Getting it live on cogmorphic.com

The cheapest solid setup costs about $48 a year all in: free hosting, free form and booking tools, one Porkbun inbox, and the domain renewal.

| Piece | Option | Rough cost | Notes |
| --- | --- | --- | --- |
| Hosting | [Cloudflare Pages](https://www.cloudflare.com/products/pages) (recommended) | $0 | Free plan allows 500 builds a month and custom domains; Cloudflare lists bandwidth as unlimited |
| Contact form | [Formspree](https://help.formspree.io/articles/account-management/account-limits) free | $0 | 50 submissions a month, plenty to start |
| Booking | [Cal.com](https://cal.com/pricing) Individuals | $0 | Free for one person; shows Cal.com branding |
| Business email | [Porkbun Email](https://porkbun.com/products/porkbun_email) | $36 a year per inbox | 10 GB; same account as your domain, so setup is simple |
| Business email, alternative | [Google Workspace](https://workspace.google.com/intl/en/pricing/) Business Starter | Price to confirm | Gmail you already know, plus Calendar and Drive; Google's page didn't show me the price |
| Domain renewal | Porkbun | About $12 a year | Already bought |

### How to host it, step by step

Recommended: host on Cloudflare Pages and move the domain's DNS from Porkbun to Cloudflare. The domain stays registered at Porkbun; only the address book behind it moves. It takes about an hour of clicking plus a few hours of waiting.

**1. Build the site**

1. Have Claude Code on your computer build the site from this plan (Astro, with React for the three effects). The result is a folder of finished files, usually called dist.
2. Put the project in a GitHub repository on your account.

**2. Publish it on Cloudflare**

3. Make a free Cloudflare account.
4. Go to Workers & Pages, then Create application, then Pages, and connect your GitHub repository. Build command: npm run build. Output folder: dist.
5. Cloudflare publishes the site at a free address like cogmorphic.pages.dev. Check it there first.

No GitHub? You can drag and drop the dist folder instead (up to 1,000 files), but that project can't switch to GitHub later, so each change means uploading again.

**3. Point cogmorphic.com at it**

6. In Cloudflare, add cogmorphic.com as a site on the Free plan. Cloudflare shows you two nameservers.
7. In Porkbun, open Domain Management, then Details, then Nameservers. Remove the old entries, paste in Cloudflare's two, click Save Nameservers, then Submit. It usually takes a few hours, up to 48.
8. Back in your Pages project, open Custom domains, choose Set up a domain, and add cogmorphic.com. Repeat for www.cogmorphic.com. Cloudflare adds the records and the secure padlock certificate for you.

**4. Email, form and booking**

9. Create hello@cogmorphic.com in Porkbun Email ($36 a year). Because DNS now lives at Cloudflare, copy the mail records Porkbun lists (MX, SPF, DKIM, DMARC) into Cloudflare's DNS page. Porkbun warns that moving nameservers breaks its services until you do this.
10. Point the Formspree form at hello@cogmorphic.com and embed your Cal.com booking page on the audit page.
11. Test the form and the booking on your phone, then share the link.

After that, every change you push to GitHub goes live on its own in a minute or two.

**Simpler alternative:** keep DNS at Porkbun and add only www.cogmorphic.com in Cloudflare Pages, using a CNAME record at Porkbun that points to cogmorphic.pages.dev. Porkbun email keeps working untouched. The catch: the bare cogmorphic.com needs Porkbun's URL forwarding to send visitors to www.

Sources: Cloudflare's [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) and [direct upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) guides; Porkbun's [nameserver](https://kb.porkbun.com/article/22-how-to-change-your-nameservers) and [email setup](https://kb.porkbun.com/article/24-how-to-set-up-email-hosting-services) articles.

Before launch, check your day job's policy on outside business work, so the site and your LinkedIn stay in the clear.

Prices read on the vendors' pages on Nov 24, 2026.
