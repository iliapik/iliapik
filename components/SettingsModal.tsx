
import React, { useState } from 'react';
import { X, Settings, Volume2, Check, ShieldAlert } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  musicVolume: number;
  setMusicVolume: (v: number) => void;
  onRedeemCode: (code: string) => boolean;
  AUTHOR_REWARD: number;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  musicVolume,
  setMusicVolume,
  onRedeemCode,
  AUTHOR_REWARD,
}) => {
  const [authorCodeInput, setAuthorCodeInput] = useState('');
  const [codeMessage, setCodeMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
      <div className="bg-slate-800 border-2 border-slate-700 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 italic">
            <Settings className="w-6 h-6 text-indigo-500" /> SYSTEM
          </h2>
          <button onClick={onClose} className="bg-slate-900 p-2 rounded-xl text-slate-500 hover:text-white transition-colors">
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
              {codeMessage.type === 'success' ? <Check className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              {codeMessage.text}
            </div>
          )}
        </form>

        <div className="border-t border-slate-700 pt-8 text-slate-600 text-[9px] font-black uppercase tracking-[0.4em] text-center opacity-50">
          Mops Casino System v3.2.0 - Gaming Hub Edition
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
