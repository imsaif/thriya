import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyLog } from '../types';

interface LogState {
  todayLog: DailyLog | null;
  setTodayLog: (log: DailyLog | null) => void;
}

export const useLogStore = create<LogState>()(
  persist(
    (set) => ({
      todayLog: null,
      setTodayLog: (log) => set({ todayLog: log }),
    }),
    {
      name: 'thriya_log',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
