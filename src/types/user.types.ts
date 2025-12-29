// ============================================
// USER & SETTINGS TYPES
// ============================================

export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  avatar?: string;
}

export interface AppSettings {
  defaultSetsToWin: 2 | 3;
  tiebreakInFinalSet: boolean;
  language: 'fr';
  theme: 'dark';
}

export interface AppData {
  user: UserProfile;
  matches: any[];
  settings: AppSettings;
}
