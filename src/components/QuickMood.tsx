import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';

const MOODS = [
  { key: 'calm', emoji: '\u{1F60C}' },
  { key: 'good', emoji: '\u{1F60A}' },
  { key: 'tired', emoji: '\u{1F634}' },
  { key: 'anxious', emoji: '\u{1F630}' },
  { key: 'low', emoji: '\u{1F614}' },
] as const;

interface QuickMoodProps {
  onLog: (mood: string) => void;
}

export function QuickMood({ onLog }: QuickMoodProps) {
  const [logged, setLogged] = useState<string | null>(null);

  const handleTap = (key: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLogged(key);
    onLog(key);
  };

  if (logged) {
    return (
      <View style={styles.container}>
        <View style={styles.loggedRow}>
          <Text style={styles.loggedEmoji}>
            {MOODS.find((m) => m.key === logged)?.emoji}
          </Text>
          <Text style={styles.loggedText}>Mood logged. You can add more details in the Log tab.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>How are you feeling?</Text>
      <View style={styles.row}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.key}
            style={styles.moodButton}
            onPress={() => handleTap(mood.key)}
            activeOpacity={0.6}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.primary,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  loggedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loggedEmoji: {
    fontSize: 28,
  },
  loggedText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
    lineHeight: 18,
  },
});
