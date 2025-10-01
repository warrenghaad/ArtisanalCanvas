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
