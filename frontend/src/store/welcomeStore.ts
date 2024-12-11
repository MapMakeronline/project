import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WelcomeStore {
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (value: boolean) => void;
}

export const useWelcomeStore = create<WelcomeStore>()(
  persist(
    (set) => ({
      hasSeenWelcome: false,
      setHasSeenWelcome: (value) => set({ hasSeenWelcome: value }),
    }),
    {
      name: 'welcome-store',
    }
  )
);