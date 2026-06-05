# Autonomous Image Curation Workflow
**Human-in-the-Loop with Visibility and Control Gates**

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTONOMOUS OPERATIONS                         │
│                    (Always Running)                              │
├─────────────────────────────────────────────────────────────────┤
│  1. Auto-tag extracted images                                    │
│  2. Auto-search when artifact highlighted                        │
│  3. Auto-pull artifacts needed by sections                       │
│  4. Auto-determine overlay needs                                 │
│  5. Auto-append selected content                                 │
│  6. Auto-code when triggered                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    VISIBILITY LAYER                              │
│                    (You See Everything)                          │
├─────────────────────────────────────────────────────────────────┤
│  • Real-time dashboard showing all autonomous actions            │
│  • Live feed of searches, tags, matches                          │
│  • Content preview before append                                 │
│  • Code diffs before execution                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CONTROL GATES                                 │
│                    (You Decide)                                  │
├─────────────────────────────────────────────────────────────────┤
│  GATE 1: Section Prioritization (Semi-Autonomous)               │
│    • System suggests priority order                              │
│    • You adjust/approve                                          │
│                                                                  │
│  GATE 2: Artifact Approval (Manual)                              │
│    • Approve all → Deploy to curriculum                          │
│    • Flag some → Send to autonomous diagramming                  │
│    • Reject → Re-search                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CONDITIONAL AUTOMATION                        │
├─────────────────────────────────────────────────────────────────┤
│  IF approved → Auto-deploy to sections                           │
│  IF flagged → Auto-generate diagrams                             │
│  IF rejected → Auto-re-search with different keywords            │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Workflow

### Phase 1: Autonomous Background Operations

#### 1.1 Auto-Tag Images (Always Running)
```
TRIGGER: New image added to any directory
ACTION:
  - Extract visual features (CLIP embeddings)
  - Generate keyword tags
  - Match to artifact descriptions
  - Score similarity
  - Update database
VISIBILITY: Live tag feed in dashboard
NO GATE: Runs automatically
```

#### 1.2 Auto-Search on Highlight (Interactive)
```
TRIGGER: You highlight text in artifact description
ACTION:
  - Extract highlighted keywords
  - Query curator_cli (museum search)
  - Query local web-embeddings index for semantic source hints
  - Include licensed image guide sources when available
  - Query stock photo APIs
  - Fetch top 5 candidates
  - Run CLIP + SafeSearch validation
  - Display results in sidebar
VISIBILITY: Search results appear immediately
NO GATE: Instant feedback
```

#### 1.3 Auto-Pull Artifacts by Section (Scheduled)
```
TRIGGER: Section manifest is loaded/updated
ACTION:
  - Parse section content for artifact needs
  - Extract artifact descriptions
  - Add to curation queue
  - Auto-search for each artifact
  - Present results for approval
VISIBILITY: Section artifact panel shows status
SEMI-AUTONOMOUS: System identifies needs, you see list
```

#### 1.4 Auto-Determine Overlay Needs (Contextual)
```
TRIGGER: Image assigned to artifact
ACTION:
  - Analyze image content
  - Determine if annotations needed:
    - Labels for diagram parts
    - Scale indicators
    - Directional arrows
    - Measurement overlays
  - Generate overlay specification
  - Queue for rendering
VISIBILITY: Overlay preview shown
NO GATE: Generates suggestions automatically
```

#### 1.5 Auto-Append Content on Selection (Interactive)
```
TRIGGER: You select content + click "Append"
ACTION:
  - Validate content format
  - Determine append location (section/subsection)
  - Generate markdown/HTML
  - Preview changes
  - Await your confirmation
VISIBILITY: Diff preview before append
GATE: Click "Confirm Append" to execute
```

#### 1.6 Auto-Code When Triggered (On Demand)
```
TRIGGER: You click "Generate Code" or system detects need
ACTION:
  - Analyze requirements
  - Generate code (diagram rendering, image processing, etc.)
  - Run tests
  - Show code diff
  - Await approval
VISIBILITY: Code review panel
GATE: Click "Deploy Code" to execute
```

---

### Phase 2: Semi-Autonomous Section Prioritization

```javascript
// Runs every hour or on manual trigger
async function prioritizeSections() {
  const sections = await getAllSections();

  // System scoring algorithm
  const scored = sections.map(section => ({
    ...section,
    priorityScore: calculatePriority(section),
    reasoning: explainPriority(section)
  }));

  // Sort by score
  scored.sort((a, b) => b.priorityScore - a.priorityScore);

  // Present to user
  return {
    suggested: scored,
    allowReorder: true, // You can drag-reorder
    reasoning: scored.map(s => s.reasoning)
  };
}

function calculatePriority(section) {
  let score = 0;

  // Week 1-2 get highest priority (missing content)
  if (section.week <= 2) score += 100;

  // A1 sections (Hook + Agenda) across all weeks
  if (section.code === 'A1') score += 80;

  // Sections with most unmatched artifacts
  score += section.unmatchedArtifacts * 5;

  // Sections on critical path (Day A before Day B)
  if (section.day === 'A') score += 20;

  // Earlier weeks prioritized
  score -= section.week * 5;

  return score;
}
```

**Your Control**:
- System shows suggested priority list
- You can drag-reorder any section
- Click "Approve Priority" → System works in this order
- Automatic updates as sections complete

---

### Phase 3: Artifact Approval Gate (Manual Control)

```
SYSTEM PRESENTS: For each artifact with candidates

┌────────────────────────────────────────────────────────┐
│ Artifact: Burney Relief (Queen of the Night)           │
│ Week III, Section A4                                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Image Preview]          Description:                 │
│                           Terracotta plaque showing... │
│                                                        │
│  Source: British Museum                                │
│  CLIP Score: 0.87 (HIGH)                              │
│  SafeSearch: ✅ PASSED                                 │
│  License: CC BY-NC-SA 4.0                             │
│                                                        │
│  Overlay Needs (Auto-Detected):                       │
│    □ Label: "Lion's paw feet"                         │
│    □ Label: "Owl companions"                          │
│    □ Scale indicator                                   │
│                                                        │
│  [Approve All] [Flag for Diagramming] [Reject]       │
└────────────────────────────────────────────────────────┘
```

**Your Actions**:

1. **Approve All** →
   - Image deployed to section
   - Overlays rendered (if any)
   - CSV updated
   - Filename paired: `G3-3A__Ishtar_8PointedStar_DayA_S04_A01__BurneyRelief__BRITISH_MUSEUM.jpg`

2. **Flag for Diagramming** →
   - Send to autonomous diagram generator
   - System creates annotated version
   - Returns for your review
   - You approve or request changes

3. **Reject** →
   - System re-searches with modified keywords
   - Tries next source (stock photos, AI generation)
   - Presents new candidates

**Batch Actions**:
- Select multiple artifacts
- Approve all at once: `[Approve Selected (23)]`
- Flag all for diagramming: `[Diagram Selected (5)]`

---

### Phase 4: Autonomous Diagramming Development

```
TRIGGER: You flag artifact for diagramming
AUTONOMOUS PROCESS:

1. ANALYZE IMAGE
   - Detect key features (CLIP + object detection)
   - Identify label locations
   - Determine annotation style

2. GENERATE DIAGRAM CODE
   - Create SVG overlay
   - Position labels
   - Add scale/arrows
   - Style according to curriculum design system

3. RENDER PREVIEW
   - Composite image + overlay
   - Generate multiple variations
   - Show side-by-side comparison

4. PRESENT FOR APPROVAL
   ┌──────────────────────────────────────────┐
   │  Original    Diagram V1    Diagram V2   │
   │  [Image]     [Image+SVG]   [Image+SVG]  │
   │                                          │
   │  [Approve V1] [Approve V2] [Regenerate] │
   └──────────────────────────────────────────┘

5. ON APPROVAL
   - Save final composite
   - Deploy to section
   - Update database
```

**Autonomous Regeneration**:
- If you click "Regenerate", system tries:
  - Different label positions
  - Different annotation styles
  - Different color schemes
- Shows new variations
- Loops until you approve

---

### Phase 5: Real-Time Visibility Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  AUTONOMOUS CURATION SYSTEM - LIVE VIEW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Progress] 34/159 artifacts curated (21%)  [Pause] [Resume]   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ LIVE FEED                                                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ 14:23:45 🔍 Searching: "cylinder seal ishtar"           │  │
│  │ 14:23:47 ✅ Found 3 candidates (British Museum)          │  │
│  │ 14:23:48 🤖 Running CLIP validation...                   │  │
│  │ 14:23:50 ✅ CLIP score: 0.82 (HIGH confidence)           │  │
│  │ 14:23:51 🛡️  Running SafeSearch...                       │  │
│  │ 14:23:52 ✅ SafeSearch: PASSED                            │  │
│  │ 14:23:52 ⏸️  Awaiting approval: Artifact #45             │  │
│  │                                                           │  │
│  │ 14:24:10 🏷️  Auto-tagged image15.png: [ishtar, gate]    │  │
│  │ 14:24:12 📊 Overlay needs detected: 2 labels, 1 scale   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PENDING APPROVAL (5)                      [Review All]   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ □ Artifact #45: Cylinder seal (CLIP: 0.82)              │  │
│  │ □ Artifact #47: Kudurru stone (CLIP: 0.79)              │  │
│  │ □ Artifact #51: Ziggurat reconstruction (CLIP: 0.71)    │  │
│  │ □ Artifact #53: Cuneiform tablet (CLIP: 0.68)           │  │
│  │ □ Artifact #58: Lightning bolt symbol (CLIP: 0.75)      │  │
│  │                                                           │  │
│  │ [Approve Selected] [Flag for Diagramming] [Reject]      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SECTION PRIORITY QUEUE (Semi-Autonomous)                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ 1. ⬆️ Week I - All sections (16 missing)  [Adjust ↕️]    │  │
│  │ 2. ⬆️ Week II - All sections (16 missing) [Adjust ↕️]    │  │
│  │ 3. Week III, A1 - Hook + Agenda [Adjust ↕️]              │  │
│  │ 4. Week IV, A1 - Hook + Agenda [Adjust ↕️]               │  │
│  │ 5. Week III, A3 - Symbolic Chain (4 artifacts) [↕️]      │  │
│  │                                                           │  │
│  │ [Approve Priority] [Reorder Manually]                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ AUTONOMOUS DIAGRAMMING (2 in progress)                   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ 🎨 Generating: Artifact #23 (Compass rose)              │  │
│  │    Progress: Analyzing features... 45%                   │  │
│  │                                                           │  │
│  │ 🎨 Generating: Artifact #31 (Angle diagram)             │  │
│  │    Progress: Rendering overlay... 78%                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ HIGHLIGHT SEARCH (Interactive)                           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Highlighted: "eight-pointed star in celestial triad"    │  │
│  │                                                           │  │
│  │ 🔍 Auto-searching...                                     │  │
│  │ ✅ Found 5 results:                                       │  │
│  │   1. British Museum (CLIP: 0.91) [Preview]              │  │
│  │   2. Getty Villa (CLIP: 0.85) [Preview]                 │  │
│  │   3. Louvre (CLIP: 0.78) [Preview]                      │  │
│  │   4. Unsplash (CLIP: 0.62) [Preview]                    │  │
│  │   5. AI Generated (pending) [Generate]                   │  │
│  │                                                           │  │
│  │ [Select for Artifact #__]                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation: Autonomous Agents

### Agent 1: Tag Monitor (Always Running)
```javascript
// Watches for new images, auto-tags immediately
class TagMonitorAgent {
  constructor() {
    this.watcher = chokidar.watch(['ppt-extracted-content/**', 'curated-images/**']);
    this.watcher.on('add', path => this.autoTag(path));
  }

  async autoTag(imagePath) {
    const features = await extractCLIPFeatures(imagePath);
    const tags = await generateKeywordTags(features);
    const matches = await matchToArtifacts(tags);

    // Update database
    await db.query(`
      INSERT INTO image_tags (image_path, tags, clip_features, matched_artifacts)
      VALUES ($1, $2, $3, $4)
    `, [imagePath, tags, features, matches]);

    // Emit to dashboard
    io.emit('tag:created', { imagePath, tags, matches });
  }
}
```

### Agent 2: Highlight Search Handler (Interactive)
```javascript
// Listens for highlight events from frontend
class HighlightSearchAgent {
  async onHighlight(text, userId) {
    // Emit "searching" status
    io.to(userId).emit('search:started', { text });

    // Parallel search
    const [museumResults, stockResults] = await Promise.all([
      this.searchMuseums(text),
      this.searchStockPhotos(text)
    ]);

    // Validate all
    const validated = await this.validateCandidates([
      ...museumResults,
      ...stockResults
    ], text);

    // Return to user
    io.to(userId).emit('search:results', validated);
  }
}
```

### Agent 3: Section Artifact Puller (Scheduled)
```javascript
// Runs every 30 minutes or on section load
class SectionArtifactPullerAgent {
  async pullArtifactsForSection(sectionId) {
    const section = await db.query(
      'SELECT * FROM sections WHERE id = $1',
      [sectionId]
    );

    // Parse manifest for artifact needs
    const artifacts = this.parseArtifactNeeds(section.content);

    // Check which are already matched
    const unmatched = await this.filterUnmatched(artifacts);

    // Auto-search for each
    for (const artifact of unmatched) {
      await this.queueForCuration(artifact);
    }

    // Emit status
    io.emit('section:artifacts', {
      sectionId,
      total: artifacts.length,
      matched: artifacts.length - unmatched.length,
      unmatched: unmatched.length
    });
  }
}
```

### Agent 4: Overlay Needs Detector (Contextual)
```javascript
// Runs when image assigned to artifact
class OverlayNeedsAgent {
  async detectOverlayNeeds(imageId, artifactId) {
    const image = await loadImage(imageId);
    const artifact = await loadArtifact(artifactId);

    // Analyze if diagram/labels needed
    const analysis = await this.analyzeImageContent(image, artifact);

    const needs = {
      labels: analysis.labelableFeatures,
      scale: analysis.needsScale,
      arrows: analysis.needsDirectionalArrows,
      measurements: analysis.needsMeasurements
    };

    // Store and emit
    await db.query(
      'UPDATE image_candidates SET overlay_needs = $1 WHERE id = $2',
      [needs, imageId]
    );

    io.emit('overlay:detected', { imageId, needs });

    return needs;
  }
}
```

### Agent 5: Autonomous Diagram Generator
```javascript
// Runs when flagged for diagramming
class DiagramGeneratorAgent {
  async generate(imageId, artifactId) {
    io.emit('diagram:started', { imageId });

    // Load image and overlay needs
    const image = await loadImage(imageId);
    const needs = await getOverlayNeeds(imageId);

    // Generate 3 variations
    const variations = await Promise.all([
      this.generateVariation(image, needs, 'minimal'),
      this.generateVariation(image, needs, 'standard'),
      this.generateVariation(image, needs, 'detailed')
    ]);

    // Emit for approval
    io.emit('diagram:ready', {
      imageId,
      variations,
      awaitingApproval: true
    });
  }

  async generateVariation(image, needs, style) {
    // Create SVG overlay
    const svg = createSVGOverlay(needs, style);

    // Composite with image
    const composite = await compositeImageWithSVG(image, svg);

    return {
      style,
      imagePath: await saveComposite(composite),
      svgPath: await saveSVG(svg)
    };
  }
}
```

---

## Control Flow Summary

```
AUTONOMOUS (No Human Input):
  ✅ Tag new images
  ✅ Search on highlight
  ✅ Pull artifacts for sections
  ✅ Detect overlay needs
  ✅ Generate diagram variations

SEMI-AUTONOMOUS (Human Adjusts):
  🔄 Prioritize sections → System suggests, you reorder

MANUAL GATES (Human Approves):
  🚦 Approve artifacts → Deploy or flag for diagramming
  🚦 Approve diagrams → Deploy or regenerate
  🚦 Approve code changes → Execute or reject

VISIBILITY (Always On):
  👁️ Live feed of all autonomous actions
  👁️ Real-time progress dashboard
  👁️ Content preview before any changes
```

---

## Next Steps

1. **Implement Real-Time Dashboard** (React + WebSockets)
2. **Build Autonomous Agents** (5 agents above)
3. **Create Approval UI** (Artifact review interface)
4. **Integrate Highlight Search** (Frontend selection → backend search)
5. **Build Diagram Generator** (SVG overlay system)
6. **Test End-to-End** (One artifact through full pipeline)

This gives you:
- **Full visibility** into what the system is doing
- **Control gates** at critical decision points
- **Autonomous background work** to accelerate curation
- **Interactive tools** (highlight search, section pulling)
- **Conditional automation** (approved → deploy, flagged → diagram)
