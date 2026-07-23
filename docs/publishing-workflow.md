# Local case publishing workflow

Run commands from the parent repository.

```bash
python3 tools/content_workflow.py new-case --title "Precise case title" --topic "UAP"
python3 tools/content_workflow.py validate
python3 tools/content_workflow.py build
python3 tools/content_workflow.py preview --port 8000
python3 tools/content_workflow.py publish-check
```

## Authoring

Each case lives at `website/content/cases/<slug>/`. Edit `case.json`, the seven record arrays, and `narrative.md`. IDs must be stable and unique. Evidence records link to source IDs; claims link to evidence IDs.

`draft` cases are excluded from generated public indexes. `demonstration` cases are public only as labeled structural examples. `published` and `active` cases require claims, evidence, sources, revisions, a publication date, a named reviewer, and `human_reviewed: true`.

## Build outputs

- `website/api/cases.json` contains complete non-draft public case records.
- `website/api/briefing.json` drives the homepage lead, publication list, and demonstration section.
- `website/api/search-index.json` is a compact index for site search.

The narrative Markdown subset is converted to escaped HTML during the build. The browser does not interpret raw Markdown.

## Publication check

Run `publish-check` immediately before committing the website repository. It rejects unresolved drafts and incomplete published records. It does not replace editorial review or verify that an external source is true; it verifies the record structure and publication boundary.
