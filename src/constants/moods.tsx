import React from 'react';
import {
  SparklesIcon,
  SunIcon,
  MoonIcon,
  BoltIcon,
  CloudIcon,
} from 'react-native-heroicons/outline';

export interface MoodOption {
  key: string;
  label: string;
  icon: (color: string, size: number) => React.ReactNode;
}

export const MOODS: MoodOption[] = [
  {
    key: 'calm',
    label: 'Calm',
    icon: (color, size) => <SparklesIcon size={size} color={color} />,
  },
  {
    key: 'good',
    label: 'Good',
    icon: (color, size) => <SunIcon size={size} color={color} />,
  },
  {
    key: 'tired',
    label: 'Tired',
    icon: (color, size) => <MoonIcon size={size} color={color} />,
  },
  {
    key: 'anxious',
    label: 'Anxious',
    icon: (color, size) => <BoltIcon size={size} color={color} />,
  },
  {
    key: 'low',
    label: 'Low',
    icon: (color, size) => <CloudIcon size={size} color={color} />,
  },
];
