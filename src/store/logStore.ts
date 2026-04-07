import { create } from 'zustand';
import type { DailyLog } from '../types';

interface LogState {
  todayLog: DailyLog | null;
  setTodayLog: (log: DailyLog | null) => void;
}

export const useLogStore = create<LogState>((set) => ({
  todayLog: null,
  setTodayLog: (log) => set({ todayLog: log }),
}));
