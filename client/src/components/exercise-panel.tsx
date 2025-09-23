import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, Circle, Clock, AlertTriangle, Book, Video, Images, Calculator } from 'lucide-react';
import { type Exercise } from '@/lib/curriculum-data';
import { cn } from '@/lib/utils';

interface ExercisePanelProps {
  currentExercise: Exercise;
  exerciseProgress: any[];
  currentStep: number;
  totalSteps: number;
  timeElapsed: number;
  onContinue: () => void;
  className?: string;
}

export function ExercisePanel({ 
  currentExercise, 
  exerciseProgress, 
  currentStep, 
  totalSteps, 
  timeElapsed,
  onContinue,
  className 
}: ExercisePanelProps) {
  const [showKeyboard, setShowKeyboard] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const steps = [
    { text: "Draw horizon line and vanishing point", completed: currentStep > 1 },
    { text: "Place first two columns", completed: currentStep > 2 },
    { text: "Draw third column with correct proportions", completed: currentStep > 3, active: currentStep === 3 },
    { text: "Add remaining columns", completed: currentStep > 4 },
    { text: "Verify perspective consistency", completed: currentStep > 5 },
  ];

  const keyConcepts = [
    "Similar triangles preserve proportions",
    "Measuring line transfers depth intervals", 
    "Objects diminish uniformly toward VP"
  ];

  const commonErrors = [
    "Lines not converging to single VP",
    "Inconsistent interval shrinking",
    "Floating objects (no ground contact)"
  ];

  const resources = [
    { icon: Book, label: "Perspective Construction Guide", id: "guide" },
    { icon: Video, label: "Video: Measuring Line Technique", id: "video" },
    { icon: Images, label: "Master Examples Gallery", id: "gallery" },
    { icon: Calculator, label: "Geometric Proof Demo", id: "proof" },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Current Exercise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <span data-testid="text-current-exercise">Current Exercise</span>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium animate-pulse" data-testid="text-timer">
                {formatTime(timeElapsed)}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="bg-muted">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2" data-testid="text-exercise-step">
                Step {currentStep} of {totalSteps}: {currentExercise.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-3" data-testid="text-exercise-description">
                {currentExercise.description}
              </p>
              
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center text-sm" data-testid={`step-${index + 1}`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4 text-accent mr-2" />
                    ) : step.active ? (
                      <ArrowRight className="w-4 h-4 text-secondary mr-2" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground mr-2" />
                    )}
                    <span className={cn(
                      step.completed && "line-through text-muted-foreground",
                      step.active && "font-medium"
                    )}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Concepts */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2" data-testid="text-key-concepts">Key Concepts</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {keyConcepts.map((concept, index) => (
                  <li key={index} data-testid={`concept-${index}`}>• {concept}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Common Errors */}
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2 text-destructive flex items-center" data-testid="text-common-errors">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Watch Out For
              </h4>
              <ul className="text-sm space-y-1 text-destructive/80">
                {commonErrors.map((error, index) => (
                  <li key={index} data-testid={`error-${index}`}>• {error}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Reference Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg" data-testid="text-reference-materials">Reference & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Button
                  key={resource.id}
                  variant="ghost"
                  className="w-full justify-start"
                  data-testid={`button-resource-${resource.id}`}
                >
                  <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
                  {resource.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
