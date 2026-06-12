# Sacred Geometry and Aesthetic Geometry Expansion

This folder turns the small mandala-style seed of the repository into a broad cross-cultural geometry studio for ArtisanalCanvas.

It is designed for the existing learning model of the app:

```txt
reference -> decomposition -> construction steps -> drawing practice -> assessment -> revision
```

## What this adds

- A cross-cultural taxonomy of sacred, civic, architectural, textile, manuscript, and aesthetic geometries.
- A larger Islamic Golden Age section with construction families, visual layers, and pattern-generation logic.
- Image and visualization briefs for every concept that would benefit from a visible reference, construction overlay, worksheet, raster texture, or Canvas interaction.
- A source and rights guide so generated diagrams, museum references, and user-facing images do not become a copyright swamp.
- A TypeScript fixture at `client/src/studio/fixtures/sacredGeometryCatalog.ts` for future GraphNode, curriculum, infinite-canvas, or dock-surface work.
- A starter SVG sheet at `docs/sacred-geometry/assets/svg/core-visual-seed-sheet.svg` for clean flat structures that are appropriate for SVG.

## Folder map

```txt
docs/sacred-geometry/
  README.md
  cross-cultural-taxonomy.md
  islamic-golden-age-pattern-library.md
  visualization-image-briefs.md
  source-and-rights-guide.md
  assets/svg/core-visual-seed-sheet.svg

client/src/studio/fixtures/
  sacredGeometryCatalog.ts
```

## Cultural scope

The expansion covers:

- Mesopotamia and the ancient Near East
- Persia and the Sasanian-to-Islamic transition
- Greece
- Rome and late antique visual systems
- Mesoamerica
- Islamic Golden Age and the wider Islamic world
- Indus Valley and South Asian geometry families
- China
- Renaissance Europe
- Northern African design systems
- Broader African geometric systems, including references for Kuba textiles, Ethiopian crosses, Adinkra, Ndebele mural logic, Bògòlanfini, Zulu beadwork, and fractal settlement patterns

## Curriculum stance

This resource distinguishes between **sacred geometry** and **aesthetic geometry**.

Sacred geometry means a pattern is connected to cosmology, ritual, worship, sacred architecture, devotional use, calendar structure, funerary use, or spiritual world-ordering.

Aesthetic geometry means a pattern is visually systematic, mathematically rich, culturally important, or structurally useful even when the sacred function is uncertain or absent.

When evidence is unclear, the taxonomy labels a design as aesthetic, architectural, textile, civic, or cosmological rather than pretending every beautiful pattern is mystical. The dragon does not need fake incense to breathe fire.

## Visualization principle

Text is not enough here. Each major concept should eventually have at least one of these asset types:

1. Museum/reference image link or rights-safe source note
2. Construction diagram
3. Decomposition overlay
4. Step-by-step worksheet
5. Pattern sheet or repeat-unit panel
6. Interactive Canvas overlay
7. Material/texture raster reference when surface, light, stitch, tile, stone, paper, or pigment matters

Use SVG for clean geometry. Use raster or layered Canvas assets for line depth, texture, shadow mass, material surface, and expressive drawing instruction.

## Next implementation ideas

- Import `sacredGeometryCatalog.ts` into a future GraphNode/curriculum viewer.
- Turn each `imageNeeds` entry into a dock card: Reference, Construction, Practice, Assessment.
- Generate clean SVG diagrams for all `svg-suitable` assets.
- Generate raster worksheets for material-rich topics such as Kuba raffia, zellij tile, manuscript illumination, carved stone jali, and mudcloth.
- Add a `/studio` surface later without changing current Academy routes.
