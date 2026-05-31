import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { H3, Body, BodySm, Label } from './Text';
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
        <H3>{phaseLabels[cycle.phase]}</H3>
        {cycle.phase !== 'unknown' && (
          <View style={styles.dayBadge}>
            <Label color={colors.white}>{t.day} {cycle.dayOfCycle}</Label>
          </View>
        )}
      </View>

      <Body>{cycle.cardText}</Body>

      {cycle.daysUntilNextPeriod !== null && cycle.daysUntilNextPeriod > 0 && (
        <View style={styles.footer}>
          <BodySm>
            ~{cycle.daysUntilNextPeriod} {t.daysUntilPeriod}
          </BodySm>
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
  dayBadge: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  footer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
