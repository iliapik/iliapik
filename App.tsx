
import React, { useState, useEffect } from 'react';
import GameHub from './components/GameHub';
import TwentyOne from './components/TwentyOne';
import Roulette from './components/Roulette';
import Slots from './components/Slots';
import Farm from './components/Farm';
import MusicPlayer from './components/MusicPlayer';
import { Screen } from './types';
import { AUTHOR_CODE, AUTHOR_REWARD, INITIAL_BALANCE } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('hub');
  const [musicVolume, setMusicVolume] = useState(40);
  
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('mopscoin_balance');
    return saved ? parseInt(saved) : INITIAL_BALANCE;
  });

  useEffect(() => {
    localStorage.setItem('mopscoin_balance', balance.toString());
  }, [balance]);

  const handleBackToHub = () => {
    setScreen('hub');
  };

  const handleRedeemCode = (code: string): boolean => {
    if (code === AUTHOR_CODE) {
      setBalance(prev => prev + AUTHOR_REWARD);
      return true;
    }
    return false;
  };

  return (
    <div className="relative w-full h-screen bg-[#0f172a] overflow-hidden font-sans text-slate-100">
      <MusicPlayer volume={musicVolume} />

      {screen === 'hub' && (
        <GameHub 
          onSelectGame={setScreen} 
          balance={balance} 
          musicVolume={musicVolume}
          setMusicVolume={setMusicVolume}
          onRedeemCode={handleRedeemCode}
        />
      )}

      {screen === 'twenty-one' && (
        <TwentyOne 
          balance={balance} 
          onWin={amt => setBalance(b => b + amt)} 
          onLose={amt => setBalance(b => b - amt)}
          onBack={handleBackToHub}
        />
      )}

      {screen === 'roulette' && (
        <Roulette 
          balance={balance} 
          onWin={amt => setBalance(b => b + amt)} 
          onLose={amt => setBalance(b => b - amt)}
          onBack={handleBackToHub}
        />
      )}

      {screen === 'slots' && (
        <Slots 
          balance={balance} 
          onWin={amt => setBalance(b => b + amt)} 
          onLose={amt => setBalance(b => b - amt)}
          onBack={handleBackToHub}
        />
      )}

      {screen === 'farm' && (
        <Farm 
          onEarn={() => setBalance(b => b + 1)}
          onBack={handleBackToHub}
        />
      )}
    </div>
  );
};

export default App;
