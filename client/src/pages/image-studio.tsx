import { useState, type ReactNode } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Boxes, Wand2, ListChecks, Loader2 } from "lucide-react";

// Minimal shapes of the swarm response (see server/studio/swarm.ts).
interface ManifestPrimitive { name: string; type: string; role: string; category: string }
interface PrimitiveManifest {
  subject: string; learningGoal: string; level: number; skillFamily?: string;
  primitives: ManifestPrimitive[]; axes: string[]; planes: string[];
  valueColorStructure: string[]; reusableCellsToSave: string[]; imageOutputs: string[];
}
interface ImagePromptSpec { purpose: string; prompt: string }
interface GeneratedImageRecord { purpose: string; prompt: string; imagePath: string | null; model: string; generated: boolean; error?: string }
interface NewCell { name: string; primitiveType: string; category: string; status?: string }
interface GraphEdgeView { from: string; to: string; edgeType: string }
interface PracticeCard { title: string; goal: string; steps: string[]; checkpoints: string[] }
interface Critique { score: number; critique: string; canonStatus: string; basedOnImage: boolean; reusable: boolean; tooDecorative: boolean }
interface StudioResult {
  primitiveManifest: PrimitiveManifest;
  imagePrompts: ImagePromptSpec[];
  generatedImages: GeneratedImageRecord[];
  newPrimitiveCells: NewCell[];
  graphEdges: GraphEdgeView[];
  practiceCard: PracticeCard;
  critique: Critique;
  status: string;
  persisted?: boolean;
  conceptId?: string | null;
}

const ALL_OUTPUTS = [
  "construction_plate",
  "ghosted_overlay",
  "finished_reference",
  "practice_card",
  "expression_sheet",
  "cel_sheet",
] as const;

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">{children}</CardContent>
    </Card>
  );
}

export default function ImageStudio() {
  const [subject, setSubject] = useState("skeptical face in three-quarter view");
  const [learningGoal, setLearningGoal] = useState("facial expression through primitive construction");
  const [level, setLevel] = useState("5");
  const [style, setStyle] = useState("atelier worksheet with ghosted primitive overlays");
  const [outputs, setOutputs] = useState<string[]>([
    "construction_plate",
    "ghosted_overlay",
    "finished_reference",
    "practice_card",
  ]);
  const [result, setResult] = useState<StudioResult | null>(null);

  function toggleOutput(o: string) {
    setOutputs((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));
  }

  function body(generateImages: boolean) {
    return {
      subject,
      learningGoal,
      level: Number(level),
      style,
      outputs,
      generateImages,
    };
  }

  const plan = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/studio/images/plan", body(false));
      return (await res.json()) as StudioResult;
    },
    onSuccess: setResult,
  });

  const swarm = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/studio/images/generate-with-swarm", body(true));
      return (await res.json()) as StudioResult;
    },
    onSuccess: setResult,
  });

  const busy = plan.isPending || swarm.isPending;
  const manifest = result?.primitiveManifest;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Wand2 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold leading-tight">Image Studio</h1>
              <p className="text-xs text-muted-foreground">
                Decompose → prompt → generate → critique → save reusable cells
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/primitive-library">
              <Button variant="outline" size="sm" data-testid="link-primitive-library">
                <Boxes className="mr-1.5 h-4 w-4" /> Primitive Library
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="link-home">
                <Home className="mr-1.5 h-4 w-4" /> Academy
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
        {/* Input column */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">New lesson request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} data-testid="input-subject" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="goal">Learning goal</Label>
                <Input id="goal" value={learningGoal} onChange={(e) => setLearningGoal(e.target.value)} data-testid="input-goal" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="level">Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level" data-testid="select-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((n) => (
                      <SelectItem key={n} value={n}>
                        Level {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="style">Style</Label>
                <Input id="style" value={style} onChange={(e) => setStyle(e.target.value)} data-testid="input-style" />
              </div>
              <div className="space-y-1.5">
                <Label>Outputs</Label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_OUTPUTS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => toggleOutput(o)}
                      data-testid={`output-${o}`}
                      className="focus:outline-none"
                    >
                      <Badge variant={outputs.includes(o) ? "default" : "outline"} className="cursor-pointer capitalize">
                        {o.replace(/_/g, " ")}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Button onClick={() => plan.mutate()} disabled={busy} variant="secondary" data-testid="button-plan">
                  {plan.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <ListChecks className="mr-1.5 h-4 w-4" />}
                  Generate plan (no image)
                </Button>
                <Button onClick={() => swarm.mutate()} disabled={busy} data-testid="button-swarm">
                  {swarm.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Wand2 className="mr-1.5 h-4 w-4" />}
                  Run full swarm
                </Button>
              </div>
              {(plan.error || swarm.error) && (
                <p className="text-xs text-destructive">
                  {(plan.error as Error)?.message || (swarm.error as Error)?.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Output column */}
        <div className="space-y-4">
          {!result && (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                Fill in a subject and run the plan or the full swarm. The crew describes the
                primitive parts before any image is generated.
              </CardContent>
            </Card>
          )}

          {result && manifest && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">Level {manifest.level}</Badge>
                {manifest.skillFamily && <Badge variant="outline">{manifest.skillFamily}</Badge>}
                <Badge>{result.status}</Badge>
                {result.persisted !== undefined && (
                  <Badge variant={result.persisted ? "secondary" : "outline"}>
                    {result.persisted ? "saved to DB" : "not persisted"}
                  </Badge>
                )}
              </div>

              <Panel title="Primitive manifest">
                <div className="space-y-3">
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {manifest.primitives.map((p, i) => (
                      <div key={i} className="rounded-md border px-2.5 py-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{p.name}</span>
                          <Badge variant="outline" className="text-xs capitalize">{p.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{p.type} — {p.role}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground"><strong>Axes:</strong> {manifest.axes.join(", ")}</p>
                  <p className="text-xs text-muted-foreground"><strong>Value/color:</strong> {manifest.valueColorStructure.join(", ")}</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs font-medium text-muted-foreground">Save cells:</span>
                    {manifest.reusableCellsToSave.map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </div>
              </Panel>

              <Panel title="Image prompts">
                <div className="space-y-2">
                  {result.imagePrompts.map((p, i) => (
                    <div key={i}>
                      <Badge variant="outline" className="mb-1 capitalize">{p.purpose.replace(/_/g, " ")}</Badge>
                      <p className="rounded-md bg-muted px-2.5 py-1.5 font-mono text-xs">{p.prompt}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              {result.generatedImages.some((g) => g.generated || g.error) && (
                <Panel title="Generated images">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {result.generatedImages.map((g, i) => (
                      <div key={i} className="space-y-1">
                        <Badge variant="outline" className="capitalize">{g.purpose.replace(/_/g, " ")}</Badge>
                        {g.generated && g.imagePath?.startsWith("assets/") ? (
                          <img src={`/${g.imagePath}`} alt={g.purpose} className="w-full rounded-md border" />
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            {g.error ? `Error: ${g.error}` : "Not generated (set OPENAI_API_KEY to render)."}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Panel>
              )}

              <Panel title={`Reusable cells (${result.newPrimitiveCells.length})`}>
                <div className="flex flex-wrap gap-1.5">
                  {result.newPrimitiveCells.map((c, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {c.name} <span className="ml-1 opacity-60">{c.category}</span>
                    </Badge>
                  ))}
                </div>
              </Panel>

              <div className="grid gap-4 md:grid-cols-2">
                <Panel title="Practice card">
                  <p className="font-medium">{result.practiceCard.title}</p>
                  <p className="mb-2 text-xs text-muted-foreground">{result.practiceCard.goal}</p>
                  <ol className="list-decimal space-y-0.5 pl-4 text-xs text-muted-foreground">
                    {result.practiceCard.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </Panel>

                <Panel title="Critique">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge>Score {result.critique.score}/5</Badge>
                    <Badge variant="outline">{result.critique.canonStatus}</Badge>
                    {!result.critique.basedOnImage && (
                      <Badge variant="outline" className="text-xs">not vision-verified</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{result.critique.critique}</p>
                </Panel>
              </div>

              <Panel title={`Graph edges (${result.graphEdges.length})`}>
                <div className="space-y-1 font-mono text-xs text-muted-foreground">
                  {result.graphEdges.slice(0, 12).map((e, i) => (
                    <div key={i}>
                      {e.from} <span className="text-primary">—{e.edgeType}→</span> {e.to}
                    </div>
                  ))}
                  {result.graphEdges.length > 12 && <div>…{result.graphEdges.length - 12} more</div>}
                </div>
              </Panel>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
