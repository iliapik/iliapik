
import React, { useEffect, useRef } from 'react';

interface MusicPlayerProps {
  volume: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ volume }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      // Upbeat synthwave background track
      audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
      audioRef.current.loop = true;
    }
    
    audioRef.current.volume = volume / 100;
    
    const playAudio = () => {
      audioRef.current?.play().catch(() => {
        // Autoplay might be blocked until first interaction
      });
    };

    window.addEventListener('click', playAudio, { once: true });
    return () => window.removeEventListener('click', playAudio);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return null;
};

export default MusicPlayer;
