import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { Body } from './Text';

interface ChipSelectProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export function ChipSelect({ options, selected, onToggle }: ChipSelectProps) {
  const handlePress = (option: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(option);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <TouchableOpacity
            key={option}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => handlePress(option)}
            activeOpacity={0.7}
          >
            <Body color={isSelected ? colors.white : colors.primary}>
              {option}
            </Body>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
