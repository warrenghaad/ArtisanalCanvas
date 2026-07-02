# Source and Rights Guide for Sacred Geometry Visual Assets

This guide keeps ArtisanalCanvas from becoming a beautiful but legally haunted palace. Use it whenever adding source images, generated diagrams, museum references, worksheets, or raster textures for the sacred/aesthetic geometry expansion.

## 1. Rights-safe asset tiers

| Tier | Asset type | Repo use | Notes |
| --- | --- | --- | --- |
| Tier A | Original diagrams created for ArtisanalCanvas | Commit directly | Best for flat-construction vectors, repeat units, grids, unit-cell maps, and worksheets. |
| Tier B | Public domain / CC0 museum images | Commit if license metadata is stored | Verify object page, rights statement, creator/date, accession number, source URL. |
| Tier C | Museum reference images not clearly open | Link only, do not commit image | Use as source cards and study links. Build original overlays separately. |
| Tier D | Contemporary artist/craft/architecture images | Link only unless explicit permission | Avoid copying into repo. Use descriptive source notes. |
| Tier E | Sacred script, living ritual symbols, restricted cultural material | Context card required | Use with caution. Prefer sourced object study, not decorative extraction. |

## 2. Core rule

For every visual asset, store these fields somewhere:

```ts
{
  assetId: string;
  conceptId: string;
  assetType:
    | 'reference-board'
    | 'flat-construction-vector'
    | 'expressive-linework-raster'
    | 'step-worksheet'
    | 'decomposition-overlay'
    | 'material-raster'
    | 'canvas-interaction'
    | 'perspective-projection'
    | 'context-card';
  rightsTier: 'original' | 'public-domain' | 'cc0' | 'linked-reference-only' | 'permission-required' | 'cultural-context-required';
  sourceUrl?: string;
  institution?: string;
  objectTitle?: string;
  creatorOrCulture?: string;
  dateOrPeriod?: string;
  accessionNumber?: string;
  licenseStatement?: string;
  notes: string;
}
```

## 3. Visual format rule

**SVG is for line as construction. Raster and Canvas are for line as touch, pressure, depth, value, texture, ornament, atmosphere, and hand intelligence.**

Use `flat-construction-vector` when the asset teaches:

- 1D line systems that construct clear 2D shapes
- proportion grids
- compass/ruler geometry
- flat polygons
- unit cells
- simple tiling maps
- repeat-unit pattern logic

Use `expressive-linework-raster` when the asset teaches:

- pressure variation
- hatching as value
- cross-contour depth
- ornamental line fields
- line density
- expressive line weight
- graphite, charcoal, ink, or brush texture
- hand-made mark hierarchy
- atmospheric or emotional force carried by the line

Do not treat `flat-construction-vector` as the universal output format for sacred/aesthetic geometry. It is a construction layer, not the full visual experience.

## 4. Open-access source banks

These are good first places to look for rights-safe or well-cited visual references.

### Smithsonian Open Access

- Website: `https://www.si.edu/openaccess`
- Best for: Smithsonian collection objects, including many African art references, 2D images, and some 3D assets.
- Use for: African art museum source cards, object metadata, and rights-safe references where the object is clearly marked open access.
- Checklist: confirm the object is open access, save source URL, object title, culture, date, medium, credit line, and rights statement.

### Smithsonian National Museum of African Art

- Website: `https://africa.si.edu/`
- Search gateway: use Smithsonian collection search plus `National Museum of African Art` as the unit.
- Best for: African textiles, masks, sculpture, metalwork, ceramics, beadwork, ritual objects, and museum-authored object context.
- Use for: Kuba raffia, Bògòlanfini, Ethiopian crosses, Yoruba Ifa trays, beadwork, metalwork, and other Africa-specific geometry cards.
- Rule: even if an object is open access, do not flatten cultural meaning into generic pattern decoration.

### The Metropolitan Museum of Art Open Access

- Website: `https://www.metmuseum.org/hubs/open-access`
- API: `https://metmuseum.github.io/`
- Best for: Islamic art, carpets, manuscripts, ancient Near East, Greek/Roman, South Asian, Chinese, African objects.
- Use for: star tiles, carpets, manuscripts, vessels, architectural fragments, textile references.
- Checklist: filter for Open Access or public domain image, then store object metadata and URL.

### Cleveland Museum of Art Open Access

- Website: `https://www.clevelandart.org/open-access`
- API: `https://openaccess-api.clevelandart.org/`
- Best for: clean CC0 image and metadata workflows.
- Use for: supplemental examples when source coverage is stronger than other museums.

### Art Institute of Chicago Public API

- Website: `https://api.artic.edu/docs/`
- Best for: searchable object metadata and image IIIF workflows.
- Use for: African, Islamic, Asian, ancient, and textile references when rights are clear on object pages.

### Rijksmuseum Rijksstudio and data services

- Website: `https://data.rijksmuseum.nl/`
- Best for: public-domain European, print, pattern, and decorative-arts references.
- Use for: Renaissance and pattern-book comparisons.

### National Gallery of Art Open Access

- Website: `https://www.nga.gov/open-access-images.html`
- Best for: European art, Renaissance drawing/painting, architecture-related references.
- Use for: perspective, proportion, and tiled-floor lessons.

### Walters Art Museum

- Website: `https://art.thewalters.org/`
- Best for: manuscripts, Islamic art, Byzantine, ancient, medieval, and devotional objects.
- Use for: source cards, especially manuscripts and pattern-bearing objects.

### British Museum Collection Online

- Website: `https://www.britishmuseum.org/collection`
- Best for: ancient Near East, Greece, Rome, Mesoamerica, Indus/South Asia, China, Africa.
- Use for: reference links and metadata. Verify image rights on each object page before storing images.

## 5. Source query recipes

Use these query patterns in source-board tasks.

### African art museum reference queries

```txt
site:si.edu/openaccess Kuba raffia cloth geometric pattern
site:collections.si.edu National Museum of African Art Kuba textile raffia
site:collections.si.edu National Museum of African Art Bògòlanfini mud cloth
site:collections.si.edu National Museum of African Art Ethiopian cross geometry
site:collections.si.edu National Museum of African Art Yoruba Ifa tray geometric border
site:collections.si.edu National Museum of African Art Zulu beadwork triangle pattern
site:collections.si.edu National Museum of African Art Tuareg leather geometric pattern
```

### Islamic geometry reference queries

```txt
site:metmuseum.org Islamic geometric tile star pattern open access
site:metmuseum.org girih tile Islamic art decagon pattern
site:metmuseum.org zellij Moroccan tile geometry
site:metmuseum.org Islamic carpet mihrab medallion geometry
site:metmuseum.org muqarnas architecture Islamic art
site:metmuseum.org square Kufic geometric inscription
```

### Ancient world reference queries

```txt
site:metmuseum.org Mesopotamian rosette star cylinder seal
site:britishmuseum.org cylinder seal rosette star Mesopotamia
site:metmuseum.org Greek meander pottery border
site:metmuseum.org Roman mosaic guilloche tessellation
site:britishmuseum.org Mesoamerican stepped fret pattern
site:britishmuseum.org Indus seal square animal sign register
```

### China and South Asia reference queries

```txt
site:metmuseum.org Chinese leiwen thunder pattern bronze
site:metmuseum.org taotie bronze vessel geometry
site:metmuseum.org Chinese lattice window geometric pattern
site:metmuseum.org yantra geometry South Asia
site:metmuseum.org jali screen South Asia geometry
site:metmuseum.org kolam rangoli dot grid pattern
```

## 6. Cultural-context guardrails

### Sacred script and devotional forms

- Use a context card before turning sacred text into a drawing exercise.
- Do not ask students to invent fake Qur'anic inscriptions, fake Sanskrit mantras, fake Mayan glyphs, or fake sacred script.
- Use placeholder geometry for rhythm exercises unless studying a specific source object with translation/context.

### Indigenous and living traditions

- Avoid presenting living traditions as ancient fossils.
- Use specific labels: people, region, date/period, material, use, museum object number if available.
- Where a symbol has active spiritual, social, or restricted meaning, teach geometry through structure and context, not appropriation.

### African geometry

- Do not treat Africa as a single style.
- Store object metadata and region/culture tags.
- For Kuba, Kente, Adinkra, Bògòlanfini, Ndebele, Ethiopian, Yoruba, Hausa, Zulu, Somali, and Coptic examples, keep local material and social use attached to the pattern.
- Prefer African art museum and collection-source notes over generic image search.

### South Asian auspicious rotation symbols

- Do not use these as generic decorative icons.
- If included, present historical South Asian auspicious context clearly and note modern misappropriation in other contexts.
- Prefer contextual source-object study.

## 7. Image generation rules

When generating original visuals for the repo:

1. Make construction diagrams original.
2. Do not claim generated images are historical artifacts.
3. Include source inspiration notes such as `inspired by Islamic 8-point star construction family`, not `copy of XYZ mosque tile` unless it is a measured reconstruction from a public-domain source.
4. Use generic materials when source image rights are unclear.
5. For museum-object overlays, keep the overlay file separate from the source image unless image rights allow local storage.
6. Store source URLs in source-board markdown rather than embedding protected images.
7. Choose the asset format based on the teaching goal: vector for construction logic, raster/Canvas for expressive line, depth, material, and ornament.

## 8. Per-asset source-board template

```md
# Source Board: {Concept Title}

## Concept

- Concept ID:
- Culture/region:
- Geometry family:
- Sacred/aesthetic status:
- Drawing translation:

## Sources

| Source | Institution | Object/title | Date/period | Rights | URL | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  |  |

## Visual plan

- Reference-board:
- Flat-construction vector:
- Expressive-linework raster:
- Decomposition overlay:
- Material raster:
- Canvas interaction:
- Worksheet:

## Cultural notes

- What the pattern means in context:
- What not to overclaim:
- What student-facing language should say:
```

## 9. Metadata tags

Use these tags to help future search and GraphNode routing.

```txt
culture:mesopotamia
culture:persia
culture:greece
culture:rome
culture:mesoamerica
culture:islamic-world
culture:indus
culture:south-asia
culture:china
culture:renaissance
culture:north-africa
culture:africa

geometry:radial
geometry:tessellation
geometry:interlace
geometry:lattice
geometry:spiral
geometry:meander
geometry:fractal
geometry:proportion
geometry:perspective
geometry:cosmogram
geometry:mandala
geometry:star-polygon
geometry:calligraphic-grid
geometry:material-translation

asset:reference-board
asset:flat-construction-vector
asset:expressive-linework-raster
asset:step-worksheet
asset:decomposition-overlay
asset:material-raster
asset:canvas-interaction
asset:perspective-projection
asset:context-card
```

## 10. Minimum metadata for committed images

Every committed visual file should have a neighboring `.md` or manifest record with:

- title
- creator or generator
- date created
- concept ID
- culture/region tag
- geometry family tag
- rights tier
- source/inspiration note
- asset type
- whether it is original, reconstructed, generated, or reference-derived
- allowed repo use
- student-facing caution if sacred/context-sensitive

## 11. Review checklist before merge

- [ ] Does the asset have a concept ID?
- [ ] Is the rights tier clear?
- [ ] Is the asset type `flat-construction-vector`, `expressive-linework-raster`, or another precise category?
- [ ] If museum-derived, is the object source recorded?
- [ ] If sacred/context-sensitive, is there a context card?
- [ ] Is the file type appropriate? Vector for clean construction logic; raster/Canvas for pressure, hatching, shadow, line hierarchy, texture, and material.
- [ ] Does the asset teach construction, mark behavior, or material behavior rather than decoration alone?
- [ ] Can a student reproduce the pattern from primitives or mark operations?
- [ ] Does it avoid overclaiming mystical meaning?
- [ ] Does it preserve current Academy routes and repo guardrails?
