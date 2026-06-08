import { useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { PrismCube } from '../../studio/prism/PrismCube';
import { DockContainer } from '../../studio/dock/DockContainer';
import InteractiveGeometryResearchEngine from './InteractiveGeometryResearchEngine';
import { useStudioStore } from '../../studio/state/useStudioStore';

export default function InfiniteCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { prismContext } = useStudioStore();
  
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
      className="fixed inset-0 w-full h-full text-foreground overflow-hidden cursor-move"
      style={{
        backgroundColor: '#050A15', // Very dark blue
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
        backgroundSize: '60px 60px'
      }}
    >
      {/* 3D Engine is placed underneath the UI */}
      <InteractiveGeometryResearchEngine context={prismContext} />

      <animated.div
        style={{
          x,
          y,
          scale,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none' // Allow clicks to pass through to the 3D canvas
        }}
      >
        <div className="absolute inset-0 relative flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full max-w-4xl max-h-[800px] flex items-center justify-center opacity-80">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 mt-12 mix-blend-screen pointer-events-none">
              <h1 className="text-7xl font-display font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">MORPHOLOGY</h1>
              <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary/80">Monumental Brutalism & Geometric Forms</p>
            </div>
          </div>
        </div>
      </animated.div>
      
      {/* 3D Prism Context Selector */}
      <div className="pointer-events-none absolute inset-0 z-50">
        <PrismCube />
        {/* Bottom Dock Tray */}
        <DockContainer />
      </div>
      
      {/* Absolute HUD */}
      <div className="fixed top-6 left-6 font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest pointer-events-none z-50">
        Project EUCLID // Spatial Room
      </div>
    </div>
  );
}
