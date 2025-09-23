import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { assessDrawing, generateExerciseTips } from "./services/openai";
import { insertPracticeSessionSchema, insertDrawingSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get user profile and progress
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const progress = await storage.getUserProgress(user.id);
      const sessions = await storage.getPracticeSessions(user.id);
      
      res.json({
        user,
        progress,
        sessions,
        totalSessions: sessions.length,
        totalPracticeTime: user.totalPracticeTime,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });

  // Update user progress
  app.post("/api/user/:id/progress", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Get phase progress
  app.get("/api/user/:userId/phase/:phaseId/progress", async (req, res) => {
    try {
      const { userId, phaseId } = req.params;
      const progress = await storage.getPhaseProgress(userId, parseInt(phaseId));
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch phase progress" });
    }
  });

  // Create practice session
  app.post("/api/practice-session", async (req, res) => {
    try {
      const sessionData = insertPracticeSessionSchema.parse(req.body);
      const session = await storage.createPracticeSession(sessionData);
      
      // Update user's total practice time
      const user = await storage.getUser(sessionData.userId);
      if (user) {
        await storage.updateUser(user.id, {
          totalPracticeTime: user.totalPracticeTime + sessionData.duration
        });
      }
      
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid session data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create practice session" });
    }
  });

  // Submit drawing for assessment
  app.post("/api/drawing/submit", async (req, res) => {
    try {
      const submissionData = insertDrawingSubmissionSchema.parse(req.body);
      const submission = await storage.createDrawingSubmission(submissionData);
      res.json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid submission data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit drawing" });
    }
  });

  // Get AI assessment for drawing
  app.post("/api/drawing/assess", async (req, res) => {
    try {
      const { submissionId, exerciseId, phaseId, learningObjectives } = req.body;
      
      const submissions = await storage.getDrawingSubmissions("", exerciseId);
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      const assessment = await assessDrawing(
        submission.imageData,
        exerciseId,
        phaseId,
        learningObjectives || []
      );

      // Update submission with assessment
      await storage.updateDrawingSubmission(submissionId, {
        aiAssessment: assessment,
        score: assessment.overallScore,
        feedback: `Overall Score: ${assessment.overallScore}/100`,
        submitted: true,
      });

      res.json(assessment);
    } catch (error) {
      console.error("Assessment error:", error);
      res.status(500).json({ error: "Failed to assess drawing" });
    }
  });

  // Get exercise tips
  app.post("/api/exercise/tips", async (req, res) => {
    try {
      const { exerciseId, commonErrors } = req.body;
      const tips = await generateExerciseTips(exerciseId, commonErrors || []);
      res.json({ tips });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate tips" });
    }
  });

  // Get user's drawing submissions
  app.get("/api/user/:userId/drawings", async (req, res) => {
    try {
      const { exerciseId } = req.query;
      const drawings = await storage.getDrawingSubmissions(
        req.params.userId, 
        exerciseId as string
      );
      res.json(drawings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch drawings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
