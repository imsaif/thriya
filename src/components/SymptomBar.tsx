import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';

interface SymptomBarProps {
  label: string;
  count: number;
  maxCount: number;
}

export function SymptomBar({ label, count, maxCount }: SymptomBarProps) {
  const width = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${width}%` }]} />
      </View>
      <Text style={styles.count}>{count}x</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.primary,
    width: 90,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  count: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.small,
    color: colors.mutedText,
    width: 28,
    textAlign: 'right',
  },
});
