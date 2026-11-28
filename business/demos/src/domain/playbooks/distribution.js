export default {
  id: 'distribution',
  agent: 'Order desk agent',
  promise: 'Answers order, stock, quote and delivery questions and drafts every customer reply. The {approver} approves each one.',
  defaults: {
    approver: 'customer service manager',
    systems: {
      core: 'ERP system',
      shipping: 'Carrier tracking',
      docs: 'Document storage'
    }
  },
  quickWins: [
    {
      job: 'Quote requests into clean quote lines and spec questions',
      unit: 'quote request',
      units: 'quote requests',
      pasteLabel: 'Paste a customer RFQ email or web quote form',
      pasteHint: 'Pick an RFQ with five lines or fewer. Remove customer names, customer pricing and anything private first.',
      task: 'Turn the request into clean quote lines for inside sales and a reply that confirms the specs and asks about anything unclear.',
      rules: [
        'Never give prices, stock levels or lead times. Inside sales adds them.',
        'Write each line as quantity, part type, diameter-thread x length, grade or material, and finish, separated by semicolons; past five lines, add "plus N more". List any line missing thread pitch, grade or finish under Specs to confirm.',
        'Never swap a grade, material, finish or head style, and never assume one. Ask the customer instead.',
        'Flag requests for certs, country of origin, DFARS or RoHS for the {approver}.'
      ],
      draftKind: 'Quote lines',
      fields: ['Customer', 'Lines', 'Specs to confirm', 'Needed by', 'Certs and terms'],
      replyTo: 'customer',
      example: 'Hi, please quote: 500 pcs 1/2 x 2 hex bolts grade 5 zinc, 500 matching nuts, 1000 flat washers 1/2, and 50 pcs 3/8 threaded rod 3 ft long. Need by Dec 10. Certs required on the bolts. Thanks, Gina Ferraro, Purchasing, Lakeside Pump Works (sample)',
      exampleDraft: {
        fields: {
          Customer: 'Gina Ferraro, Purchasing, Lakeside Pump Works',
          Lines: '500 hex bolt 1/2 x 2 Gr5 zinc; 500 hex nut 1/2; 1,000 flat washer 1/2; 50 threaded rod 3/8 x 36',
          'Specs to confirm': 'Thread pitch on all lines. Nut grade and finish. Washer type and finish. Rod material and finish',
          'Needed by': 'Dec 10',
          'Certs and terms': 'Certs required on the bolts'
        },
        reply: 'Hi Gina, thanks for the request. Before we quote, please confirm: 1) coarse thread on all parts (1/2-13 and 3/8-16), 2) grade 5 zinc nuts to match the bolts, 3) USS or SAE flat washers, and the finish, 4) material and finish for the threaded rod. We will note the bolt certs on the quote. The {company} team'
      },
      measure: 'minutes per quote request and quotes revised after a spec question',
      next: [
        'Customer POs into ready sales order lines',
        'Order status and tracking replies',
        'Backorder notices with options to approve'
      ]
    }
  ],
  items: [
    {
      id: 'status-po-7712',
      channel: 'email',
      from: 'Mike Ross, Sample Conveyor Co.',
      receivedAt: '7:45 AM',
      subject: 'Status of PO 7712?',
      body: 'Hi, checking on our PO 7712 for hex bolts and nuts. Our line needs them Thursday.',
      steps: [
        { system: '{core}', text: 'Found sales order SO-30418 for PO 7712: 4 lines, all picked.' },
        { system: '{core}', text: 'Shipped yesterday, 2 cartons, tracking on file.' },
        { system: '{shipping}', text: 'Carrier shows out for delivery Wednesday by end of day.' }
      ],
      draft: {
        kind: 'Reply email',
        to: 'Mike Ross',
        fields: [['PO', '7712'], ['Order', 'SO-30418'], ['Delivery', 'Wednesday']],
        body: 'Hi Mike, PO 7712 shipped yesterday in 2 cartons. The carrier shows delivery Wednesday by end of day, a day before your line needs it. Tracking is on your order page. The {company} team'
      }
    },
    {
      id: 'backorder-sub',
      channel: 'system',
      from: 'Stock alert',
      receivedAt: '8:20 AM',
      subject: 'Short on SO-30431: 3/8-16 x 2 in hex cap screw, zinc',
      body: 'Order needs 2,000 pcs. On hand: 600. Next supplier receipt Dec 12.',
      steps: [
        { system: '{core}', text: 'Found order SO-30431 for Sample Packaging Inc., due Dec 1.' },
        { system: '{core}', text: 'Found 2,000 pcs of the same size and grade in plain finish on hand.' },
        { system: '{docs}', text: 'Checked the customer file. No rule against finish substitutions, but none approved before.' },
        { system: '{core}', text: 'Held the order line and drafted two options for the customer.' }
      ],
      draft: {
        kind: 'Backorder notice',
        to: 'Purchasing, Sample Packaging Inc.',
        fields: [['Order', 'SO-30431'], ['Short', '1,400 pcs'], ['Option A', 'Ship 600 now, rest Dec 12'], ['Option B', 'Plain finish, all now']],
        body: 'Hello, we are short on the zinc 3/8-16 x 2 in hex cap screws for order SO-30431. Option A: ship 600 now and 1,400 on Dec 12. Option B: ship all 2,000 now in plain finish, same size and grade. Which works best for you? The {company} team'
      },
      risk: 'Substitution: the customer must approve any change to the part before it ships.'
    },
    {
      id: 'quote-request',
      channel: 'form',
      from: 'Website quote form: Sample Machine Works',
      receivedAt: '8:55 AM',
      subject: 'Quote: 5 line items',
      body: 'Request for pricing on flat washers, lock nuts, socket head cap screws, threaded rod and anchors. Quantities 100 to 5,000.',
      steps: [
        { system: '{core}', text: 'Matched all 5 items to stock part numbers.' },
        { system: '{core}', text: 'Priced at the customer\'s price level. 4 items in stock, 1 ships in 5 days.' },
        { system: '{docs}', text: 'Built quote Q-11872 from the quote template, good for 30 days.' }
      ],
      draft: {
        kind: 'Quote',
        to: 'Sample Machine Works',
        fields: [['Quote', 'Q-11872'], ['Lines', '5'], ['Total', '$1,486.20'], ['Valid', '30 days']],
        body: 'Thank you for the request. Quote Q-11872 covers all 5 items for $1,486.20. Four items ship from stock today; the threaded rod ships in 5 days. Prices are good for 30 days. The {company} team'
      },
      risk: 'Pricing: the {approver} checks prices before the quote goes out.'
    },
    {
      id: 'delivery-exception',
      channel: 'system',
      from: 'Carrier tracking',
      receivedAt: '9:30 AM',
      subject: 'Delivery exception: SO-30402',
      body: 'Carrier reports 1 of 3 cartons damaged in transit for Sample Fab Shop. Two cartons delivered.',
      steps: [
        { system: '{shipping}', text: 'Read the exception: carton 2 of 3 damaged, returned to terminal.' },
        { system: '{core}', text: 'Carton 2 held 500 lock nuts and 200 washers. Both in stock.' },
        { system: '{core}', text: 'Created replacement order SO-30440 at no charge, ready to ship today.' },
        { system: '{docs}', text: 'Started a damage claim form with the carrier, unsent.' }
      ],
      draft: {
        kind: 'Reply email',
        to: 'Receiving, Sample Fab Shop',
        fields: [['Order', 'SO-30402'], ['Missing', '1 carton'], ['Replacement', 'SO-30440, ships today']],
        body: 'Hello, the carrier damaged 1 of your 3 cartons on order SO-30402: 500 lock nuts and 200 washers. We are shipping a replacement today at no charge. You should see it tomorrow. The {company} team'
      },
      risk: 'Money: the {approver} approves the no-charge replacement and the carrier claim.'
    }
  ]
};
