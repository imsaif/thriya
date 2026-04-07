import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
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
          <Text style={styles.heading}>{t.insights}</Text>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>{t.insightsEmptyTitle}</Text>
            <Text style={styles.emptyBody}>{t.insightsEmptyBody}</Text>
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
        <Text style={styles.heading}>{t.insights}</Text>

        <CycleRing
          dayOfCycle={cycle.dayOfCycle}
          cycleLength={averageCycleLength}
          phaseLabel={phaseLabels[cycle.phase]}
        />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{averageCycleLength}</Text>
            <Text style={styles.statLabel}>{t.cycleLength}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cycle.daysUntilNextPeriod ?? '?'}</Text>
            <Text style={styles.statLabel}>{t.daysUntilPeriod}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.topSymptoms}</Text>
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
          <Text style={styles.sectionTitle}>{t.moodPatterns}</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>{'\u{1F4A1}'}</Text>
            <Text style={styles.insightText}>
              You tend to feel more tired and anxious in the days before your period. This is common in the luteal phase.
            </Text>
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
  heading: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
    marginBottom: 20,
  },
  emptyContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sectionTitle,
    color: colors.primary,
    marginBottom: 8,
  },
  emptyBody: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.mutedText,
    lineHeight: 24,
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
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.micro,
    color: colors.mutedText,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sectionTitle,
    color: colors.primary,
    marginBottom: 10,
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
  insightText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.primary,
    lineHeight: 24,
  },
});
