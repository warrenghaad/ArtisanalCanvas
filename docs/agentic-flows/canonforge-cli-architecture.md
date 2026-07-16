# CanonForge CLI Architecture

## Purpose

CanonForge is a local CLI and agentic editing system for turning ingested material into organized documents, concept structures, schemas, and controlled repo patches.

It is designed for messy knowledge work where the user wants to talk through decisions, fine tune organization, and keep a human in the loop while agents read, extract, cluster, map, draft structure, and apply approved edits.

CanonForge should support the ArtisanalCanvas and Cognitive Canvas direction where any concept, artifact, image, theory note, or curriculum fragment can become structured enough to power:

- concept registries
- drawing and visual grammar systems
- GECD annotations
- source boards
- repo documentation
- curriculum asset briefs
- primitive and pattern databases
- future GraphNode or Canvas features

The system centers on one operating principle:

> Convert raw information into structured, reviewable knowledge artifacts before producing long prose.

---

## 1. Core Workflow

CanonForge uses a staged pipeline:

```text
ingest -> extract -> classify -> organize -> propose -> review -> patch -> log
```

Each run produces a traceable chain of decisions. The user can stop at any stage, edit the plan, promote an agent, or request a narrower output.

### Default output ladder

```text
1. source card
2. concept atoms
3. concept clusters
4. canonical placement proposal
5. document structure
6. patch plan
7. approved file write
```

### Explicit drafting mode

Long finished prose is generated through an explicit mode flag:

```text
/draft full-prose --target <document> --scope <section>
```

The default behavior is structure, outline, schema, patch plan, or surgical edit.

---

## 2. CLI Surface

CanonForge should feel like a local studio console rather than a batch script.

### Basic commands

```bash
canonforge chat --workspace ./ArtisanalCanvas
canonforge ingest ./notes
canonforge ingest ./docs/sacred-geometry
canonforge plan "organize these primitive grammar notes"
canonforge map ./vault --domain drawing
canonforge patch --review
canonforge promote concept-extractor --scope current-run
canonforge status
canonforge runs
```

### Conversational shell

```text
canonforge>
```

Example interactions:

```text
read the new primitive pattern notes and propose where they belong
```

```text
Found 7 concept clusters.
Proposed 3 canonical documents.
Detected 2 merge candidates.
Detected 1 instruction-scope issue.
Review plan? [y/n/edit]
```

```text
show clusters
patch docs only
promote schema agent
make this a concept registry instead of a prose document
```

### Command grammar

```text
verb + target + scope + mode
```

Examples:

```text
ingest folder ./research
extract concepts from ./notes/primitive-patterns.md
map to docs/sacred-geometry
plan patch only
promote document-architect for this run
show unresolved decisions
apply approved patch
```

---

## 3. Agent Hierarchy

CanonForge uses three authority layers:

1. HITL Translator
2. Foreman
3. Task Agents

A task agent can request temporary promotion to Foreman status when its work expands into orchestration.

---

## 4. HITL Translator

The HITL Translator is the front door. It turns user speech into precise task packets.

### Responsibilities

- detect intent
- resolve the target files or folders
- identify output mode
- detect when the user wants planning, patching, drafting, or schema work
- maintain instruction scope
- ask narrow clarifying questions only when action would otherwise be unsafe or ambiguous
- preserve user corrections as scoped operating rules

### Task packet

```yaml
user_intent:
  action: restructure | summarize | classify | draft | patch | compare | promote_agent | map_concepts
  target:
  scope:
  output_level: source_card | concepts | outline | schema | patch_plan | patch | full_prose
  prose_mode: structural_default | explicit_full_prose
  domain:
  constraints:
  approval_required: true
  questions_for_user:
```

### Instruction scope packet

```yaml
instruction_scope:
  instruction_text:
  applies_to:
    - current_run
    - repo_docs
    - generated_curriculum_material
    - agent_architecture
    - code_comments
    - final_answer
  strength: preference | default | hard_rule
  expiration: current_turn | current_run | workspace_default | project_default
  positive_contract:
```

Example:

```yaml
instruction_text: "Use structural outputs unless full prose is requested."
applies_to:
  - generated_curriculum_material
  - repo_docs
strength: default
positive_contract: "Prefer outlines, schemas, task plans, and patch proposals as the first artifact form."
```

---

## 5. Foreman Agent

The Foreman converts task packets into work orders.

### Responsibilities

- decide which agents are needed
- divide work into bounded subtasks
- assign tasks
- request swarms when useful
- merge agent outputs
- identify conflicts
- choose review gates
- produce patch plans
- prepare commit summaries

### Work order

```yaml
work_order:
  task_id:
  goal:
  source_material:
  workspace:
  target_files:
  agent_assignments:
  expected_outputs:
  approval_gates:
  write_mode: plan | patch_review | trusted_patch
  risk_notes:
```

### Foreman output

```yaml
foreman_result:
  summary:
  proposed_changes:
  files_to_create:
  files_to_update:
  files_to_skip:
  unresolved_decisions:
  recommended_next_command:
```

---

## 6. Task Agents

### Ingestion Agent

Reads user-provided files, folders, markdown, text exports, PDFs, and repo documents.

Outputs:

```yaml
ingestion_result:
  source_id:
  source_type:
  title:
  file_path:
  extracted_text:
  structural_markers:
  detected_domains:
  possible_targets:
```

### Concept Extractor

Pulls concepts, terms, claims, distinctions, schemas, unresolved questions, and repeated patterns.

Outputs:

```yaml
concept_extraction:
  concept_atoms:
  concept_clusters:
  key_terms:
  user_corrections:
  contradictions:
  open_questions:
```

### Canon Mapper

Finds canonical placement and detects duplicates or adjacent concepts.

Outputs:

```yaml
canon_mapping:
  canonical_locations:
  merge_candidates:
  adjacent_concepts:
  new_document_candidates:
  parking_lot:
```

### Document Architect

Creates file trees, headings, page relationships, and document structure.

Outputs:

```yaml
document_architecture:
  folder_plan:
  file_plan:
  headings:
  cross_links:
  frontmatter:
  migration_notes:
```

### Schema Agent

Turns concept systems into machine-readable JSON, YAML, TypeScript, or database-ready models.

Outputs:

```yaml
schema_result:
  schema_name:
  fields:
  enums:
  relationships:
  validation_notes:
  sample_records:
```

### Editor Agent

Applies narrow text changes, reorganizes sections, normalizes vocabulary, and removes drift.

Outputs:

```yaml
editor_result:
  target_file:
  edit_summary:
  replacement_sections:
  unresolved_choices:
```

### Source Verifier

Marks claims as sourced, unsourced, speculative, or needing retrieval.

Outputs:

```yaml
source_status:
  claim:
  status: sourced | unsourced | speculative | retrieval_needed | disputed
  source_refs:
  note:
```

### Critic Agent

Reviews scope, drift, vocabulary collisions, instruction leakage, unsupported claims, and output level.

Outputs:

```yaml
critic_result:
  scope_issues:
  drift_issues:
  leakage_issues:
  unsupported_claims:
  verbosity_flags:
  repair_recommendations:
```

### Patch Agent

Writes approved edits to disk or repository.

Outputs:

```yaml
patch_result:
  files_created:
  files_updated:
  files_deleted:
  commit_message:
  verification:
```

---

## 7. Promotion Protocol

Task agents can request temporary Foreman status.

Promotion is useful when a specialist detects that the task requires orchestration rather than isolated execution.

### Promotion request

```yaml
promotion_request:
  agent:
  reason:
  proposed_scope:
  proposed_swarm:
  authority_requested:
    - assign_subtasks
    - create_intermediate_artifacts
    - propose_document_map
    - request_verification
  write_permission: false
  duration: current_run
```

### Promotion flow

```text
agent detects orchestration need
-> asks Foreman for promotion
-> HITL Translator summarizes request to user
-> user approves, narrows, or declines
-> temporary Foreman runs bounded swarm
-> authority expires at run end
```

### Example

```yaml
promotion_request:
  agent: Concept Extractor
  reason: "The source set contains multiple concept systems requiring separate clustering and reconciliation."
  proposed_scope: "primitive grammar, GECD schema, visual imaging engine"
  proposed_swarm:
    - Canon Mapper
    - Document Architect
    - Schema Agent
    - Critic Agent
  authority_requested:
    - assign_subtasks
    - create_intermediate_artifacts
    - propose_document_map
  write_permission: false
  duration: current_run
```

---

## 8. Swarm Orchestration

A Foreman can orchestrate swarms inside a bounded task.

### Swarm types

| Swarm | Purpose |
|---|---|
| Concept Swarm | Extract and cluster concepts across many sources. |
| Document Swarm | Propose folder maps, doc hierarchy, headings, and cross-links. |
| Schema Swarm | Convert concepts into reusable data models. |
| Critique Swarm | Check drift, source status, scope leakage, and duplicates. |
| Patch Swarm | Apply approved edits across multiple files. |

### Swarm input

```yaml
swarm_request:
  swarm_type:
  goal:
  sources:
  target_files:
  output_contract:
  constraints:
  approval_gate:
```

### Swarm output

```yaml
swarm_result:
  summary:
  proposed_changes:
  conflicts:
  files_to_create:
  files_to_update:
  needs_user_decision:
  next_action:
```

Swarm results should compress detail into decision-ready packets. Detailed intermediate notes are stored in run logs.

---

## 9. Document Lifecycle

Every piece of ingested material moves through a traceable lifecycle.

```text
raw input
-> source card
-> concept atoms
-> concept clusters
-> canonical location proposal
-> document architecture
-> patch plan
-> approval
-> file write
-> changelog
```

### Source card

```yaml
source_card:
  source_id:
  source_path:
  source_type:
  title:
  date_ingested:
  summary:
  domains:
  extraction_status:
```

### Concept atom

```yaml
concept_atom:
  id:
  phrase:
  normalized_name:
  domain:
  source_refs:
  confidence:
  status: adopted | candidate | rejected | parked | unresolved
```

### Canon placement

```yaml
canon_placement:
  concept_id:
  proposed_document:
  proposed_section:
  relation_type: belongs_to | duplicates | refines | contradicts | extends | example_of
  rationale:
  approval_status: pending | approved | rejected
```

---

## 10. State Model

CanonForge should store local state in SQLite for portability.

```text
.canonforge/
  runs.sqlite
  concept_graph.sqlite
  config.yaml
  logs/
  patches/
  cache/
```

### Suggested tables

```sql
runs(id, started_at, workspace, user_goal, status)
sources(id, run_id, path, type, title, hash, status)
concept_atoms(id, source_id, phrase, normalized_name, domain, status)
concept_clusters(id, name, summary, domain, status)
concept_edges(id, from_id, to_id, relation, confidence)
instructions(id, text, scope, strength, expiration, positive_contract)
agents(id, name, role, authority_level, status)
promotion_requests(id, run_id, agent, reason, status)
patches(id, run_id, file_path, patch_type, approval_status, commit_sha)
```

---

## 11. File Layout

Recommended project layout:

```text
canonforge/
  pyproject.toml
  README.md
  src/
    canonforge/
      cli.py
      shell.py
      config.py
      agents/
        translator.py
        foreman.py
        ingestion.py
        concept_extractor.py
        canon_mapper.py
        document_architect.py
        schema_agent.py
        editor.py
        source_verifier.py
        critic.py
        patch_agent.py
      orchestration/
        work_orders.py
        promotion.py
        swarms.py
        approval.py
      storage/
        sqlite.py
        models.py
      adapters/
        local_files.py
        git_repo.py
        notion_export.py
        obsidian_vault.py
      prompts/
        translator.md
        foreman.md
        critic.md
  tests/
  examples/
    primitive-patterns-run/
```

---

## 12. Approval Gates

CanonForge uses three write modes.

| Mode | Behavior |
|---|---|
| Plan mode | Produces a work order and proposed structure. |
| Patch review mode | Produces diffs and asks for approval. |
| Trusted patch mode | Writes approved file categories inside a configured scope. |

Default:

```text
plan mode -> patch review mode
```

Trusted patch mode should be project-configured.

```yaml
trusted_patch:
  allowed_paths:
    - docs/agentic-flows/
    - docs/sacred-geometry/
    - data/fixtures/
  require_review_for:
    - deletion
    - source_policy_change
    - instruction_scope_change
    - schema_breaking_change
```

---

## 13. Instruction Scoping

CanonForge treats instructions as scoped records rather than universal background noise.

### Instruction object

```yaml
instruction:
  id:
  text:
  normalized_positive_contract:
  scope:
    - current_run
    - repo_docs
    - generated_curriculum_material
    - agent_architecture
    - final_answer
  applies_to:
    - outline
    - schema
    - patch_plan
    - full_prose
    - code
    - comments
  strength: preference | default | hard_rule
  expiration: current_turn | current_run | workspace_default | project_default
```

### Positive contract examples

```yaml
- text: "Use structural outputs first."
  normalized_positive_contract: "Prefer outlines, schemas, task packets, and patch proposals before long prose."

- text: "Keep generated curriculum artifacts controllable."
  normalized_positive_contract: "Use scoped drafts, labeled sections, and approval gates for curriculum-facing prose."

- text: "Protect domain boundaries."
  normalized_positive_contract: "Apply drawing-studio rules to drawing-studio artifacts and repo-architecture rules to architecture docs."
```

---

## 14. MVP Build Plan

### MVP 1: Local console and file ingestion

- create CLI shell
- load workspace config
- ingest markdown and text folders
- create run records
- print source cards

### MVP 2: Translator and Foreman

- parse user requests into task packets
- create work orders
- choose agents
- produce plan-mode outputs

### MVP 3: Concept extraction and document architecture

- extract concept atoms
- cluster concepts
- propose canonical document locations
- produce file tree suggestions

### MVP 4: Patch review

- generate markdown file patches
- show diffs
- apply approved edits
- log patch results

### MVP 5: Promotion and swarms

- allow task agents to request temporary Foreman status
- run bounded swarms
- merge swarm outputs
- present decision packets

### MVP 6: Repo integration

- detect git status
- create branches
- commit approved patches
- optionally open PRs

---

## 15. First Useful Run

Command:

```bash
canonforge chat --workspace ./ArtisanalCanvas
```

User:

```text
ingest docs/sacred-geometry and propose what agentic docs are missing
```

Expected output:

```text
Ingested 5 docs.
Detected concept systems:
- sacred geometry taxonomy
- visualization asset types
- source and rights guidance
- vector vs raster policy
- image brief production

Suggested new docs:
1. docs/agentic-flows/canonforge-cli-architecture.md
2. docs/agentic-flows/instruction-scope-policy.md
3. docs/agentic-flows/agent-promotion-protocol.md
4. docs/agentic-flows/swarm-work-order-schema.md

Recommended next command:
plan docs/agentic-flows/instruction-scope-policy.md
```

---

## 16. Implementation Notes

### Local runtime

Recommended stack:

```text
Python 3.11+
Typer or Click for CLI
Rich for terminal UI
SQLite for state
Pydantic for schemas
GitPython or subprocess git for repo operations
OpenAI Agents SDK for multi-agent orchestration
```

### Config file

```yaml
workspace:
  name: ArtisanalCanvas
  root: .

modes:
  default_write_mode: patch_review
  default_output_level: structure

agents:
  translator: enabled
  foreman: enabled
  ingestion: enabled
  concept_extractor: enabled
  canon_mapper: enabled
  document_architect: enabled
  schema_agent: enabled
  critic: enabled
  patch_agent: enabled

paths:
  inbox: .canonforge/inbox
  logs: .canonforge/logs
  patches: .canonforge/patches
  cache: .canonforge/cache
```

---

## 17. Interface Contract

Every agent response should include:

```yaml
agent_response:
  agent:
  role:
  task_id:
  summary:
  structured_output:
  confidence:
  needs_user_decision:
  next_action:
```

Every user-facing run summary should include:

```yaml
run_summary:
  completed:
  proposed:
  changed_files:
  unresolved_decisions:
  recommended_next_command:
```

---

## 18. Next Documents

Recommended follow-up docs:

```text
docs/agentic-flows/instruction-scope-policy.md
docs/agentic-flows/agent-promotion-protocol.md
docs/agentic-flows/swarm-work-order-schema.md
docs/agentic-flows/canonforge-mvp-build-plan.md
docs/agentic-flows/local-cli-command-reference.md
```

These should stay architecture-first and patch-friendly.
