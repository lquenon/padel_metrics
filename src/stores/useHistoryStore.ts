import { create } from 'zustand';
import type { Match } from '../types';
import { matchesStorage } from '../services/storage';

interface HistoryState {
  matches: Match[];
  isLoaded: boolean;

  // Actions
  loadMatches: () => void;
  addMatch: (match: Match) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  removeMatch: (matchId: string) => void;
  clearHistory: () => void;
  clearMatches: () => void;
  replaceMatches: (matches: Match[]) => void;

  // Getters
  getMatchById: (matchId: string) => Match | undefined;
  getCompletedMatches: () => Match[];
  getTotalWins: () => number;
  getTotalLosses: () => number;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  matches: [],
  isLoaded: false,

  loadMatches: () => {
    const matches = matchesStorage.getAll();
    set({ matches, isLoaded: true });
  },

  addMatch: (match) => {
    matchesStorage.add(match);
    set((state) => ({
      matches: [...state.matches, match],
    }));
  },

  updateMatch: (matchId, updates) => {
    const matches = get().matches;
    const index = matches.findIndex((m) => m.id === matchId);

    if (index === -1) return;

    const updatedMatch = { ...matches[index], ...updates };
    matchesStorage.update(matchId, updatedMatch);

    set((state) => {
      const newMatches = [...state.matches];
      newMatches[index] = updatedMatch;
      return { matches: newMatches };
    });
  },

  removeMatch: (matchId) => {
    matchesStorage.remove(matchId);
    set((state) => ({
      matches: state.matches.filter((m) => m.id !== matchId),
    }));
  },

  clearHistory: () => {
    matchesStorage.clear();
    set({ matches: [] });
  },

  clearMatches: () => {
    matchesStorage.clear();
    set({ matches: [] });
  },

  replaceMatches: (matches) => {
    matchesStorage.clear();
    matches.forEach((match) => matchesStorage.add(match));
    set({ matches });
  },

  getMatchById: (matchId) => {
    return get().matches.find((m) => m.id === matchId);
  },

  getCompletedMatches: () => {
    return get().matches.filter((m) => m.status === 'completed');
  },

  getTotalWins: () => {
    return get()
      .matches.filter((m) => m.status === 'completed' && m.winner === 'us')
      .length;
  },

  getTotalLosses: () => {
    return get()
      .matches.filter((m) => m.status === 'completed' && m.winner === 'them')
      .length;
  },
}));
