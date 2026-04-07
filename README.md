# Thriya

AI-powered hormonal health companion for women with PCOS. React Native + Expo iOS app.

## Stack

- React Native + Expo SDK 54
- TypeScript (strict)
- React Navigation v6
- Supabase (auth + Postgres)
- Claude API (coach)
- Zustand (state)

## Setup

```bash
npm install
cp .env.example .env  # add your keys
npx expo start --ios
```

## Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_ANTHROPIC_API_KEY=
```

## Languages

English, Hindi, Telugu, Tamil — selected during onboarding, used across all screens and coach responses.
