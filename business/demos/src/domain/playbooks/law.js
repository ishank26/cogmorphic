// Items with requires 'estate' fit estate, elder law and probate practices.
// Items with requires 'litigation' fit litigation practices. The billing item fits both.
export default {
  id: 'law',
  agent: 'Practice support agent',
  promise: 'Handles intake, court dates, drafts and billing. The {approver} approves everything, and nothing the agent writes is legal advice.',
  defaults: {
    approver: 'supervising attorney',
    systems: {
      core: 'Practice management system',
      docs: 'Document management',
      calendar: 'Firm calendar',
      billing: 'Billing system'
    }
  },
  // Quick win: new client inquiries into an intake summary and a reply that only starts the conflict check.
  quickWins: [
    {
      requires: 'estate',
      job: 'New estate and elder law inquiries into intake summaries and replies',
      unit: 'inquiry', units: 'inquiries',
      pasteLabel: 'Paste a new client inquiry',
      pasteHint: 'Use a made-up inquiry or a past one with names changed. Remove names, phone numbers, emails, addresses and docket numbers first.',
      task: 'Turn the inquiry into an intake summary for the {approver} and a short reply that starts the conflict check.',
      rules: [
        'Never give legal advice, including on Medicaid, taxes, wills or moving assets.',
        'If someone writes about a parent or relative, treat that person as the likely client, say the {approver} will need to speak with them, and never comment on anyone\'s capacity.',
        'Ask only for the names needed for a conflict check, never for financial or medical details.',
        'Say plainly that the reply is not legal advice and does not create an attorney-client relationship.'
      ],
      draftKind: 'Intake summary',
      fields: ['Matter type', 'Who the client would be', 'Names for conflict check', 'Time pressure', 'Next step'],
      replyTo: 'sender',
      example: 'Hi, I am writing about my mother, Ruth Calloway. She is 84 and her doctor says she should move to a nursing home next month. My brother and I think she needs Medicaid and a power of attorney, since she gets confused some days. Can you help, and what will it cost? Linda Pryce, (555) 010-0147',
      exampleDraft: {
        fields: {
          'Matter type': 'Elder law: Medicaid planning and power of attorney',
          'Who the client would be': 'Likely Ruth Calloway, not the sender. The {approver} must speak with her directly.',
          'Names for conflict check': 'Ruth Calloway, Linda Pryce, brother (name not stated)',
          'Time pressure': 'Nursing home move expected next month',
          'Next step': 'Get the brother\'s name, run the conflict check, then set a consult that includes Ruth Calloway'
        },
        reply: 'Hello Linda, thank you for reaching out about your mother. Before we discuss any details, we run a standard conflict check. Could you send your brother\'s full name? Once that is done, our office will call you to set up a consultation, and the attorney will want to speak with your mother as well. We will go over fees then. This message is not legal advice and does not mean the firm represents you or your mother. {company}'
      },
      measure: 'time from new inquiry to approved reply, and staff minutes per inquiry',
      next: ['Probate notices into calendar holds for attorney check', 'Will and trust first drafts from questionnaires', 'Client document checklists and reminders']
    },
    {
      requires: 'litigation',
      job: 'New case inquiries into intake summaries and conflict-check replies',
      unit: 'inquiry', units: 'inquiries',
      pasteLabel: 'Paste a new client inquiry',
      pasteHint: 'Use a made-up inquiry or a past one with names changed. Remove names, phone numbers, emails, addresses and docket numbers first.',
      task: 'Turn the inquiry into an intake summary for the {approver} and a short reply that starts the conflict check.',
      rules: [
        'Never give legal advice, assess the case or say how strong it is.',
        'Never state or estimate a deadline, response period or statute of limitations. Flag every date for the {approver}.',
        'Ask only for the names needed for a conflict check, and ask the sender not to send documents or details until the check clears.',
        'Say plainly that the reply is not legal advice and does not create an attorney-client relationship.'
      ],
      draftKind: 'Intake summary',
      fields: ['Matter type', 'Their side', 'Names for conflict check', 'Dates to flag', 'Next step'],
      replyTo: 'sender',
      example: 'I was served yesterday with court papers. Brightline Builders LLC is suing me and my wife for $18,500 they say we owe on our kitchen job. They never finished the work and the cabinets are wrong. I do not know what to do or how long I have. Can someone call me? Marcus Webb, (555) 010-0163',
      exampleDraft: {
        fields: {
          'Matter type': 'Civil defense: contractor suing for an unpaid balance of $18,500',
          'Their side': 'Defendant, with spouse',
          'Names for conflict check': 'Marcus Webb, Brightline Builders LLC, spouse (name not stated)',
          'Dates to flag': 'Served the day before this message. Service date not stated exactly. The {approver} sets the response deadline.',
          'Next step': 'Run the conflict check today, then the {approver} calls back'
        },
        reply: 'Hello Marcus, thank you for contacting us. Before we discuss your case, we run a standard conflict check. Please reply with your wife\'s full name and the names of anyone else involved, but do not send documents or details yet. Our office will call you once the check is done. This message is not legal advice and does not create an attorney-client relationship. {company}'
      },
      measure: 'time from new inquiry to approved reply, and staff minutes per inquiry',
      next: ['Court notices into calendar holds for attorney check', 'Discovery request checklists and client letters', 'Monthly billing narratives tidied for review']
    }
  ],
  items: [
    {
      id: 'intake-hall',
      requires: 'estate',
      channel: 'call',
      from: 'Call summary: Karen Hall',
      receivedAt: '7:50 AM',
      subject: 'New matter: father passed, she is named executor',
      body: 'Caller says her father, Robert Hall, passed on Oct 28. His will names her as executor. She has the original will and wants help with probate and the house sale.',
      steps: [
        { system: '{core}', text: 'Created a prospective client record for Karen Hall.' },
        { system: '{core}', text: 'Ran a name search for Robert Hall and the two other heirs she named. No match.' },
        { system: '{docs}', text: 'Wrote the intake summary and a list of documents to bring.' },
        { system: '{calendar}', text: 'Found two consult openings: Thursday 10 AM, Friday 2 PM.' }
      ],
      draft: {
        kind: 'Intake summary and conflict check',
        to: '{approver}',
        fields: [['Matter', 'Probate, Estate of Robert Hall'], ['Executor', 'Karen Hall'], ['Conflict search', 'No match found'], ['Consult', 'Thu 10 AM or Fri 2 PM']],
        body: 'Prospective client is the named executor of her father\'s will (date of death Oct 28). She has the original will and needs help with probate and selling the house. Please confirm the conflict check and pick a consult time.'
      },
      risk: 'No legal advice: the reply to the caller only offers the consult.'
    },
    {
      id: 'intake-morales',
      requires: 'litigation',
      channel: 'call',
      from: 'Call summary: Daniel Morales',
      receivedAt: '7:50 AM',
      subject: 'New matter: landlord kept security deposit',
      body: 'Caller says his former landlord, Oakview Rentals LLC (sample), kept his full $2,400 deposit with no itemized list. Moved out Sep 30. Wants to know his options.',
      steps: [
        { system: '{core}', text: 'Created a prospective client record for Daniel Morales.' },
        { system: '{core}', text: 'Ran a name search for Oakview Rentals LLC. No match in current or past matters.' },
        { system: '{docs}', text: 'Wrote the intake summary from the call notes.' },
        { system: '{calendar}', text: 'Found two consult openings: Thursday 10 AM, Friday 2 PM.' }
      ],
      draft: {
        kind: 'Intake summary and conflict check',
        to: '{approver}',
        fields: [['Matter', 'Security deposit, landlord-tenant'], ['Adverse party', 'Oakview Rentals LLC'], ['Conflict search', 'No match found'], ['Consult', 'Thu 10 AM or Fri 2 PM']],
        body: 'Prospective client says landlord kept full $2,400 deposit after a Sep 30 move-out with no itemized list. Please confirm the conflict check and pick a consult time.'
      },
      risk: 'No legal advice: the reply to the caller only offers the consult.'
    },
    {
      id: 'probate-deadlines',
      requires: 'estate',
      channel: 'email',
      from: 'Surrogate court notice (sample)',
      receivedAt: '8:15 AM',
      subject: 'Letters issued: Estate of Margaret Wynn, Docket SAM-P-0219-26',
      body: 'Will admitted to probate Nov 20, 2026. Letters testamentary issued to Paul Wynn as executor. Date of death Sep 14, 2026.',
      steps: [
        { system: '{core}', text: 'Matched docket SAM-P-0219-26 to matter M-2026-127, Estate of Margaret Wynn.' },
        { system: '{docs}', text: 'Saved the letters and probate notice to the matter folder.' },
        { system: '{calendar}', text: 'Computed beneficiary notice due Jan 19, 2027, 60 days after probate.' },
        { system: '{calendar}', text: 'Computed tax return due May 14, 2027, 8 months after date of death.' },
        { system: '{calendar}', text: 'Prepared holds for both dates, plus a Jan 8 internal asset list.' }
      ],
      draft: {
        kind: 'Calendar hold',
        to: 'Matter team, Estate of Margaret Wynn',
        fields: [['Asset list', 'Jan 8'], ['Beneficiary notice', 'Jan 19, 2027'], ['Tax return', 'May 14, 2027']],
        body: 'Letters issued to Paul Wynn on Nov 20. Internal asset list due Jan 8. Beneficiary notice due Jan 19. Tax return due May 14.'
      },
      risk: 'Court deadline: the {approver} confirms every date against the rules before it goes on the calendar.'
    },
    {
      id: 'notice-hearing',
      requires: 'litigation',
      channel: 'email',
      from: 'Court e-filing notice (sample)',
      receivedAt: '8:15 AM',
      subject: 'Notice of motion: Harper v. Lyle, Docket SAM-L-0451-26',
      body: 'Defendant filed a motion to dismiss. Motion date Dec 19, 2026. Opposition due 10 days before the motion date.',
      steps: [
        { system: '{core}', text: 'Matched docket SAM-L-0451-26 to matter M-2026-118, Harper v. Lyle.' },
        { system: '{docs}', text: 'Saved the motion and notice to the matter folder.' },
        { system: '{calendar}', text: 'Computed opposition due Dec 9, 2026 from the notice terms.' },
        { system: '{calendar}', text: 'Prepared holds: Dec 9 deadline, Dec 2 internal draft, Dec 19 motion date.' }
      ],
      draft: {
        kind: 'Calendar hold',
        to: 'Matter team, Harper v. Lyle',
        fields: [['Internal draft', 'Dec 2'], ['Opposition due', 'Dec 9'], ['Motion date', 'Dec 19']],
        body: 'Motion to dismiss filed in Harper v. Lyle. Internal draft due Dec 2 for attorney edits. Opposition due Dec 9. Motion date Dec 19.'
      },
      risk: 'Court deadline: the {approver} confirms every date against the court rules before it goes on the calendar.'
    },
    {
      id: 'discovery-served',
      requires: 'litigation',
      channel: 'email',
      from: 'Opposing counsel (sample)',
      receivedAt: '8:40 AM',
      subject: 'Harper v. Lyle: first interrogatories and document requests',
      body: 'Attached are defendant\'s first set of interrogatories (25 questions) and document requests (12 items). Responses due Jan 25, 2027.',
      steps: [
        { system: '{core}', text: 'Matched to matter M-2026-118, Harper v. Lyle.' },
        { system: '{docs}', text: 'Saved both sets and split the 12 document requests into a client checklist.' },
        { system: '{calendar}', text: 'Prepared holds: Jan 25 responses due, Jan 11 internal draft, Jan 4 client documents.' },
        { system: '{docs}', text: 'Drafted a letter asking the client for the documents.' }
      ],
      draft: {
        kind: 'Client letter',
        to: 'Claire Harper',
        fields: [['Requests', '12 document items'], ['Client deadline', 'Jan 4'], ['Responses due', 'Jan 25']],
        body: 'Dear Claire, the other side has sent written questions and a request for documents. Please gather the items on the enclosed checklist, such as your lease, emails with Mr. Lyle and repair receipts, and send them to us by Jan 4. We will go over the questions with you before anything is answered. The {company} team'
      },
      risk: 'Litigation: the {approver} approves the letter, and the agent never drafts the answers themselves.'
    },
    {
      id: 'will-bennett',
      requires: 'estate',
      channel: 'form',
      from: 'Estate planning questionnaire: Susan Bennett',
      receivedAt: '8:55 AM',
      subject: 'Simple will with guardian designation',
      body: 'Client completed the questionnaire. Married, two minor children. Wants everything to spouse, then children equally. Names her sister as guardian.',
      steps: [
        { system: '{core}', text: 'Found matter M-2026-131, engagement letter signed.' },
        { system: '{docs}', text: 'Opened the firm simple-will template.' },
        { system: '{docs}', text: 'Filled names, beneficiaries, guardian and executor from the questionnaire.' },
        { system: '{docs}', text: 'Flagged one gap: no alternate executor named.' }
      ],
      draft: {
        kind: 'Document draft',
        to: '{approver}',
        fields: [['Document', 'Last will and testament'], ['Matter', 'M-2026-131'], ['Open question', 'Alternate executor']],
        body: 'Draft will built from the firm template. Spouse is primary beneficiary, then children equally. Sister named as guardian. Questionnaire names no alternate executor; please raise this at the signing meeting.'
      },
      risk: 'Legal document: the {approver} edits and approves it before the client sees it.'
    },
    {
      id: 'billing-november',
      channel: 'system',
      from: 'Billing system',
      receivedAt: '9:35 AM',
      subject: 'November statement ready: Harper matter',
      body: 'Unbilled time and costs for matter M-2026-118, client Claire Harper, through Nov 24.',
      steps: [
        { system: '{billing}', text: 'Pulled 14.2 hours and $186.00 in court filing costs.' },
        { system: '{billing}', text: 'Checked entries against the engagement rate. One entry has no description.' },
        { system: '{core}', text: 'Found retainer balance: $1,500.00.' },
        { system: '{billing}', text: 'Built the client statement, retainer applied.' }
      ],
      draft: {
        kind: 'Billing statement',
        to: 'Claire Harper',
        fields: [['Fees', '$4,260.00'], ['Costs', '$186.00'], ['Retainer applied', '-$1,500.00'], ['Balance due', '$2,946.00']],
        body: 'Statement for matter M-2026-118 through Nov 24: fees $4,260.00, costs $186.00, less retainer $1,500.00. Balance due $2,946.00 within 30 days. The {company} team'
      },
      risk: 'Money: the {approver} approves every statement. Before it goes out, add a description to the Nov 12 entry (0.4 h).'
    }
  ]
};
