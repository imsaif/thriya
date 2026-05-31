import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  HeartIcon,
  FireIcon,
  BoltIcon,
  MoonIcon,
  SparklesIcon,
  PencilSquareIcon,
  ScaleIcon,
  CakeIcon,
} from 'react-native-heroicons/outline';
import {
  SunIcon,
} from 'react-native-heroicons/solid';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { H1, H3, Body, BodySm, Label } from '../components/Text';
import { useUserStore } from '../store/userStore';
import { useCycleStore } from '../store/cycleStore';
import { useTranslation } from '../hooks/useTranslation';
import { getCycleContext } from '../services/cycle';
import { getDailyContent, type TipIcon } from '../constants/dailyContent';
import { MOODS } from '../constants/moods';
import type { MainTabParamList, RootStackParamList } from '../types';

function getTipIcon(icon: TipIcon, color: string) {
  const size = 16;
  const icons: Record<TipIcon, React.ReactNode> = {
    heart: <HeartIcon size={size} color={color} />,
    walking: <SunIcon size={size} color={color} />,
    fire: <FireIcon size={size} color={color} />,
    brain: <SparklesIcon size={size} color={color} />,
    bolt: <BoltIcon size={size} color={color} />,
    cake: <CakeIcon size={size} color={color} />,
    scale: <ScaleIcon size={size} color={color} />,
    drop: <HeartIcon size={size} color={color} />,
    sparkles: <SparklesIcon size={size} color={color} />,
    moon: <MoonIcon size={size} color={color} />,
    leaf: <HeartIcon size={size} color={color} />,
    pencil: <PencilSquareIcon size={size} color={color} />,
  };
  return icons[icon];
}

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
            <H1>
              {greeting}, {userName}
            </H1>
            <BodySm style={{ marginTop: 4 }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </BodySm>
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
          <Body color={colors.userBubbleText}>{daily.message}</Body>

          {cycle.phase !== 'unknown' && (
            <View style={styles.heroMeta}>
              <View style={styles.heroBadge}>
                <Label color={colors.userBubbleText}>
                  {t.day} {cycle.dayOfCycle}
                </Label>
              </View>
              {cycle.daysUntilNextPeriod !== null && cycle.daysUntilNextPeriod > 0 && (
                <BodySm color="rgba(255,255,255,0.6)">
                  {cycle.daysUntilNextPeriod} {t.daysUntilPeriod}
                </BodySm>
              )}
            </View>
          )}

          <View style={styles.heroDivider} />

          {moodLogged ? (
            <View style={styles.moodLoggedRow}>
              <View style={styles.moodLoggedIcon}>
                {MOODS.find((m) => m.key === moodLogged)?.icon(colors.white, 16)}
              </View>
              <Body color="rgba(255,255,255,0.7)">Mood logged</Body>
            </View>
          ) : (
            <View>
              <Body color="rgba(255,255,255,0.7)" style={{ marginBottom: 12 }}>
                How are you feeling?
              </Body>
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
                    <Label color="rgba(255,255,255,0.6)">{mood.label}</Label>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.tileRow}>
          <View style={styles.tile}>
            <View style={styles.tileIconCircle}>
              {getTipIcon(daily.tipIcon, colors.accent)}
            </View>
            <H3 style={{ marginBottom: 6 }}>Today's tip</H3>
            <BodySm numberOfLines={4}>{daily.tip}</BodySm>
          </View>

          <TouchableOpacity
            style={styles.tile}
            onPress={() => navigation.navigate('Coach')}
            activeOpacity={0.7}
          >
            <View style={styles.tileIconCircle}>
              <ChatBubbleLeftIcon size={16} color={colors.accent} />
            </View>
            <H3 style={{ marginBottom: 6 }}>{t.talkToCoach}</H3>
            <BodySm>{t.coachSubtitle}</BodySm>
          </TouchableOpacity>
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
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
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
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 16,
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
  tileRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  tileIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
});
