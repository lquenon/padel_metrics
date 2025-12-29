// ============================================
// STATISTICS TYPES
// ============================================

import type { Match } from './match.types';

export interface MatchHistory {
  matches: Match[];
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  currentStreak: {
    type: 'win' | 'loss';
    count: number;
  };
  bestWinStreak: {
    count: number;
    startDate: string;
    endDate: string;
  };
}

export interface PlayerStats {
  playerId: string;
  totalMatches: number;
  matchesWithYou: number;
  winsWithYou: number;
  winRateWithYou: number;
  avgTouchesPerMatch: number;
  totalTouches: number;
}

export interface GlobalStats {
  // Matchs
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;

  // Touches
  totalTouches: number;
  avgTouchesPerMatch: number;

  // Temps
  totalDurationSeconds: number;
  avgDurationSeconds: number;

  // Points
  totalPointsWon: number;
  totalPointsLost: number;
  avgPointsWonPerMatch: number;

  // Partenaires
  partners: PlayerStats[];

  // Streaks
  currentStreak: { type: 'win' | 'loss'; count: number };
  bestWinStreak: number;
}
