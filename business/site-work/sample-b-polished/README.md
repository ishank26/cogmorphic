# cogmorphic.com

The website for Cogmorphic, agentic AI consulting for businesses and individuals.
A fast, static [Astro](https://astro.build) site, ready for Cloudflare Pages.

## Pages

| Address | Page |
| --- | --- |
| `/` | Home: hero, two service paths, Audit / Morph / Run, sample audit, why us, questions, final call to action |
| `/ai-agents-for-business/` | Service page for businesses |
| `/personal-ai-agents/` | Service page for individuals |
| `/free-ai-audit/` | What the free audit covers, the booking form and calendar |
| `/privacy/` | Short privacy note |

## Before launch: fill in the placeholders

Everything you need to change is in **`src/site.ts`**:

- `bookingUrl`: your Cal.com booking link. Until it's set, the audit page shows a marked placeholder.
- `formAction`: your Formspree endpoint. Until it's set, the form shows a marked placeholder and sends nothing.
- `email`: create `hello@cogmorphic.com` first, or change it.
- `founderFirstName`, `founderFullName`: shown in the About section and added to the search schema.
- `linkedinCompany`, `linkedinFounder`, `phone`: optional; empty values are hidden.
- `callLength`: confirm the free call length (default "20-minute").

Also: when you have a photo, add a short About section with your name and photo
(alt text: "[Name], founder of Cogmorphic, agentic AI consultant"), write the About lines in your own
voice, and review `src/pages/privacy.astro`.

## Run it on your computer

You need Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:4321. To check the finished build:

```bash
npm run build
npm run preview
npm run check:seo
```

## Publish on Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git, pick this repository.
2. Framework preset: Astro. Build command: `npm run build`. Output directory: `dist`.
3. After the first deploy, add the custom domains `cogmorphic.com` and `www.cogmorphic.com`,
   and add a redirect rule so `www.cogmorphic.com` goes to `https://cogmorphic.com`.

`public/_headers` sets security and caching headers on Cloudflare Pages.

## SEO built in

- One H1 per page with its main search phrase; titles under 60 characters, descriptions under 155.
- Canonical links, Open Graph and Twitter cards with a 1200×630 preview image (`public/og-image.png`).
- JSON-LD: Organization, WebSite, ProfessionalService with the free audit as an Offer, Service,
  BreadcrumbList and FAQPage (Person is added once the founder name is filled in).
- `sitemap-index.xml` (built automatically) and `robots.txt` pointing to it.
- Real HTML text everywhere, including the sample audit readout.
- Speed: self-hosted fonts with preloads, no framework JavaScript, the shader loads only after the page
  is idle on larger screens and never for reduced-motion visitors, effects pause off screen.
- `npm run check:seo` checks titles, descriptions, H1s, canonicals, sitemap, schema, alt text and links.

After launch: verify the domain in Google Search Console and Bing Webmaster Tools and submit
`https://cogmorphic.com/sitemap-index.xml`.

## Images

`npm run images` regenerates the social preview image and icons from the Orbit logo files in `src/assets/logo/`.
