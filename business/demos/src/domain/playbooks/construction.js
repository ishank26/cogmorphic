// Items with requires 'contractor' fit builders and trade contractors.
// Items with requires 'engineering' fit engineering, inspection and QC consultants.
export default {
  id: 'construction',
  agent: 'Project admin agent',
  promise: 'Turns field notes, questions and project paperwork into reports, RFIs and letters. The {approver} approves each one.',
  defaults: {
    approver: 'project manager',
    systems: {
      core: 'Project management system',
      docs: 'Document storage',
      calendar: 'Scheduling',
      payroll: 'Payroll system'
    }
  },
  quickWins: [
    {
      requires: 'engineering',
      job: 'Field inspection notes into reports ready for signature',
      unit: 'report',
      units: 'reports',
      pasteLabel: 'Paste an inspector\'s field notes from one site visit',
      pasteHint: 'Typed or dictated notes. Remove client names, site addresses and permit numbers, and anything marked controlled.',
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
        reply: 'Hello, attached is our field report for the level 2 slab placement at the Harbor Rd parking deck on Nov 24. Slump, air and concrete temperature were recorded, and two sets of cylinders were cast; break results are pending. Missing bar chairs at bay D3 were added before placement, and one truck was rejected for high slump. Please let us know if you have questions. The {company} team'
      },
      measure: 'minutes of write-up per report and days from site visit to report sent',
      next: ['Inspection requests logged and confirmed', 'Proposal drafts from client requests', 'RFI and submittal status updates']
    },
    {
      requires: 'contractor',
      job: 'Foreman texts into daily field reports and client updates',
      unit: 'report',
      units: 'reports',
      pasteLabel: 'Paste a foreman\'s end-of-day texts for one job',
      pasteHint: 'Texts or a dictated note from one day. Remove worker names, site addresses and anything marked controlled.',
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
        reply: 'Hello, here is Monday\'s update for the Birch Lane warehouse. A crew of 4 set 6 of the 10 columns on line C. The crane was down from 1:30 to 2:15 PM for a repair. The anchor bolts at C-7 are about half an inch off, so we held that column and are raising it with the engineer. Next planned: finish line C, then start beams once C-7 is resolved. The {company} team'
      },
      measure: 'minutes per daily report and reports sent the same day',
      next: ['RFIs drafted from field questions', 'Certified payroll packets for signature', 'Submittal transmittals and log updates']
    }
  ],
  items: [
    {
      id: 'field-obs-slab',
      requires: 'engineering',
      channel: 'form',
      from: 'Field inspection notes: Omar F.',
      receivedAt: '7:30 AM',
      subject: 'Slab pour inspection, Riverside office building',
      body: 'Observed the second-floor slab pour yesterday. Slump 4 in, air 6%. Cast 8 test cylinders. Checked rebar cover at 10 spots; one spot was 1.25 in against 1.5 in required and the contractor fixed it before the pour. Photos show the fixed spot and the cylinder molds.',
      steps: [
        { system: '{core}', text: 'Matched the notes to project P-2214, Riverside office building.' },
        { system: '{docs}', text: 'Pulled the concrete spec section: slump 3 to 5 in, air 5 to 7%.' },
        { system: '{core}', text: 'Compared readings to the spec. All in range; one cover issue fixed before the pour.' },
        { system: '{docs}', text: 'Filed the photos and drafted the inspection report.' },
        { system: '{calendar}', text: 'Set reminders for the 7-day and 28-day cylinder breaks.' }
      ],
      draft: {
        kind: 'Inspection report',
        to: 'Owner rep Lisa Tran',
        fields: [['Project', 'P-2214, Riverside office'], ['Slump', '4 in, in spec'], ['Air', '6%, in spec'], ['Cylinders', '8, breaks Dec 1 and Dec 22']],
        body: 'Second-floor slab pour observed Nov 24. Slump and air were within spec. Rebar cover was short at one spot and corrected before the pour. Eight cylinders were cast; break results will follow on Dec 1 and Dec 22. The {company} team'
      },
      risk: 'Goes outside the firm: the {approver} signs the report before it goes to the client.'
    },
    {
      id: 'daily-report-elm',
      requires: 'contractor',
      channel: 'text',
      from: 'Crew texts: Riverside office building (sample)',
      receivedAt: '7:30 AM',
      subject: 'Yesterday on site: 6 texts, 4 photos',
      body: 'Foreman texts: framing done on second floor, waiting on window delivery, 5 crew on site, light rain after 2 PM. Photos show second-floor framing, a tarp over the stair opening, a lumber pile and the empty window bays.',
      steps: [
        { system: '{core}', text: 'Matched texts and photos to project P-2214, Riverside office building.' },
        { system: '{docs}', text: 'Filed 4 photos with captions from the descriptions.' },
        { system: '{core}', text: 'Logged labor: 5 crew, 8 hours each.' },
        { system: '{core}', text: 'Noted the open item: window delivery not received.' }
      ],
      draft: {
        kind: 'Daily field report',
        to: '{approver}',
        fields: [['Project', 'P-2214, Riverside office'], ['Crew', '5'], ['Weather', 'Rain after 2 PM'], ['Open item', 'Window delivery']],
        body: 'Second-floor framing complete. Stair opening covered with tarp for rain. Window delivery did not arrive; window install cannot start until it does. 4 photos filed.'
      }
    },
    {
      id: 'rfi-beam',
      requires: 'contractor',
      channel: 'text',
      from: 'Field lead Ray Collins',
      receivedAt: '8:05 AM',
      subject: 'Beam size question at lobby opening',
      body: 'Drawing A-201 shows a W10x26 beam over the new lobby opening but S-101 shows W10x22. Which one? Need to order steel today.',
      steps: [
        { system: '{docs}', text: 'Opened sheets A-201 and S-101. Confirmed the two sheets differ.' },
        { system: '{core}', text: 'Checked the RFI log. No earlier RFI on this beam.' },
        { system: '{core}', text: 'Drafted RFI-017 with both sheet references and a needed-by date.' }
      ],
      draft: {
        kind: 'RFI',
        to: 'Project architect (sample)',
        fields: [['RFI', '017'], ['Sheets', 'A-201, S-101'], ['Needed by', 'Nov 26, 12 PM']],
        body: 'A-201 calls for a W10x26 beam at the new lobby opening. S-101 shows W10x22. Please confirm the required size so we can order steel. Field is ready to set the beam Friday. The {company} team'
      },
      risk: 'Goes outside the firm: the {approver} checks the question before it goes to the architect.'
    },
    {
      id: 'inspection-elm',
      requires: 'contractor',
      channel: 'email',
      from: 'Township building inspector (sample)',
      receivedAt: '8:45 AM',
      subject: 'Framing inspection times',
      body: 'I can do the framing inspection at the Riverside office building, 40 Elm St, Monday at 9 AM or Tuesday at 1 PM.',
      steps: [
        { system: '{calendar}', text: 'Checked the field schedule. Monday morning is clear; Tuesday Ray is on another site.' },
        { system: '{core}', text: 'Confirmed framing marked complete in the project log.' },
        { system: '{calendar}', text: 'Held Monday 9 AM with Ray Collins.' },
        { system: '{core}', text: 'Drafted the inspector reply and a client note.' }
      ],
      draft: {
        kind: 'Calendar hold',
        to: 'Inspector (sample) and owner rep Lisa Tran',
        fields: [['Inspection', 'Framing'], ['When', 'Monday 9 AM'], ['On site', 'Ray Collins']],
        body: 'Inspector: Monday at 9 AM works. Ray Collins will meet you on site.\n\nClient: Hi Lisa, the framing inspection is set for Monday at 9 AM. No need to be on site. We will share the result that day. The {company} team'
      }
    },
    {
      id: 'rfi-response-017',
      requires: 'engineering',
      channel: 'email',
      from: 'Contractor PM, Sample Builders',
      receivedAt: '8:05 AM',
      subject: 'RFI-017: beam size at lobby opening',
      body: 'A-201 shows a W10x26 beam over the new lobby opening but S-101 shows W10x22. Please confirm the size. We need an answer by noon tomorrow to order steel.',
      steps: [
        { system: '{core}', text: 'Logged RFI-017 for project P-2214, Riverside office building, due Nov 26.' },
        { system: '{docs}', text: 'Opened sheets A-201 and S-101. Confirmed the two sheets differ.' },
        { system: '{docs}', text: 'Found the beam schedule in the structural calcs: W10x26 at this opening.' },
        { system: '{core}', text: 'Drafted the response and flagged S-101 for a revision.' }
      ],
      draft: {
        kind: 'RFI response',
        to: 'Contractor PM, Sample Builders',
        fields: [['RFI', '017'], ['Answer', 'W10x26 per calcs'], ['Drawing fix', 'S-101 to be revised']],
        body: 'Response to RFI-017: use W10x26 at the lobby opening, as shown on A-201 and in the structural calcs. S-101 will be revised to match in the next drawing issue. The {company} team'
      },
      risk: 'Engineering answer: the engineer of record confirms it before it goes to the contractor.'
    },
    {
      id: 'special-inspection',
      requires: 'engineering',
      channel: 'email',
      from: 'Contractor PM, Sample Builders',
      receivedAt: '8:45 AM',
      subject: 'Steel erection starts Monday',
      body: 'We start setting steel at the Riverside office building Monday. Please schedule the special inspection for the bolted connections.',
      steps: [
        { system: '{docs}', text: 'Checked the special inspection plan: bolted connections need periodic inspection.' },
        { system: '{calendar}', text: 'Found inspector Omar F. free Monday 10 AM to 2 PM.' },
        { system: '{core}', text: 'Found two inspection reports from last week not yet sent to the township.' },
        { system: '{calendar}', text: 'Held Monday 10 AM and drafted the notice with both reports attached.' }
      ],
      draft: {
        kind: 'Calendar hold',
        to: 'Contractor PM and township construction office (sample)',
        fields: [['Inspection', 'Bolted connections'], ['When', 'Monday 10 AM'], ['Inspector', 'Omar F.'], ['Attached', '2 reports from last week']],
        body: 'Special inspection of bolted steel connections at the Riverside office building is set for Monday at 10 AM with Omar F. Township: attached are last week\'s two inspection reports for your file. The {company} team'
      },
      risk: 'Goes outside the firm: the {approver} checks the notice and reports before they are sent.'
    },
    {
      id: 'certified-payroll',
      requires: 'contractor',
      channel: 'system',
      from: 'Payroll calendar',
      receivedAt: '9:15 AM',
      subject: 'Week 47 certified payroll due: Library annex (sample public job)',
      body: 'Certified payroll report for the public library annex job is due Friday.',
      steps: [
        { system: '{payroll}', text: 'Pulled hours for 7 workers on the annex job, week ending Nov 22.' },
        { system: '{payroll}', text: 'Checked rates against the job wage sheet. All at or above the posted rate.' },
        { system: '{docs}', text: 'Added the statement of compliance, ready for the owner to sign.' },
        { system: '{docs}', text: 'Assembled the packet for signature.' }
      ],
      draft: {
        kind: 'Certified payroll packet',
        to: '{approver}',
        fields: [['Job', 'Library annex (sample)'], ['Week ending', 'Nov 22'], ['Workers', '7'], ['Due', 'Friday']],
        body: 'Week 47 packet ready: 7 workers, all paid at or above the posted rates. Statement of compliance needs an authorized signature before submission.'
      },
      risk: 'Legal filing: an authorized person signs and submits. The agent never signs.'
    },
    {
      id: 'submittal-rail',
      requires: 'contractor',
      channel: 'email',
      from: 'Shop drafter Nina V.',
      receivedAt: '9:50 AM',
      subject: 'Shop drawings ready: stair rail, Riverside office',
      body: 'Stair rail shop drawings SD-05 Rev 0 are done, with the steel spec sheet. Fabrication needs approval by Dec 5 to hold the install date.',
      steps: [
        { system: '{docs}', text: 'Filed SD-05 Rev 0 and the spec sheet in the submittals folder.' },
        { system: '{core}', text: 'Checked the submittal log. This is the first round for the stair rail.' },
        { system: '{core}', text: 'Matched the spec sheet to the project spec section for metal railings.' },
        { system: '{core}', text: 'Drafted transmittal 012 with a Dec 3 return date.' }
      ],
      draft: {
        kind: 'Submittal transmittal',
        to: 'Project architect (sample)',
        fields: [['Transmittal', '012'], ['Item', 'Stair rail shop drawings SD-05 Rev 0'], ['Return by', 'Dec 3']],
        body: 'Attached for approval: stair rail shop drawings SD-05 Rev 0 and the steel spec sheet. Please return comments by Dec 3 so fabrication can start and hold the install date. The {company} team'
      },
      risk: 'Goes outside the firm: the {approver} checks the package before it goes to the architect.'
    },
    {
      id: 'submittal-log',
      requires: 'engineering',
      channel: 'system',
      from: 'Submittal log',
      receivedAt: '9:15 AM',
      subject: '3 submittals in review, 1 due back Friday',
      body: 'Riverside office building: stair rail drawings, concrete mix design and curtain wall drawings are with the engineer of record.',
      steps: [
        { system: '{core}', text: 'Found 3 open submittals and their due dates.' },
        { system: '{docs}', text: 'Read the marked-up stair rail drawings: approved as noted.' },
        { system: '{docs}', text: 'Read the mix design comments: revise and resubmit.' },
        { system: '{core}', text: 'Updated the log and drafted a status note to the contractor.' }
      ],
      draft: {
        kind: 'Submittal status update',
        to: 'Contractor PM, Sample Builders',
        fields: [['Stair rail', 'Approved as noted'], ['Mix design', 'Revise and resubmit'], ['Curtain wall', 'Due back Friday']],
        body: 'Submittal status for the Riverside office building: stair rail drawings SD-05 are approved as noted, with comments attached. Mix design MD-02 needs revision; see the comments on air content. Curtain wall drawings are due back Friday. The {company} team'
      },
      risk: 'Goes outside the firm: the {approver} confirms each status before it is sent.'
    },
    {
      id: 'proposal-drainage',
      requires: 'engineering',
      channel: 'email',
      from: 'Mark Ellis, Sample Realty Partners',
      receivedAt: '9:50 AM',
      subject: 'Proposal for a drainage study',
      body: 'We are buying a 4-acre retail lot on Route 9 (sample) and need a site drainage study before closing in February. Can you send a proposal?',
      steps: [
        { system: '{core}', text: 'Created opportunity OP-0388 for Sample Realty Partners.' },
        { system: '{docs}', text: 'Pulled the proposal template and two past drainage study proposals.' },
        { system: '{core}', text: 'Estimated 46 hours at standard rates: $8,900.00, plus $450.00 survey costs.' },
        { system: '{calendar}', text: 'Checked staff load. Report can be done in 5 weeks.' }
      ],
      draft: {
        kind: 'Proposal letter',
        to: 'Mark Ellis',
        fields: [['Scope', 'Site drainage study, 4 acres'], ['Fee', '$8,900.00 plus $450.00 costs'], ['Schedule', '5 weeks from signing']],
        body: 'Hi Mark, thank you for thinking of us. We propose a site drainage study for the 4-acre lot for a fee of $8,900.00 plus $450.00 in survey costs. We can deliver the report 5 weeks after signing, ahead of your February closing. The {company} team'
      },
      risk: 'Money and commitment: the {approver} approves the fee and schedule before the proposal goes out.'
    }
  ]
};
