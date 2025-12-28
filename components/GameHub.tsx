
import React, { useState } from 'react';
import { Spade, Target, Zap, Coins, Crown, Settings } from 'lucide-react';
import { Screen } from '../types';
import SettingsModal from './SettingsModal';
import { AUTHOR_REWARD } from '../constants';

interface GameHubProps {
  onSelectGame: (game: Screen) => void;
  balance: number;
  musicVolume: number;
  setMusicVolume: (v: number) => void;
  onRedeemCode: (code: string) => boolean;
}

const GAMES = [
  { id: 'slots', name: 'Mops Spin', icon: Zap, color: 'bg-amber-500', desc: 'High stakes. Up to 1000x payouts!' },
  { id: 'roulette', name: 'Mops Roulette', icon: Target, color: 'bg-rose-500', desc: 'Predict red, black, or lucky zero.' },
  { id: 'twenty-one', name: 'Twenty-One Points', icon: Spade, color: 'bg-emerald-500', desc: 'Beat the dealer in classic 21.' },
] as const;

const GameHub: React.FC<GameHubProps> = ({ onSelectGame, balance, musicVolume, setMusicVolume, onRedeemCode }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 overflow-y-auto bg-[#0f172a] relative">
      {/* Top Bar for Balance and Settings */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur border border-slate-700 px-5 py-2 rounded-2xl shadow-xl">
           <Coins className="text-yellow-400 w-5 h-5" />
           <span className="text-white font-mono text-xl font-bold">{balance.toLocaleString()}</span>
        </div>
        
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="bg-slate-800/80 p-3 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl border border-slate-700"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        onRedeemCode={onRedeemCode}
        AUTHOR_REWARD={AUTHOR_REWARD}
      />

      <div className="max-w-4xl w-full">
        <header className="text-center mb-16 flex flex-col items-center">
          <div className="bg-indigo-500/20 p-5 rounded-full mb-6 border border-indigo-500/30 shadow-[0_0_60px_rgba(79,70,229,0.3)]">
            <Crown className="w-16 h-16 text-indigo-500 animate-float" />
          </div>
          <h1 className="text-7xl font-black text-white mb-3 tracking-tighter italic uppercase">MOPS <span className="text-indigo-500">CASINO</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">Premium High-Stakes Entertainment</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id as Screen)}
              className="group relative bg-slate-800/40 hover:bg-slate-800 backdrop-blur-md border-2 border-slate-700/50 rounded-[2.5rem] p-8 text-left transition-all hover:scale-[1.03] hover:shadow-2xl active:scale-95 hover:border-indigo-500/30 overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <game.icon className="w-40 h-40" />
              </div>

              <div className={`w-14 h-14 ${game.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform border-b-4 border-black/20`}>
                <game.icon className="text-white w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase italic">{game.name}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider leading-relaxed">{game.desc}</p>
              
              <div className="mt-8 flex items-center text-[10px] font-black text-indigo-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Enter Room <Zap className="w-3 h-3 ml-2 fill-current" />
              </div>
            </button>
          ))}
        </div>

        <footer className="mt-20 text-center">
          <div className="text-slate-600 font-black text-[10px] uppercase tracking-[0.5em] opacity-40">
            Secure Wallet • Provably Fair • Hub v3.3
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GameHub;
