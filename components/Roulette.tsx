
import React, { useState, useRef } from 'react';
import { ArrowLeft, Target, Sparkles, Trophy } from 'lucide-react';

interface RouletteProps {
  balance: number;
  onWin: (amount: number) => void;
  onLose: (amount: number) => void;
  onBack: () => void;
}

const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const Roulette: React.FC<RouletteProps> = ({ balance, onWin, onLose, onBack }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [betType, setBetType] = useState<'red' | 'black' | 'green'>('red');
  const [betAmount, setBetAmount] = useState(100);
  const [winMsg, setWinMsg] = useState<string | null>(null);

  const spin = () => {
    if (balance < betAmount || spinning) return;
    onLose(betAmount);
    setSpinning(true);
    setResult(null);
    setWinMsg(null);

    const extraSpins = 5 + Math.random() * 5;
    const targetRotation = rotation + (extraSpins * 360);
    setRotation(targetRotation);

    setTimeout(() => {
      const finalRotation = targetRotation % 360;
      const sectorAngle = 360 / ROULETTE_NUMBERS.length;
      // Index is determined by where the top pointer (Target) lands
      // Because the wheel rotates clockwise, we subtract from 360
      const index = Math.floor(((360 - (finalRotation % 360)) % 360) / sectorAngle);
      const num = ROULETTE_NUMBERS[index];
      
      setResult(num);
      setSpinning(false);
      
      const isRed = RED_NUMBERS.includes(num);
      const isGreen = num === 0;
      const isBlack = !isRed && !isGreen;

      let won = false;
      let multiplier = 0;

      if (betType === 'red' && isRed) { won = true; multiplier = 2; }
      else if (betType === 'black' && isBlack) { won = true; multiplier = 2; }
      else if (betType === 'green' && isGreen) { won = true; multiplier = 35; }

      if (won) {
        const winTotal = betAmount * multiplier;
        onWin(winTotal);
        setWinMsg(`WINNER! +${winTotal.toLocaleString()}`);
      }
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-6 overflow-y-auto">
      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-50">
        <ArrowLeft className="w-5 h-5" /> Back to Hub
      </button>

      <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
        <h1 className="text-4xl font-black tracking-tighter text-indigo-400">ROULETTE <span className="text-white">ROYALE</span></h1>

        <div className="flex flex-col lg:flex-row gap-12 items-center w-full justify-center">
          {/* Enhanced Visual Wheel */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
            {/* The Pointer */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 z-20 drop-shadow-lg">
              <Target className="w-12 h-12" />
            </div>

            {/* The Wheel */}
            <div 
              className="w-full h-full rounded-full border-[12px] border-slate-800 bg-slate-900 shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-transform duration-[4000ms] cubic-bezier(0.1, 0, 0.1, 1)"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-slate-700/50" />
              {ROULETTE_NUMBERS.map((num, i) => {
                const angle = (360 / ROULETTE_NUMBERS.length) * i;
                const isRed = RED_NUMBERS.includes(num);
                const isGreen = num === 0;
                return (
                  <div 
                    key={i} 
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 origin-bottom flex flex-col items-center"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className={`w-6 h-8 sm:w-8 sm:h-10 flex items-center justify-center text-[10px] sm:text-xs font-bold rounded-t-sm shadow-sm ${isGreen ? 'bg-emerald-600' : isRed ? 'bg-rose-600' : 'bg-slate-950'}`}>
                      {num}
                    </div>
                  </div>
                );
              })}
              {/* Inner Circle */}
              <div className="absolute inset-[25%] rounded-full bg-slate-800 border-4 border-slate-700 shadow-inner flex items-center justify-center">
                 <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase font-black tracking-widest">Result</div>
                    <div className={`text-5xl sm:text-7xl font-black ${result === null ? 'text-slate-700' : RED_NUMBERS.includes(result) ? 'text-rose-500' : result === 0 ? 'text-emerald-500' : 'text-white'}`}>
                      {result !== null ? result : '?'}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Betting UI */}
          <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-[2rem] border border-slate-700 w-full max-w-sm shadow-2xl">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setBetType('red')} 
                  className={`py-4 rounded-2xl font-black transition-all border-b-4 ${betType === 'red' ? 'bg-rose-600 border-rose-800 scale-105 shadow-xl shadow-rose-600/20' : 'bg-slate-900 border-slate-950 text-slate-500'}`}
                >
                  RED (2x)
                </button>
                <button 
                  onClick={() => setBetType('black')} 
                  className={`py-4 rounded-2xl font-black transition-all border-b-4 ${betType === 'black' ? 'bg-slate-950 border-black scale-105 shadow-xl shadow-black/20 text-white' : 'bg-slate-900 border-slate-950 text-slate-500'}`}
                >
                  BLACK (2x)
                </button>
                <button 
                  onClick={() => setBetType('green')} 
                  className={`py-4 rounded-2xl font-black transition-all border-b-4 ${betType === 'green' ? 'bg-emerald-600 border-emerald-800 scale-105 shadow-xl shadow-emerald-600/20' : 'bg-slate-900 border-slate-950 text-slate-500'}`}
                >
                  ZERO (35x)
                </button>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl flex items-center justify-between border border-slate-700 shadow-inner">
                <span className="text-slate-500 font-black text-xs uppercase">Your Stake</span>
                <input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(Math.max(1, Number(e.target.value)))} 
                  className="bg-transparent text-right font-mono text-2xl w-32 outline-none text-yellow-400 font-bold" 
                />
              </div>

              <button 
                onClick={spin} 
                disabled={spinning || balance < betAmount} 
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 text-xl border-b-4 border-indigo-800"
              >
                <Sparkles className={`w-6 h-6 ${spinning ? 'animate-spin' : ''}`} />
                {spinning ? 'WHEEL SPINNING...' : 'PLACE BET'}
              </button>
            </div>
          </div>
        </div>

        {winMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-400 px-8 py-4 rounded-2xl font-black text-2xl animate-bounce flex items-center gap-3">
            <Trophy className="w-8 h-8" /> {winMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roulette;
