
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Trophy, Sparkles, Coins } from 'lucide-react';

interface RouletteProps {
  balance: number;
  onWin: (amount: number) => void;
  onLose: (amount: number) => void;
  onBack: () => void;
}

// European Roulette Sequence
const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];

const Roulette: React.FC<RouletteProps> = ({ balance, onWin, onLose, onBack }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [betType, setBetType] = useState<'red' | 'black' | 'zero'>('red');
  const [betAmount, setBetAmount] = useState(100);
  const [winAnnouncement, setWinAnnouncement] = useState<string | null>(null);

  const spinWheel = () => {
    if (isSpinning || balance < betAmount) return;

    onLose(betAmount);
    setIsSpinning(true);
    setResult(null);
    setWinAnnouncement(null);

    // Calculate rotation: 
    // We want at least 5-8 full spins for drama, then land on a random number.
    const spins = 7 + Math.floor(Math.random() * 5);
    const sectorAngle = 360 / WHEEL_NUMBERS.length;
    const randomIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
    
    // The pointer is at the top (0 degrees).
    // The wheel starts with 0 at the top.
    // If we want index 'randomIndex' at the top, we need to rotate by (360 - angleForIndex).
    const extraRotation = 360 - (randomIndex * sectorAngle);
    const newRotation = rotation + (spins * 360) + extraRotation - (rotation % 360);

    setRotation(newRotation);

    // Wait for animation to finish
    setTimeout(() => {
      const landedNumber = WHEEL_NUMBERS[randomIndex];
      setResult(landedNumber);
      setIsSpinning(false);
      calculateWin(landedNumber);
    }, 5000);
  };

  const calculateWin = (num: number) => {
    const isRed = RED_NUMBERS.includes(num);
    const isZero = num === 0;
    const isBlack = !isRed && !isZero;

    let won = false;
    let multiplier = 0;

    if (betType === 'red' && isRed) { won = true; multiplier = 1.8; }
    else if (betType === 'black' && isBlack) { won = true; multiplier = 1.8; }
    else if (betType === 'zero' && isZero) { won = true; multiplier = 20; }

    if (won) {
      const amount = Math.floor(betAmount * multiplier);
      onWin(amount);
      setWinAnnouncement(`WINNER! +$${amount.toLocaleString()}`);
    }
  };

  const sectorAngle = 360 / WHEEL_NUMBERS.length;

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-white transition-all z-50 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-black uppercase tracking-widest text-xs">Exit Table</span>
      </button>

      <div className="flex flex-col items-center gap-12 max-w-6xl w-full z-10">
        <header className="text-center">
          <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase flex items-center gap-4 justify-center">
            MOPS <span className="text-indigo-500">ROULETTE</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[10px] mt-2">Premium Gaming Experience</p>
        </header>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 w-full">
          
          {/* WHEEL COMPONENT - PERFECTLY CENTERED */}
          <div className="relative flex items-center justify-center">
            {/* The Outer Frame / Pointer */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              <div className="w-10 h-14 bg-gradient-to-b from-amber-300 to-amber-600 rounded-b-full border-2 border-amber-900 flex items-center justify-center">
                 <Target className="w-6 h-6 text-amber-900 animate-pulse" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-amber-600" />
            </div>

            {/* The Shadowed Rim */}
            <div className="absolute inset-[-20px] rounded-full border-[12px] border-slate-800 bg-slate-900 shadow-[0_30px_100px_rgba(0,0,0,0.8)]" />

            {/* Spinning Part */}
            <div 
              className="relative w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full bg-slate-950 border-[6px] border-slate-800 overflow-hidden transition-transform duration-[5000ms] ease-[cubic-bezier(0.2,0,0.1,1)] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {WHEEL_NUMBERS.map((num, i) => {
                const angle = i * sectorAngle;
                const isRed = RED_NUMBERS.includes(num);
                const isZero = num === 0;
                
                return (
                  <div 
                    key={i}
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 origin-bottom flex flex-col items-center pt-2"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className={`
                      w-6 h-12 sm:w-10 sm:h-20 flex items-center justify-center text-[10px] sm:text-sm font-black text-white rounded-t-sm border-x border-t border-white/5
                      ${isZero ? 'bg-emerald-600' : isRed ? 'bg-rose-600' : 'bg-slate-900'}
                    `}>
                      {num}
                    </div>
                  </div>
                );
              })}
              
              {/* Inner details to give depth */}
              <div className="absolute inset-[10%] rounded-full border border-white/5" />
              <div className="absolute inset-[20%] rounded-full border border-white/5" />
            </div>

            {/* Static Center Hub */}
            <div className="absolute inset-[30%] rounded-full bg-slate-900 border-[10px] border-slate-800 shadow-[inset_0_0_30px_rgba(0,0,0,1)] flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">Result</div>
                <div className={`text-6xl sm:text-8xl font-black transition-all duration-500 ${
                  result === null ? 'text-slate-800 opacity-20' : 
                  RED_NUMBERS.includes(result) ? 'text-rose-500' : 
                  result === 0 ? 'text-emerald-500' : 'text-white'
                }`}>
                  {result !== null ? result : '--'}
                </div>
              </div>
            </div>
          </div>

          {/* BETTING CONTROLS */}
          <div className="bg-slate-800/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-slate-700/50 w-full max-w-sm shadow-2xl relative overflow-hidden flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Field</label>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => setBetType('red')} 
                  className={`py-5 rounded-2xl font-black transition-all border-b-4 ${betType === 'red' ? 'bg-rose-600 border-rose-800 text-white scale-[1.02] shadow-xl' : 'bg-slate-900 border-slate-950 text-slate-500 hover:text-slate-300'}`}
                >
                  RED (1.8x)
                </button>
                <button 
                  onClick={() => setBetType('black')} 
                  className={`py-5 rounded-2xl font-black transition-all border-b-4 ${betType === 'black' ? 'bg-slate-950 border-black text-white scale-[1.02] shadow-xl' : 'bg-slate-900 border-slate-950 text-slate-500 hover:text-slate-300'}`}
                >
                  BLACK (1.8x)
                </button>
                <button 
                  onClick={() => setBetType('zero')} 
                  className={`py-5 rounded-2xl font-black transition-all border-b-4 ${betType === 'zero' ? 'bg-emerald-600 border-emerald-800 text-white scale-[1.02] shadow-xl' : 'bg-slate-900 border-slate-950 text-slate-500 hover:text-slate-300'}`}
                >
                  ZERO (20x)
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stake</span>
              <div className="flex items-center justify-between">
                <div className="text-amber-500 font-bold">$</div>
                <input 
                  type="number" 
                  value={betAmount} 
                  onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
                  className="bg-transparent text-white text-4xl font-black text-right outline-none w-full"
                />
              </div>
            </div>

            <button 
              disabled={isSpinning || balance < betAmount}
              onClick={spinWheel}
              className="w-full bg-white hover:bg-slate-200 disabled:opacity-30 text-slate-900 font-black py-6 rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl text-xl border-b-8 border-slate-300 group"
            >
              <Sparkles className={`w-6 h-6 transition-all ${isSpinning ? 'animate-spin' : 'group-hover:rotate-12'}`} />
              {isSpinning ? 'SPINNING...' : 'CONFIRM BET'}
            </button>
          </div>
        </div>

        {winAnnouncement && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 px-12 py-8 rounded-[2.5rem] font-black text-4xl shadow-[0_0_100px_rgba(255,255,255,0.4)] animate-bounce z-[60] flex items-center gap-6 border-b-8 border-slate-300">
            <Trophy className="w-12 h-12 text-amber-500" />
            {winAnnouncement}
          </div>
        )}
      </div>

      <footer className="absolute bottom-6 flex items-center gap-3 opacity-20 pointer-events-none">
        <Coins className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Fair RNG Protocol Active • v4.0</span>
      </footer>
    </div>
  );
};

export default Roulette;
