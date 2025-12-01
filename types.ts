export interface BlockState {
  id: number;
  width: number;
  left: number;
  bottom: number; // Position from bottom in percentage or pixels
  color: string;
}

export interface DebrisState {
  id: number;
  width: number;
  left: number;
  bottom: number;
  color: string;
  rotation: number;
  velocity: { x: number; y: number };
}

export type GameStatus = 'idle' | 'betting' | 'playing' | 'gameover' | 'victory';

export interface PlayerStats {
  balance: number;
  currentBet: number;
  authorCodeRedeemed: boolean;
}
