import { useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { CodexNode } from './nodes/CodexNode';
import { RwiNode } from './nodes/RwiNode';
import { DamNode } from './nodes/DamNode';
import { ThroughlineNode } from './nodes/ThroughlineNode';
import { AdminNode } from './nodes/AdminNode';
import { DataEngineNode } from './nodes/DataEngineNode';

export default function InfiniteCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { mass: 1, tension: 280, friction: 60 }
  }));

  useGesture(
    {
      onDrag: ({ offset: [dx, dy], memo = [x.get(), y.get()] }) => {
        api.start({ x: memo[0] + dx, y: memo[1] + dy });
        return memo;
      },
      onWheel: ({ event, offset: [, dy], memo = scale.get() }) => {
        event.preventDefault();
        const newScale = Math.max(0.1, Math.min(memo - dy * 0.005, 5));
        api.start({ scale: newScale });
        return memo;
      }
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
      drag: { filterTaps: true }
    }
  );

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-background text-foreground overflow-hidden cursor-move"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}
    >
      <animated.div
        style={{
          x,
          y,
          scale,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%'
        }}
      >
        <div className="absolute inset-0 relative">
          <ThroughlineNode x={-800} y={-400} />
          <CodexNode x={-200} y={-600} />
          <DataEngineNode x={400} y={-500} />
          <DamNode x={-600} y={100} />
          <RwiNode x={0} y={200} />
          <AdminNode x={600} y={150} />
        </div>
      </animated.div>
      
      {/* Absolute HUD */}
      <div className="fixed bottom-6 left-6 font-mono text-[10px] text-muted-foreground uppercase tracking-widest pointer-events-none">
        Project EUCLID // Canvas Coordinates
      </div>
    </div>
  );
}
