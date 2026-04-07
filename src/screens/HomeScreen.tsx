import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  CheckBadgeIcon,
  LightBulbIcon,
} from 'react-native-heroicons/outline';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { useUserStore } from '../store/userStore';
import { useCycleStore } from '../store/cycleStore';
import { useTranslation } from '../hooks/useTranslation';
import { getCycleContext } from '../services/cycle';
import { getDailyContent } from '../constants/dailyContent';
import { MOODS } from '../constants/moods';
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
  const [moodLogged, setMoodLogged] = useState<string | null>(null);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  }, [t]);

  const lastPeriodStart = useCycleStore((s) => s.lastPeriodStart);
  const averageCycleLength = useCycleStore((s) => s.averageCycleLength);
  const cycle = useMemo(
    () => getCycleContext(lastPeriodStart, averageCycleLength),
    [lastPeriodStart, averageCycleLength]
  );

  const daily = useMemo(
    () => getDailyContent(cycle.phase, cycle.dayOfCycle),
    [cycle]
  );

  const streakDays = 5;

  const handleMood = (key: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMoodLogged(key);
  };

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

        <View style={styles.heroCard}>
          <Text style={styles.heroMessage}>{daily.message}</Text>

          {cycle.phase !== 'unknown' && (
            <View style={styles.heroMeta}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>
                  {t.day} {cycle.dayOfCycle}
                </Text>
              </View>
              {cycle.daysUntilNextPeriod !== null && cycle.daysUntilNextPeriod > 0 && (
                <Text style={styles.heroCountdown}>
                  {cycle.daysUntilNextPeriod} {t.daysUntilPeriod}
                </Text>
              )}
            </View>
          )}

          <View style={styles.heroDivider} />

          {moodLogged ? (
            <View style={styles.moodLoggedRow}>
              <View style={styles.moodLoggedIcon}>
                {MOODS.find((m) => m.key === moodLogged)?.icon(colors.white, 16)}
              </View>
              <Text style={styles.moodLoggedText}>Mood logged</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.moodPrompt}>How are you feeling?</Text>
              <View style={styles.moodRow}>
                {MOODS.map((mood) => (
                  <TouchableOpacity
                    key={mood.key}
                    style={styles.moodItem}
                    onPress={() => handleMood(mood.key)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.moodCircle}>
                      {mood.icon('rgba(255,255,255,0.9)', 18)}
                    </View>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <LightBulbIcon size={16} color={colors.accent} />
          </View>
          <Text style={styles.tipText}>{daily.tip}</Text>
        </View>

        <View style={styles.streakRow}>
          <CheckBadgeIcon size={16} color={colors.accent} />
          <Text style={styles.streakText}>{streakDays} day streak</Text>
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
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
  },
  heroMessage: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.userBubbleText,
    lineHeight: 24,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 10,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBadgeText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.micro,
    color: colors.userBubbleText,
  },
  heroCountdown: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.micro,
    color: 'rgba(255,255,255,0.6)',
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 16,
  },
  moodPrompt: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodItem: {
    alignItems: 'center',
  },
  moodCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  moodLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  moodLoggedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodLoggedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodLoggedText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: 'rgba(255,255,255,0.7)',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.primary,
    lineHeight: 20,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  streakText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
  },
});
