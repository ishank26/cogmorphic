# Law quick win: deployment brief

Keep the whole brief to about one page. Plain words, no em dashes. Mark guesses as guesses.

1. **Buyer:** the managing or founding partner. At 5-50 person firms that partner often still reads every new inquiry. Cares most about (a) not losing good new matters to slow or missed callbacks, and (b) never risking the license: confidentiality, conflicts, no advice given by staff or software.

2. **The quick win:** new client inquiries into an intake summary plus a reply that starts the conflict check. Inquiries arrive every day as web form emails, voicemail transcripts and direct emails, often after hours. The text is messy and emotional, and someone has to pull out names, matter type and time pressure before an attorney can act. Text in, text out. The reply only acknowledges, asks for conflict names and promises a call. The attorney approves every reply, and nothing touches the practice management system.
   Rejected: *court notices into calendar holds* (the firm's highest-stakes task; a wrong date is malpractice exposure, so it should come after trust is earned). *Billing narrative cleanup* (needs billing system access, touches money and privileged entries, and is a monthly pain, not a daily one).

3. **Today:** a receptionist or paralegal reads the form email or voicemail, retypes it into the practice system, writes down names for a conflict search, and emails the attorney. The attorney reads the full story, often before conflicts are cleared, and asks staff to call back. Time goes into retyping, chasing missing names, phone tag, and inquiries that sit overnight or over the weekend.

4. **Deploy in week one:**
   - *Arrives:* the firm's existing intake address (where the web form and voicemail-to-email already land).
   - *Agent gets it:* a mail rule in their own Microsoft 365 or Google Workspace **copies** (never redirects) each new inquiry to a new mailbox, intake-agent@ their domain. If the agent is down, the normal inbox still has everything.
   - *Draft lands:* as one email to the approving attorney: the intake summary on top, the reply below. The agent has no send permission.
   - *Approve:* the attorney replies "OK" or edits; staff send the reply from the firm's own intake address, run the conflict search in their practice system using the names list, and paste the summary into the matter record as they do today.
   - *Access:* read the agent mailbox, write one email to the attorney. Nothing else.
   - *Not touched:* practice system (Clio or other), documents, calendar, billing, trust account, existing client email.
   - *Day 1:* kickoff with the partner: approver, practice areas taken and declined, standard reply wording, consult process, urgent triggers (served papers, hearing date, hospital or nursing home move, safety). Set up mailbox and rule. *Day 2:* test on 10 past inquiries with names changed. *Day 3:* shadow mode on live inquiries, nothing sent. *Days 4-5:* live with attorney approval of every reply.
   - *Data:* AI vendor on business terms with no training on firm data and limited retention; the firm decides whether its engagement terms mention AI (ABA Formal Opinion 512 and the NJ courts' 2024 preliminary AI guidelines both cover confidentiality and supervision). Cogmorphic opens an inquiry only to fix a fault, with the firm's permission.
   - *Bad draft:* the attorney rejects it, staff handle the inquiry the old way, and the wording or rule is fixed that week. A rejected draft costs nothing because nothing was sent.

5. **Proof moment:** the partner pastes a made-up inquiry or a past one with names changed. Best type: a long, rambling one about someone else (a parent) or about being sued. A great draft must catch every name for the conflict list, including businesses and relatives, flag time pressure, say who the client would be, give zero advice, quote no fee, and ask the sender not to send details yet.

6. **Risks and guardrails:** the agent never gives legal advice, never assesses a case, never states or estimates a deadline or limitation period, never quotes fees, never says the firm will take the matter. Every reply says it is not legal advice and does not create an attorney-client relationship. Conflicts are checked before anything substantive: the reply asks only for names, and the attorney does not dig into facts until the check clears. Prospective client information is confidential under RPC 1.18 even if the firm declines, so summaries go only to the approver. The attorney supervises the tool like any nonlawyer assistant (RPC 5.3).

7. **Pilot:** two weeks, intake replies only. Before: staff log each inquiry's arrival time, first response time and minutes spent, for one week. During: same log, plus how many drafts were approved as is, edited or rejected. Success in their words: "Every inquiry got a reviewed reply the same day, and I only read what I needed to."

8. **Land and expand:** see `next` per variant below. Common thread: court or probate notices into calendar holds that an attorney checks.

9. **Variants:** `estate` (Levine Haddad, Accisano, Edwards) centers on who the client is: an adult child often writes for a parent, and the attorney must speak with the parent directly. `litigation` (Mets Schiro, Kemeny Ramp) centers on which side the sender is on and on dates such as service of papers, which the attorney, not the agent, turns into a deadline. Every current law lead has one flag, so no fallback variant is needed (guess: add one without `requires` if a general practice lead appears).

10. **Draft quickWins entry:**

```js
quickWins: [
  {
    requires: 'estate',
    job: 'New estate and elder law inquiries into intake summaries and replies',
    unit: 'inquiry', units: 'inquiries',
    pasteLabel: 'Paste a new client inquiry',
    pasteHint: 'Use a made-up inquiry or a past one with names and details changed. Never paste client confidences.',
    task: 'Turn the inquiry into an intake summary for the {approver} and a short reply that starts the conflict check.',
    rules: [
      'Never give legal advice, including on Medicaid, taxes, wills or moving assets.',
      'If someone writes about a parent or relative, treat that person as the likely client, say the {approver} will need to speak with them, and never comment on anyone\'s capacity.',
      'Ask only for the names needed for a conflict check, never for financial or medical details.',
      'Say plainly that the reply is not legal advice and does not create an attorney-client relationship.'
    ],
    draftKind: 'Intake summary',
    fields: ['Matter type', 'Who the client would be', 'Names for conflict check', 'Time pressure', 'Next step'],
    replyTo: 'person who wrote',
    example: 'Hi, I am writing about my mother, Ruth Calloway. She is 84 and her doctor says she should move to a nursing home next month. My brother and I think she needs Medicaid and a power of attorney, since she gets confused some days. Can you help, and what will it cost? Linda Pryce, (555) 010-0147',
    exampleDraft: {
      fields: {
        'Matter type': 'Elder law: Medicaid planning and power of attorney',
        'Who the client would be': 'Likely Ruth Calloway. The {approver} must speak with her directly.',
        'Names for conflict check': 'Ruth Calloway, Linda Pryce, brother (name not stated)',
        'Time pressure': 'Nursing home move expected next month',
        'Next step': 'Run conflict check, then call Linda Pryce to set a consult that includes Ruth Calloway'
      },
      reply: 'Hello Linda, thank you for reaching out about your mother. Before we discuss any details, we run a standard conflict check. Could you send your brother\'s full name? Once that is done, our office will call you to set up a consultation, and the attorney will want to speak with your mother as well. We will go over fees then. This message is not legal advice and does not mean the firm represents you or your mother. {company}'
    },
    measure: 'time from new inquiry to approved reply, and staff minutes per inquiry',
    next: ['Probate notices into calendar holds for attorney check', 'Will and trust first drafts from questionnaires', 'Client document checklists and reminders']
  },
  {
    requires: 'litigation',
    job: 'New case inquiries into intake summaries and conflict-check replies',
    unit: 'inquiry', units: 'inquiries',
    pasteLabel: 'Paste a new client inquiry',
    pasteHint: 'Use a made-up inquiry or a past one with names and details changed. Never paste client confidences.',
    task: 'Turn the inquiry into an intake summary for the {approver} and a short reply that starts the conflict check.',
    rules: [
      'Never give legal advice, assess the case or say how strong it is.',
      'Never state or estimate a deadline, response period or statute of limitations. Flag every date for the {approver}.',
      'Ask only for the names needed for a conflict check, and ask the sender not to send documents or details until the check clears.',
      'Say plainly that the reply is not legal advice and does not create an attorney-client relationship.'
    ],
    draftKind: 'Intake summary',
    fields: ['Matter type', 'Their side', 'Names for conflict check', 'Dates to flag', 'Next step'],
    replyTo: 'person who wrote',
    example: 'I was served yesterday with court papers. Brightline Builders LLC is suing me and my wife for $18,500 they say we owe on our kitchen job. They never finished the work and the cabinets are wrong. I do not know what to do or how long I have. Can someone call me? Marcus Webb, (555) 010-0163',
    exampleDraft: {
      fields: {
        'Matter type': 'Civil defense: contractor suing for an unpaid balance of $18,500',
        'Their side': 'Defendant, with spouse',
        'Names for conflict check': 'Marcus Webb, spouse (name not stated), Brightline Builders LLC',
        'Dates to flag': 'Served the day before this message. The {approver} sets the response deadline.',
        'Next step': 'Run conflict check today, then the {approver} calls back'
      },
      reply: 'Hello Marcus, thank you for contacting us. Because you have been served with papers, we are treating this as time sensitive. Before we discuss your case, we run a standard conflict check. Please reply with your wife\'s full name and anyone else involved, but do not send documents or details yet. Our office will call you once the check is done. This message is not legal advice and does not create an attorney-client relationship. {company}'
    },
    measure: 'time from new inquiry to approved reply, and staff minutes per inquiry',
    next: ['Court notices into calendar holds for attorney check', 'Discovery request checklists and client letters', 'Monthly billing narratives tidied for review']
  }
]
```

Note for the Data agent: `replyTo` renders as "Reply to the person who wrote". If that reads long, 'sender' also works.
