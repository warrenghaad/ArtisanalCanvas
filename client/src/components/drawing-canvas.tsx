import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DrawingCanvas } from '@/lib/drawing-utils';
import { Undo, Redo, Play, Square, Circle, Ruler, Eraser, Pencil, Check } from 'lucide-react';

interface DrawingCanvasComponentProps {
  exerciseId: string;
  onSubmit: (imageData: string) => void;
  className?: string;
}

export function DrawingCanvasComponent({ exerciseId, onSubmit, className }: DrawingCanvasComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<DrawingCanvas | null>(null);
  const [currentTool, setCurrentTool] = useState<'draw' | 'erase' | 'line' | 'guide'>('draw');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (canvasRef.current && !drawingCanvasRef.current) {
      drawingCanvasRef.current = new DrawingCanvas(canvasRef.current);
      
      // Set up event listeners
      const canvas = canvasRef.current;
      const drawingCanvas = drawingCanvasRef.current;
      
      const handlePointerDown = (e: PointerEvent) => {
        e.preventDefault();
        drawingCanvas.handlePointerDown(e);
        updateUndoRedoState();
      };
      
      const handlePointerMove = (e: PointerEvent) => {
        e.preventDefault();
        drawingCanvas.handlePointerMove(e);
      };
      
      const handlePointerUp = () => {
        drawingCanvas.handlePointerUp();
        updateUndoRedoState();
      };
      
      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerup', handlePointerUp);
      canvas.addEventListener('pointerleave', handlePointerUp);
      
      return () => {
        canvas.removeEventListener('pointerdown', handlePointerDown);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerup', handlePointerUp);
        canvas.removeEventListener('pointerleave', handlePointerUp);
      };
    }
  }, []);

  useEffect(() => {
    if (drawingCanvasRef.current) {
      drawingCanvasRef.current.setTool(currentTool);
    }
  }, [currentTool]);

  const updateUndoRedoState = () => {
    // In a real implementation, we'd check the drawing canvas's undo/redo stacks
    setCanUndo(true);
    setCanRedo(false);
  };

  const handleUndo = () => {
    if (drawingCanvasRef.current) {
      drawingCanvasRef.current.undo();
      updateUndoRedoState();
    }
  };

  const handleRedo = () => {
    if (drawingCanvasRef.current) {
      drawingCanvasRef.current.redo();
      updateUndoRedoState();
    }
  };

  const handleSubmit = () => {
    if (drawingCanvasRef.current) {
      const imageData = drawingCanvasRef.current.getImageData();
      // Remove the data URL prefix to get just the base64 data
      const base64Data = imageData.split(',')[1];
      onSubmit(base64Data);
    }
  };

  const tools = [
    { id: 'draw', icon: Pencil, label: 'Draw', active: currentTool === 'draw' },
    { id: 'erase', icon: Eraser, label: 'Erase', active: currentTool === 'erase' },
    { id: 'line', icon: Ruler, label: 'Line', active: currentTool === 'line' },
    { id: 'guide', icon: Circle, label: 'Guide', active: currentTool === 'guide' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Canvas Toolbar */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold" data-testid="exercise-title">Exercise: {exerciseId}</h2>
            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs" data-testid="exercise-status">
              Active
            </span>
          </div>
          
          {/* Drawing Tools */}
          <div className="flex items-center space-x-2">
            <div className="flex bg-muted rounded-lg p-1">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant={tool.active ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentTool(tool.id as any)}
                    className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    data-testid={`tool-${tool.id}`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {tool.label}
                  </Button>
                );
              })}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
                data-testid="button-undo"
              >
                <Undo className="w-4 h-4 mr-1" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
                data-testid="button-redo"
              >
                <Redo className="w-4 h-4 mr-1" />
                Redo
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-submit"
              >
                <Check className="w-4 h-4 mr-1" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-background p-6">
        <div className="h-full bg-card border border-border rounded-lg relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] cursor-crosshair"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
            data-testid="drawing-canvas"
          />
          
          {/* Instruction overlay */}
          <div className="absolute top-4 left-4 bg-card/90 border border-border rounded-lg p-3 max-w-xs" data-testid="instruction-overlay">
            <div className="text-sm font-medium mb-1">Next Step:</div>
            <div className="text-sm text-muted-foreground">
              Use the guide tool to set horizon line and vanishing points. Then draw your perspective construction.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
