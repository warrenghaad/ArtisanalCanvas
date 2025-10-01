import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Book, 
  FolderOpen, 
  ChevronRight, 
  History, 
  Palette, 
  Calculator,
  Crown,
  Scroll,
  Map,
  Building,
  Globe,
  Sparkles,
  BookOpen,
  FileText,
  Video,
  Image,
  Brain
} from 'lucide-react';

interface ContentNode {
  id: string;
  title: string;
  type: 'folder' | 'module' | 'lesson' | 'page' | 'file';
  icon?: any;
  children?: ContentNode[];
  metadata?: {
    description?: string;
    duration?: string;
    difficulty?: string;
    prerequisites?: string[];
    objectives?: string[];
  };
}

const historicalPeriods = [
  { id: 'prehistory', title: 'Prehistory', dates: '70,000 - 3,500 BCE', icon: History, color: 'bg-stone-600' },
  { id: 'mesopotamia', title: 'Mesopotamia', dates: '3,500 - 539 BCE', icon: Building, color: 'bg-amber-700' },
  { id: 'egypt', title: 'Ancient Egypt', dates: '3,100 - 30 BCE', icon: Crown, color: 'bg-yellow-600' },
  { id: 'greece', title: 'Ancient Greece', dates: '800 - 146 BCE', icon: Palette, color: 'bg-blue-600' },
  { id: 'rome', title: 'Roman Empire', dates: '753 BCE - 476 CE', icon: Crown, color: 'bg-purple-600' },
  { id: 'maya', title: 'Maya Civilization', dates: '2,000 BCE - 1,500 CE', icon: Map, color: 'bg-green-700' },
  { id: 'china', title: 'Ancient China', dates: '2,070 BCE - 220 CE', icon: Globe, color: 'bg-red-600' },
  { id: 'islamic', title: 'Islamic Golden Age', dates: '750 - 1,258 CE', icon: Sparkles, color: 'bg-emerald-600' },
  { id: 'medieval', title: 'Medieval Europe', dates: '476 - 1,453 CE', icon: Building, color: 'bg-gray-600' },
  { id: 'renaissance', title: 'Renaissance', dates: '1,300 - 1,600 CE', icon: Palette, color: 'bg-indigo-600' },
  { id: 'industrial', title: 'Industrial Revolution', dates: '1,760 - 1,840 CE', icon: Building, color: 'bg-zinc-600' },
  { id: 'modern', title: 'Modern Era', dates: '1,900 - Present', icon: Globe, color: 'bg-teal-600' }
];

const perspectivePhases = [
  { id: 'phase-01', title: 'Foundation Orientation', modules: 3, lessons: 12 },
  { id: 'phase-02', title: 'Single Point Perspective', modules: 3, lessons: 15 },
  { id: 'phase-03', title: 'Two Point Perspective', modules: 3, lessons: 18 },
  { id: 'phase-04', title: 'Incline and Decline', modules: 3, lessons: 12 },
  { id: 'phase-05', title: 'Three Point Perspective', modules: 3, lessons: 13 },
  { id: 'phase-06', title: 'Circles and Cylinders', modules: 3, lessons: 15 },
  { id: 'phase-07', title: 'Proportional Transfer', modules: 3, lessons: 16 },
  { id: 'phase-08', title: 'Scene Synthesis', modules: 3, lessons: 21 }
];

export default function ETextbookExplorer() {
  const [selectedPeriod, setSelectedPeriod] = useState('prehistory');
  const [selectedPhase, setSelectedPhase] = useState('phase-01');
  const [selectedGrade, setSelectedGrade] = useState('4');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (node: ContentNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const Icon = node.icon || FolderOpen;

    return (
      <div key={node.id} style={{ marginLeft: depth * 20 }}>
        <div
          className={`flex items-center gap-2 p-2 hover:bg-secondary/50 rounded cursor-pointer ${
            selectedContent?.id === node.id ? 'bg-secondary' : ''
          }`}
          onClick={() => {
            if (hasChildren) toggleNode(node.id);
            setSelectedContent(node);
          }}
        >
          {hasChildren && (
            <ChevronRight
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{node.title}</span>
          {node.type === 'lesson' && (
            <Badge variant="secondary" className="ml-auto">
              {node.children?.length || 0} pages
            </Badge>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="p-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Book className="w-8 h-8 text-primary" />
            eTextbook Explorer
          </h1>
          <p className="text-muted-foreground mt-2">
            Navigate through comprehensive curriculum content with deep hierarchical organization
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-80 border-r bg-card">
          <Tabs defaultValue="perspective" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-4 mx-auto" style={{ width: 'calc(100% - 2rem)' }}>
              <TabsTrigger value="perspective">Perspective</TabsTrigger>
              <TabsTrigger value="historical">Historical</TabsTrigger>
            </TabsList>
            
            <TabsContent value="perspective" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full px-4">
                <div className="space-y-2 pb-4">
                  {perspectivePhases.map((phase) => (
                    <Card
                      key={phase.id}
                      className={`cursor-pointer transition-all ${
                        selectedPhase === phase.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedPhase(phase.id)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">{phase.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{phase.modules} modules</span>
                          <span>{phase.lessons} lessons</span>
                        </div>
                        <Progress value={Math.random() * 100} className="mt-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="historical" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full px-4">
                <div className="space-y-2 pb-4">
                  {historicalPeriods.map((period) => {
                    const Icon = period.icon;
                    return (
                      <Card
                        key={period.id}
                        className={`cursor-pointer transition-all ${
                          selectedPeriod === period.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedPeriod(period.id)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded ${period.color}`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-sm">{period.title}</CardTitle>
                              <p className="text-xs text-muted-foreground mt-1">{period.dates}</p>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Header */}
          <div className="border-b p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid View
                </Button>
                <Button
                  variant={viewMode === 'tree' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('tree')}
                >
                  Tree View
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FolderOpen className="w-4 h-4" />
                <span>2,847 directories</span>
                <FileText className="w-4 h-4 ml-4" />
                <span>12,394 files</span>
              </div>
            </div>
          </div>

          {/* Content Display */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* Grade Selector */}
              <div className="mb-4 flex items-center gap-4">
                <label className="text-sm font-medium">Select Grade:</label>
                <div className="flex gap-2">
                  {['K', '1', '2', '3', '4', '5', '6', '7', '8'].map(grade => (
                    <Button
                      key={grade}
                      variant={selectedGrade === grade ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedGrade(grade)}
                      data-testid={`button-grade-${grade}`}
                    >
                      Grade {grade}
                    </Button>
                  ))}
                </div>
              </div>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Actual Grade Content Cards */}
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all"
                    data-testid="card-grade-content"
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded">
                        <Brain className="w-12 h-12 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Grade {selectedGrade} - Art & Patterns</h3>
                      <p className="text-sm text-muted-foreground mt-1">Visual arts and motifs</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-green-500 to-teal-600 rounded">
                        <Calculator className="w-12 h-12 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Mathematics</h3>
                      <p className="text-sm text-muted-foreground mt-1">Concepts and discoveries</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded">
                        <Scroll className="w-12 h-12 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Myths & Stories</h3>
                      <p className="text-sm text-muted-foreground mt-1">Cultural narratives</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-orange-500 to-red-600 rounded">
                        <Crown className="w-12 h-12 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Power Structures</h3>
                      <p className="text-sm text-muted-foreground mt-1">Government and society</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded">
                        <BookOpen className="w-12 h-12 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Lessons</h3>
                      <p className="text-sm text-muted-foreground mt-1">125 total lessons</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Interactive</h3>
                      <p className="text-sm text-muted-foreground mt-1">Simulations & activities</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded">
                        <Image className="w-12 h-12 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Media Gallery</h3>
                      <p className="text-sm text-muted-foreground mt-1">Images & 3D models</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded">
                        <FileText className="w-12 h-12 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Assessments</h3>
                      <p className="text-sm text-muted-foreground mt-1">Tests & evaluations</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Directory Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {/* Sample tree structure */}
                      {renderTreeNode({
                        id: 'root',
                        title: 'etextbooks',
                        type: 'folder',
                        icon: FolderOpen,
                        children: [
                          {
                            id: 'content',
                            title: 'content',
                            type: 'folder',
                            children: [
                              {
                                id: 'perspective',
                                title: 'perspective-drawing',
                                type: 'folder',
                                children: perspectivePhases.map(phase => ({
                                  id: phase.id,
                                  title: phase.title,
                                  type: 'module',
                                  children: []
                                }))
                              },
                              {
                                id: 'historical',
                                title: 'historical-periods',
                                type: 'folder',
                                children: historicalPeriods.map(period => ({
                                  id: period.id,
                                  title: period.title,
                                  type: 'module',
                                  children: []
                                }))
                              }
                            ]
                          },
                          {
                            id: 'templates',
                            title: 'templates',
                            type: 'folder',
                            children: []
                          },
                          {
                            id: 'components',
                            title: 'components',
                            type: 'folder',
                            children: []
                          },
                          {
                            id: 'analytics',
                            title: 'analytics',
                            type: 'folder',
                            children: []
                          },
                          {
                            id: 'media',
                            title: 'media',
                            type: 'folder',
                            children: []
                          }
                        ]
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Detail Panel */}
        {selectedContent && (
          <div className="w-96 border-l bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">{selectedContent.title}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Type</h3>
                <Badge>{selectedContent.type}</Badge>
              </div>
              
              {selectedContent.metadata?.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p className="text-sm">{selectedContent.metadata.description}</p>
                </div>
              )}

              {selectedContent.children && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Contents</h3>
                  <p className="text-sm">{selectedContent.children.length} items</p>
                </div>
              )}

              <div className="pt-4">
                <Button className="w-full">Open Content</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}