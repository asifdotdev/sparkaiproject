import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),

  setTokens: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  loadAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      // Token exists - will be verified by API call in the app
      set({ isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
