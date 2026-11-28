// Small fixture so engine tests do not depend on the real playbooks.
export default {
  id: 'fixture',
  agent: 'Work-order agent',
  promise: 'Files the work in {core}. {approver} approves each one.',
  defaults: { approver: 'manager', systems: { core: 'Core system', docs: 'Docs' } },
  items: [
    {
      id: 'one', channel: 'email', from: 'Pat Lee', receivedAt: '8:00 AM', subject: 'Hello from {town}', body: 'Body one.',
      steps: [{ system: '{core}', text: 'Found the record for {company}.' }, { system: '{docs}', text: 'Pulled a template.' }],
      draft: { kind: 'Reply', to: 'Pat Lee', fields: [['Owner', '{approver}'], ['Note', 'Ask the {approver} first.']], body: 'Draft one.' },
    },
    {
      id: 'sensor', requires: 'sensor', channel: 'sensor', from: 'Sensor', receivedAt: '8:05 AM', subject: 'Wet', body: 'Wet floor.',
      steps: [{ system: '{core}', text: 'Opened a ticket.' }],
      draft: { kind: 'Work order', to: 'Vendor', fields: [], body: 'Draft two.' },
      risk: 'Spends money.',
    },
    {
      id: 'three', channel: 'call', from: 'Sam Roe', receivedAt: '8:10 AM', subject: 'Call back', body: 'Call summary.',
      steps: [{ system: '{core}', text: 'Logged the call.' }],
      draft: { kind: 'Callback note', to: 'Sam Roe', fields: [], body: 'Draft three.' },
    },
  ],
  // Stand-in quick wins until the real playbooks carry them.
  quickWins: [
    {
      requires: 'exterior',
      job: 'Roof leak calls into job tickets',
      unit: 'call', units: 'calls',
      pasteLabel: 'Paste a roof call note',
      task: 'Turn the note into a job ticket.',
      rules: [],
      draftKind: 'Job ticket',
      fields: ['Roof', 'Next step', 'Notes'],
      replyTo: 'homeowner',
      example: 'Roof is dripping. Please come.',
      exampleDraft: { fields: { Roof: 'Shingle', 'Next step': 'Inspect', Notes: 'Not stated' }, reply: 'We got your note.' },
      measure: 'hours spent on roof calls',
      next: ['Roof quotes', 'Crew schedules'],
    },
    {
      job: 'Maintenance requests into work orders for {company}',
      unit: 'request', units: 'requests',
      pasteLabel: 'Paste a tenant or vendor message',
      pasteHint: 'Remove anything private first.',
      task: 'Turn the message into a work order and a short reply to the tenant.',
      rules: ['Never promise a repair time a vendor has not confirmed.', '{approver} signs off on spend.'],
      draftKind: 'Work order',
      fields: ['Priority', 'Unit', 'Issue', 'Next step'],
      replyTo: 'tenant',
      example: 'Hi, this is Dana in 4B. Water is pooling under the kitchen sink. Can someone come today?',
      exampleDraft: {
        fields: { Priority: 'Urgent', Unit: '4B', Issue: 'Leak under kitchen sink', 'Next step': 'Send plumber' },
        reply: 'Hi Dana, thanks for letting us know. The {approver} will confirm a visit shortly.',
      },
      measure: 'hours spent turning requests into work orders',
      next: ['Vendor scheduling and follow-up', 'Rent reminders in {town}'],
    },
  ],
};
