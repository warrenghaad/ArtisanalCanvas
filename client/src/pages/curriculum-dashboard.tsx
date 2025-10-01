import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap,
  Users,
  Target,
  TrendingUp,
  Calendar,
  ChartBar,
  BookOpen,
  Layers,
  Globe,
  Palette,
  Building,
  Crown,
  Map,
  Sparkles,
  History,
  Leaf
} from 'lucide-react';
import type { CurriculumMapping, HistoricalPeriodContent } from '@shared/schema';

// Period icons mapping
const periodIcons: Record<string, any> = {
  prehistory: History,
  mesopotamia: Building,
  egypt: Crown,
  indus: Map,
  china: Globe,
  mesoamerica: Map,
  greece: Palette,
  rome: Building,
  byzantine: Crown,
  islamic: Sparkles,
  medieval: Building,
  renaissance: Palette,
  modern: Globe,
  biomimicry: Leaf
};

// Period colors for visualization
const periodColors: Record<string, string> = {
  prehistory: '#8B7355',
  mesopotamia: '#B8860B',
  egypt: '#FFD700',
  indus: '#CD853F',
  china: '#DC143C',
  mesoamerica: '#228B22',
  greece: '#4169E1',
  rome: '#8B008B',
  byzantine: '#FF6347',
  islamic: '#20B2AA',
  medieval: '#696969',
  renaissance: '#4B0082',
  modern: '#008080',
  biomimicry: '#32CD32'
};

// Grade level descriptions
const gradeBandDescriptions: Record<string, { band: string; focus: string; approach: string }> = {
  'K': { band: 'K-1', focus: 'Exploratory', approach: 'Play-based, patterns, symmetry, tactile' },
  '1': { band: 'K-1', focus: 'Exploratory', approach: 'Play-based, patterns, symmetry, tactile' },
  '2': { band: '2-3', focus: 'Classification', approach: 'Vocabulary, classification, symmetry, simple tilings' },
  '3': { band: '2-3', focus: 'Classification', approach: 'Vocabulary, classification, symmetry, simple tilings' },
  '4': { band: '4-5', focus: 'Formal Vocabulary', approach: 'Formal vocabulary, measurement, scale, tessellations' },
  '5': { band: '4-5', focus: 'Formal Vocabulary', approach: 'Formal vocabulary, measurement, scale, tessellations' },
  '6': { band: '6-8', focus: 'Transformations', approach: 'Transformations, similarity, proportions, circle geometry' },
  '7': { band: '6-8', focus: 'Proofs', approach: 'Circle geometry, multi-step proofs, design briefs' },
  '8': { band: '6-8', focus: 'Synthesis', approach: 'Multi-step proofs, parametric design, bio-inspired design' }
};

export default function CurriculumDashboard() {
  const [selectedGrade, setSelectedGrade] = useState<string>('K');
  const [viewMode, setViewMode] = useState<'chart' | 'timeline' | 'focus'>('chart');

  // Fetch curriculum mappings for selected grade
  const { data: mappings = [], isLoading: mappingsLoading } = useQuery<CurriculumMapping[]>({
    queryKey: ['/api/curriculum/mappings', selectedGrade],
    queryFn: async () => {
      const response = await fetch(`/api/curriculum/mappings/${selectedGrade}`);
      if (!response.ok) throw new Error('Failed to fetch mappings');
      return response.json();
    }
  });

  // Fetch all historical periods
  const { data: periods = [], isLoading: periodsLoading } = useQuery<HistoricalPeriodContent[]>({
    queryKey: ['/api/historical-periods'],
    queryFn: async () => {
      const response = await fetch('/api/historical-periods');
      if (!response.ok) throw new Error('Failed to fetch periods');
      return response.json();
    }
  });

  const isLoading = mappingsLoading || periodsLoading;
  const gradeInfo = gradeBandDescriptions[selectedGrade];

  // Calculate total weight for normalization
  const totalWeight = mappings.reduce((sum, m) => sum + parseFloat(m.timeWeighting || '0'), 0);

  // Sort mappings by weight for display
  const sortedMappings = [...mappings].sort((a, b) => 
    parseFloat(b.timeWeighting || '0') - parseFloat(a.timeWeighting || '0')
  );

  // Find period details
  const getPeriodDetails = (periodId: string) => {
    return periods.find(p => p.periodId === periodId);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              K-8 Curriculum Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Geometry & Art curriculum distribution across historical periods
            </p>
          </div>
          
          {/* Grade Selector */}
          <div className="flex items-center gap-4">
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-[180px]" data-testid="select-grade">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="K">Kindergarten</SelectItem>
                <SelectItem value="1">Grade 1</SelectItem>
                <SelectItem value="2">Grade 2</SelectItem>
                <SelectItem value="3">Grade 3</SelectItem>
                <SelectItem value="4">Grade 4</SelectItem>
                <SelectItem value="5">Grade 5</SelectItem>
                <SelectItem value="6">Grade 6</SelectItem>
                <SelectItem value="7">Grade 7</SelectItem>
                <SelectItem value="8">Grade 8</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grade Band Info */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {gradeInfo.band} Band
                </Badge>
                <div>
                  <p className="font-semibold">{gradeInfo.focus}</p>
                  <p className="text-sm text-muted-foreground">{gradeInfo.approach}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'chart' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('chart')}
                  data-testid="button-chart-view"
                >
                  <ChartBar className="w-4 h-4 mr-2" />
                  Chart View
                </Button>
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                  data-testid="button-timeline-view"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline View
                </Button>
                <Button
                  variant={viewMode === 'focus' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('focus')}
                  data-testid="button-focus-view"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Focus Areas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading curriculum data...</div>
        </div>
      ) : (
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsContent value="chart" className="mt-0">
            <div className="grid gap-4">
              {/* Weight Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Time Distribution by Historical Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedMappings.map((mapping) => {
                      const weight = parseFloat(mapping.timeWeighting || '0');
                      const percentage = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
                      const Icon = periodIcons[mapping.historicalPeriod] || Globe;
                      const period = getPeriodDetails(mapping.historicalPeriod);
                      
                      return (
                        <div key={mapping.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="w-5 h-5" style={{ color: periodColors[mapping.historicalPeriod] }} />
                              <span className="font-medium">{period?.periodName || mapping.historicalPeriod}</span>
                              <span className="text-sm text-muted-foreground">
                                {period?.dateRange}
                              </span>
                            </div>
                            <Badge>{weight}% of year</Badge>
                          </div>
                          <Progress 
                            value={percentage} 
                            className="h-3"
                            style={{ 
                              '--progress-color': periodColors[mapping.historicalPeriod] 
                            } as any}
                          />
                          <div className="flex flex-wrap gap-1">
                            {mapping.focusAreas?.map((focus, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {focus}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Total Periods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mappings.length}</div>
                    <p className="text-xs text-muted-foreground">Historical periods covered</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Primary Focus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {sortedMappings[0]?.historicalPeriod ? 
                        getPeriodDetails(sortedMappings[0].historicalPeriod)?.periodName : 
                        'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {sortedMappings[0]?.timeWeighting}% of curriculum time
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Learning Approach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{gradeInfo.focus}</div>
                    <p className="text-xs text-muted-foreground">{gradeInfo.band} methodology</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Chronological Journey Through History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline axis */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
                  
                  <div className="space-y-6">
                    {periods
                      .filter(p => mappings.some(m => m.historicalPeriod === p.periodId))
                      .sort((a, b) => {
                        // Sort by start date (extract first year from date range)
                        const getStartYear = (range: string) => {
                          const match = range?.match(/[\d,]+/);
                          return match ? parseInt(match[0].replace(/,/g, '')) : 0;
                        };
                        return getStartYear(b.dateRange || '') - getStartYear(a.dateRange || '');
                      })
                      .map((period) => {
                        const mapping = mappings.find(m => m.historicalPeriod === period.periodId);
                        const Icon = periodIcons[period.periodId] || Globe;
                        const weight = parseFloat(mapping?.timeWeighting || '0');
                        
                        return (
                          <div key={period.id} className="relative flex items-start gap-4">
                            <div 
                              className="w-16 h-16 rounded-full flex items-center justify-center z-10"
                              style={{ backgroundColor: periodColors[period.periodId] + '20', border: `2px solid ${periodColors[period.periodId]}` }}
                            >
                              <Icon className="w-8 h-8" style={{ color: periodColors[period.periodId] }} />
                            </div>
                            <div className="flex-1 pt-2">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-lg">{period.periodName}</h3>
                                {weight > 0 && (
                                  <Badge variant="secondary">{weight}% of year</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{period.dateRange}</p>
                              <p className="text-sm mb-2">{period.description}</p>
                              {mapping?.focusAreas && (
                                <div className="flex flex-wrap gap-1">
                                  {mapping.focusAreas.map((focus, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {focus}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="focus" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedMappings.map((mapping) => {
                const period = getPeriodDetails(mapping.historicalPeriod);
                const Icon = periodIcons[mapping.historicalPeriod] || Globe;
                
                return (
                  <Card key={mapping.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Icon className="w-5 h-5" style={{ color: periodColors[mapping.historicalPeriod] }} />
                        {period?.periodName || mapping.historicalPeriod}
                        <Badge className="ml-auto">{mapping.timeWeighting}%</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Learning Focus</p>
                          <div className="flex flex-wrap gap-1">
                            {mapping.focusAreas?.map((focus, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {focus}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {period?.artPatterns && typeof period.artPatterns === 'object' && (
                          <div>
                            <p className="text-sm font-medium mb-1">Art Patterns & Motifs</p>
                            <div className="flex flex-wrap gap-1">
                              {(Array.isArray((period.artPatterns as any).motifs) ? 
                                (period.artPatterns as any).motifs : []
                              ).map((motif: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {motif}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {period?.mathematicalConcepts && typeof period.mathematicalConcepts === 'object' && (
                          <div>
                            <p className="text-sm font-medium mb-1">Mathematical Concepts</p>
                            <div className="flex flex-wrap gap-1">
                              {(Array.isArray((period.mathematicalConcepts as any).concepts) ? 
                                (period.mathematicalConcepts as any).concepts : []
                              ).map((concept: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {concept}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}