// 49 lead configs. Plain data only; see ARCHITECTURE.md "Lead schema" and "Revision 2".
// systems: only tools named in the lead evidence; every key must exist in the playbook's defaults.systems.
// approver: lowercase role noun, used in sentences as "the {approver}".

export default [
  // insurance (5)
  {
    slug: 'allen-stults-company',
    name: 'Allen & Stults Company',
    short: 'Allen & Stults',
    town: 'Hightstown',
    playbook: 'insurance',
    approver: 'licensed CSR',
    systems: { core: 'AMS360' },
    focus: 'Turns policy-change, certificate and renewal requests into ready-to-file updates in AMS360, each one waiting for a licensed CSR.',
    guardrail: 'In a live setup, a licensed CSR approves every change, and the agent never gives coverage advice or issues certificates.'
  },
  {
    slug: 'rue-insurance',
    name: 'Rue Insurance',
    short: 'Rue',
    town: 'Hamilton',
    playbook: 'insurance',
    approver: 'licensed CSR',
    systems: { core: 'Applied Epic' },
    focus: 'Pulls renewal details from Applied Epic and drafts renewal summaries and policy-change requests for a licensed CSR to approve.',
    guardrail: 'In a live setup, a licensed CSR approves every summary and change, and the agent never gives coverage advice or issues certificates.'
  },
  {
    slug: 'prime-time-insurance-agency',
    name: 'Prime Time Insurance Agency',
    short: 'Prime Time',
    town: 'Freehold Township',
    playbook: 'insurance',
    approver: 'licensed CSR',
    features: ['spanish'],
    focus: 'Handles service requests in English and Spanish, from policy changes to renewals and billing questions, and drafts each reply for a licensed CSR.',
    guardrail: 'In a live setup, a licensed CSR approves every reply and change, and the agent never gives coverage advice.'
  },
  {
    slug: 'nelson-ward-company',
    name: 'Nelson & Ward Company',
    short: 'Nelson & Ward',
    town: 'Iselin',
    playbook: 'insurance',
    approver: 'account manager',
    systems: { core: 'Applied Epic' },
    focus: 'Reads client emails and drafts endorsement and renewal work in Applied Epic, each one approved by the account manager.',
    guardrail: 'In a live setup, a licensed CSR or producer approves anything that changes coverage, and client data stays inside the agency systems.'
  },
  {
    slug: 'oliver-l-e-soden-agency',
    name: 'Oliver L.E. Soden Agency',
    short: 'Soden Agency',
    town: 'Jamesburg',
    playbook: 'insurance',
    approver: 'licensed CSR',
    focus: 'Turns policy-change and certificate requests into ready-to-file drafts for a licensed CSR to approve.',
    guardrail: 'In a live setup, a licensed CSR approves every change and certificate, and the agent never issues a certificate on its own.'
  },

  // home-services (7): hvac = heating, cooling, plumbing, electrical; exterior = roofing, siding, irrigation, lighting
  {
    slug: 'anton-hvac-plumbing',
    name: 'Anton HVAC & Plumbing',
    short: 'Anton',
    town: 'East Brunswick',
    playbook: 'home-services',
    approver: 'dispatcher',
    features: ['hvac', 'sensor'],
    focus: 'Books no-heat calls, turns equipment alerts into service calls, reshuffles the day and chases permits and parts, with the dispatcher approving each step.',
    guardrail: 'In a live setup, the dispatcher approves every schedule change and customer text before it goes out.'
  },
  {
    slug: 'j-w-poole-inc',
    name: 'J.W. Poole Inc.',
    short: 'J.W. Poole',
    town: 'Monroe Township',
    playbook: 'home-services',
    approver: 'office manager',
    features: ['hvac', 'sensor'],
    focus: 'Carries a service call from booking to invoice, including equipment alerts, parts, permits and plan renewals, ready for the office manager to approve.',
    guardrail: 'In a live setup, the office manager approves every work order and invoice before it goes out.'
  },
  {
    slug: 'executive-roofing-systems',
    name: 'Executive Roofing Systems',
    short: 'Executive Roofing',
    town: 'Spotswood',
    playbook: 'home-services',
    approver: 'operations coordinator',
    features: ['exterior'],
    trade: 'roof',
    focus: 'Turns roof estimate requests into booked visits and priced estimates, moves outdoor work around the weather and invoices finished jobs.',
    guardrail: 'In a live setup, the operations coordinator approves every schedule, estimate and invoice before it goes out.'
  },
  {
    slug: 'first-choice-plumbing-heating-ac-electrical',
    name: 'First Choice Plumbing, Heating, AC & Electrical',
    short: 'First Choice',
    town: 'Metuchen',
    playbook: 'home-services',
    approver: 'CSR',
    features: ['hvac'],
    focus: 'Books service calls, keeps arrival times current, follows up on permits and drafts invoices with maintenance renewals, with a CSR approving each one.',
    guardrail: 'In a live setup, a CSR approves every booking and customer message before it goes out.'
  },
  {
    slug: 'service-professionals',
    name: 'Service Professionals',
    short: 'Service Professionals',
    town: 'Union',
    playbook: 'home-services',
    approver: 'CSR',
    features: ['hvac'],
    systems: { core: 'ServiceTitan' },
    focus: 'Handles bookings, reschedules, permits and invoices in ServiceTitan, with a CSR approving each one.',
    guardrail: 'In a live setup, a CSR approves every booking change and customer message before it goes out.'
  },
  {
    slug: 'wetscape',
    name: 'Wetscape',
    short: 'Wetscape',
    town: 'Keyport',
    playbook: 'home-services',
    approver: 'dispatcher',
    features: ['exterior'],
    trade: 'irrigation system',
    focus: 'Turns irrigation estimate requests into booked visits, moves outdoor jobs around the weather, and drafts estimates and invoices for the dispatcher to approve.',
    guardrail: 'In a live setup, the dispatcher approves every schedule change, estimate and invoice before it goes out.'
  },
  {
    slug: 'nxt-home-improvement',
    name: 'NXT Home Improvement',
    short: 'NXT',
    town: 'Central NJ',
    playbook: 'home-services',
    approver: 'owner',
    features: ['exterior'],
    trade: 'siding and gutters',
    focus: 'Turns website estimate requests into booked visits, priced estimates and invoices, ready for the owner to approve.',
    guardrail: 'In a live setup, the owner approves every booking, estimate and customer message before it goes out.'
  },

  // wealth (8)
  {
    slug: 'simon-quick-advisors',
    name: 'Simon Quick Advisors',
    short: 'Simon Quick',
    town: 'Morristown',
    playbook: 'wealth',
    approver: 'operations lead',
    systems: { crm: 'Salesforce', billing: 'Orion' },
    focus: 'Reconciles quarterly fees in Orion, logs meeting notes in Salesforce and preps client paperwork, with the operations lead approving each item.',
    guardrail: 'In a live setup, staff approve every item, and every agent action is logged and kept for books and records.'
  },
  {
    slug: 'money-at-work',
    name: 'Money at Work',
    short: 'Money at Work',
    town: 'Bedminster',
    playbook: 'wealth',
    approver: 'advisor',
    focus: 'Puts meeting notes into the CRM and drafts client follow-ups and paperwork for the advisor to approve.',
    guardrail: 'In a live setup, an advisor approves every note and follow-up, and tools are cleared with the broker-dealer first.'
  },
  {
    slug: 'shorehaven-wealth-partners',
    name: 'ShoreHaven Wealth Partners',
    short: 'ShoreHaven',
    town: 'Red Bank',
    playbook: 'wealth',
    approver: 'owner',
    focus: 'Handles meeting follow-ups, fee checks and new-client paperwork, with the owner approving each item.',
    guardrail: 'In a live setup, the owner approves every message and form, and the agent never gives investment advice.'
  },
  {
    slug: 'newport-capital-group',
    name: 'Newport Capital Group',
    short: 'Newport Capital',
    town: 'Red Bank',
    playbook: 'wealth',
    approver: 'operations associate',
    features: ['service'],
    systems: { esign: 'DocuSign' },
    focus: 'Prepares onboarding packets for DocuSign, money-movement forms and billing files, with operations approving each one.',
    guardrail: 'In a live setup, operations approves every form and file, and every action is logged and kept for books and records.'
  },
  {
    slug: 'carbon-wealth-advisors',
    name: 'Carbon Wealth Advisors',
    short: 'Carbon Wealth',
    town: 'Rochelle Park',
    playbook: 'wealth',
    approver: 'client service lead',
    features: ['service'],
    focus: 'Prepares transfer and custodial forms and new-account packets, with client service approving each item.',
    guardrail: 'In a live setup, a staff member approves every form before it goes to a custodian, and every action is logged.'
  },
  {
    slug: 'pine-valley-investments',
    name: 'Pine Valley Investments',
    short: 'Pine Valley',
    town: 'Marlton',
    playbook: 'wealth',
    approver: 'client service associate',
    features: ['service'],
    focus: 'Handles client service requests and paperwork, with a client service associate approving each reply.',
    guardrail: 'In a live setup, a staff member approves every reply and form, the agent never gives investment advice, and every action is logged.'
  },
  {
    slug: 'revolve-wealth-partners',
    name: 'Revolve Wealth Partners',
    short: 'Revolve',
    town: 'Hackensack',
    playbook: 'wealth',
    approver: 'advisor',
    focus: 'Handles the admin side of client work, from meeting follow-ups to account forms, with an advisor approving each item.',
    guardrail: 'In a live setup, an advisor approves every item, the agent never gives investment advice, and every action is logged.'
  },
  {
    slug: 'mclaughlin-private-wealth',
    name: 'McLaughlin Private Wealth',
    short: 'McLaughlin',
    town: 'Mount Laurel',
    playbook: 'wealth',
    approver: 'advisor',
    features: ['service'],
    focus: 'Handles client service requests and paperwork, with an advisor approving each reply.',
    guardrail: 'In a live setup, an advisor approves every item, and tools are cleared with the broker-dealer first.'
  },

  // law (5)
  {
    slug: 'levine-haddad-gregory',
    name: 'Levine Haddad & Gregory',
    short: 'Levine Haddad',
    town: 'Springfield',
    playbook: 'law',
    approver: 'attorney',
    features: ['estate'],
    focus: 'Summarizes estate intakes, drafts wills from the firm\'s templates and tracks probate deadlines, with an attorney approving each draft.',
    guardrail: 'In a live setup, an attorney approves every draft, and client files stay confidential.'
  },
  {
    slug: 'law-offices-of-patrick-accisano',
    name: 'Law Offices of Patrick Accisano',
    short: 'Accisano Law',
    town: 'Sea Girt',
    playbook: 'law',
    approver: 'attorney',
    features: ['estate'],
    focus: 'Summarizes new intakes, keeps the probate deadline calendar, drafts wills and prepares billing statements, with the attorney approving each one.',
    guardrail: 'In a live setup, the attorney supervises and approves every item, and client information stays confidential.'
  },
  {
    slug: 'edwards-estate-elder-law',
    name: 'Edwards Estate & Elder Law',
    short: 'Edwards Law',
    town: 'Watchung',
    playbook: 'law',
    approver: 'attorney',
    features: ['estate'],
    systems: { core: 'Clio' },
    focus: 'Drafts estate planning documents from matter details in Clio, tracks probate deadlines and summarizes new intakes, with an attorney approving each draft.',
    guardrail: 'In a live setup, an attorney approves every document, and client information stays confidential.'
  },
  {
    slug: 'mets-schiro-manetta',
    name: 'Mets, Schiro & Manetta',
    short: 'Mets Schiro',
    town: 'Woodbridge',
    playbook: 'law',
    approver: 'attorney',
    features: ['litigation'],
    focus: 'Logs court notices and discovery deadlines, summarizes intakes and drafts client letters, with an attorney approving each one.',
    guardrail: 'In a live setup, an attorney approves every item before anything is filed or sent, and client information stays confidential.'
  },
  {
    slug: 'kemeny-ramp-renaud',
    name: 'Kemeny, Ramp & Renaud',
    short: 'Kemeny Ramp',
    town: 'East Brunswick',
    playbook: 'law',
    approver: 'attorney',
    features: ['litigation'],
    focus: 'Handles paralegal prep, from intake summaries to motion and discovery deadlines and client letters, with an attorney approving each item.',
    guardrail: 'In a live setup, an attorney approves every draft, and client information stays confidential.'
  },

  // accounting (4)
  {
    slug: 'gaines-associates-cpa',
    name: 'Gaines & Associates CPA',
    short: 'Gaines CPA',
    town: 'Edison',
    playbook: 'accounting',
    approver: 'accounting manager',
    focus: 'Tracks month-end close checklists and chases missing client documents, with a manager approving each request.',
    guardrail: 'In a live setup, a manager approves every client request, and tax-return data is used only with client consent.'
  },
  {
    slug: 'mercadien',
    name: 'Mercadien',
    short: 'Mercadien',
    town: 'Hamilton',
    playbook: 'accounting',
    approver: 'accountant',
    systems: { core: 'QuickBooks' },
    focus: 'Categorizes bank-feed transactions in QuickBooks, tracks the close and drafts collection reminders, with an accountant approving each batch.',
    guardrail: 'In a live setup, an accountant approves every entry before it posts, and client data stays inside the firm systems.'
  },
  {
    slug: 'wilkinguttenplan',
    name: 'WilkinGuttenplan',
    short: 'WilkinGuttenplan',
    town: 'East Brunswick',
    playbook: 'accounting',
    approver: 'billing manager',
    focus: 'Drafts collection reminders and client document requests, with the billing manager approving each one.',
    guardrail: 'In a live setup, the billing manager approves every client message, and client data stays inside the firm systems.'
  },
  {
    slug: 'klatzkin-company',
    name: 'Klatzkin & Company',
    short: 'Klatzkin',
    town: 'Hamilton',
    playbook: 'accounting',
    approver: 'accountant',
    focus: 'Chases missing documents for amended returns and drafts estimated tax reminders, with an accountant approving each one.',
    guardrail: 'In a live setup, an accountant approves every request, and tax data moves only through the client portal with consent.'
  },

  // medical-billing (1)
  {
    slug: 'a-step-above-health-management-systems',
    name: 'A Step Above Health Management Systems',
    short: 'A Step Above',
    town: 'Manahawkin',
    playbook: 'medical-billing',
    approver: 'billing manager',
    focus: 'Posts payments, fixes rejected claims and drafts appeals for podiatry practices, with the billing manager approving each one.',
    guardrail: 'In a live setup, the billing manager approves every claim action, and patient data is handled only under a signed business associate agreement.'
  },

  // property (7)
  {
    slug: 'midlantic-property-management',
    name: 'Midlantic Property Management',
    short: 'Midlantic',
    town: 'Highland Park',
    playbook: 'property',
    approver: 'property manager',
    focus: 'Turns tenant and vendor messages into work orders, letters and replies, ready for a manager to approve.',
    guardrail: 'In a live setup, a property manager approves every work order, charge and reply before it goes out.'
  },
  {
    slug: 'prc-management',
    name: 'PRC Management',
    short: 'PRC',
    town: 'Red Bank',
    playbook: 'property',
    approver: 'property manager',
    features: ['sensor'],
    focus: 'Turns maintenance requests and leak alerts into work orders and matches vendor invoices, with a manager approving anything that spends money.',
    guardrail: 'In a live setup, a manager approves every money item, and the agent never pays a vendor or sends a notice on its own.'
  },
  {
    slug: 'premier-properties-of-new-brunswick',
    name: 'Premier Properties of New Brunswick',
    short: 'Premier Properties',
    town: 'New Brunswick',
    playbook: 'property',
    approver: 'property manager',
    systems: { core: 'AppFolio' },
    focus: 'Prepares move-outs and itemized deposit letters in AppFolio, ready for a manager to approve.',
    guardrail: 'In a live setup, a property manager approves every deduction and tenant letter before it goes out.'
  },
  {
    slug: 'cis-management',
    name: 'CIS Management',
    short: 'CIS',
    town: 'Lawrenceville',
    playbook: 'property',
    approver: 'property manager',
    focus: 'Drafts deposit letters, late notices and vendor work orders from the property file, with a manager approving each one.',
    guardrail: 'In a live setup, a property manager approves every letter, and anything legal goes to counsel before it is sent.'
  },
  {
    slug: 'rcp-management',
    name: 'RCP Management',
    short: 'RCP',
    town: 'Cranbury',
    playbook: 'property',
    approver: 'property manager',
    systems: { core: 'BuildingLink' },
    focus: 'Turns resident requests into BuildingLink work orders and drafts resident letters, ready for a manager to approve.',
    guardrail: 'In a live setup, a property manager approves every charge and resident message before it goes out.'
  },
  {
    slug: 'towne-country-management',
    name: 'Towne & Country Management',
    short: 'Towne & Country',
    town: 'Edison',
    playbook: 'property',
    approver: 'property manager',
    focus: 'Answers resident messages with a drafted reply and a filed request, ready for a manager to approve.',
    guardrail: 'In a live setup, a property manager approves every reply and work order before it goes out.'
  },
  {
    slug: 'g-william-group',
    name: 'G. William Group',
    short: 'G. William',
    town: 'Edison',
    playbook: 'property',
    approver: 'property manager',
    focus: 'Turns tenant and vendor messages into work orders, letters and replies, ready for a manager to approve.',
    guardrail: 'In a live setup, a property manager approves every work order, charge and reply before it goes out.'
  },

  // construction (5)
  {
    slug: 'distinct-engineering-solutions',
    name: 'Distinct Engineering Solutions',
    short: 'Distinct Engineering',
    town: 'North Brunswick',
    playbook: 'construction',
    approver: 'project manager',
    features: ['engineering'],
    focus: 'Schedules special inspections, sends inspection reports, answers RFIs and drafts proposals, with a project manager approving each one.',
    guardrail: 'In a live setup, a project manager approves every schedule change and outgoing message.'
  },
  {
    slug: 'veterans-contracting',
    name: 'Veterans Contracting',
    short: 'Veterans Contracting',
    town: 'Rahway',
    playbook: 'construction',
    approver: 'owner',
    features: ['contractor'],
    focus: 'Builds certified payroll packets from crew hours and turns crew texts into daily reports, with the owner approving each one.',
    guardrail: 'In a live setup, the owner approves every packet and payroll figure, and an authorized person signs each certified payroll.'
  },
  {
    slug: 'benaka-inc',
    name: 'Benaka Inc.',
    short: 'Benaka',
    town: 'New Brunswick',
    playbook: 'construction',
    approver: 'QC manager',
    features: ['contractor'],
    focus: 'Turns crew texts into daily reports, drafts RFIs and submittals, schedules inspections and builds certified payroll packets, with the QC manager approving each one.',
    guardrail: 'In a live setup, the QC manager approves every report, and controlled project data stays out of the agent until the firm\'s security rules are met.'
  },
  {
    slug: 'french-parrello-associates',
    name: 'French & Parrello Associates',
    short: 'French & Parrello',
    town: 'Wall Township',
    playbook: 'construction',
    approver: 'project manager',
    features: ['engineering'],
    systems: { core: 'Deltek' },
    focus: 'Handles project admin in Deltek, from proposals and RFI responses to inspection reports and scheduling, with a project manager approving each item.',
    guardrail: 'In a live setup, a project manager approves every record change and outgoing message.'
  },
  {
    slug: 'integrity-ironworks',
    name: 'Integrity Ironworks',
    short: 'Integrity Ironworks',
    town: 'Sayreville',
    playbook: 'construction',
    approver: 'project manager',
    features: ['contractor'],
    focus: 'Prepares submittals, RFIs and project paperwork, with a project manager approving each one.',
    guardrail: 'In a live setup, a project manager approves every submittal and outgoing document.'
  },

  // manufacturing (1)
  {
    slug: 'hydracore-inc',
    name: 'Hydracore Inc.',
    short: 'Hydracore',
    town: 'Metuchen',
    playbook: 'manufacturing',
    approver: 'quality manager',
    focus: 'Turns CMM results into inspection reports, builds first-article packages and handles cert requests and PO paperwork, with the quality manager approving each one.',
    guardrail: 'In a live setup, the quality manager approves every report, and controlled part data stays in the firm\'s own systems.'
  },

  // logistics (5)
  {
    slug: 'mill-wright-llc',
    name: 'Mill-Wright LLC',
    short: 'Mill-Wright',
    town: 'Hillside',
    playbook: 'logistics',
    approver: 'CSR',
    features: ['forwarder'],
    systems: { core: 'Magaya' },
    focus: 'Reads carrier and terminal updates, updates shipments in Magaya and drafts client status emails and export checklists for a CSR to approve.',
    guardrail: 'In a live setup, a CSR approves every client message, and licensed staff handle every export filing.'
  },
  {
    slug: 'lmd-integrated-logistic-services',
    name: 'LMD Integrated Logistic Services',
    short: 'LMD',
    town: 'Edison',
    playbook: 'logistics',
    approver: 'dispatcher',
    features: ['forwarder'],
    focus: 'Requests container pickup appointments and prepares export checklists, with the dispatcher approving each one.',
    guardrail: 'In a live setup, the dispatcher approves every appointment and document, and a licensed broker files customs paperwork.'
  },
  {
    slug: 'direct-impact-logistics',
    name: 'Direct Impact Logistics',
    short: 'Direct Impact',
    town: 'East Windsor',
    playbook: 'logistics',
    approver: 'dispatcher',
    focus: 'Adjusts the day\'s dispatch when loads change, chases delivery paperwork and drafts customer status emails, with the dispatcher approving each one.',
    guardrail: 'In a live setup, the dispatcher approves every route change and customer message before it goes out.'
  },
  {
    slug: 'trans-american-trucking-warehouse',
    name: 'Trans-American Trucking & Warehouse',
    short: 'Trans-American',
    town: 'South Plainfield',
    playbook: 'logistics',
    approver: 'dispatcher',
    focus: 'Turns load changes into dispatch updates and customer status emails, with the dispatcher approving each one.',
    guardrail: 'In a live setup, the dispatcher approves every assignment and customer message before it goes out.'
  },
  {
    slug: 'jvn-trucking-llc',
    name: 'JVN Trucking LLC',
    short: 'JVN Trucking',
    town: 'East Windsor',
    playbook: 'logistics',
    approver: 'owner',
    focus: 'Handles shipment status emails, pickup appointments, dispatch changes and delivery paperwork, ready for the owner to approve.',
    guardrail: 'In a live setup, the owner approves every load change, document and message before it goes out.'
  },

  // distribution (1)
  {
    slug: 'albany-county-fasteners',
    name: 'Albany County Fasteners',
    short: 'Albany County Fasteners',
    town: 'Edison',
    playbook: 'distribution',
    approver: 'customer service manager',
    focus: 'Answers order status, backorder, quote and delivery questions with drafted replies, ready for the customer service manager to approve.',
    guardrail: 'In a live setup, the customer service manager approves every reply, quote and order change before it goes out.'
  }
]
