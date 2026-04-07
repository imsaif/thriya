import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  FaceSmileIcon,
} from 'react-native-heroicons/outline';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { useTranslation } from '../hooks/useTranslation';
import { InsightCard } from '../components/InsightCard';

export function InsightsScreen() {
  const t = useTranslation();

  // MOCK: Simulated data from 2 weeks of logging
  const cycleLength = '30 days';
  const topSymptoms = 'Fatigue, Cramps, Brain fog';
  const moodPattern = 'Mood dips in luteal phase';
  const hasAnyData = cycleLength !== null || topSymptoms !== null || moodPattern !== null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{t.insights}</Text>
        <Text style={styles.subtitle}>{t.insightsSubtitle}</Text>

        {!hasAnyData ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>{t.insightsEmptyTitle}</Text>
            <Text style={styles.emptyBody}>{t.insightsEmptyBody}</Text>
          </View>
        ) : null}

        <InsightCard
          title={t.cycleLength}
          value={cycleLength}
          subtitle={t.cycleLengthEmpty}
          icon={<CalendarDaysIcon size={18} color={colors.primary} />}
        />

        <InsightCard
          title={t.topSymptoms}
          value={topSymptoms}
          subtitle={t.topSymptomsEmpty}
          icon={<ExclamationTriangleIcon size={18} color={colors.primary} />}
        />

        <InsightCard
          title={t.moodPatterns}
          value={moodPattern}
          subtitle={t.moodPatternsEmpty}
          icon={<FaceSmileIcon size={18} color={colors.primary} />}
        />
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
    paddingBottom: 32,
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
    marginTop: 4,
    marginBottom: 24,
  },
  emptyContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
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
});
