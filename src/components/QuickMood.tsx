import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { H3, BodySm, Caption } from './Text';
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
          <BodySm style={{ flex: 1 }}>Mood logged. You can add more details in the Log tab.</BodySm>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <H3 style={{ marginBottom: 14 }}>How are you feeling?</H3>
      <View style={styles.row}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.key}
            style={styles.moodItem}
            onPress={() => handleTap(mood.key)}
            activeOpacity={0.6}
          >
            <View style={styles.moodButton}>
              {mood.icon(colors.primary, 22)}
            </View>
            <Caption>{mood.label}</Caption>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodItem: {
    alignItems: 'center',
  },
  moodButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
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
});
