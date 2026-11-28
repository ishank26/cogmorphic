export default {
  id: 'manufacturing',
  agent: 'Quality paperwork agent',
  promise: 'Turns inspection results, customer requests and purchase orders into reports and paperwork. The {approver} approves each one.',
  defaults: {
    approver: 'quality manager',
    systems: {
      core: 'ERP system',
      quality: 'Quality system',
      cmm: 'CMM software',
      docs: 'Document storage'
    }
  },
  quickWins: [
    {
      job: 'Customer POs into contract review checklists and buyer replies',
      unit: 'PO',
      units: 'POs',
      pasteLabel: 'Paste a customer purchase order or PO email',
      pasteHint: 'PO text only, no drawings. Remove customer and buyer names and prices, and leave out anything marked ITAR, export controlled or CUI.',
      task: 'Review the purchase order as a quality manager would at contract review: list what the order requires and draft a short reply to the buyer that confirms receipt and asks about anything unclear.',
      rules: [
        'Never accept or confirm a price, quantity, due date or revision on behalf of {company}.',
        'Under Requirements, name each spec, quality clause, certification and inspection requirement by its code or a short name only (for example Q7 material certs); do not explain clause text the PO does not include.',
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
          Requirements: '6061-T6; clear anodize MIL-A-8625 Type II; Q2 C of C; Q7 material certs; Q11 AS9102 first article on first shipment',
          'Before release': 'Resolve revision; plan the AS9102 first article; line up material and anodize certs'
        },
        reply: 'Hi Kevin, thank you for PO 70418 for 120 MB-310 manifold blocks. Before we confirm, one question: the PO line lists Rev C, but the attached drawing is Rev B. Please send the Rev C drawing or confirm which revision applies. We have noted clauses Q2, Q7 and Q11, including the first article on the first shipment. We will reply on the ship date after the revision is settled. The {company} team'
      },
      measure: 'minutes per PO review and order questions caught before release',
      next: ['Cert and C of C request replies', 'CMM results into inspection reports', 'First-article packages for review']
    }
  ],
  items: [
    {
      id: 'cmm-bracket',
      channel: 'system',
      from: 'CMM results',
      receivedAt: '7:40 AM',
      subject: 'Part BRK-220 Rev B: 1 feature out of tolerance',
      body: 'Overnight CMM run on 5 brackets from job 6031. Hole spacing on part 3 reads 3.53 in against 3.50 +/- 0.01 in.',
      steps: [
        { system: '{cmm}', text: 'Read the CMM export: 5 parts, 12 features each.' },
        { system: '{docs}', text: 'Pulled drawing BRK-220 Rev B and its tolerance table.' },
        { system: '{quality}', text: 'Found 59 of 60 features in tolerance. Part 3 hole spacing 0.02 in over the limit.' },
        { system: '{quality}', text: 'Opened nonconformance NCR-0418 and put part 3 on hold.' },
        { system: '{quality}', text: 'Drafted the inspection report.' }
      ],
      draft: {
        kind: 'Inspection report',
        to: '{approver}',
        fields: [['Part', 'BRK-220 Rev B'], ['Job', '6031'], ['Result', '59 of 60 features pass'], ['Hold', 'Part 3, NCR-0418']],
        body: 'CMM inspection of 5 brackets from job 6031: 59 of 60 features in tolerance. Part 3 hole spacing measured 3.53 in against 3.50 +/- 0.01 in. Recommend checking the drill fixture before the next run.'
      },
      risk: 'Quality: part 3 stays on hold until the {approver} decides.'
    },
    {
      id: 'fai-housing',
      channel: 'form',
      from: 'First-article form: part HSG-118 Rev A',
      receivedAt: '8:15 AM',
      subject: 'First article complete: pump housing HSG-118',
      body: 'Inspector finished the first article for a new customer part. All 34 balloon dimensions measured. Material cert and finish cert scanned.',
      steps: [
        { system: '{docs}', text: 'Matched 34 balloon numbers on drawing HSG-118 Rev A to the measurements.' },
        { system: '{quality}', text: 'All 34 dimensions in tolerance. Recorded the gauge used for each.' },
        { system: '{docs}', text: 'Attached material cert MC-7721 and anodize cert AN-302 (sample).' },
        { system: '{quality}', text: 'Built the first-article package: part, material and characteristic forms.' }
      ],
      draft: {
        kind: 'First-article package',
        to: 'Customer quality, Sample Pump Co.',
        fields: [['Part', 'HSG-118 Rev A'], ['Dimensions', '34 of 34 pass'], ['Certs', 'Material, anodize']],
        body: 'First-article package for HSG-118 Rev A: all 34 characteristics in tolerance, with material and finish certs attached. Please confirm approval so we can release the production run. The {company} quality team'
      },
      risk: 'Goes outside the firm: the {approver} signs the package before it is sent.'
    },
    {
      id: 'cert-request',
      channel: 'email',
      from: 'Tara Quinn, Sample Valve Corp.',
      receivedAt: '8:50 AM',
      subject: 'Certs for PO 45120',
      body: 'Our receiving inspection needs the material certs and a certificate of conformance for the 200 shafts that shipped Friday on PO 45120.',
      steps: [
        { system: '{core}', text: 'Found PO 45120, job 6012, 200 shafts SFT-40 shipped Friday.' },
        { system: '{docs}', text: 'Found material cert MC-7698 for the bar stock lot used.' },
        { system: '{quality}', text: 'Confirmed final inspection passed for the lot.' },
        { system: '{docs}', text: 'Filled the certificate of conformance template, unsigned.' }
      ],
      draft: {
        kind: 'Reply email',
        to: 'Tara Quinn',
        fields: [['PO', '45120'], ['Part', 'SFT-40, qty 200'], ['Attached', 'Material cert, C of C']],
        body: 'Hi Tara, attached are the material cert and the signed certificate of conformance for the 200 SFT-40 shafts on PO 45120. Let us know if receiving needs anything else. The {company} quality team'
      },
      risk: 'Signed document: the {approver} signs the certificate of conformance before it goes out.'
    },
    {
      id: 'po-traveler',
      channel: 'email',
      from: 'Purchasing, Sample Pump Co.',
      receivedAt: '9:20 AM',
      subject: 'PO 88310: 150 pcs HSG-118',
      body: 'New purchase order for 150 pump housings HSG-118, due Jan 20. Drawing revision listed on the PO: Rev B.',
      steps: [
        { system: '{core}', text: 'Logged PO 88310: 150 pcs, due Jan 20, price matches quote Q-2290.' },
        { system: '{docs}', text: 'Compared drawing revisions. Our approved first article is Rev A; the PO says Rev B.' },
        { system: '{core}', text: 'Built the job traveler, held until the revision is confirmed.' },
        { system: '{core}', text: 'Drafted an order acknowledgment that asks about the revision.' }
      ],
      draft: {
        kind: 'Order acknowledgment',
        to: 'Purchasing, Sample Pump Co.',
        fields: [['PO', '88310'], ['Qty', '150'], ['Due', 'Jan 20'], ['Open question', 'Rev A or Rev B']],
        body: 'Thank you for PO 88310 for 150 HSG-118 housings due Jan 20. The PO lists Rev B, but our approved first article is Rev A. Please send the Rev B drawing or confirm Rev A so we can release the job. The {company} team'
      },
      risk: 'Customer commitment: the {approver} confirms the revision before the traveler is released.'
    },
    {
      id: 'gauge-due',
      channel: 'system',
      from: 'Calibration tracker',
      receivedAt: '9:45 AM',
      subject: '3 gauges due for calibration in 14 days',
      body: 'Bore gauge BG-07, micrometer MC-22 and height gauge HG-03 are due for calibration Dec 9.',
      steps: [
        { system: '{quality}', text: 'Found 3 gauges due Dec 9 and the jobs that use them.' },
        { system: '{core}', text: 'Checked the schedule. Dec 4 has the fewest jobs needing these gauges.' },
        { system: '{docs}', text: 'Drafted a pickup request to the outside calibration lab (sample).' }
      ],
      draft: {
        kind: 'Calendar hold',
        to: 'Sample Calibration Lab',
        fields: [['Gauges', 'BG-07, MC-22, HG-03'], ['Pickup', 'Dec 4, 8 AM'], ['Due', 'Dec 9']],
        body: 'Please pick up 3 gauges for calibration on Dec 4 at 8 AM: bore gauge BG-07, micrometer MC-22 and height gauge HG-03. We need them back by Dec 9. The {company} quality team'
      }
    }
  ]
};
