import type { InsertPrimitiveCell } from "@shared/schema";
import { studioStorage } from "./storage";

// The starter primitive library, ordered by the user's priority ladder:
//   1. GEOMETRIC primitives that must be used in EVERY drawing
//   2. SACRED / aesthetic geometry layered on top
//   (FIGURE and OTHER cells are then grown by the swarm as lessons run)

const geometric: Array<Omit<InsertPrimitiveCell, "category" | "status">> = [
  { name: "sphere", primitiveType: "sphere", description: "Primary rounded mass; the basis of heads, joints, fruit, planets.", reusablePrompt: "A sphere as a core volume, with cross-contours showing its turn.", constructionSteps: ["Draw the circle silhouette.", "Add the great-circle cross-contours.", "Place the core shadow along the form turn."], reuseCases: ["head mass", "shoulder", "berry"], tags: ["base"], orderIndex: 1 },
  { name: "box", primitiveType: "box", description: "Six-sided volume for blocking any object into perspective.", reusablePrompt: "A box in three-quarter perspective establishing top, front and side planes.", constructionSteps: ["Set the front plane.", "Project depth to a vanishing point.", "Confirm the hidden edges."], reuseCases: ["torso block", "building", "furniture"], tags: ["base"], orderIndex: 2 },
  { name: "cylinder", primitiveType: "cylinder", description: "Extruded circle for limbs, necks, trunks, columns.", reusablePrompt: "A cylinder with elliptical end-caps that tighten toward the horizon.", constructionSteps: ["Draw the central axis.", "Add ellipses at each end.", "Connect the contour sides."], reuseCases: ["arm", "neck", "tree trunk"], tags: ["base"], orderIndex: 3 },
  { name: "cone", primitiveType: "cone", description: "Tapering volume; basis of spirals, hats, noses, trees.", reusablePrompt: "A cone with an elliptical base and a single apex.", constructionSteps: ["Set the axis and apex.", "Draw the base ellipse.", "Run the contour sides to the apex."], reuseCases: ["spiral core", "nose", "pine tree"], tags: ["base"], orderIndex: 4 },
  { name: "torus", primitiveType: "torus", description: "Ring volume for tubes, lips, tires, donut forms.", reusablePrompt: "A torus showing inner and outer cross-contours.", constructionSteps: ["Draw the ring path.", "Add tube cross-sections.", "Resolve the overlap on the near side."], reuseCases: ["lips", "tire", "coil section"], tags: ["base"], orderIndex: 5 },
  { name: "plane", primitiveType: "plane", description: "Flat surface for grounds, walls, facets of larger forms.", reusablePrompt: "A tilted plane reading clearly in space.", constructionSteps: ["Define the four corners.", "Check the perspective convergence.", "Assign it a value relative to the light."], reuseCases: ["ground", "cheek plane", "wall"], tags: ["base"], orderIndex: 6 },
  { name: "wedge", primitiveType: "wedge", description: "Angled block for noses, brows, prows, directional masses.", reusablePrompt: "A wedge / triangular prism projecting from a surface.", constructionSteps: ["Block the triangular cross-section.", "Extrude along its axis.", "Set the leading edge."], reuseCases: ["nose", "brow ridge", "ship prow"], tags: ["base"], orderIndex: 7 },
  { name: "ribbon", primitiveType: "ribbon", description: "A wrapping surface for spirals, cloth, hair, banners.", reusablePrompt: "A ribbon wrapping a hidden core, with clear front/back overlap.", constructionSteps: ["Establish the path it follows.", "Show its width turning in space.", "Apply the front-over-back overlap rule."], reuseCases: ["spiral", "cloth fold", "hair strand"], tags: ["base"], orderIndex: 8 },
  { name: "spiral", primitiveType: "spiral", description: "Axis + cone + ribbon system: ferns, shells, roses, horns, vines.", reusablePrompt: "A spiral built as a ribbon wrapping a cone along a growth axis.", constructionSteps: ["Set the growth axis.", "Wrap tilted rings around an implied cone.", "Apply value depth into the coil."], reuseCases: ["shell", "fern", "rose"], tags: ["base", "compound"], orderIndex: 9 },
  { name: "mask", primitiveType: "mask", description: "Curved front plane wrapping a sphere; the face shield.", reusablePrompt: "A curved mask plane wrapping the front of a sphere.", constructionSteps: ["Place the sphere.", "Wrap the curved front plane.", "Mark the brow/eye/nose/mouth tilt lines."], reuseCases: ["face mask", "helmet front"], tags: ["base", "figure"], orderIndex: 10 },
  { name: "hinge", primitiveType: "hinge", description: "Articulating joint relationship between two masses.", reusablePrompt: "A hinge joint showing the rotation between two forms.", constructionSteps: ["Identify the two masses.", "Mark the pivot axis.", "Show the range of rotation."], reuseCases: ["jaw", "knuckle", "elbow"], tags: ["base"], orderIndex: 11 },
  { name: "contour_loop", primitiveType: "contour_loop", description: "Cross-contour line that describes surface turn and depth.", reusablePrompt: "Cross-contour loops wrapping a form to describe its volume.", constructionSteps: ["Follow the surface across the form.", "Tighten loops where the surface turns away.", "Keep them perpendicular to the axis."], reuseCases: ["any rounded volume"], tags: ["base"], orderIndex: 12 },
];

const sacred: Array<Omit<InsertPrimitiveCell, "category" | "status">> = [
  { name: "golden_ratio_grid", primitiveType: "grid", description: "Phi-based proportional division for harmonious placement.", reusablePrompt: "A golden-ratio rectangle subdivision used to place key features.", constructionSteps: ["Draw the root rectangle.", "Subdivide by phi.", "Anchor focal points to the divisions."], reuseCases: ["composition", "facial proportion"], tags: ["aesthetic"], orderIndex: 20 },
  { name: "vesica_piscis", primitiveType: "radial", description: "Two overlapping circles; root of sacred geometric construction.", reusablePrompt: "A vesica piscis from two equal overlapping circles.", constructionSteps: ["Draw the first circle.", "Centre the second on its edge.", "Use the lens as a proportional seed."], reuseCases: ["mandorla", "eye construction"], tags: ["aesthetic"], orderIndex: 21 },
  { name: "flower_of_life", primitiveType: "radial", description: "Hexagonal lattice of circles; aesthetic symmetry scaffold.", reusablePrompt: "A flower-of-life lattice as an underlying symmetry grid.", constructionSteps: ["Draw the seed circle.", "Ring it with six circles.", "Extend the lattice as needed."], reuseCases: ["ornament", "rosette"], tags: ["aesthetic"], orderIndex: 22 },
  { name: "fibonacci_spiral", primitiveType: "spiral", description: "Quarter-arc spiral through Fibonacci squares; natural growth rhythm.", reusablePrompt: "A Fibonacci spiral guiding eye-flow and growth.", constructionSteps: ["Tile Fibonacci squares.", "Arc through each square.", "Use it to route the eye."], reuseCases: ["shell", "composition flow"], tags: ["aesthetic"], orderIndex: 23 },
  { name: "radial_symmetry", primitiveType: "radial", description: "Rotational repetition about a centre for balance and ornament.", reusablePrompt: "Radial symmetry repeating a motif about a centre.", constructionSteps: ["Set the centre and spoke count.", "Draw one motif.", "Repeat it about the centre."], reuseCases: ["rose window", "flower", "mandala"], tags: ["aesthetic"], orderIndex: 24 },
];

// Idempotent: only inserts cells that aren't already present (by name).
export async function seedStudioPrimitives(): Promise<void> {
  const cells: InsertPrimitiveCell[] = [
    ...geometric.map((c) => ({ ...c, category: "geometric" as const, status: "canon" as const })),
    ...sacred.map((c) => ({ ...c, category: "sacred" as const, status: "canon" as const })),
  ];
  for (const cell of cells) {
    const existing = await studioStorage.findPrimitiveByName(cell.name);
    if (!existing) await studioStorage.createPrimitive(cell);
  }
}
