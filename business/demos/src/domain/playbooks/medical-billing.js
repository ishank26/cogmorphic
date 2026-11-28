export default {
  id: 'medical-billing',
  agent: 'Claims agent',
  promise: 'Posts payments, works denials and rejections, and drafts every appeal and patient note. The {approver} approves each one.',
  defaults: {
    approver: 'billing manager',
    systems: {
      core: 'Practice management system',
      clearinghouse: 'Claims clearinghouse',
      payer: 'Payer portal',
      docs: 'Document storage'
    }
  },
  // Quick win: payer denials into a denial review and a draft appeal letter. The live demo only ever
  // sees de-identified text; a real pilot starts only after every business associate agreement is signed.
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
        'Give the appeal deadline only as the denial states it, never worked out or guessed; otherwise write Not stated.'
      ],
      draftKind: 'Denial review',
      fields: ['Denial reason', 'Recommended action', 'Appeal deadline', 'Attach before sending'],
      replyTo: 'payer',
      example: 'De-identified denial from Sample Health Plan. Patient, member ID, claim number and service date removed. Line 1: CPT 28285, hammertoe correction, billed $1,240.00. Denied, CARC 197: precertification or authorization absent. Biller note: authorization was obtained by phone before surgery. Appeals must be received within 180 days of this notice.',
      exampleDraft: {
        fields: {
          'Denial reason': 'CARC 197: authorization absent',
          'Recommended action': 'Appeal, not a write-off. Biller note says authorization was obtained by phone before surgery.',
          'Appeal deadline': 'Within 180 days of the notice, as the denial states',
          'Attach before sending': 'Authorization reference (not stated in the denial), operative report, copy of this denial'
        },
        reply: 'To the Sample Health Plan appeals unit: On behalf of [practice name], we request reconsideration of claim [claim number] for CPT 28285, denied with CARC 197 for absent authorization. Our records show authorization was obtained by phone before the service, reference [authorization reference]. The authorization record and operative report are attached. Please reprocess the claim. Thank you, [biller name], {company}, billing for [practice name]'
      },
      measure: 'staff minutes per denial and days from denial to appeal ready',
      next: ['Payer letters sorted and logged by deadline', 'Underpayments flagged against fee schedules', 'Patient balance questions drafted for the portal']
    }
  ],
  items: [
    {
      id: 'era-posting',
      channel: 'system',
      from: 'Remittance file',
      receivedAt: '7:35 AM',
      subject: '38 claim payments from Sample Health Plan',
      body: 'Electronic remittance for client practice Shoreline Foot and Ankle (sample): 38 claim lines, $6,912.40 total.',
      steps: [
        { system: '{clearinghouse}', text: 'Read the remittance file: 38 claim lines, $6,912.40.' },
        { system: '{core}', text: 'Matched 35 lines to open claims at the expected amount.' },
        { system: '{core}', text: 'Flagged 3 lines paid below the fee schedule, short $212.00 in all.' },
        { system: '{core}', text: 'Held all 38 lines unposted until approved.' }
      ],
      draft: {
        kind: 'Posting batch',
        to: '{approver}',
        fields: [['Lines', '38'], ['Total paid', '$6,912.40'], ['Matched', '35'], ['Underpaid', '3, short $212.00']],
        body: 'Remittance ready to post: 35 lines match. 3 lines are underpaid against the fee schedule by $212.00 in all. Approve to post the batch and open underpayment follow-ups for the 3 lines.'
      },
      risk: 'Money: nothing posts until the {approver} approves the batch.'
    },
    {
      id: 'rejection-modifier',
      channel: 'system',
      from: 'Clearinghouse report',
      receivedAt: '8:10 AM',
      subject: 'Claim SAMPLE-CLM-0057 rejected before payer',
      body: 'Front-end rejection: procedure line 2 is missing a required modifier. Claim never reached the payer.',
      steps: [
        { system: '{clearinghouse}', text: 'Read the rejection: line 2 needs modifier code M-9 (sample).' },
        { system: '{docs}', text: 'Checked the visit note. It supports a separate procedure on line 2.' },
        { system: '{core}', text: 'Prepared a corrected claim with the modifier added.' },
        { system: '{core}', text: 'Held the corrected claim for approval. Filing window open 61 more days.' }
      ],
      draft: {
        kind: 'Corrected claim',
        to: 'Sample Health Plan (via clearinghouse)',
        fields: [['Claim', 'SAMPLE-CLM-0057'], ['Fix', 'Add modifier M-9 (sample) to line 2'], ['Filing window', '61 days left']],
        body: 'Corrected claim SAMPLE-CLM-0057: modifier M-9 (sample) added to procedure line 2, supported by the visit note. All other lines unchanged.'
      }
    },
    {
      id: 'denial-appeal',
      channel: 'email',
      from: 'Payer denial notice (sample)',
      receivedAt: '8:45 AM',
      subject: 'Claim SAMPLE-CLM-0042 denied',
      body: 'Claim SAMPLE-CLM-0042 for Shoreline Foot and Ankle (sample) denied. Reason code ZZ-17 (sample): prior authorization not on file.',
      steps: [
        { system: '{core}', text: 'Found claim SAMPLE-CLM-0042, billed $240.00, service date Oct 14.' },
        { system: '{payer}', text: 'Found prior authorization SAMPLE-PA-7781, valid Oct 1 to Dec 31.' },
        { system: '{docs}', text: 'Opened the appeal letter template.' },
        { system: '{docs}', text: 'Drafted the appeal with the authorization number attached.' }
      ],
      draft: {
        kind: 'Appeal letter',
        to: 'Sample Health Plan appeals',
        fields: [['Claim', 'SAMPLE-CLM-0042'], ['Denial code', 'ZZ-17 (sample)'], ['Authorization', 'SAMPLE-PA-7781'], ['Amount', '$240.00']],
        body: 'We request reconsideration of claim SAMPLE-CLM-0042. The denial cites no prior authorization. Authorization SAMPLE-PA-7781 was on file and valid for the Oct 14 service date. A copy is attached. Please reprocess the claim. The {company} team'
      },
      risk: 'Health data: codes here are made up. In a live setup, only the minimum patient detail goes to the payer.'
    },
    {
      id: 'eligibility-tomorrow',
      channel: 'system',
      from: 'Schedule check',
      receivedAt: '9:15 AM',
      subject: 'Tomorrow: 24 visits to verify',
      body: 'Shoreline Foot and Ankle (sample) has 24 visits on tomorrow\'s schedule. Coverage check needed before check-in.',
      steps: [
        { system: '{core}', text: 'Pulled 24 visits on tomorrow\'s schedule.' },
        { system: '{payer}', text: 'Checked coverage for each. 22 active, 1 plan ended Oct 31, 1 needs a referral.' },
        { system: '{core}', text: 'Added an alert to both visits for the front desk.' }
      ],
      draft: {
        kind: 'Front desk note',
        to: 'Shoreline Foot and Ankle front desk (sample)',
        fields: [['Visits', '24'], ['Verified', '22'], ['Need action', '2']],
        body: 'Coverage check for tomorrow: 22 visits verified. 9:30 AM visit: plan ended Oct 31, please ask for new insurance at check-in. 2:15 PM visit: referral needed before the visit.'
      }
    },
    {
      id: 'patient-balance',
      channel: 'call',
      from: 'Call summary: patient J.M. (sample)',
      receivedAt: '9:40 AM',
      subject: 'Question about a $65 bill',
      body: 'Patient asks why they got a $65.00 bill after insurance paid. Wants to know if it is correct.',
      steps: [
        { system: '{core}', text: 'Found the Sep 22 visit. Plan paid $110.00 and applied $65.00 to the deductible.' },
        { system: '{payer}', text: 'Confirmed $65.00 of the yearly deductible was still open on Sep 22.' },
        { system: '{core}', text: 'Noted a payment plan option on file for balances under $200.' }
      ],
      draft: {
        kind: 'Patient reply',
        to: 'Patient J.M. (sample, by portal message)',
        fields: [['Visit', 'Sep 22'], ['Plan paid', '$110.00'], ['Your share', '$65.00, deductible']],
        body: 'Hello, thank you for calling. Your plan paid $110.00 for your Sep 22 visit and applied $65.00 to your yearly deductible, so the $65.00 bill is correct. You can pay online or ask us to split it into smaller payments. The {company} team'
      },
      risk: 'Patient data: the reply goes only through the secure portal.'
    }
  ]
};
