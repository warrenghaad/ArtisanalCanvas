/**
 * Studio fixtures — example SourceNote and CanvasInteractionSpec data
 * derived from the minimum viable asset queue.
 * These drive the SourceNoteViewer and CanvasInteractionLayer in development.
 */
import type { SourceNote, CanvasInteractionSpec } from "../types";

export const EXAMPLE_SOURCE_NOTES: SourceNote[] = [
  {
    id: "sn-islamic-eight-point-star",
    conceptId: "islamic-6-8-12-star-family",
    title: "Islamic Eight-Point Star Construction",
    culturalContext: "Islamic world · 9th–16th century CE",
    assetTypes: ["flat-construction-vector", "canvas-interaction", "step-worksheet"],
    searchQuerySeeds: [
      "Islamic eight point star construction compass straightedge",
      "octagram star polygon tilework museum",
      "two overlapping squares Islamic geometric art",
    ],
    generatedAssets: [
      {
        type: "flat-construction-vector",
        path: "docs/sacred-geometry/assets/vectors/islamic-eight-point-star-construction.svg",
        status: "final",
        description: "Two overlapping squares inscribed in circle construction",
      },
    ],
    rightsNote: "See source-boards/islamic-eight-point-star-sources.md for museum references.",
    sourceBoardPath: "docs/sacred-geometry/assets/source-boards/islamic-eight-point-star-sources.md",
  },
  {
    id: "sn-islamic-girih",
    conceptId: "islamic-girih-network",
    title: "Islamic Girih Tile Set",
    culturalContext: "Islamic world · medieval geometric design system",
    assetTypes: ["flat-construction-vector", "canvas-interaction", "context-card"],
    searchQuerySeeds: [
      "girih tile set Islamic geometry decagon kite dart",
      "Dariush Deh Imam girih tiles",
      "Islamic geometric design five tile types",
    ],
    generatedAssets: [
      {
        type: "flat-construction-vector",
        path: "docs/sacred-geometry/assets/vectors/islamic-girih-tile-set.svg",
        status: "final",
        description: "Five girih tile types: decagon, elongated hexagon, bowtie, rhombus, pentagon",
      },
    ],
  },
  {
    id: "sn-rome-mosaic",
    conceptId: "rome-mosaic-tessellation",
    title: "Roman Mosaic Tessellation Repeat Unit",
    culturalContext: "Rome · 1st BCE–4th CE",
    assetTypes: ["flat-construction-vector", "material-raster", "reference-board"],
    searchQuerySeeds: [
      "Roman mosaic tessellation guilloche floor museum",
      "Roman floor mosaic octagon square pattern",
    ],
    generatedAssets: [
      {
        type: "flat-construction-vector",
        path: "docs/sacred-geometry/assets/vectors/rome-mosaic-repeat-unit.svg",
        status: "final",
        description: "Octagon-square tessellation repeat unit",
      },
    ],
  },
  {
    id: "sn-greece-meander",
    conceptId: "greece-meander-key",
    title: "Greek Meander — Continuous Path",
    culturalContext: "Greece · Archaic and Classical periods",
    assetTypes: ["flat-construction-vector", "step-worksheet"],
    searchQuerySeeds: [
      "Greek meander key pattern pottery border museum",
      "Greek fret continuous path band",
    ],
    generatedAssets: [
      {
        type: "flat-construction-vector",
        path: "docs/sacred-geometry/assets/vectors/greece-meander-continuous-path.svg",
        status: "final",
        description: "Continuous right-angle meander band with construction grid",
      },
    ],
  },
  {
    id: "sn-mesoamerica-stepped-fret",
    conceptId: "mesoamerica-stepped-fret",
    title: "Mesoamerican Stepped Fret Grid",
    culturalContext: "Mesoamerica · Aztec/Mexica, Zapotec, Teotihuacan",
    assetTypes: ["flat-construction-vector", "step-worksheet", "reference-board"],
    searchQuerySeeds: [
      "Mesoamerican stepped fret xicalcoliuhqui pattern museum",
      "Aztec stepped spiral fret architectural border",
    ],
    generatedAssets: [
      {
        type: "flat-construction-vector",
        path: "docs/sacred-geometry/assets/vectors/mesoamerica-stepped-fret-grid.svg",
        status: "final",
        description: "Xicalcoliuhqui stepped spiral 3×3 grid with alternating orientations",
      },
    ],
  },
  {
    id: "sn-persia-chahar-bagh",
    conceptId: "persia-chahar-bagh",
    title: "Persian Chahar Bagh — Fourfold Garden Plan",
    culturalContext: "Persia · Achaemenid through Safavid",
    assetTypes: ["flat-construction-vector", "canvas-interaction", "context-card"],
    searchQuerySeeds: [
      "Persian chahar bagh garden plan",
      "Iranian paradise garden fourfold geometry",
    ],
    generatedAssets: [
      {
        type: "flat-construction-vector",
        path: "docs/sacred-geometry/assets/vectors/persia-chahar-bagh-fourfold-plan.svg",
        status: "final",
        description: "Four-garden plan with water channels, central pool, entry gates",
      },
    ],
    contextWarning: "The chahar bagh plan originates as a cosmological diagram (four rivers of paradise). Context card should note this before use in secular curriculum.",
  },
  {
    id: "sn-north-africa-zellij",
    conceptId: "north-africa-zellij",
    title: "North Africa Zellij Star Repeat",
    culturalContext: "Morocco, Tunisia, Algeria · 10th century CE–present",
    assetTypes: ["material-raster", "flat-construction-vector", "reference-board"],
    searchQuerySeeds: [
      "Moroccan zellij tile geometric star pattern museum",
      "zellige cut tile star polygon color North Africa",
    ],
    generatedAssets: [
      {
        type: "flat-construction-vector",
        path: "docs/sacred-geometry/assets/vectors/north-africa-zellij-star-repeat.svg",
        status: "final",
        description: "Eight-point star tile repeat with terracotta/navy color logic",
      },
    ],
  },
  {
    id: "sn-renaissance-floor",
    conceptId: "renaissance-linear-perspective",
    title: "Renaissance One-Point Tiled Floor",
    culturalContext: "Renaissance Europe · 15th–16th century CE",
    assetTypes: ["flat-construction-vector", "canvas-interaction", "step-worksheet"],
    searchQuerySeeds: [
      "Renaissance linear perspective tiled floor diagram",
      "one-point perspective floor construction horizon VP",
    ],
    generatedAssets: [
      {
        type: "flat-construction-vector",
        path: "docs/sacred-geometry/assets/vectors/renaissance-one-point-tiled-floor.svg",
        status: "final",
        description: "One-point perspective floor with horizon, VP, orthogonals, and foreshortened transversals",
      },
    ],
  },
  {
    id: "sn-south-asia-kolam",
    conceptId: "south-asia-rangoli-kolam",
    title: "South Asia Kolam — Hand Line Study",
    culturalContext: "Tamil Nadu, South India · living daily practice",
    assetTypes: ["step-worksheet", "canvas-interaction", "expressive-linework-raster"],
    searchQuerySeeds: [
      "kolam dot grid looping line rangoli pattern",
      "Tamil kolam pulli dot threshold drawing",
    ],
    generatedAssets: [
      {
        type: "expressive-linework-raster",
        path: "docs/sacred-geometry/assets/raster/south-asia-kolam-hand-line-study.webp",
        status: "brief",
        description: "Three-state: dot grid → partial loop → completed kolam. Pressure-sensitive raster required.",
      },
      {
        type: "flat-construction-vector",
        path: "docs/sacred-geometry/assets/raster/south-asia-kolam-hand-line-study.placeholder.svg",
        status: "placeholder",
        description: "Compositional placeholder pending raster production",
      },
    ],
  },
  {
    id: "sn-china-cloud-scroll",
    conceptId: "china-cloud-scroll",
    title: "China Cloud Scroll — Brush Linework Study",
    culturalContext: "China · Bronze Age through contemporary",
    assetTypes: ["expressive-linework-raster", "step-worksheet", "material-raster"],
    searchQuerySeeds: [
      "Chinese cloud scroll geometry pattern",
      "Chinese yun wen cloud spiral brush linework study",
    ],
    generatedAssets: [
      {
        type: "expressive-linework-raster",
        path: "docs/sacred-geometry/assets/raster/china-cloud-scroll-brush-linework-study.webp",
        status: "brief",
        description: "Annotated single scroll + interlocking field. Brush pressure raster required.",
      },
      {
        type: "flat-construction-vector",
        path: "docs/sacred-geometry/assets/raster/china-cloud-scroll-brush-linework-study.placeholder.svg",
        status: "placeholder",
        description: "Compositional placeholder pending raster production",
      },
    ],
  },
  {
    id: "sn-kuba-raffia",
    conceptId: "africa-kuba-raffia",
    title: "Kuba Raffia — Broken Grid Overlay",
    culturalContext: "Kuba Kingdom (DRC) · 17th century CE–present",
    assetTypes: ["reference-board", "material-raster", "decomposition-overlay", "expressive-linework-raster"],
    searchQuerySeeds: [
      "Smithsonian National Museum African Art Kuba raffia cloth geometric pattern",
      "Brooklyn Museum Kuba embroidered cloth",
    ],
    generatedAssets: [
      {
        type: "decomposition-overlay",
        path: "docs/sacred-geometry/assets/overlays/africa-kuba-raffia-broken-grid-overlay.json",
        status: "final",
        description: "Layer toggle spec: base grid, axes, repeat unit, value groups, mark density",
      },
    ],
    contextWarning: "Kuba cloth is a living cultural tradition (not historical artifact). Respect community intellectual property.",
  },
  {
    id: "sn-screen-shadow",
    conceptId: "cross-cultural-screen-shadow",
    title: "Screen and Shadow — Cross-Cultural Comparison",
    culturalContext: "Islamic, South Asian, Chinese, North African screen traditions",
    assetTypes: ["canvas-interaction", "flat-construction-vector"],
    searchQuerySeeds: [
      "Islamic jali screen shadow geometry architecture",
      "mashrabiya screen shadow Islamic architecture",
      "Chinese lattice window shadow pattern",
    ],
    generatedAssets: [
      {
        type: "canvas-interaction",
        path: "docs/sacred-geometry/assets/overlays/cross-cultural-screen-shadow-interaction.json",
        status: "final",
        description: "Compare-cultures spec: 4 cultural screens, shadow projection, light angle control",
      },
    ],
  },
];

export const SCREEN_SHADOW_SPEC: CanvasInteractionSpec = {
  id: "cross-cultural-screen-shadow-interaction",
  conceptIds: [
    "islamic-jali-screen",
    "south-asia-jali",
    "china-lattice-window",
    "north-africa-mashrabiya-screen",
  ],
  title: "Screen and Shadow — Cross-Cultural Lattice Comparison",
  description:
    "Compare four cultural screen traditions and their shadow-casting geometry. Toggle screens, adjust light angle, and overlay two cultures for direct comparison.",
  interactionType: "compare-cultures",
  toggleLayers: [
    { id: "islamic-jali",    label: "Islamic Jali",     groupKey: "screen", defaultVisible: true },
    { id: "south-asia-jali", label: "South Asian Jali", groupKey: "screen", defaultVisible: false },
    { id: "china-lattice",   label: "Chinese Lattice",  groupKey: "screen", defaultVisible: false },
    { id: "mashrabiya",      label: "Mashrabiya",       groupKey: "screen", defaultVisible: false },
    { id: "shadow-projection", label: "Shadow",         groupKey: "effect", defaultVisible: true },
    { id: "overlay-compare",   label: "Overlay Two",    groupKey: "compare", defaultVisible: false },
  ],
  controls: [
    {
      id: "light-angle",
      type: "slider",
      label: "Light Angle (°)",
      min: 5, max: 85, default: 35, step: 5,
      affects: "shadow-projection",
    },
    {
      id: "shadow-opacity",
      type: "slider",
      label: "Shadow Opacity",
      min: 10, max: 90, default: 55, step: 5,
      affects: "shadow-projection",
    },
  ],
  interactionHints: [
    "Press 1–4 to switch between cultural screens",
    "Press S to toggle shadow",
    "Press Space to cycle all screens",
    "← → to adjust light angle",
  ],
  keyboardShortcuts: {
    "1": "show islamic-jali only",
    "2": "show south-asia-jali only",
    "3": "show china-lattice only",
    "4": "show mashrabiya only",
    "s": "toggle shadow-projection",
    "o": "toggle overlay-compare",
    " ": "cycle screens",
    "ArrowLeft": "decrease light-angle by 5",
    "ArrowRight": "increase light-angle by 5",
  },
  curriculumLinks: ["islamic-jali-screen", "south-asia-jali", "china-lattice-window", "north-africa-mashrabiya-screen"],
};
