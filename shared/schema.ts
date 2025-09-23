import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
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
