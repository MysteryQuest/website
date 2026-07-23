# Current architecture

Last audited: 2026-07-23

## Runtime surfaces

- `website/` is a separate Git repository deployed as static files to GitHub Pages by `.github/workflows/static.yml`.
- Pages are plain HTML with shared JavaScript fragments in `js/header.js` and `js/footer.js`. Tailwind is loaded from a CDN on most newer pages; older pages also carry page-specific CSS.
- Cloudflare Worker `workers/privacy-api/` provides D1-backed events, archive, voting, submissions, investigations, and UAP correlation APIs. D1 is the authoritative live-data store.
- `tools/research/` is the local Research Admin and AI-assisted intake/review pipeline. It publishes reviewed articles to `website/api/articles.json`.
- `website/js/mysteries.json` is a legacy static dataset and remains only as compatibility/fallback data. New work must not make it authoritative again.

## Content flows

1. Event and community data: source collectors/local review → D1 → Worker API → map, archive, voting, investigations.
2. Long-form editorial work: local research/review → reviewed static article JSON → article renderer.
3. Evidence-first case files: versioned files in `content/cases/` → `tools/content_workflow.py build` → public indexes in `api/` → briefing and case-file renderer.

The third flow is the canonical editorial layer. It can link to D1 event IDs and external sources without copying the entire event database into Git.

## Confirmed redundancies and risks

- Homepage feature cards duplicated titles and claims without a content record or review state.
- “Investigations,” “Project D-LOG,” and articles used different labels for substantially overlapping editorial work.
- Binary “real or hoax” language implied a verdict that the underlying vote data cannot establish.
- Source lists were embedded in prose, making missing citations and duplicate IDs hard to detect.
- Navigation labels and mobile destinations differed from desktop navigation.
- Several legacy pages still use the Mystery Quest name and older presentation styles.
- Generated articles can be public without a durable revision log or explicit human-review gate.

## Boundaries retained intentionally

- D1 remains the public event, sighting, vote, and submission database.
- Git remains the reviewed case-file publication system because it provides reviewable history, deterministic builds, and easy static hosting.
- Local Gemma research is assistance, not evidence and not an editorial verdict. A person must approve publication.
- Labs, the map, the broad archive, and the Research Admin remain distinct tools, linked from the evidence platform rather than duplicated inside it.

## Deployment

Run validation and the publish gate locally before pushing `website/main`. GitHub Pages deploys that commit. The parent repository tracks the deployed website commit and stores operational tools and private/local-only state.
