# Accounting firm quick win: deployment brief

1. **Buyer:** the managing partner, with the firm administrator or tax manager as the person who runs it. They care most about (a) getting returns and closes moving instead of stalled on missing client documents, and (b) confidentiality: taxpayer data handled under their professional and legal duties, with nothing that could embarrass the firm with a client or a regulator.

2. **The quick win:** client document emails turned into a tracker update and a follow-up request. A client writes "attached are our W-2s, still waiting on the K-1, and we sold the rental". The agent lists what arrived, what is still outstanding, and the new items the preparer must look at, then drafts a reply that thanks the client, asks for what is still needed in one go, and points them to the secure portal. Why this job: three of our four accounting leads already name document chasing as their work; it runs all year for bookkeeping clients (statements, receipts) and floods in from late January for tax; it is text in, text out; and the accountant still decides what the return needs.
   Rejected: **bank-feed categorization** (needs ledger access, and posting is the accountant's judgment; a good second ask once trust exists). **IRS and state notice intake** (high value per item, but lower weekly volume at a small firm and the input is usually a scanned letter, not text; third ask).

3. **Today:** a staff accountant or admin reads each client email in the shared inbox or their own, saves attachments, ticks items off a spreadsheet or the practice system's checklist, notices new issues buried in the email ("we sold the condo"), and writes back asking for the rest. Time goes to reading long chatty emails, reconciling them against the checklist, and second and third follow-ups because the first reply missed something.

4. **Deploy in week one:**
   - **What arrives where:** client emails land in a shared inbox (info@ or tax@) and staff inboxes in the firm's Microsoft 365 or Google Workspace; uploads to the portal send a notification.
   - **How the agent gets it:** one dedicated mailbox inside the firm's own tenant. A mail rule copies client mail from the shared inbox to it; staff forward the rest. **In week one the agent reads the email text and attachment file names only, never the documents themselves.** That keeps the most sensitive data (the forms) out entirely.
   - **Where the draft lands:** a threaded draft reply in the dedicated mailbox, with the tracker update at the top as an internal note. The approver copies the update into their checklist (spreadsheet or practice system), deletes the note, edits the reply and sends it from the firm's mailbox.
   - **Access:** read mail and create drafts on one mailbox. No send permission, no tax software, no portal, no ledger, no document storage.
   - **Days:** before Mon, the partner checks the firm's written information security plan (the FTC Safeguards Rule treats tax preparers as financial institutions) and whether their engagement letter covers a service provider; we provide a one-page data flow and the model provider's business terms (no training on firm data, retention). Mon, kickoff: pick in-scope clients and the standard document list per return or close type. Tue, mailbox and rule; shadow mode on last week's emails. Wed, live. Thu and Fri, 15-minute daily review of every edit.
   - **Bad draft:** the approver discards and flags it; we read every flag the same day. Nothing is sent by the agent.
   - **Timing (a judgment call):** a pilot starting in December sees mostly bookkeeping and year-end emails. For tax clients, the strongest pilot runs from late January, when W-2s and 1099s arrive.

5. **Proof moment:** the partner pastes a real client email, numbers removed. Best input: a chatty tax-season email that mixes documents sent, documents promised, and a life event. A great draft lists exactly what came in, separates "client says it is coming" from "still needed", surfaces the life event as a question for the preparer, asks for everything still missing in one reply, and steers the client to the portal.

6. **Risks and guardrails:** taxpayer data is confidential. Treat everything as tax return information under IRC 7216: used only to serve that client's engagement, never for any other purpose. AICPA confidentiality rules expect the firm to tell clients, or contract for confidentiality, before a third-party provider sees their information; the firm confirms which applies (a guess they may want their counsel or insurer to confirm). The agent never repeats a Social Security, EIN or bank number, never asks for one by email, never says whether something is taxable, deductible or what the client will owe or get back, and never posts to the ledger or files anything.

7. **Pilot:** two weeks, client document emails only. Before: for three days, staff tally each document email (minutes to log and reply, and whether a second follow-up was needed). During: same tally, plus sent as is, edited or rewritten. Success in their words: "Every client email comes with the checklist update done and a reply that gets everything in one ask."

8. **Land and expand:**
   - Bank-feed categorization for review in the ledger
   - IRS and state notice intake with deadline tracking
   - Past-due invoice reminders for the billing team

9. **Variants:** none. No accounting lead has a feature flag, and the job fits both tax and bookkeeping practices (Mercadien's bookkeeping clients send statements and receipts the same way).

10. **Draft quickWins entry:**

```js
quickWins: [
  {
    job: 'Client document emails into tracker updates and follow-up requests',
    unit: 'email', units: 'emails',
    pasteLabel: 'Paste a client email about documents',
    pasteHint: 'Remove Social Security, EIN and bank account numbers first.',
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
```
