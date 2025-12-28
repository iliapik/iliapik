
import React, { useState, useEffect, useRef } from 'react';
import { SLOT_SYMBOLS, SLOT_PAYOUTS, SLOT_WEIGHTS } from '../constants';
import { RotateCw, ArrowLeft, Star, Gem } from 'lucide-react';

interface SlotsProps {
  balance: number;
  onWin: (amount: number) => void;
  onLose: (amount: number) => void;
  onBack: () => void;
}

const Slots: React.FC<SlotsProps> = ({ balance, onWin, onLose, onBack }) => {
  const [reels, setReels] = useState(['🍒', '🍋', '🔔']);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [bet, setBet] = useState(100);
  const [lastWin, setLastWin] = useState(0);
  const isFirstRender = useRef(true);

  // Helper to get a random symbol based on weights
  const getRandomWeightedSymbol = () => {
    const totalWeight = Object.values(SLOT_WEIGHTS).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of SLOT_SYMBOLS) {
      if (random < SLOT_WEIGHTS[symbol]) return symbol;
      random -= SLOT_WEIGHTS[symbol];
    }
    return SLOT_SYMBOLS[0];
  };

  const spin = () => {
    if (balance < bet || spinning.some(s => s)) return;
    
    isFirstRender.current = false;
    onLose(bet);
    setLastWin(0);
    setSpinning([true, true, true]);

    [0, 1, 2].forEach(i => {
      const startTime = Date.now();
      const duration = 1500 + i * 500;

      const reelInterval = setInterval(() => {
        setReels(prev => {
          const next = [...prev];
          next[i] = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
          return next;
        });

        if (Date.now() - startTime > duration) {
          clearInterval(reelInterval);
          setSpinning(prev => {
            const next = [...prev];
            // Final stop uses weighted logic for the house edge
            next[i] = getRandomWeightedSymbol();
            return next;
          });
        }
      }, 70);
    });
  };

  useEffect(() => {
    // Only check result if we are NOT on the first render and NOT currently spinning
    if (!isFirstRender.current && spinning.every(s => !s)) {
      checkResult(reels);
    }
  }, [spinning]);

  const checkResult = (res: string[]) => {
    let winAmount = 0;
    
    // 3 of a kind
    if (res[0] === res[1] && res[1] === res[2]) {
      const multiplier = SLOT_PAYOUTS[res[0]] || 5;
      winAmount = bet * multiplier;
    } 
    // Any 2 of a kind (Adjacent)
    else if (res[0] === res[1] || res[1] === res[2]) {
      const matchSymbol = res[1];
      // Weighted pair payout - small return to keep engagement without exceeding 90% RTP
      const pairMult = Math.max(0.2, (SLOT_PAYOUTS[matchSymbol] || 2) * 0.1);
      winAmount = Math.floor(bet * pairMult);
    }

    if (winAmount > 0) {
      setLastWin(winAmount);
      onWin(winAmount);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-6 bg-[#0f172a]">
      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-50">
        <ArrowLeft className="w-5 h-5" /> Back to Hub
      </button>

      <div className="relative group scale-90 sm:scale-100">
        <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-[4rem] blur opacity-10" />
        
        <div className="bg-slate-800 border-8 border-slate-700 rounded-[3.5rem] p-8 sm:p-10 shadow-2xl relative flex flex-col items-center max-w-md w-full">
          <div className="mb-6 flex items-center gap-2 text-amber-500">
            <Gem className="w-8 h-8 animate-pulse" />
            <h2 className="text-3xl font-black tracking-tighter italic uppercase text-white">MOPS <span className="text-amber-500 text-4xl">SPIN</span></h2>
            <Star className="w-8 h-8 animate-pulse" />
          </div>

          <div className="bg-black/80 rounded-[2rem] p-4 sm:p-6 mb-8 flex gap-3 sm:gap-6 border-4 border-slate-900 shadow-inner overflow-hidden">
            {reels.map((symbol, i) => (
              <div 
                key={i} 
                className={`w-20 h-32 sm:w-28 sm:h-40 bg-slate-900 rounded-2xl flex items-center justify-center text-5xl sm:text-7xl shadow-2xl border-2 border-slate-800 transition-all ${spinning[i] ? 'scale-95 opacity-80' : 'scale-100'}`}
              >
                {symbol}
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center bg-slate-900/80 px-6 py-4 rounded-2xl border border-slate-700">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Stake</span>
              <div className="flex items-center gap-4">
                <button onClick={() => setBet(Math.max(10, bet - 100))} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700">-</button>
                <span className="font-mono text-2xl text-amber-400 font-bold min-w-[60px] text-center">{bet}</span>
                <button onClick={() => setBet(Math.min(balance, bet + 100))} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700">+</button>
              </div>
            </div>

            <button 
              disabled={spinning.some(s => s) || balance < bet}
              onClick={spin}
              className={`w-full py-5 rounded-[2rem] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 border-b-8 ${
                spinning.some(s => s) 
                  ? 'bg-slate-700 border-slate-800 cursor-not-allowed translate-y-1' 
                  : 'bg-amber-500 hover:bg-amber-400 active:translate-y-2 active:border-b-0 border-amber-700 shadow-amber-500/30'
              }`}
            >
              <RotateCw className={`w-8 h-8 ${spinning.some(s => s) ? 'animate-spin' : ''}`} />
              {spinning.some(s => s) ? 'SPINNING...' : 'PULL LEVER'}
            </button>
          </div>
          
          {lastWin > 0 && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-3 rounded-full font-black text-2xl animate-bounce shadow-[0_0_40px_rgba(34,197,94,0.6)] flex items-center gap-3 z-20">
              PAYOUT! +{lastWin.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center w-full max-w-md opacity-40">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">House Edge Logic Active</div>
        <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Random Number Generator Certified • Statistical RTP 90%</div>
      </div>
    </div>
  );
};

export default Slots;
