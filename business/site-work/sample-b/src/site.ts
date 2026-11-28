/**
 * Site settings. Everything marked TODO is a placeholder for Antoinette to fill in
 * before launch. Leave a value empty ('') and the site hides that piece.
 */
export const site = {
  name: 'Cogmorphic',
  url: 'https://cogmorphic.com',
  tagline: 'Agentic AI consulting for businesses and individuals',

  // TODO: create this inbox (Porkbun Email or Google Workspace) before launch.
  email: 'hello@cogmorphic.com',

  // TODO (optional): a business phone number, e.g. '+1-555-555-0100'. Empty hides it.
  phone: '',

  // TODO: founder first name and full name for the About section and schema.
  founderFirstName: '',
  founderFullName: '',

  // TODO: LinkedIn company page and your own LinkedIn profile.
  linkedinCompany: '',
  linkedinFounder: '',

  // TODO: confirm the length of the free audit call.
  callLength: '20-minute',

  // TODO BOOKING PLACEHOLDER: paste your Cal.com booking link here,
  // e.g. 'https://cal.com/your-name/free-ai-audit'. While empty, the site
  // shows a clearly marked placeholder instead of a calendar.
  bookingUrl: '',

  // TODO FORM PLACEHOLDER: paste your Formspree endpoint here,
  // e.g. 'https://formspree.io/f/abcdwxyz'. While empty, the form does not send.
  formAction: '',
} as const;

export const cta = {
  label: 'Book a free AI audit',
  href: '/free-ai-audit/#book',
};
