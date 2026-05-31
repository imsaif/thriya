import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { Body } from './Text';

interface SelectionCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectionCard({ label, selected, onPress }: SelectionCardProps) {
  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Body color={selected ? colors.white : colors.primary}>
        {label}
      </Body>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  cardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
