import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PencilSquareIcon,
  ChatBubbleLeftIcon,
} from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/colors';
import { fonts, fontSizes } from '../constants/typography';
import { useUserStore } from '../store/userStore';
import { getCycleContext } from '../services/cycle';
import { CycleCard } from '../components/CycleCard';
import { PromptCard } from '../components/PromptCard';
import type { MainTabParamList } from '../types';

type NavProp = BottomTabNavigationProp<MainTabParamList>;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen() {
  const userName = useUserStore((s) => s.userName);
  const navigation = useNavigation<NavProp>();

  // TODO: Replace with real cycle data from store once logging is built
  const cycle = useMemo(() => getCycleContext(null), []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>
          {getGreeting()}, {userName}
        </Text>
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
          <Text style={styles.sectionTitle}>Today</Text>
          <PromptCard
            title="Log how you feel"
            subtitle="Track mood, sleep, and symptoms"
            icon={<PencilSquareIcon size={20} color={colors.primary} />}
            onPress={() => navigation.navigate('Log')}
          />
          <PromptCard
            title="Talk to your coach"
            subtitle="Ask anything about PCOS"
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
