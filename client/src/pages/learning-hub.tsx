import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DifferentiatedContent } from '@/components/differentiated-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  GraduationCap, 
  BookOpen, 
  Home,
  ChevronRight,
  Map,
  Palette,
  History,
  Users,
  Globe
} from 'lucide-react';

const DEMO_USER_ID = "3f36ca87-0493-4aa9-b89a-7bb875c007c4"; // Actual demo user ID from database

// Historical periods with their IDs
const HISTORICAL_PERIODS = [
  { id: 'prehistory', name: 'Prehistory', icon: History },
  { id: 'mesopotamia', name: 'Mesopotamia', icon: Map },
  { id: 'egypt', name: 'Egypt', icon: Palette },
  { id: 'indus-valley', name: 'Indus Valley', icon: Globe },
  { id: 'china', name: 'China', icon: Users },
  { id: 'mesoamerica', name: 'Mesoamerica', icon: Globe },
  { id: 'ancient-greece', name: 'Ancient Greece', icon: Palette },
  { id: 'ancient-rome', name: 'Ancient Rome', icon: Map },
  { id: 'byzantine', name: 'Byzantine', icon: History },
  { id: 'islamic-world', name: 'Islamic World', icon: Globe },
  { id: 'medieval-europe', name: 'Medieval Europe', icon: Map },
  { id: 'renaissance', name: 'Renaissance', icon: Palette },
  { id: 'modern', name: 'Modern/Contemporary', icon: Globe },
  { id: 'biomimicry', name: 'Biomimicry', icon: Palette }
];

export default function LearningHub() {
  const [selectedGrade, setSelectedGrade] = useState<string>('4');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('renaissance');
  const [selectedModule, setSelectedModule] = useState<string>('');

  // Fetch curriculum mapping for selected grade
  const { data: curriculumData } = useQuery({
    queryKey: ['/api/curriculum/mappings', selectedGrade],
    staleTime: 60000,
  });

  // Fetch historical period content
  const { data: periodData } = useQuery({
    queryKey: ['/api/historical-periods', selectedPeriod],
    staleTime: 60000,
  });

  // Generate content path based on selections
  const contentPath = selectedModule || `${selectedPeriod}/grade-${selectedGrade}/introduction`;

  const currentPeriod = HISTORICAL_PERIODS.find(p => p.id === selectedPeriod);
  const Icon = currentPeriod?.icon || Globe;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Learning Hub</h1>
                <p className="text-sm text-muted-foreground">
                  Interactive Content with Differentiation Paths
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
                onClick={() => window.location.href = '/academy'}
                data-testid="button-academy"
              >
                <Palette className="w-4 h-4 mr-2" />
                Academy
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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/etextbooks'}
                data-testid="button-etextbooks"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                eTextbooks
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/etextbooks">eTextbooks</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/learning/${selectedPeriod}`}>
                {currentPeriod?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Grade {selectedGrade}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Grade Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Grade Level</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger data-testid="select-grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {['K', '1', '2', '3', '4', '5', '6', '7', '8'].map(grade => (
                      <SelectItem key={grade} value={grade} data-testid={`option-grade-${grade}`}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Period Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Historical Period</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {HISTORICAL_PERIODS.map(period => {
                      const PeriodIcon = period.icon;
                      return (
                        <Button
                          key={period.id}
                          variant={selectedPeriod === period.id ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setSelectedPeriod(period.id)}
                          data-testid={`button-period-${period.id}`}
                        >
                          <PeriodIcon className="w-4 h-4 mr-2" />
                          {period.name}
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Module Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedModule === '' ? "default" : "outline"}
                    className="w-full justify-start text-sm"
                    onClick={() => setSelectedModule('')}
                    data-testid="button-module-intro"
                  >
                    Introduction
                  </Button>
                  <Button
                    variant={selectedModule === 'geometry' ? "default" : "outline"}
                    className="w-full justify-start text-sm"
                    onClick={() => setSelectedModule('geometry')}
                    data-testid="button-module-geometry"
                  >
                    Geometry Concepts
                  </Button>
                  <Button
                    variant={selectedModule === 'art' ? "default" : "outline"}
                    className="w-full justify-start text-sm"
                    onClick={() => setSelectedModule('art')}
                    data-testid="button-module-art"
                  >
                    Art Patterns
                  </Button>
                  <Button
                    variant={selectedModule === 'culture' ? "default" : "outline"}
                    className="w-full justify-start text-sm"
                    onClick={() => setSelectedModule('culture')}
                    data-testid="button-module-culture"
                  >
                    Cultural Context
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Period Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle>{currentPeriod?.name}</CardTitle>
                      <CardDescription>
                        Grade {selectedGrade} Learning Path
                      </CardDescription>
                    </div>
                  </div>
                  {curriculumData && Array.isArray(curriculumData) ? (
                    <Badge variant="outline" data-testid="badge-time-weight">
                      {`${(curriculumData as any[]).find((m: any) => 
                        m.historicalPeriod.toLowerCase().includes(selectedPeriod.replace('-', ' '))
                      )?.timeWeighting || '0'}% of Year`}
                    </Badge>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" data-testid="badge-focus-1">
                    <ChevronRight className="w-3 h-3 mr-1" />
                    {selectedGrade <= '2' ? 'Exploration' : 
                     selectedGrade <= '5' ? 'Classification' : 'Analysis'}
                  </Badge>
                  <Badge variant="secondary" data-testid="badge-focus-2">
                    <ChevronRight className="w-3 h-3 mr-1" />
                    {selectedGrade <= '3' ? 'Pattern Recognition' :
                     selectedGrade <= '6' ? 'Formal Vocabulary' : 'Transformations'}
                  </Badge>
                  <Badge variant="secondary" data-testid="badge-focus-3">
                    <ChevronRight className="w-3 h-3 mr-1" />
                    {selectedGrade <= '4' ? 'Creative Expression' :
                     selectedGrade <= '7' ? 'Problem Solving' : 'Proof & Logic'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Differentiated Content Component */}
            <DifferentiatedContent
              userId={DEMO_USER_ID}
              contentPath={contentPath}
              gradeLevel={selectedGrade}
              periodId={selectedPeriod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}