import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BlockState, DebrisState, GameStatus } from '../types';
import { BLOCK_HEIGHT, COLORS, GAME_SPEED_BASE, GAME_SPEED_INCREMENT, INITIAL_BLOCK_WIDTH } from '../constants';

interface StackGameProps {
  status: GameStatus;
  onPlaceBlock: (success: boolean, rewardMultiplier: number) => void;
  onGameOver: () => void;
  level: number;
}

const StackGame: React.FC<StackGameProps> = ({ status, onPlaceBlock, onGameOver, level }) => {
  const [stack, setStack] = useState<BlockState[]>([]);
  const [debris, setDebris] = useState<DebrisState[]>([]);
  
  // Moving block state (controlled by animation frame)
  const [movingBlock, setMovingBlock] = useState<{ width: number; left: number; direction: 1 | -1; speed: number }>({
    width: INITIAL_BLOCK_WIDTH,
    left: 0,
    direction: 1,
    speed: GAME_SPEED_BASE,
  });

  const requestRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize game
  useEffect(() => {
    if (status === 'playing' && stack.length === 0) {
      // Start with base block
      setStack([{
        id: 0,
        width: INITIAL_BLOCK_WIDTH,
        left: (100 - INITIAL_BLOCK_WIDTH) / 2, // Center it
        bottom: 0,
        color: COLORS[0],
      }]);
      setMovingBlock({
        width: INITIAL_BLOCK_WIDTH,
        left: 0,
        direction: 1,
        speed: GAME_SPEED_BASE,
      });
      setDebris([]);
    } else if (status === 'idle') {
      setStack([]);
      setDebris([]);
    }
  }, [status, stack.length]);

  // Game Loop
  const animate = useCallback(() => {
    if (status !== 'playing') return;

    setMovingBlock((prev) => {
      let newLeft = prev.left + prev.speed * prev.direction;
      let newDirection = prev.direction;

      // Bounce off walls (0 to 100 - width)
      if (newLeft <= 0) {
        newLeft = 0;
        newDirection = 1;
      } else if (newLeft >= 100 - prev.width) {
        newLeft = 100 - prev.width;
        newDirection = -1;
      }

      return {
        ...prev,
        left: newLeft,
        direction: newDirection,
      };
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [status]);

  useEffect(() => {
    if (status === 'playing') {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [status, animate]);

  // Handle User Input (Place Block)
  const handlePlaceBlock = () => {
    if (status !== 'playing' || stack.length === 0) return;

    const previousBlock = stack[stack.length - 1];
    const currentLeft = movingBlock.left;
    const currentWidth = movingBlock.width;
    
    // Calculate overlap
    const prevLeft = previousBlock.left;
    const prevRight = previousBlock.left + previousBlock.width;
    const currRight = currentLeft + currentWidth;

    const overlapLeft = Math.max(prevLeft, currentLeft);
    const overlapRight = Math.min(prevRight, currRight);
    const overlapWidth = overlapRight - overlapLeft;

    if (overlapWidth <= 0) {
      // Missed completely
      onGameOver();
    } else {
      // Hit!
      const newBlock: BlockState = {
        id: stack.length,
        width: overlapWidth,
        left: overlapLeft,
        bottom: stack.length * BLOCK_HEIGHT,
        color: COLORS[stack.length % COLORS.length],
      };

      // Create Debris (the part that got chopped off)
      let newDebris: DebrisState | null = null;
      if (currentLeft < prevLeft) {
        // Chopped off left side
        newDebris = {
          id: Date.now(),
          width: prevLeft - currentLeft,
          left: currentLeft,
          bottom: stack.length * BLOCK_HEIGHT,
          color: COLORS[stack.length % COLORS.length],
          rotation: Math.random() * 30 - 15,
          velocity: { x: -2, y: 5 },
        };
      } else if (currRight > prevRight) {
        // Chopped off right side
        newDebris = {
          id: Date.now(),
          width: currRight - prevRight,
          left: prevRight,
          bottom: stack.length * BLOCK_HEIGHT,
          color: COLORS[stack.length % COLORS.length],
          rotation: Math.random() * 30 - 15,
          velocity: { x: 2, y: 5 },
        };
      }

      if (newDebris) {
        setDebris(prev => [...prev, newDebris!]);
      }

      setStack(prev => [...prev, newBlock]);
      
      // Setup next moving block
      setMovingBlock({
        width: overlapWidth,
        left: 0, // Reset to start
        direction: 1,
        speed: GAME_SPEED_BASE + (stack.length * GAME_SPEED_INCREMENT),
      });

      onPlaceBlock(true, stack.length);
    }
  };

  // Cleanup Debris over time (simple effect)
  useEffect(() => {
    const interval = setInterval(() => {
      setDebris(prev => prev.filter(d => d.bottom > -100).map(d => ({
        ...d,
        bottom: d.bottom - d.velocity.y,
        left: d.left + d.velocity.x,
        rotation: d.rotation + 5,
        velocity: { ...d.velocity, y: d.velocity.y + 0.5 } // Gravity
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Calculate Camera Offset to keep stack in view
  // We want the current moving block to be around 60% up the screen
  const cameraY = Math.max(0, (stack.length * BLOCK_HEIGHT) - 300);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-slate-900 overflow-hidden cursor-pointer touch-none select-none"
      onClick={handlePlaceBlock}
      onPointerDown={handlePlaceBlock} // Better for mobile response
    >
      {/* Background Grid Effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
            backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: `translateY(${-cameraY % 40}px)`
        }}
      />

      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${cameraY}px)` }}
      >
        {/* Render Stack */}
        {stack.map((block) => (
          <div
            key={block.id}
            className="absolute shadow-lg border-t border-white/20"
            style={{
              width: `${block.width}%`,
              left: `${block.left}%`,
              bottom: `${block.bottom}px`,
              height: `${BLOCK_HEIGHT}px`,
              backgroundColor: block.color,
              boxShadow: `0 10px 15px -3px ${block.color}66`
            }}
          />
        ))}

        {/* Render Debris */}
        {debris.map((d) => (
          <div
            key={d.id}
            className="absolute opacity-80"
            style={{
              width: `${d.width}%`,
              left: `${d.left}%`,
              bottom: `${d.bottom}px`,
              height: `${BLOCK_HEIGHT}px`,
              backgroundColor: d.color,
              transform: `rotate(${d.rotation}deg)`,
            }}
          />
        ))}

        {/* Render Moving Block */}
        {status === 'playing' && (
          <div
            className="absolute shadow-[0_0_20px_rgba(255,255,255,0.3)] border-t border-white/40 z-10"
            style={{
              width: `${movingBlock.width}%`,
              left: `${movingBlock.left}%`,
              bottom: `${stack.length * BLOCK_HEIGHT}px`,
              height: `${BLOCK_HEIGHT}px`,
              backgroundColor: COLORS[stack.length % COLORS.length],
            }}
          >
            {/* Inner glow effect for active block */}
            <div className="w-full h-full bg-white/10 animate-pulse" />
          </div>
        )}
      </div>

      {/* Start Platform (Floor) */}
      <div 
        className="absolute bottom-[-50px] left-0 w-full h-[50px] bg-slate-800 border-t border-slate-700"
        style={{ transform: `translateY(${cameraY}px)` }}
      />
      
      {/* Tap hint */}
      {status === 'playing' && stack.length === 1 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/50 text-2xl font-bold animate-ping pointer-events-none">
          TAP
        </div>
      )}
    </div>
  );
};

export default StackGame;
