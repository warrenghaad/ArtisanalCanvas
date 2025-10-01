import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronUp, 
  ChevronDown, 
  BookOpen, 
  Award, 
  Lightbulb, 
  Target,
  Clock,
  CheckCircle,
  CircleX,
  Brain,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DifferentiatedContentProps {
  userId: string;
  contentPath: string;
  gradeLevel?: string;
  periodId?: string;
}

export function DifferentiatedContent({ 
  userId, 
  contentPath, 
  gradeLevel,
  periodId 
}: DifferentiatedContentProps) {
  const { toast } = useToast();
  const [selectedPath, setSelectedPath] = useState<string>('base');
  const [timeSpent, setTimeSpent] = useState(0);

  // Fetch differentiated content
  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/differentiated-content', contentPath, userId],
    queryFn: async () => {
      const response = await fetch(
        `/api/differentiated-content/${encodeURIComponent(contentPath)}?userId=${userId}`
      );
      return response.json();
    },
    staleTime: 30000,
  });

  // Fetch student progress
  const { data: progressData } = useQuery({
    queryKey: ['/api/student-progress', userId, contentPath],
    queryFn: async () => {
      const response = await fetch(
        `/api/student-progress/${userId}?contentPath=${encodeURIComponent(contentPath)}`
      );
      return response.json();
    },
    staleTime: 10000,
  });

  // Update differentiation path mutation
  const updatePathMutation = useMutation({
    mutationFn: async (newPath: string) => {
      const response = await apiRequest('POST', '/api/differentiation-path/update', {
        userId,
        contentPath,
        newPath
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedPath(data.updatedPath);
      toast({
        title: "Path Updated",
        description: `Switched to ${data.updatedPath} learning path`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/differentiated-content'] });
      queryClient.invalidateQueries({ queryKey: ['/api/student-progress'] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Unable to change learning path",
        variant: "destructive",
      });
    },
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await apiRequest('POST', '/api/student-progress', {
        userId,
        contentPath,
        gradeLevel,
        completionStatus: status,
        timeSpent,
        differentiationPath: selectedPath,
        metadata: { lastUpdated: new Date().toISOString() }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Progress Saved",
        description: "Your learning progress has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/student-progress'] });
    },
  });

  // Timer for tracking time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set initial path from progress data
  useEffect(() => {
    if (progressData?.[0]?.differentiationPath) {
      setSelectedPath(progressData[0].differentiationPath);
    }
  }, [progressData]);

  const getPathIcon = (path: string) => {
    switch (path) {
      case 'remedial': return <Target className="w-4 h-4" />;
      case 'base': return <BookOpen className="w-4 h-4" />;
      case 'advanced': return <Brain className="w-4 h-4" />;
      case 'enrichment': return <Sparkles className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getPathColor = (path: string) => {
    switch (path) {
      case 'remedial': return "bg-yellow-500";
      case 'base': return "bg-blue-500";
      case 'advanced': return "bg-purple-500";
      case 'enrichment': return "bg-emerald-500";
      default: return "bg-gray-500";
    }
  };

  if (contentLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentContent = contentData?.content || {};
  const nextLevel = contentData?.nextLevel;
  const previousLevel = contentData?.previousLevel;

  return (
    <div className="space-y-6">
      {/* Path Selection Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Learning Path</CardTitle>
              <Badge className={getPathColor(selectedPath)} data-testid="badge-current-path">
                {getPathIcon(selectedPath)}
                <span className="ml-1">{selectedPath}</span>
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {previousLevel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePathMutation.mutate(previousLevel)}
                  disabled={updatePathMutation.isPending}
                  data-testid="button-decrease-difficulty"
                >
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Easier
                </Button>
              )}
              {nextLevel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePathMutation.mutate(nextLevel)}
                  disabled={updatePathMutation.isPending}
                  data-testid="button-increase-difficulty"
                >
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Harder
                </Button>
              )}
            </div>
          </div>
          <CardDescription>
            {currentContent.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Content Display */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>{currentContent.title || "Learning Content"}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {currentContent.estimatedTime || 30} minutes
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              Time spent: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
              <TabsTrigger value="activities" data-testid="tab-activities">Activities</TabsTrigger>
              <TabsTrigger value="progress" data-testid="tab-progress">Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Learning Objectives</h3>
                <ul className="space-y-2">
                  {(currentContent.activities || []).map((activity: string, index: number) => (
                    <li key={index} className="flex items-start gap-2" data-testid={`objective-${index}`}>
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="activities" className="space-y-4 mt-4">
              <div className="grid gap-4">
                {(currentContent.activities || []).map((activity: string, index: number) => (
                  <Card key={index} data-testid={`activity-card-${index}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {activity}
                        </CardTitle>
                        <Badge variant="outline" data-testid={`activity-status-${index}`}>
                          {progressData?.[0]?.completionStatus === 'completed' ? 'Completed' : 'Not Started'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        data-testid={`button-start-activity-${index}`}
                      >
                        Start Activity
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span data-testid="text-progress-percentage">
                      {progressData?.[0]?.completionStatus === 'completed' ? '100' : '0'}%
                    </span>
                  </div>
                  <Progress 
                    value={progressData?.[0]?.completionStatus === 'completed' ? 100 : 0} 
                    className="h-2"
                    data-testid="progress-bar"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Time Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold" data-testid="text-time-spent">
                        {Math.floor(timeSpent / 60)} min
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Current Path</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold capitalize" data-testid="text-current-path">
                        {selectedPath}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => updateProgressMutation.mutate('completed')}
                    disabled={updateProgressMutation.isPending}
                    data-testid="button-mark-complete"
                  >
                    Mark as Complete
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => updateProgressMutation.mutate('in_progress')}
                    disabled={updateProgressMutation.isPending}
                    data-testid="button-save-progress"
                  >
                    Save Progress
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}