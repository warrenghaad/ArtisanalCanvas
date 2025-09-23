export interface Point {
  x: number;
  y: number;
}

export interface Line {
  start: Point;
  end: Point;
}

export interface DrawingState {
  horizonLine: number | null;
  vanishingPoints: Point[];
  constructionLines: Line[];
  userStrokes: Path2D[];
  currentTool: 'draw' | 'erase' | 'line' | 'guide';
  isDrawing: boolean;
}

export class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: DrawingState;
  private undoStack: DrawingState[] = [];
  private redoStack: DrawingState[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.state = {
      horizonLine: null,
      vanishingPoints: [],
      constructionLines: [],
      userStrokes: [],
      currentTool: 'draw',
      isDrawing: false,
    };
    this.setupCanvas();
  }

  private setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.drawGrid();
  }

  private drawGrid() {
    const { width, height } = this.canvas;
    const gridSize = 20;
    
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }
  }

  public setTool(tool: DrawingState['currentTool']) {
    this.state.currentTool = tool;
  }

  public setHorizonLine(y: number) {
    this.saveState();
    this.state.horizonLine = y;
    this.redraw();
  }

  public addVanishingPoint(point: Point) {
    this.saveState();
    this.state.vanishingPoints.push(point);
    this.redraw();
  }

  public addConstructionLine(line: Line) {
    this.saveState();
    this.state.constructionLines.push(line);
    this.redraw();
  }

  private saveState() {
    this.undoStack.push(JSON.parse(JSON.stringify(this.state)));
    this.redoStack = []; // Clear redo stack when new action is performed
    
    // Limit undo stack size
    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }
  }

  public undo() {
    if (this.undoStack.length > 0) {
      this.redoStack.push(JSON.parse(JSON.stringify(this.state)));
      this.state = this.undoStack.pop()!;
      this.redraw();
    }
  }

  public redo() {
    if (this.redoStack.length > 0) {
      this.undoStack.push(JSON.parse(JSON.stringify(this.state)));
      this.state = this.redoStack.pop()!;
      this.redraw();
    }
  }

  public clear() {
    this.saveState();
    this.state = {
      ...this.state,
      horizonLine: null,
      vanishingPoints: [],
      constructionLines: [],
      userStrokes: [],
    };
    this.redraw();
  }

  private redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    
    // Draw horizon line
    if (this.state.horizonLine !== null) {
      this.ctx.strokeStyle = 'hsl(213, 87%, 42%)';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([]);
      this.ctx.globalAlpha = 0.7;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.state.horizonLine);
      this.ctx.lineTo(this.canvas.width, this.state.horizonLine);
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }
    
    // Draw vanishing points
    this.state.vanishingPoints.forEach(vp => {
      this.ctx.fillStyle = 'hsl(213, 87%, 42%)';
      this.ctx.beginPath();
      this.ctx.arc(vp.x, vp.y, 6, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // Draw construction lines
    this.ctx.strokeStyle = 'hsl(213, 87%, 42%)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([4, 4]);
    this.ctx.globalAlpha = 0.6;
    this.state.constructionLines.forEach(line => {
      this.ctx.beginPath();
      this.ctx.moveTo(line.start.x, line.start.y);
      this.ctx.lineTo(line.end.x, line.end.y);
      this.ctx.stroke();
    });
    this.ctx.globalAlpha = 1;
    this.ctx.setLineDash([]);
    
    // Draw user strokes
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.state.userStrokes.forEach(stroke => {
      this.ctx.stroke(stroke);
    });
  }

  public getImageData(): string {
    return this.canvas.toDataURL('image/png');
  }

  public getState(): DrawingState {
    return { ...this.state };
  }

  // Mouse/touch event handlers
  public handlePointerDown(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (this.state.currentTool === 'guide') {
      if (!this.state.horizonLine) {
        this.setHorizonLine(y);
      } else {
        this.addVanishingPoint({ x, y });
      }
    } else if (this.state.currentTool === 'draw') {
      this.state.isDrawing = true;
      const path = new Path2D();
      path.moveTo(x, y);
      this.state.userStrokes.push(path);
    }
  }

  public handlePointerMove(event: PointerEvent) {
    if (!this.state.isDrawing || this.state.currentTool !== 'draw') return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const currentStroke = this.state.userStrokes[this.state.userStrokes.length - 1];
    if (currentStroke) {
      currentStroke.lineTo(x, y);
      this.redraw();
    }
  }

  public handlePointerUp() {
    if (this.state.isDrawing) {
      this.saveState();
      this.state.isDrawing = false;
    }
  }
}

export function calculatePerspectiveScale(
  distanceFromViewer: number,
  baseSize: number,
  viewerDistance: number = 100
): number {
  return baseSize * (viewerDistance / (viewerDistance + distanceFromViewer));
}

export function findLineIntersection(line1: Line, line2: Line): Point | null {
  const { start: p1, end: p2 } = line1;
  const { start: p3, end: p4 } = line2;
  
  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denom) < 0.001) return null; // Lines are parallel
  
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y)
  };
}
