import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  currentPhase: integer("current_phase").default(1),
  masteryLevel: integer("mastery_level").default(1),
  totalPracticeTime: integer("total_practice_time").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  phaseId: integer("phase_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  completed: boolean("completed").default(false),
  score: integer("score"),
  timeSpent: integer("time_spent"),
  attempts: integer("attempts").default(1),
  feedback: text("feedback"),
  completedAt: timestamp("completed_at"),
});

export const practiceSession = pgTable("practice_session", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionType: text("session_type").notNull(), // 'exercise', 'drill', 'practice'
  duration: integer("duration").notNull(),
  phaseId: integer("phase_id"),
  exerciseId: text("exercise_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const drawingSubmission = pgTable("drawing_submission", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  imageData: text("image_data").notNull(), // base64 encoded image
  aiAssessment: jsonb("ai_assessment"),
  score: integer("score"),
  feedback: text("feedback"),
  submitted: boolean("submitted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  completedAt: true,
});

export const insertPracticeSessionSchema = createInsertSchema(practiceSession).omit({
  id: true,
  createdAt: true,
});

export const insertDrawingSubmissionSchema = createInsertSchema(drawingSubmission).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type PracticeSession = typeof practiceSession.$inferSelect;
export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;
export type DrawingSubmission = typeof drawingSubmission.$inferSelect;
export type InsertDrawingSubmission = z.infer<typeof insertDrawingSubmissionSchema>;

// AI Assessment types
export const assessmentResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  specificFeedback: z.object({
    horizonLine: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string(),
    }),
    vanishingPoints: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string(),
    }),
    proportions: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string(),
    }),
    convergence: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string(),
    }),
  }),
  nextSteps: z.array(z.string()),
  readyForNext: z.boolean(),
});

export type AssessmentResult = z.infer<typeof assessmentResultSchema>;

// Grade-level curriculum mappings
export const curriculumMapping = pgTable("curriculum_mapping", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  gradeLevel: varchar("grade_level", { length: 20 }).notNull(), // K, 1, 2, 3, 4, 5, 6, 7, 8
  historicalPeriod: varchar("historical_period", { length: 100 }).notNull(),
  timeWeighting: decimal("time_weighting", { precision: 5, scale: 2 }).notNull(), // Percentage of year
  focusAreas: text("focus_areas").array(), // Array of focus areas for this period/grade
  objectives: jsonb("objectives"), // Learning objectives
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCurriculumMappingSchema = createInsertSchema(curriculumMapping).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCurriculumMapping = z.infer<typeof insertCurriculumMappingSchema>;
export type CurriculumMapping = typeof curriculumMapping.$inferSelect;

// Historical Period content
export const historicalPeriodContent = pgTable("historical_period_content", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  periodId: varchar("period_id", { length: 100 }).notNull(),
  periodName: varchar("period_name", { length: 200 }).notNull(),
  dateRange: varchar("date_range", { length: 100 }),
  description: text("description"),
  artPatterns: jsonb("art_patterns"), // JSON structure for art patterns and motifs
  mathematicalConcepts: jsonb("mathematical_concepts"), // Mathematical concepts for this period
  mythsStories: jsonb("myths_stories"), // Cultural narratives
  powerStructures: jsonb("power_structures"), // Government, social hierarchy
  metadata: jsonb("metadata"), // Additional structured data
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHistoricalPeriodContentSchema = createInsertSchema(historicalPeriodContent).omit({
  id: true,
  createdAt: true,
});

export type InsertHistoricalPeriodContent = z.infer<typeof insertHistoricalPeriodContentSchema>;
export type HistoricalPeriodContent = typeof historicalPeriodContent.$inferSelect;

// Student content progress tracking
export const studentContentProgress = pgTable("student_content_progress", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  contentPath: varchar("content_path", { length: 500 }).notNull(), // e.g., "/perspective-drawing/phase-01/module-01/lesson-001"
  gradeLevel: varchar("grade_level", { length: 20 }),
  completionStatus: varchar("completion_status", { length: 50 }).notNull(), // not_started, in_progress, completed
  timeSpent: integer("time_spent").default(0), // Time in seconds
  lastAccessed: timestamp("last_accessed").defaultNow(),
  assessmentScores: jsonb("assessment_scores"), // Scores for different assessments
  differentiationPath: varchar("differentiation_path", { length: 50 }), // base, advanced, remedial, enrichment
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStudentContentProgressSchema = createInsertSchema(studentContentProgress).omit({
  id: true,
  createdAt: true,
  lastAccessed: true,
});

export type InsertStudentContentProgress = z.infer<typeof insertStudentContentProgressSchema>;
export type StudentContentProgress = typeof studentContentProgress.$inferSelect;

// ============================================================================
// Primitive Cell Studio ("Line All Richie" / LAR Studio)
// ----------------------------------------------------------------------------
// A reusable primitive-cell library + image-generation swarm layered on top of
// the existing Academy app. Every drawing lesson decomposes a subject into
// reusable primitive forms ("cells"), generates educational images, and records
// the relationships as graph edges. See docs/PRIMITIVE_CELL_STUDIO.md.
// ============================================================================

// Lifecycle status shared by studio assets. Nothing becomes canon automatically.
export const STUDIO_STATUSES = [
  "raw",
  "extracted",
  "candidate",
  "reviewed",
  "canon",
  "superseded",
  "deprecated",
] as const;
export type StudioStatus = (typeof STUDIO_STATUSES)[number];

// Primitive cells are organised by the user's priority ladder:
//   geometric -> sacred -> figure -> other
// geometric primitives are the base forms that must appear in every drawing;
// sacred covers aesthetic / sacred geometry; figure applies them to people;
// other is the catch-all for everything else.
export const PRIMITIVE_CATEGORIES = ["geometric", "sacred", "figure", "other"] as const;
export type PrimitiveCategory = (typeof PRIMITIVE_CATEGORIES)[number];

// Source material ingested into the studio (chats, references, drawings, prompts).
export const studioSources = pgTable("studio_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type", { length: 50 }).notNull(), // chat | image | drawing | prompt | critique | external_ref
  title: text("title"),
  path: text("path"),
  rawText: text("raw_text"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// A teachable skill / lesson concept. Lives on the learning progression.
export const concepts = pgTable("concepts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // skill | subject | lesson | drill
  level: integer("level"),
  skillFamily: varchar("skill_family", { length: 100 }),
  prerequisites: text("prerequisites").array(),
  status: varchar("status", { length: 20 }).default("candidate"),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reusable primitive form ("animation cel"): head mass, brow wedge, spiral ribbon, etc.
export const primitiveCells = pgTable("primitive_cells", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  primitiveType: varchar("primitive_type", { length: 80 }).notNull(), // sphere | box | cylinder | cone | ribbon | wedge | plane | torus | spiral | mask | hinge | contour_loop ...
  category: varchar("category", { length: 20 }).notNull().default("geometric"),
  description: text("description"),
  reusablePrompt: text("reusable_prompt"),
  constructionSteps: jsonb("construction_steps"), // string[]
  reuseCases: jsonb("reuse_cases"), // string[]
  svgPath: text("svg_path"),
  imagePath: text("image_path"),
  tags: text("tags").array(),
  orderIndex: integer("order_index").default(0),
  status: varchar("status", { length: 20 }).default("candidate"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Which primitive cells compose a concept, and in what role/order.
export const conceptPrimitives = pgTable("concept_primitives", {
  conceptId: varchar("concept_id").notNull().references(() => concepts.id),
  primitiveId: varchar("primitive_id").notNull().references(() => primitiveCells.id),
  role: text("role"),
  orderIndex: integer("order_index").default(0),
});

// Generated images and their primitive manifest / critique metadata.
export const generatedImages = pgTable("generated_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conceptId: varchar("concept_id"),
  prompt: text("prompt").notNull(),
  imagePath: text("image_path"),
  model: varchar("model", { length: 80 }),
  purpose: varchar("purpose", { length: 80 }), // construction_plate | ghosted_overlay | finished_reference | practice_card ...
  primitiveManifest: jsonb("primitive_manifest"),
  critique: jsonb("critique"),
  status: varchar("status", { length: 20 }).default("raw"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relationships between any two studio entities (concepts, primitives, images).
export const graphEdges = pgTable("graph_edges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromId: varchar("from_id").notNull(),
  toId: varchar("to_id").notNull(),
  edgeType: varchar("edge_type", { length: 60 }).notNull(), // uses | depends_on | belongs_to | variant_of | expressed_by ...
  weight: decimal("weight", { precision: 6, scale: 3 }).default("1.0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStudioSourceSchema = createInsertSchema(studioSources).omit({ id: true, createdAt: true });
export const insertConceptSchema = createInsertSchema(concepts).omit({ id: true, createdAt: true });
export const insertPrimitiveCellSchema = createInsertSchema(primitiveCells).omit({ id: true, createdAt: true });
export const insertConceptPrimitiveSchema = createInsertSchema(conceptPrimitives);
export const insertGeneratedImageSchema = createInsertSchema(generatedImages).omit({ id: true, createdAt: true });
export const insertGraphEdgeSchema = createInsertSchema(graphEdges).omit({ id: true, createdAt: true });

export type StudioSource = typeof studioSources.$inferSelect;
export type InsertStudioSource = z.infer<typeof insertStudioSourceSchema>;
export type Concept = typeof concepts.$inferSelect;
export type InsertConcept = z.infer<typeof insertConceptSchema>;
export type PrimitiveCell = typeof primitiveCells.$inferSelect;
export type InsertPrimitiveCell = z.infer<typeof insertPrimitiveCellSchema>;
export type ConceptPrimitive = typeof conceptPrimitives.$inferSelect;
export type InsertConceptPrimitive = z.infer<typeof insertConceptPrimitiveSchema>;
export type GeneratedImage = typeof generatedImages.$inferSelect;
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
export type GraphEdge = typeof graphEdges.$inferSelect;
export type InsertGraphEdge = z.infer<typeof insertGraphEdgeSchema>;

// ---------------------------------------------------------------------------
// Primitive manifest + swarm contracts (the heart of the studio).
// The model must describe the parts before any image is generated.
// ---------------------------------------------------------------------------
export const manifestPrimitiveSchema = z.object({
  name: z.string(),
  type: z.string(),
  role: z.string(),
  category: z.enum(PRIMITIVE_CATEGORIES).default("geometric"),
});
export type ManifestPrimitive = z.infer<typeof manifestPrimitiveSchema>;

export const primitiveManifestSchema = z.object({
  subject: z.string(),
  learningGoal: z.string(),
  level: z.number().int().min(1).max(10).default(1),
  skillFamily: z.string().optional(),
  primitives: z.array(manifestPrimitiveSchema),
  axes: z.array(z.string()).default([]),
  planes: z.array(z.string()).default([]),
  hinges: z.array(z.string()).default([]),
  rhythmLines: z.array(z.string()).default([]),
  valueColorStructure: z.array(z.string()).default([]),
  reusableCellsToSave: z.array(z.string()).default([]),
  imageOutputs: z.array(z.string()).default([]),
});
export type PrimitiveManifest = z.infer<typeof primitiveManifestSchema>;

export const critiqueSchema = z.object({
  score: z.number().min(1).max(5),
  critique: z.string(),
  primitivesClear: z.boolean(),
  learningGoalVisible: z.boolean(),
  reusable: z.boolean(),
  tooDecorative: z.boolean(),
  reusableCells: z.array(z.string()).default([]),
  suggestedCorrectionPrompt: z.string().optional(),
  canonStatus: z.enum(STUDIO_STATUSES),
});
export type Critique = z.infer<typeof critiqueSchema>;

export const swarmRequestSchema = z.object({
  subject: z.string().min(1),
  learningGoal: z.string().optional(),
  level: z.number().int().min(1).max(10).optional(),
  style: z.string().optional(),
  outputs: z.array(z.string()).optional(),
  generateImages: z.boolean().default(true),
});
export type SwarmRequest = z.infer<typeof swarmRequestSchema>;
