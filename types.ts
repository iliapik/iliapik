
// Define the possible statuses for the game flow
export type GameStatus = 'idle' | 'playing' | 'betting' | 'gameover' | 'victory';
// Define the available screens in the casino
export type Screen = 'hub' | 'twenty-one' | 'roulette' | 'slots';
// Define difficulty levels for the Stacker game
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PlayerStats {
  balance: number;
  currentBet: number;
}