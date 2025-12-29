import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Match, Team } from '../types';
import { currentMatchStorage } from '../services/storage';
import * as matchEngine from '../services/matchEngine';

interface MatchConfig {
  playerLeft: string;
  playerRight: string;
  adversary1: string;
  adversary2: string;
  setsToWin: number;
  tiebreakInFinalSet: boolean;
}

interface MatchState {
  currentMatch: Match | null;
  currentTouches: {
    left: number;
    right: number;
  };

  // Actions
  loadCurrentMatch: () => void;
  createMatch: (config: MatchConfig) => void;
  addTouch: (player: 'left' | 'right') => void;
  scorePoint: (team: Team) => void;
  undoLastPoint: () => void;
  pauseMatch: () => void;
  resumeMatch: () => void;
  endMatch: () => void;
  clearMatch: () => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  currentMatch: null,
  currentTouches: { left: 0, right: 0 },

  loadCurrentMatch: () => {
    const match = currentMatchStorage.get();
    set({ currentMatch: match });
  },

  createMatch: (config) => {
    const newMatch: Match = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'in_progress',
      duration: 0,
      teamUs: {
        playerLeft: config.playerLeft,
        playerRight: config.playerRight,
      },
      teamThem: {
        player1: config.adversary1,
        player2: config.adversary2,
      },
      config: {
        setsToWin: config.setsToWin,
        tiebreakInFinalSet: config.tiebreakInFinalSet,
      },
      currentSet: 1,
      sets: [
        {
          setNumber: 1,
          status: 'in_progress',
          currentGame: 1,
          games: [
            {
              gameNumber: 1,
              status: 'in_progress',
              isTiebreak: false,
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
            },
          ],
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
        },
      ],
      finalScore: { us: 0, them: 0 },
      winner: null,
      version: '1.0.0',
    };

    currentMatchStorage.set(newMatch);
    set({ currentMatch: newMatch, currentTouches: { left: 0, right: 0 } });
  },

  addTouch: (player) => {
    set((state) => ({
      currentTouches: {
        ...state.currentTouches,
        [player]: state.currentTouches[player] + 1,
      },
    }));
  },

  scorePoint: (team) => {
    set((state) => {
      if (!state.currentMatch) return state;

      // Créer une copie du match pour éviter les mutations directes
      const matchCopy = JSON.parse(JSON.stringify(state.currentMatch)) as Match;

      try {
        // Utiliser le moteur pour calculer le nouveau score
        const result = matchEngine.scorePoint(
          matchCopy,
          team,
          state.currentTouches.left,
          state.currentTouches.right
        );

        // Sauvegarder dans localStorage
        currentMatchStorage.set(matchCopy);

        // Logs pour debug
        if (result.gameWon) {
          console.log('🎾 Jeu gagné!');
        }
        if (result.setWon) {
          console.log('🏆 Set gagné!');
        }
        if (result.matchWon) {
          console.log('🥇 MATCH GAGNÉ!');
        }

        // Reset les touches pour le prochain point
        return {
          currentMatch: matchCopy,
          currentTouches: { left: 0, right: 0 },
        };
      } catch (error) {
        console.error('Erreur lors du calcul du score:', error);
        return state; // Garder l'état actuel en cas d'erreur
      }
    });
  },

  undoLastPoint: () => {
    set((state) => {
      if (!state.currentMatch) return state;

      // Créer une copie du match
      const matchCopy = JSON.parse(JSON.stringify(state.currentMatch)) as Match;

      try {
        const success = matchEngine.undoLastPoint(matchCopy);

        if (success) {
          currentMatchStorage.set(matchCopy);
          console.log('↩️ Point annulé');

          return {
            currentMatch: matchCopy,
            // On garde les touches actuelles (ne les reset pas)
          };
        } else {
          console.warn('Aucun point à annuler');
          return state;
        }
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
        return state;
      }
    });
  },

  pauseMatch: () => {
    set((state) => {
      if (!state.currentMatch) return state;

      const updatedMatch = {
        ...state.currentMatch,
        status: 'paused' as const,
        pausedAt: Date.now(),
      };

      currentMatchStorage.set(updatedMatch);
      return { currentMatch: updatedMatch };
    });
  },

  resumeMatch: () => {
    set((state) => {
      if (!state.currentMatch) return state;

      const updatedMatch = {
        ...state.currentMatch,
        status: 'in_progress' as const,
        pausedAt: undefined,
      };

      currentMatchStorage.set(updatedMatch);
      return { currentMatch: updatedMatch };
    });
  },

  endMatch: () => {
    set((state) => {
      if (!state.currentMatch) return state;

      // TODO: Sauvegarder le match complété dans l'historique
      currentMatchStorage.clear();
      return { currentMatch: null, currentTouches: { left: 0, right: 0 } };
    });
  },

  clearMatch: () => {
    currentMatchStorage.clear();
    set({ currentMatch: null, currentTouches: { left: 0, right: 0 } });
  },
}));
