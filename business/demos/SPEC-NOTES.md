# Spec notes (leads.js)

- 49 leads: insurance 5, home-services 7, wealth 8, law 5, accounting 5, property 7, construction 6, logistics 6.
- Slugs are kebab-case of the name (lowercase, non-alphanumerics to '-').
- systems keys used: core, accounting, crm, docs only. Most leads have none, so playbook defaults must cover core/accounting/crm/docs for every vertical that references them.
  - accounting = ledger or payables tool (Simon Quick: Bill.com; Mercadien: QuickBooks). Mercadien sets accounting, not core, so the accounting playbook default core shows.
  - Simon Quick also uses eMoney and QuickBooks per evidence; left out (no spare key).
  - Nelson & Ward evidence says "Epic"; written as Applied Epic.
- Odd fits for their playbook copy: A Step Above (medical billing, in accounting), Hydracore (precision machining QC, in construction), Albany County Fasteners (order status, in logistics). Generic playbook items will read slightly off for these.
- NXT Home Improvement: town is "Central NJ". Its intake is a Google Form (mentioned in focus as "the website form", not a system key).
- No lead has a `town` placeholder issue; names contain '&' and commas, so the UI must escape HTML.
