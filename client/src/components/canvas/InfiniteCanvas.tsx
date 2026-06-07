import { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { CentralPanel } from './panels/CentralPanel';

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
      className="fixed inset-0 w-full h-full text-foreground overflow-hidden cursor-move"
      style={{
        backgroundColor: '#050A15', // Very dark blue
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
        backgroundSize: '60px 60px'
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
        <div className="absolute inset-0 relative flex items-center justify-center pointer-events-none">
          {/* Main geometry visualization goes here */}
          <div className="relative w-full h-full max-w-4xl max-h-[800px] flex items-center justify-center opacity-80">
            {/* Geometric forms */}
            <svg width="600" height="600" viewBox="0 0 600 600" className="absolute">
              <circle cx="300" cy="300" r="250" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className="text-primary/30" />
              <rect x="150" y="150" width="300" height="300" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/40 animate-[spin_60s_linear_infinite]" />
              <polygon points="300,50 550,483 50,483" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/50 animate-[spin_40s_linear_infinite_reverse]" style={{ transformOrigin: '300px 338px' }} />
              
              {/* Connecting lines */}
              <line x1="300" y1="50" x2="300" y2="550" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
              <line x1="50" y1="300" x2="550" y2="300" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
              
              {/* Center point */}
              <circle cx="300" cy="300" r="4" fill="currentColor" className="text-primary" />
              
              {/* Data points */}
              <circle cx="150" cy="150" r="3" fill="currentColor" className="text-primary/80" />
              <circle cx="450" cy="150" r="3" fill="currentColor" className="text-primary/80" />
              <circle cx="150" cy="450" r="3" fill="currentColor" className="text-primary/80" />
              <circle cx="450" cy="450" r="3" fill="currentColor" className="text-primary/80" />
              <circle cx="300" cy="50" r="3" fill="currentColor" className="text-primary/80" />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 mt-12 mix-blend-screen">
              <h1 className="text-7xl font-display font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">MORPHOLOGY</h1>
              <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary/80">Monumental Brutalism & Geometric Forms</p>
            </div>
          </div>
        </div>
      </animated.div>
      
      {/* Side Panel for Tools */}
      <CentralPanel />
      
      {/* Absolute HUD */}
      <div className="fixed bottom-6 left-6 font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest pointer-events-none">
        Project EUCLID // Canvas Coordinates
      </div>
    </div>
  );
}
