// The export item (requires 'forwarder') fits freight forwarders and customs-focused firms, not plain trucking.
export default {
  id: 'logistics',
  agent: 'Dispatch desk agent',
  promise: 'Reads carrier, terminal and customer updates, keeps shipments current and drafts every message. The {approver} approves each one.',
  defaults: {
    approver: 'dispatch manager',
    systems: {
      core: 'Transportation management system',
      terminal: 'Terminal portal',
      board: 'Dispatch board',
      docs: 'Document storage'
    }
  },
  quickWins: [
    {
      requires: 'forwarder',
      job: 'Carrier and terminal notices into client status emails and deadlines',
      unit: 'notice',
      units: 'notices',
      pasteLabel: 'Paste a carrier arrival notice, booking confirmation or terminal update',
      pasteHint: 'Copy the text out of the PDF. Remove client names, rates and anything private first.',
      task: 'Turn the notice into a shipment status summary for the {approver} and a short status email to the client that says what happened and what is needed next.',
      rules: [
        'Copy container, booking and bill of lading numbers and every date exactly as written.',
        'Never say cargo is released, cleared or available unless the notice says so, and never estimate a date the notice does not give.',
        'Flag the last free day, any cutoff and any customs, freight or USDA hold for the {approver}. Never advise on duties, codes or filings.',
        'Never quote or estimate charges. Mention storage or demurrage only as the notice states it.'
      ],
      draftKind: 'Shipment status',
      fields: ['Shipment', 'Status', 'Key dates', 'Holds and charges', 'Action needed'],
      replyTo: 'client',
      example: 'Arrival notice, Northstar Line (sample). B/L NSL7741203, container NSLU4821156, 40 ft high cube, 18 pallets of press parts for Owen Patel, Ridgefield Graphics Supply. Discharged at Port Newark Dec 1. Freight released. Customs: hold, exam ordered. Last free day Dec 5; storage after that per terminal tariff.',
      exampleDraft: {
        fields: {
          Shipment: 'B/L NSL7741203, container NSLU4821156, 40 ft HC, 18 pallets press parts, Ridgefield Graphics Supply',
          Status: 'Discharged at Port Newark Dec 1. Freight released. Not available yet: customs exam ordered',
          'Key dates': 'Last free day Dec 5',
          'Holds and charges': 'Customs hold, exam ordered. Storage after Dec 5 per terminal tariff; amount not stated',
          'Action needed': 'Broker to follow the exam. Book pickup only after release. Client told about Dec 5'
        },
        reply: 'Hi Owen, your container NSLU4821156 (B/L NSL7741203) was discharged at Port Newark on Dec 1. Freight charges are released, but customs has ordered an exam, so the container cannot be picked up yet. The last free day at the terminal is Dec 5, and storage charges may apply after that. We are following the exam and will update you when its status changes. The {company} team'
      },
      measure: 'minutes per status email and notices passed to the client the same day',
      next: [
        'Quote inquiries into quote-ready shipment sheets',
        'Export document checklists for licensed staff',
        'Container pickup appointment requests'
      ]
    },
    {
      job: 'Load tenders and rate confirmations into dispatch-ready load sheets',
      unit: 'load',
      units: 'loads',
      pasteLabel: 'Paste a load tender, rate confirmation or delivery order',
      pasteHint: 'Copy the text out of the PDF. Remove customer and driver names, rates and driver phone numbers first.',
      task: 'Turn the tender into a load sheet for the {approver} and a short reply that confirms receipt and asks for anything missing.',
      rules: [
        'Never accept the load, sign the confirmation or agree to a rate. Only the {approver} does that.',
        'Copy reference, PO, pickup and container numbers exactly as written.',
        'In Check before accepting, flag a missing appointment or reference number, any hazmat, overweight, team, TWIC, temperature or liftgate need, and any fine, detention or lumper term.',
        'Never promise a pickup or delivery time beyond what the tender states.'
      ],
      draftKind: 'Load sheet',
      fields: ['Reference', 'Pickup', 'Delivery', 'Freight and equipment', 'Check before accepting'],
      replyTo: 'customer',
      example: 'Load tender from Carla Nunez, Harborline Logistics (sample). Load HL-40718, pickup number 55821. Pick up at Meadowbrook Paper, 400 Industrial Rd, Dock 3, Thu Dec 3, 7 to 11 AM. Deliver to Brightway Foods DC, 18 Commerce Pkwy, Fri Dec 4, appointment to follow. 22 pallets of paper goods, 38,500 lb, 53 ft dry van. Please confirm by 3 PM today.',
      exampleDraft: {
        fields: {
          Reference: 'Load HL-40718, pickup number 55821',
          Pickup: 'Meadowbrook Paper, 400 Industrial Rd, Dock 3, Thu Dec 3, 7 to 11 AM',
          Delivery: 'Brightway Foods DC, 18 Commerce Pkwy, Fri Dec 4, appointment not set',
          'Freight and equipment': '22 pallets paper goods, 38,500 lb, 53 ft dry van',
          'Check before accepting': 'No delivery appointment yet. Confirm who books it. Reply due 3 PM today'
        },
        reply: 'Hi Carla, thanks for the tender on load HL-40718. We received it and are reviewing it now. Before we confirm, can you send the delivery appointment time at Brightway Foods, or let us know if we should book it? Dispatch at {company}'
      },
      measure: 'minutes per load and keying errors caught before dispatch',
      next: [
        'Customer status emails from driver updates',
        'Delivery paperwork chase so invoices go out',
        'Detention and accessorial backup for billing'
      ]
    }
  ],
  items: [
    {
      id: 'status-northside',
      channel: 'email',
      from: 'Erin Walsh, Northside Distributors (sample)',
      receivedAt: '7:38 AM',
      subject: 'Where is PO 88213?',
      body: 'Hi, can you tell me when PO 88213 will arrive at our warehouse? Our customer is asking.',
      steps: [
        { system: '{core}', text: 'Matched PO 88213 to shipment SH-55102, container SMPU 123456 7.' },
        { system: '{terminal}', text: 'Terminal shows the container discharged Nov 24, released, available for pickup.' },
        { system: '{board}', text: 'Pickup planned Nov 26 AM. Delivery planned Nov 26 PM.' }
      ],
      draft: {
        kind: 'Reply email',
        to: 'Erin Walsh',
        fields: [['PO', '88213'], ['Container', 'SMPU 123456 7'], ['Delivery', 'Nov 26, afternoon']],
        body: 'Hi Erin, PO 88213 is off the vessel and released. We pick it up tomorrow morning and plan to deliver to your warehouse tomorrow afternoon. We will send the driver ETA once loaded. The {company} team'
      }
    },
    {
      id: 'pickup-appt',
      channel: 'system',
      from: 'Terminal portal',
      receivedAt: '8:00 AM',
      subject: 'Container SMPU 123456 7 available',
      body: 'Container available at the terminal. Last free day Nov 28. Appointment required.',
      steps: [
        { system: '{terminal}', text: 'Found open appointment slots Nov 26: 6 to 7 AM and 8 to 9 AM.' },
        { system: '{board}', text: 'Driver Tony B. is free from 6 AM with a chassis.' },
        { system: '{core}', text: 'Prepared the 6 to 7 AM appointment request, unsubmitted.' }
      ],
      draft: {
        kind: 'Appointment request',
        to: 'Terminal (sample)',
        fields: [['Container', 'SMPU 123456 7'], ['Slot', 'Nov 26, 6 to 7 AM'], ['Driver', 'Tony B.'], ['Last free day', 'Nov 28']],
        body: 'Request pickup appointment for SMPU 123456 7 on Nov 26, 6 to 7 AM. Driver Tony B., own chassis.'
      },
      risk: 'Money: missing the last free day adds storage charges.'
    },
    {
      id: 'dispatch-change',
      channel: 'text',
      from: 'Shipper: Coastal Foods (sample)',
      receivedAt: '8:30 AM',
      subject: 'Load 7 moving to 2 PM',
      body: 'Our load 7 will not be ready until 2 PM today instead of 10 AM. Sorry for the change.',
      steps: [
        { system: '{board}', text: 'Load 7 was on driver Maria S. at 10 AM, then load 9 at 1 PM.' },
        { system: '{board}', text: 'Swapped order: Maria takes load 9 first at 10 AM, load 7 at 2 PM.' },
        { system: '{core}', text: 'Confirmed load 9 consignee can receive early.' },
        { system: '{board}', text: 'Checked hours of service. Maria stays inside her limit.' }
      ],
      draft: {
        kind: 'Dispatch plan',
        to: 'Driver Maria S.',
        fields: [['Stop 1', 'Load 9, 10 AM'], ['Stop 2', 'Load 7, 2 PM'], ['Hours', 'Within limit']],
        body: 'Maria, change to today: run load 9 first at 10 AM. Coastal Foods load 7 moved to 2 PM. Everything else stays the same. Reply OK to confirm.'
      }
    },
    {
      id: 'pod-chase',
      channel: 'system',
      from: 'Shipment tracker',
      receivedAt: '9:00 AM',
      subject: '3 deliveries missing proof of delivery',
      body: 'Three delivered loads from last week have no signed POD. Invoices cannot go out.',
      steps: [
        { system: '{core}', text: 'Found loads 4412, 4417 and 4420, delivered Nov 18 to Nov 20.' },
        { system: '{docs}', text: 'Searched driver uploads. No POD images for these loads.' },
        { system: '{board}', text: 'Matched drivers: Tony B. (2 loads) and Sam K. (1 load).' },
        { system: '{core}', text: 'Drafted a POD request to drivers and the consignee.' }
      ],
      draft: {
        kind: 'Paperwork chase',
        to: 'Drivers Tony B., Sam K. and Lakeview Market receiving (sample)',
        fields: [['Loads', '4412, 4417, 4420'], ['Holding', '3 invoices']],
        body: 'Hi all, we are missing signed delivery receipts for loads 4412, 4417 and 4420. Drivers: please upload a photo in the app today. Receiving: if you have the signed copy, please reply with a scan. Thank you. The {company} team'
      },
      risk: 'Money: invoices for these loads stay on hold until PODs arrive.'
    },
    {
      id: 'export-docs',
      requires: 'forwarder',
      channel: 'email',
      from: 'Paul Grant, Atlas Machine Parts (sample)',
      receivedAt: '9:40 AM',
      subject: 'Export shipment to Mexico next week',
      body: 'We have 2 pallets of pump parts going to a customer in Monterrey next Wednesday. What paperwork do you need from us?',
      steps: [
        { system: '{core}', text: 'Created shipment SH-55140 for Atlas Machine Parts.' },
        { system: '{docs}', text: 'Pulled the export document checklist template.' },
        { system: '{docs}', text: 'Marked items needed from the shipper: commercial invoice, packing list, product codes.' },
        { system: '{core}', text: 'Added a task for the licensed broker to handle the export filing.' }
      ],
      draft: {
        kind: 'Reply email',
        to: 'Paul Grant',
        fields: [['Shipment', 'SH-55140'], ['Pallets', '2'], ['Ship date', 'Next Wednesday']],
        body: 'Hi Paul, happy to help. Please send by Monday: 1) commercial invoice, 2) packing list with weights, 3) product codes for each part. Our licensed customs partner will handle the export filing. The {company} team'
      },
      risk: 'Legal filing: a licensed customs broker files export documents. The agent only prepares the checklist.'
    }
  ]
};
