export default {
  id: 'insurance',
  agent: 'Service desk agent',
  promise: 'Reads client requests, prepares each policy change and drafts every reply. The {approver} approves each one, and a licensed person issues anything binding.',
  defaults: {
    approver: 'licensed CSR',
    systems: {
      core: 'Agency management system',
      carrier: 'Carrier portal',
      docs: 'Document storage'
    }
  },
  items: [
    {
      id: 'add-vehicle-nguyen',
      channel: 'email',
      from: 'Kevin Nguyen',
      receivedAt: '7:40 AM',
      subject: 'Adding my new car',
      body: 'Hi, I bought a 2025 Honda CR-V yesterday and need it on my policy. Same coverage as my other car please. VIN is on the bill of sale attached.',
      steps: [
        { system: '{core}', text: 'Found personal auto policy PA-778120. Two drivers, one vehicle.' },
        { system: '{docs}', text: 'Read the bill of sale. Pulled VIN and lienholder Sample Auto Credit.' },
        { system: '{core}', text: 'Copied coverages from the current vehicle: 100/300 liability, $500 deductibles.' },
        { system: '{carrier}', text: 'Got a sample quote: +$412.00 for the rest of the term.' },
        { system: '{core}', text: 'Created endorsement change request, unsubmitted.' }
      ],
      draft: {
        kind: 'Change request',
        to: 'Carrier underwriting',
        fields: [['Policy', 'PA-778120'], ['Vehicle', '2025 Honda CR-V'], ['Lienholder', 'Sample Auto Credit'], ['Premium change', '+$412.00']],
        body: 'Add 2025 Honda CR-V effective today with coverages matching vehicle 1. Add lienholder as loss payee. Client to receive updated ID cards by email.'
      },
      risk: 'Coverage change: a licensed agent confirms before it goes to the carrier.'
    },
    {
      id: 'coi-delgado',
      channel: 'email',
      from: 'Maria Delgado, Delgado Painting (sample)',
      receivedAt: '8:02 AM',
      subject: 'Need a certificate for a job',
      body: 'Can you send a certificate of insurance to Westfield Office Park (sample)? They want to be listed as additional insured. Job starts Monday.',
      steps: [
        { system: '{core}', text: 'Found general liability policy GL-450233, active through Jun 2027.' },
        { system: '{core}', text: 'Checked the policy: blanket additional insured endorsement is on file.' },
        { system: '{docs}', text: 'Filled the certificate template with holder and limits.' },
        { system: '{core}', text: 'Routed to a licensed CSR for issue. Not issued.' }
      ],
      draft: {
        kind: 'Certificate request',
        to: 'Licensed CSR',
        fields: [['Insured', 'Delgado Painting'], ['Holder', 'Westfield Office Park'], ['Additional insured', 'Yes, blanket endorsement'], ['Policy', 'GL-450233']],
        body: 'Certificate prepared for Westfield Office Park as additional insured under the blanket endorsement. Please check limits and issue. Reply to Maria once issued: job starts Monday.'
      },
      risk: 'Never auto-issued: a licensed CSR checks and issues every certificate.'
    },
    {
      id: 'renewal-bakery',
      channel: 'system',
      from: 'Renewal list',
      receivedAt: '8:30 AM',
      subject: 'Renewal in 45 days: Sunrise Bakery (sample)',
      body: 'Business owners policy BOP-221904 renews Jan 9. Carrier renewal offer received.',
      steps: [
        { system: '{carrier}', text: 'Pulled renewal offer: premium $4,380.00, up from $4,050.00.' },
        { system: '{core}', text: 'Compared coverages. Same limits; new $1,000 wind deductible.' },
        { system: '{core}', text: 'Noted a new delivery van on file, not on the commercial auto quote.' },
        { system: '{docs}', text: 'Drafted the renewal summary.' }
      ],
      draft: {
        kind: 'Renewal summary',
        to: 'Account manager',
        fields: [['Policy', 'BOP-221904'], ['Renews', 'Jan 9'], ['Premium', '$4,380.00 (+8.1%)'], ['Changes', 'New wind deductible']],
        body: 'Renewal premium rises $330.00. Limits unchanged; new $1,000 wind deductible. Ask the client about the delivery van, which is not on any quote yet. Consider marketing to a second carrier.'
      }
    },
    {
      id: 'billing-ross',
      channel: 'email',
      from: 'Ellen Ross',
      receivedAt: '9:05 AM',
      subject: 'Question about my bill',
      body: 'My homeowners bill says $312 due Dec 1 but I thought I paid in full. Can you check?',
      steps: [
        { system: '{core}', text: 'Found homeowners policy HO-662310, paid on a 4-pay plan.' },
        { system: '{carrier}', text: 'Confirmed payments 1 and 2 received. Payment 3 of $312.00 due Dec 1.' },
        { system: '{core}', text: 'Noted the client chose installments at renewal.' }
      ],
      draft: {
        kind: 'Reply email',
        to: 'Ellen Ross',
        fields: [['Policy', 'HO-662310'], ['Due', '$312.00 on Dec 1']],
        body: 'Hi Ellen, thanks for checking. Your policy is on a 4-payment plan chosen at renewal. Payments 1 and 2 are received, and payment 3 of $312.00 is due Dec 1. We can switch you to pay in full if you prefer. The {company} team'
      }
    },
    {
      id: 'spanish-fernandez',
      requires: 'spanish',
      channel: 'text',
      from: 'Lucía Fernández',
      receivedAt: '9:40 AM',
      subject: 'Agregar a mi hijo como conductor',
      body: 'Hola, mi hijo Mateo cumplió 17 años y ya tiene su licencia. ¿Pueden agregarlo a mi póliza de auto? ¿Cuánto subiría?',
      steps: [
        { system: '{core}', text: 'Found auto policy PA-781045. Client prefers Spanish.' },
        { system: '{carrier}', text: 'Got a sample quote to add a 17-year-old driver: +$624.00 for the term.' },
        { system: '{core}', text: 'Created driver change request, unsubmitted, pending license copy.' },
        { system: '{core}', text: 'Drafted the reply in Spanish with an English summary.' }
      ],
      draft: {
        kind: 'Reply text (Spanish)',
        to: 'Lucía Fernández',
        fields: [['Policy', 'PA-781045'], ['Premium change', '+$624.00'], ['Needed', 'Copy of license'], ['English summary', 'Add son Mateo, 17. Quoted +$624.00. Waiting on license.']],
        body: 'Hola Lucía, felicidades a Mateo. Agregarlo a su póliza costaría unos $624.00 más por el período. Por favor envíenos una foto de su licencia para continuar. Saludos, el equipo de {company}.'
      },
      risk: 'Coverage change: a licensed agent confirms before the driver is added.'
    }
  ],
  quickWins: [
    {
      requires: 'spanish',
      job: 'Policy change requests in English or Spanish into service tickets',
      unit: 'request', units: 'requests',
      pasteLabel: 'Paste a client change request (English or Spanish)',
      pasteHint: 'Change or remove client names, and remove license numbers, dates of birth and policy numbers first.',
      task: 'Turn the message into a service ticket for the {approver} and a short reply that confirms receipt and asks for anything missing.',
      rules: [
        'Write the ticket fields in English. Write the reply in the language the client used.',
        'Never say or suggest that coverage is added, changed, bound or in effect, and never explain what the policy covers.',
        'Never quote a premium, price change or deductible.',
        'Do not copy license, Social Security or bank numbers. Write "In original message" instead.'
      ],
      draftKind: 'Service ticket',
      fields: ['Client', 'Change requested', 'Effective date', 'Missing info', 'Urgency'],
      replyTo: 'client',
      example: 'Hola, soy Rosa Quintero. Mi hija Sofía cumplió 17 y ya tiene su licencia de conducir. ¿Pueden agregarla a mi póliza de auto a partir del lunes? Va a manejar el Corolla.',
      exampleDraft: {
        fields: {
          Client: 'Rosa Quintero',
          'Change requested': 'Add driver: daughter Sofía, 17, newly licensed, to drive the Corolla',
          'Effective date': 'Monday (client request)',
          'Missing info': 'Copy of Sofía\'s license, her date of birth',
          Urgency: 'Normal. Wants it from Monday.'
        },
        reply: 'Hola Rosa, felicidades a Sofía. Recibimos su solicitud para agregarla como conductora a partir del lunes. Para continuar, envíenos una foto de la licencia de Sofía y su fecha de nacimiento. Un agente con licencia revisará el cambio y se lo confirmará por escrito. Este mensaje no confirma la cobertura. Saludos, el equipo de {company}.'
      },
      measure: 'time from a change request to a ready ticket, and emails needed per change',
      next: ['Certificate requests prepared for the CSR to issue', 'Renewal comparison summaries for account managers', 'First notice of loss intake and claim follow-up']
    },
    {
      job: 'Policy change emails into service tickets and client replies',
      unit: 'request', units: 'requests',
      pasteLabel: 'Paste a client change request',
      pasteHint: 'Change or remove client names, and remove license numbers, dates of birth and policy numbers first.',
      task: 'Turn the message into a service ticket for the {approver} and a short reply that confirms receipt and asks for anything missing.',
      rules: [
        'Never say or suggest that coverage is added, changed, bound or in effect, and never explain what the policy covers.',
        'Never quote a premium, price change or deductible.',
        'If the message reports an accident, loss or claim, say so first under Urgency and do not discuss coverage.',
        'Do not copy license, Social Security or bank numbers. Write "In original message" instead.'
      ],
      draftKind: 'Service ticket',
      fields: ['Client', 'Change requested', 'Effective date', 'Missing info', 'Urgency'],
      replyTo: 'client',
      example: 'Hi, this is Dana Whitfield. I traded in my 2019 Camry today and bought a 2024 Subaru Outback, financed through Harborline Credit Union. Please swap the cars with the same coverage. I am driving it home tonight and the VIN ends in 4417.',
      exampleDraft: {
        fields: {
          Client: 'Dana Whitfield',
          'Change requested': 'Replace 2019 Camry with 2024 Subaru Outback. Client asks for the same coverage. Add Harborline Credit Union as lienholder.',
          'Effective date': 'Today',
          'Missing info': 'Full VIN, lienholder mailing address',
          Urgency: 'High. Client is driving the new car tonight.'
        },
        reply: 'Hi Dana, congratulations on the Outback. We received your request to replace the Camry with the 2024 Subaru Outback and add Harborline Credit Union as lienholder. To finish it, please send the full VIN and the lienholder\'s mailing address. A licensed member of our team will review the change and confirm it with you in writing. This email does not confirm coverage. The {company} team'
      },
      measure: 'time from a change request to a ready ticket, and emails needed per change',
      next: ['Certificate requests prepared for the CSR to issue', 'Renewal comparison summaries for account managers', 'First notice of loss intake and claim follow-up']
    }
  ]
};
