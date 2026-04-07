import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { MOODS } from '../constants/moods';

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
    const mood = MOODS.find((m) => m.key === logged);
    return (
      <View style={styles.container}>
        <View style={styles.loggedRow}>
          <View style={styles.loggedIcon}>
            {mood?.icon(colors.primary, 22)}
          </View>
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
            {mood.icon(colors.primary, 22)}
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
  loggedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loggedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loggedText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
    lineHeight: 18,
  },
});
