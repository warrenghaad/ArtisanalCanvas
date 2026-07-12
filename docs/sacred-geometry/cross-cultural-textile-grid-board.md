# Cross-Cultural Board: Textile as Grid

**Board ID:** `cross-cultural-textile-grid-board`
**Asset target:** `worksheets/cross-cultural-textile-grid-board.pdf` (markdown stand-in pending PDF pipeline)
**Concepts included:**
- `africa-kuba-raffia` — Kuba raffia cloth (DRC)
- `africa-kente-stripe` — Kente textile (Ghana)
- `africa-adinkra-symbol-grid` — Adinkra cloth (Ghana/Côte d'Ivoire)
- `africa-bogolan-mudcloth` — Bògòlanfini mudcloth (Mali)
- `persia-carpet-medallion` — Persian carpet (Iran)
- `south-asia-ajrakh-blockprint` — Ajrakh block print (Sindh/Gujarat)

---

## Purpose

This board examines how six distinct textile traditions use the underlying grid of weaving, printing, or stamping as a generative geometry — not merely a substrate. In each tradition, the grid is not hidden but exploited as a compositional language.

The goal is for students to see that **geometric abstraction in textile is a structural necessity first, and a visual choice second**.

---

## Shared structural logic

All six traditions share:
1. A base unit (warp/weft intersection, stamp module, block face, or woven repeat)
2. A repeat rule (how units tile: straight, offset, mirrored, rotated)
3. A value/color structure (which units receive which color or mark density)
4. A boundary condition (how the pattern meets the edge, border, or selvage)

The differences lie in how these four elements are prioritized, combined, and innovated within each tradition.

---

## Concept 1: Kuba Raffia Cloth

**Culture:** Kuba Kingdom (present-day DRC), 17th century CE onward
**Grid type:** Square woven ground + embroidered or cut-pile surface
**Repeat logic:** Asymmetric broken grid — units offset by half a module, producing an irregular-seeming but structurally precise pattern
**Value structure:** Three zones (dark, mid, light) distributed asymmetrically across the repeat. No two adjacent units are identical in both form and tone.
**Boundary:** Patterns often end at the cloth edge without completion — the grid "bleeds" rather than frames
**Key educational point:** The broken-grid illusion. Students who map the grid will discover that the apparent irregularity is tightly controlled. See `overlays/africa-kuba-raffia-broken-grid-overlay.json`.

**Source query seeds:**
- Smithsonian National Museum African Art Kuba raffia cloth geometric pattern
- Brooklyn Museum Kuba embroidered cloth
- Kuba Kingdom raffia cloth repeat geometry analysis

---

## Concept 2: Kente Textile

**Culture:** Akan and Ewe peoples, Ghana and Togo
**Grid type:** Woven strip loom; narrow strips (4–10cm wide) sewn edge-to-edge
**Repeat logic:** Warp-dominant stripe rhythm; weft-pattern blocks create the internal geometry within each strip
**Value structure:** Color rhythm is the primary design element — the sequence of strip colors and their widths is the composition
**Boundary:** Strip joins are visible and compositional — the seam line between adjacent strips creates an additional vertical grid
**Key educational point:** Kente is a one-dimensional composition repeated in two dimensions. The strip = the basic modular unit.

**Source query seeds:**
- Kente textile strip woven Ghana Ashanti Ewe museum
- Kente strip loom warp pattern geometry

---

## Concept 3: Adinkra Cloth

**Culture:** Akan people, Ghana and Côte d'Ivoire
**Grid type:** Cloth divided by ink-line grid into rectangular stamp fields
**Repeat logic:** Stamp-based repeat: a carved calabash stamp is pressed in a grid pattern across the cloth
**Value structure:** Each stamp field carries one symbol (adinkra symbol); the grid arranges symbols in columns and rows, with the grid lines as visual separators
**Boundary:** The grid lines (inked with a comb-tool into iron-rich liquid) form the explicit frame — the boundary IS the grid
**Key educational point:** Adinkra is an explicit grid-as-grid. Students can see both the content (symbols) and the structure (grid) simultaneously.

**Source query seeds:**
- Adinkra cloth stamp grid geometry Ghana museum
- Adinkra symbol calabash stamp comb grid process

---

## Concept 4: Bògòlanfini Mudcloth

**Culture:** Bamana people, Mali
**Grid type:** Woven cotton ground; no woven pattern — all geometry is painted
**Repeat logic:** Resist-and-paint process: mud is painted into the negative space BETWEEN design shapes, leaving the unpainted cotton as the "positive" form
**Value structure:** High contrast — dark mud background, light reserved cotton pattern. The pattern is defined by what is NOT painted.
**Boundary:** Geometric borders (chevrons, triangles) typically frame the central field
**Key educational point:** Mudcloth is a negative/positive inversion exercise. The form emerges from what is withheld, not applied.

**Source query seeds:**
- Bògòlanfini mudcloth triangle chevron Mali museum
- Bamana bogolanfini negative positive pattern geometry

---

## Concept 5: Persian Carpet Medallion

**Culture:** Iran (Safavid, Qajar, and earlier periods), 15th century CE onward
**Grid type:** Knotted pile on warp/weft ground; complex geometric and curvilinear patterns
**Repeat logic:** Medallion format — a central medallion, quarter-medallions at corners, and a field pattern between. The medallion is a radial form on a rectilinear ground.
**Value structure:** Multiple value levels (typically 5–8 distinct tones) in a complex interlocking color map. The carpet's geometry is inseparable from its color scheme.
**Boundary:** Multiple border registers (guard stripes + main border) form a hierarchical frame system
**Key educational point:** The Persian carpet reconciles two geometries: the radial (medallion) and the orthogonal (field grid). The corner pieces are the geometric proof — they show the quarter of the central medallion reflected to fill the corner.

**Source query seeds:**
- Persian carpet medallion field border geometry museum
- Safavid carpet medallion corner geometry

---

## Concept 6: Ajrakh Block Print

**Culture:** Khatri community, Sindh (Pakistan) and Kutch/Gujarat (India)
**Grid type:** Resist and mordant block-print on cotton; double-sided printing
**Repeat logic:** Block-based tessellation: a carved wooden block (typically 20–30cm square) is printed in a half-drop or straight repeat across the cloth
**Value structure:** Typically indigo/red/black on natural cotton. The print sequence matters — resist first, then mordant, then dye — building up color in layers
**Boundary:** Ajrakh cloth has printed borders with different repeat logic from the field pattern. The border transition is a key compositional decision.
**Key educational point:** Ajrakh makes the unit/repeat logic explicit — you can see each block impression as a discrete geometric object.

**Source query seeds:**
- Ajrakh block print geometric stars textile Sindh Gujarat
- Khatri ajrakh resist print geometric pattern

---

## Structural comparison table

| Property | Kuba Raffia | Kente | Adinkra | Mudcloth | Persian Carpet | Ajrakh |
|---|---|---|---|---|---|---|
| Grid origin | Woven structure | Strip loom | Applied ink grid | Painted | Woven structure | Block dimensions |
| Repeat unit | 6×6 grid cells | Strip width × pattern block | Stamp face | Painted shape | Carpet medallion / field tile | Block face |
| Value levels | 3 | 4–8 (color) | 2 (ink/cloth) | 2 (mud/cotton) | 5–8 | 3–4 |
| Pattern logic | Broken asymmetric | Color rhythm | Symbol sequence | Negative reserve | Medallion + field | Half-drop tessellation |
| Boundary logic | Bleeds | Strip seam | Grid line | Chevron frame | Multi-border register | Border block set |

---

## Learning design notes

- This board is best preceded by the Greek Meander and Rome Mosaic lessons — students should already understand period and repeat unit before encountering textile complexity.
- The Kuba overlay JSON (`africa-kuba-raffia-broken-grid-overlay.json`) is the required interactive asset for this board.
- Adinkra is the most accessible entry point: the grid is visible, the stamp is a clear unit.
- Kuba raffia is the most advanced: the broken-grid illusion requires students to map the grid before they can see it.
- Persian carpet is the richest cross-domain connection: links to Islamic geometry, medallion construction, and color theory simultaneously.

---

*Board created for ArtisanalCanvas sacred geometry curriculum. See `source-and-rights-guide.md` for image sourcing rules.*
