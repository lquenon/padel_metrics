import { create } from 'zustand';
import type { AppSettings } from '../types';
import { settingsStorage } from '../services/storage';

interface SettingsState {
  settings: AppSettings;

  // Actions
  loadSettings: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: settingsStorage.getOrDefault(),

  loadSettings: () => {
    const settings = settingsStorage.getOrDefault();
    set({ settings });
  },

  updateSettings: (updates) => {
    set((state) => {
      const newSettings = { ...state.settings, ...updates };
      settingsStorage.set(newSettings);
      return { settings: newSettings };
    });
  },

  resetSettings: () => {
    const defaultSettings: AppSettings = {
      defaultSetsToWin: 2,
      tiebreakInFinalSet: true,
      language: 'fr',
      theme: 'dark',
    };

    settingsStorage.set(defaultSettings);
    set({ settings: defaultSettings });
  },
}));
