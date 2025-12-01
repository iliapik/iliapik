import React, { useState } from 'react';
import { GameStatus } from '../types';
import { Settings, Coins, Trophy, Play, Check, X, ShieldAlert } from 'lucide-react';
import { AUTHOR_CODE, AUTHOR_REWARD, WINNINGS_MULTIPLIER } from '../constants';

interface UIOverlayProps {
  balance: number;
  currentBet: number;
  potentialWinnings: number;
  level: number;
  status: GameStatus;
  onStartBetting: () => void;
  onConfirmBet: (amount: number) => void;
  onCollect: () => void;
  onRestart: () => void;
  onRedeemCode: (code: string) => boolean;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  balance,
  currentBet,
  potentialWinnings,
  level,
  status,
  onStartBetting,
  onConfirmBet,
  onCollect,
  onRestart,
  onRedeemCode,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [betInput, setBetInput] = useState<string>('100');
  const [authorCodeInput, setAuthorCodeInput] = useState('');
  const [codeMessage, setCodeMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleBetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(betInput);
    if (!isNaN(amount) && amount > 0 && amount <= balance) {
      onConfirmBet(amount);
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

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-50">
      
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-3 flex items-center gap-3 shadow-xl">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <Coins className="text-yellow-400 w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Mopscoin</div>
            <div className="text-white font-mono text-lg font-bold">{Math.floor(balance).toLocaleString()}</div>
          </div>
        </div>

        <button 
          onClick={() => setShowSettings(true)}
          className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-xl text-slate-400 hover:text-white"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Game Stats HUD (During Play) */}
      {status === 'playing' && (
        <div className="absolute top-24 left-4 right-4 flex justify-between pointer-events-none">
          <div className="flex flex-col gap-1">
             <div className="bg-slate-900/80 backdrop-blur rounded-lg px-3 py-1 text-slate-300 text-sm border border-slate-700 self-start">
               Level <span className="text-white font-bold">{level}</span>
             </div>
             <div className="bg-green-900/80 backdrop-blur rounded-lg px-3 py-1 text-green-300 text-sm border border-green-700 self-start">
               Multiplier <span className="text-white font-bold">x{(1 + level * WINNINGS_MULTIPLIER).toFixed(2)}</span>
             </div>
          </div>
          <div className="text-right">
             <div className="text-sm text-slate-300 shadow-black drop-shadow-md">Potential Winnings</div>
             <div className="text-2xl font-mono font-bold text-green-400 drop-shadow-md">
               +{Math.floor(potentialWinnings).toLocaleString()}
             </div>
          </div>
        </div>
      )}

      {/* Collect Button (During Play) */}
      {status === 'playing' && level > 0 && (
        <div className="absolute bottom-32 left-0 w-full flex justify-center pointer-events-auto">
          <button
            onClick={onCollect}
            className="group relative bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-full shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
            <span className="flex items-center gap-2 text-xl">
              COLLECT <span className="font-mono bg-black/20 px-2 rounded">{Math.floor(potentialWinnings).toLocaleString()}</span>
            </span>
          </button>
        </div>
      )}

      {/* Main Action Button (Idle) */}
      {status === 'idle' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
           <button
            onClick={onStartBetting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold py-6 px-16 rounded-2xl shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)] transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2 border-b-4 border-indigo-800"
          >
            <Play className="w-8 h-8 fill-current" />
            PLAY
          </button>
        </div>
      )}

      {/* Betting Modal */}
      {status === 'betting' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto z-50">
          <form onSubmit={handleBetSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all animate-float">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Place Your Bet</h2>
            <p className="text-slate-400 text-center mb-6">How confident are you?</p>
            
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Coins className="w-5 h-5" />
              </span>
              <input
                type="number"
                value={betInput}
                onChange={(e) => setBetInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Amount"
                min="1"
                max={balance}
                autoFocus
              />
            </div>
            
            <div className="flex gap-2 mb-6">
               <button type="button" onClick={() => setBetInput(Math.floor(balance * 0.1).toString())} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg text-sm font-semibold transition-colors">10%</button>
               <button type="button" onClick={() => setBetInput(Math.floor(balance * 0.5).toString())} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg text-sm font-semibold transition-colors">50%</button>
               <button type="button" onClick={() => setBetInput(balance.toString())} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg text-sm font-semibold transition-colors">MAX</button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onRestart}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={parseInt(betInput) > balance || parseInt(betInput) <= 0}
                className="flex-2 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
              >
                Start Game
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Game Over Modal */}
      {status === 'gameover' && (
        <div className="absolute inset-0 bg-red-900/40 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto z-50">
          <div className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <X className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Game Over</h2>
            <p className="text-slate-400 mb-6">You lost your bet of <span className="text-white font-mono">{currentBet.toLocaleString()}</span> Mopscoin.</p>
            <button
              onClick={onRestart}
              className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-4 px-6 rounded-xl shadow-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Victory/Collect Modal */}
      {status === 'victory' && (
        <div className="absolute inset-0 bg-green-900/40 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto z-50">
          <div className="bg-slate-900 border-2 border-green-500/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center transform scale-100 animate-float">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Trophy className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">You Won!</h2>
            <p className="text-slate-400 mb-2">Total Winnings</p>
            <div className="text-4xl font-mono font-bold text-green-400 mb-8 drop-shadow-glow">
              +{Math.floor(potentialWinnings).toLocaleString()}
            </div>
            <button
              onClick={onRestart}
              className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto z-50">
           <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Settings
                </h2>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCodeSubmit} className="mb-6">
                <label className="block text-slate-400 text-sm font-bold mb-2 uppercase tracking-wide">
                  Author Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={authorCodeInput}
                    onChange={(e) => setAuthorCodeInput(e.target.value)}
                    placeholder="Enter code..."
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg transition-colors">
                    Redeem
                  </button>
                </div>
                {codeMessage && (
                  <div className={`mt-2 text-sm flex items-center gap-1 ${codeMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {codeMessage.type === 'success' ? <Check className="w-4 h-4"/> : <ShieldAlert className="w-4 h-4"/>}
                    {codeMessage.text}
                  </div>
                )}
              </form>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-white font-bold mb-2">Game Rules</h3>
                <ul className="text-slate-400 text-sm space-y-2 list-disc pl-4">
                  <li>Bet Mopscoin to start a game.</li>
                  <li>Tap to stack the moving platform.</li>
                  <li>Overhanging parts are cut off.</li>
                  <li>Winnings increase by {WINNINGS_MULTIPLIER * 100}% each level.</li>
                  <li>Miss the platform completely and lose your bet!</li>
                </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
