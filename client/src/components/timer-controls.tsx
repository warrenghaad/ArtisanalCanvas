import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TimerControlsProps {
  onTimeUpdate: (seconds: number) => void;
  sessionType?: 'practice' | 'drill' | 'exercise';
  className?: string;
}

export function TimerControls({ onTimeUpdate, sessionType = 'practice', className }: TimerControlsProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [drillTime, setDrillTime] = useState(120); // 2 minutes for drill
  const [isDrillMode, setIsDrillMode] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          onTimeUpdate(newTime);
          
          // Auto-stop drill when time reaches 0
          if (isDrillMode && drillTime - newTime <= 0) {
            setIsRunning(false);
            return prev;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isDrillMode, drillTime, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    setIsDrillMode(false);
    onTimeUpdate(0);
  };

  const handleReset = () => {
    setTimeElapsed(0);
    setIsDrillMode(false);
    onTimeUpdate(0);
  };

  const startDrill = () => {
    setTimeElapsed(0);
    setIsDrillMode(true);
    setIsRunning(true);
    onTimeUpdate(0);
  };

  const currentTime = isDrillMode ? Math.max(0, drillTime - timeElapsed) : timeElapsed;
  const displayTime = formatTime(currentTime);
  const progress = isDrillMode ? ((drillTime - currentTime) / drillTime) * 100 : 0;

  return (
    <div className={className}>
      {/* Main Practice Timer */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <RotateCcw className="w-5 h-5 text-secondary mr-2" />
            Daily Practice Timer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2" data-testid="text-practice-timer">
              {isDrillMode ? displayTime : formatTime(timeElapsed)}
            </div>
            <div className="flex space-x-2 justify-center">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="button-start-practice"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  data-testid="button-pause-practice"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </Button>
              )}
              <Button
                onClick={handleStop}
                variant="outline"
                data-testid="button-stop-practice"
              >
                <Square className="w-4 h-4 mr-1" />
                Stop
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mini Drill Timer */}
      <Card className="bg-secondary/10 border-secondary/20">
        <CardHeader>
          <CardTitle className="text-secondary" data-testid="text-mini-drill-title">Daily Mini Drill</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary mb-2" data-testid="text-drill-timer">
              {isDrillMode ? displayTime : "2:00"}
            </div>
            <div className="text-sm text-secondary/80 mb-3" data-testid="text-drill-description">
              2-Minute Box Practice
            </div>
            
            {isDrillMode && (
              <div className="mb-3">
                <Progress 
                  value={progress} 
                  className="w-full h-2" 
                  data-testid="progress-drill-timer"
                />
                <div className="text-xs text-secondary/80 mt-1">
                  {Math.round(progress)}% complete
                </div>
              </div>
            )}
            
            <Button
              onClick={startDrill}
              disabled={isDrillMode && isRunning}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-testid="button-start-drill"
            >
              <Play className="w-4 h-4 mr-1" />
              {isDrillMode && isRunning ? 'Running...' : 'Start Drill'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
