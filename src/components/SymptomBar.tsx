import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { BodySm, Label } from './Text';

interface SymptomBarProps {
  label: string;
  count: number;
  maxCount: number;
}

export function SymptomBar({ label, count, maxCount }: SymptomBarProps) {
  const width = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <View style={styles.row}>
      <BodySm color={colors.primary} style={{ width: 90 }}>{label}</BodySm>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${width}%` }]} />
      </View>
      <Label align="right" style={{ width: 28 }}>{count}x</Label>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
});
