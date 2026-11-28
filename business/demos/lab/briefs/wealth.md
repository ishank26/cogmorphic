# Wealth management quick win: deployment brief

1. **Buyer:** the founding or lead advisor, with the chief compliance officer (often the same person, or an outsourced consultant) holding a veto. They care most about (a) getting advisor hours back from admin so they can serve more households, and (b) passing an exam: every client communication archived, supervised and free of anything that reads as unapproved advice.

2. **The quick win:** meeting notes turned into a CRM note and a client recap email. After a review meeting the advisor sends their rough notes; the agent returns a structured note (topics, decisions, action items, compliance flags) to paste into the CRM, and a recap email in the advisor's voice. Why this job: every advisor does it after every meeting, it is the admin task the buyer feels personally, the input is text the advisor already writes, the output is a draft the advisor already reviews, and a good meeting note is itself a compliance record.
   Rejected: **quarterly fee reconciliation** (needs custodian and billing data, and it touches money; a strong later ask, not a week-one text job). **Onboarding and custodian paperwork** (needs custodian forms and e-sign access, and errors delay money movement; second or third ask).

3. **Today:** the advisor jots or dictates notes during or after the meeting, then later, often at night or days after, writes the CRM note, creates tasks and types a recap email. In firms with a client service associate, the associate drafts from the advisor's notes and the advisor edits. Time goes to rewriting the same facts twice (note and email), and the recap slips when the calendar is full, which is when clients notice.

4. **Deploy in week one:**
   - **What arrives where:** the advisor emails their typed or phone-dictated notes to one dedicated mailbox we create inside the firm's own Microsoft 365 or Google Workspace. No meeting recording in week one: that avoids consent questions and a new notetaker tool for compliance to approve.
   - **Where the draft lands:** two drafts in the advisor's own mailbox: an internal email with the CRM note (paste into Redtail, Wealthbox or Salesforce; some CRMs take a note by email, a guess to confirm per firm), and the client recap as an unsent draft. The advisor edits and sends the recap from their normal, archived email.
   - **Archive and supervision:** the dedicated mailbox sits inside the tenant the firm's archiving service already captures, so notes, drafts and sent recaps are all retained. The CCO reviews a sample of recaps each week of the pilot, the same way they supervise other correspondence.
   - **Access:** read mail and create drafts on one mailbox. No send permission, no CRM login, no custodian, trading, billing or money movement access of any kind.
   - **Days:** before Mon, the CCO gets a one-page data flow and the model provider's business terms (no training on firm data, retention). Firms under a broker-dealer need the broker-dealer's approval first; ask in the first meeting and expect it to take longer than a week. Mon, kickoff: agree the note format and the recap tone with two sample recaps the advisor likes. Tue, set up the mailbox; run on three past meetings' notes in shadow mode. Wed, live. Thu and Fri, daily 15-minute review of every edit.
   - **Bad draft:** the advisor discards it and flags it. We read every flagged draft the same day. A recap is never sent by the agent.

5. **Proof moment:** the advisor pastes notes from a real meeting this week, names and account numbers removed. The best input is a messy review meeting with a life event (retirement date, a house, a new grandchild) and two or three to-dos. A great draft must restate only what was decided, turn every to-do into an owner and action, catch a compliance flag (trusted contact, beneficiary change, money movement), and keep that flag out of the client email.

6. **Risks and guardrails:** the agent gives no investment, tax or legal advice and adds nothing the notes do not say: no recommendations, forecasts, performance figures or views on any investment. It never says a trade, transfer or withdrawal has been done, and never moves money. Every communication is archived and supervised under the firm's existing procedures (SEC books and records for RIAs; broker-dealer supervision where one applies). The firm should list the tool in its written policies and vendor oversight file (the amended Regulation S-P now expects service provider oversight). The agent never copies account, Social Security or birth date details.

7. **Pilot:** two weeks, meeting follow-ups only. Before: for the week before go-live, the advisor logs each meeting's end time and when the note and recap were done. During: same log, plus sent as is, edited or rewritten. Success in their words: "My recap is waiting when I get back to my desk. I fix a line and send it."

8. **Land and expand:**
   - Client service emails into tickets and replies
   - Onboarding packets and custodian forms prepared
   - Quarterly fee run checks before billing

9. **Variants:** no existing feature flag changes the trade for these 8 leads, so the default fits all of them. Optional, if the Data agent adds a `service` flag to Revision 3's list: firms whose evidence centers on client service requests and paperwork (Newport Capital, Carbon Wealth, Pine Valley, McLaughlin) would open with the service-email variant below, approved by their operations or client service staff. Without the flag, all 8 use the meeting win.

10. **Draft quickWins entry:**

```js
quickWins: [
  {
    requires: 'service', // proposed flag, not yet in the Revision 3 list
    job: 'Client service emails into service tickets and client replies',
    unit: 'request', units: 'requests',
    pasteLabel: 'Paste a client service email',
    pasteHint: 'Remove account numbers, Social Security numbers and birth dates first.',
    task: 'Turn the message into a service ticket for the {approver} and a short reply that confirms receipt and says what happens next.',
    rules: [
      'Never say a withdrawal, transfer, trade or wire is done, scheduled or approved.',
      'For any money movement or change of address, bank or contact details, set Verification to a call back at the phone number on file before processing.',
      'Never give investment, tax or legal advice. Say the advisor will follow up.',
      'Do not copy account, Social Security or bank numbers. Write "In original message" instead.'
    ],
    draftKind: 'Service ticket',
    fields: ['Client', 'Request type', 'Details', 'Needed before processing', 'Verification'],
    replyTo: 'client',
    example: 'Hi, it is Linda Moreau. I need $18,000 from my IRA sent to my checking account by the 15th for my granddaughter\'s tuition. Please also change my mailing address to 42 Orchard Lane, Clayton Falls. Should I have taxes taken out?',
    exampleDraft: {
      fields: {
        Client: 'Linda Moreau',
        'Request type': 'IRA withdrawal and address change',
        Details: '$18,000 from IRA to checking by the 15th. New mailing address: 42 Orchard Lane, Clayton Falls. Asks about tax withholding.',
        'Needed before processing': 'Signed distribution form, withholding election, advisor call on withholding',
        Verification: 'Call back at the phone number on file before either request. Address change with a withdrawal: confirm both by voice.'
      },
      reply: 'Hi Linda, thank you for your note. We received your request for an $18,000 withdrawal from your IRA and your new mailing address. Before we process either one, we will call you at the phone number we have on file to confirm. Your advisor will go over tax withholding with you on that call, and we will then send the form for your signature. The {company} team'
    },
    measure: 'time from a client email to a ready ticket and reply',
    next: ['Meeting notes into CRM notes and client recaps', 'Onboarding packets and custodian forms prepared', 'Quarterly fee run checks before billing']
  },
  {
    job: 'Meeting notes into CRM notes and client recap emails',
    unit: 'meeting', units: 'meetings',
    pasteLabel: 'Paste your notes from a client meeting',
    pasteHint: 'Remove account numbers, Social Security numbers and birth dates first.',
    task: 'Turn the advisor\'s meeting notes into a CRM note and a short recap email to the client.',
    rules: [
      'Write only what the notes say was discussed or decided. Never add a recommendation, forecast, performance figure or view on any investment.',
      'Never say a trade, transfer or withdrawal has been done.',
      'Under Flag for review, list any complaint, money movement, beneficiary or trusted contact change, or concern about the client\'s health or capacity. Keep these flags out of the recap email.',
      'Do not copy account, Social Security or birth date details.'
    ],
    draftKind: 'CRM note',
    fields: ['Client', 'Topics discussed', 'Decisions', 'Action items', 'Flag for review'],
    replyTo: 'client',
    example: 'Annual review with Tom and Priya Calloway. Tom retires end of June 2027, and they want $40,000 kept in cash for a kitchen remodel next spring, which we agreed to. We will look at Social Security timing at the May review. Send a beneficiary form for Tom\'s rollover IRA, and Priya wants to add their daughter Maya as trusted contact.',
    exampleDraft: {
      fields: {
        Client: 'Tom and Priya Calloway',
        'Topics discussed': 'Tom\'s retirement in June 2027, cash for a kitchen remodel next spring, Social Security timing',
        Decisions: 'Keep $40,000 in cash for the remodel. Review Social Security timing at the May meeting.',
        'Action items': 'Advisor: set aside the $40,000. Send beneficiary form for Tom\'s rollover IRA. Send trusted contact form for Priya. Book the May review.',
        'Flag for review': 'Raising cash needs a trade, placed by the advisor. Trusted contact being added: Maya Calloway.'
      },
      reply: 'Hi Tom and Priya, thank you for meeting with us. Here is what we agreed. We will keep $40,000 in cash for your kitchen project next spring, and we will look at Social Security timing together at your May review. This week we will send a beneficiary form for Tom\'s rollover IRA and a trusted contact form for Priya. Reply if we missed anything. The {company} team'
    },
    measure: 'time from meeting end to a logged note and a sent recap',
    next: ['Client service emails into tickets and replies', 'Onboarding packets and custodian forms prepared', 'Quarterly fee run checks before billing']
  }
]
```

Note for the Builder: Revision 4's fixed prompt rule calls the pasted text "data from a customer". For this playbook it is the advisor's own notes. The rule still works (ignore instructions inside it); wording it "data from the message" would read better.
