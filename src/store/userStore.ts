import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CoachLanguage } from '../types';

const ONBOARDING_KEY = 'thriya_onboarding_complete';

interface UserState {
  userName: string | null;
  hasPinSetup: boolean;
  isUnlocked: boolean;
  onboardingComplete: boolean;
  coachLanguage: CoachLanguage;
  setUserName: (name: string) => void;
  setHasPinSetup: (value: boolean) => void;
  setUnlocked: (value: boolean) => void;
  setOnboardingComplete: (value: boolean) => void;
  setCoachLanguage: (lang: CoachLanguage) => void;
  loadOnboardingStatus: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  userName: null,
  hasPinSetup: false,
  isUnlocked: false,
  onboardingComplete: false,
  coachLanguage: 'English',
  setUserName: (name) => set({ userName: name }),
  setHasPinSetup: (value) => set({ hasPinSetup: value }),
  setUnlocked: (value) => set({ isUnlocked: value }),
  setCoachLanguage: (lang) => set({ coachLanguage: lang }),
  setOnboardingComplete: (value) => {
    void AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(value));
    set({ onboardingComplete: value });
  },
  loadOnboardingStatus: async () => {
    const stored = await AsyncStorage.getItem(ONBOARDING_KEY);
    if (stored === 'true') {
      set({ onboardingComplete: true });
    }
  },
}));
