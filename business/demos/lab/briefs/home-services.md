# Home services quick win: deployment brief

Leads: 4 hvac shops (heating, cooling, plumbing, electrical) and 3 exterior shops (roof, siding and gutters, irrigation). One job, two flavors.

1. **Buyer:** the owner (often a former tech) or a general manager. Cares most about (a) booking every job that calls in, since a homeowner who waits calls the next shop, and (b) keeping a small office from drowning in peak season (no-heat in winter, storms and spring start-ups for exterior).

2. **The quick win:** first response to inbound requests. HVAC: overnight answering-service messages, voicemail transcripts and web forms become a service call ticket with a priority, plus a reply. Exterior: estimate requests become a lead sheet with what the estimator still needs, plus a reply that moves toward a visit. Why: it arrives every day as text, it is pure retyping and judgment the CSR does anyway, a slow reply loses the job, and a bad draft costs nothing because a person sends every reply.
   Rejected: (a) tech notes into invoice summaries. Strong, but it sits on the money step and the notes live inside the field service system. It is the first expand. (b) Running-late and weather reschedule texts. Needs live schedule access, so not week one.

3. **Today:** a CSR or the owner opens the shared inbox and the answering-service portal at 7 AM, reads each message, decides what is urgent, looks the customer up, retypes name, address, problem and equipment into the field service system, then calls or texts back. Exterior shops also chase lead-service emails and web forms through the day. Time goes to reading messy notes, retyping, and deciding who to call first. Estimators lose visits to missing basics (photos, size, damage). Guess: the pile is worst on Monday mornings and after storms.

4. **Deploy in week one:**
   - Sources: web form emails, answering-service emails, voicemail-to-email transcripts, lead-service emails. Phone calls answered live stay as they are.
   - Access: one server-side forwarding rule in their Microsoft 365 or Google Workspace copies matching mail to a dedicated pilot mailbox (on their domain if they allow it). The original stays in the shared inbox, so nothing is ever lost if the agent stops.
   - Output: within a minute the agent emails a draft card to the approver: ticket fields on top, reply text below, ready to copy. The pilot mailbox may send only to an allowlist of internal addresses, enforced by a mail rule.
   - Approve: the approver copies the ticket into the field service system and sends the reply from the tool they already use (texting, email, phone). Then tags the card Used, Edited or Wrong (Outlook category or Gmail label).
   - Not touched: field service system, dispatch board, customer list, texting tool, accounting, payments. No sending to customers.
   - Day 1: 45-minute kickoff. Pick sources, collect 20 to 30 past messages, write house rules (service towns, what counts as urgent, sign-off, never-say list). Day 2: mailbox, forwarding and allowlist rules; back-test on the past messages; approver grades them. Day 3: shadow mode, drafts arrive but the office works as usual. Days 4 and 5: the approver works from drafts. Daily 15-minute check-in.
   - Privacy: customer names, addresses and phones only. If a message holds a card number, the agent flags it and does not repeat it. Business API terms that do not train on inputs. Pilot mailbox deleted at the end unless they keep it.
   - Bad draft: the approver ignores it and works the original. Every Wrong tag gets a rule fix the same day.

5. **Proof moment:** the owner pastes last night's answering-service message or a real web form. A great HVAC draft ranks it right (no heat with a baby or older adult at home goes first; gas smell or CO alarm is a safety call now), pulls equipment and availability out of a rambling note, writes "Not stated" instead of guessing plan status, and never promises a time or diagnoses. A great exterior draft names the two missing items that would waste a visit and does not quote a price.

6. **Risks and guardrails:** never diagnose, quote a price or range, or promise an arrival or start date. Safety words (gas, CO alarm, sparks, burning smell) trigger "leave the house and call 911 or the gas utility from outside" and a call-now flag for a person. Exterior: never say insurance will pay or offer to handle a claim. No prices or payment details in replies.

7. **Pilot:** two weeks, one job. Before: mailbox timestamps from the last two weeks give time from request in to first reply; the approver times 10 requests by hand. During: same timestamps, the same hand timing on drafts, plus the Used, Edited, Wrong count. Success in their words: "The overnight pile is sorted before I sit down" and "No-heat calls get called back first, every time."

8. **Land and expand:**
   - HVAC: Tech notes into invoice summaries and plan offers. Running-late and arrival texts from the board. Maintenance plan renewal reminders.
   - Exterior: Estimator notes into written estimates. Weather reschedule texts for outdoor jobs. Estimate follow-ups and invoice reminders.

9. **Variants:** `hvac`: Anton, J.W. Poole, First Choice, Service Professionals. `exterior`: Executive Roofing, Wetscape, NXT (all three set `trade`, so `{trade}` is safe). No fallback variant: every lead carries one flag. Add one only if a lead arrives without either.

10. **Draft quickWins entry:**
```js
quickWins: [
  {
    requires: 'hvac',
    job: 'After-hours and web service requests into call tickets and replies',
    unit: 'request', units: 'requests',
    pasteLabel: 'Paste an answering service message, voicemail note or web form',
    pasteHint: 'Remove card numbers and anything private first.',
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
      reply: 'Hi Marcus, this is {company}. We got your message about the furnace blowing cold air, and with your mother at home we are treating it as urgent. We will call you this morning to set up a visit. If you smell gas or a carbon monoxide alarm goes off, leave the house and call 911 from outside. The {company} team'
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
    unit: 'request', units: 'requests',
    pasteLabel: 'Paste a website form, lead service email or voicemail note',
    pasteHint: 'Remove anything private first.',
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
    example: 'Website form. Name: Dana Whitfield, 27 Orchard Way, 609-555-0148. Message: Our {trade} is about 18 years old and we think it is time to replace it before spring. Can someone come give us a price? Weekday mornings are hard, Saturdays are best. Roughly how much does something like this run?',
    exampleDraft: {
      fields: {
        Customer: 'Dana Whitfield, 27 Orchard Way, 609-555-0148',
        Request: 'Replacement price for an 18-year-old {trade}, before spring',
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
]
```
