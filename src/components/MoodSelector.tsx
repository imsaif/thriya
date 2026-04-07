import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';

const MOODS = [
  { key: 'calm', label: 'Calm', emoji: '\u{1F60C}' },
  { key: 'good', label: 'Good', emoji: '\u{1F60A}' },
  { key: 'tired', label: 'Tired', emoji: '\u{1F634}' },
  { key: 'anxious', label: 'Anxious', emoji: '\u{1F630}' },
  { key: 'low', label: 'Low', emoji: '\u{1F614}' },
] as const;

interface MoodSelectorProps {
  selected: string | null;
  onSelect: (mood: string) => void;
}

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  const handlePress = (mood: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(mood);
  };

  return (
    <View style={styles.container}>
      {MOODS.map((mood) => {
        const isSelected = selected === mood.key;
        return (
          <TouchableOpacity
            key={mood.key}
            style={[styles.item, isSelected && styles.itemSelected]}
            onPress={() => handlePress(mood.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    minWidth: 58,
  },
  itemSelected: {
    backgroundColor: colors.card,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.micro,
    color: colors.mutedText,
  },
  labelSelected: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});
