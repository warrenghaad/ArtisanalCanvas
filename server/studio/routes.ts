import { Router } from "express";
import { z } from "zod";
import {
  insertConceptSchema,
  insertPrimitiveCellSchema,
  insertStudioSourceSchema,
  swarmRequestSchema,
  PRIMITIVE_CATEGORIES,
} from "@shared/schema";
import { studioStorage } from "./storage";
import { runSwarm, persistSwarm } from "./swarm";
import { generateImage, imagesAvailable } from "./openaiImages";
import { llmAvailable } from "./llm";

export const studioRouter = Router();

function handleZod(error: unknown, res: import("express").Response): boolean {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: "Validation failed", details: error.errors });
    return true;
  }
  return false;
}

// ---- Status -----------------------------------------------------------------
studioRouter.get("/status", (_req, res) => {
  res.json({
    studio: "Line All Richie (LAR) Primitive Cell Studio",
    llmAvailable,
    imagesAvailable,
    categories: PRIMITIVE_CATEGORIES,
  });
});

// ---- Concepts ---------------------------------------------------------------
studioRouter.get("/concepts", async (_req, res) => {
  try {
    res.json(await studioStorage.listConcepts());
  } catch (e) {
    res.status(500).json({ error: "Failed to list concepts", message: String(e) });
  }
});

studioRouter.get("/concepts/:id", async (req, res) => {
  try {
    const concept = await studioStorage.getConcept(req.params.id);
    if (!concept) return res.status(404).json({ error: "Concept not found" });
    const primitives = await studioStorage.getConceptPrimitives(concept.id);
    res.json({ concept, primitives });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch concept", message: String(e) });
  }
});

studioRouter.post("/concepts", async (req, res) => {
  try {
    const data = insertConceptSchema.parse(req.body);
    res.status(201).json(await studioStorage.createConcept(data));
  } catch (e) {
    if (handleZod(e, res)) return;
    res.status(500).json({ error: "Failed to create concept", message: String(e) });
  }
});

studioRouter.patch("/concepts/:id", async (req, res) => {
  try {
    const updates = insertConceptSchema.partial().parse(req.body);
    const updated = await studioStorage.updateConcept(req.params.id, updates);
    if (!updated) return res.status(404).json({ error: "Concept not found" });
    res.json(updated);
  } catch (e) {
    if (handleZod(e, res)) return;
    res.status(500).json({ error: "Failed to update concept", message: String(e) });
  }
});

// ---- Primitive cells --------------------------------------------------------
studioRouter.get("/primitives", async (req, res) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    res.json(await studioStorage.listPrimitives(category));
  } catch (e) {
    res.status(500).json({ error: "Failed to list primitives", message: String(e) });
  }
});

studioRouter.get("/primitives/:id", async (req, res) => {
  try {
    const cell = await studioStorage.getPrimitive(req.params.id);
    if (!cell) return res.status(404).json({ error: "Primitive not found" });
    res.json(cell);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch primitive", message: String(e) });
  }
});

studioRouter.post("/primitives", async (req, res) => {
  try {
    const data = insertPrimitiveCellSchema.parse(req.body);
    res.status(201).json(await studioStorage.createPrimitive(data));
  } catch (e) {
    if (handleZod(e, res)) return;
    res.status(500).json({ error: "Failed to create primitive", message: String(e) });
  }
});

studioRouter.patch("/primitives/:id", async (req, res) => {
  try {
    const updates = insertPrimitiveCellSchema.partial().parse(req.body);
    const updated = await studioStorage.updatePrimitive(req.params.id, updates);
    if (!updated) return res.status(404).json({ error: "Primitive not found" });
    res.json(updated);
  } catch (e) {
    if (handleZod(e, res)) return;
    res.status(500).json({ error: "Failed to update primitive", message: String(e) });
  }
});

// ---- Images / swarm ---------------------------------------------------------
// Plan only: run the crew up to prompts (no image generation, no DB needed).
studioRouter.post("/images/plan", async (req, res) => {
  try {
    const request = swarmRequestSchema.parse({ ...req.body, generateImages: false });
    res.json(await runSwarm(request));
  } catch (e) {
    if (handleZod(e, res)) return;
    res.status(500).json({ error: "Failed to plan", message: String(e) });
  }
});

// Direct single-image generation from a raw prompt.
studioRouter.post("/images/generate", async (req, res) => {
  try {
    const { prompt, purpose, conceptId } = z
      .object({ prompt: z.string().min(1), purpose: z.string().optional(), conceptId: z.string().optional() })
      .parse(req.body);
    const result = await generateImage(prompt);
    let saved = null;
    try {
      saved = await studioStorage.createImage({
        conceptId: conceptId ?? null,
        prompt,
        imagePath: result.imagePath,
        model: result.model,
        purpose: purpose ?? "ad_hoc",
        primitiveManifest: null,
        critique: null,
        status: result.generated ? "raw" : "raw",
      });
    } catch (persistErr) {
      console.error("[studio] could not persist generated image:", persistErr);
    }
    res.json({ ...result, saved });
  } catch (e) {
    if (handleZod(e, res)) return;
    res.status(500).json({ error: "Failed to generate image", message: String(e) });
  }
});

// Full swarm: plan + generate + critique + librarian + persist.
studioRouter.post("/images/generate-with-swarm", async (req, res) => {
  try {
    const request = swarmRequestSchema.parse(req.body);
    const computed = await runSwarm(request);
    const result = await persistSwarm(computed);
    res.json(result);
  } catch (e) {
    if (handleZod(e, res)) return;
    res.status(500).json({ error: "Swarm failed", message: String(e) });
  }
});

studioRouter.get("/images", async (_req, res) => {
  try {
    res.json(await studioStorage.listImages());
  } catch (e) {
    res.status(500).json({ error: "Failed to list images", message: String(e) });
  }
});

studioRouter.get("/images/:id", async (req, res) => {
  try {
    const image = await studioStorage.getImage(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });
    res.json(image);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch image", message: String(e) });
  }
});

// ---- Graph ------------------------------------------------------------------
studioRouter.get("/graph", async (_req, res) => {
  try {
    res.json(await studioStorage.listEdges());
  } catch (e) {
    res.status(500).json({ error: "Failed to list graph edges", message: String(e) });
  }
});

// ---- Ingestion --------------------------------------------------------------
function ingestHandler(type: string) {
  return async (req: import("express").Request, res: import("express").Response) => {
    try {
      const data = insertStudioSourceSchema.parse({ ...req.body, type });
      res.status(201).json(await studioStorage.createSource(data));
    } catch (e) {
      if (handleZod(e, res)) return;
      res.status(500).json({ error: `Failed to ingest ${type}`, message: String(e) });
    }
  };
}

studioRouter.get("/sources", async (_req, res) => {
  try {
    res.json(await studioStorage.listSources());
  } catch (e) {
    res.status(500).json({ error: "Failed to list sources", message: String(e) });
  }
});
studioRouter.post("/ingest/chat", ingestHandler("chat"));
studioRouter.post("/ingest/reference", ingestHandler("external_ref"));
studioRouter.post("/ingest/drawing", ingestHandler("drawing"));
