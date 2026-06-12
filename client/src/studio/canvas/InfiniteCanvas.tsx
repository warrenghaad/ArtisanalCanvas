import { useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { PrismCube } from '../../studio/prism/PrismCube';
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
      className="fixed inset-0 w-full h-full overflow-hidden cursor-move dark"
      style={{
        backgroundColor: '#050A15', // Very dark blue
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
        backgroundSize: '60px 60px',
        color: 'white'
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
      </animated.div>
      
      {/* 3D Prism Context Selector */}
      <div className="pointer-events-none absolute inset-0 z-50">
        <PrismCube />
      </div>
      
      {/* Absolute HUD */}
      <div className="fixed top-6 left-6 font-mono text-[10px] text-white/50 uppercase tracking-widest pointer-events-none z-50">
        Project EUCLID // Spatial Room
      </div>
    </div>
  );
}
