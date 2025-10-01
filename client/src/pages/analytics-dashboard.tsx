import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Award,
  Activity,
  BookOpen,
  Target,
  Home,
  GraduationCap,
  Calendar,
  ChartBar,
  Brain
} from 'lucide-react';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

interface AnalyticsData {
  gradeProgress: any[];
  periodEngagement: any[];
  pathDistribution: any[];
  completionRates: any[];
  timeMetrics: any;
}

export default function AnalyticsDashboard() {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('week');

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['/api/analytics', selectedGrade, selectedPeriod, timeRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        grade: selectedGrade,
        period: selectedPeriod,
        timeRange
      });
      const response = await fetch(`/api/analytics/dashboard?${params}`);
      return response.json();
    },
    staleTime: 60000,
  });

  // Mock data for demonstration
  const mockData: AnalyticsData = {
    gradeProgress: [
      { grade: 'K', completed: 45, inProgress: 30, notStarted: 25 },
      { grade: '1', completed: 52, inProgress: 28, notStarted: 20 },
      { grade: '2', completed: 48, inProgress: 32, notStarted: 20 },
      { grade: '3', completed: 55, inProgress: 25, notStarted: 20 },
      { grade: '4', completed: 60, inProgress: 25, notStarted: 15 },
      { grade: '5', completed: 58, inProgress: 27, notStarted: 15 },
      { grade: '6', completed: 62, inProgress: 23, notStarted: 15 },
      { grade: '7', completed: 65, inProgress: 22, notStarted: 13 },
      { grade: '8', completed: 70, inProgress: 20, notStarted: 10 },
    ],
    periodEngagement: [
      { name: 'Prehistory', engagement: 75, avgTime: 25 },
      { name: 'Mesopotamia', engagement: 82, avgTime: 30 },
      { name: 'Egypt', engagement: 88, avgTime: 35 },
      { name: 'Greece', engagement: 85, avgTime: 32 },
      { name: 'Rome', engagement: 80, avgTime: 28 },
      { name: 'Renaissance', engagement: 92, avgTime: 40 },
      { name: 'Modern', engagement: 78, avgTime: 30 },
    ],
    pathDistribution: [
      { name: 'Base', value: 45, students: 450 },
      { name: 'Advanced', value: 25, students: 250 },
      { name: 'Remedial', value: 20, students: 200 },
      { name: 'Enrichment', value: 10, students: 100 },
    ],
    completionRates: [
      { period: 'Week 1', rate: 72 },
      { period: 'Week 2', rate: 78 },
      { period: 'Week 3', rate: 85 },
      { period: 'Week 4', rate: 88 },
    ],
    timeMetrics: {
      totalTime: 12500,
      avgSessionTime: 35,
      peakHours: '2-4 PM',
      mostActiveDay: 'Wednesday'
    }
  };

  const data = analyticsData || mockData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ChartBar className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Track student progress across grades and historical periods
                </p>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/'}
                data-testid="button-home"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/learning'}
                data-testid="button-learning"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Learning
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/curriculum'}
                data-testid="button-curriculum"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Curriculum
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-[180px]" data-testid="select-grade-filter">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {['K', '1', '2', '3', '4', '5', '6', '7', '8'].map(grade => (
                <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]" data-testid="select-period-filter">
              <SelectValue placeholder="Historical Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              <SelectItem value="prehistory">Prehistory</SelectItem>
              <SelectItem value="mesopotamia">Mesopotamia</SelectItem>
              <SelectItem value="egypt">Egypt</SelectItem>
              <SelectItem value="greece">Ancient Greece</SelectItem>
              <SelectItem value="rome">Ancient Rome</SelectItem>
              <SelectItem value="renaissance">Renaissance</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]" data-testid="select-time-filter">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-total-students">1,234</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" /> +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-completion-rate">85.7%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" /> +5.2% improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Learning Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-total-time">
                {Math.floor(data.timeMetrics.totalTime / 60)}h {data.timeMetrics.totalTime % 60}m
              </div>
              <p className="text-xs text-muted-foreground">
                Avg. {data.timeMetrics.avgSessionTime} min/session
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-active-learners">892</div>
              <p className="text-xs text-muted-foreground">
                Peak: {data.timeMetrics.peakHours}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="progress" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress" data-testid="tab-progress">Grade Progress</TabsTrigger>
            <TabsTrigger value="engagement" data-testid="tab-engagement">Period Engagement</TabsTrigger>
            <TabsTrigger value="paths" data-testid="tab-paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="trends" data-testid="tab-trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progress by Grade Level</CardTitle>
                <CardDescription>
                  Student completion status across all grade levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.gradeProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                    <Bar dataKey="inProgress" stackId="a" fill="#F59E0B" name="In Progress" />
                    <Bar dataKey="notStarted" stackId="a" fill="#EF4444" name="Not Started" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Period Engagement</CardTitle>
                <CardDescription>
                  Student engagement and time spent per historical period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.periodEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="engagement" fill="#8884d8" name="Engagement %" />
                    <Bar yAxisId="right" dataKey="avgTime" fill="#82ca9d" name="Avg Time (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paths" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Path Distribution</CardTitle>
                  <CardDescription>
                    Student distribution across differentiation paths
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.pathDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.pathDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Path Performance</CardTitle>
                  <CardDescription>
                    Student count and success metrics per path
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.pathDistribution.map((path: any, index: number) => (
                      <div key={path.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{path.name}</span>
                          </div>
                          <Badge variant="outline" data-testid={`badge-path-${path.name.toLowerCase()}`}>
                            {path.students} students
                          </Badge>
                        </div>
                        <Progress value={path.value * 2} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completion Rate Trends</CardTitle>
                <CardDescription>
                  Weekly completion rates over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.completionRates}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Completion Rate %"
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Performing Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">Renaissance</p>
                  <p className="text-sm text-muted-foreground">92% engagement rate</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Most Active Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{data.timeMetrics.mostActiveDay}</p>
                  <p className="text-sm text-muted-foreground">Peak hours: {data.timeMetrics.peakHours}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Learning Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">+15%</p>
                  <p className="text-sm text-muted-foreground">Week over week</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}