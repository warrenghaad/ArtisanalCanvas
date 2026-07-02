import type { ManifestPrimitive, PrimitiveManifest } from "@shared/schema";
import type { DirectorPlan } from "./types";

// Deterministic primitive decomposition used when no LLM is available (and as a
// guaranteed-complete baseline the LLM output is merged onto). Encodes the
// user's priority ladder: every drawing starts from base GEOMETRIC primitives,
// then layers SACRED/aesthetic geometry, then FIGURE specifics, then anything
// else. Volume before contour, structure before detail, axis before decoration.

// Base geometric primitives that must appear in every drawing.
const BASE_GEOMETRIC: ManifestPrimitive[] = [
  { name: "bounding box", type: "box", role: "overall volume envelope", category: "geometric" },
  { name: "central axis", type: "axis", role: "primary gesture / tilt line", category: "geometric" },
  { name: "core sphere", type: "sphere", role: "main rounded mass", category: "geometric" },
  { name: "ground plane", type: "plane", role: "spatial anchor / horizon relation", category: "geometric" },
];

const SACRED_GEOMETRY: ManifestPrimitive[] = [
  { name: "proportion grid", type: "grid", role: "harmonic division (thirds / golden ratio)", category: "sacred" },
  { name: "radial symmetry guide", type: "radial", role: "aesthetic balance / rhythm", category: "sacred" },
];

interface SubjectProfile {
  match: (s: string) => boolean;
  skillFamily: string;
  primitives: ManifestPrimitive[];
  axes: string[];
  planes: string[];
  hinges: string[];
  rhythmLines: string[];
  valueColorStructure: string[];
  reusableCells: string[];
}

const PROFILES: SubjectProfile[] = [
  {
    match: (s) => /(face|head|portrait|expression|skull|brow|eye|mouth|jaw|cheek)/i.test(s),
    skillFamily: "face_expression",
    primitives: [
      { name: "skull mass", type: "sphere/egg", role: "main cranial volume", category: "figure" },
      { name: "face mask", type: "curved plane", role: "front facial plane", category: "figure" },
      { name: "brow ridge", type: "wedge", role: "expression hinge", category: "figure" },
      { name: "eye sockets", type: "paired concave wedges", role: "gaze structure", category: "figure" },
      { name: "nose wedge", type: "wedge/prism", role: "central projection", category: "figure" },
      { name: "mouth muzzle", type: "soft box/cylinder", role: "expression compression", category: "figure" },
      { name: "jaw block", type: "block/hinge", role: "lower face tension", category: "figure" },
      { name: "neck cylinder", type: "cylinder", role: "head-to-torso connection", category: "figure" },
    ],
    axes: ["head tilt axis", "facial centerline", "brow-eye-nose-mouth tilt lines"],
    planes: ["forehead plane", "cheek planes", "front vs side of nose", "jaw underside"],
    hinges: ["brow ridge", "jaw hinge"],
    rhythmLines: ["brow-to-cheek rhythm", "wrapping cross-contours of the mask"],
    valueColorStructure: ["core shadow along form turn", "warm light / cool shadow planes"],
    reusableCells: ["three_quarter_skull_mass", "brow_wedge", "mouth_muzzle", "jaw_hinge"],
  },
  {
    match: (s) => /(spiral|shell|fern|rose|horn|vine|coil|helix)/i.test(s),
    skillFamily: "primitive_forms",
    primitives: [
      { name: "spiral axis", type: "axis", role: "growth direction", category: "geometric" },
      { name: "cone", type: "cone", role: "tapering volume the ribbon wraps", category: "geometric" },
      { name: "ribbon", type: "ribbon", role: "wrapping surface", category: "geometric" },
      { name: "tilted rings", type: "torus slices", role: "cross-section depth cues", category: "geometric" },
    ],
    axes: ["spiral growth axis"],
    planes: ["inside vs outside of the ribbon"],
    hinges: [],
    rhythmLines: ["overlap rule front-over-back", "cross-contour wrap lines"],
    valueColorStructure: ["value/color depth: darker into the coil"],
    reusableCells: ["spiral_cone_ribbon", "cross_contour_wrap", "overlap_rule"],
  },
  {
    match: (s) => /(hand|finger|palm|fist|grip|thumb)/i.test(s),
    skillFamily: "primitive_forms",
    primitives: [
      { name: "palm box", type: "box", role: "palm mass", category: "figure" },
      { name: "finger cylinders", type: "cylinder chain", role: "segmented digits", category: "figure" },
      { name: "thumb wedge", type: "wedge", role: "opposable mass", category: "figure" },
      { name: "knuckle hinges", type: "hinge", role: "joint articulation", category: "figure" },
    ],
    axes: ["palm tilt axis", "knuckle arc"],
    planes: ["back-of-hand plane", "palm plane"],
    hinges: ["knuckle hinges", "wrist hinge"],
    rhythmLines: ["knuckle arc rhythm", "finger taper"],
    valueColorStructure: ["form shadow on underside of fingers"],
    reusableCells: ["hand_palm_box", "finger_cylinder_chain", "thumb_wedge"],
  },
  {
    match: (s) => /(scene|public|crowd|street|landscape|cafe|park|composition|environment)/i.test(s),
    skillFamily: "narrative_composition",
    primitives: [
      { name: "background plane", type: "plane", role: "depth backdrop", category: "geometric" },
      { name: "figure block-ins", type: "bean/box", role: "simplified people masses", category: "figure" },
      { name: "gesture paths", type: "axis", role: "movement and eye flow", category: "figure" },
      { name: "lighting scheme", type: "value plane", role: "mood and depth", category: "other" },
    ],
    axes: ["horizon line", "primary gesture paths"],
    planes: ["foreground / midground / background planes"],
    hinges: [],
    rhythmLines: ["eye-path through the scene", "repeated figure spacing"],
    valueColorStructure: ["atmospheric value recession", "key light direction"],
    reusableCells: ["scene_background_plane", "figure_bean_blockin", "gesture_path"],
  },
];

export function decomposeHeuristically(plan: DirectorPlan): PrimitiveManifest {
  const profile = PROFILES.find((p) => p.match(plan.subject));

  const primitives: ManifestPrimitive[] = [
    ...BASE_GEOMETRIC,
    ...SACRED_GEOMETRY,
    ...(profile?.primitives ?? []),
  ];

  return {
    subject: plan.subject,
    learningGoal: plan.learningGoal,
    level: plan.level,
    skillFamily: profile?.skillFamily ?? plan.skillFamily,
    primitives,
    axes: ["overall tilt / gesture axis", ...(profile?.axes ?? [])],
    planes: ["major light/shadow planes", ...(profile?.planes ?? [])],
    hinges: profile?.hinges ?? [],
    rhythmLines: profile?.rhythmLines ?? ["primary rhythm line through the form"],
    valueColorStructure: profile?.valueColorStructure ?? [
      "light / halftone / core shadow / reflected light",
    ],
    reusableCellsToSave: profile?.reusableCells ?? ["base_volume_blockin"],
    imageOutputs: plan.outputs,
  };
}

export function inferSkillFamily(subject: string): string {
  return PROFILES.find((p) => p.match(subject))?.skillFamily ?? "primitive_forms";
}
