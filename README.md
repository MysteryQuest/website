# The Unverified File website

Static GitHub Pages site for evidence-first case reporting, D1-backed public event exploration, community signals, Labs, and broadcasts.

- Architecture: `docs/current-architecture.md`
- Implementation plan: `docs/evidence-platform-plan.md`
- Case publishing: `docs/publishing-workflow.md`

The authoritative live event database is Cloudflare D1. Versioned editorial case files live in `content/cases/` and build to `api/cases.json`, `api/briefing.json`, and `api/search-index.json` through the parent repository's `tools/content_workflow.py`.
