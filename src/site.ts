/**
 * Site settings. Everything marked TODO is a placeholder for Antoinette to fill in
 * before launch. Leave a value empty ('') and the site hides that piece.
 */
export const site = {
  name: 'Cogmorphic',
  url: 'https://cogmorphic.com',
  tagline: 'Agentic AI consulting for businesses and individuals',

  // TODO: set up free forwarding for this address (Cloudflare Email Routing, which needs the
  // domain's DNS on Cloudflare) before launch.
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

  // TODO FORM PLACEHOLDER: paste your Web3Forms access key here (free, 250
  // messages a month). Get it at web3forms.com: enter the inbox that should
  // receive the form, and Web3Forms emails you the key. It is meant to sit in
  // the page, so pasting it here is fine, though anyone could copy it to send
  // messages to that inbox. While empty, the form does not send.
  web3formsKey: '',
} as const;

export const cta = {
  label: 'Book a free AI audit',
  href: '/free-ai-audit/#book',
};
