# Logistics and trucking quick win: deployment brief

Leads: 3 trucking and warehouse firms (Direct Impact, Trans-American, JVN) and 2 freight forwarders (Mill-Wright, LMD). Trucking and forwarding get different jobs.

1. **Buyer:** the owner, or an operations manager who also dispatches. Cares most about (a) keeping trucks loaded and never missing a pickup, appointment or last free day, since one mistake costs a day of a truck or storage charges, and (b) a desk that answers shippers fast without adding a hire. Forwarders add a third: staying inside customs and export rules.

2. **The quick win:**
   - Trucking: load tenders, rate confirmations and delivery orders become a dispatch-ready load sheet, plus a reply that confirms receipt and asks for anything missing. They arrive all day by email, the dispatcher retypes every field, and a mistyped appointment or reference number is how loads go wrong. The agent never accepts or signs anything.
   - Forwarder: customer quote and booking inquiries become a quote-ready shipment sheet, plus a reply that asks, in one email, for everything still missing. Most inquiries lack dimensions, terms of sale or pickup address, and the back-and-forth delays the quote.
   Rejected: (a) "where is my load" status replies. The pain owners feel most, but the answer is not in the message. It needs the tracking or TMS data, so it is week three, not week one. (b) Proof-of-delivery chase for billing. Outbound and document-heavy; it is the first expand for trucking.

3. **Today:** the dispatcher opens the tender email or PDF, reads it, retypes pickup and delivery names, addresses, windows, reference, PO and container numbers, commodity, weight and equipment into the TMS or the board, spots what is missing, and emails the shipper or broker. At a forwarder a CSR reads the inquiry, starts a shipment, then writes one or more emails to get dimensions, Incoterms, value and pickup details before ops can request rates. Time goes to retyping, hunting for missing details, and waiting on replies.

4. **Deploy in week one:**
   - Sources: the dispatch@ or ops@ shared inbox (tenders, rate cons, delivery orders) or the quotes@ inbox (forwarder inquiries). Load-board and EDI tenders stay as they are.
   - Access: a server-side forwarding rule in Microsoft 365 or Google Workspace copies matching mail to a dedicated pilot mailbox. The original stays in the shared inbox, so the desk loses nothing if the agent stops. PDFs: the agent reads text PDFs; scanned ones get flagged "could not read" rather than guessed.
   - Output: a draft card emailed to the approver within a minute: sheet fields on top in a copy-ready layout, reply below. The pilot mailbox may send only to internal addresses, enforced by a mail rule.
   - Approve: the approver checks the sheet against the PDF, keys it into the TMS (Magaya at Mill-Wright) or the board, and sends the reply from their own mailbox. Then tags the card Used, Edited or Wrong.
   - Not touched: TMS, dispatch board, terminal portals, ELDs, rate confirmations (no signing), billing, filings.
   - Day 1: kickoff, pick the inbox, collect 20 to 30 recent tenders or inquiries, write house rules (lanes, equipment, sign-off, what always needs a flag). Day 2: mailbox and rules, back-test, dispatcher grades. Day 3: shadow mode. Days 4 and 5: the desk works from drafts. Daily 15-minute check-in.
   - Privacy: shipper and consignee names, rates and lanes are commercial secrets. Business API terms that do not train on inputs. Pilot mailbox deleted at the end unless they keep it.
   - Bad draft: ignored, worked from the original, tagged Wrong, rule fixed the same day.

5. **Proof moment:** the owner pastes today's real rate confirmation or delivery order (text copied from the PDF). A great draft copies every number exactly, turns a dense page into five lines, and catches the thing a tired dispatcher misses: no delivery appointment, a TWIC or hazmat requirement, a weight near the legal limit, a tight last free day. For a forwarder: paste a vague inquiry and watch it list exactly what is missing to quote, in one email.

6. **Risks and guardrails:** never accept a load, sign a rate confirmation, agree a rate or promise a time. Copy numbers exactly; when unsure, write "Not stated". Forwarders: never pick a tariff or Schedule B code, judge whether a license or filing is needed, or advise on duties; that is for licensed staff. Flag dangerous goods and batteries. No rates in replies.

7. **Pilot:** two weeks, one job. Before: the dispatcher times 10 loads from email open to keyed in, and counts keying errors found later; forwarders count emails sent before a quote goes out, from mailbox history. During: the same timing and counts on drafted loads, plus Used, Edited, Wrong. Success in their words: "I check the sheet instead of typing it" and "We ask once, then quote."

8. **Land and expand:**
   - Trucking: Delivery paperwork chase so invoices go out. Customer status replies from your tracking. Detention and accessorial backup for billing.
   - Forwarder: Arrival notices into client updates and deadlines. Shipment status replies from carrier updates. Export document checklists for licensed staff.

9. **Variants:** `forwarder` (Mill-Wright, LMD) gets the inquiry variant, listed first. Direct Impact, Trans-American and JVN get the load sheet variant, which has no `requires` and serves as the fallback.

10. **Draft quickWins entry:**
```js
quickWins: [
  {
    requires: 'forwarder',
    job: 'Shipping inquiries into quote-ready shipment sheets and replies',
    unit: 'inquiry', units: 'inquiries',
    pasteLabel: 'Paste a customer quote request or booking email',
    pasteHint: 'Remove rates and anything private first.',
    task: 'Turn the inquiry into a shipment sheet the team can quote from and a reply asking only for what is missing.',
    rules: [
      'Never quote a rate, transit time or sailing date.',
      'Never pick a tariff or Schedule B code, or say whether a license, permit or filing is needed. Write "For licensed staff" instead.',
      'Flag dangerous goods, batteries, used items and any unusual destination for the {approver}.',
      'Ask for the missing items as one short numbered list, in the order the team needs them to quote.'
    ],
    draftKind: 'Shipment sheet',
    fields: ['Mode and route', 'Cargo', 'Ready date', 'Terms', 'Missing to quote'],
    replyTo: 'customer',
    example: 'Hi, we need to send 3 crates of printing press spare parts from our plant in New Jersey to a customer in Valencia, Spain. Ready around Dec 10. Roughly 1,200 kg total. Can you quote ocean and air? Thanks, Owen Patel, Ridgefield Graphics Supply (sample)',
    exampleDraft: {
      fields: {
        'Mode and route': 'Ocean and air options, New Jersey to Valencia, Spain',
        Cargo: '3 crates, printing press spare parts, about 1,200 kg total',
        'Ready date': 'Around Dec 10',
        Terms: 'Not stated',
        'Missing to quote': 'Crate dimensions, pickup address, terms of sale, cargo value, batteries or chemicals'
      },
      reply: 'Hi Owen, thanks for the request. We can quote both ocean and air to Valencia. To price it, please send: 1) dimensions of each crate, 2) the pickup address, 3) the terms of sale with your customer, for example FCA or DAP, 4) the cargo value. Also tell us if any part contains batteries or chemicals. The {company} team'
    },
    measure: 'minutes per inquiry and emails needed before a quote goes out',
    next: [
      'Arrival notices into client updates and deadlines',
      'Shipment status replies from carrier updates',
      'Export document checklists for licensed staff'
    ]
  },
  {
    job: 'Load tenders and rate confirmations into dispatch-ready load sheets',
    unit: 'load', units: 'loads',
    pasteLabel: 'Paste a load tender, rate confirmation or delivery order',
    pasteHint: 'Copy the text out of the PDF. Remove rates and anything private first.',
    task: 'Turn the tender into a load sheet for the {approver} and a short reply that confirms receipt and asks for anything missing.',
    rules: [
      'Never accept the load, sign the confirmation or agree to a rate. Only the {approver} does that.',
      'Copy reference, PO, pickup and container numbers exactly as written.',
      'In Check before accepting, flag a missing appointment or reference number and any hazmat, overweight, team, TWIC, temperature or liftgate need.',
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
      'Delivery paperwork chase so invoices go out',
      'Customer status replies from your tracking',
      'Detention and accessorial backup for billing'
    ]
  }
]
```
