import { BaseNode } from "./BaseNode";

export function ThroughlineNode({ x, y }: { x?: number, y?: number }) {
  return (
    <BaseNode x={x} y={y} title="Philosophical Throughline">
      <div className="space-y-6">
        <h3 className="font-serif text-2xl leading-tight">Geometry as Eternal Evolution</h3>
        <p className="font-sans text-sm text-muted-foreground columns-1 md:columns-2 gap-6 leading-relaxed">
          The fundamental premise that geometry is not a static human invention, but an evolving structural language embedded in the fabric of existence. It traces a line from the atomic to the monumental.
          <br/><br/>
          By isolating these forms across civilizations, we reveal a unified morphological history. Form follows survival, then control, then expression.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="border border-border p-3 text-center">
            <div className="font-mono text-[10px] uppercase mb-2">Stage 1</div>
            <div className="font-serif">Atomic</div>
          </div>
          <div className="border border-border p-3 text-center">
            <div className="font-mono text-[10px] uppercase mb-2">Stage 2</div>
            <div className="font-serif">Structural</div>
          </div>
          <div className="border border-border p-3 text-center">
            <div className="font-mono text-[10px] uppercase mb-2">Stage 3</div>
            <div className="font-serif">Ornamental</div>
          </div>
        </div>
      </div>
    </BaseNode>
  );
}
