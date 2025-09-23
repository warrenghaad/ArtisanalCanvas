import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, TrendingUp, Brain, X } from 'lucide-react';
import { type AssessmentResult } from '@shared/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AIAssessmentProps {
  submissionId?: string;
  exerciseId: string;
  phaseId: number;
  learningObjectives: string[];
  onAssessmentComplete?: (result: AssessmentResult) => void;
  className?: string;
}

export function AIAssessment({ 
  submissionId, 
  exerciseId, 
  phaseId, 
  learningObjectives,
  onAssessmentComplete,
  className 
}: AIAssessmentProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const assessMutation = useMutation({
    mutationFn: async () => {
      if (!submissionId) {
        throw new Error('No submission to assess');
      }
      
      const response = await apiRequest('POST', '/api/drawing/assess', {
        submissionId,
        exerciseId,
        phaseId,
        learningObjectives,
      });
      return response.json();
    },
    onSuccess: (result: AssessmentResult) => {
      setCurrentAssessment(result);
      setShowModal(true);
      onAssessmentComplete?.(result);
      
      toast({
        title: "Assessment Complete",
        description: `Score: ${result.overallScore}/100`,
      });
    },
    onError: (error) => {
      toast({
        title: "Assessment Failed",
        description: "Unable to assess drawing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetAssessment = () => {
    if (!submissionId) {
      toast({
        title: "No Drawing Submitted",
        description: "Please submit a drawing first to get AI feedback.",
        variant: "destructive",
      });
      return;
    }
    
    assessMutation.mutate();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent';
    if (score >= 60) return 'text-secondary';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  // Mock current assessment for UI preview
  const mockCurrentAssessment = {
    overallScore: 0,
    strengths: ["Drawing submitted successfully"],
    improvements: ["Complete the exercise for assessment"],
    specificFeedback: {
      horizonLine: { score: 0, feedback: "Waiting for submission..." },
      vanishingPoints: { score: 0, feedback: "Waiting for submission..." },
      proportions: { score: 0, feedback: "Waiting for submission..." },
      convergence: { score: 0, feedback: "Waiting for submission..." },
    },
    nextSteps: ["Submit drawing for assessment"],
    readyForNext: false,
  };

  const displayAssessment = currentAssessment || mockCurrentAssessment;

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 text-primary mr-2" />
            AI Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Quick Feedback Preview */}
          <div className="space-y-3">
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="p-3">
                <div className="font-medium text-accent mb-1 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Horizon Line
                </div>
                <div className="text-accent/80 text-sm" data-testid="text-horizon-feedback">
                  {displayAssessment.specificFeedback.horizonLine.feedback}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/10 border-secondary/20">
              <CardContent className="p-3">
                <div className="font-medium text-secondary mb-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Convergence
                </div>
                <div className="text-secondary/80 text-sm" data-testid="text-convergence-feedback">
                  {displayAssessment.specificFeedback.convergence.feedback}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted">
              <CardContent className="p-3">
                <div className="font-medium mb-1" data-testid="text-waiting-assessment">
                  Waiting for completion...
                </div>
                <div className="text-muted-foreground text-sm">
                  Submit drawing for full assessment
                </div>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={handleGetAssessment}
            disabled={assessMutation.isPending || !submissionId}
            className="w-full"
            data-testid="button-get-ai-feedback"
          >
            <Brain className="w-4 h-4 mr-2" />
            {assessMutation.isPending ? 'Analyzing...' : 'Get AI Feedback'}
          </Button>
        </CardContent>
      </Card>

      {/* Assessment Results Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              AI Assessment Results
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                data-testid="button-close-assessment"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {currentAssessment && (
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(currentAssessment.overallScore)}`} data-testid="text-overall-score">
                  {currentAssessment.overallScore}/100
                </div>
                <div className="text-lg font-medium">
                  {currentAssessment.overallScore >= 80 ? 'Excellent Work!' : 
                   currentAssessment.overallScore >= 60 ? 'Good Progress!' : 
                   'Keep Practicing!'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentAssessment.readyForNext ? 'Ready for next exercise' : 'Continue practicing this exercise'}
                </div>
              </div>
              
              {/* Detailed Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-accent/20 bg-accent/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-accent flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-accent/80">
                      {currentAssessment.strengths.map((strength, index) => (
                        <li key={index} data-testid={`strength-${index}`}>• {strength}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-secondary/20 bg-secondary/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-secondary flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Improvements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-secondary/80">
                      {currentAssessment.improvements.map((improvement, index) => (
                        <li key={index} data-testid={`improvement-${index}`}>• {improvement}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Specific Feedback Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(currentAssessment.specificFeedback).map(([key, feedback]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        <Badge variant={getScoreBadgeVariant(feedback.score)} data-testid={`score-${key}`}>
                          {feedback.score}/100
                        </Badge>
                      </div>
                      <Progress value={feedback.score} className="h-2" />
                      <p className="text-sm text-muted-foreground" data-testid={`feedback-${key}`}>
                        {feedback.feedback}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                    {currentAssessment.nextSteps.map((step, index) => (
                      <li key={index} data-testid={`next-step-${index}`}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                  data-testid="button-save-continue"
                >
                  Save & Continue Later
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                  disabled={!currentAssessment.readyForNext}
                  data-testid="button-next-exercise"
                >
                  Continue to Next Exercise
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
