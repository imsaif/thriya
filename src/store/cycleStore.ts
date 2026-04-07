import { create } from 'zustand';

interface CycleState {
  lastPeriodStart: Date | null;
  averageCycleLength: number;
  setLastPeriodStart: (date: Date) => void;
  setAverageCycleLength: (length: number) => void;
}

export const useCycleStore = create<CycleState>((set) => ({
  lastPeriodStart: null,
  averageCycleLength: 30,
  setLastPeriodStart: (date) => set({ lastPeriodStart: date }),
  setAverageCycleLength: (length) => set({ averageCycleLength: length }),
}));
