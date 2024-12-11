import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    email: string;
    name: string;
    picture?: string;
  };
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
