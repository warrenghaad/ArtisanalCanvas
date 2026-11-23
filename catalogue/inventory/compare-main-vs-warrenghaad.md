# Inventory comparison: `origin/main` vs `origin/warrenghaad`

- **origin/main** at `2d4492a` (2026-11-15): 31451 files, 99 code, 15393 docs
- **origin/warrenghaad** at `84123e4` (2026-11-06): 135 files, 94 code, 4 docs

This is a structural source map produced by `catalogue-kit/scripts/inventory.ts`. A route, endpoint, or table existing is *indirect* evidence only. It does not show that a function works, and names that match may still behave differently.

## Client routes (screens)

| | count | items |
|---|---|---|
| only in origin/main | 7 | `/academy`, `/analytics`, `/curriculum`, `/etextbooks`, `/image-studio`, `/learning`, `/primitive-library` |
| only in origin/warrenghaad | 2 | `/dashboard`, `/vite-hmr` |
| in both | 1 | `/` |

## Pages (files under `pages/`)

| | count | items |
|---|---|---|
| only in origin/main | 7 | `academy.tsx`, `analytics-dashboard.tsx`, `curriculum-dashboard.tsx`, `etextbook-explorer.tsx`, `image-studio.tsx`, `learning-hub.tsx`, `primitive-library.tsx` |
| only in origin/warrenghaad | 2 | `Curation.tsx`, `Dashboard.tsx` |
| in both | 1 | `not-found.tsx` |

## Server endpoints

| | count | items |
|---|---|---|
| only in origin/main | 38 | `GET /api/analytics/dashboard`, `GET /api/analytics/student/:userId`, `GET /api/curriculum/mappings`, `GET /api/curriculum/mappings/:gradeLevel`, `GET /api/differentiated-content/:contentPath`, `GET /api/historical-periods`, `GET /api/historical-periods/:periodId`, `GET /api/student-progress/:userId`, `GET /api/user/:id`, `GET /api/user/:userId/drawings`, `GET /api/user/:userId/phase/:phaseId/progress`, `GET /api/user/by-username/:username`, `GET /concepts`, `GET /concepts/:id`, `GET /graph`, `GET /images`, `GET /images/:id`, `GET /primitives`, `GET /primitives/:id`, `GET /sources`, `GET /status`, `PATCH /concepts/:id`, `PATCH /primitives/:id`, `POST /api/differentiation-path/update`, `POST /api/drawing/assess`, `POST /api/drawing/submit`, `POST /api/exercise/tips`, `POST /api/practice-session`, `POST /api/student-progress`, `POST /api/user/:id/progress`, `POST /concepts`, `POST /images/generate`, `POST /images/generate-with-swarm`, `POST /images/plan`, `POST /ingest/chat`, `POST /ingest/drawing`, `POST /ingest/reference`, `POST /primitives` |
| only in origin/warrenghaad | 0 | — |
| in both | 0 | — |

## Database tables

| | count | items |
|---|---|---|
| only in origin/main | 12 | `concept_primitives`, `concepts`, `curriculum_mapping`, `drawing_submission`, `generated_images`, `graph_edges`, `historical_period_content`, `practice_session`, `primitive_cells`, `student_content_progress`, `studio_sources`, `user_progress` |
| only in origin/warrenghaad | 0 | — |
| in both | 1 | `users` |

## External services (by import)

| | count | items |
|---|---|---|
| only in origin/main | 2 | `@neondatabase/serverless`, `openai` |
| only in origin/warrenghaad | 0 | — |
| in both | 0 | — |

## Environment variables

| | count | items |
|---|---|---|
| only in origin/main | 3 | `ASSET_DIR`, `OPENAI_API_KEY`, `OPENAI_API_KEY_ENV_VAR` |
| only in origin/warrenghaad | 2 | `REPLIT_DEV_DOMAIN`, `REPLIT_INTERNAL_APP_DOMAIN` |
| in both | 4 | `DATABASE_URL`, `NODE_ENV`, `PORT`, `REPL_ID` |

## Agent instruction files

- origin/main: `.codex/agents/accessibility-agent.toml`, `.codex/agents/assembler-agent.toml`, `.codex/agents/canon-keeper.toml`, `.codex/agents/dock-agent.toml`, `.codex/agents/frontend-final-use-agent.toml`, `.codex/agents/graphnode-agent.toml`, `.codex/agents/meta-build-agent.toml`, `.codex/agents/nash-room-agent.toml`, `.codex/agents/prism-brain.toml`, `.codex/agents/qa-audit-agent.toml`, `.codex/agents/rwi-agent.toml`, `.codex/config.toml`, `AGENTS.md`, `replit.md`
- origin/warrenghaad: `.agents/agent_assets_metadata.toml`, `.agents/memory/MEMORY.md`, `.agents/memory/dependency-restoration.md`, `.agents/memory/webgl-verification.md`, `.agents/memory/workspace-scope.md`

