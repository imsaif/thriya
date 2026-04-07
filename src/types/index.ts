export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';

export type Mood = 'calm' | 'good' | 'tired' | 'anxious' | 'low';

export type SleepQuality = 'poor' | 'okay' | 'good' | 'great';

export type FoodPattern = 'light' | 'balanced' | 'heavier' | 'skipped';

export type Symptom =
  | 'cramps'
  | 'bloating'
  | 'headache'
  | 'fatigue'
  | 'acne'
  | 'cravings'
  | 'insomnia'
  | 'brain_fog'
  | 'mood_swings'
  | 'hair_loss';

export interface Profile {
  id: string;
  createdAt: string;
  onboardingReason: string | null;
  hardDaySymptoms: string[];
  foodRelationship: string | null;
  ageRange: number | null;
  cycleRegularity: string | null;
  tryingToConceive: string | null;
  onboardingComplete: boolean;
}

export interface DailyLog {
  id: string;
  userId: string;
  logDate: string;
  mood: Mood | null;
  sleepQuality: SleepQuality | null;
  foodPattern: FoodPattern | null;
  symptoms: Symptom[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type CoachLanguage = 'English' | 'Hindi' | 'Telugu' | 'Tamil';

export type RootStackParamList = {
  WelcomeName: undefined;
  Language: undefined;
  PinSetup: undefined;
  PinLock: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  Settings: undefined;
};

export type OnboardingStackParamList = {
  AboutYou: undefined;
  QuickInfo: undefined;
  CoachReady: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Log: undefined;
  Coach: undefined;
  Insights: undefined;
};
