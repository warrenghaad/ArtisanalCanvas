# Visualization and Image Briefs

This file exports the image needs for every sacred/aesthetic geometry concept in the first catalog pass. It is meant to feed future ArtisanalCanvas cards, source-note dock viewers, construction worksheets, generated diagrams, and raster asset production.

## Asset type vocabulary

| Asset type | Use |
| --- | --- |
| `reference-board` | Museum or architecture reference images with captions and source notes. |
| `flat-construction-vector` | Clean construction logic where 1D lines create clear 2D shapes: compass grids, polygons, proportion grids, unit cells, simple tiling maps, and repeat-unit diagrams. |
| `expressive-linework-raster` | Pressure-sensitive, depth-making, ornamental, hatching, contour-hatching, cross-contour, graphite, ink, charcoal, or hand-line studies where the line itself creates surface, shadow, rhythm, or emotional force. |
| `step-worksheet` | Student-facing sequence with numbered drawing steps. |
| `decomposition-overlay` | Image overlay showing axis, grid, primitive shapes, repeat unit, value groups, line hierarchy, or mark-density logic. |
| `material-raster` | Texture-aware image: clay, stone, tile, textile, pigment, bead, wood, metal, paper. |
| `canvas-interaction` | Future interactive layer: toggle grid, drag tile, cast shadow, project pattern, test hatching density, or compare mark hierarchies. |
| `perspective-projection` | Pattern placed on wall, floor, dome, vessel, folded cloth, or screen. |
| `context-card` | Cultural note, usage note, rights note, and safe-use warning where needed. |

## File naming rules

```txt
docs/sacred-geometry/assets/
  vectors/{culture}-{concept}-{diagram}.svg
  raster/{culture}-{concept}-{asset}.webp
  overlays/{culture}-{concept}-{overlay}.json
  worksheets/{culture}-{concept}-{worksheet}.pdf
  source-boards/{culture}-{concept}-sources.md
```

Examples:

```txt
docs/sacred-geometry/assets/vectors/islamic-eight-point-star-construction.svg
docs/sacred-geometry/assets/raster/africa-kuba-raffia-texture-study.webp
docs/sacred-geometry/assets/overlays/rome-mosaic-guilloche-over-under.json
```

## Production stance

- Use vector/SVG only for clean construction logic: 1D lines forming 2D shapes, grids, polygons, unit cells, compass geometry, and repeat maps.
- Do not use SVG as the main format when the educational point is how line produces depth, pressure, ornament, atmosphere, material, value, or expressive surface.
- For innovative line use, prefer raster drawings, layered Canvas, annotated PNG/WebP worksheets, or interactive overlays that preserve line weight, density, pressure, hatching, cross-contour, and mark hierarchy.
- Use museum images as references and source cards. Do not copy protected images into the repo unless license permits it.
- Generated diagrams should be original and should include a concept source note, not a fake historical-object claim.
- Sacred or devotional images need context, not decoration-only treatment.

---

## Mesopotamia and ancient Near East

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `mesopotamia-rosette-star` | reference-board, flat-construction-vector, decomposition-overlay | Mesopotamian rosette star cylinder seal relief museum; Ishtar star ancient Near East rosette | `mesopotamia-rosette-star-radial-grid.svg` |
| `mesopotamia-cylinder-seal-repeat` | reference-board, step-worksheet, canvas-interaction | Mesopotamian cylinder seal rolled impression museum | `mesopotamia-cylinder-seal-repeat-band.svg` |
| `mesopotamia-stepped-ziggurat` | reference-board, perspective-projection, step-worksheet | ziggurat architecture reconstruction plan museum | `mesopotamia-ziggurat-stacked-box-perspective.svg` |
| `mesopotamia-cuneiform-grid` | material-raster, step-worksheet, decomposition-overlay, expressive-linework-raster | cuneiform tablet rows columns clay tablet museum | `mesopotamia-cuneiform-wedge-grid.svg` |
| `mesopotamia-guilloche-band` | flat-construction-vector, step-worksheet, canvas-interaction, expressive-linework-raster | ancient Near Eastern guilloche border seal | `mesopotamia-guilloche-over-under-band.svg` |

---

## Persia and Iranian systems

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `persia-lotus-palmette-anthemion` | reference-board, flat-construction-vector, step-worksheet | Achaemenid lotus palmette anthemion relief border | `persia-lotus-palmette-symmetry-sheet.svg` |
| `persia-pearl-roundel` | reference-board, flat-construction-vector, material-raster | Sasanian pearl roundel textile museum | `persia-pearl-roundel-module.svg` |
| `persia-winged-disc-axis` | reference-board, decomposition-overlay, context-card | Achaemenid winged disc relief museum context | `persia-winged-disc-bilateral-axis.svg` |
| `persia-chahar-bagh` | flat-construction-vector, canvas-interaction, context-card | Persian chahar bagh garden plan | `persia-chahar-bagh-fourfold-plan.svg` |
| `persia-islimi-arabesque` | material-raster, expressive-linework-raster, step-worksheet | Persian manuscript islimi arabesque border | `persia-islimi-vine-linework-study.webp` |
| `persia-carpet-medallion` | reference-board, decomposition-overlay, material-raster | Persian carpet medallion border field museum | `persia-carpet-medallion-field-overlay.json` |

---

## Greece

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `greece-meander-key` | flat-construction-vector, step-worksheet | Greek meander key pattern pottery border museum | `greece-meander-continuous-path.svg` |
| `greece-anthemion-palmette` | reference-board, flat-construction-vector, decomposition-overlay | Greek anthemion palmette ornament stela pottery | `greece-anthemion-palmette-axis-sheet.svg` |
| `greece-black-figure-bands` | reference-board, decomposition-overlay, perspective-projection, expressive-linework-raster | Greek black figure vase registers border | `greece-vase-register-unwrap.svg` |
| `greece-euclidean-construction` | flat-construction-vector, canvas-interaction | Euclidean compass straightedge polygon construction | `greece-euclidean-polygon-construction.svg` |
| `greece-proportion-order` | step-worksheet, decomposition-overlay | Greek column order proportion diagram | `greece-column-order-proportion.svg` |

---

## Rome and late antique systems

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `rome-mosaic-tessellation` | reference-board, flat-construction-vector, material-raster | Roman mosaic tessellation guilloche floor museum | `rome-mosaic-repeat-unit.svg` |
| `rome-guilloche-border` | flat-construction-vector, step-worksheet, canvas-interaction, expressive-linework-raster | Roman guilloche mosaic border | `rome-guilloche-over-under.svg` |
| `rome-coffered-dome` | perspective-projection, step-worksheet, reference-board | Roman coffered dome Pantheon geometry | `rome-coffered-dome-perspective-grid.svg` |
| `rome-opus-sectile` | material-raster, flat-construction-vector | Roman opus sectile marble geometric pattern | `rome-opus-sectile-cut-stone-map.svg` |
| `late-antique-cross-medallion` | reference-board, flat-construction-vector, context-card | late antique cross medallion mosaic sarcophagus | `late-antique-cross-medallion-axis.svg` |

---

## Mesoamerica

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `mesoamerica-stepped-fret` | flat-construction-vector, step-worksheet, reference-board | Mesoamerican stepped fret xicalcoliuhqui pattern museum | `mesoamerica-stepped-fret-grid.svg` |
| `mesoamerica-calendar-wheel` | context-card, flat-construction-vector, reference-board | Mexica Aztec calendar stone ring divisions museum | `mesoamerica-calendar-wheel-placeholder.svg` |
| `mesoamerica-quincunx` | flat-construction-vector, context-card | Mesoamerican quincunx cosmogram four directions | `mesoamerica-quincunx-cosmogram.svg` |
| `mesoamerica-serpent-band` | reference-board, decomposition-overlay, material-raster, expressive-linework-raster | feathered serpent band relief codex pattern | `mesoamerica-serpent-band-motion-axis.webp` |
| `mesoamerica-talud-tablero` | flat-construction-vector, perspective-projection | Teotihuacan talud tablero architecture geometry | `mesoamerica-talud-tablero-section.svg` |
| `mesoamerica-mosaic-mask` | reference-board, decomposition-overlay, material-raster | Mesoamerican turquoise mosaic mask geometry museum | `mesoamerica-mosaic-mask-tile-overlay.json` |

---

## Islamic Golden Age and wider Islamic world

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `islamic-compass-straightedge` | flat-construction-vector, canvas-interaction, step-worksheet | Islamic geometric design compass straightedge construction | `islamic-compass-circle-grid.svg` |
| `islamic-6-8-12-star-family` | flat-construction-vector, step-worksheet, canvas-interaction | Islamic eight point star six point star construction | `islamic-star-family-6-8-12.svg` |
| `islamic-5-10-star-family` | flat-construction-vector, step-worksheet | Islamic ten point star decagon construction | `islamic-ten-point-star-decagon.svg` |
| `islamic-girih-network` | flat-construction-vector, canvas-interaction, context-card | girih tile set Islamic geometry decagon kite dart | `islamic-girih-tile-set.svg` |
| `islamic-zellij` | material-raster, flat-construction-vector, reference-board | Moroccan zellij tile geometric star pattern | `islamic-zellij-repeat-color-map.svg` |
| `islamic-muqarnas` | perspective-projection, flat-construction-vector, material-raster | muqarnas vault geometry section plan | `islamic-muqarnas-cell-plan-section.svg` |
| `islamic-arabesque-islimi` | material-raster, expressive-linework-raster, step-worksheet | Islamic arabesque islimi vine manuscript pattern | `islamic-arabesque-vine-linework-study.webp` |
| `islamic-calligraphic-geometry` | context-card, flat-construction-vector, reference-board | square kufic geometry grid Islamic calligraphy | `islamic-square-grid-calligraphy-placeholder.svg` |
| `islamic-jali-screen` | flat-construction-vector, material-raster, canvas-interaction | Islamic jali screen lattice shadow geometry | `islamic-jali-lattice-cutout.svg` |
| `islamic-carpet-prayer-niche` | reference-board, decomposition-overlay, material-raster | Islamic prayer rug mihrab geometric border museum | `islamic-prayer-rug-field-overlay.json` |

---

## Indus Valley and South Asian geometry

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `indus-urban-grid` | flat-construction-vector, reference-board, context-card | Indus Valley city grid drainage plan Harappa Mohenjo-daro | `indus-urban-grid-plan.svg` |
| `indus-seal-square` | material-raster, decomposition-overlay, reference-board, expressive-linework-raster | Indus seal square animal sign register museum | `indus-seal-square-composition.webp` |
| `south-asia-mandala-plan` | flat-construction-vector, step-worksheet, context-card | South Asian mandala temple plan geometry | `south-asia-mandala-plan-grid.svg` |
| `south-asia-yantra` | flat-construction-vector, context-card, step-worksheet | yantra geometry bindu triangles lotus context | `south-asia-yantra-contextual-construction.svg` |
| `south-asia-rangoli-kolam` | step-worksheet, canvas-interaction, expressive-linework-raster | kolam dot grid looping line rangoli pattern | `south-asia-kolam-hand-line-study.webp` |
| `south-asia-jali` | flat-construction-vector, material-raster, canvas-interaction | South Asian jali stone lattice geometry shadow | `south-asia-jali-light-shadow.svg` |
| `south-asia-ajrakh-blockprint` | material-raster, step-worksheet | ajrakh block print geometric stars textile | `south-asia-ajrakh-block-repeat.svg` |
| `south-asia-auspicious-rotation-symbols` | context-card, flat-construction-vector | South Asian auspicious rotating symbol historical context | `south-asia-auspicious-rotation-context-grid.svg` |

---

## China

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `china-leiwen-spiral` | flat-construction-vector, step-worksheet, reference-board | Chinese leiwen thunder pattern squared spiral bronze | `china-leiwen-square-spiral.svg` |
| `china-taotie-bilateral` | reference-board, decomposition-overlay, context-card, expressive-linework-raster | Chinese taotie bronze vessel bilateral mask geometry | `china-taotie-bilateral-mask-overlay.json` |
| `china-lattice-window` | flat-construction-vector, material-raster, canvas-interaction | Chinese wooden lattice window geometric pattern | `china-lattice-window-cutout.svg` |
| `china-cloud-scroll` | expressive-linework-raster, step-worksheet, material-raster | Chinese cloud scroll geometry pattern | `china-cloud-scroll-brush-linework-study.webp` |
| `china-bagua-luoshu` | flat-construction-vector, context-card | bagua luoshu cosmological diagram geometry | `china-bagua-luoshu-context-diagram.svg` |
| `china-dragon-roundel` | reference-board, decomposition-overlay, expressive-linework-raster | Chinese dragon roundel robe geometry | `china-dragon-roundel-motion-axis.webp` |
| `china-buddhist-mandorla-lotus` | reference-board, flat-construction-vector, context-card | Chinese Buddhist mandorla lotus halo geometry | `china-buddhist-mandorla-lotus.svg` |

---

## Renaissance Europe

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `renaissance-linear-perspective` | flat-construction-vector, canvas-interaction, step-worksheet | Renaissance linear perspective tiled floor diagram | `renaissance-one-point-tiled-floor.svg` |
| `renaissance-central-plan` | flat-construction-vector, perspective-projection | Renaissance central plan church circle square cross | `renaissance-central-plan-circle-square.svg` |
| `renaissance-proportion-humanist` | decomposition-overlay, step-worksheet | Renaissance human proportion canon square circle | `renaissance-humanist-proportion-grid.svg` |
| `renaissance-platonic-solids` | flat-construction-vector, canvas-interaction | Renaissance platonic solids perspective drawing | `renaissance-platonic-solids-wireframe.svg` |
| `renaissance-pavement-illusion` | perspective-projection, step-worksheet | Renaissance pavement illusion checkerboard perspective | `renaissance-pavement-perspective-overlay.svg` |
| `renaissance-rose-window-afterlife` | flat-construction-vector, reference-board | Renaissance rose window tracery radial geometry | `renaissance-rose-window-radial-tracery.svg` |

---

## Northern African design systems

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `north-africa-zellij` | material-raster, flat-construction-vector, reference-board | Moroccan zellij North African tile star pattern | `north-africa-zellij-star-repeat.svg` |
| `north-africa-amazigh-diamond` | reference-board, flat-construction-vector, context-card, expressive-linework-raster | Amazigh diamond textile jewelry geometric motifs | `north-africa-amazigh-diamond-grid.svg` |
| `north-africa-kufic-border` | context-card, flat-construction-vector, reference-board | North African kufic inscription border geometry | `north-africa-kufic-placeholder-grid.svg` |
| `north-africa-mashrabiya-screen` | flat-construction-vector, material-raster, canvas-interaction | North African mashrabiya geometric screen shadow | `north-africa-mashrabiya-light-grid.svg` |
| `north-africa-tuareg-leather-metal` | material-raster, reference-board, step-worksheet, expressive-linework-raster | Tuareg leather metalwork geometric stamped patterns museum | `north-africa-tuareg-stamped-border.webp` |
| `north-africa-fatimid-mamluk-star` | flat-construction-vector, reference-board, context-card | Fatimid Mamluk star geometry Islamic art Egypt | `north-africa-fatimid-mamluk-star-grid.svg` |

---

## Broader African geometric systems

| Concept | Image needs | Search/source query seeds | First generated asset |
| --- | --- | --- | --- |
| `africa-kuba-raffia` | reference-board, material-raster, decomposition-overlay, expressive-linework-raster | Smithsonian National Museum African Art Kuba raffia cloth geometric pattern | `africa-kuba-raffia-broken-grid-overlay.json` |
| `africa-kente-stripe` | material-raster, step-worksheet | Kente textile stripe block rhythm museum | `africa-kente-stripe-rhythm.svg` |
| `africa-adinkra-symbol-grid` | context-card, step-worksheet, material-raster, flat-construction-vector | Adinkra cloth symbol grid stamp museum | `africa-adinkra-stamp-grid.svg` |
| `africa-bogolan-mudcloth` | material-raster, step-worksheet, context-card, expressive-linework-raster | Bògòlanfini mudcloth triangles chevrons dots museum | `africa-bogolan-mark-making-sheet.webp` |
| `africa-ndebele-mural` | reference-board, step-worksheet, perspective-projection | Ndebele mural geometric house painting | `africa-ndebele-wall-elevation.svg` |
| `africa-ethiopian-cross` | flat-construction-vector, reference-board, context-card, expressive-linework-raster | Ethiopian processional cross interlace geometry museum | `africa-ethiopian-cross-linework-study.webp` |
| `africa-yoruba-ifa-tray` | reference-board, context-card, flat-construction-vector | Yoruba Ifa divination tray circular border geometry museum | `africa-yoruba-ifa-tray-circular-field.svg` |
| `africa-hausa-architecture` | reference-board, perspective-projection, material-raster | Hausa architecture geometric relief facade | `africa-hausa-facade-relief-grid.svg` |
| `africa-zulu-beadwork` | material-raster, step-worksheet, context-card | Zulu beadwork triangle color code geometry museum | `africa-zulu-beadwork-triangle-grid.svg` |
| `africa-fractal-settlement` | flat-construction-vector, canvas-interaction, context-card | African fractal settlement pattern village geometry | `africa-fractal-settlement-zoom-sequence.svg` |
| `africa-somali-weaving-geometry` | material-raster, step-worksheet | Somali weaving mat basket diagonal geometry | `africa-somali-weaving-diagonal-grid.svg` |
| `africa-egyptian-coptic-textile` | reference-board, material-raster, flat-construction-vector | Coptic textile medallion cross interlace museum | `africa-coptic-textile-medallion.svg` |

---

## Cross-cultural comparative boards

| Board | Concepts included | Asset target |
| --- | --- | --- |
| Eight-point star migration | Mesopotamian rosette/star, Islamic 8-point star, North African zellij, Renaissance rose-window logic | `cross-cultural-eight-point-star-board.md` plus flat vector overlay |
| Stepped line families | Greek meander, Roman mosaic border, Mesoamerican stepped fret, Chinese leiwen | `cross-cultural-stepped-line-family.svg` |
| Textile as grid | Kuba raffia, Kente stripes, Adinkra cloth, Bògòlanfini, Persian carpet, Ajrakh | `cross-cultural-textile-grid-board.md` |
| Sacred center/four directions | Persian chahar bagh, South Asian mandala, Mesoamerican quincunx, Chinese bagua | `cross-cultural-center-four-directions.svg` |
| Screen and shadow | Islamic jali, South Asian jali, Chinese lattice, North African mashrabiya | `cross-cultural-screen-shadow-interaction.json` |
| Border hierarchy | Persia, Greece, Rome, Islamic manuscripts, African textiles | `cross-cultural-border-hierarchy-worksheet.pdf` |
| Spiral and angular spiral | Mesopotamian guilloche, Mesoamerican stepped fret, Chinese leiwen, organic spiral lessons | `cross-cultural-spiral-angular-spiral.svg` |

---

## Minimum viable asset queue

Build these first because they unlock the widest curriculum surface:

1. `islamic-eight-point-star-construction.svg` as `flat-construction-vector`
2. `islamic-girih-tile-set.svg` as `flat-construction-vector`
3. `rome-mosaic-repeat-unit.svg` as `flat-construction-vector`
4. `greece-meander-continuous-path.svg` as `flat-construction-vector`
5. `mesoamerica-stepped-fret-grid.svg` as `flat-construction-vector`
6. `persia-chahar-bagh-fourfold-plan.svg` as `flat-construction-vector`
7. `south-asia-kolam-hand-line-study.webp` as `expressive-linework-raster`
8. `china-cloud-scroll-brush-linework-study.webp` as `expressive-linework-raster`
9. `africa-kuba-raffia-broken-grid-overlay.json` as `decomposition-overlay`
10. `north-africa-zellij-star-repeat.svg` as `flat-construction-vector`
11. `renaissance-one-point-tiled-floor.svg` as `flat-construction-vector`
12. `cross-cultural-screen-shadow-interaction.json` as `canvas-interaction`
