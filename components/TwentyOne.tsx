
import React, { useState } from 'react';
import { ArrowLeft, Spade } from 'lucide-react';

interface TwentyOneProps {
  balance: number;
  onWin: (amount: number) => void;
  onLose: (amount: number) => void;
  onBack: () => void;
}

const TwentyOne: React.FC<TwentyOneProps> = ({ balance, onWin, onLose, onBack }) => {
  const [playerHand, setPlayerHand] = useState<number[]>([]);
  const [dealerHand, setDealerHand] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'result'>('betting');
  const [bet, setBet] = useState(100);
  const [msg, setMsg] = useState('');

  const getCardValue = () => Math.min(10, Math.floor(Math.random() * 11) + 1);
  const sum = (hand: number[]) => hand.reduce((a, b) => a + b, 0);

  const start = () => {
    if (balance < bet) return;
    onLose(bet);
    const p1 = getCardValue();
    const p2 = getCardValue();
    const d1 = getCardValue();
    setPlayerHand([p1, p2]);
    setDealerHand([d1]);
    setGameState('playing');
    setMsg('');
  };

  const hit = () => {
    const next = getCardValue();
    const newHand = [...playerHand, next];
    setPlayerHand(newHand);
    if (sum(newHand) > 21) {
      setMsg('BUST! Dealer Wins.');
      setGameState('result');
    }
  };

  const stand = () => {
    let dHand = [...dealerHand];
    while (sum(dHand) < 17) {
      dHand.push(getCardValue());
    }
    setDealerHand(dHand);
    
    const pScore = sum(playerHand);
    const dScore = sum(dHand);

    if (dScore > 21) {
      setMsg('DEALER BUST! YOU WIN!');
      onWin(bet * 2);
    } else if (pScore > dScore) {
      setMsg('YOU WIN!');
      onWin(bet * 2);
    } else if (pScore < dScore) {
      setMsg('DEALER WINS.');
    } else {
      // TIES GO TO DEALER - This is a standard way to implement a strong house edge in arcade blackjack
      setMsg('PUSH! DEALER WINS TIE.');
    }
    setGameState('result');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-6 bg-[#0f172a]">
      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Hub
      </button>

      {gameState === 'betting' ? (
        <div className="bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-700 w-full max-w-md text-center shadow-2xl">
          <h2 className="text-3xl font-black mb-8 flex items-center justify-center gap-3 italic"><Spade className="text-emerald-500 w-8 h-8" /> 21 POINTS</h2>
          <div className="mb-8">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2 text-left px-2">Your Stake</div>
            <input 
              type="number" 
              value={bet} 
              onChange={e => setBet(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-900 border-2 border-slate-700 text-center text-3xl font-mono py-5 rounded-2xl text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 shadow-inner"
            />
          </div>
          <button onClick={start} className="w-full bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-800 py-6 rounded-2xl font-black text-xl transition-all active:translate-y-1 active:border-b-0">DEAL HAND</button>
          <div className="mt-6 text-[9px] text-slate-500 font-black uppercase tracking-widest opacity-60">House Rules: Dealer Wins on Ties</div>
        </div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col gap-8 sm:gap-12">
          {/* Dealer Section */}
          <div className="text-center">
            <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Dealer Box • Score: {sum(dealerHand)}</h3>
            <div className="flex justify-center gap-4">
              {dealerHand.map((c, i) => (
                <div key={i} className="w-20 h-28 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center text-3xl font-black shadow-xl border-t-4 border-slate-300">
                  {c}
                </div>
              ))}
              {gameState === 'playing' && (
                <div className="w-20 h-28 bg-slate-700 rounded-xl border-2 border-slate-600 border-dashed opacity-50 flex items-center justify-center">
                   <div className="w-8 h-8 rounded-full border-2 border-slate-500" />
                </div>
              )}
            </div>
          </div>

          {/* Player Section */}
          <div className="text-center relative">
            <div className="flex justify-center gap-4 mb-6">
              {playerHand.map((c, i) => (
                <div key={i} className="w-24 h-36 bg-emerald-50 text-slate-900 rounded-xl flex items-center justify-center text-5xl font-black shadow-2xl border-t-4 border-emerald-300 scale-105">
                  {c}
                </div>
              ))}
            </div>
            
            <div className="inline-block bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/30 mb-8">
               <h3 className="text-emerald-400 font-black text-2xl">YOUR SCORE: {sum(playerHand)}</h3>
            </div>

            {gameState === 'playing' ? (
              <div className="flex gap-4 max-w-sm mx-auto">
                <button onClick={hit} className="flex-1 bg-white text-slate-900 font-black py-4 rounded-2xl text-xl hover:bg-slate-200 border-b-4 border-slate-300 active:translate-y-1 active:border-b-0 uppercase">Hit</button>
                <button onClick={stand} className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl text-xl hover:bg-emerald-500 border-b-4 border-emerald-800 active:translate-y-1 active:border-b-0 uppercase">Stand</button>
              </div>
            ) : (
              <div className="flex flex-col gap-6 items-center">
                <div className="text-4xl sm:text-5xl font-black text-yellow-400 animate-pulse italic uppercase tracking-tighter drop-shadow-lg">{msg}</div>
                <button onClick={() => setGameState('betting')} className="bg-slate-800 border-2 border-slate-700 px-10 py-4 rounded-2xl hover:bg-slate-700 transition-colors font-black uppercase tracking-widest text-xs">New Round</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TwentyOne;
