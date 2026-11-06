import { z } from "zod";

export const SCENE_STORAGE_KEY = "geometry-engine.scene";
export const SCENE_VERSION = 1;

const vector = z.tuple([z.number().finite(), z.number().finite(), z.number().finite()]);
const nodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  primitive: z.enum(["ring", "sphere", "cone", "cube"]),
  position: vector,
  rotation: vector,
  scale: vector.refine((values) => values.every((value) => value >= 0.1)),
});
const sceneSchema = z.object({
  version: z.literal(SCENE_VERSION),
  nodes: z.array(nodeSchema).refine(
    (nodes) => new Set(nodes.map((node) => node.id)).size === nodes.length,
    "Object IDs must be unique",
  ),
});

export type GeometryNode = z.infer<typeof nodeSchema>;
export type Primitive = GeometryNode["primitive"];
export type Position3 = GeometryNode["position"];
export type SceneStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function serializeScene(nodes: GeometryNode[]): string {
  // Validate before writing too: never replace a good save with invalid state.
  return JSON.stringify(sceneSchema.parse({ version: SCENE_VERSION, nodes }));
}

export function deserializeScene(raw: string): GeometryNode[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("The saved scene is not valid JSON.");
  }
  if (typeof data === "object" && data !== null && "version" in data && data.version !== SCENE_VERSION) {
    throw new Error("The saved scene uses an unsupported version.");
  }
  const result = sceneSchema.safeParse(data);
  if (!result.success) throw new Error("The saved scene contains invalid objects or transforms.");
  return result.data.nodes;
}

export function loadScene(storage: SceneStorage): GeometryNode[] | null {
  const raw = storage.getItem(SCENE_STORAGE_KEY);
  return raw === null ? null : deserializeScene(raw);
}

export function saveScene(storage: SceneStorage, nodes: GeometryNode[]): void {
  storage.setItem(SCENE_STORAGE_KEY, serializeScene(nodes));
}

export function clearScene(storage: SceneStorage): void {
  storage.removeItem(SCENE_STORAGE_KEY);
}
