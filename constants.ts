
export const INITIAL_BALANCE = 5000;

export const AUTHOR_CODE = "Iliapik10";
export const AUTHOR_REWARD = 1000000;

export const SLOT_SYMBOLS = ['🍒', '🍋', '🍉', '🍇', '🔔', '⭐', '💎', '7️⃣', '🍀', '💰'];

/**
 * SLOT WEIGHTS
 * Higher weight = more frequent appearance on the reel.
 * Total weight across all symbols defines the probability space.
 */
export const SLOT_WEIGHTS: Record<string, number> = {
  '🍒': 25,
  '🍋': 20,
  '🍉': 15,
  '🍇': 12,
  '🔔': 8,
  '⭐': 6,
  '💎': 5,
  '7️⃣': 4,
  '🍀': 3,
  '💰': 2
};

/**
 * Payouts targeting an overall slot RTP of ~88-90%
 * Calibrated with weighted random selection and pair rewards.
 */
export const SLOT_PAYOUTS: Record<string, number> = {
  '🍒': 2,
  '🍋': 4,
  '🍉': 6,
  '🍇': 10,
  '🔔': 20,
  '⭐': 40,
  '💎': 80,
  '7️⃣': 200,
  '🍀': 500,
  '💰': 1000 
};

export const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e',
];

export const BLOCK_HEIGHT = 60;
export const STACKER_INCREMENT = 0.25;

export const DIFFICULTY_SETTINGS = {
  easy: {
    label: 'Novice',
    initialWidth: 60,
    speedBase: 0.5,
    speedIncrement: 0.1,
  },
  medium: {
    label: 'Pro',
    initialWidth: 40,
    speedBase: 0.8,
    speedIncrement: 0.15,
  },
  hard: {
    label: 'Elite',
    initialWidth: 25,
    speedBase: 1.2,
    speedIncrement: 0.2,
  },
} as const;
