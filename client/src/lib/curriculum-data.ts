export const curriculumData = {
  "module_id": "perspective_proportion_v1",
  "title": "Renaissance Perspective & Proportional Scene Construction (Adult Track)",
  "purpose": "Build rigorous spatial scaffolding for realistic + experimental geometric compositions.",
  "prerequisites": [
    "Comfort drawing basic solids (cube, cylinder, cone, sphere)",
    "Familiar with straightedge & compass basics (perpendicular, equilateral triangle)",
    "Understands similar triangles informally"
  ],
  "core_principles": [
    "Picture Plane (PP)",
    "Station Point (SP)",
    "Horizon Line (HL) = eye level",
    "Vanishing Point (VP) per principal set of parallel lines",
    "Measuring Line (ML)",
    "Ground Line (GL)",
    "Cone of Vision (avoid distortion)",
    "Scaling by Similar Triangles"
  ],
  "learning_sequence": [
    {
      "phase": "FOUNDATION_ORIENTATION",
      "phaseId": 1,
      "title": "Foundation Orientation",
      "subtitle": "Horizon Line & Picture Plane",
      "objectives": [
        "Identify HL in master paintings",
        "Differentiate eye level vs viewer height",
        "Place simple box relative to HL (above/below)"
      ],
      "exercises": [
        {
          "id": "HL_detection",
          "title": "Horizon Line Detection",
          "description": "Draw 5 boxes: 2 above HL (see bottoms), 2 below HL (see tops), 1 straddling HL.",
          "timeEstimate": 15,
          "learningObjectives": [
            "Correct HL placement",
            "Consistent visible planes",
            "Understanding of eye level"
          ]
        },
        {
          "id": "PP_concept",
          "title": "Picture Plane Concept",
          "description": "Explain picture plane as 'glass sheet'; trace object contact points.",
          "timeEstimate": 10,
          "learningObjectives": [
            "Understanding picture plane concept",
            "Spatial visualization skills"
          ]
        }
      ],
      "assessment_focus": "Correct HL placement + consistent visible planes"
    },
    {
      "phase": "SINGLE_POINT_PERSPECTIVE",
      "phaseId": 2,
      "title": "Single Point Perspective",
      "subtitle": "Measuring Lines & Depth",
      "objectives": [
        "Use one VP for frontal planes",
        "Employ measuring line to scale repeats (tiles, fence posts)",
        "Establish depth via equal real spacing → diminishing intervals"
      ],
      "exercises": [
        {
          "id": "tile_floor",
          "title": "Tile Floor Grid",
          "description": "Create a 6 x 8 grid using checker method (diagonal to subdivide).",
          "timeEstimate": 25,
          "learningObjectives": [
            "Single-point construction",
            "Measuring line technique",
            "Consistent depth intervals"
          ]
        },
        {
          "id": "column_row",
          "title": "Row of Columns",
          "description": "First two drawn, remaining located via measuring line transfer.",
          "timeEstimate": 20,
          "learningObjectives": [
            "Proportional scaling",
            "Measuring line application",
            "Depth perception"
          ]
        },
        {
          "id": "hallway_interior",
          "title": "Interior Hallway",
          "description": "Interior hallway with doorways at equal real spacing.",
          "timeEstimate": 30,
          "learningObjectives": [
            "Complex interior perspective",
            "Multiple elements coordination",
            "Architectural understanding"
          ]
        }
      ],
      "common_errors": [
        "Diverging lines (VP drift)",
        "Inconsistent interval shrink (skip similar triangle logic)"
      ]
    },
    {
      "phase": "TWO_POINT_PERSPECTIVE",
      "phaseId": 3,
      "title": "Two Point Perspective",
      "subtitle": "Corner Views & VP_L/VP_R",
      "objectives": [
        "Use VP_L & VP_R for horizontal edges",
        "Maintain verticals true to page",
        "Rotate object on ground plane mentally"
      ],
      "exercises": [
        {
          "id": "shopfront_row",
          "title": "Row of Shopfronts",
          "description": "Row of shopfronts decreasing in depth.",
          "timeEstimate": 35,
          "learningObjectives": [
            "Two-point construction",
            "Multiple vanishing points",
            "Architectural rhythm"
          ]
        },
        {
          "id": "stacked_boxes",
          "title": "Stacked Boxes",
          "description": "Stacked boxes (shared vertical alignment).",
          "timeEstimate": 20,
          "learningObjectives": [
            "Vertical alignment",
            "Multiple object coordination",
            "Two-point consistency"
          ]
        },
        {
          "id": "street_corner",
          "title": "Street Corner",
          "description": "Street corner: inset doorway recess.",
          "timeEstimate": 40,
          "learningObjectives": [
            "Complex corner construction",
            "Recessed elements",
            "Environmental perspective"
          ]
        }
      ]
    },
    {
      "phase": "THREE_POINT_PERSPECTIVE",
      "phaseId": 4,
      "title": "Three Point Perspective",
      "subtitle": "Vertical Convergence",
      "objectives": [
        "Introduce VP vertical (up or down for looking up / down)",
        "Control distortion by pushing vertical VP far enough",
        "Apply to tall architectural forms"
      ],
      "exercises": [
        {
          "id": "skyscraper_worms_eye",
          "title": "Skyscraper Worm's Eye",
          "description": "Skyscraper from worm's-eye view.",
          "timeEstimate": 45,
          "learningObjectives": [
            "Three-point construction",
            "Vertical convergence",
            "Dramatic viewpoints"
          ]
        },
        {
          "id": "tower_birds_eye",
          "title": "Tower Bird's Eye",
          "description": "Tower from bird's-eye view (HL high).",
          "timeEstimate": 40,
          "learningObjectives": [
            "High viewpoint perspective",
            "Downward convergence",
            "Complex form construction"
          ]
        }
      ]
    },
    {
      "phase": "MULTI_OBJECT_RELATIONAL_PROPORTION",
      "phaseId": 5,
      "title": "Multi-Object Relations",
      "subtitle": "Proportional Scaling",
      "objectives": [
        "Scale figures in depth using ground line intersections",
        "Align multiple objects to consistent HL/VP set",
        "Place cylindrical + organic volumes inside bounding boxes"
      ],
      "exercises": [
        {
          "id": "market_scene",
          "title": "Market Scene",
          "description": "Market scene: 6 figures receding; annotate height logic.",
          "timeEstimate": 60,
          "learningObjectives": [
            "Figure scaling in depth",
            "Multiple character coordination",
            "Environmental integration"
          ]
        },
        {
          "id": "still_life_perspective",
          "title": "Still Life in Perspective",
          "description": "Still life: cube, sphere, cylinder sharing a tiled plane.",
          "timeEstimate": 45,
          "learningObjectives": [
            "Object combination",
            "Surface plane integration",
            "Form variety coordination"
          ]
        }
      ]
    },
    {
      "phase": "RENAISSANCE_PROPORTION_SYSTEMS",
      "phaseId": 6,
      "title": "Renaissance Proportions",
      "subtitle": "Golden Ratios & Grids",
      "objectives": [
        "Use canon grids (8-head & 7.5-head variants)",
        "Apply façade proportional rectangles (root 2, root 3, golden rectangle qualitative)",
        "Overlay geometric armature (baroque diagonal, golden spiral suggestion)"
      ],
      "exercises": [
        {
          "id": "figure_proportions",
          "title": "Figure Proportions",
          "description": "Divide figure height into head units; compare master drawing.",
          "timeEstimate": 30,
          "learningObjectives": [
            "Classical proportions",
            "Head unit measurements",
            "Historical accuracy"
          ]
        },
        {
          "id": "golden_composition",
          "title": "Golden Rectangle Composition",
          "description": "Compose still life using golden area emphasis zones.",
          "timeEstimate": 50,
          "learningObjectives": [
            "Golden ratio application",
            "Compositional harmony",
            "Mathematical art principles"
          ]
        }
      ]
    },
    {
      "phase": "ADVANCED_EUCLIDEAN_ARTISTIC_PROOFS",
      "phaseId": 7,
      "title": "Euclidean Proofs",
      "subtitle": "Mathematical Foundations",
      "objectives": [
        "Justify perspective depth scaling via similar triangles formally",
        "Prove equal angular spacing → consistent rosette subdivision",
        "Show duality of cube ↔ octahedron via midpoint locus"
      ],
      "exercises": [
        {
          "id": "similar_triangles_proof",
          "title": "Similar Triangles Proof",
          "description": "Prove ratio of segment lengths matches ratio of projections.",
          "timeEstimate": 40,
          "learningObjectives": [
            "Mathematical reasoning",
            "Geometric proof construction",
            "Perspective theory foundation"
          ]
        }
      ]
    },
    {
      "phase": "SCENE_SYNTHESIS",
      "phaseId": 8,
      "title": "Scene Synthesis",
      "subtitle": "Complete Compositions",
      "objectives": [
        "Merge architectural grid + proportional figures + atmospheric depth",
        "Introduce light logic: shadow vanishing points",
        "Prepare for stylistic distortion (Cubist / Escher pivot)"
      ],
      "exercises": [
        {
          "id": "cloister_interior",
          "title": "Cloister Interior",
          "description": "Cloister interior: repetitive arches, receding figures, light shaft angle.",
          "timeEstimate": 90,
          "learningObjectives": [
            "Complex architectural environment",
            "Figure integration",
            "Light and shadow",
            "Atmospheric perspective"
          ]
        },
        {
          "id": "urban_corner_complete",
          "title": "Complete Urban Corner",
          "description": "Urban corner: two-point base + inserted staircase in 3-point segment.",
          "timeEstimate": 120,
          "learningObjectives": [
            "Mixed perspective systems",
            "Environmental complexity",
            "Master-level composition"
          ]
        }
      ]
    }
  ],
  "mastery_checklist": {
    "L1": "Correct HL & VP placement",
    "L2": "Accurate single-point depth scaling",
    "L3": "Two-point boxes with consistent convergence",
    "L4": "Multiple objects coherent in shared grid",
    "L5": "Figure scale in depth plausible",
    "L6": "Proof articulation (one formal similar triangle argument)",
    "L7": "Integrated scene: architecture + figures + light + proportion armature"
  },
  "common_errors": [
    {"issue": "Widening convergence", "fix": "Extend lines—must meet at a single VP."},
    {"issue": "Floating figures", "fix": "Align foot contact to ground plane receding lines."},
    {"issue": "Inconsistent object heights in depth", "fix": "Use measuring pole + projection."},
    {"issue": "Over-distorted 3-point", "fix": "Increase distance of vertical VP off page."}
  ]
};

export type CurriculumPhase = typeof curriculumData.learning_sequence[0];
export type Exercise = CurriculumPhase['exercises'][0];
