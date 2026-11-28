import { site } from '../site';

const ORG_ID = `${site.url}/#organization`;
const SERVICE_ID = `${site.url}/#service`;
const PERSON_ID = `${site.url}/#founder`;
const WEBSITE_ID = `${site.url}/#website`;

const sameAs = [site.linkedinCompany].filter(Boolean);

const founder = site.founderFullName
  ? [{
      '@type': 'Person',
      '@id': PERSON_ID,
      name: site.founderFullName,
      jobTitle: 'Founder and agentic AI consultant',
      worksFor: { '@id': ORG_ID },
      ...(site.linkedinFounder ? { sameAs: [site.linkedinFounder] } : {}),
    }]
  : [];

export const baseGraph: Record<string, unknown>[] = [
  {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    url: `${site.url}/`,
    logo: { '@type': 'ImageObject', url: `${site.url}/logo.png`, width: 512, height: 512 },
    description: 'Cogmorphic sets up AI agents that improve how businesses and individuals work.',
    ...(site.email ? { email: site.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(founder.length ? { founder: { '@id': PERSON_ID } } : {}),
  },
  {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${site.url}/`,
    name: site.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  },
  {
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: site.name,
    url: `${site.url}/`,
    image: `${site.url}/og-image.png`,
    serviceType: 'AI consulting',
    description: 'Agentic AI consulting for businesses and individuals: process audits, AI agent setup, training and ongoing support, delivered remotely by video.',
    areaServed: { '@type': 'Place', name: 'Worldwide (remote)' },
    availableChannel: { '@type': 'ServiceChannel', name: 'Video call', serviceUrl: `${site.url}/free-ai-audit/` },
    provider: { '@id': ORG_ID },
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    knowsAbout: ['Agentic AI', 'AI agents', 'Business process automation', 'AI workflow automation', 'AI training'],
    makesOffer: {
      '@type': 'Offer',
      name: 'Free AI audit',
      url: `${site.url}/free-ai-audit/`,
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description: 'A free video call and a written list of the top three places AI agents could save you time.',
    },
  },
  ...founder,
];

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: new URL(it.path, site.url).href,
    })),
  };
}

export function serviceSchema(opts: { name: string; path: string; description: string; audience: string }) {
  return {
    '@type': 'Service',
    name: opts.name,
    url: new URL(opts.path, site.url).href,
    description: opts.description,
    serviceType: opts.name,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Place', name: 'Worldwide (remote)' },
    audience: { '@type': 'Audience', audienceType: opts.audience },
  };
}
