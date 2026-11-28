export default {
  id: 'wealth',
  agent: 'Client service agent',
  promise: 'Keeps the CRM current, prepares billing and account paperwork, and drafts every client note. The {approver} approves each one, and every action is logged.',
  defaults: {
    approver: 'lead advisor',
    systems: {
      crm: 'CRM',
      custodian: 'Custodian portal',
      billing: 'Billing system',
      esign: 'E-signature',
      docs: 'Document storage'
    }
  },
  items: [
    {
      id: 'q4-billing',
      channel: 'system',
      from: 'Billing system',
      receivedAt: '7:45 AM',
      subject: 'Q4 advisory fee run ready',
      body: 'Draft Q4 fee run is ready for 142 accounts, total $318,460.00. Values as of Sep 30.',
      steps: [
        { system: '{custodian}', text: 'Pulled Sep 30 values for all 142 accounts.' },
        { system: '{billing}', text: 'Compared billed values to custodian values. 139 match.' },
        { system: '{billing}', text: 'Flagged 3 mismatches: two late deposits, one household discount missing.' },
        { system: '{docs}', text: 'Logged the reconciliation for books and records.' }
      ],
      draft: {
        kind: 'Status update',
        to: '{approver}',
        fields: [['Accounts', '142'], ['Matched', '139'], ['Exceptions', '3'], ['Fee change', '-$412.50']],
        body: 'Q4 fee run reconciled. Three fixes before release: accounts 4471 and 5520 need Sep 30 deposits added; the Park household needs its 0.10% household discount. Net change after fixes: -$412.50.'
      },
      risk: 'Money: fees are not released until the {approver} signs off.'
    },
    {
      id: 'chen-meeting',
      channel: 'call',
      from: 'Meeting notes: Chen household annual meeting',
      receivedAt: '8:05 AM',
      subject: 'Annual meeting with Wei and Lin Chen',
      body: 'Discussed college savings for their daughter, raising monthly 529 contribution to $800, and updating beneficiaries after the new baby. They asked for a summary by Friday.',
      steps: [
        { system: '{crm}', text: 'Updated goals: college savings, new beneficiary on file.' },
        { system: '{crm}', text: 'Created tasks: 529 contribution change, beneficiary forms.' },
        { system: '{docs}', text: 'Saved meeting notes to the household folder.' },
        { system: '{crm}', text: 'Drafted follow-up email and logged it for books and records.' }
      ],
      draft: {
        kind: 'Reply email',
        to: 'Wei and Lin Chen',
        fields: [['Due', 'Friday'], ['Next steps', '2']],
        body: 'Hi Wei and Lin, thank you for meeting with us. Here is what we agreed: 1) raise the monthly 529 contribution to $800, 2) update beneficiaries to add your son. We will send both forms for e-signature this week. The {company} team'
      }
    },
    {
      id: 'okafor-onboarding',
      channel: 'form',
      from: 'New client form: Grace Okafor',
      receivedAt: '8:50 AM',
      subject: 'New client: rollover IRA and taxable account',
      body: 'Signed advisory agreement received. Client wants a rollover IRA from a prior employer plan and a joint taxable account with her spouse.',
      steps: [
        { system: '{crm}', text: 'Created household record for Grace and Daniel Okafor.' },
        { system: '{custodian}', text: 'Prepared account forms: rollover IRA and joint account.' },
        { system: '{docs}', text: 'Built the onboarding packet with forms and the firm disclosures.' },
        { system: '{esign}', text: 'Prepared the e-sign envelope, not sent.' },
        { system: '{crm}', text: 'Logged each step for books and records.' }
      ],
      draft: {
        kind: 'Onboarding packet',
        to: 'Grace and Daniel Okafor',
        fields: [['Accounts', 'Rollover IRA, joint taxable'], ['Signatures', '2']],
        body: 'Hi Grace and Daniel, welcome to {company}. Your account forms are ready for e-signature. Once signed, we will open both accounts and start the rollover with your prior plan. Call us with any questions. The {company} team'
      },
      risk: 'Goes outside the firm: the {approver} checks every form before the envelope is sent.'
    },
    {
      id: 'haines-wire',
      channel: 'email',
      from: 'Robert Haines',
      receivedAt: '9:30 AM',
      subject: 'Wire for house closing',
      body: 'Please wire $25,000 from my brokerage account to the title company for my closing on Monday. Wire details attached.',
      steps: [
        { system: '{crm}', text: 'Found client. Phone on file differs from the number in this email signature.' },
        { system: '{custodian}', text: 'Confirmed available cash: $41,200.00.' },
        { system: '{docs}', text: 'Prepared the wire request form, marked pending verification.' },
        { system: '{crm}', text: 'Created a call-back task to the phone number on file.' },
        { system: '{crm}', text: 'Logged the request for books and records.' }
      ],
      draft: {
        kind: 'Money movement form',
        to: '{approver}',
        fields: [['Amount', '$25,000.00'], ['From', 'Brokerage account ending 0917'], ['Status', 'Awaiting call-back'], ['Phone', 'Use number on file only']],
        body: 'Wire request prepared, not submitted. Call Robert at the number on file to confirm the amount and the title company wire details by voice before release.'
      },
      risk: 'Moves money: nothing moves until the {approver} verifies by call-back to the number on file.'
    }
  ],
  quickWins: [
    {
      requires: 'service',
      job: 'Client service emails into service tickets and client replies',
      unit: 'request', units: 'requests',
      pasteLabel: 'Paste a client service email',
      pasteHint: 'Change or remove client names, and remove account numbers, Social Security numbers and birth dates first.',
      task: 'Turn the message into a service ticket for the {approver} and a short reply that confirms receipt and says what happens next.',
      rules: [
        'Never say a withdrawal, transfer, trade or wire is done, scheduled or approved.',
        'For any money movement or change of address, bank or contact details, set Verification to a call back at the phone number on file before processing.',
        'Never give investment, tax or legal advice. Say the advisor will follow up.',
        'Do not copy account, Social Security or bank numbers. Write "In original message" instead.'
      ],
      draftKind: 'Service ticket',
      fields: ['Client', 'Request type', 'Details', 'Needed before processing', 'Verification'],
      replyTo: 'client',
      example: 'Hi, it is Linda Moreau. I need $18,000 from my IRA sent to my checking account by the 15th for my granddaughter\'s tuition. Please also change my mailing address to 42 Orchard Lane, Clayton Falls. Should I have taxes taken out?',
      exampleDraft: {
        fields: {
          Client: 'Linda Moreau',
          'Request type': 'IRA withdrawal and address change',
          Details: '$18,000 from IRA to checking by the 15th. New mailing address: 42 Orchard Lane, Clayton Falls. Asks about tax withholding.',
          'Needed before processing': 'Signed distribution form, withholding election, advisor call on withholding',
          Verification: 'Call back at the phone number on file before either request. Address change with a withdrawal: confirm both by voice.'
        },
        reply: 'Hi Linda, thank you for your note. We received your request for an $18,000 withdrawal from your IRA and your new mailing address. Before we process either one, we will call you at the phone number we have on file to confirm. Your advisor will go over tax withholding with you on that call, and we will then send the form for your signature. The {company} team'
      },
      measure: 'time from a client email to a ready ticket and reply',
      next: ['Onboarding packets and custodian forms prepared', 'Meeting notes into CRM notes and client recaps', 'Quarterly fee run checks before billing']
    },
    {
      job: 'Meeting notes into CRM notes and client recap emails',
      unit: 'meeting', units: 'meetings',
      pasteLabel: 'Paste your notes from a client meeting',
      pasteHint: 'Change or remove client names, and remove account numbers, Social Security numbers and birth dates first.',
      task: 'Turn the advisor\'s meeting notes into a CRM note and a short recap email to the client.',
      rules: [
        'Write only what the notes say was discussed or decided. Never add a recommendation, forecast, performance figure or view on any investment.',
        'Never say a trade, transfer or withdrawal has been done.',
        'Under Flag for review, list any complaint, money movement, beneficiary or trusted contact change, or concern about the client\'s health or capacity. Never mention a complaint or a health or capacity concern in the recap email.',
        'Do not copy account, Social Security or birth date details.'
      ],
      draftKind: 'CRM note',
      fields: ['Client', 'Topics discussed', 'Decisions', 'Action items', 'Flag for review'],
      replyTo: 'client',
      example: 'Annual review with Tom and Priya Calloway. Tom retires end of June 2027, and they want $40,000 kept in cash for a kitchen remodel next spring, which we agreed to. We will look at Social Security timing at the May review. Send a beneficiary form for Tom\'s rollover IRA, and Priya wants to add their daughter Maya as trusted contact.',
      exampleDraft: {
        fields: {
          Client: 'Tom and Priya Calloway',
          'Topics discussed': 'Tom\'s retirement in June 2027, cash for a kitchen remodel next spring, Social Security timing',
          Decisions: 'Keep $40,000 in cash for the remodel. Review Social Security timing at the May meeting.',
          'Action items': 'Advisor: set aside the $40,000. Send beneficiary form for Tom\'s rollover IRA. Send trusted contact form for Priya. Book the May review. May review date not set.',
          'Flag for review': 'Raising cash needs a trade, placed by the advisor. Beneficiary form going out for Tom\'s rollover IRA. Trusted contact being added: Maya Calloway.'
        },
        reply: 'Hi Tom and Priya, thank you for meeting with us. Here is what we agreed. We will keep $40,000 in cash for your kitchen project next spring, and we will look at Social Security timing together at your May review. We will send a beneficiary form for Tom\'s rollover IRA and a trusted contact form for Priya. Reply if we missed anything. The {company} team'
      },
      measure: 'time from meeting end to a logged note and a sent recap',
      next: ['Client service emails into tickets and replies', 'Onboarding packets and custodian forms prepared', 'Quarterly fee run checks before billing']
    }
  ]
};
