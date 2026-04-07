import { create } from 'zustand';
import type { CyclePhase } from '../types';

interface CycleState {
  phase: CyclePhase;
  dayOfCycle: number;
  daysUntilNextPeriod: number | null;
}

export const useCycleStore = create<CycleState>(() => ({
  phase: 'unknown',
  dayOfCycle: 0,
  daysUntilNextPeriod: null,
}));
