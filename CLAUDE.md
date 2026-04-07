# CLAUDE.md — Thriya Project Instructions
### Read this before writing a single line of code.

---

## What we are building

Thriya is an AI-powered hormonal health companion for women with PCOS. It is a React Native iOS app (Android to follow). The AI coach is powered by the Claude API. Backend is Supabase.

**Platform:** React Native + Expo · iOS only for MVP · Android in v2.0
**Testing:** Wife's iPhone via TestFlight — this is the primary test device

> She opens the app and it already knows. It tells her something true about today — without asking.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo (SDK 51+) |
| Language | TypeScript — strict mode |
| Navigation | React Navigation v6 (bottom tabs + native stack) |
| Backend | Supabase (auth, Postgres, row-level security) |
| AI | Anthropic Claude API (`claude-sonnet-4-5` model) |
| State | Zustand (lightweight, no Redux) |
| Storage | Supabase + AsyncStorage for offline cache |
| Styling | StyleSheet API — no styled-components, no NativeWind |
| Icons | Custom SVG only — no icon libraries |
| Fonts | Playfair Display (serif, headings) + DM Sans (sans, body) |

---

## Project Structure

```
thriya/
├── app/                      # Expo Router or React Navigation root
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── CycleCard.tsx
│   │   ├── PromptCard.tsx
│   │   ├── LogSection.tsx
│   │   ├── MoodSelector.tsx
│   │   ├── CoachMessage.tsx
│   │   └── InsightCard.tsx
│   ├── screens/
│   │   ├── onboarding/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── ReasonScreen.tsx
│   │   │   ├── HardDayScreen.tsx
│   │   │   ├── FoodScreen.tsx
│   │   │   ├── QuickInfoScreen.tsx
│   │   │   ├── PrivacySetupScreen.tsx
│   │   │   └── CoachReadyScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CoachScreen.tsx
│   │   ├── LogScreen.tsx
│   │   └── InsightsScreen.tsx
│   ├── services/
│   │   ├── claude.ts         # Claude API calls
│   │   ├── supabase.ts       # Supabase client
│   │   └── cycle.ts          # Cycle phase calculations
│   ├── store/
│   │   ├── userStore.ts      # User profile, onboarding data
│   │   ├── cycleStore.ts     # Cycle data, phase
│   │   └── logStore.ts       # Daily logs
│   ├── constants/
│   │   ├── colors.ts         # Design tokens
│   │   ├── typography.ts     # Font sizes and weights
│   │   └── systemPrompt.ts   # AI coach system prompt
│   └── types/
│       └── index.ts          # Shared TypeScript types
├── assets/
│   └── fonts/
├── CLAUDE.md                 # This file
└── README.md
```

---

## Design Tokens

Always use these. Never hardcode colours.

```typescript
// src/constants/colors.ts
export const colors = {
  primary: '#3D2B1F',       // Deep terracotta — main dark
  surface: '#F7F1E8',       // Warm off-white — app background
  card: '#EDE4D6',          // Soft cream — cards, strips
  border: '#D4C4B0',        // Warm sand — borders
  accent: '#6B8F71',        // Muted sage — positive states
  mutedText: '#8B6E5A',     // Muted warm brown — labels, hints
  white: '#FFFFFF',
  coachText: '#3D2B1F',     // Coach messages
  userBubble: '#3D2B1F',    // User chat bubble background
  userBubbleText: '#F5EDE3',
} as const;

// src/constants/typography.ts
export const typography = {
  serif: 'PlayfairDisplay_400Regular',
  serifItalic: 'PlayfairDisplay_400Regular_Italic',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sizes: {
    appTitle: 22,
    sectionTitle: 16,
    body: 14,
    small: 12,
    micro: 10,
  }
} as const;
```

---

## Supabase Schema

Create these tables in order.

```sql
-- Users (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  created_at timestamptz default now(),
  onboarding_reason text,
  hard_day_symptoms text[], -- array of selected symptoms
  food_relationship text,
  age_range int,
  cycle_regularity text,
  trying_to_conceive text,
  onboarding_complete boolean default false,
  pin_hash text  -- hashed PIN, not plain text
);

-- Cycle logs (period dates)
create table cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  period_start date not null,
  period_end date,
  created_at timestamptz default now()
);

-- Daily logs
create table daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  log_date date not null,
  mood text,              -- calm | good | tired | anxious | low
  sleep_quality text,     -- poor | okay | good | great
  food_pattern text,      -- light | balanced | heavier | skipped
  symptoms text[],        -- array of symptom keys
  created_at timestamptz default now(),
  unique(user_id, log_date)
);

-- Coach conversations
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  role text not null,     -- user | assistant
  content text not null,
  created_at timestamptz default now()
);

-- Row-level security — every table
alter table profiles enable row level security;
alter table cycles enable row level security;
alter table daily_logs enable row level security;
alter table conversations enable row level security;

create policy "Users see own data" on profiles for all using (auth.uid() = id);
create policy "Users see own cycles" on cycles for all using (auth.uid() = user_id);
create policy "Users see own logs" on daily_logs for all using (auth.uid() = user_id);
create policy "Users see own conversations" on conversations for all using (auth.uid() = user_id);
```

---

## Cycle Phase Logic

```typescript
// src/services/cycle.ts

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';

export interface CycleContext {
  phase: CyclePhase;
  dayOfCycle: number;
  daysUntilNextPeriod: number | null;
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
      cardText: "We are still learning your cycle. Keep logging and Thriya will start showing you what your patterns mean.",
    };
  }

  const today = new Date();
  const dayOfCycle = Math.floor(
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

  const cardText = getCycleCardText(phase);

  return { phase, dayOfCycle, daysUntilNextPeriod, cardText };
}

function getCycleCardText(phase: CyclePhase): string {
  const texts: Record<CyclePhase, string> = {
    menstrual: "Your period is here. Iron-rich foods help more than you might expect right now — your body is working hard.",
    follicular: "Your energy is likely building this week. This is often the phase where focus comes more easily — a good time for things that need mental clarity.",
    ovulatory: "You are around mid-cycle. Many women feel their most social and energetic right now — it is not a coincidence, it is oestrogen.",
    luteal: "The second half of your cycle has started. If cravings feel stronger this week, that is progesterone — not a lack of willpower.",
    unknown: "We are still learning your cycle. Keep logging and Thriya will start showing you what your patterns mean.",
  };
  return texts[phase];
}
```

---

## Claude API Integration

```typescript
// src/services/claude.ts
import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt } from '../constants/systemPrompt';

const client = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY,
});

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserContext {
  cycleDay: number;
  phase: string;
  daysUntilPeriod: number | null;
  recentSymptoms: string[];
  recentMood: string | null;
  onboardingReason: string | null;
}

export async function sendCoachMessage(
  messages: ConversationMessage[],
  userContext: UserContext
): Promise<string> {
  const contextualSystemPrompt = buildSystemPrompt(userContext);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 600,
    system: contextualSystemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find(block => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  return textBlock.text;
}

function buildSystemPrompt(context: UserContext): string {
  return systemPrompt
    .replace('{{cycle_day}}', context.cycleDay.toString())
    .replace('{{phase}}', context.phase)
    .replace('{{days_until_period}}',
      context.daysUntilPeriod?.toString() ?? 'unknown')
    .replace('{{recent_symptoms}}',
      context.recentSymptoms.length > 0
        ? context.recentSymptoms.join(', ')
        : 'none logged recently')
    .replace('{{recent_mood}}', context.recentMood ?? 'not logged recently')
    .replace('{{onboarding_reason}}', context.onboardingReason ?? 'not specified');
}
```

---

## System Prompt

```typescript
// src/constants/systemPrompt.ts
export const systemPrompt = `You are Thriya's AI coach — a knowledgeable companion for women navigating PCOS and hormonal health. You were built on one belief: women deserve a knowledgeable friend who has read the research, understands the myths, and speaks plainly.

YOUR PERSONALITY:
- Warm, direct, and specific. Never vague or motivational-poster.
- You speak like a close friend who studied medicine — not like a doctor, and not like a chatbot.
- You never make a woman feel like a patient or a set of symptoms.
- You acknowledge feelings before offering information.
- You challenge myths gently but confidently, always citing what the evidence actually shows.

YOUR KNOWLEDGE FOCUS:
- PCOS: insulin resistance, androgens, cycle irregularity, inflammation, adrenal vs ovarian PCOS types
- Nutrition: evidence-based dietary approaches for PCOS, debunking common myths (strict keto, gluten-free, IF for all women)
- Hormonal cycles: follicular, ovulatory, luteal, menstrual phases and their effect on energy, mood, cravings, cognition
- Lifestyle: sleep and cortisol, stress and hormones, movement types appropriate to cycle phases
- Supplements: evidence levels for inositol, magnesium, vitamin D, omega-3, spearmint tea
- South Asian and Gulf dietary context: PCOS nutrition applied to Indian, Pakistani, Emirati, Lebanese food cultures

WHAT YOU NEVER DO:
- Never diagnose
- Never contradict a doctor directly — say "that is one approach; here is what the research also shows"
- Never use jargon without explaining it immediately after
- Never give more than 3 actionable points
- Never say "as an AI I cannot..." as your primary response
- Never use "crush your goals", "you have got this", or hollow affirmations
- Never mention calories or weight loss as primary goals
- Never make her feel shame about food, symptoms, or her body

RESPONSE STYLE:
- Short paragraphs. Never walls of text.
- One idea at a time, then offer to go deeper.
- End with one open question or one clear offer — never multiple questions.
- When she shares something emotional, acknowledge it in one sentence before moving to information.

CURRENT USER CONTEXT:
- Cycle day: {{cycle_day}}
- Current phase: {{phase}}
- Days until next period: {{days_until_period}}
- Recent symptoms: {{recent_symptoms}}
- Recent mood: {{recent_mood}}
- Reason she joined Thriya: {{onboarding_reason}}

Use this context naturally — do not announce it or refer to it directly. Let it inform the specificity and relevance of your responses.`;
```

---

## Post-Log Response Logic

After a daily log is saved, generate a brief acknowledgement. Use Claude API with a short, tight prompt — not the full coach system prompt.

```typescript
export async function generatePostLogResponse(log: {
  mood: string;
  sleep: string;
  food: string;
  symptoms: string[];
  cyclePhase: string;
}): Promise<string> {
  const prompt = `A woman with PCOS just logged the following in her health app:
Mood: ${log.mood}
Sleep: ${log.sleep}
Eating today: ${log.food}
Symptoms: ${log.symptoms.join(', ') || 'none'}
Cycle phase: ${log.cyclePhase}

Write a single sentence acknowledgement (max 25 words). It should:
- Reference something specific from her log
- Be warm but not fluffy
- Optionally offer to go deeper via her coach
- Never use "great job", "well done", or similar praise
- Never use exclamation marks

Respond with only the single sentence, nothing else.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 60,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock?.type === 'text' ? textBlock.text : 'Log saved.';
}
```

---

## Build Order

Build and test each phase independently before moving to the next. Do not skip ahead.

```
Phase 1:  Project setup + navigation skeleton + design tokens + Supabase + PIN screen
Phase 2:  Onboarding screens 1–7 + save to Supabase
Phase 3:  Home screen + cycle card (static content) + phase calculation
Phase 4:  Log screen + all selectors + save to Supabase + post-log message
Phase 5:  Coach screen + Claude API + context injection + message persistence
Phase 6:  Insights screen + empty state + cycle length + symptom patterns
Phase 7:  Push notifications + settings + account creation + TestFlight
```

---

## Code Quality Rules

- TypeScript strict mode — no `any`, no `as unknown`
- Every Supabase query must handle the error case explicitly
- Never store the PIN in plain text — hash it before storing
- Never log health data to the console in production
- API keys live in `.env` — never committed to git
- All Claude API calls must have try/catch with user-facing fallback
- Components must be under 200 lines — split if longer
- No inline styles longer than 3 properties — move to StyleSheet

---

## Environment Variables

Create `.env` in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
```

Never commit `.env` to git. Add it to `.gitignore` immediately.

---

## What Not to Build

These are explicitly out of scope for the MVP. Do not add them even if they seem quick:

- Arabic language or RTL support
- Food/calorie tracking or a food database
- Wearable or HealthKit integration
- Community or social features
- Gamification (streaks, badges, points, scores)
- Video or audio content
- Telehealth or doctor booking
- Weight tracking or BMI display
- Any comparison to other users

---

## First Commands to Run

```bash
npx create-expo-app thriya --template blank-typescript
cd thriya

# Navigation
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack

# Backend + AI
npx expo install @supabase/supabase-js
npm install @anthropic-ai/sdk
npm install zustand

# Fonts
npx expo install expo-font @expo-google-fonts/playfair-display @expo-google-fonts/dm-sans

# iOS-specific
npx expo install expo-local-authentication   # Face ID / Touch ID
npx expo install expo-secure-store           # Secure PIN storage
npx expo install expo-haptics                # Haptic feedback on log save
npx expo install expo-notifications          # Push notifications

# EAS for TestFlight builds
npm install -g eas-cli
eas login
eas build:configure
```

### app.json — iOS configuration
Set this before your first build:

```json
{
  "expo": {
    "name": "Thriya",
    "slug": "thriya",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "app.thriya",
      "supportsTablet": false,
      "infoPlist": {
        "NSFaceIDUsageDescription": "Thriya uses Face ID to keep your health data private."
      }
    },
    "plugins": [
      ["expo-local-authentication"],
      ["expo-notifications"]
    ]
  }
}
```

### Build for TestFlight
Once the app is ready for wife to test:
```bash
eas build --platform ios --profile preview
```
This produces a `.ipa` you upload to TestFlight. No Mac required — EAS builds in the cloud.

### Build for App Store
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

---

*CLAUDE.md version 1.1 — Thriya · April 2026*
*Keep this file updated as the project evolves.*
