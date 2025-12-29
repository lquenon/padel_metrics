/**
 * Storage Service - Interface pour localStorage
 * Gère la persistance de toutes les données de l'app
 */

import type { UserProfile, AppSettings, Match } from '../types';

// Clés localStorage
const STORAGE_KEYS = {
  USER: 'padeltracker_user',
  SETTINGS: 'padeltracker_settings',
  MATCHES: 'padeltracker_matches',
  CURRENT_MATCH: 'padeltracker_current',
  VERSION: 'padeltracker_version',
} as const;

const CURRENT_VERSION = '1.0.0';

// ============================================
// HELPERS
// ============================================

function safeGet<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

// ============================================
// USER
// ============================================

export const userStorage = {
  get: (): UserProfile | null => {
    return safeGet<UserProfile>(STORAGE_KEYS.USER);
  },

  set: (user: UserProfile): boolean => {
    return safeSet(STORAGE_KEYS.USER, user);
  },

  clear: (): void => {
    safeRemove(STORAGE_KEYS.USER);
  },
};

// ============================================
// SETTINGS
// ============================================

export const settingsStorage = {
  get: (): AppSettings | null => {
    return safeGet<AppSettings>(STORAGE_KEYS.SETTINGS);
  },

  set: (settings: AppSettings): boolean => {
    return safeSet(STORAGE_KEYS.SETTINGS, settings);
  },

  getOrDefault: (): AppSettings => {
    const settings = safeGet<AppSettings>(STORAGE_KEYS.SETTINGS);
    if (settings) return settings;

    // Valeurs par défaut
    const defaultSettings: AppSettings = {
      defaultSetsToWin: 2,
      tiebreakInFinalSet: true,
      language: 'fr',
      theme: 'dark',
    };

    safeSet(STORAGE_KEYS.SETTINGS, defaultSettings);
    return defaultSettings;
  },

  clear: (): void => {
    safeRemove(STORAGE_KEYS.SETTINGS);
  },
};

// ============================================
// MATCHES
// ============================================

export const matchesStorage = {
  getAll: (): Match[] => {
    return safeGet<Match[]>(STORAGE_KEYS.MATCHES) || [];
  },

  set: (matches: Match[]): boolean => {
    return safeSet(STORAGE_KEYS.MATCHES, matches);
  },

  add: (match: Match): boolean => {
    const matches = matchesStorage.getAll();
    matches.push(match);
    return safeSet(STORAGE_KEYS.MATCHES, matches);
  },

  update: (matchId: string, updatedMatch: Match): boolean => {
    const matches = matchesStorage.getAll();
    const index = matches.findIndex((m) => m.id === matchId);

    if (index === -1) return false;

    matches[index] = updatedMatch;
    return safeSet(STORAGE_KEYS.MATCHES, matches);
  },

  remove: (matchId: string): boolean => {
    const matches = matchesStorage.getAll();
    const filtered = matches.filter((m) => m.id !== matchId);
    return safeSet(STORAGE_KEYS.MATCHES, filtered);
  },

  clear: (): void => {
    safeRemove(STORAGE_KEYS.MATCHES);
  },
};

// ============================================
// CURRENT MATCH
// ============================================

export const currentMatchStorage = {
  get: (): Match | null => {
    return safeGet<Match>(STORAGE_KEYS.CURRENT_MATCH);
  },

  set: (match: Match): boolean => {
    return safeSet(STORAGE_KEYS.CURRENT_MATCH, match);
  },

  clear: (): void => {
    safeRemove(STORAGE_KEYS.CURRENT_MATCH);
  },
};

// ============================================
// VERSION & MIGRATIONS
// ============================================

export const versionStorage = {
  get: (): string | null => {
    return safeGet<string>(STORAGE_KEYS.VERSION);
  },

  set: (version: string): boolean => {
    return safeSet(STORAGE_KEYS.VERSION, version);
  },

  check: (): boolean => {
    const stored = versionStorage.get();
    if (!stored) {
      versionStorage.set(CURRENT_VERSION);
      return true;
    }
    return stored === CURRENT_VERSION;
  },
};

// ============================================
// GLOBAL OPERATIONS
// ============================================

export const storage = {
  /**
   * Exporte toutes les données en JSON
   */
  exportAll: () => {
    return {
      version: CURRENT_VERSION,
      user: userStorage.get(),
      settings: settingsStorage.get(),
      matches: matchesStorage.getAll(),
      currentMatch: currentMatchStorage.get(),
      exportedAt: new Date().toISOString(),
    };
  },

  /**
   * Importe des données depuis un export JSON
   */
  importAll: (data: any): boolean => {
    try {
      if (data.user) userStorage.set(data.user);
      if (data.settings) settingsStorage.set(data.settings);
      if (data.matches) matchesStorage.set(data.matches);
      if (data.currentMatch) currentMatchStorage.set(data.currentMatch);
      if (data.version) versionStorage.set(data.version);

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  /**
   * Efface TOUTES les données
   */
  clearAll: (): void => {
    userStorage.clear();
    settingsStorage.clear();
    matchesStorage.clear();
    currentMatchStorage.clear();
    safeRemove(STORAGE_KEYS.VERSION);
  },

  /**
   * Vérifie si le stockage fonctionne
   */
  isAvailable: (): boolean => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};

export default storage;
