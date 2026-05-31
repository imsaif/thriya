import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { Display, H1, H3, Body, Caption } from '../components/Text';
import { useTranslation } from '../hooks/useTranslation';
import { useCycleStore } from '../store/cycleStore';
import { getCycleContext } from '../services/cycle';
import { CycleRing } from '../components/CycleRing';
import { SymptomBar } from '../components/SymptomBar';

// MOCK: symptom data (will come from log history later)
const MOCK_SYMPTOMS = [
  { label: 'Fatigue', count: 9 },
  { label: 'Cramps', count: 7 },
  { label: 'Brain fog', count: 5 },
  { label: 'Bloating', count: 4 },
  { label: 'Cravings', count: 3 },
];

export function InsightsScreen() {
  const t = useTranslation();
  const lastPeriodStart = useCycleStore((s) => s.lastPeriodStart);
  const averageCycleLength = useCycleStore((s) => s.averageCycleLength);

  const cycle = useMemo(
    () => getCycleContext(lastPeriodStart, averageCycleLength),
    [lastPeriodStart, averageCycleLength]
  );

  const phaseLabels: Record<string, string> = {
    menstrual: t.menstrualPhase,
    follicular: t.follicularPhase,
    ovulatory: t.ovulatoryPhase,
    luteal: t.lutealPhase,
    unknown: t.gettingToKnowYou,
  };

  const maxSymptomCount = MOCK_SYMPTOMS[0].count;
  const hasData = cycle.phase !== 'unknown';

  if (!hasData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <H1 style={{ marginBottom: 20 }}>{t.insights}</H1>
          <View style={styles.emptyContainer}>
            <H3 style={{ marginBottom: 8 }}>{t.insightsEmptyTitle}</H3>
            <Body color={colors.mutedText}>{t.insightsEmptyBody}</Body>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <H1 style={{ marginBottom: 20 }}>{t.insights}</H1>

        <CycleRing
          dayOfCycle={cycle.dayOfCycle}
          cycleLength={averageCycleLength}
          phaseLabel={phaseLabels[cycle.phase]}
        />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Display>{averageCycleLength}</Display>
            <Caption align="center" style={{ marginTop: 4 }}>{t.cycleLength}</Caption>
          </View>
          <View style={styles.statCard}>
            <Display>{cycle.daysUntilNextPeriod ?? '?'}</Display>
            <Caption align="center" style={{ marginTop: 4 }}>{t.daysUntilPeriod}</Caption>
          </View>
        </View>

        <View style={styles.section}>
          <H3 style={{ marginBottom: 10 }}>{t.topSymptoms}</H3>
          <View style={styles.card}>
            {MOCK_SYMPTOMS.map((s) => (
              <SymptomBar
                key={s.label}
                label={s.label}
                count={s.count}
                maxCount={maxSymptomCount}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <H3 style={{ marginBottom: 10 }}>{t.moodPatterns}</H3>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>{'\u{1F4A1}'}</Text>
            <Body style={{ flex: 1 }}>
              You tend to feel more tired and anxious in the days before your period. This is common in the luteal phase.
            </Body>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  insightEmoji: {
    fontSize: 22,
    marginTop: 2,
  },
});
