import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { Label } from './Text';

interface OptionRowProps {
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export function OptionRow({ options, selected, onSelect }: OptionRowProps) {
  const handlePress = (value: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => handlePress(option)}
            activeOpacity={0.7}
          >
            <Label color={isSelected ? colors.white : colors.primary}>
              {option}
            </Label>
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
  option: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
