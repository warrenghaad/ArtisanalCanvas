import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, initializeDatabase } from "./storage";
import { assessDrawing, generateExerciseTips } from "./services/openai";
import { insertPracticeSessionSchema, insertDrawingSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database storage with demo user
  await initializeDatabase();
  
  // Get user by username
  app.get("/api/user/by-username/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
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
  
  // Curriculum Mapping routes
  app.get("/api/curriculum/mappings/:gradeLevel", async (req, res) => {
    try {
      const { gradeLevel } = req.params;
      const mappings = await storage.getCurriculumMappings(gradeLevel);
      res.json(mappings);
    } catch (error) {
      console.error('Error fetching curriculum mappings:', error);
      res.status(500).json({ error: 'Failed to fetch curriculum mappings' });
    }
  });
  
  app.get("/api/curriculum/mappings", async (req, res) => {
    try {
      const mappings = await storage.getCurriculumMappings();
      res.json(mappings);
    } catch (error) {
      console.error('Error fetching all curriculum mappings:', error);
      res.status(500).json({ error: 'Failed to fetch curriculum mappings' });
    }
  });
  
  // Historical Period routes
  app.get("/api/historical-periods", async (req, res) => {
    try {
      const periods = await storage.getAllHistoricalPeriods();
      res.json(periods);
    } catch (error) {
      console.error('Error fetching historical periods:', error);
      res.status(500).json({ error: 'Failed to fetch historical periods' });
    }
  });
  
  app.get("/api/historical-periods/:periodId", async (req, res) => {
    try {
      const { periodId } = req.params;
      const period = await storage.getHistoricalPeriodContent(periodId);
      if (!period) {
        return res.status(404).json({ error: 'Period not found' });
      }
      res.json(period);
    } catch (error) {
      console.error('Error fetching historical period:', error);
      res.status(500).json({ error: 'Failed to fetch historical period' });
    }
  });
  
  // Student Content Progress routes
  app.get("/api/student-progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { contentPath } = req.query;
      const progress = await storage.getStudentContentProgress(
        userId, 
        contentPath as string | undefined
      );
      res.json(progress);
    } catch (error) {
      console.error('Error fetching student progress:', error);
      res.status(500).json({ error: 'Failed to fetch student progress' });
    }
  });
  
  app.post("/api/student-progress", async (req, res) => {
    try {
      const progress = req.body;
      const result = await storage.createStudentContentProgress(progress);
      res.json(result);
    } catch (error) {
      console.error('Error creating student progress:', error);
      res.status(500).json({ error: 'Failed to create student progress' });
    }
  });
  
  // Differentiated content delivery routes
  app.get("/api/differentiated-content/:contentPath", async (req, res) => {
    try {
      const { contentPath } = req.params;
      const { userId } = req.query;
      
      // Get student's current progress and differentiation path
      const progress = await storage.getStudentContentProgress(
        userId as string,
        contentPath
      );
      
      const differentiationPath = progress?.[0]?.differentiationPath || 'base';
      
      // For now, return mock differentiated content
      // In production, this would fetch from a content repository
      const content = {
        path: contentPath,
        differentiationLevel: differentiationPath,
        content: getDifferentiatedContent(contentPath, differentiationPath),
        nextLevel: getNextLevel(differentiationPath),
        previousLevel: getPreviousLevel(differentiationPath)
      };
      
      res.json(content);
    } catch (error) {
      console.error('Error fetching differentiated content:', error);
      res.status(500).json({ error: 'Failed to fetch differentiated content' });
    }
  });
  
  app.post("/api/differentiation-path/update", async (req, res) => {
    try {
      const { userId, contentPath, newPath } = req.body;
      
      if (!['base', 'advanced', 'remedial', 'enrichment'].includes(newPath)) {
        return res.status(400).json({ error: 'Invalid differentiation path' });
      }
      
      // Update the student's differentiation path
      const result = await storage.createStudentContentProgress({
        userId,
        contentPath,
        differentiationPath: newPath,
        completionStatus: 'in_progress',
        metadata: { pathChangedAt: new Date().toISOString() }
      });
      
      res.json({ success: true, updatedPath: newPath, result });
    } catch (error) {
      console.error('Error updating differentiation path:', error);
      res.status(500).json({ error: 'Failed to update differentiation path' });
    }
  });
  
  // Helper functions for differentiated content
  function getDifferentiatedContent(contentPath: string, level: string) {
    const contentMap: Record<string, any> = {
      base: {
        title: "Standard Content",
        description: "Core learning objectives and activities",
        activities: ["Introduction", "Guided Practice", "Independent Practice", "Assessment"],
        estimatedTime: 30
      },
      advanced: {
        title: "Advanced Content",
        description: "Extended learning with challenging applications",
        activities: ["Quick Review", "Complex Problem Solving", "Project Work", "Peer Teaching"],
        estimatedTime: 45
      },
      remedial: {
        title: "Foundational Content",
        description: "Additional support and scaffolding",
        activities: ["Pre-requisite Review", "Step-by-Step Guidance", "Extra Practice", "Simplified Assessment"],
        estimatedTime: 40
      },
      enrichment: {
        title: "Enrichment Content",
        description: "Creative extensions and real-world applications",
        activities: ["Research Project", "Cross-curricular Connections", "Creative Expression", "Presentation"],
        estimatedTime: 50
      }
    };
    
    return contentMap[level] || contentMap.base;
  }
  
  function getNextLevel(currentLevel: string): string | null {
    const progression: Record<string, string> = {
      remedial: 'base',
      base: 'advanced',
      advanced: 'enrichment',
      enrichment: null as any
    };
    return progression[currentLevel] || null;
  }
  
  function getPreviousLevel(currentLevel: string): string | null {
    const regression: Record<string, string> = {
      enrichment: 'advanced',
      advanced: 'base',
      base: 'remedial',
      remedial: null as any
    };
    return regression[currentLevel] || null;
  }

  const httpServer = createServer(app);
  return httpServer;
}
