import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CoachLanguage } from '../types';

interface UserState {
  userName: string | null;
  hasPinSetup: boolean;
  isUnlocked: boolean;
  onboardingComplete: boolean;
  coachLanguage: CoachLanguage;
  languageChosen: boolean;
  setUserName: (name: string) => void;
  setHasPinSetup: (value: boolean) => void;
  setUnlocked: (value: boolean) => void;
  setOnboardingComplete: (value: boolean) => void;
  setCoachLanguage: (lang: CoachLanguage) => void;
  setLanguageChosen: (value: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      hasPinSetup: false,
      isUnlocked: false,
      onboardingComplete: false,
      coachLanguage: 'English',
      languageChosen: false,
      setUserName: (name) => set({ userName: name }),
      setHasPinSetup: (value) => set({ hasPinSetup: value }),
      setUnlocked: (value) => set({ isUnlocked: value }),
      setCoachLanguage: (lang) => set({ coachLanguage: lang }),
      setLanguageChosen: (value) => set({ languageChosen: value }),
      setOnboardingComplete: (value) => set({ onboardingComplete: value }),
    }),
    {
      name: 'thriya_user',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userName: state.userName,
        hasPinSetup: state.hasPinSetup,
        onboardingComplete: state.onboardingComplete,
        coachLanguage: state.coachLanguage,
        languageChosen: state.languageChosen,
      }),
    }
  )
);
