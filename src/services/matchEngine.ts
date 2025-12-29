/**
 * Match Engine - Moteur de calcul du score selon les règles du padel
 */

import type { Match, Set, Game, Point, Team } from '../types';

// ============================================
// TYPES HELPERS
// ============================================

interface ScoreUpdate {
  pointScored: boolean;
  gameWon: boolean;
  setWon: boolean;
  matchWon: boolean;
}

// ============================================
// CONSTANTES
// ============================================

const GAMES_TO_WIN_SET = 6;
const MIN_GAMES_ADVANTAGE = 2;
const TIEBREAK_POINTS = 7;
const TIEBREAK_MIN_ADVANTAGE = 2;

// ============================================
// UTILITAIRES
// ============================================

/**
 * Obtient le set actuel
 */
export function getCurrentSet(match: Match): Set | null {
  return match.sets.find((set) => set.status === 'in_progress') || null;
}

/**
 * Obtient le jeu actuel
 */
export function getCurrentGame(set: Set): Game | null {
  return set.games.find((game) => game.status === 'in_progress') || null;
}

/**
 * Convertit un score numérique en score de tennis
 */
export function formatPointScore(score: number, isTiebreak: boolean): string {
  if (isTiebreak) {
    return score.toString();
  }
  return score <= 40 ? score.toString() : '40';
}

/**
 * Affiche le score en format lisible (ex: "15-30", "40-A")
 */
export function getDisplayScore(
  scoreUs: number,
  scoreThem: number,
  isDeuce: boolean,
  advantage: Team | null,
  isTiebreak: boolean
): string {
  if (isTiebreak) {
    return `${scoreUs}-${scoreThem}`;
  }

  if (isDeuce) {
    if (advantage === 'us') return 'A-40';
    if (advantage === 'them') return '40-A';
    return '40-40';
  }

  return `${scoreUs}-${scoreThem}`;
}

// ============================================
// CALCUL DU SCORE - POINT
// ============================================

/**
 * Calcule le nouveau score après un point marqué
 * Retourne true si le jeu est gagné
 */
export function calculatePointScore(game: Game, winner: Team): boolean {
  const isTiebreak = game.isTiebreak;

  if (isTiebreak) {
    // Tie-break: comptage simple 1, 2, 3...
    game.score[winner]++;

    const scoreUs = game.score.us;
    const scoreThem = game.score.them;

    // Gagné si >= 7 points ET au moins 2 d'écart
    const minScore = Math.min(scoreUs, scoreThem);
    const maxScore = Math.max(scoreUs, scoreThem);

    if (maxScore >= TIEBREAK_POINTS && maxScore - minScore >= TIEBREAK_MIN_ADVANTAGE) {
      game.winner = scoreUs > scoreThem ? 'us' : 'them';
      game.status = 'completed';
      return true; // Jeu (tie-break) gagné
    }

    return false;
  }

  // Jeu normal: 0, 15, 30, 40, Avantage
  const currentScoreUs = game.score.us;
  const currentScoreThem = game.score.them;

  // Cas avec égalité et avantage
  if (game.isDeuce) {
    if (game.advantage === null) {
      // Pas encore d'avantage, on donne l'avantage au gagnant du point
      game.advantage = winner;
      return false;
    } else if (game.advantage === winner) {
      // L'équipe avec avantage marque → Jeu gagné
      game.winner = winner;
      game.status = 'completed';
      return true;
    } else {
      // L'équipe sans avantage marque → Retour égalité
      game.advantage = null;
      return false;
    }
  }

  // Cas jeu gagné : on est à 40 et l'adversaire < 40
  if (currentScoreUs === 40 && currentScoreThem < 40 && winner === 'us') {
    game.winner = 'us';
    game.status = 'completed';
    return true;
  }

  if (currentScoreThem === 40 && currentScoreUs < 40 && winner === 'them') {
    game.winner = 'them';
    game.status = 'completed';
    return true;
  }

  // Incrémenter le score du gagnant du point
  if (winner === 'us') {
    game.score.us = Math.min(currentScoreUs + 15, 40);
  } else {
    game.score.them = Math.min(currentScoreThem + 15, 40);
  }

  // Cas 40-40 (égalité / deuce)
  if (game.score.us === 40 && game.score.them === 40) {
    game.isDeuce = true;
    game.advantage = null;
    return false;
  }

  return false;
}

// ============================================
// CALCUL DU SCORE - JEU
// ============================================

/**
 * Crée un nouveau jeu
 */
export function createNewGame(gameNumber: number, isTiebreak = false): Game {
  return {
    gameNumber,
    status: 'in_progress',
    isTiebreak,
    currentPoint: 1,
    points: [],
    score: { us: 0, them: 0 },
    isDeuce: false,
    advantage: null,
    winner: null,
    stats: {
      touchesLeft: 0,
      touchesRight: 0,
      totalTouches: 0,
      pointsWon: 0,
      pointsLost: 0,
    },
  };
}

/**
 * Calcule le nouveau score de jeux après un jeu gagné
 * Retourne true si le set est gagné
 */
export function calculateGameScore(set: Set, winner: Team, useTiebreak: boolean): boolean {
  // Incrémenter le score de jeux
  set.score[winner]++;

  const scoreUs = set.score.us;
  const scoreThem = set.score.them;

  // Vérifier si set gagné
  const minScore = Math.min(scoreUs, scoreThem);
  const maxScore = Math.max(scoreUs, scoreThem);
  const winnerScore = scoreUs > scoreThem ? scoreUs : scoreThem;

  // Set gagné si >= 6 jeux ET au moins 2 d'écart
  if (winnerScore >= GAMES_TO_WIN_SET && maxScore - minScore >= MIN_GAMES_ADVANTAGE) {
    set.winner = scoreUs > scoreThem ? 'us' : 'them';
    set.status = 'completed';
    return true; // Set gagné
  }

  // Cas 6-6: Tie-break (si activé)
  if (scoreUs === 6 && scoreThem === 6) {
    if (useTiebreak) {
      // Créer un jeu de tie-break
      const tiebreakGame = createNewGame(set.games.length + 1, true);
      set.games.push(tiebreakGame);
      set.currentGame = tiebreakGame.gameNumber;
      return false;
    }
    // Sinon, jeu décisif continue jusqu'à écart de 2
  }

  // Créer le prochain jeu normal
  const nextGame = createNewGame(set.games.length + 1, false);
  set.games.push(nextGame);
  set.currentGame = nextGame.gameNumber;

  return false; // Set continue
}

// ============================================
// CALCUL DU SCORE - SET
// ============================================

/**
 * Crée un nouveau set
 */
export function createNewSet(setNumber: number): Set {
  const firstGame = createNewGame(1, false);

  return {
    setNumber,
    status: 'in_progress',
    currentGame: 1,
    games: [firstGame],
    score: { us: 0, them: 0 },
    winner: null,
    stats: {
      touchesLeft: 0,
      touchesRight: 0,
      totalTouches: 0,
      pointsWon: 0,
      pointsLost: 0,
      totalPoints: 0,
      avgTouchesPerPoint: 0,
      winRate: 0,
    },
  };
}

/**
 * Calcule le nouveau score de sets après un set gagné
 * Retourne true si le match est gagné
 */
export function calculateSetScore(match: Match, winner: Team): boolean {
  // Incrémenter le score de sets
  match.finalScore[winner]++;

  const scoreUs = match.finalScore.us;
  const scoreThem = match.finalScore.them;
  const setsToWin = match.config.setsToWin;

  // Vérifier si match gagné
  if (scoreUs === setsToWin || scoreThem === setsToWin) {
    match.winner = scoreUs > scoreThem ? 'us' : 'them';
    match.status = 'completed';
    match.completedAt = new Date().toISOString();
    return true; // Match gagné
  }

  // Créer le prochain set
  const nextSetNumber = match.sets.length + 1;
  const nextSet = createNewSet(nextSetNumber);
  match.sets.push(nextSet);
  match.currentSet = nextSetNumber;

  return false; // Match continue
}

// ============================================
// FONCTION PRINCIPALE - MARQUER UN POINT
// ============================================

/**
 * Fonction principale: Marque un point et met à jour tout le match
 */
export function scorePoint(
  match: Match,
  winner: Team,
  touchesLeft: number,
  touchesRight: number
): ScoreUpdate {
  const currentSet = getCurrentSet(match);
  if (!currentSet) {
    throw new Error('No current set found');
  }

  const currentGame = getCurrentGame(currentSet);
  if (!currentGame) {
    throw new Error('No current game found');
  }

  // 1. Capturer le score AVANT le point
  const scoreBefore = {
    us: currentGame.score.us,
    them: currentGame.score.them,
  };

  // 2. Mettre à jour les stats du jeu
  currentGame.stats.touchesLeft += touchesLeft;
  currentGame.stats.touchesRight += touchesRight;
  currentGame.stats.totalTouches += touchesLeft + touchesRight;
  if (winner === 'us') {
    currentGame.stats.pointsWon++;
  } else {
    currentGame.stats.pointsLost++;
  }

  // 3. Calculer le nouveau score de point
  const gameWon = calculatePointScore(currentGame, winner);

  // 4. Créer le Point object avec scores avant/après
  const point: Point = {
    pointNumber: currentGame.points.length + 1,
    timestamp: new Date().toISOString(),
    touches: {
      left: touchesLeft,
      right: touchesRight,
    },
    winner,
    scoreBefore,
    scoreAfter: {
      us: currentGame.score.us,
      them: currentGame.score.them,
    },
  };

  // 5. Sauvegarder le point
  currentGame.points.push(point);
  currentGame.currentPoint++;

  let setWon = false;
  let matchWon = false;

  // 5. Si jeu gagné, calculer le score de jeux
  if (gameWon) {
    const gameWinner = currentGame.winner!;

    // Mettre à jour stats du set
    currentSet.stats.touchesLeft += currentGame.stats.touchesLeft;
    currentSet.stats.touchesRight += currentGame.stats.touchesRight;
    currentSet.stats.totalTouches += currentGame.stats.totalTouches;
    if (gameWinner === 'us') {
      currentSet.stats.pointsWon += currentGame.stats.pointsWon;
      currentSet.stats.pointsLost += currentGame.stats.pointsLost;
    } else {
      currentSet.stats.pointsWon += currentGame.stats.pointsLost;
      currentSet.stats.pointsLost += currentGame.stats.pointsWon;
    }
    currentSet.stats.totalPoints += currentGame.points.length;

    // Calculer set
    setWon = calculateGameScore(currentSet, gameWinner, match.config.tiebreakInFinalSet);

    // 6. Si set gagné, calculer le score de sets
    if (setWon) {
      const setWinner = currentSet.winner!;

      // Calculer moyennes du set
      if (currentSet.stats.totalPoints > 0) {
        currentSet.stats.avgTouchesPerPoint =
          currentSet.stats.totalTouches / currentSet.stats.totalPoints;
        currentSet.stats.winRate =
          (currentSet.stats.pointsWon / currentSet.stats.totalPoints) * 100;
      }

      // Calculer match
      matchWon = calculateSetScore(match, setWinner);
    }
  }

  // 7. Mettre à jour la durée (sera géré par le composant avec chrono)
  // match.duration sera mis à jour par le useMatchStore

  return {
    pointScored: true,
    gameWon,
    setWon,
    matchWon,
  };
}

// ============================================
// ANNULATION DU DERNIER POINT
// ============================================

/**
 * Annule le dernier point marqué
 */
export function undoLastPoint(match: Match): boolean {
  const currentSet = getCurrentSet(match);
  if (!currentSet) return false;

  const currentGame = getCurrentGame(currentSet);

  // Cas 1 : Le jeu actuel a des points → annuler le dernier point du jeu actuel
  if (currentGame && currentGame.points.length > 0) {
    const lastPoint = currentGame.points.pop()!;

    // Restaurer les stats
    currentGame.stats.touchesLeft -= lastPoint.touches.left;
    currentGame.stats.touchesRight -= lastPoint.touches.right;
    currentGame.stats.totalTouches -= lastPoint.touches.left + lastPoint.touches.right;

    if (lastPoint.winner === 'us') {
      currentGame.stats.pointsWon--;
    } else {
      currentGame.stats.pointsLost--;
    }

    currentGame.currentPoint--;

    // Restaurer le score EXACT depuis scoreBefore
    currentGame.score.us = lastPoint.scoreBefore.us;
    currentGame.score.them = lastPoint.scoreBefore.them;

    // Recalculer deuce/advantage
    if (currentGame.score.us === 40 && currentGame.score.them === 40) {
      currentGame.isDeuce = true;
      currentGame.advantage = null;
    } else {
      currentGame.isDeuce = false;
      currentGame.advantage = null;
    }

    return true;
  }

  // Cas 2 : Le jeu actuel n'a pas de points → essayer le jeu précédent du set actuel
  if (currentSet.games.length > 1) {
    const previousGame = currentSet.games[currentSet.games.length - 2];
    if (previousGame.points.length > 0) {
      // Annuler le dernier point du jeu précédent
      const lastPoint = previousGame.points.pop()!;

      // Restaurer les stats
      previousGame.stats.touchesLeft -= lastPoint.touches.left;
      previousGame.stats.touchesRight -= lastPoint.touches.right;
      previousGame.stats.totalTouches -= lastPoint.touches.left + lastPoint.touches.right;

      if (lastPoint.winner === 'us') {
        previousGame.stats.pointsWon--;
      } else {
        previousGame.stats.pointsLost--;
      }

      // Supprimer le jeu actuel (qui n'a pas de points)
      currentSet.games.pop();
      currentSet.currentGame = previousGame.gameNumber;

      // Remettre le jeu précédent en cours
      previousGame.status = 'in_progress';
      previousGame.winner = null;

      // Restaurer le score EXACT du jeu depuis scoreBefore
      previousGame.score.us = lastPoint.scoreBefore.us;
      previousGame.score.them = lastPoint.scoreBefore.them;

      // Recalculer deuce/advantage
      if (previousGame.score.us === 40 && previousGame.score.them === 40) {
        previousGame.isDeuce = true;
        previousGame.advantage = null;
      } else {
        previousGame.isDeuce = false;
        previousGame.advantage = null;
      }

      // Décrémenter le score de jeux
      const gameWinner = lastPoint.winner;
      if (currentSet.score[gameWinner] > 0) {
        currentSet.score[gameWinner]--;
      }

      return true;
    }
  }

  // Cas 3 : Le set actuel n'a pas de points → essayer le set précédent
  if (match.sets.length > 1) {
    const previousSet = match.sets[match.sets.length - 2];
    if (previousSet.games.length > 0) {
      const lastGameOfPreviousSet = previousSet.games[previousSet.games.length - 1];
      if (lastGameOfPreviousSet.points.length > 0) {
        // Annuler le dernier point du set précédent
        const lastPoint = lastGameOfPreviousSet.points.pop()!;

        // Restaurer les stats du jeu
        lastGameOfPreviousSet.stats.touchesLeft -= lastPoint.touches.left;
        lastGameOfPreviousSet.stats.touchesRight -= lastPoint.touches.right;
        lastGameOfPreviousSet.stats.totalTouches -= lastPoint.touches.left + lastPoint.touches.right;

        if (lastPoint.winner === 'us') {
          lastGameOfPreviousSet.stats.pointsWon--;
        } else {
          lastGameOfPreviousSet.stats.pointsLost--;
        }

        // Supprimer le set actuel (qui n'a pas de points)
        match.sets.pop();
        match.currentSet = previousSet.setNumber;

        // Remettre le set précédent en cours
        previousSet.status = 'in_progress';
        previousSet.winner = null;

        // Remettre le dernier jeu en cours
        lastGameOfPreviousSet.status = 'in_progress';
        lastGameOfPreviousSet.winner = null;

        // Restaurer le score EXACT du jeu depuis scoreBefore
        lastGameOfPreviousSet.score.us = lastPoint.scoreBefore.us;
        lastGameOfPreviousSet.score.them = lastPoint.scoreBefore.them;

        // Recalculer deuce/advantage
        if (lastGameOfPreviousSet.score.us === 40 && lastGameOfPreviousSet.score.them === 40) {
          lastGameOfPreviousSet.isDeuce = true;
          lastGameOfPreviousSet.advantage = null;
        } else {
          lastGameOfPreviousSet.isDeuce = false;
          lastGameOfPreviousSet.advantage = null;
        }

        // Décrémenter le score de sets
        if (match.finalScore[lastPoint.winner] > 0) {
          match.finalScore[lastPoint.winner]--;
        }

        // Rétablir le statut du match si nécessaire
        if (match.status === 'completed') {
          match.status = 'in_progress';
          match.winner = null;
          match.completedAt = undefined;
        }

        return true;
      }
    }
  }

  return false;
}

// ============================================
// HELPERS D'AFFICHAGE
// ============================================

/**
 * Retourne un résumé textuel du score actuel
 */
export function getMatchSummary(match: Match): string {
  const currentSet = getCurrentSet(match);
  if (!currentSet) {
    return `Match terminé: ${match.finalScore.us}-${match.finalScore.them}`;
  }

  const currentGame = getCurrentGame(currentSet);
  if (!currentGame) {
    return `Set ${currentSet.setNumber}`;
  }

  const pointScore = getDisplayScore(
    currentGame.score.us,
    currentGame.score.them,
    currentGame.isDeuce,
    currentGame.advantage,
    currentGame.isTiebreak
  );

  return `Set ${currentSet.setNumber} • ${currentSet.score.us}-${currentSet.score.them} • ${pointScore}`;
}

/**
 * Retourne le score complet des sets pour l'affichage
 */
export function getSetsScores(match: Match): Array<{ setNumber: number; us: number; them: number; completed: boolean }> {
  return match.sets.map((set) => ({
    setNumber: set.setNumber,
    us: set.score.us,
    them: set.score.them,
    completed: set.status === 'completed',
  }));
}
