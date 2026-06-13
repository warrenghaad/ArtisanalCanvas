# Studio assets

Local-first storage for the Primitive Cell Studio (`server/studio`).

- `generated/` — PNGs produced by the image swarm (gitignored binaries).
- `manifests/` — JSON primitive manifests saved per swarm run (gitignored).
- `primitives/` — curated reusable cell images (commit these intentionally).
- `references/` — ingested reference images.

Override the root with the `ASSET_DIR` env var. Nothing here is pushed to an
external service at generation time; syncing to GitHub/Notion is a later phase.
