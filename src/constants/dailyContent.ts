import type { CyclePhase } from '../services/cycle';

export type TipIcon = 'heart' | 'walking' | 'fire' | 'brain' | 'bolt' | 'cake' | 'scale' | 'drop' | 'sparkles' | 'moon' | 'leaf' | 'pencil';

export interface DailyContent {
  message: string;
  tip: string;
  tipIcon: TipIcon;
}

const menstrualContent: DailyContent[] = [
  {
    message: 'Your body is doing a lot right now. Be gentle with yourself today.',
    tip: 'Iron-rich foods like spinach, lentils, or dark chocolate can help replenish what your body is losing.',
    tipIcon: 'heart',
  },
  {
    message: 'Low energy today is not laziness. It is biology.',
    tip: 'Gentle movement like a slow walk or stretching can actually ease cramps better than staying still.',
    tipIcon: 'walking',
  },
  {
    message: 'If everything feels heavier today, that is real. Your hormones are at their lowest point.',
    tip: 'Warm drinks and heat pads are not just comfort. They increase blood flow and reduce cramping.',
    tipIcon: 'fire',
  },
];

const follicularContent: DailyContent[] = [
  {
    message: 'Your energy is climbing. This is your week to tackle things that felt hard last week.',
    tip: 'Estrogen is rising, which helps with focus and memory. A good time for planning or learning something new.',
    tipIcon: 'brain',
  },
  {
    message: 'Notice how things feel a little lighter? That is your follicular phase working for you.',
    tip: 'Your body responds well to higher intensity exercise this week. Try a brisk walk, dance, or strength training.',
    tipIcon: 'bolt',
  },
  {
    message: 'You might find it easier to make decisions this week. Trust that clarity.',
    tip: 'This is a great time to batch-cook healthy meals. You have the energy now that you might not have later.',
    tipIcon: 'cake',
  },
];

const ovulatoryContent: DailyContent[] = [
  {
    message: 'You are likely at your most social and confident right now. That is estrogen peaking.',
    tip: 'Your metabolism is slightly faster around ovulation. You might feel hungrier and that is completely normal.',
    tipIcon: 'scale',
  },
  {
    message: 'If you feel unusually sharp and articulate today, it is not random. It is your hormones.',
    tip: 'Stay hydrated. Estrogen peaks can cause slight water retention, and water actually helps reduce it.',
    tipIcon: 'drop',
  },
];

const lutealContent: DailyContent[] = [
  {
    message: 'Cravings might hit harder this week. That is progesterone, not a lack of willpower.',
    tip: 'Magnesium-rich foods like nuts, seeds, and dark chocolate can help with both cravings and mood.',
    tipIcon: 'sparkles',
  },
  {
    message: 'If your patience feels thinner than usual, progesterone is shifting your baseline. You are not overreacting.',
    tip: 'Reduce caffeine this week. It can amplify anxiety and disrupt sleep when progesterone is high.',
    tipIcon: 'moon',
  },
  {
    message: 'The second half of your cycle asks for more rest. Honour that instead of pushing through.',
    tip: 'Complex carbs like sweet potato, oats, or brown rice help your body produce serotonin. They are not the enemy.',
    tipIcon: 'leaf',
  },
  {
    message: 'If sleep feels harder to come by, that is common before your period. Your body temperature is slightly higher.',
    tip: 'Try a cooler room and avoid screens an hour before bed. Progesterone disrupts your normal sleep patterns.',
    tipIcon: 'moon',
  },
];

const unknownContent: DailyContent[] = [
  {
    message: 'We are still getting to know your cycle. Every log you add helps Thriya understand you better.',
    tip: 'Start by logging your mood and any symptoms. Even a few days of data helps build your pattern.',
    tipIcon: 'pencil',
  },
];

const contentMap: Record<CyclePhase, DailyContent[]> = {
  menstrual: menstrualContent,
  follicular: follicularContent,
  ovulatory: ovulatoryContent,
  luteal: lutealContent,
  unknown: unknownContent,
};

export function getDailyContent(phase: CyclePhase, dayOfCycle: number): DailyContent {
  const options = contentMap[phase];
  const index = dayOfCycle % options.length;
  return options[index];
}
