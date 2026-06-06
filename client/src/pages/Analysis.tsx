import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Check, Search, Activity, Box, Sparkles, Filter, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Analysis() {
  const [activeTab, setActiveTab] = useState("curation");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="border-b border-border px-6 py-4 flex justify-between items-center bg-background z-10 sticky top-0">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-none" data-testid="button-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="font-display text-2xl font-bold tracking-widest uppercase">
            Analysis & Curation
          </div>
        </div>
        <div className="flex gap-4">
          <Button 
            variant={activeTab === "curation" ? "default" : "outline"} 
            onClick={() => setActiveTab("curation")}
            className="rounded-none uppercase tracking-widest text-xs"
            data-testid="button-tab-curation"
          >
            Autonomous Curation
          </Button>
          <Button 
            variant={activeTab === "generation" ? "default" : "outline"} 
            onClick={() => setActiveTab("generation")}
            className="rounded-none uppercase tracking-widest text-xs"
            data-testid="button-tab-generation"
          >
            GPT Image Gen
          </Button>
        </div>
      </nav>

      <main className="flex-1 overflow-hidden flex">
        {activeTab === "curation" ? <CurationDashboard /> : <GenerationDashboard />}
      </main>
    </div>
  );
}

function CurationDashboard() {
  return (
    <div className="flex w-full h-[calc(100vh-73px)]">
      {/* Left Panel - Live Feed & Queue */}
      <div className="w-1/3 border-r border-border flex flex-col bg-muted/20 max-w-sm">
        <div className="p-4 border-b border-border bg-background flex justify-between items-center">
          <h2 className="font-serif text-xl">Live Operations</h2>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-green-500 font-bold">
            <Activity className="w-4 h-4" /> Active
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4 text-sm font-mono">
          <div className="bg-background border border-border p-3 space-y-2 relative overflow-hidden group hover:border-primary transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="text-muted-foreground text-xs">14:23:45</div>
            <div className="flex gap-2"><Search className="w-4 h-4 text-primary shrink-0" /> Searching: "cylinder seal ishtar"</div>
          </div>
          <div className="bg-background border border-border p-3 space-y-2 relative overflow-hidden group hover:border-primary transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <div className="text-muted-foreground text-xs">14:23:47</div>
            <div className="flex gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> Found 3 candidates (British Museum)</div>
          </div>
          <div className="bg-background border border-border p-3 space-y-2 relative overflow-hidden group hover:border-primary transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="text-muted-foreground text-xs">14:23:50</div>
            <div className="flex gap-2"><Activity className="w-4 h-4 text-blue-500 shrink-0" /> CLIP score: 0.82 (HIGH confidence)</div>
          </div>
          <div className="bg-background border border-border p-3 space-y-2 relative overflow-hidden group hover:border-primary transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
            <div className="text-muted-foreground text-xs">14:24:10</div>
            <div className="flex gap-2"><Sparkles className="w-4 h-4 text-yellow-500 shrink-0" /> Auto-tagged image15.png: [ishtar, gate]</div>
          </div>
        </div>
      </div>

      {/* Center Panel - Candidates */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-serif text-xl">Pending Approval (5)</h2>
          <Button variant="outline" size="sm" className="rounded-none uppercase tracking-widest text-xs border-primary hover:bg-primary hover:text-primary-foreground">
            Review All
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-8 space-y-8 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px]">
          <CandidateCard 
            id="#45" 
            title="Burney Relief (Queen of the Night)" 
            desc="Terracotta plaque showing the goddess Ishtar or Ereshkigal. Requires scale indicator and labels. Auto-detected overlays: Lion's paw feet, Owl companions."
            image="/images/artifact_mesopotamian.png"
            clip="0.87"
            safety="PASSED"
          />
          <CandidateCard 
            id="#47" 
            title="Geometric Krater" 
            desc="Large Greek vase used for mixing wine and water, decorated with geometric patterns. Diagram generation recommended for pattern mapping."
            image="/images/artifact_greek.png"
            clip="0.92"
            safety="PASSED"
          />
          <CandidateCard 
            id="#51" 
            title="Bronze Ding" 
            desc="Shang Dynasty ritual cauldron. Sourced via RWI Image Sourcing Integration. High fidelity."
            image="/images/artifact_china.png"
            clip="0.88"
            safety="PASSED"
          />
        </div>
      </div>

      {/* Right Panel - RWI Integration */}
      <div className="w-1/4 border-l border-border flex flex-col bg-muted/10 min-w-[300px]">
        <div className="p-4 border-b border-border">
          <h2 className="font-serif text-xl">Section Priority Queue</h2>
        </div>
        <div className="p-4 space-y-4 overflow-auto">
          <div className="border border-border bg-background p-4 flex justify-between items-center cursor-pointer hover:border-primary transition-colors group">
            <div>
              <div className="font-bold text-sm uppercase tracking-wider group-hover:text-primary transition-colors">Week I - All Sections</div>
              <div className="text-xs text-muted-foreground mt-1">16 artifacts missing</div>
            </div>
            <ArrowLeft className="w-4 h-4 rotate-90 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="border border-border bg-background p-4 flex justify-between items-center cursor-pointer hover:border-primary transition-colors group">
            <div>
              <div className="font-bold text-sm uppercase tracking-wider group-hover:text-primary transition-colors">Week II - A1 Hook</div>
              <div className="text-xs text-muted-foreground mt-1">2 artifacts missing</div>
            </div>
            <ArrowLeft className="w-4 h-4 rotate-90 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="border border-border bg-background p-4 flex justify-between items-center cursor-pointer hover:border-primary transition-colors group opacity-60">
            <div>
              <div className="font-bold text-sm uppercase tracking-wider">Week III - A3 Chain</div>
              <div className="text-xs text-muted-foreground mt-1">4 artifacts matched</div>
            </div>
            <Check className="w-4 h-4 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ id, title, desc, image, clip, safety }: any) {
  return (
    <div className="border border-border flex flex-col xl:flex-row gap-6 p-6 hover:border-primary transition-colors bg-background shadow-sm">
      <div className="w-full xl:w-1/3 aspect-[4/3] bg-muted relative overflow-hidden border border-border">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Artifact {id}</div>
            <h3 className="font-serif text-2xl leading-tight">{title}</h3>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 text-xs font-mono">CLIP: {clip}</span>
            <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-1 text-xs font-mono">SAFE: {safety}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1 max-w-2xl">{desc}</p>
        <div className="flex flex-wrap gap-4 mt-auto">
          <Button className="rounded-none uppercase tracking-widest text-xs bg-green-600 hover:bg-green-700 text-white border border-green-700" data-testid={`button-approve-${id}`}>
            <Check className="w-3 h-3 mr-2" /> Approve
          </Button>
          <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white" data-testid={`button-diagram-${id}`}>
            <Filter className="w-3 h-3 mr-2" /> Diagram
          </Button>
          <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs border-red-600 text-red-600 hover:bg-red-600 hover:text-white" data-testid={`button-reject-${id}`}>
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

function GenerationDashboard() {
  return (
    <div className="flex w-full h-[calc(100vh-73px)]">
      {/* Settings Panel */}
      <div className="w-1/3 min-w-[400px] border-r border-border bg-background overflow-auto">
        <div className="p-6 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="font-serif text-2xl">GPT-Image-2 Studio</h2>
          <p className="text-sm text-muted-foreground mt-2 font-mono">Model prompting & generation workflow</p>
        </div>
        
        <div className="p-6 space-y-10">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest flex items-center justify-between">
              Model Fidelity
              <span className="text-[10px] text-muted-foreground font-mono font-normal bg-muted px-2 py-1">gpt-image-2</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="rounded-none text-xs border-primary bg-primary text-primary-foreground hover:bg-primary/90">High</Button>
              <Button variant="outline" className="rounded-none text-xs">Medium</Button>
              <Button variant="outline" className="rounded-none text-xs">Low</Button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use <strong className="text-foreground">High</strong> for text-heavy images and photorealistic details. Use <strong className="text-foreground">Low</strong> for high-volume or latency-sensitive curation.
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest">Resolution</label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="rounded-none text-xs">1024x1024 (1:1)</Button>
              <Button variant="outline" className="rounded-none text-xs border-primary bg-primary/10 text-primary">1536x1024 (HD)</Button>
              <Button variant="outline" className="rounded-none text-xs">1024x1536 (Port)</Button>
              <Button variant="outline" className="rounded-none text-xs">2560x1440 (2K)</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <label className="text-xs font-bold uppercase tracking-widest">Structure + Goal Prompt</label>
              <span className="text-[10px] text-muted-foreground font-mono">1/5000</span>
            </div>
            <textarea 
              className="w-full h-40 bg-muted/30 border border-border p-4 text-sm font-mono resize-none focus:outline-none focus:border-primary focus:bg-background transition-colors leading-relaxed"
              placeholder="Background/scene -> subject -> key details -> constraints..."
              defaultValue={`Brutalist museum exhibition, photorealistic. \n\nA solitary marble bust centered on a concrete pedestal. Dramatic spotlighting casting harsh shadows. \n\nConstraints: No text, no watermarks. Preserve classical proportions. High-fidelity textures on marble.`}
            ></textarea>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Define background/scene first, then subject, key details, and explicit constraints.
            </p>
          </div>

          <Button className="w-full rounded-none uppercase tracking-widest h-14 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors" data-testid="button-generate">
            <Sparkles className="w-4 h-4 mr-2" /> Generate Asset
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 bg-muted/20 p-8 flex flex-col items-center justify-center relative bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px]">
        <div className="absolute top-6 right-6 flex gap-2">
          <Button variant="outline" size="icon" className="rounded-none bg-background hover:bg-muted" title="View as Image"><ImageIcon className="w-4 h-4"/></Button>
          <Button variant="outline" size="icon" className="rounded-none bg-background hover:bg-muted" title="View Geometry"><Box className="w-4 h-4"/></Button>
        </div>
        
        <div className="w-full max-w-4xl aspect-[16/9] border border-border flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden group shadow-2xl">
          {/* Mock background for generation preview */}
          <div className="absolute inset-0 bg-[url('/images/artifact_rome.png')] bg-cover bg-center opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
          
          <div className="z-10 text-center p-8 bg-background/95 backdrop-blur-sm border border-border max-w-md shadow-xl transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <h3 className="font-serif text-2xl text-foreground mb-3">Generation Ready</h3>
            <p className="text-sm leading-relaxed mb-6 font-mono text-muted-foreground">Output constrained to 1536x1024. Photorealistic lighting applied.</p>
            <div className="flex gap-4">
              <Button size="sm" className="flex-1 rounded-none uppercase tracking-widest text-xs">Save to Archive</Button>
              <Button size="sm" variant="outline" className="flex-1 rounded-none uppercase tracking-widest text-xs">Refine</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
