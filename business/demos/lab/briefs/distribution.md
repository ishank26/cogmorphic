# Distribution quick win: deployment brief

Lead: one industrial fastener distributor (Albany County Fasteners). The brief is written for a fastener and MRO distributor; a different kind of distributor would need new rules and a new example.

1. **Buyer:** the owner or president, often with a sales manager in the room. Cares most about (a) quote speed, since buyers send the same RFQ to several distributors and the first clean quote often wins, and (b) accuracy, since a wrong grade, thread or finish means a return, a line-down customer and lost trust.

2. **The quick win:** RFQ emails and web quote forms become clean quote lines in standard fastener notation, plus a reply that confirms the specs and asks about anything unclear. Inside sales then prices the lines in the ERP as usual. Why: RFQs arrive daily as free text ("1/2 x 2 hex bolts gr5 zinc, matching nuts"), reading and normalizing them is skilled, slow work, missing specs are the main cause of rework, and the agent never touches price or stock.
   Rejected: (a) order status and tracking replies. A frequent ask, but the answer lives in the ERP and carrier sites, not in the message, so it needs system access first. (b) Customer POs into sales order lines. Same parsing skill, but it commits an order and needs the customer's part number cross-reference; it is the first expand.

3. **Today:** an inside sales rep or the customer service manager opens the RFQ, works out what each line means (bolt or cap screw, coarse or fine thread, which grade, which finish), looks up or guesses missing specs, emails the buyer with questions or quotes on an assumption, then keys the lines into the ERP quote screen and prices them. Time goes to decoding loose descriptions, the back-and-forth, and fixing quotes built on a wrong assumption. Guess: messy RFQs from smaller shops take far longer than clean ones from repeat OEM buyers.

4. **Deploy in week one:**
   - Sources: the quotes@ or sales@ shared inbox and the website quote form email. EDI, punchout and phone orders stay as they are.
   - Access: a server-side forwarding rule in Microsoft 365 or Google Workspace copies RFQ mail (by form sender, or subject words like RFQ and quote) to a dedicated pilot mailbox. The original stays in the shared inbox, so nothing is lost if the agent stops. Spreadsheet RFQs are read as text; scanned drawings are flagged, not guessed.
   - Output: a draft card emailed to the rep within a minute: quote lines in a copy-ready list, specs to confirm, then the reply. Guess: many ERPs accept pasted lines into quote entry; if theirs does not, the rep keys from the list. The pilot mailbox may send only to internal addresses, enforced by a mail rule.
   - Approve: the customer service manager or rep checks the lines, prices them in the ERP, and sends either the spec questions or the finished quote from their own mailbox. Then tags the card Used, Edited or Wrong.
   - Not touched: ERP, price levels, stock, purchasing, carrier accounts, customer pricing history.
   - Day 1: kickoff, collect 20 to 30 past RFQs with the quotes that went out, write house rules (default notation, house terms such as how they treat "hex bolt", cert policy, sign-off). Day 2: mailbox and rules, back-test, the manager grades lines against what was actually quoted. Day 3: shadow mode. Days 4 and 5: reps work from drafts. Daily 15-minute check-in.
   - Privacy: customer names and buying patterns are commercial secrets; no price data enters the agent. Business API terms that do not train on inputs. Pilot mailbox deleted at the end unless they keep it.
   - Bad draft: ignored, worked from the original, tagged Wrong, rule fixed the same day.

5. **Proof moment:** the owner pastes a real, messy RFQ from this week. A great draft writes every line in standard notation (quantity, type, diameter-thread x length, grade, finish), never silently fills in a thread pitch or washer type, catches "matching nuts" as an assumption to confirm, spots a cert requirement, and asks the buyer all questions in one short email. The owner should see a rep's judgment, not a parser.

6. **Risks and guardrails:** never give prices, stock or lead times. Never substitute grade, material, finish or head style; ask. Never assume thread pitch. Flag certs, country of origin, DFARS and RoHS requests for the manager. Copy customer part numbers exactly. No promises on delivery.

7. **Pilot:** two weeks, one job. Before: the manager times 10 RFQs from open to quote lines keyed, and counts quotes revised because of a spec question, from mailbox history. During: the same timing and count on drafted RFQs, plus Used, Edited, Wrong. Success in their words: "The lines are ready when I open it" and "We ask the right question before we quote, not after."

8. **Land and expand:** Customer POs into ready sales order lines. Order status and tracking replies. Backorder notices with options to approve.

9. **Variants:** none. One lead, one variant, no `requires`. Note for the Data agent: parseDraft cuts field values to 160 characters, so `Lines` must stay short; the reply restates nothing the fields already hold.

10. **Draft quickWins entry:**
```js
quickWins: [
  {
    job: 'Quote requests into clean quote lines and spec questions',
    unit: 'quote request', units: 'quote requests',
    pasteLabel: 'Paste a customer RFQ email or web quote form',
    pasteHint: 'Remove customer pricing and anything private first.',
    task: 'Turn the request into clean quote lines for inside sales and a reply that confirms the specs and asks about anything unclear.',
    rules: [
      'Never give prices, stock levels or lead times. Inside sales adds them.',
      'Write each line as quantity, part type, diameter-thread x length, grade or material, and finish. List any line missing thread pitch, grade or finish under Specs to confirm.',
      'Never swap a grade, material, finish or head style, and never assume one. Ask the customer instead.',
      'Flag requests for certs, country of origin, DFARS or RoHS for the {approver}.'
    ],
    draftKind: 'Quote lines',
    fields: ['Customer', 'Lines', 'Specs to confirm', 'Needed by', 'Certs and terms'],
    replyTo: 'customer',
    example: 'Hi, please quote: 500 pcs 1/2 x 2 hex bolts grade 5 zinc, 500 matching nuts, 1000 flat washers 1/2, and 50 pcs 3/8 threaded rod 3 ft long. Need by Dec 10. Certs required on the bolts. Thanks, Gina Ferraro, Purchasing, Lakeside Pump Works (sample)',
    exampleDraft: {
      fields: {
        Customer: 'Gina Ferraro, Purchasing, Lakeside Pump Works',
        Lines: '500 hex bolt 1/2 x 2 Gr5 zinc; 500 hex nut 1/2; 1,000 flat washer 1/2; 50 threaded rod 3/8 x 36',
        'Specs to confirm': 'Thread pitch on all lines. Nut grade and finish. Washer type and finish. Rod material and finish',
        'Needed by': 'Dec 10',
        'Certs and terms': 'Certs required on the bolts'
      },
      reply: 'Hi Gina, thanks for the request. Before we quote, please confirm: 1) coarse thread on all parts (1/2-13 and 3/8-16), 2) grade 5 zinc nuts to match the bolts, 3) USS or SAE flat washers, and the finish, 4) material and finish for the threaded rod. We will note the bolt certs on the quote. The {company} team'
    },
    measure: 'minutes per quote request and quotes revised after a spec question',
    next: [
      'Customer POs into ready sales order lines',
      'Order status and tracking replies',
      'Backorder notices with options to approve'
    ]
  }
]
```
