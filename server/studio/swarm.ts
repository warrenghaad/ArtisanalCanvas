import type {
  SwarmRequest,
  PrimitiveManifest,
  Critique,
  StudioStatus,
  InsertPrimitiveCell,
} from "@shared/schema";
import { studioDirector } from "./agents/studioDirector";
import { primitiveDecomposer } from "./agents/primitiveDecomposer";
import { curriculumMapper } from "./agents/curriculumMapper";
import { promptArchitect } from "./agents/promptArchitect";
import { imageGenerator, type GeneratedImageRecord } from "./agents/imageGenerator";
import { critiqueAgent } from "./agents/critiqueAgent";
import { primitiveLibrarian } from "./agents/primitiveLibrarian";
import { canonClerk } from "./agents/canonClerk";
import type { CurriculumPlacement, ImagePromptSpec, PracticeCard, DirectorPlan } from "./agents/types";
import { saveManifest } from "./assetStore";
import { studioStorage } from "./storage";

// A readable, name-based view of a relationship for API responses.
export interface GraphEdgeView {
  from: string;
  to: string;
  edgeType: string;
}

export interface SwarmResult {
  plan: DirectorPlan;
  placement: CurriculumPlacement;
  primitiveManifest: PrimitiveManifest;
  imagePrompts: ImagePromptSpec[];
  generatedImages: GeneratedImageRecord[];
  newPrimitiveCells: InsertPrimitiveCell[];
  graphEdges: GraphEdgeView[];
  practiceCard: PracticeCard;
  critique: Critique;
  status: StudioStatus;
  manifestPath: string | null;
  persisted: boolean;
  conceptId: string | null;
}

function buildPracticeCard(manifest: PrimitiveManifest): PracticeCard {
  return {
    title: `Practice: ${manifest.subject}`,
    goal: manifest.learningGoal,
    steps: [
      `Block in the base geometric primitives: ${manifest.primitives
        .filter((p) => p.category === "geometric")
        .map((p) => p.name)
        .join(", ")}.`,
      `Establish axes: ${manifest.axes.join(", ")}.`,
      `Add the specific forms: ${manifest.primitives
        .filter((p) => p.category !== "geometric")
        .map((p) => p.name)
        .join(", ") || "(none beyond the base forms)"}.`,
      `Resolve planes and value structure: ${manifest.valueColorStructure.join(", ")}.`,
    ],
    checkpoints: [
      "Is volume established before contour?",
      "Do the primitives read clearly without the final detail?",
      `Are the reusable cells identifiable? (${manifest.reusableCellsToSave.join(", ")})`,
    ],
  };
}

// Compute-only pipeline: runs the full crew, no database required. Used by both
// /plan (no images) and /generate-with-swarm (then persisted separately).
export async function runSwarm(req: SwarmRequest): Promise<Omit<SwarmResult, "persisted" | "conceptId" | "manifestPath">> {
  const plan = await studioDirector(req);
  const manifest = await primitiveDecomposer(plan);
  const placement = await curriculumMapper(manifest);
  // Fold curriculum placement back into the manifest.
  manifest.level = placement.level;
  manifest.skillFamily = placement.skillFamily;

  const imagePrompts = promptArchitect(manifest, plan);
  const generatedImages = await imageGenerator(imagePrompts, req.generateImages);
  const critique = await critiqueAgent(manifest, generatedImages);
  const newPrimitiveCells = primitiveLibrarian(manifest, critique);
  const status = canonClerk(critique);
  const practiceCard = buildPracticeCard(manifest);

  // Name-based relationship view (concept uses each primitive; each primitive
  // belongs to the concept; reusable cells are variants worth saving).
  const graphEdges: GraphEdgeView[] = newPrimitiveCells.flatMap((cell) => [
    { from: manifest.subject, to: cell.name, edgeType: "uses" },
    { from: cell.name, to: manifest.subject, edgeType: "belongs_to" },
  ]);

  return {
    plan,
    placement,
    primitiveManifest: manifest,
    imagePrompts,
    generatedImages,
    newPrimitiveCells,
    graphEdges,
    practiceCard,
    critique,
    status,
  };
}

// Persist a computed swarm result. Cells are upserted by name so the library
// grows without duplicating shared primitives. Best-effort: on DB failure the
// computed result is still returned with persisted:false.
export async function persistSwarm(
  computed: Awaited<ReturnType<typeof runSwarm>>,
): Promise<SwarmResult> {
  const base: SwarmResult = {
    ...computed,
    persisted: false,
    conceptId: null,
    manifestPath: null,
  };

  try {
    const manifest = computed.primitiveManifest;
    base.manifestPath = await saveManifest(manifest.subject, manifest).catch(() => null);

    const concept = await studioStorage.createConcept({
      title: manifest.subject,
      type: "lesson",
      level: manifest.level,
      skillFamily: manifest.skillFamily,
      prerequisites: computed.placement.prerequisites,
      status: "candidate",
      summary: manifest.learningGoal,
    });
    base.conceptId = concept.id;

    // Upsert each primitive cell by name, then link to the concept.
    const cellIdByName = new Map<string, string>();
    for (let i = 0; i < computed.newPrimitiveCells.length; i++) {
      const insert = computed.newPrimitiveCells[i];
      const existing = await studioStorage.findPrimitiveByName(insert.name);
      const cell = existing ?? (await studioStorage.createPrimitive(insert));
      cellIdByName.set(insert.name, cell.id);
      await studioStorage.linkConceptPrimitive({
        conceptId: concept.id,
        primitiveId: cell.id,
        role: insert.description ?? null,
        orderIndex: i,
      });
    }

    // Persist generated images (or their planned prompts when no image file).
    for (const img of computed.generatedImages) {
      await studioStorage.createImage({
        conceptId: concept.id,
        prompt: img.prompt,
        imagePath: img.imagePath,
        model: img.model,
        purpose: img.purpose,
        primitiveManifest: manifest,
        critique: computed.critique,
        status: img.generated ? computed.status : "raw",
      });
    }

    // Persist id-based graph edges (concept -> primitive).
    const edges = computed.newPrimitiveCells
      .map((cell) => {
        const toId = cellIdByName.get(cell.name);
        return toId
          ? { fromId: concept.id, toId, edgeType: "uses", notes: cell.description ?? null }
          : null;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);
    await studioStorage.createEdges(edges);

    base.persisted = true;
  } catch (error) {
    console.error("[studio] swarm persistence failed (returning computed result):", error);
  }

  return base;
}
