import { ReactNode } from "react";

interface BaseNodeProps {
  x: number;
  y: number;
  title: string;
  children: ReactNode;
  width?: number;
}

export function BaseNode({ x, y, title, children, width = 400 }: BaseNodeProps) {
  return (
    <div 
      className="absolute border border-border bg-background/95 backdrop-blur shadow-2xl p-6"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width: `${width}px`,
      }}
    >
      <div className="border-b border-border pb-4 mb-4">
        <h2 className="font-display uppercase tracking-widest text-lg">{title}</h2>
      </div>
      <div className="font-sans text-sm text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
