import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { DrawingCanvasComponent } from '@/components/drawing-canvas';
import { PhaseNavigation } from '@/components/phase-navigation';
import { ExercisePanel } from '@/components/exercise-panel';
import { TimerControls } from '@/components/timer-controls';
import { AIAssessment } from '@/components/ai-assessment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Palette, Bell, CheckCircle, Clock, Circle } from 'lucide-react';
import { curriculumData } from '@/lib/curriculum-data';
import { useToast } from '@/hooks/use-toast';
import type { AssessmentResult } from '@shared/schema';

const DEMO_USER_ID = "demo-user";

export default function Academy() {
  const [currentPhase, setCurrentPhase] = useState(2);
  const [currentExerciseId, setCurrentExerciseId] = useState('column_row');
  const [currentStep, setCurrentStep] = useState(3);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data and progress
  const { data: userData } = useQuery({
    queryKey: ['/api/user', DEMO_USER_ID],
    staleTime: 30000,
  });

  const { data: phaseProgress = [] } = useQuery({
    queryKey: ['/api/user', DEMO_USER_ID, 'phase', currentPhase, 'progress'],
    staleTime: 30000,
  });

  // Submit drawing mutation
  const submitDrawingMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await apiRequest('POST', '/api/drawing/submit', {
        userId: DEMO_USER_ID,
        exerciseId: currentExerciseId,
        imageData,
        submitted: false,
      });
      return response.json();
    },
    onSuccess: (submission) => {
      setSubmissionId(submission.id);
      toast({
        title: "Drawing Submitted",
        description: "Your drawing has been saved. Get AI feedback when ready!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user', DEMO_USER_ID, 'drawings'] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Unable to save drawing. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create practice session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest('POST', '/api/practice-session', sessionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user', DEMO_USER_ID] });
    },
  });

  const currentPhaseData = curriculumData.learning_sequence.find(p => p.phaseId === currentPhase);
  const currentExercise = currentPhaseData?.exercises?.find(e => e.id === currentExerciseId);
  
  const handlePhaseSelect = (phaseId: number) => {
    setCurrentPhase(phaseId);
    const newPhaseData = curriculumData.learning_sequence.find(p => p.phaseId === phaseId);
    if (newPhaseData?.exercises?.[0]) {
      setCurrentExerciseId(newPhaseData.exercises[0].id);
    }
    setCurrentStep(1);
  };

  const handleDrawingSubmit = (imageData: string) => {
    submitDrawingMutation.mutate(imageData);
  };

  const handleTimeUpdate = (seconds: number) => {
    setTimeElapsed(seconds);
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    if (result.readyForNext) {
      // Auto-advance to next step or exercise
      setCurrentStep(prev => prev + 1);
    }
  };

  // Calculate overall progress
  const totalPhases = curriculumData.learning_sequence.length;
  const completedPhases = Math.max(0, currentPhase - 1);
  const overallProgress = Math.round((completedPhases / totalPhases) * 100);

  // Mastery checklist data
  const masteryItems = Object.entries(curriculumData.mastery_checklist).map(([level, description], index) => ({
    level,
    description,
    completed: index < currentPhase - 1,
    current: index === currentPhase - 1,
    score: index < currentPhase - 1 ? 100 : index === currentPhase - 1 ? 65 : 0,
  }));

  useEffect(() => {
    // Save practice session when component unmounts or significant time passes
    const saveSession = () => {
      if (timeElapsed > 60) { // Only save if more than 1 minute
        createSessionMutation.mutate({
          userId: DEMO_USER_ID,
          sessionType: 'exercise',
          duration: timeElapsed,
          phaseId: currentPhase,
          exerciseId: currentExerciseId,
        });
      }
    };

    const interval = setInterval(saveSession, 300000); // Save every 5 minutes
    window.addEventListener('beforeunload', saveSession);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', saveSession);
      saveSession();
    };
  }, [timeElapsed, currentPhase, currentExerciseId]);

  if (!currentPhaseData || !currentExercise) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Palette className="text-primary text-2xl" />
              <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">
                Renaissance Perspective Academy
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Phase {currentPhase}:</span>
              <span className="font-medium text-primary" data-testid="text-current-phase">
                {currentPhaseData.title}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Progress Overview */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-right text-sm">
                <div className="font-medium" data-testid="text-overall-progress-label">Overall Progress</div>
                <div className="text-muted-foreground" data-testid="text-progress-phases">
                  {completedPhases} of {totalPhases} phases
                </div>
              </div>
              <div className="relative w-12 h-12">
                <svg className="transform -rotate-90 w-12 h-12" viewBox="0 0 44 44">
                  <circle 
                    className="text-muted stroke-current" 
                    strokeWidth="3" 
                    fill="transparent" 
                    r="20" 
                    cx="22" 
                    cy="22"
                  />
                  <circle 
                    className="text-primary stroke-current transition-all duration-300" 
                    strokeWidth="3" 
                    fill="transparent" 
                    r="20" 
                    cx="22" 
                    cy="22"
                    strokeDasharray="125.6" 
                    strokeDashoffset={125.6 - (125.6 * overallProgress) / 100}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" data-testid="text-overall-progress-percent">
                  {overallProgress}%
                </div>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" data-testid="button-notifications">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium" data-testid="user-avatar">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Navigation */}
        <aside className="w-80 bg-card border-r border-border overflow-y-auto">
          <div className="p-6">
            {/* Timer Controls */}
            <TimerControls 
              onTimeUpdate={handleTimeUpdate}
              sessionType="exercise"
              className="mb-6"
            />

            {/* Phase Navigation */}
            <PhaseNavigation
              currentPhase={currentPhase}
              userProgress={phaseProgress}
              onPhaseSelect={handlePhaseSelect}
              className="mb-6"
            />

            {/* Mastery Checklist */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-mastery-progress">Mastery Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {masteryItems.slice(0, 5).map((item) => (
                  <div key={item.level} className="flex items-center justify-between">
                    <span className="flex items-center">
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4 text-accent mr-2" />
                      ) : item.current ? (
                        <Clock className="w-4 h-4 text-secondary mr-2" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground mr-2" />
                      )}
                      <span data-testid={`mastery-${item.level}`}>
                        {item.level}: {item.description}
                      </span>
                    </span>
                    <span className={`font-medium ${
                      item.completed ? 'text-accent' : 
                      item.current ? 'text-secondary' : 
                      'text-muted-foreground'
                    }`} data-testid={`mastery-score-${item.level}`}>
                      {item.completed ? '✓' : item.current ? `${item.score}%` : '—'}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex">
          {/* Drawing Canvas Area */}
          <div className="flex-1">
            <DrawingCanvasComponent
              exerciseId={currentExercise.id}
              onSubmit={handleDrawingSubmit}
            />
          </div>

          {/* Right Panel - Instructions & Assessment */}
          <aside className="w-96 bg-card border-l border-border overflow-y-auto">
            <div className="p-6">
              <ExercisePanel
                currentExercise={currentExercise}
                exerciseProgress={phaseProgress}
                currentStep={currentStep}
                totalSteps={5}
                timeElapsed={timeElapsed}
                onContinue={() => setCurrentStep(prev => prev + 1)}
                className="mb-6"
              />

              <AIAssessment
                submissionId={submissionId}
                exerciseId={currentExercise.id}
                phaseId={currentPhase}
                learningObjectives={currentExercise.learningObjectives}
                onAssessmentComplete={handleAssessmentComplete}
                className="mb-6"
              />
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
