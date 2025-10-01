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

  // Analytics API endpoints
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const { grade, period, timeRange } = req.query;
      
      // Fetch student progress data
      const progressData = await storage.getAllStudentProgress();
      
      // Calculate analytics metrics
      const analytics = {
        gradeProgress: calculateGradeProgress(progressData, grade as string),
        periodEngagement: calculatePeriodEngagement(progressData, period as string),
        pathDistribution: calculatePathDistribution(progressData),
        completionRates: calculateCompletionRates(progressData, timeRange as string),
        timeMetrics: calculateTimeMetrics(progressData)
      };
      
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
  });
  
  app.get("/api/analytics/student/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const studentProgress = await storage.getStudentContentProgress(userId);
      
      // Calculate individual student analytics
      const studentAnalytics = {
        totalModulesCompleted: studentProgress.filter((p: any) => p.completionStatus === 'completed').length,
        totalTimeSpent: studentProgress.reduce((acc: number, p: any) => acc + (p.timeSpent || 0), 0),
        currentPaths: [...new Set(studentProgress.map((p: any) => p.differentiationPath))],
        recentActivity: studentProgress.slice(0, 10)
      };
      
      res.json(studentAnalytics);
    } catch (error) {
      console.error('Error fetching student analytics:', error);
      res.status(500).json({ error: 'Failed to fetch student analytics' });
    }
  });
  
  // Helper functions for analytics calculations
  function calculateGradeProgress(progressData: any[], grade?: string) {
    const grades = grade && grade !== 'all' ? [grade] : ['K', '1', '2', '3', '4', '5', '6', '7', '8'];
    
    return grades.map(g => {
      const gradeData = progressData.filter(p => p.gradeLevel === g);
      const total = gradeData.length || 1;
      
      return {
        grade: g,
        completed: Math.round((gradeData.filter(p => p.completionStatus === 'completed').length / total) * 100),
        inProgress: Math.round((gradeData.filter(p => p.completionStatus === 'in_progress').length / total) * 100),
        notStarted: Math.round((gradeData.filter(p => p.completionStatus === 'not_started').length / total) * 100)
      };
    });
  }
  
  function calculatePeriodEngagement(progressData: any[], period?: string) {
    const periods = [
      'Prehistory', 'Mesopotamia', 'Egypt', 'Greece', 
      'Rome', 'Renaissance', 'Modern'
    ];
    
    return periods.map(p => {
      const periodData = progressData.filter(prog => 
        prog.contentPath && prog.contentPath.toLowerCase().includes(p.toLowerCase())
      );
      
      return {
        name: p,
        engagement: Math.round(Math.random() * 30 + 70), // Mock engagement %
        avgTime: Math.round(periodData.reduce((acc, d) => acc + (d.timeSpent || 0), 0) / Math.max(periodData.length, 1) / 60)
      };
    });
  }
  
  function calculatePathDistribution(progressData: any[]) {
    const paths = ['base', 'advanced', 'remedial', 'enrichment'];
    const total = Math.max(progressData.length, 1);
    
    return paths.map(path => {
      const count = progressData.filter(p => p.differentiationPath === path).length;
      return {
        name: path.charAt(0).toUpperCase() + path.slice(1),
        value: Math.round((count / total) * 100),
        students: count
      };
    });
  }
  
  function calculateCompletionRates(progressData: any[], timeRange: string) {
    // Mock completion rates over time
    const periods = timeRange === 'week' ? 
      ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'] :
      ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    
    return periods.map((period, index) => ({
      period,
      rate: Math.round(70 + (index * 3) + Math.random() * 10)
    }));
  }
  
  function calculateTimeMetrics(progressData: any[]) {
    const totalTime = progressData.reduce((acc, p) => acc + (p.timeSpent || 0), 0);
    
    return {
      totalTime: Math.round(totalTime / 60), // Convert to minutes
      avgSessionTime: Math.round(totalTime / Math.max(progressData.length, 1) / 60),
      peakHours: '2-4 PM',
      mostActiveDay: 'Wednesday'
    };
  }

  const httpServer = createServer(app);
  return httpServer;
}
