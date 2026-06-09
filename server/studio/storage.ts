import { eq, desc } from "drizzle-orm";
import { studioDb as db } from "./db";
import {
  studioSources,
  concepts,
  primitiveCells,
  conceptPrimitives,
  generatedImages,
  graphEdges,
  type StudioSource,
  type InsertStudioSource,
  type Concept,
  type InsertConcept,
  type PrimitiveCell,
  type InsertPrimitiveCell,
  type ConceptPrimitive,
  type InsertConceptPrimitive,
  type GeneratedImage,
  type InsertGeneratedImage,
  type GraphEdge,
  type InsertGraphEdge,
} from "@shared/schema";

// Data-access layer for the Primitive Cell Studio. Mirrors the style of
// server/storage.ts (Drizzle over Neon/Postgres) but is kept in its own module
// so the new surface is isolated from the Academy storage.
export class StudioStorage {
  // ----- Sources -----
  async listSources(): Promise<StudioSource[]> {
    return db.select().from(studioSources).orderBy(desc(studioSources.createdAt));
  }
  async getSource(id: string): Promise<StudioSource | undefined> {
    const r = await db.select().from(studioSources).where(eq(studioSources.id, id)).limit(1);
    return r[0];
  }
  async createSource(source: InsertStudioSource): Promise<StudioSource> {
    const r = await db.insert(studioSources).values(source).returning();
    return r[0];
  }

  // ----- Concepts -----
  async listConcepts(): Promise<Concept[]> {
    return db.select().from(concepts).orderBy(concepts.level, concepts.title);
  }
  async getConcept(id: string): Promise<Concept | undefined> {
    const r = await db.select().from(concepts).where(eq(concepts.id, id)).limit(1);
    return r[0];
  }
  async createConcept(concept: InsertConcept): Promise<Concept> {
    const r = await db.insert(concepts).values(concept).returning();
    return r[0];
  }
  async updateConcept(id: string, updates: Partial<InsertConcept>): Promise<Concept | undefined> {
    const r = await db.update(concepts).set(updates).where(eq(concepts.id, id)).returning();
    return r[0];
  }

  // ----- Primitive cells -----
  async listPrimitives(category?: string): Promise<PrimitiveCell[]> {
    const rows = await db
      .select()
      .from(primitiveCells)
      .orderBy(primitiveCells.orderIndex, primitiveCells.name);
    return category ? rows.filter((c) => c.category === category) : rows;
  }
  async getPrimitive(id: string): Promise<PrimitiveCell | undefined> {
    const r = await db.select().from(primitiveCells).where(eq(primitiveCells.id, id)).limit(1);
    return r[0];
  }
  async findPrimitiveByName(name: string): Promise<PrimitiveCell | undefined> {
    const r = await db
      .select()
      .from(primitiveCells)
      .where(eq(primitiveCells.name, name))
      .limit(1);
    return r[0];
  }
  async createPrimitive(cell: InsertPrimitiveCell): Promise<PrimitiveCell> {
    const r = await db.insert(primitiveCells).values(cell).returning();
    return r[0];
  }
  async updatePrimitive(
    id: string,
    updates: Partial<InsertPrimitiveCell>,
  ): Promise<PrimitiveCell | undefined> {
    const r = await db
      .update(primitiveCells)
      .set(updates)
      .where(eq(primitiveCells.id, id))
      .returning();
    return r[0];
  }

  // ----- Concept <-> primitive links -----
  async linkConceptPrimitive(link: InsertConceptPrimitive): Promise<ConceptPrimitive> {
    const r = await db.insert(conceptPrimitives).values(link).returning();
    return r[0];
  }
  async getConceptPrimitives(conceptId: string): Promise<ConceptPrimitive[]> {
    return db
      .select()
      .from(conceptPrimitives)
      .where(eq(conceptPrimitives.conceptId, conceptId))
      .orderBy(conceptPrimitives.orderIndex);
  }

  // ----- Generated images -----
  async listImages(): Promise<GeneratedImage[]> {
    return db.select().from(generatedImages).orderBy(desc(generatedImages.createdAt));
  }
  async getImage(id: string): Promise<GeneratedImage | undefined> {
    const r = await db.select().from(generatedImages).where(eq(generatedImages.id, id)).limit(1);
    return r[0];
  }
  async createImage(image: InsertGeneratedImage): Promise<GeneratedImage> {
    const r = await db.insert(generatedImages).values(image).returning();
    return r[0];
  }
  async updateImage(
    id: string,
    updates: Partial<InsertGeneratedImage>,
  ): Promise<GeneratedImage | undefined> {
    const r = await db
      .update(generatedImages)
      .set(updates)
      .where(eq(generatedImages.id, id))
      .returning();
    return r[0];
  }

  // ----- Graph edges -----
  async listEdges(): Promise<GraphEdge[]> {
    return db.select().from(graphEdges).orderBy(desc(graphEdges.createdAt));
  }
  async createEdge(edge: InsertGraphEdge): Promise<GraphEdge> {
    const r = await db.insert(graphEdges).values(edge).returning();
    return r[0];
  }
  async createEdges(edges: InsertGraphEdge[]): Promise<GraphEdge[]> {
    if (edges.length === 0) return [];
    return db.insert(graphEdges).values(edges).returning();
  }
}

export const studioStorage = new StudioStorage();
