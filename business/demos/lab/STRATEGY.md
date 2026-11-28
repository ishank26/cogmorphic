# Cogmorphic quick wins: sales strategy

Sales Strategist, Nov 25. Read against all 11 briefs, ARCHITECTURE.md Revision 4 and leads.js.
All 18 draft entries already meet the hard limits (job <= 70, next <= 60, fields <= 160, replies 42-83 words).

## Owner summary

1. They will not buy "AI". They buy their own messy message turned into a clean draft while they watch.
2. The yes comes from the catch: the missing appointment, the wrong revision, the name they would have missed.
3. Then they type their own numbers, and you ask for two weeks on that one job. A person sends everything.
4. The one thing to have ready: your pilot price and what it turns into after week two. Never improvise it.
5. Say it before they ask: names out before you paste, the page saves nothing, the agent never sends.

## Per industry

Verdicts: 4 Keep, 7 Change. Most changes are small; one is a new job (logistics forwarders).

### Property: Keep
Every manager feels the maintenance inbox personally, a messy tenant email is the perfect paste, and the next asks (vendors, invoices, deposits) grow naturally into money work. No edits.

### Construction: Change (small)
Daily reports and inspection reports are right (see Decision 4). Only the contractor ladder needs to climb to the biggest recurring job sooner.
- `contractor` variant, `next`: `['RFIs drafted from field questions', 'Certified payroll packets for signature', 'Submittal transmittals and log updates']`
- `engineering` variant: no edits.

### Manufacturing: Change (small)
PO contract review is the right win: the Rev B vs Rev C catch is the moment a shop owner remembers. But the brief asks for a PO "with a long clause list", and a long list will be cut at 160 characters, right where the catch is.
- `rules[1]` becomes: `'Under Requirements, name each spec, quality clause, certification and inspection requirement by its code or a short name only (for example Q7 material certs); do not explain clause text the PO does not include.'`

### Home services: Change
First response to inbound requests is the strongest owner pain in the set, because a slow reply means a lost job. Two fixes:
- `hvac` variant, `exampleDraft.reply`: replace `We will call you this morning to set up a visit.` with `We will call you to set up a visit.` The scripted example must not make the time promise the rules forbid.
- `exterior` variant, `example`: the sentence `Our {trade} is about 18 years old and we think it is time to replace it before spring.` breaks for NXT ("siding and gutters is ... replace it"). Replace it with `We want to get our {trade} replaced before spring. The house is about 18 years old and it is all original.`
- `exterior` variant, `exampleDraft.fields.Request`: `'Replacement price for the {trade}, original to an 18-year-old house, before spring'`

### Logistics: Change (forwarder job replaced)
Trucking keeps load sheets. Forwarders get a clearly better win: carrier notices into client status emails. It answers the status pain honestly, because the facts are in the pasted notice. It puts the last free day in front of the owner, which is money they feel. It runs on every shipment, and it is Mill-Wright's own focus line. The quote-inquiry job moves to `next`.
- `forwarder` variant, replace the whole entry with:
```js
{
  requires: 'forwarder',
  job: 'Carrier and terminal notices into client status emails and deadlines',
  unit: 'notice', units: 'notices',
  pasteLabel: 'Paste a carrier arrival notice, booking confirmation or terminal update',
  pasteHint: 'Copy the text out of the PDF. Remove rates and anything private first.',
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
    reply: 'Hi Owen, your container NSLU4821156 (B/L NSL7741203) was discharged at Port Newark on Dec 1. Freight charges are released, but customs has ordered an exam, so the container cannot be picked up yet. The last free day at the terminal is Dec 5, and storage charges may apply after that. We are following the exam and will update you when it is released. The {company} team'
  },
  measure: 'minutes per status email and notices passed to the client the same day',
  next: ['Quote inquiries into quote-ready shipment sheets', 'Export document checklists for licensed staff', 'Container pickup appointment requests']
}
```
- Trucking (default) variant, `rules[2]`: `'In Check before accepting, flag a missing appointment or reference number, any hazmat, overweight, team, TWIC, temperature or liftgate need, and any fine, detention or lumper term.'` Small-fleet owners feel rate con fine print in cash.
- Trucking variant, `next`: `['Customer status emails from driver updates', 'Delivery paperwork chase so invoices go out', 'Detention and accessorial backup for billing']`. Status is the question they will raise in the room; this shows it is step two.

### Distribution: Change (small)
The RFQ win shows a rep's judgment, not a parser, and quote speed is what the owner cares about. Risk: a real 15-line RFQ gets cut at 160 characters in the Lines field, mid-proof.
- `pasteHint`: `'Pick an RFQ with five lines or fewer. Remove customer pricing and anything private first.'`
- `rules[1]`: `'Write each line as quantity, part type, diameter-thread x length, grade or material, and finish, separated by semicolons; past five lines, add "plus N more". List any line missing thread pitch, grade or finish under Specs to confirm.'`

### Insurance: Keep
Policy changes are the steady core of every service inbox. The reply that refuses to say "you're covered" is the E&O trust moment a principal buys. The Spanish variant fits Prime Time. No edits.

### Wealth: Change (service variant kept, see Decision 1)
- Remove the `// proposed flag` comment from the `service` variant.
- `service` variant, `next`: `['Onboarding packets and custodian forms prepared', 'Meeting notes into CRM notes and client recaps', 'Quarterly fee run checks before billing']`. Ops-led firms grow into paperwork first.
- Data agent: add `service` to the Revision 3 flag list, and set `features: ['service']` on newport-capital-group, carbon-wealth-advisors, pine-valley-investments and mclaughlin-private-wealth. The other four keep the meeting win.

### Accounting: Keep
Document chasing is the complaint every partner has in tax season, and it fits all four leads. Sell it now, but time the pilot: tax clients start the week W-2s and 1099s land (late January); Mercadien's bookkeeping clients can start now. No edits.

### Law: Keep
The partner reads every inquiry personally, and a missed callback is a lost matter. The proof (every conflict name caught, zero advice, no fee) works even on a names-changed inquiry, which RPC 1.18 requires anyway. No edits.

### Medical billing: Change (small, see Decision 2)
- `rules[3]` becomes: `'Give the appeal deadline only as the denial states it, never worked out or guessed; otherwise write Not stated.'` The bracket rule already sits in rules[0] and the task.
- Brief section 7: the pilot clock starts when all three BAAs are signed. Placeholder mode is only for the day-2 back-test on past denials, never the live pilot.

## Decisions

1. **Wealth service variant: keep it.** YAGNI cuts what nobody needs yet. This variant is needed now by 4 of the 8 wealth leads, whose evidence and approvers are about service requests and paperwork, not advisor meetings. Without it, their page heading contradicts their own focus line. The cost is one flag string. Its proof moment is also the strongest in wealth: it catches an address change paired with a withdrawal, a classic fraud pattern, and asks for a call back.
2. **Medical billing placeholders: strong enough to win the meeting, not to run the pilot.** The proof is the call a billing owner judges: appeal or corrected claim, the deadline, what to attach. De-identified codes carry all of that, and brackets in a letter look like a normal template. But a pilot where billers bracket every denial by hand eats the time it is meant to save. So the meeting uses de-identified text; the pilot starts only after the BAAs are signed, including one that covers the AI vendor with zero retention. Before pitching A Step Above, confirm that vendor BAA can actually be signed.
3. **Status replies: agree for inbound "where is my load" questions, but don't drop status.** A draft that can only say "we will check" proves nothing, and a guessed ETA is a deal-breaker. The honest version uses an update that already holds the facts. Forwarders now lead with carrier notices into client status emails. Trucking keeps load sheets and puts status emails from driver updates first in `next`. Distribution keeps RFQs: its status answers live in the ERP, and it is step two there.
4. **Contractors: agree with daily reports.** They happen every day on every job, foremen already text the notes, and the record is what gets change orders and delay claims paid, which is money the owner feels. Certified payroll is a signed legal filing built from pay data, so a wrong figure means penalties: wrong for week one, but the biggest recurring job, so it moves up to second in `next`. RFIs are lower volume and need drawings. The daily report surfaces the RFI-worthy issue (the C-7 anchor bolts), so RFIs are the natural first expand.

## Cross-cutting rules for every quick win

1. **Scrub before you paste.** Every `pasteHint` names the trade's own identifiers to remove. Law pastes only names-changed inquiries, and medical billing only de-identified codes. The owner says this out loud before the lead pastes.
2. **The reply never promises, even softly.** No times ("this morning"), prices, outcomes, coverage, release or completion. Every scripted `exampleDraft.reply` must pass the same fixed rules it demonstrates and stay at or under 90 words.
3. **Show one catch and one honest gap.** Every `example` holds one thing a tired person would miss, flagged in a field, and the draft shows at least one "Not stated" or open item. The catch is what earns the pilot.
4. **Fields must fit.** Real messages are messier than examples, so long lists will hit the 160-character cut. Builder: add one fixed prompt rule, "Keep each field under 150 characters; if a list runs longer, end it with 'plus N more'". Every entry already uses all 4 of its rule slots.
5. **Read and draft only.** Every pilot copies mail to one mailbox the client owns, drafts land for a named approver, a person sends from their own mailbox, and the agent has no send permission and touches no system of record.
