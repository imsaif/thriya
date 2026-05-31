import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { H3, BodySm } from './Text';

interface InsightCardProps {
  title: string;
  value: string | null;
  subtitle: string;
  icon: React.ReactNode;
}

export function InsightCard({ title, value, subtitle, icon }: InsightCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>{icon}</View>
        <H3>{title}</H3>
      </View>
      {value ? (
        <Text style={styles.value}>{value}</Text>
      ) : (
        <BodySm>{subtitle}</BodySm>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Bespoke stat value — 28px sits between h1 (24) and displayLg (32); no role fits.
  value: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.primary,
    marginBottom: 4,
  },
});
