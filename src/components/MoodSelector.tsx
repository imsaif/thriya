import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { MOODS } from '../constants/moods';

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
            <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
              {mood.icon(isSelected ? colors.white : colors.primary, 20)}
            </View>
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
    paddingHorizontal: 6,
    borderRadius: 14,
    minWidth: 58,
  },
  itemSelected: {
    backgroundColor: colors.card,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconCircleSelected: {
    backgroundColor: colors.primary,
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
