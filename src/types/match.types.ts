// ============================================
// MATCH TYPES
// ============================================

export type MatchStatus = 'in_progress' | 'paused' | 'completed';
export type Team = 'us' | 'them';

export interface Match {
  // Identifiants
  id: string;
  createdAt: string;
  completedAt?: string;

  // Statut
  status: MatchStatus;

  // Durée (en secondes)
  duration: number;
  pausedAt?: number;

  // Joueurs
  teamUs: {
    playerLeft: string;
    playerRight: string;
  };

  teamThem: {
    player1: string;
    player2: string;
  };

  // Configuration du match
  config: {
    setsToWin: number;
    tiebreakInFinalSet: boolean;
  };

  // État du match
  currentSet: number;
  sets: Set[];

  // Score final (sets gagnés)
  finalScore: {
    us: number;
    them: number;
  };

  // Résultat
  winner: Team | null;

  // Métadonnées
  version: string;
}

// ============================================
// SET
// ============================================

export interface Set {
  setNumber: number;
  status: 'in_progress' | 'completed';

  // Jeux du set
  currentGame: number;
  games: Game[];

  // Score du set (jeux gagnés)
  score: {
    us: number;
    them: number;
  };

  // Résultat du set
  winner: Team | null;

  // Statistiques du set
  stats: {
    // Touches
    touchesLeft: number;
    touchesRight: number;
    totalTouches: number;

    // Points
    pointsWon: number;
    pointsLost: number;
    totalPoints: number;

    // Moyennes
    avgTouchesPerPoint: number;
    winRate: number;
  };
}

// ============================================
// GAME
// ============================================

export interface Game {
  gameNumber: number;
  status: 'in_progress' | 'completed';
  isTiebreak: boolean;

  // Points du jeu
  currentPoint: number;
  points: Point[];

  // Score du jeu
  score: {
    us: number;
    them: number;
  };

  // État spécial
  isDeuce: boolean;
  advantage: Team | null;

  // Résultat
  winner: Team | null;

  // Statistiques du jeu
  stats: {
    touchesLeft: number;
    touchesRight: number;
    totalTouches: number;
    pointsWon: number;
    pointsLost: number;
  };
}

// ============================================
// POINT
// ============================================

export interface Point {
  pointNumber: number;
  timestamp: string;

  // Touches pendant ce point
  touches: {
    left: number;
    right: number;
  };

  // Résultat du point
  winner: Team;

  // Score APRÈS ce point
  scoreAfter: {
    us: number;
    them: number;
  };

  // Métadonnées optionnelles (v2)
  metadata?: {
    type?: 'ace' | 'winner' | 'unforced_error' | 'normal';
    position?: { x: number; y: number };
  };
}
