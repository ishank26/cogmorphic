export default {
  id: 'property',
  agent: 'Work-order agent',
  promise: 'Reads tenant and vendor messages, files the work and drafts every reply. The {approver} approves each one.',
  defaults: {
    approver: 'property manager',
    systems: {
      core: 'Property system',
      accounting: 'Accounting system',
      docs: 'Document storage',
      sensors: 'Leak sensor portal'
    }
  },
  quickWins: [
    {
      requires: 'sensor',
      job: 'Leak alerts and repair requests into work orders and tenant replies',
      unit: 'request',
      units: 'requests',
      pasteLabel: 'Paste a leak alert or a tenant repair request',
      pasteHint: 'Alert email, tenant email, text or voicemail note. Remove tenant last names, phone numbers and building addresses first.',
      task: 'Turn the message into a work order and a short reply to the tenant that confirms it and asks only for missing facts.',
      rules: [
        'Never promise a repair time, a vendor, a rent credit or a reimbursement.',
        'Treat a wet leak sensor reading as Urgent until a person has checked it.',
        'Mark gas, smoke, fire, carbon monoxide, active flooding, sparks, no heat or no water as Emergency; for gas, smoke, fire or carbon monoxide the reply tells the tenant to leave and call 911.',
        'Do not discuss fault, insurance, lease terms or legal notices.'
      ],
      draftKind: 'Work order',
      fields: ['Priority', 'Unit', 'Issue', 'Access', 'Next step'],
      replyTo: 'tenant',
      example: 'Leak alert: sensor LS-07B-01, location Unit 7B, kitchen sink cabinet. Water detected at 6:12 AM and again at 6:15 AM. Status: still wet.',
      exampleDraft: {
        fields: {
          Priority: 'Urgent: sensor read wet twice, not yet checked by a person',
          Unit: '7B',
          Issue: 'Water detected under the kitchen sink at 6:12 AM and 6:15 AM, still wet',
          Access: 'Not stated',
          'Next step': 'Call the tenant to check under the sink; send a plumber if water is confirmed'
        },
        reply: 'Hello, our leak sensor under the kitchen sink in Unit 7B detected water. If it is safe, please look under the sink and reply or call us with what you see. If water is spreading and you can reach the shut-off valve under the sink, please close it and call our office right away. Please also tell us when someone can be home so a plumber can check it. The {company} team'
      },
      measure: 'minutes per request and time from tenant message to first reply',
      next: ['Vendor scheduling and tenant follow-up', 'Vendor invoices matched to work orders', 'Move-out deposit letters for review']
    },
    {
      job: 'Maintenance requests into work orders and tenant replies',
      unit: 'request',
      units: 'requests',
      pasteLabel: 'Paste a tenant maintenance request',
      pasteHint: 'Email, portal note, text or voicemail transcript. Remove tenant last names, phone numbers and building addresses first.',
      task: 'Turn the message into a work order and a short reply to the tenant that confirms it and asks only for missing facts.',
      rules: [
        'Never promise a repair time, a vendor, a rent credit or a reimbursement.',
        'Mark gas, smoke, fire, carbon monoxide, active flooding, sparks, no heat or no water as Emergency; for gas, smoke, fire or carbon monoxide the reply tells the tenant to leave and call 911.',
        'Ask for the building, access times, pets or photos only when the message does not give them.',
        'Do not discuss fault, insurance, lease terms or legal notices.'
      ],
      draftKind: 'Work order',
      fields: ['Priority', 'Unit', 'Issue', 'Access', 'Next step'],
      replyTo: 'tenant',
      example: 'Hi, this is Priya in 12C. The brown stain on my bathroom ceiling got bigger since Sunday and now it drips when the upstairs shower runs. I work days but my roommate is home Tuesdays and Thursdays. We have a cat.',
      exampleDraft: {
        fields: {
          Priority: 'Urgent: active drip, likely from the unit above',
          Unit: '12C; building not stated',
          Issue: 'Bathroom ceiling stain growing since Sunday; drips when the upstairs shower runs',
          Access: 'Roommate home Tuesdays and Thursdays; cat in the unit',
          'Next step': 'Confirm the building; plumber to check the 12C ceiling and the shower in the unit above'
        },
        reply: 'Hi Priya, thank you for letting us know about the bathroom ceiling in 12C. We have logged it as an urgent repair, and a plumber will likely need to check the unit above as well. Please reply with your building address so we send the team to the right place. We have noted that your roommate is home Tuesdays and Thursdays and that you have a cat. If the drip turns into a steady flow, call our office right away. The {company} team'
      },
      measure: 'minutes per request and time from tenant message to first reply',
      next: ['Vendor scheduling and tenant follow-up', 'Vendor invoices matched to work orders', 'Move-out deposit letters for review']
    }
  ],
  items: [
    {
      id: 'leak-3a',
      requires: 'sensor',
      channel: 'sensor',
      from: 'Leak sensor, Unit 3A utility closet',
      receivedAt: '7:31 AM',
      subject: 'Water detected near water heater',
      body: 'Sensor LS-3A-02 reported water on the floor at 7:29 AM and again at 7:31 AM. Reading stays wet.',
      steps: [
        { system: '{sensors}', text: 'Confirmed two wet readings in 2 minutes. Not a single false trip.' },
        { system: '{core}', text: 'Found Unit 3A. Tenant Sam Patel, lease active, water heater installed 2015.' },
        { system: '{core}', text: 'Opened urgent ticket WO-24818 and linked the sensor readings.' },
        { system: '{core}', text: 'Picked the on-call plumber for this building: Brightline Plumbing (sample).' }
      ],
      draft: {
        kind: 'Work order',
        to: 'Brightline Plumbing (sample vendor)',
        fields: [['Priority', 'Urgent'], ['Unit', '3A'], ['Ticket', 'WO-24818'], ['Access', 'Tenant notified, entry approved']],
        body: 'Leak sensor shows standing water by the water heater in Unit 3A since 7:29 AM. Please shut off the supply, find the source and call us with a repair estimate before any work over $300.'
      },
      risk: 'Spends money: repairs over $300 need the {approver} to sign off.'
    },
    {
      id: 'sink-4b',
      channel: 'email',
      from: 'Dana Ortiz, Unit 4B',
      receivedAt: '7:42 AM',
      subject: 'Water under the kitchen sink',
      body: 'Hi, there is a small puddle under my kitchen sink this morning. It looks like it drips from the pipe. I am home after 1 PM if someone can come.',
      steps: [
        { system: '{core}', text: 'Found Unit 4B. Lease active, no open work orders.' },
        { system: '{core}', text: 'Checked vendor list. Brightline Plumbing (sample) has an opening today 1 to 3 PM.' },
        { system: '{core}', text: 'Created work order WO-24817 with the tenant access window.' },
        { system: '{docs}', text: 'Pulled the tenant reply template for routine repairs.' }
      ],
      draft: {
        kind: 'Work order and tenant reply',
        to: 'Brightline Plumbing (sample vendor) and Dana Ortiz',
        fields: [['Priority', 'Same day'], ['Unit', '4B'], ['Window', '1 to 3 PM today']],
        body: 'Vendor: Slow drip under kitchen sink, Unit 4B. Tenant home after 1 PM.\n\nTenant: Hi Dana, thanks for the heads-up. A plumber from Brightline will stop by between 1 and 3 PM today. Please place a towel under the pipe until then. The {company} team'
      }
    },
    {
      id: 'invoice-5521',
      channel: 'email',
      from: 'Brightline Plumbing (sample vendor)',
      receivedAt: '8:05 AM',
      subject: 'Invoice INV-5521 for Unit 6C',
      body: 'Attached is invoice INV-5521 for $385.00 for the bathroom faucet replacement in Unit 6C, completed Monday.',
      steps: [
        { system: '{accounting}', text: 'Logged invoice INV-5521 for $385.00. No duplicate found.' },
        { system: '{core}', text: 'Matched to work order WO-24790, Unit 6C, marked complete Monday.' },
        { system: '{core}', text: 'Compared to the $350.00 estimate. Invoice is $35.00 over for an extra supply line.' },
        { system: '{accounting}', text: 'Prepared the bill for payment, held for approval.' }
      ],
      draft: {
        kind: 'Invoice approval',
        to: 'Accounts payable',
        fields: [['Amount', '$385.00'], ['Work order', 'WO-24790'], ['Estimate', '$350.00'], ['Variance', '+$35.00, extra supply line']],
        body: 'Invoice INV-5521 matches work order WO-24790. The vendor added one supply line ($35.00) beyond the estimate. Recommend paying in full and charging to the Unit 6C repair budget.'
      },
      risk: 'Spends money: the {approver} approves before payment.'
    },
    {
      id: 'moveout-2c',
      channel: 'form',
      from: 'Move-out inspection form, Unit 2C',
      receivedAt: '8:40 AM',
      subject: 'Move-out inspection complete',
      body: 'Inspector notes: carpet stained in bedroom, two bent blinds in living room, three nail holes and scuffs in hallway. Keys returned.',
      steps: [
        { system: '{docs}', text: 'Pulled move-in checklist and photos. Carpet and blinds were clean and intact at move-in.' },
        { system: '{core}', text: 'Found lease for former tenant Marcus Lee. Deposit on file: $1,800.00.' },
        { system: '{accounting}', text: 'Pulled interest earned on the deposit account: $21.60.' },
        { system: '{accounting}', text: 'Applied standard charges: carpet cleaning, blinds, wall patch and paint.' },
        { system: '{docs}', text: 'Drafted the itemized deduction letter from the firm template.' }
      ],
      draft: {
        kind: 'Letter',
        to: 'Marcus Lee, former tenant, Unit 2C',
        fields: [['Deposit', '$1,800.00'], ['Interest', '$21.60'], ['Deductions', '$430.00'], ['Refund', '$1,391.60']],
        body: 'Dear Marcus, thank you for returning your keys. Your deposit of $1,800.00 earned $21.60 in interest. We deducted: carpet cleaning $150.00, two blinds $60.00, wall patch and paint $220.00. Your refund of $1,391.60 will be mailed to your forwarding address. The {company} team'
      },
      risk: 'Money and legal: deposit letters carry deadlines and interest rules. The {approver} confirms each charge.'
    },
    {
      id: 'late-5d',
      channel: 'system',
      from: 'Rent roll',
      receivedAt: '9:15 AM',
      subject: 'Unit 5D rent 10 days late',
      body: 'November rent of $1,650.00 for Unit 5D is unpaid. No payment plan on file.',
      steps: [
        { system: '{core}', text: 'Ledger shows $1,650.00 due Nov 1 plus a $50.00 late fee per the lease.' },
        { system: '{core}', text: 'No payment plan and no earlier late payments on this lease.' },
        { system: '{docs}', text: 'Pulled the first late-notice template.' },
        { system: '{core}', text: 'Set a follow-up reminder for Dec 2.' }
      ],
      draft: {
        kind: 'Letter',
        to: 'Jordan Blake, Unit 5D',
        fields: [['Rent due', '$1,650.00'], ['Late fee', '$50.00'], ['Total', '$1,700.00']],
        body: 'Dear Jordan, our records show November rent is unpaid. The balance is $1,700.00, including the $50.00 late fee in your lease. If you have already paid, please disregard this note. If you need to set up a payment plan, reply and we will work with you. The {company} team'
      },
      risk: 'Legal notice: the {approver} confirms the amounts before it goes to the tenant.'
    }
  ]
};
