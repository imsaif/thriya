import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Caption } from './Text';

interface MoodDay {
  label: string;
  emoji: string;
}

interface MoodTrendProps {
  days: MoodDay[];
}

export function MoodTrend({ days }: MoodTrendProps) {
  return (
    <View style={styles.container}>
      {days.map((day, i) => (
        <View key={i} style={styles.item}>
          <Text style={styles.emoji}>{day.emoji}</Text>
          <Caption>{day.label}</Caption>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 4,
  },
});
