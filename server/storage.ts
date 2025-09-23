import { 
  type User, 
  type InsertUser, 
  type UserProgress, 
  type InsertUserProgress,
  type PracticeSession,
  type InsertPracticeSession,
  type DrawingSubmission,
  type InsertDrawingSubmission
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProgress: Map<string, UserProgress>;
  private practiceSessions: Map<string, PracticeSession>;
  private drawingSubmissions: Map<string, DrawingSubmission>;

  constructor() {
    this.users = new Map();
    this.userProgress = new Map();
    this.practiceSessions = new Map();
    this.drawingSubmissions = new Map();
    
    // Create default user for demo
    this.createDefaultUser();
  }

  private async createDefaultUser() {
    const defaultUser: User = {
      id: "demo-user",
      username: "demo",
      password: "demo",
      currentPhase: 2,
      masteryLevel: 2,
      totalPracticeTime: 3600,
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      currentPhase: 1,
      masteryLevel: 1,
      totalPracticeTime: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async getPhaseProgress(userId: string, phaseId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId && progress.phaseId === phaseId
    );
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = { 
      ...insertProgress, 
      id,
      completedAt: insertProgress.completed ? new Date() : null,
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { 
      ...progress, 
      ...updates,
      completedAt: updates.completed ? new Date() : progress.completedAt,
    };
    this.userProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  async getPracticeSessions(userId: string): Promise<PracticeSession[]> {
    return Array.from(this.practiceSessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  async createPracticeSession(insertSession: InsertPracticeSession): Promise<PracticeSession> {
    const id = randomUUID();
    const session: PracticeSession = { 
      ...insertSession, 
      id,
      createdAt: new Date(),
    };
    this.practiceSessions.set(id, session);
    return session;
  }

  async getDrawingSubmissions(userId: string, exerciseId?: string): Promise<DrawingSubmission[]> {
    return Array.from(this.drawingSubmissions.values()).filter(
      (submission) => 
        submission.userId === userId && 
        (!exerciseId || submission.exerciseId === exerciseId)
    );
  }

  async createDrawingSubmission(insertSubmission: InsertDrawingSubmission): Promise<DrawingSubmission> {
    const id = randomUUID();
    const submission: DrawingSubmission = { 
      ...insertSubmission, 
      id,
      createdAt: new Date(),
    };
    this.drawingSubmissions.set(id, submission);
    return submission;
  }

  async updateDrawingSubmission(id: string, updates: Partial<DrawingSubmission>): Promise<DrawingSubmission | undefined> {
    const submission = this.drawingSubmissions.get(id);
    if (!submission) return undefined;
    
    const updatedSubmission = { ...submission, ...updates };
    this.drawingSubmissions.set(id, updatedSubmission);
    return updatedSubmission;
  }
}

export const storage = new MemStorage();
