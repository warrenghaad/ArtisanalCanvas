# StudiOS System Brain in a Hub-and-Spoke GitHub System

## What we are building

StudiOS is not one application and it is not one enormous synchronized vault. It
is a family of distinct systems that share a brain, contracts, and a controlled
way of exchanging work.

CanonForge is the first executable part of that brain. It converts an informal
request into a traceable sequence:

```text
speech or source material
-> task packet
-> scoped instructions
-> Foreman work order
-> bounded agent assignments
-> reviewable artifacts
-> later: approved patch in the correct repository
```

MVP 1 gave the brain sensory intake and memory: local ingestion, source cards,
run records, and SQLite state. MVP 2 gives it executive function: a Translator
that interprets intent and a Foreman that creates bounded work orders. It still
does not act on a repository without a later approval gate.

## The hub is a control plane, not a storage heap

The hub repository should own the system-wide intelligence that every product
needs to interpret consistently:

- CanonForge and its agent contracts
- shared identifiers and vocabulary registries
- instruction-scope and approval policies
- cross-repository project registry
- work-order, source-card, patch-plan, and run-summary schemas
- adapters that know how to inspect or address a spoke
- validation rules for movement between research, build, and operation layers
- references to cross-repository decisions and relationships

The hub should not contain copied working trees from every spoke. It should not
become an Obsidian-style recursive mirror. It remembers *where authority lives*,
how systems relate, and what contract permits information to move between them.

## The spokes retain domain authority

Each spoke repository owns its real implementation, domain-specific documents,
tests, assets, and release history. Likely spokes include:

| Spoke | Owns |
| --- | --- |
| ArtisanalCanvas | Visual learning application, Academy, Nash Room, Prism, drawing and curriculum surfaces |
| Euclid Studio | Geometric and primitive-generative studio implementation |
| Research / Writing / Imaging engine | Retrieval, evidence, source boards, writing, and image-production pipelines |
| Mesopotamia curriculum | Pilot curriculum canon, lesson assets, artifact annotations, and exports |
| SACE / school operations | Student, teacher, behavior, intervention, and operational systems |
| TripSpanishTutor / Vallarta Voz | Spanish learning, travel, literature, and atelier workflows |

A spoke can use shared contracts without surrendering its own source of truth.
The ArtisanalCanvas repository, for example, remains authoritative for its React
and Express application. The hub can plan a change to it, but the actual change
is reviewed and committed in ArtisanalCanvas.

## How CanonForge moves work through the system

1. The user speaks naturally or drops material into an inbox.
2. CanonForge records the source and creates a task packet.
3. The task packet identifies the domain, target spoke, output rung, constraints,
   and approval requirement.
4. The Foreman selects only the agents needed for that bounded task.
5. Agents read from the authoritative spoke and return structured artifacts.
6. CanonForge proposes canonical placement or a patch plan.
7. The user approves, narrows, redirects, or rejects the proposal.
8. A later patch stage creates a branch and pull request in the target spoke.
9. The hub records the resulting repository, commit, pull request, and contract
   relationship; it does not copy the entire spoke back into itself.

## GitHub's role in the brain

GitHub supplies durable, distributed authority:

- repositories establish domain boundaries;
- commits record what became true and when;
- branches isolate proposed thought from accepted canon;
- pull requests are human review gates;
- issues hold unresolved work rather than contaminating canonical documents;
- tags and releases identify dependable versions of shared contracts;
- repository ownership prevents one automation from rewriting every system.

The local SQLite database is working memory. GitHub is durable memory. SQLite can
record a run, intermediate task packet, or abandoned proposal. A Git commit or
merged pull request records an accepted change to a spoke's canon.

## The hub registry

The hub eventually needs a small registry, not a folder of cloned repositories.
Each spoke record should contain:

```yaml
spoke_id:
repository:
domain:
authority_for:
default_branch:
accepted_contract_versions:
allowed_patch_paths:
required_review_gates:
depends_on:
publishes:
```

Cross-repository relationships should use stable identifiers and repository URLs
or commit references. They should never be implemented by duplicating a vault
inside another vault.

## Why the system matches the way the user's brain works

The user does not think in a single hierarchy. A geometric element can be
simultaneously mathematical, aesthetic, ideological, mechanical, cognitive, and
pedagogical. The hub preserves those cross-domain relationships. The spokes keep
each manifestation buildable and operationally coherent.

The hub therefore behaves less like a filing cabinet and more like a nervous
system:

- it receives signals without confusing them with canon;
- it routes a signal to the right functional system;
- it preserves relationships across systems;
- it keeps local expertise local;
- it requests conscious approval before durable action;
- it remembers decisions without recursively copying their entire context.

This allows the mycelial structure to exist as typed relationships among sources
of truth rather than as duplicated folders.

## Immediate architecture boundary

For the present ArtisanalCanvas build:

- `StudiOS0.SYSTEM-BRAIN_CNS-Functionality/canonforge/` is the canonical
  CanonForge package location.
- ArtisanalCanvas is currently both the development host for CanonForge and a
  spoke CanonForge can inspect.
- CanonForge runtime state remains local under `.canonforge/`.
- No agent writes product files during MVP 2.
- Future extraction into a dedicated StudiOS hub repository should preserve
  package history rather than copy the folder into multiple repositories.

The next architectural milestone is MVP 3: concept extraction and document
architecture. That is where the brain begins turning source cards into concept
atoms, clusters, and proposed canonical locations—still before patching.
