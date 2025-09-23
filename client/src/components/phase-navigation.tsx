import { CheckCircle, Clock, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { curriculumData, type CurriculumPhase } from '@/lib/curriculum-data';
import { cn } from '@/lib/utils';

interface PhaseNavigationProps {
  currentPhase: number;
  userProgress: any[];
  onPhaseSelect: (phaseId: number) => void;
  className?: string;
}

export function PhaseNavigation({ currentPhase, userProgress, onPhaseSelect, className }: PhaseNavigationProps) {
  const phases = curriculumData.learning_sequence;

  const getPhaseStatus = (phase: CurriculumPhase) => {
    if (phase.phaseId < currentPhase) return 'complete';
    if (phase.phaseId === currentPhase) return 'active';
    return 'locked';
  };

  const getPhaseProgress = (phaseId: number) => {
    const phaseProgress = userProgress.filter(p => p.phaseId === phaseId);
    const completedExercises = phaseProgress.filter(p => p.completed).length;
    const totalExercises = phases.find(p => p.phaseId === phaseId)?.exercises?.length || 1;
    return Math.round((completedExercises / totalExercises) * 100);
  };

  return (
    <nav className={cn("space-y-2", className)}>
      <h3 className="font-semibold mb-4 text-foreground" data-testid="text-learning-phases">Learning Phases</h3>
      <div className="space-y-2">
        {phases.map((phase) => {
          const status = getPhaseStatus(phase);
          const progress = getPhaseProgress(phase.phaseId);
          const isClickable = status === 'complete' || status === 'active';
          
          return (
            <Button
              key={phase.phaseId}
              variant="ghost"
              className={cn(
                "w-full justify-start p-3 h-auto transition-all duration-300 border-l-4",
                status === 'active' && "border-l-primary bg-muted",
                status === 'complete' && "border-l-accent",
                status === 'locked' && "border-l-transparent opacity-60",
                isClickable && "hover:border-l-secondary cursor-pointer",
                !isClickable && "cursor-not-allowed"
              )}
              onClick={() => isClickable && onPhaseSelect(phase.phaseId)}
              disabled={!isClickable}
              data-testid={`phase-card-${phase.phaseId}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    status === 'complete' && "bg-accent text-accent-foreground",
                    status === 'active' && "bg-primary text-primary-foreground",
                    status === 'locked' && "bg-muted text-muted-foreground border-2 border-border"
                  )}>
                    {status === 'complete' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span>{phase.phaseId}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm" data-testid={`text-phase-title-${phase.phaseId}`}>
                      {phase.title}
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid={`text-phase-subtitle-${phase.phaseId}`}>
                      {phase.subtitle}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-medium" data-testid={`text-phase-status-${phase.phaseId}`}>
                  {status === 'complete' && 'Complete'}
                  {status === 'active' && 'Active'}
                  {status === 'locked' && 'Locked'}
                </div>
              </div>
              
              {status === 'active' && (
                <div className="mt-2 ml-11 w-full">
                  <Progress value={progress} className="w-full h-2" data-testid={`progress-phase-${phase.phaseId}`} />
                  <div className="text-xs text-muted-foreground mt-1" data-testid={`text-progress-${phase.phaseId}`}>
                    {Math.round(progress)}% complete
                  </div>
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
