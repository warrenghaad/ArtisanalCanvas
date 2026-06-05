# RWI Image Sourcing Integration

## Overview

Connect your existing RWI (Read-Write-Interface) system with the autonomous image curation workflow to enable:
- Drag & drop images into lesson sections
- Automatic artifact searching when sections are filled
- Interactive approval of sourced images
- Autonomous diagram generation for math/science content
- Real-time validation and progress tracking

## Current Implementation (What’s Actually Wired)

- API routes live at `mesopotamia-backend/server/routes/rwi-image-routes.mjs` and mount under `/api/rwi/images/*`.
- Candidates + approvals persist to Supabase *if* you apply `mesopotamia-backend/sql/rwi.sql` (fallback remains local JSON files).
- Needs CSV is treated as import/export: use `/api/rwi/needs/db/import` to load into DB and `/api/rwi/needs/db/export` to write it back (with timestamped backups).
- Optional DB-first mode for the existing RWI Studio UI: set `RWI_NEEDS_SOURCE=db` to make `/api/rwi/needs` + `/api/rwi/needs/update` use Supabase and keep the CSV file updated as a compatible export.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           RWI EDITOR (Existing)                             │
│           /public/rwi-editor.html                           │
├─────────────────────────────────────────────────────────────┤
│  Left Panel:          Center:              Right Panel:     │
│  Content Sources      Lesson Sections      NEW: Images      │
│                       A1-A8, B1-B8                          │
│                                            - Artifact Queue  │
│                                            - Search Results  │
│                                            - Approval UI     │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│           NEW RWI IMAGE API ENDPOINTS                       │
├─────────────────────────────────────────────────────────────┤
│  /api/rwi/images/artifacts/:grade/:week                     │
│  /api/rwi/images/search - Trigger autonomous search         │
│  /api/rwi/images/ingest-content - Parse content + auto-search│
│  /api/rwi/images/candidates/:artifactId                     │
│  /api/rwi/images/approve - Approve image for section        │
│  /api/rwi/images/generate-diagram - Generate math diagram   │
│  /api/rwi/images/status/:grade/:week - Get all image status │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│           AUTONOMOUS CURATION AGENTS                        │
├─────────────────────────────────────────────────────────────┤
│  • Section Artifact Puller (watches RWI section fills)      │
│  • Museum Search Agent (Python curator_cli wrapper)         │
│  • Diagram Generator Agent (SVG/p5.js for math/science)     │
│  • CLIP Validator (similarity scoring)                      │
│  • SafeSearch Filter (classroom safety)                     │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│           DATA LAYER                                        │
├─────────────────────────────────────────────────────────────┤
│  • rwi/data/*.csv (import/export)                           │
│  • rwi/data/candidates.json + approvals.json (fallback)     │
│  • Supabase tables (primary when enabled):                  │
│    - rwi_needs                                               │
│    - rwi_image_candidate_sets                                │
│    - rwi_image_approvals                                     │
└─────────────────────────────────────────────────────────────┘
```

## Integration Steps

### Step 1: Extend RWI Editor UI

Add a third panel to the existing rwi-editor.html:

```html
<!-- Add after existing panels -->
<div class="image-panel">
  <h3>Images & Artifacts</h3>

  <!-- Artifact Queue -->
  <div id="artifact-queue">
    <h4>Artifacts Needed (0/15)</h4>
    <div id="artifact-list">
      <!-- Auto-populated as sections are filled -->
    </div>
  </div>

  <!-- Active Search -->
  <div id="active-search" style="display:none;">
    <h4>🔍 Searching...</h4>
    <div id="search-status"></div>
  </div>

  <!-- Candidates for Approval -->
  <div id="image-candidates">
    <h4>Review Images (3 pending)</h4>
    <div id="candidate-list">
      <!-- Cards with image preview + approve/reject buttons -->
    </div>
  </div>

  <!-- Approved Images -->
  <div id="approved-images">
    <h4>✅ Ready to Deploy (5)</h4>
    <div id="approved-list">
      <!-- Thumbnails with checkmarks -->
    </div>
  </div>
</div>
```

### Step 2: Add RWI Image API Routes

```javascript
// routes/rwiImageRoutes.js

import express from 'express';
import { db } from '../db.js';
import { sectionArtifactPuller } from '../agents/sectionArtifactPullerAgent.js';
import { museumSearchService } from '../services/museumSearchService.js';
import { diagramGenerator } from '../agents/diagramGeneratorAgent.js';

const router = express.Router();

// Get all artifacts needed for a lesson
router.get('/artifacts/:grade/:week', async (req, res) => {
  const { grade, week } = req.params;

  // Load from CSV
  const csv = await loadArtifactCSV(grade, week);

  // Check status in database
  const artifacts = await Promise.all(
    csv.map(async (artifact) => ({
      ...artifact,
      status: await getArtifactStatus(artifact.id),
      candidates: await getCandidates(artifact.id)
    }))
  );

  res.json({ artifacts });
});

// Trigger autonomous search for artifacts
router.post('/search', async (req, res) => {
  const { grade, week, section, artifactId } = req.body;

  // Queue for background processing
  await queueArtifactSearch(artifactId);

  // Return immediately
  res.json({
    status: 'queued',
    message: 'Autonomous search started'
  });

  // Process in background
  processArtifactSearch(artifactId);
});

// Get candidates for approval
router.get('/candidates/:artifactId', async (req, res) => {
  const { artifactId } = req.params;

  const candidates = await db.query(`
    SELECT * FROM image_candidates
    WHERE artifact_id = $1
    ORDER BY clip_similarity_score DESC
    LIMIT 5
  `, [artifactId]);

  res.json({ candidates: candidates.rows });
});

// Approve image for artifact
router.post('/approve', async (req, res) => {
  const { candidateId, artifactId, sectionCode } = req.body;

  // Move from candidates to curated_images
  await approveImage(candidateId, artifactId, sectionCode);

  // Emit WebSocket update
  io.emit('image:approved', { artifactId, sectionCode });

  res.json({ success: true });
});

// Generate diagram (for math/science artifacts)
router.post('/generate-diagram', async (req, res) => {
  const { artifactId, description, type } = req.body;

  // Check if it's a generative component (p5.js)
  if (shouldUseGenerativeComponent(description)) {
    const componentSpec = await generateP5Component(description, type);
    res.json({
      type: 'generative',
      component: componentSpec
    });
  } else {
    // Static SVG diagram
    const diagram = await diagramGenerator.generate(artifactId, description);
    res.json({
      type: 'static',
      imagePath: diagram.path
    });
  }
});

// Get overall image status for lesson
router.get('/status/:grade/:week', async (req, res) => {
  const { grade, week } = req.params;

  const status = await db.query(`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
      COUNT(CASE WHEN status = 'searching' THEN 1 END) as searching
    FROM curriculum_artifacts
    WHERE grade = $1 AND week = $2
  `, [grade, week]);

  res.json(status.rows[0]);
});

export default router;
```

### Step 2.5: Add Web Embeddings Knowledge Index (Optional but Recommended)

This powers semantic source hints during `/api/rwi/images/search` using a local embeddings index.

1) Define sources (files + sites) for the embeddings index:

`data/embeddings/sources.json`

1) Crawl a domain and build embeddings:

```bash
node scripts/web-embeddings-crawler.js --url "https://example.com" \
  --out "data/embeddings/index.json" \
  --max-pages 100
```

2) Index local docs (e.g., licensed image guide, tutorial):

```bash
node scripts/embeddings-indexer.js --sources data/embeddings/sources.json
```

3) Run continuously (watch files + scheduled crawls):

```bash
node scripts/embeddings-daemon.js --sources data/embeddings/sources.json
```

4) Set optional env vars:

```
OPENAI_API_KEY=...
EMBEDDINGS_MODEL=text-embedding-3-small
EMBEDDINGS_INDEX_PATH=/Users/samimajeed/mesopotamia-backend/data/embeddings
```

5) `/api/rwi/images/search` will attach `relatedSources` when the index exists.

### Step 3: Connect to Existing RWI Workflow

Modify your section drop handler to trigger artifact search:

```javascript
// In rwi-editor.html or client-side JS

async function onSectionContentDropped(sectionCode, content) {
  // Existing: Save content to section
  await saveSectionContent(sectionCode, content);

  // NEW: Extract artifacts from section
  const artifacts = extractArtifacts(sectionCode, content);

  if (artifacts.length > 0) {
    // Update artifact queue in right panel
    updateArtifactQueue(artifacts);

    // Trigger autonomous search for each artifact
    for (const artifact of artifacts) {
      await fetch('/api/rwi/images/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: currentGrade,
          week: currentWeek,
          section: sectionCode,
          artifactId: artifact.id,
          description: artifact.description
        })
      });
    }

    // Show searching indicator
    showSearchingIndicator(artifacts.length);
  }
}

// Extract artifacts from section content
function extractArtifacts(sectionCode, content) {
  const artifacts = [];

  // Parse markdown for **Artifacts:** section
  const lines = content.split('\n');
  let inArtifacts = false;

  for (const line of lines) {
    if (line.includes('**Artifacts:**')) {
      inArtifacts = true;
      continue;
    }
    if (inArtifacts && line.trim().startsWith('-')) {
      const description = line.replace(/^-\s*/, '').trim();
      if (description && description !== 'None required') {
        artifacts.push({
          id: generateArtifactId(sectionCode, description),
          sectionCode,
          description
        });
      }
    }
    if (line.trim() === '---') {
      inArtifacts = false;
    }
  }

  return artifacts;
}
```

### Step 4: Real-Time Updates with WebSockets

```javascript
// Client-side WebSocket connection

const socket = io('http://localhost:3001');

// Listen for search results
socket.on('search:results', (data) => {
  const { artifactId, candidates } = data;
  displayCandidates(artifactId, candidates);
});

// Listen for autonomous tagging
socket.on('tag:created', (data) => {
  const { imagePath, tags, matches } = data;
  console.log('Auto-tagged:', imagePath, tags);
});

// Listen for diagram generation complete
socket.on('diagram:ready', (data) => {
  const { artifactId, variations } = data;
  displayDiagramVariations(artifactId, variations);
});

// Listen for approval updates
socket.on('image:approved', (data) => {
  const { artifactId, sectionCode } = data;
  moveToApprovedList(artifactId);
  updateSectionBadge(sectionCode, 'has-image');
});
```

### Step 5: Image Approval UI Component

```javascript
// Display image candidates for approval

function displayCandidates(artifactId, candidates) {
  const container = document.getElementById('candidate-list');

  candidates.forEach(candidate => {
    const card = document.createElement('div');
    card.className = 'candidate-card';
    card.innerHTML = `
      <div class="candidate-image">
        <img src="${candidate.image_url}" alt="${candidate.title}">
      </div>
      <div class="candidate-info">
        <h5>${candidate.title || 'Untitled'}</h5>
        <p class="source">${candidate.source_id}</p>
        <div class="scores">
          <span class="clip-score">
            CLIP: ${(candidate.clip_similarity_score * 100).toFixed(0)}%
          </span>
          <span class="safety ${candidate.safesearch_passed ? 'pass' : 'fail'}">
            ${candidate.safesearch_passed ? '✅ Safe' : '⚠️ Review'}
          </span>
        </div>
        <p class="artifact-desc">${candidate.artifact_description}</p>
      </div>
      <div class="candidate-actions">
        <button class="approve-btn" onclick="approveCandidate('${candidate.id}', '${artifactId}')">
          ✓ Approve
        </button>
        <button class="flag-btn" onclick="flagForDiagram('${candidate.id}')">
          📊 Diagram
        </button>
        <button class="reject-btn" onclick="rejectCandidate('${candidate.id}')">
          ✗ Reject
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function approveCandidate(candidateId, artifactId) {
  await fetch('/api/rwi/images/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      candidateId,
      artifactId,
      sectionCode: currentSection
    })
  });

  // UI updates via WebSocket
}

async function flagForDiagram(candidateId) {
  // Send to autonomous diagram generator
  await fetch('/api/rwi/images/generate-diagram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId })
  });

  showStatus('Generating diagram variations...');
}
```

### Step 6: Integration with Generative Components

For math/science artifacts, check if a generative p5.js component is better:

```javascript
// services/generativeComponentMatcher.js

export function shouldUseGenerativeComponent(artifactDescription) {
  const generativePatterns = [
    /equidistance/i,
    /rotation.*constant/i,
    /rolling.*shapes/i,
    /force distribution/i,
    /particle.*organization/i,
    /emergent/i
  ];

  return generativePatterns.some(pattern =>
    pattern.test(artifactDescription)
  );
}

export async function generateP5Component(description, type) {
  // Map artifact description to existing generative components
  const componentMap = {
    'equidistance': 'W1_DB2_Equidistance_Generative.jsx',
    'rotation': 'W1_DB3_Rotation_Interactive.jsx',
    'rolling': 'W1_DB4_Mechanics_Comparison.jsx'
  };

  // Or generate new component dynamically
  const componentCode = await generateFromTemplate(description, type);

  return {
    componentName: `Generated_${Date.now()}`,
    code: componentCode,
    props: extractPropsFromDescription(description)
  };
}
```

## Workflow Example

### User Creates Week 3, Section A3

1. **User drags content** from left panel into A3 section drop zone
2. **System extracts artifacts**:
   - "Eight-pointed star in isolation"
   - "Venus astronomical diagram"
3. **Right panel updates**: Shows 2 artifacts in queue
4. **Autonomous search starts** (background):
   - Museum search via curator_cli
   - Stock photo APIs
   - Diagram type detection
5. **Search results appear** (~10 seconds):
   - 3 candidates for eight-pointed star (British Museum, Getty, AI-generated)
   - 2 candidates for Venus diagram (Astronomy archives)
6. **User reviews in right panel**:
   - Sees image preview
   - Sees CLIP score (87%)
   - Sees SafeSearch status (✅ PASSED)
   - Clicks "Approve" on best candidate
7. **Image deployed**:
   - Moved to "Approved Images" section
   - Section A3 badge turns green (has image)
   - Image linked to section in database
8. **Generate SSOT** button now includes images

## CSS for Image Panel

```css
.image-panel {
  width: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  overflow-y: auto;
}

.candidate-card {
  background: white;
  color: #333;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.candidate-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.candidate-info h5 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.source {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
}

.scores {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.clip-score {
  background: #4CAF50;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
}

.safety.pass {
  background: #2196F3;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.candidate-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.candidate-actions button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.approve-btn {
  background: #4CAF50;
  color: white;
}

.flag-btn {
  background: #FF9800;
  color: white;
}

.reject-btn {
  background: #f44336;
  color: white;
}
```

## Quick Start

1. **Add image panel to rwi-editor.html**:
```bash
# Copy the HTML snippet above after existing panels
```

2. **Register new API routes**:
```javascript
// In server.js
import rwiImageRoutes from './routes/rwiImageRoutes.js';
app.use('/api/rwi/images', rwiImageRoutes);
```

3. **Start WebSocket for real-time updates**:
```javascript
// Already in your server, just emit new events
io.on('connection', (socket) => {
  console.log('RWI client connected');
});
```

4. **Test with one section**:
- Open rwi-editor.html
- Select Grade 3, Week 3
- Drag content into section A3
- Watch right panel populate with artifact search
- Approve an image
- Verify section badge turns green

## Next Steps

- [ ] Implement RWI image API endpoints
- [ ] Extend rwi-editor.html with image panel
- [ ] Connect Section Artifact Puller agent
- [ ] Test autonomous search with one artifact
- [ ] Add approval workflow UI
- [ ] Integrate with generative component registry
- [ ] Deploy to production

This creates a seamless workflow where **content and images are sourced together** in the same RWI interface.
