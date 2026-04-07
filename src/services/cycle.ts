export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';

export interface CycleContext {
  phase: CyclePhase;
  dayOfCycle: number;
  daysUntilNextPeriod: number | null;
  phaseLabel: string;
  cardText: string;
}

export function getCycleContext(
  lastPeriodStart: Date | null,
  averageCycleLength: number = 30
): CycleContext {
  if (!lastPeriodStart) {
    return {
      phase: 'unknown',
      dayOfCycle: 0,
      daysUntilNextPeriod: null,
      phaseLabel: 'Getting to know you',
      cardText:
        'We are still learning your cycle. Keep logging and Thriya will start showing you what your patterns mean.',
    };
  }

  const today = new Date();
  const dayOfCycle =
    Math.floor(
      (today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const nextPeriod = new Date(lastPeriodStart);
  nextPeriod.setDate(nextPeriod.getDate() + averageCycleLength);
  const daysUntilNextPeriod = Math.ceil(
    (nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let phase: CyclePhase;
  if (dayOfCycle <= 5) phase = 'menstrual';
  else if (dayOfCycle <= 12) phase = 'follicular';
  else if (dayOfCycle <= 16) phase = 'ovulatory';
  else phase = 'luteal';

  return {
    phase,
    dayOfCycle,
    daysUntilNextPeriod,
    phaseLabel: getPhaseLabel(phase),
    cardText: getPhaseCardText(phase),
  };
}

function getPhaseLabel(phase: CyclePhase): string {
  const labels: Record<CyclePhase, string> = {
    menstrual: 'Menstrual phase',
    follicular: 'Follicular phase',
    ovulatory: 'Ovulatory phase',
    luteal: 'Luteal phase',
    unknown: 'Getting to know you',
  };
  return labels[phase];
}

function getPhaseCardText(phase: CyclePhase): string {
  const texts: Record<CyclePhase, string> = {
    menstrual:
      'Your period is here. Iron-rich foods help more than you might expect right now. Your body is working hard.',
    follicular:
      'Your energy is likely building this week. This is often when focus comes more easily. A good time for things that need mental clarity.',
    ovulatory:
      'You are around mid-cycle. Many women feel their most social and energetic right now. It is not a coincidence, it is oestrogen.',
    luteal:
      'The second half of your cycle has started. If cravings feel stronger this week, that is progesterone, not a lack of willpower.',
    unknown:
      'We are still learning your cycle. Keep logging and Thriya will start showing you what your patterns mean.',
  };
  return texts[phase];
}
