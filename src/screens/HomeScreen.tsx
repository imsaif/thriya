import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
} from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { useUserStore } from '../store/userStore';
import { useTranslation } from '../hooks/useTranslation';
import { getCycleContext } from '../services/cycle';
import { getDailyContent } from '../constants/dailyContent';
import { QuickMood } from '../components/QuickMood';
import { PromptCard } from '../components/PromptCard';
import type { MainTabParamList, RootStackParamList } from '../types';

type NavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function HomeScreen() {
  const userName = useUserStore((s) => s.userName);
  const navigation = useNavigation<NavProp>();
  const t = useTranslation();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  }, [t]);

  // MOCK: Simulate period started 22 days ago
  const cycle = useMemo(() => {
    const mockPeriodStart = new Date();
    mockPeriodStart.setDate(mockPeriodStart.getDate() - 22);
    return getCycleContext(mockPeriodStart, 30);
  }, []);

  const daily = useMemo(
    () => getDailyContent(cycle.phase, cycle.dayOfCycle),
    [cycle]
  );

  // MOCK: logging streak
  const streakDays = 5;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>
              {greeting}, {userName}
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Cog6ToothIcon size={24} color={colors.mutedText} />
          </TouchableOpacity>
        </View>

        <View style={styles.dailyCard}>
          <Text style={styles.dailyMessage}>{daily.message}</Text>
          {cycle.phase !== 'unknown' && (
            <View style={styles.phaseRow}>
              <View style={styles.phaseBadge}>
                <Text style={styles.phaseBadgeText}>
                  {t.day} {cycle.dayOfCycle}
                </Text>
              </View>
              {cycle.daysUntilNextPeriod !== null && cycle.daysUntilNextPeriod > 0 && (
                <Text style={styles.periodCountdown}>
                  {cycle.daysUntilNextPeriod} {t.daysUntilPeriod}
                </Text>
              )}
            </View>
          )}
        </View>

        <QuickMood onLog={() => {}} />

        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>Tip for today</Text>
          <Text style={styles.tipText}>{daily.tip}</Text>
        </View>

        <View style={styles.streakRow}>
          <Text style={styles.streakEmoji}>{'\u{1F525}'}</Text>
          <Text style={styles.streakText}>
            {streakDays} day logging streak
          </Text>
        </View>

        <PromptCard
          title={t.talkToCoach}
          subtitle={t.coachSubtitle}
          icon={<ChatBubbleLeftIcon size={20} color={colors.primary} />}
          onPress={() => navigation.navigate('Coach')}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
    marginTop: 4,
  },
  dailyCard: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
  },
  dailyMessage: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.userBubbleText,
    lineHeight: 24,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  phaseBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  phaseBadgeText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.micro,
    color: colors.userBubbleText,
  },
  periodCountdown: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.micro,
    color: 'rgba(255,255,255,0.7)',
  },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  tipLabel: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.small,
    color: colors.accent,
    marginBottom: 6,
  },
  tipText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.primary,
    lineHeight: 24,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  streakEmoji: {
    fontSize: 18,
  },
  streakText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
  },
});
