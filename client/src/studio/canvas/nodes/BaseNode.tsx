import { ReactNode } from "react";

interface BaseNodeProps {
  x?: number;
  y?: number;
  title: string;
  children: ReactNode;
  width?: number | string;
  inline?: boolean;
}

export function BaseNode({ x = 0, y = 0, title, children, width = "100%", inline = true }: BaseNodeProps) {
  return (
    <div 
      className={`border border-border bg-background/95 backdrop-blur shadow-2xl p-6 ${inline ? 'relative w-full h-full flex flex-col' : 'absolute'}`}
      style={inline ? {} : {
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
    >
      <div className="border-b border-border pb-4 mb-4 shrink-0">
        <h2 className="font-display uppercase tracking-widest text-lg">{title}</h2>
      </div>
      <div className="font-sans text-sm text-muted-foreground flex-1 overflow-auto pr-2">
        {children}
      </div>
    </div>
  );
}
