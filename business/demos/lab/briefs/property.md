# Property management quick win: deployment brief

1. **Buyer:** The owner or principal of the management company signs (often also the broker of record); a senior property manager champions it and is the approver. The two things they care about most: keeping their building-owner clients happy with fast, documented response to residents, and keeping property managers from drowning in the inbox, because a buried request becomes an emergency or an owner complaint.

2. **The quick win:** Maintenance requests into work orders and tenant replies. It is the highest-volume message at every lead in this playbook, it arrives as text (email, portal notice, voicemail transcript, text), every one needs the same two outputs (a clean work order and an acknowledgment), and a miss is cheap to catch: the manager reads each draft, nothing is sent by the agent and no money moves. Rejected: (a) move-out deposit letters: real value, but NJ deposit rules carry deadlines, interest and penalties, volume is low and lumpy, and the agent needs the ledger and move-in file, so it is a second step. (b) Vendor invoice matching: only useful with the property and accounting systems connected, and it touches money, so it fails "no integration in week one".

3. **Today:** A manager or maintenance coordinator watches a shared maintenance inbox, portal notifications and a voicemail box. For each request they read it (often vague, or two issues in one), look up the unit, judge urgency, chase missing facts (access, pets, photos), key the work order into the property system and write the tenant back. The time goes to the back-and-forth for missing facts, typing the same details twice (work order and reply), and the urgency call. Requests that land after hours or over a weekend pile up for Monday.

4. **Deploy in week one:**
   - **Intake:** requests already reach a shared mailbox (for example maintenance@) from tenant email, the portal's notification emails and voicemail-to-email. The client adds one mail rule that copies those to a new mailbox they own (for example agent@ their domain). The rule leaves out leasing, applications, owner statements and bank mail.
   - **Output:** per request the agent writes (a) a reply draft inside the original thread in the shared mailbox, saved as a draft and never sent, and (b) one row in a shared spreadsheet, "Agent work orders": Priority, Unit, Issue, Access, Next step, and a link to the thread. The manager keys or pastes the row into AppFolio, BuildingLink or whatever they use. The draft holds only tenant-facing text.
   - **Approval:** the manager edits and sends the draft themselves, then sets the row's Decision column to Approved, Edited or Rejected. That column is the audit trail and the pilot data.
   - **Access:** read and create-draft on one shared mailbox, edit on one spreadsheet. Where the mail system cannot split "draft" from "send" (a guess for some Google setups), the agent simply has no send step, or drafts go by email to the manager only.
   - **Not touched:** the property system, rent ledgers, accounting, bank, vendor portals, other mailboxes, tenant files.
   - **Emergencies:** gas, smoke, fire, CO alarm, active flooding, sparks, no heat or no water get a red row and an immediate alert email to the on-call manager. They never wait in the queue.
   - **Days:** Day 1, a 45-minute kickoff: pick the mailbox, collect 20 past requests with the replies actually sent, the emergency list, on-call contact and sign-off. Client IT creates the agent mailbox and sheet. Day 2, we tune the rules on those 20 and the manager grades the drafts. Day 3, rule on, agent drafts in shadow while the manager works as usual. Days 4-5, the manager sends from the agent's drafts.
   - **Data:** tenant names, units and request text only. No SSNs, applications, screening reports or bank details (kept out by the rule). Model used under business API terms that do not train on client data. Copies in the agent mailbox deleted after 30 days (proposal).
   - **Bad draft:** the manager rejects it with a few words why in the sheet; we read every rejection daily in week one and adjust the rules.

5. **Proof moment:** The manager pastes a real, messy tenant email or voicemail transcript; best is one with two issues or a buried access detail. A great draft gets the urgency right (a drip from the unit above is urgent, a slow closet door is not), pulls unit, access and pets, writes "Not stated" instead of guessing, and replies warmly with what happens next, no time promised, asking only for the missing fact. For PRC, paste a leak alert email.

6. **Risks and guardrails:** The agent never sends, never promises a repair time, vendor, rent credit or reimbursement, never discusses fault, insurance, lease breach or legal notices (entry, late rent, violations), and never comments on who lives in the unit (fair housing). Safety messages tell the tenant to leave and call 911 for gas, smoke, fire or CO, and go to a person at once.

7. **Pilot:** Two weeks, maintenance requests only. Before: from the mailbox we read the last two weeks of requests, received time against first reply sent; the manager keeps a three-day tally of minutes per request. During: the same timestamps, the manager's minutes per request (open draft to send), and the Decision column. Success in their words: "I open the inbox and the work orders are already written; I fix a few words and send." "Nothing urgent sat over the weekend."

8. **Land and expand:**
   - Vendor scheduling and tenant follow-up
   - Vendor invoices matched to work orders
   - Move-out deposit letters for review

9. **Variants:** PRC Management (`sensor`): same job, but the example is a leak sensor alert email and one rule treats a wet reading as urgent until a person checks it. Every other property lead (Midlantic, Premier Properties, CIS, RCP, Towne & Country, G. William) uses the default; AppFolio and BuildingLink notification emails are simply what the rule copies.

10. **Draft quickWins entry:**

```js
quickWins: [
  {
    requires: 'sensor',
    job: 'Leak alerts and repair requests into work orders and tenant replies',
    unit: 'request', units: 'requests',
    pasteLabel: 'Paste a leak alert or a tenant repair request',
    pasteHint: 'Alert email, tenant email, text or voicemail note. Remove last names and phone numbers first.',
    task: 'Turn the message into a work order and a short reply to the tenant that confirms it and asks only for missing facts.',
    rules: [
      'Never promise a repair time, a vendor, a rent credit or a reimbursement.',
      'Treat a wet leak sensor reading as Urgent until a person has checked it.',
      'Mark gas, smoke, fire, carbon monoxide, active flooding, sparks, no heat or no water as Emergency; for gas, smoke, fire or carbon monoxide the reply tells the tenant to leave and call 911.',
      'Do not discuss fault, insurance, lease terms or legal notices.'
    ],
    draftKind: 'Work order',
    fields: ['Priority', 'Unit', 'Issue', 'Access', 'Next step'],
    replyTo: 'tenant',
    example: 'Leak alert: sensor LS-07B-01, location Unit 7B, kitchen sink cabinet. Water detected at 6:12 AM and again at 6:15 AM. Status: still wet.',
    exampleDraft: {
      fields: {
        Priority: 'Urgent: sensor read wet twice, not yet checked by a person',
        Unit: '7B',
        Issue: 'Water detected under the kitchen sink at 6:12 AM and 6:15 AM, still wet',
        Access: 'Not stated',
        'Next step': 'Call the tenant to check under the sink; send a plumber if water is confirmed'
      },
      reply: 'Hello, our leak sensor under the kitchen sink in Unit 7B detected water this morning. If it is safe, please look under the sink and reply or call us with what you see. If water is spreading and you can reach the shut-off valve under the sink, please close it and call our office right away. Please also tell us when someone can be home so a plumber can check it. The {company} team'
    },
    measure: 'minutes per request and time from tenant message to first reply',
    next: ['Vendor scheduling and tenant follow-up', 'Vendor invoices matched to work orders', 'Move-out deposit letters for review']
  },
  {
    job: 'Maintenance requests into work orders and tenant replies',
    unit: 'request', units: 'requests',
    pasteLabel: 'Paste a tenant maintenance request',
    pasteHint: 'Email, portal note, text or voicemail transcript. Remove last names and phone numbers first.',
    task: 'Turn the message into a work order and a short reply to the tenant that confirms it and asks only for missing facts.',
    rules: [
      'Never promise a repair time, a vendor, a rent credit or a reimbursement.',
      'Mark gas, smoke, fire, carbon monoxide, active flooding, sparks, no heat or no water as Emergency; for gas, smoke, fire or carbon monoxide the reply tells the tenant to leave and call 911.',
      'Ask for access times, pets or photos only when the message does not give them.',
      'Do not discuss fault, insurance, lease terms or legal notices.'
    ],
    draftKind: 'Work order',
    fields: ['Priority', 'Unit', 'Issue', 'Access', 'Next step'],
    replyTo: 'tenant',
    example: 'Hi, this is Priya in 12C. The brown stain on my bathroom ceiling got bigger since Sunday and now it drips when the upstairs shower runs. I work days but my roommate is home Tuesdays and Thursdays. We have a cat.',
    exampleDraft: {
      fields: {
        Priority: 'Urgent: active drip, likely from the unit above',
        Unit: '12C',
        Issue: 'Bathroom ceiling stain growing since Sunday; drips when the upstairs shower runs',
        Access: 'Roommate home Tuesdays and Thursdays; cat in the unit',
        'Next step': 'Plumber to check the 12C ceiling and the shower in the unit above'
      },
      reply: 'Hi Priya, thank you for letting us know about the bathroom ceiling in 12C. We have logged it as an urgent repair, and a plumber will likely need to check the unit above as well. Our office will contact you to set a visit, and we will plan around Tuesday or Thursday when your roommate is home. We will ask the plumber to watch for your cat. If the drip turns into a steady flow, call our office right away. The {company} team'
    },
    measure: 'minutes per request and time from tenant message to first reply',
    next: ['Vendor scheduling and tenant follow-up', 'Vendor invoices matched to work orders', 'Move-out deposit letters for review']
  }
]
```
