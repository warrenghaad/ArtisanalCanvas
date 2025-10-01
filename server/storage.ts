import { 
  type User, 
  type InsertUser, 
  type UserProgress, 
  type InsertUserProgress,
  type PracticeSession,
  type InsertPracticeSession,
  type DrawingSubmission,
  type InsertDrawingSubmission,
  type CurriculumMapping,
  type InsertCurriculumMapping,
  type HistoricalPeriodContent,
  type InsertHistoricalPeriodContent,
  type StudentContentProgress,
  type InsertStudentContentProgress,
  users,
  userProgress,
  practiceSession,
  drawingSubmission,
  curriculumMapping,
  historicalPeriodContent,
  studentContentProgress
} from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Progress tracking
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getPhaseProgress(userId: string, phaseId: number): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // Practice sessions
  getPracticeSessions(userId: string): Promise<PracticeSession[]>;
  createPracticeSession(session: InsertPracticeSession): Promise<PracticeSession>;

  // Drawing submissions
  getDrawingSubmissions(userId: string, exerciseId?: string): Promise<DrawingSubmission[]>;
  createDrawingSubmission(submission: InsertDrawingSubmission): Promise<DrawingSubmission>;
  updateDrawingSubmission(id: string, updates: Partial<DrawingSubmission>): Promise<DrawingSubmission | undefined>;
  
  // Curriculum mapping
  getCurriculumMappings(gradeLevel?: string): Promise<CurriculumMapping[]>;
  createCurriculumMapping(mapping: InsertCurriculumMapping): Promise<CurriculumMapping>;
  
  // Historical periods
  getHistoricalPeriodContent(periodId: string): Promise<HistoricalPeriodContent | undefined>;
  getAllHistoricalPeriods(): Promise<HistoricalPeriodContent[]>;
  createHistoricalPeriodContent(content: InsertHistoricalPeriodContent): Promise<HistoricalPeriodContent>;
  
  // Student content progress
  getStudentContentProgress(userId: string, contentPath?: string): Promise<StudentContentProgress[]>;
  createStudentContentProgress(progress: InsertStudentContentProgress): Promise<StudentContentProgress>;
  updateStudentContentProgress(id: string, updates: Partial<StudentContentProgress>): Promise<StudentContentProgress | undefined>;
}

// Create database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...insertUser,
      currentPhase: insertUser.currentPhase || 1,
      masteryLevel: insertUser.masteryLevel || 1,
      totalPracticeTime: insertUser.totalPracticeTime || 0,
    }).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getPhaseProgress(userId: string, phaseId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(
      and(eq(userProgress.userId, userId), eq(userProgress.phaseId, phaseId))
    );
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const result = await db.insert(userProgress).values({
      ...insertProgress,
      completedAt: insertProgress.completed ? new Date() : null,
    }).returning();
    return result[0];
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const result = await db.update(userProgress).set({
      ...updates,
      completedAt: updates.completed ? new Date() : undefined,
    }).where(eq(userProgress.id, id)).returning();
    return result[0];
  }

  async getPracticeSessions(userId: string): Promise<PracticeSession[]> {
    return await db.select().from(practiceSession).where(eq(practiceSession.userId, userId));
  }

  async createPracticeSession(insertSession: InsertPracticeSession): Promise<PracticeSession> {
    const result = await db.insert(practiceSession).values(insertSession).returning();
    return result[0];
  }

  async getDrawingSubmissions(userId: string, exerciseId?: string): Promise<DrawingSubmission[]> {
    if (exerciseId) {
      return await db.select().from(drawingSubmission).where(
        and(eq(drawingSubmission.userId, userId), eq(drawingSubmission.exerciseId, exerciseId))
      );
    }
    return await db.select().from(drawingSubmission).where(eq(drawingSubmission.userId, userId));
  }

  async createDrawingSubmission(insertSubmission: InsertDrawingSubmission): Promise<DrawingSubmission> {
    const result = await db.insert(drawingSubmission).values(insertSubmission).returning();
    return result[0];
  }

  async updateDrawingSubmission(id: string, updates: Partial<DrawingSubmission>): Promise<DrawingSubmission | undefined> {
    const result = await db.update(drawingSubmission).set(updates).where(eq(drawingSubmission.id, id)).returning();
    return result[0];
  }
  
  // Curriculum mapping methods
  async getCurriculumMappings(gradeLevel?: string): Promise<CurriculumMapping[]> {
    if (gradeLevel) {
      return await db.select().from(curriculumMapping).where(eq(curriculumMapping.gradeLevel, gradeLevel));
    }
    return await db.select().from(curriculumMapping);
  }
  
  async createCurriculumMapping(mapping: InsertCurriculumMapping): Promise<CurriculumMapping> {
    const result = await db.insert(curriculumMapping).values(mapping).returning();
    return result[0];
  }
  
  // Historical period methods
  async getHistoricalPeriodContent(periodId: string): Promise<HistoricalPeriodContent | undefined> {
    const result = await db.select().from(historicalPeriodContent)
      .where(eq(historicalPeriodContent.periodId, periodId)).limit(1);
    return result[0];
  }
  
  async getAllHistoricalPeriods(): Promise<HistoricalPeriodContent[]> {
    return await db.select().from(historicalPeriodContent);
  }
  
  async createHistoricalPeriodContent(content: InsertHistoricalPeriodContent): Promise<HistoricalPeriodContent> {
    const result = await db.insert(historicalPeriodContent).values(content).returning();
    return result[0];
  }
  
  // Student content progress methods
  async getStudentContentProgress(userId: string, contentPath?: string): Promise<StudentContentProgress[]> {
    if (contentPath) {
      return await db.select().from(studentContentProgress).where(
        and(eq(studentContentProgress.userId, userId), eq(studentContentProgress.contentPath, contentPath))
      );
    }
    return await db.select().from(studentContentProgress).where(eq(studentContentProgress.userId, userId));
  }
  
  async createStudentContentProgress(progress: InsertStudentContentProgress): Promise<StudentContentProgress> {
    const result = await db.insert(studentContentProgress).values(progress).returning();
    return result[0];
  }
  
  async updateStudentContentProgress(id: string, updates: Partial<StudentContentProgress>): Promise<StudentContentProgress | undefined> {
    const result = await db.update(studentContentProgress).set({
      ...updates,
      lastAccessed: new Date()
    }).where(eq(studentContentProgress.id, id)).returning();
    return result[0];
  }
}

// Initialize database function
export async function initializeDatabase() {
  try {
    let demoUser = await storage.getUserByUsername("demo");
    if (!demoUser) {
      demoUser = await storage.createUser({
        username: "demo",
        password: "demo",
        currentPhase: 2,
        masteryLevel: 2,
        totalPracticeTime: 3600,
      });
      console.log('Demo user created successfully with ID:', demoUser.id);
    } else {
      console.log('Demo user already exists with ID:', demoUser.id);
    }

    // Check if demo user has progress data, if not create it
    const existingProgress = await storage.getUserProgress(demoUser.id);
    if (existingProgress.length === 0) {
      console.log('Creating demo progress data...');
      
      // Create progress for Phase 1 (completed)
      await storage.createUserProgress({
        userId: demoUser.id,
        phaseId: 1,
        exerciseId: 'HL_detection',
        completed: true,
        score: 85,
        timeSpent: 900, // 15 minutes
        attempts: 2,
        feedback: 'Good understanding of horizon line concepts'
      });

      await storage.createUserProgress({
        userId: demoUser.id,
        phaseId: 1,
        exerciseId: 'PP_concept',
        completed: true,
        score: 92,
        timeSpent: 600, // 10 minutes
        attempts: 1,
        feedback: 'Excellent grasp of picture plane fundamentals'
      });

      // Create some practice sessions
      await storage.createPracticeSession({
        userId: demoUser.id,
        sessionType: 'exercise',
        duration: 900,
        phaseId: 1,
        exerciseId: 'HL_detection',
        notes: 'First attempt at horizon line exercises'
      });

      await storage.createPracticeSession({
        userId: demoUser.id,
        sessionType: 'drill',
        duration: 120, // 2 minutes
        phaseId: 2,
        exerciseId: 'tile_floor',
        notes: 'Daily practice drill'
      });

      console.log('Demo progress data created successfully');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

export const storage = new DatabaseStorage();