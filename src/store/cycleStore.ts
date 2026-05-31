import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CycleState {
  lastPeriodStart: Date | null;
  averageCycleLength: number;
  setLastPeriodStart: (date: Date) => void;
  setAverageCycleLength: (length: number) => void;
}

export const useCycleStore = create<CycleState>()(
  persist(
    (set) => ({
      lastPeriodStart: null,
      averageCycleLength: 30,
      setLastPeriodStart: (date) => set({ lastPeriodStart: date }),
      setAverageCycleLength: (length) => set({ averageCycleLength: length }),
    }),
    {
      name: 'thriya_cycle',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lastPeriodStart: state.lastPeriodStart,
        averageCycleLength: state.averageCycleLength,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.lastPeriodStart && typeof state.lastPeriodStart === 'string') {
          state.lastPeriodStart = new Date(state.lastPeriodStart);
        }
      },
    }
  )
);
