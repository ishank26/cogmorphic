export default {
  id: 'accounting',
  agent: 'Bookkeeping agent',
  promise: 'Categorizes transactions, chases missing documents, tracks the close and drafts client notes. The {approver} approves each one.',
  defaults: {
    approver: 'engagement manager',
    systems: {
      core: 'Accounting system',
      bank: 'Bank feed',
      portal: 'Client portal',
      practice: 'Practice management system'
    }
  },
  items: [
    {
      id: 'bank-feed-greenleaf',
      channel: 'system',
      from: 'Bank feed',
      receivedAt: '7:35 AM',
      subject: '63 new transactions: Greenleaf Cafe (sample)',
      body: 'Overnight bank feed import for client Greenleaf Cafe, operating account ending 4410.',
      steps: [
        { system: '{bank}', text: 'Imported 63 transactions dated Nov 18 to Nov 24.' },
        { system: '{core}', text: 'Categorized 58 with high confidence from past rules.' },
        { system: '{core}', text: 'Flagged 5 low-confidence items, including a $1,240.00 transfer with no memo.' },
        { system: '{core}', text: 'Left all 63 unposted until approved.' }
      ],
      draft: {
        kind: 'Status update',
        to: '{approver}',
        fields: [['Imported', '63'], ['Categorized', '58'], ['Flagged', '5'], ['Largest flag', '$1,240.00 transfer']],
        body: 'Greenleaf Cafe feed ready. 58 transactions categorized. 5 need a look: one $1,240.00 transfer with no memo, two new vendors, two card refunds. Approve to post the 58 and send the 5 to the client portal for answers.'
      }
    },
    {
      id: 'missing-docs-kowalski',
      channel: 'system',
      from: 'Return tracker',
      receivedAt: '8:00 AM',
      subject: 'Amended return blocked: missing documents',
      body: 'Kowalski household amended 2024 return cannot move forward. Two documents still missing.',
      steps: [
        { system: '{practice}', text: 'Checked the document list: corrected brokerage 1099 and 2024 property tax bill missing.' },
        { system: '{portal}', text: 'Confirmed nothing uploaded since the Nov 3 request.' },
        { system: '{practice}', text: 'Found the client consent on file for portal requests.' },
        { system: '{portal}', text: 'Drafted a portal request with upload links for both items.' }
      ],
      draft: {
        kind: 'Document request',
        to: 'Anna and Piotr Kowalski (via portal)',
        fields: [['Missing', '2 documents'], ['Last request', 'Nov 3']],
        body: 'Hi Anna and Piotr, we are close to finishing your amended 2024 return. We still need two items: your corrected brokerage 1099 and your 2024 property tax bill. Please upload both to the portal using the links in this message. The {company} team'
      },
      risk: 'Tax data: requested and received only through the client portal, under the client consent on file.'
    },
    {
      id: 'close-harbor',
      channel: 'system',
      from: 'Close checklist',
      receivedAt: '8:40 AM',
      subject: 'October close: Harbor Supply Co. (sample)',
      body: 'Month-end close checklist for October is 8 of 11 steps done.',
      steps: [
        { system: '{core}', text: 'Confirmed bank and card accounts reconciled.' },
        { system: '{core}', text: 'Found open items: payroll accrual, prepaid insurance, sales tax.' },
        { system: '{core}', text: 'Prepared the sales tax liability entry for $3,118.42.' },
        { system: '{practice}', text: 'Updated the checklist and due date.' }
      ],
      draft: {
        kind: 'Checklist',
        to: '{approver}',
        fields: [['Done', '8 of 11'], ['Open', 'Payroll accrual, prepaid insurance, sales tax'], ['Due', 'Nov 28']],
        body: 'October close at 8 of 11. Sales tax entry of $3,118.42 is ready to post. Payroll accrual waits on the final payroll report. Prepaid insurance needs the new policy schedule from the client.'
      }
    },
    {
      id: 'collections-ridge',
      channel: 'system',
      from: 'Receivables',
      receivedAt: '9:10 AM',
      subject: 'Invoice 45 days past due: Ridge Auto Body (sample)',
      body: 'Firm invoice F-2209 for $1,850.00 is 45 days past due.',
      steps: [
        { system: '{core}', text: 'Found invoice F-2209, $1,850.00, issued Oct 10.' },
        { system: '{practice}', text: 'One reminder sent Oct 31. No reply logged.' },
        { system: '{core}', text: 'Checked for partial payments. None.' }
      ],
      draft: {
        kind: 'Payment reminder',
        to: 'Ridge Auto Body accounts payable',
        fields: [['Invoice', 'F-2209'], ['Amount', '$1,850.00'], ['Days past due', '45']],
        body: 'Hello, a friendly reminder that invoice F-2209 for $1,850.00 is now 45 days past due. You can pay by the link in your portal. If you have questions about the invoice, reply here and we will help. The {company} team'
      },
      risk: 'Money: the {approver} confirms the balance before the reminder goes out.'
    },
    {
      id: 'estimates-lin',
      channel: 'system',
      from: 'Tax calendar',
      receivedAt: '9:50 AM',
      subject: 'Q4 estimated tax due Jan 15: 12 clients',
      body: 'Twelve individual clients have a fourth-quarter estimated payment due Jan 15. Vouchers are in each 2025 tax package.',
      steps: [
        { system: '{practice}', text: 'Listed 12 clients with Q4 estimates from their 2025 packages.' },
        { system: '{practice}', text: 'Found 2 clients whose income changed this year: Lin and Ortega.' },
        { system: '{portal}', text: 'Checked client consent on file for portal reminders.' },
        { system: '{portal}', text: 'Drafted a reminder for Grace Lin with her voucher amount.' }
      ],
      draft: {
        kind: 'Reminder email',
        to: 'Grace Lin (via portal)',
        fields: [['Due', 'Jan 15'], ['Voucher', '$2,400.00'], ['Flag', 'Income changed this year']],
        body: 'Hi Grace, a reminder that your fourth-quarter estimated tax payment of $2,400.00 is due Jan 15. Your income changed this year, so let us know if you want us to recheck the amount before you pay. The {company} team'
      },
      risk: 'Tax data: sent only through the client portal, under the client consent on file.'
    }
  ],
  quickWins: [
    {
      job: 'Client document emails into tracker updates and follow-up requests',
      unit: 'email', units: 'emails',
      pasteLabel: 'Paste a client email about documents',
      pasteHint: 'Change or remove client names, and remove Social Security, EIN and bank account numbers first.',
      task: 'Turn the message into a document tracker update for the {approver} and a short reply that thanks the client and asks for anything still needed.',
      rules: [
        'Never say whether anything is taxable or deductible, or what the client will owe or get back.',
        'Never repeat or ask for a Social Security, EIN or bank account number. If the client sent one, add "Sensitive data sent by email" under Questions for preparer.',
        'Ask the client to send documents through the firm\'s secure portal, not by email.',
        'Separate documents the client says are coming later from documents still needed.'
      ],
      draftKind: 'Document tracker update',
      fields: ['Client', 'Tax year', 'Received', 'Still needed', 'Questions for preparer'],
      replyTo: 'client',
      example: 'Hi, attached are our W-2s and the 1099-INT from Lakemont Savings for our 2026 return. I still have not gotten the K-1 from my brother\'s restaurant partnership, they said March. We also sold our rental condo in August, not sure what you need for that. Thanks, Greg Sato',
      exampleDraft: {
        fields: {
          Client: 'Greg Sato',
          'Tax year': '2026',
          Received: 'W-2s, 1099-INT from Lakemont Savings',
          'Still needed': 'Partnership K-1 (client expects March). Closing statement for the condo sale.',
          'Questions for preparer': 'Rental condo sold in August 2026: decide what other records are needed.'
        },
        reply: 'Hi Greg, thank you. We received your W-2s and the 1099-INT from Lakemont Savings. We will watch for the K-1 in March. For the condo sale, please send the closing statement, and your preparer will let you know if anything else is needed. Please upload documents through our secure client portal rather than email, so your information stays protected. The {company} team'
      },
      measure: 'time spent logging client documents and writing follow-ups, and follow-ups needed per client',
      next: ['Bank-feed categorization for review in the ledger', 'IRS and state notice intake with deadline tracking', 'Past-due invoice reminders for the billing team']
    }
  ]
};
