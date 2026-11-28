# Medical billing quick win: deployment brief

Keep the whole brief to about one page. Plain words, no em dashes. Mark guesses as guesses.

1. **Buyer:** the owner or president of the billing company, often a former biller who still works the hardest accounts. Cares most about (a) client practices getting paid, which means denials worked before payer appeal windows close, and (b) never putting a client practice's patient data at risk, because one HIPAA problem can cost every client.

2. **The quick win:** payer denials into a short denial review plus a draft appeal letter. Denials come in daily, each needs a reason read, an action chosen and often a letter written from a template, and they quietly age past appeal limits when staff are busy. Text in, text out. The billing manager approves every letter, and the biller still submits through the payer's own channel.
   Rejected: *payment posting* (needs remittance files and practice system access, and moves money: not week one). *Patient balance replies* (needs an account lookup to be right, and goes to patients, so PHI leaves the building in consumer channels).

3. **Today:** a biller pulls denials from the clearinghouse denial report, remittance remarks or scanned payer letters, looks up the reason code, decides between appeal, corrected claim, billing the patient or a write-off, then copies an old appeal letter and edits it. Time goes into decoding reason codes, rewriting letters, gathering attachments, and denials waiting in a pile until someone has a free afternoon.

4. **Deploy in week one:**
   - *Gate before any real PHI:* a subcontractor business associate agreement between the billing company and Cogmorphic, a BAA covering the AI vendor with zero data retention, and confirmation that their email or file storage is already under a BAA. Until all three are signed, the pilot runs in placeholder mode: the biller replaces identifiers with [brackets] before forwarding, and the agent drafts letters with brackets the biller fills in.
   - *Arrives:* denial text the biller already sees (denial report lines, remittance remark text, scanned letters).
   - *Agent gets it:* the biller forwards it to a dedicated mailbox, denials-agent@ their domain, inside their existing Microsoft 365 or Google Workspace.
   - *Draft lands:* one email back to the billing manager with the denial review on top and the letter below.
   - *Approve:* the manager approves or edits; the biller pastes the letter onto the practice letterhead, attaches records and submits through the portal, fax or mail as today, then notes it in the practice system.
   - *Access:* the agent mailbox only. *Not touched:* practice systems, clearinghouse, payer portals, remittance posting, patient contact. The agent never submits anything.
   - *Day 1:* pick one or two client practices and their top payers; collect current appeal templates and payer appeal addresses; agree the action list (appeal, corrected claim, bill patient, write-off needs manager). *Day 2:* mailbox, forwarding, test on 10 past denials with identifiers removed. *Day 3:* shadow mode, billers work as normal. *Days 4-5:* live with manager approval of every letter.
   - *Data:* minimum necessary only; nothing stored outside their tenant beyond what the BAA allows; audit trail of every draft and decision.
   - *Bad draft:* the manager rejects it and the biller works the denial the old way. Any denial close to its appeal limit (threshold set by the manager) skips the agent so the pilot can never cost a filing window.

5. **Proof moment:** the owner types or pastes de-identified denial text: reason code, remark, procedure code, payer type and a one-line note of what happened. Best types: their most frequent denial, plus one missing-modifier denial, where a great draft says "corrected claim, not an appeal". A great draft reads the reason code correctly, picks the right action, states the appeal window as the notice gives it, lists attachments, invents nothing, and keeps patient details as [brackets]. The live demo page runs through a claude.ai account that no BAA covers, so it must only ever see de-identified text.

6. **Risks and guardrails:** HIPAA applies: no real PHI before the BAAs, de-identified text only on the demo page, minimum necessary always. The agent never adds or changes a procedure code, diagnosis code or modifier (a certified coder decides), never invents clinical facts, authorization numbers or records (an appeal stating false facts is a false claims risk), never submits to a payer, never contacts patients, never decides a write-off or patient balance.

7. **Pilot:** two weeks, denials for one or two practices. Before: billers log each denial's received date, the date its appeal or correction was ready, and minutes spent, for one week. During: same log, plus approved as is, edited or rejected. Success in their words: "My billers stopped writing appeals from scratch, and nothing went out that I had not checked."

8. **Land and expand:** (1) Payer letters sorted and logged by deadline. (2) Underpayments flagged against fee schedules. (3) Patient balance questions drafted for the portal.

9. **Variants:** one lead (A Step Above, podiatry billing), no feature flags, one variant with no `requires`. The example is podiatry; the rules are not, so the variant holds if more billing leads are added.

10. **Draft quickWins entry:**

```js
quickWins: [
  {
    job: 'Payer denials into appeal letters and next steps',
    unit: 'denial', units: 'denials',
    pasteLabel: 'Paste a de-identified denial',
    pasteHint: 'Never paste patient details: no names, birth dates, member IDs, claim numbers or service dates. Reason codes, procedure codes and a short note are enough.',
    task: 'Turn the denial into a short review for the {approver} and a draft appeal letter to the payer, with [brackets] wherever a patient or claim detail belongs.',
    rules: [
      'Never invent clinical facts, authorization numbers, records or dates. Put [brackets] where the biller must add a detail.',
      'Never add or change a procedure code, diagnosis code or modifier. Flag coding questions for a certified coder.',
      'If the denial points to a fixable claim error, such as a missing modifier or wrong member ID, recommend a corrected claim instead of an appeal.',
      'Keep patient details out of the letter. Use [bracketed] placeholders for the minimum the payer needs.'
    ],
    draftKind: 'Denial review',
    fields: ['Denial reason', 'Recommended action', 'Appeal deadline', 'Attach before sending'],
    replyTo: 'payer',
    example: 'De-identified denial from Sample Health Plan. Patient, member ID, claim number and service date removed. Line 1: CPT 28285, hammertoe correction, billed $1,240.00. Denied, CARC 197: precertification or authorization absent. Biller note: authorization was obtained by phone before surgery, reference is in the account notes. Appeals must be received within 180 days of this notice.',
    exampleDraft: {
      fields: {
        'Denial reason': 'CARC 197: authorization absent',
        'Recommended action': 'Appeal. Biller note says authorization was obtained before surgery.',
        'Appeal deadline': '180 days from the notice date',
        'Attach before sending': 'Authorization reference from account notes, operative report, copy of this denial'
      },
      reply: 'To the Sample Health Plan appeals unit: On behalf of [practice name], we request reconsideration of claim [claim number] for CPT 28285, denied with CARC 197 for absent authorization. Our records show authorization was obtained by phone before the service, reference [authorization reference]. The authorization record and operative report are attached. Please reprocess the claim. Thank you, [biller name], {company}, billing for [practice name]'
    },
    measure: 'staff minutes per denial and days from denial to appeal ready',
    next: ['Payer letters sorted and logged by deadline', 'Underpayments flagged against fee schedules', 'Patient balance questions drafted for the portal']
  }
]
```
