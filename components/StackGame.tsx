
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatus, Difficulty } from '../types';
import { BLOCK_HEIGHT, COLORS, DIFFICULTY_SETTINGS } from '../constants';

interface StackGameProps {
  status: GameStatus;
  difficulty: Difficulty;
  onPlaceBlock: (success: boolean, currentLevel: number) => void;
  onGameOver: () => void;
  level: number;
}

const StackGame: React.FC<StackGameProps> = ({ status, difficulty, onPlaceBlock, onGameOver, level }) => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const [movingBlock, setMovingBlock] = useState({
    width: settings.initialWidth,
    left: 0,
    direction: 1,
    speed: settings.speedBase,
  });

  const basePlatform = {
    width: settings.initialWidth,
    left: (100 - settings.initialWidth) / 2,
  };

  const requestRef = useRef<number>();

  const animate = useCallback(() => {
    if (status !== 'playing') return;

    setMovingBlock((prev) => {
      let newLeft = prev.left + prev.speed * prev.direction;
      let newDirection = prev.direction;

      if (newLeft <= 0) {
        newLeft = 0;
        newDirection = 1;
      } else if (newLeft >= 100 - prev.width) {
        newLeft = 100 - prev.width;
        newDirection = -1;
      }

      return { ...prev, left: newLeft, direction: newDirection };
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [status]);

  useEffect(() => {
    if (status === 'playing') {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [status, animate]);

  // Update speed when level changes
  useEffect(() => {
    if (status === 'playing') {
      setMovingBlock(prev => ({
        ...prev,
        speed: settings.speedBase + (level * settings.speedIncrement)
      }));
    }
  }, [level, status, settings.speedBase, settings.speedIncrement]);

  const handleAction = (e?: React.PointerEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (status !== 'playing') return;

    const currentLeft = movingBlock.left;
    const currentWidth = movingBlock.width;
    
    const prevLeft = basePlatform.left;
    const prevRight = basePlatform.left + basePlatform.width;
    const currRight = currentLeft + currentWidth;

    const overlapLeft = Math.max(prevLeft, currentLeft);
    const overlapRight = Math.min(prevRight, currRight);
    const overlapWidth = overlapRight - overlapLeft;

    // In the new concept, we win if there is ANY overlap, 
    // but the user's requirement "If you place a bet, you win" suggests high tolerance 
    // or just that the platform doesn't shrink. 
    // We'll keep a small failure condition if they miss completely to keep it a game.
    if (overlapWidth <= 0) {
      onGameOver();
    } else {
      onPlaceBlock(true, level + 1);
      // We don't shrink the block anymore as per "do not stack them", 
      // just keep it moving but faster.
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-slate-900 overflow-hidden cursor-pointer touch-none select-none flex items-center justify-center"
      onPointerDown={handleAction}
    >
      <div className="relative w-full max-w-lg h-[400px]">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Static Base Platform */}
        <div 
          className="absolute bottom-10 h-12 bg-slate-800 border-2 border-slate-700 rounded-xl shadow-2xl flex items-center justify-center"
          style={{ width: `${basePlatform.width}%`, left: `${basePlatform.left}%` }}
        >
          <div className="text-slate-500 font-black text-xs uppercase tracking-widest">Base Target</div>
        </div>

        {/* Moving Block (The Item) */}
        <div 
          className="absolute transition-all duration-75"
          style={{ 
            width: `${movingBlock.width}%`, 
            left: `${movingBlock.left}%`, 
            bottom: '160px', 
            height: '60px' 
          }}
        >
          <div 
            className="w-full h-full rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.5)] border-2 border-white/20 relative animate-pulse"
            style={{ backgroundColor: COLORS[level % COLORS.length] }}
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-white font-black text-lg whitespace-nowrap drop-shadow-lg">
                LEVEL {level}
             </div>
          </div>
        </div>
        
        {/* Guides */}
        <div className="absolute bottom-10 left-0 w-full h-px bg-slate-800" />
      </div>

      <div className="absolute bottom-20 text-slate-500 font-bold animate-bounce uppercase tracking-widest text-sm">
        Tap to Catch!
      </div>
    </div>
  );
};

export default StackGame;
