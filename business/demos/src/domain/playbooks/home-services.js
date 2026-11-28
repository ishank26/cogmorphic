// Items with requires 'hvac' fit heating, cooling, plumbing and electrical shops.
// Items with requires 'exterior' fit roofing, siding, gutters, irrigation, lighting and paving.
// Exterior items use {trade} from the lead (for example 'roof' or 'irrigation system').
// The sensor item is an HVAC rooftop unit alert: give 'sensor' only to hvac leads.
export default {
  id: 'home-services',
  agent: 'Dispatch agent',
  promise: 'Turns calls, web forms and alerts into booked jobs, keeps the day on track and drafts every customer message. The {approver} approves each one.',
  defaults: {
    approver: 'office manager',
    systems: {
      core: 'Field service system',
      board: 'Dispatch board',
      accounting: 'Accounting system',
      texting: 'Customer texting',
      monitor: 'Equipment monitoring',
      weather: 'Weather service'
    }
  },
  quickWins: [
    {
      requires: 'hvac',
      job: 'After-hours and web service requests into call tickets and replies',
      unit: 'request',
      units: 'requests',
      pasteLabel: 'Paste an answering service message, voicemail note or web form',
      pasteHint: 'Change or remove names, addresses, phone numbers, card numbers and door or alarm codes first.',
      task: 'Turn the request into a service call ticket for the {approver} and a short reply to the customer.',
      rules: [
        'If the message mentions a gas smell, a carbon monoxide alarm, sparks or a burning smell, set Priority to "Safety: call now" and tell the customer to leave the house and call 911 or the gas utility from outside.',
        'Rank no heat, no cooling in a heat wave, no water and active leaks above routine work, and note anyone vulnerable at home.',
        'Never diagnose the problem, quote a price or promise an arrival time.',
        'Ask for an address or callback number only if the message lacks it.'
      ],
      draftKind: 'Service call ticket',
      fields: ['Priority', 'Customer', 'Problem', 'Equipment', 'Availability'],
      replyTo: 'customer',
      example: 'Answering service, 11:48 PM. Caller Marcus Bell, 112 Linden Ave, callback 732-555-0163. Furnace is running but blowing cold air since this evening. His elderly mother lives with him. Unit is a Carrier, about 12 years old, not sure if he is on a plan. Wants someone first thing tomorrow.',
      exampleDraft: {
        fields: {
          Priority: 'No heat, older adult at home: call back first',
          Customer: 'Marcus Bell, 112 Linden Ave, 732-555-0163. Plan status not stated',
          Problem: 'Furnace runs but blows cold air since last evening',
          Equipment: 'Carrier furnace, about 12 years old',
          Availability: 'Wants first thing tomorrow'
        },
        reply: 'Hi Marcus, this is {company}. We got your message about the furnace blowing cold air, and with your mother at home we are treating it as urgent. We will call you to set up a visit. If you smell gas or a carbon monoxide alarm goes off, leave the house and call 911 from outside. The {company} team'
      },
      measure: 'minutes per request and time from request to first reply',
      next: [
        'Tech notes into invoice summaries and plan offers',
        'Running-late and arrival texts from the board',
        'Maintenance plan renewal reminders'
      ]
    },
    {
      requires: 'exterior',
      job: 'Estimate requests into qualified leads and booking replies',
      unit: 'request',
      units: 'requests',
      pasteLabel: 'Paste a website form, lead service email or voicemail note',
      pasteHint: 'Change or remove names, addresses, phone numbers and gate codes first.',
      task: 'Turn the request into a lead sheet for the estimator and a reply that moves the customer toward an estimate visit.',
      rules: [
        'Never give a price, a price range or a start date. The estimator prices after the site visit.',
        'Never say insurance will cover the work or offer to handle an insurance claim.',
        'Mark active leaks, storm damage or anything unsafe as urgent for the {approver}.',
        'Ask the customer for at most two missing items, and say the team will call to set a visit time.'
      ],
      draftKind: 'Lead sheet',
      fields: ['Customer', 'Request', 'Best times', 'Missing for the estimator', 'Next step'],
      replyTo: 'customer',
      example: 'Website form. Name: Dana Whitfield, 27 Orchard Way, 609-555-0148. Message: We want to get our {trade} replaced before spring. The house is about 18 years old and it is all original. Can someone come give us a price? Weekday mornings are hard, Saturdays are best. Roughly how much does something like this run?',
      exampleDraft: {
        fields: {
          Customer: 'Dana Whitfield, 27 Orchard Way, 609-555-0148',
          Request: 'Replacement price for the {trade}, original to an 18-year-old house, before spring',
          'Best times': 'Saturdays. Weekday mornings are hard',
          'Missing for the estimator': 'Photos and any current damage',
          'Next step': 'Call to book a Saturday estimate visit. Asked for a ballpark price: do not quote'
        },
        reply: 'Hi Dana, thanks for reaching out to {company}. We would be glad to look at your {trade} and give you a written price. Every job is priced after we see it, so we do not quote by email. To prepare, could you send a few photos and tell us about any current damage? We will call you to find a Saturday that works. The {company} team'
      },
      measure: 'minutes per request and time from request to first reply',
      next: [
        'Estimator notes into written estimates',
        'Weather reschedule texts for outdoor jobs',
        'Estimate follow-ups and invoice reminders'
      ]
    }
  ],
  items: [
    {
      id: 'no-heat-shah',
      requires: 'hvac',
      channel: 'call',
      from: 'Call summary: Priya Shah, 14 Maple Ct',
      receivedAt: '7:36 AM',
      subject: 'No heat this morning',
      body: 'Caller says the furnace runs but blows cold air. Two kids at home. She can be there any time before noon.',
      steps: [
        { system: '{core}', text: 'Found customer. Maintenance plan member, gas furnace installed 2014.' },
        { system: '{board}', text: 'Found an open slot 10 AM to 12 PM with tech Luis R., 6 miles away.' },
        { system: '{core}', text: 'Created job J-3391, priority no-heat, plan rate applies.' },
        { system: '{texting}', text: 'Prepared the booking confirmation text.' }
      ],
      draft: {
        kind: 'Booking confirmation',
        to: 'Priya Shah (text)',
        fields: [['Job', 'J-3391'], ['Window', '10 AM to 12 PM'], ['Tech', 'Luis R.']],
        body: 'Hi Priya, this is {company}. Luis is booked to check your furnace today between 10 AM and 12 PM. He will text when he is on the way. Reply here with any questions.'
      }
    },
    {
      id: 'estimate-request-park',
      requires: 'exterior',
      channel: 'form',
      from: 'Website form: Helen Park, 9 Willow Dr',
      receivedAt: '7:40 AM',
      subject: 'Estimate request',
      body: 'Would like someone to look at our {trade} and give us a price before winter. Weekdays after 3 PM work best.',
      steps: [
        { system: '{core}', text: 'Created a new customer record for Helen Park.' },
        { system: '{board}', text: 'Found an estimate slot Thursday 4 PM with estimator Dev S., right after a nearby job.' },
        { system: '{core}', text: 'Booked estimate visit E-1408 with her notes attached.' },
        { system: '{texting}', text: 'Prepared the confirmation text.' }
      ],
      draft: {
        kind: 'Booking confirmation',
        to: 'Helen Park (text)',
        fields: [['Visit', 'E-1408'], ['When', 'Thursday 4 PM'], ['Estimator', 'Dev S.']],
        body: 'Hi Helen, this is {company}. Thanks for reaching out. Dev will stop by Thursday at 4 PM to look at your {trade} and walk you through a price. Reply here if you need a different time.'
      }
    },
    {
      id: 'rtu-harbor',
      requires: 'sensor',
      channel: 'sensor',
      from: 'Rooftop unit 2, Harbor Deli (sample)',
      receivedAt: '7:48 AM',
      subject: 'High discharge pressure alarm',
      body: 'RTU-2 reported high discharge pressure three times since 7:20 AM and shut down cooling. Unit serves the kitchen.',
      steps: [
        { system: '{monitor}', text: 'Confirmed three alarms in 28 minutes. Unit is now locked out.' },
        { system: '{core}', text: 'Found commercial account. Service agreement covers labor, not parts.' },
        { system: '{core}', text: 'Opened service call SC-1187 and attached the alarm history.' },
        { system: '{board}', text: 'Assigned tech Andre M., on the road nearby, for 9 AM.' }
      ],
      draft: {
        kind: 'Service call',
        to: 'Andre M. (tech)',
        fields: [['Call', 'SC-1187'], ['Priority', 'High'], ['Arrival', '9 AM'], ['Coverage', 'Labor covered, parts billable']],
        body: 'RTU-2 locked out on high discharge pressure. Likely a dirty condenser coil or a failed fan motor. Bring coil cleaner and a spare condenser fan motor. Call the office before installing any billable parts.'
      },
      risk: 'Spends customer money: parts are billable and need customer approval first.'
    },
    {
      id: 'late-kim',
      channel: 'system',
      from: 'Dispatch board',
      receivedAt: '8:10 AM',
      subject: 'Kim T. running 45 minutes late',
      body: 'First job at 31 Elm St ran long. Two later jobs today are at risk.',
      steps: [
        { system: '{board}', text: 'Found two affected jobs: 9:30 AM at 8 Oak Ave and 11 AM at 52 Pine Rd.' },
        { system: '{board}', text: 'Moved 8 Oak Ave to Luis R., who has a gap at 9:30 AM.' },
        { system: '{board}', text: 'Kept 52 Pine Rd with Kim T., new window 11:45 AM to 1:45 PM.' },
        { system: '{texting}', text: 'Drafted new arrival texts for both customers.' }
      ],
      draft: {
        kind: 'Customer texts',
        to: 'Two customers (text)',
        fields: [['8 Oak Ave', 'Luis R., 9:30 to 11:30 AM'], ['52 Pine Rd', 'Kim T., 11:45 AM to 1:45 PM']],
        body: '8 Oak Ave: Hi, this is {company}. Luis will handle your visit today, same window, 9:30 to 11:30 AM.\n\n52 Pine Rd: Hi, this is {company}. We are running late. Your new arrival window is 11:45 AM to 1:45 PM. Reply if that does not work.'
      }
    },
    {
      id: 'rain-moves',
      requires: 'exterior',
      channel: 'system',
      from: 'Weather alert',
      receivedAt: '8:25 AM',
      subject: 'Heavy rain Wednesday, 80% chance',
      body: 'Forecast shows heavy rain all day Wednesday. Three outdoor jobs are booked that day.',
      steps: [
        { system: '{weather}', text: 'Confirmed rain from 6 AM to 6 PM Wednesday. Thursday is dry.' },
        { system: '{board}', text: 'Found three Wednesday jobs: 12 Lake Rd, 40 Hill St, 7 Cedar Ln.' },
        { system: '{board}', text: 'Moved all three to Thursday with the same crews.' },
        { system: '{texting}', text: 'Drafted a reschedule text for each customer.' }
      ],
      draft: {
        kind: 'Customer texts',
        to: 'Three customers (text)',
        fields: [['Old date', 'Wednesday'], ['New date', 'Thursday'], ['Jobs', '3']],
        body: 'Hi, this is {company}. Heavy rain is forecast Wednesday, so we moved your visit to Thursday, same time and same crew. Reply here if Thursday does not work and we will find another day.'
      }
    },
    {
      id: 'permit-reyes',
      requires: 'hvac',
      channel: 'email',
      from: 'Township permit office (sample)',
      receivedAt: '8:35 AM',
      subject: 'Permit approved: 22 Birch Ln',
      body: 'Mechanical permit MP-2026-0412 for AC condenser replacement at 22 Birch Ln is approved. Final inspection required after install.',
      steps: [
        { system: '{core}', text: 'Attached permit MP-2026-0412 to job J-3350 for Tom Reyes.' },
        { system: '{core}', text: 'Checked parts order PO-718. Condenser arrives Thursday.' },
        { system: '{board}', text: 'Held Friday 8 AM to 12 PM for install with tech Luis R.' },
        { system: '{core}', text: 'Added a task to book the final inspection after install.' }
      ],
      draft: {
        kind: 'Reply email',
        to: 'Tom Reyes',
        fields: [['Permit', 'MP-2026-0412'], ['Install', 'Friday 8 AM to 12 PM']],
        body: 'Hi Tom, good news. The township approved your permit and your new condenser arrives Thursday. We have Friday morning, 8 AM to 12 PM, held for the install. Reply to confirm and we will book the township inspection after. The {company} team'
      }
    },
    {
      id: 'estimate-cole',
      requires: 'exterior',
      channel: 'form',
      from: 'Site visit notes: Dev S., 18 Brook Ln',
      receivedAt: '9:05 AM',
      subject: 'Estimate notes for Sam and Rita Cole',
      body: 'Visited yesterday. Measured the {trade} and took photos. Two-person crew, two days. Customer wants it done before Dec 15.',
      steps: [
        { system: '{core}', text: 'Found customer Sam and Rita Cole and the visit notes.' },
        { system: '{core}', text: 'Priced labor: two-person crew, two days, $2,880.00.' },
        { system: '{core}', text: 'Added materials from the measurements, $2,140.00, and cleanup, $350.00.' },
        { system: '{board}', text: 'Checked crew calendar. Dec 8 and 9 are open.' }
      ],
      draft: {
        kind: 'Estimate',
        to: 'Sam and Rita Cole',
        fields: [['Labor', '$2,880.00'], ['Materials', '$2,140.00'], ['Cleanup', '$350.00'], ['Total', '$5,370.00']],
        body: 'Hi Sam and Rita, thanks for meeting with Dev. Your estimate for the {trade} work is $5,370.00, including materials, labor and cleanup. We can start Dec 8 and finish by Dec 9. This price is good for 30 days. The {company} team'
      },
      risk: 'Money: the {approver} checks the price before the estimate goes out.'
    },
    {
      id: 'complete-gomez',
      requires: 'hvac',
      channel: 'form',
      from: 'Job completion form, Luis R.',
      receivedAt: '9:20 AM',
      subject: 'Job J-3384 complete: furnace tune-up and igniter',
      body: 'Replaced cracked hot surface igniter, cleaned flame sensor, tested heat. Customer Ana Gomez. Plan renews this month.',
      steps: [
        { system: '{core}', text: 'Closed job J-3384. Parts used: one igniter.' },
        { system: '{accounting}', text: 'Built invoice INV-20455: igniter $96.00, labor $193.00, total $289.00.' },
        { system: '{core}', text: 'Found maintenance plan ending Nov 30. Renewal price $189.00 per year.' },
        { system: '{accounting}', text: 'Added the plan renewal as an optional line.' }
      ],
      draft: {
        kind: 'Invoice',
        to: 'Ana Gomez',
        fields: [['Invoice', 'INV-20455'], ['Total', '$289.00'], ['Plan renewal', '$189.00, optional']],
        body: 'Hi Ana, thanks for having us today. Your invoice for the igniter replacement is $289.00. Your maintenance plan ends Nov 30. Renew for $189.00 to keep priority service and plan pricing. The {company} team'
      },
      risk: 'Money: the {approver} checks the invoice total before it goes to the customer.'
    },
    {
      id: 'complete-diaz',
      requires: 'exterior',
      channel: 'form',
      from: 'Job completion form, crew lead Kim T.',
      receivedAt: '9:45 AM',
      subject: 'Job J-3402 complete: 61 Grove St',
      body: 'Finished the {trade} work yesterday, cleaned the site and uploaded photos. Customer Luis Diaz signed off on site.',
      steps: [
        { system: '{core}', text: 'Closed job J-3402 and attached 6 photos and the sign-off.' },
        { system: '{accounting}', text: 'Found the $1,500.00 deposit paid at booking.' },
        { system: '{accounting}', text: 'Built invoice INV-20461: contract $4,950.00, less deposit, $3,450.00 due.' },
        { system: '{core}', text: 'Added an optional spring check-up visit at $149.00.' }
      ],
      draft: {
        kind: 'Invoice',
        to: 'Luis Diaz',
        fields: [['Invoice', 'INV-20461'], ['Contract', '$4,950.00'], ['Deposit paid', '-$1,500.00'], ['Balance due', '$3,450.00']],
        body: 'Hi Luis, thank you for choosing {company}. Your balance for the {trade} work is $3,450.00 after your $1,500.00 deposit. Want us to come back in the spring for a check-up? We can add it for $149.00. The {company} team'
      },
      risk: 'Money: the {approver} checks the balance before the invoice goes out.'
    }
  ]
};
