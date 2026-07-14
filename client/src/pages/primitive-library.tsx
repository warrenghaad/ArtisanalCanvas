import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { PrimitiveCell } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Boxes, Sparkles, User, Shapes, Image as ImageIcon, Layers } from "lucide-react";

// The library priority ladder: geometric primitives lead every drawing, then
// sacred/aesthetic geometry, then figure specifics, then everything else.
const CATEGORIES = [
  { key: "all", label: "All", icon: Layers },
  { key: "geometric", label: "Geometric", icon: Boxes },
  { key: "sacred", label: "Sacred", icon: Sparkles },
  { key: "figure", label: "Figure", icon: User },
  { key: "other", label: "Other", icon: Shapes },
] as const;

const STATUS_TONE: Record<string, string> = {
  canon: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  reviewed: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  candidate: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  extracted: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

function CellCard({ cell }: { cell: PrimitiveCell }) {
  const steps = asStringArray(cell.constructionSteps);
  const reuse = asStringArray(cell.reuseCases);
  return (
    <Card className="flex flex-col" data-testid={`primitive-card-${cell.name}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{cell.name}</CardTitle>
          <Badge variant="secondary" className={STATUS_TONE[cell.status ?? ""] ?? ""}>
            {cell.status}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Badge variant="outline">{cell.primitiveType}</Badge>
          <Badge variant="outline" className="capitalize">{cell.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm">
        {cell.description && <p className="text-muted-foreground">{cell.description}</p>}
        {steps.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Construction
            </p>
            <ol className="list-decimal space-y-0.5 pl-4 text-muted-foreground">
              {steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        )}
        {cell.reusablePrompt && (
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Prompt fragment
            </p>
            <p className="rounded-md bg-muted px-2 py-1.5 font-mono text-xs">{cell.reusablePrompt}</p>
          </div>
        )}
        {reuse.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {reuse.map((r, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {r}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PrimitiveLibrary() {
  const [category, setCategory] = useState<string>("all");
  const { data, isLoading, error } = useQuery<PrimitiveCell[]>({
    queryKey: ["/api/studio/primitives"],
  });

  const cells = useMemo(() => {
    const list = data ?? [];
    return category === "all" ? list : list.filter((c) => c.category === category);
  }, [data, category]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    (data ?? []).forEach((c) => {
      map[c.category] = (map[c.category] ?? 0) + 1;
    });
    return map;
  }, [data]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Boxes className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold leading-tight">Primitive Library</h1>
              <p className="text-xs text-muted-foreground">
                Reusable primitive cells — the studio's animation-cel library
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/image-studio">
              <Button variant="outline" size="sm" data-testid="link-image-studio">
                <ImageIcon className="mr-1.5 h-4 w-4" /> Image Studio
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

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={category === key ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(key)}
              data-testid={`filter-${key}`}
            >
              <Icon className="mr-1.5 h-4 w-4" />
              {label}
              {key !== "all" && counts[key] ? (
                <span className="ml-1.5 text-xs opacity-70">{counts[key]}</span>
              ) : null}
            </Button>
          ))}
        </div>

        {isLoading && <p className="text-muted-foreground">Loading primitive cells…</p>}
        {error && (
          <p className="text-destructive">
            Failed to load primitives. Is the server running with a database configured?
          </p>
        )}
        {!isLoading && !error && cells.length === 0 && (
          <p className="text-muted-foreground">
            No primitive cells yet. Run a lesson in the Image Studio to grow the library.
          </p>
        )}

        <ScrollArea className="h-[calc(100vh-13rem)]">
          <div className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3">
            {cells.map((cell) => (
              <CellCard key={cell.id} cell={cell} />
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
