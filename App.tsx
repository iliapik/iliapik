import React, { useState, useEffect } from 'react';
import StackGame from './components/StackGame';
import UIOverlay from './components/UIOverlay';
import { GameStatus, PlayerStats } from './types';
import { AUTHOR_CODE, AUTHOR_REWARD, INITIAL_BALANCE, WINNINGS_MULTIPLIER } from './constants';

const App: React.FC = () => {
  // Game State
  const [status, setStatus] = useState<GameStatus>('idle');
  const [level, setLevel] = useState(0);
  
  // Economy State (Persisted in localStorage in a real app, keeping simple here)
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('mopscoin_balance');
    return saved ? parseInt(saved) : INITIAL_BALANCE;
  });

  const [currentBet, setCurrentBet] = useState(0);
  const [potentialWinnings, setPotentialWinnings] = useState(0);

  // Persistence
  useEffect(() => {
    localStorage.setItem('mopscoin_balance', balance.toString());
  }, [balance]);

  // Actions
  const handleStartBetting = () => {
    setStatus('betting');
  };

  const handleConfirmBet = (amount: number) => {
    if (amount > balance) return;
    setBalance(prev => prev - amount);
    setCurrentBet(amount);
    setPotentialWinnings(amount); // Initial winnings is just the bet
    setLevel(0);
    setStatus('playing');
  };

  const handlePlaceBlock = (success: boolean, currentStackHeight: number) => {
    if (success) {
      setLevel(currentStackHeight);
      // Calculate new winnings: Bet * (1 + level * multiplier)
      // Level starts at 0 for base, so 1st successful stack is level 1
      const multiplier = 1 + (currentStackHeight * WINNINGS_MULTIPLIER);
      const newWinnings = currentBet * multiplier;
      setPotentialWinnings(newWinnings);
    }
  };

  const handleGameOver = () => {
    setStatus('gameover');
    setCurrentBet(0);
    setPotentialWinnings(0);
    setLevel(0);
  };

  const handleCollect = () => {
    setBalance(prev => prev + potentialWinnings);
    setStatus('victory');
  };

  const handleRestart = () => {
    setStatus('idle');
    setPotentialWinnings(0);
    setCurrentBet(0);
    setLevel(0);
  };

  const handleRedeemCode = (code: string): boolean => {
    if (code === AUTHOR_CODE) {
      setBalance(prev => prev + AUTHOR_REWARD);
      return true;
    }
    return false;
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      <StackGame 
        status={status}
        onPlaceBlock={handlePlaceBlock}
        onGameOver={handleGameOver}
        level={level}
      />
      
      <UIOverlay
        balance={balance}
        currentBet={currentBet}
        potentialWinnings={potentialWinnings}
        level={level}
        status={status}
        onStartBetting={handleStartBetting}
        onConfirmBet={handleConfirmBet}
        onCollect={handleCollect}
        onRestart={handleRestart}
        onRedeemCode={handleRedeemCode}
      />
    </div>
  );
};

export default App;
