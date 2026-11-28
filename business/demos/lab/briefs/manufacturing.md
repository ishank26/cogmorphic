# Manufacturing quick win: deployment brief

1. **Buyer:** At a 20-50 person machine shop the owner or president signs; the quality manager champions it and approves. The two things they care about most: staying an approved supplier (on-time delivery and no quality escapes on customer scorecards), and keeping scarce skilled quality people on inspection rather than paperwork. Audit readiness under ISO 9001, or AS9100 for aerospace work, is close behind (which one applies to this lead is a guess).

2. **The quick win:** Customer POs into contract review checklists and buyer replies. Every new order must be checked before the job is released: part, revision, quantity, date, and the quality clauses (certs, first article, special processes) that the PO flows down. The PO arrives as text, the output is a checklist plus a short question or acknowledgment to the buyer, nothing is promised, and the quality manager approves. A miss found here costs an email; a miss found at final inspection or at the customer's dock costs a job. Rejected: (a) cert and C of C request replies: frequent, but the value is finding and signing the right certs, which needs the document store and a quality attestation the agent must never make; the text alone is thin. (b) CMM results into inspection reports: strong later, but it needs CMM exports and controlled drawing data, so it fails "no integration in week one".

3. **Today:** POs land as PDFs in a sales or orders inbox. Someone enters the order into the ERP; the quality manager reads the PO for quality clauses (often codes that point to the customer's quality manual), checks the revision against the drawing on file, decides on first article, certs and outside-process flow-down, and emails the buyer about anything unclear. The record is often an initialed PO or a paper checklist. The time goes to reading dense clause blocks and comparing revisions; the cost of a miss shows up weeks later.

4. **Deploy in week one:**
   - **Intake:** the client adds one mail rule copying emails with PDF attachments from an allow-list of customer domains to a new mailbox they own (for example po-review@). Customers with export-controlled or CUI work are left off the list entirely. Drawings are not forwarded; only the PO.
   - **Reading:** the agent reads the PO's text. A scanned PDF it cannot read cleanly gets a "could not read, review by hand" row, never a guess.
   - **Output:** one row per PO line in a shared "Contract review" sheet (PO and part, revision, due date, requirements, before release, link) and a reply draft to the buyer in the original thread, saved as a draft.
   - **Approval:** the quality manager checks the row against the PO, edits, enters their initials and date in a "Reviewed by" column, and sends the reply. Whether that row can serve as the QMS contract review record is the shop's call (guess: yes, with their form number added).
   - **Access:** read on one mailbox, create-draft in the orders thread, edit on one sheet.
   - **Not touched:** ERP, drawing vault, CMM software, quality system, supplier POs, pricing, the customer portal.
   - **Days:** Day 1, kickoff with the quality manager: collect 15 recent POs from non-controlled customers, the shop's contract review checklist and any clause cheat-sheet they keep. Client IT creates the mailbox and sheet. Day 2, we run the 15 and the quality manager grades each against what they actually found. Day 3, shadow on live POs. Days 4-5, the quality manager works from the drafts. A customer clause glossary can be added in week two.
   - **Data:** PO text only, no drawings, no technical data. Model used under business API terms that do not train on client data. If a controlled PO slips through, the agent stops on markings like ITAR, EAR or CUI and flags it without drafting.
   - **Bad draft:** reject with a reason in the sheet; we review rejections daily in week one.

5. **Proof moment:** The quality manager pastes the text of a real PO from a demanding customer, ideally one with a long clause list or an odd revision or date. A great draft catches every clause code and spec, flags a revision mismatch, notes first article and cert needs, writes "Not stated" for what the PO leaves out, and drafts a buyer email that confirms receipt and asks the one right question without accepting the date or price.

6. **Risks and guardrails:** Accepting a PO is a contract: the agent never accepts or confirms price, quantity, date, revision or terms. It never signs or says a cert, C of C or first article is ready or approved. It lists clause codes but does not interpret clause text the PO does not include. Export-controlled data never enters the agent.

7. **Pilot:** Two weeks, new POs only. Before: the quality manager tallies minutes per PO review for a few days; from the mailbox we read PO received against acknowledgment sent for the last month; they recall order questions that surfaced after release. During: the same, plus a "caught" column in the sheet for issues found at review. Success in their words: "Every PO gets read the day it lands, and nothing surprises us at final inspection."

8. **Land and expand:**
   - Cert and C of C request replies
   - CMM results into inspection reports
   - First-article packages for review

9. **Variants:** None. Hydracore is the only manufacturing lead and precision machining fits contract review directly. One variant, no `requires`.

10. **Draft quickWins entry:**

```js
quickWins: [
  {
    job: 'Customer POs into contract review checklists and buyer replies',
    unit: 'PO', units: 'POs',
    pasteLabel: 'Paste a customer purchase order or PO email',
    pasteHint: 'PO text only, no drawings. Leave out anything marked ITAR, export controlled or CUI, and remove prices if you like.',
    task: 'Review the purchase order as a quality manager would at contract review: list what the order requires and draft a short reply to the buyer that confirms receipt and asks about anything unclear.',
    rules: [
      'Never accept or confirm a price, quantity, due date or revision on behalf of {company}.',
      'List every spec, quality clause, certification and inspection requirement the PO names, with its code; do not explain clause text the PO does not include.',
      'Flag any mismatch in part number, revision, quantity or dates within the message.',
      'Never say a part, certificate or first article is ready, signed or approved.'
    ],
    draftKind: 'Contract review',
    fields: ['PO and part', 'Revision', 'Due date', 'Requirements', 'Before release'],
    replyTo: 'buyer',
    example: 'PO 70418 from Fictional Fluidics, buyer Kevin Marsh. Line 1: 120 pcs manifold block MB-310 Rev C, 6061-T6 aluminum, clear anodize per MIL-A-8625 Type II, due Feb 6. Quality clauses Q2 (C of C), Q7 (material certs with shipment) and Q11 (AS9102 first article on first shipment) apply. Drawing attached: MB-310_RevB.pdf.',
    exampleDraft: {
      fields: {
        'PO and part': 'PO 70418, MB-310 manifold block, 120 pcs',
        Revision: 'PO line says Rev C; attached drawing file is Rev B. Confirm before release.',
        'Due date': 'Feb 6 requested; not yet confirmed',
        Requirements: '6061-T6; clear anodize per MIL-A-8625 Type II; C of C (Q2); material certs with shipment (Q7); AS9102 first article on first shipment (Q11)',
        'Before release': 'Resolve revision; plan the AS9102 first article; line up material and anodize certs'
      },
      reply: 'Hi Kevin, thank you for PO 70418 for 120 MB-310 manifold blocks. Before we confirm, one question: the PO line lists Rev C, but the attached drawing is Rev B. Please send the Rev C drawing or confirm which revision applies. We have noted clauses Q2, Q7 and Q11, including the first article on the first shipment, and will confirm the ship date once the revision is settled. The {company} team'
    },
    measure: 'minutes per PO review and order questions caught before release',
    next: ['Cert and C of C request replies', 'CMM results into inspection reports', 'First-article packages for review']
  }
]
```
