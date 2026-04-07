import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { useTranslation } from '../hooks/useTranslation';
import type { CycleContext } from '../services/cycle';

interface CycleCardProps {
  cycle: CycleContext;
}

export function CycleCard({ cycle }: CycleCardProps) {
  const t = useTranslation();

  const phaseLabels: Record<string, string> = {
    menstrual: t.menstrualPhase,
    follicular: t.follicularPhase,
    ovulatory: t.ovulatoryPhase,
    luteal: t.lutealPhase,
    unknown: t.gettingToKnowYou,
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.phaseLabel}>{phaseLabels[cycle.phase]}</Text>
        {cycle.phase !== 'unknown' && (
          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>{t.day} {cycle.dayOfCycle}</Text>
          </View>
        )}
      </View>

      <Text style={styles.message}>{cycle.cardText}</Text>

      {cycle.daysUntilNextPeriod !== null && cycle.daysUntilNextPeriod > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ~{cycle.daysUntilNextPeriod} {t.daysUntilPeriod}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseLabel: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sectionTitle,
    color: colors.primary,
  },
  dayBadge: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dayText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.primary,
    lineHeight: 24,
  },
  footer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
  },
});
