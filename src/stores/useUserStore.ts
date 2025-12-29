import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { UserProfile } from '../types';
import { userStorage } from '../services/storage';

interface UserState {
  user: UserProfile | null;
  isLoaded: boolean;

  // Actions
  loadUser: () => void;
  setUser: (name: string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoaded: false,

  loadUser: () => {
    const user = userStorage.get();
    set({ user, isLoaded: true });
  },

  setUser: (name: string) => {
    const newUser: UserProfile = {
      id: uuidv4(),
      name,
      createdAt: new Date().toISOString(),
    };

    userStorage.set(newUser);
    set({ user: newUser });
  },

  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;

      const updatedUser = { ...state.user, ...updates };
      userStorage.set(updatedUser);

      return { user: updatedUser };
    });
  },

  clearUser: () => {
    userStorage.clear();
    set({ user: null });
  },
}));
