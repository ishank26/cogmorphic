# Independent insurance agency quick win: deployment brief

1. **Buyer:** the agency principal (often also the top producer), with the service or operations manager as the person who must like it. They care most about (a) keeping the CSRs from drowning in routine service so they can retain and round out accounts, and (b) E&O exposure: nothing goes to a client that implies coverage the agency has not confirmed.

2. **The quick win:** policy change emails turned into a service ticket and a client acknowledgment. A client writes "I bought a new car", "take my son off", "new mortgage company", "we moved", "add a truck to the business auto". The agent pulls out who, what change, effective date and urgency, lists everything a licensed CSR still needs (full VIN, lienholder address, driver details), and drafts a reply that confirms receipt and asks for the missing items in one go. Why this job: it is the steady backbone of every agency's service inbox, personal and commercial; the pain is the back-and-forth for missing details; it is text in, text out; and the licensed CSR still makes the change.
   Rejected: **certificate requests** (many agencies already issue them from the agency system or a client portal, and the real step, checking the endorsement on the policy, needs system access; better as ask two). **Renewal summaries** (inputs are carrier PDFs and system data, and comparing coverages edges into advice; a week-one job cannot do it safely).

3. **Today:** a CSR opens the shared service inbox or their own, reads the request, looks up the policy, works out what is missing, emails the client back for it, waits, then processes the change in the agency system and with the carrier. Time goes to rereading threads, chasing missing details over two or three emails, and typing the same acknowledgment again and again. Urgent ones ("driving it home tonight") jump the queue and break focus.

4. **Deploy in week one:**
   - **What arrives where:** service requests land in a shared mailbox (service@) in the agency's Microsoft 365 or Google Workspace, plus some in CSR inboxes.
   - **How the agent gets it:** we create one dedicated mailbox inside the agency's own tenant. A mail rule copies new service@ mail to it; CSRs forward anything from their own inbox. Mail never leaves the agency's tenant except to the model provider under business terms that exclude training.
   - **Where the draft lands:** the agent saves a draft reply in the dedicated mailbox, threaded to the client's email, with the service ticket at the top as an internal note. The CSR copies the ticket into the agency system activity (AMS360 and Epic users already file email this way), deletes the note, edits the reply and sends it from the shared mailbox.
   - **Access:** read mail and create drafts on one mailbox. No send permission on the agent's account, no login to the agency system or carrier portals, no client files.
   - **Not touched:** the agency system, carrier portals, billing, certificates, claims.
   - **Days:** Mon, 45-minute kickoff with the principal and service lead: choose the change types in scope, write their "what we always need" list for each. Tue, set up the mailbox and rule; run the agent on last week's requests in shadow mode and compare with what the CSR actually did. Wed, go live on in-scope types. Thu and Fri, 15-minute daily review of every edited or discarded draft; tighten the instructions.
   - **Bad draft:** the CSR discards it and flags it "agent miss". We read every miss the same day. A draft never goes anywhere on its own.

5. **Proof moment:** the principal pastes a real change request from this week, ideally a vehicle swap or driver add with something missing. A great draft gets four things right: it names the change exactly, catches every missing item, marks urgency, and says plainly that this email is not confirmation of coverage. Watching the reply refuse to say "you're covered" is the moment a principal trusts it.

6. **Risks and guardrails:** only licensed staff discuss coverage, quote, bind or confirm a change. The agent never binds coverage, never issues certificates or ID cards, never says a change is in effect, never quotes premium or explains what the policy covers. If a message reports an accident or loss, it flags it first and does not discuss coverage. It never copies driver's license, Social Security or bank numbers into the ticket. Client data stays in the agency's own mail system.

7. **Pilot:** two weeks, change requests only. Before: for three days before go-live, CSRs tally each change request on a simple sheet (start, finish, emails needed to complete it). During: same sheet, plus the CSR marks each draft sent as is, edited, or rewritten. Success in their words: "I open the request and the ticket is already done. I check it and send."

8. **Land and expand:**
   - Certificate requests prepared for the CSR to issue
   - Renewal comparison summaries for account managers
   - First notice of loss intake and claim follow-up

9. **Variants:** Prime Time Insurance Agency has `spanish`: same job, but Spanish messages get a Spanish reply and an English ticket. Deployment adds one rule: a Spanish-reading licensed staff member approves Spanish replies. All other insurance leads use the default.

10. **Draft quickWins entry:**

```js
quickWins: [
  {
    requires: 'spanish',
    job: 'Policy change requests in English or Spanish into service tickets',
    unit: 'request', units: 'requests',
    pasteLabel: 'Paste a client change request (English or Spanish)',
    pasteHint: 'Remove license numbers, dates of birth and policy numbers first.',
    task: 'Turn the message into a service ticket for a licensed CSR and a short reply that confirms receipt and asks for anything missing.',
    rules: [
      'Write the ticket fields in English. Write the reply in the language the client used.',
      'Never say or suggest that coverage is added, changed, bound or in effect, and never explain what the policy covers.',
      'Never quote a premium, price change or deductible.',
      'Do not copy license, Social Security or bank numbers. Write "In original message" instead.'
    ],
    draftKind: 'Service ticket',
    fields: ['Client', 'Change requested', 'Effective date', 'Missing info', 'Urgency'],
    replyTo: 'client',
    example: 'Hola, soy Rosa Quintero. Mi hija Sofía cumplió 17 y ya tiene su licencia de conducir. ¿Pueden agregarla a mi póliza de auto a partir del lunes? Va a manejar el Corolla.',
    exampleDraft: {
      fields: {
        Client: 'Rosa Quintero',
        'Change requested': 'Add driver: daughter Sofía, 17, newly licensed, to drive the Corolla',
        'Effective date': 'Monday (client request)',
        'Missing info': 'Copy of Sofía\'s license, her date of birth',
        Urgency: 'Normal. Wants it from Monday.'
      },
      reply: 'Hola Rosa, felicidades a Sofía. Recibimos su solicitud para agregarla como conductora a partir del lunes. Para continuar, envíenos una foto de la licencia de Sofía y su fecha de nacimiento. Un agente con licencia revisará el cambio y se lo confirmará por escrito. Este mensaje no confirma la cobertura. Saludos, el equipo de {company}.'
    },
    measure: 'time from a change request to a ready ticket, and emails needed per change',
    next: ['Certificate requests prepared for the CSR to issue', 'Renewal comparison summaries for account managers', 'First notice of loss intake and claim follow-up']
  },
  {
    job: 'Policy change emails into service tickets and client replies',
    unit: 'request', units: 'requests',
    pasteLabel: 'Paste a client change request',
    pasteHint: 'Remove license numbers, dates of birth and policy numbers first.',
    task: 'Turn the message into a service ticket for a licensed CSR and a short reply that confirms receipt and asks for anything missing.',
    rules: [
      'Never say or suggest that coverage is added, changed, bound or in effect, and never explain what the policy covers.',
      'Never quote a premium, price change or deductible.',
      'If the message reports an accident, loss or claim, say so first under Urgency and do not discuss coverage.',
      'Do not copy license, Social Security or bank numbers. Write "In original message" instead.'
    ],
    draftKind: 'Service ticket',
    fields: ['Client', 'Change requested', 'Effective date', 'Missing info', 'Urgency'],
    replyTo: 'client',
    example: 'Hi, this is Dana Whitfield. I traded in my 2019 Camry today and bought a 2024 Subaru Outback, financed through Harborline Credit Union. Please swap the cars with the same coverage. I am driving it home tonight and the VIN ends in 4417.',
    exampleDraft: {
      fields: {
        Client: 'Dana Whitfield',
        'Change requested': 'Replace 2019 Camry with 2024 Subaru Outback. Client asks for the same coverage. Add Harborline Credit Union as lienholder.',
        'Effective date': 'Today',
        'Missing info': 'Full VIN, lienholder mailing address',
        Urgency: 'High. Client is driving the new car tonight.'
      },
      reply: 'Hi Dana, congratulations on the Outback. We received your request to replace the Camry with the 2024 Subaru Outback and add Harborline Credit Union as lienholder. To finish it, please send the full VIN and the lienholder\'s mailing address. A licensed member of our team will review the change and confirm it with you in writing. This email does not confirm coverage. The {company} team'
    },
    measure: 'time from a change request to a ready ticket, and emails needed per change',
    next: ['Certificate requests prepared for the CSR to issue', 'Renewal comparison summaries for account managers', 'First notice of loss intake and claim follow-up']
  }
]
```

Guess to confirm in the kickoff: how many requests arrive by text through a texting tool rather than email. Week one covers email only; texts can be forwarded into the same mailbox if their tool allows it.
