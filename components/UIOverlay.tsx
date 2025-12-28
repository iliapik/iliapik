
import React, { useState } from 'react';
import { GameStatus, Difficulty } from '../types';
import { Settings, Coins, Trophy, Play, Check, X, ShieldAlert, BarChart3, Volume2, ArrowLeft, TrendingUp } from 'lucide-react';
import { AUTHOR_CODE, AUTHOR_REWARD, DIFFICULTY_SETTINGS, STACKER_INCREMENT } from '../constants';

interface UIOverlayProps {
  balance: number;
  currentBet: number;
  potentialWinnings: number;
  level: number;
  status: GameStatus;
  difficulty: Difficulty;
  musicVolume: number;
  setMusicVolume: (v: number) => void;
  onStartBetting: () => void;
  onConfirmBet: (amount: number, difficulty: Difficulty) => void;
  onCollect: () => void;
  onRestart: () => void;
  onBackToHub: () => void;
  onRedeemCode: (code: string) => boolean;
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'text-green-400',
  medium: 'text-yellow-400',
  hard: 'text-red-500'
};

const UIOverlay: React.FC<UIOverlayProps> = ({
  balance,
  currentBet,
  potentialWinnings,
  level,
  status,
  difficulty,
  musicVolume,
  setMusicVolume,
  onStartBetting,
  onConfirmBet,
  onCollect,
  onRestart,
  onBackToHub,
  onRedeemCode,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [betInput, setBetInput] = useState<string>('100');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [authorCodeInput, setAuthorCodeInput] = useState('');
  const [codeMessage, setCodeMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleBetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(betInput);
    if (!isNaN(amount) && amount > 0 && amount <= balance) {
      onConfirmBet(amount, selectedDifficulty);
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onRedeemCode(authorCodeInput);
    if (success) {
      setCodeMessage({ type: 'success', text: `Code Redeemed! +${AUTHOR_REWARD.toLocaleString()} Mopscoin` });
      setAuthorCodeInput('');
    } else {
      setCodeMessage({ type: 'error', text: 'Invalid Code' });
    }
    setTimeout(() => setCodeMessage(null), 3000);
  };

  const currentMultiplier = 1 + (Math.max(0, level - 3) * STACKER_INCREMENT);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-50">
      
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex gap-2">
          {status === 'idle' && (
            <button 
              onClick={onBackToHub}
              className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-xl text-slate-400 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6" /> Hub
            </button>
          )}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-3 flex items-center gap-3 shadow-xl">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <Coins className="text-yellow-400 w-6 h-6" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Mopscoin</div>
              <div className="text-white font-mono text-lg font-bold">{Math.floor(balance).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowSettings(true)}
          className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-xl text-slate-400 hover:text-white"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Game Stats HUD */}
      {status === 'playing' && (
        <div className="absolute top-24 left-4 right-4 flex justify-between pointer-events-none">
          <div className="flex flex-col gap-2">
             <div className="bg-slate-900/80 backdrop-blur rounded-xl px-4 py-2 border border-slate-700 self-start">
               <span className="text-slate-500 text-[10px] font-black uppercase block tracking-widest mb-1">Catch Round</span>
               <span className="text-white font-black text-2xl">{level}</span>
             </div>
             <div className="bg-slate-900/80 backdrop-blur rounded-xl px-4 py-2 border border-slate-700 self-start flex items-center gap-3">
               <TrendingUp className={`w-5 h-5 ${currentMultiplier > 1 ? 'text-emerald-400' : 'text-slate-500'}`} />
               <div>
                  <span className="text-slate-500 text-[10px] font-black uppercase block tracking-widest">Multiplier</span>
                  <span className={`${currentMultiplier > 1 ? 'text-emerald-400' : 'text-white'} font-black text-lg font-mono`}>
                    x{currentMultiplier.toFixed(2)}
                  </span>
               </div>
             </div>
          </div>
          <div className="text-right">
             <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-4 border border-slate-700 shadow-2xl">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Potential Pay</div>
               <div className="text-3xl font-mono font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                 {Math.floor(potentialWinnings).toLocaleString()}
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Collect Button */}
      {status === 'playing' && level > 0 && (
        <div className="absolute bottom-10 left-0 w-full flex justify-center pointer-events-auto">
          <button
            onClick={onCollect}
            className="group relative bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 px-16 rounded-2xl shadow-[0_20px_50px_-10px_rgba(5,150,105,0.4)] transition-all transform hover:scale-105 active:scale-95 border-b-4 border-emerald-800"
          >
            <span className="flex items-center gap-4 text-2xl tracking-tighter italic">
              COLLECT PAYOUT <div className="bg-black/20 px-3 py-1 rounded-lg not-italic text-lg">{Math.floor(potentialWinnings).toLocaleString()}</div>
            </span>
          </button>
        </div>
      )}

      {/* Main Action Button */}
      {status === 'idle' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
           <button
            onClick={onStartBetting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-3xl font-black py-8 px-20 rounded-[2rem] shadow-[0_0_80px_-15px_rgba(79,70,229,0.4)] transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-3 border-b-8 border-indigo-800 tracking-tighter italic"
          >
            <Play className="w-12 h-12 fill-current" />
            ENTER STACKER
          </button>
        </div>
      )}

      {/* Betting Modal */}
      {status === 'betting' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto z-50">
          <form onSubmit={handleBetSubmit} className="bg-slate-800 border-2 border-slate-700 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-float">
            <h2 className="text-3xl font-black text-white mb-2 text-center tracking-tight italic">PLACE STAKE</h2>
            <p className="text-slate-500 text-center text-xs font-bold uppercase tracking-widest mb-8">First 3 wins are Zero Profit (1.0x)</p>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDifficulty(d)}
                  className={`py-4 px-2 rounded-2xl text-xs font-black transition-all border-2 border-b-4 ${
                    selectedDifficulty === d 
                      ? 'bg-indigo-600 border-indigo-400 border-b-indigo-800 text-white shadow-xl scale-105' 
                      : 'bg-slate-900 border-slate-950 text-slate-500 opacity-60'
                  }`}
                >
                  <div className={`uppercase mb-1 ${DIFFICULTY_COLORS[d]}`}>{DIFFICULTY_SETTINGS[d].label}</div>
                  <div className="text-white text-[10px]">Timing {d === 'easy' ? 'Slow' : d === 'medium' ? 'Fast' : 'Elite'}</div>
                </button>
              ))}
            </div>

            <div className="relative mb-8">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-500">
                <Coins className="w-6 h-6" />
              </span>
              <input
                type="number"
                value={betInput}
                onChange={(e) => setBetInput(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl py-5 pl-14 pr-4 text-white font-mono text-2xl font-black focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-inner"
                placeholder="0"
                min="1"
                max={balance}
              />
            </div>
            
            <div className="flex gap-2 mb-8">
               <button type="button" onClick={() => setBetInput(Math.floor(balance * 0.1).toString())} className="flex-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-500 py-3 rounded-xl text-[10px] font-black">10%</button>
               <button type="button" onClick={() => setBetInput(Math.floor(balance * 0.5).toString())} className="flex-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-500 py-3 rounded-xl text-[10px] font-black">50%</button>
               <button type="button" onClick={() => setBetInput(balance.toString())} className="flex-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-500 py-3 rounded-xl text-[10px] font-black">MAX</button>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onRestart}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-black py-4 px-4 rounded-2xl transition-all uppercase tracking-widest text-xs"
              >
                Abort
              </button>
              <button
                type="submit"
                disabled={parseInt(betInput) > balance || parseInt(betInput) <= 0}
                className="flex-2 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-4 px-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs border-b-4 border-indigo-800"
              >
                Launch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Game Over Modal */}
      {status === 'gameover' && (
        <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto z-50">
          <div className="bg-slate-900 border-4 border-rose-500 rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl text-center">
            <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-12 h-12 text-rose-500" />
            </div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter italic uppercase">DEFEAT</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">Loss: <span className="text-white font-mono">-{currentBet.toLocaleString()}</span></p>
            <button
              onClick={onRestart}
              className="w-full bg-white text-slate-900 font-black py-5 px-6 rounded-2xl shadow-xl transition-all hover:bg-slate-200 uppercase tracking-[0.2em] text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Victory/Collect Modal */}
      {status === 'victory' && (
        <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto z-50">
          <div className="bg-slate-900 border-4 border-emerald-500 rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl text-center">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter italic uppercase">SUCCESS</h2>
            <div className="text-5xl font-mono font-black text-emerald-400 mb-10 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              +{Math.floor(potentialWinnings).toLocaleString()}
            </div>
            <button
              onClick={onRestart}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-5 px-6 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-sm border-b-4 border-emerald-800"
            >
              Next Mission
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto z-50">
           <div className="bg-slate-800 border-2 border-slate-700 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 italic">
                  <Settings className="w-6 h-6 text-indigo-500" /> SYSTEM
                </h2>
                <button onClick={() => setShowSettings(false)} className="bg-slate-900 p-2 rounded-xl text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Music Volume Control */}
              <div className="mb-12">
                <label className="text-slate-500 text-[10px] font-black mb-6 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Volume2 className="w-4 h-4" /> Audio Level
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={musicVolume} 
                  onChange={(e) => setMusicVolume(Number(e.target.value))}
                  className="w-full h-3 bg-slate-950 rounded-full appearance-none cursor-pointer accent-indigo-500 shadow-inner"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-4 font-black uppercase tracking-widest">
                  <span>Muted</span>
                  <span className="text-indigo-400">{musicVolume}%</span>
                  <span>Max</span>
                </div>
              </div>

              <form onSubmit={handleCodeSubmit} className="mb-10">
                <label className="block text-slate-500 text-[10px] font-black mb-4 uppercase tracking-[0.3em]">
                  Promo Authentication
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={authorCodeInput}
                    onChange={(e) => setAuthorCodeInput(e.target.value)}
                    placeholder="Enter key..."
                    className="flex-1 bg-slate-950 border-2 border-slate-700 rounded-xl px-4 py-4 text-white font-mono focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-4 rounded-xl transition-all uppercase text-xs">
                    Apply
                  </button>
                </div>
                {codeMessage && (
                  <div className={`mt-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${codeMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {codeMessage.type === 'success' ? <Check className="w-4 h-4"/> : <ShieldAlert className="w-4 h-4"/>}
                    {codeMessage.text}
                  </div>
                )}
              </form>

              <div className="border-t border-slate-700 pt-8 text-slate-600 text-[9px] font-black uppercase tracking-[0.4em] text-center opacity-50">
                Mops Casino System v3.1.2 - Premium End-to-End
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
