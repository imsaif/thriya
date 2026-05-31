import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { H1, H3, Body, BodySm } from '../components/Text';
import { useUserStore } from '../store/userStore';
import type { RootStackParamList, CoachLanguage } from '../types';

const LANGUAGES: { key: CoachLanguage; label: string; native: string }[] = [
  { key: 'English', label: 'English', native: 'English' },
  { key: 'Hindi', label: 'Hindi', native: '\u0939\u093F\u0928\u094D\u0926\u0940' },
  { key: 'Telugu', label: 'Telugu', native: '\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41' },
  { key: 'Tamil', label: 'Tamil', native: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const userName = useUserStore((s) => s.userName);
  const coachLanguage = useUserStore((s) => s.coachLanguage);
  const setCoachLanguage = useUserStore((s) => s.setCoachLanguage);
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.6}>
        <ChevronLeftIcon size={20} color={colors.primary} />
        <Body>Back</Body>
      </TouchableOpacity>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <H1 style={{ marginBottom: 24 }}>Settings</H1>

        <View style={styles.profileSection}>
          <H3>{userName}</H3>
        </View>

        <H3 style={{ marginBottom: 4 }}>Coach language</H3>
        <BodySm style={{ marginBottom: 16 }}>
          Your coach will respond in this language
        </BodySm>

        {LANGUAGES.map((lang) => {
          const isSelected = coachLanguage === lang.key;
          return (
            <TouchableOpacity
              key={lang.key}
              style={[styles.langOption, isSelected && styles.langOptionSelected]}
              onPress={() => setCoachLanguage(lang.key)}
              activeOpacity={0.7}
            >
              <View>
                <H3 color={isSelected ? colors.white : colors.primary}>
                  {lang.label}
                </H3>
                <BodySm
                  color={isSelected ? colors.userBubbleText : colors.mutedText}
                  style={{ marginTop: 2 }}
                >
                  {lang.native}
                </BodySm>
              </View>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>{'\u2713'}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.redoButton}
          onPress={() => {
            setOnboardingComplete(false);
          }}
          activeOpacity={0.7}
        >
          <Body color={colors.mutedText}>Redo onboarding</Body>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileSection: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 32,
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  langOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  redoButton: {
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
});
