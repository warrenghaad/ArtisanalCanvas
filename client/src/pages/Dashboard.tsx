import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, AlertTriangle, Activity, Settings, Database, Image as ImageIcon, Search, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border px-6 py-4 flex justify-between items-center bg-background/95 backdrop-blur z-50 sticky top-0">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-none">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="font-display text-xl font-bold tracking-widest uppercase">
            Curation Dashboard
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Badge variant="outline" className="rounded-none font-sans uppercase tracking-widest text-[10px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Active
          </Badge>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-6 md:p-12">
        <Tabs defaultValue="approvals" className="w-full">
          <TabsList className="grid grid-cols-5 rounded-none h-14 bg-muted mb-12 overflow-x-auto">
            <TabsTrigger value="approvals" className="rounded-none font-sans uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Approval Gates
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-none font-sans uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Live Feed
            </TabsTrigger>
            <TabsTrigger value="generate" className="rounded-none font-sans uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              On-Demand
            </TabsTrigger>
            <TabsTrigger value="batch" className="rounded-none font-sans uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Batch Jobs
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none font-sans uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Parameters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="space-y-8 animate-in fade-in-50 duration-500">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="font-serif text-3xl mb-2">Pending Review</h2>
                <p className="font-sans text-muted-foreground">Artifacts awaiting deployment to curriculum sections.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs">Approve All</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Sample Approval Card */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border p-4 space-y-4 bg-card/50 transition-colors hover:bg-card">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden group">
                    <img src={i === 1 ? `/images/artifact_mesopotamian.png` : i === 2 ? `/images/artifact_egypt.png` : `/images/artifact_greek.png`} alt="Candidate" className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      <Badge className="rounded-none bg-black/80 text-white font-mono text-[10px]">CLIP: {0.96 - (i * 0.02)}</Badge>
                      <Badge className="rounded-none bg-black/80 text-white font-mono text-[10px]">SafeSearch: Pass</Badge>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-sans font-bold text-sm uppercase tracking-wider">Candidate #{i}</h4>
                      <span className="text-xs text-muted-foreground font-mono">Source: MET API</span>
                    </div>
                    <p className="text-sm font-serif text-muted-foreground line-clamp-2">Assigned to Section: Structural Geometry - Ancient Near East.</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button size="sm" className="flex-1 rounded-none bg-green-900/50 hover:bg-green-900 text-white border border-green-800">
                      <Check className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-none border-red-900/50 text-red-500 hover:bg-red-950/30">
                      <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-none border-yellow-900/50 text-yellow-500 hover:bg-yellow-950/30">
                      <AlertTriangle className="w-4 h-4 mr-2" /> Flag
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 animate-in fade-in-50 duration-500">
            <h2 className="font-serif text-3xl mb-8">Autonomous Agents Log</h2>
            <div className="border border-border p-6 font-mono text-sm space-y-4 bg-black text-green-500 h-[600px] overflow-y-auto shadow-inner">
              <div className="flex gap-4"><span className="text-muted-foreground">[14:32:01]</span><span>[PULLER] Detected empty section A2 (Greek Pottery). Triggering search...</span></div>
              <div className="flex gap-4"><span className="text-muted-foreground">[14:32:05]</span><span className="text-blue-400">[MET_API] Found 42 results for 'Geometric Krater'. Filtering by CC0...</span></div>
              <div className="flex gap-4"><span className="text-muted-foreground">[14:32:08]</span><span>[ANALYZER] Computing CLIP scores against section context...</span></div>
              <div className="flex gap-4"><span className="text-muted-foreground">[14:32:12]</span><span className="text-yellow-500">[ROUTER] Pushed top 3 candidates to Approval Gate.</span></div>
              <div className="flex gap-4"><span className="text-muted-foreground">[14:35:22]</span><span>[TAGGER] Processed batch #8992. Identified: 'atomic', 'symmetry', 'radial'.</span></div>
              <div className="flex gap-4"><span className="text-muted-foreground">[14:40:00]</span><span className="text-red-400">[DIAGRAM_GEN] Flagged artifact MES-01 requires structural overlay. Queuing gpt-image-2 generation...</span></div>
              <div className="flex gap-4"><span className="text-muted-foreground">[14:41:15]</span><span className="text-green-400">[GPT_IMAGE] Successfully generated diagram overlay for MES-01 (Quality: high).</span></div>
              <div className="flex gap-4"><span className="text-muted-foreground animate-pulse">_</span></div>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-8 animate-in fade-in-50 duration-500">
            <h2 className="font-serif text-3xl mb-8">On-Demand Curation</h2>
            <div className="max-w-3xl border border-border p-8 bg-card/20 space-y-6">
              <div className="space-y-2">
                <label className="font-sans uppercase tracking-widest text-xs text-muted-foreground">Aesthetic Geometry Parameter</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="e.g., 'Brutalist concrete intersections', 'Hellenistic radial symmetry'" 
                      className="w-full h-12 bg-background border border-border pl-12 pr-4 font-serif text-lg focus:outline-none focus:border-primary transition-colors"
                      data-testid="input-generation-prompt"
                    />
                  </div>
                  <Button 
                    className="h-12 px-8 rounded-none uppercase tracking-widest text-xs flex items-center gap-2"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    data-testid="button-generate"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    {isGenerating ? 'Synthesizing...' : 'Generate'}
                  </Button>
                </div>
              </div>

              {hasGenerated && !isGenerating && (
                <div className="pt-8 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl">Synthesis Complete</h3>
                    <Badge variant="outline" className="rounded-none font-mono text-[10px] uppercase">Confidence: 0.94</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="aspect-square bg-muted relative overflow-hidden group border border-border">
                      <img src="/images/artifact_mesopotamian.png" alt="Generated variation 1" className="object-cover w-full h-full opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                         <div className="font-mono text-xs text-white">Variant A - Structural Focus</div>
                      </div>
                    </div>
                    <div className="aspect-square bg-muted relative overflow-hidden group border border-border">
                      <img src="/images/artifact_greek.png" alt="Generated variation 2" className="object-cover w-full h-full opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                         <div className="font-mono text-xs text-white">Variant B - Surface Topology</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs" data-testid="button-discard">Discard</Button>
                    <Button className="rounded-none uppercase tracking-widest text-xs" data-testid="button-send-approval">Send to Approval Gate</Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="batch" className="space-y-8 animate-in fade-in-50 duration-500">
            <h2 className="font-serif text-3xl mb-8">Ingestion & Batch Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-border p-8 bg-card/20 space-y-6 hover:border-primary/50 transition-colors">
                <Database className="w-8 h-8 text-primary" />
                <h3 className="font-sans text-xl uppercase tracking-widest">RWI Needs Sync</h3>
                <p className="font-serif text-muted-foreground text-sm">Sync missing artifacts requested by the Read-Write-Interface editor.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono"><span className="text-muted-foreground">Pending Items</span><span>24</span></div>
                  <div className="flex justify-between text-sm font-mono"><span className="text-muted-foreground">Last Sync</span><span>10 mins ago</span></div>
                </div>
                <Button className="w-full rounded-none uppercase tracking-widest text-xs">Run Sync</Button>
              </div>

              <div className="border border-border p-8 bg-card/20 space-y-6 hover:border-primary/50 transition-colors">
                <ImageIcon className="w-8 h-8 text-primary" />
                <h3 className="font-sans text-xl uppercase tracking-widest">Met Museum Scraper</h3>
                <p className="font-serif text-muted-foreground text-sm">Bulk download CC0 images matching predefined aesthetic parameters.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono"><span className="text-muted-foreground">Rate Limit</span><span>80 req/sec</span></div>
                  <div className="flex justify-between text-sm font-mono"><span className="text-muted-foreground">Storage</span><span>Local / JSON</span></div>
                </div>
                <Button variant="outline" className="w-full rounded-none uppercase tracking-widest text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground">Start Scrape</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8 animate-in fade-in-50 duration-500">
            <h2 className="font-serif text-3xl mb-8">System Parameters</h2>
            <div className="max-w-2xl border border-border p-8 bg-card/10 space-y-8">
              
              <div className="space-y-4 border-b border-border pb-8">
                <h4 className="font-sans uppercase tracking-widest text-sm font-bold">GPT Image Generation</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-border p-4 cursor-pointer hover:bg-primary/5 transition-colors">
                    <div className="font-mono text-xs mb-2 text-muted-foreground">Model</div>
                    <div className="font-serif text-lg">gpt-image-2</div>
                  </div>
                  <div className="border border-primary bg-primary/10 p-4 cursor-pointer">
                    <div className="font-mono text-xs mb-2 text-primary">Quality</div>
                    <div className="font-serif text-lg">high</div>
                  </div>
                  <div className="border border-border p-4 cursor-pointer hover:bg-primary/5 transition-colors">
                    <div className="font-mono text-xs mb-2 text-muted-foreground">Style</div>
                    <div className="font-serif text-lg">diagrammatic</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-sans uppercase tracking-widest text-sm font-bold">Autonomous Thresholds</h4>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors">
                    <span className="text-muted-foreground">Minimum CLIP Score</span>
                    <span className="px-3 py-1 border border-border bg-background">0.85</span>
                  </div>
                  <div className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors">
                    <span className="text-muted-foreground">Auto-Approve Threshold</span>
                    <span className="px-3 py-1 border border-border bg-background">0.98</span>
                  </div>
                  <div className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors">
                    <span className="text-muted-foreground">SafeSearch Strictness</span>
                    <span className="px-3 py-1 border border-border bg-background">High</span>
                  </div>
                </div>
              </div>

            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
