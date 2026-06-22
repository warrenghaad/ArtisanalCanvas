# Islamic Golden Age and Wider Islamic Geometry Pattern Library

This is the large-pattern section for the sacred geometry expansion. It is intentionally bigger than the other regional sections because Islamic geometric design gives the repo a complete pattern-generation engine: compass construction, polygon families, tessellation, strapwork, zellij, arabesque, jali, calligraphic proportion, and muqarnas.

## Teaching principle

Islamic geometry should be taught as a **construction language**, not as a decorative clip-art bucket.

Students should learn to ask:

1. What is the underlying grid?
2. Which polygon family generates the motif?
3. Where is the repeat unit?
4. Which lines are construction lines, which lines are final bands, and which spaces become color?
5. What surface carries the pattern: manuscript, tile, wood, stucco, carpet, screen, dome, vault, or floor?
6. Is the object devotional, architectural, scientific, courtly, domestic, or civic?

---

## 1. Master taxonomy

| Pattern family | Core geometry | Common surfaces | Suggested asset type |
| --- | --- | --- | --- |
| Circle grids | repeated circles and intersections | diagrams, pattern books, teaching sheets | SVG construction sheet |
| Square-root grid | square, diagonal, 45-degree axes | 4/8/16-point stars, tile, borders | SVG and Canvas overlay |
| Hexagonal grid | circles packed around a center, 60-degree axes | 6/12-point stars, rosettes, tile | SVG repeat diagram |
| Decagonal grid | pentagon/decagon, 36-degree logic | 5/10-point stars, girih networks | SVG plus step worksheet |
| Star polygons | chords connecting regular polygon vertices | tile, wood, manuscript ornament | construction animation |
| Rosettes | petal rotations around a center | tile centers, manuscript medallions | radial worksheet |
| Girih | polygon tile set plus strapwork lines | architecture, wood, tile, manuscripts | tile-set diagram and repeat editor |
| Zellij | cut-tile tessellation with color and grout | Moroccan/North African architecture | material raster plus SVG map |
| Strapwork | thickened interlacing bands | tile, carved stucco, wood, metal | over-under color overlay |
| Arabesque/islimi | scrolling vegetal geometry | manuscripts, tile, stucco, carpets | raster reference and vector skeleton |
| Calligraphic geometry | measured text and angular letterforms | inscriptions, friezes, manuscripts | respectful grid-only placeholder |
| Jali | perforated stone or wood lattice | screens, tombs, palaces, mosques | SVG cutout and light-shadow raster |
| Muqarnas | tiered cellular vaulting | domes, portals, mihrabs, iwans | section drawing and 3D blockout |
| Carpet field geometry | medallion, border, mihrab, repeated field | carpets and prayer rugs | decomposition overlay |
| Dome geometry | radial ribs, star center, ring hierarchy | domes, ceilings | perspective dome grid |

---

## 2. Construction families by polygon system

### 2.1 Four/eight/sixteen family

**Visual character:** stable, crystalline, square-based, good for beginner construction.

**Primitives:** circle, square, diagonal, perpendicular bisector, octagon.

**Build path:**

1. Draw a circle.
2. Draw vertical and horizontal diameters.
3. Add two diagonals at 45 degrees.
4. Connect every other point to form an 8-point star.
5. Thicken selected lines into strapwork.
6. Repeat by translating the square cell.

**Student exercises:**

- Beginner: construct an 8-point star from a square and circle.
- Intermediate: add a border and repeat unit.
- Advanced: project the star pattern onto a tiled floor in one-point perspective.

**Image needs:**

- SVG: `islamic-eight-point-star-construction.svg`
- Worksheet PNG/WebP: `islamic-eight-point-star-step-sheet.webp`
- Canvas overlay: `8_point_star_grid_overlay`

### 2.2 Six/twelve family

**Visual character:** honeycomb, radial, stable but more circular than square-based patterns.

**Primitives:** packed circles, equilateral triangle, hexagon, 6-point star, 12-point rosette.

**Build path:**

1. Draw one center circle.
2. Step the compass around the circumference to mark six equal points.
3. Connect adjacent points for a hexagon.
4. Connect alternating points for a six-point star.
5. Use secondary intersections to generate 12 petals or a ring of small hexagons.
6. Translate the unit on a triangular grid.

**Student exercises:**

- Create a hexagon from circles only.
- Extract both flower and star motifs from the same grid.
- Compare honeycomb structure to tile structure.

**Image needs:**

- SVG: `islamic-hexagon-rosette-circle-grid.svg`
- Animation: compass stepping around a circle
- Raster: tile surface or manuscript reference board

### 2.3 Five/ten family

**Visual character:** more complex, slightly uncanny, excellent for girih and decagonal networks.

**Primitives:** pentagon, decagon, pentagram, kite, dart, rhombus, bowtie.

**Build path:**

1. Draw a circle and construct a pentagon or decagon.
2. Connect non-adjacent vertices to create star lines.
3. Extract kite and dart modules.
4. Repeat modules to form decagonal medallions.
5. Add strapwork line paths through tile centers.
6. Use color to separate tile geometry from band geometry.

**Student exercises:**

- Draw a decagon and locate 36-degree increments.
- Convert a decagon into a ten-point star.
- Build a mini girih patch from kite, dart, and rhombus pieces.

**Image needs:**

- SVG: `islamic-decagon-girih-tile-set.svg`
- Interactive: draggable girih tile pieces
- Raster: architectural tile reference board

### 2.4 Mixed grids

Many mature patterns combine square, triangular, and decagonal logic. Teach them only after students can detect the grid family.

**Student question:** Is this pattern truly mixed, or am I seeing decorative complexity on top of one simple grid?

**Image needs:**

- Overlay that lets users toggle: construction grid, final star lines, strapwork bands, color cells.

---

## 3. Girih system

Girih design can be taught as two linked layers:

1. **Tile layer:** polygon pieces such as decagon, pentagon, hexagon, bowtie, rhombus, kite, and dart.
2. **Line layer:** strapwork paths drawn across those tile pieces.

### Drawing translation

| Layer | What student draws | What app should show |
| --- | --- | --- |
| Scaffold | polygon grid and tile edges | thin gray construction lines |
| Final band | interlacing strapwork | thick dark line or colored band |
| Crossing logic | over-under moments | small bridge gaps or color-coded crossings |
| Color field | tile pieces and negative space | limited palette fill map |
| Surface | wall, dome, manuscript page, wood panel | raster material reference |

### Girih starter tile set

| Tile | Geometry | Drawing note |
| --- | --- | --- |
| Decagon | 10 sides | hub tile, often creates star centers |
| Pentagon | 5 sides | links decagonal hubs |
| Hexagon | 6 sides | transition tile, good for mixed networks |
| Bowtie | concave/paired triangles | creates directional tension |
| Rhombus | diamond | excellent for extending bands |
| Kite/dart | pentagonal subdivision logic | useful for aperiodic-looking effects |

### Suggested interactive tool

A future dock viewer called **Girih Tile Builder** could let students:

- drag tile pieces onto a grid
- toggle edge snapping
- reveal strapwork paths
- export SVG
- create a practice worksheet from the generated pattern

---

## 4. Zellij system

Zellij is not just flat tessellation. It is also **cut material, color rhythm, grout line, labor, and architectural surface**.

### Drawing layers

1. Compass/polygon construction
2. Repeat-unit layout
3. Individual cut-tile boundaries
4. Grout network
5. Color assignment
6. Architectural placement
7. Light and surface texture

### Beginner zellij exercise

1. Draw a square tile field.
2. Place an 8-point star in the center.
3. Fill the corners with small kite/triangle shapes.
4. Repeat the square module.
5. Add grout gaps.
6. Assign a three-value color map.

### Advanced zellij exercise

Create one pattern as:

- clean construction SVG
- colored tile map
- raster tile texture
- perspective wall/floor placement

This turns a pattern into a full drawing lesson instead of a flat ornament sticker.

---

## 5. Arabesque and islimi

Arabesque is often taught badly as loose scrolling decoration. In this repo, treat it as **plant geometry with rules**.

### Construction logic

| Component | Primitive | Drawing behavior |
| --- | --- | --- |
| Main stem | spiral/S-curve | governs movement direction |
| Branch node | fork or tangent point | creates secondary rhythm |
| Leaf | teardrop, oval, lance shape | attaches to stem with axis alignment |
| Palmette | fan/wedge cluster | creates focal punctuation |
| Negative space | capsule or crescent | must be designed, not leftover |
| Border | rectangle or band | contains scroll pressure |

### Student exercise

Draw one scrolling vine three ways:

1. As pure skeleton lines.
2. As leaves and palmettes attached to a visible axis.
3. As a manuscript border with color and gold-like accents.

### Image needs

- Vector skeleton: `islamic-arabesque-vine-skeleton.svg`
- Raster manuscript/material board: gold, pigment, paper, ink
- Overlay: branch nodes and tangent logic

---

## 6. Calligraphic geometry

Calligraphy must be handled respectfully. Do not ask students to fake sacred script for decoration.

### Safe teaching approach

- Use generic block-letter geometry for proportion, rhythm, and baseline studies.
- Use real inscriptions only when tied to a specific sourced object, with translation/context notes.
- Avoid decorative copying of Qur'anic text unless the lesson is specifically about sourced Islamic calligraphy with appropriate context.
- For early exercises, use abstract bars, rectangles, and placeholder marks to teach angular rhythm.

### Useful geometry concepts

- baseline
- vertical stroke spacing
- modular height
- compression/extension
- border wrapping
- square Kufic grid logic
- figure-ground reversal

### Image needs

- SVG: placeholder square-grid inscription rhythm
- Raster: sourced object reference only
- Overlay: baseline and modular height

---

## 7. Jali and lattice screens

Jali design is a perfect intersection of geometry, architecture, light, and drawing.

### Drawing layers

1. Outer frame
2. Repeat module
3. Bar thickness
4. Void shape
5. Cast shadow
6. Light direction
7. Surface depth

### Student exercise

1. Draw a lattice flat as an SVG-like diagram.
2. Give bars physical thickness.
3. Project the shadow onto a floor plane.
4. Compare a flat pattern to the real visual effect of patterned light.

### Image needs

- SVG cutout: `islamic-jali-lattice-cutout.svg`
- Raster: high-contrast light/shadow reference
- Canvas overlay: draggable light direction

---

## 8. Muqarnas

Muqarnas is the advanced boss level: geometry becomes architecture in stacked cells.

### Concept translation

Muqarnas is not a flat star pattern. It is a transition system between surfaces: wall to dome, square to circle, portal to vault, vertical to overhead.

### Drawing primitives

- cell
- niche
- half-dome
- prism
- tier
- projected plan
- vertical section
- shadow pocket

### Lesson progression

1. Draw a plan-view grid of cells.
2. Convert cells into stacked tiers.
3. Draw a vertical section showing depth.
4. Use value to separate underside, side plane, and front lip.
5. Place the muqarnas inside an arch or portal.

### Image needs

- Plan SVG: `muqarnas-cell-plan.svg`
- Section diagram: `muqarnas-tier-section.svg`
- Raster: architectural reference with shadows
- 3D blockout: simple extruded cell model

---

## 9. Carpets and prayer-rug geometry

Carpets are border hierarchy machines.

### Layers

1. Outer guard border
2. Main border
3. Inner guard border
4. Field
5. Medallion or mihrab
6. Corner pieces
7. Secondary motifs
8. Color/value rhythm

### Lesson prompts

- Build a carpet field with three nested borders.
- Design a central medallion from an 8-point or 10-point star.
- Convert a mihrab arch into a directional composition.
- Compare carpet geometry to architecture: floor, wall, niche, gate.

### Image needs

- Carpet decomposition overlay
- Border hierarchy diagram
- Repeat-unit worksheet
- Texture reference for woven surface

---

## 10. Full curriculum sequence

### Level 1: recognition

- Find center, axis, circle, square, triangle, polygon.
- Color existing diagrams by symmetry family.

### Level 2: construction

- Compass circle grids.
- 8-point and 6-point star construction.
- Repeating border modules.

### Level 3: transformation

- Convert one star into tile, screen, manuscript medallion, and carpet medallion.
- Move between line-only, banded, and color-filled versions.

### Level 4: material translation

- Tile: grout and cut geometry.
- Wood: carved depth and shadow.
- Manuscript: ink, pigment, gold, paper.
- Carpet: weave rhythm and softness.
- Stone screen: cutout and light.

### Level 5: architecture

- Project flat pattern onto wall, floor, dome, portal, screen, and vault.
- Add perspective, light, and human scale.

### Level 6: synthesis

- Build a complete design from source card to construction diagram to finished drawing.
- Include cultural note, source note, and geometry labels.

---

## 11. Implementation data hooks

Every Islamic pattern card should eventually expose:

```ts
{
  id: string;
  title: string;
  geometryFamily: string[];
  constructionPrimitives: string[];
  sourceSurface: string[];
  sacredStatus: 'devotional' | 'architectural' | 'scientific' | 'courtly' | 'domestic' | 'aesthetic' | 'mixed';
  visualizationNeeds: string[];
  exercises: string[];
}
```

Use the fixture in `client/src/studio/fixtures/sacredGeometryCatalog.ts` as the first export target.
