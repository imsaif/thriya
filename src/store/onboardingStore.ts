import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingData {
  reason: string | null;
  hardDaySymptoms: string[];
  foodRelationship: string | null;
  ageRange: string | null;
  cycleRegularity: string | null;
  tryingToConceive: string | null;
  setReason: (reason: string) => void;
  setHardDaySymptoms: (symptoms: string[]) => void;
  setFoodRelationship: (food: string) => void;
  setAgeRange: (age: string) => void;
  setCycleRegularity: (regularity: string) => void;
  setTryingToConceive: (ttc: string) => void;
}

export const useOnboardingStore = create<OnboardingData>()(
  persist(
    (set) => ({
      reason: null,
      hardDaySymptoms: [],
      foodRelationship: null,
      ageRange: null,
      cycleRegularity: null,
      tryingToConceive: null,
      setReason: (reason) => set({ reason }),
      setHardDaySymptoms: (symptoms) => set({ hardDaySymptoms: symptoms }),
      setFoodRelationship: (food) => set({ foodRelationship: food }),
      setAgeRange: (age) => set({ ageRange: age }),
      setCycleRegularity: (regularity) => set({ cycleRegularity: regularity }),
      setTryingToConceive: (ttc) => set({ tryingToConceive: ttc }),
    }),
    {
      name: 'thriya_onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
