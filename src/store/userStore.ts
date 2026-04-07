import { create } from 'zustand';

interface UserState {
  userName: string | null;
  hasPinSetup: boolean;
  isUnlocked: boolean;
  setUserName: (name: string) => void;
  setHasPinSetup: (value: boolean) => void;
  setUnlocked: (value: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userName: null,
  hasPinSetup: false,
  isUnlocked: false,
  setUserName: (name) => set({ userName: name }),
  setHasPinSetup: (value) => set({ hasPinSetup: value }),
  setUnlocked: (value) => set({ isUnlocked: value }),
}));
