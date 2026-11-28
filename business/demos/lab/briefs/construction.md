# Construction and engineering quick win: deployment brief

1. **Buyer:** Contractors (`contractor`): the owner or president signs, the PM or QC manager approves. They care most about getting paid for changes and delays, which depends on the daily record, and keeping supers and foremen building instead of typing. Engineering and inspection firms (`engineering`): a principal or operations lead signs, the project manager or engineer approves. They care most about billable time (report write-up is mostly unbilled evenings) and the quality of anything that goes out under their name.

2. **The quick win:** Two variants, same shape: rough field notes in, a formatted report plus a short client note out.
   - Contractors: **foreman texts into daily field reports and client updates.** Every job, every day; foremen already text the PM; the report is the record that backs change orders and delay claims; mostly internal, so low risk.
   - Engineering: **field inspection notes into reports ready for signature.** Each site visit makes one; inspectors write them after hours; the engineer reviews and signs anyway, so the human check already exists.
   - Rejected: (a) certified payroll packets: high pain on public jobs, but a signed legal filing built from payroll data, so not week one. (b) RFIs and RFI responses: valuable but lower volume, need drawings the agent cannot see in week one, and an RFI response is engineering judgment. Proposals lost too: fees are money and commitment.

3. **Today:** Contractors: the foreman sends scattered texts, photos and a call; the PM or office rebuilds crew, hours, weather, work done and delays into the firm's report form at day's end, or days later from memory. Gaps (hours, delay causes) are where claims are lost. Engineering: the inspector carries notes, readings and photos back, then types the report into the firm's template, checking each number; reports queue up behind the next day's site visits, and the PM edits before signing.

4. **Deploy in week one:**
   - **Intake:** one new habit: at day's end the foreman (or inspector, after each visit) emails or dictates the notes, photos attached, to a new mailbox the client owns (for example dailies@ or reports@). Some phone systems can forward texts to email; we check on day 1 (guess).
   - **Output:** the agent fills the firm's own report template (Word or Google Doc) and saves it in the job folder as DRAFT, adds a row to a shared "Reports" sheet (job, date, link, decision), and puts the client note as a draft in the approver's mailbox. Photos are listed with the sender's captions; in week one the agent does not describe photo contents.
   - **Approval:** the approver opens the draft, edits, saves it as final (engineering: signs and seals as usual), sends the client note and sets the decision in the sheet.
   - **Access:** read on one mailbox, write on one folder and one sheet, create-draft on the approver's mailbox.
   - **Not touched:** Procore, Deltek or any project system, scheduling, payroll, accounting, drawings, other mailboxes. Report numbers and distribution (owner, GC, building official) stay with the approver.
   - **Days:** Day 1, kickoff: pick one or two active jobs, collect 10 past reports with their source notes, the template and who receives what. Day 2, we tune on those; the approver grades them. Day 3, shadow: the agent drafts, the old process continues. Days 4-5, the approver works from the drafts.
   - **Data:** job notes only. No worker SSNs or pay rates. A firm with federal or controlled work pilots on a job with no controlled data, or waits until its security rules are met. Model used under business API terms that do not train on client data.
   - **Bad draft:** reject in the sheet with a reason; we review daily in week one. Nothing leaves without a person.

5. **Proof moment:** The approver pastes yesterday's real foreman texts or an inspector's raw notes, ideally ones with a delay or a deviation in them. A great draft keeps every number exactly, writes "Not stated" for missing hours or spec limits instead of guessing, records the delay or deviation with its cause and whether it was fixed, and gives the client a calm, factual note without blame.

6. **Risks and guardrails:** Never say work is complete, inspected, passed or conforming unless the notes say so. Never add spec values, code sections or results. Never sign, seal or imply a report is signed. Injuries, near misses and safety issues stay out of the client note and go to the approver. No cost or schedule promises.

7. **Pilot:** Two weeks, one job type. Before: the approver tallies minutes per report for three days; we read from the folder or email when past reports were sent against the work date. During: the same, plus the sheet's decision column. Success in their words: "The report is waiting for me in the morning and I only fix a line or two." "Every day on the job has a report."

8. **Land and expand:**
   - Contractors: RFIs drafted from field questions; Submittal transmittals and log updates; Certified payroll packets for signature
   - Engineering: Inspection requests logged and confirmed; Proposal drafts from client requests; RFI and submittal status updates

9. **Variants:** `engineering` (Distinct Engineering, French & Parrello) gets the inspection report win; `contractor` (Veterans Contracting, Benaka, Integrity Ironworks) gets the daily report win. Engineering is listed first. Every construction lead has exactly one flag, so no default is needed. Note: Integrity Ironworks' focus line stresses submittals and RFIs; daily reports still fit a steel erector, and RFIs are its first expand step.

10. **Draft quickWins entry:**

```js
quickWins: [
  {
    requires: 'engineering',
    job: 'Field inspection notes into reports ready for signature',
    unit: 'report', units: 'reports',
    pasteLabel: 'Paste an inspector\'s field notes from one site visit',
    pasteHint: 'Typed or dictated notes. Leave out client names and anything marked controlled.',
    task: 'Turn the field notes into a draft inspection report and a short cover note to the client.',
    rules: [
      'Report only what the notes say was observed or tested; never add spec limits, code sections or results that are not in the notes.',
      'Never write that work passes, conforms or is approved unless the notes say so, and never imply the report is signed or sealed.',
      'List every deviation, whether it was corrected before work went on, and every open item such as pending test results.',
      'Keep the cover note to facts in the report: no engineering opinion and no schedule promises.'
    ],
    draftKind: 'Inspection report',
    fields: ['Project and date', 'Work observed', 'Tests', 'Deviations', 'Open items'],
    replyTo: 'client',
    example: 'Harbor Rd parking deck, level 2 slab, Nov 24. Watched placement 7:10 to 11:30, about 95 cy, 4000 psi mix per ticket. Slump 4.5 in, air 6.2%, concrete 61 F, cast 2 sets of 4 cylinders. Chairs missing at bay D3, contractor added them before the pour; truck 7 sent back at 8 in slump.',
    exampleDraft: {
      fields: {
        'Project and date': 'Harbor Rd parking deck, level 2 slab, Nov 24',
        'Work observed': 'Concrete placement 7:10 to 11:30 AM, about 95 cy, 4000 psi mix per delivery ticket',
        Tests: 'Slump 4.5 in, air 6.2%, concrete temp 61 F; 2 sets of 4 cylinders cast',
        Deviations: 'Bar chairs missing at bay D3, added before placement. Truck 7 rejected at 8 in slump.',
        'Open items': 'Cylinder break results pending. Spec limits for slump and air not stated in the notes.'
      },
      reply: 'Hello, attached is our field report for the level 2 slab placement at the Harbor Rd parking deck on Nov 24. Slump, air and concrete temperature were recorded, and two sets of cylinders were cast; break results will follow. Missing bar chairs at bay D3 were added before placement, and one truck was rejected for high slump. Please let us know if you have questions. The {company} team'
    },
    measure: 'minutes of write-up per report and days from site visit to report sent',
    next: ['Inspection requests logged and confirmed', 'Proposal drafts from client requests', 'RFI and submittal status updates']
  },
  {
    requires: 'contractor',
    job: 'Foreman texts into daily field reports and client updates',
    unit: 'report', units: 'reports',
    pasteLabel: 'Paste a foreman\'s end-of-day texts for one job',
    pasteHint: 'Texts or a dictated note from one day. Leave out worker names and anything marked controlled.',
    task: 'Turn the notes into a daily field report and a short daily update to the client.',
    rules: [
      'Record crew, hours, weather, work done and delays only as stated; write Not stated for anything missing.',
      'Log every delay with the cause the notes give, plainly, with no blame and no guesses about cost or schedule.',
      'Never say work is complete, inspected or accepted unless the notes say so.',
      'Keep any injury, near miss or safety issue out of the client update and flag it for the {approver} in the report.'
    ],
    draftKind: 'Daily field report',
    fields: ['Job and date', 'Crew and hours', 'Work done', 'Delays and issues', 'Tomorrow'],
    replyTo: 'client',
    example: 'Birch Lane warehouse, Monday. Crew of 4, set 6 of 10 columns on line C. Crane down 1:30 to 2:15 for a hydraulic leak, operator fixed it. Anchor bolts at C-7 are off about half an inch so we did not set it, need the PM to call the engineer; tomorrow finish line C and start beams if C-7 is sorted.',
    exampleDraft: {
      fields: {
        'Job and date': 'Birch Lane warehouse, Monday',
        'Crew and hours': 'Crew of 4; hours not stated',
        'Work done': 'Set 6 of 10 columns on line C',
        'Delays and issues': 'Crane down 1:30 to 2:15 PM, hydraulic leak, fixed by operator. Anchor bolts at C-7 off about 1/2 in; column not set; engineer input needed.',
        Tomorrow: 'Finish line C; start beams if C-7 is resolved'
      },
      reply: 'Hello, here is Monday\'s update for the Birch Lane warehouse. A crew of 4 set 6 of the 10 columns on line C. The crane was down from 1:30 to 2:15 PM for a repair. The anchor bolts at C-7 are about half an inch off, so we held that column and are raising it with the engineer. Plan for tomorrow: finish line C and start beams once C-7 is resolved. The {company} team'
    },
    measure: 'minutes per daily report and reports sent the same day',
    next: ['RFIs drafted from field questions', 'Submittal transmittals and log updates', 'Certified payroll packets for signature']
  }
]
```
