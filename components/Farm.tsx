
import React, { useState, useCallback } from 'react';
import { ArrowLeft, Coins, Sprout, Heart } from 'lucide-react';

interface FarmProps {
  onEarn: () => void;
  onBack: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

const Farm: React.FC<FarmProps> = ({ onEarn, onBack }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clicks, setClicks] = useState(0);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid double clicks on mobile
    if ('touches' in e) {
      // Touch event handling
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const id = Date.now();
    setParticles(prev => [...prev, { id, x: clientX, y: clientY }]);
    
    setClicks(prev => prev + 1);
    onEarn();

    // Clean up particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0f172a] overflow-hidden relative">
      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-50">
        <ArrowLeft className="w-5 h-5" /> Back to Hub
      </button>

      {/* Decorative environment elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-20 left-10 text-lime-500 animate-float"><Sprout className="w-12 h-12" /></div>
         <div className="absolute bottom-20 right-20 text-lime-600 animate-float" style={{ animationDelay: '1s' }}><Sprout className="w-16 h-16" /></div>
         <div className="absolute top-1/2 right-10 text-lime-400 animate-float" style={{ animationDelay: '2s' }}><Sprout className="w-8 h-8" /></div>
      </div>

      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 bg-lime-500/10 px-4 py-2 rounded-full border border-lime-500/20 mb-4">
          <Sprout className="w-4 h-4 text-lime-500" />
          <span className="text-lime-500 text-[10px] font-black uppercase tracking-[0.2em]">Manual Liquidity Farm</span>
        </div>
        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">MOPS <span className="text-lime-500">FARM</span></h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">TAP TO EARN • $1 PER CLICK</p>
      </div>

      {/* The Giant Clickable MopsCoin */}
      <button 
        onMouseDown={handleClick}
        className="relative group transition-all active:scale-95 touch-none"
      >
        <div className="absolute -inset-10 bg-lime-500/20 rounded-full blur-3xl group-hover:bg-lime-500/30 transition-all animate-pulse" />
        
        {/* Custom MopsCoin SVG/Logo inspired by user image */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-b from-yellow-300 to-amber-600 rounded-full border-8 border-amber-800 shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-2 rounded-full border-4 border-amber-400/30 border-dashed animate-[spin_20s_linear_infinite]" />
          
          {/* Pug Face Center Piece */}
          <div className="relative flex flex-col items-center">
             <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[#c6a074] rounded-[3rem] border-8 border-[#5d4037] shadow-lg relative flex flex-col items-center justify-center p-4">
                {/* Ears */}
                <div className="absolute -top-4 -left-6 w-16 h-20 bg-[#5d4037] rounded-full rotate-[-45deg]" />
                <div className="absolute -top-4 -right-6 w-16 h-20 bg-[#5d4037] rounded-full rotate-[45deg]" />
                
                {/* Face Details */}
                <div className="flex gap-8 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full relative">
                    <div className="absolute top-1 right-1 w-4 h-4 bg-black rounded-full" />
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full relative">
                    <div className="absolute top-1 left-1 w-4 h-4 bg-black rounded-full" />
                  </div>
                </div>
                
                {/* Muzzle */}
                <div className="w-20 h-16 sm:w-24 sm:h-20 bg-[#5d4037] rounded-3xl flex flex-col items-center justify-center gap-1">
                   <div className="w-6 h-4 sm:w-8 sm:h-6 bg-black rounded-full" />
                   <div className="flex gap-1">
                     <Heart className="w-4 h-4 text-rose-500 fill-current" />
                   </div>
                </div>

                {/* 'M' on Forehead */}
                <div className="absolute top-2 text-[#5d4037] font-black text-xl">M</div>
             </div>
          </div>

          <div className="absolute bottom-8 text-amber-900 font-black text-2xl tracking-tighter uppercase italic drop-shadow-sm">MopsCoin</div>
        </div>
      </button>

      <div className="mt-12 text-slate-500 font-mono text-xl font-bold bg-slate-900/50 px-8 py-3 rounded-2xl border border-slate-800">
        SESSION TOTAL: <span className="text-lime-500">{clicks.toLocaleString()}</span>
      </div>

      {/* Click Particles */}
      {particles.map(p => (
        <div 
          key={p.id}
          className="fixed pointer-events-none text-lime-400 font-black text-2xl animate-out fade-out slide-out-to-top-20 duration-1000 z-[100]"
          style={{ left: p.x, top: p.y - 40 }}
        >
          +$1
        </div>
      ))}

      <footer className="mt-12 text-center opacity-40">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center justify-center gap-2">
          <Coins className="w-3 h-3" /> Honest Work Policy
        </div>
      </footer>
    </div>
  );
};

export default Farm;
