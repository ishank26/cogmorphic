# Cogmorphic lead demos

One clickable demo page per sales lead. Sample data only; nothing is sent. See `ARCHITECTURE.md` for the contract.

Node 22, no npm dependencies.

## Build

    node build.mjs

Writes `dist/<slug>.html` (one self-contained page per lead: page content only, CSS, data and script inlined)
and `dist/index.json` (slug, company, playbook, title).

## Test

    node --test

Runs `tests/*.test.mjs`: engine transitions and immutability, the playbook and lead schema, every lead
resolving to 4-5 items with no leftover `{placeholders}`, and the built pages (no `<html>`/`<body>`, no em dashes).

## Add a lead

Add one entry to `src/domain/leads.js` (schema in `ARCHITECTURE.md`), then build and test.
Give it a `short` name for the page title. Use `systems` only for tools the firm is known to use, with keys from
the playbook's `defaults.systems`; anything left out falls back to the playbook default.

## Add a playbook

Add `src/domain/playbooks/<id>.js` with `export default { id: '<id>', ... }`. The file name must match the id.
Playbooks are found by scanning the folder. Sentences may use `{company}`, `{town}` and `{approver}` (a lowercase
role noun, capitalized automatically at the start of a sentence). System keys such as `{core}` go only in
`step.system`. An unknown placeholder fails the build.

## Layout

    src/domain   plain data (leads, playbooks)
    src/app      engine.js: pure functions, no DOM
    src/ui       view.js (DOM only, calls the engine), styles.css
    build.mjs    inlines engine + view into one classic script per page
