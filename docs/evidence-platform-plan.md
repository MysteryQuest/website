# Evidence-first platform implementation plan

## Product direction

The Unverified File should report what is claimed, what evidence is available, where it came from, what remains unknown, and what changed. It must not turn AI output or community votes into a truth score.

## Phase 1 — publishing foundation (current)

- Establish shared navigation: Briefing, Case Files, Evidence Desk, Community Queue, Broadcasts, Methodology, About.
- Add a versioned case model with claims, evidence, sources, hypotheses, timeline, revisions, status, and AI disclosure.
- Add local `validate`, `new-case`, `build`, `preview`, and `publish-check` commands.
- Build a reusable case renderer and generated briefing/case/search indexes.
- Convert the existing reviewed UAP disclosure article into a case file.
- Preserve the three old homepage concepts as visibly labeled demonstration records until researched.
- Replace the homepage with a daily-briefing layout and publish transparent methodology/about pages.

## Phase 2 — evidence desk integration

- Connect D1 events and sightings to cases by stable IDs.
- Make article ingestion produce draft case material rather than publishing directly.
- Add source snapshots, link-health checks, media provenance, and structured correction notes.
- Normalize old Archive/D-LOG routes into Evidence Desk views without breaking incoming links.
- Add faceted search over case status, evidence type, topic, geography, and date.

## Phase 3 — community and broadcasts

- Replace binary votes with useful signals: source quality, alternative explanation, corroboration, media concern, and research priority.
- Clearly separate community signal from editorial assessment.
- Add moderated comments/submissions with privacy controls before accepting personal data.
- Generate broadcast episode pages that cite case-file evidence and record post-publication corrections.

## Phase 4 — advanced analysis

- Build explainable node-to-node correlation views from explicit evidence and event references.
- Add calibrated forecasting experiments with baselines, uncertainty, back-testing, and public limitations.
- Add deeper model routing only where local models are insufficient; log model, prompt purpose, and human review.

## Publication rules

Published cases require at least one claim, one source, one evidence record, a revision entry, a human reviewer, an AI-use disclosure, and no unresolved source references. Demonstration and draft records may be built for preview but are visibly labeled and excluded from priority counts.

## Definition of done for Phase 1

- A new case can be scaffolded, validated, built, previewed, and publish-checked locally.
- A reader can navigate the same information architecture on desktop and mobile.
- The briefing and case-file list are generated from structured data.
- Every published statement shown as a key claim points to evidence and a source.
- AI assistance and uncertainty are visible, not hidden in a generic confidence score.
