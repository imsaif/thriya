import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PencilSquareIcon,
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
import { CycleCard } from '../components/CycleCard';
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

  // MOCK: Simulate period started 22 days ago (luteal phase)
  const cycle = useMemo(() => {
    const mockPeriodStart = new Date();
    mockPeriodStart.setDate(mockPeriodStart.getDate() - 22);
    return getCycleContext(mockPeriodStart, 30);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>
            {greeting}, {userName}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Cog6ToothIcon size={24} color={colors.mutedText} />
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <View style={styles.section}>
          <CycleCard cycle={cycle} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.today}</Text>
          <PromptCard
            title={t.logHowYouFeel}
            subtitle={t.logSubtitle}
            icon={<PencilSquareIcon size={20} color={colors.primary} />}
            onPress={() => navigation.navigate('Log')}
          />
          <PromptCard
            title={t.talkToCoach}
            subtitle={t.coachSubtitle}
            icon={<ChatBubbleLeftIcon size={20} color={colors.primary} />}
            onPress={() => navigation.navigate('Coach')}
          />
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
    alignItems: 'center',
  },
  greeting: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.appTitle,
    color: colors.primary,
    flex: 1,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.mutedText,
    marginTop: 4,
    marginBottom: 24,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sectionTitle,
    color: colors.primary,
    marginBottom: 12,
  },
});
